'use client';

import React, { useRef, useEffect } from 'react';
import { FiPlay, FiPause, FiMinimize2 } from 'react-icons/fi';
import useInterviewState from '@/hooks/useInterviewState';
import VideoDisplay from '@/components/VideoDisplay';
import TranscriptDisplay from '@/components/TranscriptDisplay';
import GeminiResponseDisplay from '@/components/GeminiResponseDisplay';
import AudioVisualizer from '@/components/AudioVisualizer';

const InterviewV2Page = () => {
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

  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (screenStream && videoRef.current) {
      videoRef.current.srcObject = screenStream;
      videoRef.current.muted = true; // Keep the speaker off
    }
  }, [screenStream]);

  useEffect(() => {
    const handleStreamEnded = () => {
      if (isRecording) {
        handleStopRecording();
      }
    };

    if (screenStream) {
      screenStream.getVideoTracks()[0].addEventListener('ended', handleStreamEnded);
    }

    return () => {
      if (screenStream) {
        screenStream.getVideoTracks()[0].removeEventListener('ended', handleStreamEnded);
      }
    };
  }, [screenStream, isRecording, handleStopRecording]);

  const togglePictureInPicture = async () => {
    if (videoRef.current) {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Interview Session</h1>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Video Feed</h2>
            {isRecording && screenStream ? (
              <div className="relative">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  className="w-full h-64 object-cover rounded-md"
                />
                <button
                  onClick={togglePictureInPicture}
                  className="absolute top-2 right-2 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600"
                >
                  <FiMinimize2 />
                </button>
              </div>
            ) : (
              <div className="bg-gray-200 h-64 flex items-center justify-center text-gray-500">
                Video feed will appear here when recording starts
              </div>
            )}
            <div className="mt-4 flex justify-center">
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Interview Feedback</h2>
            <div className="h-64 overflow-y-auto mb-4">
              <GeminiResponseDisplay responses={geminiResponses} />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 lg:col-span-2">
            <h2 className="text-xl font-semibold mb-4">Transcript</h2>
            <div className="h-48 overflow-y-auto">
              <TranscriptDisplay azureTranscript={azureTranscript} />
            </div>
          </div>
        </div>

        {isRecording && screenStream && (
          <div className="mt-8 bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Audio Visualizer</h2>
            <AudioVisualizer stream={screenStream} />
          </div>
        )}

        {error && (
          <div className="mt-8 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error:</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Session Status</h2>
          <p className="text-lg">{status}</p>
        </div>
      </main>
    </div>
  );
};

export default InterviewV2Page;