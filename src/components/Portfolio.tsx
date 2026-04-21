'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '../sanity/lib/image'
import { motion, AnimatePresence } from 'framer-motion'

interface Project {
  _id: string 
  title: string
  category: string
  mainImage?: any 
}

interface PortfolioProps {
  projects: Project[]
}

export default function Portfolio({ projects }: PortfolioProps) {
  const [filter, setFilter] = useState('todos')

  const safeProjects = projects || []
  const categories = ['todos', ...Array.from(new Set(safeProjects.map(p => p.category).filter(Boolean)))]

  const filteredProjects = filter === 'todos' 
    ? safeProjects 
    : safeProjects.filter(p => p.category === filter)

  return (
    <section id="portfolio" className="py-24 bg-[#FFF5F7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <span className="inline-block text-[#DB2777] font-bold tracking-[0.3em] uppercase text-xs mb-6 border-b-2 border-pink-200 pb-2">
            Portfólio Selecionado
          </span>
          
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-8 leading-[1.1]">
            Transformações <span className="text-[#DB2777] italic">reais.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Explore alguns dos nossos projetos e veja como a organização pode transformar o seu dia a dia e trazer harmonia para sua casa.
          </p>
        </div>

        {/* Botões de Filtro - Estilo coerente com o CTA da Hero */}
        <div className="flex flex-wrap justify-center gap-3 mb-16">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-8 py-3 rounded-full border transition-all duration-300 text-xs font-bold uppercase tracking-widest
                ${filter === cat 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-xl' 
                  : 'bg-white text-gray-600 border-pink-100 hover:border-[#DB2777] hover:text-[#DB2777]'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <motion.div 
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 min-h-[450px]"
        >
          <AnimatePresence mode='popLayout'>
            {filteredProjects.map((project) => (
              <motion.div 
                layout
                key={project._id || project.title}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ 
                  duration: 0.4,
                  layout: { duration: 0.4, ease: "easeInOut" } 
                }}
                className="group bg-white rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500"
              >
                <div className="relative h-80 w-full overflow-hidden bg-gray-100">
                  {project.mainImage ? (
                    <Image
                      src={urlFor(project.mainImage).width(800).url()}
                      alt={project.title}
                      fill
                      className="object-cover transition-transform duration-1000 ease-out scale-110 group-hover:scale-100"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-300 italic">
                      Sem imagem cadastrada
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </div>
                
                <div className="p-8 text-center">
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[#DB2777] font-bold mb-3 block">
                    {project.category || 'Geral'}
                  </span>
                  <h3 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-[#DB2777] transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center text-gray-500 mt-10"
          >
            Nenhum projeto encontrado nesta categoria.
          </motion.p>
        )}
      </div>
    </section>
  )
}