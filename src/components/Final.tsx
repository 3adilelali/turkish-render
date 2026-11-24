import React from "react";
import { Bidon } from "./SonIki";

// Kanal 2 · k2r-20 "Final" (5. bölüm) kiti: 112 telefon ekranı, gece far sahnesi (peşrev), kispet + sandık, çaydanlık (demlik),
// tır garajı (dış: çöken düz çatı / iç: 40 bidon, tek lamba, eğilen kiriş, içeride kar tozu, çöküş), kapı kasası yakın plan,
// sobalı oda minderi, gözyaşı, göl kıyısı taş mezar + kazınan taş, kapı sedye, buğulu cama HARF yazısı (DEDE + kalp),
// kar üstü ayak izleri, fotoğraf (ışık + gelinlik + mavi tır), kar yükü hesabı.
type Mode = "day" | "dusk" | "night";
const md = (v: number, m: number) => ((v % m) + m) % m;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const rnd = (i: number) => md(Math.sin(i * 127.1 + 311.7) * 43758.5453, 1);
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

// ── 112: telefon ekranı (el tutuyor) ──
export const Tel112: React.FC<{ t: number; k?: number; fail?: number; night?: number }> = ({ t, k = 1, fail = 0, night = 1 }) => {
  const digits = "112".slice(0, Math.floor(cl(k) * 3.01 * 1));
  const ring = fail < 0.05 && k >= 1;
  return <g>
    <rect width={1920} height={1080} fill={night ? "#070A12" : "#3A4250"} />
    <circle cx={960} cy={540} r={620} fill="#2EE6D0" opacity={0.05} />
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={md(rnd(i) * 1920 + t * 20, 1920)} cy={md(rnd(i + 5) * 1080 + t * (30 + rnd(i) * 30), 1080)} r={2 + rnd(i) * 3} fill="#FFFFFF" opacity={0.35} />)}
    {/* el */}
    <path d="M700,1080 Q690,820 780,760 L1140,760 Q1230,820 1220,1080Z" fill="#E8B892" />
    <ellipse cx={1180} cy={560} rx={44} ry={110} fill="#E8B892" transform="rotate(14 1180 560)" />
    {/* telefon */}
    <g transform="translate(960,520) rotate(-4)">
      <rect x={-230} y={-430} width={460} height={860} rx={60} fill="#15181E" />
      <rect x={-208} y={-404} width={416} height={808} rx={44} fill={fail > 0 ? "#2A0E12" : "#0E1A2E"} />
      <rect x={-40} y={-390} width={80} height={16} rx={8} fill="#15181E" />
      <text x={-180} y={-340} fontFamily="Poppins" fontWeight={700} fontSize={30} fill="#FFFFFF" opacity={0.8}>03:0{Math.floor(t) % 2 ? 1 : 1}</text>
      <g transform="translate(150,-350)">{[0, 1, 2, 3].map((i) => <rect key={i} x={i * 14} y={-i * 8} width={10} height={8 + i * 8} fill="#FFFFFF" opacity={0.15} />)}<path d="M-8,-28 L60,10" stroke="#E0393E" strokeWidth={6} /></g>
      <text x={0} y={-150} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={150} fill="#FFFFFF" letterSpacing={10}>{digits}</text>
      {ring && <text x={0} y={-40} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={40} fill="#2EE6D0" opacity={0.5 + 0.5 * Math.sin(t * 8)}>ARANIYOR…</text>}
      {fail > 0 && <g opacity={cl(fail * 2)}><rect x={-170} y={-60} width={340} height={110} rx={20} fill="#E0393E" /><text x={0} y={14} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={52} fill="#FFFFFF">ŞEBEKE YOK</text></g>}
      {/* tuş takımı */}
      {Array.from({ length: 9 }, (_, i) => <g key={i} transform={`translate(${-120 + (i % 3) * 120},${110 + Math.floor(i / 3) * 90})`}><circle r={38} fill="#FFFFFF" opacity={0.1} /><text y={14} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={38} fill="#FFFFFF" opacity={0.7}>{i + 1}</text></g>)}
      <circle cx={0} cy={410 - 30} r={0} />
      <g transform="translate(0,360)"><circle r={44} fill={fail > 0 ? "#5A1A1E" : "#3BE07A"} /><path d="M-16,-6 q16,24 32,0" stroke="#FFFFFF" strokeWidth={8} fill="none" /></g>
    </g>
    {/* basan baş parmak */}
    <ellipse cx={lerp(820, 1000, (Math.floor(k * 3) % 3) / 2)} cy={720 + Math.sin(t * 14) * 6} rx={46} ry={70} fill="#E8B892" opacity={k < 1 ? 1 : 0.0} />
  </g>;
};

