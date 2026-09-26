import { useEffect, useState } from "react";

/**
 * Hook genérico para persistir estado en localStorage.
 * Sincroniza automáticamente cualquier cambio de valor con el navegador.
 */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const saved = localStorage.getItem(key);
      return saved !== null ? (JSON.parse(saved) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Almacenamiento no disponible (modo privado, cuota excedida, etc.)
    }
  }, [key, value]);

  return [value, setValue] as const;
}