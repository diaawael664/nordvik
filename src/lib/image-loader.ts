type LoaderArgs = { src: string; width: number; quality?: number };

/** Widths saved by `npm run demo:images` (keep in sync with scripts/mirror-images.mjs). */
const MIRROR_WIDTHS = [384, 640, 828, 1200, 1920];

/**
 * Custom next/image loader (see next.config.ts).
 * Unsplash URLs get resized, compressed and format-negotiated by the Unsplash CDN;
 * anything else (local placeholders, your own /public images) is served as-is.
 */
export default function imageLoader({ src, width, quality }: LoaderArgs) {
  if (src.startsWith("https://images.unsplash.com/")) {
    const url = new URL(src);
    url.searchParams.set("w", String(width));
    // 60 is visually close to 70 with AVIF/WebP and about 25% lighter.
    url.searchParams.set("q", String(quality ?? 60));
    url.searchParams.set("auto", "format");
    url.searchParams.set("fit", "crop");
    return url.toString();
  }
  if (src.startsWith("/demo-images/")) {
    const w = MIRROR_WIDTHS.find((m) => m >= width) ?? MIRROR_WIDTHS[MIRROR_WIDTHS.length - 1];
    return src.replace(/\.webp$/, `-${w}.webp`);
  }
  if (src.startsWith("https://cdn.shopify.com/")) {
    const url = new URL(src);
    url.searchParams.set("width", String(width));
    return url.toString();
  }
  return src;
}
