"use client";

import React, { useState } from "react";
import ProfileCard from "../components/profile-card";
import CommentsFeed from "../components/feed";
import Navbar from "../components/navbar";
import LoginPage from "./auth/login/page";

type Tab = "feed" | "profile" | "notifications";

export default function HomePage() {
  const [activeTab, setActiveTab] = useState<Tab>("feed");

  // mock user
  const [user] = useState({
    _id: "123",
    username: "Abdullah",
    bio: "Building cool stuff with Next.js + NestJS",
    profilePicture: "",
    followersCount: 42,
    followingCount: 18,
    followersList: [
      { _id: "1", username: "Alice", profilePicture: "" },
      { _id: "2", username: "Bob", profilePicture: "" },
    ],
    followingList: [
      { _id: "3", username: "Charlie", profilePicture: "", isFollowing: true },
      { _id: "4", username: "David", profilePicture: "", isFollowing: true },
    ],
  });

  // mock data for comments feed
  const comments = [
    { id: 1, user: "Alice", text: "This is the first comment" },
    { id: 2, user: "Bob", text: "Another comment here" },
    { id: 3, user: "Charlie", text: "Interesting discussion!" },
  ];

  // mock notifications
  const notifications = [
    { id: 1, text: 'Bob replied to your comment: "Good point!"' },
    { id: 2, text: 'Alice replied to your comment: "Totally agree."' },
  ];

  return (
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
                _id: "123",
                username: "Abdullah",
                profilePicture: "",
              }}
              initialComments={comments.map((c) => ({
                _id: c.id,
                author: {
                  _id: c.id,
                  username: c.user,
                },
                text: c.text,
                createdAt: new Date().toISOString(),
                likesCount: 0,
                repliesCount: 0,
                isLiked: false,
              }))}
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
            <div className="space-y-4">
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-700"
                >
                  {n.text}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
