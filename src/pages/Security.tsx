import { ShieldCheck, Users, Lock, FileCheck2 } from "lucide-react";
import Header from "../components/Header";
import SecurityCard from "../components/SecurityCard";
import { indicadoresSeguridad } from "../data/awsServices";

const secciones = [
  {
    categoria: "responsabilidad" as const,
    titulo: "Modelo de responsabilidad compartida",
    Icon: ShieldCheck,
  },
  { categoria: "iam" as const, titulo: "Gestión de identidades (IAM)", Icon: Users },
  { categoria: "cuentas" as const, titulo: "Protección de cuentas", Icon: Lock },
  { categoria: "datos" as const, titulo: "Protección de datos", Icon: FileCheck2 },
  { categoria: "cumplimiento" as const, titulo: "Cumplimiento normativo", Icon: FileCheck2 },
];

export default function Security() {
  return (
    <div>
      <Header titulo="Seguridad" subtitulo="Responsabilidad compartida, IAM, datos y cumplimiento" />
      <div className="space-y-8 p-4 md:p-8">
        {secciones.map(({ categoria, titulo, Icon }) => {
          const items = indicadoresSeguridad.filter((i) => i.categoria === categoria);
          if (items.length === 0) return null;
          return (
            <div key={categoria}>
              <div className="mb-3 flex items-center gap-2">
                <Icon className="text-primary" size={20} />
                <p className="font-semibold text-textmain">{titulo}</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((item) => (
                  <SecurityCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          );
        })}

        <div className="rounded-card border border-border bg-card p-5 shadow-card">
          <p className="mb-3 font-semibold text-textmain">Leyenda de indicadores</p>
          <div className="flex flex-wrap gap-4 text-sm">
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-security" /> Correcto
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-costs" /> Requiere revisión
            </span>
            <span className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-alert" /> Problema
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
