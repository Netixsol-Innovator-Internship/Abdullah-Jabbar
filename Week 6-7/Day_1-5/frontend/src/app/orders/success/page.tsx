"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useClearCartMutation } from "@/lib/api/cartApiSlice";
import {
  useGetOrderByNumberQuery,
  PaymentMethodDetails,
  useUpdatePaymentStatusMutation,
} from "@/lib/api/ordersApiSlice";

// Component to display payment method details
function PaymentMethodCard({
  paymentMethodDetails,
}: {
  paymentMethodDetails?: PaymentMethodDetails;
}) {
  if (!paymentMethodDetails) return null;

  const getCardBrandIcon = (brand: string) => {
    switch (brand?.toLowerCase()) {
      case "visa":
        return "💳"; // In production, use actual Visa logo
      case "mastercard":
        return "💳"; // In production, use actual Mastercard logo
      case "amex":
        return "💳"; // In production, use actual Amex logo
      case "discover":
        return "💳"; // In production, use actual Discover logo
      default:
        return "💳";
    }
  };

  const getWalletIcon = (walletType: string) => {
    switch (walletType?.toLowerCase()) {
      case "apple_pay":
        return "🍎"; // In production, use actual Apple Pay logo
      case "google_pay":
        return "🌐"; // In production, use actual Google Pay logo
      case "samsung_pay":
        return "📱"; // In production, use actual Samsung Pay logo
      default:
        return "💳";
    }
  };

  const renderPaymentMethod = () => {
    if (paymentMethodDetails.wallet) {
      return (
        <div className="flex items-center space-x-3">
          <span className="text-2xl">
            {getWalletIcon(paymentMethodDetails.wallet.type)}
          </span>
          <div>
            <p className="font-medium text-gray-900 capitalize">
              {paymentMethodDetails.wallet.type.replace("_", " ")}
            </p>
            <p className="text-sm text-gray-600">Digital Wallet</p>
          </div>
        </div>
      );
    }

    if (paymentMethodDetails.type === "card") {
      return (
        <div className="flex items-center space-x-3">
          <span className="text-2xl">
            {getCardBrandIcon(paymentMethodDetails.brand || "")}
          </span>
          <div>
            <p className="font-medium text-gray-900 capitalize">
              {paymentMethodDetails.brand} •••• {paymentMethodDetails.last4}
            </p>
            <p className="text-sm text-gray-600">
              {paymentMethodDetails.funding
                ? `${paymentMethodDetails.funding.charAt(0).toUpperCase() + paymentMethodDetails.funding.slice(1)} Card`
                : "Card"}
              {paymentMethodDetails.expiryMonth &&
                paymentMethodDetails.expiryYear &&
                ` • Expires ${paymentMethodDetails.expiryMonth}/${paymentMethodDetails.expiryYear}`}
            </p>
          </div>
        </div>
      );
    }

    if (paymentMethodDetails.type === "paypal") {
      return (
        <div className="flex items-center space-x-3">
          <span className="text-2xl">🅿️</span>
          <div>
            <p className="font-medium text-gray-900">PayPal</p>
            <p className="text-sm text-gray-600">Digital Payment</p>
          </div>
        </div>
      );
    }

    return (
      <div className="flex items-center space-x-3">
        <span className="text-2xl">💳</span>
        <div>
          <p className="font-medium text-gray-900 capitalize">
            {paymentMethodDetails.type}
          </p>
          <p className="text-sm text-gray-600">Payment Method</p>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 mb-6">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Payment Method</h3>
      {renderPaymentMethod()}
    </div>
  );
}

export default function OrderSuccessPage() {
  const params = useSearchParams();
  const router = useRouter();
  const order = params.get("order");
  const sessionId = params.get("session_id"); // Stripe checkout session ID
  const [cartCleared, setCartCleared] = useState(false);
  const [paymentUpdated, setPaymentUpdated] = useState(false);
  const [clearCart] = useClearCartMutation();
  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

  // Fetch order details - if order number is available, use it; otherwise get latest order
  const {
    data: orderData,
    isLoading: isLoadingOrder,
    refetch: refetchOrder,
  } = useGetOrderByNumberQuery(order || "", { skip: !order });

  // For new flow, we'll fetch the latest order instead since we don't have order number in URL
  const shouldFetchLatest = !order && sessionId;

  useEffect(() => {
    // If we have a Stripe session_id but no order number,
    // it means we're coming from the new payment flow
    // We should wait a moment for the webhook to process, then fetch latest order
    if (sessionId && !order && !paymentUpdated) {
      console.log(
        "Payment successful, updating payment status for session:",
        sessionId
      );

      // Automatically update payment status using RTK Query
      const handlePaymentStatusUpdate = async () => {
        try {
          const result = await updatePaymentStatus({
            sessionId: sessionId,
          }).unwrap();

          console.log("Payment status update result:", result);

          if (result.success) {
            console.log("Payment status updated successfully");
            setPaymentUpdated(true);

            // If we got an order number back, refetch order details
            if (result.order?.orderNumber && order) {
              refetchOrder();
            }
          } else {
            console.error("Failed to update payment status:", result.message);
          }
        } catch (error) {
          console.error("Error updating payment status:", error);
        }
      };

      // Give webhook a moment to process, then manually update if needed
      setTimeout(() => {
        handlePaymentStatusUpdate();
      }, 2000);
    }

    // Clear cart on successful order
    const clearCartAfterSuccess = async () => {
      if (!cartCleared) {
        try {
          const cartSessionId = localStorage.getItem("cart-session-id");
          if (cartSessionId) {
            await clearCart({ sessionId: cartSessionId }).unwrap();
            console.log("Cart cleared after successful order");
          }
          setCartCleared(true);
        } catch (error) {
          console.error("Failed to clear cart after order:", error);
          // Still mark as cleared to avoid retrying
          setCartCleared(true);
        }
      }
    };

    // Clear cart if we have either order number or session_id (indicating successful payment)
    if (order || sessionId) {
      clearCartAfterSuccess();
    } else {
      // If no order number and no session_id, redirect to home
      router.replace("/");
    }
  }, [
    order,
    sessionId,
    router,
    clearCart,
    cartCleared,
    updatePaymentStatus,
    paymentUpdated,
    refetchOrder,
  ]);

  if (!order && !sessionId) return null;

  // Show loading while fetching order details
  if (isLoadingOrder) {
    return (
      <div className="max-w-3xl mx-auto py-16 px-4 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
        <p className="mt-4 text-gray-600">Loading order details...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-16 px-4 text-center">
      <div className="mb-8">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4 text-gray-900">
          Payment Successful!
        </h1>
        <p className="text-lg text-gray-600 mb-2">
          Thank you for your order. Your payment has been processed
          successfully.
        </p>
        {order ? (
          <p className="text-gray-600">
            Order number: <strong className="text-gray-900">{order}</strong>
          </p>
        ) : (
          <p className="text-gray-600">
            Your order is being processed and you&apos;ll receive confirmation
            shortly.
          </p>
        )}
      </div>

      {/* Payment Method Details - only show if we have order data */}
      {orderData?.paymentMethodDetails && (
        <PaymentMethodCard
          paymentMethodDetails={orderData.paymentMethodDetails}
        />
      )}

      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/profile?tab=orders"
          className="bg-black text-white px-6 py-3 rounded-md font-medium hover:bg-gray-800 transition-colors"
        >
          View Your Orders
        </Link>
        <Link
          href="/shop"
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
