import React from "react";
import { H, HDefs, HAREM_STRIDE } from "./Harem";
import { blinkAt, gait, tri, Walk } from "./Motion";

// Kanal 1 "Pro" kiti (2026-11-08): aynı kimlik (beyaz oval yüz + nokta gözler, İznik çinisi, krem/sıcak renkler)
// ama "daha pahalı": gölge-ışık katmanları, işlemeli kıyafet, gerçekçi başörtüsü, derinlik (bulanık ön/arka plan),
// ışık havuzları, toz zerreleri, film greni. Ölçek HFig ile aynı: s=1 → ayaktan başa ~600 birim.

const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const LN = "#4A3524";
const LW = 3;

export const P = {
  skin: "#FFF9F0", skin2: "#F6E2CF", blush: "#F0A7A0", lip: "#C9636A",
  rose: "#D98E8E", rose2: "#F4DCCB", peach: "#E9B58F", mint: "#9FC3B0", sky: "#A9C6DA",
  crimson: "#8E1F2A", crimson2: "#5E1219", gold: "#D9AE4E", gold2: "#B8892E", pearl: "#F7F2E6",
  brocade: "#C99A3E", brocade2: "#7A1F24", fur: "#8B6A4A", fur2: "#5E4530", turban: "#FBF7EE", turban2: "#E2D9C6",
  night: "#141B36", warm: "#FFD089",
};

// ───────── tanımlar ─────────
export const PDefs: React.FC = () => (
  <defs>
    {/* gövde gölgelendirme: soldan ışık */}
    <linearGradient id="pShadeL" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stopColor="#FFF1D6" stopOpacity="0.32" />
      <stop offset="0.45" stopColor="#FFF1D6" stopOpacity="0" />
      <stop offset="0.7" stopColor="#2A1408" stopOpacity="0.1" />
      <stop offset="1" stopColor="#2A1408" stopOpacity="0.42" />
    </linearGradient>
    <linearGradient id="pShadeR" x1="1" y1="0" x2="0" y2="0">
      <stop offset="0" stopColor="#FFF1D6" stopOpacity="0.32" />
      <stop offset="0.45" stopColor="#FFF1D6" stopOpacity="0" />
      <stop offset="0.7" stopColor="#2A1408" stopOpacity="0.1" />
      <stop offset="1" stopColor="#2A1408" stopOpacity="0.42" />
    </linearGradient>
    <linearGradient id="pDrop" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#000" stopOpacity="0" />
      <stop offset="1" stopColor="#2A1408" stopOpacity="0.28" />
    </linearGradient>
    <radialGradient id="pFace" cx="0.42" cy="0.38" r="0.7">
      <stop offset="0" stopColor="#FFFFFF" />
      <stop offset="0.7" stopColor={P.skin} />
      <stop offset="1" stopColor={P.skin2} />
    </radialGradient>
    <radialGradient id="pContact" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#1E0E04" stopOpacity="0.45" />
      <stop offset="1" stopColor="#1E0E04" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="pPool" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFC870" stopOpacity="0.85" />
      <stop offset="0.45" stopColor="#FFB060" stopOpacity="0.32" />
      <stop offset="1" stopColor="#FFB060" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="pHole" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#000" stopOpacity="1" />
      <stop offset="1" stopColor="#000" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="pBloom" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFF6DC" stopOpacity="0.9" />
      <stop offset="1" stopColor="#FFF6DC" stopOpacity="0" />
    </radialGradient>
    <radialGradient id="pVig" cx="0.5" cy="0.5" r="0.78">
      <stop offset="0.55" stopColor="#2A1606" stopOpacity="0" />
      <stop offset="1" stopColor="#1A0C02" stopOpacity="0.55" />
    </radialGradient>
    <linearGradient id="pVeil" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFFFFF" stopOpacity="0.85" />
      <stop offset="1" stopColor="#FFFFFF" stopOpacity="0.35" />
    </linearGradient>
    <linearGradient id="pWater" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#8FC3D8" />
      <stop offset="1" stopColor="#3E7FA0" />
    </linearGradient>
    <linearGradient id="pDaySky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#8EC1E3" />
      <stop offset="0.7" stopColor="#E8F1EE" />
      <stop offset="1" stopColor="#F7E6C4" />
    </linearGradient>
    <linearGradient id="pNightSky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#0E1530" />
      <stop offset="1" stopColor="#2C3B6E" />
    </linearGradient>
    {/* küçük çiçek işleme (entari) */}
    <pattern id="pFlower" width="34" height="34" patternUnits="userSpaceOnUse">
      <circle cx="17" cy="17" r="3.2" fill={P.gold} />
      {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="17" cy="11" rx="2.6" ry="4.4" fill="#FFFFFF" opacity="0.7" transform={`rotate(${a},17,17)`} />)}
      <circle cx="0" cy="0" r="1.6" fill={P.gold} opacity="0.7" /><circle cx="34" cy="34" r="1.6" fill={P.gold} opacity="0.7" />
    </pattern>
    {/* brokar (şehzade/valide): çintemani + lale */}
    <pattern id="pBrocade" width="56" height="56" patternUnits="userSpaceOnUse">
      <circle cx="14" cy="14" r="5" fill={P.gold} opacity="0.85" /><circle cx="26" cy="14" r="5" fill={P.gold} opacity="0.85" /><circle cx="20" cy="24" r="5" fill={P.gold} opacity="0.85" />
      <path d="M42,34 C48,40 48,48 42,52 C36,48 36,40 42,34Z M38,36 q-6,4 -2,12 M46,36 q6,4 2,12" fill={P.gold} opacity="0.75" />
      <path d="M2,40 q6,-4 12,0 M30,6 q6,-4 12,0" stroke={P.gold} strokeWidth="2" fill="none" opacity="0.6" />
    </pattern>
    {/* kenar işlemesi (etek/kol bandı) */}
    <pattern id="pBand" width="28" height="22" patternUnits="userSpaceOnUse">
      <rect width="28" height="22" fill={P.gold} />
      <path d="M14,3 C20,9 20,13 14,19 C8,13 8,9 14,3Z" fill={P.crimson} />
      <circle cx="0" cy="11" r="3" fill="#2B5DA8" /><circle cx="28" cy="11" r="3" fill="#2B5DA8" />
    </pattern>
    <pattern id="pFurTex" width="12" height="12" patternUnits="userSpaceOnUse">
      <rect width="12" height="12" fill={P.fur} />
      <path d="M2,10 l3,-8 M7,11 l2,-7 M10,9 l1,-5" stroke={P.fur2} strokeWidth="1.6" />
    </pattern>
    <filter id="pBlur3" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="3" /></filter>
    <filter id="pBlur8" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="8" /></filter>
    <filter id="pBlur16" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="16" /></filter>
    <filter id="pGrain" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="3" />
      <feColorMatrix values="0 0 0 0 0.5  0 0 0 0 0.4  0 0 0 0 0.3  0 0 0 0.55 0" />
    </filter>
  </defs>
);

// tam ekran çerçeve: eski desenler (HDefs) + yeni (PDefs), üstte vinyet + film greni
export const PFrame: React.FC<{ children: React.ReactNode; grain?: number; bg?: string }> = ({ children, grain = 0.06, bg = H.plaster }) => (
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0, background: bg }}>
    <HDefs />
    <PDefs />
    {children}
    <rect width="1920" height="1080" fill="url(#pVig)" pointerEvents="none" />
    {grain > 0 && <rect width="1920" height="1080" filter="url(#pGrain)" opacity={grain} pointerEvents="none" />}
  </svg>
);

// kamera (yumuşak zoom + odak kaydırma)
export const PCam: React.FC<{ t: number; a: number; b: number; z?: [number, number]; c0?: [number, number]; c1?: [number, number]; children: React.ReactNode }> = ({ t, a, b, z = [1, 1.06], c0 = [960, 540], c1, children }) => {
  const k = ease((t - a) / Math.max(0.01, b - a));
  const zz = lerp(z[0], z[1], k);
  const e = c1 ?? c0;
  const cx = lerp(c0[0], e[0], k), cy = lerp(c0[1], e[1], k);
  return <g transform={`translate(960,540) scale(${zz}) translate(${-cx},${-cy})`}>{children}</g>;
};

// ───────── nesneler ─────────
// fincan + altın zarf + tabak, istenirse buhar
export const Fincan: React.FC<{ t?: number; s?: number; steam?: number }> = ({ t = 0, s = 1, steam = 1 }) => (
  <g transform={`scale(${s})`}>
    {steam > 0 && [0, 1, 2].map((i) => {
      const u = ((t * 0.6 + i / 3) % 1);
      return <path key={i} d={`M${-6 + i * 6},-34 q${-8 + 4 * Math.sin(t * 2 + i)},-14 0,-28 q${8},-14 0,-28`} stroke="#FFFFFF" strokeWidth={3} fill="none" strokeLinecap="round" opacity={steam * 0.5 * Math.sin(u * Math.PI)} transform={`translate(0,${-u * 26})`} />;
    })}
    <ellipse cx={0} cy={6} rx={34} ry={8} fill="#E9E4DA" stroke={LN} strokeWidth={2} />
    <path d="M-20,-4 L-16,8 L16,8 L20,-4Z" fill={P.gold} stroke={LN} strokeWidth={2} />
    <path d="M-16,-2 L12,-2 M-14,4 L10,4" stroke={P.gold2} strokeWidth={1.6} />
    <path d="M-17,-26 C-19,-12 -16,-4 0,-4 C16,-4 19,-12 17,-26Z" fill="#F7F3EA" stroke={LN} strokeWidth={2} />
    <path d="M-17,-26 C-19,-12 -16,-4 0,-4 C16,-4 19,-12 17,-26Z" fill="url(#pShadeL)" />
    <ellipse cx={0} cy={-26} rx={17} ry={4} fill="#5A3418" stroke={LN} strokeWidth={1.5} />
    <path d="M-12,-18 q12,5 24,0" stroke="#2B5DA8" strokeWidth={2.2} fill="none" />
  </g>
);

