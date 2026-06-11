"use client";

import { useEffect, useState, useCallback, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { format, isSameDay, startOfDay, addYears } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useAuthStore } from "@/lib/stores/auth.store";
import { useProviderBySlug, usePublicResources } from "@/lib/hooks/useBooking";
import { useCreateReservation, useSlots } from "@/lib/hooks/useReservations";
import { DatePicker } from "@/components/features/DatePicker";
import { SlotPicker } from "@/components/features/SlotPicker";
import { Card, CardHeader } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { AxiosError } from "axios";

type Step = "resource" | "datetime" | "confirm" | "success";

export default function BookingPage(): ReactNode {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params.slug;

  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const authName = useAuthStore((s) => s.name);
  const authEmail = useAuthStore((s) => s.email);
  const authRole = useAuthStore((s) => s.role);
  const canBook = authRole === "CLIENT" || authRole === "BOTH";

  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    if (!isAuthenticated) {
      router.replace(
        `/login?redirect=${encodeURIComponent(`/booking/${slug}`)}`
      );
      return;
    }
    if (!canBook) {
      router.replace("/dashboard");
    }
  }, [hydrated, isAuthenticated, canBook, router, slug]);

  const {
    data: provider,
    isLoading: providerLoading,
    isError: providerError,
  } = useProviderBySlug(slug);

  const {
    data: resources,
    isLoading: resourcesLoading,
    isError: resourcesError,
  } = usePublicResources(provider?.id ?? "");

  const createMutation = useCreateReservation();

  const [step, setStep] = useState<Step>("resource");
  const [selectedResourceId, setSelectedResourceId] = useState<string>("");
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [notes, setNotes] = useState<string>("");

  const MAX_NOTES = 500;

  const activeResources = (resources ?? []).filter((r) => r.active);
  const selectedResource = activeResources.find(
    (r) => r.id === selectedResourceId
  );

  const dateStr = selectedDate ? format(selectedDate, "yyyy-MM-dd") : "";

  const today = startOfDay(new Date());
  const maxDate = addYears(today, 1);
  const todayStr = format(today, "yyyy-MM-dd");
  const { data: todaySlots } = useSlots(selectedResourceId, todayStr);

  const todayBlocked = (() => {
    if (!todaySlots) return false;
    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    return !todaySlots.some((slot) => {
      const [h, m] = slot.split(":").map(Number);
      return h * 60 + m > currentMinutes;
    });
  })();

  const isDateDisabled = useCallback(
    (date: Date): boolean => {
      if (!isSameDay(date, today)) return false;
      return todayBlocked;
    },
    [today, todayBlocked]
  );

  const handleResourceSelect = (resourceId: string): void => {
    setSelectedResourceId(resourceId);
    setSelectedDate(null);
    setSelectedSlot(null);
    setStep("datetime");
  };

  const handleDateSelect = (date: Date): void => {
    setSelectedDate(date);
    setSelectedSlot(null);
  };

  const handleSlotSelect = (slot: string): void => {
    setSelectedSlot(slot);
  };

  const handleContinueToConfirm = (): void => {
    setStep("confirm");
  };

  const handleConfirm = (): void => {
    if (!authName || !authEmail) return;
    const trimmed = notes.trim();
    createMutation.mutate(
      {
        resourceId: selectedResourceId,
        date: dateStr,
        startTime: selectedSlot ?? "",
        clientName: authName,
        clientEmail: authEmail,
        ...(trimmed ? { notes: trimmed } : {}),
      },
      { onSuccess: () => setStep("success") }
    );
  };

  const handleRestart = (): void => {
    setStep("resource");
    setSelectedResourceId("");
    setSelectedDate(null);
    setSelectedSlot(null);
    setNotes("");
    createMutation.reset();
  };

  const apiError =
    createMutation.error instanceof AxiosError
      ? createMutation.error.response?.data?.message ||
        "Erro ao criar reserva"
      : null;



  if (!hydrated || !isAuthenticated || !canBook) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Skeleton className="mb-2 h-8 w-64" />
        <Skeleton className="mb-8 h-5 w-40" />
      </div>
    );
  }



  if (providerLoading || resourcesLoading) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Skeleton className="mb-2 h-8 w-64" />
        <Skeleton className="mb-8 h-5 w-40" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} className="h-20" />
          ))}
        </div>
      </div>
    );
  }

  if (providerError || !provider) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <div className="py-8 text-center">
            <h2 className="text-lg font-semibold text-foreground">
              Prestador não encontrado
            </h2>
            <p className="mt-2 text-sm text-foreground/75">
              Verifique o link e tente novamente.
            </p>
          </div>
        </Card>
      </div>
    );
  }

  if (resourcesError) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
          Erro ao carregar recursos. Tente novamente mais tarde.
        </div>
      </div>
    );
  }



  if (step === "success") {
    return (
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Card>
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-500/10">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-green-600"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-foreground">
              Reserva confirmada!
            </h2>
            <p className="text-sm text-foreground/75">
              Sua reserva em <strong>{selectedResource?.name}</strong> no dia{" "}
              <strong>
                {selectedDate
                  ? format(selectedDate, "dd 'de' MMMM", { locale: ptBR })
                  : ""}
              </strong>{" "}
              às <strong>{selectedSlot?.slice(0, 5)}</strong> foi registrada
              com sucesso.
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button variant="secondary" onClick={handleRestart}>
                Fazer nova reserva
              </Button>
              <Link href="/reservations">
                <Button>Ver minhas reservas</Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    );
  }



  return (
    <div className="mx-auto max-w-2xl px-4 py-12">      <Link
        href="/dashboard"
        className="inline-block text-sm text-foreground/55 transition-colors hover:text-foreground/75 mb-6"
      >
        &larr; Voltar ao dashboard
      </Link>      <div className="mb-8">
        <h1 className="text-2xl font-bold text-foreground">
          {provider.businessName}
        </h1>
        {provider.description ? (
          <p className="mt-1 text-sm text-foreground/75">
            {provider.description}
          </p>
        ) : null}
      </div>      <div className="mb-6 flex items-center gap-2 text-xs text-foreground/55">
        {(
          [
            { key: "resource", label: "Recurso" },
            { key: "datetime", label: "Data e horário" },
            { key: "confirm", label: "Confirmar" },
          ] as const
        ).map((s, i) => (
          <div key={s.key} className="flex items-center gap-2">
            {i > 0 ? (
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="9 18 15 12 9 6" />
              </svg>
            ) : null}
            <span
              className={`rounded-full px-2.5 py-1 font-medium ${
                step === s.key
                  ? "bg-foreground text-background"
                  : "text-foreground/55"
              }`}
            >
              {s.label}
            </span>
          </div>
        ))}
      </div>      {step === "resource" ? (
        <Card>
          <CardHeader
            title="Escolha um recurso"
            description="Selecione o serviço ou espaço desejado"
          />
          {activeResources.length === 0 ? (
            <p className="py-8 text-center text-sm text-foreground/55">
              Nenhum recurso disponível para agendamento.
            </p>
          ) : (
            <div className="space-y-2">
              {activeResources.map((resource) => (
                <button
                  key={resource.id}
                  type="button"
                  onClick={() => handleResourceSelect(resource.id)}
                  className="flex w-full items-center justify-between rounded-lg border border-border p-4 text-left transition-colors hover:border-foreground/30 hover:bg-foreground/[0.02] cursor-pointer"
                >
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {resource.name}
                    </p>
                    {resource.description ? (
                      <p className="mt-0.5 text-xs text-foreground/65">
                        {resource.description}
                      </p>
                    ) : null}
                    <p className="mt-1 text-xs text-foreground/55">
                      Duração: {resource.slotDurationMin} min
                    </p>
                  </div>
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
              ))}
            </div>
          )}
        </Card>
      ) : null}      {step === "datetime" ? (
        <div className="space-y-6">
          <Card>
            <CardHeader
              title="Escolha a data"
              description={`Recurso: ${selectedResource?.name}`}
            />
            <DatePicker
              selected={selectedDate}
              onSelect={handleDateSelect}
              isDateDisabled={isDateDisabled}
              maxDate={maxDate}
            />
            <p className="mt-3 text-xs text-foreground/55">
              Agendamentos disponíveis para até 1 ano à frente.
            </p>
            {todayBlocked ? (
              <p className="mt-2 text-xs text-amber-600 dark:text-amber-400">
                Hoje não há mais horários disponíveis — selecione outra data.
              </p>
            ) : null}
          </Card>

          {selectedDate ? (
            <Card>
              <CardHeader
                title="Horários disponíveis"
                description={format(selectedDate, "EEEE, dd 'de' MMMM", {
                  locale: ptBR,
                })}
              />
              <SlotPicker
                resourceId={selectedResourceId}
                date={dateStr}
                selected={selectedSlot}
                onSelect={handleSlotSelect}
              />
            </Card>
          ) : null}

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              onClick={() => setStep("resource")}
            >
              Voltar
            </Button>
            <Button
              disabled={!selectedSlot}
              onClick={handleContinueToConfirm}
            >
              Continuar
            </Button>
          </div>
        </div>
      ) : null}      {step === "confirm" ? (
        <Card>
          <CardHeader
            title="Confirmar reserva"
            description="Confira os detalhes antes de confirmar"
          />

          {apiError ? (
            <div className="mb-4 rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
              {apiError}
            </div>
          ) : null}

          <dl className="space-y-3 rounded-lg bg-foreground/[0.03] p-4 text-sm">
            <div className="flex justify-between gap-4">
              <dt className="text-foreground/75">Recurso</dt>
              <dd className="font-medium text-foreground text-right">
                {selectedResource?.name}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-foreground/75">Data</dt>
              <dd className="font-medium text-foreground text-right">
                {selectedDate
                  ? format(selectedDate, "dd/MM/yyyy", { locale: ptBR })
                  : ""}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-foreground/75">Horário</dt>
              <dd className="font-medium text-foreground text-right">
                {selectedSlot?.slice(0, 5)}
              </dd>
            </div>
            <div className="flex justify-between gap-4 border-t border-border pt-3">
              <dt className="text-foreground/75">Cliente</dt>
              <dd className="font-medium text-foreground text-right">
                {authName}
              </dd>
            </div>
            <div className="flex justify-between gap-4">
              <dt className="text-foreground/75">E-mail</dt>
              <dd className="font-medium text-foreground text-right">
                {authEmail}
              </dd>
            </div>
          </dl>

          <div className="mt-5 flex flex-col gap-1.5">
            <label
              htmlFor="notes"
              className="text-sm font-medium text-foreground"
            >
              Observações{" "}
              <span className="font-normal text-foreground/55">(opcional)</span>
            </label>
            <textarea
              id="notes"
              rows={3}
              maxLength={MAX_NOTES}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Algum detalhe que o prestador deveria saber?"
              className="rounded-lg border border-foreground/20 bg-background px-3 py-2.5 text-sm text-foreground placeholder:text-foreground/55 focus:border-foreground/40 focus:outline-none focus:ring-2 focus:ring-foreground/20 resize-none"
            />
            <span className="text-right text-xs text-foreground/55">
              {notes.length}/{MAX_NOTES}
            </span>
          </div>

          <div className="mt-5 flex items-center gap-3">
            <Button
              type="button"
              variant="ghost"
              onClick={() => setStep("datetime")}
            >
              Voltar
            </Button>

            <Button onClick={handleConfirm} loading={createMutation.isPending}>
              Confirmar reserva
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  );
}
