export default {
  name: 'dicas',
  title: 'Dicas de Organização',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Título da Dica',
      type: 'string',
    },
    {
      name: 'videoUrl', 
      title: 'Link do Vídeo (YouTube)',
      type: 'url',
      description: 'Cole o link do vídeo do YouTube aqui (ex: https://www.youtube.com/watch?v=...) '
    }
  ],
}