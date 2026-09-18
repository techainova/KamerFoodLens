// src/services/videos.service.ts
import apiClient from './api.client';
import { ENDPOINTS } from './config';
import type { AuthorInfo } from './community.service';

export interface LinkedCourseView {
  id: string;
  title: string;
  priceXAF: number;
}

export interface LinkedEventView {
  id: string;
  title: string;
  priceXAF: number;
  startAt: string;
}

export interface VideoComment extends AuthorInfo {
  text: string;
  createdAt: string;
}

export interface VideoPost extends AuthorInfo {
  id: string;
  caption: string;
  videoUrl: string;
  thumbnailUrl?: string;
  durationSec: number;
  likes: string[];
  commentsCount: number;
  viewsCount: number;
  restaurantId?: string;
  linkedCourse?: LinkedCourseView;
  linkedEvent?: LinkedEventView;
  createdAt: string;
}

export interface CreateVideoPayload {
  videoBase64: string;
  mimeType?: string;
  caption: string;
  durationSec?: number;
  restaurantId?: string;
  linkedCourseId?: string;
  linkedEventId?: string;
}

export const videosService = {
  async getFeed(page = 1): Promise<{ items: VideoPost[]; total: number; page: number }> {
    const { data } = await apiClient.get(ENDPOINTS.VIDEOS, { params: { page } });
    return data;
  },

  async create(payload: CreateVideoPayload): Promise<VideoPost> {
    const { data } = await apiClient.post<VideoPost>(ENDPOINTS.VIDEOS, payload);
    return data;
  },

  async like(videoId: string): Promise<VideoPost> {
    const { data } = await apiClient.post<VideoPost>(`${ENDPOINTS.VIDEO_LIKE}/${videoId}/like`);
    return data;
  },

  async comment(videoId: string, text: string): Promise<VideoPost> {
    const { data } = await apiClient.post<VideoPost>(`${ENDPOINTS.VIDEO_COMMENT}/${videoId}/comments`, { text });
    return data;
  },

  async getComments(videoId: string): Promise<VideoComment[]> {
    const { data } = await apiClient.get<VideoComment[]>(`${ENDPOINTS.VIDEO_COMMENT}/${videoId}/comments`);
    return data;
  },

  async registerView(videoId: string): Promise<{ viewsCount: number }> {
    const { data } = await apiClient.post(`${ENDPOINTS.VIDEO_VIEW}/${videoId}/view`);
    return data;
  },
};
