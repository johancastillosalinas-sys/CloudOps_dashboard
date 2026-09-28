import { createContext, useContext, useState, ReactNode } from "react";

interface AuthContextType {
  isAuthenticated: boolean;
  email: string | null;
  login: (email: string, password: string, recordarme: boolean) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);
const KEY = "auth_session";

function leerSesion(): { email: string } | null {
  const local = localStorage.getItem(KEY);
  if (local) return JSON.parse(local);
  const sesion = sessionStorage.getItem(KEY);
  if (sesion) return JSON.parse(sesion);
  return null;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [email, setEmail] = useState<string | null>(() => leerSesion()?.email ?? null);

  // NOTA: esto es un login simulado (sin backend real). Cuando conectes una
  // base de datos, reemplaza el contenido de esta función por tu llamada real
  // a la API de autenticación.
  const login = async (correo: string, _password: string, recordarme: boolean) => {
    await new Promise((resolve) => setTimeout(resolve, 600)); // simula latencia de red
    const data = JSON.stringify({ email: correo });
    if (recordarme) {
      localStorage.setItem(KEY, data);
    } else {
      sessionStorage.setItem(KEY, data);
    }
    setEmail(correo);
  };

  const logout = () => {
    localStorage.removeItem(KEY);
    sessionStorage.removeItem(KEY);
    setEmail(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!email, email, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}