// gümüş tepsi + fincan + gül suyu şişesi
export const Tepsi: React.FC<{ t?: number }> = ({ t = 0 }) => (
  <g>
    <ellipse cx={0} cy={6} rx={92} ry={17} fill="#B9BEC6" stroke={LN} strokeWidth={2.5} />
    <ellipse cx={0} cy={2} rx={80} ry={12} fill="#DCE0E6" />
    <path d="M-70,2 q70,10 140,0" stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.6} />
    <g transform="translate(-26,0)"><Fincan t={t} s={0.95} /></g>
    <g transform="translate(34,0)">
      <path d="M-10,0 C-22,-8 -22,-30 -8,-40 L-6,-58 L6,-58 L8,-40 C22,-30 22,-8 10,0Z" fill="#9CC3D6" stroke={LN} strokeWidth={2} opacity={0.95} />
      <path d="M-8,-40 L8,-40" stroke={P.gold} strokeWidth={3} />
      <circle cx={0} cy={-62} r={5} fill={P.gold} stroke={LN} strokeWidth={1.5} />
    </g>
  </g>
);

// kundaklı bebek (mavi nazar boncuğu ile)
export const Bebek: React.FC<{ t?: number; s?: number; cry?: number; bead?: boolean }> = ({ t = 0, s = 1, cry = 0, bead = true }) => {
  const sq = cry > 0 ? Math.sin(t * 14) * 2 * cry : 0;
  return (
    <g transform={`scale(${s}) rotate(-8)`}>
      <ellipse cx={8} cy={4} rx={86} ry={40} fill="#F7F0E2" stroke={LN} strokeWidth={2.6} />
      <path d="M-50,-20 Q10,10 70,-26 M-40,20 Q20,40 80,8" stroke="#D9C9A8" strokeWidth={3} fill="none" />
      <path d="M-30,-34 L60,30 M10,-40 L80,6" stroke="#C9636A" strokeWidth={5} opacity={0.55} />
      <circle cx={-52} cy={-6} r={34} fill="#F1E3C6" stroke={LN} strokeWidth={2.4} />
      <circle cx={-52} cy={-2} r={24} fill="url(#pFace)" stroke={LN} strokeWidth={2} />
      {cry > 0 ? <path d="M-62,-6 l6,3 M-42,-6 l-6,3" stroke={LN} strokeWidth={2.4} strokeLinecap="round" />
        : <path d="M-63,-5 q4,3 8,0 M-49,-5 q4,3 8,0" stroke={LN} strokeWidth={2.2} fill="none" strokeLinecap="round" />}
      {cry > 0 ? <ellipse cx={-52} cy={10 + sq * 0.3} rx={5} ry={4 + Math.abs(sq)} fill="#8E3A40" /> : <path d="M-56,9 q4,2 8,0" stroke={P.lip} strokeWidth={2} fill="none" />}
      <ellipse cx={-66} cy={4} rx={5} ry={3} fill={P.blush} opacity={0.6} /><ellipse cx={-38} cy={4} rx={5} ry={3} fill={P.blush} opacity={0.6} />
      {bead && <g transform="translate(-18,-30)"><circle r={9} fill="#2B5DA8" stroke={LN} strokeWidth={1.6} /><circle r={5} fill="#FFFFFF" /><circle r={2.6} fill="#1A2A5A" /></g>}
    </g>
  );
};

// ───────── karakter ─────────
export type PKind = "girl" | "prince" | "valide" | "kalfa" | "sultan";
export type PFace = "normal" | "smile" | "shy" | "sad" | "worried" | "shock" | "closed";
type PFigP = {
  x: number; y: number; s?: number; kind?: PKind; t?: number; seed?: number; face?: PFace;
  look?: number; bow?: number; walk?: Walk; hands?: "fold" | "tray" | "down" | "belly" | "baby"; belly?: number; baby?: React.ReactNode; plain?: boolean; fes?: boolean; reach?: number; reachDir?: 1 | -1; item?: React.ReactNode; trayItem?: React.ReactNode;
  sit?: boolean; light?: 1 | -1; robe?: string; robe2?: string; scarf?: string; talk?: number; op?: number; blur?: number;
};

const Eyes2: React.FC<{ cx: number; cy: number; face: PFace; blink: boolean; look: number; bow: number; fem: boolean }> = ({ cx, cy, face, blink, look, bow, fem }) => {
  const ex = look * 9, ey = bow * 9 + (face === "shy" ? 4 : 0);
  const brow = (dx: number, flip: number) => {
    const lift = face === "shock" ? -8 : face === "worried" || face === "sad" ? -2 : 0;
    const tilt = face === "worried" || face === "sad" ? 5 * flip : face === "shy" ? 2 * flip : 0;
    return <path d={`M${cx + dx - 10 + ex},${cy - 18 + ey + lift + tilt} q10,-6 20,-1`} stroke={LN} strokeWidth={2.4} fill="none" strokeLinecap="round" opacity={0.7} transform={flip < 0 ? `translate(${2 * (cx + dx + ex)},0) scale(-1,1)` : undefined} />;
  };
  if (blink || face === "closed" || bow > 0.7 || face === "shy") {
    return (
      <g>
        <path d={`M${cx - 22 + ex},${cy + ey} q7,6 14,0 M${cx + 8 + ex},${cy + ey} q7,6 14,0`} stroke={LN} strokeWidth={3.2} fill="none" strokeLinecap="round" />
        {fem && <path d={`M${cx - 23 + ex},${cy + ey} l-5,-3 M${cx + 23 + ex},${cy + ey} l5,-3`} stroke={LN} strokeWidth={2.2} strokeLinecap="round" />}
        {brow(-15, -1)}{brow(15, 1)}
      </g>
    );
  }
  const ry = face === "shock" ? 9 : 7.2;
  return (
    <g>
      {[-15, 15].map((dx) => (
        <g key={dx}>
          <ellipse cx={cx + dx + ex} cy={cy + ey} rx={5.2} ry={ry} fill="#2A1E16" />
          <circle cx={cx + dx + 1.6 + ex} cy={cy - 3 + ey} r={1.8} fill="#fff" />
          <circle cx={cx + dx - 1.4 + ex} cy={cy + 3 + ey} r={0.9} fill="#fff" opacity={0.7} />
        </g>
      ))}
      {fem && <path d={`M${cx - 20 + ex},${cy - 5 + ey} l-6,-4 M${cx + 20 + ex},${cy - 5 + ey} l6,-4`} stroke={LN} strokeWidth={2.2} strokeLinecap="round" />}
      {brow(-15, -1)}{brow(15, 1)}
    </g>
  );
};

