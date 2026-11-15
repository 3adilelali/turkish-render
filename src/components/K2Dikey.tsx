import React from "react";
import { T, lerp } from "./Toon";
import { Simit } from "./K2Kit";

// Kanal 2 · dikey short kiti (2026-11-15, sh2-01'den). Hepsi 1920×1080 sahnede çizilir ama
// içerik ortadaki 608px şeritte (x 656–1264) durur: k2s-common/Vert.tsx bu şeridi 1080×1920'e büyütür.
// Galata (uzun kule, teras, Karaköy çatıları, simitçi sokağı), Lira (1 TL, takla atar), Hiz (kadran), Yagmur, El.

const md = (v: number, m: number) => ((v % m) + m) % m;
const TQ = "#2EE6D0";

// ── 1 TL: dış halka sarı (pirinç), iç gümüş. spin: takla açısı (radyan) → dikey basıklık
export const Lira: React.FC<{ x: number; y: number; s?: number; spin?: number; glow?: number }> = ({ x, y, s = 1, spin = 0, glow = 0 }) => {
  const sy = Math.abs(Math.cos(spin)) * 0.92 + 0.08;
  const edge = Math.cos(spin) < 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {glow > 0 && <circle r={70} fill={TQ} opacity={0.25 * glow} />}
      <g transform={`scale(1,${sy})`}>
        <circle r={34} fill={edge ? "#B8902E" : "#E2B84A"} stroke="#7A5A14" strokeWidth={3} />
        <circle r={22} fill={edge ? "#9AA3A8" : "#D9DEE1"} stroke="#7E868A" strokeWidth={2} />
        {!edge && <text y={11} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#5E666A">1</text>}
        <ellipse cx={-10} cy={-14} rx={9} ry={4} fill="#FFFFFF" opacity={0.55} />
      </g>
    </g>
  );
};

