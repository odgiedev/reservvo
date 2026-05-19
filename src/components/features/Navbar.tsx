"use client";

import { type ReactNode } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useUIStore } from "@/lib/stores/ui.store";
import { useLogout } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const Navbar = (): ReactNode => {
  const name = useAuthStore((s) => s.name);
  const email = useAuthStore((s) => s.email);
  const toggleSidebar = useUIStore((s) => s.toggleSidebar);
  const handleLogout = useLogout();

  return (
    <header className="flex h-16 items-center justify-between border-b border-border bg-background px-4 lg:px-6">
      <button
        onClick={toggleSidebar}
        className="rounded-lg p-2 text-foreground/75 hover:bg-foreground/5 hover:text-foreground lg:hidden cursor-pointer"
        aria-label="Abrir menu"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          aria-hidden="true"
        >
          <line x1="3" y1="12" x2="21" y2="12" />
          <line x1="3" y1="6" x2="21" y2="6" />
          <line x1="3" y1="18" x2="21" y2="18" />
        </svg>
      </button>

      <div className="flex-1" />

      <div className="flex items-center gap-2 sm:gap-4">
        <ThemeToggle />
        <div className="text-right">
          <p className="flex items-center justify-end gap-2 text-sm font-medium text-foreground truncate max-w-[160px] sm:max-w-none">
            <span
              className="h-2.5 w-2.5 shrink-0 rounded-full bg-green-400"
              aria-label="Online"
            />
            {name}
          </p>
          <p className="hidden text-xs text-foreground/65 sm:block">
            {email}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={handleLogout}
          className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
        >
          Sair
        </Button>
      </div>
    </header>
  );
};
