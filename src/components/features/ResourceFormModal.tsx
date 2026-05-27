"use client";

import { useEffect, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resourceSchema, type ResourceSchema } from "@/lib/validators/resource";
import {
  useCreateResource,
  useUpdateResource,
} from "@/lib/hooks/useResources";
import { Modal } from "@/components/ui/Modal";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { AxiosError } from "axios";
import type { ResourceResponse } from "@/types";

interface ResourceFormModalProps {
  open: boolean;
  onClose: () => void;
  resource?: ResourceResponse | null;
}

export const ResourceFormModal = ({
  open,
  onClose,
  resource,
}: ResourceFormModalProps): ReactNode => {
  const isEditing = !!resource;
  const createMutation = useCreateResource();
  const updateMutation = useUpdateResource();
  const mutation = isEditing ? updateMutation : createMutation;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ResourceSchema>({
    resolver: zodResolver(resourceSchema),
    defaultValues: {
      name: "",
      description: "",
      slotDurationMin: 30,
    },
  });

  useEffect(() => {
    if (open) {
      if (resource) {
        reset({
          name: resource.name,
          description: resource.description ?? "",
          slotDurationMin: resource.slotDurationMin,
        });
      } else {
        reset({ name: "", description: "", slotDurationMin: 30 });
      }
    }
  }, [open, resource, reset]);

  const onSubmit = (data: ResourceSchema): void => {
    if (isEditing && resource) {
      updateMutation.mutate(
        { id: resource.id, data },
        { onSuccess: () => onClose() }
      );
    } else {
      createMutation.mutate(data, { onSuccess: () => onClose() });
    }
  };

  const apiError =
    mutation.error instanceof AxiosError
      ? mutation.error.response?.data?.message || "Erro ao salvar recurso"
      : null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={isEditing ? "Editar recurso" : "Novo recurso"}
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {apiError ? (
          <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {apiError}
          </div>
        ) : null}

        <Input
          label="Nome"
          placeholder="Ex: Sala de reunião, Quadra 1..."
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="resource-description"
            className="text-sm font-medium text-foreground"
          >
            Descrição
          </label>
          <textarea
            id="resource-description"
            rows={2}
            placeholder="Descrição opcional..."
            className="rounded-lg border border-foreground/20 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/55 focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
            {...register("description")}
          />
        </div>

        <Input
          label="Duração do slot (minutos)"
          type="number"
          min={15}
          step={5}
          placeholder="30"
          error={errors.slotDurationMin?.message}
          {...register("slotDurationMin", { valueAsNumber: true })}
        />

        <div className="flex items-center justify-end gap-3 pt-2">
          <Button type="button" variant="ghost" onClick={onClose}>
            Cancelar
          </Button>
          <Button type="submit" loading={mutation.isPending}>
            {isEditing ? "Salvar" : "Criar"}
          </Button>
        </div>
      </form>
    </Modal>
  );
};
