import React from "react";
import { hash, gait } from "./Motion";
import { rp, lp, cl } from "./Hayat";
import { X, T, Sil, Screen, Code, typed, Pose } from "./Protokol";

// Kanal 5 · Protokol X · mekânlar ve analojiler (2026-11-17, k7-01 için kuruldu, sonraki dosyalar da kullanır).
const md = (v: number, m: number) => ((v % m) + m) % m;

// ───────── DÜNYA HARİTASI (noktalı) ─────────
export const geo = (lon: number, lat: number): [number, number] => [60 + ((lon + 170) / 350) * 1800, 40 + ((80 - lat) / 140) * 1000];
const poly = (pts: [number, number][]) => "M" + pts.map(([lo, la]) => geo(lo, la).map((v) => v.toFixed(0)).join(",")).join(" L") + "Z";
const LAND = [
  [[-165, 66], [-140, 70], [-95, 73], [-78, 64], [-62, 52], [-70, 44], [-76, 35], [-81, 26], [-90, 29], [-97, 26], [-98, 18], [-88, 15], [-80, 8], [-92, 15], [-106, 22], [-112, 30], [-118, 33], [-124, 41], [-125, 49], [-135, 58], [-152, 59], [-166, 60]],
  [[-55, 60], [-20, 70], [-25, 80], [-60, 80], [-72, 77]],
  [[-80, 9], [-62, 10], [-50, 2], [-35, -6], [-40, -22], [-48, -28], [-58, -38], [-66, -55], [-73, -48], [-72, -30], [-71, -18], [-81, -5]],
  [[-10, 36], [-9, 43], [-2, 47], [-4, 48], [5, 53], [8, 57], [5, 62], [14, 68], [28, 71], [41, 67], [44, 46], [36, 45], [29, 41], [26, 38], [22, 37], [19, 42], [13, 45], [12, 38], [8, 44], [3, 43], [-1, 37]],
  [[-5, 50], [1, 51], [0, 53], [-2, 56], [-5, 58], [-6, 55], [-4, 53]],
  [[-17, 21], [-6, 36], [10, 37], [20, 32], [32, 31], [35, 28], [43, 12], [51, 12], [42, -2], [40, -16], [35, -25], [20, -35], [15, -27], [12, -15], [9, 3], [-8, 5], [-17, 14]],
  [[35, 32], [43, 13], [53, 16], [59, 22], [56, 26], [48, 30], [44, 37], [36, 37]],
  [[36, 37], [44, 37], [44, 46], [41, 67], [70, 73], [105, 78], [140, 73], [180, 69], [178, 63], [160, 60], [142, 52], [135, 43], [128, 38], [126, 35], [121, 31], [121, 23], [110, 20], [108, 12], [104, 9], [100, 3], [98, 15], [92, 22], [88, 22], [80, 8], [77, 8], [72, 21], [66, 25], [57, 26], [52, 30], [48, 30], [44, 37]],
  [[130, 31], [140, 35], [142, 41], [141, 45], [139, 40], [133, 34]],
  [[95, 5], [106, -6], [116, -8], [125, -8], [119, -1], [109, 2], [100, 2]],
  [[113, -22], [122, -17], [130, -12], [137, -12], [142, -11], [146, -19], [153, -28], [150, -37], [141, -38], [135, -34], [126, -32], [115, -34]],
  [[166, -46], [174, -36], [178, -38], [170, -46]],
] as [number, number][][];
export const HITS: [string, number, number, number][] = [
  ["TAYVAN", 121, 24, 0], ["HİNDİSTAN", 77, 22, 0.08], ["RUSYA", 37, 55, 0.12], ["UKRAYNA", 30, 50, 0.18], ["ÇİN", 110, 32, 0.22],
  ["İSPANYA", -3, 40, 0.3], ["İNGİLTERE", -1, 52, 0.36], ["ALMANYA", 10, 51, 0.42], ["FRANSA", 2, 47, 0.46], ["ABD", -90, 38, 0.55], ["JAPONYA", 139, 36, 0.6], ["BREZİLYA", -47, -15, 0.68],
];
export const WorldMap: React.FC<{ t: number; a: number; spread?: number; dur?: number; stop?: number; labels?: boolean; focus?: [number, number]; crowd?: number }> = ({ t, a, spread = 1, dur = 8, stop, labels = true, crowd = 220 }) => {
  const k = cl((t - a) / dur) * spread;
  const halted = stop !== undefined && t > stop;
  return (
    <g>
      <rect width={1920} height={1080} fill="#06090F" />
      <rect width={1920} height={1080} fill="url(#pGrid)" />
      {LAND.map((p, i) => <path key={i} d={poly(p)} fill="url(#pDots)" />)}
      {LAND.map((p, i) => <path key={`o${i}`} d={poly(p)} fill="none" stroke="#2A3850" strokeWidth={1.5} opacity={0.6} />)}
      {Array.from({ length: crowd }, (_, i) => {
        const h = HITS[i % HITS.length];
        const at = h[3] + 0.1 + hash(i * 3.3) * 0.85;
        if (k < at) return null;
        const [x, y] = geo(h[1] + (hash(i) - 0.5) * (i < HITS.length ? 0 : 40), h[2] + (hash(i * 7) - 0.5) * (i < HITS.length ? 0 : 22));
        const pul = 0.5 + 0.5 * Math.sin(t * 4 + i);
        return <g key={i}><circle cx={x} cy={y} r={halted ? 4 : 5 + pul * 3} fill={halted ? X.amber : X.red} opacity={halted ? 0.55 : 0.85} /></g>;
      })}
      {HITS.map(([n, lo, la, at], i) => {
        if (k < at) return null;
        const [x, y] = geo(lo, la);
        const q = cl((k - at) * 6);
        const ring = md(t * 0.8 + i * 0.3, 1);
        return (
          <g key={n}>
            <circle cx={x} cy={y} r={60 * ring} fill="none" stroke={halted ? X.amber : X.red} strokeWidth={3} opacity={(1 - ring) * 0.8} />
            <circle cx={x} cy={y} r={10 * q} fill={halted ? X.amber : X.red} />
            {labels && <g opacity={q}><rect x={x + 16} y={y - 40} width={n.length * 17 + 24} height={36} rx={6} fill="#0B0F15" opacity={0.85} />{T(x + 28, y - 14, n, 24, halted ? X.amber : "#FFD0D0", 700)}</g>}
          </g>
        );
      })}
      {Array.from({ length: 14 }, (_, i) => {
        const h1 = HITS[i % HITS.length], h2 = HITS[(i * 5 + 3) % HITS.length];
        const st = Math.max(h1[3], h2[3]) + 0.05;
        if (k < st || halted) return null;
        const [x1, y1] = geo(h1[1], h1[2]); const [x2, y2] = geo(h2[1], h2[2]);
        const q = md(t * 0.5 + i * 0.17, 1);
        const mx = (x1 + x2) / 2, my = Math.min(y1, y2) - 160;
        const px = (1 - q) ** 2 * x1 + 2 * (1 - q) * q * mx + q * q * x2, py = (1 - q) ** 2 * y1 + 2 * (1 - q) * q * my + q * q * y2;
        return <g key={`arc${i}`}><path d={`M${x1},${y1} Q${mx},${my} ${x2},${y2}`} stroke={X.red} strokeWidth={1.5} fill="none" opacity={0.25} /><circle cx={px} cy={py} r={5} fill="#FF9A9A" /></g>;
      })}
    </g>
  );
};

