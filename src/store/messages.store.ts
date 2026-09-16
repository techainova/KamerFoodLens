// src/store/messages.store.ts
import { create } from 'zustand';
import {
  messagesService,
  type Conversation,
  type KflMessage,
} from '@/services/messages.service';

interface MessagesState {
  conversations: Conversation[];
  isLoading: boolean;
  activeMessages: Record<string, KflMessage[]>;
  fetchConversations: () => Promise<void>;
  openConversation: (recipientId: string) => Promise<Conversation>;
  fetchMessages: (conversationId: string) => Promise<void>;
  sendMessage: (conversationId: string, text: string) => Promise<void>;
  markRead: (conversationId: string) => Promise<void>;
  // Appelé sur réception de l'événement socket 'message:new'.
  receiveMessage: (message: KflMessage) => void;
  totalUnread: () => number;
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  conversations: [],
  isLoading: false,
  activeMessages: {},

  fetchConversations: async () => {
    set({ isLoading: true });
    try {
      const conversations = await messagesService.listConversations();
      set({ conversations });
    } finally {
      set({ isLoading: false });
    }
  },

  openConversation: async (recipientId) => {
    const conversation = await messagesService.getOrCreateConversation(recipientId);
    set((s) => ({
      conversations: s.conversations.some((c) => c.id === conversation.id)
        ? s.conversations
        : [conversation, ...s.conversations],
    }));
    return conversation;
  },

  fetchMessages: async (conversationId) => {
    const detail = await messagesService.getConversation(conversationId);
    set((s) => ({ activeMessages: { ...s.activeMessages, [conversationId]: detail.messages } }));
  },

  sendMessage: async (conversationId, text) => {
    const sent = await messagesService.sendMessage(conversationId, text);
    set((s) => ({
      activeMessages: {
        ...s.activeMessages,
        [conversationId]: [...(s.activeMessages[conversationId] ?? []), sent],
      },
      conversations: s.conversations.map((c) =>
        c.id === conversationId
          ? { ...c, lastMessage: { text: sent.text, senderId: sent.senderId, createdAt: sent.createdAt }, updatedAt: sent.createdAt }
          : c,
      ),
    }));
  },

  markRead: async (conversationId) => {
    await messagesService.markRead(conversationId);
    set((s) => ({
      conversations: s.conversations.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c)),
    }));
  },

  receiveMessage: (message) => set((s) => {
    const existing = s.activeMessages[message.conversationId] ?? [];
    const alreadyHave = existing.some((m) => m.id === message.id);
    const conversationKnown = s.conversations.some((c) => c.id === message.conversationId);

    return {
      activeMessages: alreadyHave
        ? s.activeMessages
        : { ...s.activeMessages, [message.conversationId]: [...existing, message] },
      conversations: conversationKnown
        ? s.conversations.map((c) => c.id === message.conversationId
          ? {
              ...c,
              lastMessage: { text: message.text, senderId: message.senderId, createdAt: message.createdAt },
              unreadCount: c.unreadCount + 1,
              updatedAt: message.createdAt,
            }
          : c)
        : s.conversations, // conversation pas encore chargée localement — le prochain fetchConversations() la ramènera
    };
  }),

  totalUnread: () => get().conversations.reduce((sum, c) => sum + c.unreadCount, 0),
}));
