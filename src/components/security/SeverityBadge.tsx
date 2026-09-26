import { Severidad } from "../../data/securitySeverity";

const config: Record<Severidad, { label: string; classes: string }> = {
  critica: {
    label: "Crítica",
    classes: "bg-red-50 text-alert border-red-200 dark:bg-red-500/10 dark:border-red-500/30",
  },
  alta: {
    label: "Alta",
    classes: "bg-orange-50 text-orange-600 border-orange-200 dark:bg-orange-500/10 dark:border-orange-500/30 dark:text-orange-400",
  },
  media: {
    label: "Media",
    classes: "bg-amber-50 text-costs border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/30",
  },
  baja: {
    label: "Baja",
    classes: "bg-blue-50 text-primary border-blue-200 dark:bg-blue-500/10 dark:border-blue-500/30",
  },
};

export default function SeverityBadge({ severidad }: { severidad: Severidad }) {
  const c = config[severidad];
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${c.classes}`}>
      {c.label}
    </span>
  );
}