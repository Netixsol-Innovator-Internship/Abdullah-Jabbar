import React from "react";
import { X } from "lucide-react";

interface PrivacyBannerProps {
  isVisible: boolean;
  onDismiss: () => void;
}

const PrivacyBanner: React.FC<PrivacyBannerProps> = ({
  isVisible,
  onDismiss,
}) => {
  if (!isVisible) return null;

  return (
    <div className="bg-gray-100 p-2 text-xs flex items-center justify-between border-t border-b border-gray-200">
      <p className="text-gray-600">
        By chatting, you agree to our{" "}
        <a
          href="#"
          className="font-medium text-indigo-600 hover:text-indigo-500 underline"
        >
          privacy policy.
        </a>
      </p>
      <button
        onClick={onDismiss}
        className="text-gray-500 hover:text-gray-800 transition p-1"
        aria-label="Close privacy policy banner"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};

export default PrivacyBanner;
