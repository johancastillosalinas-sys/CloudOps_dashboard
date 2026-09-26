import { CheckCircle2, AlertTriangle } from "lucide-react";
import { networkHealthChecks } from "../../data/networkHealth";

export default function NetworkHealthPanel() {
  return (
    <div>
      <ul className="space-y-2">
        {networkHealthChecks.map((c) => (
          <li
            key={c.id}
            className="flex items-start gap-2 rounded-lg border border-border p-2.5 text-sm dark:border-slate-700"
          >
            {c.estado === "ok" ? (
              <CheckCircle2 className="mt-0.5 shrink-0 text-security" size={16} />
            ) : (
              <AlertTriangle className="mt-0.5 shrink-0 text-costs" size={16} />
            )}
            <div>
              <p className="font-medium text-textmain dark:text-slate-100">{c.titulo}</p>
              <p className="text-xs text-textsec dark:text-slate-400">{c.detalle}</p>
            </div>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-[10px] italic text-textsec dark:text-slate-500">
        * Estado simulado con fines ilustrativos, no proviene de monitoreo real de AWS.
      </p>
    </div>
  );
}