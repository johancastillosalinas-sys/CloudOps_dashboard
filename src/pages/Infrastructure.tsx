import Header from "../components/Header";
import RegionCard from "../components/RegionCard";
import { regiones } from "../data/awsServices";

export default function Infrastructure() {
  return (
    <div>
      <Header
        titulo="Infraestructura Global"
        subtitulo="Representación visual de regiones, servicios desplegados y estado"
      />
      <div className="p-4 md:p-8">
        {/* Mapa mundial simplificado con posiciones aproximadas */}
        <div className="relative mb-8 overflow-hidden rounded-card border border-border bg-card p-4 shadow-card">
          <p className="mb-4 font-semibold text-textmain">Mapa de regiones activas</p>
          <div className="relative h-72 w-full rounded-lg bg-blue-50">
            <svg viewBox="0 0 400 200" className="h-full w-full opacity-30">
              <path
                d="M20,100 Q100,40 200,80 T380,90"
                stroke="#2563EB"
                strokeWidth="1.5"
                fill="none"
              />
              <path
                d="M20,140 Q120,180 220,140 T380,150"
                stroke="#2563EB"
                strokeWidth="1.5"
                fill="none"
              />
            </svg>
            {[
              { id: "us-east-1", top: "35%", left: "24%" },
              { id: "us-west-2", top: "30%", left: "12%" },
              { id: "sa-east-1", top: "75%", left: "28%" },
              { id: "eu-west-1", top: "25%", left: "48%" },
            ].map((pos) => {
              const r = regiones.find((x) => x.id === pos.id)!;
              const color =
                r.estado === "correcto" ? "#16A34A" : r.estado === "revision" ? "#F59E0B" : "#DC2626";
              return (
                <div
                  key={pos.id}
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{ top: pos.top, left: pos.left }}
                  title={r.nombre}
                >
                  <span
                    className="block h-3.5 w-3.5 rounded-full ring-4"
                    style={{ backgroundColor: color, boxShadow: `0 0 0 6px ${color}22` }}
                  />
                  <span className="mt-1 block text-center text-[11px] font-semibold text-textmain">
                    {r.nombre}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        <p className="mb-3 font-semibold text-textmain">Detalle de regiones</p>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {regiones.map((r) => (
            <RegionCard key={r.id} region={r} />
          ))}
        </div>
      </div>
    </div>
  );
}