export const PFig: React.FC<PFigP> = ({
  x, y, s = 1, kind = "girl", t = 0, seed = 0, face = "normal", look = 0, bow = 0, walk, hands = "fold", reach = 0, reachDir, item, trayItem,
  sit = false, light = 1, robe, robe2, scarf, talk = 0, op = 1, blur = 0, belly = 0, baby, plain = false, fes = false,
}) => {
  const male = kind === "prince" || kind === "sultan";
  const fem = !male;
  const scarfed = kind === "girl" || kind === "kalfa";
  const blink = blinkAt(t, seed);
  const open = talk > 0 && Math.sin(t * 19 + seed) > 0.1;
  const breathe = Math.sin(t * 1.6 + seed) * 2;
  const dy = sit ? 150 : 0;
  const R = robe ?? (kind === "prince" ? P.brocade : kind === "sultan" ? "#2E4A7A" : kind === "valide" ? P.crimson : kind === "kalfa" ? "#5E6E5A" : P.sky);
  const R2 = robe2 ?? (male ? "#F3E6C4" : kind === "valide" ? "#F2DDB0" : kind === "kalfa" ? "#E9DCC2" : P.rose2);
  const SC = scarf ?? (kind === "valide" ? "#FBF7EE" : kind === "kalfa" ? "#D8CDB6" : "#F1E3C6");
  const shade = light > 0 ? "url(#pShadeL)" : "url(#pShadeR)";
  const hw = kind === "sultan" ? 142 : kind === "prince" ? 132 : kind === "valide" ? 136 : kind === "kalfa" ? 128 : 122;
  const HS = fem ? 0.76 : 0.8;

  // yürüme
  const W = walk && !sit ? walk : null;
  const wa = W ? W.amp : 0, wd = W ? W.dir : 1;
  const wt = W ? tri(W.ph) : 0;
  const wBob = W ? -7 * wa * (1 - Math.abs(wt)) + 3 * wa : 0;
  const wRot = W ? 1.2 * wa * wt + 1.6 * wa * wd : 0;
  const wSkew = W ? -2.6 * wa * Math.sin(2 * W.ph) * wd : 0;
  const wArm = W ? 8 * wa * wt * wd : 0;
  const F = 110;
  const foot = (side: 1 | -1) => {
    if (!W) return null;
    const fx = side * wd * F * wa * wt;
    const lift = wa * Math.max(0, side * Math.cos(W.ph));
    const c = male ? "#B23A2A" : kind === "valide" ? "#7A1C22" : "#C46A5A";
    return (
      <g key={`f${side}`} transform={`translate(${fx + side * 24},${-lift * 16}) scale(${wd},1)`} opacity={Math.min(1, wa * 3)}>
        <path d="M-26,-12 C-26,2 -20,6 -10,6 L26,6 C38,6 46,-2 52,-12 C40,-6 30,-12 22,-15 Z" fill={c} stroke={LN} strokeWidth={2.4} strokeLinejoin="round" />
        <path d="M-10,-2 L24,-2" stroke={P.gold} strokeWidth={2.4} />
      </g>
    );
  };

  // gövde yolları
  const outer = sit
    ? `M-62,-190 C-100,-160 -132,-118 -156,-94 C-182,-66 -178,-26 -164,-6 Q0,10 164,-6 C178,-26 182,-66 156,-94 C132,-118 100,-160 62,-190Z`
    : `M-58,-342 C-94,-302 -${hw - 20},-190 -${hw},-8 Q0,8 ${hw},-8 C${hw - 20},-190 94,-302 58,-342 Z`;
  const inner = sit
    ? `M-26,-182 C-44,-120 -62,-60 -72,-6 L72,-6 C62,-60 44,-120 26,-182Z`
    : `M-24,-334 C-30,-220 -40,-110 -50,-6 L50,-6 C40,-110 30,-220 24,-334Z`;
  const hem = sit ? null : `M-${hw - 2},-30 Q0,-14 ${hw - 2},-30 L${hw},-8 Q0,8 -${hw},-8Z`;

  // uzanma kolu
  const rOk = reach !== 0 && !sit && (hands === "fold" || hands === "down");
  const rOkSit = reach !== 0 && sit;
  const rs: 1 | -1 = reachDir ?? (look < 0 ? -1 : 1);
  const hideR = (rOk || rOkSit) && rs > 0, hideL = (rOk || rOkSit) && rs < 0;
  const reachArm = () => {
    if (!rOk && !rOkSit) return null;
    const k = reach;
    const h0 = sit ? [10, -76 + dy - 150] : hands === "down" ? [92, -170] : [10, -228];
    const h1 = sit ? [210, -196] : [240, -300];
    const hx = h0[0] + (h1[0] - h0[0]) * k, hy = h0[1] + (h1[1] - h0[1]) * k;
    const sx = 58, sy = -330 + dy;
    const bend = 44 * (1 - Math.max(0, Math.min(1, k))) + 14;
    const mx = (sx + hx) / 2, my = (sy + hy) / 2;
    const L = Math.hypot(hx - sx, hy - sy) || 1;
    const ex = mx - ((hy - sy) / L) * bend, ey = my + ((hx - sx) / L) * bend;
    const pts = `${sx},${sy} ${ex},${ey} ${hx - (hx - ex) * 0.14},${hy - (hy - ey) * 0.14}`;
    return (
      <g transform={`scale(${rs},1)`}>
        <polyline points={pts} fill="none" stroke={LN} strokeWidth={44 + LW * 2} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts} fill="none" stroke={R} strokeWidth={44} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts} fill="none" stroke="#2A1408" strokeOpacity={0.14} strokeWidth={16} strokeLinecap="round" strokeLinejoin="round" transform="translate(0,10)" />
        <circle cx={hx - (hx - ex) * 0.14} cy={hy - (hy - ey) * 0.14} r={22} fill="url(#pBand)" stroke={LN} strokeWidth={2} />
        <ellipse cx={hx} cy={hy} rx={15} ry={12} fill={P.skin} stroke={LN} strokeWidth={2.4} />
        {item && <g transform={`translate(${hx},${hy - 8}) scale(${rs},1)`}>{item}</g>}
      </g>
    );
  };

  const sleeve = (side: 1 | -1, rot: number) => (
    <g transform={`rotate(${rot},${side * 62},${-334 + dy})`}>
      <path d={`M${side * 62},${-334 + dy} C${side * 102},${-300 + dy} ${side * 112},${-232 + dy} ${side * 112},${-182 + dy} L${side * 74},${-178 + dy} C${side * 72},${-232 + dy} ${side * 64},${-282 + dy} ${side * 48},${-314 + dy}Z`} fill={R} stroke={LN} strokeWidth={LW} />
      <path d={`M${side * 62},${-334 + dy} C${side * 102},${-300 + dy} ${side * 112},${-232 + dy} ${side * 112},${-182 + dy} L${side * 74},${-178 + dy} C${side * 72},${-232 + dy} ${side * 64},${-282 + dy} ${side * 48},${-314 + dy}Z`} fill={side * light > 0 ? "#FFF1D6" : "#2A1408"} opacity={side * light > 0 ? 0.14 : 0.2} />
      <path d={`M${side * 112},${-190 + dy} L${side * 74},${-186 + dy} L${side * 74},${-174 + dy} L${side * 112},${-178 + dy}Z`} fill="url(#pBand)" stroke={LN} strokeWidth={1.6} />
      <ellipse cx={side * 93} cy={-164 + dy} rx={15} ry={13} fill={P.skin} stroke={LN} strokeWidth={2.4} />
    </g>
  );

  const faceCy = -452 + dy + bow * 10;
  const headT = `translate(0,${bow * 14 + breathe * 0.5}) rotate(${look * 3 + bow * 8 * (look >= 0 ? 1 : -1) + Math.sin(t * 0.7 + seed) * 1.3},0,${-336 + dy}) translate(0,${-336 + dy}) scale(${HS}) translate(0,${336 - dy})`;
  const fx = look * 5;

  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={op} filter={blur > 0 ? `url(#pBlur${blur})` : undefined}>
      {/* temas gölgesi (yerde, figürle dönmez) */}
      <ellipse cx={0} cy={0} rx={sit ? 200 : 150} ry={22} fill="url(#pContact)" />
      <g transform={`rotate(${Math.sin(t * 0.9 + seed * 2.1) * 0.8 + wRot}) translate(0,${wBob}) translate(0,${bow * 6})`}>
        {/* valide: hotozdan dökülen uzun tül (arkada) */}
        {kind === "valide" && <path d={`M-40,${-610 + dy} C-150,${-470 + dy} -170,${-230 + dy} -158,${-20 + dy * 0.2} L158,${-20 + dy * 0.2} C170,${-230 + dy} 150,${-470 + dy} 40,${-610 + dy}Z`} fill="url(#pVeil)" stroke={LN} strokeWidth={1.6} strokeOpacity={0.5} />}
        {/* kız: başörtüsünün sırttan inen ucu */}
        {scarfed && !sit && <path d={`M-70,-372 C-96,-300 -96,-220 -80,-170 Q0,-150 80,-170 C96,-220 96,-300 70,-372Z`} fill={SC} stroke={LN} strokeWidth={2} />}
        {foot(-1)}{foot(1)}
        {/* kaftan */}
        <g transform={`translate(0,${breathe * 0.3}) translate(0,-338) skewX(${wSkew}) translate(0,338)`}>
          <path d={outer} fill={R} stroke={LN} strokeWidth={LW} strokeLinejoin="round" />
          {(male || kind === "valide") && !plain && <path d={outer} fill="url(#pBrocade)" opacity={kind === "valide" ? 0.55 : kind === "sultan" ? 0.42 : 0.5} />}
          {scarfed && <path d={outer} fill="url(#hDamask)" opacity={0.35} />}
          <path d={inner} fill={R2} stroke={LN} strokeWidth={2} />
          <path d={inner} fill="url(#pFlower)" opacity={male ? 0.35 : kind === "kalfa" ? 0.25 : 0.6} />
          {/* kürk yaka ve ön kenar (şehzade + valide) */}
          {(male || kind === "valide") && !sit && !plain && (
            <g>
              <path d={`M-24,-336 C-32,-220 -42,-110 -52,-8 L-72,-8 C-60,-110 -50,-220 -44,-334Z`} fill="url(#pFurTex)" stroke={LN} strokeWidth={2} />
              <path d={`M24,-336 C32,-220 42,-110 52,-8 L72,-8 C60,-110 50,-220 44,-334Z`} fill="url(#pFurTex)" stroke={LN} strokeWidth={2} />
              <path d={`M-70,-348 Q0,-312 70,-348 L64,-326 Q0,-296 -64,-326Z`} fill="url(#pFurTex)" stroke={LN} strokeWidth={2} />
            </g>
          )}
          {hem && <path d={hem} fill="url(#pBand)" stroke={LN} strokeWidth={2} />}
          {/* kıvrım çizgileri */}
          {!sit && [-1, 1].map((sd) => <path key={sd} d={`M${sd * 70},-250 C${sd * 82},-170 ${sd * 92},-100 ${sd * 100},-34`} stroke="#2A1408" strokeOpacity={0.18} strokeWidth={4} fill="none" strokeLinecap="round" />)}
          {/* ışık-gölge */}
          <path d={outer} fill={shade} />
          <path d={outer} fill="url(#pDrop)" />
          {/* kuşak + püskül */}
          {!sit && (
            <g>
              <path d={`M-66,-262 Q0,-248 66,-262 L64,-238 Q0,-224 -64,-238Z`} fill={male ? "#7A1F24" : kind === "valide" ? P.gold : kind === "kalfa" ? "#4A3A2E" : "#B8505A"} stroke={LN} strokeWidth={2.4} />
              <path d={`M-62,-252 Q0,-238 62,-252`} stroke={kind === "valide" ? P.crimson : P.gold} strokeWidth={2.2} fill="none" strokeDasharray="6 6" />
              <g transform={`translate(${-28 * light},-236) rotate(${wArm * 0.8 + Math.sin(t * 2 + seed) * 3})`}>
                <circle cx={0} cy={4} r={7} fill={P.gold} stroke={LN} strokeWidth={1.6} />
                <path d="M-6,10 L-9,52 M0,10 L0,56 M6,10 L9,52" stroke={P.gold} strokeWidth={3.4} strokeLinecap="round" />
              </g>
              {male && !plain && <g transform="translate(26,-262) rotate(-24)"><rect x={-6} y={-6} width={12} height={58} rx={4} fill={P.gold} stroke={LN} strokeWidth={2} /><circle cx={0} cy={-10} r={9} fill="#2B8A5A" stroke={P.gold} strokeWidth={3} /></g>}
            </g>
          )}
          {sit && <path d={`M-150,-30 Q0,-10 150,-30`} stroke={P.gold} strokeWidth={8} fill="none" opacity={0.8} />}
          {/* inci kolye */}
          {fem && <path d={`M-34,${-336 + dy} Q0,${-300 + dy} 34,${-336 + dy}`} stroke={P.pearl} strokeWidth={6} strokeDasharray="0.1 9" strokeLinecap="round" fill="none" />}
        </g>
        {/* hamile karın */}
        {belly > 0 && (() => {
          const by = sit ? -50 : -160, rx = 58 + 66 * belly, ry = 48 + 46 * belly;
          return (
            <g transform={`translate(0,${breathe * 0.4})`}>
              <ellipse cx={4} cy={by + ry * 0.18} rx={rx * 1.04} ry={ry} fill="#2A1408" opacity={0.25} />
              <ellipse cx={0} cy={by} rx={rx} ry={ry} fill={R} stroke={LN} strokeWidth={LW} />
              {scarfed && <ellipse cx={0} cy={by} rx={rx} ry={ry} fill="url(#hDamask)" opacity={0.3} />}
              <ellipse cx={0} cy={by} rx={rx} ry={ry} fill={shade} />
              <ellipse cx={-rx * 0.32 * light} cy={by - ry * 0.34} rx={rx * 0.38} ry={ry * 0.26} fill="#FFF6E6" opacity={0.28} />
              <path d={`M${-rx * 0.8},${by + ry * 0.55} Q0,${by + ry * 1.08} ${rx * 0.8},${by + ry * 0.55}`} stroke="#2A1408" strokeOpacity={0.22} strokeWidth={5} fill="none" />
              <path d={`M${-rx * 0.9},${by - ry * 0.78} Q0,${by - ry * 1.02} ${rx * 0.9},${by - ry * 0.78}`} stroke={scarfed ? "#B8505A" : P.gold} strokeWidth={10} fill="none" strokeLinecap="round" />
            </g>
          );
        })()}
        {/* kollar */}
        <g>
          {hands === "belly" || hands === "baby" ? (
            <>
              {!hideL && sleeve(-1, hands === "baby" ? -30 : -20 - belly * 4)}
              {!hideR && sleeve(1, hands === "baby" ? 30 : 20 + belly * 4)}
              {hands === "baby" && <g transform={`translate(0,${-200 + dy})`}>{baby ?? <Bebek t={t} />}</g>}
            </>
          ) : hands === "down" || sit ? (
            <>
              {!hideL && sleeve(-1, wArm)}
              {!hideR && sleeve(1, -wArm)}
            </>
          ) : (
            <>
              {!hideL && <path d="M-58,-336 C-92,-300 -90,-236 -58,-208 L-2,-222 C-18,-250 -32,-290 -38,-318Z" fill={R} stroke={LN} strokeWidth={LW} />}
              {!hideR && <path d="M58,-336 C92,-300 90,-236 58,-208 L2,-222 C18,-250 32,-290 38,-318Z" fill={R} stroke={LN} strokeWidth={LW} />}
              {!hideL && <path d="M-58,-336 C-92,-300 -90,-236 -58,-208 L-2,-222 C-18,-250 -32,-290 -38,-318Z" fill={shade} />}
              {!hideL && <path d="M-60,-224 L-6,-236 L-2,-222 L-58,-208Z" fill="url(#pBand)" stroke={LN} strokeWidth={1.4} />}
              {!hideR && <path d="M60,-224 L6,-236 L2,-222 L58,-208Z" fill="url(#pBand)" stroke={LN} strokeWidth={1.4} />}
              {hands === "tray" ? (
                <g transform="translate(0,-222)">
                  {trayItem ?? <Tepsi t={t} />}
                  <ellipse cx={-40} cy={8} rx={15} ry={10} fill={P.skin} stroke={LN} strokeWidth={2.2} />
                  <ellipse cx={40} cy={8} rx={15} ry={10} fill={P.skin} stroke={LN} strokeWidth={2.2} />
                </g>
              ) : (
                <>
                  {!hideL && <ellipse cx={-9} cy={-220} rx={16} ry={11} fill={P.skin} stroke={LN} strokeWidth={2.4} />}
                  {!hideR && <ellipse cx={9} cy={-224} rx={16} ry={11} fill={P.skin} stroke={LN} strokeWidth={2.4} />}
                </>
              )}
            </>
          )}
        </g>
        {reachArm()}
        {/* baş */}
        <g transform={headT}>
          {scarfed && (
            <>
              {/* başörtüsü: yüzü çevreleyip omuza dökülür, kenarında oya, alında altın sikke dizisi */}
              <path d={`M0,${-572 + dy} C-64,${-572 + dy} -92,${-524 + dy} -92,${-460 + dy} C-92,${-410 + dy} -84,${-388 + dy} -76,${-372 + dy} C-120,${-354 + dy} -136,${-316 + dy} -124,${-282 + dy} Q0,${-252 + dy} 124,${-282 + dy} C136,${-316 + dy} 120,${-354 + dy} 76,${-372 + dy} C84,${-388 + dy} 92,${-410 + dy} 92,${-460 + dy} C92,${-524 + dy} 64,${-572 + dy} 0,${-572 + dy}Z`} fill={SC} stroke={LN} strokeWidth={LW} />
              <path d={`M0,${-572 + dy} C-64,${-572 + dy} -92,${-524 + dy} -92,${-460 + dy} C-92,${-410 + dy} -84,${-388 + dy} -76,${-372 + dy} C-120,${-354 + dy} -136,${-316 + dy} -124,${-282 + dy} Q0,${-252 + dy} 124,${-282 + dy} C136,${-316 + dy} 120,${-354 + dy} 76,${-372 + dy} C84,${-388 + dy} 92,${-410 + dy} 92,${-460 + dy} C92,${-524 + dy} 64,${-572 + dy} 0,${-572 + dy}Z`} fill={shade} />
              <path d={`M-96,${-330 + dy} Q-30,${-300 + dy} 10,${-318 + dy} M-70,${-360 + dy} Q0,${-332 + dy} 70,${-360 + dy} M30,${-300 + dy} Q80,${-306 + dy} 110,${-326 + dy}`} stroke="#B89E70" strokeWidth={2.6} fill="none" opacity={0.7} />
              <ellipse cx={fx} cy={faceCy - 2} rx={56} ry={66} fill="#D9C39A" />
              {kind === "girl" && Array.from({ length: 22 }, (_, i) => {
                const a = Math.PI * 1.02 + (i / 21) * Math.PI * 0.96 - Math.PI * 0.5;
                return <circle key={i} cx={fx + Math.cos(a - Math.PI / 2) * 58} cy={faceCy - 2 + Math.sin(a - Math.PI / 2) * 68} r={3.4} fill={i % 2 ? "#C9636A" : "#FFFFFF"} stroke={LN} strokeWidth={0.8} />;
              })}
              {kind === "girl" && Array.from({ length: 9 }, (_, i) => {
                const a = -Math.PI * 0.82 + (i / 8) * Math.PI * 0.64;
                return <circle key={`c${i}`} cx={fx + Math.cos(a) * 50} cy={faceCy - 4 + Math.sin(a) * 58 + 6} r={4.6} fill={P.gold} stroke={P.gold2} strokeWidth={1.2} />;
              })}
            </>
          )}
          {kind === "valide" && (
            <>
              {/* beyaz iç örtü + yüksek hotoz + mücevher + sorguç */}
              <path d={`M0,${-560 + dy} C-60,${-560 + dy} -86,${-516 + dy} -86,${-456 + dy} C-86,${-404 + dy} -76,${-382 + dy} -66,${-368 + dy} Q0,${-340 + dy} 66,${-368 + dy} C76,${-382 + dy} 86,${-404 + dy} 86,${-456 + dy} C86,${-516 + dy} 60,${-560 + dy} 0,${-560 + dy}Z`} fill={SC} stroke={LN} strokeWidth={LW} />
              <ellipse cx={fx} cy={faceCy - 2} rx={54} ry={64} fill="#E2D9C6" />
              <path d={`M-54,${faceCy - 56} C-64,${faceCy - 170} -36,${faceCy - 214} 0,${faceCy - 216} C36,${faceCy - 214} 64,${faceCy - 170} 54,${faceCy - 56} Q0,${faceCy - 44} -54,${faceCy - 56}Z`} fill={P.crimson} stroke={LN} strokeWidth={LW} />
              <path d={`M-54,${faceCy - 56} C-64,${faceCy - 170} -36,${faceCy - 214} 0,${faceCy - 216} C36,${faceCy - 214} 64,${faceCy - 170} 54,${faceCy - 56} Q0,${faceCy - 44} -54,${faceCy - 56}Z`} fill="url(#pBrocade)" opacity={0.6} />
              <path d={`M-56,${faceCy - 66} Q0,${faceCy - 52} 56,${faceCy - 66} L54,${faceCy - 52} Q0,${faceCy - 38} -54,${faceCy - 52}Z`} fill={P.gold} stroke={LN} strokeWidth={2} />
              {[-36, -12, 12, 36].map((dx) => <circle key={dx} cx={dx} cy={faceCy - 58 + Math.abs(dx) * 0.08} r={5} fill={dx % 24 === 0 ? "#2B8A5A" : "#B8242C"} stroke={P.gold} strokeWidth={2} />)}
              <circle cx={0} cy={faceCy - 150} r={14} fill="#2B8A5A" stroke={P.gold} strokeWidth={5} />
              <path d={`M4,${faceCy - 160} C30,${faceCy - 230} 70,${faceCy - 250} 90,${faceCy - 240} C60,${faceCy - 226} 30,${faceCy - 190} 8,${faceCy - 150}Z`} fill="#FFFFFF" stroke={LN} strokeWidth={1.6} />
              <path d={`M-30,${faceCy - 130} q30,20 60,0`} stroke={P.pearl} strokeWidth={6} strokeDasharray="0.1 10" strokeLinecap="round" fill="none" />
            </>
          )}
          {male && fes && (
            <g>
              {/* fes (1900'ler İstanbul): kırmızı kesik koni + siyah püskül */}
              <path d={`M-50,${faceCy - 44} L-42,${faceCy - 128} Q0,${faceCy - 138} 42,${faceCy - 128} L50,${faceCy - 44} Q0,${faceCy - 30} -50,${faceCy - 44}Z`} fill="#A8202A" stroke={LN} strokeWidth={LW} />
              <path d={`M-50,${faceCy - 44} L-42,${faceCy - 128} Q0,${faceCy - 138} 42,${faceCy - 128} L50,${faceCy - 44} Q0,${faceCy - 30} -50,${faceCy - 44}Z`} fill={shade} />
              <ellipse cx={0} cy={faceCy - 130} rx={42} ry={8} fill="#8A1820" stroke={LN} strokeWidth={2} />
              <g transform={`rotate(${Math.sin(t * 2.4 + seed) * 6},0,${faceCy - 132})`}>
                <path d={`M0,${faceCy - 132} C30,${faceCy - 128} 44,${faceCy - 110} 46,${faceCy - 84}`} stroke="#1A1410" strokeWidth={4} fill="none" />
                <path d={`M40,${faceCy - 88} l-6,26 M46,${faceCy - 86} l0,28 M52,${faceCy - 88} l6,26`} stroke="#1A1410" strokeWidth={3.2} strokeLinecap="round" />
              </g>
            </g>
          )}
          {male && !fes && (
            <g transform={kind === "sultan" ? `translate(0,${faceCy - 60}) scale(1.22) translate(0,${-(faceCy - 60)})` : undefined}>
              {/* kavuk-sarık: kırmızı tepelik, beyaz sarma, mücevherli sorguç + tüy */}
              <path d={`M-30,${faceCy - 100} C-34,${faceCy - 150} 34,${faceCy - 150} 30,${faceCy - 100}Z`} fill="#B8242C" stroke={LN} strokeWidth={2.4} />
              <ellipse cx={0} cy={faceCy - 76} rx={86} ry={60} fill={P.turban} stroke={LN} strokeWidth={LW} />
              {[0, 1, 2, 3].map((i) => <path key={i} d={`M-80,${faceCy - 54 - i * 18} Q0,${faceCy - 96 - i * 16} 80,${faceCy - 60 - i * 14}`} stroke={P.turban2} strokeWidth={4} fill="none" />)}
              <ellipse cx={0} cy={faceCy - 76} rx={86} ry={60} fill={shade} />
              <g transform={`translate(${-18},${faceCy - 104})`} opacity={plain ? 0 : 1}>
                <path d={`M0,0 C-6,-50 10,-96 34,-122 C26,-80 22,-40 10,2Z`} fill="#FFFFFF" stroke={LN} strokeWidth={1.6} transform={`rotate(${Math.sin(t * 2.2 + seed) * 4})`} />
                <path d={`M4,-4 C2,-44 14,-80 30,-108`} stroke="#D9D2C0" strokeWidth={2} fill="none" />
                <circle cx={2} cy={4} r={15} fill="#2B5DA8" stroke={P.gold} strokeWidth={5} />
                {[0, 60, 120, 180, 240, 300].map((a) => <circle key={a} cx={2 + Math.cos((a * Math.PI) / 180) * 20} cy={4 + Math.sin((a * Math.PI) / 180) * 20} r={3.4} fill={P.pearl} />)}
                <path d="M2,20 l-6,22 l6,8 l6,-8Z" fill="#B8242C" stroke={P.gold} strokeWidth={2} />
              </g>
            </g>
          )}
          {/* yüz */}
          <ellipse cx={fx} cy={faceCy} rx={fem ? 45 : 49} ry={fem ? 55 : 57} fill="url(#pFace)" stroke={LN} strokeWidth={2.8} />
          <ellipse cx={fx - 26} cy={faceCy + 15} rx={11} ry={6.5} fill={P.blush} opacity={face === "shy" ? 0.75 : face === "sad" ? 0.2 : 0.42} />
          <ellipse cx={fx + 26} cy={faceCy + 15} rx={11} ry={6.5} fill={P.blush} opacity={face === "shy" ? 0.75 : face === "sad" ? 0.2 : 0.42} />
          <Eyes2 cx={fx} cy={faceCy - 4} face={face} blink={blink} look={look} bow={bow} fem={fem} />
          <path d={`M${fx + look * 6 - 2},${faceCy + 10} q3,4 6,1`} stroke="#D2A890" strokeWidth={2} fill="none" strokeLinecap="round" />
          {kind === "sultan" && <path d={`M${fx - 40},${faceCy + 18} C${fx - 44},${faceCy + 70} ${fx - 20},${faceCy + 96} ${fx},${faceCy + 98} C${fx + 20},${faceCy + 96} ${fx + 44},${faceCy + 70} ${fx + 40},${faceCy + 18} C${fx + 26},${faceCy + 44} ${fx - 26},${faceCy + 44} ${fx - 40},${faceCy + 18}Z`} fill="#3A281C" stroke={LN} strokeWidth={2} />}
          {male && <path d={`M${fx - 22},${faceCy + 24} q11,-8 22,-1 q11,-7 22,1 q-11,5 -22,1 q-11,4 -22,-1Z`} fill="#4A3324" />}
          {(() => {
            const mx = fx + look * 6, my = faceCy + (male ? 36 : 30);
            if (face === "shock" || open) return <ellipse cx={mx} cy={my + 2} rx={5} ry={6} fill={fem ? "#8E3A40" : LN} />;
            if (face === "sad" || face === "worried") return <path d={`M${mx - 8},${my + 4} q8,-6 16,0`} stroke={fem ? P.lip : LN} strokeWidth={3} fill="none" strokeLinecap="round" />;
            if (face === "smile" || face === "shy") return <path d={`M${mx - 9},${my - 2} q9,${face === "shy" ? 6 : 9} 18,0`} stroke={fem ? P.lip : LN} strokeWidth={3} fill="none" strokeLinecap="round" />;
            return <path d={`M${mx - 6},${my} q6,3.5 12,0`} stroke={fem ? P.lip : LN} strokeWidth={3} fill="none" strokeLinecap="round" />;
          })()}
          {(kind === "valide" || kind === "kalfa") && <path d={`M${fx - 36},${faceCy - 2} l-6,-3 M${fx + 36},${faceCy - 2} l6,-3 M${fx - 14},${faceCy - 34} q14,-5 28,0`} stroke="#C9B89C" strokeWidth={2} fill="none" strokeLinecap="round" />}
          {fem && <circle cx={fx - 46} cy={faceCy + 22} r={5} fill={P.gold} stroke={P.gold2} strokeWidth={1.2} />}
        </g>
      </g>
    </g>
  );
};

