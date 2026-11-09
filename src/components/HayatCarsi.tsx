import React from "react";
import { H, Look, Person, TeaGlass, rp, cl, short } from "./Hayat";

// Kanal 4 kiti · çarşı esnafı / tantunici / sac / kuyruk / Shorts akışı / defter / reklam havuzu (2026-11-09, k6-04).
// Bütün sahneler 1920x1080. Person yarım gövde: tezgâhın arkasında durur.

export const USTA: Look = { hairStyle: "short", hair: "#BDBDBD", top: "#F3F0E8", top2: "#DCD6C8", kind: "shirt", mustache: true, skin: "#D9A47E", beard: 0.25 };
export const KUNEFECI: Look = { hairStyle: "bald", hair: "#555", top: "#8E2B2B", top2: "#6E2020", kind: "tshirt", mustache: true, skin: "#D29A72" };
export const MUSTERI: Look = { hairStyle: "fade", top: "#2F5D8A", top2: "#244A6E", kind: "jacket", beard: 0.5 };

const P = "Poppins";

// sac: tezgâhta kubbeli tava, etler zıplar, buhar
export const Sac: React.FC<{ x: number; y: number; s?: number; t: number; heat?: number; meat?: number }> = ({ x, y, s = 1, t, heat = 1, meat = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={18} rx={250} ry={40} fill="#000" opacity={0.35} />
    <ellipse cx={0} cy={0} rx={240} ry={56} fill="#2A2A2E" />
    <ellipse cx={0} cy={-6} rx={225} ry={46} fill="#3A3B40" />
    <ellipse cx={-60} cy={-14} rx={90} ry={14} fill="#FFF" opacity={0.08} />
    {Array.from({ length: Math.round(26 * meat) }, (_, i) => {
      const a = (i * 137.5) % 360, r = 30 + ((i * 53) % 150);
      const jump = Math.max(0, Math.sin(t * 9 + i * 1.7)) * 10 * heat;
      return <ellipse key={i} cx={Math.cos((a * Math.PI) / 180) * r} cy={-8 + Math.sin((a * Math.PI) / 180) * r * 0.18 - jump} rx={11} ry={6} fill={i % 3 ? "#7A3B22" : "#A0522D"} />;
    })}
    {Array.from({ length: 5 }, (_, i) => { const k = ((t * 0.35 + i * 0.2) % 1); return <path key={i} d={`M${-120 + i * 60},${-30 - k * 160} q 18,-30 0,-60 q -18,-30 0,-60`} stroke="#FFF" strokeWidth={10} fill="none" opacity={(1 - k) * 0.18 * heat} strokeLinecap="round" />; })}
  </g>
);

// bıçak: sacın üstünde hızlı doğrama
export const Knife: React.FC<{ x: number; y: number; s?: number; t: number; speed?: number; rot?: number }> = ({ x, y, s = 1, t, speed = 1, rot = -18 }) => {
  const up = Math.abs(Math.sin(t * 14 * speed)) * 50;
  return (
    <g transform={`translate(${x},${y - up}) rotate(${rot}) scale(${s})`}>
      <path d="M0,0 L190,-8 Q215,0 190,10 L0,14Z" fill="#D9DDE2" /><path d="M0,0 L190,-8 L190,-2 L0,4Z" fill="#FFF" opacity={0.6} />
      <rect x={-110} y={-6} width={110} height={24} rx={8} fill="#3B2416" /><circle cx={-80} cy={6} r={4} fill="#C9A15A" /><circle cx={-40} cy={6} r={4} fill="#C9A15A" />
    </g>
  );
};

// limon, lavaş, domates tezgâh süsü
export const Tezgah: React.FC<{ y?: number; t: number }> = ({ y = 860, t }) => (
  <g>
    <rect x={0} y={y} width={1920} height={30} fill="#B9BEC4" /><rect x={0} y={y + 30} width={1920} height={1080 - y} fill="#8E949B" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 170} y={y + 30} width={4} height={1080 - y} fill="#000" opacity={0.08} />)}
    <g transform={`translate(1500,${y - 6})`}>{[0, 1, 2, 3, 4].map((i) => <ellipse key={i} cx={0} cy={-i * 9} rx={120} ry={22} fill={i % 2 ? "#F1DDB2" : "#E9D1A0"} />)}</g>
    <g transform={`translate(330,${y - 20})`}>{[0, 1, 2].map((i) => <ellipse key={i} cx={i * 50} cy={0} rx={28} ry={22} fill="#F4D03F" stroke="#C9A227" strokeWidth={3} />)}<ellipse cx={170} cy={4} rx={30} ry={24} fill="#D64541" /></g>
    <TeaGlass x={1760} y={y} s={0.8} t={t} />
  </g>
);

