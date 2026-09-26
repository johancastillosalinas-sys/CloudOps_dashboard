import * as Icons from "lucide-react";
import { MapPin, Users, ShieldCheck, Target, Eye, Trash2, ChevronRight } from "lucide-react";
import { PropuestaCloud, EstadoPropuesta } from "../../types/cloud";
import { awsServices } from "../../data/awsServices";
import { fmt } from "../../utils/reportExport";
import PropuestaStatusBadge from "./PropuestaStatusBadge";

interface Props {
  propuesta: PropuestaCloud;
  onVerDetalle: (p: PropuestaCloud) => void;
  onEliminar: (id: string) => void;
  onCambiarEstado: (id: string, estado: EstadoPropuesta) => void;
}

export default function PropuestaCard({ propuesta: p, onVerDetalle, onEliminar, onCambiarEstado }: Props) {
  return (
    <div className="card-transition rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <p className="font-semibold text-textmain dark:text-slate-100">{p.nombreSolucion}</p>
            <PropuestaStatusBadge estado={p.estado} onChange={(e) => onCambiarEstado(p.id, e)} />
          </div>
          <p className="mt-0.5 text-xs font-medium uppercase tracking-wide text-textsec dark:text-slate-400">
            {p.tipoAplicacion} · {p.fecha}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-textsec dark:text-slate-400">Costo mensual</p>
          <p className="text-xl font-bold text-costs">{fmt(p.costoMensualEstimado)}</p>
        </div>
      </div>

      <p className="mt-3 text-sm text-textsec dark:text-slate-400">{p.descripcion || "Sin descripción."}</p>

      <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-xs text-textsec dark:text-slate-400">
        <span className="flex items-center gap-1">
          <MapPin size={13} /> {p.region}
        </span>
        <span className="flex items-center gap-1">
          <Users size={13} /> {p.numeroUsuarios} usuarios
        </span>
        <span className="flex items-center gap-1">
          <ShieldCheck size={13} /> {p.nivelDisponibilidad}
        </span>
        <span className="flex items-center gap-1">
          <Target size={13} /> {p.objetivoMigracion}
        </span>
      </div>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {p.serviciosSeleccionados.map((s) => {
          const svc = awsServices.find((a) => a.nombre === s);
          const Icon = svc
            ? (Icons as unknown as Record<string, Icons.LucideIcon>)[svc.icono] ?? Icons.Box
            : Icons.Box;
          return (
            <span
              key={s}
              className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-primary dark:bg-blue-500/10"
            >
              <Icon size={12} /> {s}
            </span>
          );
        })}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-border pt-3 dark:border-slate-700">
        <button
          onClick={() => onEliminar(p.id)}
          className="flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium text-textsec transition-colors hover:bg-red-50 hover:text-alert dark:text-slate-400 dark:hover:bg-red-500/10"
        >
          <Trash2 size={14} /> Eliminar
        </button>
        <button
          onClick={() => onVerDetalle(p)}
          className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
        >
          <Eye size={14} /> Vista previa <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
}