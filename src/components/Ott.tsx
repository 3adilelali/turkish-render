import React from "react";
import { ramp } from "../lib/cues";
import { FONT, HAND } from "../theme";
import { Pose } from "./Stick";

// Channel 3 ("Osmanlı Zamanında Hayat") kit: white-headed stick figures in Ottoman costume on cream paper,
// İznik cobalt/turquoise accents, flat painted Istanbul scenes. Everything drawn in code (1920x1080 SVG).

export const K3 = {
  paper: "#F4ECDC", paper2: "#E9DDC6", ink: "#1E1B18", cobalt: "#1F4FA3", turq: "#1AA7A1", red: "#B8322E", gold: "#D9A43A",
  sea: "#3E8FC4", sea2: "#2C6E9E", sky: "#BFE1F2", stone: "#D8C7A6", stone2: "#BFA982", green: "#4F8A4B", cypress: "#2F5D3A",
};

export type OLook = {
  robe: string; robe2?: string; hat?: "kavuk" | "sarik" | "tac" | "hotoz" | "veil" | "fes" | "none"; hatColor?: string;
  beard?: boolean; female?: boolean; plume?: boolean; child?: boolean;
};
export const SULTAN: OLook = { robe: "#2E5AAC", robe2: "#E8C46A", hat: "sarik", hatColor: "#FBF8F0", beard: true, plume: true };
export const PASHA: OLook = { robe: "#B8322E", robe2: "#7E1F1C", hat: "kavuk", hatColor: "#FBF8F0", beard: true };
export const PRINCESS: OLook = { robe: "#D9849B", robe2: "#F2D6A0", hat: "hotoz", hatColor: "#E8C46A", female: true };
export const PRINCESS2: OLook = { robe: "#1AA7A1", robe2: "#F2D6A0", hat: "hotoz", hatColor: "#D9A43A", female: true };
export const LADY: OLook = { robe: "#8E7CC3", robe2: "#E9DDC6", hat: "veil", hatColor: "#F3EFE6", female: true };
export const SERVANT: OLook = { robe: "#8A9AA8", robe2: "#6E7F8D", hat: "veil", hatColor: "#E6E1D6", female: true };
export const PRINCE: OLook = { robe: "#D9A43A", robe2: "#8A5A1E", hat: "sarik", hatColor: "#FBF8F0", plume: true };
export const JANISSARY: OLook = { robe: "#3D6B4F", robe2: "#2B4D38", hat: "kavuk", hatColor: "#FBF8F0" };
export const ARCHITECT: OLook = { robe: "#6B5B45", robe2: "#4A3E2F", hat: "sarik", hatColor: "#F3EFE6", beard: true };

const pt = (x: number, y: number, a: number, len: number, dir: number) => {
  const r = (a * Math.PI) / 180;
  return [x + Math.sin(r) * len * dir, y + Math.cos(r) * len] as const;
};

export type OFace = "normal" | "smile" | "sad" | "shock" | "angry" | "worried" | "closed" | "sly";

