/**
 * Painel (Sanity Studio) em /admin. Todas as rotas abaixo dele passam por este arquivo.
 * https://github.com/sanity-io/next-sanity
 */

import type { Metadata } from 'next'
import { NextStudio } from 'next-sanity/studio'
import { metadata as studioMetadata } from 'next-sanity/studio'
import config from '../../../../sanity.config'

export const dynamic = 'force-static'

export { viewport } from 'next-sanity/studio'

// Permite instalar o painel como app no celular (só nesta parte do site)
export const metadata: Metadata = {
  ...studioMetadata,
  title: 'Painel da Isa',
  manifest: '/painel/manifest.webmanifest',
  appleWebApp: { capable: true, title: 'Painel da Isa', statusBarStyle: 'default' },
  icons: { apple: '/painel/icon-maskable-512.png' },
}

export default function StudioPage() {
  return <NextStudio config={config} />
}
