// src/hooks/useFoodScanner.web.ts
// Stub web : TFLite natif indisponible sur le navigateur. Simule une
// détection "ndole" pour permettre de tester le flux d'upload sur le web.

import { useCallback, useState } from 'react';
import { getDishDescription } from '@/ai/dishDescriptions';
import type { FoodScanResult } from './useFoodScanner';

type ScanStatus = 'idle' | 'loading' | 'success' | 'error';

export function useFoodScanner() {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [result, setResult] = useState<FoodScanResult | null>(null);

  const scanImage = useCallback(async (_imageUri: string): Promise<FoodScanResult> => {
    setStatus('loading');
    await new Promise((r) => setTimeout(r, 800));
    const mocked: FoodScanResult = {
      classId: 'ndole',
      confidence: 0.87,
      description: getDishDescription('ndole'),
      isUnknown: false,
    };
    setResult(mocked);
    setStatus('success');
    return mocked;
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
  }, []);

  return { status, result, error: null, isLoading: status === 'loading', scanImage, reset };
}
