import { X } from "lucide-react";
import * as Icons from "lucide-react";
import { AwsService } from "../../types/cloud";
import { serviceDetails } from "../../data/serviceDetails";
import StatusBadge from "../StatusBadge";

interface Props {
  servicios: AwsService[];
  onClose: () => void;
}

export default function ServiceCompareModal({ servicios, onClose }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-fade-in relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-card bg-white shadow-2xl dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-card bg-primary px-6 py-5 text-white">
          <p className="text-lg font-bold">Comparar servicios</p>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="overflow-x-auto p-6">
          <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${servicios.length}, minmax(220px, 1fr))` }}>
            {servicios.map((s) => {
              const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[s.icono] ?? Icons.Box;
              const extra = serviceDetails[s.id];
              return (
                <div key={s.id} className="rounded-card border border-border p-4 dark:border-slate-700">
                  <div className="mb-3 flex items-center gap-2">
                    <div className="rounded-lg bg-blue-50 p-2 dark:bg-blue-500/10">
                      <Icon className="text-primary" size={18} />
                    </div>
                    <p className="font-semibold text-textmain dark:text-slate-100">{s.nombre}</p>
                  </div>
                  <div className="mb-3">
                    <StatusBadge estado={s.estado} />
                  </div>
                  <p className="mb-3 text-xs text-textsec dark:text-slate-400">{s.categoria}</p>
                  <p className="mb-3 text-xs text-textsec dark:text-slate-400">{s.descripcion}</p>

                  <div className="mb-3">
                    <p className="mb-1 text-[11px] font-semibold uppercase text-textsec dark:text-slate-500">
                      Función principal
                    </p>
                    <p className="text-xs text-textmain dark:text-slate-100">{s.funcionPrincipal}</p>
                  </div>

                  {extra && (
                    <>
                      <div className="mb-3">
                        <p className="mb-1 text-[11px] font-semibold uppercase text-textsec dark:text-slate-500">
                          Casos de uso
                        </p>
                        <ul className="space-y-1 text-xs text-textsec dark:text-slate-400">
                          {extra.casosDeUso.map((c, i) => (
                            <li key={i}>• {c}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="mb-1 text-[11px] font-semibold uppercase text-textsec dark:text-slate-500">
                          Ventajas
                        </p>
                        <ul className="space-y-1 text-xs text-textsec dark:text-slate-400">
                          {extra.ventajas.map((v, i) => (
                            <li key={i}>• {v}</li>
                          ))}
                        </ul>
                      </div>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}