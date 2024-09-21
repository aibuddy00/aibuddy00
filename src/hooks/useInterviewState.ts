import { useState } from 'react';
import useScreenRecording from './useScreenRecording';
import useSpeechRecognition from './useSpeechRecognition';

export default function useInterviewState() {
  const [isRecording, setIsRecording] = useState(false);
  const { startRecording, stopRecording, screenStream, error } = useScreenRecording();
  const { 
    azureTranscript, 
    status, 
    geminiResponses,
    startSpeechRecognition, 
    stopSpeechRecognition 
  } = useSpeechRecognition();

  const handleStartRecording = async () => {
    const stream = await startRecording();
    if (stream) {
      setIsRecording(true);
      startSpeechRecognition(stream);
    }
  };

  const handleStopRecording = () => {
    stopRecording();
    stopSpeechRecognition();
    setIsRecording(false);
  };

  return {
    isRecording,
    screenStream,
    azureTranscript,
    status,
    geminiResponses,
    error,
    handleStartRecording,
    handleStopRecording
  };
}