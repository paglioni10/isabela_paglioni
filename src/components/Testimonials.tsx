'use client'

export default function Testimonials({ data }: { data: any[] }) {
  if (!data || data.length === 0) return null

  const getEmbedUrl = (url: string) => {
    if (!url) return null;
    let videoId = "";
    
    if (url.includes("youtube.com/watch?v=")) {
      videoId = url.split("v=")[1].split("&")[0];
    } else if (url.includes("youtu.be/")) {
      videoId = url.split("youtu.be/")[1].split("?")[0];
    } else if (url.includes("youtube.com/shorts/")) {
      videoId = url.split("shorts/")[1].split("?")[0];
    }

    return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
  };

  return (
    <section id="depoimentos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-16">
          {/* Selo padrão Hero */}
          <span className="inline-block text-[#DB2777] font-bold tracking-[0.3em] uppercase text-xs mb-6 border-b-2 border-pink-200 pb-2">
            Depoimentos
          </span>

          <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-[1.1]">
            O que dizem as <span className="text-[#DB2777] italic">clientes.</span>
          </h2>

          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed antialiased">
            Histórias reais de quem transformou o lar e a rotina com a Isabela.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {data.map((item, index) => {
            const embedUrl = getEmbedUrl(item.videoUrl)

            return (
              <div 
                key={index} 
                className="group bg-white p-5 rounded-[40px] shadow-sm border border-pink-50 hover:shadow-2xl hover:shadow-pink-100/50 transition-all duration-500 hover:-translate-y-2"
              >
                {/* Formato 9:16 com bordas arredondadas suaves */}
                <div className="relative aspect-[9/16] w-full rounded-[30px] overflow-hidden bg-gray-900 mb-6 shadow-inner">
                  {embedUrl ? (
                    <iframe
                      src={embedUrl}
                      title={item.clientName}
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-500 italic text-sm">
                      Vídeo não disponível
                    </div>
                  )}
                </div>
                
                <h3 className="font-serif text-2xl text-gray-900 px-2 pb-4 group-hover:text-[#DB2777] transition-colors font-bold text-center">
                  {item.clientName}
                </h3>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}