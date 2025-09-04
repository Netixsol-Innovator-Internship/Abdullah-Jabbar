"use client";
import React, { useEffect, useState } from "react";
import { getCommentsForPost, createComment } from "../../lib/api";
import { useSocket } from "../../components/socket-provider";
import CommentCard from "../../components/comment-card";

interface CommentData {
  _id: string;
  author: {
    _id: string;
    username: string;
    profilePicture?: string;
  };
  text: string;
  createdAt: string;
  likesCount?: number;
  repliesCount?: number;
  isLiked?: boolean;
}

const DEMO_POST_ID = "demo-post-1";

export default function CommentsPage() {
  const [comments, setComments] = useState<CommentData[]>([]);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const socket = useSocket();

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewComment = (payload: CommentData) => {
      setComments((s) => [payload, ...s]);
    };

    socket.on("comment.created", handleNewComment);

    return () => {
      socket.off("comment.created", handleNewComment);
    };
  }, [socket]);

  async function fetchComments() {
    setLoading(true);
    try {
      const response = await getCommentsForPost(DEMO_POST_ID);
      setComments(response || []);
    } catch (error) {
      console.error("Failed to fetch comments:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handleCreateComment() {
    if (!text.trim() || creating) return;

    setCreating(true);
    try {
      await createComment(DEMO_POST_ID, text);
      setText("");
    } catch (error) {
      console.error("Failed to create comment:", error);
      alert("Failed to create comment. Please try again.");
    } finally {
      setCreating(false);
    }
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading comments...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6">
      <h1 className="text-2xl font-bold mb-6">Comments</h1>

      <div className="mb-6 bg-white rounded-lg shadow p-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          rows={3}
          placeholder="Write a comment..."
        />
        <div className="mt-3 flex justify-end">
          <button
            onClick={handleCreateComment}
            disabled={creating || !text.trim()}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {creating ? "Posting..." : "Post Comment"}
          </button>
        </div>
      </div>

      <div className="space-y-4">
        {comments.length > 0 ? (
          comments.map((c) => (
            <CommentCard key={c._id} comment={c} onReplyOpen={() => {}} />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              No comments yet. Be the first to comment!
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
