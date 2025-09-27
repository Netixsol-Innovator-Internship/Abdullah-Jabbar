"use client";

import React from "react";
import { SummaryRecord } from "../../utils/api";

interface SummaryBannerProps {
  summary: SummaryRecord;
}

const SummaryBanner: React.FC<SummaryBannerProps> = ({ summary }) => {
  return (
    <div className="mx-4 mt-4 p-4 bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/30 rounded-2xl shadow-sm animate-slide-in-up hover-lift transition-all duration-300">
      <div className="flex items-start space-x-3">
        <span className="text-blue-500 mt-0.5 text-lg">💭</span>
        <div>
          <p className="text-sm text-blue-800/90 leading-relaxed">
            {summary.summarizedMemory}
          </p>
          <p className="text-xs text-blue-600/80 mt-2">
            Memory from {summary.conversationCount} conversations
          </p>
        </div>
      </div>
    </div>
  );
};

export default SummaryBanner;
