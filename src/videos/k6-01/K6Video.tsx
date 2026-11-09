import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k6-01-words.json";
import { makeCue } from "../../lib/cues";
import { Atmos, Sweep, Tone } from "../../components/Live";
import {
  ANNE, AdBars, AgeTag, BABA, BackView, BankCard, Big, Box, Bulb, COCUK, Comment, Counter, DM, Door, EDITOR, EditApp, H, HCam, HFrame, KUZEN, Kafe, Kisla,
  Laptop, LineChart, LockScreen, Look, Mail, Mic, News, Notif, Paper, People100, Person, Phone, PlayLogo, Plaque, Progress, SEN16, SEN20, SEN23, SEN26,
  Salon, Stat, Strike, Studio, StudioShell, SubBtn, TeaGlass, TeenRoom, Thumb, Verdict, VideoRow, Yurt, cl, fmt, lp, rp, short,
} from "../../components/Hayat";

// Kanal 6 · k6-01 · "7 İzlenmeden 1 Milyon Aboneye: Türkiye'de YouTuber Olarak Hayatın"
// Ses: ElevenLabs Hasan Yasin (eleven_v4), kelime zamanları Scribe. Seviye kartı YOK; geçiş yaş etiketiyle.

const W = words as { text: string; start: number; end: number }[];
const cueRaw = makeCue(W);
const cue = (p: string, after = 0) => cueRaw(p, after);
const VOICE_END = W[W.length - 1].end;
export const K6_01_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone };

const SEN18: Look = { ...SEN16, top: "#2F3B4C", top2: "#232D3B", hairStyle: "fade" };
const SEN22: Look = { ...SEN20, top: "#2D3440", top2: "#222831", kind: "shirt" };
const UI = "Poppins";
const tx = (x: number, y: number, s: string, size = 24, c = "#FFF", w = 600, anchor: "start" | "middle" | "end" = "start") => <text x={x} y={y} fontFamily={UI} fontWeight={w} fontSize={size} fill={c} textAnchor={anchor}>{s}</text>;

// ───────── sahne yardımcıları ─────────
// laptopun arkası (karşıdan çekimde masada)
const LidBack: React.FC<{ x: number; y: number; s?: number; old?: boolean; glow?: number }> = ({ x, y, s = 1, old, glow = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={-120} rx={420} ry={260} fill="url(#hGlow)" opacity={glow} />
    <path d="M-300,0 L-270,-330 L270,-330 L300,0Z" fill={old ? "#4A4D54" : "#2B2E35"} />
    <path d="M-270,-330 L270,-330 L262,-300 L-262,-300Z" fill="#FFF" opacity={0.06} />
    {old && <><circle cx={-120} cy={-200} r={36} fill="#3EA6FF" opacity={0.5} /><rect x={60} y={-240} width={110} height={60} rx={10} fill="#F6C445" opacity={0.6} transform="rotate(12 115 -210)" /></>}
    <rect x={-330} y={0} width={660} height={18} rx={6} fill={old ? "#55585F" : "#33363D"} />
  </g>
);

// karşıdan: odada masada oturan sen + laptop arkası
const desk = (t: number, a: number, b: number, o: Look, p: { z?: [number, number]; c0?: [number, number]; c1?: [number, number]; mouth?: any; brow?: any; eyes?: any; arms?: any; look?: number; lookY?: number; bg?: "room" | "yurt" | "kafe" | "studio" | "kisla"; old?: boolean; extra?: React.ReactNode; slump?: number; talk?: boolean; hold?: React.ReactNode; night?: boolean } = {}) => {
  const bg = p.bg ?? "room";
  return (
    <HCam t={t} a={a} b={b} z={p.z ?? [1.25, 1.4]} c0={p.c0 ?? [960, 520]} c1={p.c1}>
      {bg === "room" && <TeenRoom t={t} night={p.night ?? true} poster={o === SEN16 ? "MC" : "X"} />}
      {bg === "yurt" && <Yurt t={t} />}
      {bg === "kafe" && <Kafe t={t} />}
      {bg === "studio" && <Studio t={t} />}
      {bg === "kisla" && <Kisla t={t} />}
      <Person x={960} y={880} s={0.95} t={t} o={o} arms={p.arms ?? "type"} mouth={p.mouth ?? "flat"} brow={p.brow} eyes={p.eyes} look={p.look ?? 0} lookY={p.lookY ?? 0.6} lit={1} slump={p.slump} talk={p.talk} hold={p.hold} />
      <rect x={300} y={860} width={1320} height={30} fill={bg === "studio" ? "#3A3F4A" : H.wood} /><rect x={300} y={890} width={1320} height={200} fill={bg === "studio" ? "#2A2E36" : H.wood2} />
      {(p.arms ?? "type") !== "phone" && <LidBack x={960} y={870} s={0.9} old={p.old ?? o === SEN16} />}
      <TeaGlass x={1420} y={860} s={0.9} t={t} />
      {p.extra}
    </HCam>
  );
};

// omuz üstünden: arkadan sen + laptop ekranı (içerik 1000x625)
const over = (t: number, a: number, b: number, o: Look, screen: React.ReactNode, p: { z?: [number, number]; c0?: [number, number]; c1?: [number, number]; old?: boolean; bg?: "room" | "yurt" | "kafe" | "studio" | "kisla"; type?: boolean; slump?: number } = {}) => {
  const bg = p.bg ?? "room";
  return (
    <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.12]} c0={p.c0 ?? [1000, 480]} c1={p.c1}>
      <g style={{ filter: "blur(5px)" }}>
        {bg === "room" && <TeenRoom t={t} poster={o === SEN16 ? "MC" : "X"} />}
        {bg === "yurt" && <Yurt t={t} />}
        {bg === "kafe" && <Kafe t={t} />}
        {bg === "studio" && <Studio t={t} />}
        {bg === "kisla" && <Kisla t={t} />}
      </g>
      <rect y={790} width={1920} height={290} fill={bg === "studio" ? "#2A2E36" : H.wood2} />
      <Laptop x={1080} y={470} s={0.78} old={p.old ?? o === SEN16} t={o === SEN16 ? t : 0}>{screen}</Laptop>
      <ellipse cx={1080} cy={480} rx={700} ry={420} fill="url(#hGlow)" opacity={0.35} />
      <BackView x={430} y={1260} s={1.05} t={t} o={o} type={p.type ?? true} slump={p.slump} />
    </HCam>
  );
};

// ekran yakın çekim (laptop ekranı neredeyse tam kadraj)
const scr = (t: number, a: number, b: number, screen: React.ReactNode, p: { z?: [number, number]; c0?: [number, number]; c1?: [number, number]; old?: boolean } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1.55, 1.7]} c0={p.c0 ?? [960, 520]} c1={p.c1} k={0.6}>
    <rect width={1920} height={1080} fill="#0B0D12" />
    <Laptop x={960} y={560} s={1} old={p.old} t={p.old ? t : 0}>{screen}</Laptop>
  </HCam>
);

// telefon elde (yakın), arka plan bulanık
const ph = (t: number, a: number, b: number, screen: React.ReactNode, p: { bg?: "room" | "yurt" | "kafe" | "studio" | "kisla" | "salon"; z?: [number, number]; light?: boolean; rot?: number; c0?: [number, number]; c1?: [number, number] } = {}) => {
  const bg = p.bg ?? "room";
  const by = Math.sin(t * 1.4) * 6;
  return (
    <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.08]} c0={p.c0 ?? [960, 540]} c1={p.c1}>
      <g style={{ filter: "blur(9px)" }}>
        {bg === "room" && <TeenRoom t={t} poster="MC" />}{bg === "yurt" && <Yurt t={t} />}{bg === "kafe" && <Kafe t={t} />}{bg === "studio" && <Studio t={t} />}{bg === "kisla" && <Kisla t={t} />}{bg === "salon" && <Salon t={t} />}
      </g>
      <rect width={1920} height={1080} fill="#000" opacity={0.35} />
      <g transform={`translate(0,${by})`}>
        <Phone x={960} y={560} s={1.18} rot={p.rot ?? -3} light={p.light}>{screen}</Phone>
        {[-1, 1].map((d) => <g key={d}><path d={`M${960 + d * 250},${1180} Q${960 + d * 260},${900} ${960 + d * 215},${760}`} stroke={H.skin} strokeWidth={90} strokeLinecap="round" fill="none" /><ellipse cx={960 + d * 222} cy={720} rx={34} ry={60} fill={H.skin2} /></g>)}
      </g>
    </HCam>
  );
};

// düz grafik sahnesi (koyu, temiz)
const board = (t: number, a: number, b: number, children: React.ReactNode, p: { z?: [number, number]; bg?: string } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.06]} k={0.5}>
    <rect width={1920} height={1080} fill={p.bg ?? "#10131A"} />
    {Array.from({ length: 20 }, (_, i) => <line key={i} x1={i * 100} x2={i * 100} y1={0} y2={1080} stroke="#FFF" opacity={0.025} />)}
    {children}
  </HCam>
);

// kanal içerik listesi
const list = (rows: { title: string; views: number; kind?: any; date?: string }[], k: number, hi = -1, title = "Kanal içeriği") => (
  <StudioShell title={title}>
    {rows.map((r, i) => <g key={i} opacity={cl(k * rows.length - i)}><VideoRow x={0} y={20 + i * 112} title={r.title} views={r.views} kind={r.kind ?? "mc"} hi={i === hi ? 1 : 0} w={760} date={r.date} /></g>)}
  </StudioShell>
);

// sayaç ekranı: abone
const subsScreen = (v: number, label = "Abone", delta?: string) => (
  <StudioShell title="Kanal analizi">
    <Stat x={0} y={10} label={label} value={fmt(v)} w={360} c="#FFF" delta={delta} pulse={1} />
    <Stat x={380} y={10} label="İzlenme (28 gün)" value={short(v * 34)} w={380} />
    <LineChart x={0} y={180} w={760} h={280} pts={[0.05, 0.08, 0.1, 0.12, 0.2, 0.3, 0.42, 0.5, 0.62, 0.8, 0.9]} k={1} />
  </StudioShell>
);

// yükleme ekranı
const upload = (k: number, fail = -1) => (
  <g>
    <rect width={1000} height={625} fill={H.ui} />
    <rect x={150} y={80} width={700} height={470} rx={14} fill={H.ui2} />
    {tx(190, 140, "Video yükleniyor", 30, "#FFF", 700)}
    <Thumb x={190} y={180} w={280} kind="mc" />
    {tx(500, 210, "Minecraft'ta 100 Gün", 22, "#EEE")}{tx(500, 245, "Hayatta Kaldım", 22, "#EEE")}
    {fail >= 0 ? <>{tx(500, 300, "Bağlantı koptu", 22, "#FF6B6B", 700)}{tx(500, 335, `Deneme ${fail}/3`, 20, H.dim)}</> : tx(500, 300, `%${Math.round(k * 100)} yüklendi`, 22, H.dim)}
    <Progress x={190} y={450} w={620} v={k} c={fail >= 0 ? "#E5322D" : H.blue} />
  </g>
);

// takvim (sayfa çevirme)
const cal = (t: number, a: number, top: string, big: string, sub?: string, x = 960, y = 520, s = 1) => {
  const k = rp(t, a, a + 0.5);
  return (
    <g transform={`translate(${x},${y + (1 - k) * 40}) scale(${s})`} opacity={k}>
      <rect x={-230} y={-250} width={460} height={500} rx={24} fill="#FFF" />
      <rect x={-230} y={-250} width={460} height={120} rx={24} fill={H.red} /><rect x={-230} y={-160} width={460} height={30} fill={H.red} />
      {tx(0, -170, top, 50, "#FFF", 700, "middle")}
      {tx(0, 80, big, big.length > 4 ? 110 : 170, "#1C1C1C", 700, "middle")}
      {sub && tx(0, 190, sub, 40, "#777", 600, "middle")}
      {[-130, 130].map((xx) => <rect key={xx} x={xx - 10} y={-280} width={20} height={60} rx={10} fill="#555" />)}
    </g>
  );
};

// kart dizisi (3 madde)
const cards = (t: number, a: number, items: string[], c = H.red, y = 520) => (
  <g>{items.map((s, i) => { const k = rp(t, a + i * 0.6, a + i * 0.6 + 0.4); const x = 960 + (i - (items.length - 1) / 2) * 560; return <g key={i} transform={`translate(${x},${y + (1 - k) * 60})`} opacity={k}><rect x={-250} y={-150} width={500} height={300} rx={26} fill="#1A1E27" stroke={c} strokeWidth={4} /><circle cx={0} cy={-80} r={40} fill={c} />{tx(0, -66, String(i + 1), 44, "#FFF", 700, "middle")}{s.split("\n").map((l, j) => <g key={j}>{tx(0, 30 + j * 52, l, 42, "#FFF", 700, "middle")}</g>)}</g>; })}</g>
);

