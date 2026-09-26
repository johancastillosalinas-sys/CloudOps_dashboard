import { useEffect, useRef, useState } from "react";
import * as Icons from "lucide-react";
import { ChevronDown, Check } from "lucide-react";

export interface SelectOption {
  value: string;
  label: string;
  description?: string;
  icon?: string;
  emoji?: string;
}

interface Props {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
}

export default function CustomSelect({ value, onChange, options, placeholder }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const selected = options.find((o) => o.value === value);
  const SelectedIcon = selected?.icon
    ? (Icons as unknown as Record<string, Icons.LucideIcon>)[selected.icon]
    : undefined;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between gap-2 rounded-lg border border-border bg-white px-3 py-2 text-sm text-textmain transition-colors hover:border-primary/50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100"
      >
        <span className="flex min-w-0 items-center gap-2">
          {selected?.emoji && <span className={`fi fi-${selected.emoji} rounded-sm`} style={{ width: 18, height: 13 }} />}
          {SelectedIcon && <SelectedIcon size={16} className="shrink-0 text-primary" />}
          <span className="truncate">{selected?.label ?? placeholder ?? "Selecciona..."}</span>
        </span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-textsec transition-transform dark:text-slate-400 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="animate-dropdown absolute left-0 right-0 z-30 mt-1.5 max-h-72 overflow-y-auto rounded-lg border border-border bg-white p-1.5 shadow-lg dark:border-slate-700 dark:bg-slate-800">
          {options.map((opt) => {
            const OptIcon = opt.icon
              ? (Icons as unknown as Record<string, Icons.LucideIcon>)[opt.icon]
              : undefined;
            const activo = opt.value === value;
            return (
              <button
                key={opt.value}
                type="button"
                onClick={() => {
                  onChange(opt.value);
                  setOpen(false);
                }}
                className={`flex w-full items-start gap-2.5 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  activo
                    ? "bg-blue-50 text-primary dark:bg-blue-500/10"
                    : "text-textmain hover:bg-slate-50 dark:text-slate-100 dark:hover:bg-slate-700/60"
                }`}
              >
                {opt.emoji && <span className={`fi fi-${opt.emoji} mt-1 rounded-sm`} style={{ width: 18, height: 13 }} />}
                {OptIcon && (
                  <span
                    className={`mt-0.5 rounded-md p-1 ${
                      activo ? "bg-white dark:bg-slate-900" : "bg-slate-100 dark:bg-slate-700"
                    }`}
                  >
                    <OptIcon size={14} className={activo ? "text-primary" : "text-textsec dark:text-slate-300"} />
                  </span>
                )}
                <span className="min-w-0 flex-1">
                  <span className="block truncate font-medium">{opt.label}</span>
                  {opt.description && (
                    <span className="block truncate text-xs text-textsec dark:text-slate-400">
                      {opt.description}
                    </span>
                  )}
                </span>
                {activo && <Check size={16} className="mt-0.5 shrink-0 text-primary" />}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}