import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { login, register, updateRole } from "@/lib/api/auth";
import { useAuthStore } from "@/lib/stores/auth.store";
import type { LoginRequest, RegisterRequest, UpdateRoleRequest } from "@/types";

const safeRedirect = (target: string | null): string => {
  if (!target) return "/dashboard";

  if (target.startsWith("/") && !target.startsWith("//"))
    return target;
  return "/dashboard";
};

export const useLogin = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: LoginRequest) => login(data),
    onSuccess: (response) => {
      setAuth(response);
      router.push(safeRedirect(searchParams.get("redirect")));
    },
  });
};

export const useRegister = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const setAuth = useAuthStore((s) => s.setAuth);

  return useMutation({
    mutationFn: (data: RegisterRequest) => register(data),
    onSuccess: (response) => {
      setAuth(response);
      const redirectParam = searchParams.get("redirect");


      if (!redirectParam && (response.role === "PROVIDER" || response.role === "BOTH")) {
        router.push("/profile");
        return;
      }
      router.push(safeRedirect(redirectParam));
    },
  });
};

export const useUpdateRole = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const updateRoleAction = useAuthStore((s) => s.updateRole);

  return useMutation({
    mutationFn: (data: UpdateRoleRequest) => updateRole(data),
    onSuccess: (response) => {
      updateRoleAction(response.role);


      queryClient.invalidateQueries({ queryKey: ["provider"] });

      router.push("/profile");
    },
  });
};

export const useLogout = () => {
  const logout = useAuthStore((s) => s.logout);

  return () => {
    logout();


    window.location.href = "/login";
  };
};
