import type { StructureResolver } from 'sanity/structure'
import { FolderOpen, HandHeart, Images, Lightbulb, MessageCircleHeart } from 'lucide-react'
import { PORTFOLIO_CATEGORIES } from './schemaTypes/portfolio'

// https://www.sanity.io/docs/structure-builder-cheat-sheet
export const structure: StructureResolver = (S) =>
  S.list()
    .title('O que você quer editar?')
    .items([
      S.listItem()
        .title('Portfólio')
        .icon(Images)
        .child(
          S.list()
            .title('Portfólio')
            .items([
              S.listItem()
                .title('Todas as fotos')
                .icon(Images)
                .child(S.documentTypeList('portfolio').title('Todas as fotos')),
              S.divider(),
              ...PORTFOLIO_CATEGORIES.map(({ title, value }) =>
                S.listItem()
                  .id(`portfolio-${value}`)
                  .title(title)
                  .icon(FolderOpen)
                  .child(
                    S.documentList()
                      .title(title)
                      .schemaType('portfolio')
                      .filter('_type == "portfolio" && category == $category')
                      .params({ category: value })
                      .initialValueTemplates([
                        S.initialValueTemplateItem('portfolio-por-categoria', { category: value }),
                      ])
                  )
              ),
            ])
        ),
      S.divider(),
      S.documentTypeListItem('service').title('Serviços').icon(HandHeart),
      S.documentTypeListItem('testimonial').title('Depoimentos').icon(MessageCircleHeart),
      S.documentTypeListItem('dicas').title('Dicas de Organização').icon(Lightbulb),
    ])
