import React from "react";
import { interpolate } from "remotion";
import { ease, ramp } from "../lib/cues";
import { FONT } from "../theme";

// Channel 2 ("Olursa Ne Olur?") kit: black stick figures with a teal rim light, night-blue Istanbul scenes.
// Everything is drawn here in code. Coordinates are in a 1920x1080 SVG.

export const K2 = {
  sky1: "#081322", sky2: "#123049", glow: "#2E8C93", warm: "#F6B860", rim: "#5FF2E2",
  hoodie: "#1FC8B4", hoodie2: "#158F82", ink: "#070B12", ground: "#0D1A28", ground2: "#13283A",
  text: "#F4F7F6", red: "#FF5A5F", yellow: "#FFD25A",
};

// ───────── pose model ─────────
// Angles in degrees from straight down; positive = towards the facing side. Hip sits 112 px above the feet.
export type Pose = { la1: number; la2: number; ra1: number; ra2: number; ll1: number; ll2: number; rl1: number; rl2: number; lean: number; head: number; hy: number };
const P = (la1: number, la2: number, ra1: number, ra2: number, ll1 = -4, ll2 = -4, rl1 = 4, rl2 = 4, lean = 0, head = 0, hy = 0): Pose =>
  ({ la1, la2, ra1, ra2, ll1, ll2, rl1, rl2, lean, head, hy });

export const POSE = {
  stand: P(-12, -6, 12, 6),
  relax: P(-8, 4, 8, -4),
  wave: P(-12, -6, 150, 170),
  reach: P(-15, -5, 80, 85),          // right arm straight forward
  catchHigh: P(-20, -10, 130, 140),
  grab: P(-10, 20, 60, 100),          // arm forward, forearm up (holding)
  cheer: P(-150, -165, 150, 165),
  shrug: P(-60, -130, 60, 130),
  think: P(-10, -5, 40, 160, -4, -4, 4, 4, 0, 6),
  point: P(-10, -5, 95, 95),
  crouch: P(-40, 30, 40, -30, -35, 20, 35, -20, 8, 0, 34),   // goalkeeper ready
  block: P(-165, -175, 165, 175, -6, -6, 6, 6, 0, -4),
  dodgeL: P(-20, 60, 30, 120, -10, -4, 10, 4, -18, -8),
  dodgeR: P(-30, -120, 20, 70, -10, -4, 10, 4, 18, 8),
  guard: P(30, 150, 40, 160, -12, -6, 12, 6, 6, 0),
  punch: P(30, 150, 90, 90, -14, -6, 16, 6, 10, 0),
  headache: P(-140, -40, 140, 40, -4, -4, 4, 4, 0, -6),
  sit: P(20, 70, 30, 80, 85, 0, 90, 0, 0, 0, 40),
  gamer: P(55, 85, 60, 90, 85, 0, 90, 0, 12, 4, 40),
  sad: P(-6, 2, 6, -2, -4, -4, 4, 4, 10, 18),
  run1: P(-50, -100, 50, 100, -35, 10, 40, 80, 14),
  run2: P(50, 100, -50, -100, 40, 80, -35, 10, 14),
  walk1: P(-20, -10, 20, 10, -18, -10, 18, 4),
  walk2: P(20, 10, -20, -10, 18, 4, -18, -10),
  dive: P(-170, -175, 165, 175, -20, -10, 25, 10, 0, 0),
  kick: P(-30, -20, 40, 20, -10, -10, 70, 40, -8),
  set: P(-60, -10, 60, 10, -60, 30, 20, 20, 50, -10, 30), // sprint blocks
};
export type PoseName = keyof typeof POSE;

const lerpPose = (a: Pose, b: Pose, k: number): Pose => {
  const o = {} as Pose;
  (Object.keys(a) as (keyof Pose)[]).forEach((key) => (o[key] = a[key] + (b[key] - a[key]) * k));
  return o;
};
// [[time, pose], ...] → blended pose at t (0.35 s transitions)
export const poseAt = (keys: [number, PoseName | Pose][], t: number, blend = 0.35): Pose => {
  const get = (p: PoseName | Pose) => (typeof p === "string" ? POSE[p] : p);
  let cur = get(keys[0][1]);
  for (let i = 1; i < keys.length; i++) {
    if (t < keys[i][0]) break;
    cur = lerpPose(cur, get(keys[i][1]), ramp(t, keys[i][0], keys[i][0] + blend));
  }
  return cur;
};
export const cycle = (a: PoseName, b: PoseName, t: number, speed = 3): Pose => lerpPose(POSE[a], POSE[b], (Math.sin(t * speed * Math.PI) + 1) / 2);

// keyframed position: [[time, x, y], ...]
export const moveAt = (keys: number[][], t: number, dur = 0.6) => {
  let cur = keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) {
    const [ta, ...v] = keys[i];
    if (t < ta) break;
    const k = ramp(t, ta, ta + (keys[i][3] ?? dur));
    cur = cur.map((c, j) => c + (v[j] - c) * k);
  }
  return { x: cur[0], y: cur[1] };
};

export type Face = "normal" | "happy" | "shock" | "focus" | "smile" | "angry" | "sad" | "wink" | "tired" | "closed";
export type Look = { outfit?: string; outfit2?: string; hat?: "cap" | "scarf" | "hair" | "bald" | "none"; hatColor?: string; glasses?: boolean; mustache?: boolean; coat?: boolean; stripes?: boolean; gloves?: string };

export const HERO: Look = { outfit: K2.hoodie, outfit2: K2.hoodie2, hat: "none" };
export const KID: Look = { outfit: K2.yellow, outfit2: "#C9A031" };
export const UNCLE: Look = { outfit: "#7C8796", outfit2: "#5B6573", mustache: true, hat: "cap", hatColor: "#4A3B2E" };
export const MOM: Look = { outfit: "#C0567B", outfit2: "#8E3B5B", hat: "scarf", hatColor: "#E58FA9" };
export const DOC: Look = { outfit: "#EEF2F3", outfit2: "#C9D1D4", glasses: true, coat: true };
export const RIVAL: Look = { outfit: K2.red, outfit2: "#B23A3F" };
export const REF: Look = { outfit: "#EDEDED", outfit2: "#222", stripes: true };
export const COACH: Look = { outfit: "#3B6FD6", outfit2: "#2A4FA0", hat: "cap", hatColor: "#1C2F5E" };

