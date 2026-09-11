"use client";

import { useState, useTransition, useEffect } from "react";
import { X } from "lucide-react";
import { submitCallbackRequest } from "@/lib/actions/property-actions";
import { useCustomer } from "@/components/providers/customer-context";

interface RequestCallbackDialogProps {
  propertyId: string;
  propertyName: string;
  isOpen: boolean;
  onClose: () => void;
}

export default function RequestCallbackDialog({ propertyId, propertyName, isOpen, onClose }: RequestCallbackDialogProps) {
  const { customer } = useCustomer();
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "" as "" | "NRI_UHNI" | "DEFENCE_PERSONNEL",
    preferredTime: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isOpen && customer) {
      setForm((prev) => ({
        ...prev,
        name: customer.name || prev.name,
        email: customer.email || prev.email,
        phone: customer.phone || prev.phone,
        category: (customer.category as "" | "NRI_UHNI" | "DEFENCE_PERSONNEL") || prev.category,
      }));
    }
  }, [isOpen, customer]);

  function validate() {
    const errs: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = "Please enter your name.";
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email.";
    if (!form.phone.trim() || !/^\d{10,15}$/.test(form.phone.replace(/[\s\-+()]/g, ""))) errs.phone = "Please enter a valid phone number.";
    if (!form.category) errs.category = "Please select a category.";
    if (!form.preferredTime) errs.preferredTime = "Please select a preferred time.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    startTransition(async () => {
      const result = await submitCallbackRequest({
        name: form.name,
        email: form.email,
        phone: form.phone,
        category: form.category as "NRI_UHNI" | "DEFENCE_PERSONNEL",
        propertyId,
        preferredTime: form.preferredTime,
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

  function handleClose() {
    onClose();
    setTimeout(() => {
      setStatus("idle");
      setMessage("");
      setForm({ name: "", email: "", phone: "", category: "", preferredTime: "", message: "" });
      setErrors({});
    }, 300);
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[var(--border)]">
          <div>
            <h3 className="text-sm font-bold text-[var(--text)]">Request Callback</h3>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{propertyName}</p>
          </div>
          <button onClick={handleClose} className="p-1 hover:bg-[var(--bg-muted)] rounded cursor-pointer">
            <X className="w-5 h-5 text-[var(--text-muted)]" />
          </button>
        </div>

        <div className="p-5">
          {status === "success" ? (
            <div className="text-center py-6">
              <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-green-50 flex items-center justify-center">
                <svg className="w-7 h-7 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-sm font-semibold text-[var(--text)] mb-2">Request Submitted</p>
              <p className="text-xs text-[var(--text-muted)] mb-4">{message}</p>
              <button onClick={handleClose} className="btn-primary">
                Done
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <input
                  type="text"
                  placeholder="Your Name"
                  value={form.name}
                  onChange={(e) => { setForm(p => ({ ...p, name: e.target.value })); if (errors.name) setErrors(p => ({ ...p, name: "" })); }}
                  className="w-full border border-[var(--border)] rounded px-3 py-2.5 text-xs text-[var(--text)] placeholder:text-[var(--text-light)] focus:outline-none focus:border-[var(--gold)]"
                />
                {errors.name && <p className="text-[0.65rem] text-red-500 mt-1">{errors.name}</p>}
              </div>
              <div>
                <input
                  type="email"
                  placeholder="Your Email"
                  value={form.email}
                  onChange={(e) => { setForm(p => ({ ...p, email: e.target.value })); if (errors.email) setErrors(p => ({ ...p, email: "" })); }}
                  className="w-full border border-[var(--border)] rounded px-3 py-2.5 text-xs text-[var(--text)] placeholder:text-[var(--text-light)] focus:outline-none focus:border-[var(--gold)]"
                />
                {errors.email && <p className="text-[0.65rem] text-red-500 mt-1">{errors.email}</p>}
              </div>
              <div>
                <input
                  type="tel"
                  placeholder="Your Phone Number"
                  value={form.phone}
                  onChange={(e) => { setForm(p => ({ ...p, phone: e.target.value })); if (errors.phone) setErrors(p => ({ ...p, phone: "" })); }}
                  className="w-full border border-[var(--border)] rounded px-3 py-2.5 text-xs text-[var(--text)] placeholder:text-[var(--text-light)] focus:outline-none focus:border-[var(--gold)]"
                />
                {errors.phone && <p className="text-[0.65rem] text-red-500 mt-1">{errors.phone}</p>}
              </div>
              <div>
                <select
                  value={form.category}
                  onChange={(e) => { setForm(p => ({ ...p, category: e.target.value as "" | "NRI_UHNI" | "DEFENCE_PERSONNEL" })); if (errors.category) setErrors(p => ({ ...p, category: "" })); }}
                  className="w-full border border-[var(--border)] rounded px-3 py-2.5 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--gold)] appearance-none bg-white"
                >
                  <option value="">Select Category</option>
                  <option value="NRI_UHNI">NRI / UHNI</option>
                  <option value="DEFENCE_PERSONNEL">Defence Personnel</option>
                </select>
                {errors.category && <p className="text-[0.65rem] text-red-500 mt-1">{errors.category}</p>}
              </div>
              <div>
                <select
                  value={form.preferredTime}
                  onChange={(e) => { setForm(p => ({ ...p, preferredTime: e.target.value })); if (errors.preferredTime) setErrors(p => ({ ...p, preferredTime: "" })); }}
                  className="w-full border border-[var(--border)] rounded px-3 py-2.5 text-xs text-[var(--text)] focus:outline-none focus:border-[var(--gold)] appearance-none bg-white"
                >
                  <option value="">Preferred Time</option>
                  <option value="morning">Morning (9 AM - 12 PM)</option>
                  <option value="afternoon">Afternoon (12 PM - 4 PM)</option>
                  <option value="evening">Evening (4 PM - 7 PM)</option>
                </select>
                {errors.preferredTime && <p className="text-[0.65rem] text-red-500 mt-1">{errors.preferredTime}</p>}
              </div>
              <div>
                <textarea
                  placeholder="Your Message (Optional)"
                  value={form.message}
                  onChange={(e) => setForm(p => ({ ...p, message: e.target.value }))}
                  rows={3}
                  className="w-full border border-[var(--border)] rounded px-3 py-2.5 text-xs text-[var(--text)] placeholder:text-[var(--text-light)] focus:outline-none focus:border-[var(--gold)] resize-none"
                />
              </div>

              {status === "error" && <p className="text-[0.65rem] text-red-500">{message}</p>}

              <button type="submit" disabled={isPending} className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed">
                {isPending ? "Submitting..." : "Submit Request"}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
