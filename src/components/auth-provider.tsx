"use client";

import { useAuth } from "@clerk/nextjs";
import { registerGetToken } from "@/lib/api";

/**
 * AuthProvider — Ponte entre Clerk e o API client.
 *
 * Registra getToken() do Clerk no singleton da API de forma síncrona
 * durante o render, garantindo que o token esteja disponível ANTES
 * de qualquer queryFn do React Query disparar.
 *
 * Nenhum hook ou componente precisa se preocupar com tokens;
 * toda requisição via `api.get`, `api.post`, etc. já será autenticada.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getToken } = useAuth();

  // Registro síncrono — seguro pois getToken é uma referência estável.
  // Isso garante que _getToken já existe quando os filhos montam e
  // disparam suas queries, evitando a race condition do useEffect.
  registerGetToken(getToken);

  return <>{children}</>;
}
