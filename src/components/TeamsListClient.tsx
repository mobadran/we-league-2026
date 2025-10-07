"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import SearchInput from "@/components/SearchInput";

export type TeamItem = {
  _id: string;
  name: string;
  slug?: { current: string } | null;
  logoUrl?: string | null;
  points?: number | null;
  class?: string | null;
};

export default function TeamsListClient({ items }: { items: TeamItem[] }) {
  const [q, setQ] = React.useState("");
  const filtered = items.filter((t) => (t.name || "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <SearchInput placeholder="ابحث عن فريق..." query={q} onChange={setQ} />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {filtered.map((t) => (
          <Link key={t._id} href={`/teams/${t.slug?.current ?? ""}`} className="flex items-center gap-3 rounded-xl border bg-white p-4 text-black shadow hover:shadow-md">
            <Image src={t.logoUrl || `https://placehold.co/100x100/1E40AF/FFFFFF?text=Team`} alt={t.name} width={56} height={56} className="h-14 w-14 rounded-full object-cover" unoptimized />
            <div className="flex-1 text-right">
              <div className="font-semibold">{t.name}</div>
              <div className="text-sm text-gray-600">النقاط: {t.points ?? 0}{t.class ? ` • الصف ${t.class}` : ""}</div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <div className="col-span-full py-8 text-center text-gray-600">لا توجد نتائج</div>}
      </div>
    </div>
  );
}
