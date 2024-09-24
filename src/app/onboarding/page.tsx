'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

const OnboardingPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <header className="mb-8">
        <Image src="/logo.png" alt="Final Round AI Logo" width={150} height={50} />
      </header>
      <main className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">How can we help you crush your next interview?</h1>
        <div className="space-y-4">
          <Link href="/interview" className="block p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">I have an interview now</h2>
                <p className="text-sm text-gray-600">Get setup with our live interview assistant Copilot now and be ready with real-time responses.</p>
              </div>
              <span className="bg-yellow-500 text-white text-xs font-semibold px-2 py-1 rounded-full">Premium</span>
            </div>
          </Link>
          <Link href="/prep" className="block p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">I need to prep for an interview</h2>
                <p className="text-sm text-gray-600">Get ready for your next interview with mock interviews, AI written cover letters, flashcards, and more.</p>
              </div>
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">Free</span>
            </div>
          </Link>
          <Link href="/explore" className="block p-4 border rounded-lg shadow-sm hover:bg-gray-100 transition">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-medium">I just want to explore</h2>
                <p className="text-sm text-gray-600">Take a tour of Final Round, explore our AI resume builder and questions bank.</p>
              </div>
              <span className="bg-green-500 text-white text-xs font-semibold px-2 py-1 rounded-full">Free</span>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
};

export default OnboardingPage;