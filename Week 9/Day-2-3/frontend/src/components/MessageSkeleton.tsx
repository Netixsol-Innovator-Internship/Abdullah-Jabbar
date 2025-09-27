import React from "react";

interface MessageSkeletonProps {
  isUser?: boolean;
  lines?: number;
}

const MessageSkeleton: React.FC<MessageSkeletonProps> = ({
  isUser = false,
  lines = 2,
}) => {
  return (
    <div
      className={`flex ${isUser ? "justify-end" : "justify-start"} px-2 sm:px-0 animate-fade-in-scale`}
    >
      <div
        className={`max-w-3xl w-full sm:w-auto rounded-2xl px-4 py-3 shadow-sm ${
          isUser
            ? "bg-gradient-to-r from-blue-500/20 to-blue-600/20"
            : "bg-white/60 backdrop-blur-sm border border-gray-200/50"
        }`}
      >
        <div className="animate-pulse">
          {Array.from({ length: lines }).map((_, index) => (
            <div
              key={index}
              className={`animate-shimmer bg-gray-300/50 rounded-md mb-2 last:mb-0 ${
                index === lines - 1
                  ? "w-3/4 h-4"
                  : index === 0
                    ? "w-full h-4"
                    : "w-5/6 h-4"
              }`}
              style={{
                animationDelay: `${index * 0.15}s`,
                animationDuration: "1.8s",
              }}
            />
          ))}

          {/* Timestamp skeleton */}
          <div
            className="w-16 h-3 bg-gray-200/50 rounded-md mt-2 animate-shimmer"
            style={{
              animationDelay: `${lines * 0.15}s`,
              animationDuration: "1.8s",
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageSkeleton;
