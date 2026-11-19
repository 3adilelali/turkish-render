import React from "react";
import { Look, cl, lp, rp, fmt } from "./Hayat";
import { hash } from "./Motion";

// Kanal 4 kiti · İzmir esnafı + yapay zeka (2026-11-19, k6-10).
// Lahmacun salonu (taş fırın, odun ateşi, mermer tezgâh, hamur bezeleri), fırın ağzı yakın çekim + kürek,
// lahmacun (gerçek / yapay zeka "fazla mükemmel"), havada dönen hamur, kuaför salonu (ışıklı aynalar, fön, gelin),
// butik (askılar, manken, KARA CUMA vitrini, halka ışık), mahalle fırını (gevrek tepsileri, poğaça vitrini),
// berber (dönen direk), mali müşavir ofisi, ekranlar: Instagram profili, YZ sohbeti, görsel üretici, harita yorumu,
// ödeme hatası, WhatsApp toplu liste, randevu çakışması, işletme kartı (kalıcı olarak kapandı), yol tarifi grafiği,
// adımsayar, laptopta ürün açıklamaları. Hepsi vektör ve t'ye bağlı.

const UI = "Poppins";
const T = (x: number, y: number, s: string, size = 24, c = "#FFF", w = 600, a: "start" | "middle" | "end" = "start") => <text x={x} y={y} fontFamily={UI} fontWeight={w} fontSize={size} fill={c} textAnchor={a}>{s}</text>;

// ───────── karakterler
export const SEN24: Look = { hairStyle: "curly", hair: "#2A1C15", top: "#7A5C3E", top2: "#5F4630", kind: "hoodie", beard: 0.35 };
export const SEN24_EV: Look = { ...SEN24, top: "#3F4A5A", top2: "#2F3845", kind: "tshirt" };
export const DAYI: Look = { hairStyle: "short", hair: "#9A9A9A", top: "#F4F1EA", top2: "#DCD6C8", kind: "shirt", mustache: true, beard: 0.3, skin: "#D9A47E", skin2: "#B98060" };
export const NUR: Look = { hairStyle: "bun", hair: "#7A3B22", top: "#1F1F24", top2: "#141418", kind: "cardigan", skin: "#EBB994" };
export const GELIN: Look = { hairStyle: "bun", hair: "#3A2418", top: "#F7F4EE", top2: "#E4DED2", kind: "cardigan", skin: "#ECBE9C" };
export const SELIN: Look = { hairStyle: "curly", hair: "#B9874A", top: "#C9A27E", top2: "#AE8662", kind: "jacket", skin: "#EFC3A0" };
export const HUSEYIN: Look = { hairStyle: "bald", hair: "#D8D8D8", top: "#6B5E50", top2: "#564B40", kind: "cardigan", mustache: true, glasses: true, skin: "#D7A07A" };
export const MURAT: Look = { hairStyle: "fade", hair: "#1A1410", top: "#202020", top2: "#151515", kind: "tshirt", beard: 0.9 };
export const MUSAVIR: Look = { hairStyle: "short", hair: "#4A4A4A", top: "#3B4F6B", top2: "#2E3E55", kind: "shirt", glasses: true, beard: 0.15 };
export const KASAP: Look = { hairStyle: "buzz", top: "#F1F1F1", top2: "#D9D9D9", kind: "shirt", mustache: true, beard: 0.6, skin: "#D29A72" };
export const KARDES2: Look = { hairStyle: "short", hair: "#2A1C15", top: "#2E7FD8", top2: "#2364AE", kind: "hoodie" };
export const MUSTERI_K: Look = { hairStyle: "scarf", scarf: "#6B8E7A", top: "#8E5B4A", top2: "#71473A", kind: "jacket" };

// ───────── küçük nesneler
const Fl: React.FC<{ x: number; y: number; s?: number; t: number; i?: number }> = ({ x, y, s = 1, t, i = 0 }) => {
  const h = 1 + Math.sin(t * 9 + i * 1.7) * 0.18 + Math.sin(t * 13.3 + i) * 0.1;
  return <g transform={`translate(${x},${y}) scale(${s},${s * h})`}><path d="M-34,0 Q-40,-50 -6,-96 Q0,-60 14,-70 Q40,-40 34,0Z" fill="#FF8A1E" /><path d="M-18,0 Q-20,-34 -2,-62 Q6,-34 18,-40 Q24,-20 18,0Z" fill="#FFD25A" /></g>;
};
export const Odun: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>{[0, 1, 2, 3, 4, 5].map((i) => <g key={i} transform={`translate(${(i % 3) * 70 - 70},${-Math.floor(i / 3) * 44})`}><rect x={-34} y={-22} width={68} height={44} rx={20} fill="#7A4B2A" /><circle cx={30} cy={0} r={20} fill="#C9935C" /><circle cx={30} cy={0} r={10} fill="none" stroke="#9A6A3C" strokeWidth={3} /></g>)}</g>
);

