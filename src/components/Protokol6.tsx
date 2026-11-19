import React from "react";
import { continueRender, delayRender, staticFile } from "remotion";
import { X, T } from "./Protokol";
import { rp } from "./Hayat";
import { GEO, GEO_K, GEO_LON0, GEO_Y0 } from "../lib/geo";

// Protokol X · عدّة 6: بارالاكس عمق حقيقي، خرائط جغرافية حقيقية، لوحة تحقيق، وتعليقات بخط اليد.

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ═════════════ 1) بارالاكس من خريطة العمق (Depth Anything V2 Small) ═════════════
const RW = 1280, RH = 720; // دقة الحساب (بتتمدّد لـ 1920×1080)
type Pack = { rgb: Uint8ClampedArray; dep: Float32Array };
const PACKS = new Map<string, Pack>();
const LOADING = new Map<string, Promise<Pack>>();

const loadImg = (src: string) => new Promise<HTMLImageElement>((res, rej) => { const i = new Image(); i.crossOrigin = "anonymous"; i.onload = () => res(i); i.onerror = () => rej(new Error("img " + src)); i.src = src; });

// رسم "cover" بحجم RW×RH
const coverData = (im: HTMLImageElement, gray: boolean) => {
  const c = document.createElement("canvas"); c.width = RW; c.height = RH;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  const s = Math.max(RW / im.naturalWidth, RH / im.naturalHeight);
  const w = im.naturalWidth * s, h = im.naturalHeight * s;
  g.imageSmoothingQuality = "high";
  g.drawImage(im, (RW - w) / 2, (RH - h) / 2, w, h);
  const d = g.getImageData(0, 0, RW, RH).data;
  if (!gray) return d;
  return d;
};

const loadPack = (file: string): Promise<Pack> => {
  const hit = LOADING.get(file);
  if (hit) return hit;
  const p = (async () => {
    const [ph, dp] = await Promise.all([loadImg(staticFile(`img/k7-02/${file}.jpg`)), loadImg(staticFile(`img/k7-02/depth/${file}.png`))]);
    const rgb = coverData(ph, false);
    const dd = coverData(dp, true);
    // عمق ناعم (طمس صندوقي خفيف) حتى ما تتكسّر الحواف
    const raw = new Float32Array(RW * RH);
    for (let i = 0; i < RW * RH; i++) raw[i] = dd[i * 4] / 255;
    const tmp = new Float32Array(RW * RH), dep = new Float32Array(RW * RH);
    const R = 3;
    for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) { let s = 0, n = 0; for (let k = -R; k <= R; k++) { const xx = x + k; if (xx >= 0 && xx < RW) { s += raw[y * RW + xx]; n++; } } tmp[y * RW + x] = s / n; }
    for (let y = 0; y < RH; y++) for (let x = 0; x < RW; x++) { let s = 0, n = 0; for (let k = -R; k <= R; k++) { const yy = y + k; if (yy >= 0 && yy < RH) { s += tmp[yy * RW + x]; n++; } } dep[y * RW + x] = s / n; }
    const pk = { rgb: new Uint8ClampedArray(rgb), dep };
    PACKS.set(file, pk);
    return pk;
  })();
  LOADING.set(file, p);
  return p;
};

