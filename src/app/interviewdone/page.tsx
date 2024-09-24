'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiStar } from 'react-icons/fi';

const InterviewDonePage = () => {
  const router = useRouter();
  const [timeLeft, setTimeLeft] = useState(10);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime <= 1) {
          clearInterval(timer);
          router.push('/dashboard');
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router]);

  const handleRating = (value: number) => {
    setRating(value);
    // Here you can add logic to send the rating to your backend
  };

  const handleViewReport = () => {
    // Implement view report functionality
    router.push('/dashboard'); // Assuming the report is on the dashboard
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="text-center max-w-2xl">
        <div className="text-6xl mb-4">🚀</div>
        <h1 className="text-3xl font-bold mt-4 mb-2">Well done! You've completed your interview with AI Buddy!</h1>
        <p className="text-gray-600 mb-8">Your interview report is now available on our dashboard.</p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-8">
          <button
            onClick={handleViewReport}
            className="px-6 py-2 bg-white text-gray-800 rounded-md shadow hover:bg-gray-50 transition duration-300"
          >
            View the Report
          </button>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700 transition duration-300"
          >
            Return Home ({timeLeft}s)
          </button>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">How was your experience with AI Buddy?</h2>
          <div className="flex justify-center space-x-2">
            {[1, 2, 3, 4, 5].map((star) => (
              <FiStar
                key={star}
                className={`w-8 h-8 cursor-pointer transition-colors duration-200 ${
                  star <= rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }`}
                onClick={() => handleRating(star)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewDonePage;