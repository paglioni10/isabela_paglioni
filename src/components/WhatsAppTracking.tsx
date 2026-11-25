'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void
  }
}

// Mede visitas e cliques nos botões de WhatsApp de dois jeitos:
// 1. Contador anônimo do próprio site (/api/metricas): conta todo mundo, sem cookie,
//    só números por dia, botão e origem da visita.
// 2. Microsoft Clarity, só para quem aceitou os cookies: evento "whatsapp_<local>".
// O local do botão vem do atributo data-whatsapp (ex.: "topo", "mudanca").

const ORIGEM_KEY = 'isa_origem'
const VISITA_KEY = 'isa_visita_contada'
let visitaContadaNestaPagina = false

// De onde a pessoa chegou. ?origem=instagram no link da bio vale mais que o referrer,
// porque o app do Instagram muitas vezes não informa de onde veio.
function descobrirOrigem(): string {
  try {
    const salva = sessionStorage.getItem(ORIGEM_KEY)
    if (salva) return salva
  } catch {}
  const params = new URLSearchParams(window.location.search)
  const marcada = (params.get('origem') || params.get('utm_source') || '').toLowerCase()
  let host = ''
  try {
    host = document.referrer ? new URL(document.referrer).hostname : ''
  } catch {}
  if (host === window.location.hostname) host = ''
  const fonte = marcada || host
  const origem = /instagram|^ig$/.test(fonte)
    ? 'instagram'
    : /facebook|^fb$/.test(fonte)
      ? 'facebook'
      : /google/.test(fonte)
        ? 'google'
        : /bing/.test(fonte)
          ? 'bing'
          : /whatsapp|wa\.me/.test(fonte)
            ? 'whatsapp'
            : /chatgpt|openai|perplexity|copilot|claude/.test(fonte)
              ? 'ia'
              : fonte
                ? 'outro_site'
                : 'direto'
  try {
    sessionStorage.setItem(ORIGEM_KEY, origem)
  } catch {}
  return origem
}

function enviar(dados: Record<string, string>) {
  const corpo = JSON.stringify(dados)
  // sendBeacon continua funcionando mesmo quando a página sai para o WhatsApp
  if (navigator.sendBeacon?.('/api/metricas', corpo)) return
  fetch('/api/metricas', { method: 'POST', body: corpo, keepalive: true }).catch(() => {})
}

export default function WhatsAppTracking() {
  useEffect(() => {
    const origem = descobrirOrigem()

    // Uma visita por aba aberta (fechou a aba, a próxima conta de novo)
    let jaContada = visitaContadaNestaPagina
    try {
      jaContada = jaContada || sessionStorage.getItem(VISITA_KEY) === '1'
      sessionStorage.setItem(VISITA_KEY, '1')
    } catch {}
    if (!jaContada) {
      visitaContadaNestaPagina = true
      enviar({ tipo: 'visita', origem })
    }

    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href*="wa.me/"]') as HTMLAnchorElement | null
      if (!link) return
      const place = link.dataset.whatsapp || 'outro'
      enviar({ tipo: 'clique', local: place, origem })
      if (typeof window.clarity === 'function') {
        window.clarity('event', `whatsapp_${place}`)
        window.clarity('set', 'clicou_whatsapp', place)
      }
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
