import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getAdminIdFromSession } from "@/lib/auth/session";

export async function GET() {
  try {
    const adminId = await getAdminIdFromSession();
    if (!adminId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const admin = await db.admin.findUnique({
      where: { id: adminId },
      select: { id: true, name: true, email: true },
    });

    if (!admin) {
      return NextResponse.json({ error: "Admin not found" }, { status: 404 });
    }

    const firstAdmin = await db.admin.findFirst({
      where: {},
      orderBy: { createdAt: "asc" },
      select: { id: true },
    });

    const role = admin.id === firstAdmin?.id ? "SUPER_ADMIN" : "ADMIN";

    return NextResponse.json({ admin: { ...admin, role } }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (e) {
    return NextResponse.json({ error: "Something went wrong", detail: String(e) }, { status: 500 });
  }
}
