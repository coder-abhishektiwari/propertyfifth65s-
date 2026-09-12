"use server";

import { db } from "@/lib/db";
import { cookies } from "next/headers";

type ContactFormState = {
  success: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
};

function sanitize(input: string): string {
  return input.replace(/[<>]/g, "").trim();
}

export async function submitContactInquiry(
  _prevState: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const name = sanitize(String(formData.get("name") || ""));
  const email = sanitize(String(formData.get("email") || ""));
  const phone = sanitize(String(formData.get("phone") || ""));
  const query = sanitize(String(formData.get("query") || ""));

  const fieldErrors: Record<string, string> = {};

  if (!name || name.length < 2) {
    fieldErrors.name = "Please enter your name.";
  }
  if (name.length > 100) {
    fieldErrors.name = "Name is too long.";
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    fieldErrors.email = "Please enter a valid email address.";
  }
  if (email.length > 255) {
    fieldErrors.email = "Email is too long.";
  }

  if (phone && !/^[+]?[\d\s\-()]{7,20}$/.test(phone)) {
    fieldErrors.phone = "Please enter a valid phone number.";
  }

  if (query.length > 2000) {
    fieldErrors.query = "Query is too long (max 2000 characters).";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: null, fieldErrors };
  }

  try {
    const cookieStore = await cookies();
    const visitorId = cookieStore.get("visitorId")?.value;

    let customerId: string | null = null;
    if (visitorId) {
      const customer = await db.customer.findUnique({ where: { visitorId } });
      if (customer) customerId = customer.id;
    }

    await db.contactInquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        query: query || null,
        customerId,
      },
    });

    return { success: true, error: null, fieldErrors: {} };
  } catch {
    return {
      success: false,
      error: "Something went wrong. Please try again later.",
      fieldErrors: {},
    };
  }
}
