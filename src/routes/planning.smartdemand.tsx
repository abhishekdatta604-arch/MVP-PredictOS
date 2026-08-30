import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChevronRight, Sparkles, SlidersHorizontal, Wand2 } from "lucide-react";
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
import { AnalysisScreen } from "@/components/smartdemand/analysis-screen";
import { ForecastResult } from "@/components/smartdemand/forecast-result";
import {
  BUYERS,
  CATEGORIES,
  DEFAULT_PROMPT,
  DEFAULT_SCOPE,
  HORIZONS,
  MATERIALS,
  STYLES,
  type ForecastMode,
  type ManualScope,
} from "@/lib/smartdemand-data";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/planning/smartdemand")({
  head: () => ({
    meta: [
      { title: "Neural SmartDemand Analytics — Neural PredictOS" },
      {
        name: "description",
        content:
          "AI-powered material demand forecasting for the next 1–6 months for apparel manufacturing factories.",
      },
      { property: "og:title", content: "Neural SmartDemand Analytics — Neural PredictOS" },
      {
        property: "og:description",
        content: "Turn historical consumption and operational signals into a forward-looking material demand plan.",
      },
    ],
  }),
  component: SmartDemandPage,
});

type Stage = "intro" | "configure" | "analyzing" | "result";

function SmartDemandPage() {
  const [stage, setStage] = useState<Stage>("intro");
  const [mode, setMode] = useState<ForecastMode | null>(null);
  const [scope, setScope] = useState<ManualScope>(DEFAULT_SCOPE);
  const [prompt, setPrompt] = useState(DEFAULT_PROMPT);

  const chooseMode = (m: ForecastMode) => {
    setMode(m);
    setStage("configure");
  };

  return (
    <AppShell
      title="Neural SmartDemand Analytics"
      subtitle="AI-powered material demand forecasting for the next 1–6 months."
    >
      <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Dashboard</Link>
        <ChevronRight className="size-3.5" />
        <button
          className="hover:text-foreground"
          onClick={() => setStage(mode ? "configure" : "intro")}
        >
          Neural SmartDemand Analytics
        </button>
        {stage === "result" && (
          <>
            <ChevronRight className="size-3.5" />
            <span className="font-medium text-foreground">AI Demand Forecast</span>
          </>
        )}
      </nav>

      {stage === "intro" && <Intro onChoose={chooseMode} mode={mode} />}

      {stage === "configure" && mode && (
        <div className="space-y-6">
          <Steps active={0} />
          <ModeSwitch mode={mode} onChange={setMode} />
          {mode === "manual" ? (
            <ManualPanel scope={scope} setScope={setScope} onSubmit={() => setStage("analyzing")} />
          ) : (
            <AgenticPanel
              prompt={prompt}
              setPrompt={setPrompt}
              material={scope.material}
              onSubmit={() => setStage("analyzing")}
            />
          )}
        </div>
      )}

      {stage === "analyzing" && (
        <div className="space-y-6">
          <Steps active={1} />
          <AnalysisScreen onDone={() => setStage("result")} />
        </div>
      )}

      {stage === "result" && mode && (
        <div className="space-y-6">
          <Steps active={2} />
          <ForecastResult
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

function Intro({ onChoose, mode }: { onChoose: (m: ForecastMode) => void; mode: ForecastMode | null }) {
  return (
    <div className="mx-auto max-w-5xl">
      <div className="max-w-2xl">
        <h2 className="text-2xl font-bold tracking-tight text-foreground">
          Neural SmartDemand Analytics
        </h2>
        <p className="mt-2 text-sm font-medium text-muted-foreground">
          AI-powered material demand forecasting for the next 1–6 months.
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Turn historical consumption and operational signals into a forward-looking material
          demand plan.
        </p>
      </div>

      <div className="mt-8 grid gap-5 lg:grid-cols-2">
        <ModeCard
          selected={mode === "manual"}
          icon={<SlidersHorizontal className="size-5" />}
          title="Manual Forecast"
          description="Choose planning horizon, materials, styles and buyers manually."
          cta="Use Manual Mode"
          onClick={() => onChoose("manual")}
        />
        <ModeCard
          selected={mode === "agentic"}
          icon={<Sparkles className="size-5" />}
          title="Agentic Forecast"
          description="Tell Neural PredictOS what you want to know and let AI select the relevant data automatically."
          cta="Use Agentic Mode"
          onClick={() => onChoose("agentic")}
        />
      </div>
    </div>
  );
}

function ModeCard({
  icon, title, description, cta, onClick, selected,
}: {
  icon: React.ReactNode; title: string; description: string; cta: string; onClick: () => void; selected: boolean;
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
      <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">{description}</p>
      <span className="mt-5 inline-flex w-fit items-center rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
        {cta}
      </span>
    </button>
  );
}

function Steps({ active }: { active: number }) {
  const steps = ["Configure", "Analyze", "Review Forecast"];
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
          {i < steps.length - 1 && <ChevronRight className="size-4 text-muted-foreground" />}
        </li>
      ))}
    </ol>
  );
}

