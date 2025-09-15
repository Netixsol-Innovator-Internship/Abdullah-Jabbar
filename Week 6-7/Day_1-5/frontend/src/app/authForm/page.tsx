// authForm/page.tsx
"use client";

import React from "react";
import { useRouter } from "next/navigation";
// me import no longer needed; profile fetched by auth context
import { useAuth } from "@/hooks/use-auth";

type Mode = "login" | "signup";
type Theme = "black" | "white";

export default function AuthPage() {
  const [mode, setMode] = React.useState<Mode>("login");
  const [theme, setTheme] = React.useState<Theme>("white");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  // token kept internally but not displayed
  // token retained for future authenticated calls (eslint: prefix unused when not referenced directly in JSX)
  const [token, setToken] = React.useState<string | null>(null); // eslint-disable-line @typescript-eslint/no-unused-vars
  interface UserProfile {
    id?: string;
    email?: string;
    name?: string;
    [k: string]: unknown;
  }
  const [user, setUser] = React.useState<UserProfile | null>(null);
  const {
    login: ctxLogin,
    preRegister: ctxPreRegister,
    register: ctxRegister, // final register includes OTP now
    resendOtp: ctxResendOtp,
    isAuthenticated,
  } = useAuth();

  // OTP state
  const [awaitingOtp, setAwaitingOtp] = React.useState(false);
  const [otp, setOtp] = React.useState("");
  const [resendCooldown, setResendCooldown] = React.useState(0);
  const resendTimerRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (resendCooldown <= 0 && resendTimerRef.current) {
      window.clearInterval(resendTimerRef.current);
      resendTimerRef.current = null;
    }
  }, [resendCooldown]);

  function startResendCooldown(seconds = 60) {
    setResendCooldown(seconds);
    if (resendTimerRef.current) window.clearInterval(resendTimerRef.current);
    resendTimerRef.current = window.setInterval(() => {
      setResendCooldown((s) => (s > 0 ? s - 1 : 0));
    }, 1000);
  }
  const router = useRouter();

  // read persisted theme once on mount & existing session
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("auth-theme");
      if (stored === "white" || stored === "black") setTheme(stored);
      const savedToken = localStorage.getItem("auth-token");
      const savedUser = localStorage.getItem("auth-user");
      if (savedToken) setToken(savedToken);
      if (savedUser) {
        try {
          setUser(JSON.parse(savedUser));
        } catch {
          /* ignore */
        }
      }
    } catch {
      /* ignore */
    }
  }, []);

  // persist theme
  React.useEffect(() => {
    try {
      localStorage.setItem("auth-theme", theme);
    } catch {
      /* ignore */
    }
  }, [theme]);

  // clear fields when switching mode
  React.useEffect(() => {
    setName("");
    setEmail("");
    setPassword("");
    setError(null);
    setSuccess(null);
    setAwaitingOtp(false);
    setOtp("");
  }, [mode]);

  function toggleMode() {
    setMode((m) => (m === "login" ? "signup" : "login"));
  }
  function toggleTheme() {
    setTheme((t) => (t === "black" ? "white" : "black"));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (awaitingOtp) {
      // Final registration with OTP
      if (!otp || otp.length < 4) return;
      setLoading(true);
      setError(null);
      setSuccess(null);
      try {
        const res = await ctxRegister(email, password, otp, name);
        if (!res.success) {
          setError(res.error || "Registration failed");
        } else {
          setSuccess("Account verified & logged in");
          setAwaitingOtp(false);
          setTimeout(() => router.replace("/"), 600);
        }
      } catch (err) {
        const msg = err instanceof Error ? err.message : "Registration failed";
        setError(msg);
      } finally {
        setLoading(false);
      }
      return;
    }
    if (!email || !password || (mode === "signup" && !name)) return;
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const result =
        mode === "login"
          ? await ctxLogin(email, password)
          : await ctxPreRegister(email);
      if (!result.success) {
        setError(result.error || "Request failed");
      } else {
        if (mode === "login") {
          setSuccess("Logged in successfully");
          setToken(localStorage.getItem("auth-token"));
          router.replace("/");
        } else {
          // Pre-register success -> show OTP step (user not yet created)
          setSuccess(
            "OTP sent to your email. Enter the code to finish signup."
          );
          setAwaitingOtp(true);
          startResendCooldown(60);
        }
      }
    } catch (e) {
      const msg = e instanceof Error ? e.message : "Request failed";
      setError(msg);
    } finally {
      setLoading(false);
    }
  }

  async function handleResendOtp() {
    if (resendCooldown > 0 || !email) return;
    setError(null);
    try {
      const r = await ctxResendOtp(email);
      if (!r.success) {
        setError(r.error || "Failed to resend");
      } else {
        setSuccess(r.message || "OTP resent");
        startResendCooldown(60);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to resend";
      setError(msg);
    }
  }

  // If user is already authenticated (e.g., revisiting the page), redirect away
  React.useEffect(() => {
    if (isAuthenticated) {
      router.replace("/");
    }
  }, [isAuthenticated, router]);

  // root classes depend on theme
  const rootBg =
    theme === "black" ? "bg-gray-950 text-white" : "bg-gray-50 text-gray-900";
  const cardBg =
    theme === "black"
      ? "bg-gray-900/70 border border-gray-800"
      : "bg-white border border-gray-200 shadow-sm";
  const subtleText = theme === "black" ? "text-gray-400" : "text-gray-500";
  const inputBase =
    theme === "black"
      ? "bg-gray-900 border-gray-700 text-white"
      : "bg-white border-gray-300 text-gray-900";
  const buttonPrimary =
    theme === "black"
      ? "bg-emerald-500 hover:bg-emerald-400 text-white"
      : "bg-gray-900 hover:bg-black text-white";
  const switchBtn =
    theme === "black" ? "hover:bg-gray-800" : "hover:bg-gray-100";

  return (
    <main
      className={`${rootBg} min-h-screen flex items-center justify-center p-6 transition-colors duration-200`}
    >
      <div
        className={`max-w-md w-full rounded-2xl overflow-hidden ${cardBg} backdrop-blur-sm shadow-lg`}
      >
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h1 className="text-xl font-semibold tracking-tight">
              {mode === "login"
                ? user
                  ? `Welcome back${user?.name ? ", " + user.name : ""}`
                  : "Welcome back"
                : "Create your account"}
            </h1>
            <p className={`text-sm mt-1 ${subtleText}`}>
              {mode === "login"
                ? "Sign in to continue"
                : "Sign up to get started"}
            </p>
          </div>
          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className={`text-xs px-2 py-1 rounded-md border border-transparent ${switchBtn} transition`}
              aria-pressed={theme === "white"}
              title="Toggle theme"
            >
              {theme === "black" ? "Light" : "Dark"}
            </button>
            <button
              type="button"
              onClick={toggleMode}
              className={`text-xs px-2 py-1 rounded-md border border-transparent ${switchBtn} transition`}
            >
              {mode === "login" ? "Need an account?" : "Have an account?"}
            </button>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6 space-y-4">
          {error && (
            <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/30 px-3 py-2 rounded-md">
              {error}
            </div>
          )}
          {success && (
            <div className="text-sm text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-2 rounded-md">
              {success}
            </div>
          )}
          {mode === "signup" && !awaitingOtp && (
            <label className="block text-sm font-medium">
              <span className={`text-xs uppercase tracking-wide ${subtleText}`}>
                Name
              </span>
              <input
                aria-label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === "signup"}
                className={`mt-1 block w-full rounded-md px-3 py-2 placeholder:text-gray-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border ${inputBase}`}
                placeholder="Your full name"
                autoComplete="name"
              />
            </label>
          )}
          {!awaitingOtp && (
            <>
              <label className="block text-sm font-medium">
                <span
                  className={`text-xs uppercase tracking-wide ${subtleText}`}
                >
                  Email
                </span>
                <input
                  aria-label="Email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className={`mt-1 block w-full rounded-md px-3 py-2 placeholder:text-gray-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border ${inputBase}`}
                  placeholder="you@example.com"
                  autoComplete="email"
                  disabled={awaitingOtp}
                />
              </label>
              <label className="block text-sm font-medium">
                <span
                  className={`text-xs uppercase tracking-wide ${subtleText}`}
                >
                  Password
                </span>
                <input
                  aria-label="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  minLength={6}
                  required
                  className={`mt-1 block w-full rounded-md px-3 py-2 placeholder:text-gray-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border ${inputBase}`}
                  placeholder="••••••••"
                  autoComplete={
                    mode === "login" ? "current-password" : "new-password"
                  }
                />
              </label>
            </>
          )}
          {awaitingOtp && (
            <>
              <div className="flex items-center justify-between">
                <p className={`text-xs ${subtleText}`}>
                  Verification code sent to
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setAwaitingOtp(false);
                    setOtp("");
                  }}
                  className={`text-xs underline ${subtleText}`}
                >
                  Change email
                </button>
              </div>
              <div className="text-sm font-medium">
                <span
                  className={`text-xs uppercase tracking-wide ${subtleText}`}
                >
                  One-Time Password (OTP)
                </span>
                <input
                  aria-label="OTP"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                  maxLength={8}
                  minLength={4}
                  required
                  placeholder="Enter code"
                  className={`mt-1 tracking-widest text-center text-lg font-semibold block w-full rounded-md px-3 py-3 placeholder:text-gray-400/60 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 border ${inputBase}`}
                />
                <div className="flex items-center justify-between mt-2">
                  <button
                    type="button"
                    onClick={handleResendOtp}
                    disabled={resendCooldown > 0 || loading}
                    className={`text-xs underline ${resendCooldown > 0 ? "opacity-50 cursor-not-allowed" : ""}`}
                  >
                    {resendCooldown > 0
                      ? `Resend in ${resendCooldown}s`
                      : "Resend code"}
                  </button>
                  <button
                    type="submit"
                    disabled={loading || otp.length < 4}
                    className={`text-xs font-semibold ${buttonPrimary} px-3 py-2 rounded-md`}
                  >
                    {loading ? "Verifying..." : "Verify & Continue"}
                  </button>
                </div>
              </div>
            </>
          )}
          <div className="flex items-center justify-between gap-4 pt-2">
            {!awaitingOtp && (
              <>
                <div className="flex items-center gap-2">
                  <input
                    id="remember"
                    type="checkbox"
                    className={`h-4 w-4 rounded border ${
                      theme === "black"
                        ? "bg-gray-900 border-gray-700"
                        : "bg-white border-gray-300"
                    }`}
                  />
                  <label htmlFor="remember" className={`text-xs ${subtleText}`}>
                    Remember me
                  </label>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className={`ml-auto inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition focus:outline-none focus:ring-2 focus:ring-offset-2 ${buttonPrimary} ${
                    theme === "black"
                      ? "focus:ring-emerald-400 focus:ring-offset-gray-950"
                      : "focus:ring-gray-800 focus:ring-offset-gray-50"
                  }`}
                >
                  {loading
                    ? "Please wait..."
                    : mode === "login"
                      ? "Login"
                      : "Create account"}
                </button>
              </>
            )}
          </div>

          {/* OAuth Buttons */}
          {!awaitingOtp && (
            <>
              <div className="flex items-center gap-4 py-4">
                <hr
                  className={`flex-1 border-t ${theme === "black" ? "border-gray-700" : "border-gray-300"}`}
                />
                <span className={`text-xs ${subtleText}`}>
                  or continue with
                </span>
                <hr
                  className={`flex-1 border-t ${theme === "black" ? "border-gray-700" : "border-gray-300"}`}
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    (window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/google`)
                  }
                  className={`flex items-center justify-center px-4 py-2 border rounded-md transition ${
                    theme === "black"
                      ? "border-gray-700 hover:bg-gray-800 text-white"
                      : "border-gray-300 hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    (window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/github`)
                  }
                  className={`flex items-center justify-center px-4 py-2 border rounded-md transition ${
                    theme === "black"
                      ? "border-gray-700 hover:bg-gray-800 text-white"
                      : "border-gray-300 hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                  </svg>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    (window.location.href = `${process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"}/auth/discord`)
                  }
                  className={`flex items-center justify-center px-4 py-2 border rounded-md transition ${
                    theme === "black"
                      ? "border-gray-700 hover:bg-gray-800 text-white"
                      : "border-gray-300 hover:bg-gray-50 text-gray-900"
                  }`}
                >
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.317 4.492c-1.53-.69-3.17-1.2-4.885-1.49a.075.075 0 0 0-.079.036c-.21.369-.444.85-.608 1.23a18.566 18.566 0 0 0-5.487 0 12.36 12.36 0 0 0-.617-1.23A.077.077 0 0 0 8.562 3c-1.714.29-3.354.8-4.885 1.491a.07.07 0 0 0-.032.027C.533 9.093-.32 13.555.099 17.961a.08.08 0 0 0 .031.055 20.03 20.03 0 0 0 5.993 2.98.078.078 0 0 0 .084-.026 13.83 13.83 0 0 0 1.226-1.963.074.074 0 0 0-.041-.104 13.201 13.201 0 0 1-1.872-.878.075.075 0 0 1-.008-.125c.126-.093.252-.19.372-.287a.075.075 0 0 1 .078-.01c3.927 1.764 8.18 1.764 12.061 0a.075.075 0 0 1 .079.009c.12.098.246.195.372.288a.075.075 0 0 1-.006.125c-.598.344-1.22.635-1.873.877a.075.075 0 0 0-.041.105c.36.687.772 1.341 1.225 1.962a.077.077 0 0 0 .084.028 19.963 19.963 0 0 0 6.002-2.981.076.076 0 0 0 .032-.054c.5-5.094-.838-9.52-3.549-13.442a.06.06 0 0 0-.031-.028zM8.02 15.278c-1.182 0-2.157-1.067-2.157-2.38 0-1.312.956-2.38 2.157-2.38 1.201 0 2.176 1.068 2.157 2.38 0 1.313-.956 2.38-2.157 2.38zm7.975 0c-1.183 0-2.157-1.067-2.157-2.38 0-1.312.955-2.38 2.157-2.38 1.2 0 2.176 1.068 2.157 2.38 0 1.313-.956 2.38-2.157 2.38z" />
                  </svg>
                </button>
              </div>
            </>
          )}
        </form>
        {user && (
          <div className="px-6 pb-4">
            <p className={`text-xs ${subtleText}`}>
              Logged in as{" "}
              <span className="font-medium text-emerald-500">
                {user.name || user.email}
              </span>
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
