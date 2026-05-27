"use client";

import { useState, useMemo, type ReactNode } from "react";
import Link from "next/link";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useProvider } from "@/lib/hooks/useProvider";
import {
  useResources,
  useUpdateResourceActive,
  useDeleteResource,
} from "@/lib/hooks/useResources";
import { ResourceCard } from "@/components/features/ResourceCard";
import { ResourceFormModal } from "@/components/features/ResourceFormModal";
import { AvailabilityEditor } from "@/components/features/AvailabilityEditor";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ResourceResponse } from "@/types";

type ResourceFilter = "all" | "active" | "inactive";

export default function ResourcesPage(): ReactNode {
  const role = useAuthStore((s) => s.role);
  const isProvider = role === "PROVIDER" || role === "BOTH";

  const { data: provider } = useProvider(isProvider);
  const { data: resources, isLoading, isError } = useResources();
  const toggleActiveMutation = useUpdateResourceActive();
  const deleteMutation = useDeleteResource();

  const [formOpen, setFormOpen] = useState(false);
  const [editingResource, setEditingResource] =
    useState<ResourceResponse | null>(null);

  const [availabilityOpen, setAvailabilityOpen] = useState(false);
  const [availabilityResource, setAvailabilityResource] =
    useState<ResourceResponse | null>(null);

  const [toggleTarget, setToggleTarget] = useState<ResourceResponse | null>(
    null
  );
  const [deleteTarget, setDeleteTarget] = useState<ResourceResponse | null>(
    null
  );

  const [filter, setFilter] = useState<ResourceFilter>("all");

  const list = resources ?? [];

  const filtered = useMemo(() => {
    if (filter === "active") return list.filter((r) => r.active);
    if (filter === "inactive") return list.filter((r) => !r.active);
    return list;
  }, [list, filter]);

  const activeCount = list.filter((r) => r.active).length;
  const inactiveCount = list.filter((r) => !r.active).length;

  const handleCreate = (): void => {
    setEditingResource(null);
    setFormOpen(true);
  };

  const handleEdit = (resource: ResourceResponse): void => {
    setEditingResource(resource);
    setFormOpen(true);
  };

  const handleToggleActive = (resource: ResourceResponse): void => {
    setToggleTarget(resource);
  };

  const handleToggleConfirm = (): void => {
    if (!toggleTarget) return;
    toggleActiveMutation.mutate(
      { id: toggleTarget.id, active: !toggleTarget.active },
      { onSettled: () => setToggleTarget(null) }
    );
  };

  const handleDelete = (resource: ResourceResponse): void => {
    setDeleteTarget(resource);
  };

  const handleDeleteConfirm = (): void => {
    if (!deleteTarget) return;
    deleteMutation.mutate(deleteTarget.id, {
      onSettled: () => setDeleteTarget(null),
    });
  };

  const handleAvailability = (resource: ResourceResponse): void => {
    setAvailabilityResource(resource);
    setAvailabilityOpen(true);
  };

  const handleFormClose = (): void => {
    setFormOpen(false);
    setEditingResource(null);
  };

  const handleAvailabilityClose = (): void => {
    setAvailabilityOpen(false);
    setAvailabilityResource(null);
  };

  if (!isProvider) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-foreground">Recursos</h1>
        <div className="rounded-xl border border-dashed border-foreground/20 p-8 text-center">
          <p className="text-sm text-foreground/75">
            Esta página é exclusiva para prestadores de serviço.
          </p>
          <p className="mt-2 text-sm text-foreground/75">
            Torne-se um prestador em{" "}
            <Link
              href="/profile"
              className="font-medium text-foreground underline underline-offset-4"
            >
              seu perfil
            </Link>
            .
          </p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Skeleton className="h-8 w-40" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
        Erro ao carregar recursos. Tente novamente mais tarde.
      </div>
    );
  }

  const FILTERS: { value: ResourceFilter; label: string; count: number }[] = [
    { value: "all", label: "Todos", count: list.length },
    { value: "active", label: "Ativos", count: activeCount },
    { value: "inactive", label: "Inativos", count: inactiveCount },
  ];

  const isDeactivating = toggleTarget?.active === true;

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Recursos</h1>
          {provider ? (
            <p className="mt-1 text-sm text-foreground/75">
              <span className="font-medium text-foreground">
                {provider.businessName}
              </span>
              <span className="text-foreground/55"> · {provider.slug}</span>
            </p>
          ) : (
            <p className="mt-1 text-sm text-foreground/75">
              Gerencie seus recursos e configure a disponibilidade de cada um
            </p>
          )}
        </div>
        <Button onClick={handleCreate}>+ Novo recurso</Button>
      </div>      {list.length > 0 ? (
        <div
          className="flex items-center gap-2"
          role="group"
          aria-label="Filtrar recursos"
        >
          {FILTERS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              aria-pressed={filter === f.value}
              className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
                filter === f.value
                  ? "border-foreground bg-foreground text-background"
                  : "border-foreground/20 text-foreground/75 hover:border-foreground/40 hover:text-foreground"
              }`}
            >
              {f.label}
              <span className="ml-1.5 opacity-60">{f.count}</span>
            </button>
          ))}
        </div>
      ) : null}

      {list.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-foreground/20 py-16">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-foreground/30"
          >
            <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          </svg>
          <p className="mt-4 text-sm text-foreground/55">
            Nenhum recurso cadastrado.
          </p>
          <Button onClick={handleCreate} className="mt-4">
            Criar primeiro recurso
          </Button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-foreground/20 py-16">
          <p className="text-sm text-foreground/55">
            Nenhum recurso {filter === "active" ? "ativo" : "inativo"} encontrado.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((resource) => (
            <ResourceCard
              key={resource.id}
              resource={resource}
              onEdit={handleEdit}
              onToggleActive={handleToggleActive}
              onDelete={handleDelete}
              onAvailability={handleAvailability}
            />
          ))}
        </div>
      )}

      <ResourceFormModal
        open={formOpen}
        onClose={handleFormClose}
        resource={editingResource}
      />

      {availabilityResource ? (
        <AvailabilityEditor
          open={availabilityOpen}
          onClose={handleAvailabilityClose}
          resourceId={availabilityResource.id}
          resourceName={availabilityResource.name}
        />
      ) : null}      <ConfirmModal
        open={!!toggleTarget}
        onClose={() => setToggleTarget(null)}
        onConfirm={handleToggleConfirm}
        title={
          isDeactivating
            ? `Desativar "${toggleTarget?.name ?? ""}"`
            : `Reativar "${toggleTarget?.name ?? ""}"`
        }
        description={
          isDeactivating
            ? "O recurso será desativado e não aparecerá mais na página de agendamento. Você pode reativá-lo a qualquer momento."
            : "O recurso voltará a ficar disponível na página de agendamento."
        }
        confirmLabel={isDeactivating ? "Desativar" : "Reativar"}
        cancelLabel="Voltar"
        variant={isDeactivating ? "danger" : "default"}
        loading={toggleActiveMutation.isPending}
      />      <ConfirmModal
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        title={`Apagar "${deleteTarget?.name ?? ""}"`}
        description="Esta ação é permanente e não pode ser desfeita. Todas as regras de disponibilidade associadas também serão removidas."
        confirmLabel="Apagar permanentemente"
        cancelLabel="Voltar"
        variant="danger"
        loading={deleteMutation.isPending}
      />
    </div>
  );
}
