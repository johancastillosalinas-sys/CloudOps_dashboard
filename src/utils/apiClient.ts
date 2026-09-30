interface ApiOptions extends RequestInit {
  body?: any;
}

// Datos de prueba locales (Mock) para que todo el Dashboard funcione sin backend
const MOCK_DATA: Record<string, any> = {
  "/api/costos": [
    { id: 1, servicio: "Instancia EC2 t3.medium", proveedor: "AWS", costoMensual: 45.0, region: "us-east-1", estado: "Activo" },
    { id: 2, servicio: "Base de Datos Supabase", proveedor: "Supabase", costoMensual: 25.0, region: "sa-east-1", estado: "Activo" },
    { id: 3, servicio: "Almacenamiento S3 Standard", proveedor: "AWS", costoMensual: 12.5, region: "us-east-1", estado: "Activo" },
  ],
  "/api/propuestas": [
    { id: 1, titulo: "Migración a Kubernetes", cliente: "Cliente Demo", presupuesto: 1500.0, estado: "En Revisión" },
    { id: 2, titulo: "Optimización de Costos AWS", cliente: "Cliente Interno", presupuesto: 800.0, estado: "Aprobado" },
  ],
};

export async function apiFetch(path: string, options: ApiOptions = {}) {
  // Simulamos un pequeño retraso de red para dar la sensación de carga real
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Buscar si tenemos datos mock configurados para la ruta solicitada
  const key = Object.keys(MOCK_DATA).find((k) => path.startsWith(k));
  if (key) {
    return MOCK_DATA[key];
  }

  // Si es autenticación
  if (path.includes("/auth/")) {
    return { token: "token_demo_local_12345", email: "demo@cloudops.com" };
  }

  // Para cualquier otro endpoint desconocido, devuelve objeto genérico
  return { status: "ok", data: [] };
}