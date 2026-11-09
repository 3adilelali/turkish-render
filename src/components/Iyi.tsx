import React from "react";

// Kanal 2 · k2r-13 İyileşme: röntgen, yakıt göstergesi, tartı, açık buzdolabı, iskele, iyileşme ışıltısı.
const LN = "#1A1A22";
const cl = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const md = (v: number, m: number) => ((v % m) + m) % m;

// İyileşme ışıltısı: turuncu-sıcak halka ve kıvılcımlar (kan yok)
export const Isil: React.FC<{ x: number; y: number; t: number; r?: number; k?: number }> = ({ x, y, t, r = 90, k = 1 }) => (
  <g opacity={k}>
    <circle cx={x} cy={y} r={r * (1 + Math.sin(t * 6) * 0.08)} fill="#FFB040" opacity={0.25} />
    <circle cx={x} cy={y} r={r * 0.6} fill="#FFE2A0" opacity={0.35} />
    {Array.from({ length: 8 }, (_, i) => { const p = md(t * 0.8 + i / 8, 1); const a = i * 0.8 + t; return <circle key={i} cx={x + Math.cos(a) * r * (0.4 + p)} cy={y + Math.sin(a) * r * (0.4 + p) - p * 40} r={5 * (1 - p)} fill="#FFF2C0" />; })}
  </g>
);

// Röntgen: el kemikleri. bent: 0 düz, 1 eğri kaynamış. glow: kaynama yeri.
export const Rontgen: React.FC<{ t: number; bent?: number; glow?: number; label?: string }> = ({ t, bent = 0, glow = 0, label }) => (
  <g>
    <rect width={1920} height={1080} fill="#0A1018" />
    <g transform="translate(960,560)">
      <rect x={-460} y={-470} width={920} height={900} rx={20} fill="#16222E" stroke="#4A6A80" strokeWidth={6} />
      <rect x={-460} y={-470} width={920} height={900} rx={20} fill="#9FD8F0" opacity={0.05 + Math.sin(t * 2) * 0.01} />
      {/* avuç kemikleri */}
      {[-120, -40, 40, 120].map((x, i) => <rect key={i} x={x - 18} y={0} width={36} height={220} rx={16} fill="#E8F4FA" opacity={0.85} />)}
      {/* parmaklar: ikisi eğri kaynayabilir */}
      {[-120, -40, 40, 120].map((x, i) => {
        const b = i === 1 || i === 2 ? bent : 0;
        const ang = (i === 1 ? -1 : 1) * b * 28;
        return <g key={`f${i}`} transform={`translate(${x},0)`}>
          <rect x={-16} y={-150} width={32} height={140} rx={14} fill="#E8F4FA" opacity={0.9} />
          <g transform={`translate(0,-160) rotate(${ang})`}><rect x={-14} y={-130} width={28} height={120} rx={12} fill="#E8F4FA" opacity={0.9} /><rect x={-12} y={-230} width={24} height={90} rx={10} fill="#E8F4FA" opacity={0.9} /></g>
          {b > 0.2 && <circle cy={-160} r={26} fill="none" stroke="#F05A4A" strokeWidth={6} opacity={b} />}
        </g>;
      })}
      <g transform="translate(-230,120) rotate(-40)"><rect x={-18} y={-180} width={36} height={180} rx={16} fill="#E8F4FA" opacity={0.85} /></g>
      {glow > 0 && [-40, 40].map((x, i) => <circle key={i} cx={x} cy={-160} r={60} fill="#FFB040" opacity={glow * (0.3 + Math.sin(t * 6 + i) * 0.1)} />)}
      {label && <text y={400} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={52} fill={bent > 0.5 ? "#F05A4A" : "#2EE6D0"}>{label}</text>}
    </g>
  </g>
);

// Yakıt göstergesi (beden deposu). v: 0..1. kcal yazısı.
export const Yakit: React.FC<{ t: number; v: number; x?: number; y?: number; s?: number; kcal?: string }> = ({ t, v, x = 960, y = 540, s = 1, kcal }) => {
  const th = Math.PI + Math.PI * cl(v), c = v < 0.25 ? "#F05A4A" : v < 0.6 ? "#F6C445" : "#3FAE6A";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-380} y={-320} width={760} height={520} rx={40} fill="#14203A" stroke="#2EE6D0" strokeWidth={5} />
      <path d="M-260,60 A260,260 0 0 1 260,60" stroke="#2A3A5A" strokeWidth={46} fill="none" />
      <path d={`M-260,60 A260,260 0 0 1 ${Math.cos(th) * 260},${60 + Math.sin(th) * 260}`} stroke={c} strokeWidth={46} fill="none" />
      <g transform={`translate(0,60) rotate(${-90 + cl(v) * 180 + (v < 0.15 ? Math.sin(t * 20) * 3 : 0)})`}><path d="M-10,0 L0,-230 L10,0Z" fill="#FFFFFF" /></g>
      <circle cy={60} r={22} fill="#FFFFFF" />
      <text x={-300} y={140} fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#F05A4A">B</text>
      <text x={270} y={140} fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#3FAE6A">D</text>
      <text y={-250} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={44} fill="#9FE8F0">BEDEN YAKITI</text>
      {kcal && <text y={170} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={54} fill="#FFFFFF">{kcal}</text>}
    </g>
  );
};

