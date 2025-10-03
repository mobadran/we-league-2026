import {defineField, defineType} from 'sanity'

export const playerType = defineType({
  name: 'player',
  title: 'لاعب',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'الاسم', type: 'string'}),
    defineField({
      name: 'slug',
      title: 'الاسم في الرابط',
      type: 'slug',
      options: {source: 'name', slugify: (input) => String(input).trim().replace(/\s+/g, '-')},
    }),
    defineField({name: 'class', title: 'الصف', type: 'string'}),
    defineField({name: 'slogan', title: 'شعار', type: 'string'}),
    defineField({name: 'image', title: 'الصورة', type: 'image'}),
    defineField({
      name: 'teams',
      title: 'الفرق',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'team'}]}],
    }),
  ],
})
