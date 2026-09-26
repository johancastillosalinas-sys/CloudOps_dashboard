import { Link } from "react-router-dom";
import * as Icons from "lucide-react";
import { AwsService } from "../types/cloud";
import StatusBadge from "./StatusBadge";

export default function ServiceCard({ service }: { service: AwsService }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icono] ?? Icons.Box;

  return (
    <Link
      to={`/services/${service.id}`}
      className="card-transition flex flex-col gap-3 rounded-card border border-border bg-card p-5 shadow-card hover:-translate-y-0.5 hover:shadow-lg dark:border-slate-700 dark:bg-slate-900"
    >
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-blue-50 p-2.5 dark:bg-blue-500/10">
          <Icon className="text-primary" size={20} />
        </div>
        <StatusBadge estado={service.estado} />
      </div>
      <div>
        <p className="font-semibold text-textmain dark:text-slate-100">{service.nombre}</p>
        <p className="text-xs font-medium uppercase tracking-wide text-textsec dark:text-slate-400">
          {service.categoria}
        </p>
      </div>
      <p className="text-sm text-textsec dark:text-slate-400">{service.descripcion}</p>
      <div className="border-t border-border pt-3 text-xs text-textsec dark:border-slate-700 dark:text-slate-400">
        <span className="font-medium text-textmain dark:text-slate-100">Función: </span>
        {service.funcionPrincipal}
      </div>
    </Link>
  );
}