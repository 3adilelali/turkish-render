import React from "react";
import { T, lerp } from "./Toon";

// Kanal 2 · dikey short kiti 3 (2026-11-16, sh2-11…sh2-20). 1920×1080 sahne, içerik x 656–1264 şeridinde.
// Dag (Ağrı zirvesi + kamp), Demlik/InceBardak, Termometre, DugunSalon/Kurdele/Defter, YatakOda/Masa,
// TrafikIsik/Dalga/Sis, Kopru (asma köprü), BakkalOn, VanGolu/Kefal, KarYol/Kar, YeraltiKesit/TasKapi.

const md = (v: number, m: number) => ((v % m) + m) % m;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const INK = "#2A2E36";

// ── Ağrı Dağı zirvesi: kar, çadır, kamp ocağı. steam: buhar
export const Dag: React.FC<{ t: number; zoom?: number; steam?: number; flag?: boolean }> = ({ t, steam = 0, flag = true }) => (
  <g>
    <rect width={1920} height={1080} fill="#7FB8E6" />
    <rect width={1920} height={420} fill="#5B9BD6" opacity={0.5} />
    {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={md(i * 400 + t * 20, 2300) - 200} cy={160 + (i % 3) * 70} rx={160} ry={34} fill="#FFFFFF" opacity={0.75} />)}
    <path d="M200,1080 L960,180 L1720,1080Z" fill="#8A7A6E" />
    <path d="M960,180 L760,420 L840,400 L900,460 L980,390 L1060,450 L1160,420Z" fill="#F4F8FB" />
    <path d="M380,1080 L960,560 L1540,1080Z" fill="#F4F8FB" />
    <path d="M520,1080 L960,700 L1400,1080Z" fill="#E6EEF4" />
    {flag && <g transform="translate(960,180)"><path d="M0,0 V-110" stroke={INK} strokeWidth={6} /><path d={`M0,-110 L${70 + Math.sin(t * 6) * 6},-90 L0,-70Z`} fill="#E0393E" /><circle cx={24} cy={-90} r={8} fill="#FFFFFF" /></g>}
    {/* çadır */}
    <path d="M700,1000 L820,820 L940,1000Z" fill="#F28C28" stroke="#C76A12" strokeWidth={5} /><path d="M820,820 V1000" stroke="#C76A12" strokeWidth={4} />
    {/* ocak + demlik */}
    <rect x={1060} y={960} width={140} height={40} rx={8} fill="#5E666C" />
    <path d={`M1100,960 q10,-${20 + Math.sin(t * 20) * 6} 20,0 q10,-${18 + Math.cos(t * 18) * 6} 20,0`} fill="#4FA3FF" />
    <Demlik x={1120} y={962} s={0.5} t={t} steam={steam} />
  </g>
);

// ── çaydanlık (iki katlı). steam 0..1
export const Demlik: React.FC<{ x: number; y: number; s?: number; t: number; steam?: number }> = ({ x, y, s = 1, t, steam = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-80,0 Q-90,-110 0,-120 Q90,-110 80,0Z" fill="#C9CDD0" stroke="#7E868A" strokeWidth={5} />
    <path d="M-60,-120 Q-66,-200 0,-206 Q66,-200 60,-120Z" fill="#D9DEE1" stroke="#7E868A" strokeWidth={5} />
    <path d="M80,-60 L140,-110" stroke="#7E868A" strokeWidth={12} strokeLinecap="round" /><circle cy={-214} r={10} fill="#7E868A" />
    {steam > 0 && [0, 1, 2].map((i) => { const o = md(t * 0.8 + i / 3, 1); return <path key={i} d={`M${140 + i * 10},${-120 - o * 140} q20,-20 0,-40 q-20,-20 0,-40`} stroke="#FFFFFF" strokeWidth={8} fill="none" opacity={steam * (1 - o) * 0.8} strokeLinecap="round" />; })}
  </g>
);

// ── ince belli çay bardağı. tea: çay rengi (0 açık → 1 tavşan kanı), fill 0..1, hl: "alt"|"ust"|"bel"
export const InceBardak: React.FC<{ x: number; y: number; s?: number; t?: number; tea?: number; fill?: number; hl?: "alt" | "ust" | "bel"; saucer?: boolean }> = ({ x, y, s = 1, t = 0, tea = 1, fill = 0.85, hl, saucer = true }) => {
  const c = `rgb(${Math.round(lerp(214, 160, tea))},${Math.round(lerp(150, 40, tea))},${Math.round(lerp(60, 20, tea))})`;
  const glass = "M-70,-260 Q-74,-200 -40,-140 Q-20,-110 -42,-60 Q-58,-10 -46,0 H46 Q58,-10 42,-60 Q20,-110 40,-140 Q74,-200 70,-260Z";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {saucer && <><ellipse cy={6} rx={130} ry={24} fill="#F4F4F2" stroke="#B9C2C9" strokeWidth={4} /><ellipse cy={2} rx={80} ry={12} fill="#E0E4E7" /></>}
      <clipPath id="bardakClip"><path d={glass} /></clipPath>
      <g clipPath="url(#bardakClip)"><rect x={-90} y={-260 * fill} width={180} height={260} fill={c} /><ellipse cx={-30} cy={-260 * fill + 6} rx={40} ry={6} fill="#FFFFFF" opacity={0.3} /></g>
      <path d={glass} fill="#FFFFFF" fillOpacity={0.12} stroke="#FFFFFF" strokeWidth={6} />
      <path d="M-50,-240 Q-52,-200 -30,-160" stroke="#FFFFFF" strokeWidth={6} opacity={0.6} fill="none" />
      {hl && <ellipse cy={hl === "alt" ? -40 : hl === "ust" ? -220 : -115} rx={hl === "bel" ? 60 : 95} ry={hl === "bel" ? 40 : 50} fill="none" stroke="#2EE6D0" strokeWidth={10} opacity={0.6 + 0.4 * Math.sin(t * 6)} />}
    </g>
  );
};

