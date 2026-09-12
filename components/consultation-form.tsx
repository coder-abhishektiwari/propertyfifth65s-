"use client";

import { useState, useTransition, useEffect } from "react";
import { submitGeneralConsultation } from "@/lib/actions/property-actions";
import { useCustomer } from "@/components/providers/customer-context";

export default function ConsultationForm() {
  const { customer } = useCustomer();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "" as "" | "NRI_UHNI" | "DEFENCE_PERSONNEL",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (customer) {
      setForm((prev) => ({
        ...prev,
        name: prev.name || customer.name || "",
        email: prev.email || customer.email || "",
        phone: prev.phone || customer.phone || "",
        category: prev.category || (customer.category as "NRI_UHNI" | "DEFENCE_PERSONNEL") || "",
      }));
    }
  }, [customer]);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = "Please enter your name.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email.";
    if (!form.phone.trim() || !/^\d{10,15}$/.test(form.phone.replace(/[\s\-+()]/g, ""))) errs.phone = "Please enter a valid phone number.";
    if (!form.category) errs.category = "Please select a category.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const result = await submitGeneralConsultation({
        name: form.name,
        email: form.email,
        phone: form.phone,
        category: form.category as "NRI_UHNI" | "DEFENCE_PERSONNEL",
        message: form.message || undefined,
      });

      if (result.success) {
        setStatus("success");
        setMessage(result.message);
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
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-5 rounded-full bg-green-500 flex items-center justify-center">
          <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-[var(--text)] mb-2">Submitted Successfully!</h3>
        <p className="text-sm text-[var(--text-muted)] mb-6">{message}</p>
        <button
          onClick={() => { setStatus("idle"); setMessage(""); setForm({ name: "", email: "", phone: "", category: "", message: "" }); }}
          className="btn-primary"
        >
          Submit Another Request
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Full Name</label>
        <input
          type="text"
          placeholder="Enter your full name"
          value={form.name}
          onChange={(e) => handleChange("name", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-colors"
        />
        {errors.name && <p className="text-[0.65rem] text-red-500 mt-1">{errors.name}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Email Address</label>
        <input
          type="email"
          placeholder="Enter your email address"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-colors"
        />
        {errors.email && <p className="text-[0.65rem] text-red-500 mt-1">{errors.email}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone Number</label>
        <div className="flex gap-2">
          <div className="shrink-0">
            <div className="flex items-center gap-1 px-4 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700">
              +91
            </div>
          </div>
          <input
            type="tel"
            placeholder="Enter your phone number"
            value={form.phone}
            onChange={(e) => handleChange("phone", e.target.value)}
            className="flex-1 border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-colors"
          />
        </div>
        {errors.phone && <p className="text-[0.65rem] text-red-500 mt-1">{errors.phone}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Category</label>
        <select
          value={form.category}
          onChange={(e) => handleChange("category", e.target.value)}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-colors appearance-none bg-white"
        >
          <option value="">Select Category</option>
          <option value="NRI_UHNI">NRI / UHNI</option>
          <option value="DEFENCE_PERSONNEL">Defence Personnel</option>
        </select>
        {errors.category && <p className="text-[0.65rem] text-red-500 mt-1">{errors.category}</p>}
      </div>
      <div>
        <label className="block text-xs font-semibold text-gray-700 mb-1.5">Message (Optional)</label>
        <textarea
          placeholder="Tell us about your property requirements..."
          value={form.message}
          onChange={(e) => handleChange("message", e.target.value)}
          rows={4}
          className="w-full border border-gray-200 rounded-lg px-4 py-3 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-colors resize-none"
        />
      </div>

      {status === "error" && (
        <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{message}</p>
      )}

      <button
        type="submit"
        disabled={isPending}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isPending ? "Submitting..." : "Submit Consultation Request"}
      </button>
    </form>
  );
}
