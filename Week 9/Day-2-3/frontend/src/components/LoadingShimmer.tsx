import React from "react";

interface LoadingShimmerProps {
  lines?: number;
  className?: string;
}

const LoadingShimmer: React.FC<LoadingShimmerProps> = ({
  lines = 3,
  className = "",
}) => {
  return (
    <div className={`animate-pulse ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <div
          key={index}
          className={`animate-shimmer bg-gray-200 rounded-md mb-2 ${
            index === lines - 1
              ? "w-3/4 h-4"
              : index === 0
                ? "w-full h-4"
                : "w-5/6 h-4"
          }`}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationDuration: "1.5s",
          }}
        />
      ))}
    </div>
  );
};

export default LoadingShimmer;
