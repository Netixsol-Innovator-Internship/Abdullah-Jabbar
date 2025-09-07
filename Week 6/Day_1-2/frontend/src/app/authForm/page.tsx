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
  const [theme, setTheme] = React.useState<Theme>("black");
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
