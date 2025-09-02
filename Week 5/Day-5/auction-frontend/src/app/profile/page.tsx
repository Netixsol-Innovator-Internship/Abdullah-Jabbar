"use client";
import { useState, useEffect } from "react";
import { Edit } from "lucide-react";

import { HeroSection } from "@/components/hero-section";
import { ProfileSidebar } from "@/components/profileSidebar";
import { CarCard } from "@/components/ProfileCarCard";
import { demoCars } from "@/data/demoCars";
import type { Car } from "@/types/car";

export default function ProfilePage() {
  const [active, setActive] = useState<
    "personal" | "cars" | "bids" | "wishlist"
  >("personal");

  // map data to specific tabs just like we did in the example visuals
  // load any user-created cars from localStorage (key: myCars)
  const [myCars, setMyCars] = useState<Car[]>(() => demoCars.slice(0, 2));
  const [myBids] = useState<Car[]>(demoCars.slice(0, 3));
  const [wishlist] = useState<Car[]>(demoCars.slice(2)); // demo: rest of cars

  // hydrate myCars from localStorage on mount
  useEffect(() => {
    try {
      const raw = localStorage.getItem("myCars");
      if (!raw) return;
      const parsed = JSON.parse(raw) as Car[];
      if (Array.isArray(parsed) && parsed.length) {
        // merge with demo: place user cars first but dedupe by id
        const seen = new Set<string>();
        const normalizeId = (v: unknown) => (v == null ? "" : String(v));
        const uniqueParsed: Car[] = [];
        for (const c of parsed) {
          const id = normalizeId((c as Car).id);
          if (!seen.has(id)) {
            seen.add(id);
            uniqueParsed.push(c);
          }
        }
        setMyCars((prev) => {
          const filteredPrev = prev.filter((p) => !seen.has(normalizeId(p.id)));
          return [...uniqueParsed, ...filteredPrev];
        });
      }
    } catch {
      // ignore
    }
  }, []);

  // read user from localStorage (expected shape: { id, username, email, fullName, mobileNumber })
  type StoredUser = {
    id?: string;
    username?: string;
    email?: string;
    fullName?: string;
    mobileNumber?: string;
  } | null;
  const [user, setUser] = useState<StoredUser>(null);

  useEffect(() => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw) return;
      const parsed = JSON.parse(raw);
      // some code stores an object like { user: { ... } } under the same key; handle both
      const u =
        parsed && typeof parsed === "object" && "user" in parsed
          ? (parsed.user as Record<string, unknown>)
          : parsed;
      setUser(u ?? null);
    } catch {
      setUser(null);
    }
  }, []);

  const handleAction = (car: Car) => {
    // placeholder - wire up modals / API calls here
    console.log("action for car", car.id);
  };

  return (
    <>
      <HeroSection
        title="My Profile"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "My Profile" }]}
      />

      <div className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar active={active} setActive={setActive} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3 space-y-6">
              {active === "personal" && (
                <>
                  {/* Personal Information */}
                  <div className="bg-white rounded-lg shadow-sm border">
                    <div className="bg-[#4A5FBF] text-white p-4 rounded-t-lg flex items-center justify-between">
                      <h2 className="text-lg font-semibold">
                        Personal Information
                      </h2>
                      <Edit className="w-5 h-5" />
                    </div>
                    <div className="p-6">
                      <div className="flex items-start gap-6">
                        <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200">
                          <img
                            src=""
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Full Name
                            </label>
                            <p className="text-gray-900">
                              {user?.fullName ??
                                user?.username ??
                                "Manish Sharma"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Email
                            </label>
                            <p className="text-gray-900">
                              {user?.email ?? "manish@example.com"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Mobile Number
                            </label>
                            <p className="text-gray-900">
                              {user?.mobileNumber ?? "1234567890"}
                            </p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Nationality
                            </label>
                            <p className="text-gray-900">India</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              ID Type
                            </label>
                            <p className="text-gray-900">Passport</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              ID Number
                            </label>
                            <p className="text-gray-900">345203</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {active === "cars" && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">My Cars</h2>
                    <div className="h-px bg-gray-200 flex-1 ml-6" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {myCars.map((car) => (
                      <CarCard
                        key={car.id}
                        car={car}
                        variant="mycars"
                        onAction={handleAction}
                      />
                    ))}
                  </div>
                </div>
              )}

              {active === "bids" && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">My Bids</h2>
                    <div className="h-px bg-gray-200 flex-1 ml-6" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {myBids.map((car) => (
                      <CarCard
                        key={car.id}
                        car={car}
                        variant="bids"
                        onAction={handleAction}
                      />
                    ))}
                  </div>
                </div>
              )}

              {active === "wishlist" && (
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">
                      Wishlist ({wishlist.length})
                    </h2>
                    <div className="h-px bg-gray-200 flex-1 ml-6" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {wishlist.map((car) => (
                      <CarCard
                        key={car.id}
                        car={car}
                        variant="wishlist"
                        onAction={handleAction}
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
