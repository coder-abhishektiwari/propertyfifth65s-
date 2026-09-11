import { Metadata } from "next";
import { Shield, Mail, MapPin, Phone } from "lucide-react";
import DefenceCTA from "@/components/defence-cta";

export const metadata: Metadata = {
  title: "Defence Personnel | Property Fifth",
  description:
    "Exclusive property advisory services for serving and retired Defence Personnel and their families.",
};

export default function DefencePage() {
  return (
    <section className="bg-[var(--bg)] min-h-screen">
      <div className="container-site pt-24 pb-16 lg:pt-32 lg:pb-24">
        <div className="max-w-3xl mx-auto text-center">
          {/* Icon */}
          <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
            <Shield className="w-10 h-10 text-[var(--gold)]" />
          </div>

          {/* Title */}
          <h1 className="font-serif text-3xl lg:text-4xl font-bold text-[var(--navy)] mb-4">
            Exclusive for Defence Personnel
          </h1>
          <div className="w-16 h-0.5 bg-[var(--gold)] mx-auto mb-6" />
          <p className="text-gray-500 text-sm leading-relaxed mb-10 max-w-xl mx-auto">
            Property Fifth provides specialized property advisory services for serving and
            retired Defence Personnel and their families. Our team understands the unique
            requirements of defence families and offers personalized guidance.
          </p>

          {/* Features */}
          <div className="grid sm:grid-cols-3 gap-6 mb-12">
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <h3 className="text-sm font-bold text-[var(--navy)] mb-1">Pan India Access</h3>
              <p className="text-xs text-gray-500">Properties across all major defence cantonment areas</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                <Shield className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <h3 className="text-sm font-bold text-[var(--navy)] mb-1">Defence Friendly</h3>
              <p className="text-xs text-gray-500">Understanding of defence transfer and posting needs</p>
            </div>
            <div className="bg-white border border-gray-100 rounded-xl p-6 text-center">
              <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                <Phone className="w-5 h-5 text-[var(--gold)]" />
              </div>
              <h3 className="text-sm font-bold text-[var(--navy)] mb-1">Dedicated Support</h3>
              <p className="text-xs text-gray-500">Personal advisor assigned for your property journey</p>
            </div>
          </div>

          {/* CTA */}
          <DefenceCTA />

          {/* Contact */}
          <div className="mt-12 pt-8 border-t border-gray-100">
            <p className="text-xs text-gray-400 mb-2">Need immediate assistance?</p>
            <a
              href="mailto:connect@propertyfifth.com"
              className="inline-flex items-center gap-1.5 text-xs text-[var(--gold)] hover:underline"
            >
              <Mail className="w-3 h-3" />
              connect@propertyfifth.com
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
