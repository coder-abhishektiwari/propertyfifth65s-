import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  Shield,
  Check,
  Building2,
  TrendingUp,
  Briefcase,
  Handshake,
} from "lucide-react";
import FeaturedPropertiesCarousel from "@/components/FeaturedPropertiesCarousel";
import { getFeaturedProperties } from "@/lib/properties";
import IdentityGate from "@/components/identity-gate-link";

export const dynamic = "force-dynamic";

const REASONS = [
  { num: "01", title: "Curated, Not Crowded", desc: "Carefully selected opportunities, not endless listings." },
  { num: "02", title: "Transparent Advisory", desc: "Honest guidance, clear information and a client-first approach." },
  { num: "03", title: "Market Intelligence", desc: "Insights beyond brochures — location, pricing, trends and future growth." },
  { num: "04", title: "End-to-End Assistance", desc: "From shortlisting to site visits and final decision-making, we're with you." },
  { num: "05", title: "Defence-Focused", desc: "Specialised understanding of the needs of Defence Officers and their families." },
];

const SERVICES = [
  { icon: Building2, title: "Property Advisory", desc: "Expert guidance to find the right property that matches your goals." },
  { icon: TrendingUp, title: "Investment Advisory", desc: "Strategic advice to help you invest in high-potential real estate opportunities." },
  { icon: Briefcase, title: "Portfolio Assistance", desc: "Build a well-balanced real estate portfolio for steady growth and diversification." },
  { icon: Handshake, title: "Developer Partnerships", desc: "Strong partnerships to bring you the best projects and exclusive benefits." },
];

const LOCATIONS = [
  { name: "DUBAI", subtitle: "Premium Residences & Investments", image: "/images/locations/gurugram.webp" },
  { name: "DELHI NCR", subtitle: "The Heart of Opportunity", image: "/images/locations/delhi-ncr.webp" },
  { name: "GURGAON", subtitle: "The Future-Ready City", image: "/images/locations/pune.webp" },
  { name: "GREATER NOIDA", subtitle: "India's Innovation Hub", image: "/images/locations/bangalore.webp" },
];

const DEFENCE_CHECKLIST = [
  "Personalised Property Advisory",
  "Curated Premium Opportunities",
  "Remote Assistance for Serving Officers",
  "Site Visit Coordination",
  "Family-Focused Property Planning",
];

const TESTIMONIALS = [
  {
    text: "As an NRI, I was sceptical about buying property remotely. Property Fifth made the entire process seamless, transparent and stress-free.",
    author: "Rohan Mehta, Himanchal",
  },
  {
    text: "They understand the unique needs of Defence families. From shortlisting to possession, their support has been exceptional.",
    author: "Col. Arvind Singh (Retd.)",
  },
  {
    text: "The team understood exactly what I was looking for and presented options that genuinely matched my requirements. Their guidance made the decision much easier.",
    author: "Amit Sharma, Gurgaon",
  },
  {
    text: "What stood out was the transparency and personal attention throughout the process. I always felt that my interests came first.",
    author: "Neha Kapoor, Bangalore",
  },
];

/* ─── Page ──────────────────────────────────────────── */

