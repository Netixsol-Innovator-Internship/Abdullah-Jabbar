// useTextToSpeech.ts
import { useState, useRef, useEffect } from "react";

export const useTextToSpeech = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  // unique id for this hook instance so events can carry origin info
  const instanceIdRef = useRef<string>(
    `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`
  );

  useEffect(() => {
    const myId = instanceIdRef.current;

    const handleExternalStop = (ev: Event) => {
      const e = ev as CustomEvent<{ originId?: string }>;
      if (e.detail?.originId === myId) return; // ignore my own events
      // only clear if we were playing or paused
      setIsPlaying((prev) => {
        if (prev) {
          setIsPaused(false);
          utteranceRef.current = null;
          return false;
        }
        return prev;
      });
      setIsPaused((prev) => (prev ? false : prev));
    };

    const handleExternalPause = (ev: Event) => {
      const e = ev as CustomEvent<{ originId?: string }>;
      if (e.detail?.originId === myId) return;
      // only pause if we were playing
      setIsPlaying((prev) => {
        if (prev) {
          setIsPaused(true);
          return false;
        }
        return prev;
      });
    };

    const handleExternalResume = (ev: Event) => {
      const e = ev as CustomEvent<{ originId?: string }>;
      if (e.detail?.originId === myId) return;
      // only resume if we were paused
      setIsPaused((prev) => {
        if (prev) {
          setIsPlaying(true);
          return false;
        }
        return prev;
      });
    };

    window.addEventListener("tts:stop", handleExternalStop as EventListener);
    window.addEventListener("tts:pause", handleExternalPause as EventListener);
    window.addEventListener(
      "tts:resume",
      handleExternalResume as EventListener
    );

    return () => {
      window.removeEventListener(
        "tts:stop",
        handleExternalStop as EventListener
      );
      window.removeEventListener(
        "tts:pause",
        handleExternalPause as EventListener
      );
      window.removeEventListener(
        "tts:resume",
        handleExternalResume as EventListener
      );
    };
  }, []);

  const emit = (name: string) => {
    const myId = instanceIdRef.current;
    const ev = new CustomEvent(name, { detail: { originId: myId } });
    window.dispatchEvent(ev);
  };

  // play accepts optional onEnd callback (AgentBubble passes stop)
  const play = (text: string, onEnd?: () => void) => {
    if (!text) return;
    // Notify other instances that they'll be stopped
    emit("tts:stop");
    // Cancel any existing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = "en-US";

    utterance.onend = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
      if (onEnd) onEnd();
    };

    utterance.onpause = () => {
      setIsPlaying(false);
      setIsPaused(true);
      emit("tts:pause");
    };

    utterance.onresume = () => {
      setIsPlaying(true);
      setIsPaused(false);
      emit("tts:resume");
    };

    utterance.onerror = () => {
      setIsPlaying(false);
      setIsPaused(false);
      utteranceRef.current = null;
    };

    utteranceRef.current = utterance;
    window.speechSynthesis.speak(utterance);
    setIsPlaying(true);
    setIsPaused(false);
    emit("tts:started");
  };

  const pause = () => {
    if (window.speechSynthesis.speaking && !window.speechSynthesis.paused) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
      emit("tts:pause");
    }
  };

  const resume = () => {
    if (window.speechSynthesis.paused) {
      window.speechSynthesis.resume();
      setIsPlaying(true);
      setIsPaused(false);
      emit("tts:resume");
    }
  };

  const stop = () => {
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsPlaying(false);
    setIsPaused(false);
    emit("tts:stop");
  };

  return { play, pause, resume, stop, isPlaying, isPaused };
};
