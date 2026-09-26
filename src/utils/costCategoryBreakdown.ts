import { ItemCosto } from "../types/cloud";
import { awsServices } from "../data/awsServices";

const categoriaPorServicio: Record<string, string> = Object.fromEntries(
  awsServices.map((s) => [s.nombre, s.categoria])
);

export function costosPorCategoria(items: ItemCosto[]) {
  const totales: Record<string, number> = {};
  items.forEach((i) => {
    const cat = categoriaPorServicio[i.servicio] ?? "Otro";
    totales[cat] = (totales[cat] ?? 0) + i.costoMensual;
  });
  return Object.entries(totales)
    .map(([categoria, total]) => ({ categoria, total }))
    .sort((a, b) => b.total - a.total);
}

/**
 * Genera una tendencia simulada de 6 meses que termina exactamente en el
 * total actual. Es solo una referencia visual, no datos reales de facturación.
 */
export function generarTendencia(totalActual: number) {
  const factores = [0.62, 0.7, 0.78, 0.85, 0.93, 1];
  const meses = ["Abr", "May", "Jun", "Jul", "Ago", "Sep"];
  return meses.map((mes, i) => ({
    mes,
    costo: Number((totalActual * factores[i]).toFixed(2)),
  }));
}