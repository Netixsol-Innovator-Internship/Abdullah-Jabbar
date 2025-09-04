"use client";
import React, { useEffect, useMemo, useState } from "react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import Link from "next/link";
import Image from "next/image";
import API, { getReplies, replyToComment } from "../lib/api";
import { useSocket } from "./socket-provider";
import ReactMarkdown from "react-markdown";
import ReplyCard from "./reply-card";

interface Author {
  _id: string;
  username: string;
  profilePicture?: string;
}

interface CommentModel {
  _id: string;
  author: Author;
  text: string;
  createdAt: string | number | Date;
  likesCount?: number;
  repliesCount?: number;
  postId?: string;
  isLiked?: boolean; // whether current viewer liked it
}

interface ReplyModel {
  _id: string;
  author: Author;
  text: string;
  createdAt: string | number | Date;
  likesCount?: number;
  isLiked?: boolean;
}

interface Props {
  comment?: CommentModel; // optional
  onReplyOpen?: (comment: CommentModel) => void; // kept optional for compatibility
}

export default function CommentCard({ comment, onReplyOpen }: Props) {
  const socket = useSocket();
  const [liked, setLiked] = useState<boolean>(!!comment?.isLiked);
  const [likesCount, setLikesCount] = useState<number>(
    comment?.likesCount ?? 0
  );
  const [likeBusy, setLikeBusy] = useState(false);
  // Replies state
  const [showReplies, setShowReplies] = useState(false);
  const [replies, setReplies] = useState<ReplyModel[]>([]);
  const [loadingReplies, setLoadingReplies] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [postingReply, setPostingReply] = useState(false);
  const [showReplyEmojiPicker, setShowReplyEmojiPicker] = useState(false);

  const createdAt = useMemo(
    () =>
      comment?.createdAt ? new Date(comment.createdAt).toLocaleString() : "",
    [comment?.createdAt]
  );

  useEffect(() => {
    if (!socket || !comment?._id) return;

    const onLiked = (payload: { commentId: string; delta: 1 | -1 }) => {
      if (payload.commentId !== comment._id) return;
      setLikesCount((c) => Math.max(0, c + payload.delta));
    };

    socket.on("comment.liked", onLiked);
    return () => {
      socket.off("comment.liked", onLiked);
    };
  }, [socket, comment?._id]);

  async function toggleLike() {
    if (!comment?._id || likeBusy) return;
    setLikeBusy(true);

    const next = !liked;
    setLiked(next);
    setLikesCount((c) => (next ? c + 1 : Math.max(0, c - 1)));

    try {
      const res = await API.post(`/likes/toggle/${comment._id}`);
      if (typeof res?.data?.isLiked === "boolean") setLiked(res.data.isLiked);
      if (typeof res?.data?.likesCount === "number")
        setLikesCount(res.data.likesCount);
    } catch {
      setLiked((s) => !s);
      setLikesCount((c) => (next ? Math.max(0, c - 1) : c + 1));
    } finally {
      setLikeBusy(false);
    }
  }

  async function loadReplies() {
    if (!comment?._id) return;
    setLoadingReplies(true);
    try {
      const res = await getReplies(comment._id);
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
    if (next && typeof onReplyOpen === "function" && comment)
      onReplyOpen(comment);
    if (next && replies.length === 0) {
      await loadReplies();
    }
  }

  async function handlePostReply() {
    if (!comment?._id || postingReply) return;
    const text = replyText.trim();
    if (!text) return;
    // Need postId to create a reply
    const postId = comment?.postId;
    if (!postId) {
      console.error("Cannot post reply: missing postId on comment");
      return;
    }
    setPostingReply(true);
    const temp: ReplyModel = {
      _id: `temp-${Date.now()}`,
      author: comment.author, // optimistic: assume current user is same? keeps UI responsive
      text,
      createdAt: new Date().toISOString(),
      likesCount: 0,
      isLiked: false,
    };
    setReplies((r) => [...r, temp]);
    setReplyText("");
    try {
      const res = await replyToComment(postId, comment._id, text);
      if (res?.reply) {
        setReplies((r) => r.map((x) => (x._id === temp._id ? res.reply : x)));
      }
    } catch (err) {
      console.error("Failed to post reply:", err);
      setReplies((r) => r.filter((x) => x._id !== temp._id));
    } finally {
      setPostingReply(false);
      // close the emoji picker after attempting to post (success or fail)
      setShowReplyEmojiPicker(false);
    }
  }

  const handleReplyEmojiClick = (emojiData: EmojiClickData) => {
    const id = `reply-input-${comment!._id}`;
    const input = document.getElementById(id) as HTMLTextAreaElement | null;
    const cursorPos = input?.selectionStart ?? replyText.length;
    const textBefore = replyText.substring(0, cursorPos);
    const textAfter = replyText.substring(cursorPos);
    const next = textBefore + emojiData.emoji + textAfter;
    setReplyText(next);
    // place caret after inserted emoji
    setTimeout(() => input?.focus(), 0);
  };

  const wrapReplySelection = (wrapper: "**" | "_") => {
    const id = `reply-input-${comment!._id}`;
    const input = document.getElementById(id) as HTMLTextAreaElement | null;
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

  if (!comment) return null;

  return (
    <div className="p-4 bg-white rounded shadow mb-3">
      <div className="flex items-start">
        <Image
          src={
            comment.author?.profilePicture
              ? `/uploads/${comment.author.profilePicture}`
              : "/user.png"
          }
          alt={comment.author?.username || "avatar"}
          width={40}
          height={40}
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <strong className="truncate">
              <Link
                href={`/profile/${comment.author?._id}`}
                className="text-inherit no-underline"
              >
                {comment.author?.username}
              </Link>
            </strong>
            <span className="text-gray-500 text-sm">{createdAt}</span>
          </div>
          <div className="mt-2 whitespace-pre-wrap break-words">
            <ReactMarkdown>{comment.text}</ReactMarkdown>
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
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.8"
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
                />
              </svg>
              <span className="inline-flex items-center gap-2">
                <span>Replies {comment.repliesCount ?? 0}</span>
                {/* chevron that rotates when replies are visible */}
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 20 20"
                  fill="none"
                  stroke="currentColor"
                  className={`transform transition-transform duration-150 ${
                    showReplies ? "-rotate-180" : "rotate-0"
                  }`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="1.8"
                    d="M6 8l4 4 4-4"
                  />
                </svg>
              </span>
            </button>
          </div>
        </div>
      </div>
      {/* Replies section */}
      {showReplies && (
        <div className="mt-3 ml-12">
          {/* Reply input */}
          <div className="mb-2">
            <div className="flex items-center gap-2 mb-2">
              <button
                type="button"
                onClick={() => wrapReplySelection("**")}
                className="px-3 py-1 bg-gray-200 rounded hover:bg-gray-300"
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
              id={`reply-input-${comment._id}`}
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
                className="px-3 py-1 bg-indigo-600 text-white rounded hover:bg-indigo-700 disabled:opacity-50"
              >
                {postingReply ? "Posting..." : "Reply"}
              </button>
            </div>
          </div>

          {/* Replies list */}
          {loadingReplies ? (
            <div className="text-sm text-gray-500">Loading replies...</div>
          ) : replies.length > 0 ? (
            replies.map((r) => <ReplyCard key={r._id} reply={r} />)
          ) : (
            <div className="text-sm text-gray-500">No replies yet.</div>
          )}
        </div>
      )}
    </div>
  );
}
