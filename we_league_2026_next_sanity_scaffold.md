# we-league-2026 — Next.js + Sanity (Arabic, RTL)

This scaffold contains:

- Sanity schemas (with Arabic slugs) for `team`, `player`, and `match`.
- A minimal Next.js App Router application (`app/`) that fetches from Sanity and shows:
  - Next match (highlighted)
  - Upcoming matches
  - Past matches (with results)
- Tailwind-based light theme and RTL support

---

## File tree (important files)

```
we-league-2026/
├─ app/
│  ├─ layout.tsx
│  ├─ globals.css
│  └─ page.tsx
├─ components/
│  ├─ NextMatch.tsx
│  ├─ MatchCard.tsx
│  └─ MatchList.tsx
├─ lib/
│  └─ sanity.ts
├─ schemas/
│  ├─ team.ts
│  ├─ player.ts
│  └─ match.ts
├─ package.json
└─ next.config.js
```

---

## 1) Sanity schemas (TypeScript) — Arabic slugs

### `schemas/team.ts`
```ts
import {defineField, defineType} from 'sanity'

export const teamType = defineType({
  name: 'team',
  title: 'فريق',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'الاسم', type: 'string' }),
    defineField({ name: 'class', title: 'الصف', type: 'string' }),
    defineField({ name: 'slogan', title: 'شعار', type: 'string' }),
    defineField({ name: 'image', title: 'الصورة', type: 'image' }),
    defineField({
      name: 'slug',
      title: 'الاسم في الرابط',
      type: 'slug',
      options: {
        source: doc => doc.name,
        // Keep Arabic characters. Replace spaces with dashes.
        slugify: input => String(input).trim().replace(/\s+/g, '-')
      }
    }),
  ]
})
```

### `schemas/player.ts`
```ts
import {defineField, defineType} from 'sanity'

export const playerType = defineType({
  name: 'player',
  title: 'لاعب',
  type: 'document',
  fields: [
    defineField({ name: 'name', title: 'الاسم', type: 'string' }),
    defineField({ name: 'class', title: 'الصف', type: 'string' }),
    defineField({ name: 'slogan', title: 'شعار', type: 'string' }),
    defineField({ name: 'image', title: 'الصورة', type: 'image' }),
    defineField({
      name: 'teams',
      title: 'الفرق',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'team' }] }]
    }),
    defineField({
      name: 'slug',
      title: 'الاسم في الرابط',
      type: 'slug',
      options: { source: doc => doc.name, slugify: input => String(input).trim().replace(/\s+/g, '-') }
    }),
  ]
})
```

### `schemas/match.ts`
```ts
import {defineField, defineType} from 'sanity'

export const matchType = defineType({
  name: 'match',
  title: 'مباراة',
  type: 'document',
  fields: [
    defineField({ name: 'team1', title: 'الفريق الأول', type: 'reference', to: [{ type: 'team' }] }),
    defineField({ name: 'team2', title: 'الفريق الثاني', type: 'reference', to: [{ type: 'team' }] }),
    defineField({ name: 'date', title: 'موعد المباراة', type: 'datetime' }),
    defineField({ name: 'image', title: 'صورة / بانر', type: 'image' }),
    defineField({ name: 'scoreTeam1', title: 'نتيجة الفريق الأول', type: 'number' }),
    defineField({ name: 'scoreTeam2', title: 'نتيجة الفريق الثاني', type: 'number' }),
    defineField({
      name: 'slug',
      title: 'الاسم في الرابط',
      type: 'slug',
      options: { source: doc => `${doc.team1?._ref || 'match'}-${doc.team2?._ref || ''}-${doc.date}`, slugify: input => String(input).trim().replace(/\s+/g, '-') }
    }),
  ]
})
```

> Notes on slugs: these `slugify` functions use a simple space->dash replacement and intentionally do not strip Arabic letters. This preserves Arabic slugs. You can modify rules if you later want URL-safe encoding.

---

## 2) Sanity client (`lib/sanity.ts`)

```ts
import {createClient} from 'next-sanity'

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2025-01-01',
  useCdn: true,
})
```

---

## 3) GROQ query used by the home page (inside app/page.tsx)

```ts
const homeQuery = `{
  "nextMatch": *[_type == "match" && dateTime(date) > now()] | order(date asc)[0]{
    ..., 
    "team1": team1->, 
    "team2": team2->
  },
  "futureMatches": *[_type == "match" && dateTime(date) > now()] | order(date asc)[1..6]{
    ..., "team1": team1->, "team2": team2->
  },
  "pastMatches": *[_type == "match" && dateTime(date) < now()] | order(date desc)[0..6]{
    ..., "team1": team1->, "team2": team2->
  }
}`
```

---

## 4) Next.js app files (App Router)