const pt = (x: number, y: number, a: number, len: number, dir: number) => {
  const r = (a * Math.PI) / 180;
  return [x + Math.sin(r) * len * dir, y + Math.cos(r) * len] as const;
};

export const Stick: React.FC<{
  x: number; y: number; s?: number; pose: Pose; dir?: 1 | -1; face?: Face; look?: Look; rot?: number;
  holdR?: React.ReactNode; holdL?: React.ReactNode; rim?: string; blink?: number;
}> = ({ x, y, s = 1, pose, dir = 1, face = "normal", look = HERO, rot = 0, holdR, holdL, rim = K2.rim, blink = 0 }) => {
  const p = pose;
  const hip = [0, -112 + p.hy] as const;
  const neck = pt(hip[0], hip[1], 180 + p.lean, 86, dir);
  const head = pt(neck[0], neck[1], 180 + p.lean + p.head, 50, dir);
  const sh = pt(neck[0], neck[1], p.lean, 10, dir);
  const limb = (o: readonly [number, number], a1: number, a2: number, l1: number, l2: number) => {
    const m = pt(o[0], o[1], a1, l1, dir);
    const e = pt(m[0], m[1], a2, l2, dir);
    return { m, e };
  };
  const la = limb(sh, p.la1, p.la2, 50, 48);
  const ra = limb(sh, p.ra1, p.ra2, 50, 48);
  const ll = limb(hip, p.ll1, p.ll2, 58, 56);
  const rl = limb(hip, p.rl1, p.rl2, 58, 56);
  const o = look.outfit ?? K2.hoodie;
  const o2 = look.outfit2 ?? o;
  const line = (pts: (readonly [number, number])[], c: string, w: number) => (
    <polyline points={pts.map((q) => q.join(",")).join(" ")} fill="none" stroke={c} strokeWidth={w} strokeLinecap="round" strokeLinejoin="round" />
  );
  const hx = head[0], hy = head[1];
  const ex = 11 * dir;
  const closed = blink > 0;
  const eyes = () => {
    const f = closed ? "closed" : face;
    const E = (cx: number) => {
      if (f === "happy" || f === "closed" || f === "tired")
        return <path d={f === "happy" ? `M${cx - 7},${hy - 2} q7,-9 14,0` : `M${cx - 7},${hy - 3} h14`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />;
      if (f === "shock") return <ellipse cx={cx} cy={hy - 4} rx={7} ry={10} fill="#fff" />;
      if (f === "focus" || f === "angry") return <ellipse cx={cx} cy={hy - 2} rx={6} ry={4} fill="#fff" />;
      if (f === "wink" && cx > hx) return <path d={`M${cx - 6},${hy - 3} h12`} stroke="#fff" strokeWidth={4} strokeLinecap="round" />;
      return <ellipse cx={cx} cy={hy - 4} rx={5.5} ry={8} fill="#fff" />;
    };
    return (
      <g>
        {E(hx + ex - 9 * dir)}
        {E(hx + ex + 9 * dir)}
        {(f === "angry" || f === "focus") && (
          <path d={`M${hx + ex - 18 * dir},${hy - 16} L${hx + ex - 3 * dir},${hy - 11} M${hx + ex + 3 * dir},${hy - 11} L${hx + ex + 18 * dir},${hy - 16}`} stroke="#fff" strokeWidth={3.5} strokeLinecap="round" />
        )}
        {f === "sad" && <path d={`M${hx + ex - 16 * dir},${hy - 12} L${hx + ex - 4 * dir},${hy - 16} M${hx + ex + 4 * dir},${hy - 16} L${hx + ex + 16 * dir},${hy - 12}`} stroke="#fff" strokeWidth={3} strokeLinecap="round" />}
        {(f === "smile" || f === "happy") && <path d={`M${hx + ex - 9},${hy + 12} q9,9 18,0`} stroke="#fff" strokeWidth={3.5} fill="none" strokeLinecap="round" />}
        {f === "shock" && <ellipse cx={hx + ex} cy={hy + 17} rx={6} ry={8} fill="#fff" />}
        {f === "sad" && <path d={`M${hx + ex - 8},${hy + 18} q8,-7 16,0`} stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" />}
        {f === "angry" && <path d={`M${hx + ex - 9},${hy + 16} h18`} stroke="#fff" strokeWidth={3.5} strokeLinecap="round" />}
        {f === "tired" && <path d={`M${hx + ex - 7},${hy + 15} q7,-4 14,0`} stroke="#fff" strokeWidth={3} fill="none" strokeLinecap="round" />}
      </g>
    );
  };
  return (
    <g transform={`translate(${x},${y}) rotate(${rot},0,${-112 * s * 1.3}) scale(${s * 1.3})`} style={{ filter: `drop-shadow(0 0 5px ${rim}88)` }}>
      {/* back limbs */}
      {line([hip, ll.m, ll.e], K2.ink, 13)}
      {line([sh, la.m], o2, 20)}
      {line([la.m, la.e], K2.ink, 12)}
      {/* torso (hoodie) */}
      {line([hip, neck], o, 56)}
      {look.coat && line([hip, pt(hip[0], hip[1], 180 + p.lean, 60, dir)], o2, 6)}
      {look.stripes && [0.2, 0.45, 0.7].map((k, i) => {
        const a = [hip[0] + (neck[0] - hip[0]) * k, hip[1] + (neck[1] - hip[1]) * k];
        return <line key={i} x1={a[0] - 24} y1={a[1]} x2={a[0] + 24} y2={a[1]} stroke="#222" strokeWidth={7} />;
      })}
      {line([hip, rl.m, rl.e], K2.ink, 13)}
      {/* head */}
      <circle cx={hx} cy={hy} r={46} fill={K2.ink} />
      <path d={`M${hx - 30 * dir},${hy - 26} A46,46 0 0 ${dir > 0 ? 0 : 1} ${hx - 30 * dir},${hy + 26}`} stroke={rim} strokeWidth={3} fill="none" opacity={0.85} />
      {look.hat === "cap" && <path d={`M${hx - 40},${hy - 8} A40,40 0 0 1 ${hx + 40},${hy - 8} Z M${hx + 10 * dir},${hy - 12} h${46 * dir} v8 h${-46 * dir}Z`} fill={look.hatColor} />}
      {look.hat === "scarf" && <path d={`M${hx - 48},${hy + 30} C${hx - 58},${hy - 60} ${hx + 58},${hy - 60} ${hx + 48},${hy + 30} L${hx + 36},${hy + 22} C${hx + 40},${hy - 40} ${hx - 40},${hy - 40} ${hx - 36},${hy + 22}Z`} fill={look.hatColor} />}
      {look.hat === "hair" && <path d={`M${hx - 40},${hy - 4} C${hx - 44},${hy - 54} ${hx + 44},${hy - 54} ${hx + 40},${hy - 4} C${hx + 20},${hy - 30} ${hx - 20},${hy - 30} ${hx - 40},${hy - 4}Z`} fill={look.hatColor ?? "#2B1D14"} />}
      {eyes()}
      {look.glasses && <g stroke="#fff" strokeWidth={3} fill="none"><circle cx={hx + ex - 10 * dir} cy={hy - 4} r={11} /><circle cx={hx + ex + 12 * dir} cy={hy - 4} r={11} /></g>}
      {look.mustache && <path d={`M${hx + ex - 14},${hy + 10} q7,8 14,0 q7,8 14,0`} stroke="#fff" strokeWidth={4} fill="none" strokeLinecap="round" />}
      {/* front arm */}
      {line([sh, ra.m], o, 20)}
      {line([ra.m, ra.e], K2.ink, 12)}
      {look.gloves && <><circle cx={ra.e[0]} cy={ra.e[1]} r={14} fill={look.gloves} /><circle cx={la.e[0]} cy={la.e[1]} r={14} fill={look.gloves} /></>}
      {holdR && <g transform={`translate(${ra.e[0]},${ra.e[1]})`}>{holdR}</g>}
      {holdL && <g transform={`translate(${la.e[0]},${la.e[1]})`}>{holdL}</g>}
    </g>
  );
};

// ───────── stage, camera, text ─────────
export const Cam: React.FC<{ t: number; from: number; z?: [number, number]; cx?: number; cy?: number; dur?: number; children: React.ReactNode; shake?: number }> = ({ t, from, z = [1, 1.06], cx = 960, cy = 540, dur = 6, children, shake = 0 }) => {
  const k = interpolate(t, [from, from + dur], z, { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing: ease });
  const sx = shake ? Math.sin(t * 60) * shake : 0;
  return <g transform={`translate(${cx + sx},${cy}) scale(${k}) translate(${-cx},${-cy})`}>{children}</g>;
};

export const Frame: React.FC<{ children: React.ReactNode; t?: number; from?: number }> = ({ children, t = 0, from = 0 }) => (
  <svg viewBox="0 0 1920 1080" width="100%" height="100%" style={{ position: "absolute", inset: 0, opacity: ramp(t, from - 0.01, from + 0.25) }}>
    <defs>
      <linearGradient id="k2sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor={K2.sky1} />
        <stop offset="0.75" stopColor={K2.sky2} />
        <stop offset="1" stopColor={K2.glow} />
      </linearGradient>
      <radialGradient id="k2vig" cx="0.5" cy="0.5" r="0.75">
        <stop offset="0.6" stopColor="#000" stopOpacity="0" />
        <stop offset="1" stopColor="#000" stopOpacity="0.55" />
      </radialGradient>
      <radialGradient id="k2lamp" cx="0.5" cy="0" r="1">
        <stop offset="0" stopColor={K2.warm} stopOpacity="0.55" />
        <stop offset="1" stopColor={K2.warm} stopOpacity="0" />
      </radialGradient>
    </defs>
    {children}
    <rect width="1920" height="1080" fill="url(#k2vig)" pointerEvents="none" />
  </svg>
);

export const Sky: React.FC<{ stars?: boolean; moon?: boolean }> = ({ stars = true, moon = true }) => (
  <g>
    <rect width="1920" height="1080" fill="url(#k2sky)" />
    {stars && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 397) % 1920} cy={(i * 131) % 520} r={i % 3 ? 1.5 : 2.5} fill="#fff" opacity={0.5} />)}
    {moon && <circle cx={1560} cy={170} r={56} fill="#F4EFD9" opacity={0.9} />}
  </g>
);

