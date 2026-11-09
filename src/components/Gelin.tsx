import React from "react";
import { H, HTiny, lerp } from "./Harem";
import { blinkAt } from "./Motion";

// Kanal 3 · k3r-10 Gelin (1766 depremi) ve k3r-11 Natır (hamam) için ortak sahneler.
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// Deprem sarsıntısı: sahneyi saran g. k = şiddet (0..1)
export const Shake: React.FC<{ t: number; k: number; children: React.ReactNode }> = ({ t, k, children }) => {
  const dx = (Math.sin(t * 53) + Math.sin(t * 31.7) * 0.6) * 14 * k, dy = (Math.cos(t * 47) + Math.sin(t * 23.3) * 0.5) * 10 * k, r = Math.sin(t * 29) * 0.6 * k;
  return <g transform={`translate(${dx} ${dy}) rotate(${r} 960 540)`}>{children}</g>;
};

// Düşen taşlar ve toz (üst katman)
export const Taslar: React.FC<{ t: number; a: number; n?: number; dust?: number }> = ({ t, a, n = 14, dust = 1 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => {
      const t0 = a + rnd(i) * 1.6, p = t - t0;
      if (p < 0) return null;
      const x = 100 + rnd(i + 9) * 1720, y = -60 + p * p * 900, s = 14 + rnd(i + 3) * 30;
      return y < 1140 ? <rect key={i} x={x - s / 2} y={y} width={s} height={s * 0.8} rx={4} fill={["#B9A07A", "#8E7656", "#CDB68A"][i % 3]} stroke={H.ln} strokeWidth={2} transform={`rotate(${p * 200 * (rnd(i) - 0.5)} ${x} ${y})`} /> : null;
    })}
    {dust > 0 && Array.from({ length: 10 }, (_, i) => { const p = cl((t - a - rnd(i + 20)) / 3); return <circle key={`d${i}`} cx={120 + i * 190 + Math.sin(t + i) * 30} cy={1000 - p * 260} r={120 + p * 240} fill="#D9C8A8" opacity={0.5 * dust * (1 - p * 0.6) * (p > 0 ? 1 : 0)} />; })}
  </g>
);

