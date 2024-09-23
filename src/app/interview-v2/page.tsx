'use client';

import React, { useRef, useEffect } from 'react';
import { FiMinimize2, FiLogOut } from 'react-icons/fi';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import useInterviewState from '@/hooks/useInterviewState';
import useDraggableWidth from '@/hooks/useDraggableWidth';
import GeminiResponseDisplay from '@/components/GeminiResponseDisplay';

const InterviewV2Page = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const {
    isRecording,
    screenStream,
    azureTranscript,
    status: interviewStatus,
    geminiResponses,
    error,
    handleStartRecording,
    handleStopRecording
  } = useInterviewState();

  const videoRef = useRef<HTMLVideoElement>(null);
  const { width: leftColumnWidth, handleMouseDown } = useDraggableWidth(400, 300, 800);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

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

  useEffect(() => {
    if (error) {
      console.error('Interview Error:', error);
    }
    console.log('Interview Status:', interviewStatus);
  }, [error, interviewStatus]);

  const togglePictureInPicture = async () => {
    if (videoRef.current) {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await videoRef.current.requestPictureInPicture();
      }
    }
  };

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  if (status === "loading") return <div>Loading...</div>;
  if (status === "unauthenticated") return null;

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Interview Session</h1>
          <div className="flex items-center">
            {session?.user?.image && (
              <Image src={session.user.image} alt="User" width={40} height={40} className="rounded-full mr-2" />
            )}
            <div className="text-sm mr-4">
              <p className="font-semibold">{session?.user?.name || 'Guest'}</p>
              <p className="text-gray-500">{session?.user?.email || 'Not logged in'}</p>
            </div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 transition duration-300 flex items-center"
            >
              <FiLogOut className="mr-2" />
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8 flex">
        <div style={{ width: `${leftColumnWidth}px` }} className="space-y-8">
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
                Video feed will appear here
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
            <h2 className="text-xl font-semibold mb-4">Live Transcription</h2>
            <div className="h-20 overflow-y-auto bg-gray-100 p-2 rounded">
              {azureTranscript.interim ? (
                <p className="text-gray-700">{azureTranscript.interim}</p>
              ) : (
                <p className="text-gray-500 italic">Waiting for speech...</p>
              )}
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Interview Transcript</h2>
            <div className="h-40 overflow-y-auto">
              <GeminiResponseDisplay responses={azureTranscript.final} />
            </div>
          </div>
        </div>

        <div
          className="w-2 bg-gray-300 cursor-col-resize hover:bg-gray-400 transition-colors"
          onMouseDown={handleMouseDown}
        />

        <div className="flex-grow">
          <div className="bg-white rounded-lg shadow-md p-6 h-full">
            <h2 className="text-xl font-semibold mb-4">AI Buddy</h2>
            <div className="h-[calc(100vh-12rem)] overflow-y-auto mb-4">
              <GeminiResponseDisplay responses={geminiResponses} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InterviewV2Page;