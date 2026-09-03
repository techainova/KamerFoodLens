// src/services/scanner.service.ts
import apiClient from './api.client';
import { ENDPOINTS } from './config';
import type { DishDescription } from '@/ai/dishDescriptions';

export interface ScanImagePayload {
  imageBase64: string;
  mimeType?: string;
}

export interface ScanAudioPayload {
  audioBase64: string;
  mimeType?: string;
}

export interface ScanTextPayload {
  text: string;
}

export interface ScanApiResult {
  scanId: string;
  classId: string;
  dishName: string;
  dishNameEN: string;
  region: string;
  confidence: number;
  imageUrl?: string;
  description?: DishDescription;
}

export interface ScanHistoryItem {
  scanId: string;
  classId: string;
  dishName: string;
  confidence: number;
  imageUrl?: string;
  scannedAt: string;
}

export interface ScanDayGroup {
  dayKey:    string; // toDateString() — stable identifier for navigation params
  dateLabel: string; // "Aujourd'hui" / "Hier" / "3 août"
  isToday:   boolean;
  items:     ScanHistoryItem[]; // chronological, oldest first (mirrors story playback order)
}

function formatScanDayLabel(dayKey: string): string {
  const day = new Date(dayKey);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (day.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (day.toDateString() === yesterday.toDateString()) return 'Hier';
  return day.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

// Groups scan history by calendar day — same "author → their stories" grouping pattern as
// buildStoryGroups() (community stories) and buildJournalDayGroups() (food journal), so the
// scan history ("Historique") can be browsed with the same Instagram-style ribbon +
// full-screen-viewer pattern used elsewhere in the app.
export function buildScanDayGroups(items: ScanHistoryItem[]): ScanDayGroup[] {
  const order: string[] = [];
  const byDay = new Map<string, ScanHistoryItem[]>();

  for (const item of [...items].sort((a, b) => new Date(a.scannedAt).getTime() - new Date(b.scannedAt).getTime())) {
    const dayKey = new Date(item.scannedAt).toDateString();
    if (!byDay.has(dayKey)) {
      byDay.set(dayKey, []);
      order.push(dayKey);
    }
    byDay.get(dayKey)!.push(item);
  }

  const todayKey = new Date().toDateString();
  return order
    .map((dayKey) => ({
      dayKey,
      dateLabel: formatScanDayLabel(dayKey),
      isToday: dayKey === todayKey,
      items: byDay.get(dayKey)!,
    }))
    .reverse(); // most recent day first, matching the ribbon's left-to-right recency order
}

export const scannerService = {
  async analyzeImage(payload: ScanImagePayload): Promise<ScanApiResult> {
    const { data } = await apiClient.post<ScanApiResult>(ENDPOINTS.SCAN_IMAGE, payload);
    return data;
  },

  async analyzeAudio(payload: ScanAudioPayload): Promise<{ text: string; scanResult?: ScanApiResult }> {
    const { data } = await apiClient.post(ENDPOINTS.SCAN_AUDIO, payload);
    return data;
  },

  async analyzeText(payload: ScanTextPayload): Promise<ScanApiResult> {
    const { data } = await apiClient.post<ScanApiResult>(ENDPOINTS.SCAN_TEXT, payload);
    return data;
  },

  async getResult(scanId: string): Promise<ScanApiResult> {
    const { data } = await apiClient.get<ScanApiResult>(`${ENDPOINTS.SCAN_RESULT}/${scanId}`);
    return data;
  },

  async getHistory(page = 1, limit = 20): Promise<{ items: ScanHistoryItem[]; total: number }> {
    const { data } = await apiClient.get(ENDPOINTS.SCAN_HISTORY, { params: { page, limit } });
    return data;
  },

  async clearHistory(): Promise<{ deleted: number }> {
    const { data } = await apiClient.delete(ENDPOINTS.SCAN_HISTORY);
    return data;
  },
};
