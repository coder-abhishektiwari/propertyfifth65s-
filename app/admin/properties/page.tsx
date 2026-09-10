import { Building2, CheckCircle, FileText, Star, Plus } from "lucide-react";
import Link from "next/link";
import { db } from "@/lib/db";
import PropertyTable from "@/components/admin/property-table";

export const metadata = {
  title: "Property Management — Admin — Property Fifth",
};

export default async function AdminPropertiesPage() {
  const [properties, totalCount, publishedCount, draftCount, featuredCount, cities] =
    await Promise.all([
      db.property.findMany({
        orderBy: [{ featured: "desc" }, { updatedAt: "desc" }],
        include: { images: { where: { isCover: true }, take: 1 } },
      }),
      db.property.count(),
      db.property.count({ where: { published: true } }),
      db.property.count({ where: { published: false } }),
      db.property.count({ where: { featured: true } }),
      db.property.findMany({
        where: { published: true },
        select: { city: true },
        distinct: ["city"],
        orderBy: { city: "asc" },
      }),
    ]);

  const stats = [
    {
      icon: Building2,
      value: totalCount,
      label: "Total Properties",
      sub: "All properties in system",
    },
    {
      icon: CheckCircle,
      value: publishedCount,
      label: "Published",
      sub: "Live on website",
    },
    {
      icon: FileText,
      value: draftCount,
      label: "Drafts",
      sub: "Not published yet",
    },
    {
      icon: Star,
      value: featuredCount,
      label: "Featured",
      sub: "Shown in featured section",
    },
  ];

  const tableProperties = properties.map((p) => ({
    id: p.id,
    name: p.name,
    slug: p.slug,
    propertyType: p.propertyType,
    status: p.status,
    featured: p.featured,
    published: p.published,
    locality: p.locality,
    city: p.city,
    configuration: p.configuration,
    priceMin: p.priceMin ? Number(p.priceMin) : null,
    priceLabel: p.priceLabel,
    reraNumber: p.reraNumber,
    updatedAt: p.updatedAt.toISOString(),
    images: p.images.map((img) => ({
      imageUrl: img.imageUrl,
      isCover: img.isCover,
    })),
  }));

  return (
    <div>
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-serif font-bold text-[var(--navy)]">
            Property Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage all your properties, update details and publish or unpublish
            listings.
          </p>
        </div>
        <Link
          href="/admin/properties/new"
          className="inline-flex items-center gap-2 bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors shrink-0"
        >
          <Plus className="w-4 h-4" />
          Add New Property
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-5"
          >
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <span className="text-2xl font-bold text-[var(--navy)]">
                {stat.value}
              </span>
            </div>
            <p className="text-sm font-medium text-gray-700">{stat.label}</p>
            <p className="text-xs text-gray-400 mt-0.5">{stat.sub}</p>
          </div>
        ))}
      </div>

      {/* Property Table */}
      <PropertyTable
        properties={tableProperties}
        totalCount={totalCount}
        uniqueCities={cities.map((c) => c.city)}
      />
    </div>
  );
}
