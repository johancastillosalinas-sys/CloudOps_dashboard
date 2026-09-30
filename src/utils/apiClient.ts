const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

interface ApiOptions extends RequestInit {
  body?: any;
}

/**
 * Envoltorio de fetch: agrega automáticamente la URL base del backend,
 * el token de sesión (si existe), y convierte errores del backend en
 * excepciones de JavaScript normales, fáciles de atrapar con try/catch.
 */
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