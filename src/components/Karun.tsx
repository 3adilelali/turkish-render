import React from "react";
import { X, T, typed } from "./Protokol";
import { rp, lp, Person, Look, HCam } from "./Hayat";
import { hash } from "./Motion";

// Kanal 5 · Protokol X · k7-03 "Karun Hazinesi" kiti (2026-11-22)
// Motor sahneleri: vitrin, kanatlı denizatı broşu (ayrıntılı vektör), tümülüs (kesit + gece kazısı), mezar odası,
// köy pazarlığı, depo, katalog masası, mahkeme, mektup, döküm/dövme karşılaştırması, mühürlü kutu, efsane.
// Kimlik: zemin #07090E, kehribar vurgu, altın tonları. Flaş/ışık patlaması YOK; geçişler yumuşak.

type P = { t: number; a: number; b: number };
const GOLD = "#E8B84A", GOLD2 = "#B8862A", GOLD3 = "#FFE7A0";

export const KDefs: React.FC = () => (
  <defs>
    <linearGradient id="kGold" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor={GOLD3} /><stop offset="0.35" stopColor={GOLD} /><stop offset="0.7" stopColor={GOLD2} /><stop offset="1" stopColor="#FFD970" /></linearGradient>
    <linearGradient id="kGoldD" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#C9973A" /><stop offset="1" stopColor="#7A5418" /></linearGradient>
    <radialGradient id="kLamp" cx="0.5" cy="0.5" r="0.5"><stop offset="0" stopColor="#FFC870" stopOpacity="0.75" /><stop offset="0.5" stopColor="#FF9A3A" stopOpacity="0.25" /><stop offset="1" stopColor="#FF9A3A" stopOpacity="0" /></radialGradient>
    <radialGradient id="kSpot" cx="0.5" cy="0.2" r="0.8"><stop offset="0" stopColor="#FFF4DA" stopOpacity="0.5" /><stop offset="1" stopColor="#FFF4DA" stopOpacity="0" /></radialGradient>
    <linearGradient id="kGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#BFE6FF" stopOpacity="0.16" /><stop offset="0.5" stopColor="#BFE6FF" stopOpacity="0.04" /><stop offset="1" stopColor="#BFE6FF" stopOpacity="0.12" /></linearGradient>
    <linearGradient id="kSoil" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#4A3A2A" /><stop offset="1" stopColor="#241A12" /></linearGradient>
    <linearGradient id="kNight" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#04060B" /><stop offset="0.7" stopColor="#101A30" /><stop offset="1" stopColor="#1C2338" /></linearGradient>
    <linearGradient id="kDusk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#1B2740" /><stop offset="0.6" stopColor="#4A3E58" /><stop offset="1" stopColor="#D4844E" /></linearGradient>
    <linearGradient id="kStone" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#B9B0A2" /><stop offset="1" stopColor="#7E7668" /></linearGradient>
    <linearGradient id="kWood" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#6B4A2E" /><stop offset="1" stopColor="#3E2A18" /></linearGradient>
    <filter id="kBlur" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="6" /></filter>
    <filter id="kBlur2" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2" /></filter>
  </defs>
);

// ───────── yardımcılar ─────────
const Dust: React.FC<{ t: number; n?: number; c?: string; o?: number; seed?: number; box?: [number, number, number, number] }> = ({ t, n = 40, c = "#FFE2B0", o = 0.5, seed = 1, box = [0, 0, 1920, 1080] }) => (
  <g>{Array.from({ length: n }, (_, i) => {
    const h1 = hash(i * 7 + seed), h2 = hash(i * 13 + seed * 3), h3 = hash(i * 3 + seed * 5);
    const x = box[0] + ((h1 * box[2] + t * (8 + h3 * 14)) % box[2]);
    const y = box[1] + ((h2 * box[3] - t * (5 + h1 * 9) + box[3] * 10) % box[3]);
    return <circle key={i} cx={x} cy={y} r={1 + h3 * 2.2} fill={c} opacity={o * (0.3 + 0.7 * Math.abs(Math.sin(t * (0.6 + h2) + i)))} />;
  })}</g>
);
const Stars: React.FC<{ t: number; n?: number }> = ({ t, n = 90 }) => (
  <g>{Array.from({ length: n }, (_, i) => <circle key={i} cx={hash(i) * 1920} cy={hash(i + 99) * 520} r={0.8 + hash(i + 7) * 1.6} fill="#FFF" opacity={0.3 + 0.5 * Math.abs(Math.sin(t * (0.5 + hash(i + 3)) + i))} />)}</g>
);
export const Label: React.FC<{ x: number; y: number; k: number; a: string; b?: string; c?: string; w?: number }> = ({ x, y, k, a, b, c = X.amber, w = 560 }) => (
  <g opacity={k} transform={`translate(${x},${y + (1 - k) * 14})`}>
    <rect x={0} y={-46} width={w} height={b ? 104 : 64} rx={6} fill="#05070C" opacity={0.82} />
    <rect x={0} y={-46} width={6} height={b ? 104 : 64} fill={c} />
    {T(26, -4, a, 34, "#FFF", 700)}
    {b && T(26, 42, b, 24, X.dim, 500)}
  </g>
);
export const Tag: React.FC<{ x: number; y: number; k: number; s: string; c?: string; size?: number }> = ({ x, y, k, s, c = X.amber, size = 26 }) => {
  const w = s.length * size * 0.62 + 40;
  return <g opacity={k} transform={`translate(${x},${y})`}><rect x={0} y={-size - 8} width={w} height={size + 24} rx={4} fill={c} />{T(20, 2, s, size, "#07090E", 800)}</g>;
};
export const Stamp: React.FC<{ x: number; y: number; t: number; at: number; s: string; c?: string; rot?: number; size?: number }> = ({ x, y, t, at, s, c = X.red, rot = -12, size = 64 }) => {
  if (t < at) return null;
  const k = rp(t, at, at + 0.25);
  const sc = lp(1.6, 1, k);
  const w = s.length * size * 0.66 + 60;
  return (
    <g opacity={k} transform={`translate(${x},${y}) rotate(${rot}) scale(${sc})`}>
      <rect x={-w / 2} y={-size * 0.85} width={w} height={size * 1.4} rx={8} fill="none" stroke={c} strokeWidth={7} />
      {T(0, size * 0.32, s, size, c, 800, "middle", { letterSpacing: 4 })}
    </g>
  );
};

