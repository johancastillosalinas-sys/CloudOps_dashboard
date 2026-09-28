import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Cloud, Mail, Lock, Eye, EyeOff, Moon, Sun, LogIn, ShieldCheck, BarChart3, Globe2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../hooks/useDarkMode";

export default function Login() {
  const { login } = useAuth();
  const { isDark, toggle } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recordarme, setRecordarme] = useState(true);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const destino = (location.state as { from?: string })?.from ?? "/dashboard";

  const validarEmail = (valor: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!validarEmail(email)) {
      setError("Ingresa un correo electrónico válido.");
      return;
    }
    if (password.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    setCargando(true);
    await login(email, password, recordarme);
    setCargando(false);
    navigate(destino, { replace: true });
  };

  return (
    <div className="flex min-h-screen bg-bg dark:bg-slate-950">
      {/* Panel izquierdo (marca) */}
      <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden bg-gradient-to-br from-primary to-blue-800 p-10 text-white lg:flex">
        <div className="flex items-center gap-2">
          <Cloud size={28} />
          <div>
            <p className="text-lg font-bold leading-tight">CloudOps</p>
            <p className="text-xs text-blue-100">Dashboard</p>
          </div>
        </div>

        <div>
          <p className="mb-6 text-3xl font-bold leading-tight">
            Gestiona tu infraestructura cloud en un solo lugar
          </p>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-white/10 p-2">
                <BarChart3 size={18} />
              </span>
              <p className="text-sm text-blue-100">Costos y planificación con datos en tiempo real</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-white/10 p-2">
                <ShieldCheck size={18} />
              </span>
              <p className="text-sm text-blue-100">Postura de seguridad y cumplimiento normativo</p>
            </div>
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-white/10 p-2">
                <Globe2 size={18} />
              </span>
              <p className="text-sm text-blue-100">Infraestructura global multi-región</p>
            </div>
          </div>
        </div>

        <p className="text-xs text-blue-200">© {new Date().getFullYear()} CloudOps Dashboard · Cloud Foundations</p>
      </div>

      {/* Panel derecho (formulario) */}
      <div className="flex w-full flex-col items-center justify-center p-6 lg:w-1/2">
        <button
          onClick={toggle}
          className="fixed right-5 top-5 rounded-full border border-border p-2 text-textsec transition-colors hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Cambiar tema"
        >
          {isDark ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <div className="w-full max-w-sm">
          <div className="mb-8 flex flex-col items-center lg:items-start">
            <div className="mb-3 flex items-center gap-2 lg:hidden">
              <Cloud className="text-primary" size={26} />
              <p className="text-lg font-bold text-textmain dark:text-slate-100">CloudOps Dashboard</p>
            </div>
            <p className="text-2xl font-bold text-textmain dark:text-slate-100">Iniciar sesión</p>
            <p className="mt-1 text-sm text-textsec dark:text-slate-400">
              Ingresa tus credenciales para acceder al panel
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-textsec dark:text-slate-400">Correo electrónico</label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-textsec dark:text-slate-400" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tucorreo@ejemplo.com"
                  className="w-full rounded-lg border border-border bg-transparent py-2.5 pl-9 pr-3 text-sm text-textmain focus:border-primary focus:outline-none dark:border-slate-700 dark:text-slate-100"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-textsec dark:text-slate-400">Contraseña</label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-textsec dark:text-slate-400" size={16} />
                <input
                  type={mostrarPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full rounded-lg border border-border bg-transparent py-2.5 pl-9 pr-9 text-sm text-textmain focus:border-primary focus:outline-none dark:border-slate-700 dark:text-slate-100"
                />
                <button
                  type="button"
                  onClick={() => setMostrarPassword((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-textsec dark:text-slate-400"
                  aria-label="Mostrar contraseña"
                >
                  {mostrarPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-xs font-medium text-alert dark:bg-red-500/10">
                {error}
              </p>
            )}

            <label className="flex items-center gap-2 text-sm text-textsec dark:text-slate-400">
              <input
                type="checkbox"
                checked={recordarme}
                onChange={(e) => setRecordarme(e.target.checked)}
                className="rounded border-border text-primary focus:ring-primary dark:border-slate-700"
              />
              Recordarme en este dispositivo
            </label>

            <button
              type="submit"
              disabled={cargando}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
            >
              {cargando ? (
                "Verificando..."
              ) : (
                <>
                  <LogIn size={16} /> Iniciar sesión
                </>
              )}
            </button>
          </form>

          <p className="mt-6 rounded-lg bg-blue-50 p-3 text-center text-[11px] text-primary dark:bg-blue-500/10">
            Modo demostración: ingresa cualquier correo con formato válido y una contraseña de al menos 6
            caracteres. Aún no hay una base de datos conectada.
          </p>
        </div>
      </div>
    </div>
  );
}