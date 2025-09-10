import React, { useEffect, useMemo, useState } from "react";
import EmojiPicker from "emoji-picker-react";
import API, { getReplies, replyToComment } from "../lib/api";
import { useSocket } from "../hooks/useSocket";
import ReactMarkdown from "react-markdown";
import ReplyCard from "./ReplyCard";
import { useNavigate } from "react-router-dom";

export default function ReviewCard({
  review,
  onReplyOpen,
  currentUser = { _id: "anonymous", username: "Anonymous User" },
}) {
  const socket = useSocket();
  const navigate = useNavigate();
  const [liked, setLiked] = useState(!!review?.isLiked);
  const [likesCount, setLikesCount] = useState(review?.likesCount ?? 0);
  const [likeBusy, setLikeBusy] = useState(false);

  // Replies state
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [postingReply, setPostingReply] = useState(false);
  const [showReplyEmojiPicker, setShowReplyEmojiPicker] = useState(false);
  const [error, setError] = useState(null);

  const createdAt = useMemo(
    () =>
      review?.createdAt ? new Date(review.createdAt).toLocaleString() : "",
    [review?.createdAt]
  );

  useEffect(() => {
    if (!socket || !review?._id) return;

    const onLiked = (payload) => {
      if (payload.commentId !== review._id) return;
      setLikesCount((c) => Math.max(0, c + payload.delta));
    };

    socket.on("comment.liked", onLiked);
    return () => {
      socket.off("comment.liked", onLiked);
    };
  }, [socket, review?._id]);

  async function toggleLike() {
    if (!review?._id || likeBusy) return;
    setLikeBusy(true);

    const next = !liked;
    setLiked(next);
    setLikesCount((c) => (next ? c + 1 : Math.max(0, c - 1)));

    try {
      const res = await API.post(`/likes/toggle/${review._id}`, {
        userId: currentUser._id,
      });
      if (typeof res?.data?.isLiked === "boolean") setLiked(res.data.isLiked);
      if (typeof res?.data?.likesCount === "number")
        setLikesCount(res.data.likesCount);
      setError(null); // Clear any previous errors
    } catch (err) {
      // Revert optimistic update
      setLiked((s) => !s);
      setLikesCount((c) => (next ? Math.max(0, c - 1) : c + 1));
      console.error("Failed to toggle like:", err);
    } finally {
      setLikeBusy(false);
    }
  }

  async function loadReplies() {
    if (!review?._id) return;
    setLoadingReplies(true);
    try {
      const res = await getReplies(review._id);
      setReplies(res || []);
    } catch (err) {
      console.error("Failed to load replies:", err);
    } finally {
      setLoadingReplies(false);
    }
  }

  async function handleToggleReplies() {
    const next = !showReplies;
    setShowReplies(next);
    // notify parent if they want to react to reply-open
    if (next && typeof onReplyOpen === "function" && review)
      onReplyOpen(review);
    if (next && replies.length === 0) {
      await loadReplies();
    }
  }

  async function handlePostReply() {
    if (!review?._id || postingReply) return;
    const text = replyText.trim();
    if (!text) return;
    // Need postId to create a reply
    const postId = review?.postId;
    if (!postId) {
      console.error("Cannot post reply: missing postId on review");
      return;
    }
    setPostingReply(true);
    const temp = {
      _id: `temp-${Date.now()}`,
      author: currentUser, // Use current user (anonymous or logged in)
      authorName: currentUser.username,
      text,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
    };
    setReplies((r) => [...r, temp]);
    setReplyText("");
    try {
      const res = await replyToComment(
        postId,
        review._id,
        text,
        currentUser._id,
        currentUser.username
      );
      if (res?.reply) {
        setReplies((r) => r.map((x) => (x._id === temp._id ? res.reply : x)));
      }
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Failed to post reply:", err);
      console.error("Error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        postId,
        reviewId: review._id,
        userId: currentUser._id,
        username: currentUser.username,
      });
      setReplies((r) => r.filter((x) => x._id !== temp._id));

      setError({
        type: "general",
        message: `Failed to post reply: ${err.response?.data?.message || err.message || "Unknown error"}`,
      });
    } finally {
      setPostingReply(false);
      // close the emoji picker after attempting to post (success or fail)
      setShowReplyEmojiPicker(false);
    }
  }

  const handleReplyEmojiClick = (emojiData) => {
    const id = `reply-input-${review._id}`;
    const input = document.getElementById(id);
    const cursorPos = input?.selectionStart ?? replyText.length;
    const textBefore = replyText.substring(0, cursorPos);
    const textAfter = replyText.substring(cursorPos);
    const next = textBefore + emojiData.emoji + textAfter;
    setReplyText(next);
    // place caret after inserted emoji
    setTimeout(() => input?.focus(), 0);
  };

  const wrapReplySelection = (wrapper) => {
    const id = `reply-input-${review._id}`;
    const input = document.getElementById(id);
    const start = input?.selectionStart ?? replyText.length;
    const end = input?.selectionEnd ?? replyText.length;
    const selected = replyText.slice(start, end);
    const newText =
      replyText.slice(0, start) +
      wrapper +
      selected +
      wrapper +
      replyText.slice(end);
    setReplyText(newText);
    setTimeout(() => input?.focus(), 0);
  };

  if (!review) return null;

  return (
    <div className="p-4 bg-white rounded shadow mb-3">
      <div className="flex items-start">
        <img
          src={
            review.author?.profilePicture
              ? `/uploads/${review.author.profilePicture}`
              : "/user.png"
          }
          alt={review.author?.username || review.authorName || "avatar"}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <strong className="truncate">
              {review.author?.username || review.authorName || "Anonymous User"}
            </strong>
            <span className="text-gray-500 text-sm">{createdAt}</span>
          </div>
          {/* Rating Display */}
          {review.rating && (
            <div className="flex items-center gap-1 mt-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="relative text-sm inline-block">
                  {/* Background star */}
                  <span className="text-gray-300">★</span>
                  {/* Filled portion */}
                  <span
                    className="absolute top-0 left-0 text-yellow-400 overflow-hidden"
                    style={{
                      width: `${Math.min(100, Math.max(0, (review.rating - star + 1) * 100))}%`,
                    }}
                  >
                    ★
                  </span>
                </span>
              ))}
              <span className="ml-1 text-xs text-gray-600">
                {review.rating}
              </span>
            </div>
          )}
          <div className="mt-2 whitespace-pre-wrap break-words">
            <ReactMarkdown>{review.text}</ReactMarkdown>
          </div>
          <div className="mt-3 flex items-center gap-4">
            <button
              onClick={toggleLike}
              disabled={likeBusy}
              className="text-sm inline-flex items-center gap-1 disabled:opacity-50"
              aria-pressed={liked}
            >
              <svg
                width="18"
                height="18"
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

            <button
              onClick={handleToggleReplies}
              aria-expanded={showReplies}
              className="text-sm inline-flex items-center gap-2"
            >
              <span>💬</span>
              <span>{review.repliesCount || 0} replies</span>
            </button>
          </div>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <div
          className={`mt-3 p-3 border rounded-lg ${
            error.type === "auth"
              ? "bg-red-50 border-red-200 text-red-800"
              : "bg-yellow-50 border-yellow-200 text-yellow-800"
          }`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">{error.message}</p>
              {error.type === "auth" && (
                <p className="text-xs mt-1">
                  Please log in to interact with reviews.
                </p>
              )}
            </div>
            <div className="flex gap-2">
              {error.type === "auth" && (
                <button
                  onClick={() => navigate("/login")}
                  className="px-3 py-1 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 transition"
                >
                  Login
                </button>
              )}
              <button
                onClick={() => setError(null)}
                className="px-2 py-1 bg-gray-200 text-gray-700 rounded text-xs hover:bg-gray-300 transition"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Replies section */}
      {showReplies && (
        <div className="mt-3 ml-12">
          {/* Reply input */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => wrapReplySelection("**")}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold"
                aria-label="Bold"
              >
                B
              </button>
              <button
                type="button"
                onClick={() => wrapReplySelection("_")}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 italic font-serif"
                aria-label="Italic"
              >
                I
              </button>
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setShowReplyEmojiPicker((s) => !s)}
                  className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
                  aria-label="Emoji"
                >
                  🙂
                </button>
                {showReplyEmojiPicker && (
                  <div className="absolute z-50 mt-2">
                    <div className="relative">
                      <button
                        onClick={() => setShowReplyEmojiPicker(false)}
                        className="absolute right-0 top-0 z-50 p-1 text-sm bg-white rounded"
                      >
                        ×
                      </button>
                      <EmojiPicker
                        onEmojiClick={handleReplyEmojiClick}
                        width={320}
                        height={260}
                        previewConfig={{ showPreview: false }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>

            <textarea
              id={`reply-input-${review._id}`}
              rows={2}
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              placeholder="Write a reply..."
              className="w-full px-3 py-2 border rounded-lg resize-none"
            />
            <div className="flex justify-end mt-2">
              <button
                onClick={handlePostReply}
                disabled={postingReply || !replyText.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50"
              >
                {postingReply ? "Posting..." : "Post Reply"}
              </button>
            </div>
          </div>

          {/* Replies list */}
          {loadingReplies ? (
            <div className="text-sm text-gray-500">Loading replies...</div>
          ) : replies.length > 0 ? (
            replies.map((r) => (
              <ReplyCard key={r._id} reply={r} currentUser={currentUser} />
            ))
          ) : (
            <div className="text-sm text-gray-500">No replies yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
