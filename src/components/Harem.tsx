import React from "react";
import { ramp } from "../lib/cues";
import { blinkAt, gait, tri, Walk } from "./Motion";

// Kanal 3 "harem" kiti (yeni motor yöntemi, 2026-11-01): GPT görselleriyle aynı dünyayı kodla çizer.
// Beyaz oval yüz + nokta gözler, krem başörtüsü, desenli uzun kaftan, İznik çini duvarlar, mermer zemin.
// Hepsi vektör: kamera yüze kadar yaklaşsa da keskin kalır. Ölçek: s=1 → ayaktan başa ~570 birim.

export const H = {
  ln: "#5A4430", plaster: "#EFE3C8", plaster2: "#E2CFA9", floor: "#EADFC8", floor2: "#D8C7A4",
  cobalt: "#2B5DA8", turq: "#2FA3A0", red: "#B8322E", gold: "#D6A640", cream: "#F6EEDC",
  wood: "#8A5A34", wood2: "#5E3B20", face: "#FFFDF8", hijab: "#EADBB6", hijab2: "#CDB68A",
  pink: "#E9A48F", blue: "#A9CADB", lilac: "#B9A6D2", sage: "#AFBE8C", ochre: "#DDAE5E", rose: "#D98C8C", teal: "#6FB1A8", beige: "#D9C8A8",
  purple: "#5B3A86", crimson: "#A3262A", green: "#3F6B33", black: "#2A2622", night: "#1C2440",
};
export const ROBES = [H.blue, H.lilac, H.sage, H.ochre, H.rose, H.teal, H.beige, H.pink];

const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ───────── tanımlar (desenler) — her SVG'de bir kez ─────────
export const HDefs: React.FC = () => (
  <defs>
    <pattern id="hTile" width="90" height="90" patternUnits="userSpaceOnUse">
      <rect width="90" height="90" fill="#F6F0E2" />
      <path d="M45,10 C58,28 58,36 45,45 C32,36 32,28 45,10Z M45,80 C32,62 32,54 45,45 C58,54 58,62 45,80Z M10,45 C28,32 36,32 45,45 C36,58 28,58 10,45Z M80,45 C62,58 54,58 45,45 C54,32 62,32 80,45Z" fill={H.cobalt} />
      <circle cx="45" cy="45" r="7" fill={H.red} />
      <circle cx="45" cy="45" r="3" fill={H.gold} />
      {[0, 90].map((x) => [0, 90].map((y) => <path key={`${x}${y}`} d={`M${x - 14},${y} Q${x},${y - 14} ${x + 14},${y} Q${x},${y + 14} ${x - 14},${y}Z`} fill={H.turq} />))}
      <path d="M0,0 L90,90 M90,0 L0,90" stroke={H.cobalt} strokeWidth="1.5" opacity="0.35" />
    </pattern>
    <pattern id="hTileS" width="44" height="44" patternUnits="userSpaceOnUse">
      <rect width="44" height="44" fill="#F3ECDD" />
      <path d="M22,5 C29,14 29,18 22,22 C15,18 15,14 22,5Z M22,39 C15,30 15,26 22,22 C29,26 29,30 22,39Z M5,22 C14,15 18,15 22,22 C18,29 14,29 5,22Z M39,22 C30,29 26,29 22,22 C26,15 30,15 39,22Z" fill={H.cobalt} opacity="0.85" />
      <circle cx="22" cy="22" r="3" fill={H.red} />
    </pattern>
    <pattern id="hDamask" width="46" height="46" patternUnits="userSpaceOnUse">
      <path d="M23,6 C31,14 31,20 23,24 C15,20 15,14 23,6Z M0,30 q8,-8 16,0 q-8,8 -16,0Z M30,30 q8,-8 16,0 q-8,8 -16,0Z" fill="#FFFFFF" opacity="0.5" />
      <circle cx="23" cy="36" r="2.5" fill="#FFFFFF" opacity="0.6" />
    </pattern>
    <pattern id="hGoldDamask" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M20,4 C28,12 28,18 20,22 C12,18 12,12 20,4Z M4,28 q8,-8 16,0 q-8,8 -16,0Z M20,28 q8,-8 16,0 q-8,8 -16,0Z" fill={H.gold} opacity="0.75" />
    </pattern>
    <pattern id="hHoney" width="36" height="62" patternUnits="userSpaceOnUse">
      <path d="M18,0 L36,10 L36,31 L18,41 L0,31 L0,10Z M18,41 L18,62" fill="none" stroke={H.wood} strokeWidth="5" />
    </pattern>
    <pattern id="hCarpet" width="70" height="70" patternUnits="userSpaceOnUse">
      <rect width="70" height="70" fill="#A8322C" />
      <path d="M35,8 L62,35 L35,62 L8,35Z" fill="none" stroke={H.gold} strokeWidth="4" />
      <circle cx="35" cy="35" r="7" fill={H.cobalt} />
      <circle cx="0" cy="0" r="6" fill={H.gold} /><circle cx="70" cy="70" r="6" fill={H.gold} /><circle cx="70" cy="0" r="6" fill={H.gold} /><circle cx="0" cy="70" r="6" fill={H.gold} />
    </pattern>
    <pattern id="hRunner" width="60" height="60" patternUnits="userSpaceOnUse">
      <rect width="60" height="60" fill="#3E6DB0" />
      <path d="M30,6 C40,18 40,24 30,30 C20,24 20,18 30,6Z M30,54 C20,42 20,36 30,30 C40,36 40,42 30,54Z" fill="#DCE6F2" opacity="0.8" />
    </pattern>
    <pattern id="hMarble" width="160" height="160" patternUnits="userSpaceOnUse">
      <rect width="160" height="160" fill={H.floor} />
      <path d="M0,0 H160 V160" fill="none" stroke={H.floor2} strokeWidth="3" />
      <path d="M20,40 q40,10 70,50 q20,30 60,40" fill="none" stroke="#FFFFFF" strokeWidth="2" opacity="0.6" />
    </pattern>
    <radialGradient id="hVig" cx="0.5" cy="0.5" r="0.75">
      <stop offset="0.6" stopColor="#5A3A18" stopOpacity="0" />
      <stop offset="1" stopColor="#3A2410" stopOpacity="0.38" />
    </radialGradient>
    <radialGradient id="hGlow" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stopColor="#FFE3A0" stopOpacity="0.95" />
      <stop offset="1" stopColor="#FFE3A0" stopOpacity="0" />
    </radialGradient>
    <linearGradient id="hShaft" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stopColor="#FFF4D6" stopOpacity="0.55" />
      <stop offset="1" stopColor="#FFF4D6" stopOpacity="0" />
    </linearGradient>
  </defs>
);

