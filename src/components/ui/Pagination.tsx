"use client";

import { type ReactNode } from "react";
import { Button } from "./Button";

interface PaginationProps {
  page: number;
  totalPages: number;
  totalElements: number;
  size: number;
  onPageChange: (page: number) => void;
  isFetching?: boolean;
}

/**
 * Simple prev/next pager with page indicator. Page numbers are 0-based in
 * state (matches Spring Pageable) but displayed 1-based to the user.
 */
export const Pagination = ({
  page,
  totalPages,
  totalElements,
  size,
  onPageChange,
  isFetching,
}: PaginationProps): ReactNode => {
  if (totalElements === 0) return null;

  const from = page * size + 1;
  const to = Math.min((page + 1) * size, totalElements);
  const canPrev = page > 0;
  const canNext = page < totalPages - 1;

  return (
    <div className="flex flex-col items-center justify-between gap-3 border-t border-border pt-4 sm:flex-row">
      <p className="text-xs text-foreground/65">
        Mostrando{" "}
        <span className="font-medium text-foreground/80">
          {from}–{to}
        </span>{" "}
        de{" "}
        <span className="font-medium text-foreground/80">{totalElements}</span>
      </p>

      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          onClick={() => onPageChange(page - 1)}
          disabled={!canPrev || isFetching}
        >
          &larr; Anterior
        </Button>

        <span className="text-xs text-foreground/75 px-2">
          Página{" "}
          <span className="font-medium text-foreground">{page + 1}</span> de{" "}
          <span className="font-medium text-foreground">{totalPages}</span>
        </span>

        <Button
          variant="ghost"
          onClick={() => onPageChange(page + 1)}
          disabled={!canNext || isFetching}
        >
          Próxima &rarr;
        </Button>
      </div>
    </div>
  );
};
