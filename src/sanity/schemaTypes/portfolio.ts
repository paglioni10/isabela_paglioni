import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'portfolio',
  type: 'document',
  title: 'Portfólio',
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      title: 'Título do Projeto',
    }),
    defineField({
      name: 'mainImage',
      type: 'image',
      title: 'Foto Principal',
      options: { hotspot: true },
    }),
    defineField({
      name: 'category',
      title: 'Categoria',
      type: 'string',
      options: {
      list: [
      { title: 'Cozinha', value: 'Cozinha' },
      { title: 'Closet', value: 'Closet' },
      { title: 'Baby', value: 'Baby' },
      { title: 'Escritório', value: 'Escritório' },
      { title: 'Mudança', value: 'Mudança' },
      { title: 'Lavanderia', value: 'Lavanderia' },
      { title: 'Cristaleira', value: 'Cristaleira' },
      { title: 'Despensa', value: 'Despensa' },
        ],
      },
    }),
  ],
})