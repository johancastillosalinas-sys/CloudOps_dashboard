interface Props {
  data: { categoria: string; total: number }[];
  totalGeneral: number;
}

const colorMap: Record<string, string> = {
  "Cómputo": "bg-primary",
  "Almacenamiento": "bg-primary",
  "Base de datos": "bg-alert",
  "Seguridad": "bg-security",
  "Redes": "bg-costs",
};

export default function CategoryBreakdown({ data, totalGeneral }: Props) {
  if (data.length === 0) {
    return <p className="text-sm text-textsec dark:text-slate-400">Sin costos registrados todavía.</p>;
  }
  return (
    <div className="space-y-3">
      {data.map((d) => {
        const pct = totalGeneral > 0 ? (d.total / totalGeneral) * 100 : 0;
        return (
          <div key={d.categoria}>
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="font-medium text-textmain dark:text-slate-100">{d.categoria}</span>
              <span className="text-textsec dark:text-slate-400">
                {d.total.toLocaleString("es-PE", { style: "currency", currency: "USD" })} · {pct.toFixed(0)}%
              </span>
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
              <div
                className={`h-full rounded-full ${colorMap[d.categoria] ?? "bg-primary"} transition-all duration-500`}
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}