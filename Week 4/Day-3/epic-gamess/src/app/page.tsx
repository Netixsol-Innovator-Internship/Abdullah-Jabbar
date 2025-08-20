import Hero from "../components/Hero";
import FeaturedSlider from "../components/FeaturedSlider";
import { Suspense } from "react";

export default function HomePage() {
  return (
    <div className="space-y-12 pb-16 max-w-270 mx-auto bg-zinc-900 ">
      <Hero />
      <section >
        <h2 className="text-xl md:text-2xl font-semibold mb-4">Featured</h2>
        <Suspense fallback={<div>Loading featured…</div>}>
          <FeaturedSlider />
        </Suspense>
      </section>
    </div>
  );
}
