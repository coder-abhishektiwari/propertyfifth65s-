import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { getAdminIdFromSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import { resolveMediaPath, getImageContentType } from "@/lib/storage/property-storage";

interface RouteParams {
  params: Promise<{ slug: string; filename: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const adminId = await getAdminIdFromSession();
  if (!adminId) {
    return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
  }

  const { slug, filename } = await params;

  const property = await db.property.findFirst({
    where: { slug },
    select: { id: true },
  });
  if (!property) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const filePath = await resolveMediaPath("images", slug, filename);
  if (!filePath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const buffer = await fs.readFile(filePath);
    const contentType = getImageContentType(filename);

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=3600",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
