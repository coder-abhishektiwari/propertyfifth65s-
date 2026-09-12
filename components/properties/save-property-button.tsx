"use client";

import { useState, useEffect } from "react";
import { Bookmark } from "lucide-react";
import { useCustomer } from "@/components/providers/customer-context";

interface SavePropertyButtonProps {
  propertyId: string;
}

export default function SavePropertyButton({ propertyId }: SavePropertyButtonProps) {
  const { isComplete, openDialog } = useCustomer();
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isComplete) return;
    fetch(`/api/customer/save-property?propertyId=${propertyId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.saved !== undefined) setSaved(data.saved);
      })
      .catch(() => {});
  }, [propertyId, isComplete]);

  async function handleToggle() {
    if (!isComplete) {
      openDialog();
      return;
    }
    if (saving) return;

    setSaving(true);
    try {
      const res = await fetch("/api/customer/save-property", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ propertyId }),
      });
      const data = await res.json();
      if (res.ok) {
        setSaved(data.saved);
      }
    } catch {
      // ignore
    } finally {
      setSaving(false);
    }
  }

  return (
    <button
      onClick={handleToggle}
      disabled={saving}
      className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer disabled:opacity-50 ${
        saved
          ? "border-[var(--gold)] text-[var(--gold)] bg-[var(--gold)]/10"
          : "border-[var(--border)] text-[var(--text-muted)] hover:text-[var(--gold)] hover:border-[var(--gold)]"
      }`}
      aria-label={saved ? "Unsave property" : "Save property"}
    >
      <Bookmark className={`w-4 h-4 ${saved ? "fill-current" : ""}`} />
    </button>
  );
}
