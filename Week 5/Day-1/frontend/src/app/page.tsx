"use client";

import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { Toaster, toast } from "sonner"; // ✅ added for toast

// Define the Comment type that matches what backend sends
type Comment = {
  userId: string;
  text: string;
  date: string;
};

const socket = io("http://localhost:4000"); // Connect to backend

export default function Home() {
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const [notification, setNotification] = useState("");

  useEffect(() => {
    // Load initial comments
    socket.emit("get_comments", null, (data: Comment[]) => {
      setComments(data);
    });

    // Listen for new comments
    socket.on("new_comment", (newComment: Comment) => {
      setComments((prev) => [newComment, ...prev]);
      setNotification("New comment received!");

      // ✅ Replace inline notification with toast
      toast.success("New comment received!", { duration: 1000 });

      setTimeout(() => setNotification(""), 1000);
    });

    return () => {
      socket.off("new_comment");
    };
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (comment.trim()) {
      socket.emit("add_comment", comment);
      setComment("");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-8 shadow-2xl rounded-2xl md:mt-8 lg:mt-10 mb-2">
      {/* ✅ Toast container, bottom of screen */}
      <Toaster richColors position="top-center" />

      {/* Title */}
      <h1 className="text-2xl sm:text-3xl font-extrabold mb-6 text-gray-800 tracking-tight">
        Real-Time Comments
      </h1>


    
      {/* Form */}
      <form onSubmit={handleSubmit} className="flex gap-2 mb-6">
        <input
          type="text"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          maxLength={1000}
          placeholder="Write a comment..."
          className="flex-grow min-w-0 border border-gray-300 rounded-xl px-3 py-2 text-sm sm:text-base
                   focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        />
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-5 py-2 rounded-xl font-medium shadow-md 
                   transition transform hover:scale-105 whitespace-nowrap"
        >
          Send
        </button>
      </form>

      {/* Comments list */}
      <ul className="space-y-3 max-h-screen sm:max-h-140 overflow-auto">
        {comments.map((c, i) => (
          <li
            key={i}
            className="p-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-md transition"
          >
            <div className="flex flex-col">
              <div className="flex justify-between">
                <span className="font-semibold text-blue-600">
                  {c.userId.slice(0, 5)}
                </span>{" "}
                <time
                  dateTime={c.date}
                  className="text-gray-500 text-xs leading-tight "
                >
                  {new Date(c.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "numeric",
                    day: "numeric",
                  })}{" "}
                  {new Date(c.date).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </time>
              </div>
              <p className="text-gray-800 break-words leading-snug">{c.text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
