'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

const upcomingMatch = {
  team1: 'الفريق الأزرق',
  team2: 'الفريق الأبيض',
  date: '2025-10-15',
  image: 'https://placehold.co/1200x500/2563EB/FFFFFF?text=المباراة+القادمة',
};

const bestTeam = {
  name: 'نسور المدرسة',
  wins: 5,
  losses: 0,
  logo: 'https://placehold.co/300x300/1E3A8A/FFFFFF?text=نسور',
  motto: 'نطير نحو القمة!',
};

const recentMatches = [
  {
    id: 1,
    title: 'الفريق الأزرق × الفريق الأحمر',
    score: '2 - 1',
    image: 'https://placehold.co/600x400/2563EB/FFFFFF?text=المباراة+1',
  },
  {
    id: 2,
    title: 'الفريق الأبيض × الفريق الأخضر',
    score: '3 - 3',
    image: 'https://placehold.co/600x400/1E40AF/FFFFFF?text=المباراة+2',
  },
  {
    id: 3,
    title: 'الفريق الأصفر × الفريق البنفسجي',
    score: '0 - 2',
    image: 'https://placehold.co/600x400/3B82F6/FFFFFF?text=المباراة+3',
  },
];

export default function Home() {
  return (
    <main className="overflow-hidden">
      {/* Hero */}
      <section className="bg-gradient-to-b from-[var(--color-primary)] to-[#1E3A8A] py-24 text-center text-white">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-4 text-5xl font-extrabold"
        >
          دوري المدرسة 2026
        </motion.h1>
        <p className="mx-auto max-w-2xl text-lg opacity-90">
          البطولة السنوية التي تجمع طلاب المدرسة في أجواء من الحماس، التحدي، والروح الرياضية!
        </p>
      </section>

      {/* Next Match */}
      <section className="-mt-10 rounded-t-3xl bg-white text-black shadow-lg">
        <h2 className="text-center text-[var(--color-primary)]">المباراة القادمة</h2>
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row">
          <Image
            src={upcomingMatch.image}
            alt="next match"
            width={600}
            height={400}
            className="rounded-2xl shadow-md"
          />
          <div className="text-center md:text-right">
            <h3 className="mb-2 text-2xl font-bold">
              {upcomingMatch.team1} × {upcomingMatch.team2}
            </h3>
            <p className="mb-4 text-gray-700">📅 {upcomingMatch.date}</p>
            <button className="rounded-full bg-[var(--color-primary)] px-6 py-2 text-white transition hover:opacity-90">
              تفاصيل المباراة
            </button>
          </div>
        </div>
      </section>

      {/* Best Team */}
      <section>
        <h2 className="text-center">أفضل فريق</h2>
        <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 rounded-2xl bg-white p-8 text-black shadow-md md:flex-row">
          <Image
            src={bestTeam.logo}
            alt="best team"
            width={250}
            height={250}
            className="rounded-full border-4 border-[var(--color-primary)]"
          />
          <div className="text-center md:text-right">
            <h3 className="mb-2 text-3xl font-bold text-[var(--color-primary)]">{bestTeam.name}</h3>
            <p className="mb-2 text-lg">{bestTeam.motto}</p>
            <p className="text-sm text-gray-600">
              الانتصارات: {bestTeam.wins} | الخسائر: {bestTeam.losses}
            </p>
          </div>
        </div>
      </section>

      {/* Recent Matches */}
      <section className="rounded-t-3xl bg-[#f3f4f6] text-black">
        <h2 className="text-center text-[var(--color-primary)]">آخر المباريات</h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
          {recentMatches.map(m => (
            <motion.div
              key={m.id}
              whileHover={{ scale: 1.03 }}
              className="overflow-hidden rounded-2xl bg-white shadow-md"
            >
              <Image src={m.image} alt={m.title} width={600} height={400} className="h-48 w-full object-cover" />
              <div className="p-4 text-center">
                <h4 className="mb-2 font-bold">{m.title}</h4>
                <p className="text-lg font-semibold text-[var(--color-primary)]">{m.score}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section className="rounded-t-3xl bg-white text-black">
        <h2 className="text-center text-[var(--color-primary)]">عن دوري We 2026</h2>
        <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 md:flex-row">
          <Image
            src="https://placehold.co/600x400/1E3A8A/FFFFFF?text=We+League+Spirit"
            alt="about"
            width={600}
            height={400}
            className="rounded-2xl shadow-md"
          />
          <p className="text-lg leading-relaxed">
            دوري We 2026 هو حدث رياضي يجمع طلاب المدرسة في منافسة مليئة بالحماس والروح الرياضية. الهدف هو تشجيع التعاون،
            تطوير المهارات، وبناء مجتمع طلابي نابض بالحياة من خلال الرياضة.
          </p>
        </div>
      </section>

      <footer className="py-6 text-center text-sm opacity-70">© 2026 دوري المدرسة - جميع الحقوق محفوظة</footer>
    </main>
  );
}
