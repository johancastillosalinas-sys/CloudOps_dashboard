export interface NetworkHealthCheck {
  id: string;
  titulo: string;
  detalle: string;
  estado: "ok" | "atencion";
}

export const networkHealthChecks: NetworkHealthCheck[] = [
  { id: "igw", titulo: "Internet Gateway", detalle: "Adjunto a la VPC y activo", estado: "ok" },
  { id: "natgw", titulo: "NAT Gateway", detalle: "Activo, 1 IP elástica asociada", estado: "ok" },
  { id: "rtb", titulo: "Tablas de rutas", detalle: "rtb-public asociada a 2 subredes · rtb-private-a/b asociadas", estado: "ok" },
  { id: "flow-logs", titulo: "VPC Flow Logs", detalle: "Habilitado, retención 90 días", estado: "ok" },
  { id: "multiaz", titulo: "RDS Multi-AZ", detalle: "Failover automático configurado", estado: "ok" },
  { id: "nacl", titulo: "Network ACLs", detalle: "Reglas por defecto (permiten todo el tráfico interno)", estado: "atencion" },
];