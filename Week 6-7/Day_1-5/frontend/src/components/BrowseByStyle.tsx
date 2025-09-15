// components/BrowseByStyle.tsx
"use client";

import Link from "next/link";

export default function BrowseByStyle() {
  return (
    <section className="relative mx-auto bg-[#F0F0F0] rounded-[48px] md:rounded-[64px] py-14 md:py-16 px-4 sm:px-6 lg:px-16">
      <h2 className="text-center font-extrabold uppercase tracking-tight text-3xl sm:text-4xl lg:text-5xl mb-12">
        Browse By Dress Style
      </h2>

      <div className="grid grid-cols-12 gap-6 md:gap-7">
        {/* Casual */}
        <Link
          href="/casual"
          aria-label="Browse Casual styles"
          className="group relative col-span-12 md:col-span-4 rounded-3xl overflow-hidden isolate bg-white shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-black/10 h-[220px] sm:h-[250px] md:h-[260px] lg:h-[300px]"
        >
          <img
            src="/browse/casual.png"
            alt="Casual"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover scale-x-[-1] transition-transform duration-500 group-hover:scale-105"
          />
          <div className="relative z-10 p-6 flex items-start">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Casual
            </h3>
          </div>
        </Link>

        {/* Formal */}
        <Link
          href="/formal"
          aria-label="Browse Formal styles"
          className="group relative col-span-12 md:col-span-8 rounded-3xl overflow-hidden isolate bg-white shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-black/10 h-[220px] sm:h-[250px] md:h-[260px] lg:h-[300px]"
        >
          <img
            src="/browse/formal.png"
            alt="Formal"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover object-[20%_center] transition-transform duration-500 group-hover:scale-105"
          />
          <div className="relative z-10 p-6 flex items-start">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Formal
            </h3>
          </div>
        </Link>

        {/* Party */}
        <Link
          href="/party"
          aria-label="Browse Party styles"
          className="group relative col-span-12 md:col-span-8 rounded-3xl overflow-hidden isolate bg-white shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-black/10 h-[220px] sm:h-[250px] md:h-[260px] lg:h-[300px]"
        >
          <img
            src="/browse/party.png"
            alt="Party"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="relative z-10 p-6 flex items-start">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Party
            </h3>
          </div>
        </Link>

        {/* Gym */}
        <Link
          href="/gym"
          aria-label="Browse Gym styles"
          className="group relative col-span-12 md:col-span-4 rounded-3xl overflow-hidden isolate bg-white shadow-sm hover:shadow-md transition-shadow focus:outline-none focus-visible:ring-4 focus-visible:ring-black/10 h-[220px] sm:h-[250px] md:h-[260px] lg:h-[300px]"
        >
          <img
            src="/browse/gym.png"
            alt="Gym"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
          <div className="relative z-10 p-6 flex items-start">
            <h3 className="text-2xl md:text-3xl font-semibold tracking-tight">
              Gym
            </h3>
          </div>
        </Link>
      </div>
    </section>
  );
}
