'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { FiCalendar, FiCheckCircle, FiPlus, FiSearch, FiGrid, FiList, FiMoreVertical, FiUpload, FiPlay, FiLogOut } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

const DashboardPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('upcoming');
  const [viewMode, setViewMode] = useState('grid');
  const [searchQuery, setSearchQuery] = useState('');

  // Add this useEffect to redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  const sidebarItems = [
    { href: '/dashboard', label: 'Interviews', icon: FiCalendar },
    { href: '/roles', label: 'Roles', icon: FiCheckCircle },
    { href: '/resumes', label: 'Resumes & Others', icon: FiCheckCircle },
    { href: '/store', label: 'Specialization Store', icon: FiCheckCircle },
    { href: '/resume-builder', label: 'AI Resume Builder', icon: FiCheckCircle },
    { href: '/career-coach', label: 'AI Career Coach', icon: FiCheckCircle },
  ];

  const quickActions = [
    { label: 'Schedule Interview', icon: FiCalendar },
    { label: 'Create Role', icon: FiCheckCircle },
    // Remove the 'Upload Resume' action
    // { label: 'Upload Resume', icon: FiPlus },
  ];

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const handleStartLiveInterview = () => {
    router.push('/interview-v2');
  };

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    return null; // Return null while redirecting
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-md">
        <div className="p-4">
          <Image src="/logo.png" alt="AI Buddy Logo" width={120} height={40} />
        </div>
        <nav className="mt-8">
          {sidebarItems.map((item, index) => (
            <Link key={index} href={item.href} className="flex items-center py-2 px-4 text-gray-600 hover:bg-orange-100 hover:text-orange-500">
              <item.icon className="mr-2" />
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      {/* Main content */}
      <div className="flex-1 overflow-y-auto">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4 md:mb-0">Interviews</h1>
            <div className="flex items-center">
              <div className="relative mr-4">
                <input
                  type="text"
                  placeholder="Search interviews..."
                  className="border rounded-md py-2 pl-10 pr-4"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <FiSearch className="absolute left-3 top-3 text-gray-400" />
              </div>
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
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            {/* Subtle Live Interview CTA */}
            <div className="bg-orange-50 p-4 rounded-lg shadow-sm mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-medium text-orange-800 mb-1">Ready to shine?</h2>
                  <p className="text-sm text-orange-600">Start a live interview now.</p>
                </div>
                <button 
                  onClick={handleStartLiveInterview}
                  className="bg-orange-500 text-white py-2 px-4 text-sm rounded-md hover:bg-orange-600 transition duration-300 flex items-center"
                >
                  <FiPlay className="mr-2" />
                  Start Live Interview
                </button>
              </div>
            </div>

            <div className="border-b border-gray-200">
              <nav className="-mb-px flex">
                {['upcoming', 'completed'].map((tab) => (
                  <button
                    key={tab}
                    className={`${
                      activeTab === tab
                        ? 'border-orange-500 text-orange-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ${tab === 'completed' ? 'ml-8' : ''}`}
                    onClick={() => setActiveTab(tab)}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}
              </nav>
            </div>

            <div className="mt-6">
              <div className="flex flex-col md:flex-row justify-between items-center mb-4">
                <div className="flex items-center mb-4 md:mb-0">
                  <select className="border rounded-md py-2 px-4 mr-2">
                    <option>All Types</option>
                    <option>Technical</option>
                    <option>Behavioral</option>
                    <option>Case Study</option>
                  </select>
                  <button
                    className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-gray-200' : ''}`}
                    onClick={() => setViewMode('grid')}
                  >
                    <FiGrid />
                  </button>
                  <button
                    className={`p-2 rounded-md ml-2 ${viewMode === 'list' ? 'bg-gray-200' : ''}`}
                    onClick={() => setViewMode('list')}
                  >
                    <FiList />
                  </button>
                </div>
                <div>
                  <button className="bg-gray-200 text-gray-700 py-2 px-4 rounded-md mr-2 hover:bg-gray-300 transition duration-300">
                    Mock Interview
                  </button>
                  <button 
                    onClick={handleStartLiveInterview}
                    className="bg-orange-500 text-white py-2 px-4 rounded-md hover:bg-orange-600 transition duration-300"
                  >
                    Live Interview
                  </button>
                </div>
              </div>

              {/* Interview list or empty state */}
              <div className="bg-white shadow overflow-hidden sm:rounded-md">
                <div className="px-4 py-5 sm:p-6 text-center text-gray-500">
                  <FiPlus className="mx-auto h-12 w-12 text-gray-400" />
                  <h3 className="mt-2 text-sm font-medium text-gray-900">No interviews</h3>
                  <p className="mt-1 text-sm text-gray-500">Get started by creating a new interview or try these quick actions:</p>
                  <div className="mt-6 flex flex-wrap justify-center">
                    {quickActions.map((action, index) => (
                      <button
                        key={index}
                        className="m-2 inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
                      >
                        <action.icon className="-ml-1 mr-2 h-5 w-5 text-gray-400" />
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default DashboardPage;