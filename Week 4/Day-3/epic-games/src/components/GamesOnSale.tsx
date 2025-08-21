"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "./button";
import { Card } from "./card";
import { useState, useEffect } from "react";
import Image from "next/image";

const saleGames = [
  {
    id: "1",
    title: "Valorant",
    image: "/Valorant.jpg",
    originalPrice: "₹900",
    salePrice: "₹850",
    discount: "-10%",
  },
  {
    id: "2",
    title: "Assassin's creed Valhalla",
    image: "/assasinsCreed.png",
    originalPrice: "₹3,349",
    salePrice: "₹2,999",
    discount: "-20%",
  },
  {
    id: "3",
    title: "Red Dead Redemption 2",
    image: "/rr.png",
    originalPrice: "₹3,199",
    salePrice: "₹1,599",
    discount: "-50%",
  },
  {
    id: "4",
    title: "The Tomb Raider",
    image: "/tombRaider.png",
    originalPrice: "₹2,195",
    salePrice: "₹2,000",
    discount: "-20%",
  },
  {
    id: "5",
    title: "Cyberpunk 2077",
    image: "/Cyberpunk.png",
    originalPrice: "₹4,000",
    salePrice: "₹2,000",
    discount: "-50%",
  },
  {
    id: "6",
    title: "The Tomb Raider",
    image: "/tr2.jpg",
    originalPrice: "₹2,195",
    salePrice: "₹2,000",
    discount: "-20%",
  },
  {
    id: "7",
    title: "Uncharted 4",
    image: "/uncharted.jpg",
    price: 0,
    isFree: true,
    freeUntil: "Jul 25",
    category: "Horror",
    discount: "-20%",
  },
  {
    id: "8",
    title: "Daysgone",
    image: "/daysgone.jpg",
    originalPrice: "₹2,699",
    salePrice: "₹2,000",
    discount: "-20%",
  },
  {
    id: "9",
    title: "Warfare",
    image: "/warfare.jpg",
    originalPrice: "₹4,000",
    salePrice: "₹2,000",
    discount: "-50%",
  },
  {
    id: "10",
    title: "Fortnite",
    image: "/fortnite.jpg",
    price: 0,
    isFree: true,
    freeUntil: "Aug 5",
    category: "FPS",
    discount: "-20%",
  },
];

export function GamesOnSale({ heading }: { heading: string }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerView, setItemsPerView] = useState(5);

  // Adjust itemsPerView based on screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerView(1); // mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerView(3); // tablet
      } else {
        setItemsPerView(5); // desktop
      }
    };

    handleResize(); // run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev + itemsPerView >= saleGames.length ? 0 : prev + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? Math.max(0, saleGames.length - itemsPerView) : prev - 1
    );
  };

  return (
    <section className="py-1">
      <div className=" mx-auto px-4">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-white text-2xl font-bold">Games on {heading} ›</h2>
          <div className="flex space-x-2">
            <Button
              
              onClick={prevSlide}
              className="text-white hover:bg-gray-800"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <Button
              
              onClick={nextSlide}
              className="text-white hover:bg-gray-800"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Slider */}
        <div className="overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${currentIndex * (100 / itemsPerView)}%)`,
            }}
          >
            {saleGames.map((game) => (
              <div
                key={game.id}
                className="flex-shrink-0 px-2"
                style={{ width: `${100 / itemsPerView}%` }}
              >
                <Card className="bg-[#121212] border-[#121212] overflow-hidden hover:bg-gray-750 transition-colors">
                  <div className="relative w-full h-64">
                    <Image
                      src={game.image}
                      alt={game.title}
                      fill
                      className="object-cover"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">
                        {game.discount}
                      </span>
                    </div>
                  </div>
                  <div className="p-3">
                    <h3 className="text-white font-medium text-sm mb-2">
                      {game.title}
                    </h3>
                    <div className="flex items-center space-x-2">
                      {game.originalPrice && (
                        <span className="text-gray-400 line-through text-sm">
                          {game.originalPrice}
                        </span>
                      )}
                      <span className="text-white font-bold">
                        {game.salePrice || (game.isFree ? "Free" : "")}
                      </span>
                    </div>
                  </div>
                </Card>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}