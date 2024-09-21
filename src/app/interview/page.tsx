'use client';

import { useState, useEffect, useRef } from 'react';
import { startScreenRecording, stopScreenRecording } from '../utils/screenRecording';
import { initializeSpeechRecognition, stopSpeechRecognition } from '../utils/speechToTextService';

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
  start: () => void;
  stop: () => void;
}

export default function Interview() {
  const [isRecording, setIsRecording] = useState(false);
  const [combinedStream, setCombinedStream] = useState<MediaStream | null>(null);
  const [transcriptSentences, setTranscriptSentences] = useState<string[]>([]);
  const [interimSentences, setInterimSentences] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const videoRef = useRef<HTMLVideoElement>(null);
  const recognitionRef = useRef<{ recognition: SpeechRecognition | null; restart: () => void } | null>(null);
  const restartTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const startRecording = async () => {
    try {
      const stream = await startScreenRecording();
      setCombinedStream(stream);
      setIsRecording(true);
      setError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = false; // Unmute to hear the shared audio
      }

      const { recognition, restart } = initializeSpeechRecognition(
        (newSentences: string[], isFinal: boolean) => {
          if (isFinal) {
            setTranscriptSentences(prev => [...prev, ...newSentences]);
            setInterimSentences([]);
          } else {
            setInterimSentences(newSentences);
          }
        },
        (errorMessage: string) => {
          setError(errorMessage);
        },
        (statusMessage: string) => {
          setStatus(statusMessage);
        }
      );

      recognitionRef.current = { recognition, restart };

      const scheduleRestart = () => {
        if (restartTimeoutRef.current) {
          clearTimeout(restartTimeoutRef.current);
        }
        restartTimeoutRef.current = setTimeout(() => {
          if (recognitionRef.current) {
            recognitionRef.current.restart();
          }
          scheduleRestart(); // Schedule the next restart
        }, 10000); // 10 seconds
      };

      scheduleRestart(); // Start the restart cycle

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
    setTranscriptSentences([]);
    setInterimSentences([]);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (recognitionRef.current && recognitionRef.current.recognition) {
      stopSpeechRecognition(recognitionRef.current.recognition);
    }
    recognitionRef.current = null;
    if (restartTimeoutRef.current) {
      clearTimeout(restartTimeoutRef.current);
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
          <video 
            ref={videoRef} 
            autoPlay 
            controls
            style={{ width: '100%', maxWidth: '800px' }} 
          />
          <h2>Transcript:</h2>
          <div style={{ 
            width: '100%', 
            height: '200px', 
            marginTop: '20px', 
            border: '1px solid #ccc', 
            padding: '10px', 
            overflowY: 'auto' 
          }}>
            {transcriptSentences.map((sentence, index) => (
              <p key={index}>{sentence}</p>
            ))}
            {interimSentences.map((sentence, index) => (
              <p key={`interim-${index}`} style={{ color: 'gray' }}>{sentence}</p>
            ))}
          </div>
          <p>Status: {status}</p>
          {error && <p style={{ color: 'red' }}>{error}</p>}
        </div>
      )}
    </div>
  );
}