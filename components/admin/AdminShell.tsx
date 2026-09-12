"use client";

import { useState, useCallback, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Building2,
  CalendarDays,
  Phone,
  LogOut,
  Menu,
  Users,
  UserCog,
  MessageSquare,
} from "lucide-react";
import { logoutAction } from "@/app/actions/auth";
import { getAdminRole } from "@/lib/actions/admin-actions";

interface AdminShellProps {
  children: React.ReactNode;
  adminEmail: string;
}

const NAV_ITEMS = [
  {
    label: "Properties",
    href: "/admin/properties",
    icon: Building2,
  },
  {
    label: "Consultations",
    href: "/admin/consultations",
    icon: CalendarDays,
  },
  {
    label: "Callbacks",
    href: "/admin/callbacks",
    icon: Phone,
  },
  {
    label: "Inquiries",
    href: "/admin/inquiries",
    icon: MessageSquare,
  },
] as const;

export default function AdminShell({ children, adminEmail }: AdminShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [adminRole, setAdminRole] = useState<string | null>(null);

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  useEffect(() => {
    getAdminRole().then(setAdminRole);
  }, []);

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

      {/* Sidebar — collapsed by default, expands on hover (fixed, overlays content) */}
      <aside
        className={`group/sidebar fixed inset-y-0 left-0 z-50 w-[68px] hover:w-[260px] bg-[var(--navy)] flex flex-col transition-all duration-300 ease-in-out ${
          sidebarOpen ? "!w-[260px] translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="px-4 pt-5 pb-5 flex items-center justify-center group-hover/sidebar:justify-start group-hover/sidebar:px-6 group-hover/sidebar:pt-7 group-hover/sidebar:pb-6">
          <Link href="/admin/properties" onClick={closeSidebar} className="block overflow-hidden">
            <Image
              src="/images/logo/pf-logo.webp"
              alt="Property Fifth"
              width={160}
              height={60}
              className="h-10 w-auto group-hover/sidebar:h-14"
              priority
            />
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 group-hover/sidebar:px-3 space-y-1">
          {NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={closeSidebar}
                title={item.label}
                className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                  active
                    ? "bg-[var(--gold)]/15 text-[var(--gold)]"
                    : "text-white/60 hover:text-white hover:bg-white/5"
                }`}
              >
                <item.icon className="w-5 h-5 shrink-0" />
                <span className="whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        {/* Bottom section — always visible */}
        <div className="px-2 group-hover/sidebar:px-3 pb-4 space-y-1 border-t border-white/10 pt-3">
          {adminRole === "SUPER_ADMIN" && (
            <Link
              href="/admin/accounts"
              onClick={closeSidebar}
              title="Admin Accounts"
              className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
                isActive("/admin/accounts")
                  ? "bg-[var(--gold)]/15 text-[var(--gold)]"
                  : "text-white/60 hover:text-white hover:bg-white/5"
              }`}
            >
              <Users className="w-5 h-5 shrink-0" />
              <span className="whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
                Admin Accounts
              </span>
            </Link>
          )}
          <Link
            href="/admin/account"
            onClick={closeSidebar}
            title="Account Settings"
            className={`flex items-center gap-3 px-3 py-3 rounded-lg text-sm font-medium transition-colors ${
              isActive("/admin/account")
                ? "bg-[var(--gold)]/15 text-[var(--gold)]"
                : "text-white/60 hover:text-white hover:bg-white/5"
            }`}
          >
            <UserCog className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
              Account Settings
            </span>
          </Link>

          {/* Divider */}
          <div className="border-t border-white/10 my-2 group-hover/sidebar:my-0 group-hover/sidebar:border-t group-hover/sidebar:mt-2 group-hover/sidebar:pt-3" />

          {/* Logout */}
          <button
            onClick={handleLogout}
            title="Logout"
            className="flex items-center gap-3 w-full px-3 py-3 rounded-lg text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors cursor-pointer"
          >
            <LogOut className="w-5 h-5 shrink-0" />
            <span className="whitespace-nowrap opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
              Logout
            </span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden lg:ml-[68px]">
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
            <div className="hidden sm:block text-right">
              <p className="text-xs text-gray-500">{adminEmail}</p>
              <p className={`text-[0.65rem] font-medium ${adminRole === "SUPER_ADMIN" ? "text-amber-600" : "text-gray-400"}`}>{adminRole === "SUPER_ADMIN" ? "Super Admin" : "Admin"}</p>
            </div>
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