// ── gece yol: duran Şahin (solda) + karşıda kamyonet farları (sağda), ışık konisi. Figürler children ile ──
export const FarGece: React.FC<{ t: number; far?: number; dist?: number; blink?: number; children?: React.ReactNode; shadow?: number; shadowX?: number }> = ({ t, far = 1, dist = 0, blink = 1, children, shadow = 0, shadowX = 900 }) => {
  const tx = lerp(1640, 1900, dist), ts = lerp(0.9, 0.45, dist);
  const L = far * blink;
  return <g>
    <rect width={1920} height={1080} fill="#060A14" />
    {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 9) * 420} r={rnd(i + 3) * 2 + 0.5} fill="#FFFFFF" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />)}
    <path d="M0,560 Q300,500 640,540 Q1000,580 1340,520 Q1640,480 1920,540 L1920,700 L0,700Z" fill="#0E1626" />
    <path d="M0,640 Q960,600 1920,640 L1920,1080 L0,1080Z" fill="#C9D4E2" />
    <path d="M-200,1080 L760,660 L1160,660 L2120,1080Z" fill="#9AA6B6" opacity={0.55} />
    {/* Şahin (duruyor, motor açık) */}
    <g transform="translate(360,900)">
      <path d="M-260,0 L-250,-110 Q-200,-200 -60,-210 L120,-210 Q220,-200 260,-110 L280,0Z" fill="#B8BFC6" />
      <path d="M-180,-110 Q-150,-180 -60,-186 L40,-186 L40,-110Z" fill="#1A2436" /><path d="M60,-186 L130,-186 Q200,-176 220,-110 L60,-110Z" fill="#1A2436" />
      <circle cx={-160} cy={0} r={52} fill="#1A1A1A" /><circle cx={170} cy={0} r={52} fill="#1A1A1A" /><path d="M-260,-60 Q0,-80 280,-60" stroke="#F4F8FB" strokeWidth={14} fill="none" />
      <path d="M-262,-40 q-14,-8 -36,-6" stroke="#FFFFFF" strokeWidth={8} opacity={0.3 + 0.2 * Math.sin(t * 6)} fill="none" />
      {Array.from({ length: 4 }, (_, i) => <circle key={i} cx={-300 - i * 30 - md(t * 40, 30)} cy={-30 - i * 16} r={14 + i * 6} fill="#FFFFFF" opacity={0.12 - i * 0.025} />)}
    </g>
    {/* ışık konisi */}
    <path d={`M${tx - 120 * ts},${900 - 110 * ts} L0,${640} L0,1080 L${tx - 120 * ts},${900 - 40 * ts}Z`} fill="#FFF3C0" opacity={0.18 * L} />
    <path d={`M${tx - 120 * ts},${900 - 100 * ts} L400,700 L300,1080 L${tx - 120 * ts},${900 - 50 * ts}Z`} fill="#FFF3C0" opacity={0.14 * L} />
    {shadow > 0 && <ellipse cx={shadowX - 520} cy={1010} rx={560} ry={26} fill="#0A0E16" opacity={0.45 * shadow} />}
    {children}
    {/* kamyonet (karşıdan, farlar) */}
    <g transform={`translate(${tx},${900}) scale(${ts})`}>
      <path d="M-200,0 L-190,-260 Q-180,-300 -120,-300 L140,-300 Q200,-300 200,-240 L210,0Z" fill="#3E4A3A" />
      <rect x={-160} y={-280} width={320} height={110} rx={14} fill="#121A26" />
      <circle cx={-130} cy={-90} r={40} fill="#FFF3C0" opacity={0.25 + 0.75 * L} /><circle cx={130} cy={-90} r={40} fill="#FFF3C0" opacity={0.25 + 0.75 * L} />
      <circle cx={-130} cy={-90} r={140} fill="#FFF3C0" opacity={0.25 * L} /><circle cx={130} cy={-90} r={140} fill="#FFF3C0" opacity={0.25 * L} />
      <rect x={-200} y={-20} width={410} height={30} fill="#2A3428" /><rect x={-170} y={0} width={70} height={40} fill="#111" /><rect x={100} y={0} width={70} height={40} fill="#111" />
    </g>
    <rect width={1920} height={1080} fill="#FFF3C0" opacity={0.03 * L} />
  </g>;
};

