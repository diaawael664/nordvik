import type { Metadata, Viewport } from "next";
import { site } from "@data/site";
import { colors, fontBody, fontDisplay, fontMono } from "@theme";
import { Providers } from "@/components/providers";
import { presetBootScript } from "@/lib/preset-boot";
import { themeCss } from "@/lib/theme-css";
import { imageMode } from "@/lib/utils";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} — ${site.tagline}`, template: `%s — ${site.name}` },
  description: site.description,
  applicationName: site.name,
  openGraph: {
    type: "website",
    siteName: site.name,
    locale: site.locale.replace("-", "_"),
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    // Default share image; product and blog pages set their own.
    images: [{ url: "/og.png", width: 1200, height: 630, alt: `${site.name} — ${site.tagline}` }],
  },
  twitter: { card: "summary_large_image" },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/favicon-48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: colors.light.bg },
    { media: "(prefers-color-scheme: dark)", color: colors.dark.bg },
  ],
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="en"
      // next-themes sets the `dark` class before paint; this silences the expected attribute diff.
      suppressHydrationWarning
      className={`${fontDisplay.variable} ${fontBody.variable} ${fontMono.variable}`}
    >
      <head>
        {/* Design tokens from theme.config.ts */}
        <style dangerouslySetInnerHTML={{ __html: themeCss() }} />
        {imageMode() === "unsplash" && <link rel="preconnect" href="https://images.unsplash.com" />}
        {site.demo.styleSwitcher && (
          // Demo only: apply a previewed color preset before first paint.
          <script dangerouslySetInnerHTML={{ __html: presetBootScript }} />
        )}
      </head>
      <body className="flex min-h-dvh flex-col">
        <a
          href="#main"
          className="sr-only z-[70] bg-ink px-4 py-3 text-bg focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        {/* Page chrome (header, footer) lives in the (site) and (focus) route-group layouts. */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