export const OFig: React.FC<{ x: number; y: number; s?: number; pose: Pose; look: OLook; dir?: 1 | -1; face?: OFace; holdR?: React.ReactNode; talk?: number }> = ({
  x, y, s = 1, pose: p, look, dir = 1, face = "normal", holdR, talk = 0,
}) => {
  const hip = [0, -108 + p.hy] as const;
  const neck = pt(hip[0], hip[1], 180 + p.lean, 82, dir);
  const head = pt(neck[0], neck[1], 180 + p.lean + p.head, 46, dir);
  const sh = pt(neck[0], neck[1], p.lean, 8, dir);
  const limb = (o: readonly [number, number], a1: number, a2: number, l1: number, l2: number) => {
    const m = pt(o[0], o[1], a1, l1, dir);
    return { m, e: pt(m[0], m[1], a2, l2, dir) };
  };
  const la = limb(sh, p.la1, p.la2, 46, 44);
  const ra = limb(sh, p.ra1, p.ra2, 46, 44);
  const ll = limb(hip, p.ll1, p.ll2, 54, 52);
  const rl = limb(hip, p.rl1, p.rl2, 54, 52);
  const L = (pts: (readonly [number, number])[], w = 6) => (
    <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke={K3.ink} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  );
  const [hx, hy] = head;
  const r = 42;
  const sitting = p.hy > 20;
  // robe: trapezoid from shoulders to hem
  const hemY = sitting ? hip[1] + 40 : -12;
  const hemW = look.female ? 66 : 56;
  const robe = `M${neck[0] - 26},${neck[1] + 6} L${neck[0] + 26},${neck[1] + 6} L${hip[0] + hemW},${hemY} Q${hip[0]},${hemY + 10} ${hip[0] - hemW},${hemY} Z`;
  const ex = 10 * dir;
  const eye = (cx: number) => {
    if (face === "closed") return <path d={`M${cx - 6},${hy - 2} h12`} stroke={K3.ink} strokeWidth={3.5} strokeLinecap="round" />;
    return <ellipse cx={cx} cy={hy - 3} rx={face === "shock" ? 6 : 4.5} ry={face === "shock" ? 9 : 7} fill={K3.ink} />;
  };
  const mouthOpen = talk > 0 && Math.sin(talk * 22) > 0;
  const mouth =
    face === "shock" || mouthOpen ? <ellipse cx={hx + ex} cy={hy + 17} rx={6} ry={7} fill={K3.ink} /> :
    face === "sad" || face === "worried" ? <path d={`M${hx + ex - 9},${hy + 20} q9,-7 18,0`} stroke={K3.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" /> :
    face === "angry" ? <path d={`M${hx + ex - 9},${hy + 17} h18`} stroke={K3.ink} strokeWidth={3.5} strokeLinecap="round" /> :
    face === "sly" ? <path d={`M${hx + ex - 8},${hy + 14} q10,6 18,-3`} stroke={K3.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" /> :
    <path d={`M${hx + ex - 9},${hy + 13} q9,${face === "smile" ? 10 : 6} 18,0`} stroke={K3.ink} strokeWidth={3.5} fill="none" strokeLinecap="round" />;
  const hat = () => {
    const c = look.hatColor ?? "#FBF8F0";
    switch (look.hat) {
      case "kavuk": return <path d={`M${hx - 30},${hy - r + 14} L${hx - 26},${hy - r - 70} Q${hx},${hy - r - 84} ${hx + 26},${hy - r - 70} L${hx + 30},${hy - r + 14} Z`} fill={c} stroke={K3.ink} strokeWidth={4} />;
      case "sarik":
        return (
          <g>
            <ellipse cx={hx} cy={hy - r + 2} rx={50} ry={34} fill={c} stroke={K3.ink} strokeWidth={4} />
            <path d={`M${hx - 44},${hy - r + 8} Q${hx},${hy - r - 26} ${hx + 44},${hy - r + 8}`} stroke={K3.ink} strokeWidth={2.5} fill="none" opacity={0.5} />
            {look.plume && <><path d={`M${hx + 6},${hy - r - 28} q10,-40 -4,-62 q24,22 10,62Z`} fill={K3.ink} opacity={0.85} /><circle cx={hx + 6} cy={hy - r - 26} r={7} fill={K3.red} stroke={K3.gold} strokeWidth={3} /></>}
          </g>
        );
      case "tac": return <path d={`M${hx - 30},${hy - r + 10} l0,-40 l15,18 l15,-28 l15,28 l15,-18 l0,40Z`} fill={K3.gold} stroke={K3.ink} strokeWidth={4} />;
      case "fes": return <path d={`M${hx - 28},${hy - r + 12} L${hx - 22},${hy - r - 34} L${hx + 22},${hy - r - 34} L${hx + 28},${hy - r + 12}Z`} fill={K3.red} stroke={K3.ink} strokeWidth={4} />;
      case "hotoz":
        return (
          <g>
            <path d={`M${hx - 52},${hy + 70} C${hx - 64},${hy - 70} ${hx + 64},${hy - 70} ${hx + 52},${hy + 70}`} fill={look.robe2 ?? "#F2D6A0"} opacity={0.55} stroke={K3.ink} strokeWidth={3} />
            <path d={`M${hx - 30},${hy - r + 12} L${hx - 26},${hy - r - 26} L${hx + 26},${hy - r - 26} L${hx + 30},${hy - r + 12}Z`} fill={c} stroke={K3.ink} strokeWidth={4} />
            <circle cx={hx} cy={hy - r - 8} r={6} fill={K3.red} />
          </g>
        );
      case "veil": return <path d={`M${hx - 50},${hy + 76} C${hx - 66},${hy - 76} ${hx + 66},${hy - 76} ${hx + 50},${hy + 76} L${hx + 38},${hy + 10} C${hx + 40},${hy - 46} ${hx - 40},${hy - 46} ${hx - 38},${hy + 10}Z`} fill={c} stroke={K3.ink} strokeWidth={3.5} />;
      default: return null;
    }
  };
  return (
    <g transform={`translate(${x},${y}) scale(${s * 1.15 * (look.child ? 0.7 : 1)})`}>
      {look.hat === "hotoz" && hat()}
      {L([hip, ll.m, ll.e])}
      {L([hip, rl.m, rl.e])}
      {L([sh, la.m, la.e])}
      <path d={robe} fill={look.robe} stroke={K3.ink} strokeWidth={4} strokeLinejoin="round" />
      <path d={`M${neck[0]},${neck[1] + 6} L${hip[0]},${hemY + 4}`} stroke={look.robe2 ?? look.robe} strokeWidth={8} opacity={0.9} />
      <path d={`M${hip[0] - 34},${hip[1] - 4} L${hip[0] + 34},${hip[1] - 4}`} stroke={look.robe2 ?? K3.gold} strokeWidth={10} />
      <circle cx={hx} cy={hy} r={r} fill="#FFFDF7" stroke={K3.ink} strokeWidth={4} />
      {look.hat !== "hotoz" && hat()}
      {look.beard && <path d={`M${hx - 26 + ex},${hy + 22} Q${hx + ex},${hy + 62} ${hx + 26 + ex},${hy + 22} Q${hx + ex},${hy + 34} ${hx - 26 + ex},${hy + 22}Z`} fill="#5B4636" stroke={K3.ink} strokeWidth={2.5} />}
      {face === "angry" && <path d={`M${hx + ex - 18},${hy - 18} l12,5 M${hx + ex + 18},${hy - 18} l-12,5`} stroke={K3.ink} strokeWidth={3.5} strokeLinecap="round" />}
      {face === "worried" && <path d={`M${hx + ex - 18},${hy - 13} l12,-5 M${hx + ex + 18},${hy - 13} l-12,-5`} stroke={K3.ink} strokeWidth={3.5} strokeLinecap="round" />}
      {eye(hx + ex - 10)}
      {eye(hx + ex + 10)}
      {!look.beard && mouth}
      {look.beard && (mouthOpen || face === "shock") && <ellipse cx={hx + ex} cy={hy + 22} rx={5} ry={5} fill={K3.ink} />}
      {L([sh, ra.m, ra.e])}
      {holdR && <g transform={`translate(${ra.e[0]},${ra.e[1]})`}>{holdR}</g>}
    </g>
  );
};

// ───────── backgrounds ─────────
export const OFrame: React.FC<{ children: React.ReactNode; t?: number; from?: number; bg?: string }> = ({ children, t = 0, from = 0, bg = K3.paper }) => (
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0, background: bg, opacity: ramp(t, from - 0.01, from + 0.2) }}>
    <defs>
      <radialGradient id="k3vig" cx="0.5" cy="0.5" r="0.8">
        <stop offset="0.65" stopColor="#6B4F2A" stopOpacity="0" />
        <stop offset="1" stopColor="#6B4F2A" stopOpacity="0.25" />
      </radialGradient>
      <pattern id="k3tile" width="120" height="120" patternUnits="userSpaceOnUse">
        <rect width="120" height="120" fill="#F7F3EA" />
        <rect width="120" height="120" fill="none" stroke={K3.cobalt} strokeWidth="3" />
        <path d="M60,14 C74,36 74,46 60,60 C46,46 46,36 60,14Z M60,106 C46,84 46,74 60,60 C74,74 74,84 60,106Z M14,60 C36,46 46,46 60,60 C46,74 36,74 14,60Z M106,60 C84,74 74,74 60,60 C74,46 84,46 106,60Z" fill={K3.cobalt} />
        <circle cx="60" cy="60" r="9" fill={K3.red} />
        {[0, 120].map((x) => [0, 120].map((y) => <circle key={`${x}${y}`} cx={x} cy={y} r="16" fill={K3.turq} />))}
      </pattern>
      <pattern id="k3lattice" width="40" height="40" patternUnits="userSpaceOnUse">
        <path d="M0,20 L20,0 L40,20 L20,40Z" fill="none" stroke="#6B4A2B" strokeWidth="6" />
      </pattern>
    </defs>
    {children}
    <rect width="1920" height="1080" fill="url(#k3vig)" pointerEvents="none" />
  </svg>
);

