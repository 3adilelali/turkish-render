import React from "react";
import { H } from "./Harem";
import { P } from "./HaremPro";

// Kanal 1 · k3r-16 "Kuma" kiti (2026-11-13): geç Osmanlı İstanbul'u (1916-1919).
// Cibali sokağı (cumbalı ahşap evler + Haliç + Süleymaniye + tütün fabrikası bacası), orta halli ev odası (gaz lambası, mangal, sedir),
// Cibali Tütün Fabrikası (kadın işçi masaları), mermer hamam (göbek taşı, fil gözü ışıkları), yangın katmanı ve küçük nesneler.
// Kimlik aynı: krem/sıcak renkler, İznik mavisi vurgu, kalın kahve kontur, ışık-gölge katmanları.

const LN = "#4A3524";
const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const mix = (c1: string, c2: string, k: number) => {
  const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = p(c1), b = p(c2);
  return `#${a.map((v, i) => Math.round(lerp(v, b[i], Math.max(0, Math.min(1, k)))).toString(16).padStart(2, "0")).join("")}`;
};
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ───────── alev / duman yardımcıları ─────────
export const Alev: React.FC<{ x: number; y: number; s?: number; t: number; seed?: number }> = ({ x, y, s = 1, t, seed = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[0, 1, 2, 3].map((i) => {
      const f = Math.sin(t * (9 + i) + seed + i * 1.7) * 14;
      const h = 150 + 40 * Math.sin(t * 6 + seed * 2 + i);
      const dx = (i - 1.5) * 34;
      return <path key={i} d={`M${dx - 40},0 C${dx - 56},${-h * 0.4} ${dx - 10 + f},${-h * 0.7} ${dx + f * 0.6},${-h} C${dx + 24},${-h * 0.62} ${dx + 40},${-h * 0.35} ${dx + 40},0Z`} fill={i % 2 ? "#FFB43A" : "#F0642A"} opacity={0.92} />;
    })}
    <path d={`M-30,0 C-36,-50 -6,-70 ${Math.sin(t * 11 + seed) * 6},-104 C14,-70 34,-50 30,0Z`} fill="#FFE7A0" />
    <ellipse cx={0} cy={-60} rx={170} ry={130} fill="url(#pBloom)" opacity={0.55} />
  </g>
);

