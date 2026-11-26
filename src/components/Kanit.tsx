import React from "react";
import { staticFile } from "remotion";
import { T } from "./Protokol";
import { rp, lp } from "./Hayat";
import { getDims } from "./Protokol5";

// Kanit.tsx · عدّة موشن غرافيك عامة (2026-11-26، القناة 5 وأي قناة):
// صورة خبر كـ«دليل» (كرت مطبوع + دائرة حمرا بتنرسم + سهم + ملاحظة + مصدر)، وإيموجي Twemoji (CC BY 4.0) بتنطّ،
// وتدفّق إيموجي (فلوس من ناس لناس)، وعدّاد بإيموجي، وقائمة خطوات بإيموجي.
// الإيموجي: public/emoji/<codepoint>.svg

export const EM: Record<string, string> = {
  inek: "1f404", tavuk: "1f414", yumurta: "1f95a", para: "1f4b0", kilit: "1f512", tel: "1f4f1", ucak: "2708", polis: "1f694",
  terazi: "2696", araba: "1f3ce", kumar: "1f3b0", ari: "1f41d", fis: "1f9fe", ucan: "1f4b8", kum: "23f3", siren: "1f6a8",
  dusus: "1f4c9", yukselis: "1f4c8", dusun: "1f914", unlem: "2757", banka: "1f3e6", zincir: "26d3", foto: "1f4f8", ates: "1f525",
  oyun: "1f3ae", koyun: "1f411", ordek: "1f986", ciftci: "1f9d1-200d-1f33e", kutu: "1f4e6", fabrika: "1f3ed", coin: "1fa99",
  pc: "1f5a5", mektup: "2709", yat: "1f6e5", goz: "1f440", hayir: "274c", evet: "2705", ev: "1f3e0", bayrak: "1f6a9",
  kisi: "1f9d1", grup: "1f465", belge: "1f4dc", pin: "1f4cd", saat: "23f0", abaküs: "1f9ee", dosya: "1f5c3", ara: "1f50d",
};
const emSrc = (e: string) => staticFile(`emoji/${EM[e] ?? e}.svg`);
const back = (k: number) => { const c = 1.70158; const x = k - 1; return k <= 0 ? 0 : k >= 1 ? 1 : 1 + (c + 1) * x * x * x + c * x * x; };

// إيموجي بتنطّ وبتطوف شوي
export const Emo: React.FC<{ t: number; at: number; e: string; x: number; y: number; s?: number; rot?: number; float?: boolean }> = ({ t, at, e, x, y, s = 110, rot = 0, float = true }) => {
  const k = back(Math.min(1, Math.max(0, (t - at) / 0.45)));
  if (k <= 0) return null;
  const fy = float ? Math.sin((t - at) * 2.2) * 6 : 0;
  const r = rot + (float ? Math.sin((t - at) * 1.6) * 4 : 0);
  return (
    <g transform={`translate(${x},${y + fy}) rotate(${r}) scale(${k})`} opacity={Math.min(1, k * 1.5)}>
      <ellipse cx={0} cy={s * 0.52} rx={s * 0.36} ry={s * 0.08} fill="#000" opacity={0.25} />
      <image href={emSrc(e)} x={-s / 2} y={-s / 2} width={s} height={s} />
    </g>
  );
};