// İstanbul silueti: Fatih Camii kubbesi (collapse 0..1), toz bulutları, sabah
export const Siluet: React.FC<{ t: number; collapse?: number; dust?: number; dawn?: number; rebuilt?: number }> = ({ t, collapse = 0, dust = 0, dawn = 0.4, rebuilt = 0 }) => {
  const dome = (cx: number, by: number, r: number, k = 0) => <g>
    <rect x={cx - r * 1.05} y={by - 20} width={r * 2.1} height={140} fill="#D8C7A4" stroke={H.ln} strokeWidth={4} />
    {k < 1 && <path d={`M${cx - r},${by - 20 + k * 120} A${r},${r * (1 - k * 0.8)} 0 0 1 ${cx + r},${by - 20 + k * 120}Z`} fill="#9DB0B8" stroke={H.ln} strokeWidth={4} opacity={1 - k * 0.3} />}
    {k < 0.5 && <rect x={cx - 3} y={by - 20 - r - 40} width={6} height={44} fill={H.gold} />}
    {k > 0.4 && Array.from({ length: 7 }, (_, i) => <rect key={i} x={cx - r + i * r * 0.3} y={by + 70 - rnd(i) * 30} width={40 + rnd(i + 2) * 40} height={30} rx={6} fill="#B9A07A" stroke={H.ln} strokeWidth={3} transform={`rotate(${(rnd(i + 5) - 0.5) * 40} ${cx} ${by})`} />)}
  </g>;
  const min = (x: number, h: number) => <g><rect x={x - 12} y={760 - h} width={24} height={h} fill="#E2CFA9" stroke={H.ln} strokeWidth={3} /><path d={`M${x - 14},${760 - h} L${x},${700 - h} L${x + 14},${760 - h}Z`} fill="#9DB0B8" stroke={H.ln} strokeWidth={3} /></g>;
  return (
    <g>
      <rect width={1920} height={1080} fill={dawn > 0.5 ? "#F2C9A0" : "#BFD3E0"} />
      <rect width={1920} height={600} fill="#E9B98C" opacity={dawn} />
      <circle cx={1500} cy={360} r={70} fill="#FFE2A8" opacity={0.8 * dawn} />
      <rect y={820} width={1920} height={260} fill="#6E9BB5" />
      {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${i * 340 + ((t * 30) % 340)},${880 + i * 24} q40,-10 80,0`} stroke="#E6F0F4" strokeWidth={4} fill="none" opacity={0.6} />)}
      {/* tepe ve evler */}
      <path d="M0,820 Q480,700 960,740 T1920,780 V840 H0Z" fill="#CDB68A" />
      {Array.from({ length: 22 }, (_, i) => <rect key={i} x={i * 90 - 10} y={760 - (rnd(i) * 50 + 30)} width={80} height={rnd(i) * 50 + 60} fill={["#E9DCC2", "#D8C7A4", "#C9A27A"][i % 3]} stroke={H.ln} strokeWidth={2} />)}
      {min(700, 220)}{min(1220, 220)}{min(760, 200)}{min(1160, 200)}
      {dome(960, 640, 170, rebuilt > 0 ? 0 : collapse)}
      {dome(400, 690, 90)}{dome(1560, 700, 80)}
      {dust > 0 && Array.from({ length: 8 }, (_, i) => <circle key={i} cx={300 + i * 200 + Math.sin(t * 0.5 + i) * 40} cy={720 - (t % 6) * 6 - rnd(i) * 80} r={90 + rnd(i) * 120} fill="#D9C8A8" opacity={0.45 * dust} />)}
      {Array.from({ length: 5 }, (_, i) => <path key={`b${i}`} d={`M${300 + i * 300 + ((t * 40 + i * 80) % 400)},${300 + i * 40} q12,-12 24,0 q12,-12 24,0`} stroke={H.ln} strokeWidth={3} fill="none" />)}
    </g>
  );
};

// Hasarlı sokak: çatlak duvarlar, moloz, çadırlar
export const YikikSokak: React.FC<{ t: number; crowd?: number; tents?: number }> = ({ t, crowd = 1, tents = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#C9D9E2" />
    {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${i * 330 - 20},300)`}>
      <rect width={300} height={420} fill={["#E9DCC2", "#D8C7A4"][i % 2]} stroke={H.ln} strokeWidth={4} />
      <rect x={-10} y={-30} width={320} height={40} fill="#9A5A3A" stroke={H.ln} strokeWidth={4} transform={i % 2 ? "rotate(4 150 0)" : ""} />
      {[0, 1].map((j) => <rect key={j} x={40 + j * 140} y={80} width={80} height={120} fill="#6D8FA6" stroke={H.ln} strokeWidth={3} />)}
      <path d={`M${60 + i * 20},0 l30,90 l-20,60 l40,90 l-10,80`} stroke={H.ln} strokeWidth={4} fill="none" />
    </g>)}
    <rect y={720} width={1920} height={360} fill="#BBA987" />
    {Array.from({ length: 18 }, (_, i) => <rect key={i} x={rnd(i) * 1900} y={760 + rnd(i + 4) * 200} width={50 + rnd(i + 1) * 70} height={30 + rnd(i + 2) * 30} rx={6} fill={["#B9A07A", "#8E7656", "#CDB68A"][i % 3]} stroke={H.ln} strokeWidth={3} transform={`rotate(${(rnd(i + 7) - 0.5) * 50} ${rnd(i) * 1900} 800)`} />)}
    {tents > 0 && [260, 1500].map((x, i) => <Cadir key={i} x={x} y={900} s={0.8} t={t} />)}
    {crowd > 0 && Array.from({ length: 12 }, (_, i) => <HTiny key={i} x={120 + i * 150 + Math.sin(t + i) * 8} y={1060} s={2.1} c={["#5E3B20", "#2B4A8A", "#C2477A", "#3A5A3A"][i % 4]} />)}
  </g>
);

