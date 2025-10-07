import Image from 'next/image';
import Link from 'next/link';
import { client } from '@/lib/sanity';
import { formatDateToEnglishDigits } from '@/utils/date.utils';

export const revalidate = 60;

async function getMatch(slug: string) {
  return client.fetch(
    `*[_type == "match" && slug.current == $slug][0]{
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
    penaltyTeam2,
    videos[]{
      asset->{
        url
      }
    }
  }`,
    { slug }
  );
}

export default async function MatchDetails({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getMatch(slug);
  if (!data) return <main className="p-8 text-center text-black">المباراة غير موجودة</main>;

  return (
    <main className="px-6 py-10 text-black">
      <div className="mx-auto max-w-5xl">
        <Link href="/matches" className="text-sm text-[var(--color-primary)]">
          ← العودة لكل المباريات
        </Link>
        <div className="mt-4 overflow-hidden rounded-2xl bg-white shadow">
          <Image
            src={data.imageUrl || `https://placehold.co/1200x500/2563EB/FFFFFF?text=Match`}
            alt="banner"
            width={1200}
            height={500}
            className="h-64 w-full object-cover"
            unoptimized
          />
          <div className="p-6 text-center">
            <h1 className="mb-2 text-2xl font-bold text-[var(--color-primary)]">
              <Link href={`/teams/${data.team1?.slug?.current ?? ''}`} className="hover:underline">
                {data.team1?.name}
              </Link>{' '}
              x{' '}
              <Link href={`/teams/${data.team2?.slug?.current ?? ''}`} className="hover:underline">
                {data.team2?.name}
              </Link>
            </h1>
            <div className="text-xl font-semibold">
              {data.scoreTeam1 ?? 0} - {data.scoreTeam2 ?? 0}
              {data.wentToPenalties ? (
                <div className="text-sm text-gray-600/50">
                  ({data.penaltyTeam1 ?? 0}-{data.penaltyTeam2 ?? 0})
                </div>
              ) : null}
            </div>
            <div className="mt-2 text-gray-600">تاريخ المباراة: {formatDateToEnglishDigits(data.date)}</div>
          </div>
          <div className="flex flex-col gap-4">
            {data.videos?.map((video: { asset: { url: string } }, index: number) => (
              <video key={index} controls className="rounded-4xl">
                <source src={video.asset.url} type="video/mp4" />
              </video>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