// lahmacun: gerçek (düzensiz, kömür lekeli) / ai (kusursuz daire, parlak, yıldızlar)
export const Lahmacun: React.FC<{ x: number; y: number; s?: number; ai?: boolean; t?: number; plate?: boolean }> = ({ x, y, s = 1, ai, t = 0, plate = true }) => {
  const pts = Array.from({ length: 28 }, (_, i) => { const a = (i / 28) * Math.PI * 2; const r = ai ? 300 : 300 + (hash(i * 7.1) - 0.5) * 34; return `${Math.cos(a) * r},${Math.sin(a) * r * 0.62}`; });
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      {plate && <><ellipse cx={0} cy={26} rx={380} ry={238} fill="#000" opacity={0.18} /><ellipse cx={0} cy={10} rx={370} ry={230} fill="#F2F2EE" /><ellipse cx={0} cy={10} rx={330} ry={204} fill="none" stroke="#2F6DB5" strokeWidth={6} opacity={0.6} /></>}
      <polygon points={pts.join(" ")} fill={ai ? "#E7A94F" : "#D69A55"} />
      <ellipse cx={0} cy={0} rx={272} ry={166} fill={ai ? "#C0442A" : "#A9432C"} />
      {Array.from({ length: 70 }, (_, i) => { const a = hash(i * 3.3) * Math.PI * 2, r = Math.sqrt(hash(i * 5.7)) * 250; return <circle key={i} cx={Math.cos(a) * r} cy={Math.sin(a) * r * 0.6} r={ai ? 7 : 5 + hash(i) * 7} fill={i % 4 ? "#7E2416" : "#D8613E"} opacity={0.8} />; })}
      {!ai && Array.from({ length: 12 }, (_, i) => { const a = hash(i * 9.1) * Math.PI * 2; return <ellipse key={i} cx={Math.cos(a) * (280 + hash(i) * 14)} cy={Math.sin(a) * 175} rx={16 + hash(i * 2) * 14} ry={9} fill="#3A2416" opacity={0.75} />; })}
      {/* maydanoz + limon */}
      {Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${-120 + i * 26},${-40 + (i % 3) * 30} q10,-16 22,-2 q-6,14 -22,2`} fill="#3E8E3A" />)}
      <g transform="translate(250,90)"><path d="M0,0 L90,-30 A95,95 0 0,1 60,70Z" fill="#F7E34A" /><path d="M10,0 L80,-24 A80,80 0 0,1 54,58Z" fill="#FFF6A8" /></g>
      {ai && <><ellipse cx={-90} cy={-70} rx={160} ry={40} fill="#FFF" opacity={0.22} transform="rotate(-12)" />{[[-260, -160], [220, -170], [300, 40], [-310, 70]].map(([a, b], i) => <path key={i} transform={`translate(${a},${b}) scale(${0.8 + Math.sin(t * 4 + i) * 0.25})`} d="M0,-26 L6,-6 L26,0 L6,6 L0,26 L-6,6 L-26,0 L-6,-6Z" fill="#FFF7C2" />)}</>}
    </g>
  );
};

// havada dönen hamur (usta açıyor)
export const Hamur: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => {
  const up = Math.abs(Math.sin(t * 2.6)) * 120;
  const sq = 0.35 + Math.abs(Math.cos(t * 2.6)) * 0.25;
  return <g transform={`translate(${x},${y - up}) scale(${s}) rotate(${t * 220})`}><ellipse rx={190} ry={190 * sq} fill="#F5E6C8" /><ellipse rx={150} ry={150 * sq} fill="#FBF1DC" />{[0, 1, 2].map((i) => <circle key={i} cx={-60 + i * 60} cy={0} r={6} fill="#E3CFA4" />)}</g>;
};

// ───────── LAHMACUN SALONU
export const LahmacunSalon: React.FC<{ t: number; px?: number; people?: React.ReactNode; night?: boolean; empty?: boolean; fire?: number; queue?: number; dawn?: boolean }> = ({ t, px = 0, people, night, empty, fire = 1, queue = 0, dawn }) => (
  <g>
    <rect width={1920} height={1080} fill="#EFE6D2" />
    {/* çini */}
    {Array.from({ length: 24 }, (_, i) => Array.from({ length: 6 }, (_, j) => <g key={`${i}-${j}`} transform={`translate(${i * 84 + (px * 0.3) % 84},${380 + j * 84})`}><rect width={82} height={82} fill={(i + j) % 2 ? "#F7F2E6" : "#EFE7D4"} /><circle cx={41} cy={41} r={14} fill="none" stroke="#2F6DB5" strokeWidth={3} opacity={0.35} /></g>))}
    <rect y={360} width={1920} height={20} fill="#2F6DB5" />
    <rect width={1920} height={360} fill="#D9C7A4" />
    {/* tabela */}
    <g transform={`translate(${430 + px * 0.3},40)`}><rect width={760} height={110} rx={10} fill="#7A1F14" /><rect x={8} y={8} width={744} height={94} rx={6} fill="none" stroke="#E8B84A" strokeWidth={3} />{T(380, 76, "RAMAZAN USTA LAHMACUN", 50, "#FFE7A8", 800, "middle")}{T(380, 140, "1994'ten beri · Bornova", 26, "#7A4B2A", 600, "middle")}</g>
    {/* menü */}
    <g transform={`translate(${70 + px * 0.4},170)`}><rect width={330} height={190} rx={10} fill="#1F2A24" stroke="#6E4528" strokeWidth={10} />{[["Lahmacun", "120"], ["Kıymalı pide", "260"], ["Ayran", "40"]].map(([a, b], i) => <g key={i}>{T(24, 56 + i * 52, a, 28, "#F1F1F1", 600)}{T(306, 56 + i * 52, `${b} ₺`, 28, "#FFD27A", 700, "end")}</g>)}</g>
    {/* pencere + sokak */}
    <g transform={`translate(${-60 + px * 0.5},420)`}>
      <rect width={380} height={300} fill={night ? "#16213A" : dawn ? "#5C6E9A" : "#BFE3F5"} stroke="#6E4528" strokeWidth={14} />
      <rect y={210} width={380} height={90} fill={night ? "#222" : "#9AA3AB"} />
      {Array.from({ length: Math.min(6, queue) }, (_, i) => <g key={i} transform={`translate(${330 - i * 56},${220 + Math.sin(t * 2 + i) * 2})`}><circle cy={-60} r={18} fill={["#2A2A2A", "#5A3A2A", "#333"][i % 3]} /><path d="M-26,10 Q-26,-38 0,-42 Q26,-38 26,10Z" fill={["#3E5A7A", "#8E3B3B", "#4B6B3B"][i % 3]} /></g>)}
      <line x1={190} x2={190} y1={0} y2={300} stroke="#6E4528" strokeWidth={8} />
    </g>
    {/* taş fırın (sağ) */}
    <g transform={`translate(${1500 + px * 0.6},700)`}>
      <path d="M-380,120 L-380,-120 Q-380,-430 0,-430 Q380,-430 380,-120 L380,120Z" fill="#B8774A" />
      {Array.from({ length: 40 }, (_, i) => { const r = Math.floor(i / 8), c = i % 8; return <rect key={i} x={-360 + c * 92 + (r % 2) * 46} y={-400 + r * 70} width={86} height={62} rx={8} fill={hash(i) > 0.5 ? "#C4855A" : "#A9683F"} opacity={0.9} />; })}
      <path d="M-200,120 L-200,-60 Q-200,-210 0,-210 Q200,-210 200,-60 L200,120Z" fill="#1A0D06" />
      <ellipse cx={0} cy={40} rx={190 * fire} ry={110 * fire} fill="#FF8A1E" opacity={0.35 * fire} />
      {fire > 0 && <>{[-120, -60, 0, 60, 120].map((xx, i) => <Fl key={i} x={xx} y={110} s={0.9 * fire} t={t} i={i} />)}<Odun x={0} y={118} s={0.7} /></>}
      <rect x={-420} y={110} width={840} height={40} fill="#8A8A8A" />
      <ellipse cx={0} cy={-120} rx={260} ry={160} fill="#FF9A3A" opacity={0.12 * fire} />
      {/* kürek */}
      <g transform="translate(260,-40) rotate(-62)"><rect x={-8} y={-360} width={16} height={360} fill="#9A6A3C" /><rect x={-60} y={-440} width={120} height={90} rx={10} fill="#C9935C" /></g>
    </g>
    {/* asılı ampuller */}
    {[620, 980].map((x) => <g key={x} transform={`translate(${x + px * 0.4},150)`}><line y2={130} stroke="#111" strokeWidth={3} /><circle cy={144} r={16} fill="#FFE2A8" /><ellipse cy={170} rx={150} ry={95} fill="url(#hLamp)" opacity={0.6} /></g>)}
    {!empty && people}
    {/* mermer tezgâh + hamur bezeleri + lahmacun yığını */}
    <g transform={`translate(${px},0)`}>
      <rect x={-40} y={850} width={1300} height={34} fill="#E8E6E1" /><rect x={-40} y={884} width={1300} height={220} fill="#C7C2B8" />
      {Array.from({ length: 10 }, (_, i) => <path key={i} d={`M${i * 140 - 40},860 q40,10 80,-4`} stroke="#B0ABA2" strokeWidth={2} fill="none" />)}
      {[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={220 + i * 70} cy={846 - (i % 2) * 6} rx={30} ry={20} fill="#F5E6C8" stroke="#E3CFA4" strokeWidth={2} />)}
      <g transform="translate(860,846)">{[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={0} cy={-i * 7} rx={150} ry={34} fill={i % 2 ? "#D69A55" : "#C98A47"} />)}<ellipse cx={0} cy={-42} rx={120} ry={24} fill="#A9432C" /></g>
      <g transform="translate(1120,830)"><rect x={-40} y={-50} width={80} height={60} rx={6} fill="#F2F2EE" />{[0, 1, 2].map((i) => <path key={i} d={`M${-26 + i * 24},-50 q8,-30 0,-60`} stroke="#3E8E3A" strokeWidth={8} fill="none" />)}</g>
    </g>
    {(night || dawn) && <rect width={1920} height={1080} fill={dawn ? "#2A3560" : "#0A0F2A"} opacity={dawn ? 0.18 : 0.25} />}
  </g>
);

// fırın ağzı yakın çekim: alevler, kürekte lahmacun içeri kayar
export const FirinAgzi: React.FC<{ t: number; slide?: number; lah?: boolean; dawn?: boolean }> = ({ t, slide = 0, lah = true, dawn }) => (
  <g>
    <rect width={1920} height={1080} fill="#9C603A" />
    {Array.from({ length: 70 }, (_, i) => { const r = Math.floor(i / 10), c = i % 10; return <rect key={i} x={-60 + c * 210 + (r % 2) * 105} y={-40 + r * 160} width={200} height={150} rx={14} fill={hash(i * 2.2) > 0.5 ? "#B8774A" : "#A9683F"} />; })}
    <path d="M260,1080 L260,620 Q260,250 960,250 Q1660,250 1660,620 L1660,1080Z" fill="#140904" />
    <ellipse cx={960} cy={760} rx={680} ry={330} fill="#FF7A1A" opacity={0.28 + Math.sin(t * 7) * 0.04} />
    {Array.from({ length: 11 }, (_, i) => <Fl key={i} x={420 + i * 108} y={1020} s={2.2 + hash(i) * 0.8} t={t} i={i} />)}
    <Odun x={960} y={1060} s={1.8} />
    {Array.from({ length: 16 }, (_, i) => { const k = ((t * 0.6 + hash(i)) % 1); return <circle key={i} cx={500 + hash(i * 3) * 920 + Math.sin(t * 2 + i) * 30} cy={1000 - k * 700} r={4 + hash(i) * 4} fill="#FFC66B" opacity={1 - k} />; })}
    {lah && <g transform={`translate(${lp(960, 900, slide)},${lp(900, 700, slide)}) scale(${lp(1.1, 0.7, slide)})`}><rect x={-12} y={120} width={24} height={600} fill="#9A6A3C" /><ellipse cx={0} cy={60} rx={330} ry={110} fill="#C9935C" /><g transform="translate(0,30) scale(0.95,0.55)"><Lahmacun x={0} y={0} s={1} plate={false} /></g></g>}
    {dawn && <rect width={1920} height={1080} fill="#203060" opacity={0.08} />}
  </g>
);

// ───────── KUAFÖR
export const Kuafor: React.FC<{ t: number; px?: number; people?: React.ReactNode; chaos?: boolean; dryer?: boolean }> = ({ t, px = 0, people, chaos, dryer = true }) => (
  <g>
    <rect width={1920} height={1080} fill="#F3DCD9" />
    {Array.from({ length: 30 }, (_, i) => <rect key={i} x={i * 70 + (px * 0.3) % 70} y={0} width={2} height={860} fill="#C98F8A" opacity={0.15} />)}
    <g transform={`translate(${960 + px * 0.3},70)`}><rect x={-300} y={0} width={600} height={90} rx={45} fill="#1F1F24" />{T(0, 62, "KUAFÖR NUR", 52, "#F6C9C4", 800, "middle")}</g>
    {/* aynalar */}
    {[300, 960, 1620].map((x, i) => <g key={i} transform={`translate(${x + px * 0.45},200)`}><rect x={-200} y={0} width={400} height={500} rx={30} fill="#D9E6EC" stroke="#E8D9C8" strokeWidth={18} /><path d="M-150,40 L-40,40 L-180,460Z" fill="#FFF" opacity={0.35} />{Array.from({ length: 6 }, (_, j) => <circle key={j} cx={-210} cy={40 + j * 84} r={13} fill="#FFF6D6" />)}{Array.from({ length: 6 }, (_, j) => <circle key={`r${j}`} cx={210} cy={40 + j * 84} r={13} fill="#FFF6D6" />)}
      <rect x={-210} y={500} width={420} height={40} fill="#E8D9C8" />{[0, 1, 2, 3].map((j) => <rect key={j} x={-170 + j * 90} y={450} width={36} height={50} rx={8} fill={["#C26A9A", "#5AA5C9", "#E3B04B", "#7A9A5A"][(j + i) % 4]} />)}</g>)}
    {/* fön makinesi */}
    {dryer && <g transform={`translate(${1780 + px * 0.5},560) rotate(${Math.sin(t * 3) * 4})`}><path d="M0,-200 Q30,-100 0,0" stroke="#333" strokeWidth={6} fill="none" /><rect x={-60} y={0} width={120} height={60} rx={30} fill="#2B2B30" /><rect x={-20} y={50} width={40} height={90} rx={10} fill="#2B2B30" /></g>}
    {/* zemin */}
    <rect y={860} width={1920} height={220} fill="#E9E1D7" />{Array.from({ length: 12 }, (_, i) => <rect key={i} x={i * 180 + (px * 0.6) % 180} y={860} width={2} height={220} fill="#000" opacity={0.06} />)}
    {people}
    {/* ön tezgâh: randevu defteri + telefon */}
    <g transform={`translate(${px},0)`}><rect x={1300} y={880} width={700} height={220} fill="#1F1F24" /><rect x={1290} y={860} width={720} height={26} fill="#F6C9C4" />
      <g transform="translate(1460,850) rotate(-4)"><rect x={-100} y={-30} width={200} height={40} fill="#FBF6E6" /><line x1={-90} x2={90} y1={-16} y2={-16} stroke="#9CC3E0" /></g>
      <g transform="translate(1720,846)"><rect x={-40} y={-20} width={80} height={24} rx={6} fill="#111" /><rect x={-34} y={-18} width={68} height={18} rx={4} fill={Math.sin(t * 6) > 0 ? "#25D366" : "#1A9E4E"} opacity={0.8} /></g></g>
    {chaos && <rect width={1920} height={1080} fill="#FF2A2A" opacity={0.05 + Math.max(0, Math.sin(t * 5)) * 0.04} />}
  </g>
);

// ───────── BUTİK
export const Butik: React.FC<{ t: number; px?: number; people?: React.ReactNode; kara?: boolean; night?: boolean; ring?: boolean }> = ({ t, px = 0, people, kara, night, ring }) => {
  const cl8 = ["#B23A48", "#2F4A6B", "#E3B04B", "#4B6B3B", "#C9A27E", "#1F1F24", "#8E5B9A", "#E9E1D7"];
  return (
    <g>
      <rect width={1920} height={1080} fill={night ? "#2A2630" : "#F4F0EA"} />
      <g transform={`translate(${960 + px * 0.3},60)`}><text x={0} y={70} fontFamily="Georgia, serif" fontStyle="italic" fontWeight={700} fontSize={70} fill={night ? "#E8D9C8" : "#3A2E26"} textAnchor="middle">Selin Butik</text><text x={0} y={110} fontFamily={UI} fontWeight={600} fontSize={22} fill="#9A8A7A" textAnchor="middle" letterSpacing={8}>ALSANCAK</text></g>
      {/* vitrin (sol) */}
      <g transform={`translate(${-20 + px * 0.5},180)`}><rect width={520} height={640} fill={night ? "#0E1626" : "#CFE6F2"} stroke="#3A2E26" strokeWidth={14} />
        {kara && <g transform={`translate(260,160) rotate(-6)`}><rect x={-230} y={-70} width={460} height={140} fill="#111" /><text x={0} y={-6} fontFamily={UI} fontWeight={900} fontSize={60} fill="#FFF" textAnchor="middle">KARA CUMA</text><text x={0} y={52} fontFamily={UI} fontWeight={900} fontSize={46} fill="#E5322D" textAnchor="middle">%50</text></g>}
        {/* manken */}
        <g transform="translate(260,620)"><rect x={-6} y={-60} width={12} height={60} fill="#555" /><path d="M-70,-380 Q-90,-300 -60,-160 L-80,-60 L80,-60 L60,-160 Q90,-300 70,-380 Q0,-410 -70,-380Z" fill={kara ? "#B23A48" : "#C9A27E"} /><ellipse cx={0} cy={-430} rx={34} ry={42} fill="#E8E0D4" /></g></g>
      {/* askılar */}
      {[0, 1].map((r) => <g key={r} transform={`translate(${620 + r * 640 + px * 0.6},300)`}><rect x={0} y={0} width={560} height={12} rx={6} fill="#B9A58A" />{[0, 560].map((x) => <rect key={x} x={x - 6} y={0} width={12} height={540} fill="#B9A58A" />)}
        {Array.from({ length: 9 }, (_, i) => { const sw = Math.sin(t * 1.4 + i + r) * 2; return <g key={i} transform={`translate(${40 + i * 60},12) rotate(${sw})`}><path d="M0,0 L0,16 M-34,40 L0,16 L34,40" stroke="#666" strokeWidth={3} fill="none" /><path d="M-36,40 L36,40 L44,260 L-44,260Z" fill={cl8[(i + r * 3) % 8]} /><rect x={-36} y={40} width={72} height={20} fill="#000" opacity={0.1} /></g>; })}</g>)}
      <rect y={860} width={1920} height={220} fill={night ? "#3A3540" : "#D9CBB6"} />
      {ring && <g transform={`translate(${1560 + px * 0.7},560)`}><rect x={-4} y={0} width={8} height={320} fill="#222" /><circle cx={0} cy={-60} r={110} fill="none" stroke="#FFF7E0" strokeWidth={22} /><circle cx={0} cy={-60} r={110} fill="none" stroke="#FFF" strokeWidth={6} opacity={0.6} /><rect x={-30} y={-110} width={60} height={110} rx={10} fill="#111" /></g>}
      {people}
      {night && <rect width={1920} height={1080} fill="#0A0F2A" opacity={0.22} />}
    </g>
  );
};

// ───────── MAHALLE FIRINI (gevrek)
export const Gevrek: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><circle r={130} fill="none" stroke="#9A5A22" strokeWidth={80} /><circle r={130} fill="none" stroke="#C47A35" strokeWidth={56} />{Array.from({ length: 40 }, (_, i) => <ellipse key={i} cx={Math.cos(i * 0.9) * (110 + (i % 3) * 18)} cy={Math.sin(i * 0.9) * (110 + (i % 3) * 18)} rx={6} ry={3} fill="#F6E7C8" transform={`rotate(${i * 30} ${Math.cos(i * 0.9) * 120} ${Math.sin(i * 0.9) * 120})`} />)}</g>
);
export const Firin: React.FC<{ t: number; px?: number; people?: React.ReactNode; dawn?: boolean }> = ({ t, px = 0, people, dawn }) => (
  <g>
    <rect width={1920} height={1080} fill="#E8D2AE" />
    <g transform={`translate(${960 + px * 0.3},40)`}><rect x={-380} y={0} width={760} height={110} rx={12} fill="#5A3A22" />{T(0, 74, "HÜSEYİN FIRINI", 60, "#FFE2A8", 800, "middle")}{T(0, 146, "1978 · Karşıyaka · 3 şube", 26, "#7A4B2A", 600, "middle")}</g>
    {/* raflar: gevrek */}
    {[0, 1, 2].map((r) => <g key={r} transform={`translate(${px * 0.5},${230 + r * 170})`}><rect x={80} y={120} width={1760} height={18} fill="#6E4528" />{Array.from({ length: 13 }, (_, i) => <Gevrek key={i} x={160 + i * 134} y={70} s={0.36} />)}</g>)}
    {/* fırın ağzı arkada */}
    <g transform={`translate(${1700 + px * 0.6},740)`} opacity={0.0}><rect /></g>
    {people}
    {/* vitrin: poğaça */}
    <g transform={`translate(${px},0)`}><rect x={-40} y={800} width={2000} height={300} fill="#6E4528" /><rect x={-40} y={740} width={2000} height={70} fill="#DDEFF5" opacity={0.6} />
      {Array.from({ length: 22 }, (_, i) => <ellipse key={i} cx={40 + i * 90} cy={792} rx={36} ry={22} fill={i % 3 ? "#E0A35A" : "#D08E44"} />)}
      {Array.from({ length: 22 }, (_, i) => <circle key={`s${i}`} cx={40 + i * 90 + 8} cy={784} r={3} fill="#2A1C15" />)}</g>
    {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${300 + i * 330},${800 - ((t * 40 + i * 30) % 120)} q14,-20 0,-40`} stroke="#FFF" strokeWidth={6} fill="none" opacity={0.25} />)}
    {dawn && <rect width={1920} height={1080} fill="#203060" opacity={0.12} />}
  </g>
);

