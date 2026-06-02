// types/profile.ts — Tipagens do endpoint de perfil diagnóstico

export type ProfileScores = Record<string, number>;

export type ProfileGroups = {
  [group: string]: ProfileScores;
};

export type ProfileGap = {
  group: string;
  type: string;
  score: number;
};

export type RecommendedCourse = {
  id: number;
  title: string;
  description: string;
  cover_url: string;
  addresses_gaps: string[];
  order: number;
};

export type ProfileResponse = {
  profile: ProfileGroups;
  gaps: ProfileGap[];
  recommended_path: RecommendedCourse[];
};
