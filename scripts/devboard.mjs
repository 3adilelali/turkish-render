// مثل board.mjs بس بمدخل src/dev/index.ts: node scripts/devboard.mjs <Comp> <out.png> <s1,s2,...> [scale]
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
const [, , id, out, list, sc = "0.25"] = process.argv;
const secs = list.split(",").map(Number);
const tmp = path.resolve(".check/devboard-tmp");
fs.mkdirSync(tmp, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/dev/index.ts") });
const composition = await selectComposition({ serveUrl, id });
const files = [];
for (const [i, s] of secs.entries()) {
  const f = path.join(tmp, `${String(i).padStart(3, "0")}.png`);
  await renderStill({ serveUrl, composition, output: f, frame: Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps)), scale: Number(sc) });
  files.push(f);
}
const cols = Math.min(4, files.length), rows = Math.ceil(files.length / cols);
execFileSync("ffmpeg", ["-v", "error", "-y", "-framerate", "1", "-i", path.join(tmp, "%03d.png"), "-vf", `tile=${cols}x${rows}:padding=6:color=white`, "-frames:v", "1", out]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log("OK", out);
