import { ItemCosto, PropuestaCloud } from "../types/cloud";
import { indicadoresSeguridad } from "../data/awsServices";

export interface EventoActividad {
  tipo: "costo" | "propuesta" | "alerta";
  titulo: string;
  detalle: string;
}

const formatoMoneda = (n: number) => n.toLocaleString("es-PE", { style: "currency", currency: "USD" });

export function construirActividad(costItems: ItemCosto[], propuestas: PropuestaCloud[]): EventoActividad[] {
  const eventos: EventoActividad[] = [];

  costItems.slice(0, 2).forEach((c) => {
    eventos.push({
      tipo: "costo",
      titulo: `Costo registrado: ${c.servicio}`,
      detalle: `${formatoMoneda(c.costoMensual)} / mes`,
    });
  });

  propuestas.slice(0, 2).forEach((p) => {
    eventos.push({
      tipo: "propuesta",
      titulo: `Propuesta registrada: ${p.nombreSolucion}`,
      detalle: p.fecha,
    });
  });

  const alertas = indicadoresSeguridad.filter((i) => i.estado !== "correcto" && i.categoria !== "responsabilidad");
  if (alertas.length > 0) {
    eventos.push({
      tipo: "alerta",
      titulo: `${alertas.length} alerta(s) de seguridad activa(s)`,
      detalle: alertas[0].titulo,
    });
  }

  return eventos;
}