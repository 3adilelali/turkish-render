import React from "react";
import { blinkAt } from "./Motion";

// Kanal 6 · "Hayatın" motoru (2026-11-05). Gerçekçi düz illüstrasyon: yumuşak gölgeler, ekran ışığı,
// gerçek arayüzlere benzeyen ama kopya olmayan ekranlar. Hepsi vektör ve frame'e bağlı (deterministik).

export const H = {
  ink: "#0F1115",
  night: "#0B1020",
  wall: "#E9DCC8",
  wall2: "#D8C6AC",
  wood: "#8A5A36",
  wood2: "#6E4528",
  red: "#E5322D",
  red2: "#B7231F",
  green: "#2BB673",
  amber: "#FFB547",
  blue: "#3EA6FF",
  ui: "#0F0F0F",
  ui2: "#212121",
  ui3: "#2E2E2E",
  txt: "#F1F1F1",
  dim: "#AAAAAA",
  skin: "#E2AE86",
  skin2: "#C08560",
  hair: "#2A1C15",
};

export const cl = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
export const ez = (x: number) => { const k = cl(x); return k < 0.5 ? 4 * k * k * k : 1 - Math.pow(-2 * k + 2, 3) / 2; };
export const rp = (t: number, a: number, b: number) => (b - a > 0.001 ? ez((t - a) / (b - a)) : t >= b ? 1 : 0);
export const lp = (a: number, b: number, k: number) => a + (b - a) * k;
const md = (v: number, m: number) => ((v % m) + m) % m;
// sayı biçimi (Türkçe): 1.800 / 400 B / 1 Mn
export const fmt = (n: number) => Math.round(n).toLocaleString("tr-TR");
export const short = (n: number) => (n >= 1e6 ? `${(n / 1e6).toLocaleString("tr-TR", { maximumFractionDigits: 1 })} Mn` : n >= 1e4 ? `${Math.round(n / 1e3)} B` : fmt(n));

// ───────── KAMERA: zoom + kaydırma + elde titreşim + kesim "punch" ─────────
export const HCam: React.FC<{ t: number; a: number; b: number; z?: [number, number]; c0?: [number, number]; c1?: [number, number]; k?: number; punch?: number; children: React.ReactNode }> = ({ t, a, b, z = [1, 1.08], c0 = [960, 540], c1, k = 1, punch = 0.06, children }) => {
  const q = rp(t, a, Math.max(a + 0.5, b));
  const zz = lp(z[0], z[1], q) * (1 + punch * (1 - ez((t - a) / 0.45)));
  const e = c1 ?? c0;
  const cx = lp(c0[0], e[0], q), cy = lp(c0[1], e[1], q);
  const dx = (Math.sin(t * 0.73) * 6 + Math.sin(t * 1.91 + 1.3) * 2.5) * k;
  const dy = (Math.sin(t * 0.61 + 2.1) * 4 + Math.sin(t * 2.33) * 1.5) * k;
  const rot = Math.sin(t * 0.37 + 0.6) * 0.3 * k;
  return <g transform={`translate(960,540) rotate(${rot}) scale(${zz}) translate(${-cx + dx},${-cy + dy})`}>{children}</g>;
};

export const HFrame: React.FC<{ children: React.ReactNode; bg?: string }> = ({ children, bg = H.night }) => (
  <svg width={1920} height={1080} viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>
    <defs>
      <radialGradient id="hVig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.6" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.5" /></radialGradient>
      <linearGradient id="hSkin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#EDBE97" /><stop offset="1" stopColor="#CF946C" /></linearGradient>
      <radialGradient id="hGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#9FD4FF" stopOpacity="0.55" /><stop offset="1" stopColor="#9FD4FF" stopOpacity="0" /></radialGradient>
      <radialGradient id="hLamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFD9A0" stopOpacity="0.6" /><stop offset="1" stopColor="#FFD9A0" stopOpacity="0" /></radialGradient>
      <linearGradient id="hGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF0B3" /><stop offset="0.35" stopColor="#E8B84A" /><stop offset="0.7" stopColor="#B8862A" /><stop offset="1" stopColor="#FFE38A" /></linearGradient>
      <linearGradient id="hShade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.35" /></linearGradient>
    </defs>
    <rect width={1920} height={1080} fill={bg} />
    {children}
    <rect width={1920} height={1080} fill="url(#hVig)" pointerEvents="none" />
  </svg>
);

// ───────── İNSAN (gerçekçi oranlar) ─────────
export type HMouth = "smile" | "flat" | "o" | "open" | "sad" | "grin" | "tight";
export type HBrow = "flat" | "up" | "worry" | "angry";
export type HArms = "desk" | "phone" | "chin" | "head" | "down" | "wave" | "hold" | "type" | "cross";
export type Look = {
  skin?: string; skin2?: string; hair?: string; hairStyle?: "short" | "fade" | "curly" | "bun" | "scarf" | "bald" | "buzz";
  top?: string; top2?: string; kind?: "hoodie" | "tshirt" | "uniform" | "cardigan" | "jacket" | "shirt" | "sweater";
  beard?: number; mustache?: boolean; glasses?: boolean; scarf?: string;
};
export const SEN16: Look = { hairStyle: "short", top: "#3B4A5E", top2: "#2C384A", kind: "hoodie" };
export const SEN20: Look = { hairStyle: "fade", top: "#5B6B3A", top2: "#46532B", kind: "hoodie", beard: 0.4 };
export const SEN23: Look = { hairStyle: "buzz", top: "#4F5A43", top2: "#3B4433", kind: "uniform", beard: 0.2 };
export const SEN26: Look = { hairStyle: "fade", top: "#1F2633", top2: "#161B25", kind: "shirt", beard: 0.9 };
export const ANNE: Look = { hairStyle: "scarf", scarf: "#8E4B6B", top: "#B7895E", top2: "#99704A", kind: "cardigan", skin: "#E4B48E" };
export const BABA: Look = { hairStyle: "short", hair: "#5A5048", top: "#5E6E7E", top2: "#4A5866", kind: "sweater", mustache: true, glasses: true };
export const KUZEN: Look = { hairStyle: "curly", top: "#1E1E1E", top2: "#111", kind: "jacket", beard: 0.7 };
export const EDITOR: Look = { hairStyle: "curly", hair: "#3A2418", top: "#C0582E", top2: "#9E4522", kind: "hoodie" };
export const COCUK: Look = { hairStyle: "short", hair: "#3A2418", top: "#2E7FD8", top2: "#2364AE", kind: "tshirt" };

const MOUTH: Record<HMouth, string> = {
  smile: "M-26,0 Q0,18 26,0",
  grin: "M-30,-2 Q0,30 30,-2 Q0,12 -30,-2Z",
  flat: "M-22,4 L22,4",
  tight: "M-16,4 Q0,1 16,4",
  sad: "M-24,10 Q0,-6 24,10",
  o: "M-10,4 a10,13 0 1,0 20,0 a10,13 0 1,0 -20,0",
  open: "M-22,-2 Q0,34 22,-2 Q0,6 -22,-2Z",
};

// Yüz: (0,0) burun kökü civarı; ölçek s. look: göz bakışı -1..1
export const Face: React.FC<{ t: number; o: Look; mouth?: HMouth; brow?: HBrow; eyes?: "open" | "wide" | "closed" | "half"; look?: number; lookY?: number; talk?: boolean; seed?: number; lit?: number; age?: number }> = ({ t, o, mouth = "flat", brow = "flat", eyes = "open", look = 0, lookY = 0, talk, seed = 0, lit = 0 }) => {
  const skin = o.skin ?? H.skin, skin2 = o.skin2 ?? H.skin2, hair = o.hair ?? H.hair;
  const blink = eyes === "closed" ? 0.06 : blinkAt(t, seed) ? 0.08 : eyes === "half" ? 0.5 : eyes === "wide" ? 1.15 : 1;
  const tk = talk ? Math.abs(Math.sin(t * 11 + seed)) : 0;
  const m = talk && tk > 0.45 ? (mouth === "smile" || mouth === "grin" ? "grin" : "open") : mouth;
  const bAng = brow === "up" ? -10 : brow === "worry" ? 12 : brow === "angry" ? -14 : 0;
  const bY = brow === "up" ? -12 : brow === "worry" ? -4 : brow === "angry" ? 4 : 0;
  const ex = look * 7, ey = lookY * 6;
  return (
    <g>
      {/* kulaklar */}
      {[-1, 1].map((d) => <g key={d}><ellipse cx={d * 92} cy={10} rx={16} ry={30} fill={skin2} /><ellipse cx={d * 92} cy={10} rx={8} ry={18} fill={skin} opacity={0.6} /></g>)}
      {/* kafa */}
      <path d="M-88,-60 Q-92,-150 0,-158 Q92,-150 88,-60 L84,40 Q76,112 0,138 Q-76,112 -84,40Z" fill={skin} />
      <path d="M40,-150 Q92,-140 88,-60 L84,40 Q76,112 0,138 Q50,100 56,20 Q66,-80 40,-150Z" fill={skin2} opacity={0.35} />
      {/* sakal gölgesi */}
      {(o.beard ?? 0) > 0 && <path d="M-80,40 Q-70,112 0,140 Q70,112 80,40 Q60,70 30,62 Q0,56 -30,62 Q-60,70 -80,40Z" fill={hair} opacity={0.18 + 0.5 * (o.beard ?? 0)} />}
      {(o.beard ?? 0) > 0.6 && <path d="M-34,56 Q0,46 34,56 Q30,66 0,62 Q-30,66 -34,56Z" fill={hair} opacity={0.7} />}
      {/* gözler */}
      {[-1, 1].map((d) => (
        <g key={d} transform={`translate(${d * 38},${-14})`}>
          <g transform={`scale(1,${blink})`}>
            <path d="M-22,0 Q0,-16 22,0 Q0,14 -22,0Z" fill="#FBF8F3" />
            <circle cx={ex} cy={ey} r={10} fill="#5A3A22" /><circle cx={ex} cy={ey} r={5.5} fill="#120B07" /><circle cx={ex + 3} cy={ey - 3} r={2.6} fill="#FFF" />
          </g>
          <path d="M-24,-1 Q0,-19 24,-1" stroke="#3A241A" strokeWidth={3.5} fill="none" opacity={blink < 0.2 ? 1 : 0.85} />
          {/* kaş */}
          <g transform={`translate(0,${-28 + bY}) rotate(${d * bAng})`}><path d="M-24,4 Q0,-8 26,2 L24,8 Q0,-1 -22,10Z" fill={hair} /></g>
        </g>
      ))}
      {/* burun */}
      <path d="M2,-10 Q-6,30 -14,40 Q0,50 16,40" stroke={skin2} strokeWidth={4} fill="none" strokeLinecap="round" />
      {/* bıyık */}
      {o.mustache && <path d="M-34,62 Q0,46 34,62 Q16,58 0,60 Q-16,58 -34,62Z" fill={hair} />}
      {/* ağız */}
      <g transform="translate(0,74)"><path d={MOUTH[m]} stroke="#6B2E25" strokeWidth={5} fill={m === "grin" || m === "open" || m === "o" ? "#5B1E18" : "none"} strokeLinecap="round" strokeLinejoin="round" />{m === "grin" && <path d="M-22,2 Q0,10 22,2" stroke="#FFF" strokeWidth={5} fill="none" />}</g>
      {/* gözlük */}
      {o.glasses && <g stroke="#222" strokeWidth={4} fill="#BFE3FF" fillOpacity={0.12}><rect x={-66} y={-34} width={54} height={40} rx={10} /><rect x={12} y={-34} width={54} height={40} rx={10} /><path d="M-12,-16 L12,-16" /></g>}
      {/* saç */}
      <Hair style={o.hairStyle ?? "short"} c={hair} scarf={o.scarf} t={t} />
      {/* ekran ışığı */}
      {lit > 0 && <path d="M-88,-60 Q-92,-150 0,-158 Q92,-150 88,-60 L84,40 Q76,112 0,138 Q-76,112 -84,40Z" fill="#8FC8FF" opacity={0.18 * lit} style={{ mixBlendMode: "screen" }} />}
    </g>
  );
};

