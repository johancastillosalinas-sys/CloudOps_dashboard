import { useLocalStorage } from "./useLocalStorage";
import { costItemsSeed } from "../data/costSeed";
import { ItemCosto } from "../types/cloud";

export function useCosts() {
  const [items, setItems] = useLocalStorage<ItemCosto[]>("cloudops_costos", costItemsSeed);

  const crear = async (nuevo: Omit<ItemCosto, "id" | "costoEstimado">) => {
    const costoEstimadoCalculado = (nuevo.cantidad || 1) * (nuevo.costoUnitario || 0) * (nuevo.horasEstimadas || 730);
    
    const nuevoCosto: ItemCosto = {
      ...nuevo,
      id: Date.now().toString(),
      costoEstimado: costoEstimadoCalculado,
      costoMensual: nuevo.costoMensual ?? costoEstimadoCalculado,
      costoAnual: nuevo.costoAnual ?? costoEstimadoCalculado * 12,
    };
    setItems((prev) => [nuevoCosto, ...prev]);
  };

  const eliminar = async (id: string) => {
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  const recargar = () => {
    // Manejado automáticamente por useLocalStorage
  };

  return {
    items,
    cargando: false,
    error: null,
    crear,
    eliminar,
    recargar,
  };
}