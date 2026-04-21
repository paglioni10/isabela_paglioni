import { SITE_CONTENT } from "../constants/content";

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-pink-50">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <div className="flex flex-col">
          <span className="font-serif font-bold text-xl tracking-tighter text-gray-900 leading-none">
            {SITE_CONTENT.brand.name}
          </span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#DB2777] font-bold">
            Personal Organizer
          </span>
        </div>

        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          <a href="#home" className="text-sm font-medium text-gray-600 hover:text-[#DB2777] transition-colors">Início</a>
          <a href="#sobre" className="text-sm font-medium text-gray-600 hover:text-[#DB2777] transition-colors">Sobre</a>
          <a href="#servicos" className="text-sm font-medium text-gray-600 hover:text-[#DB2777] transition-colors">Serviços</a>
          <a href="#processo" className="text-sm font-medium text-gray-600 hover:text-[#DB2777] transition-colors">Processo</a>
          <a href="#portfolio" className="text-sm font-medium text-gray-600 hover:text-[#DB2777] transition-colors">Portfólio</a>
          <a href="#depoimentos" className="text-sm font-medium text-gray-600 hover:text-[#DB2777] transition-colors">Depoimentos</a>
           <a href="#dicas" className="text-sm font-medium text-gray-600 hover:text-[#DB2777] transition-colors">Dicas</a>
          <div className="hidden md:block">
            <a 
    href="#contato"
    className="bg-[#E19FB4] text-white px-6 py-2 rounded-full text-sm font-bold hover:bg-[#d48da3] transition-all"
  >
    Contato
  </a>
</div>
        </nav>

        <button className="md:hidden text-gray-900">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>
    </header>
  );
}