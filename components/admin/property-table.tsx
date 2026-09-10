"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  Building2,
  MapPin,
  Star,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  MoreVertical,
  X,
  AlertTriangle,
  Filter,
} from "lucide-react";
import {
  togglePublished,
  toggleFeatured,
  deleteProperty,
} from "@/lib/actions/admin-property-actions";

type PropertyRow = {
  id: string;
  name: string;
  slug: string;
  propertyType: string;
  status: string | null;
  featured: boolean;
  published: boolean;
  locality: string;
  city: string;
  configuration: string | null;
  priceMin: number | null;
  priceLabel: string | null;
  reraNumber: string | null;
  updatedAt: string;
  images: { imageUrl: string; isCover: boolean }[];
};

interface PropertyTableProps {
  properties: PropertyRow[];
  totalCount: number;
  uniqueCities: string[];
}

export default function PropertyTable({
  properties,
  totalCount,
  uniqueCities,
}: PropertyTableProps) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [locationFilter, setLocationFilter] = useState("all");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const filtered = useMemo(() => {
    return properties.filter((p) => {
      if (search) {
        const q = search.toLowerCase();
        if (
          !p.name.toLowerCase().includes(q) &&
          !p.locality.toLowerCase().includes(q) &&
          !p.city.toLowerCase().includes(q) &&
          !(p.reraNumber || "").toLowerCase().includes(q)
        )
          return false;
      }
      if (statusFilter === "published" && !p.published) return false;
      if (statusFilter === "draft" && p.published) return false;
      if (statusFilter === "no-status" && p.status !== null) return false;
      if (statusFilter !== "all" && statusFilter !== "published" && statusFilter !== "draft" && statusFilter !== "no-status" && p.status !== statusFilter) return false;
      if (typeFilter !== "all" && p.propertyType !== typeFilter) return false;
      if (locationFilter !== "all" && p.city !== locationFilter) return false;
      return true;
    });
  }, [properties, search, statusFilter, typeFilter, locationFilter]);

  function formatPrice(price: number | null) {
    if (!price) return null;
    if (price >= 10000000) return `₹${(price / 10000000).toFixed(2)} Cr`;
    if (price >= 100000) return `₹${(price / 100000).toFixed(2)} L`;
    return `₹${price.toLocaleString("en-IN")}`;
  }

  function toAdminImage(url: string, slug: string): string {
    const match = url.match(/^\/images\/properties\/([^/]+)\/([^/]+)$/);
    if (match) {
      return `/api/admin/media/images/${encodeURIComponent(slug)}/${encodeURIComponent(match[2])}`;
    }
    return url;
  }

  async function handleTogglePublished(id: string) {
    setActionLoading(id);
    setOpenMenuId(null);
    const result = await togglePublished(id);
    if (result.success) {
      router.refresh();
    }
    setActionLoading(null);
  }

  async function handleToggleFeatured(id: string) {
    setActionLoading(id);
    setOpenMenuId(null);
    const result = await toggleFeatured(id);
    if (result.success) {
      router.refresh();
    }
    setActionLoading(null);
  }

  async function handleDelete() {
    if (!deleteConfirmId) return;
    setDeleting(true);
    const result = await deleteProperty(deleteConfirmId);
    setDeleting(false);
    setDeleteConfirmId(null);
    if (result.success) {
      router.refresh();
    } else {
      alert(result.error || "Failed to delete property");
    }
  }

  const STATUS_LABELS: Record<string, string> = {
    NEW_LAUNCH: "New Launch",
    UNDER_CONSTRUCTION: "Under Construction",
    READY_TO_MOVE: "Ready to Move",
    RESALE: "Resale",
    SOLD_OUT: "Sold Out",
    OTHER: "Other",
  };

  function getStatusLabel(status: string): string {
    return STATUS_LABELS[status] || status;
  }

  return (
    <>
      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search properties..."
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-colors cursor-pointer"
        >
          <option value="all">All Status</option>
          <option value="published">Published</option>
          <option value="draft">Draft</option>
          <option value="no-status">No Status</option>
          <option value="NEW_LAUNCH">New Launch</option>
          <option value="UNDER_CONSTRUCTION">Under Construction</option>
          <option value="READY_TO_MOVE">Ready to Move</option>
          <option value="RESALE">Resale</option>
          <option value="SOLD_OUT">Sold Out</option>
        </select>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-colors cursor-pointer"
        >
          <option value="all">All Type</option>
          <option value="APARTMENT">Apartment</option>
          <option value="VILLA">Villa</option>
          <option value="PENTHOUSE">Penthouse</option>
          <option value="PLOT">Plot</option>
          <option value="COMMERCIAL">Commercial</option>
          <option value="INDEPENDENT_FLOOR">Independent Floor</option>
          <option value="OTHER">Other</option>
        </select>
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-colors cursor-pointer"
        >
          <option value="all">All Locations</option>
          {uniqueCities.map((city) => (
            <option key={city} value={city}>
              {city}
            </option>
          ))}
        </select>
        <button
          onClick={() => {
            setSearch("");
            setStatusFilter("all");
            setTypeFilter("all");
            setLocationFilter("all");
          }}
          className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-gray-600 hover:text-[var(--navy)] border border-gray-200 rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-6">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-gray-700 mb-1">
              {properties.length === 0
                ? "No properties found"
                : "No matching properties"}
            </h3>
            <p className="text-xs text-gray-400 mb-5 max-w-sm mx-auto">
              {properties.length === 0
                ? "Add your first property to start managing your listings."
                : "Try adjusting your search or filter criteria."}
            </p>
            {properties.length === 0 && (
              <Link
                href="/admin/properties/new"
                className="inline-flex items-center gap-2 bg-[var(--navy)] hover:bg-[var(--navy-light)] text-white text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                Add Property
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 bg-gray-50/50">
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Property
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                    Location
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                    Type
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden xl:table-cell">
                    Configuration
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                    Price
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Published
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                    Featured
                  </th>
                  <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-5 py-3">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filtered.map((property) => {
                  const coverImage = property.images.find((img) => img.isCover) || property.images[0];
                  return (
                    <tr
                      key={property.id}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg bg-gray-100 overflow-hidden shrink-0">
                            {coverImage ? (
                              <img
                                src={toAdminImage(coverImage.imageUrl, property.slug)}
                                alt={property.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Building2 className="w-5 h-5 text-gray-300" />
                              </div>
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-[var(--navy)] truncate">
                              {property.name}
                            </p>
                            {property.reraNumber && (
                              <p className="text-xs text-gray-400 truncate">
                                RERA: {property.reraNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-gray-400 mt-0.5 shrink-0" />
                          <span className="text-xs text-gray-600 leading-relaxed">
                            {property.locality}
                            {property.city && `, ${property.city}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-xs text-gray-600">
                          {property.propertyType.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden xl:table-cell">
                        <span className="text-xs text-gray-600">
                          {property.configuration || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        {property.priceMin ? (
                          <div>
                            <span className="text-sm font-bold text-[var(--gold)]">
                              {formatPrice(Number(property.priceMin))}
                            </span>
                            {property.priceLabel && (
                              <span className="text-xs text-gray-400 ml-1">
                                {property.priceLabel}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-gray-400">
                            Price Not Disclosed
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {actionLoading === property.id ? (
                          <span className="text-xs text-gray-400">Updating...</span>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              property.published
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-gray-100 text-gray-600 border border-gray-200"
                            }`}
                          >
                            {property.published ? "Published" : "Draft"}
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        {property.status ? (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              property.status === "NEW_LAUNCH"
                                ? "bg-blue-50 text-blue-700 border border-blue-200"
                                : property.status === "SOLD_OUT"
                                  ? "bg-red-50 text-red-700 border border-red-200"
                                  : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {getStatusLabel(property.status)}
                          </span>
                        ) : (
                          <span className="text-xs text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        {actionLoading === property.id ? null : (
                          <button
                            onClick={() => handleToggleFeatured(property.id)}
                            className="cursor-pointer p-0.5"
                            title={property.featured ? "Remove from featured" : "Mark as featured"}
                          >
                            <Star
                              className={`w-4 h-4 ${
                                property.featured
                                  ? "text-[var(--gold)] fill-[var(--gold)]"
                                  : "text-gray-300 hover:text-[var(--gold)]"
                              } transition-colors`}
                            />
                          </button>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        <div className="relative">
                          <button
                            onClick={() =>
                              setOpenMenuId(
                                openMenuId === property.id ? null : property.id
                              )
                            }
                            className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4 text-gray-500" />
                          </button>

                          {openMenuId === property.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-white border border-gray-200 rounded-xl shadow-lg py-1.5 animate-fade-in">
                                <Link
                                  href={`/admin/properties/${property.id}/edit`}
                                  onClick={() => setOpenMenuId(null)}
                                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  Edit Property
                                </Link>
                                <button
                                  onClick={() => handleTogglePublished(property.id)}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                  {property.published ? (
                                    <>
                                      <EyeOff className="w-3.5 h-3.5" />
                                      Unpublish
                                    </>
                                  ) : (
                                    <>
                                      <Eye className="w-3.5 h-3.5" />
                                      Publish
                                    </>
                                  )}
                                </button>
                                <button
                                  onClick={() => handleToggleFeatured(property.id)}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors cursor-pointer"
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${property.featured ? "fill-[var(--gold)] text-[var(--gold)]" : ""}`}
                                  />
                                  {property.featured ? "Unfeature" : "Mark Featured"}
                                </button>
                                <div className="border-t border-gray-100 my-1.5" />
                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setDeleteConfirmId(property.id);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                  Delete Property
                                </button>
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {filtered.length > 0 && (
          <div className="px-5 py-3 border-t border-gray-200 text-xs text-gray-500">
            Showing {filtered.length} of {totalCount} properties
            {filtered.length !== totalCount && " (filtered)"}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => !deleting && setDeleteConfirmId(null)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in">
            <button
              onClick={() => !deleting && setDeleteConfirmId(null)}
              className="absolute top-4 right-4 p-1 text-gray-400 hover:text-gray-600 cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center shrink-0">
                <AlertTriangle className="w-5 h-5 text-red-500" />
              </div>
              <div>
                <h3 className="text-base font-bold text-gray-900">
                  Delete Property
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to permanently delete this property? All
              associated images will also be removed. If this property has
              callback requests, deletion will be blocked.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete Property"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
