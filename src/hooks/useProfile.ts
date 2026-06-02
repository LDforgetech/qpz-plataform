import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { ProfileResponse } from "@/types/profile";

/**
 * GET profile — retorna o perfil do usuário se ele já respondeu o diagnóstico.
 * Se a API retornar 404 ou corpo vazio, `data` será `null`.
 */
export function useProfile() {
  return useQuery<ProfileResponse | null>({
    queryKey: ["profile"],
    queryFn: async () => {
      try {
        return await api.get<ProfileResponse>("profile");
      } catch {
        // Se o usuário nunca respondeu, a API pode retornar 404 ou vazio
        return null;
      }
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

/**
 * POST profile — envia respostas do diagnóstico e retorna o perfil calculado.
 * Invalida a query ["profile"] no sucesso para que `useProfile` reflita o novo estado.
 */
export function useSubmitProfile() {
  const queryClient = useQueryClient();

  return useMutation<ProfileResponse, Error, Record<string, unknown>>({
    mutationFn: (payload) => api.post<ProfileResponse>("profile", payload),

    onSuccess: (data) => {
      // Atualiza o cache diretamente com a resposta do POST
      queryClient.setQueryData(["profile"], data);
    },
  });
}
