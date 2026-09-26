import { useLocalStorage } from "./useLocalStorage";

const MAX = 6;

export function useRecentlyViewed() {
  const [recientes, setRecientes] = useLocalStorage<string[]>("recentlyViewedServices", []);

  const registrarVisita = (id: string) => {
    setRecientes((prev) => [id, ...prev.filter((x) => x !== id)].slice(0, MAX));
  };

  return { recientes, registrarVisita };
}