'use client';
import React, { useEffect, useState } from 'react';
import API from '../../../lib/api';
import { useSocket } from '../../../components/socket-provider';
import ReplyCard from '../../../components/reply-card';

export default function CommentPage({ params }: any) {
  const { commentId } = params;
  const [comment, setComment] = useState<any>(null);
  const [replies, setReplies] = useState<any[]>([]);
  const [text, setText] = useState('');
  const socket = useSocket();

  useEffect(() => {
    (async () => {
      const res = await API.get(`/comments/${commentId}`);
      setComment(res.data);
      const r = await API.get(`/comments/replies/${commentId}`);
      setReplies(r.data);
    })();
  }, [commentId]);

  useEffect(() => {
    if (!socket) return;
    socket.on('comment.replied', (payload: any) => {
      if (payload.commentId === commentId) {
        setReplies((s) => [...s, payload]);
      }
    });
    return () => {
      socket.off('comment.replied');
    };
  }, [socket, commentId]);

  async function postReply() {
    if (!comment) return;
    await API.post('/comments/reply', { postId: comment.postId, parentCommentId: commentId, text });
    setText('');
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      {comment && (
        <div>
          <div className="p-4 bg-white rounded shadow">
            <h3 className="font-semibold">{comment.author?.username}</h3>
            <p className="text-gray-700">{comment.text}</p>
          </div>

          <div className="mt-4">
            <textarea value={text} onChange={(e) => setText(e.target.value)} className="w-full p-3 border rounded" />
            <button onClick={postReply} className="mt-2 px-4 py-2 bg-blue-600 text-white rounded">Reply</button>
          </div>

          <div className="mt-4">
            {replies.map((r: any) => (
              <ReplyCard key={r._id} reply={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
