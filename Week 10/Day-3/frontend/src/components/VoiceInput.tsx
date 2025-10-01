import React, { useRef, useState } from "react";
import { Mic } from "lucide-react";
import { createSpeechRecognition } from "../services/speechRecognition";

interface VoiceInputProps {
  onTranscript: (text: string) => void;
}

const VoiceInput: React.FC<VoiceInputProps> = ({ onTranscript }) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      recognitionRef.current = createSpeechRecognition(onTranscript);

      // Auto-reset when recognition stops by itself
      if (recognitionRef.current) {
        recognitionRef.current.onend = () => {
          setIsListening(false);
        };
      }
    }

    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  return (
    <div className="absolute inset-y-0.5 right-2 flex items-center overflow-hidden px-1">
      <button
        onClick={toggleListening}
        type="button"
        className={`flex items-center justify-center size-8 rounded-full transition relative
      ${isListening ? "bg-indigo-600 text-white listening" : "bg-transparent text-gray-400 hover:text-gray-600"}
    `}
      >
        <Mic className="w-5 h-5 relative z-10" />
      </button>
    </div>
  );
};

export default VoiceInput;
