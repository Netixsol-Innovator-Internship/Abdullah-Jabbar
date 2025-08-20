import Hero from "../components/Hero";
import { GamesOnSale } from "../components/GamesOnSale";


export default function HomePage() {
  return (
    <div className="space-y-12 pb-16 max-w-270 mx-auto bg-zinc-900 ">
      <Hero />

   
        <GamesOnSale/>
  
    </div>
  );
}