// ── kispet (kara deri pantolon) ──
export const Kispet: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`}>
    <path d="M-170,-220 L170,-220 L190,-160 L150,200 L30,200 L0,-40 L-30,200 L-150,200 L-190,-160Z" fill="#1E1A18" />
    <path d="M-170,-220 L170,-220 L176,-180 L-176,-180Z" fill="#3A2E28" />
    {[-120, -60, 0, 60, 120].map((xx) => <rect key={xx} x={xx - 6} y={-216} width={12} height={30} rx={4} fill="#8A6A4A" />)}
    <ellipse cx={-90} cy={110} rx={40} ry={56} fill="#FFFFFF" opacity={0.18} /><ellipse cx={90} cy={110} rx={40} ry={56} fill="#FFFFFF" opacity={0.18} />
    <path d="M-150,200 L-30,200 M30,200 L150,200" stroke="#6A4A30" strokeWidth={10} />
    {[-130, -100, -70, 70, 100, 130].map((xx) => <circle key={xx} cx={xx} cy={186} r={5} fill="#B89A6A" />)}
    <path d="M-60,-150 Q0,-100 60,-150" stroke="#FFFFFF" strokeWidth={4} opacity={0.12} fill="none" />
  </g>
);
export const Sandik: React.FC<{ x: number; y: number; s?: number; open?: number; kispet?: boolean }> = ({ x, y, s = 1, open = 0, kispet = true }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-300} y={-220} width={600} height={220} rx={14} fill="#7A4E2E" />
    {[-200, 0, 200].map((xx) => <rect key={xx} x={xx - 10} y={-220} width={20} height={220} fill="#5A3820" />)}
    <rect x={-300} y={-120} width={600} height={14} fill="#5A3820" />
    {open > 0 && kispet && <g transform="translate(0,-150) scale(0.7,0.35)" opacity={Math.min(1, open * 2)}><Kispet x={0} y={0} /></g>}
    <g transform={`translate(0,-220) rotate(${-open * 70} -300 0)`}><rect x={-310} y={-70} width={620} height={70} rx={20} fill="#8A5A36" /><rect x={-20} y={-30} width={40} height={50} rx={6} fill="#D9B44A" /></g>
  </g>
);

// ── çaydanlık (iki katlı demlik) ──
export const Demlik: React.FC<{ x: number; y: number; s?: number; t: number; boil?: number }> = ({ x, y, s = 1, t, boil = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-130,0 Q-150,-120 -100,-150 L100,-150 Q150,-120 130,0Z" fill="#C9CED4" />
    <path d="M130,-90 Q200,-110 230,-170" stroke="#AEB4BC" strokeWidth={22} fill="none" strokeLinecap="round" />
    <path d="M-80,-150 Q-100,-240 -60,-260 L60,-260 Q100,-240 80,-150Z" fill="#E0566A" />
    <path d="M80,-210 Q130,-220 150,-260" stroke="#C9473E" strokeWidth={14} fill="none" strokeLinecap="round" />
    <ellipse cx={0} cy={-262} rx={64} ry={14} fill="#B8404F" /><circle cx={0} cy={-280} r={14} fill="#B8404F" />
    <path d="M-60,-120 Q0,-100 60,-120" stroke="#FFFFFF" strokeWidth={6} opacity={0.4} fill="none" />
    {boil > 0 && Array.from({ length: 4 }, (_, i) => <path key={i} d={`M${232 + i * 6},${-180 - md(t * 60 + i * 40, 160)} q20,-20 0,-40 q-20,-20 0,-40`} stroke="#FFFFFF" strokeWidth={8} fill="none" opacity={boil * 0.35 * (1 - md(t * 60 + i * 40, 160) / 160)} />)}
  </g>
);

// ── tır garajı (dış) · gece. sag: çatı çökmesi, k: çöküş (toz bulutu) ──
export const GarajDis: React.FC<{ t: number; sag?: number; fall?: number; lamp?: number; mode?: Mode; car?: boolean }> = ({ t, sag = 0.2, fall = 0, lamp = 1, mode = "night", car = false }) => {
  const dip = 30 + sag * 70 + fall * 260;
  return <g>
    <rect width={1920} height={1080} fill={mode === "night" ? "#070C18" : "#3A3050"} />
    {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 9) * 380} r={rnd(i + 3) * 2 + 0.5} fill="#FFFFFF" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />)}
    <path d="M0,520 Q400,380 820,470 Q1200,540 1560,420 Q1760,380 1920,440 L1920,760 L0,760Z" fill="#1A2234" />
    <path d="M0,520 Q400,380 820,470 Q1200,540 1560,420 Q1760,380 1920,440 L1920,470 Q1760,410 1560,450 Q1200,570 820,500 Q400,410 0,550Z" fill="#DCE6F0" opacity={0.7} />
    <path d="M0,780 Q960,740 1920,780 L1920,1080 L0,1080Z" fill="#C9D4E2" />
    {/* bina */}
    <g>
      <rect x={360} y={420} width={1200} height={390} fill="#5E6670" />
      {Array.from({ length: 16 }, (_, i) => <rect key={i} x={360 + i * 75} y={420} width={4} height={390} fill="#4A5260" />)}
      <path d={`M340,420 L960,${420 + dip} L1580,420 L1580,${420 - 60} L960,${420 - 60 + dip} L340,${420 - 60}Z`} fill="#F4F8FB" />
      <path d={`M340,420 L960,${420 + dip} L1580,420`} stroke="#3A4250" strokeWidth={14} fill="none" />
      {/* demir kapı */}
      <rect x={760} y={560} width={400} height={250} fill="#3A4250" />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={760} y={570 + i * 24} width={400} height={6} fill="#2A3240" />)}
      <rect x={760} y={560} width={400} height={250} fill="#FFC24A" opacity={lamp * 0.06} />
      <path d="M760,810 L700,1080 L1220,1080 L1160,810Z" fill="#FFC24A" opacity={lamp * 0.05} />
      <text x={960} y={500} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#C9CED4" opacity={0.6}>TIR GARAJI</text>
      {/* çatı kenarından sarkan buz */}
      {Array.from({ length: 22 }, (_, i) => <path key={i} d={`M${380 + i * 54},${420 + (i < 11 ? i : 22 - i) / 11 * dip * 0.98} l6,${18 + rnd(i) * 30} l6,${-18 - rnd(i) * 30}`} fill="#E4F2FA" opacity={0.8} />)}
    </g>
    {fall > 0 && <g opacity={cl(fall * 1.6)}>{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={560 + rnd(i) * 800} cy={460 - rnd(i + 2) * 200 * fall} r={60 + rnd(i + 4) * 120 * fall} fill="#E4ECF4" opacity={0.5} />)}</g>}
    {car && <g transform="translate(260,960) scale(0.6)"><path d="M-260,0 L-250,-110 Q-200,-200 -60,-210 L120,-210 Q220,-200 260,-110 L280,0Z" fill="#B8BFC6" /><circle cx={-160} cy={0} r={52} fill="#1A1A1A" /><circle cx={170} cy={0} r={52} fill="#1A1A1A" /><circle cx={270} cy={-70} r={60} fill="#FFF3C0" opacity={0.3} /></g>}
  </g>;
};

// ── uyuyan Su (battaniye + sarı mont), baş solda. flip: baş sağda ──
export const SuYatar: React.FC<{ x: number; y: number; s?: number; t: number; flip?: boolean; eyes?: number; blanket?: boolean }> = ({ x, y, s = 1, t, flip = false, eyes = 0, blanket = true }) => (
  <g transform={`translate(${x},${y}) scale(${flip ? -s : s},${s})`}>
    <ellipse cx={0} cy={0} rx={150} ry={22} fill="#000" opacity={0.25} />
    {blanket ? <path d="M-140,-8 Q-130,-70 -40,-74 L120,-70 Q150,-50 140,-8Z" fill="#7A6A9A" /> : <path d="M-140,-8 Q-130,-70 -40,-74 L120,-70 Q150,-50 140,-8Z" fill="#F6C445" />}
    <path d="M-140,-30 Q-100,-60 -40,-60 L-10,-60 L-10,-8 L-140,-8Z" fill="#F6C445" />
    <circle cx={-150} cy={-48} r={34} fill="#F1C9A5" /><path d="M-184,-56 Q-160,-90 -120,-62" fill="#3A2418" />
    {eyes > 0 ? <g><circle cx={-162} cy={-46} r={5} fill="#2A1A12" /><circle cx={-142} cy={-46} r={5} fill="#2A1A12" /></g> : <path d="M-170,-40 q8,4 16,0" stroke="#3A2418" strokeWidth={4} fill="none" />}
    <path d="M-186,-40 q-10,30 -4,50" stroke="#3A2418" strokeWidth={10} fill="none" /><circle cx={-190} cy={12} r={7} fill="#E0393E" />
    {eyes <= 0 && <text x={flip ? -180 : -210} y={-96} fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#FFFFFF" opacity={0.6 + 0.3 * Math.sin(t * 1.5)} transform={flip ? "scale(-1,1)" : undefined}>z</text>}
  </g>
);

// ── tır garajı (iç). bend: kiriş eğilmesi 0..1, dust: içeride kar tozu, fall: çöküş, lamp: lamba, sway: lamba sallanma ──
export const GarajIc: React.FC<{ t: number; bend?: number; dust?: number; fall?: number; lamp?: number; sway?: number; gen?: number; su?: boolean; stove?: number; children?: React.ReactNode; front?: React.ReactNode }> = ({ t, bend = 0, dust = 0, fall = 0, lamp = 1, sway = 0, gen = 1, su = true, stove = 1, children, front }) => {
  const bd = bend * 90 + fall * 500;
  const sw = Math.sin(t * 2.2) * (6 + sway * 18);
  const shake = fall > 0 && fall < 1 ? Math.sin(t * 60) * 10 * (1 - fall) : 0;
  return <g transform={`translate(${shake},${shake * 0.5})`}>
    <rect width={1920} height={1080} fill="#121822" />
    <rect x={0} y={120} width={1920} height={760} fill="#2A323E" />
    {Array.from({ length: 13 }, (_, i) => <rect key={i} x={i * 150} y={120} width={6} height={760} fill="#222A34" />)}
    {/* kiriş (tavan) */}
    <path d={`M0,120 L960,${120 + bd} L1920,120 L1920,150 L960,${150 + bd} L0,150Z`} fill="#4A525E" />
    {Array.from({ length: 12 }, (_, i) => { const x = 80 + i * 160; const y = 135 + bd * (1 - Math.abs(x - 960) / 960); return <path key={i} d={`M${x},${y - 14} l20,28 l20,-28`} stroke="#3A424E" strokeWidth={5} fill="none" />; })}
    {/* bidonlar: 40 tane, iki sıra */}
    {Array.from({ length: 40 }, (_, i) => { const row = Math.floor(i / 20); const x = 1020 + (i % 20) * 44; const y = 840 - row * 120; return <g key={i} transform={`translate(${x},${y}) scale(0.32)`} opacity={fall > 0.6 && row === 0 ? 0 : 1}><Bidon x={0} y={0} full={1} /></g>; })}
    <text x={1460} y={560} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#9FD3EC" opacity={0.0}>40</text>
    {/* jeneratör */}
    <g transform="translate(200,860) scale(0.9)"><rect x={-110} y={-140} width={220} height={140} rx={14} fill="#C9473E" /><rect x={-80} y={-110} width={160} height={70} rx={8} fill="#2A2A2A" /><circle cx={70} cy={-20} r={10} fill={gen > 0 ? "#3BE07A" : "#3A3A3A"} />{gen > 0 && <path d={`M-120,-60 q-30,${-10 + Math.sin(t * 30) * 4} -50,-30`} stroke="#9AA6B6" strokeWidth={6} fill="none" opacity={0.5} />}</g>
    <path d="M200,800 Q500,700 960,90" stroke="#1A1A1A" strokeWidth={6} fill="none" opacity={0.8} />
    {/* ocak + çaydanlık */}
    {stove > 0 && <g transform="translate(700,880)"><rect x={-90} y={-70} width={180} height={70} rx={8} fill="#3A3A3A" /><circle cx={0} cy={-70} r={60} fill="#FF6A2A" opacity={0.18 * stove + 0.06 * Math.sin(t * 9)} /><Demlik x={0} y={-74} s={0.5} t={t} boil={stove} /></g>}
    {/* uyuyan Su (battaniye + sarı mont) */}
    {su && <SuYatar x={470} y={900} t={t} />}
    {/* lamba */}
    <g transform={`translate(960,${120 + bd}) rotate(${sw})`}>
      <path d="M0,0 V200" stroke="#1A1A1A" strokeWidth={4} /><path d="M-50,200 L50,200 L30,170 L-30,170Z" fill="#3A3A3A" />
      <circle cx={0} cy={214} r={18} fill={lamp > 0 ? "#FFF3C0" : "#444"} />
    </g>
    {lamp > 0 && <ellipse cx={960 + sw * 6} cy={760} rx={760} ry={420} fill="#FFC24A" opacity={lamp * 0.1} />}
    <rect x={0} y={880} width={1920} height={200} fill="#20262E" /><rect x={0} y={880} width={1920} height={10} fill="#3A424E" />
    {children}
    {/* içeride yağan kar tozu */}
    {dust > 0 && Array.from({ length: 90 }, (_, i) => <circle key={i} cx={lerp(600, 1320, rnd(i)) + Math.sin(t * 2 + i) * 20} cy={140 + bd * 0.8 + md(rnd(i + 3) * 760 + t * (80 + rnd(i) * 80), 760)} r={2 + rnd(i + 1) * 4} fill="#FFFFFF" opacity={dust * 0.7} />)}
    {fall > 0 && <g opacity={cl(fall * 1.4)}><rect width={1920} height={1080} fill="#DCE4EC" opacity={0.5 * fall} />{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={300 + rnd(i + 2) * 700} r={80 + rnd(i + 4) * 160} fill="#E8EEF4" opacity={0.4} />)}</g>}
    {front}
    {lamp <= 0 && <rect width={1920} height={1080} fill="#000" opacity={0.6} />}
  </g>;
};

// ── kapı kasası (yakın, içeriden dışarıya). gap: kasa açıklığı 0..1. Bayram ve geçenler children ──
export const KapiKasa: React.FC<{ t: number; gap?: number; dust?: number; children?: React.ReactNode; stuck?: boolean }> = ({ t, gap = 0, dust = 0.5, children }) => {
  const top = lerp(300, 180, gap);
  return <g>
    <rect width={1920} height={1080} fill="#1A2030" />
    {/* dışarısı: gece kar */}
    <rect x={560} y={top} width={800} height={880 - top + 120} fill="#0A1426" />
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={560 + rnd(i) * 800} cy={top + md(rnd(i + 2) * 700 + t * 50, 700)} r={2 + rnd(i) * 3} fill="#FFFFFF" opacity={0.6} />)}
    <path d={`M560,900 Q960,860 1360,900 L1360,1000 L560,1000Z`} fill="#C9D4E2" />
    {/* kasa */}
    <rect x={520} y={top - 40} width={40} height={1000} fill="#3A4250" /><rect x={1360} y={top - 40} width={40} height={1000} fill="#3A4250" />
    <rect x={460} y={top - 90} width={1000} height={60} fill="#4A525E" />
    <path d={`M460,${top - 90} L1460,${top - 90} L1460,0 L460,0Z`} fill="#2A323E" />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${560 + i * 160},${top - 90} l10,-30 l14,24`} stroke="#DCE4EC" strokeWidth={4} fill="none" opacity={0.5} />)}
    {/* sıkışmış kapı kanadı (yana) */}
    <rect x={1400} y={top - 20} width={300} height={960} fill="#3A4250" transform={`skewY(-4)`} />
    {children}
    {dust > 0 && Array.from({ length: 60 }, (_, i) => <circle key={i} cx={480 + rnd(i) * 960} cy={md(rnd(i + 3) * 900 + t * (90 + rnd(i) * 60), 900) + top - 90} r={2 + rnd(i + 1) * 4} fill="#FFFFFF" opacity={dust * 0.7} />)}
    <rect y={1000} width={1920} height={80} fill="#20262E" />
  </g>;
};

