import React from "react";
import { H, Look, cl, lp, rp } from "./Hayat";

// Kanal 4 · k6-11 · Claude ile YouTube otomasyonu: kurgucu odası (Ankara), kurgu programı, Claude ekranı,
// Derinkuyu kesiti + yeraltı koridoru, AŞTİ otobüsü + Kapadokya, taktik tahtası, kanal kartları, fatura.

const UI = "Poppins";
const MONO = "Courier New";
const tx = (x: number, y: number, s: string, size = 24, c = "#FFF", w = 600, anchor: "start" | "middle" | "end" = "start", f = UI) => (
  <text x={x} y={y} fontFamily={f} fontWeight={w} fontSize={size} fill={c} textAnchor={anchor}>{s}</text>
);
const hash = (i: number) => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };

export const CL_OR = "#D97757"; // Claude turuncusu (benzer, kopya değil)
export const CL_BG = "#1F1E1D";

// ───────── karakterler
export const SEN26K: Look = { hairStyle: "fade", hair: "#1E1510", top: "#2F4F46", top2: "#233C35", kind: "hoodie", beard: 0.55 };
export const SEN26K_EV: Look = { ...SEN26K, top: "#4A4F5A", top2: "#383C45", kind: "tshirt" };
export const KAAN: Look = { hairStyle: "curly", hair: "#3A2418", top: "#C23B32", top2: "#9C2E27", kind: "jacket", beard: 0.3 };
export const YORUMCU: Look = { hairStyle: "short", hair: "#2A2A2A", top: "#1D2B4A", top2: "#15203A", kind: "shirt", beard: 0.8, glasses: true };

