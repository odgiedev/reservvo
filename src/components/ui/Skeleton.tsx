import type { ReactNode } from "react";

interface SkeletonProps {
  className?: string;
}

export const Skeleton = ({ className = "" }: SkeletonProps): ReactNode => (
  <div
    className={`animate-pulse rounded-lg bg-foreground/10 ${className}`}
    aria-hidden="true"
  />
);
