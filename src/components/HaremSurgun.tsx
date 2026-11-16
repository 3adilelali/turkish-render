import React from "react";
import { H } from "./Harem";
import { P } from "./HaremPro";
import { blinkAt } from "./Motion";

// Kanal 1 · k3r-17 "Sürgün" kiti (2026-11-16): Abdülhamid'in sürgünü 1909–1918.
// Sirkeci Garı (gece, oryantalist cephe + saat kulesi), tren dışı ve kompartıman içi, iki tren (Dedeağaç),
// karanlık kır (diz boyu ot + el fenerleri), Alatini Köşkü (havagazı lambaları + deniz), boş salon (iki koltuk + kepenk ışık çizgileri),
// Topkapı'daki uzun salon (Çerkez babalar), SMS Loreley (Ege, mayın), Beylerbeyi Sarayı (Boğaz), Abaza köy evi ve tahta kuş rafı.
// Kimlik aynı: kalın kahve kontur, krem/sıcak + gece laciverti, İznik mavisi vurgu, ışık havuzları.

const LN = "#4A3524";
const ease = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x * x * (3 - 2 * x));
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const mix = (c1: string, c2: string, k: number) => {
  const p = (c: string) => [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
  const a = p(c1), b = p(c2);
  return `#${a.map((v, i) => Math.round(lerp(v, b[i], Math.max(0, Math.min(1, k)))).toString(16).padStart(2, "0")).join("")}`;
};
const rnd = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

// ───────── küçük yardımcılar ─────────
const Stars: React.FC<{ t: number; n?: number; y1?: number }> = ({ t, n = 60, y1 = 520 }) => (
  <g>{Array.from({ length: n }, (_, i) => <circle key={i} cx={rnd(i) * 1920} cy={rnd(i + 7) * y1} r={0.8 + rnd(i + 3) * 1.6} fill="#FFF8E0" opacity={0.35 + 0.4 * Math.abs(Math.sin(t * (0.6 + rnd(i) * 1.4) + i))} />)}</g>
);
const Moon: React.FC<{ x: number; y: number; r?: number }> = ({ x, y, r = 46 }) => (
  <g><circle cx={x} cy={y} r={r * 4} fill="url(#pBloom)" opacity={0.25} /><circle cx={x} cy={y} r={r} fill="#FFF3D0" /><circle cx={x + r * 0.35} cy={y - r * 0.1} r={r * 0.9} fill="#1A2448" opacity={0.0} /></g>
);
const Minare: React.FC<{ x: number; y: number; h?: number; c?: string }> = ({ x, y, h = 260, c = "#0B1024" }) => (
  <g fill={c}><rect x={x - 7} y={y - h} width={14} height={h} /><rect x={x - 12} y={y - h * 0.72} width={24} height={8} /><path d={`M${x - 8},${y - h} L${x},${y - h - 46} L${x + 8},${y - h}Z`} /></g>
);
// Osmanlı bayrağı (ay-yıldız), dalgalanan
export const Bayrak: React.FC<{ x: number; y: number; t: number; s?: number; pole?: number }> = ({ x, y, t, s = 1, pole = 220 }) => {
  const w = (k: number) => Math.sin(t * 4 + k) * 8;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-3} y={-pole} width={6} height={pole} fill="#3A2A1E" />
      <path d={`M3,${-pole} C40,${-pole + w(0)} 80,${-pole - w(1)} 120,${-pole + w(2)} L120,${-pole + 78 + w(2)} C80,${-pole + 78 - w(1)} 40,${-pole + 78 + w(0)} 3,${-pole + 78}Z`} fill="#C0262A" stroke={LN} strokeWidth={2} />
      <circle cx={52} cy={-pole + 39} r={17} fill="#FFF" /><circle cx={58} cy={-pole + 39} r={14} fill="#C0262A" />
      <path d="M78,-12 l3,9 9,0 -7,6 3,9 -8,-6 -8,6 3,-9 -7,-6 9,0Z" transform={`translate(0,${-pole + 39}) scale(0.7) translate(32,0)`} fill="#FFF" />
    </g>
  );
};
// el feneri (sallanan)
export const Fener: React.FC<{ x: number; y: number; t: number; s?: number; seed?: number; swing?: number }> = ({ x, y, t, s = 1, seed = 0, swing = 1 }) => {
  const a = Math.sin(t * 2.4 + seed) * 10 * swing;
  return (
    <g transform={`translate(${x},${y}) rotate(${a}) scale(${s})`}>
      <circle cx={0} cy={70} r={170} fill="url(#pPool)" opacity={0.55} />
      <path d="M0,0 v24" stroke="#2A2018" strokeWidth={4} />
      <path d="M-18,24 h36 l-6,10 h-24Z" fill="#2A2018" />
      <rect x={-16} y={34} width={32} height={46} rx={4} fill="#FFD27A" stroke="#2A2018" strokeWidth={4} />
      <path d="M-16,46 h32 M-16,68 h32" stroke="#2A2018" strokeWidth={2} opacity={0.6} />
      <circle cx={0} cy={57} r={10 + Math.sin(t * 13 + seed) * 1.5} fill="#FFF4C8" />
      <path d="M-18,80 h36 l-6,8 h-24Z" fill="#2A2018" />
    </g>
  );
};
// tüfek + süngü (askerin yanına)
export const Tufek: React.FC<{ x: number; y: number; s?: number; tilt?: number }> = ({ x, y, s = 1, tilt = -4 }) => (
  <g transform={`translate(${x},${y}) rotate(${tilt}) scale(${s})`}>
    <rect x={-5} y={-420} width={10} height={300} fill="#5E3B20" stroke={LN} strokeWidth={2} />
    <rect x={-9} y={-130} width={18} height={110} rx={6} fill="#6E4628" stroke={LN} strokeWidth={2} />
    <rect x={-3} y={-470} width={6} height={60} fill="#3A3A40" />
    <path d="M-2,-470 L0,-560 L2,-470Z" fill="#C8CCD4" stroke="#5A5E66" strokeWidth={1} />
  </g>
);

// ───────── Çerkez baba (papak + çerkeska + gazyr) — PFig ölçeğinde (s=1 ≈ 600 birim) ─────────
export const CerkezBaba: React.FC<{ x: number; y: number; s?: number; t?: number; seed?: number; look?: number; coat?: string; beard?: string; sad?: number; walk?: number; reach?: number }> = ({ x, y, s = 1, t = 0, seed = 0, look = 0, coat = "#4A3A2E", beard = "#D8D0C0", sad = 0, walk = 0, reach = 0 }) => {
  const blink = blinkAt(t, seed + 40);
  const br = Math.sin(t * 1.6 + seed) * 2;
  const step = Math.sin(walk * Math.PI * 2);
  const ex = look * 8;
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <ellipse cx={0} cy={4} rx={120} ry={20} fill="url(#pContact)" />
      {/* çizmeler */}
      <path d={`M${-34 + step * 16},-10 l-4,-90 h30 l2,90 h20 v14 h-56Z`} fill="#1E1814" />
      <path d={`M${14 - step * 16},-10 l-2,-90 h30 l4,90 h20 v14 h-56Z`} fill="#241C16" />
      {/* çerkeska (uzun, belde kemer, eteği geniş) */}
      <path d={`M-70,${-330 + br} L70,${-330 + br} L96,-100 L-96,-100Z`} fill={coat} stroke={LN} strokeWidth={3} />
      <path d={`M0,${-330 + br} L0,-100`} stroke={mix(coat, "#000", 0.35)} strokeWidth={3} />
      <rect x={-72} y={-238} width={144} height={16} fill="#2A2018" /><rect x={-14} y={-240} width={28} height={20} fill={P.gold} />
      {/* kama */}
      <path d="M-10,-222 l6,70 h8 l6,-70Z" fill="#3A2A1E" /><path d="M-4,-152 l4,26 4,-26Z" fill="#B8BCC4" />
      {/* gazyrlar (göğüste fişeklikler) */}
      {[-1, 1].map((sd) => <g key={sd}>{[0, 1, 2, 3, 4].map((k) => <rect key={k} x={sd * 30 - 8 + sd * 10} y={-318 + k * 15 + br} width={16} height={11} rx={3} fill="#E9DCC2" stroke={LN} strokeWidth={1.5} />)}</g>)}
      <path d={`M-70,${-330 + br} L-96,-100 L-60,-100Z`} fill="url(#pShadeL)" opacity={0.6} />
      {/* kollar */}
      <path d={`M-70,${-320 + br} Q-104,-250 -96,-180`} stroke={coat} strokeWidth={34} fill="none" strokeLinecap="round" />
      <path d={`M70,${-320 + br} Q${104 + reach * 40},${-260 - reach * 50} ${96 + reach * 110},${-180 - reach * 90}`} stroke={coat} strokeWidth={34} fill="none" strokeLinecap="round" />
      <circle cx={-96} cy={-172} r={15} fill={P.skin2} stroke={LN} strokeWidth={2} />
      <circle cx={96 + reach * 110} cy={-172 - reach * 90} r={15} fill={P.skin2} stroke={LN} strokeWidth={2} />
      {/* baş */}
      <g transform={`translate(0,${-410 + br})`}>
        <ellipse cx={0} cy={0} rx={58} ry={66} fill="url(#pFace)" stroke={LN} strokeWidth={3} />
        {/* sakal */}
        <path d="M-56,6 Q-50,92 0,104 Q50,92 56,6 Q30,40 0,36 Q-30,40 -56,6Z" fill={beard} stroke={LN} strokeWidth={2.4} />
        <path d="M-24,30 q24,-12 48,0" stroke={mix(beard, "#000", 0.25)} strokeWidth={6} fill="none" strokeLinecap="round" />
        {/* gözler */}
        {blink ? <path d={`M${-26 + ex},-4 q7,5 14,0 M${12 + ex},-4 q7,5 14,0`} stroke={LN} strokeWidth={3} fill="none" /> :
          <g>{[-19, 19].map((dx) => <g key={dx}><ellipse cx={dx + ex} cy={-4} rx={5} ry={7} fill="#2A1E16" /><circle cx={dx + 1.6 + ex} cy={-7} r={1.6} fill="#fff" /></g>)}</g>}
        <path d={`M${-32 + ex},${-22 - sad * 2} q12,${-6 + sad * 8} 22,0 M${10 + ex},${-22 + sad * 6} q12,${-6 - sad * 6} 22,0`} stroke={LN} strokeWidth={3} fill="none" strokeLinecap="round" />
        {/* papak (kuzu postu) */}
        <path d="M-62,-36 Q-64,-118 0,-122 Q64,-118 62,-36 Q0,-52 -62,-36Z" fill="#2E2620" stroke={LN} strokeWidth={3} />
        {Array.from({ length: 14 }, (_, k) => <circle key={k} cx={-50 + (k % 7) * 16} cy={-96 + Math.floor(k / 7) * 26} r={7} fill="#3E342C" />)}
      </g>
    </g>
  );
};

