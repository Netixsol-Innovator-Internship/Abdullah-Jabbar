import React from "react";
import { Send, Smile } from "lucide-react";
import VoiceInput from "./VoiceInput";

interface ChatInputProps {
  value: string;
  onChange: (value: string) => void;
  onSend: () => void;
  onKeyPress: (e: React.KeyboardEvent) => void;
  isLoading: boolean;
  showVoiceInput?: boolean;
}

const ChatInput: React.FC<ChatInputProps> = ({
  value,
  onChange,
  onSend,
  onKeyPress,
  isLoading,
  showVoiceInput = true,
}) => (
  <div className="p-3 flex items-center space-x-2">
    <div className="flex-1 relative">
      <input
        type="text"
        placeholder="Message..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onKeyPress={onKeyPress}
        disabled={isLoading}
        className="w-full py-3 pl-4 pr-16 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder-gray-500 text-sm disabled:opacity-50"
      />

      {showVoiceInput ? (
        <VoiceInput onTranscript={(text) => onChange(value + " " + text)} />
      ) : (
        <button className="absolute inset-y-0 right-1.5 flex items-center justify-center w-10 text-gray-400 hover:text-gray-600 transition">
          <Smile className="w-5 h-5" />
        </button>
      )}
    </div>

    <button
      onClick={onSend}
      disabled={isLoading || !value.trim()}
      className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition duration-300 shadow-md flex-shrink-0 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      <Send className="w-5 h-5" />
    </button>
  </div>
);

export default ChatInput;
