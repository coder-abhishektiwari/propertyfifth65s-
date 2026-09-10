"use client";

import { useState, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Save,
  Upload,
  X,
  Star,
  GripVertical,
  ChevronDown,
  ChevronUp,
  FileText,
  Trash2,
  ImageIcon,
  Eye,
} from "lucide-react";
import {
  createProperty,
  updateProperty,
  type PropertyFormData,
  type ActionResponse,
} from "@/lib/actions/admin-property-actions";

const PROPERTY_TYPES = [
  { value: "APARTMENT", label: "Apartment" },
  { value: "VILLA", label: "Villa" },
  { value: "PENTHOUSE", label: "Penthouse" },
  { value: "PLOT", label: "Plot" },
  { value: "COMMERCIAL", label: "Commercial" },
  { value: "INDEPENDENT_FLOOR", label: "Independent Floor" },
  { value: "OTHER", label: "Other" },
];

const PURPOSES = [
  { value: "END_USE", label: "End Use" },
  { value: "INVESTMENT", label: "Investment" },
  { value: "BOTH", label: "End Use & Investment" },
];

const STATUSES = [
  { value: "NEW_LAUNCH", label: "New Launch" },
  { value: "UNDER_CONSTRUCTION", label: "Under Construction" },
  { value: "READY_TO_MOVE", label: "Ready to Move" },
  { value: "RESALE", label: "Resale" },
  { value: "SOLD_OUT", label: "Sold Out" },
  { value: "OTHER", label: "Other" },
];

type ImageRecord = {
  id: string;
  imageUrl: string;
  sortOrder: number;
  isCover: boolean;
};

type BrochureRecord = {
  url: string;
  name: string;
  size: string;
} | null;

interface PropertyFormProps {
  mode: "create" | "edit";
  propertyId?: string;
  initialData?: Partial<PropertyFormData>;
  initialImages?: ImageRecord[];
  initialBrochure?: BrochureRecord;
  propertySlug?: string;
}

function toAdminImage(url: string, slug?: string): string {
  if (!slug) return url;
  const match = url.match(/^\/images\/properties\/([^/]+)\/([^/]+)$/);
  if (match) {
    return `/api/admin/media/images/${encodeURIComponent(slug)}/${encodeURIComponent(match[2])}`;
  }
  return url;
}