// ───────── KANATLI DENİZATI BROŞU (ayrıntılı) ─────────
// (0,0) merkez; yaklaşık 520 x 560 birim. real=dövme (çekiç izleri), fake=döküm (kabarcık)
export const Brooch: React.FC<{ x: number; y: number; s?: number; t: number; glint?: number; surface?: "real" | "fake" | "none"; rot?: number; op?: number }> = ({ x, y, s = 1, t, glint = 1, surface = "none", rot = 0, op = 1 }) => {
  const sw = (i: number) => Math.sin(t * 1.7 + i * 0.9) * 5; // sarkaç
  const gx = ((t * 160) % 1400) - 500;
  const gran = (cx: number, cy: number, n: number, r: number, rr = 4) => Array.from({ length: n }, (_, i) => {
    const a = (i / n) * Math.PI * 2;
    return <circle key={i} cx={cx + Math.cos(a) * r} cy={cy + Math.sin(a) * r} r={rr} fill="url(#kGold)" stroke="#8A6420" strokeWidth={0.8} />;
  });
  return (
    <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`} opacity={op}>
      <clipPath id="kBrClip"><path d="M-40,-230 C40,-270 120,-220 110,-150 C100,-90 40,-80 30,-30 C20,30 90,60 80,130 C70,190 0,210 -40,180 C-10,160 10,120 -10,90 C-40,50 -90,20 -80,-60 C-75,-120 -110,-170 -40,-230Z" /></clipPath>
      {/* gölge */}
      <ellipse cx={20} cy={330} rx={200} ry={24} fill="#000" opacity={0.35} filter="url(#kBlur)" />
      {/* kanatlar (arkada) */}
      {[-1, 1].map((d) => (
        <g key={d} transform={`translate(${d < 0 ? -40 : 60},-120) scale(${d},1)`}>
          <path d="M0,0 C80,-110 230,-150 300,-110 C260,-80 250,-40 270,-10 C220,-10 200,20 215,50 C160,40 120,60 110,90 C70,60 30,40 0,30Z" fill="url(#kGold)" stroke="#7A5418" strokeWidth={3} />
          {[0, 1, 2, 3, 4, 5].map((i) => <path key={i} d={`M${10 + i * 14},${10 - i * 6} C${80 + i * 20},${-60 - i * 10} ${170 + i * 14},${-90 - i * 4} ${250 + i * 4},${-100 + i * 18}`} stroke="#9A6E22" strokeWidth={2.4} fill="none" opacity={0.85} />)}
          {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={40 + i * 15} cy={-30 - Math.sin(i / 3) * 50 + i * 3} r={3.4} fill={GOLD3} stroke="#8A6420" strokeWidth={0.6} />)}
        </g>
      ))}
      {/* gövde: S kıvrımlı denizatı */}
      <path d="M-40,-230 C40,-270 120,-220 110,-150 C100,-90 40,-80 30,-30 C20,30 90,60 80,130 C70,190 0,210 -40,180 C-10,160 10,120 -10,90 C-40,50 -90,20 -80,-60 C-75,-120 -110,-170 -40,-230Z" fill="url(#kGold)" stroke="#6E4A14" strokeWidth={4} />
      {/* yüzey dokusu */}
      <g clipPath="url(#kBrClip)">
        {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M-120,${-220 + i * 30} q100,-14 240,0`} stroke="#9A6E22" strokeWidth={2} fill="none" opacity={0.6} />)}
        {surface === "real" && Array.from({ length: 70 }, (_, i) => <ellipse key={i} cx={-90 + hash(i) * 200} cy={-230 + hash(i + 40) * 420} rx={7 + hash(i + 3) * 8} ry={3 + hash(i + 5) * 3} transform={`rotate(${hash(i + 9) * 180} ${-90 + hash(i) * 200} ${-230 + hash(i + 40) * 420})`} fill="#FFF3C4" opacity={0.35} />)}
        {surface === "fake" && Array.from({ length: 60 }, (_, i) => <circle key={i} cx={-90 + hash(i + 2) * 200} cy={-230 + hash(i + 60) * 420} r={1.5 + hash(i + 8) * 4} fill="#5A3C10" opacity={0.7} />)}
        {/* parıltı süpürmesi */}
        <rect x={gx} y={-300} width={70} height={700} fill="#FFF8DA" opacity={0.28 * glint} transform="rotate(20)" />
      </g>
      {/* baş: göz + ağız + yele */}
      <circle cx={46} cy={-190} r={14} fill="#3A1E08" /><circle cx={50} cy={-194} r={4} fill="#FFF0C0" />
      <path d="M100,-170 L170,-150 L104,-138Z" fill="url(#kGold)" stroke="#6E4A14" strokeWidth={3} />
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-70 + i * 4},${-150 + i * 28} l-26,${-6 + i}`} stroke="#7A5418" strokeWidth={5} strokeLinecap="round" />)}
      {gran(20, -120, 12, 26, 3.6)}
      {gran(10, 40, 10, 22, 3.4)}
      {/* kuyruk kıvrımı */}
      <path d="M-40,180 C-90,220 -70,280 -20,270 C20,262 10,220 -20,226" fill="none" stroke="url(#kGold)" strokeWidth={22} strokeLinecap="round" />
      <path d="M-40,180 C-90,220 -70,280 -20,270 C20,262 10,220 -20,226" fill="none" stroke="#6E4A14" strokeWidth={2} />
      {/* sarkaçlar: zincir + nar */}
      {[-130, -70, -10, 50, 110].map((px, i) => {
        const cx = px + sw(i), top = 150 + (i % 2) * 30;
        return (
          <g key={i}>
            <path d={`M${px},${top - 60} Q${px + sw(i) * 0.5},${top} ${cx},${top + 50}`} stroke={GOLD2} strokeWidth={2.4} fill="none" strokeDasharray="5 3" />
            <g transform={`translate(${cx},${top + 74})`}>
              <ellipse rx={20} ry={24} fill="url(#kGold)" stroke="#6E4A14" strokeWidth={2} />
              <path d="M-10,-24 L-6,-34 L0,-26 L6,-34 L10,-24" fill="url(#kGold)" stroke="#6E4A14" strokeWidth={1.6} />
              <circle cx={-6} cy={-6} r={4} fill="#FFF6D0" opacity={0.7} />
            </g>
          </g>
        );
      })}
    </g>
  );
};

// ───────── VİTRİN (müze) ─────────
export const Vitrine: React.FC<P & { mode?: "real" | "fake" | "empty" | "swap"; label?: string; z?: [number, number]; night?: boolean; people?: boolean; stamp?: string; stampAt?: number }> = ({ t, a, b, mode = "real", label = "KANATLI DENİZATI BROŞU · MÖ 6. YÜZYIL", z = [1, 1.1], night = false, people = false, stamp, stampAt = 2 }) => {
  const sw = mode === "swap" ? rp(t, a + 1.2, a + 3.6) : 0;
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={z} c0={[960, 560]} k={0.7}>
        <rect width={1920} height={1080} fill={night ? "#05070B" : "#14161C"} />
        {/* duvar panelleri */}
        {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={i * 400 - 20} y={0} width={380} height={760} fill={night ? "#0A0D14" : "#1B1F28"} stroke="#000" strokeOpacity={0.4} />)}
        <rect y={760} width={1920} height={320} fill={night ? "#07090D" : "#101217"} />
        {/* spot ışığı */}
        <path d="M900,0 L1020,0 L1260,780 L660,780Z" fill="url(#kSpot)" opacity={night ? 0.35 : 0.9} />
        {/* kaide */}
        <rect x={700} y={620} width={520} height={360} fill="#1E222B" />
        <rect x={700} y={620} width={520} height={18} fill="#2C313C" />
        {/* cam kutu */}
        <rect x={720} y={240} width={480} height={380} fill="url(#kGlass)" stroke="#9FD4FF" strokeOpacity={0.35} strokeWidth={3} />
        <path d="M740,260 L800,260 L760,600 L740,600Z" fill="#FFF" opacity={0.05} />
        {/* kadife zemin */}
        <rect x={760} y={540} width={400} height={70} fill="#2A1630" />
        {mode !== "empty" && <Brooch x={960 - sw * 260} y={420} s={0.48} t={t} surface={mode === "fake" ? "fake" : "none"} glint={mode === "fake" ? 0.4 : 1} op={1 - sw} />}
        {mode === "swap" && <Brooch x={960 + (1 - sw) * 300} y={420} s={0.48} t={t} surface="fake" glint={0.4} op={sw} />}
        {mode === "swap" && (
          <g transform={`translate(${lp(1320, 1000, rp(t, a + 0.4, a + 1.4)) - sw * 40},${380})`}>
            <path d="M0,0 C40,-20 120,-10 200,0 L520,10 L520,90 L200,80 C120,90 40,80 0,60Z" fill="#202733" />
            <path d="M-40,10 C-50,0 -30,-20 0,-6 L10,60 C-20,70 -50,50 -40,10Z" fill="#E8E8EE" />
          </g>
        )}
        {/* etiket */}
        <rect x={780} y={660} width={360} height={70} fill="#0C0E12" stroke="#3A3F4A" />
        {T(960, 690, label.split("·")[0].trim(), 20, "#E9E4D8", 600, "middle")}
        {T(960, 716, (label.split("·")[1] || "").trim(), 16, X.dim, 500, "middle")}
        {people && [[420, 1.0, 0], [1500, 0.95, 2], [260, 0.85, 4]].map(([px, ps, sd], i) => (
          <g key={i} opacity={0.9}>
            <Person x={px} y={1080} s={ps} t={t} o={i === 0 ? { hairStyle: "short", top: "#2B3340", top2: "#1F2530", kind: "jacket", mustache: true } : i === 1 ? { hairStyle: "bun", top: "#4A3B52", top2: "#38293F", kind: "cardigan" } : { hairStyle: "bald", top: "#3A3A3A", top2: "#2A2A2A", kind: "sweater", glasses: true }} look={i === 1 ? -1 : 1} seed={sd} dir={i === 1 ? -1 : 1} />
          </g>
        ))}
        {night && <rect width={1920} height={1080} fill="#000" opacity={0.25} />}
      </HCam>
      {stamp && <Stamp x={1340} y={330} t={t} at={a + stampAt} s={stamp} />}
    </g>
  );
};

// ───────── BROŞ YAKIN PLAN (koyu kadife üstünde) ─────────
export const BroochHero: React.FC<P & { surface?: "real" | "fake" | "none"; caption?: [string, string?]; loupe?: boolean; stamp?: string; stampAt?: number; bg?: string }> = ({ t, a, b, surface = "none", caption, loupe = false, stamp, stampAt = 2.2, bg = "#120A16" }) => {
  const q = rp(t, a, b);
  const lx = lp(700, 1100, rp(t, a + 0.6, b)), ly = lp(380, 520, rp(t, a + 0.6, b));
  return (
    <g>
      <KDefs />
      <rect width={1920} height={1080} fill={bg} />
      <radialGradient id="kVel" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stopColor="#3A2240" /><stop offset="1" stopColor="#0A050C" /></radialGradient>
      <rect width={1920} height={1080} fill="url(#kVel)" />
      <Dust t={t} n={30} o={0.25} />
      <Brooch x={960} y={500} s={lp(1.05, 1.18, q)} t={t} surface={surface} rot={Math.sin(t * 0.4) * 2} />
      {loupe && (
        <g>
          <clipPath id="kLoupe"><circle cx={lx} cy={ly} r={170} /></clipPath>
          <g clipPath="url(#kLoupe)">
            <rect width={1920} height={1080} fill="#1A0E1E" />
            <g transform={`translate(${lx},${ly}) scale(2.4) translate(${-lx},${-ly})`}><Brooch x={960} y={500} s={lp(1.05, 1.18, q)} t={t} surface={surface} /></g>
          </g>
          <circle cx={lx} cy={ly} r={170} fill="none" stroke="#C9CED6" strokeWidth={16} />
          <path d={`M${lx + 120},${ly + 120} L${lx + 300},${ly + 300}`} stroke="#2A2D33" strokeWidth={44} strokeLinecap="round" />
        </g>
      )}
      {caption && <Label x={80} y={960} k={rp(t, a + 0.4, a + 0.9)} a={caption[0]} b={caption[1]} />}
      {stamp && <Stamp x={1450} y={300} t={t} at={a + stampAt} s={stamp} c={stamp === "GERÇEK" ? "#7BE495" : X.red} />}
    </g>
  );
};

// ───────── TÜMÜLÜS ARAZİSİ (gece/alacakaranlık) ─────────
export const Tumuli: React.FC<P & { night?: boolean; lamp?: boolean; label?: [string, string?]; z?: [number, number] }> = ({ t, a, b, night = true, lamp = false, label, z = [1, 1.12] }) => (
  <g>
    <KDefs />
    <HCam t={t} a={a} b={b} z={z} c0={[960, 600]} c1={lamp ? [1180, 640] : [960, 600]} k={0.6}>
      <rect width={1920} height={1080} fill={night ? "url(#kNight)" : "url(#kDusk)"} />
      {night && <Stars t={t} />}
      <circle cx={1540} cy={180} r={56} fill={night ? "#F2EEDF" : "#FFD9A0"} opacity={night ? 0.9 : 0.6} />
      <circle cx={1540} cy={180} r={160} fill="url(#kLamp)" opacity={0.25} />
      {/* uzak sıradağ */}
      <path d="M0,640 C200,580 420,600 640,560 C860,520 1100,580 1320,540 C1560,500 1760,560 1920,540 L1920,1080 L0,1080Z" fill={night ? "#121A2A" : "#5A4A5E"} />
      {/* tümülüsler */}
      {[[260, 760, 330, 120], [780, 740, 420, 170], [1320, 770, 360, 130], [1700, 790, 260, 90]].map(([cx, cy, rx, ry], i) => (
        <g key={i}><path d={`M${cx - rx},${cy} Q${cx},${cy - ry * 2} ${cx + rx},${cy}Z`} fill={night ? "#1A2236" : "#6E5A52"} /><path d={`M${cx - rx * 0.6},${cy - ry * 0.4} Q${cx},${cy - ry * 1.5} ${cx + rx * 0.3},${cy - ry * 0.9}`} stroke="#FFF" strokeOpacity={0.05} strokeWidth={6} fill="none" /></g>
      ))}
      <rect y={780} width={1920} height={300} fill={night ? "#0C1220" : "#4A3A36"} />
      {/* köy ışıkları */}
      {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={1460 + hash(i) * 400} cy={600 + hash(i + 5) * 30} r={2.5} fill="#FFC870" opacity={0.5 + 0.5 * Math.sin(t * 2 + i)} />)}
      {/* ağaç siluetleri */}
      {[120, 560, 1080, 1860].map((x, i) => <g key={i} transform={`translate(${x},790)`}><rect x={-6} y={-60} width={12} height={60} fill="#06080D" /><ellipse cx={0} cy={-90} rx={46} ry={56} fill="#06080D" /></g>)}
      {lamp && (
        <g transform="translate(1180,700)">
          <circle r={180} fill="url(#kLamp)" opacity={0.65 + 0.15 * Math.sin(t * 9)} />
          <rect x={-8} y={-20} width={16} height={22} fill="#FFD27A" />
          {[0, 1, 2].map((i) => {
            const dig = Math.sin(t * 3 + i * 2);
            return <g key={i} transform={`translate(${-120 + i * 110},40)`}>
              <ellipse cx={0} cy={-70} rx={26} ry={30} fill="#0A0C12" />
              <path d="M-30,-40 L30,-40 L40,40 L-40,40Z" fill="#0A0C12" />
              <path d={`M20,-30 L${70 + dig * 12},${10 + dig * 20}`} stroke="#0A0C12" strokeWidth={10} strokeLinecap="round" />
              <path d={`M${70 + dig * 12},${10 + dig * 20} l26,30`} stroke="#3A3A3A" strokeWidth={8} />
              <path d="M-30,-40 L30,-40" stroke="#FFB45A" strokeOpacity={0.35} strokeWidth={4} />
            </g>;
          })}
        </g>
      )}
    </HCam>
    {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} />}
  </g>
);

// ───────── TÜMÜLÜS KESİTİ (toprak altı + mezar odası + tünel) ─────────
export const TumulusCut: React.FC<P & { dig?: number; blast?: boolean; gold?: boolean; label?: [string, string?]; depth?: boolean }> = ({ t, a, b, dig = 1, blast = false, gold = true, label, depth = false }) => {
  const d = rp(t, a + 0.3, a + 0.3 + (b - a) * 0.7) * dig;
  const tx = lp(260, 820, d), ty = lp(330, 660, d);
  const bl = blast ? rp(t, a + 1.4, a + 2.6) : 0;
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1, 1.08]} c0={[960, 560]} k={0.5}>
        <rect width={1920} height={1080} fill="url(#kNight)" />
        <Stars t={t} n={50} />
        {/* toprak kesiti */}
        <path d="M0,330 L360,330 Q960,-60 1560,330 L1920,330 L1920,1080 L0,1080Z" fill="url(#kSoil)" />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M0,${420 + i * 90} C500,${400 + i * 92} 1400,${440 + i * 88} 1920,${420 + i * 90}`} stroke="#000" strokeOpacity={0.18} strokeWidth={3} fill="none" />)}
        {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={hash(i) * 1920} cy={380 + hash(i + 20) * 680} r={3 + hash(i + 4) * 8} fill="#5E4A36" opacity={0.6} />)}
        {/* mezar odası (taş) */}
        <g transform="translate(960,700)">
          <rect x={-260} y={-150} width={520} height={260} fill="#2A241E" />
          {[0, 1, 2, 3].map((r) => [0, 1, 2, 3, 4].map((c) => <rect key={`${r}${c}`} x={-260 + c * 104 + (r % 2) * 20} y={-150 + r * 65} width={100} height={62} fill="url(#kStone)" opacity={0.9} stroke="#3A332A" strokeWidth={3} />))}
          <rect x={-220} y={-110} width={440} height={190} fill="#120E0A" />
          <rect x={-180} y={10} width={360} height={60} fill="url(#kStone)" />
          {gold && Array.from({ length: 16 }, (_, i) => <circle key={i} cx={-160 + hash(i) * 320} cy={0 - hash(i + 3) * 30} r={6 + hash(i + 8) * 8} fill="url(#kGold)" opacity={0.4 + 0.6 * d} />)}
          {d > 0.92 && <circle r={240} fill="url(#kLamp)" opacity={0.6} />}
        </g>
        {/* tünel */}
        <path d={`M240,330 L${tx},${ty}`} stroke="#0B0806" strokeWidth={70} strokeLinecap="round" />
        <circle cx={tx} cy={ty} r={110} fill="url(#kLamp)" opacity={0.7 + 0.15 * Math.sin(t * 8)} />
        <g transform={`translate(${tx - 40},${ty + 10})`}>
          <ellipse cx={0} cy={-56} rx={20} ry={24} fill="#0A0C12" /><path d="M-24,-34 L24,-34 L30,30 L-30,30Z" fill="#0A0C12" />
          <path d={`M18,-24 L${54 + Math.sin(t * 6) * 10},${-4 + Math.sin(t * 6) * 16}`} stroke="#0A0C12" strokeWidth={9} strokeLinecap="round" />
        </g>
        {/* toprak yığını yüzeyde */}
        <path d={`M120,330 Q200,${330 - 40 * d} 300,330Z`} fill="#5E4A36" />
        {blast && bl > 0 && bl < 1 && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={960 + (hash(i) - 0.5) * 600 * bl} cy={460 - hash(i + 2) * 420 * bl} r={4 + hash(i + 6) * 10} fill="#7A6450" opacity={0.8 * (1 - bl)} />)}
        {blast && bl > 0 && <circle cx={960} cy={520} r={300 * bl} fill="#FF9A3A" opacity={0.18 * (1 - bl)} />}
        {depth && <g opacity={rp(t, a + 1, a + 1.6)}>
          <path d="M1300,330 L1300,620" stroke={X.amber} strokeWidth={4} strokeDasharray="10 8" />
          {T(1330, 490, "≈ 4 metre", 40, X.amber, 700)}
        </g>}
      </HCam>
      {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} />}
    </g>
  );
};

