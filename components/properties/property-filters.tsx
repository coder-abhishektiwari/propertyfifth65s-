"use client";

import { useEffect, useMemo, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, X, SlidersHorizontal } from "lucide-react";
import type { PropertyType, Purpose, PropertyStatus } from "@prisma/client";
import { formatPrice } from "@/lib/property-utils";

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

const ALL_OPTION = { value: "", label: "All" };

interface PropertyFiltersProps {
  cities: string[];
  amenities: string[];
  priceBounds: { min: number; max: number };
}

function parseAmenitiesParam(value: string | null): string[] {
  if (!value) return [];
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function BudgetRangeSlider({
  min,
  max,
  valueMin,
  valueMax,
  onCommit,
}: {
  min: number;
  max: number;
  valueMin: number;
  valueMax: number;
  onCommit: (min: number, max: number) => void;
}) {
  const step = Math.max(100000, Math.round((max - min) / 100));
  const [localMin, setLocalMin] = useState(valueMin);
  const [localMax, setLocalMax] = useState(valueMax);

  useEffect(() => {
    setLocalMin(valueMin);
    setLocalMax(valueMax);
  }, [valueMin, valueMax]);

  const range = max - min || 1;
  const minPercent = ((localMin - min) / range) * 100;
  const maxPercent = ((localMax - min) / range) * 100;

  function commit(nextMin: number, nextMax: number) {
    onCommit(Math.round(nextMin), Math.round(nextMax));
  }

  return (
    <div>
      <div className="mb-3 flex items-center justify-between gap-2 text-xs">
        <span className="rounded-md border border-border bg-muted/40 px-2 py-1 font-medium text-foreground">
          {formatPrice(localMin)}
        </span>
        <span className="text-muted-foreground">to</span>
        <span className="rounded-md border border-border bg-muted/40 px-2 py-1 font-medium text-foreground">
          {formatPrice(localMax)}
        </span>
      </div>

      <div className="range-dual">
        <div className="range-dual__track" />
        <div
          className="range-dual__fill"
          style={{ left: `${minPercent}%`, width: `${Math.max(maxPercent - minPercent, 0)}%` }}
        />
        <input
          type="range"
          className="range-dual__input"
          min={min}
          max={max}
          step={step}
          value={localMin}
          aria-label="Minimum budget"
          onChange={(e) => {
            const next = Math.min(Number(e.target.value), localMax - step);
            setLocalMin(next);
          }}
          onPointerUp={() => commit(localMin, localMax)}
          onKeyUp={() => commit(localMin, localMax)}
        />
        <input
          type="range"
          className="range-dual__input"
          min={min}
          max={max}
          step={step}
          value={localMax}
          aria-label="Maximum budget"
          onChange={(e) => {
            const next = Math.max(Number(e.target.value), localMin + step);
            setLocalMax(next);
          }}
          onPointerUp={() => commit(localMin, localMax)}
          onKeyUp={() => commit(localMin, localMax)}
        />
      </div>

      <p className="mt-2 text-[0.6rem] text-muted-foreground">
        Drag either handle to set min & max together
      </p>
    </div>
  );
}

export default function PropertyFilters({
  cities,
  amenities,
  priceBounds,
}: PropertyFiltersProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isNavigating, startTransition] = useTransition();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [amenitySearch, setAmenitySearch] = useState("");

  const currentSearch = searchParams.get("search") || "";
  const currentCity = searchParams.get("city") || "";
  const currentType = searchParams.get("propertyType") || "";
  const currentPurpose = searchParams.get("purpose") || "";
  const currentStatus = searchParams.get("status") || "";
  const currentPriceMin = searchParams.get("priceMin") || "";
  const currentPriceMax = searchParams.get("priceMax") || "";
  const currentAmenities = parseAmenitiesParam(searchParams.get("amenities"));
  const [searchInput, setSearchInput] = useState(currentSearch);

  const sliderMin = currentPriceMin ? Number(currentPriceMin) : priceBounds.min;
  const sliderMax = currentPriceMax ? Number(currentPriceMax) : priceBounds.max;

  function updateParams(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    params.delete("page"); // Reset to page 1 on filter change
    const url = `/properties?${params.toString()}`;
    // replace avoids stacking history entries / full remount feel on every filter tweak
    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  }

  function updateBudget(min: number, max: number) {
    const params = new URLSearchParams(searchParams.toString());
    const atMin = min <= priceBounds.min;
    const atMax = max >= priceBounds.max;

    if (!atMin) params.set("priceMin", String(min));
    else params.delete("priceMin");

    if (!atMax) params.set("priceMax", String(max));
    else params.delete("priceMax");

    params.delete("page");
    const url = `/properties?${params.toString()}`;
    startTransition(() => {
      router.replace(url, { scroll: false });
    });
  }

  function toggleAmenity(amenity: string) {
    const next = currentAmenities.includes(amenity)
      ? currentAmenities.filter((item) => item !== amenity)
      : [...currentAmenities, amenity];
    updateParams("amenities", next.join(","));
  }

  function clearAllFilters() {
    startTransition(() => {
      router.replace("/properties", { scroll: false });
    });
    setSearchInput("");
    setAmenitySearch("");
  }

  function handleSearch(e: React.FormEvent) {
    e.preventDefault();
    updateParams("search", searchInput);
  }

  const hasActiveFilters =
    currentSearch ||
    currentCity ||
    currentType ||
    currentPurpose ||
    currentStatus ||
    currentPriceMin ||
    currentPriceMax ||
    currentAmenities.length > 0;

  const visibleAmenities = useMemo(() => {
    const q = amenitySearch.trim().toLowerCase();
    if (!q) return amenities;
    return amenities.filter((amenity) => amenity.toLowerCase().includes(q));
  }, [amenities, amenitySearch]);

  const filterContent = (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-bold tracking-wider uppercase text-foreground">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="text-[0.7rem] font-semibold text-accent hover:underline cursor-pointer"
          >
            RESET
          </button>
        )}
      </div>

      {/* Search */}
      <div>
        <label className="text-[0.65rem] font-bold tracking-wider uppercase text-muted-foreground mb-2 block">
          Search
        </label>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search properties..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="field-input !min-h-[2.5rem] !py-2 !text-xs pr-9"
          />
          <button type="submit" className="absolute right-1.5 top-1/2 -translate-y-1/2 icon-btn !w-8 !h-8 cursor-pointer" aria-label="Search properties">
            <Search className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>

      {/* Property Type */}
      <div>
        <label className="text-[0.65rem] font-bold tracking-wider uppercase text-muted-foreground mb-2 block">
          Property Type
        </label>
        <div className="space-y-2">
          {[ALL_OPTION, ...PROPERTY_TYPES].map((type) => (
            <label key={type.value || "all-type"} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="propertyType"
                checked={currentType === type.value}
                onChange={() => updateParams("propertyType", type.value)}
                className="w-3.5 h-3.5 accent-[var(--gold)]"
              />
              <span className="text-xs text-muted-foreground">{type.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Budget */}
      <div>
        <label className="text-[0.65rem] font-bold tracking-wider uppercase text-muted-foreground mb-2 block">
          Budget
        </label>
        <BudgetRangeSlider
          min={priceBounds.min}
          max={priceBounds.max}
          valueMin={sliderMin}
          valueMax={sliderMax}
          onCommit={updateBudget}
        />
      </div>

      {/* Location / City */}
      <div>
        <label className="text-[0.65rem] font-bold tracking-wider uppercase text-muted-foreground mb-2 block">
          Location
        </label>
        <div className="space-y-2">
          {[ALL_OPTION, ...cities.map((city) => ({ value: city, label: city }))].map((city) => (
            <label key={city.value || "all-city"} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="city"
                checked={currentCity === city.value}
                onChange={() => updateParams("city", city.value)}
                className="w-3.5 h-3.5 accent-[var(--gold)]"
              />
              <span className="text-xs text-muted-foreground">{city.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Status */}
      <div>
        <label className="text-[0.65rem] font-bold tracking-wider uppercase text-muted-foreground mb-2 block">
          Status
        </label>
        <div className="space-y-2">
          {[ALL_OPTION, ...STATUSES].map((status) => (
            <label key={status.value || "all-status"} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="status"
                checked={currentStatus === status.value}
                onChange={() => updateParams("status", status.value)}
                className="w-3.5 h-3.5 accent-[var(--gold)]"
              />
              <span className="text-xs text-muted-foreground">{status.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Purpose */}
      <div>
        <label className="text-[0.65rem] font-bold tracking-wider uppercase text-muted-foreground mb-2 block">
          Purpose
        </label>
        <div className="space-y-2">
          {[ALL_OPTION, ...PURPOSES].map((purpose) => (
            <label key={purpose.value || "all-purpose"} className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="purpose"
                checked={currentPurpose === purpose.value}
                onChange={() => updateParams("purpose", purpose.value)}
                className="w-3.5 h-3.5 accent-[var(--gold)]"
              />
              <span className="text-xs text-muted-foreground">{purpose.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      {amenities.length > 0 && (
        <div>
          <label className="text-[0.65rem] font-bold tracking-wider uppercase text-muted-foreground mb-2 block">
            Amenities
          </label>
          <div className="relative mb-2">
            <input
              type="text"
              placeholder="Search amenities..."
              value={amenitySearch}
              onChange={(e) => setAmenitySearch(e.target.value)}
              className="field-input !min-h-[2.25rem] !py-1.5 !text-xs pr-8"
            />
            {amenitySearch && (
              <button
                type="button"
                onClick={() => setAmenitySearch("")}
                className="absolute right-1.5 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground cursor-pointer"
                aria-label="Clear amenity search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {visibleAmenities.length === 0 ? (
              <p className="text-xs text-muted-foreground">No amenities match your search.</p>
            ) : (
              visibleAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="amenities"
                    checked={currentAmenities.includes(amenity)}
                    onChange={() => toggleAmenity(amenity)}
                    className="w-3.5 h-3.5 accent-[var(--gold)]"
                  />
                  <span className="text-xs text-muted-foreground">{amenity}</span>
                </label>
              ))
            )}
          </div>
        </div>
      )}

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
          <div className="absolute inset-0 bg-scrim" onClick={() => setMobileOpen(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-80 max-w-[85vw] bg-card overflow-y-auto p-5">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-bold uppercase">Filters</h3>
              <button onClick={() => setMobileOpen(false)} className="icon-btn !w-9 !h-9 cursor-pointer" aria-label="Close filters">
                <X className="w-5 h-5" />
              </button>
            </div>
            {filterContent}
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-64 shrink-0">
        <div
          className={`sticky top-24 card-premium p-5 transition-opacity ${
            isNavigating ? "opacity-70" : "opacity-100"
          }`}
        >
          {filterContent}
        </div>
      </aside>
    </>
  );
}
