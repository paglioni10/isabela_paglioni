import type { MetadataRoute } from 'next'
import { SITE_CONTENT } from '../constants/content'
import { SERVICE_PAGES } from '../constants/servicePages'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_CONTENT.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
    ...SERVICE_PAGES.map((p) => ({
      url: `${SITE_CONTENT.url}/${p.slug}`,
      lastModified: new Date(),
      changeFrequency: 'monthly' as const,
      priority: 0.8,
    })),
    {
      url: `${SITE_CONTENT.url}/privacidade`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.2,
    },
  ]
}
