"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Calendar, Menu, X } from "lucide-react";
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
  const { isComplete, isLoading, openDialog } = useCustomer();
  const pendingNav = useRef<string | null>(null);

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
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ease-in-out ${showSolid
          ? "bg-[var(--navy)]"
          : "bg-transparent"
        }`}
    >
      <div className="container-site flex items-center justify-between h-16 lg:h-[4.5rem]">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img
            src="/images/logo/pf-logo-notext.webp"
            alt="Property Fifth"
            className="h-10 lg:h-12"
          />
          <div className="hidden sm:block leading-tight">
            <span className="block font-serif text-sm font-bold tracking-wide text-white">
              PROPERTY FIFTH
            </span>
            <span className="block text-[0.55rem] tracking-[0.12em] text-white/50 uppercase">
              Premium Advisory. Perfect Guidance.
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-8">
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
                className={`relative text-[0.8rem] font-semibold tracking-wider uppercase transition-colors cursor-pointer ${
                  isActive(link.href)
                    ? "text-[var(--gold)]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-[var(--gold)]" />
                )}
              </button>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`relative text-[0.8rem] font-semibold tracking-wider uppercase transition-colors ${
                  isActive(link.href)
                    ? "text-[var(--gold)]"
                    : "text-white/80 hover:text-white"
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute -bottom-1.5 left-0 w-full h-0.5 bg-[var(--gold)]" />
                )}
              </Link>
            )
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
          className="hidden lg:inline-flex items-center gap-2 btn-gold text-[0.7rem] py-2.5 px-5 cursor-pointer"
        >
          <Calendar className="w-3.5 h-3.5" />
          Book Consultation
        </button>

        {/* Mobile Toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="lg:hidden text-white p-1"
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-[var(--navy)]/95 backdrop-blur-md border-t border-white/10 animate-fade-in">
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
                      ? "text-[var(--gold)] bg-white/5"
                      : "text-white/80 hover:text-white hover:bg-white/5"
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
                      ? "text-[var(--gold)] bg-white/5"
                      : "text-white/80 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              )
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
              className="mt-3 btn-gold text-center text-[0.7rem] py-3 inline-flex items-center justify-center gap-2 cursor-pointer w-full"
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