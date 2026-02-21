import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'pricing',
  title: 'Pricing Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text' }),
    defineField({
      name: 'pricingOptions',
      title: 'Pricing Options',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'type', title: 'Type', type: 'string' }),
          defineField({ name: 'platform', title: 'Platform', type: 'string' }),
          defineField({ name: 'price', title: 'Price', type: 'string' }),
          defineField({ name: 'description', title: 'Description', type: 'string' }),
          defineField({ name: 'cta', title: 'CTA Text', type: 'string' }),
          defineField({ name: 'tag', title: 'Tag', type: 'string' }),
          defineField({
            name: 'features',
            title: 'Features',
            type: 'array',
            of: [defineArrayMember({ type: 'string' })]
          }),
        ]
      })]
    }),
    defineField({
      name: 'consultationFeatures',
      title: 'Consultation Features Comparison',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        name: 'featureCategory',
        fields: [
          defineField({ name: 'category', title: 'Category', type: 'string' }),
          defineField({
            name: 'items',
            title: 'Items',
            type: 'array',
            of: [defineArrayMember({
              type: 'object',
              fields: [
                defineField({ name: 'feature', title: 'Feature', type: 'string' }),
                defineField({ name: 'chat', title: 'Chat', type: 'string' }), // Use string to handle boolean or text
                defineField({ name: 'video', title: 'Video', type: 'string' }),
                defineField({ name: 'clinic', title: 'Clinic', type: 'string' }),
              ]
            })]
          })
        ]
      })]
    })
  ],
})
