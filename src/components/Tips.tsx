import YouTubeVideo from './YouTubeVideo'

export default function Tips({ tips }: { tips: any[] }) {
  if (!tips || tips.length === 0) return null

  return (
    <section id="dicas" className="py-24 bg-[#FFF5F7]">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-[1.1] text-balance">
            Dicas da <span className="text-[#DB2777] italic">Isa.</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Pequenas mudanças e estratégias simples que transformam a sua rotina e organização.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10 max-w-sm sm:max-w-none mx-auto">
          {tips.map((tip, index) => (
            <figure
              key={index}
              className="bg-white p-4 rounded-[36px] shadow-[0_2px_12px_rgba(219,39,119,0.06)] border border-pink-50"
            >
              <div className="relative aspect-[9/16] w-full rounded-[26px] overflow-hidden bg-gray-900">
                <YouTubeVideo url={tip.videoUrl} title={tip.title} />
              </div>
              <figcaption className="font-serif text-2xl text-gray-900 font-bold text-center leading-tight pt-5 pb-2 px-2 text-balance">
                {tip.title}
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  )
}
