import React from "react";
import { H, Look, Person, HArms, HMouth, HBrow, cl, lp, rp, fmt } from "./Hayat";
import { hash } from "./Motion";

// Kanal 4 kiti · İstanbul taksi dünyası (2026-11-14, k6-07).
// Sarı taksi (yan / ön cam / içeriden), taksimetre, durak ve kulübe (soba, demlik), nazar boncuğu (çatlayabilir),
// E-5 gece yolu (turuncu lambalar, şerit kayması, kamyon farı), otogaz pompası, dolmuş, para tomarı, zarflar,
// metrobüs, kiralık oda, yağmur. Hepsi vektör ve t'ye bağlı; sonraki meslek videolarında da kullanılır.

const UI = "Poppins";
const T = (x: number, y: number, s: string, size = 24, c = "#FFF", w = 600, a: "start" | "middle" | "end" = "start") => <text x={x} y={y} fontFamily={UI} fontWeight={w} fontSize={size} fill={c} textAnchor={a}>{s}</text>;

// ───────── karakterler
export const SEN27: Look = { hairStyle: "fade", top: "#2E3B4E", top2: "#222C3B", kind: "jacket", beard: 0.6 };
export const RIZA: Look = { hairStyle: "short", hair: "#A3A3A3", top: "#5E626B", top2: "#4A4D55", kind: "jacket", mustache: true, skin: "#D9A47E" };
export const KEMAL: Look = { hairStyle: "bald", hair: "#C9C9C9", top: "#5A4636", top2: "#463628", kind: "cardigan", mustache: true, beard: 0.5, glasses: true, skin: "#D29A72" };
export const EMRE: Look = { hairStyle: "curly", top: "#B5442E", top2: "#93361F", kind: "hoodie", beard: 0.3 };
export const TAKIM: Look = { hairStyle: "short", top: "#262B35", top2: "#1A1E26", kind: "shirt" };
export const GENC: Look = { hairStyle: "curly", hair: "#3A2418", top: "#6F8A3E", top2: "#58702F", kind: "tshirt" };
export const KAPORTACI: Look = { hairStyle: "buzz", top: "#2F4A6B", top2: "#253B56", kind: "uniform", beard: 0.5 };

export const YEL = "#F6C21C", YEL2 = "#D8A410", YEL3 = "#FFE27A";

// ───────── yağmur (camda damla + çizgi)
export const Rain: React.FC<{ t: number; k?: number; glass?: boolean }> = ({ t, k = 1, glass }) => (
  <g opacity={k} pointerEvents="none">
    {Array.from({ length: 90 }, (_, i) => { const x = (hash(i) * 2100 - 90 + t * 120) % 2000; const y = ((hash(i + 7) * 1200 + t * (900 + hash(i + 3) * 500)) % 1250) - 100; return <line key={i} x1={x} y1={y} x2={x - 10} y2={y + 46} stroke="#CFE3FF" strokeWidth={2} opacity={0.35} />; })}
    {glass && Array.from({ length: 40 }, (_, i) => { const x = hash(i + 50) * 1920; const y = ((hash(i + 90) * 1080 + t * hash(i + 20) * 40) % 1100); return <ellipse key={i} cx={x} cy={y} rx={5 + hash(i) * 7} ry={7 + hash(i) * 9} fill="#E8F2FF" opacity={0.22} />; })}
  </g>
);

// ───────── İstanbul silüeti (plaza, cami, köprü)
export const Skyline: React.FC<{ t: number; mode?: "day" | "dusk" | "night" | "rain"; y?: number; px?: number }> = ({ t, mode = "day", y = 620, px = 0 }) => {
  const sky = mode === "day" ? ["#9FD0F2", "#E8F3FB"] : mode === "dusk" ? ["#3A4A7A", "#F2A65E"] : mode === "rain" ? ["#5D6773", "#9AA4AE"] : ["#060914", "#1B2340"];
  const b = mode === "night" ? "#10162A" : mode === "dusk" ? "#2B2F4A" : mode === "rain" ? "#4A535E" : "#6E86A0";
  const id = `sky${mode}`;
  return (
    <g>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor={sky[0]} /><stop offset="1" stopColor={sky[1]} /></linearGradient></defs>
      <rect width={1920} height={1080} fill={`url(#${id})`} />
      {mode === "night" && Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 263) % 1920} cy={(i * 71) % 380} r={1.5} fill="#FFF" opacity={0.5} />)}
      <g transform={`translate(${px},0)`}>
        {/* köprü */}
        <path d={`M-200,${y - 40} Q300,${y - 150} 800,${y - 40}`} stroke={b} strokeWidth={6} fill="none" opacity={0.7} />
        {[40, 560].map((xx) => <rect key={xx} x={xx} y={y - 230} width={16} height={200} fill={b} opacity={0.7} />)}
        {/* cami */}
        <g transform={`translate(1260,${y})`} fill={b}>
          <path d="M-160,0 L-160,-60 Q0,-210 160,-60 L160,0Z" /><circle cx={0} cy={-150} r={14} />
          {[-230, 230].map((xx) => <g key={xx}><rect x={xx - 9} y={-300} width={18} height={300} /><path d={`M${xx - 12},-300 L${xx},-350 L${xx + 12},-300Z`} /></g>)}
        </g>
        {/* plazalar */}
        {[[860, 300, 90], [960, 380, 70], [1040, 260, 80], [1600, 340, 100], [1720, 420, 70], [1820, 280, 90], [120, 200, 120], [-40, 260, 90]].map(([x, h, w], i) => (
          <g key={i}><rect x={x} y={y - h} width={w} height={h + 400} fill={b} />
            {Array.from({ length: Math.floor(h / 40) * 3 }, (_, j) => <rect key={j} x={x + 10 + (j % 3) * (w / 3.4)} y={y - h + 16 + Math.floor(j / 3) * 40} width={w / 5} height={14} fill={mode === "night" || mode === "dusk" ? "#FFD27A" : "#BFD7EA"} opacity={hash(i * 50 + j) > 0.45 ? 0.75 : 0.12} />)}
          </g>
        ))}
      </g>
    </g>
  );
};

