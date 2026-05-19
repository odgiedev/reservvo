"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useUpdateRole } from "@/lib/hooks/useAuth";
import {
  useProvider,
  useCreateProvider,
  useUpdateProvider,
} from "@/lib/hooks/useProvider";
import type { Role } from "@/types";
import {
  providerSchema,
  type ProviderSchema,
} from "@/lib/validators/provider";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Skeleton } from "@/components/ui/Skeleton";
import { AxiosError } from "axios";

const ProfileSkeleton = (): ReactNode => (
  <div className="space-y-6">
    <Skeleton className="h-8 w-48" />
    <Skeleton className="h-[420px]" />
  </div>
);

export default function ProfilePage(): ReactNode {
  const role = useAuthStore((s) => s.role);
  const isProvider = role === "PROVIDER" || role === "BOTH";

  const { data: provider, isLoading, isError, error: fetchError } = useProvider(isProvider);
  const createMutation = useCreateProvider();
  const updateMutation = useUpdateProvider();

  const isNew = !provider && !isLoading && isProvider;
  const mutation = isNew ? createMutation : updateMutation;

  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty },
  } = useForm<ProviderSchema>({
    resolver: zodResolver(providerSchema),
    defaultValues: {
      businessName: "",
      slug: "",
      description: "",
      phone: "",
    },
  });

  useEffect(() => {
    if (provider) {
      reset({
        businessName: provider.businessName,
        slug: provider.slug,
        description: provider.description ?? "",
        phone: provider.phone ?? "",
      });
    }
  }, [provider, reset]);

  const onSubmit = (data: ProviderSchema): void => {
    setSuccessMsg(null);
    mutation.mutate(data, {
      onSuccess: () => {
        setSuccessMsg(
          isNew
            ? "Perfil de prestador criado com sucesso!"
            : "Perfil atualizado com sucesso!"
        );
      },
    });
  };

  const apiError =
    mutation.error instanceof AxiosError
      ? mutation.error.response?.data?.message || "Erro ao salvar perfil"
      : null;

  if (!isProvider) {
    return <RoleUpgradeSection currentRole="CLIENT" />;
  }

  if (isLoading) return <ProfileSkeleton />;

  if (isError && !(fetchError instanceof AxiosError && fetchError.response?.status === 404)) {
    return (
      <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
        Erro ao carregar perfil. Tente novamente mais tarde.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Perfil do Prestador
        </h1>
        <p className="mt-1 text-sm text-foreground/75">
          {isNew
            ? "Configure seu perfil de prestador para começar a receber reservas"
            : "Gerencie as informações do seu negócio"}
        </p>
      </div>

      <Card>
        <CardHeader
          title={isNew ? "Criar perfil" : "Editar perfil"}
          description={
            isNew
              ? "Preencha os dados do seu negócio"
              : "Atualize as informações abaixo"
          }
        />

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {apiError ? (
            <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {apiError}
            </div>
          ) : null}

          {successMsg ? (
            <div className="rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-600">
              {successMsg}
            </div>
          ) : null}

          <Input
            label="Nome do negócio"
            placeholder="Barbearia do João"
            error={errors.businessName?.message}
            {...register("businessName")}
          />

          <Input
            label="Slug (URL pública)"
            placeholder="barbearia-do-joao"
            error={errors.slug?.message}
            {...register("slug")}
          />

          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium text-foreground"
            >
              Descrição
            </label>
            <textarea
              id="description"
              rows={3}
              placeholder="Descreva seu negócio..."
              className="rounded-lg border border-foreground/20 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/55 focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
              {...register("description")}
            />
            {errors.description ? (
              <span className="text-xs text-red-500">
                {errors.description.message}
              </span>
            ) : null}
          </div>

          <Input
            label="Telefone"
            placeholder="(11) 99999-9999"
            error={errors.phone?.message}
            {...register("phone")}
          />

          <div className="flex items-center gap-3 pt-2">
            <Button
              type="submit"
              loading={mutation.isPending}
              disabled={!isNew && !isDirty}
            >
              {isNew ? "Criar perfil" : "Salvar alterações"}
            </Button>
            {!isNew && isDirty ? (
              <Button
                type="button"
                variant="ghost"
                onClick={() => reset()}
              >
                Descartar
              </Button>
            ) : null}
          </div>
        </form>
      </Card>

      {provider ? (
        <Card>
          <CardHeader
            title="Página pública"
            description="Compartilhe este link com seus clientes"
          />
          <div className="flex items-center gap-2 rounded-lg bg-foreground/5 px-4 py-3">
            <span className="truncate text-sm font-mono text-foreground/80">
              {typeof window !== "undefined" ? window.location.origin : ""}/booking/{provider.slug}
            </span>
          </div>
        </Card>
      ) : null}

      {role === "PROVIDER" ? <RoleUpgradeSection currentRole="PROVIDER" /> : null}
    </div>
  );
}

