"use client";

import { useEffect, useState } from "react";
import axios from "axios";

type User = {
  _id: string;
  username: string;
  profilePicture?: string;
};

export default function FollowerPage() {
  const [followers, setFollowers] = useState<User[]>([]);

  useEffect(() => {
    // Replace with your backend endpoint
    axios.get("http://localhost:4000/user/followers/me")
      .then(res => setFollowers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Followers</h1>
      <div className="space-y-3">
        {followers.map((user) => (
          <div key={user._id} className="flex items-center gap-3 p-3 rounded-xl shadow bg-white">
            <img
              src={user.profilePicture || "/default-avatar.png"}
              alt={user.username}
              className="w-10 h-10 rounded-full"
            />
            <span className="font-medium">{user.username}</span>
          </div>
        ))}
        {followers.length === 0 && (
          <p className="text-gray-500">No followers yet.</p>
        )}
      </div>
    </div>
  );
}