// Claude simgesi (turuncu yıldız patlaması, genel)
export const ClaudeMark: React.FC<{ x: number; y: number; s?: number; spin?: number }> = ({ x, y, s = 1, spin = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${spin})`}>
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-5} y={-38} width={10} height={30 + (i % 3) * 5} rx={5} fill={CL_OR} transform={`rotate(${i * 30})`} />)}
    <circle r={9} fill={CL_OR} />
  </g>
);

// ───────── kurgucu odası (Ankara, Keçiören). screenL/screenR: 1000x625 ekran içerikleri
export const KurguOda: React.FC<{ t: number; night?: boolean; px?: number; screenL?: React.ReactNode; screenR?: React.ReactNode; people?: React.ReactNode; fans?: number; lamp?: number; off?: boolean; front?: React.ReactNode }> =
  ({ t, night = true, px = 0, screenL, screenR, people, fans = 0.4, lamp = 0.5, off = false, front }) => {
    const shake = fans > 0.8 ? Math.sin(t * 60) * 1.5 : 0;
    return (
      <g>
        <rect width={1920} height={1080} fill={night ? "#26252E" : "#D7CAB4"} />
        <g transform={`translate(${px},0)`}>
          {/* duvar: akustik süngerler (kurgucu odası) */}
          {Array.from({ length: 12 }, (_, i) => <g key={i} transform={`translate(${120 + (i % 4) * 92},${110 + Math.floor(i / 4) * 92})`}><rect width={84} height={84} fill="#2E3440" />{[0, 1, 2].map((j) => <rect key={j} x={6} y={8 + j * 26} width={72} height={14} fill="#3A4150" />)}</g>)}
          {/* pencere: Ankara gecesi, uzakta kule */}
          <g transform="translate(1420,90)">
            <rect x={-18} y={-18} width={436} height={396} fill="#E6E0D4" />
            <rect width={400} height={360} fill={night ? "#0E1730" : "#A9CBE6"} />
            {night && <>
              {Array.from({ length: 40 }, (_, i) => <rect key={i} x={hash(i) * 390} y={190 + hash(i + 9) * 160} width={8} height={10} fill="#FFD27A" opacity={0.25 + 0.5 * ((Math.sin(t * 0.4 + i) + 1) / 2)} />)}
              <g transform="translate(300,120)"><rect x={-6} y={0} width={12} height={160} fill="#1A2440" /><ellipse cx={0} cy={0} rx={34} ry={20} fill="#1A2440" /><ellipse cx={0} cy={0} rx={30} ry={6} fill="#FFD27A" opacity={0.7} /><rect x={-2} y={-50} width={4} height={50} fill="#1A2440" /><circle cx={0} cy={-52} r={4} fill="#FF4040" opacity={0.5 + 0.5 * Math.sin(t * 4)} /></g>
              <path d="M0,300 Q120,270 240,290 T400,280 L400,360 L0,360Z" fill="#0A1124" />
            </>}
            <rect x={196} width={8} height={360} fill="#E6E0D4" /><rect y={176} width={400} height={8} fill="#E6E0D4" />
            <path d={`M-40,-30 Q${30 + Math.sin(t * 0.8) * 5},180 -30,390 L-60,390 L-60,-30Z`} fill="#3D4A5C" />
          </g>
          {/* raf: hard diskler + Kaan'ın plaketi yok, kurgucu kitapları */}
          <g transform="translate(560,250)">
            <rect x={0} y={110} width={360} height={14} fill={H.wood2} />
            {["#C0392B", "#2C3E50", "#7F8C8D", "#2980B9", "#16A085"].map((c, i) => <rect key={i} x={10 + i * 36} y={30 + (i % 2) * 10} width={30} height={80 - (i % 2) * 10} fill={c} />)}
            {[0, 1, 2].map((i) => <g key={i} transform={`translate(${210 + i * 48},62)`}><rect width={40} height={48} rx={5} fill="#1C1C1C" /><circle cx={20} cy={38} r={3} fill={i === 1 ? "#2BB673" : "#3EA6FF"} opacity={0.5 + 0.5 * Math.sin(t * 5 + i)} /></g>)}
          </g>
          {/* masa */}
          <rect x={260} y={740} width={1600} height={28} fill="#4A3426" />
          <rect x={260} y={768} width={1600} height={320} fill="#3A281D" />
          {/* iki monitör */}
          {[{ x: 520, c: screenL }, { x: 1110, c: screenR }].map((m, i) => (
            <g key={i} transform={`translate(${m.x},300)`}>
              <rect x={-12} y={-12} width={524} height={340} rx={10} fill="#111" />
              <svg x={0} y={0} width={500} height={316} viewBox="0 0 1000 625">{off ? <rect width={1000} height={625} fill="#050505" /> : (m.c ?? <rect width={1000} height={625} fill="#1A2233" />)}</svg>
              <rect x={230} y={328} width={40} height={90} fill="#222" /><rect x={170} y={412} width={160} height={16} rx={6} fill="#222" />
            </g>
          ))}
          {!off && <ellipse cx={1100} cy={460} rx={720} ry={300} fill="url(#hGlow)" opacity={0.55} />}
          {/* kasa (RGB fanlar) */}
          <g transform={`translate(${1730 + shake},740)`}>
            <rect x={-110} y={-330} width={220} height={330} rx={12} fill="#22252C" />
            <rect x={-96} y={-316} width={160} height={300} rx={8} fill="#121418" />
            {[0, 1, 2].map((i) => { const sp = t * (8 + fans * 40) + i; return <g key={i} transform={`translate(-16,${-262 + i * 92})`}><circle r={38} fill="none" stroke={["#3EA6FF", "#C77DFF", CL_OR][i]} strokeWidth={5} opacity={off ? 0.1 : 0.8} />{!off && [0, 1, 2, 3].map((k) => <path key={k} d="M0,0 Q14,-10 0,-30" stroke="#888" strokeWidth={5} fill="none" transform={`rotate(${(sp * 57) % 360 + k * 90})`} />)}</g>; })}
            <circle cx={90} cy={-300} r={6} fill={off ? "#333" : "#2BB673"} />
            {fans > 0.7 && !off && [0, 1, 2].map((i) => <path key={i} d={`M${-120 - i * 26},${-200 + i * 50} q-20,-20 0,-40 q20,-20 0,-40`} stroke="#FFF" strokeWidth={4} fill="none" opacity={0.25 + 0.25 * Math.sin(t * 9 + i)} />)}
          </g>
          {/* masa üstü: klavye, fare, kulaklık, çay, yapışkan notlar, kablo */}
          <rect x={720} y={712} width={420} height={40} rx={8} fill="#1B1B1B" />{Array.from({ length: 14 }, (_, i) => <rect key={i} x={732 + i * 29} y={718} width={24} height={12} rx={2} fill="#2F2F2F" />)}
          <ellipse cx={1210} cy={735} rx={26} ry={16} fill="#1B1B1B" />
          <g transform="translate(430,700)"><path d="M-40,40 Q-44,-30 0,-34 Q44,-30 40,40" stroke="#151515" strokeWidth={14} fill="none" /><rect x={-56} y={20} width={30} height={46} rx={10} fill="#151515" /><rect x={26} y={20} width={30} height={46} rx={10} fill="#151515" /></g>
          <g transform="translate(1390,700)"><path d="M-18,-46 L18,-46 L14,40 L-14,40Z" fill="#E8D8B8" opacity={0.85} /><path d="M-15,-20 L15,-20 L13,38 L-13,38Z" fill="#9B2C12" />{[0, 1].map((i) => <path key={i} d={`M${-6 + i * 12},-52 q-8,-${12 + 6 * Math.sin(t * 2 + i)} 0,-${26 + 4 * i}`} stroke="#FFF" strokeWidth={3} fill="none" opacity={0.3} />)}</g>
          {[["#FFE27A", "RENDER!"], ["#7BD88F", "Kaan 212"], ["#FF9EB0", "ı ş ğ ?"]].map(([c, s], i) => <g key={i} transform={`translate(${470 + i * 70},${600 + (i % 2) * 18}) rotate(${-6 + i * 5})`}><rect width={64} height={60} fill={c} />{tx(32, 36, s, 11, "#333", 700, "middle")}</g>)}
          <path d="M1680,770 Q1500,860 1300,800 T900,860" stroke="#111" strokeWidth={6} fill="none" opacity={0.7} />
          {/* lamba */}
          <g transform="translate(330,740)"><path d="M0,0 L0,-210 L90,-290" stroke="#222" strokeWidth={10} fill="none" /><path d="M60,-320 L170,-270 L130,-230 L40,-280Z" fill="#E5322D" /><ellipse cx={110} cy={-220} rx={230 * lamp} ry={160 * lamp} fill="url(#hLamp)" /></g>
          {people}
          {front}
        </g>
        <rect width={1920} height={1080} fill="#0A0F2A" opacity={night ? 0.2 : 0} />
      </g>
    );
  };

// ───────── kurgu programı (1000x625): önizleme + izler + dosya adı
export const KurguProg: React.FC<{ t: number; file?: string; preview?: React.ReactNode; tracks?: number; play?: number; hours?: string }> = ({ t, file = "Kaan_bolum212_FINAL_son_v3.prproj", preview, tracks = 5, play, hours }) => {
  const ph = play ?? ((t * 0.04) % 1);
  return (
    <g>
      <rect width={1000} height={625} fill="#1D1F24" />
      <rect width={1000} height={34} fill="#2A2D33" />{tx(14, 23, "● ● ●", 14, "#666", 700)}{tx(500, 23, file, 15, "#DDD", 600, "middle")}
      <rect x={14} y={46} width={280} height={300} fill="#24272E" />{Array.from({ length: 8 }, (_, i) => <g key={i} transform={`translate(${24 + (i % 2) * 135},${58 + Math.floor(i / 2) * 70})`}><rect width={126} height={60} fill={["#3B5B7A", "#7A4B3B", "#3B7A5A", "#6B3B7A"][i % 4]} opacity={0.7} /></g>)}
      <rect x={310} y={46} width={676} height={300} fill="#000" />
      <svg x={310} y={46} width={676} height={300} viewBox="0 0 1000 444">{preview ?? <g><rect width={1000} height={444} fill="#22324A" />{tx(500, 240, "KAAN · Bölüm 212", 54, "#FFF", 800, "middle")}</g>}</svg>
      <rect x={14} y={360} width={972} height={250} fill="#17191D" />
      {Array.from({ length: tracks }, (_, r) => (
        <g key={r} transform={`translate(70,${376 + r * 44})`}>
          {tx(-48, 26, r < 3 ? `V${3 - r}` : `A${r - 2}`, 14, "#888", 700)}
          {Array.from({ length: 10 }, (_, i) => { const w = 40 + hash(r * 10 + i) * 90; const x = (i * 100 + hash(i + r) * 20) % 900; return <rect key={i} x={x} y={0} width={w} height={36} rx={4} fill={r < 3 ? ["#4A78A8", "#A85A4A", "#7A5AA8"][r] : "#3A8A5A"} opacity={0.85} />; })}
          {r >= 3 && <path d={Array.from({ length: 90 }, (_, i) => `${i ? "L" : "M"}${i * 10},${18 + Math.sin(i * 1.7 + r) * 12 * hash(i)}`).join(" ")} stroke="#9FE0B0" strokeWidth={2} fill="none" />}
        </g>
      ))}
      <rect x={70 + ph * 900} y={364} width={3} height={240} fill="#FF4040" /><path d={`M${63 + ph * 900},360 l10,0 l-5,10z`} fill="#FF4040" />
      {hours && <g transform="translate(830,60)"><rect width={150} height={44} rx={8} fill="#000" opacity={0.7} />{tx(75, 30, hours, 22, "#FFE27A", 700, "middle")}</g>}
    </g>
  );
};

// ───────── Claude ekranı (1000x625): soru yazılır, satırlar akar, ilerleme çubuğu
export const ClaudeEkran: React.FC<{ t: number; a: number; q: string; lines?: string[]; prog?: number; label?: string; err?: string; speed?: number }> = ({ t, a, q, lines = [], prog, label = "Video oluşturuluyor", err, speed = 30 }) => {
  const nq = Math.floor(cl((t - a) * speed / q.length) * q.length);
  const t2 = a + q.length / speed + 0.3;
  const nl = Math.floor(Math.max(0, (t - t2) * 6));
  return (
    <g>
      <rect width={1000} height={625} fill={CL_BG} />
      <rect width={1000} height={52} fill="#2A2826" /><ClaudeMark x={34} y={26} s={0.42} spin={t * 20} />{tx(62, 34, "Claude", 22, "#F0EEE6", 700)}{tx(970, 34, "kod modu", 16, "#9A968C", 600, "end")}
      <g transform="translate(40,96)">
        <rect x={0} y={-34} width={920} height={66} rx={12} fill="#30302E" />
        {tx(20, 10, "› " + q.slice(0, nq) + ((t * 2) % 1 < 0.5 && nq < q.length ? "▌" : ""), q.length > 48 ? 24 : 30, "#F0EEE6", 600)}
      </g>
      {lines.slice(0, nl).map((l, i) => <g key={i}>{tx(56, 190 + i * 52, l, 34, l.startsWith("✓") ? "#7BD88F" : l.startsWith("!") ? "#FF8A7A" : "#C9C4B8", 500, "start", MONO)}</g>)}
      {prog !== undefined && <g transform="translate(56,540)"><rect width={888} height={20} rx={10} fill="#3A3836" /><rect width={888 * cl(prog)} height={20} rx={10} fill={CL_OR} />{tx(0, -16, `${label} · %${Math.round(cl(prog) * 100)}`, 28, "#C9C4B8", 600)}</g>}
      {err && <g transform="translate(150,230)"><rect width={700} height={200} rx={18} fill="#3A1D1A" stroke="#FF6B5A" strokeWidth={3} />{tx(350, 80, err, 30, "#FFB3A8", 700, "middle")}{tx(350, 140, "05:00:00 sonra tekrar deneyin", 24, "#E8C9C2", 600, "middle")}</g>}
    </g>
  );
};

// ───────── video kartı: "Kayıp Harita" (kutu harf hatası)
export const HaritaVideo: React.FC<{ t: number; broken?: boolean; title?: string; sub?: string; same?: boolean; mark?: string }> = ({ t, broken, title, sub, same, mark }) => (
  <g>
    <rect width={1000} height={625} fill="#D9C79E" />
    {Array.from({ length: 18 }, (_, i) => <path key={i} d={`M${hash(i) * 1000},${hash(i + 3) * 625} q${60 + hash(i + 5) * 80},${-40} ${140},${10}`} stroke="#8C7347" strokeWidth={3} fill="none" opacity={0.5} />)}
    <path d="M180,380 Q300,240 460,300 T760,260 Q860,320 820,420 Q700,500 520,470 T220,470Z" fill="#B99C68" stroke="#6E5530" strokeWidth={4} />
    <circle cx={560} cy={360} r={14} fill="#C0392B" /><circle cx={560} cy={360} r={14 + ((t * 30) % 30)} fill="none" stroke="#C0392B" strokeWidth={3} opacity={1 - ((t * 30) % 30) / 30} />
    <rect x={0} y={0} width={1000} height={150} fill="#000" opacity={0.55} />
    {broken ? <g>{tx(310, 105, "KAY", 84, "#FFF", 800)}<rect x={500} y={35} width={44} height={74} fill="none" stroke="#FFF" strokeWidth={5} />{tx(560, 105, "P HARİTA", 84, "#FFF", 800)}</g> : tx(500, 105, title ?? "KAYIP HARİTA", 84, "#FFF", 800, "middle")}
    {sub && <g><rect x={0} y={520} width={1000} height={105} fill="#000" opacity={0.6} />{tx(500, 590, sub, 44, "#FFE27A", 700, "middle")}</g>}
    {same && <g opacity={0.9}>{tx(980, 600, "Şablon #1", 22, "#FFF", 700, "end")}</g>}
    {mark && <g transform="translate(860,200) rotate(12)"><rect x={-110} y={-40} width={220} height={80} rx={12} fill="none" stroke="#E5322D" strokeWidth={8} />{tx(0, 16, mark, 40, "#E5322D", 900, "middle")}</g>}
  </g>
);

// ───────── YouTube benzeri istatistik ekranı (1000x625)
export const KanalPanel: React.FC<{ t: number; name?: string; views: number[]; subs: number; k?: number; hi?: number }> = ({ t, name = "Kayıp Harita", views, subs, k = 1, hi = -1 }) => (
  <g>
    <rect width={1000} height={625} fill="#0F0F0F" />
    <rect width={1000} height={56} fill="#212121" /><path d="M24,16 h40 a10,10 0 0 1 10,10 v8 a10,10 0 0 1 -10,10 h-40 a10,10 0 0 1 -10,-10 v-8 a10,10 0 0 1 10,-10z" fill="#E5322D" /><path d="M38,20 l14,10 l-14,10z" fill="#FFF" />{tx(86, 38, "Stüdyo · " + name, 22, "#FFF", 700)}
    <g transform="translate(40,90)"><rect width={300} height={120} rx={10} fill="#212121" />{tx(20, 40, "Abone", 18, "#AAA", 500)}{tx(20, 96, Math.round(subs * k).toLocaleString("tr-TR"), 46, "#FFF", 700)}</g>
    {views.map((v, i) => { const kk = cl(k * views.length - i); return (
      <g key={i} transform={`translate(380,${90 + i * 74})`} opacity={0.3 + 0.7 * kk}>
        <rect width={580} height={64} rx={8} fill={hi === i ? "#3A2A12" : "#1A1A1A"} stroke={hi === i ? "#FFB547" : "none"} strokeWidth={3} />
        <rect x={8} y={8} width={86} height={48} rx={4} fill={["#8C7347", "#5A6E8C", "#6E5A8C", "#8C5A5A", "#5A8C6E"][i % 5]} />
        {tx(110, 30, `Video ${i + 1}`, 18, "#DDD", 600)}
        {tx(560, 42, Math.round(v * kk).toLocaleString("tr-TR") + " izlenme", 24, hi === i ? "#FFE27A" : "#FFF", 700, "end")}
      </g>
    ); })}
  </g>
);

// ───────── telefon: kısa video (360x740) Derinkuyu
export const ShortDerin: React.FC<{ t: number; views: number; title?: string }> = ({ t, views, title = "Duvarı yıktı… arkasında bir şehir çıktı" }) => (
  <g>
    <rect width={360} height={740} fill="#000" />
    <svg x={0} y={40} width={360} height={600} viewBox="0 0 960 1600"><DerinkuyuKesit t={t} floors={8} tall /></svg>
    <rect x={0} y={520} width={360} height={220} fill="url(#shG)" /><defs><linearGradient id="shG" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.9" /></linearGradient></defs>
    {tx(16, 640, title.slice(0, 26), 18, "#FFF", 700)}{tx(16, 664, title.slice(26), 18, "#FFF", 700)}
    {tx(16, 700, "@kayipharita · ▶ " + views.toLocaleString("tr-TR"), 16, "#DDD", 600)}
    {[["♥", "84 B"], ["💬", "2,1 B"], ["↗", "Paylaş"]].map(([i2, s], i) => <g key={i} transform={`translate(325,${420 + i * 70})`}>{tx(0, 0, i2, 30, "#FFF", 700, "middle")}{tx(0, 24, s, 13, "#FFF", 600, "middle")}</g>)}
  </g>
);

// ───────── Derinkuyu kesiti (1920x1080, ya da tall: 960x1600): üstte ev + yıkılan duvar, altta katlar
export const DerinkuyuKesit: React.FC<{ t: number; floors?: number; reveal?: number; wall?: number; label20?: number; label8?: number; tall?: boolean; people?: React.ReactNode }> = ({ t, floors = 8, reveal = 1, wall = 1, label20 = 0, label8 = 0, tall, people }) => {
  const W = tall ? 960 : 1920, Hh = tall ? 1600 : 1080;
  const top = tall ? 330 : 250, fh = (Hh - top - 40) / 8;
  return (
    <g>
      <rect width={W} height={Hh} fill="#9CC6E4" />
      <rect y={0} width={W} height={top} fill="url(#dkSky)" /><defs><linearGradient id="dkSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#7FB2DA" /><stop offset="1" stopColor="#E8D9BC" /></linearGradient></defs>
      {/* peri bacaları uzakta */}
      {[0.1, 0.22, 0.78, 0.9].map((p, i) => <path key={i} d={`M${p * W - 40},${top} Q${p * W - 30},${top - 120 - i * 10} ${p * W},${top - 150 - i * 12} Q${p * W + 30},${top - 120} ${p * W + 40},${top}Z`} fill="#D8B48A" />)}
      {/* ev (1963) */}
      <g transform={`translate(${W * 0.5},${top})`}>
        <rect x={-150} y={-170} width={300} height={170} fill="#E2C79C" /><path d="M-170,-170 L0,-250 L170,-170Z" fill="#A65B3A" />
        <rect x={-110} y={-120} width={70} height={70} fill="#5A7A9A" /><rect x={50} y={-110} width={60} height={110} fill="#6E4528" />
      </g>
      <rect y={top} width={W} height={Hh - top} fill="#C9A47A" />
      {Array.from({ length: 60 }, (_, i) => <circle key={i} cx={hash(i) * W} cy={top + hash(i + 7) * (Hh - top)} r={3 + hash(i + 2) * 6} fill="#B48E62" opacity={0.6} />)}
      {/* katlar */}
      {Array.from({ length: floors }, (_, i) => {
        const k = cl(reveal * floors - i);
        const y = top + 30 + i * fh;
        const off = (i % 2 ? -1 : 1) * W * 0.08;
        return (
          <g key={i} opacity={k}>
            <path d={`M${W * 0.2 + off},${y + fh * 0.25} h${W * 0.6} a${fh * 0.3},${fh * 0.3} 0 0 1 0,${fh * 0.55} h-${W * 0.6} a${fh * 0.3},${fh * 0.3} 0 0 1 0,-${fh * 0.55}z`} fill="#4A3423" />
            {[0.3, 0.5, 0.7].map((p) => <g key={p}><rect x={W * p + off - 26} y={y + fh * 0.35} width={52} height={fh * 0.45} rx={20} fill="#2E2016" /><circle cx={W * p + off} cy={y + fh * 0.5} r={7} fill="#FFB547" opacity={0.6 + 0.4 * Math.sin(t * 6 + i + p * 9)} /></g>)}
            <path d={`M${W * 0.5},${y + fh * 0.8} L${W * 0.5 + (i % 2 ? 1 : -1) * 40},${y + fh * 1.25}`} stroke="#4A3423" strokeWidth={fh * 0.25} />
            {i === 2 && <g transform={`translate(${W * 0.8 + off - 10},${y + fh * 0.52})`}><circle r={fh * 0.28} fill="#8E7A62" stroke="#5E4E3C" strokeWidth={6} /><circle r={fh * 0.06} fill="#5E4E3C" /></g>}
            {tx(W * 0.08, y + fh * 0.65, `${i + 1}`, tall ? 44 : 34, "#FFF", 800, "middle")}
          </g>
        );
      })}
      {/* yıkılan duvar */}
      {wall < 1 && wall > 0 && <g transform={`translate(${W * 0.5 - 230},${top - 40}) rotate(${-30 + 60 * Math.abs(Math.sin(t * 5))})`}><rect x={-8} y={-120} width={16} height={120} fill="#6E4528" /><rect x={-30} y={-140} width={60} height={30} rx={6} fill="#555" /></g>}
      {wall < 1 && <g transform={`translate(${W * 0.5 - 150},${top - 60})`}>{Array.from({ length: 6 }, (_, i) => <rect key={i} x={i * 12 * (1 - wall)} y={i * 18 + (1 - wall) * i * 30} width={26} height={18} fill="#C9AE84" transform={`rotate(${(1 - wall) * i * 20})`} />)}</g>}
      {label20 > 0 && <g opacity={label20} transform={`translate(${W * 0.82},${top + 120})`}><rect x={-150} y={-70} width={300} height={130} rx={16} fill="#FFF" />{tx(0, 22, "20 KAT", 64, "#E5322D", 900, "middle")}{label8 > 0 && <line x1={-140} y1={-50} x2={140} y2={40} stroke="#E5322D" strokeWidth={12 * label8} strokeLinecap="round" />}</g>}
      {label8 > 0 && <g opacity={label8} transform={`translate(${W * 0.82},${top + 300})`}><rect x={-150} y={-70} width={300} height={130} rx={16} fill="#2BB673" />{tx(0, 22, "8 KAT", 64, "#FFF", 900, "middle")}</g>}
      {people}
    </g>
  );
};

// ───────── yeraltı koridoru (1920x1080): alçak tavan, taş teker kapı, kandil ışığı
export const Yeralti: React.FC<{ t: number; px?: number; people?: React.ReactNode; stone?: number; count?: number }> = ({ t, px = 0, people, stone = 0, count }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A1D14" />
    <g transform={`translate(${px},0)`}>
      <path d="M-200,200 Q960,40 2120,200 L2120,1080 L-200,1080Z" fill="#6B4E36" />
      <path d="M200,280 Q960,170 1720,280 L1720,1000 L200,1000Z" fill="#4A3424" />
      <path d="M700,380 Q960,320 1220,380 L1220,1000 L700,1000Z" fill="#2B1E15" />
      <path d="M860,470 Q960,440 1060,470 L1060,1000 L860,1000Z" fill="#170F0A" />
      {Array.from({ length: 90 }, (_, i) => <circle key={i} cx={-200 + hash(i) * 2300} cy={180 + hash(i + 4) * 900} r={2 + hash(i + 1) * 5} fill="#8C6A4C" opacity={0.35} />)}
      {/* taş teker */}
      <g transform={`translate(${1500 - stone * 260},700) rotate(${-stone * 90})`}><circle r={220} fill="#8E7A62" stroke="#5E4E3C" strokeWidth={14} /><circle r={40} fill="#5E4E3C" />{[0, 1, 2].map((i) => <path key={i} d={`M${-150 + i * 40},${-120 + i * 70} q40,20 80,0`} stroke="#6E5C48" strokeWidth={6} fill="none" />)}</g>
      {[420, 1500].map((x, i) => <g key={i}><circle cx={x} cy={360} r={180} fill="#FFB547" opacity={0.18 + 0.05 * Math.sin(t * 7 + i)} /><rect x={x - 8} y={340} width={16} height={30} fill="#3A2A1E" /><path d={`M${x},${340} q-8,-${16 + 4 * Math.sin(t * 9 + i)} 0,-30 q8,14 0,30`} fill="#FFB547" /></g>)}
      <rect y={980} width={2120} height={100} fill="#3A2A1E" />
      {people}
    </g>
    {count !== undefined && <g transform="translate(1680,120)"><circle r={86} fill="#000" opacity={0.6} />{tx(0, 26, String(count), 80, "#FFE27A", 800, "middle")}{tx(0, 70, "KAT", 22, "#FFF", 700, "middle")}</g>}
  </g>
);

// ───────── otobüs (AŞTİ → Nevşehir) bozkırda + Kapadokya
export const OtobusYol: React.FC<{ t: number; kap?: number; inside?: boolean; people?: React.ReactNode }> = ({ t, kap = 0, people }) => {
  const sc = (t * 260) % 1920;
  return (
    <g>
      <rect width={1920} height={1080} fill="#9EC9E8" />
      <circle cx={1580} cy={200} r={80} fill="#FFF3C8" />
      {kap > 0 && [{ x: 300, c: "#E5322D" }, { x: 760, c: "#FFB547" }, { x: 1250, c: "#3EA6FF" }].map((b, i) => <g key={i} opacity={kap} transform={`translate(${b.x + Math.sin(t * 0.5 + i) * 20},${200 + i * 40 + Math.sin(t * 0.7 + i) * 10})`}><ellipse rx={50} ry={60} fill={b.c} /><rect x={-14} y={70} width={28} height={22} fill="#6E4528" /><line x1={-30} y1={40} x2={-12} y2={70} stroke="#555" strokeWidth={2} /><line x1={30} y1={40} x2={12} y2={70} stroke="#555" strokeWidth={2} /></g>)}
      <g transform={`translate(${-sc * 0.2},0)`}>{[0, 1].map((r) => <path key={r} d={`M${r * 1920},620 Q${r * 1920 + 300},520 ${r * 1920 + 700},600 T${r * 1920 + 1400},580 T${r * 1920 + 1920},610 L${r * 1920 + 1920},1080 L${r * 1920},1080Z`} fill={kap > 0.5 ? "#D8B48A" : "#C8B27A"} />)}</g>
      {kap > 0 && <g transform={`translate(${-sc * 0.35},0)`} opacity={kap}>{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M${i * 330 - 40},640 Q${i * 330 - 30},${470 - (i % 3) * 40} ${i * 330},${450 - (i % 3) * 40} Q${i * 330 + 30},${470 - (i % 3) * 40} ${i * 330 + 40},640Z`} fill="#E2C095" />)}</g>}
      <rect y={760} width={1920} height={180} fill="#4A4A4E" />
      {Array.from({ length: 12 }, (_, i) => <rect key={i} x={((i * 220 - sc * 1.2) % 2640 + 2640) % 2640 - 360} y={842} width={120} height={14} fill="#FFF" opacity={0.8} />)}
      <rect y={940} width={1920} height={140} fill={kap > 0.5 ? "#C9A47A" : "#B9A06A"} />
      {/* şehirlerarası otobüs */}
      <g transform={`translate(960,${830 + Math.sin(t * 9) * 2})`}>
        <rect x={-460} y={-300} width={920} height={280} rx={30} fill="#F4F4F4" />
        <rect x={-460} y={-130} width={920} height={40} fill="#C0392B" />
        {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-420 + i * 118} y={-270} width={104} height={110} rx={10} fill="#2A3A55" />)}
        {people && <svg x={-420} y={-270} width={826} height={110} viewBox="0 0 826 110">{people}</svg>}
        <rect x={420} y={-270} width={34} height={150} rx={6} fill="#2A3A55" />
        {tx(0, -98, "ANKARA → NEVŞEHİR", 26, "#FFF", 800, "middle")}
        {[-300, 300].map((x) => <g key={x} transform={`translate(${x},-10) rotate(${(t * 400) % 360})`}><circle r={52} fill="#1A1A1A" /><circle r={22} fill="#888" /><rect x={-4} y={-22} width={8} height={44} fill="#555" /></g>)}
      </g>
    </g>
  );
};