// ───────── İLFRAKUM · sahil kasabası ─────────
export const Town: React.FC<{ t: number; mode?: "dusk" | "night" | "day"; focus?: number; press?: boolean }> = ({ t, mode = "dusk", focus = 0 }) => {
  const sky = mode === "night" ? "url(#pSkyN)" : mode === "day" ? "url(#pSkyD)" : "url(#pSky)";
  const lit = mode !== "day";
  return (
    <g>
      <rect width={1920} height={1080} fill={sky} />
      {mode === "night" && Array.from({ length: 60 }, (_, i) => <circle key={i} cx={hash(i) * 1920} cy={hash(i + 9) * 420} r={1 + hash(i * 3) * 1.6} fill="#FFF" opacity={0.3 + 0.4 * Math.sin(t * 2 + i)} />)}
      {mode !== "night" && <circle cx={1500} cy={mode === "day" ? 160 : 520} r={mode === "day" ? 60 : 90} fill={mode === "day" ? "#FFF7DD" : "#FFB36B"} opacity={0.9} />}
      <path d="M0,520 Q300,430 620,500 Q900,560 1200,470 Q1500,380 1920,470 L1920,1080 L0,1080Z" fill={mode === "day" ? "#3E5A3C" : "#141C24"} />
      {/* Lantern Hill feneri */}
      <path d="M1380,560 Q1500,400 1680,470 Q1800,520 1900,640 L1380,700Z" fill={mode === "day" ? "#4C6A44" : "#18222C"} />
      <g transform="translate(1600,430)"><rect x={-40} y={0} width={80} height={70} fill={mode === "day" ? "#D8D2C4" : "#2A3038"} /><path d="M-48,0 L0,-40 L48,0Z" fill={mode === "day" ? "#6B5B4B" : "#1B2027"} /><rect x={-12} y={-70} width={24} height={34} fill={lit ? X.amber : "#BBB"} opacity={lit ? 0.6 + 0.4 * Math.sin(t * 3) : 1} />{lit && <circle cx={0} cy={-54} r={60} fill="url(#pGlowA)" />}</g>
      {/* evler: tepeye dizili */}
      {Array.from({ length: 46 }, (_, i) => {
        const row = Math.floor(i / 12), col = i % 12;
        const x = 80 + col * 105 + row * 40 + (hash(i) - 0.5) * 20;
        const y = 560 + row * 95 - Math.sin(col * 0.5) * 40;
        const pal = ["#B9A48A", "#8FA3A6", "#C7B79A", "#9E8C80", "#A7B5A0", "#C2A28A"][i % 6];
        const isHim = i === 27;
        const w = 90, h = 80;
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} fill={mode === "day" ? pal : "#1C2430"} />
            <path d={`M${x - 6},${y} L${x + w / 2},${y - 34} L${x + w + 6},${y}Z`} fill={mode === "day" ? "#5A4A42" : "#11171F"} />
            {[0, 1].map((j) => { const on = lit && (hash(i * 5 + j) > 0.45 || isHim); return <rect key={j} x={x + 14 + j * 40} y={y + 22} width={22} height={30} fill={isHim && focus > 0 ? X.cyan : on ? "#FFCF7A" : mode === "day" ? "#5E6E7A" : "#0C1016"} opacity={on ? 0.85 : 1} />; })}
            {isHim && focus > 0 && <circle cx={x + 25} cy={y + 37} r={90 * focus} fill="url(#pGlowC)" />}
          </g>
        );
      })}
      {/* liman + deniz */}
      <rect x={0} y={880} width={1920} height={200} fill="url(#pSea)" />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${md(i * 300 - t * 30, 2200) - 150},${910 + i * 20} q40,-8 80,0 t80,0`} stroke="#6E8CA8" strokeWidth={2} fill="none" opacity={0.35} />)}
      <path d="M0,880 L700,880 L760,850 L1100,850" stroke={mode === "day" ? "#7D7468" : "#232B35"} strokeWidth={22} fill="none" />
      {[0, 1, 2, 3].map((i) => { const bx = 300 + i * 260, by = 925 + Math.sin(t * 1.4 + i) * 5; return <g key={i} transform={`translate(${bx},${by}) rotate(${Math.sin(t * 1.1 + i) * 3})`}><path d="M-60,0 L60,0 L44,26 L-44,26Z" fill={mode === "day" ? "#E8E4DA" : "#2B333E"} /><rect x={-2} y={-80} width={4} height={80} fill="#5A5A5A" /></g>; })}
      {/* martılar */}
      {Array.from({ length: 6 }, (_, i) => { const gx = md(i * 410 + t * (40 + i * 6), 2300) - 200, gy = 200 + i * 40 + Math.sin(t + i) * 20, f = Math.sin(t * 6 + i) * 10; return <path key={i} d={`M${gx - 22},${gy + f * 0.5} Q${gx - 10},${gy - 8} ${gx},${gy} Q${gx + 10},${gy - 8} ${gx + 22},${gy + f * 0.5}`} stroke={mode === "night" ? "#8A96A8" : "#F2F2F2"} strokeWidth={3} fill="none" />; })}
    </g>
  );
};

// ───────── YATAK ODASI · arkadan, masa başında ─────────
export const Room: React.FC<{ t: number; main?: React.ReactNode; left?: React.ReactNode; right?: React.ReactNode; mode?: "day" | "dusk" | "night"; pose?: Pose; person?: boolean; crt?: boolean; red?: number; glow?: string; teen?: boolean; phone?: number }> = ({ t, main, left, right, mode = "dusk", pose = "type", person = true, crt = false, red = 0, glow = X.cyan, teen = false, phone = 0 }) => {
  const night = mode === "night";
  const wall = night ? "#0E141D" : "#18202B";
  return (
    <g>
      <rect width={1920} height={1080} fill={wall} />
      <rect width={1920} height={1080} fill="url(#pGrid)" opacity={0.4} />
      {/* pencere + deniz */}
      <g>
        <rect x={70} y={150} width={420} height={470} fill={night ? "url(#pSkyN)" : mode === "day" ? "url(#pSkyD)" : "url(#pSky)"} />
        <rect x={70} y={470} width={420} height={150} fill="url(#pSea)" />
        {[0, 1, 2].map((i) => <path key={i} d={`M${70 + md(i * 140 - t * 20, 480)},${500 + i * 30} q20,-5 40,0`} stroke="#8AA6C0" strokeWidth={2} fill="none" opacity={0.4} />)}
        {Array.from({ length: 2 }, (_, i) => { const gx = 70 + md(i * 200 + t * 30, 420), gy = 260 + i * 60; return <path key={i} d={`M${gx - 12},${gy} Q${gx},${gy - 7} ${gx + 12},${gy}`} stroke="#EEE" strokeWidth={2.5} fill="none" />; })}
        <rect x={60} y={140} width={440} height={490} fill="none" stroke="#2A2F38" strokeWidth={20} />
        <line x1={280} y1={150} x2={280} y2={620} stroke="#2A2F38" strokeWidth={12} />
        <path d={`M40,120 L${150 + Math.sin(t * 0.8) * 8},120 Q${140 + Math.sin(t) * 10},380 ${120 + Math.sin(t * 0.9) * 12},660 L40,660Z`} fill="#3A2E3A" opacity={0.9} />
      </g>
      {/* raf + posterler */}
      <rect x={620} y={180} width={300} height={14} fill="#2B2420" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={630 + i * 30} y={110 + (i % 3) * 8} width={24} height={70 - (i % 3) * 8} fill={["#5B3A3A", "#2F4858", "#6B5B3E", "#3E4E3E"][i % 4]} />)}
      <rect x={1540} y={140} width={220} height={300} fill="#1F2733" stroke="#2E3846" strokeWidth={6} />
      {T(1650, 300, teen ? "LEVEL 99" : "</>", 60, X.cyan2, 700, "middle")}
      {/* masa */}
      <rect x={300} y={700} width={1340} height={34} fill="#2A2420" />
      <rect x={330} y={734} width={30} height={346} fill="#211B18" /><rect x={1580} y={734} width={30} height={346} fill="#211B18" />
      {/* monitörler */}
      {crt ? (
        <g>
          <rect x={700} y={360} width={540} height={360} rx={30} fill="#BDB7A8" />
          <Screen x={740} y={390} w={460} h={300} glow={glow}>{main ?? <Code t={t} />}</Screen>
          <rect x={860} y={700} width={220} height={20} fill="#9E998C" />
        </g>
      ) : (
        <g>
          <Screen x={360} y={400} w={380} h={240} glow={glow} tilt={3}>{left ?? <Code t={t + 4} scroll={0.5} />}</Screen>
          <Screen x={1240} y={400} w={360} h={240} glow={glow} tilt={-3}>{right ?? <Code t={t + 9} scroll={0.7} />}</Screen>
          <Screen x={770} y={320} w={440} h={300} glow={red > 0.5 ? X.red : glow}>{main ?? <Code t={t} />}</Screen>
          {[970, 540, 1420].map((x, i) => <rect key={i} x={x - 30} y={i === 0 ? 630 : 650} width={60} height={60} fill="#0A0D12" />)}
        </g>
      )}
      {/* masa üstü eşyalar */}
      <rect x={760} y={680} width={420} height={24} rx={6} fill="#0B0F15" />
      <g transform="translate(1290,640)"><rect x={0} y={0} width={46} height={60} rx={6} fill="#C9C2B4" /><path d="M46,14 q24,0 24,20 q0,20 -24,20" stroke="#C9C2B4" strokeWidth={8} fill="none" />{Array.from({ length: 3 }, (_, i) => <path key={i} d={`M${12 + i * 12},-6 q-8,-20 0,-40`} stroke="#FFF" strokeWidth={3} fill="none" opacity={0.2 + 0.15 * Math.sin(t * 2 + i)} transform={`translate(0,${-md(t * 12 + i * 10, 30)})`} />)}</g>
      <g transform="translate(400,560)"><path d="M0,140 L40,0 L120,-20" stroke="#3A3A3A" strokeWidth={10} fill="none" /><path d="M100,-40 L160,-10 L120,20Z" fill="#3A3A3A" /><circle cx={140} cy={10} r={80} fill="url(#pGlowW)" opacity={night ? 0.8 : 0.4} /></g>
      {[1430, 1470].map((x, i) => <rect key={i} x={x} y={650 + i * 6} width={26} height={50 - i * 6} rx={5} fill={["#2D6B4F", "#8A2E2E"][i]} />)}
      {/* yatak köşesi */}
      <path d="M1640,860 L1920,820 L1920,1080 L1600,1080Z" fill="#26303E" />
      <path d="M1660,860 Q1780,820 1920,840 L1920,900 Q1780,880 1660,900Z" fill="#3B4658" />
      {/* kişi (arkadan) */}
      {person && <Sil x={980} y={1110} s={1.5} t={t} kind={teen ? "teen" : "hood"} pose={pose} back hair="curly" rim={red > 0.5 ? X.red : glow} seed={3} />}
      {phone > 0 && <g transform="translate(1180,760)" opacity={phone}><rect x={-60} y={-110} width={120} height={220} rx={16} fill="#0B0F15" /><rect x={-52} y={-100} width={104} height={190} rx={10} fill={X.red} opacity={0.85} />{T(0, -40, "SON", 22, "#FFF", 700, "middle")}{T(0, -10, "DAKİKA", 22, "#FFF", 700, "middle")}</g>}
      {/* ekran ışığı odayı boyar */}
      <ellipse cx={990} cy={500} rx={700} ry={460} fill={red > 0.5 ? "url(#pGlowR)" : glow === X.amber ? "url(#pGlowA)" : "url(#pGlowC)"} opacity={0.25 + red * 0.2} style={{ mixBlendMode: "screen" }} />
    </g>
  );
};

// ───────── HASTANE KORİDORU ─────────
export const Hospital: React.FC<{ t: number; amb?: boolean; nurses?: number; paper?: boolean; walk?: number }> = ({ t, amb = false, nurses = 2, paper = false, walk }) => {
  const fl = (i: number) => (hash(Math.floor(t * 8) + i * 13) > 0.92 ? 0.3 : 1);
  return (
    <g>
      <rect width={1920} height={1080} fill="#1A2229" />
      <path d="M0,0 L760,380 L1160,380 L1920,0Z" fill="#232D36" />
      <path d="M0,1080 L760,640 L1160,640 L1920,1080Z" fill="#2C353C" />
      <path d="M0,0 L760,380 L760,640 L0,1080Z" fill="#202A33" />
      <path d="M1920,0 L1160,380 L1160,640 L1920,1080Z" fill="#1D262E" />
      <rect x={760} y={380} width={400} height={260} fill="#0F151B" />
      {Array.from({ length: 6 }, (_, i) => { const k = i / 6; const y = lp(20, 370, k ** 0.7); const w = lp(500, 120, k ** 0.7); return <rect key={i} x={960 - w / 2} y={y} width={w} height={lp(30, 6, k)} fill="#E8F4FF" opacity={0.85 * fl(i)} />; })}
      {[0.15, 0.4, 0.62].map((k, i) => { const x = lp(0, 760, k), y = lp(0, 380, k), h = lp(1080, 640, k) - y; return <rect key={i} x={x + 30} y={y + h * 0.25} width={lp(170, 50, k)} height={h * 0.62} fill="#33424F" />; })}
      {[0.25, 0.5].map((k, i) => { const x = lp(1920, 1160, k), y = lp(0, 380, k), h = lp(1080, 640, k) - y; return <g key={i}><rect x={x - lp(260, 90, k)} y={y + h * 0.3} width={lp(220, 70, k)} height={lp(150, 50, k)} fill="#06080C" /><rect x={x - lp(250, 86, k)} y={y + h * 0.3 + 8} width={lp(200, 62, k)} height={lp(134, 44, k)} fill={X.red} opacity={0.75 + 0.25 * Math.sin(t * 5 + i)} /><circle cx={x - lp(160, 55, k)} cy={y + h * 0.3 + lp(75, 25, k)} r={lp(120, 40, k)} fill="url(#pGlowR)" /></g>; })}
      <g transform="translate(960,350)"><rect x={-140} y={-30} width={280} height={56} fill="#0B6E4F" />{T(0, 8, "A&E · EMERGENCY", 26, "#FFF", 700, "middle")}</g>
      {/* yatak + hasta */}
      <g transform="translate(330,860)"><rect x={-200} y={-60} width={420} height={70} rx={10} fill="#C9D3DB" /><rect x={-200} y={10} width={20} height={90} fill="#6B7884" /><rect x={200} y={10} width={20} height={90} fill="#6B7884" /><ellipse cx={-130} cy={-80} rx={50} ry={34} fill="#E5ECF1" /><path d="M-150,-90 Q-80,-140 200,-80 L200,-60 L-150,-60Z" fill="#7B95AC" /><circle cx={-130} cy={-110} r={34} fill={X.sil} /></g>
      {Array.from({ length: nurses }, (_, i) => {
        const g = walk !== undefined ? gait(t, walk + i * 0.6, walk + 4 + i * 0.6, 1400 - i * 180, 820 - i * 120, 160) : null;
        return <Sil key={i} x={g ? g.x : 1300 - i * 260} y={980 - i * 40} s={1.1 - i * 0.12} t={t} kind="nurse" pose={paper ? "paper" : i === 0 ? "phone" : "stand"} walk={g?.walk} rim={X.red} dir={g ? -1 : i ? 1 : -1} seed={i * 4} />;
      })}
      {amb && <rect width={1920} height={1080} fill={Math.sin(t * 9) > 0 ? "#2B5BFF" : X.red} opacity={0.12} style={{ mixBlendMode: "screen" }} />}
    </g>
  );
};

// ───────── HAVALİMANI · Las Vegas ─────────
export const Airport: React.FC<{ t: number; a?: number; agents?: number; cuffs?: number; sit?: boolean; board?: string; night?: boolean }> = ({ t, a = 0, agents, cuffs, sit = true, board = "LONDRA · BİNİŞ", night = false }) => {
  const g1 = agents !== undefined ? gait(t, a + agents, a + agents + 3.2, 2150, 1260, 170) : null;
  const g2 = agents !== undefined ? gait(t, a + agents + 0.3, a + agents + 3.6, 2350, 1440, 170) : null;
  const cuffed = cuffs !== undefined && t > a + cuffs;
  return (
    <g>
      <rect width={1920} height={1080} fill="#10151D" />
      <rect x={0} y={60} width={1920} height={560} fill={night ? "url(#pSkyN)" : "url(#pSky)"} />
      {Array.from({ length: 40 }, (_, i) => <rect key={i} x={i * 50 + (hash(i) * 30)} y={540 - hash(i * 3) * 120} width={30 + hash(i) * 20} height={hash(i * 3) * 120 + 80} fill="#141A26" />)}
      {Array.from({ length: 70 }, (_, i) => <rect key={`w${i}`} x={hash(i * 9) * 1920} y={460 + hash(i * 4) * 140} width={5} height={5} fill={["#FFCF7A", "#FF7AC8", "#7AD7FF"][i % 3]} opacity={0.4 + 0.5 * Math.sin(t * 2 + i)} />)}
      <g transform={`translate(${md(t * 25, 2600) - 400},${400 - md(t * 25, 2600) * 0.06})`}><path d="M0,0 L180,-10 L210,0 L180,10Z" fill="#C8CDD6" /><path d="M90,0 L60,-50 L80,-50 L130,0Z" fill="#AEB4BF" /><circle cx={205} cy={0} r={4} fill={Math.sin(t * 6) > 0 ? X.red : "#FFF"} /></g>
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={i * 240 - 10} y={40} width={20} height={600} fill="#0B0F15" />)}
      <rect x={0} y={40} width={1920} height={30} fill="#0B0F15" /><rect x={0} y={610} width={1920} height={30} fill="#0B0F15" />
      <rect x={0} y={640} width={1920} height={440} fill="url(#pFloor)" />
      {Array.from({ length: 10 }, (_, i) => <line key={i} x1={960} y1={640} x2={i * 240 - 200} y2={1080} stroke="#FFF" opacity={0.03} />)}
      {/* kalkış panosu */}
      <g transform="translate(120,110)"><rect width={520} height={220} fill="#05070A" stroke="#2A3240" strokeWidth={4} />{T(20, 44, "KALKIŞ", 26, X.amber, 700)}{[[board, "23:15"], ["NEW YORK", "23:40"], ["CHICAGO", "00:05"]].map(([c, h], i) => <g key={i}>{T(20, 100 + i * 46, c, 28, i === 0 ? "#FFF" : "#9AA4B2", 700)}{T(500, 100 + i * 46, h, 28, i === 0 ? X.amber : "#9AA4B2", 700, "end")}</g>)}</g>
      {/* koltuk sırası */}
      {Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${500 + i * 150},880)`}><rect x={-60} y={-60} width={120} height={60} rx={10} fill="#2A3442" /><rect x={-60} y={-130} width={120} height={80} rx={12} fill="#334050" /><rect x={-4} y={0} width={8} height={60} fill="#1A202A" /></g>)}
      <Sil x={sit ? 950 : 1000} y={sit ? 960 : 1000} s={1.25} t={t} kind="hood" hair="curly" pose={cuffed ? "cuffs" : sit ? "sit" : "bag"} dir={-1} rim={X.amber} seed={2} />
      <g transform={`translate(${sit ? 880 : 940},${sit ? 940 : 980})`}><rect x={-40} y={-80} width={80} height={90} rx={18} fill="#1F2A3A" /></g>
      {g1 && <Sil x={g1.x} y={1010} s={1.32} t={t} kind="suit" pose={g1.moving ? "stand" : "badge"} walk={g1.walk} dir={-1} rim={X.cyan} seed={8} item={!g1.moving ? <g transform="translate(-55,-215)"><rect x={-26} y={-18} width={52} height={36} rx={5} fill="#C9A23A" /><circle cx={0} cy={0} r={34} fill="url(#pGlowA)" opacity={0.6 + 0.4 * Math.sin(t * 5)} /></g> : null} />}
      {g2 && <Sil x={g2.x} y={1030} s={1.38} t={t} kind="suit" pose="stand" walk={g2.walk} dir={-1} rim={X.cyan} seed={11} />}
      {cuffed && <g transform="translate(950,770)"><circle cx={-12} cy={0} r={14} fill="none" stroke="#C9CED6" strokeWidth={6} /><circle cx={14} cy={0} r={14} fill="none" stroke="#C9CED6" strokeWidth={6} /><circle r={70} fill="url(#pGlowA)" opacity={0.5} /></g>}
    </g>
  );
};

