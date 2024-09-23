import React, { useEffect, useRef } from 'react';
import MarkdownPreview from "@uiw/react-markdown-preview";

interface GeminiResponseDisplayProps {
  responses: string[];
}

const GeminiResponseDisplay: React.FC<GeminiResponseDisplayProps> = ({ responses }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [responses]);

  return (
    <div ref={containerRef} className="space-y-4 overflow-y-auto p-4 bg-gray-50 rounded-lg shadow-md flex-grow h-full">
      {responses.map((response, index) => (
        <div key={index} className="bg-white p-4 rounded-md shadow-sm border border-gray-200">
          <MarkdownPreview
            source={response}
          />
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};

export default GeminiResponseDisplay;