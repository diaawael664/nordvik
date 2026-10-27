import { useSyncExternalStore } from "react";
import { site } from "@data/site";
import { layout as configured, type LayoutSettings, type PresetName } from "@theme";
import { createPersistentStore } from "./persistent-store";
import { PRESET_KEY } from "./preset-boot";

/**
 * Layout settings = theme.config.ts `layout`, plus any choices a visitor made
 * in the demo style switcher (only when `site.demo.styleSwitcher` is on).
 * During the static render and hydration this always returns the configured
 * values, so the HTML never mismatches.
 */
const overrides = createPersistentStore<Partial<LayoutSettings>>("nordhaus:demo-layout", {});

export function useLayoutSettings(): LayoutSettings {
  const o = useSyncExternalStore(overrides.subscribe, overrides.getSnapshot, overrides.getServerSnapshot);
  return site.demo.styleSwitcher ? { ...configured, ...o } : configured;
}

export const setLayoutOverride = (patch: Partial<LayoutSettings>) => overrides.set((prev) => ({ ...prev, ...patch }));
export const resetLayoutOverrides = () => overrides.set({});

/* ── Demo color preset (applied as <html data-preset="…">) ──────────────── */

const preset = createPersistentStore<PresetName | null>(PRESET_KEY, null);

export const usePresetOverride = () =>
  useSyncExternalStore(preset.subscribe, preset.getSnapshot, preset.getServerSnapshot);

export function setPresetOverride(name: PresetName | null) {
  preset.set(name);
  if (name) document.documentElement.dataset.preset = name;
  else delete document.documentElement.dataset.preset;
}
