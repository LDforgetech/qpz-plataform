import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Trail } from "@/types/trail";

export function useTrails() {
  return useQuery<Trail[]>({
    queryKey: ["trails"],
    queryFn: () => api.get<Trail[]>("learning-paths"),
    staleTime: 10 * 60 * 1000, // 10 minutos
  });
}

export function useTrail(slug: string | string[] | undefined) {
  const resolvedSlug = Array.isArray(slug) ? slug[0] : slug;

  return useQuery<Trail>({
    queryKey: ["trail", resolvedSlug],
    queryFn: () => api.get<Trail>(`learning-paths/${resolvedSlug}`),
    enabled: !!resolvedSlug,
  });
}