export const Duman: React.FC<{ x: number; y: number; t: number; s?: number; dark?: number; seed?: number }> = ({ x, y, t, s = 1, dark = 0.7, seed = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {Array.from({ length: 7 }, (_, i) => {
      const life = ((t * 0.18 + i / 7 + seed * 0.13) % 1);
      const cy = -life * 900, cx = Math.sin(life * 5 + i + seed) * 60 + life * 120;
      const r = 70 + life * 220;
      return <circle key={i} cx={cx} cy={cy} r={r} fill={mix("#6A5A50", "#1C1612", dark)} opacity={(1 - life) * 0.55} filter="url(#pBlur16)" />;
    })}
  </g>
);

export const Kivilcim: React.FC<{ t: number; n?: number; op?: number }> = ({ t, n = 40, op = 1 }) => (
  <g opacity={op}>
    {Array.from({ length: n }, (_, i) => {
      const life = (t * (0.25 + rnd(i) * 0.35) + rnd(i + 9)) % 1;
      const x = rnd(i + 3) * 1920 + Math.sin(life * 8 + i) * 40;
      const y = 1080 - life * 1100;
      return <circle key={i} cx={x} cy={y} r={2 + rnd(i + 5) * 4} fill={i % 3 ? "#FFB43A" : "#FFE7A0"} opacity={(1 - life) * 0.9} />;
    })}
  </g>
);

// ───────── uzak arka plan: Haliç, karşı kıyı, Süleymaniye ─────────
const Suleymaniye: React.FC<{ x: number; y: number; s?: number; c: string }> = ({ x, y, s = 1, c }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill={c}>
    <rect x={-170} y={-70} width={340} height={70} />
    <path d="M-120,-70 A120,95 0 0 1 120,-70Z" />
    <path d="M-170,-55 A55,45 0 0 1 -60,-55Z M60,-55 A55,45 0 0 1 170,-55Z" />
    <rect x={-6} y={-178} width={12} height={20} />
    {[-250, -205, 205, 250].map((mx, i) => (
      <g key={mx}>
        <rect x={mx - 7} y={i === 0 || i === 3 ? -200 : -250} width={14} height={i === 0 || i === 3 ? 200 : 250} />
        <path d={`M${mx - 8},${i === 0 || i === 3 ? -200 : -250} L${mx},${i === 0 || i === 3 ? -246 : -300} L${mx + 8},${i === 0 || i === 3 ? -200 : -250}Z`} />
        <rect x={mx - 11} y={i === 0 || i === 3 ? -140 : -180} width={22} height={6} />
      </g>
    ))}
  </g>
);

const Uzak: React.FC<{ t: number; dusk: number; fire: number; pan: number }> = ({ t, dusk, fire, pan }) => {
  const sky0 = mix(mix("#8EC1E3", "#E89A5A", dusk), "#3A1C10", fire), sky1 = mix(mix("#F2E9D2", "#F7C48A", dusk), "#C2501E", fire);
  const hill = mix(mix("#A9B9B4", "#9A7A6A", dusk), "#2A1A14", fire);
  return (
    <g>
      <defs>
        <linearGradient id="kSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky0} /><stop offset="1" stopColor={sky1} /></linearGradient>
        <linearGradient id="kSea" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={mix(mix("#7FB2C8", "#C88A5A", dusk), "#8A3A18", fire)} /><stop offset="1" stopColor={mix("#3E6F8A", "#3A1A10", fire)} /></linearGradient>
      </defs>
      <rect width={1920} height={700} fill="url(#kSky)" />
      {/* bulutlar / duman bulutları */}
      {[0, 1, 2].map((i) => <ellipse key={i} cx={((i * 700 + t * 8 - pan * 0.1) % 2400) - 200} cy={120 + i * 50} rx={200} ry={36} fill={fire > 0.3 ? "#2A1A14" : "#FFFFFF"} opacity={0.5} filter="url(#pBlur8)" />)}
      {/* karşı kıyı tepesi + Galata kulesi */}
      <g transform={`translate(${-pan * 0.15},0)`}>
        <path d="M-200,520 Q300,440 700,480 T1500,450 T2300,500 L2300,600 L-200,600Z" fill={hill} opacity={0.8} />
        <g transform="translate(1620,470)" fill={hill}>
          <rect x={-22} y={-110} width={44} height={110} />
          <path d="M-28,-110 L0,-170 L28,-110Z" />
        </g>
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 160 - 120} y={500 - (i % 3) * 8} width={70} height={40} fill={hill} opacity={0.9} />)}
        {/* Süleymaniye (yamaçta, sağ arka) */}
        <Suleymaniye x={1220} y={430} s={0.9} c={mix(hill, "#1A1410", 0.25)} />
      </g>
      {/* Haliç */}
      <rect y={560} width={1920} height={140} fill="url(#kSea)" />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${(i * 210 + t * 20) % 2000 - 40},${590 + (i % 4) * 22} q20,-6 40,0`} stroke="#FFFFFF" strokeOpacity={0.35} strokeWidth={3} fill="none" />)}
      {/* kayık */}
      <g transform={`translate(${((t * 25 - pan * 0.3) % 2200) - 100},620)`}>
        <path d="M-60,0 L60,0 L44,18 L-44,18Z" fill="#5E3B20" />
        <rect x={-4} y={-50} width={6} height={50} fill="#5E3B20" />
      </g>
    </g>
  );
};

// ───────── cumbalı ahşap ev ─────────
const EV_RENK = ["#C9A27A", "#B98A80", "#9A8A70", "#A9B49A", "#C7B08A", "#8E7A6A"];
const Ev: React.FC<{ x: number; i: number; t: number; dusk: number; fire: number; burn?: number }> = ({ x, i, t, dusk, fire, burn = 0 }) => {
  const c = mix(EV_RENK[i % EV_RENK.length], "#2A1A14", fire * 0.45 + dusk * 0.15);
  const W = 340, base = 820;
  const glow = Math.max(burn, dusk * 0.6);
  return (
    <g transform={`translate(${x},0)`}>
      {/* çatı */}
      <path d={`M-20,${base - 560} L${W / 2},${base - 640} L${W + 20},${base - 560}Z`} fill={mix("#A8503A", "#3A1A10", fire * 0.5)} stroke={LN} strokeWidth={3} />
      {Array.from({ length: 6 }, (_, k) => <path key={k} d={`M${10 + k * 55},${base - 566} l14,-28`} stroke={LN} strokeOpacity={0.3} strokeWidth={2} />)}
      <rect x={W * 0.7} y={base - 650} width={26} height={60} fill="#7A5A44" stroke={LN} strokeWidth={2} />
      {/* üst kat (cumba: dışa taşan) */}
      <rect x={-14} y={base - 560} width={W + 28} height={250} fill={c} stroke={LN} strokeWidth={3} />
      {Array.from({ length: 11 }, (_, k) => <path key={k} d={`M-14,${base - 545 + k * 22} H${W + 14}`} stroke={LN} strokeOpacity={0.18} strokeWidth={2} />)}
      <rect x={-14} y={base - 560} width={W + 28} height={250} fill="url(#pShadeL)" />
      {/* cumba payandaları */}
      {[20, W / 2, W - 20].map((bx) => <path key={bx} d={`M${bx - 14},${base - 310} L${bx},${base - 270} L${bx + 14},${base - 310}Z`} fill={H.wood2} stroke={LN} strokeWidth={2} />)}
      {/* üst kat pencereler (kafesli) */}
      {[0, 1, 2].map((k) => {
        const wx = 26 + k * 104;
        return (
          <g key={k}>
            <rect x={wx} y={base - 520} width={80} height={150} fill={glow > 0 ? mix("#2A2420", "#FFB43A", glow * (0.6 + 0.4 * Math.sin(t * 9 + k + i))) : "#2E3A44"} stroke={LN} strokeWidth={3} />
            <rect x={wx} y={base - 520} width={80} height={150} fill="url(#hHoney)" opacity={k === 1 ? 0.9 : 0.35} />
            <rect x={wx - 6} y={base - 370} width={92} height={10} fill={H.wood2} />
          </g>
        );
      })}
      {/* zemin kat: taş + kapı */}
      <rect x={0} y={base - 300} width={W} height={300} fill={mix("#D8CBB0", "#3A2A20", fire * 0.4)} stroke={LN} strokeWidth={3} />
      {Array.from({ length: 6 }, (_, k) => <path key={k} d={`M0,${base - 250 + k * 50} H${W}`} stroke={LN} strokeOpacity={0.2} strokeWidth={2} />)}
      <path d={`M${W * 0.62},${base} L${W * 0.62},${base - 200} Q${W * 0.75},${base - 250} ${W * 0.88},${base - 200} L${W * 0.88},${base}Z`} fill={H.wood} stroke={LN} strokeWidth={3} />
      <circle cx={W * 0.84} cy={base - 100} r={6} fill={P.gold} />
      <rect x={30} y={base - 220} width={110} height={110} fill="#2E3A44" stroke={LN} strokeWidth={3} />
      {[0, 1, 2, 3].map((k) => <path key={k} d={`M${30 + k * 27.5},${base - 220} v110`} stroke="#1A1410" strokeWidth={4} />)}
      {/* saksı */}
      <g transform={`translate(${85},${base - 106})`}><path d="M-20,0 L20,0 L14,24 L-14,24Z" fill="#B8503A" /><circle cx={-8} cy={-8} r={10} fill="#D8404A" /><circle cx={8} cy={-12} r={9} fill="#D8404A" /><path d="M0,0 v-14" stroke={H.green} strokeWidth={4} /></g>
    </g>
  );
};

// ───────── 1) Cibali sokağı ─────────
export const CibaliSokak: React.FC<{ t: number; pan?: number; dusk?: number; fire?: number; gap?: boolean }> = ({ t, pan = 0, dusk = 0, fire = 0, gap = true }) => {
  const W = 368, n0 = Math.floor(pan / W) - 1;
  return (
    <g>
      <Uzak t={t} dusk={dusk} fire={fire} pan={pan} />
      {/* tütün fabrikası (Haliç kıyısında, tuğla, baca) */}
      <g transform={`translate(${260 - pan * 0.35},560)`}>
        <rect x={-260} y={-150} width={520} height={150} fill={mix("#A8583A", "#2A140E", fire * 0.5)} stroke={LN} strokeWidth={3} />
        {Array.from({ length: 9 }, (_, k) => <path key={k} d={`M${-240 + k * 58},-24 v-90 a18,18 0 0 1 36,0 v90Z`} fill={fire > 0.2 ? "#FFB43A" : "#E8D8B0"} opacity={0.8} />)}
        <rect x={180} y={-330} width={36} height={190} fill="#8A4630" stroke={LN} strokeWidth={3} />
        <circle cx={200} cy={-360 - (t * 30) % 60} r={30} fill="#BFB4A8" opacity={0.45} filter="url(#pBlur8)" />
      </g>
      {/* ev sırası */}
      {Array.from({ length: 8 }, (_, k) => n0 + k).map((m) => {
        const x = m * W - pan;
        if (gap && ((m % 5) + 5) % 5 === 2) return null; // Haliç'e inen yokuş boşluğu
        return <Ev key={m} x={x} i={((m % 6) + 6) % 6} t={t} dusk={dusk} fire={fire} burn={fire * (rnd(m) > 0.45 ? 1 : 0)} />;
      })}
      {/* sokak taşları */}
      <rect y={820} width={1920} height={260} fill={mix("#B8A888", "#3A2A20", fire * 0.5)} />
      {Array.from({ length: 70 }, (_, k) => {
        const row = Math.floor(k / 14), col = k % 14;
        const x = ((col * 150 + (row % 2) * 75 - pan) % 2100 + 2100) % 2100 - 90;
        return <ellipse key={k} cx={x} cy={850 + row * 50} rx={60 + row * 4} ry={16 + row * 2} fill={mix("#9A8A6A", "#2A1A14", fire * 0.5)} opacity={0.55} />;
      })}
      {/* gaz lambası direği */}
      {[0, 1, 2].map((k) => {
        const x = ((k * 760 + 380 - pan) % 2280 + 2280) % 2280 - 180;
        return (
          <g key={k} transform={`translate(${x},860)`}>
            <rect x={-6} y={-360} width={12} height={360} fill="#2A2420" />
            <path d="M-26,-360 L26,-360 L18,-410 L-18,-410Z" fill={dusk > 0.3 ? "#FFE39A" : "#E8E0C8"} stroke="#2A2420" strokeWidth={4} />
            <path d="M-30,-410 L0,-436 L30,-410Z" fill="#2A2420" />
            {dusk > 0.3 && <circle cx={0} cy={-385} r={90} fill="url(#pBloom)" opacity={dusk * 0.7} />}
          </g>
        );
      })}
      {/* yangın */}
      {fire > 0 && (
        <g opacity={fire}>
          <rect width={1920} height={1080} fill="#FF6A1A" opacity={0.16} />
          {Array.from({ length: 8 }, (_, k) => n0 + k).filter((m) => rnd(m) > 0.45).map((m) => {
            const x = m * W - pan + W / 2;
            return <g key={m}><Duman x={x} y={200} t={t} s={1.3} seed={m} /><Alev x={x} y={262} s={1.2} t={t} seed={m} /><Alev x={x - 90} y={400} s={0.7} t={t} seed={m + 3} /></g>;
          })}
          <Kivilcim t={t} n={50} />
        </g>
      )}
    </g>
  );
};

// ───────── 2) orta halli ev odası ─────────
export const GazLamba: React.FC<{ x: number; y: number; t: number; lit?: number; s?: number; hang?: boolean }> = ({ x, y, t, lit = 1, s = 1, hang = true }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {hang && <path d="M0,-260 V-70" stroke="#3A2A20" strokeWidth={4} />}
    <path d="M-40,-70 L40,-70 L28,-40 L-28,-40Z" fill="#B8892E" stroke={LN} strokeWidth={2.4} />
    <path d="M-30,-40 C-46,0 -40,40 -18,60 L18,60 C40,40 46,0 30,-40Z" fill="#F7EED8" opacity={0.85} stroke={LN} strokeWidth={2.4} />
    <path d={`M0,40 C-8,24 -5,10 0,${2 - 3 * Math.sin(t * 9)} C5,10 8,24 0,40Z`} fill="#FFD27A" opacity={lit} />
    <path d="M-34,60 L34,60 L22,90 L-22,90Z" fill="#2B5DA8" stroke={LN} strokeWidth={2.4} />
    <circle cx={0} cy={20} r={150} fill="url(#pBloom)" opacity={0.55 * lit} />
  </g>
);

export const Mangal: React.FC<{ x: number; y: number; t: number; s?: number }> = ({ x, y, t, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-90,0 L-70,-20 L70,-20 L90,0Z" fill="#8A5A2E" stroke={LN} strokeWidth={3} />
    <path d="M-80,-20 C-80,-80 80,-80 80,-20Z" fill="#C9873B" stroke={LN} strokeWidth={3} />
    <path d="M-70,-50 Q0,-74 70,-50" fill="none" stroke="#7A4A20" strokeWidth={3} />
    {[-40, -10, 20, 45].map((cx, i) => <circle key={cx} cx={cx} cy={-62} r={12} fill={i % 2 ? "#E8642A" : "#FFB43A"} opacity={0.75 + 0.25 * Math.sin(t * 5 + i)} />)}
    <path d="M-100,-30 Q-120,-50 -100,-70 M100,-30 Q120,-50 100,-70" stroke="#8A5A2E" strokeWidth={8} fill="none" />
    <circle cx={0} cy={-70} r={120} fill="url(#pBloom)" opacity={0.35} />
  </g>
);

export const EvOda: React.FC<{ t: number; night?: number; cold?: number; sea?: boolean }> = ({ t, night = 0, cold = 0, sea = true }) => {
  const FL = 820;
  const wall = mix(mix("#E9DCC0", "#C9D2D6", cold), "#3A2E28", night * 0.55);
  return (
    <g>
      <rect width={1920} height={FL} fill={wall} />
      {/* tavan kirişleri */}
      <rect width={1920} height={90} fill={mix(H.wood2, "#1A1008", night * 0.5)} />
      {Array.from({ length: 13 }, (_, i) => <rect key={i} x={i * 150 + 20} y={0} width={34} height={100} fill={mix(H.wood, "#1A1008", night * 0.5)} stroke={LN} strokeWidth={2} />)}
      <rect y={90} width={1920} height={14} fill={H.cobalt} opacity={0.6} />
      {/* yüklük (gömme dolap) */}
      <g transform="translate(60,170)">
        <rect width={420} height={560} fill={mix(H.wood, "#1A1008", night * 0.5)} stroke={LN} strokeWidth={4} />
        {[0, 1].map((k) => <g key={k}><rect x={20 + k * 200} y={20} width={180} height={520} fill="none" stroke={LN} strokeWidth={3} /><path d={`M${40 + k * 200},60 h140 v200 h-140Z M${40 + k * 200},300 h140 v200 h-140Z`} fill="none" stroke={P.gold} strokeWidth={2} opacity={0.6} /><circle cx={k ? 230 : 190} cy={280} r={7} fill={P.gold} /></g>)}
      </g>
      {/* raf: bakır kaplar */}
      <g transform="translate(560,300)">
        <rect x={0} y={0} width={360} height={14} fill={H.wood2} />
        {[40, 120, 200, 290].map((cx, i) => <g key={cx} transform={`translate(${cx},0)`}>{i % 2 ? <path d="M-24,0 C-30,-40 -18,-60 0,-62 C18,-60 30,-40 24,0Z" fill="#C46A3A" stroke={LN} strokeWidth={2} /> : <path d="M-30,0 L30,0 L24,-34 L-24,-34Z" fill="#B8742E" stroke={LN} strokeWidth={2} />}</g>)}
      </g>
      {/* kafesli pencere (Haliç manzarası) */}
      <g transform="translate(1440,560)">
        <rect x={-260} y={-400} width={520} height={400} fill={sea ? (night > 0.5 ? "url(#pNightSky)" : "url(#pDaySky)") : "#2E3A44"} />
        {sea && <><rect x={-260} y={-130} width={520} height={130} fill="url(#pWater)" opacity={night > 0.5 ? 0.4 : 1} /><Suleymaniye x={80} y={-130} s={0.45} c={night > 0.5 ? "#1A2040" : "#8A9AA8"} /></>}
        <rect x={-260} y={-400} width={520} height={400} fill="url(#hHoney)" opacity={0.55} />
        <rect x={-260} y={-400} width={520} height={400} fill="none" stroke={H.wood2} strokeWidth={18} />
        <path d="M0,-400 V0 M-260,-200 H260" stroke={H.wood2} strokeWidth={10} />
        <rect x={-280} y={0} width={560} height={26} fill={H.wood2} stroke={LN} strokeWidth={3} />
        <path d={`M-300,-430 C-270,-260 ${-290 + Math.sin(t) * 5},-120 -310,30 L-250,30 C-250,-120 -260,-280 -250,-430Z`} fill="#6A8A9A" stroke={LN} strokeWidth={3} />
        <path d={`M300,-430 C270,-260 ${290 + Math.sin(t + 1) * 5},-120 310,30 L250,30 C250,-120 260,-280 250,-430Z`} fill="#6A8A9A" stroke={LN} strokeWidth={3} />
      </g>
      {/* sedir (sade): kilim minder */}
      <g transform={`translate(1000,${FL})`}>
        <rect x={-420} y={-110} width={840} height={110} fill={H.wood} stroke={LN} strokeWidth={3} />
        <rect x={-412} y={-150} width={824} height={50} rx={16} fill="#8E2A2A" stroke={LN} strokeWidth={3} />
        {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${-400 + i * 64},-140 l16,16 l-16,16 l-16,-16Z`} fill={i % 2 ? "#E8C46A" : "#2B4A7A"} opacity={0.8} />)}
        {[-1, 0, 1].map((i) => <rect key={i} x={i * 270 - 90} y={-270} width={180} height={130} rx={26} fill={i === 0 ? "#2B4A7A" : "#B8742E"} stroke={LN} strokeWidth={3} />)}
      </g>
      {/* zemin: tahta + kilim */}
      <rect y={FL} width={1920} height={1080 - FL} fill={mix("#B88A5A", "#2A1A10", night * 0.5)} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M0,${FL + 14 + i * 30} H1920`} stroke={LN} strokeOpacity={0.2} strokeWidth={2} />)}
      <path d={`M300,${FL + 40} L1620,${FL + 40} L1760,1080 L160,1080Z`} fill="#8E2A2A" stroke="#E8C46A" strokeWidth={6} />
      {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${420 + i * 180},${FL + 130} l40,40 l-40,40 l-40,-40Z`} fill={i % 2 ? "#E8C46A" : "#2B4A7A"} />)}
      <GazLamba x={960} y={330} t={t} lit={night > 0.3 ? 1 : 0.3} />
      {cold > 0 && <rect width={1920} height={1080} fill="#9ABAD0" opacity={cold * 0.12} />}
    </g>
  );
};

