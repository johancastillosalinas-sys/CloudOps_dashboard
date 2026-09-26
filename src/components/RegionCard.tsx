import * as Icons from "lucide-react";
import { MapPin, Activity, CheckCircle2, ShieldCheck } from "lucide-react";
import { Region } from "../types/cloud";
import { awsServices } from "../data/awsServices";
import { regionDetails } from "../data/regionDetails";
import { flagCodeFor } from "../utils/countryFlags";
import StatusBadge from "./StatusBadge";

interface Props {
  region: Region;
  seleccionada?: boolean;
  onSelect?: (id: string) => void;
}

export default function RegionCard({ region, seleccionada, onSelect }: Props) {
  const detalle = regionDetails[region.id];
  const codigoBandera = flagCodeFor(region.pais);
  const servicios = awsServices.filter((s) => region.serviciosDesplegados.includes(s.id));

  return (
    <div
      onClick={() => onSelect?.(region.id)}
      className={`card-transition rounded-card border bg-card p-5 shadow-card dark:bg-slate-900 ${
        seleccionada
          ? "border-primary ring-2 ring-primary/30"
          : "border-border dark:border-slate-700"
      } ${onSelect ? "cursor-pointer hover:-translate-y-0.5 hover:shadow-lg" : ""}`}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          {codigoBandera ? (
            <span className={`fi fi-${codigoBandera} shrink-0 rounded-sm`} style={{ width: 26, height: 19 }} />
          ) : (
            <MapPin className="text-primary" size={18} />
          )}
          <div>
            <p className="font-semibold text-textmain dark:text-slate-100">{region.nombre}</p>
            <p className="text-xs text-textsec dark:text-slate-400">
              {region.ubicacion}, {region.pais}
            </p>
          </div>
        </div>
        {seleccionada ? (
          <span className="flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-primary dark:bg-blue-500/10">
            <CheckCircle2 size={14} /> Seleccionada
          </span>
        ) : (
          <StatusBadge estado={region.estado} />
        )}
      </div>

      <div className="mt-3 flex items-center gap-1.5 text-xs text-textsec dark:text-slate-400">
        <Activity size={14} />
        Latencia estimada: {region.latencia}
      </div>

      {detalle && (
        <div className="mt-3 grid grid-cols-3 gap-2 border-t border-border pt-3 dark:border-slate-700">
          <div className="text-center">
            <p className="text-sm font-bold text-textmain dark:text-slate-100">{detalle.azCount}</p>
            <p className="text-[10px] text-textsec dark:text-slate-400">Zonas AZ</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-textmain dark:text-slate-100">{servicios.length}</p>
            <p className="text-[10px] text-textsec dark:text-slate-400">Servicios</p>
          </div>
          <div className="text-center">
            <p className="text-sm font-bold text-textmain dark:text-slate-100">
              {detalle.certificaciones.length}
            </p>
            <p className="text-[10px] text-textsec dark:text-slate-400">Certificaciones</p>
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-1.5">
        {servicios.map((s) => {
          const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[s.icono] ?? Icons.Box;
          return (
            <span
              key={s.id}
              className="flex items-center gap-1 rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium text-textsec dark:bg-slate-800 dark:text-slate-300"
            >
              <Icon size={11} /> {s.nombre}
            </span>
          );
        })}
      </div>

      {detalle && (
        <p className="mt-3 flex items-center gap-1 text-[11px] text-textsec dark:text-slate-500">
          <ShieldCheck size={12} className="text-security" /> Operativa desde {detalle.lanzamiento}
        </p>
      )}
    </div>
  );
}