// yürüme yardımcısı (dünya koordinatında)
export const proWalk = (t: number, a: number, b: number, x0: number, x1: number, s = 1) => {
  const g = gait(t, a, b, x0, x1, HAREM_STRIDE * s);
  return { x: g.x, walk: g.walk, look: g.walk.dir * 0.5 * Math.min(1, g.walk.amp * 2) };
};

// ───────── ışık ─────────
// kandil: zincir, kubbeli cam, titreyen alev; ışık havuzu ayrı çizilir (LightPools)
export const Kandil2: React.FC<{ x: number; y: number; s?: number; t?: number; chain?: number }> = ({ x, y, s = 1, t = 0, chain = 300 }) => {
  const f = 0.88 + 0.12 * Math.sin(t * 11 + x) * Math.sin(t * 6.1 + x * 0.3);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <line x1={0} y1={-chain} x2={0} y2={-64} stroke="#6E4A22" strokeWidth={3} strokeDasharray="7 3" />
      <circle cx={0} cy={0} r={130} fill="url(#pBloom)" opacity={0.55 * f} />
      <path d="M-14,-64 L14,-64 L26,-44 L-26,-44Z" fill={P.gold} stroke={LN} strokeWidth={2} />
      <path d="M-34,-44 C-44,-10 -36,24 0,36 C36,24 44,-10 34,-44Z" fill={`rgba(255,206,120,${0.62 + 0.3 * f})`} stroke={LN} strokeWidth={2.6} />
      <path d="M-34,-44 C-44,-10 -36,24 0,36 C36,24 44,-10 34,-44Z" fill="url(#hHoney)" opacity={0.35} />
      <path d={`M0,8 C-7,-2 -4,-14 0,${-22 - 4 * f} C4,-14 7,-2 0,8Z`} fill="#FFF6D8" />
      <path d="M-30,-8 Q0,6 30,-8" stroke={P.gold} strokeWidth={3} fill="none" />
      <path d="M-8,36 L8,36 L0,58Z" fill={P.gold} stroke={LN} strokeWidth={2} />
    </g>
  );
};

