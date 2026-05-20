// types/trail.ts — Tipagens do endpoint de learning-paths (trilhas)

export type TrailCourse = {
  id: number;
  title: string;
  description: string;
  cover_url: string;
  order: number;
};

export type Trail = {
  id: number;
  title: string;
  slug: string;
  description: string;
  thumbnail: string;
  courses_count: number;
  courses: TrailCourse[];
};
