export interface AuthResponse {
  token: string;
  userId: string;
  name: string;
  email: string;
  role: Role;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  role: Role;
}

export interface UpdateRoleRequest {
  role: Role;
}

export interface UpdateRoleResponse {
  userId: string;
  name: string;
  email: string;
  role: Role;
}

export type Role = "CLIENT" | "PROVIDER" | "BOTH";

export type ReservationStatus =
  | "CONFIRMED"
  | "CANCELLED_BY_CLIENT"
  | "CANCELLED_BY_PROVIDER"
  | "COMPLETED";

export interface ProviderRequest {
  businessName: string;
  slug: string;
  description?: string;
  phone?: string;
}

export interface ProviderResponse {
  id: string;
  businessName: string;
  slug: string;
  description?: string;
  phone?: string;
  userId: string;
}

export interface ResourceRequest {
  name: string;
  description?: string;
  slotDurationMin: number;
}

export interface UpdateActiveRequest {
  active: boolean;
}

export interface ResourceResponse {
  id: string;
  name: string;
  description?: string;
  slotDurationMin: number;
  active: boolean;
  providerId: string;
}

export interface AvailabilityRuleRequest {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface AvailabilityRuleResponse {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  resourceId: string;
}

export interface ReservationRequest {
  resourceId: string;
  clientName: string;
  clientEmail: string;
  date: string;
  startTime: string;
  notes?: string;
}

export interface ReservationStatsResponse {
  confirmed: number;
  completed: number;
  cancelledByProvider: number;
  cancelledByClient: number;
  total: number;
}

export interface PageResponse<T> {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
}

export interface ReservationResponse {
  id: string;
  resourceId: string;
  resourceName: string;
  providerName?: string;
  providerPhone?: string;
  clientName: string;
  clientPhone?: string;
  clientEmail: string;
  date: string;
  startTime: string;
  endTime: string;
  status: ReservationStatus;
  notes?: string;
  createdAt: string;
}
