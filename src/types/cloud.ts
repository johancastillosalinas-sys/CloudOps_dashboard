// Tipos compartidos de la solución Cloud

export type EstadoIndicador = "correcto" | "revision" | "problema";

export interface AwsService {
  id: string;
  nombre: string;
  categoria: string;
  descripcion: string;
  funcionPrincipal: string;
  estado: EstadoIndicador;
  icono: string; // nombre del icono lucide-react
}

export interface Region {
  id: string;
  nombre: string;
  ubicacion: string;
  pais: string;
  serviciosDesplegados: string[];
  estado: EstadoIndicador;
  latencia: string;
}

export interface PropuestaCloud {
  id: string;
  nombreSolucion: string;
  tipoAplicacion: string;
  descripcion: string;
  region: string;
  numeroUsuarios: number;
  nivelDisponibilidad: string;
  serviciosSeleccionados: string[];
  objetivoMigracion: string;
  fecha: string;
}

export interface ItemCosto {
  id: string;
  servicio: string;
  cantidad: number;
  horasEstimadas: number;
  costoUnitario: number;
  costoEstimado: number;
  costoMensual: number;
  costoAnual: number;
}

export interface IndicadorSeguridad {
  id: string;
  titulo: string;
  descripcion: string;
  estado: EstadoIndicador;
  categoria: "responsabilidad" | "iam" | "cuentas" | "datos" | "cumplimiento";
}

export interface NodoRed {
  id: string;
  nombre: string;
  tipo: "internet" | "dns" | "cdn" | "vpc" | "compute" | "database";
  descripcion: string;
}

export interface StatCardData {
  titulo: string;
  valor: string;
  subtitulo?: string;
  icono: string;
  color: "primary" | "security" | "costs" | "alert";
  tendencia?: string;
}
