import React from "react";
import { Bidon } from "./SonIki";
import { morsOf } from "./YolVan";

// Kanal 2 · k2r-19 "Kefal" (4. bölüm) kiti: jeneratör, yırtık mama çuvalı, el telsizi, radyo mors şeridi (el imzası),
// plastik gül, vlog telefonu, göl kıyısı hangar, inci kefali soğuk hava deposu (dış + iç), devrik direk, Kutup Yıldızı,
// dikiz aynası, martı/ses dalgası, telsiz menzil haritası, çay buharı, saç tokası.
type Mode = "day" | "dusk" | "night";
const md = (v: number, m: number) => ((v % m) + m) % m;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const rnd = (i: number) => md(Math.sin(i * 127.1 + 311.7) * 43758.5453, 1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

export const Buhar: React.FC<{ x: number; y: number; s?: number; t: number; k?: number }> = ({ x, y, s = 1, t, k = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
    {[0, 1, 2].map((i) => { const ph = md(t * 0.35 + i / 3, 1); return <path key={i} d={`M${-20 + i * 20},0 q${-18},-40 0,-80 q18,-40 0,-80`} transform={`translate(${Math.sin(t * 2 + i) * 6},${-ph * 60})`} stroke="#FFFFFF" strokeWidth={10} strokeLinecap="round" fill="none" opacity={0.45 * (1 - ph) * k} />; })}
  </g>
);

export const Jenerator: React.FC<{ x?: number; y?: number; s?: number; t: number; on?: number; pull?: number }> = ({ x = 960, y = 900, s = 1, t, on = 0, pull = 0 }) => {
  const sh = on > 0 ? Math.sin(t * 60) * 2.5 * on : 0;
  return (
    <g transform={`translate(${x + sh},${y}) scale(${s})`}>
      <ellipse cx={0} cy={10} rx={260} ry={26} fill="#000" opacity={0.3} />
      <rect x={-240} y={-260} width={480} height={260} rx={16} fill="#D9A21E" />
      <rect x={-240} y={-260} width={480} height={40} rx={12} fill="#F6C445" />
      <rect x={-200} y={-200} width={240} height={160} rx={10} fill="#2A2E34" />
      {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-190} y={-190 + i * 22} width={220} height={8} rx={4} fill="#3A4048" />)}
      <circle cx={130} cy={-140} r={56} fill="#2A2E34" /><circle cx={130} cy={-140} r={36} fill="#4A5058" />
      <rect x={70} y={-60} width={140} height={34} rx={8} fill="#1E2228" />
      <circle cx={100} cy={-43} r={9} fill={on > 0 ? "#3BE07A" : "#3A4048"} /><circle cx={130} cy={-43} r={9} fill={on > 0 ? "#3A4048" : "#E0393E"} />
      {/* çekme ipi */}
      <path d={`M180,-200 Q${220 + pull * 80},${-210 + pull * 30} ${240 + pull * 160},${-180 + pull * 60}`} stroke="#1E1E1E" strokeWidth={6} fill="none" />
      <rect x={232 + pull * 160} y={-196 + pull * 60} width={40} height={18} rx={8} fill="#E0393E" />
      {/* egzoz */}
      <rect x={-260} y={-230} width={30} height={60} rx={6} fill="#5A5E66" />
      {on > 0 && Array.from({ length: 5 }, (_, i) => { const ph = md(t * 1.4 + i / 5, 1); return <circle key={i} cx={-280 - ph * 90} cy={-210 - ph * 120} r={14 + ph * 34} fill="#9AA6B4" opacity={0.5 * (1 - ph) * on} />; })}
    </g>
  );
};

// Ampul (tavandan sarkan). on: 0..1 (titreyerek yanma için flick verilebilir)
export const Ampul: React.FC<{ x: number; y: number; s?: number; t: number; on?: number; flick?: number }> = ({ x, y, s = 1, t, on = 1, flick = 0 }) => {
  const f = flick > 0 ? (Math.sin(t * 47) > 0.2 ? 1 : 0.25) * flick + (1 - flick) : 1;
  const k = on * f;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M0,-400 L0,-40" stroke="#1E1E1E" strokeWidth={4} />
      <circle cx={0} cy={0} r={160} fill="#FFE6A0" opacity={0.25 * k} />
      <rect x={-12} y={-46} width={24} height={20} fill="#5A5E66" />
      <circle cx={0} cy={0} r={30} fill={k > 0.1 ? "#FFF3C0" : "#B9B39C"} opacity={0.6 + 0.4 * k} />
    </g>
  );
};

