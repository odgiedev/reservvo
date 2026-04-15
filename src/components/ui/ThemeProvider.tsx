"use client";

import { useEffect, type ReactNode } from "react";
import { useUIStore } from "@/lib/stores/ui.store";

const themes = {
  light: {
    "--background": "#ffffff",
    "--foreground": "#0a0a0a",
    "--border": "rgba(15, 23, 42, 0.18)",
    "--border-strong": "rgba(15, 23, 42, 0.28)",
    "--muted": "rgba(15, 23, 42, 0.04)",
    "--card": "#ffffff",
  },
  dark: {
    "--background": "#0a0a0a",
    "--foreground": "#ededed",
    "--border": "rgba(255, 255, 255, 0.12)",
    "--border-strong": "rgba(255, 255, 255, 0.22)",
    "--muted": "rgba(255, 255, 255, 0.04)",
    "--card": "#0a0a0a",
  },
} as const;

export const ThemeProvider = ({ children }: { children: ReactNode }): ReactNode => {
  const theme = useUIStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    const vars = themes[theme];
    Object.entries(vars).forEach(([key, value]) => {
      root.style.setProperty(key, value);
    });
  }, [theme]);

  return <>{children}</>;
};
