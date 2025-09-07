// cart/page.tsx

"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import {
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} from "@/lib/api/cartApiSlice";
import { useCreateOrderMutation } from "@/lib/api/ordersApiSlice";
import { useAuth } from "@/hooks/use-auth-rtk";
import CartItemComponent from "@/components/CartItem";

interface EnrichedCartItem {
  productId: string;
  quantity: number;
  product?: unknown;
  price?: number;
}

export default function CartPage() {
  const [sessionId, setSessionId] = useState<string>("");
  const [promoCode, setPromoCode] = useState("");
  const [enrichedCartItems, setEnrichedCartItems] = useState<
    EnrichedCartItem[]
  >([]);
  const [itemPrices, setItemPrices] = useState<
    Record<string, { price: number; quantity: number }>
  >({});

  // Get current user if authenticated
  const { user, isAuthenticated } = useAuth();

  // Generate or get session ID for guest users
  useEffect(() => {
    let storedSessionId = localStorage.getItem("cart-session-id");
    if (!storedSessionId) {
      storedSessionId = `guest-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem("cart-session-id", storedSessionId);
    }
    console.log("Cart page sessionId:", storedSessionId);
    setSessionId(storedSessionId);
  }, []);

  // Fetch cart data
  const {
    data: cartData,
    isLoading,
    isError,
    refetch,
  } = useGetCartQuery(
    { sessionId },
    {
      skip: !sessionId,
    }
  );

  // Log cart data for debugging
  useEffect(() => {
    if (cartData) {
      console.log("Cart data received:", cartData);
    }
  }, [cartData]);

  // Transform cart items to use quantity instead of qty and enrich with product data
  useEffect(() => {
    if (cartData?.items) {
      const transformedItems = cartData.items.map((item: unknown) => {
        const cartItem = item as {
          productId: string;
          qty?: number;
          quantity?: number;
          product?: unknown;
          price?: number;
        };
        return {
          productId: cartItem.productId,
          quantity: cartItem.qty || cartItem.quantity || 1,
          product: cartItem.product || null,
          price: cartItem.price || 0,
        };
      });
      setEnrichedCartItems(transformedItems);
    }
  }, [cartData]);

  const [updateCartItem, { isLoading: isUpdating }] =
    useUpdateCartItemMutation();
  const [removeFromCart, { isLoading: isRemoving }] =
    useRemoveFromCartMutation();
  const [createOrder, { isLoading: isCheckingOut }] = useCreateOrderMutation();
  const [clearCart] = useClearCartMutation();

  // Calculate totals using itemPrices state
  const subtotal = Object.values(itemPrices).reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  // Checkout functionality (simplified for testing)
  const handleCheckout = async () => {
    if (enrichedCartItems.length === 0) {
      alert("Your cart is empty!");
      return;
    }

    try {
      console.log("Starting checkout process...");
      console.log("Session ID:", sessionId);
      console.log("Cart items:", enrichedCartItems);
      console.log("User:", user);
      console.log("Is authenticated:", isAuthenticated);

      // Create the order data
      console.log("Attempting to create order...");
      const orderData = {
        // Include sessionId for guest checkout or authenticated users with session-based cart
        sessionId,
        paymentMethod: "cash_on_delivery",
        shippingAddress: {
          fullName: user?.name || "John Doe",
          street1: "123 Default St",
          city: "Default City",
          state: "Default State",
          postalCode: "12345",
          country: "Default Country",
        },
      };

      console.log("Order data:", orderData);

      const orderResult = await createOrder(orderData).unwrap();
      console.log("Order created successfully:", orderResult);

      // Clear the cart after successful order creation
      console.log("Attempting to clear cart...");
      const clearResult = await clearCart({ sessionId }).unwrap();
      console.log("Clear cart result:", clearResult);

      console.log("Order placed and cart cleared successfully");
      alert(
        `Order placed successfully! Order number: ${orderResult.orderNumber || orderResult._id}`
      );

      // Refetch cart data to update UI
      refetch();
    } catch (error) {
      console.error("Failed to place order:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));

      // More specific error message
      if (error && typeof error === "object" && "data" in error) {
        const errorData = error.data as { message?: string };
        alert(
          `Failed to place order: ${errorData?.message || "Unknown error"}. Please try again.`
        );
      } else {
        alert("Failed to place order. Please try again.");
      }
    }
  };

  const handlePriceCalculated = useCallback(
    (productId: string, price: number, quantity: number) => {
      setItemPrices((prev) => ({
        ...prev,
        [productId]: { price, quantity },
      }));
    },
    []
  );

  // Update item prices when quantities change
  useEffect(() => {
    // Remove items from itemPrices that are no longer in cart
    const currentProductIds = new Set(
      enrichedCartItems.map((item) => item.productId)
    );
    setItemPrices((prev) => {
      const filtered = Object.fromEntries(
        Object.entries(prev).filter(([productId]) =>
          currentProductIds.has(productId)
        )
      );
      return filtered;
    });
  }, [enrichedCartItems]);

  const updateQuantity = async (productId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      await removeItem(productId);
    } else {
      console.log(`Updating quantity for ${productId} to ${newQuantity}`);

      try {
        await updateCartItem({
          itemId: productId,
          quantity: newQuantity,
          sessionId,
        }).unwrap();

        console.log("Cart item updated successfully");

        // Force refetch to ensure we have the latest data
        setTimeout(() => {
          refetch();
        }, 100);
      } catch (error) {
        console.error("Failed to update cart item:", error);
      }
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await removeFromCart({
        itemId: productId,
        sessionId,
      }).unwrap();
      refetch();
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-black"></div>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center text-red-500">
          Error loading cart. Please try again.
        </div>
      </div>
    );
  }

  const cartItems = enrichedCartItems;

  const discount = Math.round(subtotal * 0.2); // 20% discount
  const deliveryFee = 15;
  const total = subtotal - discount + deliveryFee;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center space-x-2 text-sm text-gray-600 mb-8">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <span>/</span>
        <span className="text-black font-medium">Cart</span>
      </nav>

      <h1 className="text-3xl font-bold text-black mb-8">YOUR CART</h1>

      {cartItems.length === 0 ? (
        <div className="text-center py-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Your cart is empty
          </h2>
          <p className="text-gray-600 mb-8">
            Add some products to your cart to get started.
          </p>
          <Link
            href="/shop"
            className="bg-black text-white py-3 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors"
          >
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {cartItems.map((item, index: number) => (
              <CartItemComponent
                key={`${item.productId}-${index}`}
                productId={item.productId}
                quantity={item.quantity}
                onUpdateQuantity={updateQuantity}
                onRemove={removeItem}
                onPriceCalculated={handlePriceCalculated}
                isUpdating={isUpdating}
                isRemoving={isRemoving}
              />
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white border border-gray-200 rounded-lg p-6 h-fit">
            <h2 className="text-xl font-bold text-black mb-6">Order Summary</h2>

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

            {/* Promo Code */}
            <div className="mb-6">
              <div className="flex space-x-2">
                <input
                  type="text"
                  placeholder="Add promo code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-black"
                />
                <button className="bg-black text-white px-6 py-3 rounded-full font-medium hover:bg-gray-800 transition-colors">
                  Apply
                </button>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isCheckingOut || enrichedCartItems.length === 0}
              className="w-full bg-black text-white py-4 px-6 rounded-full font-medium hover:bg-gray-800 transition-colors flex items-center justify-center disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isCheckingOut ? "Processing..." : "Checkout →"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
