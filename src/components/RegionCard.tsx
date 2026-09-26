import { MapPin, Activity, CheckCircle2 } from "lucide-react";
import { Region } from "../types/cloud";
import StatusBadge from "./StatusBadge";

interface Props {
  region: Region;
  seleccionada?: boolean;
  onSelect?: (id: string) => void;
}

export default function RegionCard({ region, seleccionada, onSelect }: Props) {
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
        <div className="flex items-center gap-2">
          <MapPin className="text-primary" size={18} />
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
      <div className="mt-3 flex flex-wrap gap-1.5">
        {region.serviciosDesplegados.map((s) => (
          <span
            key={s}
            className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium uppercase text-textsec dark:bg-slate-800 dark:text-slate-300"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}