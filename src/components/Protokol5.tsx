import React from "react";
import { staticFile } from "remotion";
import { X, T } from "./Protokol";
import { rp } from "./Hayat";
import { Warp } from "./Protokol6";

// Protokol X · عدّة «وثائقي بالصور الحقيقية» (k7-02 v2)
// كل لقطة = صورة حقيقية (Wikimedia Commons، ترخيص حر) بحركة كاميرا بطيئة + شريط عنوان + شريط سنة،
// وبطاقات المعلومات بتنرسم فوق صورة معتّمة. بلا ومضات، وبلا وميض عند القطع.

export type Dims = Record<string, [number, number]>;
let DIMS: Dims = {};
export const setDims = (d: Dims) => { DIMS = d; };
let DEPTHS = new Set<string>();
export const setDepths = (l: string[]) => { DEPTHS = new Set(l); };
export type Par = "l" | "r" | "u" | "d" | "in" | "out";

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export type Grade = "bw" | "warm" | "cool" | "none";
const FILT: Record<Grade, string> = {
  bw: "grayscale(0.85) sepia(0.22) contrast(1.1) brightness(0.96)",
  warm: "saturate(0.7) sepia(0.18) contrast(1.06) brightness(0.96)",
  cool: "saturate(0.6) contrast(1.08) brightness(0.92) hue-rotate(-6deg)",
  none: "none",
};

export type PhP = {
  t: number; a: number; b: number; file: string;
  z?: [number, number];            // zoom من → إلى
  f?: [number, number, number, number]; // نقطة التركيز 0..1 (x0,y0,x1,y1)
  grade?: Grade; mode?: "auto" | "cover" | "card";
  cap?: string; sub?: string; yr?: string; credit?: string;
  blur?: number; dim?: number; fade?: number; capAt?: number; par?: Par;
  children?: React.ReactNode;
};

// صورة بحركة كاميرا
export const Ph: React.FC<PhP> = ({ t, a, b, file, z = [1.04, 1.16], f = [0.5, 0.5, 0.5, 0.5], grade = "bw", mode = "auto", cap, sub, yr, credit, blur = 0, dim = 0, fade = 0.22, capAt = 0.35, par, children }) => {
  const k = clamp((t - a) / Math.max(0.5, b - a), 0, 1);
  const zz = lerp(z[0], z[1], k);
  const fx = lerp(f[0], f[2], k), fy = lerp(f[1], f[3], k);
  const [w, h] = DIMS[file] ?? [1920, 1080];
  const ar = w / h;
  const card = mode === "card" || (mode === "auto" && ar < 1.32);
  const src = staticFile(`img/k7-02/${file}.jpg`);
  const filter = FILT[grade] + (blur ? ` blur(${blur}px)` : "");
  const cx = clamp(fx * 1920, 960 / zz, 1920 - 960 / zz), cy = clamp(fy * 1080, 540 / zz, 1080 - 540 / zz);
  const inF = rp(t, a, a + fade);
  let body: React.ReactNode;
  if (card) {
    const ch = 880, cw = Math.min(1500, ch * ar);
    body = (
      <g>
        <image href={src} x={-60} y={-40} width={2040} height={1160} preserveAspectRatio="xMidYMid slice" style={{ filter: `${FILT[grade]} blur(26px) brightness(0.45)` }} />
        <g transform={`translate(960,540) scale(${lerp(1.0, 1.07, k)}) translate(-960,-540)`}>
          <rect x={960 - cw / 2 - 14} y={540 - ch / 2 - 14} width={cw + 28} height={ch + 28} fill="#F3EEE4" />
          <image href={src} x={960 - cw / 2} y={540 - ch / 2} width={cw} height={ch} preserveAspectRatio="xMidYMid slice" style={{ filter: FILT[grade] === "none" ? "none" : FILT[grade] }} />
        </g>
      </g>
    );
  } else {
    if (par && DEPTHS.has(file) && !blur) {
      const sx = par === "l" ? lerp(1, -1, k) : par === "r" ? lerp(-1, 1, k) : 0;
      const sy = par === "u" ? lerp(1, -1, k) : par === "d" ? lerp(-1, 1, k) : 0;
      const zk = par === "in" ? lerp(1.0, 1.0, k) : 1;
      body = <Warp file={file} zz={zz * zk} cx={cx} cy={cy} px={sx * 0.9 + (par === "in" ? lerp(-0.5, 0.5, k) : par === "out" ? lerp(0.5, -0.5, k) : 0)} py={sy * 0.9} filter={FILT[grade] === "none" ? undefined : FILT[grade]} />;
    } else {
      body = (
        <g transform={`translate(960,540) scale(${zz}) translate(${-cx},${-cy})`}>
          <image href={src} x={0} y={0} width={1920} height={1080} preserveAspectRatio="xMidYMid slice" style={{ filter }} />
        </g>
      );
    }
  }
  return (
    <g opacity={inF}>
      <defs>
        <linearGradient id="k5shade" x1="0" y1="0" x2="0" y2="1"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.78" /></linearGradient>
        <linearGradient id="k5top" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0.5" /><stop offset="0.25" stopColor="#000" stopOpacity="0" /></linearGradient>
        <radialGradient id="k5leak" cx="0.12" cy="0.1" r="0.7"><stop offset="0" stopColor="#FFB21E" stopOpacity="0.20" /><stop offset="1" stopColor="#FFB21E" stopOpacity="0" /></radialGradient>
      </defs>
      {body}
      {dim > 0 && <rect width={1920} height={1080} fill="#05070B" opacity={dim} />}
      <rect width={1920} height={1080} fill="url(#k5leak)" />
      <rect width={1920} height={1080} fill="url(#k5top)" />
      {(cap || yr) && <rect width={1920} height={1080} fill="url(#k5shade)" />}
      {cap && <LowerThird t={t} at={a + capAt} text={cap} sub={sub} />}
      {yr && <YearTag t={t} at={a + capAt} yr={yr} />}
      {credit && <g opacity={0.6}>{T(1880, 1054, credit, 17, "#D6DAE0", 500, "end")}</g>}
      {children}
    </g>
  );
};

