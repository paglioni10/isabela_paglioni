import { MessageCircle, Instagram, Mail, MapPin } from 'lucide-react'

export default function Contact() {
  const whatsappNumber = "5548984863549" 
  // Defina aqui a mesma mensagem que você usou no botão flutuante
  const message = "Olá Isabela! Vi seu site e gostaria de saber mais sobre seus serviços de organização."
  
  // Codifica a mensagem para ser usada na URL
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  
  return (
    <section id="contato" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="bg-[#FFF5F7] rounded-[40px] overflow-hidden shadow-sm border border-pink-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            {/* Lado Esquerdo: Informações de Contato */}
            <div className="p-10 md:p-16">
              <span className="inline-block text-[#DB2777] font-bold tracking-[0.3em] uppercase text-xs mb-6 border-b-2 border-pink-200 pb-2">
                Contato
              </span>

              <h2 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-8 leading-[1.1]">
                Vamos organizar o <br />
                <span className="text-[#DB2777] italic">seu espaço?</span>
              </h2>

              <p className="text-lg text-gray-600 mb-10 leading-relaxed">
                Agende uma visita ou tire suas dúvidas. Terei o maior prazer em transformar a sua rotina através da organização inteligente.
              </p>

              <div className="space-y-6">
                <div className="flex items-center gap-5 text-gray-700">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#DB2777]">
                    <Mail size={22} />
                  </div>
                  <span className="text-lg">isa.paglioni@hotmail.com</span>
                </div>
                
                <div className="flex items-center gap-5 text-gray-700">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#DB2777]">
                    <Instagram size={22} />
                  </div>
                  <span className="text-lg">@isa.paglioniorganizer</span>
                </div>

                <div className="flex items-center gap-5 text-gray-700">
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-[#DB2777]">
                    <MapPin size={22} />
                  </div>
                  <span className="text-lg">Florianópolis e Região</span>
                </div>
              </div>
            </div>

            {/* Lado Direito: Chamada para Ação (WhatsApp) */}
            <div className="bg-[#FADADD]/20 p-10 md:p-16 flex flex-col justify-center items-center">
              <div className="bg-white p-10 rounded-[32px] shadow-xl shadow-pink-100/20 w-full max-w-sm text-center border border-pink-50">
                <div className="w-20 h-20 bg-[#FFF5F7] rounded-full flex items-center justify-center mx-auto mb-6">
                  <MessageCircle size={40} className="text-[#DB2777]" />
                </div>
                
                <h3 className="font-serif text-2xl text-gray-900 mb-3 font-bold">Atendimento Imediato</h3>
                
                <p className="text-gray-600 mb-10 text-base leading-relaxed">
                  Clique abaixo para falar diretamente comigo pelo WhatsApp.
                </p>

                <a 
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block w-full bg-gray-900 text-white font-bold py-5 rounded-2xl hover:bg-[#DB2777] transition-all shadow-lg hover:shadow-[#DB2777]/20 text-center uppercase tracking-widest text-xs"
                >
                  Enviar Mensagem
                </a>
              </div>
            </div>
          </div>
        </div>
        
        {/* Rodapé */}
        <div className="mt-16 text-center text-gray-400 text-[10px] tracking-[0.1em] uppercase">
          <p>© {new Date().getFullYear()} Isabela Personal Organizer. Todos os direitos reservados.</p>
          <p className="mt-3">
            Desenvolvido por{" "}
            <a 
              href="https://www.linkedin.com/in/nicolas-pietro-paglioni-0287a2369" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-[#DB2777] hover:text-gray-900 transition-colors font-bold"
            >
              Nicolas Pietro Paglioni
            </a>
          </p>
        </div>
      </div>
    </section>
  )
}