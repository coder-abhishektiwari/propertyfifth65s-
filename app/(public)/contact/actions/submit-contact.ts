"use server";

import { db } from "@/lib/db";

type ContactFormState = {
  success: boolean;
  error: string | null;
  fieldErrors: Record<string, string>;
};

const INTEREST_OPTIONS = [
  "Residential Property",
  "Commercial Property",
  "Investment Advisory",
  "NRI / UHNI",
  "Defence Personnel",
  "Other",
];

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
  const interest = sanitize(String(formData.get("interest") || ""));
  const message = sanitize(String(formData.get("message") || ""));

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

  if (interest && !INTEREST_OPTIONS.includes(interest)) {
    fieldErrors.interest = "Please select a valid option.";
  }

  if (message.length > 2000) {
    fieldErrors.message = "Message is too long (max 2000 characters).";
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { success: false, error: null, fieldErrors };
  }

  try {
    await db.contactInquiry.create({
      data: {
        name,
        email,
        phone: phone || null,
        interest: interest || null,
        message: message || null,
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
