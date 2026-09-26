import * as Icons from "lucide-react";
import { Trash2 } from "lucide-react";
import { ItemCosto } from "../types/cloud";

interface Props {
  item: ItemCosto;
  onRemove?: (id: string) => void;
  resaltado?: boolean;
  porcentaje: number;
  icono: string;
  categoria: string;
}

const fmt = (n: number) =>
  n.toLocaleString("es-PE", { style: "currency", currency: "USD" });

const categoryColor: Record<string, { bg: string; text: string; bar: string }> = {
  "Cómputo": { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-primary", bar: "bg-primary" },
  "Almacenamiento": { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-primary", bar: "bg-primary" },
  "Base de datos": { bg: "bg-red-50 dark:bg-red-500/10", text: "text-alert", bar: "bg-alert" },
  "Seguridad": { bg: "bg-green-50 dark:bg-green-500/10", text: "text-security", bar: "bg-security" },
  "Redes": { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-costs", bar: "bg-costs" },
};
const colorDefault = { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-primary", bar: "bg-primary" };

export default function CostCard({ item, onRemove, resaltado, porcentaje, icono, categoria }: Props) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[icono] ?? Icons.Box;
  const c = categoryColor[categoria] ?? colorDefault;

  return (
    <div
      className={`card-transition rounded-card border p-4 shadow-card dark:bg-slate-900 ${
        resaltado ? "border-primary ring-2 ring-primary/30" : "border-border dark:border-slate-700"
      }`}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className={`rounded-lg p-2.5 ${c.bg}`}>
            <Icon className={c.text} size={20} />
          </div>
          <div>
            <p className="font-semibold text-textmain dark:text-slate-100">{item.servicio}</p>
            <p className="text-[11px] font-medium uppercase tracking-wide text-textsec dark:text-slate-400">
              {categoria}
            </p>
            <p className="mt-1 text-xs text-textsec dark:text-slate-400">
              {item.cantidad} unidad(es) · {item.horasEstimadas} h/mes · {fmt(item.costoUnitario)}/h
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4">
          <div className="text-right">
            <p className="text-xs text-textsec dark:text-slate-400">Mensual</p>
            <p className="text-lg font-bold text-costs">{fmt(item.costoMensual)}</p>
            <p className="text-xs text-textsec dark:text-slate-400">{fmt(item.costoAnual)} / año</p>
          </div>
          {onRemove && (
            <button
              onClick={() => onRemove(item.id)}
              className="rounded-lg p-2 text-textsec transition-colors hover:bg-red-50 hover:text-alert dark:text-slate-400 dark:hover:bg-red-500/10"
              aria-label="Eliminar"
            >
              <Trash2 size={16} />
            </button>
          )}
        </div>
      </div>

      <div className="mt-3">
        <div className="flex items-center justify-between text-[11px] text-textsec dark:text-slate-400">
          <span>% del gasto mensual total</span>
          <span className="font-medium">{porcentaje.toFixed(1)}%</span>
        </div>
        <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
          <div
            className={`h-full rounded-full ${c.bar} transition-all duration-500`}
            style={{ width: `${Math.min(porcentaje, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}