import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, getSessionMaxAge, getAuthSecret } from "./constants";

async function hmacSign(data: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(data));
  return Array.from(new Uint8Array(signature))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export async function createSessionToken(adminId: string): Promise<string> {
  const secret = getAuthSecret();
  const signature = await hmacSign(adminId, secret);
  return `${adminId}:${signature}`;
}

export async function verifySessionToken(token: string): Promise<string | null> {
  const parts = token.split(":");
  if (parts.length !== 2) return null;

  const [adminId, signature] = parts;
  if (!adminId || !signature) return null;

  const secret = getAuthSecret();
  const expectedSignature = await hmacSign(adminId, secret);

  const encoder = new TextEncoder();
  const expectedBuffer = encoder.encode(expectedSignature);
  const actualBuffer = encoder.encode(signature);

  if (expectedBuffer.length !== actualBuffer.length) return null;

  let mismatch = false;
  for (let i = 0; i < expectedBuffer.length; i++) {
    if (expectedBuffer[i] !== actualBuffer[i]) {
      mismatch = true;
    }
  }
  if (mismatch) return null;

  return adminId;
}

export async function setSessionCookie(
  adminId: string,
  rememberMe: boolean
): Promise<void> {
  const token = await createSessionToken(adminId);
  const store = await cookies();
  store.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: getSessionMaxAge(rememberMe),
  });
}

export async function removeSessionCookie(): Promise<void> {
  const store = await cookies();
  store.delete(SESSION_COOKIE_NAME);
}

export async function getAdminIdFromSession(): Promise<string | null> {
  const store = await cookies();
  const sessionCookie = store.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return null;
  return verifySessionToken(sessionCookie.value);
}
