'use client';

import { useState } from 'react';
import InterviewControls from '@/components/InterviewControls';
import VideoDisplay from '@/components/VideoDisplay';
import TranscriptDisplay from '@/components/TranscriptDisplay';
import GeminiResponseDisplay from '@/components/GeminiResponseDisplay';
import AudioVisualizer from '@/components/AudioVisualizer';
import useScreenRecording from '@/hooks/useScreenRecording';
import useSpeechRecognition from '@/hooks/useSpeechRecognition';

export default function Interview() {
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

  return (
    <div>
      <h1>Interview Page</h1>
      <InterviewControls 
        isRecording={isRecording} 
        onStartRecording={handleStartRecording} 
        onStopRecording={handleStopRecording} 
      />
      {isRecording && <VideoDisplay stream={screenStream} />}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <TranscriptDisplay azureTranscript={azureTranscript} />
        <GeminiResponseDisplay responses={geminiResponses} />
      </div>
      <p>Status: {status}</p>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {isRecording && <AudioVisualizer stream={screenStream} />}
    </div>
  );
}