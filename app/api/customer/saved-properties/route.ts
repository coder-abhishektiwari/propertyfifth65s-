import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

async function getCustomerFromCookie() {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get("visitorId")?.value;
  if (!visitorId) return null;
  const customer = await db.customer.findUnique({
    where: { visitorId },
    select: { id: true, name: true },
  });
  return customer;
}

export async function GET() {
  try {
    const customer = await getCustomerFromCookie();
    if (!customer) {
      return NextResponse.json({ count: 0, properties: [] });
    }

    const saved = await db.savedProperty.findMany({
      where: { customerId: customer.id },
      include: {
        property: {
          include: {
            images: { where: { isCover: true }, take: 1 },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const properties = saved.map((s) => ({
      id: s.property.id,
      name: s.property.name,
      slug: s.property.slug,
      city: s.property.city,
      locality: s.property.locality,
      configuration: s.property.configuration,
      priceMin: s.property.priceMin ? Number(s.property.priceMin) : null,
      priceLabel: s.property.priceLabel,
      propertyType: s.property.propertyType,
      status: s.property.status,
      coverImage: s.property.images[0]?.imageUrl || null,
      savedAt: s.createdAt,
    }));

    return NextResponse.json({ count: properties.length, properties, customerName: customer.name || null }, { headers: { "Cache-Control": "private, no-store" } });
  } catch {
    return NextResponse.json({ count: 0, properties: [] });
  }
}
