import { getLocalData, setLocalData, KEYS } from "./localStorageService";

interface ApiOptions extends RequestInit {
  body?: any;
}

export async function apiFetch(path: string, options: ApiOptions = {}) {
  // Simular un retardo leve de red para la interfaz
  await new Promise((resolve) => setTimeout(resolve, 150));

  const method = options.method?.toUpperCase() || "GET";

  // --- MÓDULO DE COSTOS ---
  if (path.startsWith("/api/costos")) {
    let costos = getLocalData<any>(KEYS.COSTOS);

    if (method === "GET") {
      return costos;
    }
    if (method === "POST") {
      const nuevoCosto = { id: Date.now(), ...options.body };
      costos.push(nuevoCosto);
      setLocalData(KEYS.COSTOS, costos);
      return nuevoCosto;
    }
    if (method === "DELETE") {
      const id = parseInt(path.split("/").pop() || "0");
      costos = costos.filter((item: any) => item.id !== id);
      setLocalData(KEYS.COSTOS, costos);
      return { status: "deleted" };
    }
  }

  // --- MÓDULO DE PROPUESTAS / PLANIFICACIÓN ---
  if (path.startsWith("/api/propuestas")) {
    let propuestas = getLocalData<any>(KEYS.PROPUESTAS);

    if (method === "GET") {
      return propuestas;
    }
    if (method === "POST") {
      const nuevaPropuesta = { id: Date.now(), ...options.body };
      propuestas.push(nuevaPropuesta);
      setLocalData(KEYS.PROPUESTAS, propuestas);
      return nuevaPropuesta;
    }
    if (method === "DELETE") {
      const id = parseInt(path.split("/").pop() || "0");
      propuestas = propuestas.filter((item: any) => item.id !== id);
      setLocalData(KEYS.PROPUESTAS, propuestas);
      return { status: "deleted" };
    }
  }

  // --- MÓDULO DE AUTENTICACIÓN ---
  if (path.includes("/api/auth/login")) {
    const usuarios = getLocalData<any>(KEYS.USERS);
    const usuario = usuarios.find((u: any) => u.email === options.body?.email && u.password === options.body?.password);

    if (!usuario) {
      throw new Error("Credenciales inválidas o usuario no registrado.");
    }

    return { token: `local_token_${Date.now()}`, email: usuario.email };
  }

  if (path.includes("/api/auth/register")) {
    const usuarios = getLocalData<any>(KEYS.USERS);
    const existe = usuarios.some((u: any) => u.email === options.body?.email);

    if (existe) {
      throw new Error("El correo ya se encuentra registrado.");
    }

    const nuevoUsuario = { id: Date.now(), email: options.body.email, password: options.body.password };
    usuarios.push(nuevoUsuario);
    setLocalData(KEYS.USERS, usuarios);

    return { token: `local_token_${Date.now()}`, email: nuevoUsuario.email };
  }

  return { status: "ok" };
}