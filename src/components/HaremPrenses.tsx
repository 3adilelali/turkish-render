import React from "react";
import { P } from "./HaremPro";

// Kanal 1 · k3r-14 ek nesneler (HaremPro ölçeği): gül, kurumuş gül kutusu, Hıdırellez ateşi, kafesli pencere (içeriden), mühürlü mektup.
const LN = "#4A3524";

// kırmızı gül (dry=1 → kurumuş, kahverengi)
export const Gul: React.FC<{ s?: number; dry?: number; rot?: number }> = ({ s = 1, dry = 0, rot = 0 }) => {
  const c1 = dry ? "#7A3A2A" : "#C8243A", c2 = dry ? "#5A2A1E" : "#9A1830", c3 = dry ? "#9A5A3A" : "#E8455A";
  return (
    <g transform={`rotate(${rot}) scale(${s})`}>
      <path d="M0,10 C2,40 -4,70 0,100" stroke={dry ? "#5A4A2A" : "#3E6B33"} strokeWidth={5} fill="none" />
      <path d="M0,50 C18,40 30,44 34,56 C20,62 10,60 0,50Z" fill={dry ? "#6A5A3A" : "#4E8A3A"} stroke={LN} strokeWidth={1.6} />
      <path d="M-26,0 C-30,-26 -10,-40 0,-40 C10,-40 30,-26 26,0 C20,16 -20,16 -26,0Z" fill={c2} stroke={LN} strokeWidth={2.2} />
      <path d="M-18,-6 C-20,-26 -4,-32 4,-30 C14,-26 20,-14 16,-2 C10,8 -12,8 -18,-6Z" fill={c1} />
      <path d="M-8,-14 C-8,-24 6,-26 8,-18 C10,-10 0,-6 -8,-14Z" fill={c3} />
      <path d="M-10,-20 q10,-8 16,2" stroke={c2} strokeWidth={2} fill="none" />
    </g>
  );
};

// ahşap kutu (kapak open 0..1), içinde kurumuş gül
export const GulKutu: React.FC<{ x: number; y: number; s?: number; open?: number }> = ({ x, y, s = 1, open = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={6} rx={170} ry={18} fill="#1E0E04" opacity={0.3} />
    <path d="M-150,-90 L150,-90 L150,0 L-150,0Z" fill="#7A4A2A" stroke={LN} strokeWidth={3} />
    <path d="M-150,-90 L150,-90 L150,0 L-150,0Z" fill="url(#pShadeL)" />
    <path d="M-130,-70 L130,-70 L130,-20 L-130,-20Z" fill="none" stroke={P.gold} strokeWidth={3} />
    
    <g transform={`translate(-10,-110) scale(2.2) rotate(70)`} opacity={open}><Gul dry={1} s={1} /></g>
    <g transform={`translate(-150,-90) rotate(${-110 * open})`}>
      <path d="M0,0 L300,0 L300,-26 L0,-26Z" fill="#8A5A34" stroke={LN} strokeWidth={3} />
      <circle cx={150} cy={-13} r={8} fill={P.gold} />
    </g>
  </g>
);

// büyük Hıdırellez ateşi (kıvılcımlar); k = boyut
export const Ates: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle cx={0} cy={-120} r={420} fill="url(#pPool)" opacity={0.55 + 0.08 * Math.sin(t * 9)} />
    {[-80, -40, 0, 40, 80].map((dx, i) => <path key={i} d={`M${dx - 60},0 L${dx + 60},-30`} stroke="#4A2A14" strokeWidth={18} strokeLinecap="round" />)}
    {[0, 1, 2, 3, 4].map((i) => {
      const f = Math.sin(t * 7 + i * 1.7) * 18, h = 220 + (i % 2) * 70 + Math.sin(t * 5 + i) * 30;
      const dx = -100 + i * 50;
      return <path key={i} d={`M${dx - 50},-10 C${dx - 70},-80 ${dx - 20 + f},${-h * 0.6} ${dx + f * 0.6},${-h} C${dx + 30},${-h * 0.6} ${dx + 60},-80 ${dx + 50},-10Z`} fill={["#E8562A", "#F2913A", "#FFD27A", "#F2913A", "#E8562A"][i]} opacity={0.92} />;
    })}
    <path d="M-60,-10 C-50,-80 -10,-120 0,-170 C14,-120 50,-80 60,-10Z" fill="#FFF3B0" opacity={0.85} />
    {Array.from({ length: 16 }, (_, i) => {
      const u = (t * 0.5 + i / 16) % 1;
      return <circle key={i} cx={Math.sin(i * 7.1 + t) * 120 * u + Math.sin(i) * 40} cy={-140 - u * 520} r={4 * (1 - u) + 1} fill="#FFD27A" opacity={1 - u} />;
    })}
  </g>
);

