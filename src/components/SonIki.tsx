import React from "react";
import { T, lerp } from "./Toon";
import { blinkAt } from "./Motion";

// Kanal 2 · k2r-15 "Dünyada Son İki İnsan" kiti (2026-11-16). Boş İstanbul: şehir panoraması (gündüz/gün batımı/gece,
// ışıklar, Samanyolu), Kız Kulesi + lodos, kayık, köpek (Karabaş, Kangal), kedi, zarf, radyo+akü, fener/Mors,
// Galata Köprüsü + oltalar, boş sokak + simit tezgâhı, sınıf (pencerede şehir), çatı deposu, kuyumcu, market,
// eczane, otel, stadyum, ahşap ev + soba, Taksim, kütüphane, HUD (GÜN · DÜNYA NÜFUSU).
// Hepsi 1920×1080 vektör, kanalın düz renk stiliyle. Zemin çizgisi ~1040.

const md = (v: number, m: number) => ((v % m) + m) % m;
const cl = (x: number) => Math.max(0, Math.min(1, x));

// ───────── şehir silueti (Haliç / Tarihî Yarımada) ─────────
const Cami: React.FC<{ x: number; y: number; s: number; c: string; minarets?: number }> = ({ x, y, s, c, minarets = 4 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} fill={c}>
    <rect x={-150} y={-110} width={300} height={110} />
    <path d="M-110,-110 A110,95 0 0 1 110,-110Z" /><path d="M-170,-60 A45,40 0 0 1 -80,-60Z M80,-60 A45,40 0 0 1 170,-60Z" />
    <rect x={-6} y={-225} width={12} height={20} /><circle cx={0} cy={-210} r={8} />
    {Array.from({ length: minarets }, (_, i) => { const mx = [-230, 230, -190, 190][i]; return <g key={i}><rect x={mx - 9} y={-330} width={18} height={330} /><path d={`M${mx - 12},-330 L${mx},-385 L${mx + 12},-330Z`} /><rect x={mx - 14} y={-250} width={28} height={8} /></g>; })}
  </g>
);
const GalataK: React.FC<{ x: number; y: number; s: number; c: string; lit?: number }> = ({ x, y, s, c, lit = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-45} y={-300} width={90} height={300} fill={c} /><rect x={-52} y={-320} width={104} height={24} fill={c} />
    <path d="M-50,-320 L0,-430 L50,-320Z" fill={c} />
    {[0, 1].map((r) => [-25, 0, 25].map((xx) => <rect key={`${r}${xx}`} x={xx - 6} y={-300 + r * 22} width={12} height={16} rx={6} fill={lit ? "#FFD98A" : "#000"} opacity={lit ? lit : 0.25} />))}
  </g>
);
type Mode = "day" | "dusk" | "night";
const SKY: Record<Mode, [string, string]> = { day: ["#9FD3EC", "#E3F3F8"], dusk: ["#3B3F7A", "#F7B06A"], night: ["#060C1C", "#16284A"] };
const SIL: Record<Mode, [string, string]> = { day: ["#9AB3C4", "#7E97AA"], dusk: ["#3A2E4E", "#2A2240"], night: ["#0E1830", "#0A1226"] };
export const Gok: React.FC<{ t: number; mode?: Mode; stars?: number; milky?: number; sun?: number }> = ({ t, mode = "day", stars = 0, milky = 0, sun = 0 }) => {
  const [a, b] = SKY[mode];
  return (
    <g>
      <defs><linearGradient id="siSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={a} /><stop offset="1" stopColor={b} /></linearGradient>
        <radialGradient id="siSun" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFF4C8" /><stop offset="0.4" stopColor="#FFC46A" stopOpacity="0.8" /><stop offset="1" stopColor="#FF9A4A" stopOpacity="0" /></radialGradient>
        <linearGradient id="siMilky" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#B9C8FF" stopOpacity="0" /><stop offset="0.5" stopColor="#D8D2FF" stopOpacity="0.55" /><stop offset="1" stopColor="#B9C8FF" stopOpacity="0" /></linearGradient></defs>
      <rect width={1920} height={1080} fill="url(#siSky)" />
      {mode === "dusk" && sun > 0 && <><circle cx={1320} cy={560} r={420} fill="url(#siSun)" opacity={sun} /><circle cx={1320} cy={560} r={70} fill="#FFE7A8" opacity={sun} /></>}
      {mode === "day" && [0, 1, 2].map((k) => <ellipse key={k} cx={md(300 + k * 700 + t * 10, 2300) - 200} cy={110 + k * 45} rx={140} ry={32} fill="#FFFFFF" opacity={0.75} />)}
      {milky > 0 && <g opacity={milky}><path d="M-100,60 Q900,260 2050,820 L2050,560 Q900,40 -100,-160Z" fill="url(#siMilky)" />
        {Array.from({ length: 160 }, (_, i) => { const u = (i * 0.61803) % 1, x = -100 + u * 2150, y = lerp(-50, 690, u) + Math.sin(i * 7.3) * 120; return <circle key={i} cx={x} cy={y} r={0.8 + (i % 5) * 0.5} fill="#FFFFFF" opacity={0.4 + 0.5 * Math.abs(Math.sin(t * 1.5 + i))} />; })}</g>}
      {stars > 0 && Array.from({ length: 90 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 97) % 640} r={1.2 + (i % 3)} fill="#FFFFFF" opacity={stars * (0.35 + 0.6 * Math.abs(Math.sin(t * 2 + i * 1.7)))} />)}
    </g>
  );
};
// tarihî yarımada + Galata panoraması, önde su
export const Sehir: React.FC<{ t: number; mode?: Mode; lights?: number; stars?: number; milky?: number; sun?: number; water?: boolean; px?: number; snow?: number; gulls?: boolean }> = ({ t, mode = "day", lights = 0, stars = 0, milky = 0, sun = 0, water = true, px = 0, snow = 0, gulls = true }) => {
  const [c1, c2] = SIL[mode];
  const win = mode === "day" ? "#5E7A8E" : "#FFD98A";
  return (
    <g>
      <Gok t={t} mode={mode} stars={stars} milky={milky} sun={sun} />
      <g transform={`translate(${-px * 0.3},0)`}>
        {Array.from({ length: 22 }, (_, i) => { const x = -100 + i * 100, h = 120 + ((i * 53) % 120); return <rect key={i} x={x} y={700 - h} width={96} height={h} fill={c1} />; })}
        <Cami x={520} y={700} s={0.9} c={c1} /><Cami x={1500} y={700} s={0.7} c={c1} minarets={2} />
        <GalataK x={1080} y={640} s={0.85} c={c1} lit={lights * 0.9} />
      </g>
      <g transform={`translate(${-px * 0.6},0)`}>
        {Array.from({ length: 18 }, (_, i) => { const x = -120 + i * 130, h = 90 + ((i * 71) % 140); return (
          <g key={i}><rect x={x} y={760 - h} width={124} height={h} fill={c2} />
            {snow > 0 && <rect x={x} y={760 - h - 8} width={124} height={10} rx={5} fill="#F4F8FF" opacity={snow} />}
            {Array.from({ length: 6 }, (_, w) => { const on = mode === "day" ? 0.35 : ((i * 7 + w * 3) % 10) / 10 < lights ? 0.95 : 0; return on ? <rect key={w} x={x + 14 + (w % 3) * 36} y={760 - h + 18 + Math.floor(w / 3) * 34} width={20} height={22} fill={win} opacity={on} /> : null; })}</g>); })}
      </g>
      {water && <g>
        <rect y={760} width={1920} height={320} fill={mode === "day" ? "#5FA7C8" : mode === "dusk" ? "#C9775E" : "#0C1A34"} />
        {Array.from({ length: 26 }, (_, i) => <rect key={i} x={md(i * 157 + t * (20 + (i % 3) * 8), 2100) - 100} y={790 + (i % 9) * 32} width={60 + (i % 4) * 30} height={4} rx={2} fill="#FFFFFF" opacity={0.25} />)}
        {mode === "dusk" && sun > 0 && <path d={`M1240,770 L1400,770 L1500,1080 L1140,1080Z`} fill="#FFD08A" opacity={0.35 * sun} />}
        {mode !== "day" && lights > 0 && Array.from({ length: 12 }, (_, i) => <rect key={i} x={80 + i * 150} y={790 + (i % 4) * 40} width={8} height={60} fill="#FFD98A" opacity={0.3 * lights} />)}
      </g>}
      {gulls && mode !== "night" && [0, 1, 2].map((i) => { const x = md(200 + i * 600 + t * 70, 2200) - 140, y = 260 + i * 60 + Math.sin(t * 2 + i) * 20, f = Math.sin(t * 9 + i) * 14; return <path key={i} d={`M${x - 30},${y + f} Q${x - 14},${y - 10} ${x},${y} Q${x + 14},${y - 10} ${x + 30},${y + f}`} stroke={mode === "dusk" ? "#2A2240" : "#3A3A3A"} strokeWidth={5} fill="none" strokeLinecap="round" />; })}
    </g>
  );
};

