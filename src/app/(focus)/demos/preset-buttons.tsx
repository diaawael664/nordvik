"use client";

import { useRouter } from "next/navigation";
import { activePreset, presets, type PresetName } from "@theme";
import { setPresetOverride } from "@/lib/layout-settings";

/** Opens the Classic home page in the chosen color preset. */
export function PresetButtons() {
  const router = useRouter();
  return (
    <ul className="grid gap-4 sm:grid-cols-3">
      {(Object.entries(presets) as [PresetName, (typeof presets)[PresetName]][]).map(([name, p]) => (
        <li key={name}>
          <button
            type="button"
            onClick={() => {
              setPresetOverride(name === activePreset ? null : name);
              router.push("/");
            }}
            className="group block w-full border border-line bg-surface p-5 text-left transition-colors hover:border-ink"
          >
            <span className="flex h-24 overflow-hidden" style={{ borderRadius: p.radius }}>
              {[p.light.bg, p.light.sand, p.light.wood, p.light.accent, p.light.ink].map((c) => (
                <span key={c} className="flex-1" style={{ background: c }} />
              ))}
            </span>
            <span className="mt-4 flex items-baseline justify-between gap-3">
              <span className="font-display text-xl">{p.label}</span>
              <span className="text-xs text-muted group-hover:text-ink">Open demo →</span>
            </span>
            <span className="mt-1 block font-mono text-[11px] text-muted">corner radius {p.radius}</span>
          </button>
        </li>
      ))}
    </ul>
  );
}