// ───────── taktik tahtası (1920x1080): noktalar, sarı top, akan pas çizgisi
export const TaktikTahta: React.FC<{ t: number; a: number; goal?: boolean }> = ({ t, a, goal = true }) => {
  const k = cl((t - a) / 3);
  const pts: [number, number][] = [[560, 700], [900, 520], [1260, 640], [1560, 470]];
  const seg = k * (pts.length - 1), si = Math.min(pts.length - 2, Math.floor(seg)), f = seg - si;
  const bx = lp(pts[si][0], pts[si + 1][0], f), by = lp(pts[si][1], pts[si + 1][1], f);
  return (
    <g>
      <rect width={1920} height={1080} fill="#1E6B3A" />
      {Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 192} y={0} width={96} height={1080} fill="#FFF" opacity={0.03} />)}
      <rect x={120} y={120} width={1680} height={840} fill="none" stroke="#FFF" strokeWidth={6} opacity={0.8} />
      <line x1={960} y1={120} x2={960} y2={960} stroke="#FFF" strokeWidth={5} opacity={0.8} /><circle cx={960} cy={540} r={120} fill="none" stroke="#FFF" strokeWidth={5} opacity={0.8} />
      <rect x={1620} y={380} width={180} height={320} fill="none" stroke="#FFF" strokeWidth={5} opacity={0.8} /><rect x={1800} y={470} width={40} height={140} fill="none" stroke="#FFF" strokeWidth={5} />
      {[[400, 400], [600, 820], [780, 300], [1100, 860], [1300, 300], [1450, 760]].map(([x, y], i) => <circle key={i} cx={x + Math.sin(t + i) * 8} cy={y + Math.cos(t * 0.8 + i) * 8} r={26} fill="#3EA6FF" stroke="#FFF" strokeWidth={4} />)}
      {[[1500, 560], [1380, 420], [1700, 540], [1250, 760]].map(([x, y], i) => <circle key={i} cx={x + Math.sin(t * 1.2 + i) * 10} cy={y} r={26} fill="#E5322D" stroke="#FFF" strokeWidth={4} />)}
      {pts.map(([x, y], i) => <circle key={i} cx={x} cy={y} r={30} fill="#3EA6FF" stroke="#FFE27A" strokeWidth={6} />)}
      <path d={pts.map((p, i) => `${i ? "L" : "M"}${p[0]},${p[1]}`).join(" ")} stroke="#FFE27A" strokeWidth={8} strokeDasharray="22 16" fill="none" strokeDashoffset={-t * 60} opacity={0.4 + 0.6 * k} />
      <circle cx={k >= 1 && goal ? lp(1560, 1830, cl((t - a - 3) / 0.5)) : bx} cy={k >= 1 && goal ? lp(470, 540, cl((t - a - 3) / 0.5)) : by} r={16} fill="#FFE27A" stroke="#222" strokeWidth={3} />
      {goal && t > a + 3.5 && <g opacity={cl((t - a - 3.5) * 3)}>{tx(960, 110, "GOL!", 90, "#FFE27A", 900, "middle")}</g>}
    </g>
  );
};