// ───────── BERBER
export const Berber: React.FC<{ t: number; px?: number; people?: React.ReactNode }> = ({ t, px = 0, people }) => (
  <g>
    <rect width={1920} height={1080} fill="#DCE3E6" />
    {Array.from({ length: 16 }, (_, i) => Array.from({ length: 6 }, (_, j) => <rect key={`${i}${j}`} x={i * 128 + (px * 0.3) % 128} y={j * 128 + 140} width={126} height={126} fill={(i + j) % 2 ? "#1F1F24" : "#F1F1F1"} opacity={0.12} />))}
    <g transform={`translate(${960 + px * 0.3},50)`}><rect x={-280} y={0} width={560} height={90} fill="#1F1F24" />{T(0, 64, "BERBER MURAT", 50, "#FFF", 800, "middle")}</g>
    {/* dönen direk */}
    <g transform={`translate(${160 + px * 0.5},250)`}><rect x={-34} y={0} width={68} height={420} rx={34} fill="#FFF" /><svg x={-34} y={0} width={68} height={420} viewBox="0 0 68 420">{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M-40,${i * 70 - ((t * 80) % 70) - 70} L120,${i * 70 - ((t * 80) % 70) - 10} L120,${i * 70 - ((t * 80) % 70) + 14} L-40,${i * 70 - ((t * 80) % 70) - 46}Z`} fill={i % 2 ? "#E5322D" : "#2F6DB5"} />)}</svg><rect x={-44} y={-20} width={88} height={30} rx={10} fill="#BBB" /><rect x={-44} y={410} width={88} height={30} rx={10} fill="#BBB" /></g>
    <g transform={`translate(${960 + px * 0.45},190)`}><rect x={-420} y={0} width={840} height={460} fill="#C8D7DF" stroke="#8A8A8A" strokeWidth={14} /><path d="M-300,30 L-140,30 L-380,430Z" fill="#FFF" opacity={0.3} /><rect x={-420} y={470} width={840} height={30} fill="#8A8A8A" />{[0, 1, 2, 3, 4].map((j) => <rect key={j} x={-360 + j * 70} y={410} width={30} height={60} rx={6} fill={["#3A7A9A", "#C9A227", "#7A3A3A", "#3A6B4B", "#555"][j]} />)}</g>
    <rect y={860} width={1920} height={220} fill="#4A4A50" />
    {people}
  </g>
);

// ───────── MALİ MÜŞAVİR
export const Musavir: React.FC<{ t: number; px?: number; people?: React.ReactNode }> = ({ t, px = 0, people }) => (
  <g>
    <rect width={1920} height={1080} fill="#E3E0D8" />
    <g transform={`translate(${1300 + px * 0.5},150)`}><rect width={480} height={380} fill="#9BC7E8" stroke="#F4F4F4" strokeWidth={16} /><rect y={260} width={480} height={120} fill="#B9B4A8" />{[0, 1, 2, 3].map((i) => <rect key={i} x={30 + i * 115} y={140 - (i % 2) * 40} width={90} height={160} fill="#D4C6AE" />)}<line x1={240} x2={240} y1={0} y2={380} stroke="#F4F4F4" strokeWidth={8} /></g>
    {/* klasör rafı */}
    <g transform={`translate(${120 + px * 0.4},170)`}><rect width={620} height={14} y={220} fill="#6E4528" /><rect width={620} height={14} y={450} fill="#6E4528" />{Array.from({ length: 22 }, (_, i) => <rect key={i} x={(i % 11) * 56} y={i < 11 ? 30 : 260} width={50} height={190} fill={["#2F6DB5", "#C0392B", "#2E7D5B", "#E3B04B"][i % 4]} />)}{Array.from({ length: 22 }, (_, i) => <rect key={`l${i}`} x={(i % 11) * 56 + 12} y={(i < 11 ? 30 : 260) + 120} width={26} height={40} fill="#FFF" opacity={0.8} />)}</g>
    {/* çerçeve */}
    <g transform={`translate(${900 + px * 0.4},170)`}><rect width={260} height={190} fill="#C9A227" /><rect x={14} y={14} width={232} height={162} fill="#FBF6E6" />{T(130, 90, "SMMM", 40, "#22324A", 800, "middle")}{T(130, 130, "RUHSATI", 22, "#22324A", 600, "middle")}</g>
    {people}
    <g transform={`translate(${px},0)`}><rect x={200} y={830} width={1500} height={30} fill="#6E4528" /><rect x={220} y={860} width={1460} height={240} fill="#5A3A22" />
      <g transform="translate(560,800)"><rect x={-90} y={-40} width={180} height={50} rx={6} fill="#2A2A2A" /><rect x={-70} y={-34} width={140} height={20} fill="#B9D9A0" /></g>
      <g transform="translate(1180,812) rotate(-3)"><rect x={-140} y={-30} width={280} height={40} fill="#FBF6E6" /><rect x={-120} y={-56} width={240} height={30} fill="#F4F0E2" /></g>
      <g transform="translate(1500,770)"><rect x={-30} y={0} width={60} height={60} fill="#B8774A" />{[0, 1, 2, 3].map((i) => <ellipse key={i} cx={-30 + i * 20} cy={-30 - (i % 2) * 20} rx={16} ry={36} fill="#3E8E3A" transform={`rotate(${-30 + i * 20} ${-30 + i * 20} -30)`} />)}</g></g>
  </g>
);

// ───────── EKRANLAR (telefon içi 360x740)
export const InstaProfil: React.FC<{ name: string; followers: number; posts?: number; last?: string; grid?: string[]; k?: number }> = ({ name, followers, posts = 9, last, grid = [], k = 1 }) => (
  <g>
    <rect width={360} height={740} fill="#FFF" />
    {T(20, 50, name, 22, "#111", 700)}
    <circle cx={64} cy={120} r={44} fill="none" stroke="#E1306C" strokeWidth={4} /><circle cx={64} cy={120} r={38} fill="#7A1F14" />{T(64, 130, "RU", 22, "#FFE7A8", 800, "middle")}
    {[["Gönderi", String(posts)], ["Takipçi", fmt(followers)], ["Takip", "48"]].map(([a, b], i) => <g key={i}>{T(170 + i * 76, 116, b, 22, "#111", 800, "middle")}{T(170 + i * 76, 140, a, 14, "#555", 600, "middle")}</g>)}
    <rect x={20} y={190} width={320} height={34} rx={8} fill="#EFEFEF" />{T(180, 213, "Takip et", 16, "#111", 700, "middle")}
    {Array.from({ length: 9 }, (_, i) => <g key={i} opacity={cl(k * 9 - i)}><rect x={2 + (i % 3) * 119} y={240 + Math.floor(i / 3) * 119} width={117} height={117} fill={grid[i] ?? ["#E8D2AE", "#D69A55", "#C9A27E"][i % 3]} /></g>)}
    {last && <g><rect x={20} y={620} width={320} height={60} rx={12} fill="#111" opacity={0.85} />{T(180, 657, last, 18, "#FFF", 700, "middle")}</g>}
  </g>
);

export const AiSohbet: React.FC<{ t: number; a: number; q: string; ans: string[]; speed?: number }> = ({ t, a, q, ans, speed = 34 }) => {
  const total = ans.join(" ").length;
  const n = Math.floor(cl((t - a - 1.2) * speed / total) * total);
  let left = n;
  return (
    <g>
      <rect width={1000} height={625} fill="#202124" />
      <rect width={210} height={625} fill="#17181A" />{["Yeni sohbet", "Menü yazısı", "Paylaşım", "Randevu"].map((s, i) => T(24, 70 + i * 50, s, 20, i === 0 ? "#FFF" : "#9AA0A6", 600))}
      <g transform="translate(250,40)"><rect x={360} y={0} width={360} height={Math.max(70, 34 + Math.ceil(q.length / 30) * 28)} rx={18} fill="#3C4043" />{q.match(/.{1,30}(\s|$)/g)?.map((l, i) => <g key={i}>{T(380, 40 + i * 28, l.trim(), 20, "#FFF", 500)}</g>)}</g>
      <g transform="translate(250,170)"><circle cx={20} cy={20} r={18} fill="#10A37F" />{T(20, 27, "YZ", 14, "#FFF", 800, "middle")}
        {ans.map((l, i) => { const show = l.slice(0, Math.max(0, left)); left -= l.length + 1; return <g key={i}>{T(56, 30 + i * 34, show, 21, "#E8EAED", 500)}</g>; })}
        {n < total && t > a + 0.6 && <rect x={56 + 9 * ((ans.find((_, i) => true) ?? "").length % 1)} y={30 + Math.min(ans.length - 1, Math.floor((n / total) * ans.length)) * 34 + 6} width={12} height={4} fill="#FFF" opacity={Math.sin(t * 10) > 0 ? 1 : 0} />}
      </g>
      <rect x={250} y={545} width={710} height={56} rx={28} fill="#303134" />{T(280, 581, "Bir mesaj yaz…", 18, "#9AA0A6", 500)}
    </g>
  );
};

export const ResimUret: React.FC<{ t: number; a: number; prompt: string; reveal?: number }> = ({ t, a, prompt, reveal = 2.6 }) => {
  const n = Math.floor(cl((t - a - 0.3) / 1.8) * prompt.length);
  const k = rp(t, a + reveal, a + reveal + 1.2);
  return (
    <g>
      <rect width={1000} height={625} fill="#111317" />
      <rect x={60} y={30} width={880} height={60} rx={30} fill="#23262D" />{T(96, 70, prompt.slice(0, n), 22, "#FFF", 500)}<rect x={810} y={40} width={110} height={40} rx={20} fill="#7C5CFF" />{T(865, 67, "Üret", 18, "#FFF", 700, "middle")}
      <rect x={250} y={120} width={500} height={480} rx={16} fill="#1C1F25" />
      {k < 1 && <g opacity={1 - k}>{Array.from({ length: 60 }, (_, i) => <rect key={i} x={250 + (i % 10) * 50} y={120 + Math.floor(i / 10) * 80} width={50} height={80} fill="#3A3F4A" opacity={0.3 + 0.4 * Math.abs(Math.sin(t * 5 + i))} />)}</g>}
      <g opacity={k}><svg x={250} y={120} width={500} height={480} viewBox="0 0 500 480"><rect width={500} height={480} fill="#3A2416" /><g transform="translate(250,250) scale(0.62)"><Lahmacun x={0} y={0} ai t={t} /></g></svg></g>
    </g>
  );
};

export const HaritaYorum: React.FC<{ k?: number; name?: string; text: string[]; stars?: number; after?: boolean; extra?: number }> = ({ k = 1, name = "Kerem T.", text, stars = 1, after, extra = 0 }) => (
  <g>
    <rect width={360} height={740} fill="#FFF" />
    <rect width={360} height={130} fill="#7A1F14" />{T(20, 60, "Ramazan Usta Lahmacun", 20, "#FFF", 700)}{T(20, 96, "★ 4,6 → 4,1 · Lahmacun salonu", 15, "#FFD27A", 600)}
    <g opacity={k} transform={`translate(0,${(1 - k) * 30})`}>
      <circle cx={44} cy={180} r={22} fill="#5A7A9A" />{T(44, 188, name[0], 20, "#FFF", 700, "middle")}{T(78, 176, name, 18, "#111", 700)}{T(78, 198, "2 saat önce", 13, "#777", 500)}
      {Array.from({ length: 5 }, (_, i) => <path key={i} transform={`translate(${30 + i * 28},236)`} d="M0,-11 L3.2,-3.5 L11,-3.5 L4.8,1.5 L7,9 L0,4.5 L-7,9 L-4.8,1.5 L-11,-3.5 L-3.2,-3.5Z" fill={i < stars ? "#F4B400" : "#DADCE0"} />)}
      {text.map((l, i) => <g key={i}>{T(24, 280 + i * 26, l, 17, "#222", 500)}</g>)}
    </g>
    {Array.from({ length: extra }, (_, i) => <g key={i} transform={`translate(0,${420 + i * 90})`}><rect x={16} y={0} width={328} height={78} rx={10} fill="#F6F6F6" />{Array.from({ length: 5 }, (_, j) => <path key={j} transform={`translate(${34 + j * 20},22)`} d="M0,-8 L2.3,-2.5 L8,-2.5 L3.5,1 L5,6.5 L0,3.3 L-5,6.5 L-3.5,1 L-8,-2.5 L-2.3,-2.5Z" fill={j < 1 ? "#F4B400" : "#DADCE0"} />)}{T(30, 58, ["Fotoğraf yalan.", "Bir daha gelmem.", "Kandırmaca!"][i % 3], 15, "#333", 500)}</g>)}
    {after && <g><rect x={16} y={420} width={328} height={130} rx={12} fill="#E7F6EC" stroke="#2BB673" strokeWidth={2} />{Array.from({ length: 5 }, (_, j) => <path key={j} transform={`translate(${34 + j * 22},446)`} d="M0,-9 L2.6,-2.8 L9,-2.8 L3.9,1.2 L5.6,7.3 L0,3.7 L-5.6,7.3 L-3.9,1.2 L-9,-2.8 L-2.6,-2.8Z" fill="#F4B400" />)}{T(30, 486, "Fotoğraf yanlıştı ama lahmacun", 15, "#222", 600)}{T(30, 508, "gerçekten güzelmiş.", 15, "#222", 600)}{T(30, 530, "Dürüst davrandılar.", 15, "#222", 600)}</g>}
  </g>
);

export const AiEtiket: React.FC<{ k?: number; t?: number }> = ({ k = 1, t = 0 }) => (
  <g>
    <rect width={360} height={740} fill="#000" />
    <svg x={0} y={140} width={360} height={360} viewBox="0 0 360 360"><rect width={360} height={360} fill="#3A2416" /><g transform="translate(180,180) scale(0.48)"><Lahmacun x={0} y={0} ai t={t} /></g></svg>
    {T(16, 120, "ramazanusta.lahmacun", 16, "#FFF", 700)}
    <g opacity={k}><rect x={16} y={512} width={200} height={34} rx={17} fill="#FFF" opacity={0.15} />{T(32, 535, "✦ Yapay zeka bilgisi", 15, "#FFF", 600)}</g>
    {T(16, 590, "♥ 34   💬 6", 18, "#FFF", 600)}
  </g>
);

export const OdemeHata: React.FC<{ k?: number; t?: number }> = ({ k = 1, t = 0 }) => (
  <g>
    <rect width={1000} height={625} fill="#16181D" />
    <g opacity={k} transform={`translate(500,300) scale(${lp(0.9, 1, k)})`}>
      <rect x={-380} y={-200} width={760} height={400} rx={24} fill="#2A0E10" stroke="#E5322D" strokeWidth={4} />
      <circle cx={0} cy={-100} r={50} fill="#E5322D" />{T(0, -80, "!", 64, "#FFF", 800, "middle")}
      {T(0, 10, "Ödemeniz alınamadı", 44, "#FFF", 800, "middle")}
      {T(0, 64, "Kartınız yurt dışı işlemlere kapalı.", 24, "#FFB3B3", 600, "middle")}
      {T(0, 104, "Hesabınız ücretsiz sürüme geçirildi.", 24, "#FFB3B3", 600, "middle")}
      <rect x={-160} y={130} width={320} height={50} rx={25} fill="#E5322D" opacity={0.6 + Math.sin(t * 6) * 0.3} />{T(0, 163, "Tekrar dene", 22, "#FFF", 700, "middle")}
    </g>
  </g>
);

export const WaListe: React.FC<{ t: number; a: number; n: number; sent?: number; msg?: string }> = ({ t, a, n, sent = 0, msg = "Kara Cuma linki 00:00'da burada!" }) => (
  <g>
    <rect width={360} height={740} fill="#ECE5DD" />
    <rect width={360} height={96} fill="#075E54" />{T(20, 48, "Selin Butik · Müşteriler", 19, "#FFF", 700)}{T(20, 76, `${fmt(n)} alıcı`, 15, "#CDE7E2", 500)}
    <g transform="translate(70,170)"><rect width={270} height={74} rx={12} fill="#DCF8C6" />{T(14, 32, msg.slice(0, 26), 15, "#111", 500)}{T(14, 56, msg.slice(26), 15, "#111", 500)}</g>
    {sent > 0 && <g transform="translate(0,300)"><rect x={20} y={0} width={320} height={16} rx={8} fill="#C9C2B8" /><rect x={20} y={0} width={320 * cl(sent)} height={16} rx={8} fill="#25D366" />{T(180, 50, `${fmt(Math.round(n * cl(sent)))} / ${fmt(n)} gönderildi`, 18, "#075E54", 700, "middle")}</g>}
    {Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(20,${400 + i * 46})`}><circle cx={18} cy={18} r={16} fill={["#C26A9A", "#5AA5C9", "#E3B04B", "#7A9A5A"][i % 4]} /><rect x={44} y={8} width={120 + hash(i) * 120} height={12} rx={6} fill="#B8B0A6" /></g>)}
  </g>
);

