// src/hooks/useVoiceToText.ts
// Enregistre la voix (PCM brut via react-native-audio-api) puis lance la
// transcription locale (Whisper TFLite) à l'arrêt. 100% hors-ligne.
//
// IMPORTANT : le `sampleRate` passé à `onAudioReady` n'est qu'une suggestion
// — la doc de react-native-audio-api précise explicitement que le débit
// matériel réel peut différer selon l'appareil. Whisper exige strictement
// du 16kHz ; enregistrer par ex. à 44.1/48kHz sans le savoir et nourrir ces
// échantillons tels quels au pipeline mel-spectrogram (calibré pour 16kHz)
// désynchronise complètement le temps/fréquence — le modèle "entend" un
// signal mais transcrit n'importe quoi. On lit donc le vrai
// `buffer.sampleRate` de chaque chunk et on rééchantillonne vers 16kHz
// avant l'inférence si besoin.

import { useCallback, useRef, useState } from 'react';
import { AudioRecorder, AudioManager } from 'react-native-audio-api';
import { runVoiceInference } from '@/ai/voice/runVoiceInference';
import { resampleLinear } from '@/ai/voice/resample';

const SAMPLE_RATE = 16000;

type Status = 'idle' | 'recording' | 'processing' | 'success' | 'error';

export function useVoiceToText() {
  const [status, setStatus] = useState<Status>('idle');
  const [transcript, setTranscript] = useState('');
  const [error, setError] = useState<string | null>(null);

  const recorderRef = useRef<AudioRecorder | null>(null);
  const chunksRef = useRef<Float32Array[]>([]);
  const nativeSampleRateRef = useRef<number | null>(null);

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
    nativeSampleRateRef.current = null;

    const recorder = new AudioRecorder();
    const readyResult = recorder.onAudioReady(
      { sampleRate: SAMPLE_RATE, bufferLength: SAMPLE_RATE * 0.1, channelCount: 1 },
      ({ buffer }) => {
        // `sampleRate` ci-dessus n'est qu'une suggestion ; on se fie au débit
        // réel rapporté par chaque buffer (constant pour toute la session).
        if (nativeSampleRateRef.current === null) {
          nativeSampleRateRef.current = buffer.sampleRate;
        }
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
      const rawSamples = new Float32Array(totalLength);
      let offset = 0;
      for (const chunk of chunksRef.current) {
        rawSamples.set(chunk, offset);
        offset += chunk.length;
      }
      chunksRef.current = [];

      const nativeRate = nativeSampleRateRef.current ?? SAMPLE_RATE;
      const samples = nativeRate === SAMPLE_RATE
        ? rawSamples
        : resampleLinear(rawSamples, nativeRate, SAMPLE_RATE);

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
