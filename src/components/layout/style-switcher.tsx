"use client";

import { Monitor, Moon, Paintbrush, RotateCcw, Sun } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useState, type ReactNode } from "react";
import { site } from "@data/site";
import { activePreset, presets, type LayoutSettings, type PresetName } from "@theme";
import { Drawer } from "@/components/ui/drawer";
import {
  resetLayoutOverrides,
  setLayoutOverride,
  setPresetOverride,
  useLayoutSettings,
  usePresetOverride,
} from "@/lib/layout-settings";
import { useHydrated } from "@/lib/use-hydrated";
import { cn } from "@/lib/utils";

/**
 * Demo-only "Customize" panel for trying presets, color mode and layouts.
 * Choices are stored in the visitor's browser. Remove it for your live store
 * with `site.demo.styleSwitcher = false` in data/site.ts.
 */
export function StyleSwitcher() {
  const [open, setOpen] = useState(false);
  const hydrated = useHydrated();
  const layout = useLayoutSettings();
  const presetOverride = usePresetOverride();
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  if (!site.demo.styleSwitcher || pathname.startsWith("/checkout") || pathname.startsWith("/demos")) return null;

  const current: PresetName = (hydrated && presetOverride) || activePreset;

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed top-1/2 right-0 z-40 flex -translate-y-1/2 items-center gap-2 rounded-l-base bg-ink px-2.5 py-3 text-xs font-medium tracking-wide text-bg shadow-lg [writing-mode:vertical-rl] hover:bg-accent hover:text-on-accent"
        aria-label="Customize this demo"
      >
        <Paintbrush className="size-4 rotate-90" strokeWidth={1.5} />
        Customize
      </button>

      <Drawer open={open} onClose={() => setOpen(false)} title="Customize the demo">
        <div className="space-y-9 px-5 py-6 sm:px-6">
          <p className="text-sm text-muted">
            Preview the options built into this template. Each one is a single setting in{" "}
            <code className="font-mono text-xs text-ink">theme.config.ts</code>.
          </p>

          <Group title="Color preset">
            <div className="grid grid-cols-3 gap-2">
              {(Object.entries(presets) as [PresetName, (typeof presets)[PresetName]][]).map(([name, p]) => (
                <button
                  key={name}
                  type="button"
                  aria-pressed={current === name}
                  onClick={() => setPresetOverride(name === activePreset ? null : name)}
                  className={cn(
                    "border p-2 text-left text-xs transition-colors",
                    current === name ? "border-ink" : "border-line hover:border-ink",
                  )}
                >
                  <span className="flex h-10 overflow-hidden" style={{ borderRadius: p.radius }}>
                    {[p.light.bg, p.light.sand, p.light.accent, p.light.ink].map((c) => (
                      <span key={c} className="flex-1" style={{ background: c }} />
                    ))}
                  </span>
                  <span className="mt-2 block">{p.label}</span>
                </button>
              ))}
            </div>
          </Group>

          <Group title="Color mode">
            <Segmented
              value={hydrated ? (theme ?? "system") : "system"}
              onChange={setTheme}
              options={[
                { value: "light", label: "Light", icon: <Sun className="size-3.5" /> },
                { value: "dark", label: "Dark", icon: <Moon className="size-3.5" /> },
                { value: "system", label: "System", icon: <Monitor className="size-3.5" /> },
              ]}
            />
          </Group>

          <Group title="Home layout">
            <div className="grid grid-cols-3 gap-2 text-xs">
              {[
                ["/", "Classic"],
                ["/home-editorial/", "Editorial"],
                ["/home-modern/", "Modern"],
              ].map(([href, label]) => (
                <Link
                  key={href}
                  href={href}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === href ? "page" : undefined}
                  className={cn(
                    "border px-2 py-3 text-center transition-colors",
                    pathname === href ? "border-ink bg-ink text-bg" : "border-line hover:border-ink",
                  )}
                >
                  {label}
                </Link>
              ))}
            </div>
          </Group>

          <Group title="Header" hint="Overlay shows on the Classic home hero.">
            <Segmented
              value={layout.header}
              onChange={(v) => setLayoutOverride({ header: v as LayoutSettings["header"] })}
              options={[
                { value: "overlay", label: "Overlay" },
                { value: "solid", label: "Solid" },
              ]}
            />
          </Group>

          <Group
            title="Shop filters"
            link={{ href: "/shop/", label: "Open the shop" }}
            onNavigate={() => setOpen(false)}
          >
            <Segmented
              value={layout.shopFilters}
              onChange={(v) => setLayoutOverride({ shopFilters: v as LayoutSettings["shopFilters"] })}
              options={[
                { value: "left", label: "Left" },
                { value: "right", label: "Right" },
                { value: "top", label: "Top" },
              ]}
            />
          </Group>

          <Group
            title="Product gallery"
            link={{ href: "/product/fjell-three-seat-sofa/", label: "Open a product" }}
            onNavigate={() => setOpen(false)}
          >
            <Segmented
              value={layout.productGallery}
              onChange={(v) => setLayoutOverride({ productGallery: v as LayoutSettings["productGallery"] })}
              options={[
                { value: "side", label: "Side" },
                { value: "bottom", label: "Bottom" },
                { value: "stacked", label: "Stacked" },
              ]}
            />
          </Group>

          <button
            type="button"
            onClick={() => {
              resetLayoutOverrides();
              setPresetOverride(null);
              setTheme("system");
            }}
            className="flex items-center gap-2 text-sm underline underline-offset-4"
          >
            <RotateCcw className="size-3.5" /> Reset to defaults
          </button>
        </div>
      </Drawer>
    </>
  );
}

function Group({
  title,
  hint,
  link,
  onNavigate,
  children,
}: {
  title: string;
  hint?: string;
  link?: { href: string; label: string };
  onNavigate?: () => void;
  children: ReactNode;
}) {
  return (
    <section aria-label={title}>
      <div className="mb-3 flex items-baseline justify-between gap-3">
        <h3 className="eyebrow text-ink">{title}</h3>
        {link && (
          <Link href={link.href} onClick={onNavigate} className="text-xs underline underline-offset-4">
            {link.label}
          </Link>
        )}
      </div>
      {children}
      {hint && <p className="mt-2 text-xs text-muted">{hint}</p>}
    </section>
  );
}

function Segmented({
  value,
  onChange,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string; icon?: ReactNode }[];
}) {
  return (
    <div className="flex border border-line" role="group">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          aria-pressed={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex h-10 flex-1 items-center justify-center gap-1.5 text-xs transition-colors",
            value === o.value ? "bg-ink text-bg" : "hover:bg-sand",
          )}
        >
          {o.icon}
          {o.label}
        </button>
      ))}
    </div>
  );
}