// ───────── 5 kanal ızgarası (aynı şablon)
export const KanalIzgara: React.FC<{ t: number; k?: number; n?: number; dead?: number; keep?: number }> = ({ t, k = 1, n = 5, dead = 0, keep = 0 }) => {
  const names = ["Kayıp Harita", "Uzayın Gizemleri", "Osmanlı'nın Sırları", "Tuhaf Hayvanlar", "Korkunç Gerçekler"];
  const cols = ["#8C7347", "#2A3A6E", "#7A3A2A", "#3A7A4A", "#4A2A5A"];
  return (
    <g>
      {names.slice(0, n).map((nm, i) => {
        const kk = cl(k * n - i);
        const x = 260 + (i % 5) * 350, y = 540;
        const isDead = dead > 0 && i > 0;
        return (
          <g key={i} transform={`translate(${x},${y + (1 - kk) * 60})`} opacity={kk * (isDead ? 1 - dead * 0.7 : 1)}>
            <rect x={-150} y={-200} width={300} height={400} rx={22} fill="#1A1E27" stroke={i === 0 && keep > 0 ? "#2BB673" : "#3EA6FF"} strokeWidth={4} />
            <rect x={-130} y={-180} width={260} height={150} rx={10} fill={cols[i]} />
            <path d="M-60,-80 Q0,-140 60,-80" stroke="#FFF" strokeWidth={6} fill="none" opacity={0.6} /><circle cx={0} cy={-105} r={12} fill="#FFF" opacity={0.7} />
            {tx(0, 30, nm.split(" ")[0], 30, "#FFF", 700, "middle")}{tx(0, 66, nm.split(" ").slice(1).join(" "), 26, "#DDD", 600, "middle")}
            {tx(0, 130, "Şablon #1 · aynı ses", 18, "#FFB547", 700, "middle")}
            {[0, 1, 2].map((j) => <rect key={j} x={-110 + j * 78} y={150} width={64} height={30} rx={6} fill="#333" />)}
            {isDead && <><line x1={-130} y1={-180} x2={130} y2={180} stroke="#E5322D" strokeWidth={12} strokeLinecap="round" opacity={dead} /><line x1={130} y1={-180} x2={-130} y2={180} stroke="#E5322D" strokeWidth={12} strokeLinecap="round" opacity={dead} /></>}
          </g>
        );
      })}
      {n === 5 && k >= 1 && dead === 0 && <g transform="translate(960,900)">{tx(0, 0, `Günde ${Math.round(lp(5, 15, cl((t % 3) / 2)))} video`, 54, "#FFE27A", 800, "middle")}</g>}
    </g>
  );
};

