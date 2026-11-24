import { defineArrayMember, defineField, defineType, type PreviewValue } from 'sanity'
import { Instagram } from 'lucide-react'

// Etapas de um post, do rascunho até a publicação
export const POST_STATUS = [
  { title: 'Rascunho (ainda não foi para a Isa)', value: 'rascunho' },
  { title: 'Para aprovar', value: 'aguardando' },
  { title: 'Ajuste pedido', value: 'ajuste' },
  { title: 'Aprovado (agendado)', value: 'aprovado' },
  { title: 'Publicando (o Instagram está processando)', value: 'publicando' },
  { title: 'Publicado', value: 'publicado' },
  { title: 'Erro ao publicar', value: 'erro' },
] as const

export const POST_FORMATS = [
  { title: 'Reel', value: 'reel' },
  { title: 'Carrossel', value: 'carrossel' },
  { title: 'Foto', value: 'foto' },
  { title: 'Story', value: 'story' },
] as const

const statusTitle = (value?: string) => POST_STATUS.find((s) => s.value === value)?.title ?? value
// A prévia recebe a referência do primeiro arquivo; o prefixo diz se é foto ou vídeo
const isImage = (asset?: { _ref?: string }) => (asset?._ref ?? '').startsWith('image-')
const formatTitle = (value?: string) => POST_FORMATS.find((f) => f.value === value)?.title ?? value

export default defineType({
  name: 'instagramPost',
  title: 'Post do Instagram',
  type: 'document',
  icon: Instagram,
  groups: [
    { name: 'post', title: 'Post', default: true },
    { name: 'publicacao', title: 'Publicação' },
  ],
  fields: [
    defineField({
      name: 'status',
      title: 'Situação',
      type: 'string',
      group: 'post',
      options: { list: [...POST_STATUS], layout: 'dropdown' },
      initialValue: 'rascunho',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'format',
      title: 'Formato',
      type: 'string',
      group: 'post',
      options: { list: [...POST_FORMATS], layout: 'radio', direction: 'horizontal' },
      initialValue: 'reel',
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'scheduledAt',
      title: 'Data e hora da publicação',
      type: 'datetime',
      group: 'post',
      options: { timeStep: 15 },
    }),
    defineField({
      name: 'media',
      title: 'Fotos e vídeos',
      description: 'Na ordem em que vão aparecer. Reel: um vídeo. Carrossel: até 10 itens.',
      type: 'array',
      group: 'post',
      of: [
        defineArrayMember({ type: 'image', title: 'Foto', options: { hotspot: true } }),
        defineArrayMember({ type: 'file', title: 'Vídeo', options: { accept: 'video/*' } }),
      ],
      validation: (r) => r.min(1).max(10),
    }),
    defineField({
      name: 'cover',
      title: 'Capa do reel',
      description: 'Opcional. Se ficar vazio, o Instagram usa o primeiro quadro do vídeo.',
      type: 'image',
      group: 'post',
      hidden: ({ document }) => document?.format !== 'reel',
    }),
    defineField({
      name: 'caption',
      title: 'Legenda',
      description: 'Texto completo, já com as hashtags no final.',
      type: 'text',
      rows: 10,
      group: 'post',
      validation: (r) => r.max(2200),
    }),
    defineField({
      name: 'reason',
      title: 'Por que este post',
      description: 'Explicação da equipe: objetivo do post e por que estas fotos.',
      type: 'text',
      rows: 3,
      group: 'post',
    }),
    defineField({
      name: 'feedback',
      title: 'Pedido de ajuste da Isa',
      type: 'text',
      rows: 3,
      group: 'post',
    }),
    defineField({ name: 'approvedAt', title: 'Aprovado em', type: 'datetime', group: 'publicacao', readOnly: true }),
    defineField({ name: 'publishedAt', title: 'Publicado em', type: 'datetime', group: 'publicacao', readOnly: true }),
    defineField({ name: 'permalink', title: 'Link no Instagram', type: 'url', group: 'publicacao', readOnly: true }),
    defineField({
      name: 'error',
      title: 'Erro',
      description: 'Para tentar de novo, corrija o problema e mude a situação para "Aprovado".',
      type: 'text',
      rows: 3,
      group: 'publicacao',
      readOnly: true,
    }),
    // Controle interno do publicador automático
    defineField({ name: 'sentAt', title: 'Enviado ao Instagram em', type: 'datetime', group: 'publicacao', readOnly: true }),
    defineField({ name: 'containerId', title: 'ID do envio', type: 'string', group: 'publicacao', readOnly: true, hidden: true }),
    defineField({ name: 'mediaId', title: 'ID do post no Instagram', type: 'string', group: 'publicacao', readOnly: true, hidden: true }),
    // Controle das notificações no celular
    defineField({ name: 'notifiedAt', title: 'Isa avisada em', type: 'datetime', group: 'publicacao', readOnly: true, hidden: true }),
    defineField({ name: 'remindedAt', title: 'Lembrete enviado em', type: 'datetime', group: 'publicacao', readOnly: true, hidden: true }),
    defineField({ name: 'ajusteNotifiedAt', title: 'Equipe avisada do ajuste em', type: 'datetime', group: 'publicacao', readOnly: true, hidden: true }),
  ],
  orderings: [
    { title: 'Data de publicação', name: 'scheduledAsc', by: [{ field: 'scheduledAt', direction: 'asc' }] },
  ],
  preview: {
    select: { caption: 'caption', status: 'status', format: 'format', scheduledAt: 'scheduledAt', media: 'media.0.asset' },
    prepare({ caption, status, format, scheduledAt, media }) {
      const when = scheduledAt
        ? new Date(scheduledAt).toLocaleString('pt-BR', {
            timeZone: 'America/Sao_Paulo',
            day: '2-digit',
            month: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
          })
        : 'sem data'
      return {
        title: caption ? caption.split('\n')[0].slice(0, 80) : 'Post sem legenda',
        subtitle: `${formatTitle(format)} · ${when} · ${statusTitle(status)}`,
        // Vídeo não tem miniatura no painel; mostra o ícone
        // O Sanity aceita um objeto de imagem aqui, embora o tipo não declare
        media: isImage(media) ? ({ _type: 'image', asset: media } as unknown as PreviewValue['media']) : Instagram,
      }
    },
  },
})
