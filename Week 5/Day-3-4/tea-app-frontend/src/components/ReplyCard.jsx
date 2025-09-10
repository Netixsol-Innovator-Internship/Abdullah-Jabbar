import React, { useMemo, useState } from "react";
import { toggleLike } from "../lib/api";
import ReactMarkdown from "react-markdown";

export default function ReplyCard({
  reply,
  currentUser = { _id: "anonymous", username: "Anonymous User" },
}) {
  const [liked, setLiked] = useState(!!reply.isLiked);
  const [likesCount, setLikesCount] = useState(reply.likesCount ?? 0);
  const [busy, setBusy] = useState(false);

  const createdAt = useMemo(
    () => new Date(reply.createdAt).toLocaleString(),
    [reply.createdAt]
  );

  async function handleToggleLike() {
    if (busy) return;
    setBusy(true);

    const next = !liked;
    setLiked(next);
    setLikesCount((c) => (next ? c + 1 : Math.max(0, c - 1)));

    try {
      const response = await toggleLike(reply._id, currentUser._id);
      if (typeof response?.isLiked === "boolean") setLiked(response.isLiked);
      if (typeof response?.likesCount === "number")
        setLikesCount(response.likesCount);
    } catch (error) {
      console.error("Failed to toggle like:", error);
      // Revert changes on error
      setLiked((s) => !s);
      setLikesCount((c) => (next ? Math.max(0, c - 1) : c + 1));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="p-3 bg-white rounded shadow mb-2 ml-8">
      <div className="flex items-start">
        <img
          src={
            reply.author?.profilePicture
              ? `/uploads/${reply.author.profilePicture}`
              : "/user.png"
          }
          width={32}
          height={32}
          className="w-8 h-8 rounded-full mr-3 object-cover"
          alt={reply.author?.username || reply.authorName || "User avatar"}
        />
        <div className="flex-1">
          <div className="text-sm font-semibold">
            {reply.author?.username || reply.authorName || "Anonymous User"}
          </div>
          <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">
            <ReactMarkdown>{reply.text}</ReactMarkdown>
          </div>
          <div className="mt-1 flex items-center gap-3 text-sm">
            <span className="text-gray-500 text-xs">{createdAt}</span>
            <button
              onClick={handleToggleLike}
              disabled={busy}
              className="inline-flex items-center gap-1 text-sm disabled:opacity-50 hover:text-red-500 transition-colors"
              aria-pressed={liked}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill={liked ? "currentColor" : "none"}
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z"
                />
              </svg>
              <span>{likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