export const RandevuEkran: React.FC<{ k?: number; clash?: boolean; t?: number }> = ({ k = 1, clash, t = 0 }) => {
  const rows: [string, string, boolean][] = [["09:00", "Fön · Aylin H.", false], ["10:00", "Gelin başı · Merve K.", true], ["10:00", "Gelin başı · Dilara S.", true], ["11:30", "Boya · Sevgi T.", false], ["13:00", "Kesim · Ece B.", false]];
  return (
    <g>
      <rect width={360} height={740} fill="#FFF" />
      <rect width={360} height={96} fill="#1F1F24" />{T(20, 48, "Kuaför Nur · Randevular", 18, "#F6C9C4", 700)}{T(20, 76, "Cumartesi", 15, "#BBB", 500)}
      {rows.map(([h, s, c], i) => { const kk = cl(k * rows.length - i); const bad = clash && c; return <g key={i} opacity={kk} transform={`translate(0,${130 + i * 92})`}><rect x={16} y={0} width={328} height={78} rx={12} fill={bad ? (Math.sin(t * 6) > 0 ? "#FFD6D6" : "#FFC2C2") : "#F4F4F6"} stroke={bad ? "#E5322D" : "none"} strokeWidth={3} />{T(32, 46, h, 22, bad ? "#C0392B" : "#111", 800)}{T(112, 46, s, 16, "#333", 600)}</g>; })}
      {clash && <g opacity={rp(t, 0, 0.1) || 1}>{T(180, 640, "⚠ Aynı saat, iki gelin", 20, "#C0392B", 800, "middle")}</g>}
    </g>
  );
};

