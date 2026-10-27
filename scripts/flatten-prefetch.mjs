/**
 * Post-build step (runs automatically after `npm run build`).
 *
 * In static-export mode the Next.js 16 client prefetches route segments from
 * flat files such as `/product/x/__next.product.$d$slug.__PAGE__.txt`, but
 * `next build` writes them as nested folders
 * (`__next.product/$d$slug/__PAGE__.txt`). On a plain static host those
 * requests 404, which shows errors in the console and slows navigation.
 *
 * This script copies every nested segment file to the flat name the client
 * requests. It is safe to run repeatedly and leaves the original files alone.
 */
import { copyFileSync, existsSync, readdirSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

const outDir = join(process.cwd(), "out");
if (!existsSync(outDir)) {
  console.error("flatten-prefetch: no /out folder. Run `next build` first.");
  process.exit(1);
}

let copied = 0;

/** All files below `dir`, as absolute paths. */
function filesIn(dir) {
  return readdirSync(dir).flatMap((name) => {
    const full = join(dir, name);
    return statSync(full).isDirectory() ? filesIn(full) : [full];
  });
}

function walk(dir) {
  for (const name of readdirSync(dir)) {
    const full = join(dir, name);
    if (!statSync(full).isDirectory()) continue;
    if (name.startsWith("__next.")) {
      for (const file of filesIn(full)) {
        const flat = `${name}.${relative(full, file).split(sep).join(".")}`;
        const target = join(dir, flat);
        if (!existsSync(target)) {
          copyFileSync(file, target);
          copied++;
        }
      }
    } else {
      walk(full);
    }
  }
}

walk(outDir);
console.log(`flatten-prefetch: wrote ${copied} prefetch file${copied === 1 ? "" : "s"}.`);
