import { DollarSign, ClipboardList, ShieldAlert } from "lucide-react";
import { EventoActividad } from "../../utils/dashboardActivity";

const iconoPorTipo = {
  costo: <DollarSign size={14} className="text-costs" />,
  propuesta: <ClipboardList size={14} className="text-primary" />,
  alerta: <ShieldAlert size={14} className="text-alert" />,
};

export default function RecentActivity({ eventos }: { eventos: EventoActividad[] }) {
  if (eventos.length === 0) {
    return (
      <p className="text-sm text-textsec dark:text-slate-400">
        Aún no hay actividad registrada. Agrega costos o propuestas para verlas aquí.
      </p>
    );
  }

  return (
    <ul className="space-y-3">
      {eventos.map((e, i) => (
        <li
          key={i}
          className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0 dark:border-slate-700"
        >
          <span className="mt-0.5 rounded-lg bg-slate-100 p-1.5 dark:bg-slate-800">{iconoPorTipo[e.tipo]}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-textmain dark:text-slate-100">{e.titulo}</p>
            <p className="text-xs text-textsec dark:text-slate-400">{e.detalle}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}