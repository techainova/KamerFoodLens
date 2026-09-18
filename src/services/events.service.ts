// src/services/events.service.ts
import apiClient from './api.client';
import { ENDPOINTS } from './config';

export interface KflEvent {
  id: string;
  title: string;
  category: string;
  description: string;
  date: string;
  time: string;
  location: string;
  city: string;
  price: number;
  isFree: boolean;
  maxAttendees: number;
  registeredCount: number;
  organizer: string;
  tags: string[];
  startAt: string;
  endAt: string;
  isOnline: boolean;
  streamUrl?: string;
  imageUrl?: string;
}

export interface CreateEventPayload {
  title: string;
  description?: string;
  category?: string;
  imageUrl?: string;
  location?: string;
  city?: string;
  tags?: string[];
  isOnline?: boolean;
  streamUrl?: string;
  startAt: string;
  endAt: string;
  priceXAF?: number;
  maxSeats?: number;
}

export const eventsService = {
  async create(payload: CreateEventPayload): Promise<KflEvent> {
    const { data } = await apiClient.post<KflEvent>(ENDPOINTS.EVENTS, payload);
    return data;
  },

  async getList(params?: { category?: string; page?: number }): Promise<KflEvent[]> {
    const { data } = await apiClient.get<KflEvent[]>(ENDPOINTS.EVENTS, { params });
    return data;
  },

  async getDetail(eventId: string): Promise<KflEvent> {
    const { data } = await apiClient.get<KflEvent>(`${ENDPOINTS.EVENT_DETAIL}/${eventId}`);
    return data;
  },

  async register(eventId: string): Promise<{ message: string }> {
    const { data } = await apiClient.post(`${ENDPOINTS.EVENT_REGISTER}/${eventId}/register`);
    return data;
  },

  async unregister(eventId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete(`${ENDPOINTS.EVENT_UNREGISTER}/${eventId}/register`);
    return data;
  },

  async getMyRegistrations(): Promise<KflEvent[]> {
    const { data } = await apiClient.get<KflEvent[]>(`${ENDPOINTS.EVENTS}/my`);
    return data;
  },

  async getManaged(): Promise<KflEvent[]> {
    const { data } = await apiClient.get<KflEvent[]>(`${ENDPOINTS.EVENTS}/managed`);
    return data;
  },

  async remove(eventId: string): Promise<{ message: string }> {
    const { data } = await apiClient.delete(`${ENDPOINTS.EVENTS}/${eventId}`);
    return data;
  },
};
