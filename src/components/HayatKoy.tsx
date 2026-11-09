import React from "react";
import { H, Look, cl, lp, rp } from "./Hayat";

// Kanal 4 kiti · köy / baraj / gece yolu / yapay zekâ kanal kapakları (2026-11-08, k6-03).
// Hepsi vektör ve t'ye bağlı. Yeni videolarda tekrar kullanılabilir.

const UI = "Poppins";
const T = (x: number, y: number, s: string, size = 24, c = "#FFF", w = 600, a: "start" | "middle" | "end" = "start") => <text x={x} y={y} fontFamily={UI} fontWeight={w} fontSize={size} fill={c} textAnchor={a}>{s}</text>;

export const DEDE: Look = { hairStyle: "bald", hair: "#CFCFCF", top: "#6B5B4A", top2: "#56483A", kind: "cardigan", mustache: true, glasses: true, skin: "#D9A47E" };
export const HALA: Look = { hairStyle: "scarf", scarf: "#3E6E8E", top: "#9E6B8A", top2: "#82546F", kind: "cardigan" };
export const TEYZE: Look = { hairStyle: "scarf", scarf: "#C2884A", top: "#5E7D6A", top2: "#4B6656", kind: "cardigan" };
export const ELA: Look = { hairStyle: "bun", hair: "#4A2E1E", top: "#F2A93B", top2: "#D18E26", kind: "tshirt" };

// ───────── minare (alem dahil). (0,0) = gövde dibi
export const Minare: React.FC<{ x: number; y: number; s?: number; shine?: number }> = ({ x, y, s = 1, shine = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-26} y={-520} width={52} height={520} fill="#E9E1D0" />
    <rect x={-26} y={-520} width={14} height={520} fill="#D2C7B0" />
    <rect x={-40} y={-360} width={80} height={22} fill="#CFC4AD" /><rect x={-36} y={-338} width={72} height={10} fill="#BDB198" />
    {[0, 1, 2].map((i) => <rect key={i} x={-8} y={-300 + i * 90} width={16} height={34} rx={8} fill="#5A5446" />)}
    <path d="M-28,-520 L0,-640 L28,-520Z" fill="#7C8A96" />
    <line x1={0} y1={-640} x2={0} y2={-690} stroke="#C9A64A" strokeWidth={6} />
    <path d="M-14,-690 A16,16 0 1,0 14,-690 A12,12 0 1,1 -14,-690Z" fill="#E2BE4E" />
    {shine > 0 && <circle cx={0} cy={-690} r={60} fill="url(#hLamp)" opacity={shine} />}
  </g>
);