// ───────── 3) Cibali Tütün Fabrikası ─────────
const Yaprak: React.FC<{ x: number; y: number; r?: number; c?: string; s?: number }> = ({ x, y, r = 0, c = "#C99A3E", s = 1 }) => (
  <path transform={`translate(${x},${y}) rotate(${r}) scale(${s})`} d="M0,0 C14,-10 30,-10 44,0 C30,10 14,10 0,0Z M2,0 H42" fill={c} stroke="#7A5420" strokeWidth={1.4} />
);

export const TutunFabrika: React.FC<{ t: number; dust?: number }> = ({ t, dust = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#B8704A" />
    {Array.from({ length: 30 }, (_, r) => <path key={r} d={`M0,${r * 30} H1920`} stroke="#8A4A30" strokeWidth={2} opacity={0.5} />)}
    {/* yüksek kemerli pencereler + ışık huzmeleri */}
    {[0, 1, 2, 3, 4].map((i) => {
      const x = 200 + i * 380;
      return (
        <g key={i}>
          <path d={`M${x - 110},560 V200 A110,110 0 0 1 ${x + 110},200 V560Z`} fill="#F4EAD0" stroke={LN} strokeWidth={4} />
          <path d={`M${x},90 V560 M${x - 110},330 H${x + 110}`} stroke="#5A4A3A" strokeWidth={6} />
          <path d={`M${x - 110},560 L${x + 110},560 L${x + 300},1080 L${x + 40},1080Z`} fill="#FFF3D0" opacity={0.16 + 0.03 * Math.sin(t + i)} />
        </g>
      );
    })}
    {/* demir sütunlar */}
    {[390, 960, 1530].map((x) => <g key={x}><rect x={x - 14} y={0} width={28} height={820} fill="#4A4A4A" stroke={LN} strokeWidth={2} /><rect x={x - 26} y={790} width={52} height={30} fill="#3A3A3A" /></g>)}
    {/* tavandan sarkan tütün dizileri */}
    {Array.from({ length: 6 }, (_, k) => (
      <g key={k}>
        <path d={`M0,${70 + k * 18} Q960,${110 + k * 18} 1920,${70 + k * 18}`} stroke="#6A4A2A" strokeWidth={2} fill="none" />
        {Array.from({ length: 30 }, (_, j) => <Yaprak key={j} x={j * 66 + (k % 2) * 30} y={78 + k * 18 + Math.sin(j / 30 * Math.PI) * 30} r={90 + Math.sin(t * 2 + j + k) * 4} c={k % 2 ? "#B8862E" : "#9A6A24"} s={0.9} />)}
      </g>
    ))}
    {/* zemin */}
    <rect y={820} width={1920} height={260} fill="#8A6A4A" />
    {/* uzun masalar: arka sıra + ön sıra (perspektif) */}
    {[{ y: 720, s: 0.75 }, { y: 900, s: 1 }].map(({ y, s }, r) => (
      <g key={r}>
        <rect x={60} y={y} width={1800} height={40 * s} fill={H.wood} stroke={LN} strokeWidth={3} />
        <rect x={60} y={y + 40 * s} width={1800} height={14} fill={H.wood2} />
        {[100, 600, 1100, 1700].map((lx) => <rect key={lx} x={lx} y={y + 54 * s} width={18 * s} height={150 * s} fill={H.wood2} />)}
        {/* yaprak yığınları */}
        {Array.from({ length: 9 }, (_, j) => (
          <g key={j} transform={`translate(${160 + j * 200},${y}) scale(${s})`}>
            <path d="M-70,0 C-60,-50 60,-50 70,0Z" fill={j % 2 ? "#C99A3E" : "#B8862E"} stroke="#7A5420" strokeWidth={2} />
            {Array.from({ length: 5 }, (_, q) => <Yaprak key={q} x={-60 + q * 22} y={-18 - (q % 2) * 10} r={-20 + q * 12} c="#D8AE52" s={0.8} />)}
          </g>
        ))}
      </g>
    ))}
    {/* sepetler */}
    {[300, 1250].map((x) => <g key={x} transform={`translate(${x},1060)`}><path d="M-80,0 L80,0 L100,-90 L-100,-90Z" fill="#B8904A" stroke={LN} strokeWidth={3} />{Array.from({ length: 5 }, (_, q) => <path key={q} d={`M-96,${-18 * q - 8} H96`} stroke="#7A5A2A" strokeWidth={3} />)}</g>)}
    {/* tütün tozu */}
    {dust > 0 && Array.from({ length: 50 }, (_, i) => <circle key={i} cx={(rnd(i) * 1920 + t * 10 * (1 + rnd(i + 1))) % 1920} cy={200 + rnd(i + 2) * 700 + Math.sin(t + i) * 20} r={1.5 + rnd(i + 4) * 2.5} fill="#FFF0C0" opacity={0.5 * dust} />)}
  </g>
);

// ───────── 4) mermer hamam ─────────
export const HamamPro: React.FC<{ t: number; steam?: number }> = ({ t, steam = 1 }) => (
  <g>
    <defs>
      <radialGradient id="kDome" cx="0.5" cy="0.2" r="0.9"><stop offset="0" stopColor="#F7F2E6" /><stop offset="1" stopColor="#CFC6B4" /></radialGradient>
    </defs>
    <rect width={1920} height={1080} fill="#E6DFD0" />
    {/* kubbe + fil gözleri */}
    <path d="M-100,420 A1060,520 0 0 1 2020,420Z" fill="url(#kDome)" stroke="#BFB4A0" strokeWidth={6} />
    {Array.from({ length: 22 }, (_, i) => {
      const a = Math.PI * (0.08 + 0.84 * (i / 21)), rr = 300 + (i % 3) * 120;
      const x = 960 + Math.cos(a) * rr * 1.8 * (i % 2 ? 0.8 : 1), y = 420 - Math.sin(a) * rr * 0.8;
      return (
        <g key={i}>
          <path d={`M${x},${y - 14} l5,9 l10,1 l-7,7 l2,10 l-10,-5 l-10,5 l2,-10 l-7,-7 l10,-1Z`} fill="#FFFBE8" />
          <path d={`M${x - 6},${y} L${x + 6},${y} L${x + 60},1000 L${x - 30},1000Z`} fill="#FFF8E0" opacity={0.07} />
        </g>
      );
    })}
    {/* kemerli nişler + kurnalar */}
    {[0, 1, 2, 3, 4].map((i) => {
      const x = 190 + i * 385;
      return (
        <g key={i}>
          <path d={`M${x - 130},830 V560 A130,130 0 0 1 ${x + 130},560 V830Z`} fill="#D6CCB8" stroke="#A89C86" strokeWidth={5} />
          <path d={`M${x - 150},830 V560 A150,150 0 0 1 ${x + 150},560 V830`} fill="none" stroke="#F4EEE0" strokeWidth={10} />
          <rect x={x - 70} y={720} width={140} height={80} rx={8} fill="#F4EEE0" stroke="#A89C86" strokeWidth={4} />
          <path d={`M${x - 8},640 h16 v40 h-16Z`} fill="#B8892E" />
          <path d={`M${x},680 v40`} stroke="#9AC8E0" strokeWidth={4} opacity={0.7 + 0.3 * Math.sin(t * 8 + i)} />
          <ellipse cx={x + 40} cy={712} rx={30} ry={10} fill="#C9873B" stroke={LN} strokeWidth={2} />
        </g>
      );
    })}
    {/* zemin mermer + göbek taşı */}
    <rect y={830} width={1920} height={250} fill="url(#hMarble)" />
    <path d="M560,1080 L700,900 L1220,900 L1360,1080Z" fill="#F2ECDE" stroke="#A89C86" strokeWidth={5} />
    <path d="M700,900 L1220,900" stroke="#FFFFFF" strokeWidth={4} />
    {/* buhar */}
    {steam > 0 && Array.from({ length: 9 }, (_, i) => {
      const life = (t * 0.07 + i / 9) % 1;
      return <ellipse key={i} cx={(i * 260 + Math.sin(t * 0.4 + i) * 90) % 1920} cy={980 - life * 800} rx={260} ry={120} fill="#FFFFFF" opacity={steam * 0.32 * Math.sin(life * Math.PI)} filter="url(#pBlur16)" />;
    })}
  </g>
);

// ───────── nesneler ─────────
export const RecelTabak: React.FC<{ x: number; y: number; s?: number; t?: number; empty?: number }> = ({ x, y, s = 1, t = 0, empty = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={0} rx={110} ry={30} fill="#F7F2E6" stroke={LN} strokeWidth={3} />
    <ellipse cx={0} cy={-4} rx={86} ry={20} fill="none" stroke="#2B5DA8" strokeWidth={4} />
    {empty < 1 && <g opacity={1 - empty}>
      <ellipse cx={0} cy={-8} rx={56} ry={16} fill="#C2304A" />
      {[-30, -8, 16, 34].map((px, i) => <path key={px} d={`M${px},-12 q8,-8 14,0 q-6,6 -14,0Z`} fill="#E8506A" transform={`rotate(${i * 30},${px},-12)`} />)}
      <ellipse cx={-14} cy={-14} rx={14} ry={4} fill="#FFFFFF" opacity={0.4} />
    </g>}
    <path d={`M60,-6 L140,-30`} stroke="#B8B8B0" strokeWidth={6} strokeLinecap="round" />
    <ellipse cx={58} cy={-6} rx={14} ry={6} fill="#C8C8C0" />
    {t > 0 && empty < 0.5 && <ellipse cx={0} cy={-30} rx={80} ry={30} fill="url(#pBloom)" opacity={0.25} />}
  </g>
);

export const Kavanoz: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-50} y={-150} width={100} height={150} rx={20} fill="#C2304A" opacity={0.85} stroke={LN} strokeWidth={3} />
    <rect x={-56} y={-172} width={112} height={26} rx={6} fill="#F2E6C4" stroke={LN} strokeWidth={3} />
    <path d="M-56,-160 h112" stroke="#B8242C" strokeWidth={3} strokeDasharray="6 6" />
    <rect x={-36} y={-110} width={72} height={50} fill="#F7F2E6" stroke={LN} strokeWidth={2} />
    <text x={0} y={-78} textAnchor="middle" fontSize={20} fontFamily="Georgia" fill="#8E1F2A">gül</text>
    <rect x={-40} y={-140} width={14} height={120} rx={7} fill="#FFFFFF" opacity={0.3} />
  </g>
);

