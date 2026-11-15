import React from "react";
import { H, Look, cl, lp, rp } from "./Hayat";
import { hash } from "./Motion";

// Kanal 4 kiti · fabrika dünyası (2026-11-15, k6-08).
// Fabrika dışı (şafak, testere çatı, baca, OSB tabelası), turnike + kart okuyucu (bip: yeşil/kırmızı),
// servis minibüsü (dışı ve içi, buğulu cam), üretim hangarı (makas kirişler, sarkan lambalar, akan bant, forklift),
// kablo demeti masası, test masası (HATALI etiketi), yemekhane + tepsi, eksik parmak ucu, pres makinesi
// (koç iner, ışık perdesi kesilir, alarm, iki el butonu), duyuru panosu, bordro, kişisel kart, iş ayakkabısı,
// kapı sacı, eski apartman odası + elektrikli ısıtıcı, köy sobası (kar), kömür çuvalları. Hepsi t'ye bağlı.

const UI = "Poppins";
const T = (x: number, y: number, s: string, size = 24, c = "#FFF", w = 600, a: "start" | "middle" | "end" = "start") => <text x={x} y={y} fontFamily={UI} fontWeight={w} fontSize={size} fill={c} textAnchor={a}>{s}</text>;
const HW = (x: number, y: number, s: string, size = 40, c = "#22324A", a: "start" | "middle" | "end" = "middle") => <text x={x} y={y} fontFamily="Caveat, Poppins" fontWeight={700} fontSize={size} fill={c} textAnchor={a}>{s}</text>;

// ───────── karakterler
export const SENK: Look = { hairStyle: "bun", hair: "#3A2418", top: "#2F4A6B", top2: "#253B56", kind: "jacket", skin: "#E8B996", skin2: "#C98F68" };
export const SENK_EV: Look = { ...SENK, top: "#9C6B8E", top2: "#7F5573", kind: "sweater" };
export const ELIF: Look = { hairStyle: "curly", hair: "#5A3A24", top: "#2F4A6B", top2: "#253B56", kind: "jacket", skin: "#E6B48C" };
export const ELIF_EV: Look = { ...ELIF, top: "#C9874A", top2: "#A96E38", kind: "hoodie" };
export const HAKAN: Look = { hairStyle: "short", hair: "#2E2E2E", top: "#5C6670", top2: "#48505A", kind: "shirt", glasses: true, mustache: true, beard: 0.3 };
export const NURIYE: Look = { hairStyle: "scarf", scarf: "#4E6E8E", top: "#2F4A6B", top2: "#253B56", kind: "jacket", skin: "#DDA984" };
export const SERKAN: Look = { hairStyle: "fade", top: "#2F4A6B", top2: "#253B56", kind: "jacket", beard: 0.6 };
export const ISCI: Look = { hairStyle: "short", top: "#2F4A6B", top2: "#253B56", kind: "jacket", beard: 0.4 };
export const BABA_K: Look = { hairStyle: "short", hair: "#8A8A8A", top: "#6B5B4A", top2: "#56483A", kind: "cardigan", mustache: true, skin: "#D5A07A" };

export const NAVY = "#2F4A6B", ORG = "#F07A1A", STEEL = "#8C96A3", STEEL2 = "#5E6773";

// ───────── gökyüzü (şafak / gece / gün)
const Sky: React.FC<{ mode: "dawn" | "night" | "day" }> = ({ mode }) => {
  const s = mode === "dawn" ? ["#1B2348", "#E7956A"] : mode === "night" ? ["#05070F", "#141C33"] : ["#8FC3EA", "#E3F0FA"];
  const id = `fsky${mode}`;
  return <g><defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={s[0]} /><stop offset="1" stopColor={s[1]} /></linearGradient></defs><rect width={1920} height={1080} fill={`url(#${id})`} /></g>;
};

// ───────── fabrika dışı: testere çatı, baca + duman, çit, güvenlik kulübesi, turnikeler, OSB tabelası
export const FabrikaDis: React.FC<{ t: number; mode?: "dawn" | "night" | "day"; px?: number; people?: React.ReactNode; walkers?: number; snow?: boolean }> = ({ t, mode = "dawn", px = 0, people, walkers = 6 }) => {
  const lit = mode !== "day";
  return (
    <g>
      <Sky mode={mode} />
      {mode === "night" && Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 263) % 1920} cy={(i * 71) % 300} r={1.5} fill="#FFF" opacity={0.5} />)}
      <g transform={`translate(${px},0)`}>
        {/* uzak fabrikalar */}
        {[[-80, 300], [380, 240], [1300, 280], [1700, 220]].map(([x, h], i) => <rect key={i} x={x} y={640 - h} width={360} height={h} fill={lit ? "#1E2438" : "#7D8C9C"} opacity={0.7} />)}
        {/* baca */}
        <g transform="translate(1560,640)"><rect x={-30} y={-520} width={60} height={520} fill={lit ? "#2A2F42" : "#9AA3AE"} />{[0, 1].map((j) => <rect key={j} x={-34} y={-480 + j * 60} width={68} height={18} fill="#C0392B" />)}
          {Array.from({ length: 7 }, (_, i) => { const k = (t * 0.18 + i / 7) % 1; return <circle key={i} cx={Math.sin(k * 5 + i) * 30 - k * 220} cy={-540 - k * 260} r={30 + k * 90} fill={lit ? "#9AA0B4" : "#E6E9EE"} opacity={0.35 * (1 - k)} />; })}
        </g>
        {/* ana hangar: testere çatı */}
        <g transform="translate(240,760)">
          <rect x={0} y={-330} width={1320} height={330} fill={lit ? "#3A4258" : "#C9CFD6"} />
          {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${i * 220},-330 L${i * 220 + 160},-450 L${i * 220 + 160},-330Z`} fill={lit ? "#2C3346" : "#AEB6C0"} />)}
          {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${i * 220 + 160},-450 L${i * 220 + 220},-330 L${i * 220 + 160},-330Z`} fill={lit ? "#FFD98A" : "#DCE8F2"} opacity={lit ? 0.55 : 0.9} />)}
          {Array.from({ length: 10 }, (_, i) => <rect key={i} x={40 + i * 128} y={-260} width={90} height={60} fill={lit ? "#FFD98A" : "#9DB6CC"} opacity={lit ? 0.7 + 0.2 * Math.sin(t * 2 + i) : 1} />)}
          <rect x={0} y={-330} width={1320} height={40} fill={NAVY} />
          {T(660, -300, "ANADOLU OTO PARÇA SAN. A.Ş.", 30, "#FFF", 700, "middle")}
          <rect x={520} y={-170} width={280} height={170} fill="#5E6773" />{Array.from({ length: 8 }, (_, i) => <line key={i} x1={520} x2={800} y1={-160 + i * 20} y2={-160 + i * 20} stroke="#4A525C" strokeWidth={4} />)}
        </g>
        {/* zemin + yol */}
        <rect x={-200} y={760} width={2400} height={400} fill={lit ? "#1A1D26" : "#6E747C"} />
        <rect x={-200} y={760} width={2400} height={14} fill="#F6C21C" opacity={0.6} />
        {/* çit */}
        {Array.from({ length: 30 }, (_, i) => <line key={i} x1={-100 + i * 80} y1={700} x2={-100 + i * 80} y2={800} stroke="#8C96A3" strokeWidth={5} />)}
        <line x1={-200} x2={2200} y1={710} y2={710} stroke="#8C96A3" strokeWidth={5} />
        {/* güvenlik kulübesi */}
        <g transform="translate(1700,820)"><rect x={-130} y={-230} width={260} height={230} fill="#E8E2D2" /><rect x={-150} y={-260} width={300} height={40} fill={NAVY} /><rect x={-100} y={-190} width={200} height={100} fill={lit ? "#FFD98A" : "#BFD3E2"} />{T(0, -232, "GÜVENLİK", 26, "#FFF", 700, "middle")}</g>
        {/* OSB tabelası */}
        <g transform="translate(150,800)"><rect x={-8} y={-200} width={16} height={200} fill="#555" /><rect x={-140} y={-300} width={280} height={110} rx={10} fill="#1F6B3E" stroke="#FFF" strokeWidth={5} />{T(0, -250, "GEBZE", 34, "#FFF", 700, "middle")}{T(0, -210, "Organize Sanayi", 24, "#FFF", 600, "middle")}</g>
        {/* lambalar */}
        {[500, 1100, 1450].map((x) => <g key={x}><rect x={x - 6} y={560} width={12} height={240} fill="#444" /><circle cx={x} cy={560} r={14} fill={lit ? "#FFE9A8" : "#CCC"} />{lit && <circle cx={x} cy={600} r={160} fill="url(#hLamp)" opacity={0.6} />}</g>)}
        {/* turnike sırası */}
        {[860, 1000, 1140].map((x) => <g key={x} transform={`translate(${x},900)`}><rect x={-22} y={-170} width={44} height={170} rx={8} fill={STEEL} /><rect x={-16} y={-160} width={32} height={30} rx={4} fill="#111" /><circle cx={0} cy={-145} r={6} fill="#2BB673" opacity={lit ? 0.9 : 0.6} />{[-40, 0, 40].map((r) => <rect key={r} x={20} y={-104} width={70} height={10} rx={5} fill="#B8C0CA" transform={`rotate(${r + t * 40 * 0} 20 -100)`} />)}</g>)}
        {/* yürüyen işçiler (uzak siluet) */}
        {Array.from({ length: walkers }, (_, i) => { const x = ((t * 60 + i * 330) % 2200) - 140; const bob = Math.abs(Math.sin(t * 6 + i)) * 6; return <g key={i} transform={`translate(${x},${930 - bob})`} opacity={0.85}><rect x={-16} y={-110} width={32} height={74} rx={12} fill={i % 3 ? NAVY : "#3B4A5E"} /><circle cx={0} cy={-128} r={16} fill={i % 2 ? "#D9A47E" : "#3A2418"} /><rect x={-14} y={-36} width={11} height={40} fill="#222" transform={`rotate(${Math.sin(t * 6 + i) * 18} -8 -36)`} /><rect x={3} y={-36} width={11} height={40} fill="#222" transform={`rotate(${-Math.sin(t * 6 + i) * 18} 8 -36)`} /></g>; })}
        {people}
      </g>
    </g>
  );
};

