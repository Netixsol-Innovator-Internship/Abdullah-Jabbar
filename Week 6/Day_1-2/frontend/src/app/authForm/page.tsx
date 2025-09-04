"use client";

import React from "react";

type Mode = "login" | "signup";
type Theme = "black" | "white";

export default function AuthPage() {
  const [mode, setMode] = React.useState<Mode>("login");
  const [theme, setTheme] = React.useState<Theme>("black");
  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [loading, setLoading] = React.useState(false);

  // read persisted theme once on mount
  React.useEffect(() => {
    try {
      const stored = localStorage.getItem("auth-theme");
      if (stored === "white" || stored === "black") setTheme(stored);
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
  }, [mode]);

  function toggleMode() {
    setMode((m) => (m === "login" ? "signup" : "login"));
  }

  function toggleTheme() {
    setTheme((t) => (t === "black" ? "white" : "black"));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !password || (mode === "signup" && !name)) {
      // minimal client-side guard
      return;
    }
    setLoading(true);
    console.log("Auth submit", { mode, name, email, password });
    // demo delay - replace with API call
    setTimeout(() => {
      setLoading(false);
      alert(
        `${mode === "login" ? "Logged in" : "Account created"} — demo only`
      );
    }, 800);
  }

  // root classes depend on theme
  const rootBg =
    theme === "black" ? "bg-gray-900 text-white" : "bg-white text-gray-900";
  const cardBg =
    theme === "black"
      ? "bg-gray-800/60 border border-gray-700"
      : "bg-white border border-gray-200 shadow";

  return (
    <main
      className={`${rootBg} min-h-screen flex items-center justify-center p-6 transition-colors duration-200`}
    >
      <div
        className={`max-w-md w-full rounded-xl overflow-hidden ${cardBg} backdrop-blur-sm`}
      >
        <div className="flex items-start justify-between px-6 pt-6">
          <div>
            <h1 className="text-xl font-semibold">
              {mode === "login" ? "Welcome back" : "Create your account"}
            </h1>
            <p className="text-sm text-gray-400/80 mt-1">
              {mode === "login"
                ? "Sign in to continue"
                : "Sign up to get started"}
            </p>
          </div>

          <div className="flex flex-col items-end gap-2">
            <button
              type="button"
              onClick={toggleTheme}
              className="text-xs px-2 py-1 rounded-md border border-transparent hover:opacity-90 transition"
              aria-pressed={theme === "white"}
              title="Toggle theme"
            >
              {theme === "black" ? "White" : "Black"}
            </button>

            <button
              type="button"
              onClick={toggleMode}
              className="text-xs px-2 py-1 rounded-md border border-transparent hover:opacity-90 transition"
            >
              {mode === "login" ? "Switch to Signup" : "Switch to Login"}
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="px-6 pt-4 pb-6">
          {mode === "signup" && (
            <label className="block mb-3">
              <span className="text-sm text-gray-400">Name</span>
              <input
                aria-label="Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={mode === "signup"}
                className={`mt-1 block w-full rounded-md px-3 py-2 placeholder:text-gray-400/60 focus:outline-none
                  ${theme === "black" ? "bg-gray-900 border border-gray-700 text-white" : "bg-gray-50 border border-gray-200 text-gray-900"}`}
                placeholder="Your full name"
                autoComplete="name"
              />
            </label>
          )}

          <label className="block mb-3">
            <span className="text-sm text-gray-400">Email</span>
            <input
              aria-label="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`mt-1 block w-full rounded-md px-3 py-2 placeholder:text-gray-400/60 focus:outline-none
                ${theme === "black" ? "bg-gray-900 border border-gray-700 text-white" : "bg-gray-50 border border-gray-200 text-gray-900"}`}
              placeholder="you@example.com"
              autoComplete="email"
            />
          </label>

          <label className="block mb-4">
            <span className="text-sm text-gray-400">Password</span>
            <input
              aria-label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              minLength={6}
              required
              className={`mt-1 block w-full rounded-md px-3 py-2 placeholder:text-gray-400/60 focus:outline-none
                ${theme === "black" ? "bg-gray-900 border border-gray-700 text-white" : "bg-gray-50 border border-gray-200 text-gray-900"}`}
              placeholder="••••••••"
              autoComplete={
                mode === "login" ? "current-password" : "new-password"
              }
            />
          </label>

          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <input
                id="remember"
                type="checkbox"
                className={`h-4 w-4 rounded ${theme === "black" ? "bg-gray-700" : "bg-white"} border ${theme === "black" ? "border-gray-600" : "border-gray-300"}`}
              />
              <label htmlFor="remember" className="text-sm text-gray-400">
                Remember me
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`ml-auto inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-semibold transition
                ${theme === "black" ? "bg-white text-gray-900 hover:brightness-95" : "bg-gray-900 text-white hover:brightness-95"}`}
            >
              {loading
                ? "Please wait..."
                : mode === "login"
                  ? "Login"
                  : "Create account"}
            </button>
          </div>
        </form>

        <div className="px-6 pb-6">
          <p className="text-xs text-gray-400">
            This page is self-contained and built with Tailwind CSS. Hook the
            submit handler to your API routes to authenticate real users.
          </p>
        </div>
      </div>
    </main>
  );
}
