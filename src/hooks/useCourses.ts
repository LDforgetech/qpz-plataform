// hooks/useCourses.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";

export function useCourses() {
  return useQuery({
    queryKey: ["courses"],
    queryFn: () => api.get("courses"),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}

export function useCourse(courseId: string) {
  return useQuery({
    queryKey: ["course", courseId],
    queryFn: () => api.get(`courses/${courseId}`),
    enabled: !!courseId,
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
