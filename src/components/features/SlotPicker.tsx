"use client";

import { useMemo, type ReactNode } from "react";
import { useSlots } from "@/lib/hooks/useReservations";
import { Skeleton } from "@/components/ui/Skeleton";
import { formatTime } from "@/lib/utils/format";

interface SlotPickerProps {
  resourceId: string;
  date: string;
  selected: string | null;
  onSelect: (slot: string) => void;
}

const filterPastSlots = (slots: string[], date: string): string[] => {
  const now = new Date();
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;

  if (date !== todayStr) return slots;

  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  return slots.filter((slot) => {
    const [h, m] = slot.split(":").map(Number);
    return h * 60 + m > currentMinutes;
  });
};

export const SlotPicker = ({
  resourceId,
  date,
  selected,
  onSelect,
}: SlotPickerProps): ReactNode => {
  const { data: slots, isLoading, isError } = useSlots(resourceId, date);

  const availableSlots = useMemo(
    () => filterPastSlots(slots ?? [], date),
    [slots, date]
  );

  if (isLoading) {
    return (
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="h-10" />
        ))}
      </div>
    );
  }

  if (isError) {
    return (
      <p className="text-sm text-red-500">
        Erro ao carregar horários disponíveis.
      </p>
    );
  }

  if (availableSlots.length === 0) {
    return (
      <p className="py-6 text-center text-sm text-foreground/55">
        Nenhum horário disponível nesta data.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
      {availableSlots.map((slot) => {
        const isSelected = selected === slot;

        return (
          <button
            key={slot}
            type="button"
            onClick={() => onSelect(slot)}
            aria-pressed={isSelected}
            aria-label={`Horário ${formatTime(slot)}`}
            className={`rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors cursor-pointer ${
              isSelected
                ? "border-foreground bg-foreground text-background"
                : "border-foreground/20 text-foreground hover:border-foreground/40 hover:bg-foreground/5"
            }`}
          >
            {formatTime(slot)}
          </button>
        );
      })}
    </div>
  );
};