// tantunici içi: beyaz çini, mavi şerit, tabela, menü, pencereden kuyruk
export const Tantunici: React.FC<{ t: number; px?: number; name?: string; tile?: string; queue?: number; night?: boolean; menu?: string[] }> = ({ t, px = 0, name = "HASAN USTA TANTUNİ", tile = "#F4F6F7", queue = 0, night, menu = ["Tantuni dürüm", "Yarım ekmek", "Ayran"] }) => (
  <g>
    <rect width={1920} height={1080} fill={tile} />
    {Array.from({ length: 26 }, (_, i) => <line key={i} x1={i * 80 + (px * 0.3) % 80} x2={i * 80 + (px * 0.3) % 80} y1={160} y2={860} stroke="#000" opacity={0.06} />)}
    {Array.from({ length: 9 }, (_, i) => <line key={i} x1={0} x2={1920} y1={160 + i * 80} y2={160 + i * 80} stroke="#000" opacity={0.06} />)}
    <rect y={600} width={1920} height={26} fill="#1F5F99" />
    <rect width={1920} height={160} fill="#1C2A3A" />
    <text x={960 + px * 0.3} y={108} fontFamily={P} fontWeight={800} fontSize={74} fill="#FFD27A" textAnchor="middle" letterSpacing={6}>{name}</text>
    {/* pencere + sokak */}
    <g transform={`translate(${1260 + px * 0.5},230)`}>
      <rect width={520} height={340} fill={night ? "#18233A" : "#BFE3F5"} stroke="#5A6470" strokeWidth={14} />
      <rect y={240} width={520} height={100} fill={night ? "#222" : "#9AA3AB"} />
      {Array.from({ length: Math.min(9, queue) }, (_, i) => <g key={i} transform={`translate(${470 - i * 56},${250 + Math.sin(t * 2 + i) * 2})`} opacity={0.9}><circle cy={-70} r={20} fill={["#2A2A2A", "#5A3A2A", "#333"][i % 3]} /><path d="M-30,10 Q-30,-45 0,-48 Q30,-45 30,10Z" fill={["#3E5A7A", "#8E3B3B", "#4B6B3B", "#6B4B8B"][i % 4]} /></g>)}
      <line x1={260} x2={260} y1={0} y2={340} stroke="#5A6470" strokeWidth={10} />
    </g>
    {/* menü tahtası */}
    <g transform={`translate(${140 + px * 0.5},220)`}>
      <rect width={420} height={300} rx={14} fill="#22302A" stroke="#6E4528" strokeWidth={12} />
      {menu.map((m, i) => <text key={i} x={30} y={80 + i * 80} fontFamily={P} fontWeight={600} fontSize={36} fill="#F1F1F1">{m}</text>)}
    </g>
    {/* asılı ampul */}
    {[760, 1160].map((x) => <g key={x} transform={`translate(${x + px * 0.4},160)`}><line y2={110} stroke="#111" strokeWidth={3} /><circle cy={124} r={16} fill="#FFE2A8" /><ellipse cy={150} rx={140} ry={90} fill="url(#hLamp)" opacity={0.5} /></g>)}
  </g>
);

// usta sacın başında (tezgâh arkası) + bıçak
export const UstaAtSac: React.FC<{ t: number; a: number; z?: number; talk?: boolean; chop?: boolean; mouth?: any; look?: number; brow?: any; x?: number; o?: Look }> = ({ t, talk, chop = true, mouth = "smile", look = 0, brow, x = 900, o = USTA }) => (
  <g>
    <Person x={x} y={900} s={1} t={t} o={o} arms={chop ? "type" : "cross"} mouth={mouth} talk={talk} look={look} brow={brow} lit={1} />
    <Tezgah t={t} />
    <Sac x={x} y={870} s={1.05} t={t} />
    {chop && <Knife x={x - 40} y={820} t={t} s={1.1} />}
  </g>
);

