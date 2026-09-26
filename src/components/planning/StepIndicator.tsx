import { Check } from "lucide-react";

interface Props {
  pasos: string[];
  actual: number;
  onGo?: (i: number) => void;
}

export default function StepIndicator({ pasos, actual, onGo }: Props) {
  return (
    <div className="mb-6 flex items-center">
      {pasos.map((p, i) => (
        <div key={p} className="flex flex-1 items-center last:flex-none">
          <button
            type="button"
            onClick={() => onGo && i <= actual && onGo(i)}
            className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-xs font-bold transition-colors ${
              i < actual
                ? "border-primary bg-primary text-white"
                : i === actual
                ? "border-primary text-primary"
                : "border-border text-textsec dark:border-slate-700 dark:text-slate-500"
            }`}
          >
            {i < actual ? <Check size={16} /> : i + 1}
          </button>
          <span
            className={`ml-2 hidden text-xs font-medium sm:block ${
              i <= actual ? "text-textmain dark:text-slate-100" : "text-textsec dark:text-slate-500"
            }`}
          >
            {p}
          </span>
          {i < pasos.length - 1 && (
            <div className={`mx-3 h-0.5 flex-1 ${i < actual ? "bg-primary" : "bg-border dark:bg-slate-700"}`} />
          )}
        </div>
      ))}
    </div>
  );
}