// Perguntas frequentes. Só entram aqui fatos confirmados pela Isa
// (respostas em áudio de 22/11/2026).
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
  quandoMudanca: {
    q: 'Com quanto tempo de antecedência devo chamar para a mudança?',
    a: 'Não existe um prazo certo. O ideal é que, quando você começar a pensar em mudar, já pense também na organização.',
  },
  tempoMudanca: {
    q: 'Quantos dias leva a organização da mudança?',
    a: 'Um apartamento pequeno pode ser organizado em 1 dia, dependendo da equipe. Uma casa grande leva, em média, de 2 a 4 dias.',
  },
  soMudanca: {
    q: 'Você organiza só mudanças?',
    a: 'Não. Mudança é a minha especialidade, mas organizo a casa inteira: closet, cozinha, despensa, lavanderia, cristaleira, quarto do bebê e a casa de quem acabou de casar.',
  },
  tempoResidencial: {
    q: 'Quanto tempo leva para organizar um closet ou uma cozinha?',
    a: 'Um closet leva de 1 a 2 dias, dependendo da quantidade de peças e de eu estar sozinha ou com equipe. Closets com acervo muito grande já levaram 3 dias. Uma cozinha leva de meio dia a 1 dia, e só passa disso quando é muito grande, com muita louça.',
  },
  presenca: {
    q: 'Preciso estar em casa durante a organização?',
    a: 'Não. Na maioria das vezes eu organizo sem você precisar acompanhar. No closet, você pode participar da triagem das peças, se quiser. Combinamos tudo isso antes de começar.',
  },
  duracao: {
    q: 'Como a organização se mantém depois que você vai embora?',
    a: 'Organizo com método. Estudo o ambiente e defino um local para cada coisa, usando organizadores onde é preciso. Assim, mesmo quando algo sai do lugar, você ou quem ajuda em casa sabe para onde ele volta.',
  },
  quandoBebe: {
    q: 'Com quantos meses de gestação devo chamar para o quarto do bebê?',
    a: 'O ideal é a partir do 6º mês. O quarto do bebê geralmente fica pronto em 1 dia, ou menos.',
  },
  enxoval: {
    q: 'Você lava e passa o enxoval?',
    a: 'Se você quiser, sim. Lavar e passar o enxoval é opcional e combinado no orçamento. Depois separo tudo por tamanho, organizo as gavetas e etiqueto.',
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
  FAQ_ITEMS.presenca,
  FAQ_ITEMS.duracao,
  FAQ_ITEMS.materiais,
  FAQ_ITEMS.regioes,
]
