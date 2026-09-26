import * as Icons from "lucide-react";
import { awsServices } from "../../data/awsServices";

interface Props {
  servicios: string[];
}

const columnas: { titulo: string; servicios: string[] }[] = [
  { titulo: "Entrada", servicios: ["Amazon Route 53", "Amazon CloudFront"] },
  { titulo: "Cómputo / Red", servicios: ["Amazon EC2", "Amazon VPC"] },
  { titulo: "Datos", servicios: ["Amazon RDS", "Amazon S3"] },
];

export default function ArchitecturePreview({ servicios }: Props) {
  const tieneIam = servicios.includes("AWS IAM");
  const columnasActivas = columnas
    .map((c) => ({ ...c, servicios: c.servicios.filter((s) => servicios.includes(s)) }))
    .filter((c) => c.servicios.length > 0);

  if (columnasActivas.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-textsec dark:text-slate-400">
        Selecciona servicios para generar la vista previa de arquitectura.
      </p>
    );
  }

  return (
    <div className="relative">
      {tieneIam && (
        <span className="absolute -top-2 right-0 flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-medium text-security dark:bg-green-500/10">
          <Icons.ShieldCheck size={12} /> IAM activo
        </span>
      )}
      <div className="flex flex-wrap items-center justify-center gap-3 py-6">
        {columnasActivas.map((col, idx) => (
          <div key={col.titulo} className="flex items-center gap-3">
            <div className="rounded-lg border border-border bg-white p-3 text-center dark:border-slate-700 dark:bg-slate-800">
              <p className="mb-2 text-[10px] font-semibold uppercase tracking-wide text-textsec dark:text-slate-400">
                {col.titulo}
              </p>
              <div className="flex flex-col gap-2">
                {col.servicios.map((s) => {
                  const svc = awsServices.find((a) => a.nombre === s);
                  const Icon = svc
                    ? (Icons as unknown as Record<string, Icons.LucideIcon>)[svc.icono] ?? Icons.Box
                    : Icons.Box;
                  return (
                    <div
                      key={s}
                      className="flex items-center gap-2 rounded-md bg-blue-50 px-2.5 py-1.5 text-xs font-medium text-primary dark:bg-blue-500/10"
                    >
                      <Icon size={14} /> {s}
                    </div>
                  );
                })}
              </div>
            </div>
            {idx < columnasActivas.length - 1 && (
              <Icons.ArrowRight className="text-textsec dark:text-slate-500" size={20} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}