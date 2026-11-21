import type { MetadataRoute } from 'next'
import { SITE_CONTENT } from '../constants/content'

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: SITE_CONTENT.url,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 1,
    },
  ]
}
