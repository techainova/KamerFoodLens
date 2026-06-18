// src/hooks/useFoodScanner.ts
// Orchestre le pipeline complet de reconnaissance : preprocessImage ->
// runInference -> interpretResult -> récupération de la description,
// et expose les états loading/error/result au composant appelant.

import { useCallback, useState } from 'react';
import { preprocessImage } from '@/ai/preprocessImage';
import { runInference } from '@/ai/runInference';
import { interpretResult, UNKNOWN_CLASS } from '@/ai/interpretResult';
import { getDishDescription, type DishDescription } from '@/ai/dishDescriptions';

export interface FoodScanResult {
  classId: string;
  confidence: number;
  description: DishDescription | null;
  isUnknown: boolean;
}

type ScanStatus = 'idle' | 'loading' | 'success' | 'error';

interface UseFoodScannerState {
  status: ScanStatus;
  result: FoodScanResult | null;
  error: string | null;
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
      const input = await preprocessImage(imageUri);
      const scores = await runInference(input);
      const { classe, confiance } = interpretResult(scores);
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