// ───────── 1) Sirkeci Garı, gece ─────────
export const SirkeciGar: React.FC<{ t: number; pan?: number; train?: number; steam?: number; soldiers?: number }> = ({ t, pan = 0, train = 1, steam = 1, soldiers = 1 }) => {
  const FL = 820;
  return (
    <g>
      <rect width={1920} height={FL} fill="url(#pNightSky)" />
      <Stars t={t} n={50} y1={360} />
      <Moon x={1650 - pan * 0.1} y={150} r={38} />
      {/* gar binası: kırmızı-beyaz şeritli at nalı kemerler + saat kulesi + yuvarlak gül pencere */}
      <g transform={`translate(${-pan * 0.5},0)`}>
        <rect x={120} y={300} width={1500} height={FL - 300} fill="#4A2E2A" stroke={LN} strokeWidth={4} />
        {Array.from({ length: 7 }, (_, i) => {
          const cx = 220 + i * 200;
          return (
            <g key={i}>
              <path d={`M${cx - 70},${FL - 10} L${cx - 70},500 A70,80 0 1 1 ${cx + 70},500 L${cx + 70},${FL - 10}Z`} fill="#22140F" stroke="#E8D9BC" strokeWidth={10} />
              {Array.from({ length: 9 }, (_, k) => { const a = Math.PI + (k / 8) * Math.PI; return <path key={k} d={`M${cx + Math.cos(a) * 70},${500 + Math.sin(a) * 80} L${cx + Math.cos(a) * 90},${500 + Math.sin(a) * 100}`} stroke={k % 2 ? "#E8D9BC" : "#A8322E"} strokeWidth={16} />; })}
              <rect x={cx - 52} y={560} width={104} height={200} fill={i === 3 ? "#FFC870" : "#3A2418"} opacity={i === 3 ? 0.8 : 1} />
            </g>
          );
        })}
        {Array.from({ length: 22 }, (_, k) => <rect key={k} x={120} y={316 + k * 22} width={1500} height={6} fill="#E8D9BC" opacity={k % 3 ? 0.08 : 0.16} />)}
        {/* gül pencere */}
        <g transform="translate(870,380)">
          <circle r={70} fill="#2C3B6E" stroke="#E8D9BC" strokeWidth={10} />
          {Array.from({ length: 8 }, (_, k) => <path key={k} d={`M0,0 L${Math.cos(k * Math.PI / 4) * 64},${Math.sin(k * Math.PI / 4) * 64}`} stroke="#E8D9BC" strokeWidth={5} />)}
          <circle r={16} fill="#FFC870" />
        </g>
        {/* saat kulesi */}
        <g transform="translate(1540,300)">
          <rect x={-70} y={-240} width={140} height={240} fill="#4A2E2A" stroke={LN} strokeWidth={4} />
          <circle cx={0} cy={-150} r={44} fill="#F7F0DC" stroke="#E8D9BC" strokeWidth={8} />
          <path d={`M0,-150 L${Math.cos(-Math.PI / 2 + 2.75 * Math.PI / 6) * 26},${-150 + Math.sin(-Math.PI / 2 + 2.75 * Math.PI / 6) * 26}`} stroke="#2A1E16" strokeWidth={6} strokeLinecap="round" />
          <path d="M0,-150 L0,-186" stroke="#2A1E16" strokeWidth={4} strokeLinecap="round" transform={`rotate(${270 + Math.sin(t * 0.2) * 0.5},0,-150)`} />
          <path d="M-84,-240 L84,-240 L0,-330Z" fill="#2A3040" stroke={LN} strokeWidth={4} />
          <Bayrak x={0} y={-330} t={t} s={0.7} pole={120} />
        </g>
        <path d="M100,300 L1640,300 L1600,270 L140,270Z" fill="#2A1A16" stroke={LN} strokeWidth={4} />
      </g>
      {/* tren (koyu yeşil vagonlar, sarı ışıklı pencereler) */}
      {train > 0 && (
        <g transform={`translate(${-pan * 0.85},0)`} opacity={train}>
          {[0, 1, 2].map((v) => (
            <g key={v} transform={`translate(${200 + v * 620},0)`}>
              <rect x={0} y={560} width={590} height={230} rx={14} fill="#1F3A32" stroke={LN} strokeWidth={4} />
              <rect x={0} y={560} width={590} height={24} rx={10} fill="#2A4A40" />
              {Array.from({ length: 6 }, (_, k) => <g key={k}><rect x={30 + k * 92} y={604} width={66} height={80} rx={6} fill={v === 1 ? "#FFD089" : "#C89A50"} opacity={v === 1 ? 0.95 : 0.6} stroke="#0E1E18" strokeWidth={4} /><rect x={30 + k * 92} y={604} width={66} height={80} rx={6} fill="url(#pVeil)" opacity={0.2} /></g>)}
              {v === 1 && <g transform="translate(295,724)"><circle r={18} fill={P.gold} /><circle cx={4} r={14} fill="#1F3A32" /></g>}
              <circle cx={80} cy={800} r={30} fill="#141414" stroke="#3A3A3A" strokeWidth={6} /><circle cx={510} cy={800} r={30} fill="#141414" stroke="#3A3A3A" strokeWidth={6} />
            </g>
          ))}
          {/* lokomotif (sağda) */}
          <g transform="translate(2070,0)">
            <rect x={0} y={600} width={380} height={190} rx={10} fill="#141414" stroke={LN} strokeWidth={4} />
            <rect x={260} y={480} width={60} height={120} fill="#141414" />
            {steam > 0 && Array.from({ length: 6 }, (_, i) => { const life = (t * 0.25 + i / 6) % 1; return <circle key={i} cx={290 - life * 260} cy={470 - life * 380} r={40 + life * 160} fill="#E8E4DC" opacity={(1 - life) * 0.4 * steam} filter="url(#pBlur16)" />; })}
          </g>
        </g>
      )}
      {/* peron + tek lamba */}
      <rect y={FL} width={1920} height={1080 - FL} fill="#3A3230" />
      <rect y={FL} width={1920} height={14} fill="#6A5E54" />
      <rect y={FL + 70} width={1920} height={6} fill="#22201E" opacity={0.6} />
      <g transform={`translate(${960 - pan * 0.9},0)`}>
        <rect x={-8} y={FL - 520} width={16} height={520 + 40} fill="#1E1A18" />
        <path d={`M-34,${FL - 520} L34,${FL - 520} L24,${FL - 580} L-24,${FL - 580}Z`} fill="#FFE39A" stroke="#1E1A18" strokeWidth={5} />
        <circle cx={0} cy={FL - 550} r={240} fill="url(#pBloom)" opacity={0.55} />
        <ellipse cx={0} cy={FL + 60} rx={420} ry={70} fill="url(#pPool)" opacity={0.6} />
      </g>
      {/* asker sırası (silüet, süngülü) */}
      {soldiers > 0 && (
        <g opacity={soldiers}>
          {Array.from({ length: 16 }, (_, i) => {
            const x = ((i * 150 - pan * 1.1) % 2600 + 2600) % 2600 - 300;
            return (
              <g key={i} transform={`translate(${x},${FL + 120}) scale(0.62)`} fill="#120E0C">
                <rect x={-26} y={-330} width={52} height={250} rx={18} />
                <rect x={-24} y={-80} width={20} height={80} /><rect x={4} y={-80} width={20} height={80} />
                <circle cx={0} cy={-370} r={34} />
                <rect x={-30} y={-424} width={60} height={34} rx={6} />
                <rect x={34} y={-560} width={8} height={420} />
                <path d="M36,-560 L38,-640 L40,-560Z" fill="#9AA0AA" />
              </g>
            );
          })}
        </g>
      )}
    </g>
  );
};

