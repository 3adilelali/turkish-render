import React from "react";
import { T } from "./Toon";

// Kanal 2 · k2r-07 "Seviye" kiti: seviye HUD'u (rakam + XP çubuğu), XP yazısı, kırık cam, kopya kâğıdı, apartman merdiveni, silinen formüller, ahşap ev içi.
const cl = (x: number) => Math.max(0, Math.min(1, x));
const md = (a: number, m: number) => ((a % m) + m) % m;
const INK = "#1C1C1C";

/** göz önündeki seviye paneli: lv, xp (0..1); warn = kırmızı uyarı yanıp söner */
export const LvHUD: React.FC<{ t: number; x?: number; y?: number; s?: number; lv: number | string; xp?: number; warn?: string; k?: number; flash?: number }> = ({ t, x = 1500, y = 140, s = 1, lv, xp = 0.3, warn, k = 1, flash = 0 }) => {
  const blink = 0.55 + 0.45 * Math.sin(t * 7);
  return (
    <g transform={`translate(${x},${y}) scale(${s * (1 + flash * 0.12)})`} opacity={k}>
      <rect x={-260} y={-80} width={520} height={160} rx={26} fill="#0B1424" opacity={0.78} stroke="#5AF0C8" strokeWidth={4} />
      {flash > 0 && <rect x={-260} y={-80} width={520} height={160} rx={26} fill="#5AF0C8" opacity={flash * 0.4} />}
      <text x={-230} y={-18} fontFamily="Poppins" fontWeight={800} fontSize={36} fill="#9FF7E0">SEVİYE</text>
      <text x={230} y={0} textAnchor="end" fontFamily="Poppins" fontWeight={800} fontSize={86} fill="#FFFFFF">{lv}</text>
      <rect x={-230} y={22} width={330} height={26} rx={13} fill="#1E2A40" stroke="#5AF0C8" strokeWidth={3} />
      <rect x={-230} y={22} width={330 * cl(xp)} height={26} rx={13} fill="#5AF0C8" />
      <text x={-230} y={70} fontFamily="Poppins" fontWeight={700} fontSize={22} fill="#9FF7E0">XP</text>
      {warn && <g opacity={blink}><rect x={-300} y={96} width={600} height={70} rx={16} fill="#3A0E14" stroke="#FF4A5A" strokeWidth={4} /><text y={142} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#FF8A94">{warn}</text></g>}
    </g>
  );
};

/** XP yazısı: +10 XP (yeşil, yükselir) / −30 XP (kırmızı, sarsılır) */
export const XpPop: React.FC<{ t: number; at: number; v: number; x?: number; y?: number; s?: number }> = ({ t, at, v, x = 960, y = 420, s = 1 }) => {
  if (t < at) return null;
  const k = cl((t - at) / 0.35);
  const up = v > 0;
  const sh = up ? 0 : Math.sin((t - at) * 60) * 10 * (1 - cl((t - at) / 0.6));
  const c = up ? "#5AF0C8" : "#FF4A5A";
  return (
    <g transform={`translate(${x + sh},${y - (up ? cl((t - at) / 1.6) * 60 : 0)}) scale(${s * (0.6 + 0.4 * k)})`} opacity={k}>
      <circle r={180} fill={c} opacity={0.12} />
      <text y={40} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={130} fill={c} stroke="#0B1424" strokeWidth={8} paintOrder="stroke">{up ? "+" : "−"}{Math.abs(v)} XP</text>
    </g>
  );
};

/** kırık cam: ekran çatlar (k: 0..1) */
export const Kirik: React.FC<{ t: number; at: number; x?: number; y?: number }> = ({ t, at, x = 960, y = 540 }) => {
  if (t < at) return null;
  const k = cl((t - at) / 0.18);
  const fade = 1 - cl((t - at - 1.4) / 0.8);
  const rays = Array.from({ length: 11 }, (_, i) => i * 0.571 + 0.2);
  return (
    <g opacity={fade}>
      <rect width={1920} height={1080} fill="#FF2A3A" opacity={0.12 * (1 - cl((t - at) / 0.5))} />
      {rays.map((a, i) => { const L = (400 + (i * 131) % 500) * k; const mx = x + Math.cos(a) * L * 0.5 + ((i * 37) % 40) - 20, my = y + Math.sin(a) * L * 0.5 + ((i * 53) % 40) - 20; return <path key={i} d={`M${x},${y} L${mx},${my} L${x + Math.cos(a) * L},${y + Math.sin(a) * L}`} stroke="#FFFFFF" strokeWidth={4} fill="none" opacity={0.85} />; })}
      {[120, 240, 380].map((r, i) => <path key={i} d={rays.map((a, j) => `${j ? "L" : "M"}${x + Math.cos(a) * r * k},${y + Math.sin(a) * r * k}`).join(" ") + "Z"} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.6} />)}
    </g>
  );
};

