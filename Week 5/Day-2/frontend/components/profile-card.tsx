"use client";
import React, { useEffect, useState } from "react";
import { useSocket } from "./socket-provider";

interface User {
  _id: string;
  username: string;
  email?: string;
  bio?: string;
  profilePicture?: string;
  followersCount?: number;
  followingCount?: number;
  followersList?: User[];
  followingList?: (User & { isFollowing?: boolean })[];
}

interface ProfileCardProps {
  user: User | null;
}

export default function ProfileCard({ user }: ProfileCardProps) {
  const socket = useSocket();
  const [followersCount, setFollowersCount] = useState(
    user?.followersCount ?? 0
  );

  // Modal states
  const [showFollowersModal, setShowFollowersModal] = useState(false);
  const [showFollowingModal, setShowFollowingModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  // Local followers list copy for modal operations
  const [followersList, setFollowersList] = useState<User[] | undefined>(
    user?.followersList ?? []
  );

  // Editable fields
  const [editBio, setEditBio] = useState(user?.bio ?? "");
  const [editProfilePicture, setEditProfilePicture] = useState(
    user?.profilePicture ?? ""
  );

  // Temporary state for following toggles
  const [followingTemp, setFollowingTemp] = useState(user?.followingList ?? []);

  useEffect(() => {
    if (!socket || !user?._id) return;
    const onFollowChanged = (payload: {
      targetUserId: string;
      isFollowing: boolean;
    }) => {
      if (payload.targetUserId !== user._id) return;
      setFollowersCount((c) =>
        payload.isFollowing ? c + 1 : Math.max(0, c - 1)
      );
    };
    socket.on("follow.changed", onFollowChanged);
    return () => {
      socket.off("follow.changed", onFollowChanged);
    };
  }, [socket, user?._id]);

  if (!user) return null;

  const handleSaveProfile = () => {
    // Update user with edited fields
    user.bio = editBio;
    user.profilePicture = editProfilePicture;
    setIsEditing(false);
    // TODO: persist changes to API
  };

  const toggleFollowButton = (id: string) => {
    setFollowingTemp((prev) =>
      prev.map((f) =>
        f._id === id ? { ...f, isFollowing: !f.isFollowing } : f
      )
    );
  };

  return (
    <div className="flex flex-col items-center p-8 bg-white rounded-2xl shadow-lg max-w-md mx-auto relative">
      {/* Profile Picture or Placeholder */}
      {user.profilePicture ? (
        <img
          src={`/uploads/${user.profilePicture}`}
          alt={user.username}
          className="w-32 h-32 rounded-full object-cover border-4 border-indigo-500 mb-4"
        />
      ) : (
        <div className="w-32 h-32 rounded-full flex items-center justify-center text-2xl font-bold text-white bg-indigo-400 border-4 border-indigo-500 mb-4">
          {user.username.charAt(0).toUpperCase()}
        </div>
      )}

      {/* Edit Button */}
      <button
        onClick={() => setIsEditing(true)}
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-full hover:bg-indigo-700 transition transform hover:-rotate-12"
        title="Edit Profile"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 transform rotate-12"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M15.232 5.232l3.536 3.536M16.5 4.5a2.121 2.121 0 013 3L7 20H4v-3L16.5 4.5z"
          />
        </svg>
      </button>

      {/* User Info */}
      <div className="text-center mt-2">
        <h1 className="text-3xl font-bold text-gray-800">{user.username}</h1>

        {/* Stats Buttons */}
        <div className="flex justify-center gap-6 mt-4">
          <button
            onClick={() => setShowFollowersModal(true)}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
          >
            <span className="font-semibold">{followersCount}</span> followers
          </button>
          <button
            onClick={() => {
              setFollowingTemp(user.followingList ?? []);
              setShowFollowingModal(true);
            }}
            className="px-4 py-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium transition"
          >
            <span className="font-semibold">{user.followingCount ?? 0}</span>{" "}
            following
          </button>
        </div>

        {/* Bio */}
        <p className="mt-4 text-gray-500 px-4 md:px-0">
          {user.bio && user.bio.toString().trim() ? (
            user.bio
          ) : (
            <span className="text-gray-400">No bio yet.</span>
          )}
        </p>
      </div>

      {/* Edit Modal */}
      {isEditing && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 relative">
            <h3 className="text-2xl font-semibold mb-4">Edit Profile</h3>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Profile Picture
              </label>
              <input
                type="text"
                placeholder="Image filename or URL"
                value={editProfilePicture}
                onChange={(e) => setEditProfilePicture(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Bio</label>
              <textarea
                rows={4}
                value={editBio}
                onChange={(e) => setEditBio(e.target.value)}
                className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Followers Modal */}
      {showFollowersModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-2xl font-semibold mb-4">Followers</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {(followersList ?? []).map((f) => (
                <div
                  key={f._id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {f.profilePicture ? (
                      <img
                        src={`/uploads/${f.profilePicture}`}
                        alt={f.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold">
                        {f.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-gray-700">
                      {f.username}
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      // Remove follower locally
                      setFollowersList((prev) =>
                        prev?.filter((u) => u._id !== f._id)
                      );
                      setFollowersCount((c) => Math.max(0, c - 1));
                    }}
                    className="px-3 py-1 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowFollowersModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Following Modal */}
      {showFollowingModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl w-full max-w-md p-6">
            <h3 className="text-2xl font-semibold mb-4">Following</h3>
            <div className="space-y-3 max-h-80 overflow-y-auto">
              {followingTemp.map((f) => (
                <div
                  key={f._id}
                  className="flex items-center justify-between gap-3"
                >
                  <div className="flex items-center gap-3">
                    {f.profilePicture ? (
                      <img
                        src={`/uploads/${f.profilePicture}`}
                        alt={f.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-indigo-400 flex items-center justify-center text-white font-bold">
                        {f.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <span className="font-medium text-gray-700">
                      {f.username}
                    </span>
                  </div>
                  <button
                    onClick={() => toggleFollowButton(f._id)}
                    className={`px-3 py-1 rounded-lg font-medium transition ${
                      f.isFollowing
                        ? "bg-gray-400 text-white"
                        : "bg-blue-500 text-white"
                    }`}
                  >
                    {f.isFollowing ? "Unfollow" : "Follow"}
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-4 flex justify-end">
              <button
                onClick={() => setShowFollowingModal(false)}
                className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
