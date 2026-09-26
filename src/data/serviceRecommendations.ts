export interface Recomendacion {
  servicios: string[];
  justificacion: string;
}

export const recomendacionesPorTipo: Record<string, Recomendacion> = {
  "Aplicación web": {
    servicios: ["Amazon EC2", "Amazon RDS", "Amazon CloudFront", "Amazon Route 53", "AWS IAM"],
    justificacion: "Cómputo + base de datos + CDN para servir contenido rápido a usuarios finales.",
  },
  "API / Backend": {
    servicios: ["Amazon EC2", "Amazon RDS", "AWS IAM", "Amazon VPC"],
    justificacion: "Backend con base de datos gestionada, aislado dentro de una red privada.",
  },
  "Aplicación móvil": {
    servicios: ["Amazon EC2", "Amazon S3", "Amazon CloudFront", "AWS IAM"],
    justificacion: "API + almacenamiento de archivos distribuido globalmente vía CDN.",
  },
  "Sistema interno": {
    servicios: ["Amazon EC2", "Amazon RDS", "Amazon VPC", "AWS IAM"],
    justificacion: "Infraestructura interna aislada en VPC, sin exposición pública amplia.",
  },
  "Data / Analítica": {
    servicios: ["Amazon S3", "Amazon RDS", "AWS IAM"],
    justificacion: "Almacenamiento de datos crudo + base relacional para análisis.",
  },
};