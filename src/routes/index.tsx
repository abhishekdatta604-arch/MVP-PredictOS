import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  LineChart,
  ShieldAlert,
  ClipboardList,
  PieChart,
  SendHorizonal,
  Sparkle,
  TrendingUp,
  PackageSearch,
  Clock3,
  AlertTriangle,
} from "lucide-react";
import { AppShell } from "@/components/app-shell";
import robot from "@/assets/ai-assistant-robot.png";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard — Neural PredictOS Planning Intelligence" },
      {
        name: "description",
        content:
          "AI material demand forecasting, shortage risk intelligence and procurement priorities for apparel manufacturing planners.",
      },
      { property: "og:title", content: "Dashboard — Neural PredictOS" },
      {
        property: "og:description",
        content:
          "Forecast material demand, spot shortage risk early and decide what to procure next for your factory.",
      },
    ],
  }),
  component: Dashboard,
});

const HEADLINE = "Hello! I'm Neural PredictOS AI Assistant.";

function useTypewriter(text: string, speed = 45) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (count >= text.length) return;
    const id = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(id);
  }, [count, text, speed]);
  return { typed: text.slice(0, count), done: count >= text.length };
}

const capabilities = [
  { icon: LineChart, title: "AI Forecasting", desc: "Demand forecasts", tone: "text-primary bg-primary/10" },
  {
    icon: ShieldAlert,
    title: "Risk Intelligence",
    desc: "Future shortage risks",
    tone: "text-[oklch(0.52_0.16_285)] bg-[oklch(0.52_0.16_285/0.1)]",
  },
  {
    icon: ClipboardList,
    title: "Procurement Recommendations",
    desc: "What to procure next",
    tone: "text-[oklch(0.52_0.14_250)] bg-[oklch(0.52_0.14_250/0.1)]",
  },
  { icon: PieChart, title: "Data Insights & Reports", desc: "Planning intelligence", tone: "text-primary bg-primary/10" },
];

const suggestions = [
  "Which materials are at risk next month?",
  "Forecast fabric demand for Q4",
  "What should procurement prioritize?",
];

const kpis = [
  { label: "Forecasted material demand", value: "1.42M yds", note: "Next 90 days", icon: TrendingUp, delta: "+8.4%" },
  { label: "Materials at shortage risk", value: "17 SKUs", note: "Across 4 buyers", icon: AlertTriangle, delta: "+3" },
  { label: "Open procurement actions", value: "23", note: "9 due this week", icon: PackageSearch, delta: "−5" },
  { label: "Avg. supplier lead time", value: "34 days", note: "Knit fabric mills", icon: Clock3, delta: "+2d" },
];

const risks = [
  { material: "60/40 CVC Fleece — Melange Grey", buyer: "H&M · PO-24188", need: "12 Oct", gap: "18,400 yds short", level: "Critical" },
  { material: "YKK #5 Metal Zipper — 18cm", buyer: "Zara · PO-24211", need: "21 Oct", gap: "42,000 pcs short", level: "High" },
  { material: "Single Jersey 180 GSM — White", buyer: "Primark · PO-24095", need: "02 Nov", gap: "6,200 kg short", level: "Medium" },
  { material: "Woven Care Label — Composition", buyer: "C&A · PO-24240", need: "14 Nov", gap: "On track", level: "Low" },
];

const levelStyles: Record<string, string> = {
  Critical: "bg-destructive/10 text-destructive",
  High: "bg-[oklch(0.62_0.16_60/0.14)] text-[oklch(0.5_0.14_60)]",
  Medium: "bg-[oklch(0.52_0.14_250/0.12)] text-[oklch(0.45_0.14_250)]",
  Low: "bg-primary/10 text-primary",
};

const cardShadow =
  "shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-16px_rgba(16,24,40,0.16)]";

function Dashboard() {
  const { typed, done } = useTypewriter(HEADLINE);
  const [prompt, setPrompt] = useState("");

  const highlight = "Neural PredictOS";
  const idx = typed.indexOf(highlight);
  const head =
    idx === -1 ? (
      typed
    ) : (
      <>
        {typed.slice(0, idx)}
        <span className="text-primary">{typed.slice(idx, idx + highlight.length)}</span>
        {typed.slice(idx + highlight.length)}
      </>
    );

  return (
    <AppShell title="Good Morning, Planner" subtitle="Here's your planning intelligence for today.">
      <div className="space-y-6">
        <section className={`overflow-hidden rounded-3xl border border-border bg-card ${cardShadow}`}>
          <div className="grid gap-8 p-6 lg:grid-cols-[minmax(0,340px)_1fr] lg:p-8">
            <div className="flex items-center justify-center rounded-3xl bg-[linear-gradient(180deg,oklch(0.95_0.05_160)_0%,oklch(0.94_0.04_285)_100%)] p-6">
              <video
                src="/Robot Waving.mp4"
                autoPlay
                loop
                muted
                playsInline
                className="max-h-[400px] w-auto object-contain drop-shadow-xl"
              />
            </div>

            <div>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <Sparkle className="size-3.5" /> AI Assistant
              </span>

              <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-foreground lg:text-[34px]">
                {head}
                <span
                  aria-hidden
                  className={`ml-0.5 inline-block h-[0.9em] w-[3px] translate-y-[2px] bg-primary ${done ? "opacity-0" : "animate-pulse"}`}
                />
              </h2>

              <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                I help you forecast material demand, identify risks, prioritize procurement and make smarter
                decisions for your factory.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {capabilities.map((c) => (
                  <div key={c.title} className="rounded-2xl border border-border bg-background p-4">
                    <span className={`flex size-9 items-center justify-center rounded-xl ${c.tone}`}>
                      <c.icon className="size-[18px]" strokeWidth={1.8} />
                    </span>
                    <p className="mt-3 break-words text-[13.5px] font-semibold leading-snug text-foreground">{c.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">{c.desc}</p>
                  </div>
                ))}
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                <button className="rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
                  Ask Neural PredictOS
                </button>
                <button className="rounded-xl border border-border bg-background px-5 py-3 text-sm font-semibold text-foreground transition hover:border-primary/40">
                  View Today's Insights
                </button>
              </div>

              <div className="mt-6 rounded-2xl border border-border bg-muted/50 p-4">
                <form
                  onSubmit={(e) => e.preventDefault()}
                  className="flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-2"
                >
                  <input
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Ask Neural PredictOS anything about your material demand or procurement…"
                    className="h-10 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                  />
                  <button
                    type="submit"
                    aria-label="Send prompt"
                    className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition hover:opacity-90"
                  >
                    <SendHorizonal className="size-[18px]" />
                  </button>
                </form>
                <div className="mt-3 flex flex-wrap gap-2">
                  {suggestions.map((s) => (
                    <button
                      key={s}
                      onClick={() => setPrompt(s)}
                      className="rounded-full border border-border bg-card px-3.5 py-2 text-xs font-medium text-foreground transition hover:border-primary/40 hover:text-primary"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppShell>
  );
}