// ───────── nazar boncuğu (çatlayabilir), anahtarlıkta sallanır
export const Nazar: React.FC<{ x: number; y: number; s?: number; t: number; crack?: number; swing?: number; ring?: boolean }> = ({ x, y, s = 1, t, crack = 0, swing = 1, ring = true }) => {
  const a = Math.sin(t * 2.2) * 12 * swing;
  return (
    <g transform={`translate(${x},${y}) scale(${s}) rotate(${a})`}>
      <line x1={0} y1={0} x2={0} y2={90} stroke="#C9A64A" strokeWidth={4} />
      {ring && <g transform="translate(-6,40) rotate(-20)"><rect x={-10} y={0} width={20} height={70} rx={4} fill="#B9B9B9" /><circle cx={0} cy={0} r={18} fill="#9A9A9A" /><circle cx={0} cy={0} r={7} fill="#333" /></g>}
      <g transform="translate(0,140)">
        <circle r={52} fill="#123E9A" /><circle r={52} fill="none" stroke="#0A2A6E" strokeWidth={4} />
        <circle r={36} fill="#FFFFFF" /><circle r={22} fill="#5FB4F0" /><circle r={11} fill="#0B0B0B" />
        <ellipse cx={-18} cy={-22} rx={12} ry={7} fill="#FFF" opacity={0.6} transform="rotate(-30)" />
        {crack > 0 && <path d={`M-6,-52 L4,-26 L-8,-6 L10,14 L-2,34 L6,52`} stroke="#0A0A0A" strokeWidth={4} fill="none" strokeDasharray={220} strokeDashoffset={220 * (1 - cl(crack))} strokeLinecap="round" />}
      </g>
    </g>
  );
};

// ───────── taksimetre
export const Taksimetre: React.FC<{ x: number; y: number; s?: number; v: number; on?: boolean; t?: number }> = ({ x, y, s = 1, v, on = true, t = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-210} y={-80} width={420} height={160} rx={18} fill="#1A1A1D" stroke="#3A3A40" strokeWidth={4} />
    <rect x={-185} y={-58} width={300} height={100} rx={8} fill={on ? "#1B0606" : "#0B0B0B"} />
    {on && <text x={100} y={18} fontFamily="'Courier New', monospace" fontWeight={700} fontSize={70} fill="#FF3B2F" textAnchor="end" style={{ filter: "drop-shadow(0 0 8px #FF3B2F)" }}>{v.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</text>}
    {T(150, 0, "TL", 30, "#AAA", 700, "middle")}
    <circle cx={150} cy={40} r={12} fill={on ? (Math.sin(t * 4) > 0 ? "#2BB673" : "#1B6B45") : "#333"} />
    {T(-185, 66, "TAKSİMETRE", 18, "#777", 700)}
  </g>
);

// ───────── para: tek banknot, tomar, bozuk para
export const Banknot: React.FC<{ x: number; y: number; s?: number; rot?: number; c?: string; v?: string }> = ({ x, y, s = 1, rot = 0, c = "#C46BA0", v = "200" }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-120} y={-56} width={240} height={112} rx={8} fill={c} stroke="#0003" strokeWidth={3} />
    <rect x={-104} y={-42} width={208} height={84} rx={6} fill="none" stroke="#FFF" strokeOpacity={0.5} strokeWidth={3} />
    <circle cx={-50} cy={0} r={26} fill="#FFF" opacity={0.35} />
    {T(70, 18, v, 44, "#FFF", 700, "middle")}
  </g>
);
export const Tomar: React.FC<{ x: number; y: number; s?: number; rot?: number; n?: number }> = ({ x, y, s = 1, rot = 0, n = 8 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    {Array.from({ length: n }, (_, i) => <Banknot key={i} x={(hash(i) - 0.5) * 10} y={-i * 6} c={i % 3 === 0 ? "#3E8E5E" : "#C46BA0"} v={i % 3 === 0 ? "100" : "200"} />)}
    <rect x={-20} y={-n * 6 - 60} width={40} height={n * 6 + 120} fill="#E9D7A8" opacity={0.85} />
  </g>
);
export const Bozuk: React.FC<{ x: number; y: number; s?: number; n?: number }> = ({ x, y, s = 1, n = 3 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    {Array.from({ length: n }, (_, i) => <g key={i} transform={`translate(${(i - (n - 1) / 2) * 70},${i % 2 ? -8 : 6})`}><circle r={30} fill="#D9B44A" stroke="#A8862A" strokeWidth={4} /><circle r={20} fill="none" stroke="#A8862A" strokeWidth={2} />{T(0, 9, "1", 24, "#7A5E18", 700, "middle")}</g>)}
  </g>
);

// ───────── el (yakın çekim: para uzatma / alma)
export const Hand: React.FC<{ x: number; y: number; s?: number; rot?: number; sleeve?: string; skin?: string; open?: boolean }> = ({ x, y, s = 1, rot = 0, sleeve = "#2E3B4E", skin = H.skin, open = true }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-400} y={-70} width={330} height={140} rx={50} fill={sleeve} />
    <rect x={-90} y={-58} width={40} height={116} rx={16} fill={sleeve} opacity={0.7} />
    <path d="M-70,-50 Q40,-70 90,-30 Q110,0 90,30 Q40,62 -70,50Z" fill={skin} />
    {open ? [-34, -12, 10, 32].map((yy, i) => <rect key={i} x={70} y={yy - 10} width={70 - i * 6} height={22} rx={11} fill={skin} />) : <ellipse cx={86} cy={0} rx={40} ry={44} fill={skin} />}
    <path d="M-20,-50 Q20,-100 60,-80 Q70,-60 30,-40Z" fill={skin} />
  </g>
);
export const GoldWatch: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-50} y={-90} width={100} height={180} rx={20} fill="url(#hGold)" />
    <circle r={62} fill="url(#hGold)" /><circle r={50} fill="#F8F1DC" />
    {Array.from({ length: 12 }, (_, i) => { const a = (i / 12) * Math.PI * 2; return <line key={i} x1={Math.cos(a) * 40} y1={Math.sin(a) * 40} x2={Math.cos(a) * 46} y2={Math.sin(a) * 46} stroke="#6B5520" strokeWidth={3} />; })}
    <line x1={0} y1={0} x2={0} y2={-34} stroke="#222" strokeWidth={4} transform={`rotate(${t * 6})`} />
    <line x1={0} y1={0} x2={22} y2={0} stroke="#222" strokeWidth={5} transform="rotate(-60)" />
    <path d="M-40,-40 L-10,-50 L-40,-10Z" fill="#FFF" opacity={0.4} />
  </g>
);

