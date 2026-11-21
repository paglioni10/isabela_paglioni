import type { MetadataRoute } from 'next'
import { SITE_CONTENT } from '../constants/content'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: '/admin' },
    sitemap: `${SITE_CONTENT.url}/sitemap.xml`,
  }
}
