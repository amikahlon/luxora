import type { InputHTMLAttributes } from "react";
import { cn } from "../lib/cn";

export function Input({ className, ...props }: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "h-11 w-full rounded-md border border-luxora-ink/15 bg-white/95 px-3 text-sm outline-none transition placeholder:text-luxora-ink/35 focus:border-luxora-gold focus:ring-2 focus:ring-luxora-gold/20",
        className,
      )}
      {...props}
    />
  );
}