export type WarpP = { file: string; zz: number; cx: number; cy: number; px: number; py: number; amp?: number; focus?: number; filter?: string };
// cx,cy بإحداثيات 1920×1080 (مركز النافذة)، px,py ∈ [-1,1] إزاحة كاميرا البارالاكس
export const Warp: React.FC<WarpP> = ({ file, zz, cx, cy, px, py, amp = 30, focus = 0.45, filter }) => {
  const ref = React.useRef<HTMLCanvasElement>(null);
  const [ready, setReady] = React.useState(PACKS.has(file));
  const [h] = React.useState(() => (PACKS.has(file) ? null : delayRender("depth " + file)));
  React.useEffect(() => {
    if (PACKS.has(file)) { setReady(true); if (h !== null) continueRender(h); return; }
    loadPack(file).then(() => { setReady(true); if (h !== null) continueRender(h); }).catch(() => { if (h !== null) continueRender(h); });
  }, [file, h]);
  React.useLayoutEffect(() => {
    const pk = PACKS.get(file);
    const cv = ref.current;
    if (!pk || !cv) return;
    const g = cv.getContext("2d")!;
    const out = g.createImageData(RW, RH);
    const o = out.data, src = pk.rgb, dep = pk.dep;
    const k = RW / 1920;
    const sc = 1 / zz;
    const ox = cx * k, oy = cy * k;
    const ax = px * amp * k, ay = py * amp * k * 0.6;
    for (let y = 0; y < RH; y++) {
      const wy = oy + (y - RH / 2) * sc;
      for (let x = 0; x < RW; x++) {
        const wx = ox + (x - RW / 2) * sc;
        // موقع تقريبي، ثم تصحيح بالعمق (نقطة وحدة تكفي مع عمق ناعم)
        const ix0 = clamp(Math.round(wx), 0, RW - 1), iy0 = clamp(Math.round(wy), 0, RH - 1);
        const d = dep[iy0 * RW + ix0] - focus;
        const sx = clamp(wx - ax * d, 0, RW - 1.001), sy = clamp(wy - ay * d, 0, RH - 1.001);
        const x0 = sx | 0, y0 = sy | 0, fx = sx - x0, fy = sy - y0;
        const i00 = (y0 * RW + x0) * 4, i10 = i00 + 4, i01 = i00 + RW * 4, i11 = i01 + 4;
        const w00 = (1 - fx) * (1 - fy), w10 = fx * (1 - fy), w01 = (1 - fx) * fy, w11 = fx * fy;
        const oi = (y * RW + x) * 4;
        o[oi] = src[i00] * w00 + src[i10] * w10 + src[i01] * w01 + src[i11] * w11;
        o[oi + 1] = src[i00 + 1] * w00 + src[i10 + 1] * w10 + src[i01 + 1] * w01 + src[i11 + 1] * w11;
        o[oi + 2] = src[i00 + 2] * w00 + src[i10 + 2] * w10 + src[i01 + 2] * w01 + src[i11 + 2] * w11;
        o[oi + 3] = 255;
      }
    }
    g.putImageData(out, 0, 0);
  }, [ready, file, zz, cx, cy, px, py, amp, focus]);
  return (
    <foreignObject x={0} y={0} width={1920} height={1080}>
      <canvas ref={ref} width={RW} height={RH} style={{ width: 1920, height: 1080, display: "block", filter }} />
    </foreignObject>
  );
};

// ═════════════ 2) خريطة جغرافية حقيقية (Natural Earth) ═════════════
export const geoXY = (lon: number, lat: number): [number, number] => [(lon - GEO_LON0) * GEO_K, (GEO_Y0 - Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360))) * GEO_K * (180 / Math.PI)];

export type MapPin = { lon: number; lat: number; label?: string; file?: string; fx?: number; fy?: number; at?: number; c?: string; r?: number; side?: "r" | "l" | "t" | "b" };
export type MapRoute = { a: [number, number]; b: [number, number]; at: number; dur?: number; c?: string; bend?: number };
export type GeoView = { lon: number; lat: number; w: number }; // w = عرض الرؤية بالدرجات
export type GeoMapP = {
  t: number; a: number; b: number; v0: GeoView; v1?: GeoView; hi?: string[]; hi2?: string[];
  pins?: MapPin[]; routes?: MapRoute[]; yr?: string; place?: string; labels?: boolean;
  dims?: Record<string, [number, number]>;
};
const SEA_A = "#0A222B", SEA_B = "#12414B";

