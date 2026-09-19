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
import PropertyPlaceholder from "@/components/property-placeholder";

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
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search properties..."
            className="w-full pl-10 pr-3 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors"
          />
        </div>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors cursor-pointer"
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
          className="px-3 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors cursor-pointer"
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
          className="px-3 py-2.5 text-sm border border-border rounded-lg bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-accent/30 focus:border-accent transition-colors cursor-pointer"
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
          className="inline-flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium text-muted-foreground hover:text-primary border border-border rounded-lg hover:border-border-strong transition-colors cursor-pointer"
        >
          <Filter className="w-3.5 h-3.5" />
          Reset
        </button>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        {filtered.length === 0 ? (
          <div className="text-center py-16 px-6">
            <Building2 className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-sm font-semibold text-foreground mb-1">
              {properties.length === 0
                ? "No properties found"
                : "No matching properties"}
            </h3>
            <p className="text-xs text-muted-foreground mb-5 max-w-sm mx-auto">
              {properties.length === 0
                ? "Add your first property to start managing your listings."
                : "Try adjusting your search or filter criteria."}
            </p>
            {properties.length === 0 && (
              <Link
                href="/admin/properties/new"
                className="inline-flex items-center gap-2 bg-primary hover:bg-navy-light text-inverse text-xs font-semibold px-4 py-2.5 rounded-lg transition-colors"
              >
                Add Property
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                    Property
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden md:table-cell">
                    Location
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                    Type
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden xl:table-cell">
                    Configuration
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                    Price
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
                    Published
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden sm:table-cell">
                    Status
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3 hidden lg:table-cell">
                    Featured
                  </th>
                  <th className="text-left text-xs font-semibold text-muted-foreground uppercase tracking-wider px-5 py-3">
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
                      className="hover:bg-muted/50 transition-colors"
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-14 h-10 rounded-lg bg-secondary overflow-hidden shrink-0 relative">
                            <PropertyPlaceholder className="absolute inset-0" />
                            {coverImage && (
                              <img
                                src={toAdminImage(coverImage.imageUrl, property.slug)}
                                alt={property.name}
                                className="absolute inset-0 w-full h-full object-cover"
                                onError={(e) => { e.currentTarget.style.display = "none"; }}
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-semibold text-primary truncate">
                              {property.name}
                            </p>
                            {property.reraNumber && (
                              <p className="text-xs text-muted-foreground truncate">
                                RERA: {property.reraNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden md:table-cell">
                        <div className="flex items-start gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-muted-foreground mt-0.5 shrink-0" />
                          <span className="text-xs text-muted-foreground leading-relaxed">
                            {property.locality}
                            {property.city && `, ${property.city}`}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4 hidden lg:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {property.propertyType.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden xl:table-cell">
                        <span className="text-xs text-muted-foreground">
                          {property.configuration || "—"}
                        </span>
                      </td>
                      <td className="px-5 py-4 hidden sm:table-cell">
                        {property.priceMin ? (
                          <div>
                            <span className="text-sm font-bold text-accent">
                              {formatPrice(Number(property.priceMin))}
                            </span>
                            {property.priceLabel && (
                              <span className="text-xs text-muted-foreground ml-1">
                                {property.priceLabel}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-xs text-muted-foreground">
                            Price Not Disclosed
                          </span>
                        )}
                      </td>
                      <td className="px-5 py-4">
                        {actionLoading === property.id ? (
                          <span className="text-xs text-muted-foreground">Updating...</span>
                        ) : (
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              property.published
                                ? "bg-success-bg text-success border border-success-border"
                                : "bg-secondary text-muted-foreground border border-border"
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
                                ? "bg-info-bg text-info border border-info-border"
                                : property.status === "SOLD_OUT"
                                  ? "bg-destructive-bg text-destructive border border-destructive-border"
                                  : "bg-warning-bg text-warning border border-warning-border"
                            }`}
                          >
                            {getStatusLabel(property.status)}
                          </span>
                        ) : (
                          <span className="text-xs text-muted-foreground">—</span>
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
                                  ? "text-accent fill-[var(--gold)]"
                                  : "text-muted-foreground hover:text-accent"
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
                            className="p-1.5 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                          >
                            <MoreVertical className="w-4 h-4 text-muted-foreground" />
                          </button>

                          {openMenuId === property.id && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setOpenMenuId(null)}
                              />
                              <div className="absolute right-0 top-full mt-1 z-50 w-48 bg-card border border-border rounded-xl shadow-lg py-1.5 animate-fade-in">
                                <Link
                                  href={`/admin/properties/${property.id}/edit`}
                                  onClick={() => setOpenMenuId(null)}
                                  className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors"
                                >
                                  <Pencil className="w-3.5 h-3.5" />
                                  Edit Property
                                </Link>
                                <button
                                  onClick={() => handleTogglePublished(property.id)}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
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
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                                >
                                  <Star
                                    className={`w-3.5 h-3.5 ${property.featured ? "fill-[var(--gold)] text-accent" : ""}`}
                                  />
                                  {property.featured ? "Unfeature" : "Mark Featured"}
                                </button>
                                <div className="border-t border-border-light my-1.5" />
                                <button
                                  onClick={() => {
                                    setOpenMenuId(null);
                                    setDeleteConfirmId(property.id);
                                  }}
                                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-destructive hover:bg-destructive-bg transition-colors cursor-pointer"
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
          <div className="px-5 py-3 border-t border-border text-xs text-muted-foreground">
            Showing {filtered.length} of {totalCount} properties
            {filtered.length !== totalCount && " (filtered)"}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-scrim"
            onClick={() => !deleting && setDeleteConfirmId(null)}
          />
          <div className="relative bg-card rounded-2xl shadow-xl max-w-md w-full p-6 animate-fade-in ring-1 ring-border/40">
            <button
              onClick={() => !deleting && setDeleteConfirmId(null)}
              className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-destructive-bg flex items-center justify-center shrink-0 ring-1 ring-destructive-border/30">
                <AlertTriangle className="w-5 h-5 text-destructive" />
              </div>
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Delete Property
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  This action cannot be undone.
                </p>
              </div>
            </div>
            <p className="text-sm text-muted-foreground mb-6">
              Are you sure you want to permanently delete this property? All
              associated images will also be removed. If this property has
              callback requests, deletion will be blocked.
            </p>
            <div className="flex items-center gap-3 justify-end">
              <button
                onClick={() => setDeleteConfirmId(null)}
                disabled={deleting}
                className="px-4 py-2 text-sm font-medium text-foreground bg-transparent border border-border hover:bg-secondary rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={deleting}
                className="px-4 py-2 text-sm font-semibold text-inverse bg-destructive hover:bg-destructive/90 active:scale-[0.98] rounded-lg transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
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
