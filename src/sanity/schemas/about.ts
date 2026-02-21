import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'about',
  title: 'About Page',
  type: 'document',
  fields: [
    defineField({
        name: 'title',
        title: 'Title',
        type: 'string',
    }),
    defineField({
        name: 'doctorName',
        title: 'Doctor Name',
        type: 'string',
    }),
    defineField({
        name: 'image',
        title: 'Doctor Image',
        type: 'image',
        options: { hotspot: true }
    }),
     defineField({
        name: 'imageHint',
        title: 'Image AI Hint',
        type: 'string',
    }),
    defineField({
        name: 'missionStatement',
        title: 'Mission Statement',
        type: 'text',
    }),
    defineField({
        name: 'bio',
        title: 'Biography',
        type: 'text',
    }),
    defineField({
        name: 'education',
        title: 'Education',
        type: 'string',
    }),
    defineField({
        name: 'experience',
        title: 'Experience',
        type: 'string',
    }),
    defineField({
        name: 'patientsServed',
        title: 'Patients Served',
        type: 'string',
    }),
     defineField({
        name: 'positiveReviews',
        title: 'Positive Reviews',
        type: 'string',
    }),
    defineField({
        name: 'consultationsDone',
        title: 'Consultations Done',
        type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'title',
    },
  },
})