const Hair: React.FC<{ style: NonNullable<Look["hairStyle"]>; c: string; scarf?: string; t: number }> = ({ style, c, scarf = "#7A4E6B", t }) => {
  if (style === "bald") return null;
  if (style === "scarf") return (
    <g>
      <path d="M-104,-40 Q-112,-178 0,-182 Q112,-178 104,-40 L110,90 Q90,170 0,176 Q-90,170 -110,90Z M-80,-50 L-78,40 Q-70,110 0,132 Q70,110 78,40 L80,-50 Q76,-128 0,-136 Q-76,-128 -80,-50Z" fill={scarf} fillRule="evenodd" />
      <path d="M-70,-118 Q0,-150 70,-118" stroke="#FFFFFF" strokeOpacity={0.18} strokeWidth={10} fill="none" />
      <path d="M-60,150 Q0,190 60,150 L80,220 Q0,250 -80,220Z" fill={scarf} />
    </g>
  );
  if (style === "bun") return <g><circle cx={0} cy={-176} r={40} fill={c} /><path d="M-90,-50 Q-96,-168 0,-170 Q96,-168 90,-50 Q80,-120 0,-124 Q-80,-120 -90,-50Z" fill={c} /></g>;
  if (style === "buzz") return <path d="M-88,-62 Q-92,-160 0,-164 Q92,-160 88,-62 Q84,-128 0,-134 Q-84,-128 -88,-62Z" fill={c} opacity={0.75} />;
  if (style === "curly") return <g>{Array.from({ length: 11 }, (_, i) => { const a = Math.PI + (i / 10) * Math.PI; return <circle key={i} cx={Math.cos(a) * 82} cy={-70 + Math.sin(a) * 92} r={30} fill={c} />; })}<path d="M-90,-60 Q-90,-150 0,-150 Q90,-150 90,-60 Q60,-110 0,-112 Q-60,-110 -90,-60Z" fill={c} /></g>;
  const fade = style === "fade";
  return (
    <g>
      <path d={`M-92,${fade ? -40 : -20} Q-104,-150 -20,-176 Q60,-196 100,-130 Q108,-90 92,${fade ? -40 : -20} Q86,-96 40,-112 Q0,-96 -50,-110 Q-84,-96 -92,${fade ? -40 : -20}Z`} fill={c} />
      <path d={`M-60,-150 Q-10,${-132 + Math.sin(t * 0.7) * 2} 50,-160`} stroke="#FFFFFF" strokeOpacity={0.12} strokeWidth={8} fill="none" />
      {fade && <path d="M-92,-40 Q-96,0 -88,10 L-84,-40Z M92,-40 Q96,0 88,10 L84,-40Z" fill={c} opacity={0.35} />}
    </g>
  );
};

// Kol: omuzdan ele kalın yuvarlak yol (dirsek bükümlü)
const Arm: React.FC<{ sx: number; sy: number; ex: number; ey: number; hx: number; hy: number; c: string; skin: string; w?: number }> = ({ sx, sy, ex, ey, hx, hy, c, skin, w = 50 }) => (
  <g>
    <path d={`M${sx},${sy} Q${ex},${ey} ${hx},${hy}`} stroke={c} strokeWidth={w} fill="none" strokeLinecap="round" />
    <circle cx={hx} cy={hy} r={w * 0.48} fill={skin} />
  </g>
);

