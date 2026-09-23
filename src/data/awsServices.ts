import { AwsService, Region, IndicadorSeguridad, NodoRed } from "../types/cloud";

export const awsServices: AwsService[] = [
  {
    id: "ec2",
    nombre: "Amazon EC2",
    categoria: "Cómputo",
    descripcion:
      "Servidores virtuales escalables bajo demanda para ejecutar aplicaciones empresariales.",
    funcionPrincipal: "Proveer capacidad de cómputo elástica",
    estado: "correcto",
    icono: "Server",
  },
  {
    id: "s3",
    nombre: "Amazon S3",
    categoria: "Almacenamiento",
    descripcion:
      "Almacenamiento de objetos duradero y de alta disponibilidad para cualquier volumen de datos.",
    funcionPrincipal: "Almacenar y recuperar archivos y respaldos",
    estado: "correcto",
    icono: "Database",
  },
  {
    id: "rds",
    nombre: "Amazon RDS",
    categoria: "Base de datos",
    descripcion:
      "Servicio administrado de bases de datos relacionales con alta disponibilidad.",
    funcionPrincipal: "Gestionar bases de datos relacionales",
    estado: "revision",
    icono: "DatabaseZap",
  },
  {
    id: "iam",
    nombre: "AWS IAM",
    categoria: "Seguridad",
    descripcion:
      "Gestión de identidades y accesos para controlar quién puede usar los recursos.",
    funcionPrincipal: "Administrar usuarios, roles y permisos",
    estado: "correcto",
    icono: "ShieldCheck",
  },
  {
    id: "vpc",
    nombre: "Amazon VPC",
    categoria: "Redes",
    descripcion:
      "Red virtual privada aislada y configurable dentro de la nube de AWS.",
    funcionPrincipal: "Aislar y segmentar la infraestructura de red",
    estado: "correcto",
    icono: "Network",
  },
  {
    id: "route53",
    nombre: "Amazon Route 53",
    categoria: "Redes",
    descripcion: "Servicio DNS escalable y de alta disponibilidad.",
    funcionPrincipal: "Resolver nombres de dominio hacia la infraestructura",
    estado: "correcto",
    icono: "Compass",
  },
  {
    id: "cloudfront",
    nombre: "Amazon CloudFront",
    categoria: "Redes",
    descripcion: "Red de distribución de contenido (CDN) de baja latencia.",
    funcionPrincipal: "Distribuir contenido estático y dinámico globalmente",
    estado: "revision",
    icono: "Globe",
  },
];

export const regiones: Region[] = [
  {
    id: "us-east-1",
    nombre: "us-east-1",
    ubicacion: "N. Virginia",
    pais: "Estados Unidos",
    serviciosDesplegados: ["ec2", "s3", "rds"],
    estado: "correcto",
    latencia: "12 ms",
  },
  {
    id: "us-west-2",
    nombre: "us-west-2",
    ubicacion: "Oregón",
    pais: "Estados Unidos",
    serviciosDesplegados: ["s3", "cloudfront"],
    estado: "correcto",
    latencia: "45 ms",
  },
  {
    id: "sa-east-1",
    nombre: "sa-east-1",
    ubicacion: "São Paulo",
    pais: "Brasil",
    serviciosDesplegados: ["ec2", "vpc"],
    estado: "revision",
    latencia: "98 ms",
  },
  {
    id: "eu-west-1",
    nombre: "eu-west-1",
    ubicacion: "Irlanda",
    pais: "Irlanda",
    serviciosDesplegados: ["s3", "rds", "iam"],
    estado: "correcto",
    latencia: "160 ms",
  },
];

export const indicadoresSeguridad: IndicadorSeguridad[] = [
  {
    id: "resp-1",
    titulo: "Seguridad EN la nube",
    descripcion:
      "El cliente es responsable de configurar IAM, cifrado de datos y seguridad de aplicaciones.",
    estado: "correcto",
    categoria: "responsabilidad",
  },
  {
    id: "resp-2",
    titulo: "Seguridad DE la nube",
    descripcion:
      "AWS es responsable de la infraestructura física, red y virtualización.",
    estado: "correcto",
    categoria: "responsabilidad",
  },
  {
    id: "iam-1",
    titulo: "Usuario raíz sin MFA",
    descripcion: "El usuario raíz de la cuenta no tiene autenticación multifactor activa.",
    estado: "problema",
    categoria: "iam",
  },
  {
    id: "iam-2",
    titulo: "Política de mínimo privilegio",
    descripcion: "Los roles IAM aplican permisos mínimos necesarios.",
    estado: "correcto",
    categoria: "iam",
  },
  {
    id: "cuentas-1",
    titulo: "Rotación de credenciales",
    descripcion: "Algunas claves de acceso superan los 90 días sin rotarse.",
    estado: "revision",
    categoria: "cuentas",
  },
  {
    id: "datos-1",
    titulo: "Cifrado en tránsito y reposo",
    descripcion: "Los datos sensibles están cifrados en S3 y RDS.",
    estado: "correcto",
    categoria: "datos",
  },
  {
    id: "cump-1",
    titulo: "Cumplimiento normativo",
    descripcion: "La solución cumple con políticas internas de protección de datos.",
    estado: "revision",
    categoria: "cumplimiento",
  },
];

export const nodosRed: NodoRed[] = [
  { id: "internet", nombre: "Internet", tipo: "internet", descripcion: "Tráfico entrante de usuarios finales" },
  { id: "route53", nombre: "Route 53", tipo: "dns", descripcion: "Resolución de dominio" },
  { id: "cloudfront", nombre: "CloudFront", tipo: "cdn", descripcion: "Distribución de contenido" },
  { id: "vpc", nombre: "VPC", tipo: "vpc", descripcion: "Red privada virtual" },
  { id: "ec2", nombre: "EC2 (subred pública)", tipo: "compute", descripcion: "Servidores de aplicación" },
  { id: "rds", nombre: "RDS (subred privada)", tipo: "database", descripcion: "Base de datos gestionada" },
];

export const catalogoServiciosDisponibles = awsServices.map((s) => s.nombre);
