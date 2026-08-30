import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ChevronRight,
  SlidersHorizontal,
  Sparkles,
  Wand2,
  ArrowRight,
  BarChart2,
  ShieldAlert,
  Target,
  TrendingUp,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { RiskAnalysisScreen } from "@/components/procurement/risk-analysis-screen";
import { ProcurementResult } from "@/components/procurement/procurement-result";
import {
  AI_ANALYZES,
  DEFAULT_PROC_SCOPE,
  FORECASTS,
  P_CATEGORIES,
  P_MATERIALS,
  PROC_PROMPT,
  RISK_LEVELS,
  WINDOWS,
  type AnalysisMode,
  type ProcurementScope,
} from "@/lib/procurement-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/procurement/intelligence")({
  head: () => ({
    meta: [
      { title: "Neural Procurement Intelligence — Neural PredictOS" },
      {
        name: "description",
        content:
          "Neural Procurement Intelligence module of Neural PredictOS, the AI material demand and procurement intelligence layer for apparel factories.",
      },
      {
        property: "og:title",
        content: "Neural Procurement Intelligence — Neural PredictOS",
      },
      {
        property: "og:description",
        content:
          "Neural Procurement Intelligence module of Neural PredictOS planning intelligence.",
      },
    ],
  }),
  component: ProcurementIntelligencePage,
});

type Stage = "intro" | "configure" | "analyzing" | "result";

function ProcurementIntelligencePage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [mode, setMode] = useState<AnalysisMode | null>(null);
  const [scope, setScope] = useState<ProcurementScope>(DEFAULT_PROC_SCOPE);
  const [prompt, setPrompt] = useState(PROC_PROMPT);

  const chooseMode = (m: AnalysisMode) => {
    setMode(m);
    setStage("configure");
  };

  return (
    <AppShell
      title="Neural Procurement Intelligence"
      subtitle="AI-powered future shortage detection, risk prioritization and procurement recommendations."
    >
      {/* Breadcrumb */}
      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">
          Dashboard
        </Link>
        <ChevronRight className="size-3.5" />
        <button
          className="hover:text-foreground"
          onClick={() => setStage(mode ? "configure" : "intro")}
        >
          Neural Procurement Intelligence
        </button>
        {stage === "result" && (
          <>
            <ChevronRight className="size-3.5" />
            <span className="font-medium text-foreground">
              Procurement Intelligence
            </span>
          </>
        )}
      </nav>

      {stage === "intro" && <Intro onChoose={chooseMode} mode={mode} />}

      {stage === "configure" && mode && (
        <div className="space-y-6">
          <Steps active={0} />
          <ModeSwitch mode={mode} onChange={setMode} />
          {mode === "manual" ? (
            <ManualPanel
              scope={scope}
              setScope={setScope}
              onSubmit={() => setStage("analyzing")}
            />
          ) : (
            <AgenticPanel
              prompt={prompt}
              setPrompt={setPrompt}
              onSubmit={() => setStage("analyzing")}
            />
          )}
        </div>
      )}

      {stage === "analyzing" && (
        <div className="space-y-6">
          <Steps active={1} />
          <RiskAnalysisScreen onDone={() => setStage("result")} />
        </div>
      )}

      {stage === "result" && mode && (
        <div className="space-y-6">
          <Steps active={2} />
          <ProcurementResult
            mode={mode}
            scope={scope}
            prompt={prompt}
            onReconfigure={() => setStage("configure")}
          />
        </div>
      )}
    </AppShell>
  );
}

/* ─── Intro ─────────────────────────────────────────────────────────── */

const PROCESS_STEPS = [
  { icon: BarChart2, label: "Demand Forecast" },
  { icon: ShieldAlert, label: "Supply Analysis" },
  { icon: Target, label: "Risk Detection" },
  { icon: TrendingUp, label: "Priority" },
  { icon: Sparkles, label: "Procurement Action" },
];

function Intro({
  onChoose,
  mode,
}: {
  onChoose: (m: AnalysisMode) => void;
  mode: AnalysisMode | null;
}) {
  return (
    <div className="mx-auto max-w-5xl">
      {/* Header */}
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Neural Procurement Intelligence
        </h2>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          AI-powered future shortage detection, risk prioritization and
          procurement recommendations.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Identify material risks before they impact production and know what
          to prioritize next.
        </p>
      </div>


      {/* Mode cards */}
      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <ModeCard
          selected={mode === "manual"}
          icon={<SlidersHorizontal className="size-5" />}
          title="Manual Analysis"
          description="Select a forecast, materials and planning parameters manually."
          cta="Use Manual Mode"
          onClick={() => onChoose("manual")}
        />
        <ModeCard
          selected={mode === "agentic"}
          icon={<Sparkles className="size-5" />}
          title="Agentic Analysis"
          description="Describe the procurement problem and let the AI agent analyze the relevant supply and demand data automatically."
          cta="Use Agentic Mode"
          onClick={() => onChoose("agentic")}
        />
      </div>
    </div>
  );
}

function ModeCard({
  icon,
  title,
  description,
  cta,
  onClick,
  selected,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  cta: string;
  onClick: () => void;
  selected: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "group flex h-full flex-col rounded-2xl border bg-card p-6 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md",
        selected ? "border-primary ring-2 ring-primary/20" : "border-border",
      )}
    >
      <span className="flex size-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
        {icon}
      </span>
      <h3 className="mt-4 text-lg font-semibold text-foreground">{title}</h3>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      <span className="mt-5 inline-flex w-fit items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        {cta}
      </span>
    </button>
  );
}

