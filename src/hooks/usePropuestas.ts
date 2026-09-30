import { useLocalStorage } from "./useLocalStorage";
import { PropuestaCloud, EstadoPropuesta } from "../types/cloud";

// Semillas compatibles con PropuestaCloud
const INITIAL_PROPUESTAS: any[] = [
  {
    id: "1",
    nombreSolucion: "Portal de Clientes Ecommerce",
    tipoAplicacion: "Aplicación web",
    descripcion: "Solución escalable con frontend reactivo, balanceador de carga y base de datos relacional altamente disponible.",
    region: "us-east-1",
    numeroUsuarios: 2500,
    nivelDisponibilidad: "99.9%",
    serviciosSeleccionados: ["Amazon EC2", "Amazon RDS", "Amazon S3", "Elastic Load Balancing"],
    objetivoMigracion: "Modernización",
    costoMensualEstimado: 342.50,
    estado: "aprobada",
    fecha: "2026-09-15",
  },
  {
    id: "2",
    nombreSolucion: "Plataforma Analytics & Big Data",
    tipoAplicacion: "Procesamiento de datos",
    descripcion: "Pipeline de datos en tiempo real con ingesta streaming y almacenamiento en Data Lake.",
    region: "sa-east-1",
    numeroUsuarios: 500,
    nivelDisponibilidad: "99.95%",
    serviciosSeleccionados: ["Amazon Kinesis", "Amazon S3", "AWS Glue", "Amazon Redshift"],
    objetivoMigracion: "Escalabilidad",
    costoMensualEstimado: 890.00,
    estado: "revision",
    fecha: "2026-09-28",
  },
];

export function usePropuestas() {
  const [propuestas, setPropuestas] = useLocalStorage<PropuestaCloud[]>(
    "cloudops_propuestas",
    INITIAL_PROPUESTAS as PropuestaCloud[]
  );

  const crear = async (nueva: any) => {
    const creada: any = {
      ...nueva,
      id: Date.now().toString(),
      fecha: new Date().toISOString().split("T")[0],
      estado: nueva.estado || "borrador",
    };
    setPropuestas((prev: any[]) => [creada, ...prev]);
  };

  const cambiarEstado = async (id: string, estado: EstadoPropuesta) => {
    setPropuestas((prev: any[]) =>
      prev.map((p) => (p.id === id ? { ...p, estado } : p))
    );
  };

  const eliminar = async (id: string) => {
    setPropuestas((prev: any[]) => prev.filter((p) => p.id !== id));
  };

  const recargar = () => {
    // Manejado por useLocalStorage
  };

  return {
    propuestas,
    cargando: false,
    error: null,
    crear,
    cambiarEstado,
    eliminar,
    recargar,
  };
}