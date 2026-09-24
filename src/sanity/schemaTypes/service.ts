import { createElement } from 'react'
import { defineType, defineField } from 'sanity'
import { HandHeart, Sparkles } from 'lucide-react'
import { orderRankField, orderRankOrdering } from '@sanity/orderable-document-list'
import { IconPicker, getIcon } from '../components/IconPicker'

export default defineType({
  name: 'service',
  title: 'Serviços',
  type: 'document',
  icon: HandHeart,
  orderings: [{ ...orderRankOrdering, title: 'Ordem do site' }],
  fields: [
    orderRankField({ type: 'service' }),
    defineField({
      name: 'title',
      title: 'Nome do serviço',
      type: 'string',
      description: 'Ex: “Organização Residencial”.',
      validation: (rule) => rule.required().error('Dê um nome ao serviço.'),
    }),
    defineField({
      name: 'description',
      title: 'Descrição',
      type: 'text',
      rows: 3,
      description: 'Um texto curto explicando o serviço (ideal: até 200 caracteres).',
      validation: (rule) => [
        rule.required().error('Escreva uma descrição.'),
        rule.max(200).warning('Textos longos podem ficar cansativos no card. Tente resumir.'),
      ],
    }),
    defineField({
      name: 'icon',
      title: 'Ícone',
      type: 'string',
      description: 'Clique no ícone que melhor representa o serviço.',
      components: { input: IconPicker },
    }),
  ],
  preview: {
    select: { title: 'title', subtitle: 'description', icon: 'icon' },
    prepare: ({ title, subtitle, icon }) => ({
      title: title || 'Serviço sem nome',
      subtitle,
      media: createElement(getIcon(icon) ?? Sparkles),
    }),
  },
})
