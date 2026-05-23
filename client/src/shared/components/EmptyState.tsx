import type { ReactNode } from "react";

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="rounded-md border border-dashed border-luxora-gold/40 bg-white/85 p-8 text-center shadow-sm backdrop-blur">
      <h2 className="text-lg font-semibold text-luxora-ink">{title}</h2>
      {children ? <div className="mt-2 text-sm text-luxora-ink/60">{children}</div> : null}
    </div>
  );
}
