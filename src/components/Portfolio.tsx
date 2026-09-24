'use client'

import { useState } from 'react'
import Image from 'next/image'
import { urlFor } from '../sanity/lib/image'
import { motion, AnimatePresence, MotionConfig } from 'framer-motion'

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

  // Lógica de filtro + Agrupamento por categoria no "todos"
  const filteredProjects = safeProjects
    .filter(p => filter === 'todos' || p.category === filter)
    .sort((a, b) => {
      // Se estiver no "todos", organiza alfabeticamente pela categoria para manter os grupos juntos
      if (filter === 'todos') {
        return (a.category || '').localeCompare(b.category || '');
      }
      return 0;
    });

  return (
    <MotionConfig reducedMotion="user">
    <section id="portfolio" className="py-24 bg-[#FFF5F7]">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 mb-6 leading-[1.1] text-balance">
            Transformações <span className="text-[#DB2777] italic">reais.</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Fotos de ambientes que organizei. Filtre por cômodo para ver o que combina com a sua casa.
          </p>
        </div>

        {/* Botões de Filtro */}
        <div className="flex flex-wrap justify-center gap-2.5 mb-14" role="group" aria-label="Filtrar projetos por categoria">
          {categories.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setFilter(cat)}
              aria-pressed={filter === cat}
              className={`px-6 md:px-8 min-h-11 rounded-full border transition-colors duration-300 text-xs font-bold uppercase tracking-widest
                ${filter === cat 
                  ? 'bg-gray-900 text-white border-gray-900 shadow-[0_8px_20px_rgba(17,24,39,0.18)]' 
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
                className="group bg-white rounded-[32px] overflow-hidden shadow-[0_2px_12px_rgba(219,39,119,0.06)] hover:shadow-[0_18px_40px_rgba(219,39,119,0.12)] transition-shadow duration-500"
              >
                <div className="relative h-80 w-full overflow-hidden bg-gray-100">
                  {project.mainImage ? (
                    <Image
                      src={urlFor(project.mainImage).width(800).url()}
                      alt={project.title}
                      fill
                      sizes="(min-width: 1024px) 400px, (min-width: 768px) 50vw, 100vw"
                      className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-500 italic">
                      Sem imagem cadastrada
                    </div>
                  )}
                </div>
                
                <div className="px-8 py-6 text-center">
                  {/* Só mostra a categoria quando o título ainda não a menciona */}
                  {project.category && !project.title?.toLowerCase().includes(project.category.toLowerCase()) && (
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#BE185D] font-bold mb-3 block">
                      {project.category}
                    </span>
                  )}
                  <h3 className="text-2xl font-serif font-bold text-gray-900 group-hover:text-[#DB2777] transition-colors duration-300">
                    {project.title}
                  </h3>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {filteredProjects.length === 0 && (
          <p className="text-center text-gray-600 mt-10">
            Nenhum projeto encontrado nesta categoria.
          </p>
        )}
      </div>
    </section>
    </MotionConfig>
  )
}