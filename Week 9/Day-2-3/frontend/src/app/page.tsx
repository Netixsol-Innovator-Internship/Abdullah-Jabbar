"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import AskForm from "../components/AskForm";
import { useAppSelector } from "../store/hooks";
import Navigation from "../components/Navigation";
import FullScreenLoader from "../components/FullScreenLoader";

export default function Home() {
  const [selectedExample, setSelectedExample] = useState<string>("");
  const router = useRouter();
  const { isAuthenticated } = useAppSelector((state) => state.auth);
  const [isClient, setIsClient] = useState(false);

  const examples = [
    "Show Australia ODI matches",
    "Top 5 T20 matches with highest team scores",
    "What was England's score vs Australia at Lord's on 26 Aug 1972?",
  ];

  // Use useEffect to mark component as client-side rendered
  useEffect(() => {
    setIsClient(true);

    // Handle redirection
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  // Don't render anything substantial during SSR to prevent hydration mismatch
  if (!isClient) {
    return <FullScreenLoader label="Preparing dashboard" />;
  }

  // Only show this on client side after we've confirmed authentication status
  if (!isAuthenticated) {
    return (
      <FullScreenLoader
        label="Redirecting to login"
        subLabel="Hold tight while we verify your session."
      />
    );
  }

  // Only render the full UI when we're on the client side and authenticated
  return (
    <div className="flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto p-4">
          <div className="mb-4">
            <p className="text-sm text-slate-600">
              Ask natural language questions about match stats. Examples:
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {examples.map((ex) => (
                <button
                  key={ex}
                  onClick={() => {
                    setSelectedExample(ex);
                  }}
                  className="px-3 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-sm transition-colors cursor-pointer"
                >
                  {ex}
                </button>
              ))}
            </div>
          </div>

          <AskForm selectedExample={selectedExample} />
        </div>
      </main>
    </div>
  );
}