// tam ekran SVG çerçeve + kamera
export const HFrame: React.FC<{ children: React.ReactNode; dark?: number }> = ({ children, dark = 0 }) => (
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0, background: H.plaster }}>
    <HDefs />
    {children}
    {dark > 0 && <rect width="1920" height="1080" fill={H.night} opacity={dark} />}
    <rect width="1920" height="1080" fill="url(#hVig)" pointerEvents="none" />
  </svg>
);

// kamera: a→b arasında zoom ve odak kaydırma (yumuşak)
export const HCam: React.FC<{ t: number; a: number; b: number; z?: [number, number]; c0?: [number, number]; c1?: [number, number]; children: React.ReactNode }> = ({ t, a, b, z = [1, 1.08], c0 = [960, 540], c1, children }) => {
  const k = ease((t - a) / Math.max(0.01, b - a));
  const zz = lerp(z[0], z[1], k);
  const e = c1 ?? c0;
  const cx = lerp(c0[0], e[0], k), cy = lerp(c0[1], e[1], k);
  return <g transform={`translate(960,540) scale(${zz}) translate(${-cx},${-cy})`}>{children}</g>;
};

// ───────── karakterler ─────────
export type HFace = "normal" | "smile" | "sad" | "worried" | "shock" | "closed";
export type HKind = "girl" | "sultan" | "aga" | "valide" | "kalfa" | "efendi";
type FigP = {
  x: number; y: number; s?: number; kind?: HKind; robe?: string; robe2?: string; face?: HFace; t?: number; seed?: number;
  bow?: number; look?: number; hands?: "fold" | "tray" | "baby" | "mouth" | "down" | "jug"; old?: boolean; child?: boolean; sit?: boolean; glow?: number; dim?: number; cap?: string; talk?: number; op?: number;
  // hareket kiti (Motion.ts): walk = haremWalk() ile yürüme; reach = act() ile uzanma (0..1), item = elindeki nesne
  walk?: Walk; reach?: number; reachDir?: 1 | -1; item?: React.ReactNode;
};

const LW = 3.5;
const Eyes: React.FC<{ cx: number; cy: number; face: HFace; blink: boolean; look: number; bow: number }> = ({ cx, cy, face, blink, look, bow }) => {
  const ex = look * 9, ey = bow * 10;
  if (blink || face === "closed" || bow > 0.75)
    return <path d={`M${cx - 22 + ex},${cy + ey} q7,5 14,0 M${cx + 8 + ex},${cy + ey} q7,5 14,0`} stroke={H.ln} strokeWidth={3.5} fill="none" strokeLinecap="round" />;
  const ry = face === "shock" ? 9.5 : 7.5;
  return (
    <g>
      <ellipse cx={cx - 15 + ex} cy={cy + ey} rx={face === "shock" ? 6 : 5} ry={ry} fill={H.black} />
      <ellipse cx={cx + 15 + ex} cy={cy + ey} rx={face === "shock" ? 6 : 5} ry={ry} fill={H.black} />
      <circle cx={cx - 13.5 + ex} cy={cy - 3 + ey} r={1.6} fill="#fff" />
      <circle cx={cx + 16.5 + ex} cy={cy - 3 + ey} r={1.6} fill="#fff" />
      {face === "worried" && <path d={`M${cx - 24 + ex},${cy - 14 + ey} l14,-5 M${cx + 24 + ex},${cy - 14 + ey} l-14,-5`} stroke={H.ln} strokeWidth={3} strokeLinecap="round" />}
      {face === "sad" && <path d={`M${cx - 24 + ex},${cy - 12 + ey} l14,-4 M${cx + 24 + ex},${cy - 12 + ey} l-14,-4`} stroke={H.ln} strokeWidth={3} strokeLinecap="round" />}
      {(face === "normal" || face === "smile") && <path d={`M${cx - 25 + ex},${cy - 15 + ey} q9,-6 18,-1 M${cx + 7 + ex},${cy - 16 + ey} q9,-5 18,1`} stroke={H.ln} strokeWidth={2.6} fill="none" strokeLinecap="round" opacity={0.75} />}
      {face === "shock" && <path d={`M${cx - 25 + ex},${cy - 20 + ey} q9,-8 18,-2 M${cx + 7 + ex},${cy - 22 + ey} q9,-6 18,2`} stroke={H.ln} strokeWidth={2.8} fill="none" strokeLinecap="round" />}
    </g>
  );
};
const Mouth: React.FC<{ cx: number; cy: number; face: HFace; look: number; open: boolean }> = ({ cx, cy, face, look, open }) => {
  const x = cx + look * 9;
  if (face === "shock" || open) return <ellipse cx={x} cy={cy + 2} rx={5} ry={6} fill={H.ln} />;
  if (face === "sad" || face === "worried") return <path d={`M${x - 8},${cy + 4} q8,-6 16,0`} stroke={H.ln} strokeWidth={3} fill="none" strokeLinecap="round" />;
  if (face === "smile") return <path d={`M${x - 10},${cy - 2} q10,10 20,0`} stroke={H.ln} strokeWidth={3} fill="none" strokeLinecap="round" />;
  return <path d={`M${x - 7},${cy} q7,4 14,0`} stroke={H.ln} strokeWidth={3} fill="none" strokeLinecap="round" />;
};