export default async function HomePage() {
  const dbProperties = await getFeaturedProperties();

  const featuredProperties = dbProperties.map((p) => {
    const cover = p.images.find((img) => img.isCover) || p.images[0];
    return {
      id: p.id,
      name: p.name,
      slug: p.slug,
      status: p.status || "NEW_LAUNCH",
      city: p.city,
      locality: p.locality || "",
      configuration: p.configuration || "",
      coverImage: cover?.imageUrl || "",
      developerName: p.developerName || "",
      propertyType: p.propertyType || "",
      highlight: p.shortDescription || "",
    };
  });
  return (
    <>
      {/* ─── Hero Section ──────────────────────── */}
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-[var(--navy)] pt-16 lg:pt-[4.5rem]">
        <div className="hero-overlay absolute inset-0 z-10" />

        <div className="relative z-20 container-site py-20 lg:py-22 flex items-center">
          <div className="max-w-xl">
            <p className="text-[var(--gold)] text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Premium Properties. Trusted Advisory.
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-[1.15]">
              Discover Properties
              <br />
              That Match
              <br />
              <span className="text-[var(--gold)]">Your Mission.</span>
            </h1>
            <p className="mt-5 text-white/60 text-sm leading-relaxed max-w-md">
              Premium Real Estate Opportunities , strategic investments and trusted advisory - thoughtfully curated for defence personnel, veterans and their families
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <IdentityGate href="/properties" className="btn-primary inline-flex items-center gap-2">
                Explore Properties
                <ArrowRight className="w-4 h-4" />
              </IdentityGate>
              <IdentityGate href="/consultation" className="btn-gold inline-flex items-center gap-2">
                Book a Consultation
                <ArrowRight className="w-4 h-4" />
              </IdentityGate>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Properties (Auto Sliding Carousel) ───────────────────────── */}
      <section className="section-py bg-[var(--bg)]">
        <div className="container-site">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-[var(--gold)] text-xs font-semibold tracking-[0.2em] uppercase mb-1">
                Exceptional Properties. Extraordinary Living.
              </p>
              <h2 className="heading-lg">Featured Opportunity</h2>
            </div>
            <IdentityGate
              href="/properties"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-[var(--navy)] hover:text-[var(--gold)] transition-colors"
            >
              View All Properties
              <ArrowRight className="w-4 h-4" />
            </IdentityGate>
          </div>

          <FeaturedPropertiesCarousel properties={featuredProperties} />
        </div>
      </section>

      {/* ─── Why Choose Property Fifth ─────────────────── */}
      <section className="section-py bg-[var(--bg-muted)]">
        <div className="container-site">
          <p className="text-center text-[var(--gold)] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
            Why Choose Property Fifth?
          </p>
          <div className="h-px bg-[var(--gold)] w-16 mx-auto mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {REASONS.map((r) => (
              <div key={r.num} className="bg-white border border-[var(--border)] rounded-lg p-5 text-center hover:shadow-md transition-shadow">
                <span className="font-serif text-4xl lg:text-5xl font-bold text-[var(--gold)] leading-none">
                  {r.num}
                </span>
                <h3 className="font-serif text-sm font-bold mt-3 mb-2 text-[var(--text)]">{r.title}</h3>
                <p className="text-xs text-[var(--text-muted)] leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Our Services ─────────────────────────────── */}
      <section className="section-py bg-[var(--bg)]">
        <div className="container-site">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">
            <div>
              <p className="text-[var(--text-muted)] text-xs font-semibold tracking-[0.15em] uppercase mb-2">
                Our Services
              </p>
              <h2 className="heading-lg">
                Solutions That
                <br />
                Move You <span className="text-[var(--gold)]">Forward.</span>
              </h2>
              <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
                Comprehensive real estate advisory services tailored to your goals.
              </p>
              <Link href="/services" className="btn-primary mt-6">
                Explore All Services
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {SERVICES.map((s) => (
                <div
                  key={s.title}
                  className="bg-white border border-[var(--border)] rounded-lg p-5 hover:shadow-md transition-shadow"
                >
                  <div className="w-10 h-10 rounded-full bg-[var(--gold)]  flex items-center justify-center mb-4">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-sm font-bold mb-2">{s.title}</h3>
                  <p className="text-xs text-[var(--text-muted)] leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Locations ────────────────────────── */}
      <section className="section-py bg-[var(--bg-muted)]">
        <div className="container-site">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">
            <div>
              <p className="text-[var(--text-muted)] text-xs font-semibold tracking-[0.15em] uppercase mb-2">
                Featured Locations
              </p>
              <h2 className="heading-lg">
                Prime Locations.
                <br />
                Promising <span className="text-[var(--gold)]">Futures.</span>
              </h2>
              <p className="mt-3 text-sm text-[var(--text-muted)] leading-relaxed max-w-xs">
                Carefully selected locations with excellent connectivity, infrastructure and growth potential.
              </p>
              <IdentityGate href="/properties" className="btn-primary mt-6 inline-flex items-center gap-2">
                Explore All Locations
                <ArrowRight className="w-4 h-4" />
              </IdentityGate>
            </div>
            <div className="relative">
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {LOCATIONS.map((loc) => (
                  <IdentityGate
                    key={loc.name}
                    href={`/properties?city=${encodeURIComponent(loc.name)}`}
                    className="group relative rounded-lg overflow-hidden h-44 block text-left"
                  >
                    <Image
                      src={loc.image}
                      alt={loc.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent z-10" />
                    <div className="absolute bottom-0 left-0 p-3 z-20">
                      <h3 className="text-white text-xs font-bold tracking-wider uppercase">{loc.name}</h3>
                      <p className="text-white/60 text-[0.65rem] mt-0.5">{loc.subtitle}</p>
                    </div>
                  </IdentityGate>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Defence Officers ──────────────────────────── */}
      <section className="relative bg-[#06101E] overflow-hidden py-16 lg:py-24 border-y border-white/5">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[var(--gold)]/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-site relative z-10">
          <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-6 sm:p-8 lg:p-12 backdrop-blur-sm shadow-2xl">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-[var(--gold)]/30 to-transparent rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                <div className="relative rounded-xl overflow-hidden aspect-[4/5] w-full border border-white/10 shadow-2xl">
                  <Image
                    src="/images/sections/defence-officers.webp"
                    alt="Defence Officers & Families"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transform group-hover:scale-105 transition duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#06101E]/80 via-transparent to-transparent z-10" />

                  <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-lg border border-white/10 flex items-center gap-3 z-20">
                    <div className="w-8 h-8 rounded-full bg-[var(--gold)]/20 border border-[var(--gold)]/50 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 text-[var(--gold)]" />
                    </div>
                    <span className="text-xs font-medium text-white/90">
                      Trusted Advisory for Armed Forces
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--gold)]/10 border border-[var(--gold)]/20 w-fit mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--gold)]" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-[var(--gold)]">
                    Honor & Excellence
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-white leading-tight">
                  A Dedicated Approach for{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--gold)] via-[#f3e0aa] to-[var(--gold)]">
                    Defence Officers & Their Families
                  </span>
                </h2>

                <p className="mt-4 text-white/60 text-sm sm:text-base leading-relaxed max-w-xl">
                  We understand the core values of trust, discipline, and long-term planning.
                  Our specialized desk provides complete clarity, remote convenience, and end-to-end guidance.
                </p>

                <div className="mt-8 grid sm:grid-cols-2 gap-3.5">
                  {DEFENCE_CHECKLIST.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.03] border border-white/5 hover:border-[var(--gold)]/30 hover:bg-white/[0.05] transition-all duration-300"
                    >
                      <div className="w-6 h-6 rounded-lg bg-[var(--gold)]/15 border border-[var(--gold)]/30 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-[var(--gold)]" />
                      </div>
                      <span className="text-white/80 text-xs sm:text-sm font-medium">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Testimonials ─────────────────────────────── */}
      <section className="section-py bg-[var(--bg)]">
        <div className="container-site">
          <p className="text-center text-[var(--text-muted)] text-xs font-semibold tracking-[0.15em] uppercase mb-2">
            What Our Clients Say
          </p>
          <div className="h-px bg-[var(--gold)] w-16 mx-auto mb-10" />
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="bg-white border border-[var(--border)] rounded-lg p-6 relative">
                <span className="font-serif text-5xl text-[var(--gold)] leading-none absolute top-4 left-5">&ldquo;</span>
                <p className="text-sm text-[var(--text-muted)] leading-relaxed mt-6 mb-4 italic">
                  {t.text}
                </p>
                <p className="text-xs font-semibold text-[var(--text)]">— {t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}