const PRECIO_HORA_BASE: Record<string, number> = {
  "Amazon EC2": 0.096,
  "Amazon S3": 0.023,
  "Amazon RDS": 0.145,
  "AWS IAM": 0,
  "Amazon VPC": 0.01,
  "Amazon Route 53": 0.02,
  "Amazon CloudFront": 0.03,
};

function factorUsuarios(numeroUsuarios: number) {
  if (numeroUsuarios <= 100) return 1;
  if (numeroUsuarios <= 1000) return 2;
  if (numeroUsuarios <= 10000) return 4;
  return 8;
}

function factorDisponibilidad(nivel: string) {
  if (nivel === "99.99%") return 3;
  if (nivel === "99.95%") return 1.8;
  return 1;
}

export function estimarCostoMensual(servicios: string[], numeroUsuarios: number, nivelDisponibilidad: string) {
  const fu = factorUsuarios(numeroUsuarios);
  const fd = factorDisponibilidad(nivelDisponibilidad);
  const detalle = servicios.map((s) => {
    const precioHora = PRECIO_HORA_BASE[s] ?? 0.05;
    const costoMensual = precioHora * 730 * fu * fd;
    return { servicio: s, costoMensual };
  });
  const total = detalle.reduce((a, d) => a + d.costoMensual, 0);
  return { detalle, total };
}