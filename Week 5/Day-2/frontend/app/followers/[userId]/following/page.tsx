"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  _id: string;
  username: string;
  profilePicture?: string;
};

export default function FollowingPage() {
  const [following, setFollowing] = useState<User[]>([]);

  useEffect(() => {
    // Replace with your backend endpoint
    axios.get("http://localhost:4000/user/following/me")
      .then(res => setFollowing(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Following</h1>
      <div className="space-y-3">
        {following.map((user) => (
          <div key={user._id} className="flex items-center gap-3 p-3 rounded-xl shadow bg-white">
            <img
              src={user.profilePicture || "/default-avatar.png"}
              alt={user.username}
              className="w-10 h-10 rounded-full"
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
