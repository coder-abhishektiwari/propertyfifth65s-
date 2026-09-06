"use server";

import { db } from "@/lib/db";
import { verifyPassword } from "@/lib/auth/password";
import {
  setSessionCookie,
  removeSessionCookie,
} from "@/lib/auth/session";

export type LoginResult =
  | { success: true }
  | { success: false; error: string };

export async function loginAction(
  email: string,
  password: string,
  rememberMe: boolean
): Promise<LoginResult> {
  const normalizedEmail = email.trim().toLowerCase();

  if (!normalizedEmail) {
    return { success: false, error: "Email is required." };
  }

  if (!password) {
    return { success: false, error: "Password is required." };
  }

  try {
    const admin = await db.admin.findUnique({
      where: { email: normalizedEmail },
    });

    if (!admin) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    const isValid = await verifyPassword(password, admin.passwordHash);

    if (!isValid) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }

    await setSessionCookie(admin.id, rememberMe);

    return { success: true };
  } catch {
    return {
      success: false,
      error: "An unexpected error occurred. Please try again.",
    };
  }
}

export async function logoutAction(): Promise<void> {
  await removeSessionCookie();
}
