import React from "react";
import { H } from "./Harem";
import { P, Bebek } from "./HaremPro";
import { Bayrak } from "./HaremSurgun";

// Kanal 1 · k3r-20 "Turhan" kiti (2026-11-19): 1640–1665, Sultan İbrahim dönemi.
// Mermer havuz (dalga + sıçrama + sonbahar yaprakları), alnında izli bebek, Kırım bozkırı + atlılar,
// Akdeniz deniz sahnesi (gündüz/gece/fırtına), Osmanlı kalyonu, Malta kadırgası (kürekli), top ateşi + duman,
// Akdeniz haritası (İstanbul → Rodos → Girit → Malta rotası), samur kaplı oda, Çanakkale Boğazı + iki kale (yapım),
// Yeni Cami + Mısır Çarşısı (iskeleden bitmişe), Malta limanı. Kimlik aynı: kalın kahve kontur, krem/sıcak + gece laciverti.

const LN = "#4A3524";
const clamp = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x);
const ease = (x: number) => { const c = clamp(x); return c * c * (3 - 2 * c); };
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const mix = (c1: string, c2: string, k: number) => {
  const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = p(c1), b = p(c2);
  return `#${a.map((v, i) => Math.round(lerp(v, b[i], clamp(k))).toString(16).padStart(2, "0")).join("")}`;
};
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

const Stars: React.FC<{ t: number; n?: number; y1?: number }> = ({ t, n = 50, y1 = 480 }) => (
  <g>{Array.from({ length: n }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 7) * y1} r={0.8 + rnd(i + 3) * 1.6} fill="#FFF8E0" opacity={0.3 + 0.4 * Math.abs(Math.sin(t * (0.6 + rnd(i) * 1.4) + i))} />)}</g>
);
const Minare: React.FC<{ x: number; y: number; h?: number; c?: string; w?: number }> = ({ x, y, h = 260, c = "#0B1024", w = 14 }) => (
  <g fill={c}><rect x={x - w / 2} y={y - h} width={w} height={h} /><rect x={x - w * 0.9} y={y - h * 0.72} width={w * 1.8} height={8} /><rect x={x - w * 0.9} y={y - h * 0.45} width={w * 1.8} height={7} /><path d={`M${x - w * 0.6},${y - h} L${x},${y - h - w * 3.4} L${x + w * 0.6},${y - h}Z`} /></g>
);

// ───────── 1) Yaprak (sonbahar) ─────────
const Yaprak: React.FC<{ x: number; y: number; r?: number; c?: string; s?: number }> = ({ x, y, r = 0, c = "#C9762E", s = 1 }) => (
  <g transform={`translate(${x},${y}) rotate(${r}) scale(${s})`}>
    <path d="M0,-16 C10,-10 12,6 0,16 C-12,6 -10,-10 0,-16Z" fill={c} stroke={LN} strokeWidth={1.6} />
    <path d="M0,-14 L0,14" stroke={LN} strokeWidth={1.2} opacity={0.6} />
  </g>
);

