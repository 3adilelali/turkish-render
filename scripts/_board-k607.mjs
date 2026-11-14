// لوحة إطارات سريعة: node scripts/board.mjs <Composition> <out.png> <ثانية1,ثانية2,...> [scale]
// بتعمل bundle مرة وحدة، وبتصوّر كل ثانية، وبتجمعهم بشبكة 4 أعمدة (ffmpeg).
import { bundle } from "@remotion/bundler";
import { renderStill, selectComposition } from "@remotion/renderer";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const [, , id, out, list, sc = "0.25"] = process.argv;
const secs = list.split(",").map(Number);
const tmp = path.resolve(".check/board-tmp");
fs.mkdirSync(tmp, { recursive: true });
const serveUrl = await bundle({ entryPoint: path.resolve("src/_k607-index.tsx") });
const composition = await selectComposition({ serveUrl, id });
const files = [];
for (const [i, s] of secs.entries()) {
  const f = path.join(tmp, `${String(i).padStart(3, "0")}.png`);
  await renderStill({ serveUrl, composition, output: f, frame: Math.min(composition.durationInFrames - 1, Math.round(s * composition.fps)), scale: Number(sc) });
  files.push(f);
}
const cols = 4, rows = Math.ceil(files.length / cols);
execFileSync("ffmpeg", ["-v", "error", "-y", "-framerate", "1", "-i", path.join(tmp, "%03d.png"), "-vf", `tile=${cols}x${rows}:padding=6:color=white`, "-frames:v", "1", out]);
fs.rmSync(tmp, { recursive: true, force: true });
console.log("OK", out);
