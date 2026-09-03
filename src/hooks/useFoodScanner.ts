// src/hooks/useFoodScanner.ts
// Orchestre la reconnaissance : API backend (AES chiffré) → fallback IA locale.

import { useCallback, useState } from 'react';
import * as ImageManipulator from 'expo-image-manipulator';
import { runInference } from '@/ai/runInference';
import { interpretResult, UNKNOWN_CLASS } from '@/ai/interpretResult';
import { getDishDescription, type DishDescription } from '@/ai/dishDescriptions';
import { scannerService } from '@/services/scanner.service';

export interface FoodScanResult {
  classId: string;
  confidence: number;
  description: DishDescription | null;
  isUnknown: boolean;
  scanId?: string;
}

type ScanStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseFoodScannerState {
  status: ScanStatus;
  result: FoodScanResult | null;
  error: string | null;
}

async function imageUriToBase64(uri: string): Promise<string> {
  const manipResult = await ImageManipulator.manipulateAsync(
    uri,
    [],
    { base64: true, format: ImageManipulator.SaveFormat.JPEG, compress: 0.7 },
  );
  return manipResult.base64 ?? '';
}

export function useFoodScanner() {
  const [state, setState] = useState<UseFoodScannerState>({
    status: 'idle',
    result: null,
    error: null,
  });

  const scanImage = useCallback(async (imageUri: string): Promise<FoodScanResult> => {
    setState({ status: 'loading', result: null, error: null });
    try {
      // Essai via l'API backend (payload AES-256-GCM chiffré par l'intercepteur)
      try {
        const imageBase64 = await imageUriToBase64(imageUri);
        const apiResult = await scannerService.analyzeImage({ imageBase64, mimeType: 'image/jpeg' });
        const result: FoodScanResult = {
          classId: apiResult.classId,
          confidence: apiResult.confidence,
          description: apiResult.description ?? getDishDescription(apiResult.classId),
          isUnknown: apiResult.confidence < 0.6,
          scanId: apiResult.scanId,
        };
        setState({ status: 'success', result, error: null });
        return result;
      } catch (apiErr) {
        if (__DEV__) {
          console.warn('[KFL][useFoodScanner] API backend indisponible, basculement IA locale :', apiErr);
        }
      }

      // Fallback : IA locale TFLite
      const scores = await runInference(imageUri);
      const { classe, confiance } = interpretResult(scores);
      if (__DEV__) {
        console.log('[KFL][useFoodScanner] local IA -> classe:', classe, 'confiance:', confiance);
      }
      const isUnknown = classe === UNKNOWN_CLASS;
      const result: FoodScanResult = {
        classId: classe,
        confidence: confiance,
        description: isUnknown ? null : getDishDescription(classe),
        isUnknown,
      };
      setState({ status: 'success', result, error: null });
      return result;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue lors du scan';
      console.error('[KFL][useFoodScanner] échec du scan:', err);
      setState({ status: 'error', result: null, error: message });
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setState({ status: 'idle', result: null, error: null });
  }, []);

  return {
    status: state.status,
    result: state.result,
    error: state.error,
    isLoading: state.status === 'loading',
    scanImage,
    reset,
  };
}
