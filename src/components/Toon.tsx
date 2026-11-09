import React from "react";
import { ramp } from "../lib/cues";
import { blinkAt, gait, legs as gLegs, Walk } from "./Motion";

// Kanal 2 "toon" kiti (motor-only, 2026-11-01). Referans: düz renkli 2D animasyon (siyah yuvarlak kafa, büyük beyaz
// gözler, kapüşonlu, ince siyah bacaklar), detaylı ve parlak mekânlar. Hepsi vektör: kamera yaklaşınca da keskin.
// Ölçek: s=1 → ayaktan kafanın tepesine ~540 birim. Açılar derece: 0 = aşağı, + = baktığı yöne doğru.

export const T = {
  ink: "#141414", ink2: "#2A2A2A", white: "#FFFFFF", sky: "#BFE3F2", sky2: "#E8F5FA",
  hero: "#1FC8B4", hero2: "#159A8B", red: "#E0393E", red2: "#B02A2F", yellow: "#F6C445", yellow2: "#D9A52A",
  blue: "#3A7BD5", blue2: "#2A5DA8", purple: "#7E5BD6", pink: "#E86A92", green: "#3FAE6A", orange: "#F28C28",
  wall: "#F3E7D3", wall2: "#E6D5BA", wood: "#B07A4A", wood2: "#8A5A32", floor: "#D9C3A0", road: "#5E6670", rim: "#5FF2E2",
  night: "#0E1A2E", night2: "#1A2C48",
};

const ease = (x: number) => (x <= 0 ? 0 : x >= 1 ? 1 : x * x * (3 - 2 * x));
export const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
export const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
// anahtar kareler: [[t, v], ...] → v (yumuşak)
export const kf = (keys: [number, number][], t: number) => {
  if (t <= keys[0][0]) return keys[0][1];
  for (let i = 1; i < keys.length; i++) {
    const [ta, va] = keys[i - 1], [tb, vb] = keys[i];
    if (t <= tb) return lerp(va, vb, ease((t - ta) / Math.max(0.001, tb - ta)));
  }
  return keys[keys.length - 1][1];
};

// ───────── kamera ─────────
export const TCam: React.FC<{ t: number; a: number; b: number; z?: [number, number]; c0?: [number, number]; c1?: [number, number]; shake?: number; children: React.ReactNode }> = ({ t, a, b, z = [1, 1.06], c0 = [960, 540], c1, shake = 0, children }) => {
  const k = ease((t - a) / Math.max(0.01, b - a));
  const zz = lerp(z[0], z[1], k);
  const e = c1 ?? c0;
  const sx = shake ? Math.sin(t * 53) * shake + Math.sin(t * 31) * shake * 0.6 : 0;
  const sy = shake ? Math.cos(t * 47) * shake : 0;
  return <g transform={`translate(${960 + sx},${540 + sy}) scale(${zz}) translate(${-lerp(c0[0], e[0], k)},${-lerp(c0[1], e[1], k)})`}>{children}</g>;
};

export const TDefs: React.FC = () => (
  <defs>
    <radialGradient id="tVig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.62" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.3" /></radialGradient>
    <radialGradient id="tGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFF6C8" stopOpacity="0.95" /><stop offset="1" stopColor="#FFF6C8" stopOpacity="0" /></radialGradient>
    <radialGradient id="tRim" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor={T.rim} stopOpacity="0.9" /><stop offset="1" stopColor={T.rim} stopOpacity="0" /></radialGradient>
    <radialGradient id="tHead" cx="0.35" cy="0.3" r="0.8"><stop offset="0" stopColor="#3A3A3A" /><stop offset="0.45" stopColor={T.ink} /></radialGradient>
    <linearGradient id="tBeam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#FFF7D0" stopOpacity="0.85" /><stop offset="1" stopColor="#FFF7D0" stopOpacity="0" /></linearGradient>
    <linearGradient id="tSkyDay" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#9FD3EC" /><stop offset="1" stopColor="#E3F3F8" /></linearGradient>
    <linearGradient id="tSkyDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#3B3F7A" /><stop offset="0.6" stopColor="#E0766A" /><stop offset="1" stopColor="#F7C27A" /></linearGradient>
    <linearGradient id="tSkyNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0B1426" /><stop offset="1" stopColor="#1E3350" /></linearGradient>
    <pattern id="tBrick" width="60" height="30" patternUnits="userSpaceOnUse"><rect width="60" height="30" fill="#00000000" /><path d="M0,15 H60 M30,0 V15 M0,15 V30" stroke="#000" strokeOpacity="0.08" strokeWidth="2" /></pattern>
    <pattern id="tTile" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="80" height="80" fill="#00000000" /><path d="M0,0 H80 V80" fill="none" stroke="#000" strokeOpacity="0.07" strokeWidth="3" /></pattern>
    <pattern id="tStone" width="140" height="90" patternUnits="userSpaceOnUse"><rect width="140" height="90" fill="#00000000" /><path d="M0,45 H140 M70,0 V45 M20,45 V90 M110,45 V90" stroke="#5A3E25" strokeOpacity="0.18" strokeWidth="3" /></pattern>
    <pattern id="tCarpet" width="60" height="60" patternUnits="userSpaceOnUse"><rect width="60" height="60" fill="#B8352E" /><path d="M30,6 L54,30 L30,54 L6,30Z" fill="none" stroke="#F2C14E" strokeWidth="4" /><circle cx="30" cy="30" r="6" fill="#2C5AA0" /></pattern>
    <pattern id="tCarpet2" width="50" height="50" patternUnits="userSpaceOnUse"><rect width="50" height="50" fill="#2C5AA0" /><path d="M25,5 L45,25 L25,45 L5,25Z" fill="#E8D3A2" opacity="0.8" /><circle cx="25" cy="25" r="5" fill="#B8352E" /></pattern>
    <pattern id="tScan" width="6" height="6" patternUnits="userSpaceOnUse"><rect width="6" height="3" fill="#000" opacity="0.12" /></pattern>
  </defs>
);

export const TFrame: React.FC<{ children: React.ReactNode; bg?: string; vig?: number }> = ({ children, bg = T.sky2, vig = 1 }) => (
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0, background: bg }}>
    <TDefs />
    {children}
    <rect width="1920" height="1080" fill="url(#tVig)" opacity={vig} pointerEvents="none" />
  </svg>
);

// ───────── karakter ─────────
export type Eyes = "open" | "wide" | "happy" | "closed" | "squint";
export type Brow = "none" | "worried" | "angry" | "up";
export type Mouth = "smile" | "grin" | "open" | "flat" | "frown" | "o" | "none";
export type Outfit = {
  top: string; top2?: string; shoes?: string; kind?: "hoodie" | "coat" | "jersey" | "sweater" | "vest" | "robe" | "suit";
  hair?: "none" | "ponytail" | "scarf" | "white" | "cap" | "band" | "bun" | "fez" | "kalpak" | "turban" | "fedora"; hairColor?: string;
  glasses?: boolean; mustache?: boolean; gloves?: boolean; number?: string; inner?: string; beard?: string; sash?: string; mustacheColor?: string;
};
export const HERO: Outfit = { top: T.hero, top2: T.hero2, shoes: "#FFFFFF" };
export const KIDO: Outfit = { top: T.yellow, top2: T.yellow2, shoes: T.red };
export const MOM: Outfit = { top: T.pink, top2: "#C24F75", kind: "sweater", hair: "scarf", hairColor: "#F2B8C9", shoes: "#6B4A3A" };
export const DAD: Outfit = { top: "#5C6B7A", top2: "#46525E", kind: "sweater", mustache: true, shoes: "#3A2A20" };
export const DEDE: Outfit = { top: "#8B6B4A", top2: "#6E5338", kind: "vest", inner: "#E9E2D2", hair: "cap", hairColor: "#5A4A3A", mustache: true, shoes: "#3A2A20" };
export const ELIF: Outfit = { top: T.yellow, top2: T.yellow2, kind: "sweater", hair: "ponytail", shoes: "#F4F4F4" };
export const HOCA: Outfit = { top: "#F7F7F5", top2: "#D9DCDF", kind: "coat", inner: "#3A6EA5", hair: "white", glasses: true, shoes: "#3A2A20" };
export const ALTI: Outfit = { top: T.red, top2: T.red2, hair: "band", hairColor: "#FFFFFF", shoes: "#FFFFFF" };
export const YEDI: Outfit = { top: T.blue, top2: T.blue2, shoes: "#FFFFFF" };
export const KEEPER: Outfit = { top: T.orange, top2: "#C76A12", kind: "jersey", gloves: true, number: "1", shoes: "#FFFFFF" };
export const BES: Outfit = { top: "#E9E2D2", top2: "#CFC6B2", kind: "coat", inner: "#3E8E5A", hair: "scarf", hairColor: "#3E9E62", shoes: "#5A4A3A" };
export const TEACH: Outfit = { top: T.purple, top2: "#5E42A8", kind: "sweater", glasses: true, shoes: "#3A2A20" };
export const HAMAL: Outfit = { top: "#7A5A3A", top2: "#5E4428", kind: "vest", inner: "#D9CDB5", hair: "cap", hairColor: "#3A3A3A", mustache: true, shoes: "#3A2A20" };

