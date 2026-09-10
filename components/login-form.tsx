"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { loginAction } from "@/app/actions/auth";
import { useSnackbar } from "@/components/snackbar/snackbar-provider";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";

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
    <div className="relative h-screen w-full overflow-hidden">
      {/* Full-screen background image — hidden on mobile */}
      <img
        src="/images/bg/admin-login-bg.png"
        alt=""
        className="hidden lg:block absolute inset-0 w-full h-full object-cover"
      />
      <div className="hidden lg:block absolute inset-0 bg-[#0a1628]/0" />

      {/* Floating login card — full screen on mobile, right-side card on desktop */}
      <div className="relative z-10 h-full flex items-center justify-center lg:justify-end p-0 lg:p-4 sm:lg:p-6 lg:p-8">
        <div className="w-full h-full lg:max-w-[480px] lg:h-[calc(100vh-4rem)] bg-white lg:rounded-[28px] lg:shadow-2xl px-6 sm:px-10 py-6 flex flex-col overflow-hidden">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            <img
              src="/images/logo/pf-logo1.png"
              alt="Property Fifth"
              className="h-18 sm:h-22 mb-5"
            />
          </div>

          {/* Header */}
          <div className="text-center mb-5">
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-[#0a1628] tracking-tight">
              Admin Login
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Welcome back! Please login to access your admin panel.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="block text-xs font-semibold text-[#0a1628] mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  autoComplete="email"
                  required
                  disabled={isPending}
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0a1628] focus:border-[#0a1628] transition-all disabled:opacity-50"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="block text-xs font-semibold text-[#0a1628] mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  autoComplete="current-password"
                  required
                  disabled={isPending}
                  className="w-full pl-10 pr-10 py-2.5 sm:py-3 border border-gray-200 rounded-xl text-xs sm:text-sm text-[#0a1628] placeholder:text-gray-400 focus:outline-none focus:ring-1 focus:ring-[#0a1628] focus:border-[#0a1628] transition-all disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  tabIndex={-1}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <label htmlFor="remember" className="flex items-center gap-2 cursor-pointer select-none">
              <div className="relative flex items-center justify-center w-4 h-4">
                <input
                  id="remember"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  disabled={isPending}
                  className="peer sr-only"
                />
                {/* Custom Box */}
                <div className="absolute inset-0 rounded-[5px] border border-gray-300 bg-white peer-checked:bg-[#c8963e] peer-checked:border-[#c8963e] transition-all" />

                {/* Custom White Tick */}
                <svg
                  className="relative w-2.5 h-2.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="3.5"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <span className="text-xs text-gray-500 font-normal">Remember me</span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              disabled={isPending}
              className="w-full mt-5 mb-8 flex items-center justify-center gap-2 bg-[#0a1628] hover:bg-[#0f1f3a] text-white py-3 px-4 rounded-xl text-xs sm:text-sm font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            >
              {isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Login to Admin
                </>
              )}
            </button>
          </form>

          {/* Footer */}
          <div className="mt-5 text-center text-[11px] text-gray-400">
            &copy; 2024 Property Fifth. All rights reserved.
          </div>
        </div>
      </div>
    </div>
  );
}
