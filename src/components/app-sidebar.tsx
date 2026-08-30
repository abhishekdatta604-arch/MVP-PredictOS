import { Link } from "@tanstack/react-router";
import {
  LayoutGrid,
  LineChart,
  FlaskConical,
  ShieldCheck,
  GitCompareArrows,
  Database,
  Boxes,
  FileDown,
  MessageSquarePlus,
  Settings,
  LifeBuoy,
  Hexagon,
} from "lucide-react";

export type NavItem = { title: string; to: string; icon: React.ElementType };

export const navGroups: { label: string; items: NavItem[] }[] = [
  { label: "Home", items: [{ title: "Dashboard", to: "/", icon: LayoutGrid }] },
  {
    label: "Planning",
    items: [
      { title: "Neural SmartDemand Analytics", to: "/planning/smartdemand", icon: LineChart },
      { title: "What-If Analysis", to: "/planning/what-if", icon: FlaskConical },
    ],
  },
  {
    label: "Procurement",
    items: [
      { title: "Neural Procurement Intelligence", to: "/procurement/intelligence", icon: ShieldCheck },
      { title: "What-If Analysis", to: "/procurement/what-if", icon: GitCompareArrows },
    ],
  },
  {
    label: "Data",
    items: [
      { title: "Data Integration", to: "/data/integration", icon: Database },
      { title: "AI Data & Master Management", to: "/data/master", icon: Boxes },
    ],
  },
  {
    label: "Reporting",
    items: [
      { title: "Forecast Export", to: "/reporting/forecast-export", icon: FileDown },
      { title: "Manual Override & Feedback", to: "/reporting/feedback", icon: MessageSquarePlus },
    ],
  },
];

const bottomItems: NavItem[] = [
  { title: "Settings", to: "/settings", icon: Settings },
  { title: "Help / Support", to: "/help", icon: LifeBuoy },
];

export function AppSidebar({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="flex h-full flex-col bg-sidebar">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex size-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <Hexagon className="size-5" strokeWidth={2.2} />
        </span>
        <span className="leading-tight">
          <span className="block text-[15px] font-bold tracking-tight text-sidebar-foreground">
            Neural <span className="text-primary">PredictOS</span>
          </span>
          <span className="block text-[11px] text-muted-foreground">AI Planning Intelligence</span>
        </span>
      </div>

      <nav className="flex-1 space-y-5 overflow-y-auto px-3 pb-4">
        {navGroups.map((group) => (
          <div key={group.label}>
            <p className="px-3 pb-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              {group.label}
            </p>
            <ul className="space-y-0.5">
              {group.items.map((item) => (
                <li key={item.to}>
                  <Link
                    to={item.to}
                    onClick={onNavigate}
                    activeOptions={{ exact: item.to === "/" }}
                    activeProps={{
                      className: "bg-primary/10 text-primary font-semibold",
                    }}
                    inactiveProps={{
                      className: "text-sidebar-foreground/80 hover:bg-sidebar-accent",
                    }}
                    className="flex items-start gap-3 rounded-xl px-3 py-2.5 text-[13.5px] leading-snug transition-colors"
                  >
                    <item.icon className="mt-0.5 size-[18px] shrink-0" strokeWidth={1.8} />
                    <span className={item.title === "Neural SmartDemand Analytics" || item.title === "Neural Procurement Intelligence" ? "font-bold" : ""}>
                      {item.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </nav>

      <div className="border-t border-sidebar-border px-3 py-3">
        <div className="flex items-center gap-3 rounded-xl px-2 py-2">
          <span className="flex size-9 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
            JD
          </span>
          <span className="leading-tight">
            <span className="block text-[13px] font-semibold text-sidebar-foreground">John Doe</span>
            <span className="block text-[11px] text-muted-foreground">Production Planning Manager</span>
          </span>
        </div>
        <ul className="mt-1 space-y-0.5">
          {bottomItems.map((item) => (
            <li key={item.to}>
              <Link
                to={item.to}
                onClick={onNavigate}
                activeProps={{ className: "bg-primary/10 text-primary font-semibold" }}
                inactiveProps={{ className: "text-sidebar-foreground/80 hover:bg-sidebar-accent" }}
                className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-[13.5px] transition-colors"
              >
                <item.icon className="size-[18px]" strokeWidth={1.8} />
                <span>{item.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
