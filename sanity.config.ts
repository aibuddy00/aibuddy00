'use client'

/**
 * This configuration is used to for the Sanity Studio that’s mounted on the `/app/studio/[[...tool]]/page.tsx` route
 */

import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schema} from './src/sanity/schemaTypes'

export default defineConfig({
  basePath: '/studio', // Add this line to set the base path
  name: 'default',
  title: 'AI Buddy',

  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schema.types,
  },
})
