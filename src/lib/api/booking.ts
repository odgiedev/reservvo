import { api } from "./axios";
import type { ProviderResponse, ResourceResponse } from "@/types";

export const getProviderBySlug = async (
  slug: string
): Promise<ProviderResponse> => {
  const response = await api.get<ProviderResponse>(
    `/api/provider/slug/${slug}`
  );
  return response.data;
};

export const getPublicResources = async (
  providerId: string
): Promise<ResourceResponse[]> => {
  const response = await api.get<ResourceResponse[]>(
    `/api/resources/provider/${providerId}`
  );
  return response.data;
};
