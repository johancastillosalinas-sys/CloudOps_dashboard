export interface SlaDetalle {
  nivel: string;
  downtimeAnual: string;
  downtimeMensual: string;
  descripcion: string;
}

export const slaInfo: Record<string, SlaDetalle> = {
  "99.9%": {
    nivel: "99.9%",
    downtimeAnual: "≈ 8h 45min / año",
    downtimeMensual: "≈ 43 min / mes",
    descripcion: "Estándar para la mayoría de aplicaciones de producción.",
  },
  "99.95%": {
    nivel: "99.95%",
    downtimeAnual: "≈ 4h 22min / año",
    downtimeMensual: "≈ 21 min / mes",
    descripcion: "Recomendado para aplicaciones críticas con múltiples zonas de disponibilidad.",
  },
  "99.99%": {
    nivel: "99.99%",
    downtimeAnual: "≈ 52 min / año",
    downtimeMensual: "≈ 4 min / mes",
    descripcion: "Alta disponibilidad multi-región; mayor complejidad y costo operativo.",
  },
};