export const OCam: React.FC<{ t: number; from: number; z?: [number, number]; cx?: number; cy?: number; dur?: number; children: React.ReactNode }> = ({ t, from, z = [1, 1.05], cx = 960, cy = 540, dur = 7, children }) => {
  const k = z[0] + (z[1] - z[0]) * ramp(t, from, from + dur);
  return <g transform={`translate(${cx},${cy}) scale(${k}) translate(${-cx},${-cy})`}>{children}</g>;
};

const dome = (x: number, y: number, w: number, c: string) => <path d={`M${x - w / 2},${y} A${w / 2},${w * 0.42} 0 0 1 ${x + w / 2},${y}Z`} fill={c} stroke={K3.ink} strokeWidth={3} />;
const minaret = (x: number, y: number, h: number, c: string) => (
  <g><rect x={x - 7} y={y - h} width={14} height={h} fill={c} stroke={K3.ink} strokeWidth={3} /><path d={`M${x - 9},${y - h} L${x},${y - h - 46} L${x + 9},${y - h}Z`} fill={K3.cobalt} stroke={K3.ink} strokeWidth={3} /><rect x={x - 12} y={y - h * 0.62} width={24} height={8} fill={c} stroke={K3.ink} strokeWidth={2} /></g>
);
export const Mosque: React.FC<{ x: number; y: number; s?: number; minarets?: number; c?: string }> = ({ x, y, s = 1, minarets = 4, c = "#EDE3CF" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[-1, 1].slice(0, minarets >= 2 ? 2 : 1).map((k) => minaret(k * 190, 0, 330, c))}
    {minarets >= 4 && [-1, 1].map((k) => minaret(k * 150, 0, 260, c))}
    <rect x={-140} y={-110} width={280} height={110} fill={c} stroke={K3.ink} strokeWidth={3} />
    {dome(-95, -110, 70, c)}{dome(95, -110, 70, c)}
    <rect x={-80} y={-150} width={160} height={40} fill={c} stroke={K3.ink} strokeWidth={3} />
    {dome(0, -150, 180, c)}
    <line x1={0} y1={-226} x2={0} y2={-258} stroke={K3.gold} strokeWidth={5} />
    {[-100, -50, 0, 50, 100].map((wx) => <path key={wx} d={`M${wx - 12},-20 v-40 a12,12 0 0 1 24,0 v40Z`} fill={K3.ink} opacity={0.7} />)}
  </g>
);
export const Cypress: React.FC<{ x: number; y: number; h?: number }> = ({ x, y, h = 180 }) => <path d={`M${x},${y - h} C${x + 26},${y - h * 0.5} ${x + 22},${y} ${x},${y} C${x - 22},${y} ${x - 26},${y - h * 0.5} ${x},${y - h}Z`} fill={K3.cypress} stroke={K3.ink} strokeWidth={2.5} />;

