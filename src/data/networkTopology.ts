export type TipoNodoRed = "internet" | "dns" | "cdn" | "igw" | "natgw" | "compute" | "database";

export interface NodoRedTopologia {
  id: string;
  nombre: string;
  tipo: TipoNodoRed;
  descripcion: string;
  x: number;
  y: number;
  w: number;
  h: number;
  grupoSeguridad?: string;
}

export interface SubredTopologia {
  id: string;
  nombre: string;
  cidr: string;
  routeTable: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface AzTopologia {
  id: string;
  nombre: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const vpc = { id: "vpc-0a1b2c3d", cidr: "10.0.0.0/16", x: 480, y: 40, w: 420, h: 380 };

export const azs: AzTopologia[] = [
  { id: "az-a", nombre: "us-east-1a", x: 500, y: 70, w: 180, h: 330 },
  { id: "az-b", nombre: "us-east-1b", x: 700, y: 70, w: 180, h: 330 },
];

export const subredes: SubredTopologia[] = [
  { id: "pub-a", nombre: "Subred pública", cidr: "10.0.1.0/24", routeTable: "rtb-public", x: 512, y: 95, w: 156, h: 140 },
  { id: "priv-a", nombre: "Subred privada", cidr: "10.0.11.0/24", routeTable: "rtb-private-a", x: 512, y: 250, w: 156, h: 130 },
  { id: "pub-b", nombre: "Subred pública", cidr: "10.0.2.0/24", routeTable: "rtb-public", x: 712, y: 95, w: 156, h: 140 },
  { id: "priv-b", nombre: "Subred privada", cidr: "10.0.12.0/24", routeTable: "rtb-private-b", x: 712, y: 250, w: 156, h: 130 },
];

export const nodos: NodoRedTopologia[] = [
  { id: "internet", nombre: "Internet", tipo: "internet", descripcion: "Tráfico entrante de usuarios finales.", x: 20, y: 200, w: 100, h: 40 },
  { id: "route53", nombre: "Route 53", tipo: "dns", descripcion: "Resolución de nombres de dominio hacia la infraestructura.", x: 170, y: 110, w: 110, h: 40 },
  { id: "cloudfront", nombre: "CloudFront", tipo: "cdn", descripcion: "Distribución de contenido estático y dinámico globalmente.", x: 170, y: 270, w: 110, h: 40 },
  { id: "igw", nombre: "Internet Gateway", tipo: "igw", descripcion: "Punto de entrada/salida de tráfico entre la VPC e Internet.", x: 330, y: 200, w: 110, h: 40 },
  { id: "ec2-a", nombre: "EC2 (app)", tipo: "compute", descripcion: "Instancia de aplicación en la subred pública de us-east-1a.", x: 522, y: 120, w: 136, h: 36, grupoSeguridad: "sg-web" },
  { id: "natgw", nombre: "NAT Gateway", tipo: "natgw", descripcion: "Permite tráfico saliente desde subredes privadas hacia Internet.", x: 522, y: 170, w: 136, h: 36 },
  { id: "rds-a", nombre: "RDS (primario)", tipo: "database", descripcion: "Instancia de base de datos principal en us-east-1a.", x: 522, y: 290, w: 136, h: 36, grupoSeguridad: "sg-db" },
  { id: "ec2-b", nombre: "EC2 (app)", tipo: "compute", descripcion: "Instancia de aplicación en la subred pública de us-east-1b (alta disponibilidad).", x: 722, y: 145, w: 136, h: 36, grupoSeguridad: "sg-web" },
  { id: "rds-b", nombre: "RDS (standby)", tipo: "database", descripcion: "Réplica en espera (Multi-AZ) en us-east-1b, para failover automático.", x: 722, y: 300, w: 136, h: 36, grupoSeguridad: "sg-db" },
];

export interface ConexionRed {
  from: string;
  to: string;
  tipo: "solida" | "punteada";
  etiqueta?: string;
}

export const conexiones: ConexionRed[] = [
  { from: "internet", to: "route53", tipo: "solida" },
  { from: "internet", to: "cloudfront", tipo: "solida" },
  { from: "route53", to: "igw", tipo: "solida" },
  { from: "cloudfront", to: "igw", tipo: "solida" },
  { from: "igw", to: "ec2-a", tipo: "solida" },
  { from: "igw", to: "ec2-b", tipo: "solida" },
  { from: "ec2-a", to: "rds-a", tipo: "solida" },
  { from: "ec2-b", to: "rds-a", tipo: "solida" },
  { from: "rds-a", to: "rds-b", tipo: "punteada", etiqueta: "Replicación Multi-AZ" },
  { from: "natgw", to: "igw", tipo: "punteada", etiqueta: "Tráfico saliente (NAT)" },
];

export const colorTipo: Record<TipoNodoRed, string> = {
  internet: "#64748B",
  dns: "#2563EB",
  cdn: "#2563EB",
  igw: "#64748B",
  natgw: "#F59E0B",
  compute: "#F59E0B",
  database: "#DC2626",
};

// Ruta simplificada de una solicitud: Internet → Route 53 → Internet Gateway → EC2 → RDS
export const rutaTrafico = "M70,220 L225,130 L385,220 L590,138 L590,308";