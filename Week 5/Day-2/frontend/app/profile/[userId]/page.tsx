"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../../components/auth-context";
import ProtectedRoute from "../../../components/protected-route";
import {
  getUserById,
  getFollowers,
  getFollowing,
  toggleFollow,
  checkIsFollowing,
  uploadProfilePicture,
  updateMe,
} from "../../../lib/api";
import Image from "next/image";
import Link from "next/link";

type UserProfile = {
  _id: string;
  username: string;
  email: string;
  bio?: string;
  profilePicture?: string;
  followersCount: number;
  followingCount: number;
};

export default function ProfilePage({
  params,
}: {
  params: Promise<{ userId: string }>;
}) {
  const [userId, setUserId] = useState<string>("");
  const { user: currentUser } = useAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followLoading, setFollowLoading] = useState(false);
  const [isOwnProfile, setIsOwnProfile] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({ bio: "", username: "" });
  const [uploading, setUploading] = useState(false);

  // Extract userId from params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setUserId(resolvedParams.userId);
    };
    getParams();
  }, [params]);

  useEffect(() => {
    if (!userId || !currentUser) return;

    const isOwn = userId === currentUser._id;
    setIsOwnProfile(isOwn);

    const fetchOwnProfileData = async () => {
      try {
        const [followersRes, followingRes] = await Promise.all([
          getFollowers(currentUser._id),
          getFollowing(currentUser._id),
        ]);

        setProfile({
          ...currentUser,
          followersCount: followersRes?.length || 0,
          followingCount: followingRes?.length || 0,
        });

        setEditForm({
          bio: currentUser.bio || "",
          username: currentUser.username || "",
        });
      } catch (error) {
        console.error("Failed to fetch profile data:", error);
      }
    };

    const fetchUserProfile = async () => {
      try {
        const userRes = await getUserById(userId);
        const [followersRes, followingRes] = await Promise.all([
          getFollowers(userId),
          getFollowing(userId),
        ]);

        setProfile({
          ...userRes,
          followersCount: followersRes?.length || 0,
          followingCount: followingRes?.length || 0,
        });
      } catch (error) {
        console.error("Failed to fetch user profile:", error);
      }
    };

    const checkFollowingStatus = async () => {
      try {
        const response = await checkIsFollowing(userId);
        setIsFollowing(response.isFollowing);
      } catch (error) {
        console.error("Failed to check following status:", error);
      }
    };

    if (isOwn) {
      fetchOwnProfileData();
    } else {
      fetchUserProfile();
      checkFollowingStatus();
    }
  }, [userId, currentUser]);

  const handleToggleFollow = async () => {
    if (followLoading) return;
    setFollowLoading(true);

    try {
      const response = await toggleFollow(userId as string);
      setIsFollowing(response.isFollowing);

      // Update follower count
      setProfile((prev) =>
        prev
          ? {
              ...prev,
              followersCount: response.isFollowing
                ? prev.followersCount + 1
                : prev.followersCount - 1,
            }
          : null
      );
    } catch (error) {
      console.error("Failed to toggle follow:", error);
    } finally {
      setFollowLoading(false);
    }
  };

  const handleProfilePictureUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const response = await uploadProfilePicture(file);
      setProfile((prev) =>
        prev ? { ...prev, profilePicture: response.profilePicture } : null
      );
    } catch (error) {
      console.error("Failed to upload profile picture:", error);
    } finally {
      setUploading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      await updateMe(editForm);
      setProfile((prev) => (prev ? { ...prev, ...editForm } : null));
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
    }
  };

  if (!profile) {
    return (
      <ProtectedRoute>
        <div className="p-6 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-500">Loading profile...</p>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="p-6 max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6">
          <div className="flex flex-col items-center">
            {/* Profile Picture */}
            <div className="relative">
              <Image
                src={
                  profile.profilePicture
                    ? `/uploads/${profile.profilePicture}`
                    : "/images/avatar.png"
                }
                alt={profile.username}
                width={96}
                height={96}
                className="w-24 h-24 rounded-full border-4 border-gray-200"
              />
              {isOwnProfile && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 cursor-pointer hover:bg-blue-700">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleProfilePictureUpload}
                    disabled={uploading}
                  />
                  {uploading ? "..." : "📷"}
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="mt-4 text-center">
              {isEditing ? (
                <div className="space-y-3">
                  <input
                    type="text"
                    value={editForm.username}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        username: e.target.value,
                      }))
                    }
                    className="text-xl font-bold bg-gray-100 rounded px-3 py-1 text-center"
                    placeholder="Username"
                  />
                  <textarea
                    value={editForm.bio}
                    onChange={(e) =>
                      setEditForm((prev) => ({ ...prev, bio: e.target.value }))
                    }
                    className="w-full bg-gray-100 rounded px-3 py-2 text-center resize-none"
                    placeholder="Bio"
                    rows={3}
                  />
                  <div className="flex gap-2 justify-center">
                    <button
                      onClick={handleUpdateProfile}
                      className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setIsEditing(false)}
                      className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <h1 className="text-2xl font-bold">{profile.username}</h1>
                  <p className="text-gray-500">{profile.email}</p>
                  <p className="mt-2 text-center text-gray-700 max-w-md">
                    {profile.bio && profile.bio.toString().trim() ? (
                      profile.bio
                    ) : (
                      <span className="text-gray-400">No bio yet.</span>
                    )}
                  </p>

                  {isOwnProfile && (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="mt-3 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                    >
                      Edit Profile
                    </button>
                  )}
                </>
              )}
            </div>

            {/* Follow Button for other users */}
            {!isOwnProfile && (
              <button
                onClick={handleToggleFollow}
                disabled={followLoading}
                className={`mt-4 px-6 py-2 rounded font-semibold ${
                  isFollowing
                    ? "bg-gray-200 text-gray-800 hover:bg-gray-300"
                    : "bg-blue-600 text-white hover:bg-blue-700"
                } disabled:opacity-50`}
              >
                {followLoading ? "..." : isFollowing ? "Unfollow" : "Follow"}
              </button>
            )}
          </div>

          {/* Stats */}
          <div className="flex justify-around mt-6 pt-6 border-t border-gray-200">
            <Link
              href={`/followers/${profile._id}/followers`}
              className="text-center hover:bg-gray-50 rounded p-2"
            >
              <p className="font-bold text-xl">{profile.followersCount}</p>
              <p className="text-gray-500">Followers</p>
            </Link>
            <Link
              href={`/followers/${profile._id}/following`}
              className="text-center hover:bg-gray-50 rounded p-2"
            >
              <p className="font-bold text-xl">{profile.followingCount}</p>
              <p className="text-gray-500">Following</p>
            </Link>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
