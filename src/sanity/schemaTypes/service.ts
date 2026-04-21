export default {
  name: 'service',
  title: 'Serviços',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título do Serviço',
      type: 'string',
    },
    {
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 3,
    },
    {
      name: 'icon',
      title: 'Ícone (Nome do Lucide)',
      type: 'string',
      description: 'Acesse lucide.dev para ver as opções. Digite o nome exatamente como aparece lá (ex: Wine, Heart, Star).',
    },
  ],
}