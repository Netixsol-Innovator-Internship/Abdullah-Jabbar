"use client";

import Link from "next/link";

export default function Hero() {
  return (
    <section className="bg-[#F2F0F1]">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div>
            <h1 className="text-4xl lg:text-6xl font-bold text-black mb-6">
              FIND CLOTHES THAT MATCHES YOUR STYLE
            </h1>
            <p className="text-gray-600 text-lg mb-8 leading-relaxed">
              Browse through our diverse range of meticulously crafted garments,
              designed to bring out your individuality and cater to your sense
              of style.
            </p>
            <Link
              href="/shop"
              className="inline-block bg-black text-white px-8 py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
            >
              Shop Now
            </Link>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 mt-12">
              <div>
                <div className="text-3xl font-bold text-black">200+</div>
                <div className="text-gray-600">International Brands</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">2,000+</div>
                <div className="text-gray-600">High-Quality Products</div>
              </div>
              <div>
                <div className="text-3xl font-bold text-black">30,000+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
            </div>
          </div>

          {/* Right side - Images */}
          <div className="relative">
            <img
              src="/hero.jpg"
              alt="Fashion couple"
              className="rounded-lg object-cover w-full"
            />
            <img
              src="/star.svg"
              alt="star decoration"
              className="absolute top-24 right-6 w-24 h-24"
            />
            <img
              src="/star.svg"
              alt="star decoration"
              className="absolute top-72 left-2 w-14 h-14"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
