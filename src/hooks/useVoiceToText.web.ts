// src/hooks/useVoiceToText.web.ts
// Stub web : react-native-audio-api et le Whisper TFLite natif sont
// indisponibles sur navigateur. La reconnaissance vocale locale ne
// fonctionne que sur l'app mobile (iOS/Android).

import { useCallback, useState } from 'react';

type Status = 'idle' | 'recording' | 'processing' | 'success' | 'error';

export function useVoiceToText() {
  const [status, setStatus] = useState<Status>('idle');

  const startRecording = useCallback(async () => {
    setStatus('error');
  }, []);

  const stopRecording = useCallback(async () => {
    setStatus('error');
  }, []);

  const reset = useCallback(() => setStatus('idle'), []);

  return {
    status,
    isRecording: false,
    isProcessing: false,
    transcript: '',
    error: "La reconnaissance vocale locale n'est pas disponible sur le web. Utilisez l'application mobile.",
    startRecording,
    stopRecording,
    reset,
  };
}
