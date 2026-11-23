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
  isAdmin?: boolean
}

let configured = false
function configure() {
  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
  const privateKey = process.env.VAPID_PRIVATE_KEY
  if (!publicKey || !privateKey) return false
  if (!configured) {
    webpush.setVapidDetails('https://www.isapaglioni.com.br', publicKey, privateKey)
    configured = true
  }
  return true
}

/**
 * Envia para todos os aparelhos inscritos, ou só para os de administradores.
 * Nunca lança erro: notificação falhar não pode travar a publicação.
 */
export async function notify(sanity: SanityClient, payload: PushPayload, only: 'todos' | 'admins' = 'todos') {
  if (!configure()) return 0
  try {
    const filter = only === 'admins' ? ' && isAdmin == true' : ''
    const subs = await sanity.fetch<Subscription[]>(`*[_type == "pushSubscription"${filter}]{ _id, endpoint, keys, isAdmin }`)
    const body = JSON.stringify({ url: '/admin/aprovar', ...payload })
    let sent = 0
    await Promise.all(
      subs.map(async (s) => {
        try {
          await webpush.sendNotification({ endpoint: s.endpoint, keys: s.keys }, body, { TTL: 60 * 60 * 24 })
          sent++
        } catch (err) {
          // 404/410: o aparelho desinstalou o app ou desativou as notificações
          const status = (err as { statusCode?: number }).statusCode
          if (status === 404 || status === 410) await sanity.delete(s._id).catch(() => {})
        }
      })
    )
    return sent
  } catch {
    return 0
  }
}
