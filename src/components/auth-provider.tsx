"use client";

import { useAuth } from "@clerk/nextjs";
import { useEffect } from "react";
import { registerGetToken } from "@/lib/api";

/**
 * AuthProvider — Ponte entre Clerk e o API client.
 *
 * Registra getToken() do Clerk no singleton da API uma única vez.
 * Deve envolver os filhos dentro do ClerkProvider e QueryProvider.
 *
 * Nenhum hook ou componente precisa se preocupar com tokens;
 * toda requisição via `api.get`, `api.post`, etc. já será autenticada.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { getToken, userId } = useAuth();

  console.log(userId);

  useEffect(() => {
    registerGetToken(getToken);
  }, [getToken]);

  return <>{children}</>;
}
