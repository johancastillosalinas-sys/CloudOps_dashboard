import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../utils/apiClient";
import { PropuestaCloud, EstadoPropuesta } from "../types/cloud";

export function usePropuestas() {
  const [propuestas, setPropuestas] = useState<PropuestaCloud[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await apiFetch("/api/propuestas");
      setPropuestas(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar las propuestas.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crear = async (nueva: Omit<PropuestaCloud, "id" | "fecha" | "estado">) => {
    const creada = await apiFetch("/api/propuestas", { method: "POST", body: nueva });
    setPropuestas((prev) => [creada, ...prev]);
  };

  const cambiarEstado = async (id: string, estado: EstadoPropuesta) => {
    const actualizada = await apiFetch(`/api/propuestas/${id}/estado`, {
      method: "PATCH",
      body: { estado },
    });
    setPropuestas((prev) => prev.map((p) => (p.id === id ? actualizada : p)));
  };

  const eliminar = async (id: string) => {
    await apiFetch(`/api/propuestas/${id}`, { method: "DELETE" });
    setPropuestas((prev) => prev.filter((p) => p.id !== id));
  };

  const decidirCosto = async (id: string, accion: "aceptar" | "descartar") => {
    const actualizada = await apiFetch(`/api/propuestas/${id}/costo`, {
      method: "PATCH",
      body: { accion },
    });
    setPropuestas((prev) => prev.map((p) => (p.id === id ? actualizada : p)));
    return actualizada;
  };

  return { propuestas, cargando, error, crear, cambiarEstado, eliminar, decidirCosto, recargar: cargar };
}