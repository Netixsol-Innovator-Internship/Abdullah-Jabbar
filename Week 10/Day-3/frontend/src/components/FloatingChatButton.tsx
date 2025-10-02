import React from "react";

interface FloatingChatButtonProps {
  onClick: () => void;
}

const FloatingChatButton: React.FC<FloatingChatButtonProps> = ({ onClick }) => (
  <>
    {/* Button for screens <= 1500px - stays at screen edge */}
    <div className="fixed bottom-0 right-0 z-50 p-2 sm:p-4 md:p-6 pointer-events-none max-[1500px]:block hidden">
      <button
        onClick={onClick}
        className="bg-indigo-600 text-white p-1.5 sm:p-2 rounded-full shadow-2xl hover:bg-indigo-700 transition-all duration-300 hover:scale-110 pointer-events-auto min-w-[40px] min-h-[40px] flex items-center justify-center"
        aria-label="Open AI Chat Assistant"
      >
        <img
          src="/chatbot.svg"
          alt="Chatbot"
          className="w-5 h-5 sm:w-10 sm:h-10 flex-shrink-0"
        />
      </button>
    </div>

    {/* Button for screens > 1500px - constrained to content area */}
    <div className="fixed inset-0 z-50 pointer-events-none min-[1501px]:block hidden">
      <div className="max-w-[1500px] mx-auto h-full relative py-8">
        <div className="absolute bottom-0 right-2 sm:right-4 md:right-6">
          <button
            onClick={onClick}
            className="bg-indigo-600 text-white p-1.5 sm:p-2 rounded-full shadow-2xl hover:bg-indigo-700 transition-all duration-300 hover:scale-110 pointer-events-auto min-w-[36px] min-h-[36px] flex items-center justify-center"
            aria-label="Open AI Chat Assistant"
          >
            <img
              src="/chatbot.svg"
              alt="Chatbot"
              className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
            />
          </button>
        </div>
      </div>
    </div>
  </>
);

export default FloatingChatButton;
