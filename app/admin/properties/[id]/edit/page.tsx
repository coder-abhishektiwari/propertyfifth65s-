import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import PropertyForm from "@/components/admin/property-form";

export const metadata = {
  title: "Edit Property — Admin — Property Fifth",
};

interface EditPropertyPageProps {
  params: Promise<{ id: string }>;
}

function normalizeSpecs(raw: unknown): { label: string; value: string }[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as { label: string; value: string }[];
  if (typeof raw === "object") {
    return Object.entries(raw).map(([label, value]) => ({
      label,
      value: String(value),
    }));
  }
  return [];
}

function normalizeBanks(raw: unknown): { name: string; logo?: string }[] {
  if (!raw) return [];
  if (Array.isArray(raw)) return raw as { name: string; logo?: string }[];
  return [];
}

export default async function EditPropertyPage({ params }: EditPropertyPageProps) {
  const { id } = await params;

  const property = await db.property.findUnique({
    where: { id },
    include: {
      images: {
        orderBy: { sortOrder: "asc" },
      },
    },
  });

  if (!property) {
    notFound();
  }

  const initialData = {
    name: property.name,
    slug: property.slug,
    developerName: property.developerName || undefined,
    propertyType: property.propertyType,
    purpose: property.purpose || undefined,
    status: property.status ?? undefined,
    address: property.address,
    locality: property.locality,
    city: property.city,
    state: property.state || undefined,
    pincode: property.pincode || undefined,
    latitude: property.latitude ? Number(property.latitude) : undefined,
    longitude: property.longitude ? Number(property.longitude) : undefined,
    mapUrl: property.mapUrl || undefined,
    priceMin: property.priceMin ? Number(property.priceMin) : undefined,
    priceMax: property.priceMax ? Number(property.priceMax) : undefined,
    priceLabel: property.priceLabel || undefined,
    configuration: property.configuration || undefined,
    areaMin: property.areaMin ? Number(property.areaMin) : undefined,
    areaMax: property.areaMax ? Number(property.areaMax) : undefined,
    areaUnit: property.areaUnit || undefined,
    possession: property.possession || undefined,
    totalTowers: property.totalTowers || undefined,
    totalUnits: property.totalUnits || undefined,
    totalArea: property.totalArea || undefined,
    reraNumber: property.reraNumber || undefined,
    legalNote: property.legalNote || undefined,
    shortDescription: property.shortDescription || undefined,
    description: property.description || undefined,
    highlights: (property.highlights as string[]) || [],
    amenities: (property.amenities as string[]) || [],
    specifications: normalizeSpecs(property.specifications),
    bankApproved: normalizeBanks(property.bankApproved),
    videoUrl: property.videoUrl || undefined,
    published: property.published,
    featured: property.featured,
  };

  const initialImages = property.images.map((img) => ({
    id: img.id,
    imageUrl: img.imageUrl,
    sortOrder: img.sortOrder,
    isCover: img.isCover,
  }));

  const initialBrochure = property.brochureUrl
    ? {
        url: property.brochureUrl,
        name: property.brochureName || "brochure.pdf",
        size: property.brochureSize || "Unknown",
      }
    : null;

  return (
    <PropertyForm
      mode="edit"
      propertyId={property.id}
      initialData={initialData}
      initialImages={initialImages}
      initialBrochure={initialBrochure}
      propertySlug={property.slug}
    />
  );
}
