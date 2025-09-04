"use client";

import { useEffect, useState } from "react";
import { getFollowers } from "../../../../lib/api";
import Link from "next/link";
import Image from "next/image";

type User = {
  _id: string;
  username: string;
  profilePicture?: string;
  bio?: string;
};

export default function FollowersPage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const [userId, setUserId] = useState<string>("");
  const [followers, setFollowers] = useState<User[]>([]);
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
    const fetchFollowers = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await getFollowers(userId as string);
        setFollowers(response || []);
      } catch (err) {
        console.error("Failed to fetch followers:", err);
        setError("Failed to load followers");
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchFollowers();
    }
  }, [userId]);

  if (loading) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading followers...</p>
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
                  const response = await getFollowers(userId as string);
                  setFollowers(response || []);
                } catch (err) {
                  console.error("Failed to fetch followers:", err);
                  setError("Failed to load followers");
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
    <div className="p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Followers</h1>
        <Link
          href={`/profile/${userId}`}
          className="text-blue-600 hover:text-blue-800 underline"
        >
          Back to Profile
        </Link>
      </div>

      <div className="space-y-3">
        {followers.map((user) => (
          <div
            key={user._id}
            className="flex items-center gap-3 p-4 rounded-xl shadow bg-white hover:shadow-md transition-shadow"
          >
            <Image
              src={
                user.profilePicture
                  ? `/uploads/${user.profilePicture}`
                  : "/images/avatar.png"
              }
              alt={user.username}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover"
            />
            <div className="flex-1">
              <Link
                href={`/profile/${user._id}`}
                className="hover:text-blue-600"
              >
                <span className="font-medium text-lg">{user.username}</span>
                {user.bio && (
                  <p className="text-gray-500 text-sm mt-1">{user.bio}</p>
                )}
              </Link>
            </div>
          </div>
        ))}
        {followers.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No followers yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
