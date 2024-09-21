interface InterviewControlsProps {
  isRecording: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
}

export default function InterviewControls({ isRecording, onStartRecording, onStopRecording }: InterviewControlsProps) {
  return (
    <div>
      {!isRecording ? (
        <button onClick={onStartRecording}>Start Recording</button>
      ) : (
        <button onClick={onStopRecording}>Stop Recording</button>
      )}
    </div>
  );
}