export type TPose = { l: [number, number]; r: [number, number]; ll?: [number, number]; rl?: [number, number]; lean?: number };
export const P: Record<string, TPose> = {
  stand: { l: [8, 6], r: [-8, -6] },
  wave: { l: [8, 6], r: [150, 175] },
  point: { l: [8, 6], r: [80, 90] },
  reach: { l: [60, 75], r: [80, 90], lean: 8 },
  shrug: { l: [-40, 60], r: [-40, 60] },
  think: { l: [20, 120], r: [-8, -6] },
  hips: { l: [-35, 70], r: [-35, 70] },
  phone: { l: [8, 6], r: [30, 140] },
  hold: { l: [40, 95], r: [40, 95] },
  cheer: { l: [160, 175], r: [160, 175] },
  shock: { l: [-60, -110], r: [-60, -110], lean: -4 },
  run: { l: [-50, 20], r: [60, 120], ll: [-40, 30], rl: [50, -10], lean: 14 },
  kick: { l: [-30, 20], r: [40, 60], ll: [-10, 0], rl: [80, 40], lean: -6 },
  dive: { l: [120, 140], r: [150, 170], ll: [-30, -20], rl: [-10, 10], lean: 70 },
  sit: { l: [30, 80], r: [30, 80], ll: [90, 0], rl: [90, 0] },
  hand: { l: [8, 6], r: [70, 140] },
  back: { l: [-30, -20], r: [-30, -20], ll: [-6, -6], rl: [6, 6], lean: -6 },
};
export const mixPose = (a: TPose, b: TPose, k: number): TPose => {
  const m = (x: [number, number] | undefined, y: [number, number] | undefined, d: [number, number]): [number, number] => {
    const p = x ?? d, q = y ?? d;
    return [lerp(p[0], q[0], k), lerp(p[1], q[1], k)];
  };
  return { l: m(a.l, b.l, [8, 6]), r: m(a.r, b.r, [-8, -6]), ll: m(a.ll, b.ll, [-3, -3]), rl: m(a.rl, b.rl, [3, 3]), lean: lerp(a.lean ?? 0, b.lean ?? 0, k) };
};
// yürüyüş döngüsü
export const walkPose = (ph: number, arms = true): TPose => {
  const s = Math.sin(ph), c = Math.cos(ph);
  return {
    l: arms ? [-26 * s, -10 + 14 * Math.max(0, -s)] : [8, 6], r: arms ? [26 * s, -10 + 14 * Math.max(0, s)] : [-8, -6],
    ll: [28 * s, 28 * s - 24 * Math.max(0, c)], rl: [-28 * s, -28 * s - 24 * Math.max(0, -c)], lean: 4,
  };
};
export const runPose = (ph: number): TPose => {
  const s = Math.sin(ph), c = Math.cos(ph);
  return { l: [-60 * s, 40 + 50 * Math.max(0, -s)], r: [60 * s, 40 + 50 * Math.max(0, s)], ll: [45 * s, 45 * s - 70 * Math.max(0, c)], rl: [-45 * s, -45 * s - 70 * Math.max(0, -c)], lean: 14 };
};

const pt = (x: number, y: number, a: number, L: number) => {
  const r = (a * Math.PI) / 180;
  return [x + Math.sin(r) * L, y + Math.cos(r) * L] as const;
};

