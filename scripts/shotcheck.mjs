// فحص سريع لـ timeline بدون مسودة: بيرسم كل لقطة (بأولها ونصها وآخرها) بـ react-dom/server،
// وبيطبع أي خطأ (عبارة ما انلقت، أو مكوّن غلط)، وعدد اللقطات، وأطول لقطة.
// node scripts/shotcheck.mjs src/videos/k4-17/timeline.tsx   (من جوا المحرك)
import { build } from "esbuild";
import { pathToFileURL } from "url";
import path from "path";
import fs from "fs";

const src = process.argv[2];
const tmp = path.resolve(".shotcheck-tmp.cjs"); // inside المحرك so node finds node_modules
const entry = `
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as T from ${JSON.stringify(path.resolve(src))};
const S = T.SHOTS, out = [];
let errs = 0, maxLen = 0, maxAt = 0;
for (let i = 0; i < S.length; i++) {
  const a = S[i].from, b = i + 1 < S.length ? S[i + 1].from : T.END;
  if (b - a > maxLen) { maxLen = b - a; maxAt = a; }
  if (b - a > 7) out.push("LONG " + (b - a).toFixed(1) + "s @" + a.toFixed(1));
  for (const t of [a + 0.05, (a + b) / 2, b - 0.05]) {
    try { renderToStaticMarkup(React.createElement("svg", null, S[i].el(t))); }
    catch (e) { if (/No video config/.test(String(e.message))) break; errs++; out.push("ERR shot@" + a.toFixed(1) + " t=" + t.toFixed(1) + ": " + String(e.message || e).slice(0, 200)); break; }
  }
}
out.forEach((l) => console.log(l));
console.log("shots " + S.length + " · end " + T.END.toFixed(1) + " · longest " + maxLen.toFixed(1) + "s @" + maxAt.toFixed(1) + " · errors " + errs);
`;
const ent = path.join(path.dirname(path.resolve(src)), "__shotcheck_entry.tsx");
fs.writeFileSync(ent, entry);
try {
  await build({ entryPoints: [ent], bundle: true, platform: "node", format: "cjs", outfile: tmp, jsx: "automatic", loader: { ".json": "json" }, external: ["react", "react-dom", "remotion", "@remotion/*"], logLevel: "error" });
} finally {
  fs.unlinkSync(ent);
}
process.on("unhandledRejection", () => {}); // font loading needs a browser
try { await import(pathToFileURL(tmp).href); } finally { fs.unlinkSync(tmp); }
