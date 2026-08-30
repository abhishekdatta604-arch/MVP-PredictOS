import { useEffect, useState } from "react";
import { Check, Loader2 } from "lucide-react";
import { ANALYSIS_STEPS } from "@/lib/smartdemand-data";
import { cn } from "@/lib/utils";

const DURATION = 10000;

export function AnalysisScreen({ onDone }: { onDone: () => void }) {
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
  const marks = [0, 10, 25, 40, 55, 70, 85, 95, 100];
  const pct = marks.filter((m) => m <= Math.round(p * 100)).pop() ?? 0;
  const doneSteps = Math.min(
    ANALYSIS_STEPS.length - 1,
    Math.floor(p * ANALYSIS_STEPS.length),
  );

  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center py-10 text-center">
      <h2 className="text-2xl font-bold tracking-tight text-foreground">
        Neural PredictOS is analyzing your forecast
      </h2>
      <p className="mt-2 max-w-xl text-sm text-muted-foreground">
        Almost there — we're analyzing your factory data to build the most relevant demand
        forecast.
      </p>

      <NeuralVisual progress={p} />

      <div className="mt-8 w-full max-w-xl">
        <div className="flex items-end justify-between">
          <span className="text-sm font-medium text-muted-foreground">Analysis progress</span>
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
        {ANALYSIS_STEPS.map((step, i) => {
          const complete = i < doneSteps || pct === 100;
          const active = i === doneSteps && pct < 100;
          return (
            <li
              key={step}
              className={cn(
                "flex items-center gap-3 rounded-xl border px-4 py-3 text-sm transition-all",
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

function NeuralVisual({ progress }: { progress: number }) {
  const nodes = [
    { x: 40, y: 60 },
    { x: 40, y: 130 },
    { x: 40, y: 200 },
    { x: 165, y: 45 },
    { x: 165, y: 130 },
    { x: 165, y: 215 },
    { x: 290, y: 90 },
    { x: 290, y: 170 },
    { x: 400, y: 130 },
  ];
  const edges: [number, number][] = [
    [0, 3], [0, 4], [1, 3], [1, 4], [1, 5], [2, 4], [2, 5],
    [3, 6], [4, 6], [4, 7], [5, 7], [6, 8], [7, 8],
  ];

  return (
    <div className="relative mt-8 w-full max-w-xl overflow-hidden rounded-3xl border border-border bg-card p-4 shadow-sm">
      <div
        className="pointer-events-none absolute inset-0 opacity-70"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 40%, color-mix(in oklab, var(--primary) 12%, transparent), transparent), radial-gradient(50% 50% at 80% 60%, color-mix(in oklab, var(--chart-3) 12%, transparent), transparent)",
        }}
      />
      <svg viewBox="0 0 440 260" className="relative h-56 w-full">
        <defs>
          <linearGradient id="nd-line" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--chart-2)" stopOpacity="0.35" />
            <stop offset="100%" stopColor="var(--primary)" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {edges.map(([a, b], i) => (
          <g key={i}>
            <line
              x1={nodes[a].x}
              y1={nodes[a].y}
              x2={nodes[b].x}
              y2={nodes[b].y}
              stroke="url(#nd-line)"
              strokeWidth={1.2}
            />
            <circle r={3} fill="var(--primary)">
              <animateMotion
                dur={`${1.6 + (i % 4) * 0.4}s`}
                repeatCount="indefinite"
                path={`M${nodes[a].x},${nodes[a].y} L${nodes[b].x},${nodes[b].y}`}
              />
            </circle>
          </g>
        ))}

        {nodes.map((n, i) => (
          <g key={i}>
            <circle cx={n.x} cy={n.y} r={14} fill="var(--primary)" opacity={0.08}>
              <animate
                attributeName="r"
                values="12;20;12"
                dur="2.4s"
                begin={`${i * 0.18}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={n.x}
              cy={n.y}
              r={i === 8 ? 9 : 6}
              fill={i === 8 ? "var(--primary)" : "var(--chart-3)"}
              opacity={i === 8 ? 1 : 0.75}
            />
          </g>
        ))}

        <polyline
          points="20,240 80,232 140,236 200,224 260,214 320,196 380,186 420,178"
          fill="none"
          stroke="var(--primary)"
          strokeWidth={2}
          strokeDasharray="600"
          strokeDashoffset={600 - progress * 600}
          opacity={0.85}
        />
      </svg>
      <div className="relative flex justify-between px-2 pb-1 text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
        <span>Factory data</span>
        <span>AI analysis</span>
        <span>Forecast</span>
      </div>
    </div>
  );
}
