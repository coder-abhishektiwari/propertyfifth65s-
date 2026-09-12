"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Bookmark, MapPin, ArrowRight, Trash2, MessageCircle, Phone, Shield, Share2, Link2, X, Check } from "lucide-react";
import PropertyPlaceholder from "@/components/property-placeholder";
import { toMediaImageUrl, formatPrice } from "@/lib/property-utils";

interface SavedProperty {
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
  savedAt: string;
}

export default function SavedPropertiesClient() {
  const [properties, setProperties] = useState<SavedProperty[]>([]);
  const [loading, setLoading] = useState(true);
  const [removing, setRemoving] = useState<string | null>(null);
  const [showShare, setShowShare] = useState(false);
  const [shareLink, setShareLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [customerName, setCustomerName] = useState<string | null>(null);

  useEffect(() => {
    fetchSaved();
  }, []);

  async function fetchSaved() {
    try {
      const res = await fetch("/api/customer/saved-properties");
      const data = await res.json();
      setProperties(data.properties || []);
      setCustomerName(data.customerName || null);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  }

  function generateShareLink() {
    const data = btoa(JSON.stringify({
      ids: properties.map((p) => p.id),
      name: customerName || "Someone",
    }));
    const link = `${window.location.origin}/shared-list?data=${data}`;
    setShareLink(link);
    setCopied(false);
  }

  function copyShareLink() {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  async function handleRemove(propertyId: string) {
    if (removing) return;
    setRemoving(propertyId);
    try {
      await fetch(`/api/customer/save-property?propertyId=${propertyId}`, { method: "DELETE" });
      setProperties((prev) => prev.filter((p) => p.id !== propertyId));
    } catch {
      // ignore
    } finally {
      setRemoving(null);
    }
  }

  if (loading) {
    return (
      <div className="container-site py-16">
        <div className="flex items-center justify-center py-20">
          <div className="w-8 h-8 border-2 border-[var(--gold)]/30 border-t-[var(--gold)] rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <section className="bg-[var(--bg-muted)] border-b border-[var(--border)] mt-16 lg:mt-18">
        <div className="container-site py-8 lg:py-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h1 className="font-serif text-3xl lg:text-4xl font-bold text-[var(--text)]">
                Saved Properties
              </h1>
              <div className="w-12 h-0.5 bg-[var(--gold)] mt-3 mb-3" />
              <p className="text-sm text-[var(--text-muted)] max-w-md">
                Your personally saved properties. Review and connect with our experts whenever you&apos;re ready.
              </p>
            </div>
            <div className="flex items-center gap-3 bg-white border border-[var(--border)] rounded-lg px-5 py-3">
              <Bookmark className="w-5 h-5 text-[var(--gold)]" />
              <div>
                <p className="text-2xl font-bold text-[var(--navy)]">{String(properties.length).padStart(2, "0")}</p>
                <p className="text-[0.65rem] text-[var(--text-muted)]">Properties Saved</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="bg-[var(--bg)] py-8 lg:py-10">
        <div className="container-site">
          {properties.length === 0 ? (
            <div className="text-center py-16">
              <Bookmark className="w-14 h-14 text-[var(--border)] mx-auto mb-4" />
              <h3 className="text-lg font-bold text-[var(--text)] mb-2">No saved properties yet</h3>
              <p className="text-sm text-[var(--text-muted)] mb-6 max-w-sm mx-auto">
                Browse properties and save the ones you like. They&apos;ll appear here for easy access.
              </p>
              <Link href="/properties" className="btn-primary inline-flex items-center gap-1.5">
                Browse Properties
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Sidebar */}
              <div className="lg:w-[280px] shrink-0">
                <div className="sticky top-24 space-y-4">
                  {/* Quick Actions */}
                  <div className="bg-white border border-[var(--border)] rounded-lg p-5">
                    <h3 className="text-sm font-bold text-[var(--text)] mb-4">Quick Actions</h3>
                    <div className="space-y-3">
                      <Link
                        href="/consultation"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-muted)] transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-full bg-[var(--gold)]/10 flex items-center justify-center shrink-0">
                          <MessageCircle className="w-4 h-4 text-[var(--gold)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[var(--text)]">Book a Consultation</p>
                          <p className="text-[0.65rem] text-[var(--text-muted)]">Get expert guidance for your saved properties.</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--gold)] shrink-0" />
                      </Link>
                      <Link
                        href="/contact"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-muted)] transition-colors group"
                      >
                        <div className="w-9 h-9 rounded-full bg-[var(--gold)]/10 flex items-center justify-center shrink-0">
                          <Phone className="w-4 h-4 text-[var(--gold)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[var(--text)]">Talk to an Expert</p>
                          <p className="text-[0.65rem] text-[var(--text-muted)]">Speak with our relationship manager.</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--gold)] shrink-0" />
                      </Link>
                      <button
                        onClick={() => { setShowShare(true); generateShareLink(); }}
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-[var(--bg-muted)] transition-colors group w-full text-left cursor-pointer"
                      >
                        <div className="w-9 h-9 rounded-full bg-[var(--gold)]/10 flex items-center justify-center shrink-0">
                          <Share2 className="w-4 h-4 text-[var(--gold)]" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-[var(--text)]">Share Your List</p>
                          <p className="text-[0.65rem] text-[var(--text-muted)]">Share your saved properties with family or advisors.</p>
                        </div>
                        <ArrowRight className="w-3.5 h-3.5 text-[var(--text-muted)] group-hover:text-[var(--gold)] shrink-0" />
                      </button>
                    </div>
                  </div>

                  {/* Privacy Note */}
                  <div className="bg-white border border-[var(--border)] rounded-lg p-5">
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-full bg-[var(--gold)]/10 flex items-center justify-center shrink-0 mt-0.5">
                        <Shield className="w-4 h-4 text-[var(--gold)]" />
                      </div>
                      <div>
                        <p className="text-xs font-bold text-[var(--text)] mb-1">Secure & Private</p>
                        <p className="text-[0.65rem] text-[var(--text-muted)] leading-relaxed">
                          Your saved properties are private and visible only to you.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Property Grid */}
              <div className="flex-1 min-w-0">
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                  {properties.map((property) => (
                    <Link
                      key={property.id}
                      href={`/properties/${property.slug}`}
                      className="bg-white border border-[var(--border)] rounded-lg overflow-hidden group block hover:shadow-md transition-shadow"
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
                        {/* Type Badge */}
                        <div className="absolute top-3 left-3 z-10">
                          <span className="bg-[var(--navy)] text-white text-[0.6rem] font-bold tracking-wider uppercase px-2.5 py-1 rounded">
                            {property.propertyType === "APARTMENT" ? "Apartment" :
                             property.propertyType === "VILLA" ? "Villa" :
                             property.propertyType === "PENTHOUSE" ? "Penthouse" :
                             property.propertyType === "PLOT" ? "Plot" :
                             property.propertyType === "COMMERCIAL" ? "Commercial" : "Property"}
                          </span>
                        </div>
                        {/* Delete Button */}
                        <div className="absolute top-3 right-3 z-10">
                          <button
                            onClick={(e) => { e.preventDefault(); e.stopPropagation(); handleRemove(property.id); }}
                            disabled={removing === property.id}
                            className="w-8 h-8 rounded-full bg-white/90 border border-gray-200 flex items-center justify-center text-red-400 hover:text-red-800 hover:border-red-300 hover:bg-white transition-colors cursor-pointer disabled:opacity-50"
                            aria-label="Remove from saved"
                          >
                            {removing === property.id ? (
                              <div className="w-3.5 h-3.5 border-2 border-red-300 border-t-red-500 rounded-full animate-spin" />
                            ) : (
                              <Trash2 className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <div className="p-4">
                        <h3 className="font-serif text-base font-bold text-[var(--text)] mb-1">
                          {property.name}
                        </h3>
                        <div className="flex items-center gap-1 text-[var(--text-muted)] text-xs mb-2">
                          <MapPin className="w-3 h-3 text-[var(--gold)] shrink-0" />
                          <span>{property.locality ? `${property.locality}, ${property.city}` : property.city}</span>
                        </div>
                        {property.configuration && (
                          <p className="text-xs text-[var(--text-muted)] mb-2">
                            {property.configuration}
                          </p>
                        )}
                        <div className="flex items-baseline gap-1">
                          {property.priceMin ? (
                            <span className="text-[var(--gold)] text-lg font-bold">
                              ₹{formatPrice(property.priceMin)}
                            </span>
                          ) : (
                            <span className="text-xs text-[var(--text-muted)] font-semibold">Price Not Disclosed</span>
                          )}
                          {property.priceLabel && (
                            <span className="text-xs text-[var(--text-muted)]">{property.priceLabel}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

    
      {/* Share List Modal */}
      {showShare && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowShare(false)} />
          <div className="relative bg-white rounded-xl shadow-xl w-full max-w-md">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
              <div className="flex items-center gap-2">
                <Share2 className="w-4 h-4 text-[var(--gold)]" />
                <h3 className="text-sm font-bold text-gray-900">Share Your Property List</h3>
              </div>
              <button onClick={() => setShowShare(false)} className="p-1 hover:bg-gray-100 rounded cursor-pointer">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <div className="flex-1 min-w-0 bg-gray-50 border border-gray-200 rounded-lg px-3 py-2.5">
                  <p className="text-xs text-gray-600 truncate">{shareLink}</p>
                </div>
                <button
                  onClick={copyShareLink}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs font-medium text-white bg-[var(--gold)] rounded-lg hover:bg-[var(--gold)]/90 transition-colors cursor-pointer shrink-0"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
              <button
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: "My Saved Properties", url: shareLink });
                  }
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium text-white bg-[var(--navy)] rounded-lg hover:bg-[var(--navy-dark)] transition-colors cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
                Share Link
              </button>
              <p className="text-[0.65rem] text-gray-400 text-center">
                {properties.length} {properties.length === 1 ? "property" : "properties"} in this list
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
