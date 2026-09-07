import { NextRequest, NextResponse } from "next/server";
import fs from "fs/promises";
import { resolveMediaPath, getBrochureContentType } from "@/lib/storage/property-storage";
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

  const filePath = await resolveMediaPath("brochure", slug, filename);
  if (!filePath) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  try {
    const buffer = await fs.readFile(filePath);
    const contentType = getBrochureContentType();
    const displayName = property.brochureName || "brochure.pdf";

    return new NextResponse(buffer, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Disposition": `inline; filename="${displayName}"`,
        "Cache-Control": "public, max-age=86400, s-maxage=604800",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
}
