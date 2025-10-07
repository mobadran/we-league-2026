import {defineField, defineType} from 'sanity'

export const teamType = defineType({
  name: 'team',
  title: 'فريق',
  type: 'document',
  fields: [
    defineField({
      name: 'name',
      title: 'الاسم',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'الاسم في الرابط',
      type: 'slug',
      validation: (Rule) => Rule.required(),
      options: {
        source: 'name',
        slugify: (input) => String(input).trim().replace(/\s+/g, '-'),
      },
    }),
    defineField({
      name: 'class',
      title: 'الصف',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'image',
      title: 'الصورة',
      type: 'image',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'points',
      title: 'النقاط',
      type: 'number',
    }),
  ],
})
