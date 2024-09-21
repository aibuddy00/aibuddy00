export const initializeLocalSpeechRecognition = (
  onTranscript: (transcript: string, isFinal: boolean) => void,
  onError: (error: string) => void,
  onStatusChange: (status: string) => void
) => {
  const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
  if (!SpeechRecognition) {
    console.error('Speech recognition not supported in this browser');
    onError('Speech recognition not supported in this browser');
    return null;
  }

  const recognition = new SpeechRecognition();
  recognition.continuous = true;
  recognition.interimResults = true;
  recognition.lang = 'en-US';

  recognition.onstart = () => {
    console.log('Local speech recognition started');
    onStatusChange('Local recognition started');
  };

  recognition.onerror = (event: any) => {
    console.error('Local speech recognition error', event.error);
    onError(`Local speech recognition error: ${event.error}`);
  };

  recognition.onend = () => {
    console.log('Local speech recognition ended');
    onStatusChange('Local recognition ended');
  };

  recognition.onresult = (event: any) => {
    let interimTranscript = '';
    let finalTranscript = '';

    for (let i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        finalTranscript += event.results[i][0].transcript;
      } else {
        interimTranscript += event.results[i][0].transcript;
      }
    }

    if (finalTranscript) {
      console.log('Local final transcript:', finalTranscript);
      onTranscript(finalTranscript, true);
    }
    if (interimTranscript) {
      console.log('Local interim transcript:', interimTranscript);
      onTranscript(interimTranscript, false);
    }
  };

  const start = () => {
    recognition.start();
  };

  const stop = () => {
    recognition.stop();
  };

  return { start, stop };
};