// ── termometre (°C). v: değer, max
export const Termometre: React.FC<{ x?: number; y?: number; s?: number; v: number; max?: number; mark?: number }> = ({ x = 960, y = 540, s = 1, v, max = 110, mark }) => {
  const h = 520, k = cl(v / max);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-40} y={-h / 2 - 20} width={80} height={h + 40} rx={40} fill="#FFFFFF" stroke={INK} strokeWidth={8} />
      <circle cy={h / 2 + 40} r={70} fill="#E0393E" stroke={INK} strokeWidth={8} />
      <rect x={-20} y={h / 2 - h * k} width={40} height={h * k + 30} fill="#E0393E" />
      {[0, 20, 40, 60, 80, 100].map((d) => <g key={d}><path d={`M40,${h / 2 - h * d / max} h30`} stroke={INK} strokeWidth={5} /><text x={80} y={h / 2 - h * d / max + 12} fontFamily="Poppins" fontWeight={800} fontSize={34} fill={INK}>{d}</text></g>)}
      {mark !== undefined && <path d={`M-90,${h / 2 - h * mark / max} h50`} stroke="#2EE6D0" strokeWidth={10} strokeLinecap="round" />}
    </g>
  );
};

// ── düğün salonu: süs ışıkları, sahne, masa
export const DugunSalon: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#4A2A4E" />
    <rect y={760} width={1920} height={320} fill="#6E3E5E" />
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={560 + i * 30} cy={80 + Math.sin(i * 0.6) * 40} r={8} fill={["#FFE27A", "#FFFFFF", "#F2B8C9"][i % 3]} opacity={0.6 + 0.4 * Math.sin(t * 4 + i)} />)}
    <path d="M560,80 Q760,180 960,80 Q1160,180 1360,80" stroke="#FFE27A" strokeWidth={3} fill="none" opacity={0.6} />
    <rect x={620} y={300} width={680} height={460} rx={20} fill="#F4E6F0" opacity={0.12} />
    {[0, 1].map((i) => <g key={i} transform={`translate(${720 + i * 480},760)`}><rect x={-60} y={-120} width={120} height={120} fill="#FFFFFF" opacity={0.9} /><rect x={-70} y={-130} width={140} height={14} fill="#E6D2B4" /><circle cy={-150} r={30} fill="#F2B8C9" /></g>)}
  </g>
);

// ── gelinin kurdelesi: altınlar takılıyor. n: takılı altın sayısı
export const Kurdele: React.FC<{ x?: number; y?: number; s?: number; n: number; t: number }> = ({ x = 960, y = 400, s = 1, n, t }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-40,-260 L40,-260 L60,320 L-60,320Z" fill="#E0393E" />
    <path d="M-60,320 L-20,280 L0,340 L20,280 L60,320" fill="#B3182B" />
    {Array.from({ length: n }, (_, i) => { const yy = -200 + i * 70, xx = (i % 2 ? 1 : -1) * 18; return <g key={i} transform={`translate(${xx},${yy}) rotate(${Math.sin(t * 3 + i) * 8})`}><circle r={30} fill="#F6C445" stroke="#B88A1A" strokeWidth={5} /><circle r={18} fill="none" stroke="#B88A1A" strokeWidth={3} /></g>; })}
  </g>
);

