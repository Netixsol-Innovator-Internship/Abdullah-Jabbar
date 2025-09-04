"use client";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import API from "../lib/api";
import { useSocket } from "./socket-provider";

interface ItemUser {
  _id: string;
  username: string;
  profilePicture?: string;
  isFollowing: boolean; // whether the viewer follows this user
}

interface FollowersModalProps {
  title: string;
  initialUsers: ItemUser[];
  onClose: () => void;
}

export default function FollowersModal({
  title,
  initialUsers,
  onClose,
}: FollowersModalProps) {
  const socket = useSocket();
  const [users, setUsers] = useState<ItemUser[]>(initialUsers);
  const [loadingIds, setLoadingIds] = useState<Record<string, boolean>>({});

  // Keep list consistent if follow state changes elsewhere (profile card, another list)
  useEffect(() => {
    if (!socket) return;
    const onFollowLocalEcho = (payload: {
      targetUserId: string;
      isFollowing: boolean;
    }) => {
      setUsers((prev) =>
        prev.map((u) =>
          u._id === payload.targetUserId
            ? { ...u, isFollowing: payload.isFollowing }
            : u
        )
      );
    };
    socket.on("follow.changed", onFollowLocalEcho);
    return () => {
      socket.off("follow.changed", onFollowLocalEcho);
    };
  }, [socket]);

  const toggleFollow = useCallback(
    async (targetId: string, current: boolean) => {
      if (loadingIds[targetId]) return;
      setLoadingIds((m) => ({ ...m, [targetId]: true }));

      // optimistic
      setUsers((prev) =>
        prev.map((u) =>
          u._id === targetId ? { ...u, isFollowing: !current } : u
        )
      );

      try {
        const res = await API.post(`/followers/toggle/${targetId}`);
        const serverIsFollowing =
          typeof res?.data?.isFollowing === "boolean"
            ? res.data.isFollowing
            : !current;
        // align with server
        setUsers((prev) =>
          prev.map((u) =>
            u._id === targetId ? { ...u, isFollowing: serverIsFollowing } : u
          )
        );
        // notify other components for global consistency
        socket?.emit("follow.changed", {
          targetUserId: targetId,
          isFollowing: serverIsFollowing,
        });
      } catch {
        // rollback
        setUsers((prev) =>
          prev.map((u) =>
            u._id === targetId ? { ...u, isFollowing: current } : u
          )
        );
      } finally {
        setLoadingIds((m) => ({ ...m, [targetId]: false }));
      }
    },
    [loadingIds, socket]
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg w-full max-w-md shadow-md">
        <div className="flex items-center justify-between px-4 py-3 border-b">
          <h3 className="font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-sm text-gray-600 hover:underline"
          >
            Close
          </button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto p-3">
          {users.length === 0 && (
            <div className="text-center text-gray-500 text-sm py-8">
              No users to show.
            </div>
          )}
          <ul className="space-y-3">
            {users.map((u) => (
              <li key={u._id} className="flex items-center">
                <img
                  src={
                    u.profilePicture
                      ? `/uploads/${u.profilePicture}`
                      : "/images/avatar.png"
                  }
                  className="w-8 h-8 rounded-full mr-3 object-cover"
                  alt=""
                />
                <div className="flex-1">
                  <div className="text-sm font-medium">{u.username}</div>
                </div>
                <button
                  disabled={!!loadingIds[u._id]}
                  onClick={() => toggleFollow(u._id, u.isFollowing)}
                  className={`px-3 py-1 rounded text-sm ${
                    u.isFollowing ? "bg-gray-200" : "bg-blue-600 text-white"
                  } disabled:opacity-50`}
                >
                  {u.isFollowing ? "Unfollow" : "Follow"}
                </button>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
