import { SITE_CONTENT } from "../constants/content";
import { Instagram } from "lucide-react";

export default function SocialButtons() {
  return (
    <div className="fixed bottom-6 right-6 flex flex-col gap-4 z-50">
      {/* Botão Instagram */}
      <a
        href="https://www.instagram.com/isa.paglioniorganizer"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-gradient-to-tr from-[#f09433] via-[#dc2743] to-[#bc1888] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group"
        aria-label="Instagram"
      >
        <Instagram size={24} />
        <span className="absolute right-16 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-gray-100 pointer-events-none whitespace-nowrap">
          Siga no Instagram
        </span>
      </a>

      {/* Botão WhatsApp (que você já tinha, mas agora integrado no grupo) */}
      <a
        href={SITE_CONTENT.hero.ctaLink}
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#25D366] text-white p-4 rounded-full shadow-2xl hover:scale-110 transition-all duration-300 group"
        aria-label="WhatsApp"
      >
        <svg 
          viewBox="0 0 24 24" 
          width="24" 
          height="24" 
          stroke="currentColor" 
          strokeWidth="2" 
          fill="none" 
          strokeLinecap="round" 
          strokeLinejoin="round"
        >
          <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 1 1-7.6-11.7 8.38 8.38 0 0 1 3.8.9L21 3z"></path>
        </svg>
        <span className="absolute right-16 bg-white text-gray-800 px-3 py-1 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity shadow-sm border border-gray-100 pointer-events-none whitespace-nowrap">
          Fale conosco
        </span>
      </a>
    </div>
  );
}