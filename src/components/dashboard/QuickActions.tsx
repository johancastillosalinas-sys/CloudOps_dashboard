import { Link } from "react-router-dom";
import { DollarSign, ClipboardList, Globe2, ShieldCheck, Boxes, Network } from "lucide-react";

const acciones = [
  { to: "/costs", label: "Costos", icon: DollarSign, color: "text-costs", bg: "bg-amber-50 dark:bg-amber-500/10" },
  { to: "/planning", label: "Planificación", icon: ClipboardList, color: "text-primary", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { to: "/infrastructure", label: "Infraestructura", icon: Globe2, color: "text-primary", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { to: "/security", label: "Seguridad", icon: ShieldCheck, color: "text-security", bg: "bg-green-50 dark:bg-green-500/10" },
  { to: "/services", label: "Servicios AWS", icon: Boxes, color: "text-primary", bg: "bg-blue-50 dark:bg-blue-500/10" },
  { to: "/network", label: "Arquitectura de Red", icon: Network, color: "text-primary", bg: "bg-blue-50 dark:bg-blue-500/10" },
];

export default function QuickActions() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
      {acciones.map((a) => (
        <Link
          key={a.to}
          to={a.to}
          className="card-transition flex flex-col items-center gap-2 rounded-card border border-border bg-card p-4 text-center shadow-card hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
        >
          <span className={`rounded-lg p-2.5 ${a.bg}`}>
            <a.icon className={a.color} size={20} />
          </span>
          <span className="text-xs font-medium text-textmain dark:text-slate-100">{a.label}</span>
        </Link>
      ))}
    </div>
  );
}