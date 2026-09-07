import { PropertyType, Purpose, PropertyStatus } from "@prisma/client";

export type PropertyImageRecord = {
  imageUrl: string;
  isCover: boolean;
  sortOrder: number;
};

export type PropertyBasic = {
  id: string;
  name: string;
  slug: string;
  propertyType: PropertyType;
  purpose: Purpose | null;
  status: PropertyStatus;
  featured: boolean;
  published: boolean;
  address: string;
  locality: string;
  city: string;
  state: string | null;
  pincode: string | null;
  latitude: number | null;
  longitude: number | null;
  mapUrl: string | null;
  priceMin: number;
  priceMax: number | null;
  priceLabel: string | null;
  configuration: string | null;
  areaMin: number | null;
  areaMax: number | null;
  areaUnit: string | null;
  possession: string | null;
  totalTowers: number | null;
  totalUnits: number | null;
  totalArea: string | null;
  reraNumber: string | null;
  legalNote: string | null;
  shortDescription: string | null;
  description: string | null;
  highlights: unknown;
  amenities: unknown;
  specifications: unknown;
  bankApproved: unknown;
  videoUrl: string | null;
  brochureUrl: string | null;
  brochureName: string | null;
  brochureSize: string | null;
  createdAt: Date;
  updatedAt: Date;
  images: PropertyImageRecord[];
};

export function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `${(price / 100000).toFixed(2)} L`;
  } else {
    return price.toLocaleString("en-IN");
  }
}

export function getStatusLabel(status: PropertyStatus): string {
  const labels: Record<PropertyStatus, string> = {
    NEW_LAUNCH: "New Launch",
    UNDER_CONSTRUCTION: "Under Construction",
    READY_TO_MOVE: "Ready to Move",
    RESALE: "Resale",
    SOLD_OUT: "Sold Out",
    OTHER: "Other",
  };
  return labels[status] || status;
}

export function getPropertyTypeLabel(type: PropertyType): string {
  const labels: Record<PropertyType, string> = {
    APARTMENT: "Apartment",
    VILLA: "Villa",
    PENTHOUSE: "Penthouse",
    PLOT: "Plot",
    COMMERCIAL: "Commercial",
    INDEPENDENT_FLOOR: "Independent Floor",
    OTHER: "Other",
  };
  return labels[type] || type;
}

export function getPurposeLabel(purpose: Purpose | null): string | null {
  if (!purpose) return null;
  const labels: Record<Purpose, string> = {
    END_USE: "End Use",
    INVESTMENT: "Investment",
    BOTH: "End Use & Investment",
  };
  return labels[purpose] || purpose;
}

/**
 * Converts a database image URL to a secure media API URL.
 * DB stores: /images/properties/slug/file.jpg
 * Returns:  /api/media/properties/slug/images/file.jpg
 */
export function toMediaImageUrl(dbUrl: string): string {
  const match = dbUrl.match(/^\/images\/properties\/([^/]+)\/([^/]+)$/);
  if (match) {
    const [, slug, filename] = match;
    return `/api/media/properties/${encodeURIComponent(slug)}/images/${encodeURIComponent(filename)}`;
  }
  return dbUrl;
}

/**
 * Converts a database brochure URL to a secure media API URL.
 * DB stores: /brochures/slug/file.pdf  OR  /images/properties/slug/brochure/file.pdf
 * Returns:   /api/media/properties/slug/brochure/file.pdf
 */
export function toMediaBrochureUrl(dbUrl: string): string {
  const matchOld = dbUrl.match(/^\/brochures\/([^/]+)\/([^/]+)$/);
  if (matchOld) {
    const [, slug, filename] = matchOld;
    return `/api/media/properties/${encodeURIComponent(slug)}/brochure/${encodeURIComponent(filename)}`;
  }
  const matchNew = dbUrl.match(/^\/images\/properties\/([^/]+)\/brochure\/([^/]+)$/);
  if (matchNew) {
    const [, slug, filename] = matchNew;
    return `/api/media/properties/${encodeURIComponent(slug)}/brochure/${encodeURIComponent(filename)}`;
  }
  return dbUrl;
}