// Çadır (dıştan)
export const Cadir: React.FC<{ x: number; y: number; s?: number; t: number; lit?: number }> = ({ x, y, s = 1, t, lit = 0 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M-260,0 L0,-300 L260,0Z`} fill="#E6D3A8" stroke={H.ln} strokeWidth={5} />
    <path d={`M-260,0 L0,-300 L-120,0Z`} fill="#D2BA8A" />
    <path d={`M-70,0 L0,-150 L70,0Z`} fill={lit ? "#F2C46A" : "#5E4630"} opacity={lit ? 0.9 : 1} />
    <path d={`M-70,0 L0,-150 L${-30 + Math.sin(t * 2) * 6},0Z`} fill="#C8B080" stroke={H.ln} strokeWidth={3} />
    <line x1={0} y1={-300} x2={0} y2={-340} stroke={H.wood2} strokeWidth={8} />
    <path d={`M0,-336 l50,${10 + Math.sin(t * 5) * 6} l-50,14Z`} fill={H.red} />
    <line x1={-260} y1={0} x2={-330} y2={20} stroke={H.ln} strokeWidth={3} /><line x1={260} y1={0} x2={330} y2={20} stroke={H.ln} strokeWidth={3} />
  </g>
);

// Bahçe: çatlak ev + çadır
export const CadirBahce: React.FC<{ t: number; night?: number }> = ({ t, night = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#1C2440" : "#CFE0EA"} />
    {night > 0 && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 3) * 500} r={2 + rnd(i) * 2} fill="#FFF6D8" opacity={0.5 + Math.sin(t * 2 + i) * 0.3} />)}
    <g transform="translate(1180,220)">
      <rect width={620} height={560} fill={night ? "#5A5068" : "#E9DCC2"} stroke={H.ln} strokeWidth={5} />
      <path d="M-30,0 L310,-150 L650,0Z" fill={night ? "#4A3040" : "#9A5A3A"} stroke={H.ln} strokeWidth={5} />
      {[0, 1, 2].map((j) => <rect key={j} x={60 + j * 190} y={90} width={110} height={150} fill="#6D8FA6" stroke={H.ln} strokeWidth={3} />)}
      <path d="M200,0 l40,120 l-30,90 l60,140 l-20,210" stroke={H.ln} strokeWidth={6} fill="none" />
    </g>
    <rect y={780} width={1920} height={300} fill={night ? "#2E3A2C" : "#9DB37A"} />
    <g transform="translate(200,520)"><rect x={-14} y={0} width={28} height={300} fill={H.wood2} /><circle cx={0} cy={-20} r={150} fill={night ? "#26402C" : "#5F8A4A"} /><circle cx={-90} cy={40} r={100} fill={night ? "#26402C" : "#6E9A55"} /></g>
    <Cadir x={720} y={920} s={1.1} t={t} lit={night} />
  </g>
);

// Çadırın içi
export const CadirIc2: React.FC<{ t: number; night?: number }> = ({ t, night = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#3A2A20" : "#E6D3A8"} />
    <path d="M0,0 L960,-200 L1920,0 V900 H0Z" fill={night ? "#5A4030" : "#EFDFB8"} />
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={960} y1={-200} x2={i * 240} y2={900} stroke={night ? "#4A3424" : "#D2BA8A"} strokeWidth={6} />)}
    <rect x={948} y={0} width={24} height={900} fill={H.wood2} />
    <rect y={880} width={1920} height={200} fill={night ? "#4A3A2A" : "#B8323A"} />
    <rect y={900} width={1920} height={30} fill={H.gold} opacity={0.5} />
    {night > 0 && <circle cx={1500} cy={760} r={320} fill="url(#hLamp)" opacity={0.7} />}
  </g>
);

// Hamam içi: kubbe, fil gözleri (ışık delikleri), göbek taşı, kurnalar, buhar
export const Hamam: React.FC<{ t: number; steam?: number; crowd?: number; rays?: number }> = ({ t, steam = 1, crowd = 0, rays = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#D7CDBA" />
    <path d="M0,520 A960,620 0 0 1 1920,520 V0 H0Z" fill="#C8BBA2" />
    <path d="M80,560 A880,560 0 0 1 1840,560" fill="none" stroke={H.ln} strokeWidth={6} />
    {Array.from({ length: 22 }, (_, i) => { const a = Math.PI * (0.12 + (i / 21) * 0.76), r = 520 + (i % 3) * 110; const x = 960 + Math.cos(a) * r * 1.3, y = 560 - Math.sin(a) * r * 0.8; return <g key={i}><polygon points={Array.from({ length: 10 }, (_, k) => { const rr = k % 2 ? 9 : 20, aa = (k / 10) * Math.PI * 2; return `${x + Math.cos(aa) * rr},${y + Math.sin(aa) * rr}`; }).join(" ")} fill="#FFF6D8" />{rays > 0 && <path d={`M${x - 8},${y} L${x - 60 + (x - 960) * 0.15},${1000} L${x + 60 + (x - 960) * 0.15},${1000} L${x + 8},${y}Z`} fill="#FFF6D8" opacity={0.08 * rays} />}</g>; })}
    <rect y={780} width={1920} height={300} fill="#E8E2D6" />
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={i * 170} y1={780} x2={i * 170 - 120} y2={1080} stroke="#CFC6B6" strokeWidth={3} />)}
    {/* göbek taşı */}
    <path d="M520,840 L1400,840 L1480,900 L440,900Z" fill="#F2EEE6" stroke={H.ln} strokeWidth={5} />
    <rect x={440} y={900} width={1040} height={60} fill="#DCD4C6" stroke={H.ln} strokeWidth={5} />
    {/* kurnalar */}
    {[90, 1730].map((x, i) => <g key={i} transform={`translate(${x},640)`}><rect x={-10} y={-120} width={120} height={120} rx={10} fill="#E8E2D6" stroke={H.ln} strokeWidth={4} /><path d="M50,-110 v20" stroke="#B8C7CF" strokeWidth={8} /><path d={`M0,0 h100 l-14,90 h-72Z`} fill="#F2EEE6" stroke={H.ln} strokeWidth={4} /><path d={`M50,-90 Q${52 + Math.sin(t * 9) * 2},-40 50,0`} stroke="#9EC3D6" strokeWidth={6} fill="none" opacity={0.8} /></g>)}
    {crowd > 0 && Array.from({ length: 9 }, (_, i) => <HTiny key={i} x={560 + i * 100} y={850} s={1.6} c={["#E9A48F", "#A9CADB", "#B9A6D2", "#E9DCC2"][i % 4]} />)}
    {steam > 0 && Array.from({ length: 12 }, (_, i) => { const p = ((t * 0.08 + rnd(i)) % 1); return <circle key={`s${i}`} cx={rnd(i + 2) * 1920 + Math.sin(t * 0.4 + i) * 60} cy={1000 - p * 900} r={160 + rnd(i) * 160} fill="#FFFFFF" opacity={0.18 * steam * Math.sin(p * Math.PI)} />; })}
  </g>
);

// Tas, nalın, kese, sabun köpüğü (yakın plan)
export const HamamTakim: React.FC<{ t: number; foam?: number }> = ({ t, foam = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E8E2D6" />
    <g transform="translate(560,560)"><ellipse rx={260} ry={80} fill="#C9A66A" stroke={H.ln} strokeWidth={6} /><path d="M-260,0 Q-240,180 0,200 Q240,180 260,0" fill="#D6B47A" stroke={H.ln} strokeWidth={6} />{Array.from({ length: 12 }, (_, i) => <circle key={i} cx={-200 + i * 36} cy={40 + Math.sin(i) * 20} r={6} fill="#8A6A3A" />)}</g>
    <g transform="translate(1260,700)">{[0, 1].map((i) => <g key={i} transform={`translate(${i * 220},0) rotate(${-8 + i * 12})`}><rect x={-60} y={-30} width={120} height={60} rx={20} fill={H.wood} stroke={H.ln} strokeWidth={5} /><rect x={-50} y={-50} width={100} height={22} rx={8} fill={H.red} /><rect x={-50} y={30} width={22} height={50} fill={H.wood2} /><rect x={28} y={30} width={22} height={50} fill={H.wood2} /></g>)}</g>
    <g transform="translate(1350,330) rotate(-12)"><rect x={-140} y={-80} width={280} height={160} rx={30} fill="#7A4A2A" stroke={H.ln} strokeWidth={5} />{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={-120 + (i % 10) * 26} cy={-60 + Math.floor(i / 10) * 36} r={5} fill="#5E3B20" />)}</g>
    {foam > 0 && Array.from({ length: 26 }, (_, i) => <circle key={`f${i}`} cx={560 + (rnd(i) - 0.5) * 520} cy={500 - rnd(i + 3) * 220 - Math.sin(t * 2 + i) * 10} r={(20 + rnd(i + 5) * 50) * foam} fill="#FFFFFF" stroke="#DDE6EC" strokeWidth={3} opacity={0.95} />)}
  </g>
);

// Kahve tepsisi ve fincanlar
export const KahveTepsi: React.FC<{ x: number; y: number; s?: number; t: number; cups?: number }> = ({ x, y, s = 1, t, cups = 3 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <ellipse rx={220} ry={60} fill={H.gold} stroke={H.ln} strokeWidth={5} />
    <ellipse rx={190} ry={46} fill="#E9C37A" />
    {Array.from({ length: cups }, (_, i) => <g key={i} transform={`translate(${-120 + i * 120},-20)`}><path d="M-36,-40 h72 l-10,60 h-52Z" fill="#FFFDF8" stroke={H.ln} strokeWidth={4} /><rect x={-36} y={-46} width={72} height={10} fill={H.cobalt} /><path d={`M-10,-56 q${6 + Math.sin(t * 3 + i) * 6},-20 0,-40`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.6} /></g>)}
  </g>
);

// Çeyiz duvarı: asılı işlemeler, yastıklar, havlular
export const CeyizDuvar: React.FC<{ t: number; k?: number; crowd?: number }> = ({ t, k = 1, crowd = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={H.plaster} />
    <line x1={60} y1={170} x2={1860} y2={170} stroke={H.wood2} strokeWidth={8} />
    {Array.from({ length: 9 }, (_, i) => { const show = cl(k * 9 - i); const c = [H.red, H.cobalt, H.green, H.purple, H.crimson, H.turq][i % 6]; return <g key={i} transform={`translate(${120 + i * 200},170)`} opacity={show}>
      <path d={`M-80,0 h160 v${300 + (i % 3) * 60} l-80,${30 + Math.sin(t * 2 + i) * 6} l-80,-${30}Z`} fill="#FFF6E2" stroke={H.ln} strokeWidth={4} />
      {Array.from({ length: 4 }, (_, j) => <path key={j} d={`M-60,${60 + j * 70} q30,-30 60,0 q30,30 60,0`} stroke={c} strokeWidth={8} fill="none" />)}
      <path d={`M-80,${300 + (i % 3) * 60} ${Array.from({ length: 8 }, (_, j) => `l10,16 l10,-16`).join(" ")}`} stroke={c} strokeWidth={5} fill="none" />
    </g>; })}
    <rect y={760} width={1920} height={320} fill={H.floor2} />
    {Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${260 + i * 340},860)`} opacity={cl(k * 5 - i)}><rect x={-120} y={-60} width={240} height={120} rx={40} fill={[H.red, H.cobalt, H.gold, H.green, H.purple][i]} stroke={H.ln} strokeWidth={5} /><circle r={30} fill={H.cream} opacity={0.7} /></g>)}
    {crowd > 0 && Array.from({ length: 10 }, (_, i) => <HTiny key={`c${i}`} x={120 + i * 190} y={1090} s={2.2} c={["#C2477A", "#2B5DA8", "#E9B23A", "#5B3A86"][i % 4]} />)}
  </g>
);

