import { useState } from "react";
import {
  AlertTriangle,
  ArrowUpRight,
  BadgeCheck,
  CalendarClock,
  CheckCircle2,
  Info,
  Pencil,
  Sparkles,
  XCircle,
} from "lucide-react";
import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  ZAxis,
  ReferenceLine,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import {
  AGENTIC_SCOPE_ITEMS,
  PRIORITY_FACTORS,
  RISK_DISTRIBUTION,
  RISK_DRIVERS,
  RISK_ROWS,
  TIMELINE_EVENTS,
  TIMELINE_MONTHS,
  type AnalysisMode,
  type PriorityLevel,
  type ProcurementScope,
  type RiskRow,
} from "@/lib/procurement-data";
import { cn } from "@/lib/utils";

type Status = "Pending Review" | "Approved" | "Modified" | "Dismissed";

const levelClass: Record<PriorityLevel, string> = {
  Critical: "bg-destructive/10 text-destructive border-destructive/25",
  High: "bg-chart-4/10 text-chart-4 border-chart-4/30",
  Medium: "bg-chart-3/10 text-chart-3 border-chart-3/30",
  Low: "bg-primary/10 text-primary border-primary/25",
};

const referenceDate = new Date("2026-08-30");

const getNumericShortage = (shortageStr: string) => {
  return parseInt(shortageStr.replace(/[^0-9]/g, ""), 10) || 0;
};

const getNumericLeadTime = (leadTimeStr: string) => {
  return parseInt(leadTimeStr.replace(/[^0-9]/g, ""), 10) || 0;
};

const getDaysUntilRequired = (requiredDateStr: string) => {
  const reqDate = new Date(requiredDateStr);
  const diffTime = reqDate.getTime() - referenceDate.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="rounded-xl border border-border bg-card p-3 shadow-md text-xs space-y-1.5 z-50">
        <p className="font-bold text-foreground">{data.material}</p>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1 text-muted-foreground">
          <span>Risk Level:</span>
          <span className="font-semibold text-foreground">{data.level} (Score: {data.score})</span>
          <span>Required Date:</span>
          <span className="font-semibold text-foreground">{data.requiredDate}</span>
          <span>Days Until Required:</span>
          <span className="font-semibold text-foreground">{data.x} days</span>
          <span>Lead Time:</span>
          <span className="font-semibold text-foreground">{data.leadTime}</span>
          <span>Shortage Quantity:</span>
          <span className="font-semibold text-foreground text-destructive">{data.shortage}</span>
        </div>
      </div>
    );
  }
  return null;
};

function Card({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <section className={cn("rounded-2xl border border-border bg-card p-6 shadow-sm", className)}>
      {children}
    </section>
  );
}