export const Panorama: React.FC<{ t: number; quay?: boolean }> = ({ t, quay }) => (
  <g>
    <rect width="1920" height="1080" fill={K3.sky} />
    <circle cx={1640} cy={150} r={60} fill="#FBE7A1" />
    <rect x={0} y={620} width={1920} height={460} fill={K3.sea} />
    {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${((i * 151 + t * 25) % 2050) - 80},${680 + (i % 5) * 70} q20,-10 40,0 q20,10 40,0`} stroke="#9FD0EA" strokeWidth={4} fill="none" />)}
    <path d="M0,640 L0,470 Q300,420 620,470 L900,520 L960,640Z" fill={K3.green} stroke={K3.ink} strokeWidth={3} />
    {/* Topkapı walls on the point */}
    <path d="M60,560 L860,560" stroke={K3.stone} strokeWidth={30} />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={70 + i * 95} y={520} width={34} height={60} fill={K3.stone} stroke={K3.ink} strokeWidth={2.5} />)}
    <Mosque x={420} y={470} s={0.75} />
    <Mosque x={1250} y={560} s={0.9} />
    <path d="M960,640 L1920,600 L1920,640Z" fill={K3.green} />
    {[120, 210, 680, 760, 1040, 1520, 1600].map((x) => <Cypress key={x} x={x} y={x > 900 ? 600 : 520} h={150} />)}
    <g transform={`translate(${200 + t * 18},760)`}><path d="M-80,0 L80,0 L60,30 L-60,30Z" fill="#8A5A1E" stroke={K3.ink} strokeWidth={3} /><path d="M0,0 V-100 L60,-30Z" fill="#F7F3EA" stroke={K3.ink} strokeWidth={3} /></g>
    {quay && <g><rect x={0} y={870} width={1920} height={210} fill={K3.stone} stroke={K3.ink} strokeWidth={4} />{Array.from({ length: 16 }, (_, i) => <rect key={i} x={i * 124} y={880} width={110} height={50} rx={6} fill={K3.stone2} opacity={0.5} />)}</g>}
  </g>
);

export const Palace: React.FC<{ lamp?: boolean; window?: boolean }> = ({ lamp = false, window = true }) => (
  <g>
    <rect width="1920" height="1080" fill="url(#k3tile)" />
    <rect width="1920" height="1080" fill={K3.paper} opacity={0.45} />
    <rect x={0} y={0} width={1920} height={70} fill={K3.cobalt} />
    <rect x={0} y={70} width={1920} height={14} fill={K3.gold} />
    {window && (
      <g>
        <path d="M760,620 V330 A200,200 0 0 1 1160,330 V620Z" fill={K3.sky} stroke={K3.ink} strokeWidth={8} />
        <path d="M760,620 V330 A200,200 0 0 1 1160,330 V620Z" fill="url(#k3lattice)" opacity={0.7} />
      </g>
    )}
    <rect x={0} y={760} width={1920} height={320} fill="#8B3A2E" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 170},820 l85,40 l85,-40`} stroke={K3.gold} strokeWidth={6} fill="none" opacity={0.7} />)}
    <rect x={0} y={700} width={1920} height={70} fill="#D8B26E" stroke={K3.ink} strokeWidth={3} />
    {lamp && <g transform="translate(1600,180)"><line y1={-110} y2={0} stroke={K3.ink} strokeWidth={3} /><path d="M-30,0 h60 l-10,50 h-40Z" fill={K3.gold} stroke={K3.ink} strokeWidth={3} /><circle cy={70} r={90} fill="#FFE29A" opacity={0.25} /></g>}
  </g>
);

