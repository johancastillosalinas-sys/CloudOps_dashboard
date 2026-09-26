import { useMemo, useState } from "react";
import { Search, CheckCircle2, RotateCcw } from "lucide-react";
import CustomSelect, { SelectOption } from "../CustomSelect";
import SeverityBadge from "./SeverityBadge";
import StatusBadge from "../StatusBadge";
import { HallazgoSeguridad } from "../../utils/securityScore";

interface Props {
  hallazgos: HallazgoSeguridad[];
  resueltos: Record<string, string>;
  onToggleResolve: (id: string) => void;
}

const opcionesSeveridad: SelectOption[] = [
  { value: "todas", label: "Todas las severidades" },
  { value: "critica", label: "Crítica" },
  { value: "alta", label: "Alta" },
  { value: "media", label: "Media" },
  { value: "baja", label: "Baja" },
];

const opcionesEstado: SelectOption[] = [
  { value: "todos", label: "Todos los estados" },
  { value: "abiertos", label: "Abiertos" },
  { value: "resueltos", label: "Resueltos" },
];

export default function FindingsTable({ hallazgos, resueltos, onToggleResolve }: Props) {
  const [busqueda, setBusqueda] = useState("");
  const [filtroSeveridad, setFiltroSeveridad] = useState("todas");
  const [filtroEstado, setFiltroEstado] = useState("todos");

  const filtrados = useMemo(() => {
    return hallazgos.filter((h) => {
      const resuelto = h.estado !== "correcto" && !!resueltos[h.id];
      const coincideBusqueda =
        h.titulo.toLowerCase().includes(busqueda.toLowerCase()) ||
        h.descripcion.toLowerCase().includes(busqueda.toLowerCase());
      const coincideSeveridad = filtroSeveridad === "todas" || h.severidad === filtroSeveridad;
      const coincideEstado =
        filtroEstado === "todos" ||
        (filtroEstado === "resueltos" && (h.estado === "correcto" || resuelto)) ||
        (filtroEstado === "abiertos" && h.estado !== "correcto" && !resuelto);
      return coincideBusqueda && coincideSeveridad && coincideEstado;
    });
  }, [hallazgos, resueltos, busqueda, filtroSeveridad, filtroEstado]);

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textsec dark:text-slate-400" size={16} />
          <input
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            placeholder="Buscar hallazgo..."
            className="w-full rounded-lg border border-border bg-transparent py-2.5 pl-9 pr-3 text-sm text-textmain focus:border-primary focus:outline-none dark:border-slate-700 dark:text-slate-100"
          />
        </div>
        <div className="w-full sm:w-48">
          <CustomSelect value={filtroSeveridad} onChange={setFiltroSeveridad} options={opcionesSeveridad} />
        </div>
        <div className="w-full sm:w-44">
          <CustomSelect value={filtroEstado} onChange={setFiltroEstado} options={opcionesEstado} />
        </div>
      </div>

      <div className="overflow-x-auto rounded-card border border-border dark:border-slate-700">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="bg-slate-50 text-xs uppercase text-textsec dark:bg-slate-800 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Severidad</th>
              <th className="px-4 py-3">Hallazgo</th>
              <th className="px-4 py-3">Estado</th>
              <th className="px-4 py-3">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filtrados.map((h) => {
              const resuelto = h.estado !== "correcto" && !!resueltos[h.id];
              return (
                <tr key={h.id} className="border-t border-border align-top dark:border-slate-700">
                  <td className="px-4 py-3">
                    <SeverityBadge severidad={h.severidad} />
                  </td>
                  <td className="px-4 py-3">
                    <p className="font-medium text-textmain dark:text-slate-100">{h.titulo}</p>
                    <p className="text-xs text-textsec dark:text-slate-400">{h.descripcion}</p>
                  </td>
                  <td className="px-4 py-3">
                    {resuelto ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-green-200 bg-green-50 px-2.5 py-1 text-xs font-medium text-security dark:border-green-500/30 dark:bg-green-500/10">
                        <CheckCircle2 size={13} /> Resuelto
                      </span>
                    ) : (
                      <StatusBadge estado={h.estado} />
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {h.estado !== "correcto" && (
                      <button
                        onClick={() => onToggleResolve(h.id)}
                        className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-xs font-medium transition-colors ${
                          resuelto
                            ? "text-textsec hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800"
                            : "bg-primary text-white hover:bg-blue-700"
                        }`}
                      >
                        {resuelto ? (
                          <>
                            <RotateCcw size={13} /> Reabrir
                          </>
                        ) : (
                          <>
                            <CheckCircle2 size={13} /> Resolver
                          </>
                        )}
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
            {filtrados.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-sm text-textsec dark:text-slate-400">
                  No hay hallazgos que coincidan con el filtro.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}