// Oturan/ayakta insan, belden yukarı. (x,y) = bel ortası. s ölçek.
export const Person: React.FC<{ x: number; y: number; s?: number; t: number; o: Look; arms?: HArms; mouth?: HMouth; brow?: HBrow; eyes?: "open" | "wide" | "closed" | "half"; look?: number; lookY?: number; talk?: boolean; seed?: number; lit?: number; dir?: 1 | -1; tilt?: number; hold?: React.ReactNode; slump?: number }> = ({ x, y, s = 1, t, o, arms = "down", mouth, brow, eyes, look = 0, lookY = 0, talk, seed = 0, lit = 0, dir = 1, tilt = 0, hold, slump = 0 }) => {
  const top = o.top ?? "#445", top2 = o.top2 ?? "#334", skin = o.skin ?? H.skin;
  const br = Math.sin(t * 1.6 + seed) * 4;
  const nod = talk ? Math.sin(t * 3.1 + seed) * 2 : 0;
  const sh = -330 + br + slump * 30;
  const L = { x: -128, y: sh + 20 }, R = { x: 128, y: sh + 20 };
  const typing = arms === "type" ? Math.sin(t * 18 + seed) * 6 : 0;
  const armsEl = (() => {
    switch (arms) {
      case "desk": case "type": return <><Arm sx={L.x} sy={L.y} ex={-190} ey={-90} hx={-90 + typing} hy={-30} c={top} skin={skin} /><Arm sx={R.x} sy={R.y} ex={190} ey={-90} hx={90 - typing} hy={-30 + typing * 0.3} c={top} skin={skin} /></>;
      case "phone": return <><Arm sx={L.x} sy={L.y} ex={-170} ey={-60} hx={-40} hy={-150} c={top} skin={skin} /><Arm sx={R.x} sy={R.y} ex={170} ey={-60} hx={40} hy={-150} c={top} skin={skin} /><g transform="translate(0,-200)">{hold ?? <PhoneBack />}</g></>;
      case "chin": return <><Arm sx={L.x} sy={L.y} ex={-200} ey={-100} hx={-90} hy={-30} c={top} skin={skin} /><Arm sx={R.x} sy={R.y} ex={150} ey={-60} hx={40} hy={-330} c={top} skin={skin} /></>;
      case "head": return <><Arm sx={L.x} sy={L.y} ex={-210} ey={-420} hx={-80} hy={-560} c={top} skin={skin} /><Arm sx={R.x} sy={R.y} ex={210} ey={-420} hx={80} hy={-560} c={top} skin={skin} /></>;
      case "wave": return <><Arm sx={L.x} sy={L.y} ex={-170} ey={-140} hx={-150} hy={-10} c={top} skin={skin} /><Arm sx={R.x} sy={R.y} ex={230} ey={-360} hx={200 + Math.sin(t * 9) * 26} hy={-520} c={top} skin={skin} /></>;
      case "hold": return <><Arm sx={L.x} sy={L.y} ex={-190} ey={-100} hx={-70} hy={-130} c={top} skin={skin} /><Arm sx={R.x} sy={R.y} ex={190} ey={-100} hx={70} hy={-130} c={top} skin={skin} />{hold && <g transform="translate(0,-170)">{hold}</g>}</>;
      case "cross": return <><Arm sx={L.x} sy={L.y} ex={-150} ey={-120} hx={90} hy={-170} c={top2} skin={skin} /><Arm sx={R.x} sy={R.y} ex={150} ey={-120} hx={-90} hy={-150} c={top} skin={skin} /></>;
      default: return <><Arm sx={L.x} sy={L.y} ex={-170} ey={-140} hx={-160} hy={10} c={top} skin={skin} /><Arm sx={R.x} sy={R.y} ex={170} ey={-140} hx={160} hy={10} c={top} skin={skin} /></>;
    }
  })();
  const behind = arms === "head" || arms === "wave";
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s}) rotate(${tilt})`}>
      {behind && armsEl}
      {/* gövde */}
      <path d={`M-150,${sh + 40} Q-150,${sh - 10} -90,${sh - 20} L90,${sh - 20} Q150,${sh - 10} 150,${sh + 40} L140,40 L-140,40Z`} fill={top} />
      <path d={`M40,${sh - 20} L90,${sh - 20} Q150,${sh - 10} 150,${sh + 40} L140,40 L70,40Z`} fill={top2} opacity={0.6} />
      {o.kind === "hoodie" && <><path d={`M-80,${sh - 18} Q0,${sh + 50} 80,${sh - 18}`} stroke={top2} strokeWidth={22} fill="none" /><path d={`M-18,${sh + 20} l-4,90 M18,${sh + 20} l4,90`} stroke="#EDEDED" strokeWidth={5} /><rect x={-80} y={-110} width={160} height={70} rx={20} fill={top2} opacity={0.5} /></>}
      {o.kind === "shirt" && <><path d={`M-50,${sh - 20} L0,${sh + 40} L50,${sh - 20}`} fill="#F4F4F4" /><path d={`M0,${sh + 40} L0,40`} stroke={top2} strokeWidth={4} />{[0, 1, 2].map((i) => <circle key={i} cx={0} cy={sh + 80 + i * 70} r={5} fill="#DDD" />)}</>}
      {o.kind === "uniform" && <><path d={`M-50,${sh - 20} L0,${sh + 40} L50,${sh - 20}`} fill={top2} />{[-70, 70].map((xx) => <rect key={xx} x={xx - 40} y={sh + 60} width={80} height={60} rx={6} fill={top2} />)}{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={-130 + ((i * 47) % 260)} cy={sh + 10 + ((i * 73) % 330)} r={9 + (i % 3) * 4} fill={i % 2 ? "#3B4433" : "#6A7556"} opacity={0.45} />)}</>}
      {o.kind === "cardigan" && <><path d={`M-40,${sh - 20} L0,${sh + 40} L40,${sh - 20}`} fill="#EFE6D8" /><path d={`M0,${sh + 40} L0,40`} stroke={top2} strokeWidth={6} /></>}
      {o.kind === "jacket" && <><path d={`M-60,${sh - 20} L-10,${sh + 120} L-10,40 M60,${sh - 20} L10,${sh + 120} L10,40`} stroke="#333" strokeWidth={8} fill="none" /><path d={`M-50,${sh - 20} L0,${sh + 30} L50,${sh - 20}`} fill="#D9D9D9" /></>}
      {o.kind === "sweater" && <path d={`M-60,${sh - 18} Q0,${sh + 30} 60,${sh - 18}`} stroke={top2} strokeWidth={14} fill="none" />}
      {o.kind === "tshirt" && <path d={`M-50,${sh - 18} Q0,${sh + 24} 50,${sh - 18}`} stroke={top2} strokeWidth={10} fill="none" />}
      {/* boyun + kafa */}
      <rect x={-34} y={sh - 70} width={68} height={70} fill={o.skin2 ?? H.skin2} />
      <g transform={`translate(${look * 6},${sh - 200 + nod}) rotate(${look * 3 + tilt * 0.3})`}>
        <Face t={t} o={o} mouth={mouth} brow={brow} eyes={eyes} look={look} lookY={lookY} talk={talk} seed={seed} lit={lit} />
      </g>
      {!behind && armsEl}
    </g>
  );
};

// Arkadan oturan genç (ekrana bakıyor): kafa arkası + kapüşon + sandalye
export const BackView: React.FC<{ x: number; y: number; s?: number; t: number; o: Look; type?: boolean; slump?: number; seed?: number }> = ({ x, y, s = 1, t, o, type, slump = 0, seed = 0 }) => {
  const top = o.top ?? "#445", top2 = o.top2 ?? "#334", hair = o.hair ?? H.hair, skin = o.skin ?? H.skin;
  const br = Math.sin(t * 1.6 + seed) * 4;
  const ty = type ? Math.sin(t * 16) * 4 : 0;
  return (
    <g transform={`translate(${x},${y + slump * 30}) scale(${s})`}>
      {/* sandalye */}
      <rect x={-170} y={-300} width={340} height={340} rx={40} fill="#1E1F24" /><rect x={-150} y={-280} width={300} height={300} rx={30} fill="#2A2C33" />
      {/* omuzlar */}
      <path d={`M-170,40 L-160,${-300 + br} Q-150,${-360 + br} -80,${-372 + br} L80,${-372 + br} Q150,${-360 + br} 160,${-300 + br} L170,40Z`} fill={top} />
      <path d={`M-170,40 L-160,${-300 + br} Q-150,${-360 + br} -80,${-372 + br} L-30,${-372 + br} L-60,40Z`} fill="#000" opacity={0.18} />
      {o.kind === "hoodie" && <path d={`M-100,${-372 + br} Q0,${-300 + br} 100,${-372 + br} Q90,${-250 + br} 0,${-235 + br} Q-90,${-250 + br} -100,${-372 + br}Z`} fill={top2} />}
      {/* kollar öne */}
      <path d={`M-150,${-260 + br} Q-210,-120 -150,-40`} stroke={top} strokeWidth={56} strokeLinecap="round" fill="none" />
      <path d={`M150,${-260 + br} Q210,-120 150,-40`} stroke={top} strokeWidth={56} strokeLinecap="round" fill="none" />
      <circle cx={-130 + ty} cy={-50} r={24} fill={skin} /><circle cx={130 - ty} cy={-52} r={24} fill={skin} />
      {/* boyun ve kafa arkası */}
      <rect x={-34} y={-420 + br} width={68} height={60} fill={o.skin2 ?? H.skin2} />
      {[-1, 1].map((d) => <ellipse key={d} cx={d * 90} cy={-500 + br} rx={15} ry={28} fill={o.skin2 ?? H.skin2} />)}
      <path d={`M-90,${-470 + br} Q-100,${-650 + br} 0,${-656 + br} Q100,${-650 + br} 90,${-470 + br} Q60,${-420 + br} 0,${-416 + br} Q-60,${-420 + br} -90,${-470 + br}Z`} fill={o.hairStyle === "scarf" ? (o.scarf ?? "#7A4E6B") : hair} />
      <path d={`M-40,${-620 + br} Q0,${-640 + br} 50,${-615 + br}`} stroke="#FFF" strokeOpacity={0.12} strokeWidth={10} fill="none" />
    </g>
  );
};

// ───────── NESNELER ─────────
export const PhoneBack: React.FC<{ s?: number; c?: string }> = ({ s = 1, c = "#22252B" }) => (
  <g transform={`scale(${s})`}><rect x={-60} y={-110} width={120} height={220} rx={18} fill={c} /><rect x={-44} y={-96} width={42} height={42} rx={10} fill="#111" /><circle cx={-31} cy={-83} r={9} fill="#334" /><circle cx={-15} cy={-67} r={9} fill="#334" /></g>
);

// Telefon (ön): w=360 h=740 koordinatlarında içerik (children), (x,y) merkez
export const Phone: React.FC<{ x: number; y: number; s?: number; rot?: number; children?: React.ReactNode; light?: boolean }> = ({ x, y, s = 1, rot = 0, children, light }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-196} y={-392} width={392} height={784} rx={56} fill="#0A0A0C" />
    <rect x={-190} y={-386} width={380} height={772} rx={52} fill="#2B2E35" />
    <rect x={-180} y={-370} width={360} height={740} rx={42} fill={light ? "#FFFFFF" : "#0F0F0F"} />
    <svg x={-180} y={-370} width={360} height={740} viewBox="0 0 360 740" overflow="hidden">{children}</svg>
    <rect x={-44} y={-360} width={88} height={22} rx={11} fill="#000" />
    <path d="M-150,-360 L-60,-360 L-170,330 Z" fill="#FFF" opacity={0.04} />
  </g>
);

// Laptop (ön, ekran içeriği 1000x625 koordinatında). old: eski ve kalın çerçeve
export const Laptop: React.FC<{ x: number; y: number; s?: number; old?: boolean; children?: React.ReactNode; on?: number; t?: number }> = ({ x, y, s = 1, old, children, on = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={430} rx={720} ry={40} fill="#000" opacity={0.25} />
    <rect x={-560} y={-360} width={1120} height={740} rx={old ? 30 : 22} fill={old ? "#3C3F45" : "#1A1C20"} />
    <rect x={-500} y={-312} width={1000} height={625} fill="#000" />
    <svg x={-500} y={-312} width={1000} height={625} viewBox="0 0 1000 625" overflow="hidden" opacity={on}>{children}</svg>
    {old && <><circle cx={0} cy={-336} r={6} fill="#111" /><text x={-470} y={360} fontFamily="Poppins" fontWeight={600} fontSize={20} fill="#888">· · ·</text><rect x={300} y={330} width={80} height={24} rx={4} fill="#2C2E33" /><path d="M-560,-200 L-540,-200" stroke="#888" strokeWidth={3} /></>}
    <path d="M-500,-312 L-200,-312 L-500,100Z" fill="#FFF" opacity={0.04} />
    <path d="M-640,380 L640,380 L600,420 L-600,420Z" fill={old ? "#4A4D54" : "#2A2C31"} />
    <rect x={-120} y={380} width={240} height={14} rx={7} fill="#000" opacity={0.3} />
    {old && t > 0 && <g opacity={0.5}>{[0, 1, 2].map((i) => <path key={i} d={`M${600 + i * 18},${300 - md(t * 120 + i * 40, 120)} q10,-10 0,-20`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.6} />)}</g>}
  </g>
);

export const TeaGlass: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={46} ry={10} fill="#C9C9C9" />
    <path d="M-24,-70 Q-34,-40 -20,-20 Q-28,-6 -22,4 L22,4 Q28,-6 20,-20 Q34,-40 24,-70Z" fill="#B1361E" opacity={0.88} />
    <path d="M-24,-70 L24,-70" stroke="#EEE" strokeWidth={3} opacity={0.7} />
    <path d="M-16,-60 Q-22,-40 -14,-24" stroke="#FFF" strokeWidth={4} opacity={0.35} fill="none" />
    {[0, 1].map((i) => <path key={i} d={`M${-6 + i * 12},-80 q-8,-14 0,-28 q8,-14 0,-28`} stroke="#FFF" strokeWidth={4} fill="none" opacity={0.25 + 0.15 * Math.sin(t * 2 + i)} />)}
  </g>
);

export const Mic: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><path d="M0,0 C40,60 -40,120 20,200" stroke="#111" strokeWidth={5} fill="none" /><rect x={-12} y={-40} width={24} height={50} rx={12} fill="#222" /><rect x={-6} y={-36} width={12} height={4} fill="#555" /><rect x={-14} y={6} width={28} height={10} rx={3} fill="#555" /></g>
);

// gerçekçi kâğıt yazı / zarf
export const Paper: React.FC<{ x: number; y: number; s?: number; rot?: number; title: string; lines?: string[]; stamp?: string }> = ({ x, y, s = 1, rot = 0, title, lines = [], stamp }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-300} y={-400} width={600} height={800} fill="#000" opacity={0.25} transform="translate(14,18)" />
    <rect x={-300} y={-400} width={600} height={800} fill="#FBF9F3" />
    <circle cx={0} cy={-310} r={46} fill="none" stroke="#C0392B" strokeWidth={6} /><path d="M-20,-310 a22,22 0 1,0 30,-18 a16,16 0 1,1 -30,18Z" fill="#C0392B" />
    <text y={-220} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={30} fill="#222">T.C. MİLLÎ SAVUNMA BAKANLIĞI</text>
    <text y={-140} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={58} fill="#111">{title}</text>
    {lines.map((l, i) => <text key={i} x={-240} y={-50 + i * 56} fontFamily="Poppins" fontWeight={500} fontSize={30} fill="#333">{l}</text>)}
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-240} y={170 + i * 30} width={480 - (i % 3) * 90} height={8} rx={4} fill="#CFCAC0" />)}
    {stamp && <g transform="translate(150,300) rotate(-14)"><rect x={-130} y={-48} width={260} height={96} rx={8} fill="none" stroke="#B03A2E" strokeWidth={6} /><text y={14} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={38} fill="#B03A2E">{stamp}</text></g>}
  </g>
);

// altın plaket (gerçek logo yok: oynat üçgeni kendi tasarımımız)
export const Plaque: React.FC<{ x: number; y: number; s?: number; t: number; shine?: number }> = ({ x, y, s = 1, t, shine = 1 }) => {
  const sx = -700 + md(t * 500, 1800);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-330} y={-420} width={660} height={840} rx={14} fill="#1B1B1F" />
      <rect x={-300} y={-390} width={600} height={780} rx={8} fill="#0E0E11" stroke="#333" strokeWidth={3} />
      <g>
        <path d="M-170,-210 Q-170,-250 -130,-252 L130,-252 Q170,-250 170,-210 L170,30 Q170,70 130,72 L-130,72 Q-170,70 -170,30Z" fill="url(#hGold)" />
        <path d="M-50,-160 L-50,-20 L70,-90Z" fill="#7A5716" opacity={0.9} />
        <clipPath id="plqClip"><path d="M-170,-210 Q-170,-250 -130,-252 L130,-252 Q170,-250 170,-210 L170,30 Q170,70 130,72 L-130,72 Q-170,70 -170,30Z" /></clipPath>
        <g clipPath="url(#plqClip)"><rect x={sx} y={-300} width={70} height={420} fill="#FFF" opacity={0.5 * shine} transform="skewX(-20)" /></g>
      </g>
      <text y={200} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={40} fill="#D8C08A">1.000.000 ABONE</text>
      <rect x={-120} y={250} width={240} height={4} fill="#5A4A2A" />
    </g>
  );
};

export const Box: React.FC<{ x: number; y: number; s?: number; open?: number }> = ({ x, y, s = 1, open = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={210} rx={360} ry={30} fill="#000" opacity={0.3} />
    <path d="M-320,-60 L320,-60 L320,200 L-320,200Z" fill="#C79A63" />
    <path d="M60,-60 L320,-60 L320,200 L60,200Z" fill="#B0844F" />
    <rect x={-40} y={-60} width={80} height={260} fill="#E6D3A6" opacity={0.6} />
    <g transform={`translate(-320,-60) rotate(${-open * 120})`}><rect x={0} y={-18} width={320} height={18} fill="#D6AD77" /></g>
    <g transform={`translate(320,-60) rotate(${open * 120})`}><rect x={-320} y={-18} width={320} height={18} fill="#BE925C" /></g>
    <g transform="translate(-200,60)"><rect x={-90} y={-40} width={180} height={80} fill="#FFF" /><rect x={-74} y={-24} width={100} height={10} fill="#222" /><rect x={-74} y={-4} width={140} height={6} fill="#999" /><rect x={-74} y={10} width={120} height={6} fill="#999" /></g>
  </g>
);

// ───────── ODALAR ─────────
// Eskişehir'de genç odası (gece, masa lambası). px: paralaks kayması
export const TeenRoom: React.FC<{ t: number; night?: boolean; poster?: string; px?: number; lamp?: number }> = ({ t, night = true, poster = "MC", px = 0, lamp = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#2B2A35" : "#D9CBB6"} />
    {/* duvar kâğıdı çizgileri */}
    {Array.from({ length: 24 }, (_, i) => <rect key={i} x={i * 84 + px * 0.3} y={0} width={2} height={760} fill="#FFF" opacity={0.04} />)}
    {/* pencere: Eskişehir gecesi, tramvay hattı ışıkları */}
    <g transform={`translate(${1340 + px * 0.5},120)`}>
      <rect x={-20} y={-20} width={500} height={460} fill="#E8E2D6" />
      <rect x={0} y={0} width={460} height={420} fill={night ? "#101A33" : "#9BC7E8"} />
      {night && <>{Array.from({ length: 30 }, (_, i) => <rect key={i} x={(i * 53) % 440 + 10} y={200 + ((i * 37) % 180)} width={12} height={16} fill="#FFD27A" opacity={0.3 + 0.5 * ((Math.sin(t * 0.3 + i) + 1) / 2)} />)}<circle cx={360} cy={80} r={34} fill="#F3F0E0" opacity={0.85} /><path d="M0,380 L460,350" stroke="#FFD27A" strokeWidth={3} opacity={0.6} /></>}
      {[0, 1].map((i) => <path key={i} d={`M${i * 460},0 q${i ? -60 : 60},210 0,420`} fill="#8C3B3B" opacity={0.9} />)}
      <rect x={228} y={0} width={6} height={420} fill="#E8E2D6" /><rect x={0} y={208} width={460} height={6} fill="#E8E2D6" />
    </g>
    {/* poster */}
    <g transform={`translate(${380 + px * 0.4},140) rotate(-3)`}>
      <rect x={0} y={0} width={260} height={360} fill={poster === "MC" ? "#3E7B3A" : "#22314F"} />
      {poster === "MC" ? <>{Array.from({ length: 24 }, (_, i) => <rect key={i} x={20 + (i % 6) * 38} y={180 + Math.floor(i / 6) * 38} width={36} height={36} fill={["#6B4A2E", "#7D5A3A", "#5C8F3A", "#8B6B4A"][(i * 7) % 4]} />)}<text x={130} y={110} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={44} fill="#FFF">BLOK</text></> : <text x={130} y={190} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={48} fill="#FFF">ESES</text>}
      <circle cx={130} cy={10} r={8} fill="#C0392B" />
    </g>
    {/* raf + kitaplar (YKS) */}
    <g transform={`translate(${720 + px * 0.4},300)`}>
      <rect x={0} y={120} width={420} height={18} fill={H.wood2} />
      {["#C0392B", "#2E86C1", "#F1C40F", "#27AE60", "#8E44AD", "#E67E22", "#34495E"].map((c, i) => <rect key={i} x={10 + i * 40} y={20 + (i % 3) * 8} width={34} height={100 - (i % 3) * 8} fill={c} />)}
      <text x={290} y={100} fontFamily="Poppins" fontWeight={700} fontSize={26} fill="#E8E2D6" opacity={0.8}>YKS</text>
    </g>
    {/* yatak */}
    <g transform={`translate(${-40 + px * 0.8},700)`}><rect x={0} y={0} width={520} height={260} rx={20} fill="#3B5B8C" /><rect x={20} y={-40} width={180} height={90} rx={30} fill="#EDE6DA" /><path d="M0,60 Q260,20 520,80 L520,260 L0,260Z" fill="#2F4A75" /></g>
    {/* masa */}
    <rect x={560 + px} y={760} width={1400} height={30} fill={H.wood} />
    <rect x={560 + px} y={790} width={1400} height={300} fill={H.wood2} />
    {/* lamba */}
    <g transform={`translate(${1650 + px},760)`}><path d="M0,0 L0,-260 L-120,-330" stroke="#222" strokeWidth={12} fill="none" /><path d="M-190,-360 L-60,-300 L-110,-250 L-220,-300Z" fill="#E5322D" /><ellipse cx={-130} cy={-260} rx={260 * lamp} ry={180 * lamp} fill="url(#hLamp)" /><rect x={-50} y={-10} width={100} height={14} rx={7} fill="#222" /></g>
    <rect width={1920} height={1080} fill={night ? "#0A0F2A" : "#FFF"} opacity={night ? 0.22 : 0} />
  </g>
);

// yurt odası: ranza, metal dolap, flüoresan ışık, oda arkadaşı uyuyor
export const Yurt: React.FC<{ t: number; px?: number }> = ({ t, px = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#C9CED3" />
    <rect y={760} width={1920} height={320} fill="#9AA0A6" />
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 200 + px * 0.6} y={760} width={4} height={320} fill="#000" opacity={0.08} />)}
    <rect x={700 + px * 0.2} y={40} width={520} height={26} rx={10} fill="#F4F7F9" opacity={0.85 + 0.15 * (Math.sin(t * 40) > 0.95 ? -1 : 0)} />
    {/* metal dolaplar */}
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${1340 + i * 180 + px * 0.5},180)`}><rect width={170} height={580} fill="#7E8C99" /><rect x={10} y={10} width={150} height={560} fill="#8D9AA6" /><rect x={120} y={260} width={10} height={60} fill="#333" />{[0, 1, 2].map((j) => <rect key={j} x={30} y={40 + j * 14} width={110} height={5} fill="#5D6A75" />)}</g>)}
    {/* ranza */}
    <g transform={`translate(${80 + px * 0.8},140)`}>
      {[0, 400].map((yy) => <g key={yy}><rect x={0} y={yy + 150} width={620} height={110} rx={10} fill="#3F6E9E" /><rect x={10} y={yy + 120} width={160} height={60} rx={20} fill="#ECECEC" /></g>)}
      {[0, 600].map((xx) => <rect key={xx} x={xx} y={0} width={20} height={800} fill="#55606B" />)}
      <path d="M200,195 Q350,160 560,200" stroke="#2E557D" strokeWidth={40} strokeLinecap="round" fill="none" />
      <circle cx={180} cy={178} r={34} fill="#3A2418" />
      <text x={380} y={-10} fontFamily="Poppins" fontWeight={700} fontSize={26} fill="#555">z z z</text>
    </g>
    <rect x={640 + px} y={760} width={720} height={26} fill="#B98A5A" /><rect x={640 + px} y={786} width={720} height={300} fill="#9C7246" />
  </g>
);

