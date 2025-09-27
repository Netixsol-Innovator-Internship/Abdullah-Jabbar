"use client";

import React from "react";

interface WelcomeMessageProps {
  onSuggestionClick: (suggestion: string) => void;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({
  onSuggestionClick,
}) => {
  const suggestions = [
    { text: "Pak ODI records", query: "Show me Pakistan's highest ODI scores" },
    { text: "T20 high scores", query: "Top 5 T20 matches with highest scores" },
    { text: "Ashes matches", query: "Australia vs England Test matches" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center animate-fade-in-scale">
      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 animate-pulse hover:animate-none hover:scale-110 transition-all duration-300">
        <span className="text-2xl">🏏</span>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">
        Welcome to Cricket Chat!
      </h3>
      <p className="text-gray-500 max-w-md">
        Ask me anything about cricket statistics, match records, player
        performances, or team comparisons. I remember our conversation context!
      </p>
      <div className="mt-4 flex flex-wrap gap-2 justify-center px-4">
        {suggestions.map((suggestion, index) => (
          <button
            key={suggestion.text}
            onClick={() => onSuggestionClick(suggestion.query)}
            className="px-4 py-2 bg-white/80 backdrop-blur-sm border border-gray-200/50 rounded-full text-sm text-gray-700 hover:bg-white hover:shadow-md transition-all duration-300 hover-lift btn-press animate-slide-in-up"
            style={{ animationDelay: `${(index + 1) * 100}ms` }}
          >
            {suggestion.text}
          </button>
        ))}
      </div>
    </div>
  );
};

export default WelcomeMessage;
