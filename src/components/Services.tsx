'use client'

import { LucideProps } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

export default function Services({ services }: { services: any[] }) {
  if (!services || services.length === 0) return null

  return (
    <section id="servicos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-20">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-[1.1] text-balance">
            Como posso <span className="text-[#DB2777] italic">ajudar você.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Da chegada do bebê à mudança de casa: cada serviço é planejado para a sua rotina e para continuar em ordem depois da organização.
          </p>
        </div>

        <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {services.map((service, index) => {
            const IconName = service.icon as keyof typeof LucideIcons
            const IconComponent = LucideIcons[IconName] as React.ComponentType<LucideProps>
            const DefaultIcon = LucideIcons.Sparkles

            return (
              <li
                key={index}
                className="group relative p-8 md:p-10 rounded-[36px] bg-[#FFF5F7] border border-pink-100/60 transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_18px_40px_rgba(219,39,119,0.10)] overflow-hidden">
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-7 shadow-[0_2px_8px_rgba(219,39,119,0.08)] group-hover:bg-[#DB2777] transition-colors duration-500" aria-hidden="true">
                    {IconComponent ? (
                      <IconComponent className="w-8 h-8 text-[#DB2777] group-hover:text-white transition-colors duration-500" />
                    ) : (
                      <DefaultIcon className="w-8 h-8 text-[#DB2777] group-hover:text-white transition-colors duration-500" />
                    )}
                  </div>

                  <h3 className="font-serif text-2xl text-gray-900 mb-4 font-bold group-hover:text-[#DB2777] transition-colors duration-300">
                    {service.title}
                  </h3>
                  
                  <p className="text-gray-600 text-base leading-relaxed">
                    {service.description}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </div>
    </section>
  )
}