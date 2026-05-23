import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "../lib/cn";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "ghost" | "danger";
  children: ReactNode;
};

const variants = {
  primary:
    "bg-luxora-ink text-white shadow-sm hover:bg-luxora-charcoal hover:shadow-glow",
  secondary:
    "border border-luxora-gold/35 bg-white/90 text-luxora-ink shadow-sm hover:border-luxora-gold hover:bg-luxora-champagne/30",
  ghost: "text-luxora-ink hover:bg-luxora-champagne/35",
  danger: "bg-luxora-wine text-white shadow-sm hover:bg-luxora-wine/90",
};

export function Button({ className, variant = "primary", children, ...props }: ButtonProps) {
  return (
    <button
      className={cn(
        "inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition duration-200 disabled:cursor-not-allowed disabled:opacity-50",
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
