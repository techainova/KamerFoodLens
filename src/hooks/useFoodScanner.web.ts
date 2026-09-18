// src/hooks/useFoodScanner.web.ts
// Variante web : le modèle TFLite embarqué (Nitro/natif) est indisponible sur
// navigateur, donc il n'y a pas de fallback IA locale possible ici (contrairement
// à useFoodScanner.ts sur mobile). L'appel API backend, lui, n'a rien de natif —
// on l'utilise réellement, avec un dernier recours simulé + synchronisé UNIQUEMENT
// si le service IA distant est injoignable, pour ne jamais bloquer le flux de test.

import { useCallback, useState } from 'react';
import { getDishDescription } from '@/ai/dishDescriptions';
import { UNKNOWN_CLASS } from '@/ai/interpretResult';
import { scannerService } from '@/services/scanner.service';
import { readUriAsBase64 as imageUriToBase64 } from '@/utils/readUriAsBase64';
import type { FoodScanResult } from './useFoodScanner';

type ScanStatus = 'idle' | 'loading' | 'success' | 'error';

export function useFoodScanner() {
  const [status, setStatus] = useState<ScanStatus>('idle');
  const [result, setResult] = useState<FoodScanResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const scanImage = useCallback(async (imageUri: string): Promise<FoodScanResult> => {
    setStatus('loading');
    setError(null);
    try {
      const imageBase64 = await imageUriToBase64(imageUri);

      try {
        const apiResult = await scannerService.analyzeImage({ imageBase64, mimeType: 'image/jpeg' });
        const success: FoodScanResult = {
          classId: apiResult.classId,
          confidence: apiResult.confidence,
          description: apiResult.description ?? getDishDescription(apiResult.classId),
          isUnknown: apiResult.confidence < 0.6,
          scanId: apiResult.scanId,
        };
        setResult(success);
        setStatus('success');
        return success;
      } catch (apiErr) {
        if (__DEV__) {
          console.warn('[KFL][useFoodScanner.web] API backend indisponible, aucun modèle local possible sur web :', apiErr);
        }
      }

      // Aucune IA embarquée disponible sur navigateur pour deviner un plat — on
      // renvoie honnêtement "non reconnu" plutôt qu'une supposition arbitraire,
      // tout en synchronisant l'événement de scan (historique) côté backend.
      let scanId: string | undefined;
      try {
        const synced = await scannerService.analyzeImage({
          imageBase64, mimeType: 'image/jpeg', localClassId: UNKNOWN_CLASS, localConfidence: 0,
        });
        scanId = synced.scanId;
      } catch (syncErr) {
        if (__DEV__) {
          console.warn('[KFL][useFoodScanner.web] synchronisation du résultat de secours a échoué :', syncErr);
        }
      }

      const fallback: FoodScanResult = {
        classId: UNKNOWN_CLASS,
        confidence: 0,
        description: null,
        isUnknown: true,
        scanId,
      };
      setResult(fallback);
      setStatus('success');
      return fallback;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Erreur inconnue lors du scan';
      setError(message);
      setStatus('error');
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setStatus('idle');
    setResult(null);
    setError(null);
  }, []);

  return { status, result, error, isLoading: status === 'loading', scanImage, reset };
}