// kafe (gece, sıcak ışık, cam ön, çay)
export const Kafe: React.FC<{ t: number; px?: number }> = ({ t, px = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#3A2A22" />
    {Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${160 + i * 280 + px * 0.4},${150 + Math.sin(t * 1.2 + i) * 4})`}><path d="M0,-200 L0,0" stroke="#111" strokeWidth={3} /><path d="M-40,0 L40,0 L26,40 L-26,40Z" fill="#1E1E1E" /><ellipse cx={0} cy={60} rx={160} ry={120} fill="url(#hLamp)" /><circle cy={44} r={12} fill="#FFE2A8" /></g>)}
    <rect x={0} y={260 + 0} width={1920} height={440} fill="#1C2433" opacity={0.6} />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={(i * 173 + px * 0.6) % 1920} y={420 + (i % 3) * 60} width={60} height={20} rx={10} fill={i % 2 ? "#FF6B6B" : "#FFD27A"} opacity={0.35} />)}
    {[0, 640, 1280].map((x) => <rect key={x} x={x + px * 0.6} y={260} width={10} height={440} fill="#2A1C14" />)}
    <text x={360 + px * 0.6} y={360} fontFamily="Poppins" fontWeight={700} fontSize={40} fill="#FFD27A" opacity={0.5} transform="scale(-1,1) translate(-720,0)">KAFE · WiFi</text>
    <rect x={0} y={700} width={1920} height={30} fill="#6E4528" /><rect y={730} width={1920} height={350} fill="#4E321E" />
    {/* diğer müşteriler (silüet) */}
    {[200, 1700].map((x, i) => <g key={x} transform={`translate(${x + px * 0.7},700)`} opacity={0.75}><circle cx={0} cy={-230} r={60} fill="#1A120D" /><path d="M-110,0 Q-110,-150 0,-160 Q110,-150 110,0Z" fill="#1A120D" /><TeaGlass x={i ? -140 : 140} y={0} s={0.8} t={t} /></g>)}
  </g>
);

// kışla koğuşu: sıra sıra ranza, haki, gece lambası
export const Kisla: React.FC<{ t: number; px?: number }> = ({ t, px = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#4C5240" />
    <rect y={720} width={1920} height={360} fill="#3A3E31" />
    <rect y={0} width={1920} height={60} fill="#2E3127" />
    {[0, 1, 2, 3, 4].map((i) => { const x = 120 + i * 380 + px * (0.4 + i * 0.05); return <g key={i} transform={`translate(${x},300)`}><rect x={0} y={0} width={16} height={520} fill="#2A2D24" /><rect x={300} y={0} width={16} height={520} fill="#2A2D24" />{[60, 320].map((yy) => <g key={yy}><rect x={0} y={yy} width={316} height={70} fill="#6B7255" /><rect x={10} y={yy - 20} width={300} height={30} fill="#D9D6C8" /><rect x={10} y={yy + 6} width={300} height={10} fill="#8B8F78" /></g>)}</g>; })}
    <circle cx={960} cy={70} r={18} fill="#FFE7A8" /><ellipse cx={960} cy={160} rx={420} ry={200} fill="url(#hLamp)" opacity={0.6 + 0.1 * Math.sin(t * 2)} />
    <g transform="translate(1720,120)"><rect x={-110} y={-70} width={220} height={140} fill="#C0392B" /><circle cx={-20} cy={0} r={38} fill="#FFF" /><circle cx={-6} cy={0} r={30} fill="#C0392B" /><path d="M40,0 l-28,-10 l18,24 l0,-28 l-18,24Z" fill="#FFF" transform="translate(16,0)" /></g>
  </g>
);

// stüdyo/ofis (26 yaş): iki monitör, ring ışık, ekip masaları, plaket duvarda
export const Studio: React.FC<{ t: number; px?: number; plaque?: boolean; night?: boolean }> = ({ t, px = 0, plaque = false, night = false }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#1C1F26" : "#2A2F3A"} />
    {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`translate(${i * 170 + px * 0.3},80)`}><path d="M0,0 L60,0 L80,90 L-20,90Z" fill="#3A404D" opacity={0.6} /></g>)}
    {/* ses yalıtım panelleri */}
    {Array.from({ length: 16 }, (_, i) => <rect key={i} x={140 + (i % 8) * 110 + px * 0.4} y={200 + Math.floor(i / 8) * 110} width={100} height={100} fill={i % 3 ? "#3B3F4A" : "#4A3F5A"} />)}
    {/* neon yazı */}
    <text x={1360 + px * 0.4} y={300} fontFamily="Poppins" fontWeight={700} fontSize={90} fill="none" stroke="#FF4B5C" strokeWidth={4} opacity={0.75 + 0.25 * Math.sin(t * 3)} style={{ filter: "drop-shadow(0 0 12px #FF4B5C)" }}>STÜDYO</text>
    {plaque && <g transform={`translate(${1500 + px * 0.4},520) scale(0.38)`}><Plaque x={0} y={0} t={t} /></g>}
    {/* masa ve monitörler */}
    <rect x={0} y={760} width={1920} height={30} fill="#3A3F4A" /><rect y={790} width={1920} height={300} fill="#2A2E36" />
    {[560, 1160].map((x, i) => <g key={x} transform={`translate(${x + px},560)`}><rect x={-270} y={-170} width={540} height={330} rx={10} fill="#111" /><rect x={-256} y={-156} width={512} height={302} fill={i ? "#18324F" : "#2A1A1A"} /><rect x={-20} y={160} width={40} height={50} fill="#222" /><rect x={-100} y={196} width={200} height={14} rx={6} fill="#222" />{Array.from({ length: 6 }, (_, j) => <rect key={j} x={-230} y={-130 + j * 40} width={300 + ((j * 97) % 160)} height={14} rx={6} fill={i ? "#3EA6FF" : "#E5322D"} opacity={0.35} />)}</g>)}
    {/* ring ışık */}
    <g transform={`translate(${200 + px},440)`}><circle r={120} fill="none" stroke="#FFF7E6" strokeWidth={22} /><circle r={240} fill="url(#hLamp)" opacity={0.6} /><rect x={-6} y={120} width={12} height={340} fill="#222" /></g>
    <Mic x={860 + px} y={600} s={2} />
  </g>
);

// oturma odası (aile, akşam): kanepe, halı, TV, perde
export const Salon: React.FC<{ t: number; px?: number }> = ({ t, px = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#D7C2A0" />
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 131 + px * 0.3) % 1920} cy={(i * 89) % 700} r={6} fill="#B99E74" opacity={0.4} />)}
    <rect y={760} width={1920} height={320} fill="#8B5A3A" />
    <ellipse cx={960 + px} cy={940} rx={760} ry={110} fill="#A8323A" /><ellipse cx={960 + px} cy={940} rx={640} ry={80} fill="none" stroke="#E9C46A" strokeWidth={8} />
    <g transform={`translate(${1500 + px * 0.5},360)`}><rect x={-220} y={-140} width={440} height={260} rx={10} fill="#111" /><rect x={-206} y={-126} width={412} height={232} fill="#1E3A5A" /><rect x={-206} y={-126} width={412} height={232} fill="#FFF" opacity={0.05 + 0.04 * Math.sin(t * 5)} /><rect x={-260} y={130} width={520} height={120} fill={H.wood2} /></g>
    <g transform={`translate(${300 + px * 0.5},120)`}><rect x={-20} y={-20} width={380} height={420} fill="#EFE7DA" /><rect width={340} height={380} fill="#2A3550" /><path d="M0,0 q80,190 0,380 L-40,380 L-40,0Z M340,0 q-80,190 0,380 L380,380 L380,0Z" fill="#F1E3C6" /></g>
    <g transform={`translate(${200 + px * 0.8},620)`}><rect x={0} y={0} width={900} height={200} rx={40} fill="#5E7D6A" /><rect x={30} y={-120} width={840} height={150} rx={40} fill="#6E8F7A" /><rect x={-30} y={-40} width={90} height={240} rx={30} fill="#56735F" /><rect x={840} y={-40} width={90} height={240} rx={30} fill="#56735F" /></g>
  </g>
);

// kapı (kargo, askerlik kâğıdı): koridor + açılan kapı
export const Door: React.FC<{ t: number; open?: number; knock?: number }> = ({ t, open = 0, knock = 0 }) => {
  const sh = knock > 0 ? Math.sin(t * 50) * 4 * knock : 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#CDB89A" />
      <rect y={860} width={1920} height={220} fill="#7B5338" />
      <g transform={`translate(${960 + sh},540)`}>
        <rect x={-300} y={-460} width={600} height={800} fill="#EDE3D2" />
        <rect x={-270} y={-440} width={540} height={780} fill="#2B2018" />
        <g transform={`translate(-270,0) scale(${1 - open * 0.75},1)`}><rect x={0} y={-440} width={540} height={780} fill="#7A4B2C" /><rect x={40} y={-400} width={460} height={300} fill="#86553A" /><rect x={40} y={-60} width={460} height={360} fill="#86553A" /><circle cx={480} cy={0} r={18} fill="#D4AF37" /><circle cx={270} cy={-300} r={14} fill="#111" /></g>
        {open > 0.3 && <ellipse cx={0} cy={300} rx={260 * open} ry={40} fill="#FFF3D6" opacity={0.3 * open} />}
      </g>
      <g transform="translate(1500,300)"><rect x={-50} y={-70} width={100} height={140} rx={6} fill="#F7F3EA" /><circle cy={-10} r={22} fill="#E5322D" /></g>
    </g>
  );
};

// ───────── ARAYÜZLER (gerçeğe benzer, kopya değil) ─────────
const UIFont = "Poppins";
export const PlayLogo: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><rect x={-30} y={-21} width={60} height={42} rx={13} fill={H.red} /><path d="M-8,-11 L14,0 L-8,11Z" fill="#FFF" /></g>
);
// küçük resim (kapak). kind: "bad" kalabalık kapak, "good" sade kapak, "mc" minecraft, "phone" telefon
export const Thumb: React.FC<{ x: number; y: number; w?: number; kind?: "bad" | "good" | "mc" | "phone" | "plain" | "edit"; t?: number; label?: string }> = ({ x, y, w = 320, kind = "plain", t = 0, label }) => {
  const h = w * 0.5625, s = w / 320;
  return (
    <g transform={`translate(${x},${y})`}>
      <rect width={w} height={h} rx={10 * s} fill={kind === "mc" || kind === "bad" ? "#4E8A3A" : kind === "good" || kind === "phone" ? "#13161D" : "#3A3F4A"} />
      <svg width={w} height={h} viewBox="0 0 320 180" overflow="hidden">
        {(kind === "mc" || kind === "bad") && <>{Array.from({ length: 40 }, (_, i) => <rect key={i} x={(i % 10) * 32} y={110 + Math.floor(i / 10) * 18} width={32} height={18} fill={["#6B4A2E", "#7D5A3A", "#5C8F3A"][i % 3]} />)}<rect x={0} y={0} width={320} height={110} fill="#87C3F0" /><circle cx={260} cy={40} r={20} fill="#FFF3A0" /></>}
        {kind === "bad" && <>
          {["100 GÜN!!", "HAYATTA", "KALDIM", "İNANILMAZ", "PART 1"].map((w2, i) => <text key={i} x={10 + (i % 2) * 140} y={30 + i * 30} fontFamily={UIFont} fontWeight={700} fontSize={24 - i * 2} fill={["#FF2", "#F33", "#FFF", "#0FF", "#F0F"][i]} stroke="#000" strokeWidth={2} paintOrder="stroke" transform={`rotate(${(i % 2 ? 6 : -6)} ${60 + (i % 2) * 140} ${30 + i * 30})`}>{w2}</text>)}
          {["😱", "🔥", "💀"].map((e, i) => <text key={i} x={200 + i * 38} y={150 - i * 26} fontSize={34}>{e}</text>)}
          <path d="M240,100 L300,60 M300,60 L280,62 M300,60 L296,80" stroke="#F00" strokeWidth={8} strokeLinecap="round" fill="none" />
        </>}
        {(kind === "good" || kind === "phone") && <>
          <rect width={320} height={180} fill="#0F1A2E" />
          <g transform="translate(90,92) rotate(-8)"><rect x={-38} y={-72} width={76} height={144} rx={12} fill="#1A1C20" stroke="#8892A6" strokeWidth={3} /><rect x={-32} y={-64} width={64} height={128} rx={8} fill="#2C4A7A" /><circle cx={0} cy={-56} r={3} fill="#000" /></g>
          <text x={150} y={78} fontFamily={UIFont} fontWeight={700} fontSize={34} fill="#FFF">2 KAT</text>
          <text x={150} y={118} fontFamily={UIFont} fontWeight={700} fontSize={34} fill="#FFC531">PARA?</text>
        </>}
        {kind === "edit" && <><rect width={320} height={180} fill="#22262E" /><path d="M0,140 L60,110 L120,124 L180,80 L240,96 L320,40" stroke={H.blue} strokeWidth={6} fill="none" /></>}
      </svg>
      {label && <rect x={w - 64 * s} y={h - 30 * s} width={56 * s} height={22 * s} rx={4 * s} fill="#000" opacity={0.8} />}
      {label && <text x={w - 36 * s} y={h - 14 * s} textAnchor="middle" fontFamily={UIFont} fontWeight={600} fontSize={14 * s} fill="#FFF">{label}</text>}
    </g>
  );
};

// video satırı (kanal içerik listesi)
export const VideoRow: React.FC<{ x: number; y: number; title: string; views: number; kind?: "bad" | "good" | "mc" | "phone" | "plain"; hi?: number; w?: number; date?: string }> = ({ x, y, title, views, kind = "mc", hi = 0, w = 900, date = "2 gün önce" }) => (
  <g transform={`translate(${x},${y})`}>
    {hi > 0 && <rect x={-14} y={-14} width={w + 28} height={128} rx={12} fill="#FFF" opacity={0.08 * hi} />}
    <Thumb x={0} y={0} w={176} kind={kind} label="8:14" />
    <text x={200} y={36} fontFamily={UIFont} fontWeight={600} fontSize={28} fill={H.txt}>{title}</text>
    <text x={200} y={74} fontFamily={UIFont} fontWeight={500} fontSize={22} fill={H.dim}>{date}</text>
    <text x={w} y={52} textAnchor="end" fontFamily={UIFont} fontWeight={700} fontSize={40} fill={hi > 0 ? "#FFF" : H.txt}>{fmt(views)}</text>
    <text x={w} y={84} textAnchor="end" fontFamily={UIFont} fontWeight={500} fontSize={20} fill={H.dim}>izlenme</text>
  </g>
);

// kanal paneli (Studio'ya benzer): sol menü + başlık
export const StudioShell: React.FC<{ title?: string; children?: React.ReactNode; avatar?: string }> = ({ title = "Kanal analizi", children, avatar = "#3EA6FF" }) => (
  <g>
    <rect width={1000} height={625} fill={H.ui} />
    <rect width={1000} height={56} fill={H.ui2} />
    <PlayLogo x={40} y={28} s={0.7} /><text x={70} y={37} fontFamily={UIFont} fontWeight={700} fontSize={22} fill="#FFF">Stüdyo</text>
    <rect x={330} y={14} width={340} height={30} rx={15} fill="#121212" stroke="#333" />
    <circle cx={960} cy={28} r={16} fill={avatar} />
    <rect y={56} width={160} height={569} fill={H.ui2} />
    {["Panel", "İçerik", "Analiz", "Yorumlar", "Gelir"].map((m, i) => <g key={m}><rect x={8} y={80 + i * 52} width={144} height={40} rx={8} fill={m === (title.includes("analiz") ? "Analiz" : title.includes("Gelir") ? "Gelir" : title.includes("Yorum") ? "Yorumlar" : "İçerik") ? "#333" : "none"} /><text x={30} y={107 + i * 52} fontFamily={UIFont} fontWeight={500} fontSize={18} fill="#DDD">{m}</text></g>)}
    <text x={190} y={100} fontFamily={UIFont} fontWeight={700} fontSize={30} fill="#FFF">{title}</text>
    <g transform="translate(190,120)">{children}</g>
  </g>
);

// büyük sayaç kartı (abone/izlenme/dolar)
export const Stat: React.FC<{ x: number; y: number; label: string; value: string; w?: number; c?: string; delta?: string; pulse?: number }> = ({ x, y, label, value, w = 240, c = "#FFF", delta, pulse = 0 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect width={w} height={130} rx={10} fill={H.ui2} stroke={pulse > 0 ? c : "#333"} strokeWidth={pulse > 0 ? 3 : 1} />
    <text x={20} y={38} fontFamily={UIFont} fontWeight={500} fontSize={18} fill={H.dim}>{label}</text>
    <text x={20} y={92} fontFamily={UIFont} fontWeight={700} fontSize={44} fill={c}>{value}</text>
    {delta && <text x={20} y={118} fontFamily={UIFont} fontWeight={600} fontSize={16} fill={delta.startsWith("-") ? "#FF6B6B" : H.green}>{delta}</text>}
  </g>
);

// çizgi grafik (0..1 değerleri), k: çizim ilerlemesi
export const LineChart: React.FC<{ x: number; y: number; w: number; h: number; pts: number[]; k?: number; c?: string; fill?: boolean; grid?: boolean; mark?: number }> = ({ x, y, w, h, pts, k = 1, c = H.blue, fill = true, grid = true, mark }) => {
  const n = pts.length - 1;
  const P2 = pts.map((v, i) => [x + (i / n) * w, y + h - v * h]);
  const upto = Math.max(1, Math.floor(k * n));
  const fr = k * n - Math.floor(k * n);
  const vis = P2.slice(0, upto + 1);
  if (upto < n && fr > 0) { const a = P2[upto], b = P2[upto + 1]; vis.push([lp(a[0], b[0], fr), lp(a[1], b[1], fr)]); }
  const d = vis.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ");
  const last = vis[vis.length - 1];
  return (
    <g>
      {grid && [0, 1, 2, 3].map((i) => <line key={i} x1={x} x2={x + w} y1={y + (i * h) / 3} y2={y + (i * h) / 3} stroke="#333" strokeWidth={1} />)}
      {fill && <path d={`${d} L${last[0]},${y + h} L${x},${y + h}Z`} fill={c} opacity={0.15} />}
      <path d={d} stroke={c} strokeWidth={4} fill="none" strokeLinejoin="round" />
      <circle cx={last[0]} cy={last[1]} r={7} fill={c} />
      {mark !== undefined && <line x1={x + mark * w} x2={x + mark * w} y1={y} y2={y + h} stroke="#FFF" strokeDasharray="6 6" opacity={0.5} />}
    </g>
  );
};

// yorum kartı
export const Comment: React.FC<{ x: number; y: number; name: string; text: string; ago?: string; c?: string; w?: number; k?: number; likes?: number }> = ({ x, y, name, text, ago = "1 saat önce", c = "#7E5BD6", w = 820, k = 1, likes }) => (
  <g transform={`translate(${x},${y + (1 - k) * 30})`} opacity={k}>
    <circle cx={30} cy={30} r={30} fill={c} /><text x={30} y={41} textAnchor="middle" fontFamily={UIFont} fontWeight={700} fontSize={28} fill="#FFF">{name[1]?.toUpperCase()}</text>
    <text x={80} y={22} fontFamily={UIFont} fontWeight={600} fontSize={20} fill="#FFF">{name} <tspan fill={H.dim} fontWeight={500}> · {ago}</tspan></text>
    <text x={80} y={60} fontFamily={UIFont} fontWeight={500} fontSize={28} fill="#EEE">{text}</text>
    <text x={80} y={96} fontFamily={UIFont} fontWeight={500} fontSize={18} fill={H.dim}>👍 {likes ?? ""}   👎   Yanıtla</text>
    <rect x={0} y={112} width={w} height={1} fill="#333" />
  </g>
);

// telefon bildirimi (kilit ekranı üstü)
export const Notif: React.FC<{ x: number; y: number; app: string; title: string; body: string; k?: number; w?: number; icon?: string; ago?: string }> = ({ x, y, app, title, body, k = 1, w = 330, icon = H.red, ago = "şimdi" }) => (
  <g transform={`translate(${x},${y - (1 - k) * 60})`} opacity={k}>
    <rect width={w} height={118} rx={22} fill="#F2F2F2" opacity={0.95} />
    <rect x={14} y={14} width={30} height={30} rx={8} fill={icon} />
    <text x={54} y={36} fontFamily={UIFont} fontWeight={600} fontSize={15} fill="#555">{app.toUpperCase()}</text>
    <text x={w - 16} y={36} textAnchor="end" fontFamily={UIFont} fontWeight={500} fontSize={14} fill="#777">{ago}</text>
    <text x={16} y={70} fontFamily={UIFont} fontWeight={700} fontSize={19} fill="#111">{title}</text>
    <text x={16} y={98} fontFamily={UIFont} fontWeight={500} fontSize={17} fill="#333">{body}</text>
  </g>
);

// kilit ekranı (saat + tarih)
export const LockScreen: React.FC<{ time?: string; date?: string; children?: React.ReactNode; bg?: string }> = ({ time = "02:14", date = "Salı, 14 Mart", children, bg = "#1B2440" }) => (
  <g>
    <rect width={360} height={740} fill={bg} />
    <circle cx={280} cy={600} r={260} fill="#3A2A6A" opacity={0.6} /><circle cx={40} cy={200} r={200} fill="#1F5A7A" opacity={0.5} />
    <text x={180} y={120} textAnchor="middle" fontFamily={UIFont} fontWeight={500} fontSize={20} fill="#EEE">{date}</text>
    <text x={180} y={200} textAnchor="middle" fontFamily={UIFont} fontWeight={600} fontSize={84} fill="#FFF">{time}</text>
    <g transform="translate(15,250)">{children}</g>
  </g>
);

// e-posta görünümü
export const Mail: React.FC<{ from: string; subject: string; lines: string[]; k?: number; badge?: string; badgeC?: string }> = ({ from, subject, lines, k = 1, badge, badgeC = H.green }) => (
  <g>
    <rect width={1000} height={625} fill="#F6F8FC" />
    <rect width={1000} height={60} fill="#FFF" /><text x={30} y={40} fontFamily={UIFont} fontWeight={700} fontSize={24} fill="#C5221F">Posta</text>
    <rect x={200} y={14} width={520} height={34} rx={17} fill="#EAF1FB" />
    <rect x={0} y={60} width={180} height={565} fill="#F6F8FC" />
    {["Gelen", "Yıldızlı", "Gönderilen"].map((m, i) => <text key={m} x={30} y={110 + i * 44} fontFamily={UIFont} fontWeight={i ? 500 : 700} fontSize={18} fill="#333">{m}</text>)}
    <g transform={`translate(200,${80 + (1 - k) * 20})`} opacity={k}>
      <rect width={780} height={525} rx={16} fill="#FFF" />
      <text x={30} y={56} fontFamily={UIFont} fontWeight={700} fontSize={28} fill="#111">{subject}</text>
      {badge && <g transform="translate(30,80)"><rect width={badge.length * 13 + 30} height={34} rx={17} fill={badgeC} /><text x={15} y={23} fontFamily={UIFont} fontWeight={700} fontSize={17} fill="#FFF">{badge}</text></g>}
      <circle cx={52} cy={160} r={22} fill="#4285F4" /><text x={90} y={156} fontFamily={UIFont} fontWeight={600} fontSize={19} fill="#222">{from}</text><text x={90} y={180} fontFamily={UIFont} fontWeight={500} fontSize={15} fill="#777">alıcı: ben</text>
      {lines.map((l, i) => <text key={i} x={30} y={240 + i * 40} fontFamily={UIFont} fontWeight={500} fontSize={22} fill="#333">{l}</text>)}
    </g>
  </g>
);

// direkt mesaj (Instagram'a benzer, kopya değil)
export const DM: React.FC<{ name: string; msgs: { me?: boolean; text: string }[]; k?: number; typing?: boolean; t?: number }> = ({ name, msgs, k = 1, typing, t = 0 }) => (
  <g>
    <rect width={360} height={740} fill="#000" />
    <rect width={360} height={86} fill="#0B0B0B" />
    <text x={20} y={58} fontFamily={UIFont} fontWeight={700} fontSize={24} fill="#FFF">‹</text>
    <circle cx={74} cy={50} r={22} fill="url(#dmG)" /><defs><linearGradient id="dmG" x1="0" y1="1" x2="1" y2="0"><stop offset="0" stopColor="#F58529" /><stop offset="0.5" stopColor="#DD2A7B" /><stop offset="1" stopColor="#8134AF" /></linearGradient></defs>
    <text x={106} y={46} fontFamily={UIFont} fontWeight={700} fontSize={17} fill="#FFF">{name}</text><text x={106} y={68} fontFamily={UIFont} fontWeight={500} fontSize={13} fill="#999">Etkin değil</text>
    {msgs.map((m, i) => {
      const kk = cl(k * msgs.length - i);
      const lines = wrap(m.text, 24);
      const hgt = lines.length * 26 + 20;
      const yy = 120 + msgs.slice(0, i).reduce((s2, mm) => s2 + wrap(mm.text, 24).length * 26 + 34, 0);
      return <g key={i} opacity={kk} transform={`translate(0,${(1 - kk) * 20})`}>
        <rect x={m.me ? 120 : 16} y={yy} width={224} height={hgt} rx={20} fill={m.me ? "#3797F0" : "#262626"} />
        {lines.map((l, j) => <text key={j} x={(m.me ? 120 : 16) + 16} y={yy + 30 + j * 26} fontFamily={UIFont} fontWeight={500} fontSize={17} fill="#FFF">{l}</text>)}
      </g>;
    })}
    {typing && <g transform="translate(16,640)"><rect width={80} height={40} rx={20} fill="#262626" />{[0, 1, 2].map((i) => <circle key={i} cx={22 + i * 18} cy={20} r={5} fill="#AAA" opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 5 + i))} />)}</g>}
    <rect x={14} y={680} width={332} height={46} rx={23} fill="#1A1A1A" stroke="#333" /><text x={34} y={710} fontFamily={UIFont} fontWeight={500} fontSize={16} fill="#888">Mesaj…</text>
  </g>
);
export const wrap = (s: string, n: number) => { const out: string[] = []; let cur = ""; for (const w of s.split(" ")) { if ((cur + " " + w).trim().length > n && cur) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim(); } if (cur) out.push(cur); return out; };

// CapCut'a benzer telefon montaj ekranı (kopya değil)
export const EditApp: React.FC<{ t: number; k?: number }> = ({ t, k = 0 }) => (
  <g>
    <rect width={360} height={740} fill="#111" />
    <rect x={0} y={60} width={360} height={260} fill="#000" />
    <Thumb x={20} y={84} w={320} kind="mc" />
    <text x={180} y={350} textAnchor="middle" fontFamily={UIFont} fontWeight={600} fontSize={16} fill="#BBB">00:{String(Math.floor(t * 3) % 60).padStart(2, "0")} / 08:14</text>
    {[0, 1, 2].map((r) => <g key={r} transform={`translate(${-md(t * 40, 120)},${400 + r * 70})`}>{Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 120} y={0} width={114} height={54} rx={6} fill={r === 0 ? "#3B6E3A" : r === 1 ? "#2D5C8A" : "#7A3A8A"} opacity={0.9} />)}</g>)}
    <rect x={178} y={380} width={4} height={230} fill="#FFF" />
    {["Kes", "Ses", "Yazı", "Efekt", "Filtre"].map((m, i) => <g key={m}><rect x={14 + i * 68} y={640} width={60} height={60} rx={12} fill="#222" /><text x={44 + i * 68} y={720} textAnchor="middle" fontFamily={UIFont} fontWeight={500} fontSize={12} fill="#AAA">{m}</text></g>)}
    {k > 0 && <rect x={0} y={60} width={360} height={260} fill="#FFF" opacity={0.1 * k} />}
  </g>
);

// 100 kişi ızgarası (yüzde iki tıklama gibi)
export const People100: React.FC<{ x: number; y: number; on: number; k?: number; s?: number; c?: string }> = ({ x, y, on, k = 1, s = 1, c = H.red }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {Array.from({ length: 100 }, (_, i) => {
      const hl = i < on && k > 0.5;
      const col = i % 20, row = Math.floor(i / 20);
      return <g key={i} transform={`translate(${col * 46},${row * 76})`} opacity={hl ? 1 : 0.35}><circle cx={0} cy={0} r={12} fill={hl ? c : "#BBB"} /><path d="M-18,40 Q-18,16 0,16 Q18,16 18,40Z" fill={hl ? c : "#BBB"} /></g>;
    })}
  </g>
);

// ülke reklam çubukları (görece, sayı yok)
export const AdBars: React.FC<{ x: number; y: number; k?: number }> = ({ x, y, k = 1 }) => (
  <g transform={`translate(${x},${y})`}>
    {[["ABD", 1, "#3EA6FF"], ["Almanya", 0.82, "#FFC531"], ["Türkiye", 0.14, "#E5322D"]].map(([n, v, c], i) => (
      <g key={String(n)} transform={`translate(0,${i * 150})`}>
        <text x={0} y={60} fontFamily={UIFont} fontWeight={700} fontSize={46} fill="#FFF">{String(n)}</text>
        <rect x={300} y={10} width={1100} height={70} rx={14} fill="#FFF" opacity={0.08} />
        <rect x={300} y={10} width={1100 * Number(v) * cl(k * 1.4 - i * 0.2)} height={70} rx={14} fill={String(c)} />
        <text x={300 + 1100 * Number(v) * cl(k * 1.4 - i * 0.2) + 20} y={60} fontFamily={UIFont} fontWeight={700} fontSize={36} fill="#FFF">{"$".repeat(Math.max(1, Math.round(Number(v) * 6)))}</text>
      </g>
    ))}
  </g>
);

// ilerleme çubuğu (eşik)
export const Progress: React.FC<{ x: number; y: number; w: number; v: number; label?: string; c?: string; right?: string; size?: number }> = ({ x, y, w, v, label, c = H.green, right, size }) => {
  const fs = size ?? (w > 900 ? 46 : 22), hh = fs * 0.9;
  return (
  <g transform={`translate(${x},${y})`}>
    {label && <text x={0} y={-fs * 0.7} fontFamily={UIFont} fontWeight={600} fontSize={fs} fill="#DDD">{label}</text>}
    {right && <text x={w} y={-fs * 0.7} textAnchor="end" fontFamily={UIFont} fontWeight={700} fontSize={fs} fill="#FFF">{right}</text>}
    <rect width={w} height={hh} rx={hh / 2} fill="#333" />
    <rect width={w * cl(v)} height={hh} rx={hh / 2} fill={c} />
  </g>
  );
};

// banka SMS / bildirim satırı
export const BankCard: React.FC<{ k?: number; gross: string; cut: string; net: string }> = ({ k = 1, gross, cut, net }) => (
  <g>
    <rect width={360} height={740} fill="#F3F5F8" />
    <rect width={360} height={130} fill="#0E4C92" /><text x={24} y={80} fontFamily={UIFont} fontWeight={700} fontSize={26} fill="#FFF">Banka</text><text x={24} y={110} fontFamily={UIFont} fontWeight={500} fontSize={15} fill="#CFE0F5">Hesap hareketleri</text>
    {[["Yurt dışı gelen havale", gross, "#111"], ["Vergi kesintisi (%15)", cut, "#C62828"], ["Hesaba geçen", net, "#1B8A4B"]].map(([a, b, c], i) => (
      <g key={i} opacity={cl(k * 3 - i)} transform={`translate(16,${160 + i * 110})`}>
        <rect width={328} height={94} rx={14} fill="#FFF" />
        <text x={18} y={38} fontFamily={UIFont} fontWeight={500} fontSize={17} fill="#555">{a}</text>
        <text x={18} y={74} fontFamily={UIFont} fontWeight={700} fontSize={28} fill={c}>{b}</text>
      </g>
    ))}
  </g>
);

// telif uyarısı ekranı
export const Strike: React.FC<{ k?: number; n?: number }> = ({ k = 1, n = 1 }) => (
  <g>
    <rect width={1000} height={625} fill={H.ui} />
    <g transform={`translate(500,${300 + (1 - k) * 30})`} opacity={k}>
      <rect x={-380} y={-230} width={760} height={460} rx={18} fill={H.ui2} stroke="#E5322D" strokeWidth={3} />
      <circle cx={0} cy={-130} r={56} fill="#E5322D" /><text y={-108} textAnchor="middle" fontFamily={UIFont} fontWeight={700} fontSize={70} fill="#FFF">!</text>
      <text y={-20} textAnchor="middle" fontFamily={UIFont} fontWeight={700} fontSize={40} fill="#FFF">Telif hakkı uyarısı</text>
      <text y={30} textAnchor="middle" fontFamily={UIFont} fontWeight={500} fontSize={22} fill="#CCC">Videonuzdaki müzik için hak sahibi bildirimi</text>
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${-130 + i * 130},120)`}><circle r={44} fill={i < n ? "#E5322D" : "none"} stroke={i < n ? "#E5322D" : "#555"} strokeWidth={5} /><text y={14} textAnchor="middle" fontFamily={UIFont} fontWeight={700} fontSize={38} fill={i < n ? "#FFF" : "#666"}>{i + 1}</text></g>)}
      <text y={205} textAnchor="middle" fontFamily={UIFont} fontWeight={600} fontSize={20} fill="#FF8A80">3 uyarı = kanal silinir</text>
    </g>
  </g>
);

