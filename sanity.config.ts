import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './src/sanity/schema'
import {apiVersion, dataset, projectId} from './src/sanity/client'
import {presentationTool} from 'sanity/presentation'

export default defineConfig({
  basePath: '/cms',
  projectId,
  dataset,
  schema: {
    types: schemaTypes,
  },
  plugins: [
    structureTool(),
    presentationTool({
      previewUrl: {
        origin: typeof location === 'undefined' ? 'http://localhost:9002' : location.origin,
        preview: '/api/draft',
      },
    }),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
