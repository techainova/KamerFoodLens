// src/hooks/useScanResult.ts
// Logique résultat scan IA — chargement + actions post-scan

import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@tanstack/react-query';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { RouteProp } from '@react-navigation/native';
import type { ScannerStackParams } from '@/navigation/types';
import apiClient from '@/services/api.client';

type Nav   = NativeStackNavigationProp<ScannerStackParams, 'Result'>;
type Route = RouteProp<ScannerStackParams, 'Result'>;

export interface ScanResultData {
  scanId:       string;
  dishName:     string;
  dishNameEN:   string;
  region:       string;
  confidence:   number;          // 0-100
  imageUrl?:    string;
  duration:     number;          // minutes
  cookType:     string;
  spiceLevel:   1 | 2 | 3;
  story:        string;
  similarDishes: { id: string; name: string }[];
}

async function fetchScanResult(scanId: string): Promise<ScanResultData> {
  const { data } = await apiClient.get(`/scan/result/${scanId}`);
  return data;
}

export function useScanResult() {
  const navigation = useNavigation<Nav>();
  const route      = useRoute<Route>();
  const { scanId } = route.params;

  const result = useQuery({
    queryKey: ['scanResult', scanId],
    queryFn:  () => fetchScanResult(scanId),
  });

  function goRecipe() {
    if (result.data) {
      navigation.navigate('Recipe', { dishId: result.data.scanId });
    }
  }

  function goRestaurants() {
    navigation.navigate('MapScreen' as any);
  }

  function share() {
    // TODO : expo-sharing Phase 5
  }

  function save() {
    // TODO : favoris Phase 5
  }

  return { result, scanId, goRecipe, goRestaurants, share, save };
}
