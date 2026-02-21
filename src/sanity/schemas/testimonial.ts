import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'testimonial',
  title: 'Testimonial',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'Name', type: 'string' }),
    defineField({ name: 'location', title: 'Location', type: 'string' }),
    defineField({ name: 'rating', title: 'Rating (1-5)', type: 'number', validation: Rule => Rule.min(1).max(5) }),
    defineField({ name: 'date', title: 'Date', type: 'datetime' }),
    defineField({ name: 'avatar', title: 'Avatar', type: 'image', options: { hotspot: true } }),
    defineField({ name: 'avatarHint', title: 'Avatar AI Hint', type: 'string' }),
    defineField({ name: 'comment', title: 'Comment', type: 'text' }),
  ],
})
