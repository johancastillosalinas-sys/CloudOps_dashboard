import { useRef } from "react";
import { X, Download } from "lucide-react";
import NetworkDiagram from "./NetworkDiagram";
import NetworkHealthPanel from "./NetworkHealthPanel";
import { exportSvgAsPng } from "../../utils/exportDiagram";

interface Props {
  vista: "logica" | "seguridad";
  mostrarFlujo: boolean;
  onClose: () => void;
}

export default function NetworkPreviewModal({ vista, mostrarFlujo, onClose }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);

  const descargar = () => {
    if (svgRef.current) {
      exportSvgAsPng(svgRef.current, `arquitectura-red-${new Date().toISOString().slice(0, 10)}.png`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-fade-in relative max-h-[90vh] w-full max-w-5xl overflow-y-auto rounded-card bg-white shadow-2xl dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-card bg-primary px-6 py-5 text-white">
          <div>
            <p className="text-lg font-bold">Vista previa · Arquitectura de Red</p>
            <p className="text-xs text-blue-100">
              {vista === "seguridad" ? "Vista de seguridad" : "Vista lógica"} · CloudOps Dashboard
            </p>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="rounded-card border border-border bg-card p-4 dark:border-slate-700 dark:bg-slate-900">
            <NetworkDiagram vista={vista} mostrarFlujo={mostrarFlujo} activo={null} onSelect={() => {}} svgRef={svgRef} />
          </div>

          <div className="rounded-card border border-border p-4 dark:border-slate-700">
            <p className="mb-3 font-semibold text-textmain dark:text-slate-100">Estado de componentes de red</p>
            <NetworkHealthPanel />
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
            onClick={descargar}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
          >
            <Download size={16} /> Descargar imagen (PNG)
          </button>
        </div>
      </div>
    </div>
  );
}