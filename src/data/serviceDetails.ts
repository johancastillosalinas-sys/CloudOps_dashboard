export interface ServiceDetailExtra {
  casosDeUso: string[];
  ventajas: string[];
  docsUrl: string;
}

export const serviceDetails: Record<string, ServiceDetailExtra> = {
  ec2: {
    casosDeUso: [
      "Alojar aplicaciones web y APIs backend",
      "Ejecutar cargas de trabajo por lotes o procesamiento de datos",
      "Servidores de desarrollo y pruebas",
    ],
    ventajas: [
      "Escalabilidad bajo demanda (vertical y horizontal)",
      "Amplio catálogo de tipos de instancia según carga de trabajo",
      "Control total del sistema operativo",
    ],
    docsUrl: "https://docs.aws.amazon.com/ec2/",
  },
  s3: {
    casosDeUso: [
      "Almacenamiento de archivos estáticos (imágenes, videos, backups)",
      "Data lake para análisis de grandes volúmenes de datos",
      "Hosting de sitios web estáticos",
    ],
    ventajas: [
      "Durabilidad de 99.999999999% (11 nueves)",
      "Escalado prácticamente ilimitado",
      "Integración nativa con CloudFront y otros servicios",
    ],
    docsUrl: "https://docs.aws.amazon.com/s3/",
  },
  rds: {
    casosDeUso: [
      "Bases de datos transaccionales para aplicaciones empresariales",
      "Sistemas que requieren alta disponibilidad (Multi-AZ)",
      "Migración de bases de datos on-premise a la nube",
    ],
    ventajas: [
      "Parcheo y backups administrados automáticamente",
      "Soporte para motores populares (MySQL, PostgreSQL, etc.)",
      "Réplicas de lectura para escalar consultas",
    ],
    docsUrl: "https://docs.aws.amazon.com/rds/",
  },
  iam: {
    casosDeUso: [
      "Control de acceso granular a recursos de AWS",
      "Gestión de roles para aplicaciones y usuarios",
      "Auditoría de permisos y cumplimiento normativo",
    ],
    ventajas: [
      "Políticas de privilegio mínimo configurables",
      "Integración con MFA y federación de identidades",
      "Sin costo adicional por su uso",
    ],
    docsUrl: "https://docs.aws.amazon.com/iam/",
  },
  vpc: {
    casosDeUso: [
      "Aislar entornos de producción, staging y desarrollo",
      "Conectar infraestructura on-premise vía VPN o Direct Connect",
      "Segmentar aplicaciones en subredes públicas y privadas",
    ],
    ventajas: [
      "Control total sobre direccionamiento IP y enrutamiento",
      "Seguridad por capas (Security Groups + NACLs)",
      "Base para arquitecturas multi-AZ de alta disponibilidad",
    ],
    docsUrl: "https://docs.aws.amazon.com/vpc/",
  },
  route53: {
    casosDeUso: [
      "Resolución de dominios para aplicaciones globales",
      "Enrutamiento con failover automático entre regiones",
      "Registro y gestión de dominios",
    ],
    ventajas: [
      "SLA de disponibilidad del 100%",
      "Políticas de enrutamiento avanzadas (latencia, geolocalización)",
      "Integración nativa con otros servicios de AWS",
    ],
    docsUrl: "https://docs.aws.amazon.com/route53/",
  },
  cloudfront: {
    casosDeUso: [
      "Distribución de contenido estático y streaming de video",
      "Aceleración de APIs y sitios dinámicos",
      "Protección adicional contra ataques DDoS en el borde",
    ],
    ventajas: [
      "Red global de puntos de presencia (edge locations)",
      "Baja latencia para usuarios en cualquier región",
      "Integración con AWS Shield y AWS WAF",
    ],
    docsUrl: "https://docs.aws.amazon.com/cloudfront/",
  },
};