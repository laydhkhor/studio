import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schema'
import {apiVersion, dataset, projectId} from './client'
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
        origin: 'http://localhost:9002',
        preview: '/api/draft',
      },
    }),
    visionTool({defaultApiVersion: apiVersion}),
  ],
})
