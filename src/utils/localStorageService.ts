// Claves de almacenamiento
const KEYS = {
  USERS: "cloudops_users",
  COSTOS: "cloudops_costos",
  PROPUESTAS: "cloudops_propuestas",
};

// Datos iniciales de prueba
const INITIAL_COSTOS = [
  { id: 1, servicio: "Instancia EC2 t3.medium", proveedor: "AWS", costoMensual: 45.0, region: "us-east-1", estado: "Activo" },
  { id: 2, servicio: "Base de Datos Supabase", proveedor: "Supabase", costoMensual: 25.0, region: "sa-east-1", estado: "Activo" },
  { id: 3, servicio: "Almacenamiento S3 Standard", proveedor: "AWS", costoMensual: 12.5, region: "us-east-1", estado: "Activo" },
];

const INITIAL_PROPUESTAS = [
  { id: 1, titulo: "Migración a Kubernetes", cliente: "Cliente Demo", presupuesto: 1500.0, estado: "En Revisión" },
  { id: 2, titulo: "Optimización de Costos AWS", cliente: "Cliente Interno", presupuesto: 800.0, estado: "Aprobado" },
];

// Inicializa las tablas locales si no existen en el navegador
export function initLocalStorage() {
  if (!localStorage.getItem(KEYS.USERS)) {
    localStorage.setItem(KEYS.USERS, JSON.stringify([]));
  }
  if (!localStorage.getItem(KEYS.COSTOS)) {
    localStorage.setItem(KEYS.COSTOS, JSON.stringify(INITIAL_COSTOS));
  }
  if (!localStorage.getItem(KEYS.PROPUESTAS)) {
    localStorage.setItem(KEYS.PROPUESTAS, JSON.stringify(INITIAL_PROPUESTAS));
  }
}

// Métodos auxiliares para leer y escribir
export function getLocalData<T>(key: string): T[] {
  initLocalStorage();
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

export function setLocalData<T>(key: string, data: T[]): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export { KEYS };