// ── kiriş yakın plan: eğilme + çatırtı çatlakları ──
export const KirisYakin: React.FC<{ t: number; bend?: number; dust?: number }> = ({ t, bend = 0, dust = 0 }) => {
  const b = bend * 120;
  return <g>
    <rect width={1920} height={1080} fill="#1A2030" />
    <path d={`M0,360 Q960,${360 + b * 2} 1920,360 L1920,500 Q960,${500 + b * 2} 0,500Z`} fill="#5A626E" />
    <path d={`M0,380 Q960,${380 + b * 2} 1920,380`} stroke="#6A727E" strokeWidth={8} fill="none" />
    {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={70 + i * 140} cy={430 + b * 2 * (1 - Math.pow((70 + i * 140 - 960) / 960, 2))} r={12} fill="#3A424E" />)}
    {bend > 0.3 && <path d={`M940,${420 + b * 2} l20,40 l-16,30 l24,40`} stroke="#0E1218" strokeWidth={6} fill="none" opacity={cl((bend - 0.3) * 3)} />}
    <rect y={0} width={1920} height={360} fill="#2A323E" />
    {Array.from({ length: 80 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={500 + md(rnd(i + 3) * 580 + t * (80 + rnd(i) * 80), 580)} r={2 + rnd(i + 1) * 4} fill="#FFFFFF" opacity={dust * 0.8} />)}
  </g>;
};

