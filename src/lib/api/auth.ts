import { api } from "./axios";
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UpdateRoleRequest,
  UpdateRoleResponse,
} from "@/types";

export const login = async (data: LoginRequest): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/login", data);
  return response.data;
};

export const register = async (
  data: RegisterRequest
): Promise<AuthResponse> => {
  const response = await api.post<AuthResponse>("/api/auth/register", data);
  return response.data;
};

export const updateRole = async (
  data: UpdateRoleRequest
): Promise<UpdateRoleResponse> => {
  const response = await api.patch<UpdateRoleResponse>(
    "/api/auth/role",
    data
  );
  return response.data;
};