// gece karartması: ışık noktaları delik açılmış lacivert örtü (gerçek ışık-gölge hissi)
export const NightVeil: React.FC<{ id: string; k: number; lights: { x: number; y: number; r: number; f?: number }[]; t?: number; color?: string }> = ({ id, k, lights, t = 0, color = P.night }) => (
  <g pointerEvents="none">
    <mask id={id}>
      <rect width={1920} height={1080} fill="#fff" />
      {lights.map((l, i) => {
        const fl = 1 + 0.04 * Math.sin(t * 9 + i * 2.3);
        return <ellipse key={i} cx={l.x} cy={l.y} rx={l.r * fl} ry={l.r * 0.86 * fl} fill="url(#pHole)" opacity={l.f ?? 1} />;
      })}
    </mask>
    <rect width={1920} height={1080} fill={color} opacity={k} mask={`url(#${id})`} />
    {lights.map((l, i) => <ellipse key={i} cx={l.x} cy={l.y} rx={l.r * 0.75} ry={l.r * 0.65} fill="url(#pPool)" opacity={0.35 * (l.f ?? 1) * (1 + 0.06 * Math.sin(t * 9 + i * 2.3))} style={{ mixBlendMode: "screen" }} />)}
  </g>
);

// toz zerreleri (ışıkta süzülür)
export const Motes: React.FC<{ t: number; n?: number; x0?: number; x1?: number; y0?: number; y1?: number; c?: string; op?: number }> = ({ t, n = 40, x0 = 0, x1 = 1920, y0 = 0, y1 = 1080, c = "#FFF2C8", op = 0.7 }) => (
  <g pointerEvents="none">
    {Array.from({ length: n }, (_, i) => {
      const h1 = Math.abs(Math.sin(i * 91.7)), h2 = Math.abs(Math.sin(i * 37.3)), h3 = Math.abs(Math.sin(i * 13.1));
      const px = x0 + (x1 - x0) * ((h1 + t * 0.012 * (0.5 + h3)) % 1) + Math.sin(t * 0.8 + i) * 14;
      const py = y0 + (y1 - y0) * ((h2 + t * 0.02 * (0.4 + h1)) % 1);
      return <circle key={i} cx={px} cy={py} r={1.2 + h3 * 2.4} fill={c} opacity={op * (0.3 + 0.7 * Math.abs(Math.sin(t * 1.3 + i)))} />;
    })}
  </g>
);

