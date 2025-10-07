import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/lib/sanity';
import { formatDateToEnglishDigits } from '@/utils/date.utils';
import { MatchItem } from '@/components/MatchesListClient';

export const revalidate = 60;

async function getPlayer(slug: string) {
  return client.fetch(
    `*[_type == "player" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    "imageUrl": image.asset->url,
    goals,
    assists,
    // teams for this player
    teams[]->{ _id, name, slug },
    // last two matches for any of the player's teams
    "recentMatches": *[_type == "match" && (team1._ref in ^.teams[]._ref || team2._ref in ^.teams[]._ref)] | order(date desc)[0...2]{
      _id,
      slug,
      date,
      "imageUrl": image.asset->url,
      scoreTeam1,
      scoreTeam2,
      wentToPenalties,
      penaltyTeam1,
      penaltyTeam2,
      "team1": team1->{ name, slug },
      "team2": team2->{ name, slug }
    }
  }`,
    { slug }
  );
}

export default async function PlayerDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const p = await getPlayer(slug);
  if (!p) return <main className="p-8 text-center text-black">اللاعب غير موجود</main>;

  return (
    <main className="px-6 py-10 text-black">
      <div className="mx-auto max-w-4xl">
        <Link href="/players" className="text-sm text-[var(--color-primary)]">
          ← العودة لكل اللاعبين
        </Link>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 text-center shadow">
            <Image
              src={p.imageUrl || `https://placehold.co/200x200/1E40AF/FFFFFF?text=P`}
              alt={p.name}
              width={160}
              height={160}
              className="mx-auto h-40 w-40 rounded-full object-cover"
              unoptimized
            />
            <h1 className="mt-3 text-2xl font-bold text-[var(--color-primary)]">{p.name}</h1>
            <div className="text-gray-600">أهداف: {p.goals ?? 0}</div>
            <div className="text-gray-600">صناعة: {p.assists ?? 0}</div>
          </div>
          <div className="rounded-2xl bg-white p-6 shadow md:col-span-2">
            <h2 className="mb-3 text-xl font-bold text-[var(--color-primary)]">الفريق</h2>
            <div className="flex flex-wrap gap-2">
              {p.teams?.length ? (
                p.teams.map((t: { _id: string; name: string; slug?: { current: string } }) => (
                  <Link
                    key={t._id}
                    href={`/teams/${t.slug?.current ?? ''}`}
                    className="rounded-full border px-4 py-1 text-sm hover:shadow"
                  >
                    {t.name}
                  </Link>
                ))
              ) : (
                <div className="text-gray-600">لا توجد فرق</div>
              )}
            </div>
            {/* Last two matches */}
            <div className="mt-8">
              <h3 className="mb-3 text-lg font-bold text-[var(--color-primary)]">آخر المباريات</h3>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {p.recentMatches?.length ? (
                  p.recentMatches.map((m: MatchItem) => (
                    <Link
                      key={m._id}
                      href={`/matches/${m.slug?.current ?? ''}`}
                      className="rounded-xl border p-3 hover:shadow"
                    >
                      <div className="font-semibold">
                        {m.team1?.name} × {m.team2?.name}
                      </div>
                      <div className="text-[var(--color-primary)]">
                        {m.scoreTeam1 ?? 0} - {m.scoreTeam2 ?? 0}{' '}
                        {m.wentToPenalties ? `(ترجيح ${m.penaltyTeam1 ?? 0}-${m.penaltyTeam2 ?? 0})` : ''}
                      </div>
                      <div className="text-sm text-gray-600">{formatDateToEnglishDigits(m.date)}</div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full p-3 text-center text-gray-600">لا توجد مباريات</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
