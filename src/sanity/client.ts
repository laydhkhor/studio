import { createClient } from '@sanity/client'

export const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!
export const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!
export const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION!
export const token = process.env.SANITY_API_READ_TOKEN!
export const previewSecret = process.env.SANITY_PREVIEW_SECRET!

export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: true,
})

export const previewClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token,
})

export function getClient(preview: boolean = false) {
  return preview ? previewClient : client
}
