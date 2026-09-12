import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    const idsParam = request.nextUrl.searchParams.get("ids");
    if (!idsParam) {
      return NextResponse.json({ error: "No property IDs provided" }, { status: 400 });
    }

    const ids = idsParam.split(",").filter(Boolean);
    if (ids.length === 0) {
      return NextResponse.json({ properties: [] });
    }

    const properties = await db.property.findMany({
      where: { id: { in: ids } },
      select: {
        id: true,
        name: true,
        slug: true,
        city: true,
        locality: true,
        configuration: true,
        priceMin: true,
        priceLabel: true,
        propertyType: true,
        status: true,
        images: {
          where: { isCover: true },
          take: 1,
          select: { imageUrl: true },
        },
      },
    });

    const result = properties.map((p) => ({
      ...p,
      coverImage: p.images[0]?.imageUrl ?? null,
      images: undefined,
    }));

    return NextResponse.json({ properties: result });
  } catch {
    return NextResponse.json({ properties: [] });
  }
}
