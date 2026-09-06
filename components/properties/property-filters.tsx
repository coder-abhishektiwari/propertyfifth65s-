"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import type { PropertyType, Purpose, PropertyStatus } from "@prisma/client";

const PROPERTY_TYPES: { value: PropertyType; label: string }[] = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "PENTHOUSE", label: "Penthouse" },
  { value: "PLOT", label: "Plot" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "INDEPENDENT_FLOOR", label: "Independent Floor" },
];

const PURPOSES: { value: Purpose; label: string }[] = [
  { value: "END_USE", label: "End Use" },
  { value: "INVESTMENT", label: "Investment" },
  { value: "BOTH", label: "Both" },
];

const STATUSES: { value: PropertyStatus; label: string }[] = [
  { value: "READY_TO_MOVE", label: "Ready to Move" },
  { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
  { value: "NEW_LAUNCH", label: "New Launch" },
  { value: "RESALE", label: "Resale" },
];

const SORT_OPTIONS = [
  { value: "featured", label: "Featured First" },
  { value: "newest", label: "Newest First" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
];

interface PropertyFiltersProps {
  cities: string[];
}

export default function PropertyFilters({ cities }: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mobileOpen, setMobileOpen] = useState(false);

  const currentSearch = searchParams.get("search") || "";
  const currentCity = searchParams.get("city") || "";
  const currentType = searchParams.get("propertyType") || "";
  const currentPurpose = searchParams.get("purpose") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentSort = searchParams.get("sort") || "featured";
  const currentPriceMin = searchParams.get("priceMin") || "";
  const currentPriceMax = searchParams.get("priceMax") || "";
  const [searchInput, setSearchInput] = useState(currentSearch);

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to page 1 on filter change
    router.push(`/properties?${params.toString()}`);
  }

  function clearAllFilters() {
    router.push("/properties");
    setSearchInput("");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams("search", searchInput);
  }

  const hasActiveFilters = currentSearch || currentCity || currentType || currentPurpose || currentStatus || currentPriceMin || currentPriceMax;

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wider uppercase text-[var(--text)]">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[0.7rem] font-semibold text-[var(--gold)] hover:underline cursor-pointer"
          >
            RESET
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="text-[0.65rem] font-bold tracking-wider uppercase text-[var(--text-muted)] mb-2 block">
          Search
        </label>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="w-full border border-[var(--border)] rounded px-3 py-2 text-xs text-[var(--text)] placeholder:text-[var(--text-light)] focus:outline-none focus:border-[var(--gold)]"
          />
          <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--gold)] cursor-pointer">
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Property Type */}
      <div>
        <label className="text-[0.65rem] font-bold tracking-wider uppercase text-[var(--text-muted)] mb-2 block">
          Property Type
        </label>
        <div className="space-y-2">
          {PROPERTY_TYPES.map((type) => (
            <label key={type.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="propertyType"
                checked={currentType === type.value}
                onChange={() => updateParams("propertyType", currentType === type.value ? "" : type.value)}
                className="w-3.5 h-3.5 accent-[var(--gold)]"
              />
              <span className="text-xs text-[var(--text-muted)]">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="text-[0.65rem] font-bold tracking-wider uppercase text-[var(--text-muted)] mb-2 block">
          Budget
        </label>
        <div className="flex items-center gap-2">
          <input
            type="number"
            placeholder="Min Price"
            value={currentPriceMin}
            onChange={(e) => updateParams("priceMin", e.target.value)}
            className="w-1/2 border border-[var(--border)] rounded px-3 py-2 text-xs text-[var(--text)] placeholder:text-[var(--text-light)] focus:outline-none focus:border-[var(--gold)]"
          />
          <span className="text-[var(--text-muted)] text-xs">—</span>
          <input
            type="number"
            placeholder="Max Price"
            value={currentPriceMax}
            onChange={(e) => updateParams("priceMax", e.target.value)}
            className="w-1/2 border border-[var(--border)] rounded px-3 py-2 text-xs text-[var(--text)] placeholder:text-[var(--text-light)] focus:outline-none focus:border-[var(--gold)]"
          />
        </div>
        <p className="text-[0.6rem] text-[var(--text-light)] mt-1">Price in INR (e.g., 3500000)</p>
      </div>

      {/* Location / City */}
      <div>
        <label className="text-[0.65rem] font-bold tracking-wider uppercase text-[var(--text-muted)] mb-2 block">
          Location
        </label>
        <div className="space-y-2">
          {cities.map((city) => (
            <label key={city} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="city"
                checked={currentCity === city}
                onChange={() => updateParams("city", currentCity === city ? "" : city)}
                className="w-3.5 h-3.5 accent-[var(--gold)]"
              />
              <span className="text-xs text-[var(--text-muted)]">{city}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="text-[0.65rem] font-bold tracking-wider uppercase text-[var(--text-muted)] mb-2 block">
          Status
        </label>
        <div className="space-y-2">
          {STATUSES.map((status) => (
            <label key={status.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={currentStatus === status.value}
                onChange={() => updateParams("status", currentStatus === status.value ? "" : status.value)}
                className="w-3.5 h-3.5 accent-[var(--gold)]"
              />
              <span className="text-xs text-[var(--text-muted)]">{status.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <div>
        <label className="text-[0.65rem] font-bold tracking-wider uppercase text-[var(--text-muted)] mb-2 block">
          Purpose
        </label>
        <div className="space-y-2">
          {PURPOSES.map((purpose) => (
            <label key={purpose.value} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="purpose"
                checked={currentPurpose === purpose.value}
                onChange={() => updateParams("purpose", currentPurpose === purpose.value ? "" : purpose.value)}
                className="w-3.5 h-3.5 accent-[var(--gold)]"
              />
              <span className="text-xs text-[var(--text-muted)]">{purpose.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Apply Filters Button (Mobile) */}
      <button
        onClick={() => setMobileOpen(false)}
        className="w-full btn-primary lg:hidden mt-4"
      >
        APPLY FILTERS
      </button>
    </div>
  );

  return (
    <>
      {/* Mobile Toggle */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setMobileOpen(true)}
          className="flex items-center gap-2 btn-outline w-full justify-center"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
        </button>
      </div>

      {/* Mobile Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold uppercase">Filters</h3>
              <button onClick={() => setMobileOpen(false)} className="p-1 hover:bg-[var(--bg-muted)] rounded cursor-pointer">
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 bg-white border border-[var(--border)] rounded-lg p-5">
          {filterContent}
        </div>
      </aside>
    </>
  );
}
