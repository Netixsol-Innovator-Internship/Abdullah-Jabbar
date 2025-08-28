'use client';
import React, { useEffect, useMemo, useState } from 'react';
import API from '../lib/api';
import { useSocket } from './socket-provider';
import ReactMarkdown from 'react-markdown';

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
  isLiked?: boolean; // whether current viewer liked it
}

interface Props {
  comment?: CommentModel; // optional
  onReplyOpen: (comment: CommentModel) => void;
}

export default function CommentCard({ comment, onReplyOpen }: Props) {
  const socket = useSocket();
  const [liked, setLiked] = useState<boolean>(!!comment?.isLiked);
  const [likesCount, setLikesCount] = useState<number>(comment?.likesCount ?? 0);
  const [likeBusy, setLikeBusy] = useState(false);

  const createdAt = useMemo(
    () => (comment?.createdAt ? new Date(comment.createdAt).toLocaleString() : ''),
    [comment?.createdAt]
  );

  useEffect(() => {
    if (!socket || !comment?._id) return;

    const onLiked = (payload: { commentId: string; delta: 1 | -1 }) => {
      if (payload.commentId !== comment._id) return;
      setLikesCount((c) => Math.max(0, c + payload.delta));
    };

    socket.on('comment.liked', onLiked);
    return () => {
      socket.off('comment.liked', onLiked);
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
      if (typeof res?.data?.isLiked === 'boolean') setLiked(res.data.isLiked);
      if (typeof res?.data?.likesCount === 'number') setLikesCount(res.data.likesCount);
    } catch {
      setLiked((s) => !s);
      setLikesCount((c) => (next ? Math.max(0, c - 1) : c + 1));
    } finally {
      setLikeBusy(false);
    }
  }

  if (!comment) return null;

  return (
    <div className="p-4 bg-white rounded shadow mb-3">
      <div className="flex items-start">
        <img
          src={comment.author?.profilePicture ? `/uploads/${comment.author.profilePicture}` : '/images/avatar.png'}
          alt=""
          className="w-10 h-10 rounded-full mr-3 object-cover"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <strong className="truncate">{comment.author?.username}</strong>
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
              <svg width="18" height="18" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{likesCount}</span>
            </button>

            <button onClick={() => onReplyOpen(comment)} className="text-sm inline-flex items-center gap-1">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                  d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
              <span>Replies {comment.repliesCount ?? 0}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
