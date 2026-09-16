// src/services/messages.service.ts
import apiClient from './api.client';
import { ENDPOINTS } from './config';

export interface ConversationParticipant {
  id: string;
  name: string;
  avatar?: string;
  role: 'standard' | 'pro' | 'admin';
}

export interface KflMessage {
  id: string;
  conversationId: string;
  senderId: string;
  text: string;
  isRead: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  otherUser: ConversationParticipant;
  lastMessage?: { text: string; senderId: string; createdAt: string };
  unreadCount: number;
  updatedAt: string;
}

export interface ConversationDetail extends Conversation {
  messages: KflMessage[];
  total: number;
  page: number;
}

export const messagesService = {
  async listConversations(): Promise<Conversation[]> {
    const { data } = await apiClient.get<Conversation[]>(ENDPOINTS.CONVERSATIONS);
    return data;
  },

  async getOrCreateConversation(recipientId: string): Promise<Conversation> {
    const { data } = await apiClient.post<Conversation>(ENDPOINTS.CONVERSATIONS, { recipientId });
    return data;
  },

  async getConversation(conversationId: string, page = 1): Promise<ConversationDetail> {
    const { data } = await apiClient.get<ConversationDetail>(
      `${ENDPOINTS.CONVERSATION_DETAIL}/${conversationId}`,
      { params: { page } },
    );
    return data;
  },

  async sendMessage(conversationId: string, text: string): Promise<KflMessage> {
    const { data } = await apiClient.post<KflMessage>(
      `${ENDPOINTS.CONVERSATION_DETAIL}/${conversationId}/messages`,
      { text },
    );
    return data;
  },

  async markRead(conversationId: string): Promise<void> {
    await apiClient.patch(`${ENDPOINTS.CONVERSATION_READ}/${conversationId}/read`);
  },
};
