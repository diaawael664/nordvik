/**
 * Build the downloadable package for marketplaces.
 *
 *   npm run package
 *
 * Creates dist/nordhaus-v<version>.zip from a clean copy of the project:
 *   • leaves out build output, dependencies, local settings and test results
 *   • leaves out live-demo-only material: mirrored Unsplash photos, page
 *     previews and the /demos/ landing page (with its menu link)
 *   • switches images to neutral placeholders (demo photos and video are not
 *     redistributed; see CREDITS.md) and generates them
 * Then checks the copy for anything that shouldn't ship before zipping.
 * Your working project is never modified.
 */
import { execFileSync } from "node:child_process";
import { cpSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, relative, sep } from "node:path";
import { deflateRawSync } from "node:zlib";

const root = process.cwd();
const { version } = JSON.parse(readFileSync(join(root, "package.json"), "utf8"));
const name = `nordhaus-v${version}`;
const dist = join(root, "dist");
// Staged outside the project, because a folder can't be copied into itself.
const stageRoot = join(tmpdir(), `nordhaus-package-${Date.now()}`);
const stage = join(stageRoot, name);

/* ── 1. Clean copy ──────────────────────────────────────────────────────── */

const EXCLUDE = new Set([
  "node_modules",
  ".next",
  "out",
  "dist",
  ".git",
  "test-results",
  "playwright-report",
  "tsconfig.tsbuildinfo",
  "next-env.d.ts",
  "AGENTS.md",
  ".env",
  ".env.local",
  // Seller-only tools and notes
  "SELLING.md",
  "scripts/package.mjs",
  "scripts/marketplace.mjs",
  "scripts/mirror-images.mjs",
  // Live demo only
  "public/demo-images",
  "public/previews",
  "src/app/(focus)/demos",
]);

mkdirSync(stage, { recursive: true });
mkdirSync(dist, { recursive: true });
cpSync(root, stage, {
  recursive: true,
  filter: (src) => {
    const rel = relative(root, src).split(sep).join("/");
    if (!rel) return true;
    return ![...EXCLUDE].some((ex) => rel === ex || rel.startsWith(ex + "/"));
  },
});

/* ── 2. Package settings ────────────────────────────────────────────────── */

function edit(file, from, to) {
  const path = join(stage, file);
  const text = readFileSync(path, "utf8");
  if (!text.includes(from)) throw new Error(`package: expected text not found in ${file}: ${from}`);
  writeFileSync(path, text.replace(from, to));
}
edit("data/site.ts", 'imageMode: "unsplash" as ImageMode', 'imageMode: "placeholder" as ImageMode');
edit("data/navigation.ts", '            { label: "All demos", href: "/demos/" },\n', "");

// Remove the seller-only npm scripts from the buyer's package.json.
const pkgPath = join(stage, "package.json");
const pkg = JSON.parse(readFileSync(pkgPath, "utf8"));
for (const s of ["package", "marketplace", "demo:images"]) delete pkg.scripts[s];
writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + "\n");

execFileSync(process.execPath, [join(stage, "scripts/generate-placeholders.mjs")], { cwd: stage, stdio: "inherit" });

/* ── 3. Checks ──────────────────────────────────────────────────────────── */

const files = [];
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) walk(full);
    else files.push(full);
  }
})(stage);

const rel = (f) => relative(stage, f).split(sep).join("/");
const problems = [];
const banned = [
  /^public\/demo-images\//,
  /^public\/previews\//,
  /^src\/app\/\(focus\)\/demos\//,
  /\.env(\.local)?$/,
  /^node_modules\//,
];
for (const f of files) if (banned.some((re) => re.test(rel(f)))) problems.push(`should not ship: ${rel(f)}`);
for (const f of files.filter((f) => /\.(jpe?g|webp|avif|mp4|webm)$/i.test(f))) {
  problems.push(`unexpected photo or video file: ${rel(f)}`);
}
if (!existsSync(join(stage, "public/placeholders"))) problems.push("placeholders were not generated");
if (!readFileSync(join(stage, "data/site.ts"), "utf8").includes('imageMode: "placeholder"'))
  problems.push("imageMode is not placeholder");
if (!existsSync(join(stage, "documentation/index.html"))) problems.push("documentation is missing");

if (problems.length) {
  console.error("Package check failed:\n  " + problems.join("\n  "));
  rmSync(stageRoot, { recursive: true, force: true });
  process.exit(1);
}

/* ── 4. Zip (no dependencies) ───────────────────────────────────────────── */

const CRC_TABLE = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});
const crc32 = (buf) => {
  let c = 0xffffffff;
  for (const b of buf) c = CRC_TABLE[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
};

const now = new Date();
const dosTime = (now.getHours() << 11) | (now.getMinutes() << 5) | (now.getSeconds() >> 1);
const dosDate = ((now.getFullYear() - 1980) << 9) | ((now.getMonth() + 1) << 5) | now.getDate();

const chunks = [];
const central = [];
let offset = 0;
for (const file of files.sort()) {
  const nameBuf = Buffer.from(`${name}/${rel(file)}`, "utf8");
  const data = readFileSync(file);
  const compressed = deflateRawSync(data, { level: 9 });
  const useDeflate = compressed.length < data.length;
  const body = useDeflate ? compressed : data;
  const crc = crc32(data);

  const local = Buffer.alloc(30);
  local.writeUInt32LE(0x04034b50, 0);
  local.writeUInt16LE(20, 4);
  local.writeUInt16LE(0x0800, 6); // UTF-8 names
  local.writeUInt16LE(useDeflate ? 8 : 0, 8);
  local.writeUInt16LE(dosTime, 10);
  local.writeUInt16LE(dosDate, 12);
  local.writeUInt32LE(crc, 14);
  local.writeUInt32LE(body.length, 18);
  local.writeUInt32LE(data.length, 22);
  local.writeUInt16LE(nameBuf.length, 26);
  chunks.push(local, nameBuf, body);

  const entry = Buffer.alloc(46);
  entry.writeUInt32LE(0x02014b50, 0);
  entry.writeUInt16LE(20, 4);
  entry.writeUInt16LE(20, 6);
  entry.writeUInt16LE(0x0800, 8);
  entry.writeUInt16LE(useDeflate ? 8 : 0, 10);
  entry.writeUInt16LE(dosTime, 12);
  entry.writeUInt16LE(dosDate, 14);
  entry.writeUInt32LE(crc, 16);
  entry.writeUInt32LE(body.length, 20);
  entry.writeUInt32LE(data.length, 24);
  entry.writeUInt16LE(nameBuf.length, 28);
  entry.writeUInt32LE(offset, 42);
  central.push(entry, nameBuf);

  offset += local.length + nameBuf.length + body.length;
}
const centralSize = central.reduce((s, b) => s + b.length, 0);
const end = Buffer.alloc(22);
end.writeUInt32LE(0x06054b50, 0);
end.writeUInt16LE(files.length, 8);
end.writeUInt16LE(files.length, 10);
end.writeUInt32LE(centralSize, 12);
end.writeUInt32LE(offset, 16);

const zipPath = join(dist, `${name}.zip`);
writeFileSync(zipPath, Buffer.concat([...chunks, ...central, end]));
rmSync(stageRoot, { recursive: true, force: true });
const mb = (statSync(zipPath).size / 1024 / 1024).toFixed(1);
console.log(`\nPackage: dist/${name}.zip (${files.length} files, ${mb} MB)`);
console.log("Upload it as the main file. Listing images: run `npm run marketplace`.");
