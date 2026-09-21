import Link from "next/link";
import Image from "next/image";
import {
import {
  ArrowRight,
  Shield,
  Check,
  Building2,
  TrendingUp,
  Briefcase,
  Handshake,
  Calendar,
  MessageCircle,
  Newspaper,
  Bell,
  Users,
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
      <section className="hero-section relative min-h-screen flex items-center justify-center overflow-hidden bg-primary pt-16 lg:pt-[4.5rem]">
        <div className="hero-overlay absolute inset-0 z-10" />

        <div className="relative z-20 container-site py-20 lg:py-22 flex items-center">
          <div className="max-w-xl">
            <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-4">
              Premium Properties. Trusted Advisory.
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-inverse leading-[1.15]">
              Discover Properties
              <br />
              That Match
              <br />
              <span className="text-accent">Your Mission.</span>
            </h1>
            <p className="mt-5 text-inverse-muted text-sm leading-relaxed max-w-md">
              Premium Real Estate Opportunities , strategic investments and trusted advisory - thoughtfully curated for defence personnel, veterans and their families
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <IdentityGate href="/properties" className="btn-primary inline-flex items-center gap-2">
                Explore Properties
                <ArrowRight className="w-4 h-4" />
              </IdentityGate>
              <IdentityGate href="/consultation" className="hidden lg:inline-flex items-center justify-center gap-2 min-h-[2.75rem] bg-gradient-to-r from-accent to-accent-strong hover:from-gold-light hover:to-accent text-primary font-bold rounded-lg text-[0.8rem] tracking-wide uppercase px-5 cursor-pointer shadow-md shadow-accent/20 transition-all duration-200 hover:-translate-y-px hover:shadow-lg active:translate-y-0 active:scale-[0.99]">
                <Calendar className="w-3.5 h-3.5" />

                Book a Consultation
              </IdentityGate>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Properties (Auto Sliding Carousel) ───────────────────────── */}
      <section className="section-py bg-background">
        <div className="container-site">
          <div className="flex items-end justify-between mb-8">
            <div>
              <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-1">
                Exceptional Properties. Extraordinary Living.
              </p>
              <h2 className="heading-lg">Featured Opportunity</h2>
            </div>
            <IdentityGate
              href="/properties"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider uppercase text-primary hover:text-accent transition-colors"
            >
              View All Properties
              <ArrowRight className="w-4 h-4" />
            </IdentityGate>
          </div>

          <FeaturedPropertiesCarousel properties={featuredProperties} />
        </div>
      </section>

      {/* ─── Why Choose Property Fifth ─────────────────── */}
      <section className="section-py bg-muted">
        <div className="container-site">
          <p className="eyebrow text-center mb-2">
            Why Choose Property Fifth?
          </p>
          <div className="h-px bg-accent w-16 mx-auto mb-10" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {REASONS.map((r) => (
              <div key={r.num} className="card-premium p-6 text-center">
                <span className="font-serif text-4xl lg:text-5xl font-bold text-accent leading-none tracking-tight">
                  {r.num}
                </span>
                <h3 className="font-serif text-sm font-bold mt-3 mb-2 text-foreground">{r.title}</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Our Services ─────────────────────────────── */}
      <section className="section-py bg-background">
        <div className="container-site">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">
            <div>
              <p className="text-muted-foreground text-xs font-semibold tracking-[0.15em] uppercase mb-2">
                Our Services
              </p>
              <h2 className="heading-lg">
                Solutions That
                <br />
                Move You <span className="text-accent">Forward.</span>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
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
                  className="card-premium p-6"
                >
                  <div className="w-11 h-11 rounded-xl bg-accent text-inverse flex items-center justify-center mb-4 shadow-sm">
                    <s.icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-serif text-sm font-bold mb-2">{s.title}</h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── Featured Locations ────────────────────────── */}
      <section className="section-py bg-muted">
        <div className="container-site">
          <div className="grid lg:grid-cols-[1fr_2fr] gap-10 lg:gap-16 items-start">
            <div>
              <p className="eyebrow mb-2">
                Featured Locations
              </p>
              <h2 className="heading-lg">
                Prime Locations.
                <br />
                Promising <span className="text-accent">Futures.</span>
              </h2>
              <p className="mt-3 text-sm text-muted-foreground leading-relaxed max-w-xs">
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
                    className="group relative rounded-xl overflow-hidden h-44 block text-left border border-border shadow hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                  >
                    <Image
                      src={loc.image}
                      alt={loc.name}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover group-hover:scale-[1.04] transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-scrim via-scrim-soft/20 to-transparent z-10" />
                    <div className="absolute bottom-0 left-0 p-3 z-20">
                      <h3 className="text-inverse text-xs font-bold tracking-wider uppercase">{loc.name}</h3>
                      <p className="text-inverse-muted text-[0.65rem] mt-0.5">{loc.subtitle}</p>
                    </div>
                  </IdentityGate>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Defence Community ───────────────────────────── */}
<section className="section-py bg-background">
  <div className="container-site">
    <div className="grid lg:grid-cols-[0.9fr_1.1fr] gap-10 lg:gap-16 items-center">

      {/* Left Content */}
      <div>
        <p className="text-accent text-xs font-semibold tracking-[0.2em] uppercase mb-3">
          Defence Community
        </p>

        <div className="h-px bg-accent w-12 mb-6" />

        <h2 className="heading-lg leading-tight">
          Connect with a
          <br />
          Community That{" "}
          <span className="text-accent">
            Understands You.
          </span>
        </h2>

        <p className="mt-4 text-sm text-muted-foreground leading-relaxed max-w-md">
          A dedicated space for Defence personnel, veterans and their
          families to discuss, share and stay updated on topics that matter.
        </p>

        {/* Small Highlights */}
        <div className="mt-7 flex flex-wrap gap-y-4">

          <div className="flex items-center gap-2 pr-5 mr-5 border-r border-border">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-accent" />
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground">
                Discussions
              </p>
              <p className="text-[0.65rem] text-muted-foreground">
                Real conversations
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pr-5 mr-5 border-r border-border">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Newspaper className="w-4 h-4 text-accent" />
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground">
                Updates
              </p>
              <p className="text-[0.65rem] text-muted-foreground">
                Relevant information
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center">
              <Users className="w-4 h-4 text-accent" />
            </div>

            <div>
              <p className="text-xs font-semibold text-foreground">
                Community
              </p>
              <p className="text-[0.65rem] text-muted-foreground">
                Shared experiences
              </p>
            </div>
          </div>

        </div>

        {/* Single CTA */}
        <Link
          href="/defence"
          className="btn-primary mt-7 inline-flex items-center gap-2"
        >
          Explore Defence Community
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Right Content */}
      <div className="grid sm:grid-cols-2 gap-4">

        {/* Community Discussions */}
        <div className="card-premium p-6">
          <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
            <MessageCircle className="w-5 h-5 text-accent" />
          </div>

          <h3 className="font-serif text-sm font-bold mb-2 text-foreground">
            Community Discussions
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Participate in discussions, share your views and engage
            with the Defence community.
          </p>
        </div>

        {/* Defence Updates */}
        <div className="card-premium p-6">
          <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
            <Bell className="w-5 h-5 text-accent" />
          </div>

          <h3 className="font-serif text-sm font-bold mb-2 text-foreground">
            Defence Updates
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Stay updated with relevant Defence news, information
            and community updates.
          </p>
        </div>

        {/* Property Insights */}
        <div className="card-premium p-6">
          <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
            <Building2 className="w-5 h-5 text-accent" />
          </div>

          <h3 className="font-serif text-sm font-bold mb-2 text-foreground">
            Property Insights
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Discover property-related information and opportunities
            relevant to Defence families.
          </p>
        </div>

        {/* Community */}
        <div className="card-premium p-6">
          <div className="w-11 h-11 rounded-xl bg-accent/10 flex items-center justify-center mb-5">
            <Users className="w-5 h-5 text-accent" />
          </div>

          <h3 className="font-serif text-sm font-bold mb-2 text-foreground">
            Community Network
          </h3>

          <p className="text-xs text-muted-foreground leading-relaxed">
            Connect through shared conversations, experiences and
            interests within the community.
          </p>
        </div>

      </div>
    </div>
  </div>
</section>

      {/* ─── Defence Officers ──────────────────────────── */}
      <section className="relative bg-navy-dark overflow-hidden py-16 lg:py-24 border-y border-inverse/5">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-accent/5 blur-[120px] rounded-full pointer-events-none" />

        <div className="container-site relative z-10">
          <div className="bg-inverse/[0.02] rounded-2xl p-6 sm:p-8 lg:p-12 backdrop-blur-sm shadow-2xl">
            <div className="grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              <div className="lg:col-span-5 relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-accent/30 to-transparent rounded-2xl blur opacity-30 group-hover:opacity-60 transition duration-500" />
                <div className="relative rounded-xl overflow-hidden aspect-[4/5] w-full shadow-2xl">
                  <Image
                    src="/images/sections/defence-officers.webp"
                    alt="Defence Officers & Families"
                    fill
                    sizes="(max-width: 1024px) 100vw, 40vw"
                    className="object-cover transform group-hover:scale-105 transition duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy-dark/80 via-transparent to-transparent z-10" />

                  <div className="absolute bottom-4 left-4 right-4 p-3 bg-scrim-soft backdrop-blur-md rounded-lg flex items-center gap-3 z-20">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center shrink-0">
                      <Shield className="w-4 h-4 text-accent" />
                    </div>
                    <span className="text-xs font-medium text-inverse/90">
                      Trusted Advisory for Armed Forces
                    </span>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 flex flex-col justify-center">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent/10 w-fit mb-4">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  <span className="text-xs font-semibold uppercase tracking-wider text-accent">
                    Honor & Excellence
                  </span>
                </div>

                <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-inverse leading-tight">
                  A Dedicated Approach for{" "}
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-accent via-gold-light to-accent">
                    Defence Officers & Their Families
                  </span>
                </h2>

                <p className="mt-4 text-inverse-muted text-sm sm:text-base leading-relaxed max-w-xl">
                  We understand the core values of trust, discipline, and long-term planning.
                  Our specialized desk provides complete clarity, remote convenience, and end-to-end guidance.
                </p>

                <div className="mt-8 grid sm:grid-cols-2 gap-3.5">
                  {DEFENCE_CHECKLIST.map((item) => (
                    <div
                      key={item}
                      className="flex items-center gap-3 p-3 rounded-xl bg-inverse/[0.03] hover:bg-inverse/[0.05] transition-all duration-300"
                    >
                      <div className="w-6 h-6 rounded-lg bg-accent/15 border border-accent/30 flex items-center justify-center shrink-0">
                        <Check className="w-3.5 h-3.5 text-accent" />
                      </div>
                      <span className="text-inverse/80 text-xs sm:text-sm font-medium">
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
      <section className="section-py bg-background">
        <div className="container-site">
          <p className="eyebrow text-center mb-2">
            What Our Clients Say
          </p>
          <div className="h-px bg-accent w-16 mx-auto mb-10" />
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {TESTIMONIALS.map((t) => (
              <div key={t.author} className="bg-card border border-border rounded-lg p-6 relative">
                <span className="font-serif text-5xl text-accent leading-none absolute top-4 left-5">&ldquo;</span>
                <p className="text-sm text-muted-foreground leading-relaxed mt-6 mb-4 italic">
                  {t.text}
                </p>
                <p className="text-xs font-semibold text-foreground">— {t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
