"use client";

import { Moon, Sun } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useTheme } from "next-themes";
import { site } from "@data/site";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

/**
 * Store wordmark. Set `site.logo` to an image in /public to use a logo file;
 * otherwise the store name is set in the display face.
 */
export function Logo({ className }: { className?: string }) {
  return (
    <Link href="/" className={cn("inline-flex items-center", className)} aria-label={`${site.name} — home`}>
      {site.logo ? (
        <Image src={site.logo} alt={site.name} width={140} height={32} className="h-7 w-auto" />
      ) : (
        <span className="font-display text-[1.65rem] leading-none tracking-[-0.03em]">
          {site.name.toLowerCase()}
          <span className="text-accent">.</span>
        </span>
      )}
    </Link>
  );
}

/** Light/dark switch. Renders a neutral placeholder until the theme is known. */
export function ThemeToggle({ className }: { className?: string }) {
  const { resolvedTheme, setTheme } = useTheme();
  const hydrated = useHydrated();
  const dark = hydrated && resolvedTheme === "dark";

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? "light" : "dark")}
      aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
      className={cn("grid size-10 place-items-center rounded-full transition-colors hover:bg-sand", className)}
    >
      {hydrated ? (
        dark ? (
          <Sun className="size-[18px]" strokeWidth={1.5} />
        ) : (
          <Moon className="size-[18px]" strokeWidth={1.5} />
        )
      ) : (
        <span className="size-[18px]" />
      )}
    </button>
  );
}