// Mama çuvalı: k=yırtılma 0..1 → iki bidon yuvarlanır
export const MamaCuval: React.FC<{ x?: number; y?: number; s?: number; t: number; k?: number; pullL?: number; pullR?: number }> = ({ x = 960, y = 1000, s = 1, t, k = 0, pullL = 0, pullR = 0 }) => {
  const g = cl(k * 1.4);
  const roll = cl((k - 0.3) / 0.7);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={260} ry={22} fill="#000" opacity={0.25} />
      <g transform={`translate(${-g * 70 - pullL * 20},0) rotate(${-g * 14})`}>
        <path d="M-200,0 L-210,-230 Q-120,-262 0,-250 L0,0Z" fill="#B5532E" />
        <text x={-110} y={-120} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#F6C445" transform="rotate(-4 -110 -120)">MAMA</text>
        <path d="M-180,-170 q30,-20 60,0 q30,20 60,0" stroke="#F6C445" strokeWidth={5} fill="none" />
      </g>
      <g transform={`translate(${g * 70 + pullR * 20},0) rotate(${g * 14})`}>
        <path d="M0,0 L0,-250 Q120,-262 210,-230 L200,0Z" fill="#9E452A" />
        <text x={100} y={-120} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#F6C445" opacity={0.8}>KÖPEK</text>
      </g>
      {/* yırtık kenar */}
      {g > 0.05 && <path d={`M${-g * 70},-250 l12,30 l-14,28 l16,30 l-12,34 l14,36 l-10,40 L${-g * 70},0`} stroke="#6A2A16" strokeWidth={6} fill="none" />}
      {/* mama taneleri */}
      {g > 0.1 && Array.from({ length: 26 }, (_, i) => <circle key={i} cx={-120 + rnd(i) * 240} cy={-10 - rnd(i + 3) * 30 * (1 - roll)} r={7} fill="#7A4A26" />)}
      {k > 0.3 && <><g transform={`translate(${-90 - roll * 260},${-60 + roll * 40}) rotate(${-roll * 90})`}><Bidon x={0} y={0} s={0.9} full={1} /></g><g transform={`translate(${70 + roll * 300},${-60 + roll * 40}) rotate(${roll * 110})`}><Bidon x={0} y={0} s={0.9} full={1} /></g></>}
    </g>
  );
};

// El telsizi (Defne'nin cebindeki). led: 0..1
export const Telsiz: React.FC<{ x: number; y: number; s?: number; t: number; led?: number; hand?: string }> = ({ x, y, s = 1, t, led = 0, hand }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {hand && <path d="M-110,140 Q-150,40 -90,-40 L100,-40 Q150,40 110,140Z" fill={hand} />}
    <rect x={-14} y={-260} width={28} height={150} rx={12} fill="#1E1E1E" />
    <rect x={-80} y={-130} width={160} height={290} rx={26} fill="#2A2E34" />
    <rect x={-60} y={-100} width={120} height={60} rx={8} fill="#7FB8A4" opacity={0.85} />
    <text x={0} y={-58} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={28} fill="#0E1A2E">CH 03</text>
    {Array.from({ length: 5 }, (_, i) => <rect key={i} x={-50} y={-10 + i * 18} width={100} height={8} rx={4} fill="#1E2228" />)}
    <circle cx={50} cy={-118} r={10} fill={led > 0.5 ? (Math.sin(t * 20) > 0 ? "#E0393E" : "#5A1A1A") : "#3A1A1A"} />
    <rect x={-96} y={-40} width={16} height={70} rx={6} fill="#1E2228" />
  </g>
);

