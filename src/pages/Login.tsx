import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Cloud, Mail, Lock, Eye, EyeOff, Moon, Sun, LogIn, UserPlus, ShieldCheck, BarChart3, Globe2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useDarkMode } from "../hooks/useDarkMode";

export default function Login() {
  const { login, register } = useAuth();
  const { isDark, toggle } = useDarkMode();
  const navigate = useNavigate();
  const location = useLocation();

  const [modo, setModo] = useState<"login" | "registro">("login");
  const [haCambiado, setHaCambiado] = useState(false); // evita animar el contenido en la primera carga
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [recordarme, setRecordarme] = useState(true);
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState("");

  const destino = (location.state as { from?: string })?.from ?? "/dashboard";

  const validarEmail = (valor: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);

  const cambiarModo = (nuevo: "login" | "registro") => {
    setModo(nuevo);
    setHaCambiado(true);
    setError("");
  };

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
    try {
      if (modo === "login") {
        await login(email, password, recordarme);
      } else {
        await register(email, password, recordarme);
      }
      navigate(destino, { replace: true });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocurrió un error inesperado.");
    } finally {
      setCargando(false);
    }
  };

  const inputClase =
    "w-full rounded-lg border border-white/25 bg-slate-950/40 py-2.5 pl-9 text-sm text-white placeholder:text-white/50 transition-colors focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30";

  const caracteristicas = [
    { icono: BarChart3, texto: "Costos y planificación con datos en tiempo real" },
    { icono: ShieldCheck, texto: "Postura de seguridad y cumplimiento normativo" },
    { icono: Globe2, texto: "Infraestructura global multi-región" },
  ];

  // Al ir a "Crear cuenta" el contenido entra desde la derecha; al volver, desde la izquierda
  const animacionContenido = !haCambiado ? "" : modo === "registro" ? "form-in-right" : "form-in-left";

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900">
      <style>{`
        @keyframes loginIn { from { opacity: 0; transform: translateY(16px) scale(.98); } to { opacity: 1; transform: none; } }
        @keyframes formInRight { from { opacity: 0; transform: translateX(28px); } to { opacity: 1; transform: none; } }
        @keyframes formInLeft { from { opacity: 0; transform: translateX(-28px); } to { opacity: 1; transform: none; } }
        .login-in { animation: loginIn .6s cubic-bezier(.22, 1, .36, 1) both; }
        .form-in-right { animation: formInRight .4s cubic-bezier(.22, 1, .36, 1) both; }
        .form-in-left { animation: formInLeft .4s cubic-bezier(.22, 1, .36, 1) both; }
        .login-text { text-shadow: 0 1px 8px rgba(0, 0, 0, .6); }
        @media (prefers-reduced-motion: reduce) { .login-in, .form-in-right, .form-in-left { animation: none; } }
      `}</style>

      {/* Video de fondo (se oculta si el sistema pide reducir movimiento) */}
      <video
        className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
        src="/login-bg.mp4"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
        aria-hidden="true"
      />
      {/* Capas suaves para dar contraste sin tapar el video */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950/75 via-slate-950/35 to-slate-950/80" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(37,99,235,0.18),transparent_60%)]" />

      <div className="relative z-10 flex min-h-screen flex-col">
        {/* Barra superior */}
        <header className="flex items-center justify-between px-5 py-5 sm:px-8">
          <div className="flex items-center gap-2.5 text-white">
            <span className="rounded-xl bg-primary p-2 shadow-lg shadow-blue-500/30">
              <Cloud size={22} />
            </span>
            <div className="login-text leading-tight">
              <p className="text-base font-bold">CloudOps</p>
              <p className="text-[11px] text-blue-200">Dashboard</p>
            </div>
          </div>

          <button
            onClick={toggle}
            className="rounded-full border border-white/20 bg-black/30 p-2 text-white backdrop-blur transition-colors hover:bg-black/50"
            aria-label="Cambiar tema"
          >
            {isDark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
        </header>

        {/* Tarjeta central de vidrio transparente */}
        <main className="flex flex-1 items-center justify-center px-4 py-6">
          <div className="login-in w-full max-w-md overflow-hidden rounded-2xl border border-white/25 bg-slate-950/30 p-6 shadow-2xl shadow-black/40 backdrop-blur-xl sm:p-8">
            {/* Pestañas con indicador deslizante */}
            <div className="relative mb-6 flex rounded-lg border border-white/15 bg-slate-950/30 p-1">
              <span
                aria-hidden="true"
                className="absolute bottom-1 left-1 top-1 w-[calc(50%-4px)] rounded-md bg-primary shadow-lg shadow-blue-500/40"
                style={{
                  transform: `translateX(${modo === "login" ? "0%" : "100%"})`,
                  transition: "transform .35s cubic-bezier(.22, 1, .36, 1)",
                }}
              />
              <button
                type="button"
                onClick={() => cambiarModo("login")}
                className={`login-text relative z-10 flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                  modo === "login" ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                Iniciar sesión
              </button>
              <button
                type="button"
                onClick={() => cambiarModo("registro")}
                className={`login-text relative z-10 flex-1 rounded-md py-2 text-sm font-semibold transition-colors ${
                  modo === "registro" ? "text-white" : "text-white/70 hover:text-white"
                }`}
              >
                Crear cuenta
              </button>
            </div>

            {/* Contenido que se anima al cambiar de pestaña */}
            <div key={modo} className={animacionContenido}>
              <div className="mb-6 text-center">
                <p className="login-text text-2xl font-bold text-white">
                  {modo === "login" ? "Iniciar sesión" : "Crear cuenta"}
                </p>
                <p className="login-text mt-1 text-sm text-white/80">
                  {modo === "login"
                    ? "Ingresa tus credenciales para acceder al panel"
                    : "Regístrate para empezar a usar el dashboard"}
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="login-text text-sm font-medium text-white">Correo electrónico</label>
                  <div className="relative mt-1">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={16} />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="tucorreo@ejemplo.com"
                      className={`${inputClase} pr-3`}
                    />
                  </div>
                </div>

                <div>
                  <label className="login-text text-sm font-medium text-white">Contraseña</label>
                  <div className="relative mt-1">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-white/70" size={16} />
                    <input
                      type={mostrarPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className={`${inputClase} pr-9`}
                    />
                    <button
                      type="button"
                      onClick={() => setMostrarPassword((v) => !v)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-white/70 transition-colors hover:text-white"
                      aria-label="Mostrar contraseña"
                    >
                      {mostrarPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>

                {error && (
                  <p className="rounded-lg border border-red-400/40 bg-red-500/20 px-3 py-2 text-xs font-medium text-red-100">
                    {error}
                  </p>
                )}

                <label className="login-text flex items-center gap-2 text-sm text-white/90">
                  <input
                    type="checkbox"
                    checked={recordarme}
                    onChange={(e) => setRecordarme(e.target.checked)}
                    className="rounded border-white/40 bg-white/10 text-primary focus:ring-primary"
                  />
                  Recordarme en este dispositivo
                </label>

                <button
                  type="submit"
                  disabled={cargando}
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/30 transition-all hover:bg-blue-700 hover:shadow-blue-500/40 disabled:opacity-60"
                >
                  {cargando ? (
                    "Procesando..."
                  ) : modo === "login" ? (
                    <>
                      <LogIn size={16} /> Iniciar sesión
                    </>
                  ) : (
                    <>
                      <UserPlus size={16} /> Crear cuenta
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Aviso solo para desarrollo: no se muestra en producción */}
            {import.meta.env.DEV && (
              <p className="mt-6 rounded-lg border border-blue-400/20 bg-blue-500/10 p-3 text-center text-[11px] text-blue-100">
                Conectado a tu backend.
              </p>
            )}
          </div>
        </main>

        {/* Pie con características */}
        <footer className="px-5 pb-6 sm:px-8">
          <div className="mx-auto hidden max-w-4xl grid-cols-3 gap-3 md:grid">
            {caracteristicas.map(({ icono: Icono, texto }) => (
              <div
                key={texto}
                className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-4 py-3 backdrop-blur-sm"
              >
                <span className="rounded-lg bg-white/10 p-2 text-blue-200">
                  <Icono size={16} />
                </span>
                <p className="login-text text-xs text-blue-100">{texto}</p>
              </div>
            ))}
          </div>
          <p className="login-text mt-4 text-center text-xs text-blue-200/90">
            © {new Date().getFullYear()} CloudOps Dashboard · Cloud Foundations
          </p>
        </footer>
      </div>
    </div>
  );
}