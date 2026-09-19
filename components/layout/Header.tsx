"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, Menu, X, Bookmark, Shield } from "lucide-react";
import { useCustomer } from "@/components/providers/customer-context";

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/properties", label: "Properties" },
  { href: "/services", label: "Services" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact" },
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const isHome = pathname === "/";
  const { customer, isComplete, isLoading, openDialog } = useCustomer();
  const isDefence = customer?.category === "DEFENCE_PERSONNEL";
  const pendingNav = useRef<string | null>(null);
  const [savedCount, setSavedCount] = useState(0);

  useEffect(() => {
    if (!isComplete) return;
    fetch("/api/customer/saved-properties")
      .then((res) => res.json())
      .then((data) => setSavedCount(data.count || 0))
      .catch(() => {});
  }, [isComplete]);

  useEffect(() => {
    function onScroll() {
      setScrolled(window.scrollY > 50);
    }
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (isComplete && pendingNav.current) {
      const target = pendingNav.current;
      pendingNav.current = null;
      router.push(target);
    }
  }, [isComplete, router]);

  const prevPathname = useRef(pathname);
  useEffect(() => {
    if (prevPathname.current !== pathname) {
      setMobileOpen(false);
      prevPathname.current = pathname;
    }
  }, [pathname]);

  function isActive(href: string) {
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  }

  const showSolid = !isHome || scrolled;

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-200 ease-out ${
        showSolid
          ? "bg-primary shadow-lg shadow-primary/20"
          : "bg-transparent"
      }`}
    >
      <div className="container-site flex items-center justify-between h-16 lg:h-[4.5rem]">
        
        {/* Logo Section (Cleaned & High Contrast) */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <img
            src="/images/logo/pf-logo-notext.webp"
            alt="Property Fifth"
            className="h-10 lg:h-11 w-auto object-contain transition-transform duration-200 group-hover:scale-[1.03]"
          />
          <div className="hidden sm:block leading-tight border-l border-accent/30 pl-3">
            <span className="block font-serif text-sm font-bold tracking-[0.18em] text-transparent bg-clip-text bg-gradient-to-r from-gold-light via-accent to-gold-light">
              PROPERTY FIFTH
            </span>
            <span className="block text-[0.55rem] tracking-[0.16em] text-inverse-muted font-medium uppercase mt-0.5">
              Premium Advisory. Perfect Guidance.
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-7" aria-label="Primary">
          {NAV_LINKS.map((link) =>
            link.href === "/properties" ? (
              <button
                key={link.href}
                onClick={() => {
                  if (isLoading) return;
                  if (isComplete) {
                    router.push(link.href);
                  } else {
                    pendingNav.current = link.href;
                    openDialog();
                  }
                }}
                className={`relative text-[0.8rem] font-semibold tracking-wider uppercase transition-colors duration-200 cursor-pointer pb-1.5 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:rounded-full after:bg-accent after:transition-all after:duration-200 ${
                  isActive(link.href)
                    ? "text-accent after:w-full"
                    : "text-inverse-muted hover:text-inverse after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[0.8rem] font-semibold tracking-wider uppercase transition-colors duration-200 pb-1.5 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:rounded-full after:bg-accent after:transition-all after:duration-200 ${
                  isActive(link.href)
                    ? "text-accent after:w-full"
                    : "text-inverse-muted hover:text-inverse after:w-0 hover:after:w-full"
                }`}
              >
                {link.label}
              </Link>
            )
          )}
          {isDefence && (
            <Link
              href="/defence"
              className={`relative text-[0.8rem] font-semibold tracking-wider uppercase transition-colors duration-200 flex items-center gap-1.5 pb-1.5 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:rounded-full after:bg-accent after:transition-all after:duration-200 ${
                isActive("/defence")
                  ? "text-accent after:w-full"
                  : "text-inverse-muted hover:text-inverse after:w-0 hover:after:w-full"
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-accent" />
              Defence
            </Link>
          )}
          {savedCount > 0 && (
            <Link
              href="/saved-properties"
              className={`relative text-[0.8rem] font-semibold tracking-wider uppercase transition-colors duration-200 flex items-center gap-1.5 pb-1.5 after:absolute after:left-0 after:bottom-0 after:h-[2px] after:rounded-full after:bg-accent after:transition-all after:duration-200 ${
                isActive("/saved-properties")
                  ? "text-accent after:w-full"
                  : "text-inverse-muted hover:text-inverse after:w-0 hover:after:w-full"
              }`}
            >
              <Bookmark className="w-3.5 h-3.5" />
              Saved
            </Link>
          )}
        </nav>

        {/* Desktop CTA */}
        <button
          onClick={() => {
            if (isLoading) return;
            if (isComplete) {
              router.push("/consultation");
            } else {
              pendingNav.current = "/consultation";
              openDialog();
            }
          }}
          className="hidden lg:inline-flex items-center justify-center gap-2 min-h-[2.75rem] bg-gradient-to-r from-accent to-accent-strong hover:from-gold-light hover:to-accent text-primary font-bold rounded-lg text-[0.72rem] tracking-wide uppercase px-5 cursor-pointer shadow-md shadow-accent/20 transition-all duration-200 hover:-translate-y-px hover:shadow-lg active:translate-y-0 active:scale-[0.99]"
        >
          <Calendar className="w-3.5 h-3.5" />
          Book Consultation
        </button>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-lg text-inverse hover:bg-inverse/10 transition-colors duration-200"
          aria-label="Toggle menu"
          aria-expanded={mobileOpen}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-overlay-deep/95 backdrop-blur-md border-t border-accent/20 animate-fade-in">
          <nav className="container-site flex flex-col py-4 gap-1">
            {NAV_LINKS.map((link) =>
              link.href === "/properties" ? (
                <button
                  key={link.href}
                  onClick={() => {
                    setMobileOpen(false);
                    if (isLoading) return;
                    if (isComplete) {
                      router.push(link.href);
                    } else {
                      pendingNav.current = link.href;
                      openDialog();
                    }
                  }}
                  className={`py-3 px-3 rounded-lg text-sm font-medium tracking-wide transition-colors text-left cursor-pointer ${
                    isActive(link.href)
                      ? "text-accent bg-inverse/5"
                      : "text-inverse-muted hover:text-inverse hover:bg-inverse/5"
                  }`}
                >
                  {link.label}
                </button>
              ) : (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={`py-3 px-3 rounded-lg text-sm font-medium tracking-wide transition-colors ${
                    isActive(link.href)
                      ? "text-accent bg-inverse/5"
                      : "text-inverse-muted hover:text-inverse hover:bg-inverse/5"
                  }`}
                >
                  {link.label}
                </Link>
              )
            )}
            {isDefence && (
              <Link
                href="/defence"
                onClick={() => setMobileOpen(false)}
                className={`py-3 px-3 rounded-lg text-sm font-medium tracking-wide transition-colors flex items-center gap-2 ${
                  isActive("/defence")
                    ? "text-accent bg-inverse/5"
                    : "text-inverse-muted hover:text-inverse hover:bg-inverse/5"
                }`}
              >
                <Shield className="w-4 h-4 text-accent" />
                Defence Community
              </Link>
            )}
            {savedCount > 0 && (
              <Link
                href="/saved-properties"
                onClick={() => setMobileOpen(false)}
                className={`py-3 px-3 rounded-lg text-sm font-medium tracking-wide transition-colors flex items-center gap-2 ${
                  isActive("/saved-properties")
                    ? "text-accent bg-inverse/5"
                    : "text-inverse-muted hover:text-inverse hover:bg-inverse/5"
                }`}
              >
                <Bookmark className="w-4 h-4" />
                Saved Properties
              </Link>
            )}
            <button
              onClick={() => {
                setMobileOpen(false);
                if (isLoading) return;
                if (isComplete) {
                  router.push("/consultation");
                } else {
                  pendingNav.current = "/consultation";
                  openDialog();
                }
              }}
              className="mt-3 min-h-[2.75rem] bg-gradient-to-r from-accent to-accent-strong text-primary font-bold text-center text-[0.72rem] tracking-wide uppercase py-3 inline-flex items-center justify-center gap-2 cursor-pointer w-full rounded-lg shadow-md transition-all duration-200 active:scale-[0.99]"
            >
              <Calendar className="w-3.5 h-3.5" />
              Book Consultation
            </button>
          </nav>
        </div>
      )}
    </header>
  );
}