// Radyo mors şeridi: gelen mesaj, harf harf. hand: "defne" (uzunlar uzun, aralar düzensiz) / "bora" (makine gibi eşit)
export const RadyoMors: React.FC<{ t: number; text: string; k?: number; read?: number; hand?: "defne" | "bora"; y?: number; night?: number }> = ({ t, text, k = 1, read = 0, hand = "defne", y = 540, night = 1 }) => {
  const letters = text.toUpperCase().split("");
  const items: { c: string; li: number }[] = [];
  letters.forEach((ch, li) => { const code = ch === " " ? " " : morsOf(ch); code.split("").forEach((c) => items.push({ c, li })); });
  const shown = k * items.length;
  const DOT = 22, DASH = hand === "defne" ? 92 : 58, GAP = hand === "defne" ? 12 : 14;
  // genişlik
  let w = 0; const xs: number[] = [];
  items.forEach((it, i) => { const jit = hand === "defne" ? (rnd(i + 11) - 0.5) * 10 : 0; xs.push(w + jit); w += (it.c === "." ? DOT : it.c === "-" ? DASH : 40) + GAP + (i + 1 < items.length && items[i + 1].li !== it.li ? (hand === "defne" ? 30 + rnd(i) * 20 : 34) : 0); });
  const scale = Math.min(1, 1700 / Math.max(1, w));
  const x0 = 960 - (w * scale) / 2;
  const centers: Record<number, number[]> = {};
  return (
    <g>
      <rect x={0} y={y - 120} width={1920} height={240} fill={night ? "#0B1220" : "#1A2440"} opacity={0.92} />
      <g transform={`translate(${x0},${y - 20}) scale(${scale},1)`}>
        {items.map((it, i) => {
          const vis = cl(shown - i);
          if (it.c === " ") return null;
          const ww = it.c === "." ? DOT : DASH;
          (centers[it.li] ??= []).push(xs[i] + ww / 2);
          const glow = vis > 0 && vis < 1 ? 1 : 0;
          return <g key={i}><rect x={xs[i]} y={it.c === "." ? -11 : -9} width={ww * vis} height={it.c === "." ? 22 : 18} rx={10} fill={hand === "defne" ? "#2EE6D0" : "#E0393E"} />{glow > 0 && <rect x={xs[i] - 6} y={-22} width={ww * vis + 12} height={44} rx={22} fill={hand === "defne" ? "#2EE6D0" : "#E0393E"} opacity={0.3} />}</g>;
        })}
      </g>
      {letters.map((ch, li) => { const cs = centers[li]; if (!cs || ch === " ") return null; const cx = x0 + ((cs[0] + cs[cs.length - 1]) / 2) * scale; const rd = cl(read * letters.length - li); return rd > 0 && <text key={li} x={cx} y={y + 80} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={64} fill="#F6C445" opacity={rd} stroke="#0E1A2E" strokeWidth={6} paintOrder="stroke">{ch}</text>; })}
      <circle cx={70} cy={y - 80} r={12} fill={k > 0 && k < 1 && Math.sin(t * 22) > 0 ? "#E0393E" : "#4A1A1A"} />
    </g>
  );
};

// Plastik gül (elde tutulur, holdR olarak)
export const PlastikGul: React.FC<{ s?: number; dust?: number }> = ({ s = 1, dust = 1 }) => (
  <g transform={`scale(${s}) rotate(-30)`}>
    <path d="M0,0 Q6,-80 0,-170" stroke="#3E8E5A" strokeWidth={8} fill="none" />
    <path d="M2,-80 q40,-24 56,4 q-30,14 -56,-4Z" fill="#4FAE6E" />
    <g transform="translate(0,-196)">
      <circle r={34} fill="#D6304A" /><path d="M-30,-4 Q0,-46 30,-4 Q0,20 -30,-4Z" fill="#B8203A" /><path d="M-16,-10 Q0,-30 16,-10" stroke="#8E1428" strokeWidth={5} fill="none" />
      <path d="M-20,8 q20,14 40,0" stroke="#F28A9A" strokeWidth={4} fill="none" />
      {dust > 0 && Array.from({ length: 8 }, (_, i) => <circle key={i} cx={-24 + rnd(i) * 48} cy={-24 + rnd(i + 5) * 40} r={2.5} fill="#E9E2D2" opacity={0.7 * dust} />)}
    </g>
    <rect x={-6} y={-30} width={12} height={8} fill="#E9E2D2" opacity={0.8} />
  </g>
);

