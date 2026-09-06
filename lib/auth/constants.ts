export const SESSION_COOKIE_NAME = "pf_admin_session";

const NORMAL_SESSION_MAX_AGE = 60 * 60 * 8; // 8 hours
const REMEMBERED_SESSION_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export function getSessionMaxAge(rememberMe: boolean): number {
  return rememberMe ? REMEMBERED_SESSION_MAX_AGE : NORMAL_SESSION_MAX_AGE;
}

export function getAuthSecret(): string {
  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    throw new Error("AUTH_SECRET environment variable is not set");
  }
  return secret;
}