/* ─── Steps ──────────────────────────────────────────────────────────── */

function Steps({ active }: { active: number }) {
  const steps = ["Select Data", "Analyze Risk", "Review Procurement Intelligence"];
  return (
    <ol className="flex flex-wrap items-center gap-3 text-sm">
      {steps.map((s, i) => (
        <li key={s} className="flex items-center gap-3">
          <span
            className={cn(
              "flex items-center gap-2 rounded-full border px-3 py-1.5",
              i === active
                ? "border-primary bg-primary/10 font-semibold text-primary"
                : i < active
                  ? "border-primary/25 text-primary"
                  : "border-border text-muted-foreground",
            )}
          >
            <span className="text-xs tabular-nums">0{i + 1}</span>
            {s}
          </span>
          {i < steps.length - 1 && (
            <ChevronRight className="size-4 text-muted-foreground" />
          )}
        </li>
      ))}
    </ol>
  );
}

/* ─── Mode switch ────────────────────────────────────────────────────── */

function ModeSwitch({
  mode,
  onChange,
}: {
  mode: AnalysisMode;
  onChange: (m: AnalysisMode) => void;
}) {
  return (
    <div className="inline-flex rounded-full border border-border bg-card p-1">
      {(["manual", "agentic"] as AnalysisMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition",
            mode === m
              ? "bg-primary text-primary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {m === "manual" ? "Manual Analysis" : "Agentic Analysis"}
        </button>
      ))}
    </div>
  );
}

/* ─── Field helper ───────────────────────────────────────────────────── */

function Field({
  label,
  value,
  options,
  onChange,
  hint,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  hint?: string;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((o) => (
            <SelectItem key={o} value={o}>
              {o}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {hint && (
        <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>
      )}
    </div>
  );
}

/* ─── Manual panel ───────────────────────────────────────────────────── */

function ManualPanel({
  scope,
  setScope,
  onSubmit,
}: {
  scope: ProcurementScope;
  setScope: (s: ProcurementScope) => void;
  onSubmit: () => void;
}) {
  const set = (k: keyof ProcurementScope) => (v: string) =>
    setScope({ ...scope, [k]: v });

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
        <h3 className="text-lg font-semibold text-foreground">
          Configure Procurement Analysis
        </h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field
            label="Select Forecast"
            value={scope.forecast}
            options={FORECASTS}
            onChange={set("forecast")}
            hint="Forecast generated by: Neural SmartDemand Analytics"
          />
          <Field
            label="Material Category"
            value={scope.category}
            options={P_CATEGORIES}
            onChange={set("category")}
          />
          <Field
            label="Material"
            value={scope.material}
            options={P_MATERIALS}
            onChange={set("material")}
          />
          <Field
            label="Planning Window"
            value={scope.window}
            options={WINDOWS}
            onChange={set("window")}
          />
          <Field
            label="Risk Level Filter"
            value={scope.risk}
            options={RISK_LEVELS}
            onChange={set("risk")}
          />
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-foreground">
            Analysis Scope Summary
          </h4>
          <dl className="mt-3 space-y-2 text-sm">
            {[
              ["Forecast", "Jul–Dec 2026"],
              ["Material Scope", scope.material],
              ["Planning Window", scope.window],
              ["Risk Filter", scope.risk],
            ].map(([k, v]) => (
              <div
                key={k}
                className="flex items-start justify-between gap-4 border-b border-border/60 pb-2 last:border-0"
              >
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-6">
          <Button className="w-full" size="lg" onClick={onSubmit}>
            <ShieldAlert className="mr-2 size-4" /> Analyze Procurement Risk
          </Button>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Neural PredictOS will compare demand forecasts with current supply
            and identify materials at risk.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ─── Agentic panel ──────────────────────────────────────────────────── */

function AgenticPanel({
  prompt,
  setPrompt,
  onSubmit,
}: {
  prompt: string;
  setPrompt: (v: string) => void;
  onSubmit: () => void;
}) {
  const chips = [
    "Which materials are at risk?",
    "What should we procure first?",
    "Show critical shortages",
  ];

  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
        <div className="flex items-center gap-2">
          <Wand2 className="size-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">
            Ask Neural PredictOS
          </h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe the procurement problem you want the AI to investigate.
        </p>
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={5}
          className="mt-4 resize-none rounded-2xl text-sm leading-relaxed"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((c) => (
            <button
              key={c}
              onClick={() => setPrompt(c)}
              className="rounded-full border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground transition hover:border-primary/40 hover:text-foreground"
            >
              {c}
            </button>
          ))}
        </div>
        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button size="lg" onClick={onSubmit}>
            <Sparkles className="mr-2 size-4" /> Analyze with AI
          </Button>
          <span className="text-xs text-muted-foreground">
            AI will automatically identify the relevant procurement data.
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-6">
        <h4 className="text-sm font-semibold text-foreground">AI will analyze</h4>
        <ul className="mt-3 space-y-1.5 text-sm text-foreground">
          {AI_ANALYZES.map((a) => (
            <li key={a} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" />
              {a}
            </li>
          ))}
        </ul>
        <div className="mt-5 border-t border-border/60 pt-4">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Output
          </p>
          <ul className="mt-2 space-y-1.5 text-sm text-foreground">
            {[
              "Future shortage detection",
              "Risk prioritization",
              "Procurement recommendations",
              "Action timing",
            ].map((o) => (
              <li key={o} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-chart-3" />
                {o}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