// Osmanlıca gazete (Arap harfi izlenimi: kıvrık satırlar, gerçek yazı yok) + Türkçe başlık bandı
export const Gazete: React.FC<{ t: number; k?: number; head?: string; x?: number; y?: number; s?: number }> = ({ t, k = 1, head = "HUKUK-I AİLE KARARNAMESİ", x = 960, y = 540, s = 1 }) => (
  <g transform={`translate(${x},${y + (1 - ease(k)) * 80}) scale(${s}) rotate(${-2 + Math.sin(t * 0.7) * 0.6})`} opacity={ease(k)}>
    <rect x={-380} y={-460} width={760} height={920} fill="#EDE3C6" stroke={LN} strokeWidth={4} />
    <rect x={-380} y={-460} width={760} height={920} fill="url(#pShadeL)" opacity={0.4} />
    <rect x={-340} y={-420} width={680} height={90} fill="#2A2420" />
    {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${290 - i * 90},-375 q-20,-26 -40,0 q-14,18 -34,-4`} stroke="#EDE3C6" strokeWidth={6} fill="none" />)}
    <path d="M-340,-310 H340 M-340,-300 H340" stroke="#2A2420" strokeWidth={3} />
    <rect x={-340} y={-280} width={680} height={70} fill="#B8242C" />
    <text x={0} y={-232} textAnchor="middle" fontFamily="Georgia" fontWeight={700} fontSize={34} fill="#F7F2E6">{head}</text>
    {[-1, 1].map((col) => (
      <g key={col}>
        {Array.from({ length: 16 }, (_, r) => {
          const xs = col * 170;
          const w = 260 - (r % 4) * 18;
          return <path key={r} d={`M${xs + w / 2},${-180 + r * 38} ${Array.from({ length: 8 }, (_, q) => `q-${w / 16},${q % 2 ? -10 : 8} -${w / 8},0`).join(" ")}`} stroke="#3A2E24" strokeWidth={3} fill="none" opacity={0.75} />;
        })}
      </g>
    ))}
    <path d="M0,-190 V440" stroke="#3A2E24" strokeWidth={2} />
    <text x={-340} y={430} fontFamily="Georgia" fontSize={22} fill="#3A2E24">25 Teşrin-i Evvel 1333</text>
  </g>
);

// ekmek vesikası (savaş yılları karne) + mühür
export const EkmekVesika: React.FC<{ x: number; y: number; s?: number; k?: number }> = ({ x, y, s = 1, k = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={ease(k)}>
    <rect x={-260} y={-170} width={520} height={340} rx={10} fill="#E9E0C4" stroke={LN} strokeWidth={4} />
    <rect x={-240} y={-150} width={480} height={300} fill="none" stroke="#2B5DA8" strokeWidth={3} strokeDasharray="10 6" />
    <text x={0} y={-90} textAnchor="middle" fontFamily="Georgia" fontWeight={700} fontSize={40} fill="#2A2420">EKMEK VESİKASI</text>
    <text x={0} y={-50} textAnchor="middle" fontFamily="Georgia" fontSize={24} fill="#5A4A3A">Dersaadet · 1332</text>
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-220 + i * 44} y={10} width={38} height={60} fill="none" stroke="#5A4A3A" strokeWidth={2} />)}
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-214 + i * 44},16 l26,48 M${-188 + i * 44},16 l-26,48`} stroke="#8E1F2A" strokeWidth={3} />)}
    <circle cx={170} cy={110} r={46} fill="none" stroke="#8E1F2A" strokeWidth={5} opacity={0.75} />
    <circle cx={170} cy={110} r={34} fill="none" stroke="#8E1F2A" strokeWidth={2} opacity={0.75} />
  </g>
);