type Ring = { x: number; y: number; r: number; at?: number; note?: string; side?: "l" | "r" };
// صورة خبر كدليل: كرت مايل بإطار أبيض وشريط لاصق، والكاميرا بتقرّب، ودائرة حمرا بتنرسم حوالين التفصيلة
export const Kanit: React.FC<{
  t: number; a: number; b: number; file: string; dir?: string; src: string; tilt?: number;
  ring?: Ring; head?: string; sub?: string; emo?: { e: string; x: number; y: number; dt?: number; s?: number }[]; date?: string;
}> = ({ t, a, b, file, dir = "k7-07", src, tilt = -2.2, ring, head, sub, emo = [], date }) => {
  const k = Math.min(1, Math.max(0, (t - a) / Math.max(0.5, b - a)));
  const [w, h] = getDims()[file] ?? [1600, 900];
  const ar = w / h;
  const ch = Math.min(head ? 680 : 760, (head ? 1180 : 1260) / ar), cw = ch * ar;
  const href = staticFile(`img/${dir}/${file}.jpg`);
  const inK = back(Math.min(1, Math.max(0, (t - a) / 0.55)));
  const z = lp(1.0, 1.08, k);
  const cx = 960 + (head ? 90 : 0), cy = head ? 590 : 520;
  const x0 = cx - cw / 2, y0 = cy - ch / 2;
  const rk = ring ? rp(t, a + (ring.at ?? 0.9), a + (ring.at ?? 0.9) + 0.6) : 0;
  const circ = ring ? 2 * Math.PI * ring.r : 0;
  const rx = ring ? x0 + ring.x * cw : 0, ry = ring ? y0 + ring.y * ch : 0;
  const nk = ring?.note ? rp(t, a + (ring.at ?? 0.9) + 0.5, a + (ring.at ?? 0.9) + 0.9) : 0;
  const nside = ring?.side ?? (ring && ring.x > 0.5 ? "l" : "r");
  const nx = ring ? (nside === "r" ? Math.min(1880 - 470, rx + ring.r + 90) : Math.max(40, rx - ring.r - 90 - 470)) : 0;
  const ny = ring ? Math.max(120, Math.min(880, ry - 50)) : 0;
  const hk = rp(t, a + 0.3, a + 0.8);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0A0C11" />
      <image href={href} x={-80} y={-60} width={2080} height={1200} preserveAspectRatio="xMidYMid slice" style={{ filter: "blur(30px) brightness(0.35) saturate(0.7)" }} />
      <g transform={`translate(${cx},${cy}) scale(${z * lp(0.86, 1, inK)}) rotate(${tilt * (1 - k * 0.4)}) translate(${-cx},${-cy})`} opacity={Math.min(1, inK * 1.4)}>
        <rect x={x0 - 18} y={y0 - 18} width={cw + 36} height={ch + 70} fill="#000" opacity={0.35} transform="translate(14,18)" />
        <rect x={x0 - 18} y={y0 - 18} width={cw + 36} height={ch + 70} fill="#F2EEE6" />
        <image href={href} x={x0} y={y0} width={cw} height={ch} preserveAspectRatio="xMidYMid slice" />
        <rect x={cx - 90} y={y0 - 40} width={180} height={46} fill="#E9DFAE" opacity={0.8} transform={`rotate(-3,${cx},${y0 - 17})`} />
        {T(x0, y0 + ch + 38, `Görsel: ${src}`, 22, "#3A3F48", 600, "start")}
        {date && T(x0 + cw, y0 + ch + 38, date, 22, "#8A1C1C", 800, "end")}
        {ring && (
          <g>
            <circle cx={rx} cy={ry} r={ring.r} fill="none" stroke="#E63B2E" strokeWidth={9} strokeLinecap="round"
              strokeDasharray={circ} strokeDashoffset={circ * (1 - rk)} transform={`rotate(-80,${rx},${ry})`} />
            {rk > 0.98 && <circle cx={rx} cy={ry} r={ring.r + 10 + ((t * 30) % 20)} fill="none" stroke="#E63B2E" strokeWidth={3} opacity={0.5 - ((t * 30) % 20) / 40} />}
          </g>
        )}
      </g>
      {ring?.note && (
        <g opacity={nk} transform={`translate(${(1 - nk) * (nside === "r" ? 30 : -30)},0)`}>
          <line x1={nside === "r" ? nx : nx + 470} y1={ny + 45} x2={rx + (nside === "r" ? ring.r : -ring.r)} y2={ry} stroke="#E63B2E" strokeWidth={5} />
          <rect x={nx} y={ny} width={470} height={90} rx={8} fill="#E63B2E" />
          {T(nx + 235, ny + 58, ring.note, 36, "#FFF", 800, "middle")}
        </g>
      )}
      {head && (
        <g opacity={hk} transform={`translate(${(1 - hk) * -40},0)`}>
          <rect x={60} y={80} width={8} height={sub ? 120 : 70} fill="#E63B2E" />
          {T(90, 130, head, 50, "#FFF", 900, "start")}
          {sub && T(90, 186, sub, 32, "#F2C14E", 700, "start")}
        </g>
      )}
      {emo.map((m, i) => <Emo key={i} t={t} at={a + (m.dt ?? 1.2 + i * 0.35)} e={m.e} x={m.x} y={m.y} s={m.s ?? 120} />)}
    </g>
  );
};

