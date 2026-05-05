// lib/api.ts  ou  src/lib/api.ts
const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "";

export const api = {
  get: async <T>(url: string, config?: RequestInit): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...config,
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`Erro ${response.status}: ${response.statusText}`);
    }

    return response.json();
  },

  post: async <T>(url: string, body: any, config?: RequestInit): Promise<T> => {
    const response = await fetch(`${BASE_URL}${url}`, {
      ...config,
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...config?.headers,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) throw new Error("Erro na requisição");
    return response.json();
  },

  // put, delete, patch...
};