// ───────── kişisel kart (fotoğraflı)
export const Kart: React.FC<{ x: number; y: number; s?: number; rot?: number; name?: string }> = ({ x, y, s = 1, rot = 0, name = "PERSONEL" }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-150} y={-95} width={300} height={190} rx={16} fill="#F4F6F8" stroke="#C9CFD6" strokeWidth={3} />
    <rect x={-150} y={-95} width={300} height={44} rx={16} fill={NAVY} /><rect x={-150} y={-65} width={300} height={14} fill={NAVY} />
    {T(0, -64, "ANADOLU OTO PARÇA", 20, "#FFF", 700, "middle")}
    <rect x={-130} y={-36} width={90} height={110} rx={8} fill="#C7D3DF" /><circle cx={-85} cy={4} r={24} fill={H.skin} /><circle cx={-85} cy={-24} r={14} fill="#3A2418" /><path d="M-125,74 Q-85,30 -45,74Z" fill={NAVY} />
    {T(-20, -6, name, 22, "#222", 700)}{T(-20, 24, "Sicil: 4718", 18, "#666", 600)}
    <rect x={-20} y={44} width={150} height={26} rx={4} fill="#DDE3E9" />{Array.from({ length: 14 }, (_, i) => <rect key={i} x={-14 + i * 10} y={48} width={i % 3 ? 4 : 7} height={18} fill="#333" />)}
  </g>
);

// ───────── turnike yakın çekim: kart okuyucu + ışık (state) + kol döner
export const Turnike: React.FC<{ t: number; a: number; at?: number; state?: "green" | "red"; card?: boolean; shake?: number; night?: boolean }> = ({ t, a, at = 1.2, state = "green", card = true, shake = 0 }) => {
  const k = rp(t, a + 0.2, a + at);
  const beep = t > a + at;
  const blink = beep && t < a + at + 0.5 ? (Math.sin(t * 60) > 0 ? 1 : 0.35) : 1;
  const spin = state === "green" && beep ? rp(t, a + at + 0.3, a + at + 1.3) * 120 : 0;
  const sh = shake * Math.sin(t * 55) * 6;
  const col = !beep ? "#2A2E38" : state === "green" ? "#2BFF8A" : "#FF3B2F";
  return (
    <g>
      <rect width={1920} height={1080} fill="#151A24" />
      <rect y={760} width={1920} height={320} fill="#0E1118" />
      {Array.from({ length: 9 }, (_, i) => <rect key={i} x={i * 230 - 40} y={180} width={120} height={540} fill="#1E2432" opacity={0.6} />)}
      <circle cx={1500} cy={200} r={300} fill="url(#hLamp)" opacity={0.25} />
      {/* gövde */}
      <g transform="translate(860,760)">
        <rect x={-130} y={-620} width={260} height={620} rx={30} fill={STEEL} /><rect x={90} y={-620} width={40} height={620} rx={20} fill={STEEL2} opacity={0.7} />
        <rect x={-100} y={-580} width={200} height={170} rx={20} fill="#0B0D12" />
        <circle cx={0} cy={-495} r={58} fill={col} opacity={beep ? 0.9 * blink : 0.5} style={{ filter: beep ? `drop-shadow(0 0 30px ${col})` : "none" }} />
        <path d="M-30,-500 L-8,-475 L32,-520" stroke={beep && state === "green" ? "#0B3A1E" : "transparent"} strokeWidth={12} fill="none" strokeLinecap="round" />
        {beep && state === "red" && <path d="M-26,-521 L26,-469 M26,-521 L-26,-469" stroke="#4A0E0B" strokeWidth={12} strokeLinecap="round" />}
        {/* üç kollu tripod */}
        <g transform="translate(130,-300)"><circle r={46} fill="#B8C0CA" />{[0, 120, 240].map((r) => <rect key={r} x={0} y={-14} width={420} height={28} rx={14} fill="#D4DAE1" transform={`rotate(${r + spin + 20})`} />)}<circle r={26} fill={STEEL2} /></g>
      </g>
      {/* kartlı el */}
      {card && <g transform={`translate(${lp(1700, 1060, k) + sh},${lp(700, 300, k)}) rotate(${lp(20, -6, k)})`}>
        <rect x={60} y={-60} width={420} height={140} rx={50} fill={NAVY} />
        <path d="M-40,-50 Q60,-70 100,-30 Q118,0 100,30 Q60,62 -40,50Z" fill="#E8B996" />
        <Kart x={-150} y={0} s={0.7} rot={-4} />
        <path d="M-40,-40 Q-10,-80 30,-60" stroke="#E8B996" strokeWidth={34} strokeLinecap="round" fill="none" />
      </g>}
      {beep && <g opacity={1 - rp(t, a + at, a + at + 0.6)}>{[0, 1, 2].map((i) => <circle key={i} cx={860} cy={265} r={70 + i * 40 + rp(t, a + at, a + at + 0.6) * 80} fill="none" stroke={col} strokeWidth={6} />)}</g>}
      {beep && T(860, 120, state === "green" ? "BİP" : "BİP BİP", 90, col, 700, "middle")}
    </g>
  );
};

