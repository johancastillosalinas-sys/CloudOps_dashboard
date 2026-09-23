import { CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { EstadoIndicador } from "../types/cloud";

const config: Record<
  EstadoIndicador,
  { label: string; classes: string; Icon: typeof CheckCircle2 }
> = {
  correcto: {
    label: "Correcto",
    classes: "bg-green-50 text-security border-green-200",
    Icon: CheckCircle2,
  },
  revision: {
    label: "Requiere revisión",
    classes: "bg-amber-50 text-costs border-amber-200",
    Icon: AlertTriangle,
  },
  problema: {
    label: "Problema",
    classes: "bg-red-50 text-alert border-red-200",
    Icon: XCircle,
  },
};

export default function StatusBadge({ estado }: { estado: EstadoIndicador }) {
  const { label, classes, Icon } = config[estado];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium ${classes}`}
    >
      <Icon size={14} />
      {label}
    </span>
  );
}
