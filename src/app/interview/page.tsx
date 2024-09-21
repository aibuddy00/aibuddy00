'use client';

import { useState, useEffect, useRef } from 'react';
import { startScreenRecording, stopScreenRecording } from '../utils/screenRecording';
import { initializeSpeechRecognition } from '../utils/speechToTextService';
import { initializeLocalSpeechRecognition } from '../utils/localSpeechToText';

export default function Interview() {
  const [isRecording, setIsRecording] = useState(false);
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [azureTranscriptSentences, setAzureTranscriptSentences] = useState<string[]>([]);
  const [azureInterimSentences, setAzureInterimSentences] = useState<string[]>([]);
  const [localTranscriptSentences, setLocalTranscriptSentences] = useState<string[]>([]);
  const [localInterimSentences, setLocalInterimSentences] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<string>('');
  const [volume, setVolume] = useState<number>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const azureRecognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const localRecognitionRef = useRef<{ start: () => void; stop: () => void } | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const startRecording = async () => {
    console.log('Starting recording...');
    try {
      const stream = await startScreenRecording();
      setScreenStream(stream);
      setIsRecording(true);
      setError(null);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.muted = false;
      }

      // Only initialize speech recognition if we have audio tracks
      if (stream.getAudioTracks().length > 0) {
        console.log('Initializing Azure speech recognition...');
        const azureRecognition = initializeSpeechRecognition(
          stream,
          (newTranscript: string, isFinal: boolean) => {
            console.log(`Azure transcript received (${isFinal ? 'final' : 'interim'}):`, newTranscript);
            if (isFinal) {
              setAzureTranscriptSentences(prev => [...prev, newTranscript]);
              setAzureInterimSentences([]);
            } else {
              setAzureInterimSentences([newTranscript]);
            }
          },
          (errorMessage: string) => {
            console.error('Azure speech recognition error:', errorMessage);
            setError(errorMessage);
          },
          (statusMessage: string) => {
            console.log('Azure speech recognition status:', statusMessage);
            setStatus(statusMessage);
          }
        );

        console.log('Initializing local speech recognition...');
        const localRecognition = initializeLocalSpeechRecognition(
          (newTranscript: string, isFinal: boolean) => {
            console.log(`Local transcript received (${isFinal ? 'final' : 'interim'}):`, newTranscript);
            if (isFinal) {
              setLocalTranscriptSentences(prev => [...prev, newTranscript]);
              setLocalInterimSentences([]);
            } else {
              setLocalInterimSentences([newTranscript]);
            }
          },
          (errorMessage: string) => {
            console.error('Local speech recognition error:', errorMessage);
            setError(prev => prev ? `${prev}\n${errorMessage}` : errorMessage);
          },
          (statusMessage: string) => {
            console.log('Local speech recognition status:', statusMessage);
            setStatus(prev => `${prev}\nLocal: ${statusMessage}`);
          }
        );

        if (azureRecognition && localRecognition) {
          azureRecognitionRef.current = azureRecognition;
          localRecognitionRef.current = localRecognition;
          azureRecognition.start();
          localRecognition.start();
        } else {
          throw new Error('Failed to initialize speech recognition');
        }
      } else {
        console.warn('No audio tracks found in the screen stream');
        setError('No audio detected from the screen share. Please ensure you\'ve selected to share audio.');
      }

    } catch (error) {
      console.error('Error in startRecording:', error);
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    }
  };

  const handleStopRecording = () => {
    console.log('Stopping recording...');
    if (azureRecognitionRef.current) {
      azureRecognitionRef.current.stop();
    }
    if (localRecognitionRef.current) {
      localRecognitionRef.current.stop();
    }
    stopScreenRecording(screenStream);
    setIsRecording(false);
    setScreenStream(null);
    setError(null);
    setStatus('Recording stopped');
    // Remove these lines to keep the transcripts:
    // setAzureTranscriptSentences([]);
    // setAzureInterimSentences([]);
    // setLocalTranscriptSentences([]);
    // setLocalInterimSentences([]);
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    azureRecognitionRef.current = null;
    localRecognitionRef.current = null;
    console.log('Recording stopped.');
  };

  useEffect(() => {
    return () => {
      handleStopRecording();
    };
  }, []);

  useEffect(() => {
    if (isRecording && screenStream && canvasRef.current) {
      const audioContext = new AudioContext();
      const analyser = audioContext.createAnalyser();
      const source = audioContext.createMediaStreamSource(screenStream);
      source.connect(analyser);

      const canvas = canvasRef.current;
      const canvasCtx = canvas.getContext('2d');

      function draw() {
        const WIDTH = canvas.width;
        const HEIGHT = canvas.height;

        requestAnimationFrame(draw);

        analyser.fftSize = 2048;
        var bufferLength = analyser.frequencyBinCount;
        var dataArray = new Uint8Array(bufferLength);
        analyser.getByteTimeDomainData(dataArray);

        canvasCtx!.fillStyle = 'rgb(200, 200, 200)';
        canvasCtx!.fillRect(0, 0, WIDTH, HEIGHT);
        canvasCtx!.lineWidth = 2;
        canvasCtx!.strokeStyle = 'rgb(0, 0, 0)';
        canvasCtx!.beginPath();

        var sliceWidth = WIDTH * 1.0 / bufferLength;
        var x = 0;

        let sum = 0;
        for(var i = 0; i < bufferLength; i++) {
          var v = dataArray[i] / 128.0;
          sum += Math.abs(v - 1);
          var y = v * HEIGHT/2;

          if(i === 0) {
            canvasCtx!.moveTo(x, y);
          } else {
            canvasCtx!.lineTo(x, y);
          }

          x += sliceWidth;
        }

        canvasCtx!.lineTo(canvas.width, canvas.height/2);
        canvasCtx!.stroke();

        // Calculate and set volume
        const averageVolume = sum / bufferLength;
        setVolume(averageVolume * 100);
      }

      draw();

      return () => {
        source.disconnect();
        audioContext.close();
      };
    }
  }, [isRecording, screenStream]);

  return (
    <div>
      <h1>Interview Page</h1>
      {!isRecording ? (
        <button onClick={startRecording}>Start Recording</button>
      ) : (
        <button onClick={handleStopRecording}>Stop Recording</button>
      )}
      {/* Remove the isRecording condition to always show the content */}
      <div>
        {isRecording && (
          <>
            <p>Recording audio and capturing screen...</p>
            <video 
              ref={videoRef} 
              autoPlay 
              controls
              style={{ width: '100%', maxWidth: '800px' }} 
            />
          </>
        )}
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <div style={{ width: '48%' }}>
            <h2>Azure Transcript:</h2>
            <div style={{ 
              height: '200px', 
              border: '1px solid #ccc', 
              padding: '10px', 
              overflowY: 'auto' 
            }}>
              {azureTranscriptSentences.map((sentence, index) => (
                <p key={index}>{sentence}</p>
              ))}
              {azureInterimSentences.map((sentence, index) => (
                <p key={index} style={{ color: 'gray' }}>{sentence}</p>
              ))}
            </div>
          </div>
          <div style={{ width: '48%' }}>
            <h2>Local Transcript:</h2>
            <div style={{ 
              height: '200px', 
              border: '1px solid #ccc', 
              padding: '10px', 
              overflowY: 'auto' 
            }}>
              {localTranscriptSentences.map((sentence, index) => (
                <p key={index}>{sentence}</p>
              ))}
              {localInterimSentences.map((sentence, index) => (
                <p key={index} style={{ color: 'gray' }}>{sentence}</p>
              ))}
            </div>
          </div>
        </div>
        <p>Status: {status}</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {isRecording && (
          <>
            <canvas ref={canvasRef} width="300" height="100" />
            <p>Volume: {volume.toFixed(2)}%</p>
          </>
        )}
      </div>
    </div>
  );
}