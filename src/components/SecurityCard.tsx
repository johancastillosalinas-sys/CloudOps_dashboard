import { IndicadorSeguridad } from "../types/cloud";
import StatusBadge from "./StatusBadge";

export default function SecurityCard({ item }: { item: IndicadorSeguridad }) {
  return (
    <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between gap-3">
        <p className="font-semibold text-textmain dark:text-slate-100">{item.titulo}</p>
        <StatusBadge estado={item.estado} />
      </div>
      <p className="mt-2 text-sm text-textsec dark:text-slate-400">{item.descripcion}</p>
    </div>
  );
}