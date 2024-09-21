interface TranscriptDisplayProps {
  azureTranscript: { final: string[], interim: string[] };
  localTranscript: { final: string[], interim: string[] };
}

export default function TranscriptDisplay({ azureTranscript, localTranscript }: TranscriptDisplayProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
      <div style={{ width: '48%' }}>
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
      <div style={{ width: '48%' }}>
        <h2>Local Transcript:</h2>
        <div style={{ height: '200px', border: '1px solid #ccc', padding: '10px', overflowY: 'auto' }}>
          {localTranscript.final.map((sentence, index) => (
            <p key={index}>{sentence}</p>
          ))}
          {localTranscript.interim.map((sentence, index) => (
            <p key={index} style={{ color: 'gray' }}>{sentence}</p>
          ))}
        </div>
      </div>
    </div>
  );
}