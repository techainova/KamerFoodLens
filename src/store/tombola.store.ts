// src/store/tombola.store.ts
import { create } from 'zustand';
import { gamesService, type Tombola, type TombolaTicket } from '@/services/games.service';

interface TombolaState {
  active: Tombola | null;
  myTickets: TombolaTicket[];
  isLoading: boolean;
  fetchActive: () => Promise<void>;
  fetchMyTickets: () => Promise<void>;
  buyTickets: (qty: number) => Promise<TombolaTicket[]>;
}

export const useTombolaStore = create<TombolaState>((set, get) => ({
  active: null,
  myTickets: [],
  isLoading: false,

  fetchActive: async () => {
    set({ isLoading: true });
    try {
      const active = await gamesService.getActiveTombola();
      set({ active });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyTickets: async () => {
    const active = get().active;
    if (!active) { set({ myTickets: [] }); return; }
    const myTickets = await gamesService.getMyTickets(active.id);
    set({ myTickets });
  },

  buyTickets: async (qty) => {
    const active = get().active;
    if (!active) throw new Error('No active tombola');
    const newTickets = await gamesService.buyTicket(active.id, qty);
    set((s) => ({
      myTickets: [...s.myTickets, ...newTickets],
      active: s.active ? { ...s.active, soldCount: s.active.soldCount + newTickets.length } : s.active,
    }));
    return newTickets;
  },
}));
