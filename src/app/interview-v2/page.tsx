'use client';

import React, { useState } from 'react';
import { FiMic, FiMicOff, FiVideo, FiVideoOff, FiPlay, FiPause } from 'react-icons/fi';
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

  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);

  const toggleVideo = () => setIsVideoEnabled(!isVideoEnabled);
  const toggleAudio = () => setIsAudioEnabled(!isAudioEnabled);

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
              <VideoDisplay stream={screenStream} />
            ) : (
              <div className="bg-gray-200 h-64 flex items-center justify-center text-gray-500">
                Video feed will appear here when recording starts
              </div>
            )}
            <div className="mt-4 flex justify-center space-x-4">
              <button
                onClick={isRecording ? handleStopRecording : handleStartRecording}
                className={`px-4 py-2 rounded-md text-white font-medium ${
                  isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'
                }`}
              >
                {isRecording ? 'Stop Recording' : 'Start Recording'}
              </button>
              <button
                onClick={toggleVideo}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {isVideoEnabled ? <FiVideoOff /> : <FiVideo />}
              </button>
              <button
                onClick={toggleAudio}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                {isAudioEnabled ? <FiMicOff /> : <FiMic />}
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