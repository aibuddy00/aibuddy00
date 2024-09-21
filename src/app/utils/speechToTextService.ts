import * as sdk from 'microsoft-cognitiveservices-speech-sdk';

export const initializeSpeechRecognition = (
  stream: MediaStream,
  onTranscript: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onStatusChange: (status: string) => void
) => {
  console.log('Initializing speech recognition...');
  const subscriptionKey = process.env.NEXT_PUBLIC_AZURE_SPEECH_KEY;
  const region = process.env.NEXT_PUBLIC_AZURE_SPEECH_REGION;

  if (!subscriptionKey || !region) {
    console.error('Azure Speech credentials are not properly configured.');
    onError('Azure Speech credentials are not properly configured.');
    return null;
  }

  try {
    const speechConfig = sdk.SpeechConfig.fromSubscription(subscriptionKey, region);
    speechConfig.speechRecognitionLanguage = "en-US";
    speechConfig.outputFormat = sdk.OutputFormat.Detailed;
    console.log('Speech config created.');

    const audioConfig = sdk.AudioConfig.fromStreamInput(stream);
    console.log('Audio config created from stream.');

    const recognizer = new sdk.SpeechRecognizer(speechConfig, audioConfig);
    console.log('Speech recognizer created.');

    let isReceivingAudio = false;
    let silenceCounter = 0;

    // We'll use this function to monitor audio levels
    const monitorAudioLevels = () => {
      const audioContext = new AudioContext();
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      source.connect(analyser);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const checkAudioLevel = () => {
        analyser.getByteFrequencyData(dataArray);
        const sum = dataArray.reduce((acc, val) => acc + val, 0);
        const average = sum / bufferLength;

        if (average > 0) {
          if (!isReceivingAudio) {
            console.log('Receiving audio data');
            isReceivingAudio = true;
          }
          silenceCounter = 0;
        } else {
          silenceCounter++;
          if (silenceCounter > 100 && isReceivingAudio) {  // About 2 seconds of silence
            console.warn('No audio data received for a while');
            isReceivingAudio = false;
          }
        }

        requestAnimationFrame(checkAudioLevel);
      };

      checkAudioLevel();

      return () => {
        source.disconnect();
        audioContext.close();
      };
    };

    const cleanupAudioMonitor = monitorAudioLevels();

    recognizer.recognizing = (s, e) => {
      console.log('Recognizing:', e.result.text);
      onTranscript(e.result.text, false);
    };

    recognizer.recognized = (s, e) => {
      if (e.result.reason === sdk.ResultReason.RecognizedSpeech) {
        console.log('Recognized:', e.result.text);
        onTranscript(e.result.text, true);
      } else if (e.result.reason === sdk.ResultReason.NoMatch) {
        console.log('NoMatch details:', sdk.NoMatchDetails.fromResult(e.result));
      } else {
        console.log('Recognition result:', sdk.ResultReason[e.result.reason]);
      }
    };

    recognizer.canceled = (s, e) => {
      console.log('Speech recognition canceled:', sdk.CancellationReason[e.reason]);
      if (e.reason === sdk.CancellationReason.Error) {
        console.error('Speech recognition error:', e.errorDetails);
        onError(`Error: ${e.errorDetails}`);
      }
      onStatusChange("Recognition canceled");
    };

    recognizer.sessionStarted = () => {
      console.log('Speech recognition session started');
      onStatusChange("Session started");
    };

    recognizer.sessionStopped = () => {
      console.log('Speech recognition session stopped');
      onStatusChange("Session stopped");
    };

    const start = () => {
      console.log('Starting continuous recognition...');
      recognizer.startContinuousRecognitionAsync(
        () => {
          console.log('Continuous recognition started');
          onStatusChange("Recognition started");
        },
        (err) => {
          console.error('Error starting recognition:', err);
          onError(`Error starting recognition: ${err}`);
        }
      );
    };

    const stop = () => {
      console.log('Stopping continuous recognition...');
      recognizer.stopContinuousRecognitionAsync(
        () => {
          console.log('Continuous recognition stopped');
          onStatusChange("Recognition stopped");
          cleanupAudioMonitor();
          recognizer.close();
        },
        (err) => {
          console.error('Error stopping recognition:', err);
          onError(`Error stopping recognition: ${err}`);
        }
      );
    };

    return { start, stop };
  } catch (error) {
    console.error('Failed to initialize speech recognition:', error);
    onError(`Failed to initialize speech recognition: ${error}`);
    return null;
  }
};

// Future: Add methods for initializing and stopping WebSocket-based transcription
// export const initializeWebSocketTranscription = (
//   onTranscript: (transcript: string) => void,
//   onError: (error: string) => void,
//   onStatusChange: (status: string) => void
// ) => { /* WebSocket setup */ };

// export const stopWebSocketTranscription = (/* WebSocket reference */) => { /* Stop WebSocket */ };