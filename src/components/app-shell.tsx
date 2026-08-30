import { useState, type ReactNode } from "react";
import { Bell, Search, Menu, ChevronDown, Factory } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AppSidebar } from "@/components/app-sidebar";

export function AppShell({
  title,
  subtitle,
  children,
}: {
  title: string;
  subtitle: string;
  children: ReactNode;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[280px] border-r border-sidebar-border lg:block">
        <AppSidebar />
      </aside>

      <div className="lg:pl-[280px]">
        <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
          <div className="flex flex-wrap items-center gap-4 px-5 py-4 lg:px-8">
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger className="rounded-lg border border-border p-2 lg:hidden" aria-label="Open navigation">
                <Menu className="size-5" />
              </SheetTrigger>
              <SheetContent side="left" className="w-[280px] p-0">
                <AppSidebar onNavigate={() => setOpen(false)} />
              </SheetContent>
            </Sheet>

            <div className="min-w-0 flex-1">
              <h1 className="truncate text-xl font-bold tracking-tight text-foreground">{title}</h1>
              <p className="truncate text-sm text-muted-foreground">{subtitle}</p>
            </div>

            <div className="order-last flex w-full items-center gap-3 md:order-none md:w-auto">
              <div className="relative flex-1 md:w-72 md:flex-none">
                <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  placeholder="Search materials, orders..."
                  className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm outline-none transition focus:border-primary/50 focus:ring-2 focus:ring-primary/15"
                />
              </div>

              <button className="flex h-10 items-center gap-2 rounded-full border border-border bg-card px-3 text-sm font-medium text-foreground transition hover:border-primary/40">
                <Factory className="size-4 text-primary" />
                <span className="hidden sm:inline">Factory A — Dhaka</span>
                <ChevronDown className="size-4 text-muted-foreground" />
              </button>

              <button
                className="relative flex size-10 items-center justify-center rounded-full border border-border bg-card text-foreground transition hover:border-primary/40"
                aria-label="Notifications"
              >
                <Bell className="size-[18px]" />
                <span className="absolute right-2.5 top-2.5 size-2 rounded-full bg-primary ring-2 ring-card" />
              </button>

              <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-semibold text-secondary-foreground">
                AD
              </span>
            </div>
          </div>
        </header>

        <main className="px-5 py-6 lg:px-8 lg:py-8">{children}</main>
      </div>
    </div>
  );
}
