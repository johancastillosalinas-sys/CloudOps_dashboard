import { useMemo } from "react";
import { indicadoresSeguridad } from "../data/awsServices";
import { useLocalStorage } from "./useLocalStorage";

export interface NotificationItem {
  id: string;
  titulo: string;
  descripcion: string;
  nivel: "problema" | "revision";
}

/**
 * Deriva notificaciones a partir de los indicadores de seguridad que
 * requieren atención (estado "problema" o "revision"), y persiste en
 * localStorage cuáles ya fueron leídas.
 */
export function useNotifications() {
  const notifications: NotificationItem[] = useMemo(
    () =>
      indicadoresSeguridad
        .filter((i) => i.estado === "problema" || i.estado === "revision")
        .map((i) => ({
          id: i.id,
          titulo: i.titulo,
          descripcion: i.descripcion,
          nivel: i.estado as "problema" | "revision",
        })),
    []
  );

  const [readIds, setReadIds] = useLocalStorage<string[]>("readNotifications", []);

  const unreadCount = notifications.filter((n) => !readIds.includes(n.id)).length;

  const markAllRead = () => setReadIds(notifications.map((n) => n.id));
  const isRead = (id: string) => readIds.includes(id);

  return { notifications, unreadCount, markAllRead, isRead };
}