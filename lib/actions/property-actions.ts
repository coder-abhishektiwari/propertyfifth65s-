"use server";

import { db } from "@/lib/db";

export interface SiteVisitFormData {
  name: string;
  email: string;
  phone: string;
  category: "NRI_UHNI" | "DEFENCE_PERSONNEL";
  propertyId: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
}

export interface CallbackFormData {
  name: string;
  email: string;
  phone: string;
  category: "NRI_UHNI" | "DEFENCE_PERSONNEL";
  propertyId: string;
  preferredDate?: string;
  preferredTime: string;
  message?: string;
}

export interface ActionResult {
  success: boolean;
  message: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function validatePhone(phone: string): boolean {
  return /^\d{10,15}$/.test(phone.replace(/[\s\-+()]/g, ""));
}

export async function submitSiteVisit(data: SiteVisitFormData): Promise<ActionResult> {
  try {
    if (!data.name || data.name.trim().length < 2) {
      return { success: false, message: "Please enter your name." };
    }
    if (!data.email || !validateEmail(data.email)) {
      return { success: false, message: "Please enter a valid email address." };
    }
    if (!data.phone || !validatePhone(data.phone)) {
      return { success: false, message: "Please enter a valid phone number." };
    }
    if (!data.category) {
      return { success: false, message: "Please select a category." };
    }
    if (!data.propertyId) {
      return { success: false, message: "Invalid property." };
    }

    const property = await db.property.findUnique({
      where: { id: data.propertyId },
      select: { id: true },
    });
    if (!property) {
      return { success: false, message: "Property not found." };
    }

    await db.consultationRequest.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        category: data.category,
        requestType: "SITE_VISIT",
        propertyId: data.propertyId,
        preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
        preferredTime: data.preferredTime || null,
        message: data.message?.trim() || null,
        status: "NEW",
      },
    });

    return {
      success: true,
      message: "Your site visit request has been submitted successfully. Our property advisor will contact you shortly.",
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}

export async function submitCallbackRequest(data: CallbackFormData): Promise<ActionResult> {
  try {
    if (!data.name || data.name.trim().length < 2) {
      return { success: false, message: "Please enter your name." };
    }
    if (!data.email || !validateEmail(data.email)) {
      return { success: false, message: "Please enter a valid email address." };
    }
    if (!data.phone || !validatePhone(data.phone)) {
      return { success: false, message: "Please enter a valid phone number." };
    }
    if (!data.category) {
      return { success: false, message: "Please select a category." };
    }
    if (!data.propertyId) {
      return { success: false, message: "Invalid property." };
    }
    if (!data.preferredTime) {
      return { success: false, message: "Please select a preferred time." };
    }

    const property = await db.property.findUnique({
      where: { id: data.propertyId },
      select: { id: true },
    });
    if (!property) {
      return { success: false, message: "Property not found." };
    }

    await db.callbackRequest.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        phone: data.phone.trim(),
        category: data.category,
        propertyId: data.propertyId,
        preferredDate: data.preferredDate ? new Date(data.preferredDate) : null,
        preferredTime: data.preferredTime,
        message: data.message?.trim() || null,
        status: "NEW",
      },
    });

    return {
      success: true,
      message: "Your callback request has been submitted successfully. Our advisor will call you shortly.",
    };
  } catch {
    return {
      success: false,
      message: "Something went wrong. Please try again later.",
    };
  }
}
