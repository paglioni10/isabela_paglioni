import { createElement } from 'react'
import { defineType, defineField } from 'sanity'
import { MessageCircleHeart } from 'lucide-react'
import { getYouTubeId, getYouTubeThumb } from '../lib/youtube'

export default defineType({
  name: 'testimonial',
  title: 'Depoimentos',
  type: 'document',
  icon: MessageCircleHeart,
  fields: [
    defineField({
      name: 'clientName',
      title: 'Nome da cliente',
      type: 'string',
      validation: (rule) => rule.required().error('Informe o nome da cliente.'),
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
    defineField({
      name: 'image',
      title: 'Foto da cliente (opcional)',
      type: 'image',
      options: { hotspot: true },
    }),
  ],
  preview: {
    select: { title: 'clientName', videoUrl: 'videoUrl', image: 'image' },
    prepare: ({ title, videoUrl, image }) => {
      const thumb = getYouTubeThumb(videoUrl)
      return {
        title: title || 'Depoimento sem nome',
        subtitle: videoUrl ? '▶ Vídeo no YouTube' : '⚠️ Sem vídeo',
        media:
          image ??
          (thumb
            ? createElement('img', { src: thumb, alt: '', style: { objectFit: 'cover' } })
            : undefined),
      }
    },
  },
})
