"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useGetCartQuery, useClearCartMutation } from "@/lib/api/cartApiSlice";
import { useCreateOrderMutation } from "@/lib/api/ordersApiSlice";
import { useAuth } from "@/hooks/use-auth-rtk";
import { getAuthToken } from "@/lib/auth-utils";

interface CheckoutFormData {
  billingAddress: {
    fullName: string;
    street1: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  paymentMethod: string;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [sessionId, setSessionId] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<CheckoutFormData>({
    billingAddress: {
      fullName: "",
      street1: "",
      city: "",
      state: "",
      postalCode: "",
      country: "United States",
    },
    paymentMethod: "stripe",
  });

  // Get current user if authenticated
  const { user, isAuthenticated } = useAuth();

  // Generate or get session ID for guest users
  useEffect(() => {
    let storedSessionId = localStorage.getItem("cart-session-id");
    if (!storedSessionId) {
      storedSessionId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart-session-id", storedSessionId);
    }
    setSessionId(storedSessionId);
  }, []);

  // Populate form with user's info if authenticated
  // Populate form with user's info if authenticated
  useEffect(() => {
    if (isAuthenticated && user?.addresses && user.addresses.length > 0) {
      const defaultAddress =
        user.addresses.find((addr) => addr.isDefault) || user.addresses[0];
      if (defaultAddress) {
        setFormData((prev) => ({
          ...prev,
          billingAddress: {
            fullName: defaultAddress.fullName || user.name || "",
            street1: defaultAddress.street1 || "",
            city: defaultAddress.city || "",
            state: defaultAddress.state || "",
            postalCode: defaultAddress.postalCode || "",
            country: defaultAddress.country || "United States",
          },
        }));
      }
    } else if (isAuthenticated && user?.name) {
      setFormData((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          fullName: user.name ?? "",
        },
      }));
    }
  }, [isAuthenticated, user]);

  // Fetch cart data
  const {
    data: cartData,
    isLoading: cartLoading,
    isError: cartError,
  } = useGetCartQuery(
    { sessionId },
    {
      skip: !sessionId,
    }
  );

  // Debug cart data and check for missing product info
  useEffect(() => {
    if (cartData) {
      console.log("Cart data in checkout:", cartData);
      console.log("Cart items:", cartData.items);

      let missingProductData = false;
      cartData.items.forEach((item, index) => {
        console.log(`Item ${index}:`, {
          productId: item.productId,
          product: item.product,
          title: item.product?.title || item.title,
          image:
            item.product?.images?.[0]?.url ||
            item.product?.featuredImage ||
            item.featuredImage,
          price: item.price,
          quantity: item.qty || item.quantity,
        });

        if (!item.product || !item.product.title) {
          missingProductData = true;
          console.warn(`Item ${index} is missing product data:`, item);
        }
      });

      if (missingProductData) {
        console.warn(
          "Some cart items are missing product data. This might cause display issues."
        );
        // You could add a refetch mechanism here if needed
      }
    }
  }, [cartData]);

  const [createOrder] = useCreateOrderMutation();
  const [clearCart] = useClearCartMutation();

  // Calculate totals
  const subtotal =
    cartData?.items?.reduce((total: number, item: any) => {
      return total + (item.price || 0) * (item.qty || item.quantity || 1);
    }, 0) || 0;

  const discount = Math.round(subtotal * 0.2); // 20% discount
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  const handleInputChange = (field: string, value: string) => {
    if (field.startsWith("billingAddress.")) {
      const addressField = field.replace("billingAddress.", "");
      setFormData((prev) => ({
        ...prev,
        billingAddress: {
          ...prev.billingAddress,
          [addressField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Enforce login before checkout for payment processing
    if (!isAuthenticated) {
      const goLogin = confirm(
        "You need to log in to place an order. Go to login now?"
      );
      if (goLogin) router.push("/authForm");
      return;
    }

    // Check if token exists
    const token = getAuthToken();
    if (!token) {
      alert("You need to log in again to place an order.");
      router.push("/authForm");
      return;
    }

    if (!cartData?.items || cartData.items.length === 0) {
      alert("Your cart is empty!");
      router.push("/cart");
      return;
    }

    setIsLoading(true);

    try {
      console.log("Starting checkout process...");

      // Create the order data with billing address as shipping address
      const orderData = {
        paymentMethod: formData.paymentMethod,
        shippingAddress: {
          fullName: formData.billingAddress.fullName,
          street1: formData.billingAddress.street1,
          city: formData.billingAddress.city,
          state: formData.billingAddress.state,
          postalCode: formData.billingAddress.postalCode,
          country: formData.billingAddress.country,
        },
      };

      // Attach cart identifier
      const cartId = cartData?._id;
      if (cartId) {
        (orderData as any).cartId = cartId;
      } else if (sessionId) {
        (orderData as any).sessionId = sessionId;
      }

      console.log("Order data:", orderData);

      const orderResult = await createOrder(orderData).unwrap();
      console.log("Order created successfully:", orderResult);

      // If backend returned a Stripe checkout URL, redirect the user to complete payment
      if (orderResult && (orderResult as any).checkoutUrl) {
        const checkoutUrl = (orderResult as any).checkoutUrl as string;
        console.log("Redirecting to Stripe Checkout:", checkoutUrl);
        window.location.href = checkoutUrl;
        return;
      }

      // If no checkout URL, something went wrong
      throw new Error("No checkout URL returned from server");
    } catch (error) {
      console.error("Failed to place order:", error);

      if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as {
          message?: string;
          statusCode?: number;
        };

        if (errorData?.statusCode === 401) {
          const goLogin = confirm(
            "Your session has expired. Please log in again to continue."
          );
          if (goLogin) {
            router.push("/authForm");
            return;
          }
        } else {
          alert(
            `Failed to place order: ${errorData?.message || "Unknown error"}. Please try again.`
          );
        }
      } else {
        alert("Failed to place order. Please try again.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (cartLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (cartError || !cartData?.items || cartData.items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add some products to your cart before checking out.
          </p>
          <Link
            href="/shop"
            className="bg-black text-white py-3 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <span>/</span>
        <Link href="/cart" className="hover:text-black">
          Cart
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Checkout</span>
      </nav>

      <h1 className="text-3xl font-bold text-black mb-8">CHECKOUT</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Checkout Form */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Billing Address */}
            <div>
              <h3 className="text-lg font-bold text-black mb-4">
                Billing Address
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label
                    htmlFor="billingFullName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="billingFullName"
                    value={formData.billingAddress.fullName}
                    onChange={(e) =>
                      handleInputChange(
                        "billingAddress.fullName",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div className="md:col-span-2">
                  <label
                    htmlFor="billingStreet1"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Address *
                  </label>
                  <input
                    type="text"
                    id="billingStreet1"
                    value={formData.billingAddress.street1}
                    onChange={(e) =>
                      handleInputChange(
                        "billingAddress.street1",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="billingCity"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    City *
                  </label>
                  <input
                    type="text"
                    id="billingCity"
                    value={formData.billingAddress.city}
                    onChange={(e) =>
                      handleInputChange("billingAddress.city", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="billingState"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    State *
                  </label>
                  <input
                    type="text"
                    id="billingState"
                    value={formData.billingAddress.state}
                    onChange={(e) =>
                      handleInputChange("billingAddress.state", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="billingPostalCode"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Postal Code *
                  </label>
                  <input
                    type="text"
                    id="billingPostalCode"
                    value={formData.billingAddress.postalCode}
                    onChange={(e) =>
                      handleInputChange(
                        "billingAddress.postalCode",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="billingCountry"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Country *
                  </label>
                  <select
                    id="billingCountry"
                    value={formData.billingAddress.country}
                    onChange={(e) =>
                      handleInputChange(
                        "billingAddress.country",
                        e.target.value
                      )
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
                    required
                  >
                    <option value="United States">United States</option>
                    <option value="Canada">Canada</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="Australia">Australia</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div>
              <h3 className="text-lg font-bold text-black mb-4">
                Payment Method
              </h3>
              <div className="bg-blue-50 border border-blue-200 rounded-md p-4 mb-4">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <svg
                      className="w-5 h-5 text-blue-600 mt-0.5"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">
                      Secure Payment Processing
                    </p>
                    <p className="text-sm text-blue-700 mt-1">
                      After clicking &ldquo;Place Order&rdquo;, you&apos;ll be
                      redirected to Stripe&apos;s secure checkout page to
                      complete your payment with your credit or debit card.
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="stripe"
                    checked={formData.paymentMethod === "stripe"}
                    onChange={(e) =>
                      handleInputChange("paymentMethod", e.target.value)
                    }
                    className="mr-3"
                  />
                  <span className="text-gray-700 font-medium">
                    Credit/Debit Card (Stripe)
                  </span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-black text-white py-4 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Place Order"}
            </button>
          </form>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
          <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>

          {/* Cart Items */}
          <div className="space-y-4 mb-6">
            {cartData.items.map((item: any, index: number) => {
              console.log(`Checkout Item ${index}:`, item); // Debug log

              // Handle different possible image sources with better fallback
              let imageUrl = "/placeholder.svg"; // Default fallback

              // Check for images in the product object
              if (
                item.product?.images &&
                Array.isArray(item.product.images) &&
                item.product.images.length > 0
              ) {
                imageUrl = item.product.images[0].url || item.product.images[0];
              } else if (item.product?.featuredImage) {
                imageUrl = item.product.featuredImage;
              } else if (item.product?.image) {
                imageUrl = item.product.image;
              } else if (item.featuredImage) {
                imageUrl = item.featuredImage;
              } else if (item.image) {
                imageUrl = item.image;
              }

              // Handle different possible title sources - avoid showing object IDs
              let productTitle = "Loading product...";

              if (item.product?.title) {
                productTitle = item.product.title;
              } else if (item.product?.name) {
                productTitle = item.product.name;
              } else if (item.title && typeof item.title === "string") {
                productTitle = item.title;
              } else if (item.name && typeof item.name === "string") {
                productTitle = item.name;
              } else {
                // If we only have a productId, try to make it more user-friendly
                const productId = item.productId || item._id;
                productTitle = `Product (ID: ${productId?.toString().slice(-8) || "Unknown"})`;
              }

              console.log(`Product title resolved to: "${productTitle}"`); // Debug log
              console.log(`Image URL resolved to: "${imageUrl}"`); // Debug log

              return (
                <div
                  key={`${item.productId || item._id}-${index}`}
                  className="flex items-center space-x-4"
                >
                  <div className="w-16 h-16 bg-gray-200 rounded-md flex-shrink-0 overflow-hidden relative">
                    {imageUrl === "/placeholder.svg" ? (
                      // Show a custom placeholder when no image is available
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <svg
                          className="w-8 h-8 text-gray-500"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                      </div>
                    ) : (
                      <Image
                        src={imageUrl}
                        alt={productTitle}
                        fill
                        className="object-cover rounded-md"
                        sizes="64px"
                        onError={() => {
                          console.log(`Image failed to load: ${imageUrl}`);
                        }}
                        onLoad={() => {
                          console.log(`Image loaded successfully: ${imageUrl}`);
                        }}
                        placeholder="blur"
                        blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R7mRcH4/9k="
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900">
                      {productTitle}
                    </h4>
                    <p className="text-sm text-gray-600">
                      Qty: {item.qty || item.quantity || 1}
                    </p>

                    {/* Show product ID for debugging if needed */}
                    {productTitle.includes("Product (ID:") && (
                      <p className="text-xs text-orange-600 mt-1">
                        ⚠️ Product details not loaded - showing fallback
                      </p>
                    )}

                    {/* Show product variant info if available */}
                    {(item.selectedSize || item.selectedColor) && (
                      <p className="text-xs text-gray-500">
                        {item.selectedSize && `Size: ${item.selectedSize}`}
                        {item.selectedSize && item.selectedColor && " • "}
                        {item.selectedColor && `Color: ${item.selectedColor}`}
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-medium text-gray-900">
                      $
                      {(
                        (item.price || 0) * (item.qty || item.quantity || 1)
                      ).toFixed(2)}
                    </p>
                    {(item.qty || item.quantity) > 1 && (
                      <p className="text-xs text-gray-500">
                        ${(item.price || 0).toFixed(2)} each
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Totals */}
          <div className="space-y-4 mb-6">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-black">
                ${subtotal.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Discount (-20%)</span>
              <span className="font-medium text-red-600">
                -${discount.toFixed(2)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Delivery Fee</span>
              <span className="font-medium text-black">${deliveryFee}</span>
            </div>
            <div className="border-t border-gray-200 pt-4">
              <div className="flex justify-between">
                <span className="text-lg font-medium text-black">Total</span>
                <span className="text-xl font-bold text-black">
                  ${total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="text-center">
            <Link
              href="/cart"
              className="text-gray-600 hover:text-black text-sm font-medium"
            >
              ← Back to Cart
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
