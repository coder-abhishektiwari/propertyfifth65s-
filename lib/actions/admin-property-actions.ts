"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getAdminIdFromSession } from "@/lib/auth/session";
import { PropertyType, Purpose, PropertyStatus, Prisma } from "@prisma/client";

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function requireAdmin(): Promise<string> {
  const adminId = await getAdminIdFromSession();
  if (!adminId) throw new Error("UNAUTHORIZED");
  return adminId;
}

export type PropertyFormData = {
  name: string;
  slug?: string;
  developerName?: string;
  propertyType: PropertyType;
  purpose?: Purpose;
  status?: PropertyStatus;
  address: string;
  locality: string;
  city: string;
  state?: string;
  pincode?: string;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  priceMin?: number;
  priceMax?: number;
  priceLabel?: string;
  configuration?: string;
  areaMin?: number;
  areaMax?: number;
  areaUnit?: string;
  possession?: string;
  totalTowers?: number;
  totalUnits?: number;
  totalArea?: string;
  reraNumber?: string;
  legalNote?: string;
  shortDescription?: string;
  description?: string;
  highlights?: string[];
  amenities?: string[];
  specifications?: { label: string; value: string }[];
  bankApproved?: { name: string; logo?: string }[];
  videoUrl?: string;
  published?: boolean;
  featured?: boolean;
};

export type ActionResponse = {
  success: boolean;
  error?: string;
  propertyId?: string;
  propertySlug?: string;
};

function validateRequired(data: PropertyFormData): string | null {
  if (!data.name?.trim()) return "Property name is required";
  if (!data.propertyType) return "Property type is required";
  if (!data.address?.trim()) return "Address is required";
  if (!data.locality?.trim()) return "Locality is required";
  if (!data.city?.trim()) return "City is required";
  return null;
}

function cleanJsonArray(arr: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
  if (!Array.isArray(arr)) return Prisma.DbNull;
  const cleaned = arr
    .filter((item): item is string => typeof item === "string" && item.trim().length > 0)
    .map((item) => item.trim());
  return cleaned.length > 0 ? cleaned : Prisma.DbNull;
}

function cleanSpecifications(arr: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
  if (!Array.isArray(arr)) return Prisma.DbNull;
  const cleaned = arr
    .filter(
      (item): item is { label: string; value: string } =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).label === "string" &&
        typeof (item as Record<string, unknown>).value === "string" &&
        ((item as Record<string, unknown>).label as string).trim().length > 0 &&
        ((item as Record<string, unknown>).value as string).trim().length > 0
    )
    .map((item) => ({
      label: (item as { label: string }).label.trim(),
      value: (item as { value: string }).value.trim(),
    }));
  return cleaned.length > 0 ? cleaned : Prisma.DbNull;
}

function cleanBankApproved(arr: unknown): Prisma.InputJsonValue | Prisma.NullableJsonNullValueInput {
  if (!Array.isArray(arr)) return Prisma.DbNull;
  const cleaned = arr
    .filter(
      (item): item is { name: string; logo?: string } =>
        typeof item === "object" &&
        item !== null &&
        typeof (item as Record<string, unknown>).name === "string" &&
        ((item as Record<string, unknown>).name as string).trim().length > 0
    )
    .map((item) => ({
      name: (item as { name: string }).name.trim(),
      logo: typeof (item as { logo?: string }).logo === "string" ? (item as { logo: string }).logo?.trim() || undefined : undefined,
    }));
  return cleaned.length > 0 ? cleaned : Prisma.DbNull;
}

async function generateUniqueSlug(base: string, excludeId?: string): Promise<string> {
  let slug = slugify(base);
  if (!slug) slug = "property";

  let candidate = slug;
  let counter = 1;

  while (true) {
    const existing = await db.property.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || (excludeId && existing.id === excludeId)) {
      return candidate;
    }

    counter++;
    candidate = `${slug}-${counter}`;
  }
}

export async function createProperty(data: PropertyFormData): Promise<ActionResponse> {
  try {
    await requireAdmin();

    const validationError = validateRequired(data);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const slug = data.slug?.trim()
      ? await generateUniqueSlug(data.slug.trim())
      : await generateUniqueSlug(data.name.trim());

    const propertyData: Record<string, unknown> = {
        name: data.name.trim(),
        slug,
        developerName: data.developerName?.trim() || null,
        propertyType: data.propertyType,
        purpose: data.purpose || null,
        featured: data.featured || false,
        published: data.published !== false,
        address: data.address.trim(),
        locality: data.locality.trim(),
        city: data.city.trim(),
        state: data.state?.trim() || null,
        pincode: data.pincode?.trim() || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        mapUrl: data.mapUrl?.trim() || null,
        priceMin: data.priceMin || null,
        priceMax: data.priceMax || null,
        priceLabel: data.priceLabel?.trim() || null,
        configuration: data.configuration?.trim() || null,
        areaMin: data.areaMin || null,
        areaMax: data.areaMax || null,
        areaUnit: data.areaUnit?.trim() || null,
        possession: data.possession?.trim() || null,
        totalTowers: data.totalTowers || null,
        totalUnits: data.totalUnits || null,
        totalArea: data.totalArea?.trim() || null,
        reraNumber: data.reraNumber?.trim() || null,
        legalNote: data.legalNote?.trim() || null,
        shortDescription: data.shortDescription?.trim() || null,
        description: data.description?.trim() || null,
        highlights: cleanJsonArray(data.highlights),
        amenities: cleanJsonArray(data.amenities),
        specifications: cleanSpecifications(data.specifications),
        bankApproved: cleanBankApproved(data.bankApproved),
        videoUrl: data.videoUrl?.trim() || null,
      };

    if (data.status) {
      propertyData.status = data.status;
    }

    const property = await db.property.create({
      data: propertyData as never,
    });

    revalidatePath("/admin/properties");

    return {
      success: true,
      propertyId: property.id,
      propertySlug: property.slug,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Not authenticated" };
    }
    console.error("createProperty error:", error);
    return { success: false, error: "Failed to create property. Please try again." };
  }
}