// Istanbul silhouette: mosques with minarets, Galata tower, houses with warm windows.
export const Skyline: React.FC<{ y?: number; color?: string; lights?: boolean; s?: number }> = ({ y = 760, color = "#0A1A28", lights = true, s = 1 }) => {
  const mosque = (x: number, w: number) => (
    <g key={x}>
      <rect x={x - w / 2} y={y - w * 0.35} width={w} height={w * 0.35} fill={color} />
      <path d={`M${x - w * 0.32},${y - w * 0.35} A${w * 0.32},${w * 0.3} 0 0 1 ${x + w * 0.32},${y - w * 0.35}Z`} fill={color} />
      {[-0.42, -0.25, 0.25, 0.42].map((k, i) => <path key={i} d={`M${x + w * k - 5},${y} v${-w * 0.78} l5,-28 l5,28 v${w * 0.78}Z`} fill={color} />)}
      <path d={`M${x - w * 0.22},${y - w * 0.35} A${w * 0.12},${w * 0.1} 0 0 1 ${x},${y - w * 0.35} A${w * 0.12},${w * 0.1} 0 0 1 ${x + w * 0.22},${y - w * 0.35}`} fill={color} />
    </g>
  );
  return (
    <g transform={`translate(960,${y}) scale(${s}) translate(-960,${-y})`}>
      {Array.from({ length: 26 }, (_, i) => {
        const x = i * 78, h = 60 + ((i * 53) % 90);
        return (
          <g key={i}>
            <rect x={x} y={y - h} width={70} height={h} fill={color} />
            {lights && [0, 1].map((r) => <rect key={r} x={x + 14 + r * 26} y={y - h + 18} width={12} height={16} fill={K2.warm} opacity={(i + r) % 3 ? 0.75 : 0.15} />)}
          </g>
        );
      })}
      {mosque(420, 260)}
      {mosque(1380, 320)}
      <path d={`M${930},${y} v-230 l-14,-8 l30,-60 l30,60 l-14,8 v230Z`} fill={color} />
      <rect x={0} y={y} width={1920} height={1080 - y} fill={color} />
    </g>
  );
};