// altın bilezikler (sandıktan çıkan)
export const Bilezik: React.FC<{ x: number; y: number; s?: number; n?: number; t?: number }> = ({ x, y, s = 1, n = 4, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {Array.from({ length: n }, (_, i) => (
      <g key={i} transform={`translate(${(i - (n - 1) / 2) * 70},${Math.sin(i) * 10})`}>
        <ellipse cx={0} cy={0} rx={60} ry={22} fill="none" stroke={P.gold} strokeWidth={14} />
        <ellipse cx={0} cy={0} rx={60} ry={22} fill="none" stroke="#FFF2B0" strokeWidth={3} strokeDasharray="4 18" strokeDashoffset={t * 20} />
      </g>
    ))}
    <ellipse cx={0} cy={-10} rx={200} ry={80} fill="url(#pBloom)" opacity={0.3} />
  </g>
);

// celp (askere çağrı) kâğıdı
export const CelpKagit: React.FC<{ x: number; y: number; s?: number; k?: number }> = ({ x, y, s = 1, k = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(3)`} opacity={ease(k)}>
    <rect x={-220} y={-290} width={440} height={580} fill="#EFE6CC" stroke={LN} strokeWidth={4} />
    <circle cx={0} cy={-200} r={50} fill="none" stroke="#8E1F2A" strokeWidth={4} />
    <path d="M-14,-214 a22,22 0 1 0 22,30 a18,18 0 1 1 -22,-30Z" fill="#8E1F2A" />
    <text x={0} y={-110} textAnchor="middle" fontFamily="Georgia" fontWeight={700} fontSize={44} fill="#2A2420">CELP</text>
    {Array.from({ length: 8 }, (_, r) => <path key={r} d={`M150,${-60 + r * 40} ${Array.from({ length: 7 }, (_, q) => `q-21,${q % 2 ? -8 : 6} -42,0`).join(" ")}`} stroke="#3A2E24" strokeWidth={3} fill="none" opacity={0.7} />)}
    <rect x={60} y={200} width={120} height={50} fill="#8E1F2A" opacity={0.8} transform="rotate(-8,120,225)" />
  </g>
);

export const _kumaUnused = { lerp };
