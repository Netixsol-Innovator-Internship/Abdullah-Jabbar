"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";

import { HeroSection } from "@/components/hero-section";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // helper: extract a human-friendly message from a response or error object
  const extractMessage = (obj: unknown, fallback = "Success"): string => {
    if (typeof obj === "string") return obj;
    if (obj == null) return fallback;
    try {
      const o = obj as unknown;
      // direct message string
      if (typeof (o as { message?: unknown }).message === "string")
        return (o as { message: string }).message;
      // message may be array of strings
      if (Array.isArray((o as { message?: unknown }).message))
        return (o as { message: string[] }).message.join(", ");
      // sometimes message is nested object with message
      const m = (o as { message?: unknown }).message;
      if (m && typeof m === "object") {
        if (typeof (m as { message?: unknown }).message === "string")
          return (m as { message: string }).message;
      }
      // fallback: if object has a 'data' with message
      const d = (o as { data?: unknown }).data;
      if (d && typeof d === "object") {
        if (typeof (d as { message?: unknown }).message === "string")
          return (d as { message: string }).message;
      }
      // last resort: stringify small objects
      const s = JSON.stringify(obj);
      return s === "{}" ? fallback : s;
    } catch {
      return fallback;
    }
  };

  return (
    <>
      <HeroSection
        title="Login"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Login" }]}
      />

      <div className="py-16 px-4">
        <div className="max-w-md mx-auto">
          {/* Toggle Buttons */}
          <div className="flex rounded-full border border-gray-300 p-1 mb-8">
            <button className="flex-1 py-2 px-4 rounded-full text-white bg-[#4A5FBF] font-medium">
              Login
            </button>
            <Link
              href="/register"
              className="flex-1 py-2 px-4 rounded-full text-gray-600 text-center font-medium hover:bg-gray-50"
            >
              Register
            </Link>
          </div>

          {/* Login Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-[#4A5FBF] text-center mb-2">
              Log In
            </h2>
            <p className="text-center text-gray-500 mb-6">
              New member?{" "}
              <Link href="/register" className="text-[#4A5FBF] hover:underline">
                Register Here
              </Link>
            </p>

            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Enter Your Email*
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password*
                </label>
                <div className="relative">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pr-10"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="remember"
                    checked={rememberMe}
                    onCheckedChange={(checked) =>
                      setRememberMe(checked as boolean)
                    }
                  />
                  <label htmlFor="remember" className="text-sm text-gray-600">
                    Remember me
                  </label>
                </div>
                <Link
                  href="/forgot-password"
                  className="text-sm text-[#4A5FBF] hover:underline"
                >
                  Forgot Password
                </Link>
              </div>

              <Button
                className="w-full bg-[#4A5FBF] hover:bg-[#3A4FAF] text-white py-3"
                onClick={async (e) => {
                  e.preventDefault();
                  setIsLoading(true);
                  try {
                    const resp = await fetch(
                      "http://localhost:4000/auth/login",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ identifier: email, password }),
                      }
                    );
                    const data = await resp.json();
                    if (!resp.ok) throw data;
                    if (data?.access_token)
                      localStorage.setItem("token", data.access_token);
                    if (data?.user)
                      localStorage.setItem("user", JSON.stringify(data.user));
                    // store full auth payload as convenience
                    localStorage.setItem("auth", JSON.stringify(data));
                    // notify other components in same tab that auth changed
                    try {
                      window.dispatchEvent(new Event("authChanged"));
                    } catch {}
                    // show success message from backend if available, otherwise a sensible default
                    const successMsg = extractMessage("Login successful");
                    alert(successMsg);
                    // redirect to homepage
                    router.push("/");
                  } catch (err) {
                    // show error message from backend or stringify the error
                    const errMsg = extractMessage(err, "Unknown error");
                    alert(`Login failed: ${errMsg}`);
                  } finally {
                    setIsLoading(false);
                  }
                }}
                disabled={isLoading}
              >
                {isLoading ? "Logging in..." : "Log In"}
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-center text-gray-500 mb-4">Or Register With</p>
              <div className="flex justify-center gap-4">
                <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
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
                <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </button>
                <button className="p-2 border border-gray-300 rounded hover:bg-gray-50">
                  <svg
                    className="w-5 h-5 text-blue-400"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