// ───────── servis minibüsü (yandan, buğulu cam)
export const Servis: React.FC<{ x: number; y: number; s?: number; t: number; speed?: number; night?: boolean; sleepers?: number }> = ({ x, y, s = 1, t, speed = 0, night, sleepers = 4 }) => {
  const bob = speed ? Math.sin(t * 14) * 2 : 0;
  return (
    <g transform={`translate(${x},${y + bob}) scale(${s})`}>
      <ellipse cx={0} cy={0} rx={520} ry={30} fill="#000" opacity={0.3} />
      <path d="M-500,-60 L-500,-380 Q-500,-420 -460,-420 L360,-420 Q420,-420 450,-360 L520,-200 L520,-60Z" fill="#F2F2EE" />
      <path d="M-500,-140 L520,-140 L520,-110 L-500,-110Z" fill={ORG} />
      {Array.from({ length: 5 }, (_, i) => <g key={i}><rect x={-460 + i * 170} y={-380} width={150} height={150} rx={12} fill={night ? "#2A3348" : "#9DB6CC"} /><rect x={-460 + i * 170} y={-380} width={150} height={150} rx={12} fill="#E9EEF3" opacity={0.45} />{i < sleepers && <g transform={`translate(${-385 + i * 170},${-250})`}><circle cx={0} cy={-40} r={34} fill={i % 2 ? "#3A2418" : "#D9A47E"} opacity={0.6} transform={`rotate(${18 + Math.sin(t * 2 + i) * 3})`} /></g>}</g>)}
      <path d="M380,-380 L440,-370 L500,-220 L380,-220Z" fill={night ? "#2A3348" : "#9DB6CC"} />
      {T(-40, -165, "PERSONEL SERVİSİ", 30, "#2F4A6B", 700, "middle")}
      {[-320, 330].map((cx) => <g key={cx} transform={`translate(${cx},-50)`}><circle r={62} fill="#151515" /><circle r={30} fill="#999" /><rect x={-3} y={-28} width={6} height={56} fill="#555" transform={`rotate(${t * speed * 500})`} /></g>)}
      <circle cx={510} cy={-150} r={18} fill={night ? "#FFF6C8" : "#EEE"} />{night && <path d="M520,-160 L900,-240 L900,-60Z" fill="#FFF6C8" opacity={0.18} />}
    </g>
  );
};

// ───────── servis içi (sabah 6, herkes uyuyor, camda buğu, dışarıdan ışıklar akar)
export const ServisIc: React.FC<{ t: number; people?: React.ReactNode; radio?: boolean }> = ({ t, people, radio = true }) => (
  <g>
    <rect width={1920} height={1080} fill="#2B3140" />
    <rect x={0} y={120} width={1920} height={430} fill="#141A2A" />
    {Array.from({ length: 12 }, (_, i) => { const x = 1920 - ((t * 500 + i * 300) % 2300); return <g key={i}><circle cx={x} cy={230 + hash(i) * 200} r={14 + hash(i + 2) * 20} fill="#FFD27A" opacity={0.45} /><rect x={x - 200} y={470} width={260} height={6} fill="#FF9A3C" opacity={0.5} /></g>; })}
    <rect x={0} y={120} width={1920} height={430} fill="#DCE4EC" opacity={0.28} />
    {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={hash(i + 3) * 1920} cy={140 + hash(i + 9) * 400} r={3 + hash(i) * 6} fill="#FFF" opacity={0.25} />)}
    {[0, 480, 960, 1440].map((x) => <rect key={x} x={x - 18} y={120} width={36} height={430} fill="#3E4656" />)}
    <rect x={0} y={550} width={1920} height={530} fill="#353D4D" />
    {[260, 760, 1260, 1760].map((x) => <g key={x}><rect x={x - 180} y={600} width={360} height={260} rx={30} fill="#4A5366" /><rect x={x - 170} y={560} width={340} height={90} rx={30} fill="#5A6478" /></g>)}
    <g transform={`translate(${Math.sin(t * 3) * 4},${Math.sin(t * 5) * 3})`}>{people}</g>
    {radio && <g transform="translate(1650,160)"><rect x={-110} y={-40} width={220} height={80} rx={12} fill="#111" />{T(0, 12, "♪ 96.2 FM", 30, "#5CF08E", 700, "middle")}</g>}
  </g>
);

