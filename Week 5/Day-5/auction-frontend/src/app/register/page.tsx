"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { HeroSection } from "@/components/hero-section";
import { countries } from "@/lib/countryCodes";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    mobile: "",
    username: "",
    password: "",
    confirmPassword: "",
    agreeToTerms: false,
  });

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  // Derived state: form can be submitted only when user agrees to terms
  const canSubmit = formData.agreeToTerms;
  const [isRegistering, setIsRegistering] = useState(false);
  const router = useRouter();

  // helper: extract a human-friendly message from a response or error object
  const extractMessage = (obj: unknown, fallback = "Success"): string => {
    if (typeof obj === "string") return obj;
    if (obj == null) return fallback;
    try {
      const o = obj as unknown;
      if (typeof (o as { message?: unknown }).message === "string")
        return (o as { message: string }).message;
      if (Array.isArray((o as { message?: unknown }).message))
        return (o as { message: string[] }).message.join(", ");
      const m = (o as { message?: unknown }).message;
      if (m && typeof m === "object") {
        if (typeof (m as { message?: unknown }).message === "string")
          return (m as { message: string }).message;
      }
      const d = (o as { data?: unknown }).data;
      if (d && typeof d === "object") {
        if (typeof (d as { message?: unknown }).message === "string")
          return (d as { message: string }).message;
      }
      const s = JSON.stringify(obj);
      return s === "{}" ? fallback : s;
    } catch {
      return fallback;
    }
  };

  // Selected country for phone input
  const [selectedCountry, setSelectedCountry] = useState("pk");

  const countryCodes: Record<string, string> = Object.fromEntries(
    countries.map((c) => [c.key, c.dialCode])
  );

  const countryMax: Record<string, number> = Object.fromEntries(
    countries.map((c) => [
      c.key,
      typeof c.maxLength === "number" ? c.maxLength : 10,
    ])
  );

  return (
    <>
      <HeroSection
        title="Register"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Register" }]}
      />

      <div className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          {/* Toggle Buttons */}
          <div className="flex rounded-full border border-gray-300 p-1 mb-8">
            <button className="flex-1 py-2 px-4 rounded-full text-white bg-[#4A5FBF] font-medium">
              Register
            </button>
            <Link
              href="/login"
              className="flex-1 py-2 px-4 rounded-full text-gray-600 text-center font-medium hover:bg-gray-50"
            >
              Login
            </Link>
          </div>

          {/* Register Form */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-semibold text-[#4A5FBF] text-center mb-2">
              Register
            </h2>
            <p className="text-center text-gray-500 mb-6">
              Do you already have an account?{" "}
              <Link href="/login" className="text-[#4A5FBF] hover:underline">
                Login Here
              </Link>
            </p>

            <form className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-medium text-[#4A5FBF] mb-4">
                  Personal Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Enter Your Full Name*
                    </label>
                    <Input
                      type="text"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      className="w-full"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Your Email*
                      </label>
                      <Input
                        type="email"
                        value={formData.email}
                        onChange={(e) =>
                          handleInputChange("email", e.target.value)
                        }
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Enter Mobile Number*
                      </label>
                      <div className="flex">
                        <Select
                          value={selectedCountry}
                          onValueChange={(val: string) =>
                            setSelectedCountry(val)
                          }
                        >
                          <SelectTrigger className="w-25">
                            <SelectValue>
                              {selectedCountry
                                ? `${selectedCountry} (${countryCodes[selectedCountry] ?? ""})`
                                : "Select country"}
                            </SelectValue>
                          </SelectTrigger>
                          <SelectContent>
                            {countries.map((c) => (
                              <SelectItem key={c.key} value={c.key}>
                                {c.name} {c.dialCode}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Input
                          type="tel"
                          value={formData.mobile}
                          // enforce per-country maxlength via prop
                          maxLength={countryMax[selectedCountry] ?? 10}
                          onChange={(e) => {
                            // Normalize input: keep digits only, strip leading country code if pasted
                            const raw = e.target.value || "";
                            const digits = raw.replace(/\D/g, "");
                            const codeDigits = (
                              countryCodes[selectedCountry] ?? ""
                            ).replace("+", "");
                            let local = digits;
                            if (local.startsWith(codeDigits)) {
                              local = local.slice(codeDigits.length);
                            }
                            // apply max length for the selected country
                            const maxLen = countryMax[selectedCountry] ?? 10;
                            if (local.length > maxLen)
                              local = local.slice(0, maxLen);
                            handleInputChange("mobile", local);
                          }}
                          className="flex-1 ml-2"
                          required
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Account Information */}
              <div>
                <h3 className="text-lg font-medium text-[#4A5FBF] mb-4">
                  Account Information
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Username*
                    </label>
                    <div className="flex">
                      <Input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          handleInputChange("username", e.target.value)
                        }
                        className="flex-1"
                        required
                      />
                      <Button
                        variant="outline"
                        className="ml-2 text-[#4A5FBF] border-[#4A5FBF] bg-transparent"
                      >
                        Check Availability
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Password*
                      </label>
                      <Input
                        type="password"
                        value={formData.password}
                        onChange={(e) =>
                          handleInputChange("password", e.target.value)
                        }
                        className="w-full"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Confirm Password*
                      </label>
                      <Input
                        type="password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          handleInputChange("confirmPassword", e.target.value)
                        }
                        className="w-full"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Captcha */}
              <div>
                <h3 className="text-lg font-medium text-[#4A5FBF] mb-4">
                  Prove You Are Human
                </h3>
                <div className="bg-gray-100 p-4 rounded border text-center">
                  <p className="text-gray-600">I&apos;m not a robot</p>
                  <div className="w-6 h-6 border-2 border-gray-400 rounded mx-auto mt-2"></div>
                </div>
              </div>

              {/* Terms */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    handleInputChange("agreeToTerms", checked as boolean)
                  }
                />
                <label htmlFor="terms" className="text-sm text-gray-600">
                  I agree to the{" "}
                  <Link
                    href="/terms"
                    className="text-[#4A5FBF] hover:underline"
                  >
                    Terms & Conditions
                  </Link>
                </label>
              </div>

              <Button
                disabled={!canSubmit || isRegistering}
                onClick={async (e) => {
                  e.preventDefault();
                  if (!canSubmit) return;
                  if (formData.password !== formData.confirmPassword) {
                    console.error("Passwords do not match");
                    return;
                  }
                  setIsRegistering(true);
                  try {
                    // Build mobile number with country dial code.
                    const localNumber = (formData.mobile || "")
                      .toString()
                      .replace(/^0+/, "");
                    const dial = countryCodes[selectedCountry] ?? "+92";
                    const mobileWithCode = `${dial}${localNumber}`;

                    const payload = {
                      username: formData.username,
                      email: formData.email,
                      password: formData.password,
                      fullName: formData.fullName,
                      mobileNumber: mobileWithCode,
                    };
                    const resp = await fetch(
                      "http://localhost:4000/auth/register",
                      {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                      }
                    );
                    const data = await resp.json();
                    if (!resp.ok) throw data;
                    if (data?.access_token)
                      localStorage.setItem("token", data.access_token);
                    if (data?.user)
                      localStorage.setItem("user", JSON.stringify(data.user));
                    localStorage.setItem("auth", JSON.stringify(data));
                    // notify other components in same tab that auth changed
                    try {
                      window.dispatchEvent(new Event("authChanged"));
                    } catch {}
                    // show success message from backend if available
                    const successMsg = extractMessage(
                      "Registration successful"
                    );
                    alert(successMsg);
                    router.push("/");
                  } catch (err) {
                    // Type-safe extraction of error message
                    const errMsg = extractMessage(err, "Unknown error");
                    alert(`Registration failed: ${errMsg}`);
                  } finally {
                    setIsRegistering(false);
                  }
                }}
                className={
                  canSubmit
                    ? "w-full bg-[#4A5FBF] hover:bg-[#3A4FAF] text-white py-3"
                    : "w-full bg-gray-200 text-gray-400 py-3 cursor-not-allowed"
                }
              >
                {isRegistering ? "Creating account..." : "Create Account"}
              </Button>
            </form>

            <div className="mt-6">
              <p className="text-center text-gray-500 mb-4">Or Login With</p>
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