// ───────── sarı taksi (yandan). x = merkez, y = yer
export const Taksi: React.FC<{ x: number; y: number; s?: number; t: number; speed?: number; dir?: 1 | -1; scratch?: number; driver?: Look; night?: boolean; door?: string; wet?: boolean }> = ({ x, y, s = 1, t, speed = 0, dir = 1, scratch = 0, driver, night, door = "MECİDİYEKÖY TAKSİ", wet }) => {
  const bob = speed ? Math.sin(t * 14) * 2 : 0;
  const wheel = (cx: number) => <g transform={`translate(${cx},-58)`}><circle r={62} fill="#151515" /><circle r={36} fill="#9AA0A6" /><g transform={`rotate(${t * speed * 400})`}>{[0, 72, 144, 216, 288].map((a) => <rect key={a} x={-4} y={-34} width={8} height={30} fill="#5A5F66" transform={`rotate(${a})`} />)}</g><circle r={10} fill="#333" /></g>;
  return (
    <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
      <ellipse cx={0} cy={4} rx={470} ry={22} fill="#000" opacity={0.35} />
      {wet && <ellipse cx={0} cy={20} rx={480} ry={30} fill={YEL} opacity={0.12} />}
      <g transform={`translate(0,${bob})`}>
        <path d="M-440,-70 L-440,-150 Q-430,-190 -360,-196 L-230,-200 L-150,-300 Q-130,-318 -90,-318 L170,-318 Q210,-318 240,-290 L330,-200 L420,-186 Q450,-178 450,-140 L450,-70Z" fill={YEL} />
        <path d="M-440,-110 L450,-110 L450,-70 L-440,-70Z" fill={YEL2} />
        <path d="M-130,-296 L-210,-206 L40,-206 L40,-296Z M60,-296 L60,-206 L300,-206 L220,-290 Q206,-296 190,-296Z" fill={night ? "#0E1622" : "#2B3D52"} />
        <path d="M-120,-290 L-80,-290 L-160,-210 L-196,-210Z" fill="#FFF" opacity={0.18} />
        {driver && <g><clipPath id="txw"><path d="M-130,-296 L-210,-206 L40,-206 L40,-296Z" /></clipPath><g clipPath="url(#txw)"><g transform="translate(-60,-60) scale(0.42)"><Person x={0} y={0} t={t} o={driver} arms="desk" mouth="flat" /></g></g></g>}
        <line x1={50} y1={-296} x2={50} y2={-80} stroke={YEL2} strokeWidth={4} />
        <line x1={-210} y1={-200} x2={-210} y2={-80} stroke={YEL2} strokeWidth={4} />
        <rect x={-30} y={-170} width={50} height={10} rx={5} fill="#3A3A3A" /><rect x={240} y={-170} width={50} height={10} rx={5} fill="#3A3A3A" />
        {/* tepe lambası */}
        <rect x={-70} y={-362} width={160} height={46} rx={10} fill={night ? "#FFF6C8" : "#FFF"} stroke="#222" strokeWidth={4} />
        {T(10, -329, "TAKSİ", 32, "#111", 700, "middle")}
        {night && <ellipse cx={10} cy={-340} rx={120} ry={50} fill="#FFF6C8" opacity={0.25} />}
        <text x={-170} y={-128} fontFamily={UI} fontWeight={700} fontSize={26} fill="#111" transform={dir < 0 ? "scale(-1,1) translate(340,0)" : undefined}>{door}</text>
        {/* farlar */}
        <rect x={420} y={-176} width={30} height={34} rx={8} fill={night ? "#FFF8D0" : "#FFF"} /><rect x={-440} y={-176} width={18} height={34} rx={6} fill="#C0392B" />
        {night && <path d="M450,-170 L900,-260 L900,-60Z" fill="#FFF8D0" opacity={0.15} />}
        {scratch > 0 && <g stroke="#6A6A6A" strokeWidth={4} strokeLinecap="round">{[0, 1, 2, 3].map((i) => <line key={i} x1={-400} y1={-150 + i * 9} x2={lp(-400, -230, cl(scratch * 1.2 - i * 0.05))} y2={-160 + i * 11} />)}</g>}
        {wheel(-280)}{wheel(290)}
      </g>
    </g>
  );
};

