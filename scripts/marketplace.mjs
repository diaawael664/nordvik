/**
 * Generate marketplace listing images and the /demos/ page previews.
 *
 *   npm run build && npm run marketplace
 *
 * Needs a browser: run `npx playwright install chromium` once, or use an
 * installed Chrome with PW_CHANNEL=chrome.
 *
 * Writes:
 *   public/previews/*.jpg                    page previews shown on /demos/ (rebuild afterwards)
 *   dist/marketplace/thumbnail-80x80.png     ThemeForest thumbnail
 *   dist/marketplace/preview-590x300.jpg     ThemeForest inline preview
 *   dist/marketplace/cover-1280x720.jpg      Gumroad / TemplateMonster cover
 *   dist/marketplace/screenshots/*.jpg       full-page desktop and mobile screenshots
 */
import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { chromium } from "@playwright/test";

const root = process.cwd();
const PORT = 4322;
const base = `http://localhost:${PORT}`;
if (!existsSync(join(root, "out/index.html"))) {
  console.error("No build found. Run `npm run build` first.");
  process.exit(1);
}

const previewsDir = join(root, "public/previews");
const outDir = join(root, "dist/marketplace");
const shotsDir = join(outDir, "screenshots");
for (const d of [previewsDir, outDir, shotsDir]) mkdirSync(d, { recursive: true });

const pages = [
  ["home-classic", "/"],
  ["home-editorial", "/home-editorial/"],
  ["home-modern", "/home-modern/"],
  ["shop", "/shop/"],
  ["product", "/product/fjell-three-seat-sofa/"],
  ["collections", "/collections/"],
  ["cart", "/cart/"],
  ["checkout", "/checkout/"],
  ["account", "/account/orders/"],
  ["blog", "/blog/"],
  ["blog-post", "/blog/measuring-for-a-new-sofa/"],
  ["about", "/about/"],
  ["contact", "/contact/"],
  ["coming-soon", "/coming-soon/"],
];

// Serve the static build.
const server = spawn("npx", ["serve", "out", "-l", String(PORT)], { shell: true, stdio: "ignore" });
const stop = () => server.kill();
process.on("exit", stop);
for (let i = 0; i < 60; i++) {
  try {
    if ((await fetch(base)).ok) break;
  } catch {}
  await new Promise((r) => setTimeout(r, 500));
}

const browser = await chromium.launch({ channel: process.env.PW_CHANNEL || undefined });

/** A page with the cookie choice made, the pop-up seen, a demo cart, and the demo tab hidden. */
async function newPage(viewport, deviceScaleFactor = 1) {
  const context = await browser.newContext({ viewport, deviceScaleFactor, reducedMotion: "reduce" });
  await context.addInitScript(() => {
    localStorage.setItem("nordvik:consent", JSON.stringify({ analytics: false, marketing: false, decidedAt: "shots" }));
    localStorage.setItem("nordvik:newsletter-popup", JSON.stringify(new Date().toISOString()));
    localStorage.setItem(
      "nordvik:cart",
      JSON.stringify([
        { key: "p01|Pine velvet", productId: "p01", color: "Pine velvet", options: {}, quantity: 1 },
        { key: "p14|Graphite", productId: "p14", color: "Graphite", options: {}, quantity: 1 },
      ]),
    );
  });
  const page = await context.newPage();
  await page.addStyleTag({ content: "" }).catch(() => {});
  return page;
}

