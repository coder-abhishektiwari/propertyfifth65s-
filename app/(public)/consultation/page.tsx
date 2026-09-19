import { Metadata } from "next";
import { MessageCircle, ArrowRight, ShieldCheck, Headphones } from "lucide-react";
import Link from "next/link";
import ConsultationForm from "@/components/consultation-form";

export const metadata: Metadata = {
  title: "Book Consultation | Property Fifth",
  description: "Schedule a free consultation with our expert property advisors. Get personalized guidance for your real estate journey.",
};

export default function ConsultationPage() {
  return (
    <section className="min-h-[calc(100vh-80px)] bg-background pt-24 pb-12 lg:pt-32 lg:pb-20 flex items-center">
      <div className="container-site w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          
          {/* Left Column: Information & Branding */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20">
              <MessageCircle className="w-4 h-4 text-accent" />
              <span className="text-[0.7rem] font-bold tracking-widest text-accent uppercase">
                Free Advisory Session
              </span>
            </div>

            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-primary leading-[1.15]">
              Talk to Our <span className="text-accent">Property Advisor</span>
            </h1>

            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed max-w-xl">
              Whether you&apos;re looking for your dream home or a smart investment opportunity, 
              our expert advisors are here to offer tailored guidance every step of the way.
            </p>

            {/* Quick Benefits/Trust Signals */}
            <div className="pt-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted text-accent">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-primary">Unbiased Advice</h4>
                  <p className="text-[0.75rem] text-muted-foreground">Tailored property options matching your goals.</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="p-2 rounded-lg bg-muted text-accent">
                  <Headphones className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-primary">Instant Response</h4>
                  <p className="text-[0.75rem] text-muted-foreground">Get connected within 24 business hours.</p>
                </div>
              </div>
            </div>

            {/* Link to properties */}
            <div className="pt-4">
              <Link
                href="/properties"
                className="inline-flex items-center gap-2 text-xs font-semibold text-accent hover:underline group"
              >
                Browse Properties Instead
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>

          {/* Right Column: Consultation Form Card */}
          <div className="lg:col-span-6">
            <div className="bg-card rounded-2xl border border-border/80 shadow-xl p-6 sm:p-8 relative overflow-hidden">
              <div className="mb-6">
                <h2 className="font-serif text-2xl font-bold text-primary mb-1.5">
                  Book a Consultation
                </h2>
                <p className="text-xs text-muted-foreground">
                  Fill in your details below and our specialist will reach out shortly.
                </p>
              </div>

              <ConsultationForm />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}