export const TFig: React.FC<{
  x: number; y: number; s?: number; dir?: 1 | -1; o?: Outfit; pose?: TPose; t?: number; seed?: number;
  eyes?: Eyes; brow?: Brow; mouth?: Mouth; look?: number; lookY?: number; talk?: boolean; sweat?: boolean; rim?: number; holdR?: React.ReactNode; holdL?: React.ReactNode; op?: number; bob?: number;
  walk?: Walk; // Motion.ts: toonWalk() → ayak yerde kilitli yürüme (yoksa eskisi gibi)
}> = ({ x, y, s = 1, dir = 1, o = HERO, pose: pose0 = P.stand, t = 0, seed = 0, eyes = "open", brow = "none", mouth = "smile", look = 0, lookY = 0, talk = false, sweat = false, rim = 0, holdR, holdL, op = 1, bob, walk }) => {
  const kind = o.kind ?? "hoodie";
  const top2 = o.top2 ?? o.top;
  const breathe = bob ?? Math.sin(t * 2.1 + seed) * 2.2;
  const blink = blinkAt(t, seed);
  // yürüme: bacaklar mesafeye bağlı, salınan bacak diz kırıp kalkar, kollar karşı yönde, kalça iki adım arasında iner
  const G = walk ? gLegs(walk, TOON_A) : null;
  const freeArms = pose0 === P.stand;
  const pose: TPose = G && walk
    ? {
        l: freeArms ? [-0.75 * G.aL, -0.75 * G.aL + 14] : pose0.l,
        r: freeArms ? [-0.75 * G.aR, -0.75 * G.aR + 14] : pose0.r,
        ll: [G.aL + 26 * G.liftL, G.aL - 48 * G.liftL],
        rl: [G.aR + 26 * G.liftR, G.aR - 48 * G.liftR],
        lean: (pose0.lean ?? 0) + 4 * walk.amp,
      }
    : pose0;
  const drop = G ? TOON_L * G.drop : 0;
  const open = talk && Math.sin(t * 21 + seed) > 0;
  const lean = pose.lean ?? 0;
  const HIP: [number, number] = [0, -178];
  const legs = (side: -1 | 1, ang: [number, number], back: boolean) => {
    const h = [HIP[0] + side * 22, HIP[1]] as const;
    const k = pt(h[0], h[1], ang[0], 88);
    const f = pt(k[0], k[1], ang[1], 86);
    const shoe = o.shoes ?? "#FFFFFF";
    return (
      <g key={side}>
        <polyline points={`${h[0]},${h[1]} ${k[0]},${k[1]} ${f[0]},${f[1]}`} fill="none" stroke={back ? T.ink2 : T.ink} strokeWidth={14} strokeLinecap="round" strokeLinejoin="round" />
        <g transform={`translate(${f[0]},${f[1]}) rotate(${-ang[1] * 0.4})`}>
          <path d="M-14,-10 C-14,-22 10,-22 22,-10 L34,-4 C40,0 38,10 30,10 L-16,10 C-22,10 -22,-4 -14,-10Z" fill={back ? shadeOf(shoe) : shoe} />
          <rect x={-18} y={6} width={54} height={6} rx={3} fill="#C9C9C9" />
        </g>
      </g>
    );
  };
  // gövde yukarı: kalça etrafında eğilme
  const SH = -350;
  const arm = (side: -1 | 1, ang: [number, number], back: boolean, hold?: React.ReactNode) => {
    const sh = [side * 60, SH + 14] as const;
    const e = pt(sh[0], sh[1], ang[0], 82);
    const h = pt(e[0], e[1], ang[1], 76);
    const c = back ? top2 : o.top;
    const sleeve = kind === "vest" ? (o.inner ?? "#E9E2D2") : c;
    return (
      <g key={`a${side}`}>
        <polyline points={`${sh[0]},${sh[1]} ${e[0]},${e[1]} ${h[0]},${h[1]}`} fill="none" stroke={sleeve} strokeWidth={34} strokeLinecap="round" strokeLinejoin="round" />
        {kind === "hoodie" && <circle cx={h[0] - Math.sin((ang[1] * Math.PI) / 180) * 18} cy={h[1] - Math.cos((ang[1] * Math.PI) / 180) * 18} r={17} fill={back ? shadeOf(c) : top2} />}
        <circle cx={h[0]} cy={h[1]} r={o.gloves ? 24 : 16} fill={o.gloves ? "#F4F4F4" : T.ink} stroke={o.gloves ? "#BDBDBD" : "none"} strokeWidth={3} />
        {hold && <g transform={`translate(${h[0]},${h[1]})`}>{hold}</g>}
      </g>
    );
  };
  const torso = () => {
    const bodyD = "M-74,-176 C-80,-250 -84,-320 -64,-352 Q0,-372 64,-352 C84,-320 80,-250 74,-176 Q0,-160 -74,-176Z";
    return (
      <g>
        {kind === "coat" && <path d="M-80,-352 Q0,-372 80,-352 C92,-280 96,-180 100,-96 L-100,-96 C-96,-180 -92,-280 -80,-352Z" fill={o.top} />}
        {kind === "robe" && <path d="M-80,-352 Q0,-372 80,-352 C96,-260 104,-120 112,-14 Q0,4 -112,-14 C-104,-120 -96,-260 -80,-352Z" fill={o.top} />}
        <path d={bodyD} fill={kind === "coat" || kind === "vest" || kind === "robe" ? (o.inner ?? "#E9E2D2") : o.top} />
        {kind === "robe" && (
          <>
            <path d="M-80,-352 Q-40,-362 -14,-350 L-6,-14 Q-60,-6 -112,-14 C-104,-120 -96,-260 -80,-352Z" fill={o.top} />
            <path d="M80,-352 Q40,-362 14,-350 L6,-14 Q60,-6 112,-14 C104,-120 96,-260 80,-352Z" fill={top2} />
            <path d="M-14,-350 L-6,-14 M14,-350 L6,-14" stroke={shadeOf(o.top)} strokeWidth={5} />
            {o.sash && <path d="M-78,-210 Q0,-196 78,-210 L80,-186 Q0,-172 -80,-186Z" fill={o.sash} />}
          </>
        )}
        {kind === "suit" && (
          <>
            <path d="M-74,-176 C-80,-250 -84,-320 -64,-352 L-24,-356 L-6,-250 L-10,-176Z" fill={o.top} />
            <path d="M74,-176 C80,-250 84,-320 64,-352 L24,-356 L6,-250 L10,-176Z" fill={o.top} />
            <path d="M-24,-356 L-40,-300 L-14,-290Z M24,-356 L40,-300 L14,-290Z" fill={top2} />
            <path d="M-5,-350 L5,-350 L8,-280 L0,-268 L-8,-280Z" fill={o.sash ?? "#7A2E2E"} />
          </>
        )}
        {kind === "hoodie" && (
          <>
            <path d="M-46,-250 L46,-250 L56,-196 L-56,-196Z" fill={top2} />
            <path d="M-74,-190 Q0,-174 74,-190 L74,-176 Q0,-160 -74,-176Z" fill={top2} />
            <path d="M-16,-350 L-20,-300 M16,-350 L20,-300" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" />
            <circle cx={-20} cy={-298} r={5} fill="#FFFFFF" /><circle cx={20} cy={-298} r={5} fill="#FFFFFF" />
          </>
        )}
        {kind === "sweater" && (
          <>
            <path d="M-74,-196 Q0,-180 74,-196 L74,-176 Q0,-160 -74,-176Z" fill={top2} />
            <path d="M-30,-356 Q0,-330 30,-356" stroke={top2} strokeWidth={10} fill="none" />
            {[-40, 0, 40].map((xx) => <path key={xx} d={`M${xx - 14},-280 l14,10 l14,-10`} stroke={top2} strokeWidth={5} fill="none" />)}
          </>
        )}
        {kind === "jersey" && (
          <>
            <path d="M-74,-196 Q0,-180 74,-196 L74,-176 Q0,-160 -74,-176Z" fill={top2} />
            <text x={0} y={-236} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={74} fill="#FFFFFF">{o.number}</text>
            <path d="M-30,-358 L0,-330 L30,-358" stroke="#FFFFFF" strokeWidth={8} fill="none" />
          </>
        )}
        {kind === "coat" && (
          <>
            <path d="M-30,-356 L-8,-290 L-8,-96 M30,-356 L8,-290 L8,-96" stroke={top2} strokeWidth={6} fill="none" />
            <path d="M-4,-340 L4,-340 L8,-270 L0,-256 L-8,-270Z" fill="#B23A3F" />
            <rect x={36} y={-300} width={30} height={34} rx={4} fill={top2} />
            <path d="M44,-306 v-16 M54,-306 v-12" stroke={T.blue} strokeWidth={4} />
          </>
        )}
        {kind === "vest" && (
          <>
            <path d="M-74,-176 C-80,-250 -84,-320 -64,-352 L-26,-356 L-14,-180Z" fill={o.top} />
            <path d="M74,-176 C80,-250 84,-320 64,-352 L26,-356 L14,-180Z" fill={o.top} />
            <circle cx={-22} cy={-290} r={4} fill={top2} /><circle cx={-22} cy={-240} r={4} fill={top2} />
          </>
        )}
        {kind === "hoodie" && <path d="M-58,-352 C-70,-392 -40,-410 0,-408 C40,-410 70,-392 58,-352 Q0,-340 -58,-352Z" fill={top2} />}
      </g>
    );
  };
  const HY = -458;
  const ex = look * 12, ey = lookY * 10;
  const eye = (cx: number) => {
    const X = cx + ex * 0.6;
    if (blink || eyes === "closed") return <path d={`M${X - 18},${HY + 4} q18,10 36,0`} stroke="#FFFFFF" strokeWidth={6} fill="none" strokeLinecap="round" />;
    if (eyes === "happy") return <path d={`M${X - 18},${HY + 8} q18,-22 36,0`} stroke="#FFFFFF" strokeWidth={7} fill="none" strokeLinecap="round" />;
    const rx = eyes === "wide" ? 24 : 20, ry = eyes === "wide" ? 32 : eyes === "squint" ? 13 : 26;
    const pr = eyes === "wide" ? 7 : 10;
    return (
      <g>
        <ellipse cx={X} cy={HY} rx={rx} ry={ry} fill="#FFFFFF" />
        <circle cx={X + ex * 0.7} cy={HY + 4 + ey * 0.8} r={pr} fill={T.ink} />
        <circle cx={X + ex * 0.7 + 3} cy={HY + ey * 0.8} r={2.6} fill="#FFFFFF" />
      </g>
    );
  };
  const lid = (cx: number, side: -1 | 1) => {
    const X = cx + ex * 0.6;
    if (brow === "worried") return <path d={`M${X - 26},${HY - 22 - (side < 0 ? 0 : 12)} L${X + 26},${HY - 22 - (side < 0 ? 12 : 0)} L${X + 26},${HY - 40} L${X - 26},${HY - 40}Z`} fill={T.ink} />;
    if (brow === "angry") return <path d={`M${X - 26},${HY - 24 - (side < 0 ? 12 : 0)} L${X + 26},${HY - 24 - (side < 0 ? 0 : 12)} L${X + 26},${HY - 40} L${X - 26},${HY - 40}Z`} fill={T.ink} />;
    if (brow === "up") return <path d={`M${X - 18},${HY - 40} q18,-12 36,0`} stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" />;
    return null;
  };
  const MY = HY + 50;
  const mouthEl = () => {
    const X = ex * 0.5;
    if (open || mouth === "open") return <ellipse cx={X} cy={MY + 2} rx={13} ry={12} fill="#FFFFFF" />;
    if (mouth === "o") return <ellipse cx={X} cy={MY} rx={8} ry={10} fill="none" stroke="#FFFFFF" strokeWidth={5} />;
    if (mouth === "grin") return <path d={`M${X - 22},${MY - 6} Q${X},${MY + 22} ${X + 22},${MY - 6}Z`} fill="#FFFFFF" />;
    if (mouth === "smile") return <path d={`M${X - 14},${MY - 3} q14,14 28,0`} stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" />;
    if (mouth === "frown") return <path d={`M${X - 14},${MY + 6} q14,-12 28,0`} stroke="#FFFFFF" strokeWidth={5} fill="none" strokeLinecap="round" />;
    if (mouth === "flat") return <path d={`M${X - 12},${MY + 2} h24`} stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" />;
    return null;
  };
  const back = (o.hair === "ponytail" && (
    <g><ellipse cx={-70} cy={HY + 20} rx={34} ry={60} fill={T.ink} transform={`rotate(${20 + Math.sin(t * 3 + seed) * 6},${-60},${HY - 30})`} /></g>
  )) || null;
  const hair = () => {
    switch (o.hair) {
      case "scarf": return (
        <g>
          <path d={`M0,${HY - 98} C-74,${HY - 98} -104,${HY - 40} -102,${HY + 20} C-100,${HY + 70} -80,${HY + 96} -60,${HY + 104} L60,${HY + 104} C80,${HY + 96} 100,${HY + 70} 102,${HY + 20} C104,${HY - 40} 74,${HY - 98} 0,${HY - 98}Z`} fill={o.hairColor ?? T.pink} />
          <path d={`M-60,${HY + 104} Q0,${HY + 120} 60,${HY + 104} L52,${HY + 140} Q0,${HY + 150} -52,${HY + 140}Z`} fill={o.hairColor ?? T.pink} />
        </g>
      );
      default: return null;
    }
  };
  const hairTop = () => {
    switch (o.hair) {
      case "white": return <g fill="#F4F4F4"><circle cx={-74} cy={HY - 30} r={24} /><circle cx={-84} cy={HY - 4} r={20} /><circle cx={74} cy={HY - 30} r={24} /><circle cx={84} cy={HY - 4} r={20} /></g>;
      case "cap": return <g><path d={`M-78,${HY - 40} C-70,${HY - 100} 70,${HY - 100} 78,${HY - 40}Z`} fill={o.hairColor ?? "#5A4A3A"} /><path d={`M30,${HY - 44} q50,-6 70,8 q-40,8 -70,4Z`} fill={shadeOf(o.hairColor ?? "#5A4A3A")} /></g>;
      case "band": return <path d={`M-80,${HY - 46} Q0,${HY - 96} 80,${HY - 46} L76,${HY - 30} Q0,${HY - 78} -76,${HY - 30}Z`} fill={o.hairColor ?? "#FFFFFF"} />;
      case "ponytail": return <circle cx={-56} cy={HY - 58} r={10} fill={T.yellow} />;
      case "fez": return <g><path d={`M-50,${HY - 66} L-40,${HY - 150} Q0,${HY - 160} 40,${HY - 150} L50,${HY - 66} Q0,${HY - 56} -50,${HY - 66}Z`} fill={o.hairColor ?? "#B3261E"} /><path d={`M0,${HY - 156} q-6,30 -40,50`} stroke="#1A1A1A" strokeWidth={6} fill="none" /><circle cx={-40} cy={HY - 104} r={7} fill="#1A1A1A" /></g>;
      case "kalpak": return <g><path d={`M-84,${HY - 40} C-90,${HY - 130} 90,${HY - 130} 84,${HY - 40} Q0,${HY - 60} -84,${HY - 40}Z`} fill={o.hairColor ?? "#6B4A2E"} />{[-60, -30, 0, 30, 60].map((xx) => <path key={xx} d={`M${xx},${HY - 50} q6,-30 0,-60`} stroke={shadeOf(o.hairColor ?? "#6B4A2E")} strokeWidth={6} fill="none" />)}<path d={`M-88,${HY - 44} Q0,${HY - 70} 88,${HY - 44} L90,${HY - 26} Q0,${HY - 52} -90,${HY - 26}Z`} fill="#E8D9B8" /></g>;
      case "turban": return <g><ellipse cx={0} cy={HY - 72} rx={92} ry={56} fill={o.hairColor ?? "#F2EBDD"} /><path d={`M-88,${HY - 64} Q0,${HY - 120} 88,${HY - 80} M-80,${HY - 46} Q0,${HY - 96} 86,${HY - 56}`} stroke={shadeOf(o.hairColor ?? "#F2EBDD")} strokeWidth={6} fill="none" /><circle cx={0} cy={HY - 126} r={14} fill={o.hairColor === undefined ? "#3E8E5A" : shadeOf(o.hairColor)} /></g>;
      case "fedora": return <g><ellipse cx={0} cy={HY - 64} rx={120} ry={18} fill={o.hairColor ?? "#4A4036"} /><path d={`M-70,${HY - 66} C-66,${HY - 140} 66,${HY - 140} 70,${HY - 66}Z`} fill={o.hairColor ?? "#4A4036"} /><path d={`M-70,${HY - 82} Q0,${HY - 90} 70,${HY - 82} L70,${HY - 68} Q0,${HY - 76} -70,${HY - 68}Z`} fill="#1E1A16" /></g>;
      default: return null;
    }
  };
  const pose2 = pose;
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`} opacity={op}>
      {rim > 0 && <ellipse cx={0} cy={-280} rx={230} ry={330} fill="url(#tRim)" opacity={rim} />}
      <ellipse cx={0} cy={4} rx={86} ry={12} fill="#000" opacity={0.16} />
      {/* temas gölgesi: ayakların hemen altında koyu çekirdek (figür havada durmasın) */}
      <ellipse cx={0} cy={4} rx={G ? 70 + 30 * Math.abs(G.tr) * (walk?.amp ?? 0) : 52} ry={6} fill="#000" opacity={0.2} />
      <g transform={`translate(0,${drop})`}>
      {legs(-1, pose2.ll ?? [-3, -3], true)}
      {legs(1, pose2.rl ?? [3, 3], false)}
      <g transform={`rotate(${lean},0,-178) translate(0,${breathe})`}>
        {arm(-1, pose2.l, true, holdL)}
        {back}
        {torso()}
        {hair()}
        <g transform={`translate(0,${breathe * 0.4})`}>
          <circle cx={0} cy={HY} r={86} fill="url(#tHead)" />
          {eye(-28)}{eye(28)}
          {lid(-28, -1)}{lid(28, 1)}
          {o.glasses && <g fill="none" stroke="#E8E8E8" strokeWidth={5}><circle cx={-28 + ex * 0.6} cy={HY} r={30} /><circle cx={28 + ex * 0.6} cy={HY} r={30} /><path d={`M${-2 + ex * 0.6},${HY} h4`} /></g>}
          {o.beard && <path d={`M-70,${HY + 20} C-70,${HY + 120} -20,${HY + 150} 0,${HY + 156} C20,${HY + 150} 70,${HY + 120} 70,${HY + 20} C50,${HY + 70} -50,${HY + 70} -70,${HY + 20}Z`} fill={o.beard} />}
          {o.mustache && <path d={`M${-30 + ex * 0.5},${MY - 14} q15,-14 30,-2 q15,-12 30,2 q-15,10 -30,2 q-15,8 -30,-2Z`} fill={o.mustacheColor ?? "#EDEDED"} />}
          {!o.mustache && mouthEl()}
          {o.mustache && (open || mouth === "open") && <ellipse cx={ex * 0.5} cy={MY + 8} rx={9} ry={8} fill="#FFFFFF" />}
          {hairTop()}
          {sweat && <path d={`M78,${HY - 40} q14,22 0,34 q-14,-12 0,-34Z`} fill="#8FD3FF" />}
        </g>
        {arm(1, pose2.r, false, holdR)}
      </g>
      </g>
    </g>
  );
};
// yürüme sabitleri: bacak boyu (kalça→taban) ve tepe açı. Bir adım = 2·L·sin(A) birim → ayak kaymaz.
export const TOON_L = 174, TOON_A = 30;
export const TOON_STRIDE = 2 * TOON_L * Math.sin((TOON_A * Math.PI) / 180);
// x0→x1 yürü (a→b sn). Döner: x, dir ve TFig'e verilecek walk.
export const toonWalk = (t: number, a: number, b: number, x0: number, x1: number, s = 1) => {
  const g = gait(t, a, b, x0, x1, TOON_STRIDE * s);
  return { x: g.x, dir: g.walk.dir, walk: g.walk };
};
function shadeOf(c: string) {
  if (!c.startsWith("#") || c.length < 7) return c;
  const n = [1, 3, 5].map((i) => Math.round(parseInt(c.slice(i, i + 2), 16) * 0.78));
  return `rgb(${n.join(",")})`;
}

// uzak plan kalabalık figürü (çok sayıda çizilir)
export const TMini: React.FC<{ x: number; y: number; s?: number; c: string; t?: number; seed?: number; lit?: number }> = ({ x, y, s = 1, c, t = 0, seed = 0, lit = 0 }) => {
  const b = Math.sin(t * 3 + seed) * 2;
  return (
    <g transform={`translate(${x},${y + b}) scale(${s})`}>
      {lit > 0 && <ellipse cx={0} cy={-40} rx={60} ry={70} fill="url(#tGlow)" opacity={lit} />}
      <path d="M-4,0 V-26 M4,0 V-26" stroke={T.ink} strokeWidth={4} />
      <rect x={-15} y={-60} width={30} height={36} rx={10} fill={c} />
      <circle cx={0} cy={-74} r={17} fill={T.ink} />
      <circle cx={-5} cy={-76} r={4.5} fill="#fff" /><circle cx={5} cy={-76} r={4.5} fill="#fff" />
    </g>
  );
};
export const MINI_COLS = ["#E0393E", "#3A7BD5", "#F6C445", "#3FAE6A", "#7E5BD6", "#F28C28", "#E86A92", "#1FC8B4", "#8B6B4A", "#5C6B7A"];

// ───────── nesneler ─────────
export const Balloon: React.FC<{ x: number; y: number; t?: number; c?: string; len?: number }> = ({ x, y, t = 0, c = T.red, len = 120 }) => {
  const sw = Math.sin(t * 2) * 8;
  return (
    <g>
      <path d={`M${x},${y} Q${x + sw},${y - len / 2} ${x + sw * 1.5},${y - len}`} stroke="#555" strokeWidth={2} fill="none" />
      <ellipse cx={x + sw * 1.5} cy={y - len - 40} rx={34} ry={42} fill={c} />
      <ellipse cx={x + sw * 1.5 - 12} cy={y - len - 54} rx={8} ry={12} fill="#fff" opacity={0.5} />
    </g>
  );
};
export const Glass: React.FC<{ s?: number; tilt?: number; c?: string }> = ({ s = 1, tilt = 0, c = "#F28C28" }) => (
  <g transform={`scale(${s}) rotate(${tilt})`}>
    <path d="M-16,-46 L16,-46 L12,0 L-12,0Z" fill="#DDF1F7" opacity={0.85} stroke="#9CC9D6" strokeWidth={2.5} />
    <path d="M-14,-28 L14,-28 L12,0 L-12,0Z" fill={c} opacity={0.85} />
  </g>
);
export const PhoneP: React.FC<{ s?: number; ring?: number; screen?: string }> = ({ s = 1, ring = 0, screen = "#7FD8F0" }) => (
  <g transform={`scale(${s}) rotate(${ring ? Math.sin(ring * 60) * 8 : 0})`}>
    <rect x={-20} y={-40} width={40} height={74} rx={8} fill="#222" />
    <rect x={-16} y={-34} width={32} height={58} rx={4} fill={screen} />
    {ring > 0 && <g stroke={T.yellow} strokeWidth={4} fill="none"><path d="M28,-40 q10,10 0,20" /><path d="M36,-48 q18,18 0,36" /><path d="M-28,-40 q-10,10 0,20" /><path d="M-36,-48 q-18,18 0,36" /></g>}
  </g>
);
export const Ball: React.FC<{ x: number; y: number; r?: number; spin?: number }> = ({ x, y, r = 26, spin = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${spin})`}>
    <circle r={r} fill="#FFFFFF" stroke="#222" strokeWidth={3} />
    <path d={`M0,${-r * 0.42} l${r * 0.4},${r * 0.3} l${-r * 0.15},${r * 0.46} h${-r * 0.5} l${-r * 0.15},${-r * 0.46}Z`} fill="#222" />
  </g>
);
export const Note: React.FC<{ x: number; y: number; s?: number; open?: number; lines?: string[] }> = ({ x, y, s = 1, open = 1, lines = [] }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-260} y={-170 * open} width={520} height={340 * open} rx={10} fill="#FBF6E8" stroke="#C9B98F" strokeWidth={4} />
    {open > 0.95 && lines.map((l, i) => <text key={i} x={0} y={-80 + i * 80} textAnchor="middle" fontFamily="Patrick Hand" fontSize={i === lines.length - 1 && l.length < 3 ? 110 : 52} fill="#2C4A7A">{l}</text>)}
  </g>
);
export const Card8: React.FC<{ s?: number; flip?: number }> = ({ s = 1, flip = 1 }) => (
  <g transform={`scale(${s * Math.max(0.02, Math.abs(Math.cos((1 - flip) * Math.PI / 2)))},${s})`}>
    <rect x={-120} y={-170} width={240} height={340} rx={20} fill="#10203A" stroke={T.rim} strokeWidth={8} />
    <circle cx={0} cy={-90} r={36} fill="none" stroke={T.rim} strokeWidth={6} />
    <path d="M-20,-90 h40 M0,-110 v40" stroke={T.rim} strokeWidth={6} />
    <text x={0} y={90} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={70} fill="#FFFFFF">SEKİZ</text>
  </g>
);
export const Dice: React.FC<{ x: number; y: number; n: number; s?: number; rot?: number }> = ({ x, y, n, s = 1, rot = 0 }) => {
  const P2: Record<number, [number, number][]> = { 1: [[0, 0]], 2: [[-12, -12], [12, 12]], 3: [[-12, -12], [0, 0], [12, 12]], 4: [[-12, -12], [12, -12], [-12, 12], [12, 12]], 5: [[-12, -12], [12, -12], [0, 0], [-12, 12], [12, 12]], 6: [[-12, -14], [12, -14], [-12, 0], [12, 0], [-12, 14], [12, 14]] };
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
      <rect x={-26} y={-26} width={52} height={52} rx={10} fill="#FFFFFF" stroke="#BBB" strokeWidth={3} />
      {(P2[n] ?? []).map(([a, b], i) => <circle key={i} cx={a} cy={b} r={5.5} fill={i === 0 && n === 1 ? T.red : T.ink} />)}
    </g>
  );
};
export const Tavla: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-260} y={-60} width={520} height={120} rx={10} fill={T.wood2} />
    <rect x={-248} y={-50} width={240} height={100} fill="#E8D3A2" /><rect x={8} y={-50} width={240} height={100} fill="#E8D3A2" />
    {Array.from({ length: 12 }, (_, i) => {
      const xx = i < 6 ? -248 + i * 40 : 8 + (i - 6) * 40;
      return <g key={i}><path d={`M${xx},-50 l20,44 l20,-44Z`} fill={i % 2 ? T.red2 : "#2F4F3A"} /><path d={`M${xx},50 l20,-44 l20,44Z`} fill={i % 2 ? "#2F4F3A" : T.red2} /></g>;
    })}
    {[[-228, -36], [-188, -36], [48, 36], [88, 36], [128, 36]].map(([a, b], i) => <circle key={i} cx={a} cy={b} r={13} fill={i < 2 ? "#FFFFFF" : T.ink} stroke="#888" strokeWidth={2} />)}
  </g>
);