// ───────── mekân 1: harem galerisi (yandan, kamera takip eder) ─────────
// camX: dünya kaydırması. Katmanlar: uzak duvar (0.55), ana duvar+zemin (1), ön sütunlar (1.6, bulanık).
export const GalleryWall: React.FC<{ t: number; camX: number; night?: number }> = ({ t, camX, night = 1 }) => {
  const FL = 860; // zemin çizgisi
  const M = 560; // modül genişliği
  const n0 = Math.floor((camX - 200) / M) - 1;
  const mods = Array.from({ length: 6 }, (_, i) => n0 + i);
  const far = camX * 0.55;
  return (
    <g>
      {/* uzak katman: kemerler ardında gece gökyüzü + Boğaz ışıkları */}
      <rect width={1920} height={FL} fill="url(#pNightSky)" />
      <g transform={`translate(${-far % 400},0)`}>
        {Array.from({ length: 7 }, (_, i) => <circle key={i} cx={i * 400 + 120} cy={120 + (i % 3) * 30} r={1.8} fill="#FFF" opacity={0.6} />)}
        {Array.from({ length: 7 }, (_, i) => (
          <g key={`m${i}`} transform={`translate(${i * 400},560)`} fill="#0B1024" opacity={0.85}>
            <path d="M40,0 a90,70 0 0 1 180,0Z" /><rect x={30} y={-150} width={10} height={150} /><rect x={220} y={-130} width={10} height={130} />
            {[60, 100, 140, 180].map((wx) => <rect key={wx} x={wx} y={-6} width={5} height={7} fill="#FFC870" opacity={0.7} />)}
          </g>
        ))}
        <rect x={-400} y={560} width={3600} height={300} fill="#101833" />
        {Array.from({ length: 30 }, (_, i) => <rect key={`w${i}`} x={i * 120 - 300 + ((t * 8 * (i % 3 + 1)) % 40)} y={600 + (i % 5) * 40} width={30 + (i % 4) * 10} height={2} fill="#FFD089" opacity={0.25} />)}
      </g>
      {/* ana duvar: her modülde kemerli açıklık (kafesli), çini panel, kapı veya niş */}
      <g transform={`translate(${-camX},0)`}>
        {mods.map((m) => {
          const X = m * M;
          const door = Math.abs(m) % 3 === 1;
          return (
            <g key={m}>
              <path d={`M${X},0 L${X + M},0 L${X + M},${FL} L${X},${FL}Z M${X + 150},${FL - 330} L${X + 150},${FL - 640} A130,130 0 0 1 ${X + 410},${FL - 640} L${X + 410},${FL - 330}Z`} fill={H.plaster} fillRule="evenodd" />
              <rect x={X} y={0} width={M} height={70} fill="url(#hTileS)" />
              <rect x={X} y={66} width={M} height={10} fill={H.cobalt} />
              {/* kemer çerçevesi + kafes */}
              <path d={`M${X + 150},${FL - 330} L${X + 150},${FL - 640} A130,130 0 0 1 ${X + 410},${FL - 640} L${X + 410},${FL - 330}`} fill="url(#hHoney)" opacity={0.75} />
              <path d={`M${X + 150},${FL - 330} L${X + 150},${FL - 640} A130,130 0 0 1 ${X + 410},${FL - 640} L${X + 410},${FL - 330}`} fill="none" stroke={H.wood2} strokeWidth={14} />
              <path d={`M${X + 136},${FL - 330} L${X + 136},${FL - 646} A144,144 0 0 1 ${X + 424},${FL - 646} L${X + 424},${FL - 330}`} fill="none" stroke={P.gold} strokeWidth={4} />
              {/* kemer köşelerinde rumi süsleme */}
              <path d={`M${X + 60},${FL - 760} q40,-40 80,0 q-40,40 -80,0Z M${X + 420},${FL - 760} q40,-40 80,0 q-40,40 -80,0Z`} fill={H.turq} stroke={LN} strokeWidth={1.6} opacity={0.8} />
              {/* çini lambri */}
              <rect x={X} y={FL - 330} width={M} height={330} fill="url(#hTile)" />
              <rect x={X} y={FL - 342} width={M} height={14} fill={H.cobalt} />
              <rect x={X} y={FL - 328} width={M} height={5} fill={P.gold} />
              <rect x={X + 20} y={FL - 312} width={M - 40} height={290} fill="none" stroke={P.gold} strokeWidth={5} />
              {door && (
                <g>
                  <path d={`M${X + 210},${FL} L${X + 210},${FL - 400} Q${X + 280},${FL - 470} ${X + 350},${FL - 400} L${X + 350},${FL}Z`} fill={H.wood} stroke={LN} strokeWidth={4} />
                  <path d={`M${X + 280},${FL} L${X + 280},${FL - 440}`} stroke={H.wood2} strokeWidth={4} />
                  {[0, 1, 2].map((r) => [0, 1].map((c) => <rect key={`${r}${c}`} x={X + 222 + c * 66} y={FL - 380 + r * 120} width={46} height={96} rx={6} fill="none" stroke={H.wood2} strokeWidth={4} />))}
                  <circle cx={X + 268} cy={FL - 200} r={7} fill={P.gold} /><circle cx={X + 292} cy={FL - 200} r={7} fill={P.gold} />
                </g>
              )}
              {/* pilaster */}
              <rect x={X - 26} y={0} width={52} height={FL} fill={H.plaster2} stroke={LN} strokeWidth={2} />
              <rect x={X - 30} y={FL - 360} width={60} height={30} fill={P.gold} stroke={LN} strokeWidth={2} />
            </g>
          );
        })}
        {/* zemin: mermer + yolluk + yansıma */}
        <rect x={camX - 200} y={FL} width={2400} height={1080 - FL} fill="url(#hMarble)" />
        <rect x={camX - 200} y={FL + 60} width={2400} height={110} fill="url(#hRunner)" />
        <rect x={camX - 200} y={FL + 56} width={2400} height={6} fill={P.gold} /><rect x={camX - 200} y={FL + 168} width={2400} height={6} fill={P.gold} />
        <rect x={camX - 200} y={FL} width={2400} height={22} fill="#2A1408" opacity={0.18} />
        {/* asılı kandiller (her modülde) */}
        {mods.map((m) => <Kandil2 key={`k${m}`} x={m * M + M / 2 + 0} y={330} s={0.85} t={t} chain={340} />)}
      </g>
      {night > 0 && null}
    </g>
  );
};

// ön plan sütunları (hızlı kayar, bulanık, koyu) — derinlik
export const ForeColumns: React.FC<{ camX: number; k?: number }> = ({ camX, k = 1.6 }) => {
  const S = 1300;
  const off = (camX * k) % S;
  return (
    <g filter="url(#pBlur8)" pointerEvents="none">
      {[-1, 0, 1, 2].map((i) => {
        const X = i * S - off + 300;
        return (
          <g key={i}>
            <rect x={X - 70} y={-20} width={140} height={1120} fill="#3A2614" />
            <rect x={X - 70} y={-20} width={40} height={1120} fill="#5A3C22" />
            <rect x={X - 92} y={170} width={184} height={46} fill="#2A1A0C" />
            <rect x={X - 92} y={930} width={184} height={160} fill="#2A1A0C" />
          </g>
        );
      })}
    </g>
  );
};

