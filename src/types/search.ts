// types/search.ts — Tipagens do endpoint de busca

export type SearchTrailResult = {
  id: number;
  title: string;
  description: string;
  tag: string;
  totalCourses: number;
  totalHours: number;
};

export type SearchCourseResult = {
  id: number;
  title: string;
  category: string;
  hours: number;
  level: string;
  trailTitle: string;
};

export type SearchResponse = {
  trails: SearchTrailResult[];
  courses: SearchCourseResult[];
  total: number;
};
