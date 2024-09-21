export const startScreenRecording = async (): Promise<MediaStream> => {
  try {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "browser" },
      audio: {
        echoCancellation: true,
        noiseSuppression: true,
        sampleRate: 44100
      },
    });

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
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};