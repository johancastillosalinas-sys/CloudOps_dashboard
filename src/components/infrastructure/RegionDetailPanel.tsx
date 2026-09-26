import * as Icons from "lucide-react";
import { X, Layers, Calendar, ShieldCheck, MapPin, Award } from "lucide-react";
import { Region } from "../../types/cloud";
import { awsServices } from "../../data/awsServices";
import { regionDetails } from "../../data/regionDetails";
import { flagCodeFor } from "../../utils/countryFlags";
import StatusBadge from "../StatusBadge";

interface Props {
  region: Region;
  onClose: () => void;
}

export default function RegionDetailPanel({ region, onClose }: Props) {
  const detalle = regionDetails[region.id];
  const serviciosDesplegados = awsServices.filter((s) => region.serviciosDesplegados.includes(s.id));
  const codigoBandera = flagCodeFor(region.pais);
  const antiguedad = detalle ? new Date().getFullYear() - Number(detalle.lanzamiento) : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onClose} />
      <div className="animate-fade-in relative max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-card bg-white shadow-2xl dark:bg-slate-900">
        <div className="sticky top-0 z-10 flex items-center justify-between rounded-t-card bg-primary px-6 py-5 text-white">
          <div className="flex items-center gap-3">
            {codigoBandera && <span className={`fi fi-${codigoBandera} rounded-sm`} style={{ width: 28, height: 20 }} />}
            <div>
              <p className="text-lg font-bold">{region.nombre}</p>
              <p className="text-xs text-blue-100">
                {region.ubicacion}, {region.pais}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="rounded-full p-2 hover:bg-white/10" aria-label="Cerrar">
            <X size={20} />
          </button>
        </div>

        <div className="space-y-6 p-6">
          <div className="flex items-center justify-between">
            <StatusBadge estado={region.estado} />
            <span className="text-xs text-textsec dark:text-slate-400">Latencia estimada: {region.latencia}</span>
          </div>

          {/* KPIs de la región */}
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div className="rounded-card border border-border p-3 text-center dark:border-slate-700">
              <Layers className="mx-auto mb-1 text-primary" size={18} />
              <p className="text-lg font-bold text-textmain dark:text-slate-100">{detalle?.azCount ?? "—"}</p>
              <p className="text-[10px] text-textsec dark:text-slate-400">Zonas de disponibilidad</p>
            </div>
            <div className="rounded-card border border-border p-3 text-center dark:border-slate-700">
              <Calendar className="mx-auto mb-1 text-primary" size={18} />
              <p className="text-lg font-bold text-textmain dark:text-slate-100">{detalle?.lanzamiento ?? "—"}</p>
              <p className="text-[10px] text-textsec dark:text-slate-400">
                Año de lanzamiento{antiguedad ? ` (${antiguedad} años)` : ""}
              </p>
            </div>
            <div className="rounded-card border border-border p-3 text-center dark:border-slate-700">
              <Icons.Boxes className="mx-auto mb-1 text-primary" size={18} />
              <p className="text-lg font-bold text-textmain dark:text-slate-100">{serviciosDesplegados.length}</p>
              <p className="text-[10px] text-textsec dark:text-slate-400">Servicios desplegados</p>
            </div>
            <div className="rounded-card border border-border p-3 text-center dark:border-slate-700">
              <ShieldCheck className="mx-auto mb-1 text-primary" size={18} />
              <p className="text-lg font-bold text-textmain dark:text-slate-100">
                {detalle?.certificaciones.length ?? "—"}
              </p>
              <p className="text-[10px] text-textsec dark:text-slate-400">Certificaciones</p>
            </div>
          </div>

          {/* Certificaciones */}
          {detalle && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-textmain dark:text-slate-100">
                <Award size={15} className="text-primary" /> Certificaciones de cumplimiento
              </p>
              <div className="flex flex-wrap gap-1.5">
                {detalle.certificaciones.map((c) => (
                  <span
                    key={c}
                    className="rounded-full bg-blue-50 px-2.5 py-1 text-[11px] font-medium text-primary dark:bg-blue-500/10"
                  >
                    {c}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Recomendada para */}
          {detalle && (
            <div>
              <p className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-textmain dark:text-slate-100">
                <MapPin size={15} className="text-primary" /> Recomendada para usuarios en
              </p>
              <div className="flex flex-wrap gap-1.5">
                {detalle.recomendadaPara.map((p) => (
                  <span
                    key={p}
                    className="rounded-full border border-border px-2.5 py-1 text-[11px] font-medium text-textsec dark:border-slate-700 dark:text-slate-400"
                  >
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Servicios desplegados */}
          <div>
            <p className="mb-2 text-sm font-semibold text-textmain dark:text-slate-100">Servicios desplegados</p>
            {serviciosDesplegados.length === 0 ? (
              <p className="text-sm text-textsec dark:text-slate-400">Sin servicios desplegados en esta región.</p>
            ) : (
              <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                {serviciosDesplegados.map((s) => {
                  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[s.icono] ?? Icons.Box;
                  return (
                    <div
                      key={s.id}
                      className="flex items-center gap-2 rounded-lg border border-border p-2.5 text-sm dark:border-slate-700"
                    >
                      <Icon size={16} className="text-primary" />
                      <span className="text-textmain dark:text-slate-100">{s.nombre}</span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <p className="text-[10px] italic text-textsec dark:text-slate-500">
            * Año de lanzamiento y número de AZs son datos históricos públicos de AWS, aproximados. Verifica en la
            documentación oficial para cifras actualizadas.
          </p>
        </div>
      </div>
    </div>
  );
}