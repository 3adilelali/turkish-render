import React from "react";
import { T, TMini, MINI_COLS, lerp } from "./Toon";

// Kanal 2 · dikey short kiti 2 (2026-11-16, sh2-02…sh2-10). K2Dikey.tsx gibi: 1920×1080 sahne, içerik x 656–1264 şeridinde.
// TV, Kabin (asansör içi), Kuyu (asansör kuyusu kesiti), Raf (market rafı), FiyatKart, Dunya, Ziplayanlar,
// BaklavaMasa, BogazKesit, Tup (Marmaray), BogazHarita, Yuzucu, GeceSehir, Saat.

const md = (v: number, m: number) => ((v % m) + m) % m;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const TQ = "#2EE6D0";
const FB = { y: "#F6D21E", n: "#14275E" };
const GS = { y: "#F6B31E", r: "#B3182B" };
export const FORMA = { FB, GS };

// ── televizyon: maç yayını. score "1 - 0", flash: gol anı
export const TV: React.FC<{ x?: number; y?: number; s?: number; t: number; score?: string; flash?: number; side?: "FB" | "GS" }> = ({ x = 960, y = 480, s = 1, t, score = "0 - 0", flash = 0, side = "FB" }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-250} y={-160} width={500} height={310} rx={18} fill="#1A1A1E" />
    <rect x={-232} y={-142} width={464} height={262} rx={6} fill="#3E9E52" />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-232 + i * 78} y={-142} width={39} height={262} fill="#48AA5C" />)}
    <circle cx={0} cy={-10} r={44} fill="none" stroke="#FFFFFF" strokeWidth={4} opacity={0.7} />
    <path d="M0,-142 V120" stroke="#FFFFFF" strokeWidth={4} opacity={0.7} />
    {[0, 1, 2, 3].map((i) => <circle key={i} cx={-150 + i * 90 + Math.sin(t * 2 + i) * 20} cy={-40 + (i % 2) * 60} r={10} fill={i % 2 ? GS.r : FB.y} />)}
    <rect x={-232} y={-142} width={190} height={46} fill="#0E1A2E" opacity={0.9} />
    <text x={-137} y={-109} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#FFFFFF">FB {score} GS</text>
    {flash > 0 && <rect x={-232} y={-142} width={464} height={262} fill={side === "FB" ? FB.y : GS.r} opacity={0.55 * flash} />}
    {flash > 0 && <text y={30} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={110} fill="#FFFFFF" opacity={flash}>GOL!</text>}
    <rect x={-60} y={150} width={120} height={20} fill="#2A2A2E" /><rect x={-140} y={168} width={280} height={14} rx={6} fill="#2A2A2E" />
  </g>
);

// ── asansör içi (önden). floor: göstergede yazı, dark: ışık kesik, alarm: alarm düğmesi yanar
export const Kabin: React.FC<{ t: number; floor?: string; dark?: number; alarm?: number }> = ({ t, floor = "7", dark = 0, alarm = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#9AA4AC" />
    <rect x={600} y={0} width={720} height={1080} fill="#B9C2C9" />
    {Array.from({ length: 8 }, (_, i) => <rect key={i} x={600 + i * 90} y={0} width={4} height={1080} fill="#FFFFFF" opacity={0.25} />)}
    {/* kapı */}
    <rect x={700} y={230} width={520} height={760} fill="#8E989F" stroke="#6E777D" strokeWidth={8} />
    <path d="M960,230 V990" stroke="#4E555A" strokeWidth={8} />
    <rect x={700} y={230} width={520} height={760} fill="url(#tScan)" opacity={0.25} />
    {/* gösterge */}
    <rect x={880} y={120} width={160} height={80} rx={10} fill="#141414" />
    <text x={960} y={180} textAnchor="middle" fontFamily="monospace" fontWeight={800} fontSize={56} fill="#FF5A3C" opacity={0.6 + 0.4 * Math.sin(t * 6)}>{floor}</text>
    {/* düğme paneli */}
    <rect x={1160} y={420} width={80} height={330} rx={10} fill="#D9DEE1" stroke="#7E868A" strokeWidth={4} />
    {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={1200} cy={450 + i * 34} r={12} fill="#9AA3A8" />)}
    <circle cx={1200} cy={720} r={20} fill={alarm > 0 && Math.sin(t * 14) > 0 ? "#FFD23C" : "#E0B020"} stroke="#7A5A14" strokeWidth={4} />
    {alarm > 0 && <circle cx={1200} cy={720} r={50} fill="#FFD23C" opacity={0.3 * alarm} />}
    {/* tavan ışığı */}
    <rect x={760} y={20} width={400} height={30} rx={14} fill={dark > 0.5 ? "#555" : "#FFF7D0"} />
    <rect y={1000} width={1920} height={80} fill="#5E666C" />
    {dark > 0 && <rect width={1920} height={1080} fill="#0A0E16" opacity={0.65 * dark} />}
  </g>
);

