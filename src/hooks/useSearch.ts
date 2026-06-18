import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { SearchResponse } from "@/types/search";

const EMPTY_RESULTS: SearchResponse = { trails: [], courses: [], total: 0 };

/**
 * Busca rápida (autocomplete da search bar).
 * Só dispara quando `enabled` for true e `query` tiver >= 2 caracteres.
 */
export function useSearchAutocomplete(query: string, enabled: boolean) {
  return useQuery<SearchResponse>({
    queryKey: ["search", query],
    queryFn: async () => {
      if (!query || query.length < 2) return EMPTY_RESULTS;
      return api.get<SearchResponse>(
        `search?q=${encodeURIComponent(query)}`,
      );
    },
    enabled: enabled && query.length >= 2,
    staleTime: 5 * 60 * 1000, // 5 minutos
    placeholderData: keepPreviousData,
  });
}

/**
 * Busca completa (página de resultados /buscar?q=...).
 * Mantém os dados anteriores enquanto faz refetch para evitar flicker.
 */
export function useSearchResults(query: string) {
  return useQuery<SearchResponse>({
    queryKey: ["search-results", query],
    queryFn: async () => {
      if (!query || query.length < 2) return EMPTY_RESULTS;
      return api.get<SearchResponse>(
        `search?q=${encodeURIComponent(query)}`,
      );
    },
    enabled: query.length >= 2,
    staleTime: 5 * 60 * 1000,
    placeholderData: keepPreviousData,
  });
}
