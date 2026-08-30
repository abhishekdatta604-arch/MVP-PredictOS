import { useState } from "react";
import {
  Area,
  CartesianGrid,
  ComposedChart,
  Line,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  Download,
  Pencil,
  Sparkles,
  TrendingUp,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DRIVERS,
  FORECAST_ROWS,
  SERIES,
  fmt,
  type ForecastMode,
  type ManualScope,
} from "@/lib/smartdemand-data";
import { cn } from "@/lib/utils";

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn("rounded-2xl border border-border bg-card p-5 shadow-sm", className)}>
      {children}
    </div>
  );
}

const statusStyles: Record<string, string> = {
  Normal: "bg-secondary text-secondary-foreground",
  Watch: "bg-chart-4/15 text-[oklch(0.45_0.13_75)]",
  "High Demand": "bg-primary/12 text-primary",
};

export function ForecastResult({
  mode,
  scope,
  prompt,
  onReconfigure,
}: {
  mode: ForecastMode;
  scope: ManualScope;
  prompt: string;
  onReconfigure: () => void;
}) {
  const [rows, setRows] = useState(FORECAST_ROWS);
  const [editing, setEditing] = useState(false);
  const [adjusted, setAdjusted] = useState(false);
  const [accepted, setAccepted] = useState(false);

  const total = rows.reduce((s, r) => s + r.qty, 0);
  const avg = Math.round(total / rows.length);
  const peak = rows.reduce((a, b) => (b.qty > a.qty ? b : a));

  const chartData = SERIES.map((d) => {
    const row = rows.find((r) => r.month.startsWith(monthName(d.month)));
    return { ...d, forecast: row ? row.qty : d.forecast };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-start justify-between gap-4 rounded-2xl border border-border bg-card p-5 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold tracking-tight text-foreground">AI Demand Forecast</h2>
            <span className="inline-flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-[11px] font-semibold text-primary">
              <Sparkles className="size-3" /> AI Generated
            </span>
            {adjusted && (
              <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 text-[11px] font-semibold text-accent-foreground">
                Adjusted by Planner
              </span>
            )}
          </div>
          <p className="mt-1 text-sm text-muted-foreground">
            Forecast generated for {scope.material}
          </p>
          <dl className="mt-3 flex flex-wrap gap-x-8 gap-y-2 text-xs">
            <Meta label="Forecast Horizon" value="Jul–Dec 2026" />
            <Meta label="Forecast Generated" value="Just now" />
            <Meta label="Mode" value={mode === "manual" ? "Manual" : "Agentic"} />
            <Meta label="Confidence" value="87%" />
          </dl>
        </div>
        <Button variant="outline" onClick={onReconfigure}>
          Configure Forecast
        </Button>
      </div>

      {/* Summary cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Total Forecast Demand" value={`${fmt(total)} m`} hint="Jul–Dec 2026" />
        <Kpi label="Average Monthly Demand" value={`${fmt(avg)} m`} hint="6-month average" />
        <Kpi label="Peak Demand Month" value={peak.month.replace(" 2026", " 2026")} hint={`${fmt(peak.qty)} meters`} />
        <Kpi label="Forecast Confidence" value="87%" hint="High confidence" accent />
      </div>

      {/* Chart */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-foreground">Historical Demand vs AI Forecast</h3>
            <p className="text-xs text-muted-foreground">
              Forecast values are AI predictions, not confirmed material requirements.
            </p>
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground">
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-5 rounded bg-[var(--chart-2)]" /> Historical
            </span>
            <span className="flex items-center gap-2">
              <span className="h-0.5 w-5 rounded border-t-2 border-dashed border-primary" /> AI Forecast
            </span>
          </div>
        </div>
        <div className="mt-5 h-[320px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={chartData} margin={{ top: 10, right: 12, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="fcArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.22} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} fontSize={12} stroke="var(--muted-foreground)" />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="var(--muted-foreground)"
                tickFormatter={(v: number) => `${v / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid var(--border)",
                  fontSize: 12,
                  background: "var(--card)",
                }}
                formatter={(v: number, n: string) => [`${fmt(v)} m`, n === "historical" ? "Historical" : "AI Forecast"]}
              />
              <ReferenceLine x="Jun" stroke="var(--muted-foreground)" strokeDasharray="4 4" label={{ value: "Forecast →", position: "insideTopRight", fontSize: 11, fill: "var(--muted-foreground)" }} />
              <Area type="monotone" dataKey="forecast" stroke="none" fill="url(#fcArea)" connectNulls />
              <Line
                type="monotone"
                dataKey="historical"
                stroke="var(--chart-2)"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                connectNulls
              />
              <Line
                type="monotone"
                dataKey="forecast"
                stroke="var(--primary)"
                strokeWidth={2.5}
                strokeDasharray="6 5"
                dot={{ r: 3 }}
                connectNulls
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Table */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h3 className="text-base font-semibold text-foreground">Monthly Forecast</h3>
          {editing && (
            <span className="text-xs text-muted-foreground">Editing forecast quantities</span>
          )}
        </div>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[720px] text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                <th className="pb-2 font-medium">Month</th>
                <th className="pb-2 font-medium">AI Forecast</th>
                <th className="pb-2 font-medium">Change vs Prev.</th>
                <th className="pb-2 font-medium">Confidence</th>
                <th className="pb-2 font-medium">Planning Status</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.month} className="border-b border-border/70 last:border-0">
                  <td className="py-3 font-medium text-foreground">{r.month}</td>
                  <td className="py-3">
                    {editing ? (
                      <Input
                        type="number"
                        value={r.qty}
                        className="h-9 w-32"
                        onChange={(e) => {
                          const v = Number(e.target.value) || 0;
                          setRows((prev) => prev.map((x, j) => (j === i ? { ...x, qty: v } : x)));
                          setAdjusted(true);
                        }}
                      />
                    ) : (
                      `${fmt(r.qty)} m`
                    )}
                  </td>
                  <td className={cn("py-3 font-medium", r.change.startsWith("+") ? "text-primary" : "text-muted-foreground")}>
                    {r.change}
                  </td>
                  <td className="py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                        <div className="h-full rounded-full bg-primary" style={{ width: `${r.confidence}%` }} />
                      </div>
                      <span className="text-xs text-muted-foreground">{r.confidence}%</span>
                    </div>
                  </td>
                  <td className="py-3">
                    <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", statusStyles[r.status])}>
                      {r.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Drivers + insight */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h3 className="text-base font-semibold text-foreground">Why is AI predicting this?</h3>
          <p className="text-xs text-muted-foreground">
            Simulated AI drivers behind the forecast for this prototype.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {DRIVERS.map((d) => (
              <div key={d.title} className="rounded-xl border border-border bg-background/60 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">{d.title}</span>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[11px] font-semibold",
                      d.impact === "High" ? "bg-primary/12 text-primary" : "bg-accent text-accent-foreground",
                    )}
                  >
                    {d.impact} impact
                  </span>
                </div>
                <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div
                    className={cn("h-full rounded-full", d.impact === "High" ? "bg-primary" : "bg-[var(--chart-3)]")}
                    style={{ width: `${d.weight}%` }}
                  />
                </div>
                <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{d.description}</p>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card className="border-primary/25 bg-primary/[0.04]">
            <div className="flex items-center gap-2">
              <Sparkles className="size-4 text-primary" />
              <h3 className="text-base font-semibold text-foreground">Neural AI Insight</h3>
            </div>
            <p className="mt-3 text-sm leading-relaxed text-foreground/90">
              Cotton Fabric 180 GSM demand is expected to rise over the next 3 months, reaching a
              projected peak of 91,000 meters in October. The increase is primarily associated with
              higher planned production and recent consumption trends.
            </p>
            <Button variant="ghost" className="mt-3 px-0 text-primary hover:bg-transparent">
              View Detailed Drivers <ArrowUpRight className="ml-1 size-4" />
            </Button>
          </Card>

          <Card>
            <h3 className="text-base font-semibold text-foreground">Demand Outlook</h3>
            <div className="mt-4 space-y-3 text-sm">
              <Row label="Current trend" value={<span className="flex items-center gap-1 font-semibold text-primary"><TrendingUp className="size-4" /> Increasing</span>} />
              <Row label="Peak" value={<span className="font-semibold text-foreground">October 2026</span>} />
              <Row label="Expected growth" value={<span className="font-semibold text-foreground">+18% vs current monthly average</span>} />
            </div>
            <div className="mt-4 rounded-xl bg-secondary/70 p-3 text-xs leading-relaxed text-secondary-foreground">
              <span className="font-semibold">Planning implication: </span>
              Production Planning should review fabric availability ahead of the October demand peak.
            </div>
          </Card>
        </div>
      </div>

      {/* Forecast context */}
      <Card>
        <h3 className="text-base font-semibold text-foreground">Forecast Context</h3>
        {mode === "manual" ? (
          <div className="mt-3 grid gap-2 text-sm sm:grid-cols-2">
            <Row label="Mode" value="Manual" />
            <Row label="Horizon" value={scope.horizon} />
            <Row label="Category" value={scope.category} />
            <Row label="Material" value={scope.material} />
            <Row label="Styles" value={scope.style} />
            <Row label="Buyer" value={scope.buyer} />
            <p className="text-xs text-muted-foreground sm:col-span-2">Planner selected these inputs.</p>
          </div>
        ) : (
          <div className="mt-3 space-y-3 text-sm">
            <Row label="Mode" value="Agentic" />
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">User request</p>
              <p className="mt-1 rounded-xl bg-muted/70 p-3 text-sm leading-relaxed text-foreground">
                {prompt}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">AI-selected scope</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {["6-month horizon", scope.material, "All Styles", "All Buyers"].map((c) => (
                  <span key={c} className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                    {c}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}
      </Card>

      {/* Review */}
      <Card>
        <h3 className="text-base font-semibold text-foreground">Review AI Forecast</h3>
        <p className="mt-1 text-sm text-muted-foreground">
          Review the AI-generated forecast before using it for production and procurement planning.
        </p>
        {accepted ? (
          <div className="mt-4 flex items-start gap-3 rounded-xl border border-primary/25 bg-primary/[0.05] p-4">
            <CheckCircle2 className="mt-0.5 size-5 text-primary" />
            <div>
              <p className="text-sm font-semibold text-foreground">Forecast accepted</p>
              <p className="text-sm text-muted-foreground">
                Your reviewed forecast is now available for production and procurement planning.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-4 flex flex-wrap gap-3">
            <Button onClick={() => { setEditing(false); setAccepted(true); }}>
              <BadgeCheck className="mr-2 size-4" /> Accept Forecast
            </Button>
            <Button variant="outline" onClick={() => setEditing((v) => !v)}>
              <Pencil className="mr-2 size-4" /> {editing ? "Done Adjusting" : "Adjust Forecast"}
            </Button>
            <Button variant="ghost">
              <Download className="mr-2 size-4" /> Export Forecast
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}

function monthName(m: string) {
  const map: Record<string, string> = {
    Jul: "July", Aug: "August", Sep: "September", Oct: "October", Nov: "November", Dec: "December",
  };
  return map[m] ?? "___";
}

function Meta({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="mt-0.5 font-semibold text-foreground">{value}</dd>
    </div>
  );
}

function Kpi({ label, value, hint, accent }: { label: string; value: string; hint: string; accent?: boolean }) {
  return (
    <Card className={cn(accent && "border-primary/25 bg-primary/[0.04]")}>
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className="mt-2 text-2xl font-bold tracking-tight text-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
    </Card>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm text-foreground">{value}</span>
    </div>
  );
}
