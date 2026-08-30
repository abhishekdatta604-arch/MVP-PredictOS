export type ForecastMode = "manual" | "agentic";

export type ManualScope = {
  horizon: string;
  category: string;
  material: string;
  style: string;
  buyer: string;
};

export const HORIZONS = [
  "1 Month",
  "2 Months",
  "3 Months",
  "4 Months",
  "5 Months",
  "6 Months",
];

export const CATEGORIES = [
  "All Materials",
  "Fabric",
  "Thread",
  "Buttons",
  "Zippers",
  "Labels",
  "Packaging",
  "Other Accessories",
];

export const MATERIALS = [
  "Cotton Fabric 180 GSM",
  "Cotton Fabric 220 GSM",
  "Polyester Thread 40/2",
  'Black Resin Buttons 18L',
  'Metal Zipper 5"',
  "Care Label",
  "Poly Bag 12×16",
];

export const STYLES = [
  "All Styles",
  "POLO-2401",
  "TEE-2407",
  "SHIRT-2412",
  "SHIRT-2421",
  "JACKET-2503",
];

export const BUYERS = [
  "All Buyers",
  "H&M",
  "ZARA",
  "NEXT",
  "Marks & Spencer",
  "Primark",
];

export const DEFAULT_SCOPE: ManualScope = {
  horizon: "6 Months",
  category: "Fabric",
  material: "Cotton Fabric 180 GSM",
  style: "All Styles",
  buyer: "All Buyers",
};

export const DEFAULT_PROMPT =
  "Forecast the demand for Cotton Fabric 180 GSM for the next 6 months. Analyze historical consumption, planned production, confirmed orders, seasonality and recent demand trends. Show me the expected monthly demand and highlight the key factors driving the forecast.";

export const SERIES = [
  { month: "Jan", historical: 68000, forecast: null as number | null },
  { month: "Feb", historical: 70000, forecast: null },
  { month: "Mar", historical: 73000, forecast: null },
  { month: "Apr", historical: 69000, forecast: null },
  { month: "May", historical: 74000, forecast: null },
  { month: "Jun", historical: 77000, forecast: 77000 },
  { month: "Jul", historical: null, forecast: 79000 },
  { month: "Aug", historical: null, forecast: 82000 },
  { month: "Sep", historical: null, forecast: 84000 },
  { month: "Oct", historical: null, forecast: 91000 },
  { month: "Nov", historical: null, forecast: 86000 },
  { month: "Dec", historical: null, forecast: 83000 },
];

export type ForecastRow = {
  month: string;
  qty: number;
  change: string;
  confidence: number;
  status: "Normal" | "Watch" | "High Demand";
};

export const FORECAST_ROWS: ForecastRow[] = [
  { month: "July 2026", qty: 79000, change: "+3%", confidence: 89, status: "Normal" },
  { month: "August 2026", qty: 82000, change: "+4%", confidence: 87, status: "Normal" },
  { month: "September 2026", qty: 84000, change: "+2%", confidence: 86, status: "Watch" },
  { month: "October 2026", qty: 91000, change: "+8%", confidence: 84, status: "High Demand" },
  { month: "November 2026", qty: 86000, change: "-5%", confidence: 85, status: "Normal" },
  { month: "December 2026", qty: 83000, change: "-3%", confidence: 88, status: "Normal" },
];

export const DRIVERS = [
  {
    title: "Production Volume",
    impact: "High" as const,
    weight: 92,
    description: "Planned production volume is increasing over the next quarter.",
  },
  {
    title: "Historical Consumption Trend",
    impact: "High" as const,
    weight: 85,
    description:
      "Material consumption has shown a sustained upward trend over recent months.",
  },
  {
    title: "Seasonal Demand Pattern",
    impact: "Medium" as const,
    weight: 62,
    description:
      "Historical seasonal patterns indicate stronger fabric usage during this period.",
  },
  {
    title: "Confirmed Orders",
    impact: "Medium" as const,
    weight: 55,
    description:
      "Confirmed upcoming orders contribute to the projected increase in demand.",
  },
];

export const ANALYSIS_STEPS = [
  "Loading historical demand",
  "Analyzing production plans",
  "Reviewing confirmed orders",
  "Detecting demand patterns",
  "Evaluating seasonality",
  "Generating AI forecast",
];

export const fmt = (n: number) => n.toLocaleString("en-US");
