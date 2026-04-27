import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = ({ children, className = "" }: CardProps): ReactNode => (
  <div
    className={`rounded-xl border border-border bg-background p-4 sm:p-6 ${className}`}
  >
    {children}
  </div>
);

interface CardHeaderProps {
  title: string;
  description?: string;
  action?: ReactNode;
}

export const CardHeader = ({
  title,
  description,
  action,
}: CardHeaderProps): ReactNode => (
  <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
    <div>
      <h3 className="text-base font-semibold text-foreground sm:text-lg">
        {title}
      </h3>
      {description ? (
        <p className="mt-0.5 text-sm text-foreground/75">{description}</p>
      ) : null}
    </div>
    {action ? action : null}
  </div>
);
