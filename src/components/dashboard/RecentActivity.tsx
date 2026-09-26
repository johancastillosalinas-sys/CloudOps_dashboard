import { DollarSign, ClipboardList, ShieldAlert } from "lucide-react";
import { ItemCosto, PropuestaCloud } from "../../types/cloud";
import { indicadoresSeguridad } from "../../data/awsServices";
import { fmt } from "../../utils/reportExport";

interface Props {
  costItems: ItemCosto[];
  propuestas: PropuestaCloud[];
}

export default function RecentActivity({ costItems, propuestas }: Props) {
  const alertas = indicadoresSeguridad.filter(
    (i) => i.estado !== "correcto" && i.categoria !== "responsabilidad"
  );

  const eventos: { icono: JSX.Element; titulo: string; detalle: string }[] = [];

  costItems.slice(0, 2).forEach((c) => {
    eventos.push({
      icono: <DollarSign size={14} className="text-costs" />,
      titulo: `Costo registrado: ${c.servicio}`,
      detalle: `${fmt(c.costoMensual)} / mes`,
    });
  });

  propuestas.slice(0, 2).forEach((p) => {
    eventos.push({
      icono: <ClipboardList size={14} className="text-primary" />,
      titulo: `Propuesta registrada: ${p.nombreSolucion}`,
      detalle: p.fecha,
    });
  });

  if (alertas.length > 0) {
    eventos.push({
      icono: <ShieldAlert size={14} className="text-alert" />,
      titulo: `${alertas.length} alerta(s) de seguridad activa(s)`,
      detalle: alertas[0].titulo,
    });
  }

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
          <span className="mt-0.5 rounded-lg bg-slate-100 p-1.5 dark:bg-slate-800">{e.icono}</span>
          <div className="min-w-0">
            <p className="truncate text-sm font-medium text-textmain dark:text-slate-100">{e.titulo}</p>
            <p className="text-xs text-textsec dark:text-slate-400">{e.detalle}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}