// ───────── MEZAR ODASI İÇİ (fener ışığında altın) ─────────
export const Chamber: React.FC<P & { label?: [string, string?] }> = ({ t, a, b, label }) => {
  const lx = lp(1500, 1180, rp(t, a, a + 2.4));
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1.02, 1.14]} c0={[960, 560]} c1={[900, 600]} k={0.6}>
        <rect width={1920} height={1080} fill="#0B0907" />
        {Array.from({ length: 7 }, (_, r) => Array.from({ length: 9 }, (_, c) => <rect key={`${r}-${c}`} x={c * 230 - (r % 2) * 110} y={r * 150} width={224} height={144} fill="url(#kStone)" opacity={0.28} stroke="#000" strokeOpacity={0.6} strokeWidth={4} />))}
        {/* taş kline */}
        <rect x={520} y={640} width={880} height={90} fill="url(#kStone)" opacity={0.7} />
        <rect x={560} y={730} width={60} height={170} fill="url(#kStone)" opacity={0.6} /><rect x={1300} y={730} width={60} height={170} fill="url(#kStone)" opacity={0.6} />
        {/* altın eşyalar */}
        {Array.from({ length: 22 }, (_, i) => {
          const x = 600 + hash(i + 1) * 720, y = 610 - hash(i + 9) * 40;
          return i % 3 === 0 ? <ellipse key={i} cx={x} cy={y} rx={34} ry={14} fill="url(#kGold)" /> : i % 3 === 1 ? <circle key={i} cx={x} cy={y} r={10} fill="url(#kGold)" /> : <path key={i} d={`M${x - 26},${y} Q${x},${y - 40} ${x + 26},${y}Z`} fill="#B8B0A8" />;
        })}
        <path d="M720,560 C800,520 900,530 980,560" stroke="url(#kGold)" strokeWidth={8} fill="none" />
        {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={720 + i * 23} cy={556 + Math.sin(i / 2) * 14} r={7} fill="url(#kGold)" />)}
        {/* fener ışığı */}
        <circle cx={lx} cy={520} r={520} fill="url(#kLamp)" opacity={0.85 + 0.1 * Math.sin(t * 7)} />
        <g transform={`translate(${lx},520)`}><rect x={-14} y={-30} width={28} height={40} fill="#FFD27A" /><path d="M-18,-30 L18,-30 L0,-60Z" fill="#2A2A2A" /><path d="M0,10 L40,260" stroke="#1A1A1A" strokeWidth={22} strokeLinecap="round" /></g>
        <Dust t={t} n={50} o={0.5} />
      </HCam>
      {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} />}
    </g>
  );
};

