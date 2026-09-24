import { defineType, defineField } from 'sanity'
import { Images } from 'lucide-react'

export const PORTFOLIO_CATEGORIES = [
  { title: 'Cozinha', value: 'Cozinha' },
  { title: 'Closet', value: 'Closet' },
  { title: 'Baby', value: 'Baby' },
  { title: 'Escritório', value: 'Escritório' },
  { title: 'Mudança', value: 'Mudança' },
  { title: 'Lavanderia', value: 'Lavanderia' },
  { title: 'Cristaleira', value: 'Cristaleira' },
  { title: 'Despensa', value: 'Despensa' },
]

export default defineType({
  name: 'portfolio',
  type: 'document',
  title: 'Portfólio',
  icon: Images,
  fields: [
    defineField({
      name: 'mainImage',
      type: 'image',
      title: 'Foto do projeto',
      description: 'Dica: depois de enviar, clique no ícone de recorte para escolher a parte mais importante da foto.',
      options: { hotspot: true },
      validation: (rule) => rule.required().error('Envie uma foto do projeto.'),
    }),
    defineField({
      name: 'title',
      type: 'string',
      title: 'Nome do projeto',
      description: 'Ex: “Closet da Ana” ou “Cozinha planejada em Moema”.',
      validation: (rule) => rule.required().error('Dê um nome ao projeto.'),
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      description: 'Em qual filtro do portfólio esta foto vai aparecer.',
      type: 'string',
      options: { list: PORTFOLIO_CATEGORIES, layout: 'radio', direction: 'horizontal' },
      validation: (rule) => rule.required().error('Escolha uma categoria.'),
    }),
  ],
  preview: {
    select: { title: 'title', category: 'category', media: 'mainImage' },
    prepare: ({ title, category, media }) => ({
      title: title || 'Projeto sem nome',
      subtitle: category ? `📁 ${category}` : '⚠️ Sem categoria',
      media,
    }),
  },
  orderings: [
    { title: 'Nome (A–Z)', name: 'titleAsc', by: [{ field: 'title', direction: 'asc' }] },
    { title: 'Categoria', name: 'categoryAsc', by: [{ field: 'category', direction: 'asc' }] },
  ],
})
