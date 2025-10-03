import {defineField, defineType} from 'sanity'

export const matchType = defineType({
  name: 'match',
  title: 'مباراة',
  type: 'document',
  preview: {
    select: {
      team1: 'team1.name',
      team2: 'team2.name',
      date: 'date',
      image: 'image',
    },
    prepare({team1, team2, date, image}) {
      return {
        title: `${team1 || '?'} X ${team2 || '?'}`,
        subtitle: date ? new Date(date).toLocaleDateString() : 'No date set',
        media: image,
      }
    },
  },
  fields: [
    defineField({name: 'team1', title: 'الفريق الأول', type: 'reference', to: [{type: 'team'}]}),
    defineField({name: 'team2', title: 'الفريق الثاني', type: 'reference', to: [{type: 'team'}]}),
    defineField({
      name: 'slug',
      title: 'الاسم في الرابط',
      type: 'slug',
      options: {
        source: (doc: any) =>
          `${doc.team1?._ref || 'match'}-${doc.team2?._ref || ''}-${doc.date || ''}`,

        slugify: (input) => String(input).trim().replace(/\s+/g, '-'),
      },
    }),
    defineField({name: 'date', title: 'موعد المباراة', type: 'date'}),
    defineField({name: 'image', title: 'صورة / بانر', type: 'image'}),
    defineField({name: 'scoreTeam1', title: 'نتيجة الفريق الأول', type: 'number'}),
    defineField({name: 'scoreTeam2', title: 'نتيجة الفريق الثاني', type: 'number'}),
  ],
})