// تدفّق إيموجي: فلوس بتطلع من مجموعة لمجموعة (البونزي، الكوبونات، قبرص…)
export const EmoFlow: React.FC<{
  t: number; a: number; b: number; from: { e: string; n: number; label: string }; to: { e: string; n?: number; label: string };
  token?: string; mid?: { e: string; label: string }; title?: string; back?: boolean; leak?: string;
}> = ({ t, a, b, from, to, token = "para", mid, title, back: ret = false, leak }) => {
  const dur = Math.max(1, b - a);
  const L = 330, Rx = 1590, M = 960, Y = 560;
  const tk = rp(t, a + 0.2, a + 0.7);
  const flowY = (p: number, x0: number, x1: number) => ({ x: lp(x0, x1, p), y: Y - Math.sin(p * Math.PI) * 140 });
  const tokens = [] as React.ReactNode[];
  const N = 14;
  for (let i = 0; i < N; i++) {
    const st = a + 1.0 + (i / N) * Math.max(1.5, dur - 2.5);
    const p = (t - st) / 1.3;
    if (p < 0 || p > 1) continue;
    const toMid = !!mid;
    const seg = toMid ? (p < 0.5 ? flowY(p * 2, L + 90, M - 90) : flowY((p - 0.5) * 2, M + 90, Rx - 90)) : flowY(p, L + 90, Rx - 90);
    const isLeak = leak && i % 3 === 2 && p > 0.5;
    const yy = isLeak ? seg.y + (p - 0.5) * 520 : seg.y;
    tokens.push(<image key={i} href={emSrc(token)} x={seg.x - 32} y={yy - 32} width={64} height={64} opacity={Math.min(1, (1 - p) * 4)} />);
  }
  if (ret) for (let i = 0; i < 6; i++) {
    const st = a + 2.2 + (i / 6) * Math.max(1.2, dur - 3);
    const p = (t - st) / 1.4;
    if (p < 0 || p > 1) continue;
    const s = { x: lp(Rx - 90, L + 90, p), y: Y + 40 + Math.sin(p * Math.PI) * 150 };
    tokens.push(<image key={"r" + i} href={emSrc(token)} x={s.x - 22} y={s.y - 22} width={44} height={44} opacity={0.85} />);
  }
  const crowd = (cx: number, e: string, n: number) => {
    const out = [] as React.ReactNode[];
    const cols = Math.min(4, n), rows = Math.ceil(n / cols);
    for (let i = 0; i < n; i++) {
      const c = i % cols, r = Math.floor(i / cols);
      out.push(<Emo key={i} t={t} at={a + 0.15 + i * 0.05} e={e} x={cx + (c - (cols - 1) / 2) * 96} y={Y + (r - (rows - 1) / 2) * 100} s={n > 1 ? 88 : 190} />);
    }
    return out;
  };
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0E14" />
      <radialGradient id="efG" cx="0.5" cy="0.5" r="0.6"><stop offset="0" stopColor="#1C2533" /><stop offset="1" stopColor="#0B0E14" /></radialGradient>
      <rect width={1920} height={1080} fill="url(#efG)" />
      {title && <g opacity={tk}>{T(960, 140, title, 54, "#FFF", 900, "middle")}</g>}
      {crowd(L, from.e, from.n)}
      {crowd(Rx, to.e, to.n ?? 1)}
      {mid && <Emo t={t} at={a + 0.5} e={mid.e} x={M} y={Y} s={200} />}
      {tokens}
      <g opacity={tk}>
        {T(L, 860, from.label, 38, "#F2C14E", 800, "middle")}
        {T(Rx, 860, to.label, 38, "#F2C14E", 800, "middle")}
        {mid && T(M, 860, mid.label, 38, "#FFF", 800, "middle")}
        {leak && T(M, 1010, leak, 34, "#E63B2E", 800, "middle")}
      </g>
    </g>
  );
};

