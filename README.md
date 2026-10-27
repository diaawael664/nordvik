# Nordvik — Furniture & Home Decor Store Template

A premium Next.js template for furniture, lighting and home decor stores.
Scandinavian-minimal design, three home layouts, a complete shop, and a
backend-ready catalog. Static export: deploy anywhere, no server needed.

**Full documentation:** open [`documentation/index.html`](documentation/index.html) in your browser.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3000
npm run build        # static site in /out
```

Requirements: Node.js 20.9 or newer.

## What's inside

- **3 home layouts**: Classic (hero slider), Editorial (magazine grid + shop-the-room), Modern (split hero + video band)
- **Shop**: category pages, filters (category, price slider, color, material, availability), sorting, grid/list, load more, quick view
- **Product page**: zoom gallery + lightbox, variants with price changes, dimensions drawn on the photo (cm/in), tabs, reviews, delivery-date estimate, back-in-stock alerts, free fabric swatches, "complete the look" sets, recently viewed, sticky mobile add-to-cart
- **Cart & checkout**: mini cart, free-delivery meter, promo codes, set discounts, full checkout UI with card validation
- **Account**: sign in / register, order history with delivery tracking, saved addresses
- **Content**: lookbook with clickable hotspots, About, Journal (MDX) with categories, Contact with maps, FAQ, 404, Coming Soon
- **Policies**: Privacy, Terms of sale, Cookies (with a "change settings" button) and Shipping & returns templates
- **Rebrand in one file**: 3 color presets (light + dark), fonts, layout options in `theme.config.ts`
- **Backend-ready**: one catalog module, Shopify sync script, Shopify checkout handoff
- **SEO**: metadata, Open Graph, sitemap, robots, Product/Article/FAQ/Breadcrumb structured data
- **Accessible**: WCAG AA contrast in every preset, keyboard navigation, focus management, reduced motion
- **Analytics hooks**: GA4-format e-commerce events, cookie consent built in
- **Tested**: Playwright end-to-end suite (`npm run test:e2e`)

## Scripts

| Command                           | What it does                                  |
| --------------------------------- | --------------------------------------------- |
| `npm run dev`                     | Development server with hot reload            |
| `npm run build`                   | Production static export to `/out`            |
| `npm start`                       | Serve `/out` locally                          |
| `npm run lint` / `npm run format` | ESLint / Prettier                             |
| `npm run typecheck`               | TypeScript check                              |
| `npm run test:e2e`                | End-to-end tests against `/out` (build first) |
| `npm run placeholders`            | Generate neutral placeholder images           |
| `npm run catalog:shopify`         | Sync products from a Shopify store            |

## Where to edit

| To change…                                          | Edit                                     |
| --------------------------------------------------- | ---------------------------------------- |
| Colors, fonts, corners, layout options              | `theme.config.ts`                        |
| Store name, contact, shipping, promo codes, pop-ups | `data/site.ts`                           |
| Products / categories                               | `data/products.ts`, `data/categories.ts` |
| Menus                                               | `data/navigation.ts`                     |
| Photos                                              | `data/images.ts`                         |
| Home page content                                   | `data/home.ts`, `data/testimonials.ts`   |
| Blog posts                                          | `content/blog/*.mdx` + `data/blog.ts`    |

Before going live, set `site.url` and turn off `site.demo.styleSwitcher` in `data/site.ts`.

## Credits & license

Demo photos (Unsplash) and video (Mixkit) are for the live demo only and are not
included in the download; see [CREDITS.md](CREDITS.md). Use of this template is
governed by the license of the marketplace you purchased it from.
