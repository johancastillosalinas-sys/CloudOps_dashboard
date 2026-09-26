import { Server, Lock, Database, Key, Cloud, HardDrive } from "lucide-react";

const aws = [
  { icon: HardDrive, label: "Infraestructura física" },
  { icon: Server, label: "Hardware y virtualización" },
  { icon: Cloud, label: "Redes globales de AWS" },
];

const cliente = [
  { icon: Key, label: "Gestión de identidades (IAM)" },
  { icon: Database, label: "Configuración de datos" },
  { icon: Lock, label: "Seguridad del sistema operativo y red" },
];

export default function SharedResponsibilityDiagram() {
  return (
    <div className="overflow-hidden rounded-card border border-border dark:border-slate-700">
      <div className="grid grid-cols-1 sm:grid-cols-2">
        <div className="bg-blue-50 p-5 dark:bg-blue-500/10">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-primary">Responsabilidad de AWS</p>
          <p className="mb-4 text-xs text-textsec dark:text-slate-400">Seguridad DE la nube</p>
          <div className="space-y-3">
            {aws.map((a) => (
              <div key={a.label} className="flex items-center gap-2 text-sm">
                <a.icon size={16} className="text-primary" />
                <span className="text-textmain dark:text-slate-100">{a.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-green-50 p-5 dark:bg-green-500/10">
          <p className="mb-3 text-xs font-bold uppercase tracking-wide text-security">Responsabilidad del cliente</p>
          <p className="mb-4 text-xs text-textsec dark:text-slate-400">Seguridad EN la nube</p>
          <div className="space-y-3">
            {cliente.map((c) => (
              <div key={c.label} className="flex items-center gap-2 text-sm">
                <c.icon size={16} className="text-security" />
                <span className="text-textmain dark:text-slate-100">{c.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}