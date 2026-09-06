import { NextRequest, NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "pf_admin_session";

function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not set");
  return secret;
}

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

async function verifySessionToken(token: string): Promise<string | null> {
  const parts = token.split(":");
  if (parts.length !== 2) return null;

  const [adminId, signature] = parts;
  if (!adminId || !signature) return null;

  const secret = getAuthSecret();
  const expectedSignature = await hmacSign(adminId, secret);

  const encoder = new TextEncoder();
  const expectedBuf = encoder.encode(expectedSignature);
  const actualBuf = encoder.encode(signature);

  if (expectedBuf.length !== actualBuf.length) return null;

  let mismatch = false;
  for (let i = 0; i < expectedBuf.length; i++) {
    if (expectedBuf[i] !== actualBuf[i]) mismatch = true;
  }
  if (mismatch) return null;

  return adminId;
}

const PUBLIC_ADMIN_PATHS = ["/admin/login"];

export const config = {
  matcher: ["/admin/:path*"],
};

export async function middleware(request: NextRequest) {
  try {
    const { pathname } = request.nextUrl;

    if (PUBLIC_ADMIN_PATHS.includes(pathname)) {
      return NextResponse.next();
    }

    const sessionCookie = request.cookies.get(SESSION_COOKIE_NAME);
    const token = sessionCookie?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/admin/login", request.url));
    }

    const adminId = await verifySessionToken(token);
    if (!adminId) {
      const response = NextResponse.redirect(
        new URL("/admin/login", request.url)
      );
      response.cookies.delete(SESSION_COOKIE_NAME);
      return response;
    }

    return NextResponse.next();
  } catch {
    const response = NextResponse.redirect(
      new URL("/admin/login", request.url)
    );
    response.cookies.delete(SESSION_COOKIE_NAME);
    return response;
  }
}
