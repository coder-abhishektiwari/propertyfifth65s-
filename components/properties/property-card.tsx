import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, IndianRupee } from "lucide-react";
import type { PropertyWithImages } from "@/lib/properties";
import { formatPrice, getStatusLabel } from "@/lib/properties";
import { toMediaImageUrl } from "@/lib/property-utils";
import PropertyPlaceholder from "@/components/property-placeholder";

interface PropertyCardProps {
  property: PropertyWithImages;
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const coverImage = property.images.find((img) => img.isCover);
  const rawUrl = coverImage?.imageUrl || property.images[0]?.imageUrl;
  const imageUrl = rawUrl ? toMediaImageUrl(rawUrl) : null;

  return (
    <Link
      href={`/properties/${property.slug}`}
      className="group bg-card border border-border rounded-xl overflow-hidden shadow hover:shadow-md hover:-translate-y-0.5 hover:border-border-strong transition-all duration-200 block"
    >
      {/* Image */}
      <div className="relative aspect-[16/10] overflow-hidden bg-muted">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={property.name}
            fill
            className="object-cover group-hover:scale-[1.03] transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <PropertyPlaceholder className="absolute inset-0" />
        )}
        {/* Status Badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="badge-status badge-accent shadow-sm">
            {getStatusLabel(property.status)}
          </span>
        </div>
        {/* Featured Badge */}
        {property.featured && (
          <div className="absolute top-3 right-3 z-10">
            <span className="badge-status bg-primary text-inverse border-primary shadow-sm">
              Featured
            </span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5">
        <h3 className="font-serif text-base font-bold text-foreground tracking-tight mb-1.5 group-hover:text-accent transition-colors duration-200">
          {property.name}
        </h3>

        <div className="flex items-center gap-1.5 text-muted-foreground text-xs mb-2.5">
          <MapPin className="w-3.5 h-3.5 text-accent shrink-0" />
          <span className="truncate">{property.city}</span>
        </div>

        {property.configuration && (
          <p className="text-xs text-muted-foreground mb-3 line-clamp-1 leading-relaxed">
            {property.configuration}
          </p>
        )}

        {/* Price */}
        <div className="flex items-baseline gap-1 mb-4">
          {property.priceMin ? (
            <span className="text-accent text-lg font-bold">
              ₹{formatPrice(Number(property.priceMin))}
            </span>
          ) : (
            <span className="flex items-center gap-1.5 text-muted-foreground text-sm font-bold">
              <IndianRupee className="w-3.5 h-3.5" />
              Price Not Disclosed
            </span>
          )}
          {property.priceLabel && (
            <span className="text-muted-foreground text-xs">
              {property.priceLabel}
            </span>
          )}
        </div>

        {/* CTA */}
        <div className="flex items-center justify-between pt-3.5 border-t border-border-light">
          <span className="text-[0.7rem] font-bold tracking-[0.12em] uppercase text-primary group-hover:text-accent transition-colors duration-200">
            View Details
          </span>
          <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-muted text-primary group-hover:bg-accent group-hover:text-inverse transition-colors duration-200">
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-px transition-transform duration-200" />
          </span>
        </div>
      </div>
    </Link>
  );
}