// ───────── baraj gölü + su altındaki köy. level: 0 dolu (sadece alem), 1 kurumuş
export const Baraj: React.FC<{ t: number; level?: number; night?: boolean; px?: number; people?: React.ReactNode }> = ({ t, level = 0.85, night, px = 0, people }) => {
  const wy = lp(330, 820, level); // su yüzeyi
  const sky = night ? "#0C1428" : "#F0C27A";
  return (
    <g>
      <rect width={1920} height={1080} fill={sky} />
      {!night && <rect width={1920} height={600} fill="#8FC3E6" opacity={0.6} />}
      {night ? <><circle cx={1500 + px * 0.1} cy={170} r={70} fill="#F3EFD8" />{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 97) % 420} r={2} fill="#FFF" opacity={0.3 + 0.5 * ((Math.sin(t * 2 + i) + 1) / 2)} />)}</> : <circle cx={1580 + px * 0.1} cy={150} r={80} fill="#FFF3C4" />}
      {/* uzak dağlar */}
      <path d={`M${-50 + px * 0.2},430 L300,250 L560,380 L820,220 L1120,390 L1400,260 L1700,380 L1980,280 L1980,600 L-50,600Z`} fill={night ? "#1A2440" : "#B9A06E"} />
      <path d={`M${-50 + px * 0.35},520 L240,400 L520,480 L900,360 L1260,500 L1600,420 L1980,500 L1980,700 L-50,700Z`} fill={night ? "#202B47" : "#A7895A"} />
      {/* çatlak kurumuş çamur */}
      <rect y={480} width={1920} height={600} fill={night ? "#2B2A33" : "#9C8664"} />
      {Array.from({ length: 26 }, (_, i) => <path key={i} d={`M${(i * 151 + px) % 1920},${560 + (i * 67) % 480} l${40 + (i % 5) * 12},${-14 + (i % 3) * 10} l${30},${22} l${-20},${30}`} stroke={night ? "#1C1B22" : "#7A6646"} strokeWidth={3} fill="none" />)}
      {/* köy kalıntıları */}
      <g transform={`translate(${px},0)`}>
        {[[380, 640, 220, 120], [700, 610, 180, 100], [1240, 650, 240, 130], [1560, 620, 160, 90]].map(([x, y, w, h], i) => (
          <g key={i}>
            <path d={`M${x},${y} L${x},${y - h} L${x + w * 0.4},${y - h - 26} L${x + w * 0.55},${y - h + 10} L${x + w},${y - h + 30} L${x + w},${y}Z`} fill={night ? "#3A3540" : "#B8A47F"} />
            <rect x={x + w * 0.3} y={y - h * 0.6} width={w * 0.18} height={h * 0.3} fill={night ? "#15141A" : "#5E4E36"} />
          </g>
        ))}
        {/* cami gövdesi */}
        <rect x={900} y={560} width={260} height={110} fill={night ? "#3F3A44" : "#C9B892"} />
        <path d="M900,560 A130,90 0 0,1 1160,560Z" fill={night ? "#4A4652" : "#8E9AA2"} />
        <Minare x={1200} y={670} s={0.62} shine={night ? 0.8 : 0} />
        {/* taş çeşme */}
        <g transform="translate(560,760)"><rect x={-60} y={-90} width={120} height={90} fill={night ? "#4A4652" : "#CFC2A2"} /><path d="M-60,-90 A60,40 0 0,1 60,-90Z" fill={night ? "#3A3540" : "#B8A47F"} /><rect x={-6} y={-50} width={12} height={20} fill="#555" /><rect x={-70} y={0} width={140} height={20} fill={night ? "#3A3540" : "#B3A27F"} /></g>
      </g>
      {/* su */}
      <rect y={wy} width={1920} height={1080 - wy} fill={night ? "#16233E" : "#4A86A8"} opacity={0.93} />
      {Array.from({ length: 14 }, (_, i) => <rect key={i} x={((i * 157 + t * 30) % 2100) - 100} y={wy + 20 + (i % 5) * 50} width={90} height={4} rx={2} fill="#FFF" opacity={0.25} />)}
      {night && <rect x={1440} y={wy} width={120} height={1080 - wy} fill="#F3EFD8" opacity={0.12} />}
      {people}
    </g>
  );
};

