"use client"

import { useState } from "react"
import { Star, Minus, Plus, Filter } from "lucide-react"
import ProductCard from "@/components/ProductCard"

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState("Large")
  const [selectedColor, setSelectedColor] = useState("brown")
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("reviews")

  const product = {
    name: "ONE LIFE GRAPHIC T-SHIRT",
    price: 260,
    originalPrice: 300,
    discount: 40,
    rating: 4.5,
    reviewCount: 67,
    description:
      "This graphic t-shirt which is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.",
    images: [
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
      "/placeholder.svg?height=400&width=400",
    ],
  }

  const colors = [
    { name: "Brown", value: "brown", color: "bg-amber-800" },
    { name: "Green", value: "green", color: "bg-green-600" },
    { name: "Navy", value: "navy", color: "bg-navy-900" },
  ]

  const sizes = ["Small", "Medium", "Large", "X-Large"]

  const reviews = [
    {
      name: "Samantha D.",
      rating: 5,
      date: "August 14, 2023",
      text: "I absolutely love this t-shirt! The design is unique and the fabric feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to shirt!",
    },
    {
      name: "Alex M.",
      rating: 4,
      date: "August 15, 2023",
      text: "The shirt exceeded my expectations! The colors are vibrant and the print quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this t-shirt definitely gets a thumbs up from me.",
    },
    {
      name: "Ethan R.",
      rating: 4,
      date: "August 16, 2023",
      text: "This t-shirt is a must-have for anyone who appreciates good design. The minimalistic yet stylish pattern caught my eye, and the fit is perfect. I can see the designer's touch in every aspect of this shirt.",
    },
    {
      name: "Olivia P.",
      rating: 5,
      date: "August 17, 2023",
      text: "As a UI/UX enthusiast, I value simplicity and functionality. This t-shirt not only represents those principles but also feels great to wear. It's evident that the designer poured their creativity into making this t-shirt stand out.",
    },
    {
      name: "Liam K.",
      rating: 4,
      date: "August 18, 2023",
      text: "This t-shirt is a fusion of comfort and creativity. The fabric is soft, and the design speaks volumes about the designer's skill. It's like wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.",
    },
    {
      name: "Ava H.",
      rating: 5,
      date: "August 19, 2023",
      text: "I'm not just wearing a t-shirt; I'm wearing a piece of design philosophy. The intricate details and thoughtful layout of the design make this shirt a conversation starter.",
    },
  ]

  const relatedProducts = [
    {
      id: "1",
      name: "Polo with Contrast Trims",
      image: "/placeholder.svg?height=300&width=300",
      price: 212,
      originalPrice: 242,
      rating: 4.0,
      reviewCount: 45,
      discount: 20,
    },
    {
      id: "2",
      name: "Gradient Graphic T-shirt",
      image: "/placeholder.svg?height=300&width=300",
      price: 145,
      rating: 3.5,
      reviewCount: 67,
    },
    {
      id: "3",
      name: "Polo with Tipping Details",
      image: "/placeholder.svg?height=300&width=300",
      price: 180,
      rating: 4.5,
      reviewCount: 89,
    },
    {
      id: "4",
      name: "Black Striped T-shirt",
      image: "/placeholder.svg?height=300&width=300",
      price: 120,
      originalPrice: 160,
      rating: 5.0,
      reviewCount: 123,
      discount: 30,
    },
  ]

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ))
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <span>Home</span>
        <span>/</span>
        <span>Shop</span>
        <span>/</span>
        <span>Men</span>
        <span>/</span>
        <span className="text-black font-medium">T-shirts</span>
      </nav>

      {/* Product Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
            <img
              src={product.images[0] || "/placeholder.svg"}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images.map((image, index) => (
              <div key={index} className="bg-gray-100 rounded-lg overflow-hidden aspect-square">
                <img
                  src={image || "/placeholder.svg"}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-black mb-4">{product.name}</h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">{renderStars(product.rating)}</div>
            <span className="text-sm text-gray-600">{product.rating}/5</span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-black">${product.price}</span>
            <span className="text-2xl text-gray-500 line-through">${product.originalPrice}</span>
            <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
              -{product.discount}%
            </span>
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">{product.description}</p>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-medium text-black mb-3">Select Colors</h3>
            <div className="flex space-x-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-10 h-10 rounded-full ${color.color} ${
                    selectedColor === color.value ? "ring-2 ring-black ring-offset-2" : ""
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Size Selection */}
          <div className="mb-8">
            <h3 className="font-medium text-black mb-3">Choose Size</h3>
            <div className="flex space-x-3">
              {sizes.map((size) => (
                <button
                  key={size}
                  onClick={() => setSelectedSize(size)}
                  className={`px-6 py-3 border rounded-full transition-colors ${
                    selectedSize === size
                      ? "bg-black text-white border-black"
                      : "border-gray-300 text-gray-700 hover:border-black"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center border border-gray-300 rounded-full">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 hover:bg-gray-100 transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-3 font-medium">{quantity}</span>
              <button onClick={() => setQuantity(quantity + 1)} className="p-3 hover:bg-gray-100 transition-colors">
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button className="flex-1 bg-black text-white py-4 px-8 rounded-full font-medium hover:bg-gray-800 transition-colors">
              Add to Cart
            </button>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mb-16">
        <div className="border-b border-gray-200 mb-8">
          <div className="flex space-x-8">
            {["Product Details", "Rating & Reviews", "FAQs"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab.toLowerCase().replace(" & ", "-").replace(" ", "-"))}
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab === tab.toLowerCase().replace(" & ", "-").replace(" ", "-")
                    ? "border-black text-black"
                    : "border-transparent text-gray-600 hover:text-black"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Reviews Content */}
        {activeTab === "rating-reviews" && (
          <div>
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold text-black">All Reviews ({reviews.length})</h3>
              <div className="flex items-center space-x-4">
                <button className="flex items-center space-x-2 text-gray-600 hover:text-black">
                  <Filter className="w-4 h-4" />
                  <span>Latest</span>
                </button>
                <button className="bg-black text-white px-6 py-2 rounded-full font-medium hover:bg-gray-800 transition-colors">
                  Write a Review
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reviews.map((review, index) => (
                <div key={index} className="border border-gray-200 rounded-lg p-6">
                  <div className="flex items-center mb-3">{renderStars(review.rating)}</div>
                  <div className="flex items-center mb-3">
                    <span className="font-medium text-black mr-2">{review.name}</span>
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  </div>
                  <p className="text-gray-600 mb-3 leading-relaxed">{review.text}</p>
                  <p className="text-sm text-gray-500">Posted on {review.date}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <button className="border border-gray-300 text-black px-8 py-3 rounded-full font-medium hover:bg-gray-50 transition-colors">
                Load More Reviews
              </button>
            </div>
          </div>
        )}
      </div>

      {/* You Might Also Like */}
      <section>
        <h2 className="text-3xl font-bold text-center text-black mb-12">YOU MIGHT ALSO LIKE</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProducts.map((product) => (
            <ProductCard key={product.id} {...product} />
          ))}
        </div>
      </section>
    </div>
  )
}
