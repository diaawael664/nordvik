import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { site, type ImageMode } from "@data/site";
import { images, type ImageAsset, type ImageKey, type ImageRef } from "@data/images";

/** Joins class names, skipping falsy values; later Tailwind classes override earlier conflicting ones. */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));

const currency = new Intl.NumberFormat(site.locale, {
  style: "currency",
  currency: site.currency,
  maximumFractionDigits: 0,
});

/** Formats a number in the store currency: 1890 → "$1,890". */
export const formatPrice = (value: number) => currency.format(value);

/** Active image mode: NEXT_PUBLIC_IMAGE_MODE (set at build time) wins over `site.imageMode`. */
export const imageMode = (): ImageMode => {
  const env = process.env.NEXT_PUBLIC_IMAGE_MODE;
  return env === "unsplash" || env === "mirror" || env === "placeholder" ? env : site.imageMode;
};

/** Resolves an image key (or URL) to its src/alt, honoring the image mode. */
export function getImage(ref: ImageRef): ImageAsset {
  if (!(ref in images)) return { src: ref, alt: "" }; // external URL, e.g. a synced Shopify image
  const key = ref as ImageKey;
  const asset = images[key];
  const mode = imageMode();
  if (mode === "placeholder") return { src: `/placeholders/${key}.svg`, alt: asset.alt };
  // The image loader appends the width: /demo-images/<key>-<width>.webp
  if (mode === "mirror" && asset.src.startsWith("https://images.unsplash.com/")) {
    return { src: `/demo-images/${key}.webp`, alt: asset.alt };
  }
  return asset;
}

/** Percentage saved between two prices, rounded: (150, 120) → 20. */
export const percentOff = (compareAt: number, price: number) => Math.round(((compareAt - price) / compareAt) * 100);
