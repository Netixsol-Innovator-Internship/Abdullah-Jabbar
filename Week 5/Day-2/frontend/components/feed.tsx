"use client";
import React, { useState } from "react";
import CommentCard from "./comment-card";
import API from "../lib/api";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";

interface CommentItem {
  _id: string | number;
  author: { _id: string | number; username: string; profilePicture?: string };
  text: string;
  createdAt: string;
  likesCount?: number;
  repliesCount?: number;
  isLiked?: boolean;
}

interface FeedProps {
  initialComments?: CommentItem[];
  currentUser: { _id: string; username: string; profilePicture?: string };
}

export default function Feed({ initialComments = [], currentUser }: FeedProps) {
  const [comments, setComments] = useState<CommentItem[]>(initialComments);
  const [newComment, setNewComment] = useState("");
  const [sending, setSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const handleEmojiClick = (emojiData: EmojiClickData) => {
    const cursorPos =
      (document.getElementById("comment-input") as HTMLTextAreaElement)
        ?.selectionStart ?? newComment.length;
    const textBefore = newComment.substring(0, cursorPos);
    const textAfter = newComment.substring(cursorPos);
    setNewComment(textBefore + emojiData.emoji + textAfter);
  };

  const wrapSelection = (wrapper: "**" | "_") => {
    const input = document.getElementById(
      "comment-input"
    ) as HTMLTextAreaElement;
    const start = input.selectionStart;
    const end = input.selectionEnd;
    const selected = newComment.slice(start, end);
    const newText =
      newComment.slice(0, start) +
      wrapper +
      selected +
      wrapper +
      newComment.slice(end);
    setNewComment(newText);
    setTimeout(() => input.focus(), 0);
  };

  const handleSendComment = async () => {
    if (!newComment.trim()) return;
    setSending(true);

    const tempComment: CommentItem = {
      _id: `temp-${Date.now()}`,
      author: currentUser,
      text: newComment,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      repliesCount: 0,
      isLiked: false,
    };
    setComments((prev) => [tempComment, ...prev]);
    setNewComment("");

    try {
      const res = await API.post("/comments", { text: tempComment.text });
      if (res?.data?.comment) {
        setComments((prev) =>
          prev.map((c) => (c._id === tempComment._id ? res.data.comment : c))
        );
      }
    } catch (err) {
      console.error("Failed to send comment", err);
      setComments((prev) => prev.filter((c) => c._id !== tempComment._id));
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="relative">
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

      {/* Comment Input */}
      <div className="mb-6 flex items-start gap-3 relative">
        <textarea
          id="comment-input"
          rows={2}
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Write a comment..."
          className="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400 resize-none"
        />
        <button
          onClick={handleSendComment}
          disabled={sending || !newComment.trim()}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg cursor-pointer hover:bg-indigo-800 transition"
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

      {/* Comments List */}
      <div className="space-y-4">
        {comments.map((c) => (
          <CommentCard
            key={c._id}
            comment={c}
            onReplyOpen={(comment) =>
              console.log("Reply button clicked for:", comment._id)
            }
          />
        ))}
      </div>
    </div>
  );
}
