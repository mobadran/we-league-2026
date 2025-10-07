// app/page.tsx
import Image from 'next/image';
import { client } from '@/lib/sanity';
import Link from 'next/link';
import { formatDateToEnglishDigits } from '@/utils/date.utils';

export const revalidate = 60; // ISR: refresh every 60s

type Team = {
  _id: string;
  name: string;
  slug?: { current: string } | null;
  logoUrl?: string | null;
  wins?: number;
  losses?: number;
  points?: number | null;
};

type Match = {
  _id: string;
  slug?: { current: string } | null;
  date?: string | null;
  imageUrl?: string | null;
  team1?: Team | null;
  team2?: Team | null;
  scoreTeam1?: number | null;
  scoreTeam2?: number | null;
  wentToPenalties?: boolean | null;
  penaltyTeam1?: number | null;
  penaltyTeam2?: number | null;
};

type Player = {
  _id: string;
  name: string;
  slug?: { current: string } | null;
  imageUrl?: string | null;
  goals?: number | null;
  assists?: number | null;
};

const bannerPlaceholder = (text = 'match') =>
  `https://placehold.co/1200x500/2563EB/FFFFFF?text=${encodeURIComponent(text)}`;

const cardPlaceholder = (text = 'image') =>
  `https://placehold.co/600x400/1E40AF/FFFFFF?text=${encodeURIComponent(text)}`;