// dükkân önü sokak: tabela, tente, kuyruk
export const ShopFront: React.FC<{ t: number; name?: string; queue?: number; night?: boolean; px?: number; awning?: string }> = ({ t, name = "HASAN USTA TANTUNİ", queue = 6, night, px = 0, awning = "#C0392B" }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#0E1626" : "#9FD3EE"} />
    <rect x={-100 + px * 0.2} y={120} width={2120} height={720} fill={night ? "#2A2A33" : "#D9C7A8"} />
    {[0, 1, 2].map((i) => <rect key={i} x={120 + i * 640 + px * 0.2} y={180} width={180} height={140} fill={night ? "#FFD27A" : "#7FA8C0"} opacity={night ? 0.5 : 0.8} />)}
    <g transform={`translate(${560 + px * 0.4},340)`}>
      <rect width={800} height={100} fill="#1C2A3A" /><text x={400} y={70} fontFamily={P} fontWeight={800} fontSize={54} fill="#FFD27A" textAnchor="middle">{name}</text>
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 80},100 L${i * 80 + 80},100 L${i * 80 + 80},150 Q${i * 80 + 40},175 ${i * 80},150Z`} fill={i % 2 ? awning : "#F4F4F4"} />)}
      <rect x={60} y={170} width={680} height={330} fill={night ? "#FFE9B8" : "#FFF3D6"} opacity={0.85} />
      <rect x={300} y={170} width={200} height={330} fill="#5A3A22" opacity={0.6} />
    </g>
    <rect y={840} width={1920} height={240} fill={night ? "#1E1E22" : "#8D8D8D"} />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 180 + (px * 0.6) % 180} y={940} width={90} height={10} fill="#FFF" opacity={0.25} />)}
    {Array.from({ length: Math.min(14, queue) }, (_, i) => <g key={i} transform={`translate(${520 - i * 95 + px * 0.7 + (i > 5 ? 0 : 0)},${880 + Math.sin(t * 2 + i) * 3}) scale(0.62)`}><Person x={0} y={0} s={1} t={t + i} o={{ hairStyle: (["short", "fade", "scarf", "curly", "bald"] as const)[i % 5], scarf: "#7A4B6B", top: ["#3E5A7A", "#8E3B3B", "#4B6B3B", "#6B4B8B", "#B07A3A"][i % 5], top2: "#2A2A2A", kind: "jacket" }} arms={i % 3 === 0 ? "phone" : "down"} dir={1} seed={i} /></g>)}
  </g>
);

// Shorts akışı (telefon içi 360x740): dikey video, sağda ikonlar, kaydırma
export type ShortItem = { bg: string; label: string; views?: string; kind?: "sac" | "cat" | "street" | "plain" | "sign" | "queue" | "knife" };
const ShortArt: React.FC<{ it: ShortItem; t: number }> = ({ it, t }) => (
  <g>
    <rect width={360} height={740} fill={it.bg} />
    {it.kind === "sac" && <g transform="translate(180,470) scale(0.55)"><Sac x={0} y={0} t={t} /><Knife x={-40} y={-50} t={t} s={1} /></g>}
    {it.kind === "knife" && <g transform="translate(180,430) scale(0.9)"><Sac x={0} y={60} t={t} s={0.6} /><Knife x={-60} y={10} t={t} s={1.2} speed={1.4} /></g>}
    {it.kind === "sign" && <g><rect x={20} y={300} width={320} height={90} fill="#1C2A3A" /><text x={180} y={358} fontFamily={P} fontWeight={800} fontSize={30} fill="#FFD27A" textAnchor="middle">TANTUNİ</text></g>}
    {it.kind === "cat" && <g transform="translate(180,430)"><ellipse rx={110} ry={80} fill="#E8A54B" /><circle cy={-100} r={70} fill="#E8A54B" /><path d="M-60,-150 L-40,-200 L-20,-150Z M20,-150 L40,-200 L60,-150Z" fill="#E8A54B" /><circle cx={-25} cy={-105} r={8} fill="#111" /><circle cx={25} cy={-105} r={8} fill="#111" /></g>}
    {it.kind === "street" && <g transform="translate(180,700) scale(0.8)"><Person x={-70} y={0} t={t} o={{ hairStyle: "curly", top: "#444", kind: "jacket" }} arms="hold" talk /><Person x={90} y={0} t={t + 1} o={{ hairStyle: "scarf", scarf: "#7A4B6B", top: "#A57", kind: "cardigan" }} mouth="o" /></g>}
    {it.kind === "queue" && <g>{Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${320 - i * 55},560)`}><circle cy={-80} r={20} fill="#2A2A2A" /><path d="M-26,0 Q-26,-55 0,-58 Q26,-55 26,0Z" fill={["#3E5A7A", "#8E3B3B", "#4B6B3B"][i % 3]} /></g>)}</g>}
    <rect y={560} width={360} height={180} fill="url(#hShade)" opacity={0.0} />
    <rect y={600} width={360} height={140} fill="#000" opacity={0.35} />
    <text x={18} y={640} fontFamily={P} fontWeight={700} fontSize={18} fill="#FFF">@mersin.usta</text>
    <text x={18} y={672} fontFamily={P} fontWeight={600} fontSize={20} fill="#FFF">{it.label}</text>
    {[["♥", it.views ?? ""], ["💬", ""], ["↗", ""]].map(([ic, v], i) => <g key={i} transform={`translate(325,${380 + i * 80})`}><circle r={24} fill="#000" opacity={0.35} /><text y={9} fontFamily={P} fontSize={26} fill="#FFF" textAnchor="middle">{ic}</text>{v && <text y={46} fontFamily={P} fontWeight={700} fontSize={15} fill="#FFF" textAnchor="middle">{v}</text>}</g>)}
    <rect x={0} y={734} width={360 * ((t * 0.25) % 1)} height={6} fill="#FFF" />
  </g>
);
export const ShortsFeed: React.FC<{ t: number; items: ShortItem[]; scroll?: number }> = ({ t, items, scroll = 0 }) => (
  <g>
    {items.map((it, i) => <g key={i} transform={`translate(0,${(i - scroll) * 740})`}><ShortArt it={it} t={t} /></g>)}
    <text x={180} y={42} fontFamily={P} fontWeight={700} fontSize={20} fill="#FFF" textAnchor="middle">Shorts</text>
  </g>
);