// ── sobalı oda: minder (duvara yaslı yer yatağı) ──
export const Minder: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-320} y={-60} width={640} height={70} rx={20} fill="#8E2F3A" /><rect x={-320} y={-60} width={640} height={14} rx={7} fill="#B8404F" />
    <path d="M-300,-60 h600" stroke="#F2C14E" strokeWidth={4} strokeDasharray="20 14" />
    <rect x={-330} y={-250} width={180} height={200} rx={40} fill="#B8404F" /><rect x={-320} y={-240} width={160} height={180} rx={34} fill="url(#tCarpet)" opacity={0.6} />
  </g>
);
// battaniye (yarı uzanan birinin bacaklarının üstüne)
export const Ortu: React.FC<{ x: number; y: number; s?: number; w?: number }> = ({ x, y, s = 1, w = 360 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><path d={`M0,0 Q${w * 0.1},-90 ${w * 0.4},-96 L${w},-80 Q${w + 20},-30 ${w},0Z`} fill="#7A6A9A" /><path d={`M${w * 0.2},-60 Q${w * 0.6},-70 ${w * 0.95},-56`} stroke="#5E5080" strokeWidth={6} fill="none" /></g>
);

// ── gözyaşı (yanaktan süzülen) ──
export const Gozyasi: React.FC<{ x: number; y: number; s?: number; t: number; k?: number }> = ({ x, y, s = 1, t, k = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
    {[-1, 1].map((sd) => { const p = md(t * 0.6 + (sd > 0 ? 0.5 : 0), 1); return <g key={sd}><path d={`M${sd * 22},0 Q${sd * 26},${30 * p} ${sd * 24},${60 * p}`} stroke="#9FD3EC" strokeWidth={5} fill="none" opacity={0.7} /><ellipse cx={sd * 24} cy={60 * p + 4} rx={5} ry={8} fill="#BFE6F8" /></g>; })}
  </g>
);

// ── buğulu cama HARFLE yazı (DEDE + kalp) ──
export const CamYazi: React.FC<{ t: number; text: string; k?: number; heart?: boolean; night?: number; sun?: number }> = ({ t, text, k = 1, heart = false, night = 0, sun = 1 }) => {
  const n = text.length + (heart ? 1 : 0);
  const shown = k * n;
  return <g>
    <rect width={1920} height={1080} fill={night ? "#0E1424" : "#6A5444"} />
    <rect x={300} y={120} width={1320} height={820} fill={sun ? "#F2A85A" : "#DCE8F0"} />
    {sun > 0 && <><circle cx={1240} cy={640} r={140} fill="#FFD27A" /><circle cx={1240} cy={640} r={320} fill="#FFD27A" opacity={0.25} /></>}
    <path d="M300,700 L700,560 L1000,640 L1300,520 L1620,600 L1620,940 L300,940Z" fill={sun ? "#7A5A8A" : "#F4F8FB"} />
    <rect x={300} y={120} width={1320} height={820} fill="#EEF3F6" opacity={0.7} />
    {/* yazı: harfler bulanık camı siliyor → arkası görünüyor */}
    {text.split("").map((ch, i) => <text key={i} x={960 - (n - 1) * 120 + i * 240} y={600} textAnchor="middle" fontFamily="Patrick Hand" fontSize={320} fill={sun ? "#FFB45E" : "#9FB6C6"} stroke="#6A3A22" strokeOpacity={0.6} strokeWidth={8} paintOrder="stroke" opacity={cl(shown - i)}>{ch}</text>)}
    {heart && <path transform={`translate(${960 - (n - 1) * 120 + text.length * 240},500) scale(2.4)`} d="M0,30 C-50,-10 -30,-50 0,-26 C30,-50 50,-10 0,30Z" fill={sun ? "#F2A85A" : "#BFD0DC"} stroke="#E0393E" strokeWidth={3} opacity={cl(shown - text.length)} />}
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${900 - (n - 1) * 120 + (i % 5) * 240},${640 + rnd(i) * 30} v${30 + md(t * 20 + i * 10, 60)}`} stroke="#FFFFFF" strokeWidth={4} opacity={0.3 * cl(shown - (i % 5))} />)}
    <rect x={290} y={110} width={1340} height={840} rx={14} fill="none" stroke={night ? "#3A2A20" : "#F2EDE4"} strokeWidth={30} />
    <rect x={250} y={940} width={1420} height={50} rx={8} fill={night ? "#2A1E16" : "#E6DED0"} />
    {k > 0 && k < 1 && <g transform={`translate(${960 - (n - 1) * 120 + Math.floor(shown) * 240 + 40},${560})`}><ellipse cx={10} cy={80} rx={34} ry={90} fill="#F1C9A5" /><ellipse cx={4} cy={4} rx={16} ry={20} fill="#E8B892" /></g>}
  </g>;
};

// ── kar üstü ayak izleri (küçük + büyük derin) ──
export const AyakIzi: React.FC<{ t: number; k?: number; big?: number; ball?: number }> = ({ t, k = 1, big = 1, ball = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E4ECF4" />
    {Array.from({ length: 30 }, (_, i) => <ellipse key={i} cx={rnd(i) * 1920} cy={rnd(i + 4) * 1080} rx={60 + rnd(i) * 120} ry={16} fill="#FFFFFF" opacity={0.6} />)}
    {Array.from({ length: 7 }, (_, i) => <g key={i} opacity={cl(k * 8 - i)} transform={`translate(${380 + i * 150},${720 + (i % 2) * 50})`}><ellipse rx={24} ry={40} fill="#A9B8C8" /><ellipse cy={-48} rx={16} ry={14} fill="#A9B8C8" /></g>)}
    {Array.from({ length: 6 }, (_, i) => <g key={i} opacity={big * cl(k * 8 - i - 1)} transform={`translate(${480 + i * 210},${540 + (i % 2) * 80})`}><ellipse rx={50} ry={86} fill="#7E8EA0" /><ellipse cy={-100} rx={34} ry={30} fill="#7E8EA0" /><ellipse rx={36} ry={66} fill="#5E6E80" /></g>)}
    {ball > 0 && <g transform="translate(300,760)"><ellipse rx={70} ry={20} fill="#C9D6E2" /><circle cy={-30} r={46 * ball} fill="#FFFFFF" /><circle cx={-10} cy={-40} r={14 * ball} fill="#E4ECF4" /></g>}
    <Kar_ t={t} />
  </g>
);
const Kar_: React.FC<{ t: number }> = ({ t }) => <g>{Array.from({ length: 50 }, (_, i) => <circle key={i} cx={md(rnd(i) * 1920 + t * 30, 1920)} cy={md(rnd(i + 5) * 1080 + t * (40 + rnd(i) * 30), 1080)} r={2 + rnd(i) * 4} fill="#FFFFFF" opacity={0.8} />)}</g>;

// ── fotoğraf: batıda bir ışık + gelinlik (+ arkada mavi tır) ──
export const Foto: React.FC<{ x: number; y: number; s?: number; tir?: number; rot?: number }> = ({ x, y, s = 1, tir = 1, rot = -4 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`}>
    <rect x={-260} y={-220} width={520} height={480} fill="#F4F0E6" />
    <rect x={-230} y={-190} width={460} height={360} fill="#1A2030" />
    {tir > 0 && <g opacity={tir}><rect x={-220} y={-40} width={240} height={170} fill="#2C5AA0" /><rect x={20} y={10} width={100} height={120} fill="#3A6EC0" /><circle cx={-160} cy={140} r={24} fill="#111" /><circle cx={60} cy={140} r={24} fill="#111" /></g>}
    <circle cx={140} cy={-110} r={34} fill="#FFF3C0" /><circle cx={140} cy={-110} r={100} fill="#FFF3C0" opacity={0.25} />
    <path d="M150,-40 Q120,40 90,170 L230,170 Q190,40 160,-40Z" fill="#FBF6EC" /><circle cx={155} cy={-56} r={16} fill="#FBF6EC" />
    <path d="M100,-20 q55,30 110,0" stroke="#E6DED0" strokeWidth={4} fill="none" />
  </g>
);

// ── göl kıyısında taş mezar. k: taşlar 0..1, carve: kazıma 0..1 ──
export const TasMezar: React.FC<{ t: number; k?: number; carve?: number; lines?: string[]; mode?: Mode; dog?: React.ReactNode }> = ({ t, k = 1, carve = 1, lines = ["BAYRAM", "03.14"], mode = "day", dog }) => {
  const stones = Array.from({ length: 26 }, (_, i) => { const row = i < 10 ? 0 : i < 18 ? 1 : i < 23 ? 2 : 3; const inRow = row === 0 ? i : row === 1 ? i - 10 : row === 2 ? i - 18 : i - 23; const w = [10, 8, 5, 3][row]; return { x: 960 + (inRow - (w - 1) / 2) * (110 - row * 6), y: 900 - row * 70, r: 52 - row * 4 + rnd(i) * 10, i }; });
  return <g>
    {stones.map((st) => <ellipse key={st.i} cx={st.x} cy={st.y} rx={st.r * 1.1} ry={st.r * 0.75} fill={["#7E8A96", "#6E7A86", "#8E9AA6"][st.i % 3]} stroke="#4A5460" strokeWidth={4} opacity={cl(k * 26 - st.i)} />)}
    <g opacity={cl(k * 26 - 26 + 1) > 0 ? 1 : cl(k * 26 - 25)} transform="translate(960,640)">
      <path d="M-220,0 L-200,-150 L200,-160 L220,0Z" fill="#9AA6B2" stroke="#4A5460" strokeWidth={6} />
      {lines.map((l, i) => { const vis = cl(carve * lines.length - i); return <text key={i} x={0} y={-90 + i * 66} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={i === 0 ? 58 : 48} fill="#3A4450" opacity={vis} clipPath={undefined}>{l.slice(0, Math.ceil(l.length * vis))}</text>; })}
    </g>
    {dog}
    {mode === "dusk" && <rect width={1920} height={1080} fill="#F28C28" opacity={0.08} />}
  </g>;
};
// kazınan taş yakın plan (çivi)
export const TasYakin: React.FC<{ t: number; lines: string[]; carve?: number; hl?: number }> = ({ t, lines, carve = 1, hl = -1 }) => {
  const total = lines.reduce((n, l) => n + l.length, 0);
  let used = 0;
  let tip: [number, number] | null = null;
  return <g>
    <rect width={1920} height={1080} fill="#6E7A86" />
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 3) * 1080} r={4 + rnd(i) * 10} fill="#5E6A76" opacity={0.6} />)}
    <rect x={220} y={180} width={1480} height={720} rx={40} fill="#9AA6B2" stroke="#4A5460" strokeWidth={10} />
    {lines.map((l, i) => {
      const n = Math.max(0, Math.min(l.length, Math.floor(carve * total - used)));
      const y = 330 + i * (560 / Math.max(1, lines.length));
      if (n > 0 && n < l.length) tip = [960 - l.length * 30 + n * 60, y - 20];
      used += l.length;
      return <text key={i} x={960} y={y} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={110} fill={i === hl ? "#E0393E" : "#3A4450"} letterSpacing={6}>{l.slice(0, n)}</text>;
    })}
    {tip && <g transform={`translate(${(tip as [number, number])[0]},${(tip as [number, number])[1]}) rotate(20)`}><rect x={-6} y={-200} width={12} height={200} fill="#B8BFC6" /><path d="M-6,0 L0,20 L6,0Z" fill="#B8BFC6" /><ellipse cx={0} cy={-200} rx={70} ry={40} fill="#E8B892" />{Array.from({ length: 5 }, (_, i) => <circle key={i} cx={Math.sin(t * 30 + i) * 20} cy={24 + i * 6} r={3} fill="#DCE4EC" />)}</g>}
  </g>;
};

