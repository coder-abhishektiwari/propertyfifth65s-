"use client";

import { useState } from "react";
import Image from "next/image";
import {
  MapPin,
  ExternalLink,
  Download,
  ArrowRight,
  CheckCircle,
  Building2,
  Home,
  Star,
  Layers,
  Sparkles,
  Cloud,
  TreePine,
  Coffee,
  Sun,
  Dumbbell,
  Waves,
  Heart,
  Baby,
  Gamepad2,
  Footprints,
  Trophy,
  Bike,
  Users,
  Shield,
  Car,
  Zap,
  Lock,
  Film,
  Music,
  BookOpen,
  Leaf,
  Dog,
  Shirt,
  Wifi,
  CircleDot,
} from "lucide-react";
import type { PropertyBasic } from "@/lib/property-utils";
import { getPropertyTypeLabel, formatPrice, toMediaImageUrl, toMediaBrochureUrl } from "@/lib/property-utils";
import ScheduleSiteVisit from "@/components/properties/schedule-site-visit";

interface PropertyTabsProps {
  property: PropertyBasic;
}

const TABS = ["Overview", "Highlights", "Amenities", "Specifications", "Location", "Gallery", "Brochure"] as const;

type TabName = (typeof TABS)[number];

/* ─── Icon Mapping ────────────────────────────────────── */
function getIconForText(text: string): React.ReactNode {
  const t = text.toLowerCase();

  // Highlights
  if (t.includes("floor") || t.includes("tower") || t.includes("skyline")) return <Building2 className="w-5 h-5" />;
  if (t.includes("bhk") || t.includes("apartment") || t.includes("residence")) return <Home className="w-5 h-5" />;
  if (t.includes("penthouse")) return <Star className="w-5 h-5" />;
  if (t.includes("duplex")) return <Layers className="w-5 h-5" />;
  if (t.includes("amenities") || t.includes("lifestyle")) return <Sparkles className="w-5 h-5" />;
  if (t.includes("skywalk") || t.includes("sky lounge") || t.includes("sky garden")) return <Cloud className="w-5 h-5" />;
  if (t.includes("rooftop") || t.includes("sunset") || t.includes("deck")) return <Sun className="w-5 h-5" />;
  if (t.includes("garden") || t.includes("green") || t.includes("park") || t.includes("nature")) return <TreePine className="w-5 h-5" />;
  if (t.includes("cafe") || t.includes("lounge") || t.includes("social")) return <Coffee className="w-5 h-5" />;
  if (t.includes("clubhouse") || t.includes("club")) return <Building2 className="w-5 h-5" />;
  if (t.includes("retail") || t.includes("shop") || t.includes("mall")) return <Shirt className="w-5 h-5" />;
  if (t.includes("security") || t.includes("surveillance")) return <Shield className="w-5 h-5" />;
  if (t.includes("parking") || t.includes("car")) return <Car className="w-5 h-5" />;
  if (t.includes("ev charging") || t.includes("electric")) return <Zap className="w-5 h-5" />;
  if (t.includes("smart") || t.includes("lock") || t.includes("biometric")) return <Lock className="w-5 h-5" />;
  if (t.includes("golf")) return <CircleDot className="w-5 h-5" />;
  if (t.includes("lake") || t.includes("water") || t.includes("pool")) return <Waves className="w-5 h-5" />;
  if (t.includes("boulevard") || t.includes("open") || t.includes("wide")) return <Leaf className="w-5 h-5" />;

  // Amenities
  if (t.includes("gym") || t.includes("fitness") || t.includes("pilates") || t.includes("aerobics") || t.includes("yoga") || t.includes("meditation") || t.includes("spa") || t.includes("steam") || t.includes("sauna") || t.includes("wellness") || t.includes("reflexology")) return <Dumbbell className="w-5 h-5" />;
  if (t.includes("swimming") || t.includes("pool") || t.includes("jacuzzi") || t.includes("hydrotherapy")) return <Waves className="w-5 h-5" />;
  if (t.includes("dance") || t.includes("music") || t.includes("disco")) return <Music className="w-5 h-5" />;
  if (t.includes("kids") || t.includes("child") || t.includes("toddler") || t.includes("day-care") || t.includes("play zone") || t.includes("play park") || t.includes("sandpit") || t.includes("arcade")) return <Baby className="w-5 h-5" />;
  if (t.includes("indoor game") || t.includes("table tennis") || t.includes("snooker") || t.includes("billiard") || t.includes("chess") || t.includes("carrom")) return <Gamepad2 className="w-5 h-5" />;
  if (t.includes("jogging") || t.includes("walking") || t.includes("trail") || t.includes("cycling") || t.includes("pathway")) return <Footprints className="w-5 h-5" />;
  if (t.includes("basketball") || t.includes("tennis") || t.includes("badminton") || t.includes("cricket") || t.includes("pickleball") || t.includes("skating") || t.includes("sports") || t.includes("volleyball")) return <Trophy className="w-5 h-5" />;
  if (t.includes("bicycle") || t.includes("bike")) return <Bike className="w-5 h-5" />;
  if (t.includes("senior") || t.includes("elder") || t.includes("citizen")) return <Users className="w-5 h-5" />;
  if (t.includes("theatre") || t.includes("cinema") || t.includes("mini theatre")) return <Film className="w-5 h-5" />;
  if (t.includes("banquet") || t.includes("celebration") || t.includes("party") || t.includes("event")) return <Users className="w-5 h-5" />;
  if (t.includes("reading") || t.includes("library") || t.includes("book")) return <BookOpen className="w-5 h-5" />;
  if (t.includes("co-working") || t.includes("cowork") || t.includes("office")) return <BookOpen className="w-5 h-5" />;
  if (t.includes("dog") || t.includes("pet")) return <Dog className="w-5 h-5" />;
  if (t.includes("wi-fi") || t.includes("wifi") || t.includes("internet")) return <Wifi className="w-5 h-5" />;
  if (t.includes("medical") || t.includes("doctor") || t.includes("ambulance") || t.includes("paramedic")) return <Heart className="w-5 h-5" />;
  if (t.includes("visitor") || t.includes("gate") || t.includes("entry") || t.includes("guard")) return <Shield className="w-5 h-5" />;
  if (t.includes("power") || t.includes("backup") || t.includes("generator")) return <Zap className="w-5 h-5" />;
  if (t.includes("elevator") || t.includes("lift")) return <Building2 className="w-5 h-5" />;
  if (t.includes("fire") || t.includes("safety") || t.includes("alarm")) return <Shield className="w-5 h-5" />;
  if (t.includes("golf cart") || t.includes("mobility") || t.includes("boom barrier")) return <Car className="w-5 h-5" />;
  if (t.includes("landscap") || t.includes("flower") || t.includes("herb") || t.includes("butterfly") || t.includes("zen") || t.includes("therapy")) return <TreePine className="w-5 h-5" />;
  if (t.includes("intercom")) return <Wifi className="w-5 h-5" />;
  if (t.includes("picnic") || t.includes("lawn") || t.includes("open activity")) return <Sun className="w-5 h-5" />;
  if (t.includes("cafe") || t.includes("lounge")) return <Coffee className="w-5 h-5" />;

  return <CircleDot className="w-5 h-5" />;
}

