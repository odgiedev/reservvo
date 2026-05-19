"use client";

import { type ReactNode } from "react";
import { useAuthStore } from "@/lib/stores/auth.store";
import {
  useProviderReservations,
  useClientReservations,
  useReservationStats,
} from "@/lib/hooks/useReservations";
import { Card, CardHeader } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import {
  formatDateShort,
  formatTime,
  statusLabel,
  statusVariant,
} from "@/lib/utils/format";
import type { ReservationResponse } from "@/types";

const StatCard = ({
  label,
  value,
}: {
  label: string;
  value: number;
}): ReactNode => (
  <Card>
    <p className="text-sm text-foreground/75">{label}</p>
    <p className="mt-1 text-2xl font-bold text-foreground sm:text-3xl">
      {value}
    </p>
  </Card>
);

const ReservationRow = ({
  reservation,
}: {
  reservation: ReservationResponse;
}): ReactNode => (
  <div className="flex items-center justify-between gap-2 border-b border-border py-3 last:border-b-0">
    <div className="min-w-0 flex-1">
      <p className="truncate text-sm font-medium text-foreground">
        {reservation.clientName}
      </p>
      <p className="truncate text-xs text-foreground/65">
        {reservation.resourceName} &middot;{" "}
        {formatDateShort(reservation.date)} &middot;{" "}
        {formatTime(reservation.startTime)}–{formatTime(reservation.endTime)}
      </p>
    </div>
    <Badge variant={statusVariant[reservation.status]} className="shrink-0">
      {statusLabel[reservation.status]}
    </Badge>
  </div>
);

const DashboardSkeleton = (): ReactNode => (
  <div className="space-y-6">
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
    <Skeleton className="h-64" />
  </div>
);

export default function DashboardPage(): ReactNode {
  const role = useAuthStore((s) => s.role);
  const name = useAuthStore((s) => s.name);
  const isProvider = role === "PROVIDER" || role === "BOTH";

  const providerQuery = useProviderReservations(0, 8);
  const clientQuery = useClientReservations(0, 8);
  const statsQuery = useReservationStats();

  const query = isProvider ? providerQuery : clientQuery;
  const { data, isLoading, isError } = query;
  const stats = statsQuery.data;

  if (isLoading || statsQuery.isLoading) return <DashboardSkeleton />;

  if (isError) {
    return (
      <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
        Erro ao carregar reservas. Tente novamente mais tarde.
      </div>
    );
  }

  const recent = data?.content ?? [];
  const cancelledTotal =
    (stats?.cancelledByProvider ?? 0) + (stats?.cancelledByClient ?? 0);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Olá, {name}!
        </h1>
        <p className="mt-1 text-sm text-foreground/75">
          {isProvider
            ? "Resumo das suas reservas como prestador"
            : "Resumo das suas reservas"}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Total" value={stats?.total ?? 0} />
        <StatCard label="Confirmadas" value={stats?.confirmed ?? 0} />
        <StatCard label="Concluídas" value={stats?.completed ?? 0} />
        <StatCard label="Canceladas" value={cancelledTotal} />
      </div>

      <Card>
        <CardHeader
          title="Reservas recentes"
          description="Últimas reservas registradas"
        />
        {recent.length === 0 ? (
          <p className="py-8 text-center text-sm text-foreground/55">
            Nenhuma reserva encontrada.
          </p>
        ) : (
          <div className="divide-y divide-border">
            {recent.map((reservation) => (
              <ReservationRow
                key={reservation.id}
                reservation={reservation}
              />
            ))}
          </div>
        )}
      </Card>
    </div>
  );
}