// parmak (kaydırma hareketi)
export const Finger: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><path d="M-30,0 L-30,-120 Q0,-150 30,-120 L30,0 Q40,80 0,120 Q-40,80 -30,0Z" fill={H.skin} /><ellipse cx={0} cy={-118} rx={22} ry={16} fill="#F2CDB2" /></g>
);

// defter: el yazısı satırları (çizgili kâğıt)
export const Defter: React.FC<{ x?: number; y?: number; s?: number; rows: [string, string][]; k?: number; hi?: number; title?: string }> = ({ x = 960, y = 540, s = 1, rows, k = 1, hi = -1, title = "Günlük satış" }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(-2)`}>
    <rect x={-470} y={-330} width={940} height={660} rx={16} fill="#2B2A26" />
    <rect x={-450} y={-310} width={900} height={620} fill="#FBF6E6" />
    {Array.from({ length: 12 }, (_, i) => <line key={i} x1={-450} x2={450} y1={-230 + i * 50} y2={-230 + i * 50} stroke="#9CC3E0" strokeWidth={2} />)}
    <line x1={-360} x2={-360} y1={-310} y2={310} stroke="#E88" strokeWidth={3} />
    <text x={-330} y={-250} fontFamily="Caveat, Poppins" fontWeight={700} fontSize={52} fill="#22324A">{title}</text>
    {rows.map(([a, b], i) => { const kk = cl(k * rows.length - i); return <g key={i} opacity={kk}>
      {hi === i && <rect x={-350} y={-200 + i * 100 - 52} width={790} height={70} fill="#FFE66D" opacity={0.6} />}
      <text x={-330} y={-200 + i * 100} fontFamily="Caveat, Poppins" fontWeight={600} fontSize={50} fill="#22324A">{a}</text>
      <text x={420} y={-200 + i * 100} fontFamily="Caveat, Poppins" fontWeight={700} fontSize={58} fill={hi === i ? "#C0392B" : "#22324A"} textAnchor="end">{b}</text>
    </g>; })}
  </g>
);

// reklam havuzu: reklam paraları havuza düşer, borular paylara ayrılır
export const AdPool: React.FC<{ t: number; a: number; music?: number; creators?: number }> = ({ t, a, music = 0, creators = 1 }) => {
  const k = rp(t, a, a + 0.8);
  return (
    <g>
      {Array.from({ length: 8 }, (_, i) => { const f = ((t - a) * 0.8 + i * 0.13) % 1; return <g key={i} transform={`translate(${620 + i * 90},${140 + f * 320})`} opacity={k * (1 - f * 0.6)}><circle r={26} fill="#FFC531" stroke="#C9971A" strokeWidth={4} /><text y={10} fontFamily={P} fontWeight={800} fontSize={26} fill="#7A5A0A" textAnchor="middle">$</text></g>; })}
      <text x={960} y={110} fontFamily={P} fontWeight={700} fontSize={40} fill="#FFF" textAnchor="middle" opacity={k}>Shorts'ların arasındaki reklamlar</text>
      <path d="M560,470 L1360,470 L1280,640 L640,640Z" fill="#1F5F99" opacity={k} /><rect x={560} y={460} width={800} height={24} rx={8} fill="#3EA6FF" opacity={k} />
      <text x={960} y={575} fontFamily={P} fontWeight={800} fontSize={48} fill="#FFF" textAnchor="middle" opacity={k}>HAVUZ</text>
      {creators > 0 && Array.from({ length: 5 }, (_, i) => { const kk = rp(t, a + 1 + i * 0.15, a + 1.4 + i * 0.15) * creators; const x = 360 + i * 300; return <g key={i} opacity={kk}><path d={`M960,640 Q960,720 ${x},780`} stroke="#3EA6FF" strokeWidth={10} fill="none" /><circle cx={x} cy={850} r={60} fill={i === 2 ? H.red : "#2E3A4A"} stroke="#FFF" strokeWidth={4} /><text x={x} y={866} fontFamily={P} fontWeight={700} fontSize={i === 2 ? 34 : 28} fill="#FFF" textAnchor="middle">{i === 2 ? "SEN" : "kanal"}</text></g>; })}
      {music > 0 && <g opacity={music}><path d="M960,640 Q1300,700 1620,700" stroke="#C77DFF" strokeWidth={14} fill="none" /><circle cx={1680} cy={700} r={70} fill="#7B2CBF" /><text x={1680} y={722} fontFamily={P} fontSize={60} fill="#FFF" textAnchor="middle">♪</text></g>}
    </g>
  );
};

// dünya haritası benzeri yorum kaynakları (basit noktalar)
export const Pins: React.FC<{ t: number; a: number; pins: [number, number, string][] }> = ({ t, a, pins }) => (
  <g>{pins.map(([x, y, s], i) => { const k = rp(t, a + i * 0.4, a + i * 0.4 + 0.4); return <g key={i} transform={`translate(${x},${y - (1 - k) * 40})`} opacity={k}><path d="M0,0 Q-34,-50 -34,-74 A34,34 0 1 1 34,-74 Q34,-50 0,0Z" fill={H.red} /><circle cy={-74} r={12} fill="#FFF" /><text y={50} fontFamily={P} fontWeight={700} fontSize={34} fill="#FFF" textAnchor="middle">{s}</text></g>; })}</g>
);

// izlenme sayacı büyük ama cüzdan sabit (iki sütun)
export const TwoBars: React.FC<{ t: number; a: number; left: [string, number, string]; right: [string, number, string] }> = ({ t, a, left, right }) => (
  <g>{[left, right].map(([lab, v, val], i) => { const k = rp(t, a + i * 0.5, a + 1.2 + i * 0.5); const h = 560 * v * k; const x = 660 + i * 600; return <g key={i}><rect x={x - 120} y={880 - h} width={240} height={h} rx={14} fill={i ? H.green : H.blue} /><text x={x} y={860 - h} fontFamily={P} fontWeight={800} fontSize={56} fill="#FFF" textAnchor="middle" opacity={k}>{val}</text><text x={x} y={950} fontFamily={P} fontWeight={600} fontSize={38} fill="#CCC" textAnchor="middle">{lab}</text></g>; })}<line x1={420} x2={1500} y1={880} y2={880} stroke="#FFF" strokeWidth={4} opacity={0.4} /></g>
);

export const shortN = short;
