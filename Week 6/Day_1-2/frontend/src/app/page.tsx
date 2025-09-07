// app/page.tsx
"use client";

import Link from "next/link";
import ProductCard, {
  transformProductToCardProps,
} from "@/components/ProductCard";
import ReviewsSlider from "@/components/ReviewsSlider";
import Hero from "@/components/Hero";
import BrowseByStyle from "@/components/BrowseByStyle";
import {
  useGetNewArrivalsQuery,
  useGetFeaturedProductsQuery,
} from "@/lib/api/productsApiSlice";

export default function HomePage() {
  // Fetch new arrivals and featured products from the database
  const {
    data: newArrivalsData,
    isLoading: isLoadingNewArrivals,
    error: newArrivalsError,
  } = useGetNewArrivalsQuery({ limit: 4 });

  const {
    data: featuredProductsData,
    isLoading: isLoadingFeatured,
    error: featuredError,
  } = useGetFeaturedProductsQuery({ limit: 4 });

  // Transform API data to component props
  const newArrivals =
    newArrivalsData?.items?.map(transformProductToCardProps) || [];
  const topSelling =
    featuredProductsData?.items?.map(transformProductToCardProps) || [];

  // Fallback data for when API is loading or has errors
  const fallbackNewArrivals = [
    {
      id: "1",
      name: "T-shirt with Tape Details",
      image: "/new-arrival/na1.png",
      price: 120,
      rating: 4.5,
      reviewCount: 45,
    },
    {
      id: "2",
      name: "Skinny Fit Jeans",
      image: "/new-arrival/na2.png",
      price: 240,
      originalPrice: 260,
      rating: 3.5,
      reviewCount: 32,
      discount: 20,
    },
    {
      id: "3",
      name: "Checkered Shirt",
      image: "/new-arrival/na3.png",
      price: 180,
      rating: 4.5,
      reviewCount: 67,
    },
    {
      id: "4",
      name: "Sleeve Striped T-shirt",
      image: "/new-arrival/na4.png",
      price: 130,
      originalPrice: 160,
      rating: 4.5,
      reviewCount: 89,
      discount: 30,
    },
  ];

  const fallbackTopSelling = [
    {
      id: "5",
      name: "Vertical Striped Shirt",
      image: "/top-selling/ts1.png",
      price: 212,
      originalPrice: 232,
      rating: 5.0,
      reviewCount: 123,
      discount: 20,
    },
    {
      id: "6",
      name: "Courage Graphic T-shirt",
      image: "/top-selling/ts2.png",
      price: 145,
      rating: 4.0,
      reviewCount: 78,
    },
    {
      id: "7",
      name: "Loose Fit Bermuda Shorts",
      image: "/top-selling/ts3.png",
      price: 80,
      rating: 3.0,
      reviewCount: 45,
    },
    {
      id: "8",
      name: "Faded Skinny Jeans",
      image: "/top-selling/ts4.png",
      price: 210,
      rating: 4.5,
      reviewCount: 156,
    },
  ];

  // Use dynamic data if available, otherwise fallback to static data
  const displayNewArrivals =
    newArrivals.length > 0 ? newArrivals : fallbackNewArrivals;
  const displayTopSelling =
    topSelling.length > 0 ? topSelling : fallbackTopSelling;

  return (
    <div>
      <Hero />
      {/* Brand Logos */}
      <section className="bg-black py-8">
        <div className=" px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between space-x-8 overflow-x-auto">
            <img src="/logo-banner/versace.svg" alt="Versace" className="h-8" />
            <img src="/logo-banner/zara.svg" alt="Zara" className="h-8 " />
            <img src="/logo-banner/gucci.svg" alt="Gucci" className="h-8" />
            <img src="/logo-banner/prada.svg" alt="Prada" className="h-8" />
            <img
              src="/logo-banner/calvin.svg"
              alt="Calvin Klein"
              className="h-8 "
            />
          </div>
        </div>
      </section>

      {/* New Arrivals */}
      <section className="py-16">
        <div className="px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            NEW ARRIVALS
          </h2>

          {isLoadingNewArrivals ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg aspect-square mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayNewArrivals.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/new-arrivals"
              className="inline-block border border-gray-300 text-black px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      {/* Top Selling */}
      <section className="py-16 ">
        <div className=" px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            TOP SELLING
          </h2>

          {isLoadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg aspect-square mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {displayTopSelling.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/top-selling"
              className="inline-block border border-gray-300 text-black px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors"
            >
              View All
            </Link>
          </div>
        </div>
      </section>

      <BrowseByStyle />
      <ReviewsSlider />
    </div>
  );
}
