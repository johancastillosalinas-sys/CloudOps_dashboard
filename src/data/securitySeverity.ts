export type Severidad = "critica" | "alta" | "media" | "baja";

export const severidadPorIndicador: Record<string, Severidad> = {
  "iam-1": "critica",
  "iam-2": "alta",
  "cuentas-1": "media",
  "datos-1": "alta",
  "cump-1": "alta",
};

export const pesoSeveridad: Record<Severidad, number> = {
  critica: 4,
  alta: 3,
  media: 2,
  baja: 1,
};
