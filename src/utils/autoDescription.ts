import { awsServices } from "../data/awsServices";

export function generarDescripcionServicios(servicios: string[]): string {
  if (servicios.length === 0) return "";

  const partes = servicios.map((nombre) => {
    const svc = awsServices.find((s) => s.nombre === nombre);
    return svc ? `${svc.nombre} (${svc.funcionPrincipal.toLowerCase()})` : nombre;
  });

  if (partes.length === 1) return `Solución que utiliza ${partes[0]}.`;

  const ultima = partes[partes.length - 1];
  const resto = partes.slice(0, -1).join(", ");
  return `Solución que utiliza ${resto} y ${ultima}.`;
}