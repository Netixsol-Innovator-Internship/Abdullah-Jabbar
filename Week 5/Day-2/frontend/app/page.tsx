"use client";

import React, { useState } from "react";
import ProfileCard from "../components/profile-card";
import CommentsFeed from "../components/feed";
import Navbar from "../components/navbar";
import ProtectedRoute from "../components/protected-route";
import { useAuth } from "../components/auth-context";
import Link from "next/link";

type Tab = "feed" | "profile" | "notifications";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("feed");
  const { user } = useAuth();

  if (!user) {
    return (
      <ProtectedRoute>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-100">
        <Navbar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Content */}
        <main className="max-w-2xl mx-auto p-6">
          {activeTab === "feed" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Comments Feed
              </h2>
              <CommentsFeed
                currentUser={{
                  _id: user._id,
                  username: user.username,
                  profilePicture: user.profilePicture,
                }}
                postId="demo-post-1"
              />
            </div>
          )}
          {activeTab === "profile" && (
            <div className="max-w-3xl mx-auto p-6 bg-gray-50 rounded-2xl shadow-sm">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 pb-2">
                Your Profile
              </h2>
              <ProfileCard user={user} />
            </div>
          )}
          {activeTab === "notifications" && (
            <div>
              <h2 className="text-2xl font-semibold mb-6 text-gray-800">
                Notifications
              </h2>
              <div className="text-center py-8">
                <p className="text-gray-500 mb-4">
                  Check your notifications page for the latest updates.
                </p>
                <Link
                  href="/notifications"
                  className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  View Notifications
                </Link>
              </div>
            </div>
          )}
        </main>
      </div>
    </ProtectedRoute>
  );
}
