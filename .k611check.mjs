import { build } from "esbuild";
import { pathToFileURL } from "url";
import fs from "fs";
const ent = "src/videos/k6-11/__chk.tsx";
fs.writeFileSync(ent, `
import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { TIMED, K6_11_SECONDS } from "./K6Video";
let errs=0, maxL=0, maxAt=0; const out=[];
TIMED.forEach((s,i)=>{ const L=s.to-s.from; if(L>maxL){maxL=L;maxAt=s.from;} if(L>7.5) out.push("LONG "+L.toFixed(1)+" @"+s.from.toFixed(1)+" "+JSON.stringify(s.c));
 for (const t of [s.from+0.05,(s.from+s.to)/2,s.to-0.05]) { try { renderToStaticMarkup(React.createElement("svg",null,s.r(t,s.from,s.to))); if(s.html) renderToStaticMarkup(React.createElement("div",null,s.html(t,s.from,s.to))); } catch(e){ errs++; out.push("ERR @"+s.from.toFixed(1)+" "+JSON.stringify(s.c)+": "+String(e.message||e).slice(0,160)); break; } } });
out.forEach(l=>console.log(l));
console.log("shots",TIMED.length,"end",K6_11_SECONDS,"longest",maxL.toFixed(1),"@",maxAt.toFixed(1),"errors",errs);
`);
const stub = { name: "stub", setup(b) { b.onResolve({ filter: /^@remotion\/media$/ }, () => ({ path: "m", namespace: "stub" })); b.onLoad({ filter: /.*/, namespace: "stub" }, () => ({ contents: "export const Audio=()=>null;", loader: "js" })); } };
try { await build({ entryPoints: [ent], bundle: true, platform: "node", format: "cjs", outfile: ".k611.cjs", jsx: "automatic", loader: { ".json": "json" }, external: ["react", "react-dom", "remotion"], plugins: [stub], logLevel: "error" }); } finally { fs.unlinkSync(ent); }
process.on("unhandledRejection", () => {});
try { await import(pathToFileURL(".k611.cjs").href); } finally { fs.unlinkSync(".k611.cjs"); }
