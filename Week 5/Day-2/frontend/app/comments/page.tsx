'use client';
import React, { useEffect, useState } from 'react';
import API from '../../lib/api';
import { useSocket } from '../../components/socket-provider';
import CommentCard from '../../components/comment-card';

const DEMO_POST_ID = 'demo-post-1';

export default function CommentsPage() {
  const [comments, setComments] = useState<any[]>([]);
  const [text, setText] = useState('');
  const socket = useSocket();

  useEffect(() => {
    fetchComments();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('comment.created', (payload: any) => {
      setComments((s) => [payload, ...s]);
    });

    return () => {
      socket.off('comment.created');
    };
  }, [socket]);

  async function fetchComments() {
    const res = await API.get(`/comments/post/${DEMO_POST_ID}`);
    setComments(res.data);
  }

  async function create() {
    await API.post('/comments/create', { postId: DEMO_POST_ID, text });
    setText('');
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <div className="mb-4">
        <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 border rounded" />
        <button onClick={create} className="mt-2 px-4 py-2 bg-green-600 text-white rounded">Comment</button>
      </div>

      <div>
        {comments.map((c) => (
          <CommentCard key={c._id} comment={c} onReplyOpen={() => {}} />
        ))}
      </div>
    </div>
  );
}
