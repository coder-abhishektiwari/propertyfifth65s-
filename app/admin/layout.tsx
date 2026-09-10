import { getAdminIdFromSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import AdminShell from "@/components/admin/AdminShell";

export const metadata = {
  title: "Admin — Property Fifth",
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const adminId = await getAdminIdFromSession();

  if (!adminId) {
    return <>{children}</>;
  }

  const admin = await db.admin.findUnique({
    where: { id: adminId },
    select: { email: true },
  });

  if (!admin) {
    return <>{children}</>;
  }

  return <AdminShell adminEmail={admin.email}>{children}</AdminShell>;
}
