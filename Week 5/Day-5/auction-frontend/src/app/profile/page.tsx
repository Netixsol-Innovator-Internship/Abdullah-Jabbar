"use client";
import { useState } from "react";
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
  const myCars: Car[] = demoCars.slice(0, 2);
  const myBids: Car[] = demoCars.slice(0, 3);
  const wishlist: Car[] = demoCars.slice(2); // demo: rest of cars

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
                  {/* Personal Information (kept as-is) */}
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
                            src="/professional-headshot.png"
                            alt="Profile"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Full Name
                            </label>
                            <p className="text-gray-900">Manish Sharma</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Email
                            </label>
                            <p className="text-gray-900">manish@example.com</p>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">
                              Mobile Number
                            </label>
                            <p className="text-gray-900">1234567890</p>
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

                  {/* other personal sections omitted for brevity (password, address, traffic) - keep your earlier code here */}
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