// ───────── 2) Tren dışı (gece, kırda akarken) ─────────
export const TrenGece: React.FC<{ t: number; speed?: number; dawn?: number }> = ({ t, speed = 1, dawn = 0 }) => {
  const off = t * 520 * speed;
  return (
    <g>
      <rect width={1920} height={1080} fill={dawn > 0 ? mix("#141B36", "#E8A870", dawn * 0.6) : "#141B36"} />
      <rect width={1920} height={700} fill="url(#pNightSky)" opacity={1 - dawn * 0.6} />
      <Stars t={t} n={70} y1={480} />
      <Moon x={1500} y={170} r={42} />
      {/* uzak tepeler */}
      <path d={`M0,620 ${Array.from({ length: 12 }, (_, i) => `Q${i * 180 + 90 - (off * 0.05) % 180},${560 + (i % 3) * 20} ${i * 180 + 180 - (off * 0.05) % 180},620`).join(" ")} L1920,1080 L0,1080Z`} fill="#0C1226" />
      <path d={`M0,700 ${Array.from({ length: 14 }, (_, i) => `Q${i * 150 + 75 - (off * 0.15) % 150},${660 + (i % 2) * 24} ${i * 150 + 150 - (off * 0.15) % 150},700`).join(" ")} L1920,1080 L0,1080Z`} fill="#0A0F1E" />
      {/* telgraf direkleri */}
      {Array.from({ length: 5 }, (_, i) => { const x = ((i * 520 - off * 0.6) % 2600 + 2600) % 2600 - 300; return <g key={i}><rect x={x} y={520} width={8} height={260} fill="#070A14" /><rect x={x - 30} y={530} width={68} height={6} fill="#070A14" /></g>; })}
      <path d="M0,546 Q480,566 960,546 T1920,546" stroke="#070A14" strokeWidth={2} fill="none" />
      {/* tren silueti + ışıklı pencereler */}
      <g transform={`translate(${200 + Math.sin(t * 0.7) * 10},${Math.sin(t * 9) * 1.5})`}>
        {[0, 1, 2, 3].map((v) => (
          <g key={v} transform={`translate(${v * 400},0)`}>
            <rect x={0} y={700} width={380} height={140} rx={10} fill="#0A1410" stroke="#000" strokeWidth={3} />
            {Array.from({ length: 4 }, (_, k) => <rect key={k} x={24 + k * 90} y={724} width={56} height={52} rx={4} fill="#FFD089" opacity={0.75 + 0.2 * Math.sin(t * 3 + k + v)} />)}
          </g>
        ))}
        <g transform="translate(1600,0)">
          <rect x={0} y={690} width={300} height={150} rx={10} fill="#080808" />
          <rect x={200} y={600} width={50} height={92} fill="#080808" />
          <circle cx={300} cy={760} r={22} fill="#FFF2B0" /><path d="M300,760 L1000,700 L1000,820Z" fill="#FFF2B0" opacity={0.12} />
          {Array.from({ length: 7 }, (_, i) => { const life = (t * 0.6 + i / 7) % 1; return <circle key={i} cx={225 - life * 900} cy={590 - life * 200} r={30 + life * 110} fill="#B8B4AC" opacity={(1 - life) * 0.35} filter="url(#pBlur16)" />; })}
        </g>
      </g>
      <rect y={840} width={1920} height={240} fill="#070A12" />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={((i * 80 - off) % 2400 + 2400) % 2400 - 200} y={846} width={40} height={10} fill="#1A1A1E" />)}
    </g>
  );
};

// ───────── 3) Kompartıman içi (gece, sallanan lamba, pencereden geçen karanlık) ─────────
export const Kompartiman: React.FC<{ t: number; speed?: number; lamp?: number; day?: number }> = ({ t, speed = 1, lamp = 1, day = 0 }) => {
  const sway = Math.sin(t * 2.2) * 4;
  const off = t * 300 * speed;
  return (
    <g>
      {/* duvarlar: maun panel */}
      <rect width={1920} height={1080} fill="#3A2218" />
      {Array.from({ length: 8 }, (_, i) => <rect key={i} x={i * 240 + 10} y={60} width={220} height={300} rx={8} fill="#4A2C1E" stroke="#2A160E" strokeWidth={4} />)}
      {/* pencere */}
      <g transform="translate(560,140)">
        <rect x={0} y={0} width={800} height={460} rx={18} fill={day > 0 ? mix("#141B36", "#9EC0D8", day) : "#141B36"} stroke="#2A160E" strokeWidth={18} />
        <clipPath id="kwin"><rect x={0} y={0} width={800} height={460} rx={18} /></clipPath>
        <g clipPath="url(#kwin)">
          <Stars t={t} n={30} y1={260} />
          <path d={`M0,330 ${Array.from({ length: 8 }, (_, i) => `Q${i * 120 + 60 - (off * 0.2) % 120},${290 + (i % 2) * 20} ${i * 120 + 120 - (off * 0.2) % 120},330`).join(" ")} L800,460 L0,460Z`} fill={day > 0 ? mix("#0C1226", "#5E7A5A", day) : "#0C1226"} />
          {Array.from({ length: 4 }, (_, i) => { const x = ((i * 300 - off) % 1200 + 1200) % 1200 - 100; return <rect key={i} x={x} y={150} width={10} height={320} fill="#05070E" />; })}
          <rect x={0} y={0} width={800} height={460} fill="url(#pVeil)" opacity={0.08} />
        </g>
        <rect x={0} y={200} width={800} height={10} fill="#C9A35A" />
      </g>
      {/* lamba (tavandan) */}
      <g transform={`translate(960,0) rotate(${sway})`}>
        <path d="M0,0 v90" stroke="#2A1A10" strokeWidth={4} />
        <path d="M-40,90 h80 l-14,50 h-52Z" fill="#C9A35A" stroke={LN} strokeWidth={3} />
        <circle cx={0} cy={140} r={lamp * 300} fill="url(#pBloom)" opacity={0.45 * lamp} />
        <circle cx={0} cy={132} r={10} fill="#FFF4C8" opacity={lamp} />
      </g>
      {/* koltuklar: kadife bordo */}
      <rect x={0} y={640} width={1920} height={440} fill="#2A1610" />
      <rect x={80} y={600} width={760} height={300} rx={30} fill="#6E1E24" stroke={LN} strokeWidth={4} />
      <rect x={1080} y={600} width={760} height={300} rx={30} fill="#6E1E24" stroke={LN} strokeWidth={4} />
      {Array.from({ length: 6 }, (_, i) => <circle key={i} cx={160 + i * 120} cy={660} r={5} fill={P.gold} />)}
      {Array.from({ length: 6 }, (_, i) => <circle key={`r${i}`} cx={1160 + i * 120} cy={660} r={5} fill={P.gold} />)}
      <rect width={1920} height={1080} fill="#000" opacity={0.25 * (1 - lamp)} />
    </g>
  );
};

