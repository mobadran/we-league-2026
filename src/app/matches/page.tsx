import { client } from '@/lib/sanity';
import MatchesListClient, { MatchItem } from '@/components/MatchesListClient';

export const revalidate = 60;

export default async function MatchesPage() {
  const matches = await client.fetch<MatchItem[]>(`*[_type == "match"] | order(date desc){
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
  }`);

  return (
    <main className="px-6 py-12 text-black">
      <h1 className="mb-6 text-center text-3xl font-bold text-[var(--color-primary)]">كل المباريات</h1>
      <MatchesListClient items={matches} />
    </main>
  );
}
