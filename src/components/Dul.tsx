import React from "react";
import { H, HTiny } from "./Harem";

// Kanal 3 · k3r-12 Dul (1770 Çeşme, Kasımpaşa, kadı mahkemesi) sahneleri.
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const md = (v: number, m: number) => ((v % m) + m) % m;

// Kadı mahkemesi: soğuk taş oda, yüksek sedir (sağ), kâtip rahlesi, kemerli pencereler. Figürler dışarıdan.
export const Mahkeme: React.FC<{ t: number; cold?: number; crowd?: number }> = ({ t, cold = 1, crowd = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#B9B3A6" />
    {Array.from({ length: 9 }, (_, r) => Array.from({ length: 11 }, (_, c) => <rect key={`${r}-${c}`} x={c * 180 + (r % 2) * 90 - 90} y={r * 90} width={176} height={86} fill={rnd(r * 11 + c) > 0.5 ? "#ADA697" : "#B5AE9F"} stroke="#8E877A" strokeWidth={2} />))}
    {[380, 960, 1540].map((x, i) => <g key={i}><path d={`M${x - 110},420 V200 Q${x},90 ${x + 110},200 V420Z`} fill="#6F8DA6" stroke={H.ln} strokeWidth={6} />{Array.from({ length: 5 }, (_, k) => <line key={k} x1={x - 110 + k * 55} y1={150} x2={x - 110 + k * 55} y2={420} stroke={H.ln} strokeWidth={3} opacity={0.6} />)}<path d={`M${x - 110},${300} H${x + 110}`} stroke={H.ln} strokeWidth={3} opacity={0.6} /><path d={`M${x - 100},420 L${x - 260},1000 L${x + 40},1000 L${x + 100},420Z`} fill="#E8EEF4" opacity={0.08 + Math.sin(t * 0.7 + i) * 0.02} /></g>)}
    {/* yazı levhası */}
    <rect x={760} y={470} width={400} height={70} rx={8} fill="#2A3A2E" stroke={H.gold} strokeWidth={4} />
    <path d="M800,505 q40,-20 80,0 t80,0 t80,0 t80,0" stroke={H.gold} strokeWidth={5} fill="none" />
    <rect y={820} width={1920} height={260} fill="#8A8172" />
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={i * 170} y1={820} x2={i * 170 - 140} y2={1080} stroke="#6E6658" strokeWidth={3} />)}
    {/* yüksek sedir (kadı) */}
    <rect x={1300} y={640} width={560} height={180} fill="#5A3A26" stroke={H.ln} strokeWidth={6} />
    <rect x={1300} y={600} width={560} height={50} rx={10} fill="#7A2A26" stroke={H.ln} strokeWidth={5} />
    {Array.from({ length: 4 }, (_, i) => <rect key={i} x={1330 + i * 135} y={670} width={110} height={120} fill="none" stroke={H.gold} strokeWidth={3} opacity={0.6} />)}
    {/* kâtip rahlesi */}
    <g transform="translate(1080,800)"><path d="M-110,0 L-80,-70 H80 L110,0Z" fill="#7A5236" stroke={H.ln} strokeWidth={5} /><rect x={-60} y={-90} width={120} height={22} fill="#EAD9B2" stroke={H.ln} strokeWidth={3} /><rect x={50} y={-110} width={16} height={24} fill="#1A1A1A" /></g>
    {crowd > 0 && Array.from({ length: 7 }, (_, i) => <HTiny key={i} x={80 + i * 70} y={820} s={1.4} c={["#5A5A5A", "#6A5A4A", "#3A4A5A"][i % 3]} />)}
    {cold > 0 && Array.from({ length: 8 }, (_, i) => { const p = md(t * 0.05 + rnd(i), 1); return <circle key={i} cx={rnd(i + 5) * 1920} cy={900 - p * 500} r={120 + rnd(i) * 80} fill="#DDE6EE" opacity={0.06 * cold * Math.sin(p * Math.PI)} />; })}
  </g>
);

