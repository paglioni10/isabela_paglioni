import type { Metadata } from 'next'
import Image from 'next/image'
import { notFound } from 'next/navigation'
import { ChevronDown } from 'lucide-react'
import { client } from '../../sanity/lib/client'
import { urlFor } from '../../sanity/lib/image'
import { SITE_CONTENT } from '../../constants/content'
import { SERVICE_PAGES, getServicePage } from '../../constants/servicePages'

// Busca o conteúdo do painel de novo a cada minuto
export const revalidate = 60
export const dynamicParams = false

export function generateStaticParams() {
  return SERVICE_PAGES.map((p) => ({ servico: p.slug }))
}

type Props = { params: Promise<{ servico: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getServicePage((await params).servico)
  if (!page) return {}
  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: { canonical: `/${page.slug}` },
    openGraph: { title: page.metaTitle, description: page.metaDescription, url: `/${page.slug}` },
    twitter: { title: page.metaTitle, description: page.metaDescription },
  }
}

type Photo = { _id: string; title?: string; category?: string; mainImage?: unknown }

async function getPhotos(categories: string[]): Promise<Photo[]> {
  try {
    return await client.fetch(
      `*[_type == "portfolio" && category in $categories && defined(mainImage)] | order(orderRank asc)[0...9]{ _id, title, category, mainImage }`,
      { categories }
    )
  } catch {
    return []
  }
}

const link = 'text-[#BE185D] font-bold underline underline-offset-4 hover:text-gray-900'

export default async function ServicePageRoute({ params }: Props) {
  const page = getServicePage((await params).servico)
  if (!page) notFound()

  const photos = await getPhotos(page.photoCategories)
  const { url } = SITE_CONTENT
  const pageUrl = `${url}/${page.slug}`
  const whatsappUrl = `https://wa.me/5548984863549?text=${encodeURIComponent(page.whatsappMessage)}`
  const others = SERVICE_PAGES.filter((p) => p.slug !== page.slug)

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Service',
        '@id': `${pageUrl}/#servico`,
        name: page.name,
        description: page.metaDescription,
        url: pageUrl,
        provider: { '@id': `${url}/#negocio` },
        areaServed: [
          { '@type': 'City', name: 'Palhoça' },
          { '@type': 'City', name: 'Florianópolis' },
          { '@type': 'AdministrativeArea', name: 'Grande Florianópolis' },
        ],
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Início', item: url },
          { '@type': 'ListItem', position: 2, name: page.name, item: pageUrl },
        ],
      },
      {
        '@type': 'FAQPage',
        mainEntity: page.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      },
    ],
  }

  return (
    <article className="pt-28 pb-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, '\\u003c') }}
      />

      {/* Topo */}
      <header className="max-w-4xl mx-auto px-6 pb-16">
        <nav aria-label="Você está em" className="text-sm text-gray-500 mb-8">
          <a href="/" className="hover:text-[#DB2777]">Início</a>
          <span aria-hidden="true"> / </span>
          <span className="text-gray-700">{page.name}</span>
        </nav>
        <h1 className="text-4xl md:text-6xl font-serif font-bold text-gray-900 leading-[1.1] text-balance">
          {page.h1}
        </h1>
        <p className="mt-6 text-lg md:text-xl text-gray-600 leading-relaxed max-w-2xl">{page.intro}</p>
        <a
          href={whatsappUrl}
          data-whatsapp={`pagina_${page.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 inline-block bg-gray-900 text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#DB2777] transition-colors shadow-[0_12px_32px_rgba(17,24,39,0.22)] text-center"
        >
          Pedir orçamento pelo WhatsApp
        </a>
      </header>

      {/* Como funciona */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-12 leading-[1.1]">
            Como <span className="text-[#DB2777] italic">funciona.</span>
          </h2>
          <ol className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${page.steps.length === 4 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
            {page.steps.map((step, i) => (
              <li key={step.title} className="bg-[#FFF5F7] rounded-[32px] p-8 border border-pink-100/60">
                <span className="text-sm font-bold text-[#BE185D]">Etapa {i + 1}</span>
                <h3 className="mt-3 font-serif text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Fotos reais do portfólio */}
      {photos.length > 0 && (
        <section className="py-20">
          <div className="max-w-6xl mx-auto px-6">
            <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-12 leading-[1.1]">
              {page.photosTitle}
            </h2>
            <ul className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6">
              {photos.map((photo) => (
                <li key={photo._id} className="relative aspect-[4/5] rounded-[20px] sm:rounded-[28px] overflow-hidden bg-gray-100">
                  <Image
                    src={urlFor(photo.mainImage).width(800).url()}
                    alt={photo.title || `Ambiente organizado: ${photo.category}`}
                    fill
                    sizes="(min-width: 1024px) 380px, 50vw"
                    className="object-cover"
                  />
                </li>
              ))}
            </ul>
            <p className="mt-8">
              <a href="/#portfolio" className={link}>Ver o portfólio completo</a>
            </p>
          </div>
        </section>
      )}

      {/* Dúvidas */}
      <section className="bg-white py-20">
        <div className="max-w-3xl mx-auto px-6">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 mb-10 leading-[1.1]">
            Dúvidas <span className="text-[#DB2777] italic">frequentes.</span>
          </h2>
          <div className="space-y-4">
            {page.faqs.map((item) => (
              <details
                key={item.q}
                className="group rounded-[24px] border border-pink-100 bg-[#FFF5F7] open:bg-white open:shadow-[0_8px_24px_rgba(219,39,119,0.08)]"
              >
                <summary className="flex items-center justify-between gap-4 cursor-pointer list-none px-6 py-5 md:px-8 md:py-6 font-serif text-xl font-bold text-gray-900 [&::-webkit-details-marker]:hidden">
                  {item.q}
                  <ChevronDown size={22} className="shrink-0 text-[#DB2777] transition-transform duration-300 group-open:rotate-180" aria-hidden="true" />
                </summary>
                <p className="px-6 pb-6 md:px-8 md:pb-7 text-gray-600 text-lg leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Fechamento */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-5xl font-serif font-bold text-gray-900 leading-[1.1] text-balance">
            Vamos conversar sobre a <span className="text-[#DB2777] italic">sua casa?</span>
          </h2>
          <p className="mt-6 text-lg text-gray-600">
            Mande fotos ou vídeos dos ambientes pelo WhatsApp e eu passo o valor.
          </p>
          <a
            href={whatsappUrl}
            data-whatsapp={`pagina_${page.slug}_final`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-block bg-[#DB2777] text-white px-10 py-5 rounded-full font-bold text-sm uppercase tracking-widest hover:bg-[#BE185D] transition-colors"
          >
            Chamar no WhatsApp
          </a>

          <nav aria-label="Outros serviços" className="mt-16 text-gray-600">
            <p className="font-bold text-gray-900 mb-3">Outros serviços</p>
            <ul className="flex flex-wrap justify-center gap-x-6 gap-y-2">
              {others.map((p) => (
                <li key={p.slug}>
                  <a href={`/${p.slug}`} className={link}>{p.name}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </section>
    </article>
  )
}