// Vlog telefonu (Asya'nın): ekran kaydı + 0 izleyici
export const VlogTel: React.FC<{ x: number; y: number; s?: number; t: number; face?: React.ReactNode; viewers?: number }> = ({ x, y, s = 1, t, face, viewers = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-150} y={-300} width={300} height={600} rx={40} fill="#1A1A1E" />
    <rect x={-134} y={-280} width={268} height={560} rx={28} fill="#F2E6D8" />
    <clipPath id="vlogClip"><rect x={-134} y={-280} width={268} height={560} rx={28} /></clipPath>
    <g clipPath="url(#vlogClip)">{face}</g>
    <rect x={-120} y={-262} width={110} height={40} rx={20} fill="#E0393E" />
    <circle cx={-98} cy={-242} r={8} fill="#FFFFFF" opacity={Math.sin(t * 6) > 0 ? 1 : 0.3} />
    <text x={-54} y={-232} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={24} fill="#FFFFFF">KAYIT</text>
    <rect x={20} y={-262} width={100} height={40} rx={20} fill="#000" opacity={0.5} />
    <text x={70} y={-232} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={24} fill="#FFFFFF">👁 {viewers}</text>
  </g>
);

// Göl kıyısı paslı hangar (Asya'nın gösterdiği yanlış yer)
export const Hangar: React.FC<{ t: number; open?: number; beam?: number; tracks?: number; cans?: number; inside?: boolean }> = ({ t, open = 1, beam = 0, tracks = 1, cans = 3, inside = false }) => (
  <g>
    <rect width={1920} height={1080} fill="#0B1424" />
    {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 9) * 380} r={rnd(i + 3) * 2 + 0.6} fill="#FFFFFF" opacity={0.5 + 0.5 * Math.sin(t * 2 + i)} />)}
    {/* göl */}
    <rect x={0} y={640} width={1920} height={120} fill="#162640" />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${rnd(i) * 1800},${660 + i * 12} q40,-6 80,0`} stroke="#2A4268" strokeWidth={3} fill="none" opacity={0.6} transform={`translate(${Math.sin(t + i) * 20},0)`} />)}
    <path d="M0,760 Q480,730 960,750 Q1440,770 1920,740 L1920,1080 L0,1080Z" fill="#DCE6F0" />
    {!inside && <g>
      <path d="M520,780 L520,420 Q960,250 1400,420 L1400,780Z" fill="#5A4A3E" />
      {Array.from({ length: 18 }, (_, i) => <path key={i} d={`M${540 + i * 48},${420 - Math.sin((i + 0.5) / 18 * Math.PI) * 150} L${540 + i * 48},780`} stroke="#4A3C30" strokeWidth={6} />)}
      {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={560 + rnd(i) * 820} cy={460 + rnd(i + 4) * 300} r={10 + rnd(i) * 26} fill="#8E4A26" opacity={0.5} />)}
      <path d="M520,420 Q960,250 1400,420 L1400,444 Q960,276 520,444Z" fill="#F4F8FB" />
      <rect x={780} y={500} width={360} height={280} fill="#0A0E16" />
      <rect x={780 - open * 300} y={500} width={180} height={280} fill="#6A5A4C" stroke="#3A2E24" strokeWidth={6} />
      <rect x={960 + open * 300} y={500} width={180} height={280} fill="#6A5A4C" stroke="#3A2E24" strokeWidth={6} />
    </g>}
    {inside && <g>
      <rect x={0} y={0} width={1920} height={1080} fill="#14100C" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={i * 240} y={0} width={14} height={900} fill="#2A2018" />)}
      <rect x={0} y={880} width={1920} height={200} fill="#2A2420" />
      {Array.from({ length: cans }, (_, i) => <g key={i} transform={`translate(${520 + i * 260},${960}) rotate(${i % 2 ? 90 : 0})`}><Bidon x={0} y={0} s={0.8} full={0} /></g>)}
    </g>}
    {tracks > 0 && <g opacity={0.6 * tracks}>{[0, 1].map((j) => <path key={j} d={`M${880 + j * 140},1080 Q${900 + j * 140},900 ${930 + j * 100},${inside ? 880 : 790}`} stroke="#9AAABB" strokeWidth={30} fill="none" strokeDasharray="20 14" />)}</g>}
    {beam > 0 && <path d="M200,1080 L840,560 L1260,640 Z" fill="#FFF3C0" opacity={0.16 * beam} />}
  </g>
);

// İnci kefali soğuk hava deposu (dış): beyaz bina, solmuş balık resmi, zincirli ön kapı, arkada küçük çelik kapı
export const BalikDepo: React.FC<{ t: number; storm?: number; back?: number; door?: number; beam?: number; dog?: React.ReactNode }> = ({ t, storm = 1, back = 0, door = 0, beam = 0, dog }) => (
  <g>
    <rect width={1920} height={1080} fill="#0A1220" />
    <rect x={0} y={560} width={1920} height={140} fill="#142238" />
    <path d="M0,700 Q600,680 1100,700 Q1500,715 1920,690 L1920,1080 L0,1080Z" fill="#E4ECF4" />
    <g transform={`translate(${back ? -420 : 0},0)`}>
      <rect x={460} y={360} width={1000} height={420} fill="#E8ECEF" />
      <rect x={460} y={340} width={1000} height={30} fill="#C9D2DA" />
      {/* solmuş balık resmi */}
      <g transform="translate(960,470)" opacity={0.45}>
        <path d="M-200,0 Q-80,-80 120,0 Q-80,80 -200,0Z" fill="#7FA8C9" /><path d="M120,0 L200,-60 L200,60Z" fill="#7FA8C9" /><circle cx={-130} cy={-10} r={12} fill="#2A4268" />
        <text x={0} y={120} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={44} fill="#2A4268">İNCİ KEFALİ</text>
      </g>
      {/* ön kapı + zincir */}
      <rect x={880} y={600} width={160} height={180} fill="#9AA6B4" />
      <path d="M880,690 L1040,690" stroke="#5A6068" strokeWidth={10} strokeDasharray="22 8" />
      <rect x={942} y={680} width={36} height={44} rx={6} fill="#4A4E56" />
      {/* kar yığını */}
      <path d="M440,780 Q600,640 760,780Z M1180,780 Q1360,660 1480,780Z" fill="#F4F8FB" />
      <path d="M460,360 Q700,330 960,350 Q1200,330 1460,360 L1460,380 L460,380Z" fill="#F4F8FB" />
    </g>
    {back > 0 && <g>
      {/* arka cephe, çelik kapı */}
      <rect x={980} y={360} width={700} height={420} fill="#DDE2E6" />
      <g transform={`translate(1260,560) rotate(${door * 70} 0 220)`}><rect x={0} y={0} width={180} height={220} fill="#7A848E" stroke="#4A525A" strokeWidth={8} /><rect x={140} y={100} width={18} height={40} rx={6} fill="#3A3E44" /></g>
      {door > 0.5 && <rect x={1260} y={560} width={180} height={220} fill="#0A0E16" opacity={cl((door - 0.5) * 2)} />}
    </g>}
    {dog}
    {beam > 0 && <path d="M120,1080 L1000,560 L1480,640 Z" fill="#FFF3C0" opacity={0.14 * beam} />}
    {storm > 0 && Array.from({ length: 160 }, (_, i) => { const sp = 300 + rnd(i) * 500; const x = md(rnd(i + 1) * 1920 + t * sp * 1.6, 2100) - 90; const y = md(rnd(i + 2) * 1080 + t * sp * 0.4, 1080); return <circle key={i} cx={x} cy={y} r={1.5 + rnd(i + 3) * 3} fill="#FFFFFF" opacity={0.75 * storm} />; })}
  </g>
);

// Depo içi: buz tutmuş duvarlar, kancalar, kasalar, köşede battaniye (Defne)
export const DepoIci: React.FC<{ t: number; beam?: number; frost?: number; girl?: React.ReactNode; breath?: number }> = ({ t, beam = 1, frost = 1, girl, breath = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#101826" />
    <rect x={0} y={0} width={1920} height={820} fill="#1A2638" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170} y={0} width={160} height={820} fill="#1E2C40" stroke="#26364E" strokeWidth={4} />)}
    {/* buz */}
    {frost > 0 && Array.from({ length: 60 }, (_, i) => <path key={i} d={`M${rnd(i) * 1920},${rnd(i + 2) * 800} l${8 + rnd(i) * 20},${-10 - rnd(i + 1) * 20} l${6},${14}`} stroke="#CFE6F6" strokeWidth={3} fill="none" opacity={0.5 * frost} />)}
    <rect x={0} y={0} width={1920} height={30} fill="#E4F2FA" opacity={0.5 * frost} />
    {Array.from({ length: 16 }, (_, i) => <path key={i} d={`M${60 + i * 120},30 l8,${30 + rnd(i) * 50} l8,${-30 - rnd(i) * 50}`} fill="#E4F2FA" opacity={0.6 * frost} />)}
    {/* tavan rayı ve kancalar */}
    <rect x={0} y={140} width={1920} height={14} fill="#3A4656" />
    {Array.from({ length: 8 }, (_, i) => <g key={i} transform={`translate(${200 + i * 220},154) rotate(${Math.sin(t * 0.8 + i) * 3})`}><path d="M0,0 L0,90 q0,30 -26,30" stroke="#8A96A6" strokeWidth={8} fill="none" /></g>)}
    {/* kasalar */}
    <rect x={0} y={820} width={1920} height={260} fill="#2A3446" />
    {[[200, 700], [380, 700], [290, 590], [1500, 700], [1680, 700]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width={170} height={120} fill="#3E5A7A" /><path d={`M${x},${y + 40} h170 M${x},${y + 80} h170`} stroke="#2A4060" strokeWidth={6} />{Array.from({ length: 3 }, (_, j) => <ellipse key={j} cx={x + 40 + j * 45} cy={y + 20} rx={20} ry={8} fill="#B9C9D6" />)}</g>)}
    {girl}
    {breath > 0 && <circle cx={1060} cy={760 - md(t * 0.6, 1) * 60} r={20 + md(t * 0.6, 1) * 30} fill="#FFFFFF" opacity={0.25 * (1 - md(t * 0.6, 1)) * breath} />}
    {beam > 0 && <path d="M0,560 L1120,700 L1120,900 L0,1000Z" fill="#FFF3C0" opacity={0.18 * beam} />}
  </g>
);

// Battaniye altındaki Defne (yatar). blue: dudak/ten mavileşmesi 0..1
export const Battaniye: React.FC<{ x: number; y: number; s?: number; t: number; shiver?: number; blue?: number; eyes?: number }> = ({ x, y, s = 1, t, shiver = 0, blue = 1, eyes = 0 }) => {
  const sh = shiver > 0 ? Math.sin(t * 50) * 3 * shiver : 0;
  return (
    <g transform={`translate(${x + sh},${y}) scale(${s})`}>
      <ellipse cx={0} cy={20} rx={320} ry={26} fill="#000" opacity={0.3} />
      <path d="M-280,10 Q-300,-120 -120,-130 L240,-110 Q300,-60 280,10Z" fill="#7A6A9A" />
      {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${-240 + i * 110},-120 L${-250 + i * 110},10`} stroke="#5E5080" strokeWidth={10} />)}
      <circle cx={-300} cy={-70} r={70} fill={`rgb(${Math.round(lerp(40, 70, blue))},${Math.round(lerp(40, 60, blue))},${Math.round(lerp(40, 90, blue))})`} />
      <path d="M-360,-110 C-370,-170 -250,-170 -240,-110 C-280,-140 -330,-140 -360,-110Z" fill="#3A2418" />
      <circle cx={-246} cy={-128} r={11} fill="#F6C445" />
      {eyes > 0 ? <><circle cx={-318} cy={-78} r={9} fill="#FFFFFF" /><circle cx={-282} cy={-78} r={9} fill="#FFFFFF" /></> : <><path d="M-328,-78 q10,6 20,0 M-292,-78 q10,6 20,0" stroke="#FFFFFF" strokeWidth={4} fill="none" /></>}
      <path d="M-312,-44 q12,6 24,0" stroke={blue > 0.4 ? "#8A7AE0" : "#E0566A"} strokeWidth={6} fill="none" />
      {blue > 0.3 && Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-330 + i * 10},-92 l-3,-8`} stroke="#E4F2FA" strokeWidth={3} />)}
    </g>
  );
};

// Yola devrilmiş elektrik direği (fırtına). lift: 0..1 kalkma, roll: 0..1 kenara yuvarlanma
export const DevrikDirek: React.FC<{ x?: number; y?: number; s?: number; lift?: number; roll?: number }> = ({ x = 960, y = 980, s = 1, lift = 0, roll = 0 }) => (
  <g transform={`translate(${x + roll * 900},${y - lift * 60 + roll * 30}) scale(${s}) rotate(${-4 - lift * 8 + roll * 30})`}>
    <rect x={-700} y={-30} width={1400} height={60} rx={20} fill="#6E5338" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${-660 + i * 116},-26 l20,52`} stroke="#5A4228" strokeWidth={5} />)}
    <rect x={560} y={-90} width={30} height={180} fill="#5A4228" /><circle cx={575} cy={-90} r={14} fill="#E9E2D2" /><circle cx={575} cy={90} r={14} fill="#E9E2D2" />
    <path d="M575,-90 Q760,-60 900,-120 M575,90 Q760,140 900,60" stroke="#1E1E1E" strokeWidth={4} fill="none" />
    <path d="M-700,-30 Q-600,-60 -400,-34 L-400,-26 L-700,-26Z" fill="#F4F8FB" />
  </g>
);

