'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useUser } from '../context/UserContext';
import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';

const Navbar = () => {
  const { isLoggedIn, username, setIsLoggedIn, setUsername } = useUser();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUsername(null);
    localStorage.removeItem('userToken');
    // Add any additional logout logic here
  };

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <Image src="/logo.png" alt="Final Round AI Logo" width={120} height={40} />
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <NavLink href="/interview">Interview Buddy™</NavLink>
              <NavLink href="/resume">AI Resume Builder</NavLink>
              <NavLink href="/mock-interview">AI Mock Interview</NavLink>
              <NavLink href="/resources">Resources</NavLink>
              <NavLink href="/question-bank">Question Bank</NavLink>
            </div>
          </div>
          <div className="hidden md:ml-6 md:flex md:items-center">
            {isLoggedIn ? (
              <UserMenu username={username} onLogout={handleLogout} />
            ) : (
              <Link href="/login" className="bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-orange-700 transition duration-300">
                Log In
              </Link>
            )}
          </div>
          <div className="flex items-center md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-orange-500"
            >
              <span className="sr-only">Open main menu</span>
              {isMobileMenuOpen ? (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
      {isMobileMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <MobileNavLink href="/interview">Interview Buddy™</MobileNavLink>
            <MobileNavLink href="/resume">AI Resume Builder</MobileNavLink>
            <MobileNavLink href="/mock-interview">AI Mock Interview</MobileNavLink>
            <MobileNavLink href="/resources">Resources</MobileNavLink>
            <MobileNavLink href="/question-bank">Question Bank</MobileNavLink>
            {isLoggedIn ? (
              <>
                <MobileNavLink href="/dashboard">Dashboard</MobileNavLink>
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
                  Log Out
                </button>
              </>
            ) : (
              <Link href="/login" className="block w-full text-center px-3 py-2 rounded-md text-base font-medium bg-orange-600 text-white hover:bg-orange-700">
                Log In
              </Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 border-transparent text-sm font-medium">
    {children}
  </Link>
);

const MobileNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link href={href} className="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50">
    {children}
  </Link>
);

const UserMenu = ({ username, onLogout }: { username: string | null; onLogout: () => void }) => (
  <Menu as="div" className="ml-3 relative">
    <div>
      <Menu.Button className="bg-white flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500">
        <span className="sr-only">Open user menu</span>
        <Image className="h-8 w-8 rounded-full" src="/avatar.jpeg" alt={username || ''} width={32} height={32} />
        <ChevronDownIcon className="ml-2 -mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
      </Menu.Button>
    </div>
    <Transition
      enter="transition ease-out duration-100"
      enterFrom="transform opacity-0 scale-95"
      enterTo="transform opacity-100 scale-100"
      leave="transition ease-in duration-75"
      leaveFrom="transform opacity-100 scale-100"
      leaveTo="transform opacity-0 scale-95"
    >
      <Menu.Items className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white ring-1 ring-black ring-opacity-5 focus:outline-none">
        <Menu.Item>
          {({ active }) => (
            <Link href="/dashboard" className={`${active ? 'bg-gray-100' : ''} block px-4 py-2 text-sm text-gray-700`}>
              Dashboard
            </Link>
          )}
        </Menu.Item>
        <Menu.Item>
          {({ active }) => (
            <button onClick={onLogout} className={`${active ? 'bg-gray-100' : ''} block w-full text-left px-4 py-2 text-sm text-gray-700`}>
              Log Out
            </button>
          )}
        </Menu.Item>
      </Menu.Items>
    </Transition>
  </Menu>
);

export default Navbar;