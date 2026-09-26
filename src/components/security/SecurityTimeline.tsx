import { AlertTriangle, XCircle, CheckCircle2 } from "lucide-react";
import { HallazgoSeguridad } from "../../utils/securityScore";

interface Props {
  hallazgos: HallazgoSeguridad[];
  resueltos: Record<string, string>;
}

function formatearFecha(iso: string) {
  return new Date(iso).toLocaleString("es-PE", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function SecurityTimeline({ hallazgos, resueltos }: Props) {
  const eventos: { icono: JSX.Element; titulo: string; detalle: string; orden: number }[] = [];

  hallazgos
    .filter((h) => h.estado !== "correcto")
    .forEach((h, i) => {
      eventos.push({
        icono:
          h.estado === "problema" ? (
            <XCircle size={14} className="text-alert" />
          ) : (
            <AlertTriangle size={14} className="text-costs" />
          ),
        titulo: `Hallazgo detectado: ${h.titulo}`,
        detalle: `Hace ${(i + 1) * 3} día(s) (fecha simulada)`,
        orden: 1000 - i,
      });
    });

  Object.entries(resueltos).forEach(([id, iso]) => {
    const h = hallazgos.find((x) => x.id === id);
    if (!h) return;
    eventos.push({
      icono: <CheckCircle2 size={14} className="text-security" />,
      titulo: `Resuelto: ${h.titulo}`,
      detalle: formatearFecha(iso),
      orden: new Date(iso).getTime(),
    });
  });

  eventos.sort((a, b) => b.orden - a.orden);

  if (eventos.length === 0) {
    return <p className="text-sm text-textsec dark:text-slate-400">Sin eventos de seguridad registrados.</p>;
  }

  return (
    <ul className="space-y-3">
      {eventos.map((e, i) => (
        <li
          key={i}
          className="flex items-start gap-3 border-b border-border pb-3 last:border-0 last:pb-0 dark:border-slate-700"
        >
          <span className="mt-0.5 rounded-lg bg-slate-100 p-1.5 dark:bg-slate-800">{e.icono}</span>
          <div>
            <p className="text-sm font-medium text-textmain dark:text-slate-100">{e.titulo}</p>
            <p className="text-xs text-textsec dark:text-slate-400">{e.detalle}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}