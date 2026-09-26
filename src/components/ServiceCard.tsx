import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { Star, TrendingUp } from "lucide-react";
import { AwsService } from "../types/cloud";
import StatusBadge from "./StatusBadge";
import { highlightText } from "../utils/highlightText";

interface Props {
  service: AwsService;
  vista?: "grid" | "list";
  query?: string;
  esFavorito?: boolean;
  onToggleFavorito?: (id: string) => void;
  masUsado?: boolean;
  seleccionado?: boolean;
  modoComparar?: boolean;
  onToggleComparar?: (id: string) => void;
}

export default function ServiceCard({
  service,
  vista = "grid",
  query = "",
  esFavorito,
  onToggleFavorito,
  masUsado,
  seleccionado,
  modoComparar,
  onToggleComparar,
}: Props) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icono] ?? Icons.Box;

  const contenido = (
    <>
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-500/10">
          <Icon className="text-primary" size={20} />
        </div>
        <div className="flex items-center gap-1.5">
          {masUsado && (
            <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-costs dark:bg-amber-500/10">
              <TrendingUp size={11} /> Más usado
            </span>
          )}
          <StatusBadge estado={service.estado} />
          {onToggleFavorito && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorito(service.id);
              }}
              className="rounded-full p-1 text-textsec transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Marcar como favorito"
            >
              <Star size={16} className={esFavorito ? "fill-costs text-costs" : ""} />
            </button>
          )}
        </div>
      </div>
      <div>
        <p className="font-semibold text-textmain dark:text-slate-100">{highlightText(service.nombre, query)}</p>
        <p className="text-xs font-medium uppercase tracking-wide text-textsec dark:text-slate-400">
          {service.categoria}
        </p>
      </div>
      <p className="text-sm text-textsec dark:text-slate-400">{highlightText(service.descripcion, query)}</p>
      <div className="border-t border-border pt-3 text-xs text-textsec dark:border-slate-700 dark:text-slate-400">
        <span className="font-medium text-textmain dark:text-slate-100">Función: </span>
        {service.funcionPrincipal}
      </div>
    </>
  );

  if (modoComparar) {
    return (
      <button
        onClick={() => onToggleComparar?.(service.id)}
        className={`card-transition flex w-full flex-col gap-3 rounded-card border-2 bg-card p-5 text-left shadow-card dark:bg-slate-900 ${
          seleccionado ? "border-primary ring-2 ring-primary/30" : "border-border dark:border-slate-700"
        }`}
      >
        {contenido}
      </button>
    );
  }

  return (
    <Link
      to={`/services/${service.id}`}
      className={`card-transition flex bg-card shadow-card hover:-translate-y-0.5 hover:shadow-lg dark:bg-slate-900 ${
        vista === "grid"
          ? "flex-col gap-3 rounded-card border border-border p-5 dark:border-slate-700"
          : "flex-row items-center gap-4 rounded-card border border-border p-4 dark:border-slate-700"
      }`}
    >
      {vista === "list" ? (
        <>
          <div className="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-500/10">
            <Icon className="text-primary" size={20} />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <p className="font-semibold text-textmain dark:text-slate-100">{highlightText(service.nombre, query)}</p>
              {masUsado && (
                <span className="flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-costs dark:bg-amber-500/10">
                  <TrendingUp size={11} /> Más usado
                </span>
              )}
            </div>
            <p className="truncate text-xs text-textsec dark:text-slate-400">{highlightText(service.descripcion, query)}</p>
          </div>
          <span className="hidden text-xs font-medium uppercase tracking-wide text-textsec dark:text-slate-400 sm:block">
            {service.categoria}
          </span>
          <StatusBadge estado={service.estado} />
          {onToggleFavorito && (
            <button
              onClick={(e) => {
                e.preventDefault();
                onToggleFavorito(service.id);
              }}
              className="rounded-full p-1 text-textsec transition-colors hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
              aria-label="Marcar como favorito"
            >
              <Star size={16} className={esFavorito ? "fill-costs text-costs" : ""} />
            </button>
          )}
        </>
      ) : (
        contenido
      )}
    </Link>
  );
}