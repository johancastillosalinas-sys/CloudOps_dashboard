import { PuntajeWA } from "../../utils/wellArchitected";

function colorFor(puntaje: number) {
  if (puntaje >= 80) return "bg-security";
  if (puntaje >= 60) return "bg-costs";
  return "bg-alert";
}

export default function WellArchitectedScore({ puntajes }: { puntajes: PuntajeWA[] }) {
  const promedio = Math.round(puntajes.reduce((a, p) => a + p.puntaje, 0) / puntajes.length);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-textmain dark:text-slate-100">
          Puntaje estilo Well-Architected
        </p>
        <span className="text-2xl font-bold text-primary">{promedio}/100</span>
      </div>
      <div className="space-y-3">
        {puntajes.map((p) => (
          <div key={p.pilar}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-textmain dark:text-slate-100">{p.pilar}</span>
              <span className="text-textsec dark:text-slate-400">{p.puntaje}/100</span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${colorFor(p.puntaje)} transition-all duration-500`}
                style={{ width: `${p.puntaje}%` }}
              />
            </div>
            <p className="mt-1 text-[11px] text-textsec dark:text-slate-400">{p.comentario}</p>
          </div>
        ))}
      </div>
      <p className="mt-3 text-[10px] italic text-textsec dark:text-slate-500">
        * Puntaje estimado con fines educativos; no corresponde a una revisión oficial de AWS Well-Architected.
      </p>
    </div>
  );
}