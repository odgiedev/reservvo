import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getResources,
  createResource,
  updateResource,
  updateResourceActive,
  deleteResource,
  getAvailability,
  updateAvailability,
} from "@/lib/api/resources";
import type {
  ResourceRequest,
  ResourceResponse,
  AvailabilityRuleRequest,
} from "@/types";

export const useResources = () =>
  useQuery({
    queryKey: ["resources"],
    queryFn: getResources,
  });

export const useCreateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: ResourceRequest) => createResource(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
};

export const useUpdateResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: ResourceRequest }) =>
      updateResource(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["resources"] });
    },
  });
};

export const useUpdateResourceActive = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, active }: { id: string; active: boolean }) =>
      updateResourceActive(id, active),
    onSuccess: (updatedResource) => {
      queryClient.setQueryData<ResourceResponse[]>(
        ["resources"],
        (old) =>
          old?.map((r) =>
            r.id === updatedResource.id ? updatedResource : r
          ) ?? []
      );
    },
  });
};

export const useDeleteResource = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteResource(id),
    onSuccess: (deletedResource) => {
      queryClient.setQueryData<ResourceResponse[]>(
        ["resources"],
        (old) => old?.filter((r) => r.id !== deletedResource.id) ?? []
      );
    },
  });
};

export const useAvailability = (resourceId: string) =>
  useQuery({
    queryKey: ["availability", resourceId],
    queryFn: () => getAvailability(resourceId),
    enabled: !!resourceId,
  });

export const useUpdateAvailability = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      resourceId,
      data,
    }: {
      resourceId: string;
      data: AvailabilityRuleRequest[];
    }) => updateAvailability(resourceId, data),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["availability", variables.resourceId],
      });
    },
  });
};
