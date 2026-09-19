"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { MapPin, ArrowRight, Share2 } from "lucide-react";
import PropertyPlaceholder from "@/components/property-placeholder";
import { toMediaImageUrl, formatPrice } from "@/lib/property-utils";

interface SharedProperty {
  id: string;
  name: string;
  slug: string;
  city: string;
  locality: string | null;
  configuration: string | null;
  priceMin: number | null;
  priceLabel: string | null;
  propertyType: string | null;
  status: string;
  coverImage: string | null;
}

export default function SharedListClient() {
  const searchParams = useSearchParams();
  const [properties, setProperties] = useState<SharedProperty[]>([]);
  const [sharerName, setSharerName] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const data = searchParams.get("data");
    if (!data) {
      setError(true);
      setLoading(false);
      return;
    }

    try {
      const decoded = JSON.parse(atob(data));
      const ids: string[] = decoded.ids || [];
      const name: string = decoded.name || "Someone";
      setSharerName(name);

      if (ids.length === 0) {
        setLoading(false);
        return;
      }

      fetch(`/api/shared-list?ids=${ids.join(",")}`)
        .then((res) => res.json())
        .then((data) => {
          setProperties(data.properties || []);
        })
        .catch(() => setError(true))
        .finally(() => setLoading(false));
    } catch {
      setError(true);
      setLoading(false);
    }
  }, [searchParams]);

  if (loading) {
    return (
      <div className="container-site py-32 flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container-site py-32 text-center">
        <h2 className="text-xl font-serif font-bold text-foreground mb-2">Invalid or Expired Link</h2>
        <p className="text-sm text-muted-foreground mb-6">This shared list link is not valid.</p>
        <Link href="/properties" className="btn-primary inline-flex items-center gap-1.5">
          Browse Properties
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-muted border-b border-border mt-16 lg:mt-18">
        <div className="container-site py-8 lg:py-10">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center">
              <Share2 className="w-5 h-5 text-accent" />
            </div>
            <div>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-foreground">
                Property List
              </h1>
            </div>
          </div>
          <div className="w-12 h-0.5 bg-accent mt-3 mb-3" />
          <p className="text-sm text-muted-foreground">
            Shared by <span className="font-semibold text-foreground">{sharerName}</span> — {properties.length} {properties.length === 1 ? "property" : "properties"} saved
          </p>
        </div>
      </section>

      {/* Properties */}
      <section className="bg-background py-8 lg:py-10">
        <div className="container-site">
          {properties.length === 0 ? (
            <div className="text-center py-16">
              <Share2 className="w-14 h-14 text-[var(--border)] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-foreground mb-2">No properties in this list</h3>
              <p className="text-sm text-muted-foreground">The shared list is empty.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {properties.map((property) => (
                <div
                  key={property.id}
                  className="bg-card border border-border rounded-lg overflow-hidden group"
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    {property.coverImage ? (
                      <Image
                        src={toMediaImageUrl(property.coverImage)}
                        alt={property.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
                      />
                    ) : (
                      <PropertyPlaceholder className="absolute inset-0" />
                    )}
                    <div className="absolute top-3 left-3 z-10">
                      <span className="bg-primary text-inverse text-[0.6rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
                        {property.propertyType === "APARTMENT" ? "Apartment" :
                         property.propertyType === "VILLA" ? "Villa" :
                         property.propertyType === "PENTHOUSE" ? "Penthouse" :
                         property.propertyType === "PLOT" ? "Plot" :
                         property.propertyType === "COMMERCIAL" ? "Commercial" : "Property"}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4">
                    <h3 className="font-serif text-base font-bold text-foreground mb-1">
                      {property.name}
                    </h3>
                    <div className="flex items-center gap-1 text-muted-foreground text-xs mb-2">
                      <MapPin className="w-3 h-3 text-accent shrink-0" />
                      <span>{property.locality ? `${property.locality}, ${property.city}` : property.city}</span>
                    </div>
                    {property.configuration && (
                      <p className="text-xs text-muted-foreground mb-2">
                        {property.configuration}
                      </p>
                    )}
                    <div className="flex items-baseline gap-1 mb-3">
                      {property.priceMin ? (
                        <span className="text-accent text-lg font-bold">
                          ₹{formatPrice(property.priceMin)}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground font-semibold">Price Not Disclosed</span>
                      )}
                      {property.priceLabel && (
                        <span className="text-xs text-muted-foreground">{property.priceLabel}</span>
                      )}
                    </div>
                    <div className="pt-3 border-t border-border-light">
                      <Link
                        href={`/properties/${property.slug}`}
                        className="text-[0.7rem] font-semibold tracking-wider uppercase text-primary hover:text-accent transition-colors"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
