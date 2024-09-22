import { createClient } from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || '',
  token: process.env.NEXT_PUBLIC_SANITY_TOKEN || '',
  apiVersion: '2024-09-20',
  useCdn: true,
})
