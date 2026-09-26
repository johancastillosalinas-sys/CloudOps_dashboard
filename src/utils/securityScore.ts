import { indicadoresSeguridad } from "../data/awsServices";
import { severidadPorIndicador, pesoSeveridad, Severidad } from "../data/securitySeverity";

export interface HallazgoSeguridad {
  id: string;
  titulo: string;
  descripcion: string;
  categoria: string;
  estado: "correcto" | "revision" | "problema";
  severidad: Severidad;
}

export function obtenerHallazgos(): HallazgoSeguridad[] {
  return indicadoresSeguridad
    .filter((i) => i.categoria !== "responsabilidad")
    .map((i) => ({
      id: i.id,
      titulo: i.titulo,
      descripcion: i.descripcion,
      categoria: i.categoria,
      estado: i.estado,
      severidad: severidadPorIndicador[i.id] ?? "media",
    }));
}

export function calcularScore(hallazgos: HallazgoSeguridad[], resueltos: Record<string, string>) {
  let totalPeso = 0;
  let pesoOk = 0;
  hallazgos.forEach((h) => {
    const peso = pesoSeveridad[h.severidad];
    totalPeso += peso;
    const resuelto = h.estado !== "correcto" && !!resueltos[h.id];
    if (h.estado === "correcto" || resuelto) pesoOk += peso;
  });
  return totalPeso > 0 ? Math.round((pesoOk / totalPeso) * 100) : 100;
}