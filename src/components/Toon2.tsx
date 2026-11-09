import React from "react";
import { ramp } from "../lib/cues";
import { MINI_COLS, T, TFig, TMini, lerp } from "./Toon";

// Kanal 2 toon kiti, ek mekânlar (k2r-03 "Hafıza" ile eklendi): Kadıköy iskelesi + vapur + martılar, mahalle kahvesi + okey,
// hastane koridoru, sınav salonu, kafanın içindeki hafıza kütüphanesi, yağmurlu otobüs durağı, kartvizit, dosya, yüz ızgarası, defter.

// ───────── Kadıköy iskelesi ─────────
export const Gull: React.FC<{ x: number; y: number; t: number; s?: number; seed?: number }> = ({ x, y, t, s = 1, seed = 0 }) => {
  const f = Math.sin(t * 9 + seed) * 18;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d={`M-40,${-f * 0.6} Q-20,-10 0,0 Q20,-10 40,${-f * 0.6}`} stroke="#FFFFFF" strokeWidth={9} fill="none" strokeLinecap="round" />
      <path d={`M-40,${-f * 0.6} Q-20,-10 0,0 Q20,-10 40,${-f * 0.6}`} stroke="#9AA5AD" strokeWidth={3} fill="none" strokeLinecap="round" opacity={0.6} />
      <circle cx={0} cy={2} r={6} fill="#FFFFFF" /><path d="M5,2 l8,2 l-8,2Z" fill={T.orange} />
    </g>
  );
};
export const Vapur: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => (
  <g transform={`translate(${x},${y + Math.sin(t * 1.6) * 4}) scale(${s})`}>
    <path d="M-420,0 L420,0 L380,70 L-380,70Z" fill="#1E2A3A" />
    <rect x={-420} y={-10} width={840} height={14} fill="#E0393E" />
    <rect x={-360} y={-120} width={720} height={110} fill="#FFFFFF" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-340 + i * 58} y={-100} width={40} height={36} rx={6} fill="#9FD3EC" />)}
    <rect x={-260} y={-190} width={520} height={70} fill="#F4F4F4" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-240 + i * 62} y={-175} width={42} height={30} rx={5} fill="#9FD3EC" />)}
    <rect x={-40} y={-300} width={80} height={110} fill="#F6C445" /><rect x={-40} y={-300} width={80} height={22} fill="#1E2A3A" />
    <path d="M-40,-300 C-60,-340 -20,-370 10,-350" stroke="#BFC7CF" strokeWidth={22} fill="none" opacity={0.5 + 0.3 * Math.sin(t * 2)} strokeLinecap="round" />
    <text x={0} y={-30} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#1E2A3A">KADIKÖY</text>
  </g>
);
export const Iskele: React.FC<{ t: number; px?: number; crowd?: boolean; boat?: number; dusk?: number }> = ({ t, px = 0, crowd = true, boat = 1, dusk = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill={dusk ? "url(#tSkyDusk)" : "url(#tSkyDay)"} />
    <circle cx={1500} cy={330} r={90} fill="#FBD38D" opacity={0.85 * dusk} />
    {/* tarihi yarımada silueti */}
    <g fill="#5A4A6A" opacity={0.75}>
      <path d="M0,470 L0,420 L120,420 L140,380 L260,380 L300,410 L420,410 L420,470Z" />
      <g transform="translate(560,470)"><path d="M-110,0 L-110,-60 A110,90 0 0 1 110,-60 L110,0Z" /><rect x={-150} y={-160} width={10} height={160} /><rect x={140} y={-160} width={10} height={160} /><path d="M-150,-160 l5,-30 l5,30Z M140,-160 l5,-30 l5,30Z" /></g>
      <g transform="translate(980,470)"><path d="M-130,0 L-130,-70 A130,100 0 0 1 130,-70 L130,0Z" /><rect x={-190} y={-190} width={12} height={190} /><rect x={178} y={-190} width={12} height={190} /><rect x={-230} y={-150} width={10} height={150} /><rect x={220} y={-150} width={10} height={150} /></g>
      <path d="M1180,470 L1180,400 L1300,400 L1340,360 L1560,360 L1560,470Z" /><rect x={1640} y={300} width={50} height={170} /><path d="M1640,300 l25,-60 l25,60Z" />
    </g>
    <rect y={470} width={1920} height={330} fill="#2F6E9E" />
    <rect y={470} width={1920} height={330} fill="#F7A86A" opacity={0.18 * dusk} />
    {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${((i * 173 + t * 25) % 2100) - 100},${500 + (i % 7) * 42} q22,-8 44,0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.45} />)}
    {boat > 0 && <Vapur x={lerp(2300, 1250, boat)} y={690} s={0.85} t={t} />}
    <g transform={`translate(${-px},0)`}>
      {/* iskele binası */}
      <rect x={-200} y={420} width={760} height={400} fill="#F3E7D3" />
      <path d="M-220,420 L580,420 L540,350 L-180,350Z" fill="#B23A3F" />
      {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-150 + i * 180},820 L${-150 + i * 180},560 A70,70 0 0 1 ${-10 + i * 180},560 L${-10 + i * 180},820Z`} fill="#3A2A20" />)}
      <rect x={60} y={440} width={300} height={70} rx={10} fill="#1E2A3A" /><text x={210} y={490} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#F6C445">KADIKÖY</text>
      <g transform="translate(470,480)"><circle r={50} fill="#FFFFFF" stroke="#333" strokeWidth={8} /><path d={`M0,0 L${Math.sin(t * 0.4) * 30},${-Math.cos(t * 0.4) * 30} M0,0 L${Math.sin(t * 5) * 40},${-Math.cos(t * 5) * 40}`} stroke="#333" strokeWidth={5} strokeLinecap="round" /></g>
      {/* rıhtım babaları */}
      {Array.from({ length: 12 }, (_, i) => <g key={i}><rect x={600 + i * 160} y={790} width={26} height={40} rx={6} fill="#3A3F48" /></g>)}
    </g>
    <rect y={820} width={1920} height={260} fill="#A79A88" />
    {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${i * 130 - (px % 130)},820 V1080`} stroke="#8F8270" strokeWidth={4} />)}
    <rect y={820} width={1920} height={10} fill="#6E6456" />
    {[[300, 220, 0], [520, 160, 2], [1200, 250, 4], [1700, 190, 6]].map(([x, y, sd], i) => <Gull key={i} x={(x + t * 40 * (i % 2 ? 1 : -1) + 3000) % 2100 - 90} y={y + Math.sin(t + i) * 20} t={t} s={1.1} seed={sd} />)}
    {crowd && Array.from({ length: 16 }, (_, i) => {
      const x = ((i * 157 + t * (i % 2 ? 36 : -30)) % 2300 + 2300) % 2300 - 200;
      return <TMini key={i} x={x} y={1000 + (i % 3) * 18} s={1.25 + (i % 3) * 0.1} c={MINI_COLS[(i * 7) % MINI_COLS.length]} t={t} seed={i} />;
    })}
  </g>
);
export const Umbrella: React.FC<{ c?: string; broken?: boolean; s?: number }> = ({ c = T.blue, broken, s = 1 }) => (
  <g transform={`scale(${s})`}>
    <path d="M0,0 V-150" stroke="#333" strokeWidth={6} /><path d="M0,0 q0,20 -16,20" stroke="#333" strokeWidth={6} fill="none" />
    <path d="M-120,-150 Q0,-260 120,-150 Q90,-170 60,-150 Q30,-170 0,-150 Q-30,-170 -60,-150 Q-90,-170 -120,-150Z" fill={c} />
    {broken && <path d="M60,-150 L100,-110" stroke="#333" strokeWidth={4} />}
  </g>
);

