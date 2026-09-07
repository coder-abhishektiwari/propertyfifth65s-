export default function PropertyDetailLoading() {
  return (
    <>
      <section className="bg-[var(--bg-muted)] border-b border-[var(--border)]">
        <div className="container-site py-3">
          <div className="h-3 bg-[var(--bg)] rounded w-64 animate-pulse" />
        </div>
      </section>

      <section className="bg-[var(--bg)]">
        <div className="container-site py-6 lg:py-8">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
            <div className="flex-1 min-w-0">
              {/* Gallery skeleton */}
              <div className="aspect-[16/10] bg-[var(--bg-muted)] rounded-lg animate-pulse" />
              <div className="flex gap-2 mt-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <div key={i} className="w-16 h-12 bg-[var(--bg-muted)] rounded animate-pulse" />
                ))}
              </div>

              {/* Details grid skeleton */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border border-[var(--border)] rounded-lg p-4 animate-pulse">
                    <div className="h-2 bg-[var(--bg-muted)] rounded w-16 mx-auto mb-2" />
                    <div className="h-4 bg-[var(--bg-muted)] rounded w-20 mx-auto" />
                  </div>
                ))}
              </div>
            </div>

            {/* Sidebar skeleton */}
            <div className="w-full lg:w-[340px] shrink-0 space-y-5">
              <div className="bg-white border border-[var(--border)] rounded-lg p-5 animate-pulse">
                <div className="h-4 bg-[var(--bg-muted)] rounded w-32 mb-2" />
                <div className="h-3 bg-[var(--bg-muted)] rounded w-48 mb-3" />
                <div className="h-5 bg-[var(--bg-muted)] rounded w-24 mb-4" />
                <div className="space-y-3">
                  <div className="h-10 bg-[var(--bg-muted)] rounded" />
                  <div className="h-10 bg-[var(--bg-muted)] rounded" />
                  <div className="h-10 bg-[var(--bg-muted)] rounded" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
