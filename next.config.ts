import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static HTML export: `npm run build` writes a deployable site to /out.
  output: "export",
  // `/shop/` → `/shop/index.html`, which every static host resolves.
  trailingSlash: true,
  images: {
    // next/image's default optimizer needs a server. This loader requests
    // sized, compressed variants from the Unsplash CDN instead, and passes
    // local files (placeholders, your own photos) through unchanged.
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    // Allowed `quality` values (required by Next.js 16). 60 is the default in the loader.
    qualities: [50, 60, 75],
  },
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

// Blog posts are .mdx files in /content/blog, imported by src/app/blog/[slug].
const withMDX = createMDX({
  // Plugin names as strings so Turbopack can load them. remark-gfm adds tables.
  options: { remarkPlugins: ["remark-gfm"] },
});

export default withMDX(nextConfig);