// ───────── araçlar ─────────
export const Tram: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M0,-360 L0,-420 M-60,-420 L60,-420" stroke="#333" strokeWidth={5} />
    <rect x={-300} y={-360} width={600} height={300} rx={30} fill="#C8262C" />
    <rect x={-300} y={-120} width={600} height={60} fill="#9E1C22" />
    <rect x={-300} y={-200} width={600} height={14} fill="#F2C14E" />
    {[-250, -150, -50, 50, 150].map((xx) => <rect key={xx} x={xx} y={-330} width={80} height={100} rx={10} fill="#BFE6F2" />)}
    <rect x={220} y={-330} width={60} height={210} rx={8} fill="#8E1A20" />
    <circle cx={270} cy={-150} r={14} fill="#FFF3B0" />
    <rect x={-200} y={-372} width={260} height={24} rx={6} fill="#F7F1E6" />
    <text x={-70} y={-353} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={18} fill="#9E1C22">TAKSİM · TÜNEL</text>
    {[-200, 200].map((xx) => <g key={xx} transform={`translate(${xx},-50) rotate(${t * 200})`}><circle r={34} fill="#2A2A2A" /><circle r={12} fill="#888" /><path d="M-30,0 H30" stroke="#666" strokeWidth={4} /></g>)}
  </g>
);
export const Minibus: React.FC<{ x: number; y: number; s?: number; t?: number; door?: number }> = ({ x, y, s = 1, t = 0, door = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-330,-60 L-330,-300 Q-320,-330 -280,-330 L200,-330 Q250,-330 280,-260 L330,-170 L330,-60Z" fill="#1E1E22" />
    <path d="M200,-310 L250,-310 L300,-190 L200,-190Z" fill="#3B4A5C" />
    {[-300, -170, -40].map((xx) => <rect key={xx} x={xx} y={-300} width={110} height={90} rx={8} fill="#2E3A4A" />)}
    <rect x={80} y={-300} width={100 * (1 - door)} height={230} fill="#26262A" stroke="#444" strokeWidth={3} />
    <rect x={300} y={-130} width={30} height={20} rx={4} fill="#FFF3B0" />
    <rect x={-330} y={-90} width={660} height={20} fill="#111" />
    {[-210, 200].map((xx) => <g key={xx} transform={`translate(${xx},-50) rotate(${t * 300})`}><circle r={46} fill="#111" /><circle r={20} fill="#777" /><path d="M-18,0 H18 M0,-18 V18" stroke="#555" strokeWidth={4} /></g>)}
  </g>
);
export const CarP: React.FC<{ x: number; y: number; s?: number; t?: number; c?: string; lights?: number; dir?: 1 | -1 }> = ({ x, y, s = 1, t = 0, c = "#3A7BD5", lights = 0, dir = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
    {lights > 0 && <path d="M240,-110 L900,-260 L900,60 Z" fill="url(#tBeam)" opacity={lights} />}
    <path d="M-250,-60 L-250,-130 Q-240,-160 -200,-165 L-120,-170 L-60,-240 Q-40,-260 0,-260 L120,-260 Q160,-260 180,-230 L220,-170 Q260,-160 260,-120 L260,-60Z" fill={c} />
    <path d="M-50,-230 L-100,-172 L60,-172 L60,-236 Q30,-240 0,-240Z" fill="#CFEAF5" /><path d="M80,-236 L80,-172 L195,-172 L165,-226 Q150,-240 120,-240Z" fill="#CFEAF5" />
    <rect x={226} y={-140} width={34} height={20} rx={6} fill="#FFF3B0" />
    {[-150, 160].map((xx) => <g key={xx} transform={`translate(${xx},-56) rotate(${t * 500})`}><circle r={44} fill="#1E1E1E" /><circle r={18} fill="#9A9A9A" /><path d="M-16,0 H16" stroke="#666" strokeWidth={4} /></g>)}
  </g>
);

// ───────── mekânlar ─────────
// İstiklal: renkli cepheler, balkonlar, tabelalar, raylar; arkada kalabalık
export const Istiklal: React.FC<{ t: number; px?: number; crowd?: boolean; dusk?: number }> = ({ t, px = 0, crowd = true, dusk = 0 }) => {
  const cols = ["#E9B872", "#D98C7A", "#9FC4C8", "#E3D2B4", "#C9A5C9", "#F0C987", "#B7CFA7", "#E7A68C"];
  return (
    <g>
      <rect width={1920} height={1080} fill={dusk ? "url(#tSkyDusk)" : "url(#tSkyDay)"} />
      {[0, 1].map((k) => <ellipse key={k} cx={((300 + k * 900 + t * 12) % 2300) - 200} cy={120 + k * 50} rx={130} ry={34} fill="#FFFFFF" opacity={0.8} />)}
      <g transform={`translate(${-px},0)`}>
        {Array.from({ length: 10 }, (_, i) => {
          const x = -200 + i * 290, h = 560 + ((i * 97) % 140), c = cols[i % cols.length];
          return (
            <g key={i}>
              <rect x={x} y={800 - h} width={290} height={h} fill={c} />
              <rect x={x} y={800 - h} width={290} height={h} fill="url(#tBrick)" />
              <rect x={x - 6} y={800 - h - 18} width={302} height={22} fill={shadeOf(c)} />
              {Array.from({ length: 3 }, (_, r) => Array.from({ length: 3 }, (_, cc) => (
                <g key={`${r}${cc}`}>
                  <rect x={x + 30 + cc * 84} y={800 - h + 50 + r * 130} width={56} height={86} rx={28} fill="#5E8BA6" />
                  <rect x={x + 30 + cc * 84} y={800 - h + 50 + r * 130} width={56} height={86} rx={28} fill="none" stroke="#FFFFFF" strokeWidth={5} />
                  {r === 1 && <path d={`M${x + 22 + cc * 84},${800 - h + 140 + r * 130} h72 M${x + 22 + cc * 84},${800 - h + 140 + r * 130} v-20 M${x + 94 + cc * 84},${800 - h + 140 + r * 130} v-20 M${x + 22 + cc * 84},${800 - h + 122 + r * 130} h72`} stroke="#3A3A3A" strokeWidth={4} fill="none" />}
                </g>
              )))}
              <rect x={x + 20} y={650} width={250} height={150} fill="#3A3A3A" opacity={0.85} />
              <rect x={x + 30} y={660} width={230} height={130} fill="#F7E9C8" opacity={0.6} />
              <rect x={x + 10} y={610} width={270} height={40} rx={6} fill={[T.red, T.blue, T.green, T.purple][i % 4]} />
              <text x={x + 145} y={638} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={22} fill="#FFFFFF">{["KİTAP", "SİMİT", "MÜZİK", "DONDURMA", "KAFE", "ÇİÇEK", "LOKUM", "PLAK", "ÇAY", "BÖREK"][i]}</text>
            </g>
          );
        })}
        {crowd && Array.from({ length: 26 }, (_, i) => {
          const x = ((i * 137 + t * (i % 2 ? 40 : -30)) % 2900 + 2900) % 2900 - 200;
          return <TMini key={i} x={x} y={822 + (i % 3) * 10} s={0.9 + (i % 3) * 0.08} c={MINI_COLS[i % MINI_COLS.length]} t={t} seed={i} />;
        })}
      </g>
      <rect y={800} width={1920} height={280} fill="#C9BBA6" />
      <rect y={800} width={1920} height={280} fill="url(#tTile)" />
      {[930, 1010].map((yy) => <rect key={yy} y={yy} width={1920} height={10} fill="#7A7A7A" />)}
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={((i * 80 - px * 1.2) % 2000 + 2000) % 2000 - 40} y={925} width={30} height={100} fill="#8A7A66" opacity={0.5} />)}
    </g>
  );
};

