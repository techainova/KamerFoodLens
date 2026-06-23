// src/hooks/useVoiceToText.ts
// Enregistre la voix (PCM brut 16kHz mono via react-native-audio-api) puis
// lance la transcription locale (Whisper TFLite) à l'arrêt. 100% hors-ligne.

import { useCallback, useRef, useState } from 'react';
import { AudioRecorder, AudioManager } from 'react-native-audio-api';
import { runVoiceInference } from '@/ai/voice/runVoiceInference';

const SAMPLE_RATE = 16000;

type Status = 'idle' | 'recording' | 'processing' | 'success' | 'error';

export function useVoiceToText() {
  const [status, setStatus] = useState<Status>('idle');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<AudioRecorder | null>(null);
  const chunksRef = useRef<Float32Array[]>([]);

  const startRecording = useCallback(async () => {
    setError(null);
    setTranscript('');
    const permission = await AudioManager.requestRecordingPermissions();
    if (permission !== 'Granted') {
      setError('Permission micro refusée');
      setStatus('error');
      return;
    }

    await AudioManager.setAudioSessionActivity(true);
    chunksRef.current = [];

    const recorder = new AudioRecorder();
    const readyResult = recorder.onAudioReady(
      { sampleRate: SAMPLE_RATE, bufferLength: SAMPLE_RATE * 0.1, channelCount: 1 },
      ({ buffer }) => {
        chunksRef.current.push(buffer.getChannelData(0).slice());
      },
    );
    const startResult = recorder.start();
    if (readyResult.status === 'error' || startResult.status === 'error') {
      setError(readyResult.status === 'error' ? readyResult.message : (startResult as { message: string }).message);
      setStatus('error');
      return;
    }
    recorderRef.current = recorder;
    setStatus('recording');
  }, []);

  const stopRecording = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder) return;
    recorder.stop();
    recorder.clearOnAudioReady();
    recorderRef.current = null;
    await AudioManager.setAudioSessionActivity(false);

    setStatus('processing');
    try {
      const totalLength = chunksRef.current.reduce((sum, c) => sum + c.length, 0);
      const samples = new Float32Array(totalLength);
      let offset = 0;
      for (const chunk of chunksRef.current) {
        samples.set(chunk, offset);
        offset += chunk.length;
      }
      chunksRef.current = [];

      const text = await runVoiceInference(samples);
      setTranscript(text);
      setStatus('success');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur de transcription';
      console.error('[KFL][useVoiceToText] échec:', err);
      setError(message);
      setStatus('error');
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setTranscript('');
    setError(null);
  }, []);

  return {
    status,
    isRecording: status === 'recording',
    isProcessing: status === 'processing',
    transcript,
    error,
    startRecording,
    stopRecording,
    reset,
  };
}