// ───────── dolmuş (yandan)
export const Dolmus: React.FC<{ x: number; y: number; s?: number; t: number; speed?: number; dir?: 1 | -1 }> = ({ x, y, s = 1, t, speed = 0, dir = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s * dir},${s})`}>
    <ellipse cx={0} cy={4} rx={560} ry={22} fill="#000" opacity={0.35} />
    <path d="M-540,-70 L-540,-360 Q-540,-400 -500,-400 L380,-400 Q440,-400 480,-330 L550,-200 L550,-70Z" fill="#F2D24A" />
    <rect x={-540} y={-200} width={1090} height={36} fill="#1E1E1E" />
    {[-480, -300, -120, 60, 240].map((xx) => <rect key={xx} x={xx} y={-360} width={150} height={120} rx={10} fill="#2B3D52" />)}
    <path d="M400,-360 L470,-250 L400,-250Z" fill="#2B3D52" />
    {T(-300, -172, "TAKSİM - OKMEYDANI", 26, "#F2D24A", 700)}
    {[-360, 360].map((cx) => <g key={cx} transform={`translate(${cx},-58)`}><circle r={64} fill="#151515" /><circle r={34} fill="#9AA0A6" /><g transform={`rotate(${t * speed * 400})`}><rect x={-4} y={-32} width={8} height={28} fill="#555" /><rect x={-4} y={4} width={8} height={28} fill="#555" /></g></g>)}
  </g>
);

// ───────── ön camdan şoför (dışarıdan bakış). Sen direksiyonda, ayna + nazar, arka koltukta yolcu
export const Windshield: React.FC<{ t: number; o: Look; mouth?: HMouth; brow?: HBrow; eyes?: "open" | "wide" | "closed" | "half"; arms?: HArms; talk?: boolean; look?: number; lookY?: number; night?: boolean; rain?: boolean; crack?: number; back?: Look; backEyes?: "open" | "closed"; backTalk?: boolean; backArms?: HArms; slump?: number; tilt?: number; lamps?: boolean }> = (p) => {
  const { t, night, rain } = p;
  const lampY = p.lamps ? ((t * 1.3) % 1) : -1;
  return (
    <g>
      <rect width={1920} height={1080} fill={night ? "#07090F" : rain ? "#56606B" : "#9CB4C8"} />
      {/* iç */}
      <rect x={250} y={120} width={1420} height={760} fill={night ? "#11141B" : "#2A2E35"} />
      <rect x={520} y={160} width={880} height={250} rx={30} fill={night ? "#0A0D14" : "#7C93A8"} opacity={0.9} />
      {p.back && <g opacity={0.92}><Person x={1260} y={960} s={0.62} t={t} o={p.back} arms={p.backArms ?? "down"} eyes={p.backEyes ?? "open"} talk={p.backTalk} mouth={p.backTalk ? "open" : "flat"} lit={0.7} seed={3} look={-0.4} /></g>}
      {/* koltuk */}
      <rect x={720} y={300} width={360} height={560} rx={70} fill={night ? "#1A1C22" : "#2F3238"} />
      <Person x={880} y={1060} s={0.98} t={t} o={p.o} arms={p.arms ?? "desk"} mouth={p.mouth} brow={p.brow} eyes={p.eyes} talk={p.talk} look={p.look ?? 0} lookY={p.lookY ?? 0} slump={p.slump} tilt={p.tilt} lit={night ? 0.8 : 1} />
      {/* direksiyon */}
      <g transform="translate(860,860)"><ellipse rx={250} ry={70} fill="none" stroke="#1A1A1A" strokeWidth={30} /><rect x={-50} y={-10} width={100} height={60} rx={14} fill="#1A1A1A" /></g>
      {/* ayna + nazar */}
      <rect x={880} y={120} width={240} height={70} rx={20} fill="#1D1F24" /><rect x={892} y={130} width={216} height={50} rx={14} fill={night ? "#1C2333" : "#8BA2B6"} />
      <Nazar x={1000} y={185} s={0.9} t={t} crack={p.crack} ring={false} />
      {/* cam kenarı (A sütunları) ve kaput */}
      <path d="M0,0 L1920,0 L1920,1080 L1700,1080 L1580,110 L340,110 L220,1080 L0,1080Z" fill={YEL} />
      <path d="M0,0 L1920,0 L1920,110 L0,110Z" fill={YEL2} />
      <path d="M200,880 Q960,840 1720,880 L1920,1080 L0,1080Z" fill={YEL} /><path d="M200,880 Q960,840 1720,880 L1720,900 Q960,862 200,900Z" fill="#B88A0C" />
      {/* cam yansıması */}
      <path d="M420,130 L700,130 L420,700Z" fill="#FFF" opacity={night ? 0.04 : 0.1} />
      {lampY >= 0 && <rect x={340} y={110} width={1240} height={770} fill="#FF9A3C" opacity={0.18 * Math.sin(lampY * Math.PI)} />}
      {rain && <Rain t={t} glass />}
    </g>
  );
};

// ───────── içeriden yol bakışı (şoför arkasından): yol + gösterge + taksimetre + ayna
export type RoadKind = "city" | "e5" | "rain" | "traffic" | "dawn";
export const CabPOV: React.FC<{ t: number; road?: RoadKind; meter?: number; meterOn?: boolean; crack?: number; drift?: number; truck?: number; speed?: number; head?: boolean; radio?: string; lids?: number }> = ({ t, road = "city", meter = 0, meterOn = true, crack = 0, drift = 0, truck = 0, speed = 1, head = true, radio, lids = 0 }) => {
  const night = road === "e5";
  const dx = drift * 380;
  return (
    <g>
      {/* dış dünya */}
      <g transform={`translate(${dx},0)`}>
        {road === "e5" ? <rect width={2400} height={1080} x={-240} fill="#05070D" /> : <Skyline t={t} mode={road === "rain" ? "rain" : road === "dawn" ? "dusk" : "day"} y={560} />}
        <path d="M-300,560 L2220,560 L2220,1080 L-300,1080Z" fill={night ? "#0D1018" : road === "rain" ? "#3E464F" : "#5C636B"} />
        <path d="M700,560 L1220,560 L2000,1080 L-80,1080Z" fill={night ? "#1A1D24" : "#4A5058"} />
        {[-1, 0, 1].map((ln) => Array.from({ length: 6 }, (_, i) => { const k = ((t * 0.9 * speed + i / 6) % 1); const yy = 560 + k * k * 520; const w = 3 + k * 22; const xx = 960 + ln * (130 + k * 700); return ln === 0 ? null : <rect key={`${ln}${i}`} x={xx - w / 2} y={yy} width={w} height={8 + k * 60} fill="#F3E3A0" opacity={0.75} />; }))}
        {night && Array.from({ length: 6 }, (_, i) => { const k = ((t * 0.55 * speed + i / 6) % 1); const xx = lp(1180, 2200, k * k); const yy = lp(470, -200, k * k); return <g key={i}><rect x={xx} y={yy} width={6 + k * 20} height={120 + k * 600} fill="#2A2A33" /><circle cx={xx} cy={yy} r={10 + k * 40} fill="#FF9A3C" /><circle cx={xx} cy={yy} r={60 + k * 260} fill="#FF9A3C" opacity={0.12} /></g>; })}
        {night && <rect x={-300} y={0} width={2520} height={1080} fill="#FF8A2A" opacity={0.05 + 0.04 * Math.sin(t * 5)} />}
        {road === "traffic" && [[620, 640, 0.7], [1180, 650, 0.75], [900, 720, 1.05]].map(([xx, yy, ss], i) => <g key={i} transform={`translate(${xx},${yy}) scale(${ss})`}><rect x={-150} y={-110} width={300} height={130} rx={30} fill={["#B03A2E", "#EDEDED", "#2E4A6B"][i]} /><rect x={-120} y={-170} width={240} height={70} rx={20} fill="#1E2630" /><rect x={-140} y={-60} width={40} height={20} rx={6} fill="#FF3B2F" /><rect x={100} y={-60} width={40} height={20} rx={6} fill="#FF3B2F" /></g>)}
        {truck > 0 && <g opacity={cl(truck * 2)}><circle cx={-60 + 300 * (1 - truck)} cy={640} r={90 + truck * 160} fill="#FFF8D0" opacity={0.9} /><circle cx={-60 + 300 * (1 - truck)} cy={640} r={300 + truck * 500} fill="#FFF8D0" opacity={0.25} /></g>}
      </g>
      {road === "rain" && <Rain t={t} glass />}
      {/* tavan + gösterge paneli */}
      <path d="M0,0 L1920,0 L1920,90 Q960,130 0,90Z" fill="#141519" />
      <path d="M0,0 L180,0 L330,560 L0,800Z M1920,0 L1740,0 L1590,560 L1920,800Z" fill="#141519" />
      <path d="M0,780 Q960,690 1920,780 L1920,1080 L0,1080Z" fill="#1A1B20" />
      <rect x={760} y={800} width={400} height={90} rx={14} fill="#0E0F12" />
      {radio && <g><rect x={770} y={812} width={380} height={66} rx={10} fill="#0B1E14" /><svg x={770} y={812} width={380} height={66}><text x={380 - ((t * 120) % (radio.length * 26 + 380))} y={46} fontFamily={UI} fontWeight={600} fontSize={32} fill="#5CF08E">{radio}</text></svg></g>}
      <Taksimetre x={1460} y={800} s={0.9} v={meter} on={meterOn} t={t} />
      {/* ayna + nazar */}
      <rect x={840} y={70} width={260} height={74} rx={22} fill="#1D1F24" /><rect x={852} y={80} width={236} height={54} rx={16} fill={night ? "#121725" : "#7E95AA"} />
      <Nazar x={970} y={135} s={0.95} t={t} crack={crack} ring={false} />
      {/* direksiyon + şoför başı */}
      <g transform="translate(560,1010)"><ellipse rx={300} ry={110} fill="none" stroke="#0D0D10" strokeWidth={40} /></g>
      {head && <g transform="translate(560,760)"><ellipse cx={0} cy={60} rx={170} ry={120} fill="#222C3B" /><ellipse cx={0} cy={-60} rx={95} ry={110} fill={H.hair} /><ellipse cx={-92} cy={-40} rx={18} ry={30} fill={H.skin2} /></g>}
      {lids > 0 && <g><rect x={0} y={-1080 + lids * 560} width={1920} height={1080} fill="#000" /><rect x={0} y={1080 - lids * 560} width={1920} height={1080} fill="#000" /></g>}
    </g>
  );
};

// ───────── durak: dışarıdan (kulübe + sıra taksiler)
export const Durak: React.FC<{ t: number; px?: number; night?: boolean; dawn?: boolean; cars?: number; kulube?: boolean }> = ({ t, px = 0, night, dawn, cars = 3, kulube = true }) => (
  <g>
    <Skyline t={t} mode={night ? "night" : dawn ? "dusk" : "day"} y={600} px={px * 0.3} />
    <g transform={`translate(${px},0)`}>
      <rect x={-200} y={760} width={2400} height={400} fill={night ? "#15181F" : "#5A6068"} />
      <rect x={-200} y={740} width={2400} height={30} fill={night ? "#2A2D33" : "#9A9EA4"} />
      {kulube && <g transform="translate(420,760)">
        <rect x={-230} y={-420} width={460} height={420} fill="#E8E2D2" /><rect x={-250} y={-450} width={500} height={40} rx={8} fill="#2E3E5C" />
        <rect x={-190} y={-340} width={200} height={170} fill={night ? "#FFD98A" : "#BFD3E2"} opacity={night ? 0.85 : 1} /><rect x={60} y={-330} width={110} height={330} fill="#8A5A36" />
        <rect x={-300} y={-540} width={600} height={80} rx={10} fill={YEL} stroke="#111" strokeWidth={5} />
        {T(0, -486, "MECİDİYEKÖY TAKSİ", 40, "#111", 700, "middle")}
        <rect x={180} y={-560} width={18} height={140} fill="#555" />
        {Array.from({ length: 6 }, (_, i) => { const k = ((t * 0.4 + i / 6) % 1); return <circle key={i} cx={190 + Math.sin(k * 6 + i) * 20} cy={-570 - k * 200} r={14 + k * 30} fill="#DDD" opacity={0.35 * (1 - k)} />; })}
      </g>}
      {Array.from({ length: cars }, (_, i) => <Taksi key={i} x={1000 + i * 520} y={930} s={0.62} t={t} night={night} />)}
    </g>
  </g>
);

// ───────── kulübe içi: soba, demlik, sandalyeler, takvim
export const Kulube: React.FC<{ t: number; px?: number; night?: boolean; people?: React.ReactNode; fire?: number }> = ({ t, px = 0, night, people, fire = 1 }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#2A241D" : "#D9CDB4"} />
    <g transform={`translate(${px},0)`}>
      <rect x={-100} y={0} width={2200} height={720} fill={night ? "#3A3127" : "#E6DCC6"} />
      <rect x={-100} y={720} width={2200} height={400} fill={night ? "#2A2119" : "#8A6E4E"} />
      {/* pencere: dışarıda taksiler */}
      <g transform="translate(1180,170)"><rect x={0} y={0} width={560} height={330} fill={night ? "#0B1020" : "#BFD7EA"} /><g transform="translate(0,0)"><svg x={0} y={0} width={560} height={330} viewBox="400 520 1400 830"><Taksi x={900} y={1000} s={0.9} t={t} night={night} /><Taksi x={1500} y={1000} s={0.9} t={t} night={night} /></svg></g><rect x={-14} y={-14} width={588} height={358} fill="none" stroke="#6E4528" strokeWidth={28} /><line x1={280} y1={0} x2={280} y2={330} stroke="#6E4528" strokeWidth={14} /></g>
      {/* takvim + telefon */}
      <g transform="translate(260,180)"><rect x={0} y={0} width={180} height={230} fill="#FFF" /><rect x={0} y={0} width={180} height={56} fill={H.red} />{T(90, 40, "EKİM", 30, "#FFF", 700, "middle")}{T(90, 170, "2026", 44, "#333", 700, "middle")}</g>
      <g transform="translate(560,240)"><rect x={0} y={0} width={110} height={170} rx={14} fill="#C0392B" /><rect x={14} y={14} width={82} height={50} rx={8} fill="#222" />{Array.from({ length: 9 }, (_, i) => <circle key={i} cx={28 + (i % 3) * 27} cy={92 + Math.floor(i / 3) * 24} r={8} fill="#EEE" />)}</g>
      {/* soba + boru + demlik */}
      <g transform="translate(860,720)">
        <rect x={-90} y={-920} width={36} height={700} fill="#3A3A3A" />
        <rect x={-150} y={-260} width={300} height={260} rx={20} fill="#2D2D30" /><rect x={-110} y={-170} width={220} height={110} rx={10} fill="#140C08" />
        <rect x={-104} y={-164} width={208} height={98} rx={8} fill="#FF7A2A" opacity={0.35 + 0.35 * fire * (0.5 + 0.5 * Math.sin(t * 9))} />
        {Array.from({ length: 5 }, (_, i) => <path key={i} d={`M${-70 + i * 35},-70 Q${-60 + i * 35 + Math.sin(t * 8 + i) * 8},-120 ${-50 + i * 35},-70`} fill="#FFB347" opacity={fire} />)}
        <g transform="translate(40,-260)"><path d="M-70,0 Q-80,-80 0,-90 Q80,-80 70,0Z" fill="#B8B8BC" /><path d="M-40,-90 Q-40,-150 0,-150 Q40,-150 40,-90Z" fill="#D0D0D4" /><path d="M70,-40 L120,-80" stroke="#B8B8BC" strokeWidth={14} />
          {Array.from({ length: 5 }, (_, i) => { const k = ((t * 0.5 + i / 5) % 1); return <circle key={i} cx={10 + Math.sin(k * 7 + i) * 18} cy={-160 - k * 160} r={10 + k * 22} fill="#FFF" opacity={0.3 * (1 - k)} />; })}</g>
      </g>
      {people}
    </g>
    <rect width={1920} height={1080} fill="#FF9A3C" opacity={night ? 0.1 : 0.04} />
  </g>
);

// ───────── plaka (+ fiyat etiketi)
export const Plaka: React.FC<{ x: number; y: number; s?: number; txt?: string; price?: string; k?: number; c?: string }> = ({ x, y, s = 1, txt = "34 T 4721", price, k = 1, c = "#C0392B" }) => (
  <g transform={`translate(${x},${y}) scale(${s * (0.9 + 0.1 * k)})`} opacity={k}>
    <rect x={-330} y={-80} width={660} height={160} rx={16} fill="#FFF" stroke="#111" strokeWidth={8} />
    <rect x={-322} y={-72} width={70} height={144} rx={8} fill="#1F4BA8" />{T(-287, 48, "TR", 36, "#FFF", 700, "middle")}
    {T(40, 36, txt, 104, "#111", 700, "middle")}
    {price && <g transform="translate(240,-120) rotate(8)"><rect x={-170} y={-50} width={340} height={100} rx={14} fill={c} />{T(0, 20, price, 54, "#FFF", 700, "middle")}</g>}
  </g>
);

// ───────── otogaz pompası (fiyat atlar)
export const LpgPompa: React.FC<{ t: number; a: number; from?: string; to?: string; at?: number; total?: number; totalTo?: number }> = ({ t, a, from = "41,20", to = "50,70", at = 1.2, total, totalTo }) => {
  const sw = t > a + at;
  const flick = t > a + at && t < a + at + 0.4 ? (Math.sin(t * 80) > 0 ? 1 : 0.2) : 1;
  const tot = total !== undefined ? (totalTo !== undefined ? lp(total, totalTo, rp(t, a + at, a + at + 1.2)) : total) : undefined;
  return (
    <g>
      <rect width={1920} height={1080} fill="#0E1118" />
      <rect x={0} y={0} width={1920} height={220} fill="#123E2A" />{T(960, 140, "OTOGAZ  ·  LPG", 80, "#FFF", 700, "middle")}
      <g transform="translate(960,600)">
        <rect x={-460} y={-330} width={920} height={700} rx={30} fill="#E9ECEF" />
        <rect x={-400} y={-270} width={800} height={250} rx={16} fill="#0B0B0B" />
        {T(-370, -190, "LİTRE FİYATI", 34, "#AAA", 700)}
        <text x={370} y={-60} fontFamily="'Courier New', monospace" fontWeight={700} fontSize={150} fill={sw ? "#FF3B2F" : "#5CF08E"} opacity={flick} textAnchor="end" style={{ filter: `drop-shadow(0 0 10px ${sw ? "#FF3B2F" : "#5CF08E"})` }}>{sw ? to : from}</text>
        {tot !== undefined && <g><rect x={-400} y={20} width={800} height={160} rx={16} fill="#0B0B0B" />{T(-370, 80, "TUTAR ₺", 30, "#AAA", 700)}<text x={370} y={150} fontFamily="'Courier New', monospace" fontWeight={700} fontSize={100} fill="#FFD27A" textAnchor="end">{fmt(tot)}</text></g>}
        <rect x={-420} y={220} width={120} height={120} rx={14} fill="#2BB673" /><path d="M-360,250 L-360,320 M-390,290 L-360,320 L-330,290" stroke="#FFF" strokeWidth={10} fill="none" />
      </g>
    </g>
  );
};

// ───────── zarf (kira / anne)
export const Zarf: React.FC<{ x: number; y: number; s?: number; rot?: number; label: string; amount?: string; fill?: number; c?: string }> = ({ x, y, s = 1, rot = 0, label, amount, fill = 1, c = "#F3E6C8" }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    {fill > 0 && Array.from({ length: Math.ceil(fill * 6) }, (_, i) => <rect key={i} x={-150 + i * 8} y={-150 - i * 6} width={280} height={110} rx={6} fill={i % 2 ? "#C46BA0" : "#3E8E5E"} />)}
    <rect x={-200} y={-130} width={400} height={260} rx={10} fill={c} stroke="#B9A57A" strokeWidth={4} />
    <path d="M-200,-130 L0,10 L200,-130" fill="none" stroke="#B9A57A" strokeWidth={4} />
    <text x={0} y={70} fontFamily="Caveat, Poppins" fontWeight={700} fontSize={64} fill="#22324A" textAnchor="middle">{label}</text>
    {amount && <text x={0} y={118} fontFamily="Caveat, Poppins" fontWeight={700} fontSize={40} fill="#C0392B" textAnchor="middle">{amount}</text>}
  </g>
);

// ───────── kiralık oda (gece, çıplak ampul, yer yatağı)
export const Oda: React.FC<{ t: number; px?: number; people?: React.ReactNode }> = ({ t, px = 0, people }) => (
  <g>
    <rect width={1920} height={1080} fill="#2B2620" />
    <g transform={`translate(${px},0)`}>
      <rect x={-100} y={0} width={2200} height={760} fill="#4A4136" />
      {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${200 + i * 230},${100 + hash(i) * 300} q20,40 -10,90`} stroke="#3A3229" strokeWidth={4} fill="none" />)}
      <rect x={-100} y={760} width={2200} height={360} fill="#3A3027" />
      <g transform="translate(1450,170)"><rect x={0} y={0} width={300} height={260} fill="#0B1020" /><circle cx={220} cy={70} r={26} fill="#EDE7C8" opacity={0.7} /><rect x={-14} y={-14} width={328} height={288} fill="none" stroke="#6B5D4C" strokeWidth={22} /></g>
      <rect x={200} y={820} width={900} height={110} rx={30} fill="#7E8A99" /><rect x={220} y={800} width={260} height={70} rx={30} fill="#D9D2C4" />
      {people}
    </g>
    <line x1={960} y1={0} x2={960} y2={130} stroke="#111" strokeWidth={4} />
    <circle cx={960} cy={160} r={34} fill="#FFE9A8" /><circle cx={960} cy={160} r={420} fill="url(#hLamp)" opacity={0.9 + 0.1 * Math.sin(t * 13)} />
  </g>
);

