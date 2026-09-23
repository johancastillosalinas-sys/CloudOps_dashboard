import { MapPin, Activity } from "lucide-react";
import { Region } from "../types/cloud";
import StatusBadge from "./StatusBadge";

export default function RegionCard({ region }: { region: Region }) {
  return (
    <div className="rounded-card border border-border bg-card p-5 shadow-card">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2">
          <MapPin className="text-primary" size={18} />
          <div>
            <p className="font-semibold text-textmain">{region.nombre}</p>
            <p className="text-xs text-textsec">
              {region.ubicacion}, {region.pais}
            </p>
          </div>
        </div>
        <StatusBadge estado={region.estado} />
      </div>
      <div className="mt-3 flex items-center gap-1.5 text-xs text-textsec">
        <Activity size={14} />
        Latencia estimada: {region.latencia}
      </div>
      <div className="mt-3 flex flex-wrap gap-1.5">
        {region.serviciosDesplegados.map((s) => (
          <span
            key={s}
            className="rounded-full bg-slate-100 px-2 py-1 text-[11px] font-medium uppercase text-textsec"
          >
            {s}
          </span>
        ))}
      </div>
    </div>
  );
}