export const Kitchen: React.FC<{ t: number }> = () => (
  <g>
    <rect width={1920} height={1080} fill="#F5E6CC" />
    <rect y={0} width={1920} height={760} fill="url(#tTile)" />
    <rect x={120} y={120} width={700} height={250} fill="#8FC1A9" /><rect x={120} y={120} width={700} height={250} fill="none" stroke="#6E9C86" strokeWidth={6} />
    {[0, 1, 2, 3].map((i) => <g key={i}><rect x={130 + i * 172} y={130} width={162} height={230} fill="#A5D1BB" /><circle cx={270 + i * 172} cy={250} r={8} fill="#6E9C86" /></g>)}
    <rect x={1040} y={140} width={420} height={320} rx={10} fill="#BFE6F2" stroke="#FFFFFF" strokeWidth={18} />
    <path d="M1250,140 V460 M1040,300 H1460" stroke="#FFFFFF" strokeWidth={10} />
    <ellipse cx={1180} cy={240} rx={70} ry={20} fill="#FFFFFF" opacity={0.8} />
    <rect x={1000} y={460} width={500} height={20} fill="#E8D7B8" />
    <path d="M1060,460 q20,-60 40,0 M1120,460 q14,-40 28,0" fill="#5FAE6A" />
    <rect x={1600} y={130} width={260} height={640} rx={20} fill="#E8EEF2" /><rect x={1600} y={380} width={260} height={8} fill="#C9D1D6" />
    <rect x={1820} y={200} width={10} height={120} rx={5} fill="#9AA5AD" /><rect x={1820} y={430} width={10} height={140} rx={5} fill="#9AA5AD" />
    <rect x={80} y={560} width={1460} height={40} fill="#D9C3A0" /><rect x={80} y={600} width={1460} height={180} fill="#8FC1A9" />
    {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={100 + i * 290} y={620} width={270} height={140} fill="#A5D1BB" stroke="#6E9C86" strokeWidth={4} />)}
    <rect x={300} y={500} width={120} height={60} rx={10} fill="#555" /><rect x={340} y={470} width={40} height={30} fill="#777" />
    <rect y={780} width={1920} height={300} fill="#D9C3A0" /><rect y={780} width={1920} height={300} fill="url(#tTile)" />
  </g>
);