export const LowerThird: React.FC<{ t: number; at: number; text: string; sub?: string }> = ({ t, at, text, sub }) => {
  const k = rp(t, at, at + 0.5);
  const w = Math.max(280, text.length * 24 + 60);
  return (
    <g opacity={k} transform={`translate(${(1 - k) * -50},0)`}>
      <rect x={90} y={906} width={6} height={sub ? 104 : 66} fill={X.amber} />
      {T(120, 948, text, 50, "#FFFFFF", 700)}
      {sub && T(120, 996, sub, 30, X.amber, 600)}
      <rect x={90} y={906} width={w} height={0} />
    </g>
  );
};

export const YearTag: React.FC<{ t: number; at: number; yr: string }> = ({ t, at, yr }) => {
  const k = rp(t, at, at + 0.4);
  return (
    <g opacity={k}>
      <path d="M1640,980 l22,13 l-22,13z" fill={X.amber} />
      {T(1880, 1008, yr, 46, "#FFFFFF", 700, "end")}
    </g>
  );
};

// عدّة صور بالتتابع داخل لقطة واحدة (كل ~2.5 ث صورة)، مع تلاشي ناعم
export type SeqItem = Omit<PhP, "t" | "a" | "b">;
export const Seq: React.FC<{ t: number; a: number; b: number; items: SeqItem[]; keepCap?: boolean }> = ({ t, a, b, items, keepCap = false }) => {
  const n = items.length;
  const d = (b - a) / n;
  const out: React.ReactNode[] = [];
  for (let i = 0; i < n; i++) {
    const ia = a + i * d, ib = i === n - 1 ? b + 2 : ia + d + 0.3;
    if (t < ia - 0.01) continue;
    const it = i === 0 || keepCap ? items[i] : { ...items[i] };
    out.push(<Ph key={i} t={t} a={ia} b={ib} {...it} fade={i === 0 ? 0.22 : 0.3} />);
  }
  return <g>{out}</g>;
};

// ───────── بطاقات معلومات فوق صورة معتّمة ─────────
const Back: React.FC<{ t: number; a: number; b: number; file: string; dim?: number; grade?: Grade; f?: PhP["f"]; blur?: number; z?: [number, number] }> = ({ t, a, b, file, dim = 0.62, grade = "bw", f, blur = 4, z = [1.04, 1.12] }) => (
  <Ph t={t} a={a} b={b} file={file} grade={grade} dim={dim} blur={blur} f={f} z={z} mode="cover" fade={0.2} />
);

