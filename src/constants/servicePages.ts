import { FAQ_ITEMS, type FaqItem } from './faq'
import { BABY_STEPS, HOME_STEPS, MOVE_STEPS } from './steps'

export type ServicePage = {
  slug: string
  name: string // nome curto, usado em links e no breadcrumb
  serviceTitle: string // título do serviço no painel (liga o card da página inicial)
  metaTitle: string
  metaDescription: string
  h1: string
  intro: string
  steps: { title: string; text: string }[]
  // Seção com detalhes práticos (tempo, quando chamar, dicas). Título em duas partes: normal + itálico rosa
  details?: { heading: [string, string]; items: { title: string; text: string }[] }
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
      'Mudança é a minha especialidade. Cuido de tudo, do desapego antes de embalar até a casa nova organizada e funcionando.',
    steps: MOVE_STEPS,
    details: {
      heading: ['Na', 'prática.'],
      items: [
        {
          title: 'Quando me chamar',
          text: 'Não existe um prazo certo. Quando você começar a pensar em mudar, já pense também na organização.',
        },
        {
          title: 'Quanto tempo leva',
          text: 'Um apartamento pequeno pode ser organizado em 1 dia, dependendo da equipe. Uma casa grande leva, em média, de 2 a 4 dias.',
        },
        {
          title: 'Do pequeno ao grande',
          text: 'Atendo de apartamentos pequenos a casas grandes, sozinha ou com equipe, de acordo com o tamanho da mudança.',
        },
      ],
    },
    photoCategories: ['Cozinha', 'Closet', 'Despensa', 'Cristaleira', 'Baby', 'Lavanderia', 'Escritório', 'Mudança'],
    photosTitle: 'Ambientes que organizei',
    faqs: [
      FAQ_ITEMS.mudancaIncluso,
      FAQ_ITEMS.quandoMudanca,
      FAQ_ITEMS.tempoMudanca,
      FAQ_ITEMS.presenca,
      FAQ_ITEMS.orcamento,
      FAQ_ITEMS.materiais,
      FAQ_ITEMS.regioes,
    ],
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
      'Organizo closets, cozinhas, despensas, cristaleiras e lavanderias com método: cada coisa ganha um local definido, pensado para a sua rotina. Assim a casa continua organizada depois que eu vou embora.',
    steps: HOME_STEPS,
    details: {
      heading: ['Em cada', 'ambiente.'],
      items: [
        {
          title: 'Closet',
          text: 'Tiro todas as peças, separo por categoria e estudo o espaço antes de decidir o que dobrar e o que pendurar. Leva de 1 a 2 dias, dependendo da quantidade de peças. Closets com acervo muito grande já levaram 3 dias.',
        },
        {
          title: 'Cozinha',
          text: 'Separo os utensílios por categoria, pensando em como você usa a cozinha no dia a dia, para cada coisa ficar perto de onde é usada. Leva de meio dia a 1 dia.',
        },
        {
          title: 'Despensa',
          text: 'Confiro a validade de tudo e separo por categoria: enlatados com enlatados, farinhas com farinhas, grãos com grãos.',
        },
        {
          title: 'Você não precisa estar junto',
          text: 'Na maioria das vezes eu organizo sem você precisar acompanhar. No closet, você pode participar da triagem das peças, se quiser.',
        },
      ],
    },
    photoCategories: ['Closet', 'Cozinha', 'Despensa', 'Cristaleira', 'Lavanderia', 'Escritório'],
    photosTitle: 'Ambientes que organizei',
    faqs: [FAQ_ITEMS.tempoResidencial, FAQ_ITEMS.presenca, FAQ_ITEMS.duracao, FAQ_ITEMS.orcamento, FAQ_ITEMS.materiais, FAQ_ITEMS.regioes],
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
      'Preparo o quarto e o enxoval para a chegada do bebê, com tudo separado por tamanho e etiquetado, para os primeiros dias serem mais tranquilos. Atendo em Palhoça e na Grande Florianópolis.',
    steps: BABY_STEPS,
    details: {
      heading: ['Bom', 'saber.'],
      items: [
        {
          title: 'Quando me chamar',
          text: 'O ideal é a partir do 6º mês de gestação. O quarto geralmente fica pronto em 1 dia, ou menos.',
        },
        {
          title: 'A dica que sempre dou',
          text: 'Deixe tudo à mão: na primeira gaveta, os itens de troca; na segunda, as roupinhas de recém-nascido. Nos primeiros dias, nem sempre é a mãe que vai pegar a roupa. Com tudo etiquetado, o pai, a avó ou a babá abrem a gaveta e acham o body ou a calça sem precisar perguntar.',
        },
      ],
    },
    photoCategories: ['Baby'],
    photosTitle: 'Quartos de bebê que organizei',
    faqs: [FAQ_ITEMS.quandoBebe, FAQ_ITEMS.enxoval, FAQ_ITEMS.orcamento, FAQ_ITEMS.materiais, FAQ_ITEMS.regioes],
    whatsappMessage: 'Olá Isa! Vi seu site e quero um orçamento para organizar o quarto do bebê.',
  },
]

export const getServicePage = (slug: string) => SERVICE_PAGES.find((p) => p.slug === slug)

// Liga o título do serviço cadastrado no painel à página dele, quando existe
export const servicePageHref = (serviceTitle?: string) => {
  const page = SERVICE_PAGES.find((p) => p.serviceTitle === serviceTitle)
  return page ? `/${page.slug}` : undefined
}
