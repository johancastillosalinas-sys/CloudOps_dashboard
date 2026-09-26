import { useState } from "react";
import { Bell, UserCircle, Moon, Sun, AlertTriangle, XCircle, CheckCheck } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";
import { useRegion } from "../context/RegionContext";
import { useNotifications } from "../hooks/useNotifications";
import { regiones } from "../data/awsServices";
import { flagCodeFor } from "../utils/countryFlags";
import CustomSelect, { SelectOption } from "./CustomSelect";

interface HeaderProps {
  titulo: string;
  subtitulo?: string;
}

const opcionesRegion: SelectOption[] = regiones.map((r) => ({
  value: r.id,
  label: r.nombre,
  description: `${r.ubicacion}, ${r.pais}`,
  emoji: flagCodeFor(r.pais),
}));

export default function Header({ titulo, subtitulo }: HeaderProps) {
  const { isDark, toggle } = useDarkMode();
  const { regionId, setRegionId } = useRegion();
  const { notifications, unreadCount, markAllRead, isRead } = useNotifications();
  const [panelAbierto, setPanelAbierto] = useState(false);

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-border bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 md:px-8">
      <div className="min-w-0">
        <h1 className="truncate text-xl font-bold text-textmain dark:text-slate-100 md:text-2xl">
          {titulo}
        </h1>
        {subtitulo && (
          <p className="truncate text-sm text-textsec dark:text-slate-400">{subtitulo}</p>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Selector de regiones */}
        <div className="hidden w-48 sm:block">
          <CustomSelect value={regionId} onChange={setRegionId} options={opcionesRegion} />
        </div>

        {/* Modo oscuro */}
        <button
          onClick={toggle}
          className="rounded-full p-2 text-textsec transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Cambiar tema"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>

        {/* Notificaciones */}
        <div className="relative">
          <button
            onClick={() => setPanelAbierto((v) => !v)}
            className="relative rounded-full p-2 text-textsec transition-colors hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            aria-label="Notificaciones"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute right-1 top-1 flex h-4 w-4 items-center justify-center rounded-full bg-alert text-[10px] font-bold text-white">
                {unreadCount}
              </span>
            )}
          </button>

          {panelAbierto && (
            <>
              <div
                className="fixed inset-0 z-10"
                onClick={() => setPanelAbierto(false)}
              />
              <div className="animate-dropdown absolute right-0 z-20 mt-2 w-80 max-w-[90vw] rounded-card border border-border bg-white p-3 shadow-card dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-2 flex items-center justify-between">
                  <p className="font-semibold text-textmain dark:text-slate-100">Notificaciones</p>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllRead}
                      className="flex items-center gap-1 text-xs font-medium text-primary hover:underline"
                    >
                      <CheckCheck size={14} /> Marcar leídas
                    </button>
                  )}
                </div>
                {notifications.length === 0 ? (
                  <p className="py-4 text-center text-sm text-textsec dark:text-slate-400">
                    No hay notificaciones.
                  </p>
                ) : (
                  <ul className="max-h-80 space-y-1 overflow-y-auto">
                    {notifications.map((n) => (
                      <li
                        key={n.id}
                        className={`flex gap-2 rounded-lg p-2 text-sm ${
                          isRead(n.id)
                            ? "opacity-60"
                            : "bg-slate-50 dark:bg-slate-800/70"
                        }`}
                      >
                        {n.nivel === "problema" ? (
                          <XCircle className="mt-0.5 shrink-0 text-alert" size={16} />
                        ) : (
                          <AlertTriangle className="mt-0.5 shrink-0 text-costs" size={16} />
                        )}
                        <div>
                          <p className="font-medium text-textmain dark:text-slate-100">{n.titulo}</p>
                          <p className="text-xs text-textsec dark:text-slate-400">{n.descripcion}</p>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </>
          )}
        </div>

        <div className="flex items-center gap-2">
          <UserCircle className="text-textsec dark:text-slate-300" size={30} />
          <div className="hidden text-left sm:block">
            <p className="text-sm font-semibold leading-tight dark:text-slate-100">
              Equipo Cloud
            </p>
            <p className="text-xs leading-tight text-textsec dark:text-slate-400">
              Administrador
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}