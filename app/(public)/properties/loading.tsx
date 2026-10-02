import PropertyGridSkeleton from "@/components/properties/property-grid-skeleton";

export default function PropertiesLoading() {
  return (
    <section className="section-py mt-10 bg-background">
      <div className="container-site">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar skeleton */}
          <aside className="hidden lg:block w-64 shrink-0">
            <div className="sticky top-24 card-premium p-5 space-y-6">
              <div className="h-4 bg-muted rounded w-20 animate-pulse" />
              <div className="space-y-2">
                <div className="h-9 bg-muted rounded animate-pulse" />
                <div className="h-3 bg-muted rounded w-24 animate-pulse" />
              </div>
              <div className="space-y-2">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="h-3 bg-muted rounded w-32 animate-pulse" />
                ))}
              </div>
              <div className="space-y-2">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="h-3 bg-muted rounded w-28 animate-pulse" />
                ))}
              </div>
            </div>
          </aside>

          {/* Results skeleton */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-6">
              <div className="h-3 bg-muted rounded w-48 animate-pulse" />
              <div className="h-8 bg-muted rounded w-32 animate-pulse" />
            </div>
            <PropertyGridSkeleton />
          </div>
        </div>
      </div>
    </section>
  );
}