// ───────── mahalle kahvesi + okey ─────────
export const Kahvehane: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9D3A8" />
    <rect y={0} width={1920} height={760} fill="url(#tBrick)" opacity={0.35} />
    <rect y={560} width={1920} height={200} fill="#8A5A32" /><rect y={560} width={1920} height={14} fill="#6B4426" />
    {[0, 1, 2].map((i) => <rect key={i} x={160 + i * 560} y={600} width={480} height={130} rx={6} fill="#7A4E2C" stroke="#5A3820" strokeWidth={6} />)}
    <rect x={140} y={110} width={520} height={330} fill="#BFE6F2" stroke="#8A5A32" strokeWidth={18} /><path d="M400,110 V440 M140,275 H660" stroke="#8A5A32" strokeWidth={10} />
    <text x={400} y={210} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={44} fill="#B23A3F" opacity={0.75} transform="scale(-1,1) translate(-800,0)">KIRAATHANESİ</text>
    {/* duvarda saat, takım posteri, televizyon */}
    <g transform="translate(860,220)"><circle r={70} fill="#FFFFFF" stroke="#5A3820" strokeWidth={10} /><path d={`M0,0 L${Math.sin(t * 0.3) * 40},${-Math.cos(t * 0.3) * 40} M0,0 L${Math.sin(t * 4) * 56},${-Math.cos(t * 4) * 56}`} stroke="#333" strokeWidth={6} strokeLinecap="round" /></g>
    <g transform="translate(1100,130)"><rect width={260} height={170} fill="#F6C445" /><rect y={85} width={260} height={85} fill="#2C5AA0" /><circle cx={130} cy={85} r={40} fill="#FFFFFF" /><circle cx={130} cy={85} r={24} fill="#E0393E" /></g>
    <g transform="translate(1440,120)"><rect width={380} height={240} rx={14} fill="#1A1E26" /><rect x={16} y={16} width={348} height={196} fill="#3E8E5A" /><path d={`M30,${150 + Math.sin(t) * 6} H350`} stroke="#FFFFFF" strokeWidth={3} opacity={0.6} /><circle cx={190 + Math.sin(t * 1.3) * 120} cy={120 + Math.cos(t * 1.7) * 40} r={8} fill="#FFFFFF" /><rect x={170} y={240} width={40} height={40} fill="#1A1E26" /></g>
    {/* çay ocağı + semaver */}
    <g transform="translate(1680,560)"><rect x={-90} y={-60} width={180} height={60} fill="#B07A4A" /><path d="M-40,-60 L-40,-180 Q0,-220 40,-180 L40,-60Z" fill="#C9A24A" /><rect x={-50} y={-200} width={100} height={20} rx={6} fill="#8A6A2A" />
      {[0, 1].map((i) => <path key={i} d={`M${-10 + i * 20},-220 q-10,-20 0,-40`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.4 + 0.4 * Math.sin(t * 3 + i)} />)}</g>
    <ellipse cx={960} cy={120} rx={500} ry={160} fill="url(#tGlow)" opacity={0.35} />
    {[480, 1440].map((x) => <g key={x}><path d={`M${x},0 V70`} stroke="#333" strokeWidth={4} /><path d={`M${x - 50},70 L${x + 50},70 L${x + 30},110 L${x - 30},110Z`} fill="#2E7D5B" /><ellipse cx={x} cy={150} rx={140} ry={70} fill="url(#tGlow)" opacity={0.5} /></g>)}
    <rect y={760} width={1920} height={320} fill="#9E6B42" /><rect y={760} width={1920} height={320} fill="url(#tTile)" opacity={0.6} />
  </g>
);
const TILE_C = [T.red, "#1E2A3A", T.blue, T.yellow2];
export const OkeyTile: React.FC<{ x: number; y: number; n: number; c: number; s?: number; face?: boolean; glow?: number }> = ({ x, y, n, c, s = 1, face = true, glow = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {glow > 0 && <rect x={-30} y={-42} width={60} height={84} rx={10} fill={T.rim} opacity={glow * 0.6} />}
    <rect x={-22} y={-34} width={44} height={68} rx={6} fill="#F7F1E0" stroke="#C9BFA5" strokeWidth={3} />
    {face && <text y={10} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill={TILE_C[c % 4]}>{n}</text>}
    {face && <circle cy={22} r={4} fill={TILE_C[c % 4]} />}
  </g>
);
// üstten bakış okey masası (k: dağıtım ilerlemesi, hl: parlayan taş indeksleri)
export const OkeyTable: React.FC<{ t: number; k?: number; hl?: number[] }> = ({ t, k = 1, hl = [] }) => (
  <g>
    <rect width={1920} height={1080} fill="#6B4426" />
    <rect x={260} y={90} width={1400} height={900} rx={40} fill="#2E7D5B" stroke="#8A5A32" strokeWidth={30} />
    <rect x={300} y={130} width={1320} height={820} rx={24} fill="#2E7D5B" stroke="#3E9E6E" strokeWidth={4} />
    {/* dört ıstaka */}
    {[[960, 900, 0], [960, 180, 180], [370, 540, 90], [1550, 540, -90]].map(([x, y, r], i) => (
      <g key={i} transform={`translate(${x},${y}) rotate(${r})`}>
        <rect x={-380} y={-40} width={760} height={80} rx={10} fill="#C9A26A" />
        {Array.from({ length: 14 }, (_, j) => <OkeyTile key={j} x={-340 + j * 52} y={-6} n={((j * 7 + i * 3) % 13) + 1} c={(j + i) % 4} s={0.95} face={i === 0} />)}
      </g>
    ))}
    {/* ortadaki atılan taşlar */}
    {Array.from({ length: 10 }, (_, j) => {
      const kk = ramp(k * 10, j, j + 1);
      return <g key={j} opacity={kk}><OkeyTile x={700 + (j % 5) * 130} y={460 + Math.floor(j / 5) * 140} n={((j * 5) % 13) + 1} c={j % 4} s={1.3} glow={hl.includes(j) ? 0.6 + 0.4 * Math.sin(t * 6) : 0} /></g>;
    })}
    <g transform="translate(1260,320)"><rect x={-26} y={-30} width={52} height={50} rx={8} fill="#FFFFFF" opacity={0.9} /><rect x={-20} y={-24} width={40} height={38} rx={6} fill="#C9302C" /></g>
  </g>
);

// ───────── hastane koridoru (tek kaçış noktalı) ─────────
export const Hastane: React.FC<{ t: number; night?: boolean }> = ({ t, night = false }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#B8C7C9" : "#DDE9E8"} />
    <path d="M0,0 L760,380 L1160,380 L1920,0Z" fill={night ? "#C9D6D8" : "#EEF5F4"} />
    <path d="M0,1080 L760,640 L1160,640 L1920,1080Z" fill={night ? "#8FA3A6" : "#B5C9C6"} />
    <path d="M0,0 L760,380 L760,640 L0,1080Z" fill={night ? "#A9BCBF" : "#CFE0DE"} />
    <path d="M1920,0 L1160,380 L1160,640 L1920,1080Z" fill={night ? "#A9BCBF" : "#CFE0DE"} />
    <rect x={760} y={380} width={400} height={260} fill="#9FB8BB" />
    <rect x={880} y={440} width={160} height={200} fill="#6E8A8E" /><rect x={900} y={460} width={50} height={80} fill="#BFE6F2" opacity={0.6} /><rect x={970} y={460} width={50} height={80} fill="#BFE6F2" opacity={0.6} />
    {/* tavan ışıkları */}
    {[0, 1, 2, 3].map((i) => { const k = i / 4; const y = lerp(40, 360, k); const w = lerp(300, 70, k); return <rect key={i} x={960 - w / 2} y={y} width={w} height={lerp(26, 6, k)} rx={4} fill="#FFFFFF" opacity={i === 2 && Math.sin(t * 13) > 0.7 ? 0.4 : 1} />; })}
    {/* yan kapılar */}
    {[0, 1, 2].map((i) => { const k = i / 3; const x0 = lerp(60, 640, k), x1 = lerp(240, 700, k); const yt = lerp(140, 420, k), yb = lerp(960, 600, k); return <path key={i} d={`M${x0},${yt} L${x1},${yt + (x1 - x0) * 0.5} L${x1},${yb - (x1 - x0) * 0.58} L${x0},${yb}Z`} fill="#5E8C9E" />; })}
    {[0, 1, 2].map((i) => { const k = i / 3; const x0 = lerp(1860, 1280, k), x1 = lerp(1680, 1220, k); const yt = lerp(140, 420, k), yb = lerp(960, 600, k); return <path key={i} d={`M${x0},${yt} L${x1},${yt + (x0 - x1) * 0.5} L${x1},${yb - (x0 - x1) * 0.58} L${x0},${yb}Z`} fill="#5E8C9E" />; })}
    {/* duvar şeridi */}
    <path d="M0,620 L760,520 M1920,620 L1160,520" stroke="#3E8E9E" strokeWidth={10} />
    {/* bekleme sandalyeleri */}
    {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${1280 + i * 150},${830 + i * 30}) scale(${1 + i * 0.12})`}><rect x={-50} y={-90} width={100} height={70} rx={10} fill="#3A7BD5" /><rect x={-56} y={-26} width={112} height={22} rx={8} fill="#2A5DA8" /><rect x={-40} y={-6} width={8} height={60} fill="#555" /><rect x={32} y={-6} width={8} height={60} fill="#555" /></g>)}
    <g transform="translate(960,330)"><rect x={-90} y={-30} width={180} height={50} rx={8} fill="#3E8E5A" /><text y={8} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={26} fill="#FFFFFF">YOĞUN BAKIM</text></g>
  </g>
);

// ───────── sınav salonu ─────────
export const ExamHall: React.FC<{ t: number; crowd?: number }> = ({ t, crowd = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E8E2D0" />
    <rect x={0} y={0} width={1920} height={120} fill="#D9D0B8" />
    {[0, 1, 2, 3].map((i) => <g key={i}><rect x={120 + i * 460} y={150} width={300} height={260} fill="#BFE6F2" stroke="#FFFFFF" strokeWidth={14} /><path d={`M${270 + i * 460},150 V410`} stroke="#FFFFFF" strokeWidth={8} /></g>)}
    <g transform="translate(960,90)"><circle r={60} fill="#FFFFFF" stroke="#333" strokeWidth={8} /><path d={`M0,0 L${Math.sin(t * 0.5) * 34},${-Math.cos(t * 0.5) * 34} M0,0 L${Math.sin(t * 6) * 48},${-Math.cos(t * 6) * 48}`} stroke="#333" strokeWidth={5} strokeLinecap="round" /></g>
    <rect y={560} width={1920} height={520} fill="#C9A77E" /><rect y={560} width={1920} height={520} fill="url(#tTile)" />
    {crowd > 0 && [0, 1, 2].map((r) => Array.from({ length: 7 }, (_, i) => {
      const s = 0.8 + r * 0.22, y = 640 + r * 150, x = 180 + i * 260 + (r % 2) * 60;
      return (
        <g key={`${r}-${i}`}>
          <TMini x={x} y={y - 6} s={2.6 * s} c={MINI_COLS[(i + r * 3) % MINI_COLS.length]} t={t} seed={i + r * 7} />
          <rect x={x - 70 * s} y={y - 50 * s} width={140 * s} height={18 * s} rx={4} fill="#B07A4A" /><rect x={x - 60 * s} y={y - 32 * s} width={10 * s} height={40 * s} fill="#555" /><rect x={x + 50 * s} y={y - 32 * s} width={10 * s} height={40 * s} fill="#555" />
          <rect x={x - 30 * s} y={y - 58 * s} width={60 * s} height={10 * s} fill="#FFFFFF" />
        </g>
      );
    }))}
  </g>
);

// ───────── kafanın içindeki hafıza kütüphanesi ─────────
export const MindLib: React.FC<{ t: number; spin?: number; glow?: number }> = ({ t, spin = 0, glow = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#0F1E36" />
    <ellipse cx={960} cy={540} rx={900} ry={520} fill="#1B3358" />
    {/* sonsuz raflar: perspektif koridor */}
    {Array.from({ length: 8 }, (_, d) => {
      const k = d / 8, s = lerp(1, 0.18, k), cx = 960, cy = 520;
      const w = 1700 * s, h = 980 * s;
      return (
        <g key={d} opacity={lerp(1, 0.35, k)}>
          {[-1, 1].map((side) => (
            <g key={side}>
              <rect x={cx + side * w / 2 - (side > 0 ? 120 * s : 0)} y={cy - h / 2} width={120 * s} height={h} fill="#2A4A78" />
              {Array.from({ length: 6 }, (_, r) => Array.from({ length: 3 }, (_, b) => (
                <rect key={`${r}-${b}`} x={cx + side * w / 2 - (side > 0 ? 112 * s : -8 * s) + b * 36 * s} y={cy - h / 2 + 12 * s + r * (h / 6)} width={28 * s} height={h / 6 - 24 * s}
                  fill={MINI_COLS[(r * 3 + b + d * 5 + Math.floor(spin * 8)) % MINI_COLS.length]} opacity={0.9} />
              )))}
            </g>
          ))}
        </g>
      );
    })}
    {/* uçuşan anı kartları */}
    {Array.from({ length: 18 }, (_, i) => {
      const a = i * 0.9 + t * (0.3 + spin * 2.5);
      const r = 260 + (i % 5) * 70;
      const x = 960 + Math.cos(a) * r * 1.5, y = 520 + Math.sin(a) * r * 0.6;
      return <g key={i} transform={`translate(${x},${y}) rotate(${Math.sin(a) * 14})`} opacity={0.85}><rect x={-46} y={-30} width={92} height={60} rx={6} fill="#F7F1E0" /><rect x={-38} y={-22} width={76} height={30} fill={MINI_COLS[i % MINI_COLS.length]} opacity={0.7} /><rect x={-38} y={14} width={50} height={6} rx={3} fill="#999" /></g>;
    })}
    <ellipse cx={960} cy={520} rx={360} ry={260} fill="url(#tGlow)" opacity={0.15 + glow * 0.5} />
  </g>
);
// anı kartı (tarih damgalı polaroid)
export const MemCard: React.FC<{ x: number; y: number; s?: number; k?: number; date: string; rot?: number; children?: React.ReactNode }> = ({ x, y, s = 1, k = 1, date, rot = -3, children }) => (
  <g transform={`translate(${x},${y + (1 - k) * 80}) scale(${s * (0.7 + 0.3 * k)}) rotate(${rot})`} opacity={k}>
    <rect x={-210} y={-200} width={420} height={420} rx={8} fill="#FBF6E8" stroke="#D9CFB5" strokeWidth={4} />
    <rect x={-185} y={-175} width={370} height={300} fill="#BFE3F2" />
    <g>{children}</g>
    <text y={180} textAnchor="middle" fontFamily="Patrick Hand" fontSize={42} fill="#2C4A7A">{date}</text>
  </g>
);

// ───────── yağmurlu otobüs durağı ─────────
export const BusStop: React.FC<{ t: number; rain?: number }> = ({ t, rain = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#7E93A8" />
    {Array.from({ length: 8 }, (_, i) => { const x = i * 250 - 40, h = 360 + ((i * 53) % 180); return <g key={i}><rect x={x} y={620 - h} width={230} height={h} fill={["#A88C7A", "#C9B48C", "#9AA5AD", "#B88A6A"][i % 4]} />{Array.from({ length: 9 }, (_, k) => <rect key={k} x={x + 20 + (k % 3) * 70} y={620 - h + 30 + Math.floor(k / 3) * 90} width={40} height={50} fill="#DCE7EE" opacity={0.7} />)}</g>; })}
    <rect y={620} width={1920} height={100} fill="#8A8E94" /><rect y={720} width={1920} height={360} fill="#4E5660" />
    <path d="M0,900 H1920" stroke="#F4F4F4" strokeWidth={10} strokeDasharray="80 60" opacity={0.6} />
    {/* durak */}
    <g transform="translate(1180,720)">
      <rect x={-380} y={-430} width={760} height={30} rx={8} fill="#2C5AA0" />
      <rect x={-370} y={-400} width={14} height={400} fill="#555" /><rect x={356} y={-400} width={14} height={400} fill="#555" />
      <rect x={-350} y={-400} width={700} height={300} fill="#BFE6F2" opacity={0.25} />
      <rect x={120} y={-380} width={200} height={260} fill="#F6C445" /><text x={220} y={-300} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#B23A3F">KADIKÖY</text><text x={220} y={-250} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={26} fill="#333">MODA · 4</text>
      <rect x={-300} y={-110} width={340} height={20} rx={6} fill="#8A5A32" />
    </g>
    {rain > 0 && Array.from({ length: 90 }, (_, i) => { const x = (i * 97) % 1980, y = ((i * 61 + t * 1400) % 1180) - 100; return <path key={i} d={`M${x},${y} l-10,34`} stroke="#E8F4FA" strokeWidth={3} opacity={0.5 * rain} />; })}
    {rain > 0 && Array.from({ length: 10 }, (_, i) => <ellipse key={i} cx={(i * 211) % 1920} cy={950 + (i % 3) * 40} rx={30 + ((t * 40 + i * 9) % 30)} ry={6} fill="none" stroke="#C9D6DE" strokeWidth={2} opacity={0.6 - ((t * 1.3 + i * 0.3) % 1) * 0.6} />)}
  </g>
);

// ───────── nesneler ─────────
export const Kartvizit: React.FC<{ x: number; y: number; s?: number; k?: number; rot?: number }> = ({ x, y, s = 1, k = 1, rot = -6 }) => (
  <g transform={`translate(${x},${y}) scale(${s * (0.6 + 0.4 * k)}) rotate(${rot})`} opacity={k}>
    <rect x={-260} y={-150} width={520} height={300} rx={14} fill="#111214" stroke="#333" strokeWidth={4} />
    <text y={20} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={64} fill="#E9E9E9" letterSpacing={6}>0 5 3 2 · 8 8 8</text>
    <rect x={-200} y={70} width={400} height={4} fill="#444" />
  </g>
);
export const Dosya: React.FC<{ x: number; y: number; s?: number; k?: number; label?: string; open?: number }> = ({ x, y, s = 1, k = 1, label = "SEKİZ", open = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s * (0.7 + 0.3 * k)})`} opacity={k}>
    <rect x={-260} y={-190} width={520} height={380} rx={10} fill="#D9B77A" />
    <path d="M-260,-190 L-260,-220 L-90,-220 L-60,-190Z" fill="#C9A464" />
    {open > 0 && <rect x={-240} y={-180 - open * 60} width={480} height={340} fill="#FBF6E8" />}
    <rect x={-150} y={-60} width={300} height={120} fill="#FBF6E8" stroke="#8A6A3A" strokeWidth={4} />
    <text y={22} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={64} fill="#B02A2F" letterSpacing={6}>{label}</text>
    <text x={200} y={160} textAnchor="end" fontFamily="Poppins" fontWeight={700} fontSize={26} fill="#6A4A1A">GİZLİ</text>
  </g>
);
// bin yüz testi: ızgara, n = yanan yüz
export const FaceGrid: React.FC<{ t: number; k: number; hl?: number; dark?: number }> = ({ t, k, hl = -1, dark = 0 }) => (
  <g>
    <rect x={260} y={140} width={1400} height={800} rx={20} fill="#0B1426" stroke="#556" strokeWidth={10} />
    {Array.from({ length: 160 }, (_, i) => {
      const c = i % 20, r = Math.floor(i / 20);
      const on = (i * 37 + Math.floor(t * 12)) % 160 < 160 * k;
      return <g key={i} transform={`translate(${310 + c * 66},${200 + r * 92})`} opacity={(on ? 1 : 0.25) * (1 - dark)}>
        <circle r={22} fill={["#F2C9A0", "#D9A47A", "#B07A4A", "#F7DCC0"][i % 4]} /><circle cx={-7} cy={-3} r={3} fill="#222" /><circle cx={7} cy={-3} r={3} fill="#222" /><path d="M-7,8 q7,5 14,0" stroke="#222" strokeWidth={2} fill="none" />
        <path d={`M-22,-6 Q0,${-36 - (i % 3) * 6} 22,-6`} fill={["#3A2A20", "#1C1C1C", "#8A5A32", "#C9A24A"][(i * 3) % 4]} />
        {i === hl && <rect x={-32} y={-32} width={64} height={64} fill="none" stroke={T.yellow} strokeWidth={5} />}
      </g>;
    })}
  </g>
);
export const Defter: React.FC<{ x: number; y: number; s?: number; lines?: string[]; k?: number }> = ({ x, y, s = 1, lines = [], k = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(-3)`}>
    <rect x={-330} y={-230} width={660} height={460} rx={10} fill="#2C5AA0" />
    <rect x={-310} y={-215} width={620} height={430} fill="#FBF6E8" />
    <path d="M0,-215 V215" stroke="#C9BFA5" strokeWidth={4} />
    {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M-300,${-160 + i * 44} H300`} stroke="#BFD7EA" strokeWidth={2} />)}
    {lines.map((l, i) => <text key={i} x={-290} y={-120 + i * 88} fontFamily="Patrick Hand" fontSize={46} fill="#2C4A7A" opacity={ramp(k * lines.length, i, i + 1)}>{l}</text>)}
  </g>
);
// takım elbiseli adam (siyah minibüs)
export const SUIT_OUTFIT = { top: "#1E2128", top2: "#14161B", kind: "suit" as const, inner: "#F4F4F4", shoes: "#111111", glasses: true };
export const NURSE_OUTFIT = { top: "#8FD3C9", top2: "#6BB5AB", kind: "coat" as const, inner: "#FFFFFF", hair: "bun" as const, hairColor: "#3A2A20", shoes: "#FFFFFF" };
export const _t2 = { TFig };
