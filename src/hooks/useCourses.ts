// hooks/useCourses.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Course } from "@/types/course";

export function useCourses() {
  return useQuery<Course[]>({
    queryKey: ["courses"],
    queryFn: () => api.get<Course[]>("courses"),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useCourse(courseId: string | string[] | undefined) {
  const id = Array.isArray(courseId) ? courseId[0] : courseId;

  return useQuery<Course>({
    queryKey: ["course", id],
    queryFn: () => api.get<Course>(`courses/${id}`),
    enabled: !!id,
  });
}

// Mutation exemplo: Marcar aula como assistida
export function useMarkLessonAsWatched() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ lessonId }: { lessonId: string }) =>
      api.post(`/lessons/${lessonId}/watch`, {}),

    onSuccess: (_, { lessonId }) => {
      queryClient.invalidateQueries({ queryKey: ["course"] });
      queryClient.invalidateQueries({ queryKey: ["progress"] });
    },
  });
}
