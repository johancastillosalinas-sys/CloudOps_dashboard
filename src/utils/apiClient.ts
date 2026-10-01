const API_URL = import.meta.env.VITE_API_URL ?? (import.meta.env.DEV ? "http://localhost:4000" : "");

interface ApiOptions extends RequestInit {
  body?: any;
}

export async function apiFetch(path: string, options: ApiOptions = {}) {
  const token = localStorage.getItem("auth_token") || sessionStorage.getItem("auth_token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data.error || "Ocurrió un error inesperado. Intenta de nuevo.");
  }

  return data;
}