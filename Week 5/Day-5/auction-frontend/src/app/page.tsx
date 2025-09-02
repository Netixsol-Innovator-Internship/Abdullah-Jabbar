"use client";
import { useEffect, useState } from "react";
import { SearchFilters } from "@/components/search-filters";
import { CarCard } from "@/components/car-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default function HomePage() {
  const [isAuthed, setIsAuthed] = useState(false);

  useEffect(() => {
    try {
      setIsAuthed(Boolean(localStorage.getItem("token")));
    } catch {
      setIsAuthed(false);
    }

    const onStorage = (e: StorageEvent) => {
      if (e.key === "token") setIsAuthed(Boolean(e.newValue));
    };
    const onAuthChanged = () =>
      setIsAuthed(Boolean(localStorage.getItem("token")));
    window.addEventListener("storage", onStorage);
    window.addEventListener("authChanged", onAuthChanged as EventListener);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("authChanged", onAuthChanged as EventListener);
    };
  }, []);
  const liveAuctions = [
    {
      id: "1",
      name: "Mazda MX - 5",
      image: "/HomePage/mazda-mx5.png",
      price: "$1,079.99",
      currentBid: "$1,079.99",
      timeRemaining: "10 : 20 : 47",
      status: "trending" as const,
      rating: 5,
      endTime: "10 : 20 : 47",
      endType: "Waiting for Bid",
    },
    {
      id: "2",
      name: "Porsche 911",
      image: "/HomePage/porsche911.png",
      price: "$1,079.99",
      currentBid: "$1,079.99",
      timeRemaining: "10 : 20 : 47",
      status: "trending" as const,
      rating: 5,
      endTime: "10 : 20 : 47",
      endType: "Waiting for Bid",
    },
    {
      id: "3",
      name: "Alpine A110",
      image: "/HomePage/alpine-a110.png",
      price: "$1,079.99",
      currentBid: "$1,079.99",
      timeRemaining: "10 : 20 : 47",
      status: null,
      rating: 5,
      endTime: "10 : 20 : 47",
      endType: "Waiting for Bid",
    },
    {
      id: "4",
      name: "BMW M4",
      image: "/HomePage/bmw-m4.png",
      price: "$1,079.99",
      currentBid: "$1,079.99",
      timeRemaining: "10 : 20 : 47",
      status: "trending" as const,
      rating: 5,
      endTime: "10 : 20 : 47",
      endType: "Waiting for Bid",
    },
  ];

  return (
    <>
      {/* Hero Section */}
      <div
        className="relative bg-cover bg-center py-32 px-4"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('/hero.jpg')",
        }}
      >
        <div className="max-w-7xl mx-auto">
          <div className="max-w-2xl">
            <div className="bg-blue-100 text-[#4A5FBF] px-4 py-2 rounded-sm inline-block mb-6 text-sm font-medium">
              WELCOME TO AUCTION
            </div>
            <h1 className="text-5xl md:text-6xl font-medium text-white mb-6 leading-tight">
              Find Your Dream Car
            </h1>
            <p className="text-xl text-gray-200 mb-8 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur adipiscing elit. Tellus
              elementum cursus tincidunt sagittis elementum suspendisse velit
              arcu.
            </p>
          </div>

          <div className="mt-12">
            <SearchFilters />
          </div>
        </div>

        {/* Sign in / Register buttons */}
        {!isAuthed && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Link href="/login">
              <Button
                variant="outline"
                className="cursor-pointer text-white border-white hover:bg-white hover:text-gray-900 bg-transparent"
              >
                Sign in
              </Button>
            </Link>
            <Link href="/register">
              <Button className="cursor-pointer bg-[#4A5FBF] hover:bg-[#3A4FAF]">
                Register now
              </Button>
            </Link>
          </div>
        )}
      </div>

      {/* Live Auction Section */}
      <div className="bg-white py-16">
        <div className="bg-[#4A5FBF] py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-bold text-white mb-4">
                Live Auction
              </h2>
              <div className="w-16 h-1 bg-yellow-400 mx-auto"></div>
            </div>

            <div className="mb-8">
              <div className="border-b border-blue-400">
                <div className="inline-block border-b-2 border-yellow-400 pb-2">
                  <span className="text-white font-medium">Live Auction</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {liveAuctions.map((car) => (
                <CarCard key={car.id} {...car} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
