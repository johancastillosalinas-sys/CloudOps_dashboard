import { ItemCosto } from "../types/cloud";

export function calcularUsoServicios(costItems: ItemCosto[]) {
  const uso: Record<string, { conteo: number; totalMensual: number }> = {};
  costItems.forEach((i) => {
    if (!uso[i.servicio]) uso[i.servicio] = { conteo: 0, totalMensual: 0 };
    uso[i.servicio].conteo += 1;
    uso[i.servicio].totalMensual += i.costoMensual;
  });
  return uso;
}

export function serviciosMasUsados(costItems: ItemCosto[], top = 3): string[] {
  const uso = calcularUsoServicios(costItems);
  return Object.entries(uso)
    .sort((a, b) => b[1].totalMensual - a[1].totalMensual)
    .slice(0, top)
    .map(([nombre]) => nombre);
}