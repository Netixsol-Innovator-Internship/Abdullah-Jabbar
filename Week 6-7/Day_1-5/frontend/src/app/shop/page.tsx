// shop/page.tsx

"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import ProductCard, {
  transformProductToCardProps,
} from "@/components/ProductCard";
import { parsePrice } from "@/lib/api/productsApiSlice";
import { ChevronRight, ChevronUp, SlidersHorizontal } from "lucide-react";
import { useGetProductsQuery } from "@/lib/api/productsApiSlice";

export default function CasualPage() {
  const [priceRange, setPriceRange] = useState<[number, number]>([50, 200]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState("Most Popular");
  const [page, setPage] = useState(1);

  // Applied filters state (used for API calls)
  const [appliedFilters, setAppliedFilters] = useState({
    colors: [] as string[],
    sizes: [] as string[],
    // priceRange is optional for API calls — if undefined we won't send price filters
    priceRange: undefined as [number, number] | undefined,
  });

  // Apply price filter dynamically when user changes the slider.
  // Skip applying on initial mount so the default slider doesn't trigger a filter automatically.
  const _priceInitRef = useRef(false);
  useEffect(() => {
    // skip first run (initial render)
    if (!_priceInitRef.current) {
      _priceInitRef.current = true;
      return;
    }

    // debounce updates while user is dragging
    const t = setTimeout(() => {
      setAppliedFilters((prev) => ({ ...prev, priceRange: priceRange }));
      setPage(1);
    }, 250);

    return () => clearTimeout(t);
  }, [priceRange]);

  const [expanded, setExpanded] = useState<{
    categories: boolean;
    price: boolean;
    colors: boolean;
    size: boolean;
    dressStyle: boolean;
  }>({
    categories: true,
    price: true,
    colors: true,
    size: true,
    dressStyle: true,
  });

  // API call to fetch products with applied filters
  const {
    data: productsData,
    isLoading,
    error,
  } = useGetProductsQuery({
    page,
    limit: 20,
    colors:
      appliedFilters.colors.length > 0 ? appliedFilters.colors : undefined,
    sizes: appliedFilters.sizes.length > 0 ? appliedFilters.sizes : undefined,
    // only send price filters when a range has been applied
    minPrice: appliedFilters.priceRange
      ? appliedFilters.priceRange[0]
      : undefined,
    maxPrice: appliedFilters.priceRange
      ? appliedFilters.priceRange[1]
      : undefined,
  });

  const applyFilters = () => {
    setAppliedFilters({
      colors: selectedColors,
      sizes: selectedSizes,
      priceRange: priceRange,
    });
    setPage(1); // Reset to first page when applying filters
  };

  const clearFilters = () => {
    setSelectedColors([]);
    setSelectedSizes([]);
    setPriceRange([50, 200]);
    // reset applied filters and remove price filter so API fetches all prices
    setAppliedFilters({ colors: [], sizes: [], priceRange: undefined });
    setPage(1);
  };

  const toggle = (key: keyof typeof expanded) =>
    setExpanded((prev) => ({ ...prev, [key]: !prev[key] }));

  const sortedProducts = useMemo(() => {
    if (!productsData?.items) return [];

    const sortableItems = [...productsData.items];
    if (sortBy === "Price: Low to High") {
      sortableItems.sort(
        (a, b) => parsePrice(a.basePrice) - parsePrice(b.basePrice)
      );
    } else if (sortBy === "Price: High to Low") {
      sortableItems.sort(
        (a, b) => parsePrice(b.basePrice) - parsePrice(a.basePrice)
      );
    } else if (sortBy === "Most Popular") {
      sortableItems.sort(
        (a, b) => (b.ratingAverage || 0) - (a.ratingAverage || 0)
      );
    } else if (sortBy === "Newest") {
      sortableItems.sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
    }
    return sortableItems;
  }, [productsData?.items, sortBy]);

  const colors = [
    { name: "Green", value: "green", color: "bg-green-500" },
    { name: "Red", value: "red", color: "bg-red-500" },
    { name: "Yellow", value: "yellow", color: "bg-yellow-500" },
    { name: "Orange", value: "orange", color: "bg-orange-500" },
    { name: "Blue", value: "blue", color: "bg-blue-500" },
    { name: "Purple", value: "purple", color: "bg-purple-500" },
    { name: "Pink", value: "pink", color: "bg-pink-500" },
    { name: "White", value: "white", color: "bg-white border border-gray-300" },
    { name: "Black", value: "black", color: "bg-black" },
  ];

  const sizes = [
    "XX-Small",
    "X-Small",
    "Small",
    "Medium",
    "Large",
    "X-Large",
    "XX-Large",
    "3X-Large",
    "4X-Large",
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <span>Home</span>
        <span>/</span>
        <span className="text-black font-medium">Shop</span>
      </nav>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white border border-gray-200 rounded-lg p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-medium text-black">Filters</h3>
              <SlidersHorizontal className="w-5 h-5 text-gray-400" />
            </div>

            {/* Categories */}
            <div className="mb-8">
              <button
                onClick={() => toggle("categories")}
                className="w-full flex items-center justify-between mb-3 text-left"
                aria-expanded={expanded.categories}
              >
                <h4 className="font-medium text-black">Categories</h4>
                {expanded.categories ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-transform" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expanded.categories
                    ? "max-h-96 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-3">
                  {["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"].map(
                    (category) => (
                      <div
                        key={category}
                        className="flex items-center justify-between"
                      >
                        <span className="text-gray-700">{category}</span>
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <button
                onClick={() => toggle("price")}
                className="w-full flex items-center justify-between mb-4 text-left"
                aria-expanded={expanded.price}
              >
                <h4 className="font-medium text-black">Price</h4>
                {expanded.price ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-transform" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expanded.price ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-4">
                  <input
                    type="range"
                    min="50"
                    max="400"
                    value={priceRange[1]}
                    onChange={(e) =>
                      setPriceRange([
                        priceRange[0],
                        Number.parseInt(e.target.value),
                      ] as [number, number])
                    }
                    className="w-full"
                  />
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    <span>${priceRange[0]}</span>
                    <span>${priceRange[1]}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <button
                onClick={() => toggle("colors")}
                className="w-full flex items-center justify-between mb-4 text-left"
                aria-expanded={expanded.colors}
              >
                <h4 className="font-medium text-black">Colors</h4>
                {expanded.colors ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-transform" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expanded.colors ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="grid grid-cols-5 gap-3">
                  {colors.map((color) => (
                    <button
                      key={color.value}
                      onClick={() => {
                        if (selectedColors.includes(color.value)) {
                          setSelectedColors(
                            selectedColors.filter((c) => c !== color.value)
                          );
                        } else {
                          setSelectedColors([...selectedColors, color.value]);
                        }
                      }}
                      className={`w-8 h-8 rounded-full ${color.color} ${
                        selectedColors.includes(color.value)
                          ? "ring-2 ring-black ring-offset-2"
                          : ""
                      }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Size */}
            <div className="mb-8">
              <button
                onClick={() => toggle("size")}
                className="w-full flex items-center justify-between mb-4 text-left"
                aria-expanded={expanded.size}
              >
                <h4 className="font-medium text-black">Size</h4>
                {expanded.size ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-transform" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expanded.size ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                <div className="grid grid-cols-2 gap-2">
                  {sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => {
                        if (selectedSizes.includes(size)) {
                          setSelectedSizes(
                            selectedSizes.filter((s) => s !== size)
                          );
                        } else {
                          setSelectedSizes([...selectedSizes, size]);
                        }
                      }}
                      className={`px-3 py-2 text-sm border rounded-full transition-colors ${
                        selectedSizes.includes(size)
                          ? "bg-black text-white border-black"
                          : "border-gray-300 text-gray-700 hover:border-black"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Dress Style */}
            <div className="mb-8">
              <button
                onClick={() => toggle("dressStyle")}
                className="w-full flex items-center justify-between mb-4 text-left"
                aria-expanded={expanded.dressStyle}
              >
                <h4 className="font-medium text-black">Dress Style</h4>
                {expanded.dressStyle ? (
                  <ChevronUp className="w-4 h-4 text-gray-400 transition-transform" />
                ) : (
                  <ChevronRight className="w-4 h-4 text-gray-400 transition-transform" />
                )}
              </button>

              <div
                className={`overflow-hidden transition-all duration-300 ${
                  expanded.dressStyle
                    ? "max-h-40 opacity-100"
                    : "max-h-0 opacity-0"
                }`}
              >
                <div className="space-y-3">
                  {["Casual", "Formal", "Party", "Gym"].map((style) => (
                    <div
                      key={style}
                      className="flex items-center justify-between"
                    >
                      <span className="text-gray-700">{style}</span>
                      <ChevronRight className="w-4 h-4 text-gray-400" />
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <button
                onClick={applyFilters}
                className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Apply Filter
              </button>

              <button
                onClick={clearFilters}
                className="w-full border border-gray-300 text-gray-700 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center justify-center space-x-2"
                aria-label="Clear all filters"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 6 L14 14 M14 6 L6 14"
                  />
                </svg>
                <span>Clear All Filters</span>
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-black mb-2">Casual</h1>
              <p className="text-gray-600">
                Showing {sortedProducts.length} of {productsData?.total || 0}{" "}
                Products
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-600">Sort by:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"
              >
                <option>Most Popular</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Newest</option>
              </select>
            </div>
          </div>

          {/* Products Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 rounded-lg aspect-square mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">Error loading products</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : sortedProducts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 mb-4">No products found</p>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {sortedProducts.map((product) => (
                <ProductCard
                  key={product._id}
                  {...transformProductToCardProps(product)}
                />
              ))}
            </div>
          )}

          {/* Pagination */}
          {productsData && productsData.total > productsData.limit && (
            <div className="flex items-center justify-center space-x-2">
              <button
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
                className="px-3 py-2 text-gray-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Previous
              </button>

              {/* Calculate total pages */}
              {(() => {
                const totalPages = Math.ceil(
                  productsData.total / productsData.limit
                );
                const pages = [];

                for (let i = 1; i <= Math.min(totalPages, 5); i++) {
                  pages.push(
                    <button
                      key={i}
                      onClick={() => setPage(i)}
                      className={`px-3 py-2 rounded ${
                        page === i
                          ? "bg-black text-white"
                          : "text-gray-600 hover:text-black"
                      }`}
                    >
                      {i}
                    </button>
                  );
                }

                if (totalPages > 5) {
                  pages.push(
                    <span key="ellipsis" className="px-3 py-2">
                      ...
                    </span>
                  );
                  pages.push(
                    <button
                      key={totalPages}
                      onClick={() => setPage(totalPages)}
                      className={`px-3 py-2 rounded ${
                        page === totalPages
                          ? "bg-black text-white"
                          : "text-gray-600 hover:text-black"
                      }`}
                    >
                      {totalPages}
                    </button>
                  );
                }

                return pages;
              })()}

              <button
                onClick={() =>
                  setPage(
                    Math.min(
                      Math.ceil(productsData.total / productsData.limit),
                      page + 1
                    )
                  )
                }
                disabled={
                  page >= Math.ceil(productsData.total / productsData.limit)
                }
                className="px-3 py-2 text-gray-600 hover:text-black disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Next
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
