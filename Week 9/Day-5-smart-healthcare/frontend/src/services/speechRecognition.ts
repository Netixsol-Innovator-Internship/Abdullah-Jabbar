export type TranscriptCallback = (text: string) => void;

export const createSpeechRecognition = (onTranscript: TranscriptCallback) => {
  const SpeechRecognition =
    window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    console.warn("SpeechRecognition API not supported in this browser.");
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.lang = "en-US";
  recognition.continuous = false; // stopss listening
  recognition.interimResults = false; // no partials

  recognition.onresult = (event: SpeechRecognitionEvent) => {
    let lastFinal = "";

    for (let i = event.resultIndex; i < event.results.length; i++) {
      if (event.results[i].isFinal) {
        lastFinal = event.results[i][0].transcript;
      }
    }

    if (lastFinal) {
      onTranscript(lastFinal.trim());
    }
  };

  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    if (event.error === "no-speech" || event.error === "aborted") {
      return;
    }
    console.error("Speech recognition error:", event.error);
  };

  return recognition;
};
