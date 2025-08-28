"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import axios from "axios";

type UserProfile = {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  followersCount: number;
  followingCount: number;
};

export default function ProfilePage() {
  const { userid } = useParams();
  const [profile, setProfile] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (userid) {
      axios.get(`http://localhost:4000/user/${userid}`)
        .then(res => setProfile(res.data))
        .catch(err => console.error(err));
    }
  }, [userid]);

  if (!profile) {
    return <p className="p-6 text-gray-500">Loading profile...</p>;
  }

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="flex flex-col items-center">
        <img
          src={profile.profilePicture || "/default-avatar.png"}
          alt={profile.username}
          className="w-24 h-24 rounded-full mb-4"
        />
        <h1 className="text-2xl font-bold">{profile.username}</h1>
        <p className="text-gray-500">{profile.email}</p>
        {profile.bio && <p className="mt-2 text-center text-gray-700">{profile.bio}</p>}
      </div>

      <div className="flex justify-around mt-6">
        <div className="text-center">
          <p className="font-bold">{profile.followersCount}</p>
          <p className="text-gray-500">Followers</p>
        </div>
        <div className="text-center">
          <p className="font-bold">{profile.followingCount}</p>
          <p className="text-gray-500">Following</p>
        </div>
      </div>
    </div>
  );
}