// ───────── köy evi (dedenin evi): sedir, kilim, soba, çekmeceli dolap
export const KoyEvi: React.FC<{ t: number; night?: boolean; px?: number; drawer?: number }> = ({ t, night = true, px = 0, drawer = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#3A2E26" : "#E7D7BC"} />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={0} y={i * 22} width={1920} height={10} fill="#5A4030" opacity={0.6} />)}
    <rect y={760} width={1920} height={320} fill="#5E4330" />
    <rect x={240 + px} y={820} width={1100} height={220} fill="#A8323A" /><rect x={280 + px} y={850} width={1020} height={160} fill="none" stroke="#E9C46A" strokeWidth={6} />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${330 + i * 120 + px},930 l40,-40 l40,40 l-40,40Z`} fill="#2E4E7E" />)}
    {/* sedir */}
    <rect x={60 + px * 0.8} y={560} width={700} height={200} fill="#6E4E8A" /><rect x={60 + px * 0.8} y={500} width={700} height={70} rx={20} fill="#7E5E9A" />
    {/* soba */}
    <g transform={`translate(${880 + px * 0.6},760)`}><rect x={-80} y={-220} width={160} height={220} rx={16} fill="#2A2A2A" /><rect x={-50} y={-150} width={100} height={60} fill={night ? "#E8662A" : "#555"} opacity={0.6 + 0.3 * Math.sin(t * 7)} /><rect x={-14} y={-560} width={28} height={340} fill="#3A3A3A" /></g>
    {/* pencere */}
    <g transform={`translate(${1160 + px * 0.4},150)`}><rect width={300} height={300} fill={night ? "#0C1428" : "#9BC7E8"} />{night && <circle cx={220} cy={80} r={30} fill="#F3EFD8" />}<rect x={146} width={8} height={300} fill="#EFE7DA" /><rect y={146} width={300} height={8} fill="#EFE7DA" /><rect x={-14} y={-14} width={328} height={328} fill="none" stroke="#EFE7DA" strokeWidth={14} /></g>
    {/* çekmeceli dolap */}
    <g transform={`translate(${1600 + px * 0.6},500)`}>
      <rect x={-170} y={0} width={340} height={260} fill="#8A5A36" />
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${i === 1 ? drawer * 40 : 0},${20 + i * 80})`}><rect x={-150} y={0} width={300} height={66} fill={i === 1 && drawer > 0 ? "#A0703F" : "#7A4E2E"} /><circle cx={0} cy={33} r={8} fill="#E2BE4E" /></g>)}
      <rect x={-90} y={-40} width={50} height={40} fill="#C9A64A" /><rect x={20} y={-90} width={70} height={90} fill="#EFE7DA" />
    </g>
    {/* tavandan ampul */}
    <g transform={`translate(${760 + px * 0.3},0)`}><line x1={0} y1={0} x2={0} y2={140} stroke="#222" strokeWidth={3} /><circle cy={160} r={22} fill={night ? "#FFE7A8" : "#EEE"} />{night && <ellipse cy={240} rx={360} ry={240} fill="url(#hLamp)" opacity={0.55} />}</g>
    <rect width={1920} height={1080} fill="#0A0F2A" opacity={night ? 0.25 : 0} />
  </g>
);

// ───────── dedenin evi (şehir), TV'de haber
export const DedeSalon: React.FC<{ t: number; px?: number; tv?: React.ReactNode }> = ({ t, px = 0, tv }) => (
  <g>
    <rect width={1920} height={1080} fill="#CDB892" />
    {Array.from({ length: 20 }, (_, i) => <path key={i} d={`M${(i * 97 + px * 0.3) % 1920},${(i * 53) % 700} l10,18 l-10,18 l-10,-18Z`} fill="#B39C72" opacity={0.5} />)}
    <rect y={760} width={1920} height={320} fill="#7A5236" />
    <ellipse cx={960 + px} cy={950} rx={760} ry={100} fill="#8E2A30" />
    {/* duvarda saat ve eski fotoğraf */}
    <g transform={`translate(${380 + px * 0.4},220)`}><circle r={70} fill="#F4EEDD" stroke="#5A4030" strokeWidth={10} /><line x1={0} y1={0} x2={0} y2={-44} stroke="#222" strokeWidth={6} /><line x1={0} y1={0} x2={32} y2={10} stroke="#222" strokeWidth={5} transform={`rotate(${t * 6} 0 0)`} /></g>
    <g transform={`translate(${620 + px * 0.4},170) rotate(-2)`}><rect width={170} height={130} fill="#5A4030" /><rect x={10} y={10} width={150} height={110} fill="#9A9488" /><path d="M20,110 L60,60 L90,90 L120,50 L150,110Z" fill="#6A655C" /></g>
    {/* TV */}
    <g transform={`translate(${1340 + px * 0.5},380)`}>
      <rect x={-300} y={-190} width={600} height={360} rx={12} fill="#111" />
      <svg x={-284} y={-174} width={568} height={328} viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">{tv}</svg>
      <rect x={-284} y={-174} width={568} height={328} fill="#FFF" opacity={0.04 + 0.03 * Math.sin(t * 6)} />
      <rect x={-340} y={170} width={680} height={140} fill="#5E4330" /><rect x={-320} y={190} width={300} height={100} fill="#4E3626" />
      {/* dantel örtü */}
      <path d="M-200,170 L200,170 L180,200 L-180,200Z" fill="#F4EEDD" />
    </g>
    {/* koltuk */}
    <g transform={`translate(${120 + px * 0.8},600)`}><rect width={700} height={220} rx={40} fill="#7D5A3A" /><rect x={20} y={-140} width={660} height={170} rx={40} fill="#8E6A48" /><path d="M140,-60 L320,-60 L300,20 L160,20Z" fill="#F4EEDD" opacity={0.85} /></g>
  </g>
);