// Kına yakılmış eller (yakın plan)
export const KinaEller: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#3A2420" />
    {Array.from({ length: 14 }, (_, i) => <g key={i}><rect x={120 + i * 130} y={160 + (i % 2) * 40} width={20} height={70} fill="#F5E8CC" /><path d={`M130,${150 + (i % 2) * 40} q${8 + Math.sin(t * 7 + i) * 4},-20 0,-40 q-8,20 0,40`} transform={`translate(${i * 130},0)`} fill="#FFC861" /></g>)}
    {[-1, 1].map((sd, i) => <g key={i} transform={`translate(${960 + sd * 230},640) scale(${sd},1)`}>
      <path d="M-120,200 Q-150,40 -100,-40 L-90,-200 Q-70,-230 -50,-200 L-40,-60 L-20,-230 Q0,-260 20,-230 L20,-60 L50,-210 Q70,-240 90,-210 L70,-40 L120,-120 Q150,-130 150,-100 L100,60 Q80,200 40,220Z" fill="#F2D7BE" stroke={H.ln} strokeWidth={5} />
      <circle cx={0} cy={60} r={70 * k} fill="#B5452A" opacity={0.85} />
      {[-70, 0, 70].map((fx, j) => <rect key={j} x={fx - 18} y={-220} width={36} height={70 * k} rx={16} fill="#B5452A" opacity={0.85} />)}
    </g>)}
  </g>
);