// Kasımpaşa ve Tersane-i Amire: Haliç, kızaktaki gövdeler, tepedeki ahşap evler.
export const Tersane: React.FC<{ t: number; dusk?: number; ships?: number; crowd?: number }> = ({ t, dusk = 0, ships = 1, crowd = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={dusk ? "#D9A07A" : "#A9CBE0"} />
    <circle cx={1500} cy={dusk ? 420 : 180} r={90} fill={dusk ? "#F6D08A" : "#FFF6D8"} opacity={0.9} />
    <path d="M0,470 Q300,330 620,400 T1200,360 T1920,420 V620 H0Z" fill={dusk ? "#8A6A5A" : "#7FA07A"} />
    {Array.from({ length: 16 }, (_, i) => { const x = 40 + i * 118, y = 430 - Math.sin(i * 0.7) * 50; return <g key={i}><rect x={x} y={y} width={90} height={70} fill={["#C9A27A", "#B98A64", "#D8BC94"][i % 3]} stroke={H.ln} strokeWidth={3} /><path d={`M${x - 8},${y} L${x + 45},${y - 36} L${x + 98},${y}Z`} fill="#8E3A2A" stroke={H.ln} strokeWidth={3} /><rect x={x + 30} y={y + 22} width={22} height={26} fill={dusk ? "#F6D08A" : "#3A4A5A"} /></g>; })}
    <path d="M1180,360 V250 M1180,250 q20,-40 0,-60" stroke={H.ln} strokeWidth={8} fill="none" />
    <rect y={600} width={1920} height={480} fill={dusk ? "#5A6A8A" : "#3E7FA8"} />
    {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M${md(i * 211 + t * 30, 2100) - 100},${640 + (i % 7) * 60} q40,-12 80,0 q40,12 80,0`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.3} />)}
    {/* kızaktaki gemi gövdeleri */}
    {ships > 0 && [360, 980, 1560].map((x, i) => <g key={i} transform={`translate(${x},720)`}><path d="M-230,0 Q-200,110 0,120 Q200,110 230,0Z" fill="#7A4A2A" stroke={H.ln} strokeWidth={5} />{Array.from({ length: 9 }, (_, k) => <path key={k} d={`M${-200 + k * 50},10 q0,60 ${k < 4 ? 10 : -10},90`} stroke="#4A2A16" strokeWidth={4} fill="none" opacity={0.7} />)}{i !== 1 && <path d="M0,0 V-260" stroke="#4A2A16" strokeWidth={12} />}{i === 1 && <><path d="M-260,-180 L-260,40 M260,-180 L260,40 M-280,-180 H280" stroke="#5A3A20" strokeWidth={8} /><path d={`M200,-180 v${60 + Math.sin(t * 2) * 20}`} stroke={H.ln} strokeWidth={3} /></>}</g>)}
    {crowd > 0 && Array.from({ length: 10 }, (_, i) => <HTiny key={i} x={120 + i * 180} y={1000} s={1.3} c={["#5A4A3A", "#3A4A5A", "#8E3A2A"][i % 3]} />)}
  </g>
);

// Çeşme 1770: gece, uzakta yanan gemiler (detaysız, ufukta turuncu ışık ve duman).
export const CesmeGece: React.FC<{ t: number; fire?: number; ships?: number }> = ({ t, fire = 1, ships = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#141A2E" />
    <rect y={0} width={1920} height={640} fill={`rgba(232,96,42,${0.18 * fire})`} />
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 9) * 380} r={1.6} fill="#FFFFFF" opacity={0.6 * (1 - fire * 0.6)} />)}
    <path d="M0,600 Q400,560 800,590 T1920,580 V640 H0Z" fill="#0E1222" />
    <rect y={630} width={1920} height={450} fill="#1A2440" />
    {Array.from({ length: 8 }, (_, i) => { const x = 220 + i * 210, s = 0.6 + rnd(i) * 0.4, f = cl(fire * 1.6 - rnd(i + 3) * 0.6); return <g key={i} transform={`translate(${x},640) scale(${s})`}><path d="M-120,0 L120,0 L90,40 L-90,40Z" fill="#0A0A12" />{ships > 0 && [-50, 40].map((mx, k) => <path key={k} d={`M${mx},0 V-200`} stroke="#0A0A12" strokeWidth={8} />)}{f > 0 && Array.from({ length: 6 }, (_, k) => <path key={k} d={`M${-90 + k * 36},0 q${10 + Math.sin(t * 7 + k + i) * 10},-${120 * f + Math.sin(t * 5 + k) * 30} 24,-${180 * f} q10,70 12,180Z`} fill={k % 2 ? "#FFB040" : "#E8602A"} opacity={0.9} />)}{f > 0 && Array.from({ length: 4 }, (_, k) => { const p = md(t * 0.12 + k * 0.25 + i * 0.1, 1); return <circle key={`s${k}`} cx={Math.sin(p * 3 + k) * 40} cy={-200 * f - p * 400} r={40 + p * 90} fill="#2A2A30" opacity={0.5 * (1 - p)} />; })}</g>; })}
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${md(i * 160 + t * 20, 2000) - 80},${700 + (i % 6) * 60} h80`} stroke="#E8602A" strokeWidth={4} opacity={0.25 * fire} />)}
  </g>
);

