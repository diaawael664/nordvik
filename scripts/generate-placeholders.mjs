/**
 * Generate neutral placeholder images for every key in data/images.ts.
 *
 *   npm run placeholders
 *
 * Writes /public/placeholders/<key>.svg. Then set `imageMode: "placeholder"`
 * in data/site.ts to use them instead of the Unsplash demo photos (this is how
 * the downloadable package ships, since demo photos are not redistributed).
 * Each placeholder shows its key and description, so you know what to replace.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const source = readFileSync(join(process.cwd(), "data/images.ts"), "utf8");
const entries = [...source.matchAll(/^\s*"?([a-z0-9-]+)"?:\s*\{\s*src:[^}]*?alt:\s*"([^"]*)"/gm)].map((m) => ({
  key: m[1],
  alt: m[2],
}));

if (entries.length === 0) {
  console.error("No image keys found in data/images.ts");
  process.exit(1);
}

const esc = (s) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** Wraps text to lines of about `width` characters. */
function wrap(text, width) {
  const lines = [];
  let line = "";
  for (const word of text.split(" ")) {
    if ((line + " " + word).trim().length > width) {
      lines.push(line.trim());
      line = word;
    } else line += " " + word;
  }
  if (line.trim()) lines.push(line.trim());
  return lines.slice(0, 3);
}

// Warm and cool neutrals, chosen per key so neighbouring placeholders differ.
const tones = ["#E4D8C6", "#DCD2C3", "#D8CCB8", "#E6DFD3", "#D3D9D5", "#E7D5C3"];

const outDir = join(process.cwd(), "public/placeholders");
mkdirSync(outDir, { recursive: true });

entries.forEach(({ key, alt }, i) => {
  const bg = tones[i % tones.length];
  const lines = wrap(alt, 44);
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1600 1200" preserveAspectRatio="xMidYMid slice">
  <rect width="1600" height="1200" fill="${bg}"/>
  <g stroke="#24211E" stroke-opacity=".28" stroke-width="2" fill="none">
    <path d="M200 900h1200M200 885v30M1400 885v30"/>
    <path d="M1460 220v600M1445 220h30M1445 820h30"/>
    <rect x="420" y="380" width="760" height="360" rx="6"/>
  </g>
  <text x="800" y="560" text-anchor="middle" font-family="ui-monospace, monospace" font-size="30" letter-spacing="6" fill="#24211E" fill-opacity=".6">${esc(key.toUpperCase())}</text>
  ${lines
    .map(
      (l, n) =>
        `<text x="800" y="${625 + n * 40}" text-anchor="middle" font-family="Georgia, serif" font-size="30" fill="#24211E" fill-opacity=".55">${esc(l)}</text>`,
    )
    .join("\n  ")}
  <text x="800" y="960" text-anchor="middle" font-family="ui-monospace, monospace" font-size="22" letter-spacing="4" fill="#24211E" fill-opacity=".45">REPLACE WITH YOUR PHOTO</text>
</svg>
`;
  writeFileSync(join(outDir, `${key}.svg`), svg);
});

console.log(`Wrote ${entries.length} placeholders to public/placeholders/.`);
console.log('Set imageMode: "placeholder" in data/site.ts to use them.');
