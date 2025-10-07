'use client';
import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchInput from '@/components/SearchInput';

type Team = { name?: string | null; slug?: { current: string } | null; logoUrl?: string | null };

export type MatchItem = {
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

function formatDate(dateStr?: string | null) {
  if (!dateStr) return '';
  try {
    return new Intl.DateTimeFormat('en-GB', { day: '2-digit', month: 'short' }).format(new Date(dateStr));
  } catch {
    return String(dateStr);
  }
}

export default function MatchesListClient({ items }: { items: MatchItem[] }) {
  const [q, setQ] = React.useState('');
  const filtered = items.filter(m => {
    const t1 = m.team1?.name || '';
    const t2 = m.team2?.name || '';
    return (t1 + ' ' + t2).toLowerCase().includes(q.toLowerCase());
  });

  return (
    <div>
      <SearchInput placeholder="ابحث عن مباراة..." query={q} onChange={setQ} />
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map(m => (
          <Link
            key={m._id}
            href={m.slug?.current ? `/matches/${m.slug.current}` : '#'}
            className="overflow-hidden rounded-2xl bg-white text-black shadow"
          >
            <div className="relative h-48 w-full">
              <Image
                src={m.imageUrl || `https://placehold.co/600x400/1E40AF/FFFFFF?text=Match`}
                alt={`${m.team1?.name || ''} vs ${m.team2?.name || ''}`}
                width={600}
                height={400}
                className="h-full w-full object-cover"
                unoptimized
              />
            </div>
            <div className="p-4 text-center">
              <div className="mb-1 font-bold">
                {m.team1?.name || '—'} × {m.team2?.name || '—'}
              </div>
              {typeof m.scoreTeam1 === 'number' || typeof m.scoreTeam2 === 'number' ? (
                <div className="text-lg font-semibold text-[var(--color-primary)]">
                  {m.scoreTeam1 ?? 0} - {m.scoreTeam2 ?? 0}
                  {m.wentToPenalties ? (
                    <div className="text-sm text-gray-600/50">
                      ({m.penaltyTeam1 ?? 0}-{m.penaltyTeam2 ?? 0})
                    </div>
                  ) : null}
                </div>
              ) : (
                <div className="text-gray-600">لم تُسجل النتيجة</div>
              )}
              <div className="mt-1 text-sm text-gray-500">{formatDate(m.date)}</div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <div className="col-span-full py-8 text-center text-gray-600">لا توجد نتائج</div>}
      </div>
    </div>
  );
}