// ───────── KÖY ODASI: PAZARLIK (para sayımı) ─────────
export const Deal: React.FC<P & { amount?: string; note?: string }> = ({ t, a, b, amount = "78.000 TL", note = "KİŞİ BAŞI · KAZIYA KATILANIN ANLATIMI" }) => {
  const cnt = rp(t, a + 0.8, b - 0.8);
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 560]} k={0.5}>
        <rect width={1920} height={1080} fill="#1A130D" />
        <rect width={1920} height={700} fill="#2A1F16" />
        <rect x={1380} y={140} width={300} height={240} fill="#0B1424" stroke="#5A4630" strokeWidth={16} />
        <circle cx={1500} cy={220} r={30} fill="#E8E2D0" opacity={0.85} />
        <circle cx={960} cy={300} r={420} fill="url(#kLamp)" opacity={0.55} />
        <path d="M940,0 L940,180" stroke="#222" strokeWidth={4} /><circle cx={940} cy={200} r={22} fill="#FFD9A0" />
        <Person x={520} y={1000} s={1.05} t={t} o={{ hairStyle: "short", hair: "#2A2218", top: "#4A4032", top2: "#3A3226", kind: "sweater", mustache: true, beard: 0.5, skin: "#C8946A" }} arms="desk" look={1} seed={1} lit={0.4} mouth="tight" />
        <Person x={1400} y={1000} s={1.05} t={t} o={{ hairStyle: "short", hair: "#1A1A1A", top: "#2A2E36", top2: "#1E2228", kind: "jacket", mustache: true, glasses: true }} arms="desk" look={-1} dir={-1} seed={4} lit={0.4} talk />
        {/* masa */}
        <rect x={300} y={800} width={1320} height={60} fill="url(#kWood)" />
        <rect x={300} y={860} width={1320} height={220} fill="#2A1D12" />
        {/* para desteleri */}
        {Array.from({ length: Math.round(cnt * 9) }, (_, i) => (
          <g key={i} transform={`translate(${760 + (i % 3) * 140},${780 - Math.floor(i / 3) * 22}) rotate(${(hash(i) - 0.5) * 8})`}>
            <rect x={-60} y={-18} width={120} height={36} rx={3} fill="#8FB59A" stroke="#4E7058" strokeWidth={2} />
            <rect x={-20} y={-18} width={40} height={36} fill="#C9B98A" opacity={0.8} />
          </g>
        ))}
      </HCam>
      <g opacity={rp(t, a + 1.4, a + 1.9)}>
        <rect x={660} y={110} width={600} height={140} rx={10} fill="#05070C" opacity={0.85} />
        {T(960, 205, amount, 80, X.amber, 800, "middle")}
        {T(960, 290, note, 22, X.dim, 600, "middle")}
      </g>
    </g>
  );
};

