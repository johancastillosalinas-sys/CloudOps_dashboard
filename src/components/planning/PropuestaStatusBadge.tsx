import { EstadoPropuesta } from "../../types/cloud";

const estados: Record<EstadoPropuesta, { label: string; classes: string }> = {
  borrador: { label: "Borrador", classes: "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300" },
  revision: { label: "En revisión", classes: "bg-amber-50 text-costs dark:bg-amber-500/10" },
  aprobada: { label: "Aprobada", classes: "bg-green-50 text-security dark:bg-green-500/10" },
};

const orden: EstadoPropuesta[] = ["borrador", "revision", "aprobada"];

export default function PropuestaStatusBadge({
  estado,
  onChange,
}: {
  estado: EstadoPropuesta;
  onChange?: (e: EstadoPropuesta) => void;
}) {
  const info = estados[estado];
  const avanzar = () => {
    if (!onChange) return;
    const idx = orden.indexOf(estado);
    onChange(orden[(idx + 1) % orden.length]);
  };
  return (
    <button
      type="button"
      onClick={avanzar}
      title={onChange ? "Clic para cambiar de estado" : undefined}
      className={`rounded-full px-2.5 py-1 text-[11px] font-medium ${info.classes} ${
        onChange ? "cursor-pointer hover:opacity-80" : ""
      }`}
    >
      {info.label}
    </button>
  );
}