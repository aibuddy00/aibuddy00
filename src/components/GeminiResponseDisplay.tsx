interface GeminiResponseDisplayProps {
  responses: string[];
}

export default function GeminiResponseDisplay({ responses }: GeminiResponseDisplayProps) {
  return (
    <div>
      <h2>Gemini Responses:</h2>
      <div style={{ height: '200px', border: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
        {responses.map((response, index) => (
          <p key={index}>{response}</p>
        ))}
      </div>
    </div>
  );
}