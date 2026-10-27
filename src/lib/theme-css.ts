import { site } from "@data/site";
import { activePreset, presets, shape, type ColorTokens } from "@theme";

/** camelCase token name → `--kebab-case` CSS custom property. */
const toVar = (key: string) => `--${key.replace(/[A-Z]/g, (m) => `-${m.toLowerCase()}`)}`;

const block = (tokens: ColorTokens) =>
  Object.entries(tokens)
    .map(([key, value]) => `${toVar(key)}:${value};`)
    .join("");

/**
 * Serializes `theme.config.ts` into the CSS that the root layout inlines.
 * The active preset is the default; `.dark` (set by next-themes) switches to
 * its dark palette. With the demo style switcher on, every preset is also
 * emitted under `[data-preset="…"]` so visitors can preview them.
 */
export function themeCss() {
  const base = presets[activePreset];
  const parts = [
    `:root{${block(base.light)}--radius:${base.radius};--container-max:${shape.containerMax};color-scheme:light;}`,
    `.dark{${block(base.dark)}color-scheme:dark;}`,
  ];
  if (site.demo.styleSwitcher) {
    for (const [name, p] of Object.entries(presets)) {
      const scope = `:root[data-preset="${name}"]`;
      parts.push(`${scope}{${block(p.light)}--radius:${p.radius};}`, `${scope}.dark{${block(p.dark)}}`);
    }
  }
  return parts.join("");
}