/** katlanmış kopya kâğıdı */
export const Kopya: React.FC<{ x: number; y: number; s?: number; t?: number; glow?: number; open?: number }> = ({ x, y, s = 1, t = 0, glow = 0, open = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(-8)`}>
    {glow > 0 && <circle r={140} fill="#FF4A5A" opacity={glow * (0.15 + 0.1 * Math.sin(t * 6))} />}
    <rect x={-90} y={-50} width={180 + open * 80} height={100} fill="#FFFAEE" stroke={INK} strokeWidth={4} />
    {open > 0 ? Array.from({ length: 5 }, (_, i) => <text key={i} x={-76} y={-24 + i * 18} fontFamily="Poppins" fontWeight={700} fontSize={16} fill={INK}>{`${i + 1}-${"ABCDE"[(i * 3) % 5]}  ${i + 6}-${"ABCDE"[(i * 2) % 5]}  ${i + 11}-${"ABCDE"[(i * 4) % 5]}`}</text>) : <path d="M-90,0 H90" stroke="#C9C1AE" strokeWidth={3} />}
  </g>
);

/** apartman merdiveni: basamaklar, tırabzan, kat numarası */
export const Merdiven: React.FC<{ t: number; floor?: string }> = ({ t, floor = "4" }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9DDC5" />
    <rect width={1920} height={460} fill="#D9CBAE" />
    {Array.from({ length: 9 }, (_, i) => <g key={i}><rect x={300 + i * 150} y={1080 - (i + 1) * 90} width={1920} height={90} fill={i % 2 ? "#B9A88A" : "#C6B596"} stroke="#8A7A5A" strokeWidth={3} /></g>)}
    <path d={Array.from({ length: 10 }, (_, i) => `${i ? "L" : "M"}${300 + i * 150},${1080 - i * 90 - 150}`).join(" ")} stroke="#5A3A20" strokeWidth={16} fill="none" />
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={296 + i * 150} y={1080 - i * 90 - 150} width={8} height={150} fill="#5A3A20" />)}
    <g transform="translate(1600,200)"><rect x={-80} y={-60} width={160} height={120} rx={14} fill="#2A5DA8" /><text y={36} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={90} fill="#FFFFFF">{floor}</text></g>
    <g transform="translate(260,260)"><rect x={-130} y={-180} width={260} height={360} fill="#9AA3AB" stroke="#5E6670" strokeWidth={6} /><rect x={-120} y={-170} width={240} height={340} fill="#BFC7CF" /><text y={10} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={34} fill={T.red}>ARIZALI</text></g>
  </g>
);

/** silinen formüller: defter sayfası, satırlar k oranında soluklaşır */
export const Formul: React.FC<{ t: number; fade?: number; lines?: string[] }> = ({ t, fade = 0, lines = ["H₂O → H⁺ + OH⁻", "n = m / M", "PV = nRT", "C = n / V", "ΔH < 0"] }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A3346" />
    <g transform="translate(960,560) rotate(-2)">
      <rect x={-620} y={-400} width={1240} height={800} rx={10} fill="#FFFDF4" stroke={INK} strokeWidth={6} />
      {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M-580,${-330 + i * 62} H580`} stroke="#BFD6E8" strokeWidth={3} />)}
      <path d="M-480,-400 V400" stroke="#E86A6A" strokeWidth={4} />
      {lines.map((l, i) => { const f = cl(fade * 1.6 - i * 0.15); return <text key={i} x={-440} y={-260 + i * 124} fontFamily="Poppins" fontWeight={700} fontSize={64} fill={INK} opacity={1 - f} style={{ filter: `blur(${f * 6}px)` }}>{l}</text>; })}
    </g>
  </g>
);

