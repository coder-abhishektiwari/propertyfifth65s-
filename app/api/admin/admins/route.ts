import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminIdFromSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const adminId = await getAdminIdFromSession();
    if (!adminId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const admins = await db.admin.findMany({
      select: { id: true, name: true, email: true, createdAt: true },
      orderBy: { createdAt: "asc" },
    });

    if (admins.length === 0) {
      return NextResponse.json({ admins: [] });
    }

    const firstAdminId = admins[0].id;

    const adminsWithRole = admins.map((a) => ({
      ...a,
      role: a.id === firstAdminId ? "SUPER_ADMIN" : "ADMIN",
    })).reverse();

    return NextResponse.json({ admins: adminsWithRole });
  } catch {
    return NextResponse.json({ admins: [] });
  }
}
