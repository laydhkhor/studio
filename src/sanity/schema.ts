import { type SchemaTypeDefinition } from 'sanity'
import blockContent from './schemas/blockContent'
import post from './schemas/post'
import author from './schemas/author'
import category from './schemas/category'
import home from './schemas/home'
import about from './schemas/about'
import pricing from './schemas/pricing'
import clinic from './schemas/clinic'
import testimonial from './schemas/testimonial'
import faq from './schemas/faq'
import settings from './schemas/settings'

export const schemaTypes: SchemaTypeDefinition[] = [
  post,
  author,
  category,
  blockContent,
  home,
  about,
  pricing,
  clinic,
  testimonial,
  faq,
  settings
]
