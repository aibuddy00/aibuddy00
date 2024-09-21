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

export const setupWebSocket = (
  combinedStream: MediaStream,
  onTranscription: (transcription: string) => void
) => {
  const socket = new WebSocket('ws://localhost:8080'); // Local WebSocket URL

  socket.onopen = () => {
    console.log('WebSocket connection established');

    const audioTracks = combinedStream.getAudioTracks();
    if (audioTracks.length === 0) {
      console.error('No audio tracks found in the combined stream');
      return;
    }

    const audioStream = new MediaStream(audioTracks);
    const mediaRecorder = new MediaRecorder(audioStream, { mimeType: 'audio/webm' });

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0 && socket.readyState === WebSocket.OPEN) {
        socket.send(event.data);
      }
    };

    mediaRecorder.start(250); // Send audio data in chunks of 250ms

    // Handle socket close
    socket.onclose = () => {
      mediaRecorder.stop();
      console.log('WebSocket connection closed');
    };

    // Handle socket errors
    socket.onerror = (error) => {
      console.error('WebSocket error:', error);
      mediaRecorder.stop();
    };
  };

  socket.onmessage = (event) => {
    // Handle transcription results from the server
    const transcription = event.data;
    onTranscription(transcription);
  };

  return socket;
};

export const setupSpeechRecognition = (
  combinedStream: MediaStream,
  onTranscript: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onStatusChange: (status: string) => void
) => {
  if (!(window as any).webkitSpeechRecognition) {
    console.error('Speech recognition not supported in this browser');
    onError('Speech recognition not supported in this browser');
    return null;
  }

  let recognition: any = null;
  let isRecognitionActive = false;
  let restartTimeout: NodeJS.Timeout | null = null;

  const startNewRecognition = () => {
    if (recognition) {
      recognition.abort();
    }

    recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      onStatusChange('Listening...');
    };

    let finalTranscriptBuffer = '';
    let interimTranscriptBuffer = '';

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscriptBuffer += event.results[i][0].transcript + ' ';
        } else {
          interimTranscriptBuffer = event.results[i][0].transcript + ' ';
        }
      }

      if (finalTranscriptBuffer) {
        onTranscript(finalTranscriptBuffer, true);
        finalTranscriptBuffer = '';
      }
      if (interimTranscriptBuffer) {
        onTranscript(interimTranscriptBuffer, false);
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error', event.error);
      if (event.error === 'no-speech') {
        onStatusChange('No speech detected. Continuing to listen...');
      } else {
        onError(`Speech recognition error: ${event.error}`);
        if (isRecognitionActive) {
          setTimeout(startNewRecognition, 1000);
        }
      }
    };

    recognition.onend = () => {
      if (isRecognitionActive) {
        startNewRecognition();
      } else {
        onStatusChange('Recognition stopped');
      }
    };

    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting recognition:', error);
      if (isRecognitionActive) {
        setTimeout(startNewRecognition, 1000);
      }
    }
  };

  const stopRecognition = () => {
    isRecognitionActive = false;
    if (recognition) {
      recognition.abort();
    }
    if (restartTimeout) {
      clearTimeout(restartTimeout);
    }
  };

  isRecognitionActive = true;
  startNewRecognition();

  return {
    stop: stopRecognition
  };
};