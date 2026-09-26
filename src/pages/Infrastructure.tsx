import Header from "../components/Header";
import RegionCard from "../components/RegionCard";
import GlobeMap from "../components/GlobeMap";
import { regiones } from "../data/awsServices";
import { useRegion } from "../context/RegionContext";

export default function Infrastructure() {
  const { regionId, setRegionId } = useRegion();

  return (
    <div className="animate-fade-in">
      <Header
        titulo="Infraestructura Global"
        subtitulo="Representación visual de regiones, servicios desplegados y estado"
      />
      <div className="p-4 md:p-8">
        <div className="relative mb-8 overflow-hidden rounded-card border border-border bg-card p-4 shadow-card dark:border-slate-700 dark:bg-slate-900">
          <p className="mb-1 font-semibold text-textmain dark:text-slate-100">
            Mapa de regiones activas
          </p>
          <p className="mb-2 text-xs text-textsec dark:text-slate-400">
            Arrastra para rotar el globo. Haz clic en un punto para seleccionar esa región.
          </p>
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
    </div>
  );
}