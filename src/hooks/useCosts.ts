import { useCallback, useEffect, useState } from "react";
import { apiFetch } from "../utils/apiClient";
import { ItemCosto } from "../types/cloud";

export function useCosts() {
  const [items, setItems] = useState<ItemCosto[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const cargar = useCallback(async () => {
    setCargando(true);
    setError(null);
    try {
      const data = await apiFetch("/api/costos");
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al cargar los costos.");
    } finally {
      setCargando(false);
    }
  }, []);

  useEffect(() => {
    cargar();
  }, [cargar]);

  const crear = async (nuevo: Omit<ItemCosto, "id" | "costoEstimado">) => {
    const creado = await apiFetch("/api/costos", { method: "POST", body: nuevo });
    setItems((prev) => [creado, ...prev]);
  };

  const eliminar = async (id: string) => {
    await apiFetch(`/api/costos/${id}`, { method: "DELETE" });
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  return { items, cargando, error, crear, eliminar, recargar: cargar };
}