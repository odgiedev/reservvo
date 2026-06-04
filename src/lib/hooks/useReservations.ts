import {
  useQuery,
  useMutation,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import {
  getProviderReservations,
  getClientReservations,
  getReservationStats,
  getSlots,
  createReservation,
  cancelReservationAsProvider,
  cancelReservationAsClient,
} from "@/lib/api/reservations";
import type { ReservationRequest, ReservationStatus } from "@/types";

export const useProviderReservations = (
  page: number = 0,
  size: number = 20,
  status?: ReservationStatus
) =>
  useQuery({
    queryKey: ["reservations", "provider", page, size, status ?? null],
    queryFn: () => getProviderReservations(page, size, status),
    placeholderData: keepPreviousData,
  });

export const useClientReservations = (
  page: number = 0,
  size: number = 20,
  status?: ReservationStatus
) =>
  useQuery({
    queryKey: ["reservations", "client", page, size, status ?? null],
    queryFn: () => getClientReservations(page, size, status),
    placeholderData: keepPreviousData,
  });

export const useReservationStats = (enabled: boolean = true) =>
  useQuery({
    queryKey: ["reservations", "stats"],
    queryFn: getReservationStats,
    enabled,
  });

export const useSlots = (resourceId: string, date: string) =>
  useQuery({
    queryKey: ["slots", resourceId, date],
    queryFn: () => getSlots(resourceId, date),
    enabled: !!resourceId && !!date,
  });

export const useCreateReservation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ReservationRequest) => createReservation(data),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });


      queryClient.invalidateQueries({
        queryKey: ["slots", variables.resourceId, variables.date],
      });
    },
  });
};

export const useCancelReservationAsProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; resourceId: string; date: string }) =>
      cancelReservationAsProvider(params.id),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({
        queryKey: ["slots", variables.resourceId, variables.date],
      });
    },
  });
};

export const useCancelReservationAsClient = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params: { id: string; resourceId: string; date: string }) =>
      cancelReservationAsClient(params.id),
    onSuccess: (_result, variables) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      queryClient.invalidateQueries({
        queryKey: ["slots", variables.resourceId, variables.date],
      });
    },
  });
};