// ───────── elektrik faturası
export const Fatura: React.FC<{ x: number; y: number; s?: number; k?: number; prev?: string; now?: string }> = ({ x, y, s = 1, k = 1, prev = "1.180 ₺", now = "2.080 ₺" }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(-3)`} opacity={k}>
    <rect x={-300} y={-380} width={600} height={760} fill="#FBF9F2" />
    <rect x={-300} y={-380} width={600} height={110} fill="#F2B705" />{tx(0, -308, "ELEKTRİK FATURASI", 40, "#222", 800, "middle")}
    {[["Önceki ay", prev], ["Bu ay", now]].map(([l, v], i) => <g key={i}>{tx(-250, -150 + i * 120, l, 36, "#555", 600)}{tx(250, -150 + i * 120, v, 46, i ? "#E5322D" : "#222", 800, "end")}</g>)}
    <line x1={-260} y1={60} x2={260} y2={60} stroke="#CCC" strokeWidth={3} />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-250} y={100 + i * 40} width={300 + hash(i) * 180} height={14} fill="#DDD" />)}
    <g transform="translate(150,280) rotate(-12)"><rect x={-110} y={-44} width={220} height={88} rx={10} fill="none" stroke="#E5322D" strokeWidth={8} />{tx(0, 16, "×1,8", 48, "#E5322D", 900, "middle")}</g>
  </g>
);

// ───────── YouTube yorum ekranı (1000x625)
export const YorumEkran: React.FC<{ k?: number; top: { name: string; text: string; likes: string }[]; title?: string }> = ({ k = 1, top, title = "Yorumlar" }) => (
  <g>
    <rect width={1000} height={625} fill="#0F0F0F" />
    {tx(40, 60, title, 32, "#FFF", 700)}
    {top.map((c, i) => { const kk = cl(k * top.length - i); return (
      <g key={i} transform={`translate(40,${110 + i * 150 + (1 - kk) * 20})`} opacity={kk}>
        <circle cx={34} cy={34} r={34} fill={["#7E5BD6", "#D6825B", "#5BA8D6", "#5BD68E"][i % 4]} />{tx(34, 46, c.name[0].toUpperCase(), 30, "#FFF", 700, "middle")}
        {tx(90, 26, "@" + c.name, 20, "#AAA", 600)}
        {tx(90, 70, c.text, 30, "#FFF", 600)}
        {tx(90, 112, "👍 " + c.likes + "    👎    Yanıtla", 18, "#AAA", 500)}
      </g>
    ); })}
  </g>
);

// ───────── kapı aralığında anne (oda kapısı, koridor ışığı)
export const KapiAralik: React.FC<{ t: number; open?: number; people?: React.ReactNode }> = ({ t, open = 1, people }) => (
  <g>
    <rect width={1920} height={1080} fill="#1E1D24" />
    <rect x={640} y={60} width={640} height={1020} fill="#F2D9A6" opacity={0.85 * open} />
    <path d={`M640,60 L${640 + 640 * (1 - open * 0.6)},90 L${640 + 640 * (1 - open * 0.6)},1050 L640,1080Z`} fill="#6E4A30" />
    <polygon points={`640,1080 1280,1080 1700,${1080} 1280,1080`} fill="#F2D9A6" opacity={0.2} />
    <path d="M640,1080 L1280,1080 L1900,1080 L1280,1000Z" fill="#F2D9A6" opacity={0.12 * open} />
    {people}
    <rect width={1920} height={1080} fill="#000" opacity={0.08 + 0.04 * Math.sin(t * 2)} />
  </g>
);

// ───────── telefon görüşmesi ekranı (360x740)
export const Arama: React.FC<{ name: string; sub?: string; c?: string }> = ({ name, sub = "arıyor…", c = "#C23B32" }) => (
  <g><rect width={360} height={740} fill="#16202E" /><circle cx={180} cy={250} r={74} fill={c} />{tx(180, 274, name[0], 66, "#FFF", 700, "middle")}{tx(180, 382, name, 36, "#FFF", 700, "middle")}{tx(180, 424, sub, 22, "#AAB4C8", 600, "middle")}<circle cx={90} cy={620} r={40} fill="#E5322D" /><circle cx={270} cy={620} r={40} fill="#2BB673" /></g>
);

// ───────── WhatsApp benzeri sohbet (360x740)
export const WaSohbet: React.FC<{ name: string; time?: string; msgs: { me?: boolean; text: string; video?: boolean; note?: string }[]; k?: number; t?: number }> = ({ name, time = "02:47", msgs, k = 1, t = 0 }) => {
  let y = 120;
  return (
    <g>
      <rect width={360} height={740} fill="#0B141A" />
      <rect width={360} height={86} fill="#1F2C34" />{tx(16, 56, "‹", 30, "#DDD", 700)}<circle cx={66} cy={48} r={22} fill="#C23B32" />{tx(66, 56, name[0], 20, "#FFF", 700, "middle")}{tx(98, 46, name, 18, "#FFF", 700)}{tx(98, 68, "çevrimiçi", 13, "#9AA", 500)}
      {msgs.map((m, i) => {
        const kk = cl(k * msgs.length - i);
        const lines = wrapT(m.text, 24);
        const h = (m.video ? 170 : 0) + lines.length * 24 + 34;
        const yy = y; y += h + 14;
        return (
          <g key={i} opacity={kk} transform={`translate(0,${(1 - kk) * 16})`}>
            <rect x={m.me ? 110 : 14} y={yy} width={236} height={h} rx={12} fill={m.me ? "#005C4B" : "#1F2C34"} />
            {m.video && <g transform={`translate(${m.me ? 118 : 22},${yy + 8})`}><rect width={220} height={156} rx={8} fill="#22324A" /><circle cx={110} cy={78} r={30} fill="#000" opacity={0.6} /><path d="M100,62 l26,16 l-26,16z" fill="#FFF" />{tx(210, 146, "00:41", 13, "#FFF", 600, "end")}</g>}
            {lines.map((l, j) => <g key={j}>{tx((m.me ? 110 : 14) + 12, yy + (m.video ? 170 : 0) + 26 + j * 24, l, 16, "#E9EDEF", 500)}</g>)}
            {tx((m.me ? 110 : 14) + 228, yy + h - 8, time, 11, "#8FA", 500, "end")}
          </g>
        );
      })}
      {k < 1 && <g transform="translate(16,640)"><rect width={80} height={40} rx={20} fill="#1F2C34" />{[0, 1, 2].map((i) => <circle key={i} cx={22 + i * 18} cy={20} r={5} fill="#AAA" opacity={0.4 + 0.6 * Math.abs(Math.sin(t * 5 + i))} />)}</g>}
    </g>
  );
};
const wrapT = (s: string, n: number) => { const out: string[] = []; let cur = ""; for (const w of s.split(" ")) { if ((cur + " " + w).trim().length > n && cur) { out.push(cur); cur = w; } else cur = (cur + " " + w).trim(); } if (cur) out.push(cur); return out; };

// ───────── App Store abonelik kartı (telefon 360x740)
export const Abonelik: React.FC<{ plan: string; price: string; k?: number }> = ({ plan, price, k = 1 }) => (
  <g>
    <rect width={360} height={740} fill="#F2F2F7" />
    <g transform={`translate(0,${(1 - k) * 200})`}>
      <rect x={10} y={300} width={340} height={430} rx={20} fill="#FFF" />
      <ClaudeMark x={180} y={380} s={1.1} />
      {tx(180, 470, "Claude " + plan, 28, "#111", 700, "middle")}
      {tx(180, 515, price + " / ay", 26, "#111", 600, "middle")}
      <rect x={40} y={590} width={280} height={60} rx={14} fill="#0A84FF" />{tx(180, 628, "Abone Ol", 22, "#FFF", 700, "middle")}
      {tx(180, 690, "Yan tuşa çift tıklayın", 15, "#888", 500, "middle")}
    </g>
  </g>
);

// ───────── banka: sosyal içerik üreticisi hesabı, %15 kesinti (1920 sahne)
export const Stopaj: React.FC<{ t: number; a: number; usd?: string; gross?: string; net?: string }> = ({ t, a, usd = "112 $", gross = "5.650 ₺", net = "4.800 ₺" }) => {
  const k1 = rp(t, a, a + 0.6), k2 = rp(t, a + 1.2, a + 1.8), k3 = rp(t, a + 2.4, a + 3);
  return (
    <g>
      <g transform={`translate(420,${540 + (1 - k1) * 40})`} opacity={k1}><rect x={-230} y={-160} width={460} height={320} rx={26} fill="#1A1E27" stroke="#E5322D" strokeWidth={4} />{tx(0, -80, "YouTube", 34, "#FFF", 700, "middle")}{tx(0, 30, usd, 96, "#FFF", 800, "middle")}{tx(0, 110, gross, 36, "#AAA", 600, "middle")}</g>
      <g transform={`translate(960,${540 + (1 - k2) * 40})`} opacity={k2}><path d="M-120,0 L120,0" stroke="#FFF" strokeWidth={8} /><path d="M100,-24 L130,0 L100,24" stroke="#FFF" strokeWidth={8} fill="none" /><rect x={-110} y={-130} width={220} height={90} rx={16} fill="#E5322D" />{tx(0, -70, "−%15", 46, "#FFF", 900, "middle")}{tx(0, 90, "vergi kesintisi", 26, "#DDD", 600, "middle")}</g>
      <g transform={`translate(1500,${540 + (1 - k3) * 40})`} opacity={k3}><rect x={-240} y={-160} width={480} height={320} rx={26} fill="#0E2418" stroke="#2BB673" strokeWidth={4} />{tx(0, -80, "Sosyal içerik hesabı", 30, "#DDD", 700, "middle")}{tx(0, 40, net, 96, "#5CF08E", 800, "middle")}</g>
    </g>
  );
};
