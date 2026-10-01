import * as Icons from "lucide-react";
import { Check, X, ClipboardList, MapPin, TrendingUp } from "lucide-react";
import { PropuestaCloud } from "../../types/cloud";
import { awsServices } from "../../data/awsServices";
import { fmt } from "../../utils/reportExport";

interface Props {
  propuesta: PropuestaCloud;
  totalMensualActual: number;
  onAceptar: (propuesta: PropuestaCloud) => void;
  onDescartar: (id: string) => void;
  procesando: boolean;
}

export default function PropuestaPendienteCard({
  propuesta,
  totalMensualActual,
  onAceptar,
  onDescartar,
  procesando,
}: Props) {
  const impactoPct =
    totalMensualActual > 0 ? (propuesta.costoMensualEstimado / totalMensualActual) * 100 : 100;

  return (
    <div className="card-transition relative overflow-hidden rounded-card border border-border bg-card shadow-card dark:border-slate-700 dark:bg-slate-900">
      <div className="absolute inset-y-0 left-0 w-1.5 bg-primary" />

      <div className="p-5 pl-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            <span className="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-500/10">
              <ClipboardList size={20} className="text-primary" />
            </span>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="font-semibold text-textmain dark:text-slate-100">{propuesta.nombreSolucion}</p>
                <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-costs dark:bg-amber-500/10">
                  Pendiente
                </span>
              </div>
              <p className="mt-0.5 flex items-center gap-1 text-xs text-textsec dark:text-slate-400">
                <MapPin size={12} /> {propuesta.region} · {propuesta.tipoAplicacion}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-xs text-textsec dark:text-slate-400">Costo mensual estimado</p>
            <p className="text-xl font-bold text-costs">{fmt(propuesta.costoMensualEstimado)}</p>
          </div>
        </div>

        {/* Chips de servicios, igual que en el resto de la app */}
        <div className="mt-3 flex flex-wrap gap-1.5">
          {propuesta.serviciosSeleccionados.map((s) => {
            const svc = awsServices.find((a) => a.nombre === s);
            const Icon = svc
              ? (Icons as unknown as Record<string, Icons.LucideIcon>)[svc.icono] ?? Icons.Box
              : Icons.Box;
            return (
              <span
                key={s}
                className="flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-medium text-textsec dark:bg-slate-800 dark:text-slate-300"
              >
                <Icon size={12} /> {s}
              </span>
            );
          })}
        </div>

        {/* Indicador de impacto */}
        <div className="mt-3 flex items-center gap-1.5 rounded-lg bg-blue-50/60 px-3 py-2 text-xs text-primary dark:bg-blue-500/5">
          <TrendingUp size={13} />
          Si la aceptas, tu gasto mensual subiría ~{impactoPct.toFixed(1)}%
        </div>

        <div className="mt-4 flex justify-end gap-2 border-t border-border pt-3 dark:border-slate-700">
          <button
            disabled={procesando}
            onClick={() => onDescartar(propuesta.id)}
            className="flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-textsec transition-colors hover:bg-red-50 hover:text-alert disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-red-500/10"
          >
            <X size={14} /> Descartar
          </button>
          <button
            disabled={procesando}
            onClick={() => onAceptar(propuesta)}
            className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
          >
            <Check size={14} /> Aceptar como costo
          </button>
        </div>
      </div>
    </div>
  );
}