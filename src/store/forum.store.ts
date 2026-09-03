// src/store/forum.store.ts
import { create } from 'zustand';
import {
  communityService,
  type ForumThread,
  type ForumThreadDetail,
  type CreateThreadPayload,
} from '@/services/community.service';
import { useAuthStore } from '@/store/auth.store';

export const FORUM_CATEGORIES = ['Recettes', 'Restaurants', 'Ingrédients', 'Astuces', 'Événements', 'Général'];

interface ForumState {
  threads: ForumThread[];
  threadDetails: Record<string, ForumThreadDetail>;
  isLoading: boolean;
  fetchAll: () => Promise<void>;
  fetchThreadDetail: (threadId: string) => Promise<ForumThreadDetail>;
  createThread: (payload: CreateThreadPayload) => Promise<ForumThread>;
  addReply: (threadId: string, content: string) => Promise<void>;
  toggleThreadLike: (threadId: string) => Promise<void>;
  toggleReplyLike: (threadId: string, replyId: string) => Promise<void>;
}

export const useForumStore = create<ForumState>((set, get) => ({
  threads: [],
  threadDetails: {},
  isLoading: false,

  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const { items } = await communityService.getThreads();
      set({ threads: items });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchThreadDetail: async (threadId) => {
    const detail = await communityService.getThread(threadId);
    set((s) => ({ threadDetails: { ...s.threadDetails, [threadId]: detail } }));
    return detail;
  },

  createThread: async (payload) => {
    const created = await communityService.createThread(payload);
    set((s) => ({ threads: [created, ...s.threads] }));
    return created;
  },

  addReply: async (threadId, content) => {
    const reply = await communityService.replyThread(threadId, content);
    set((s) => {
      const detail = s.threadDetails[threadId];
      return {
        threads: s.threads.map((t) => t.id === threadId ? { ...t, replyCount: t.replyCount + 1 } : t),
        threadDetails: detail
          ? { ...s.threadDetails, [threadId]: { ...detail, replies: [...detail.replies, reply], replyCount: detail.replyCount + 1 } }
          : s.threadDetails,
      };
    });
  },

  toggleThreadLike: async (threadId) => {
    const myId = useAuthStore.getState().user?.id;
    if (!myId) return;
    const updated = await communityService.likeThread(threadId);
    set((s) => ({
      threads: s.threads.map((t) => t.id === threadId ? updated : t),
      threadDetails: s.threadDetails[threadId]
        ? { ...s.threadDetails, [threadId]: { ...s.threadDetails[threadId], likes: updated.likes } }
        : s.threadDetails,
    }));
  },

  toggleReplyLike: async (threadId, replyId) => {
    const updatedReply = await communityService.likeReply(threadId, replyId);
    set((s) => {
      const detail = s.threadDetails[threadId];
      if (!detail) return s;
      return {
        threadDetails: {
          ...s.threadDetails,
          [threadId]: {
            ...detail,
            replies: detail.replies.map((r) => r.id === replyId ? updatedReply : r),
          },
        },
      };
    });
  },
}));
