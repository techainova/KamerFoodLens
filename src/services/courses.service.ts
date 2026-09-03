// src/services/courses.service.ts
import apiClient from './api.client';
import { ENDPOINTS } from './config';

export type CourseLevel = 'beginner' | 'intermediate' | 'advanced';

export interface Course {
  id: string;
  title: string;
  description: string | null;
  imageUrl: string | null;
  instructorId: string;
  instructorName: string;
  instructorAvatar: string | null;
  instructorBio: string | null;
  level: CourseLevel;
  isCertified: boolean;
  priceXAF: number;
  isFree: boolean;
  lessonsCount: number;
  durationMin: number;
  studentsCount: number;
  createdAt: string;
}

export interface MyCourse extends Course {
  progressPct: number;
  completedLessons: number;
}

export interface CourseLesson {
  id: string;
  title: string;
  videoUrl: string | null;
  duration: number | null;
  order: number;
}

export interface CourseSection {
  sectionTitle: string;
  lessons: CourseLesson[];
}

export interface CourseDetail extends Course {
  sections: CourseSection[];
}

export const coursesService = {
  async getList(page = 1): Promise<{ items: Course[]; total: number; page: number }> {
    const { data } = await apiClient.get(ENDPOINTS.COURSES, { params: { page } });
    return data;
  },

  async getDetail(courseId: string): Promise<CourseDetail> {
    const { data } = await apiClient.get<CourseDetail>(`${ENDPOINTS.COURSE_DETAIL}/${courseId}`);
    return data;
  },

  async getMyCourses(): Promise<MyCourse[]> {
    const { data } = await apiClient.get<MyCourse[]>(`${ENDPOINTS.COURSES}/my`);
    return data;
  },

  async enroll(courseId: string): Promise<{ id: string }> {
    const { data } = await apiClient.post(`${ENDPOINTS.COURSE_ENROLL}/${courseId}`);
    return data;
  },

  async getProgress(courseId: string): Promise<{ completedLessonIds: string[] }> {
    const { data } = await apiClient.get(`${ENDPOINTS.COURSE_PROGRESS}/${courseId}/progress`);
    return data;
  },

  async completeLesson(courseId: string, lessonId: string): Promise<void> {
    await apiClient.patch(`${ENDPOINTS.COURSES}/${courseId}/lessons/${lessonId}/complete`);
  },
};
