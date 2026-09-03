// src/store/feed.store.ts
import { create } from 'zustand';
import { communityService, type FeedPost, type CreatePostPayload } from '@/services/community.service';
import { useAuthStore } from '@/store/auth.store';

interface FeedState {
  posts: FeedPost[];
  isLoading: boolean;
  fetchAll: () => Promise<void>;
  toggleLike: (postId: string) => Promise<void>;
  addComment: (postId: string, text: string) => Promise<void>;
  createPost: (payload: CreatePostPayload) => Promise<void>;
}

export const useFeedStore = create<FeedState>((set, get) => ({
  posts: [],
  isLoading: false,

  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const { items } = await communityService.getFeed();
      set({ posts: items });
    } finally {
      set({ isLoading: false });
    }
  },

  toggleLike: async (postId) => {
    const myId = useAuthStore.getState().user?.id;
    if (!myId) return;
    const previous = get().posts;

    set((s) => ({
      posts: s.posts.map((p) => p.id === postId
        ? { ...p, likes: p.likes.includes(myId) ? p.likes.filter((id) => id !== myId) : [...p.likes, myId] }
        : p),
    }));

    try {
      const updated = await communityService.likePost(postId);
      set((s) => ({ posts: s.posts.map((p) => p.id === postId ? updated : p) }));
    } catch (err) {
      set({ posts: previous });
      throw err;
    }
  },

  addComment: async (postId, text) => {
    const updated = await communityService.addComment(postId, text);
    set((s) => ({ posts: s.posts.map((p) => p.id === postId ? updated : p) }));
  },

  createPost: async (payload) => {
    const created = await communityService.createPost(payload);
    set((s) => ({ posts: [created, ...s.posts] }));
  },
}));
