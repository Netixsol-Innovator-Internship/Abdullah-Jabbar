"use client";

import { useEffect, useState } from "react";
import { getFollowing } from "../../../../lib/api";
import Link from "next/link";
import Image from "next/image";

type User = {
  _id: string;
  username: string;
  profilePicture?: string;
  bio?: string;
};

export default function FollowingPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const [userId, setUserId] = useState<string>("");
  const [following, setFollowing] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Extract userId from params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.userId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    const fetchFollowing = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getFollowing(userId as string);
        setFollowing(response || []);
      } catch (err) {
        console.error("Failed to fetch following:", err);
        setError("Failed to load following");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFollowing();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading following...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-center">
        <p className="text-red-500">{error}</p>
        <button
          onClick={() => {
            if (userId) {
              const refetch = async () => {
                setLoading(true);
                setError(null);
                try {
                  const response = await getFollowing(userId as string);
                  setFollowing(response || []);
                } catch (err) {
                  console.error("Failed to fetch following:", err);
                  setError("Failed to load following");
                } finally {
                  setLoading(false);
                }
              };
              refetch();
            }
          }}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Following</h1>
      <div className="space-y-3">
        {following.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-3 p-3 rounded-xl shadow bg-white"
          >
            <Image
              src={
                user.profilePicture
                  ? `/uploads/${user.profilePicture}`
                  : "/images/avatar.png"
              }
              alt={user.username}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover"
            />
            <span className="font-medium">{user.username}</span>
          </div>
        ))}
        {following.length === 0 && (
          <p className="text-gray-500">You’re not following anyone yet.</p>
        )}
      </div>
    </div>
  );
}
