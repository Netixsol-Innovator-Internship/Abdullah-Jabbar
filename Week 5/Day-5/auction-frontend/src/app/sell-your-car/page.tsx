/* sell-your-car/page.tsx */
"use client";

import Head from "next/head";
import React, { useState } from "react";
import { HeroSection } from "@/components/hero-section";

type FormState = {
  partyType: "dealer" | "private";
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vin: string;
  year: string;
  make: string;
  model: string;
  mileage: string;
  engineSize: string;
  paint: string;
  gccSpecs: string;
  notes: string;
  accidentHistory: string;
  serviceHistory: string;
  modified: "stock" | "modified" | "";
  maxBid: string;
  photos?: FileList | null;
};

const initialState: FormState = {
  partyType: "dealer",
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  vin: "",
  year: "",
  make: "",
  model: "",
  mileage: "",
  engineSize: "",
  paint: "",
  gccSpecs: "",
  notes: "",
  accidentHistory: "",
  serviceHistory: "",
  modified: "",
  maxBid: "",
  photos: null,
};

export default function SellYourCarPage() {
  const [form, setForm] = useState<FormState>(initialState);
  const [errors, setErrors] = useState<
    Partial<Record<keyof FormState, string>>
  >({});
  const [submitting, setSubmitting] = useState(false);

  function update<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((s) => ({ ...s, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  }

  function validate() {
    const e: Partial<Record<keyof FormState, string>> = {};
    if (!form.firstName.trim()) e.firstName = "First name is required";
    if (!form.lastName.trim()) e.lastName = "Last name is required";
    if (!form.email.trim()) e.email = "Email is required";
    if (!form.phone.trim()) e.phone = "Phone number is required";
    if (!form.vin.trim()) e.vin = "VIN is required";
    if (!form.year.trim()) e.year = "Year is required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const v = validate();
    if (Object.keys(v).length) {
      setErrors(v);
      window.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }

    setSubmitting(true);
    try {
      // Build payload that matches backend CreateCarDto shape.
      // Assumptions: backend runs at http://localhost:4000 and accepts JSON POST /cars.
      // Also assume JWT (if present) is stored in localStorage under 'token' or 'accessToken'.

      const getToken = () => {
        if (typeof window === "undefined") return null;
        return (
          localStorage.getItem("token") || localStorage.getItem("accessToken")
        );
      };

      const parseJwt = (token?: string): Record<string, unknown> | null => {
        if (!token) return null;
        try {
          const payload = token.split(".")[1];
          // atob for base64 decode in browser
          const decoded = atob(payload.replace(/-/g, "+").replace(/_/g, "/"));
          // decodeURIComponent/escape to handle UTF-8
          return JSON.parse(decodeURIComponent(escape(decoded))) as Record<
            string,
            unknown
          >;
        } catch {
          return null;
        }
      };

      const token = getToken();
      const parsed = parseJwt(token ?? undefined);
      const getStringField = (
        keys: string[],
        obj?: Record<string, unknown>
      ) => {
        if (!obj) return undefined;
        for (const k of keys) {
          const v = obj[k];
          if (typeof v === "string") return v;
        }
        return undefined;
      };
      const sellerId = getStringField(
        ["sub", "id", "_id"],
        parsed ?? undefined
      );

      type CreatePayload = {
        sellerId?: string | undefined;
        title?: string;
        description?: string;
        make?: string;
        model?: string;
        year?: number;
        bodyType?: string;
        category?: string | undefined;
        photos?: string[];
        startingPrice?: number;
        currentPrice?: number | undefined;
        bids?: string[];
        isCompleted?: boolean;
        startTime?: string;
        endTime?: string;
      };

      const payload: CreatePayload = {
        sellerId,
        title: `${form.year} ${form.make} ${form.model}`.trim(),
        description: form.notes || undefined,
        make: form.make || undefined,
        model: form.model || undefined,
        year: form.year ? Number(form.year) : undefined,
        bodyType: "sedan", // default; adapt if you add a field to the UI
        category: undefined,
        photos: form.photos?.length
          ? Array.from(form.photos).map((f) => f.name)
          : [],
        startingPrice: form.maxBid
          ? Number(String(form.maxBid).replace(/[^0-9.-]+/g, ""))
          : 0,
        currentPrice: undefined,
        bids: [],
        isCompleted: false,
        startTime: new Date().toISOString(),
        endTime: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      };

      const res = await fetch("http://localhost:4000/cars", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(`Server responded ${res.status}: ${text}`);
      }

      const data = await res.json();
      console.log("Created car:", data);
      // Persist a minimal view-model for profile and auctions pages into localStorage
      try {
        const carForProfile = {
          id: data._id ?? String(Date.now()),
          title: data.title ?? payload.title,
          image:
            data.photos && data.photos.length
              ? data.photos[0]
              : "/placeholder.jpg",
          winningBid: `$${data.currentPrice ?? payload.startingPrice ?? 0}`,
          currentBid: `$${data.currentPrice ?? payload.startingPrice ?? 0}`,
          status: "active",
          totalBids: 0,
          timeLeft: { days: 7, hours: 0, mins: 0, secs: 0 },
          endTime: payload.endTime,
          description: data.description ?? payload.description,
        };

        // store in `myCars`
        const rawMyCars = localStorage.getItem("myCars");
        const myCars = rawMyCars ? JSON.parse(rawMyCars) : [];
        myCars.unshift(carForProfile);
        localStorage.setItem("myCars", JSON.stringify(myCars));

        // store in `auctions`
        const auctionItem = {
          id: carForProfile.id,
          name: carForProfile.title,
          image: carForProfile.image,
          price: carForProfile.currentBid,
          totalBids: carForProfile.totalBids,
          timeLeft: carForProfile.timeLeft,
          endTime: carForProfile.endTime,
          rating: 0,
          description: carForProfile.description,
          status: "trending",
        };
        const rawAuctions = localStorage.getItem("auctions");
        const auctions = rawAuctions ? JSON.parse(rawAuctions) : [];
        auctions.unshift(auctionItem);
        localStorage.setItem("auctions", JSON.stringify(auctions));
      } catch (err) {
        console.warn("Could not persist car to localStorage", err);
      }

      alert("Car created successfully.");
      setForm(initialState);
    } catch (err) {
      console.error(err);
      alert("Submission failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <HeroSection
        title="Sell Your Car"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Sell Your Car" }]}
      />
      <Head>
        <title>Sell Your Car — Tell us about your car</title>
        <meta
          name="description"
          content="Tell us about the car you want to sell"
        />
      </Head>

      <main className="bg-white py-10 min-h-[70vh]">
        <div className="max-w-5xl mx-auto px-4">
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 mb-2">
            Tell us about your car
          </h1>
          <p className="text-slate-600 mb-6">
            Please give us some basics about yourself and the car you would like
            to sell. We will also need details about the car s title status as
            well as photos that highlight the exterior and interior.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6" noValidate>
            <section className="bg-sky-50 border border-slate-200 rounded-lg p-5">
              <div className="mb-3 border-b pb-2">
                <h2 className="text-slate-800 font-medium">Your Info</h2>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Dealer or Private party?
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => update("partyType", "dealer")}
                    className={`px-3 py-1.5 rounded-md border text-sm ${
                      form.partyType === "dealer"
                        ? "bg-white border-sky-700 shadow-sm"
                        : "bg-white border-slate-300"
                    }`}
                  >
                    Dealer
                  </button>
                  <button
                    type="button"
                    onClick={() => update("partyType", "private")}
                    className={`px-3 py-1.5 rounded-md border text-sm ${
                      form.partyType === "private"
                        ? "bg-white border-sky-700 shadow-sm"
                        : "bg-white border-slate-300"
                    }`}
                  >
                    Private party
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    First name*
                  </label>
                  <input
                    value={form.firstName}
                    onChange={(e) => update("firstName", e.target.value)}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${errors.firstName ? "border-red-500" : "border-slate-300"}`}
                    aria-invalid={!!errors.firstName}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.firstName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Last name*
                  </label>
                  <input
                    value={form.lastName}
                    onChange={(e) => update("lastName", e.target.value)}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${errors.lastName ? "border-red-500" : "border-slate-300"}`}
                    aria-invalid={!!errors.lastName}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-red-600 mt-1">
                      {errors.lastName}
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Email*
                  </label>
                  <input
                    type="email"
                    value={form.email}
                    onChange={(e) => update("email", e.target.value)}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${errors.email ? "border-red-500" : "border-slate-300"}`}
                    aria-invalid={!!errors.email}
                  />
                  {errors.email && (
                    <p className="text-xs text-red-600 mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Phone number*
                  </label>
                  <input
                    value={form.phone}
                    onChange={(e) => update("phone", e.target.value)}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${errors.phone ? "border-red-500" : "border-slate-300"}`}
                    aria-invalid={!!errors.phone}
                  />
                  {errors.phone && (
                    <p className="text-xs text-red-600 mt-1">{errors.phone}</p>
                  )}
                </div>
              </div>
            </section>

            <section className="bg-sky-50 border border-slate-200 rounded-lg p-5">
              <div className="mb-3 border-b pb-2">
                <h2 className="text-slate-800 font-medium">Car Details</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    VIN*
                  </label>
                  <input
                    value={form.vin}
                    onChange={(e) => update("vin", e.target.value)}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${errors.vin ? "border-red-500" : "border-slate-300"}`}
                    aria-invalid={!!errors.vin}
                  />
                  {errors.vin && (
                    <p className="text-xs text-red-600 mt-1">{errors.vin}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Year*
                  </label>
                  <select
                    value={form.year}
                    onChange={(e) => update("year", e.target.value)}
                    className={`mt-1 block w-full rounded-md border px-3 py-2 text-sm ${errors.year ? "border-red-500" : "border-slate-300"}`}
                  >
                    <option value="">Select Year</option>
                    {Array.from({ length: 30 }).map((_, i) => {
                      const y = 2025 - i;
                      return (
                        <option key={y} value={String(y)}>
                          {y}
                        </option>
                      );
                    })}
                  </select>
                  {errors.year && (
                    <p className="text-xs text-red-600 mt-1">{errors.year}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Make*
                  </label>
                  <select
                    value={form.make}
                    onChange={(e) => update("make", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
                  >
                    <option value="">Select Make</option>
                    <option value="toyota">Toyota</option>
                    <option value="bmw">BMW</option>
                    <option value="honda">Honda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Model*
                  </label>
                  <select
                    value={form.model}
                    onChange={(e) => update("model", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
                  >
                    <option value="">All Models</option>
                    <option value="corolla">Corolla</option>
                    <option value="civic">Civic</option>
                    <option value="3series">3 Series</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Mileage (in miles)
                  </label>
                  <input
                    value={form.mileage}
                    onChange={(e) => update("mileage", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Engine size
                  </label>
                  <select
                    value={form.engineSize}
                    onChange={(e) => update("engineSize", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
                  >
                    <option value="">Select</option>
                    <option value="1.6">1.6 L</option>
                    <option value="2.0">2.0 L</option>
                    <option value="3.0">3.0 L</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Paint*
                  </label>
                  <select
                    value={form.paint}
                    onChange={(e) => update("paint", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
                  >
                    <option value="">Select</option>
                    <option value="white">White</option>
                    <option value="black">Black</option>
                    <option value="silver">Silver</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Has GCC Specs
                  </label>
                  <select
                    value={form.gccSpecs}
                    onChange={(e) => update("gccSpecs", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">
                  Noteworthy options/features
                </label>
                <textarea
                  value={form.notes}
                  onChange={(e) => update("notes", e.target.value)}
                  rows={5}
                  className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
                />
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Accident History
                  </label>
                  <select
                    value={form.accidentHistory}
                    onChange={(e) => update("accidentHistory", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
                  >
                    <option value="">Select</option>
                    <option value="none">None</option>
                    <option value="minor">Minor</option>
                    <option value="major">Major</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700">
                    Full Service History
                  </label>
                  <select
                    value={form.serviceHistory}
                    onChange={(e) => update("serviceHistory", e.target.value)}
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
                  >
                    <option value="">Select</option>
                    <option value="full">Full</option>
                    <option value="partial">Partial</option>
                    <option value="none">None</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 flex flex-col md:flex-row md:items-end md:gap-4 gap-3">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700">
                    Has the car been modified?
                  </label>
                  <div className="mt-2 flex gap-2">
                    <button
                      type="button"
                      onClick={() => update("modified", "stock")}
                      className={`px-3 py-1.5 rounded-md border text-sm ${form.modified === "stock" ? "border-sky-700 shadow-sm" : "border-slate-300"}`}
                    >
                      Completely stock
                    </button>
                    <button
                      type="button"
                      onClick={() => update("modified", "modified")}
                      className={`px-3 py-1.5 rounded-md border text-sm ${form.modified === "modified" ? "border-sky-700 shadow-sm" : "border-slate-300"}`}
                    >
                      Modified
                    </button>
                  </div>
                </div>

                <div className="w-full md:w-48">
                  <label className="block text-sm font-medium text-slate-700">
                    Max Bid*
                  </label>
                  <input
                    value={form.maxBid}
                    onChange={(e) => update("maxBid", e.target.value)}
                    placeholder="$"
                    className="mt-1 block w-full rounded-md border px-3 py-2 text-sm border-slate-300"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="block text-sm font-medium text-slate-700">
                  Upload Photos
                </label>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(e) => update("photos", e.target.files)}
                  className="mt-2 text-sm"
                />
              </div>

              <div className="mt-6">
                <button
                  type="submit"
                  disabled={submitting}
                  className={`inline-flex items-center px-4 py-2 rounded-md text-white font-medium ${submitting ? "bg-slate-400" : "bg-sky-800 hover:bg-sky-700"}`}
                >
                  {submitting ? "Submitting…" : "Submit"}
                </button>
              </div>
            </section>
          </form>
        </div>
      </main>
    </>
  );
}
