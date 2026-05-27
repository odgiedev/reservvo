import { api } from "./axios";
import type {
  ResourceRequest,
  ResourceResponse,
  AvailabilityRuleRequest,
  AvailabilityRuleResponse,
} from "@/types";

export const getResources = async (): Promise<ResourceResponse[]> => {
  const response = await api.get<ResourceResponse[]>("/api/resources");
  return response.data;
};

export const createResource = async (
  data: ResourceRequest
): Promise<ResourceResponse> => {
  const response = await api.post<ResourceResponse>("/api/resources", data);
  return response.data;
};

export const updateResource = async (
  resourceId: string,
  data: ResourceRequest
): Promise<ResourceResponse> => {
  const response = await api.put<ResourceResponse>(
    `/api/resources/${resourceId}`,
    data
  );
  return response.data;
};

export const updateResourceActive = async (
  resourceId: string,
  active: boolean
): Promise<ResourceResponse> => {
  const response = await api.patch<ResourceResponse>(
    `/api/resources/${resourceId}/active`,
    { active }
  );
  return response.data;
};

export const deleteResource = async (
  resourceId: string
): Promise<ResourceResponse> => {
  const response = await api.delete<ResourceResponse>(
    `/api/resources/${resourceId}`
  );
  return response.data;
};

export const getAvailability = async (
  resourceId: string
): Promise<AvailabilityRuleResponse[]> => {
  const response = await api.get<AvailabilityRuleResponse[]>(
    `/api/resources/${resourceId}/availability`
  );
  return response.data;
};

export const updateAvailability = async (
  resourceId: string,
  data: AvailabilityRuleRequest[]
): Promise<AvailabilityRuleResponse[]> => {
  const response = await api.put<AvailabilityRuleResponse[]>(
    `/api/resources/${resourceId}/availability`,
    data
  );
  return response.data;
};