export const Ground: React.FC<{ y?: number; color?: string }> = ({ y = 860, color = K2.ground }) => (
  <g>
    <rect x={0} y={y} width={1920} height={1080 - y} fill={color} />
    <rect x={0} y={y} width={1920} height={4} fill={K2.rim} opacity={0.25} />
  </g>
);

export const Room: React.FC<{ wall?: string; floor?: string; window?: boolean; lamp?: number }> = ({ wall = "#1A2A3E", floor = "#101B28", window = true, lamp }) => (
  <g>
    <rect width="1920" height="1080" fill={wall} />
    {window && (
      <g>
        <rect x={1260} y={170} width={420} height={330} fill={K2.sky2} stroke="#0B1420" strokeWidth={16} />
        <g transform="translate(1260,170) scale(0.22)"><Skyline y={1500} /></g>
        <line x1={1470} y1={170} x2={1470} y2={500} stroke="#0B1420" strokeWidth={10} />
      </g>
    )}
    <rect x={0} y={860} width={1920} height={220} fill={floor} />
    {lamp !== undefined && <ellipse cx={lamp} cy={400} rx={420} ry={520} fill="url(#k2lamp)" />}
  </g>
);

// big bold pop-in text with glow
export const Big: React.FC<{ t: number; at: number; text: string; x?: number; y?: number; size?: number; color?: string; until?: number; sub?: string }> = ({ t, at, text, x = 960, y = 210, size = 120, color = K2.text, until = 1e9, sub }) => {
  const k = ramp(t, at, at + 0.25) * (1 - ramp(t, until, until + 0.25));
  if (k <= 0) return null;
  const sc = 0.7 + 0.3 * k + 0.08 * Math.max(0, 1 - Math.abs(t - at - 0.25) * 4);
  return (
    <g opacity={k} transform={`translate(${x},${y}) scale(${sc})`}>
      <text textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={size} fill={color} style={{ filter: `drop-shadow(0 0 14px ${color}99)` }}>{text}</text>
      {sub && <text y={size * 0.6} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={size * 0.32} fill={K2.text} opacity={0.85}>{sub}</text>}
    </g>
  );
};

// slow-motion overlay: cool tint + time stamp
export const SlowMo: React.FC<{ t: number; at: number; until: number; label?: string }> = ({ t, at, until, label = "×10" }) => {
  const k = ramp(t, at, at + 0.3) * (1 - ramp(t, until, until + 0.3));
  if (k <= 0) return null;
  return (
    <g opacity={k}>
      <rect width="1920" height="1080" fill={K2.rim} opacity={0.07} />
      <rect x={40} y={40} width={1840} height={1000} fill="none" stroke={K2.rim} strokeWidth={3} strokeDasharray="40 20" opacity={0.5} />
      <text x={90} y={120} fontFamily={FONT} fontWeight={700} fontSize={54} fill={K2.rim}>{label}</text>
      <circle cx={1830} cy={100} r={14} fill={K2.red} opacity={Math.floor(t * 2) % 2 ? 1 : 0.3} />
    </g>
  );
};

// ───────── props ─────────
export const Simit: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <circle r={30} fill="none" stroke="#B9732F" strokeWidth={18} />
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={Math.cos(i) * 30} cy={Math.sin(i * 1.7) * 30 * 0.9} r={2} fill="#F7E7C0" />)}
  </g>
);
export const Gull: React.FC<{ x: number; y: number; s?: number; flap?: number; dive?: boolean }> = ({ x, y, s = 1, flap = 0, dive }) => {
  const w = Math.sin(flap) * 24;
  return (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${dive ? 25 : 0})`}>
      <path d={`M-70,${-w} Q-35,-20 0,0 Q35,-20 70,${-w}`} stroke="#F2F4F5" strokeWidth={10} fill="none" strokeLinecap="round" />
      <ellipse cx={0} cy={6} rx={30} ry={14} fill="#F2F4F5" />
      <path d="M28,4 l22,6 l-22,4Z" fill={K2.yellow} />
      <circle cx={20} cy={0} r={3} fill={K2.ink} />
    </g>
  );
};
export const Cay: React.FC<{ s?: number; tilt?: number; spill?: number }> = ({ s = 1, tilt = 0 }) => (
  <g transform={`scale(${s}) rotate(${tilt})`}>
    <path d="M-16,-50 C-26,-30 -8,-20 -14,0 L14,0 C8,-20 26,-30 16,-50Z" fill="#C2410C" opacity={0.85} stroke="#F7E7C0" strokeWidth={3} />
    <ellipse cx={0} cy={6} rx={26} ry={6} fill="#E5E7EB" />
  </g>
);
export const Ball: React.FC<{ x: number; y: number; r?: number; kind?: "foot" | "ping" | "volley"; spin?: number }> = ({ x, y, r = 22, kind = "foot", spin = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${spin})`}>
    <circle r={r} fill={kind === "ping" ? "#FFF6E0" : kind === "volley" ? K2.yellow : "#F4F4F4"} stroke={K2.ink} strokeWidth={kind === "ping" ? 0 : 3} />
    {kind === "foot" && <path d={`M0,${-r * 0.45} l${r * 0.43},${r * 0.31} l${-r * 0.16},${r * 0.5} h${-r * 0.54} l${-r * 0.16},${-r * 0.5}Z`} fill={K2.ink} />}
    {kind === "volley" && <path d={`M${-r},0 Q0,${-r * 0.6} ${r},0 M0,${-r} Q${-r * 0.5},0 0,${r}`} stroke="#2563EB" strokeWidth={4} fill="none" />}
  </g>
);
export const Trail: React.FC<{ pts: [number, number][]; color?: string; k?: number }> = ({ pts, color = K2.rim, k = 1 }) => (
  <polyline points={pts.slice(0, Math.max(2, Math.round(pts.length * k))).map((p) => p.join(",")).join(" ")} fill="none" stroke={color} strokeWidth={6} strokeDasharray="4 14" strokeLinecap="round" opacity={0.8} />
);
// point along a straight path
export const along = (a: [number, number], b: [number, number], k: number, arc = 0): [number, number] => [a[0] + (b[0] - a[0]) * k, a[1] + (b[1] - a[1]) * k - Math.sin(k * Math.PI) * arc];

