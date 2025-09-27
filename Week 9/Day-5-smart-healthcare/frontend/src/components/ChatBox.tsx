import React, { useState } from 'react';
import { MoreVertical, Smile, Send, X } from 'lucide-react';

// --- Reusable Sub-Components ---

// Component for the Agent's message bubbles
const AgentBubble: React.FC<{ message: string }> = ({ message }) => (
  <div className="flex justify-start mb-2">
    <div className="max-w-[85%] rounded-t-xl rounded-br-xl rounded-bl-sm bg-gray-100 p-3 text-gray-800 shadow-sm">
      {message}
    </div>
  </div>
);

// Component for the User's suggested quick question bubbles
const UserQuickQuestion: React.FC<{ question: string }> = ({ question }) => (
  // Note: These buttons are styled to look like user replies, typically sent from the right
  <button className="text-sm bg-white text-gray-700 py-2 px-4 rounded-full border border-gray-300 hover:bg-gray-50 transition duration-150 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 mr-2 mb-2 whitespace-nowrap">
    {question}
  </button>
);

// Component for the Agent's profile/name display within the chat
const AgentHeaderBlock: React.FC<{ name: string }> = ({ name }) => (
  <div className="flex items-center space-x-3 mb-4 py-3">
    {/* Simple 'C' logo like in the image */}
    <div className="w-8 h-8 bg-black flex items-center justify-center rounded-full flex-shrink-0">
      <span className="text-white font-bold text-lg">C</span>
    </div>
    <div>
      <h2 className="text-lg font-semibold text-gray-900">{name}</h2>
    </div>
  </div>
);

// --- Main Chat Widget Component ---

export default function App() {
  // State to manage the visibility of the privacy policy banner
  const [isPolicyBannerVisible, setIsPolicyBannerVisible] = useState(true);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="
        w-full max-w-sm sm:max-w-md
        bg-white rounded-xl shadow-2xl
        flex flex-col h-[800px] sm:h-[90vh] {/* <-- HEIGHT INCREASED HERE */}
        overflow-hidden
        border border-gray-200
      ">
        {/* Widget Header (Black/Dark Bar) */}
        <header className="flex items-center justify-between p-4 bg-gray-900 text-white shadow-lg flex-shrink-0">
          <div className="flex items-center space-x-2">
            {/* Logo and Title */}
            <div className="w-6 h-6 bg-white flex items-center justify-center rounded-full flex-shrink-0">
              <span className="text-gray-900 font-bold text-sm">C</span>
            </div>
            <h1 className="text-lg font-semibold truncate">Chatbase AI Agent</h1>
          </div>
          {/* Menu Icon */}
          <MoreVertical className="w-5 h-5 cursor-pointer text-gray-400 hover:text-white flex-shrink-0" />
        </header>

        {/* Chat Body (Scrollable Messages) */}
        <main className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Agent Introduction/Profile Block */}
          <AgentHeaderBlock name="Chatbase AI Agent" />

          {/* Agent Messages */}
          <AgentBubble message="Hi! I am Chatbase AI, ask me anything about Chatbase!" />
          <AgentBubble message="By the way, you can create an agent like me for your website! 🤩" />

          {/* Quick Questions Section - Sent from the right in the image */}
          <div className="mt-6 flex flex-wrap justify-end">
            <UserQuickQuestion question="What is Chatbase?" />
            <UserQuickQuestion question="How do I add data to my agent?" />
            <UserQuickQuestion question="Is there a free plan?" />
            <UserQuickQuestion question="What are AI actions?" />
          </div>

        </main>

        {/* Footer / Input Area */}
        <footer className="border-t border-gray-200 bg-white flex-shrink-0">
          {/* Powered By Section */}
          <div className="flex justify-center py-2">
            <div className="flex items-center space-x-1 text-xs text-gray-500">
              <div className="w-3 h-3 bg-black flex items-center justify-center rounded-full">
                <span className="text-white font-bold text-[8px]">C</span>
              </div>
              <span>Powered by <span className="font-medium text-gray-700">Chatbase</span></span>
            </div>
          </div>

          {/* Privacy Policy Banner (Dismissible) */}
          {isPolicyBannerVisible && (
            <div className="bg-gray-100 p-2 text-xs flex items-center justify-between border-t border-b border-gray-200">
              <p className="text-gray-600">
                By chatting, you agree to our <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 underline">privacy policy.</a>
              </p>
              <button
                onClick={() => setIsPolicyBannerVisible(false)}
                className="text-gray-500 hover:text-gray-800 transition p-1"
                aria-label="Close privacy policy banner"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* Message Input Field */}
          <div className="p-3 flex items-center space-x-2">
            <div className="flex-1 relative">
              <input
                type="text"
                placeholder="Message..."
                className="w-full py-3 pl-4 pr-16 bg-gray-50 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 transition placeholder-gray-500 text-sm"
              />
              {/* Emoji Button */}
              <button className="absolute inset-y-0 right-1.5 flex items-center justify-center w-10 text-gray-400 hover:text-gray-600 transition">
                <Smile className="w-5 h-5" />
              </button>
            </div>
            {/* Send Button */}
            <button className="bg-indigo-600 text-white p-3 rounded-full hover:bg-indigo-700 transition duration-300 shadow-md flex-shrink-0">
              <Send className="w-5 h-5" />
            </button>
          </div>

        </footer>
      </div>
    </div>
  );
}
