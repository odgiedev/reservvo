import { useQuery } from "@tanstack/react-query";
import { getProviderBySlug, getPublicResources } from "@/lib/api/booking";

export const useProviderBySlug = (slug: string) =>
  useQuery({
    queryKey: ["provider", "slug", slug],
    queryFn: () => getProviderBySlug(slug),
    enabled: !!slug,
  });

export const usePublicResources = (providerId: string) =>
  useQuery({
    queryKey: ["resources", "public", providerId],
    queryFn: () => getPublicResources(providerId),
    enabled: !!providerId,
  });