// ───────── üretim hangarı: makas kirişler, sarkan lambalar, akan bant (parçalar), forklift, sarı yer çizgileri
export const Hangar: React.FC<{ t: number; night?: boolean; px?: number; people?: React.ReactNode; band?: boolean; fork?: boolean; empty?: boolean; sign?: string }> = ({ t, night, px = 0, people, band = true, fork = true, empty, sign = "İŞ GÜVENLİĞİ ÖNCE GELİR" }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#1C2130" : "#3E4656"} />
    <g transform={`translate(${px},0)`}>
      {/* çatı kirişleri */}
      {Array.from({ length: 12 }, (_, i) => <g key={i}><line x1={-200 + i * 200} y1={0} x2={-100 + i * 200} y2={160} stroke="#5E6773" strokeWidth={8} /><line x1={-100 + i * 200} y1={160} x2={0 + i * 200} y2={0} stroke="#5E6773" strokeWidth={8} /></g>)}
      <rect x={-200} y={150} width={2400} height={16} fill="#5E6773" />
      {/* çatı pencereleri */}
      {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-60 + i * 360} y={20} width={200} height={110} fill={night ? "#0B1020" : "#A9C6DE"} opacity={0.8} />)}
      {/* duvar + raflar */}
      <rect x={-200} y={166} width={2400} height={470} fill={night ? "#2A3142" : "#56607A"} />
      {Array.from({ length: 7 }, (_, i) => <g key={i} transform={`translate(${-100 + i * 330},300)`}><rect x={0} y={0} width={260} height={330} fill="none" stroke={ORG} strokeWidth={8} />{[0, 110, 220].map((y) => <rect key={y} x={10} y={y + 20} width={240} height={80} fill={i % 2 ? "#7A6A55" : "#5C7A8C"} />)}</g>)}
      {/* pano / tabela */}
      <g transform="translate(1420,210)"><rect x={-300} y={0} width={600} height={70} rx={8} fill="#F6C21C" />{T(0, 48, sign, 32, "#111", 700, "middle")}</g>
      {/* duvar saati */}
      <g transform="translate(260,240)"><circle r={50} fill="#F4F1EA" stroke="#222" strokeWidth={6} /><rect x={-3} y={-36} width={6} height={38} fill="#222" transform={`rotate(${t * 2})`} /><rect x={-2} y={-44} width={4} height={46} fill="#C0392B" transform={`rotate(${t * 36})`} /></g>
      {/* zemin */}
      <rect x={-200} y={636} width={2400} height={450} fill={night ? "#2E3340" : "#6A707A"} />
      {[700, 1000].map((y) => <rect key={y} x={-200} y={y} width={2400} height={12} fill="#F6C21C" opacity={0.75} />)}
      {/* akan bant */}
      {band && <g transform="translate(0,720)">
        <rect x={-200} y={0} width={2400} height={60} fill="#22262E" />
        {Array.from({ length: 40 }, (_, i) => <rect key={i} x={((i * 60 - t * 120) % 2400 + 2400) % 2400 - 200} y={4} width={4} height={52} fill="#3A3F4A" />)}
        {Array.from({ length: 10 }, (_, i) => { const x = ((i * 260 + t * 120) % 2600) - 300; return <g key={i} transform={`translate(${x},-20)`}><rect x={-60} y={-10} width={120} height={30} rx={6} fill={STEEL} /><rect x={-40} y={-30} width={80} height={24} rx={4} fill="#A9B3BF" /></g>; })}
        {[200, 900, 1600].map((x) => <rect key={x} x={x} y={60} width={30} height={200} fill="#2A2E36" />)}
      </g>}
      {/* uzaktaki işçiler */}
      {!empty && Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${120 + i * 330},700)`} opacity={0.75}><rect x={-26} y={-110} width={52} height={90} rx={16} fill={NAVY} /><circle cx={0} cy={-132} r={22} fill={i % 2 ? "#3A2418" : "#D9A47E"} /><rect x={-34} y={-90 + Math.sin(t * 5 + i) * 8} width={20} height={50} rx={8} fill={NAVY} transform="rotate(20 -30 -90)" /></g>)}
      {/* forklift */}
      {fork && (() => { const x = ((t * 140) % 2800) - 400; return <g transform={`translate(${x},1000)`}><rect x={-120} y={-150} width={200} height={110} rx={12} fill="#F6C21C" /><rect x={-80} y={-270} width={8} height={130} fill="#333" /><rect x={20} y={-270} width={8} height={130} fill="#333" /><rect x={-84} y={-280} width={116} height={14} fill="#333" /><rect x={80} y={-200} width={14} height={180} fill="#444" /><rect x={94} y={-40} width={90} height={12} fill="#444" /><rect x={110} y={-90} width={70} height={50} fill="#8A6A3A" />{[-80, 40].map((cx) => <circle key={cx} cx={cx} cy={-30} r={30} fill="#151515" />)}<circle cx={-110} cy={-160} r={10} fill="#FF9A3C" opacity={0.5 + 0.5 * Math.sin(t * 8)} /></g>; })()}
      {people}
    </g>
    {/* sarkan lambalar */}
    {[300, 800, 1300, 1800].map((x, i) => <g key={x}><line x1={x} y1={160} x2={x} y2={260} stroke="#222" strokeWidth={4} /><path d={`M${x - 70},300 L${x - 40},260 L${x + 40},260 L${x + 70},300Z`} fill="#3A3F4A" /><ellipse cx={x} cy={300} rx={70} ry={10} fill="#FFF3C8" /><path d={`M${x - 70},300 L${x - 260},1000 L${x + 260},1000 L${x + 70},300Z`} fill="#FFF3C8" opacity={0.05 + 0.01 * Math.sin(t * 13 + i)} /></g>)}
  </g>
);

// ───────── kablo demeti masası (yakın): pimli tahta, renkli kablolar, klips, eller
export const KabloMasa: React.FC<{ t: number; k?: number; wrong?: number; speed?: number; hands?: boolean }> = ({ t, k = 1, wrong = 0, speed = 1, hands = true }) => {
  const cols = ["#E5322D", "#2B7FD8", "#2BB673", "#F6C21C", "#111", "#FFF", "#8E44AD"];
  const wig = (i: number) => Math.sin(t * 2 + i) * 3;
  return (
    <g>
      <rect width={1920} height={1080} fill="#2A2F3A" />
      <rect x={120} y={160} width={1680} height={760} rx={18} fill="#C7B48E" stroke="#8A7651" strokeWidth={10} />
      {Array.from({ length: 64 }, (_, i) => <circle key={i} cx={200 + (i % 16) * 100} cy={230 + Math.floor(i / 16) * 190} r={7} fill="#6E6E6E" />)}
      {/* ana demet */}
      {cols.map((c, i) => { const n = cl(k * 1.2 - i * 0.08); const y = 520 + (i - 3) * 14; return <path key={i} d={`M220,${y} C600,${y - 120 + wig(i)} 900,${y + 120} ${lp(240, 1700, n)},${y + (i - 3) * 6}`} stroke={wrong && i === 1 ? "#2B7FD8" : c} strokeWidth={16} fill="none" strokeLinecap="round" />; })}
      {/* dallar */}
      {[[600, 300], [900, 780], [1250, 320], [1500, 760]].map(([x, y], j) => <g key={j} opacity={cl(k * 2 - j * 0.3)}>{[0, 1, 2].map((i) => <path key={i} d={`M${x},${520} Q${x + 30},${(520 + y) / 2} ${x + (i - 1) * 40},${y}`} stroke={cols[(j + i) % cols.length]} strokeWidth={12} fill="none" />)}<rect x={x - 40} y={y - (y < 520 ? 60 : 0)} width={80} height={60} rx={8} fill="#2A2A2A" /></g>)}
      {/* klipsler + bant */}
      {[400, 760, 1100, 1400].map((x, i) => <g key={x} opacity={cl(k * 2 - i * 0.25)}><rect x={x - 14} y={490} width={28} height={70} rx={6} fill="#F07A1A" /><rect x={x + 30} y={496} width={40} height={56} fill="#222" opacity={0.85} /></g>)}
      {/* yanlış kablo işareti */}
      {wrong > 0 && <g opacity={wrong}><circle cx={1250} cy={320} r={80} fill="none" stroke="#FF3B2F" strokeWidth={10} />{T(1250, 200, "MAVİ ≠ YEŞİL", 40, "#FF3B2F", 700, "middle")}</g>}
      {/* eller */}
      {hands && <g>
        <g transform={`translate(${780 + Math.sin(t * 6 * speed) * 40},${640 + Math.cos(t * 6 * speed) * 20}) rotate(-20)`}><rect x={-60} y={0} width={120} height={400} rx={50} fill={NAVY} /><ellipse cx={0} cy={-10} rx={56} ry={66} fill="#E8B996" />{[-30, -10, 10, 30].map((xx) => <rect key={xx} x={xx - 10} y={-110} width={20} height={70} rx={10} fill="#E8B996" />)}</g>
        <g transform={`translate(${1140 - Math.sin(t * 6 * speed + 1) * 40},${660 + Math.sin(t * 6 * speed) * 20}) rotate(18)`}><rect x={-60} y={0} width={120} height={400} rx={50} fill={NAVY} /><ellipse cx={0} cy={-10} rx={56} ry={66} fill="#E8B996" />{[-30, -10, 10, 30].map((xx) => <rect key={xx} x={xx - 10} y={-110} width={20} height={70} rx={10} fill="#E8B996" />)}</g>
      </g>}
    </g>
  );
};

// ───────── test masası: demet bağlanır, ışık yanar, HATALI etiketi yapışır
export const TestMasa: React.FC<{ t: number; a: number; fail?: boolean; at?: number }> = ({ t, a, fail = true, at = 1 }) => {
  const on = t > a + at;
  const lbl = rp(t, a + at + 0.6, a + at + 1);
  const c = fail ? "#FF3B2F" : "#2BFF8A";
  return (
    <g>
      <rect width={1920} height={1080} fill="#1E232D" />
      <rect x={200} y={620} width={1520} height={460} fill="#454C5A" />
      <g transform="translate(960,420)">
        <rect x={-420} y={-260} width={840} height={460} rx={24} fill="#2A2F3A" stroke="#5E6773" strokeWidth={8} />
        <rect x={-380} y={-220} width={760} height={200} rx={14} fill="#0B0D12" />
        {T(-350, -160, "TEST", 36, "#AAA", 700)}
        <text x={350} y={-60} fontFamily="'Courier New', monospace" fontWeight={700} fontSize={110} fill={on ? c : "#333"} textAnchor="end" style={{ filter: on ? `drop-shadow(0 0 16px ${c})` : "none" }}>{on ? (fail ? "HATA 07" : "OK") : "----"}</text>
        <circle cx={-260} cy={90} r={60} fill={on ? c : "#333"} opacity={on ? 0.6 + 0.4 * Math.sin(t * 14) : 1} />
        {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-120 + i * 60} y={60} width={40} height={60} rx={6} fill="#151515" />)}
      </g>
      {/* demet + etiket */}
      <g transform="translate(960,860)">
        {["#E5322D", "#2B7FD8", "#2BB673", "#F6C21C", "#111"].map((cc, i) => <path key={i} d={`M-700,${(i - 2) * 16} Q0,${-40 + (i - 2) * 16} 700,${(i - 2) * 16}`} stroke={cc} strokeWidth={18} fill="none" />)}
        {fail && <g transform={`translate(120,${lp(-260, -10, lbl)}) rotate(${lp(-30, -6, lbl)})`} opacity={lbl}><rect x={-160} y={-60} width={320} height={120} rx={12} fill="#E5322D" />{T(0, 18, "HATALI", 62, "#FFF", 700, "middle")}</g>}
      </g>
    </g>
  );
};

// ───────── yemekhane (uzun masalar, tepsiler, buhar, menü panosu)
export const Yemekhane: React.FC<{ t: number; px?: number; people?: React.ReactNode; crowd?: number; quiet?: boolean }> = ({ t, px = 0, people, crowd = 8 }) => (
  <g>
    <rect width={1920} height={1080} fill="#D9D2C4" />
    <g transform={`translate(${px},0)`}>
      <rect x={-200} y={0} width={2400} height={640} fill="#E9E3D6" />
      <rect x={-200} y={420} width={2400} height={220} fill="#CFE0D6" />
      {Array.from({ length: 5 }, (_, i) => <rect key={i} x={-60 + i * 460} y={110} width={300} height={220} fill="#BFD7EA" stroke="#9AA4AE" strokeWidth={10} />)}
      {/* menü */}
      <g transform="translate(1620,130)"><rect x={-170} y={0} width={340} height={300} rx={10} fill="#22324A" />{T(0, 50, "GÜNÜN MENÜSÜ", 28, "#F6C21C", 700, "middle")}{["Mercimek çorbası", "Kuru fasulye", "Pilav", "Ekmek · Ayran"].map((s, i) => <g key={i}>{T(0, 110 + i * 50, s, 26, "#FFF", 600, "middle")}</g>)}</g>
      {/* tezgah + buhar */}
      <g transform="translate(260,560)"><rect x={-200} y={-60} width={420} height={120} fill="#B8C0CA" />{[-120, 0, 120].map((x, i) => <g key={x}><rect x={x - 50} y={-80} width={100} height={30} fill="#8C96A3" />{Array.from({ length: 4 }, (_, j) => { const k = (t * 0.6 + j / 4 + i * 0.3) % 1; return <circle key={j} cx={x + Math.sin(k * 6 + j) * 16} cy={-100 - k * 140} r={12 + k * 20} fill="#FFF" opacity={0.4 * (1 - k)} />; })}</g>)}</g>
      <rect x={-200} y={640} width={2400} height={440} fill="#B9AE98" />
      {/* uzak masalar + kalabalık */}
      {Array.from({ length: crowd }, (_, i) => <g key={i} transform={`translate(${-40 + i * 270},690)`} opacity={0.6}><circle cx={0} cy={-80} r={24} fill={i % 2 ? "#3A2418" : "#D9A47E"} /><rect x={-34} y={-56} width={68} height={70} rx={20} fill={NAVY} /></g>)}
      <rect x={-200} y={760} width={2400} height={40} fill="#E8E2D2" />
      {people}
      {/* ön masa */}
      <rect x={-200} y={950} width={2400} height={130} fill="#E8E2D2" /><rect x={-200} y={950} width={2400} height={14} fill="#FFF" opacity={0.5} />
    </g>
  </g>
);

// ───────── metal tepsi (yakın): çorba, fasulye, pilav, ekmek
export const Tepsi: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-420} y={-250} width={840} height={500} rx={40} fill="#C9CFD6" stroke="#9AA4AE" strokeWidth={8} />
    <rect x={-380} y={-210} width={360} height={220} rx={30} fill="#B8C0CA" /><ellipse cx={-200} cy={-100} rx={150} ry={90} fill="#E7A23B" /><ellipse cx={-200} cy={-110} rx={110} ry={56} fill="#F0B84E" />
    <rect x={20} y={-210} width={360} height={220} rx={30} fill="#B8C0CA" />{Array.from({ length: 26 }, (_, i) => <ellipse key={i} cx={60 + (i % 7) * 44} cy={-170 + Math.floor(i / 7) * 46} rx={22} ry={14} fill="#F3EDE0" stroke="#E2D9C6" strokeWidth={2} />)}
    <rect x={-380} y={40} width={460} height={170} rx={30} fill="#B8C0CA" />{Array.from({ length: 14 }, (_, i) => <ellipse key={i} cx={-330 + (i % 7) * 58} cy={90 + Math.floor(i / 7) * 60} rx={22} ry={14} fill="#F2EEE6" />)}<ellipse cx={-150} cy={125} rx={170} ry={55} fill="#B4442A" opacity={0.85} />
    <path d="M140,60 Q260,20 360,70 L360,190 Q260,210 140,190Z" fill="#D9A55A" /><path d="M150,70 Q260,40 350,80" stroke="#B8843E" strokeWidth={6} fill="none" />
    {Array.from({ length: 5 }, (_, i) => { const k = (t * 0.5 + i / 5) % 1; return <circle key={i} cx={-200 + Math.sin(k * 6 + i) * 30} cy={-150 - k * 220} r={14 + k * 30} fill="#FFF" opacity={0.35 * (1 - k)} />; })}
  </g>
);

// ───────── eksik parmak ucu (Nuriye'nin eli, çay bardağıyla). Sade, kansız.
export const EksikParmak: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-560} y={-90} width={430} height={180} rx={70} fill={NAVY} />
    <path d="M-150,-80 Q60,-100 120,-40 Q140,0 120,40 Q60,90 -150,80Z" fill="#DDA984" />
    <rect x={100} y={-74} width={70} height={30} rx={15} fill="#DDA984" />
    <rect x={110} y={-38} width={110} height={30} rx={15} fill="#DDA984" />
    <rect x={110} y={-2} width={100} height={30} rx={15} fill="#DDA984" />
    <rect x={100} y={34} width={80} height={28} rx={14} fill="#DDA984" />
    <path d="M168,-74 Q178,-59 168,-44" stroke="#B8805C" strokeWidth={5} fill="none" />
    <path d="M-60,-80 Q0,-150 70,-120 Q80,-96 20,-70Z" fill="#DDA984" />
    <g transform="translate(250,-60)"><path d="M-46,-140 L46,-140 L36,40 L-36,40Z" fill="#E9E2D0" opacity={0.85} /><path d="M-42,-100 L42,-100 L36,40 L-36,40Z" fill="#B5441C" opacity={0.85} />{Array.from({ length: 3 }, (_, i) => { const k = (t * 0.6 + i / 3) % 1; return <circle key={i} cx={Math.sin(k * 6) * 12} cy={-160 - k * 80} r={8 + k * 14} fill="#FFF" opacity={0.3 * (1 - k)} />; })}</g>
  </g>
);

// ───────── pres makinesi: koç iner (ram 0 yukarı → 1 aşağı), ışık perdesi, alarm, iki el butonu, sac parça
export const Pres: React.FC<{ t: number; ram?: number; cut?: boolean; alarm?: boolean; hand?: number; part?: "sac" | "kapi" | "yamuk"; night?: boolean; close?: boolean }> = ({ t, ram = 0, cut = false, alarm = false, hand = 0, part = "sac", night = true }) => {
  const ry = lp(140, 470, ram);
  const beam = cut ? "#FF3B2F" : "#FF6B6B";
  const al = alarm ? 0.5 + 0.5 * Math.sin(t * 16) : 0;
  return (
    <g>
      <rect width={1920} height={1080} fill={night ? "#151922" : "#3E4656"} />
      <rect y={860} width={1920} height={220} fill="#22262E" />
      {[860, 900].map((y) => <rect key={y} x={0} y={y} width={1920} height={10} fill="#F6C21C" opacity={0.6} />)}
      {/* gövde */}
      <g transform="translate(960,0)">
        <rect x={-520} y={40} width={180} height={840} fill="#2E6FA8" /><rect x={340} y={40} width={180} height={840} fill="#2E6FA8" />
        <rect x={-520} y={40} width={1040} height={150} fill="#265C8C" />{T(0, 130, "PRES 400 TON", 54, "#FFF", 700, "middle")}
        <rect x={-500} y={40} width={30} height={840} fill="#4A8AC2" opacity={0.6} />
        {/* hidrolik pistonlar */}
        {[-200, 200].map((x) => <g key={x}><rect x={x - 40} y={190} width={80} height={ry - 150} fill="#C9CFD6" /><rect x={x - 50} y={190} width={100} height={30} fill="#8C96A3" /></g>)}
        {/* koç + üst kalıp */}
        <rect x={-340} y={ry} width={680} height={130} fill="#5E6773" /><rect x={-300} y={ry + 130} width={600} height={70} fill="#8C96A3" />
        {[0, 1, 2, 3].map((i) => <path key={i} d={`M${-300 + i * 160},${ry + 200} l40,30 l40,-30`} fill="#6E7884" />)}
        {/* alt kalıp + tabla */}
        <rect x={-340} y={700} width={680} height={180} fill="#4A525C" /><rect x={-300} y={660} width={600} height={50} fill="#8C96A3" />
        {/* parça */}
        {part !== "kapi" ? <g transform={`translate(0,640) rotate(${part === "yamuk" ? -9 : 0})`}><rect x={-230} y={-18} width={460} height={22} fill="#C9CFD6" stroke="#9AA4AE" strokeWidth={3} /></g>
          : <g transform="translate(0,615)"><path d="M-220,30 L-200,-40 L180,-40 L230,30Z" fill="#B8C0CA" stroke="#8C96A3" strokeWidth={4} /><rect x={-120} y={-28} width={150} height={40} rx={10} fill="#8C96A3" /></g>}
        {/* ışık perdesi direkleri */}
        {[-390, 390].map((x) => <g key={x}><rect x={x - 22} y={330} width={44} height={420} rx={10} fill="#F6C21C" /><rect x={x - 12} y={340} width={24} height={400} fill="#222" />{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={x} cy={355 + i * 28} r={6} fill={beam} opacity={cut ? 0.5 + 0.5 * Math.sin(t * 20 + i) : 0.85} />)}</g>)}
        {Array.from({ length: 14 }, (_, i) => <line key={i} x1={-378} x2={378} y1={355 + i * 28} y2={355 + i * 28} stroke={beam} strokeWidth={2} opacity={cut ? (i > 8 && i < 13 ? 0 : 0.35) : 0.18} strokeDasharray={cut ? "8 10" : "none"} />)}
        {/* alarm lambası */}
        <g transform="translate(470,10)"><rect x={-10} y={0} width={20} height={40} fill="#333" /><ellipse cx={0} cy={-14} rx={36} ry={44} fill={alarm ? "#FF3B2F" : "#6A2A2A"} opacity={alarm ? 0.6 + 0.4 * al : 1} />{alarm && <circle cx={0} cy={-14} r={180} fill="#FF3B2F" opacity={0.25 * al} />}</g>
        {/* iki el butonu */}
        <g transform="translate(0,800)"><rect x={-300} y={-20} width={600} height={70} rx={14} fill="#2A2E36" />{[-200, 200].map((x) => <g key={x}><circle cx={x} cy={14} r={34} fill="#2B7FD8" /><circle cx={x} cy={8} r={26} fill="#4A9AEE" /></g>)}<rect x={-30} y={-6} width={60} height={44} rx={8} fill="#E5322D" /></g>
        {/* uzanan el */}
        {hand > 0 && <g transform={`translate(${lp(700, 60, hand)},${lp(760, 600, hand)}) rotate(${lp(-10, -30, hand)})`}><rect x={30} y={-50} width={520} height={110} rx={46} fill={NAVY} /><path d="M-60,-46 Q30,-64 60,-28 Q76,0 60,28 Q30,58 -60,46Z" fill="#7C8794" /><path d="M-60,-46 Q-110,-30 -110,0 Q-110,30 -60,46Z" fill="#6B7684" /></g>}
      </g>
      {alarm && <rect width={1920} height={1080} fill="#FF2A1F" opacity={0.12 * al} />}
    </g>
  );
};

// ───────── duyuru panosu (mantar), kâğıt raptiyeli
export const Pano: React.FC<{ t: number; k?: number; head?: string; lines?: string[]; hi?: boolean }> = ({ k = 1, head = "DUYURU", lines = [], hi }) => (
  <g>
    <rect width={1920} height={1080} fill="#4A525C" />
    <rect x={260} y={80} width={1400} height={920} rx={20} fill="#B88A5A" stroke="#6E4528" strokeWidth={26} />
    {Array.from({ length: 70 }, (_, i) => <circle key={i} cx={300 + hash(i) * 1320} cy={120 + hash(i + 40) * 840} r={2 + hash(i + 3) * 3} fill="#8A6236" opacity={0.6} />)}
    <g transform="translate(360,180) rotate(-3)"><rect width={300} height={200} fill="#FFF7B0" />{HW(150, 80, "Servis saatleri", 36)}{HW(150, 140, "06:00 · 14:00 · 22:00", 30)}</g>
    <g transform="translate(1300,220) rotate(4)"><rect width={260} height={180} fill="#C8E6FF" />{HW(130, 80, "Kan bağışı", 36)}{HW(130, 130, "Perşembe", 30)}</g>
    <g transform={`translate(960,${560 + (1 - k) * 80}) rotate(-1.5)`} opacity={k}>
      <rect x={-460} y={-300} width={920} height={600} fill="#FFF" style={{ filter: "drop-shadow(0 12px 18px rgba(0,0,0,.35))" }} />
      <circle cx={0} cy={-270} r={16} fill="#E5322D" />
      {T(0, -190, head, 64, "#111", 700, "middle")}<rect x={-380} y={-160} width={760} height={6} fill="#111" />
      {lines.map((s, i) => <g key={i}>{T(0, -80 + i * 66, s, 42, hi && i === 1 ? "#C0392B" : "#222", hi && i === 1 ? 700 : 600, "middle")}</g>)}
      {T(380, 260, "İnsan Kaynakları", 28, "#666", 600, "end")}
    </g>
  </g>
);

// ───────── bordro (maaş pusulası)
export const Bordro: React.FC<{ k?: number; rows: [string, string][]; net: string; hi?: number }> = ({ k = 1, rows, net, hi = -1 }) => (
  <g transform={`translate(960,${560 + (1 - k) * 60})`} opacity={k}>
    <rect x={-520} y={-440} width={1040} height={880} rx={14} fill="#FBFAF6" style={{ filter: "drop-shadow(0 20px 30px rgba(0,0,0,.4))" }} />
    <rect x={-520} y={-440} width={1040} height={110} rx={14} fill={NAVY} />{T(0, -370, "ÜCRET BORDROSU · KASIM 2026", 44, "#FFF", 700, "middle")}
    {T(-460, -270, "ANADOLU OTO PARÇA SAN. A.Ş.  ·  Sicil 4718", 28, "#666", 600)}
    {rows.map(([a, b], i) => <g key={i} opacity={i === hi ? 1 : 0.9}>{i === hi && <rect x={-480} y={-230 + i * 80} width={960} height={66} rx={8} fill="#FFF2B0" />}{T(-450, -185 + i * 80, a, 36, "#333", 600)}{T(450, -185 + i * 80, b, 38, "#111", 700, "end")}<line x1={-460} x2={460} y1={-162 + i * 80} y2={-162 + i * 80} stroke="#DDD" strokeWidth={2} /></g>)}
    <rect x={-480} y={250} width={960} height={140} rx={14} fill="#E8F4EC" stroke="#2BB673" strokeWidth={5} />
    {T(-440, 340, "NET ÖDENEN", 44, "#1E7A4A", 700)}{T(440, 344, net, 66, "#1E7A4A", 700, "end")}
  </g>
);

// ───────── iş ayakkabısı (burnu çelik, kesit)
export const IsAyakkabi: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={110} rx={340} ry={30} fill="#000" opacity={0.3} />
    <path d="M-300,100 L-300,-120 Q-300,-170 -240,-170 L-60,-170 Q20,-60 180,-40 Q300,-20 310,60 L310,100Z" fill="#2A2A2A" />
    <path d="M-300,100 L310,100 L310,70 L-300,70Z" fill="#F6C21C" />
    <path d="M150,-40 Q300,-20 310,60 L150,60Z" fill="#8C96A3" opacity={0.85} />
    {[-220, -170, -120].map((xx) => <line key={xx} x1={xx} y1={-150} x2={xx + 80} y2={-150} stroke="#AAA" strokeWidth={8} />)}
    {T(230, 30, "S3", 30, "#FFF", 700, "middle")}
  </g>
);

// ───────── kapı iç sacı (arabanın kapısının içindeki parça)
export const KapiSac: React.FC<{ x: number; y: number; s?: number; k?: number }> = ({ x, y, s = 1, k = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`} opacity={k}>
    <path d="M-420,240 L-460,-120 Q-440,-240 -280,-260 L320,-260 Q440,-240 460,-100 L420,240Z" fill="#B8C0CA" stroke="#8C96A3" strokeWidth={8} />
    <path d="M-360,-220 L300,-220 Q380,-200 390,-120 L-380,-120Z" fill="#9AA4AE" />
    {[[-250, 40, 120], [60, 60, 90], [260, -10, 60]].map(([cx, cy, r], i) => <circle key={i} cx={cx} cy={cy} r={r} fill="#8C96A3" stroke="#7A8592" strokeWidth={6} />)}
    {Array.from({ length: 8 }, (_, i) => <circle key={i} cx={-380 + i * 110} cy={200} r={10} fill="#6E7884" />)}
  </g>
);

