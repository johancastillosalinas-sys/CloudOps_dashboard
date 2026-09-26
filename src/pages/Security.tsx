import { useMemo, useState } from "react";
import { Download } from "lucide-react";
import Header from "../components/Header";
import SecurityScoreGauge from "../components/security/SecurityScoreGauge";
import SeverityBadge from "../components/security/SeverityBadge";
import FindingsTable from "../components/security/FindingsTable";
import ComplianceChecklist from "../components/security/ComplianceChecklist";
import SharedResponsibilityDiagram from "../components/security/SharedResponsibilityDiagram";
import SecurityTimeline from "../components/security/SecurityTimeline";
import { obtenerHallazgos, calcularScore } from "../utils/securityScore";
import { Severidad } from "../data/securitySeverity";
import { generarReporteSeguridadPDF } from "../utils/reportExport";
import { useLocalStorage } from "../hooks/useLocalStorage";
import SecurityReportPreviewModal from "../components/security/SecurityReportPreviewModal";

export default function Security() {
  const hallazgos = useMemo(() => obtenerHallazgos(), []);
  const [resueltos, setResueltos] = useLocalStorage<Record<string, string>>("resolvedFindings", {});
  const [mostrarPreview, setMostrarPreview] = useState(false);

  const score = useMemo(() => calcularScore(hallazgos, resueltos), [hallazgos, resueltos]);

  const conteoPorSeveridad = useMemo(() => {
    const abiertos = hallazgos.filter((h) => h.estado !== "correcto" && !resueltos[h.id]);
    const conteo: Record<Severidad, number> = { critica: 0, alta: 0, media: 0, baja: 0 };
    abiertos.forEach((h) => (conteo[h.severidad] += 1));
    return conteo;
  }, [hallazgos, resueltos]);

  const toggleResolver = (id: string) => {
    setResueltos((prev) => {
      const copia = { ...prev };
      if (copia[id]) {
        delete copia[id];
      } else {
        copia[id] = new Date().toISOString();
      }
      return copia;
    });
  };

  return (
    <div className="animate-fade-in">
      <Header titulo="Seguridad" subtitulo="Postura de seguridad, hallazgos y cumplimiento" />
      <div className="space-y-6 p-4 md:p-8">
        {/* Puntaje + resumen por severidad */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-2 text-center font-semibold text-textmain dark:text-slate-100">
              Puntaje de postura de seguridad
            </p>
            <SecurityScoreGauge score={score} />
            <p className="mt-2 text-center text-[11px] italic text-textsec dark:text-slate-500">
              Puntaje simulado, no corresponde a AWS Security Hub real.
            </p>
          </div>

          <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900 lg:col-span-2">
            <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold text-textmain dark:text-slate-100">Hallazgos abiertos por severidad</p>
              <button
                onClick={() => setMostrarPreview(true)}
                className="flex items-center gap-2 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <Download size={14} /> Vista previa del reporte
              </button>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {(["critica", "alta", "media", "baja"] as Severidad[]).map((sev) => (
                <div key={sev} className="rounded-lg border border-border p-3 text-center dark:border-slate-700">
                  <div className="mb-1 flex justify-center">
                    <SeverityBadge severidad={sev} />
                  </div>
                  <p className="text-2xl font-bold text-textmain dark:text-slate-100">{conteoPorSeveridad[sev]}</p>
                  <p className="text-[11px] text-textsec dark:text-slate-400">abiertos</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Tabla de hallazgos */}
        <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <p className="mb-4 font-semibold text-textmain dark:text-slate-100">Hallazgos de seguridad</p>
          <FindingsTable hallazgos={hallazgos} resueltos={resueltos} onToggleResolve={toggleResolver} />
        </div>

        {/* Modelo de responsabilidad compartida */}
        <div>
          <p className="mb-3 font-semibold text-textmain dark:text-slate-100">
            Modelo de responsabilidad compartida
          </p>
          <SharedResponsibilityDiagram />
        </div>

        {/* Checklist de cumplimiento + timeline */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-4 font-semibold text-textmain dark:text-slate-100">
              Checklist de cumplimiento (CIS AWS Foundations Benchmark)
            </p>
            <ComplianceChecklist hallazgos={hallazgos} resueltos={resueltos} />
          </div>
          <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
            <p className="mb-4 font-semibold text-textmain dark:text-slate-100">Línea de tiempo de eventos</p>
            <SecurityTimeline hallazgos={hallazgos} resueltos={resueltos} />
          </div>
        </div>
      </div>
      {mostrarPreview && (
        <SecurityReportPreviewModal
          score={score}
          hallazgos={hallazgos}
          resueltos={resueltos}
          onClose={() => setMostrarPreview(false)}
        />
      )}
    </div>
  );
}