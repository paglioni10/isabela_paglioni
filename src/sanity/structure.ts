import type { StructureResolver } from 'sanity/structure'
import { orderableDocumentListDeskItem } from '@sanity/orderable-document-list'
import { FolderOpen, HandHeart, Images, Lightbulb, MessageCircleHeart } from 'lucide-react'
import { PORTFOLIO_CATEGORIES } from './schemaTypes/portfolio'

// IDs da estrutura não aceitam acentos/espaços (ex: "Escritório" -> "escritorio")
const toId = (text: string) =>
  text.normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-zA-Z0-9]+/g, '-').toLowerCase()

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S, context) =>
  S.list()
    .title('O que você quer editar?')
    .items([
      S.listItem()
        .title('Portfólio')
        .icon(Images)
        .child(
          S.list()
            .title('Portfólio (arraste para ordenar dentro de cada categoria)')
            .items([
              S.listItem()
                .title('Todas as fotos')
                .icon(Images)
                .child(S.documentTypeList('portfolio').title('Todas as fotos')),
              S.divider(),
              // Cada categoria é uma lista de arrastar e soltar
              ...PORTFOLIO_CATEGORIES.map(({ title, value }) =>
                orderableDocumentListDeskItem({
                  type: 'portfolio',
                  id: `portfolio-${toId(value)}`,
                  title,
                  icon: FolderOpen,
                  filter: 'category == $category',
                  params: { category: value },
                  createIntent: false,
                  menuItems: [
                    S.menuItem()
                      .title(`Adicionar foto em ${title}`)
                      .intent({
                        type: 'create',
                        params: [
                          { type: 'portfolio', template: 'portfolio-por-categoria' },
                          { category: value },
                        ],
                      })
                      .serialize(),
                  ],
                  S,
                  context,
                })
              ),
            ])
        ),
      S.divider(),
      orderableDocumentListDeskItem({
        type: 'service',
        id: 'servicos',
        title: 'Serviços',
        icon: HandHeart,
        createIntent: false,
        menuItems: [
          S.menuItem()
            .title('Adicionar serviço')
            .intent({ type: 'create', params: { type: 'service' } })
            .serialize(),
        ],
        S,
        context,
      }),
      S.documentTypeListItem('testimonial').title('Depoimentos').icon(MessageCircleHeart),
      S.documentTypeListItem('dicas').title('Dicas de Organização').icon(Lightbulb),
    ])
