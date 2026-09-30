import { createContext, useContext, useState, ReactNode } from "react";

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

  // ⚡ MOCK TEMPORAL: Inicia sesión directamente sin consultar al backend
  const login = async (correo: string, _password: string, recordarme: boolean) => {
    const mockToken = "token_demo_local_12345";
    guardarSesion(mockToken, correo, recordarme);
  };

  // ⚡ MOCK TEMPORAL: Registra e ingresa directamente
  const register = async (correo: string, _password: string, recordarme: boolean) => {
    const mockToken = "token_demo_local_12345";
    guardarSesion(mockToken, correo, recordarme);
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