export const IsletmeKart: React.FC<{ closed?: boolean; fixed?: number; name?: string }> = ({ closed, fixed = 0, name = "Hüseyin Fırını · Şube 2" }) => (
  <g>
    <rect width={360} height={740} fill="#E8EEF2" />
    {/* harita */}
    {Array.from({ length: 10 }, (_, i) => <line key={i} x1={0} x2={360} y1={i * 40 + 10} y2={i * 40 - 30} stroke="#FFF" strokeWidth={10} />)}
    {Array.from({ length: 6 }, (_, i) => <line key={`v${i}`} x1={i * 70} x2={i * 70 + 40} y1={0} y2={400} stroke="#FFF" strokeWidth={8} />)}
    <path d="M180,150 c-30,0 -46,24 -46,44 c0,34 46,80 46,80 c0,0 46,-46 46,-80 c0,-20 -16,-44 -46,-44Z" fill="#E5322D" /><circle cx={180} cy={192} r={14} fill="#FFF" />
    <rect x={0} y={400} width={360} height={340} rx={20} fill="#FFF" />
    {T(20, 450, name, 20, "#111", 700)}{T(20, 478, "Fırın · Karşıyaka", 15, "#666", 500)}
    {closed && fixed < 1 && <g opacity={1 - fixed}>{T(20, 520, "Kalıcı olarak kapandı", 20, "#C0392B", 800)}</g>}
    {fixed > 0 && <g opacity={fixed}>{T(20, 520, "Açık · 06:00'da açılır", 20, "#188038", 800)}</g>}
    {[["Yol tarifi", "#1A73E8"], ["Ara", "#1A73E8"], ["Kaydet", "#1A73E8"]].map(([s, c], i) => <g key={i}><rect x={20 + i * 110} y={560} width={100} height={44} rx={22} fill={i === 0 ? c : "#E8F0FE"} />{T(70 + i * 110, 588, s, 15, i === 0 ? "#FFF" : c, 700, "middle")}</g>)}
  </g>
);