// ───────── MAHKEME · Milvoki ─────────
export const Court: React.FC<{ t: number; a?: number; gavel?: number; speak?: boolean; stand?: boolean; seal?: string }> = ({ t, a = 0, gavel, speak = false, stand = false, seal = "ABD" }) => {
  const gk = gavel !== undefined ? Math.max(0, Math.sin(cl((t - a - gavel) / 0.35) * Math.PI)) : 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#1A130E" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170} y={0} width={150} height={620} fill="#24190F" stroke="#2E2014" strokeWidth={6} />)}
      {[0, 1].map((i) => <path key={i} d={`M${200 + i * 1350},0 L${380 + i * 1350},0 L${700 + i * 900},1080 L${300 + i * 1100},1080Z`} fill="#FFE2B0" opacity={0.05 + 0.02 * Math.sin(t * 0.5 + i)} />)}
      <g transform="translate(960,180)"><circle r={90} fill="#2C2216" stroke="#B8954A" strokeWidth={8} /><circle r={66} fill="none" stroke="#B8954A" strokeWidth={3} />{T(0, 12, seal, seal.length > 4 ? 26 : 40, "#B8954A", 700, "middle")}</g>
      <Sil x={960} y={640} s={1.3} t={t} kind="robe" pose={speak ? "point" : "stand"} rim={X.amber} seed={5} hair="short" />
      <rect x={420} y={420} width={1080} height={260} fill="#3A2716" />
      <rect x={400} y={400} width={1120} height={40} fill="#4A331D" />
      <g transform={`translate(1240,${398 - gk * 30}) rotate(${-30 * gk})`}><rect x={-10} y={-80} width={20} height={80} fill="#5A3A1E" /><rect x={-40} y={-110} width={80} height={40} rx={10} fill="#6B4523" /></g>
      {gk > 0.5 && <circle cx={1240} cy={400} r={80 * gk} fill="url(#pGlowA)" />}
      <rect x={0} y={680} width={1920} height={400} fill="#120D09" />
      <rect x={300} y={800} width={700} height={36} fill="#3A2716" />
      <Sil x={560} y={1110} s={1.45} t={t} kind="suit" pose={stand ? "stand" : "sit"} back hair="curly" rim={X.amber} seed={6} />
      <Sil x={840} y={1110} s={1.4} t={t} kind="suit" pose="sit" back hair="short" rim={X.dim} seed={7} />
      {Array.from({ length: 6 }, (_, i) => <Sil key={i} x={1180 + i * 130} y={1140} s={1.1} t={t} kind={i % 2 ? "casual" : "suit"} pose="sit" back hair={i % 3 ? "short" : "long"} rim="#5A4A3A" seed={20 + i} op={0.85} />)}
    </g>
  );
};