export const Street: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width="1920" height="1080" fill={K3.sky} />
    <Mosque x={960} y={560} s={0.8} />
    {[0, 1, 2, 3].map((i) => {
      const x = i < 2 ? i * 260 : 1400 + (i - 2) * 260;
      return (
        <g key={i}>
          <rect x={x} y={300} width={250} height={400} fill={["#C98B5E", "#E2C08D", "#B86F52", "#D9A06A"][i]} stroke={K3.ink} strokeWidth={3} />
          <rect x={x - 10} y={420} width={270} height={130} fill="#9C5B3B" stroke={K3.ink} strokeWidth={3} />
          {[0, 1].map((w) => <rect key={w} x={x + 30 + w * 110} y={440} width={70} height={90} fill="url(#k3lattice)" stroke={K3.ink} strokeWidth={3} />)}
          <path d={`M${x - 20},300 L${x + 125},230 L${x + 270},300Z`} fill="#8B3A2E" stroke={K3.ink} strokeWidth={3} />
        </g>
      );
    })}
    <rect x={0} y={700} width={1920} height={380} fill={K3.stone} />
    {Array.from({ length: 40 }, (_, i) => <rect key={i} x={(i * 97) % 1920} y={720 + (i % 6) * 58} width={80} height={44} rx={8} fill={K3.stone2} opacity={0.5} />)}
  </g>
);

