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
      Accept: "application/json",
      ...auth,
      ...config?.headers,
    },
  });

  if (!response.ok) {
    let msg = `Erro ${response.status}: ${response.statusText}`;
    try {
      const errData = await response.json();
      if (errData.message) msg = errData.message;
      else if (errData.error) msg = errData.error;

      if (errData.errors) {
        const firstError = Object.values(errData.errors)[0];
        if (Array.isArray(firstError)) msg = firstError[0];
      }
    } catch {}
    if (!response.ok) {
      let body: any = null;

      try {
        body = await response.json();
      } catch {}

      const error = new Error(
        body?.message ?? body?.error ?? `Erro ${response.status}`,
      ) as Error & {
        status: number;
        data?: any;
      };

      error.status = response.status;
      error.data = body;

      throw error;
    }
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

// ── Server-side fetch ───────────────────────────────────────────────
// Para uso em layouts e Server Components onde o AuthProvider não está
// disponível. O token JWT deve ser passado explicitamente.
export async function serverFetch<T>(
  url: string,
  token: string,
  config?: RequestInit,
): Promise<T> {
  const response = await fetch(`${BASE_URL}${url}`, {
    ...config,
    method: config?.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      Authorization: `Bearer ${token}`,
      ...config?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(`Erro ${response.status}: ${response.statusText}`);
  }

  return response.json();
}
