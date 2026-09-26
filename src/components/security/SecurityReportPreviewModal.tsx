import { X, Download } from "lucide-react";
import { HallazgoSeguridad } from "../../utils/securityScore";
import { Severidad } from "../../data/securitySeverity";
import { generarReporteSeguridadPDF } from "../../utils/reportExport";
import SecurityScoreGauge from "./SecurityScoreGauge";
import SeverityBadge from "./SeverityBadge";
import StatusBadge from "../StatusBadge";
import ComplianceChecklist from "./ComplianceChecklist";

interface Props {
  score: number;
  hallazgos: HallazgoSeguridad[];
  resueltos: Record<string, string>;
  onClose: () => void;
}

export default function SecurityReportPreviewModal({ score, hallazgos, resueltos, onClose }: Props) {
  const abiertos = hallazgos.filter((h) => h.estado !== "correcto" && !resueltos[h.id]);
  const resueltosCount = hallazgos.filter((h) => h.estado !== "correcto" && !!resueltos[h.id]).length;

  const conteoPorSeveridad: Record<Severidad, number> = { critica: 0, alta: 0, media: 0, baja: 0 };
  abiertos.forEach((h) => (conteoPorSeveridad[h.severidad] += 1));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-fade-in relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-card bg-white shadow-2xl dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-card bg-primary px-6 py-5 text-white">
          <div>
            <p className="text-lg font-bold">Reporte de Seguridad Cloud</p>
            <p className="text-xs text-blue-100">
              CloudOps Dashboard · Generado el{" "}
              {new Date().toLocaleDateString("es-PE", { year: "numeric", month: "long", day: "numeric" })}
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          {/* Puntaje + KPIs */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="flex flex-col items-center justify-center rounded-card border border-border p-4 dark:border-slate-700">
              <SecurityScoreGauge score={score} />
              <p className="mt-2 text-center text-[11px] italic text-textsec dark:text-slate-500">
                Puntaje simulado, no corresponde a AWS Security Hub real.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-card border border-border p-4 dark:border-slate-700">
                <p className="text-xs text-textsec dark:text-slate-400">Hallazgos abiertos</p>
                <p className="text-2xl font-bold text-alert">{abiertos.length}</p>
              </div>
              <div className="rounded-card border border-border p-4 dark:border-slate-700">
                <p className="text-xs text-textsec dark:text-slate-400">Resueltos</p>
                <p className="text-2xl font-bold text-security">{resueltosCount}</p>
              </div>
              <div className="col-span-2 rounded-card border border-border p-4 dark:border-slate-700">
                <p className="mb-2 text-xs text-textsec dark:text-slate-400">Abiertos por severidad</p>
                <div className="grid grid-cols-4 gap-2 text-center">
                  {(["critica", "alta", "media", "baja"] as Severidad[]).map((sev) => (
                    <div key={sev}>
                      <div className="mb-1 flex justify-center">
                        <SeverityBadge severidad={sev} />
                      </div>
                      <p className="font-bold text-textmain dark:text-slate-100">{conteoPorSeveridad[sev]}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Lista de hallazgos */}
          <div>
            <p className="mb-2 text-sm font-semibold text-textmain dark:text-slate-100">Hallazgos evaluados</p>
            <div className="overflow-x-auto rounded-card border border-border dark:border-slate-700">
              <table className="w-full min-w-[520px] text-left text-sm">
                <thead className="bg-slate-50 text-xs uppercase text-textsec dark:bg-slate-800 dark:text-slate-400">
                  <tr>
                    <th className="px-3 py-2">Severidad</th>
                    <th className="px-3 py-2">Hallazgo</th>
                    <th className="px-3 py-2">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {hallazgos.map((h) => {
                    const resuelto = h.estado !== "correcto" && !!resueltos[h.id];
                    return (
                      <tr key={h.id} className="border-t border-border dark:border-slate-700">
                        <td className="px-3 py-2">
                          <SeverityBadge severidad={h.severidad} />
                        </td>
                        <td className="px-3 py-2 font-medium text-textmain dark:text-slate-100">{h.titulo}</td>
                        <td className="px-3 py-2">
                          {resuelto ? (
                            <span className="text-xs font-medium text-security">Resuelto</span>
                          ) : (
                            <StatusBadge estado={h.estado} />
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Checklist de cumplimiento */}
          <div className="rounded-card border border-border p-4 dark:border-slate-700">
            <p className="mb-2 text-sm font-semibold text-textmain dark:text-slate-100">
              Checklist de cumplimiento (CIS AWS Foundations Benchmark)
            </p>
            <ComplianceChecklist hallazgos={hallazgos} resueltos={resueltos} />
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
            onClick={() => generarReporteSeguridadPDF(score, hallazgos, resueltos)}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Download size={16} /> Descargar PDF
          </button>
        </div>
      </div>
    </div>
  );
}