// ───────── 2) Mermer havuz (perspektif, sekizgen kenar) ─────────
// splash: 0 → yok, 0..1 sıçrama ilerlemesi; ripple: dalga şiddeti
export const MermerHavuz: React.FC<{ x?: number; y?: number; s?: number; t: number; splash?: number; ripple?: number; leaves?: number; sx?: number; night?: number }> = ({ x = 960, y = 880, s = 1, t, splash = 0, ripple = 0.4, leaves = 1, sx = 0, night = 0 }) => {
  const W = 760, D = 170;
  const rim = mix("#F2EBDD", "#5A6078", night * 0.8);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {/* dış kenar */}
      <path d={`M${-W - 50},0 L${-W + 60},${-D - 40} L${W - 60},${-D - 40} L${W + 50},0 L${W - 60},${D + 40} L${-W + 60},${D + 40}Z`} fill={rim} stroke={LN} strokeWidth={4} />
      <path d={`M${-W - 50},0 L${-W + 60},${D + 40} L${W - 60},${D + 40} L${W + 50},0 L${W + 50},40 L${W - 60},${D + 80} L${-W + 60},${D + 80} L${-W - 50},40Z`} fill={mix("#D9CFBB", "#3A4058", night * 0.8)} stroke={LN} strokeWidth={3} />
      {/* mermer damarları */}
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-W + i * 130},${D + 50} q30,-6 60,4 q20,8 50,-2`} stroke="#BFB4A0" strokeWidth={1.4} fill="none" opacity={0.6} />)}
      {/* su */}
      <path d={`M${-W},0 L${-W + 80},${-D} L${W - 80},${-D} L${W},0 L${W - 80},${D} L${-W + 80},${D}Z`} fill="url(#pWater)" stroke={LN} strokeWidth={3} />
      <path d={`M${-W},0 L${-W + 80},${-D} L${W - 80},${-D} L${W},0 L${W - 80},${D} L${-W + 80},${D}Z`} fill={mix("#3E7FA0", "#0E1838", night)} opacity={0.35 + night * 0.4} />
      {/* yansıma şeritleri */}
      {Array.from({ length: 22 }, (_, i) => <rect key={i} x={((i * 83 + t * 18) % (2 * W - 200)) - W + 100} y={-D + 20 + (i % 9) * 34} width={30 + (i % 4) * 12} height={2.4} fill="#FFFFFF" opacity={0.3 + 0.25 * Math.sin(t * 2.4 + i)} />)}
      {/* halkalar */}
      {[0, 1, 2, 3].map((i) => { const ph = (t * 0.6 + i * 0.25) % 1; const rr = 40 + ph * 380 * (0.4 + ripple); return <ellipse key={i} cx={sx} cy={10} rx={rr} ry={rr * 0.22} fill="none" stroke="#FFFFFF" strokeWidth={2.4} opacity={(1 - ph) * (0.25 + ripple * 0.6)} />; })}
      {/* sonbahar yaprakları */}
      {leaves > 0 && Array.from({ length: 9 }, (_, i) => <Yaprak key={i} x={-W + 160 + rnd(i) * (2 * W - 320) + Math.sin(t * 0.5 + i) * 12} y={-D + 40 + rnd(i + 4) * (2 * D - 80) + Math.cos(t * 0.6 + i) * 4} r={rnd(i) * 360 + t * 6} c={["#C9762E", "#B8452F", "#D9A040"][i % 3]} s={0.9} />)}
      {/* sıçrama */}
      {splash > 0 && splash < 1 && (
        <g transform={`translate(${sx},0)`}>
          <ellipse cx={0} cy={6} rx={60 + splash * 120} ry={(60 + splash * 120) * 0.25} fill="#FFFFFF" opacity={0.7 * Math.sin(splash * Math.PI)} />
          {Array.from({ length: 16 }, (_, k) => { const ang = -Math.PI * (0.1 + 0.8 * rnd(k)); const v = 420 + rnd(k + 9) * 260; const px = Math.cos(ang) * v * splash * 0.8; const py = Math.sin(ang) * v * splash + 380 * splash * splash; return <ellipse key={k} cx={px} cy={py} rx={12} ry={18} fill="#E6F4FA" stroke="#6FA8C4" strokeWidth={2} opacity={Math.min(1, 2.2 * Math.sin(splash * Math.PI))} />; })}
          <path d={`M-90,0 Q-50,${-260 * Math.sin(splash * Math.PI)} 0,${-360 * Math.sin(splash * Math.PI)} Q50,${-260 * Math.sin(splash * Math.PI)} 90,0Z`} fill="#DCEFF7" opacity={0.95 * Math.sin(splash * Math.PI)} stroke="#6FA8C4" strokeWidth={3} />
        </g>
      )}
      {/* fıskiye çanağı (orta arka) */}
      <g transform={`translate(${-W * 0.55},${-D * 0.35})`}><ellipse rx={50} ry={12} fill={rim} stroke={LN} strokeWidth={2} /><path d="M-8,0 L-6,-60 L6,-60 L8,0Z" fill={rim} stroke={LN} strokeWidth={2} /><path d="M0,-60 L0,-110" stroke="#E6F4FA" strokeWidth={5} strokeDasharray="8 8" strokeDashoffset={-t * 80} /></g>
    </g>
  );
};

// ───────── 3) Alnında izli bebek ─────────
export const IzliBebek: React.FC<{ t?: number; s?: number; cry?: number; wet?: number; mark?: number }> = ({ t = 0, s = 1, cry = 0, wet = 0, mark = 1 }) => (
  <g transform={`scale(${s})`}>
    <Bebek t={t} s={1} cry={cry} />
    <g transform="rotate(-8)">
      {mark > 0 && <path d="M-70,-26 q12,-7 26,-2" stroke="#B8323A" strokeWidth={5.5} fill="none" strokeLinecap="round" opacity={mark} />}
      {wet > 0 && Array.from({ length: 5 }, (_, i) => { const ph = (t * 0.9 + i * 0.2) % 1; return <ellipse key={i} cx={-70 + i * 30} cy={30 + ph * 60} rx={3} ry={5} fill="#BFE3F2" opacity={wet * (1 - ph)} />; })}
      {wet > 0 && <path d="M-80,-24 q-6,10 -2,22 M-30,-36 q4,8 0,16" stroke="#7FB8D0" strokeWidth={2} fill="none" opacity={wet * 0.8} />}
    </g>
  </g>
);

// ───────── 4) Kırım bozkırı + köy + atlılar ─────────
export const Atli: React.FC<{ x: number; y: number; s?: number; t: number; seed?: number; c?: string }> = ({ x, y, s = 1, t, seed = 0, c = "#2A1E16" }) => {
  const g = t * 9 + seed;
  const leg = (ph: number, dx: number) => <path d={`M${dx},-70 L${dx + Math.sin(g + ph) * 26},-10 L${dx + Math.sin(g + ph) * 30 + 8},0`} stroke={c} strokeWidth={9} fill="none" strokeLinecap="round" />;
  return (
    <g transform={`translate(${x},${y + Math.abs(Math.sin(g)) * -10}) scale(${s})`}>
      {leg(0, -60)}{leg(1.6, -40)}{leg(3.1, 50)}{leg(4.7, 70)}
      <path d="M-90,-80 Q-80,-120 0,-118 Q70,-120 96,-100 L132,-150 Q150,-160 158,-140 L120,-80 Q80,-60 0,-62 Q-70,-60 -90,-80Z" fill={c} />
      <path d="M-90,-90 q-40,-10 -56,30" stroke={c} strokeWidth={10} fill="none" />
      {/* binici */}
      <path d="M-6,-120 L-14,-196 L24,-196 L20,-120Z" fill={mix(c, "#6A3A2A", 0.4)} />
      <circle cx={6} cy={-214} r={20} fill={mix(c, "#8A6A50", 0.4)} />
      <path d="M-16,-226 Q6,-252 28,-226Z" fill={mix(c, "#4A2A1A", 0.2)} />
      <path d="M20,-180 L80,-230" stroke={c} strokeWidth={6} />
    </g>
  );
};
export const Bozkir: React.FC<{ t: number; pan?: number; raid?: number; dusk?: number }> = ({ t, pan = 0, raid = 0, dusk = 0 }) => {
  const FL = 760;
  return (
    <g>
      <rect width={1920} height={FL} fill="url(#pDaySky)" />
      <rect width={1920} height={FL} fill="#E8A070" opacity={dusk * 0.5} />
      {[0, 1, 2].map((i) => <ellipse key={i} cx={((i * 640 + t * 10 - pan * 0.1) % 2300) - 200} cy={150 + i * 40} rx={160} ry={30} fill="#FFFFFF" opacity={0.8} />)}
      <path d={`M0,${FL - 60} Q480,${FL - 110} 960,${FL - 70} T1920,${FL - 80} L1920,${FL} L0,${FL}Z`} fill={mix("#9AA87A", "#7A6A5A", dusk)} />
      <rect y={FL} width={1920} height={1080 - FL} fill={mix("#B8A86A", "#8A7A5A", dusk)} />
      {Array.from({ length: 70 }, (_, i) => <path key={i} d={`M${((i * 53 - pan * 0.8) % 2000 + 2000) % 2000 - 40},${FL + 20 + (i % 12) * 26} q4,-18 2,-30 M${((i * 53 - pan * 0.8) % 2000 + 2000) % 2000 - 34},${FL + 20 + (i % 12) * 26} q6,-14 12,-22`} stroke="#8A7A40" strokeWidth={2.4} fill="none" opacity={0.7} />)}
      {/* köy: ahşap evler */}
      <g transform={`translate(${-pan * 0.5},0)`}>
        {[260, 520, 760, 1300, 1560].map((hx, i) => (
          <g key={hx} transform={`translate(${hx},${FL + 10})`}>
            <rect x={-90} y={-130} width={180} height={130} fill="#8A6040" stroke={LN} strokeWidth={4} />
            {Array.from({ length: 6 }, (_, k) => <path key={k} d={`M-90,${-120 + k * 22} H90`} stroke="#6A4A2E" strokeWidth={2} />)}
            <path d="M-110,-130 L0,-210 L110,-130Z" fill="#C9A35A" stroke={LN} strokeWidth={4} />
            <rect x={-24} y={-70} width={48} height={70} fill="#3A2A1E" />
            {raid > 0.3 && i % 2 === 0 && <g opacity={raid}>{Array.from({ length: 4 }, (_, s) => { const life = (t * 0.4 + s / 4) % 1; return <circle key={s} cx={life * 60} cy={-220 - life * 260} r={24 + life * 70} fill="#5A5048" opacity={(1 - life) * 0.5} filter="url(#pBlur16)" />; })}</g>}
          </g>
        ))}
      </g>
      {raid > 0 && Array.from({ length: 5 }, (_, i) => <Atli key={i} x={((i * 300 + t * 520 * raid) % 2600) - 400} y={FL + 160 + (i % 2) * 60} s={0.9 + (i % 2) * 0.15} t={t} seed={i} />)}
    </g>
  );
};

// ───────── 5) Deniz (gündüz / gece / fırtına) ─────────
export const Deniz: React.FC<{ t: number; night?: number; storm?: number; pan?: number; island?: "none" | "rodos" | "girit" | "malta"; horizon?: number }> = ({ t, night = 0, storm = 0, pan = 0, island = "none", horizon = 560 }) => {
  const HZ = horizon;
  return (
    <g>
      <rect width={1920} height={1080} fill={night > 0.5 ? "url(#pNightSky)" : "url(#pDaySky)"} />
      {night > 0.5 && <Stars t={t} n={50} y1={HZ - 80} />}
      {storm > 0 && <rect width={1920} height={HZ} fill="#3A4250" opacity={storm * 0.75} />}
      {storm > 0 && [0, 1, 2, 3].map((i) => <ellipse key={i} cx={((i * 560 + t * 60) % 2400) - 200} cy={90 + (i % 2) * 70} rx={340} ry={70} fill="#2A303A" opacity={storm * 0.8} />)}
      {storm > 0.6 && Math.sin(t * 3.1) > 0.97 && <rect width={1920} height={1080} fill="#FFFFFF" opacity={0.35} />}
      {island === "rodos" && <path d={`M${1100 - pan * 0.1},${HZ} q140,-90 300,-30 q110,-50 240,10 L${1800 - pan * 0.1},${HZ}Z`} fill={mix("#8AA0A8", "#1A2440", night)} />}
      {island === "girit" && <path d={`M${200 - pan * 0.1},${HZ} q200,-140 420,-60 q180,-110 420,-30 q160,-70 300,20 L${1500 - pan * 0.1},${HZ}Z`} fill={mix("#8A9A88", "#1A2440", night)} />}
      <rect y={HZ} width={1920} height={1080 - HZ} fill={mix(mix("#3E7FA0", "#101A38", night), "#2A3A48", storm)} />
      <rect y={HZ} width={1920} height={1080 - HZ} fill="url(#pShadeL)" opacity={0.25} />
      {Array.from({ length: 60 }, (_, i) => { const row = i % 12; const y = HZ + 16 + row * row * 3.4 + row * 8; const sc = 0.5 + row * 0.12; const x = ((i * 61 - t * (30 + storm * 60) * sc - pan * sc) % 2200 + 2200) % 2200 - 140; return <path key={i} d={`M${x},${y} q${20 * sc},${-8 * sc - storm * 10} ${40 * sc},0`} stroke="#FFFFFF" strokeWidth={2 + sc} fill="none" opacity={0.25 + storm * 0.3} />; })}
    </g>
  );
};

// ───────── 6) Osmanlı kalyonu ─────────
export const Kalyon: React.FC<{ x: number; y: number; s?: number; t: number; flag?: boolean; sails?: number; tilt?: number; dark?: number; lamp?: number }> = ({ x, y, s = 1, t, flag = true, sails = 1, tilt = 0, dark = 0, lamp = 0 }) => {
  const bob = Math.sin(t * 1.3) * 6;
  const hull = mix("#6A4428", "#1E1610", dark);
  const sail = mix("#F2E8D2", "#4A4A50", dark * 0.8);
  return (
    <g transform={`translate(${x},${y + bob}) rotate(${tilt + Math.sin(t * 1.1) * 1.4}) scale(${s})`}>
      {/* gövde */}
      <path d="M-420,-40 L-440,-150 L-330,-130 L330,-110 L430,-190 L440,-120 L360,40 Q0,90 -360,40Z" fill={hull} stroke={LN} strokeWidth={5} />
      <path d="M-400,-70 L380,-60" stroke={mix("#C9A35A", "#3A3020", dark)} strokeWidth={10} />
      <path d="M-390,-20 Q0,10 370,-10" stroke={mix("#4A2E1A", "#140E0A", dark)} strokeWidth={6} fill="none" />
      {Array.from({ length: 9 }, (_, k) => <rect key={k} x={-300 + k * 72} y={-50} width={22} height={18} fill={lamp > 0 && k % 3 === 0 ? "#FFD089" : "#1A120C"} stroke={LN} strokeWidth={2} />)}
      {/* kıç köşkü */}
      <rect x={-440} y={-230} width={120} height={90} fill={mix("#8A5A34", "#241A12", dark)} stroke={LN} strokeWidth={4} />
      {[0, 1].map((k) => <rect key={k} x={-424 + k * 52} y={-210} width={36} height={40} fill={lamp > 0 ? "#FFD089" : "#2A1E14"} stroke={LN} strokeWidth={2} />)}
      {/* direkler + yelkenler */}
      {[-200, 40, 260].map((mx, i) => (
        <g key={mx}>
          <rect x={mx - 7} y={-620 + i * 40} width={14} height={500 - i * 40} fill={mix("#5A3A22", "#1A120C", dark)} />
          {[0, 1].map((j) => { const sw = 110 - j * 20 - i * 10; const yy = -560 + i * 40 + j * 180; const bil = Math.sin(t * 1.6 + i + j) * 6 * sails; return <path key={j} d={`M${mx - sw},${yy} Q${mx},${yy - 14} ${mx + sw},${yy} L${mx + sw + bil},${yy + 150 * sails} Q${mx + bil},${yy + 170 * sails + 20} ${mx - sw + bil},${yy + 150 * sails}Z`} fill={sail} stroke={LN} strokeWidth={3} />; })}
        </g>
      ))}
      <path d="M430,-190 L620,-300" stroke={mix("#5A3A22", "#1A120C", dark)} strokeWidth={10} />
      {/* halatlar */}
      {[-200, 40, 260].map((mx, i) => <path key={i} d={`M${mx},${-600 + i * 40} L${mx + 200},-110 M${mx},${-600 + i * 40} L${mx - 200},-120`} stroke="#2A1E14" strokeWidth={1.6} opacity={0.6} />)}
      {flag && <g transform="translate(-200,-660)"><Bayrak x={0} y={0} t={t} s={0.55} pole={60} /></g>}
    </g>
  );
};

// ───────── 7) Malta kadırgası (kürekli, kırmızı-beyaz haçlı sancak) ─────────
export const Kadirga: React.FC<{ x: number; y: number; s?: number; t: number; dark?: number; dir?: 1 | -1 }> = ({ x, y, s = 1, t, dark = 0, dir = 1 }) => {
  const bob = Math.sin(t * 1.6 + x) * 5;
  const hull = mix("#3A2A22", "#140E0A", dark);
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s * dir},${s})`}>
      {/* kürekler */}
      {Array.from({ length: 14 }, (_, k) => { const ph = Math.sin(t * 4 + k * 0.15); return <path key={k} d={`M${-330 + k * 46},-10 L${-350 + k * 46 + ph * 30},${90 + Math.abs(ph) * 10}`} stroke={mix("#8A6A44", "#2A1E14", dark)} strokeWidth={6} />; })}
      <path d="M-420,-30 L380,-30 L520,-70 L400,20 L-380,20 Q-430,0 -420,-30Z" fill={hull} stroke={LN} strokeWidth={4} />
      <path d="M-400,-24 L380,-24" stroke={mix("#B8452F", "#3A1A14", dark)} strokeWidth={8} />
      {/* latin yelken */}
      <rect x={-6} y={-380} width={12} height={350} fill={mix("#5A3A22", "#1A120C", dark)} />
      <path d={`M-260,-60 L120,-420 Q${40 + Math.sin(t * 1.5) * 10},-200 -260,-60Z`} fill={mix("#E9DCC2", "#4A4448", dark * 0.8)} stroke={LN} strokeWidth={3} />
      {/* sancak: kırmızı zemin + beyaz haç */}
      <g transform={`translate(-380,-140)`}>
        <rect x={0} y={0} width={6} height={110} fill="#2A1E14" />
        <g transform={`skewY(${Math.sin(t * 3) * 4})`}><rect x={6} y={0} width={100} height={64} fill="#C0262A" stroke={LN} strokeWidth={2} /><rect x={48} y={0} width={16} height={64} fill="#FFFFFF" /><rect x={6} y={24} width={100} height={16} fill="#FFFFFF" /></g>
      </g>
    </g>
  );
};