async function load(page, path) {
  await page.goto(base + path, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: '[aria-label="Customize this demo"]{display:none!important}' });
  // Scroll through so lazy images load, then return to the top.
  const height = await page.evaluate(() => document.body.scrollHeight);
  for (let y = 0; y < height; y += 600) {
    await page.evaluate((y) => window.scrollTo(0, y), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(700);
}

let n = 0;
const desktop = await newPage({ width: 1440, height: 900 });
for (const [name, path] of pages) {
  await load(desktop, path);
  await desktop.screenshot({ path: join(previewsDir, `${name}.jpg`), type: "jpeg", quality: 82 });
  await desktop.screenshot({
    path: join(shotsDir, `${String(++n).padStart(2, "0")}-${name}-desktop.jpg`),
    type: "jpeg",
    quality: 85,
    fullPage: true,
  });
  console.log(`desktop  ${path}`);
}

const mobile = await newPage({ width: 390, height: 844 }, 2);
for (const [name, path] of pages.slice(0, 6)) {
  await load(mobile, path);
  await mobile.screenshot({
    path: join(shotsDir, `${String(++n).padStart(2, "0")}-${name}-mobile.jpg`),
    type: "jpeg",
    quality: 85,
    fullPage: true,
  });
  console.log(`mobile   ${path}`);
}

// Composite listing images from the previews.
const dataUrl = (name) => `data:image/jpeg;base64,${readFileSync(join(previewsDir, `${name}.jpg`)).toString("base64")}`;
const fonts = `<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300..500&family=IBM+Plex+Mono:wght@500&family=Manrope:wght@500&display=swap" rel="stylesheet">`;
const frame = (name, style) =>
  `<div style="position:absolute;${style};overflow:hidden;box-shadow:0 30px 60px -20px rgb(0 0 0/.35);border:1px solid #DCD2C3"><img src="${dataUrl(name)}" style="width:100%;display:block"></div>`;

async function composite(file, width, height, html, type = "jpeg") {
  const page = await browser.newPage({ viewport: { width, height } });
  await page.setContent(
    `<html><head>${fonts}</head><body style="margin:0;width:${width}px;height:${height}px;position:relative;overflow:hidden;background:#F6F2EC;color:#24211E">${html}</body></html>`,
    { waitUntil: "networkidle" },
  );
  await page.screenshot({ path: join(outDir, file), type, ...(type === "jpeg" ? { quality: 90 } : {}) });
  await page.close();
}

const title = (size) =>
  `<div style="font-family:Fraunces,serif;font-size:${size}px;letter-spacing:-.035em;line-height:.95">nordvik<span style="color:#2F5A4C">.</span></div>`;
const eyebrow = (text, size) =>
  `<div style="font-family:'IBM Plex Mono',monospace;font-size:${size}px;letter-spacing:.16em;text-transform:uppercase;color:#625A51">${text}</div>`;

await composite(
  "preview-590x300.jpg",
  590,
  300,
  `<div style="position:absolute;left:28px;top:32px;width:210px">${title(50)}
     <div style="margin-top:14px;font:500 14px/1.45 Manrope,sans-serif;color:#625A51">Furniture &amp; home decor store template for Next.js</div>
     <div style="margin-top:18px">${eyebrow("3 homes · 3 presets", 10)}</div>
     <div style="margin-top:6px">${eyebrow("Shopify-ready", 10)}</div></div>
   ${frame("home-classic", "left:262px;top:30px;width:300px")}
   ${frame("product", "left:236px;top:168px;width:190px")}`,
);

await composite(
  "cover-1280x720.jpg",
  1280,
  720,
  `<div style="position:absolute;left:72px;top:84px;width:440px">${eyebrow("Next.js 16 · Tailwind CSS 4 · TypeScript", 15)}
     <div style="margin-top:26px">${title(118)}</div>
     <div style="margin-top:26px;font:500 26px/1.4 Manrope,sans-serif">Furniture &amp; home decor store template</div>
     <div style="margin-top:34px">${eyebrow("3 home layouts · 3 color presets", 15)}</div>
     <div style="margin-top:10px">${eyebrow("Shopify-ready · Static export", 15)}</div></div>
   ${frame("home-classic", "left:560px;top:70px;width:640px")}
   ${frame("home-modern", "left:880px;top:390px;width:360px")}
   ${frame("product", "left:600px;top:440px;width:320px")}`,
);

// 80×80 thumbnail from the browser icon.
const icon = readFileSync(join(root, "public/icon.svg"), "utf8").replace("<svg ", '<svg width="80" height="80" ');
const thumb = await browser.newPage({ viewport: { width: 80, height: 80 } });
await thumb.setContent(`<body style="margin:0">${icon}</body>`);
await thumb.screenshot({ path: join(outDir, "thumbnail-80x80.png"), omitBackground: true });

await browser.close();
stop();
console.log(`\nListing images: dist/marketplace/  ·  Previews for /demos/: public/previews/ (rebuild to include them)`);
process.exit(0);
