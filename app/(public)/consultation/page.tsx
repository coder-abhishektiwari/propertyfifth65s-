import { Metadata } from "next";
import { MessageCircle, ArrowRight } from "lucide-react";
import Link from "next/link";
import ConsultationForm from "@/components/consultation-form";

export const metadata: Metadata = {
  title: "Book Consultation | Property Fifth",
  description: "Schedule a free consultation with our expert property advisors. Get personalized guidance for your real estate journey.",
};

export default function ConsultationPage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--navy)] pt-24 pb-16 lg:pt-28 lg:pb-20">
        <div className="container-site">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-full bg-[var(--gold)]/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <span className="text-[0.65rem] font-bold tracking-[0.15em] text-[var(--gold)] uppercase">
                Free Consultation
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-4">
              Talk to Our <span className="text-[var(--gold)]">Property Experts</span>
            </h1>
            <p className="text-white/60 text-sm sm:text-base leading-relaxed max-w-lg">
              Whether you&apos;re looking for your dream home or a smart investment, our advisors
              are here to guide you every step of the way.
            </p>
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="bg-[var(--bg)] py-12 lg:py-16">
        <div className="container-site">
          <div className="max-w-xl mx-auto">
            <div className="bg-white rounded-xl border border-gray-200 p-6 sm:p-8">
              <h2 className="font-serif text-xl font-bold text-[var(--navy)] mb-1">
                Book a Consultation
              </h2>
              <p className="text-xs text-gray-500 mb-6">
                Fill in your details and our expert will get in touch with you.
              </p>
              <ConsultationForm />
            </div>

            <div className="mt-8 text-center">
              <Link
                href="/properties"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--gold)] hover:underline"
              >
                Browse Properties Instead
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
