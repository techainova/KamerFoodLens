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

export type UpdateEventPayload = Partial<CreateEventPayload>;

export interface EventAttendee {
  registrationId: string;
  userId: string;
  name: string;
  avatar: string | null;
  phone: string | null;
  registeredAt: string;
  checkedInAt: string | null;
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

  async update(eventId: string, payload: UpdateEventPayload): Promise<KflEvent> {
    const { data } = await apiClient.patch<KflEvent>(`${ENDPOINTS.EVENTS}/${eventId}`, payload);
    return data;
  },

  async uploadImage(imageBase64: string, mimeType?: string): Promise<{ url: string }> {
    const { data } = await apiClient.post<{ url: string }>(`${ENDPOINTS.EVENTS}/upload-image`, { imageBase64, mimeType });
    return data;
  },

  async getAttendees(eventId: string): Promise<EventAttendee[]> {
    const { data } = await apiClient.get<EventAttendee[]>(`${ENDPOINTS.EVENTS}/${eventId}/attendees`);
    return data;
  },

  async notifyAttendees(eventId: string, title: string, body: string): Promise<{ notified: number }> {
    const { data } = await apiClient.post(`${ENDPOINTS.EVENTS}/${eventId}/notify`, { title, body });
    return data;
  },

  async checkInAttendee(eventId: string, registrationId: string): Promise<{ alreadyCheckedIn: boolean; attendeeName: string; checkedInAt: string }> {
    const { data } = await apiClient.post(`${ENDPOINTS.EVENTS}/${eventId}/checkin/${registrationId}`);
    return data;
  },
};