// ── defter (açık), satırlar yazılıyor. lines, k: yazılan oran
export const Defter: React.FC<{ x?: number; y?: number; s?: number; lines: string[]; k: number; title?: string; c?: string }> = ({ x = 960, y = 560, s = 1, lines, k, title, c = "#2C4A7A" }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(-3)`}>
    <rect x={-280} y={-340} width={560} height={680} rx={14} fill="#FBF6E8" stroke="#C9B98F" strokeWidth={6} />
    <rect x={-300} y={-340} width={40} height={680} rx={10} fill="#8A5A32" />
    {Array.from({ length: 11 }, (_, i) => <path key={i} d={`M-240,${-240 + i * 56} H250`} stroke="#9AC4E8" strokeWidth={3} />)}
    <path d="M-200,-340 V340" stroke="#F2A0A0" strokeWidth={3} />
    {title && <text x={20} y={-270} textAnchor="middle" fontFamily="Patrick Hand" fontSize={56} fill="#B3182B">{title}</text>}
    {lines.map((l, i) => { const on = cl(k * lines.length - i); return on > 0 && <text key={i} x={-180} y={-196 + i * 56} fontFamily="Patrick Hand" fontSize={46} fill={c} opacity={on}>{l.slice(0, Math.ceil(l.length * on))}</text>; })}
  </g>
);

// ── yatak odası (gece). shake px, lamp sallanır
export const YatakOda: React.FC<{ t: number; shake?: number; masa?: boolean }> = ({ t, shake = 0, masa = true }) => {
  const sx = Math.sin(t * 40) * shake, sy = Math.cos(t * 33) * shake * 0.6;
  return (
    <g transform={`translate(${sx},${sy})`}>
      <rect x={-40} y={-40} width={2000} height={1160} fill="#2E3A52" />
      <rect y={820} width={1920} height={260} fill="#4A3A30" />
      <rect x={1180} y={160} width={200} height={260} fill="#14203A" stroke="#C9CDD0" strokeWidth={10} /><path d="M1280,160 V420 M1180,290 H1380" stroke="#C9CDD0" strokeWidth={6} />
      <g transform={`translate(960,0) rotate(${Math.sin(t * 6) * shake * 2})`}><path d="M0,0 V140" stroke="#9AA3A8" strokeWidth={4} /><path d="M-50,140 L50,140 L30,190 L-30,190Z" fill="#F6E7B0" /></g>
      <rect x={600} y={680} width={360} height={160} rx={20} fill="#7A5ABE" /><rect x={600} y={640} width={120} height={70} rx={20} fill="#F4F4F2" />
      <rect x={620} y={520} width={180} height={300} fill="#8A5A32" /><rect x={640} y={540} width={140} height={120} fill="#A86E40" />
      {masa && <g><rect x={1000} y={700} width={260} height={24} fill="#A86E40" /><rect x={1012} y={724} width={20} height={110} fill="#8A5A32" /><rect x={1228} y={724} width={20} height={110} fill="#8A5A32" /></g>}
      {shake > 0 && Array.from({ length: 6 }, (_, i) => <circle key={i} cx={md(i * 311, 700) + 620} cy={md(i * 137 + t * 300, 700)} r={4} fill="#C9CDD0" opacity={0.6} />)}
    </g>
  );
};

// ── trafik ışığı. on: "r"|"y"|"g"
export const TrafikIsik: React.FC<{ x?: number; y?: number; s?: number; on?: "r" | "y" | "g" | "b"; glow?: number }> = ({ x = 960, y = 520, s = 1, on = "r", glow = 1 }) => {
  const L: ["r" | "y" | "g", string][] = [["r", "#FF3B30"], ["y", "#FFC107"], ["g", "#34C759"]];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-20} y={300} width={40} height={600} fill="#3A3F46" />
      <rect x={-110} y={-320} width={220} height={620} rx={40} fill="#22262C" stroke="#111" strokeWidth={8} />
      {L.map(([k, c], i) => { const lit = on === k; const col = on === "b" && i === 0 ? "#2F7FFF" : c; const isLit = lit || (on === "b" && i === 0); return <g key={k}><circle cy={-200 + i * 190} r={74} fill={isLit ? col : "#3A3F46"} />{isLit && <circle cy={-200 + i * 190} r={140} fill={col} opacity={0.25 * glow} />}<path d={`M-90,${-280 + i * 190} q90,-40 180,0`} stroke="#22262C" strokeWidth={22} fill="none" /></g>; })}
    </g>
  );
};

// ── dalga: λ uzunluk, c renk, y
export const Dalga: React.FC<{ t: number; y: number; lam: number; c: string; amp?: number; x0?: number; x1?: number; label?: string }> = ({ t, y, lam, c, amp = 40, x0 = 660, x1 = 1260, label }) => {
  const pts = Array.from({ length: 121 }, (_, i) => { const x = lerp(x0, x1, i / 120); return `${i ? "L" : "M"}${x},${y + Math.sin((x - t * 200) / lam * Math.PI * 2) * amp}`; }).join(" ");
  return <g><path d={pts} stroke={c} strokeWidth={12} fill="none" strokeLinecap="round" />{label && <text x={x0} y={y - amp - 24} fontFamily="Poppins" fontWeight={900} fontSize={44} fill={c} stroke="#0B1426" strokeWidth={8} paintOrder="stroke">{label}</text>}</g>;
};

// ── sis örtüsü
export const Sis: React.FC<{ t: number; k: number }> = ({ t, k }) => (
  <g opacity={k}>{Array.from({ length: 8 }, (_, i) => <ellipse key={i} cx={md(i * 300 + t * 40, 2400) - 240} cy={200 + i * 110} rx={420} ry={120} fill="#DDE6EA" opacity={0.55} />)}<rect width={1920} height={1080} fill="#DDE6EA" opacity={0.35} /></g>
);

// ── asma köprü (yandan, dikey çerçeveye göre: kule ortada). deck yüksekliği, k: üstünde yürüyen nokta
export const Kopru: React.FC<{ t: number; tower?: number; sway?: number; ships?: boolean; dusk?: number }> = ({ t, sway = 0, ships = true, dusk = 0 }) => {
  const dy = Math.sin(t * 1.5) * sway;
  return (
    <g>
      <rect width={1920} height={1080} fill={dusk ? "#F2A86A" : "#9FD3F0"} />
      {dusk > 0 && <circle cx={1300} cy={760} r={90} fill="#FFE27A" opacity={dusk} />}
      <rect y={820} width={1920} height={260} fill="#2F7FC1" />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${md(i * 260 + t * 30, 2100) - 100},${860 + (i % 3) * 60} q30,-12 60,0`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.4} />)}
      {/* kuleler */}
      {[760, 1160].map((x) => <g key={x}><rect x={x - 26} y={60} width={52} height={760} fill="#D9493E" /><rect x={x - 40} y={60} width={80} height={30} fill="#B3302A" /><rect x={x - 30} y={360} width={60} height={20} fill="#B3302A" /></g>)}
      {/* ana kablo + askılar */}
      <path d={`M0,${420 + dy} Q380,${620 + dy} 760,80 Q960,${520 + dy} 1160,80 Q1540,${620 + dy} 1920,${420 + dy}`} stroke="#E0393E" strokeWidth={10} fill="none" />
      {Array.from({ length: 30 }, (_, i) => { const x = 780 + i * 12.8; const u = (x - 760) / 400; const cy = 80 + (1 - Math.pow(2 * u - 1, 2)) * 440 * 0.5 + dy * 0.5; return <path key={i} d={`M${x},${cy} V${600 + dy}`} stroke="#E0393E" strokeWidth={2} opacity={0.7} />; })}
      {/* tabliye */}
      <rect x={0} y={600 + dy} width={1920} height={34} fill="#5E666C" /><rect x={0} y={596 + dy} width={1920} height={8} fill="#F4F4F2" />
      {ships && <g transform={`translate(${md(t * 40, 2200) - 140},860)`}><path d="M-70,0 L70,0 L55,24 L-55,24Z" fill="#F4F4F2" /><rect x={-30} y={-26} width={60} height={26} fill="#E0393E" /></g>}
    </g>
  );
};

