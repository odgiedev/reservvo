import { api } from "./axios";
import type { ProviderRequest, ProviderResponse } from "@/types";

export const getProvider = async (): Promise<ProviderResponse> => {
  const response = await api.get<ProviderResponse>("/api/provider");
  return response.data;
};

export const createProvider = async (
  data: ProviderRequest
): Promise<ProviderResponse> => {
  const response = await api.post<ProviderResponse>("/api/provider", data);
  return response.data;
};

export const updateProvider = async (
  data: ProviderRequest
): Promise<ProviderResponse> => {
  const response = await api.put<ProviderResponse>("/api/provider", data);
  return response.data;
};