export const HFig: React.FC<FigP> = ({
  x, y, s = 1, kind = "girl", robe, robe2, face = "normal", t = 0, seed = 0, bow = 0, look = 0, hands = "fold", sit = false, glow = 0, dim = 0, cap, talk = 0, op = 1, old = false, child = false, walk, reach = 0, reachDir, item,
}) => {
  const blink = blinkAt(t, seed);
  const open = talk > 0 && Math.sin(t * 19 + seed) > 0.1;
  const breathe = Math.sin(t * 1.6 + seed) * 2;
  const dy = sit ? 150 : 0;
  const R = robe ?? (kind === "efendi" ? "#4C6A86" : kind === "sultan" ? H.green : kind === "aga" ? H.black : kind === "valide" ? H.crimson : kind === "kalfa" ? H.purple : H.pink);
  const R2 = robe2 ?? (kind === "efendi" ? "#E8E2D2" : kind === "sultan" ? "#2F8A86" : kind === "aga" ? "#3A332C" : kind === "valide" ? "#E9C37A" : kind === "kalfa" ? "#7B5CA8" : "#F5E8CC");
  const man = kind === "sultan" || kind === "aga" || kind === "efendi";
  const hw = kind === "sultan" ? 136 : 126;
  const standRobe = `M${-(hw - 66)},-338 C${-(hw - 34)},-300 ${-(hw - 22)},-190 ${-hw},-10 Q0,6 ${hw},-10 C${hw - 22},-190 ${hw - 34},-300 ${hw - 66},-338 Z`;
  const sitRobe = `M-60,-188 C-96,-160 -126,-120 -150,-96 C-176,-70 -172,-28 -160,-8 Q0,8 160,-8 C172,-28 176,-70 150,-96 C126,-120 96,-160 60,-188Z`;
  const robeD = sit ? sitRobe : standRobe;
  const faceCy = -452 + dy + bow * 10;
  const HS = man ? 0.8 : 0.74;
  // yürüme: terlik uçları eteğin altından sırayla görünür, destek ayağı yerde kilitli; gövde adım arasında iner,
  // geçişte yükselir; etek her adımda savrulur; kollar karşı yönde sallanır.
  const W = walk && !sit ? walk : null;
  const wa = W ? W.amp : 0, wd = W ? W.dir : 1;
  const wt = W ? tri(W.ph) : 0;
  const wBob = W ? -7 * wa * (1 - Math.abs(wt)) + 3 * wa : 0;
  const wRot = W ? 1.3 * wa * wt + 2 * wa * wd : 0;
  const wSkew = W ? -2.4 * wa * Math.sin(2 * W.ph) * wd : 0;
  const wArm = W ? 7 * wa * wt * wd : 0;
  const foot = (side: 1 | -1) => {
    if (!W) return null;
    const fx = side * wd * HAREM_F * wa * wt;
    const lift = wa * Math.max(0, side * Math.cos(W.ph));
    const c = man ? "#3A2A1E" : kind === "valide" ? "#8E2A22" : "#7A3A2A";
    return (
      <g key={`ft${side}`} transform={`translate(${fx + side * 26},${-lift * 16}) scale(${wd},1)`} opacity={Math.min(1, wa * 3)}>
        <path d="M-26,-12 C-26,2 -20,6 -10,6 L24,6 C36,6 44,0 48,-8 C38,-4 30,-10 22,-14 Z" fill={c} stroke={H.ln} strokeWidth={2.5} strokeLinejoin="round" />
      </g>
    );
  };
  // uzanma: kol omuzdan nesneye doğru açılır (fold / down / erkek figürlerde)
  const rOk = reach !== 0 && !sit && (hands === "fold" || hands === "down" || man);
  const rs: 1 | -1 = reachDir ?? (look < 0 ? -1 : 1);
  const hideR = rOk && rs > 0, hideL = rOk && rs < 0;
  const reachArm = () => {
    if (!rOk) return null;
    const k = reach;
    const h0 = hands === "down" || man ? [93, -166] : [9, -226];
    const h1 = [250, -312];
    const hx = h0[0] + (h1[0] - h0[0]) * k, hy = h0[1] + (h1[1] - h0[1]) * k;
    const sx = 60, sy = -326;
    const bend = 46 * (1 - Math.max(0, Math.min(1, k))) + 14;
    const mx = (sx + hx) / 2, my = (sy + hy) / 2;
    const L = Math.hypot(hx - sx, hy - sy) || 1;
    const ex = mx - ((hy - sy) / L) * bend, ey = my + ((hx - sx) / L) * bend;
    const pts = `${sx},${sy} ${ex},${ey} ${hx - (hx - ex) * 0.12},${hy - (hy - ey) * 0.12}`;
    return (
      <g transform={`scale(${rs},1)`}>
        <polyline points={pts} fill="none" stroke={H.ln} strokeWidth={40 + LW * 2} strokeLinecap="round" strokeLinejoin="round" />
        <polyline points={pts} fill="none" stroke={R} strokeWidth={40} strokeLinecap="round" strokeLinejoin="round" />
        <ellipse cx={hx} cy={hy} rx={16} ry={13} fill={H.face} stroke={H.ln} strokeWidth={2.5} />
        {item && <g transform={`translate(${hx},${hy - 10}) scale(${rs},1)`}>{item}</g>}
      </g>
    );
  };
  const headT = `translate(0,${bow * 12 + breathe * 0.5}) rotate(${look * 3 + Math.sin(t * 0.7 + seed) * 1.4},0,${-336 + dy}) translate(0,${-336 + dy}) scale(${HS}) translate(0,${336 - dy})`;
  return (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${Math.sin(t * 0.9 + seed * 2.1) * 0.9 + wRot}) translate(0,${wBob})`} opacity={op * (1 - dim * 0.55)}>
      {glow > 0 && <ellipse cx={0} cy={-280 + dy / 2} rx={260} ry={380} fill="url(#hGlow)" opacity={glow} />}
      <ellipse cx={0} cy={0} rx={sit ? 170 : 120} ry={16} fill="#3A2410" opacity={0.18} />
      {/* valide: arkadan dökülen tül */}
      {foot(-1)}{foot(1)}
      {kind === "valide" && <path d={`M-60,${-540 + dy} C-130,${-420 + dy} -150,${-200 + dy} -140,${-30 + dy * 0.2} L140,${-30 + dy * 0.2} C150,${-200 + dy} 130,${-420 + dy} 60,${-540 + dy}Z`} fill="#F7F1E6" opacity={0.75} stroke={H.ln} strokeWidth={2} />}
      {/* kaftan */}
      <g transform={`translate(0,${breathe * 0.3}) translate(0,-338) skewX(${wSkew}) translate(0,338)`}>
        <path d={robeD} fill={R} stroke={H.ln} strokeWidth={LW} strokeLinejoin="round" />
        <path d={robeD} fill={kind === "sultan" || kind === "valide" ? "url(#hGoldDamask)" : "url(#hDamask)"} opacity={kind === "aga" ? 0.08 : 0.45} />
        {!sit && <path d={`M-22,${-330} C-28,-220 -36,-110 -44,-7 L44,-7 C36,-110 28,-220 22,-330Z`} fill={R2} stroke={kind === "aga" ? "#6E5A3A" : H.gold} strokeWidth={4} />}
        {!sit && <path d={`M${-hw + 8},-50 Q0,-34 ${hw - 8},-50 L${hw - 2},-24 Q0,-6 ${-hw + 2},-24Z`} fill={kind === "aga" ? "#6E5A3A" : H.gold} stroke={H.ln} strokeWidth={2} opacity={0.9} />}
        {!sit && kind !== "aga" && Array.from({ length: 9 }, (_, i) => <circle key={`hb${i}`} cx={-hw + 26 + i * ((hw * 2 - 52) / 8)} cy={-36 + Math.abs(i - 4) * -1.5} r={4.5} fill={kind === "sultan" || kind === "valide" ? H.red : H.cobalt} />)}
        {!sit && kind !== "aga" && [0, 1, 2, 3, 4, 5].map((i) => <circle key={`bt${i}`} cx={0} cy={-300 + i * 40} r={4} fill={H.gold} stroke={H.ln} strokeWidth={1.2} />)}
        {sit && <path d={`M-24,-180 C-40,-120 -60,-60 -70,-6 L70,-6 C60,-60 40,-120 24,-180Z`} fill={R2} stroke={H.gold} strokeWidth={4} />}
        {kind === "aga" && [0, 1, 2, 3, 4].map((i) => <circle key={i} cx={0} cy={-300 + dy + i * 52 * (sit ? 0.4 : 1)} r={6} fill={H.gold} />)}
        <path d={`M-62,${-268 + dy} Q0,${-256 + dy} 62,${-268 + dy} L60,${-252 + dy} Q0,${-240 + dy} -60,${-252 + dy}Z`} fill={kind === "aga" ? "#8C6A3A" : H.gold} stroke={H.ln} strokeWidth={2.5} />
        {(kind === "sultan" || kind === "valide") && (
          <>
            <path d={`M-80,${-352 + dy} C-62,${-300 + dy} -44,${-250 + dy} -26,${-120 + dy * 0.6} L-48,${-120 + dy * 0.6} C-74,${-250 + dy} -96,${-300 + dy} -80,${-352 + dy}Z`} fill="#7A5634" stroke={H.ln} strokeWidth={2.5} />
            <path d={`M80,${-352 + dy} C62,${-300 + dy} 44,${-250 + dy} 26,${-120 + dy * 0.6} L48,${-120 + dy * 0.6} C74,${-250 + dy} 96,${-300 + dy} 80,${-352 + dy}Z`} fill="#7A5634" stroke={H.ln} strokeWidth={2.5} />
          </>
        )}
        {kind === "kalfa" && (
          <g transform={`translate(34,${-236 + dy})`}>
            <circle r={14} fill="none" stroke={H.gold} strokeWidth={5} />
            <path d="M-4,12 v46 h12 M-4,40 h10 M8,12 v34 h10" stroke={H.gold} strokeWidth={5} fill="none" strokeLinecap="round" />
          </g>
        )}
      </g>
      {/* kollar ve eller */}
      <g transform={`translate(0,${dy})`}>
        {hands === "down" || man ? (
          <>
            {!hideL && <g transform={`rotate(${wArm},-66,-336)`}>
              <path d="M-66,-336 C-104,-300 -112,-230 -110,-176 L-76,-176 C-74,-230 -66,-280 -50,-316Z" fill={R} stroke={H.ln} strokeWidth={LW} />
              <ellipse cx={-93} cy={-166} rx={15} ry={13} fill={H.face} stroke={H.ln} strokeWidth={2.5} />
            </g>}
            {!hideR && <g transform={`rotate(${-wArm},66,-336)`}>
              <path d="M66,-336 C104,-300 112,-230 110,-176 L76,-176 C74,-230 66,-280 50,-316Z" fill={R} stroke={H.ln} strokeWidth={LW} />
              <ellipse cx={93} cy={-166} rx={15} ry={13} fill={H.face} stroke={H.ln} strokeWidth={2.5} />
            </g>}
          </>
        ) : hands === "mouth" ? (
          <>
            <path d="M-58,-336 C-86,-300 -84,-240 -56,-212 L-6,-226 C-20,-250 -34,-290 -40,-318Z" fill={R} stroke={H.ln} strokeWidth={LW} />
            <path d="M58,-336 C84,-330 90,-380 64,-420 L44,-410 C58,-380 52,-350 40,-318Z" fill={R} stroke={H.ln} strokeWidth={LW} />
            <ellipse cx={-6} cy={-224} rx={16} ry={11} fill={H.face} stroke={H.ln} strokeWidth={2.5} />
          </>
        ) : (
          <>
            {!hideL && <path d="M-58,-336 C-90,-300 -88,-236 -58,-210 L-4,-224 C-20,-250 -34,-290 -40,-318Z" fill={R} stroke={H.ln} strokeWidth={LW} />}
            {!hideR && <path d="M58,-336 C90,-300 88,-236 58,-210 L4,-224 C20,-250 34,-290 40,-318Z" fill={R} stroke={H.ln} strokeWidth={LW} />}
            {hands === "tray" ? (
              <g>
                <ellipse cx={0} cy={-214} rx={84} ry={15} fill="#C8CCD2" stroke={H.ln} strokeWidth={2.5} />
                <ellipse cx={0} cy={-218} rx={70} ry={10} fill="#DDE1E6" />
                <path d="M-14,-246 h28 l-4,24 h-20Z" fill="#F7F3EA" stroke={H.ln} strokeWidth={2} />
                <ellipse cx={-30} cy={-214} rx={14} ry={10} fill={H.face} stroke={H.ln} strokeWidth={2} />
                <ellipse cx={30} cy={-214} rx={14} ry={10} fill={H.face} stroke={H.ln} strokeWidth={2} />
              </g>
            ) : hands === "jug" ? (
              <g>
                <path d="M-34,-300 C-60,-290 -62,-240 -40,-214 L40,-214 C62,-240 60,-290 34,-300 L22,-318 L-22,-318Z" fill="#C8763A" stroke={H.ln} strokeWidth={2.5} />
                <path d="M-40,-262 Q0,-252 40,-262" stroke="#E7A266" strokeWidth={5} fill="none" />
                <path d="M34,-296 q26,8 22,40" stroke="#9A5526" strokeWidth={6} fill="none" />
                <ellipse cx={-38} cy={-236} rx={15} ry={11} fill={H.face} stroke={H.ln} strokeWidth={2.5} />
                <ellipse cx={38} cy={-236} rx={15} ry={11} fill={H.face} stroke={H.ln} strokeWidth={2.5} />
              </g>
            ) : hands === "baby" ? (
              <g>
                <ellipse cx={0} cy={-236} rx={58} ry={34} fill="#F7F1E6" stroke={H.ln} strokeWidth={2.5} />
                <circle cx={-26} cy={-244} r={18} fill={H.face} stroke={H.ln} strokeWidth={2} />
                <path d="M-32,-246 q3,3 6,0 M-22,-246 q3,3 6,0" stroke={H.ln} strokeWidth={2} fill="none" />
                <path d="M-44,-260 q18,-16 36,0" stroke={H.gold} strokeWidth={5} fill="none" />
              </g>
            ) : (
              <>
                {!hideL && <ellipse cx={-9} cy={-222} rx={16} ry={11} fill={H.face} stroke={H.ln} strokeWidth={2.5} />}
                {!hideR && <ellipse cx={9} cy={-226} rx={16} ry={11} fill={H.face} stroke={H.ln} strokeWidth={2.5} />}
              </>
            )}
          </>
        )}
      </g>
      {reachArm()}
      {/* baş */}
      <g transform={headT}>
        {!man && (
          <>
            <path d={`M0,${-566 + dy} C-58,${-566 + dy} -82,${-522 + dy} -82,${-462 + dy} C-82,${-418 + dy} -72,${-396 + dy} -62,${-382 + dy} C-104,${-364 + dy} -124,${-322 + dy} -110,${-290 + dy} Q0,${-262 + dy} 110,${-290 + dy} C124,${-322 + dy} 104,${-364 + dy} 62,${-382 + dy} C72,${-396 + dy} 82,${-418 + dy} 82,${-462 + dy} C82,${-522 + dy} 58,${-566 + dy} 0,${-566 + dy}Z`} fill={old ? "#E4E0D6" : kind === "kalfa" ? "#E7DDEE" : H.hijab} stroke={H.ln} strokeWidth={LW} />
            <path d={`M-80,${-322 + dy} Q0,${-290 + dy} 80,${-322 + dy} M-60,${-380 + dy} Q0,${-350 + dy} 60,${-380 + dy}`} stroke={H.hijab2} strokeWidth={3} fill="none" />
            <ellipse cx={look * 5} cy={faceCy - 2} rx={51} ry={61} fill={H.hijab2} opacity={0.55} />
          </>
        )}
        <ellipse cx={look * 5} cy={faceCy} rx={man ? 50 : 45} ry={man ? 58 : 55} fill={H.face} stroke={H.ln} strokeWidth={3} />
        {!man && <><ellipse cx={look * 5 - 27} cy={faceCy + 16} rx={10} ry={6} fill="#F2A7A0" opacity={face === "sad" ? 0.2 : 0.42} /><ellipse cx={look * 5 + 27} cy={faceCy + 16} rx={10} ry={6} fill="#F2A7A0" opacity={face === "sad" ? 0.2 : 0.42} /></>}
        <Eyes cx={look * 5} cy={faceCy - 4} face={face} blink={blink} look={look} bow={bow} />
        {old && <path d={`M${look * 5 - 36},${faceCy - 2} l-7,-4 M${look * 5 - 36},${faceCy + 4} l-8,2 M${look * 5 + 36},${faceCy - 2} l7,-4 M${look * 5 + 36},${faceCy + 4} l8,2 M${look * 5 - 16},${faceCy - 30} q16,-6 32,0 M${look * 5 - 26},${faceCy + 22} q-4,10 2,18 M${look * 5 + 26},${faceCy + 22} q4,10 -2,18`} stroke="#B9A88E" strokeWidth={2.4} fill="none" strokeLinecap="round" />}
        {(kind === "sultan" || kind === "efendi") && !child && (
          <>
            <path d={`M-46,${faceCy + 6} C-50,${faceCy + 66} -12,${faceCy + 90} 0,${faceCy + 92} C12,${faceCy + 90} 50,${faceCy + 66} 46,${faceCy + 6} C34,${faceCy + 36} -34,${faceCy + 36} -46,${faceCy + 6}Z`} fill="#3E2C20" stroke={H.ln} strokeWidth={2.5} />
            <path d={`M-26,${faceCy + 24} q13,-10 26,-2 q13,-8 26,2 q-13,6 -26,2 q-13,4 -26,-2Z`} fill="#3E2C20" />
          </>
        )}
        {kind === "aga" && <path d={`M-24,${faceCy + 22} q12,-10 24,-2 q12,-8 24,2 q-12,6 -24,2 q-12,4 -24,-2Z`} fill="#2B211A" />}
        {(!(kind === "sultan" || kind === "efendi") || child) && <Mouth cx={look * 5} cy={faceCy + (kind === "aga" ? 36 : 30)} face={face} look={look} open={open} />}
        {kind === "sultan" && (
          <g>
            <ellipse cx={0} cy={faceCy - 74} rx={78} ry={60} fill="#FBF8F0" stroke={H.ln} strokeWidth={LW} />
            <path d={`M-72,${faceCy - 60} Q0,${faceCy - 110} 72,${faceCy - 60} M-66,${faceCy - 86} Q0,${faceCy - 126} 66,${faceCy - 86}`} stroke="#D9D2C0" strokeWidth={4} fill="none" />
            <path d={`M-6,${faceCy - 112} q-6,-50 10,-82 q10,40 -2,82Z`} fill="#2F2A24" />
            <circle cx={0} cy={faceCy - 108} r={12} fill={H.red} stroke={H.gold} strokeWidth={4} />
            <path d={`M-58,${faceCy - 36} Q0,${faceCy - 22} 58,${faceCy - 36}`} stroke={H.gold} strokeWidth={6} fill="none" />
          </g>
        )}
        {kind === "efendi" && (
          <g>
            <ellipse cx={0} cy={faceCy - 70} rx={70} ry={50} fill="#FBF8F0" stroke={H.ln} strokeWidth={LW} />
            <path d={`M-64,${faceCy - 60} Q0,${faceCy - 100} 64,${faceCy - 60} M-58,${faceCy - 82} Q0,${faceCy - 116} 58,${faceCy - 82}`} stroke="#D9D2C0" strokeWidth={4} fill="none" />
            <ellipse cx={0} cy={faceCy - 112} rx={22} ry={12} fill={cap ?? "#C9302C"} stroke={H.ln} strokeWidth={2.5} />
          </g>
        )}
        {kind === "aga" && (
          <g>
            <path d={`M-40,${faceCy - 34} L-30,${faceCy - 196} Q0,${faceCy - 226} 30,${faceCy - 196} L40,${faceCy - 34}Z`} fill="#FBF8F0" stroke={H.ln} strokeWidth={LW} />
            <path d={`M-42,${faceCy - 46} Q0,${faceCy - 32} 42,${faceCy - 46} L40,${faceCy - 30} Q0,${faceCy - 16} -40,${faceCy - 30}Z`} fill="#3A332C" />
          </g>
        )}
        {kind === "valide" && <path d={`M-34,${faceCy - 58} l0,-34 l17,16 l17,-28 l17,28 l17,-16 l0,34Z`} fill={H.gold} stroke={H.ln} strokeWidth={2.5} />}
        {(kind === "kalfa" || (cap && kind !== "efendi")) && (
          <g>
            <path d={`M-44,${faceCy - 52} L-40,${faceCy - 96} Q0,${faceCy - 108} 40,${faceCy - 96} L44,${faceCy - 52} Q0,${faceCy - 42} -44,${faceCy - 52}Z`} fill={cap ?? H.purple} stroke={H.ln} strokeWidth={2.5} />
            <path d={`M-44,${faceCy - 58} Q0,${faceCy - 48} 44,${faceCy - 58}`} stroke={H.gold} strokeWidth={5} fill="none" />
          </g>
        )}
      </g>
    </g>
  );
};

// yürüme sabitleri: terlik ucu merkezden ±HAREM_F birim açılır → bir adım 2·F (gerçek insan adımı ≈ boyun %40'ı)
export const HAREM_F = 110;
export const HAREM_STRIDE = 2 * HAREM_F;
// x0→x1 yürü (a→b sn): HFig'e x ve walk ver. Doğal hız ≈ 450·s px/sn (1500 px ≈ 3 sn).
export const haremWalk = (t: number, a: number, b: number, x0: number, x1: number, s = 1) => {
  const g = gait(t, a, b, x0, x1, HAREM_STRIDE * s);
  return { x: g.x, walk: g.walk, look: g.walk.dir * 0.55 * Math.min(1, g.walk.amp * 2) };
};

// küçük kalabalık figürü (uzak plan, yüzlerce kez çizilir)
export const HTiny: React.FC<{ x: number; y: number; s?: number; c: string; lit?: number }> = ({ x, y, s = 1, c, lit = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {lit > 0 && <ellipse cx={0} cy={-34} rx={46} ry={60} fill="url(#hGlow)" opacity={lit} />}
    <path d="M-12,-34 C-18,-20 -20,-8 -22,0 L22,0 C20,-8 18,-20 12,-34Z" fill={lit > 0.5 ? H.gold : c} stroke={H.ln} strokeWidth={1.5} />
    <path d="M0,-58 C-14,-58 -17,-46 -16,-38 C-16,-32 -14,-30 0,-28 C14,-30 16,-32 16,-38 C17,-46 14,-58 0,-58Z" fill={H.hijab} stroke={H.ln} strokeWidth={1.5} />
    <ellipse cx={0} cy={-44} rx={8} ry={10} fill={H.face} />
    <circle cx={-3} cy={-45} r={1.4} fill={H.black} /><circle cx={3} cy={-45} r={1.4} fill={H.black} />
  </g>
);

// ───────── mekânlar ─────────
export const Lantern: React.FC<{ x: number; y: number; s?: number; t?: number; on?: number }> = ({ x, y, s = 1, t = 0, on = 1 }) => {
  const f = 0.85 + 0.15 * Math.sin(t * 9 + x) * Math.sin(t * 5.3);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <line x1={0} y1={-400} x2={0} y2={-70} stroke={H.wood2} strokeWidth={3} />
      {on > 0 && <ellipse cx={0} cy={0} rx={150} ry={150} fill="url(#hGlow)" opacity={0.55 * on * f} />}
      <path d="M-10,-70 L10,-70 L22,-50 L-22,-50Z" fill={H.gold} stroke={H.ln} strokeWidth={2.5} />
      <path d="M-30,-50 L30,-50 L38,30 Q0,48 -38,30Z" fill={on > 0 ? `rgba(255,214,130,${0.55 + 0.4 * on * f})` : "#6E5A3A"} stroke={H.ln} strokeWidth={3} />
      <path d="M-30,-50 L-38,30 M0,-50 L0,40 M30,-50 L38,30 M-34,-10 Q0,0 34,-10" stroke={H.wood2} strokeWidth={3} fill="none" />
      <path d="M-20,40 L20,40 L0,64Z" fill={H.gold} stroke={H.ln} strokeWidth={2.5} />
    </g>
  );
};

export const Sedir: React.FC<{ x: number; y: number; w?: number; c?: string; cushions?: number }> = ({ x, y, w = 620, c = "#B8452F", cushions = 1 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-90} width={w} height={90} rx={10} fill={H.wood} stroke={H.ln} strokeWidth={3} />
    <rect x={-w / 2 + 10} y={-128} width={w - 20} height={46} rx={18} fill={c} stroke={H.ln} strokeWidth={3} />
    <rect x={-w / 2 + 10} y={-128} width={w - 20} height={46} rx={18} fill="url(#hGoldDamask)" opacity={0.4} />
    {[-1, 0, 1].map((i) => (
      <g key={i} opacity={cushions}>
        <rect x={i * (w / 3.2) - 70} y={-236} width={140} height={112} rx={26} fill={i === 0 ? H.cobalt : "#C9873B"} stroke={H.ln} strokeWidth={3} />
        <rect x={i * (w / 3.2) - 70} y={-236} width={140} height={112} rx={26} fill="url(#hDamask)" opacity={0.5} />
      </g>
    ))}
  </g>
);

// gökyüzü: k=0 sabah, 0.5 gün batımı, 1 gece
export const Sky: React.FC<{ w: number; h: number; k: number; city?: boolean }> = ({ w, h, k, city = true }) => {
  const top = k < 0.5 ? mix("#9CCBE6", "#E79A63", k * 2) : mix("#E79A63", "#16213F", (k - 0.5) * 2);
  const bot = k < 0.5 ? mix("#E4F1F6", "#F6CF8C", k * 2) : mix("#F6CF8C", "#2E3A63", (k - 0.5) * 2);
  return (
    <g>
      <rect width={w} height={h} fill={top} />
      <rect y={h * 0.45} width={w} height={h * 0.55} fill={bot} opacity={0.8} />
      {k < 0.7 && <circle cx={w * 0.7} cy={h * (0.25 + k * 0.6)} r={w * 0.07} fill="#FFF3C4" opacity={1 - k} />}
      {k > 0.6 && <circle cx={w * 0.3} cy={h * 0.22} r={w * 0.06} fill="#F4F1E4" opacity={(k - 0.6) * 2.5} />}
      {city && (
        <g transform={`translate(0,${h * 0.72})`} fill={k > 0.6 ? "#253055" : "#7E8FA6"} opacity={0.9}>
          <rect x={w * 0.1} y={-h * 0.08} width={w * 0.8} height={h * 0.08} />
          <path d={`M${w * 0.3},${-h * 0.08} a${w * 0.12},${w * 0.09} 0 0 1 ${w * 0.24},0Z`} />
          <rect x={w * 0.26} y={-h * 0.28} width={w * 0.02} height={h * 0.2} />
          <rect x={w * 0.58} y={-h * 0.28} width={w * 0.02} height={h * 0.2} />
          <rect y={h * 0.0} width={w} height={h * 0.3} fill={k > 0.6 ? "#1D2A4D" : "#6DA6C8"} />
        </g>
      )}
    </g>
  );
};
const mix = (a: string, b: string, k: number) => {
  const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const A = p(a), B = p(b);
  return `rgb(${A.map((v, i) => Math.round(v + (B[i] - v) * Math.max(0, Math.min(1, k)))).join(",")})`;
};

// kemerli pencere (bal peteği kafes)
export const ArchWindow: React.FC<{ x: number; y: number; w?: number; h?: number; k?: number; lattice?: number }> = ({ x, y, w = 300, h = 440, k = 0.2, lattice = 1 }) => {
  const id = `aw${Math.round(x)}${Math.round(y)}`;
  const d = `M${-w / 2},0 L${-w / 2},${-h + w / 2} A${w / 2},${w / 2} 0 0 1 ${w / 2},${-h + w / 2} L${w / 2},0Z`;
  return (
    <g transform={`translate(${x},${y})`}>
      <clipPath id={id}><path d={d} /></clipPath>
      <g clipPath={`url(#${id})`}>
        <g transform={`translate(${-w / 2},${-h})`}><Sky w={w} h={h} k={k} /></g>
        <rect x={-w / 2} y={-h} width={w} height={h} fill="url(#hHoney)" opacity={lattice} />
      </g>
      <path d={d} fill="none" stroke={H.wood2} strokeWidth={12} />
      <path d={d} fill="none" stroke={H.gold} strokeWidth={3} transform="scale(1.05)" />
      <rect x={-w / 2 - 24} y={0} width={w + 48} height={22} fill={H.plaster2} stroke={H.ln} strokeWidth={3} />
    </g>
  );
};

