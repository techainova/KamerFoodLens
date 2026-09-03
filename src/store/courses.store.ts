// src/store/courses.store.ts
import { create } from 'zustand';
import { coursesService, type Course, type CourseDetail, type MyCourse } from '@/services/courses.service';

interface CoursesState {
  courses: Course[];
  myCourses: MyCourse[];
  details: Record<string, CourseDetail>;
  completedLessonIds: Record<string, string[]>;
  isLoading: boolean;
  fetchAll: () => Promise<void>;
  fetchMyCourses: () => Promise<void>;
  fetchDetail: (courseId: string) => Promise<CourseDetail>;
  fetchProgress: (courseId: string) => Promise<void>;
  enroll: (courseId: string) => Promise<void>;
  completeLesson: (courseId: string, lessonId: string) => Promise<void>;
}

export const useCoursesStore = create<CoursesState>((set, get) => ({
  courses: [],
  myCourses: [],
  details: {},
  completedLessonIds: {},
  isLoading: false,

  fetchAll: async () => {
    set({ isLoading: true });
    try {
      const { items } = await coursesService.getList();
      set({ courses: items });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchMyCourses: async () => {
    const myCourses = await coursesService.getMyCourses();
    set({ myCourses });
  },

  fetchDetail: async (courseId) => {
    const detail = await coursesService.getDetail(courseId);
    set((s) => ({ details: { ...s.details, [courseId]: detail } }));
    return detail;
  },

  fetchProgress: async (courseId) => {
    const { completedLessonIds } = await coursesService.getProgress(courseId);
    set((s) => ({ completedLessonIds: { ...s.completedLessonIds, [courseId]: completedLessonIds } }));
  },

  enroll: async (courseId) => {
    await coursesService.enroll(courseId);
    await get().fetchMyCourses();
  },

  completeLesson: async (courseId, lessonId) => {
    await coursesService.completeLesson(courseId, lessonId);
    set((s) => {
      const existing = s.completedLessonIds[courseId] ?? [];
      if (existing.includes(lessonId)) return s;
      return { completedLessonIds: { ...s.completedLessonIds, [courseId]: [...existing, lessonId] } };
    });
    void get().fetchMyCourses();
  },
}));
