'use client';
import React, { useEffect, useState } from 'react';
import API from '../../lib/api';
import { useSocket } from '../../components/socket-provider';
import NotificationItem from '../../components/notification-item';

export default function NotificationsPage() {
  const [items, setItems] = useState<any[]>([]);
  const socket = useSocket();

  useEffect(() => {
    (async () => {
      const res = await API.get('/notifications');
      setItems(res.data || []);
    })();
  }, []);

  useEffect(() => {
    if (!socket) return;
    socket.on('notification.created', (payload: any) => {
      setItems((s) => [payload, ...s]);
    });
    return () => {
      socket.off('notification.created');
    };
  }, [socket]);

  async function markRead(id: string) {
    await API.post(`/notifications/mark-read/${id}`);
    setItems((s) => s.map((it) => (it._id === id ? { ...it, read: true } : it)));
  }

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      {items.map((it) => (
        <NotificationItem key={it._id} item={it} onMarkRead={markRead} />
      ))}
    </div>
  );
}
