import { client } from '@/lib/sanity';
import PlayersListClient, { PlayerItem } from '@/components/PlayersListClient';

export const revalidate = 60;

export default async function PlayersPage() {
  const players = await client.fetch<PlayerItem[]>(`*[_type == "player"] | order(name asc){
    _id,
    name,
    slug,
    "imageUrl": image.asset->url,
    goals,
    assists
  }`);

  return (
    <main className="px-6 py-12 text-black">
      <h1 className="mb-6 text-center text-3xl font-bold text-[var(--color-primary)]">كل اللاعبين</h1>
      <PlayersListClient items={players} />
    </main>
  );
}
