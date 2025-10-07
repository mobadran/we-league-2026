"use client";
import React from "react";

type Props = {
  placeholder?: string;
  query: string;
  onChange: (v: string) => void;
};

export default function SearchInput({ placeholder = "ابحث...", query, onChange }: Props) {
  return (
    <div className="mx-auto mb-4 max-w-3xl">
      <input
        value={query}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-full border border-gray-300 bg-white/80 px-5 py-3 text-right shadow focus:border-[var(--color-primary)] focus:outline-none"
      />
    </div>
  );
}
