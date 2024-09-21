import { useState, useRef } from 'react';
import { initializeSpeechRecognition } from '@/app/utils/speechToTextService';

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
  const azureRecognitionRef = useRef<Recognition | null>(null);

  const startSpeechRecognition = (stream: MediaStream) => {
    const azureRecognition = initializeSpeechRecognition(
      stream,
      (newTranscript: string, isFinal: boolean) => {
        setAzureTranscript(prev => 
          isFinal 
            ? { ...prev, final: [...prev.final, newTranscript], interim: [] }
            : { ...prev, interim: [newTranscript] }
        );
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
    startSpeechRecognition, 
    stopSpeechRecognition 
  };
}