// ───────── 8) Top ateşi + duman ─────────
export const TopAtes: React.FC<{ x: number; y: number; t: number; at: number; s?: number }> = ({ x, y, t, at, s = 1 }) => {
  const k = t - at;
  if (k < 0 || k > 3) return null;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {k < 0.25 && <g><circle r={90 * (1 - k * 2)} fill="#FFE08A" opacity={0.9} /><circle r={46} fill="#FFFFFF" opacity={0.9} /></g>}
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={k * 60 + i * 24} cy={-k * 40 - i * 10} r={30 + k * 50 + i * 6} fill="#8A8A88" opacity={(1 - k / 3) * 0.5} filter="url(#pBlur16)" />)}
    </g>
  );
};

// ───────── 9) Akdeniz haritası (parşömen) ─────────
const YER: Record<string, [number, number]> = { istanbul: [1420, 300], rodos: [1450, 640], girit: [1180, 720], malta: [560, 700], venedik: [620, 230], misir: [1560, 900] };
export const AkdenizHarita: React.FC<{ t: number; route?: number; show?: string[]; hl?: string; girit?: number }> = ({ t, route = 0, show = ["istanbul", "rodos", "girit", "malta"], hl = "", girit = 0 }) => {
  const path = [YER.istanbul, [1440, 470], YER.rodos, [1100, 680], YER.malta];
  const d = `M${path.map((p) => p.join(",")).join(" L")}`;
  return (
    <g>
      <rect width={1920} height={1080} fill="#E9DCC2" />
      <rect width={1920} height={1080} fill="url(#hDamask)" opacity={0.25} />
      <rect x={60} y={60} width={1800} height={960} fill="#BFD3D6" stroke={LN} strokeWidth={5} />
      {/* kara parçaları (kaba) */}
      <path d="M60,60 L1860,60 L1860,260 Q1600,250 1500,330 Q1380,360 1300,300 Q1100,260 980,330 Q860,300 760,200 Q680,330 760,470 Q700,520 640,420 Q560,300 480,320 Q300,330 200,420 L60,430Z" fill="#E2CFA2" stroke={LN} strokeWidth={4} />
      <path d="M1500,330 Q1560,420 1520,520 Q1620,560 1860,520 L1860,260Z" fill="#E2CFA2" stroke={LN} strokeWidth={4} />
      <path d="M60,860 Q400,800 700,840 Q1000,880 1300,860 Q1600,840 1860,880 L1860,1020 L60,1020Z" fill="#E2CFA2" stroke={LN} strokeWidth={4} />
      {/* adalar */}
      <path d="M1050,720 q60,-26 130,-10 q70,-10 120,10 q-50,26 -130,16 q-70,10 -120,-16Z" fill={girit > 0 ? mix("#E2CFA2", "#C0262A", girit) : "#E2CFA2"} stroke={LN} strokeWidth={3} />
      <ellipse cx={1450} cy={640} rx={26} ry={16} fill="#E2CFA2" stroke={LN} strokeWidth={3} />
      <ellipse cx={560} cy={700} rx={16} ry={10} fill="#E2CFA2" stroke={LN} strokeWidth={3} />
      {/* dalgacıklar */}
      {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${200 + rnd(i) * 1500},${480 + rnd(i + 3) * 340} q12,-6 24,0 q12,6 24,0`} stroke="#7FA0A8" strokeWidth={2} fill="none" />)}
      {/* rota */}
      {route > 0 && <path d={d} stroke={H.red} strokeWidth={7} fill="none" strokeDasharray="22 14" pathLength={1000} strokeDashoffset={0} style={{ strokeDasharray: `${route * 1000} 1000` }} />}
      {route > 0 && (() => { const n = path.length - 1; const f = Math.min(route * n, n - 0.0001); const i = Math.floor(f); const k = f - i; const px = lerp(path[i][0], path[i + 1][0], k), py = lerp(path[i][1], path[i + 1][1], k); return <g transform={`translate(${px},${py})`}><path d="M-18,6 L18,6 L12,16 L-12,16Z" fill="#5A3A22" /><path d="M0,6 L0,-26 L16,0Z" fill="#F2E8D2" stroke={LN} strokeWidth={1.6} /></g>; })()}
      {/* yer adları */}
      {Object.entries(YER).filter(([k]) => show.includes(k)).map(([k, [x, y]]) => (
        <g key={k} transform={`translate(${x},${y})`}>
          <circle r={hl === k ? 16 + Math.sin(t * 5) * 3 : 11} fill={hl === k ? H.red : LN} />
          <text x={0} y={-26} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={hl === k ? 46 : 38} fill={LN}>{({ istanbul: "İSTANBUL", rodos: "RODOS", girit: "GİRİT", malta: "MALTA", venedik: "VENEDİK", misir: "MISIR" } as Record<string, string>)[k]}</text>
        </g>
      ))}
      {/* rüzgâr gülü */}
      <g transform="translate(260,620)" opacity={0.7}><circle r={70} fill="none" stroke={LN} strokeWidth={3} /><path d="M0,-90 L14,0 L0,90 L-14,0Z M-90,0 L0,14 L90,0 L0,-14Z" fill={LN} /></g>
    </g>
  );
};

// ───────── 10) Samur kaplı oda ─────────
export const Samur: React.FC<{ s?: number; c?: string }> = ({ s = 1, c = "#5A3A26" }) => (
  <g transform={`scale(${s})`}>
    <path d="M-120,-30 Q-60,-50 0,-40 Q60,-50 120,-26 Q140,0 120,24 Q60,46 0,36 Q-60,46 -120,26 Q-150,0 -120,-30Z" fill={c} stroke={LN} strokeWidth={3} />
    <path d="M-120,-30 Q-60,-50 0,-40 Q60,-50 120,-26 Q140,0 120,24 Q60,46 0,36 Q-60,46 -120,26 Q-150,0 -120,-30Z" fill="url(#pFurTex)" opacity={0.7} />
    <path d="M120,-6 q60,-4 90,20 q-40,10 -90,-4Z" fill={mix(c, "#000000", 0.25)} stroke={LN} strokeWidth={2} />
    <circle cx={-110} cy={-8} r={4} fill="#1A120C" />
  </g>
);
export const SamurOda: React.FC<{ t: number; k?: number; night?: number }> = ({ t, k = 1, night = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={mix("#3A2418", "#1A120C", night)} />
    {/* duvar panelleri: kürk */}
    {Array.from({ length: 9 }, (_, i) => (
      <g key={i} opacity={ease(k * 1.4 - i * 0.05)}>
        <rect x={20 + i * 212} y={80} width={196} height={660} rx={14} fill={i % 2 ? "#5A3A26" : "#6A4630"} stroke={LN} strokeWidth={3} />
        <rect x={20 + i * 212} y={80} width={196} height={660} rx={14} fill="url(#pFurTex)" opacity={0.85} />
        {Array.from({ length: 16 }, (_, j) => <path key={j} d={`M${40 + i * 212 + (j % 4) * 46},${110 + Math.floor(j / 4) * 160} q6,${18 + Math.sin(t + j) * 2} 0,36`} stroke="#8A6448" strokeWidth={2} fill="none" opacity={0.6} />)}
      </g>
    ))}
    <rect x={0} y={60} width={1920} height={26} fill="#C9A35A" stroke={LN} strokeWidth={3} />
    {/* sedir + kürk minderler */}
    <rect x={80} y={760} width={1760} height={120} fill="#7A2E2A" stroke={LN} strokeWidth={4} />
    {Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${220 + i * 240},740)`}><Samur s={0.95} c={i % 2 ? "#6A4630" : "#4E3220"} /></g>)}
    <rect y={880} width={1920} height={200} fill="#6A2620" />
    <rect y={880} width={1920} height={200} fill="url(#hDamask)" opacity={0.2} />
    {/* amber buhurdanı dumanı */}
    <g transform="translate(1680,840)"><path d="M-30,0 L30,0 L20,40 L-20,40Z" fill={P.gold} stroke={LN} strokeWidth={2} />{Array.from({ length: 5 }, (_, s) => { const life = (t * 0.25 + s / 5) % 1; return <path key={s} d={`M0,0 q${Math.sin(life * 6 + s) * 30},${-life * 120} 0,${-life * 260}`} stroke="#E9DCC2" strokeWidth={6 - life * 4} fill="none" opacity={(1 - life) * 0.4} />; })}</g>
    {night > 0 && <rect width={1920} height={1080} fill="#0E1024" opacity={night * 0.45} />}
  </g>
);

