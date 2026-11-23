// Service worker do app "Painel da Isa": só recebe notificações.
// Não intercepta requisições, então não interfere no painel.

self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (event) => event.waitUntil(self.clients.claim()))

self.addEventListener('push', (event) => {
  let data = {}
  try {
    data = event.data ? event.data.json() : {}
  } catch {
    data = { body: event.data ? event.data.text() : '' }
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'Painel da Isa', {
      body: data.body || '',
      icon: '/painel/icon-192.png',
      badge: '/painel/icon-192.png',
      tag: data.tag,
      data: { url: data.url || '/admin/aprovar' },
    })
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  const url = new URL(event.notification.data?.url || '/admin/aprovar', self.location.origin).href
  // Link externo (o post publicado no Instagram): só abre
  if (!url.startsWith(self.location.origin)) {
    event.waitUntil(self.clients.openWindow(url))
    return
  }
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((list) => {
      // Se o app já estiver aberto, traz para frente na tela de aprovação
      for (const client of list) {
        if (client.url.startsWith(self.location.origin + '/admin') && 'focus' in client) {
          client.navigate(url).catch(() => {})
          return client.focus()
        }
      }
      return self.clients.openWindow(url)
    })
  )
})
