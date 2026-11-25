// Contador anônimo de visitas e cliques no WhatsApp.
// Não usa cookie, não grava IP nem nada que identifique a pessoa: só soma números
// por dia, por botão e por origem da visita (Instagram, Google, direto...).
// Os totais ficam no Sanity em "metricas.dia.<AAAA-MM-DD>" (ID com ponto: não é público).

import { NextResponse } from 'next/server'
import { createClient } from 'next-sanity'

export const dynamic = 'force-dynamic'

const sanity = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN,
})

const ORIGENS =['instagram', 'facebook', 'google', 'bing', 'whatsapp', 'ia', 'outro_site', 'direto'] as const
const NADA = new NextResponse(null, { status: 204 })

export async function POST(request: Request) {
  // Só conta o que vem do próprio site
  const from = request.headers.get('origin') ?? request.headers.get('referer') ?? ''
  if (!/^https?:\/\/(www\.)?(isapaglioni\.com\.br|localhost(:\d+)?)(\/|$)/.test(from)) return NADA
  if (/bot|crawler|spider|preview|headless/i.test(request.headers.get('user-agent') ?? '')) return NADA

  let body: { tipo?: string; local?: string; origem?: string }
  try {
    body = JSON.parse(await request.text())
  } catch {
    return NADA
  }
  const origem = (ORIGENS as readonly string[]).includes(body.origem ?? '') ? body.origem! : 'direto'
  if (body.tipo !== 'visita' && body.tipo !== 'clique') return NADA
  // Nome do botão: só letras, números e _ (vira nome de campo no Sanity)
  const local = body.tipo === 'clique' ? (body.local ?? '').toLowerCase().replace(/-/g, '_') : ''
  if (body.tipo === 'clique' && !/^[a-z0-9_]{1,40}$/.test(local)) return NADA

  const dia = new Date().toLocaleDateString('en-CA', { timeZone: 'America/Sao_Paulo' }) // AAAA-MM-DD
  const id = `metricas.dia.${dia}`
  const zero: Record<string, number> = {}
  const inc: Record<string, number> = {}
  if (body.tipo === 'visita') {
    zero[`visitasPorOrigem.${origem}`] = 0
    inc.visitas = 1
    inc[`visitasPorOrigem.${origem}`] = 1
  } else {
    zero[`cliquesPorOrigem.${origem}`] = 0
    zero[`cliquesPorLocal.${local}`] = 0
    inc.cliques = 1
    inc[`cliquesPorOrigem.${origem}`] = 1
    inc[`cliquesPorLocal.${local}`] = 1
  }

  try {
    await sanity
      .transaction()
      .createIfNotExists({
        _id: id,
        _type: 'metricaDia',
        dia,
        visitas: 0,
        cliques: 0,
        visitasPorOrigem: {},
        cliquesPorOrigem: {},
        cliquesPorLocal: {},
      })
      .patch(id, (p) => p.setIfMissing(zero).inc(inc))
      .commit()
  } catch (err) {
    console.error('Contador não registrado:', err instanceof Error ? err.message : err)
  }
  return NADA
}
