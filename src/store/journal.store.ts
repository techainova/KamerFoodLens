// src/store/journal.store.ts
import { create } from 'zustand';
import { usersService, type JournalEntry, type AddJournalEntryPayload } from '@/services/users.service';

function isSameDay(isoA: string, isoB: string): boolean {
  const a = new Date(isoA);
  const b = new Date(isoB);
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
}

function daysAgo(iso: string): number {
  const ms = Date.now() - new Date(iso).getTime();
  return Math.floor(ms / (24 * 60 * 60 * 1000));
}

export interface TopDish {
  dishName: string;
  count: number;
}

interface JournalState {
  entries:      JournalEntry[];
  isLoading:    boolean;
  fetchAll:     () => Promise<void>;
  addEntry:     (payload: AddJournalEntryPayload) => Promise<void>;
  removeEntry:  (entryId: string) => Promise<void>;
  getByDay:     (iso: string) => JournalEntry[];
  getToday:     () => JournalEntry[];
  getLastDays:  (days: number) => JournalEntry[];
  getKcalTotal: (entries: JournalEntry[]) => number;
  getTopDishes: (days: number, limit?: number) => TopDish[];
}

// These getters are only ever selected by reference today (`useJournalStore(s => s.getToday)`,
// invoked later), which is safe. But they're identical in shape to a bug found in
// events.store.ts where calling a filter/map/sort getter directly inside a selector
// (`s => s.getToday()`) made Zustand see a "new" array every render and infinite-loop the
// component. Memoizing here (by source array + args) preempts that if a future refactor
// ever selects the invoked result instead of the function.
function memoize1<A, R>(fn: (arg: A, entries: JournalEntry[]) => R) {
  let cache: { entries: JournalEntry[]; arg: A; result: R } | null = null;
  return (arg: A, entries: JournalEntry[]): R => {
    if (cache && cache.entries === entries && cache.arg === arg) return cache.result;
    const result = fn(arg, entries);
    cache = { entries, arg, result };
    return result;
  };
}

const memoizedGetByDay = memoize1((iso: string, entries: JournalEntry[]) =>
  entries.filter((e) => isSameDay(e.date, iso)));

const memoizedGetLastDays = memoize1((days: number, entries: JournalEntry[]) =>
  entries.filter((e) => daysAgo(e.date) < days));

let topDishesCache: { entries: JournalEntry[]; days: number; limit: number; result: TopDish[] } | null = null;

export const useJournalStore = create<JournalState>((set, get) => ({
  entries: [],
  isLoading: false,

  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const entries = await usersService.getFoodJournal();
      set({ entries });
    } finally {
      set({ isLoading: false });
    }
  },

  addEntry: async (payload) => {
    const created = await usersService.addJournalEntry(payload);
    set((s) => ({ entries: [created, ...s.entries] }));
  },

  removeEntry: async (entryId) => {
    const previous = get().entries;
    set((s) => ({ entries: s.entries.filter((e) => e.id !== entryId) }));
    try {
      await usersService.deleteJournalEntry(entryId);
    } catch (err) {
      set({ entries: previous });
      throw err;
    }
  },

  getByDay: (iso) => memoizedGetByDay(iso, get().entries),

  // .toDateString() (day granularity) rather than .toISOString() (millisecond granularity)
  // so repeated calls within the same day hit the memoized cache instead of missing every time.
  getToday: () => memoizedGetByDay(new Date().toDateString(), get().entries),

  getLastDays: (days) => memoizedGetLastDays(days, get().entries),

  getKcalTotal: (entries) => entries.reduce((sum, e) => sum + (e.nutritionFacts?.calories ?? 0), 0),

  getTopDishes: (days, limit = 5) => {
    const entries = get().entries;
    if (topDishesCache && topDishesCache.entries === entries && topDishesCache.days === days && topDishesCache.limit === limit) {
      return topDishesCache.result;
    }
    const counts = new Map<string, number>();
    for (const entry of memoizedGetLastDays(days, entries)) {
      counts.set(entry.dishName, (counts.get(entry.dishName) ?? 0) + 1);
    }
    const result = [...counts.entries()]
      .map(([dishName, count]) => ({ dishName, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, limit);
    topDishesCache = { entries, days, limit, result };
    return result;
  },
}));

export interface JournalDayGroup {
  dayKey:    string; // toDateString() of the day — stable identifier for navigation params
  dateLabel: string; // "Aujourd'hui" / "Hier" / "3 août"
  isToday:   boolean;
  entries:   JournalEntry[]; // chronological, oldest first (mirrors story playback order)
}

function formatDayLabel(dayKey: string): string {
  const day = new Date(dayKey);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  if (day.toDateString() === today.toDateString()) return "Aujourd'hui";
  if (day.toDateString() === yesterday.toDateString()) return 'Hier';
  return day.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
}

// Groups journal entries by calendar day — the same "author → their stories" grouping
// buildStoryGroups() does for community stories, but grouped by day instead of by user,
// so the food journal can be browsed with the same horizontal-ribbon + full-screen-viewer
// pattern as the app's Instagram-style Stories feature.
export function buildJournalDayGroups(entries: JournalEntry[]): JournalDayGroup[] {
  const order: string[] = [];
  const byDay = new Map<string, JournalEntry[]>();

  for (const entry of [...entries].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())) {
    const dayKey = new Date(entry.date).toDateString();
    if (!byDay.has(dayKey)) {
      byDay.set(dayKey, []);
      order.push(dayKey);
    }
    byDay.get(dayKey)!.push(entry);
  }

  const todayKey = new Date().toDateString();
  return order
    .map((dayKey) => ({
      dayKey,
      dateLabel: formatDayLabel(dayKey),
      isToday: dayKey === todayKey,
      entries: byDay.get(dayKey)!,
    }))
    .reverse(); // most recent day first, matching the ribbon's left-to-right recency order
}
