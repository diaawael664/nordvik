/**
 * ─────────────────────────────────────────────────────────────────────────────
 *  THEME CONFIG — the one file you edit to rebrand the template.
 * ─────────────────────────────────────────────────────────────────────────────
 *
 *  1. Fonts    — swap any Google Font import below (keep the `variable` names).
 *  2. Colors   — three ready-made presets; pick one with `activePreset`, or
 *                edit a preset's values. `light` and `dark` must share keys.
 *  3. Shape    — max content width (corner radius is set per preset).
 *  4. Layout   — header style, shop filter position, product gallery style.
 *
 *  Colors are injected as CSS custom properties by `src/app/layout.tsx`, and
 *  Tailwind utilities (`bg-bg`, `text-ink`, `border-line`, `bg-accent`, …) read
 *  those properties, so a change here updates every component.
 *
 *  Every preset passes WCAG AA (4.5:1) for the text/background pairs the UI
 *  uses. Re-check with a contrast tool if you change values.
 */
import { Fraunces, IBM_Plex_Mono, Manrope } from "next/font/google";

/* ── 1. Fonts ─────────────────────────────────────────────────────────────── */

/** Display face: headings, prices, large editorial type. */
export const fontDisplay = Fraunces({
  subsets: ["latin"],
  variable: "--font-display-face",
  // Optical sizing keeps large headings crisp. Add "SOFT" here for rounder
  // letterforms (about 40 KB more to download).
  axes: ["opsz"],
  display: "swap",
});

/** Body face: paragraphs, UI controls, navigation. */
export const fontBody = Manrope({
  subsets: ["latin"],
  variable: "--font-body-face",
  display: "swap",
});

/** Utility face: dimensions, SKUs, spec labels, small caps eyebrows. */
export const fontMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono-face",
  display: "swap",
});

/* ── 2. Colors ────────────────────────────────────────────────────────────── */

export type ColorTokens = {
  /** Page background. */
  bg: string;
  /** Cards, inputs, raised panels. */
  surface: string;
  /** Tinted blocks: category tiles, image backdrops, promo bands. */
  sand: string;
  /** Primary text. */
  ink: string;
  /** Secondary text, captions, metadata. */
  muted: string;
  /** Hairlines and borders. */
  line: string;
  /** The single brand accent: primary buttons, links, focus rings. */
  accent: string;
  /** Text placed on top of `accent`. */
  onAccent: string;
  /** Secondary warm tone: sale badges, ratings, decorative rules. */
  wood: string;
  /** Inverted band (footer, announcement bar). */
  inverse: string;
  /** Text on `inverse`. */
  onInverse: string;
};

export type Preset = { label: string; radius: string; light: ColorTokens; dark: ColorTokens };

export const presets = {
  /** Warm linen, walnut and a fjord-pine accent. */
  oak: {
    label: "Oak & Pine",
    radius: "2px",
    light: {
      bg: "#F6F2EC",
      surface: "#FBF9F5",
      sand: "#E4D8C6",
      ink: "#24211E",
      muted: "#625A51",
      line: "#DCD2C3",
      accent: "#2F5A4C",
      onAccent: "#F6F2EC",
      wood: "#5B3A29",
      inverse: "#24211E",
      onInverse: "#ECE6DD",
    },
    dark: {
      bg: "#171513",
      surface: "#211E1B",
      sand: "#2F2A25",
      ink: "#ECE6DD",
      muted: "#A39A8F",
      line: "#3A342E",
      accent: "#86B8A4",
      onAccent: "#171513",
      wood: "#D2AE8A",
      inverse: "#0F0E0C",
      onInverse: "#ECE6DD",
    },
  },
  /** Softer corners, plaster neutrals and a fired-clay accent. */
  clay: {
    label: "Clay & Linen",
    radius: "10px",
    light: {
      bg: "#F3ECE3",
      surface: "#FAF6F1",
      sand: "#E7D5C3",
      ink: "#2A211C",
      muted: "#695849",
      line: "#DECBB8",
      accent: "#8C4A32",
      onAccent: "#FAF6F1",
      wood: "#4E3B2C",
      inverse: "#2A211C",
      onInverse: "#EFE6DC",
    },
    dark: {
      bg: "#1A1411",
      surface: "#241C18",
      sand: "#33281F",
      ink: "#F0E6DB",
      muted: "#B3A08F",
      line: "#3D3128",
      accent: "#E0A182",
      onAccent: "#1A1411",
      wood: "#D9B48F",
      inverse: "#100C0A",
      onInverse: "#F0E6DB",
    },
  },
  /** Cool stone grays, square corners and a deep fjord-blue accent. */
  nordic: {
    label: "Nordic Stone",
    radius: "0px",
    light: {
      bg: "#F2F3F1",
      surface: "#FAFBFA",
      sand: "#DFE3DE",
      ink: "#1C2120",
      muted: "#56605C",
      line: "#D3D9D5",
      accent: "#2E4A6B",
      onAccent: "#F2F3F1",
      wood: "#3F4A47",
      inverse: "#1C2120",
      onInverse: "#E6EAE7",
    },
    dark: {
      bg: "#121615",
      surface: "#1A1F1E",
      sand: "#252B29",
      ink: "#E6EAE7",
      muted: "#9AA5A1",
      line: "#2F3734",
      accent: "#9DB8D6",
      onAccent: "#121615",
      wood: "#C3CEC9",
      inverse: "#0B0E0D",
      onInverse: "#E6EAE7",
    },
  },
} satisfies Record<string, Preset>;

export type PresetName = keyof typeof presets;

/** The preset your store uses. */
export const activePreset: PresetName = "oak";

/** Colors of the active preset (used for browser theme-color and the UI kit page). */
export const colors = presets[activePreset];

/* ── 3. Shape ─────────────────────────────────────────────────────────────── */

export const shape = {
  /** Widest a content column grows. */
  containerMax: "1440px",
};

/* ── 4. Layout ────────────────────────────────────────────────────────────── */

export type LayoutSettings = {
  /** "solid" header, or "overlay": transparent over the home hero, solid once you scroll. */
  header: "solid" | "overlay";
  /** Shop filters in a "left" or "right" sidebar, or a "top" panel above the grid. */
  shopFilters: "left" | "right" | "top";
  /** Product gallery: thumbnails at the "side", thumbnails "bottom", or all images "stacked". */
  productGallery: "side" | "bottom" | "stacked";
};

export const layout: LayoutSettings = {
  header: "overlay",
  shopFilters: "left",
  productGallery: "side",
};
