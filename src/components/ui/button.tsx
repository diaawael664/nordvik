import Link from "next/link";
import type { ComponentProps } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "solid" | "outline" | "ghost" | "link" | "light";
type Size = "sm" | "md" | "lg";

const base =
  "inline-flex items-center justify-center gap-2 rounded-base font-medium tracking-wide whitespace-nowrap transition-[background-color,color,border-color,transform] duration-300 ease-soft disabled:pointer-events-none disabled:opacity-50 active:scale-[0.98]";

const variants: Record<Variant, string> = {
  primary: "bg-accent text-on-accent hover:bg-ink hover:text-bg",
  solid: "bg-ink text-bg hover:bg-accent hover:text-on-accent",
  outline: "border border-ink/80 text-ink hover:bg-ink hover:text-bg",
  ghost: "text-ink hover:bg-sand",
  /** For photos and dark bands. */
  light: "bg-on-inverse text-inverse hover:bg-accent hover:text-on-accent",
  link: "px-0! text-ink underline decoration-line decoration-1 underline-offset-[6px] hover:decoration-ink",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-6 text-sm",
  lg: "h-13 px-8 text-sm",
};

type StyleProps = { variant?: Variant; size?: Size; className?: string };

export const buttonClasses = ({ variant = "primary", size = "md", className }: StyleProps = {}) =>
  cn(base, variants[variant], sizes[size], className);

export function Button({ variant, size, className, type = "button", ...props }: ComponentProps<"button"> & StyleProps) {
  return <button type={type} className={buttonClasses({ variant, size, className })} {...props} />;
}

export function ButtonLink({ variant, size, className, ...props }: ComponentProps<typeof Link> & StyleProps) {
  return <Link className={buttonClasses({ variant, size, className })} {...props} />;
}
