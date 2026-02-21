import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'home',
  title: 'Home Page',
  type: 'document',
  fields: [
    defineField({
        name: 'title',
        title: 'Title',
        type: 'string',
    }),
    defineField({
        name: 'hero',
        title: 'Hero Section',
        type: 'object',
        fields: [
            defineField({ name: 'kicker', title: 'Kicker', type: 'string' }),
            defineField({ name: 'heading', title: 'Heading', type: 'text', rows: 3 }),
            defineField({ name: 'subheading', title: 'Subheading', type: 'text', rows: 4 }),
            defineField({ name: 'image', title: 'Image', type: 'image', options: { hotspot: true } }),
            defineField({ name: 'imageHint', title: 'Image AI Hint', type: 'string' }),
        ]
    }),
    defineField({
        name: 'featuredBlogs',
        title: 'Featured Blogs Section',
        type: 'object',
        fields: [
            defineField({ name: 'heading', title: 'Heading', type: 'string' }),
            defineField({ name: 'subheading', title: 'Subheading', type: 'string' }),
            defineField({ 
                name: 'blogs', 
                title: 'Featured Blogs', 
                type: 'array', 
                of: [{ type: 'reference', to: { type: 'post' }}] 
            }),
        ]
    })
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