// ───────── SANDIK (kaçakçılık) ─────────
export const Crates: React.FC<P & { label?: [string, string?] }> = ({ t, a, b, label }) => (
  <g>
    <KDefs />
    <HCam t={t} a={a} b={b} z={[1.02, 1.12]} c0={[960, 560]} c1={[1060, 600]} k={0.6}>
      <rect width={1920} height={1080} fill="#0A0E15" />
      <rect y={760} width={1920} height={320} fill="#11161F" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={i * 420} y={0} width={20} height={760} fill="#141B26" />)}
      <circle cx={960} cy={300} r={600} fill="url(#kLamp)" opacity={0.25} />
      {[[520, 760, 1], [900, 760, 1.2], [1300, 760, 0.95], [700, 560, 0.8], [1100, 520, 0.9]].map(([x, y, s], i) => (
        <g key={i} transform={`translate(${x},${y}) scale(${s})`}>
          <rect x={-160} y={-200} width={320} height={200} fill="url(#kWood)" stroke="#2A1A0C" strokeWidth={5} />
          {[0, 1, 2].map((k) => <rect key={k} x={-160} y={-200 + k * 70} width={320} height={6} fill="#2A1A0C" opacity={0.6} />)}
          <path d="M-160,-200 L160,0 M160,-200 L-160,0" stroke="#2A1A0C" strokeWidth={6} opacity={0.5} />
          <rect x={-70} y={-130} width={140} height={60} fill="#E9E4D8" opacity={0.85} />
          {T(0, -92, ["İZMİR", "AMSTERDAM", "NEW YORK", "İZMİR", "NEW YORK"][i], 18, "#222", 700, "middle")}
        </g>
      ))}
      <Dust t={t} n={30} o={0.3} />
    </HCam>
    {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} />}
  </g>
);

// ───────── MÜZE DEPOSU (yıllar akıyor) ─────────
export const Storage: React.FC<P & { y0?: number; y1?: number; label?: [string, string?] }> = ({ t, a, b, y0 = 1968, y1 = 1984, label }) => {
  const yr = Math.round(lp(y0, y1, rp(t, a + 0.5, b - 0.4)));
  const open = rp(t, a + 0.6, a + 2);
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1, 1.15]} c0={[960, 540]} c1={[960, 600]} k={0.5}>
        <rect width={1920} height={1080} fill="#0B0F16" />
        {Array.from({ length: 5 }, (_, r) => Array.from({ length: 8 }, (_, c) => (
          <g key={`${r}${c}`} transform={`translate(${120 + c * 220},${100 + r * 170})`}>
            <rect width={200} height={150} fill="#1B2330" stroke="#2A3444" strokeWidth={4} />
            <rect x={70} y={64} width={60} height={14} rx={6} fill="#4A5568" />
            <rect x={20} y={20} width={90} height={30} fill="#E9E4D8" opacity={0.15} />
          </g>
        )))}
        {/* açılan çekmece */}
        <g transform={`translate(${780},${100 + 3 * 170 + open * 60})`}>
          <rect width={420} height={170} fill="#222C3A" stroke="#3A4658" strokeWidth={4} />
          <rect x={20} y={20} width={380} height={130} fill="#2A1630" />
          {Array.from({ length: 9 }, (_, i) => <circle key={i} cx={60 + (i % 5) * 75} cy={60 + Math.floor(i / 5) * 50} r={16} fill="url(#kGold)" opacity={open} />)}
        </g>
        <circle cx={990} cy={700} r={360} fill="url(#kLamp)" opacity={0.35 * open} />
        <Dust t={t} n={60} o={0.35} c="#C8D2E0" />
      </HCam>
      <g>
        <rect x={1500} y={70} width={340} height={130} rx={8} fill="#05070C" opacity={0.85} />
        {T(1670, 165, String(yr), 92, X.amber, 800, "middle")}
      </g>
      {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} />}
    </g>
  );
};

// ───────── GAZETECİ MASASI (katalog) ─────────
const ACAR: Look = { hairStyle: "short", hair: "#3A3530", top: "#5A4A3A", top2: "#46382A", kind: "sweater", mustache: true, glasses: true, skin: "#DDB08A" };
export const Desk: React.FC<P & { mode?: "catalog" | "type"; lines?: string[]; label?: [string, string?] }> = ({ t, a, b, mode = "catalog", lines = [], label }) => {
  const flip = rp(t, a + 0.5, a + 1.6);
  const ring = rp(t, a + 2.0, a + 2.8);
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 560]} k={0.5}>
        <rect width={1920} height={1080} fill="#14110E" />
        {/* kitaplık */}
        {Array.from({ length: 4 }, (_, r) => <g key={r}><rect x={0} y={60 + r * 150} width={620} height={12} fill="#3A2A1C" />{Array.from({ length: 16 }, (_, i) => <rect key={i} x={10 + i * 38} y={60 + r * 150 - 100 - hash(r * 20 + i) * 20} width={32} height={100 + hash(r * 20 + i) * 20} fill={["#5A2A22", "#2A3A5A", "#3A4A2A", "#6A5A3A"][(i + r) % 4]} opacity={0.7} />)}</g>)}
        <circle cx={1300} cy={420} r={520} fill="url(#kLamp)" opacity={0.45} />
        <Person x={1450} y={940} s={1.05} t={t} o={ACAR} arms={mode === "type" ? "type" : "desk"} look={-1} lookY={0.6} dir={-1} seed={6} lit={0.5} brow={ring > 0.5 ? "up" : "flat"} eyes={ring > 0.5 ? "wide" : "open"} />
        <rect x={200} y={760} width={1520} height={50} fill="url(#kWood)" />
        <rect x={200} y={810} width={1520} height={270} fill="#2A1D12" />
        {mode === "catalog" ? (
          <g transform="translate(820,700)">
            <rect x={-300} y={-150} width={600} height={170} fill="#E9E4D8" transform="skewX(-12)" />
            <rect x={-300} y={-150} width={300 * (1 - flip) + 2} height={170} fill="#D8D2C2" transform="skewX(-12)" />
            {T(-150, -110, "THE METROPOLITAN", 16, "#333", 700, "middle", { transform: "skewX(-12)" })}
            {[0, 1, 2].map((i) => <g key={i} transform={`translate(${30 + i * 90},-70)`}><circle r={26} fill="url(#kGold)" /><rect x={-36} y={34} width={72} height={6} fill="#999" /></g>)}
            {ring > 0 && <ellipse cx={120} cy={-70} rx={170 * ring} ry={60 * ring} fill="none" stroke={X.red} strokeWidth={6} />}
          </g>
        ) : (
          <g transform="translate(860,640)">
            <rect x={-220} y={60} width={440} height={110} rx={14} fill="#2B2F36" />
            <rect x={-170} y={-200} width={340} height={260} fill="#F4F0E6" />
            {lines.map((l, i) => T(-150, -160 + i * 36, typed(l, rp(t, a + 0.4 + i * 0.9, a + 1.2 + i * 0.9)), 20, "#222", 600))}
          </g>
        )}
        <rect x={1100} y={720} width={40} height={40} fill="#E9E4D8" opacity={0.6} />
      </HCam>
      {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} />}
    </g>
  );
};

