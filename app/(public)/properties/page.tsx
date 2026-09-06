import { Suspense } from "react";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, ChevronRight } from "lucide-react";
import { getProperties, getUniqueCities, formatPrice } from "@/lib/properties";
import type { PropertyType, Purpose, PropertyStatus } from "@prisma/client";
import PropertyFilters from "@/components/properties/property-filters";
import PropertyGrid from "@/components/properties/property-grid";
import PropertySort from "@/components/properties/property-sort";
import PropertyPagination from "@/components/properties/property-pagination";
import PropertyGridSkeleton from "@/components/properties/property-grid-skeleton";

export const metadata: Metadata = {
  title: "Properties | Property Fifth",
  description:
    "Explore curated residential and commercial real estate opportunities with Property Fifth. Premium properties selected for discerning buyers and their families.",
};

interface PropertiesPageProps {
  searchParams: Promise<{
    search?: string;
    propertyType?: string;
    purpose?: string;
    status?: string;
    city?: string;
    configuration?: string;
    priceMin?: string;
    priceMax?: string;
    sort?: string;
    page?: string;
  }>;
}

async function PropertiesContent({
  searchParams,
}: {
  searchParams: PropertiesPageProps["searchParams"];
}) {
  const params = await searchParams;

  // Parse filters from URL
  const filters = {
    search: params.search || undefined,
    propertyType: (params.propertyType as PropertyType) || undefined,
    purpose: (params.purpose as Purpose) || undefined,
    status: (params.status as PropertyStatus) || undefined,
    city: params.city || undefined,
    configuration: params.configuration || undefined,
    priceMin: params.priceMin ? Number(params.priceMin) : undefined,
    priceMax: params.priceMax ? Number(params.priceMax) : undefined,
  };

  // Parse sort
  let sortField: "featured" | "createdAt" | "priceMin" = "featured";
  let sortOrder: "asc" | "desc" = "desc";

  switch (params.sort) {
    case "newest":
      sortField = "createdAt";
      sortOrder = "desc";
      break;
    case "price-low":
      sortField = "priceMin";
      sortOrder = "asc";
      break;
    case "price-high":
      sortField = "priceMin";
      sortOrder = "desc";
      break;
    default:
      sortField = "featured";
      sortOrder = "desc";
  }

  const page = params.page ? Math.max(1, Number(params.page)) : 1;

  // Fetch data
  const [result, cities] = await Promise.all([
    getProperties(filters, { field: sortField, order: sortOrder }, page),
    getUniqueCities(),
  ]);

  // Count active filters
  const activeFilterCount = Object.values(filters).filter(Boolean).length;

  return (
    <>
      {/* Page Header */}
      <section className="bg-[var(--navy)] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <Image
            src="/images/properties/ascent-grandis/ascent-grandis-exterior-01.jpg"
            alt=""
            fill
            className="object-cover"
          />
        </div>
        <div className="relative container-site py-10 lg:py-14">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs text-white/50 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <ChevronRight className="w-3 h-3" />
            <span className="text-white/80">Properties</span>
          </nav>

          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            <div>
              <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white">
                Explore <span className="text-[var(--gold)]">Premium</span> Properties
              </h1>
              <p className="text-white/60 text-sm mt-2 max-w-lg">
                Curated properties for discerning buyers and their families.
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex items-center gap-6 text-white/60 text-xs">
              <div>
                <span className="text-[var(--gold)] text-lg font-bold block">{result.totalCount}</span>
                <span>Properties</span>
              </div>
              <div className="w-px h-8 bg-white/20" />
              <div>
                <span className="text-[var(--gold)] text-lg font-bold block">{cities.length}</span>
                <span>Cities</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="section-py bg-[var(--bg)]">
        <div className="container-site">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <PropertyFilters cities={cities} />

            {/* Property Results */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  <p className="text-xs text-[var(--text-muted)]">
                    Showing{" "}
                    <span className="font-semibold text-[var(--text)]">
                      {(result.page - 1) * result.pageSize + 1} –{" "}
                      {Math.min(result.page * result.pageSize, result.totalCount)}
                    </span>{" "}
                    of <span className="font-semibold text-[var(--text)]">{result.totalCount}</span> Properties
                    {activeFilterCount > 0 && (
                      <span className="ml-2 text-[var(--gold)]">
                        ({activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active)
                      </span>
                    )}
                  </p>
                </div>
                <PropertySort />
              </div>

              {/* Property Grid */}
              <PropertyGrid properties={result.properties} />

              {/* Pagination */}
              <PropertyPagination
                currentPage={result.page}
                totalPages={result.totalPages}
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[var(--navy-dark)] py-10 lg:py-12">
        <div className="container-site">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-[var(--gold)]/20 flex items-center justify-center shrink-0">
                <svg className="w-6 h-6 text-[var(--gold)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 01-.825-.242m9.345-8.334a2.126 2.126 0 00-.476-.095 48.64 48.64 0 00-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0011.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
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

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  return (
    <Suspense
      fallback={
        <>
          <section className="bg-[var(--navy)]">
            <div className="container-site py-10 lg:py-14">
              <div className="h-4 bg-white/10 rounded w-48 mb-3 animate-pulse" />
              <div className="h-8 bg-white/10 rounded w-64 mb-2 animate-pulse" />
              <div className="h-4 bg-white/10 rounded w-80 animate-pulse" />
            </div>
          </section>
          <section className="section-py bg-[var(--bg)]">
            <div className="container-site">
              <PropertyGridSkeleton />
            </div>
          </section>
        </>
      }
    >
      <PropertiesContent searchParams={searchParams} />
    </Suspense>
  );
}