// ── Galata Kulesi + Karaköy. zoom için kule ortada (x=960). teras: y≈300. dusk 0 gündüz → 1 gün batımı
export const GK = { terrace: 300, top: 90, base: 1000, x: 960 };
export const Galata: React.FC<{ t: number; dusk?: number; gull?: boolean }> = ({ t, dusk = 0, gull = true }) => {
  const sky = dusk > 0.5 ? "url(#tSkyDusk)" : "url(#tSkyDay)";
  return (
    <g>
      <rect width={1920} height={1080} fill={sky} />
      {/* uzak Haliç + karşı kıyı */}
      <rect y={760} width={1920} height={60} fill="#7FB7C9" opacity={0.7} />
      <path d="M0,770 L120,740 L200,755 L260,700 L300,760 L1920,760 L1920,780 L0,790Z" fill="#9FB6C2" opacity={0.6} />
      {[180, 1600].map((cx, i) => <g key={i} opacity={0.5}><path d={`M${cx - 60},760 Q${cx},680 ${cx + 60},760Z`} fill="#8FA5B2" /><rect x={cx - 74} y={640} width={8} height={120} fill="#8FA5B2" /><rect x={cx + 66} y={640} width={8} height={120} fill="#8FA5B2" /></g>)}
      {/* Karaköy çatıları */}
      {Array.from({ length: 16 }, (_, i) => {
        const x = i * 128 - 20, h = 180 + ((i * 53) % 120);
        const c = ["#E9C9A0", "#F1DDBE", "#D9A982", "#EAD8C0", "#C98E6A"][i % 5];
        return <g key={i}><rect x={x} y={1040 - h} width={124} height={h} fill={c} /><path d={`M${x - 6},${1040 - h} L${x + 62},${1040 - h - 46} L${x + 130},${1040 - h}Z`} fill="#B5543C" />
          {Array.from({ length: 3 }, (_, k) => <rect key={k} x={x + 16 + k * 36} y={1060 - h + 20} width={20} height={30} fill={dusk > 0.5 ? "#FFD98A" : "#7FA9C0"} />)}</g>;
      })}
      {/* kule gövdesi (taş silindir) */}
      <g>
        <path d={`M${GK.x - 118},1040 L${GK.x - 104},360 L${GK.x + 104},360 L${GK.x + 118},1040Z`} fill="#D8C7A8" />
        <path d={`M${GK.x + 20},1040 L${GK.x + 28},360 L${GK.x + 104},360 L${GK.x + 118},1040Z`} fill="#000" opacity={0.12} />
        {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M${GK.x - 116 + i * 0.7},${1040 - i * 34} H${GK.x + 116 - i * 0.7}`} stroke="#8E7A5A" strokeOpacity={0.25} strokeWidth={2} />)}
        {[520, 660, 800, 920].map((y, i) => <g key={i}>{[-60, 0, 60].map((dx) => <path key={dx} d={`M${GK.x + dx - 10},${y + 34} V${y} Q${GK.x + dx},${y - 14} ${GK.x + dx + 10},${y} V${y + 34}Z`} fill="#3B3A44" />)}</g>)}
        {/* üst kat: kemerli pencereler */}
        <rect x={GK.x - 108} y={300} width={216} height={64} fill="#CDBB98" />
        {Array.from({ length: 7 }, (_, i) => <path key={i} d={`M${GK.x - 96 + i * 30},360 V326 Q${GK.x - 86 + i * 30},310 ${GK.x - 76 + i * 30},326 V360Z`} fill={dusk > 0.5 ? "#FFD98A" : "#4A5A6E"} />)}
        {/* teras korkuluğu */}
        <rect x={GK.x - 132} y={GK.terrace - 8} width={264} height={14} fill="#6E5A40" />
        {Array.from({ length: 14 }, (_, i) => <rect key={i} x={GK.x - 128 + i * 19} y={GK.terrace - 34} width={5} height={28} fill="#6E5A40" />)}
        <rect x={GK.x - 132} y={GK.terrace - 38} width={264} height={6} fill="#6E5A40" />
        {/* külah */}
        <rect x={GK.x - 100} y={230} width={200} height={62} fill="#D8C7A8" />
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={GK.x - 86 + i * 30} y={244} width={14} height={34} fill="#4A5A6E" />)}
        <path d={`M${GK.x - 112},232 L${GK.x},${GK.top} L${GK.x + 112},232Z`} fill="#4E6E78" />
        <path d={`M${GK.x},${GK.top} L${GK.x + 112},232 L${GK.x + 30},232Z`} fill="#000" opacity={0.15} />
        <path d={`M${GK.x},${GK.top} V${GK.top - 40}`} stroke="#C9A24A" strokeWidth={6} />
        <circle cx={GK.x} cy={GK.top - 44} r={9} fill="#E2B84A" />
      </g>
      {/* sokak */}
      <rect y={1040} width={1920} height={40} fill="#9C8F80" />
      <rect y={1036} width={1920} height={6} fill="#C9BBA8" />
      {gull && Array.from({ length: 4 }, (_, i) => {
        const x = md(i * 320 + t * (40 + i * 9), 1400) + 260, y = 160 + i * 70 + Math.sin(t * 2 + i) * 14;
        const f = Math.sin(t * 9 + i) * 10;
        return <path key={i} d={`M${x - 22},${y + f} Q${x - 10},${y - 8} ${x},${y} Q${x + 10},${y - 8} ${x + 22},${y + f}`} fill="none" stroke="#FFFFFF" strokeWidth={5} strokeLinecap="round" />;
      })}
    </g>
  );
};

// ── simitçi sokağı (yakın plan zemin): taş kaldırım, simit tezgâhı, dükkân camı
export const SimitSokak: React.FC<{ t: number }> = () => (
  <g>
    <rect width={1920} height={1080} fill="#F1DDBE" />
    <rect x={560} y={120} width={800} height={560} fill="#E6CDA8" />
    <rect x={620} y={200} width={300} height={380} fill="#9CC7D9" stroke="#7A4526" strokeWidth={14} />
    <rect x={1000} y={200} width={300} height={380} fill="#9CC7D9" stroke="#7A4526" strokeWidth={14} />
    <rect x={600} y={120} width={720} height={60} fill="#B23A3F" />
    <text x={960} y={164} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={42} fill="#FFF">GALATA FIRINI</text>
    <rect y={760} width={1920} height={320} fill="#A99A86" />
    {Array.from({ length: 40 }, (_, i) => <rect key={i} x={(i % 10) * 200 - (Math.floor(i / 10) % 2) * 100} y={770 + Math.floor(i / 10) * 80} width={190} height={70} rx={10} fill="#B9AB97" />)}
    {/* tezgâh */}
    <g transform="translate(1150,770)">
      <rect x={-110} y={-150} width={220} height={150} rx={10} fill="#C0392B" />
      <rect x={-120} y={-170} width={240} height={26} rx={8} fill="#F4F4F2" />
      {[-70, 0, 70].map((dx, i) => <Simit key={i} x={dx} y={-200 - (i % 2) * 18} s={1.1} />)}
      <circle cx={-80} cy={0} r={22} fill="#333" /><circle cx={80} cy={0} r={22} fill="#333" />
    </g>
    <ellipse cx={960} cy={1020} rx={600} ry={30} fill="#000" opacity={0.06} />
  </g>
);

// ── hız kadranı. v: km/s, max: tam ölçek. label altta
export const Hiz: React.FC<{ x?: number; y?: number; s?: number; v: number; max?: number; c?: string; label?: string; t?: number }> = ({ x = 960, y = 560, s = 1, v, max = 140, c = TQ, label = "KM/S", t = 0 }) => {
  const k = Math.max(0, Math.min(1, v / max));
  const ang = -120 + 240 * k + Math.sin(t * 30) * 0.8;
  const arc = (a0: number, a1: number, r: number) => {
    const p = (a: number) => [Math.sin((a * Math.PI) / 180) * r, -Math.cos((a * Math.PI) / 180) * r];
    const [x0, y0] = p(a0), [x1, y1] = p(a1);
    return `M${x0},${y0} A${r},${r} 0 ${a1 - a0 > 180 ? 1 : 0} 1 ${x1},${y1}`;
  };
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <circle r={250} fill="#0E1A2E" stroke="#1E3A64" strokeWidth={10} />
      <path d={arc(-120, 120, 200)} stroke="#24406A" strokeWidth={30} fill="none" strokeLinecap="round" />
      <path d={arc(-120, -120 + 240 * k + 0.01, 200)} stroke={c} strokeWidth={30} fill="none" strokeLinecap="round" />
      {Array.from({ length: 8 }, (_, i) => { const a = -120 + i * (240 / 7); const r1 = 160, r2 = 178; const sx = Math.sin((a * Math.PI) / 180), sy = -Math.cos((a * Math.PI) / 180); return <path key={i} d={`M${sx * r1},${sy * r1} L${sx * r2},${sy * r2}`} stroke="#8FB0D8" strokeWidth={6} />; })}
      <g transform={`rotate(${ang})`}><path d="M-10,0 L0,-170 L10,0Z" fill="#FFFFFF" /></g>
      <circle r={22} fill="#FFFFFF" />
      <text y={110} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={92} fill="#FFFFFF">{Math.round(v)}</text>
      <text y={165} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={40} fill="#8FB0D8">{label}</text>
    </g>
  );
};

// ── yağmur (ön plan). k: yoğunluk
export const Yagmur: React.FC<{ t: number; k?: number }> = ({ t, k = 1 }) => (
  <g pointerEvents="none" opacity={k}>
    {Array.from({ length: 70 }, (_, i) => {
      const x = md(i * 137, 1920), y = md(i * 211 + t * (900 + (i % 5) * 120), 1200) - 60;
      return <path key={i} d={`M${x},${y} l-6,34`} stroke="#DFF3FF" strokeWidth={4} strokeLinecap="round" opacity={0.7} />;
    })}
  </g>
);

// ── yakın plan el (avuç yukarı), ortada. hit: 0→1 kızarıklık
export const El: React.FC<{ x?: number; y?: number; s?: number; hit?: number }> = ({ x = 960, y = 760, s = 1, hit = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <path d="M-150,260 L-130,40 Q-150,-40 -110,-70 L-100,-200 Q-96,-230 -70,-228 Q-46,-226 -46,-196 L-44,-80 L-36,-250 Q-32,-280 -6,-278 Q20,-276 20,-246 L18,-86 L30,-236 Q34,-262 58,-260 Q82,-256 80,-228 L72,-70 L96,-170 Q104,-194 126,-188 Q148,-180 142,-152 L110,40 L120,260Z" fill="#FBE7D2" stroke="#3A2A20" strokeWidth={8} strokeLinejoin="round" />
    {hit > 0 && <ellipse cx={-14} cy={-10} rx={56} ry={40} fill="#E86A6A" opacity={0.45 * hit} />}
  </g>
);

// ── düşüş izi (hareket çizgileri) bir noktanın üstünde
export const Iz: React.FC<{ x: number; y: number; n?: number; len?: number; c?: string }> = ({ x, y, n = 4, len = 120, c = "#FFFFFF" }) => (
  <g opacity={0.7}>{Array.from({ length: n }, (_, i) => <path key={i} d={`M${x - 24 + i * 16},${y - 40 - (i % 2) * 20} v${-len + (i % 2) * 30}`} stroke={c} strokeWidth={6} strokeLinecap="round" opacity={0.5 + 0.12 * i} />)}</g>
);

export const _k2d = { lerp, T };
