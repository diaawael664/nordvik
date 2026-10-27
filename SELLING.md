# Selling Nordhaus — seller notes

This file and the three commands below are for you, the seller. `npm run package`
leaves all of them out of the buyer download.

## 1. Deploy the live demo

The live demo serves its photos from its own domain (faster on mobile than
loading them from Unsplash).

**Vercel**

1. Import the repository at vercel.com/new.
2. Build command: `npm run demo:images && npm run build`
3. Environment variable: `NEXT_PUBLIC_IMAGE_MODE` = `mirror`
4. In `data/site.ts`, set `url` to the demo address and `demo.purchaseUrl` to your
   listing, then redeploy.

**Netlify:** same build command and variable; publish directory `out`.

`npm run demo:images` downloads every demo photo in five sizes into
`public/demo-images/` (about 44 MB). That folder is git-ignored and never shipped.

## 2. Check performance on the deployed demo

Run [PageSpeed Insights](https://pagespeed.web.dev/) on the live URL for `/`,
`/shop/` and a product page. It runs on Google's consistent hardware; local
Lighthouse runs on a laptop varied by up to 30 points between runs during
development. Measured locally: desktop Performance 98–100; Accessibility, Best
Practices and SEO 100 on every page; mobile Performance roughly 80–90.

## 3. Make the listing images

```bash
npm run build
PW_CHANNEL=chrome npm run marketplace     # or: npx playwright install chromium, then npm run marketplace
npm run build                            # again, so /demos/ shows the new previews
```

Writes to `dist/marketplace/`:

| File                  | Use                                                      |
| --------------------- | -------------------------------------------------------- |
| `thumbnail-80x80.png` | ThemeForest thumbnail                                    |
| `preview-590x300.jpg` | ThemeForest inline preview                               |
| `cover-1280x720.jpg`  | Gumroad / TemplateMonster cover                          |
| `screenshots/*.jpg`   | Full-page desktop and mobile screenshots for the gallery |

It also writes `public/previews/*.jpg`, the page previews on `/demos/`. Link your
listing's "Live preview" to `https://your-demo/demos/`.

Check each marketplace's current image-size rules before uploading; adjust the
sizes in `scripts/marketplace.mjs` if they've changed.

## 4. Build the download package

```bash
npm run package
```

Creates `dist/nordhaus-v<version>.zip` (about 0.4 MB) from a clean copy:

- no `node_modules`, build output, local settings or test results
- no demo photos, video, page previews, `/demos/` page or these seller tools
- images switched to labelled placeholders (generated in the copy)

It checks the copy before zipping and stops if anything that shouldn't ship is
found. Your working project is never changed. Verified: the zip unpacks with
Windows' built-in extractor, installs with `npm ci`, builds 68 pages, and passes
lint, type check and the full test suite.

Bump `version` in `package.json` and add a `CHANGELOG.md` entry before each release.
