import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Role } from "@/types";

interface AuthState {
  token: string | null;
  name: string | null;
  email: string | null;
  role: Role | null;
  isAuthenticated: boolean;
  setAuth: (data: {
    token: string;
    name: string;
    email: string;
    role: Role;
  }) => void;
  updateRole: (role: Role) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      name: null,
      email: null,
      role: null,
      isAuthenticated: false,

      setAuth: (data) =>
        set({
          token: data.token,
          name: data.name,
          email: data.email,
          role: data.role,
          isAuthenticated: true,
        }),

      updateRole: (role) => set({ role }),
      
      logout: () => {
        set({
          token: null,
          name: null,
          email: null,
          role: null,
          isAuthenticated: false,
        });

        localStorage.removeItem("reservvo-auth");
      },
    }),
    {
      name: "reservvo-auth",
    }
  )
);
