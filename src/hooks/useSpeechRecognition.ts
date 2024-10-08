import { useState, useRef, useCallback } from 'react';
import { initializeSpeechRecognition } from '@/services/speechToTextService';
import { getGeminiResponse } from '@/services/geminiService';

interface Transcript {
  final: string[];
  interim: string[];
}

interface Recognition {
  start: () => void;
  stop: () => void;
}

export default function useSpeechRecognition() {
  const [azureTranscript, setAzureTranscript] = useState<Transcript>({ final: [], interim: [] });
  const [status, setStatus] = useState('');
  const [geminiResponses, setGeminiResponses] = useState<string[]>([]);
  const azureRecognitionRef = useRef<Recognition | null>(null);

  const processTranscript = useCallback(async (transcript: string) => {
    const response = await getGeminiResponse(transcript.trim());
    setGeminiResponses(prev => [...prev, response]);
  }, []);

  const startSpeechRecognition = (stream: MediaStream) => {
    const azureRecognition = initializeSpeechRecognition(
      stream,
      async (newTranscript: string, isFinal: boolean) => {
        setAzureTranscript(prev => 
          isFinal 
            ? { ...prev, final: [...prev.final, newTranscript], interim: [] }
            : { ...prev, interim: [newTranscript] }
        );
        if (isFinal) {
          await processTranscript(newTranscript);
        }
      },
      (errorMessage: string) => setStatus(prev => `${prev}\nAzure Error: ${errorMessage}`),
      (statusMessage: string) => setStatus(prev => `${prev}\nAzure: ${statusMessage}`)
    );

    if (azureRecognition) {
      azureRecognitionRef.current = azureRecognition;
      azureRecognition.start();
    }
  };

  const stopSpeechRecognition = () => {
    if (azureRecognitionRef.current) {
      azureRecognitionRef.current.stop();
    }
    setStatus('Speech recognition stopped');
  };

  return { 
    azureTranscript, 
    status, 
    geminiResponses,
    startSpeechRecognition, 
    stopSpeechRecognition 
  };
}