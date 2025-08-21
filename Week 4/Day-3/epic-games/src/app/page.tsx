import Hero from "../components/Hero";
import { GamesOnSale } from "../components/GamesOnSale";
import FeaturedTitles from "@/components/FeaturedTitles";
import { TopGames } from "@/components/TopGames";
import { MoreGames } from "@/components/MoreGames";
import { FreeGames } from "@/components/FreeGames";
import SearchNav from "@/components/SearchNav";

export default function HomePage() {
  return (
    <div className="space-y-0 pb-8 max-w-270 mx-auto bg-zinc-900 ">
      <SearchNav/>
      <Hero />
      <GamesOnSale heading="Sale" />
      <MoreGames />
      <FreeGames/>
      <TopGames />

      <MoreGames />
      <GamesOnSale heading="Achievements" />
      <FeaturedTitles />
    </div>
  );
}
