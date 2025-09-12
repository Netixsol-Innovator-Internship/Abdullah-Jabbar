"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";

export default function OAuthCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { loginLocal } = useAuth();
  const [status, setStatus] = React.useState<"loading" | "success" | "error">(
    "loading"
  );
  const [message, setMessage] = React.useState("");

  React.useEffect(() => {
    const handleOAuthCallback = async () => {
      try {
        // Get token from URL params
        const token = searchParams.get("token");
        const error = searchParams.get("error");

        if (error) {
          setStatus("error");
          setMessage(`OAuth error: ${error}`);
          return;
        }

        if (!token) {
          setStatus("error");
          setMessage("No authentication token received");
          return;
        }

        // Store the token and redirect
        loginLocal(token);
        setStatus("success");
        setMessage("Successfully authenticated! Redirecting...");

        // Redirect to home page after a short delay
        setTimeout(() => {
          router.replace("/");
        }, 1500);
      } catch (error) {
        console.error("OAuth callback error:", error);
        setStatus("error");
        setMessage("Failed to process authentication");
      }
    };

    handleOAuthCallback();
  }, [searchParams, loginLocal, router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full mx-auto">
        <div className="bg-white shadow-lg rounded-lg p-6 text-center">
          {status === "loading" && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Completing Authentication...
              </h2>
              <p className="text-gray-600">
                Please wait while we process your login.
              </p>
            </>
          )}

          {status === "success" && (
            <>
              <div className="rounded-full h-12 w-12 bg-green-100 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Success!
              </h2>
              <p className="text-gray-600">{message}</p>
            </>
          )}

          {status === "error" && (
            <>
              <div className="rounded-full h-12 w-12 bg-red-100 mx-auto mb-4 flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-gray-900 mb-2">
                Authentication Failed
              </h2>
              <p className="text-gray-600 mb-4">{message}</p>
              <button
                onClick={() => router.replace("/authForm")}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md transition"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
