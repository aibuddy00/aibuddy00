import React from 'react';
import ReactMarkdown from 'react-markdown';

interface GeminiResponseDisplayProps {
  responses: string[];
}

const GeminiResponseDisplay: React.FC<GeminiResponseDisplayProps> = ({ responses }) => {
  return (
    <div className="space-y-4">
      {responses.map((response, index) => (
        <div key={index} className="bg-gray-100 p-4 rounded-md">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      ))}
    </div>
  );
};

export default GeminiResponseDisplay;