interface RoleUpgradeSectionProps {
  currentRole: "CLIENT" | "PROVIDER";
}

const RoleUpgradeSection = ({
  currentRole,
}: RoleUpgradeSectionProps): ReactNode => {
  const updateRoleMutation = useUpdateRole();
  const [confirming, setConfirming] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);


  const allOptions: { value: Role; title: string; description: string }[] = [
    {
      value: "PROVIDER",
      title: "Prestador",
      description:
        "Ofereça serviços e receba reservas. Você não poderá mais fazer reservas como cliente.",
    },
    {
      value: "BOTH",
      title: "Ambos (Cliente e Prestador)",
      description:
        "Ofereça serviços e continue podendo reservar em outros prestadores.",
    },
  ];

  const options =
    currentRole === "PROVIDER"
      ? allOptions.filter((o) => o.value === "BOTH")
      : allOptions;

  const [selectedRole, setSelectedRole] = useState<Role>(options[0].value);

  const apiError =
    updateRoleMutation.error instanceof AxiosError
      ? updateRoleMutation.error.response?.data?.message ||
        "Erro ao atualizar papel"
      : null;

  const handleUpgrade = (): void => {
    setSuccessMsg(null);
    updateRoleMutation.mutate(
      { role: selectedRole },
      {
        onSuccess: () => {
          setConfirming(false);
          setSuccessMsg(
            selectedRole === "PROVIDER"
              ? "Você agora é um Prestador! Configure seu perfil abaixo."
              : "Você agora pode atuar como Cliente e Prestador!"
          );
        },
      }
    );
  };

  const title =
    currentRole === "CLIENT"
      ? "Torne-se um Prestador"
      : "Atuar também como Cliente";
  const description =
    currentRole === "CLIENT"
      ? "Comece a oferecer seus serviços e receba reservas pela Reservvo"
      : "Além de receber reservas, faça reservas em outros prestadores";

  const wrapper =
    currentRole === "CLIENT" ? (
      <div>
        <h1 className="text-2xl font-bold text-foreground">Perfil</h1>
        <p className="mt-1 text-sm text-foreground/75">
          Papel atual: <strong>Cliente</strong>
        </p>
      </div>
    ) : null;

  const body = (
    <Card>
      <CardHeader title={title} description={description} />

      {apiError ? (
        <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
          {apiError}
        </div>
      ) : null}

      {successMsg ? (
        <div className="mb-4 rounded-lg bg-green-500/10 px-4 py-3 text-sm text-green-600">
          {successMsg}
        </div>
      ) : null}

      <div className="mb-4 rounded-lg border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-700 dark:text-amber-400">
        <strong>Atenção:</strong> esta ação é permanente. Após a mudança, você
        não poderá voltar ao papel atual.
      </div>

      <div className="space-y-3">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => setSelectedRole(opt.value)}
            aria-pressed={selectedRole === opt.value}
            className={`flex w-full flex-col items-start gap-1 rounded-lg border p-4 text-left transition-colors cursor-pointer ${
              selectedRole === opt.value
                ? "border-foreground bg-foreground/[0.03]"
                : "border-border hover:border-foreground/30"
            }`}
          >
            <div className="flex w-full items-center justify-between">
              <span className="text-sm font-semibold text-foreground">
                {opt.title}
              </span>
              <span
                className={`h-4 w-4 rounded-full border ${
                  selectedRole === opt.value
                    ? "border-foreground bg-foreground"
                    : "border-foreground/30"
                }`}
              />
            </div>
            <p className="text-xs text-foreground/75">{opt.description}</p>
          </button>
        ))}
      </div>

      <div className="mt-5 flex items-center gap-3">
        {confirming ? (
          <>
            <Button
              onClick={handleUpgrade}
              loading={updateRoleMutation.isPending}
            >
              Sim, mudar papel permanentemente
            </Button>
            <Button
              type="button"
              variant="ghost"
              onClick={() => setConfirming(false)}
              disabled={updateRoleMutation.isPending}
            >
              Cancelar
            </Button>
          </>
        ) : (
          <Button onClick={() => setConfirming(true)}>Confirmar mudança</Button>
        )}
      </div>
    </Card>
  );

  if (currentRole === "CLIENT") {
    return (
      <div className="space-y-6">
        {wrapper}
        {body}
      </div>
    );
  }

  return body;
};