export default function PropertyTabs({ property }: PropertyTabsProps) {
  const [activeTab, setActiveTab] = useState<TabName>("Overview");

  const highlights: string[] = property.highlights
    ? typeof property.highlights === "string"
      ? JSON.parse(property.highlights)
      : (property.highlights as string[])
    : [];

  const amenities: string[] = property.amenities
    ? typeof property.amenities === "string"
      ? JSON.parse(property.amenities)
      : (property.amenities as string[])
    : [];

  const specifications: { label: string; value: string }[] = property.specifications
    ? typeof property.specifications === "string"
      ? JSON.parse(property.specifications)
      : Array.isArray(property.specifications)
        ? (property.specifications as { label: string; value: string }[])
        : Object.entries(property.specifications as Record<string, string>).map(([key, value]) => ({
            label: key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase()),
            value: String(value),
          }))
    : [];

  const bankApproved: { name: string; logo?: string }[] = property.bankApproved
    ? typeof property.bankApproved === "string"
      ? JSON.parse(property.bankApproved)
      : (property.bankApproved as { name: string; logo?: string }[])
    : [];

  return (
    <div>
      {/* Tab Navigation */}
      <div className="border-b border-[var(--border)] mb-6 overflow-x-auto">
        <div className="flex gap-0 min-w-max">
          {TABS.map((tab) => {
            const shouldShow = shouldShowTab(tab, property);
            if (!shouldShow) return null;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-3 text-xs font-semibold tracking-wider uppercase whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === tab
                    ? "text-[var(--gold)] border-b-2 border-[var(--gold)]"
                    : "text-[var(--text-muted)] hover:text-[var(--text)] border-b-2 border-transparent"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content + Sidebar */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left: Tab Content */}
        <div className="flex-1 min-w-0 lg:min-h-[520px] animate-fade-in">
          {activeTab === "Overview" && (
            <OverviewTab
              property={property}
              highlights={highlights}
              bankApproved={bankApproved}
            />
          )}
          {activeTab === "Highlights" && <HighlightsTab highlights={highlights} />}
          {activeTab === "Amenities" && <AmenitiesTab amenities={amenities} />}
          {activeTab === "Specifications" && <SpecificationsTab specifications={specifications} />}
          {activeTab === "Location" && <LocationTab property={property} />}
          {activeTab === "Gallery" && <GalleryTab property={property} />}
          {activeTab === "Brochure" && <BrochureTab property={property} />}
        </div>

        {/* Right: Sidebar (always visible) */}
        <div className="w-full lg:w-[300px] shrink-0 space-y-5">
          {/* Schedule Site Visit */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-5">
            <h3 className="text-sm font-bold text-[var(--text)] mb-1">Schedule a Site Visit</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">Visit the site &amp; experience it in person.</p>
            <ScheduleSiteVisit propertyId={property.id} propertyName={property.name} />
          </div>

          {/* Download Brochure */}
          {property.brochureUrl && (
            <div className="bg-white border border-[var(--border)] rounded-lg p-5">
              <h3 className="text-sm font-bold text-[var(--text)] mb-1">Download Brochure</h3>
              <p className="text-xs text-[var(--text-muted)] mb-3">
                Get detailed information about {property.name}.
              </p>
              <a
                href={toMediaBrochureUrl(property.brochureUrl)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[var(--bg-muted)] rounded-lg hover:bg-[var(--bg-alt)] transition-colors"
              >
                <div className="w-16 h-16 rounded overflow-hidden bg-[var(--border)] shrink-0 relative">
                  <Image
                    src={toMediaImageUrl(property.images[0]?.imageUrl || "")}
                    alt={property.name}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold text-[var(--text)] truncate uppercase">
                    {property.name}
                  </p>
                  <p className="text-[0.65rem] font-semibold tracking-wider uppercase text-[var(--text-muted)]">
                    Brochure
                  </p>
                  <p className="text-[0.65rem] text-[var(--text-muted)]">
                    PDF {property.brochureSize ? `• ${property.brochureSize}` : ""}
                  </p>
                </div>
                <Download className="w-5 h-5 text-[var(--text-muted)] shrink-0" />
              </a>
            </div>
          )}

          {/* Have Questions */}
          <div className="bg-white border border-[var(--border)] rounded-lg p-5">
            <h3 className="text-sm font-bold text-[var(--text)] mb-1">Have Questions?</h3>
            <p className="text-xs text-[var(--text-muted)] mb-4">Our experts are here to help you.</p>
            <a href="/contact" className="btn-primary w-full">
              Talk to an Expert
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

function shouldShowTab(tab: TabName, property: PropertyBasic): boolean {
  switch (tab) {
    case "Overview":
      return !!(property.shortDescription || property.description);
    case "Highlights":
      return !!property.highlights;
    case "Amenities":
      return !!property.amenities;
    case "Specifications":
      return !!property.specifications;
    case "Location":
      return true;
    case "Gallery":
      return property.images.length > 0;
    case "Brochure":
      return true;
  }
}

/* ─── Overview Tab ─────────────────────────────────────── */
function OverviewTab({
  property,
  highlights,
  bankApproved,
}: {
  property: PropertyBasic;
  highlights: string[];
  bankApproved: { name: string; logo?: string }[];
}) {
  return (
    <div className="space-y-8">
      {/* Overview Text + Property Details Table */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Left: Overview text */}
        <div className="flex-1 min-w-0">
          <h3 className="heading-sm mb-3">Overview</h3>
          {property.shortDescription && (
            <p className="text-sm text-[var(--text-muted)] leading-relaxed mb-3">
              {property.shortDescription}
            </p>
          )}
          {property.description && (
            <p className="text-sm text-[var(--text-muted)] leading-relaxed">
              {property.description}
            </p>
          )}
          {highlights.length > 0 && (
            <div className="mt-5 space-y-2">
              {highlights.map((item, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                  <span className="text-sm text-[var(--text-muted)]">{item}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Property Details Table */}
        <div className="w-full lg:w-[300px] shrink-0">
          <div className="border border-[var(--border)] rounded-lg overflow-hidden">
            <PropertyDetailRow label="Project Type" value={getPropertyTypeLabel(property.propertyType)} />
            {property.totalTowers && (
              <PropertyDetailRow label="Total Towers" value={String(property.totalTowers)} />
            )}
            {property.totalUnits && (
              <PropertyDetailRow label="Total Units" value={String(property.totalUnits)} />
            )}
            {property.totalArea && (
              <PropertyDetailRow label="Total Area" value={property.totalArea} />
            )}
            {property.priceMin ? (
              <PropertyDetailRow
                label="Price Range"
                value={`₹ ${formatPrice(Number(property.priceMin))}${property.priceMax ? ` - ₹ ${formatPrice(Number(property.priceMax))}` : "*"}`}
              />
            ) : (
              <PropertyDetailRow label="Price Range" value="Not Disclosed" />
            )}
            {bankApproved.length > 0 && (
              <div className="px-4 py-3 border-t border-[var(--border)]">
                <p className="text-xs font-semibold text-[var(--text-muted)] mb-2">Bank Approved</p>
                <div className="flex items-center gap-3 flex-wrap">
                  {bankApproved.map((bank, i) => (
                    <div key={i} className="flex items-center gap-1.5">
                      {bank.logo ? (
                        <img src={bank.logo} alt={bank.name} className="h-5 w-auto object-contain" />
                      ) : (
                        <span className="text-xs font-medium text-[var(--text)]">{bank.name}</span>
                      )}
                    </div>
                  ))}
                  {bankApproved.length > 3 && (
                    <span className="text-xs text-[var(--text-muted)]">&amp; more</span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PropertyDetailRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] last:border-b-0">
      <span className="text-xs font-semibold text-[var(--text-muted)]">{label}</span>
      <span className="text-xs font-bold text-[var(--text)]">{value}</span>
    </div>
  );
}

/* ─── Highlights Tab ─────────────────────────────────── */
function HighlightsTab({ highlights }: { highlights: string[] }) {
  if (highlights.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)] py-4">
        No highlights have been added for this property yet.
      </p>
    );
  }

  return (
    <div>
      <h3 className="heading-sm mb-4">Highlights</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
        {highlights.map((item, i) => (
          <div
            key={i}
            className="flex flex-col items-center text-center p-4 bg-[var(--bg-muted)] rounded-lg"
          >
            <div className="w-10 h-10 mb-2 rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)]">
              {getIconForText(item)}
            </div>
            <span className="text-xs font-semibold text-[var(--text)] leading-tight">{item}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Amenities Tab ───────────────────────────────────── */
function AmenitiesTab({ amenities }: { amenities: string[] }) {
  if (amenities.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)] py-4">
        No amenities have been added for this property yet.
      </p>
    );
  }

  return (
    <div>
      <h3 className="heading-sm mb-4">Amenities</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {amenities.map((amenity, i) => (
          <div
            key={i}
            className="flex items-center gap-2.5 px-3 py-2.5 bg-[var(--bg-muted)] rounded text-sm text-[var(--text)]"
          >
            <div className="w-6 h-6 rounded-full bg-[var(--gold)]/10 flex items-center justify-center shrink-0 text-[var(--gold)]">
              {getIconForText(amenity)}
            </div>
            {amenity}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Specifications Tab ──────────────────────────────── */
function SpecificationsTab({ specifications }: { specifications: { label: string; value: string }[] }) {
  if (specifications.length === 0) {
    return (
      <p className="text-sm text-[var(--text-muted)] py-4">
        No specifications have been added for this property yet.
      </p>
    );
  }

  return (
    <div>
      <h3 className="heading-sm mb-4">Specifications</h3>
      <div className="border border-[var(--border)] rounded-lg overflow-hidden">
        {specifications.map((spec, i) => (
          <div
            key={i}
            className={`flex items-center px-4 py-3 text-sm ${
              i % 2 === 0 ? "bg-white" : "bg-[var(--bg-muted)]"
            }`}
          >
            <span className="font-semibold text-[var(--text)] w-1/3">{spec.label}</span>
            <span className="text-[var(--text-muted)]">{spec.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── Location Tab ────────────────────────────────────── */
function LocationTab({ property }: { property: PropertyBasic }) {
  const mapQuery = property.latitude && property.longitude
    ? `${property.latitude},${property.longitude}`
    : encodeURIComponent(`${property.address}, ${property.locality}, ${property.city}`);

  const mapEmbedUrl = `https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${mapQuery}&zoom=15`;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="heading-sm mb-4">Location</h3>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[var(--gold)] mt-0.5 shrink-0" />
            <div>
              <p className="text-sm font-semibold text-[var(--text)]">{property.address}</p>
              <p className="text-xs text-[var(--text-muted)]">
                {[property.locality, property.city, property.state].filter(Boolean).join(", ")}
              </p>
              {property.pincode && (
                <p className="text-xs text-[var(--text-muted)]">Pincode: {property.pincode}</p>
              )}
            </div>
          </div>

          {property.mapUrl && (
            <a
              href={property.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--gold)] hover:underline"
            >
              View on Map <ExternalLink className="w-3 h-3" />
            </a>
          )}

          {property.latitude && property.longitude && !property.mapUrl && (
            <a
              href={`https://www.google.com/maps?q=${property.latitude},${property.longitude}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--gold)] hover:underline"
            >
              View on Google Maps <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>

      {/* Google Maps Embed */}
      <div className="rounded-lg overflow-hidden border border-[var(--border)]">
        <iframe
          src={mapEmbedUrl}
          width="100%"
          height="350"
          style={{ border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          title={`Map of ${property.name}`}
        />
      </div>
    </div>
  );
}

/* ─── Gallery Tab ─────────────────────────────────────── */
function GalleryTab({ property }: { property: PropertyBasic }) {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);
  const sorted = [...property.images].sort((a, b) => a.sortOrder - b.sortOrder);

  if (sorted.length === 0) {
    return (
      <div>
        <h3 className="heading-sm mb-4">Gallery</h3>
        <p className="text-sm text-[var(--text-muted)] py-4">No photos available for this property yet.</p>
      </div>
    );
  }

  return (
    <div>
      <h3 className="heading-sm mb-4">Gallery</h3>

      {/* Image Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {sorted.map((img, i) => (
          <button
            key={i}
            onClick={() => setSelectedImage(i)}
            className="relative aspect-[4/3] rounded-lg overflow-hidden bg-[var(--bg-muted)] cursor-pointer group"
          >
            <Image
              src={toMediaImageUrl(img.imageUrl)}
              alt={`${property.name} - Photo ${i + 1}`}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 640px) 50vw, 33vw"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
          </button>
        ))}
      </div>

      {/* Lightbox Modal */}
      {selectedImage !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/95 flex flex-col items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          {/* Header */}
          <div className="flex items-center justify-between w-full px-4 py-3 shrink-0">
            <span className="text-white text-sm font-medium">
              {selectedImage + 1} / {sorted.length}
            </span>
            <button
              onClick={() => setSelectedImage(null)}
              className="w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Image */}
          <div className="flex-1 flex items-center justify-center px-4 min-h-0 w-full">
            <div className="relative w-full max-w-5xl aspect-[16/10]">
              <Image
                src={toMediaImageUrl(sorted[selectedImage].imageUrl)}
                alt={`${property.name} - Photo ${selectedImage + 1}`}
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
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev! - 1 + sorted.length) % sorted.length);
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedImage((prev) => (prev! + 1) % sorted.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </>
          )}

          {/* Thumbnails */}
          {sorted.length > 1 && (
            <div className="flex justify-center gap-2 px-4 py-3 shrink-0 overflow-x-auto w-full">
              {sorted.map((img, i) => (
                <button
                  key={i}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedImage(i);
                  }}
                  className={`relative shrink-0 w-14 h-10 rounded overflow-hidden border-2 transition-all cursor-pointer ${
                    i === selectedImage
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
      )}
    </div>
  );
}

/* ─── Brochure Tab ────────────────────────────────────── */
function BrochureTab({ property }: { property: PropertyBasic }) {
  if (!property.brochureUrl) {
    return (
      <div>
        <h3 className="heading-sm mb-4">Brochure</h3>
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-[var(--bg-muted)] flex items-center justify-center">
            <svg className="w-8 h-8 text-[var(--text-light)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
            </svg>
          </div>
          <p className="text-sm font-semibold text-[var(--text)] mb-1">No Brochure Available</p>
          <p className="text-xs text-[var(--text-muted)]">
            Brochure for this property is not available at the moment.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="heading-sm mb-4">Brochure</h3>

      {/* Download Card */}
      <div className="flex items-center gap-4 p-4 bg-[var(--bg-muted)] rounded-lg mb-5">
        <div className="w-12 h-12 rounded bg-[var(--navy)] flex items-center justify-center shrink-0">
          <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m2.25 0H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
          </svg>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-[var(--text)] truncate">
            {property.brochureName || "Property Brochure"}
          </p>
          <p className="text-xs text-[var(--text-muted)]">
            PDF {property.brochureSize ? `• ${property.brochureSize}` : ""}
          </p>
        </div>
        <a
          href={toMediaBrochureUrl(property.brochureUrl)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-outline text-xs shrink-0"
        >
          Download
        </a>
      </div>

      {/* PDF Viewer */}
      <div className="rounded-lg overflow-hidden border border-[var(--border)]">
        <div className="bg-[var(--navy)] px-4 py-2 flex items-center justify-between">
          <span className="text-white text-xs font-medium">PDF Preview</span>
          <a
            href={toMediaBrochureUrl(property.brochureUrl)}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[var(--gold)] text-xs font-semibold hover:underline flex items-center gap-1"
          >
            Open Full <ExternalLink className="w-3 h-3" />
          </a>
        </div>
        <div className="h-[500px] overflow-auto bg-gray-100">
          <iframe
            src={toMediaBrochureUrl(property.brochureUrl)}
            className="w-full h-full border-0"
            title={`${property.name} Brochure`}
          />
        </div>
      </div>
    </div>
  );
}