// Ocak başı (mutfak): kazan, ateş
export const Ocak: React.FC<{ t: number; x?: number; y?: number; s?: number }> = ({ t, x = 1450, y = 860, s = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d="M-200,0 V-360 Q0,-460 200,-360 V0Z" fill="#B9A07A" stroke={H.ln} strokeWidth={6} />
    <path d="M-120,0 V-180 Q0,-260 120,-180 V0Z" fill="#2A1C14" />
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${-60 + i * 30},0 q${10 + Math.sin(t * 8 + i) * 8},-${60 + Math.sin(t * 6 + i * 2) * 20} 20,-${90 + Math.sin(t * 5 + i) * 20} q10,40 10,90Z`} fill={i % 2 ? "#FFB040" : "#E8602A"} />)}
    <path d="M-110,-150 h220 l-20,90 h-180Z" fill="#5A5A5A" stroke={H.ln} strokeWidth={5} />
    {Array.from({ length: 3 }, (_, i) => <path key={`s${i}`} d={`M${-40 + i * 40},-160 q20,-40 0,-80`} stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.5 * (0.5 + Math.sin(t * 3 + i) * 0.5)} />)}
  </g>
);

// Mendile sarılı lokum
export const Lokum: React.FC<{ x: number; y: number; s?: number; open?: number }> = ({ x, y, s = 1, open = 1 }) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    <path d={`M-200,40 L${-120 - open * 80},-${80 + open * 40} L0,-30 L${120 + open * 80},-${80 + open * 40} L200,40 L0,110Z`} fill="#F5E8CC" stroke={H.ln} strokeWidth={5} />
    {Array.from({ length: 4 }, (_, i) => <g key={i} transform={`translate(${-60 + (i % 2) * 90},${-10 + Math.floor(i / 2) * 60})`} opacity={open}><rect x={-36} y={-30} width={72} height={60} rx={10} fill={["#F3A6B8", "#FFFFFF", "#F3A6B8", "#FFF2C8"][i]} stroke={H.ln} strokeWidth={3} />{Array.from({ length: 6 }, (_, k) => <circle key={k} cx={-24 + (k % 3) * 24} cy={-14 + Math.floor(k / 3) * 28} r={3} fill="#FFFFFF" />)}</g>)}
  </g>
);

// Mehir: kese ve sayılan akçeler
export const MehirKese: React.FC<{ t: number; a: number; n?: number }> = ({ t, a, n = 12 }) => (
  <g>
    {Array.from({ length: n }, (_, i) => { const p = cl((t - a - i * 0.12) / 0.4); return <g key={i} transform={`translate(${700 + (i % 6) * 100},${lerp(200, 620 - Math.floor(i / 6) * 30, p)})`} opacity={p}><circle r={40} fill={H.gold} stroke={H.ln} strokeWidth={4} /><circle r={26} fill="none" stroke="#A88028" strokeWidth={3} /></g>; })}
  </g>
);

// Sandıktaki kırmızı duvak (tozlu)
export const DuvakSandik: React.FC<{ t: number; dust?: number }> = ({ t, dust = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#3A2A20" />
    <g transform="translate(960,700)">
      <rect x={-520} y={-80} width={1040} height={360} fill={H.wood} stroke={H.ln} strokeWidth={8} />
      <rect x={-520} y={-80} width={1040} height={40} fill={H.gold} opacity={0.6} />
      <path d="M-520,-80 L-480,-420 L480,-420 L520,-80" fill={H.wood2} stroke={H.ln} strokeWidth={8} />
      <path d={`M-440,-60 Q-200,${-200 + Math.sin(t) * 8} 0,-90 Q200,${-210 + Math.cos(t) * 8} 440,-60 L420,60 Q0,10 -420,60Z`} fill={H.red} stroke={H.ln} strokeWidth={5} />
      {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={-400 + i * 54} cy={-40 + Math.sin(i) * 30} r={4} fill={H.gold} />)}
      {dust > 0 && Array.from({ length: 30 }, (_, i) => <circle key={`d${i}`} cx={-420 + rnd(i) * 840} cy={-80 + rnd(i + 4) * 120} r={3 + rnd(i) * 4} fill="#D9C8A8" opacity={0.7 * dust} />)}
    </g>
  </g>
);

// Kadı sicili sayfası
export const Sicil: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2018" />
    <g transform="translate(960,560) rotate(-2)">
      <rect x={-560} y={-420} width={1120} height={840} fill="#EAD9B2" stroke={H.ln} strokeWidth={6} />
      <rect x={-560} y={-420} width={1120} height={840} fill="url(#hDamask)" opacity={0.15} />
      {Array.from({ length: 13 }, (_, i) => <path key={i} d={`M${440 - (i % 2) * 40},${-340 + i * 56} ${Array.from({ length: 14 }, (_, j) => `q-${18 + rnd(i * 20 + j) * 20},${-10 - rnd(j + i) * 10} -${40 + rnd(i + j * 3) * 26},0`).join(" ")}`} stroke="#3A2A1A" strokeWidth={5} fill="none" strokeDasharray={`${k * 1600} 1600`} opacity={0.85} />)}
      <circle cx={-420} cy={300} r={60} fill="#8E2F2A" opacity={0.75} />
    </g>
  </g>
);

// Avrupalı hanım (1717 yolculuk elbisesi, şapka). open: ceketin önü açık, korse görünür.
export const Lady: React.FC<{ x: number; y: number; s?: number; t: number; open?: number; look?: number; face?: "normal" | "smile" | "shock" }> = ({ x, y, s = 1, t, open = 0, look = 0, face = "normal" }) => {
  const br = Math.sin(t * 2) * 2, blink = blinkAt(t, 7);
  return (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
      <path d={`M-150,0 Q-120,-150 -60,-200 L60,-200 Q120,-150 150,0Z`} fill="#3A5A7A" stroke={H.ln} strokeWidth={5} />
      <path d={`M-62,-200 L-70,-${300 + br} L70,-${300 + br} L62,-200Z`} fill="#2E4A66" stroke={H.ln} strokeWidth={5} />
      {open > 0 && <path d={`M-${40 * open},-${296 + br} L-30,-205 L30,-205 L${40 * open},-${296 + br}Z`} fill="#F2E6D0" stroke={H.ln} strokeWidth={4} />}
      {open > 0 && Array.from({ length: 5 }, (_, i) => <line key={i} x1={-24 * open} y1={-280 + i * 16} x2={24 * open} y2={-280 + i * 16} stroke="#B89A6A" strokeWidth={3} />)}
      <rect x={-12} y={-322 - br} width={24} height={26} fill={H.face} />
      <path d="M-60,-300 q-30,60 -20,120" stroke={H.ln} strokeWidth={14} strokeLinecap="round" fill="none" />
      <path d="M60,-300 q30,60 20,120" stroke={H.ln} strokeWidth={14} strokeLinecap="round" fill="none" />
      <g transform={`translate(${look * 8},${-380 - br})`}>
        <ellipse rx={50} ry={60} fill={H.face} stroke={H.ln} strokeWidth={4} />
        <path d="M-52,-10 Q-60,-70 0,-70 Q60,-70 52,-10 Q40,-40 0,-44 Q-40,-40 -52,-10Z" fill="#8A5A34" />
        {blink ? <><line x1={-26} y1={0} x2={-12} y2={0} stroke={H.ln} strokeWidth={4} /><line x1={12} y1={0} x2={26} y2={0} stroke={H.ln} strokeWidth={4} /></> : <><circle cx={-19 + look * 4} cy={0} r={face === "shock" ? 7 : 5} fill={H.ln} /><circle cx={19 + look * 4} cy={0} r={face === "shock" ? 7 : 5} fill={H.ln} /></>}
        {face === "smile" ? <path d="M-14,24 q14,12 28,0" stroke={H.ln} strokeWidth={4} fill="none" /> : face === "shock" ? <ellipse cy={28} rx={8} ry={10} fill={H.ln} /> : <line x1={-10} y1={26} x2={10} y2={26} stroke={H.ln} strokeWidth={4} />}
        <ellipse cy={-62} rx={90} ry={18} fill="#1E2A3A" stroke={H.ln} strokeWidth={4} />
        <path d="M-46,-66 Q0,-130 46,-66Z" fill="#1E2A3A" stroke={H.ln} strokeWidth={4} />
        <path d={`M30,-100 q${50 + Math.sin(t * 3) * 6},-30 70,10`} stroke="#F5F0E6" strokeWidth={14} strokeLinecap="round" fill="none" />
      </g>
    </g>
  );
};

// Ceviz kabuğu ve iğne: çocuğun koluna küçük çizik (aşı)
export const CevizAsi: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#3A2A20" />
    <g transform="translate(700,600)"><path d="M-460,60 Q-200,-40 300,0 Q340,80 300,140 Q-200,160 -460,140Z" fill="#F2D7BE" stroke={H.ln} strokeWidth={5} /><path d={`M60,40 l${80 * k},6`} stroke="#B5452A" strokeWidth={6} strokeLinecap="round" /></g>
    <g transform="translate(1340,420)"><ellipse rx={130} ry={90} fill="#8A6A3A" stroke={H.ln} strokeWidth={6} /><ellipse rx={100} ry={60} fill="#5E4426" />{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${-110 + i * 30},-60 q10,-20 20,0`} stroke="#6E5230" strokeWidth={4} fill="none" />)}</g>
    <g transform={`translate(${lerp(1180, 820, k)},${lerp(360, 600, k)}) rotate(-35)`}><rect x={-4} y={-220} width={8} height={220} fill="#C9CED2" stroke={H.ln} strokeWidth={2} /><circle cy={-226} r={8} fill="none" stroke="#C9CED2" strokeWidth={4} /></g>
    <path d={`M1460,1080 Q1400,${760 + Math.sin(t) * 6} 1200,${lerp(420, 640, k)}`} stroke="#E9C8A8" strokeWidth={90} strokeLinecap="round" fill="none" />
  </g>
);