// ───────── KONFERANS SALONU (hacker buluşması) ─────────
export const Hall: React.FC<{ t: number; spot?: number }> = ({ t, spot = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#07070C" />
    <rect x={360} y={80} width={1200} height={460} fill="#0D1020" stroke="#2A2F55" strokeWidth={6} />
    <g opacity={0.9}>{Array.from({ length: 30 }, (_, i) => <rect key={i} x={380 + md(i * 97 + t * 60, 1160)} y={100 + (i % 10) * 42} width={40 + (i % 4) * 30} height={14} fill={i % 5 ? X.cyan2 : X.amber} opacity={0.5} />)}</g>
    {T(960, 340, "HACKER BULUŞMASI", 90, "#FFF", 700, "middle")}
    {T(960, 420, "LAS VEGAS · TEMMUZ 2017", 40, X.amber, 700, "middle")}
    {[0, 1, 2].map((i) => <path key={i} d={`M${600 + i * 360},0 L${640 + i * 360},0 L${760 + i * 220 + Math.sin(t + i) * 80},1080 L${560 + i * 260 + Math.sin(t + i) * 80},1080Z`} fill={[X.cyan, "#B05CFF", X.amber][i]} opacity={0.06} />)}
    {Array.from({ length: 5 }, (_, r) => Array.from({ length: 16 }, (_, i) => {
      const x = 40 + i * 120 + (r % 2) * 60, y = 700 + r * 90;
      const ph = hash(i * 7 + r * 31) > 0.8 && Math.sin(t * 3 + i + r) > 0.6;
      return <g key={`${r}-${i}`}><ellipse cx={x} cy={y} rx={42} ry={50} fill="#0B0E15" /><rect x={x - 60} y={y + 30} width={120} height={120} rx={30} fill="#0B0E15" />{ph && <rect x={x + 10} y={y - 60} width={22} height={36} rx={4} fill="#DDEBFF" />}</g>;
    }))}
    {spot > 0 && <g><path d={`M940,0 L980,0 L1100,1080 L820,1080Z`} fill="#FFF1D0" opacity={0.12 * spot} /><Sil x={960} y={1060} s={1.3} t={t} kind="hood" hair="curly" pose="raise" back rim={X.amber} seed={2} /></g>}
  </g>
);

// ───────── SUNUCULAR + zombi saldırısı (Mirai) ─────────
export const Servers: React.FC<{ t: number; a: number; grow?: number; ddos?: number; seized?: number }> = ({ t, a, grow = 1, ddos = 0, seized }) => {
  const n = Math.min(14, Math.floor(3 + cl((t - a) / 6) * 11 * grow));
  return (
    <g>
      <rect width={1920} height={1080} fill="#060A10" />
      <rect width={1920} height={1080} fill="url(#pGrid)" />
      {Array.from({ length: n }, (_, i) => {
        const col = i % 7, row = Math.floor(i / 7);
        const x = 760 + col * 150, y = 260 + row * 330;
        const k = rp(t, a + i * 0.25, a + i * 0.25 + 0.4);
        const gone = seized !== undefined && t > a + seized && (i === 1 || i === 4);
        return (
          <g key={i} opacity={gone ? 0.15 : k} transform={`translate(${x},${y + (1 - k) * 40})`}>
            <rect width={120} height={300} rx={8} fill="#0E141D" stroke={gone ? X.red : "#253144"} strokeWidth={3} />
            {Array.from({ length: 10 }, (_, j) => <g key={j}><rect x={10} y={12 + j * 28} width={100} height={20} fill="#151D29" /><circle cx={96} cy={22 + j * 28} r={4} fill={hash(Math.floor(t * 10) + i * 11 + j) > 0.5 ? X.cyan : "#0E3A48"} /></g>)}
          </g>
        );
      })}
      <g transform="translate(1290,940)"><rect x={-260} y={-34} width={520} height={60} rx={30} fill="#0E141D" stroke={X.amber} strokeWidth={3} />{T(0, 8, `durdurma adresi · ${n} sunucu`, 28, X.amber, 700, "middle")}</g>
      {ddos > 0 && (
        <g>
          {Array.from({ length: 9 }, (_, i) => {
            const y = 140 + i * 100;
            const icon = i % 3;
            return (
              <g key={i} transform={`translate(110,${y})`}>
                <rect x={-50} y={-36} width={100} height={72} rx={10} fill="#1A0F12" stroke={X.red} strokeWidth={3} />
                {icon === 0 && <g><rect x={-26} y={-16} width={40} height={30} rx={4} fill="#5A2A2E" /><circle cx={24} cy={-2} r={10} fill="#5A2A2E" /></g>}
                {icon === 1 && <g><rect x={-30} y={0} width={60} height={18} rx={4} fill="#5A2A2E" />{[-16, 0, 16].map((xx) => <line key={xx} x1={xx} y1={0} x2={xx * 1.3} y2={-24} stroke="#5A2A2E" strokeWidth={4} />)}</g>}
                {icon === 2 && <rect x={-18} y={-28} width={36} height={56} rx={6} fill="#5A2A2E" />}
              </g>
            );
          })}
          {Array.from({ length: 70 }, (_, i) => {
            const q = md(t * (0.6 + hash(i) * 0.6) + hash(i * 3), 1);
            const y0 = 140 + (i % 9) * 100, y1 = 300 + hash(i * 5) * 500;
            return <circle key={`p${i}`} cx={lp(170, 740, q)} cy={lp(y0, y1, q)} r={4 + hash(i) * 3} fill={X.red} opacity={ddos * (1 - q * 0.5)} />;
          })}
          {T(110, 1050, "ZOMBİ AĞI · MİRAİ", 30, X.red, 700, "middle")}
        </g>
      )}
    </g>
  );
};

// ───────── ANALOJİ 1: maymuncuk ─────────
export const Keys: React.FC<{ t: number; a: number; open?: number }> = ({ t, a, open = 99 }) => {
  const doors = 12;
  const along = Math.max(0, t - a - open);
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B0D12" />
      {Array.from({ length: doors }, (_, i) => {
        const col = i % 6, row = Math.floor(i / 6);
        const x = 190 + col * 270, y = 140 + row * 420;
        const op = cl(along * 2.2 - i * 0.35);
        return (
          <g key={i} transform={`translate(${x},${y})`}>
            <rect width={200} height={340} fill="#06080B" />
            {op > 0 && <rect width={200} height={340} fill="#FFE9C2" opacity={0.5 * op} />}
            <g transform={`translate(${200 * 0},0) scale(${1 - op * 0.75},1)`}>
              <rect width={200} height={340} fill={["#3B2C22", "#2C3542", "#3A3A2C", "#33263A"][i % 4]} stroke="#1A1E26" strokeWidth={6} />
              <rect x={150} y={170} width={30} height={46} rx={6} fill="#B8954A" />
              <circle cx={165} cy={186} r={6} fill="#1A1E26" /><rect x={162} y={186} width={6} height={18} fill="#1A1E26" />
            </g>
          </g>
        );
      })}
      {(() => {
        const q = cl(along * 2.2 / 0.35 / doors);
        const i = Math.min(doors - 1, Math.floor(along * 2.2 / 0.35));
        const col = i % 6, row = Math.floor(i / 6);
        const kx = t < a + open ? 960 : 190 + col * 270 + 165, ky = t < a + open ? 560 + Math.sin(t * 2) * 10 : 140 + row * 420 + 190;
        return (
          <g transform={`translate(${kx},${ky}) rotate(${-20 + q * 0})`}>
            <circle r={120} fill="url(#pGlowA)" />
            <circle cx={-70} cy={0} r={34} fill="none" stroke={X.amber} strokeWidth={14} />
            <rect x={-38} y={-7} width={120} height={14} fill={X.amber} />
            <rect x={60} y={7} width={10} height={20} fill={X.amber} /><rect x={74} y={7} width={8} height={14} fill={X.amber} />
          </g>
        );
      })()}
    </g>
  );
};

