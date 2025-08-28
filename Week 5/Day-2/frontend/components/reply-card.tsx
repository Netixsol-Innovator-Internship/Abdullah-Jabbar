'use client';
import React, { useMemo, useState } from 'react';
import API from '../lib/api';

interface Author {
  _id: string;
  username: string;
  profilePicture?: string;
}

interface ReplyModel {
  _id: string;
  author: Author;
  text: string;
  createdAt: string | number | Date;
  likesCount?: number;
  isLiked?: boolean;
}

export default function ReplyCard({ reply }: { reply: ReplyModel }) {
  const [liked, setLiked] = useState<boolean>(!!reply.isLiked);
  const [likesCount, setLikesCount] = useState<number>(reply.likesCount ?? 0);
  const [busy, setBusy] = useState(false);

  const createdAt = useMemo(() => new Date(reply.createdAt).toLocaleString(), [reply.createdAt]);

  async function toggleLike() {
    if (busy) return;
    setBusy(true);

    const next = !liked;
    setLiked(next);
    setLikesCount((c) => (next ? c + 1 : Math.max(0, c - 1)));

    try {
      const res = await API.post(`/likes/toggle-reply/${reply._id}`);
      if (typeof res?.data?.isLiked === 'boolean') setLiked(res.data.isLiked);
      if (typeof res?.data?.likesCount === 'number') setLikesCount(res.data.likesCount);
    } catch {
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
          src={reply.author?.profilePicture ? `/uploads/${reply.author.profilePicture}` : '/images/avatar.png'}
          className="w-8 h-8 rounded-full mr-3 object-cover"
          alt=""
        />
        <div className="flex-1">
          <div className="text-sm font-semibold">{reply.author?.username}</div>
          <div className="text-sm text-gray-800 whitespace-pre-wrap break-words">{reply.text}</div>
          <div className="mt-1 flex items-center gap-3 text-sm">
            <span className="text-gray-500 text-xs">{createdAt}</span>
            <button
              onClick={toggleLike}
              disabled={busy}
              className="inline-flex items-center gap-1 text-sm disabled:opacity-50"
              aria-pressed={liked}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill={liked ? 'currentColor' : 'none'} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8"
                  d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 1 0-7.78 7.78L12 21.23l8.84-8.84a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
              <span>{likesCount}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
