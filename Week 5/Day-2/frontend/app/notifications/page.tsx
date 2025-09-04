"use client";
import React, { useEffect, useState } from "react";
import { getNotifications, markNotificationRead } from "../../lib/api";
import { useSocket } from "../../components/socket-provider";
import NotificationItem from "../../components/notification-item";

interface NotificationData {
  _id: string;
  type: string;
  actorId?: string;
  actorName?: string;
  createdAt: string;
  read?: boolean;
  message?: string;
}

export default function NotificationsPage() {
  const [items, setItems] = useState<NotificationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const socket = useSocket();

  useEffect(() => {
    fetchNotifications();
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = (payload: NotificationData) => {
      setItems((s) => [payload, ...s]);
    };

    socket.on("notification.created", handleNewNotification);

    return () => {
      socket.off("notification.created", handleNewNotification);
    };
  }, [socket]);

  const fetchNotifications = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getNotifications();
      setItems(response || []);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
      setError("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleMarkRead = async (id: string) => {
    try {
      await markNotificationRead(id);
      setItems((s) =>
        s.map((it) => (it._id === id ? { ...it, read: true } : it))
      );
    } catch (error) {
      console.error("Failed to mark notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    const unreadItems = items.filter((item) => !item.read);

    try {
      await Promise.all(
        unreadItems.map((item) => markNotificationRead(item._id))
      );
      setItems((s) => s.map((it) => ({ ...it, read: true })));
    } catch (error) {
      console.error("Failed to mark all notifications as read:", error);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-4 text-gray-500">Loading notifications...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto mt-8 p-6 text-center">
        <p className="text-red-500 mb-4">{error}</p>
        <button
          onClick={fetchNotifications}
          className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          Try Again
        </button>
      </div>
    );
  }

  const unreadCount = items.filter((item) => !item.read).length;

  return (
    <div className="max-w-2xl mx-auto mt-8 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold">
          Notifications{" "}
          {unreadCount > 0 && (
            <span className="ml-2 px-2 py-1 bg-red-500 text-white text-sm rounded-full">
              {unreadCount}
            </span>
          )}
        </h2>

        {unreadCount > 0 && (
          <button
            onClick={markAllAsRead}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 text-sm"
          >
            Mark All Read
          </button>
        )}
      </div>

      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <NotificationItem
              key={item._id}
              item={item}
              onMarkRead={handleMarkRead}
            />
          ))
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No notifications yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
