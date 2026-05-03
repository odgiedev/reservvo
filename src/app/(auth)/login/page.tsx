"use client";

import { type ReactNode } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema, type LoginSchema } from "@/lib/validators/auth";
import { useLogin } from "@/lib/hooks/useAuth";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { AxiosError } from "axios";

export default function LoginPage(): ReactNode {
  const { mutate, isPending, error } = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginSchema): void => {
    mutate(data);
  };

  const apiError =
    error instanceof AxiosError
      ? error.response?.data?.message || "Erro ao fazer login"
      : null;

  return (
    <div className="w-full max-w-sm space-y-8 px-4">
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Entrar no Reservvo
        </h1>
        <p className="mt-2 text-sm text-foreground/75">
          Faça login para acessar sua conta
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {apiError ? (
          <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
            {apiError}
          </div>
        ) : null}

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          error={errors.email?.message}
          {...register("email")}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••"
          autoComplete="current-password"
          error={errors.password?.message}
          {...register("password")}
        />

        <Button type="submit" loading={isPending} className="w-full">
          Entrar
        </Button>
      </form>

      <p className="text-center text-sm text-foreground/75">
        Não tem uma conta?{" "}
        <a
          href="/register"
          className="font-medium text-foreground underline underline-offset-4 hover:text-foreground/90"
        >
          Criar conta
        </a>
      </p>
    </div>
  );
}
