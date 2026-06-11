"use client";

import { useState, useMemo, type ReactNode } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  addMonths,
  subMonths,
  isSameMonth,
  isSameDay,
  isBefore,
  isAfter,
  startOfDay,
} from "date-fns";
import { ptBR } from "date-fns/locale";

interface DatePickerProps {
  selected: Date | null;
  onSelect: (date: Date) => void;
  isDateDisabled?: (date: Date) => boolean;
  maxDate?: Date;
}

export const DatePicker = ({
  selected,
  onSelect,
  isDateDisabled,
  maxDate,
}: DatePickerProps): ReactNode => {
  const [currentMonth, setCurrentMonth] = useState(
    () => selected ?? new Date()
  );
  const today = startOfDay(new Date());

  const days = useMemo(() => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(currentMonth);
    const calStart = startOfWeek(monthStart, { locale: ptBR });
    const calEnd = endOfWeek(monthEnd, { locale: ptBR });

    const result: Date[] = [];
    let day = calStart;
    while (day <= calEnd) {
      result.push(day);
      day = addDays(day, 1);
    }
    return result;
  }, [currentMonth]);

  const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  return (
    <div className="w-full">      <div className="mb-3 flex items-center justify-between">
        <button
          type="button"
          onClick={() => setCurrentMonth((m) => subMonths(m, 1))}
          disabled={!isAfter(startOfMonth(currentMonth), startOfMonth(today))}
          className="rounded-lg p-1.5 text-foreground/65 hover:bg-foreground/5 hover:text-foreground cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Mês anterior"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        </button>

        <span className="text-sm font-semibold text-foreground capitalize">
          {format(currentMonth, "MMMM yyyy", { locale: ptBR })}
        </span>

        <button
          type="button"
          onClick={() => setCurrentMonth((m) => addMonths(m, 1))}
          disabled={
            maxDate
              ? isAfter(startOfMonth(addMonths(currentMonth, 1)), maxDate)
              : false
          }
          className="rounded-lg p-1.5 text-foreground/65 hover:bg-foreground/5 hover:text-foreground cursor-pointer disabled:cursor-not-allowed disabled:opacity-30"
          aria-label="Próximo mês"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        </button>
      </div>      <div className="mb-1 grid grid-cols-7 text-center">
        {weekDays.map((wd) => (
          <span
            key={wd}
            className="py-1 text-xs font-medium text-foreground/55"
          >
            {wd}
          </span>
        ))}
      </div>      <div className="grid grid-cols-7">
        {days.map((day) => {
          const inMonth = isSameMonth(day, currentMonth);
          const isSelected = selected ? isSameDay(day, selected) : false;
          const isPast = isBefore(day, today);
          const isToday = isSameDay(day, today);
          const externalDisabled = isDateDisabled ? isDateDisabled(day) : false;
          const afterMax = maxDate ? isAfter(day, maxDate) : false;
          const disabled = isPast || !inMonth || externalDisabled || afterMax;

          return (
            <button
              key={day.toISOString()}
              type="button"
              disabled={disabled}
              onClick={() => onSelect(day)}
              className={`relative mx-auto flex h-9 w-9 items-center justify-center rounded-lg text-sm transition-colors cursor-pointer
                ${disabled ? "text-foreground/25 cursor-not-allowed" : ""}
                ${!disabled && !isSelected ? "text-foreground hover:bg-foreground/5" : ""}
                ${isSelected ? "bg-foreground text-background font-semibold" : ""}
                ${isToday && !isSelected ? "font-semibold text-foreground" : ""}
              `}
            >
              {format(day, "d")}
              {isToday && !isSelected ? (
                <span className="absolute bottom-1 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-foreground" />
              ) : null}
            </button>
          );
        })}
      </div>
    </div>
  );
};