export const Classroom: React.FC<{ t: number; board?: string[]; chalk?: number }> = ({ t, board = [], chalk = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9E2CF" />
    <rect x={300} y={130} width={1100} height={480} rx={10} fill="#2F5D4A" stroke="#8A5A32" strokeWidth={24} />
    {board.map((l, i) => <text key={i} x={360} y={250 + i * 110} fontFamily="Patrick Hand" fontSize={80} fill="#F4F4F4" opacity={chalk}>{l}</text>)}
    <rect x={320} y={598} width={1060} height={16} fill="#8A5A32" />
    <circle cx={1650} cy={200} r={70} fill="#FFFFFF" stroke="#333" strokeWidth={8} />
    <path d={`M1650,200 L${1650 + Math.sin(t * 0.5) * 40},${200 - Math.cos(t * 0.5) * 40} M1650,200 L${1650 + Math.sin(t * 6) * 56},${200 - Math.cos(t * 6) * 56}`} stroke="#333" strokeWidth={6} strokeLinecap="round" />
    <rect x={1500} y={330} width={330} height={360} fill="#BFE6F2" stroke="#FFFFFF" strokeWidth={16} /><path d="M1665,330 V690 M1500,510 H1830" stroke="#FFFFFF" strokeWidth={8} />
    <rect x={60} y={300} width={180} height={240} fill="#F6C445" opacity={0.6} /><text x={150} y={440} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={60} fill="#B23A3F">π</text>
    <rect y={760} width={1920} height={320} fill="#C9A77E" /><rect y={760} width={1920} height={320} fill="url(#tTile)" />
  </g>
);
export const Desk: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-120} width={300} height={24} rx={6} fill="#B07A4A" />
    <rect x={-140} y={-96} width={14} height={96} fill="#555" /><rect x={126} y={-96} width={14} height={96} fill="#555" />
    <rect x={-130} y={-96} width={260} height={40} fill="#8A5A32" />
  </g>
);

export const Gym: React.FC<{ t: number; broken?: number }> = ({ broken = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#F0D9B5" />
    {[0, 1, 2, 3].map((i) => (
      <g key={i}>
        <rect x={140 + i * 440} y={120} width={340} height={260} fill="#BFE6F2" stroke="#FFFFFF" strokeWidth={14} />
        <path d={`M${310 + i * 440},120 V380 M${140 + i * 440},250 H${480 + i * 440}`} stroke="#FFFFFF" strokeWidth={6} />
        {i === 2 && broken > 0 && (
          <g opacity={broken}>
            <rect x={140 + i * 440} y={120} width={340} height={260} fill="#E9F6FA" />
            <path d={`M${300 + i * 440},250 l-90,-110 M${300 + i * 440},250 l120,-90 M${300 + i * 440},250 l-120,100 M${300 + i * 440},250 l90,120 M${300 + i * 440},250 l160,20`} stroke="#7AA9BA" strokeWidth={5} />
          </g>
        )}
      </g>
    ))}
    <rect y={440} width={1920} height={20} fill="#C99B5A" />
    <rect y={760} width={1920} height={320} fill="#D9A866" />
    <path d="M0,900 H1920 M960,760 V1080" stroke="#FFFFFF" strokeWidth={8} opacity={0.7} />
    <ellipse cx={960} cy={900} rx={160} ry={50} fill="none" stroke="#FFFFFF" strokeWidth={8} opacity={0.7} />
  </g>
);

export const Living: React.FC<{ t: number; night?: boolean }> = ({ t, night = true }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#D8C3A0" : "#EEDDC0"} />
    <rect y={0} width={1920} height={780} fill="url(#tBrick)" opacity={0.4} />
    <rect x={1300} y={140} width={420} height={360} fill={night ? "#1E3350" : "#BFE6F2"} stroke="#FFFFFF" strokeWidth={16} />
    {night && <circle cx={1600} cy={230} r={40} fill="#F4F1E4" />}
    {night && Array.from({ length: 8 }, (_, i) => <circle key={i} cx={1330 + ((i * 73) % 360)} cy={170 + ((i * 41) % 150)} r={3} fill="#fff" opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} />)}
    <path d="M1510,140 V500 M1300,320 H1720" stroke="#FFFFFF" strokeWidth={8} />
    <path d="M1260,120 h500 v30 h-500Z" fill="#8A5A32" />
    <path d="M1250,150 q40,200 20,370 l70,0 q-30,-170 0,-370Z M1770,150 q-40,200 -20,370 l-70,0 q30,-170 0,-370Z" fill="#C24F55" />
    <rect x={140} y={170} width={260} height={180} fill="#F7F1E6" stroke="#8A5A32" strokeWidth={14} /><path d="M170,320 l70,-90 l60,60 l40,-40 l40,70Z" fill="#7FB07A" />
    <rect x={520} y={200} width={160} height={120} fill="#F7F1E6" stroke="#8A5A32" strokeWidth={12} /><circle cx={600} cy={260} r={30} fill="#F2C14E" />
    <ellipse cx={960} cy={130} rx={110} ry={30} fill="#F6E7B0" />
    <ellipse cx={960} cy={160} rx={260} ry={120} fill="url(#tGlow)" opacity={0.4} />
    <rect y={780} width={1920} height={300} fill="#9E6B42" /><rect y={780} width={1920} height={300} fill="url(#tTile)" opacity={0.6} />
    <path d="M360,1080 L520,860 L1400,860 L1560,1080Z" fill="url(#tCarpet)" />
  </g>
);