// ───────── ANALOJİ 2: bomba + telefon ─────────
export const Bomb: React.FC<{ t: number; a: number; ring?: number; answer?: number }> = ({ t, a, ring = 1, answer = 99 }) => {
  const answered = t > a + answer;
  const left = answered ? Math.max(3, 59 - Math.floor((answer) * 4)) : Math.max(0, 59 - Math.floor((t - a) * 4));
  const ringing = t > a + ring && !answered;
  const hk = answered ? rp(t, a + answer, a + answer + 0.6) : 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#0A0C10" />
      <ellipse cx={960} cy={900} rx={700} ry={70} fill="#000" opacity={0.6} />
      {[0, 1, 2, 3].map((i) => <rect key={i} x={560 + i * 170} y={480} width={150} height={400} rx={70} fill="#5B2A22" stroke="#2A140F" strokeWidth={8} />)}
      <rect x={520} y={600} width={760} height={60} fill="#1A1A1A" />
      <g transform="translate(960,420)"><rect x={-230} y={-90} width={460} height={180} rx={14} fill="#0A0A0A" stroke="#333" strokeWidth={6} />{T(0, 50, `00:${String(left).padStart(2, "0")}`, 130, answered ? X.amber : X.red, 700, "middle")}</g>
      {[[-200, 1], [200, -1]].map(([dx, d], i) => <path key={i} d={`M${960 + dx},${510} Q${960 + dx * 1.6},${560} ${960 + dx * 1.4 + d * 60},${700}`} stroke={["#C33", "#36C"][i]} strokeWidth={8} fill="none" />)}
      <g transform={`translate(1500,${640 - hk * 260}) rotate(${ringing ? Math.sin(t * 40) * 6 : 0})`}>
        <rect x={-140} y={-60} width={280} height={120} rx={20} fill="#2A2A2A" />
        <path d="M-150,-70 Q0,-140 150,-70 L120,-40 Q0,-90 -120,-40Z" fill="#3A3A3A" />
        {ringing && [1, 2, 3].map((i) => <path key={i} d={`M${-180 - i * 30},-120 q-30,60 0,120 M${180 + i * 30},-120 q30,60 0,120`} stroke={X.amber} strokeWidth={6} fill="none" opacity={0.3 + 0.7 * Math.max(0, Math.sin(t * 10 - i))} />)}
      </g>
      {answered && <Sil x={1650} y={1100} s={1.4} t={t} kind="hood" hair="curly" pose="phone" dir={-1} rim={X.amber} seed={2} />}
      {T(960, 140, ringing ? "ARANIYOR…" : answered ? "CEVAP GELDİ · İPTAL" : "", 54, answered ? X.amber : X.red, 700, "middle")}
    </g>
  );
};

