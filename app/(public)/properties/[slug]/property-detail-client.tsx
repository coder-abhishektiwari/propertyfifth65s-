"use client";

import { useEffect, useState } from "react";
import type { PropertyBasic } from "@/lib/property-utils";
import { formatPrice, getStatusLabel } from "@/lib/property-utils";
import PropertyGallery, { PropertyLightbox } from "@/components/properties/property-gallery";
import RequestCallbackDialog from "@/components/properties/request-callback-dialog";

interface PropertyDetailClientProps {
  property: PropertyBasic;
}

export default function PropertyDetailClient({ property }: PropertyDetailClientProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const [callbackOpen, setCallbackOpen] = useState(false);

  useEffect(() => {
    function handleOpenCallback() {
      setCallbackOpen(true);
    }
    document.addEventListener("open-callback-dialog", handleOpenCallback);
    return () => document.removeEventListener("open-callback-dialog", handleOpenCallback);
  }, []);

  function handleOpenLightbox(index: number) {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }

  return (
    <>
      {/* Mobile: Title + Price (visible only on mobile) */}
      <div className="lg:hidden mb-4">
        <div className="flex items-center gap-2 mb-1">
          <h1 className="font-serif text-xl font-bold text-[var(--text)]">
            {property.name}
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.6rem] font-bold tracking-wider uppercase bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
            {getStatusLabel(property.status)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-2">
          <svg className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span>{property.locality}, {property.city}</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          <span className="text-xs text-[var(--text-muted)]">Starting from</span>
        </div>
        <div className="flex items-baseline gap-1.5">
          {property.priceMin ? (
            <span className="text-[var(--gold)] text-lg font-bold">
              ₹{formatPrice(Number(property.priceMin))}
            </span>
          ) : (
            <span className="text-[var(--text-muted)] text-base font-semibold">Not Disclosed</span>
          )}
          {property.priceLabel && (
            <span className="text-xs text-[var(--text-muted)]">{property.priceLabel}</span>
          )}
        </div>
      </div>

      {/* Gallery */}
      <PropertyGallery
        images={property.images}
        propertyName={property.name}
        onOpenLightbox={handleOpenLightbox}
      />

      {/* Lightbox */}
      <PropertyLightbox
        images={property.images}
        propertyName={property.name}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />

      {/* Callback Dialog */}
      <RequestCallbackDialog
        propertyId={property.id}
        propertyName={property.name}
        isOpen={callbackOpen}
        onClose={() => setCallbackOpen(false)}
      />
    </>
  );
}
