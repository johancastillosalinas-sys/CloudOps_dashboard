# CloudOps Dashboard

Sistema web para la planificación y visualización de una solución Cloud, desarrollado para la
práctica integrativa **Cloud Foundations – Semanas 5 y 6: Diseño de una Solución Cloud con React**.

## Descripción

CloudOps Dashboard simula el panel profesional de una empresa que planifica una implementación
en la nube. Permite visualizar y analizar planificación de la solución, infraestructura global,
estimación de costos, seguridad e IAM, y arquitectura de red, aplicando los fundamentos de
computación en la nube estudiados en el curso (sin necesidad de una implementación real en AWS).

## Tecnologías utilizadas

- React 18 + TypeScript
- Vite
- Tailwind CSS
- React Router DOM
- Recharts (gráficos)
- Lucide React (iconografía)

## Instalación

```bash
npm install
```

## Ejecución en modo desarrollo

```bash
npm run dev
```

La aplicación quedará disponible en `http://localhost:5173`.

## Compilación para producción

```bash
npm run build
npm run preview
```

## Funcionalidades

- **Dashboard**: resumen general con tarjetas de indicadores, gráfico de estado de seguridad y
  resumen del estado de la arquitectura.
- **Planificación Cloud**: formulario para registrar una propuesta de solución Cloud, con
  visualización en tabla de las propuestas registradas.
- **Costos y economía Cloud**: estimación simulada de costos por servicio, con gráfico de
  distribución de costos y totales mensual/anual.
- **Infraestructura Global**: mapa visual de regiones AWS con estado, servicios desplegados y
  latencia estimada.
- **Seguridad**: panel de modelo de responsabilidad compartida, IAM, protección de cuentas,
  protección de datos y cumplimiento, con indicadores de color (verde/amarillo/rojo).
- **Arquitectura de Red**: diagrama interactivo (SVG nativo, no una imagen) de la arquitectura
  INTERNET → Route 53 → CloudFront → VPC → EC2/RDS, con detalle al hacer clic en cada componente.
- **Servicios AWS**: catálogo de servicios (EC2, S3, RDS, IAM, VPC, Route 53, CloudFront) con
  buscador y filtro por categoría.

## Navegación

| Ruta               | Módulo                  |
|---------------------|--------------------------|
| `/dashboard`         | Dashboard                |
| `/planning`          | Planificación Cloud      |
| `/costs`             | Costos                   |
| `/infrastructure`    | Infraestructura Global   |
| `/security`          | Seguridad                |
| `/network`           | Arquitectura de Red      |
| `/services`          | Servicios AWS            |

## Estructura del proyecto

```
cloudops-dashboard/
src/
  ├── components/
  │   ├── Header.tsx
  │   ├── Sidebar.tsx
  │   ├── StatCard.tsx
  │   ├── ServiceCard.tsx
  │   ├── CostCard.tsx
  │   ├── SecurityCard.tsx
  │   ├── RegionCard.tsx
  │   └── StatusBadge.tsx
  ├── pages/
  │   ├── Dashboard.tsx
  │   ├── Planning.tsx
  │   ├── Costs.tsx
  │   ├── Infrastructure.tsx
  │   ├── Security.tsx
  │   ├── Network.tsx
  │   └── Services.tsx
  ├── data/
  │   └── awsServices.ts
  ├── types/
  │   └── cloud.ts
  ├── App.tsx
  └── main.tsx
```

## Datos simulados

Todos los datos (servicios, regiones, costos, indicadores de seguridad) son simulados/locales,
definidos en `src/data/awsServices.ts`. No se requiere conexión a una cuenta real de AWS.

## Vista responsive

La interfaz utiliza un sidebar fijo en escritorio y una barra de navegación inferior en
dispositivos móviles, adaptándose mediante utilidades responsive de Tailwind CSS.
