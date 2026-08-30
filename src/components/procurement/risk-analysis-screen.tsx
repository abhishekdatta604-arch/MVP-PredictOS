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

      <RiskVisual progress={p} />

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

function RiskVisual({ progress }: { progress: number }) {
  const inputs = [
    { y: 50, label: "Demand" },
    { y: 105, label: "Inventory" },
    { y: 160, label: "Open POs" },
    { y: 215, label: "Lead time" },
  ];
  const core = { x: 220, y: 132 };
  const outputs = [
    { y: 75, label: "Risk score" },
    { y: 132, label: "Priority" },
    { y: 190, label: "Action" },
  ];

  return (
    <div className="relative mt-8 w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(55% 55% at 50% 50%, color-mix(in oklab, var(--primary) 14%, transparent), transparent), radial-gradient(45% 45% at 85% 65%, color-mix(in oklab, var(--chart-3) 12%, transparent), transparent)",
        }}
      />
      <svg viewBox="0 0 440 265" className="relative h-56 w-full">
        <defs>
          <linearGradient id="pi-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--chart-2)" stopOpacity="0.3" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.75" />
          </linearGradient>
        </defs>

        {inputs.map((n, i) => (
          <g key={`in-${i}`}>
            <line x1={60} y1={n.y} x2={core.x - 30} y2={core.y} stroke="url(#pi-line)" strokeWidth={1.2} />
            <circle r={3} fill="var(--chart-3)">
              <animateMotion
                dur={`${1.5 + i * 0.3}s`}
                repeatCount="indefinite"
                path={`M60,${n.y} L${core.x - 30},${core.y}`}
              />
            </circle>
            <circle cx={60} cy={n.y} r={7} fill="var(--chart-3)" opacity={0.8} />
            <text x={14} y={n.y - 12} className="fill-muted-foreground" fontSize="9">
              {n.label}
            </text>
          </g>
        ))}

        <circle cx={core.x} cy={core.y} r={34} fill="var(--primary)" opacity={0.1}>
          <animate attributeName="r" values="30;40;30" dur="2.4s" repeatCount="indefinite" />
        </circle>
        <circle cx={core.x} cy={core.y} r={20} fill="var(--primary)" opacity={0.95} />
        <text x={core.x} y={core.y + 4} textAnchor="middle" fontSize="9" fill="var(--primary-foreground)">
          AI
        </text>

        {outputs.map((n, i) => (
          <g key={`out-${i}`}>
            <line x1={core.x + 30} y1={core.y} x2={370} y2={n.y} stroke="url(#pi-line)" strokeWidth={1.2} />
            <circle r={3} fill="var(--primary)">
              <animateMotion
                dur={`${1.4 + i * 0.35}s`}
                repeatCount="indefinite"
                path={`M${core.x + 30},${core.y} L370,${n.y}`}
              />
            </circle>
            <circle cx={370} cy={n.y} r={7} fill="var(--primary)" opacity={0.85} />
            <text x={384} y={n.y + 3} className="fill-muted-foreground" fontSize="9">
              {n.label}
            </text>
          </g>
        ))}

        <polyline
          points="20,250 90,246 160,240 230,236 300,230 370,224 420,220"
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2}
          strokeDasharray="600"
          strokeDashoffset={600 - progress * 600}
          opacity={0.8}
        />
      </svg>
      <div className="relative flex justify-between px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <span>Supply &amp; demand</span>
        <span>AI risk engine</span>
        <span>Action</span>
      </div>
    </div>
  );
}
