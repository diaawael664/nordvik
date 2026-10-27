# Changelog

All notable changes to the Nordhaus template. Dates are YYYY-MM-DD.

## 1.0.0 — 2026-10-27

First release.

### Pages

- Three home layouts: Classic, Editorial, Modern.
- Shop with one static page per category (`/shop/<category>/`), filters, sorting, grid/list views and load more.
- Product pages with zoom gallery, variants, dimensions (cm/in), tabs, reviews, related products and sticky mobile add-to-cart.
- Cart, checkout, wishlist, lookbook (shop-the-room hotspots), About, Journal (MDX, categories, sidebar), Contact, FAQ, account (sign in, orders with tracking, addresses), 404 and Coming Soon.
- Policy page templates: Privacy, Terms of sale, Cookies and Shipping & returns.
- Demo catalog: 49 products across 7 categories and 6 "complete the look" sets, all in `/data`.

### Commerce features

- Promo codes, free-delivery meter, "complete the look" set discounts.
- Delivery-date estimate by ZIP code, back-in-stock alerts, free fabric swatch requests, recently viewed.
- Catalog layer (`src/lib/catalog.ts`) with Shopify Storefront sync (`npm run catalog:shopify`) and Shopify checkout handoff.

### Design & customization

- One-file theming (`theme.config.ts`): three WCAG-AA color presets (Oak & Pine, Clay & Linen, Nordic Stone) with dark mode, fonts and layout options (overlay/solid header, filter position, gallery style).
- Demo style switcher for previewing presets and layouts.
- Signature dimension-line detail on product imagery.

### Platform

- Next.js 16 App Router, TypeScript, Tailwind CSS 4, static export.
- SEO: metadata, Open Graph, sitemap, robots, structured data (Product, BreadcrumbList, BlogPosting, FAQPage).
- GA4-format analytics events with cookie consent; optional newsletter pop-up.
- Playwright end-to-end tests; ESLint and Prettier configured.
- Post-build step that fixes Next.js 16 prefetch files on static hosts (`scripts/flatten-prefetch.mjs`).