// ───────── metrobüs içi (gece, ayakta)
export const Metrobus: React.FC<{ t: number; people?: React.ReactNode }> = ({ t, people }) => (
  <g>
    <rect width={1920} height={1080} fill="#2E3540" />
    <rect x={0} y={150} width={1920} height={420} fill="#0A0E18" />
    {Array.from({ length: 14 }, (_, i) => { const x = 1920 - ((t * 900 + i * 260) % 2400); return <g key={i}><rect x={x} y={240 + hash(i) * 120} width={80 + hash(i + 3) * 120} height={8} fill="#FF9A3C" opacity={0.7} /><circle cx={x + 40} cy={200 + hash(i + 1) * 60} r={10} fill="#FFE9A8" opacity={0.6} /></g>; })}
    {[0, 480, 960, 1440].map((x) => <rect key={x} x={x - 20} y={150} width={40} height={420} fill="#3E4652" />)}
    <rect x={0} y={570} width={1920} height={510} fill="#3A424E" />
    <rect x={0} y={110} width={1920} height={20} fill="#8A929E" />
    {[300, 700, 1200, 1600].map((x, i) => <g key={x} transform={`translate(${x},130) rotate(${Math.sin(t * 2 + i) * 6})`}><line x1={0} y1={0} x2={0} y2={90} stroke="#BBB" strokeWidth={6} /><circle cx={0} cy={110} r={22} fill="none" stroke="#DDD" strokeWidth={8} /></g>)}
    <rect x={1300} y={130} width={26} height={950} fill="#D9C24A" />
    <g transform={`translate(${Math.sin(t * 3) * 6},0)`}>{people}</g>
  </g>
);