export const Desert: React.FC = () => (
  <g>
    <rect width="1920" height="1080" fill="#F2D9A6" />
    <rect width="1920" height="520" fill="#F7E2B5" />
    <path d="M0,520 Q480,470 960,520 T1920,520 V1080 H0Z" fill="#E3BE7E" />
  </g>
);

export const Army: React.FC<{ x: number; y: number; n?: number; color: string; dir?: 1 | -1; flag?: string; t: number; march?: number }> = ({ x, y, n = 18, color, dir = 1, flag, t, march = 0 }) => (
  <g transform={`translate(${x + march * dir},${y})`}>
    {Array.from({ length: n }, (_, i) => {
      const cx = (i % 6) * 70 * dir, cy = Math.floor(i / 6) * 70;
      const b = Math.sin(t * 8 + i) * 3;
      return (
        <g key={i} transform={`translate(${cx},${cy + b}) scale(0.45)`}>
          <path d="M-30,-160 L30,-160 L44,0 L-44,0Z" fill={color} stroke={K3.ink} strokeWidth={6} />
          <circle cx={0} cy={-200} r={40} fill="#FFFDF7" stroke={K3.ink} strokeWidth={6} />
          <path d="M-26,-226 L-22,-300 L22,-300 L26,-226Z" fill="#FBF8F0" stroke={K3.ink} strokeWidth={6} />
          <line x1={50} y1={-60} x2={50} y2={-320} stroke={K3.ink} strokeWidth={8} />
        </g>
      );
    })}
    {flag && <g><line x1={0} y1={0} x2={0} y2={-260} stroke={K3.ink} strokeWidth={6} /><path d={`M0,-260 l${90 * dir},20 l${-90 * dir},20Z`} fill={flag} stroke={K3.ink} strokeWidth={3} /></g>}
  </g>
);

export const Litter: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-260} width={300} height={220} fill={K3.red} stroke={K3.ink} strokeWidth={4} />
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={-150 + i * 60} y1={-260} x2={-150 + i * 60} y2={-40} stroke="#8E211E" strokeWidth={6} />)}
    <path d="M-170,-260 Q0,-330 170,-260Z" fill={K3.gold} stroke={K3.ink} strokeWidth={4} />
    <line x1={-240} y1={-40} x2={240} y2={-40} stroke="#6B4A2B" strokeWidth={14} strokeLinecap="round" />
  </g>
);

export const Coins: React.FC<{ t: number; from: number; x?: number; y?: number }> = ({ t, from, x = 960, y = 300 }) => (
  <g>
    {Array.from({ length: 18 }, (_, i) => {
      const k = ((t - from) * 0.6 + i / 18) % 1;
      if (t < from) return null;
      return <ellipse key={i} cx={x + Math.sin(i * 2.3) * 520 * k} cy={y + k * 560 - Math.sin(k * Math.PI) * 160} rx={14} ry={10} fill={K3.gold} stroke={K3.ink} strokeWidth={2} opacity={1 - k * 0.4} />;
    })}
  </g>
);

export const Ship: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-120,0 L120,0 L90,40 L-100,40Z" fill="#7A4B22" stroke={K3.ink} strokeWidth={4} />
    {Array.from({ length: 7 }, (_, i) => <line key={i} x1={-90 + i * 28} y1={30} x2={-110 + i * 28} y2={70} stroke={K3.ink} strokeWidth={4} />)}
    <line x1={0} y1={0} x2={0} y2={-150} stroke={K3.ink} strokeWidth={6} />
    <path d="M0,-150 Q70,-90 0,-20Z" fill="#F7F3EA" stroke={K3.ink} strokeWidth={4} />
    <path d="M0,-150 l40,10 l-40,10Z" fill={K3.red} />
  </g>
);

