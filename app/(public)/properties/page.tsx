import { Metadata } from "next";
import { getProperties, getUniqueCities } from "@/lib/properties";
import type { PropertyType, Purpose, PropertyStatus } from "@prisma/client";
import PropertyFilters from "@/components/properties/property-filters";
import PropertyGrid from "@/components/properties/property-grid";
import PropertySort from "@/components/properties/property-sort";
import PropertyPagination from "@/components/properties/property-pagination";

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
     
      {/* Main Content */}
      <section className="section-py mt-10 bg-[var(--bg)]">
        <div className="container-site">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <PropertyFilters cities={cities} />

            {/* Property Results */}
            <div className="flex-1 min-w-0">
              {/* Results Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-6">
                <div>
                  {result.totalCount > 0 ? (
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
                  ) : (
                    <p className="text-xs text-[var(--text-muted)]">
                      No published properties match your search.
                    </p>
                  )}
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

    
    </>
  );
}

export default async function PropertiesPage({ searchParams }: PropertiesPageProps) {
  return (
      <PropertiesContent searchParams={searchParams} />
  );
}
