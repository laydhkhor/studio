import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'settings',
  title: 'Site Settings',
  type: 'document',
  fields: [
    defineField({
      name: 'navLinks',
      title: 'Navigation Links',
      type: 'array',
      of: [defineArrayMember({
          type: 'object',
          fields: [
              defineField({ name: 'href', title: 'URL', type: 'string' }),
              defineField({ name: 'label', title: 'Label', type: 'string' }),
          ]
      })]
    }),
    defineField({
        name: 'clinicInfo',
        title: 'Clinic Info',
        type: 'object',
        fields: [
            defineField({ name: 'address', title: 'Address', type: 'string' }),
            defineField({ name: 'phone', title: 'Phone', type: 'string' }),
            defineField({ name: 'email', title: 'Email', type: 'string' }),
        ]
    })
  ],
})
