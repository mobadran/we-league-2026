import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/lib/sanity';
import { formatDateToEnglishDigits } from '@/utils/date.utils';

export const revalidate = 60;

interface Team {
  _id: string;
  name: string;
  slug: { current: string };
  class: string;
  points: number;
  logoUrl: string;
  imageUrl: string;
  players: {
    _id: string;
    name: string;
    slug: { current: string };
    imageUrl: string;
    goals: number;
    assists: number;
  }[];
  recentMatches: {
    _id: string;
    slug: { current: string };
    date: string;
    imageUrl: string;
    scoreTeam1: number;
    scoreTeam2: number;
    wentToPenalties: boolean;
    penaltyTeam1: number;
    penaltyTeam2: number;
    team1: { name: string };
    team2: { name: string };
  }[];
}

async function getTeam(slug: string) {
  return client.fetch<Team>(
    `*[_type == "team" && slug.current == $slug][0]{
    _id,
    name,
    slug,
    class,
    points,
    "logoUrl": image.asset->url,
    "imageUrl": image.asset->url,
    // players in this team
    "players": *[_type == "player" && references(^._id)]{_id, name, slug, "imageUrl": image.asset->url, goals, assists}[0...12],
    // recent matches this team participated
    "recentMatches": *[_type == "match" && (team1._ref == ^._id || team2._ref == ^._id)] | order(date desc)[0...5]{
      _id, slug, date, "imageUrl": image.asset->url, scoreTeam1, scoreTeam2,
      "team1": team1-> {name, slug},
      "team2": team2-> {name, slug},
      wentToPenalties, penaltyTeam1, penaltyTeam2
    }
  }`,
    { slug }
  );
}

export default async function TeamDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const t = await getTeam(slug);
  if (!t) return <main className="p-8 text-center text-black">الفريق غير موجود</main>;

  return (
    <main className="px-6 py-10 text-black">
      <div className="mx-auto max-w-5xl">
        <Link href="/teams" className="text-sm text-[var(--color-primary)]">
          ← العودة لكل الفرق
        </Link>
        <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-2xl bg-white p-6 text-center shadow md:col-span-1">
            <Image
              src={t.logoUrl || `https://placehold.co/200x200/1E40AF/FFFFFF?text=Team`}
              alt={t.name}
              width={160}
              height={160}
              className="mx-auto h-40 w-40 rounded-full object-cover"
              unoptimized
            />
            <h1 className="mt-3 text-2xl font-bold text-[var(--color-primary)]">{t.name}</h1>
            <div className="text-gray-600">الصف: {t.class || '—'}</div>
            <div className="text-gray-600">النقاط: {t.points ?? 0}</div>
          </div>

          <div className="md:col-span-2">
            <div className="mb-6 rounded-2xl bg-white p-4 shadow">
              <h2 className="mb-3 text-xl font-bold text-[var(--color-primary)]">اللاعبون</h2>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {t.players?.length ? (
                  t.players.map(p => (
                    <Link
                      key={p._id}
                      href={`/players/${p.slug?.current ?? ''}`}
                      className="flex items-center gap-3 rounded-xl border bg-white p-3 shadow hover:shadow-md"
                    >
                      <Image
                        src={p.imageUrl || `https://placehold.co/100x100/1E40AF/FFFFFF?text=P`}
                        alt={p.name}
                        width={44}
                        height={44}
                        className="h-11 w-11 rounded-full object-cover"
                        unoptimized
                      />
                      <div className="flex-1 text-right text-sm">
                        <div className="font-semibold">{p.name}</div>
                        <div className="text-gray-600">
                          أهداف: {p.goals ?? 0} • صناعة: {p.assists ?? 0}
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-full p-3 text-center text-gray-600">لا يوجد لاعبين</div>
                )}
              </div>
            </div>

            <div className="rounded-2xl bg-white p-4 shadow">
              <h2 className="mb-3 text-xl font-bold text-[var(--color-primary)]">آخر المباريات</h2>
              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {t.recentMatches?.length ? (
                  t.recentMatches.map(m => (
                    <Link
                      key={m._id}
                      href={`/matches/${m.slug?.current ?? ''}`}
                      className="rounded-xl border p-3 hover:shadow"
                    >
                      <div className="font-semibold">
                        {m.team1?.name} x {m.team2?.name}
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
