import Hero from "../components/Hero";
import { GamesOnSale } from "../components/GamesOnSale";
import FeaturedTitles from "@/components/FeaturedTitles";
import { TopGames } from "@/components/TopGames";
import { MoreGames } from "@/components/MoreGames";

export default function HomePage() {
  return (
    <div className="space-y-4 pb-8 max-w-270 mx-auto bg-zinc-900 ">
      <Hero />
      <GamesOnSale heading="Sale" />
      <MoreGames />
      <TopGames />

      <MoreGames />
      <GamesOnSale heading="Achievements" />
      <FeaturedTitles />
    </div>
  );
}
