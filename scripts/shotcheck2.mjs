// k2r tipi (TIMED + s.r/s.html) için hızlı kontrol: node scripts/shotcheck2.mjs src/videos/k2r-20/K2Video.tsx
import { build } from "esbuild";
import { pathToFileURL } from "url";
import path from "path";
import fs from "fs";
const src = process.argv[2];
const tmp = path.resolve(".shotcheck2-tmp.mjs");
const entry = `
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import * as T from ${JSON.stringify(path.resolve(src))};
const S = T.TIMED; const out = []; let errs = 0, maxLen = 0, maxAt = 0, short = 0;
for (let i = 0; i < S.length; i++) {
  const a = S[i].from, b = S[i].to;
  if (b - a > maxLen) { maxLen = b - a; maxAt = a; }
  if (b - a > 9) out.push("LONG " + (b - a).toFixed(1) + "s @" + a.toFixed(1) + " " + S[i].c);
  if (b - a < 1.0) { short++; out.push("SHORT " + (b - a).toFixed(2) + "s @" + a.toFixed(1) + " " + S[i].c); }
  for (const t of [a + 0.05, (a + b) / 2, b - 0.05]) {
    try { renderToStaticMarkup(React.createElement("svg", null, S[i].r(t, a, b))); if (S[i].html) renderToStaticMarkup(React.createElement("div", null, S[i].html(t, a, b))); }
    catch (e) { if (/No video config|useCurrentFrame|delayRender/.test(String(e.message))) break; errs++; out.push("ERR @" + a.toFixed(1) + " " + S[i].c + ": " + String(e.message || e).slice(0, 160)); break; }
  }
}
out.forEach((l) => console.log(l)); if (process.env.LIST) S.forEach((s) => console.log("@" + s.from.toFixed(1) + "	" + s.c));
console.log("shots " + S.length + " · longest " + maxLen.toFixed(1) + "s @" + maxAt.toFixed(1) + " · short " + short + " · errors " + errs);
`;
const ent = path.join(path.dirname(path.resolve(src)), "__shotcheck2_entry.tsx");
fs.writeFileSync(ent, entry);
try { await build({ entryPoints: [ent], bundle: true, platform: "node", format: "esm", outfile: tmp, jsx: "automatic", loader: { ".json": "json" }, external: ["react", "react-dom", "remotion", "@remotion/*"], logLevel: "error" }); }
finally { fs.unlinkSync(ent); }
process.on("unhandledRejection", () => {});
try { await import(pathToFileURL(tmp).href); } finally { fs.unlinkSync(tmp); }