// ───────── sokak (Şişli: el kaldıran yolcu için)
export const Sokak: React.FC<{ t: number; px?: number; rain?: boolean; night?: boolean; people?: React.ReactNode; signs?: string[] }> = ({ t, px = 0, rain, night, people, signs = ["ECZANE", "BÜFE", "KUAFÖR"] }) => (
  <g>
    <rect width={1920} height={1080} fill={night ? "#0B1020" : rain ? "#5D6773" : "#A8CBE6"} />
    <g transform={`translate(${px},0)`}>
      {[[-100, 520, "#C9B79C"], [380, 600, "#B9A48A"], [860, 560, "#D4C6AE"], [1340, 640, "#BCA98E"], [1820, 580, "#C9B79C"]].map(([x, w, c], i) => (
        <g key={i}><rect x={x as number} y={760 - (w as number)} width={470} height={w as number} fill={night ? "#2A2F3D" : (c as string)} />
          {Array.from({ length: 8 }, (_, j) => <rect key={j} x={(x as number) + 40 + (j % 4) * 105} y={760 - (w as number) + 50 + Math.floor(j / 4) * 130} width={70} height={90} fill={night ? (hash(i * 9 + j) > 0.5 ? "#FFD27A" : "#151A26") : "#7F98AE"} />)}
          <rect x={(x as number) + 20} y={600} width={430} height={60} fill={["#2E7D5B", "#C0392B", "#2E3E5C"][i % 3]} />{T((x as number) + 235, 643, signs[i % signs.length], 36, "#FFF", 700, "middle")}
        </g>
      ))}
      <rect x={-200} y={760} width={2400} height={60} fill={night ? "#2A2D33" : "#A4A7AB"} />
      <rect x={-200} y={820} width={2400} height={300} fill={night ? "#15181F" : rain ? "#3E464F" : "#5C636B"} />
      {rain && <rect x={-200} y={820} width={2400} height={300} fill="#9FC2E8" opacity={0.08} />}
      {people}
    </g>
    {rain && <Rain t={t} />}
  </g>
);

