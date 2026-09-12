import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, IndianRupee } from "lucide-react";
import type { PropertyWithImages } from "@/lib/properties";
import { formatPrice, getStatusLabel } from "@/lib/properties";
import { toMediaImageUrl } from "@/lib/property-utils";

interface PropertyCardProps {
  property: PropertyWithImages;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const coverImage = property.images.find((img) => img.isCover);
  const imageUrl = toMediaImageUrl(coverImage?.imageUrl || property.images[0]?.imageUrl || "/images/hero/hero-building.webp");

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group bg-white border border-[var(--border)] rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 block"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image
          src={imageUrl}
          alt={property.name}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-500"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="bg-[var(--gold)] text-white text-[0.6rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
            {getStatusLabel(property.status)}
          </span>
        </div>
        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="bg-[var(--navy)] text-white text-[0.6rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-serif text-base font-bold text-[var(--text)] mb-1 group-hover:text-[var(--gold)] transition-colors">
          {property.name}
        </h3>

        <div className="flex items-center gap-1 text-[var(--text-muted)] text-xs mb-2">
          <MapPin className="w-3 h-3 text-[var(--gold)] shrink-0" />
          <span>{property.city}</span>
        </div>

        {property.configuration && (
          <p className="text-xs text-[var(--text-muted)] mb-3 line-clamp-1">
            {property.configuration}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4">
          {property.priceMin ? (
            <span className="text-[var(--gold)] text-lg font-bold">
              ₹{formatPrice(Number(property.priceMin))}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-[var(--text-muted)] text-sm font-bold">
              <IndianRupee className="w-3.5 h-3.5" />
              Price Not Disclosed
            </span>
          )}
          {property.priceLabel && (
            <span className="text-[var(--text-muted)] text-xs">
              {property.priceLabel}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-3 border-t border-[var(--border-light)]">
          <span className="text-[0.7rem] font-semibold tracking-wider uppercase text-[var(--navy)] group-hover:text-[var(--gold)] transition-colors">
            View Details
          </span>
          <ArrowRight className="w-4 h-4 text-[var(--navy)] group-hover:text-[var(--gold)] group-hover:translate-x-1 transition-all" />
        </div>
      </div>
    </Link>
  );
}
