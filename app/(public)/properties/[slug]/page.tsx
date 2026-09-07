import { notFound } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import {
  ChevronRight,
  ArrowRight,
  MessageCircle,
  Building2,
  Home,
  Ruler,
  Calendar,
  Shield,
  Heart,
  Share2,
  IndianRupee,
} from "lucide-react";
import { getPropertyBySlug, formatPrice, getStatusLabel, getPropertyTypeLabel } from "@/lib/properties";
import type { PropertyWithImages } from "@/lib/properties";
import PropertyTabs from "@/components/properties/property-tabs";
import PropertyDetailClient from "./property-detail-client";
import PropertyActions from "@/components/properties/property-actions";
import type { PropertyBasic } from "@/lib/property-utils";

interface PropertyDetailPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PropertyDetailPageProps): Promise<Metadata> {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) {
    return { title: "Property Not Found | Property Fifth" };
  }

  return {
    title: `${property.name} | Property Fifth`,
    description:
      property.shortDescription ||
      `Explore ${property.name} in ${property.city} — premium ${getPropertyTypeLabel(property.propertyType).toLowerCase()} property with Property Fifth.`,
  };
}

export default async function PropertyDetailPage({ params }: PropertyDetailPageProps) {
  const { slug } = await params;
  const property = await getPropertyBySlug(slug);

  if (!property) notFound();

  const serializedProperty: PropertyBasic = {
    ...property,
    priceMin: Number(property.priceMin),
    priceMax: property.priceMax ? Number(property.priceMax) : null,
    latitude: property.latitude ? Number(property.latitude) : null,
    longitude: property.longitude ? Number(property.longitude) : null,
    areaMin: property.areaMin ? Number(property.areaMin) : null,
    areaMax: property.areaMax ? Number(property.areaMax) : null,
  } as PropertyBasic;

  return (
    <>
      {/* Breadcrumb */}
      <section className="bg-[var(--bg-muted)] border-b border-[var(--border)] mt-16  lg:mt-18 ">
        <div className="container-site py-3">
          <nav className="flex items-center gap-1.5 text-xs text-[var(--text-muted)]">
            <Link href="/" className="hover:text-[var(--gold)] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href="/properties" className="hover:text-[var(--gold)] transition-colors">Properties</Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-[var(--text)] font-medium truncate">{property.name}</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <section className="bg-[var(--bg)]">
        <div className="container-site pt-6 pb-6 lg:pt-8 lg:pb-8">
          {/* Gallery + Property Info */}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            {/* Left: Gallery */}
            <div className="flex-1 min-w-0">
              <PropertyDetailClient property={serializedProperty} />
            </div>

            {/* Right: Property Info + Details + Actions */}
            <div className="w-full lg:w-[420px] shrink-0">
              <PropertyHeaderInfo property={property} />

              {/* Property Quick Details Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-5">
                <PropertyDetailCard
                 icon={<Building2 className="w-5 h-5" />}
                  label="Property Type"
                  value={getPropertyTypeLabel(property.propertyType)}
                />
                {property.configuration && (
                  <PropertyDetailCard
                    icon={<Home className="w-5 h-5" />}
                    label="Configurations"
                    value={property.configuration}
                  />
                )}
                {serializedProperty.areaMin && serializedProperty.areaMax && (
                  <PropertyDetailCard
                    icon={<Ruler className="w-5 h-5" />}
                    label="Area Range"
                    value={`${serializedProperty.areaMin} - ${serializedProperty.areaMax}`}
                    sub={serializedProperty.areaUnit || "Sq.Ft."}
                  />
                )}
                {property.totalTowers && (
                  <PropertyDetailCard
                    icon={<Building2 className="w-5 h-5" />}
                    label="Total Towers"
                    value={String(property.totalTowers)}
                  />
                )}
                {property.possession && (
                  <PropertyDetailCard
                    icon={<Calendar className="w-5 h-5" />}
                    label="Possession"
                    value={property.possession}
                  />
                )}
                {property.reraNumber && (
                  <PropertyDetailCard
                    icon={<Shield className="w-5 h-5" />}
                    label="RERA No."
                    value={property.reraNumber}
                  />
                )}
              </div>

              {/* Action Buttons */}
              <div className="mt-5">
                <PropertyActions propertyName={property.name} />
              </div>
            </div>
          </div>

          {/* Tabs Section */}
          <div className="mt-8 lg:mt-10">
            <PropertyTabs property={serializedProperty} />
          </div>
        </div>
      </section>

      {/* RERA / Legal Info */}
      {(property.reraNumber || property.legalNote) && (
        <section className="bg-[var(--bg-muted)] border-t border-[var(--border)]">
          <div className="container-site py-6">
            {property.reraNumber && (
              <p className="text-xs text-[var(--text-muted)]">
                <span className="font-semibold">RERA:</span> {property.reraNumber}
              </p>
            )}
            {property.legalNote && (
              <p className="text-xs text-[var(--text-muted)] mt-1">{property.legalNote}</p>
            )}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-[var(--navy-dark)] py-10 lg:py-12">
        <div className="container-site">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--gold)]/20 flex items-center justify-center shrink-0">
                <MessageCircle className="w-6 h-6 text-[var(--gold)]" />
              </div>
              <div>
                <h3 className="text-white font-semibold text-sm">Can&apos;t find what you&apos;re looking for?</h3>
                <p className="text-white/50 text-xs">Our experts will help you find the right property.</p>
              </div>
            </div>
            <Link href="/contact" className="btn-gold">
              Talk to an Expert
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

function PropertyHeaderInfo({ property }: { property: PropertyWithImages }) {
  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <h1 className="font-serif text-xl sm:text-2xl lg:text-3xl font-bold text-[var(--text)]">
            {property.name}
          </h1>
          <span className="inline-flex items-center px-2 py-0.5 rounded text-[0.6rem] font-bold tracking-wider uppercase bg-[var(--gold)]/10 text-[var(--gold)] border border-[var(--gold)]/20">
            {getStatusLabel(property.status)}
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors cursor-pointer"
            aria-label="Save property"
          >
            <Heart className="w-4 h-4" />
          </button>
          <button
            className="w-9 h-9 rounded-full border border-[var(--border)] flex items-center justify-center text-[var(--text-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors cursor-pointer"
            aria-label="Share property"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-[var(--text-muted)] mb-3">
        <svg className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <span>{property.locality}, {property.city}</span>
      </div>

      <div className="mb-1">
        <p className="text-xs text-[var(--text-muted)]">Starting from</p>
      </div>
      <div className="flex items-baseline gap-1.5">
        {property.priceMin ? (
          <span className="text-[var(--gold)] text-xl sm:text-2xl font-bold">
            ₹{formatPrice(Number(property.priceMin))}
          </span>
        ) : (
          <span className="flex items-center gap-1.5 text-[var(--text-muted)] text-lg font-semibold">
            <IndianRupee className="w-4 h-4" />
            Not Disclosed
          </span>
        )}
        {property.priceLabel && (
          <span className="text-xs text-[var(--text-muted)]">{property.priceLabel}</span>
        )}
      </div>
    </div>
  );
}

function PropertyDetailCard({ icon, label, value, sub }: { icon?: React.ReactNode; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-white border border-[var(--border)] rounded-lg p-4 text-center">
      {icon && (
        <div className="w-10 h-10 mx-auto mb-2 rounded-full bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)]">
          {icon}
        </div>
      )}
      <p className="text-[0.65rem] font-semibold tracking-wider uppercase text-[var(--text-muted)] mb-1">{label}</p>
      <p className="text-sm font-bold text-[var(--text)]">{value}</p>
      {sub && <p className="text-[0.6rem] text-[var(--text-light)]">{sub}</p>}
    </div>
  );
}
