import { MessageCircle, Instagram, Mail, MapPin } from 'lucide-react'

export default function Contact() {
  const whatsappNumber = "5548984863549" 
  const message = "Olá Isabela! Vi seu site e gostaria de saber mais sobre seus serviços de organização."
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  
  const iconBox = "flex-shrink-0 w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-[0_2px_8px_rgba(219,39,119,0.08)] text-[#DB2777]"

  return (
    <section id="contato" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-[#FFF5F7] rounded-[40px] overflow-hidden shadow-sm border border-pink-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Lado Esquerdo: Informações de Contato */}
            <div className="p-10 md:p-16">
              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-[1.1] text-balance">
                Vamos organizar o <br />
                <span className="text-[#DB2777] italic">seu espaço?</span>
              </h2>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Me conte o que você quer organizar. Pelo WhatsApp eu tiro suas dúvidas e combinamos uma visita.
              </p>

              <ul className="space-y-4">
                {/* Email */}
                <li>
                  <a href="mailto:isa.paglioni@hotmail.com" className="flex items-center gap-5 text-gray-700 group rounded-2xl hover:text-[#DB2777] transition-colors">
                    <span className={iconBox} aria-hidden="true"><Mail size={22} /></span>
                    <span className="text-lg [overflow-wrap:anywhere] underline decoration-pink-200 underline-offset-4 group-hover:decoration-[#DB2777]">isa.paglioni@hotmail.com</span>
                  </a>
                </li>
                
                {/* Instagram */}
                <li>
                  <a href="https://www.instagram.com/isa.paglioniorganizer" target="_blank" rel="noopener noreferrer" className="flex items-center gap-5 text-gray-700 group rounded-2xl hover:text-[#DB2777] transition-colors">
                    <span className={iconBox} aria-hidden="true"><Instagram size={22} /></span>
                    <span className="text-lg [overflow-wrap:anywhere] underline decoration-pink-200 underline-offset-4 group-hover:decoration-[#DB2777]">@isa.paglioniorganizer</span>
                  </a>
                </li>

                {/* Localização */}
                <li className="flex items-center gap-5 text-gray-700">
                  <span className={iconBox} aria-hidden="true"><MapPin size={22} /></span>
                  <span className="text-lg">Florianópolis e Região</span>
                </li>
              </ul>
            </div>

            {/* Lado Direito: Chamada para Ação (WhatsApp) */}
            <div className="bg-[#FADADD]/20 p-10 md:p-16 flex flex-col justify-center items-center">
              <div className="bg-white p-10 rounded-[32px] shadow-xl shadow-pink-100/20 w-full max-w-sm text-center border border-pink-50">
                <div className="w-20 h-20 bg-[#FFF5F7] rounded-full flex items-center justify-center mx-auto mb-6" aria-hidden="true">
                  <MessageCircle size={40} className="text-[#DB2777]" />
                </div>
                
                <h3 className="font-serif text-2xl text-gray-900 mb-3 font-bold">Fale direto comigo</h3>
                
                <p className="text-gray-600 mb-10 text-base leading-relaxed">
                  A conversa abre no WhatsApp com uma mensagem pronta. É só enviar.
                </p>

                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full bg-gray-900 text-white font-bold py-5 rounded-2xl hover:bg-[#DB2777] transition-colors shadow-[0_10px_24px_rgba(17,24,39,0.18)] text-center uppercase tracking-widest text-xs"
                >
                  Chamar no WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rodapé */}
        <footer className="mt-16 text-center text-gray-500 text-[11px] tracking-[0.1em] uppercase">
          <p>© {new Date().getFullYear()} Isa Paglioni Personal Organizer. Todos os direitos reservados.</p>
          <p className="mt-3">
            Desenvolvido por{" "}
            <a 
              href="https://www.linkedin.com/in/nicolas-pietro-paglioni-0287a2369" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#BE185D] hover:text-gray-900 transition-colors font-bold"
            >
              Nicolas Pietro Paglioni
            </a>
          </p>
        </footer>
      </div>
    </section>
  )
}