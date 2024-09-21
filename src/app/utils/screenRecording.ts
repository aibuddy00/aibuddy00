export const startScreenRecording = async (): Promise<MediaStream> => {
  try {
    // Capture screen video and system audio
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: { displaySurface: "browser" },
      audio: true, // System audio
    });

    console.log('Screen Stream Audio Tracks:', screenStream.getAudioTracks());

    // Capture microphone audio
    const audioStream = await navigator.mediaDevices.getUserMedia({
      audio: true, // Microphone audio
    });

    console.log('Microphone Audio Tracks:', audioStream.getAudioTracks());

    // Combine both audio streams
    const combinedAudioTracks = [...screenStream.getAudioTracks(), ...audioStream.getAudioTracks()];

    const combinedStream = new MediaStream([
      ...screenStream.getVideoTracks(),
      ...combinedAudioTracks,
    ]);

    console.log('Combined Stream Audio Tracks:', combinedStream.getAudioTracks());

    // Optional: Log each track's enabled state
    combinedStream.getAudioTracks().forEach(track => {
      console.log(`Track ID: ${track.id}, Enabled: ${track.enabled}`);
    });

    return combinedStream;
  } catch (error) {
    console.error('Error accessing media devices:', error);
    throw new Error('Failed to start recording. Please ensure you grant the necessary permissions.');
  }
};

export const stopScreenRecording = (stream: MediaStream | null) => {
  if (stream) {
    stream.getTracks().forEach(track => track.stop());
  }
};