// ───────── mekân 2: valide dairesi (gece) ─────────
export const ValideOda: React.FC<{ t: number; win?: number }> = ({ t, win = 0.95 }) => {
  const FL = 820;
  return (
    <g>
      <rect width={1920} height={FL} fill={H.plaster} />
      {/* ahşap kasetli tavan bandı */}
      <rect width={1920} height={110} fill={H.wood2} />
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={i * 124 + 8} y={14} width={108} height={82} rx={6} fill={H.wood} stroke={P.gold} strokeWidth={3} />)}
      {Array.from({ length: 16 }, (_, i) => <circle key={`r${i}`} cx={i * 124 + 62} cy={55} r={18} fill={H.cobalt} stroke={P.gold} strokeWidth={3} />)}
      <rect y={110} width={1920} height={50} fill="url(#hTileS)" />
      <rect y={156} width={1920} height={8} fill={H.cobalt} />
      {/* ocak (konik davlumbazlı Osmanlı şöminesi) */}
      <g transform={`translate(560,${FL})`}>
        <path d="M-170,-700 L170,-700 L120,-330 L-120,-330Z" fill={H.plaster2} stroke={LN} strokeWidth={4} />
        <path d="M-170,-700 L170,-700 L120,-330 L-120,-330Z" fill="url(#pShadeL)" />
        <path d="M-150,-680 L150,-680" stroke={P.gold} strokeWidth={6} />
        {[0, 1, 2, 3, 4].map((i) => <path key={i} d={`M${-150 + i * 8},${-640 + i * 60} L${150 - i * 8},${-640 + i * 60}`} stroke={H.ln} strokeWidth={1.4} opacity={0.25} />)}
        <rect x={-150} y={-330} width={300} height={330} fill="url(#hTile)" stroke={LN} strokeWidth={4} />
        <path d="M-90,0 L-90,-200 Q0,-280 90,-200 L90,0Z" fill="#1E120A" stroke={P.gold} strokeWidth={6} />
        {/* ateş */}
        {[0, 1, 2].map((i) => {
          const f = Math.sin(t * 8 + i * 2) * 8;
          return <path key={i} d={`M${-40 + i * 40},-10 C${-60 + i * 40},-60 ${-30 + i * 40 + f},-90 ${-20 + i * 40},${-130 - f} C${0 + i * 40},-90 ${-10 + i * 40},-50 ${-10 + i * 40},-10Z`} fill={i === 1 ? "#FFD27A" : "#F08A3A"} opacity={0.9} />;
        })}
        <ellipse cx={0} cy={-60} rx={170} ry={130} fill="url(#pBloom)" opacity={0.5 + 0.1 * Math.sin(t * 7)} />
      </g>
      {/* büyük kemerli pencere (kafes + ay ışığı) */}
      <g transform={`translate(1500,${FL - 120})`}>
        <path d="M-200,0 L-200,-420 A200,200 0 0 1 200,-420 L200,0Z" fill="url(#pNightSky)" />
        <circle cx={70} cy={-470} r={46} fill="#F4F1E4" opacity={win} />
        <circle cx={70} cy={-470} r={110} fill="url(#pBloom)" opacity={0.35 * win} />
        <path d="M-200,0 L-200,-420 A200,200 0 0 1 200,-420 L200,0Z" fill="url(#hHoney)" opacity={0.85} />
        <path d="M-200,0 L-200,-420 A200,200 0 0 1 200,-420 L200,0Z" fill="none" stroke={H.wood2} strokeWidth={18} />
        <path d="M-222,0 L-222,-424 A222,222 0 0 1 222,-424 L222,0" fill="none" stroke={P.gold} strokeWidth={5} />
        <rect x={-240} y={0} width={480} height={28} fill={H.plaster2} stroke={LN} strokeWidth={3} />
        {/* perdeler */}
        <path d={`M-260,-640 C-230,-400 ${-250 + Math.sin(t) * 6},-200 -270,40 L-200,40 C-200,-200 -210,-420 -200,-640Z`} fill="#8E1F2A" stroke={LN} strokeWidth={3} />
        <path d={`M260,-640 C230,-400 ${250 + Math.sin(t + 1) * 6},-200 270,40 L200,40 C200,-200 210,-420 200,-640Z`} fill="#8E1F2A" stroke={LN} strokeWidth={3} />
        <path d="M-280,-660 L280,-660" stroke={P.gold} strokeWidth={10} />
      </g>
      {/* duvar nişleri: vazo, şamdan */}
      {[1000, 1110].map((nx, i) => (
        <g key={nx} transform={`translate(${nx},${FL - 400})`}>
          <path d="M-46,0 L-46,-150 A46,46 0 0 1 46,-150 L46,0Z" fill={H.plaster2} stroke={LN} strokeWidth={3} />
          {i === 0 ? <path d="M-16,-6 C-30,-30 -24,-60 -8,-70 L-8,-90 L8,-90 L8,-70 C24,-60 30,-30 16,-6Z" fill="#2B5DA8" stroke={LN} strokeWidth={2} /> : <path d="M-18,-6 L18,-6 L10,-30 L4,-30 L4,-90 L-4,-90 L-4,-30 L-10,-30Z" fill={P.gold} stroke={LN} strokeWidth={2} />}
        </g>
      ))}
      {/* çini lambri */}
      <rect y={FL - 260} width={1920} height={260} fill="url(#hTile)" />
      <rect y={FL - 272} width={1920} height={14} fill={H.cobalt} />
      <rect y={FL - 258} width={1920} height={5} fill={P.gold} />
      {/* zemin + halı */}
      <rect y={FL} width={1920} height={1080 - FL} fill="url(#hMarble)" />
      <path d={`M220,${FL + 30} L1700,${FL + 30} L1880,1080 L40,1080Z`} fill="url(#hCarpet)" stroke={P.gold} strokeWidth={6} />
      <path d={`M260,${FL + 50} L1660,${FL + 50} L1820,1064 L100,1064Z`} fill="none" stroke={H.cobalt} strokeWidth={8} />
      <rect y={FL} width={1920} height={30} fill="#2A1408" opacity={0.2} />
    </g>
  );
};

// sedir (zengin): yastıklar, püsküller, altın işleme
export const Sedir2: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 760 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-96} width={w} height={96} rx={8} fill={H.wood} stroke={LN} strokeWidth={3} />
    <rect x={-w / 2} y={-96} width={w} height={96} rx={8} fill="url(#pShadeL)" />
    <rect x={-w / 2 + 8} y={-136} width={w - 16} height={50} rx={18} fill="#8E1F2A" stroke={LN} strokeWidth={3} />
    <rect x={-w / 2 + 8} y={-136} width={w - 16} height={50} rx={18} fill="url(#pBrocade)" opacity={0.55} />
    {Array.from({ length: Math.floor(w / 60) }, (_, i) => <path key={i} d={`M${-w / 2 + 30 + i * 60},-86 l-4,22 M${-w / 2 + 30 + i * 60},-86 l4,22`} stroke={P.gold} strokeWidth={3} />)}
    {[-1, 0, 1].map((i) => (
      <g key={i}>
        <rect x={i * (w / 3.1) - 80} y={-262} width={160} height={130} rx={30} fill={i === 0 ? "#2B5DA8" : "#C9873B"} stroke={LN} strokeWidth={3} />
        <rect x={i * (w / 3.1) - 80} y={-262} width={160} height={130} rx={30} fill="url(#pBrocade)" opacity={0.5} />
        <rect x={i * (w / 3.1) - 80} y={-262} width={160} height={130} rx={30} fill="url(#pShadeL)" />
        {[-1, 1].map((sd) => <circle key={sd} cx={i * (w / 3.1) + sd * 78} cy={-252} r={7} fill={P.gold} stroke={LN} strokeWidth={1.4} />)}
      </g>
    ))}
  </g>
);

// şamdan (yerde, uzun)
export const Samdan: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-40,0 L40,0 L20,-30 L8,-30 L8,-300 L-8,-300 L-8,-30 L-20,-30Z" fill={P.gold} stroke={LN} strokeWidth={2.4} />
    <rect x={-10} y={-360} width={20} height={60} fill="#FBF6E8" stroke={LN} strokeWidth={2} />
    <path d={`M0,-362 C-7,-372 -4,-384 0,${-394 - 3 * Math.sin(t * 10)} C4,-384 7,-372 0,-362Z`} fill="#FFE39A" />
    <circle cx={0} cy={-380} r={60} fill="url(#pBloom)" opacity={0.6} />
  </g>
);

