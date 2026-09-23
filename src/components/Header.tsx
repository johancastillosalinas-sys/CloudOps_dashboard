import { Bell, UserCircle, Moon, Sun } from "lucide-react";
import { useDarkMode } from "../hooks/useDarkMode";

interface HeaderProps {
  titulo: string;
  subtitulo?: string;
}

export default function Header({ titulo, subtitulo }: HeaderProps) {
  const { isDark, toggle } = useDarkMode();

  return (
    <header className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-white/90 px-4 py-4 backdrop-blur dark:border-slate-700 dark:bg-slate-900/90 md:px-8">
      <div>
        <h1 className="text-xl font-bold text-textmain dark:text-slate-100 md:text-2xl">
          {titulo}
        </h1>
        {subtitulo && (
          <p className="text-sm text-textsec dark:text-slate-400">{subtitulo}</p>
        )}
      </div>
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="rounded-full p-2 text-textsec hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Cambiar tema"
        >
          {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
        <button
          className="relative rounded-full p-2 text-textsec hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Notificaciones"
        >
          <Bell size={20} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-alert" />
        </button>
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