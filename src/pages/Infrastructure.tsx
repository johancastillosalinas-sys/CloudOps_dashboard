import { useEffect, useRef, useState } from "react";
import { Eye } from "lucide-react";
import Header from "../components/Header";
import RegionCard from "../components/RegionCard";
import GlobeMap from "../components/GlobeMap";
import RegionDetailPanel from "../components/infrastructure/RegionDetailPanel";
import { regiones } from "../data/awsServices";
import { useRegion } from "../context/RegionContext";

export default function Infrastructure() {
  const { regionId, setRegionId } = useRegion();
  const [panelAbierto, setPanelAbierto] = useState(false);
  const primerRender = useRef(true);

  useEffect(() => {
    if (primerRender.current) {
      primerRender.current = false;
      return;
    }
    setPanelAbierto(true);
  }, [regionId]);

  const regionSeleccionada = regiones.find((r) => r.id === regionId);

  return (
    <div className="animate-fade-in">
      <Header
        titulo="Infraestructura Global"
        subtitulo="Representación visual de regiones, servicios desplegados y estado"
      />
      <div className="p-4 md:p-8">
        <div className="relative mb-8 overflow-hidden rounded-card border border-border bg-card p-4 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <div>
              <p className="font-semibold text-textmain dark:text-slate-100">Mapa de regiones activas</p>
              <p className="text-xs text-textsec dark:text-slate-400">
                Arrastra para rotar el globo. Haz clic en un punto para ver el detalle de esa región.
              </p>
            </div>
            {regionSeleccionada && (
              <button
                onClick={() => setPanelAbierto(true)}
                className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-blue-700"
              >
                <Eye size={14} /> Ver detalle de {regionSeleccionada.nombre}
              </button>
            )}
          </div>
          <GlobeMap />
        </div>

        <p className="mb-3 font-semibold text-textmain dark:text-slate-100">Detalle de regiones</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regiones.map((r) => (
            <RegionCard
              key={r.id}
              region={r}
              seleccionada={r.id === regionId}
              onSelect={setRegionId}
            />
          ))}
        </div>
      </div>

      {panelAbierto && regionSeleccionada && (
        <RegionDetailPanel region={regionSeleccionada} onClose={() => setPanelAbierto(false)} />
      )}
    </div>
  );
}