// ───────── MAHKEME (New York / Uşak) ─────────
export const Court: React.FC<P & { kind?: "ny" | "tr"; yr0?: number; yr1?: number; verdict?: string; label?: [string, string?] }> = ({ t, a, b, kind = "ny", yr0, yr1, verdict, label }) => {
  const g = Math.max(0, Math.sin((t - a) * 3)) * rp(t, a + 0.6, a + 1);
  const yr = yr0 && yr1 ? Math.round(lp(yr0, yr1, rp(t, a + 0.5, b - 0.5))) : null;
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 520]} k={0.5}>
        <rect width={1920} height={1080} fill={kind === "ny" ? "#1A140E" : "#121418"} />
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 250} y={0} width={230} height={620} fill={kind === "ny" ? "#2A1E14" : "#1C2028"} stroke="#000" strokeOpacity={0.4} strokeWidth={4} />)}
        {/* kürsü */}
        <rect x={560} y={330} width={800} height={300} fill="url(#kWood)" />
        <rect x={560} y={320} width={800} height={24} fill="#7A5638" />
        <Person x={960} y={420} s={0.62} t={t} o={{ hairStyle: kind === "ny" ? "short" : "bald", hair: "#8A8A8A", top: "#0E0E10", top2: "#060608", kind: "jacket", glasses: true }} arms="desk" seed={2} />
        <rect x={560} y={430} width={800} height={200} fill="url(#kWood)" />
        <g transform="translate(600,-20)">{kind === "ny" ? <circle cx={960} cy={160} r={80} fill="#C9A54A" opacity={0.6} /> : <><circle cx={960} cy={160} r={76} fill="#B3121B" /><circle cx={946} cy={160} r={44} fill="#FFF" /><circle cx={962} cy={160} r={36} fill="#B3121B" /><path d="M1000,146 l8,22 -19,-14 h23 l-19,14Z" fill="#FFF" /></>}</g>
        {/* tokmak */}
        <g transform={`translate(1240,${400 - g * 40}) rotate(${-30 + g * 30})`}><rect x={-60} y={-18} width={120} height={36} rx={8} fill="#5A3A22" /><rect x={-8} y={18} width={16} height={90} fill="#5A3A22" /></g>
        {/* taraf masaları */}
        <rect x={160} y={760} width={600} height={40} fill="url(#kWood)" /><rect x={1160} y={760} width={600} height={40} fill="url(#kWood)" />
        {kind === "ny" && <>
          <g transform="translate(460,700)"><rect x={-60} y={-40} width={120} height={80} fill="#E30A17" /><circle cx={-14} cy={0} r={24} fill="#FFF" /><circle cx={-6} cy={0} r={19} fill="#E30A17" /><path d="M14,-8 l5,14 -12,-9 h15 l-12,9Z" fill="#FFF" /></g>
          {T(460, 840, "TÜRKİYE CUMHURİYETİ", 26, "#FFF", 700, "middle")}
          {T(1460, 840, "METROPOLITAN MUSEUM", 26, "#FFF", 700, "middle")}
          {Array.from({ length: 6 }, (_, i) => <rect key={i} x={1300 + i * 40} y={720 - i * 8} width={160} height={30} fill="#E9E4D8" opacity={0.8} />)}
        </>}
      </HCam>
      {yr && <g><rect x={1520} y={70} width={320} height={130} rx={8} fill="#05070C" opacity={0.85} />{T(1680, 165, String(yr), 92, X.amber, 800, "middle")}</g>}
      {verdict && <g opacity={rp(t, a + 1.2, a + 1.7)}><rect x={510} y={880} width={900} height={130} rx={10} fill="#05070C" opacity={0.9} /><rect x={510} y={880} width={8} height={130} fill={X.red} />{T(960, 965, verdict, 64, "#FFF", 800, "middle")}</g>}
      {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} />}
    </g>
  );
};

// ───────── İMZASIZ MEKTUP ─────────
export const Letter: React.FC<P & { to?: string; lines?: string[] }> = ({ t, a, b, to = "UŞAK VALİLİĞİ", lines = ["Sayın Vali,", "Müzede bir şeyler", "yolunda gitmiyor.", "", "(imzasız)"] }) => {
  const env = rp(t, b - 1.6, b - 0.4);
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1.04, 1.16]} c0={[960, 540]} k={0.4}>
        <rect width={1920} height={1080} fill="#16120E" />
        <rect width={1920} height={1080} fill="url(#kWood)" opacity={0.6} />
        <circle cx={960} cy={420} r={700} fill="url(#kLamp)" opacity={0.35} />
        <g transform={`translate(960,${520 + env * 60}) rotate(${-2 + env * 4}) scale(${1 - env * 0.25})`}>
          <rect x={-330} y={-400} width={660} height={800} fill="#000" opacity={0.3} transform="translate(16,20)" />
          <rect x={-330} y={-400} width={660} height={800} fill="#F2EDE0" />
          {Array.from({ length: 18 }, (_, i) => <rect key={i} x={-290} y={-330 + i * 40} width={580} height={1.5} fill="#9AB" opacity={0.35} />)}
          {lines.map((l, i) => T(-270, -280 + i * 64, typed(l, rp(t, a + 0.3 + i * 0.6, a + 0.9 + i * 0.6)), 42, "#1A2A4A", 500, "start", { fontFamily: "Courier New", fontStyle: "italic" }))}
        </g>
        {env > 0 && <g transform={`translate(960,${700 - (1 - env) * 300})`} opacity={env}>
          <rect x={-380} y={-120} width={760} height={330} fill="#D9CDB4" stroke="#A89878" strokeWidth={3} />
          <path d="M-380,-120 L0,80 L380,-120" fill="none" stroke="#A89878" strokeWidth={3} />
          {T(0, 150, to, 40, "#2A2A2A", 700, "middle")}
        </g>}
      </HCam>
      <Tag x={80} y={110} k={rp(t, a + 0.3, a + 0.7)} s="İHBAR · 2005 SONU" />
    </g>
  );
};