// ───────── 4) İki tren yan yana (Dedeağaç, şafak) ─────────
export const IkiTren: React.FC<{ t: number; part?: number }> = ({ t, part = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A3048" />
    <rect width={1920} height={560} fill="url(#pNightSky)" opacity={0.6} />
    <rect y={400} width={1920} height={200} fill="#E8A870" opacity={0.22} filter="url(#pBlur16)" />
    {/* deniz (Dedeağaç kıyısı) */}
    <rect y={520} width={1920} height={60} fill="#3E5A7A" />
    {Array.from({ length: 30 }, (_, i) => <rect key={i} x={(i * 71 + t * 20) % 2000 - 40} y={530 + (i % 5) * 10} width={30} height={2} fill="#FFE0B0" opacity={0.35} />)}
    {/* uzak tren (askerler) */}
    <g transform={`translate(${-part * 900},0)`}>
      {[0, 1, 2, 3].map((v) => (
        <g key={v} transform={`translate(${100 + v * 440},560)`}>
          <rect width={420} height={150} rx={8} fill="#3A3A32" stroke="#141410" strokeWidth={3} />
          {Array.from({ length: 5 }, (_, k) => <g key={k}><rect x={20 + k * 80} y={24} width={52} height={50} fill="#8A7A5A" opacity={0.7} /><circle cx={46 + k * 80} cy={56} r={12} fill="#1A1410" /><rect x={34 + k * 80} y={38} width={24} height={10} fill="#6A1A1A" /></g>)}
        </g>
      ))}
    </g>
    {/* yakın tren (padişah) */}
    <g transform={`translate(${part * 900},0)`}>
      {[0, 1, 2].map((v) => (
        <g key={v} transform={`translate(${60 + v * 640},640)`}>
          <rect width={620} height={250} rx={12} fill="#1F3A32" stroke={LN} strokeWidth={4} />
          {Array.from({ length: 6 }, (_, k) => <rect key={k} x={30 + k * 96} y={40} width={70} height={90} rx={6} fill="#C89A50" opacity={0.55} stroke="#0E1E18" strokeWidth={4} />)}
          <circle cx={90} cy={260} r={32} fill="#141414" /><circle cx={530} cy={260} r={32} fill="#141414" />
        </g>
      ))}
    </g>
    <rect y={900} width={1920} height={180} fill="#2A2420" />
  </g>
);

// ───────── 5) Karanlık kır (diz boyu ot, yüksek basamak, el fenerleri) ─────────
export const KirGece: React.FC<{ t: number; pan?: number; train?: boolean; lanterns?: number; grassFg?: boolean }> = ({ t, pan = 0, train = true, lanterns = 1, grassFg = true }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#pNightSky)" />
    <Stars t={t} n={90} y1={600} />
    <Moon x={300 - pan * 0.05} y={160} r={34} />
    <path d="M0,640 Q400,600 800,630 T1600,620 T2400,640 L2400,1080 L0,1080Z" fill="#0E1428" transform={`translate(${-pan * 0.2},0)`} />
    {/* Selanik ışıkları uzakta */}
    <g transform={`translate(${-pan * 0.25},0)`}>{Array.from({ length: 26 }, (_, i) => <circle key={i} cx={900 + i * 36} cy={628 + (i % 3) * 4} r={2.2} fill="#FFD089" opacity={0.6 + 0.3 * Math.sin(t * 2 + i)} />)}<Minare x={1240} y={630} h={70} c="#0A0F1E" /><Minare x={1500} y={632} h={60} c="#0A0F1E" /></g>
    {train && (
      <g transform={`translate(${-pan * 0.6},0)`}>
        <rect x={-200} y={600} width={1400} height={20} fill="#1A1410" />
        {[0, 1, 2].map((v) => <g key={v} transform={`translate(${-160 + v * 440},430)`}><rect width={420} height={170} rx={10} fill="#0F1E18" stroke="#000" strokeWidth={3} />{Array.from({ length: 4 }, (_, k) => <rect key={k} x={26 + k * 96} y={30} width={62} height={60} rx={5} fill="#FFD089" opacity={0.7} />)}</g>)}
        {/* yüksek basamak */}
        <g transform="translate(760,600)"><rect x={-40} y={0} width={80} height={14} fill="#2A2420" /><rect x={-34} y={40} width={68} height={12} fill="#2A2420" /><path d="M-40,0 v60 M40,0 v60" stroke="#2A2420" strokeWidth={6} /></g>
      </g>
    )}
    {/* yamaç (hafif yokuş) */}
    <path d="M0,760 Q960,700 1920,780 L1920,1080 L0,1080Z" fill="#141C14" />
    {/* otlar */}
    {Array.from({ length: 120 }, (_, i) => {
      const x = ((i * 23 - pan * 0.9) % 2100 + 2100) % 2100 - 90;
      const h = 60 + rnd(i) * 90, sw = Math.sin(t * 1.6 + i * 0.7) * 10;
      return <path key={i} d={`M${x},${800 + (i % 9) * 30} q${sw * 0.5},${-h * 0.5} ${sw},${-h}`} stroke={i % 3 ? "#2A3A24" : "#3A4A2E"} strokeWidth={4} fill="none" strokeLinecap="round" />;
    })}
    {lanterns > 0 && <g opacity={lanterns}>{[380, 900, 1450].map((x, i) => <Fener key={i} x={x - pan * 0.8 + Math.sin(t * 0.5 + i) * 40} y={520} t={t} seed={i * 2} s={1.1} />)}</g>}
    {grassFg && Array.from({ length: 40 }, (_, i) => {
      const x = ((i * 55 - pan * 1.4) % 2200 + 2200) % 2200 - 140;
      const h = 200 + rnd(i + 4) * 160, sw = Math.sin(t * 1.3 + i) * 18;
      return <path key={`f${i}`} d={`M${x},1090 q${sw * 0.5},${-h * 0.5} ${sw},${-h}`} stroke="#0C140A" strokeWidth={9} fill="none" strokeLinecap="round" opacity={0.95} />;
    })}
  </g>
);

// ───────── 6) Alatini Köşkü (dış): üç katlı beyaz barok köşk, bahçede havagazı lambaları, arkada deniz ─────────
export const AlatiniKosk: React.FC<{ t: number; night?: number; lamps?: number; shut?: number; pan?: number; gate?: number }> = ({ t, night = 1, lamps = 1, shut = 0, pan = 0, gate = 0 }) => {
  const W = mix("#F2EEE4", "#7A86A8", night * 0.55);
  return (
    <g>
      <rect width={1920} height={1080} fill={night > 0.5 ? "url(#pNightSky)" : "url(#pDaySky)"} />
      {night > 0.5 && <Stars t={t} n={40} y1={300} />}
      {/* deniz */}
      <rect y={640} width={1920} height={120} fill={night > 0.5 ? "#16244A" : "url(#pWater)"} />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={(i * 83 + t * 18) % 2100 - 90} y={650 + (i % 6) * 16} width={26 + (i % 3) * 10} height={2} fill={night > 0.5 ? "#FFD089" : "#FFF"} opacity={0.3} />)}
      {/* köşk */}
      <g transform={`translate(${960 - pan * 0.5},760)`}>
        <rect x={-460} y={-520} width={920} height={520} fill={W} stroke={LN} strokeWidth={4} />
        <rect x={-150} y={-600} width={300} height={90} fill={W} stroke={LN} strokeWidth={4} />
        <path d="M-170,-600 Q0,-700 170,-600Z" fill={mix("#B8C0CC", "#3A4258", night * 0.5)} stroke={LN} strokeWidth={4} />
        <path d="M-490,-520 L490,-520 L460,-548 L-460,-548Z" fill={mix("#C8BCA8", "#4A4A5A", night * 0.5)} stroke={LN} strokeWidth={4} />
        {[-1, 0, 1].map((row) => (
          <g key={row}>
            {Array.from({ length: 7 }, (_, k) => {
              const x = -390 + k * 130, y = -470 + (row + 1) * 160;
              const lit = night > 0.5 && (k + row) % 3 === 0 && shut < 0.5;
              return (
                <g key={k}>
                  <path d={`M${x - 34},${y + 100} L${x - 34},${y + 20} A34,30 0 0 1 ${x + 34},${y + 20} L${x + 34},${y + 100}Z`} fill={lit ? "#FFD089" : mix("#3A4A6A", "#1A2238", night)} stroke={LN} strokeWidth={3} />
                  {/* kepenk */}
                  <rect x={x - 34} y={y + 6} width={68} height={94} fill="#6E5034" opacity={shut} stroke={LN} strokeWidth={2} />
                  {shut > 0.3 && [0, 1, 2, 3, 4].map((q) => <path key={q} d={`M${x - 34},${y + 20 + q * 18} h68`} stroke="#4A3020" strokeWidth={3} opacity={shut} />)}
                  <path d={`M${x - 42},${y + 102} h84`} stroke={LN} strokeWidth={5} />
                </g>
              );
            })}
          </g>
        ))}
        {/* büyük taş merdiven + kapı */}
        <path d="M-200,0 L200,0 L150,-60 L-150,-60Z" fill={mix("#D8D0C0", "#6A6A7A", night * 0.5)} stroke={LN} strokeWidth={3} />
        {[0, 1, 2, 3].map((q) => <path key={q} d={`M${-200 + q * 12},${-q * 15} h${400 - q * 24}`} stroke={LN} strokeWidth={2} opacity={0.6} />)}
        <path d={`M-80,-60 L-80,-210 A80,70 0 0 1 80,-210 L80,-60Z`} fill="#3A2418" stroke={LN} strokeWidth={4} />
        <rect x={-80} y={-210} width={80 * (1 - gate)} height={150} fill="#5E3B20" stroke={LN} strokeWidth={2} />
        <rect x={80 - 80 * (1 - gate)} y={-210} width={80 * (1 - gate)} height={150} fill="#5E3B20" stroke={LN} strokeWidth={2} />
        {gate > 0 && <rect x={-80 * gate} y={-210} width={160 * gate} height={150} fill="#FFD089" opacity={0.7} />}
        <rect x={-460} y={-520} width={920} height={520} fill="url(#pShadeL)" />
        <Bayrak x={520} y={0} t={t} s={0.8} pole={320} />
        {/* nöbet kulübesi */}
        <g transform="translate(-620,0)"><rect x={-40} y={-150} width={80} height={150} fill="#8A5A34" stroke={LN} strokeWidth={3} /><path d="M-52,-150 L0,-200 L52,-150Z" fill="#5E3B20" /></g>
      </g>
      {/* bahçe: palmiyeler + havagazı lambaları */}
      <rect y={760} width={1920} height={320} fill={mix("#7A8A5A", "#1E2A1C", night)} />
      <path d="M560,1080 L860,760 L1060,760 L1360,1080Z" fill={mix("#D8C8A0", "#3A3A30", night * 0.7)} />
      {[-1, 1].map((sd) => (
        <g key={sd} transform={`translate(${960 + sd * 640 - pan * 0.7},780)`}>
          <path d="M0,0 C-10,-120 10,-240 0,-340" stroke="#5E4530" strokeWidth={18} fill="none" />
          {Array.from({ length: 7 }, (_, k) => <path key={k} d={`M0,-340 q${Math.cos(k) * 120},${-30 + Math.sin(k) * 40} ${Math.cos(k) * 200},${60 + Math.sin(k * 2) * 30}`} stroke={mix("#3F6B33", "#14200E", night)} strokeWidth={16} fill="none" strokeLinecap="round" transform={`rotate(${Math.sin(t + k) * 2})`} />)}
        </g>
      ))}
      {lamps > 0 && [460, 760, 1160, 1460].map((x, i) => (
        <g key={i} transform={`translate(${x - pan * 0.8},${900 + (i % 2) * 40})`}>
          <rect x={-5} y={-220} width={10} height={220} fill="#1E1A18" />
          <path d="M-20,-220 L20,-220 L14,-256 L-14,-256Z" fill="#FFE39A" stroke="#1E1A18" strokeWidth={3} />
          <circle cx={0} cy={-238} r={150} fill="url(#pBloom)" opacity={0.6 * lamps * night} />
        </g>
      ))}
    </g>
  );
};

