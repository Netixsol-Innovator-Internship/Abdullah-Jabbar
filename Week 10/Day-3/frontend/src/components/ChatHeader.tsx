import React from "react";
import { X } from "lucide-react";

interface ChatHeaderProps {
  onClose: () => void;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ onClose }) => (
  <header className="flex items-center justify-between p-4 bg-gray-900 text-white shadow-lg flex-shrink-0">
    <div className="flex items-center space-x-2">
      <h1 className="text-lg font-semibold truncate">Chatbase AI Agent</h1>
    </div>
    <button
      onClick={onClose}
      className="text-gray-400 hover:text-white flex-shrink-0 p-1 bg-gray-800 rounded-full"
      aria-label="Close chat"
    >
      <X className="w-5 h-5" />
    </button>
  </header>
);

export default ChatHeader;
