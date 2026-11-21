import { SITE_CONTENT } from '../constants/content'
import { FAQ } from '../constants/faq'

// Dados estruturados (JSON-LD): explicam ao Google e às IAs quem é a Isa,
// o que ela faz e onde atende. Não incluir avaliações (AggregateRating) sem
// avaliações verificáveis publicadas no próprio site.
export default function StructuredData({ services }: { services: { title?: string; description?: string }[] }) {
  const { url, contact, brand } = SITE_CONTENT

  const data = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'ProfessionalService',
        '@id': `${url}/#negocio`,
        name: `${brand.name} ${brand.title}`,
        alternateName: 'Isabela Paglioni Personal Organizer',
        description:
          'Personal organizer especialista em mudanças: embala, desembala e organiza a casa inteira em Palhoça e Grande Florianópolis.',
        url,
        image: `${url}/foto_isa.jpg`,
        telephone: contact.phone,
        email: contact.email,
        sameAs: [contact.instagram],
        areaServed: [
          { '@type': 'City', name: 'Palhoça' },
          { '@type': 'City', name: 'Florianópolis' },
          { '@type': 'AdministrativeArea', name: 'Grande Florianópolis' },
        ],
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Palhoça',
          addressRegion: 'SC',
          addressCountry: 'BR',
        },
        founder: { '@id': `${url}/#isabela` },
        hasOfferCatalog: {
          '@type': 'OfferCatalog',
          name: 'Serviços de organização',
          itemListElement: services
            .filter((s) => s.title)
            .map((s) => ({
              '@type': 'Offer',
              itemOffered: { '@type': 'Service', name: s.title, description: s.description },
            })),
        },
      },
      {
        '@type': 'Person',
        '@id': `${url}/#isabela`,
        name: 'Isabela Paglioni',
        jobTitle: 'Personal Organizer',
        image: `${url}/foto_isa.jpg`,
        sameAs: [contact.instagram],
        worksFor: { '@id': `${url}/#negocio` },
      },
      {
        '@type': 'FAQPage',
        '@id': `${url}/#duvidas`,
        mainEntity: FAQ.map((item) => ({
          '@type': 'Question',
          name: item.q,
          acceptedAnswer: { '@type': 'Answer', text: item.a },
        })),
      },
      {
        '@type': 'WebSite',
        '@id': `${url}/#site`,
        url,
        name: `${brand.name} ${brand.title}`,
        inLanguage: 'pt-BR',
        publisher: { '@id': `${url}/#negocio` },
      },
    ],
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }}
    />
  )
}
