"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth-rtk";
import { Button } from "@/components/ui/button";

interface TestResult {
  userId: string;
  userIdType: string;
  regularEndpoint: {
    url: string;
    result: Record<string, unknown>;
  };
  userEndpoint: {
    url: string;
    result: Record<string, unknown>;
  };
  debugEndpoint: {
    url: string;
    result: Record<string, unknown>;
  };
}

export default function TestOrderFilteringPage() {
  const { user, isAuthenticated } = useAuth();
  const [testResults, setTestResults] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Function to test different filtering approaches
  const testOrderFiltering = async () => {
    if (!user?._id) {
      setError("No user ID available to test");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Test 1: Regular orders endpoint with userId filter
      const regularEndpoint = `/api/orders?userId=${user._id}&page=1&limit=10`;

      // Test 2: User-specific orders endpoint
      const userEndpoint = `/api/orders/user/${user._id}?page=1&limit=10`;

      // Test 3: Debug endpoint (admin only)
      const debugEndpoint = `/api/orders/debug/user/${user._id}`;

      // Run tests in parallel
      const results = await Promise.all([
        fetch(regularEndpoint)
          .then((res) => res.json())
          .catch((e) => ({ error: e.message })),
        fetch(userEndpoint)
          .then((res) => res.json())
          .catch((e) => ({ error: e.message })),
        fetch(debugEndpoint)
          .then((res) => res.json())
          .catch((e) => ({ error: e.message, status: "Admin only" })),
      ]);

      setTestResults({
        userId: user._id?.toString() || "",
        userIdType: typeof user._id,
        regularEndpoint: {
          url: regularEndpoint,
          result: results[0],
        },
        userEndpoint: {
          url: userEndpoint,
          result: results[1],
        },
        debugEndpoint: {
          url: debugEndpoint,
          result: results[2],
        },
      });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to run tests");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">
        Test Order Filtering
      </h1>

      <div className="bg-white shadow rounded-lg p-6 mb-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">
          User Information
        </h2>
        {isAuthenticated ? (
          <div className="space-y-2">
            <p>
              <span className="font-semibold">User ID:</span>{" "}
              {(user?._id as string) || "Not available"}
            </p>
            <p>
              <span className="font-semibold">User ID Type:</span>{" "}
              {typeof user?._id}
            </p>
            <p>
              <span className="font-semibold">Is Valid MongoDB ObjectID:</span>{" "}
              {user?._id && /^[0-9a-fA-F]{24}$/.test(user._id.toString())
                ? "Yes"
                : "No"}
            </p>
          </div>
        ) : (
          <p className="text-red-500">Please log in to test order filtering</p>
        )}
      </div>

      <div className="mb-8">
        <Button
          onClick={testOrderFiltering}
          disabled={!isAuthenticated || isLoading}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          {isLoading ? "Running Tests..." : "Test Order Filtering"}
        </Button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-8">
          {error}
        </div>
      )}

      {testResults && (
        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Test Results
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Regular Endpoint Results
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {testResults.regularEndpoint.url}
              </p>
              <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(testResults.regularEndpoint.result, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                User-Specific Endpoint Results
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {testResults.userEndpoint.url}
              </p>
              <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(testResults.userEndpoint.result, null, 2)}
              </pre>
            </div>

            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Debug Endpoint Results (Admin Only)
              </h3>
              <p className="text-sm text-gray-500 mb-2">
                {testResults.debugEndpoint.url}
              </p>
              <pre className="bg-gray-50 p-4 rounded overflow-auto max-h-96">
                {JSON.stringify(testResults.debugEndpoint.result, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
