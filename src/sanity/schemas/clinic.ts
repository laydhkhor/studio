import {defineField, defineType, defineArrayMember} from 'sanity'

export default defineType({
  name: 'clinicPage',
  title: 'Clinic Page',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string' }),
    defineField({ name: 'subtitle', title: 'Subtitle', type: 'text' }),
    defineField({
      name: 'clinicLocations',
      title: 'Clinic Locations',
      type: 'array',
      of: [defineArrayMember({
        type: 'object',
        fields: [
          defineField({ name: 'id', title: 'ID', type: 'number' }),
          defineField({ name: 'name', title: 'Name', type: 'string' }),
          defineField({ name: 'address', title: 'Address', type: 'string' }),
          defineField({ name: 'pinCode', title: 'PIN Code', type: 'string' }),
          defineField({ name: 'phone', title: 'Phone', type: 'string' }),
          defineField({ name: 'email', title: 'Email', type: 'string' }),
          defineField({ name: 'timings', title: 'Timings', type: 'string' }),
        ]
      })]
    })
  ],
})
