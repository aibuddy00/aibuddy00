'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '../context/UserContext';

const Navbar = () => {
  const { isLoggedIn, username } = useUser();

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center">
              <Link href="/">
                <Image src="/logo.jpg" alt="Final Round AI Logo" width={120} height={40} />
              </Link>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/interview" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Interview Buddy™
              </Link>
              <Link href="/resume" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                AI Resume Builder
              </Link>
              <Link href="/mock-interview" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                AI Mock Interview
              </Link>
              <Link href="/resources" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Resources
              </Link>
              <Link href="/question-bank" className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                Question Bank
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="bg-black text-white px-4 py-2 rounded-md text-sm font-medium">
                  View Dashboard
                </Link>
                <div className="ml-3 relative">
                  <div>
                    <button type="button" className="bg-white rounded-full flex text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500" id="user-menu" aria-expanded="false" aria-haspopup="true">
                      <span className="sr-only">Open user menu</span>
                      <Image className="h-8 w-8 rounded-full" src="/avatar.jpeg" alt={username || ''} width={32} height={32} />
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <Link href="/login" className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium">
                Log In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;