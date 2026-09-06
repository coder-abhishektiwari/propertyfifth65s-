import Link from "next/link";
import { MapPin, Phone, Mail, Globe, ArrowRight } from "lucide-react";

const QUICK_LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

const SERVICES = [
  "Property Advisory",
  "Investment Advisory",
  "Portfolio Assistance",
  "Developer Partnerships",
];

const LOCATIONS = ["Dubai", "Delhi NCR", "Gurgaon", "Greater Noida"];

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  );
}

function LinkedinIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  );
}

const SOCIALS = [
  { Icon: FacebookIcon, href: "#", label: "Facebook" },
  { Icon: InstagramIcon, href: "#", label: "Instagram" },
  { Icon: LinkedinIcon, href: "#", label: "LinkedIn" },
  { Icon: YoutubeIcon, href: "#", label: "YouTube" },
];

export default function Footer() {
  return (
    <footer>
      {/* CTA Banner */}
      <div className="relative overflow-hidden">
        <img
          src="/images/common/cta-bg.jpg"
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
        <div className="relative container-site py-10 lg:py-14 flex flex-col lg:flex-row items-center justify-between gap-6">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl lg:text-3xl font-serif font-bold text-[var(--navy)]">
              Let&apos;s Find the <span className="text-[var(--gold)]">Right</span>
              <br />
              Property for You.
            </h2>
            <p className="text-sm text-[var(--text-muted)] mt-2">
              Book a confidential consultation with our experts today.
            </p>
          </div>
          <div className="flex flex-col items-center gap-3 shrink-0">
            <Link href="/consultation" className="btn-primary">
              Book Your Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href="tel:+919877155088"
              className="flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-md text-[var(--navy)] font-semibold text-sm hover:shadow-lg transition-shadow"
            >
              <Phone className="w-4 h-4" />
              +91 98771 55088
            </a>
          </div>
        </div>
      </div>

      {/* Main Footer */}
      <div className="bg-[var(--navy-dark)]">
        <div className="container-site py-10 lg:py-16">
          {/* Brand — mobile: full width above grid, desktop: inside grid */}
          <div className="text-center sm:text-left mb-8 lg:hidden">
            <Link href="/" className="inline-block mb-3">
              <img
                src="/images/logo/pf-logo.png"
                alt="Property Fifth"
                className="h-16 mx-auto sm:mx-0"
              />
            </Link>
            <p className="text-[0.7rem] leading-relaxed text-white/50 mb-4 max-w-[200px] mx-auto sm:mx-0">
              Premium real estate advisory committed to helping you find spaces that define your future.
            </p>
            <div className="flex items-center gap-3 justify-center sm:justify-start">
              {SOCIALS.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
                >
                  <s.Icon className="w-3.5 h-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Links grid — mobile: 2x2, desktop: brand + 4 cols = 5 cols */}
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-6 lg:gap-8">
            {/* Brand — desktop only */}
            <div className="hidden lg:block">
              <Link href="/" className="inline-block mb-3">
                <img
                  src="/images/logo/pf-logo.png"
                  alt="Property Fifth"
                  className="h-20"
                />
              </Link>
              <p className="text-[0.7rem] leading-relaxed text-white/50 mb-4 max-w-[200px]">
                Premium real estate advisory committed to helping you find spaces that define your future.
              </p>
              <div className="flex items-center gap-3">
                {SOCIALS.map((s) => (
                  <a
                    key={s.label}
                    href={s.href}
                    aria-label={s.label}
                    className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center text-white/50 hover:text-[var(--gold)] hover:border-[var(--gold)] transition-colors"
                  >
                    <s.Icon className="w-3.5 h-3.5" />
                  </a>
                ))}
              </div>
            </div>

            {/* Quick Links */}
            <div className="text-center sm:text-left">
              <h4 className="text-[0.65rem] font-bold tracking-[0.15em] text-white uppercase mb-3">
                Quick Links
              </h4>
              <ul className="space-y-1.5">
                {QUICK_LINKS.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-white/60 hover:text-[var(--gold)] transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div className="text-center sm:text-left">
              <h4 className="text-[0.65rem] font-bold tracking-[0.15em] text-white uppercase mb-3">
                Services
              </h4>
              <ul className="space-y-1.5">
                {SERVICES.map((s) => (
                  <li key={s}>
                    <Link
                      href="/services"
                      className="text-sm text-white/60 hover:text-[var(--gold)] transition-colors"
                    >
                      {s}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Locations */}
            <div className="text-center sm:text-left">
              <h4 className="text-[0.65rem] font-bold tracking-[0.15em] text-white uppercase mb-3">
                Popular Locations
              </h4>
              <ul className="space-y-1.5">
                {LOCATIONS.map((l) => (
                  <li key={l}>
                    <Link
                      href="/properties"
                      className="text-sm text-white/60 hover:text-[var(--gold)] transition-colors"
                    >
                      {l}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Contact */}
            <div className="text-center sm:text-left">
              <h4 className="text-[0.65rem] font-bold tracking-[0.15em] text-white uppercase mb-3">
                Get In Touch
              </h4>
              <ul className="space-y-2.5">
                <li className="flex items-start gap-2 justify-center sm:justify-start">
                  <MapPin className="w-3.5 h-3.5 text-[var(--gold)] mt-0.5 shrink-0" />
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=30.6613276,76.8350666"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-white/60 hover:text-[var(--gold)] transition-colors leading-relaxed text-center sm:text-left"
                  >
                    #27, Level - II, Corporate Complex, CITY COURT, Near Kalka Highway, Panchkula (Chandigarh)
                  </a>
                </li>
                <li className="flex items-start gap-2 justify-center sm:justify-start">
                  <Phone className="w-3.5 h-3.5 text-[var(--gold)] shrink-0 mt-0.5" />
                  <div className="flex flex-col text-xs text-white/60">
                    <a href="tel:+919877155088" className="hover:text-[var(--gold)] transition-colors">
                      +91 98771 55088
                    </a>
                    <a href="tel:01762409555" className="hover:text-[var(--gold)] transition-colors">
                      01762 409555 <span className="text-[0.6rem] text-white/40">(Landline)</span>
                    </a>
                  </div>
                </li>
                <li className="flex items-center gap-2 justify-center sm:justify-start">
                  <Mail className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                  <a href="mailto:propertyfifth@dsssolutions.in" className="text-xs text-white/60 hover:text-[var(--gold)] transition-colors">
                    propertyfifth@dsssolutions.in
                  </a>
                </li>
                <li className="flex items-center gap-2 justify-center sm:justify-start">
                  <Globe className="w-3.5 h-3.5 text-[var(--gold)] shrink-0" />
                  <a href="https://dsssolutions.in" target="_blank" rel="noopener noreferrer" className="text-xs text-white/60 hover:text-[var(--gold)] transition-colors">
                    dsssolutions.in
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/10">
          <div className="container-site py-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <p className="text-[0.65rem] text-white/40 text-center sm:text-left">
              &copy; 2024 Property Fifth. All Rights Reserved.
            </p>
            <p className="text-[0.65rem] text-white/40 text-center sm:text-right">
              A Real Estate Initiative by DSS Solutions.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
