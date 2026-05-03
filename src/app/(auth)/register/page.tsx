"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { registerSchema, type RegisterSchema } from "@/lib/validators/auth";
import { useRegister } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AxiosError } from "axios";

export default function RegisterPage(): ReactNode {
  const { mutate, isPending, error } = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: "BOTH",
    },
  });

  const selectedRole = watch("role");

  const onSubmit = (data: RegisterSchema): void => {
    mutate(data);
  };

  const apiError =
    error instanceof AxiosError
      ? error.response?.data?.message || "Erro ao criar conta"
      : null;

  return (
    <div className="w-full max-w-sm space-y-8 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Criar conta
        </h1>
        <p className="mt-2 text-sm text-foreground/75">
          Cadastre-se para começar a usar o Reservvo
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {apiError ? (
          <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {apiError}
          </div>
        ) : null}

        <Input
          label="Nome"
          type="text"
          placeholder="Seu nome completo"
          autoComplete="name"
          error={errors.name?.message}
          {...register("name")}
        />

        <div className="space-y-1.5">
          <Input
            label="E-mail"
            type="email"
            placeholder="seu@email.com"
            autoComplete="email"
            error={errors.email?.message}
            {...register("email")}
          />
          <p className="flex items-start gap-1.5 text-xs text-amber-600 dark:text-amber-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 shrink-0"
              aria-hidden="true"
            >
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
              <line x1="12" x2="12" y1="9" y2="13" />
              <line x1="12" x2="12.01" y1="17" y2="17" />
            </svg>
            Use um e-mail próprio e válido — em breve será necessário confirmar o endereço para acessar a plataforma.
          </p>
        </div>

        <Input
          label="Senha"
          type="password"
          placeholder="••••••"
          autoComplete="new-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-foreground">
            Tipo de conta
          </label>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
            {(
              [
                { value: "CLIENT", label: "Cliente", desc: "Agende serviços" },
                { value: "PROVIDER", label: "Prestador", desc: "Ofereça serviços" },
                { value: "BOTH", label: "Ambos", desc: "Agende e ofereça" },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setValue("role", option.value)}
                aria-pressed={selectedRole === option.value}
                className={`rounded-lg border px-3 py-2.5 text-left transition-colors cursor-pointer sm:text-center ${
                  selectedRole === option.value
                    ? "border-foreground bg-foreground text-background"
                    : "border-foreground/20 text-foreground hover:bg-foreground/5"
                }`}
              >
                <span className="text-sm font-medium">{option.label}</span>
                <span
                  className={`block text-xs mt-0.5 ${
                    selectedRole === option.value
                      ? "text-background/70"
                      : "text-foreground/65"
                  }`}
                >
                  {option.desc}
                </span>
              </button>
            ))}
          </div>
          {errors.role ? (
            <span className="text-xs text-red-500">
              {errors.role.message}
            </span>
          ) : null}
        </div>

        <Button type="submit" loading={isPending} className="w-full">
          Criar conta
        </Button>
      </form>

      <p className="text-center text-sm text-foreground/75">
        Já tem uma conta?{" "}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/90"
        >
          Entrar
        </Link>
      </p>
    </div>
  );
}