const wrapTxt = (l: string, n: number): string[] => {
  if (l.length <= n) return [l];
  const w = l.split(" "); const rows: string[] = []; let cur = "";
  for (const x of w) { if ((cur + " " + x).trim().length > n && cur) { rows.push(cur); cur = x; } else cur = (cur + " " + x).trim(); }
  if (cur) rows.push(cur);
  return rows;
};

export const Panel: React.FC<{ t: number; a: number; b: number; bg: string; title: string; lines: string[]; stamp?: string; stampAt?: number; side?: "l" | "r"; tag?: string; c?: string; dim?: number; f?: PhP["f"] }> = ({ t, a, b, bg, title, lines, stamp, stampAt = 1.2, side = "r", tag, c = X.amber, dim, f }) => {
  const x0 = side === "r" ? 1000 : 110;
  const pw = 860;
  const kk = rp(t, a + 0.1, a + 0.6);
  const head = tag ? 112 : 88;
  const titleRows = wrapTxt(title, 26);
  const items = lines.map((l) => wrapTxt(l, 33));
  let acc = 0;
  const ys = items.map((r) => { const y = acc; acc += r.length * 54 + 30; return y; });
  const ph = head + (titleRows.length - 1) * 60 + 40 + acc + 24;
  const y0 = 540 - ph / 2;
  const ty = head + (titleRows.length - 1) * 60 + 40;
  return (
    <g>
      <Back t={t} a={a} b={b} file={bg} dim={dim} f={f} />
      <g opacity={kk} transform={`translate(${(1 - kk) * (side === "r" ? 60 : -60)},0)`}>
        <rect x={x0} y={y0} width={pw} height={ph} rx={10} fill="#07090E" opacity={0.86} />
        <rect x={x0} y={y0} width={8} height={ph} fill={c} />
        {tag && T(x0 + 44, y0 + 54, tag, 28, c, 700, "start", { letterSpacing: 5 } as React.SVGProps<SVGTextElement>)}
        {titleRows.map((tr, i) => <g key={i}>{T(x0 + 44, y0 + head + i * 60, tr, 56, "#FFF", 700)}</g>)}
        {items.map((rows, i) => {
          const q = rp(t, a + 0.5 + i * 0.5, a + 0.95 + i * 0.5);
          return <g key={i} opacity={q} transform={`translate(${(1 - q) * 30},0)`}>
            <circle cx={x0 + 56} cy={y0 + ty + ys[i] + 34 - 15} r={9} fill={c} />
            {rows.map((r, j) => <g key={j}>{T(x0 + 84, y0 + ty + ys[i] + 34 + j * 54, r, 41, "#E8EBF0", 600)}</g>)}
          </g>;
        })}
      </g>
      {stamp && t > a + stampAt && (() => { const q = rp(t, a + stampAt, a + stampAt + 0.25); return (
        <g transform={`translate(${x0 + pw - 210},${y0 + ph - 20}) rotate(-8) scale(${1.5 - 0.5 * q})`} opacity={q}>
          <rect x={-160} y={-64} width={320} height={96} rx={8} fill="none" stroke={X.red} strokeWidth={7} />
          {T(0, 8, stamp, 56, X.red, 700, "middle", { letterSpacing: 4 } as React.SVGProps<SVGTextElement>)}
        </g>); })()}
    </g>
  );
};

export const QuoteCard: React.FC<{ t: number; a: number; b: number; bg: string; q: string; who: string; c?: string; dim?: number }> = ({ t, a, b, bg, q, who, c = X.amber, dim = 0.7 }) => {
  const ls = q.split("\n");
  const y = 540 - (ls.length * 100) / 2;
  return (
    <g>
      <Back t={t} a={a} b={b} file={bg} dim={dim} blur={6} />
      <g opacity={rp(t, a + 0.1, a + 0.5)}>{T(250, y - 30, "“", 240, c, 700)}</g>
      {ls.map((l, i) => <g key={i} opacity={rp(t, a + 0.3 + i * 0.4, a + 0.8 + i * 0.4)}>{T(960, y + 60 + i * 100, l, 64, "#FFF", 700, "middle")}</g>)}
      <g opacity={rp(t, a + 0.9, a + 1.4)}>
        <rect x={860} y={y + 60 + ls.length * 100 - 20} width={200} height={4} fill={c} />
        {T(960, y + 60 + ls.length * 100 + 50, who, 34, c, 600, "middle")}
      </g>
    </g>
  );
};

