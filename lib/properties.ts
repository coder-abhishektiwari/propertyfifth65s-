import { db } from "@/lib/db";
import { Prisma, PropertyType, Purpose, PropertyStatus } from "@prisma/client";

export type PropertyWithImages = Prisma.PropertyGetPayload<{
  include: { images: { select: { imageUrl: true; isCover: true; sortOrder: true } } };
}>;

export interface PropertyFilters {
  search?: string;
  propertyType?: PropertyType;
  purpose?: Purpose;
  status?: PropertyStatus;
  city?: string;
  configuration?: string;
  priceMin?: number;
  priceMax?: number;
  featured?: boolean;
}

export interface SortOption {
  field: "featured" | "createdAt" | "priceMin";
  order: "asc" | "desc";
}

export interface PropertyQueryResult {
  properties: PropertyWithImages[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

const PAGE_SIZE = 9;

export async function getProperties(
  filters: PropertyFilters = {},
  sort: SortOption = { field: "featured", order: "desc" },
  page: number = 1
): Promise<PropertyQueryResult> {
  const where: Prisma.PropertyWhereInput = {
    published: true,
  };

  // Search filter - search across name, developerName, locality, city, address
  if (filters.search) {
    const searchTerm = filters.search.trim();
    where.OR = [
      { name: { contains: searchTerm, mode: "insensitive" } },
      { developerName: { contains: searchTerm, mode: "insensitive" } },
      { locality: { contains: searchTerm, mode: "insensitive" } },
      { city: { contains: searchTerm, mode: "insensitive" } },
      { address: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  // Property type filter
  if (filters.propertyType) {
    where.propertyType = filters.propertyType;
  }

  // Purpose filter
  if (filters.purpose) {
    where.purpose = filters.purpose;
  }

  // Status filter
  if (filters.status) {
    where.status = filters.status;
  }

  // City filter
  if (filters.city) {
    where.city = { equals: filters.city, mode: "insensitive" };
  }

  // Configuration filter
  if (filters.configuration) {
    where.configuration = { contains: filters.configuration, mode: "insensitive" };
  }

  // Price range filters
  if (filters.priceMin !== undefined) {
    where.priceMin = { gte: filters.priceMin };
  }
  if (filters.priceMax !== undefined) {
    where.priceMax = { lte: filters.priceMax };
  }

  // Featured filter
  if (filters.featured) {
    where.featured = true;
  }

  // Build orderBy
  let orderBy: Prisma.PropertyOrderByWithRelationInput;
  switch (sort.field) {
    case "featured":
      orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
      break;
    case "createdAt":
      orderBy = { createdAt: sort.order };
      break;
    case "priceMin":
      orderBy = { priceMin: sort.order };
      break;
    default:
      orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
  }

  const skip = (page - 1) * PAGE_SIZE;

  const [properties, totalCount] = await Promise.all([
    db.property.findMany({
      where,
      orderBy,
      skip,
      take: PAGE_SIZE,
      include: {
        images: {
          select: { imageUrl: true, isCover: true, sortOrder: true },
          orderBy: { sortOrder: "asc" },
        },
      },
    }),
    db.property.count({ where }),
  ]);

  const totalPages = Math.ceil(totalCount / PAGE_SIZE);

  return {
    properties,
    totalCount,
    page,
    pageSize: PAGE_SIZE,
    totalPages,
  };
}

export async function getUniqueCities(): Promise<string[]> {
  const result = await db.property.findMany({
    where: { published: true },
    select: { city: true },
    distinct: ["city"],
    orderBy: { city: "asc" },
  });
  return result.map((r) => r.city);
}

export async function getUniqueConfigurations(): Promise<string[]> {
  const result = await db.property.findMany({
    where: { published: true, configuration: { not: null } },
    select: { configuration: true },
    orderBy: { configuration: "asc" },
  });
  return result.map((r) => r.configuration).filter((c): c is string => c !== null);
}

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
