import type { ReactNode } from "react";

interface BadgeProps {
  variant?: "default" | "success" | "warning" | "danger";
  children: ReactNode;
  className?: string;
}

const variants = {
  default: "bg-foreground/10 text-foreground",
  success: "bg-green-500/10 text-green-600",
  warning: "bg-yellow-500/10 text-yellow-600",
  danger: "bg-red-500/10 text-red-600",
};

export const Badge = ({
  variant = "default",
  children,
  className = "",
}: BadgeProps): ReactNode => (
  <span
    className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variants[variant]} ${className}`}
  >
    {children}
  </span>
);