// oda: üst sıva, alt çini, zemin halı. floorY = duvar dibi
export const Room: React.FC<{ t?: number; floorY?: number; win?: number | null; winX?: number; lamp?: number; carpet?: boolean; niche?: boolean }> = ({ t = 0, floorY = 820, win = 0.25, winX = 1460, lamp = 1, carpet = true, niche = true }) => (
  <g>
    <rect width={1920} height={floorY} fill={H.plaster} />
    {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 140} y={0} width={70} height={floorY} fill={H.plaster2} opacity={0.18} />)}
    <rect y={0} width={1920} height={70} fill="url(#hTileS)" />
    <rect y={66} width={1920} height={10} fill={H.cobalt} />
    <rect y={floorY - 300} width={1920} height={300} fill={H.plaster2} />
    {Array.from({ length: 7 }, (_, i) => (
      <g key={i}>
        <rect x={i * 300 - 110} y={floorY - 280} width={260} height={262} fill="url(#hTile)" />
        <rect x={i * 300 - 110} y={floorY - 280} width={260} height={262} fill="none" stroke={H.gold} strokeWidth={6} />
        <rect x={i * 300 - 116} y={floorY - 286} width={272} height={274} fill="none" stroke={H.cobalt} strokeWidth={4} />
      </g>
    ))}
    <rect y={floorY - 312} width={1920} height={14} fill={H.cobalt} />
    <rect y={floorY - 298} width={1920} height={5} fill={H.gold} />
    {niche && (
      <g transform={`translate(420,${floorY - 360})`}>
        <path d="M-120,0 L-120,-300 A120,120 0 0 1 120,-300 L120,0Z" fill={H.plaster2} stroke={H.ln} strokeWidth={4} />
        <path d="M-90,-10 L-90,-290 A90,90 0 0 1 90,-290 L90,-10Z" fill="url(#hTileS)" opacity={0.7} />
        <path d="M-40,-150 q-10,-60 20,-80 q-6,30 20,40 q10,-30 0,-60 q34,30 20,100Z" fill={H.cobalt} opacity={0.8} />
        <rect x={-60} y={-140} width={40} height={60} rx={10} fill={H.gold} stroke={H.ln} strokeWidth={2.5} />
        <path d="M20,-130 q20,-30 40,0 v50 h-40Z" fill="#4C7FB8" stroke={H.ln} strokeWidth={2.5} />
      </g>
    )}
    {win !== null && <ArchWindow x={winX} y={floorY - 380} w={320} h={480} k={win} />}
    {win !== null && <path d={`M${winX - 160},${floorY - 380} L${winX + 160},${floorY - 380} L${winX + 40},1080 L${winX - 420},1080Z`} fill="url(#hShaft)" opacity={0.45 * (1 - Math.min(1, win * 1.4))} />}
    <rect y={floorY} width={1920} height={1080 - floorY} fill="url(#hMarble)" />
    {carpet && (
      <g>
        <path d={`M300,${floorY + 40} L1620,${floorY + 40} L1820,1080 L100,1080Z`} fill="url(#hCarpet)" stroke={H.gold} strokeWidth={6} />
        <path d={`M340,${floorY + 62} L1580,${floorY + 62} L1760,1060 L160,1060Z`} fill="none" stroke={H.cobalt} strokeWidth={8} />
      </g>
    )}
    {lamp > 0 && <Lantern x={760} y={300} t={t} on={lamp} />}
  </g>
);

