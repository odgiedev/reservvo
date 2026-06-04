"use client";

import { useState, type ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import {
  formatDateShort,
  formatTime,
  formatDateTime,
  statusLabel,
  statusVariant,
} from "@/lib/utils/format";
import type { ReservationResponse } from "@/types";

interface ReservationTableProps {
  reservations: ReservationResponse[];
  onCancel?: (reservation: ReservationResponse) => void;
  cancellingId?: string | null;
  perspective: "provider" | "client";
}

export const ReservationTable = ({
  reservations,
  onCancel,
  cancellingId,
  perspective,
}: ReservationTableProps): ReactNode => {
  if (reservations.length === 0) {
    return (
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
          <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
          <line x1="16" y1="2" x2="16" y2="6" />
          <line x1="8" y1="2" x2="8" y2="6" />
          <line x1="3" y1="10" x2="21" y2="10" />
        </svg>
        <p className="mt-4 text-sm text-foreground/55">
          Nenhuma reserva encontrada.
        </p>
      </div>
    );
  }

  const canCancel = (r: ReservationResponse): boolean =>
    r.status === "CONFIRMED";

  const [notesTarget, setNotesTarget] =
    useState<ReservationResponse | null>(null);

  const PhoneText = ({ phone }: { phone: string | undefined }): ReactNode =>
    phone ? (
      <p className="mt-0.5 text-xs text-foreground/65">{phone}</p>
    ) : null;

  const NotesButton = ({ r }: { r: ReservationResponse }): ReactNode =>
    r.notes ? (
      <button
        type="button"
        onClick={() => setNotesTarget(r)}
        className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-foreground/75 underline underline-offset-2 hover:text-foreground cursor-pointer"
        aria-label="Ver observação"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="12"
          height="12"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="8" y1="13" x2="16" y2="13" />
          <line x1="8" y1="17" x2="14" y2="17" />
        </svg>
        Ver observação
      </button>
    ) : null;

  return (
    <div className="overflow-x-auto">      <table className="hidden w-full md:table">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="pb-3 text-xs font-medium uppercase tracking-wider text-foreground/55">
              {perspective === "provider" ? "Cliente" : "Recurso"}
            </th>
            <th className="pb-3 text-xs font-medium uppercase tracking-wider text-foreground/55">
              Data
            </th>
            <th className="pb-3 text-xs font-medium uppercase tracking-wider text-foreground/55">
              Horário
            </th>
            <th className="pb-3 text-xs font-medium uppercase tracking-wider text-foreground/55">
              Status
            </th>
            <th className="pb-3 text-xs font-medium uppercase tracking-wider text-foreground/55">
              Criada em
            </th>
            {onCancel ? (
              <th className="pb-3 text-xs font-medium uppercase tracking-wider text-foreground/55">
                Ações
              </th>
            ) : null}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {reservations.map((r) => (
            <tr key={r.id}>
              <td className="py-3 pr-4">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {perspective === "provider"
                      ? r.clientName
                      : r.resourceName}
                  </p>
                  {perspective === "provider" ? (
                    <p className="text-xs text-foreground/65">
                      {r.clientEmail}
                    </p>
                  ) : r.providerName ? (
                    <p className="text-xs text-foreground/65">
                      {r.providerName}
                    </p>
                  ) : null}
                  <PhoneText
                    phone={
                      perspective === "provider"
                        ? r.clientPhone
                        : r.providerPhone
                    }
                  />
                  <NotesButton r={r} />
                </div>
              </td>
              <td className="py-3 pr-4 text-sm text-foreground/80">
                {formatDateShort(r.date)}
              </td>
              <td className="py-3 pr-4 text-sm text-foreground/80">
                {formatTime(r.startTime)}–{formatTime(r.endTime)}
              </td>
              <td className="py-3 pr-4">
                <Badge variant={statusVariant[r.status]}>
                  {statusLabel[r.status]}
                </Badge>
              </td>
              <td className="py-3 pr-4 text-sm text-foreground/65">
                {formatDateTime(r.createdAt)}
              </td>
              {onCancel ? (
                <td className="py-3">
                  {canCancel(r) ? (
                    <Button
                      variant="ghost"
                      onClick={() => onCancel(r)}
                      loading={cancellingId === r.id}
                      className="text-red-500 hover:bg-red-500/10 hover:text-red-600"
                    >
                      Cancelar
                    </Button>
                  ) : (
                    <span className="text-xs text-foreground/45">—</span>
                  )}
                </td>
              ) : null}
            </tr>
          ))}
        </tbody>
      </table>      <div className="space-y-3 md:hidden">
        {reservations.map((r) => (
          <div
            key={r.id}
            className="rounded-xl border border-border p-4 space-y-2"
          >
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-sm font-medium text-foreground">
                  {perspective === "provider"
                    ? r.clientName
                    : r.resourceName}
                </p>
                {perspective === "provider" ? (
                  <p className="text-xs text-foreground/65">{r.clientEmail}</p>
                ) : r.providerName ? (
                  <p className="text-xs text-foreground/65">
                    {r.providerName}
                  </p>
                ) : null}
                <PhoneText
                  phone={
                    perspective === "provider"
                      ? r.clientPhone
                      : r.providerPhone
                  }
                />
              </div>
              <Badge variant={statusVariant[r.status]}>
                {statusLabel[r.status]}
              </Badge>
            </div>

            <div className="flex items-center gap-3 text-xs text-foreground/75">
              <span>{formatDateShort(r.date)}</span>
              <span>
                {formatTime(r.startTime)}–{formatTime(r.endTime)}
              </span>
            </div>

            <NotesButton r={r} />

            {onCancel && canCancel(r) ? (
              <div className="pt-1">
                <Button
                  variant="ghost"
                  onClick={() => onCancel(r)}
                  loading={cancellingId === r.id}
                  className="text-red-500 hover:bg-red-500/10 hover:text-red-600 text-sm"
                >
                  Cancelar reserva
                </Button>
              </div>
            ) : null}
          </div>
        ))}
      </div>

      <Modal
        open={!!notesTarget}
        onClose={() => setNotesTarget(null)}
        title="Observação da reserva"
      >
        {notesTarget ? (
          <div className="space-y-4">
            <div className="rounded-lg bg-foreground/[0.03] p-3 text-sm text-foreground/75 space-y-1">
              <p>
                <span className="text-foreground/55">Recurso:</span>{" "}
                <span className="font-medium text-foreground">
                  {notesTarget.resourceName}
                </span>
              </p>
              <p>
                <span className="text-foreground/55">Cliente:</span>{" "}
                <span className="font-medium text-foreground">
                  {notesTarget.clientName}
                </span>
              </p>
              <p>
                <span className="text-foreground/55">Data:</span>{" "}
                <span className="font-medium text-foreground">
                  {formatDateShort(notesTarget.date)} · {formatTime(notesTarget.startTime)}
                </span>
              </p>
            </div>
            <p className="whitespace-pre-wrap text-base leading-relaxed text-foreground">
              {notesTarget.notes}
            </p>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};
