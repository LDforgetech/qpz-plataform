// types/course.ts — Tipagens do endpoint de curso

export type CourseLesson = {
  id: number;
  title: string;
  duration_seconds: number;
  duration_formatted: string | null;
  bunny_video_url: string | null;
  is_unlocked: boolean;
  is_completed: boolean;
  order: number;
};

export type CourseModule = {
  id: number;
  title: string;
  total_duration_seconds: number;
  total_duration_formatted: string;
  order: number;
  lessons: CourseLesson[];
};

export type CourseProgress = {
  total_lessons: number;
  completed_lessons: number;
  percentage: number;
  certificate_url: string | null;
};

export type Course = {
  id: number;
  title: string;
  description: string;
  cover_url: string;
  progress: CourseProgress;
  intro_video_url: string;
  duration_seconds: number;
  duration_formatted: string;
  modules: CourseModule[];
};
