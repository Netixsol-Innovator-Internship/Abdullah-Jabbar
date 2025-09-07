"use client";

import { useState, useEffect } from "react";
import { Star, Minus, Plus, Filter } from "lucide-react";
import Image from "next/image";
import ProductCard, {
  transformProductToCardProps,
} from "@/components/ProductCard";
import {
  useGetProductBySlugQuery,
  useGetProductsQuery,
  parsePrice,
} from "@/lib/api/productsApiSlice";
import { useAddToCartMutation } from "@/lib/api/cartApiSlice";

export default function ProductPage({ params }: { params: { id: string } }) {
  const [selectedSize, setSelectedSize] = useState("Large");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState("reviews");
  const [sessionId, setSessionId] = useState<string>("");

  // Generate or get session ID for guest users
  useEffect(() => {
    let storedSessionId = localStorage.getItem("cart-session-id");
    if (!storedSessionId) {
      storedSessionId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart-session-id", storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  // Fetch product data by slug
  const {
    data: product,
    isLoading,
    error,
  } = useGetProductBySlugQuery(params.id);

  // Add to cart mutation
  const [addToCart, { isLoading: isAddingToCart }] = useAddToCartMutation();

  // Handle adding product to cart
  const handleAddToCart = async () => {
    if (!product) return;

    try {
      await addToCart({
        productId: product._id,
        quantity,
        sessionId,
      }).unwrap();

      // Product added successfully - no alert needed
      console.log("Product added to cart successfully!");
    } catch (error) {
      console.error("Failed to add item to cart:", error);
      // You can replace this with a toast notification if needed
    }
  };

  // Fetch related products
  const { data: relatedProductsData } = useGetProductsQuery({
    limit: 4,
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
            <div className="bg-gray-200 aspect-square rounded-lg"></div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-6 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-20 bg-gray-200 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">
            Product Not Found
          </h1>
          <p className="text-gray-600 mb-4">
            The product you&apos;re looking for doesn&apos;t exist.
          </p>
          <a
            href="/shop"
            className="bg-black text-white px-6 py-2 rounded-full hover:bg-gray-800 transition-colors"
          >
            Back to Shop
          </a>
        </div>
      </div>
    );
  }

  // Transform product data for display — parse price values safely
  const basePrice = parsePrice(product.basePrice);
  const salePrice = product.salePrice ? parsePrice(product.salePrice) : null;
  const finalPrice = salePrice || basePrice;
  const originalPrice = product.isOnSale && salePrice ? basePrice : undefined;

  // Set default selected color if available
  if (
    !selectedColor &&
    product.availableColors &&
    product.availableColors.length > 0
  ) {
    setSelectedColor(product.availableColors[0]);
  }

  // Use available colors and sizes from product data
  const colors =
    product.availableColors?.map((color) => ({
      name: color.charAt(0).toUpperCase() + color.slice(1),
      value: color,
      color: `bg-${color.toLowerCase()}-500`,
    })) || [];

  const sizes = product.availableSizes || [
    "Small",
    "Medium",
    "Large",
    "X-Large",
  ];

  // Mock reviews for now - you could later create a reviews API
  const mockReviews = [
    {
      name: "Samantha D.",
      rating: 5,
      date: "August 14, 2023",
      text: "I absolutely love this product! The design is unique and the quality feels so comfortable. As a fellow designer, I appreciate the attention to detail. It's become my favorite go-to item!",
    },
    {
      name: "Alex M.",
      rating: 4,
      date: "August 15, 2023",
      text: "The product exceeded my expectations! The quality is top-notch. Being a UI/UX designer myself, I'm quite picky about aesthetics, and this definitely gets a thumbs up from me.",
    },
    {
      name: "Ethan R.",
      rating: 4,
      date: "August 16, 2023",
      text: "This product is a must-have for anyone who appreciates good design. The minimalistic yet stylish design caught my eye, and the fit is perfect.",
    },
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-current" : "text-gray-300"}`}
      />
    ));
  };

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
          <div className="bg-gray-100 rounded-lg overflow-hidden aspect-square relative">
            <Image
              src={product.images?.[0]?.url || "/placeholder.svg"}
              alt={product.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-4">
            {product.images?.slice(1, 4).map((image, index) => (
              <div
                key={index}
                className="bg-gray-100 rounded-lg overflow-hidden aspect-square relative"
              >
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={`${product.title} ${index + 2}`}
                  fill
                  className="object-cover cursor-pointer hover:opacity-80 transition-opacity"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div>
          <h1 className="text-3xl font-bold text-black mb-4">
            {product.title}
          </h1>

          <div className="flex items-center mb-4">
            <div className="flex items-center mr-4">
              {renderStars(product.ratingAverage || 0)}
            </div>
            <span className="text-sm text-gray-600">
              {product.ratingAverage || 0} ({product.reviewCount || 0} reviews)
            </span>
          </div>

          <div className="flex items-center space-x-4 mb-6">
            <span className="text-3xl font-bold text-black">${finalPrice}</span>
            {originalPrice && (
              <>
                <span className="text-2xl text-gray-500 line-through">
                  ${originalPrice}
                </span>
                {product.discountPercent && (
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-medium">
                    -{product.discountPercent}%
                  </span>
                )}
              </>
            )}
          </div>

          <p className="text-gray-600 mb-8 leading-relaxed">
            {product.description ||
              product.shortDescription ||
              "No description available."}
          </p>

          {/* Color Selection */}
          <div className="mb-6">
            <h3 className="font-medium text-black mb-3">Select Colors</h3>
            <div className="flex space-x-3">
              {colors.map((color) => (
                <button
                  key={color.value}
                  onClick={() => setSelectedColor(color.value)}
                  className={`w-10 h-10 rounded-full ${color.color} ${
                    selectedColor === color.value
                      ? "ring-2 ring-black ring-offset-2"
                      : ""
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
                className="p-3 hover:bg-gray-100 transition-colors rounded-l-full"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="px-4 py-3 font-medium">{quantity}</span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 hover:bg-gray-100 transition-colors rounded-r-full"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            <button
              onClick={handleAddToCart}
              disabled={isAddingToCart}
              className="flex-1 bg-black text-white py-4 px-8 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAddingToCart ? "Adding..." : "Add to Cart"}
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
                onClick={() =>
                  setActiveTab(
                    tab.toLowerCase().replace(" & ", "-").replace(" ", "-")
                  )
                }
                className={`py-4 px-2 border-b-2 font-medium transition-colors ${
                  activeTab ===
                  tab.toLowerCase().replace(" & ", "-").replace(" ", "-")
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
              <h3 className="text-xl font-bold text-black">
                All Reviews ({mockReviews.length})
              </h3>
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
              {mockReviews.map((review, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-6"
                >
                  <div className="flex items-center mb-3">
                    {renderStars(review.rating)}
                  </div>
                  <div className="flex items-center mb-3">
                    <span className="font-medium text-black mr-2">
                      {review.name}
                    </span>
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  </div>
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    {review.text}
                  </p>
                  <p className="text-sm text-gray-500">
                    Posted on {review.date}
                  </p>
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
        <h2 className="text-3xl font-bold text-center text-black mb-12">
          YOU MIGHT ALSO LIKE
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {relatedProductsData?.items?.slice(0, 4).map((relatedProduct) => (
            <ProductCard
              key={relatedProduct._id}
              {...transformProductToCardProps(relatedProduct)}
            />
          ))}
        </div>
      </section>
    </div>
  );
}