// ───────── DÖKÜM vs DÖVME ─────────
export const CastVsWrought: React.FC<P> = ({ t, a, b }) => {
  const pour = rp(t, a + 0.4, a + 2.4);
  const hit = Math.max(0, Math.sin((t - a) * 7));
  return (
    <g>
      <KDefs />
      <rect width={1920} height={1080} fill="#0A0B0F" />
      <rect x={958} y={0} width={4} height={1080} fill="#2A2F3A" />
      {/* SOL: döküm */}
      <g>
        <circle cx={480} cy={560} r={420} fill="url(#kLamp)" opacity={0.35} />
        <g transform={`translate(420,300) rotate(${lp(0, 55, pour)})`}><path d="M-80,-60 L80,-60 L60,60 L-60,60Z" fill="#4A4A50" /><ellipse cx={0} cy={-60} rx={80} ry={16} fill="#FF9A3A" /></g>
        {pour > 0.2 && <path d={`M470,330 C480,420 470,520 480,${lp(520, 640, pour)}`} stroke="#FFB45A" strokeWidth={18} fill="none" strokeLinecap="round" />}
        <rect x={340} y={640} width={280} height={120} fill="#3A3A40" />
        <path d="M400,650 C440,640 520,640 560,650 L540,700 L420,700Z" fill={pour > 0.7 ? "url(#kGold)" : "#1A1A1E"} />
        {Array.from({ length: 14 }, (_, i) => <circle key={i} cx={410 + hash(i) * 140} cy={660 + hash(i + 4) * 30} r={2 + hash(i + 7) * 4} fill="#5A3C10" opacity={pour > 0.8 ? 0.8 : 0} />)}
        {T(480, 880, "DÖKÜM", 72, "#FFF", 800, "middle")}
        {T(480, 930, "erimiş altın kalıba dökülür", 26, X.dim, 500, "middle")}
        {T(480, 975, "→ SAHTE BROŞ", 30, X.red, 800, "middle")}
      </g>
      {/* SAĞ: dövme */}
      <g>
        <circle cx={1440} cy={560} r={420} fill="url(#kLamp)" opacity={0.3} />
        <rect x={1240} y={640} width={400} height={60} fill="#2A2A30" />
        <path d="M1320,630 C1380,610 1500,610 1560,630 L1560,640 L1320,640Z" fill="url(#kGold)" />
        {Array.from({ length: 16 }, (_, i) => <ellipse key={i} cx={1330 + hash(i + 2) * 220} cy={626 + hash(i + 9) * 8} rx={8} ry={3} fill="#FFF3C4" opacity={0.6} />)}
        <g transform={`translate(1500,${520 - hit * 90}) rotate(${-20 + hit * 25})`}><rect x={-70} y={-30} width={140} height={60} rx={6} fill="#5A5A62" /><rect x={-8} y={30} width={16} height={200} fill="#6B4A2E" /></g>
        {hit > 0.95 && Array.from({ length: 8 }, (_, i) => <circle key={i} cx={1440 + (hash(i) - 0.5) * 120} cy={610 - hash(i + 1) * 60} r={3} fill="#FFD27A" />)}
        {T(1440, 880, "DÖVME", 72, "#FFF", 800, "middle")}
        {T(1440, 930, "altın çekiçle, elle şekillenir", 26, X.dim, 500, "middle")}
        {T(1440, 975, "→ GERÇEK BROŞ", 30, "#7BE495", 800, "middle")}
      </g>
    </g>
  );
};

// ───────── MÜHÜRLÜ KUTU (dönüş) ─────────
export const SealedBox: React.FC<P & { label?: [string, string?] }> = ({ t, a, b, label }) => {
  const open = rp(t, a + 1.6, a + 3.2);
  return (
    <g>
      <KDefs />
      <HCam t={t} a={a} b={b} z={[1, 1.15]} c0={[960, 560]} k={0.4}>
        <rect width={1920} height={1080} fill="#0C0E13" />
        <circle cx={960} cy={560} r={560} fill="url(#kLamp)" opacity={0.25 + open * 0.35} />
        <rect x={560} y={560} width={800} height={340} fill="#1E2430" stroke="#3A4456" strokeWidth={6} />
        <g transform={`translate(560,${560 - open * 120}) rotate(${-open * 8})`}><rect width={800} height={60} fill="#2A3242" stroke="#3A4456" strokeWidth={6} /></g>
        <g opacity={1 - open}><circle cx={960} cy={590} r={46} fill="#9A1B1B" /><circle cx={960} cy={590} r={30} fill="none" stroke="#C83A3A" strokeWidth={4} />{T(960, 600, "TC", 26, "#F0D0D0", 800, "middle")}</g>
        {open > 0.3 && <Brooch x={960} y={520} s={0.42} t={t} op={rp(t, a + 2.2, a + 3.2)} />}
      </HCam>
      {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} />}
    </g>
  );
};

// ───────── MÜDÜR (gece ofisi, borç kâğıtları) ─────────
const MUDUR: Look = { hairStyle: "short", hair: "#2A2420", top: "#2C3340", top2: "#202631", kind: "shirt", mustache: true, skin: "#D8A47E" };
export const Office: React.FC<P & { mode?: "work" | "debt" | "phone"; label?: [string, string?] }> = ({ t, a, b, mode = "work", label }) => (
  <g>
    <KDefs />
    <HCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 560]} k={0.5}>
      <rect width={1920} height={1080} fill="#101318" />
      <rect x={1300} y={120} width={420} height={320} fill="#0A1220" stroke="#2A3240" strokeWidth={14} />
      {[0, 1, 2].map((i) => <rect key={i} x={1320 + i * 130} y={140} width={4} height={280} fill="#2A3240" />)}
      <rect x={160} y={140} width={300} height={220} fill="#E9E4D8" opacity={0.1} />
      {T(310, 260, "UŞAK MÜZESİ", 22, "#E9E4D8", 700, "middle", { opacity: 0.5 })}
      <circle cx={760} cy={560} r={460} fill="url(#kLamp)" opacity={0.4} />
      <Person x={900} y={960} s={1.1} t={t} o={MUDUR} arms={mode === "phone" ? "phone" : mode === "debt" ? "chin" : "desk"} look={mode === "debt" ? 0.3 : -0.4} lookY={0.5} seed={8} lit={0.5} brow={mode === "debt" ? "worry" : "flat"} mouth={mode === "debt" ? "tight" : "flat"} />
      <rect x={200} y={780} width={1520} height={50} fill="url(#kWood)" />
      <rect x={200} y={830} width={1520} height={250} fill="#2A1D12" />
      {mode === "debt" && Array.from({ length: 6 }, (_, i) => (
        <g key={i} transform={`translate(${520 + i * 150},${740 - (i % 2) * 20}) rotate(${(hash(i) - 0.5) * 20})`} opacity={rp(t, a + 0.3 + i * 0.25, a + 0.6 + i * 0.25)}>
          <rect x={-70} y={-50} width={140} height={100} fill="#F2EDE0" />
          {T(0, -10, "BORÇ", 22, X.red, 800, "middle")}
          {[0, 1, 2].map((k) => <rect key={k} x={-50} y={10 + k * 12} width={100} height={4} fill="#999" />)}
        </g>
      ))}
    </HCam>
    {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} />}
  </g>
);