// ───────── 7) Boş salon (içeride sadece bir masa + iki koltuk; kepenk aralığından ışık çizgileri) ─────────
export const BosSalon: React.FC<{ t: number; night?: number; candle?: number; gas?: number; beds?: number; slits?: number; chairsTogether?: number }> = ({ t, night = 1, candle = 0, gas = 1, beds = 0, slits = 0, chairsTogether = 0 }) => {
  const wall = mix("#E9E0CC", "#4A4858", night * 0.6);
  return (
    <g>
      <rect width={1920} height={1080} fill={wall} />
      {/* barok pervazlar + tavan */}
      <rect width={1920} height={110} fill={mix("#D8CDB6", "#3A3848", night * 0.6)} />
      {Array.from({ length: 20 }, (_, i) => <circle key={i} cx={48 + i * 96} cy={96} r={10} fill={mix("#C8B898", "#3A3848", night * 0.5)} />)}
      {[200, 760, 1320].map((x) => <g key={x}><rect x={x} y={180} width={400} height={540} rx={10} fill="none" stroke={mix("#C8B898", "#3A3848", night * 0.5)} strokeWidth={6} /><rect x={x + 30} y={210} width={340} height={480} rx={8} fill="none" stroke={mix("#D8CDB6", "#3A3848", night * 0.5)} strokeWidth={3} /></g>)}
      {/* kepenkli yüksek pencereler */}
      {[360, 1560].map((x) => (
        <g key={x} transform={`translate(${x},180)`}>
          <rect x={-110} y={0} width={220} height={520} fill="#5E4430" stroke={LN} strokeWidth={5} />
          {Array.from({ length: 16 }, (_, q) => <path key={q} d={`M-104,${20 + q * 31} h208`} stroke="#3E2A1C" strokeWidth={5} />)}
          <path d="M0,0 v520" stroke="#3E2A1C" strokeWidth={6} />
          {slits > 0 && Array.from({ length: 8 }, (_, q) => <rect key={`s${q}`} x={-104} y={34 + q * 62} width={208} height={3} fill="#FFF4D0" opacity={slits * 0.9} />)}
          {slits > 0 && <path d={`M-104,520 L104,520 L${360 * (x < 960 ? 1 : -1) + 104},900 L${360 * (x < 960 ? 1 : -1) - 104},900Z`} fill="#FFF4D0" opacity={slits * 0.12} />}
        </g>
      ))}
      {/* havagazı aplik */}
      {gas > 0 && [700, 1220].map((x) => <g key={x} transform={`translate(${x},300)`}><path d="M0,0 q-30,20 -30,60" stroke="#8A7A5A" strokeWidth={5} fill="none" /><path d="M-44,60 h28 l-4,-26 h-20Z" fill="#FFE39A" /><circle cx={-30} cy={48} r={160} fill="url(#pBloom)" opacity={0.4 * gas} /></g>)}
      {/* parke zemin */}
      <rect y={760} width={1920} height={320} fill={mix("#B8905E", "#3A2A1E", night * 0.6)} />
      {Array.from({ length: 24 }, (_, i) => <path key={i} d={`M${i * 90 - 200},1080 L${960 + (i * 90 - 1100) * 0.35},760`} stroke={mix("#8A6A44", "#2A1E14", night * 0.6)} strokeWidth={3} opacity={0.6} />)}
      {[800, 860, 940, 1040].map((y, i) => <path key={i} d={`M0,${y} h1920`} stroke={mix("#8A6A44", "#2A1E14", night * 0.6)} strokeWidth={2} opacity={0.4} />)}
      {/* uzun yemek masası */}
      <g transform="translate(960,820)">
        <rect x={-380} y={-40} width={760} height={30} fill="#6E4628" stroke={LN} strokeWidth={3} />
        {[-350, 340].map((lx) => <rect key={lx} x={lx} y={-10} width={14} height={120} fill="#5E3B20" />)}
      </g>
      {/* iki koltuk (berjer) */}
      {[-1, 1].map((sd) => {
        const x = 960 + sd * lerp(560, 130, chairsTogether);
        return (
          <g key={sd} transform={`translate(${x},960)`}>
            <path d="M-110,0 L-110,-150 Q-110,-260 0,-260 Q110,-260 110,-150 L110,0Z" fill="#8E3A3A" stroke={LN} strokeWidth={4} />
            <rect x={-130} y={-100} width={260} height={70} rx={20} fill="#A84848" stroke={LN} strokeWidth={4} />
            <rect x={-130} y={-150} width={40} height={130} rx={14} fill="#7E2E2E" stroke={LN} strokeWidth={3} /><rect x={90} y={-150} width={40} height={130} rx={14} fill="#7E2E2E" stroke={LN} strokeWidth={3} />
            {[-90, 90].map((lx) => <path key={lx} d={`M${lx},-30 l${lx > 0 ? 10 : -10},40`} stroke={P.gold} strokeWidth={8} />)}
          </g>
        );
      })}
      {/* yerde yorgan yatakları */}
      {beds > 0 && <g opacity={beds}>{[[300, 1010], [620, 1040], [1320, 1030], [1640, 1005]].map(([x, y], i) => <g key={i}><ellipse cx={x} cy={y} rx={180} ry={40} fill={["#A89A7A", "#8A7A6A", "#9A8A6A", "#B8A888"][i]} stroke={LN} strokeWidth={3} /><ellipse cx={x - 130} cy={y - 18} rx={46} ry={22} fill="#E2D8C4" stroke={LN} strokeWidth={2} /></g>)}</g>}
      {candle > 0 && <g transform="translate(960,770)"><rect x={-8} y={-60} width={16} height={60} fill="#F7F0DC" /><path d={`M0,-60 q${Math.sin(t * 9) * 4},-14 0,-26 q-6,12 0,26Z`} fill="#FFC850" /><circle cx={0} cy={-74} r={220 * candle} fill="url(#pPool)" opacity={0.7} /></g>}
      {night > 0.6 && <rect width={1920} height={1080} fill="#0E1530" opacity={0.28 * night} />}
    </g>
  );
};