// yazı balonu
const bub = (t: number, at: number, x: number, y: number, s: string, size = 40, tail: 1 | -1 = -1) => {
  if (t < at) return null;
  const k = rp(t, at, at + 0.3);
  const w = s.length * size * 0.55 + 80;
  return <g transform={`translate(${x},${y}) scale(${0.7 + 0.3 * k})`} opacity={k}><rect x={-w / 2} y={-60} width={w} height={120} rx={44} fill="#FFF" /><path d={`M${tail * 40},56 L${tail * 80},110 L${tail * 100},56Z`} fill="#FFF" />{tx(0, size * 0.36, s, size, "#141414", 700, "middle")}</g>;
};

// saat
const Clock: React.FC<{ x: number; y: number; s?: number; h: number; m: number; spin?: number }> = ({ x, y, s = 1, h, m, spin = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={150} fill="#F4F1EA" stroke="#222" strokeWidth={12} />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-4} y={-140} width={8} height={22} fill="#333" transform={`rotate(${i * 30})`} />)}
    <rect x={-6} y={-80} width={12} height={84} rx={6} fill="#222" transform={`rotate(${(h % 12) * 30 + m * 0.5 + spin * 30})`} />
    <rect x={-4} y={-120} width={8} height={124} rx={4} fill="#C0392B" transform={`rotate(${m * 6 + spin * 360})`} />
    <circle r={12} fill="#222" />
  </g>
);

// tarayıcı (arama sonuçları)
const browser = (q: string, results: string[], k = 1, tabs = 3) => (
  <g>
    <rect width={1000} height={625} fill="#FFF" />
    <rect width={1000} height={44} fill="#DEE1E6" />
    {Array.from({ length: tabs }, (_, i) => <g key={i}><rect x={10 + i * 190} y={8} width={180} height={36} rx={8} fill={i === 0 ? "#FFF" : "#CDD1D6"} />{tx(28 + i * 190, 32, ["Arama", "Forum", "Video"][i % 3], 15, "#333", 500)}</g>)}
    <rect x={0} y={44} width={1000} height={46} fill="#FFF" /><rect x={60} y={52} width={700} height={30} rx={15} fill="#F1F3F4" />{tx(80, 73, q, 16, "#222", 500)}
    {results.map((r, i) => <g key={i} opacity={cl(k * results.length - i)}>{tx(60, 140 + i * 92, r, 22, "#1A0DAB", 600)}{tx(60, 170 + i * 92, "…kayıt ücreti, cihaz, süre, gümrük…", 15, "#4D5156", 500)}</g>)}
  </g>
);

// yapay zekâ sohbet ekranı (marka yok)
const aiChat = (k: number, t: number) => (
  <g>
    <rect width={1000} height={625} fill="#1E1F22" />
    <rect x={0} y={0} width={200} height={625} fill="#16171A" />{tx(24, 50, "Asistan", 22, "#FFF", 700)}
    <rect x={560} y={60} width={400} height={60} rx={20} fill="#2E3036" />{tx(580, 98, "Taslak çıkar: IMEI ücretleri", 17, "#EEE", 500)}
    <circle cx={236} cy={170} r={18} fill="#D97757" />
    {Array.from({ length: 9 }, (_, i) => <rect key={i} x={270} y={154 + i * 34} width={(640 - (i % 3) * 120) * cl(k * 9 - i)} height={14} rx={7} fill="#5A5D66" />)}
    {k > 0.9 && <rect x={270} y={154 + 9 * 34} width={10} height={20} fill="#FFF" opacity={Math.floor(t * 3) % 2} />}
  </g>
);

const G2 = (t: number) => <g>{Array.from({ length: 12 }, (_, i) => { const x = 140 + (i % 4) * 420, y = 120 + Math.floor(i / 4) * 300; return <g key={i}><Thumb x={x} y={y} w={380} kind={i === 6 ? "mc" : "mc"} />{tx(x, y + 245, ["MEGA Kanal", "ProOyun", "BüyükYayın", "Usta TR"][i % 4], 22, "#DDD")}{tx(x + 380, y + 245, `${[2, 5, 1, 3][i % 4]} Mn`, 22, "#AAA", 600, "end")}</g>; })}</g>;

