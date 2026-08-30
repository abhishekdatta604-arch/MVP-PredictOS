import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { PROC_ANALYSIS_STEPS, PROC_PCT_MARKS } from "@/lib/procurement-data";
import { cn } from "@/lib/utils";

const DURATION = 10000;

export function RiskAnalysisScreen({ onDone }: { onDone: () => void }) {
  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const start = Date.now();
    const id = window.setInterval(() => {
      const e = Math.min(Date.now() - start, DURATION);
      setElapsed(e);
      if (e >= DURATION) {
        window.clearInterval(id);
        onDone();
      }
    }, 80);
    return () => window.clearInterval(id);
  }, [onDone]);

  const p = elapsed / DURATION;
  const pct = PROC_PCT_MARKS.filter((m) => m <= Math.round(p * 100)).pop() ?? 0;
  const doneSteps = Math.min(
    PROC_ANALYSIS_STEPS.length - 1,
    Math.floor(p * PROC_ANALYSIS_STEPS.length),
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center py-10 text-center">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Neural PredictOS is analyzing procurement risk
      </h2>
      <p className="mt-2 max-w-2xl text-sm text-muted-foreground">
        Almost there — we're comparing future demand with supply availability and identifying the
        materials that need attention.
      </p>

      <div className="mt-8 w-full max-w-xl">
        <div className="flex items-end justify-between">
          <span className="text-sm font-medium text-muted-foreground">Risk analysis progress</span>
          <span className="text-3xl font-bold tabular-nums text-primary">{pct}%</span>
        </div>
        <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-primary transition-[width] duration-200 ease-linear"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <ul className="mt-8 grid w-full max-w-xl gap-2 text-left">
        {PROC_ANALYSIS_STEPS.map((step, i) => {
          const complete = i < doneSteps || pct === 100;
          const active = i === doneSteps && pct < 100;
          return (
            <li
              key={step}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-2.5 text-sm transition-all",
                complete
                  ? "border-primary/25 bg-primary/5 text-foreground"
                  : active
                    ? "border-border bg-card text-foreground shadow-sm"
                    : "border-transparent bg-muted/50 text-muted-foreground",
              )}
            >
              {complete ? (
                <Check className="size-4 text-primary" />
              ) : active ? (
                <Loader2 className="size-4 animate-spin text-primary" />
              ) : (
                <span className="size-4 rounded-full border border-border" />
              )}
              <span className={cn(complete && "font-medium")}>{step}</span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