export const YolGrafik: React.FC<{ t: number; a: number }> = ({ t, a }) => {
  const v = [30, 34, 31, 60, 120, 168, 210];
  const k = rp(t, a + 0.3, a + 3);
  return (
    <g transform="translate(360,200)">
      <rect x={-40} y={-80} width={1280} height={760} rx={30} fill="#FFF" />
      {T(0, -20, "Yol tarifi isteyenler · haftalık", 44, "#111", 700)}
      {v.map((n, i) => { const h = n * 2.4 * cl(k * v.length - i); return <g key={i}><rect x={20 + i * 170} y={600 - h} width={120} height={h} rx={10} fill={i < 3 ? "#9AA0A6" : "#1A73E8"} />{h > 10 && T(80 + i * 170, 590 - h, String(n), 36, "#111", 800, "middle")}{T(80 + i * 170, 650, `${i + 1}. hf`, 26, "#666", 600, "middle")}</g>; })}
    </g>
  );
};

export const Adimsayar: React.FC<{ t: number; a: number; to?: number }> = ({ t, a, to = 17000 }) => {
  const v = Math.round(to * rp(t, a + 0.3, a + 2.6));
  return (
    <g>
      <rect width={360} height={740} fill="#101317" />
      <circle cx={180} cy={300} r={130} fill="none" stroke="#2A2F38" strokeWidth={24} />
      <circle cx={180} cy={300} r={130} fill="none" stroke="#2BB673" strokeWidth={24} strokeDasharray={`${816 * cl(v / 10000)} 900`} transform="rotate(-90 180 300)" strokeLinecap="round" />
      {T(180, 300, fmt(v), 54, "#FFF", 800, "middle")}{T(180, 340, "adım", 20, "#9AA0A6", 600, "middle")}
      {T(180, 520, "Hedef: 10.000", 20, "#9AA0A6", 600, "middle")}{v > 10000 && T(180, 560, "Hedef aşıldı!", 22, "#2BB673", 800, "middle")}
    </g>
  );
};

