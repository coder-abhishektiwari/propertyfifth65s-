import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cookies } from "next/headers";

async function getCustomerFromCookie() {
  const cookieStore = await cookies();
  const visitorId = cookieStore.get("visitorId")?.value;
  if (!visitorId) return null;
  const customer = await db.customer.findUnique({
    where: { visitorId },
    select: { id: true },
  });
  return customer;
}

export async function GET(request: NextRequest) {
  try {
    const customer = await getCustomerFromCookie();
    if (!customer) {
      return NextResponse.json({ saved: false });
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    if (!propertyId) {
      return NextResponse.json({ saved: false });
    }

    const existing = await db.savedProperty.findUnique({
      where: { customerId_propertyId: { customerId: customer.id, propertyId } },
    });

    return NextResponse.json({ saved: !!existing });
  } catch {
    return NextResponse.json({ saved: false });
  }
}

export async function POST(request: NextRequest) {
  try {
    const customer = await getCustomerFromCookie();
    if (!customer) {
      return NextResponse.json({ error: "Not authenticated", saved: false }, { status: 401 });
    }

    const { propertyId } = await request.json();
    if (!propertyId) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 });
    }

    const property = await db.property.findUnique({
      where: { id: propertyId },
      select: { id: true },
    });
    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    const existing = await db.savedProperty.findUnique({
      where: { customerId_propertyId: { customerId: customer.id, propertyId } },
    });

    if (existing) {
      await db.savedProperty.delete({ where: { id: existing.id } });
      return NextResponse.json({ saved: false });
    }

    await db.savedProperty.create({
      data: { customerId: customer.id, propertyId },
    });

    return NextResponse.json({ saved: true });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const customer = await getCustomerFromCookie();
    if (!customer) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const propertyId = searchParams.get("propertyId");
    if (!propertyId) {
      return NextResponse.json({ error: "Property ID required" }, { status: 400 });
    }

    const existing = await db.savedProperty.findUnique({
      where: { customerId_propertyId: { customerId: customer.id, propertyId } },
    });

    if (existing) {
      await db.savedProperty.delete({ where: { id: existing.id } });
    }

    return NextResponse.json({ saved: false });
  } catch {
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}