export const Phone: React.FC<{ s?: number; screen?: string }> = ({ s = 1, screen = K2.rim }) => (
  <g transform={`scale(${s})`}><rect x={-16} y={-30} width={32} height={60} rx={6} fill={K2.ink} stroke="#9CA3AF" strokeWidth={3} /><rect x={-11} y={-23} width={22} height={44} rx={2} fill={screen} opacity={0.7} /></g>
);
export const Pot: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-30,-20 L30,-20 L22,30 L-22,30Z" fill="#C2410C" />
    <rect x={-34} y={-28} width={68} height={12} rx={3} fill="#9A3412" />
    <path d="M0,-28 C-10,-60 -30,-70 -36,-80 M0,-28 C6,-60 20,-74 34,-84 M0,-28 C0,-60 4,-80 2,-96" stroke="#22C55E" strokeWidth={6} fill="none" />
    <circle cx={2} cy={-100} r={12} fill={K2.red} />
  </g>
);
export const Ruler: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-22} y={-200} width={44} height={400} rx={4} fill={K2.yellow} />
    {Array.from({ length: 30 }, (_, i) => <line key={i} x1={-22} y1={-190 + i * 13} x2={i % 5 ? -10 : 2} y2={-190 + i * 13} stroke={K2.ink} strokeWidth={2} />)}
  </g>
);
export const Fly: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={-6} cy={-26} rx={26} ry={12} fill="#CFE9F2" opacity={0.6} transform={`rotate(${-20 + Math.sin(t * 90) * 25},-6,-10)`} />
    <ellipse cx={10} cy={-26} rx={26} ry={12} fill="#CFE9F2" opacity={0.6} transform={`rotate(${20 - Math.sin(t * 90) * 25},10,-10)`} />
    <ellipse cx={0} cy={0} rx={34} ry={20} fill="#1F2937" />
    <circle cx={30} cy={-4} r={16} fill="#111827" />
    <circle cx={36} cy={-8} r={9} fill="#B91C1C" />
  </g>
);
export const TrafficLight: React.FC<{ x: number; y: number; on: "red" | "green" }> = ({ x, y, on }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-6} y={0} width={12} height={300} fill="#1F2937" />
    <rect x={-34} y={-150} width={68} height={160} rx={12} fill="#111827" />
    <circle cx={0} cy={-110} r={22} fill={on === "red" ? K2.red : "#3B1517"} style={on === "red" ? { filter: `drop-shadow(0 0 16px ${K2.red})` } : undefined} />
    <circle cx={0} cy={-50} r={22} fill={on === "green" ? "#22C55E" : "#123321"} />
  </g>
);
export const Moto: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cx={-70} cy={-40} r={40} fill="none" stroke="#0B0F16" strokeWidth={14} />
    <circle cx={80} cy={-40} r={40} fill="none" stroke="#0B0F16" strokeWidth={14} />
    <path d="M-70,-40 L-10,-100 L60,-100 L80,-40 M-10,-100 L20,-60" stroke={K2.red} strokeWidth={18} fill="none" strokeLinejoin="round" />
    <ellipse cx={95} cy={-100} rx={16} ry={10} fill={K2.yellow} style={{ filter: `drop-shadow(0 0 20px ${K2.yellow})` }} />
    <g transform="translate(-10,-110)"><circle r={30} fill="#111" /><rect x={-24} y={-6} width={36} height={12} fill={K2.rim} opacity={0.6} /></g>
  </g>
);
export const Car: React.FC<{ x: number; y: number; s?: number; color?: string; brake?: boolean; flip?: boolean }> = ({ x, y, s = 1, color = "#3B82F6", brake, flip }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    <path d="M-150,-30 L-140,-80 L-70,-90 L-30,-140 L70,-140 L110,-90 L150,-80 L155,-30Z" fill={color} />
    <path d="M-20,-130 L60,-130 L95,-92 L-55,-92Z" fill="#9FD8E6" opacity={0.6} />
    <circle cx={-90} cy={-30} r={32} fill="#0B0F16" /><circle cx={95} cy={-30} r={32} fill="#0B0F16" />
    <rect x={-156} y={-80} width={14} height={20} fill={brake ? K2.red : "#7F1D1D"} style={brake ? { filter: `drop-shadow(0 0 18px ${K2.red})` } : undefined} />
    <rect x={146} y={-78} width={12} height={16} fill={K2.yellow} />
  </g>
);
export const Monitor: React.FC<{ x: number; y: number; t: number; mode?: "aim" | "chat" }> = ({ x, y, t, mode = "aim" }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-260} y={-300} width={520} height={310} rx={10} fill="#05080D" stroke="#334155" strokeWidth={8} />
    <rect x={-248} y={-288} width={496} height={286} fill="#0F2A3A" />
    <rect x={-20} y={10} width={40} height={60} fill="#334155" /><rect x={-90} y={66} width={180} height={12} rx={6} fill="#334155" />
    {mode === "aim" && (
      <g>
        <rect x={-248} y={-110} width={496} height={108} fill="#173E52" />
        <g transform={`translate(${-60 + Math.sin(t * 2) * 30},-150)`}><circle r={30} fill="none" stroke={K2.red} strokeWidth={4} /><path d="M-44,0 h28 M16,0 h28 M0,-44 v28 M0,16 v28" stroke={K2.red} strokeWidth={4} /></g>
        <g transform="translate(120,-120)"><circle cx={0} cy={-40} r={16} fill={K2.ink} /><rect x={-10} y={-24} width={20} height={44} fill={K2.ink} /></g>
      </g>
    )}
  </g>
);
export const Chat: React.FC<{ t: number; at: number; lines: string[]; x?: number; y?: number }> = ({ t, at, lines, x = 1240, y = 300 }) => (
  <g>
    {lines.map((l, i) => {
      const k = ramp(t, at + i * 0.45, at + i * 0.45 + 0.2);
      return k > 0 ? (
        <g key={i} opacity={k} transform={`translate(${x},${y + i * 92}) scale(${0.8 + 0.2 * k})`}>
          <rect x={0} y={-50} width={l.length * 30 + 60} height={74} rx={18} fill={i % 2 ? "#3B1D2A" : "#2A1620"} stroke={K2.red} strokeWidth={3} />
          <text x={30} y={0} fontFamily={FONT} fontWeight={700} fontSize={42} fill={K2.red}>{l}</text>
        </g>
      ) : null;
    })}
  </g>
);
export const PingTable: React.FC<{ y?: number }> = ({ y = 760 }) => (
  <g>
    <path d={`M360,${y} L1560,${y} L1500,${y + 40} L420,${y + 40}Z`} fill="#1D5E4E" />
    <rect x={360} y={y - 6} width={1200} height={12} fill="#2A8C73" />
    <line x1={960} y1={y - 70} x2={960} y2={y} stroke="#E5E7EB" strokeWidth={6} />
    <rect x={956} y={y - 70} width={8} height={70} fill="#E5E7EB" opacity={0.4} />
    <rect x={430} y={y + 40} width={14} height={160} fill="#0B1420" /><rect x={1476} y={y + 40} width={14} height={160} fill="#0B1420" />
  </g>
);
export const Paddle: React.FC<{ color?: string }> = ({ color = K2.red }) => (
  <g><circle cx={0} cy={-34} r={30} fill={color} /><rect x={-7} y={-8} width={14} height={34} rx={4} fill="#8B5A2B" /></g>
);
export const Score: React.FC<{ x?: number; y?: number; a: string; b: string; t: number; at?: number }> = ({ x = 960, y = 230, a, b, t, at = 0 }) => {
  const k = ramp(t, at, at + 0.3);
  return (
    <g transform={`translate(${x},${y}) scale(${0.8 + 0.2 * k})`} opacity={k}>
      <rect x={-210} y={-110} width={420} height={170} rx={16} fill="#0B1220" stroke={K2.rim} strokeWidth={4} />
      {[a, b].map((v, i) => <text key={i} x={i ? 105 : -105} y={20} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={110} fill={i ? K2.text : K2.rim}>{v}</text>)}
      <text x={0} y={10} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={80} fill={K2.text}>:</text>
    </g>
  );
};
export const Net: React.FC<{ x?: number; top?: number; bottom?: number }> = ({ x = 960, top = 420, bottom = 860 }) => (
  <g>
    <rect x={x - 6} y={top - 30} width={12} height={bottom - top + 30} fill="#CBD5E1" />
    <rect x={x - 70} y={top} width={140} height={120} fill="none" stroke="#E2E8F0" strokeWidth={3} opacity={0.6} />
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={x - 70 + i * 28} y1={top} x2={x - 70 + i * 28} y2={top + 120} stroke="#E2E8F0" strokeWidth={2} opacity={0.5} />)}
    <rect x={x - 74} y={top - 6} width={148} height={10} fill="#F8FAFC" />
  </g>
);
export const Ring: React.FC = () => (
  <g>
    <rect x={0} y={0} width={1920} height={1080} fill="#121826" />
    <ellipse cx={960} cy={0} rx={700} ry={900} fill="url(#k2lamp)" />
    <rect x={160} y={860} width={1600} height={60} fill="#1E3A5F" />
    {[560, 640, 720].map((y, i) => <line key={i} x1={160} y1={y} x2={1760} y2={y} stroke={[K2.red, "#F8FAFC", "#3B82F6"][i]} strokeWidth={8} />)}
    <rect x={150} y={520} width={24} height={360} fill="#CBD5E1" /><rect x={1746} y={520} width={24} height={360} fill="#CBD5E1" />
  </g>
);
export const Goal: React.FC<{ x?: number; y?: number; s?: number }> = ({ x = 960, y = 880, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {Array.from({ length: 21 }, (_, i) => <line key={i} x1={-500 + i * 50} y1={-380} x2={-470 + i * 47} y2={-20} stroke="#E2E8F0" strokeWidth={2} opacity={0.35} />)}
    {Array.from({ length: 8 }, (_, i) => <line key={i} x1={-500} y1={-380 + i * 50} x2={500} y2={-380 + i * 50} stroke="#E2E8F0" strokeWidth={2} opacity={0.3} />)}
    <path d="M-510,0 V-390 H510 V0" stroke="#F8FAFC" strokeWidth={22} fill="none" />
  </g>
);
export const Stadium: React.FC<{ t: number; lights?: boolean; crowd?: number }> = ({ t, lights = true, crowd = 0 }) => (
  <g>
    <rect width="1920" height="1080" fill="#0A1322" />
    <path d="M0,420 Q960,260 1920,420 V620 H0Z" fill="#0F1D30" />
    {Array.from({ length: 120 }, (_, i) => {
      const x = (i * 16.1) % 1920, row = Math.floor(i / 40);
      const jump = crowd ? Math.abs(Math.sin(t * 8 + i)) * 14 * crowd : 0;
      return <circle key={i} cx={x + row * 8} cy={480 + row * 44 - Math.sin((x / 1920) * Math.PI) * 120 - jump} r={12} fill="#16253A" />;
    })}
    {lights && [260, 1660].map((x, i) => (
      <g key={i}>
        <rect x={x - 8} y={120} width={16} height={340} fill="#1E293B" />
        <rect x={x - 70} y={70} width={140} height={60} rx={6} fill="#F8FAFC" style={{ filter: "drop-shadow(0 0 40px #fff)" }} />
      </g>
    ))}
    <rect x={0} y={620} width={1920} height={460} fill="#14532D" />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={0} y={620 + i * 80} width={1920} height={40} fill="#166534" opacity={0.5} />)}
  </g>
);
export const Track: React.FC = () => (
  <g>
    <rect x={0} y={620} width={1920} height={460} fill="#9A3B2E" />
    {Array.from({ length: 6 }, (_, i) => <line key={i} x1={0} y1={640 + i * 76} x2={1920} y2={640 + i * 76} stroke="#F5E6D3" strokeWidth={4} />)}
    <line x1={500} y1={620} x2={500} y2={1080} stroke="#F5E6D3" strokeWidth={8} />
  </g>
);
export const Tram: React.FC<{ x: number; y?: number }> = ({ x, y = 880 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect x={-420} y={-300} width={840} height={270} rx={30} fill="#B91C1C" />
    <rect x={-420} y={-120} width={840} height={30} fill="#F5F5F4" />
    {[-330, -190, -50, 90, 230].map((wx) => <rect key={wx} x={wx} y={-270} width={110} height={110} rx={8} fill={K2.warm} opacity={0.75} />)}
    <rect x={380} y={-270} width={36} height={130} rx={8} fill="#FDE68A" style={{ filter: "drop-shadow(0 0 30px #FDE68A)" }} />
    <line x1={-200} y1={-300} x2={-120} y2={-420} stroke="#111" strokeWidth={6} /><line x1={-120} y1={-420} x2={0} y2={-420} stroke="#111" strokeWidth={6} />
    {[-300, 300].map((wx) => <circle key={wx} cx={wx} cy={-24} r={26} fill="#111" />)}
  </g>
);
export const Rails: React.FC<{ y?: number }> = ({ y = 880 }) => (
  <g>
    <rect x={0} y={y} width={1920} height={1080 - y} fill="#2B3440" />
    <rect x={0} y={y + 14} width={1920} height={8} fill="#94A3B8" />
    <rect x={0} y={y + 70} width={1920} height={8} fill="#94A3B8" />
    {Array.from({ length: 30 }, (_, i) => <rect key={i} x={i * 66} y={y + 8} width={22} height={80} fill="#1E2630" />)}
  </g>
);
export const Ferry: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect x={0} y={700} width={1920} height={380} fill="#0E2A3D" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${((i * 173 + t * 40) % 2100) - 100},${740 + (i % 4) * 40} q30,-10 60,0`} stroke="#3E7D91" strokeWidth={4} fill="none" opacity={0.6} />)}
    <rect x={0} y={790} width={1920} height={290} fill="#3A4A5C" />
    <rect x={0} y={790} width={1920} height={18} fill="#B91C1C" />
    <rect x={0} y={700} width={1920} height={10} fill="#F8FAFC" />
    {Array.from({ length: 25 }, (_, i) => <rect key={i} x={i * 80} y={700} width={8} height={92} fill="#F8FAFC" />)}
  </g>
);
export const Table: React.FC<{ x: number; y: number; w?: number; color?: string }> = ({ x, y, w = 380, color = "#6B4226" }) => (
  <g><rect x={x - w / 2} y={y} width={w} height={22} rx={6} fill={color} /><rect x={x - w / 2 + 20} y={y + 22} width={14} height={140} fill={color} /><rect x={x + w / 2 - 34} y={y + 22} width={14} height={140} fill={color} /></g>
);
export const Brain: React.FC<{ s?: number; glow?: number }> = ({ s = 1, glow = 0 }) => (
  <g transform={`scale(${s})`} style={glow ? { filter: `drop-shadow(0 0 ${20 * glow}px ${K2.rim})` } : undefined}>
    <path d="M-90,10 C-120,-40 -80,-100 -30,-90 C-10,-120 40,-115 60,-85 C110,-90 130,-30 100,10 C120,50 80,90 40,75 C20,100 -30,100 -45,75 C-90,85 -120,45 -90,10Z" fill="#F0A6B8" />
    <path d="M-60,-40 q20,20 0,40 M-10,-70 q-20,30 10,60 q20,20 -5,50 M50,-50 q-20,25 5,50" stroke="#C26D84" strokeWidth={6} fill="none" strokeLinecap="round" />
  </g>
);
export const Eye: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}><path d="M-90,0 Q0,-80 90,0 Q0,80 -90,0Z" fill="#F8FAFC" /><circle r={36} fill="#1E88A8" /><circle r={16} fill={K2.ink} /><circle cx={10} cy={-10} r={6} fill="#fff" /></g>
);
export const Muscle: React.FC<{ s?: number }> = ({ s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M-100,40 L-40,40 C-40,-30 -10,-90 40,-80 C80,-70 90,-30 60,-10 C40,0 20,-10 10,10 L10,40 L90,40 L90,70 L-100,70Z" fill="#F2C28E" stroke="#B9824C" strokeWidth={5} />
  </g>
);
export const Arrow: React.FC<{ x1: number; y1: number; x2: number; y2: number; k?: number; color?: string }> = ({ x1, y1, x2, y2, k = 1, color = K2.text }) => {
  const ex = x1 + (x2 - x1) * k, ey = y1 + (y2 - y1) * k;
  const a = Math.atan2(y2 - y1, x2 - x1);
  return (
    <g opacity={k > 0 ? 1 : 0}>
      <line x1={x1} y1={y1} x2={ex} y2={ey} stroke={color} strokeWidth={8} strokeLinecap="round" />
      <path d={`M${ex},${ey} l${-26 * Math.cos(a - 0.5)},${-26 * Math.sin(a - 0.5)} M${ex},${ey} l${-26 * Math.cos(a + 0.5)},${-26 * Math.sin(a + 0.5)}`} stroke={color} strokeWidth={8} strokeLinecap="round" />
    </g>
  );
};
export const Bar: React.FC<{ x: number; y: number; w: number; k: number; label: string; color: string; value: string }> = ({ x, y, w, k, label, color, value }) => (
  <g>
    <text x={x} y={y - 18} fontFamily={FONT} fontWeight={600} fontSize={40} fill={K2.text}>{label}</text>
    <rect x={x} y={y} width={Math.max(8, w * k)} height={56} rx={10} fill={color} />
    <text x={x + Math.max(8, w * k) + 20} y={y + 42} fontFamily={FONT} fontWeight={700} fontSize={44} fill={color}>{value}</text>
  </g>
);
export const Newspaper: React.FC<{ t: number; at: number; head: string; sub?: string }> = ({ t, at, head, sub }) => {
  const k = ramp(t, at, at + 0.6);
  return (
    <g transform={`translate(960,560) rotate(${(1 - k) * 540 - 4}) scale(${0.2 + 0.8 * k})`}>
      <rect x={-520} y={-340} width={1040} height={680} fill="#F1ECE0" />
      <rect x={-480} y={-300} width={960} height={10} fill="#111" />
      <text x={0} y={-200} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={Math.min(92, 1700 / head.length)} fill="#111">{head}</text>
      {sub && <text x={0} y={-120} textAnchor="middle" fontFamily={FONT} fontWeight={600} fontSize={Math.min(40, 1800 / sub.length)} fill="#444">{sub}</text>}
      <rect x={-480} y={-70} width={440} height={330} fill="#CBD2D9" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={20} y={-60 + i * 36} width={i % 3 === 2 ? 300 : 460} height={14} fill="#9CA3AF" />)}
    </g>
  );
};
export const Lightning: React.FC<{ x: number; y: number; s?: number; color?: string }> = ({ x, y, s = 1, color = K2.yellow }) => (
  <path transform={`translate(${x},${y}) scale(${s})`} d="M0,-40 L-18,4 L0,4 L-10,40 L22,-8 L4,-8 L16,-40Z" fill={color} style={{ filter: `drop-shadow(0 0 10px ${color})` }} />
);
export const Clock: React.FC<{ x: number; y: number; t: number; speed?: number; s?: number }> = ({ x, y, t, speed = 1, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={80} fill="#F8FAFC" stroke="#1E293B" strokeWidth={10} />
    <line x1={0} y1={0} x2={0} y2={-50} stroke={K2.ink} strokeWidth={8} strokeLinecap="round" transform={`rotate(${t * 6 * speed})`} />
    <line x1={0} y1={0} x2={0} y2={-64} stroke={K2.red} strokeWidth={4} strokeLinecap="round" transform={`rotate(${t * 60 * speed})`} />
  </g>
);
export const Bubble: React.FC<{ t: number; at: number; x: number; y: number; text: string; until?: number; w?: number }> = ({ t, at, x, y, text, until = 1e9, w }) => {
  const k = ramp(t, at, at + 0.2) * (1 - ramp(t, until, until + 0.2));
  if (k <= 0) return null;
  const W = w ?? text.length * 24 + 70;
  return (
    <g opacity={k} transform={`translate(${x},${y}) scale(${0.85 + 0.15 * k})`}>
      <rect x={-W / 2} y={-60} width={W} height={84} rx={24} fill="#F8FAFC" />
      <path d="M-20,22 L-40,56 L10,22Z" fill="#F8FAFC" />
      <text y={-4} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={40} fill={K2.ink}>{text}</text>
    </g>
  );
};
export const FilmStrip: React.FC<{ t: number }> = ({ t }) => (
  <g>
    {Array.from({ length: 6 }, (_, i) => {
      const x = 160 + i * 280 - ((t * 60) % 280);
      return (
        <g key={i} transform={`translate(${x},380)`}>
          <rect x={0} y={0} width={260} height={320} fill="#0B0F16" />
          <rect x={20} y={40} width={220} height={240} fill="#1E3A5F" />
          <g transform={`translate(130,250) scale(0.5)`}><circle cx={0} cy={-260 + i * 4} r={40} fill={K2.ink} /><rect x={-20} y={-220 + i * 4} width={40} height={110} fill={K2.hoodie} /></g>
          {Array.from({ length: 6 }, (_, j) => <rect key={j} x={14 + j * 42} y={10} width={20} height={16} fill="#E5E7EB" />)}
          {Array.from({ length: 6 }, (_, j) => <rect key={j} x={14 + j * 42} y={294} width={20} height={16} fill="#E5E7EB" />)}
        </g>
      );
    })}
  </g>
);
export const Lab: React.FC = () => (
  <g>
    <rect width="1920" height="1080" fill="#16232F" />
    <rect x={0} y={860} width={1920} height={220} fill="#0E1822" />
    <rect x={240} y={200} width={560} height={360} rx={12} fill="#0B141C" stroke="#2F4858" strokeWidth={8} />
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={300 + (i % 4) * 140} cy={270 + Math.floor(i / 4) * 110} r={34} fill="#1F3A48" />)}
  </g>
);
export const LightBoard: React.FC<{ t: number; from: number }> = ({ t, from }) => {
  const step = Math.floor((t - from) * 5);
  return (
    <g>
      {Array.from({ length: 12 }, (_, i) => {
        const on = step >= 0 && (step * 7) % 12 === i;
        return <circle key={i} cx={300 + (i % 4) * 140} cy={270 + Math.floor(i / 4) * 110} r={34} fill={on ? K2.rim : "#1F3A48"} style={on ? { filter: `drop-shadow(0 0 18px ${K2.rim})` } : undefined} />;
      })}
    </g>
  );
};

// end card: question + subscribe
export const K2Outro: React.FC<{ t: number; from: number; q: string; subAt: number }> = ({ t, from, q, subAt }) => {
  const k = ramp(t, subAt, subAt + 0.4);
  return (
    <g>
      <Sky moon={false} />
      <Skyline y={900} />
      <Stick x={960} y={880} s={1.3} pose={poseAt([[from, "think"], [subAt, "wave"]], t)} face={t > subAt ? "happy" : "normal"} />
      <text x={960} y={240} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={70} fill={K2.text}>{q}</text>
      <g opacity={k} transform={`translate(960,${400 - 20 * (1 - k)})`}>
        <rect x={-230} y={-55} width={460} height={100} rx={50} fill={K2.red} />
        <text y={14} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={48} fill="#fff">ABONE OL</text>
      </g>
    </g>
  );
};
