interface TranscriptDisplayProps {
  azureTranscript: { final: string[], interim: string[] };
}

export default function TranscriptDisplay({ azureTranscript }: TranscriptDisplayProps) {
  return (
    <div>
      <h2>Azure Transcript:</h2>
      <div style={{ height: '200px', border: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
        {azureTranscript.final.map((sentence, index) => (
          <p key={index}>{sentence}</p>
        ))}
        {azureTranscript.interim.map((sentence, index) => (
          <p key={index} style={{ color: 'gray' }}>{sentence}</p>
        ))}
      </div>
    </div>
  );
}