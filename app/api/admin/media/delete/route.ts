import { NextRequest, NextResponse } from "next/server";
import { getAdminIdFromSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  deletePropertyImage,
  deletePropertyBrochure,
} from "@/lib/storage/property-storage";

export async function POST(request: NextRequest) {
  try {
    const adminId = await getAdminIdFromSession();
    if (!adminId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const body = await request.json();
    const { imageId, propertyId, type } = body;

    if (!propertyId || !type) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const property = await db.property.findUnique({
      where: { id: propertyId },
      select: { id: true, slug: true },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (type === "image") {
      if (!imageId) {
        return NextResponse.json({ error: "Missing image ID" }, { status: 400 });
      }

      const image = await db.propertyImage.findUnique({
        where: { id: imageId },
        select: { id: true, propertyId: true, imageUrl: true, isCover: true },
      });

      if (!image || image.propertyId !== propertyId) {
        return NextResponse.json({ error: "Image not found" }, { status: 404 });
      }

      const filename = image.imageUrl.split("/").pop();
      if (filename) {
        await deletePropertyImage(`${property.slug}/images/${filename}`);
      }

      await db.propertyImage.delete({ where: { id: imageId } });

      if (image.isCover) {
        const nextCover = await db.propertyImage.findFirst({
          where: { propertyId },
          orderBy: { sortOrder: "asc" },
        });
        if (nextCover) {
          await db.propertyImage.update({
            where: { id: nextCover.id },
            data: { isCover: true },
          });
        }
      }

      return NextResponse.json({ success: true });
    }

    if (type === "brochure") {
      const prop = await db.property.findUnique({
        where: { id: propertyId },
        select: { brochureUrl: true },
      });

      if (!prop?.brochureUrl) {
        return NextResponse.json({ error: "No brochure to delete" }, { status: 404 });
      }

      const parts = prop.brochureUrl.split("/");
      const slug = parts[2];
      const filename = parts[parts.length - 1];
      if (slug && filename) {
        await deletePropertyBrochure(`${slug}/brochure/${filename}`);
      }

      await db.property.update({
        where: { id: propertyId },
        data: {
          brochureUrl: null,
          brochureName: null,
          brochureSize: null,
        },
      });

      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: "Invalid delete type" }, { status: 400 });
  } catch (error) {
    console.error("Admin media delete error:", error);
    return NextResponse.json(
      { error: "Delete failed. Please try again." },
      { status: 500 }
    );
  }
}
