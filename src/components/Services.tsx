'use client'

import dynamic from 'next/dynamic'
import { LucideProps } from 'lucide-react'
import * as LucideIcons from 'lucide-react'

export default function Services({ services }: { services: any[] }) {
  return (
    <section id="servicos" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        
        <div className="text-center mb-20">
          {/* Selo de Identidade padrão Hero */}
          <span className="inline-block text-[#DB2777] font-bold tracking-[0.3em] uppercase text-xs mb-6 border-b-2 border-pink-200 pb-2">
            Especialidades
          </span>

          <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-[1.1]">
            Nossos <span className="text-[#DB2777] italic">serviços.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed antialiased">
            Soluções práticas para trazer harmonia e funcionalidade ao seu lar.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconName = service.icon as keyof typeof LucideIcons
            const IconComponent = LucideIcons[IconName] as React.ComponentType<LucideProps>
            const DefaultIcon = LucideIcons.Sparkles

            return (
              <div
                key={index}
                className="group relative p-10 rounded-[40px] bg-[#FFF5F7] border border-[#FADADD]/30 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl hover:shadow-pink-100/50 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                <div className="relative z-10">
                  <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:bg-[#DB2777] transition-all duration-500">
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
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}