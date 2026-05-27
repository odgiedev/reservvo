import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProvider,
  createProvider,
  updateProvider,
} from "@/lib/api/provider";
import type { ProviderRequest } from "@/types";

export const useProvider = (enabled: boolean = true) =>
  useQuery({
    queryKey: ["provider"],
    queryFn: getProvider,
    enabled,
  });

export const useCreateProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProviderRequest) => createProvider(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider"] });
    },
  });
};

export const useUpdateProvider = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ProviderRequest) => updateProvider(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["provider"] });
    },
  });
};