// ── kapı sedye: yatay kapı + üstünde uzanan (body) ──
export const KapiSedye: React.FC<{ x: number; y: number; s?: number; body?: React.ReactNode; kispet?: boolean }> = ({ x, y, s = 1, body, kispet = true }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-330} y={-24} width={660} height={36} rx={6} fill="#8A5A36" /><rect x={-300} y={-20} width={260} height={28} fill="#9A6A42" /><rect x={40} y={-20} width={260} height={28} fill="#9A6A42" />
    <circle cx={300} cy={-8} r={8} fill="#D9B44A" />
    {body}
    {kispet && <g transform="translate(-20,-60) scale(0.25) rotate(90)"><Kispet x={0} y={0} /></g>}
  </g>
);

// ── kar yükü hesabı (gece modu bilgi kartı) ──
export const KarYuk: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const r = (d: number) => cl((t - a - d) / 0.3);
  return <g>
    <rect width={1920} height={1080} fill="#0A1222" />
    <path d="M300,700 L1620,700" stroke="#5E6670" strokeWidth={20} />
    <rect x={300} y={lerp(700, 460, r(0.3))} width={1320} height={lerp(0, 240, r(0.3))} fill="#F4F8FB" opacity={0.9} />
    <text x={1680} y={600} fontFamily="Poppins" fontWeight={800} fontSize={60} fill="#2EE6D0" opacity={r(0.6)}>1 m</text>
    <text x={960} y={820} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={80} fill="#F6C445" opacity={r(1.2)}>{"> 200 kg / m²"}</text>
    {[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${520 + i * 300},${400}) scale(0.8)`} opacity={r(2 + i * 0.3)}><rect x={-90} y={-70} width={130} height={70} fill="#E0393E" /><rect x={40} y={-50} width={60} height={50} fill="#C9302C" /><circle cx={-60} cy={4} r={16} fill="#EEE" /><circle cx={70} cy={4} r={16} fill="#EEE" /></g>)}
    <text x={960} y={960} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={56} fill="#E0393E" opacity={r(3.4)}>= BİRKAÇ KAMYON</text>
  </g>;
};
