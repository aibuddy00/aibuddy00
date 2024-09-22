'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { MicrophoneIcon, LightBulbIcon, PresentationChartLineIcon } from '@heroicons/react/24/outline';
import Navbar from '../components/Navbar';

const fadeIn = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6 }
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-red-100">
      <Navbar />

      <main>
        <section className="bg-gradient-to-r from-orange-50 to-red-50 py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.h1 
              className="text-5xl font-bold text-gray-800 mb-4"
              {...fadeIn}
            >
              Crush job interviews with AI
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 mb-8"
              {...fadeIn}
              transition={{ delay: 0.2 }}
            >
              Meet your Interview Buddy™ - AI generating actionable guidance for interviews in real-time
            </motion.p>
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.4 }}
            >
              <Link href="/auth?mode=signup" className="bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition duration-300">
                Get Started Free
              </Link>
            </motion.div>
          </div>
        </section>

        <section id="features" className="py-20">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold text-center text-gray-800 mb-12"
              {...fadeIn}
            >
              A suite of AI tools for your job search
            </motion.h2>
            <div className="grid md:grid-cols-3 gap-8">
              <motion.div 
                className="bg-white p-6 rounded-lg shadow"
                {...fadeIn}
                transition={{ delay: 0.2 }}
              >
                <MicrophoneIcon className="h-12 w-12 text-orange-600 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-4">Plan ahead</h3>
                <p className="text-gray-600">Master your Resume, create Cover Letter, and prepare with Mock Interviews.</p>
              </motion.div>
              <motion.div 
                className="bg-white p-6 rounded-lg shadow"
                {...fadeIn}
                transition={{ delay: 0.4 }}
              >
                <LightBulbIcon className="h-12 w-12 text-orange-600 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-4">Ace the interview</h3>
                <p className="text-gray-600">Get real-time transcription and personalized support during your interview.</p>
              </motion.div>
              <motion.div 
                className="bg-white p-6 rounded-lg shadow"
                {...fadeIn}
                transition={{ delay: 0.6 }}
              >
                <PresentationChartLineIcon className="h-12 w-12 text-orange-600 mb-4 mx-auto" />
                <h3 className="text-xl font-semibold mb-4">Follow up</h3>
                <p className="text-gray-600">Automate follow-ups, review interview summaries, and negotiate your salary.</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section id="testimonials" className="bg-gradient-to-r from-orange-50 to-red-50 py-20">
          <div className="container mx-auto px-4">
            <motion.h2 
              className="text-3xl font-bold text-center text-gray-800 mb-12"
              {...fadeIn}
            >
              What our users say
            </motion.h2>
            <div className="grid md:grid-cols-2 gap-8">
              <motion.div 
                className="bg-white p-6 rounded-lg shadow"
                {...fadeIn}
                transition={{ delay: 0.2 }}
              >
                <p className="text-gray-600 mb-4">"AI Buddy gave me the edge I needed in the competitive world of investment banking. It's a game-changer!"</p>
                <p className="font-semibold">- Rishi, Investment Banker @J.P. Morgan</p>
              </motion.div>
              <motion.div 
                className="bg-white p-6 rounded-lg shadow"
                {...fadeIn}
                transition={{ delay: 0.4 }}
              >
                <p className="text-gray-600 mb-4">"With AI Buddy, I feel exceptionally prepared for every interview. It's like having interviews on autopilot!"</p>
                <p className="font-semibold">- Michael, Software Engineer @Netflix</p>
              </motion.div>
            </div>
          </div>
        </section>

        <section className="py-20">
          <div className="container mx-auto px-4 text-center">
            <motion.h2 
              className="text-3xl font-bold text-gray-800 mb-4"
              {...fadeIn}
            >
              AI Will Not Take Your Job But Someone Using AI Will
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 mb-8"
              {...fadeIn}
              transition={{ delay: 0.2 }}
            >
              Learn more about AI superpowers to navigate this recruiting season
            </motion.p>
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.4 }}
            >
              <Link href="/interview" className="bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition duration-300">
                Get Started Free
              </Link>
            </motion.div>
          </div>
        </section>

        <section className="py-20 bg-white">
          <div className="container mx-auto px-4 text-center">
            <motion.h2 
              className="text-3xl font-bold text-gray-800 mb-4"
              {...fadeIn}
            >
              Ready to ace your next interview?
            </motion.h2>
            <motion.p 
              className="text-xl text-gray-600 mb-8"
              {...fadeIn}
              transition={{ delay: 0.2 }}
            >
              Join AI Buddy today and unlock your interview potential
            </motion.p>
            <motion.div
              {...fadeIn}
              transition={{ delay: 0.4 }}
              className="space-x-4"
            >
              <Link href="/auth?mode=signup" className="bg-orange-600 text-white px-6 py-3 rounded-lg text-lg font-semibold hover:bg-orange-700 transition duration-300">
                Sign Up
              </Link>
              <Link href="/auth?mode=login" className="bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-lg font-semibold hover:bg-gray-300 transition duration-300">
                Log In
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p>&copy; 2024 AI Buddy. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
