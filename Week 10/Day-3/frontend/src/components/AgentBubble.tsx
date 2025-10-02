import React, { useRef } from "react";
import { Product } from "../types";
import ProductLink from "./ProductLink";
import { useTextToSpeech } from "../hooks/useTextToSpeech";
import { Play, Volume2, Pause } from "lucide-react";

interface AgentBubbleProps {
  message: string;
  suggestedProducts?: Product[];
  pinnedProduct: string | null;
  onProductPin: (productName: string) => void;
}

const AgentBubble: React.FC<AgentBubbleProps> = ({
  message,
  suggestedProducts,
  pinnedProduct,
  onProductPin,
}) => {
  const { play, pause, resume, stop, isPlaying, isPaused } = useTextToSpeech();
  const clickTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleSingleClick = () => {
    if (isPlaying) pause();
    else if (isPaused) resume();
    else play(message, stop);
  };

  const handleDoubleClick = () => {
    stop();
  };

  const handleClick = () => {
    if (clickTimeoutRef.current) {
      // double click detected
      clearTimeout(clickTimeoutRef.current);
      clickTimeoutRef.current = null;
      handleDoubleClick();
    } else {
      clickTimeoutRef.current = setTimeout(() => {
        handleSingleClick();
        clickTimeoutRef.current = null;
      }, 250);
    }
  };

  // Determine button icon
  let ButtonIcon = Volume2; // default: initial/stopped
  if (isPlaying)
    ButtonIcon = Pause; // playing
  else if (isPaused) ButtonIcon = Play; // paused

  // Function to format message with bold text
  const formatMessage = (text: string) => {
    // Split by ** to find bold text
    const parts = text.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        // Remove ** and make bold
        const boldText = part.slice(2, -2);
        return (
          <strong key={index} className="font-bold">
            {boldText}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <div className="flex justify-start mb-2">
      <div className="max-w-[85%]">
        <div className="relative rounded-t-xl rounded-br-xl rounded-bl-sm bg-gray-100 p-3 text-gray-800 shadow-sm">
          <p>{formatMessage(message)}</p>

          <button
            onClick={handleClick}
            className="absolute bottom-0 right-0 p-1 rounded-full bg-white hover:bg-gray-100 transition"
          >
            <ButtonIcon size={14} />
          </button>
        </div>

        {suggestedProducts && suggestedProducts.length > 0 && (
          <div className="mt-2">
            <p className="text-xs text-gray-500 font-medium mb-2">
              Recommended products:
            </p>
            <div className="flex flex-wrap gap-2">
              {suggestedProducts.map((product, idx) => (
                <ProductLink
                  key={idx}
                  product={product}
                  isPinned={pinnedProduct === product.name}
                  onPin={onProductPin}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AgentBubble;
