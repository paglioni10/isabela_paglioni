import { createElement } from 'react'
import { defineType, defineField } from 'sanity'
import { Lightbulb } from 'lucide-react'
import { getYouTubeId, getYouTubeThumb } from '../lib/youtube'

export default defineType({
  name: 'dicas',
  title: 'Dicas de Organização',
  type: 'document',
  icon: Lightbulb,
  fields: [
    defineField({
      name: 'title',
      title: 'Título da dica',
      type: 'string',
      description: 'Ex: “Como dobrar camisetas em pé”.',
      validation: (rule) => rule.required().error('Dê um título à dica.'),
    }),
    defineField({
      name: 'videoUrl',
      title: 'Link do vídeo no YouTube',
      type: 'url',
      description: 'Abra o vídeo no YouTube, copie o link da barra de endereço e cole aqui.',
      validation: (rule) =>
        rule.required().error('Cole o link do vídeo.').custom((url) =>
          !url || getYouTubeId(url) ? true : 'Esse link não parece ser de um vídeo do YouTube.'
        ),
    }),
  ],
  preview: {
    select: { title: 'title', videoUrl: 'videoUrl' },
    prepare: ({ title, videoUrl }) => {
      const thumb = getYouTubeThumb(videoUrl)
      return {
        title: title || 'Dica sem título',
        subtitle: videoUrl ? '▶ Vídeo no YouTube' : '⚠️ Sem vídeo',
        media: thumb
          ? createElement('img', { src: thumb, alt: '', style: { objectFit: 'cover' } })
          : undefined,
      }
    },
  },
})
