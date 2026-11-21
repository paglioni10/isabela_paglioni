'use client'

import { useEffect } from 'react'

declare global {
  interface Window {
    clarity?: (...args: unknown[]) => void
  }
}

// Registra no Microsoft Clarity cada clique em um link do WhatsApp.
// O local do botão vem do atributo data-whatsapp (ex.: "topo", "mudanca").
// No Clarity: Filtros > Eventos inteligentes/personalizados > "whatsapp_<local>".
export default function WhatsAppTracking() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const link = (e.target as Element | null)?.closest?.('a[href*="wa.me/"]') as HTMLAnchorElement | null
      if (!link || typeof window.clarity !== 'function') return
      const place = link.dataset.whatsapp || 'outro'
      window.clarity('event', `whatsapp_${place}`)
      window.clarity('set', 'clicou_whatsapp', place)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [])

  return null
}
