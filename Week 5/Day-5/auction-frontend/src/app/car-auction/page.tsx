"use client";
import React, { useState, useEffect } from "react";
import { HeroSection } from "@/components/hero-section";
import { AuctionListingCard } from "@/components/auction-listing-card";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

type AuctionItem = {
  id: string;
  name: string;
  image?: string;
  price?: string;
  totalBids?: number;
  timeLeft?: Record<string, number>;
  endTime?: string;
  rating?: number;
  description?: string;
  status?: string | null;
};

export default function CarAuctionPage() {
  const [auctions, setAuctions] = useState<AuctionItem[]>(() => [
    {
      id: "1",
      name: "Kia Carnival",
      image: "/kia-carnival.png",
      price: "$1,07899.99",
      totalBids: 130,
      timeLeft: { days: 31, hours: 20, minutes: 40, seconds: 25 },
      endTime: "06:00pm 03 Jan 2023",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattiszzxzxzxz....",
      status: "trending" as const,
    },
    {
      id: "2",
      name: "Range Rover",
      image: "/white-range-rover-main.png",
      price: "$1,07899.99",
      totalBids: 130,
      timeLeft: { days: 31, hours: 20, minutes: 40, seconds: 25 },
      endTime: "06:00pm 03 Jan 2023",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattiszzxzxzxz....",
      status: "trending" as const,
    },
    {
      id: "3",
      name: "Bently",
      image: "/bentley-blue.png",
      price: "$1,07899.99",
      totalBids: 130,
      timeLeft: { days: 31, hours: 20, minutes: 40, seconds: 25 },
      endTime: "06:00pm 03 Jan 2023",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattiszzxzxzxz....",
      status: null,
    },
    {
      id: "4",
      name: "Hyundai Verna",
      image: "/hyundai-verna.png",
      price: "$1,07899.99",
      totalBids: 130,
      timeLeft: { days: 31, hours: 20, minutes: 40, seconds: 25 },
      endTime: "06:00pm 03 Jan 2023",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattiszzxzxzxz....",
      status: null,
    },
    {
      id: "5",
      name: "Mahindra Thar",
      image: "/mahindra-thar.png",
      price: "$1,07899.99",
      totalBids: 130,
      timeLeft: { days: 31, hours: 20, minutes: 40, seconds: 25 },
      endTime: "06:00pm 03 Jan 2023",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattiszzxzxzxz....",
      status: "trending" as const,
    },
    {
      id: "6",
      name: "Ferrari",
      image: "/ferrari-yellow.png",
      price: "$1,07899.99",
      totalBids: 130,
      timeLeft: { days: 31, hours: 20, minutes: 40, seconds: 25 },
      endTime: "06:00pm 03 Jan 2023",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattiszzxzxzxz....",
      status: null,
    },
    {
      id: "7",
      name: "BMW M4",
      image: "/yellow-bmw-m4-coupe.png",
      price: "$1,07899.99",
      totalBids: 130,
      timeLeft: { days: 31, hours: 20, minutes: 40, seconds: 25 },
      endTime: "06:00pm 03 Jan 2023",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattiszzxzxzxz....",
      status: null,
    },
    {
      id: "8",
      name: "Maruti Brezza",
      image: "/maruti-brezza.png",
      price: "$1,07899.99",
      totalBids: 130,
      timeLeft: { days: 31, hours: 20, minutes: 40, seconds: 25 },
      endTime: "06:00pm 03 Jan 2023",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattiszzxzxzxz....",
      status: null,
    },
    {
      id: "9",
      name: "Jaguar XF",
      image: "/jaguar-xf.png",
      price: "$1,07899.99",
      totalBids: 130,
      timeLeft: { days: 31, hours: 20, minutes: 40, seconds: 25 },
      endTime: "06:00pm 03 Jan 2023",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattiszzxzxzxz....",
      status: null,
    },
    {
      id: "10",
      name: "Tata Tiago",
      image: "/tata-tiago.png",
      price: "$1,07899.99",
      totalBids: 130,
      timeLeft: { days: 31, hours: 20, minutes: 40, seconds: 25 },
      endTime: "06:00pm 03 Jan 2023",
      rating: 5,
      description:
        "Lorem ipsum dolor sit amet consectetur. Velit amet aenean sed nunc. Malesuada dignissim viverra praesent aenean nulla mattiszzxzxzxz....",
      status: "trending" as const,
    },
  ]);

  // On mount, load user-created auctions saved to localStorage and prepend them
  // This keeps the static demo list but shows newly posted items first.
  useEffect(() => {
    try {
      const raw = localStorage.getItem("auctions");
      if (!raw) return;
      const saved = JSON.parse(raw) as AuctionItem[];
      if (Array.isArray(saved) && saved.length) {
        setAuctions((prev) => {
          // Merge saved auctions with the default list and dedupe by id
          const merged = [...saved, ...prev];
          const seen = new Set<string>();
          return merged.filter((auction) => {
            if (!auction || !auction.id) return false;
            if (seen.has(auction.id)) return false;
            seen.add(auction.id);
            return true;
          });
        });
      }
    } catch {
      // ignore
    }
  }, []);

  const isTimeLeft = (
    t: unknown
  ): t is { days: number; hours: number; minutes: number; seconds: number } => {
    return (
      !!t && typeof t === "object" && "days" in (t as Record<string, unknown>)
    );
  };

  return (
    <>
      <HeroSection
        title="Auction"
        description="Lorem ipsum dolor sit amet consectetur. At in pretium semper vitae eu eu mus."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Auction", href: "/car-auction" },
        ]}
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Column - Auction Listings */}
          <div className="lg:col-span-3">
            {/* Results Header */}
            <div className="bg-[#4A5FBF] text-white p-4 rounded-lg flex items-center justify-between mb-6">
              <span className="text-sm">Showing 1-5 of 10 Results</span>
              <Select>
                <SelectTrigger className="w-40 bg-white text-black">
                  <SelectValue placeholder="Sort by Relevance" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="relevance">Sort by Relevance</SelectItem>
                  <SelectItem value="price-low">Price: Low to High</SelectItem>
                  <SelectItem value="price-high">Price: High to Low</SelectItem>
                  <SelectItem value="newest">Newest First</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-6">
              {auctions.map((car) => {
                const statusAllowed =
                  car.status &&
                  ["trending", "ending", "new"].includes(String(car.status))
                    ? (car.status as "trending" | "ending" | "new")
                    : null;
                return (
                  <AuctionListingCard
                    key={car.id}
                    id={car.id}
                    name={car.name}
                    image={car.image ?? "/placeholder.svg"}
                    price={car.price ?? "$0"}
                    totalBids={car.totalBids ?? 0}
                    timeLeft={{
                      days: isTimeLeft(car.timeLeft) ? car.timeLeft.days : 0,
                      hours: isTimeLeft(car.timeLeft) ? car.timeLeft.hours : 0,
                      minutes: isTimeLeft(car.timeLeft)
                        ? car.timeLeft.minutes
                        : 0,
                      seconds: isTimeLeft(car.timeLeft)
                        ? car.timeLeft.seconds
                        : 0,
                    }}
                    endTime={car.endTime ?? ""}
                    rating={car.rating ?? 0}
                    description={car.description ?? ""}
                    status={statusAllowed}
                  />
                );
              })}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-center gap-2 mt-8">
              <Button variant="ghost" size="sm">
                &lt;
              </Button>
              <Button variant="default" size="sm" className="bg-[#4A5FBF]">
                1
              </Button>
              <Button variant="ghost" size="sm">
                2
              </Button>
              <Button variant="ghost" size="sm">
                3
              </Button>
              <Button variant="ghost" size="sm">
                4
              </Button>
              <Button variant="ghost" size="sm">
                5
              </Button>
              <span className="mx-2">...</span>
              <Button variant="ghost" size="sm">
                10
              </Button>
              <Button variant="ghost" size="sm">
                &gt;
              </Button>
            </div>
          </div>

          {/* Right Column - Filters */}
          <div className="lg:col-span-1">
            <Card>
              <div className="bg-[#4A5FBF] text-white p-4 rounded-t-lg">
                <h3 className="font-semibold">Filter By</h3>
              </div>
              <CardContent className="p-4 space-y-4">
                <div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Car Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sedan">Sedan</SelectItem>
                      <SelectItem value="suv">SUV</SelectItem>
                      <SelectItem value="hatchback">Hatchback</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Color" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="white">White</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="blue">Blue</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Makes" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bmw">BMW</SelectItem>
                      <SelectItem value="audi">Audi</SelectItem>
                      <SelectItem value="mercedes">Mercedes</SelectItem>
                      <SelectItem value="toyota">Toyota</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Car Model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="model1">Model 1</SelectItem>
                      <SelectItem value="model2">Model 2</SelectItem>
                      <SelectItem value="model3">Model 3</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select>
                    <SelectTrigger>
                      <SelectValue placeholder="Any Style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="luxury">Luxury</SelectItem>
                      <SelectItem value="sport">Sport</SelectItem>
                      <SelectItem value="classic">Classic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Slider */}
                <div className="space-y-3">
                  <div className="w-full">
                    <Slider
                      defaultValue={[50]}
                      max={100}
                      step={1}
                      className="w-full"
                    />
                  </div>
                  <Button className="w-full bg-yellow-500 hover:bg-yellow-600 text-black font-semibold">
                    Filter
                  </Button>
                  <div className="text-center text-sm text-gray-600">
                    Price: $50,000 - $80,000
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </>
  );
}