// ───────── laboratuvar (kapalı test ortamı) ─────────
export const Lab: React.FC<{ t: number; a: number; trick?: number }> = ({ t, a, trick = 99 }) => {
  const sleep = t > a + trick;
  return (
    <g>
      <rect width={1920} height={1080} fill="#0B1016" />
      <rect x={560} y={260} width={800} height={560} rx={20} fill="#0E1A22" stroke={X.cyan} strokeWidth={6} opacity={0.95} />
      <rect x={560} y={260} width={800} height={560} rx={20} fill="url(#pGrid)" />
      {T(960, 220, "TEST ORTAMI · LABORATUVAR", 40, X.cyan, 700, "middle")}
      <g transform={`translate(960,560) scale(${sleep ? 0.85 : 1 + Math.sin(t * 5) * 0.04})`}>
        <circle r={110} fill={sleep ? "#5A3A3A" : X.red} />
        {Array.from({ length: 14 }, (_, i) => { const an = (i / 14) * Math.PI * 2 + t * (sleep ? 0 : 0.6); return <line key={i} x1={Math.cos(an) * 100} y1={Math.sin(an) * 100} x2={Math.cos(an) * 160} y2={Math.sin(an) * 160} stroke={sleep ? "#5A3A3A" : X.red} strokeWidth={14} strokeLinecap="round" />; })}
        {sleep && T(150, -130, "z z z", 54, X.dim, 700)}
      </g>
      {[[360, 380, "adres 1 → ✓"], [1560, 420, "adres 2 → ✓"], [380, 760, "yok olan adres → ✓"]].map(([x, y, s], i) => { const k = rp(t, a + 0.6 + i * 0.5, a + 1 + i * 0.5); return <g key={i} opacity={k}><rect x={(x as number) - 190} y={(y as number) - 40} width={380} height={64} rx={12} fill="#10202A" stroke={X.cyan2} />{T(x as number, (y as number) + 2, s as string, 30, X.cyan, 700, "middle")}</g>; })}
      {Array.from({ length: 3 }, (_, i) => <Sil key={i} x={300 + i * 660} y={1080} s={1.05} t={t} kind="coat" pose={i === 1 ? "paper" : "stand"} rim={X.cyan} seed={30 + i} op={0.9} dir={i ? -1 : 1} />)}
    </g>
  );
};

// ───────── dosya / belge ─────────
export const Dossier: React.FC<{ t: number; a: number; title: string; lines?: string[]; stamp?: string; stampAt?: number; no?: string }> = ({ t, a, title, lines = [], stamp, stampAt = 1.6, no = "DOSYA 01" }) => {
  const k = rp(t, a, a + 0.6);
  const sk = stamp ? rp(t, a + stampAt, a + stampAt + 0.18) : 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#0C0A08" />
      <ellipse cx={960} cy={560} rx={900} ry={520} fill="url(#pGlowW)" opacity={0.35} />
      <g transform={`translate(960,${560 + (1 - k) * 60}) rotate(${-2 + k * 1})`}>
        <rect x={-620} y={-400} width={1240} height={800} rx={10} fill="#8A6A3E" />
        <rect x={-620} y={-460} width={300} height={80} rx={10} fill="#8A6A3E" />
        {T(-470, -405, no, 34, "#2A1E10", 700, "middle")}
        <rect x={-580} y={-370} width={1160} height={740} fill={X.paper} />
        {T(-530, -290, title, 52, "#1A1A1A", 700)}
        <rect x={-530} y={-260} width={1060} height={4} fill="#1A1A1A" />
        {lines.map((l, i) => { const lk = rp(t, a + 0.4 + i * 0.25, a + 0.9 + i * 0.25); return <g key={i}>{l.startsWith("█") ? <rect x={-530} y={-210 + i * 64} width={lk * (300 + (i * 173) % 600)} height={36} fill="#111" /> : T(-530, -180 + i * 64, typed(l, lk), 36, "#222", 500)}</g>; })}
        {stamp && sk > 0 && <g transform={`translate(260,190) rotate(-12) scale(${lp(1.6, 1, sk)})`} opacity={sk}><rect x={-260} y={-70} width={520} height={140} rx={12} fill="none" stroke={X.red} strokeWidth={12} />{T(0, 28, stamp, 76, X.red, 700, "middle")}</g>}
      </g>
    </g>
  );
};

