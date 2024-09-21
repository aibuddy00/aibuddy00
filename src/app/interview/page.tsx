'use client';

import InterviewControls from '@/components/InterviewControls';
import VideoDisplay from '@/components/VideoDisplay';
import TranscriptDisplay from '@/components/TranscriptDisplay';
import GeminiResponseDisplay from '@/components/GeminiResponseDisplay';
import AudioVisualizer from '@/components/AudioVisualizer';
import useInterviewState from '@/hooks/useInterviewState';

export default function Interview() {
  const {
    isRecording,
    screenStream,
    azureTranscript,
    status,
    geminiResponses,
    error,
    handleStartRecording,
    handleStopRecording
  } = useInterviewState();

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
      {isRecording && screenStream && <AudioVisualizer stream={screenStream} />}
    </div>
  );
}