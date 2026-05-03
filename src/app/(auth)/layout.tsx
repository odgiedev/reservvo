"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/lib/stores/auth.store";
import { PublicNavbar } from "@/components/features/PublicNavbar";

export default function AuthLayout({
  children,
}: {
  children: ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && isAuthenticated) {
      router.replace("/dashboard");
    }
  }, [hydrated, isAuthenticated, router]);

  if (!hydrated || isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-foreground/20 border-t-foreground" />
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col">
      <PublicNavbar />
      <main className="flex flex-1 items-center justify-center py-12">
        {children}
      </main>
    </div>
  );
}