// ───────── mekân 3: has bahçe (gündüz) ─────────
export const HasBahce: React.FC<{ t: number; pan?: number }> = ({ t, pan = 0 }) => {
  const FL = 760;
  return (
    <g>
      <rect width={1920} height={FL} fill="url(#pDaySky)" />
      {/* bulutlar */}
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${((i * 700 + t * 12 - pan * 0.1) % 2400) - 200},${110 + i * 50})`} opacity={0.85}><ellipse rx={120} ry={34} fill="#FFFFFF" /><ellipse cx={70} cy={-18} rx={70} ry={30} fill="#FFFFFF" /><ellipse cx={-60} cy={-10} rx={60} ry={24} fill="#FFFFFF" /></g>)}
      {/* uzak Boğaz + Üsküdar silüeti */}
      <g transform={`translate(${-pan * 0.15},0)`}>
        <path d={`M-200,560 Q300,520 700,548 T1500,540 T2300,552 L2300,640 L-200,640Z`} fill="#9DB7C4" opacity={0.85} />
        {[300, 900, 1500].map((mx) => <g key={mx} transform={`translate(${mx},548)`} fill="#8AA3B2"><path d="M-60,0 a60,44 0 0 1 120,0Z" /><rect x={-80} y={-96} width={6} height={96} /><rect x={74} y={-90} width={6} height={90} /></g>)}
        <rect x={-200} y={600} width={2600} height={160} fill="url(#pWater)" />
        {Array.from({ length: 40 }, (_, i) => <rect key={i} x={(i * 97 + t * 30 * ((i % 3) + 1)) % 2400 - 200} y={620 + (i % 7) * 18} width={24 + (i % 4) * 8} height={2.4} fill="#FFFFFF" opacity={0.35 + 0.3 * Math.sin(t * 3 + i)} />)}
        {/* kayık */}
        <g transform={`translate(${(t * 40) % 2600 - 300},${660 + Math.sin(t * 2) * 3})`}><path d="M-60,0 Q0,18 60,0 L50,-8 L-50,-8Z" fill="#5E3B20" /><path d="M0,-8 L0,-60 L30,-14Z" fill="#F7F1E6" /></g>
      </g>
      {/* köşk (solda) */}
      <g transform={`translate(${260 - pan * 0.5},${FL})`}>
        <rect x={-200} y={-300} width={400} height={300} fill={H.plaster} stroke={LN} strokeWidth={4} />
        <path d="M-260,-300 L260,-300 L200,-360 L-200,-360Z" fill="#B8452F" stroke={LN} strokeWidth={4} />
        <path d="M-120,-360 Q0,-470 120,-360Z" fill="#7E8FA6" stroke={LN} strokeWidth={4} />
        <path d="M0,-470 L0,-510" stroke={P.gold} strokeWidth={6} /><circle cx={0} cy={-516} r={8} fill={P.gold} />
        {[-130, 0, 130].map((wx) => <g key={wx}><path d={`M${wx - 44},-60 L${wx - 44},-200 A44,44 0 0 1 ${wx + 44},-200 L${wx + 44},-60Z`} fill="#2C3B6E" stroke={H.wood2} strokeWidth={8} /><path d={`M${wx - 44},-60 L${wx - 44},-200 A44,44 0 0 1 ${wx + 44},-200 L${wx + 44},-60Z`} fill="url(#hHoney)" opacity={0.7} /></g>)}
        <rect x={-200} y={-300} width={400} height={300} fill="url(#pShadeL)" />
        <rect x={-210} y={-30} width={420} height={30} fill={H.plaster2} stroke={LN} strokeWidth={3} />
      </g>
      {/* selviler (orta plan) */}
      <g transform={`translate(${-pan * 0.6},0)`}>
        {[700, 820, 1560, 1680, 1800].map((cx, i) => {
          const h = 420 + (i % 2) * 60;
          const sw = Math.sin(t * 0.9 + i) * 3;
          return (
            <g key={cx}>
              <path d={`M${cx},${FL - h} C${cx + 40 + sw},${FL - h * 0.7} ${cx + 52},${FL - h * 0.25} ${cx + 36},${FL} L${cx - 36},${FL} C${cx - 52},${FL - h * 0.25} ${cx - 40 + sw},${FL - h * 0.7} ${cx},${FL - h}Z`} fill="#2F5A34" stroke="#1F3D22" strokeWidth={3} />
              <path d={`M${cx},${FL - h} C${cx + 40 + sw},${FL - h * 0.7} ${cx + 52},${FL - h * 0.25} ${cx + 36},${FL} L${cx + 6},${FL} C${cx + 18},${FL - h * 0.3} ${cx + 12},${FL - h * 0.7} ${cx},${FL - h}Z`} fill="#1F3D22" opacity={0.6} />
            </g>
          );
        })}
        {/* mermer korkuluk */}
        <rect x={-100} y={FL - 70} width={2400} height={16} fill="#F2EBDD" stroke={LN} strokeWidth={2} />
        {Array.from({ length: 40 }, (_, i) => <path key={i} d={`M${i * 60 - 90},${FL - 54} q-10,24 0,54 h18 q10,-30 0,-54Z`} fill="#EDE4D2" stroke={LN} strokeWidth={1.6} />)}
      </g>
      {/* zemin: çimen + taş yol */}
      <rect y={FL} width={1920} height={1080 - FL} fill="#7FA35A" />
      <rect y={FL} width={1920} height={20} fill="#5E8040" />
      <path d={`M0,${FL + 120} L1920,${FL + 120} L1920,${FL + 240} L0,${FL + 240}Z`} fill="#E6D7B8" stroke="#BFAE8A" strokeWidth={3} />
      <g transform={`translate(${-pan},0)`}>
        {Array.from({ length: 30 }, (_, i) => <path key={i} d={`M${i * 110 - 100},${FL + 120} l20,120`} stroke="#CDBB96" strokeWidth={3} />)}
      </g>
    </g>
  );
};

// şadırvan / fıskiye (canlı su)
export const Fiskiye: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={190} ry={40} fill="#E9E1D0" stroke={LN} strokeWidth={3} />
    <path d="M-190,0 L-190,-50 Q0,-90 190,-50 L190,0 Q0,40 -190,0Z" fill="#F2EBDD" stroke={LN} strokeWidth={3} />
    <ellipse cx={0} cy={-52} rx={176} ry={34} fill="url(#pWater)" />
    {[0, 1, 2].map((i) => <ellipse key={i} cx={0} cy={-52} rx={40 + ((t * 50 + i * 45) % 135)} ry={(40 + ((t * 50 + i * 45) % 135)) * 0.19} fill="none" stroke="#FFFFFF" strokeWidth={2} opacity={0.6 * (1 - ((t * 50 + i * 45) % 135) / 135)} />)}
    <path d="M-18,-52 L-12,-160 L12,-160 L18,-52Z" fill="#EDE4D2" stroke={LN} strokeWidth={2.4} />
    <ellipse cx={0} cy={-162} rx={56} ry={14} fill="#F2EBDD" stroke={LN} strokeWidth={2.4} />
    {[-1, 1].map((sd) => [0, 1, 2].map((j) => <path key={`${sd}${j}`} d={`M${sd * 6},-176 Q${sd * (50 + j * 14)},${-250 + j * 10} ${sd * (110 + j * 20)},-60`} stroke="#CDE7F2" strokeWidth={3} fill="none" strokeDasharray="10 14" strokeDashoffset={-t * 120 - j * 7} opacity={0.85} />))}
    <path d="M0,-176 L0,-230" stroke="#E6F4FA" strokeWidth={6} strokeDasharray="8 8" strokeDashoffset={-t * 80} />
  </g>
);

// lale tarhı (ön plan için bulanık da kullanılabilir)
export const Laleler: React.FC<{ x: number; y: number; n?: number; t: number; s?: number; blur?: number }> = ({ x, y, n = 9, t, s = 1, blur = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} filter={blur ? `url(#pBlur${blur})` : undefined}>
    {Array.from({ length: n }, (_, i) => {
      const sx = i * 46 + (i % 2) * 12, h = 120 + (i % 3) * 30;
      const sw = Math.sin(t * 1.4 + i * 0.7) * 6;
      const c = ["#C8243A", "#E6B422", "#D9467A", "#B8242C", "#F2C14E"][i % 5];
      return (
        <g key={i}>
          <path d={`M${sx},0 Q${sx + sw * 0.5},${-h / 2} ${sx + sw},${-h}`} stroke="#3F6B33" strokeWidth={5} fill="none" />
          <path d={`M${sx},-10 q-26,-30 -6,-70 q6,30 6,70Z`} fill="#4F7F3F" />
          <path d={`M${sx + sw - 14},${-h} C${sx + sw - 18},${-h - 30} ${sx + sw - 8},${-h - 40} ${sx + sw - 6},${-h - 46} L${sx + sw},${-h - 30} L${sx + sw + 6},${-h - 46} C${sx + sw + 8},${-h - 40} ${sx + sw + 18},${-h - 30} ${sx + sw + 14},${-h}Z`} fill={c} stroke={LN} strokeWidth={1.6} />
        </g>
      );
    })}
  </g>
);

// süzülen yapraklar / gül yaprakları
export const Petals: React.FC<{ t: number; n?: number; c?: string }> = ({ t, n = 18, c = "#F2B8C0" }) => (
  <g pointerEvents="none">
    {Array.from({ length: n }, (_, i) => {
      const h1 = Math.abs(Math.sin(i * 51.3)), h2 = Math.abs(Math.sin(i * 17.9));
      const px = ((h1 * 2200 - t * (40 + h2 * 50)) % 2200 + 2200) % 2200 - 140;
      const py = ((h2 * 1100 + t * (30 + h1 * 30)) % 1100);
      return <ellipse key={i} cx={px + Math.sin(t * 2 + i) * 20} cy={py} rx={7} ry={4} fill={c} opacity={0.8} transform={`rotate(${t * 90 + i * 40},${px},${py})`} />;
    })}
  </g>
);

// kuşlar (uzakta)
export const Birds: React.FC<{ t: number; n?: number }> = ({ t, n = 5 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const px = ((i * 330 + t * (80 + i * 10)) % 2300) - 200, py = 180 + i * 34 + Math.sin(t + i) * 10;
      const w = Math.sin(t * 9 + i) * 7;
      return <path key={i} d={`M${px - 14},${py - w} Q${px - 6},${py - 4} ${px},${py} Q${px + 6},${py - 4} ${px + 14},${py - w}`} stroke="#3A3530" strokeWidth={2.6} fill="none" />;
    })}
  </g>
);
