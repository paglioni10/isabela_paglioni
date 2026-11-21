'use client'

import { useEffect, useState } from 'react'
import Script from 'next/script'

// Consentimento de cookies (LGPD). O Microsoft Clarity só carrega depois que a
// visitante aceita. A escolha fica no localStorage do navegador dela.
export const CONSENT_KEY = 'cookie-consent'
export const CONSENT_RESET_EVENT = 'cookie-consent-reset'

type Choice = 'accepted' | 'declined' | null

function readChoice(): Choice {
  try {
    const v = window.localStorage.getItem(CONSENT_KEY)
    return v === 'accepted' || v === 'declined' ? v : null
  } catch {
    return null
  }
}

function saveChoice(choice: Exclude<Choice, null>) {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice)
  } catch {
    // Navegação privada ou armazenamento bloqueado: vale só para esta visita
  }
}

export default function CookieConsent() {
  // undefined = ainda lendo a escolha (evita piscar o aviso antes de saber)
  const [choice, setChoice] = useState<Choice | undefined>(undefined)

  useEffect(() => {
    setChoice(readChoice())
    const reopen = () => setChoice(null)
    window.addEventListener(CONSENT_RESET_EVENT, reopen)
    return () => window.removeEventListener(CONSENT_RESET_EVENT, reopen)
  }, [])

  const decide = (c: Exclude<Choice, null>) => {
    saveChoice(c)
    // Recusar com o Clarity já carregado: recarrega a página para descarregá-lo
    if (c === 'declined' && typeof (window as { clarity?: unknown }).clarity === 'function') {
      window.location.reload()
      return
    }
    setChoice(c)
  }

  return (
    <>
      {choice === 'accepted' && (
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "wo2izteoc9");
          `}
        </Script>
      )}

      {choice === null && (
        <div
          role="region"
          aria-label="Aviso de cookies"
          className="fixed z-[60] bottom-4 left-4 right-4 sm:right-auto sm:max-w-md bg-white rounded-[24px] border border-pink-100 shadow-[0_16px_40px_rgba(17,24,39,0.16)] p-6"
        >
          <p className="text-gray-700 leading-relaxed">
            Uso cookies para entender como as pessoas navegam no site e melhorar a experiência.
            Você escolhe se aceita.{' '}
            <a href="/privacidade" className="text-[#BE185D] font-bold underline underline-offset-4">
              Saiba mais
            </a>
          </p>
          <div className="mt-5 flex gap-3">
            <button
              type="button"
              onClick={() => decide('accepted')}
              className="flex-1 min-h-11 bg-[#DB2777] text-white rounded-full font-bold text-sm hover:bg-[#BE185D] transition-colors"
            >
              Aceitar
            </button>
            <button
              type="button"
              onClick={() => decide('declined')}
              className="flex-1 min-h-11 bg-white text-gray-700 border border-gray-300 rounded-full font-bold text-sm hover:border-gray-500 transition-colors"
            >
              Recusar
            </button>
          </div>
        </div>
      )}
    </>
  )
}