// kafesli pencere, içeriden: karanlık oda, dışarısı parlak; kafes ızgarası
export const KafesIc: React.FC<{ t: number; dusk?: number }> = ({ t, dusk = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#3A2A1E" />
    <rect width={1920} height={1080} fill="url(#hDamask)" opacity={0.15} />
    <path d="M560,960 L560,360 C560,180 1360,180 1360,360 L1360,960Z" fill={dusk ? "#E9A070" : "#BFDDEB"} stroke={LN} strokeWidth={6} />
    <path d="M560,700 Q960,620 1360,700 L1360,960 L560,960Z" fill={dusk ? "#8A6A4A" : "#8FB07A"} opacity={0.8} />
    <rect x={560} y={180} width={800} height={780} fill="#FFF6DC" opacity={0.15 + 0.05 * Math.sin(t)} />
    {/* kafes */}
    {Array.from({ length: 15 }, (_, i) => <path key={`a${i}`} d={`M${560 + i * 60},180 L${560 + i * 60 - 400},980`} stroke="#5A3A22" strokeWidth={14} />)}
    {Array.from({ length: 15 }, (_, i) => <path key={`b${i}`} d={`M${160 + i * 60},180 L${560 + i * 60},980`} stroke="#6A4A2E" strokeWidth={14} />)}
    <path d="M0,0 L1920,0 L1920,1080 L1360,1080 L1360,360 C1360,180 560,180 560,360 L560,1080 L0,1080Z" fill="#3A2A1E" />
    <path d="M560,960 L560,360 C560,180 1360,180 1360,360 L1360,960" fill="none" stroke="#7A5A3A" strokeWidth={22} />
    <rect x={500} y={960} width={920} height={40} fill="#6A4A2E" stroke={LN} strokeWidth={3} />
  </g>
);

// mühürlü mektup (kapalı); seal yerinden oynamışsa broken=1
export const Muhurlu: React.FC<{ x: number; y: number; s?: number; rot?: number; broken?: number }> = ({ x, y, s = 1, rot = 0, broken = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-160} y={-100} width={320} height={200} rx={6} fill="#F3E6C4" stroke={LN} strokeWidth={3} />
    <path d="M-160,-100 L0,10 L160,-100" fill="none" stroke="#C9B08A" strokeWidth={3} />
    <g transform={`translate(${broken * 18},${broken * 10}) rotate(${broken * 22})`}>
      <circle cx={0} cy={8} r={34} fill="#A01C2E" stroke={LN} strokeWidth={2.4} />
      <circle cx={0} cy={8} r={22} fill="none" stroke="#D8404A" strokeWidth={3} />
      <path d="M-10,4 L10,4 M0,-6 L0,18" stroke="#D8404A" strokeWidth={3} />
    </g>
    {broken > 0 && <path d="M-24,-20 l10,14 l-8,10" stroke="#A01C2E" strokeWidth={3} fill="none" opacity={0.6} />}
  </g>
);
