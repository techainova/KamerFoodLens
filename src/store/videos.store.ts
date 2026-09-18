// src/store/videos.store.ts
import { create } from 'zustand';
import { videosService, type VideoPost, type CreateVideoPayload } from '@/services/videos.service';
import { useAuthStore } from '@/store/auth.store';

interface VideosState {
  videos: VideoPost[];
  isLoading: boolean;
  page: number;
  hasMore: boolean;
  fetchFirstPage: () => Promise<void>;
  fetchNextPage: () => Promise<void>;
  toggleLike: (videoId: string) => Promise<void>;
  addComment: (videoId: string, text: string) => Promise<void>;
  publish: (payload: CreateVideoPayload) => Promise<VideoPost>;
  registerView: (videoId: string) => void;
}

export const useVideosStore = create<VideosState>((set, get) => ({
  videos: [],
  isLoading: false,
  page: 0,
  hasMore: true,

  fetchFirstPage: async () => {
    set({ isLoading: true });
    try {
      const { items } = await videosService.getFeed(1);
      set({ videos: items, page: 1, hasMore: items.length > 0 });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchNextPage: async () => {
    const { page, hasMore, isLoading } = get();
    if (!hasMore || isLoading) return;
    set({ isLoading: true });
    try {
      const nextPage = page + 1;
      const { items } = await videosService.getFeed(nextPage);
      set((s) => ({ videos: [...s.videos, ...items], page: nextPage, hasMore: items.length > 0 }));
    } finally {
      set({ isLoading: false });
    }
  },

  toggleLike: async (videoId) => {
    const myId = useAuthStore.getState().user?.id;
    if (!myId) return;
    const previous = get().videos;

    set((s) => ({
      videos: s.videos.map((v) => v.id === videoId
        ? { ...v, likes: v.likes.includes(myId) ? v.likes.filter((id) => id !== myId) : [...v.likes, myId] }
        : v),
    }));

    try {
      const updated = await videosService.like(videoId);
      set((s) => ({ videos: s.videos.map((v) => v.id === videoId ? updated : v) }));
    } catch (err) {
      set({ videos: previous });
      throw err;
    }
  },

  addComment: async (videoId, text) => {
    const updated = await videosService.comment(videoId, text);
    set((s) => ({ videos: s.videos.map((v) => v.id === videoId ? updated : v) }));
  },

  publish: async (payload) => {
    const created = await videosService.create(payload);
    set((s) => ({ videos: [created, ...s.videos] }));
    return created;
  },

  registerView: (videoId) => {
    void videosService.registerView(videoId).catch(() => {});
  },
}));
