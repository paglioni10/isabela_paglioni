'use client'

import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { SITE_CONTENT } from "../constants/content"

const menuLinks = [
  { href: "#home", label: "Início" },
  { href: "#sobre", label: "Sobre" },
  { href: "#servicos", label: "Serviços" },
  { href: "#processo", label: "Processo" },
  { href: "#portfolio", label: "Portfólio" },
  { href: "#depoimentos", label: "Depoimentos" },
  { href: "#dicas", label: "Dicas" },
]

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  // Fecha o menu do celular com Esc
  useEffect(() => {
    if (!isOpen) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setIsOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [isOpen])

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/85 backdrop-blur-md z-50 border-b border-pink-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <a href="#home" className="flex flex-col" aria-label={`${SITE_CONTENT.brand.name}, voltar ao início`}>
          <span className="font-serif font-bold text-xl tracking-tight text-gray-900 leading-none">
            {SITE_CONTENT.brand.name}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#DB2777] font-bold">
            Personal Organizer
          </span>
        </a>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8" aria-label="Menu principal">
          {menuLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-gray-600 hover:text-[#DB2777] transition-colors"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            className="bg-[#DB2777] text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-[#BE185D] transition-colors"
          >
            Contato
          </a>
        </nav>

        {/* MOBILE BUTTON */}
        <button
          type="button"
          className="md:hidden -mr-2 w-11 h-11 flex items-center justify-center rounded-full text-gray-900"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={isOpen}
          aria-controls="menu-mobile"
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU PANEL */}
      <nav
        id="menu-mobile"
        aria-label="Menu principal"
        inert={!isOpen}
        className={`
          md:hidden absolute top-20 left-0 right-0 bg-white border-b border-pink-50 shadow-[0_12px_24px_rgba(17,24,39,0.06)] transition-all duration-300 ease-out overflow-hidden
          ${isOpen ? 'max-h-[520px] opacity-100' : 'max-h-0 opacity-0'}
        `}
      >
        <div className="flex flex-col px-6 py-4">
          {menuLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className="py-3 text-lg font-medium text-gray-700 hover:text-[#DB2777]"
            >
              {link.label}
            </a>
          ))}
          <a
            href="#contato"
            onClick={() => setIsOpen(false)}
            className="mt-3 bg-[#DB2777] text-white px-6 py-3.5 rounded-xl text-center font-bold hover:bg-[#BE185D] transition-colors"
          >
            Contato
          </a>
        </div>
      </nav>
    </header>
  )
}
