export interface PuntajeWA {
  pilar: string;
  puntaje: number;
  comentario: string;
}

interface Input {
  servicios: string[];
  nivelDisponibilidad: string;
  descripcion: string;
  recomendados: string[];
}

export function calcularWellArchitected({ servicios, nivelDisponibilidad, descripcion, recomendados }: Input): PuntajeWA[] {
  const tiene = (s: string) => servicios.includes(s);

  const seguridad = 40 + (tiene("AWS IAM") ? 35 : 0) + (tiene("Amazon VPC") ? 25 : 0);
  const fiabilidad =
    nivelDisponibilidad === "99.99%" ? 100 : nivelDisponibilidad === "99.95%" ? 80 : 60;
  const rendimiento = 40 + (tiene("Amazon CloudFront") ? 35 : 0) + (tiene("Amazon RDS") ? 25 : 0);
  const extras = Math.max(0, servicios.length - recomendados.length);
  const costos = Math.max(40, 90 - extras * 8);
  const operacional = 50 + (descripcion.trim().length > 20 ? 40 : descripcion.trim().length > 0 ? 20 : 0);

  return [
    {
      pilar: "Seguridad",
      puntaje: Math.min(seguridad, 100),
      comentario: tiene("AWS IAM") ? "IAM configurado" : "Falta gestión de identidades (IAM)",
    },
    {
      pilar: "Fiabilidad",
      puntaje: fiabilidad,
      comentario: `Nivel de disponibilidad ${nivelDisponibilidad}`,
    },
    {
      pilar: "Eficiencia de rendimiento",
      puntaje: Math.min(rendimiento, 100),
      comentario: tiene("Amazon CloudFront") ? "CDN activa" : "Sin distribución de contenido (CDN)",
    },
    {
      pilar: "Optimización de costos",
      puntaje: costos,
      comentario: extras > 0 ? `${extras} servicio(s) fuera de la recomendación` : "Alineado a la arquitectura recomendada",
    },
    {
      pilar: "Excelencia operacional",
      puntaje: Math.min(operacional, 100),
      comentario: descripcion.trim() ? "Documentación registrada" : "Falta documentar la solución",
    },
  ];
}