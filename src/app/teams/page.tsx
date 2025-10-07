import { client } from '@/lib/sanity';
import TeamsListClient, { TeamItem } from '@/components/TeamsListClient';

export const revalidate = 60;

export default async function TeamsPage() {
  const teams = await client.fetch<TeamItem[]>(`*[_type == "team"] | order(points desc){
    _id,
    name,
    slug,
    "logoUrl": image.asset->url,
    points,
    class
  }`);

  return (
    <main className="px-6 py-12 text-black">
      <h1 className="mb-6 text-center text-3xl font-bold text-[var(--color-primary)]">كل الفرق</h1>
      <TeamsListClient items={teams} />
    </main>
  );
}