// Mektup yazan yabancı hanım (mum ışığı, tüy kalem)
export const MektupMasa: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2018" />
    <circle cx={1400} cy={360} r={420} fill="url(#hLamp)" opacity={0.8} />
    <rect y={700} width={1920} height={380} fill={H.wood2} />
    <g transform="translate(900,760) rotate(-4)"><rect x={-420} y={-120} width={840} height={300} fill="#F4E9CF" stroke={H.ln} strokeWidth={5} />{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M-360,${-70 + i * 40} ${Array.from({ length: 10 }, (_, j) => `q20,${-8 - (j % 3) * 3} 40,0 q20,8 30,0`).join(" ")}`} stroke="#2A2A3A" strokeWidth={4} fill="none" strokeDasharray={`${cl(k * 6 - i) * 800} 800`} />)}</g>
    <g transform={`translate(${1180 + Math.sin(t * 6) * 10},${620 + Math.cos(t * 7) * 6}) rotate(30)`}><path d="M0,0 L-14,-260 Q40,-200 30,-40Z" fill="#F5F0E6" stroke={H.ln} strokeWidth={4} /></g>
    <g transform="translate(1500,640)"><rect x={-24} y={-140} width={48} height={140} fill="#F5E8CC" stroke={H.ln} strokeWidth={4} /><path d={`M0,-150 q${10 + Math.sin(t * 9) * 4},-30 0,-60 q-10,30 0,60`} fill="#FFC861" /></g>
  </g>
);