// laptopta ürün açıklamaları (1000x625): satırlar akar, sayaç
export const UrunListe: React.FC<{ t: number; a: number; to?: number; fixes?: boolean }> = ({ t, a, to = 40, fixes }) => {
  const n = Math.round(to * rp(t, a + 0.4, a + 3.4));
  const items = ["Yün karışımlı kaban · S-M-L", "Triko kazak · bej", "Kadife pantolon · 36-42", "Örme hırka · ekru", "Yazlık elbise · çiçekli", "Deri bot · siyah", "Kaşe mont · lacivert"];
  return (
    <g>
      <rect width={1000} height={625} fill="#F7F7F8" />
      <rect width={1000} height={70} fill="#1F1F24" />{T(30, 46, "Selin Butik · Ürün açıklamaları", 24, "#FFF", 700)}{T(970, 46, `${n} / ${to}`, 28, "#5CF08E", 800, "end")}
      {items.map((s, i) => { const kk = cl(n / to * items.length - i); const bad = fixes && i === 4; return <g key={i} opacity={kk} transform={`translate(30,${100 + i * 72})`}><rect width={940} height={60} rx={10} fill={bad ? "#FFE3E3" : "#FFF"} stroke="#E3E3E8" />{T(20, 39, s, 22, "#222", 600)}{T(920, 39, bad ? "Kasım'da yazlık? ✗" : "✓", 20, bad ? "#C0392B" : "#2BB673", 700, "end")}{bad && <line x1={20} x2={20 + s.length * 11} y1={32} y2={32} stroke="#C0392B" strokeWidth={3} />}</g>; })}
    </g>
  );
};

