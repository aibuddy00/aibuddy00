import { useState, useRef } from 'react';
import { initializeSpeechRecognition } from '@/app/utils/speechToTextService';
import { initializeLocalSpeechRecognition } from '@/app/utils/localSpeechToText';

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
  const [localTranscript, setLocalTranscript] = useState<Transcript>({ final: [], interim: [] });
  const [status, setStatus] = useState('');
  const azureRecognitionRef = useRef<Recognition | null>(null);
  const localRecognitionRef = useRef<Recognition | null>(null);

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

    const localRecognition = initializeLocalSpeechRecognition(
      (newTranscript: string, isFinal: boolean) => {
        setLocalTranscript(prev => 
          isFinal 
            ? { ...prev, final: [...prev.final, newTranscript], interim: [] }
            : { ...prev, interim: [newTranscript] }
        );
      },
      (errorMessage: string) => setStatus(prev => `${prev}\nLocal Error: ${errorMessage}`),
      (statusMessage: string) => setStatus(prev => `${prev}\nLocal: ${statusMessage}`)
    );

    if (azureRecognition && localRecognition) {
      azureRecognitionRef.current = azureRecognition;
      localRecognitionRef.current = localRecognition;
      azureRecognition.start();
      localRecognition.start();
    }
  };

  const stopSpeechRecognition = () => {
    if (azureRecognitionRef.current) {
      azureRecognitionRef.current.stop();
    }
    if (localRecognitionRef.current) {
      localRecognitionRef.current.stop();
    }
    setStatus('Speech recognition stopped');
  };

  return { 
    azureTranscript, 
    localTranscript, 
    status, 
    startSpeechRecognition, 
    stopSpeechRecognition 
  };
}