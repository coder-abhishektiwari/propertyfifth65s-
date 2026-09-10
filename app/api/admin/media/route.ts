import { NextRequest, NextResponse } from "next/server";
import { getAdminIdFromSession } from "@/lib/auth/session";
import { db } from "@/lib/db";
import {
  savePropertyImage,
  savePropertyBrochure,
  isSafeSlug,
  ALLOWED_IMAGE_EXTENSIONS,
  ALLOWED_BROCHURE_EXTENSIONS,
} from "@/lib/storage/property-storage";

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const MAX_BROCHURE_SIZE = 25 * 1024 * 1024;

function isAllowedExt(filename: string, allowed: string[]): boolean {
  const ext =
    filename.lastIndexOf(".") >= 0
      ? filename.slice(filename.lastIndexOf(".")).toLowerCase()
      : "";
  return allowed.includes(ext);
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 200);
}

export async function POST(request: NextRequest) {
  try {
    const adminId = await getAdminIdFromSession();
    if (!adminId) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      const { imageId, propertyId, type } = body;

      if (type === "set-cover") {
        if (!imageId || !propertyId) {
          return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const image = await db.propertyImage.findUnique({
          where: { id: imageId },
          select: { id: true, propertyId: true },
        });

        if (!image || image.propertyId !== propertyId) {
          return NextResponse.json({ error: "Image not found" }, { status: 404 });
        }

        await db.propertyImage.updateMany({
          where: { propertyId },
          data: { isCover: false },
        });

        await db.propertyImage.update({
          where: { id: imageId },
          data: { isCover: true },
        });

        return NextResponse.json({ success: true });
      }

      return NextResponse.json({ error: "Invalid request type" }, { status: 400 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const propertyId = formData.get("propertyId") as string | null;
    const mediaType = formData.get("type") as string | null;

    if (!file || !propertyId || !mediaType) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    if (mediaType !== "image" && mediaType !== "brochure") {
      return NextResponse.json({ error: "Invalid media type" }, { status: 400 });
    }

    const property = await db.property.findUnique({
      where: { id: propertyId },
      select: { id: true, slug: true },
    });

    if (!property) {
      return NextResponse.json({ error: "Property not found" }, { status: 404 });
    }

    if (!isSafeSlug(property.slug)) {
      return NextResponse.json({ error: "Invalid property slug" }, { status: 400 });
    }

    const safeName = sanitizeFilename(file.name);

    if (mediaType === "image") {
      if (!isAllowedExt(safeName, ALLOWED_IMAGE_EXTENSIONS)) {
        return NextResponse.json(
          { error: "Invalid image type. Allowed: JPG, JPEG, PNG, WebP" },
          { status: 400 }
        );
      }
      if (file.size > MAX_IMAGE_SIZE) {
        return NextResponse.json(
          { error: "Image too large. Maximum 10MB." },
          { status: 400 }
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const storageKey = await savePropertyImage(property.slug, safeName, buffer);

      const imageUrl = `/images/properties/${property.slug}/${safeName}`;

      const maxOrder = await db.propertyImage.aggregate({
        where: { propertyId },
        _max: { sortOrder: true },
      });
      const nextOrder = (maxOrder._max.sortOrder ?? -1) + 1;

      const imageCount = await db.propertyImage.count({ where: { propertyId } });

      const image = await db.propertyImage.create({
        data: {
          propertyId,
          imageUrl,
          sortOrder: nextOrder,
          isCover: imageCount === 0,
        },
      });

      return NextResponse.json({
        success: true,
        image: {
          id: image.id,
          imageUrl: image.imageUrl,
          sortOrder: image.sortOrder,
          isCover: image.isCover,
        },
        storageKey,
      });
    }

    if (!isAllowedExt(safeName, ALLOWED_BROCHURE_EXTENSIONS)) {
      return NextResponse.json(
        { error: "Invalid brochure type. Only PDF allowed." },
        { status: 400 }
      );
    }
    if (file.size > MAX_BROCHURE_SIZE) {
      return NextResponse.json(
        { error: "Brochure too large. Maximum 25MB." },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const storageKey = await savePropertyBrochure(property.slug, safeName, buffer);

    const brochureUrl = `/images/properties/${property.slug}/brochure/${safeName}`;
    const sizeKB = Math.round(file.size / 1024);
    const sizeStr =
      sizeKB >= 1024 ? `${(sizeKB / 1024).toFixed(1)} MB` : `${sizeKB} KB`;

    await db.property.update({
      where: { id: propertyId },
      data: {
        brochureUrl,
        brochureName: safeName,
        brochureSize: sizeStr,
      },
    });

    return NextResponse.json({
      success: true,
      brochure: {
        url: brochureUrl,
        name: safeName,
        size: sizeStr,
      },
      storageKey,
    });
  } catch (error) {
    console.error("Admin media upload error:", error);
    return NextResponse.json(
      { error: "Upload failed. Please try again." },
      { status: 500 }
    );
  }
}
