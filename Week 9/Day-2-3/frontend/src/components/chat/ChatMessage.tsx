"use client";

import React from "react";
import { ChatMessage as ChatMessageType } from "./types";
import { renderAnswer } from "./renderAnswer";

interface ChatMessageProps {
  message: ChatMessageType;
  index: number;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, index }) => {
  return (
    <div
      className={`flex ${message.type === "user" ? "justify-end" : "justify-start"} px-2 sm:px-0 ${
        message.isAnimating
          ? message.type === "user"
            ? "animate-slide-in-right"
            : "animate-slide-in-left"
          : ""
      }`}
      style={{
        animationDelay: message.isAnimating ? `${index * 50}ms` : "0ms",
      }}
    >
      <div
        className={`max-w-216.5 w-full sm:w-auto rounded-2xl px-4 py-3 shadow-sm transition-all duration-300  ${
          message.type === "user"
            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700"
            : message.type === "system"
              ? "bg-gradient-to-r from-amber-50 to-yellow-50 border border-amber-200/50 text-amber-800 hover:from-amber-100 hover:to-yellow-100"
              : "bg-white/80 backdrop-blur-sm border border-gray-200/50 text-gray-800 hover:bg-white/90 hover:shadow-sm"
        }`}
      >
        {message.isTyping ? (
          <div className="flex items-center space-x-3">
            <div className="typing-dots">
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
              <div className="typing-dot"></div>
            </div>
            <span className="text-sm text-gray-600 animate-pulse">
              {message.content}...
            </span>
          </div>
        ) : (
          <div>
            {message.data ? (
              renderAnswer(message.data)
            ) : (
              <p className="whitespace-pre-wrap">{message.content}</p>
            )}
            <p
              className={`text-xs mt-2 opacity-70 ${
                message.type === "user"
                  ? "text-blue-100"
                  : message.type === "system"
                    ? "text-amber-600"
                    : "text-gray-500"
              }`}
            >
              {message.timestamp.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
