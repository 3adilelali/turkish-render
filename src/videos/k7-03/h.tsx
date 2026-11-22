import React from "react";
import credits from "../../../public/img/k7-03/credits.json";
import dimsJson from "../../../public/data/k7-03-dims.json";
import { X, T } from "../../components/Protokol";
import { rp, lp } from "../../components/Hayat";
import { Ph, setDims, setImgDir, Grade } from "../../components/Protokol5";
import { GeoMap, MapPin, MapRoute, GeoView } from "../../components/Protokol6";
import { Label, KDefs } from "../../components/Karun";

// k7-03 · مساعدات: المحرّك أساس، والصورة الحقيقية للتعريف بس
setDims(dimsJson as unknown as Record<string, [number, number]>);
setImgDir("k7-03");
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
export const ph = (file: string, cap?: string, sub?: string, o: { grade?: Grade; z?: [number, number]; f?: [number, number, number, number] } = {}): R => {
  const z = o.z ?? ZV[VC++ % ZV.length];
  return (t, a, b) => <Ph t={t} a={a} b={b} file={file} credit={crd(file)} cap={cap} sub={sub} grade={o.grade ?? "none"} z={z} f={o.f} mode="cover" />;
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
export const TwoAccounts: React.FC<{ t: number; a: number; b: number; hi?: number }> = ({ t, a, hi = -1 }) => {
  const cols: [string, string[]][] = [["ANLATIM 1", ["1966 yazı", "Toptepe tümülüsü", "3 kişi", "dinamit"]], ["ANLATIM 2 · Kemal Çakar", ["1968", "Aktepe tümülüsü", "5 kişi", "gaz lambası, harita"]]];
  return (
    <g>
      <KDefs />
      <rect width={1920} height={1080} fill="#08090D" />
      {T(960, 170, "KAYNAKLAR FARKLI ANLATIYOR", 54, "#FFF", 800, "middle")}
      {cols.map(([h, ls], i) => {
        const k = rp(t, a + 0.3 + i * 0.5, a + 0.8 + i * 0.5);
        const on = hi < 0 || hi === i;
        return (
          <g key={i} opacity={k * (on ? 1 : 0.3)} transform={`translate(${160 + i * 840},${260 + (1 - k) * 24})`}>
            <rect width={760} height={640} rx={12} fill="#0F131B" stroke={on && hi >= 0 ? AMB : "#2A3240"} strokeWidth={on && hi >= 0 ? 6 : 3} />
            {T(50, 100, h, 38, AMB, 800)}
            {ls.map((l, j) => <g key={j} opacity={rp(t, a + 0.9 + i * 0.5 + j * 0.3, a + 1.2 + i * 0.5 + j * 0.3)}><circle cx={64} cy={210 + j * 110} r={10} fill={AMB} />{T(100, 224 + j * 110, l, 46, "#EDEFF2", 600)}</g>)}
          </g>
        );
      })}
      {hi < 0 && <g opacity={rp(t, a + 2.4, a + 3)}><rect x={560} y={940} width={800} height={80} rx={8} fill={AMB} />{T(960, 995, "ORTAK NOKTA: 1965–1968 · Güre", 38, "#07090E", 800, "middle")}</g>}
    </g>
  );
};

// خريطة كنز مرسومة باليد (الأنتيكاجي)
export const OldMap: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => {
  const k = rp(t, a + 0.4, b - 0.5);
  const z = lp(1, 1.12, rp(t, a, b));
  return (
    <g>
      <rect width={1920} height={1080} fill="#1A130D" />
      <g transform={`translate(960,540) scale(${z}) rotate(-3) translate(-960,-540)`}>
        <rect x={300} y={150} width={1320} height={800} fill="#D9C9A3" />
        <rect x={300} y={150} width={1320} height={800} fill="none" stroke="#8A6A3A" strokeWidth={10} />
        {[[520, 520, 120], [860, 420, 150], [1180, 560, 110], [1420, 420, 90]].map(([x, y, r], i) => <g key={i}><path d={`M${x - r},${y} Q${x},${y - r * 1.2} ${x + r},${y}`} fill="none" stroke="#5A3A1A" strokeWidth={5} />{T(x, y + 50, ["Toptepe", "Aktepe", "İkiztepe", "Basmacı"][i], 30, "#5A3A1A", 700, "middle", { fontStyle: "italic" })}</g>)}
        <path d="M400,850 C600,780 700,700 860,560" fill="none" stroke="#8A2A1A" strokeWidth={6} strokeDasharray="1400" strokeDashoffset={1400 * (1 - k)} />
        <g opacity={rp(t, b - 1.4, b - 0.8)}><path d="M830,370 L890,430 M890,370 L830,430" stroke="#B3121B" strokeWidth={12} strokeLinecap="round" /></g>
        {T(420, 230, "GÜRE", 44, "#5A3A1A", 800)}
      </g>
      <g><rect x={80} y={930} width={560} height={64} rx={6} fill="#05070C" opacity={0.85} />{T(110, 974, "temsili çizim · kaynak: K. Çakar'ın anlatımı", 24, X.dim, 600)}</g>
    </g>
  );
};

// سؤال التعليقات
export const Question: React.FC<{ t: number; a: number; b: number }> = ({ t, a }) => {
  const opts = ["Geceleri kazan köylüler", "Hazineyi satın alan müze", "Onu korumakla görevli adam"];
  return (
    <g>
      <KDefs />
      <rect width={1920} height={1080} fill="#08090D" />
      {T(960, 220, "SİZCE EN BÜYÜK ZARARI KİM VERDİ?", 60, "#FFF", 800, "middle")}
      {opts.map((o, i) => {
        const k = rp(t, a + 1 + i * 1.4, a + 1.5 + i * 1.4);
        return <g key={i} opacity={k} transform={`translate(${460},${340 + i * 180 + (1 - k) * 20})`}>
          <rect width={1000} height={130} rx={12} fill="#0F131B" stroke="#2A3240" strokeWidth={3} />
          <circle cx={80} cy={65} r={38} fill={AMB} />{T(80, 80, String.fromCharCode(65 + i), 40, "#07090E", 800, "middle")}
          {T(150, 82, o, 44, "#EDEFF2", 600)}
        </g>;
      })}
      <g opacity={rp(t, a + 5.4, a + 6)}>{T(960, 940, "Cevabınızı yorumlara yazın", 36, AMB, 700, "middle")}</g>
    </g>
  );
};