// vergi levhası
export const VergiLevhasi: React.FC<{ k?: number }> = ({ k = 1 }) => (
  <g opacity={k} transform={`translate(960,540) scale(${lp(0.92, 1, k)}) rotate(-2)`}>
    <rect x={-470} y={-320} width={940} height={640} fill="#FBF6E6" stroke="#B9A58A" strokeWidth={10} />
    <circle cx={0} cy={-220} r={50} fill="none" stroke="#C0392B" strokeWidth={6} />{T(0, -208, "GİB", 30, "#C0392B", 800, "middle")}
    {T(0, -120, "VERGİ LEVHASI", 56, "#22324A", 800, "middle")}
    {[["Mükellef", "SEN"], ["Faaliyet", "Dijital hizmet"], ["Vergi türü", "Gelir vergisi"], ["Not", "Genç girişimci istisnası"]].map(([a, b], i) => <g key={i}>{T(-380, -30 + i * 70, a, 32, "#666", 600)}{T(380, -30 + i * 70, b, 34, "#22324A", 700, "end")}<line x1={-380} x2={380} y1={-10 + i * 70} y2={-10 + i * 70} stroke="#DDD3BE" /></g>)}
  </g>
);

// mahalle haritası: 14 dükkân, hayır = kırmızı çarpı, evet = yeşil
export const DukkanHarita: React.FC<{ t: number; a: number; yes?: number }> = ({ t, a, yes = 13 }) => {
  const pts = Array.from({ length: 14 }, (_, i) => [260 + (i % 5) * 330 + hash(i) * 80, 200 + Math.floor(i / 5) * 280 + hash(i * 3) * 80]);
  return (
    <g>
      <rect width={1920} height={1080} fill="#E8EEF2" />
      {Array.from({ length: 12 }, (_, i) => <line key={i} x1={0} x2={1920} y1={i * 100} y2={i * 100 + 160} stroke="#FFF" strokeWidth={22} />)}
      {Array.from({ length: 10 }, (_, i) => <line key={`v${i}`} x1={i * 220} x2={i * 220 - 120} y1={0} y2={1080} stroke="#FFF" strokeWidth={16} />)}
      <rect x={0} y={960} width={1920} height={120} fill="#9FC7E0" />{T(960, 1030, "İzmir Körfezi", 34, "#5A86A6", 700, "middle")}
      {pts.map(([x, y], i) => { const k = rp(t, a + i * 0.32, a + i * 0.32 + 0.2); const ok = i === yes; return <g key={i} transform={`translate(${x},${y}) scale(${k})`}><circle r={44} fill={ok ? "#2BB673" : "#E5322D"} />{ok ? <path d="M-18,0 L-4,14 L20,-14" stroke="#FFF" strokeWidth={9} fill="none" /> : <path d="M-14,-14 L14,14 M14,-14 L-14,14" stroke="#FFF" strokeWidth={9} />}</g>; })}
    </g>
  );
};
