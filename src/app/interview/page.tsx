'use client';

import { useState, useEffect, useRef } from 'react';
import { startScreenRecording, stopScreenRecording, setupWebSocket } from '../utils/screenRecording';

export default function Interview() {
  const [isRecording, setIsRecording] = useState(false);
  const [combinedStream, setCombinedStream] = useState<MediaStream | null>(null);
  const [fullTranscript, setFullTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const socketRef = useRef<WebSocket | null>(null);

  // Callback to handle incoming transcriptions
  const handleTranscription = (transcription: string) => {
    setFullTranscript((prev) => prev + ' ' + transcription);
  };

  const startRecording = async () => {
    try {
      const stream = await startScreenRecording();
      setCombinedStream(stream);
      setIsRecording(true);
      setError(null);

      // Display the screen share in the video element
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Setup WebSocket for transcription
      socketRef.current = setupWebSocket(stream, handleTranscription);

    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleStopRecording = () => {
    stopScreenRecording(combinedStream);
    setIsRecording(false);
    setCombinedStream(null);
    setError(null);
    setStatus('');
    setFullTranscript('');
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (socketRef.current) {
      socketRef.current.close();
    }
  };

  useEffect(() => {
    return () => {
      handleStopRecording();
    };
  }, []);

  return (
    <div>
      <h1>Interview Page</h1>
      {!isRecording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={handleStopRecording}>Stop Recording</button>
      )}
      {isRecording && (
        <div>
          <p>Recording audio and capturing screen...</p>
          <video ref={videoRef} autoPlay muted style={{ width: '100%', maxWidth: '800px' }} />
          <h2>Transcript:</h2>
          <div style={{ 
            width: '100%', 
            height: '200px', 
            marginTop: '20px', 
            border: '1px solid #ccc', 
            padding: '10px', 
            overflowY: 'auto' 
          }}>
            {fullTranscript}
          </div>
          <p>Status: {status}</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}