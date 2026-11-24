// Publicador automático: chamado a cada 15 min pelo cron-job.org.
// 1. Confere posts que já foram enviados e estavam sendo processados (vídeos).
// 2. Envia os posts aprovados cujo horário chegou.
// Nada é publicado sem status "aprovado", que só a Isa marca no painel.

import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { containerStatus, createContainer, instagramImageUrl, publishContainer, type PostFormat, type PostMedia } from '../../../../lib/instagram'
import { notify, type PushPayload } from '../../../../lib/push'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
  perspective: 'published',
})

type Doc = {
  _id: string
  format: PostFormat
  scheduledAt?: string
  caption?: string
  containerId?: string
  sentAt?: string
  media?: { _type: 'image' | 'file'; url?: string }[]
  coverUrl?: string
}

// Vídeo que não termina de processar em 1 hora vira erro
const PROCESSING_LIMIT_MS = 60 * 60 * 1000
// Post parado em "Para aprovar" ganha um lembrete por dia
const REMINDER_MS = 24 * 60 * 60 * 1000

const FORMAT_NAMES: Record<string, string> = { reel: 'Reel', carrossel: 'Carrossel', foto: 'Foto', story: 'Story' }
const describe = (doc: Pick<Doc, 'format' | 'scheduledAt' | 'caption'>) => {
  const when = doc.scheduledAt
    ? new Date(doc.scheduledAt).toLocaleString('pt-BR', {
        timeZone: 'America/Sao_Paulo',
        weekday: 'short',
        day: '2-digit',
        month: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
      })
    : 'sem data'
  const line = doc.caption?.split('\n')[0]?.slice(0, 80)
  return `${FORMAT_NAMES[doc.format] ?? 'Post'} · ${when}${line ? `\n${line}` : ''}`
}

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET
  if (!secret || request.headers.get('authorization') !== `Bearer ${secret}`) {
    return NextResponse.json({ error: 'não autorizado' }, { status: 401 })
  }

  const report: { id: string; result: string }[] = []
  const fail = async (id: string, err: unknown) => {
    const message = err instanceof Error ? err.message : String(err)
    await sanity.patch(id).set({ status: 'erro', error: message }).commit()
    report.push({ id, result: `erro: ${message}` })
    await notify(sanity, { title: 'Erro ao publicar', body: message.slice(0, 140), tag: `erro-${id}` }, 'admins')
  }
  const done = async (id: string, containerId: string) => {
    const { mediaId, permalink } = await publishContainer(containerId)
    await sanity
      .patch(id)
      .set({ status: 'publicado', publishedAt: new Date().toISOString(), mediaId, ...(permalink ? { permalink } : {}) })
      .unset(['error'])
      .commit()
    report.push({ id, result: `publicado ${permalink ?? mediaId}` })
    await notify(sanity, { title: 'Post publicado ✓', body: 'Já está no Instagram.', url: permalink, tag: `ok-${id}` }, 'admins')
  }

  // 0. Avisa no celular sobre posts novos para aprovar e lembra dos parados há 1 dia.
  // Tudo protegido: um erro aqui nunca pode impedir a publicação logo abaixo.
  try {
    const waiting = await sanity.fetch<(Doc & { notifiedAt?: string; remindedAt?: string })[]>(
      `*[_type == "instagramPost" && status == "aguardando"] | order(scheduledAt asc){ _id, format, scheduledAt, caption, notifiedAt, remindedAt }`
    )
    const fresh = waiting.filter((d) => !d.notifiedAt)
    const stale = waiting.filter((d) => {
      const last = d.remindedAt ?? d.notifiedAt
      return d.notifiedAt && last && Date.now() - Date.parse(last) > REMINDER_MS
    })
    const avisar = async (docs: typeof waiting, field: 'notifiedAt' | 'remindedAt', id: string, payload: PushPayload) => {
      const { sent, error } = await notify(sanity, payload)
      if (error) {
        // Não marca como avisado: tenta de novo na próxima chamada
        report.push({ id, result: `notificação não enviada: ${error}` })
        return
      }
      const now = new Date().toISOString()
      for (const d of docs) await sanity.patch(d._id).set({ [field]: now }).commit()
      report.push({ id, result: `${docs.length} post(s), ${sent} aparelho(s) avisado(s)` })
    }
    if (fresh.length > 0) {
      await avisar(
        fresh,
        'notifiedAt',
        'notificacoes',
        fresh.length === 1
          ? { title: 'Novo post para aprovar', body: describe(fresh[0]), tag: 'aprovar' }
          : { title: `${fresh.length} posts novos para aprovar`, body: fresh.map((d) => describe(d).split('\n')[0]).join('\n'), tag: 'aprovar' }
      )
    }
    if (stale.length > 0) {
      await avisar(stale, 'remindedAt', 'lembrete', {
        title: 'Lembrete do Painel',
        body: stale.length === 1 ? `1 post esperando sua aprovação\n${describe(stale[0])}` : `${stale.length} posts esperando sua aprovação`,
        tag: 'aprovar',
      })
    }
  } catch (err) {
    report.push({ id: 'notificacoes', result: `erro: ${err instanceof Error ? err.message : String(err)}` })
  }

  // 1. Posts em processamento
  const processing = await sanity.fetch<Doc[]>(
    `*[_type == "instagramPost" && status == "publicando" && defined(containerId)]{ _id, format, containerId, sentAt }`
  )
  for (const doc of processing) {
    try {
      const { status_code, status } = await containerStatus(doc.containerId!)
      if (status_code === 'FINISHED') await done(doc._id, doc.containerId!)
      else if (status_code === 'ERROR' || status_code === 'EXPIRED') await fail(doc._id, new Error(`Mídia recusada pelo Instagram: ${status ?? status_code}`))
      else if (doc.sentAt && Date.now() - Date.parse(doc.sentAt) > PROCESSING_LIMIT_MS)
        await fail(doc._id, new Error('O Instagram não terminou de processar o vídeo em 1 hora'))
      else report.push({ id: doc._id, result: 'ainda processando' })
    } catch (err) {
      await fail(doc._id, err)
    }
  }

  // 2. Aprovados com horário vencido (ou sem horário: sai assim que aprovado)
  const due = await sanity.fetch<Doc[]>(
    `*[_type == "instagramPost" && status == "aprovado" && (!defined(scheduledAt) || dateTime(scheduledAt) <= dateTime(now()))]
      | order(scheduledAt asc)[0...3]{
        _id, format, caption,
        media[]{ _type, "url": asset->url },
        "coverUrl": cover.asset->url
      }`
  )
  for (const doc of due) {
    // Marca antes de enviar para nunca publicar duas vezes: se outra chamada pegou o post antes, pula
    try {
      const current = await sanity.getDocument(doc._id)
      if (!current || current.status !== 'aprovado') continue
      await sanity
        .patch(doc._id)
        .ifRevisionId(current._rev)
        .set({ status: 'publicando', sentAt: new Date().toISOString() })
        .unset(['error', 'containerId'])
        .commit()
    } catch {
      report.push({ id: doc._id, result: 'já estava sendo enviado por outra chamada' })
      continue
    }
    try {
      const media: PostMedia[] = (doc.media ?? [])
        .filter((m) => m.url)
        .map((m) => (m._type === 'image' ? { type: 'image', url: instagramImageUrl(m.url!) } : { type: 'video', url: m.url! }))
      const containerId = await createContainer(
        doc.format,
        media,
        doc.caption ?? '',
        doc.coverUrl ? instagramImageUrl(doc.coverUrl) : undefined
      )
      await sanity.patch(doc._id).set({ containerId }).commit()
      const { status_code } = await containerStatus(containerId)
      if (status_code === 'FINISHED') await done(doc._id, containerId)
      else report.push({ id: doc._id, result: 'enviado, processando o vídeo' })
    } catch (err) {
      await fail(doc._id, err)
    }
  }

  return NextResponse.json({ checked: processing.length + due.length, report })
}
