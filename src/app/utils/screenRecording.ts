export const startScreenRecording = async (): Promise<MediaStream> => {
  try {
    console.log('Starting screen recording...');
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "browser" },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      },
    });

    console.log('Screen Stream Audio Tracks:', screenStream.getAudioTracks());

    // Ensure we're only getting system audio, not microphone
    screenStream.getAudioTracks().forEach(track => {
      if (track.label.toLowerCase().includes('microphone')) {
        track.enabled = false;
      }
    });

    return screenStream;
  } catch (error) {
    console.error('Error in startScreenRecording:', error);
    throw new Error('Failed to start recording. Please ensure you grant the necessary permissions.');
  }
};

export const stopScreenRecording = (stream: MediaStream | null) => {
  console.log('Stopping screen recording...');
  if (stream) {
    stream.getTracks().forEach(track => {
      console.log(`Stopping track: ${track.kind}, ${track.label}`);
      track.stop();
    });
  }
  console.log('Screen recording stopped.');
};