// ── bakkal önü. kepenk 0 kapalı → 1 açık, night
export const BakkalOn: React.FC<{ t: number; open?: number; night?: number }> = ({ t, open = 1, night = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#1E2A44" : "#BFE3F2"} />
    <rect x={560} y={120} width={800} height={900} fill="#E8D8BE" />
    <rect x={600} y={160} width={720} height={90} fill="#3FAE6A" /><text x={960} y={225} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={60} fill="#FFFFFF">BAKKAL</text>
    <rect x={640} y={290} width={640} height={620} fill={night ? "#FFE6A8" : "#F7F1E6"} />
    {/* raflar */}
    {[0, 1, 2].map((r) => <g key={r}><rect x={660} y={380 + r * 150} width={600} height={12} fill="#8A5A32" />{Array.from({ length: 9 }, (_, i) => <rect key={i} x={672 + i * 64} y={300 + r * 150} width={50} height={80} rx={6} fill={["#E0393E", "#F6C445", "#3A7BD5", "#3FAE6A", "#F28C28", "#E86A92"][(i + r * 2) % 6]} />)}</g>)}
    {/* tezgah + ekmek */}
    <rect x={640} y={790} width={640} height={120} fill="#A86E40" />
    {Array.from({ length: 5 }, (_, i) => <ellipse key={i} cx={720 + i * 60} cy={780} rx={40} ry={16} fill="#D9A54A" stroke="#9A6A20" strokeWidth={3} />)}
    {/* kepenk */}
    <g><rect x={640} y={290} width={640} height={620 * (1 - open)} fill="#9AA3A8" />{Array.from({ length: Math.floor(30 * (1 - open)) }, (_, i) => <path key={i} d={`M640,${300 + i * 20} H1280`} stroke="#7E868A" strokeWidth={4} />)}</g>
    <rect y={1010} width={1920} height={70} fill="#8C9AA6" />
    {night > 0 && <circle cx={1500} cy={160} r={50} fill="#F4F1E4" opacity={night} />}
    <circle cx={md(t * 7, 1)} cy={0} r={0} />
  </g>
);

// ── Van Gölü manzarası. foam: köpük, ice: kıyı karı
export const VanGolu: React.FC<{ t: number; foam?: number; snow?: number }> = ({ t, foam = 0, snow = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={snow ? "#D6E4EE" : "#A9D8F0"} />
    <path d="M0,520 L300,360 L520,440 L760,300 L980,420 L1240,320 L1500,430 L1920,360 V560 H0Z" fill={snow ? "#F4F8FB" : "#8A9A7A"} />
    <path d="M760,300 L700,360 L820,350Z M1240,320 L1190,370 L1300,365Z" fill="#FFFFFF" />
    <rect y={540} width={1920} height={540} fill="#1E7FB8" />
    <rect y={540} width={1920} height={540} fill="#2EC4D0" opacity={0.25} />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${md(i * 230 + t * 50, 2200) - 100},${600 + (i % 5) * 90} q40,-14 80,0 q40,14 80,0`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.4} />)}
    {foam > 0 && Array.from({ length: 30 }, (_, i) => <circle key={i} cx={md(i * 97, 640) + 640} cy={560 + md(i * 53, 120)} r={8 + (i % 4) * 4} fill="#FFFFFF" opacity={foam * 0.7} />)}
    {snow > 0 && Array.from({ length: 60 }, (_, i) => <circle key={i} cx={md(i * 211 + Math.sin(t + i) * 30, 1920)} cy={md(i * 97 + t * 80, 1080)} r={3 + (i % 3)} fill="#FFFFFF" opacity={snow} />)}
  </g>
);

// ── inci kefali
export const Kefal: React.FC<{ x: number; y: number; s?: number; rot?: number; t?: number }> = ({ x, y, s = 1, rot = 0, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`}>
    <path d={`M-90,0 Q-20,-46 60,-10 L110,${-30 + Math.sin(t * 12) * 10} L100,0 L110,${30 + Math.sin(t * 12) * 10} L60,10 Q-20,46 -90,0Z`} fill="#C9D6DE" stroke="#7E8E9A" strokeWidth={4} />
    <path d="M-60,-6 Q0,-20 50,-4" stroke="#F2A0A0" strokeWidth={6} fill="none" opacity={0.7} />
    <circle cx={-62} cy={-6} r={7} fill={INK} /><circle cx={-60} cy={-8} r={2} fill="#FFFFFF" />
  </g>
);

// ── karlı yol + gece. snow 0..1 yağış, depth: kar yığını (0..1, arabanın tekerine kadar)
export const KarYol: React.FC<{ t: number; snow?: number; depth?: number; night?: number }> = ({ t, snow = 1, depth = 0.5, night = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#1E2A44" : "#C9D6E2"} />
    {[0, 1, 2, 3].map((i) => <path key={i} d={`M${560 + i * 220},${700} l50,-160 l50,160Z`} fill="#2E4A3A" opacity={0.8} />)}
    <rect y={700} width={1920} height={380} fill="#E6EEF4" />
    <path d={`M0,${880 - depth * 120} Q480,${840 - depth * 140} 960,${870 - depth * 120} T1920,${860 - depth * 120} V1080 H0Z`} fill="#F4F8FB" />
    {snow > 0 && Array.from({ length: 140 }, (_, i) => <circle key={i} cx={md(i * 211 + Math.sin(t * 2 + i) * 40 - t * 60, 1920)} cy={md(i * 97 + t * 220, 1080)} r={3 + (i % 4)} fill="#FFFFFF" opacity={snow * 0.9} />)}
  </g>
);
// ── kar örtüsü (önde yağış)
export const Kar: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => <g>{Array.from({ length: 70 }, (_, i) => <circle key={i} cx={md(i * 173 - t * 80 + Math.sin(t + i) * 30, 1920)} cy={md(i * 131 + t * 260, 1080)} r={5 + (i % 4) * 2} fill="#FFFFFF" opacity={0.9 * k} />)}</g>;

// ── yeraltı şehri kesiti. levels: açılan kat sayısı (0..8), dig: tünel ilerlemesi
export const YeraltiKesit: React.FC<{ t: number; levels?: number; light?: number }> = ({ t, levels = 8, light = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#B98A5E" />
    <rect width={1920} height={150} fill="#9FD3F0" />
    <rect y={130} width={1920} height={30} fill="#7A9A5A" />
    {/* ev */}
    <g transform="translate(960,130)"><rect x={-110} y={-120} width={220} height={120} fill="#E8D8BE" /><path d="M-130,-120 L0,-190 L130,-120Z" fill="#C46A3A" /><rect x={-20} y={-60} width={40} height={60} fill="#8A5A32" /></g>
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={md(i * 211, 1920)} cy={200 + md(i * 97, 860)} r={6 + (i % 4) * 3} fill="#A67A50" />)}
    {/* katlar */}
    {Array.from({ length: 8 }, (_, i) => {
      const on = cl(levels - i); const y = 220 + i * 105; const x = 700 + (i % 2) * 120;
      return <g key={i} opacity={on}>
        <rect x={x} y={y} width={380} height={80} rx={30} fill="#3A2A1E" />
        <rect x={x + 10} y={y + 10} width={360} height={60} rx={24} fill={`rgba(255,200,110,${0.25 * light})`} />
        <rect x={(i % 2 ? x - 10 : x + 360)} y={y + 60} width={40} height={60} fill="#3A2A1E" />
        {i % 3 === 1 && <circle cx={x + 300} cy={y + 40} r={26} fill="#8A7A6A" stroke="#5E4E40" strokeWidth={6} />}
        {i % 2 === 0 && <circle cx={x + 80} cy={y + 50} r={8} fill="#FFB84A" opacity={0.7 + 0.3 * Math.sin(t * 8 + i)} />}
      </g>;
    })}
    {/* havalandırma bacası */}
    <rect x={1200} y={160} width={26} height={860 * cl(levels / 8)} fill="#2A1E16" opacity={0.8} />
  </g>
);

// ── taş kapı (tekerlek). roll 0 açık → 1 kapalı
export const TasKapi: React.FC<{ x?: number; y?: number; s?: number; roll: number }> = ({ x = 960, y = 600, s = 1, roll }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-260} y={-260} width={520} height={520} fill="#3A2A1E" />
    <rect x={-150} y={-200} width={300} height={400} rx={30} fill="#1A120C" />
    <g transform={`translate(${lerp(-330, 0, roll)},0) rotate(${lerp(-200, 0, roll)})`}>
      <circle r={210} fill="#9A8A78" stroke="#6E5E4E" strokeWidth={14} />
      <circle r={40} fill="#5E4E40" />
      {[0, 60, 120].map((a) => <path key={a} d="M-180,0 H180" stroke="#7E6E5E" strokeWidth={6} transform={`rotate(${a})`} opacity={0.5} />)}
    </g>
  </g>
);

export const _k2d3 = { T };