// ───────── eski apartman odası (Gebze, 2+1): elektrikli ısıtıcı, perde, pencerede fabrika ışıkları
export const EvGebze: React.FC<{ t: number; night?: boolean; px?: number; people?: React.ReactNode; heater?: boolean; morning?: boolean }> = ({ t, night = true, px = 0, people, heater = true, morning }) => (
  <g>
    <rect width={1920} height={1080} fill="#3A3128" />
    <g transform={`translate(${px},0)`}>
      <rect x={-200} y={0} width={2400} height={760} fill={morning ? "#CDBFA8" : "#8F7F68"} />
      {Array.from({ length: 30 }, (_, i) => <rect key={i} x={-200 + i * 80} y={0} width={40} height={760} fill="#000" opacity={0.03} />)}
      {/* pencere */}
      <g transform="translate(1180,130)">
        <rect x={0} y={0} width={520} height={380} fill={morning ? "#FFE3A8" : "#0B1020"} />
        {!morning && <g><rect x={20} y={240} width={480} height={140} fill="#1A2238" />{Array.from({ length: 10 }, (_, i) => <rect key={i} x={40 + i * 46} y={270} width={26} height={16} fill="#FFD98A" opacity={0.5 + 0.4 * Math.sin(t + i)} />)}<rect x={380} y={120} width={22} height={120} fill="#2A2F42" />{Array.from({ length: 4 }, (_, i) => { const k = (t * 0.2 + i / 4) % 1; return <circle key={i} cx={391 - k * 60} cy={110 - k * 90} r={10 + k * 30} fill="#8A90A4" opacity={0.3 * (1 - k)} />; })}</g>}
        {morning && <circle cx={380} cy={120} r={70} fill="#FFF3C8" />}
        <rect x={-16} y={-16} width={552} height={412} fill="none" stroke="#E8E2D2" strokeWidth={22} /><line x1={260} y1={0} x2={260} y2={380} stroke="#E8E2D2" strokeWidth={12} />
        <path d={`M-60,-40 Q${40 + Math.sin(t) * 6},200 -40,440 L-80,440 L-80,-40Z`} fill="#B04A4A" opacity={0.9} /><path d={`M580,-40 Q${480 + Math.sin(t + 1) * 6},200 560,440 L600,440 L600,-40Z`} fill="#B04A4A" opacity={0.9} />
      </g>
      {/* halı + kanepe + sehpa */}
      <rect x={-200} y={760} width={2400} height={360} fill="#6A5038" />
      <ellipse cx={760} cy={900} rx={560} ry={90} fill="#8E3B3B" opacity={0.8} />
      <g transform="translate(400,840)"><rect x={-300} y={-200} width={600} height={180} rx={40} fill="#6B7A55" /><rect x={-330} y={-120} width={660} height={140} rx={40} fill="#7E8E66" /></g>
      <g transform="translate(900,900)"><rect x={-160} y={-60} width={320} height={30} rx={8} fill="#6E4528" /><rect x={-140} y={-30} width={20} height={60} fill="#6E4528" /><rect x={120} y={-30} width={20} height={60} fill="#6E4528" /></g>
      {/* elektrikli ısıtıcı */}
      {heater && <g transform="translate(1100,960)"><rect x={-110} y={-200} width={220} height={200} rx={16} fill="#DDD" /><rect x={-90} y={-180} width={180} height={150} rx={8} fill="#2A1A10" />{[0, 1, 2].map((i) => <rect key={i} x={-80} y={-170 + i * 46} width={160} height={16} rx={8} fill="#FF6A1A" opacity={0.7 + 0.3 * Math.sin(t * 5 + i)} />)}<circle cx={0} cy={-100} r={260} fill="#FF8A3A" opacity={0.08} /></g>}
      {people}
    </g>
    <line x1={760} y1={0} x2={760} y2={110} stroke="#111" strokeWidth={4} />
    <circle cx={760} cy={130} r={26} fill="#FFE9A8" /><circle cx={760} cy={130} r={360} fill="url(#hLamp)" opacity={night ? 0.8 : 0.3} />
  </g>
);