// عدّاد كبير بإيموجي: «🐄 × 250»
export const EmoCount: React.FC<{ t: number; a: number; b: number; e: string; n: number; pre?: string; suf?: string; label: string; sub?: string; grid?: number }> = ({ t, a, b, e, n, pre = "", suf = "", label, sub, grid = 0 }) => {
  const k = rp(t, a + 0.3, Math.min(b - 0.3, a + 2.2));
  const v = Math.round(n * k);
  const s = v.toLocaleString("tr-TR");
  const cells = [] as React.ReactNode[];
  for (let i = 0; i < grid; i++) {
    const c = i % 12, r = Math.floor(i / 12);
    cells.push(<Emo key={i} t={t} at={a + 0.4 + i * (1.6 / Math.max(1, grid))} e={e} x={420 + c * 98} y={640 + r * 96} s={78} float={false} />);
  }
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0E14" />
      <Emo t={t} at={a + 0.1} e={e} x={grid ? 300 : 620} y={grid ? 300 : 470} s={grid ? 200 : 300} />
      <g opacity={rp(t, a + 0.2, a + 0.6)}>
        {T(grid ? 470 : 820, grid ? 330 : 520, `${pre}${s}${suf}`, grid ? 130 : 170, "#F2C14E", 900, "start")}
        {T(grid ? 470 : 820, grid ? 410 : 610, label, 46, "#FFF", 800, "start")}
        {sub && T(grid ? 470 : 820, grid ? 465 : 670, sub, 32, "#AEB6C2", 600, "start")}
      </g>
      {cells}
    </g>
  );
};

// قائمة خطوات بإيموجي (كل سطر بيطلع لحاله، والسطر الحالي مضوّي)
export const EmoSteps: React.FC<{ t: number; a: number; b: number; title?: string; items: { e: string; s: string; x?: boolean }[]; gap?: number }> = ({ t, a, b, title, items, gap }) => {
  const step = gap ?? Math.max(0.6, (b - a - 1) / items.length);
  const y0 = 540 - ((items.length - 1) * 120) / 2 + (title ? 50 : 0);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0E14" />
      {title && <g opacity={rp(t, a + 0.1, a + 0.5)}>{T(960, 130, title, 54, "#FFF", 900, "middle")}</g>}
      {items.map((it, i) => {
        const at = a + 0.4 + i * step;
        const k = rp(t, at, at + 0.4);
        const cur = t >= at && t < at + step;
        return (
          <g key={i} opacity={k * (cur || i === items.length - 1 && t >= at ? 1 : 0.55)} transform={`translate(${(1 - k) * 40},0)`}>
            <rect x={380} y={y0 + i * 120 - 52} width={1160} height={100} rx={12} fill={cur ? "#1F2A3A" : "#141A24"} stroke={cur ? "#F2C14E" : "none"} strokeWidth={3} />
            <Emo t={t} at={at} e={it.e} x={450} y={y0 + i * 120 - 2} s={74} float={false} />
            {T(520, y0 + i * 120 + 14, it.s, 42, it.x ? "#E86A5E" : "#FFF", 800, "start", it.x ? { textDecoration: "line-through" } : {})}
          </g>
        );
      })}
    </g>
  );
};