// ───────── 8) Kepenk (yakın): tahta kepenk kapanır, aralıktan ışık ─────────
export const Kepenk: React.FC<{ t: number; k?: number; hammer?: number }> = ({ t, k = 1, hammer = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#16244A" />
    <Stars t={t} n={20} />
    <rect x={0} y={760} width={1920} height={20} fill="#FFD089" opacity={0.25} />
    {[-1, 1].map((sd) => (
      <g key={sd} transform={`translate(${960 + sd * lerp(960, 0, ease(k))},0)`}>
        <rect x={sd < 0 ? -960 : 0} y={-20} width={960} height={1120} fill="#6E5034" stroke={LN} strokeWidth={6} />
        {Array.from({ length: 22 }, (_, q) => <g key={q}><path d={`M${sd < 0 ? -950 : 10},${30 + q * 48} h940`} stroke="#3E2A1C" strokeWidth={12} /><path d={`M${sd < 0 ? -950 : 10},${40 + q * 48} h940`} stroke="#8A6A48" strokeWidth={3} opacity={0.6} /></g>)}
        <rect x={sd < 0 ? -40 : 0} y={0} width={40} height={1080} fill="#4A3020" />
      </g>
    ))}
    {k > 0.9 && Array.from({ length: 20 }, (_, q) => <rect key={q} x={0} y={52 + q * 48} width={1920} height={2.2} fill="#FFF4D0" opacity={0.5 + 0.2 * Math.sin(t * 2 + q)} />)}
    {hammer > 0 && <g transform={`translate(960,520) rotate(${-30 + Math.abs(Math.sin(t * 8)) * 40 * hammer})`}><rect x={-6} y={0} width={12} height={160} fill="#5E3B20" /><rect x={-36} y={-20} width={72} height={30} fill="#6A6A70" /></g>}
  </g>
);

// ───────── 9) Dondurma tepsisi (yakın): kaşıksız, parmaklar ─────────
export const Dondurma: React.FC<{ t: number; finger?: number }> = ({ t, finger = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A1E1A" />
    <ellipse cx={960} cy={640} rx={760} ry={300} fill="#B8A070" stroke={LN} strokeWidth={6} />
    <ellipse cx={960} cy={620} rx={700} ry={260} fill="#D8C090" />
    <ellipse cx={960} cy={620} rx={700} ry={260} fill="url(#pShadeL)" opacity={0.5} />
    {/* ekmek + soğuk et */}
    <g transform="translate(560,560)"><ellipse rx={170} ry={70} fill="#C88A48" stroke={LN} strokeWidth={4} /><path d="M-120,-20 q40,-30 80,0 M-20,-30 q40,-30 80,0 M60,-20 q30,-20 60,0" stroke="#8A5A28" strokeWidth={5} fill="none" /></g>
    <g transform="translate(1380,580)"><ellipse rx={150} ry={56} fill="#E8E0D0" stroke={LN} strokeWidth={4} />{[0, 1, 2].map((k) => <ellipse key={k} cx={-60 + k * 60} cy={-10} rx={48} ry={22} fill="#B85A5A" stroke={LN} strokeWidth={2} />)}</g>
    {/* dondurma kâseleri */}
    {[0, 1, 2].map((k) => (
      <g key={k} transform={`translate(${780 + k * 190},${700 + (k % 2) * 30})`}>
        <path d="M-70,0 Q0,60 70,0Z" fill="#E8EEF2" stroke={LN} strokeWidth={4} />
        <ellipse cx={0} cy={-6} rx={56} ry={34} fill={["#FFF6E8", "#F6D2D8", "#F2E2B0"][k]} stroke={LN} strokeWidth={2} />
        <ellipse cx={-14} cy={-14} rx={16} ry={8} fill="#FFFFFF" opacity={0.7} />
      </g>
    ))}
    {/* parmaklar (sağ üstten iner) */}
    <g transform={`translate(${1000 + (1 - finger) * 200},${lerp(120, 560, ease(finger))})`}>
      <path d="M-40,-600 L40,-600 L36,-10 Q0,30 -36,-10Z" fill={P.skin2} stroke={LN} strokeWidth={4} />
      <path d="M-20,-60 q20,10 40,0" stroke={LN} strokeWidth={2} opacity={0.5} />
      <ellipse cx={0} cy={-24} rx={22} ry={14} fill="#FFF6E8" opacity={finger > 0.9 ? 1 : 0} />
      <path d="M-40,-600 L40,-600 L36,-10 Q0,30 -36,-10Z" fill="url(#pShadeL)" opacity={0.6} />
    </g>
  </g>
);

// ───────── 10) Tahta kuş (ceviz oyma, kanatlar açık) ─────────
export const TahtaKus: React.FC<{ x: number; y: number; s?: number; t?: number; glow?: number; half?: boolean; rot?: number }> = ({ x, y, s = 1, t = 0, glow = 0, half = false, rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    {glow > 0 && <circle r={220} fill="url(#pPool)" opacity={glow * 0.6} />}
    <ellipse cx={0} cy={60} rx={110} ry={16} fill="#1E0E04" opacity={0.3} />
    {/* kanatlar */}
    {!half ? (
      <>
        <path d="M-10,-10 C-80,-90 -160,-80 -190,-40 C-140,-40 -90,-10 -40,20Z" fill="#8A5A34" stroke={LN} strokeWidth={3} />
        {[0, 1, 2, 3].map((k) => <path key={k} d={`M${-60 - k * 30},${-20 - k * 10} q-10,20 ${-20},30`} stroke="#5E3B20" strokeWidth={3} fill="none" />)}
        <path d="M10,-10 C80,-100 160,-96 196,-56 C146,-50 96,-14 44,18Z" fill="#9A6A40" stroke={LN} strokeWidth={3} />
        {[0, 1, 2, 3].map((k) => <path key={`r${k}`} d={`M${66 + k * 30},${-28 - k * 10} q10,20 20,30`} stroke="#5E3B20" strokeWidth={3} fill="none" />)}
      </>
    ) : (
      <path d="M10,-10 C60,-70 120,-76 150,-50 C110,-44 80,-14 44,18Z" fill="#B88A58" stroke={LN} strokeWidth={3} strokeDasharray="10 6" />
    )}
    {/* gövde */}
    <path d="M-70,20 C-70,-30 -20,-50 30,-40 C70,-34 96,-60 110,-50 C104,-20 90,0 70,10 C50,50 -10,60 -70,20Z" fill={half ? "#C89A68" : "#7A4A28"} stroke={LN} strokeWidth={3.4} />
    <path d="M-70,20 l-50,-10 l40,-16Z" fill="#6E4024" stroke={LN} strokeWidth={3} />
    {/* göz + gaga */}
    <circle cx={84} cy={-44} r={5} fill="#1E1208" />
    <path d="M108,-50 l22,6 -22,6Z" fill="#5E3B20" stroke={LN} strokeWidth={2} />
    {/* ceviz damarı */}
    {[0, 1, 2].map((k) => <path key={k} d={`M${-50 + k * 30},${10 - k * 6} q20,-10 40,0`} stroke="#4A2A14" strokeWidth={2} fill="none" opacity={0.6} />)}
    <path d="M-70,20 C-70,-30 -20,-50 30,-40" stroke="#FFE0B0" strokeWidth={3} fill="none" opacity={0.35} />
  </g>
);

// ───────── 11) Talaş + oyma bıçağı (marangoz köşesi, yakın) ─────────
export const Talas: React.FC<{ t: number; hand?: number }> = ({ t, hand = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#8A6A48" />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M0,${i * 96} h1920`} stroke="#6E5034" strokeWidth={3} opacity={0.5} />)}
    {Array.from({ length: 26 }, (_, i) => {
      const x = 200 + rnd(i) * 1500, y = 200 + rnd(i + 5) * 760, r = 30 + rnd(i + 9) * 40;
      return <path key={i} d={`M${x},${y} a${r},${r * 0.6} 0 1 1 ${r * 0.8},${r * 0.5} a${r * 0.6},${r * 0.4} 0 1 1 ${-r * 0.5},${-r * 0.3}`} stroke={i % 2 ? "#E8C890" : "#D8B070"} strokeWidth={10} fill="none" strokeLinecap="round" transform={`rotate(${rnd(i + 2) * 360},${x},${y})`} />;
    })}
    <g transform="translate(1300,700) rotate(-20)"><rect x={-200} y={-14} width={240} height={28} rx={10} fill="#5E3B20" stroke={LN} strokeWidth={3} /><path d="M40,-12 L200,-4 L200,4 L40,12Z" fill="#C8CCD4" stroke="#5A5E66" strokeWidth={2} /></g>
    <g transform="translate(620,560)"><rect x={-120} y={-60} width={240} height={120} rx={20} fill="#9A6A40" stroke={LN} strokeWidth={4} /><path d="M-80,-20 q40,-30 80,0 q40,30 80,0" stroke="#5E3B20" strokeWidth={4} fill="none" /></g>
    {hand > 0 && <g transform={`translate(${lerp(1900, 1100, ease(hand))},${lerp(300, 520, ease(hand))})`}><path d="M0,0 L320,-60 L340,40 L20,80Z" fill={P.skin2} stroke={LN} strokeWidth={4} /><path d="M0,0 L-40,10 Q-60,40 -30,60 L20,80Z" fill={P.skin} stroke={LN} strokeWidth={4} /><path d="M330,-60 L520,-90 L540,60 L340,40Z" fill="#E9E2D4" stroke={LN} strokeWidth={3} /></g>}
  </g>
);

// ───────── 12) Marangozhane köşesi (sırtı dönük yaşlı adam + tezgâh) ─────────
export const MarangozKose: React.FC<{ t: number; night?: number }> = ({ t, night = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={mix("#E2D6BE", "#4A4252", night * 0.5)} />
    <rect x={1300} y={120} width={340} height={560} fill="#5E4430" stroke={LN} strokeWidth={5} />
    {Array.from({ length: 9 }, (_, q) => <rect key={q} x={1306} y={150 + q * 60} width={328} height={3} fill="#FFF4D0" opacity={0.8} />)}
    <rect y={760} width={1920} height={320} fill={mix("#B8905E", "#3A2A1E", night * 0.5)} />
    {/* duvarda aletler */}
    {[[300, 300, "testere"], [460, 280, "rende"], [600, 300, "keski"], [740, 290, "pergel"]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x},${y})`}><circle r={6} fill="#3A2A1E" />{i === 0 ? <path d="M0,0 L-60,200 L40,200Z" fill="#B8BCC4" stroke={LN} strokeWidth={3} /> : i === 1 ? <rect x={-60} y={20} width={120} height={40} rx={8} fill="#8A5A34" stroke={LN} strokeWidth={3} /> : i === 2 ? <path d="M0,0 v160 M-6,160 h12 l-6,30Z" stroke="#5E3B20" strokeWidth={10} /> : <path d="M0,0 L-40,160 M0,0 L40,160" stroke="#6A6A70" strokeWidth={6} />}</g>
    ))}
    {/* tezgâh */}
    <rect x={200} y={700} width={1100} height={50} fill="#8A5A34" stroke={LN} strokeWidth={4} />
    {[240, 1240].map((lx) => <rect key={lx} x={lx} y={750} width={30} height={220} fill="#5E3B20" />)}
    <rect x={500} y={660} width={260} height={44} rx={6} fill="#C89A68" stroke={LN} strokeWidth={3} />
    {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${300 + i * 90},${980 - (i % 3) * 10} a20,12 0 1 1 16,10`} stroke="#E8C890" strokeWidth={6} fill="none" />)}
  </g>
);

// ───────── 13) Topkapı'daki uzun salon (kadınlar bir yanda, Çerkez babalar öbür yanda) ─────────
export const TopkapiSalon: React.FC<{ t: number; pan?: number }> = ({ t, pan = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#E9DCC0" />
    {/* İznik çini kuşağı */}
    <rect y={420} width={1920} height={200} fill="#F4F0E6" />
    {Array.from({ length: 30 }, (_, i) => {
      const x = ((i * 120 - pan * 0.6) % 3600 + 3600) % 3600 - 200;
      return <g key={i} transform={`translate(${x},520)`}><rect x={-58} y={-98} width={116} height={196} fill="#FFFFFF" stroke="#2B5DA8" strokeWidth={3} /><path d="M0,-70 C24,-40 24,-10 0,20 C-24,-10 -24,-40 0,-70Z" fill="#B8322E" /><path d="M0,20 v60 M0,50 q-24,-10 -34,-34 M0,50 q24,-10 34,-34" stroke="#2FA3A0" strokeWidth={6} fill="none" /><circle cx={-40} cy={-80} r={8} fill="#2B5DA8" /><circle cx={40} cy={-80} r={8} fill="#2B5DA8" /></g>;
    })}
    {/* sivri kemerler */}
    {Array.from({ length: 8 }, (_, i) => {
      const x = ((i * 520 - pan) % 4160 + 4160) % 4160 - 400;
      return <g key={i} transform={`translate(${x},0)`}><path d="M-200,420 L-200,220 Q-200,60 0,20 Q200,60 200,220 L200,420" fill="none" stroke="#B8A070" strokeWidth={30} /><path d="M-200,420 L-200,220 Q-200,60 0,20 Q200,60 200,220 L200,420" fill="none" stroke="#2B5DA8" strokeWidth={6} /><rect x={-220} y={420} width={40} height={400} fill="#D8C8A8" stroke={LN} strokeWidth={3} /></g>;
    })}
    <rect y={820} width={1920} height={260} fill="#B89A6A" />
    <rect y={820} width={1920} height={260} fill="url(#hDamask)" opacity={0.25} />
    <path d="M0,840 h1920" stroke="#8A1F24" strokeWidth={30} opacity={0.5} />
  </g>
);

// ───────── 14) Mektup kâğıdı (yakın, açılmış zarf + mürekkep satırları) ─────────
export const SurgunMektup: React.FC<{ t: number; k?: number; line?: string; hl?: number }> = ({ t, k = 1, line = "", hl = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#3A2A20" />
    <g transform={`translate(960,${lerp(700, 540, ease(k))}) rotate(${-3 + Math.sin(t * 0.6) * 0.6})`}>
      <rect x={-620} y={-430} width={1240} height={860} fill="#F4EAD2" stroke={LN} strokeWidth={4} />
      <rect x={-620} y={-430} width={1240} height={860} fill="url(#pShadeL)" opacity={0.25} />
      {Array.from({ length: 13 }, (_, i) => { const w = 900 + rnd(i) * 200; const shown = ease((k - 0.2 - i * 0.04) * 3); return <path key={i} d={`M-520,${-330 + i * 52} q${w * 0.25},-8 ${w * 0.5},0 t${w * 0.5},0`} stroke="#2A3A6A" strokeWidth={4} fill="none" strokeDasharray={`${w * 1.1}`} strokeDashoffset={w * 1.1 * (1 - shown)} opacity={0.75} />; })}
      {line && <g opacity={ease(hl)}><rect x={-560} y={300} width={1120} height={80} fill="#FFE49A" opacity={0.6} /><text x={0} y={354} textAnchor="middle" fontFamily="Georgia, serif" fontStyle="italic" fontSize={52} fill="#2A1E16">{line}</text></g>}
      <path d="M-620,-430 l40,40 M620,-430 l-40,40" stroke={LN} strokeWidth={2} opacity={0.4} />
    </g>
    <g transform="translate(1560,880) rotate(12)"><rect x={-200} y={-120} width={400} height={240} fill="#E2D4B4" stroke={LN} strokeWidth={4} /><path d="M-200,-120 L0,30 L200,-120" fill="none" stroke={LN} strokeWidth={4} /><circle cx={0} cy={30} r={26} fill="#8A1F24" opacity={0.85} /></g>
  </g>
);

// ───────── 15) SMS Loreley (Ege, gri savaş gemisi, iki baca, mayın) ─────────
export const Loreley: React.FC<{ t: number; night?: number; mines?: number; pan?: number; close?: number }> = ({ t, night = 0, mines = 0, pan = 0, close = 0 }) => {
  const bob = Math.sin(t * 1.4) * 6;
  const sky = night > 0.5 ? "url(#pNightSky)" : "url(#pDaySky)";
  return (
    <g>
      <rect width={1920} height={1080} fill={sky} />
      {night > 0.5 && <Stars t={t} n={50} y1={400} />}
      {/* uzak ada (Limni) */}
      <path d={`M${1200 - pan * 0.1},560 q120,-80 260,-20 q90,-40 200,10 L${1800 - pan * 0.1},560Z`} fill={mix("#8AA0A8", "#1A2440", night)} />
      <rect y={560} width={1920} height={520} fill={night > 0.5 ? "#101A38" : "#3E7FA0"} />
      {Array.from({ length: 50 }, (_, i) => <path key={i} d={`M${(i * 61 - t * 40 - pan * 0.5) % 2100 + (i * 61 - t * 40 < 0 ? 2100 : 0) - 90},${580 + (i % 10) * 48} q20,-8 40,0`} stroke="#FFFFFF" strokeWidth={3} fill="none" opacity={0.35} />)}
      {/* gemi */}
      <g transform={`translate(${960 - pan},${640 + bob}) scale(${1 + close * 0.6})`}>
        <path d="M-640,0 L600,0 L700,-30 L640,90 L-560,90 Z" fill="#5E646E" stroke="#1E2228" strokeWidth={5} />
        <path d="M-640,0 L600,0 L700,-30 L640,20 L-600,20Z" fill="#7A808A" />
        <rect x={-360} y={-120} width={520} height={120} fill="#8A9098" stroke="#1E2228" strokeWidth={4} />
        <rect x={-200} y={-200} width={240} height={80} fill="#9AA0A8" stroke="#1E2228" strokeWidth={4} />
        {Array.from({ length: 10 }, (_, k) => <circle key={k} cx={-330 + k * 52} cy={-60} r={10} fill={night > 0.5 ? "#FFD089" : "#2A2E36"} />)}
        {[-260, -60].map((fx, i) => <g key={i}><rect x={fx} y={-330} width={60} height={210} fill="#C8B070" stroke="#1E2228" strokeWidth={4} /><rect x={fx} y={-330} width={60} height={30} fill="#1E1E1E" />{Array.from({ length: 5 }, (_, s) => { const life = (t * 0.3 + s / 5 + i * 0.1) % 1; return <circle key={s} cx={fx + 30 - life * 360} cy={-350 - life * 220} r={30 + life * 120} fill="#4A4A4A" opacity={(1 - life) * 0.45} filter="url(#pBlur16)" />; })}</g>)}
        <path d="M200,-120 v-260 M200,-330 h-100" stroke="#2A2E36" strokeWidth={8} />
        {/* Alman sancağı (siyah-beyaz-kırmızı, arma yok) */}
        <g transform={`translate(560,-40)`}><rect x={0} y={-160} width={6} height={160} fill="#2A2E36" /><rect x={6} y={-160} width={120} height={24} fill="#141414" /><rect x={6} y={-136} width={120} height={24} fill="#F7F7F7" /><rect x={6} y={-112} width={120} height={24} fill="#C0262A" /></g>
        <path d="M-640,0 L600,0 L700,-30 L640,90 L-560,90 Z" fill="url(#pShadeL)" opacity={0.4} />
      </g>
      {/* mayınlar */}
      {mines > 0 && Array.from({ length: 6 }, (_, i) => { const x = ((i * 380 - pan * 1.2 + 200) % 2300 + 2300) % 2300 - 200; return <g key={i} transform={`translate(${x},${820 + (i % 3) * 70 + Math.sin(t * 1.2 + i) * 6})`} opacity={mines}><circle r={36} fill="#2A2A2E" stroke="#000" strokeWidth={3} />{Array.from({ length: 8 }, (_, s) => <path key={s} d={`M0,0 L${Math.cos(s * Math.PI / 4) * 54},${Math.sin(s * Math.PI / 4) * 54}`} stroke="#2A2A2E" strokeWidth={8} />)}</g>; })}
    </g>
  );
};

// ───────── 16) Beylerbeyi Sarayı (Boğaz kıyısı, iki deniz köşkü) ─────────
export const Beylerbeyi: React.FC<{ t: number; dawn?: number; pan?: number; ship?: number }> = ({ t, dawn = 0.3, pan = 0, ship = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="url(#pNightSky)" />
    <rect width={1920} height={700} fill="#E8A870" opacity={dawn * 0.45} />
    <Stars t={t} n={30} y1={300} />
    {/* karşı kıyı: Rumeli, minareler */}
    <path d="M0,520 Q480,470 960,500 T1920,490 L1920,600 L0,600Z" fill={mix("#1A2448", "#6A7A9A", dawn)} />
    {[260, 620, 1380, 1700].map((x) => <Minare key={x} x={x - pan * 0.1} y={520} h={110} c={mix("#0E1530", "#4A5A7A", dawn)} />)}
    <g transform={`translate(${900 - pan * 0.1},510)`} fill={mix("#0E1530", "#4A5A7A", dawn)}><path d="M-90,0 a90,70 0 0 1 180,0Z" /><rect x={-120} y={-140} width={10} height={140} /><rect x={110} y={-140} width={10} height={140} /></g>
    <rect y={600} width={1920} height={480} fill={mix("#101A38", "#4A6A8A", dawn)} />
    {Array.from({ length: 50 }, (_, i) => <rect key={i} x={(i * 71 + t * 25) % 2100 - 90} y={620 + (i % 10) * 40} width={30 + (i % 4) * 12} height={2.4} fill="#FFD8A0" opacity={0.25 + 0.2 * Math.sin(t * 2 + i)} />)}
    {/* saray */}
    <g transform={`translate(${960 - pan * 0.5},820)`}>
      <rect x={-520} y={-280} width={1040} height={280} fill={mix("#BFC4D0", "#F4F0E8", dawn)} stroke={LN} strokeWidth={4} />
      <rect x={-560} y={-300} width={1120} height={26} fill={mix("#9AA0B0", "#E2DCD0", dawn)} stroke={LN} strokeWidth={3} />
      {Array.from({ length: 11 }, (_, k) => <g key={k}><path d={`M${-460 + k * 92},-40 L${-460 + k * 92},-200 A30,30 0 0 1 ${-400 + k * 92},-200 L${-400 + k * 92},-40Z`} fill={k % 4 === 1 ? "#FFD089" : mix("#2A3458", "#7A8AA8", dawn)} stroke={LN} strokeWidth={3} /></g>)}
      {[-1, 1].map((sd) => <g key={sd} transform={`translate(${sd * 640},0)`}><rect x={-90} y={-180} width={180} height={180} fill={mix("#BFC4D0", "#F4F0E8", dawn)} stroke={LN} strokeWidth={4} /><path d="M-110,-180 L110,-180 L0,-250Z" fill={mix("#6A7488", "#B8C0CC", dawn)} stroke={LN} strokeWidth={3} /></g>)}
      <rect x={-760} y={0} width={1520} height={30} fill={mix("#8A90A0", "#D8D2C4", dawn)} />
      <Bayrak x={0} y={-300} t={t} s={0.7} pole={140} />
    </g>
    {ship > 0 && <g transform={`translate(${lerp(-400, 300, ship)},700) scale(0.4)`}><path d="M-640,0 L600,0 L700,-30 L640,90 L-560,90 Z" fill="#3A3E46" /><rect x={-360} y={-120} width={520} height={120} fill="#4A4E56" />{[-260, -60].map((fx) => <rect key={fx} x={fx} y={-330} width={60} height={210} fill="#6A5A3A" />)}</g>}
  </g>
);

// ───────── 17) Abaza köyü (dış) + babanın tezgâh odası (kuş rafı) ─────────
export const AbazaKoy: React.FC<{ t: number; pan?: number; spring?: number }> = ({ t, pan = 0, spring = 1 }) => (
  <g>
    <rect width={1920} height={760} fill="url(#pDaySky)" />
    {/* Sakarya ovası + uzak dağlar */}
    <path d={`M0,520 Q400,420 800,500 T1600,470 T2400,520 L2400,760 L0,760Z`} fill="#8AA0A0" transform={`translate(${-pan * 0.15},0)`} />
    <path d={`M0,600 Q500,540 1000,590 T2000,580 L2000,760 L0,760Z`} fill="#7A9A5A" transform={`translate(${-pan * 0.3},0)`} />
    {/* cami + minare (köy camisi) */}
    <g transform={`translate(${1500 - pan * 0.3},600)`}><rect x={-80} y={-110} width={160} height={110} fill="#F2ECE0" stroke={LN} strokeWidth={3} /><path d="M-90,-110 L90,-110 L0,-170Z" fill="#B8452F" stroke={LN} strokeWidth={3} /><Minare x={120} y={0} h={200} c="#F2ECE0" /></g>
    {/* ahşap evler + çit */}
    {[0, 1, 2, 3].map((k) => (
      <g key={k} transform={`translate(${200 + k * 480 - pan * 0.7},780)`}>
        <rect x={-160} y={-240} width={320} height={240} fill={["#A87A4A", "#9A6A40", "#B88A58", "#8A6A44"][k]} stroke={LN} strokeWidth={4} />
        {Array.from({ length: 7 }, (_, q) => <path key={q} d={`M-160,${-210 + q * 32} h320`} stroke="#6E4628" strokeWidth={3} opacity={0.6} />)}
        <path d="M-190,-240 L0,-340 L190,-240Z" fill="#7A3A2A" stroke={LN} strokeWidth={4} />
        <rect x={-40} y={-140} width={80} height={140} fill="#5E3B20" stroke={LN} strokeWidth={3} />
        <rect x={70} y={-180} width={60} height={60} fill="#2C3B6E" stroke={LN} strokeWidth={3} />
        <rect x={-130} y={-360} width={26} height={70} fill="#6E4628" />
        <circle cx={-117} cy={-380 - (t * 20) % 40} r={18} fill="#D8D4CC" opacity={0.5} filter="url(#pBlur8)" />
      </g>
    ))}
    <rect y={760} width={1920} height={320} fill="#8A9A5A" />
    {Array.from({ length: 40 }, (_, i) => <g key={i} transform={`translate(${((i * 60 - pan) % 2400 + 2400) % 2400 - 200},850)`}><rect x={-4} y={-70} width={8} height={70} fill="#7A5A34" /></g>)}
    <path d="M-200,815 h2400 M-200,840 h2400" stroke="#7A5A34" strokeWidth={6} transform={`translate(${-pan % 60},0)`} />
    {spring > 0 && Array.from({ length: 24 }, (_, i) => <circle key={i} cx={((i * 87 - pan) % 2000 + 2000) % 2000} cy={900 + (i % 5) * 34} r={7} fill={i % 2 ? "#F2E06A" : "#F7F1E6"} opacity={spring} />)}
  </g>
);

export const KusRafi: React.FC<{ t: number; n?: number; extra?: boolean; light?: number }> = ({ t, n = 15, extra = false, light = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill="#6E5034" />
    {Array.from({ length: 14 }, (_, i) => <path key={i} d={`M${i * 140},0 v1080`} stroke="#5E4028" strokeWidth={6} opacity={0.6} />)}
    {/* pencereden gün ışığı */}
    <path d="M1500,120 L1820,120 L1820,520 L1500,520Z" fill="#FFF4D0" opacity={0.85 * light} />
    <path d="M1500,520 L1820,520 L1100,1080 L700,1080Z" fill="#FFF4D0" opacity={0.12 * light} />
    {/* raf */}
    <rect x={160} y={480} width={1300} height={26} fill="#4A2E1A" stroke={LN} strokeWidth={4} />
    {[220, 1380].map((x) => <path key={x} d={`M${x},506 l0,60 l40,-60`} stroke="#4A2E1A" strokeWidth={10} fill="none" />)}
    {Array.from({ length: Math.min(n, 16) }, (_, i) => <TahtaKus key={i} x={230 + i * 76} y={440} s={0.34} t={t} half={i === 15} rot={i % 2 ? -4 : 3} />)}
    {extra && <TahtaKus x={230 + 16 * 76} y={440} s={0.34} t={t} rot={0} glow={0.6} />}
    {/* tezgâh + talaş */}
    <rect x={120} y={820} width={1500} height={60} fill="#8A5A34" stroke={LN} strokeWidth={4} />
    {Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${200 + i * 110},${940 + (i % 3) * 20} a20,12 0 1 1 16,10`} stroke="#E8C890" strokeWidth={6} fill="none" />)}
    <Motes t={t} n={30} />
  </g>
);

const Motes: React.FC<{ t: number; n?: number }> = ({ t, n = 30 }) => (
  <g>{Array.from({ length: n }, (_, i) => <circle key={i} cx={(rnd(i) * 1920 + t * 8 * (i % 3)) % 1920} cy={(rnd(i + 2) * 1080 - t * 6) % 1080 + (rnd(i + 2) * 1080 - t * 6 < 0 ? 1080 : 0)} r={1.6 + rnd(i) * 1.6} fill="#FFF2C8" opacity={0.5} />)}</g>
);

// ───────── 18) Araba içi (gece, kırık kapı + halkaya geçmiş parmak) ─────────
export const ArabaIc: React.FC<{ t: number; rattle?: number; close?: number }> = ({ t, rattle = 1, close = 0 }) => {
  const shake = Math.sin(t * 23) * 3 * rattle;
  return (
    <g transform={`translate(0,${shake})`}>
      <rect width={1920} height={1080} fill="#1E1418" />
      {/* kapı */}
      <g transform={`translate(${960 + Math.sin(t * 5) * 10 * rattle},0)`}>
        <rect x={-380} y={60} width={760} height={980} rx={20} fill="#3A2420" stroke="#0E0806" strokeWidth={8} />
        <rect x={-300} y={120} width={600} height={360} rx={14} fill="#141B36" stroke="#C9A35A" strokeWidth={8} />
        {/* dışarıda geçen sokak lambaları */}
        {Array.from({ length: 3 }, (_, i) => { const x = ((i * 400 - t * 600) % 1200 + 1200) % 1200 - 300; return <circle key={i} cx={x - 300 + 300} cy={300} r={18} fill="#FFD089" opacity={0.8} />; })}
        <rect x={-300} y={120} width={600} height={360} fill="url(#pVeil)" opacity={0.08} />
        {/* bakır halka */}
        <g transform={`translate(240,${640 + Math.sin(t * 6) * 4})`}>
          <circle r={70} fill="none" stroke="#C9A35A" strokeWidth={18} />
          <circle r={70} fill="none" stroke="#7A5A28" strokeWidth={4} />
          {/* parmak (kadın eli) */}
          <path d="M-260,40 Q-150,10 -60,-6 L60,-14 Q86,-12 84,8 Q80,26 56,24 L-50,30 Q-150,70 -260,110Z" fill={P.skin} stroke={LN} strokeWidth={4} />
          <path d="M40,-14 Q64,-10 66,6" stroke={mix(P.skin2, "#8A3A5A", 0.5 + 0.4 * close)} strokeWidth={10} fill="none" opacity={0.7} />
          <path d="M-260,40 Q-150,10 -60,-6" stroke="#E9DCC2" strokeWidth={30} fill="none" opacity={0.0} />
          <path d="M-400,30 L-260,40 L-260,110 L-400,140Z" fill="#E9E0D0" stroke={LN} strokeWidth={3} />
        </g>
        <rect x={-380} y={60} width={760} height={980} rx={20} fill="url(#pShadeR)" opacity={0.5} />
      </g>
    </g>
  );
};

export const _surgunUnused = { lerp, ease, H };