// ───────── köy evi içi: soba (kızaran), çaydanlık, pencerede kar
export const KoySoba: React.FC<{ t: number; fire?: number; snow?: boolean; empty?: boolean; people?: React.ReactNode }> = ({ t, fire = 1, snow = true, empty, people }) => (
  <g>
    <rect width={1920} height={1080} fill="#4A3A2A" />
    <rect width={1920} height={720} fill="#E6D8BE" />
    <rect y={720} width={1920} height={360} fill="#7A5A3A" />
    {/* pencere + kar */}
    <g transform="translate(1250,150)"><rect x={0} y={0} width={480} height={360} fill="#AFC3D6" />
      {snow && Array.from({ length: 40 }, (_, i) => { const y = ((hash(i) * 360 + t * (40 + hash(i + 1) * 40)) % 360); return <circle key={i} cx={hash(i + 5) * 480 + Math.sin(t + i) * 10} cy={y} r={3 + hash(i) * 4} fill="#FFF" />; })}
      <rect x={0} y={300} width={480} height={60} fill="#FFF" opacity={snow ? 0.9 : 0} />
      <rect x={-14} y={-14} width={508} height={388} fill="none" stroke="#6E4528" strokeWidth={24} /><line x1={240} y1={0} x2={240} y2={360} stroke="#6E4528" strokeWidth={12} /></g>
    {/* kilim + minder */}
    <rect x={100} y={600} width={900} height={120} fill="#8E2B2B" /><rect x={100} y={630} width={900} height={20} fill="#E2B04A" opacity={0.7} />
    {/* soba */}
    <g transform="translate(780,880)">
      <rect x={-34} y={-880} width={68} height={640} fill="#3A3A3A" /><rect x={-34} y={-880} width={500} height={60} fill="#3A3A3A" />
      <rect x={-200} y={-260} width={400} height={300} rx={30} fill={empty ? "#3A3A3D" : "#2D2D30"} />
      <rect x={-150} y={-180} width={300} height={140} rx={14} fill="#140C08" />
      {!empty && <><rect x={-144} y={-174} width={288} height={128} rx={12} fill="#FF7A2A" opacity={(0.4 + 0.3 * Math.sin(t * 9)) * fire} />
        {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${-110 + i * 44},-50 Q${-100 + i * 44 + Math.sin(t * 8 + i) * 10},-120 ${-88 + i * 44},-50`} fill="#FFB347" opacity={fire} />)}
        <rect x={-200} y={-260} width={400} height={300} rx={30} fill="#FF5A1A" opacity={0.18 * fire} />
        <circle cx={0} cy={-120} r={420} fill="#FF8A3A" opacity={0.08 * fire} /></>}
      {/* çaydanlık */}
      <g transform="translate(40,-270)"><path d="M-90,0 Q-100,-100 0,-110 Q100,-100 90,0Z" fill="#C0392B" /><path d="M-50,-110 Q-50,-170 0,-170 Q50,-170 50,-110Z" fill="#E74C3C" /><path d="M90,-50 L150,-100" stroke="#C0392B" strokeWidth={16} />
        {!empty && Array.from({ length: 5 }, (_, i) => { const k = ((t * 0.5 + i / 5) % 1); return <circle key={i} cx={150 + Math.sin(k * 7 + i) * 18} cy={-110 - k * 160} r={10 + k * 22} fill="#FFF" opacity={0.3 * (1 - k)} />; })}</g>
    </g>
    {people}
  </g>
);

// ───────── kömür çuvalları / kömürlük
export const Komur: React.FC<{ x: number; y: number; s?: number; n?: number; empty?: boolean }> = ({ x, y, s = 1, n = 4, empty }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {empty ? <g><rect x={-300} y={-260} width={600} height={260} fill="#3A2E24" /><rect x={-300} y={-280} width={600} height={30} fill="#5A4636" />{Array.from({ length: 8 }, (_, i) => <circle key={i} cx={-200 + hash(i) * 400} cy={-20 - hash(i + 2) * 30} r={10 + hash(i) * 8} fill="#151515" />)}{T(0, -120, "BOŞ", 70, "#E8E2D2", 700, "middle")}</g>
      : Array.from({ length: n }, (_, i) => <g key={i} transform={`translate(${(i % 2) * 220 - 110 + (i > 1 ? 110 : 0)},${-Math.floor(i / 2) * 170})`}><path d="M-110,0 Q-130,-150 -90,-190 L90,-190 Q130,-150 110,0Z" fill="#D8CDB0" stroke="#A8987A" strokeWidth={5} /><path d="M-60,-190 Q0,-230 60,-190" stroke="#A8987A" strokeWidth={8} fill="none" />{T(0, -80, "KÖMÜR", 30, "#222", 700, "middle")}{T(0, -44, "25 kg", 22, "#555", 600, "middle")}</g>)}
  </g>
);

// ───────── iki el butonu yakın (pres), parmaklar basar
export const IkiEl: React.FC<{ t: number; press?: number }> = ({ t, press = 0 }) => (
  <g>
    <rect width={1920} height={1080} fill="#1A1E27" />
    <rect x={260} y={560} width={1400} height={300} rx={40} fill="#2A2E36" />
    {[560, 1360].map((x) => <g key={x}><circle cx={x} cy={700} r={120} fill="#1E5FA8" /><circle cx={x} cy={690 + press * 14} r={96} fill="#3E8AE0" /><g transform={`translate(${x},${lp(420, 600, press)})`}><rect x={-80} y={-500} width={160} height={460} rx={60} fill={NAVY} /><ellipse cx={0} cy={-20} rx={80} ry={90} fill="#7C8794" /></g></g>)}
    <rect x={900} y={650} width={120} height={100} rx={18} fill="#E5322D" />{T(960, 720, "STOP", 36, "#FFF", 700, "middle")}
    {T(960, 980, `GÜMM  ·  ${Math.floor(t / 10) + 1}. parça`, 40, "#8C96A3", 700, "middle")}
  </g>
);