// ── asansör kuyusu kesiti: raylar, kabin, halatlar, karşı ağırlık. cut: kopan halat sayısı, brake: fren kilitlendi
export const Kuyu: React.FC<{ t: number; carY?: number; ropes?: number; cut?: number; brake?: number }> = ({ t, carY = 520, ropes = 4, cut = 0, brake = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A2F36" />
    <rect x={680} y={0} width={560} height={1080} fill="#3A4048" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M680,${i * 90} H1240`} stroke="#000" strokeOpacity={0.2} strokeWidth={4} />)}
    {/* raylar */}
    <rect x={720} y={0} width={18} height={1080} fill="#9AA3A8" /><rect x={1182} y={0} width={18} height={1080} fill="#9AA3A8" />
    {/* halatlar */}
    {Array.from({ length: ropes }, (_, i) => {
      const x = 900 + i * 40, broken = i < cut;
      return broken
        ? <path key={i} d={`M${x},0 V${carY - 300 - Math.sin(t * 5 + i) * 20} q10,30 -6,50`} stroke="#C9CDD0" strokeWidth={8} fill="none" />
        : <path key={i} d={`M${x},0 V${carY - 160}`} stroke="#C9CDD0" strokeWidth={8} />;
    })}
    {/* kabin */}
    <g transform={`translate(0,${carY})`}>
      <rect x={760} y={-160} width={400} height={340} rx={10} fill="#B9C2C9" stroke="#6E777D" strokeWidth={8} />
      <rect x={800} y={-120} width={320} height={260} fill="#8E989F" />
      <path d="M960,-120 V140" stroke="#4E555A" strokeWidth={6} />
      {/* fren pabuçları */}
      {[738, 1158].map((x, i) => <rect key={i} x={x - (i ? 0 : 24)} y={130} width={28} height={50} rx={6} fill={brake > 0 ? "#FF5A3C" : "#6E777D"} />)}
      {brake > 0 && [738, 1182].map((x, i) => <circle key={i} cx={x} cy={150} r={40} fill="#FF5A3C" opacity={0.35 * brake} />)}
    </g>
    {/* karşı ağırlık */}
    <rect x={1205} y={1080 - carY - 200} width={30} height={160} fill="#6E777D" />
  </g>
);

// ── market rafı (ortada 4 kat). hl: vurgulanan kat (0 üst … 3 alt). gevrek: çocuk katında gözlü kutu (bakış aşağı)
export const RAF_Y = [250, 450, 650, 850];
export const Raf: React.FC<{ t: number; hl?: number; gevrek?: number }> = ({ t, hl = -1, gevrek = 0 }) => {
  const prod = (row: number, i: number) => {
    const x = 690 + i * 96, y = RAF_Y[row];
    const c = row === 1 ? ["#C9A24A", "#2A2E36", "#B23A3F", "#C9A24A", "#1E3A64", "#2A2E36"][i % 6] : row === 3 ? ["#9AA3A8", "#B9C2C9", "#A9B4A0", "#C9C2B0", "#9AA3A8", "#B0A898"][i % 6] : MINI_COLS[(i * 3 + row) % MINI_COLS.length];
    const h = row === 2 ? 120 : 150;
    return <g key={i}><rect x={x} y={y - h} width={82} height={h} rx={6} fill={c} stroke="#00000033" strokeWidth={3} /><rect x={x + 10} y={y - h + 20} width={62} height={22} rx={4} fill="#FFFFFF" opacity={row === 1 ? 0.9 : 0.6} />{row === 1 && <rect x={x + 10} y={y - 40} width={62} height={8} fill="#F6C445" />}</g>;
  };
  return (
    <g>
      <rect width={1920} height={1080} fill="#F2F0EA" />
      <rect x={640} y={60} width={640} height={960} fill="#E2DED4" />
      {RAF_Y.map((y, r) => (
        <g key={r}>
          {Array.from({ length: 6 }, (_, i) => prod(r, i))}
          <rect x={640} y={y} width={640} height={22} fill="#C9C2B0" />
          <rect x={660} y={y + 22} width={600} height={30} fill="#FFFFFF" stroke="#C9C2B0" strokeWidth={2} />
          {hl === r && <rect x={646} y={y - 170} width={628} height={226} rx={10} fill="none" stroke={TQ} strokeWidth={12} opacity={0.6 + 0.4 * Math.sin(t * 6)} />}
        </g>
      ))}
      {gevrek > 0 && (
        <g transform={`translate(${880},${RAF_Y[2] - 70})`} opacity={gevrek}>
          <rect x={-70} y={-110} width={140} height={190} rx={8} fill="#F28C28" stroke="#C76A12" strokeWidth={5} />
          <text y={-70} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={26} fill="#FFFFFF">GEVREK</text>
          <circle cx={-26} cy={-20} r={20} fill="#FFFFFF" /><circle cx={26} cy={-20} r={20} fill="#FFFFFF" />
          <circle cx={-24} cy={-8} r={9} fill="#141414" /><circle cx={28} cy={-8} r={9} fill="#141414" />
          <path d="M-24,30 q24,18 48,0" stroke="#141414" strokeWidth={5} fill="none" />
        </g>
      )}
      <rect y={1020} width={1920} height={60} fill="#D9D3C4" />
    </g>
  );
};

// ── fiyat etiketi. hlLeft: soldaki rakamı büyüt
export const FiyatKart: React.FC<{ x?: number; y?: number; s?: number; t?: number; left: string; rest: string; hlLeft?: number; c?: string; strike?: number }> = ({ x = 960, y = 540, s = 1, t = 0, left, rest, hlLeft = 0, c = "#FFE24A", strike = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${Math.sin(t * 2) * 1.5})`}>
    <rect x={-250} y={-120} width={500} height={240} rx={22} fill={c} stroke="#141414" strokeWidth={8} />
    <text x={-30} y={50} textAnchor="end" fontFamily="Poppins" fontWeight={900} fontSize={150 * (1 + 0.35 * hlLeft)} fill={hlLeft > 0 ? T.red : "#141414"}>{left}</text>
    <text x={-26} y={50} fontFamily="Poppins" fontWeight={900} fontSize={110} fill="#141414" opacity={1 - 0.6 * hlLeft}>{rest}</text>
    {strike > 0 && <path d={`M-220,0 L${lerp(-220, 220, strike)},0`} stroke={T.red} strokeWidth={16} strokeLinecap="round" />}
  </g>
);

