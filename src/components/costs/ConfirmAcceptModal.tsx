import { X, Check, TrendingUp, AlertTriangle } from "lucide-react";
import { PropuestaCloud } from "../../types/cloud";
import { fmt } from "../../utils/reportExport";

interface Props {
  propuesta: PropuestaCloud;
  totalMensualActual: number;
  onConfirmar: () => void;
  onCerrar: () => void;
  procesando: boolean;
}

export default function ConfirmAcceptModal({
  propuesta,
  totalMensualActual,
  onConfirmar,
  onCerrar,
  procesando,
}: Props) {
  const nuevoTotal = totalMensualActual + propuesta.costoMensualEstimado;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCerrar} />
      <div className="animate-fade-in relative w-full max-w-md rounded-card bg-white shadow-2xl dark:bg-slate-900">
        <div className="flex items-center justify-between rounded-t-card bg-primary px-6 py-4 text-white">
          <p className="font-bold">Confirmar aceptación de propuesta</p>
          <button onClick={onCerrar} className="rounded-full p-1.5 hover:bg-white/10" aria-label="Cerrar">
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 p-6">
          <p className="text-sm text-textsec dark:text-slate-400">
            Vas a convertir <span className="font-semibold text-textmain dark:text-slate-100">{propuesta.nombreSolucion}</span> en
            un costo real, registrado en Costos y Economía Cloud.
          </p>

          <div className="space-y-2 rounded-lg border border-border p-4 dark:border-slate-700">
            <div className="flex items-center justify-between text-sm">
              <span className="text-textsec dark:text-slate-400">Costo mensual actual</span>
              <span className="font-medium text-textmain dark:text-slate-100">{fmt(totalMensualActual)}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-textsec dark:text-slate-400">+ Nueva propuesta</span>
              <span className="font-medium text-costs">{fmt(propuesta.costoMensualEstimado)}</span>
            </div>
            <div className="flex items-center justify-between border-t border-border pt-2 text-sm dark:border-slate-700">
              <span className="flex items-center gap-1 font-semibold text-textmain dark:text-slate-100">
                <TrendingUp size={14} /> Nuevo total mensual
              </span>
              <span className="font-bold text-costs">{fmt(nuevoTotal)}</span>
            </div>
          </div>

          <p className="flex items-start gap-1.5 text-xs text-textsec dark:text-slate-500">
            <AlertTriangle size={14} className="mt-0.5 shrink-0" />
            Esta acción no se puede deshacer desde aquí; podrás eliminar el costo manualmente después si lo necesitas.
          </p>
        </div>

        <div className="flex justify-end gap-3 border-t border-border px-6 py-4 dark:border-slate-700">
          <button
            onClick={onCerrar}
            disabled={procesando}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-textsec transition-colors hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirmar}
            disabled={procesando}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-60"
          >
            <Check size={16} /> {procesando ? "Procesando..." : "Confirmar y crear costo"}
          </button>
        </div>
      </div>
    </div>
  );
}