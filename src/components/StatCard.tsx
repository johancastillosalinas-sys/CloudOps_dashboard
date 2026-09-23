import * as Icons from "lucide-react";
import { StatCardData } from "../types/cloud";

const colorMap = {
  primary: { bg: "bg-blue-50 dark:bg-blue-500/10", text: "text-primary" },
  security: { bg: "bg-green-50 dark:bg-green-500/10", text: "text-security" },
  costs: { bg: "bg-amber-50 dark:bg-amber-500/10", text: "text-costs" },
  alert: { bg: "bg-red-50 dark:bg-red-500/10", text: "text-alert" },
};

export default function StatCard({ titulo, valor, subtitulo, icono, color, tendencia }: StatCardData) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[icono] ?? Icons.Circle;
  const c = colorMap[color];

  return (
    <div className="rounded-card border border-border bg-card p-5 shadow-card dark:border-slate-700 dark:bg-slate-900">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-textsec dark:text-slate-400">{titulo}</p>
          <p className="mt-1 text-2xl font-bold text-textmain dark:text-slate-100">{valor}</p>
          {subtitulo && <p className="mt-1 text-xs text-textsec dark:text-slate-400">{subtitulo}</p>}
        </div>
        <div className={`rounded-lg p-2.5 ${c.bg}`}>
          <Icon className={c.text} size={20} />
        </div>
      </div>
      {tendencia && (
        <p className="mt-3 text-xs font-medium text-security">{tendencia}</p>
      )}
    </div>
  );
}