import { useRef, useEffect } from 'react';

interface VideoDisplayProps {
  stream: MediaStream | null;
}

export default function VideoDisplay({ stream }: VideoDisplayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <div>
      <p>Recording audio and capturing screen...</p>
      <video 
        ref={videoRef} 
        autoPlay 
        controls
        style={{ width: '100%', maxWidth: '800px' }} 
      />
    </div>
  );
}