function ModeSwitch({ mode, onChange }: { mode: ForecastMode; onChange: (m: ForecastMode) => void }) {
  return (
    <div className="inline-flex rounded-full border border-border bg-card p-1">
      {(["manual", "agentic"] as ForecastMode[]).map((m) => (
        <button
          key={m}
          onClick={() => onChange(m)}
          className={cn(
            "rounded-full px-4 py-1.5 text-sm font-medium transition",
            mode === m ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground",
          )}
        >
          {m === "manual" ? "Manual Forecast" : "Agentic Forecast"}
        </button>
      ))}
    </div>
  );
}

function Field({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
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
            <SelectItem key={o} value={o}>{o}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

function ManualPanel({
  scope, setScope, onSubmit,
}: { scope: ManualScope; setScope: (s: ManualScope) => void; onSubmit: () => void }) {
  const set = (k: keyof ManualScope) => (v: string) => setScope({ ...scope, [k]: v });
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
        <h3 className="text-lg font-semibold text-foreground">Configure Forecast</h3>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <Field label="Forecast Horizon" value={scope.horizon} options={HORIZONS} onChange={set("horizon")} />
          <Field label="Material Category" value={scope.category} options={CATEGORIES} onChange={set("category")} />
          <Field label="Material" value={scope.material} options={MATERIALS} onChange={set("material")} />
          <Field label="Style" value={scope.style} options={STYLES} onChange={set("style")} />
          <Field label="Buyer" value={scope.buyer} options={BUYERS} onChange={set("buyer")} />
        </div>
      </div>

      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h4 className="text-sm font-semibold text-foreground">Selected Forecast Scope</h4>
          <dl className="mt-3 space-y-2 text-sm">
            {[
              ["Forecast Horizon", scope.horizon],
              ["Material Category", scope.category],
              ["Material", scope.material],
              ["Styles", scope.style],
              ["Buyer", scope.buyer],
            ].map(([k, v]) => (
              <div key={k} className="flex items-start justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
                <dt className="text-muted-foreground">{k}</dt>
                <dd className="text-right font-medium text-foreground">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-6">
          <Button className="w-full" size="lg" onClick={onSubmit}>
            <Sparkles className="mr-2 size-4" /> Generate AI Forecast
          </Button>
          <p className="mt-3 text-xs leading-relaxed text-muted-foreground">
            Neural PredictOS will analyze historical demand and operational signals before
            generating the forecast.
          </p>
        </div>
      </div>
    </div>
  );
}

function AgenticPanel({
  prompt, setPrompt, material, onSubmit,
}: { prompt: string; setPrompt: (v: string) => void; material: string; onSubmit: () => void }) {
  const chips = ["Forecast fabric demand", "Forecast next 3 months", "Show highest demand materials"];
  return (
    <div className="grid gap-6 xl:grid-cols-3">
      <div className="rounded-2xl border border-border bg-card p-6 shadow-sm xl:col-span-2">
        <div className="flex items-center gap-2">
          <Wand2 className="size-5 text-primary" />
          <h3 className="text-lg font-semibold text-foreground">Ask Neural PredictOS</h3>
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Describe the forecast you need and the AI agent will select the relevant data
          automatically.
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
            AI will automatically identify the relevant planning data.
          </span>
        </div>
      </div>

      <div className="rounded-2xl border border-primary/25 bg-primary/[0.04] p-6">
        <h4 className="text-sm font-semibold text-foreground">AI understands</h4>
        <dl className="mt-3 space-y-2 text-sm">
          <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
            <dt className="text-muted-foreground">Material</dt>
            <dd className="text-right font-medium text-foreground">{material}</dd>
          </div>
          <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
            <dt className="text-muted-foreground">Horizon</dt>
            <dd className="font-medium text-foreground">6 Months</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          Analysis
        </p>
        <ul className="mt-2 space-y-1.5 text-sm text-foreground">
          {["Historical demand", "Planned production", "Confirmed orders", "Seasonality", "Recent trends"].map((a) => (
            <li key={a} className="flex items-center gap-2">
              <span className="size-1.5 rounded-full bg-primary" />
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