export function ProcurementResult({
  mode,
  scope,
  prompt,
  onReconfigure,
}: {
  mode: AnalysisMode;
  scope: ProcurementScope;
  prompt: string;
  onReconfigure: () => void;
}) {
  const top = RISK_ROWS[0];
  const [status, setStatus] = useState<Status>("Pending Review");
  const [editing, setEditing] = useState(false);
  const [rec, setRec] = useState({
    quantity: "25,000 meters",
    actionDate: "Before 10 Aug 2026",
    supplier: top.supplier,
  });
  const [drawer, setDrawer] = useState<RiskRow | null>(null);

  const matrixData = RISK_ROWS.map((r) => {
    const shortageVal = getNumericShortage(r.shortage);
    const leadTimeVal = getNumericLeadTime(r.leadTime);
    const daysVal = getDaysUntilRequired(r.requiredDate);

    return {
      ...r,
      x: daysVal, // Days Until Required
      y: leadTimeVal, // Lead Time
      z: shortageVal, // Shortage Quantity
    };
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card>
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="text-2xl font-bold tracking-tight text-foreground">
                Procurement Intelligence
              </h2>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/25 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                <BadgeCheck className="size-3.5" /> AI Risk Analysis Complete
              </span>
            </div>
            <p className="mt-1.5 text-sm text-muted-foreground">
              AI-powered view of future material risks and procurement priorities.
            </p>
          </div>
          <Button variant="outline" onClick={onReconfigure}>
            Back to Analysis
          </Button>
        </div>

        <dl className="mt-5 grid gap-4 border-t border-border pt-4 text-sm sm:grid-cols-3 lg:grid-cols-5">
          {[
            ["Analysis Window", "Jul–Dec 2026"],
            ["Materials Analyzed", "128"],
            ["High Risk", "12"],
            ["Analysis Generated", "Just now"],
            ["Mode", mode === "manual" ? "Manual" : "Agentic"],
          ].map(([k, v]) => (
            <div key={k}>
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
              <dd className="mt-0.5 font-semibold text-foreground">{v}</dd>
            </div>
          ))}
        </dl>
      </Card>

      {/* KPIs + AI insight */}
      <div className="grid gap-6 xl:grid-cols-3">
        <div className="space-y-4 xl:col-span-2">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Kpi label="Materials Analyzed" value="128" />
            <Kpi label="Critical Risks" value="4" tone="destructive" />
            <Kpi label="High Risks" value="8" tone="warning" />
            <Kpi label="Recommended Procurement" value="৳12.8M" tone="primary" />
          </div>
          <p className="text-sm text-muted-foreground">
            12 materials require procurement attention within the planning horizon.
          </p>
        </div>

        <Card className="border-primary/25 bg-primary/[0.04]">
          <div className="flex items-center gap-2">
            <Sparkles className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">Neural AI Insight</h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-foreground/90">
            12 materials require procurement attention during the next 6 months. Cotton Fabric 180
            GSM has the highest risk because projected demand exceeds available supply and supplier
            lead time limits the recovery window.
          </p>
          <button
            onClick={() => setDrawer(top)}
            className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-primary hover:underline"
          >
            View Critical Risks <ArrowUpRight className="size-4" />
          </button>
        </Card>
      </div>

      {/* Priority board */}
      <Card className="p-0">
        <div className="p-6 pb-4">
          <h3 className="text-lg font-semibold text-foreground">Procurement Priority</h3>
          <p className="text-sm text-muted-foreground">
            Materials ranked by AI-assessed business urgency.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[980px] text-sm">
            <thead>
              <tr className="border-y border-border bg-muted/40 text-left text-xs uppercase tracking-wide text-muted-foreground">
                {["Priority", "Material", "Shortage Qty", "Required Date", "Lead Time", "Risk Score", "Priority Level", "AI Recommendation", ""].map(
                  (h) => (
                    <th key={h} className="px-4 py-3 font-semibold">
                      {h}
                    </th>
                  ),
                )}
              </tr>
            </thead>
            <tbody>
              {RISK_ROWS.map((r) => (
                <tr
                  key={r.material}
                  className={cn(
                    "border-b border-border/70 last:border-0",
                    r.rank === 1 && "bg-destructive/[0.04]",
                  )}
                >
                  <td className="px-4 py-3">
                    <span
                      className={cn(
                        "flex size-8 items-center justify-center rounded-xl text-sm font-bold",
                        r.rank === 1
                          ? "bg-destructive text-primary-foreground"
                          : r.rank <= 3
                            ? "bg-chart-4/15 text-chart-4"
                            : "bg-muted text-muted-foreground",
                      )}
                    >
                      {r.rank}
                    </span>
                  </td>
                  <td className={cn("px-4 py-3 text-foreground", r.rank === 1 ? "font-bold" : "font-medium")}>
                    {r.material}
                  </td>
                  <td className="px-4 py-3 font-medium tabular-nums text-foreground">{r.shortage}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.requiredDate}</td>
                  <td className="px-4 py-3 text-muted-foreground">{r.leadTime}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-secondary">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            r.score >= 85 ? "bg-destructive" : r.score >= 70 ? "bg-chart-4" : "bg-chart-3",
                          )}
                          style={{ width: `${r.score}%` }}
                        />
                      </div>
                      <span className="tabular-nums font-semibold text-foreground">{r.score}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={cn("rounded-full border px-2.5 py-1 text-xs font-semibold", levelClass[r.level])}>
                      {r.level}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{r.recommendation}</td>
                  <td className="px-4 py-3 text-right">
                    <Button size="sm" variant="outline" onClick={() => setDrawer(r)}>
                      Review
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Risk distribution + timeline */}
      <div className="grid gap-6 xl:grid-cols-2">
        <Card className="flex flex-col h-full">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold text-foreground">Material Risk Matrix</h3>
              <p className="text-sm text-muted-foreground">Urgency mapping of material shortages against supplier lead times.</p>
            </div>
          </div>

          <div className="relative mt-6 flex-1 min-h-[340px]">
            <div className="relative w-full h-[300px]">
              {/* Subtle quadrant labels grid overlay constrained to plotting area */}
              <div className="absolute left-[70px] right-[40px] top-[20px] bottom-[30px] pointer-events-none grid grid-cols-2 grid-rows-2 text-[9px] sm:text-[10px] font-bold text-black dark:text-white uppercase tracking-wider">
                <div className="flex items-start justify-start p-2">
                  High Lead Time / Soon Required — Act Now
                </div>
                <div className="flex items-start justify-end text-right p-2">
                  High Lead Time / Later Required — Plan Ahead
                </div>
                <div className="flex items-end justify-start p-2 pb-5">
                  Low Lead Time / Soon Required — Monitor Closely
                </div>
                <div className="flex items-end justify-end text-right p-2 pb-5">
                  Low Lead Time / Later Required — Low Risk
                </div>
              </div>

              <ResponsiveContainer width="100%" height={300}>
                <ScatterChart
                  margin={{ top: 20, right: 30, bottom: 30, left: 20 }}
                >
                  <XAxis
                    type="number"
                    dataKey="x"
                    name="Days Until Required"
                    domain={[0, 80]}
                    stroke="currentColor"
                    className="text-muted-foreground text-[10px] sm:text-xs"
                    label={{
                      value: "Days Until Required",
                      position: "bottom",
                      offset: 10,
                      className: "fill-muted-foreground text-[11px] font-medium"
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="y"
                    name="Supplier Lead Time"
                    domain={[0, 45]}
                    stroke="currentColor"
                    className="text-muted-foreground text-[10px] sm:text-xs"
                    label={{
                      value: "Supplier Lead Time (Days)",
                      angle: -90,
                      position: "insideLeft",
                      offset: -5,
                      className: "fill-muted-foreground text-[11px] font-medium"
                    }}
                  />
                  <ZAxis
                    type="number"
                    dataKey="z"
                    range={[200, 1800]}
                    name="Shortage Quantity"
                  />
                  <ReferenceLine x={35} stroke="rgba(156, 163, 175, 0.25)" strokeDasharray="3 3" />
                  <ReferenceLine y={25} stroke="rgba(156, 163, 175, 0.25)" strokeDasharray="3 3" />
                  <Tooltip content={<CustomTooltip />} cursor={{ strokeDasharray: '3 3' }} />
                  <Scatter name="Materials" data={matrixData}>
                    {matrixData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.level === "Critical"
                            ? "var(--destructive)"
                            : entry.level === "High"
                              ? "var(--chart-4)"
                              : entry.level === "Medium"
                                ? "var(--chart-3)"
                                : "var(--primary)"
                        }
                        onClick={() => setDrawer(entry)}
                        className="cursor-pointer hover:brightness-95 active:scale-95 transition-all outline-none"
                      />
                    ))}
                  </Scatter>
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-border/60 pt-4 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <span className="font-semibold text-muted-foreground uppercase tracking-wide text-[10px]">Legend:</span>
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <span className="size-2.5 rounded-full bg-destructive" /> Critical
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <span className="size-2.5 rounded-full bg-chart-4" /> High
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <span className="size-2.5 rounded-full bg-chart-3" /> Medium
              </span>
              <span className="flex items-center gap-1.5 text-muted-foreground font-medium">
                <span className="size-2.5 rounded-full bg-primary" /> Low
              </span>
            </div>
            <span className="text-muted-foreground font-semibold text-[11px] italic">
              * Bubble size = Shortage Quantity
            </span>
          </div>
        </Card>

        <Card>
          <h3 className="text-lg font-semibold text-foreground">Future Shortage Timeline</h3>
          <p className="text-sm text-muted-foreground">When materials are expected to become insufficient.</p>
          <div className="mt-6 space-y-3">
            {TIMELINE_EVENTS.map((e) => {
              const idx = TIMELINE_MONTHS.indexOf(e.month);
              const left = ((idx + e.offset) / TIMELINE_MONTHS.length) * 100;
              return (
                <div key={e.material} className="relative">
                  <div className="mb-1 flex items-baseline justify-between gap-3 text-xs">
                    <span className="font-medium text-foreground">{e.material}</span>
                    <span className={cn("rounded-full border px-2 py-0.5 font-semibold", levelClass[e.level])}>
                      {e.date}
                    </span>
                  </div>
                  <div className="relative h-2 rounded-full bg-muted">
                    <span
                      className={cn(
                        "absolute top-1/2 size-3 -translate-x-1/2 -translate-y-1/2 rounded-full ring-2 ring-card",
                        e.level === "Critical"
                          ? "bg-destructive"
                          : e.level === "High"
                            ? "bg-chart-4"
                            : "bg-chart-3",
                      )}
                      style={{ left: `${left}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4 flex justify-between border-t border-border pt-2 text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
            {TIMELINE_MONTHS.map((m) => (
              <span key={m}>{m}</span>
            ))}
          </div>
        </Card>
      </div>

      {/* Supply vs demand */}
      <Card>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-lg font-semibold text-foreground">{top.material}</h3>
            <p className="text-sm text-muted-foreground">Supply vs demand balance for the planning window.</p>
          </div>
          <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", levelClass.Critical)}>
            Projected shortage 25,000 m
          </span>
        </div>

        <div className="mt-5 space-y-3">
          {[
            { label: "Required Demand", value: 105000, display: "105,000 m", color: "bg-chart-2" },
            { label: "Current Inventory", value: 30000, display: "30,000 m", color: "bg-primary" },
            { label: "Incoming PO", value: 50000, display: "50,000 m", color: "bg-chart-3" },
            { label: "Available Supply", value: 80000, display: "80,000 m", color: "bg-chart-4" },
            { label: "Projected Shortage", value: 25000, display: "25,000 m", color: "bg-destructive" },
          ].map((b) => (
            <div key={b.label}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-muted-foreground">{b.label}</span>
                <span className="font-semibold tabular-nums text-foreground">{b.display}</span>
              </div>
              <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                <div className={cn("h-full rounded-full", b.color)} style={{ width: `${(b.value / 105000) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <p className="mt-5 rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm font-medium tabular-nums text-foreground">
          105,000 − (30,000 + 50,000) = <span className="text-destructive">25,000 m shortage</span>
        </p>
      </Card>

      {/* Risk explanation */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h3 className="text-lg font-semibold text-foreground">Why is this material high risk?</h3>
            <span className="rounded-full border border-destructive/25 bg-destructive/10 px-3 py-1 text-xs font-semibold text-destructive">
              Risk Score 92 / 100
            </span>
          </div>
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            {RISK_DRIVERS.map((d) => (
              <div key={d.title} className="rounded-xl border border-border p-4">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground">{d.title}</p>
                  <span
                    className={cn(
                      "rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
                      d.impact === "High Impact"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-chart-3/10 text-chart-3",
                    )}
                  >
                    {d.impact}
                  </span>
                </div>
                <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
                  <div className="h-full rounded-full bg-primary" style={{ width: `${d.weight}%` }} />
                </div>
                <p className="mt-2 text-xs leading-relaxed text-muted-foreground">{d.description}</p>
              </div>
            ))}
          </div>
          <div className="mt-5 rounded-xl border border-primary/25 bg-primary/[0.04] p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-primary">AI Assessment</p>
            <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">
              Cotton Fabric 180 GSM is classified as Critical because projected demand exceeds
              available supply by 25,000 meters and the estimated supplier lead time leaves a
              limited response window.
            </p>
          </div>
        </Card>

        <Card>
          <div className="flex items-center gap-2">
            <Info className="size-4 text-primary" />
            <h3 className="text-sm font-semibold text-foreground">How is priority determined?</h3>
          </div>
          <ul className="mt-3 space-y-2 text-sm text-foreground">
            {PRIORITY_FACTORS.map((f) => (
              <li key={f} className="flex items-center gap-2">
                <span className="size-1.5 rounded-full bg-primary" />
                {f}
              </li>
            ))}
          </ul>
          <p className="mt-4 rounded-xl bg-muted/50 p-3 text-xs leading-relaxed text-muted-foreground">
            Priority Score = Business Urgency based on demand, supply and timing signals.
          </p>
        </Card>
      </div>

      {/* Recommendation */}
      <Card className="border-primary/30 bg-primary/[0.03]">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Sparkles className="size-5 text-primary" />
            <h3 className="text-lg font-semibold text-foreground">AI Procurement Recommendation</h3>
          </div>
          <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", levelClass.Critical)}>
            CRITICAL
          </span>
        </div>

        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            ["Material", top.material],
            ["Recommended Quantity", rec.quantity],
            ["Recommended Action Date", rec.actionDate],
            ["Expected Need Date", "15 Sep 2026"],
          ].map(([k, v]) => (
            <div key={k} className="rounded-xl border border-border bg-card p-4">
              <dt className="text-xs uppercase tracking-wide text-muted-foreground">{k}</dt>
              <dd className="mt-1 text-sm font-semibold text-foreground">{v}</dd>
            </div>
          ))}
        </dl>

        <p className="mt-4 text-sm leading-relaxed text-foreground/90">
          Place procurement order for 25,000 meters before 10 Aug to cover the projected shortage
          and protect the September production requirement.
        </p>

        {editing && (
          <div className="mt-4 grid gap-3 rounded-xl border border-border bg-card p-4 sm:grid-cols-3">
            <LabeledInput label="Quantity" value={rec.quantity} onChange={(v) => setRec({ ...rec, quantity: v })} />
            <LabeledInput label="Action Date" value={rec.actionDate} onChange={(v) => setRec({ ...rec, actionDate: v })} />
            <LabeledInput label="Supplier" value={rec.supplier} onChange={(v) => setRec({ ...rec, supplier: v })} />
            <div className="sm:col-span-3">
              <Button
                size="sm"
                onClick={() => {
                  setEditing(false);
                  setStatus("Modified");
                }}
              >
                Save changes
              </Button>
            </div>
          </div>
        )}

        <div className="mt-5 flex flex-wrap items-center gap-3">
          <Button onClick={() => setStatus("Approved")}>
            <CheckCircle2 className="mr-2 size-4" /> Approve Recommendation
          </Button>
          <Button variant="outline" onClick={() => setEditing((e) => !e)}>
            <Pencil className="mr-2 size-4" /> Modify
          </Button>
          <Button variant="ghost" onClick={() => setDrawer(top)}>
            View Reasoning
          </Button>
        </div>

        {status === "Approved" && (
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-primary/25 bg-primary/10 px-4 py-3 text-sm font-medium text-primary">
            <CheckCircle2 className="size-4" /> Approved by Procurement Manager — procurement
            recommendation approved for action.
          </p>
        )}
        {status === "Modified" && (
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-chart-3/30 bg-chart-3/10 px-4 py-3 text-sm font-medium text-chart-3">
            <Pencil className="size-4" /> Modified by Procurement Manager
          </p>
        )}
        {status === "Dismissed" && (
          <p className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-muted px-4 py-3 text-sm font-medium text-muted-foreground">
            <XCircle className="size-4" /> Dismissed by Procurement Manager
          </p>
        )}
      </Card>

      {/* Manager review + context */}
      <div className="grid gap-6 xl:grid-cols-3">
        <Card className="xl:col-span-2">
          <h3 className="text-lg font-semibold text-foreground">Manager Review</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            Neural PredictOS provides recommendations; final procurement decisions remain with the
            Procurement Manager.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {(["Pending Review", "Approved", "Modified", "Dismissed"] as Status[]).map((s) => (
              <span
                key={s}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-xs font-semibold",
                  status === s
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border text-muted-foreground",
                )}
              >
                {s}
              </span>
            ))}
          </div>
        </Card>

        <Card>
          <h3 className="text-sm font-semibold text-foreground">Analysis Context</h3>
          {mode === "manual" ? (
            <dl className="mt-3 space-y-2 text-sm">
              {[
                ["Mode", "Manual"],
                ["Forecast", "Latest AI Forecast"],
                ["Planning Window", scope.window],
                ["Material Scope", scope.material],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
                  <dt className="text-muted-foreground">{k}</dt>
                  <dd className="text-right font-medium text-foreground">{v}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <div className="mt-3 space-y-3 text-sm">
              <div className="flex justify-between gap-4 border-b border-border/60 pb-2">
                <span className="text-muted-foreground">Mode</span>
                <span className="font-medium text-foreground">Agentic</span>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  User Request
                </p>
                <p className="mt-1 rounded-xl bg-muted/50 p-3 text-xs leading-relaxed text-foreground/90">
                  {prompt}
                </p>
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  AI Scope Identified
                </p>
                <ul className="mt-1.5 space-y-1">
                  {AGENTIC_SCOPE_ITEMS.map((i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-foreground">
                      <span className="size-1.5 rounded-full bg-primary" />
                      {i}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </Card>
      </div>

      <MaterialDrawer
        row={drawer}
        onClose={() => setDrawer(null)}
        onDecision={(s) => {
          setStatus(s);
          setDrawer(null);
        }}
      />
    </div>
  );
}

function Kpi({
  label,
  value,
  tone = "default",
}: {
  label: string;
  value: string;
  tone?: "default" | "destructive" | "warning" | "primary";
}) {
  const toneClass =
    tone === "destructive"
      ? "text-destructive"
      : tone === "warning"
        ? "text-chart-4"
        : tone === "primary"
          ? "text-primary"
          : "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card p-5 shadow-sm">
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={cn("mt-2 text-2xl font-bold tabular-nums", toneClass)}>{value}</p>
    </div>
  );
}

function LabeledInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-muted-foreground">
        {label}
      </label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function MaterialDrawer({
  row,
  onClose,
  onDecision,
}: {
  row: RiskRow | null;
  onClose: () => void;
  onDecision: (s: Status) => void;
}) {
  return (
    <Sheet open={!!row} onOpenChange={(o) => !o && onClose()}>
      <SheetContent side="right" className="w-full overflow-y-auto sm:max-w-md">
        {row && (
          <>
            <SheetHeader>
              <SheetTitle className="text-lg">{row.material}</SheetTitle>
            </SheetHeader>
            <div className="space-y-4 px-4 pb-6">
              <div className="flex items-center gap-2">
                <span className={cn("rounded-full border px-3 py-1 text-xs font-semibold", levelClass[row.level])}>
                  {row.level}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs font-semibold text-foreground">
                  <AlertTriangle className="size-3.5 text-chart-4" /> Risk Score {row.score}
                </span>
              </div>

              <dl className="space-y-2 text-sm">
                {[
                  ["Required Date", row.requiredDate],
                  ["Forecast Demand", row.demand],
                  ["Inventory", row.inventory],
                  ["Incoming PO", row.incomingPo],
                  ["Projected Shortage", row.shortage],
                  ["Supplier", row.supplier],
                  ["Lead Time", row.leadTime],
                  ["AI Recommendation", row.recommendation],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 border-b border-border/60 pb-2 last:border-0">
                    <dt className="text-muted-foreground">{k}</dt>
                    <dd className="text-right font-medium text-foreground">{v}</dd>
                  </div>
                ))}
              </dl>

              <div className="rounded-xl border border-primary/25 bg-primary/[0.04] p-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-primary">
                  <CalendarClock className="size-3.5" /> Reasoning
                </p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{row.reasoning}</p>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button size="sm" onClick={() => onDecision("Approved")}>
                  Approve
                </Button>
                <Button size="sm" variant="outline" onClick={() => onDecision("Modified")}>
                  Modify
                </Button>
                <Button size="sm" variant="ghost" onClick={() => onDecision("Dismissed")}>
                  Dismiss
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
