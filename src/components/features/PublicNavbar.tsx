"use client";

import { useState, useEffect, type ReactNode } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth.store";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export const PublicNavbar = (): ReactNode => {
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  return (
    <header className="border-b border-border">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link
          href="/"
          className="text-xl font-bold tracking-tight text-foreground"
        >
          Reservvo
        </Link>
        <nav className="flex items-center gap-3 sm:gap-6">
          <Link
            href="/how-it-works"
            className="text-sm text-foreground/75 transition-colors hover:text-foreground"
          >
            Como funciona
          </Link>
          <Link
            href="/about"
            className="hidden text-sm text-foreground/75 transition-colors hover:text-foreground sm:inline"
          >
            Sobre nós
          </Link>
          <ThemeToggle />
          {hydrated && isAuthenticated ? (
            <Link
              href="/dashboard"
              className="inline-flex h-9 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="text-sm text-foreground/75 transition-colors hover:text-foreground"
              >
                Entrar
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center rounded-lg bg-foreground px-4 text-sm font-medium text-background transition-colors hover:bg-foreground/90"
              >
                Criar conta
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};