// ───────── 11) Çanakkale Boğazı + iki kale ─────────
const Kale: React.FC<{ x: number; y: number; s?: number; k?: number; t: number; flip?: boolean }> = ({ x, y, s = 1, k = 1, t, flip = false }) => {
  const h = ease(k);
  return (
    <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
      {/* iskele */}
      {k < 1 && Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-220 + i * 90},0 L${-220 + i * 90},-260 M${-220 + i * 90},-130 L${-130 + i * 90},-130`} stroke="#8A6A44" strokeWidth={5} opacity={1 - h * 0.6} />)}
      <g transform={`translate(0,${(1 - h) * 200})`}>
        <path d="M-260,0 L-260,-160 L260,-160 L260,0Z" fill="#D9CDB4" stroke={LN} strokeWidth={4} />
        {Array.from({ length: 13 }, (_, i) => <rect key={i} x={-256 + i * 40} y={-186} width={24} height={26} fill="#D9CDB4" stroke={LN} strokeWidth={2.4} />)}
        {[-200, 200].map((tx) => <g key={tx}><rect x={tx - 50} y={-250} width={100} height={250} fill="#CFC2A6" stroke={LN} strokeWidth={4} /><path d={`M${tx - 60},-250 L${tx},-320 L${tx + 60},-250Z`} fill="#8A5A3A" stroke={LN} strokeWidth={3} /></g>)}
        {[-80, 0, 80].map((cx) => <circle key={cx} cx={cx} cy={-80} r={14} fill="#2A1E14" />)}
        {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-250 + i * 64},-60 h40 M${-230 + i * 64},-110 h40`} stroke="#B8AC92" strokeWidth={2} />)}
        {h > 0.9 && <Bayrak x={0} y={-160} t={t} s={0.5} pole={90} />}
      </g>
      <rect x={-260} y={-4} width={520} height={(1 - h) * 200 + 4} fill="none" />
    </g>
  );
};
export const Bogaz: React.FC<{ t: number; build?: number; fleet?: number; night?: number; pan?: number }> = ({ t, build = 1, fleet = 0, night = 0, pan = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={night > 0.5 ? "url(#pNightSky)" : "url(#pDaySky)"} />
    {night > 0.5 && <Stars t={t} n={40} y1={380} />}
    {/* uzak kıyılar */}
    <path d={`M0,470 Q400,420 760,470 L760,520 L0,520Z`} fill={mix("#8A9A78", "#1A2440", night)} />
    <path d={`M1160,470 Q1520,420 1920,460 L1920,520 L1160,520Z`} fill={mix("#8A9A78", "#1A2440", night)} />
    <rect y={500} width={1920} height={580} fill={mix("#3E7FA0", "#101A38", night)} />
    {Array.from({ length: 40 }, (_, i) => <rect key={i} x={((i * 97 + t * 30) % 2100) - 90} y={540 + (i % 10) * 50} width={30 + (i % 4) * 12} height={2.6} fill="#FFFFFF" opacity={0.3} />)}
    {/* yakın kıyılar: sol (Avrupa) + sağ (Asya) */}
    <path d={`M0,560 Q300,540 560,620 Q620,760 480,1080 L0,1080Z`} fill={mix("#9A8A5A", "#2A2A30", night)} stroke={LN} strokeWidth={4} />
    <path d={`M1920,560 Q1620,540 1360,620 Q1300,760 1440,1080 L1920,1080Z`} fill={mix("#9A8A5A", "#2A2A30", night)} stroke={LN} strokeWidth={4} />
    <Kale x={300 - pan * 0.2} y={640} s={0.8} k={build} t={t} />
    <Kale x={1620 - pan * 0.2} y={640} s={0.8} k={build} t={t} flip />
    <text x={300} y={1010} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={40} fill={mix(LN, "#E9DCC2", night)} opacity={ease(build * 1.2 - 0.2)}>SEDDÜLBAHİR</text>
    <text x={1620} y={1010} textAnchor="middle" fontFamily="Georgia, serif" fontWeight={700} fontSize={40} fill={mix(LN, "#E9DCC2", night)} opacity={ease(build * 1.2 - 0.2)}>KUMKALE</text>
    {fleet > 0 && Array.from({ length: 4 }, (_, i) => <g key={i} opacity={fleet}><Kalyon x={760 + i * 140} y={560 + (i % 2) * 30} s={0.16} t={t + i} flag={false} dark={night * 0.6} /></g>)}
    {fleet > 0 && Array.from({ length: 4 }, (_, i) => <g key={i} transform={`translate(${790 + i * 140},440)`} opacity={fleet}><rect x={0} y={0} width={3} height={30} fill="#2A1E14" /><rect x={3} y={0} width={26} height={16} fill="#B8323A" /><circle cx={16} cy={8} r={4} fill={P.gold} /></g>)}
  </g>
);

// ───────── 12) Yeni Cami + Mısır Çarşısı (Eminönü) ─────────
export const YeniCami: React.FC<{ t: number; k?: number; night?: number; pan?: number }> = ({ t, k = 1, night = 0, pan = 0 }) => {
  const done = ease(k);
  const stone = mix("#D9D0BE", "#5A6078", night * 0.7);
  return (
    <g>
      <rect width={1920} height={1080} fill={night > 0.5 ? "url(#pNightSky)" : "url(#pDaySky)"} />
      {night > 0.5 && <Stars t={t} n={40} y1={360} />}
      <g transform={`translate(${-pan * 0.4},0)`}>
        {/* Mısır Çarşısı (sol, L) */}
        <g transform="translate(240,760)" opacity={ease(k * 1.5 - 0.3)}>
          <rect x={-200} y={-120} width={400} height={120} fill={stone} stroke={LN} strokeWidth={4} />
          {Array.from({ length: 6 }, (_, i) => <g key={i}><path d={`M${-180 + i * 64},-120 a32,24 0 0 1 64,0Z`} fill={mix("#8A96A8", "#3A4258", night)} stroke={LN} strokeWidth={2} /><path d={`M${-170 + i * 64},0 L${-170 + i * 64},-60 A22,22 0 0 1 ${-126 + i * 64},-60 L${-126 + i * 64},0Z`} fill={night > 0.5 ? "#FFD089" : "#6A4A2E"} /></g>)}
        </g>
        {/* cami */}
        <g transform="translate(1040,780)">
          <rect x={-420} y={-200} width={840} height={200} fill={stone} stroke={LN} strokeWidth={4} />
          {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-380 + i * 92},-20 L${-380 + i * 92},-130 A30,30 0 0 1 ${-320 + i * 92},-130 L${-320 + i * 92},-20Z`} fill={night > 0.5 ? "#FFD089" : "#4A5878"} stroke={LN} strokeWidth={2} />)}
          {/* yarım kubbeler + ana kubbe (yapımla yükselir) */}
          <g opacity={0.25 + done * 0.75}>
            {[-260, 260].map((hx) => <path key={hx} d={`M${hx - 140},-200 a140,90 0 0 1 280,0Z`} fill={mix("#8A96A8", "#3A4258", night)} stroke={LN} strokeWidth={4} />)}
            <path d={`M-220,-260 L-220,-200 L220,-200 L220,-260Z`} fill={stone} stroke={LN} strokeWidth={4} />
            <path d={`M-220,-260 a220,${160 * done + 10} 0 0 1 440,0Z`} fill={mix("#7E8FA6", "#2E3650", night)} stroke={LN} strokeWidth={5} />
            {done > 0.95 && <><path d="M0,-430 L0,-470" stroke={P.gold} strokeWidth={6} /><circle cx={0} cy={-476} r={8} fill={P.gold} /></>}
          </g>
          {/* minareler */}
          {[-470, 470].map((mx) => <Minare key={mx} x={mx} y={0} h={180 + 360 * done} c={stone} w={22} />)}
          {/* iskele */}
          {k < 0.98 && Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${-400 + i * 88},0 L${-400 + i * 88},-440 M${-400 + i * 88},${-120 - (i % 3) * 100} h88`} stroke="#8A6A44" strokeWidth={5} opacity={1 - done * 0.8} />)}
        </g>
      </g>
      {/* rıhtım + deniz */}
      <rect y={780} width={1920} height={40} fill={mix("#BFB4A0", "#3A3E4A", night)} stroke={LN} strokeWidth={3} />
      <rect y={820} width={1920} height={260} fill={mix("#3E7FA0", "#101A38", night)} />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={((i * 97 + t * 30) % 2100) - 90} y={840 + (i % 8) * 28} width={30 + (i % 4) * 12} height={2.6} fill={night > 0.5 ? "#FFD8A0" : "#FFFFFF"} opacity={0.3} />)}
      <g transform={`translate(${(t * 30) % 2400 - 300},${880 + Math.sin(t * 2) * 3})`}><path d="M-80,0 Q0,22 80,0 L66,-10 L-66,-10Z" fill="#5E3B20" /><path d="M0,-10 L0,-90 L40,-20Z" fill="#F7F1E6" /></g>
    </g>
  );
};

