export default function PropertyGridSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="bg-white border border-[var(--border)] rounded-lg overflow-hidden animate-pulse">
          {/* Image */}
          <div className="relative aspect-[16/10] bg-[var(--bg-muted)]">
            {/* Status badge */}
            <div className="absolute top-3 left-3">
              <div className="h-4 w-16 bg-white/30 rounded" />
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            {/* Title */}
            <div className="h-4 bg-[var(--bg-muted)] rounded w-3/4 mb-3" />

            {/* City */}
            <div className="flex items-center gap-1.5 mb-3">
              <div className="w-3 h-3 bg-[var(--bg-muted)] rounded-full" />
              <div className="h-3 bg-[var(--bg-muted)] rounded w-24" />
            </div>

            {/* Configuration */}
            <div className="h-3 bg-[var(--bg-muted)] rounded w-2/3 mb-4" />

            {/* Price */}
            <div className="mb-4">
              <div className="h-5 bg-[var(--bg-muted)] rounded w-1/3" />
            </div>

            {/* CTA */}
            <div className="pt-3 border-t border-[var(--border-light)] flex items-center justify-between">
              <div className="h-3 bg-[var(--bg-muted)] rounded w-20" />
              <div className="w-4 h-4 bg-[var(--bg-muted)] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
