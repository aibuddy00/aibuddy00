'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { client } from '@/sanity/lib/client';
import GeminiResponseDisplay from '@/components/GeminiResponseDisplay';

interface QAExchange {
  question: string;
  answer: string;
  aiResponse: string;
}

interface Interview {
  _id: string;
  title: string;
  date: string;
  duration: number;
  interviewType: string;
  qaExchange: QAExchange[];
}

const InterviewDetailPage = ({ params }: { params: { id: string } }) => {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [interview, setInterview] = useState<Interview | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchInterview = async () => {
      const result = await client.fetch(`*[_type == "interview" && _id == $id][0]`, {
        id: params.id,
      });
      setInterview(result);
    };

    if (params.id) {
      fetchInterview();
    }
  }, [params.id]);

  if (status === "loading" || !interview) return <div>Loading...</div>;
  if (status === "unauthenticated") return null;

  return (
    <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">{interview.title}</h1>
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">Interview Details</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            {new Date(interview.date).toLocaleString()} | {interview.duration} minutes | {interview.interviewType}
          </p>
        </div>
        <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            {interview.qaExchange.map((qa, index) => (
              <div key={index} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                <dt className="text-sm font-medium text-gray-500">
                  Question {index + 1}
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="mb-2">
                    <strong>Q:</strong> {qa.question}
                  </div>
                  <div className="mb-2">
                    <strong>A:</strong> {qa.answer}
                  </div>
                  <div className="bg-gray-50 p-3 rounded-md">
                    <strong>AI Response:</strong>
                    <GeminiResponseDisplay responses={[qa.aiResponse]} />
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default InterviewDetailPage;