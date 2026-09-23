import { Trash2 } from "lucide-react";
import { ItemCosto } from "../types/cloud";

interface Props {
  item: ItemCosto;
  onRemove?: (id: string) => void;
}

const fmt = (n: number) =>
  n.toLocaleString("es-PE", { style: "currency", currency: "USD" });

export default function CostCard({ item, onRemove }: Props) {
  return (
    <div className="flex items-center justify-between rounded-card border border-border bg-card p-4 shadow-card">
      <div>
        <p className="font-semibold text-textmain">{item.servicio}</p>
        <p className="text-xs text-textsec">
          Cantidad: {item.cantidad} · Horas estimadas: {item.horasEstimadas}
        </p>
      </div>
      <div className="flex items-center gap-6">
        <div className="text-right">
          <p className="text-xs text-textsec">Mensual</p>
          <p className="font-semibold text-costs">{fmt(item.costoMensual)}</p>
        </div>
        <div className="text-right">
          <p className="text-xs text-textsec">Anual</p>
          <p className="font-semibold text-textmain">{fmt(item.costoAnual)}</p>
        </div>
        {onRemove && (
          <button
            onClick={() => onRemove(item.id)}
            className="rounded-lg p-2 text-textsec hover:bg-red-50 hover:text-alert"
            aria-label="Eliminar"
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>
    </div>
  );
}
