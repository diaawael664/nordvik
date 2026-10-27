/**
 * Download the demo photos so the live demo serves them from its own domain.
 *
 *   npm run demo:images
 *
 * Saves every Unsplash photo in data/images.ts as WebP in five widths
 * (public/demo-images/<key>-<width>.webp). Build with
 * NEXT_PUBLIC_IMAGE_MODE=mirror to use them; the image loader then picks the
 * right width for each screen. Same-origin images load noticeably faster on
 * mobile than images from a third-party CDN.
 *
 * For the live demo only: these photos are not part of the download package.
 * Already-downloaded files are skipped, so re-running is fast.
 */
import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

export const MIRROR_WIDTHS = [384, 640, 828, 1200, 1920];

const source = readFileSync(join(process.cwd(), "data/images.ts"), "utf8");
const entries = [...source.matchAll(/^\s*"?([a-z0-9-]+)"?:\s*\{\s*src:\s*unsplash\("([^"]+)"\)/gm)].map((m) => ({
  key: m[1],
  id: m[2],
}));

const outDir = join(process.cwd(), "public/demo-images");
mkdirSync(outDir, { recursive: true });

const jobs = entries.flatMap(({ key, id }) =>
  MIRROR_WIDTHS.map((w) => ({
    file: join(outDir, `${key}-${w}.webp`),
    url: `https://images.unsplash.com/photo-${id}?w=${w}&q=60&fm=webp&fit=crop`,
  })),
);

let done = 0;
let downloaded = 0;
let failed = 0;
async function worker(queue) {
  for (let job = queue.shift(); job; job = queue.shift()) {
    if (!existsSync(job.file)) {
      try {
        const res = await fetch(job.url);
        if (!res.ok) throw new Error(`${res.status}`);
        writeFileSync(job.file, Buffer.from(await res.arrayBuffer()));
        downloaded++;
      } catch (e) {
        failed++;
        console.error(`Failed: ${job.url} (${e.message})`);
      }
    }
    done++;
    if (done % 50 === 0) console.log(`${done}/${jobs.length}`);
  }
}

const queue = [...jobs];
await Promise.all(Array.from({ length: 8 }, () => worker(queue)));
console.log(
  `${entries.length} photos × ${MIRROR_WIDTHS.length} widths: ${downloaded} downloaded, ${jobs.length - downloaded - failed} already present, ${failed} failed.`,
);
if (failed) process.exit(1);
