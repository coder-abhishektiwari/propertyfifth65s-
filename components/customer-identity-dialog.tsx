"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { X, User, Mail, Phone, Globe, Shield, MapPin, Lock, CheckCircle } from "lucide-react";
import { submitCustomerIdentity } from "@/lib/actions/customer-actions";
import { useCustomer } from "@/components/providers/customer-context";

export default function CustomerIdentityDialog() {
  const router = useRouter();
  const { dialogOpen, closeDialog, onIdentityComplete } = useCustomer();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "" as "" | "NRI_UHNI" | "DEFENCE_PERSONNEL",
  });

  useEffect(() => {
    if (!submitted) return;
    const timer = setTimeout(() => {
      setSubmitted(false);
      closeDialog();
      setTimeout(() => {
        setError("");
        setForm({ name: "", email: "", phone: "", category: "" });
      }, 300);
    }, 3000);
    return () => clearTimeout(timer);
  }, [submitted, closeDialog]);

  function handleChange(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (error) setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name.trim() || form.name.trim().length < 2) {
      setError("Please enter your name.");
      return;
    }
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if (!form.phone.trim() || !/^\d{10,15}$/.test(form.phone.replace(/[\s\-+()]/g, ""))) {
      setError("Please enter a valid phone number.");
      return;
    }
    if (!form.category) {
      setError("Please select a category.");
      return;
    }

    startTransition(async () => {
      const result = await submitCustomerIdentity({
        name: form.name,
        email: form.email,
        phone: form.phone,
        category: form.category as "NRI_UHNI" | "DEFENCE_PERSONNEL",
      });

      if (result.success && result.customer) {
        onIdentityComplete(result.customer);
        setSubmitted(true);
        const redirectCategory = form.category;
        setTimeout(() => {
          if (redirectCategory === "DEFENCE_PERSONNEL") {
            router.push("/defence");
          }
        }, 3000);
      } else {
        setError(result.message);
      }
    });
  }

  function handleClose() {
    closeDialog();
    setTimeout(() => {
      setError("");
      setForm({ name: "", email: "", phone: "", category: "" });
    }, 300);
  }

  if (!dialogOpen) return null;

  if (submitted) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-5">
          <div className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Submitted Successfully!</h2>
            <p className="text-sm text-gray-500">We&apos;ll get back to you shortly.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-[1%]">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={handleClose} />

      {/* Dialog */}
      <div className="relative w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row">
        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors cursor-pointer shadow-sm"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* Left Panel - Branding */}
        <div className="relative lg:w-[45%] hidden lg:flex flex-col justify-end overflow-hidden">
          <img
            src="/images/bg/admin-login-bg.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--navy)]/95 via-[var(--navy)]/60 to-transparent" />

          {/* Content */}
          <div className="relative z-10 p-8 lg:p-10">
            <img
              src="/images/logo/pf-logo.webp"
              alt="Property Fifth"
              className="h-12 mb-6"
            />
            <h2 className="font-serif text-3xl lg:text-4xl font-bold text-white leading-tight mb-2">
              Your Property Journey Starts with the{" "}
              <span className="text-[var(--gold)]">Right Guidance.</span>
            </h2>
            <div className="w-16 h-0.5 bg-[var(--gold)] mt-4 mb-4" />
            <p className="text-white/60 text-sm leading-relaxed">
              Share your details and our experts will connect with you to understand your needs
              and guide you with the best property options.
            </p>
          </div>

          {/* Bottom Badges */}
          <div className="relative z-10 px-8 lg:px-10 pb-8 lg:pb-10 flex gap-3">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5 border border-white/10">
              <Globe className="w-5 h-5 text-[var(--gold)]" />
              <div>
                <p className="text-xs font-bold text-white">NRI / UHNI</p>
                <p className="text-[0.6rem] text-white/50">Global Perspective. Trusted Guidance.</p>
              </div>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-lg px-4 py-2.5 border border-white/10">
              <Shield className="w-5 h-5 text-[var(--gold)]" />
              <div>
                <p className="text-xs font-bold text-white">Defence Personnel</p>
                <p className="text-[0.6rem] text-white/50">Exclusive Care for Defence Families.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Header */}
        <div className="lg:hidden bg-[var(--navy)] p-5 pt-12">
          <img
            src="/images/logo/pf-logo-notext.webp"
            alt="Property Fifth"
            className="h-10 mb-3"
          />
          <h2 className="font-serif text-xl font-bold text-white">
            Let&apos;s Get <span className="text-[var(--gold)]">Started</span>
          </h2>
        </div>

        {/* Right Panel - Form */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6 lg:p-10 lg:pt-10 max-w-lg mx-auto lg:max-w-none">
            {/* Desktop Title */}
            <div className="hidden lg:block mb-8">
              <h2 className="font-serif text-3xl font-bold text-[var(--navy)]">
                Let&apos;s Get Started
              </h2>
              <div className="w-12 h-0.5 bg-[var(--gold)] mt-3 mb-4" />
              <p className="text-sm text-gray-500 leading-relaxed">
                Help us know you better so we can connect you with the right expert and deliver
                a personalized property experience.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold)]" />
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={(e) => handleChange("name", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold)]" />
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    className="w-full pl-10 pr-4 py-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>

              {/* Phone */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1.5">
                  Phone Number
                </label>
                <div className="flex gap-2">
                  <div className="relative shrink-0">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--gold)]" />
                    <div className="flex items-center gap-1 pl-10 pr-3 py-3 border border-gray-200 rounded-lg bg-gray-50 text-sm text-gray-700">
                      +91
                    </div>
                  </div>
                  <input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={(e) => handleChange("phone", e.target.value)}
                    className="flex-1 px-4 py-3 text-sm border border-gray-200 rounded-lg bg-white text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[var(--gold)]/30 focus:border-[var(--gold)] transition-colors"
                  />
                </div>
              </div>

              {/* Category */}
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-2">
                  I belong to
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleChange("category", "NRI_UHNI")}
                    className={`relative flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      form.category === "NRI_UHNI"
                        ? "border-[var(--gold)] bg-[var(--gold)]/5 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-3 left-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        form.category === "NRI_UHNI"
                          ? "border-[var(--gold)] bg-[var(--gold)]"
                          : "border-gray-300"
                      }`}
                    >
                      {form.category === "NRI_UHNI" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <Globe className="w-7 h-7 text-[var(--gold)] mb-2" />
                    <p className="text-xs font-bold text-[var(--navy)]">NRI / UHNI</p>
                    <p className="text-[0.6rem] text-gray-500 mt-0.5 leading-tight">
                      Non-Resident Indian / Ultra High Net Worth Individual
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleChange("category", "DEFENCE_PERSONNEL")}
                    className={`relative flex flex-col items-center text-center p-4 rounded-xl border-2 transition-all cursor-pointer ${
                      form.category === "DEFENCE_PERSONNEL"
                        ? "border-[var(--gold)] bg-[var(--gold)]/5 shadow-sm"
                        : "border-gray-200 hover:border-gray-300"
                    }`}
                  >
                    <div
                      className={`absolute top-3 left-3 w-4 h-4 rounded-full border-2 flex items-center justify-center ${
                        form.category === "DEFENCE_PERSONNEL"
                          ? "border-[var(--gold)] bg-[var(--gold)]"
                          : "border-gray-300"
                      }`}
                    >
                      {form.category === "DEFENCE_PERSONNEL" && (
                        <div className="w-1.5 h-1.5 rounded-full bg-white" />
                      )}
                    </div>
                    <Shield className="w-7 h-7 text-[var(--gold)] mb-2" />
                    <p className="text-xs font-bold text-[var(--navy)]">Defence Personnel</p>
                    <p className="text-[0.6rem] text-gray-500 mt-0.5 leading-tight">
                      Serving / Retired Defence Personnel & Their Families
                    </p>
                  </button>
                </div>
              </div>

              {/* Location Notice */}
              <div className="flex items-start gap-2.5 bg-gray-50 rounded-lg p-3 border border-gray-100">
                <MapPin className="w-4 h-4 text-[var(--gold)] shrink-0 mt-0.5" />
                <p className="text-[0.7rem] text-gray-500 leading-relaxed">
                  For your convenience, we will request access to your location. This helps us
                  provide property options near you.
                </p>
              </div>

              {/* Privacy */}
              <div className="flex items-start gap-2.5">
                <Lock className="w-3.5 h-3.5 text-gray-400 shrink-0 mt-0.5" />
                <p className="text-[0.65rem] text-gray-400 leading-relaxed">
                  Your information is secure with us and will only be used to assist you with our
                  property advisory services.
                </p>
              </div>

              {/* Error */}
              {error && (
                <p className="text-xs text-red-500 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={isPending}
                className="w-full flex items-center justify-center gap-2 bg-[var(--navy)] text-white font-bold text-sm py-3.5 rounded-lg hover:bg-[var(--navy-dark)] transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
              >
                {isPending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    SUBMIT & CONNECT
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