// Gece göğü: Büyük Ayı → Kutup Yıldızı (k: çizgi 0..1)
export const KutupYildizi: React.FC<{ t: number; k?: number; glow?: number }> = ({ t, k = 1, glow = 1 }) => {
  const dip: [number, number][] = [[620, 760], [820, 720], [940, 640], [1060, 600], [1060, 470], [1280, 450], [1300, 600]];
  const polaris: [number, number] = [1330, 140];
  return (
    <g>
      <rect width={1920} height={1080} fill="#060B18" />
      {Array.from({ length: 220 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 5) * 1080} r={rnd(i + 2) * 1.8 + 0.4} fill="#FFFFFF" opacity={0.3 + 0.5 * Math.abs(Math.sin(t * 1.5 + i))} />)}
      <path d={dip.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ")} stroke="#2EE6D0" strokeWidth={3} fill="none" opacity={0.6} />
      {dip.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={9} fill="#FFFFFF" />)}
      <path d={`M1280,450 L${lerp(1280, polaris[0], k)},${lerp(450, polaris[1], k)}`} stroke="#F6C445" strokeWidth={5} strokeDasharray="18 12" />
      <circle cx={polaris[0]} cy={polaris[1]} r={60} fill="#F6C445" opacity={0.25 * glow * k} />
      <circle cx={polaris[0]} cy={polaris[1]} r={16} fill="#FFFBEA" />
      <text x={polaris[0]} y={polaris[1] - 80} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={52} fill="#F6C445" opacity={k}>KUZEY</text>
    </g>
  );
};

