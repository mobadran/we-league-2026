"use client";
import React from "react";
import Link from "next/link";
import Image from "next/image";
import SearchInput from "@/components/SearchInput";

export type PlayerItem = {
  _id: string;
  name: string;
  slug?: { current: string } | null;
  imageUrl?: string | null;
  goals?: number | null;
  assists?: number | null;
};

export default function PlayersListClient({ items }: { items: PlayerItem[] }) {
  const [q, setQ] = React.useState("");
  const filtered = items.filter((p) => (p.name || "").toLowerCase().includes(q.toLowerCase()));

  return (
    <div>
      <SearchInput placeholder="ابحث عن لاعب..." query={q} onChange={setQ} />
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
        {filtered.map((p) => (
          <Link key={p._id} href={`/players/${p.slug?.current ?? ""}`} className="flex items-center gap-3 rounded-xl border bg-white p-3 text-black shadow hover:shadow-md">
            <Image src={p.imageUrl || `https://placehold.co/100x100/1E40AF/FFFFFF?text=P`} alt={p.name} width={56} height={56} className="h-14 w-14 rounded-full object-cover" unoptimized />
            <div className="flex-1 text-right">
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-600">أهداف: {p.goals ?? 0} • صناعة: {p.assists ?? 0}</div>
            </div>
          </Link>
        ))}
        {filtered.length === 0 && <div className="col-span-full py-8 text-center text-gray-600">لا توجد نتائج</div>}
      </div>
    </div>
  );
}