export default function PropertyForm({
  mode,
  propertyId,
  initialData,
  initialImages = [],
  initialBrochure = null,
  propertySlug,
}: PropertyFormProps) {
  const router = useRouter();
  const imageInputRef = useRef<HTMLInputElement>(null);
  const brochureInputRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<PropertyFormData>({
    name: initialData?.name || "",
    slug: initialData?.slug || "",
    developerName: initialData?.developerName || "",
    propertyType: initialData?.propertyType || "APARTMENT",
    purpose: initialData?.purpose || undefined,
    status: initialData?.status || undefined,
    address: initialData?.address || "",
    locality: initialData?.locality || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    pincode: initialData?.pincode || "",
    latitude: initialData?.latitude || undefined,
    longitude: initialData?.longitude || undefined,
    mapUrl: initialData?.mapUrl || "",
    priceMin: initialData?.priceMin || undefined,
    priceMax: initialData?.priceMax || undefined,
    priceLabel: initialData?.priceLabel || "",
    configuration: initialData?.configuration || "",
    areaMin: initialData?.areaMin || undefined,
    areaMax: initialData?.areaMax || undefined,
    areaUnit: initialData?.areaUnit || "",
    possession: initialData?.possession || "",
    totalTowers: initialData?.totalTowers || undefined,
    totalUnits: initialData?.totalUnits || undefined,
    totalArea: initialData?.totalArea || "",
    reraNumber: initialData?.reraNumber || "",
    legalNote: initialData?.legalNote || "",
    shortDescription: initialData?.shortDescription || "",
    description: initialData?.description || "",
    highlights: initialData?.highlights || [],
    amenities: initialData?.amenities || [],
    specifications: initialData?.specifications || [],
    bankApproved: initialData?.bankApproved || [],
    videoUrl: initialData?.videoUrl || "",
    published: initialData?.published !== false,
    featured: initialData?.featured || false,
  });

  const [images, setImages] = useState<ImageRecord[]>(initialImages);
  const [brochure, setBrochure] = useState<BrochureRecord>(initialBrochure);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadingBrochure, setUploadingBrochure] = useState(false);
  const [sections, setSections] = useState<Record<string, boolean>>({
    basic: true,
    location: true,
    pricing: false,
    details: false,
    descriptions: false,
    media: true,
  });

  const toggleSection = (key: string) =>
    setSections((prev) => ({ ...prev, [key]: !prev[key] }));

  const setField = useCallback(
    <K extends keyof PropertyFormData>(key: K, value: PropertyFormData[K]) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setError(null);
    },
    []
  );

  const handleSubmit = async (e: React.FormEvent, publishImmediately = false) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(null);

    try {
      const submitData = {
        ...form,
        published: publishImmediately ? true : form.published,
      };

      let result: ActionResponse;
      if (mode === "create") {
        result = await createProperty(submitData);
      } else {
        result = await updateProperty(propertyId!, submitData);
      }

      if (!result.success) {
        setError(result.error || "Something went wrong");
        return;
      }

      setSuccess(mode === "create" ? "Property created successfully!" : "Property updated successfully!");

      if (mode === "create" && result.propertyId) {
        setTimeout(() => {
          router.push(`/admin/properties/${result.propertyId}/edit`);
        }, 1000);
      }
    } catch {
      setError("An unexpected error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleImageUpload = async (files: FileList | null) => {
    if (!files || !propertyId) return;
    setUploadingImage(true);
    setError(null);

    try {
      for (const file of Array.from(files)) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("propertyId", propertyId);
        formData.append("type", "image");

        const res = await fetch("/api/admin/media", { method: "POST", body: formData });
        const data = await res.json();

        if (!res.ok) {
          setError(data.error || "Image upload failed");
          return;
        }

        setImages((prev) => [...prev, data.image]);
      }
    } catch {
      setError("Image upload failed");
    } finally {
      setUploadingImage(false);
      if (imageInputRef.current) imageInputRef.current.value = "";
    }
  };

  const handleBrochureUpload = async (files: FileList | null) => {
    if (!files || !propertyId || files.length === 0) return;
    setUploadingBrochure(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", files[0]);
      formData.append("propertyId", propertyId);
      formData.append("type", "brochure");

      const res = await fetch("/api/admin/media", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Brochure upload failed");
        return;
      }

      setBrochure(data.brochure);
    } catch {
      setError("Brochure upload failed");
    } finally {
      setUploadingBrochure(false);
      if (brochureInputRef.current) brochureInputRef.current.value = "";
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!propertyId) return;
    try {
      const res = await fetch("/api/admin/media/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, propertyId, type: "image" }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Failed to delete image");
        return;
      }
      setImages((prev) => {
        const deleted = prev.find((img) => img.id === imageId);
        const remaining = prev.filter((img) => img.id !== imageId);
        if (deleted?.isCover && remaining.length > 0) {
          remaining[0] = { ...remaining[0], isCover: true };
        }
        return remaining;
      });
    } catch {
      setError("Failed to delete image");
    }
  };

  const handleSetCover = async (imageId: string) => {
    if (!propertyId) return;
    try {
      const res = await fetch("/api/admin/media", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ imageId, propertyId, type: "set-cover" }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to set cover");
        return;
      }
      setImages((prev) =>
        prev.map((img) => ({ ...img, isCover: img.id === imageId }))
      );
    } catch {
      setError("Failed to set cover");
    }
  };

  const handleReorderImage = (index: number, direction: "up" | "down") => {
    setImages((prev) => {
      const newImages = [...prev];
      const targetIndex = direction === "up" ? index - 1 : index + 1;
      if (targetIndex < 0 || targetIndex >= newImages.length) return prev;
      [newImages[index], newImages[targetIndex]] = [newImages[targetIndex], newImages[index]];
      return newImages.map((img, i) => ({ ...img, sortOrder: i }));
    });
  };

  const handleDeleteBrochure = async () => {
    if (!propertyId) return;
    try {
      const res = await fetch("/api/admin/media/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId, type: "brochure" }),
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Failed to delete brochure");
        return;
      }
      setBrochure(null);
    } catch {
      setError("Failed to delete brochure");
    }
  };

  const addHighlight = () => setForm((p) => ({ ...p, highlights: [...(p.highlights || []), ""] }));
  const updateHighlight = (i: number, v: string) =>
    setForm((p) => ({ ...p, highlights: (p.highlights || []).map((h, idx) => (idx === i ? v : h)) }));
  const removeHighlight = (i: number) =>
    setForm((p) => ({ ...p, highlights: (p.highlights || []).filter((_, idx) => idx !== i) }));

  const addAmenity = () => setForm((p) => ({ ...p, amenities: [...(p.amenities || []), ""] }));
  const updateAmenity = (i: number, v: string) =>
    setForm((p) => ({ ...p, amenities: (p.amenities || []).map((a, idx) => (idx === i ? v : a)) }));
  const removeAmenity = (i: number) =>
    setForm((p) => ({ ...p, amenities: (p.amenities || []).filter((_, idx) => idx !== i) }));

  const addSpec = () =>
    setForm((p) => ({ ...p, specifications: [...(p.specifications || []), { label: "", value: "" }] }));
  const updateSpec = (i: number, field: "label" | "value", v: string) =>
    setForm((p) => ({
      ...p,
      specifications: (p.specifications || []).map((s, idx) => (idx === i ? { ...s, [field]: v } : s)),
    }));
  const removeSpec = (i: number) =>
    setForm((p) => ({ ...p, specifications: (p.specifications || []).filter((_, idx) => idx !== i) }));

  const addBank = () =>
    setForm((p) => ({ ...p, bankApproved: [...(p.bankApproved || []), { name: "", logo: "" }] }));
  const updateBank = (i: number, field: "name" | "logo", v: string) =>
    setForm((p) => ({
      ...p,
      bankApproved: (p.bankApproved || []).map((b, idx) => (idx === i ? { ...b, [field]: v } : b)),
    }));
  const removeBank = (i: number) =>
    setForm((p) => ({ ...p, bankApproved: (p.bankApproved || []).filter((_, idx) => idx !== i) }));

  const inputClass =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-colors";
  const selectClass =
    "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-colors appearance-none cursor-pointer";
  const labelClass = "block text-xs font-semibold text-gray-700 mb-1.5";
  const hintClass = "text-xs text-gray-400 mt-0.5";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Top bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => router.push("/admin/properties")}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 text-gray-600" />
          </button>
          <div>
            <h1 className="text-xl font-serif font-bold text-[var(--navy)]">
              {mode === "create" ? "Add New Property" : "Edit Property"}
            </h1>
            <p className="text-xs text-gray-500 mt-0.5">
              {mode === "create"
                ? "Fill in the details to create a new property listing"
                : `Editing: ${initialData?.name || "Property"}`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {mode === "edit" && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setField("published", !form.published)}
                className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-lg transition-colors cursor-pointer ${
                  form.published
                    ? "bg-green-50 text-green-700 border border-green-200 hover:bg-green-100"
                    : "bg-gray-50 text-gray-600 border border-gray-200 hover:bg-gray-100"
                }`}
              >
                {form.published ? "Published" : "Draft"}
              </button>
              <button
                type="button"
                onClick={() => setField("featured", !form.featured)}
                className={`p-2 rounded-lg transition-colors cursor-pointer ${
                  form.featured
                    ? "bg-[var(--gold)]/10 text-[var(--gold)]"
                    : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                }`}
              >
                <Star
                  className={`w-4 h-4 ${form.featured ? "fill-[var(--gold)]" : ""}`}
                />
              </button>
            </div>
          )}
          {mode === "create" ? (
            <div className="flex items-center gap-2">
              <button
                type="button"
                disabled={submitting}
                onClick={(e) => handleSubmit(e, false)}
                className="inline-flex items-center gap-2 border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0 disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                Save as Draft
              </button>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 bg-[var(--navy)] hover:bg-[var(--navy-light)] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
              >
                <Eye className="w-4 h-4" />
                {submitting ? "Publishing..." : "Publish"}
              </button>
            </div>
          ) : (
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-[var(--navy)] hover:bg-[var(--navy-light)] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition-colors cursor-pointer shrink-0"
            >
              <Save className="w-4 h-4" />
              {submitting ? "Saving..." : "Save Changes"}
            </button>
          )}
        </div>
      </div>

      {/* Messages */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg">
          {success}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <button type="button" onClick={() => toggleSection("basic")} className="w-full flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer">
              <h3 className="text-sm font-bold text-[var(--navy)]">Basic Information</h3>
              {sections.basic ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {sections.basic && (
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className={labelClass}>Property Name *</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. ASCENT GRANDIS"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>URL Slug</label>
                    <input
                      type="text"
                      value={form.slug || ""}
                      onChange={(e) => setField("slug", e.target.value)}
                      className={inputClass}
                      placeholder="auto-generated from name"
                    />
                    <p className={hintClass}>Leave empty to auto-generate</p>
                  </div>
                  <div>
                    <label className={labelClass}>Developer Name</label>
                    <input
                      type="text"
                      value={form.developerName || ""}
                      onChange={(e) => setField("developerName", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Vaneet Infra"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Property Type *</label>
                    <select
                      value={form.propertyType}
                      onChange={(e) => setField("propertyType", e.target.value as PropertyFormData["propertyType"])}
                      className={selectClass}
                    >
                      {PROPERTY_TYPES.map((t) => (
                        <option key={t.value} value={t.value}>
                          {t.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Purpose</label>
                    <select
                      value={form.purpose || ""}
                      onChange={(e) =>
                        setField("purpose", (e.target.value || undefined) as PropertyFormData["purpose"])
                      }
                      className={selectClass}
                    >
                      <option value="">Select purpose</option>
                      {PURPOSES.map((p) => (
                        <option key={p.value} value={p.value}>
                          {p.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className={labelClass}>Status</label>
                    <select
                      value={form.status || ""}
                      onChange={(e) => setField("status", (e.target.value || undefined) as PropertyFormData["status"])}
                      className={selectClass}
                    >
                      <option value="">No Status</option>
                      {STATUSES.map((s) => (
                        <option key={s.value} value={s.value}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelClass}>RERA Number</label>
                  <input
                    type="text"
                    value={form.reraNumber || ""}
                    onChange={(e) => setField("reraNumber", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. RC/REP/HARERA/GGM/XXX/XX/XX"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Location */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <button type="button" onClick={() => toggleSection("location")} className="w-full flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer">
              <h3 className="text-sm font-bold text-[var(--navy)]">Location</h3>
              {sections.location ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {sections.location && (
              <div className="pt-4 space-y-4">
                <div>
                  <label className={labelClass}>Full Address *</label>
                  <input
                    type="text"
                    value={form.address}
                    onChange={(e) => setField("address", e.target.value)}
                    className={inputClass}
                    placeholder="e.g. Sector 66, Golf Course Extension Road"
                    required
                  />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Locality / Sector *</label>
                    <input
                      type="text"
                      value={form.locality}
                      onChange={(e) => setField("locality", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Sector 66"
                      required
                    />
                  </div>
                  <div>
                    <label className={labelClass}>City *</label>
                    <input
                      type="text"
                      value={form.city}
                      onChange={(e) => setField("city", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Gurugram"
                      required
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>State</label>
                    <input
                      type="text"
                      value={form.state || ""}
                      onChange={(e) => setField("state", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Haryana"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Pincode</label>
                    <input
                      type="text"
                      value={form.pincode || ""}
                      onChange={(e) => setField("pincode", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 122002"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Map URL</label>
                    <input
                      type="url"
                      value={form.mapUrl || ""}
                      onChange={(e) => setField("mapUrl", e.target.value)}
                      className={inputClass}
                      placeholder="Google Maps link"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Latitude</label>
                    <input
                      type="number"
                      step="any"
                      value={form.latitude || ""}
                      onChange={(e) => setField("latitude", e.target.value ? Number(e.target.value) : undefined)}
                      className={inputClass}
                      placeholder="28.4595"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Longitude</label>
                    <input
                      type="number"
                      step="any"
                      value={form.longitude || ""}
                      onChange={(e) => setField("longitude", e.target.value ? Number(e.target.value) : undefined)}
                      className={inputClass}
                      placeholder="77.0266"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Pricing */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <button type="button" onClick={() => toggleSection("pricing")} className="w-full flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer">
              <h3 className="text-sm font-bold text-[var(--navy)]">Pricing</h3>
              {sections.pricing ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {sections.pricing && (
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className={labelClass}>Starting Price (₹)</label>
                    <input
                      type="number"
                      step="any"
                      value={form.priceMin || ""}
                      onChange={(e) => setField("priceMin", e.target.value ? Number(e.target.value) : undefined)}
                      className={inputClass}
                      placeholder="e.g. 35000000"
                    />
                    <p className={hintClass}>Enter amount in rupees</p>
                  </div>
                  <div>
                    <label className={labelClass}>Max Price (₹)</label>
                    <input
                      type="number"
                      step="any"
                      value={form.priceMax || ""}
                      onChange={(e) => setField("priceMax", e.target.value ? Number(e.target.value) : undefined)}
                      className={inputClass}
                      placeholder="e.g. 67500000"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Price Label</label>
                    <input
                      type="text"
                      value={form.priceLabel || ""}
                      onChange={(e) => setField("priceLabel", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. Onwards"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Property Details */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <button type="button" onClick={() => toggleSection("details")} className="w-full flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer">
              <h3 className="text-sm font-bold text-[var(--navy)]">Property Details</h3>
              {sections.details ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {sections.details && (
              <div className="pt-4 space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Configuration</label>
                    <input
                      type="text"
                      value={form.configuration || ""}
                      onChange={(e) => setField("configuration", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 3, 4 & 5 BHK"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Possession</label>
                    <input
                      type="text"
                      value={form.possession || ""}
                      onChange={(e) => setField("possession", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. December 2028"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                  <div>
                    <label className={labelClass}>Min Area</label>
                    <input
                      type="number"
                      step="any"
                      value={form.areaMin || ""}
                      onChange={(e) => setField("areaMin", e.target.value ? Number(e.target.value) : undefined)}
                      className={inputClass}
                      placeholder="e.g. 1800"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Max Area</label>
                    <input
                      type="number"
                      step="any"
                      value={form.areaMax || ""}
                      onChange={(e) => setField("areaMax", e.target.value ? Number(e.target.value) : undefined)}
                      className={inputClass}
                      placeholder="e.g. 3500"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Area Unit</label>
                    <input
                      type="text"
                      value={form.areaUnit || ""}
                      onChange={(e) => setField("areaUnit", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. sq.ft."
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Total Area</label>
                    <input
                      type="text"
                      value={form.totalArea || ""}
                      onChange={(e) => setField("totalArea", e.target.value)}
                      className={inputClass}
                      placeholder="e.g. 15 Acres"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Total Towers</label>
                    <input
                      type="number"
                      value={form.totalTowers || ""}
                      onChange={(e) => setField("totalTowers", e.target.value ? Number(e.target.value) : undefined)}
                      className={inputClass}
                      placeholder="e.g. 8"
                    />
                  </div>
                  <div>
                    <label className={labelClass}>Total Units</label>
                    <input
                      type="number"
                      value={form.totalUnits || ""}
                      onChange={(e) => setField("totalUnits", e.target.value ? Number(e.target.value) : undefined)}
                      className={inputClass}
                      placeholder="e.g. 400"
                    />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Video URL</label>
                  <input
                    type="url"
                    value={form.videoUrl || ""}
                    onChange={(e) => setField("videoUrl", e.target.value)}
                    className={inputClass}
                    placeholder="YouTube or Vimeo video link"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Descriptions & Content */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <button type="button" onClick={() => toggleSection("descriptions")} className="w-full flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer">
              <h3 className="text-sm font-bold text-[var(--navy)]">Descriptions & Content</h3>
              {sections.descriptions ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {sections.descriptions && (
              <div className="pt-4 space-y-4">
                <div>
                  <label className={labelClass}>Short Description</label>
                  <textarea
                    value={form.shortDescription || ""}
                    onChange={(e) => setField("shortDescription", e.target.value)}
                    className={inputClass}
                    rows={2}
                    placeholder="Brief one-liner for listings"
                  />
                </div>
                <div>
                  <label className={labelClass}>Full Description</label>
                  <textarea
                    value={form.description || ""}
                    onChange={(e) => setField("description", e.target.value)}
                    className={inputClass}
                    rows={5}
                    placeholder="Detailed property overview"
                  />
                </div>
                <div>
                  <label className={labelClass}>Legal Note</label>
                  <textarea
                    value={form.legalNote || ""}
                    onChange={(e) => setField("legalNote", e.target.value)}
                    className={inputClass}
                    rows={2}
                    placeholder="Optional legal/compliance note"
                  />
                </div>

                {/* Highlights */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass}>Highlights</label>
                    <button
                      type="button"
                      onClick={addHighlight}
                      className="text-xs font-medium text-[var(--gold)] hover:text-[var(--gold-dark)] cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                  {(form.highlights || []).length === 0 && (
                    <p className="text-xs text-gray-400 mb-2">No highlights added</p>
                  )}
                  <div className="space-y-2">
                    {(form.highlights || []).map((h, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={h}
                          onChange={(e) => updateHighlight(i, e.target.value)}
                          className={inputClass}
                          placeholder="e.g. 75% Open Green Space"
                        />
                        <button
                          type="button"
                          onClick={() => removeHighlight(i)}
                          className="p-1.5 text-gray-400 hover:text-red-500 cursor-pointer shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Amenities */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass}>Amenities</label>
                    <button
                      type="button"
                      onClick={addAmenity}
                      className="text-xs font-medium text-[var(--gold)] hover:text-[var(--gold-dark)] cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                  {(form.amenities || []).length === 0 && (
                    <p className="text-xs text-gray-400 mb-2">No amenities added</p>
                  )}
                  <div className="space-y-2">
                    {(form.amenities || []).map((a, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={a}
                          onChange={(e) => updateAmenity(i, e.target.value)}
                          className={inputClass}
                          placeholder="e.g. Swimming Pool"
                        />
                        <button
                          type="button"
                          onClick={() => removeAmenity(i)}
                          className="p-1.5 text-gray-400 hover:text-red-500 cursor-pointer shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Specifications */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass}>Specifications</label>
                    <button
                      type="button"
                      onClick={addSpec}
                      className="text-xs font-medium text-[var(--gold)] hover:text-[var(--gold-dark)] cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                  {(form.specifications || []).length === 0 && (
                    <p className="text-xs text-gray-400 mb-2">No specifications added</p>
                  )}
                  <div className="space-y-2">
                    {(form.specifications || []).map((s, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={s.label}
                          onChange={(e) => updateSpec(i, "label", e.target.value)}
                          className={inputClass}
                          placeholder="Label (e.g. Flooring)"
                        />
                        <input
                          type="text"
                          value={s.value}
                          onChange={(e) => updateSpec(i, "value", e.target.value)}
                          className={inputClass}
                          placeholder="Value (e.g. Premium Vitrified Tiles)"
                        />
                        <button
                          type="button"
                          onClick={() => removeSpec(i)}
                          className="p-1.5 text-gray-400 hover:text-red-500 cursor-pointer shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bank Approved */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className={labelClass}>Bank Approved</label>
                    <button
                      type="button"
                      onClick={addBank}
                      className="text-xs font-medium text-[var(--gold)] hover:text-[var(--gold-dark)] cursor-pointer"
                    >
                      + Add
                    </button>
                  </div>
                  {(form.bankApproved || []).length === 0 && (
                    <p className="text-xs text-gray-400 mb-2">No banks added</p>
                  )}
                  <div className="space-y-2">
                    {(form.bankApproved || []).map((b, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={b.name}
                          onChange={(e) => updateBank(i, "name", e.target.value)}
                          className={inputClass}
                          placeholder="Bank name (e.g. HDFC Bank)"
                        />
                        <input
                          type="text"
                          value={b.logo || ""}
                          onChange={(e) => updateBank(i, "logo", e.target.value)}
                          className={inputClass}
                          placeholder="Logo URL (optional)"
                        />
                        <button
                          type="button"
                          onClick={() => removeBank(i)}
                          className="p-1.5 text-gray-400 hover:text-red-500 cursor-pointer shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Media */}
        <div className="space-y-6">
          {/* Images */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <button type="button" onClick={() => toggleSection("media")} className="w-full flex items-center justify-between py-3 border-b border-gray-100 cursor-pointer">
              <h3 className="text-sm font-bold text-[var(--navy)]">Property Images</h3>
              {sections.media ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
            </button>
            {sections.media && (
              <div className="pt-4 space-y-4">
                <input
                  ref={imageInputRef}
                  type="file"
                  accept=".jpg,.jpeg,.png,.webp"
                  multiple
                  className="hidden"
                  onChange={(e) => handleImageUpload(e.target.files)}
                />
                <button
                  type="button"
                  onClick={() => imageInputRef.current?.click()}
                  disabled={uploadingImage || !propertyId}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg py-6 text-sm text-gray-500 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingImage ? "Uploading..." : "Upload Images"}
                </button>
                <p className="text-xs text-gray-400">
                  JPG, PNG, WebP. Max 10MB each.
                </p>

                {!propertyId && mode === "create" && (
                  <p className="text-xs text-amber-600 bg-amber-50 border border-amber-200 px-3 py-2 rounded-lg">
                    Save the property first to upload images.
                  </p>
                )}

                <div className="space-y-3">
                  {images.map((img, index) => (
                    <div
                      key={img.id}
                      className={`relative flex items-center gap-3 p-2 rounded-lg border ${
                        img.isCover
                          ? "border-[var(--gold)] bg-[var(--gold)]/5"
                          : "border-gray-100"
                      }`}
                    >
                      <div className="w-16 h-12 rounded bg-gray-100 overflow-hidden shrink-0">
                        <img
                          src={toAdminImage(img.imageUrl, propertySlug)}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-gray-600 truncate">
                          {img.imageUrl.split("/").pop()}
                        </p>
                        {img.isCover && (
                          <span className="text-[0.65rem] font-semibold text-[var(--gold)]">
                            Cover Image
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleReorderImage(index, "up")}
                          disabled={index === 0}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"
                        >
                          <GripVertical className="w-3.5 h-3.5 rotate-180" />
                        </button>
                        <button
                          type="button"
                          onClick={() => handleReorderImage(index, "down")}
                          disabled={index === images.length - 1}
                          className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-30 cursor-pointer"
                        >
                          <GripVertical className="w-3.5 h-3.5" />
                        </button>
                        {!img.isCover && (
                          <button
                            type="button"
                            onClick={() => handleSetCover(img.id)}
                            className="p-1 text-gray-400 hover:text-[var(--gold)] cursor-pointer"
                            title="Set as cover"
                          >
                            <Star className="w-3.5 h-3.5" />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => handleDeleteImage(img.id)}
                          className="p-1 text-gray-400 hover:text-red-500 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {images.length === 0 && propertyId && (
                  <div className="text-center py-6">
                    <ImageIcon className="w-8 h-8 text-gray-200 mx-auto mb-2" />
                    <p className="text-xs text-gray-400">No images uploaded yet</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Brochure */}
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h3 className="text-sm font-bold text-[var(--navy)] pb-3 border-b border-gray-100">
              Property Brochure
            </h3>
            <div className="pt-4 space-y-3">
              <input
                ref={brochureInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={(e) => handleBrochureUpload(e.target.files)}
              />

              {brochure ? (
                <div className="flex items-center gap-3 p-3 rounded-lg border border-gray-100 bg-gray-50/50">
                  <FileText className="w-8 h-8 text-red-400 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-700 truncate">
                      {brochure.name}
                    </p>
                    <p className="text-[0.65rem] text-gray-400">{brochure.size}</p>
                  </div>
                  <button
                    type="button"
                    onClick={handleDeleteBrochure}
                    className="p-1.5 text-gray-400 hover:text-red-500 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => brochureInputRef.current?.click()}
                  disabled={uploadingBrochure || !propertyId}
                  className="w-full flex items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-lg py-6 text-sm text-gray-500 hover:border-[var(--gold)] hover:text-[var(--gold)] transition-colors cursor-pointer disabled:opacity-50"
                >
                  <Upload className="w-4 h-4" />
                  {uploadingBrochure ? "Uploading..." : "Upload Brochure PDF"}
                </button>
              )}
              <p className="text-xs text-gray-400">
                PDF only. Max 25MB.
              </p>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
