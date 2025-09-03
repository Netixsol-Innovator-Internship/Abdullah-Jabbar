"use client"

import { useState } from "react"
import ProductCard from "@/components/ProductCard"
import { ChevronDown, SlidersHorizontal } from "lucide-react"

export default function CasualPage() {
  const [priceRange, setPriceRange] = useState([50, 200])
  const [selectedColors, setSelectedColors] = useState<string[]>([])
  const [selectedSizes, setSelectedSizes] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("Most Popular")

  const products = [
    {
      id: "1",
      name: "Gradient Graphic T-shirt",
      image: "/placeholder.svg?height=300&width=300",
      price: 145,
      rating: 3.5,
      reviewCount: 67,
    },
    {
      id: "2",
      name: "Polo with Tipping Details",
      image: "/placeholder.svg?height=300&width=300",
      price: 180,
      rating: 4.5,
      reviewCount: 89,
    },
    {
      id: "3",
      name: "Black Striped T-shirt",
      image: "/placeholder.svg?height=300&width=300",
      price: 120,
      originalPrice: 160,
      rating: 5.0,
      reviewCount: 123,
      discount: 40,
    },
    {
      id: "4",
      name: "Skinny Fit Jeans",
      image: "/placeholder.svg?height=300&width=300",
      price: 240,
      originalPrice: 260,
      rating: 3.5,
      reviewCount: 45,
      discount: 20,
    },
    {
      id: "5",
      name: "Checkered Shirt",
      image: "/placeholder.svg?height=300&width=300",
      price: 180,
      rating: 4.5,
      reviewCount: 67,
    },
    {
      id: "6",
      name: "Sleeve Striped T-shirt",
      image: "/placeholder.svg?height=300&width=300",
      price: 130,
      originalPrice: 160,
      rating: 4.5,
      reviewCount: 89,
      discount: 30,
    },
    {
      id: "7",
      name: "Vertical Striped Shirt",
      image: "/placeholder.svg?height=300&width=300",
      price: 212,
      originalPrice: 232,
      rating: 5.0,
      reviewCount: 123,
      discount: 20,
    },
    {
      id: "8",
      name: "Courage Graphic T-shirt",
      image: "/orange-graphic-tshirt.png",
      price: 145,
      rating: 4.0,
      reviewCount: 78,
    },
    {
      id: "9",
      name: "Loose Fit Bermuda Shorts",
      image: "/placeholder.svg?height=300&width=300",
      price: 80,
      rating: 3.0,
      reviewCount: 45,
    },
  ]

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
  ]

  const sizes = ["XX-Small", "X-Small", "Small", "Medium", "Large", "X-Large", "XX-Large", "3X-Large", "4X-Large"]

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <span>Home</span>
        <span>/</span>
        <span className="text-black font-medium">Casual</span>
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
              <div className="space-y-3">
                {["T-shirts", "Shorts", "Shirts", "Hoodie", "Jeans"].map((category) => (
                  <div key={category} className="flex items-center justify-between">
                    <span className="text-gray-700">{category}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h4 className="font-medium text-black mb-4 flex items-center justify-between">
                Price
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </h4>
              <div className="space-y-4">
                <input
                  type="range"
                  min="50"
                  max="200"
                  value={priceRange[1]}
                  onChange={(e) => setPriceRange([priceRange[0], Number.parseInt(e.target.value)])}
                  className="w-full"
                />
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <span>${priceRange[0]}</span>
                  <span>${priceRange[1]}</span>
                </div>
              </div>
            </div>

            {/* Colors */}
            <div className="mb-8">
              <h4 className="font-medium text-black mb-4 flex items-center justify-between">
                Colors
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </h4>
              <div className="grid grid-cols-5 gap-3">
                {colors.map((color) => (
                  <button
                    key={color.value}
                    onClick={() => {
                      if (selectedColors.includes(color.value)) {
                        setSelectedColors(selectedColors.filter((c) => c !== color.value))
                      } else {
                        setSelectedColors([...selectedColors, color.value])
                      }
                    }}
                    className={`w-8 h-8 rounded-full ${color.color} ${
                      selectedColors.includes(color.value) ? "ring-2 ring-black ring-offset-2" : ""
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Size */}
            <div className="mb-8">
              <h4 className="font-medium text-black mb-4 flex items-center justify-between">
                Size
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {sizes.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      if (selectedSizes.includes(size)) {
                        setSelectedSizes(selectedSizes.filter((s) => s !== size))
                      } else {
                        setSelectedSizes([...selectedSizes, size])
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

            {/* Dress Style */}
            <div className="mb-8">
              <h4 className="font-medium text-black mb-4 flex items-center justify-between">
                Dress Style
                <ChevronDown className="w-4 h-4 text-gray-400" />
              </h4>
              <div className="space-y-3">
                {["Casual", "Formal", "Party", "Gym"].map((style) => (
                  <div key={style} className="flex items-center justify-between">
                    <span className="text-gray-700">{style}</span>
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  </div>
                ))}
              </div>
            </div>

            <button className="w-full bg-black text-white py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
              Apply Filter
            </button>
          </div>
        </div>

        {/* Products Grid */}
        <div className="flex-1">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold text-black mb-2">Casual</h1>
              <p className="text-gray-600">Showing 1-10 of 100 Products</p>
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
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {products.map((product) => (
              <ProductCard key={product.id} {...product} />
            ))}
          </div>

          {/* Pagination */}
          <div className="flex items-center justify-center space-x-2">
            <button className="px-3 py-2 text-gray-600 hover:text-black">Previous</button>
            {[1, 2, 3, "...", 8, 9, 10].map((page, index) => (
              <button
                key={index}
                className={`px-3 py-2 rounded ${page === 1 ? "bg-black text-white" : "text-gray-600 hover:text-black"}`}
              >
                {page}
              </button>
            ))}
            <button className="px-3 py-2 text-gray-600 hover:text-black">Next</button>
          </div>
        </div>
      </div>
    </div>
  )
}