/** Üsküdar ahşap ev içi: eski koltuk, sehpa, gazete, cumba penceresi */
export const AhsapEv: React.FC<{ t: number; dusk?: number }> = ({ t, dusk = 0.6 }) => (
  <g>
    <rect width={1920} height={1080} fill="#C9A77A" />
    {Array.from({ length: 16 }, (_, i) => <rect key={i} x={i * 120} y={0} width={118} height={820} fill={i % 2 ? "#BE9A6C" : "#C9A77A"} />)}
    <g transform="translate(1400,380)"><rect x={-240} y={-240} width={480} height={420} fill="#5A3A20" /><rect x={-220} y={-220} width={440} height={380} fill={dusk ? "#F2A86A" : "#BFE3F2"} />{[0, 1].map((i) => <rect key={i} x={-220 + i * 220} y={-220} width={6} height={380} fill="#5A3A20" />)}<rect x={-220} y={-30} width={440} height={6} fill="#5A3A20" /><path d="M-220,-220 Q-100,-60 -220,160Z" fill="#E9D6B0" opacity={0.85} /><path d="M220,-220 Q100,-60 220,160Z" fill="#E9D6B0" opacity={0.85} /></g>
    <rect y={820} width={1920} height={260} fill="#7A5434" />
    {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 200} y={820} width={4} height={260} fill="#5A3A20" />)}
    <ellipse cx={760} cy={960} rx={500} ry={70} fill="#8E2F2A" opacity={0.9} />
    {/* koltuk */}
    <g transform="translate(560,1000)"><rect x={-200} y={-300} width={400} height={300} rx={50} fill="#5A6A3A" stroke={INK} strokeWidth={6} /><rect x={-240} y={-160} width={80} height={160} rx={30} fill="#6E7E44" stroke={INK} strokeWidth={5} /><rect x={160} y={-160} width={80} height={160} rx={30} fill="#6E7E44" stroke={INK} strokeWidth={5} /></g>
    {/* sehpa: ilaç, bardak */}
    <g transform="translate(960,900)"><rect x={-120} y={-20} width={240} height={20} fill="#5A3A20" /><rect x={-100} y={0} width={14} height={90} fill="#5A3A20" /><rect x={86} y={0} width={14} height={90} fill="#5A3A20" /><rect x={-70} y={-70} width={40} height={50} rx={6} fill="#FFFFFF" stroke={INK} strokeWidth={3} /><rect x={-70} y={-82} width={40} height={14} fill={T.red} /><rect x={20} y={-80} width={36} height={60} rx={6} fill="#C9E6F2" stroke={INK} strokeWidth={3} /></g>
    <rect width={1920} height={1080} fill="#FFB060" opacity={0.08 + 0.04 * Math.sin(t)} />
  </g>
);

/** internet kafe: monitör sırası, mavi ışık */
export const NetKafe: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#141A2E" />
    {Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${220 + i * 370},560)`}><rect x={-150} y={-200} width={300} height={200} rx={12} fill="#1C1C1C" /><rect x={-138} y={-188} width={276} height={176} fill={["#2A5DA8", "#3FAE6A", "#7E5BD6", "#E0393E", "#F28C28"][i]} opacity={0.6 + 0.3 * Math.sin(t * 5 + i)} /><rect x={-20} y={0} width={40} height={60} fill="#333" /></g>)}
    <rect y={640} width={1920} height={60} fill="#3A3A46" />
    <rect y={700} width={1920} height={380} fill="#22222C" />
  </g>
);

export const _md = md;