// koridor: perspektif, iki yanda çini ve kafesli pencereler, ortada mavi yolluk
export const Corridor: React.FC<{ t?: number; night?: number; door?: number }> = ({ t = 0, night = 0, door = 0 }) => {
  const VX = 960, top = 300, bot = 700, L = 760, Rr = 1160;
  return (
    <g>
      <rect width={1920} height={1080} fill={H.plaster} />
      {/* tavan */}
      <path d={`M0,0 L1920,0 L${Rr},${top} L${L},${top}Z`} fill={H.plaster2} />
      {[0.2, 0.45, 0.7].map((k) => <path key={k} d={`M${lerp(0, L, k)},${lerp(0, top, k)} Q${VX},${lerp(-60, top - 20, k)} ${lerp(1920, Rr, k)},${lerp(0, top, k)}`} fill="none" stroke={H.gold} strokeWidth={5 - k * 4} opacity={0.6} />)}
      {/* sol ve sağ duvar */}
      <path d={`M0,0 L${L},${top} L${L},${bot} L0,1080Z`} fill={H.plaster} stroke={H.ln} strokeWidth={2} />
      <path d={`M1920,0 L${Rr},${top} L${Rr},${bot} L1920,1080Z`} fill={H.plaster} stroke={H.ln} strokeWidth={2} />
      <path d={`M0,560 L${L},${lerp(top, bot, 0.55)} L${L},${bot} L0,1080Z`} fill="url(#hTile)" />
      <path d={`M1920,560 L${Rr},${lerp(top, bot, 0.55)} L${Rr},${bot} L1920,1080Z`} fill="url(#hTile)" />
      <path d={`M0,560 L${L},${lerp(top, bot, 0.55)}`} stroke={H.cobalt} strokeWidth={10} />
      <path d={`M1920,560 L${Rr},${lerp(top, bot, 0.55)}`} stroke={H.cobalt} strokeWidth={10} />
      {/* pencereler (sol duvarda) */}
      {[0.12, 0.42, 0.66].map((k, i) => {
        const x0 = lerp(0, L, k), x1 = lerp(0, L, k + 0.16);
        const y0a = lerp(0, top, k) + 120 * (1 - k), y0b = lerp(0, top, k + 0.16) + 120 * (1 - k - 0.16);
        const h0 = 340 * (1 - k * 0.62), h1 = 340 * (1 - (k + 0.16) * 0.62);
        return (
          <g key={i}>
            <path d={`M${x0},${y0a} L${x1},${y0b} L${x1},${y0b + h1} L${x0},${y0a + h0}Z`} fill={night > 0.5 ? "#2E3A63" : "#F9E7B8"} stroke={H.wood2} strokeWidth={8} />
            <path d={`M${x0},${y0a} L${x1},${y0b} L${x1},${y0b + h1} L${x0},${y0a + h0}Z`} fill="url(#hHoney)" opacity={0.8} />
            {night < 0.5 && <path d={`M${x0},${y0a + h0} L${x1},${y0b + h1} L${x1 + 520 * (1 - k)},${1080} L${x0 + 260 * (1 - k)},1080Z`} fill="url(#hShaft)" opacity={0.5 * (1 - night)} />}
          </g>
        );
      })}
      {/* sağ duvarda kapılar */}
      {[0.18, 0.55].map((k, i) => {
        const x0 = lerp(1920, Rr, k), x1 = lerp(1920, Rr, k + 0.14);
        const yb0 = lerp(1080, bot, k), yb1 = lerp(1080, bot, k + 0.14);
        const h0 = 470 * (1 - k * 0.6), h1 = 470 * (1 - (k + 0.14) * 0.6);
        return <path key={i} d={`M${x0},${yb0} L${x1},${yb1} L${x1},${yb1 - h1} Q${(x0 + x1) / 2},${(yb0 + yb1) / 2 - h0 - 60} ${x0},${yb0 - h0}Z`} fill={H.wood} stroke={H.ln} strokeWidth={4} />;
      })}
      {/* arka duvar ve kapı */}
      <rect x={L} y={top} width={Rr - L} height={bot - top} fill={H.plaster2} stroke={H.ln} strokeWidth={3} />
      <rect x={L} y={top + 230} width={Rr - L} height={bot - top - 230} fill="url(#hTileS)" />
      <path d={`M${VX - 90},${bot} L${VX - 90},${top + 150} A90,90 0 0 1 ${VX + 90},${top + 150} L${VX + 90},${bot}Z`} fill={door > 0 ? "#FFF0C8" : H.wood} stroke={H.ln} strokeWidth={4} />
      <path d={`M${VX},${bot} L${VX},${top + 70}`} stroke={H.wood2} strokeWidth={4} opacity={1 - door} />
      {/* zemin ve yolluk */}
      <path d={`M0,1080 L${L},${bot} L${Rr},${bot} L1920,1080Z`} fill="url(#hMarble)" />
      <path d={`M560,1080 L${VX - 70},${bot} L${VX + 70},${bot} L1360,1080Z`} fill="url(#hRunner)" stroke={H.gold} strokeWidth={5} />
      <Lantern x={VX} y={380} s={0.7} t={t} on={1} />
      <Lantern x={VX - 360} y={250} s={1} t={t} on={1} />
      <Lantern x={VX + 360} y={250} s={1} t={t + 1} on={1} />
    </g>
  );
};

// çini medalyon (bölüm numarası)
export const Medallion: React.FC<{ x: number; y: number; r?: number; n: number | string; k?: number; t?: number }> = ({ x, y, r = 170, n, k = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${k}) rotate(${(1 - k) * -40})`}>
    <g transform={`rotate(${t * 6})`}>
      {Array.from({ length: 16 }, (_, i) => (
        <path key={i} d={`M0,${-r - 46} C18,${-r - 20} 18,${-r} 0,${-r + 6} C-18,${-r} -18,${-r - 20} 0,${-r - 46}Z`} fill={i % 2 ? H.turq : H.cobalt} stroke={H.ln} strokeWidth={2} transform={`rotate(${i * 22.5})`} />
      ))}
    </g>
    <circle r={r} fill={H.cream} stroke={H.gold} strokeWidth={14} />
    <circle r={r - 22} fill="none" stroke={H.cobalt} strokeWidth={6} />
    <text y={r * 0.33} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={r * 1.05} fill={H.cobalt}>{n}</text>
  </g>
);

export const rmp = ramp;
