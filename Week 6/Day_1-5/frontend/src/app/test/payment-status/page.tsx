"use client";

import { useState } from "react";
import { useUpdatePaymentStatusMutation } from "@/lib/api/ordersApiSlice";
import type { FetchBaseQueryError } from "@reduxjs/toolkit/query";
import type { SerializedError } from "@reduxjs/toolkit";

export default function PaymentStatusTestPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [sessionId, setSessionId] = useState("");
  const [paymentIntentId, setPaymentIntentId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [updatePaymentStatus] = useUpdatePaymentStatusMutation();

  const handleUpdateStatus = async () => {
    if (!orderNumber && !sessionId) {
      alert("Please provide either an order number or session ID");
      return;
    }

    setIsLoading(true);
    setResult(null);

    try {
      const response = await updatePaymentStatus({
        orderNumber: orderNumber || undefined,
        sessionId: sessionId || undefined,
        paymentIntentId: paymentIntentId || undefined,
      }).unwrap();

      setResult(response);
    } catch (err) {
      let message = "Unknown error";
      const error = err as FetchBaseQueryError | SerializedError;

      if ("data" in error && error.data) {
        const data = error.data as { message?: string; error?: string };
        message = data.message || data.error || message;
      } else if ("message" in error && error.message) {
        message = error.message;
      }

      setResult({
        success: false,
        message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleClear = () => {
    setOrderNumber("");
    setSessionId("");
    setPaymentIntentId("");
    setResult(null);
  };

  return (
    <div className="max-w-2xl mx-auto py-8 px-4">
      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">
          Payment Status Test Tool
        </h1>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="orderNumber"
              className="block text-sm font-medium text-gray-700"
            >
              Order Number (optional)
            </label>
            <input
              type="text"
              id="orderNumber"
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              placeholder="e.g., ORD-12345678-123"
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="sessionId"
              className="block text-sm font-medium text-gray-700"
            >
              Stripe Session ID (optional)
            </label>
            <input
              type="text"
              id="sessionId"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="e.g., cs_test_1234567890..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="paymentIntentId"
              className="block text-sm font-medium text-gray-700"
            >
              Payment Intent ID (optional)
            </label>
            <input
              type="text"
              id="paymentIntentId"
              value={paymentIntentId}
              onChange={(e) => setPaymentIntentId(e.target.value)}
              placeholder="e.g., pi_1234567890..."
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex space-x-4">
            <button
              onClick={handleUpdateStatus}
              disabled={isLoading || (!orderNumber && !sessionId)}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Updating..." : "Update Payment Status"}
            </button>

            <button
              onClick={handleClear}
              className="bg-gray-600 text-white py-2 px-4 rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Clear
            </button>
          </div>
        </div>

        {result && (
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-3">Result:</h3>
            <div
              className={`p-4 rounded-md ${
                result.success
                  ? "bg-green-50 border border-green-200"
                  : "bg-red-50 border border-red-200"
              }`}
            >
              <div className="flex items-center">
                <div
                  className={`w-4 h-4 rounded-full mr-3 ${
                    result.success ? "bg-green-400" : "bg-red-400"
                  }`}
                ></div>
                <span
                  className={`font-medium ${
                    result.success ? "text-green-800" : "text-red-800"
                  }`}
                >
                  {result.success ? "Success" : "Error"}
                </span>
              </div>

              <p
                className={`mt-2 ${
                  result.success ? "text-green-700" : "text-red-700"
                }`}
              >
                {result.message}
              </p>

              {result.order && (
                <div className="mt-3 text-sm text-gray-600">
                  <p>
                    <strong>Order Number:</strong> {result.order.orderNumber}
                  </p>
                  <p>
                    <strong>Payment Status:</strong>{" "}
                    {result.order.paymentStatus}
                  </p>
                  <p>
                    <strong>Order ID:</strong> {result.order._id}
                  </p>
                </div>
              )}

              <details className="mt-3">
                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                  Raw Response
                </summary>
                <pre className="mt-2 text-xs bg-gray-100 p-2 rounded overflow-auto">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </details>
            </div>
          </div>
        )}

        <div className="mt-6 text-sm text-gray-600">
          <h4 className="font-medium mb-2">Instructions:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>
              Provide either an <strong>Order Number</strong> or{" "}
              <strong>Session ID</strong>
            </li>
            <li>Order Number updates orders directly by order number</li>
            <li>Session ID processes the payment using the session metadata</li>
            <li>
              Payment Intent ID is optional and will be stored if provided
            </li>
            <li>
              This tool simulates successful payment completion for development
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
