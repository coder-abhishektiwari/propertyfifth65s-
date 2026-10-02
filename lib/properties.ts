import { db } from "@/lib/db";
import { Prisma, PropertyType, Purpose, PropertyStatus } from "@prisma/client";
export { formatPrice, getStatusLabel, getPropertyTypeLabel, getPurposeLabel } from "@/lib/property-utils";
export type { PropertyImageRecord, PropertyBasic } from "@/lib/property-utils";

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
  amenities?: string[];
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
  // Undisclosed pricing (priceMin = null) must stay visible when a budget
  // filter is active — those cards show "price on request" and sort last.
  const budgetFilterActive =
    filters.priceMin !== undefined || filters.priceMax !== undefined;

  if (budgetFilterActive) {
    const disclosedPrice: Prisma.PropertyWhereInput[] = [];
    if (filters.priceMin !== undefined) {
      disclosedPrice.push({ priceMin: { gte: filters.priceMin } });
    }
    if (filters.priceMax !== undefined) {
      disclosedPrice.push({ priceMax: { lte: filters.priceMax } });
    }

    const existingAnd = where.AND
      ? Array.isArray(where.AND)
        ? where.AND
        : [where.AND]
      : [];

    where.AND = [
      ...existingAnd,
      {
        OR: [
          // Published price that matches the selected budget
          ...(disclosedPrice.length > 0 ? [{ AND: disclosedPrice }] : []),
          // Undisclosed / on-request pricing remains eligible
          { priceMin: null },
        ],
      },
    ];
  }

  // Featured filter
  if (filters.featured) {
    where.featured = true;
  }

  // Amenities filter — match selected amenities against Property.amenities JSON
  // Prisma JSON string_contains does not substring-search arrays on PostgreSQL,
  // so resolve matching property IDs via SQL first, then apply the normal query.
  if (filters.amenities && filters.amenities.length > 0) {
    const amenityLiterals = filters.amenities.map(
      (amenity) =>
        Prisma.sql`EXISTS (
          SELECT 1 FROM jsonb_array_elements_text(a."amenities") AS am(item)
          WHERE am.item ILIKE ${`%${amenity}%`}
        )`
    );

    const rows = await db.$queryRaw<{ id: string }[]>`
      SELECT a.id FROM "Property" a
      WHERE a.published = true
        AND a."amenities" IS NOT NULL
        AND ${Prisma.join(amenityLiterals, " AND ")}
    `;

    where.id = { in: rows.map((row) => row.id) };
  }

  // Build orderBy
  // When a budget filter is on, undisclosed (null priceMin) always sort last.
  let orderBy: Prisma.PropertyOrderByWithRelationInput[];
  if (budgetFilterActive) {
    if (sort.field === "priceMin") {
      orderBy = [{ priceMin: { sort: sort.order, nulls: "last" } }];
    } else if (sort.field === "createdAt") {
      orderBy = [
        { priceMin: { sort: "asc", nulls: "last" } },
        { createdAt: sort.order },
      ];
    } else {
      orderBy = [
        { priceMin: { sort: "asc", nulls: "last" } },
        { featured: "desc" },
        { createdAt: "desc" },
      ];
    }
  } else {
    switch (sort.field) {
      case "featured":
        orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
        break;
      case "createdAt":
        orderBy = [{ createdAt: sort.order }];
        break;
      case "priceMin":
        orderBy = [{ priceMin: { sort: sort.order, nulls: "last" } }];
        break;
      default:
        orderBy = [{ featured: "desc" }, { createdAt: "desc" }];
    }
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

/** Unique amenity strings collected from Property.amenities JSON. */
export async function getUniqueAmenities(options?: {
  publishedOnly?: boolean;
}): Promise<string[]> {
  const where = options?.publishedOnly ? { published: true } : {};
  const result = await db.property.findMany({
    where,
    select: { amenities: true },
  });

  const unique = new Set<string>();
  for (const row of result) {
    if (!Array.isArray(row.amenities)) continue;
    for (const item of row.amenities) {
      if (typeof item === "string" && item.trim()) unique.add(item.trim());
    }
  }

  return Array.from(unique).sort((a, b) => a.localeCompare(b));
}

/** Min/max published property prices for the budget range slider. */
export async function getPriceBounds(): Promise<{ min: number; max: number }> {
  const result = await db.property.aggregate({
    where: { published: true, priceMin: { not: null } },
    _min: { priceMin: true },
    _max: { priceMin: true },
  });

  const min = result._min.priceMin != null ? Number(result._min.priceMin) : 0;
  const max = result._max.priceMin != null ? Number(result._max.priceMin) : 100000000;

  if (max <= min) {
    return { min: 0, max: 100000000 };
  }
  return { min, max };
}

export async function getUniqueConfigurations(): Promise<string[]> {
  const result = await db.property.findMany({
    where: { published: true, configuration: { not: null } },
    select: { configuration: true },
    orderBy: { configuration: "asc" },
  });
  return result.map((r) => r.configuration).filter((c): c is string => c !== null);
}

export async function getFeaturedProperties(): Promise<PropertyWithImages[]> {
  return db.property.findMany({
    where: { published: true, featured: true },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: {
      images: {
        select: { imageUrl: true, isCover: true, sortOrder: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
}

export async function getPropertyBySlug(slug: string): Promise<PropertyWithImages | null> {
  const property = await db.property.findFirst({
    where: { slug, published: true },
    include: {
      images: {
        select: { imageUrl: true, isCover: true, sortOrder: true },
        orderBy: { sortOrder: "asc" },
      },
    },
  });
  return property;
}
