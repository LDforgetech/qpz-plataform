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
export function useCompleteLesson() {
  const queryClient = useQueryClient();

  return useMutation({
    // Agora precisamos do courseId e do lessonId para bater na rota nova
    mutationFn: ({
      courseId,
      lessonId,
    }: {
      courseId: string;
      lessonId: string | number;
    }) => api.post(`courses/${courseId}/lessons/${lessonId}/complete`, {}),

    onSuccess: (_, variables) => {
      // A MÁGICA ACONTECE AQUI:
      // Isso diz pro React Query: "O curso X mudou no banco. Vá buscar os dados novos agora!"
      // Ele vai rodar o useCourse() invisivelmente e a próxima aula vai voltar com is_unlocked: true
      queryClient.invalidateQueries({
        queryKey: ["course", variables.courseId],
      });
      queryClient.invalidateQueries({ queryKey: ["courses"] }); // Se quiser atualizar a listagem global tb
    },
  });
}
