import React from "react";
import { T } from "./Toon";

// Kanal 2 · k2r-09 "Respawn" kiti: alarm saati, hak sayacı, geri sarma efekti, hastane koridoru, pasta, ambulans, balkon, döngü sayacı.
const cl = (x: number) => Math.max(0, Math.min(1, x));
const md = (a: number, m: number) => ((a % m) + m) % m;
const INK = "#1C1C1C";

/** dijital alarm saati: time "07:00", ring titreşimi */
export const Alarm: React.FC<{ x: number; y: number; s?: number; t?: number; time?: string; ring?: number; day?: string }> = ({ x, y, s = 1, t = 0, time = "07:00", ring = 0, day = "CUMARTESİ" }) => {
  const sh = ring ? Math.sin(t * 60) * 6 * ring : 0;
  return (
    <g transform={`translate(${x + sh},${y}) scale(${s}) rotate(${ring ? Math.sin(t * 50) * 3 : 0})`}>
      <rect x={-260} y={-130} width={520} height={260} rx={50} fill="#2A2F38" stroke={INK} strokeWidth={8} />
      <rect x={-220} y={-96} width={440} height={170} rx={20} fill="#0E1418" />
      <text y={40} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={130} fill={time.startsWith("23") ? "#FF5A5A" : "#5AF0C8"} letterSpacing={6}>{time}</text>
      <text y={110} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#9AA4AE">{day}</text>
      {ring > 0 && [-1, 1].map((d) => [0, 1].map((i) => <path key={`${d}${i}`} d={`M${d * (290 + i * 40)},-60 Q${d * (320 + i * 40)},0 ${d * (290 + i * 40)},60`} stroke={T.yellow} strokeWidth={10} fill="none" opacity={ring * (0.5 + 0.5 * Math.sin(t * 20 + i))} strokeLinecap="round" />))}
      <rect x={-220} y={130} width={60} height={30} rx={10} fill={INK} /><rect x={160} y={130} width={60} height={30} rx={10} fill={INK} />
    </g>
  );
};

/** hak sayacı: göz önündeki beyaz rakamlar (SVG). n: kalan hak, from: önceki (at anında düşer) */
export const Hak: React.FC<{ t: number; x?: number; y?: number; s?: number; n: number; from?: number; at?: number; k?: number }> = ({ t, x = 1500, y = 150, s = 1, n, from, at = 0, k = 1 }) => {
  const flip = from !== undefined ? cl((t - at) / 0.4) : 1;
  const v = from !== undefined && flip < 0.5 ? from : n;
  const sc = from !== undefined ? Math.abs(1 - flip * 2) : 1;
  const c = v <= 1 ? "#FF5A5A" : v === 2 ? T.yellow : "#FFFFFF";
  const glow = 0.5 + 0.5 * Math.sin(t * 3);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
      <rect x={-210} y={-70} width={420} height={140} rx={30} fill="#0E1626" opacity={0.72} stroke={c} strokeWidth={5} />
      <text x={-40} y={14} textAnchor="end" fontFamily="Poppins" fontWeight={800} fontSize={34} fill="#FFFFFF" opacity={0.85}>KALAN HAK</text>
      <g transform={`translate(110,0) scale(1,${sc})`}><circle r={52} fill={c} opacity={0.18 * glow} /><text y={30} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={96} fill={c}>{v}</text></g>
    </g>
  );
};

/** geri sarma: kararma + ◀◀ + tarama çizgileri */
export const Geri: React.FC<{ t: number; a: number; d?: number }> = ({ t, a, d = 1.2 }) => {
  const k = cl((t - a) / d);
  const op = Math.sin(k * Math.PI);
  if (k <= 0 || k >= 1) return null;
  return (
    <g opacity={op}>
      <rect width={1920} height={1080} fill="#05070C" opacity={0.85} />
      {Array.from({ length: 18 }, (_, i) => <rect key={i} y={md(i * 60 - t * 1600, 1080)} width={1920} height={6} fill="#5AF0C8" opacity={0.18} />)}
      <g transform="translate(960,540)"><path d="M40,-90 L-80,0 L40,90Z M160,-90 L40,0 L160,90Z" fill="#5AF0C8" /><text y={170} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={60} fill="#5AF0C8">07:00</text></g>
    </g>
  );
};