export const Office: React.FC<{ t: number; chart?: number; night?: boolean }> = ({ t, chart = 1, night = true }) => {
  const pts = Array.from({ length: 40 }, (_, i) => [560 + i * 20, 440 - Math.sin(i * 0.7 + t * 3) * 18 - Math.sin(i * 0.23) * 40 - i * 1.2] as [number, number]);
  return (
    <g>
      <rect width={1920} height={1080} fill={night ? "#2B3A55" : "#E3E8EE"} />
      <rect x={1400} y={120} width={400} height={330} fill={night ? "#0E1A2E" : "#BFE6F2"} stroke="#5A6A85" strokeWidth={14} />
      {night && Array.from({ length: 12 }, (_, i) => <rect key={i} x={1430 + (i % 4) * 90} y={330 - Math.floor(i / 4) * 60} width={40} height={120 + Math.floor(i / 4) * 60} fill="#1C2B45" />)}
      <rect x={500} y={240} width={920} height={520} rx={20} fill="#1A1E26" />
      <rect x={530} y={270} width={860} height={440} rx={8} fill="#0E1522" />
      <g opacity={chart}>
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M540,${330 + i * 100} H1380`} stroke="#22324A" strokeWidth={2} />)}
        <polyline points={pts.map((p) => p.join(",")).join(" ")} fill="none" stroke="#3FD48A" strokeWidth={6} strokeLinejoin="round" />
        <text x={560} y={312} fontFamily="Poppins" fontWeight={700} fontSize={28} fill="#9FB3CC">HİSSE · 12,40 ₺</text>
      </g>
      <rect x={900} y={760} width={120} height={70} fill="#2A2E36" /><rect x={760} y={820} width={400} height={20} rx={8} fill="#2A2E36" />
      <rect y={840} width={1920} height={240} fill={night ? "#5A4636" : "#B08A64"} />
      <rect x={1150} y={850} width={420} height={30} rx={6} fill="#3A3F48" />
      <ellipse cx={960} cy={490} rx={600} ry={400} fill="#5FD4F0" opacity={night ? 0.08 : 0} />
    </g>
  );
};

export const Cafe: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#F2E4CC" />
    <rect x={160} y={110} width={1600} height={520} fill="#8EC9E6" />
    <rect x={160} y={430} width={1600} height={200} fill="#3E8FC4" />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${200 + i * 180 + Math.sin(t + i) * 10},${480 + (i % 3) * 40} q20,-8 40,0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.6} />)}
    <g transform={`translate(${((t * 30) % 2200) - 200},440)`}>
      <path d="M-120,0 L120,0 L100,40 L-100,40Z" fill="#FFFFFF" /><rect x={-70} y={-40} width={140} height={40} fill="#F4F4F4" /><rect x={-10} y={-80} width={20} height={40} fill="#E0393E" />
    </g>
    <path d="M160,430 C400,380 700,410 900,400 C1200,390 1500,380 1760,420 L1760,430 L160,430Z" fill="#7FA57A" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={160 + i * 400} y={110} width={20} height={520} fill="#8A5A32" />)}
    <rect x={150} y={100} width={1620} height={20} fill="#8A5A32" /><rect x={150} y={620} width={1620} height={30} fill="#8A5A32" />
    <g transform="translate(120,640)"><rect x={-30} y={-140} width={60} height={140} fill="#C97A4A" /><ellipse cx={0} cy={-170} rx={80} ry={60} fill="#5FAE6A" /></g>
    <g transform="translate(1810,640)"><rect x={-30} y={-140} width={60} height={140} fill="#C97A4A" /><ellipse cx={0} cy={-170} rx={80} ry={60} fill="#5FAE6A" /></g>
    {[400, 900, 1400].map((x, i) => <path key={i} d={`M${x - 50},40 L${x + 50},40 L${x + 30},90 L${x - 30},90Z`} fill="#2A2A2A" />)}
    {[400, 900, 1400].map((x, i) => <ellipse key={`g${i}`} cx={x} cy={120} rx={90} ry={50} fill="url(#tGlow)" opacity={0.5} />)}
    <rect y={760} width={1920} height={320} fill="#8A5A32" /><rect y={760} width={1920} height={320} fill="url(#tTile)" opacity={0.5} />
  </g>
);
export const CafeTable: React.FC<{ x: number; y: number; t?: number }> = ({ x, y, t = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    <ellipse cx={0} cy={-170} rx={190} ry={30} fill="#F7F1E6" />
    <rect x={-12} y={-170} width={24} height={170} fill="#555" /><ellipse cx={0} cy={0} rx={80} ry={14} fill="#555" />
    <g transform="translate(-70,-188)"><rect x={-26} y={-40} width={52} height={44} rx={8} fill="#FFFFFF" /><path d="M26,-30 q20,4 0,24" stroke="#FFFFFF" strokeWidth={8} fill="none" />
      {[0, 1].map((i) => <path key={i} d={`M${-8 + i * 16},-50 q-8,-14 0,-28`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} />)}</g>
    <g transform="translate(70,-188)"><rect x={-26} y={-40} width={52} height={44} rx={8} fill="#FFFFFF" /><path d="M26,-30 q20,4 0,24" stroke="#FFFFFF" strokeWidth={8} fill="none" /></g>
    <rect x={-20} y={-200} width={60} height={14} rx={3} fill={T.purple} />
  </g>
);

// Kapadokya dış: peri bacaları, balonlar
export const Kapadokya: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#tSkyDusk)" />
    {[[300, 300, T.red], [900, 200, T.yellow], [1500, 340, T.blue], [1200, 120, T.green]].map(([x, y, c], i) => (
      <g key={i} transform={`translate(${Number(x) + Math.sin(t * 0.3 + i) * 30},${Number(y) - t * 6 + Math.sin(t + i) * 6})`}>
        <ellipse cx={0} cy={0} rx={50} ry={60} fill={String(c)} /><path d="M-30,40 L-14,80 L14,80 L30,40" stroke="#5A3E25" strokeWidth={3} fill="none" /><rect x={-16} y={80} width={32} height={22} fill="#8A5A32" />
      </g>
    ))}
    <path d="M0,700 C300,640 600,680 900,650 C1200,620 1500,660 1920,630 L1920,1080 L0,1080Z" fill="#D9A877" />
    {[[180, 700, 1], [420, 680, 1.3], [700, 690, 0.9], [1050, 660, 1.5], [1350, 690, 1.1], [1650, 660, 1.4]].map(([x, y, k], i) => (
      <g key={i} transform={`translate(${x},${y}) scale(${k})`}>
        <path d="M-60,0 C-60,-120 -40,-220 -20,-260 L20,-260 C40,-220 60,-120 60,0Z" fill="#E8C49A" />
        <path d="M-30,-250 C-60,-280 -50,-320 0,-326 C50,-320 60,-280 30,-250Z" fill="#8A6A4A" />
        <rect x={-14} y={-140} width={28} height={40} rx={14} fill="#5A3E25" />
      </g>
    ))}
    <path d="M0,820 C500,780 1100,830 1920,790 L1920,1080 L0,1080Z" fill="#C99566" />
  </g>
);
// yer altı merkez koridoru: taş, mavi ışıklar, ekranlar
export const Base: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#B9875A" />
    <rect width={1920} height={1080} fill="url(#tStone)" />
    <path d="M0,0 L1920,0 L1920,140 C1500,90 420,90 0,140Z" fill="#9E7148" />
    {[300, 960, 1620].map((x) => <g key={x}><rect x={x - 6} y={0} width={12} height={150} fill="#444" /><rect x={x - 70} y={150} width={140} height={14} rx={7} fill="#E9FBFF" /><ellipse cx={x} cy={180} rx={200} ry={60} fill={T.rim} opacity={0.15} /></g>)}
    {[220, 1460].map((x, i) => (
      <g key={x}>
        <rect x={x} y={300} width={240} height={150} rx={10} fill="#10203A" stroke="#556" strokeWidth={6} />
        <polyline points={Array.from({ length: 12 }, (_, k) => `${x + 16 + k * 19},${380 - Math.sin(k + t * 2 + i) * 30}`).join(" ")} fill="none" stroke={T.rim} strokeWidth={4} />
      </g>
    ))}
    <path d="M800,820 L800,420 A160,160 0 0 1 1120,420 L1120,820Z" fill="#3A2A1C" />
    <path d="M820,820 L820,430 A140,140 0 0 1 1100,430 L1100,820Z" fill="#10203A" />
    <rect x={930} y={500} width={60} height={60} rx={30} fill={T.rim} opacity={0.6 + 0.3 * Math.sin(t * 3)} />
    <rect y={820} width={1920} height={260} fill="#7A5638" /><rect y={820} width={1920} height={260} fill="url(#tTile)" />
    <path d="M0,840 H1920" stroke={T.rim} strokeWidth={4} opacity={0.6} />
  </g>
);
// yer altı antrenman sahası
export const Pitch: React.FC<{ t: number }> = () => (
  <g>
    <rect width={1920} height={1080} fill="#9E7148" />
    <rect width={1920} height={1080} fill="url(#tStone)" />
    {[200, 700, 1220, 1720].map((x) => <g key={x}><rect x={x - 60} y={60} width={120} height={20} rx={10} fill="#F4FBFF" /><path d={`M${x - 60},80 L${x - 300},900 L${x + 300},900 L${x + 60},80Z`} fill="#FFFFFF" opacity={0.07} /></g>)}
    <rect y={620} width={1920} height={460} fill="#4FA35E" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 240} y={620} width={120} height={460} fill="#5BB06A" />)}
    <path d="M0,1000 H1920" stroke="#FFFFFF" strokeWidth={8} opacity={0.8} />
    <rect x={560} y={330} width={800} height={14} fill="#FFFFFF" /><rect x={560} y={330} width={14} height={340} fill="#FFFFFF" /><rect x={1346} y={330} width={14} height={340} fill="#FFFFFF" />
    <g opacity={0.35} stroke="#FFFFFF" strokeWidth={3}>
      {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${580 + i * 50},344 V660`} />)}
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M574,${370 + i * 45} H1346`} />)}
    </g>
    <path d="M400,670 L1520,670" stroke="#FFFFFF" strokeWidth={6} opacity={0.8} />
  </g>
);
// Hoca'nın odası: kitaplık, masa lambası, fotoğraf
export const Study: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#4A3A2C" />
    <rect width={1920} height={1080} fill="url(#tStone)" opacity={0.6} />
    <rect x={100} y={120} width={560} height={640} fill="#6B4A2E" />
    {[0, 1, 2, 3].map((r) => (
      <g key={r}>
        <rect x={110} y={250 + r * 150} width={540} height={14} fill="#4A3020" />
        {Array.from({ length: 11 }, (_, i) => <rect key={i} x={124 + i * 47} y={150 + r * 150 + ((i * 13) % 30)} width={36} height={100 - ((i * 13) % 30)} fill={MINI_COLS[(i + r * 3) % MINI_COLS.length]} opacity={0.9} />)}
      </g>
    ))}
    <rect x={1300} y={160} width={420} height={300} fill="#0E1A2E" stroke="#6B4A2E" strokeWidth={16} />
    {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={1340 + ((i * 67) % 340)} cy={200 + ((i * 53) % 220)} r={3} fill="#fff" opacity={0.5 + 0.5 * Math.sin(t * 2 + i)} />)}
    <rect y={760} width={1920} height={320} fill="#3A2A1C" />
    <rect x={600} y={700} width={900} height={36} rx={6} fill="#8A5A32" /><rect x={620} y={736} width={860} height={200} fill="#6B4426" />
    <g transform="translate(1380,700)"><path d="M-20,0 L20,0 L10,-120 L-10,-120Z" fill="#2A2A2A" /><path d="M-60,-120 L60,-120 L30,-170 L-30,-170Z" fill="#2E7D5B" /><ellipse cx={0} cy={-80} rx={240} ry={160} fill="url(#tGlow)" opacity={0.5} /></g>
  </g>
);
export const PhotoFrame: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-190} width={300} height={380} fill="#D9B77A" />
    <rect x={-130} y={-170} width={260} height={340} fill="#EADFC6" />
    <rect x={-130} y={-170} width={260} height={340} fill="#C9B48C" opacity={0.3} />
    <g transform="translate(0,170) scale(0.58)"><TFig x={0} y={0} o={BES} t={t} mouth="smile" pose={P.stand} /></g>
  </g>
);

// Kapalıçarşı: kemerler, asılı lambalar, dükkânlar, kalabalık
export const Bazaar: React.FC<{ t: number; px?: number; crowd?: number }> = ({ t, px = 0, crowd = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9D6B0" />
    <g transform={`translate(${-px},0)`}>
      {Array.from({ length: 9 }, (_, i) => {
        const x = -200 + i * 360;
        return (
          <g key={i}>
            <path d={`M${x},0 L${x},300 A180,140 0 0 1 ${x + 360},300 L${x + 360},0Z`} fill="#C9A26A" />
            <path d={`M${x + 12},300 A168,128 0 0 1 ${x + 348},300`} fill="none" stroke="#B23A3F" strokeWidth={14} strokeDasharray="30 22" />
            <path d={`M${x + 180},0 V120`} stroke="#5A3E25" strokeWidth={3} />
            <g transform={`translate(${x + 180},170) rotate(${Math.sin(t * 1.4 + i) * 4})`}>
              <path d="M0,-50 L0,-10" stroke="#5A3E25" strokeWidth={3} />
              {[-1, 0, 1].map((k) => <circle key={k} cx={k * 22} cy={18 + Math.abs(k) * 6} r={18} fill={[T.blue, T.red, T.yellow][k + 1]} opacity={0.9} />)}
              <ellipse cx={0} cy={20} rx={90} ry={60} fill="url(#tGlow)" opacity={0.5} />
            </g>
            <rect x={x + 20} y={360} width={320} height={440} fill="#8A5A32" />
            <rect x={x + 34} y={374} width={292} height={410} fill={i % 3 === 0 ? "#3A2A20" : "#4A3424"} />
            {i % 3 === 0 && [0, 1, 2].map((k) => <rect key={k} x={x + 50 + k * 92} y={390} width={80} height={380} fill={k === 1 ? "url(#tCarpet2)" : "url(#tCarpet)"} />)}
            {i % 3 === 1 && Array.from({ length: 12 }, (_, k) => <circle key={k} cx={x + 70 + (k % 4) * 72} cy={430 + Math.floor(k / 4) * 110} r={30} fill={[T.blue, T.red, T.yellow, T.green][k % 4]} opacity={0.85} />)}
            {i % 3 === 2 && Array.from({ length: 9 }, (_, k) => <rect key={k} x={x + 60 + (k % 3) * 90} y={420 + Math.floor(k / 3) * 120} width={60} height={80} rx={8} fill={["#E8C49A", "#C9A5C9", "#F6C445"][k % 3]} />)}
            <rect x={x + 10} y={330} width={340} height={40} rx={6} fill="#B23A3F" />
            <text x={x + 180} y={358} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={20} fill="#FFF3D6">{["HALI", "LAMBA", "LOKUM", "HALI", "SERAMİK", "BAHARAT", "HALI", "LAMBA", "ÇAY"][i]}</text>
          </g>
        );
      })}
      {crowd > 0 && Array.from({ length: 30 }, (_, i) => {
        const x = ((i * 113 + t * (i % 2 ? 50 : -40)) % 3200 + 3200) % 3200 - 300;
        return <TMini key={i} x={x} y={830 + (i % 4) * 14} s={1.2 + (i % 4) * 0.1} c={MINI_COLS[(i * 3) % MINI_COLS.length]} t={t} seed={i} />;
      })}
    </g>
    <rect y={820} width={1920} height={260} fill="#B89A6E" /><rect y={820} width={1920} height={260} fill="url(#tStone)" />
  </g>
);
// han kapısı (yakın)
export const HanDoor: React.FC<{ t: number; close?: number }> = ({ close = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#CDB287" />
    <rect width={1920} height={1080} fill="url(#tStone)" />
    <path d="M640,860 L640,300 A320,280 0 0 1 1280,300 L1280,860Z" fill="#7A5638" />
    <path d="M680,860 L680,310 A280,250 0 0 1 1240,310 L1240,860Z" fill="#1E1610" />
    <g transform={`translate(680,0) scale(${lerp(0.08, 1, close)},1)`}><rect x={0} y={250} width={280} height={610} fill="#6B4426" /><path d="M20,300 V840 M140,300 V840 M260,300 V840" stroke="#4A2E18" strokeWidth={6} /></g>
    <g transform={`translate(1240,0) scale(${-lerp(0.08, 1, close)},1)`}><rect x={0} y={250} width={280} height={610} fill="#6B4426" /><path d="M20,300 V840 M140,300 V840 M260,300 V840" stroke="#4A2E18" strokeWidth={6} /></g>
    <rect y={860} width={1920} height={220} fill="#9E8460" /><rect y={860} width={1920} height={220} fill="url(#tStone)" />
  </g>
);

// gece yolu: yaya geçidi, sokak lambaları
export const NightRoad: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#tSkyNight)" />
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 197) % 1920} cy={(i * 89) % 380} r={2.5} fill="#fff" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />)}
    {Array.from({ length: 9 }, (_, i) => {
      const x = i * 230 - 60, h = 300 + ((i * 71) % 200);
      return <g key={i}><rect x={x} y={640 - h} width={210} height={h} fill="#16243C" />{Array.from({ length: 8 }, (_, k) => <rect key={k} x={x + 24 + (k % 3) * 60} y={640 - h + 30 + Math.floor(k / 3) * 70} width={30} height={40} fill="#F6D27A" opacity={(k + i) % 3 ? 0.85 : 0.15} />)}</g>;
    })}
    <rect y={640} width={1920} height={60} fill="#2A3346" />
    <rect y={700} width={1920} height={380} fill="#333A44" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={720 + i * 64} y={720} width={40} height={340} fill="#E8E8E8" opacity={0.85} transform={`skewX(${(i - 3.5) * -2})`} />)}
    {[240, 1680].map((x) => <g key={x}><rect x={x - 6} y={300} width={12} height={400} fill="#3A3F48" /><path d={`M${x},300 q40,-10 60,10`} stroke="#3A3F48" strokeWidth={10} fill="none" /><ellipse cx={x + 60} cy={320} rx={20} ry={8} fill="#FFF3B0" /><path d={`M${x + 40},320 L${x - 80},700 L${x + 200},700 L${x + 80},320Z`} fill="#FFF3B0" opacity={0.12} /></g>)}
  </g>
);

// bilim sahnesi zemini: lacivert, ızgara
export const Lab: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#14294A" />
    {Array.from({ length: 21 }, (_, i) => <path key={i} d={`M${i * 96},0 V1080`} stroke="#1E3A64" strokeWidth={2} />)}
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M0,${i * 96} H1920`} stroke="#1E3A64" strokeWidth={2} />)}
    {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={(i * 263 + t * 20) % 1920} cy={(i * 151) % 1080} r={3} fill={T.rim} opacity={0.3} />)}
  </g>
);
export const EyeBrain: React.FC<{ t: number; k: number }> = ({ t, k }) => {
  const px = lerp(520, 1330, k);
  return (
    <g>
      <g transform="translate(420,540)">
        <ellipse rx={150} ry={100} fill="#FFFFFF" /><circle cx={30} r={60} fill="#3A7BD5" /><circle cx={40} r={30} fill={T.ink} /><circle cx={52} cy={-12} r={10} fill="#fff" />
      </g>
      <g transform="translate(1500,520)">
        <path d="M-200,40 C-230,-80 -120,-190 0,-180 C120,-200 230,-100 210,20 C230,110 140,170 40,160 C-40,190 -180,150 -200,40Z" fill="#F29BB4" />
        <path d="M-150,-40 q40,-40 80,0 q40,40 80,0 q40,-40 80,0 M-150,40 q40,-40 80,0 q40,40 80,0 q40,-40 80,0 M0,-180 V150" stroke="#D5728F" strokeWidth={10} fill="none" />
        <ellipse rx={300} ry={260} fill="url(#tGlow)" opacity={0.25 + 0.2 * Math.sin(t * 4)} />
      </g>
      <path d="M600,540 C800,480 1100,600 1290,520" stroke={T.rim} strokeWidth={8} strokeDasharray="20 16" fill="none" />
      <circle cx={px} cy={540 + Math.sin(k * Math.PI) * -30} r={20} fill={T.yellow} />
      <circle cx={px} cy={540 + Math.sin(k * Math.PI) * -30} r={44} fill={T.yellow} opacity={0.25} />
    </g>
  );
};

// geleceği görme efekti için zaman halkası (SVG)
export const Ring10: React.FC<{ x: number; y: number; k: number; n: number; r?: number }> = ({ x, y, k, n, r = 70 }) => (
  <g transform={`translate(${x},${y})`}>
    <circle r={r} fill="#0E1A2E" opacity={0.75} />
    <circle r={r - 8} fill="none" stroke="#1E3A5E" strokeWidth={10} />
    <circle r={r - 8} fill="none" stroke={T.rim} strokeWidth={10} strokeDasharray={`${2 * Math.PI * (r - 8) * (1 - k)} 9999`} transform="rotate(-90)" strokeLinecap="round" />
    <text y={r * 0.25} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={r * 0.75} fill="#FFFFFF">{n}</text>
  </g>
);

export const rmp = ramp;
export const k01 = clamp01;