// ───────── KOMİSYON (vitrin önünde uzmanlar) ─────────
export const Commission: React.FC<P & { verdict?: boolean }> = ({ t, a, b, verdict = false }) => (
  <g>
    <KDefs />
    <HCam t={t} a={a} b={b} z={[1, 1.12]} c0={[960, 560]} c1={[1000, 520]} k={0.5}>
      <rect width={1920} height={1080} fill="#15181F" />
      {[0, 1, 2, 3, 4].map((i) => <rect key={i} x={i * 400 - 20} y={0} width={380} height={760} fill="#1C2029" stroke="#000" strokeOpacity={0.4} />)}
      <path d="M880,0 L1040,0 L1200,760 L720,760Z" fill="url(#kSpot)" opacity={0.8} />
      <rect x={760} y={520} width={400} height={440} fill="#1E222B" />
      <rect x={780} y={250} width={360} height={270} fill="url(#kGlass)" stroke="#9FD4FF" strokeOpacity={0.35} strokeWidth={3} />
      <Brooch x={960} y={400} s={0.36} t={t} surface="fake" glint={0.3} />
      <Person x={480} y={1060} s={1.0} t={t} o={{ hairStyle: "short", hair: "#5A5048", top: "#2A3A4E", top2: "#1E2A3A", kind: "jacket", glasses: true }} arms="hold" look={1} seed={3} talk={verdict} brow={verdict ? "worry" : "flat"} hold={<g><circle cx={0} cy={-20} r={34} fill="none" stroke="#C9CED6" strokeWidth={8} /><rect x={-4} y={14} width={8} height={50} fill="#2A2D33" /></g>} />
      <Person x={1440} y={1060} s={1.0} t={t} o={{ hairStyle: "bun", hair: "#3A2418", top: "#4A3A52", top2: "#38293F", kind: "cardigan", glasses: true }} arms="cross" look={-1} dir={-1} seed={5} brow={verdict ? "up" : "flat"} mouth={verdict ? "o" : "flat"} />
      <Person x={1700} y={1080} s={0.9} t={t} o={{ hairStyle: "bald", top: "#2A2E36", top2: "#1E2228", kind: "jacket", mustache: true }} arms="down" look={-1} dir={-1} seed={9} />
    </HCam>
    {verdict && <Stamp x={1180} y={300} t={t} at={a + 1.4} s="SAHTE" />}
  </g>
);

// ───────── LİDYA (Sardes, Paktolos, sikke) ─────────
export const Lydia: React.FC<P & { label?: [string, string?] }> = ({ t, a, b, label }) => (
  <g>
    <KDefs />
    <HCam t={t} a={a} b={b} z={[1, 1.12]} c0={[960, 560]} c1={[860, 600]} k={0.5}>
      <rect width={1920} height={1080} fill="url(#kDusk)" />
      <path d="M0,520 C300,380 520,460 760,380 C1000,300 1300,420 1600,360 L1920,400 L1920,1080 L0,1080Z" fill="#5A4458" />
      <path d="M0,640 C400,580 800,640 1200,600 C1500,570 1700,620 1920,600 L1920,1080 L0,1080Z" fill="#3A3040" />
      {/* tapınak sütunları */}
      <g transform="translate(1260,600)">{Array.from({ length: 6 }, (_, i) => <g key={i}><rect x={i * 70} y={-260} width={36} height={260} fill="#D8CDB8" /><rect x={i * 70 - 8} y={-272} width={52} height={14} fill="#CBBFA8" /></g>)}<path d="M-30,-272 L400,-272 L185,-360Z" fill="#CBBFA8" /></g>
      {/* Paktolos çayı + altın pırıltı */}
      <path d="M0,860 C300,800 600,900 960,840 C1300,780 1600,880 1920,820 L1920,940 C1600,1000 1300,900 960,960 C600,1020 300,920 0,980Z" fill="#2E4A66" />
      {Array.from({ length: 50 }, (_, i) => <circle key={i} cx={(hash(i) * 1920 + t * 40) % 1920} cy={860 + hash(i + 3) * 90} r={2 + hash(i + 5) * 3} fill={GOLD3} opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 3 + i))} />)}
    </HCam>
    {label && <Label x={80} y={980} k={rp(t, a + 0.4, a + 0.9)} a={label[0]} b={label[1]} />}
  </g>
);

// ───────── EFSANE (lanet): sisli tepe + söylenti kartları ─────────
export const Legend: React.FC<P & { items?: string[] }> = ({ t, a, b, items = [] }) => (
  <g>
    <KDefs />
    <HCam t={t} a={a} b={b} z={[1.02, 1.12]} c0={[960, 600]} k={0.5}>
      <rect width={1920} height={1080} fill="url(#kNight)" />
      <Stars t={t} n={40} />
      <path d="M200,820 Q960,240 1720,820Z" fill="#141B2A" />
      <rect y={800} width={1920} height={280} fill="#0B0F18" />
      {Array.from({ length: 6 }, (_, i) => <ellipse key={i} cx={((i * 400 + t * (20 + i * 6)) % 2400) - 240} cy={760 + (i % 3) * 40} rx={420} ry={60} fill="#AFC0D8" opacity={0.07} filter="url(#kBlur)" />)}
    </HCam>
    {items.map((s, i) => {
      const k = rp(t, a + 0.6 + i * 0.9, a + 1.0 + i * 0.9);
      return <g key={i} opacity={k} transform={`translate(${200 + (i % 2) * 820},${220 + Math.floor(i / 2) * 170})`}>
        <rect width={700} height={120} rx={8} fill="#05070C" opacity={0.85} />
        {T(30, 74, s, 36, "#EDEFF2", 700)}
        <Tag x={480} y={40} k={1} s="SÖYLENTİ" c={X.red} size={20} />
      </g>;
    })}
  </g>
);

// ───────── SAYI KARTI (koyu, altın) ─────────
export const GoldNumber: React.FC<P & { to: number; label: string; prefix?: string; suffix?: string }> = ({ t, a, b, to, label, prefix = "", suffix = "" }) => {
  const v = Math.round(lp(0, to, rp(t, a + 0.3, a + 1.6)));
  return (
    <g>
      <KDefs />
      <rect width={1920} height={1080} fill="#08090D" />
      <circle cx={960} cy={500} r={520} fill="url(#kLamp)" opacity={0.25} />
      <Dust t={t} n={40} o={0.4} />
      {T(960, 560, `${prefix}${v.toLocaleString("tr-TR")}${suffix}`, 200, "url(#kGold)" as unknown as string, 800, "middle")}
      {T(960, 660, label, 40, "#EDEFF2", 600, "middle")}
    </g>
  );
};

// ───────── ÜÇ HIRSIZLIK (yol haritası kartı) ─────────
export const ThreeThefts: React.FC<P & { hi?: number }> = ({ t, a, b, hi = -1 }) => {
  const items: [string, string, string][] = [["1", "TOPRAĞIN ALTINDAN", "1965–1968 · Güre"], ["2", "ÜLKEMİZDEN", "1967–1968 · New York"], ["3", "KENDİ MÜZESİNDEN", "2005 · Uşak"]];
  return (
    <g>
      <KDefs />
      <rect width={1920} height={1080} fill="#08090D" />
      <circle cx={960} cy={540} r={700} fill="url(#kLamp)" opacity={0.12} />
      {T(960, 200, "BU HAZİNE ÜÇ KEZ ÇALINDI", 64, "#FFF", 800, "middle")}
      {items.map(([n, s1, s2], i) => {
        const k = rp(t, a + 0.5 + i * 0.6, a + 0.9 + i * 0.6);
        const on = hi === i;
        return <g key={i} opacity={k * (hi >= 0 && !on ? 0.35 : 1)} transform={`translate(${210 + i * 520},${330 + (1 - k) * 30})`}>
          <rect width={460} height={480} rx={12} fill="#0F131B" stroke={on ? X.amber : "#2A3240"} strokeWidth={on ? 6 : 3} />
          {T(230, 200, n, 160, on ? X.amber : "#3A4456", 800, "middle")}
          {T(230, 320, s1, 34, "#FFF", 800, "middle")}
          {T(230, 380, s2, 26, X.dim, 500, "middle")}
        </g>;
      })}
    </g>
  );
};

export { KDefs as KaronDefs };
