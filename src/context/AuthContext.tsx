import { createContext, useContext, useState, ReactNode } from "react";
import { apiFetch } from "../utils/apiClient";

interface AuthContextType {
  isAuthenticated: boolean;
  email: string | null;
  login: (email: string, password: string, recordarme: boolean) => Promise<void>;
  register: (email: string, password: string, recordarme: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const KEY = "auth_token";
const KEY_EMAIL = "auth_email";

function leerSesion(): { token: string; email: string } | null {
  const token = localStorage.getItem(KEY) || sessionStorage.getItem(KEY);
  const email = localStorage.getItem(KEY_EMAIL) || sessionStorage.getItem(KEY_EMAIL);
  if (token && email) return { token, email };
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(() => leerSesion()?.email ?? null);

  const guardarSesion = (token: string, correo: string, recordarme: boolean) => {
    const storage = recordarme ? localStorage : sessionStorage;
    storage.setItem(KEY, token);
    storage.setItem(KEY_EMAIL, correo);
    setEmail(correo);
  };

  const login = async (correo: string, password: string, recordarme: boolean) => {
    const data = await apiFetch("/api/auth/login", {
      method: "POST",
      body: { email: correo, password },
    });
    guardarSesion(data.token, data.email, recordarme);
  };

  const register = async (correo: string, password: string, recordarme: boolean) => {
    const data = await apiFetch("/api/auth/register", {
      method: "POST",
      body: { email: correo, password },
    });
    guardarSesion(data.token, data.email, recordarme);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    localStorage.removeItem(KEY_EMAIL);
    sessionStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY_EMAIL);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!email, email, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}