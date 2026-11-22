// Publicador automático: chamado a cada 15 min pelo cron-job.org.
// 1. Confere posts que já foram enviados e estavam sendo processados (vídeos).
// 2. Envia os posts aprovados cujo horário chegou.
// Nada é publicado sem status "aprovado", que só a Isa marca no painel.

import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'
import { containerStatus, createContainer, instagramImageUrl, publishContainer, type PostFormat, type PostMedia } from '../../../../lib/instagram'

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
  caption?: string
  containerId?: string
  sentAt?: string
  media?: { _type: 'image' | 'file'; url?: string }[]
  coverUrl?: string
}

// Vídeo que não termina de processar em 1 hora vira erro
const PROCESSING_LIMIT_MS = 60 * 60 * 1000

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
  }
  const done = async (id: string, containerId: string) => {
    const { mediaId, permalink } = await publishContainer(containerId)
    await sanity
      .patch(id)
      .set({ status: 'publicado', publishedAt: new Date().toISOString(), mediaId, ...(permalink ? { permalink } : {}) })
      .unset(['error'])
      .commit()
    report.push({ id, result: `publicado ${permalink ?? mediaId}` })
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
