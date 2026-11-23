import React from "react";
import credits from "../../../public/img/k7-04/credits.json";
import dimsJson from "../../../public/data/k7-04-dims.json";
import { X, T } from "../../components/Protokol";
import { rp } from "../../components/Hayat";
import { Ph, setDims, setImgDir, Grade } from "../../components/Protokol5";
import { GeoMap, MapPin, MapRoute, GeoView } from "../../components/Protokol6";
import { Label, KDefs } from "../../components/Karun";
export { GRN, BTC } from "../../components/SilkRoad";

// k7-04 · مساعدات: المحرّك أساس، والصورة الحقيقية للتعريف بس
setDims(dimsJson as unknown as Record<string, [number, number]>);
setImgDir("k7-04");
export type R = (t: number, a: number, b: number) => React.ReactNode;
export type Sh = { c: string | string[]; r: R; html?: R; sfx?: string };
export const AMB = X.amber, RED = X.red, GREEN = "#7BE495";

export const crd = (file: string): string | undefined => {
  const c = (credits as Record<string, { license: string; artist: string }>)[file];
  if (!c) return undefined;
  if (/^(public domain|no restrictions|cc0)/i.test(c.license)) return undefined;
  const a = (c.artist || "").replace(/\s+/g, " ").replace(/<[^>]+>/g, "").trim().slice(0, 34);
  return `${a ? a + " · " : ""}${c.license} · Wikimedia Commons`;
};

// مكوّن مشهد ← R
export const K = <P extends object>(C: React.FC<P & { t: number; a: number; b: number }>, p: P = {} as P): R => (t, a, b) => <C t={t} a={a} b={b} {...p} />;

// صورة حقيقية (تعريف): ألوان حقيقية للذهب، وحركة كاميرا هادية
const ZV: [number, number][] = [[1.04, 1.14], [1.12, 1.24], [1.06, 1.2]];
let VC = 0;
export const ph = (file: string, cap?: string, sub?: string, o: { grade?: Grade; z?: [number, number]; f?: [number, number, number, number]; card?: boolean } = {}): R => {
  const z = o.z ?? ZV[VC++ % ZV.length];
  return (t, a, b) => <Ph t={t} a={a} b={b} file={file} credit={crd(file)} cap={cap} sub={sub} grade={o.grade ?? "none"} z={z} f={o.f} mode={o.card ? "card" : "cover"} />;
};

export const map = (v0: GeoView, o: { v1?: GeoView; hi?: string[]; hi2?: string[]; pins?: (MapPin & { dt?: number })[]; routes?: (Omit<MapRoute, "at"> & { dt: number })[]; yr?: string; place?: string } = {}): R => (t, a, b) => {
  const { pins = [], routes = [], ...rest } = o;
  return <GeoMap t={t} a={a} b={b} v0={v0} {...rest} pins={pins.map((p) => ({ ...p, at: a + (p.dt ?? 0.3) }))} routes={routes.map((r) => ({ ...r, at: a + r.dt }))} />;
};

// نص كبير على خلفية غامقة بعمق خفيف
export const title = (lines: { s: string; c?: string; size?: number }[], o: { bg?: string; step?: number; y?: number } = {}): R => (t, a) => {
  const step = o.step ?? 1.2, y0 = o.y ?? 540 - (lines.length - 1) * 55;
  return (
    <g>
      <KDefs />
      <rect width={1920} height={1080} fill={o.bg ?? "#07090E"} />
      <circle cx={960} cy={540} r={700} fill="url(#kLamp)" opacity={0.1} />
      {lines.map((l, i) => {
        const k = rp(t, a + 0.25 + i * step, a + 0.75 + i * step);
        return <g key={i} opacity={k} transform={`translate(0,${(1 - k) * 18})`}>{T(960, y0 + i * 110, l.s, l.size ?? 68, l.c ?? "#FFF", 700, "middle")}</g>;
      })}
    </g>
  );
};

// إطار تسمية فوق أي مشهد
export const lab = (r: R, a1: string, b1?: string, c?: string): R => (t, a, b) => (
  <g>{r(t, a, b)}<Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={a1} b={b1} c={c} /></g>
);

// روايتين مختلفتين (المصادر بتختلف)