// ───────── LA · ev hapsi ─────────
export const LARoom: React.FC<{ t: number; ankle?: boolean }> = ({ t, ankle = false }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2420" />
    <rect x={1100} y={120} width={700} height={560} fill="#F2B880" />
    <rect x={1100} y={500} width={700} height={180} fill="#C98A5A" />
    {[0, 1, 2].map((i) => { const px = 1200 + i * 230, sw = Math.sin(t * 0.8 + i) * 6; return <g key={i}><path d={`M${px},680 Q${px + 10},450 ${px + sw},300`} stroke="#3A2A20" strokeWidth={14} fill="none" />{Array.from({ length: 7 }, (_, j) => <path key={j} d={`M${px + sw},300 q${Math.cos(j) * 90},${-30 + Math.sin(j) * 30} ${Math.cos(j) * 150},${40 + Math.sin(j * 2) * 30}`} stroke="#2A3A28" strokeWidth={14} fill="none" strokeLinecap="round" />)}</g>; })}
    <rect x={1090} y={110} width={720} height={580} fill="none" stroke="#1A1612" strokeWidth={20} /><line x1={1450} y1={110} x2={1450} y2={690} stroke="#1A1612" strokeWidth={12} />
    <rect x={0} y={760} width={1920} height={320} fill="#1E1A17" />
    <rect x={160} y={600} width={600} height={220} rx={30} fill="#4A4038" />
    <Sil x={520} y={900} s={1.4} t={t} kind="hood" hair="curly" pose="think" rim={X.amber} dir={1} seed={2} />
    {ankle && <g transform="translate(610,880)"><rect x={-40} y={-24} width={80} height={48} rx={10} fill="#111" /><circle cx={22} cy={0} r={8} fill={Math.sin(t * 4) > 0 ? "#2BFF88" : "#0A3A22"} /><circle r={80} fill="url(#pGlowA)" opacity={0.25} /></g>}
    <rect width={1920} height={1080} fill="#FF9A4A" opacity={0.06} style={{ mixBlendMode: "screen" }} />
  </g>
);
export const Ankle: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#1A1714" />
    <rect x={0} y={760} width={1920} height={320} fill="#2A241E" />
    <path d="M760,0 L1000,0 L1040,700 Q1060,820 1200,840 L1240,900 L800,900 Q780,800 800,700Z" fill={X.sil} />
    <rect x={770} y={560} width={300} height={170} rx={30} fill="#0B0B0B" stroke="#333" strokeWidth={4} />
    <rect x={800} y={600} width={150} height={90} rx={12} fill="#161616" />
    <circle cx={1010} cy={645} r={18} fill={Math.sin(t * 4) > 0 ? "#2BFF88" : "#0A3A22"} />
    <circle cx={1010} cy={645} r={120} fill="url(#pGlowA)" opacity={0.2} />
    {T(875, 655, "GPS", 34, "#555", 700, "middle")}
  </g>
);

// ───────── ev önü · muhabirler ─────────
export const Press: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#pSkyD)" />
    <rect x={500} y={160} width={920} height={720} fill="#B9AE9C" />
    <path d="M460,170 L960,20 L1460,170Z" fill="#5A4A42" />
    {[[620, 300], [1180, 300], [620, 560], [1180, 560]].map(([x, y], i) => <g key={i}><rect x={x} y={y} width={140} height={170} fill="#3E4C58" /><rect x={x} y={y} width={140} height={170} fill="none" stroke="#EEE" strokeWidth={10} /><line x1={x + 70} y1={y} x2={x + 70} y2={y + 170} stroke="#EEE" strokeWidth={6} /></g>)}
    <rect x={880} y={600} width={160} height={280} fill="#2E3E54" /><circle cx={1015} cy={740} r={8} fill="#C9A23A" />
    <rect x={0} y={880} width={1920} height={200} fill="#6E6A64" />
    {Array.from({ length: 8 }, (_, i) => {
      const x = 160 + i * 220, fl = hash(Math.floor(t * 6) + i * 17) > 0.86;
      return <g key={i}><Sil x={x} y={1100} s={1.2} t={t} kind={i % 2 ? "coat" : "casual"} pose={i % 3 === 0 ? "phone" : "hold"} back rim="#DDD" seed={40 + i} hair={i % 2 ? "short" : "long"} />{i % 2 === 0 && <g transform={`translate(${x + 30},790)`}><rect x={-50} y={-34} width={90} height={60} rx={6} fill="#1A1A1A" /><circle cx={50} cy={-4} r={20} fill="#2A2A2A" />{fl && <circle cx={50} cy={-4} r={200} fill="#FFF" opacity={0.5} />}</g>}</g>;
    })}
  </g>
);

// ───────── gazeteler (genel, gerçek marka değil) ─────────
export const Papers: React.FC<{ t: number; a: number; heads: string[] }> = ({ t, a, heads }) => (
  <g>
    <rect width={1920} height={1080} fill="#14110E" />
    {heads.map((h, i) => {
      const k = rp(t, a + i * 0.5, a + i * 0.5 + 0.4);
      return (
        <g key={i} transform={`translate(${520 + i * 440},${560 + (1 - k) * 600}) rotate(${(i - 1) * 7})`} opacity={k}>
          <rect x={-330} y={-420} width={660} height={840} fill="#ECE7DC" />
          {T(0, -340, ["THE MORNING POST", "DAILY HERALD", "THE COURIER"][i % 3], 36, "#111", 700, "middle")}
          <rect x={-300} y={-310} width={600} height={4} fill="#111" />
          {(() => { const ls = h.split("\n"); const fs = Math.min(70, 560 / (Math.max(...ls.map((l) => l.length)) * 0.62)); return ls.map((l, j) => <g key={j}>{T(0, -220 + j * fs * 1.15, l, fs, "#111", 700, "middle")}</g>); })()}
          <rect x={-300} y={0} width={340} height={260} fill="#8D877C" />
          <Sil x={-130} y={260} s={0.75} t={0} kind="hood" hair="curly" pose="stand" rim="#555" seed={1} />
          {Array.from({ length: 9 }, (_, j) => <rect key={j} x={70} y={10 + j * 30} width={230 - (j % 3) * 30} height={14} fill="#9A958B" />)}
        </g>
      );
    })}
  </g>
);

// ───────── NSA binası + sızıntı ─────────
export const Agency: React.FC<{ t: number; a: number; steal?: number; vault?: boolean }> = ({ t, a, steal = 99, vault = true }) => {
  const st = t > a + steal;
  const g = st ? gait(t, a + steal, a + steal + 3, 1060, 1700, 150) : null;
  return (
    <g>
      <rect width={1920} height={1080} fill="url(#pSkyN)" />
      <rect x={300} y={240} width={1320} height={520} fill="#0E141E" />
      {Array.from({ length: 11 }, (_, r) => Array.from({ length: 26 }, (_, c) => <rect key={`${r}${c}`} x={330 + c * 49} y={270 + r * 44} width={36} height={26} fill={hash(r * 31 + c) > 0.7 ? "#3E5A7A" : "#0A1018"} opacity={0.8} />))}
      <g transform="translate(1500,200)"><path d="M-90,0 A90,90 0 0,1 90,0Z" fill="#3A4656" transform={`rotate(${-20 + Math.sin(t * 0.3) * 10})`} /><rect x={-8} y={0} width={16} height={40} fill="#3A4656" /></g>
      <rect x={0} y={760} width={1920} height={320} fill="#0A0D12" />
      {Array.from({ length: 40 }, (_, i) => <rect key={i} x={i * 50} y={720} width={6} height={80} fill="#2A3240" />)}
      <rect x={0} y={724} width={1920} height={6} fill="#2A3240" />
      {T(960, 200, "ULUSAL GÜVENLİK AJANSI · NSA", 44, "#9FB3C8", 700, "middle")}
      {vault && (
        <g transform="translate(960,900)">
          <rect x={-170} y={-120} width={340} height={200} rx={16} fill="#1A222E" stroke={X.amber} strokeWidth={4} />
          {!st && <g><circle r={70} fill="url(#pGlowA)" /><rect x={-80} y={-26} width={160} height={52} rx={10} fill={X.amber} />{T(0, 12, "ETERNAL BLU", 26, "#111", 700, "middle")}</g>}
        </g>
      )}
      {g && <Sil x={g.x} y={1060} s={1.3} t={t} kind="hood" pose="hold" walk={g.walk} rim={X.red} seed={50} item={<g transform="translate(0,-220)"><rect x={-60} y={-20} width={120} height={40} rx={8} fill={X.amber} /><circle r={60} fill="url(#pGlowA)" /></g>} />}
      {g && <Sil x={g.x - 160} y={1070} s={1.25} t={t} kind="hood" pose="stand" walk={g.walk} rim={X.red} seed={51} />}
    </g>
  );
};

