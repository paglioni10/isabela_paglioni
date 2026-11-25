// Notificações no celular (Web Push) para quem ativou no app "Painel da Isa".
// As inscrições ficam no Sanity com ID "pushSubscription.<hash>": IDs com ponto
// não são públicos, só membros do projeto e o servidor (com token) leem.

import webpush from 'web-push'
import type { SanityClient } from 'next-sanity'

export type PushPayload = { title: string; body: string; url?: string; tag?: string }
type Subscription = {
  _id: string
  endpoint: string
  keys: { p256dh: string; auth: string }
  equipe?: boolean
}

let configured = false
function configure() {
  // trim: valor colado no painel da Vercel com espaço ou quebra de linha no fim
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY?.trim()
  const privateKey = process.env.VAPID_PRIVATE_KEY?.trim()
  if (!publicKey || !privateKey) throw new Error('chaves VAPID não configuradas')
  if (!configured) {
    webpush.setVapidDetails('https://www.isapaglioni.com.br', publicKey, privateKey)
    configured = true
  }
}

/**
 * Envia para todos os aparelhos inscritos, ou só para os que marcaram
 * "receber também os avisos da equipe" no app.
 * Nunca lança erro: notificação falhar não pode travar a publicação.
 * Devolve quantos aparelhos receberam e, se deu errado, o motivo.
 */
export async function notify(
  sanity: SanityClient,
  payload: PushPayload,
  only: 'todos' | 'equipe' = 'todos'
): Promise<{ sent: number; error?: string }> {
  try {
    configure()
    const filter = only === 'equipe' ? ' && equipe == true' : ''
    const subs = await sanity.fetch<Subscription[]>(`*[_type == "pushSubscription"${filter}]{ _id, endpoint, keys }`)
    const body = JSON.stringify({ url: '/admin/aprovar', ...payload })
    let sent = 0
    const failures: string[] = []
    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, body, { TTL: 60 * 60 * 24 })
          sent++
        } catch (err) {
          // 404/410: o aparelho desinstalou o app ou desativou as notificações
          const status = (err as { statusCode?: number }).statusCode
          if (status === 404 || status === 410) await sanity.delete(s._id).catch(() => {})
          else failures.push(`${status ?? ''} ${err instanceof Error ? err.message : String(err)}`.trim())
        }
      })
    )
    if (sent === 0 && failures.length > 0) return { sent, error: failures[0] }
    return { sent }
  } catch (err) {
    const error = err instanceof Error ? err.message : String(err)
    console.error('Notificação não enviada:', error)
    return { sent: 0, error }
  }
}