// haber başlığı ekranı
export const News: React.FC<{ k?: number; head: string; sub: string }> = ({ k = 1, head, sub }) => (
  <g>
    <rect width={360} height={740} fill="#FFF" />
    <rect width={360} height={70} fill="#C8102E" /><text x={20} y={46} fontFamily={UIFont} fontWeight={700} fontSize={26} fill="#FFF">HABER</text>
    <rect x={16} y={90} width={328} height={190} fill="#2A2F3A" />
    <g transform="translate(180,185)" opacity={0.85}><rect x={-60} y={-30} width={120} height={60} rx={8} fill="#1C3D7A" /><text y={10} textAnchor="middle" fontFamily={UIFont} fontWeight={700} fontSize={22} fill="#FFF">POLİS</text></g>
    <g opacity={k} transform={`translate(0,${(1 - k) * 20})`}>
      {wrap(head, 22).map((l, i) => <text key={i} x={18} y={330 + i * 36} fontFamily={UIFont} fontWeight={700} fontSize={27} fill="#111">{l}</text>)}
      {wrap(sub, 32).map((l, i) => <text key={i} x={18} y={470 + i * 28} fontFamily={UIFont} fontWeight={500} fontSize={18} fill="#555">{l}</text>)}
    </g>
  </g>
);

