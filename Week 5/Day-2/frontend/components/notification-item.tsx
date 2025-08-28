'use client';
import React from 'react';

interface NotificationItemProps {
  item: {
    _id: string;
    type: string;
    actorId?: string;       // optionally show actor username if you populate it
    actorName?: string;
    createdAt: string | number | Date;
    read?: boolean;
    message?: string;       // optional server-computed message
  };
  onMarkRead: (id: string) => void;
}

export default function NotificationItem({ item, onMarkRead }: NotificationItemProps) {
  const createdAt = new Date(item.createdAt).toLocaleString();

  return (
    <div className={`p-3 rounded mb-2 flex justify-between ${item.read ? 'bg-white' : 'bg-blue-50'}`}>
      <div className="pr-3">
        <div className="text-sm">
          {item.message ?? `${item.type}${item.actorName ? ` by ${item.actorName}` : item.actorId ? ` by ${item.actorId}` : ''}`}
        </div>
        <div className="text-xs text-gray-500">{createdAt}</div>
      </div>
      <div className="self-center">
        {!item.read && (
          <button onClick={() => onMarkRead(item._id)} className="text-sm text-blue-600 hover:underline">
            Mark read
          </button>
        )}
      </div>
    </div>
  );
}
