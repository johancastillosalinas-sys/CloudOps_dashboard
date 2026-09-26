import { useLocalStorage } from "./useLocalStorage";

export function useFavorites() {
  const [favoritos, setFavoritos] = useLocalStorage<string[]>("favoriteServices", []);

  const esFavorito = (id: string) => favoritos.includes(id);

  const toggleFavorito = (id: string) => {
    setFavoritos((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  return { favoritos, esFavorito, toggleFavorito };
}