// Perguntas frequentes. Só entram aqui fatos confirmados pela Isa.
// Usado na seção FAQ, nas páginas de serviço e nos dados estruturados (FAQPage).
export type FaqItem = { q: string; a: string }

export const FAQ_ITEMS = {
  orcamento: {
    q: 'Como é feito o orçamento?',
    a: 'Pelo WhatsApp. Você me manda fotos ou vídeos dos ambientes e eu passo o valor, sem precisar de visita. Normalmente cobro por dia de trabalho.',
  },
  mudancaIncluso: {
    q: 'O que está incluso na organização de mudança?',
    a: 'Planejamento e desapego antes de embalar, embalagem com etiquetas por cômodo, acompanhamento no dia da mudança e, na casa nova, desembalar e organizar cada cômodo.',
  },
  soMudanca: {
    q: 'Você organiza só mudanças?',
    a: 'Não. Mudança é a minha especialidade, mas organizo a casa inteira: closet, cozinha, despensa, lavanderia, cristaleira, quarto do bebê e a casa de quem acabou de casar.',
  },
  materiais: {
    q: 'Preciso comprar caixas e organizadores?',
    a: 'Depende do caso. Combinamos na conversa, de acordo com o que você já tem em casa e com o que cada espaço precisa.',
  },
  regioes: {
    q: 'Quais regiões você atende?',
    a: 'Atendo presencialmente em Palhoça e na Grande Florianópolis. Para outras cidades, faço consultoria online.',
  },
} satisfies Record<string, FaqItem>

// Ordem usada na página inicial
export const FAQ: FaqItem[] = [
  FAQ_ITEMS.orcamento,
  FAQ_ITEMS.mudancaIncluso,
  FAQ_ITEMS.soMudanca,
  FAQ_ITEMS.materiais,
  FAQ_ITEMS.regioes,
]
