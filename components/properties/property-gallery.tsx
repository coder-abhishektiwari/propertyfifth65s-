"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X, Camera } from "lucide-react";
import { toMediaImageUrl } from "@/lib/property-utils";

interface GalleryImage {
  imageUrl: string;
  isCover: boolean;
  sortOrder: number;
}

interface PropertyGalleryProps {
  images: GalleryImage[];
  propertyName: string;
  onOpenLightbox: (index: number) => void;
}

export default function PropertyGallery({ images, propertyName, onOpenLightbox }: PropertyGalleryProps) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const coverIndex = sorted.findIndex((img) => img.isCover);
  const [selectedIndex, setSelectedIndex] = useState(coverIndex >= 0 ? coverIndex : 0);

  const goNext = useCallback(() => {
    setSelectedIndex((prev) => (prev + 1) % sorted.length);
  }, [sorted.length]);

  const goPrev = useCallback(() => {
    setSelectedIndex((prev) => (prev - 1 + sorted.length) % sorted.length);
  }, [sorted.length]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  if (sorted.length === 0) return null;

  return (
    <div className="relative">
      {/* Main Image */}
      <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-[var(--bg-muted)]">
        <Image
          src={toMediaImageUrl(sorted[selectedIndex].imageUrl)}
          alt={`${propertyName} - Image ${selectedIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 60vw"
          priority
        />

        {/* Navigation Arrows */}
        {sorted.length > 1 && (
          <>
            <button
              onClick={goPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 rounded-full bg-black/40 hover:bg-black/60 text-white flex items-center justify-center transition-colors cursor-pointer z-10"
              aria-label="Next image"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* View All Photos */}
        <button
          onClick={() => onOpenLightbox(selectedIndex)}
          className="absolute bottom-3 left-3 flex items-center gap-2 bg-black/50 hover:bg-black/70 text-white text-xs font-semibold px-3 py-2 rounded transition-colors cursor-pointer z-10"
        >
          <Camera className="w-4 h-4" />
          View All Photos ({sorted.length})
        </button>

        {/* Image Counter */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-xs font-medium px-2.5 py-1 rounded z-10">
          {selectedIndex + 1} / {sorted.length}
        </div>
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 mt-3 overflow-x-auto pb-1">
          {sorted.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedIndex(i)}
              className={`relative shrink-0 w-16 h-12 rounded overflow-hidden border-2 transition-colors cursor-pointer ${
                i === selectedIndex
                  ? "border-[var(--gold)]"
                  : "border-transparent opacity-60 hover:opacity-100"
              }`}
            >
              <Image
                src={toMediaImageUrl(img.imageUrl)}
                alt={`${propertyName} thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

interface LightboxProps {
  images: GalleryImage[];
  propertyName: string;
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

export function PropertyLightbox({ images, propertyName, initialIndex, isOpen, onClose }: LightboxProps) {
  const sorted = [...images].sort((a, b) => a.sortOrder - b.sortOrder);
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  const prevInitialIndex = useRef(initialIndex);
  useEffect(() => {
    if (prevInitialIndex.current !== initialIndex) {
      setCurrentIndex(initialIndex);
      prevInitialIndex.current = initialIndex;
    }
  }, [initialIndex]);

  const goNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % sorted.length);
  }, [sorted.length]);

  const goPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + sorted.length) % sorted.length);
  }, [sorted.length]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [isOpen, onClose, goNext, goPrev]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/95 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 shrink-0">
        <span className="text-white text-sm font-medium">
          {currentIndex + 1} / {sorted.length}
        </span>
        <button
          onClick={onClose}
          className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          aria-label="Close gallery"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Main Image */}
      <div className="flex-1 flex items-center justify-center px-4 min-h-0">
        <div className="relative w-full max-w-5xl aspect-[16/10]">
          <Image
            src={toMediaImageUrl(sorted[currentIndex].imageUrl)}
            alt={`${propertyName} - Image ${currentIndex + 1}`}
            fill
            className="object-contain"
            sizes="100vw"
          />
        </div>
      </div>

      {/* Navigation */}
      {sorted.length > 1 && (
        <>
          <button
            onClick={goPrev}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Previous image"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={goNext}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            aria-label="Next image"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex justify-center gap-2 px-4 py-3 shrink-0 overflow-x-auto">
          {sorted.map((img, i) => (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`relative shrink-0 w-14 h-10 rounded overflow-hidden border-2 transition-all cursor-pointer ${
                i === currentIndex
                  ? "border-[var(--gold)] opacity-100"
                  : "border-transparent opacity-50 hover:opacity-80"
              }`}
            >
              <Image
                src={toMediaImageUrl(img.imageUrl)}
                alt={`Thumbnail ${i + 1}`}
                fill
                className="object-cover"
                sizes="56px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
