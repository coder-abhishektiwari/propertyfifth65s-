export default function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white border border-[var(--border)] rounded-lg overflow-hidden animate-pulse">
          {/* Image skeleton */}
          <div className="aspect-[16/10] bg-[var(--bg-muted)]" />
          {/* Content skeleton */}
          <div className="p-4 space-y-3">
            <div className="h-4 bg-[var(--bg-muted)] rounded w-3/4" />
            <div className="h-3 bg-[var(--bg-muted)] rounded w-1/2" />
            <div className="h-3 bg-[var(--bg-muted)] rounded w-2/3" />
            <div className="h-5 bg-[var(--bg-muted)] rounded w-1/3 mt-4" />
            <div className="pt-3 border-t border-[var(--border-light)] flex justify-between">
              <div className="h-3 bg-[var(--bg-muted)] rounded w-20" />
              <div className="h-3 bg-[var(--bg-muted)] rounded w-4" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