### `app/layout.tsx` (RTL + global)
```tsx
import './globals.css'
import React from 'react'

export const metadata = {
  title: 'دوري المدرسة - WE',
  description: 'أخبار مباريات الكرة في مدرسة WE',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <main className="min-h-screen bg-gray-50 text-gray-900">{children}</main>
      </body>
    </html>
  )
}
```

### `app/globals.css`
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  height: 100%;
}

body {
  font-family: system-ui, -apple-system, "Segoe UI", Roboto, "Noto Naskh Arabic", "Noto Sans Arabic", sans-serif;
  background: #f8fafc; /* light */
}

/* Simple blue theme */
:root {
  --we-blue: #0263e0;
}

h1, h2, h3 { color: var(--we-blue); }

/* Cards */
.card { @apply bg-white rounded-2xl shadow p-4 }
```

### `app/page.tsx` (server component)
```tsx
import { client } from '@/lib/sanity'
import NextMatch from '@/components/NextMatch'
import MatchList from '@/components/MatchList'

const query = `{
  "nextMatch": *[_type == "match" && dateTime(date) > now()] | order(date asc)[0]{..., "team1": team1->, "team2": team2->},
  "futureMatches": *[_type == "match" && dateTime(date) > now()] | order(date asc)[1..6]{..., "team1": team1->, "team2": team2->},
  "pastMatches": *[_type == "match" && dateTime(date) < now()] | order(date desc)[0..6]{..., "team1": team1->, "team2": team2->}
}`

export default async function Page() {
  const data = await client.fetch(query)

  return (
    <div className="container mx-auto p-4">
      <NextMatch match={data.nextMatch} />

      <section className="mt-8">
        <h2 className="text-xl mb-4">مباريات قادمة</h2>
        <MatchList matches={data.futureMatches} />
      </section>

      <section className="mt-8">
        <h2 className="text-xl mb-4">نتائج سابقة</h2>
        <MatchList matches={data.pastMatches} showScores />
      </section>
    </div>
  )
}
```

### `components/NextMatch.tsx`
```tsx
export default function NextMatch({ match }: any) {
  if (!match) return (
    <div className="card">لا توجد مباراة قريبة</div>
  )

  return (
    <div className="card flex flex-col md:flex-row items-center gap-4">
      {match.image && <img src={match.image.asset?.url} alt="banner" className="w-full md:w-1/3 rounded" />}
      <div className="flex-1">
        <h1 className="text-2xl font-bold">المباراة القادمة</h1>
        <div className="mt-2 text-lg font-semibold">{match.team1?.name} vs {match.team2?.name}</div>
        <div className="mt-1 text-sm text-gray-600">{new Date(match.date).toLocaleString('ar-EG')}</div>
      </div>
    </div>
  )
}
```

### `components/MatchCard.tsx`
```tsx
export default function MatchCard({ m, showScores = false }: any) {
  return (
    <article className="card flex items-center gap-4">
      <div className="flex-1">
        <div className="text-lg font-medium">{m.team1?.name} - {m.team2?.name}</div>
        <div className="text-sm text-gray-600">{new Date(m.date).toLocaleString('ar-EG')}</div>
      </div>
      {showScores && (typeof m.scoreTeam1 === 'number' || typeof m.scoreTeam2 === 'number') ? (
        <div className="text-xl font-bold">{m.scoreTeam1 ?? '-'} : {m.scoreTeam2 ?? '-'}</div>
      ) : null}
    </article>
  )
}
```

### `components/MatchList.tsx`
```tsx
import MatchCard from './MatchCard'

export default function MatchList({ matches, showScores = false }: any) {
  if (!matches || matches.length === 0) return <div className="card">لا توجد مباريات</div>
  return (
    <div className="grid gap-3">
      {matches.map((m: any) => (
        <MatchCard key={m._id} m={m} showScores={showScores} />
      ))}
    </div>
  )
}
```

---

## 5) `package.json` (essential parts)

```json
{
  "name": "we-league-2026",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next": "14.4.0",
    "react": "18.2.0",
    "react-dom": "18.2.0",
    "next-sanity": "5.0.0"
  },
  "devDependencies": {
    "tailwindcss": "^4.0.0",
    "postcss": "^8.0.0",
    "autoprefixer": "^10.0.0",
    "typescript": "^5.0.0"
  }
}
```

> Adjust versions as you like.

---

## 6) How to run (summary)

1. Create Sanity project (studio) and deploy schema files to it (place the `schemas/` files in your Studio schema folder and run `sanity start` to test).
2. Set environment variables in Next.js project: `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`.
3. `npm install` then `npm run dev` to run Next.js.

---

If you want, I can now:
- Add full Tailwind config and `postcss.config.js` in the scaffold.
- Create sample GROQ & TypeScript types for safer fetches.
- Generate a minimal `studio` folder config (so the Studio is in the repo).

Which one should I do next?