// yaş/zaman etiketi (seviye kartı YOK; küçük alt köşe şerit)
export const AgeTag: React.FC<{ t: number; at: number; age: string; place?: string }> = ({ t, at, age, place }) => {
  const k = rp(t, at, at + 0.5);
  if (t < at) return null;
  return (
    <div style={{ position: "absolute", left: 70, bottom: 70, opacity: k, transform: `translateX(${(1 - k) * -40}px)`, display: "flex", alignItems: "center", gap: 18, fontFamily: UIFont }}>
      <div style={{ width: 8, height: 92, background: H.red, borderRadius: 4 }} />
      <div>
        <div style={{ fontSize: 64, fontWeight: 700, color: "#FFF", lineHeight: 1, textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>{age}</div>
        {place && <div style={{ fontSize: 30, fontWeight: 600, color: "#E8E2D6", marginTop: 6, textShadow: "0 3px 10px rgba(0,0,0,.6)" }}>{place}</div>}
      </div>
    </div>
  );
};

// büyük sayı / kısa yazı (koyu yarı saydam kart üstünde, her zaman okunur)
export const Big: React.FC<{ t: number; at: number; text: string; sub?: string; y?: number; size?: number; c?: string; until?: number; x?: number }> = ({ t, at, text, sub, y = 80, size = 96, c = "#FFF", until = 1e9, x = 960 }) => {
  if (t < at) return null;
  const k = rp(t, at, at + 0.35) * (1 - rp(t, until, until + 0.25));
  return (
    <div style={{ position: "absolute", left: x - 900, width: 1800, top: y, textAlign: "center", opacity: k, transform: `translateY(${(1 - k) * 24}px) scale(${0.9 + 0.1 * k})`, fontFamily: UIFont }}>
      <span style={{ display: "inline-block", background: "rgba(10,12,18,.78)", borderRadius: 18, padding: `${size * 0.1}px ${size * 0.38}px`, fontWeight: 700, fontSize: size, color: c, lineHeight: 1.1, boxShadow: "0 12px 34px rgba(0,0,0,.35)" }}>{text}</span>
      {sub && <div style={{ marginTop: 12 }}><span style={{ display: "inline-block", background: "rgba(10,12,18,.78)", borderRadius: 12, padding: "6px 22px", fontWeight: 600, fontSize: size * 0.4, color: "#E8E8E8" }}>{sub}</span></div>}
    </div>
  );
};

// sayaç (animasyonlu rakam)
export const Counter: React.FC<{ t: number; a: number; from: number; to: number; dur?: number; label: string; y?: number; c?: string; prefix?: string }> = ({ t, a, from, to, dur = 1.6, label, y = 400, c = "#FFF", prefix = "" }) => {
  const k = rp(t, a + 0.2, a + 0.2 + dur);
  const v = from + (to - from) * k;
  return (
    <div style={{ position: "absolute", left: 0, right: 0, top: y, textAlign: "center", fontFamily: UIFont }}>
      <div style={{ fontSize: 210, fontWeight: 700, color: c, lineHeight: 1, textShadow: "0 10px 40px rgba(0,0,0,.6)", fontVariantNumeric: "tabular-nums" }}>{prefix}{fmt(v)}</div>
      <div style={{ fontSize: 50, fontWeight: 600, color: "#E8E8E8", marginTop: 10, textShadow: "0 4px 14px rgba(0,0,0,.6)" }}>{label}</div>
    </div>
  );
};

// karar kartı: Zorluk / Sermaye / Sabır
export const Verdict: React.FC<{ t: number; a: number; rows: [string, number][]; title?: string }> = ({ t, a, rows, title = "Türkiye'de YouTuber olmak" }) => (
  <div style={{ position: "absolute", left: 360, right: 360, top: 200, fontFamily: UIFont, background: "rgba(14,16,22,.92)", borderRadius: 30, padding: "50px 70px", boxShadow: "0 30px 80px rgba(0,0,0,.5)", border: "2px solid #2E3340" }}>
    <div style={{ fontSize: 46, fontWeight: 700, color: "#FFF", marginBottom: 30 }}>{title}</div>
    {rows.map(([n, v], i) => {
      const k = rp(t, a + i * 1.4, a + i * 1.4 + 0.9);
      return (
        <div key={n} style={{ display: "flex", alignItems: "center", gap: 30, margin: "26px 0", opacity: t < a + i * 1.4 ? 0.25 : 1 }}>
          <div style={{ width: 260, fontSize: 48, fontWeight: 700, color: "#E8E8E8" }}>{n}</div>
          <div style={{ flex: 1, display: "flex", gap: 10 }}>{Array.from({ length: 10 }, (_, j) => <div key={j} style={{ flex: 1, height: 44, borderRadius: 8, background: j < Math.round(v * k) ? (v >= 8 ? "#E5322D" : v <= 2 ? "#2BB673" : "#FFB547") : "#2A2E38" }} />)}</div>
          <div style={{ width: 120, textAlign: "right", fontSize: 54, fontWeight: 700, color: "#FFF" }}>{Math.round(v * k)}/10</div>
        </div>
      );
    })}
  </div>
);

// abone ol düğmesi + zil
export const SubBtn: React.FC<{ t: number; at: number }> = ({ t, at }) => {
  if (t < at) return null;
  const k = rp(t, at, at + 0.4);
  const clicked = t > at + 1.2;
  return <div style={{ position: "absolute", bottom: 90, left: 0, right: 0, display: "flex", justifyContent: "center", opacity: k, transform: `scale(${0.7 + 0.3 * k})` }}><div style={{ background: clicked ? "#3A3A3A" : H.red, color: "#fff", fontFamily: UIFont, fontWeight: 700, fontSize: 58, padding: "16px 70px", borderRadius: 60, boxShadow: "0 12px 30px rgba(0,0,0,.45)" }}>{clicked ? "ABONE OLUNDU ✓" : "ABONE OL"} 🔔</div></div>;
};

// ampul (fikir)
export const Bulb: React.FC<{ x: number; y: number; s?: number; on?: number; t?: number }> = ({ x, y, s = 1, on = 1, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={160 * on} fill="url(#hLamp)" opacity={on} />
    {on > 0.5 && Array.from({ length: 8 }, (_, i) => { const a = (i / 8) * Math.PI * 2; const r1 = 90 + Math.sin(t * 6 + i) * 6; return <line key={i} x1={Math.cos(a) * r1} y1={Math.sin(a) * r1} x2={Math.cos(a) * (r1 + 40)} y2={Math.sin(a) * (r1 + 40)} stroke="#FFD27A" strokeWidth={8} strokeLinecap="round" />; })}
    <path d="M-50,10 A60,60 0 1,1 50,10 Q30,40 30,60 L-30,60 Q-30,40 -50,10Z" fill={on > 0.5 ? "#FFE9A8" : "#DDD"} stroke="#555" strokeWidth={4} />
    <rect x={-30} y={60} width={60} height={40} rx={6} fill="#888" />
  </g>
);
