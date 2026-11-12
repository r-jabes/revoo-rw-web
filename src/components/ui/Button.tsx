import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { ArrowRight } from "./Icons";

type Variant = "primary" | "ink" | "paper" | "outline" | "ghost";

const variants: Record<Variant, string> = {
  // Green with ink text: 6.0:1 contrast
  primary: "bg-green text-ink hover:bg-white",
  ink: "bg-ink text-paper hover:bg-green hover:text-ink",
  paper: "bg-paper text-ink hover:bg-green",
  outline: "border border-current text-[color:var(--fg)] hover:bg-[color:var(--fg)] hover:text-[color:var(--bg)]",
  ghost: "text-[color:var(--fg)] px-0 hover:text-[color:var(--accent-text)]",
};

interface Common {
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  children: ReactNode;
}

const classes = (variant: Variant, className = "") =>
  [
    "group relative inline-flex items-center justify-between gap-6 min-h-12 px-5",
    "t-label !text-[0.75rem] tracking-[0.14em]",
    "transition-colors duration-[var(--dur-micro)] ease-[var(--ease-out-quart)]",
    "select-none whitespace-nowrap",
    "disabled:pointer-events-none disabled:bg-[color:var(--line)] disabled:text-[color:var(--muted)]",
    variants[variant],
    className,
  ].join(" ");

const Arrow = () => (
  <span className="relative block h-5 w-5 overflow-hidden" aria-hidden>
    <ArrowRight className="absolute inset-0 transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-expo)] group-hover:translate-x-6 group-focus-visible:translate-x-6" />
    <ArrowRight className="absolute inset-0 -translate-x-6 transition-transform duration-[var(--dur-ui)] ease-[var(--ease-out-expo)] group-hover:translate-x-0 group-focus-visible:translate-x-0" />
  </span>
);

export function ButtonLink({
  href,
  variant = "primary",
  arrow = true,
  className,
  children,
  ...rest
}: Common & Omit<ComponentProps<typeof Link>, "className" | "children">) {
  return (
    <Link href={href} className={classes(variant, className)} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </Link>
  );
}

export function Button({
  variant = "primary",
  arrow = true,
  className,
  children,
  ...rest
}: Common & Omit<ComponentProps<"button">, "className" | "children">) {
  return (
    <button className={classes(variant, className)} {...rest}>
      <span>{children}</span>
      {arrow && <Arrow />}
    </button>
  );
}