// ── dünya. tr: Türkiye işareti, wob: titreşim px
export const Dunya: React.FC<{ x?: number; y?: number; r?: number; t: number; tr?: number; wob?: number }> = ({ x = 960, y = 560, r = 260, t, tr = 1, wob = 0 }) => (
  <g transform={`translate(${x + Math.sin(t * 40) * wob},${y})`}>
    <circle r={r + 30} fill={TQ} opacity={0.12} />
    <circle r={r} fill="#2F7FC1" />
    <path d={`M${-r * 0.7},${-r * 0.3} q${r * 0.3},${-r * 0.4} ${r * 0.6},${-r * 0.1} q${r * 0.2},${r * 0.3} ${-r * 0.1},${r * 0.5} q${-r * 0.4},${r * 0.1} ${-r * 0.5},${-r * 0.4}Z`} fill="#4FA35E" />
    <path d={`M${r * 0.05},${-r * 0.55} q${r * 0.5},${-r * 0.1} ${r * 0.6},${r * 0.25} q${-r * 0.1},${r * 0.35} ${-r * 0.45},${r * 0.25} q${-r * 0.2},${-r * 0.3} ${-r * 0.15},${-r * 0.5}Z`} fill="#5BB06A" />
    <path d={`M${-r * 0.2},${r * 0.3} q${r * 0.3},${-r * 0.05} ${r * 0.35},${r * 0.3} q${-r * 0.15},${r * 0.25} ${-r * 0.35},${r * 0.05}Z`} fill="#4FA35E" />
    <ellipse cx={-r * 0.35} cy={-r * 0.4} rx={r * 0.25} ry={r * 0.12} fill="#FFFFFF" opacity={0.25} />
    {tr > 0 && <g transform={`translate(${r * 0.28},${-r * 0.22})`}><circle r={18 + 6 * Math.sin(t * 6)} fill={T.red} opacity={0.35 * tr} /><circle r={9} fill={T.red} opacity={tr} /></g>}
  </g>
);

