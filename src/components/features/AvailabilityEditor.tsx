"use client";

import { useState, useEffect, type ReactNode } from "react";
import {
  useAvailability,
  useUpdateAvailability,
} from "@/lib/hooks/useResources";
import { Modal } from "@/components/ui/Modal";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import type { AvailabilityRuleRequest } from "@/types";

const DAY_LABELS = [
  "Domingo",
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
];

const DAY_LABELS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

interface AvailabilityEditorProps {
  open: boolean;
  onClose: () => void;
  resourceId: string;
  resourceName: string;
}

interface RuleRow {
  key: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

const generateKey = (): string => Math.random().toString(36).slice(2, 10);

export const AvailabilityEditor = ({
  open,
  onClose,
  resourceId,
  resourceName,
}: AvailabilityEditorProps): ReactNode => {
  const { data: existing, isLoading } = useAvailability(resourceId);
  const updateMutation = useUpdateAvailability();
  const [rules, setRules] = useState<RuleRow[]>([]);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [confirmDiscard, setConfirmDiscard] = useState(false);



  const baseline = (existing ?? []).map((r) => ({
    dayOfWeek: r.dayOfWeek,
    startTime: r.startTime.slice(0, 5),
    endTime: r.endTime.slice(0, 5),
  }));

  useEffect(() => {
    if (existing) {
      setRules(
        existing.map((r) => ({
          key: generateKey(),
          dayOfWeek: r.dayOfWeek,
          startTime: r.startTime.slice(0, 5),
          endTime: r.endTime.slice(0, 5),
        }))
      );
    }
  }, [existing]);

  const isDirty = (() => {
    const current = rules.map((r) => ({
      dayOfWeek: r.dayOfWeek,
      startTime: r.startTime,
      endTime: r.endTime,
    }));
    if (current.length !== baseline.length) return true;

    const sortKey = (x: { dayOfWeek: number; startTime: string; endTime: string }) =>
      `${x.dayOfWeek}-${x.startTime}-${x.endTime}`;
    const a = [...current].map(sortKey).sort();
    const b = [...baseline].map(sortKey).sort();
    return a.some((v, i) => v !== b[i]);
  })();

  const handleCloseRequest = (): void => {
    if (isDirty) {
      setConfirmDiscard(true);
      return;
    }
    onClose();
  };

  const handleDiscardConfirm = (): void => {
    setConfirmDiscard(false);
    onClose();
  };

  const addRule = (): void => {
    setRules((prev) => [
      ...prev,
      {
        key: generateKey(),
        dayOfWeek: 1,
        startTime: "08:00",
        endTime: "18:00",
      },
    ]);
  };

  const removeRule = (key: string): void => {
    setRules((prev) => prev.filter((r) => r.key !== key));
  };

  const updateRule = (
    key: string,
    field: keyof Omit<RuleRow, "key">,
    value: string | number
  ): void => {
    setRules((prev) =>
      prev.map((r) => (r.key === key ? { ...r, [field]: value } : r))
    );
    setValidationError(null);
  };

  const validate = (): boolean => {
    for (const rule of rules) {
      if (rule.startTime >= rule.endTime) {
        setValidationError(
          `${DAY_LABELS[rule.dayOfWeek]}: horário de início deve ser anterior ao fim`
        );
        return false;
      }
    }

    const seen = new Set<number>();
    for (const rule of rules) {
      if (seen.has(rule.dayOfWeek)) {
        setValidationError(
          `${DAY_LABELS[rule.dayOfWeek]} aparece mais de uma vez. Configure apenas uma faixa de horário por dia.`
        );
        return false;
      }
      seen.add(rule.dayOfWeek);
    }
    setValidationError(null);
    return true;
  };

  const usedDays = new Set(rules.map((r) => r.dayOfWeek));
  const hasDuplicateDays = usedDays.size !== rules.length;

  const handleSave = (): void => {
    if (!validate()) return;

    const payload: AvailabilityRuleRequest[] = rules.map((r) => ({
      dayOfWeek: r.dayOfWeek,
      startTime: r.startTime,
      endTime: r.endTime,
    }));

    updateMutation.mutate(
      { resourceId, data: payload },
      { onSuccess: () => onClose() }
    );
  };

  return (
    <Modal
      open={open}
      onClose={handleCloseRequest}
      title={`Disponibilidade — ${resourceName}`}
    >
      <div className="space-y-4">
        {isLoading ? (
          <div className="space-y-3">
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
            <Skeleton className="h-12" />
          </div>
        ) : (
          <>
            {validationError ? (
              <div className="rounded-lg bg-red-500/10 px-4 py-3 text-sm text-red-500">
                {validationError}
              </div>
            ) : null}

            {rules.length === 0 ? (
              <p className="py-6 text-center text-sm text-foreground/55">
                Nenhuma regra de disponibilidade configurada.
              </p>
            ) : (
              <div className="max-h-80 space-y-3 overflow-y-auto pr-1">
                {rules.map((rule) => (
                  <div
                    key={rule.key}
                    className="rounded-lg border border-border p-3"
                  >                    <div className="hidden items-center gap-2 sm:flex">
                      <select
                        value={rule.dayOfWeek}
                        onChange={(e) =>
                          updateRule(
                            rule.key,
                            "dayOfWeek",
                            Number(e.target.value)
                          )
                        }
                        aria-label="Dia da semana"
                        className="flex-1 rounded-lg border border-foreground/20 bg-background px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer"
                      >
                        {DAY_LABELS.map((label, i) => (
                          <option key={i} value={i}>
                            {label}
                          </option>
                        ))}
                      </select>

                      <input
                        type="time"
                        value={rule.startTime}
                        onChange={(e) =>
                          updateRule(rule.key, "startTime", e.target.value)
                        }
                        aria-label="Horário de início"
                        className="w-24 rounded-lg border border-foreground/20 bg-background px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      />

                      <span className="text-xs text-foreground/55">até</span>

                      <input
                        type="time"
                        value={rule.endTime}
                        onChange={(e) =>
                          updateRule(rule.key, "endTime", e.target.value)
                        }
                        aria-label="Horário de fim"
                        className="w-24 rounded-lg border border-foreground/20 bg-background px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                      />

                      <button
                        type="button"
                        onClick={() => removeRule(rule.key)}
                        className="rounded-lg p-1.5 text-foreground/45 hover:bg-red-500/10 hover:text-red-500 cursor-pointer"
                        aria-label="Remover regra"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>                    <div className="flex flex-col gap-2 sm:hidden">
                      <div className="flex items-center justify-between">
                        <select
                          value={rule.dayOfWeek}
                          onChange={(e) =>
                            updateRule(
                              rule.key,
                              "dayOfWeek",
                              Number(e.target.value)
                            )
                          }
                          aria-label="Dia da semana"
                          className="flex-1 rounded-lg border border-foreground/20 bg-background px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20 cursor-pointer"
                        >
                          {DAY_LABELS_SHORT.map((label, i) => (
                            <option key={i} value={i}>
                              {label}
                            </option>
                          ))}
                        </select>

                        <button
                          type="button"
                          onClick={() => removeRule(rule.key)}
                          className="ml-2 rounded-lg p-1.5 text-foreground/45 hover:bg-red-500/10 hover:text-red-500 cursor-pointer"
                          aria-label="Remover regra"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          >
                            <polyline points="3 6 5 6 21 6" />
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                          </svg>
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="time"
                          value={rule.startTime}
                          onChange={(e) =>
                            updateRule(rule.key, "startTime", e.target.value)
                          }
                          aria-label="Horário de início"
                          className="flex-1 rounded-lg border border-foreground/20 bg-background px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                        />
                        <span className="text-xs text-foreground/55">até</span>
                        <input
                          type="time"
                          value={rule.endTime}
                          onChange={(e) =>
                            updateRule(rule.key, "endTime", e.target.value)
                          }
                          aria-label="Horário de fim"
                          className="flex-1 rounded-lg border border-foreground/20 bg-background px-2 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-foreground/20"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="button"
              variant="secondary"
              onClick={addRule}
              disabled={rules.length >= 7}
              className="w-full"
            >
              {rules.length >= 7
                ? "Todos os dias configurados"
                : "+ Adicionar horário"}
            </Button>

            {hasDuplicateDays ? (
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Há dias duplicados. Configure apenas uma faixa por dia antes de salvar.
              </p>
            ) : null}
          </>
        )}

        <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
          <Button type="button" variant="ghost" onClick={handleCloseRequest}>
            Cancelar
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            loading={updateMutation.isPending}
            disabled={isLoading}
          >
            Salvar disponibilidade
          </Button>
        </div>
      </div>

      <ConfirmModal
        open={confirmDiscard}
        onClose={() => setConfirmDiscard(false)}
        onConfirm={handleDiscardConfirm}
        title="Descartar alterações"
        description="Há alterações não salvas na disponibilidade. Deseja descartá-las?"
        confirmLabel="Descartar"
        cancelLabel="Continuar editando"
        variant="danger"
      />
    </Modal>
  );
};
