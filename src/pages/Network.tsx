import { useState, useRef } from "react";
import { Radio, Shield, Network as NetworkIcon, Eye } from "lucide-react";
import Header from "../components/Header";
import NetworkDiagram from "../components/network/NetworkDiagram";
import NetworkHealthPanel from "../components/network/NetworkHealthPanel";
import NetworkPreviewModal from "../components/network/NetworkPreviewModal";
import { nodos, colorTipo } from "../data/networkTopology";

export default function Network() {
  const [activo, setActivo] = useState<string | null>(null);
  const [vista, setVista] = useState<"logica" | "seguridad">("logica");
  const [mostrarFlujo, setMostrarFlujo] = useState(false);
  const [mostrarPreview, setMostrarPreview] = useState(false);
  const svgRef = useRef<SVGSVGElement>(null);

  const nodo = nodos.find((n) => n.id === activo);

  return (
    <div className="animate-fade-in">
      <Header
        titulo="Arquitectura de Red"
        subtitulo="VPC multi-AZ: Internet → Route 53 / CloudFront → Internet Gateway → subredes públicas/privadas"
      />
      <div className="space-y-4 p-4 md:p-8">
        {/* Controles */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex gap-2">
            <button
              onClick={() => setVista("logica")}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${vista === "logica"
                  ? "border-primary bg-blue-50 text-primary dark:bg-blue-500/10"
                  : "border-border text-textsec dark:border-slate-700 dark:text-slate-400"
                }`}
            >
              <NetworkIcon size={14} /> Vista lógica
            </button>
            <button
              onClick={() => setVista("seguridad")}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${vista === "seguridad"
                  ? "border-alert bg-red-50 text-alert dark:bg-red-500/10"
                  : "border-border text-textsec dark:border-slate-700 dark:text-slate-400"
                }`}
            >
              <Shield size={14} /> Vista de seguridad
            </button>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setMostrarFlujo((v) => !v)}
              className={`flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${mostrarFlujo
                  ? "border-security bg-green-50 text-security dark:bg-green-500/10"
                  : "border-border text-textsec dark:border-slate-700 dark:text-slate-400"
                }`}
            >
              <Radio size={14} /> {mostrarFlujo ? "Detener simulación" : "Simular tráfico"}
            </button>
            <button
              onClick={() => setMostrarPreview(true)}
              className="flex items-center gap-1.5 rounded-full bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
            >
              <Eye size={14} /> Vista previa y exportar
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="rounded-card border border-border bg-card p-4 shadow-card dark:border-slate-700 dark:bg-slate-900 lg:col-span-2">
            <NetworkDiagram
              vista={vista}
              mostrarFlujo={mostrarFlujo}
              activo={activo}
              onSelect={setActivo}
              svgRef={svgRef}
            />
            <p className="mt-3 text-center text-xs text-textsec dark:text-slate-400">
              Haz clic en un componente del diagrama para ver su detalle.
            </p>
          </div>

          <div className="space-y-4">
            <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
              <p className="mb-3 font-semibold text-textmain dark:text-slate-100">Detalle del componente</p>
              {nodo ? (
                <div>
                  <p className="text-lg font-semibold" style={{ color: colorTipo[nodo.tipo] }}>
                    {nodo.nombre}
                  </p>
                  <p className="mt-1 text-xs font-medium uppercase text-textsec dark:text-slate-400">{nodo.tipo}</p>
                  <p className="mt-3 text-sm text-textsec dark:text-slate-400">{nodo.descripcion}</p>
                  {nodo.grupoSeguridad && (
                    <p className="mt-2 text-xs font-medium text-alert">Grupo de seguridad: {nodo.grupoSeguridad}</p>
                  )}
                </div>
              ) : (
                <p className="text-sm text-textsec dark:text-slate-400">
                  Selecciona un componente del diagrama para ver información detallada de su función dentro de la
                  arquitectura.
                </p>
              )}
            </div>

            {vista === "seguridad" && (
              <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
                <p className="mb-3 font-semibold text-textmain dark:text-slate-100">Grupos de seguridad</p>
                <ul className="space-y-2 text-xs text-textsec dark:text-slate-400">
                  <li>
                    <span className="font-medium text-textmain dark:text-slate-100">sg-web</span> — permite entrada
                    HTTPS (443) desde el Internet Gateway
                  </li>
                  <li>
                    <span className="font-medium text-textmain dark:text-slate-100">sg-db</span> — permite entrada
                    solo desde instancias con sg-web (puerto de base de datos)
                  </li>
                </ul>
                <p className="mt-3 text-[10px] italic text-textsec dark:text-slate-500">
                  * Reglas ilustrativas simplificadas, no representan una configuración real auditada.
                </p>
              </div>
            )}

            <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
              <p className="mb-3 font-semibold text-textmain dark:text-slate-100">Estado de componentes de red</p>
              <NetworkHealthPanel />
            </div>
          </div>
        </div>
      </div>
      {mostrarPreview && (
        <NetworkPreviewModal vista={vista} mostrarFlujo={mostrarFlujo} onClose={() => setMostrarPreview(false)} />
      )}
    </div>
  );
}