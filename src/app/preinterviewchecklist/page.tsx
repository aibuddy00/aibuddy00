 'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const PreInterviewChecklistPage = () => {
  const [step, setStep] = useState(1);
  const [company, setCompany] = useState('');
  const [role, setRole] = useState('');
  const [companyDetails, setCompanyDetails] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  const [permissions, setPermissions] = useState({
    audio: false,
    camera: false,
    notifications: false,
    browser: true,
  });

  const router = useRouter();

  const handleNextStep = () => {
    setStep(step + 1);
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResume(e.target.files[0]);
    }
  };

  const handlePermissionRequest = (type: string) => {
    // Simulate permission request
    setPermissions({ ...permissions, [type]: true });
  };

  const handleSubmit = () => {
    // Handle form submission
    router.push('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <header className="mb-4">
        <Image src="/logo.png" alt="Final Round AI Logo" width={150} height={50} />
      </header>
      <main className="w-full max-w-md mx-auto bg-white p-8 rounded-lg shadow-md">
        {step === 1 && (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">Tell us about the role you're interviewing for</h1>
            <div className="space-y-4">
              <div>
                <label htmlFor="role" className="block text-sm font-medium text-gray-700">Position</label>
                <input
                  id="role"
                  type="text"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Enter your desired role"
                />
              </div>
              <div>
                <label htmlFor="company" className="block text-sm font-medium text-gray-700">Company</label>
                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(e) => setCompany(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Enter your desired company"
                />
              </div>
              <div>
                <label htmlFor="companyDetails" className="block text-sm font-medium text-gray-700">Company Details</label>
                <textarea
                  id="companyDetails"
                  value={companyDetails}
                  onChange={(e) => setCompanyDetails(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Copy and paste the company description here"
                  rows={4}
                />
              </div>
              <div>
                <label htmlFor="jobDescription" className="block text-sm font-medium text-gray-700">Job Description</label>
                <textarea
                  id="jobDescription"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  className="mt-1 block w-full py-2 px-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                  placeholder="Copy and paste the job description here"
                  rows={4}
                />
              </div>
              <button
                onClick={handleNextStep}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Next Step
              </button>
              <button
                onClick={handlePreviousStep}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-4"
              >
                Back
              </button>
              <Link href="/dashboard" className="block text-center text-sm text-gray-600 mt-4">Skip This Step</Link>
            </div>
          </>
        )}
        {step === 2 && (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">Help us tailor our realtime responses to you</h1>
            <div className="space-y-4">
              <div>
                <label htmlFor="resume" className="block text-sm font-medium text-gray-700">Upload your resume</label>
                <input
                  id="resume"
                  type="file"
                  onChange={handleFileChange}
                  className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"
                />
                {resume && <p className="mt-2 text-sm text-gray-600">{resume.name}</p>}
              </div>
              <button
                onClick={handleNextStep}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Next Step
              </button>
              <button
                onClick={handlePreviousStep}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-4"
              >
                Back
              </button>
              <Link href="/dashboard" className="block text-center text-sm text-gray-600 mt-4">Skip This Step</Link>
            </div>
          </>
        )}
        {step === 3 && (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">Launch Checklist</h1>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span>Audio Permission</span>
                <button
                  onClick={() => handlePermissionRequest('audio')}
                  className={`py-2 px-4 rounded-md shadow-sm text-sm font-medium ${permissions.audio ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {permissions.audio ? 'Granted' : 'Request'}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>Camera Permission</span>
                <button
                  onClick={() => handlePermissionRequest('camera')}
                  className={`py-2 px-4 rounded-md shadow-sm text-sm font-medium ${permissions.camera ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {permissions.camera ? 'Granted' : 'Request'}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>Browser Notifications</span>
                <button
                  onClick={() => handlePermissionRequest('notifications')}
                  className={`py-2 px-4 rounded-md shadow-sm text-sm font-medium ${permissions.notifications ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                >
                  {permissions.notifications ? 'Granted' : 'Request'}
                </button>
              </div>
              <div className="flex justify-between items-center">
                <span>Browser Compatibility</span>
                <button
                  className="py-2 px-4 rounded-md shadow-sm text-sm font-medium bg-green-500 text-white"
                >
                  Checked
                </button>
              </div>
              <button
                onClick={handleNextStep}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
              >
                Next Step
              </button>
              <button
                onClick={handlePreviousStep}
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 mt-4"
              >
                Back
              </button>
              <Link href="/interview" className="block text-center text-sm text-gray-600 mt-4">Skip This Step</Link>
            </div>
          </>
        )}
        {step === 4 && (
          <>
            <h1 className="text-2xl font-bold text-center mb-6">You're all set!</h1>
            <p className="text-center text-gray-600 mb-6">Thank you for providing the details. You can now proceed to your dashboard.</p>
            <button
              onClick={handleSubmit}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500"
            >
              Go to Dashboard
            </button>
          </>
        )}
      </main>
    </div>
  );
};

export default PreInterviewChecklistPage;