export const Scroll: React.FC<{ s?: number; seal?: boolean }> = ({ s = 1, seal = true }) => (
  <g transform={`scale(${s})`}>
    <rect x={-120} y={-80} width={240} height={160} fill="#F7EBD0" stroke={K3.ink} strokeWidth={4} />
    <rect x={-136} y={-92} width={24} height={184} rx={10} fill={K3.stone2} stroke={K3.ink} strokeWidth={4} />
    <rect x={112} y={-92} width={24} height={184} rx={10} fill={K3.stone2} stroke={K3.ink} strokeWidth={4} />
    {[-40, -10, 20].map((y) => <path key={y} d={`M-90,${y} q30,-10 60,0 t60,0 t60,0`} stroke={K3.ink} strokeWidth={3} fill="none" opacity={0.6} />)}
    {seal && <circle cx={70} cy={50} r={20} fill={K3.red} stroke={K3.ink} strokeWidth={3} />}
  </g>
);
export const Cage: React.FC<{ s?: number; open?: number }> = ({ s = 1, open = 0 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-110,120 V-40 A110,110 0 0 1 110,-40 V120Z" fill="none" stroke={K3.gold} strokeWidth={8} />
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={-88 + i * 22} y1={120} x2={-88 + i * 22} y2={-60 - Math.sin((i / 8) * Math.PI) * 80} stroke={K3.gold} strokeWidth={5} />)}
    <rect x={-120} y={110} width={240} height={20} fill={K3.gold} stroke={K3.ink} strokeWidth={3} />
    <circle cx={0} cy={-160} r={16} fill="none" stroke={K3.gold} strokeWidth={6} />
    <g transform={`translate(-110,0) rotate(${-open * 70},0,120)`}><rect x={0} y={0} width={10} height={120} fill={K3.gold} /></g>
  </g>
);
export const CoinBag: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-70,80 C-110,20 -60,-40 -30,-50 L30,-50 C60,-40 110,20 70,80Z" fill="#7A5230" stroke={K3.ink} strokeWidth={4} />
    <path d="M-30,-50 L-40,-80 L40,-80 L30,-50" fill="#7A5230" stroke={K3.ink} strokeWidth={4} />
    {[-30, 0, 30].map((x) => <ellipse key={x} cx={x} cy={-88} rx={16} ry={10} fill={K3.gold} stroke={K3.ink} strokeWidth={2} />)}
  </g>
);
export const Throne: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-110} y={-260} width={220} height={260} rx={10} fill={K3.gold} stroke={K3.ink} strokeWidth={4} />
    <rect x={-80} y={-230} width={160} height={150} fill={K3.red} stroke={K3.ink} strokeWidth={3} />
    <path d="M-120,-260 Q0,-340 120,-260Z" fill={K3.gold} stroke={K3.ink} strokeWidth={4} />
    <rect x={-130} y={-80} width={260} height={40} fill="#8E211E" stroke={K3.ink} strokeWidth={3} />
  </g>
);
export const Tomb: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-220} width={300} height={220} fill="#EDE3CF" stroke={K3.ink} strokeWidth={4} />
    {[-90, 0, 90].map((wx) => <path key={wx} d={`M${wx - 24},-40 v-110 a24,24 0 0 1 48,0 v110Z`} fill={K3.cobalt} stroke={K3.ink} strokeWidth={3} />)}
    <path d="M-150,-220 A150,120 0 0 1 150,-220Z" fill="#9AA5A8" stroke={K3.ink} strokeWidth={4} />
    <line x1={0} y1={-340} x2={0} y2={-370} stroke={K3.gold} strokeWidth={6} />
  </g>
);
export const Sedir: React.FC<{ x: number; y: number; w?: number }> = ({ x, y, w = 600 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-w / 2} y={-60} width={w} height={60} rx={10} fill={K3.turq} stroke={K3.ink} strokeWidth={4} />
    {Array.from({ length: Math.floor(w / 140) }, (_, i) => <rect key={i} x={-w / 2 + 20 + i * 140} y={-130} width={110} height={80} rx={20} fill="#E8C46A" stroke={K3.ink} strokeWidth={3} />)}
  </g>
);

