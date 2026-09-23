import * as Icons from "lucide-react";
import { AwsService } from "../types/cloud";
import StatusBadge from "./StatusBadge";

export default function ServiceCard({ service }: { service: AwsService }) {
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[service.icono] ?? Icons.Box;

  return (
    <div className="flex flex-col gap-3 rounded-card border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <div className="rounded-lg bg-blue-50 p-2.5">
          <Icon className="text-primary" size={20} />
        </div>
        <StatusBadge estado={service.estado} />
      </div>
      <div>
        <p className="font-semibold text-textmain">{service.nombre}</p>
        <p className="text-xs font-medium uppercase tracking-wide text-textsec">
          {service.categoria}
        </p>
      </div>
      <p className="text-sm text-textsec">{service.descripcion}</p>
      <div className="border-t border-border pt-3 text-xs text-textsec">
        <span className="font-medium text-textmain">Función: </span>
        {service.funcionPrincipal}
      </div>
    </div>
  );
}
