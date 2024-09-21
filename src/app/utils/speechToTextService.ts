interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: SpeechRecognitionEvent) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

const splitIntoSentences = (text: string): string[] => {
  // Split the text into sentences using regex
  return text.match(/[^.!?]+[.!?]+/g) || [text];
};

export const initializeSpeechRecognition = (
  onTranscript: (sentences: string[], isFinal: boolean) => void,
  onError: (error: string) => void,
  onStatusChange: (status: string) => void
): { recognition: SpeechRecognition; restart: () => void } => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error('Speech recognition not supported in this browser');
    onError('Speech recognition not supported in this browser');
    return { recognition: null as unknown as SpeechRecognition, restart: () => {} };
  }

  let recognition: SpeechRecognition = new SpeechRecognition();
  let isRecognitionActive = false;

  const restart = () => {
    if (isRecognitionActive) {
      recognition.stop();
    } else {
      setupRecognition();
      recognition.start();
    }
  };

  const setupRecognition = () => {
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      isRecognitionActive = true;
      onStatusChange('Listening...');
    };

    recognition.onend = () => {
      isRecognitionActive = false;
      onStatusChange('Recognition stopped');
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        if (result.isFinal) {
          finalTranscript += result[0].transcript + ' ';
        } else {
          interimTranscript += result[0].transcript;
        }
      }

      if (finalTranscript) {
        const sentences = splitIntoSentences(finalTranscript);
        onTranscript(sentences, true);
      }
      if (interimTranscript) {
        const sentences = splitIntoSentences(interimTranscript);
        onTranscript(sentences, false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      onError(`Speech recognition error: ${event.error}`);
      isRecognitionActive = false;
    };
  };

  setupRecognition();
  recognition.start();

  return { recognition, restart };
};

export const stopSpeechRecognition = (recognition: SpeechRecognition | null) => {
  if (recognition) {
    recognition.stop();
  }
};

// Future: Add methods for initializing and stopping WebSocket-based transcription
// export const initializeWebSocketTranscription = (
//   onTranscript: (transcript: string) => void,
//   onError: (error: string) => void,
//   onStatusChange: (status: string) => void
// ) => { /* WebSocket setup */ };

// export const stopWebSocketTranscription = (/* WebSocket reference */) => { /* Stop WebSocket */ };