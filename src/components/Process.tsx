import YouTubeVideo from './YouTubeVideo'

export default function Process() {
  return (
    <section id="processo" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          
          <div>
            <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-[1.1] text-balance">
              Como funciona o <br />
              <span className="text-[#DB2777] italic">nosso trabalho.</span>
            </h2>

            <p className="text-lg md:text-xl text-gray-600 mb-10 leading-relaxed">
              Entenda em detalhes cada etapa do nosso processo de organização. Assista ao vídeo ao lado para conhecer nossa metodologia e como transformamos ambientes em espaços de harmonia e praticidade.
            </p>

            <ol className="space-y-6">
              {[
                { n: "1", t: "Consultoria Inicial", d: "Entendemos sua necessidade e rotina." },
                { n: "2", t: "Planejamento", d: "Criamos o projeto ideal para o seu espaço." },
                { n: "3", t: "Execução", d: "Mãos à obra para trazer a harmonia de volta." }
              ].map((step) => (
                <li key={step.n} className="flex items-start gap-5">
                  <div className="w-10 h-10 rounded-full bg-[#FFF5F7] flex items-center justify-center text-[#DB2777] font-bold shrink-0 border border-pink-100">
                    {step.n}
                  </div>
                  <p className="text-gray-700 leading-tight">
                    <strong className="font-serif text-lg text-gray-900 block mb-1">{step.t}</strong>
                    <span className="text-gray-600">{step.d}</span>
                  </p>
                </li>
              ))}
            </ol>
          </div>

          {/* Ajustado para formato vertical 9:16 com max-width para harmonia visual */}
          <div className="flex justify-center lg:justify-end">
            <div className="relative aspect-[9/16] w-full max-w-[350px] rounded-[32px] overflow-hidden shadow-2xl border-[12px] border-white ring-1 ring-pink-100 bg-gray-900">
              <YouTubeVideo url="https://www.youtube.com/shorts/AqojyTG500g" title="Como funciona o trabalho" />
            </div>
          </div>

        </div>
      </div>
    </section>
  )
}