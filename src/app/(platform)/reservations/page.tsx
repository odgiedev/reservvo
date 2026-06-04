"use client";

import { useState, type ReactNode } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import {
  useProviderReservations,
  useClientReservations,
  useCancelReservationAsProvider,
  useCancelReservationAsClient,
} from "@/lib/hooks/useReservations";
import { ReservationTable } from "@/components/features/ReservationTable";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Pagination } from "@/components/ui/Pagination";
import { Skeleton } from "@/components/ui/Skeleton";
import type { ReservationResponse, ReservationStatus } from "@/types";

type ViewTab = "provider" | "client";
type StatusFilter = "all" | ReservationStatus;

const PAGE_SIZE = 20;

const STATUS_FILTERS: { value: StatusFilter; label: string }[] = [
  { value: "all", label: "Todas" },
  { value: "CONFIRMED", label: "Confirmadas" },
  { value: "COMPLETED", label: "Concluídas" },
  { value: "CANCELLED_BY_PROVIDER", label: "Canceladas (prestador)" },
  { value: "CANCELLED_BY_CLIENT", label: "Canceladas (cliente)" },
];

const ReservationsSkeleton = (): ReactNode => (
  <div className="space-y-6">
    <div className="flex items-center justify-between">
      <Skeleton className="h-8 w-40" />
    </div>
    <div className="space-y-2">
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-16" />
      ))}
    </div>
  </div>
);

export default function ReservationsPage(): ReactNode {
  const role = useAuthStore((s) => s.role);
  const isProvider = role === "PROVIDER" || role === "BOTH";
  const isClient = role === "CLIENT" || role === "BOTH";
  const hasBothViews = isProvider && isClient;

  const [activeTab, setActiveTab] = useState<ViewTab>(
    isProvider ? "provider" : "client"
  );
  const [providerPage, setProviderPage] = useState(0);
  const [clientPage, setClientPage] = useState(0);
  const [providerStatus, setProviderStatus] =
    useState<StatusFilter>("CONFIRMED");
  const [clientStatus, setClientStatus] = useState<StatusFilter>("CONFIRMED");
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmTarget, setConfirmTarget] =
    useState<ReservationResponse | null>(null);

  const isProviderView = activeTab === "provider";
  const page = isProviderView ? providerPage : clientPage;
  const setPage = isProviderView ? setProviderPage : setClientPage;
  const statusFilter = isProviderView ? providerStatus : clientStatus;
  const setStatusFilter = isProviderView
    ? setProviderStatus
    : setClientStatus;

  const providerStatusParam =
    providerStatus === "all" ? undefined : providerStatus;
  const clientStatusParam = clientStatus === "all" ? undefined : clientStatus;

  const providerQuery = useProviderReservations(
    providerPage,
    PAGE_SIZE,
    providerStatusParam
  );
  const clientQuery = useClientReservations(
    clientPage,
    PAGE_SIZE,
    clientStatusParam
  );

  const cancelAsProvider = useCancelReservationAsProvider();
  const cancelAsClient = useCancelReservationAsClient();

  const query = isProviderView ? providerQuery : clientQuery;
  const { data, isLoading, isError, isFetching } = query;

  const handleStatusChange = (value: StatusFilter): void => {
    setStatusFilter(value);
    setPage(0);
  };

  const handleCancelRequest = (reservation: ReservationResponse): void => {
    setConfirmTarget(reservation);
  };

  const handleCancelConfirm = (): void => {
    if (!confirmTarget) return;

    setCancellingId(confirmTarget.id);
    const mutation = isProviderView ? cancelAsProvider : cancelAsClient;
    mutation.mutate(
      {
        id: confirmTarget.id,
        resourceId: confirmTarget.resourceId,
        date: confirmTarget.date,
      },
      {
        onSettled: () => {
          setCancellingId(null);
          setConfirmTarget(null);
        },
      }
    );
  };

  if (isLoading) return <ReservationsSkeleton />;

  if (isError) {
    return (
      <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
        Erro ao carregar reservas. Tente novamente mais tarde.
      </div>
    );
  }

  const reservations = data?.content ?? [];
  const totalElements = data?.totalElements ?? 0;
  const totalPages = data?.totalPages ?? 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Reservas</h1>
        <p className="mt-1 text-sm text-foreground/75">
          {isProviderView
            ? "Gerencie as reservas dos seus clientes"
            : "Acompanhe suas reservas"}
        </p>
      </div>      {hasBothViews ? (
        <div
          className="flex gap-1 rounded-lg bg-foreground/5 p-1 w-full sm:w-fit"
          role="tablist"
          aria-label="Visualização de reservas"
        >
          {(
            [
              { value: "provider", label: "Como prestador" },
              { value: "client", label: "Como cliente" },
            ] as const
          ).map((tab) => (
            <button
              key={tab.value}
              role="tab"
              aria-selected={activeTab === tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={`flex-1 rounded-md px-4 py-2 text-sm font-medium transition-colors cursor-pointer sm:flex-none ${
                activeTab === tab.value
                  ? "bg-background text-foreground shadow-sm"
                  : "text-foreground/65 hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      ) : null}      <div
        className="flex flex-wrap items-center gap-2"
        role="group"
        aria-label="Filtrar por status"
      >
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.value}
            onClick={() => handleStatusChange(f.value)}
            aria-pressed={statusFilter === f.value}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-sm font-medium transition-colors cursor-pointer ${
              statusFilter === f.value
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/20 text-foreground/75 hover:border-foreground/40 hover:text-foreground"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>      <ReservationTable
        reservations={reservations}
        onCancel={handleCancelRequest}
        cancellingId={cancellingId}
        perspective={activeTab}
      />      <Pagination
        page={page}
        totalPages={totalPages}
        totalElements={totalElements}
        size={PAGE_SIZE}
        onPageChange={setPage}
        isFetching={isFetching}
      />      <ConfirmModal
        open={!!confirmTarget}
        onClose={() => setConfirmTarget(null)}
        onConfirm={handleCancelConfirm}
        title="Cancelar reserva"
        description={
          isProviderView
            ? `Tem certeza que deseja cancelar a reserva de "${confirmTarget?.clientName}"?`
            : `Tem certeza que deseja cancelar sua reserva em "${confirmTarget?.resourceName}"?`
        }
        confirmLabel="Cancelar reserva"
        cancelLabel="Voltar"
        variant="danger"
        loading={cancellingId === confirmTarget?.id}
      />
    </div>
  );
}
