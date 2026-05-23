import type { ReactNode } from "react";

export function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-md border border-luxora-gold/45 bg-luxora-champagne/45 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-luxora-charcoal">
      {children}
    </span>
  );
}