export default async function HomePage() {
  // Fetch next upcoming match, recent matches, best team, standings, and top players
  const [nextMatch, recentMatches, bestTeam, standings, topScorers, topAssisters] = await Promise.all([
    client.fetch<Match | null>(`*[
      _type == "match" &&
      date >= now()
    ] | order(date asc)[0]{
      _id,
      slug,
      date,
      "imageUrl": image.asset->url,
      "team1": team1-> {_id, name, slug, "logoUrl": image.asset->url},
      "team2": team2-> {_id, name, slug, "logoUrl": image.asset->url},
      scoreTeam1,
      scoreTeam2,
      wentToPenalties,
      penaltyTeam1,
      penaltyTeam2
    }`),

    client.fetch<Match[]>(`*[
      _type == "match" &&
      date < now()
    ] | order(date desc)[0...3]{
      _id,
      slug,
      date,
      "imageUrl": image.asset->url,
      "team1": team1-> {_id, name, slug, "logoUrl": image.asset->url},
      "team2": team2-> {_id, name, slug, "logoUrl": image.asset->url},
      scoreTeam1,
      scoreTeam2,
      wentToPenalties,
      penaltyTeam1,
      penaltyTeam2
    }`),

    // Compute wins & losses by counting matches where this team's score > opponent score
    client.fetch<Team | null>(`*[_type == "team"]{
      _id,
      name,
      slug,
      "logoUrl": image.asset->url,
      "wins": count(*[
        _type == "match" &&
        (
          (team1._ref == ^._id && defined(scoreTeam1) && defined(scoreTeam2) && scoreTeam1 > scoreTeam2)
          ||
          (team2._ref == ^._id && defined(scoreTeam1) && defined(scoreTeam2) && scoreTeam2 > scoreTeam1)
        )
      ]),
      "losses": count(*[
        _type == "match" &&
        (
          (team1._ref == ^._id && defined(scoreTeam1) && defined(scoreTeam2) && scoreTeam1 < scoreTeam2)
          ||
          (team2._ref == ^._id && defined(scoreTeam1) && defined(scoreTeam2) && scoreTeam2 < scoreTeam1)
        )
      ]),
      points
    } | order(wins desc)[0]`),

    // Standings
    client.fetch<Team[]>(`*[_type == "team"] | order(points desc)[0...8]{
      _id,
      name,
      slug,
      points,
      "logoUrl": image.asset->url
    }`),

    // Top scorers
    client.fetch<Player[]>(`*[_type == "player"] | order(goals desc)[0...5]{
  _id,
  name,
  slug,
  "imageUrl": image.asset->url,
  goals
}`),

    // Top assisters
    client.fetch<Player[]>(`*[_type == "player"] | order(assists desc)[0...5]{
      _id,
      name,
      slug,
      "imageUrl": image.asset->url,
      assists
    }`),
  ]);

  return (
    <main className="overflow-hidden">
      {/* HERO */}
      <section className="bg-gradient-to-b from-[var(--color-primary)] to-[#1E3A8A] py-24 text-center text-white">
        <h1 className="mb-4 text-5xl font-extrabold">دوري المدرسة 2026</h1>
        <p className="mx-auto max-w-2xl text-lg opacity-90">
          البطولة التي تجمع طلاب المدرسة في أجواء حماسية، تنافس نزيه، وروح رياضية عالية.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/matches"
            className="rounded-full bg-white px-5 py-2 font-semibold text-[var(--color-primary)] shadow hover:opacity-90"
          >
            استعرض المباريات
          </Link>
          <Link
            href="/teams"
            className="rounded-full border border-white px-5 py-2 font-semibold text-white hover:bg-white/10"
          >
            الفرق
          </Link>
          <Link
            href="/players"
            className="rounded-full border border-white px-5 py-2 font-semibold text-white hover:bg-white/10"
          >
            اللاعبون
          </Link>
        </div>
      </section>

      {/* NEXT MATCH */}
      <section className="-mt-10 rounded-t-3xl bg-white text-black shadow-lg">
        <h2 className="text-center text-[var(--color-primary)]">المباراة القادمة</h2>

        {nextMatch ? (
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-8 p-6 md:flex-row">
            <div className="w-full md:w-1/2">
              <Image
                src={nextMatch.imageUrl ?? bannerPlaceholder('المباراة القادمة')}
                alt="المباراة القادمة"
                width={1200}
                height={500}
                className="rounded-2xl object-cover shadow-md"
                unoptimized
              />
            </div>

            <div className="w-full text-right md:w-1/2">
              <h3 className="mb-2 text-2xl font-bold">
                {nextMatch.team1?.name ?? '—'} × {nextMatch.team2?.name ?? '—'}
              </h3>
              <p className="mb-4 text-gray-700">{formatDateToEnglishDigits(nextMatch.date)}</p>
              {nextMatch.slug?.current && (
                <Link
                  className="rounded-full bg-[var(--color-primary)] px-6 py-2 text-white transition hover:opacity-90"
                  href={`/matches/${nextMatch.slug.current}`}
                >
                  تفاصيل المباراة
                </Link>
              )}
            </div>
          </div>
        ) : (
          <div className="p-8 text-center text-gray-600">لا توجد مباريات قادمة</div>
        )}
      </section>

      {/* BEST TEAM */}
      <section className="py-12">
        <h2 className="text-center text-[var(--color-primary)]">أفضل فريق</h2>

        {bestTeam ? (
          <Link
            href={`/teams/${bestTeam.slug?.current ?? ''}`}
            className="mx-auto mt-6 flex max-w-4xl flex-col items-center gap-8 rounded-2xl bg-white p-8 text-black shadow-md md:flex-row"
          >
            <div className="relative mx-auto h-44 w-44 md:mx-0">
              <Image
                src={bestTeam.logoUrl ?? cardPlaceholder(bestTeam.name ?? 'فريق')}
                alt={bestTeam.name}
                width={176}
                height={176}
                className="rounded-full border-4 border-[var(--color-primary)] object-cover"
                unoptimized
              />
            </div>

            <div className="text-center md:text-right">
              <h3 className="mb-2 text-3xl font-bold text-[var(--color-primary)]">{bestTeam.name}</h3>
              <p className="mb-2 text-lg">
                الانتصارات: <span className="font-semibold">{bestTeam.wins ?? 0}</span> | الخسائر:{' '}
                <span className="font-semibold">{bestTeam.losses ?? 0}</span>
              </p>
              {typeof bestTeam.points === 'number' && (
                <p className="text-md text-gray-700">
                  النقاط: <span className="font-semibold">{bestTeam.points}</span>
                </p>
              )}
            </div>
          </Link>
        ) : (
          <div className="mt-6 text-center text-gray-600">لا توجد بيانات كافية لاختيار أفضل فريق</div>
        )}
      </section>

      {/* STANDINGS */}
      <section className="rounded-t-3xl bg-white text-black">
        <h2 className="text-center text-[var(--color-primary)]">ترتيب الدوري</h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 p-6 sm:grid-cols-2 md:grid-cols-3">
          {standings && standings.length > 0 ? (
            standings.map(t => (
              <Link
                key={t._id}
                href={`/teams/${t.slug?.current ?? ''}`}
                className="flex items-center gap-3 rounded-xl border bg-white p-4 shadow hover:shadow-md"
              >
                <Image
                  src={t.logoUrl ?? cardPlaceholder(t.name)}
                  alt={t.name}
                  width={56}
                  height={56}
                  className="h-14 w-14 rounded-full object-cover"
                  unoptimized
                />
                <div className="flex-1 text-right">
                  <div className="font-semibold">{t.name}</div>
                  <div className="text-sm text-gray-600">النقاط: {t.points ?? 0}</div>
                </div>
              </Link>
            ))
          ) : (
            <div className="col-span-full p-4 text-center text-gray-600">لا يوجد ترتيب بعد</div>
          )}
        </div>
      </section>

      {/* RECENT MATCHES */}
      <section className="rounded-t-3xl bg-[#f3f4f6] text-black">
        <h2 className="text-center text-[var(--color-primary)]">آخر المباريات</h2>

        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 sm:grid-cols-2 md:grid-cols-3">
          {recentMatches && recentMatches.length > 0 ? (
            recentMatches.map(m => (
              <Link href={`/matches/${m.slug?.current}`} key={m._id}>
                <article className="overflow-hidden rounded-2xl bg-white shadow-md">
                  <div className="relative h-48 w-full">
                    <Image
                      src={m.imageUrl ?? cardPlaceholder('مباراة')}
                      alt={`${m.team1?.name ?? ''} vs ${m.team2?.name ?? ''}`}
                      width={600}
                      height={400}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </div>

                  <div className="p-4 text-center">
                    <h4 className="mb-2 font-bold">
                      {m.team1?.name ?? '—'} x {m.team2?.name ?? '—'}
                    </h4>

                    {typeof m.scoreTeam1 === 'number' || typeof m.scoreTeam2 === 'number' ? (
                      <p className="text-lg font-semibold text-[var(--color-primary)]">
                        {m.scoreTeam1 ?? 0} - {m.scoreTeam2 ?? 0}
                        {m.wentToPenalties ? (
                          <span className="ml-2 text-sm text-gray-600">
                            (ركلات الترجيح {m.penaltyTeam1 ?? 0}-{m.penaltyTeam2 ?? 0})
                          </span>
                        ) : null}
                      </p>
                    ) : (
                      <p className="text-gray-600">لم تُسجل النتيجة</p>
                    )}

                    <p className="mt-2 text-sm text-gray-500">{formatDateToEnglishDigits(m.date)}</p>
                  </div>
                </article>
              </Link>
            ))
          ) : (
            <div className="col-span-full p-8 text-center text-gray-600">لا توجد مباريات سابقة</div>
          )}
        </div>
      </section>

      {/* TOP SCORERS & ASSISTERS */}
      <section className="rounded-t-3xl bg-white text-black">
        <h2 className="text-center text-[var(--color-primary)]">الهدافون وصنّاع اللعب</h2>
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 p-6 md:grid-cols-2">
          <div>
            <h3 className="mb-3 text-xl font-bold text-[var(--color-primary)]">أفضل الهدافين</h3>
            <div className="space-y-3">
              {topScorers && topScorers.length > 0 ? (
                topScorers.map(p => (
                  <Link
                    key={p._id}
                    href={`/players/${p.slug?.current ?? ''}`}
                    className="flex items-center gap-3 rounded-xl border bg-white p-3 shadow hover:shadow-md"
                  >
                    <Image
                      src={p.imageUrl ?? cardPlaceholder(p.name)}
                      alt={p.name}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                      unoptimized
                    />
                    <div className="flex-1 text-right">
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-gray-600">أهداف: {p.goals ?? 0}</div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-3 text-center text-gray-600">لا توجد بيانات</div>
              )}
            </div>
          </div>
          <div>
            <h3 className="mb-3 text-xl font-bold text-[var(--color-primary)]">أفضل صنّاع اللعب</h3>
            <div className="space-y-3">
              {topAssisters && topAssisters.length > 0 ? (
                topAssisters.map(p => (
                  <Link
                    key={p._id}
                    href={`/players/${p.slug?.current ?? ''}`}
                    className="flex items-center gap-3 rounded-xl border bg-white p-3 shadow hover:shadow-md"
                  >
                    <Image
                      src={p.imageUrl ?? cardPlaceholder(p.name)}
                      alt={p.name}
                      width={44}
                      height={44}
                      className="h-11 w-11 rounded-full object-cover"
                      unoptimized
                    />
                    <div className="flex-1 text-right">
                      <div className="font-semibold">{p.name}</div>
                      <div className="text-sm text-gray-600">صناعة: {p.assists ?? 0}</div>
                    </div>
                  </Link>
                ))
              ) : (
                <div className="p-3 text-center text-gray-600">لا توجد بيانات</div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
