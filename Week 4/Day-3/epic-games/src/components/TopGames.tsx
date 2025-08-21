"use client";

import { Button } from "./button";
import Image from "next/image";

// Define a type for game objects
type Game = {
  id: string;
  title: string;
  price: string;
  image: string;
};

const topSellers: Game[] = [
  {
    id: "1",
    title: "Ghostbusters: Spirits Unleashed",
    price: "₹939",
    image: "/a.jpg",
  },
  {
    id: "2",
    title: "GTA V : Premier Edition",
    price: "₹2,499",
    image: "/b.png",
  },
  {
    id: "3",
    title: "Daysgone",
    price: "₹2,699",
    image: "/c.jpg",
  },
  {
    id: "4",
    title: "Last of Us",
    price: "₹1,499",
    image: "/d.jpg",
  },
  {
    id: "5",
    title: "God of War 4",
    price: "₹2,659",
    image: "/e.jpg",
  },
];

const bestSellers: Game[] = [
  {
    id: "1",
    title: "Fortnite",
    price: "Free",
    image: "/f.jpg",
  },
  {
    id: "2",
    title: "GTA V : Premier edition",
    price: "₹2,499",
    image: "/g.png",
  },
  {
    id: "3",
    title: "IGI 2",
    price: "₹499",
    image: "/h.jpg",
  },
  {
    id: "4",
    title: "Tomb Raider",
    price: "₹2,499",
    image: "/i.jpg",
  },
  {
    id: "5",
    title: "Uncharted 4",
    price: "₹3,499",
    image: "/j.jpg",
  },
];

const upcomingGames: Game[] = [
  {
    id: "1",
    title: "Hogwarts Legacy",
    price: "₹2,999",
    image: "/k.jpg",
  },
  {
    id: "2",
    title: "Uncharted Legacy of Thieves",
    price: "₹4,499",
    image: "/l.jpg",
  },
  {
    id: "3",
    title: "Assassin's Creed Mirage",
    price: "₹3,499",
    image: "/m.jpg",
  },
  {
    id: "4",
    title: "Last of Us II",
    price: "₹3,999",
    image: "/n.jpg",
  },
  {
    id: "5",
    title: "Dead by Daylight",
    price: "Coming Soon",
    image: "/o.jpg",
  },
];

// Props type for GameList
type GameListProps = {
  title: string;
  games: Game[];
  buttonText: string;
};

function GameList({ title, games, buttonText }: GameListProps) {
  return (
    <div className="rounded-lg p-y6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white text-xl font-bold">{title}</h3>
        <Button
          variant="outline"
          size="sm"
          className= "cursor-pointer border-white text-gray-300 hover:bg-white hover:text-gray-800"
        >
          {buttonText}
        </Button>
      </div>
      <div className="space-y-3">
        {games.map((game) => (
          <div
            key={game.id}
            className="flex items-center space-x-3 p-2 rounded transition-colors"
          >
            <Image
              src={game.image}
              alt={game.title}
              height={60}
              width={60}
              className="w-12 h-12 rounded object-cover"
            />
            <div className="flex-1">
              <h4 className="text-white text-sm font-medium">{game.title}</h4>
              <p className="text-gray-400 text-sm">{game.price}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function TopGames() {
  return (
    <section className="py-8 w-full mx-auto">
      <div className=" mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <GameList
            title="Top Sellers"
            games={topSellers}
            buttonText="view more"
          />
          <GameList
            title="Best Seller"
            games={bestSellers}
            buttonText="view more"
          />
          <GameList
            title="Top Upcoming game"
            games={upcomingGames}
            buttonText="view more"
          />
        </div>
      </div>
    </section>
  );
}
