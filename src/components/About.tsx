import Image from 'next/image'
import { Star } from 'lucide-react'

export default function About() {
  return (
    <section id="sobre" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-16">
          
          {/* Lado da Foto */}
          <div className="relative w-full lg:w-1/2 aspect-[4/5] max-w-md mx-auto lg:mx-0">
            <div className="absolute -inset-4 bg-pink-200/30 rounded-[40px] rotate-6 blur-2xl"></div>
            
            <div className="relative h-full w-full rounded-[32px] overflow-hidden shadow-2xl border-[12px] border-white rotate-2 hover:rotate-0 transition-all duration-700 z-10">
              <Image
                src="/foto_isa_1.jpg" 
                alt="Isabela Paglioni - Personal Organizer"
                fill
                sizes="(min-width: 1024px) 448px, 90vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Lado do Texto */}
          <div className="w-full lg:w-1/2">
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-[1.1] text-balance">
              Transformando espaços, <br /> 
              <span className="text-[#DB2777] italic">renovando vidas.</span>
            </h2>
            
            <div className="space-y-6 text-gray-600 text-lg leading-relaxed max-w-[62ch]">
              <p>
                Olá! Eu sou a <strong className="text-gray-900 font-bold">Isabela Paglioni</strong>. Minha missão é ajudar pessoas a recuperarem o prazer de estar em casa através da organização inteligente e personalizada.
              </p>
              <p>
                Acredito que um ambiente organizado não é apenas uma questão estética, mas o primeiro passo para uma mente mais leve e uma rotina mais produtiva. Cada closet, cozinha ou quarto de bebê que organizo é tratado como um projeto único de bem-estar.
              </p>
              <p>
                Com técnicas profissionais de organização, ajudo você a otimizar seu espaço e manter cada coisa em seu lugar de forma prática e definitiva.
              </p>
            </div>

            {/* Estatísticas */}
            <div className="flex justify-center lg:justify-start mt-10 md:mt-12 pt-8 md:pt-10 border-t border-pink-100 gap-12">
              <div>
                <p className="text-4xl font-serif font-bold text-gray-900">+100</p>
                <p className="text-xs text-[#DB2777] font-bold uppercase tracking-[0.2em] mt-1">Projetos</p>
              </div>
              <div>
                <p className="text-4xl font-serif font-bold text-gray-900 flex items-center gap-1.5">
                  5 <Star className="w-7 h-7 text-[#DB2777]" fill="currentColor" aria-label="estrelas" />
                </p>
                <p className="text-xs text-[#DB2777] font-bold uppercase tracking-[0.2em] mt-1">Avaliação</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}