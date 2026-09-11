"use client";

import { ArrowRight, Phone } from "lucide-react";
import IdentityGate from "@/components/identity-gate-link";

export default function DefenceCTA() {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
      <IdentityGate href="/properties" className="inline-flex items-center gap-2 btn-gold">
        Explore Properties
        <ArrowRight className="w-4 h-4" />
      </IdentityGate>
      <a
        href="tel:+919877155088"
        className="inline-flex items-center gap-2 btn-primary"
      >
        <Phone className="w-4 h-4" />
        Call Us
      </a>
    </div>
  );
}