// ───────── gece yolu (araba içi): ön cam, yol çizgileri, far, saat
export const NightRoad: React.FC<{ t: number; time?: string; hands?: React.ReactNode }> = ({ t, time = "01:12", hands }) => (
  <g>
    <rect width={1920} height={1080} fill="#05070D" />
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 263) % 1920} cy={(i * 41) % 300} r={1.6} fill="#FFF" opacity={0.5} />)}
    <path d="M0,520 L1920,520 L1920,1080 L0,1080Z" fill="#0D1018" />
    <path d="M760,520 L1160,520 L1900,1080 L20,1080Z" fill="#1A1D24" />
    <path d="M760,520 L1160,520 L1900,1080 L20,1080Z" fill="url(#hLamp)" opacity={0.35} />
    {Array.from({ length: 7 }, (_, i) => { const k = ((t * 0.9 + i / 7) % 1); const y = 520 + k * k * 560; const w = 4 + k * 26; return <rect key={i} x={960 - w / 2} y={y} width={w} height={10 + k * 70} fill="#F3E3A0" opacity={0.8} />; })}
    {/* yol kenarı direkleri */}
    {Array.from({ length: 4 }, (_, i) => { const k = ((t * 0.7 + i / 4) % 1); return <g key={i}><rect x={lp(740, 80, k)} y={lp(510, 760, k)} width={4 + k * 14} height={20 + k * 120} fill="#DDD" opacity={0.6} /><rect x={lp(1180, 1840, k)} y={lp(510, 760, k)} width={4 + k * 14} height={20 + k * 120} fill="#DDD" opacity={0.6} /></g>; })}
    {/* gösterge paneli */}
    <path d="M0,820 Q960,700 1920,820 L1920,1080 L0,1080Z" fill="#0B0B0F" />
    <g transform="translate(1440,900)"><rect x={-110} y={-40} width={220} height={80} rx={10} fill="#0E1B14" />{T(0, 18, time, 48, "#5CF08E", 700, "middle")}</g>
    <g transform="translate(700,980)"><circle r={200} fill="none" stroke="#1B1B22" strokeWidth={40} /><circle r={200} fill="none" stroke="#2A2A33" strokeWidth={6} /></g>
    {hands}
  </g>
);

