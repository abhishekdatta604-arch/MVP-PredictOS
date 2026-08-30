import { Construction } from "lucide-react";
import { AppShell } from "@/components/app-shell";

export function ModulePlaceholder({ name, group }: { name: string; group: string }) {
  return (
    <AppShell title={name} subtitle={group}>
      <div className="mx-auto max-w-2xl rounded-3xl border border-border bg-card p-10 text-center shadow-[0_1px_2px_rgba(16,24,40,0.04),0_12px_32px_-16px_rgba(16,24,40,0.16)]">
        <span className="mx-auto flex size-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <Construction className="size-7" strokeWidth={1.8} />
        </span>
        <h2 className="mt-5 text-lg font-bold text-foreground">{name}</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This module will be implemented in the next prototype phase.
        </p>
      </div>
    </AppShell>
  );
}
