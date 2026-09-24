'use client'

import type { LogoProps } from 'sanity'

export function StudioLogo(props: LogoProps) {
  return props.renderDefault({
    ...props,
    title: 'Painel da Isa',
  })
}

// Ícone usado no seletor de workspace / aba do navegador do painel
export function StudioIcon() {
  return (
    <svg viewBox="0 0 32 32" width="1em" height="1em" aria-hidden>
      <rect width="32" height="32" rx="8" fill="#DB2777" />
      <text
        x="16"
        y="22"
        textAnchor="middle"
        fontFamily="Georgia, serif"
        fontWeight="700"
        fontSize="17"
        fill="#fff"
      >
        IP
      </text>
    </svg>
  )
}
