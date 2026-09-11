import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { resolveMediaPath, getImageContentType } from "@/lib/storage/property-storage";
import { getPropertyBySlug } from "@/lib/properties";

interface RouteParams {
  params: Promise<{ slug: string; filename: string }>;
}

export async function GET(_request: NextRequest, { params }: RouteParams) {
  const { slug, filename } = await params;

  const property = await getPropertyBySlug(slug);
  if (!property || !property.published) {
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
        "Cache-Control": "public, max-age=604800, s-maxage=604800, stale-while-revalidate=86400",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