// ───────── kamyon (gece, farlar)
export const Kamyon: React.FC<{ x: number; y: number; s?: number; t: number }> = ({ x, y, s = 1, t }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-260} y={-420} width={520} height={400} rx={20} fill="#2A2E36" />
    <rect x={-210} y={-380} width={420} height={150} rx={14} fill="#0E1622" />
    <rect x={-240} y={-200} width={480} height={50} fill="#444" />
    {[-180, 180].map((xx) => <g key={xx}><circle cx={xx} cy={-120} r={46} fill="#FFF8D0" /><circle cx={xx} cy={-120} r={200} fill="#FFF8D0" opacity={0.2 + 0.05 * Math.sin(t * 20)} /></g>)}
  </g>
);

// ───────── telefon ekranı: yayılan video
export const ViralScreen: React.FC<{ t: number; views: number; k?: number }> = ({ t, views, k = 1 }) => (
  <g>
    <rect width={360} height={740} fill="#0F0F0F" />
    <rect x={0} y={60} width={360} height={220} fill="#7E95AA" />
    <svg x={0} y={60} width={360} height={220} viewBox="300 300 1300 800"><Sokak t={t} people={<Taksi x={960} y={960} s={0.9} t={t} />} /></svg>
    <circle cx={180} cy={170} r={34} fill="#000" opacity={0.5} /><path d="M168,152 L198,170 L168,188Z" fill="#FFF" />
    {T(14, 316, "İşte İstanbul taksicisi! 😡", 20, "#FFF", 700)}
    {T(14, 344, `${fmt(views)} görüntüleme`, 16, "#AAA", 500)}
    {["@ayse.k: Hep aynı bunlar", "@mert34: Kısa mesafe = ret", "@zeynep: Şikayet edin!", "@can_d: Martı'ya binin artık", "@hakan.t: Plakayı alsınlar"].map((c, i) => <g key={i} opacity={cl(k * 6 - i)}><circle cx={30} cy={400 + i * 64} r={16} fill={["#7E5BD6", "#E5322D", "#2BB673", "#3EA6FF", "#FFB547"][i]} />{T(56, 406 + i * 64, c, 16, "#EEE", 500)}</g>)}
  </g>
);

// ───────── radyo haber bandı / mahkeme
export const Tokmak: React.FC<{ x: number; y: number; s?: number; t: number; a: number }> = ({ x, y, s = 1, t, a }) => {
  const k = Math.sin(cl((t - a) / 0.4) * Math.PI);
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-200} y={40} width={400} height={50} rx={10} fill="#5A3A22" />
      <g transform={`rotate(${-30 + k * 30} 160 -40)`}><rect x={-40} y={-120} width={240} height={50} rx={14} fill="#7A4E2E" transform="rotate(10)" /><rect x={-80} y={-150} width={110} height={110} rx={20} fill="#6B4226" /></g>
    </g>
  );
};
