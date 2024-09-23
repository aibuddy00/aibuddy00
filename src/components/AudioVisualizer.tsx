import React, { useRef, useEffect } from 'react';

interface AudioVisualizerProps {
  stream: MediaStream | null;
}

const AudioVisualizer: React.FC<AudioVisualizerProps> = ({ stream }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!stream || !canvasRef.current) return;

    // Check if the stream has at least one audio track
    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) {
      console.warn('No audio tracks found in the MediaStream.');
      return;
    }

    const audioContext = new AudioContext();
    const analyser = audioContext.createAnalyser();
    const source = audioContext.createMediaStreamSource(stream);
    source.connect(analyser);

    analyser.fftSize = 32; // Smaller fftSize for a simpler visual
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const canvas = canvasRef.current;
    const canvasCtx = canvas.getContext('2d');

    if (!canvasCtx) return;

    const draw = () => {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      canvasCtx.clearRect(0, 0, WIDTH, HEIGHT);

      const barHeight = dataArray.reduce((a, b) => a + b, 0) / bufferLength;

      canvasCtx.fillStyle = 'rgb(0, 255, 0)';
      canvasCtx.fillRect(0, HEIGHT - barHeight, WIDTH, barHeight);
    };

    draw();

    return () => {
      source.disconnect();
      audioContext.close();
    };
  }, [stream]);

  return <canvas ref={canvasRef} width="50" height="20" />; // Very small size
};

export default AudioVisualizer;