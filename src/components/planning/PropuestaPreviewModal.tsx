import { X, Download, MapPin, ShieldCheck, Target, Calendar } from "lucide-react";
import { PropuestaCloud } from "../../types/cloud";
import { recomendacionesPorTipo } from "../../data/serviceRecommendations";
import { slaInfo } from "../../data/slaInfo";
import { calcularWellArchitected } from "../../utils/wellArchitected";
import { fmt, generarReportePropuestaPDF } from "../../utils/reportExport";
import ArchitecturePreview from "./ArchitecturePreview";
import WellArchitectedScore from "./WellArchitectedScore";
import PropuestaStatusBadge from "./PropuestaStatusBadge";

interface Props {
  propuesta: PropuestaCloud;
  onClose: () => void;
}

export default function PropuestaPreviewModal({ propuesta: p, onClose }: Props) {
  const recomendados = recomendacionesPorTipo[p.tipoAplicacion]?.servicios ?? [];
  const puntajes = calcularWellArchitected({
    servicios: p.serviciosSeleccionados,
    nivelDisponibilidad: p.nivelDisponibilidad,
    descripcion: p.descripcion,
    recomendados,
  });
  const sla = slaInfo[p.nivelDisponibilidad];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-fade-in relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-card bg-white shadow-2xl dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-card bg-primary px-6 py-5 text-white">
          <div className="min-w-0">
            <p className="truncate text-lg font-bold">{p.nombreSolucion}</p>
            <p className="text-xs text-blue-100">
              {p.tipoAplicacion} · Registrada el {p.fecha}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <PropuestaStatusBadge estado={p.estado} />
            <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10" aria-label="Cerrar">
              <X size={20} />
            </button>
          </div>
        </div>

        <div className="space-y-6 p-6">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="text-xs text-textsec dark:text-slate-400">Costo mensual</p>
              <p className="text-xl font-bold text-costs">{fmt(p.costoMensualEstimado)}</p>
            </div>
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="text-xs text-textsec dark:text-slate-400">Costo anual</p>
              <p className="text-xl font-bold text-textmain dark:text-slate-100">
                {fmt(p.costoMensualEstimado * 12)}
              </p>
            </div>
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="text-xs text-textsec dark:text-slate-400">Usuarios</p>
              <p className="text-xl font-bold text-primary">{p.numeroUsuarios}</p>
            </div>
            <div className="rounded-card border border-border p-4 dark:border-slate-700">
              <p className="text-xs text-textsec dark:text-slate-400">Servicios</p>
              <p className="text-xl font-bold text-textmain dark:text-slate-100">
                {p.serviciosSeleccionados.length}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 rounded-lg border border-border p-3 dark:border-slate-700">
              <MapPin size={16} className="text-primary" />
              <div>
                <p className="text-[11px] text-textsec dark:text-slate-400">Región</p>
                <p className="font-medium text-textmain dark:text-slate-100">{p.region}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border p-3 dark:border-slate-700">
              <ShieldCheck size={16} className="text-primary" />
              <div>
                <p className="text-[11px] text-textsec dark:text-slate-400">Disponibilidad</p>
                <p className="font-medium text-textmain dark:text-slate-100">
                  {p.nivelDisponibilidad} {sla && `(${sla.downtimeAnual})`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border p-3 dark:border-slate-700">
              <Target size={16} className="text-primary" />
              <div>
                <p className="text-[11px] text-textsec dark:text-slate-400">Objetivo</p>
                <p className="font-medium text-textmain dark:text-slate-100">{p.objetivoMigracion}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border border-border p-3 dark:border-slate-700">
              <Calendar size={16} className="text-primary" />
              <div>
                <p className="text-[11px] text-textsec dark:text-slate-400">Fecha de registro</p>
                <p className="font-medium text-textmain dark:text-slate-100">{p.fecha}</p>
              </div>
            </div>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-textmain dark:text-slate-100">Descripción</p>
            <p className="rounded-lg bg-slate-50 p-3 text-sm text-textsec dark:bg-slate-800 dark:text-slate-400">
              {p.descripcion || "Sin descripción registrada."}
            </p>
          </div>

          <div>
            <p className="mb-2 text-sm font-semibold text-textmain dark:text-slate-100">Arquitectura propuesta</p>
            <div className="rounded-card border border-border bg-slate-50 p-2 dark:border-slate-700 dark:bg-slate-800/50">
              <ArchitecturePreview servicios={p.serviciosSeleccionados} />
            </div>
          </div>

          <div className="rounded-card border border-border p-4 dark:border-slate-700">
            <WellArchitectedScore puntajes={puntajes} />
          </div>
        </div>

        <div className="sticky bottom-0 flex flex-wrap justify-end gap-3 border-t border-border bg-white px-6 py-4 dark:border-slate-700 dark:bg-slate-900">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-textsec transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          >
            Cerrar
          </button>
          <button
            onClick={() => generarReportePropuestaPDF(p, puntajes)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Download size={16} /> Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}