'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import { SITE_CONTENT } from "../constants/content"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  const menuLinks = [
    { href: "#home", label: "Início" },
    { href: "#sobre", label: "Sobre" },
    { href: "#servicos", label: "Serviços" },
    { href: "#processo", label: "Processo" },
    { href: "#portfolio", label: "Portfólio" },
    { href: "#depoimentos", label: "Depoimentos" },
    { href: "#dicas", label: "Dicas" },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-pink-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        {/* LOGO */}
        <div className="flex flex-col">
          <span className="font-serif font-bold text-xl tracking-tighter text-gray-900 leading-none">
            {SITE_CONTENT.brand.name}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#DB2777] font-bold">
            Personal Organizer
          </span>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
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
            className="bg-[#E19FB4] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#d48da3] transition-all"
          >
            Contato
          </a>
        </nav>

        {/* MOBILE BUTTON */}
        <button 
          className="md:hidden text-gray-900"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU PANEL */}
      <div className={`
        md:hidden absolute top-20 left-0 right-0 bg-white border-b border-pink-50 transition-all duration-300 ease-in-out overflow-hidden
        ${isOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}
      `}>
        <div className="flex flex-col p-6 gap-4">
          {menuLinks.map((link) => (
            <a 
              key={link.href}
              href={link.href} 
              onClick={() => setIsOpen(false)}
              className="text-lg font-medium text-gray-600 hover:text-[#DB2777]"
            >
              {link.label}
            </a>
          ))}
          <a 
            href="#contato"
            onClick={() => setIsOpen(false)}
            className="bg-[#E19FB4] text-white px-6 py-3 rounded-xl text-center font-bold"
          >
            Contato
          </a>
        </div>
      </div>
    </header>
  )
}