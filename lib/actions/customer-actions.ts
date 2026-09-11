"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";
import crypto from "crypto";

export interface CustomerIdentityData {
  name: string;
  email: string;
  phone: string;
  category: "NRI_UHNI" | "DEFENCE_PERSONNEL";
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
}

export interface CustomerActionResult {
  success: boolean;
  message: string;
  customer?: {
    id: string;
    visitorId: string;
    name: string;
    email: string;
    phone: string;
    category: string;
  };
}

function getVisitorId(): string {
  const bytes = crypto.randomBytes(16);
  return bytes.toString("hex");
}

export async function submitCustomerIdentity(
  data: CustomerIdentityData
): Promise<CustomerActionResult> {
  try {
    if (!data.name || data.name.trim().length < 2) {
      return { success: false, message: "Please enter your name." };
    }
    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
      return { success: false, message: "Please enter a valid email address." };
    }
    if (!data.phone || !/^\d{10,15}$/.test(data.phone.replace(/[\s\-+()]/g, ""))) {
      return { success: false, message: "Please enter a valid phone number." };
    }
    if (!data.category) {
      return { success: false, message: "Please select a category." };
    }

    const cookieStore = await cookies();
    let visitorId = cookieStore.get("visitorId")?.value;

    if (!visitorId) {
      visitorId = getVisitorId();
      cookieStore.set("visitorId", visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365,
        path: "/",
      });
    }

    const existing = await db.customer.findUnique({
      where: { visitorId },
      select: { id: true },
    });

    let customer;
    if (existing) {
      customer = await db.customer.update({
        where: { visitorId },
        data: {
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          category: data.category,
          city: data.city || null,
          state: data.state || null,
          country: data.country || null,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          locationCapturedAt: data.latitude ? new Date() : null,
        },
      });
    } else {
      customer = await db.customer.create({
        data: {
          visitorId,
          name: data.name.trim(),
          email: data.email.trim().toLowerCase(),
          phone: data.phone.trim(),
          category: data.category,
          city: data.city || null,
          state: data.state || null,
          country: data.country || null,
          latitude: data.latitude || null,
          longitude: data.longitude || null,
          locationCapturedAt: data.latitude ? new Date() : null,
        },
      });
    }

    return {
      success: true,
      message: "Identity saved successfully.",
      customer: {
        id: customer.id,
        visitorId,
        name: customer.name || "",
        email: customer.email || "",
        phone: customer.phone || "",
        category: customer.category || "",
      },
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function getCustomerIdentity(): Promise<CustomerActionResult> {
  try {
    const cookieStore = await cookies();
    const visitorId = cookieStore.get("visitorId")?.value;

    if (!visitorId) {
      return { success: false, message: "No visitor ID found." };
    }

    const customer = await db.customer.findUnique({
      where: { visitorId },
      select: {
        id: true,
        visitorId: true,
        name: true,
        email: true,
        phone: true,
        category: true,
      },
    });

    if (!customer || !customer.name || !customer.email || !customer.phone) {
      return { success: false, message: "Incomplete customer profile." };
    }

    return {
      success: true,
      message: "Customer found.",
      customer: {
        id: customer.id,
        visitorId: customer.visitorId,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        category: customer.category || "",
      },
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong.",
    };
  }
}
