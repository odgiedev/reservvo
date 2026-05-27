"use client";

import { type ReactNode } from "react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import type { ResourceResponse } from "@/types";

interface ResourceCardProps {
  resource: ResourceResponse;
  onEdit: (resource: ResourceResponse) => void;
  onToggleActive: (resource: ResourceResponse) => void;
  onDelete: (resource: ResourceResponse) => void;
  onAvailability: (resource: ResourceResponse) => void;
}

export const ResourceCard = ({
  resource,
  onEdit,
  onToggleActive,
  onDelete,
  onAvailability,
}: ResourceCardProps): ReactNode => (
  <Card
    className={`flex flex-col justify-between ${
      !resource.active ? "opacity-70" : ""
    }`}
  >
    <div>
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-foreground truncate">
          {resource.name}
        </h3>
        <Badge variant={resource.active ? "success" : "danger"}>
          {resource.active ? "Ativo" : "Inativo"}
        </Badge>
      </div>

      {resource.description ? (
        <p className="mt-1.5 text-sm text-foreground/75 line-clamp-2">
          {resource.description}
        </p>
      ) : null}

      <p className="mt-3 text-xs text-foreground/55">
        Slot: {resource.slotDurationMin} min
      </p>
    </div>

    <div className="mt-4 grid grid-cols-2 gap-2 border-t border-border pt-4 sm:flex sm:flex-wrap sm:items-center">
      {resource.active ? (
        <>
          <Button
            variant="secondary"
            onClick={() => onAvailability(resource)}
            className="col-span-2 sm:col-auto"
          >
            Horários
          </Button>
          <Button variant="ghost" onClick={() => onEdit(resource)}>
            Editar
          </Button>
          <Button
            variant="ghost"
            onClick={() => onToggleActive(resource)}
            className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
          >
            Desativar
          </Button>
        </>
      ) : (
        <>
          <Button variant="ghost" onClick={() => onEdit(resource)}>
            Editar
          </Button>
          <Button
            variant="ghost"
            onClick={() => onToggleActive(resource)}
            className="text-green-600 hover:bg-green-500/10 hover:text-green-700"
          >
            Reativar
          </Button>
          <Button
            variant="ghost"
            onClick={() => onDelete(resource)}
            className="col-span-2 text-red-500 hover:bg-red-500/10 hover:text-red-600 sm:col-auto"
          >
            Apagar
          </Button>
        </>
      )}
    </div>
  </Card>
);
