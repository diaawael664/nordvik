"use client";

import { useNow } from "@/lib/use-now";
import { cn } from "@/lib/utils";

type CountdownProps = {
  /** ISO date-time to count down to. */
  endsAt: string;
  /** Restart on this cycle once `endsAt` passes (0 = stop at zero). */
  repeatEveryDays?: number;
  className?: string;
  /** "boxed" for promo sections, "inline" for compact use. */
  variant?: "boxed" | "inline";
};

const DAY = 86_400_000;

/** Milliseconds remaining, rolling forward by the repeat cycle if expired. */
function remaining(now: number, end: number, repeatDays: number) {
  if (now < end || repeatDays <= 0) return Math.max(0, end - now);
  const cycle = repeatDays * DAY;
  return cycle - ((now - end) % cycle);
}

const pad = (n: number) => String(n).padStart(2, "0");

export function Countdown({ endsAt, repeatEveryDays = 0, className, variant = "boxed" }: CountdownProps) {
  const now = useNow();
  const ms = now === 0 ? null : remaining(now, new Date(endsAt).getTime(), repeatEveryDays);

  const parts = [
    { label: "Days", value: ms === null ? null : Math.floor(ms / DAY) },
    { label: "Hours", value: ms === null ? null : Math.floor((ms % DAY) / 3_600_000) },
    { label: "Minutes", value: ms === null ? null : Math.floor((ms % 3_600_000) / 60_000) },
    { label: "Seconds", value: ms === null ? null : Math.floor((ms % 60_000) / 1000) },
  ];

  const text = ms === null ? "" : `${parts[0].value} days, ${parts[1].value} hours and ${parts[2].value} minutes left`;

  return (
    <div className={className}>
      {/* Screen readers get a days-and-hours summary; the ticking digits are hidden from them. */}
      <p className="sr-only">{text.replace(/ and \d+ minutes/, "")}</p>
      <ol className={cn("flex", variant === "boxed" ? "gap-2 sm:gap-3" : "gap-4")} aria-hidden>
        {parts.map((p) => (
          <li
            key={p.label}
            className={cn(
              "flex flex-col items-center",
              variant === "boxed" && "min-w-[4.25rem] border border-current/20 px-2 py-3 sm:min-w-20 sm:py-4",
            )}
          >
            <span
              className={cn(
                "font-display leading-none tabular-nums",
                variant === "boxed" ? "text-3xl sm:text-4xl" : "text-xl",
              )}
            >
              {p.value === null ? "--" : pad(p.value)}
            </span>
            <span className="mt-2 font-mono text-[10px] tracking-[0.14em] uppercase opacity-70">{p.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