export const GeoMap: React.FC<GeoMapP> = ({ t, a, b, v0, v1 = v0, hi = ["TUR"], hi2 = [], pins = [], routes = [], yr, place }) => {
  const k = clamp((t - a) / Math.max(0.5, b - a), 0, 1);
  const ek = k * k * (3 - 2 * k);
  const lon = lerp(v0.lon, v1.lon, ek), lat = lerp(v0.lat, v1.lat, ek), wdeg = lerp(v0.w, v1.w, ek);
  const s = 1920 / (wdeg * GEO_K);
  const [cx, cy] = geoXY(lon, lat);
  const px = (n: number) => n / s; // أبعاد بالبكسل مقابل الشاشة
  const grat: React.ReactNode[] = [];
  for (let lg = -10; lg <= 70; lg += 10) { const [x] = geoXY(lg, 40); grat.push(<line key={"m" + lg} x1={x} x2={x} y1={-4000} y2={9000} stroke="#2A7A8A" strokeWidth={px(1)} opacity={0.16} />); }
  for (let lt = 20; lt <= 65; lt += 5) { const [, y] = geoXY(10, lt); grat.push(<line key={"p" + lt} y1={y} y2={y} x1={-3000} x2={9000} stroke="#2A7A8A" strokeWidth={px(1)} opacity={0.16} />); }
  return (
    <g>
      <defs>
        <radialGradient id="gSea" cx="0.5" cy="0.45" r="0.8"><stop offset="0" stopColor={SEA_B} /><stop offset="1" stopColor={SEA_A} /></radialGradient>
        <filter id="gGlow"><feGaussianBlur stdDeviation="14" /></filter>
        <radialGradient id="gVig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.62" /></radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="url(#gSea)" />
      <g transform={`translate(960,540) scale(${s}) translate(${-cx},${-cy})`}>
        <g>{grat}</g>
        {Object.entries(GEO).map(([iso, d]) => hi.includes(iso) || hi2.includes(iso) ? null : <path key={iso} d={d} fill="#183F4B" stroke="#2F7D8C" strokeWidth={px(1.2)} strokeLinejoin="round" />)}
        {hi2.map((iso) => GEO[iso] && <path key={iso} d={GEO[iso]} fill="#24606C" stroke="#5FC3CF" strokeWidth={px(1.6)} strokeLinejoin="round" />)}
        {hi.map((iso) => GEO[iso] && <g key={iso}><path d={GEO[iso]} fill="#FFB21E" opacity={0.35} filter="url(#gGlow)" /><path d={GEO[iso]} fill="#2B8C98" stroke="#BDF3F8" strokeWidth={px(2.2)} strokeLinejoin="round" /></g>)}
        {routes.map((r, i) => {
          const q = rp(t, r.at, r.at + (r.dur ?? 1.6));
          if (q <= 0) return null;
          const [x1, y1] = geoXY(...r.a), [x2, y2] = geoXY(...r.b);
          const mx = (x1 + x2) / 2, my = (y1 + y2) / 2, dx = x2 - x1, dy = y2 - y1;
          const bend = r.bend ?? 0.22;
          const qx = mx - dy * bend, qy = my + dx * bend;
          const d = `M${x1},${y1} Q${qx},${qy} ${x2},${y2}`;
          const tt = q, bx = (1 - tt) * (1 - tt) * x1 + 2 * (1 - tt) * tt * qx + tt * tt * x2, by = (1 - tt) * (1 - tt) * y1 + 2 * (1 - tt) * tt * qy + tt * tt * y2;
          const c = r.c ?? X.amber;
          return <g key={i}><path d={d} fill="none" stroke={c} strokeWidth={px(4)} strokeLinecap="round" pathLength={1} strokeDasharray={`${q} 2`} opacity={0.95} /><circle cx={bx} cy={by} r={px(9)} fill="#FFF" /><circle cx={bx} cy={by} r={px(20)} fill={c} opacity={0.35} /></g>;
        })}
        {pins.map((p, i) => {
          const q = rp(t, p.at ?? a + 0.3, (p.at ?? a + 0.3) + 0.5);
          if (q <= 0) return null;
          const [x, y] = geoXY(p.lon, p.lat);
          const c = p.c ?? X.amber;
          const r = px(p.r ?? (p.file ? 46 : 11));
          const pulse = 1 + 0.12 * Math.sin((t - a) * 4 + i);
          const side = p.side ?? "r";
          const lx = side === "r" ? r * 1.4 : side === "l" ? -r * 1.4 : 0;
          const ly = side === "t" ? -r * 1.5 : side === "b" ? r * 2.3 : r * 0.35;
          return (
            <g key={i} opacity={q} transform={`translate(${x},${y}) scale(${0.6 + 0.4 * q})`}>
              <circle r={r * 1.9 * pulse} fill={c} opacity={0.18} />
              {p.file ? <>
                <circle r={r * 1.12} fill="#FFF" /><circle r={r * 1.22} fill="none" stroke={c} strokeWidth={px(4)} />
                <clipPath id={`mp${i}`}><circle r={r} /></clipPath>
                <image href={staticFile(`img/k7-02/${p.file}.jpg`)} x={-r * 1.6 + (0.5 - (p.fx ?? 0.5)) * r * 1.2} y={-r * 1.6 + (0.5 - (p.fy ?? 0.35)) * r * 1.2} width={r * 3.2} height={r * 3.2} preserveAspectRatio="xMidYMid slice" clipPath={`url(#mp${i})`} style={{ filter: "grayscale(0.85) contrast(1.1)" }} />
              </> : <><circle r={r} fill={c} /><circle r={r * 2} fill="none" stroke={c} strokeWidth={px(3)} opacity={0.6} /></>}
              {p.label && <text x={lx} y={ly} textAnchor={side === "l" ? "end" : side === "r" ? "start" : "middle"} fontFamily="Poppins, Inter, sans-serif" fontWeight={700} fontSize={px(34)} fill="#FFF" stroke="#06161B" strokeWidth={px(6)} paintOrder="stroke">{p.label}</text>}
            </g>
          );
        })}
      </g>
      <rect width={1920} height={1080} fill="url(#gVig)" />
      {(yr || place) && <g opacity={rp(t, a + 0.2, a + 0.7)}>
        <rect x={90} y={80} width={Math.max(260, (place?.length ?? 0) * 22 + 120)} height={place ? 112 : 70} rx={8} fill="#04141A" opacity={0.82} />
        {yr && <><path d="M116,112 l18,11 l-18,11z" fill={X.amber} />{T(150, 138, yr, 44, "#FFF", 700)}</>}
        {place && T(116, 178, place, 28, "#9ADCE6", 600, "start", { letterSpacing: 3 } as React.SVGProps<SVGTextElement>)}
      </g>}
    </g>
  );
};

