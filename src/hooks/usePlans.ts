import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Plan } from "@/types/subscription";

/**
 * GET /plans — Retorna a lista de planos disponíveis no backend.
 * Cacheado por 5 minutos, já que planos não mudam com frequência.
 */
export function usePlans() {
  return useQuery<Plan[]>({
    queryKey: ["plans"],
    queryFn: () => api.get<Plan[]>("plans"),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });
}
