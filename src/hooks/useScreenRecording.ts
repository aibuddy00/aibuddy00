import { useState } from 'react';
import { startScreenRecording, stopScreenRecording } from '@/services/screenRecordingService';

interface ScreenRecordingHook {
  startRecording: () => Promise<MediaStream | null>;
  stopRecording: () => void;
  screenStream: MediaStream | null;
  error: string | null;
}

export default function useScreenRecording(): ScreenRecordingHook {
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  const startRecording = async () => {
    try {
      const stream = await startScreenRecording();
      setScreenStream(stream);
      setError(null);
      return stream;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      return null;
    }
  };

  const stopRecording = () => {
    stopScreenRecording(screenStream);
    setScreenStream(null);
    setError(null);
  };

  return { startRecording, stopRecording, screenStream, error };
}