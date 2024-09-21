import { useRef, useEffect, useState } from 'react';

interface AudioVisualizerProps {
  stream: MediaStream | null;
}

export default function AudioVisualizer({ stream }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [volume, setVolume] = useState(0);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

    function draw() {
      // ... (keep the existing draw function logic)
    }

    draw();

    return () => {
      source.disconnect();
      audioContext.close();
    };
  }, [stream]);

  return (
    <>
      <canvas ref={canvasRef} width="300" height="100" />
      <p>Volume: {volume.toFixed(2)}%</p>
    </>
  );
}