// ───────── 13) Malta limanı (taş tabyalar) ─────────
export const MaltaLiman: React.FC<{ t: number; dusk?: number; galleys?: number }> = ({ t, dusk = 0, galleys = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#pDaySky)" />
    <rect width={1920} height={600} fill="#E8A070" opacity={dusk * 0.5} />
    {/* tabyalar */}
    <path d="M0,620 L0,360 L160,330 L260,400 L420,380 L520,460 L700,440 L760,620Z" fill="#D9C08A" stroke={LN} strokeWidth={4} />
    <path d="M1920,620 L1920,340 L1720,320 L1640,400 L1460,390 L1380,470 L1220,460 L1160,620Z" fill="#D9C08A" stroke={LN} strokeWidth={4} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 60},${380 + (i % 3) * 30} h40 M${1200 + i * 60},${400 + (i % 3) * 25} h40`} stroke="#B8A070" strokeWidth={2} />)}
    {/* kubbeli kilise (uzak) */}
    <g transform="translate(330,330)"><rect x={-50} y={-60} width={100} height={60} fill="#E2CFA2" stroke={LN} strokeWidth={3} /><path d="M-40,-60 a40,40 0 0 1 80,0Z" fill="#C9B88A" stroke={LN} strokeWidth={3} /><path d="M0,-100 v-30 M-10,-118 h20" stroke={LN} strokeWidth={4} /></g>
    {/* sancak burçta */}
    <g transform="translate(1740,320)"><rect x={0} y={-120} width={6} height={120} fill="#2A1E14" /><g transform={`skewY(${Math.sin(t * 3) * 4})`}><rect x={6} y={-120} width={100} height={64} fill="#C0262A" stroke={LN} strokeWidth={2} /><rect x={48} y={-120} width={16} height={64} fill="#FFFFFF" /><rect x={6} y={-96} width={100} height={16} fill="#FFFFFF" /></g></g>
    <rect y={600} width={1920} height={480} fill="#3E7FA0" />
    {Array.from({ length: 40 }, (_, i) => <rect key={i} x={((i * 97 + t * 25) % 2100) - 90} y={620 + (i % 10) * 44} width={30 + (i % 4) * 12} height={2.6} fill="#FFFFFF" opacity={0.3} />)}
    {galleys > 0 && <><Kadirga x={700} y={760} s={0.5} t={t} /><Kadirga x={1240} y={840} s={0.42} t={t + 1} dir={-1} /></>}
  </g>
);

export const _turhanUnused = { H };