// ───────── sinyal çubukları
export const Signal: React.FC<{ x: number; y: number; n: number; s?: number }> = ({ x, y, n, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {[0, 1, 2, 3].map((i) => <rect key={i} x={i * 26} y={-20 - i * 16} width={18} height={20 + i * 16} rx={3} fill={i < n ? "#FFF" : "#FFF"} opacity={i < n ? 1 : 0.2} />)}
    {n === 0 && <line x1={-8} y1={-74} x2={100} y2={8} stroke="#E5322D" strokeWidth={8} strokeLinecap="round" />}
  </g>
);

// ───────── yapay zekâ ördeği (altı parmaklı), şarkı söyler
export const Ordek: React.FC<{ x: number; y: number; s?: number; t: number; six?: number }> = ({ x, y, s = 1, t, six = 0 }) => {
  const bob = Math.sin(t * 6) * 8;
  const beak = 0.5 + 0.5 * Math.abs(Math.sin(t * 9));
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s})`}>
      <ellipse cx={0} cy={60} rx={170} ry={130} fill="#FFD43B" />
      <circle cx={10} cy={-110} r={100} fill="#FFD43B" />
      <circle cx={40} cy={-130} r={22} fill="#FFF" /><circle cx={46} cy={-128} r={12} fill="#111" />
      <path d={`M90,-100 L170,${-100 - 14 * beak} L90,-80Z`} fill="#F08C00" /><path d={`M90,-80 L160,${-70 + 14 * beak} L90,-74Z`} fill="#D9480F" />
      {/* kanat-el: 6 parmak */}
      <g transform={`translate(-150,40) rotate(${-20 + Math.sin(t * 6) * 14})`}>
        <ellipse cx={-30} cy={0} rx={60} ry={34} fill="#FCC419" />
        {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-120} y={-34 + i * 13} width={60} height={9} rx={4} fill="#FCC419" stroke={six > 0.5 ? "#E5322D" : "none"} strokeWidth={2} />)}
      </g>
      <ellipse cx={-40} cy={186} rx={50} ry={16} fill="#F08C00" /><ellipse cx={60} cy={186} rx={50} ry={16} fill="#F08C00" />
      {six > 0 && <circle cx={-240} cy={40} r={110} fill="none" stroke="#E5322D" strokeWidth={8} opacity={six} />}
    </g>
  );
};

// ───────── kanal kapakları (320x180 iç ölçü). kind: ruya | dizi | cocuk | luks | koy
export type CoverKind = "ruya" | "dizi" | "cocuk" | "luks" | "koy";
export const Cover: React.FC<{ x: number; y: number; w?: number; kind: CoverKind; t?: number; title?: string }> = ({ x, y, w = 320, kind, t = 0, title }) => {
  const h = w * 0.5625;
  return (
    <g transform={`translate(${x},${y})`}>
      <svg width={w} height={h} viewBox="0 0 320 180" overflow="hidden">
        {kind === "ruya" && <><rect width={320} height={180} fill="#2A1450" /><circle cx={250} cy={50} r={26} fill="#F3E9C9" /><circle cx={262} cy={42} r={24} fill="#2A1450" />{Array.from({ length: 16 }, (_, i) => <circle key={i} cx={(i * 47) % 320} cy={(i * 31) % 120} r={1.6} fill="#FFF" />)}<path d="M40,150 Q80,110 120,140 Q160,170 200,130" stroke="#7BD88F" strokeWidth={9} fill="none" strokeLinecap="round" /><circle cx={200} cy={130} r={8} fill="#7BD88F" /><text x={14} y={36} fontFamily={UI} fontWeight={700} fontSize={22} fill="#FFF">RÜYADA YILAN</text></>}
        {kind === "dizi" && <><rect width={320} height={180} fill="#1B1414" /><rect x={0} y={0} width={160} height={180} fill="#3A2020" /><circle cx={80} cy={80} r={34} fill="#C98E6A" /><rect x={40} y={116} width={80} height={64} fill="#2A2A2A" /><circle cx={240} cy={84} r={30} fill="#B57C5A" /><rect x={204} y={116} width={72} height={64} fill="#5A1E1E" /><text x={160} y={168} textAnchor="middle" fontFamily={UI} fontWeight={700} fontSize={22} fill="#FFC531" stroke="#000" strokeWidth={3} paintOrder="stroke">KİMSE BEKLEMİYORDU</text></>}
        {kind === "cocuk" && <><rect width={320} height={180} fill="#7FD3F5" /><rect y={130} width={320} height={50} fill="#69DB7C" /><circle cx={60} cy={40} r={22} fill="#FFE066" /><g transform="translate(170,96) scale(0.32)"><ellipse cx={0} cy={60} rx={170} ry={130} fill="#FFD43B" /><circle cx={10} cy={-110} r={100} fill="#FFD43B" /><circle cx={46} cy={-128} r={14} fill="#111" /><path d="M90,-100 L170,-110 L90,-78Z" fill="#F08C00" /></g>{["#FF6B6B", "#845EF7", "#FFA94D"].map((c, i) => <circle key={i} cx={250 + i * 22} cy={150 - i * 8} r={9} fill={c} />)}</>}
        {kind === "luks" && <><rect width={320} height={180} fill="#0E2A44" /><rect y={110} width={320} height={70} fill="#1D5B87" /><path d="M60,110 L250,110 L230,140 L80,140Z" fill="#F4F4F4" /><rect x={120} y={86} width={80} height={24} fill="#E8E8E8" /><text x={14} y={36} fontFamily={UI} fontWeight={700} fontSize={22} fill="#FFC531">BILLIONAIRE LIFE</text></>}
        {kind === "koy" && <><rect width={320} height={180} fill="#9C8664" /><rect y={0} width={320} height={70} fill="#8FC3E6" /><rect y={140} width={320} height={40} fill="#4A86A8" /><rect x={120} y={96} width={70} height={44} fill="#C9B892" /><rect x={196} y={36} width={12} height={104} fill="#E9E1D0" /><path d="M196,36 L202,16 L208,36Z" fill="#7C8A96" /><rect x={30} y={104} width={60} height={36} fill="#B8A47F" /><text x={14} y={30} fontFamily={UI} fontWeight={700} fontSize={20} fill="#FFF" stroke="#000" strokeWidth={3} paintOrder="stroke">SULAR ALTINDAKİ KÖY</text></>}
      </svg>
      {title && T(0, h + 34 * (w / 320), title, 22 * (w / 320), "#F1F1F1", 600)}
    </g>
  );
};

// ───────── kanal kartı (beş kanal panosu). state: on | dead | ? (gizli)
export const ChannelCard: React.FC<{ x: number; y: number; kind: CoverKind; name: string; state?: "on" | "dead" | "hidden" | "warn"; k?: number; note?: string }> = ({ x, y, kind, name, state = "on", k = 1, note }) => (
  <g transform={`translate(${x},${y + (1 - k) * 40})`} opacity={k}>
    <rect x={-150} y={-150} width={300} height={330} rx={22} fill="#1A1E27" stroke={state === "dead" ? "#555" : state === "warn" ? "#FFB547" : state === "hidden" ? "#FFC531" : "#3EA6FF"} strokeWidth={4} />
    {state === "hidden" ? <g>{T(0, 30, "?", 160, "#FFC531", 700, "middle")}</g> : <g opacity={state === "dead" ? 0.35 : 1}><Cover x={-130} y={-130} w={260} kind={kind} /></g>}
    {T(0, 80, state === "hidden" ? "5. kanal" : name, 30, "#FFF", 700, "middle")}
    {note && T(0, 130, note, 26, state === "dead" ? "#FF6B6B" : state === "warn" ? "#FFB547" : "#7BD88F", 700, "middle")}
    {state === "dead" && <line x1={-130} y1={-130} x2={130} y2={0} stroke="#E5322D" strokeWidth={10} strokeLinecap="round" />}
  </g>
);

// ───────── iki adımlı doğrulama ekranı (telefon, 360x740)
export const CodeScreen: React.FC<{ code?: string; typed?: number; wrong?: boolean; ok?: boolean }> = ({ code = "482 913", typed = 0, wrong, ok }) => (
  <g>
    <rect width={360} height={740} fill="#FFF" />
    {T(180, 110, "Doğrulama", 30, "#202124", 700, "middle")}
    {T(180, 150, "Telefonuna gelen kodu gir", 17, "#5F6368", 500, "middle")}
    <g transform="translate(30,220)">{Array.from({ length: 6 }, (_, i) => { const ch = code.replace(" ", "")[i]; return <g key={i} transform={`translate(${i * 52},0)`}><rect width={44} height={60} rx={8} fill="#F1F3F4" stroke={wrong ? "#D93025" : ok ? "#1E8E3E" : "#DADCE0"} strokeWidth={3} />{i < typed && T(22, 42, wrong && i === 3 ? "7" : ch, 30, "#202124", 700, "middle")}</g>; })}</g>
    {wrong && T(180, 320, "Yanlış kod. Tekrar dene.", 18, "#D93025", 600, "middle")}
    {ok && T(180, 320, "Giriş yapıldı", 20, "#1E8E3E", 700, "middle")}
    <rect x={30} y={600} width={300} height={56} rx={28} fill="#1A73E8" />{T(180, 636, "İleri", 20, "#FFF", 700, "middle")}
  </g>
);

// ───────── "geri alınamaz" silme diyaloğu (1000x625 ekran)
export const DeleteDialog: React.FC<{ k?: number; press?: number; name?: string }> = ({ k = 1, press = 0, name = "Dizi Özetleri TR" }) => (
  <g>
    <rect width={1000} height={625} fill={H.ui} />
    <rect width={1000} height={625} fill="#000" opacity={0.55 * k} />
    <g transform={`translate(500,${312 + (1 - k) * 30})`} opacity={k}>
      <rect x={-360} y={-200} width={720} height={400} rx={18} fill="#282828" />
      {T(-320, -130, "Kanalı kalıcı olarak sil", 34, "#FFF", 700)}
      {T(-320, -80, `${name} · 40 video · 412 B izlenme`, 20, "#AAA", 500)}
      <rect x={-320} y={-40} width={640} height={90} rx={10} fill="#3A1E1E" />
      {T(-300, 0, "Bu işlem geri alınamaz.", 28, "#FF6B6B", 700)}
      {T(-300, 34, "Tüm videolar ve yorumlar silinecek.", 18, "#DDD", 500)}
      <rect x={60} y={100} width={260} height={64} rx={32} fill={press > 0 ? "#B3261E" : "#E5322D"} transform={`scale(${1 - press * 0.05})`} />
      {T(190, 142, "SİL", 26, "#FFF", 700, "middle")}
      {T(-160, 142, "İptal", 24, "#AAA", 600, "middle")}
    </g>
  </g>
);

// ───────── bağlantı şeması: bir kanal → diğer kanallar (zincir)
export const LinkMap: React.FC<{ t: number; a: number; danger?: number; kinds: CoverKind[]; names: string[] }> = ({ t, a, danger = 0, kinds, names }) => {
  const cx = 960, cy = 470;
  return (
    <g>
      <g transform={`translate(${cx},${cy})`}><circle r={110} fill="#1A1E27" stroke="#FFF" strokeWidth={4} />{T(0, -10, "1 telefon", 30, "#FFF", 700, "middle")}{T(0, 30, "1 laptop", 30, "#AAA", 600, "middle")}</g>
      {kinds.map((kd, i) => {
        const ang = (-90 + i * (360 / kinds.length)) * Math.PI / 180;
        const x = cx + Math.cos(ang) * 400, y = cy + Math.sin(ang) * 330;
        const k = rp(t, a + 0.2 + i * 0.25, a + 0.6 + i * 0.25);
        const red = danger > 0 && (i === 1 || danger > 0.5);
        return <g key={i} opacity={k}><line x1={cx} y1={cy} x2={x} y2={y} stroke={red ? "#E5322D" : "#666"} strokeWidth={red ? 8 : 4} strokeDasharray={red ? "0" : "12 10"} /><g transform={`translate(${x - 110},${y - 62})`}><rect x={-8} y={-8} width={236} height={140} rx={14} fill={red ? "#E5322D" : "#333"} opacity={red ? 0.4 + 0.3 * Math.abs(Math.sin(t * 6)) : 1} /><Cover x={0} y={0} w={220} kind={kd} /></g>{T(x, y + 100, names[i], 26, "#FFF", 700, "middle")}</g>;
      })}
    </g>
  );
};

// ───────── Facebook'a benzer köy grubu gönderisi (360x740, kopya değil)
export const GroupPost: React.FC<{ t: number; k?: number; shares?: number }> = ({ t, k = 1, shares = 0 }) => (
  <g>
    <rect width={360} height={740} fill="#F0F2F5" />
    <rect width={360} height={70} fill="#FFF" />{T(20, 46, "Gruplar", 26, "#1877F2", 700)}
    <rect y={80} width={360} height={60} fill="#FFF" />{T(20, 118, "Köyümüz ve Köylülerimiz", 18, "#111", 700)}
    <g opacity={k} transform={`translate(0,${150 + (1 - k) * 20})`}>
      <rect width={360} height={470} fill="#FFF" />
      <circle cx={34} cy={34} r={22} fill="#8A7A6A" />{T(66, 30, "Dede", 17, "#111", 700)}{T(66, 52, "az önce", 14, "#777", 500)}
      {T(16, 96, "Bizim köy.", 22, "#111", 600)}
      <g transform="translate(16,116)"><Cover x={0} y={0} w={328} kind="koy" /></g>
      {T(16, 340, "▶  YouTube · Sular altındaki köy", 15, "#555", 500)}
      <rect y={370} width={360} height={1} fill="#DDD" />
      {T(16, 410, `👍 ${Math.round(lp(3, 2400, shares))}`, 18, "#555", 600)}
      {T(344, 410, `${Math.round(lp(0, 1180, shares))} paylaşım`, 18, "#555", 600, "end")}
    </g>
  </g>
);

// ───────── Telegram'a benzer grup ekranı (360x740, kopya değil)
export const ChatGroup: React.FC<{ t: number; members: number; msgs: string[]; k?: number }> = ({ t, members, msgs, k = 1 }) => (
  <g>
    <rect width={360} height={740} fill="#D7E4EE" />
    <rect width={360} height={86} fill="#2E6FA7" />
    <circle cx={46} cy={44} r={24} fill="#F2B13B" />{T(84, 40, "OTOMASYON VIP", 18, "#FFF", 700)}{T(84, 64, `${members.toLocaleString("tr-TR")} üye`, 14, "#D6E6F5", 500)}
    {msgs.map((m, i) => { const kk = cl(k * msgs.length - i); return <g key={i} opacity={kk} transform={`translate(14,${110 + i * 92 + (1 - kk) * 16})`}><rect width={300} height={76} rx={14} fill="#FFF" />{T(14, 28, ["Murat", "Ece", "Bora", "Selin", "Kaan", "Deniz"][i % 6], 14, ["#C2410C", "#7E22CE", "#0F766E", "#B91C1C", "#1D4ED8", "#A16207"][i % 6], 700)}{T(14, 56, m, 15, "#222", 500)}</g>; })}
  </g>
);

// ───────── yapay zekâ / gerçek etiket (dürüst gösterim)
export const AiLabel: React.FC<{ x: number; y: number; ai: boolean; k?: number }> = ({ x, y, ai, k = 1 }) => (
  <g transform={`translate(${x},${y})`} opacity={k}><rect x={-10} y={-34} width={ai ? 330 : 240} height={48} rx={24} fill={ai ? "#7E5BD6" : "#2BB673"} />{T(ai ? 155 : 110, 0, ai ? "Yapay zekâ ile canlandırıldı" : "Gerçek fotoğraf", 22, "#FFF", 700, "middle")}</g>
);
