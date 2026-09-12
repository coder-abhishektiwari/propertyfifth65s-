"use client";

import { useState, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  CalendarDays,
  Phone,
  LogOut,
  Menu,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";

interface AdminShellProps {
  children: React.ReactNode;
  adminEmail: string;
}

const NAV_ITEMS = [
  {
    label: "Property Management",
    href: "/admin/properties",
    icon: Building2,
  },
  {
    label: "Consultation Requests",
    href: "/admin/consultations",
    icon: CalendarDays,
  },
  {
    label: "Call Back Requests\n(For a Property)",
    href: "/admin/callbacks",
    icon: Phone,
  },
] as const;

export default function AdminShell({ children, adminEmail }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + "/");
  }

  function handleLogout() {
    logoutAction().then(() => {
      router.push("/admin/login");
    });
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={closeSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-[var(--navy)] flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Logo */}
        <div className="px-6 pt-7 pb-6">
          <Link href="/admin/properties" onClick={closeSidebar}>
            <Image
              src="/images/logo/pf-logo.webp"
              alt="Property Fifth"
              width={160}
              height={60}
              className="h-14 w-auto"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--gold)]/15 text-[var(--gold)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="whitespace-pre-line leading-tight">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom: Security Notice + Admin Info */}
        <div className="px-4 pb-5 space-y-4">
          <div className="px-3">
            <p className="text-xs font-semibold text-white">Admin</p>
            <p className="text-[0.65rem] text-white/40 truncate">
              {adminEmail}
            </p>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 sm:px-6 shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5 text-gray-600" />
            </button>
            <h1 className="text-sm sm:text-base font-serif font-bold text-[var(--navy)]">
              Property Fifth Admin Portal
            </h1>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-xs text-gray-500">
              {adminEmail}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-600 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
