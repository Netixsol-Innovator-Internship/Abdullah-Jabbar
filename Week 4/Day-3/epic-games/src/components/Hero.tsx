"use client";
import React, { useState } from "react";

export default function Hero() {
  // Game list with their own metadata
  const [gameList] = useState([
    {
      id: 1,
      title: "God of War 4",
      description:
        "Kratos now lives as a man in the realm of Norse Gods and monsters. It is in this harsh, unforgiving world that he must fight to survive.",
      image: "hero/hero-gow.jpg",
      buttonText: "PRE-PURCHASE NOW",
      tagText: "PRE-PURCHASE AVAILABLE",
    },
    {
      id: 2,
      title: "Farcry 6 Golden Edition",
      description:
        "Fight for freedom in a tropical paradise under the regime of a ruthless dictator. Experience guerrilla warfare at its finest.",
      image: "hero/f6.jpg",
      buttonText: "BUY NOW",
      tagText: "AVAILABLE",
    },
    {
      id: 3,
      title: "GTA V",
      description:
        "Enter the dynamic world of Los Santos with three unique protagonists, endless missions, and limitless chaos.",
      image: "hero/gta5.jpg",
      buttonText: "GET THE GAME",
      tagText: "AVAILABLE",
    },
    {
      id: 4,
      title: "Outlast 2",
      description:
        "Immerse yourself in a terrifying psychological horror experience. Survival is the only option.",
      image: "hero/outlast2.png",
      buttonText: "BUY NOW",
      tagText: "AVAILABLE",
    },
  ]);

  // Featured game defaults to the first item in gameList
  const [featuredGame, setFeaturedGame] = useState(gameList[0]);

  return (
    <div className=" px-3 md:px-0 text-white py-2 font-sans antialiased flex items-center justify-center ">
      <div className="w-full flex flex-col md:flex-row gap-6 py-4 rounded-3xl">
        {/* Main featured game section */}
        <div className="relative w-full rounded-xl overflow-hidden shadow-lg">
          {/* Background image */}
          <img
            src={featuredGame.image}
            alt={featuredGame.title}
            className="w-full object-cover h-[250px] sm:h-[320px] md:h-[380px] lg:h-[432px] max-h-[432px]"
            onError={(e) => {
              (e.target as HTMLImageElement).src =
                "https://placehold.co/1000x500/000000/FFFFFF?text=GAME";
            }}
          />
          {/* Overlay content */}
          <div className="absolute inset-0 p-3 sm:p-5 md:p-7 lg:p-10 flex flex-col justify-end">
            <span className="text-xs  text-white py-1 mb-2 self-start backdrop-blur-sm">
              {featuredGame.tagText.toUpperCase()}
            </span>
            <h2 className="text-xl sm:text-2xl font-bold mb-2">
              {featuredGame.title}
            </h2>
            <p className="max-w-66 text-sm sm:text-base text-gray-200 mb-4 leading-relaxed">
              {featuredGame.description}
            </p>
            <button className="bg-white cursor-pointer hover:text-white hover:bg-sky-400 transition-colors text-black py-3 px-6 rounded-sm self-start shadow-xl">
              {featuredGame.buttonText.toUpperCase()}
            </button>
          </div>
        </div>

        {/* Side game list */}
        <div className="w-full md:w-1/3 flex flex-col gap-4">
          {gameList.map((game) => (
            <div
              key={game.id}
              onClick={() => setFeaturedGame(game)}
              className={`group flex items-center gap-4 p-3 rounded-xl cursor-pointer transition-colors ${
                featuredGame.id === game.id
                  ? "bg-zinc-700"
                  : "hover:bg-zinc-700"
              }`}
            >
              <img
                src={game.image}
                alt={game.title}
                className="w-16 h-16 rounded-lg object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://placehold.co/100x100/4F4F4F/FFFFFF?text=Game";
                }}
              />
              <span className="text-base font-semibold text-gray-100 group-hover:text-white">
                {game.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