// açık artırma ekranı (2016)
export const Auction: React.FC<{ t: number; a: number }> = ({ t, a }) => (
  <g>
    <rect width={1600} height={900} fill="#0A0A0A" />
    {T(800, 150, "AÇIK ARTIRMA", 80, X.red, 700, "middle")}
    {T(800, 230, "“Devletin siber silahları satılık”", 40, "#DDD", 500, "middle")}
    <rect x={300} y={300} width={1000} height={340} fill="#141414" stroke="#333" />
    {["equation_group_tools.zip", "ETERNAL_BLU.bin", "DOUBLE_PULSAR.bin"].map((f, i) => <g key={i} opacity={rp(t, a + 0.4 + i * 0.3, a + 0.7 + i * 0.3)}>{T(340, 380 + i * 80, `▸ ${f}`, 36, i === 1 ? X.amber : "#9AA", 700)}{T(1260, 380 + i * 80, "████", 36, "#555", 700, "end")}</g>)}
    {T(800, 740, "Teklif: 0", 54, "#777", 700, "middle")}
    <rect x={0} y={0} width={1600} height={900} fill="url(#pScan)" />
  </g>
);

// ───────── kurban sahneleri: tren panosu + fabrika ─────────
export const Station: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#0F1318" />
    <path d="M0,700 L1920,600 L1920,1080 L0,1080Z" fill="#1A1F26" />
    {[0, 1].map((i) => <path key={i} d={`M0,${880 + i * 80} L1920,${740 + i * 80}`} stroke="#5A5A5A" strokeWidth={8} />)}
    <rect x={460} y={160} width={1000} height={440} fill="#05070A" stroke="#333" strokeWidth={10} />
    <rect x={480} y={180} width={960} height={400} fill="#7A0A0F" opacity={0.92 + 0.08 * Math.sin(t * 6)} />
    {T(960, 300, "Dosyalarınız şifrelendi!", 64, "#FFF", 700, "middle")}
    {T(960, 380, "300 $ · bitkoin", 44, "#F6D3D3", 600, "middle")}
    {T(960, 520, "Gleis 4 · ███ ███ ██:██", 36, "#F2C9C9", 600, "middle")}
    <ellipse cx={960} cy={380} rx={800} ry={420} fill="url(#pGlowR)" opacity={0.4} />
    {Array.from({ length: 6 }, (_, i) => <Sil key={i} x={240 + i * 300} y={1080} s={1.1} t={t} kind={i % 2 ? "coat" : "casual"} pose={i === 2 ? "phone" : i === 4 ? "point" : "bag"} back rim={X.red} seed={60 + i} hair={i % 3 ? "short" : "long"} />)}
  </g>
);
export const Factory: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#101418" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 260} y={0} width={20} height={1080} fill="#171C22" />)}
    <rect x={0} y={700} width={1920} height={60} fill="#2A3038" />
    {Array.from({ length: 5 }, (_, i) => (
      <g key={i} transform={`translate(${220 + i * 380},700)`}>
        <path d="M-80,-60 L80,-60 L60,0 L-60,0Z" fill="#6B7684" />
        <path d="M0,-60 L0,-240 L120,-320" stroke="#E2A02A" strokeWidth={30} fill="none" strokeLinecap="round" />
        <circle cx={0} cy={-240} r={24} fill="#3A3A3A" />
        <rect x={110} y={-340} width={50} height={40} fill="#3A3A3A" />
        <rect x={-130} y={-40} width={260} height={40} fill="#4A5260" opacity={0.6} />
      </g>
    ))}
    {Array.from({ length: 4 }, (_, i) => <path key={i} d={`M${120 + i * 480},0 L${180 + i * 480},0 L${300 + i * 480},1080 L${0 + i * 480},1080Z`} fill={X.red} opacity={Math.sin(t * 4 + i) > 0 ? 0.1 : 0.03} />)}
    <g transform="translate(1500,300)"><rect x={-220} y={-130} width={440} height={260} fill="#05070A" /><rect x={-210} y={-120} width={420} height={240} fill="#7A0A0F" />{T(0, 0, "ÜRETİM DURDU", 44, "#FFF", 700, "middle")}{T(0, 60, "sistem kilitli", 30, "#F6D3D3", 600, "middle")}</g>
  </g>
);

// ───────── başlık kartları ─────────
export const Chapter: React.FC<{ t: number; a: number; n: string; title: string; sub?: string }> = ({ t, a, n, title, sub }) => {
  const k = rp(t, a + 0.1, a + 0.7);
  const gl = hash(Math.floor(t * 20)) > 0.85 ? (hash(Math.floor(t * 20) + 3) - 0.5) * 30 : 0;
  return (
    <g>
      <rect width={1920} height={1080} fill="#050608" />
      <rect width={1920} height={1080} fill="url(#pGrid)" />
      <line x1={260} y1={540} x2={260 + 1400 * k} y2={540} stroke={X.amber} strokeWidth={3} opacity={0.7} />
      {T(960 + gl, 420, n, 48, X.amber, 700, "middle", { letterSpacing: 18 } as React.SVGProps<SVGTextElement>)}
      <g opacity={k} transform={`translate(${gl * 0.5},${(1 - k) * 30})`}>{T(960, 680, title, 132, "#FFF", 700, "middle")}</g>
      {sub && <g opacity={rp(t, a + 0.6, a + 1.1)}>{T(960, 770, sub, 40, X.dim, 600, "middle")}</g>}
      {T(1860, 1040, "PROTOKOL X · DOSYA 01", 24, "#3A4252", 700, "end")}
    </g>
  );
};
export const DateCard: React.FC<{ t: number; a: number; date: string; place?: string; c?: string }> = ({ t, a, date, place, c = X.amber }) => (
  <g>
    <rect width={1920} height={1080} fill="#050608" />
    {T(960, 520, typed(date, rp(t, a + 0.1, a + 0.9)), 120, "#FFF", 700, "middle")}
    {place && <g opacity={rp(t, a + 0.8, a + 1.2)}>{T(960, 620, place, 48, c, 700, "middle")}</g>}
    {Math.sin(t * 6) > 0 && t < a + 1 && <rect x={960 + typed(date, rp(t, a + 0.1, a + 0.9)).length * 34} y={420} width={8} height={120} fill={c} />}
  </g>
);

// büyük sayı (SVG)
export const BigNum: React.FC<{ t: number; a: number; from?: number; to: number; label: string; c?: string; prefix?: string; suffix?: string; dur?: number; bg?: React.ReactNode }> = ({ t, a, from = 0, to, label, c = X.amber, prefix = "", suffix = "", dur = 1.4, bg }) => {
  const k = rp(t, a + 0.2, a + 0.2 + dur);
  const v = from + (to - from) * k;
  return (
    <g>
      {bg ?? <rect width={1920} height={1080} fill="#06080C" />}
      <rect width={1920} height={1080} fill="#000" opacity={bg ? 0.55 : 0} />
      {T(960, 560, `${prefix}${Math.round(v).toLocaleString("tr-TR")}${suffix}`, 230, c, 700, "middle")}
      <g opacity={rp(t, a + 0.5, a + 0.9)}>{T(960, 680, label, 54, "#E6E9EE", 600, "middle")}</g>
    </g>
  );
};
