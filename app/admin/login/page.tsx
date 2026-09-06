import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { verifySessionToken } from "@/lib/auth/session";
import { SESSION_COOKIE_NAME } from "@/lib/auth/constants";
import LoginForm from "@/components/login-form";

export const metadata = {
  title: "Admin Login — Property Fifth",
};

export default async function AdminLoginPage() {
  let hasValidSession = false;

  try {
    const store = await cookies();
    const sessionCookie = store.get(SESSION_COOKIE_NAME);
    if (sessionCookie?.value) {
      const adminId = await verifySessionToken(sessionCookie.value);
      if (adminId) {
        hasValidSession = true;
      } else {
        store.delete(SESSION_COOKIE_NAME);
      }
    }
  } catch {
    // ignore
  }

  if (hasValidSession) {
    redirect("/admin/dashboard");
  }

  return <LoginForm />;
}
