export type AnalysisMode = "manual" | "agentic";

export type ProcurementScope = {
  forecast: string;
  category: string;
  material: string;
  window: string;
  risk: string;
};

export const FORECASTS = ["Latest AI Forecast — July–December 2026"];

export const P_CATEGORIES = [
  "All Materials",
  "Fabric",
  "Thread",
  "Buttons",
  "Zippers",
  "Labels",
  "Packaging",
];

export const P_MATERIALS = [
  "All Materials",
  "Cotton Fabric 180 GSM",
  "Cotton Fabric 220 GSM",
  "Polyester Thread 40/2",
  "Black Resin Buttons 18L",
  'Metal Zipper 5"',
  "Care Label",
  "Poly Bag 12×16",
];

export const WINDOWS = ["Next 1 Month", "Next 2 Months", "Next 3 Months", "Next 6 Months"];

export const RISK_LEVELS = ["All Risks", "Critical", "High", "Medium", "Low"];

export const DEFAULT_PROC_SCOPE: ProcurementScope = {
  forecast: FORECASTS[0],
  category: "All Materials",
  material: "All Materials",
  window: "Next 6 Months",
  risk: "All Risks",
};

export const PROC_PROMPT =
  "Analyze the next 6 months of material demand against current inventory and open purchase orders. Identify materials that are likely to become short, rank them by procurement priority, and recommend what quantity we should procure and when we should act. Focus especially on materials that could impact production.";

export const PROC_ANALYSIS_STEPS = [
  "Loading demand forecast",
  "Checking current inventory",
  "Reviewing open purchase orders",
  "Evaluating required dates",
  "Analyzing supplier lead times",
  "Detecting future shortages",
  "Calculating risk scores",
  "Ranking procurement priorities",
  "Generating recommendations",
];

export const PROC_PCT_MARKS = [0, 12, 24, 39, 52, 67, 81, 93, 100];

export type PriorityLevel = "Critical" | "High" | "Medium" | "Low";

export type RiskRow = {
  rank: number;
  material: string;
  shortage: string;
  requiredDate: string;
  leadTime: string;
  score: number;
  level: PriorityLevel;
  recommendation: string;
  supplier: string;
  demand: string;
  inventory: string;
  incomingPo: string;
  reasoning: string;
  shortageMonth: string;
};

export const RISK_ROWS: RiskRow[] = [
  {
    rank: 1,
    material: "Cotton Fabric 180 GSM",
    shortage: "25,000 m",
    requiredDate: "15 Sep 2026",
    leadTime: "35 days",
    score: 92,
    level: "Critical",
    recommendation: "Procure 25,000 m",
    supplier: "ABC Textiles Ltd.",
    demand: "105,000 m",
    inventory: "30,000 m",
    incomingPo: "50,000 m",
    reasoning:
      "Demand exceeds available supply and supplier lead time creates a limited recovery window.",
    shortageMonth: "Sep",
  },
  {
    rank: 2,
    material: "Black Resin Buttons 18L",
    shortage: "50,000 pcs",
    requiredDate: "03 Oct 2026",
    leadTime: "28 days",
    score: 87,
    level: "High",
    recommendation: "Procure 50,000 pcs",
    supplier: "Dhaka Trims Co.",
    demand: "210,000 pcs",
    inventory: "80,000 pcs",
    incomingPo: "80,000 pcs",
    reasoning: "Open purchase orders cover only part of the projected October requirement.",
    shortageMonth: "Oct",
  },
  {
    rank: 3,
    material: "Polyester Thread 40/2",
    shortage: "8,500 cones",
    requiredDate: "22 Sep 2026",
    leadTime: "21 days",
    score: 81,
    level: "High",
    recommendation: "Place supplier order",
    supplier: "Novo Threads BD",
    demand: "36,500 cones",
    inventory: "12,000 cones",
    incomingPo: "16,000 cones",
    reasoning: "Consumption is trending above plan while inventory coverage is falling.",
    shortageMonth: "Sep",
  },
  {
    rank: 4,
    material: 'Metal Zipper 5"',
    shortage: "12,000 pcs",
    requiredDate: "11 Oct 2026",
    leadTime: "30 days",
    score: 68,
    level: "Medium",
    recommendation: "Monitor supply",
    supplier: "Zip Line Industries",
    demand: "92,000 pcs",
    inventory: "40,000 pcs",
    incomingPo: "40,000 pcs",
    reasoning: "Shortage is moderate but supplier lead time reduces the response window.",
    shortageMonth: "Oct",
  },
  {
    rank: 5,
    material: "Care Label",
    shortage: "35,000 pcs",
    requiredDate: "02 Nov 2026",
    leadTime: "14 days",
    score: 51,
    level: "Medium",
    recommendation: "Review open PO",
    supplier: "PrintPack Labels",
    demand: "155,000 pcs",
    inventory: "60,000 pcs",
    incomingPo: "60,000 pcs",
    reasoning: "Short lead time allows recovery, but the open PO should be confirmed.",
    shortageMonth: "Nov",
  },
];

export const RISK_DISTRIBUTION = [
  { name: "Critical", value: 4, color: "var(--destructive)" },
  { name: "High", value: 8, color: "var(--chart-4)" },
  { name: "Medium", value: 19, color: "var(--chart-3)" },
  { name: "Low", value: 97, color: "var(--primary)" },
];

export const TIMELINE_MONTHS = ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb"];

export const TIMELINE_EVENTS = [
  { material: "Cotton Fabric 180 GSM", date: "15 Sep", month: "Sep", offset: 0.5, level: "Critical" as PriorityLevel },
  { material: "Polyester Thread 40/2", date: "22 Sep", month: "Sep", offset: 0.72, level: "High" as PriorityLevel },
  { material: "Black Resin Buttons 18L", date: "03 Oct", month: "Oct", offset: 0.1, level: "High" as PriorityLevel },
  { material: 'Metal Zipper 5"', date: "11 Oct", month: "Oct", offset: 0.35, level: "Medium" as PriorityLevel },
  { material: "Care Label", date: "02 Nov", month: "Nov", offset: 0.07, level: "Medium" as PriorityLevel },
];

export const RISK_DRIVERS = [
  {
    title: "Demand Increase",
    impact: "High Impact",
    weight: 90,
    description: "Forecast demand is above the recent monthly average.",
  },
  {
    title: "Inventory Coverage",
    impact: "High Impact",
    weight: 88,
    description: "Current inventory is insufficient to cover projected requirements.",
  },
  {
    title: "Supplier Lead Time",
    impact: "Medium Impact",
    weight: 62,
    description: "Supplier lead time reduces the available response window.",
  },
  {
    title: "Open PO Coverage",
    impact: "High Impact",
    weight: 84,
    description: "Existing purchase orders do not fully cover projected demand.",
  },
];

export const PRIORITY_FACTORS = [
  "Shortage Severity",
  "Required Date",
  "Supplier Lead Time",
  "Material Importance",
  "Supply Condition",
  "Demand Trend",
];

export const AGENTIC_SCOPE_ITEMS = [
  "6-month demand forecast",
  "Inventory",
  "Open POs",
  "Required dates",
  "Lead times",
  "Supply conditions",
];

export const AI_ANALYZES = [
  "Demand forecast",
  "Current inventory",
  "Open purchase orders",
  "Required dates",
  "Supplier lead times",
  "Supply conditions",
];
