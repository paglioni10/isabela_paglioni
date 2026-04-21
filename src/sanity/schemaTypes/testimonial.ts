export default {
  name: 'testimonial',
  title: 'Depoimentos',
  type: 'document',
  fields: [
    {
      name: 'clientName',
      title: 'Nome da Cliente',
      type: 'string',
    },
    {
      name: 'videoUrl',
      title: 'Link do Vídeo (YouTube)',
      type: 'url',
      description: 'Cole o link do depoimento no YouTube.'
    },
    {
      name: 'image',
      title: 'Foto da Cliente (Opcional)',
      type: 'image',
      options: { hotspot: true }
    }
  ],
}