/** hastane koridoru: floresanlar, oda kapısı, bekleme sandalyeleri, duvar saati */
export const Koridor: React.FC<{ t: number; night?: number; clock?: string; door?: number; inside?: React.ReactNode }> = ({ t, night = 1, clock = "23:58", door = 0, inside }) => (
  <g>
    <rect width={1920} height={1080} fill="#DCE6E4" />
    <rect width={1920} height={140} fill="#F2F6F5" />
    {Array.from({ length: 4 }, (_, i) => <rect key={i} x={140 + i * 460} y={50} width={300} height={24} rx={10} fill="#FFFFFF" opacity={i === 2 ? 0.6 + 0.4 * Math.sin(t * 17) : 1} />)}
    <rect y={540} width={1920} height={30} fill="#8FC9BE" />
    <rect y={820} width={1920} height={260} fill="#B9C8C5" />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${i * 260},820 L${i * 260 - 120},1080`} stroke="#A5B5B2" strokeWidth={4} />)}
    {/* kapı */}
    <g transform="translate(1260,820)">
      <rect x={-170} y={-560} width={340} height={560} fill="#7FA8A0" stroke="#4A6A64" strokeWidth={8} />
      <clipPath id="kdoor"><rect x={-160} y={-550} width={320} height={550} /></clipPath>
      <g clipPath="url(#kdoor)"><rect x={-160} y={-550} width={320} height={550} fill="#C9D8E8" />{inside}</g>
      <g transform={`translate(-160,0) scale(${1 - 0.8 * door},1) translate(160,0)`}><rect x={-160} y={-550} width={320} height={550} fill="#9CC1B9" stroke="#4A6A64" strokeWidth={5} /><rect x={-60} y={-460} width={120} height={160} fill="#DDEFF2" stroke="#4A6A64" strokeWidth={4} /><circle cx={120} cy={-270} r={14} fill="#C9C9C9" /></g>
      <rect x={-80} y={-610} width={160} height={40} rx={8} fill="#2A5DA8" /><text y={-581} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={28} fill="#FFFFFF">KARDİYOLOJİ</text>
    </g>
    {/* sandalyeler */}
    {[0, 1, 2].map((i) => <g key={i} transform={`translate(${300 + i * 170},840)`}><rect x={-70} y={-140} width={140} height={20} rx={8} fill="#3A7BD5" /><rect x={-70} y={-240} width={140} height={110} rx={14} fill="#3A7BD5" /><rect x={-60} y={-120} width={10} height={120} fill="#555" /><rect x={50} y={-120} width={10} height={120} fill="#555" /></g>)}
    {/* saat */}
    <g transform="translate(760,320)"><rect x={-130} y={-56} width={260} height={112} rx={18} fill="#1C1C1C" /><text y={30} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={80} fill="#FF5A5A">{clock}</text></g>
    {night > 0 && <rect width={1920} height={1080} fill="#0E1626" opacity={0.25 * night} />}
  </g>
);

/** doğum günü pastası (mumlu) */
export const Pasta: React.FC<{ x: number; y: number; s?: number; t?: number; slice?: boolean; candles?: number }> = ({ x, y, s = 1, t = 0, slice = false, candles = 3 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cy={10} rx={slice ? 120 : 220} ry={30} fill="#E9E2D2" stroke={INK} strokeWidth={4} />
    {slice ? <path d="M-100,0 L100,0 L60,-120 Z" fill="#F6D7E0" stroke={INK} strokeWidth={5} /> : <>
      <rect x={-180} y={-150} width={360} height={150} rx={20} fill="#F6D7E0" stroke={INK} strokeWidth={5} />
      <path d="M-180,-130 Q-150,-90 -120,-130 Q-90,-90 -60,-130 Q-30,-90 0,-130 Q30,-90 60,-130 Q90,-90 120,-130 Q150,-90 180,-130" fill="none" stroke="#E86A92" strokeWidth={14} />
      {Array.from({ length: candles }, (_, i) => { const cx = (i - (candles - 1) / 2) * 80; const f = Math.sin(t * 14 + i); return <g key={i}><rect x={cx - 8} y={-220} width={16} height={70} fill={["#3A7BD5", T.yellow, "#3FAE6A"][i % 3]} /><path d={`M${cx},${-250 - f * 4} C${cx - 9},-236 ${cx - 7},-224 ${cx},-222 C${cx + 7},-224 ${cx + 9},-236 ${cx},${-250 - f * 4}Z`} fill="#FFB43A" /></g>; })}
    </>}
  </g>
);

/** ambulans (yan görünüş, çakar) */
export const Ambulans: React.FC<{ x: number; y: number; s?: number; t?: number }> = ({ x, y, s = 1, t = 0 }) => {
  const on = Math.sin(t * 18) > 0;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-300} y={-260} width={460} height={220} rx={20} fill="#FFFFFF" stroke={INK} strokeWidth={6} />
      <path d="M160,-200 L260,-200 L320,-120 L320,-40 L160,-40Z" fill="#FFFFFF" stroke={INK} strokeWidth={6} />
      <path d="M180,-185 L250,-185 L295,-125 L180,-125Z" fill="#7FB0CF" />
      <rect x={-300} y={-130} width={620} height={26} fill={T.red} />
      <g transform="translate(-90,-190)"><rect x={-18} y={-50} width={36} height={100} fill={T.red} /><rect x={-50} y={-18} width={100} height={36} fill={T.red} /></g>
      <rect x={-120} y={-290} width={80} height={30} rx={8} fill={on ? T.red : "#661A1A"} /><rect x={-40} y={-290} width={80} height={30} rx={8} fill={on ? "#661A1A" : "#3A7BD5"} />
      {on && <circle cx={-80} cy={-275} r={90} fill={T.red} opacity={0.15} />}
      {[-180, 220].map((wx) => <g key={wx} transform={`translate(${wx},-30) rotate(${t * 300})`}><circle r={52} fill={INK} /><circle r={22} fill="#9AA4AE" /><rect x={-4} y={-22} width={8} height={44} fill={INK} /></g>)}
    </g>
  );
};

/** gece balkonu: korkuluk, şehir ışıkları, tek bardak çay */
export const Balkon: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={1920} height={1080} fill="#121A30" />
    {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={(i * 157) % 1920} cy={(i * 47) % 300} r={2} fill="#FFFFFF" opacity={0.5} />)}
    {Array.from({ length: 22 }, (_, i) => <rect key={i} x={i * 90} y={420 + (i % 4) * 30} width={80} height={400} fill="#1E2844" />)}
    {Array.from({ length: 70 }, (_, i) => <rect key={i} x={(i * 113) % 1920} y={460 + ((i * 37) % 300)} width={14} height={18} fill="#FFD27A" opacity={0.3 + 0.5 * ((i * 7) % 3 === 0 ? Math.abs(Math.sin(t + i)) : 0.6)} />)}
    <rect y={760} width={1920} height={320} fill="#3A3A46" />
    <rect y={740} width={1920} height={20} fill="#8A8A9A" />
    {Array.from({ length: 24 }, (_, i) => <rect key={i} x={20 + i * 82} y={760} width={10} height={180} fill="#8A8A9A" />)}
  </g>
);

/** döngü sayacı (kaçıncı cumartesi) */
export const Dongu: React.FC<{ x?: number; y?: number; s?: number; n: number | string; k?: number }> = ({ x = 360, y = 150, s = 1, n, k = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
    <circle r={110} fill="#0E1626" opacity={0.75} stroke="#5AF0C8" strokeWidth={6} />
    <path d="M-60,-40 A72,72 0 1,1 -70,20" fill="none" stroke="#5AF0C8" strokeWidth={10} /><path d="M-90,10 L-70,30 L-50,8" fill="none" stroke="#5AF0C8" strokeWidth={10} strokeLinejoin="round" />
    <text y={28} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={72} fill="#FFFFFF">{n}</text>
  </g>
);