// Dikiz aynası: içinde karlı yol + iki far (yaklaşır). bora: direksiyondaki gölge + gülümseme
export const DikizAyna: React.FC<{ t: number; k?: number; bora?: number; mode?: Mode }> = ({ t, k = 1, bora = 0, mode = "night" }) => {
  const fy = 0.3 + k * 0.7;
  return (
    <g>
      <rect width={1920} height={1080} fill="#0A0E16" />
      <path d="M0,1080 L0,820 Q960,700 1920,820 L1920,1080Z" fill="#14161C" />
      <rect x={300} y={180} width={1320} height={480} rx={200} fill="#1E1E22" />
      <clipPath id="aynaC"><rect x={330} y={210} width={1260} height={420} rx={180} /></clipPath>
      <g clipPath="url(#aynaC)">
        <rect x={330} y={210} width={1260} height={420} fill={mode === "night" ? "#0E1626" : "#6A84A6"} />
        <path d="M330,630 L860,420 L1060,420 L1590,630Z" fill="#C9D6E2" />
        <path d="M955,430 L940,630" stroke="#F6C445" strokeWidth={6} strokeDasharray="20 20" />
        {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={330 + md(rnd(i) * 1260 + t * 80, 1260)} cy={210 + md(rnd(i + 3) * 420 + t * 160, 420)} r={2 + rnd(i) * 3} fill="#FFFFFF" opacity={0.6} />)}
        <g transform={`translate(960,${430 + fy * 40}) scale(${0.3 + k * 0.9})`}>
          <rect x={-170} y={-90} width={340} height={150} rx={20} fill="#3A4048" />
          <rect x={-130} y={-80} width={260} height={60} rx={10} fill="#1A2030" />
          {bora > 0 && <g opacity={bora}><circle cx={-50} cy={-54} r={22} fill="#141414" /><rect x={-80} y={-36} width={60} height={20} fill="#6E7B3A" /><path d="M-62,-50 q12,10 24,0" stroke="#FFFFFF" strokeWidth={3} fill="none" /></g>}
          {[-110, 110].map((fx) => <g key={fx}><circle cx={fx} cy={20} r={60} fill="#FFF3C0" opacity={0.35} /><circle cx={fx} cy={20} r={26} fill="#FFFBEA" /></g>)}
        </g>
      </g>
      <rect x={330} y={210} width={1260} height={60} rx={30} fill="#FFFFFF" opacity={0.05} />
    </g>
  );
};

