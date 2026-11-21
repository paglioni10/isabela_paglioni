'use client'

import { CONSENT_KEY, CONSENT_RESET_EVENT } from './CookieConsent'

// Apaga a escolha salva e mostra o aviso de cookies de novo
export default function CookiePreferencesButton() {
  const reset = () => {
    try {
      window.localStorage.removeItem(CONSENT_KEY)
    } catch {
      // armazenamento indisponível: o aviso reaparece mesmo assim
    }
    window.dispatchEvent(new Event(CONSENT_RESET_EVENT))
  }

  return (
    <button
      type="button"
      onClick={reset}
      className="min-h-11 px-6 bg-gray-900 text-white rounded-full font-bold text-sm hover:bg-[#DB2777] transition-colors"
    >
      Alterar minha escolha de cookies
    </button>
  )
}