// ───────── ÇEKİMLER ─────────
const SHOTS: Sh[] = [
  // ── KANCA
  { c: "İlk videon tam yedi", r: (t, a, b) => scr(t, a, b, list([{ title: "Minecraft'ta 100 Gün Hayatta Kaldım", views: Math.round(lp(0, 7, rp(t, a + 0.4, a + 2.2))), date: "Yayınlandı" }], 1, 0), { old: true, z: [1.5, 1.95], c0: [900, 420], c1: [1130, 380] }), html: (t, a) => <Big t={t} at={a + 1.6} text="7 İZLENME" y={760} size={110} /> , sfx: "pop" },
  { c: "Dördü sensin", r: (t, a, b) => over(t, a, b, SEN16, list([{ title: "Minecraft'ta 100 Gün Hayatta Kaldım", views: 7 }], 1, 0), { z: [1.05, 1.2] }), html: (t, a) => <>{Array.from({ length: 7 }, (_, i) => { const k = rp(t, a + i * 0.12, a + i * 0.12 + 0.3); return <div key={i} style={{ position: "absolute", left: 470 + i * 140, top: 120, width: 110, height: 110, borderRadius: 60, background: i < 4 ? H.red : "#555", opacity: k, transform: `scale(${0.5 + 0.5 * k})`, color: "#FFF", fontFamily: UI, fontWeight: 700, fontSize: 30, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 8px 20px rgba(0,0,0,.4)" }}>{i < 4 ? "SEN" : i === 4 ? "ANNE" : "?"}</div>; })}</> },
  { c: "Biri annen", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[900, 420]}><Salon t={t} /><Person x={900} y={1000} s={0.95} t={t} o={ANNE} arms="phone" eyes="wide" brow="up" mouth="o" lookY={0.8} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.8} text="1'i annen" sub="(yanlışlıkla tıkladı)" y={70} size={80} /> },
  { c: "On altı yaşındasın", r: (t, a, b) => desk(t, a, b, SEN16, { z: [1, 1.12], c0: [960, 540], mouth: "smile" }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="16 yaş" place="Eskişehir" /> },
  { c: "odanın kapısını kilitleyip", r: (t, a, b) => { const k = rp(t, a + 0.6, a + 1.4); return <HCam t={t} a={a} b={b} z={[1.6, 1.9]} c0={[1000, 560]}><Door t={t} /><g transform={`translate(1210,560) rotate(${k * 90})`}><rect x={-14} y={-60} width={28} height={80} rx={6} fill="#C9A23A" /><circle cy={-70} r={30} fill="#D4AF37" /><circle cy={-70} r={12} fill="#7A4B2C" /></g></HCam>; }, sfx: "tick" },
  { c: "YouTube'a ilk videonu", r: (t, a, b) => over(t, a, b, SEN16, upload(rp(t, a + 0.2, b - 0.3)), { z: [1.15, 1.3], c0: [1060, 470] }) },
  { c: "Şimdi seninle birlikte", r: (t, a, b) => board(t, a, b, <g><LineChart x={260} y={260} w={1400} h={520} pts={[0.01, 0.01, 0.02, 0.05, 0.04, 0.12, 0.1, 0.22, 0.3, 0.28, 0.45, 0.6, 0.72, 0.9, 1]} k={rp(t, a + 0.3, b - 0.2)} c={H.red} />{tx(260, 830, "7 izlenme", 44, "#FFF", 700)}{tx(1660, 230, "1.000.000 abone", 44, "#FFF", 700, "end")}</g>) },
  { c: "Neyi yanlış yapacağını", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Hatalar", "Para nereden\ngeliyor?", "Kimsenin\nanlatmadıkları"])) },
  { c: "Ve en sonunda", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.1]}><rect width={1920} height={1080} fill="#0E1016" /><g style={{ filter: "blur(10px)" }} opacity={0.6}>{[0, 1, 2].map((i) => <rect key={i} x={460} y={330 + i * 140} width={1000} height={70} rx={14} fill={["#E5322D", "#2BB673", "#FFB547"][i]} />)}</g></HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="Bu iş gerçekten değer mi?" y={440} size={100} c="#FFC531" /> },
  // ── 16 YAŞ: ALETLER
  { c: "Elinde ablandan kalan", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.15]} c0={[960, 600]}><TeenRoom t={t} /><rect y={760} width={1920} height={320} fill={H.wood} /><Laptop x={960} y={520} s={0.75} old t={t}><rect width={1000} height={625} fill="#0A2A5A" />{tx(500, 330, "Hoş geldiniz", 40, "#FFF", 600, "middle")}</Laptop><g transform="translate(1420,620) rotate(10)"><rect x={-90} y={-40} width={180} height={80} rx={10} fill="#F6C445" />{tx(0, 10, "ABLA", 30, "#333", 700, "middle")}</g></HCam>, html: (t, a) => <Big t={t} at={a + 0.8} text="Abladan kalan eski laptop" y={70} size={64} /> },
  { c: "Chrome'da üç sekme", r: (t, a, b) => { const sh = rp(t, a + 1.2, a + 1.6); return <g transform={`translate(${Math.sin(t * 60) * 5 * sh},0)`}>{scr(t, a, b, <g>{browser("minecraft hayatta kalma", ["Minecraft Rehberi", "Yeni sürüm", "Sunucu listesi"], 1)}<rect width={1000} height={625} fill="#000" opacity={0.15 * sh} /></g>, { old: true, z: [1.35, 1.45], c0: [960, 470] })}</g>; }, html: (t, a) => <Big t={t} at={a + 1.4} text="FAN: ✈️ VVVVV" y={80} size={70} c="#FFB547" /> },
  { c: "Montaj programı kurmayı", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#0A2A5A" /><g transform="translate(500,312)"><rect x={-300} y={-120} width={600} height={240} rx={8} fill="#F0F0F0" /><rect x={-300} y={-120} width={600} height={40} fill="#DDD" />{tx(-280, -92, "Montaj Pro (Yanıt Vermiyor)", 17, "#222", 600)}{tx(-200, 0, "Program yanıt vermiyor.", 22, "#222", 600)}<circle cx={-250} cy={-6} r={24} fill="#E5322D" />{tx(-250, 4, "×", 30, "#FFF", 700, "middle")}<rect x={140} y={60} width={130} height={40} rx={6} fill="#3E6FD8" />{tx(205, 86, "Kapat", 18, "#FFF", 600, "middle")}</g></g>, { old: true }), sfx: "buzz" },
  { c: "O yüzden videoları telefonda", r: (t, a, b) => ph(t, a, b, <EditApp t={t} k={rp(t, a + 1, a + 1.3)} />, { c0: [960, 540], z: [1.05, 1.2] }), html: (t, a) => <Big t={t} at={a + 0.5} text="Telefonda montaj" y={70} size={64} /> },
  { c: "kapak görsellerini Canva'da", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#EDEFF3" /><rect width={1000} height={50} fill="#7D2AE8" />{tx(20, 34, "Tasarım", 20, "#FFF", 700)}<rect x={0} y={50} width={150} height={575} fill="#FFF" />{Array.from({ length: 6 }, (_, i) => <rect key={i} x={20} y={80 + i * 80} width={110} height={60} rx={8} fill="#E3E6EC" />)}<g transform="translate(230,140) scale(1.95)"><Thumb x={0} y={0} w={320} kind="bad" /></g></g>, { old: true, z: [1.45, 1.6] }) },
  { c: "Harçlığının iki haftasını", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.8, 2.2]} c0={[960, 560]}><rect width={1920} height={1080} fill="#E9E4DA" /><rect y={620} width={1920} height={460} fill={H.wood} /><Mic x={960} y={520} s={4} /><g transform="translate(1260,460) rotate(-8)"><rect x={-120} y={-50} width={240} height={100} rx={14} fill="#FFF" stroke="#C0392B" strokeWidth={5} />{tx(0, 14, "2 hafta harçlık", 26, "#C0392B", 700, "middle")}</g></HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="Yaka mikrofonu" sub="2 haftalık harçlık" y={70} size={64} /> },
  { c: "Annen fiyatını sorunca", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 480]}><Salon t={t} /><Person x={620} y={1060} s={0.95} t={t} o={ANNE} arms="cross" brow="worry" mouth="tight" look={0.6} talk={t < a + 1.2} /><Person x={1300} y={1060} s={0.9} t={t} o={SEN16} dir={-1} arms="down" mouth="smile" eyes="half" look={-0.4} talk={t > a + 1.4} />{bub(t, a + 0.2, 620, 300, "Kaç para bu?", 40, 1)}{bub(t, a + 1.4, 1320, 300, "Okulda lazımdı!", 40)}</HCam> },
  { c: "Konu belli: Minecraft", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[520, 360]}><TeenRoom t={t} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="Konu: Minecraft" y={760} size={80} /> },
  { c: "Çünkü sınıftaki herkes", r: (t, a, b) => ph(t, a, b, <DM name="10-B Sınıfı 🎮" msgs={[{ text: "Akşam Minecraft?" }, { text: "Ben varım, sunucu açtım" }, { text: "Herkes geliyo" }, { me: true, text: "Ben de geliyorum!" }]} k={rp(t, a, b - 0.3)} t={t} />) },
  { c: "İlk videonun adı", r: (t, a, b) => board(t, a, b, <g><g transform={`translate(560,170) scale(2.5)`}><Thumb x={0} y={0} w={320} kind="bad" label="12:41" /></g></g>), html: (t, a) => <Big t={t} at={a + 0.5} text={"\"Minecraft'ta 100 Gün Hayatta Kaldım\""} y={850} size={56} /> },
  { c: "Ama sadece üç gün", r: (t, a, b) => <g>{desk(t, a, b, SEN16, { mouth: "sad", brow: "angry", arms: "chin", z: [1.6, 1.8], c0: [960, 420] })}</g>, html: (t, a, b) => <Big t={t} at={a + 0.4} text={`Dünya yükleniyor… %${Math.min(37, Math.round(rp(t, a + 0.4, a + 2) * 37))}`} sub="(donuyor)" y={760} size={60} /> },
  { c: "İlk beş video", r: (t, a, b) => scr(t, a, b, list([{ title: "Minecraft'ta 100 Gün Hayatta Kaldım", views: 7 }, { title: "İlk Elmasımı Buldum!!", views: 23 }, { title: "Köylülerle Ticaret", views: 11 }, { title: "Creeper Evimi Patlattı", views: 40 }, { title: "Ender Ejderhası Part 1", views: 16 }], rp(t, a + 0.2, a + 3.2)), { old: true, z: [1.45, 1.6], c0: [960, 560] }), sfx: "pop" },
  { c: "Hatalar aslında çok klasik", r: (t, a, b) => over(t, a, b, SEN16, list([{ title: "Ender Ejderhası Part 1", views: 16 }], 1), { slump: 1, z: [1, 1.06] }), html: (t, a) => <Big t={t} at={a + 0.3} text="3 klasik hata" y={80} size={90} c="#FFC531" /> },
  { c: "Her videoya bir dakikalık", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#000" /><Thumb x={60} y={20} w={880} kind="mc" /><rect x={0} y={560} width={1000} height={65} fill="#000" opacity={0.8} /><rect x={20} y={575} width={960} height={6} fill="#444" /><rect x={20} y={575} width={960 * 0.12 * rp(t, a, b)} height={6} fill={H.red} />{tx(20, 610, `0:${String(Math.floor(lp(0, 59, rp(t, a, b)))).padStart(2, "0")} / 8:14`, 18, "#FFF", 500)}</g>, { z: [1.5, 1.6] }), html: (t, a) => <Big t={t} at={a + 0.6} text={"\"Merhaba arkadaşlar, kanalıma hoş geldiniz…\""} y={830} size={50} /> },
  { c: "İnsanlar daha ilk on", r: (t, a, b) => board(t, a, b, <g><LineChart x={260} y={200} w={1400} h={560} pts={[1, 0.62, 0.4, 0.3, 0.26, 0.24, 0.22, 0.21, 0.2]} k={rp(t, a + 0.2, b - 0.2)} c={H.red} mark={0.125} />{tx(260, 820, "0:00", 32, "#AAA")}{tx(435, 820, "0:10", 32, "#FFF", 700)}{tx(1660, 820, "8:14", 32, "#AAA", 600, "end")}{tx(260, 170, "İzleyiciler", 34, "#FFF", 700)}</g>), html: (t, a) => <Big t={t} at={a + 1} text="İlk 10 saniyede kaçıyorlar" y={60} size={60} /> },
  { c: "Kapak görseline beş yazı", r: (t, a, b) => board(t, a, b, <g transform={`translate(${lp(460, 300, rp(t, a, b))},150) scale(${lp(3, 3.6, rp(t, a, b))})`}><Thumb x={0} y={0} w={320} kind="bad" /></g>), html: (t, a) => <>{["5 yazı", "3 emoji", "1 kırmızı ok"].map((s, i) => <Big key={s} t={t} at={a + 0.4 + i * 0.7} text={s} y={720 + 0} x={480 + i * 480} size={56} c={["#FFF", "#FFC531", "#FF6B6B"][i]} />)}</> },
  { c: "Telefondan bakınca", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#0F0F0F" />{Array.from({ length: 4 }, (_, i) => <g key={i} transform={`translate(12,${70 + i * 170})`}><Thumb x={0} y={0} w={200} kind={i === 1 ? "bad" : "mc"} />{tx(212, 30, ["Usta TR", "Sen", "ProOyun", "Mega"][i], 14, "#FFF")}{tx(212, 52, ["2 Mn", "7", "800 B", "1 Mn"][i], 13, "#AAA")}</g>)}</g>, { z: [1.2, 1.6], c0: [900, 600], c1: [900, 520] }), html: (t, a) => <Big t={t} at={a + 1} text="Hiçbiri okunmuyor" y={80} size={64} /> },
  { c: "Bir de aynı oyunu", r: (t, a, b) => board(t, a, b, G2(t), { z: [1.25, 1] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Aynı oyun, yüzlerce büyük kanal" y={470} size={64} /> },
  { c: "Yani seni izlemek", r: (t, a, b) => desk(t, a, b, SEN16, { mouth: "sad", brow: "worry", arms: "chin", z: [1.7, 1.9], c0: [960, 400], lookY: 0.9 }), html: (t, a) => <Big t={t} at={a + 0.5} text="Seni izlemek için sebep yok" y={760} size={60} /> },
  { c: "Üç ay sonra otuz bir", r: (t, a, b) => scr(t, a, b, subsScreen(Math.round(lp(7, 31, rp(t, a + 0.4, a + 2.2))), "Abone"), { old: true, z: [1.6, 1.9], c0: [700, 300], c1: [760, 320] }), html: (t, a) => <Big t={t} at={a + 1.8} text="3 ay: 31 abone" y={800} size={70} /> },
  { c: "Kuzenin, sınıf arkadaşların", r: (t, a, b) => board(t, a, b, <g>{[["Kuzen", "#7E5BD6"], ["Sınıf arkadaşın", "#2BB673"], ["Sınıf arkadaşın", "#F28C28"], ["Senin ikinci hesabın", "#3EA6FF"]].map(([n, c], i) => { const k = rp(t, a + i * 0.6, a + i * 0.6 + 0.4); return <g key={i} transform={`translate(560,${200 + i * 170 + (1 - k) * 30})`} opacity={k}><rect x={-40} y={-60} width={880} height={130} rx={20} fill="#1A1E27" /><circle cx={40} cy={4} r={46} fill={c} />{tx(120, 20, n, 46, "#FFF", 700)}{tx(800, 20, "Abone", 30, "#AAA", 600, "end")}</g>; })}</g>), sfx: "pop" },
  { c: "İlk gerçek yorum", r: (t, a, b) => scr(t, a, b, <StudioShell title="Yorumlar"><Comment x={0} y={30} name="@mert_34" text={"Kardeşim ses çok kötü, ben çıktım."} k={rp(t, a + 0.3, a + 0.8)} ago="3 dk önce" c="#E86A92" w={760} /></StudioShell>, { old: true, z: [1.8, 2.1], c0: [760, 330] }), sfx: "pop" },
  { c: "Yorumu üç kez okuyorsun", r: (t, a, b) => desk(t, a, b, SEN16, { mouth: "tight", brow: "worry", arms: "chin", z: [2.1, 2.3], c0: [960, 360], lookY: 0.7 }), html: (t, a) => <><Big t={t} at={a + 1.4} text="Sil" x={700} y={800} size={64} c="#FF6B6B" /><Big t={t} at={a + 1.8} text="Cevap ver" x={1220} y={800} size={64} c="#3EA6FF" /></> },
  { c: "Babanın tek bir cümlesi", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.55]} c0={[900, 440]}><Salon t={t} /><Person x={900} y={1060} s={1} t={t} o={BABA} arms="cross" mouth="flat" brow="angry" talk={t > a + 1.2} look={0.4} /></HCam>, html: (t, a) => <Big t={t} at={a + 1.3} text={"\"Önce YKS, sonra YouTube.\""} y={80} size={76} c="#FFC531" /> },
  // ── KUZEN VE IMEI
  { c: "Bir akşam kuzenin Almanya'dan", r: (t, a, b) => { const k = rp(t, a, a + 2); return <HCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 520]}><Salon t={t} /><Person x={lp(1900, 1250, k)} y={1060} s={0.95} t={t} o={KUZEN} dir={-1} arms={k < 1 ? "down" : "wave"} mouth="grin" /><g transform={`translate(${lp(2100, 1480, k)},1000)`}><rect x={-80} y={-150} width={160} height={200} rx={20} fill="#223A5E" /><rect x={-40} y={-190} width={80} height={44} rx={10} fill="none" stroke="#111" strokeWidth={10} /></g><Person x={560} y={1060} s={0.9} t={t} o={SEN16} arms="down" mouth="smile" look={0.8} /></HCam>; }, html: (t, a) => <Big t={t} at={a + 0.5} text="Kuzen · Almanya'dan" y={70} size={60} /> },
  { c: "Yeni bir telefon almış", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[1000, 440]}><Salon t={t} /><Person x={1000} y={1060} s={1} t={t} o={KUZEN} arms="hold" mouth="grin" eyes="open" hold={<g transform="rotate(-10)"><rect x={-70} y={-130} width={140} height={260} rx={22} fill="#111" /><rect x={-60} y={-118} width={120} height={236} rx={16} fill="#3A6FD8" /></g>} /></HCam> },
  { c: "Ama Türkiye'de kullanabilmek", r: (t, a, b) => ph(t, a, b, <g><LockScreen time="21:08" date="Cuma"><Notif x={0} y={0} app="Sistem" title="Kayıt dışı cihaz" body="IMEI kaydı yapılmazsa hat çalışmaz" icon="#E5322D" k={rp(t, a + 0.4, a + 0.9)} /></LockScreen></g>, { bg: "salon" }), sfx: "pop" },
  { c: "Ücreti duyunca", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2, 2.4]} c0={[1000, 380]}><Salon t={t} /><Person x={1000} y={1060} s={1} t={t} o={KUZEN} arms="hold" mouth="o" eyes="wide" brow="up" hold={<g><rect x={-70} y={-130} width={140} height={260} rx={22} fill="#111" /></g>} /></HCam>, html: (t, a) => <Big t={t} at={a + 1.2} text="Kayıt ücreti ≈ telefonun fiyatı" y={800} size={64} c="#FF6B6B" /> },
  { c: "Bütün akşam bunu araştırıyorsun", r: (t, a, b) => over(t, a, b, SEN16, browser("yurt dışından telefon imei kayıt ücreti", ["IMEI kayıt ücreti ne kadar?", "Yurt dışı telefon getirmek mantıklı mı?", "Hangi model zarar ettirir?", "Pasaport ile kayıt süresi"], rp(t, a + 0.2, b - 0.5), 3), { z: [1.1, 1.25], c0: [1060, 470] }) },
  { c: "Hangi telefonu getirmek", r: (t, a, b) => board(t, a, b, <g>{[["Telefon A", true], ["Telefon B", false], ["Telefon C", true]].map(([n, ok], i) => { const k = rp(t, a + i * 0.5, a + i * 0.5 + 0.4); return <g key={i} transform={`translate(${420 + i * 540},540)`} opacity={k}><rect x={-100} y={-200} width={200} height={380} rx={34} fill="#1A1C22" stroke="#666" strokeWidth={6} /><rect x={-84} y={-180} width={168} height={330} rx={22} fill={["#2C4A7A", "#4A2C7A", "#2C7A5A"][i]} />{tx(0, 250, String(n), 40, "#FFF", 700, "middle")}<circle cx={0} cy={-260} r={50} fill={ok ? H.green : H.red} />{tx(0, -244, ok ? "✓" : "✗", 52, "#FFF", 700, "middle")}</g>; })}</g>) },
  { c: "Gece ikide kafanda", r: (t, a, b) => desk(t, a, b, SEN16, { mouth: "smile", eyes: "wide", brow: "up", arms: "desk", z: [1.6, 1.75], c0: [960, 380], lookY: 0, extra: <><Bulb x={960} y={110} s={0.8} on={rp(t, a + 1, a + 1.3)} t={t} /><Clock x={1640} y={300} s={0.6} h={2} m={0} /></> }), sfx: "ding" },
  { c: "Herkes bunu soruyor", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#F4F4F4" />{tx(30, 50, "Forum · Telefon", 26, "#222", 700)}{["Almanya'dan telefon getirsem değer mi?", "IMEI ücreti neden bu kadar yüksek?", "Kayıt yaptırmazsam ne olur?", "Hangi model mantıklı, yardım!", "Aynı soruyu 5. kez soruyorum…"].map((q, i) => <g key={i} opacity={cl(rp(t, a, b - 0.4) * 5 - i)}><rect x={30} y={80 + i * 104} width={940} height={90} rx={10} fill="#FFF" />{tx(56, 120 + i * 104, q, 22, "#1A1A1A", 600)}{tx(56, 150 + i * 104, "0 cevap", 16, "#C0392B", 600)}</g>)}</g>, { old: true, z: [1.4, 1.55], c0: [960, 480], c1: [960, 600] }), html: (t, a) => <Big t={t} at={a + 1.6} text="Kimse düzgünce anlatmıyor" y={70} size={60} /> },
  // ── YENİ KANAL
  { c: "Ertesi gün Minecraft'ı bırakıyorsun", r: (t, a, b) => { const k = rp(t, a + 0.4, a + 1.6); return <HCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[520, 400]}><TeenRoom t={t} night={false} /><rect x={380} y={140} width={260} height={360} fill="#C9BCA6" opacity={k} /></HCam>; }, html: (t, a) => <Big t={t} at={a + 0.6} text="Minecraft'a veda" y={760} size={64} /> },
  { c: "Yeni bir kanal açıyorsun", r: (t, a, b) => { const name = "Telefon Gerçekleri"; const n = Math.floor(rp(t, a + 0.4, a + 2.4) * name.length); return scr(t, a, b, <g><rect width={1000} height={625} fill={H.ui} /><rect x={220} y={100} width={560} height={420} rx={16} fill={H.ui2} />{tx(500, 170, "Kanal oluştur", 30, "#FFF", 700, "middle")}<circle cx={500} cy={260} r={56} fill="#2C4A7A" /><rect x={460} y={226} width={80} height={68} rx={12} fill="#0F1A2E" stroke="#8892A6" strokeWidth={4} /><rect x={280} y={350} width={440} height={56} rx={10} fill="#121212" stroke={H.blue} strokeWidth={2} />{tx(300, 386, name.slice(0, n) + (Math.floor(t * 3) % 2 ? "|" : ""), 24, "#FFF", 600)}<rect x={560} y={440} width={160} height={50} rx={25} fill={H.blue} />{tx(640, 472, "Oluştur", 20, "#000", 700, "middle")}</g>, { old: true }); } },
  { c: "Yüzünü göstermiyorsun", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 540]}><rect width={1920} height={1080} fill={H.wood} />{Array.from({ length: 14 }, (_, i) => <path key={i} d={`M0,${i * 80 + 20} Q960,${i * 80 + 50} 1920,${i * 80 + 10}`} stroke={H.wood2} strokeWidth={3} opacity={0.4} fill="none" />)}<g transform="translate(960,540) rotate(-90)"><rect x={-180} y={-90} width={360} height={180} rx={28} fill="#111" /><rect x={-170} y={-80} width={340} height={160} rx={22} fill="#2C4A7A" /></g>{[-1, 1].map((d) => <g key={d}><path d={`M${960 + d * 700},1100 Q${960 + d * 420},${760} ${960 + d * 130 + Math.sin(t * 3 + d) * 10},${560}`} stroke={H.skin} strokeWidth={110} strokeLinecap="round" fill="none" /><path d={`M${960 + d * 700},1100 Q${960 + d * 470},${830} ${960 + d * 330},${700}`} stroke="#2F3B4C" strokeWidth={150} strokeLinecap="round" fill="none" /></g>)}<TeaGlass x={1560} y={300} s={1.6} t={t} /><g transform="translate(260,180)"><rect x={-80} y={-60} width={160} height={120} rx={14} fill="#E5322D" /><circle r={14} fill="#FFF" opacity={Math.floor(t * 2) % 2} /></g></HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="Kamerada sadece ellerin ve masan" y={60} size={56} /> },
  { c: "Bu sefer önce YouTube'un", r: (t, a, b) => over(t, a, b, SEN16, <StudioShell title="Kanal analizi"><Stat x={0} y={10} label="İzlenme" value="412" w={240} /><Stat x={260} y={10} label="Tıklama" value="%2" w={240} c="#FF6B6B" /><Stat x={520} y={10} label="Ort. izleme" value="0:31" w={240} /><LineChart x={0} y={180} w={760} h={260} pts={[0.2, 0.3, 0.25, 0.28, 0.22, 0.3, 0.26]} k={rp(t, a, b)} /></StudioShell>, { z: [1.1, 1.3], c0: [1060, 470] }) },
  { c: "Birincisi: kapağını görenlerden", r: (t, a, b) => board(t, a, b, <People100 x={520} y={220} on={0} k={0} s={1.9} />), html: (t, a) => <Big t={t} at={a + 0.4} text="Kapağını görenlerden kaçı tıkladı?" y={60} size={58} /> },
  { c: "Seninki yüzde iki", r: (t, a, b) => board(t, a, b, <People100 x={520} y={220} on={2} k={rp(t, a, a + 0.6)} s={1.9} />, { z: [1, 1.15] }), html: (t, a) => <Big t={t} at={a + 0.3} text="%2" sub="100 kişiden sadece 2'si" y={60} size={110} c="#FF6B6B" />, sfx: "pop" },
  { c: "İkincisi: insanların videonun", r: (t, a, b) => scr(t, a, b, <StudioShell title="Kanal analizi">{tx(0, 30, "İzleyici tutma", 24, "#FFF", 700)}<LineChart x={0} y={60} w={760} h={360} pts={[1, 0.82, 0.66, 0.5, 0.46, 0.42, 0.4, 0.38, 0.36, 0.35]} k={rp(t, a + 0.2, b - 0.3)} c={H.blue} mark={0.11} />{tx(84, 450, "0:30", 18, "#FFF", 700, "middle")}</StudioShell>, { z: [1.45, 1.65], c0: [860, 520] }), },
  { c: "Senin videolarında izleyicilerin", r: (t, a, b) => board(t, a, b, <g><People100 x={520} y={220} on={50} k={rp(t, a + 0.3, a + 0.8)} s={1.9} c="#555" /></g>, { z: [1.05, 1.15] }), html: (t, a) => <Big t={t} at={a + 0.2} text="Yarısı ilk 30 saniyede gidiyor" y={60} size={58} c="#FF6B6B" /> },
  { c: "Girişleri değiştiriyorsun", r: (t, a, b) => { const k = rp(t, a + 0.8, a + 1.6); return ph(t, a, b, <g><EditApp t={t} /><rect x={-md2(t)} y={400} width={114 * (1 - k)} height={54} fill="#E5322D" opacity={0.8} /><g opacity={k}>{tx(180, 380, "GİRİŞ SİLİNDİ", 22, "#FF6B6B", 700, "middle")}</g></g>); }, html: (t, a) => <Big t={t} at={a + 1} text={"\"Merhaba\" yok"} y={70} size={70} c="#FF6B6B" /> },
  { c: "İlk cümle direkt bir soru", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#000" /><g transform="translate(0,0)"><rect width={1000} height={560} fill="#14181F" /><g transform="translate(500,250) rotate(-6)"><rect x={-80} y={-150} width={160} height={300} rx={24} fill="#1A1C20" stroke="#8892A6" strokeWidth={4} /><rect x={-68} y={-136} width={136} height={272} rx={16} fill="#2C4A7A" /></g>{[-1, 1].map((d) => <ellipse key={d} cx={500 + d * 130} cy={420} rx={70} ry={50} fill={H.skin} />)}</g></g>, { z: [1.5, 1.6] }), html: (t, a) => <Big t={t} at={a + 0.8} text={"\"Almanya'dan getirdiğin telefon, burada sana iki telefon parasına patlayabilir. Neden?\""} y={780} size={44} /> },
  { c: "Kapakta da artık", r: (t, a, b) => board(t, a, b, <g><g transform="translate(180,300) scale(1.6)" opacity={0.45}><Thumb x={0} y={0} w={320} kind="bad" /></g>{tx(436, 650, "ÖNCE", 44, "#888", 700, "middle")}<path d="M860,450 L1000,450 M970,420 L1000,450 L970,480" stroke="#FFF" strokeWidth={10} fill="none" strokeLinecap="round" /><g transform={`translate(1060,260) scale(${lp(2, 2.2, rp(t, a + 0.5, a + 1))})`}><Thumb x={0} y={0} w={320} kind="good" /></g>{tx(1400, 720, "SONRA", 44, H.green, 700, "middle")}</g>), html: (t, a) => <Big t={t} at={a + 1.4} text="Tek telefon · en fazla 3 kelime" y={830} size={56} /> },
  { c: "Altıncı video", r: (t, a, b) => scr(t, a, b, list([{ title: "Yurt Dışından Telefon Getirmek Hâlâ Mantıklı mı?", views: Math.round(lp(0, 300, rp(t, a + 2, a + 3.5))), kind: "good", date: "1 gün önce" }], 1, 0), { old: true, z: [1.5, 1.8], c0: [900, 380] }), html: (t, a) => <Big t={t} at={a + 2.6} text="İlk gün: 300" y={780} size={70} /> },
  { c: "Sonra o videodan kestiğin", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#14181F" /><g transform="translate(180,330) rotate(-6)"><rect x={-70} y={-130} width={140} height={260} rx={22} fill="#1A1C20" stroke="#8892A6" strokeWidth={4} /><rect x={-60} y={-118} width={120} height={236} rx={16} fill="#2C4A7A" /></g>{tx(20, 620, "Telefon Gerçekleri", 18, "#FFF", 700)}{tx(20, 650, "Almanya'dan telefon getirme! #shorts", 15, "#DDD", 500)}{["♥", "💬", "↗"].map((s, i) => <g key={i}>{tx(326, 360 + i * 80, s, 34, "#FFF", 600, "middle")}</g>)}<rect x={0} y={736} width={360 * rp(t, a, b)} height={4} fill="#FFF" /></g>, { z: [1.1, 1.25] }), html: (t, a) => <Big t={t} at={a + 1.2} text="40 saniyelik Shorts" y={70} size={60} /> },
  { c: "Bir haftada dört yüz bin", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Counter t={t} a={a} from={0} to={400000} dur={2} label="izlenme · 1 haftada" y={330} c="#FFF" />, sfx: "tick" },
  { c: "Ana video altmış bine", r: (t, a, b) => scr(t, a, b, list([{ title: "Yurt Dışından Telefon Getirmek Hâlâ Mantıklı mı?", views: Math.round(lp(300, 60000, rp(t, a + 0.3, a + 2))), kind: "good", date: "8 gün önce" }], 1, 0), { old: true, z: [1.5, 1.7], c0: [900, 380] }), html: (t, a) => <Big t={t} at={a + 1.4} text="60.000" y={780} size={100} c={H.green} /> },
  { c: "Abone sayın bin sekiz", r: (t, a, b) => desk(t, a, b, SEN16, { arms: "head", mouth: "grin", eyes: "wide", brow: "up", z: [1.3, 1.45], c0: [960, 440] }), html: (t, a) => <Counter t={t} a={a} from={31} to={1800} dur={1.4} label="abone" y={60} c="#FFF" />, sfx: "ding" },
  { c: "Sonraki üç video mu", r: (t, a, b) => scr(t, a, b, list([{ title: "Telefon Pili Neden Çabuk Biter?", views: 900, kind: "phone" }, { title: "En Ucuz 5G Telefon", views: 1200, kind: "phone" }, { title: "İkinci El Alırken 3 Tuzak", views: 700, kind: "phone" }], rp(t, a + 1, a + 3)), { old: true, z: [1.45, 1.6] }) },
  { c: "O altmış bin bir rüya", r: (t, a, b) => desk(t, a, b, SEN16, { mouth: "flat", eyes: "half", arms: "chin", z: [1.8, 2.1], c0: [960, 380], lookY: 0.8 }), html: (t, a) => <Big t={t} at={a + 0.4} text="60.000 bir rüyaydı" y={780} size={64} /> },
  { c: "Ama bir şey öğrendin", r: (t, a, b) => board(t, a, b, <g><Bulb x={960} y={380} s={1.3} t={t} /></g>), html: (t, a) => <><Big t={t} at={a + 0.6} text="Patlayan sen değilsin." y={640} size={74} /><Big t={t} at={a + 2.2} text="İnsanların gerçek bir derdi." y={790} size={60} c="#FFC531" /></> },
  // ── 18 YAŞ
  { c: "Aradan bir yıl geçiyor", r: (t, a, b) => desk(t, a, b, SEN18, { arms: "desk", mouth: "flat", z: [1.05, 1.15], extra: <g>{Array.from({ length: 6 }, (_, i) => <rect key={i} x={430} y={840 - i * 28} width={220 - (i % 2) * 20} height={26} fill={["#C0392B", "#2E86C1", "#F1C40F", "#27AE60", "#8E44AD", "#E67E22"][i]} />)}{tx(540, 680, "YKS", 40, "#FFF", 700, "middle")}</g> }), html: (t, a) => <AgeTag t={t} at={a + 0.6} age="18 yaş" place="YKS yılı" /> },
  { c: "Haftada sadece bir video", r: (t, a, b) => board(t, a, b, <g>{["Pzt", "Sal", "Çar", "Per", "Cum", "Cmt", "Paz"].map((d, i) => { const on = i === 6; return <g key={d} transform={`translate(${300 + i * 200},540)`}><rect x={-85} y={-150} width={170} height={300} rx={20} fill={on ? H.red : "#1A1E27"} />{tx(0, -90, d, 40, "#FFF", 700, "middle")}{on ? <>{tx(0, 20, "VİDEO", 34, "#FFF", 700, "middle")}{tx(0, 80, "23:00", 30, "#FFF", 600, "middle")}</> : tx(0, 30, "ders", 30, "#777", 600, "middle")}</g>; })}</g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Haftada 1 video · pazar geceleri" y={80} size={60} /> },
  { c: "YouTube'dan para kazanmak için iki", r: (t, a, b) => board(t, a, b, <g><Progress x={360} y={420} w={1200} v={lp(0, 1, rp(t, a + 0.8, a + 2))} label="1.000 abone" right="✓" c={H.green} /><Progress x={360} y={640} w={1200} v={lp(0, 0.18, rp(t, a + 1.6, a + 3))} label="4.000 saat izlenme (1 yıl)" right={`${Math.round(lp(0, 720, rp(t, a + 1.6, a + 3)))} saat`} c={H.blue} /></g>), html: (t, a) => <Big t={t} at={a + 0.4} text="Para için 2 şart" y={100} size={80} /> },
  { c: "Ama Shorts izlenmeleri", r: (t, a, b) => board(t, a, b, <g><Progress x={360} y={640} w={1200} v={0.18} label="4.000 saat izlenme" right="720 saat" c={H.blue} /><g transform="translate(960,380)" opacity={rp(t, a + 0.3, a + 0.7)}><rect x={-330} y={-80} width={660} height={160} rx={24} fill="#1A1E27" stroke={H.red} strokeWidth={4} />{tx(0, 20, "400.000 Shorts izlenmesi", 40, "#FFF", 700, "middle")}<path d={`M-330,${-80} L${lp(-330, 330, rp(t, a + 1.4, a + 2))},${lp(-80, 80, rp(t, a + 1.4, a + 2))}`} stroke={H.red} strokeWidth={14} strokeLinecap="round" /></g></g>), html: (t, a) => <Big t={t} at={a + 2.2} text="Saate sayılmıyor" y={100} size={70} c="#FF6B6B" /> },
  { c: "Yükü uzun videolar", r: (t, a, b) => over(t, a, b, SEN18, <StudioShell title="Kanal analizi"><Progress x={0} y={80} w={760} v={lp(0.18, 0.6, rp(t, a, b))} label="İzlenme saati" right={`${fmt(lp(720, 2400, rp(t, a, b)))} / 4.000`} c={H.blue} /><LineChart x={0} y={160} w={760} h={280} pts={[0.1, 0.18, 0.22, 0.3, 0.36, 0.45, 0.52, 0.6]} k={rp(t, a, b)} /></StudioShell>, { z: [1.1, 1.25] }) },
  { c: "On bir ay sonra, bir gece", r: (t, a, b) => scr(t, a, b, <StudioShell title="Gelir"><g opacity={rp(t, a + 1.2, a + 1.6)}><rect x={0} y={20} width={760} height={120} rx={14} fill="#0F3D24" stroke={H.green} strokeWidth={3} /><circle cx={60} cy={80} r={30} fill={H.green} />{tx(60, 92, "✓", 34, "#FFF", 700, "middle")}{tx(110, 76, "Tüm şartları sağladınız", 30, "#FFF", 700)}{tx(110, 112, "Programa başvurabilirsiniz", 20, "#BFE8CF", 500)}<rect x={560} y={58} width={170} height={46} rx={23} fill={H.blue} />{tx(645, 88, "Başvur", 20, "#000", 700, "middle")}</g><Progress x={0} y={220} w={760} v={1} label="1.000 abone" right="✓" /><Progress x={0} y={310} w={760} v={1} label="4.000 saat" right="✓" /></StudioShell>, { z: [1.5, 1.7], c0: [900, 360] }), sfx: "ding" },
  { c: "Başvuruyorsun. Üç hafta", r: (t, a, b) => board(t, a, b, <g>{cal(t, a, "BEKLEME", String(Math.min(21, 1 + Math.floor(rp(t, a + 0.3, b - 0.3) * 20))), "gün")}<g opacity={0.8}>{tx(960, 900, "İncelemede…", 44, "#FFC531", 700, "middle")}</g></g>) },
  { c: "Her sabah ilk iş", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.65]} c0={[700, 600]}><TeenRoom t={t} night={false} /><g transform="translate(220,790) rotate(-90)"><Person x={0} y={0} s={0.8} t={t} o={SEN18} arms="phone" eyes="half" mouth="flat" lit={1} lookY={-0.4} /></g><path d="M80,760 Q500,700 900,800 L900,1000 L80,1000Z" fill="#3B5B8C" /></HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="Her sabah: e-posta" y={80} size={56} /> },
  { c: "Sonra cevap geliyor: kabul", r: (t, a, b) => scr(t, a, b, <Mail from="Ortaklık Programı" subject="Başvurunuz hakkında" badge="KABUL EDİLDİ" lines={["Tebrikler! Kanalınız programa kabul edildi.", "Videolarınızdan artık gelir elde edebilirsiniz."]} k={rp(t, a + 0.2, a + 0.8)} />, { z: [1.5, 1.7], c0: [1000, 420] }), sfx: "ding" },
  { c: "İlk ayın kazancı", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Counter t={t} a={a} from={0} to={23} dur={1.2} label="ilk ayın kazancı" y={330} c="#FFC531" prefix="$" /> },
  { c: "Evet, yanlış duymadın", r: (t, a, b) => desk(t, a, b, SEN18, { arms: "head", mouth: "o", eyes: "wide", brow: "up", z: [1.6, 1.75], c0: [960, 420] }) },
  { c: "Hesaplıyorsun, bir daha", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#000" />{tx(340, 250, "70.000 izlenme", 30, "#AAA", 600, "end")}{tx(340, 330, `$${Math.round(lp(0, 23, rp(t, a + 0.4, a + 1.6)))}`, 96, "#FFF", 600, "end")}{Array.from({ length: 16 }, (_, i) => <circle key={i} cx={52 + (i % 4) * 85} cy={420 + Math.floor(i / 4) * 80} r={36} fill={i % 4 === 3 ? "#FF9F0A" : "#333"} />)}</g>), html: (t, a) => <Big t={t} at={a + 1.8} text="70.000 izlenme → $23" y={80} size={60} /> },
  { c: "Ama izleyicilerinin neredeyse", r: (t, a, b) => board(t, a, b, <g transform="translate(960,520)"><circle r={300} fill="none" stroke="#2A2E38" strokeWidth={110} /><circle r={300} fill="none" stroke={H.red} strokeWidth={110} strokeDasharray={`${1885 * 0.93 * rp(t, a + 0.2, a + 1.4)} 1885`} transform="rotate(-90)" />{tx(0, 10, "Türkiye", 70, "#FFF", 700, "middle")}{tx(0, 70, "izleyicilerin neredeyse hepsi", 26, "#AAA", 600, "middle")}</g>) },
  { c: "Ve Türkiye'deki reklamlar", r: (t, a, b) => board(t, a, b, <AdBars x={240} y={330} k={rp(t, a + 0.2, b - 0.2)} />), html: (t, a) => <Big t={t} at={a + 0.4} text="Aynı izlenme, farklı reklam parası" y={90} size={56} /> },
  { c: "Aynı video Almanca", r: (t, a, b) => over(t, a, b, SEN18, <g><rect width={1000} height={625} fill="#14181F" />{tx(500, 300, "DE", 160, "#FFC531", 700, "middle")}{tx(500, 400, "Almanca olsaydı…", 34, "#FFF", 600, "middle")}</g>, { z: [1.1, 1.2] }), html: (t, a) => <Big t={t} at={a + 1.2} text="belki birkaç kat fazla" y={80} size={64} c="#FFC531" /> },
  { c: "Üstüne bir de şunu", r: (t, a, b) => board(t, a, b, <Progress x={360} y={560} w={1200} v={lp(0.05, 0.23, rp(t, a + 0.6, a + 1.6))} label="Ödeme eşiği" right={`$${Math.round(lp(5, 23, rp(t, a + 0.6, a + 1.6)))} / $100`} c="#FFC531" />), html: (t, a) => <Big t={t} at={a + 0.6} text="~$100 olmadan ödeme yok" y={240} size={70} /> },
  { c: "Yani ilk paranı görmek", r: (t, a, b) => board(t, a, b, <g>{cal(t, a, "AY", String(1 + Math.floor(rp(t, a + 0.2, b - 0.5) * 3.99)), "bekleme", 620, 520, 0.9)}<Progress x={960} y={540} w={680} v={lp(0.23, 1, rp(t, a + 0.2, b - 0.3))} label="Eşik" right="$100" c="#FFC531" /></g>), html: (t, a) => <Big t={t} at={a + 0.6} text="İlk para: 4 ay sonra" y={80} size={64} /> },
  { c: "Para geldiğinde de bir sürpriz", r: (t, a, b) => ph(t, a, b, <BankCard k={rp(t, a + 0.5, b - 0.3)} gross="$100,00" cut="−$15,00" net="$85,00" />, { light: true }), sfx: "pop" },
  { c: "Annen ekranda kalan", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.25, 1.35]} c0={[960, 480]}><TeenRoom t={t} /><Person x={1300} y={1000} s={0.95} t={t} o={ANNE} dir={-1} arms="cross" mouth="tight" brow="worry" look={-0.7} lookY={0.6} talk={t > a + 1.6} /><Person x={760} y={1060} s={0.9} t={t} o={SEN18} arms="desk" mouth="flat" eyes="half" look={0.5} /><rect x={300} y={980} width={1320} height={30} fill={H.wood} /><LidBack x={760} y={990} s={0.8} old /></HCam>, html: (t, a) => <Big t={t} at={a + 1.6} text={"\"Bunun için mi gece üçe kadar oturuyorsun?\""} y={70} size={52} /> },
  // ── 20 YAŞ · YURT
  { c: "Yirmi yaşına geldin", r: (t, a, b) => desk(t, a, b, SEN20, { bg: "yurt", arms: "type", mouth: "flat", z: [1, 1.1] }), html: (t, a) => <AgeTag t={t} at={a + 0.4} age="20 yaş" place="Üniversite · yurt" /> },
  { c: "Yurdun interneti", r: (t, a, b) => { const step = Math.min(2, Math.floor(rp(t, a, b - 0.2) * 3)); const k = (rp(t, a, b - 0.2) * 3) % 1; return over(t, a, b, SEN20, upload(lp(0.2, 0.7, k), step + 1), { bg: "yurt", z: [1.1, 1.25], c0: [1060, 470] }); }, sfx: "buzz" },
  { c: "Videoları kafede", r: (t, a, b) => desk(t, a, b, SEN20, { bg: "kafe", arms: "type", mouth: "smile", z: [1.05, 1.15] }), html: (t, a) => <Big t={t} at={a + 0.5} text="Yükleme: kafede" y={80} size={60} /> },
  { c: "Kanal on iki bin", r: (t, a, b) => scr(t, a, b, subsScreen(Math.round(lp(1800, 12000, rp(t, a + 0.2, a + 1.6))), "Abone"), { z: [1.6, 1.8], c0: [700, 300] }), html: (t, a) => <Big t={t} at={a + 1.2} text="12.000 abone" y={800} size={80} /> },
  { c: "Haftada iki video", r: (t, a, b) => desk(t, a, b, SEN20, { bg: "yurt", arms: "chin", mouth: "sad", eyes: "half", brow: "worry", slump: 1, z: [1.5, 1.7], c0: [960, 420] }), html: (t, a) => <Big t={t} at={a + 1.4} text="6 ayda tükeniyorsun" y={790} size={64} c="#FF6B6B" /> },
  { c: "Bir video ortalama yirmi beş", r: (t, a, b) => board(t, a, b, <g>{[["Araştırma", 6, "#3EA6FF"], ["Metin", 5, "#7E5BD6"], ["Çekim", 4, "#2BB673"], ["Montaj", 7, "#E5322D"], ["Kapak", 3, "#FFB547"]].map(([n, v, c], i) => { const k = rp(t, a + 0.4 + i * 0.5, a + 0.9 + i * 0.5); return <g key={i} transform={`translate(330,${270 + i * 130})`}>{tx(0, 50, String(n), 44, "#FFF", 700)}<rect x={300} y={10} width={Number(v) * 150 * k} height={60} rx={12} fill={String(c)} />{k > 0.9 && tx(310 + Number(v) * 150, 56, `${v} saat`, 34, "#DDD", 600)}</g>; })}</g>), html: (t, a) => <Big t={t} at={a + 0.2} text="1 video = 25 saat" y={60} size={74} /> },
  { c: "Vize haftasında", r: (t, a, b) => board(t, a, b, <g>{cal(t, a, "VİZE", "0", "video", 520, 520, 0.85)}<LineChart x={900} y={340} w={760} h={360} pts={[0.8, 0.82, 0.78, 0.7, 0.5, 0.36, 0.3]} k={rp(t, a + 0.4, b)} c={H.red} /></g>) },
  { c: "Sonra kötü bir sabah", r: (t, a, b) => scr(t, a, b, <Strike k={rp(t, a + 0.6, a + 1.2)} n={1} />, { z: [1.5, 1.6] }), sfx: "buzz", tone: "cool" },
  { c: "Telif uyarısı", r: (t, a, b) => scr(t, a, b, <Strike k={1} n={1} />, { z: [1.9, 2.3], c0: [960, 600] }) },
  { c: "O gece eski videolarının", r: (t, a, b) => over(t, a, b, SEN20, <StudioShell title="İçerik">{Array.from({ length: 5 }, (_, i) => { const y = 20 + i * 90 - rp(t, a, b) * 120; const ok = rp(t, a + i * 0.6, a + i * 0.6 + 0.3); return <g key={i} transform={`translate(0,${y})`}><Thumb x={0} y={0} w={130} kind="phone" />{tx(150, 40, ["Telefon Pili", "5G Rehberi", "İkinci El", "IMEI Kaydı", "Kamera Testi"][i], 22, "#EEE")}<circle cx={720} cy={36} r={22} fill={ok > 0.5 ? H.green : "#333"} />{ok > 0.5 && tx(720, 45, "✓", 26, "#FFF", 700, "middle")}</g>; })}</StudioShell>, { bg: "yurt", z: [1.1, 1.25] }) },
  { c: "Ve bir gün Instagram'dan", r: (t, a, b) => ph(t, a, b, <DM name="reklam_ajansi_vip" msgs={[{ text: "Abi selam 👋" }, { text: "Videona 15 saniyelik bir site tanıtımı koy" }, { text: "Tanesine 40.000 TL veriyoruz 💸" }]} k={rp(t, a + 0.2, b - 0.3)} t={t} />, { bg: "yurt" }), sfx: "pop" },
  { c: "tanesine kırk bin lira", r: (t, a, b) => ph(t, a, b, <DM name="reklam_ajansi_vip" msgs={[{ text: "Abi selam 👋" }, { text: "Videona 15 saniyelik bir site tanıtımı koy" }, { text: "Tanesine 40.000 TL veriyoruz 💸" }]} k={1} t={t} />, { bg: "yurt", z: [1.7, 1.9], c0: [880, 480] }), html: (t, a) => <Big t={t} at={a + 0.3} text="40.000 TL" y={80} size={90} c="#FFC531" /> },
  { c: "Siteye bakıyorsun", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#1A0F2E" /><g style={{ filter: "blur(6px)" }}>{Array.from({ length: 6 }, (_, i) => <rect key={i} x={20} y={90 + i * 100} width={320} height={80} rx={12} fill={["#FFC531", "#7E5BD6", "#E5322D"][i % 3]} />)}</g><g transform="translate(180,380) rotate(-12)"><rect x={-220} y={-50} width={440} height={100} fill="#FFC531" />{tx(0, 18, "YASA DIŞI", 50, "#111", 700, "middle")}</g></g>, { bg: "yurt" }), html: (t, a) => <Big t={t} at={a + 1} text="Yasa dışı bahis sitesi" y={80} size={60} c="#FF6B6B" /> },
  { c: "Bu para, YouTube'dan aylık", r: (t, a, b) => board(t, a, b, <g>{tx(330, 380, "YouTube (aylık)", 44, "#FFF", 700)}<rect x={760} y={330} width={100 * rp(t, a, a + 0.6)} height={70} rx={12} fill={H.blue} />{tx(330, 600, "Tek tanıtım", 44, "#FFF", 700)}<rect x={760} y={550} width={1000 * rp(t, a + 0.6, a + 1.8)} height={70} rx={12} fill={H.red} />{tx(1780, 600, "×10", 50, "#FFF", 700, "end")}</g>) },
  { c: "Bir saat boyunca", r: (t, a, b) => desk(t, a, b, SEN20, { bg: "yurt", arms: "phone", mouth: "tight", brow: "worry", z: [1.6, 1.8], c0: [960, 380], extra: <Clock x={1600} y={260} s={0.55} h={0} m={0} spin={rp(t, a, b)} /> }) },
  { c: "Sonra mesajı siliyorsun", r: (t, a, b) => ph(t, a, b, <g><DM name="reklam_ajansi_vip" msgs={[{ text: "Tanesine 40.000 TL veriyoruz 💸" }]} k={1} t={t} /><rect width={360} height={740} fill="#000" opacity={0.6} /><g transform="translate(180,420)" opacity={rp(t, a + 0.2, a + 0.6)}><rect x={-150} y={-90} width={300} height={180} rx={20} fill="#262626" />{tx(0, -30, "Sohbet silinsin mi?", 20, "#FFF", 700, "middle")}<rect x={-150} y={20} width={300} height={1} fill="#444" />{tx(0, 64, "Sil", 22, rp(t, a + 1, a + 1.2) > 0.5 ? "#FFF" : "#ED4956", 700, "middle")}</g></g>, { bg: "yurt" }), sfx: "pop" },
  { c: "Altı ay sonra, aynı teklifi", r: (t, a, b) => ph(t, a, b, <News k={rp(t, a + 0.3, a + 1)} head="Yasa dışı bahis reklamı yapan sosyal medya hesaplarına soruşturma" sub="Tanıtım karşılığı para alan içerik üreticileri hakkında işlem başlatıldı." />, { light: true }) },
  { c: "O mesajı silmek", r: (t, a, b) => desk(t, a, b, SEN20, { bg: "yurt", arms: "desk", mouth: "smile", z: [1.5, 1.6], c0: [960, 420] }), html: (t, a) => <Big t={t} at={a + 0.8} text="En iyi kararlarından biri" y={790} size={64} c={H.green} /> },
  // ── 22 YAŞ
  { c: "Yirmi iki yaşındasın", r: (t, a, b) => over(t, a, b, SEN22, subsScreen(Math.round(lp(12000, 85000, rp(t, a + 0.6, a + 2.2))), "Abone"), { old: false, z: [1.05, 1.2] }), html: (t, a) => <><AgeTag t={t} at={a + 0.3} age="22 yaş" place="85.000 abone" /></> },
  { c: "Kanal artık ayda", r: (t, a, b) => scr(t, a, b, <StudioShell title="Gelir"><Stat x={0} y={10} label="Tahmini gelir (ay)" value={`$${fmt(lp(0, 1100, rp(t, a + 0.3, a + 1.6)))}`} w={380} c={H.green} pulse={1} /><LineChart x={0} y={180} w={760} h={260} pts={[0.2, 0.3, 0.45, 0.5, 0.62, 0.7, 0.75]} c={H.green} /></StudioShell>, { z: [1.6, 1.8], c0: [760, 300] }), html: (t, a) => <Big t={t} at={a + 1.4} text="Ayda $1.000 – $1.200" y={800} size={70} c={H.green} /> },
  { c: "Ve sen artık her şeye", r: (t, a, b) => desk(t, a, b, SEN22, { bg: "room", arms: "head", mouth: "sad", brow: "worry", z: [1.3, 1.45], c0: [960, 440], old: false, extra: <g>{["Montaj", "Kapak", "Metin", "E-posta", "Yorumlar"].map((s, i) => { const k = rp(t, a + i * 0.3, a + i * 0.3 + 0.3); return <g key={s} transform={`translate(${300 + (i % 3) * 660},${150 + Math.floor(i / 3) * 520})`} opacity={k}><rect x={-140} y={-50} width={280} height={100} rx={16} fill="#1A1E27" stroke="#FFC531" strokeWidth={3} />{tx(0, 14, s, 40, "#FFF", 700, "middle")}</g>; })}</g> }) },
  { c: "Freelancer sitelerinden", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#F5F6F8" /><rect width={1000} height={60} fill="#1DBF73" />{tx(24, 40, "freelancer · montajcı ara", 22, "#FFF", 700)}{[0, 1, 2].map((i) => <g key={i} transform={`translate(${40 + i * 320},100)`} opacity={cl(rp(t, a + 0.2, b - 0.2) * 3 - i)}><rect width={290} height={420} rx={14} fill="#FFF" stroke="#E2E4E8" /><rect width={290} height={160} rx={14} fill={["#DDE3EE", "#EEDDE3", "#E3EEDD"][i]} /><circle cx={40} cy={200} r={26} fill={["#7E5BD6", "#F28C28", "#3EA6FF"][i]} />{tx(76, 208, ["editör_pro", "montaj.ustasi", "kurgu_konya"][i], 18, "#222", 700)}{tx(20, 260, "Video montajı yaparım", 18, "#333", 500)}{tx(20, 300, "★ 4.9", 18, "#FFB547", 700)}</g>)}</g>, { z: [1.4, 1.5] }) },
  { c: "İlk ikisi işi teslim", r: (t, a, b) => board(t, a, b, <g>{[0, 1].map((i) => { const k = rp(t, a + 0.4 + i * 0.6, a + 0.8 + i * 0.6); return <g key={i} transform={`translate(${640 + i * 640},520)`}><rect x={-240} y={-200} width={480} height={400} rx={20} fill="#1A1E27" /><circle cx={0} cy={-70} r={70} fill="#555" />{tx(0, 60, ["editör_pro", "montaj.ustasi"][i], 36, "#AAA", 700, "middle")}{tx(0, 120, "Çevrimdışı", 30, "#777", 600, "middle")}<path d={`M-200,-160 L${lp(-200, 200, k)},${lp(-160, 160, k)}`} stroke={H.red} strokeWidth={16} strokeLinecap="round" /></g>; })}</g>), html: (t, a) => <Big t={t} at={a + 0.4} text="Teslim etmeden kayboldular" y={80} size={60} /> },
  { c: "Üçüncüsü, Konya'da", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 460]}><TeenRoom t={t} poster="X" /><Person x={960} y={1000} s={0.95} t={t} o={EDITOR} arms="wave" mouth="grin" eyes="open" /><rect x={300} y={980} width={1320} height={30} fill={H.wood} /></HCam>, html: (t, a) => <><AgeTag t={t} at={a + 0.4} age="Montajcın" place="Konya · 20 yaş" /></> },
  { c: "Ama ilk ay her şeyi", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#1B1D22" /><rect x={20} y={20} width={600} height={340} fill="#000" /><Thumb x={40} y={40} w={560} kind="phone" />{[0, 1, 2, 3].map((r) => <g key={r} transform={`translate(20,${390 + r * 52})`}><rect width={960} height={44} fill="#26292F" />{Array.from({ length: 7 }, (_, i) => <rect key={i} x={i * 140 + 4} y={4} width={130} height={36} rx={4} fill={["#3B6E3A", "#2D5C8A", "#7A3A8A", "#8A6A2D"][r]} />)}</g>)}{Array.from({ length: 14 }, (_, i) => { const k = cl(rp(t, a + 0.2, b - 0.3) * 14 - i); return <g key={i} opacity={k}><path d={`M${40 + i * 68},382 l12,-22 l12,22Z`} fill="#E5322D" /><rect x={650} y={30 + (i % 8) * 40} width={330} height={32} rx={6} fill="#2A2D33" opacity={i < 8 ? 1 : 0} />{i < 8 && tx(664, 52 + (i % 8) * 40, ["Bu kesim erken", "Ses düşük", "Yazı hatalı", "Burayı sil", "Renk soluk", "Müzik kalksın", "Geçiş yavaş", "Tekrar"][i], 15, "#FFB3B3", 600)}</g>; })}</g>, { z: [1.45, 1.6] }), html: (t, a) => <Big t={t} at={a + 1.6} text="İşi iki kişi yapıyorsunuz" y={60} size={58} /> },
  { c: "İşi hızlandırmak için yapay", r: (t, a, b) => over(t, a, b, SEN22, aiChat(rp(t, a + 0.4, b - 0.3), t), { old: false, z: [1.1, 1.25], c0: [1060, 470] }) },
  { c: "Ama ilk videoda bir rakamı", r: (t, a, b) => scr(t, a, b, <StudioShell title="Yorumlar">{[["@ahmet.k", "Bu rakam yanlış kardeşim!", "#E5322D"], ["@zeynep_t", "Araştırmadan video mu çekiyorsun?", "#F28C28"], ["@burak61", "Rakamı yapay zekâ mı yazdı? 😂", "#7E5BD6"]].map(([n, s, c], i) => <Comment key={i} x={0} y={10 + i * 130} name={n} text={s} c={c} w={760} k={rp(t, a + 0.3 + i * 0.6, a + 0.7 + i * 0.6)} likes={[312, 120, 98][i]} />)}</StudioShell>, { z: [1.4, 1.55], c0: [900, 420] }), sfx: "pop" },
  { c: "O günden sonra bir kuralın", r: (t, a, b) => board(t, a, b, <g transform="translate(960,540)"><rect x={-640} y={-230} width={1280} height={460} rx={30} fill="#1A1E27" stroke="#FFC531" strokeWidth={5} />{tx(0, -130, "KURAL", 50, "#FFC531", 700, "middle")}{tx(0, -20, "Yapay zekâ taslağı hazırlar.", 56, "#FFF", 700, "middle")}<g opacity={rp(t, a + 1.6, a + 2.1)}>{tx(0, 90, "Her rakamı SEN kontrol edersin.", 56, H.green, 700, "middle")}</g></g>) },
  { c: "Bir süre sonra grafikleri", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#1E1F22" />{Array.from({ length: 6 }, (_, i) => { const k = cl(rp(t, a + 0.2, b - 0.3) * 6 - i); return <g key={i} transform={`translate(${40 + (i % 3) * 320},${60 + Math.floor(i / 3) * 290})`} opacity={k}><rect width={290} height={250} rx={14} fill="#2A2C31" />{i % 2 ? <LineChart x={20} y={40} w={250} h={180} pts={[0.2, 0.5, 0.4, 0.8, 0.7, 1]} grid={false} c={["#3EA6FF", "#2BB673", "#FFB547"][i % 3]} /> : <g>{[0.5, 0.8, 0.3, 0.9].map((v, j) => <rect key={j} x={30 + j * 60} y={220 - v * 170} width={40} height={v * 170} rx={6} fill={["#E5322D", "#7E5BD6", "#3EA6FF"][i % 3]} />)}</g>}</g>; })}</g>, { z: [1.4, 1.55] }) },
  { c: "Saatler süren işler", r: (t, a, b) => board(t, a, b, <g><Clock x={960} y={500} s={1.6} h={3} m={0} spin={rp(t, a, b) * 4} /></g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Saatler → dakikalar" y={860} size={70} /> },
  { c: "Ama bir şeyi fark ediyorsun", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 12 }, (_, i) => <g key={i}><Thumb x={140 + (i % 4) * 420} y={150 + Math.floor(i / 4) * 280} w={380} kind="edit" /></g>)}</g>, { z: [1.2, 1] }), html: (t, a) => <Big t={t} at={a + 1.6} text="Herkes aynı videoyu yapabiliyor" y={470} size={60} /> },
  { c: "Farkı yaratan", r: (t, a, b) => desk(t, a, b, SEN22, { arms: "chin", mouth: "smile", z: [1.5, 1.65], c0: [960, 400], old: false, lookY: -0.3, look: 0.4, extra: <Bulb x={1280} y={180} s={0.7} t={t} /> }), html: (t, a) => <Big t={t} at={a + 0.6} text="Fark: senin fikrin + senin araştırman" y={790} size={56} c="#FFC531" /> },
  { c: "İlk gerçek sponsorun", r: (t, a, b) => scr(t, a, b, <Mail from="Güvenli Bağlantı VPN" subject="Sponsorluk teklifi" badge="SPONSORLUK" badgeC="#7E5BD6" lines={["Merhaba! Kanalınız izleyicilerimizle çok uyumlu.", "Bir videoda 60 saniyelik tanıtım için teklifimiz:", "$1.000"]} k={rp(t, a + 0.2, a + 0.9)} />, { z: [1.45, 1.6], c0: [1000, 440] }), sfx: "ding" },
  { c: "Türkiye'de birçok uygulamaya", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#1B2440" />{Array.from({ length: 12 }, (_, i) => { const lock = i % 3 === 1; return <g key={i} transform={`translate(${50 + (i % 4) * 87},${150 + Math.floor(i / 4) * 120})`}><rect x={-32} y={-32} width={64} height={64} rx={16} fill={["#5865F2", "#00A2FF", "#25D366", "#E1306C", "#FF0000", "#1DA1F2"][i % 6]} opacity={lock ? 0.35 : 1} />{lock && <g><rect x={-14} y={-4} width={28} height={22} rx={4} fill="#FFF" /><path d="M-9,-4 v-8 a9,9 0 0,1 18,0 v8" stroke="#FFF" strokeWidth={4} fill="none" /></g>}</g>; })}<rect x={20} y={560} width={320} height={80} rx={16} fill="#2A2F45" />{tx(180, 610, "Erişim engellendi", 20, "#FF8A80", 700, "middle")}</g>) },
  { c: "Tek bir video için bin", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <><Counter t={t} a={a} from={0} to={1000} dur={1.2} label="tek bir video için" y={300} c={H.green} prefix="$" /><Big t={t} at={a + 2} text="≈ bir aylık reklam geliri" y={760} size={52} /></> },
  { c: "Gelirin büyüdükçe", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 480]}><Studio t={t} /><Person x={620} y={1060} s={0.9} t={t} o={SEN22} arms="desk" mouth="flat" look={0.6} /><Person x={1300} y={1060} s={0.9} t={t} o={{ hairStyle: "short", hair: "#555", top: "#2E3A55", top2: "#222B40", kind: "shirt", glasses: true, mustache: true }} dir={-1} arms="hold" mouth="smile" talk hold={<g><rect x={-90} y={-60} width={180} height={120} fill="#FBF9F3" /><rect x={-70} y={-40} width={140} height={8} fill="#999" /><rect x={-70} y={-20} width={100} height={8} fill="#999" /></g>} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="Şirket + muhasebeci" y={70} size={60} /> },
  { c: "YouTuber olmak, bir gün", r: (t, a, b) => board(t, a, b, <g transform="translate(960,500)"><rect x={-260} y={-200} width={520} height={360} fill="#2A2F3A" /><path d="M-300,-200 L0,-360 L300,-200Z" fill="#E5322D" /><rect x={-60} y={40} width={120} height={120} fill="#FFC531" />{tx(0, -230, "İŞLETME", 50, "#FFF", 700, "middle")}</g>), html: (t, a) => <Big t={t} at={a + 1.2} text="Fark etmeden küçük bir işletme" y={830} size={56} /> },
  // ── 23 YAŞ · ASKERLİK
  { c: "Yirmi üç yaşındasın", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 440]}><Salon t={t} /><Person x={960} y={1060} s={1} t={t} o={{ ...SEN22, kind: "jacket", top: "#111", top2: "#000" }} arms="wave" mouth="grin" /><g transform={`translate(${960 + 0},${310 + Math.sin(t * 2) * 6})`}><path d="M-120,0 L0,-50 L120,0 L0,50Z" fill="#111" /><rect x={-50} y={10} width={100} height={40} fill="#111" /><path d="M100,6 L110,80" stroke="#FFC531" strokeWidth={6} /></g></HCam>, html: (t, a) => <><AgeTag t={t} at={a + 0.3} age="23 yaş" place="Mezun · 220.000 abone" /></> },
  { c: "Ve kapıya bir kâğıt", r: (t, a, b) => { const k = rp(t, a + 1.2, a + 2); return <HCam t={t} a={a} b={b} z={[1.2, 1.5]} c0={[960, 560]}><Door t={t} knock={1 - k} /><Paper x={960} y={lp(1500, 560, k)} s={0.8} rot={lp(-20, -4, k)} title="ASKERLİK" lines={["Yoklama ve sevk", "Birliğine katılış tarihi:"]} stamp="SEVK" /></HCam>; }, sfx: "knock" },
  { c: "Altı ay. Altı ay boyunca", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.15, 1.3]} c0={[960, 540]}><Kisla t={t} /><Person x={960} y={1060} s={0.95} t={t} o={SEN23} arms="down" mouth="flat" eyes="open" /></HCam>, html: (t, a) => <Big t={t} at={a + 0.5} text="6 ay: video yok, yorum yok" y={80} size={60} /> },
  { c: "Gitmeden önceki üç ayda", r: (t, a, b) => desk(t, a, b, SEN22, { bg: "studio", arms: "type", mouth: "tight", brow: "angry", z: [1.15, 1.3], old: false }), html: (t, a) => <Counter t={t} a={a} from={0} to={12} dur={2.6} label="hazır video" y={70} c="#FFF" /> },
  { c: "Montajcın her hafta", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 12 }, (_, i) => { const k = rp(t, a + i * 0.12, a + i * 0.12 + 0.3); return <g key={i} transform={`translate(${280 + (i % 6) * 270},${360 + Math.floor(i / 6) * 300})`} opacity={k}><rect x={-110} y={-110} width={220} height={220} rx={20} fill="#1A1E27" />{tx(0, -40, `${i + 1}. hafta`, 30, "#AAA", 600, "middle")}<g transform="translate(0,30)"><PlayLogo x={0} y={0} s={1.4} /></g></g>; })}</g>), html: (t, a) => <Big t={t} at={a + 0.4} text="Her hafta 1 video" y={70} size={60} /> },
  { c: "Bir izin gününde", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 420]}><Kisla t={t} /><Person x={960} y={1060} s={1} t={t} o={SEN23} arms="phone" mouth="smile" eyes="wide" lit={1} lookY={0.8} /></HCam> },
  { c: "Kanal büyümemiş", r: (t, a, b) => ph(t, a, b, subsScreen(220000, "Abone", "+0"), { bg: "kisla" }) },
  { c: "Bir videon dokuz yüz", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#0F0F0F" /><Thumb x={10} y={80} w={340} kind="phone" />{tx(16, 300, "Telefonunu Bunu Yapmadan Satma", 18, "#FFF", 700)}{tx(16, 360, `${fmt(lp(400000, 900000, rp(t, a + 0.3, a + 2)))} izlenme`, 30, "#FFF", 700)}{tx(16, 400, "4.000 yorum", 22, "#AAA", 600)}</g>, { bg: "kisla", z: [1.2, 1.4], c0: [960, 400] }) },
  { c: "Yarısı: \"Abi neredesin", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 10 }, (_, i) => { const k = cl(rp(t, a, b - 0.3) * 10 - i); return <g key={i} opacity={k} transform={`translate(${200 + (i % 2) * 800},${120 + Math.floor(i / 2) * 180})`}><Comment x={0} y={0} name={["@ali", "@ece", "@can", "@deniz", "@onur", "@sena", "@efe", "@nur", "@mert", "@arda"][i]} text={["Abi neredesin?", "Abi neredesin??", "Yeni video ne zaman", "Abi neredesin 😢", "Kanal öldü mü?", "Abi neredesin?", "Askerde mi?", "Abi neredesin!!", "Özledik", "Abi neredesin?"][i]} c={["#E5322D", "#2BB673", "#3EA6FF", "#FFB547", "#7E5BD6"][i % 5]} w={700} /></g>; })}</g>) },
  { c: "Döndüğünde ise izlenmeler", r: (t, a, b) => scr(t, a, b, <StudioShell title="Kanal analizi"><Stat x={0} y={10} label="İzlenme (28 gün)" value="−%40" w={360} c="#FF6B6B" pulse={1} /><LineChart x={0} y={180} w={760} h={280} pts={[0.85, 0.88, 0.84, 0.86, 0.7, 0.55, 0.5, 0.52]} k={rp(t, a + 0.2, b - 0.2)} c={H.red} /></StudioShell>, { z: [1.5, 1.65], c0: [860, 400] }), sfx: "buzz" },
  { c: "Ne sebebi belli", r: (t, a, b) => desk(t, a, b, SEN22, { bg: "studio", arms: "head", mouth: "sad", brow: "worry", z: [1.5, 1.65], c0: [960, 420], old: false }), html: (t, a) => <Big t={t} at={a + 1.8} text="Tek gelire bağlı kalmak" y={790} size={60} c="#FF6B6B" /> },
  { c: "Üç şey yapıyorsun", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["Düzenli\nsponsorluk", "İngilizce +\nArapça ses", "Kısa bir\neğitim"], H.green)) },
  { c: "İkincisi, en iyi videolarına", r: (t, a, b) => scr(t, a, b, <StudioShell title="İçerik">{tx(0, 30, "Ses parçaları", 26, "#FFF", 700)}{[["Türkçe", "Orijinal"], ["English", "Eklendi"], ["العربية", "Eklendi"]].map(([l, s], i) => <g key={i} opacity={cl(rp(t, a + 0.2, b - 0.3) * 3 - i)} transform={`translate(0,${70 + i * 110})`}><rect width={760} height={90} rx={12} fill={H.ui2} />{Array.from({ length: 40 }, (_, j) => <rect key={j} x={200 + j * 10} y={45 - (6 + Math.abs(Math.sin(j * 1.7 + i)) * 24)} width={6} height={12 + Math.abs(Math.sin(j * 1.7 + i)) * 48} rx={3} fill={i ? H.green : H.blue} />)}{tx(24, 55, l, 26, "#FFF", 700)}{tx(740, 55, s, 20, i ? H.green : H.dim, 600, "end")}</g>)}</StudioShell>, { z: [1.45, 1.6] }) },
  { c: "Üçüncüsü, izleyicilerinin", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#F7F7F9" /><rect x={60} y={60} width={420} height={500} rx={20} fill="#14181F" /><g transform="translate(270,250) rotate(-8)"><rect x={-70} y={-130} width={140} height={260} rx={22} fill="#1A1C20" stroke="#8892A6" strokeWidth={4} /><rect x={-60} y={-118} width={120} height={236} rx={16} fill="#2C4A7A" /></g>{tx(270, 500, "MİNİ EĞİTİM", 32, "#FFC531", 700, "middle")}{tx(530, 120, "Telefonu doğru alma", 34, "#111", 700)}{tx(530, 160, "rehberi", 34, "#111", 700)}{["✓ 6 kısa ders", "✓ Kontrol listesi", "✓ Sık sorulan sorular"].map((s, i) => <g key={i}>{tx(530, 240 + i * 50, s, 24, "#333", 600)}</g>)}<rect x={530} y={430} width={300} height={70} rx={35} fill={H.red} />{tx(680, 476, "Katıl", 28, "#FFF", 700, "middle")}</g>, { z: [1.4, 1.5] }) },
  { c: "Artık YouTube'daki tek", r: (t, a, b) => board(t, a, b, <g transform="translate(960,520)">{[["Reklam", 0.35, "#E5322D"], ["Sponsor", 0.35, "#7E5BD6"], ["Eğitim", 0.18, "#2BB673"], ["Diğer diller", 0.12, "#3EA6FF"]].reduce<{ el: React.ReactNode[]; acc: number }>((s, [n, v, c], i) => { const k = rp(t, a + 0.2, a + 1.6); const len = 1885 * Number(v) * k; s.el.push(<circle key={i} r={300} fill="none" stroke={String(c)} strokeWidth={120} strokeDasharray={`${len} 1885`} strokeDashoffset={-1885 * s.acc * k} transform="rotate(-90)" />); s.el.push(<g key={`l${i}`} opacity={k}>{tx(520, -180 + i * 110, String(n), 44, String(c), 700)}</g>); s.acc += Number(v); return s; }, { el: [], acc: 0 }).el}</g>), html: (t, a) => <Big t={t} at={a + 1.8} text="Tek değişiklik artık yarıya indiremez" y={60} size={52} /> },
  // ── 26 YAŞ
  { c: "Yirmi altı yaşındasın", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.12]} c0={[960, 540]}><Studio t={t} /><Person x={960} y={1060} s={0.95} t={t} o={SEN26} arms="desk" mouth="smile" /></HCam>, html: (t, a) => <AgeTag t={t} at={a + 0.3} age="26 yaş" place="Tam 10 yıl sonra" /> },
  { c: "Ekibin beş kişi", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.08]} c0={[960, 520]}><Studio t={t} />{[EDITOR, { ...EDITOR, hairStyle: "fade" as const, top: "#2E7FD8", top2: "#2364AE" }, { hairStyle: "bun" as const, hair: "#3A2418", top: "#E86A92", top2: "#C24F75", kind: "sweater" as const }, { hairStyle: "short" as const, top: "#3FAE6A", top2: "#2E8A55", kind: "tshirt" as const, glasses: true }, { hairStyle: "short" as const, hair: "#555", top: "#2E3A55", top2: "#222B40", kind: "shirt" as const, glasses: true, mustache: true }].map((o, i) => <Person key={i} x={260 + i * 350} y={1080} s={0.62} t={t} o={o} seed={i * 3} arms={i === 2 ? "wave" : "down"} mouth="smile" look={0} />)}{["Montaj", "Montaj", "Kapak", "Araştırma", "Muhasebe"].map((s, i) => <g key={s + i} opacity={rp(t, a + 0.4 + i * 0.4, a + 0.8 + i * 0.4)}><rect x={260 + i * 350 - 130} y={940} width={260} height={64} rx={14} fill="#111" opacity={0.85} />{tx(260 + i * 350, 984, s, 32, "#FFF", 700, "middle")}</g>)}</HCam> },
  { c: "Masraflardan sonra", r: (t, a, b) => desk(t, a, b, SEN26, { bg: "studio", arms: "chin", mouth: "tight", brow: "worry", z: [1.45, 1.6], c0: [960, 420], old: false }), html: (t, a) => <><Big t={t} at={a + 0.4} text="Her ay birkaç bin dolar" y={70} size={60} c={H.green} /><Big t={t} at={a + 2.6} text="…ama hâlâ stresli" y={800} size={60} c="#FF6B6B" /></> },
  { c: "Bir sabah kapı çalıyor", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 520]}><Door t={t} knock={1 - rp(t, a + 1.4, a + 1.8)} open={rp(t, a + 1.8, b)} /></HCam>, sfx: "knock" },
  { c: "Kargodan büyük", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 560]}><Studio t={t} /><rect y={760} width={1920} height={320} fill="#2A2E36" /><Box x={960} y={720} s={1.2} open={rp(t, a + 1.4, b)} /></HCam> },
  { c: "İçinden altın bir", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.7]} c0={[960, 480]}><rect width={1920} height={1080} fill="#0E0F13" /><ellipse cx={960} cy={480} rx={800} ry={500} fill="url(#hLamp)" opacity={0.6} /><Plaque x={960} y={480 + (1 - rp(t, a, a + 1.2)) * 300} s={0.95} t={t} /></HCam>, html: (t, a) => <Big t={t} at={a + 1.8} text="1.000.000 abone" y={900} size={70} c="#FFD36A" />, sfx: "ding", tone: "gold" },
  { c: "O akşam kuzeninin", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.32]} c0={[960, 500]}><Salon t={t} /><Person x={700} y={1060} s={0.95} t={t} o={SEN26} arms="down" mouth="smile" look={0.6} /><Person x={1250} y={1080} s={0.62} t={t} o={COCUK} dir={-1} arms="wave" mouth="grin" eyes="open" talk={t > a + 2} look={-0.6} lookY={-0.5} />{bub(t, a + 2.2, 1320, 360, "Abi, ben de YouTuber olacağım!", 38)}</HCam> },
  { c: "Dolaptan ablandan kalan", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.4]} c0={[960, 560]}><Salon t={t} /><rect y={760} width={1920} height={320} fill="#6E4528" /><Laptop x={960} y={540} s={0.7} old t={t} on={rp(t, a + 1.4, b)}><rect width={1000} height={625} fill="#0A2A5A" />{tx(500, 300, "Başlatılıyor…", 40, "#FFF", 600, "middle")}<circle cx={500} cy={380} r={30} fill="none" stroke="#FFF" strokeWidth={6} strokeDasharray="40 150" transform={`rotate(${t * 300} 500 380)`} /></Laptop></HCam>, html: (t, a) => <Big t={t} at={a + 1.8} text="Açılması: 3 dakika" y={80} size={60} /> },
  { c: "İlk kanalına giriyorsun", r: (t, a, b) => scr(t, a, b, list([{ title: "Minecraft'ta 100 Gün Hayatta Kaldım", views: 7, date: "10 yıl önce" }], 1, 0, "Kanal içeriği"), { old: true, z: [1.5, 2], c0: [900, 420], c1: [1130, 380] }), tone: "warm" },
  { c: "Yedi izlenme", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.1, 2.3]} c0={[960, 380]}><Salon t={t} /><Person x={960} y={1060} s={1} t={t} o={SEN26} arms="desk" mouth="smile" eyes="half" lit={1} lookY={0.8} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.2} text="7 izlenme" y={800} size={90} /> },
  // ── KARAR
  { c: "Peki, Türkiye'de YouTuber", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.15]} c0={[960, 540]}><Studio t={t} night /><Person x={960} y={1060} s={0.95} t={t} o={SEN26} arms="cross" mouth="flat" talk={t > a + 2} look={0} lookY={0} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="Gerçekten değer mi?" y={70} size={84} c="#FFC531" /> },
  { c: "Başlamak için neredeyse", r: (t, a, b) => board(t, a, b, <g><Phone x={660} y={540} s={0.6}><rect width={360} height={740} fill="#2C4A7A" /></Phone>{tx(1260, 520, "₺0", 220, H.green, 700, "middle")}{tx(1260, 620, "başlangıç sermayesi", 40, "#AAA", 600, "middle")}</g>) },
  { c: "Ama zaman çok pahalı", r: (t, a, b) => board(t, a, b, <g><Clock x={960} y={480} s={1.6} h={10} m={10} spin={rp(t, a, b) * 2} /></g>), html: (t, a) => <Big t={t} at={a + 0.4} text="Zaman çok pahalı" sub="ilk ciddi para: yıllar sonra" y={820} size={64} c="#FF6B6B" /> },
  { c: "Ve çoğu kanal", r: (t, a, b) => board(t, a, b, <g>{tx(960, 640, "7", 520, "#FFF", 700, "middle")}</g>, { z: [1, 1.2] }), html: (t, a) => <Big t={t} at={a + 0.8} text="Çoğu kanal ilk 7 izlenmeyi geçemiyor" y={820} size={52} /> },
  { c: "Türkiye'den gelen izlenme", r: (t, a, b) => board(t, a, b, <AdBars x={240} y={330} k={rp(t, a + 0.2, b - 0.2)} />) },
  { c: "Gerçek para çoğu zaman", r: (t, a, b) => board(t, a, b, cards(t, a + 0.3, ["Reklam\n(az)", "Sponsorlar", "Kendi\nişlerin"], "#FFB547")) },
  { c: "En büyük düşmanların", r: (t, a, b) => board(t, a, b, cards(t, a + 0.6, ["Algoritma", "Yorgunluk", "Senin elinde\nolmayan kararlar"], H.red)) },
  { c: "Kimler için", r: (t, a, b) => desk(t, a, b, SEN26, { bg: "studio", arms: "desk", mouth: "smile", z: [1.3, 1.4], old: false, lookY: 0 }), html: (t, a) => <><Big t={t} at={a + 0.6} text="1 yıl kazanmadan, her hafta video" y={70} size={52} /></> },
  { c: "Ve insanların gerçek bir derdini", r: (t, a, b) => board(t, a, b, <Bulb x={960} y={420} s={1.4} t={t} />), html: (t, a) => <Big t={t} at={a + 0.3} text="İnsanların gerçek derdini çözenler" y={780} size={60} c="#FFC531" /> },
  { c: "Zorluk: ondan dokuz", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.05]}><rect width={1920} height={1080} fill="#0E1016" /></HCam>, html: (t, a) => <Verdict t={t} a={a} rows={[["Zorluk", 9], ["Sermaye", 1], ["Sabır", 10]]} /> },
  { c: "Şimdi sıra sende", r: (t, a, b) => { const msg = "Ben ... işine başlamak istiyorum"; const n = Math.floor(rp(t, a + 2.5, a + 5) * msg.length); return board(t, a, b, <g transform="translate(960,460)"><rect x={-680} y={-170} width={1360} height={340} rx={30} fill="#1A1E27" /><circle cx={-560} cy={-60} r={56} fill={H.red} />{tx(-470, -60, "Yorum ekle…", 40, "#AAA", 600)}{tx(-470, 20, msg.slice(0, n) + (Math.floor(t * 3) % 2 ? "|" : ""), 44, "#FFF", 600)}<rect x={380} y={80} width={240} height={66} rx={33} fill={H.blue} />{tx(500, 124, "YORUM", 30, "#000", 700, "middle")}</g>); }, html: (t, a) => <><Big t={t} at={a + 0.8} text="İnternette hangi işi yaptın?" y={70} size={64} c="#FFC531" /></> },
  { c: "Sıradaki işleri", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["Senin\nyorumun", "Sıradaki\niş", "Bütün\nyolu"], H.blue)), html: (t, a) => <SubBtn t={t} at={a + 2} /> },
];

// telefon montaj şeridi kaydırma (EditApp ile aynı)
function md2(t: number) { return ((t * 40) % 120 + 120) % 120; }

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K6_01_SECONDS));
  return raw;
})();

export const K6Video01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const fadeIn = rp(t, 0, 0.4);
  const cutFlash = 1 - rp(t, s.from, s.from + 0.12);
  const fadeOut = 1 - rp(t, K6_01_SECONDS - 1.5, K6_01_SECONDS);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
        <HFrame>
          {s.r(t, s.from, s.to)}
          <Atmos t={t} tone={s.tone ?? "warm"} dust={0.45} rays={0.35} seed={n} />
          <Sweep t={t} a={s.from} />
        </HFrame>
        {s.html?.(t, s.from, s.to)}
        <AbsoluteFill style={{ background: "#FFFFFF", opacity: cutFlash * 0.18, pointerEvents: "none" }} />
      </AbsoluteFill>
      <Audio src={staticFile("audio/k6-01.wav")} />
      {TIMED.map((x, i) => i > 0 && x.to < K6_01_SECONDS - 15 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.sfx === "knock" ? 0.08 : x.sfx ? 0.15 : 0.07} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
