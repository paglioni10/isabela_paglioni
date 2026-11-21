import { ClipboardList, PackageCheck, Truck, Home } from 'lucide-react'

const steps = [
  {
    icon: ClipboardList,
    title: 'Planejamento e desapego',
    text: 'Antes de embalar, separo com você o que vai, o que doa e o que descarta. É a melhor hora para desapegar e não levar peso à toa.',
  },
  {
    icon: PackageCheck,
    title: 'Embalagem com etiquetas',
    text: 'Embalo tudo com cuidado e etiqueto cada caixa por cômodo e conteúdo. Na casa nova, você acha a cafeteira sem abrir dez caixas.',
  },
  {
    icon: Truck,
    title: 'Acompanhamento no dia',
    text: 'No dia da mudança eu estou lá e oriento os carregadores a levar cada caixa direto para o cômodo certo.',
  },
  {
    icon: Home,
    title: 'Casa nova organizada',
    text: 'Desembalo e organizo cada cômodo pensando na sua rotina, para a casa continuar em ordem depois.',
  },
]

const whatsappUrl = `https://wa.me/5548984863549?text=${encodeURIComponent(
  'Olá Isa! Vi seu site e quero um orçamento para organização de mudança.'
)}`

export default function MoveService() {
  return (
    <section id="mudanca" className="py-24 bg-[#FFF5F7]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mb-14">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-[1.1] text-balance">
            Mudança sem <span className="text-[#DB2777] italic">caos.</span>
          </h2>
          <p className="text-lg md:text-xl text-gray-600 leading-relaxed">
            Organização de mudança é a minha especialidade. Cuido de tudo, do planejamento à casa nova
            funcionando, em Palhoça e na Grande Florianópolis.
          </p>
        </div>

        <ol className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((step, i) => (
            <li
              key={step.title}
              className="relative bg-white rounded-[32px] p-8 border border-pink-100/60 shadow-[0_2px_12px_rgba(219,39,119,0.06)]"
            >
              <div className="flex items-center gap-3 mb-6">
                <span className="w-12 h-12 rounded-2xl bg-[#FFF5F7] text-[#DB2777] flex items-center justify-center" aria-hidden="true">
                  <step.icon size={24} />
                </span>
                <span className="text-sm font-bold text-[#BE185D]">Etapa {i + 1}</span>
              </div>
              <h3 className="font-serif text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
              <p className="text-gray-600 leading-relaxed">{step.text}</p>
            </li>
          ))}
        </ol>

        <div className="mt-12 flex flex-col sm:flex-row sm:items-center gap-5">
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="bg-gray-900 text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#DB2777] transition-colors shadow-[0_12px_32px_rgba(17,24,39,0.22)] text-center"
          >
            Pedir orçamento de mudança
          </a>
          <p className="text-gray-600">
            Mande fotos ou vídeos dos ambientes pelo WhatsApp e eu passo o valor, sem precisar de visita.
          </p>
        </div>
      </div>
    </section>
  )
}
