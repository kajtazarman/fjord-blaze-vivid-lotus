import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import {
  addDays,
  addMonths,
  format,
  isSameDay,
  isSameMonth,
  parseISO,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type DatePickerProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
};

const WEEKDAYS = ["M", "T", "W", "T", "F", "S", "S"];

function parseDay(value: string): Date | null {
  if (!value) return null;
  const parsed = parseISO(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
}

export function DatePicker({ value, onChange, label = "Date" }: DatePickerProps) {
  const selected = parseDay(value);
  const [open, setOpen] = useState(false);
  const [cursor, setCursor] = useState(() => startOfMonth(selected ?? new Date()));
  const [box, setBox] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    setCursor(startOfMonth(parseDay(value) ?? new Date()));
    function place() {
      const rect = buttonRef.current?.getBoundingClientRect();
      if (!rect) return;
      const width = 348;
      const height = 400;
      let top = rect.bottom + 8;
      if (top + height > window.innerHeight - 12) top = Math.max(12, rect.top - height - 8);
      let left = rect.left;
      if (left + width > window.innerWidth - 12) left = window.innerWidth - width - 12;
      if (left < 12) left = 12;
      setBox({ top, left });
    }
    place();
    function onPointer(event: MouseEvent) {
      const target = event.target as Node;
      if (panelRef.current?.contains(target) || buttonRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(event: KeyboardEvent) {
      if (event.key === "Escape") setOpen(false);
    }
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, true);
    window.addEventListener("mousedown", onPointer);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", place);
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("mousedown", onPointer);
      window.removeEventListener("keydown", onKey);
    };
  }, [open, value]);

  const start = startOfWeek(startOfMonth(cursor), { weekStartsOn: 1 });
  const days = Array.from({ length: 42 }, (_, index) => addDays(start, index));
  const today = new Date();

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        aria-label={label}
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
        className="flex h-12 w-full items-center rounded-md border border-border bg-background px-3 text-left text-base text-foreground"
      >
        {selected ? format(selected, "d MMM yyyy") : <span className="text-subtle">Pick a date</span>}
      </button>
      {open
        ? createPortal(
            <div
              ref={panelRef}
              role="dialog"
              aria-label={label}
              style={{ top: box.top, left: box.left }}
              className="fixed z-[80] w-[348px] rounded-xl border border-border bg-card p-4 text-foreground shadow-[0_16px_40px_rgba(15,15,15,0.14)]"
            >
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  aria-label="Previous month"
                  className="flex size-10 items-center justify-center rounded-md hover:bg-muted"
                  onClick={() => setCursor((month) => addMonths(month, -1))}
                >
                  <ChevronLeft className="size-5" />
                </button>
                <p className="text-base font-semibold tracking-tight">{format(cursor, "MMMM yyyy")}</p>
                <button
                  type="button"
                  aria-label="Next month"
                  className="flex size-10 items-center justify-center rounded-md hover:bg-muted"
                  onClick={() => setCursor((month) => addMonths(month, 1))}
                >
                  <ChevronRight className="size-5" />
                </button>
              </div>
              <div className="mb-1 grid grid-cols-7 text-center text-xs font-medium text-muted-foreground">
                {WEEKDAYS.map((day, index) => (
                  <span key={`${day}-${index}`} className="flex h-8 items-center justify-center">
                    {day}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 justify-items-center">
                {days.map((day) => {
                  const on = selected ? isSameDay(day, selected) : false;
                  const inMonth = isSameMonth(day, cursor);
                  return (
                    <button
                      key={day.toISOString()}
                      type="button"
                      onClick={() => {
                        onChange(format(day, "yyyy-MM-dd"));
                        setOpen(false);
                      }}
                      className={cn(
                        "flex size-11 items-center justify-center rounded-full text-[15px] font-medium",
                        !inMonth && "text-muted-foreground/40",
                        !on && isSameDay(day, today) && "bg-muted",
                        on ? "bg-[#0075de] text-white" : "hover:bg-muted",
                      )}
                    >
                      {format(day, "d")}
                    </button>
                  );
                })}
              </div>
            </div>,
            document.body,
          )
        : null}
    </>
  );
}
