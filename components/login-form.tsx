"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { loginAction } from "@/app/actions/auth";
import { useSnackbar } from "@/components/snackbar/snackbar-provider";
import { Eye, EyeOff, Mail, Lock, Loader2 } from "lucide-react";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const { showSnackbar } = useSnackbar();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    startTransition(async () => {
      const result = await loginAction(email, password, rememberMe);

      if (result.success) {
        showSnackbar("Login successful!", "success");
        setTimeout(() => router.push("/admin/properties"), 500);
      } else {
        showSnackbar(result.error, "error");
      }
    });
  }

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center lg:justify-end overflow-hidden bg-background">
      {/* Background Image — Desktop Only */}
      <div className="hidden lg:block absolute inset-0 w-full h-full">
        <Image
          src="/images/bg/admin-login-bg.webp"
          alt="Admin Background"
          fill
          priority
          className="object-cover object-center"
        />
      </div>

      {/* Floating Login Card Panel */}
      <div className="relative z-10 w-full min-h-screen lg:min-h-0 lg:max-w-[460px] lg:m-6 flex flex-col justify-center">
        <div className="w-full bg-card lg:rounded-3xl lg:shadow-2xl border-0 lg:border border-border p-6 sm:p-10 flex flex-col justify-between">
          
          {/* Header & Logo */}
          <div className="flex flex-col items-center text-center mb-6">
            <div className="relative w-40 h-16 mb-4">
              <Image
                src="/images/logo/pf-logo1.webp"
                alt="Property Fifth"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-serif font-bold text-primary tracking-tight">
              Admin Portal
            </h1>
            <p className="text-xs text-muted-foreground mt-1">
              Welcome back! Please enter your credentials.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="email" className="text-xs font-semibold text-primary">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@propertyfifth.com"
                  autoComplete="email"
                  required
                  disabled={isPending}
                  className="w-full h-11 pl-10 pr-4 text-xs sm:text-sm bg-background rounded-xl border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-xs font-semibold text-primary">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  disabled={isPending}
                  className="w-full h-11 pl-10 pr-11 text-xs sm:text-sm bg-background rounded-xl border border-border focus:border-accent focus:ring-1 focus:ring-accent outline-none transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-primary transition-colors"
                  tabIndex={-1}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center justify-between pt-1">
              <label htmlFor="remember" className="flex items-center gap-2.5 cursor-pointer select-none">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isPending}
                  className="w-4 h-4 rounded border-border text-accent focus:ring-accent accent-accent cursor-pointer"
                />
                <span className="text-xs text-muted-foreground font-medium">Remember me</span>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isPending}
              className="btn-gold w-full h-11 mt-2 text-xs sm:text-sm font-semibold tracking-wide uppercase disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Logging in...
                </span>
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Lock className="w-4 h-4" />
                  Sign In to Dashboard
                </span>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-8 text-center text-[11px] text-muted-foreground">
            &copy; {new Date().getFullYear()} Property Fifth. All rights reserved.
          </div>

        </div>
      </div>
    </div>
  );
}