// hand-written key word card on paper, with an optional doodle
export const Word: React.FC<{ t: number; at: number; text: string; sub?: string; color?: string; x?: number; y?: number; size?: number; children?: React.ReactNode; card?: boolean; until?: number }> = ({ t, at, text, sub, color = K3.cobalt, x = 960, y = 760, size = 120, children, card = false, until = 1e9 }) => {
  const k = ramp(t, at, at + 0.3) * (1 - ramp(t, until, until + 0.3));
  if (k <= 0) return null;
  const len = text.length;
  return (
    <g opacity={k} transform={`translate(${x},${y + (1 - k) * 30})`}>
      {card && <rect x={-len * size * 0.25 - 50} y={-size * 0.95} width={len * size * 0.5 + 100} height={size * (sub ? 1.95 : 1.4)} rx={24} fill={K3.paper} stroke={K3.ink} strokeWidth={4} />}
      <text textAnchor="middle" fontFamily={HAND} fontSize={size} fill={color}>{text}</text>
      <path d={`M${-len * size * 0.22},${size * 0.2} q${len * size * 0.22},${size * 0.12} ${len * size * 0.44},0`} stroke={color} strokeWidth={6} fill="none" strokeLinecap="round" strokeDasharray={len * size} strokeDashoffset={(1 - ramp(t, at + 0.2, at + 0.7)) * len * size} />
      {sub && <text y={size * 0.75} textAnchor="middle" fontFamily={HAND} fontSize={size * 0.45} fill={K3.ink}>{sub}</text>}
      {children}
    </g>
  );
};
export const Label: React.FC<{ t: number; at: number; text: string; x: number; y: number; size?: number; color?: string }> = ({ t, at, text, x, y, size = 54, color = K3.ink }) => {
  const k = ramp(t, at, at + 0.25);
  return k > 0 ? <text x={x} y={y} opacity={k} textAnchor="middle" fontFamily={HAND} fontSize={size} fill={color}>{text}</text> : null;
};
export const Cross: React.FC<{ t: number; at: number; x: number; y: number; w?: number }> = ({ t, at, x, y, w = 400 }) => {
  const k = ramp(t, at, at + 0.4);
  return <path d={`M${x - w / 2},${y - w / 2} L${x - w / 2 + w * k},${y - w / 2 + w * k} M${x + w / 2},${y - w / 2} L${x + w / 2 - w * k},${y - w / 2 + w * k}`} stroke={K3.red} strokeWidth={14} strokeLinecap="round" opacity={k > 0 ? 1 : 0} />;
};

// chapter card: big number + title on paper with tile border
export const OChapter: React.FC<{ t: number; from: number; n: number; title: string }> = ({ t, from, n, title }) => {
  const k = ramp(t, from, from + 0.35);
  return (
    <g>
      <rect width="1920" height="1080" fill="url(#k3tile)" />
      <rect x={160} y={140} width={1600} height={800} rx={30} fill={K3.paper} stroke={K3.cobalt} strokeWidth={10} />
      <g transform={`translate(960,${470 - (1 - k) * 40})`} opacity={k}>
        <circle r={120} fill={K3.cobalt} />
        <text y={52} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={150} fill="#fff">{n}</text>
      </g>
      <text x={960} y={760} textAnchor="middle" fontFamily={HAND} fontSize={110} fill={K3.ink} opacity={ramp(t, from + 0.25, from + 0.55)}>{title}</text>
    </g>
  );
};

export const OOutro: React.FC<{ t: number; from: number; q: string; subAt: number }> = ({ t, from, q, subAt }) => {
  const k = ramp(t, subAt, subAt + 0.4);
  return (
    <g>
      <rect width="1920" height="1080" fill={K3.paper} />
      <text x={960} y={200} textAnchor="middle" fontFamily={HAND} fontSize={88} fill={K3.ink}>{q}</text>
      <OFig x={640} y={900} s={1.6} look={PASHA} pose={{ la1: -10, la2: -5, ra1: 40, ra2: 160, ll1: -4, ll2: -4, rl1: 4, rl2: 4, lean: 0, head: 6, hy: 0 }} face="worried" />
      <OFig x={1280} y={900} s={1.6} look={PRINCESS} dir={-1} pose={{ la1: -10, la2: -5, ra1: 12, ra2: 6, ll1: -4, ll2: -4, rl1: 4, rl2: 4, lean: 0, head: -4, hy: 0 }} face="sly" />
      <g opacity={k} transform={`translate(960,${420 - 20 * (1 - k)})`}>
        <rect x={-240} y={-58} width={480} height={104} rx={52} fill={K3.red} />
        <text y={16} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={50} fill="#fff">ABONE OL</text>
      </g>
      <Label t={t} at={from + 0.3} text="?" x={960} y={760} size={200} color={K3.cobalt} />
    </g>
  );
};
