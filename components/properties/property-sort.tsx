"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { value: "featured", label: "Featured First" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

export default function PropertySort() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentSort = searchParams.get("sort") || "featured";

  function handleSort(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value && value !== "featured") {
      params.set("sort", value);
    } else {
      params.delete("sort");
    }
    params.delete("page");
    router.push(`/properties?${params.toString()}`);
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs text-[var(--text-muted)] whitespace-nowrap">Sort by:</span>
      <div className="relative">
        <select
          value={currentSort}
          onChange={(e) => handleSort(e.target.value)}
          className="appearance-none bg-white border border-[var(--border)] rounded px-3 py-1.5 pr-7 text-xs text-[var(--text)] cursor-pointer focus:outline-none focus:border-[var(--gold)]"
        >
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-[var(--text-muted)] pointer-events-none" />
      </div>
    </div>
  );
}
