import {defineField, defineType} from 'sanity'

export const playerType = defineType({
  name: 'player',
  title: 'لاعب',
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
      options: {source: 'name', slugify: (input) => String(input).trim().replace(/\s+/g, '-')},
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'class',
      title: 'الصف',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'image', title: 'الصورة', type: 'image'}),
    defineField({
      name: 'teams',
      title: 'الفرق',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'team'}]}],
      validation: (Rule) => Rule.required(),
    }),
    defineField({name: 'goals', title: 'الأهداف', type: 'number'}),
    defineField({name: 'assists', title: 'صناعات', type: 'number'}),
  ],
})
