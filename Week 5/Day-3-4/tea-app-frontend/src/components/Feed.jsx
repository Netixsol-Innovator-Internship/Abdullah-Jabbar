import React, { useState, useEffect } from "react";
import ReviewCard from "./ReviewCard";
import { createComment, getCommentsForPost } from "../lib/api";
import EmojiPicker from "emoji-picker-react";
import { useSocket } from "../hooks/useSocket";

export default function Feed({
  initialComments = [],
  currentUser = {
    _id: "anonymous",
    username: "Anonymous User",
    profilePicture: null,
  }, // Default anonymous user
  postId = "demo-post-1",
}) {
  const [reviews, setReviews] = useState(initialComments);
  const [newReview, setNewReview] = useState("");
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const socket = useSocket();

  // Fetch reviews for the post on component mount
  useEffect(() => {
    const loadReviews = async () => {
      if (postId && initialComments.length === 0) {
        setLoading(true);
        try {
          const response = await getCommentsForPost(postId);
          setReviews(response || []);
        } catch (error) {
          console.error("Failed to fetch reviews:", error);
        } finally {
          setLoading(false);
        }
      }
    };

    loadReviews();
  }, [postId, initialComments.length]);

  // Listen for real-time review updates
  useEffect(() => {
    if (!socket) return;

    const handleNewComment = (payload) => {
      if (payload.postId === postId) {
        setReviews((prev) => [payload, ...prev]);
      }
    };

    socket.on("comment.created", handleNewComment);

    return () => {
      socket.off("comment.created", handleNewComment);
    };
  }, [socket, postId]);

  const handleEmojiClick = (emojiData) => {
    const cursorPos =
      document.getElementById("comment-input")?.selectionStart ??
      newReview.length;
    const textBefore = newReview.substring(0, cursorPos);
    const textAfter = newReview.substring(cursorPos);
    setNewReview(textBefore + emojiData.emoji + textAfter);
  };

  const wrapSelection = (wrapper) => {
    const input = document.getElementById("comment-input");
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selected = newReview.slice(start, end);
    const newText =
      newReview.slice(0, start) +
      wrapper +
      selected +
      wrapper +
      newReview.slice(end);
    setNewReview(newText);
    setTimeout(() => input.focus(), 0);
  };

  const handleSendComment = async () => {
    if (!newReview.trim()) return;

    // Validate rating
    if (rating === 0) {
      setError({
        type: "rating",
        message: "Please select a rating before submitting your review.",
      });
      return;
    }

    setSending(true);

    const tempComment = {
      _id: `temp-${Date.now()}`,
      author: currentUser,
      text: newReview,
      rating: rating,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      repliesCount: 0,
      isLiked: false,
      postId,
    };
    setReviews((prev) => [tempComment, ...prev]);
    setNewReview("");
    setRating(0); // Reset rating after submission

    try {
      const response = await createComment(
        postId,
        newReview,
        currentUser._id,
        currentUser.username,
        rating
      );
      if (response?.comment) {
        setReviews((prev) =>
          prev.map((c) => (c._id === tempComment._id ? response.comment : c))
        );
      }
      setError(null); // Clear any previous errors
    } catch (err) {
      console.error("Failed to send review", err);
      setReviews((prev) => prev.filter((c) => c._id !== tempComment._id));

      setError({
        type: "general",
        message: "Failed to post review. Please try again.",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative">
      {/* Error Display */}
      {error && error.type !== "auth" && (
        <div className="mb-4 p-4 border rounded-lg bg-yellow-50 border-yellow-200 text-yellow-800">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">{error.message}</p>
            </div>
            <button
              onClick={() => setError(null)}
              className="px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition text-sm"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Remove the disabled warning section entirely */}

      {/* Toolbar */}
      <div className="flex gap-5 mb-1">
        <button
          type="button"
          onClick={() => wrapSelection("**")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 font-bold"
        >
          B
        </button>
        <button
          type="button"
          onClick={() => wrapSelection("_")}
          className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300 italic font-serif"
        >
          I
        </button>

        <button
          type="button"
          onClick={() => setShowEmojiPicker((prev) => !prev)}
          className="px-2 py-1 bg-gray-200 rounded hover:bg-gray-300"
        >
          Emoji 🙂
        </button>
      </div>

      {/* Rating Input */}
      <div className="mb-4">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <div
              key={star}
              className="relative cursor-pointer text-2xl transition-colors duration-150"
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            >
              {/* Left half (for half star) */}
              <button
                type="button"
                onClick={() => setRating(star - 0.5)}
                className="absolute left-0 w-1/2 h-full z-10 focus:outline-none"
                onMouseEnter={() => setHoverRating(star - 0.5)}
              />
              {/* Right half (for full star) */}
              <button
                type="button"
                onClick={() => setRating(star)}
                className="absolute right-0 w-1/2 h-full z-10 focus:outline-none"
                onMouseEnter={() => setHoverRating(star)}
              />

              {/* Star display */}
              <span className="relative block">
                {/* Background star */}
                <span className="text-gray-300">★</span>
                {/* Filled portion */}
                <span
                  className="absolute top-0 left-0 text-yellow-400 overflow-hidden"
                  style={{
                    width: `${Math.min(100, Math.max(0, ((hoverRating || rating) - star + 1) * 100))}%`,
                  }}
                >
                  ★
                </span>
              </span>
            </div>
          ))}
          <span className="ml-2 text-sm text-gray-600">
            {(hoverRating || rating) > 0
              ? `${hoverRating || rating} star${(hoverRating || rating) !== 1 ? "s" : ""}`
              : "Select a rating"}
          </span>
        </div>
        {error && error.type === "rating" && (
          <p className="mt-1 text-sm text-red-600">{error.message}</p>
        )}
      </div>

      {/* Review Input */}
      <div className="mb-6 flex items-start gap-3 relative">
        <textarea
          id="comment-input"
          rows={2}
          value={newReview}
          onChange={(e) => setNewReview(e.target.value)}
          placeholder="Write a review..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
        <button
          onClick={handleSendComment}
          disabled={sending || !newReview.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {sending ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Emoji Picker */}
      {showEmojiPicker && (
        <div className="relative w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-2xl mx-auto z-50">
          {/* Close Button */}
          <button
            onClick={() => setShowEmojiPicker(false)}
            className="absolute right-0 w-5 h-5 flex items-center justify-center  bg-gray-200 hover:bg-gray-300 text-red-500  font-bold z-50"
            aria-label="Close Emoji Picker"
          >
            ×
          </button>

          <div className="mt-10">
            <EmojiPicker
              onEmojiClick={handleEmojiClick}
              width="100%"
              height={300}
              searchDisabled={false}
              previewConfig={{ showPreview: false }}
            />
          </div>
        </div>
      )}

      {/* Reviews List */}
      <div className="space-y-4">
        {loading ? (
          <div className="text-center py-4">
            <p className="text-gray-500">Loading reviews...</p>
          </div>
        ) : reviews.length > 0 ? (
          reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              currentUser={currentUser}
            />
          ))
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No reviews yet. Be the first to review!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