// ── zıplayan kalabalık (mini figürler). k: zıplama 0..1 (yükseklik)
export const Ziplayanlar: React.FC<{ t: number; k: number; rows?: number; y0?: number }> = ({ t, k, rows = 5, y0 = 640 }) => (
  <g>
    {Array.from({ length: rows }, (_, r) => Array.from({ length: 9 }, (_, i) => {
      const x = 660 + i * 76 + (r % 2) * 38, y = y0 + r * 90 - k * 120 * (0.85 + 0.15 * Math.sin(i + r));
      return <TMini key={`${r}-${i}`} x={x} y={y} s={0.9 + r * 0.1} c={MINI_COLS[(i + r * 3) % MINI_COLS.length]} t={t} seed={i + r * 9} />;
    }))}
  </g>
);

// ── bayram masası: baklava tepsileri, lokum, kolonya
export const BaklavaMasa: React.FC<{ t: number; take?: number }> = ({ take = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#EEDDC0" />
    <rect y={0} width={1920} height={640} fill="url(#tBrick)" opacity={0.35} />
    <rect x={600} y={140} width={720} height={260} fill="#F7F1E6" stroke="#8A5A32" strokeWidth={14} />
    <text x={960} y={290} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={64} fill="#B23A3F">İYİ BAYRAMLAR</text>
    <rect x={560} y={640} width={800} height={440} fill="#B07A4A" />
    <rect x={560} y={620} width={800} height={40} fill="#C98E5A" />
    {[0, 1, 2, 3].map((i) => {
      const cx = 700 + (i % 2) * 330, cy = 740 + Math.floor(i / 2) * 170;
      return <g key={i}><ellipse cx={cx + 50} cy={cy + 20} rx={150} ry={60} fill="#C9C2B0" stroke="#8A8270" strokeWidth={4} />
        {Array.from({ length: 10 }, (_, k) => <path key={k} d={`M${cx - 50 + (k % 5) * 40},${cy + Math.floor(k / 5) * 34} l20,-14 l20,14 l-20,14Z`} fill={i === 3 ? "#F2E6C8" : "#D9A54A"} stroke="#9A6A20" strokeWidth={2} opacity={i === 0 && k === 4 ? 1 - take : 1} />)}</g>;
    })}
  </g>
);

// ── Boğaz kesiti. water: su seviyesi 0 (boş) → 1 (dolu), flow: akıntı okları, ruler: derinlik cetveli
export const BogazKesit: React.FC<{ t: number; water?: number; flow?: number; ruler?: number; towers?: number; tube?: number; ship?: number }> = ({ t, water = 1, flow = 0, ruler = 0, towers = 0, tube = 0, ship = 1 }) => {
  const top = 240, bot = 960, wy = lerp(bot, top, water);
  return (
    <g>
      <rect width={1920} height={1080} fill="url(#tSkyDay)" />
      {/* yamaçlar */}
      <path d={`M0,${top - 40} L560,${top} Q760,${bot} 960,${bot} Q1160,${bot} 1360,${top} L1920,${top - 40} V1080 H0Z`} fill="#8C6B4A" />
      <path d={`M0,${top - 40} L560,${top} Q760,${bot} 960,${bot} Q1160,${bot} 1360,${top} L1920,${top - 40}`} fill="none" stroke="#5E4428" strokeWidth={8} />
      {[0, 1, 2].map((i) => <rect key={i} x={140 + i * 110} y={top - 130 - i * 20} width={90} height={100 + i * 20} fill="#F1DDBE" />)}
      {[0, 1, 2].map((i) => <rect key={i} x={1460 + i * 110} y={top - 120 - i * 15} width={90} height={90 + i * 15} fill="#EAD8C0" />)}
      {/* su */}
      {water > 0.01 && <path d={`M${lerp(960, 560, cl((bot - wy) / (bot - top)) ** 0.5)},${wy} H${lerp(960, 1360, cl((bot - wy) / (bot - top)) ** 0.5)} L1360,${Math.max(wy, top)} Q1160,${bot} 960,${bot} Q760,${bot} 560,${Math.max(wy, top)}Z`} fill="#2F7FC1" opacity={0.85} />}
      {flow > 0 && water > 0.5 && <g opacity={flow}>
        {[0, 1, 2].map((i) => { const o = md(t * 0.6 + i / 3, 1); return <path key={i} d={`M${700 + o * 420},${top + 50} l60,0 m-20,-16 l20,16 l-20,16`} stroke="#FFFFFF" strokeWidth={8} fill="none" strokeLinecap="round" />; })}
        {[0, 1, 2].map((i) => { const o = md(t * 0.6 + i / 3, 1); return <path key={i} d={`M${1180 - o * 380},${top + 330} l-60,0 m20,-16 l-20,16 l20,16`} stroke="#F6C445" strokeWidth={8} fill="none" strokeLinecap="round" />; })}
        <path d={`M600,${top + 180} H1320`} stroke="#FFFFFF" strokeWidth={3} strokeDasharray="14 12" opacity={0.6} />
      </g>}
      {/* vapur */}
      {ship > 0 && <g transform={`translate(960,${Math.min(wy, bot - 30) - 10}) rotate(${water < 0.1 ? 8 : Math.sin(t * 2) * 2})`}>
        <path d="M-120,0 L120,0 L95,40 L-95,40Z" fill="#F4F4F2" stroke="#2A2E36" strokeWidth={5} />
        <rect x={-80} y={-50} width={160} height={50} fill="#F4F4F2" stroke="#2A2E36" strokeWidth={5} />
        <rect x={-20} y={-90} width={30} height={40} fill="#2A2E36" /><rect x={-20} y={-90} width={30} height={10} fill={T.red} />
      </g>}
      {/* Galata siluetleri */}
      {towers > 0 && [0, 1].map((i) => <g key={i} opacity={cl(towers * 2 - i)} transform={`translate(1060,${bot - i * 360})`}><path d="M-34,0 L-30,-280 L30,-280 L34,0Z" fill="#D8C7A8" stroke="#8E7A5A" strokeWidth={3} /><path d="M-38,-280 L0,-360 L38,-280Z" fill="#4E6E78" /></g>)}
      {/* Marmaray tüpü */}
      {tube > 0 && <g opacity={tube} transform={`translate(960,${bot - 30})`}><rect x={-220} y={-36} width={440} height={60} rx={28} fill="#9AA3A8" stroke="#5E666A" strokeWidth={5} />{[-150, -50, 50, 150].map((x) => <path key={x} d={`M${x},-36 V24`} stroke="#5E666A" strokeWidth={4} />)}<rect x={-200} y={-22} width={400} height={20} fill="#F6E7B0" opacity={0.5 + 0.3 * Math.sin(t * 5)} /></g>}
      {/* cetvel */}
      {ruler > 0 && <g opacity={ruler}><path d={`M1200,${top} V${bot}`} stroke="#FFFFFF" strokeWidth={6} />{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M1186,${top + i * (bot - top) / 11} h28`} stroke="#FFFFFF" strokeWidth={4} />)}<path d={`M1170,${bot} h60`} stroke={T.red} strokeWidth={8} /></g>}
    </g>
  );
};

// ── Boğaz haritası (üstten, dikey): Kanlıca kuzeyde, Kuruçeşme güneyde. k: yüzücünün ilerlemesi, flow: akıntı okları
const BOGAZ_PATH = "M860,40 C900,200 820,300 880,420 C940,540 1080,560 1040,700 C1000,820 900,880 940,1060";
export const BogazHarita: React.FC<{ t: number; k?: number; flow?: number; labels?: boolean }> = ({ t, k = 0, flow = 0, labels = true }) => {
  const pt = (u: number) => { // yaklaşık yol: kübik bezier örneği yerine basit eğri
    const y = lerp(150, 900, u); const x = 900 + Math.sin(u * Math.PI * 1.4 - 0.4) * 90; return [x, y];
  };
  const [sx, sy] = pt(k);
  return (
    <g>
      <rect width={1920} height={1080} fill="#E9DFC8" />
      {Array.from({ length: 40 }, (_, i) => <rect key={i} x={md(i * 173, 1920)} y={md(i * 97, 1080)} width={30} height={22} fill="#D9C9A8" />)}
      <path d={BOGAZ_PATH} stroke="#2F7FC1" strokeWidth={170} fill="none" strokeLinecap="round" />
      <path d={BOGAZ_PATH} stroke="#4E9AD6" strokeWidth={120} fill="none" strokeLinecap="round" />
      {flow > 0 && Array.from({ length: 6 }, (_, i) => { const u = md(t * 0.15 + i / 6, 1); const [x, y] = pt(u); return <path key={i} d={`M${x},${y - 20} v40 m-14,-14 l14,14 l14,-14`} stroke="#FFFFFF" strokeWidth={6} fill="none" opacity={flow * 0.8} strokeLinecap="round" />; })}
      {labels && <>
        <circle cx={pt(0)[0] + 90} cy={pt(0)[1]} r={14} fill={T.red} /><text x={pt(0)[0] + 110} y={pt(0)[1] + 12} fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#2A2E36">KANLICA</text>
        <circle cx={pt(1)[0] - 90} cy={pt(1)[1]} r={14} fill={T.red} /><text x={pt(1)[0] - 110} y={pt(1)[1] + 12} textAnchor="end" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#2A2E36">KURUÇEŞME</text>
      </>}
      {k > 0 && <path d={`M${pt(0)[0]},${pt(0)[1]} ${Array.from({ length: 20 }, (_, i) => { const [x, y] = pt((i + 1) / 20 * k); return `L${x},${y}`; }).join(" ")}`} stroke="#F6C445" strokeWidth={10} strokeDasharray="20 14" fill="none" />}
      {k > 0 && <g transform={`translate(${sx},${sy})`}><circle r={26} fill={TQ} stroke="#FFFFFF" strokeWidth={6} /><circle r={40 + 8 * Math.sin(t * 6)} fill={TQ} opacity={0.25} /></g>}
    </g>
  );
};

// ── yüzücü (sudan kafa + kollar), x,y = su yüzeyi
export const Yuzucu: React.FC<{ x: number; y: number; s?: number; t: number; cap?: string }> = ({ x, y, s = 1, t, cap = T.red }) => {
  const a = t * 5;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={6} rx={110} ry={16} fill="#FFFFFF" opacity={0.35} />
      <g transform={`rotate(${Math.sin(a) * 60 - 20})`}><path d="M10,-10 L120,-40" stroke="#141414" strokeWidth={14} strokeLinecap="round" /></g>
      <g transform={`rotate(${Math.sin(a + Math.PI) * 60 + 200})`}><path d="M-10,-10 L120,-40" stroke="#141414" strokeWidth={14} strokeLinecap="round" opacity={0.7} /></g>
      <circle cx={0} cy={-26} r={38} fill="#141414" />
      <path d="M-38,-30 A38,38 0 0 1 38,-30Z" fill={cap} />
      <circle cx={16} cy={-20} r={9} fill="#FFFFFF" /><circle cx={18} cy={-20} r={4} fill="#141414" />
    </g>
  );
};

// ── gece şehir silüeti + bloklar. off: sönük pencere oranı 0..1, stars: yıldız görünürlüğü, balk: balkonlarda insan
export const GeceSehir: React.FC<{ t: number; off?: number; stars?: number; balk?: number }> = ({ t, off = 0, stars = 0, balk = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#tSkyNight)" />
    {stars > 0 && Array.from({ length: 90 }, (_, i) => <circle key={i} cx={md(i * 211, 1920)} cy={md(i * 97, 520)} r={1.5 + (i % 4)} fill="#FFFFFF" opacity={stars * (0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * 2 + i)))} />)}
    {stars > 0.5 && <path d={`M700,${120} q260,-60 560,40`} stroke="#E6EEFF" strokeWidth={40} opacity={0.08 * stars} fill="none" />}
    {[0, 1, 2].map((b) => {
      const x = 640 + b * 210, h = 560 + (b % 2) * 160, w = 200;
      return (
        <g key={b}>
          <rect x={x} y={1080 - h} width={w} height={h} fill="#26303E" />
          {Array.from({ length: Math.floor(h / 70) * 3 }, (_, i) => {
            const cx = x + 22 + (i % 3) * 60, cy = 1080 - h + 30 + Math.floor(i / 3) * 70;
            const on = md(i * 37 + b * 11, 100) / 100 >= off;
            return <g key={i}><rect x={cx} y={cy} width={36} height={40} fill={on ? "#FFD27A" : "#141A24"} />
              {balk > 0 && !on && i % 4 === 1 && <circle cx={cx + 18} cy={cy + 14} r={9} fill="#141414" opacity={balk} />}</g>;
          })}
        </g>
      );
    })}
    <rect y={1040} width={1920} height={40} fill="#141A24" />
  </g>
);

// ── saat kadranı: h saat (0..24 için 12'lik kadran), etiket altta
export const Saat: React.FC<{ x?: number; y?: number; s?: number; h: number; label?: string }> = ({ x = 960, y = 520, s = 1, h, label }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={200} fill="#FFFDF4" stroke="#141414" strokeWidth={14} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M0,-170 V-150`} transform={`rotate(${i * 30})`} stroke="#141414" strokeWidth={8} />)}
    <path d="M0,0 V-100" transform={`rotate(${h * 30})`} stroke="#141414" strokeWidth={14} strokeLinecap="round" />
    <path d="M0,0 V-150" transform={`rotate(${h * 360})`} stroke={T.red} strokeWidth={8} strokeLinecap="round" />
    <circle r={14} fill="#141414" />
    {label && <text y={-250} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={80} fill="#FFFFFF" stroke="#0B1426" strokeWidth={14} paintOrder="stroke">{label}</text>}
  </g>
);

export const _k2d2 = { cl };
