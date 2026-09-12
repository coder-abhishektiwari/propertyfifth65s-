"use server";

import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth/password";
import { getAdminIdFromSession } from "@/lib/auth/session";

export interface AdminActionResult {
  success: boolean;
  message: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

async function getFirstAdminId(): Promise<string | null> {
  const first = await db.admin.findFirst({
    orderBy: { createdAt: "asc" },
    select: { id: true },
  });
  return first?.id ?? null;
}

async function requireSuperAdmin(): Promise<string | null> {
  const adminId = await getAdminIdFromSession();
  if (!adminId) return null;
  const firstAdminId = await getFirstAdminId();
  return adminId === firstAdminId ? adminId : null;
}

export async function isSuperAdmin(): Promise<boolean> {
  const adminId = await getAdminIdFromSession();
  if (!adminId) return false;
  const firstAdminId = await getFirstAdminId();
  return adminId === firstAdminId;
}

export async function createAdmin(data: {
  name: string;
  email: string;
  password: string;
}): Promise<AdminActionResult> {
  try {
    const superAdminId = await requireSuperAdmin();
    if (!superAdminId) return { success: false, message: "Only super admins can create accounts." };

    if (!data.name || data.name.trim().length < 2) return { success: false, message: "Name must be at least 2 characters." };
    if (!data.email || !validateEmail(data.email)) return { success: false, message: "Please enter a valid email." };
    if (!data.password || data.password.length < 6) return { success: false, message: "Password must be at least 6 characters." };

    const existing = await db.admin.findUnique({ where: { email: data.email.trim().toLowerCase() } });
    if (existing) return { success: false, message: "An admin with this email already exists." };

    const passwordHash = await hashPassword(data.password);
    await db.admin.create({
      data: {
        name: data.name.trim(),
        email: data.email.trim().toLowerCase(),
        passwordHash,
      },
    });

    return { success: true, message: "Admin account created successfully." };
  } catch {
    return { success: false, message: "Failed to create admin account." };
  }
}

export async function deleteAdmin(id: string): Promise<AdminActionResult> {
  try {
    const superAdminId = await requireSuperAdmin();
    if (!superAdminId) return { success: false, message: "Only super admins can delete accounts." };
    if (id === superAdminId) return { success: false, message: "You cannot delete your own account." };

    const admin = await db.admin.findUnique({ where: { id } });
    if (!admin) return { success: false, message: "Admin not found." };
    if (id === superAdminId) return { success: false, message: "Cannot delete the super admin." };

    await db.admin.delete({ where: { id } });
    return { success: true, message: "Admin account deleted." };
  } catch {
    return { success: false, message: "Failed to delete admin account." };
  }
}

export async function resetAdminPassword(
  id: string,
  newPassword: string
): Promise<AdminActionResult> {
  try {
    const superAdminId = await requireSuperAdmin();
    if (!superAdminId) return { success: false, message: "Only super admins can reset passwords." };

    if (!newPassword || newPassword.length < 6) return { success: false, message: "Password must be at least 6 characters." };

    const admin = await db.admin.findUnique({ where: { id } });
    if (!admin) return { success: false, message: "Admin not found." };

    const passwordHash = await hashPassword(newPassword);
    await db.admin.update({ where: { id }, data: { passwordHash } });
    return { success: true, message: "Password reset successfully." };
  } catch {
    return { success: false, message: "Failed to reset password." };
  }
}

export async function updateAdminProfile(data: {
  name: string;
  email: string;
}): Promise<AdminActionResult> {
  try {
    const adminId = await getAdminIdFromSession();
    if (!adminId) return { success: false, message: "Not authenticated." };

    if (!data.name || data.name.trim().length < 2) return { success: false, message: "Name must be at least 2 characters." };
    if (!data.email || !validateEmail(data.email)) return { success: false, message: "Please enter a valid email." };

    const existing = await db.admin.findFirst({
      where: { email: data.email.trim().toLowerCase(), NOT: { id: adminId } },
    });
    if (existing) return { success: false, message: "This email is already in use." };

    await db.admin.update({
      where: { id: adminId },
      data: { name: data.name.trim(), email: data.email.trim().toLowerCase() },
    });

    return { success: true, message: "Profile updated successfully." };
  } catch {
    return { success: false, message: "Failed to update profile." };
  }
}

export async function changeAdminPassword(data: {
  currentPassword: string;
  newPassword: string;
}): Promise<AdminActionResult> {
  try {
    const adminId = await getAdminIdFromSession();
    if (!adminId) return { success: false, message: "Not authenticated." };

    if (!data.currentPassword) return { success: false, message: "Current password is required." };
    if (!data.newPassword || data.newPassword.length < 6) return { success: false, message: "New password must be at least 6 characters." };

    const admin = await db.admin.findUnique({ where: { id: adminId } });
    if (!admin) return { success: false, message: "Admin not found." };

    const { verifyPassword } = await import("@/lib/auth/password");
    const isValid = await verifyPassword(data.currentPassword, admin.passwordHash);
    if (!isValid) return { success: false, message: "Current password is incorrect." };

    const passwordHash = await hashPassword(data.newPassword);
    await db.admin.update({ where: { id: adminId }, data: { passwordHash } });
    return { success: true, message: "Password changed successfully." };
  } catch {
    return { success: false, message: "Failed to change password." };
  }
}

export async function getAdminRole(): Promise<"SUPER_ADMIN" | "ADMIN"> {
  const adminId = await getAdminIdFromSession();
  if (!adminId) return "ADMIN";
  const firstAdminId = await getFirstAdminId();
  return adminId === firstAdminId ? "SUPER_ADMIN" : "ADMIN";
}
