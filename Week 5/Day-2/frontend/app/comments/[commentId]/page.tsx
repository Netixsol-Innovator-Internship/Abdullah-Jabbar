"use client";
import React, { useEffect, useState, useCallback } from "react";
import { getCommentById, getReplies, replyToComment } from "../../../lib/api";
import { useSocket } from "../../../components/socket-provider";
import ReplyCard from "../../../components/reply-card";
import { useAuth } from "../../../components/auth-context";
import Link from "next/link";
import Image from "next/image";

interface CommentData {
  _id: string;
  author: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  text: string;
  createdAt: string;
  postId?: string;
  likesCount?: number;
  repliesCount?: number;
  isLiked?: boolean;
}

interface ReplyData {
  _id: string;
  author: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  text: string;
  createdAt: string;
  likesCount?: number;
  isLiked?: boolean;
}

export default function CommentPage({
  params,
}: {
  params: Promise<{ commentId: string }>;
}) {
  const [commentId, setCommentId] = React.useState<string>("");
  const { user } = useAuth();
  const [comment, setComment] = useState<CommentData | null>(null);
  const [replies, setReplies] = useState<ReplyData[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [replying, setReplying] = useState(false);
  const socket = useSocket();

  // Extract commentId from params
  useEffect(() => {
    const getParams = async () => {
      const resolvedParams = await params;
      setCommentId(resolvedParams.commentId);
    };
    getParams();
  }, [params]);

  const fetchCommentAndReplies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const [commentRes, repliesRes] = await Promise.all([
        getCommentById(commentId),
        getReplies(commentId),
      ]);

      setComment(commentRes);
      setReplies(repliesRes || []);
    } catch (err) {
      console.error("Failed to fetch comment or replies:", err);
      setError("Failed to load comment");
    } finally {
      setLoading(false);
    }
  }, [commentId]);

  useEffect(() => {
    if (commentId) {
      fetchCommentAndReplies();
    }
  }, [commentId, fetchCommentAndReplies]);

  useEffect(() => {
    if (!socket) return;

    const handleCommentReply = (payload: ReplyData & { commentId: string }) => {
      if (payload.commentId === commentId) {
        setReplies((s) => [...s, payload]);
        // Update replies count
        setComment((prev) =>
          prev ? { ...prev, repliesCount: (prev.repliesCount || 0) + 1 } : null
        );
      }
    };

    socket.on("comment.replied", handleCommentReply);

    return () => {
      socket.off("comment.replied", handleCommentReply);
    };
  }, [socket, commentId]);

  const handlePostReply = async () => {
    if (!comment || !text.trim() || replying) return;

    setReplying(true);
    try {
      const response = await replyToComment(
        comment.postId || "demo-post-1",
        commentId,
        text.trim()
      );

      if (response) {
        setText("");
        // The real-time socket will handle adding the reply to the list
      }
    } catch (error) {
      console.error("Failed to post reply:", error);
      alert("Failed to post reply. Please try again.");
    } finally {
      setReplying(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading comment...</p>
      </div>
    );
  }

  if (error || !comment) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 text-center">
        <p className="text-red-500 mb-4">{error || "Comment not found"}</p>
        <Link
          href="/comments"
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Back to Comments
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6">
      {/* Main Comment */}
      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <div className="flex items-start">
          <Image
            src={
              comment.author?.profilePicture
                ? `/uploads/${comment.author.profilePicture}`
                : "/images/avatar.png"
            }
            alt={comment.author?.username || "User avatar"}
            width={48}
            height={48}
            className="w-12 h-12 rounded-full mr-4 object-cover"
          />
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <h3 className="font-semibold text-lg">
                {comment.author?.username}
              </h3>
              <span className="text-gray-500 text-sm">
                {new Date(comment.createdAt).toLocaleString()}
              </span>
            </div>
            <p className="text-gray-700 whitespace-pre-wrap break-words">
              {comment.text}
            </p>

            <div className="mt-4 flex items-center gap-4 text-sm text-gray-500">
              <span>{comment.likesCount || 0} likes</span>
              <span>{comment.repliesCount || 0} replies</span>
            </div>
          </div>
        </div>
      </div>

      {/* Reply Form */}
      {user && (
        <div className="bg-white rounded-lg shadow p-4 mb-6">
          <h4 className="font-semibold mb-3">Reply to this comment</h4>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={3}
            placeholder="Write your reply..."
          />
          <div className="mt-3 flex justify-end">
            <button
              onClick={handlePostReply}
              disabled={replying || !text.trim()}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {replying ? "Posting..." : "Post Reply"}
            </button>
          </div>
        </div>
      )}

      {/* Replies */}
      <div>
        <h4 className="font-semibold mb-4">Replies ({replies.length})</h4>

        {replies.length > 0 ? (
          <div className="space-y-3">
            {replies.map((reply) => (
              <ReplyCard key={reply._id} reply={reply} />
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No replies yet. Be the first to reply!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
