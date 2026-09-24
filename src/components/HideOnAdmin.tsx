'use client'

import { usePathname } from 'next/navigation'

// Esconde elementos do site (header, botões flutuantes) dentro do painel /admin
export default function HideOnAdmin({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  if (pathname?.startsWith('/admin')) return null
  return <>{children}</>
}