// ───────── Kız Kulesi ─────────
export const KizKulesi: React.FC<{ x: number; y: number; s?: number; c?: string; lit?: number; night?: number }> = ({ x, y, s = 1, c, lit = 0, night = 0 }) => {
  const wall = c ?? (night ? "#3A4660" : "#EDE3D0"), roof = night ? "#26304A" : "#7A8A9A", stone = night ? "#2A3348" : "#B9AD96";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-260,0 Q-240,-60 -160,-70 L170,-70 Q250,-60 270,0Z" fill={stone} />
      <rect x={-200} y={-170} width={400} height={100} fill={wall} />
      {[-150, -90, -30, 30, 90, 150].map((xx) => <rect key={xx} x={xx - 12} y={-150} width={24} height={40} rx={12} fill={night ? "#1A2236" : "#8FB6CC"} />)}
      <rect x={-60} y={-420} width={120} height={250} fill={wall} />
      <rect x={-72} y={-440} width={144} height={26} fill={wall} />
      {[-30, 30].map((xx) => <rect key={xx} x={xx - 12} y={-400} width={24} height={46} rx={12} fill={lit ? "#FFE7A0" : night ? "#1A2236" : "#8FB6CC"} />)}
      <rect x={-40} y={-470} width={80} height={30} fill={wall} />
      <path d="M-46,-470 L0,-600 L46,-470Z" fill={roof} /><rect x={-3} y={-640} width={6} height={42} fill={roof} />
      <circle cx={0} cy={-648} r={7} fill={night ? "#8A93A8" : "#C9A84A"} />
      {lit > 0 && <><circle cx={0} cy={-380} r={110} fill="url(#siGlow)" opacity={lit} /><circle cx={0} cy={-380} r={16} fill="#FFF6D0" opacity={lit} /></>}
      <defs><radialGradient id="siGlow" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFF2B8" stopOpacity="0.95" /><stop offset="1" stopColor="#FFF2B8" stopOpacity="0" /></radialGradient></defs>
    </g>
  );
};
// deniz: lodos = 0 (sakin) … 1 (fırtına)
export const Deniz: React.FC<{ t: number; y?: number; lodos?: number; c?: string; night?: number }> = ({ t, y = 760, lodos = 0, c, night = 0 }) => {
  const base = c ?? (night ? "#0C1A34" : lodos > 0.5 ? "#3E5A6E" : "#4F9CC0");
  const amp = 8 + lodos * 46, lam = 220 - lodos * 60;
  const wave = (yy: number, ph: number, k: number) => { let d = `M-40,1100 L-40,${yy}`; for (let x = -40; x <= 1960; x += 40) d += ` L${x},${yy + Math.sin((x / lam) * Math.PI * 2 + t * (1.4 + lodos * 2.4) + ph) * amp * k}`; return d + " L1960,1100Z"; };
  return (
    <g>
      <rect y={y} width={1920} height={1080 - y} fill={base} />
      {[0, 1, 2].map((i) => <path key={i} d={wave(y + i * 90, i * 1.7, 1 - i * 0.2)} fill={base} opacity={1} stroke={night ? "#2A4468" : "#BFE3F2"} strokeOpacity={0.35 + lodos * 0.4} strokeWidth={4} />)}
      {lodos > 0.3 && Array.from({ length: 30 }, (_, i) => { const x = md(i * 131 + t * 160, 2000) - 40, yy = y + 20 + (i % 7) * 44 + Math.sin(t * 3 + i) * amp * 0.5; return <path key={i} d={`M${x},${yy} q18,-14 36,0 q-18,-6 -36,0`} fill="#FFFFFF" opacity={0.7 * lodos} />; })}
    </g>
  );
};
export const Yagmur2: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => <g opacity={k}>{Array.from({ length: 90 }, (_, i) => { const x = md(i * 97 - t * 900, 2200) - 100, y = md(i * 151 + t * 1700, 1200) - 60; return <path key={i} d={`M${x},${y} l-26,60`} stroke="#DDEBF5" strokeWidth={3} opacity={0.55} />; })}</g>;
export const KuleSahne: React.FC<{ t: number; night?: number; dusk?: number; lit?: number; lodos?: number; near?: number; boat?: React.ReactNode; rain?: number }> = ({ t, night = 0, dusk = 0, lit = 0, lodos = 0, near = 0, boat, rain = 0 }) => {
  const mode: Mode = night ? "night" : dusk ? "dusk" : "day";
  return (
    <g>
      <Gok t={t} mode={mode} stars={night ? 0.7 * (1 - lodos) : 0} sun={dusk} />
      {lodos > 0.4 && <rect width={1920} height={760} fill="#34404E" opacity={0.6 * lodos} />}
      {/* Üsküdar sahili */}
      {Array.from({ length: 20 }, (_, i) => <rect key={i} x={-60 + i * 104} y={640 - ((i * 37) % 70)} width={100} height={130 + ((i * 37) % 70)} fill={night ? "#101A30" : dusk ? "#4A3A5A" : "#A9B8C4"} />)}
      <Cami x={300} y={770} s={0.45} c={night ? "#0D1528" : dusk ? "#3A2E4E" : "#94A6B4"} minarets={2} />
      <Deniz t={t} y={770} lodos={lodos} night={night} />
      <KizKulesi x={lerp(1180, 960, near)} y={lerp(830, 980, near)} s={lerp(0.55, 1.3, near)} lit={lit} night={night} />
      {boat}
      {rain > 0 && <Yagmur2 t={t} k={rain} />}
    </g>
  );
};
// kulenin içi: taş oda, pencerede fırtına
export const KuleIci: React.FC<{ t: number; storm?: number; dawn?: number }> = ({ t, storm = 1, dawn = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={dawn ? "#8A7E70" : "#3A3E48"} />
    <rect width={1920} height={1080} fill="url(#tStone)" opacity={0.9} />
    <g transform="translate(1300,160)">
      <path d="M0,360 V120 A130,120 0 0 1 260,120 V360Z" fill={dawn ? "#C9D6DE" : "#26303E"} />
      <g clipPath="url(#siWin)"><rect x={0} y={0} width={260} height={360} fill={dawn ? "#AFC6D4" : "#2E3A4C"} />
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M-20,${200 + i * 30 + Math.sin(t * 3 + i) * 18 * storm} q70,-30 140,0 t140,0`} stroke="#DDEBF5" strokeWidth={5} fill="none" opacity={0.5} />)}
        {storm > 0 && <Yagmur2 t={t} k={storm * 0.8} />}</g>
      <clipPath id="siWin"><path d="M0,360 V120 A130,120 0 0 1 260,120 V360Z" /></clipPath>
      <path d="M0,360 V120 A130,120 0 0 1 260,120 V360Z" fill="none" stroke="#1E222A" strokeWidth={18} />
      <path d="M130,0 V360 M0,220 H260" stroke="#1E222A" strokeWidth={8} />
    </g>
    <rect y={860} width={1920} height={220} fill="#4A4540" /><rect y={860} width={1920} height={220} fill="url(#tStone)" />
    <rect x={300} y={830} width={760} height={70} rx={20} fill="#8A5A44" /><rect x={300} y={810} width={760} height={50} rx={18} fill="#C96A4A" />
    <rect x={380} y={790} width={140} height={46} rx={20} fill="#E9DCC6" />
    <g transform="translate(1180,860)"><rect x={-18} y={-80} width={36} height={80} rx={6} fill="#C9C2B4" /><rect x={-24} y={-96} width={48} height={18} rx={4} fill="#555" /><circle cy={-50} r={10} fill="#FFFFFF" opacity={0.2} /></g>
  </g>
);

// ───────── kayık ─────────
export const Kayik: React.FC<{ x: number; y: number; s?: number; t: number; row?: number; tilt?: number; water?: number; rower?: React.ReactNode; dog?: React.ReactNode; dir?: 1 | -1 }> = ({ x, y, s = 1, t, row = 0, tilt = 0, water = 0, rower, dog, dir = 1 }) => {
  const ph = Math.sin(row * Math.PI * 2);
  return (
    <g transform={`translate(${x},${y}) rotate(${tilt}) scale(${s * dir},${s})`}>
      {dog && <g transform="translate(150,-40)">{dog}</g>}
      {rower && <g transform="translate(-20,0)">{rower}</g>}
      <path d={`M-40,-120 L${-260 - ph * 60},${40 + ph * 20}`} stroke="#8A5A32" strokeWidth={12} strokeLinecap="round" />
      <ellipse cx={-260 - ph * 60} cy={46 + ph * 20} rx={34} ry={12} fill="#8A5A32" />
      <path d="M-300,-60 L300,-60 Q280,40 200,60 L-220,60 Q-290,30 -300,-60Z" fill="#C9473E" />
      <path d="M-300,-60 L300,-60 L294,-34 L-296,-34Z" fill="#F4E9D6" />
      <path d="M-230,0 H230" stroke="#8E2E28" strokeWidth={6} />
      {water > 0 && <path d="M-250,-40 Q0,-20 250,-40 L250,-34 L-250,-34Z" fill="#6FB4D6" opacity={water} transform={`translate(0,${(1 - water) * 30})`} />}
      <text x={0} y={30} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#F4E9D6" transform={dir === -1 ? "scale(-1,1)" : undefined}>HALİÇ 7</text>
    </g>
  );
};

// ───────── hayvanlar ─────────
export const Kopek: React.FC<{ x: number; y: number; s?: number; t: number; kind?: "kara" | "kangal" | "sokak"; dir?: 1 | -1; run?: number; bark?: number; sit?: number; wag?: number; sleep?: number; bite?: React.ReactNode; seed?: number }> = ({ x, y, s = 1, t, kind = "kara", dir = 1, run = 0, bark = 0, sit = 0, wag = 1, sleep = 0, bite, seed = 0 }) => {
  const body = kind === "kara" ? "#1E1E22" : kind === "kangal" ? "#D9C29A" : "#A8845C", dark = kind === "kangal" ? "#2A2420" : kind === "kara" ? "#0E0E10" : "#7A5A3A";
  const ph = t * 14 + seed, lg = run ? Math.sin(ph) * 28 : 0, bob = run ? Math.abs(Math.sin(ph)) * -10 : Math.sin(t * 2 + seed) * 2;
  const tail = Math.sin(t * (wag ? 16 : 2) + seed) * (wag ? 22 : 4);
  const blink = blinkAt(t, seed + 3) ? 0.12 : 1;
  const open = bark > 0 && Math.sin(t * 18) > 0;
  if (sleep) return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
      <ellipse cx={0} cy={-34} rx={120} ry={40} fill={body} /><ellipse cx={100} cy={-30} rx={44} ry={32} fill={body} />
      <path d="M86,-56 l-10,-26 l26,16Z" fill={dark} /><path d="M108,-30 h22" stroke="#FFFFFF" strokeWidth={3} />
      <path d="M-120,-30 q-30,10 -10,30" stroke={body} strokeWidth={14} fill="none" strokeLinecap="round" />
      {[0, 1, 2].map((i) => <text key={i} x={130 + i * 26} y={-90 - i * 30 - md(t * 20, 30)} fontFamily="Poppins" fontWeight={800} fontSize={26 + i * 6} fill="#FFFFFF" opacity={0.7}>z</text>)}
    </g>
  );
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
      <ellipse cx={0} cy={4} rx={110} ry={14} fill="#000" opacity={0.18} />
      <g transform={`translate(0,${bob})`}>
        {sit ? <><path d="M-60,-10 Q-80,-120 0,-140 L40,-140 L40,-10Z" fill={body} /><rect x={20} y={-80} width={20} height={80} rx={9} fill={body} /><rect x={50} y={-80} width={20} height={80} rx={9} fill={body} /></>
          : <>
            {[[-70, -1], [-40, 1], [50, 1], [80, -1]].map(([lx, sg], i) => <rect key={i} x={lx} y={-70} width={20} height={70} rx={9} fill={i % 2 ? body : dark} transform={`rotate(${lg * sg} ${lx + 10} -70)`} />)}
            <ellipse cx={0} cy={-90} rx={110} ry={44} fill={body} />
          </>}
        <path d={`M${sit ? -60 : -104},-100 q-40,${-20 + tail} -50,${-50 + tail}`} stroke={body} strokeWidth={16} fill="none" strokeLinecap="round" />
        <g transform={`translate(${sit ? 40 : 100},${sit ? -170 : -130})`}>
          <ellipse cx={0} cy={0} rx={52} ry={44} fill={body} />
          <ellipse cx={44} cy={14} rx={34} ry={22} fill={kind === "kangal" ? dark : body} />
          <circle cx={74} cy={8} r={9} fill="#111" />
          <path d={open ? "M42,30 Q60,58 80,34Z" : "M44,32 Q60,40 76,30"} fill={open ? "#B23A3F" : "none"} stroke="#111" strokeWidth={4} />
          <ellipse cx={14} cy={-10} rx={11} ry={11 * blink} fill="#FFFFFF" /><circle cx={18} cy={-10} r={5 * blink} fill="#111" />
          <path d="M-24,-30 Q-50,-10 -40,36 Q-14,10 -14,-24Z" fill={dark} />
          {kind === "kara" && <path d="M-40,20 l8,-8 l4,10Z" fill={T.sky2} />}
          {bite && <g transform="translate(70,30)">{bite}</g>}
        </g>
      </g>
      {bark > 0 && open && <g transform="translate(220,-200)"><path d="M0,0 l40,-20 M0,20 l50,0 M0,40 l40,20" stroke="#FFFFFF" strokeWidth={6} strokeLinecap="round" /></g>}
    </g>
  );
};
export const Kedi: React.FC<{ x: number; y: number; s?: number; t: number; c?: string; dir?: 1 | -1; walk?: number; look?: number; seed?: number }> = ({ x, y, s = 1, t, c = "#E89A3A", dir = 1, walk = 0, look = 0, seed = 0 }) => {
  const tail = Math.sin(t * 2.4 + seed) * 18, ph = t * 10 + seed, blink = blinkAt(t, seed + 9) ? 0.12 : 1;
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
      <ellipse cx={0} cy={4} rx={60} ry={9} fill="#000" opacity={0.18} />
      {walk ? <>{[-36, -16, 20, 40].map((lx, i) => <rect key={i} x={lx} y={-44} width={12} height={44} rx={6} fill={c} transform={`rotate(${Math.sin(ph + i * 1.6) * 24} ${lx + 6} -44)`} />)}<ellipse cx={0} cy={-56} rx={60} ry={26} fill={c} /></>
        : <path d="M-46,0 Q-60,-70 -10,-90 L26,-90 Q50,-50 40,0Z" fill={c} />}
      <path d={`M${walk ? -56 : -40},${walk ? -60 : -10} q-46,${-30 + tail} -30,${-80 + tail}`} stroke={c} strokeWidth={10} fill="none" strokeLinecap="round" />
      <g transform={`translate(${walk ? 58 : 14},${walk ? -84 : -112})`}>
        <circle r={32} fill={c} /><path d="M-26,-18 L-20,-48 L-4,-28Z M26,-18 L20,-48 L4,-28Z" fill={c} />
        <ellipse cx={-11 + look * 6} cy={-4} rx={7} ry={9 * blink} fill="#FFFFFF" /><ellipse cx={13 + look * 6} cy={-4} rx={7} ry={9 * blink} fill="#FFFFFF" />
        <circle cx={-9 + look * 8} cy={-3} r={4 * blink} fill="#111" /><circle cx={15 + look * 8} cy={-3} r={4 * blink} fill="#111" />
        <path d="M0,8 l-4,-4 h8Z" fill="#E86A92" /><path d="M-30,10 h-20 M-30,16 h-18 M30,10 h20 M30,16 h18" stroke="#FFFFFF" strokeWidth={2} opacity={0.7} />
      </g>
    </g>
  );
};
export const Yunus: React.FC<{ x: number; y: number; s?: number; k: number }> = ({ x, y, s = 1, k }) => {
  if (k <= 0 || k >= 1) return null;
  const a = lerp(-50, 230, k) * (Math.PI / 180), px = Math.cos(a) * 260, py = -Math.sin(Math.min(Math.PI, lerp(0, Math.PI, k))) * 220;
  return (
    <g transform={`translate(${x + lerp(-240, 240, k)},${y + py}) rotate(${lerp(-40, 50, k)}) scale(${s})`}>
      <path d="M-120,0 Q-40,-60 90,-20 Q130,-6 140,10 Q90,20 -60,30 Q-110,30 -120,0Z" fill="#7C93A8" /><path d="M-10,-40 L20,-80 L30,-30Z" fill="#7C93A8" />
      <path d="M-120,0 L-170,-30 L-160,10 L-170,40Z" fill="#7C93A8" /><path d="M-60,22 Q30,30 120,12" stroke="#D6E2EA" strokeWidth={10} fill="none" />
      <circle cx={90} cy={-10} r={6} fill="#111" />
      {px && null}
    </g>
  );
};
export const Sicrama: React.FC<{ x: number; y: number; t: number; at: number }> = ({ x, y, t, at }) => { const k = cl((t - at) / 0.8); if (k <= 0 || k >= 1) return null; return <g opacity={1 - k}>{Array.from({ length: 10 }, (_, i) => { const a = (i / 10) * Math.PI; return <circle key={i} cx={x + Math.cos(a) * 80 * k * 2} cy={y - Math.sin(a) * 120 * k * (1.2 - k)} r={10 - k * 6} fill="#FFFFFF" />; })}</g>; };

// ───────── küçük nesneler ─────────
export const Zarf: React.FC<{ x: number; y: number; s?: number; open?: number; text?: string; rot?: number }> = ({ x, y, s = 1, open = 0, text = "Denemeden sonra aç.", rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-260} y={-160} width={520} height={320} rx={14} fill="#F4E6C8" stroke="#C9B48C" strokeWidth={6} />
    <path d="M-260,160 L0,0 L260,160" fill="none" stroke="#D9C49C" strokeWidth={6} />
    <path d={`M-260,-160 L0,${lerp(40, -330, open)} L260,-160Z`} fill="#EAD8B2" stroke="#C9B48C" strokeWidth={6} />
    {open < 0.3 && <text x={0} y={100} textAnchor="middle" fontFamily="Patrick Hand" fontSize={52} fill="#5A3E8A">{text}</text>}
    {open < 0.3 && <path d="M150,60 q10,-24 24,0 q14,-24 24,0 q0,20 -24,40 q-24,-20 -24,-40Z" fill="#E0566A" opacity={0.85} transform="translate(-30,-20) scale(0.8)" />}
  </g>
);
export const Mektup2: React.FC<{ x: number; y: number; s?: number; k?: number; lines: string[]; sign?: string }> = ({ x, y, s = 1, k = 1, lines, sign }) => {
  const cols = ["#3A7BD5", "#E0566A", "#3FAE6A", "#7E5BD6", "#F28C28"];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-520} y={-330} width={1040} height={660} rx={10} fill="#FFFDF6" stroke="#E2D6BE" strokeWidth={6} transform={`rotate(-1.5)`} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M-470,${-230 + i * 62} H470`} stroke="#BFD7EA" strokeWidth={2} />)}
      {lines.map((l, i) => { const vis = cl(k * lines.length - i); return <text key={i} x={-460} y={-244 + i * 62} fontFamily="Patrick Hand" fontSize={48} fill={cols[i % cols.length]} opacity={vis}>{l.slice(0, Math.ceil(l.length * vis))}</text>; })}
      {sign && k > 0.95 && <text x={440} y={250} textAnchor="end" fontFamily="Patrick Hand" fontSize={60} fill="#E0566A">{sign}</text>}
    </g>
  );
};
export const Kagit: React.FC<{ x: number; y: number; s?: number; lines: string[]; rot?: number; c?: string }> = ({ x, y, s = 1, lines, rot = -2, c = "#2A2A2A" }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-300} y={-200} width={600} height={400} fill="#FFF8D8" /><rect x={-300} y={-200} width={600} height={40} fill="#F6E58A" opacity={0.6} />
    {lines.map((l, i) => <text key={i} x={-270} y={-110 + i * 64} fontFamily="Patrick Hand" fontSize={46} fill={c}>{l}</text>)}
  </g>
);
export const Radyo: React.FC<{ x: number; y: number; s?: number; t: number; on?: number; voice?: number }> = ({ x, y, s = 1, t, on = 0, voice = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={120} y={-150} width={260} height={150} rx={12} fill="#2A2E36" /><rect x={140} y={-130} width={220} height={36} rx={6} fill="#3A3E48" />
    <text x={250} y={-104} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={26} fill="#F6C445">AKÜ 12V</text>
    <rect x={160} y={-176} width={40} height={26} rx={4} fill="#B23A3F" /><rect x={300} y={-176} width={40} height={26} rx={4} fill="#333" />
    <path d="M180,-176 Q140,-260 40,-200 M320,-176 Q300,-280 60,-180" stroke="#B23A3F" strokeWidth={6} fill="none" /><path d="M320,-176 Q300,-280 60,-180" stroke="#222" strokeWidth={6} fill="none" />
    <rect x={-300} y={-260} width={360} height={260} rx={30} fill="#C9473E" />
    <rect x={-270} y={-230} width={160} height={200} rx={20} fill="#3A2A2A" />
    {Array.from({ length: 5 }, (_, i) => <rect key={i} x={-256} y={-214 + i * 36} width={132} height={10} rx={5} fill="#5A4040" />)}
    <rect x={-90} y={-230} width={130} height={60} rx={10} fill={on ? "#FFE7A0" : "#7A6A50"} />
    <rect x={-80 + md(t * 8, 1) * 0 + 50 * Math.sin(t * 0.3) + 50} y={-226} width={4} height={52} fill="#B23A3F" />
    <circle cx={-60} cy={-110} r={26} fill="#E9DCC6" /><circle cx={10} cy={-110} r={26} fill="#E9DCC6" />
    <path d="M-150,-260 L-260,-390" stroke="#AAB" strokeWidth={6} strokeLinecap="round" />
    {on > 0 && (voice > 0 ? <g transform="translate(-100,-420)">{Array.from({ length: 16 }, (_, i) => { const h = 20 + Math.abs(Math.sin(t * 12 + i * 0.9)) * 70 * voice; return <rect key={i} x={i * 22} y={-h / 2} width={12} height={h} rx={6} fill="#2EE6D0" />; })}</g>
      : <g transform="translate(-120,-400)" opacity={0.7}>{Array.from({ length: 24 }, (_, i) => <circle key={i} cx={(i * 37) % 300} cy={((i * 53 + Math.floor(t * 20) * 17) % 80) - 40} r={4} fill="#FFFFFF" />)}</g>)}
  </g>
);
export const FenerIsik: React.FC<{ x: number; y: number; s?: number; on?: number; ang?: number; len?: number }> = ({ x, y, s = 1, on = 1, ang = -10, len = 900 }) => (
  <g transform={`translate(${x},${y}) rotate(${ang}) scale(${s})`}>
    {on > 0 && <path d={`M40,-20 L${len},-160 L${len},160 L40,20Z`} fill="url(#tBeam)" opacity={on} />}
    <rect x={-80} y={-22} width={120} height={44} rx={10} fill="#2A2E36" /><rect x={30} y={-30} width={20} height={60} rx={6} fill="#4A4E56" />
    <circle cx={46} cy={0} r={on ? 18 : 10} fill={on ? "#FFF6D0" : "#666"} />
  </g>
);
// uzakta yanıp sönen ışık (Mors): pattern "." kısa ".-" vs. ; at = başlama zamanı
export const morsOn = (t: number, at: number, pattern: string, unit = 0.22) => {
  let cur = at;
  for (const ch of pattern) {
    const d = ch === "." ? unit : ch === "-" ? unit * 3 : unit * 2;
    if (ch !== " " && t >= cur && t < cur + d) return 1;
    cur += d + unit;
  }
  return 0;
};
export const MorsKagit: React.FC<{ x: number; y: number; s?: number; k: number; rows: [string, string][] }> = ({ x, y, s = 1, k, rows }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-420} y={-280} width={840} height={560} fill="#FFFBEA" transform="rotate(1.5)" />
    {rows.map(([code, ch], i) => { const vis = cl(k * rows.length - i); return <g key={i} opacity={vis}><text x={-360} y={-180 + i * 76} fontFamily="Poppins" fontWeight={800} fontSize={54} fill="#2A2A2A">{code.replace(/\./g, "•").replace(/-/g, "—")}</text><text x={260} y={-180 + i * 76} fontFamily="Patrick Hand" fontSize={66} fill="#E0566A">{ch}</text></g>; })}
  </g>
);
export const Telefon: React.FC<{ s?: number; msgs: { who: string; text: string; me?: boolean }[]; time?: string; calls?: number }> = ({ s = 1, msgs, time = "07:30", calls = 0 }) => (
  <g transform={`scale(${s})`}>
    <rect x={-130} y={-250} width={260} height={500} rx={36} fill="#1E1E22" /><rect x={-116} y={-226} width={232} height={452} rx={24} fill="#ECE5DD" />
    <rect x={-116} y={-226} width={232} height={58} rx={24} fill="#128C7E" /><text x={-96} y={-188} fontFamily="Poppins" fontWeight={700} fontSize={20} fill="#FFFFFF">12-B SINIF 📚</text>
    <text x={96} y={-188} textAnchor="end" fontFamily="Poppins" fontSize={16} fill="#E0F2EF">{time}</text>
    {msgs.map((m, i) => <g key={i} transform={`translate(${m.me ? 10 : -104},${-150 + i * 76})`}><rect width={190} height={62} rx={12} fill={m.me ? "#DCF8C6" : "#FFFFFF"} /><text x={10} y={22} fontFamily="Poppins" fontWeight={700} fontSize={14} fill="#128C7E">{m.who}</text><text x={10} y={46} fontFamily="Poppins" fontSize={18} fill="#222">{m.text}</text></g>)}
    {calls > 0 && <g><rect x={-116} y={-226} width={232} height={452} rx={24} fill="#1E2A3A" opacity={0.95} /><text x={0} y={-90} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={30} fill="#FFFFFF">ANNEM ❤</text><text x={0} y={-40} textAnchor="middle" fontFamily="Poppins" fontSize={22} fill="#AFC">aranıyor…</text><text x={0} y={80} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={64} fill="#F6C445">{calls}</text><text x={0} y={120} textAnchor="middle" fontFamily="Poppins" fontSize={20} fill="#FFFFFF">CEVAPSIZ ARAMA</text></g>}
  </g>
);
export const Konserve: React.FC<{ x: number; y: number; s?: number; label?: string; c?: string; open?: number }> = ({ x, y, s = 1, label = "NOHUT", c = "#E0393E", open = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-60} y={-150} width={120} height={150} rx={10} fill="#C9CED4" /><rect x={-60} y={-120} width={120} height={90} fill={c} />
    <text x={0} y={-66} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={24} fill="#FFFFFF">{label}</text>
    <ellipse cx={0} cy={-150} rx={60} ry={14} fill="#AEB4BA" />
    {open > 0 && <ellipse cx={0} cy={-150 - open * 60} rx={56} ry={12} fill="#DDE2E6" transform={`rotate(${open * -40} 50 -150)`} />}
  </g>
);
export const Bidon: React.FC<{ x: number; y: number; s?: number; full?: number }> = ({ x, y, s = 1, full = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-60} y={-160} width={120} height={160} rx={16} fill="#3A7BD5" opacity={0.9} /><rect x={-50} y={-150 + (1 - full) * 140} width={100} height={140 * full} rx={10} fill="#9FD3EC" opacity={0.6} />
    <path d="M-30,-160 q30,-40 60,0" stroke="#2A5DA8" strokeWidth={12} fill="none" /><rect x={20} y={-186} width={24} height={26} rx={4} fill="#F4F4F4" />
    <text x={0} y={-56} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#FFFFFF">20 L</text>
  </g>
);
export const Dondurma: React.FC<{ x: number; y: number; s?: number; n?: number }> = ({ x, y, s = 1, n = 3 }) => {
  const cols = ["#F7E3B0", "#8A5A32", "#E86A92", "#9FD3A0", "#F7E3B0", "#D94A4A", "#F2C14E"];
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <path d="M-50,-20 L0,140 L50,-20Z" fill="#D9A866" /><path d="M-40,0 L30,100 M-20,-10 L40,60 M40,0 L-20,90" stroke="#B07A4A" strokeWidth={4} />
      {Array.from({ length: n }, (_, i) => <circle key={i} cx={Math.sin(i * 2.1) * 10} cy={-40 - i * 58} r={48} fill={cols[i % cols.length]} />)}
    </g>
  );
};
export const Poset: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <path d="M-90,-150 L90,-150 L110,0 L-110,0Z" fill="#F4F4F2" stroke="#C9CED4" strokeWidth={4} /><path d="M-40,-150 q40,-60 80,0" stroke="#C9CED4" strokeWidth={10} fill="none" />
    <path d="M-16,-110 h32 v28 h28 v32 h-28 v28 h-32 v-28 h-28 v-32 h28Z" fill="#E0393E" />
    <rect x={-70} y={-30} width={46} height={22} rx={4} fill="#3A7BD5" /><rect x={20} y={-34} width={30} height={26} rx={4} fill="#F6C445" />
  </g>
);
export const Bilezikler: React.FC<{ x: number; y: number; s?: number; n?: number; t?: number }> = ({ x, y, s = 1, n = 20, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-700} y={-70} width={1400} height={140} rx={70} fill="#141414" />
    {Array.from({ length: n }, (_, i) => <g key={i}><ellipse cx={-560 + i * (1120 / Math.max(1, n - 1))} cy={0} rx={22} ry={86} fill="none" stroke="#F2C14E" strokeWidth={18} /><ellipse cx={-560 + i * (1120 / Math.max(1, n - 1)) - 6} cy={-30} rx={4} ry={18} fill="#FFF6C8" opacity={0.5 + 0.5 * Math.sin(t * 4 + i)} /></g>)}
  </g>
);
export const Istavrit: React.FC<{ x: number; y: number; s?: number; t: number; rot?: number }> = ({ x, y, s = 1, t, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot + Math.sin(t * 16) * 8}) scale(${s})`}>
    <path d="M-60,0 Q0,-30 50,0 Q0,30 -60,0Z" fill="#9FB4C4" /><path d="M-60,0 L-90,-20 L-84,0 L-90,20Z" fill="#7A92A6" /><path d="M-50,4 Q0,14 44,2" stroke="#E0E8EE" strokeWidth={4} fill="none" />
    <circle cx={32} cy={-4} r={5} fill="#111" />
  </g>
);
export const Motor: React.FC<{ x: number; y: number; s?: number; t: number; tilt?: number; dir?: 1 | -1; rider?: React.ReactNode }> = ({ x, y, s = 1, t, tilt = 0, dir = 1, rider }) => (
  <g transform={`translate(${x},${y}) rotate(${tilt}) scale(${s * dir},${s})`}>
    {rider && <g transform="translate(-10,-100)">{rider}</g>}
    {[-150, 150].map((xx) => <g key={xx} transform={`translate(${xx},-60) rotate(${t * 700})`}><circle r={60} fill="#1E1E1E" /><circle r={36} fill="none" stroke="#9A9A9A" strokeWidth={6} /><path d="M-36,0 H36 M0,-36 V36" stroke="#777" strokeWidth={4} /></g>)}
    <path d="M-150,-60 L-40,-150 L100,-150 L150,-60" stroke="#E0393E" strokeWidth={18} fill="none" strokeLinejoin="round" />
    <path d="M-60,-160 Q20,-210 110,-160 L90,-130 L-40,-130Z" fill="#E0393E" /><path d="M110,-160 L150,-230 M130,-230 h50" stroke="#333" strokeWidth={10} strokeLinecap="round" />
    <circle cx={160} cy={-180} r={14} fill="#FFF3B0" />
  </g>
);
export const Soba: React.FC<{ x: number; y: number; s?: number; t: number; fire?: number }> = ({ x, y, s = 1, t, fire = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {fire > 0 && <ellipse cx={0} cy={-120} rx={360} ry={260} fill="url(#siFire)" opacity={fire * 0.8} />}
    <defs><radialGradient id="siFire" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFB45A" stopOpacity="0.6" /><stop offset="1" stopColor="#FFB45A" stopOpacity="0" /></radialGradient></defs>
    <rect x={-20} y={-760} width={40} height={520} fill="#3A3A3A" /><rect x={-20} y={-760} width={200} height={40} fill="#3A3A3A" />
    <rect x={-110} y={-250} width={220} height={230} rx={20} fill="#2A2A2A" /><rect x={-120} y={-260} width={240} height={26} rx={8} fill="#4A4A4A" />
    <rect x={-70} y={-180} width={140} height={100} rx={10} fill="#1A1A1A" />
    {fire > 0 && <g clipPath="url(#siSobaWin)">{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-60 + i * 24},-80 q${8 + Math.sin(t * 9 + i) * 8},-50 0,${-60 - Math.abs(Math.sin(t * 7 + i)) * 30} q-14,40 0,60Z`} fill={i % 2 ? "#FFB43A" : "#FF6A2A"} opacity={fire} />)}</g>}
    <clipPath id="siSobaWin"><rect x={-70} y={-180} width={140} height={100} rx={10} /></clipPath>
    {[-90, 90].map((xx) => <rect key={xx} x={xx - 8} y={-20} width={16} height={20} fill="#2A2A2A" />)}
    <g transform="translate(40,-280)"><path d="M-40,0 h80 l-10,-60 h-60Z" fill="#B07A4A" /><path d="M0,-70 q10,-30 0,-60 q-10,-30 0,-60" stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={0.35 + 0.2 * Math.sin(t * 3)} /></g>
  </g>
);
export const OdunYigin: React.FC<{ x: number; y: number; s?: number; n?: number }> = ({ x, y, s = 1, n = 9 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>{Array.from({ length: n }, (_, i) => { const r = Math.floor(i / 4), c = i % 4; return <g key={i}><rect x={-180 + c * 90 + r * 45} y={-50 - r * 50} width={90} height={48} rx={22} fill="#8A5A32" /><ellipse cx={-180 + c * 90 + r * 45 + 84} cy={-26 - r * 50} rx={14} ry={22} fill="#D9A866" /></g>; })}</g>
);

// ───────── mekânlar ─────────
// boş Beyoğlu sokağı: simit tezgâhı, ortada kapısı açık araba, kediler
export const BosSokak: React.FC<{ t: number; px?: number; simit?: number; car?: number; dusk?: number }> = ({ t, px = 0, simit = 1, car = 1, dusk = 0 }) => {
  const cols = ["#E9B872", "#D98C7A", "#9FC4C8", "#E3D2B4", "#C9A5C9", "#F0C987", "#B7CFA7"];
  return (
    <g>
      <rect width={1920} height={1080} fill={dusk ? "url(#tSkyDusk)" : "url(#tSkyDay)"} />
      <g transform={`translate(${-px},0)`}>
        {Array.from({ length: 9 }, (_, i) => { const x = -200 + i * 300, h = 600 + ((i * 89) % 160), c = cols[i % cols.length]; return (
          <g key={i}><rect x={x} y={820 - h} width={300} height={h} fill={c} /><rect x={x} y={820 - h} width={300} height={h} fill="url(#tBrick)" />
            {Array.from({ length: 3 }, (_, r) => Array.from({ length: 3 }, (_, cc) => <rect key={`${r}${cc}`} x={x + 34 + cc * 86} y={820 - h + 50 + r * 140} width={58} height={92} rx={8} fill="#5E8BA6" stroke="#FFFFFF" strokeWidth={5} />))}
            <rect x={x + 20} y={660} width={260} height={160} fill="#3A3A3A" opacity={0.85} /><rect x={x + 10} y={622} width={280} height={38} rx={6} fill={[T.red, T.blue, T.green, T.purple][i % 4]} />
            <text x={x + 150} y={650} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={22} fill="#FFFFFF">{["BAKKAL", "BERBER", "KUAFÖR", "BÜFE", "EMLAK", "KASAP", "FIRIN", "ECZANE", "ÇAY OCAĞI"][i]}</text></g>); })}
      </g>
      <rect y={820} width={1920} height={260} fill="#8D9096" /><rect y={820} width={1920} height={30} fill="#B9B3A8" /><rect y={1020} width={1920} height={60} fill="#B9B3A8" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={md(i * 260 - px * 1.2, 2080) - 80} y={940} width={120} height={10} fill="#F4F4F4" opacity={0.8} />)}
      {car > 0 && <g transform={`translate(${1150 - px},0)`}><g transform="translate(0,1000)"><path d="M-250,-60 L-250,-130 Q-240,-160 -200,-165 L-120,-170 L-60,-240 Q-40,-260 0,-260 L120,-260 Q160,-260 180,-230 L220,-170 Q260,-160 260,-120 L260,-60Z" fill="#3A7BD5" /><path d="M-50,-230 L-100,-172 L60,-172 L60,-236Z" fill="#CFEAF5" />
        <path d="M-60,-172 L-180,-230 L-190,-80 L-70,-70Z" fill="#2A5DA8" stroke="#1E4A88" strokeWidth={4} />{[-150, 160].map((xx) => <g key={xx} transform={`translate(${xx},-56)`}><circle r={44} fill="#1E1E1E" /><circle r={18} fill="#9A9A9A" /></g>)}
        {[0, 1, 2].map((i) => <circle key={i} cx={-280 - i * 30 - md(t * 40, 30)} cy={-80 - i * 14} r={12 + i * 6} fill="#DDDDDD" opacity={0.5 - i * 0.12} />)}</g></g>}
      {simit > 0 && <g transform={`translate(${380 - px},1000)`}>
        <rect x={-150} y={-260} width={300} height={170} rx={14} fill="#C9262C" /><rect x={-140} y={-250} width={280} height={150} rx={10} fill="#BFE6F2" opacity={0.5} />
        {Array.from({ length: 9 }, (_, i) => <g key={i} transform={`translate(${-100 + (i % 3) * 100},${-220 + Math.floor(i / 3) * 44}) scale(0.7)`}><circle r={30} fill="none" stroke="#B5651D" strokeWidth={20} /><circle r={30} fill="none" stroke="#F3D9A4" strokeWidth={20} strokeDasharray="2 9" /></g>)}
        <rect x={-160} y={-90} width={320} height={20} fill="#8E1A20" /><text x={0} y={-270} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#C9262C">SİMİT</text>
        {[-110, 110].map((xx) => <circle key={xx} cx={xx} cy={-36} r={34} fill="#2A2A2A" />)}
        {[0, 1].map((i) => <path key={i} d={`M${-40 + i * 60},-280 q10,-30 0,-60`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.4 + 0.2 * Math.sin(t * 3 + i)} />)}
      </g>}
    </g>
  );
};
// sınıf: sıra sıraları, büyük pencerede İstanbul
export const Sinif: React.FC<{ t: number; board?: string[]; mode?: Mode; front?: boolean }> = ({ t, board = ["DENEME SINAVI", "09:00 – 11:45"], mode = "day", front = true }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9E2CF" />
    <g><svg x={1180} y={150} width={640} height={520} viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"><Sehir t={t} mode={mode} gulls={false} /></svg>
      <rect x={1180} y={150} width={640} height={520} fill="none" stroke="#FFFFFF" strokeWidth={18} /><path d="M1500,150 V670 M1180,400 H1820" stroke="#FFFFFF" strokeWidth={10} /></g>
    <rect x={120} y={130} width={940} height={420} rx={10} fill="#2F5D4A" stroke="#8A5A32" strokeWidth={22} />
    {board.map((l, i) => <text key={i} x={180} y={250 + i * 110} fontFamily="Patrick Hand" fontSize={78} fill="#F4F4F4">{l}</text>)}
    <circle cx={1100} cy={80} r={46} fill="#FFFFFF" stroke="#333" strokeWidth={6} /><path d={`M1100,80 L${1100 + Math.sin(t * 0.4) * 26},${80 - Math.cos(t * 0.4) * 26} M1100,80 L${1100 + Math.sin(t * 5) * 36},${80 - Math.cos(t * 5) * 36}`} stroke="#333" strokeWidth={5} strokeLinecap="round" />
    <rect x={40} y={560} width={300} height={160} fill="#F6C445" opacity={0.35} /><text x={190} y={660} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={46} fill="#B23A3F">YKS 2027</text>
    <rect y={760} width={1920} height={320} fill="#C9A77E" /><rect y={760} width={1920} height={320} fill="url(#tTile)" />
    {front && [0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${260 + i * 440},1000)`}><rect x={-170} y={-150} width={340} height={26} rx={6} fill="#B07A4A" /><rect x={-160} y={-124} width={300} height={44} fill="#8A5A32" /><rect x={-160} y={-124} width={14} height={124} fill="#555" /><rect x={146} y={-124} width={14} height={124} fill="#555" /></g>)}
  </g>
);
export const Kronometre: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><circle r={70} fill="#F4F4F4" stroke="#2A2A2A" strokeWidth={10} /><rect x={-12} y={-100} width={24} height={22} fill="#2A2A2A" /><path d={`M0,0 L${Math.sin(t * 6) * 54},${-Math.cos(t * 6) * 54}`} stroke="#E0393E" strokeWidth={6} strokeLinecap="round" /><circle r={7} fill="#2A2A2A" /></g>
);
// mutfak + kahvaltı masası
export const Kahvalti: React.FC<{ t: number; steam?: number; cold?: number; note?: boolean }> = ({ t, steam = 1, cold = 0, note = false }) => (
  <g>
    <rect width={1920} height={1080} fill="#F5E6CC" /><rect width={1920} height={760} fill="url(#tTile)" />
    <rect x={1040} y={120} width={420} height={320} rx={10} fill="#BFE6F2" stroke="#FFFFFF" strokeWidth={18} /><path d="M1250,120 V440 M1040,280 H1460" stroke="#FFFFFF" strokeWidth={10} />
    <rect x={1600} y={120} width={260} height={640} rx={20} fill="#E8EEF2" /><rect x={1600} y={380} width={260} height={8} fill="#C9D1D6" /><rect x={1820} y={200} width={10} height={120} rx={5} fill="#9AA5AD" />
    {note && <g transform="translate(1700,280) rotate(4)"><rect x={-90} y={-70} width={180} height={140} fill="#FFF8A0" /><text x={0} y={-20} textAnchor="middle" fontFamily="Patrick Hand" fontSize={30} fill="#333">ANNE,</text><text x={0} y={16} textAnchor="middle" fontFamily="Patrick Hand" fontSize={26} fill="#333">BEN İYİYİM</text><text x={0} y={50} textAnchor="middle" fontFamily="Patrick Hand" fontSize={34} fill="#E0566A">❤</text></g>}
    <rect x={120} y={140} width={700} height={250} fill="#8FC1A9" />{[0, 1, 2, 3].map((i) => <rect key={i} x={130 + i * 172} y={150} width={162} height={230} fill="#A5D1BB" />)}
    <rect x={80} y={540} width={760} height={40} fill="#D9C3A0" /><rect x={80} y={580} width={760} height={180} fill="#8FC1A9" />
    <g transform="translate(400,520)"><rect x={-60} y={-14} width={140} height={30} rx={10} fill="#555" />
      <g transform="translate(10,-14)"><path d="M-46,0 Q-56,-80 0,-90 Q56,-80 46,0Z" fill="#C9473E" /><path d="M-30,-90 Q0,-150 30,-90" fill="#C9473E" /><path d="M46,-50 q40,-10 50,-40" stroke="#C9473E" strokeWidth={10} fill="none" />
        {steam > 0 && [0, 1, 2].map((i) => <path key={i} d={`M${-10 + i * 12},-150 q14,-30 0,-60 q-14,-30 0,-60`} stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={steam * (0.4 + 0.3 * Math.sin(t * 3 + i))} transform={`translate(0,${-md(t * 30 + i * 20, 40)})`} />)}</g></g>
    <rect y={780} width={1920} height={300} fill="#D9C3A0" /><rect y={780} width={1920} height={300} fill="url(#tTile)" />
    <g transform="translate(1060,820)"><ellipse cx={0} cy={0} rx={520} ry={70} fill="#F4F4F2" /><ellipse cx={0} cy={-8} rx={500} ry={60} fill="#FFFFFF" />
      <ellipse cx={-300} cy={-14} rx={90} ry={26} fill="#F4F0E0" /><rect x={-340} y={-40} width={80} height={36} rx={6} fill={cold ? "#E8E0C4" : "#FFFBEA"} />
      <ellipse cx={-120} cy={-14} rx={80} ry={24} fill="#F4F0E0" />{Array.from({ length: 7 }, (_, i) => <circle key={i} cx={-150 + (i % 4) * 20} cy={-22 - Math.floor(i / 4) * 12} r={10} fill="#3A3A2A" />)}
      <ellipse cx={80} cy={-14} rx={80} ry={24} fill="#F4F0E0" />{[0, 1, 2].map((i) => <circle key={i} cx={50 + i * 30} cy={-24} r={18} fill="#E0393E" />)}
      {[260, 380].map((xx) => <g key={xx} transform={`translate(${xx},-10)`}><path d="M-22,-70 Q-30,-40 -14,-20 Q-26,0 -18,10 L18,10 Q26,0 14,-20 Q30,-40 22,-70Z" fill="#F7E9D0" opacity={0.6} /><path d="M-18,-40 Q-24,-20 -12,-14 Q-20,0 -14,8 L14,8 Q20,0 12,-14 Q24,-20 18,-40Z" fill={cold ? "#A0522D" : "#B5481F"} /></g>)}
    </g>
  </g>
);
export const Terlik: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>{[-70, 70].map((xx) => <g key={xx} transform={`translate(${xx},0) rotate(${xx > 0 ? 8 : -6})`}><ellipse cx={0} cy={0} rx={50} ry={110} fill="#E86A92" /><path d="M-46,-40 Q0,-80 46,-40 L40,10 Q0,-20 -40,10Z" fill="#C24F75" /><circle cx={0} cy={-36} r={12} fill="#FFFFFF" /></g>)}</g>
);
// çatı: su deposu, bidonlar, arkada şehir
export const Cati: React.FC<{ t: number; lid?: number }> = ({ t, lid = 0 }) => (
  <g>
    <Sehir t={t} mode="day" />
    <rect y={820} width={1920} height={260} fill="#B07A5A" /><path d="M0,820 L1920,820" stroke="#7A4A32" strokeWidth={10} />
    {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${i * 82},820 q41,30 82,0`} fill="none" stroke="#8A5A40" strokeWidth={6} />)}
    <g transform="translate(1300,820)"><ellipse cx={0} cy={-300} rx={240} ry={50} fill="#4A8ACF" /><rect x={-240} y={-300} width={480} height={300} fill="#3A7BD5" /><ellipse cx={0} cy={0} rx={240} ry={50} fill="#2A5DA8" />
      {[-160, 0, 160].map((xx) => <path key={xx} d={`M${xx},-300 V0`} stroke="#2A5DA8" strokeWidth={6} />)}
      <ellipse cx={0} cy={-300 - lid * 80} rx={90} ry={22} fill="#2A5DA8" transform={`rotate(${lid * -30} 90 -300)`} />
      {lid > 0.5 && <ellipse cx={0} cy={-300} rx={80} ry={18} fill="#9FD3EC" />}
      <text x={0} y={-140} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={48} fill="#FFFFFF">2 TON</text>
      {[-300, 300].map((xx) => <rect key={xx} x={xx - 10} y={-60} width={20} height={60} fill="#555" />)}</g>
    <rect x={200} y={600} width={60} height={220} fill="#9A6A4A" /><rect x={190} y={590} width={80} height={20} fill="#7A4A32" />
  </g>
);
// Kapalıçarşı kuyumcu vitrinleri
export const Kuyumcu: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9D3A8" />
    {Array.from({ length: 5 }, (_, i) => <g key={i}><path d={`M${i * 420 - 40},0 V540 A190,190 0 0 1 ${i * 420 + 340},540 V0`} fill="#D2B07A" /><path d={`M${i * 420 - 40},540 A190,190 0 0 1 ${i * 420 + 340},540`} fill="none" stroke="#B23A3F" strokeWidth={18} strokeDasharray="30 20" /></g>)}
    {Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${100 + i * 330},120)`}><path d="M0,0 h20 v30 q-10,30 0,60 h-20 q10,-30 0,-60Z" fill="#B23A3F" /><circle cx={10} cy={110} r={22} fill="#F6C445" opacity={0.8} /></g>)}
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${180 + i * 600},560)`}>
      <rect x={0} y={0} width={480} height={300} rx={10} fill="#2A2218" /><rect x={14} y={14} width={452} height={272} rx={6} fill="#F6EFD8" opacity={0.9} />
      {Array.from({ length: 12 }, (_, k) => <g key={k}><ellipse cx={60 + (k % 4) * 110} cy={70 + Math.floor(k / 4) * 80} rx={38} ry={14} fill="none" stroke="#E8B830" strokeWidth={10} /><circle cx={40 + (k % 4) * 110} cy={64 + Math.floor(k / 4) * 80} r={4} fill="#FFFFFF" opacity={0.5 + 0.5 * Math.sin(t * 5 + k + i)} /></g>)}
      <rect x={0} y={-60} width={480} height={56} rx={8} fill="#B23A3F" /><text x={240} y={-20} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#F6C445">{["KUYUMCU HASAN", "ALTIN SARAYI", "ÇARŞI KUYUMCU"][i]}</text></g>)}
    <rect y={900} width={1920} height={180} fill="#B9A27A" /><rect y={900} width={1920} height={180} fill="url(#tStone)" />
  </g>
);
// market: raflar, ölü buzdolapları, yeşil ekmek
export const Market: React.FC<{ t: number; spoiled?: number; dark?: number }> = ({ t, spoiled = 0, dark = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#EEF0EE" />
    <rect width={1920} height={120} fill="#E0393E" /><text x={960} y={84} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={60} fill="#FFFFFF">MAHALLE MARKET</text>
    {[0, 1, 2].map((r) => <g key={r}><rect x={60} y={200 + r * 200} width={900} height={20} fill="#9AA5AD" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={80 + i * 72} y={200 + r * 200 - 110} width={56} height={110} rx={6} fill={["#F6C445", "#3A7BD5", "#3FAE6A", "#E86A92", "#F28C28"][(i + r) % 5]} />)}</g>)}
    <g transform="translate(1060,150)"><rect width={780} height={620} rx={14} fill="#C9D1D6" /><rect x={20} y={20} width={740} height={580} rx={8} fill={dark ? "#3A4048" : "#DFF2FA"} opacity={0.9} />
      {[0, 1, 2].map((r) => <rect key={r} x={40} y={190 + r * 180} width={700} height={12} fill="#9AA5AD" />)}
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={70 + (i % 9) * 76} y={120} width={52} height={70} rx={8} fill="#F4F4F4" />)}
      <text x={390} y={-14} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={36} fill={dark ? "#B23A3F" : "#2A5DA8"}>{dark ? "SOĞUTUCU · KAPALI" : "SÜT · YOĞURT"}</text></g>
    <g transform="translate(1440,560)">{Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${(i % 3) * 120 - 120},${Math.floor(i / 3) * 70})`}><ellipse cx={0} cy={0} rx={56} ry={30} fill="#D9A866" />{spoiled > 0 && Array.from({ length: 6 }, (_, k) => <circle key={k} cx={-30 + k * 12} cy={-6 + Math.sin(k) * 10} r={9} fill="#6E9A3A" opacity={spoiled} />)}</g>)}</g>
    {spoiled > 0 && Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${1300 + i * 80},${560 - md(t * 40 + i * 30, 120)} q20,-20 0,-40 q-20,-20 0,-40`} stroke="#8AA03A" strokeWidth={8} fill="none" opacity={0.5 * spoiled} />)}
    <rect y={820} width={1920} height={260} fill="#D7DCDF" /><rect y={820} width={1920} height={260} fill="url(#tTile)" />
  </g>
);
// Taksim Meydanı: anıt, boş meydan, tramvay
export const Taksim: React.FC<{ t: number; dusk?: number }> = ({ t, dusk = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={dusk ? "url(#tSkyDusk)" : "url(#tSkyDay)"} />
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={-100 + i * 220} y={420 + ((i * 41) % 120)} width={210} height={400} fill={["#C9B49A", "#B7A58E", "#D6C6AE"][i % 3]} />)}
    <rect x={100} y={300} width={500} height={520} fill="#9AA8B4" /><text x={350} y={360} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={36} fill="#F4F4F4">AKM</text>
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={130 + i * 78} y={400} width={50} height={380} fill="#7E8C98" />)}
    <g transform="translate(1200,860)"><rect x={-160} y={-40} width={320} height={40} fill="#C9C2B4" /><rect x={-130} y={-360} width={260} height={320} fill="#BDB5A6" /><path d="M-90,-40 V-260 A90,90 0 0 1 90,-260 V-40Z" fill="#8A8476" />
      <rect x={-150} y={-380} width={300} height={30} fill="#A9A192" />{[-60, 0, 60].map((xx) => <g key={xx}><rect x={xx - 18} y={-470} width={36} height={90} fill="#5A6A5A" /><circle cx={xx} cy={-490} r={18} fill="#5A6A5A" /></g>)}
      <path d="M-130,-200 h-40 v160 h40" fill="#B23A3F" opacity={0.9} /></g>
    <rect y={820} width={1920} height={260} fill="#BDB09A" /><rect y={820} width={1920} height={260} fill="url(#tTile)" />
    {[930, 1000].map((yy) => <rect key={yy} y={yy} width={1920} height={10} fill="#7A7A7A" />)}
    {[0, 1, 2].map((i) => { const x = md(200 + i * 700 + t * 60, 2200) - 140, y = 220 + i * 50; return <path key={i} d={`M${x - 26},${y} Q${x - 12},${y - 10} ${x},${y} Q${x + 12},${y - 10} ${x + 26},${y}`} stroke="#3A3A3A" strokeWidth={5} fill="none" />; })}
  </g>
);
export const Eczane: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#F2F6F4" />
    <g transform="translate(960,110)"><rect x={-260} y={-60} width={520} height={110} rx={14} fill="#E0393E" /><text x={0} y={22} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={72} fill="#FFFFFF">ECZANE</text><text x={-220} y={24} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={86} fill="#FFFFFF">E</text></g>
    {[0, 1, 2, 3].map((r) => <g key={r}><rect x={80} y={300 + r * 150} width={1760} height={16} fill="#BCC6CC" />
      {Array.from({ length: 22 }, (_, i) => <rect key={i} x={100 + i * 78} y={300 + r * 150 - 84} width={60} height={84} rx={6} fill={["#FFFFFF", "#9FD3EC", "#F6C445", "#E86A92", "#B7CFA7"][(i * 3 + r) % 5]} stroke="#DDE2E6" strokeWidth={3} />)}</g>)}
    <rect y={860} width={1920} height={220} fill="#D7DCDF" /><rect x={300} y={760} width={1320} height={120} fill="#E8ECEE" stroke="#BCC6CC" strokeWidth={6} />
    <circle cx={1700} cy={200} r={40} fill="#3FAE6A" opacity={0.3 + 0.2 * Math.sin(t * 3)} />
  </g>
);
export const Otel: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A1E2A" />
    <rect x={200} y={100} width={1520} height={700} fill="#4A2E3E" /><rect x={200} y={100} width={1520} height={700} fill="url(#tBrick)" opacity={0.3} />
    <rect x={1180} y={160} width={420} height={460} fill="#16284A" stroke="#C9A84A" strokeWidth={14} /><path d="M1390,160 V620 M1180,390 H1600" stroke="#C9A84A" strokeWidth={6} />
    <Gok t={t} mode="night" stars={0.9} />
    <rect x={0} y={0} width={1180} height={1080} fill="#2A1E2A" opacity={0} />
    <g><rect x={1180} y={160} width={420} height={460} fill="#0B1426" opacity={0.6} /></g>
    <g transform="translate(560,820)"><rect x={-420} y={-180} width={840} height={180} rx={20} fill="#F4EDE2" /><rect x={-440} y={-380} width={60} height={380} rx={10} fill="#8A5A32" /><rect x={-420} y={-220} width={840} height={60} rx={20} fill="#C9A84A" />
      {[-260, -60].map((xx) => <rect key={xx} x={xx} y={-260} width={180} height={70} rx={30} fill="#FFFFFF" />)}</g>
    <g transform="translate(1250,880)"><rect x={-110} y={-140} width={220} height={140} fill="#6A3A2A" />
      <g transform="translate(0,-140)"><rect x={-12} y={-90} width={24} height={90} fill="#F4F0E0" /><path d={`M0,-90 q${10 + Math.sin(t * 9) * 5},-24 0,-46 q-10,22 0,46Z`} fill="#FFB43A" /><circle cx={0} cy={-110} r={120} fill="url(#siFire)" opacity={0.7} /></g></g>
    <defs><radialGradient id="siFire" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFB45A" stopOpacity="0.6" /><stop offset="1" stopColor="#FFB45A" stopOpacity="0" /></radialGradient></defs>
    <rect y={880} width={1920} height={200} fill="url(#tCarpet)" opacity={0.7} />
    <rect width={1920} height={1080} fill="#000" opacity={0.25} />
  </g>
);
export const Stad: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#tSkyDay)" />
    {Array.from({ length: 12 }, (_, r) => <rect key={r} x={0} y={140 + r * 40} width={1920} height={36} fill={r % 2 ? "#E0393E" : "#B02A2F"} />)}
    {Array.from({ length: 12 }, (_, r) => Array.from({ length: 40 }, (_, i) => <rect key={`${r}${i}`} x={i * 48 + (r % 2) * 24} y={146 + r * 40} width={30} height={14} rx={4} fill="#FFFFFF" opacity={0.25} />))}
    <text x={960} y={300} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={90} fill="#FFFFFF" opacity={0.5}>İSTANBUL</text>
    {[200, 1720].map((xx) => <g key={xx}><rect x={xx - 8} y={20} width={16} height={130} fill="#555" /><rect x={xx - 60} y={0} width={120} height={50} rx={6} fill="#DDDDDD" /></g>)}
    <rect y={620} width={1920} height={460} fill="#3FAE6A" />{Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 192} y={620} width={96} height={460} fill="#4BBE76" />)}
    <path d="M0,700 H1920" stroke="#FFFFFF" strokeWidth={6} />
    <g transform="translate(1600,860)"><rect x={-10} y={-260} width={14} height={260} fill="#FFFFFF" /><rect x={-10} y={-260} width={300} height={14} fill="#FFFFFF" />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${i * 36},-246 V0`} stroke="#FFFFFF" strokeWidth={2} opacity={0.6} />)}</g>
  </g>
);
// ahşap ev içi: soba, pencerede kar
export const AhsapIc: React.FC<{ t: number; fire?: number; snow?: number; night?: number }> = ({ t, fire = 1, snow = 0, night = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#B98A5A" />
    {Array.from({ length: 24 }, (_, i) => <rect key={i} x={i * 80} y={0} width={78} height={860} fill={i % 2 ? "#B07A4A" : "#A8703F"} />)}
    <g transform="translate(1250,160)"><rect width={460} height={420} fill={night ? "#16284A" : "#CFE3EE"} stroke="#6A4224" strokeWidth={22} /><path d="M230,0 V420 M0,210 H460" stroke="#6A4224" strokeWidth={12} />
      <svg x={0} y={0} width={460} height={420} viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"><Sehir t={t} mode={night ? "night" : "day"} snow={snow} stars={night ? 0.6 : 0} />{snow > 0 && <g>{Array.from({ length: 60 }, (_, i) => <circle key={i} cx={md(i * 173 - t * 60, 1920)} cy={md(i * 131 + t * 200, 1080)} r={10} fill="#FFFFFF" opacity={snow} />)}</g>}</svg>
      <rect y={400} width={460} height={30} fill="#6A4224" /></g>
    <rect x={180} y={180} width={300} height={220} fill="#F4EDE2" stroke="#6A4224" strokeWidth={14} /><text x={330} y={310} textAnchor="middle" fontFamily="Patrick Hand" fontSize={46} fill="#5A3E8A">GÜN {"→"} 100</text>
    <rect y={860} width={1920} height={220} fill="#7A5232" /><rect y={860} width={1920} height={220} fill="url(#tTile)" opacity={0.5} />
    <rect x={120} y={900} width={600} height={160} rx={20} fill="url(#tCarpet)" />
    <Soba x={960} y={900} t={t} fire={fire} />
    <OdunYigin x={1500} y={900} s={0.9} />
  </g>
);
// Haliç: sakin su, eski ahşap evler, arkada Galata
export const Halic: React.FC<{ t: number; dawn?: number; boat?: React.ReactNode; dolphin?: number }> = ({ t, dawn = 0, boat, dolphin = 0 }) => (
  <g>
    <Gok t={t} mode={dawn ? "dusk" : "day"} sun={dawn * 0.7} />
    <GalataK x={1500} y={560} s={0.7} c={dawn ? "#5A4A6A" : "#8FA4B4"} />
    {Array.from({ length: 16 }, (_, i) => { const x = -60 + i * 130, h = 120 + ((i * 59) % 110), c = ["#C97A5A", "#D9B47A", "#8FAFA0", "#C9A5C9"][i % 4]; return <g key={i}><rect x={x} y={640 - h} width={126} height={h} fill={c} /><path d={`M${x - 6},${640 - h} L${x + 63},${590 - h} L${x + 132},${640 - h}Z`} fill="#8A4A32" />{[0, 1].map((w) => <rect key={w} x={x + 20 + w * 56} y={660 - h} width={30} height={40} fill="#5E8BA6" />)}</g>; })}
    <rect y={640} width={1920} height={30} fill="#6A6A5A" />
    <Deniz t={t} y={670} lodos={0} c={dawn ? "#C98A6E" : "#3F8AAE"} />
    {dolphin > 0 && <Yunus x={760} y={900} s={0.9} k={dolphin} />}
    {boat}
  </g>
);
// Galata Köprüsü: korkuluk, oltalar, arkada Yeni Cami + Süleymaniye
export const Kopru: React.FC<{ t: number; dusk?: number; rods?: number; night?: number; snow?: number }> = ({ t, dusk = 0, rods = 1, night = 0, snow = 0 }) => {
  const mode: Mode = night ? "night" : dusk ? "dusk" : "day";
  const sil = night ? "#0E1830" : dusk ? "#3A2E4E" : "#94A6B4";
  return (
    <g>
      <Gok t={t} mode={mode} sun={dusk} stars={night ? 0.6 : 0} />
      <Cami x={620} y={640} s={1.1} c={sil} /><Cami x={1350} y={600} s={0.75} c={sil} />
      {Array.from({ length: 20 }, (_, i) => <rect key={i} x={-60 + i * 104} y={600 - ((i * 37) % 50)} width={100} height={80 + ((i * 37) % 50)} fill={sil} opacity={0.9} />)}
      <Deniz t={t} y={660} c={night ? "#0C1A34" : dusk ? "#C9775E" : "#4F9CC0"} night={night} />
      {dusk > 0 && <path d="M1150,670 L1500,670 L1640,1080 L1020,1080Z" fill="#FFD08A" opacity={0.3 * dusk} />}
      {[0, 1, 2].map((i) => { const x = md(300 + i * 640 + t * 60, 2200) - 140, y = 320 + i * 60 + Math.sin(t * 2 + i) * 16, f = Math.sin(t * 9 + i) * 12; return <path key={i} d={`M${x - 30},${y + f} Q${x - 14},${y - 10} ${x},${y} Q${x + 14},${y - 10} ${x + 30},${y + f}`} stroke={dusk ? "#2A2240" : "#3A3A3A"} strokeWidth={5} fill="none" strokeLinecap="round" />; })}
      <rect y={880} width={1920} height={200} fill="#8D9096" /><rect y={880} width={1920} height={18} fill="#6E7278" />
      <rect y={790} width={1920} height={14} fill="#5A6068" />{Array.from({ length: 33 }, (_, i) => <rect key={i} x={i * 60} y={790} width={8} height={92} fill="#5A6068" />)}
      <rect y={840} width={1920} height={8} fill="#5A6068" />
      {snow > 0 && <rect y={872} width={1920} height={14} fill="#F4F8FF" opacity={snow} />}
      {rods > 0 && [140, 420, 760, 1560, 1800].map((xx, i) => <g key={xx} opacity={rods}><path d={`M${xx},880 L${xx + 140},${380 + (i % 2) * 40}`} stroke="#2A2A2A" strokeWidth={6} /><path d={`M${xx + 140},${380 + (i % 2) * 40} L${xx + 150},${700 + Math.sin(t * 1.5 + i) * 20}`} stroke="#FFFFFF" strokeWidth={1.5} opacity={0.8} /><rect x={xx - 20} y={860} width={44} height={22} rx={4} fill={["#3A7BD5", "#E0393E", "#F6C445"][i % 3]} /></g>)}
    </g>
  );
};
export const Kutuphane: React.FC<{ t: number }> = () => (
  <g>
    <rect width={1920} height={1080} fill="#E9DCC6" />
    {[0, 1, 2, 3].map((c) => <g key={c} transform={`translate(${80 + c * 460},120)`}><rect width={420} height={700} fill="#8A5A32" />
      {[0, 1, 2, 3, 4].map((r) => <g key={r}><rect x={10} y={20 + r * 136} width={400} height={120} fill="#6A4224" />{Array.from({ length: 12 }, (_, i) => <rect key={i} x={18 + i * 32} y={30 + r * 136 + (i % 3) * 6} width={28} height={110 - (i % 3) * 6} fill={["#B23A3F", "#2A5DA8", "#3FAE6A", "#F6C445", "#7E5BD6", "#E9E2CF"][(i + r + c) % 6]} />)}</g>)}</g>)}
    <rect y={840} width={1920} height={240} fill="#9E6B42" />
  </g>
);
export const Firin2: React.FC<{ t: number; fire?: number; simits?: number; burnt?: number }> = ({ t, fire = 1, simits = 0, burnt = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E6CFA8" /><rect width={1920} height={1080} fill="url(#tBrick)" opacity={0.5} />
    <g transform="translate(960,700)"><path d="M-500,0 V-300 A500,330 0 0 1 500,-300 V0Z" fill="#B5683E" /><path d="M-500,0 V-300 A500,330 0 0 1 500,-300 V0Z" fill="url(#tBrick)" />
      <path d="M-220,0 V-140 A220,170 0 0 1 220,-140 V0Z" fill="#1A1010" />
      {fire > 0 && <g>{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-160 + i * 40},0 q${10 + Math.sin(t * 8 + i) * 10},-70 0,${-90 - Math.abs(Math.sin(t * 6 + i)) * 50} q-20,60 0,90Z`} fill={i % 2 ? "#FFB43A" : "#FF6A2A"} opacity={fire} />)}<ellipse cx={0} cy={-80} rx={300} ry={200} fill="url(#siFire)" opacity={0.6 * fire} /></g>}
      <defs><radialGradient id="siFire" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFB45A" stopOpacity="0.6" /><stop offset="1" stopColor="#FFB45A" stopOpacity="0" /></radialGradient></defs></g>
    <rect y={700} width={1920} height={60} fill="#8A5A32" />
    {simits > 0 && <g transform="translate(960,860)"><rect x={-500} y={-100} width={1000} height={36} rx={8} fill="#B07A4A" />{Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${-390 + i * 130},-130)`}><circle r={44} fill="none" stroke={burnt ? "#5A3018" : "#B5651D"} strokeWidth={26} /><circle r={44} fill="none" stroke="#F3D9A4" strokeWidth={26} strokeDasharray="2 10" opacity={burnt ? 0.3 : 0.9} /></g>)}</g>}
    <rect y={1000} width={1920} height={80} fill="#9E6B42" />
  </g>
);

// ───────── HUD: kanalın "güç göstergesi" (bu filmde: gün sayacı + dünya nüfusu) ─────────
export const HUD: React.FC<{ t: number; gun: number; nufus?: string; k?: number; x?: number; y?: number }> = ({ t, gun, nufus = "2", k = 1, x = 1500, y = 40 }) => (
  <g transform={`translate(${x},${y})`} opacity={k}>
    <rect width={380} height={140} rx={22} fill="#0E1A2E" opacity={0.82} stroke="#1FC8B4" strokeWidth={4} />
    <text x={24} y={52} fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#2EE6D0">GÜN {gun}</text>
    <rect x={180} y={30} width={176} height={14} rx={7} fill="#1A2C48" /><rect x={180} y={30} width={176 * Math.min(1, gun / 100)} height={14} rx={7} fill="#1FC8B4" />
    <text x={24} y={104} fontFamily="Poppins" fontWeight={700} fontSize={26} fill="#FFFFFF">DÜNYA NÜFUSU:</text>
    <text x={356} y={110} textAnchor="end" fontFamily="Poppins" fontWeight={800} fontSize={48} fill="#F6C445">{nufus}</text>
    <circle cx={356} cy={-6} r={8} fill="#E0393E" opacity={0.5 + 0.5 * Math.sin(t * 5)} />
  </g>
);
// büyük sayaç kartı: 8.200.000.000 → 2
export const Nufus: React.FC<{ t: number; k: number }> = ({ k }) => {
  const n = k < 0.75 ? Math.round(8_200_000_000 * Math.pow(1 - k / 0.75, 3)) : 2;
  const s = Math.max(2, n).toLocaleString("tr-TR");
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E1A2E" />
      {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 97) % 1080} r={2} fill="#FFFFFF" opacity={0.25} />)}
      <text x={960} y={400} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={56} fill="#FFFFFF" opacity={0.8}>DÜNYA NÜFUSU</text>
      <text x={960} y={600} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={k < 0.75 ? 150 : 300} fill={k < 0.75 ? "#F6C445" : "#2EE6D0"}>{s}</text>
      {k >= 0.75 && <circle cx={960} cy={500} r={260} fill="url(#tRim)" opacity={0.35} />}
    </g>
  );
};
export const _si = { cl };
