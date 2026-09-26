import { ItemCosto } from "../types/cloud";

export const costItemsSeed: ItemCosto[] = [
  { id: "1", servicio: "Amazon EC2", cantidad: 3, horasEstimadas: 730, costoUnitario: 0.096, costoEstimado: 210.24, costoMensual: 210.24, costoAnual: 2522.88 },
  { id: "2", servicio: "Amazon RDS", cantidad: 1, horasEstimadas: 730, costoUnitario: 0.145, costoEstimado: 105.85, costoMensual: 105.85, costoAnual: 1270.2 },
  { id: "3", servicio: "Amazon S3", cantidad: 1, horasEstimadas: 730, costoUnitario: 0.023, costoEstimado: 16.79, costoMensual: 16.79, costoAnual: 201.48 },
];