// Ses dalgası + martı (telsiz hışırtısının içindeki ipucu). gull: 0..1 vurgulama
export const SesDalga: React.FC<{ t: number; gull?: number }> = ({ t, gull = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#0B1220" />
    <path d={Array.from({ length: 240 }, (_, i) => { const x = 120 + i * 7; const g = i > 140 && i < 170 ? gull : 0; const a = (14 + rnd(i + Math.floor(t * 12)) * 40) * (1 + g * 4); return `${i ? "L" : "M"}${x},${540 - a} L${x + 3},${540 + a}`; }).join(" ")} stroke="#2EE6D0" strokeWidth={3} fill="none" opacity={0.9} />
    {gull > 0 && <g transform="translate(1200,320)" opacity={gull}>
      <circle r={120} fill="#F6C445" opacity={0.15} />
      <path d="M-90,10 Q-45,-40 0,6 Q45,-40 90,10" stroke="#FFFFFF" strokeWidth={14} fill="none" strokeLinecap="round" />
    </g>}
  </g>
);

// Telsiz menzili: Van Gölü kıyısı şematik harita + sinyal halkaları
export const MenzilHarita: React.FC<{ t: number; k?: number; shore?: number }> = ({ t, k = 1, shore = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9DCC6" />
    <path d="M200,140 Q520,60 900,180 Q1180,260 1260,520 Q1320,760 1060,900 Q760,1020 460,880 Q180,740 160,460 Q150,260 200,140Z" fill="#7FA8C9" />
    <text x={640} y={500} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={60} fill="#2A4268" opacity={0.7}>VAN GÖLÜ</text>
    <circle cx={1420} cy={640} r={18} fill="#E0393E" />
    <text x={1460} y={656} fontFamily="Poppins" fontWeight={800} fontSize={48} fill="#3A2414">VAN</text>
    {[0, 1, 2].map((i) => { const ph = md(t * 0.5 + i / 3, 1); return <circle key={i} cx={1420} cy={640} r={60 + ph * 360 * k} fill="none" stroke="#1FC8B4" strokeWidth={6} opacity={(1 - ph) * k} />; })}
    {shore > 0 && <path d="M1240,500 Q1300,640 1220,780" stroke="#F6C445" strokeWidth={22} fill="none" strokeLinecap="round" opacity={shore} />}
  </g>
);

// Avuçta saç tokası (yakın plan)
export const TokaAvuc: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#6A5444" />
    <path d="M560,1080 Q520,700 760,600 L1200,600 Q1420,700 1380,1080Z" fill="#E8B892" />
    {[0, 1, 2, 3].map((i) => <rect key={i} x={700 + i * 140} y={360 - (i === 1 || i === 2 ? 40 : 0)} width={110} height={300} rx={55} fill="#E8B892" />)}
    <path d="M760,760 Q960,820 1180,760" stroke="#C99A72" strokeWidth={6} fill="none" />
    <g transform={`translate(960,${780 - (1 - k) * 200}) scale(${0.6 + 0.4 * k})`} opacity={k}>
      <ellipse rx={110} ry={44} fill="none" stroke="#F6C445" strokeWidth={30} />
      <ellipse rx={110} ry={44} fill="none" stroke="#C99A1E" strokeWidth={6} />
    </g>
  </g>
);
