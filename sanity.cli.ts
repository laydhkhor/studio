import {defineCliConfig} from 'sanity/cli'
import {dataset, projectId} from './src/sanity/client'

export default defineCliConfig({
  api: {
    projectId,
    dataset,
  },
})
