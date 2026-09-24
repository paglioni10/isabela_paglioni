'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `\src\app\admin\[[...tool]]\page.tsx` route
 */

import {visionTool} from '@sanity/vision'
import {buildLegacyTheme, defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'

// Go to https://www.sanity.io/docs/api-versioning to learn how API versioning works
import {apiVersion, dataset, projectId} from './src/sanity/env'
import {schema} from './src/sanity/schemaTypes'
import {structure} from './src/sanity/structure'
import {StudioIcon, StudioLogo} from './src/sanity/components/StudioLogo'

// Cores da identidade visual do site
const pink = '#DB2777'
const theme = buildLegacyTheme({
  '--black': '#1a1a1a',
  '--white': '#fff',
  '--gray': '#6b7280',
  '--gray-base': '#6b7280',
  '--component-bg': '#fff',
  '--component-text-color': '#1a1a1a',
  '--brand-primary': pink,
  '--default-button-color': '#6b7280',
  '--default-button-primary-color': pink,
  '--default-button-success-color': '#16a34a',
  '--default-button-warning-color': '#d97706',
  '--default-button-danger-color': '#dc2626',
  '--state-info-color': pink,
  '--state-success-color': '#16a34a',
  '--state-warning-color': '#d97706',
  '--state-danger-color': '#dc2626',
  '--main-navigation-color': '#FFF5F7',
  '--main-navigation-color--inverted': '#1a1a1a',
  '--focus-color': pink,
})

export default defineConfig({
  basePath: '/admin',
  name: 'default',
  title: 'Painel da Isa',
  icon: StudioIcon,
  projectId,
  dataset,
  theme,
  studio: {components: {logo: StudioLogo}},
  // Add and edit the content schema in the './sanity/schemaTypes' folder
  schema: {
    ...schema,
    templates: (prev) => [
      ...prev,
      {
        id: 'portfolio-por-categoria',
        title: 'Foto do portfólio na categoria',
        schemaType: 'portfolio',
        parameters: [{name: 'category', type: 'string'}],
        value: (params: {category: string}) => ({category: params.category}),
      },
    ],
  },
  plugins: [
    structureTool({structure, title: 'Conteúdo do site'}),
    // Vision (consultas GROQ) só aparece em desenvolvimento, para não confundir no painel
    ...(process.env.NODE_ENV === 'development' ? [visionTool({defaultApiVersion: apiVersion})] : []),
  ],
})