// Yün eğirme (iğ): yakın plan eller, dönen iğ, yün yumağı, ip.
export const YunEgir: React.FC<{ t: number; night?: number }> = ({ t, night = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#2A1E16" : "#C9B391"} />
    {night > 0 && <circle cx={1500} cy={300} r={260} fill="#FFC86A" opacity={0.18} />}
    <g transform="translate(560,520)">{Array.from({ length: 16 }, (_, i) => <circle key={i} cx={Math.cos(i) * 90 * rnd(i)} cy={Math.sin(i * 1.7) * 80 * rnd(i + 1)} r={70 + rnd(i + 3) * 40} fill="#F4EEDC" stroke="#D9CFB8" strokeWidth={3} />)}</g>
    <path d={`M640,500 Q900,${420 + Math.sin(t * 3) * 10} 1180,380`} stroke="#EDE3C8" strokeWidth={6} fill="none" />
    <g transform={`translate(1200,360)`}><path d="M0,0 L0,520" stroke="#7A5236" strokeWidth={12} /><g transform={`translate(0,420) scale(${Math.cos(t * 12) * 0.25 + 1},1)`}><ellipse rx={90} ry={22} fill="#9A6A42" stroke={H.ln} strokeWidth={4} /></g><ellipse cy={120} rx={42} ry={70} fill="#EDE3C8" stroke="#CFC4A8" strokeWidth={3} />{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M-40,${70 + i * 18} q40,${-8 + Math.sin(t * 12 + i) * 4} 80,0`} stroke="#CFC4A8" strokeWidth={3} fill="none" />)}</g>
    {[[1060, 340, 1], [1320, 640, -1]].map(([x, y, sd], i) => <g key={i} transform={`translate(${x},${y + Math.sin(t * 4 + i) * 6}) scale(${sd * 1.2},1.2)`}><path d="M-80,60 Q-90,0 -50,-30 L40,-40 Q70,-36 70,-14 L20,-10 L60,4 Q72,20 54,26 L10,24 L40,40 Q48,56 30,58 Z" fill="#EFCBB0" stroke={H.ln} strokeWidth={4} /><rect x={-170} y={20} width={110} height={60} fill="#1F4E9A" stroke={H.ln} strokeWidth={4} /></g>)}
  </g>
);

// Mendil işleme: kasnak, iğne, işlenen çiçek (k = ilerleme).
export const Mendil: React.FC<{ t: number; k?: number; night?: number; flower?: string }> = ({ t, k = 1, night = 0, flower = "#C8202A" }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#2A1E16" : "#B79C78"} />
    {night > 0 && <circle cx={360} cy={240} r={280} fill="#FFC86A" opacity={0.16} />}
    <g transform="translate(960,560)">
      <circle r={380} fill="#F7F1E2" stroke="#8A5A36" strokeWidth={26} />
      <circle r={350} fill="none" stroke="#B88A5A" strokeWidth={6} />
      {Array.from({ length: 6 }, (_, i) => { const a = (i / 6) * Math.PI * 2, on = cl(k * 7 - i); return <ellipse key={i} cx={Math.cos(a) * 90} cy={Math.sin(a) * 90} rx={70} ry={38} transform={`rotate(${(a * 180) / Math.PI} ${Math.cos(a) * 90} ${Math.sin(a) * 90})`} fill={flower} opacity={on} stroke={H.ln} strokeWidth={3} strokeDasharray={`${on * 400} 400`} />; })}
      <circle r={44} fill={H.gold} opacity={cl(k * 7 - 6)} stroke={H.ln} strokeWidth={3} />
      {Array.from({ length: 4 }, (_, i) => <path key={i} d={`M${-200 + i * 120},260 q30,-50 60,0`} stroke={H.green} strokeWidth={8} fill="none" opacity={cl(k * 2 - 1)} />)}
      <g transform={`translate(${160 + Math.sin(t * 5) * 30},${-160 + Math.cos(t * 5) * 30}) rotate(-35)`}><rect x={-4} y={-200} width={8} height={200} fill="#C9C9C9" stroke={H.ln} strokeWidth={2} /><path d={`M0,-200 Q120,${-260 + Math.sin(t * 5) * 30} 60,-80`} stroke={flower} strokeWidth={3} fill="none" /></g>
    </g>
  </g>
);

// Osmanlı fırını: kubbeli taş fırın, ateş, raflarda ekmek, kürek.
export const OFirin: React.FC<{ t: number; bread?: number }> = ({ t, bread = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#C9A882" />
    <rect y={0} width={1920} height={120} fill="#7A5236" />
    <g transform="translate(1260,760)"><path d="M-420,0 V-260 Q0,-560 420,-260 V0Z" fill="#B7735A" stroke={H.ln} strokeWidth={6} />{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M-420,${-30 - i * 32} H420`} stroke="#9A5A44" strokeWidth={3} opacity={0.6} />)}<path d="M-170,0 V-140 Q0,-260 170,-140 V0Z" fill="#2A140C" />{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-120 + i * 46},0 q${12 + Math.sin(t * 8 + i) * 8},-${70 + Math.sin(t * 6 + i) * 24} 26,-${110 + Math.sin(t * 5 + i) * 20} q10,50 10,110Z`} fill={i % 2 ? "#FFB040" : "#E8602A"} />)}</g>
    <path d="M840,760 L1120,560" stroke="#8A5A36" strokeWidth={12} />
    {Array.from({ length: 2 }, (_, r) => <g key={r}><rect x={80} y={300 + r * 200} width={560} height={18} fill="#7A5236" />{Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={140 + i * 110} cy={280 + r * 200} rx={48} ry={24} fill="#D9A55A" stroke={H.ln} strokeWidth={3} opacity={cl(bread * 10 - (r * 5 + i))} />)}</g>)}
    <rect y={760} width={1920} height={320} fill="#9A7A5A" />
  </g>
);

// Kasımpaşa sokağında ahşap ev kapısı. bayram: fenerler, bayraklar.
export const KapiOnu: React.FC<{ t: number; bayram?: number; dusk?: number; pots?: number }> = ({ t, bayram = 0, dusk = 0, pots = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={dusk ? "#C7866A" : "#BFD6E2"} />
    {[0, 1].map((i) => <g key={i} transform={`translate(${i ? 1300 : 0},0)`}><rect x={0} y={160} width={620} height={700} fill={i ? "#C9A27A" : "#B98A64"} stroke={H.ln} strokeWidth={5} />{Array.from({ length: 12 }, (_, k) => <line key={k} x1={0} y1={200 + k * 56} x2={620} y2={200 + k * 56} stroke="#8A6A4A" strokeWidth={2} opacity={0.5} />)}<rect x={80} y={240} width={180} height={200} fill={dusk ? "#F6D08A" : "#3A4A5A"} stroke={H.ln} strokeWidth={4} /><rect x={360} y={240} width={180} height={200} fill={dusk ? "#F6D08A" : "#3A4A5A"} stroke={H.ln} strokeWidth={4} /></g>)}
    <rect x={620} y={120} width={680} height={740} fill="#D8BC94" stroke={H.ln} strokeWidth={6} />
    <path d="M590,120 L960,20 L1330,120Z" fill="#8E3A2A" stroke={H.ln} strokeWidth={5} />
    <rect x={780} y={420} width={360} height={440} fill="#6A4026" stroke={H.ln} strokeWidth={6} />
    <rect x={800} y={440} width={150} height={190} fill="none" stroke="#4A2A16" strokeWidth={4} /><rect x={970} y={440} width={150} height={190} fill="none" stroke="#4A2A16" strokeWidth={4} />
    <circle cx={1100} cy={650} r={12} fill={H.gold} stroke={H.ln} strokeWidth={3} />
    <rect x={740} y={860} width={440} height={30} fill="#9A9080" stroke={H.ln} strokeWidth={4} />
    <rect y={890} width={1920} height={190} fill="#8E8778" />
    {Array.from({ length: 14 }, (_, i) => <rect key={i} x={i * 140} y={900 + (i % 2) * 70} width={130} height={60} rx={10} fill="#9C9585" stroke="#7A7366" strokeWidth={2} />)}
    {pots > 0 && [0, 1, 2].map((i) => <g key={i} transform={`translate(${700 - i * 90},880)`} opacity={cl(pots * 3 - i)}><path d="M-40,0 Q-46,-60 0,-64 Q46,-60 40,0Z" fill="#B8733A" stroke={H.ln} strokeWidth={4} /><rect x={-46} y={-70} width={92} height={10} rx={4} fill="#8A5226" /></g>)}
    {bayram > 0 && <g opacity={bayram}><path d="M0,90 Q480,190 960,100 T1920,90" stroke={H.ln} strokeWidth={3} fill="none" />{Array.from({ length: 16 }, (_, i) => { const x = 60 + i * 120, y = 110 + Math.sin(i * 0.9) * 30; return <g key={i} transform={`rotate(${Math.sin(t * 2 + i) * 6} ${x} ${y})`}><path d={`M${x - 24},${y} L${x + 24},${y} L${x},${y + 50}Z`} fill={[H.red, H.green, H.gold, H.cobalt][i % 4]} stroke={H.ln} strokeWidth={2} /></g>; })}</g>}
  </g>
);

// Kassamın yazdığı eşyalar: sırayla çıkan nesneler (k: 0..1).
export const Tereke: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => {
  const it = (i: number) => cl(k * 5.5 - i);
  return (
    <g>
      <rect width={1920} height={1080} fill="#E9DCC2" />
      <rect width={1920} height={1080} fill="url(#hDamask)" opacity={0.12} />
      <g transform="translate(300,560)" opacity={it(0)}>{[0, 1].map((i) => <g key={i} transform={`translate(${i * 120},${i * 30})`}><path d="M-80,0 Q-90,-110 0,-118 Q90,-110 80,0Z" fill="#C07A3A" stroke={H.ln} strokeWidth={5} /><rect x={-92} y={-128} width={184} height={16} rx={6} fill="#8A5226" stroke={H.ln} strokeWidth={3} /></g>)}</g>
      <g transform="translate(720,600)" opacity={it(1)}>{[0, 1, 2].map((i) => <rect key={i} x={-150} y={-60 - i * 54} width={300} height={50} rx={18} fill={[H.red, H.cobalt, H.ochre][i]} stroke={H.ln} strokeWidth={4} />)}</g>
      <g transform="translate(1140,580)" opacity={it(2)}><rect x={-150} y={-120} width={300} height={170} fill="#7A4A2A" stroke={H.ln} strokeWidth={5} /><path d="M-150,-120 Q0,-200 150,-120" fill="#8A5A36" stroke={H.ln} strokeWidth={5} /><rect x={-20} y={-70} width={40} height={40} fill={H.gold} stroke={H.ln} strokeWidth={3} /></g>
      <g transform={`translate(1560,520) rotate(${Math.sin(t * 2) * 4})`} opacity={it(3)}><path d="M0,-150 V-110" stroke={H.gold} strokeWidth={6} /><circle r={110} fill="#D9D9D9" stroke={H.ln} strokeWidth={6} /><circle r={90} fill="#FFFBEF" stroke={H.ln} strokeWidth={3} /><path d={`M0,0 L0,-70 M0,0 L${Math.cos(t) * 50},${Math.sin(t) * 50}`} stroke={H.ln} strokeWidth={5} /></g>
      <g transform="translate(960,860)" opacity={it(4)}><rect x={-120} y={-80} width={240} height={110} fill="#D8BC94" stroke={H.ln} strokeWidth={4} /><path d="M-140,-80 L0,-150 L140,-80Z" fill="#8E3A2A" stroke={H.ln} strokeWidth={4} /><rect x={-24} y={-40} width={48} height={70} fill="#6A4026" /></g>
    </g>
  );
};
export const _dul = { cl, rnd, md, H };
