// src/store/events.store.ts
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { eventsService, type KflEvent as KflEventDto } from '@/services/events.service';

const _mmkv = createMMKV({ id: 'kfl-events-store' });
const mmkvStorage = {
  setItem:    (key: string, value: string) => _mmkv.set(key, value),
  getItem:    (key: string) => _mmkv.getString(key) ?? null,
  removeItem: (key: string) => { _mmkv.remove(key); },
};

export interface KflEvent {
  id:              string;
  title:           string;
  category:        string;
  description:     string;
  date:            string;
  time:            string;
  location:        string;
  city:            string;
  price:           number;
  isFree:          boolean;
  maxAttendees:    number;
  registeredCount: number;
  isRegistered:    boolean;
  organizer:       string;
  tags:            string[];
  startAt:         string;
  endAt:           string;
  isOnline:        boolean;
}

function toStoreEvent(dto: KflEventDto, isRegistered: boolean): KflEvent {
  return {
    id: dto.id,
    title: dto.title,
    category: dto.category,
    description: dto.description,
    date: dto.date,
    time: dto.time,
    location: dto.location,
    city: dto.city,
    price: dto.price,
    isFree: dto.isFree,
    maxAttendees: dto.maxAttendees,
    registeredCount: dto.registeredCount,
    isRegistered,
    organizer: dto.organizer,
    tags: dto.tags,
    startAt: dto.startAt,
    endAt: dto.endAt,
    isOnline: dto.isOnline,
  };
}

interface EventsState {
  events:         KflEvent[];
  isLoading:      boolean;
  fetchAll:       () => Promise<void>;
  toggleRegister: (eventId: string) => Promise<void>;
  fetchById:      (eventId: string) => Promise<KflEvent | undefined>;
  getById:        (eventId: string) => KflEvent | undefined;
  getUpcoming:    () => KflEvent[];
  getRegistered:  () => KflEvent[];
}

// Memoized against the `events` array reference: `getUpcoming`/`getRegistered` are called
// directly inside component selectors (`useEventsStore(s => s.getUpcoming())`), so they must
// return a stable reference when `events` hasn't changed — otherwise Zustand sees a "new"
// value on every render and re-renders forever (Maximum update depth exceeded).
let upcomingCache: { source: KflEvent[]; result: KflEvent[] } | null = null;
let registeredCache: { source: KflEvent[]; result: KflEvent[] } | null = null;

export const useEventsStore = create<EventsState>()(
  persist(
    (set, get) => ({
      events: [],
      isLoading: false,

      fetchAll: async () => {
        set({ isLoading: true });
        try {
          const [list, mine] = await Promise.all([
            eventsService.getList(),
            eventsService.getMyRegistrations().catch(() => []),
          ]);
          const registeredIds = new Set(mine.map((e) => e.id));
          set({ events: list.map((dto) => toStoreEvent(dto, registeredIds.has(dto.id))) });
        } finally {
          set({ isLoading: false });
        }
      },

      fetchById: async (eventId) => {
        const existing = get().events.find((e) => e.id === eventId);
        if (existing) {
          return existing;
        }

        const [dto, mine] = await Promise.all([
          eventsService.getDetail(eventId),
          eventsService.getMyRegistrations().catch(() => []),
        ]);
        const isRegistered = mine.some((e) => e.id === eventId);
        const event = toStoreEvent(dto, isRegistered);
        set((s) => ({ events: [...s.events, event] }));
        return event;
      },

      toggleRegister: async (eventId) => {
        const event = get().events.find((e) => e.id === eventId);
        if (!event) return;
        const wasRegistered = event.isRegistered;

        set(s => ({
          events: s.events.map(e => e.id === eventId
            ? { ...e, isRegistered: !wasRegistered, registeredCount: wasRegistered ? e.registeredCount - 1 : e.registeredCount + 1 }
            : e),
        }));

        try {
          if (wasRegistered) {
            await eventsService.unregister(eventId);
          } else {
            await eventsService.register(eventId);
          }
        } catch (err) {
          // Revert optimistic update on failure
          set(s => ({
            events: s.events.map(e => e.id === eventId
              ? { ...e, isRegistered: wasRegistered, registeredCount: event.registeredCount }
              : e),
          }));
          throw err;
        }
      },

      getById: (id) => get().events.find(e => e.id === id),

      getUpcoming: () => {
        const events = get().events;
        if (upcomingCache?.source === events) return upcomingCache.result;
        const result = events.filter(e => new Date(e.date) >= new Date());
        upcomingCache = { source: events, result };
        return result;
      },

      getRegistered: () => {
        const events = get().events;
        if (registeredCache?.source === events) return registeredCache.result;
        const result = events.filter(e => e.isRegistered);
        registeredCache = { source: events, result };
        return result;
      },
    }),
    { name: 'kfl-events', storage: createJSONStorage(() => mmkvStorage), partialize: () => ({}) }
  )
);