export async function updateProperty(
  propertyId: string,
  data: PropertyFormData
): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (!propertyId?.trim()) {
      return { success: false, error: "Invalid property ID" };
    }

    const validationError = validateRequired(data);
    if (validationError) {
      return { success: false, error: validationError };
    }

    const existing = await db.property.findUnique({
      where: { id: propertyId },
      select: { id: true, slug: true },
    });

    if (!existing) {
      return { success: false, error: "Property not found" };
    }

    let slug = existing.slug;
    if (data.slug?.trim()) {
      const newSlug = slugify(data.slug.trim());
      if (newSlug && newSlug !== existing.slug) {
        slug = await generateUniqueSlug(newSlug, propertyId);
      }
    }

    const updateData: Record<string, unknown> = {
        name: data.name.trim(),
        slug,
        developerName: data.developerName?.trim() || null,
        propertyType: data.propertyType,
        purpose: data.purpose || null,
        address: data.address.trim(),
        locality: data.locality.trim(),
        city: data.city.trim(),
        state: data.state?.trim() || null,
        pincode: data.pincode?.trim() || null,
        latitude: data.latitude || null,
        longitude: data.longitude || null,
        mapUrl: data.mapUrl?.trim() || null,
        priceMin: data.priceMin || null,
        priceMax: data.priceMax || null,
        priceLabel: data.priceLabel?.trim() || null,
        configuration: data.configuration?.trim() || null,
        areaMin: data.areaMin || null,
        areaMax: data.areaMax || null,
        areaUnit: data.areaUnit?.trim() || null,
        possession: data.possession?.trim() || null,
        totalTowers: data.totalTowers || null,
        totalUnits: data.totalUnits || null,
        totalArea: data.totalArea?.trim() || null,
        reraNumber: data.reraNumber?.trim() || null,
        legalNote: data.legalNote?.trim() || null,
        shortDescription: data.shortDescription?.trim() || null,
        description: data.description?.trim() || null,
        highlights: cleanJsonArray(data.highlights),
        amenities: cleanJsonArray(data.amenities),
        specifications: cleanSpecifications(data.specifications),
        bankApproved: cleanBankApproved(data.bankApproved),
        videoUrl: data.videoUrl?.trim() || null,
      };

    if (data.status) {
      updateData.status = data.status;
    } else {
      updateData.status = null;
    }

    await db.property.update({
      where: { id: propertyId },
      data: updateData as never,
    });

    revalidatePath("/admin/properties");
    revalidatePath(`/admin/properties/${propertyId}/edit`);
    revalidatePath(`/properties/${slug}`);

    return {
      success: true,
      propertyId,
      propertySlug: slug,
    };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Not authenticated" };
    }
    console.error("updateProperty error:", error);
    return { success: false, error: "Failed to update property. Please try again." };
  }
}

export async function togglePublished(
  propertyId: string
): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (!propertyId?.trim()) {
      return { success: false, error: "Invalid property ID" };
    }

    const existing = await db.property.findUnique({
      where: { id: propertyId },
      select: { id: true, published: true },
    });

    if (!existing) {
      return { success: false, error: "Property not found" };
    }

    await db.property.update({
      where: { id: propertyId },
      data: { published: !existing.published },
    });

    revalidatePath("/admin/properties");

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Not authenticated" };
    }
    console.error("togglePublished error:", error);
    return { success: false, error: "Failed to update publish status." };
  }
}

export async function toggleFeatured(
  propertyId: string
): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (!propertyId?.trim()) {
      return { success: false, error: "Invalid property ID" };
    }

    const existing = await db.property.findUnique({
      where: { id: propertyId },
      select: { id: true, featured: true },
    });

    if (!existing) {
      return { success: false, error: "Property not found" };
    }

    await db.property.update({
      where: { id: propertyId },
      data: { featured: !existing.featured },
    });

    revalidatePath("/admin/properties");

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Not authenticated" };
    }
    console.error("toggleFeatured error:", error);
    return { success: false, error: "Failed to update featured status." };
  }
}

export async function deleteProperty(
  propertyId: string
): Promise<ActionResponse> {
  try {
    await requireAdmin();

    if (!propertyId?.trim()) {
      return { success: false, error: "Invalid property ID" };
    }

    const existing = await db.property.findUnique({
      where: { id: propertyId },
      select: { id: true, slug: true },
    });

    if (!existing) {
      return { success: false, error: "Property not found" };
    }

    await db.property.delete({ where: { id: propertyId } });

    revalidatePath("/admin/properties");

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Not authenticated" };
    }
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code: string }).code === "P2003"
    ) {
      return {
        success: false,
        error:
          "Cannot delete this property because it has associated callback requests. Remove the callback history first or contact support.",
      };
    }
    console.error("deleteProperty error:", error);
    return { success: false, error: "Failed to delete property. Please try again." };
  }
}
