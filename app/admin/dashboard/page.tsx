import { redirect } from "next/navigation";
import { getAdminIdFromSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import LogoutButton from "@/components/logout-button";

export const metadata = {
  title: "Admin Dashboard — Property Fifth",
};

export default async function AdminDashboardPage() {
  const adminId = await getAdminIdFromSession();
  if (!adminId) {
    redirect("/admin/login");
  }

  const admin = await db.admin.findUnique({
    where: { id: adminId },
    select: { email: true },
  });

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-[#0a1628] text-white px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo/pf-logo.png"
            alt="Property Fifth"
            className="h-8 brightness-0 invert"
          />
          <span className="font-serif font-bold tracking-wide text-amber-400">
            PROPERTY FIFTH
          </span>
          <span className="text-xs text-white/50 tracking-wider uppercase ml-2">
            Admin
          </span>
        </div>
        <LogoutButton />
      </header>

      <main className="max-w-4xl mx-auto py-12 px-6">
        <h1 className="text-2xl font-serif font-bold text-[#0a1628] mb-2">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mb-8">
          Logged in as <span className="font-medium text-[#0a1628]">{admin.email}</span>
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Property Management</h2>
            <p className="text-xs text-gray-400">Coming soon</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Consultation Requests</h2>
            <p className="text-xs text-gray-400">Coming soon</p>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-sm font-medium text-gray-500 mb-1">Callback Requests</h2>
            <p className="text-xs text-gray-400">Coming soon</p>
          </div>
        </div>
      </main>
    </div>
  );
}
