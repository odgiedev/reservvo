import { format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import type { ReservationStatus } from "@/types";

export const formatDate = (iso: string): string =>
  format(parseISO(iso), "dd 'de' MMMM, yyyy", { locale: ptBR });

export const formatDateShort = (iso: string): string =>
  format(parseISO(iso), "dd/MM/yyyy", { locale: ptBR });

export const formatTime = (time: string): string => time.slice(0, 5);

export const formatDateTime = (iso: string): string =>
  format(parseISO(iso), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });

export const statusLabel: Record<ReservationStatus, string> = {
  CONFIRMED: "Confirmada",
  CANCELLED_BY_CLIENT: "Cancelada pelo cliente",
  CANCELLED_BY_PROVIDER: "Cancelada pelo prestador",
  COMPLETED: "Concluída",
};

export const statusVariant: Record<
  ReservationStatus,
  "success" | "danger" | "warning" | "default"
> = {
  CONFIRMED: "success",
  CANCELLED_BY_CLIENT: "danger",
  CANCELLED_BY_PROVIDER: "warning",
  COMPLETED: "default",
};
