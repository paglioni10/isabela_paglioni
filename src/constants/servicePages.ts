import { FAQ_ITEMS, type FaqItem } from './faq'
import { GENERAL_STEPS, MOVE_STEPS } from './steps'

export type ServicePage = {
  slug: string
  name: string // nome curto, usado em links e no breadcrumb
  serviceTitle: string // título do serviço no painel (liga o card da página inicial)
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  steps: { title: string; text: string }[]
  photoCategories: string[] // categorias do portfólio no Sanity
  photosTitle: string
  faqs: FaqItem[]
  whatsappMessage: string
}

export const SERVICE_PAGES: ServicePage[] = [
  {
    slug: 'mudanca',
    name: 'Organização de mudança',
    serviceTitle: 'Pré e Pós Mudança',
    metaTitle: 'Organização de Mudança em Palhoça e Florianópolis | Isa Paglioni',
    metaDescription:
      'Personal organizer especialista em mudanças: desapego, embalagem com etiquetas, acompanhamento no dia e casa nova organizada. Orçamento pelo WhatsApp.',
    h1: 'Organização de mudança em Palhoça e Grande Florianópolis',
    intro:
      'Mudança é a minha especialidade. Cuido de tudo, do desapego antes de embalar até a casa nova arrumada e funcionando.',
    steps: MOVE_STEPS,
    photoCategories: ['Cozinha', 'Closet', 'Despensa', 'Cristaleira', 'Baby', 'Lavanderia', 'Escritório', 'Mudança'],
    photosTitle: 'Ambientes que organizei',
    faqs: [FAQ_ITEMS.mudancaIncluso, FAQ_ITEMS.orcamento, FAQ_ITEMS.materiais, FAQ_ITEMS.regioes],
    whatsappMessage: 'Olá Isa! Vi seu site e quero um orçamento para organização de mudança.',
  },
  {
    slug: 'organizacao-residencial',
    name: 'Organização residencial',
    serviceTitle: 'Organização Residencial',
    metaTitle: 'Organização Residencial em Palhoça e Florianópolis | Isa Paglioni',
    metaDescription:
      'Organização de closet, cozinha, despensa, cristaleira e lavanderia em Palhoça e Grande Florianópolis, fácil de manter. Orçamento pelo WhatsApp.',
    h1: 'Organização residencial em Palhoça e Grande Florianópolis',
    intro:
      'Organizo closets, cozinhas, despensas, cristaleiras e lavanderias para a casa ficar prática no dia a dia. Cada espaço é pensado para a sua rotina, para continuar em ordem depois.',
    steps: GENERAL_STEPS,
    photoCategories: ['Closet', 'Cozinha', 'Despensa', 'Cristaleira', 'Lavanderia', 'Escritório'],
    photosTitle: 'Ambientes que organizei',
    faqs: [FAQ_ITEMS.orcamento, FAQ_ITEMS.materiais, FAQ_ITEMS.regioes],
    whatsappMessage: 'Olá Isa! Vi seu site e quero um orçamento para organizar a minha casa.',
  },
  {
    slug: 'organizacao-baby',
    name: 'Organização do quarto do bebê',
    serviceTitle: 'Organização Baby',
    metaTitle: 'Organização do Quarto do Bebê em Florianópolis | Isa Paglioni',
    metaDescription:
      'Preparo o quarto e o enxoval para a chegada do bebê em Palhoça e Grande Florianópolis, com praticidade para os pais. Orçamento pelo WhatsApp.',
    h1: 'Organização do quarto e do enxoval do bebê',
    intro:
      'Preparo o quarto e o enxoval para a chegada do bebê, para os pais terem praticidade e conforto no dia a dia. Atendo em Palhoça e na Grande Florianópolis.',
    steps: GENERAL_STEPS,
    photoCategories: ['Baby'],
    photosTitle: 'Quartos de bebê que organizei',
    faqs: [FAQ_ITEMS.orcamento, FAQ_ITEMS.materiais, FAQ_ITEMS.regioes],
    whatsappMessage: 'Olá Isa! Vi seu site e quero um orçamento para organizar o quarto do bebê.',
  },
]

export const getServicePage = (slug: string) => SERVICE_PAGES.find((p) => p.slug === slug)

// Liga o título do serviço cadastrado no painel à página dele, quando existe
export const servicePageHref = (serviceTitle?: string) => {
  const page = SERVICE_PAGES.find((p) => p.serviceTitle === serviceTitle)
  return page ? `/${page.slug}` : undefined
}
