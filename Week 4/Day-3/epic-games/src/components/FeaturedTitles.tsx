import React from "react";
import Image from "next/image";
import Link from "next/link";
// Define a type for the game data to ensure type safety in TypeScript
interface Game {
  id: number;
  title: string;
  imageUrl: string;
  link: string;
}

// Dummy data for the game cards. In a real application, this would come from an API.
const games: Game[] = [
  {
    id: 1,
    title: "Dying Light 2",
    imageUrl: "https://placehold.co/200x250/1c1917/b3b3b3?text=Dying+Light+2",
    link: "#",
  },
  {
    id: 2,
    title: "Total War: Warhammer III",
    imageUrl: "https://placehold.co/200x250/1c1917/b3b3b3?text=Total+War",
    link: "#",
  },
  {
    id: 3,
    title: "God of War",
    imageUrl: "https://placehold.co/200x250/1c1917/b3b3b3?text=God+of+War",
    link: "#",
  },
  {
    id: 4,
    title: "Sifu",
    imageUrl: "https://placehold.co/200x250/1c1917/b3b3b3?text=Sifu",
    link: "#",
  },
];

// Main functional component for the "Explore Catalog" section
const FeaturedTitles: React.FC = () => {
  return (
    // The main container with a dark background and a radial gradient
    <section className="relative text-white  py-10 px-4 sm:px-6 lg:px-8 flex items-center justify-center overflow-hidden">
      {/* Absolute positioned gradient for the background effect */}

      {/* The content container to center everything and add padding */}
      <div className=" w-full h-full mx-auto flex flex-col lg:flex-row items-center justify-between gap-12">
        {/* Game card section */}

        <div className="h-full flex items-center justify-center w-7/12 ">
          <img
            src="/featured-titles.jpg"
            className=" object-cover rounded-lg shadow-2xl transition-all duration-300 "
          />
        </div>

        {/* Text content section */}
        <div className="flex-1 text-center lg:text-left ">
          {/* Main title */}
          <h2 className="text-xl md:text-2xl mb-4 tracking-tight">
            Explore our Catalog
          </h2>
          {/* Description text */}
          <p className="text-sm text-gray-300 max-w-lg lg:max-w-none">
            Browse by genre, features, price, and more to find your next
            favorite game.
          </p>
        </div>
      </div>
    </section>
  );
};

export default FeaturedTitles;