// Banyo tartısı: kg göstergesi
export const Tarti: React.FC<{ t: number; kg: number; from?: number; at?: number; x?: number; y?: number; s?: number }> = ({ t, kg, from, at = 0, x = 960, y = 760, s = 1 }) => {
  const p = from === undefined ? 1 : cl((t - at) / 1.2);
  const v = from === undefined ? kg : from + (kg - from) * p;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-260} y={-60} width={520} height={120} rx={40} fill="#E9EEF2" stroke={LN} strokeWidth={6} />
      <rect x={-130} y={-40} width={260} height={70} rx={12} fill="#1E2A40" />
      <text y={14} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={46} fill={v < (from ?? kg) - 0.5 ? "#F05A4A" : "#2EE6D0"}>{v.toFixed(1)} kg</text>
    </g>
  );
};

// Açık buzdolabı: raflardaki yiyecekler empty ile kaybolur
export const AcikDolap: React.FC<{ t: number; empty?: number; night?: number }> = ({ t, empty = 0, night = 1 }) => {
  const items = ["#F6C445", "#E0393E", "#F4F4F2", "#3FAE6A", "#C8743A", "#E86A92", "#F6C445", "#7E5BD6", "#F28C28"];
  return (
    <g>
      <rect width={1920} height={1080} fill={night ? "#1A1E2C" : "#E9E2D2"} />
      <path d="M960,240 L620,1080 L1300,1080Z" fill="#FFF6D8" opacity={0.12} />
      <g transform="translate(960,560)">
        <rect x={-300} y={-440} width={600} height={880} rx={24} fill="#F4F6F8" stroke={LN} strokeWidth={6} />
        <rect x={-280} y={-420} width={560} height={840} fill="#FFFBEF" />
        {[-220, -20, 180].map((y) => <rect key={y} x={-280} y={y} width={560} height={12} fill="#CFE0E6" />)}
        {items.map((c, i) => { const gone = cl(empty * items.length - i); return <g key={i} opacity={1 - gone} transform={`translate(${-180 + (i % 3) * 180},${-260 + Math.floor(i / 3) * 200 - gone * 30})`}>{i % 3 === 0 ? <ellipse rx={60} ry={34} fill={c} stroke={LN} strokeWidth={4} /> : i % 3 === 1 ? <rect x={-40} y={-70} width={80} height={110} rx={12} fill={c} stroke={LN} strokeWidth={4} /> : <><ellipse cy={10} rx={70} ry={26} fill="#F4F4F2" stroke={LN} strokeWidth={4} /><ellipse cy={-4} rx={50} ry={18} fill={c} /></>}</g>; })}
      </g>
      <rect x={1260} y={120} width={40} height={880} rx={10} fill="#D9DEE4" stroke={LN} strokeWidth={5} />
    </g>
  );
};

// İnşaat iskelesi: fall 0..1 ile boruların düşmesi
export const Iskele: React.FC<{ t: number; fall?: number; dusk?: number }> = ({ t, fall = 0, dusk = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={dusk ? "#E9B98C" : "#BFE3F2"} />
    <rect x={900} y={120} width={900} height={760} fill="#D8C7A4" stroke={LN} strokeWidth={5} />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={960 + (i % 4) * 210} y={180 + Math.floor(i / 4) * 220} width={130} height={150} fill="#8FB4C8" stroke={LN} strokeWidth={4} />)}
    <rect y={880} width={1920} height={200} fill="#8E8778" />
    {Array.from({ length: 6 }, (_, c) => Array.from({ length: 4 }, (_, r) => { const i = c * 4 + r; const f = cl(fall * 2 - rnd(i) * 0.8); const x = 820 + c * 120, y = 200 + r * 170; return <g key={i} transform={`translate(${x + f * (rnd(i + 3) - 0.5) * 400},${y + f * (820 - y)}) rotate(${f * (rnd(i + 5) - 0.5) * 140})`}><rect x={-6} y={-90} width={12} height={180} fill="#9AA3AD" stroke={LN} strokeWidth={3} /><rect x={-60} y={-8} width={120} height={14} fill="#B08A4A" stroke={LN} strokeWidth={3} /></g>; }))}
    {fall > 0.3 && Array.from({ length: 10 }, (_, i) => { const p = md(t * 0.3 + rnd(i), 1); return <circle key={`d${i}`} cx={800 + rnd(i) * 800} cy={880 - p * 300} r={60 + rnd(i) * 80} fill="#C9BBA0" opacity={0.3 * (1 - p) * cl(fall * 2 - 0.6)} />; })}
  </g>
);

export const _iyi = { cl };
