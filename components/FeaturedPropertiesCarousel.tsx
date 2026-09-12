"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { MapPin, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { toMediaImageUrl } from "@/lib/property-utils";
import IdentityGate from "@/components/identity-gate-link";
import PropertyPlaceholder from "@/components/property-placeholder";

interface Property {
  id: string;
  name: string;
  slug: string;
  status: string;
  city: string;
  locality: string;
  configuration: string;
  coverImage: string;
  developerName?: string;
  propertyType?: string;
  projectScale?: string;
  highlight?: string;
  priceMin?: number;
  badge?: string;
  tagline?: string;
}

export default function FeaturedPropertiesCarousel({
  properties,
}: {
  properties: Property[];
}) {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (!properties || properties.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [properties]);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? properties.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % properties.length);
  };

  if (!properties || properties.length === 0) {
    return (
      <div className="bg-[var(--bg-muted)] rounded-lg p-12 text-center text-[var(--text-muted)]">
        No featured properties available yet.
      </div>
    );
  }

  const currentProp = properties[currentIndex];

  return (
    <div className="relative">
      {/* Card */}
      <div className="bg-[var(--navy)] rounded-lg overflow-hidden flex flex-col md:flex-row h-auto md:h-[420px]">
        {/* Image side */}
        <div className="h-56 md:h-full relative shrink-0 md:w-[45%]">
          {currentProp.coverImage ? (
            <Image
              key={currentProp.id + "-img"}
              src={toMediaImageUrl(currentProp.coverImage)}
              alt={currentProp.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 45vw"
              priority
            />
          ) : (
            <PropertyPlaceholder className="absolute inset-0" />
          )}

          {/* Badge */}
          {currentProp.badge && (
            <div className="absolute top-4 left-4 z-30 bg-[var(--gold)] text-white text-[0.6rem] font-bold tracking-[0.15em] uppercase px-3 py-1.5 rounded">
              {currentProp.badge}
            </div>
          )}

          {/* Narrow right-side gradient blend — desktop only */}
          <div className="absolute inset-y-0 right-0 w-[50px] bg-gradient-to-l from-[var(--navy)] to-transparent z-20 hidden md:block" />
        </div>

        {/* Info panel */}
        <div className="p-5 md:p-8 flex flex-col justify-between min-w-0 md:w-[55%] overflow-hidden">
          <div className="overflow-hidden">
            <span className="inline-block bg-[var(--gold)] text-white text-[0.65rem] font-bold tracking-wider uppercase px-3 py-1 rounded w-fit mb-3">
              {currentProp.status === "NEW_LAUNCH"
                ? "New Launch"
                : currentProp.status.replace(/_/g, " ")}
            </span>

            <h3 className="font-serif text-xl md:text-2xl font-bold text-white mb-1.5 leading-tight">
              {currentProp.name}
            </h3>

            <div className="flex items-center gap-1.5 text-white/65 text-xs mb-3">
              <MapPin className="w-3 h-3 text-[var(--gold)] shrink-0" />
              <span className="truncate">
                {currentProp.city}
                {currentProp.locality && `, ${currentProp.locality}`}
              </span>
            </div>

            {currentProp.configuration && (
              <p className="text-white/80 text-xs leading-relaxed mb-3 line-clamp-2">
                {currentProp.configuration}
              </p>
            )}

            <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 border-y border-white/10 py-3">
              {currentProp.propertyType && (
                <div>
                  <p className="text-white/40 text-[0.6rem] uppercase tracking-wider mb-0.5">Property Type</p>
                  <p className="text-white text-xs font-medium">{currentProp.propertyType}</p>
                </div>
              )}
              {currentProp.developerName && (
                <div>
                  <p className="text-white/40 text-[0.6rem] uppercase tracking-wider mb-0.5">Developer</p>
                  <p className="text-white text-xs font-medium">{currentProp.developerName}</p>
                </div>
              )}
              {currentProp.highlight && (
                <div className="col-span-2">
                  <p className="text-white/40 text-[0.6rem] uppercase tracking-wider mb-0.5">Highlight</p>
                  <p className="text-white text-xs font-medium line-clamp-2">{currentProp.highlight}</p>
                </div>
              )}
            </div>

            {currentProp.priceMin && (
              <div className="mt-3">
                <p className="text-white/40 text-[0.6rem]">Starting From</p>
                <p className="text-[var(--gold)] text-lg font-bold mt-0.5">
                  ₹{Number(currentProp.priceMin).toLocaleString("en-IN")}*
                </p>
              </div>
            )}
          </div>

          <IdentityGate
            href={`/properties/${currentProp.slug}`}
            className="mt-4 inline-flex items-center gap-1.5 text-[var(--gold)] text-xs font-semibold tracking-wider uppercase hover:underline w-fit"
          >
            Explore Property
            <ArrowRight className="w-3.5 h-3.5" />
          </IdentityGate>
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        onClick={handlePrev}
        aria-label="Previous Property"
        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[var(--navy)] hover:bg-[var(--gold)] hover:text-white transition-colors hidden md:flex z-30 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <button
        type="button"
        onClick={handleNext}
        aria-label="Next Property"
        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-[var(--navy)] hover:bg-[var(--gold)] hover:text-white transition-colors hidden md:flex z-30 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="flex items-center justify-center gap-2 mt-5">
        {properties.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => setCurrentIndex(i)}
            aria-label={`Go to slide ${i + 1}`}
            className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
              i === currentIndex
                ? "bg-[var(--gold)] w-6"
                : "bg-[var(--border)] w-2 hover:bg-[var(--gold)]/50"
            }`}
          />
        ))}
      </div>
    </div>
  );
}
