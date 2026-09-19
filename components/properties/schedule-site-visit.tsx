"use client";

import { useState, useTransition, useEffect } from "react";
import { submitSiteVisit } from "@/lib/actions/property-actions";
import { useCustomer } from "@/components/providers/customer-context";

interface ScheduleSiteVisitProps {
  propertyId: string;
  propertyName: string;
}

export default function ScheduleSiteVisit({ propertyId, propertyName }: ScheduleSiteVisitProps) {
  const { customer } = useCustomer();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    phone: "",
    date: "",
    time: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || customer.name || "",
        phone: prev.phone || customer.phone || "",
      }));
    }
  }, [customer]);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = "Please enter your name.";
    if (!form.phone.trim() || !/^\d{10,15}$/.test(form.phone.replace(/[\s\-+()]/g, ""))) errs.phone = "Please enter a valid phone number.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const result = await submitSiteVisit({
        name: form.name,
        email: customer?.email || `visitor@propertyfifth.com`,
        phone: form.phone,
        category: (customer?.category as "NRI_UHNI" | "DEFENCE_PERSONNEL") || "NRI_UHNI",
        propertyId,
        preferredDate: form.date || undefined,
        preferredTime: form.time || undefined,
        message: `Site visit request for ${propertyName}`,
      });

      if (result.success) {
        setStatus("success");
        setMessage(result.message);
        setForm({ name: "", phone: "", date: "", time: "" });
      } else {
        setStatus("error");
        setMessage(result.message);
      }
    });
  }

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: "" }));
    if (status !== "idle") setStatus("idle");
  }

  if (status === "success") {
    return (
      <div className="text-center py-8">
        <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-success-bg flex items-center justify-center">
          <svg className="w-7 h-7 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="text-sm font-semibold text-foreground mb-2">Request Submitted</p>
        <p className="text-xs text-muted-foreground mb-4">{message}</p>
        <button
          onClick={() => setStatus("idle")}
          className="text-xs font-semibold text-accent hover:underline cursor-pointer"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <input
          type="text"
          placeholder="Your Name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full border border-border rounded px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
        />
        {errors.name && <p className="text-[0.65rem] text-destructive mt-1">{errors.name}</p>}
      </div>
      <div>
        <input
          type="tel"
          placeholder="Your Phone Number"
          value={form.phone}
          onChange={(e) => handleChange("phone", e.target.value)}
          className="w-full border border-border rounded px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
        />
        {errors.phone && <p className="text-[0.65rem] text-destructive mt-1">{errors.phone}</p>}
      </div>
      <div>
        <input
          type="date"
          value={form.date}
          onChange={(e) => handleChange("date", e.target.value)}
          className="w-full border border-border rounded px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
        />
      </div>
      <div>
        <input
          type="time"
          value={form.time}
          onChange={(e) => handleChange("time", e.target.value)}
          className="w-full border border-border rounded px-3 py-2.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-accent"
        />
      </div>

      {status === "error" && (
        <p className="text-[0.65rem] text-destructive">{message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Submitting..." : "Schedule Visit"}
      </button>
    </form>
  );
}