export const ListCard: React.FC<{ t: number; a: number; b: number; bg: string; title: string; items: string[]; c?: string; dim?: number }> = ({ t, a, b, bg, title, items, c = X.amber, dim = 0.66 }) => (
  <g>
    <Back t={t} a={a} b={b} file={bg} dim={dim} />
    <g opacity={rp(t, a + 0.1, a + 0.5)}>{T(170, 230, title, 60, c, 700)}<rect x={170} y={256} width={160} height={5} fill={c} /></g>
    {items.map((s, i) => {
      const q = rp(t, a + 0.4 + i * 0.5, a + 0.85 + i * 0.5);
      return <g key={i} opacity={q} transform={`translate(${(1 - q) * -40},0)`}>
        <rect x={170} y={330 + i * 130} width={96} height={96} rx={10} fill={c} />
        {T(218, 398 + i * 130, String(i + 1), 56, "#111", 700, "middle")}
        {T(300, 398 + i * 130, s, 54, "#FFF", 700)}
      </g>;
    })}
  </g>
);

export const ChainCard: React.FC<{ t: number; a: number; b: number; bg: string; nodes: string[]; sub?: string[]; c?: string; dim?: number }> = ({ t, a, b, bg, nodes, sub = [], c = X.amber, dim = 0.68 }) => {
  const n = nodes.length;
  const gap = 1700 / n;
  return (
    <g>
      <Back t={t} a={a} b={b} file={bg} dim={dim} />
      {nodes.map((s, i) => {
        const q = rp(t, a + 0.3 + i * 0.55, a + 0.8 + i * 0.55);
        const cx = 110 + gap * i + gap / 2;
        return <g key={i} opacity={q} transform={`translate(0,${(1 - q) * 26})`}>
          <rect x={cx - gap / 2 + 26} y={420} width={gap - 52} height={170} rx={14} fill="#07090E" opacity={0.88} stroke={c} strokeWidth={4} />
          {T(cx, 520, s, Math.min(48, (gap - 80) / (s.length * 0.52)), "#FFF", 700, "middle")}
          {sub[i] && T(cx, 640, sub[i], 30, c, 600, "middle")}
          {i < n - 1 && <g opacity={q}><path d={`M${cx + gap / 2 - 22},505 l34,0 m-14,-14 l14,14 l-14,14`} stroke={c} strokeWidth={6} fill="none" strokeLinecap="round" /></g>}
        </g>;
      })}
    </g>
  );
};

export const BigStat: React.FC<{ t: number; a: number; b: number; bg: string; to: number; label: string; prefix?: string; suffix?: string; c?: string; dim?: number }> = ({ t, a, b, bg, to, label, prefix = "", suffix = "", c = X.amber, dim = 0.7 }) => {
  const k = rp(t, a + 0.3, a + 2.0);
  const v = Math.round(to * k);
  return (
    <g>
      <Back t={t} a={a} b={b} file={bg} dim={dim} />
      {T(960, 560, `${prefix}${v.toLocaleString("tr-TR")}${suffix}`, 210, c, 700, "middle")}
      <g opacity={rp(t, a + 0.8, a + 1.3)}>{T(960, 680, label, 46, "#FFF", 600, "middle")}</g>
    </g>
  );
};

export const ChapterCard: React.FC<{ t: number; a: number; b: number; bg: string; n: string; title: string; sub?: string; f?: PhP["f"] }> = ({ t, a, b, bg, n, title, sub, f }) => {
  const k = rp(t, a + 0.15, a + 0.7);
  return (
    <g>
      <Back t={t} a={a} b={b} file={bg} dim={0.55} f={f} blur={2} />
      <rect width={1920} height={1080} fill="#05070B" opacity={0.28} />
      <g opacity={k} transform={`translate(${(1 - k) * -70},0)`}>
        <rect x={140} y={430} width={8} height={sub ? 250 : 190} fill={X.amber} />
        {T(184, 478, n, 40, X.amber, 700, "start", { letterSpacing: 10 } as React.SVGProps<SVGTextElement>)}
        {T(184, 586, title, 96, "#FFF", 700)}
        {sub && T(184, 666, sub, 42, "#C9CED6", 600)}
      </g>
    </g>
  );
};