// ═════════════ 3) تعليقات بخط اليد (دائرة، سهم، خط تحت، تغطية) ═════════════
export const Circ: React.FC<{ t: number; at: number; x: number; y: number; rx: number; ry?: number; c?: string; w?: number }> = ({ t, at, x, y, rx, ry, c = X.red, w = 8 }) => {
  const q = rp(t, at, at + 0.7);
  if (q <= 0) return null;
  const r2 = ry ?? rx;
  const d = `M${x - rx},${y} C${x - rx},${y - r2 * 1.35} ${x + rx},${y - r2 * 1.35} ${x + rx},${y} C${x + rx},${y + r2 * 1.35} ${x - rx * 0.9},${y + r2 * 1.35} ${x - rx * 0.98},${y - r2 * 0.1}`;
  return <path d={d} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={`${q} 2`} style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,.6))" }} />;
};
export const Arrow: React.FC<{ t: number; at: number; x1: number; y1: number; x2: number; y2: number; c?: string; w?: number }> = ({ t, at, x1, y1, x2, y2, c = X.amber, w = 9 }) => {
  const q = rp(t, at, at + 0.6);
  if (q <= 0) return null;
  const ang = Math.atan2(y2 - y1, x2 - x1), hl = 36;
  const mx = (x1 + x2) / 2 + (y2 - y1) * 0.12, my = (y1 + y2) / 2 - (x2 - x1) * 0.12;
  return (
    <g style={{ filter: "drop-shadow(0 3px 6px rgba(0,0,0,.6))" }}>
      <path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" pathLength={1} strokeDasharray={`${q} 2`} />
      {q > 0.95 && <path d={`M${x2},${y2} l${-hl * Math.cos(ang - 0.45)},${-hl * Math.sin(ang - 0.45)} M${x2},${y2} l${-hl * Math.cos(ang + 0.45)},${-hl * Math.sin(ang + 0.45)}`} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" />}
    </g>
  );
};
export const Under: React.FC<{ t: number; at: number; x: number; y: number; w: number; c?: string }> = ({ t, at, x, y, w, c = X.amber }) => {
  const q = rp(t, at, at + 0.5);
  if (q <= 0) return null;
  return <path d={`M${x},${y} q${w * 0.25},-9 ${w * 0.5},0 t${w * 0.5},-3`} fill="none" stroke={c} strokeWidth={7} strokeLinecap="round" pathLength={1} strokeDasharray={`${q} 2`} />;
};
// أسطر مطموسة (redaction) بتتكشف
export const Redact: React.FC<{ t: number; at: number; x: number; y: number; w: number; h?: number; n?: number }> = ({ t, at, x, y, w, h = 30, n = 3 }) => (
  <g>{Array.from({ length: n }, (_, i) => { const q = rp(t, at + i * 0.25, at + i * 0.25 + 0.4); return <rect key={i} x={x} y={y + i * (h + 14)} width={w * q * (0.7 + ((i * 37) % 30) / 100)} height={h} fill="#050505" />; })}</g>
);

// ═════════════ 4) لوحة التحقيق: «قاعدة البيت» ═════════════
export type BoardItem = { id: string; file?: string; text?: string; sub?: string; x: number; y: number; rot?: number; w?: number; at: number; kind?: "photo" | "note" | "doc"; fx?: number; fy?: number; c?: string };
export type BoardString = [string, string];
export const Board: React.FC<{ t: number; a: number; b: number; items: BoardItem[]; strings?: BoardString[]; focus: { id: string; z?: number }; focus1?: { id: string; z?: number }; dims: Record<string, [number, number]> }> = ({ t, a, b, items, strings = [], focus, focus1, dims }) => {
  const k = clamp((t - a) / Math.max(0.5, b - a), 0, 1);
  const ek = k * k * (3 - 2 * k);
  const f0 = items.find((i) => i.id === focus.id) ?? items[0];
  const f1 = items.find((i) => i.id === (focus1?.id ?? focus.id)) ?? f0;
  const z0 = focus.z ?? 1.6, z1 = focus1?.z ?? focus.z ?? 1.6;
  const z = lerp(z0, z1, ek) * (1 + 0.04 * k);
  const cx = lerp(f0.x, f1.x, ek), cy = lerp(f0.y, f1.y, ek);
  const vis = (it: BoardItem) => rp(t, it.at, it.at + 0.5);
  const cardW = (it: BoardItem) => it.w ?? 300;
  const cardH = (it: BoardItem) => {
    if (it.kind === "note") return 150;
    const [w, h] = it.file ? dims[it.file] ?? [4, 3] : [4, 3];
    return Math.round(((cardW(it) - 28) * h) / w) + 28 + 62;
  };
  return (
    <g>
      <defs>
        <pattern id="bCork" width="120" height="120" patternUnits="userSpaceOnUse">
          <rect width="120" height="120" fill="#2B1F17" />
          {Array.from({ length: 36 }, (_, i) => <circle key={i} cx={(i * 53) % 120} cy={(i * 79) % 120} r={1 + (i % 3)} fill={i % 2 ? "#3A2A1E" : "#1F1611"} opacity={0.8} />)}
        </pattern>
        <radialGradient id="bLamp" cx="0.5" cy="0.4" r="0.7"><stop offset="0" stopColor="#FFC567" stopOpacity="0.30" /><stop offset="1" stopColor="#000" stopOpacity="0.7" /></radialGradient>
      </defs>
      <rect width={1920} height={1080} fill="#150F0B" />
      <g transform={`translate(960,540) scale(${z}) translate(${-cx},${-cy})`}>
        <rect x={-2200} y={-1500} width={5200} height={3600} fill="url(#bCork)" />
        {strings.map(([p, q], i) => {
          const A = items.find((x) => x.id === p), B = items.find((x) => x.id === q);
          if (!A || !B) return null;
          const v = Math.min(vis(A), vis(B));
          if (v <= 0) return null;
          const sag = 40;
          return <path key={i} d={`M${A.x},${A.y - cardH(A) / 2 + 14} Q${(A.x + B.x) / 2},${(A.y + B.y) / 2 + sag} ${B.x},${B.y - cardH(B) / 2 + 14}`} fill="none" stroke="#C4252B" strokeWidth={5} opacity={v} strokeLinecap="round" />;
        })}
        {items.map((it) => {
          const v = vis(it);
          if (v <= 0) return null;
          const w = cardW(it), h = cardH(it);
          const rot = it.rot ?? 0;
          return (
            <g key={it.id} transform={`translate(${it.x},${it.y + (1 - v) * -40}) rotate(${rot})`} opacity={v}>
              <rect x={-w / 2 + 8} y={-h / 2 + 12} width={w} height={h} fill="#000" opacity={0.5} />
              {it.kind === "note" ? <>
                <rect x={-w / 2} y={-h / 2} width={w} height={h} fill={it.c ?? "#F4E27A"} />
                <text x={0} y={-8} textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight={700} fontSize={36} fill="#2A2200">{it.text}</text>
                {it.sub && <text x={0} y={36} textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight={500} fontSize={24} fill="#5A4A00">{it.sub}</text>}
              </> : <>
                <rect x={-w / 2} y={-h / 2} width={w} height={h} fill="#F3EEE4" />
                <clipPath id={`bc${it.id}`}><rect x={-w / 2 + 14} y={-h / 2 + 14} width={w - 28} height={h - 28 - 62} /></clipPath>
                {it.file && (() => {
                  const [iw, ih] = dims[it.file] ?? [4, 3];
                  const bw = w - 28, bh = h - 28 - 62;
                  const sc = Math.max(bw / iw, bh / ih);
                  const ox = -(iw * sc - bw) * (it.fx ?? 0.5), oy = -(ih * sc - bh) * (it.fy ?? 0.35);
                  return <image href={staticFile(`img/k7-02/${it.file}.jpg`)} x={-w / 2 + 14 + ox} y={-h / 2 + 14 + oy} width={iw * sc} height={ih * sc} clipPath={`url(#bc${it.id})`} style={{ filter: "grayscale(0.85) sepia(0.2) contrast(1.08)" }} />;
                })()}
                {it.text && <text x={0} y={h / 2 - 28} textAnchor="middle" fontFamily="Poppins, sans-serif" fontWeight={700} fontSize={30} fill="#1B1B1B">{it.text}</text>}
              </>}
              <circle cx={0} cy={-h / 2 + 14} r={11} fill="#C4252B" stroke="#7A1217" strokeWidth={3} />
            </g>
          );
        })}
      </g>
      <rect width={1920} height={1080} fill="url(#bLamp)" />
    </g>
  );
};
