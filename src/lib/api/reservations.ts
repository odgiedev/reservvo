import { api } from "./axios";
import type {
  PageResponse,
  ReservationRequest,
  ReservationResponse,
  ReservationStatsResponse,
  ReservationStatus,
} from "@/types";

export const getSlots = async (
  resourceId: string,
  date: string
): Promise<string[]> => {
  const response = await api.get<string[]>("/api/reservations/slots", {
    params: { resourceId, date },
  });
  return response.data;
};

export const createReservation = async (
  data: ReservationRequest
): Promise<ReservationResponse> => {
  const response = await api.post<ReservationResponse>(
    "/api/reservations",
    data
  );
  return response.data;
};

export const getProviderReservations = async (
  page: number = 0,
  size: number = 20,
  status?: ReservationStatus
): Promise<PageResponse<ReservationResponse>> => {
  const response = await api.get<PageResponse<ReservationResponse>>(
    "/api/reservations/provider",
    { params: { page, size, ...(status ? { status } : {}) } }
  );
  return response.data;
};

export const getClientReservations = async (
  page: number = 0,
  size: number = 20,
  status?: ReservationStatus
): Promise<PageResponse<ReservationResponse>> => {
  const response = await api.get<PageResponse<ReservationResponse>>(
    "/api/reservations/client",
    { params: { page, size, ...(status ? { status } : {}) } }
  );
  return response.data;
};

export const getReservationStats =
  async (): Promise<ReservationStatsResponse> => {
    const response = await api.get<ReservationStatsResponse>(
      "/api/reservations/stats"
    );
    return response.data;
  };

export const cancelReservationAsProvider = async (
  id: string
): Promise<void> => {
  await api.patch(`/api/reservations/${id}/cancel/provider`);
};

export const cancelReservationAsClient = async (id: string): Promise<void> => {
  await api.patch(`/api/reservations/${id}/cancel/client`);
};