export const DateStrip: React.FC<{ t: number; a: number; b: number; bg: string; date: string; place?: string; c?: string; f?: PhP["f"] }> = ({ t, a, b, bg, date, place, c = X.amber, f }) => {
  const k = rp(t, a + 0.15, a + 0.65);
  return (
    <g>
      <Ph t={t} a={a} b={b} file={bg} grade="bw" dim={0.2} f={f} mode="cover" />
      <rect width={1920} height={1080} fill="url(#k5shade)" />
      <g opacity={k} transform={`translate(${(1 - k) * -60},0)`}>
        <rect x={90} y={840} width={10} height={place ? 150 : 100} fill={c} />
        {T(130, 920, date, 88, "#FFF", 700)}
        {place && T(130, 976, place, 34, c, 600, "start", { letterSpacing: 3 } as React.SVGProps<SVGTextElement>)}
      </g>
    </g>
  );
};

// ───────── بطاقة صورة شخصية (شبه بولارويد) على خلفية معتّمة، لشخصين أو تلاثة ─────────
export type Person = { file: string; name: string; role: string; f?: [number, number] };
export const People: React.FC<{ t: number; a: number; b: number; bg: string; people: Person[]; dim?: number }> = ({ t, a, b, bg, people, dim = 0.72 }) => {
  const n = people.length;
  const cw = n === 1 ? 560 : n === 2 ? 520 : 440, chh = cw * 1.2;
  const gap = n === 1 ? 0 : 90;
  const total = n * cw + (n - 1) * gap;
  const x0 = 960 - total / 2;
  return (
    <g>
      <Back t={t} a={a} b={b} file={bg} dim={dim} />
      {people.map((p, i) => {
        const q = rp(t, a + 0.25 + i * 0.5, a + 0.8 + i * 0.5);
        const x = x0 + i * (cw + gap);
        const rot = (i - (n - 1) / 2) * 2.2;
        const [w, h] = DIMS[p.file] ?? [1000, 1200];
        const iw = cw - 30, ih = chh - 30;
        const fx = (p.f?.[0] ?? 0.5), fy = (p.f?.[1] ?? 0.4);
        const sc = Math.max(iw / w, ih / h);
        const ox = -((w * sc - iw) * fx), oy = -((h * sc - ih) * fy);
        const zoom = lerp(1.0, 1.06, clamp((t - a) / (b - a), 0, 1));
        return (
          <g key={i} opacity={q} transform={`translate(${x + cw / 2},${470 + (1 - q) * 60}) rotate(${rot}) scale(${zoom}) translate(${-cw / 2},${-chh / 2})`}>
            <rect x={6} y={10} width={cw} height={chh + 110} fill="#000" opacity={0.45} />
            <rect width={cw} height={chh + 110} fill="#F3EEE4" />
            <clipPath id={`pp${i}`}><rect x={15} y={15} width={iw} height={ih} /></clipPath>
            <g clipPath={`url(#pp${i})`}>
              <image href={staticFile(`img/k7-02/${p.file}.jpg`)} x={15 + ox} y={15 + oy} width={w * sc} height={h * sc} style={{ filter: FILT.bw }} />
            </g>
            {T(cw / 2, chh + 40, p.name, n === 3 ? 38 : 44, "#1A1A1A", 700, "middle")}
            {T(cw / 2, chh + 88, p.role, n === 3 ? 25 : 28, "#7A5A12", 600, "middle")}
          </g>
        );
      })}
    </g>
  );
};

// ───────── لقطة مقارنة: صورة كبيرة + بطاقة صغيرة جنبها (مثلاً الوثيقة بجانب المكان) ─────────
export const Overlay: React.FC<{ t: number; a: number; b: number; bg: string; text: string; sub?: string; c?: string; y?: number; f?: PhP["f"]; z?: [number, number]; yr?: string; credit?: string }> = ({ t, a, b, bg, text, sub, c = "#FFF", y = 140, f, z, yr, credit }) => {
  const k = rp(t, a + 0.3, a + 0.8);
  return (
    <g>
      <Ph t={t} a={a} b={b} file={bg} f={f} z={z} yr={yr} credit={credit} />
      <g opacity={k} transform={`translate(0,${(1 - k) * -20})`}>
        <rect x={960 - Math.max(320, text.length * 24 + 80)} y={y - 62} width={Math.max(640, text.length * 48 + 160)} height={sub ? 142 : 96} rx={14} fill="#07090E" opacity={0.84} />
        {T(960, y + 6, text, 56, c, 700, "middle")}
        {sub && T(960, y + 52, sub, 30, X.amber, 600, "middle")}
      </g>
    </g>
  );
};
