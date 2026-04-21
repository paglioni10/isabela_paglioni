import { SITE_CONTENT } from "../constants/content";

export default function Hero() {
  return (
    <section id="home" className="relative min-h-screen w-full flex flex-col items-center justify-center bg-[#FFF5F7] pt-20 overflow-hidden">
      
      {/* ESTA DIV ABAIXO É A CHAVE: 
        max-w-7xl limita a largura.
        mx-auto centraliza a caixa no meio da tela.
        w-full garante que ela use o espaço disponível.
      */}
      <div className="w-full max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        
        {/* Lado Esquerdo: Conteúdo de Texto */}
        <div className="flex flex-col items-center text-center lg:items-start lg:text-left z-10">
          <span className="inline-block text-[#DB2777] font-bold tracking-[0.3em] uppercase text-xs mb-6 border-b-2 border-pink-200 pb-2">
            {SITE_CONTENT.brand.title}
          </span>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-serif font-bold text-gray-900 mb-8 leading-[1.1]">
            Organizando com <br />
            <span className="text-[#DB2777] italic">propósito.</span>
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-xl mb-10 leading-relaxed">
            {SITE_CONTENT.hero.subtitle}
          </p>

          <a 
            href={SITE_CONTENT.hero.ctaLink}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#DB2777] transition-all shadow-2xl text-center inline-block"
          >
            {SITE_CONTENT.hero.ctaText}
          </a>
        </div>

        {/* Lado Direito: Imagem e Moldura */}
        <div className="relative flex justify-center lg:justify-end w-full">
          <div className="relative w-full max-w-md aspect-[4/5]">
            {/* Efeito visual de fundo */}
            <div className="absolute -inset-4 bg-pink-200/40 rounded-[40px] rotate-6 blur-2xl"></div>
            
            {/* Moldura da Foto */}
            <div className="relative h-full w-full rounded-[32px] overflow-hidden shadow-2xl border-[12px] border-white -rotate-2 hover:rotate-0 transition-all duration-700">
              <img 
                src="/foto_isa.jpg" 
                alt="Isabela Paglioni" 
                className="w-full h-full object-cover"
              />
            </div>

            {/* Frase Flutuante (Desktop) */}
            <div className="absolute -bottom-6 -right-6 bg-white p-6 rounded-2xl shadow-xl hidden md:block border border-pink-50 max-w-[200px]">
              <p className="text-[#DB2777] font-serif italic text-lg leading-tight">
                "Organização é liberdade!"
              </p>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}