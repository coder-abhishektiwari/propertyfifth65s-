import { Metadata } from "next";
import Image from "next/image";
import {
  Shield,
  Users,
  Award,
  Handshake,
  BarChart3,
  Search,
  Headphones,
} from "lucide-react";
import { toMediaImageUrl } from "@/lib/property-utils";

export const metadata: Metadata = {
  title: "About Us | Property Fifth",
  description:
    "Learn about Property Fifth — a premium real estate advisory firm committed to helping you make confident property decisions.",
};

const BELIEFS = [
  {
    icon: Shield,
    title: "Integrity",
    desc: "Honest advice and complete transparency in every interaction.",
  },
  {
    icon: Users,
    title: "Client First",
    desc: "Your goals come first. We listen, understand and deliver accordingly.",
  },
  {
    icon: Award,
    title: "Excellence",
    desc: "We are committed to the highest standards in research, service and follow-through.",
  },
  {
    icon: Handshake,
    title: "Long-Term Relationships",
    desc: "We believe in lasting partnerships built on trust, performance and mutual respect.",
  },
];

const EXPERTISE = [
  {
    icon: BarChart3,
    title: "Market Knowledge",
    desc: "In-depth understanding of micro-markets to help you identify the best opportunities.",
  },
  {
    icon: Search,
    title: "Expert Advisory",
    desc: "Data-driven insights and strategic advice for informed decisions.",
  },
  {
    icon: Headphones,
    title: "End-to-End Support",
    desc: "From shortlisting to possession, we are with you at every step.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative bg-[var(--navy)] overflow-hidden mt-16 lg:mt-18">
        <div className="flex flex-col lg:flex-row min-h-[400px] lg:min-h-[480px]">
          <div className="relative z-10 w-full lg:w-1/2 flex items-center">
            <div className="container-site py-12 lg:py-20">
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">
                About<span className="text-[var(--gold)]"> Us</span>
              </h1>
              <div className="w-16 h-[3px] bg-[var(--gold)] mb-8" />
              <p className="text-white/60 text-base leading-relaxed max-w-md">
                We are a premium real estate advisory firm committed to helping you make confident property decisions that shape your future.
              </p>
            </div>
          </div>

          <div className="relative w-full lg:w-4/5 min-h-[300px] lg:min-h-auto">
            <Image
              src="/images/hero/who-we-are.png"
              alt="Property Fifth Premium Lounge"
              fill
              className="object-cover object-center"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--navy)] via-[var(--navy)]/1 to-transparent lg:block hidden" />
            <div className="absolute inset-0 bg-gradient-to-b from-[var(--navy)] via-transparent to-[var(--navy)] lg:hidden" />
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="section-py bg-white">
        <div className="container-site">
          <div className="flex flex-col lg:flex-row gap-10 lg:gap-16 items-center">
            <div className="w-full lg:w-1/2">
              <h2 className="heading-lg mb-2">Who We Are</h2>
              <div className="w-12 h-0.5 bg-[var(--gold)] mb-6" />
              <div className="space-y-4 text-sm text-[var(--text-muted)] leading-relaxed">
                <p>
                  Property Fifth is a boutique real estate advisory firm specialising in premium and high-value properties across India.
                </p>
                <p>
                  We work with NRIs, investors, business owners and defence families — providing expert guidance with complete transparency.
                </p>
                <p>
                  Our goal is simple — to help you find the right property, at the right value, with complete confidence.
                </p>
              </div>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="relative aspect-[16/10] rounded-lg overflow-hidden">
                <Image
                  src={toMediaImageUrl("/images/bg/bg.webp")}
                  alt="Premium real estate development"
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What We Believe In */}
      <section className="section-py bg-[var(--bg-muted)]">
        <div className="container-site">
          <h2 className="heading-lg mb-2">What We Believe In</h2>
          <div className="w-12 h-0.5 bg-[var(--gold)] mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {BELIEFS.map((item) => (
              <div
                key={item.title}
                className="bg-white border border-[var(--border)] rounded-lg p-6 text-center hover:shadow-md transition-shadow"
              >
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <h3 className="font-serif text-sm font-bold text-[var(--text)] mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Expertise */}
      <section className="section-py bg-white">
        <div className="container-site">
          <h2 className="heading-lg mb-2">Our Expertise</h2>
          <div className="w-12 h-0.5 bg-[var(--gold)] mb-4" />
          <p className="text-sm text-[var(--text-muted)] leading-relaxed max-w-2xl mb-10">
            With deep market knowledge and a strong network, we provide end-to-end advisory across residential, commercial and investment properties.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {EXPERTISE.map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 p-5 bg-[var(--bg-muted)] rounded-lg"
              >
                <div className="w-10 h-10 rounded-full bg-[var(--gold)]/10 flex items-center justify-center shrink-0">
                  <item.icon className="w-5 h-5 text-[var(--gold)]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold text-[var(--text)] mb-1">
                    {item.title}
                  </h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

    </>
  );
}
