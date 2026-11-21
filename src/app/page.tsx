import Hero from '../components/Hero'
import About from '../components/About'
import Services from '../components/Services'
import Process from '../components/Process'
import Portfolio from '../components/Portfolio'
import Testimonials from '../components/Testimonials'
import Tips from '../components/Tips'
import Contact from '../components/Contact'
import StructuredData from '../components/StructuredData'
import MoveService from '../components/MoveService'
import Faq from '../components/Faq'
import { client } from '../sanity/lib/client'

// Busca o conteúdo do painel de novo a cada minuto (edições aparecem sem republicar)
export const revalidate = 60

async function getData() {
  try {
    const services = await client.fetch(`*[_type == "service"] | order(orderRank asc, title asc) { title, description, icon }`)
    const projects = await client.fetch(`*[_type == "portfolio"] | order(orderRank asc, title asc) { _id, title, category, mainImage }`)
    const testimonials = await client.fetch(`*[_type == "testimonial"]{ clientName, videoUrl, image, quote }`)
    const tips = await client.fetch(`*[_type == "dicas"]{ title, videoUrl }`)

    return {
      services: services || [],
      projects: projects || [],
      testimonials: testimonials || [],
      tips: tips || []
    }
  } catch (error) {
    console.error("Erro ao carregar dados do Sanity:", error)
    return { services: [], projects: [], testimonials: [], tips: [] }
  }
}

export default async function Home() {
  const { services, projects, testimonials, tips } = await getData()

  return (
    <>
      <StructuredData services={services} />

      {/* 1. Introdução */}
      <Hero />

      {/* 2. Sobre a Isabela */}
      <About />

      {/* 3. Serviços */}
      <Services services={services} />

      {/* Carro-chefe: organização de mudança */}
      <MoveService />

      {/* 4. O seu Processo de Trabalho */}
      <Process />

      {/* 5. Portfólio / Projetos */}
      <Portfolio projects={projects} />

      {/* 6. Depoimentos das Clientes */}
      <Testimonials data={testimonials} />

      {/* 7. Dicas de Organização (Upload Direto) */}
      <Tips tips={tips} />

      {/* 8. Contato e seu Rodapé */}
      <Faq />

      <Contact />
    </>
  )
}