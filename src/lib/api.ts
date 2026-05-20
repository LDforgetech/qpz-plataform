// lib/api.ts — Singleton API client com injeção automática de JWT

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

// ── Token resolver ──────────────────────────────────────────────────
// Registrado uma única vez pelo AuthProvider.
// Toda requisição chama getToken() para obter o JWT fresco do Clerk.
type GetTokenFn = () => Promise<string | null>;
let _getToken: GetTokenFn | null = null;

export function registerGetToken(fn: GetTokenFn) {
  _getToken = fn;
}

// ── Helpers internos ────────────────────────────────────────────────
async function authHeaders(): Promise<Record<string, string>> {
  if (!_getToken) return {};
  const token = await _getToken();
  console.log(token);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(
  url: string,
  method: string,
  config?: RequestInit,
): Promise<T> {
  const auth = await authHeaders();

  const response = await fetch(`${BASE_URL}${url}`, {
    ...config,
    method,
    headers: {
      "Content-Type": "application/json",
      ...auth,
      ...config?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  return response.json();
}

// ── API pública ─────────────────────────────────────────────────────
export const api = {
  get: <T>(url: string, config?: RequestInit) => request<T>(url, "GET", config),

  post: <T>(url: string, body: unknown, config?: RequestInit) =>
    request<T>(url, "POST", { ...config, body: JSON.stringify(body) }),

  put: <T>(url: string, body: unknown, config?: RequestInit) =>
    request<T>(url, "PUT", { ...config, body: JSON.stringify(body) }),

  patch: <T>(url: string, body: unknown, config?: RequestInit) =>
    request<T>(url, "PATCH", { ...config, body: JSON.stringify(body) }),

  delete: <T>(url: string, config?: RequestInit) =>
    request<T>(url, "DELETE", config),
};
