import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k6-03-words.json";
import { makeCue } from "../../lib/cues";
import { Atmos, Sweep, Tone } from "../../components/Live";
import {
  ANNE, AdBars, AgeTag, BackView, BankCard, Big, Box, Bulb, Comment, Counter, H, HCam, HFrame, Laptop, LineChart, LockScreen, Look, Mail, Notif,
  Person, Phone, PlayLogo, Progress, SEN26, Salon, Stat, Studio, StudioShell, SubBtn, TeaGlass, TeenRoom, Verdict, cl, fmt, lp, rp, short,
} from "../../components/Hayat";
import { AiLabel, Baraj, ChannelCard, ChatGroup, CodeScreen, Cover, CoverKind, DEDE, DedeSalon, DeleteDialog, ELA, GroupPost, KoyEvi, LinkMap, Minare, NightRoad, Ordek, Signal, TEYZE } from "../../components/HayatKoy";

// Kanal 4 · k6-03 · "5 Kanaldan Ayda 3.000$'a: Türkiye'de AI YouTuber Olarak Hayatın"
// Ses: ElevenLabs Hasan Yasin (eleven_v4), 4 parça; kelime zamanları Scribe. Seviye kartı YOK; geçiş yaş etiketiyle.

const W = words as { text: string; start: number; end: number }[];
const cue = makeCue(W);
const VOICE_END = W[W.length - 1].end;
export const K6_03_SECONDS = Math.ceil(VOICE_END + 4);
type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone };

// ───────── karakterler ─────────

const UI = "Poppins";
const tx = (x: number, y: number, s: string, size = 24, c = "#FFF", w = 600, anchor: "start" | "middle" | "end" = "start") => <text x={x} y={y} fontFamily={UI} fontWeight={w} fontSize={size} fill={c} textAnchor={anchor}>{s}</text>;

// ───────── sahne yardımcıları ─────────
const LidBack: React.FC<{ x: number; y: number; s?: number; old?: boolean }> = ({ x, y, s = 1, old }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <ellipse cx={0} cy={-120} rx={420} ry={260} fill="url(#hGlow)" />
    <path d="M-300,0 L-270,-330 L270,-330 L300,0Z" fill={old ? "#4A4D54" : "#2B2E35"} />
    {old && <><circle cx={-120} cy={-200} r={36} fill="#3EA6FF" opacity={0.5} /><rect x={60} y={-240} width={110} height={60} rx={10} fill="#F6C445" opacity={0.6} transform="rotate(12 115 -210)" /></>}
    <rect x={-330} y={0} width={660} height={18} rx={6} fill={old ? "#55585F" : "#33363D"} />
  </g>
);

type Bg = "room" | "studio" | "salon";
const BG: React.FC<{ t: number; bg: Bg; night?: boolean }> = ({ t, bg, night }) => (bg === "room" ? <TeenRoom t={t} night={night ?? true} poster="X" /> : bg === "studio" ? <Studio t={t} night={night} /> : <Salon t={t} />);

// karşıdan: masada sen + laptop arkası
const desk = (t: number, a: number, b: number, o: Look, p: { z?: [number, number]; c0?: [number, number]; c1?: [number, number]; mouth?: any; brow?: any; eyes?: any; arms?: any; look?: number; lookY?: number; bg?: Bg; old?: boolean; extra?: React.ReactNode; slump?: number; talk?: boolean; night?: boolean; shake?: number } = {}) => {
  const bg = p.bg ?? "room";
  const sh = p.shake ? Math.sin(t * 50) * 4 * p.shake : 0;
  return (
    <HCam t={t} a={a} b={b} z={p.z ?? [1.25, 1.4]} c0={p.c0 ?? [960, 520]} c1={p.c1}>
      <BG t={t} bg={bg} night={p.night} />
      <g transform={`translate(${sh},0)`}><Person x={960} y={880} s={0.95} t={t} o={o} arms={p.arms ?? "type"} mouth={p.mouth ?? "flat"} brow={p.brow} eyes={p.eyes} look={p.look ?? 0} lookY={p.lookY ?? 0.6} lit={1} slump={p.slump} talk={p.talk} /></g>
      <rect x={300} y={860} width={1320} height={30} fill={bg === "studio" ? "#3A3F4A" : H.wood} /><rect x={300} y={890} width={1320} height={200} fill={bg === "studio" ? "#2A2E36" : H.wood2} />
      {(p.arms ?? "type") !== "phone" && <LidBack x={960} y={870} s={0.9} old={p.old ?? true} />}
      <TeaGlass x={1420} y={860} s={0.9} t={t} />
      {p.extra}
    </HCam>
  );
};

// omuz üstünden: arkadan sen + laptop ekranı (1000x625)
const over = (t: number, a: number, b: number, o: Look, screen: React.ReactNode, p: { z?: [number, number]; c0?: [number, number]; c1?: [number, number]; old?: boolean; bg?: Bg; type?: boolean; slump?: number } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.12]} c0={p.c0 ?? [1000, 480]} c1={p.c1}>
    <g style={{ filter: "blur(5px)" }}><BG t={t} bg={p.bg ?? "room"} /></g>
    <rect y={790} width={1920} height={290} fill={H.wood2} />
    <Laptop x={1080} y={470} s={0.78} old={p.old ?? true} t={t}>{screen}</Laptop>
    <ellipse cx={1080} cy={480} rx={700} ry={420} fill="url(#hGlow)" opacity={0.35} />
    <BackView x={430} y={1260} s={1.05} t={t} o={o} type={p.type ?? true} slump={p.slump} />
  </HCam>
);

// ekran yakın çekim
const scr = (t: number, a: number, b: number, screen: React.ReactNode, p: { z?: [number, number]; c0?: [number, number]; c1?: [number, number]; old?: boolean } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1.55, 1.7]} c0={p.c0 ?? [960, 520]} c1={p.c1} k={0.6}>
    <rect width={1920} height={1080} fill="#0B0D12" />
    <Laptop x={960} y={560} s={1} old={p.old} t={p.old ? t : 0}>{screen}</Laptop>
  </HCam>
);

// telefon elde
const ph = (t: number, a: number, b: number, screen: React.ReactNode, p: { bg?: Bg; z?: [number, number]; light?: boolean; rot?: number; c0?: [number, number]; c1?: [number, number] } = {}) => {
  const by = Math.sin(t * 1.4) * 6;
  return (
    <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.08]} c0={p.c0 ?? [960, 540]} c1={p.c1}>
      <g style={{ filter: "blur(9px)" }}><BG t={t} bg={p.bg ?? "room"} /></g>
      <rect width={1920} height={1080} fill="#000" opacity={0.35} />
      <g transform={`translate(0,${by})`}>
        <Phone x={960} y={560} s={1.18} rot={p.rot ?? -3} light={p.light}>{screen}</Phone>
        {[-1, 1].map((d) => <g key={d}><path d={`M${960 + d * 250},${1180} Q${960 + d * 260},${900} ${960 + d * 215},${760}`} stroke={H.skin} strokeWidth={90} strokeLinecap="round" fill="none" /><ellipse cx={960 + d * 222} cy={720} rx={34} ry={60} fill={H.skin2} /></g>)}
      </g>
    </HCam>
  );
};

// düz grafik sahnesi
const board = (t: number, a: number, b: number, children: React.ReactNode, p: { z?: [number, number]; bg?: string; c0?: [number, number] } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.06]} k={0.5} c0={p.c0}>
    <rect width={1920} height={1080} fill={p.bg ?? "#10131A"} />
    {Array.from({ length: 20 }, (_, i) => <line key={i} x1={i * 100} x2={i * 100} y1={0} y2={1080} stroke="#FFF" opacity={0.025} />)}
    {children}
  </HCam>
);

// salon sahnesi (kişiler)
const room = (t: number, a: number, b: number, people: React.ReactNode, p: { z?: [number, number]; c0?: [number, number]; c1?: [number, number]; extra?: React.ReactNode } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1.1, 1.2]} c0={p.c0 ?? [960, 500]} c1={p.c1}><Salon t={t} />{people}{p.extra}</HCam>
);

// takvim
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

// kart dizisi
const cards = (t: number, a: number, items: string[], c = H.red, y = 520, gap = 560, w = 500) => (
  <g>{items.map((s, i) => { const k = rp(t, a + i * 0.6, a + i * 0.6 + 0.4); const x = 960 + (i - (items.length - 1) / 2) * gap; return <g key={i} transform={`translate(${x},${y + (1 - k) * 60})`} opacity={k}><rect x={-w / 2} y={-150} width={w} height={300} rx={26} fill="#1A1E27" stroke={c} strokeWidth={4} /><circle cx={0} cy={-80} r={40} fill={c} />{tx(0, -66, String(i + 1), 44, "#FFF", 700, "middle")}{s.split("\n").map((l, j) => <g key={j}>{tx(0, 30 + j * 52, l, 40, "#FFF", 700, "middle")}</g>)}</g>; })}</g>
);

// konuşma balonu
const bub = (t: number, at: number, x: number, y: number, s: string, size = 40, tail: 1 | -1 = -1) => {
  if (t < at) return null;
  const k = rp(t, at, at + 0.3);
  const w = s.length * size * 0.55 + 80;
  return <g transform={`translate(${x},${y}) scale(${0.7 + 0.3 * k})`} opacity={k}><rect x={-w / 2} y={-60} width={w} height={120} rx={44} fill="#FFF" /><path d={`M${tail * 40},56 L${tail * 80},110 L${tail * 100},56Z`} fill="#FFF" />{tx(0, size * 0.36, s, size, "#141414", 700, "middle")}</g>;
};

const Clock: React.FC<{ x: number; y: number; s?: number; h: number; m: number; spin?: number }> = ({ x, y, s = 1, h, m, spin = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={150} fill="#F4F1EA" stroke="#222" strokeWidth={12} />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-4} y={-140} width={8} height={22} fill="#333" transform={`rotate(${i * 30})`} />)}
    <rect x={-6} y={-80} width={12} height={84} rx={6} fill="#222" transform={`rotate(${(h % 12) * 30 + m * 0.5 + spin * 30})`} />
    <rect x={-4} y={-120} width={8} height={124} rx={4} fill="#C0392B" transform={`rotate(${m * 6 + spin * 360})`} />
    <circle r={12} fill="#222" />
  </g>
);

// ───────── k6-03 karakterleri
const S20: Look = { hairStyle: "fade", top: "#6A3E8A", top2: "#53306E", kind: "hoodie", beard: 0.15 };
const S21: Look = { ...S20, top: "#3E5A7A", top2: "#2F4660", beard: 0.5 };
const S22: Look = { hairStyle: "fade", top: "#2E3A2E", top2: "#222B22", kind: "jacket", beard: 0.7 };
const S23: Look = { ...SEN26, top: "#24303E", top2: "#1A2430" };
const GURU: Look = { hairStyle: "fade", hair: "#111", top: "#F4F4F4", top2: "#DADADA", kind: "shirt", beard: 0.9 };
const YT = "#FF0033";

// ───────── k6-03 yardımcıları
const yt = (title: string, body: React.ReactNode, av = "#7E5BD6") => <StudioShell title={title} avatar={av}>{body}</StudioShell>;
const kv = (x: number, y: number, label: string, value: string, c = "#FFF", w = 240) => <Stat x={x} y={y} label={label} value={value} c={c} w={w} />;

// Instagram'a benzer reklam (telefon içi 360x740)
const igAd = (t: number, a: number, cap = "Yüzünü göstermeden ayda $10.000", sale = true) => (
  <g>
    <rect width={360} height={740} fill="#0E0E10" />
    <rect y={80} width={360} height={420} fill="#2A2F3A" />
    <rect y={330} width={360} height={170} fill="#3A3F48" />
    <g transform="translate(70,330)"><path d="M0,40 Q20,-10 90,-20 L190,-20 Q240,-10 260,40 L260,70 L0,70Z" fill="#E5322D" /><rect x={40} y={-14} width={170} height={36} rx={10} fill="#1D2A3A" /><circle cx={50} cy={72} r={24} fill="#111" /><circle cx={214} cy={72} r={24} fill="#111" /><text x={130} y={-30} textAnchor="middle" fontFamily="Poppins" fontWeight={600} fontSize={13} fill="#BBB">KİRALIK</text></g>
    <g transform="translate(250,250) scale(0.42)"><Person x={0} y={200} s={1} t={t} o={GURU} arms="wave" mouth="grin" talk /></g>
    <text x={20} y={130} fontFamily="Poppins" fontWeight={700} fontSize={22} fill="#FFF">{cap.split(" ").slice(0, 3).join(" ")}</text>
    <text x={20} y={160} fontFamily="Poppins" fontWeight={700} fontSize={22} fill="#FFC531">{cap.split(" ").slice(3).join(" ")}</text>
    <circle cx={30} cy={540} r={16} fill="#C13584" /><text x={56} y={546} fontFamily="Poppins" fontWeight={600} fontSize={15} fill="#FFF">otomasyon.akademi · Sponsorlu</text>
    <rect x={14} y={580} width={332} height={50} rx={10} fill="#3797F0" /><text x={180} y={612} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={17} fill="#FFF">Kursa katıl · 1.500 TL</text>
    {sale && <g opacity={0.6 + 0.4 * Math.sin(t * 8)}><rect x={200} y={650} width={146} height={34} rx={17} fill="#E5322D" /><text x={273} y={673} textAnchor="middle" fontFamily="Poppins" fontWeight={700} fontSize={14} fill="#FFF">SADECE BU GECE</text></g>}
  </g>
);

// telif ihtarı (dizi)
const strikeD = (n: number, k = 1) => (
  <g>
    <rect width={1000} height={625} fill={H.ui} />
    <g transform={`translate(500,${300 + (1 - k) * 30})`} opacity={k}>
      <rect x={-380} y={-230} width={760} height={460} rx={18} fill={H.ui2} stroke="#E5322D" strokeWidth={3} />
      <circle cx={0} cy={-130} r={56} fill="#E5322D" />{tx(0, -108, "!", 70, "#FFF", 700, "middle")}
      {tx(0, -20, "Telif ihtarı", 42, "#FFF", 700, "middle")}
      {tx(0, 30, "Video kaldırıldı · dizi sahneleri, hak sahibi bildirimi", 20, "#CCC", 500, "middle")}
      {[0, 1, 2].map((i) => <g key={i} transform={`translate(${-130 + i * 130},120)`}><circle r={44} fill={i < n ? "#E5322D" : "none"} stroke={i < n ? "#E5322D" : "#555"} strokeWidth={5} />{tx(0, 14, String(i + 1), 38, i < n ? "#FFF" : "#666", 700, "middle")}</g>)}
      {tx(0, 205, "90 gün içinde 3 ihtar = kanal silinir", 20, "#FF8A80", 600, "middle")}
    </g>
  </g>
);

// kanal video listesi (ekran içi)
const vlist = (kind: CoverKind, titles: string[], views: number[], k = 1) => (
  <g>{titles.map((s, i) => <g key={i} opacity={cl(k * titles.length - i)} transform={`translate(0,${i * 100})`}><Cover x={0} y={0} w={140} kind={kind} />{tx(160, 34, s, 22, "#FFF", 600)}{tx(160, 64, `${fmt(views[i])} izlenme`, 18, "#AAA", 500)}</g>)}</g>
);

// fabrika: aynı kapaktan yüzlerce
const factory = (t: number, a: number, kind: CoverKind, n = 60) => (
  <g>{Array.from({ length: n }, (_, i) => { const k = rp(t, a + i * 0.025, a + 0.3 + i * 0.025); return <g key={i} opacity={k} transform={`translate(${130 + (i % 10) * 170},${150 + Math.floor(i / 10) * 130})`}><Cover x={0} y={0} w={150} kind={kind} /></g>; })}</g>
);

// kural sayfası
const rulePage = (t: number, a: number, hi: number) => (
  <g transform="translate(560,110)">
    <rect width={800} height={860} rx={16} fill="#FFF" />
    <PlayLogo x={60} y={60} s={1.2} />{tx(110, 72, "Para kazanma politikaları", 30, "#111", 700)}
    {tx(50, 150, "Özgün olmayan içerik", 34, "#111", 700)}
    {["Seri üretilmiş içerik", "Birbirinin tekrarı videolar", "Şablonla, az emekle yapılan", "Not: yapay zekâ kullanmak yasak değil"].map((s, i) => { const k = rp(t, a + 0.4 + i * 0.5, a + 0.8 + i * 0.5); return <g key={i} opacity={0.25 + 0.75 * k}><rect x={40} y={200 + i * 120} width={720} height={92} rx={12} fill={i === hi ? (i === 3 ? "#E3F7EC" : "#FFF3CD") : "#F4F4F4"} />{tx(70, 258 + i * 120, s, 30, i === 3 ? "#1B8A4B" : "#333", 600)}</g>; })}
    {Array.from({ length: 4 }, (_, i) => <rect key={i} x={40} y={700 + i * 34} width={600 - i * 90} height={14} rx={7} fill="#E3E3E3" />)}
  </g>
);

// para akışı: video → hak sahibi
const claimFlow = (t: number, a: number) => {
  const k = rp(t, a + 0.5, a + 2.2);
  return (
    <g>
      <g transform="translate(300,360)"><Cover x={0} y={0} w={420} kind="dizi" />{tx(210, 290, "Senin videon", 40, "#FFF", 700, "middle")}</g>
      <g transform="translate(1240,360)"><rect width={400} height={236} rx={18} fill="#1A1E27" stroke="#FFC531" strokeWidth={4} />{tx(200, 110, "HAK SAHİBİ", 44, "#FFC531", 700, "middle")}{tx(200, 160, "yapım şirketi", 28, "#AAA", 600, "middle")}{tx(200, 290, "Reklam parası", 40, "#FFF", 700, "middle")}</g>
      {Array.from({ length: 6 }, (_, i) => { const u = cl(k * 1.6 - i * 0.12); return <text key={i} x={lp(740, 1220, u)} y={470 - Math.sin(u * Math.PI) * 120} fontFamily="Poppins" fontWeight={700} fontSize={56} fill={H.green} opacity={u > 0 && u < 1 ? 1 : 0}>$</text>; })}
    </g>
  );
};

// tablet (Ela izliyor)
const Tablet: React.FC<{ x: number; y: number; s?: number; t: number; six?: number }> = ({ x, y, s = 1, t, six = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-330} y={-220} width={660} height={440} rx={34} fill="#1A1A1E" />
    <svg x={-300} y={-190} width={600} height={380} viewBox="0 0 600 380">
      <rect width={600} height={380} fill="#7FD3F5" /><rect y={290} width={600} height={90} fill="#69DB7C" /><circle cx={90} cy={70} r={40} fill="#FFE066" />
      <Ordek x={330} y={200} s={0.55} t={t} six={six} />
      {Array.from({ length: 3 }, (_, i) => <text key={i} x={70 + i * 170} y={60 + ((t * 40 + i * 50) % 100)} fontSize={34} fill="#FFF">♪</text>)}
    </svg>
  </g>
);

// salon kanepe sahnesi (Ela + sen)
const sofa = (t: number, a: number, b: number, p: { six?: number; z?: [number, number]; c0?: [number, number]; c1?: [number, number]; sen?: boolean; mouthSen?: any } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1.15, 1.25]} c0={p.c0 ?? [960, 560]} c1={p.c1}>
    <Salon t={t} />
    <Person x={760} y={1060} s={0.62} t={t} o={ELA} arms="hold" mouth="o" eyes="wide" lookY={0.6} />
    <Tablet x={760} y={900} s={0.38} t={t} six={p.six} />
    {p.sen !== false && <Person x={1180} y={1060} s={0.92} t={t} o={S20} dir={-1} arms="down" mouth={p.mouthSen ?? "flat"} look={-0.6} lookY={0.5} />}
  </HCam>
);

// köy göl sahnesi (dede yürür)
const lake = (t: number, a: number, b: number, p: { level?: number; night?: boolean; z?: [number, number]; c0?: [number, number]; c1?: [number, number]; dede?: { x: number; arms?: any; talk?: boolean; mouth?: any }; sen?: { x: number; arms?: any }; extra?: React.ReactNode } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.1]} c0={p.c0 ?? [960, 540]} c1={p.c1}>
    <Baraj t={t} level={p.level ?? 0.85} night={p.night} px={-(t - a) * 6} />
    {(p.dede || p.sen) && <g><path d="M0,1080 L0,900 Q300,860 620,880 Q980,905 1300,870 Q1640,840 1920,890 L1920,1080Z" fill={p.night ? "#2A2620" : "#7A6248"} /><path d="M0,920 Q400,885 820,905 Q1300,925 1920,905" stroke={p.night ? "#3A342A" : "#9A7E5E"} strokeWidth={10} fill="none" />{Array.from({ length: 9 }, (_, i) => <path key={i} d={`M${100 + i * 210},${960 + (i % 3) * 30} l40,10 l-20,24`} stroke={p.night ? "#1E1B16" : "#5E4A36"} strokeWidth={4} fill="none" />)}</g>}
    {p.dede && <Person x={p.dede.x} y={1080} s={0.72} t={t} o={DEDE} arms={p.dede.arms ?? "down"} mouth={p.dede.mouth ?? "flat"} talk={p.dede.talk} look={0.3} />}
    {p.sen && <Person x={p.sen.x} y={1080} s={0.78} t={t} o={S21} arms={p.sen.arms ?? "phone"} dir={-1} look={-0.5} />}
    {p.extra}
  </HCam>
);

const bigSix = (t: number, a: number) => <g><rect width={1920} height={1080} fill="#7FD3F5" /><rect y={820} width={1920} height={260} fill="#69DB7C" /><Ordek x={1080} y={520} s={1.6} t={t} six={rp(t, a + 0.8, a + 1.3)} /></g>;

const SHOTS: Sh[] = [
  // ── KANCA
  { c: "Bir gece", r: (t, a, b) => over(t, a, b, S20, <g><rect width={1000} height={625} fill="#202124" />{Array.from({ length: 5 }, (_, i) => { const k = rp(t, a + 0.4 + i * 0.45, a + 0.7 + i * 0.45); return <g key={i} opacity={k} transform={`translate(${20 + i * 192},14)`}><rect width={184} height={40} rx={10} fill={k > 0.9 && i === Math.min(4, Math.floor((t - a - 0.4) / 0.45)) ? "#35363A" : "#2A2B2E"} />{tx(14, 27, `Gmail ${i + 1}`, 16, "#DDD", 500)}</g>; })}{tx(500, 330, `${Math.min(5, Math.max(0, Math.floor((t - a - 0.2) / 0.45)))}/5 kanal`, 80, "#FFF", 700, "middle")}</g>, { z: [1, 1.12] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Bir gece · 5 YouTube kanalı" y={60} size={58} />, tone: "night" },
  { c: "Beşinde de bütün", r: (t, a, b) => board(t, a, b, <g>{(["ruya", "dizi", "cocuk", "luks", "koy"] as CoverKind[]).map((kd, i) => <ChannelCard key={i} x={260 + i * 350} y={500} kind={kd} name={`Kanal ${i + 1}`} k={rp(t, a + i * 0.2, a + 0.4 + i * 0.2)} note="AI" />)}</g>), html: (t, a) => <Big t={t} at={a + 0.8} text="Bütün işi yapay zekâ yapacak" y={70} size={60} c="#FFC531" /> },
  { c: "Sen sadece parayı", r: (t, a, b) => desk(t, a, b, S20, { mouth: "grin", arms: "cross", z: [1.4, 1.55], c0: [960, 430], night: true }), html: (t, a) => <Big t={t} at={a + 1.3} text="Plan buydu." y={830} size={70} /> },
  { c: "Bir yıl sonra", r: (t, a, b) => board(t, a, b, <g>{(["ruya", "dizi", "cocuk", "luks", "koy"] as CoverKind[]).map((kd, i) => <ChannelCard key={i} x={260 + i * 350} y={500} kind={kd} name={["Rüya", "Dizi", "Çocuk", "Lüks", ""][i]} state={i === 4 ? "hidden" : t > a + 1.2 + i * 1.1 ? (i === 1 ? "warn" : "dead") : "on"} note={t > a + 1.2 + i * 1.1 ? ["Reddedildi", "Silinmek üzere", "Kazanç yok", "0 izlenme", ""][i] : ""} />)}</g>, { bg: "#0D0F15" }), sfx: "buzz", tone: "cool" },
  { c: "Biri milyonlarca", r: (t, a, b) => SHOTS[3].r(t, a - 5.2, b), tone: "cool" },
  { c: "Ve beşincisi", r: (t, a, b) => board(t, a, b, <ChannelCard x={960} y={500} kind="koy" name="" state="hidden" />, { z: [1.2, 1.45] }) },
  { c: "Onu kurtaran", r: (t, a, b) => board(t, a, b, <g opacity={0.3}>{Array.from({ length: 12 }, (_, i) => <rect key={i} x={160 + (i % 4) * 420} y={200 + Math.floor(i / 4) * 230} width={380} height={190} rx={14} fill="#1F2937" />)}</g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Kurslarda olmayan şey" y={440} size={90} c="#FFC531" /> },
  { c: "Yirmi yaşındasın", r: (t, a, b) => desk(t, a, b, S20, { night: false, z: [1, 1.1], mouth: "flat" }), html: (t, a) => <AgeTag t={t} at={a + 0.2} age="20 yaş" place="Sivas · üniversite 2. sınıf" /> },
  { c: "Şimdi seninle birlikte", r: (t, a, b) => board(t, a, b, <g><LineChart x={260} y={260} w={1400} h={500} pts={[0.02, 0.05, 0.01, 0.03, 0.0, 0.02, 0.01, 0.04, 0.12, 0.3, 0.42, 0.55, 0.7, 1]} k={rp(t, a + 0.3, b - 0.2)} c={YT} />{tx(260, 830, "5 kanal", 54, "#FFF", 700)}{tx(1660, 230, "1 kanal · $3.000 / ay", 54, "#FFF", 700, "end")}</g>) },
  { c: "Neyin neden çöktüğünü", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Neden\nçöktü?", "Kimsenin okumadığı\nkurallar", "Yapay zekâ\nneyi yapamaz?"])) },
  { c: "kimsenin okumadığı kurallarını", r: (t, a, b) => board(t, a, b, rulePage(t, a, -1), { bg: "#1A1D24", z: [1, 1.1] }) },
  { c: "Bir gece saat üçte", r: (t, a, b) => board(t, a, b, <g><Clock x={960} y={470} s={1.4} h={3} m={0} /></g>, { bg: "#0A0C14" }), html: (t, a) => <Big t={t} at={a + 1.2} text="Tek bir tık…" y={860} size={64} c="#FF6B6B" />, tone: "night" },
  { c: "Ve en sonunda", r: (t, a, b) => board(t, a, b, <g style={{ filter: "blur(8px)" }} opacity={0.5}>{[0, 1, 2].map((i) => <rect key={i} x={460} y={330 + i * 140} width={1000} height={70} rx={14} fill={["#E5322D", "#2BB673", "#FFB547"][i]} />)}</g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Bu iş gerçekten değer mi?" y={440} size={100} c="#FFC531" /> },
  // ── REKLAM
  { c: "Her şey bir reklamla", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 520]}><TeenRoom t={t} night poster="X" lamp={0.2} /><rect width={1920} height={1080} fill="#000" opacity={0.4} /><Person x={960} y={1120} s={1} t={t} o={S20} arms="phone" eyes="half" mouth="flat" lookY={0.8} lit={1} /></HCam>, tone: "night" },
  { c: "Gece yarısı Instagram", r: (t, a, b) => ph(t, a, b, igAd(t, a), { z: [1.05, 1.2] }) },
  { c: "Yüzünü göstermeden", r: (t, a, b) => ph(t, a, b, igAd(t, a), { z: [1.5, 1.7], c0: [960, 400] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Ayda $10.000" y={820} size={90} c="#FFC531" /> },
  { c: "Altında bir kurs", r: (t, a, b) => ph(t, a, b, igAd(t, a), { z: [1.6, 1.8], c0: [960, 820] }), html: (t, a) => <Big t={t} at={a + 0.8} text="1.500 TL" y={80} size={90} /> },
  { c: "Sadece bu gece", r: (t, a, b) => ph(t, a, b, igAd(t, a), { z: [2.1, 2.3], c0: [1040, 900] }), sfx: "tick" },
  { c: "Almıyorsun", r: (t, a, b) => desk(t, a, b, S20, { arms: "phone", mouth: "tight", brow: "up", z: [1.6, 1.7], c0: [960, 420] }), html: (t, a) => <Big t={t} at={a + 0.9} text="Henüz." y={830} size={80} c="#FFC531" /> },
  { c: "Ama kafana bir fikir", r: (t, a, b) => desk(t, a, b, S20, { arms: "chin", mouth: "smile", look: 0.5, lookY: -0.4, z: [1.45, 1.6], c0: [960, 420], extra: <Bulb x={1300} y={240} s={0.7} on={rp(t, a + 0.8, a + 1.2)} t={t} /> }) },
  { c: "neden tek kanal", r: (t, a, b) => board(t, a, b, <g>{[0, 1, 2, 3, 4].map((i) => { const k = rp(t, a + 0.3 + i * 0.25, a + 0.6 + i * 0.25); return <g key={i} opacity={i === 0 ? 1 : k} transform={`translate(${lp(960, 260 + i * 350, i === 0 ? rp(t, a + 0.3, a + 0.8) : 1)},500)`}><circle r={120} fill="#1A1E27" stroke={YT} strokeWidth={6} /><PlayLogo x={0} y={0} s={2.4} /></g>; })}</g>), html: (t, a) => <Big t={t} at={a + 1.4} text="Hangisi tutarsa…" y={830} size={60} /> },
  { c: "O gece beş ayrı Gmail", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#FFF" />{tx(500, 90, "Hesap oluştur", 40, "#202124", 700, "middle")}{["kanal.ruya.tr", "dizi.ozet.tr", "cocuk.sarki.tr", "lux.life.en", "kanal5.tr"].map((s, i) => <g key={i} opacity={rp(t, a + 0.2 + i * 0.35, a + 0.5 + i * 0.35)}><rect x={250} y={140 + i * 86} width={500} height={64} rx={8} fill="#FFF" stroke="#1A73E8" strokeWidth={2} />{tx(270, 182 + i * 86, `${s}@gmail.com`, 24, "#202124", 500)}{tx(730, 182 + i * 86, "✓", 28, "#1E8E3E", 700, "end")}</g>)}</g>, { old: false, z: [1.35, 1.5] }) },
  { c: "Beş kanal adı", r: (t, a, b) => board(t, a, b, <g>{(["ruya", "dizi", "cocuk", "luks", "koy"] as CoverKind[]).map((kd, i) => { const k = rp(t, a + i * 0.3, a + 0.4 + i * 0.3); return <g key={i} opacity={k} transform={`translate(${260 + i * 350},480) scale(${0.6 + 0.4 * k})`}><circle r={120} fill={["#2A1450", "#3A2020", "#7FD3F5", "#0E2A44", "#333"][i]} stroke="#FFF" strokeWidth={6} />{tx(0, 22, ["☾", "▶", "♪", "$", "?"][i], 90, "#FFF", 700, "middle")}</g>; })}</g>), html: (t, a) => <Big t={t} at={a + 1.2} text="5 isim · 5 logo · hepsi yapay zekâdan" y={830} size={52} /> },
  { c: "Sabah ezanı okunurken", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.05, 1.15]} c0={[1500, 400]} c1={[1300, 450]}><TeenRoom t={t} night={false} poster="X" lamp={0} /><rect width={1920} height={1080} fill="#2A3A66" opacity={0.35} /><Minare x={1650} y={540} s={0.5} /><Person x={960} y={1080} s={0.95} t={t} o={S20} arms="type" eyes="half" mouth="flat" lookY={0.6} /></HCam>, tone: "cool" },
  { c: "Kahvaltıda annen", r: (t, a, b) => room(t, a, b, <><Person x={700} y={1060} s={0.95} t={t} o={ANNE} arms="hold" mouth="smile" talk look={0.6} /><Person x={1280} y={1060} s={0.92} t={t} o={S20} dir={-1} arms="down" eyes="half" mouth="flat" look={-0.5} /><TeaGlass x={980} y={880} s={1.2} t={t} /></>, { extra: bub(t, a + 1.2, 700, 300, "Bütün gece ders mi çalıştın?", 36, 1) }) },
  { c: "Evet anne", r: (t, a, b) => room(t, a, b, <><Person x={1100} y={1060} s={1.05} t={t} o={S20} dir={-1} arms="down" eyes="half" mouth="smile" look={-0.5} /></>, { z: [1.6, 1.75], c0: [1100, 420], extra: bub(t, a + 0.1, 1100, 210, "Evet anne.", 44) }) },
  // ── 1. KANAL: RÜYA
  { c: "Birinci kanal", r: (t, a, b) => board(t, a, b, <ChannelCard x={960} y={500} kind="ruya" name="Rüya Tabirleri" />, { z: [1.1, 1.3], bg: "#140A28" }), html: (t, a) => <Big t={t} at={a + 0.3} text="1. kanal: rüya tabirleri" y={60} size={60} c="#C9A6FF" /> },
  { c: "Rüyada yılan görmek", r: (t, a, b) => board(t, a, b, <g transform="translate(360,180) scale(3.7)"><Cover x={0} y={0} w={320} kind="ruya" /></g>, { bg: "#140A28" }), html: (t, a) => <Big t={t} at={a + 0.1} text="“Rüyada yılan görmek”" y={880} size={56} /> },
  { c: "Rüyada dişinin", r: (t, a, b) => board(t, a, b, <g>{[0, 1, 2].map((i) => <g key={i} opacity={i === 0 ? 1 : rp(t, a + i * 0.8, a + 0.3 + i * 0.8)} transform={`translate(${200 + i * 540},300)`}><Cover x={0} y={0} w={480} kind="ruya" />{tx(0, 330, ["Rüyada yılan", "Rüyada diş düşmesi", "Rüyada ölmüş birini"][i], 34, "#FFF", 700)}</g>)}</g>, { bg: "#140A28" }) },
  { c: "Metni yapay zekâ", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Metin:\nAI", "Ses:\nAI", "Resim:\nAI"], "#7E5BD6")) },
  { c: "Sen sadece birleştirip", r: (t, a, b) => over(t, a, b, S20, <g><rect width={1000} height={625} fill="#1E1E24" /><Cover x={300} y={40} w={400} kind="ruya" />{[0, 1, 2].map((r) => <g key={r} transform={`translate(${-((t - a) * 80) % 120},${330 + r * 80})`}>{Array.from({ length: 10 }, (_, i) => <rect key={i} x={i * 120} y={0} width={114} height={60} rx={6} fill={["#5A3E9A", "#2D5C8A", "#3B6E3A"][r]} />)}</g>)}<rect x={498} y={310} width={4} height={260} fill="#FFF" /></g>) },
  { c: "Günde üç video", r: (t, a, b) => scr(t, a, b, yt("Kanal içeriği", vlist("ruya", ["Rüyada yılan görmek", "Rüyada altın görmek", "Rüyada diş düşmesi", "Rüyada su görmek"], [312, 845, 1204, 96], rp(t, a, a + 1.4)), "#5A3E9A"), { z: [1.35, 1.5] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Günde 3 video" y={70} size={70} /> },
  { c: "Aynı ses", r: (t, a, b) => board(t, a, b, factory(t, a, "ruya", 40), { bg: "#140A28" }), html: (t, a) => <Big t={t} at={a + 1} text="Aynı ses · aynı müzik · aynı gökyüzü" y={880} size={50} /> },
  { c: "Ve şaşırtıcı bir şey", r: (t, a, b) => scr(t, a, b, yt("Kanal analizi", <g>{kv(0, 0, "Görüntüleme", fmt(lp(400, 182000, rp(t, a, b))), H.green)}{kv(260, 0, "Abone", fmt(lp(20, 640, rp(t, a, b))))}<LineChart x={0} y={170} w={760} h={250} pts={[0.01, 0.02, 0.05, 0.09, 0.2, 0.3, 0.5, 0.7, 1]} k={rp(t, a, b)} /></g>, "#5A3E9A"), { z: [1.35, 1.5] }), sfx: "ding" },
  { c: "Sabah uyanır uyanmaz", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#FFF" /><rect x={16} y={60} width={328} height={50} rx={25} fill="#F1F3F4" />{tx(36, 92, "rüyada yılan görmek ne demek", 15, "#202124", 500)}{["rüyada yılan görmek", "rüyada diş düşmesi", "rüyada altın görmek", "rüyada ölmüş birini görmek"].map((s, i) => <g key={i}>{tx(36, 160 + i * 52, "🔍  " + s, 17, "#333", 500)}</g>)}</g>, { light: true, bg: "salon" }) },
  { c: "Bir gün teyzen", r: (t, a, b) => room(t, a, b, <><Person x={700} y={1060} s={0.95} t={t} o={TEYZE} arms="phone" mouth="smile" talk look={0.6} /><Person x={1280} y={1060} s={0.92} t={t} o={S20} dir={-1} arms="down" mouth="flat" look={-0.5} /></>, { extra: bub(t, a + 1.2, 700, 300, "Rüyada altın görmek hayırmış!", 36, 1) }) },
  { c: "Senin kanalın", r: (t, a, b) => room(t, a, b, <Person x={1100} y={1060} s={1.05} t={t} o={S20} dir={-1} arms="down" mouth="tight" eyes="wide" look={-0.7} />, { z: [1.7, 1.85], c0: [1100, 420] }), html: (t, a) => <Big t={t} at={a + 0.3} text="(senin kanalın)" y={830} size={56} c="#C9A6FF" /> },
  { c: "Dört ayda bin", r: (t, a, b) => scr(t, a, b, yt("Para kazanma", <g><Progress x={0} y={60} w={740} v={rp(t, a + 0.2, a + 1.6)} label="Abone" right={`${fmt(lp(300, 1000, rp(t, a + 0.2, a + 1.6)))} / 1.000`} /><Progress x={0} y={190} w={740} v={rp(t, a + 0.6, a + 2.2)} label="İzlenme saati" right={`${fmt(lp(900, 4000, rp(t, a + 0.6, a + 2.2)))} / 4.000`} /></g>, "#5A3E9A"), { z: [1.35, 1.5] }) },
  { c: "YouTube'un para kazanma şartı", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["1.000\nabone", "4.000 saat\nizlenme"], H.green, 520, 640, 560)), html: (t, a) => <Big t={t} at={a + 1.2} text="Para kazanma şartı" y={80} size={64} c={H.green} /> },
  { c: "Başvuru düğmesine", r: (t, a, b) => scr(t, a, b, yt("Para kazanma", <g><rect x={170} y={120} width={400} height={80} rx={40} fill={t > a + 1 ? "#3A3A3A" : "#3EA6FF"} />{tx(370, 172, t > a + 1 ? "İnceleniyor…" : "BAŞVUR", 30, "#FFF", 700, "middle")}</g>, "#5A3E9A"), { z: [1.5, 1.7], c0: [960, 470] }), sfx: "pop" },
  { c: "Bir ay bekliyorsun", r: (t, a, b) => board(t, a, b, <g>{cal(t, a, "BEKLEME", "30", "gün")}</g>) },
  { c: "Her sabah ilk iş", r: (t, a, b) => desk(t, a, b, S20, { night: false, arms: "type", mouth: "tight", brow: "worry", z: [1.3, 1.45], extra: <TeaGlass x={1300} y={860} s={0.9} t={t} /> }) },
  { c: "Sonra bir sabah", r: (t, a, b) => ph(t, a, b, <LockScreen time="08:12" date="Salı"><Notif x={0} y={0} app="YouTube" title="Başvurunla ilgili bir güncelleme" body="Para kazanma programı" icon={YT} k={rp(t, a + 0.4, a + 0.8)} /></LockScreen>, { z: [1.1, 1.25] }), sfx: "ding" },
  { c: "Tek bir cümle", r: (t, a, b) => scr(t, a, b, <Mail from="YouTube" subject="Başvurun onaylanmadı" lines={["Kanalın şu nedenle onaylanmadı:", "", "Özgün olmayan içerik."]} k={rp(t, a, a + 0.6)} badge="REDDEDİLDİ" badgeC="#C62828" />, { z: [1.4, 1.6] }), tone: "cool" },
  { c: "nedeniyle reddedildi", r: (t, a, b) => scr(t, a, b, <Mail from="YouTube" subject="Başvurun onaylanmadı" lines={["Kanalın şu nedenle onaylanmadı:", "", "Özgün olmayan içerik."]} badge="REDDEDİLDİ" badgeC="#C62828" />, { z: [2.3, 2.6], c0: [700, 520] }), sfx: "buzz" },
  { c: "E-postayı üç kez", r: (t, a, b) => desk(t, a, b, S20, { night: false, arms: "chin", mouth: "sad", brow: "worry", slump: 0.6, z: [1.5, 1.65], c0: [960, 420] }), html: (t, a) => <Big t={t} at={a + 1.2} text="Hangi video? Hangi hata?" y={830} size={60} /> },
  { c: "Yazmıyor", r: (t, a, b) => board(t, a, b, <g>{tx(960, 560, "?", 400, "#FF6B6B", 700, "middle")}</g>) },
  { c: "O gün YouTube'un kendi", r: (t, a, b) => board(t, a, b, rulePage(t, a, -1), { bg: "#1A1D24" }) },
  { c: "İki bin yirmi beş", r: (t, a, b) => board(t, a, b, <g>{cal(t, a, "TEMMUZ", "2025", "kuralın yeni adı", 960, 420)}</g>), html: (t, a) => <Big t={t} at={a + 1} text="“Özgün olmayan içerik”" y={840} size={60} c="#FFC531" /> },
  { c: "seri üretilmiş", r: (t, a, b) => board(t, a, b, rulePage(t, a - 1, 1), { bg: "#1A1D24", z: [1.2, 1.3], c0: [960, 420] }) },
  { c: "Yapay zekâ yasak değil", r: (t, a, b) => board(t, a, b, rulePage(t, a - 3, 3), { bg: "#1A1D24", z: [1.3, 1.4], c0: [960, 560] }) },
  { c: "Ama aynı kalıptan", r: (t, a, b) => board(t, a, b, factory(t, a, "ruya", 60), { bg: "#140A28" }) },
  { c: "YouTube'un gözünde bir fabrika", r: (t, a, b) => board(t, a, b, <g opacity={0.35}>{factory(t, a - 5, "ruya", 60)}</g>, { bg: "#140A28" }), html: (t, a) => <Big t={t} at={a + 0.6} text="FABRİKA" y={440} size={150} c="#FF6B6B" />, sfx: "boom" },
  { c: "Ve sen bir fabrika", r: (t, a, b) => desk(t, a, b, S20, { night: false, arms: "head", mouth: "sad", brow: "worry", z: [1.4, 1.55], c0: [960, 430] }) },
  { c: "Otuz gün sonra", r: (t, a, b) => board(t, a, b, <g>{cal(t, a, "TEKRAR", "30", "gün sonra", 640, 520, 0.9)}{t > a + 1.6 && cal(t, a + 1.6, "2. RET", "90", "gün bekle", 1280, 520, 0.9)}</g>) },
  { c: "Hiçbir şeyi değiştirmeden", r: (t, a, b) => scr(t, a, b, yt("Kanal içeriği", vlist("ruya", ["Rüyada yılan görmek", "Rüyada altın görmek", "Rüyada diş düşmesi", "Rüyada su görmek"], [312, 845, 1204, 96]), "#5A3E9A"), { z: [1.3, 1.4] }), html: (t, a) => <Big t={t} at={a + 0.8} text="Değiştirmeden başvurmak = boşuna" y={70} size={54} /> },
  // ── 2. KANAL: DİZİ
  { c: "İkinci kanal", r: (t, a, b) => board(t, a, b, <ChannelCard x={960} y={500} kind="dizi" name="Dizi Özetleri" />, { z: [1.1, 1.3], bg: "#1B1010" }), html: (t, a) => <Big t={t} at={a + 0.3} text="2. kanal: dizi özetleri" y={60} size={60} c="#FFC531" /> },
  { c: "Herkesin konuştuğu", r: (t, a, b) => board(t, a, b, <g transform="translate(360,180) scale(3.7)"><Cover x={0} y={0} w={320} kind="dizi" /></g>, { bg: "#1B1010" }) },
  { c: "Bu bölümde kimse", r: (t, a, b) => board(t, a, b, <g transform="translate(360,180) scale(3.7)"><Cover x={0} y={0} w={320} kind="dizi" /></g>, { bg: "#1B1010", z: [1.3, 1.5], c0: [960, 760] }), html: (t, a) => <Big t={t} at={a + 0.1} text="“Bu bölümde kimse bunu beklemiyordu…”" y={60} size={50} c="#FFC531" /> },
  { c: "Sezon finali gecesi", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]}><Salon t={t} /><rect width={1920} height={1080} fill="#0A0F2A" opacity={0.45} /><Person x={760} y={1060} s={0.9} t={t} o={S20} arms="type" mouth="tight" look={0.8} /><Person x={420} y={1060} s={0.85} t={t} o={ANNE} arms="hold" mouth="o" eyes="wide" look={1} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.5} text="Sezon finali" y={60} size={64} />, tone: "night" },
  { c: "Sabah uyanıyorsun", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#0F0F0F" />{tx(180, 260, short(lp(1200, 300000, rp(t, a + 0.6, a + 2.2))), 70, "#FFF", 700, "middle")}{tx(180, 310, "izlenme", 24, "#AAA", 600, "middle")}<Cover x={20} y={380} w={320} kind="dizi" /></g>, { z: [1.1, 1.3] }), sfx: "ding" },
  { c: "Bir gecede", r: (t, a, b) => board(t, a, b, <g>{tx(960, 560, "300.000", 220, H.green, 700, "middle")}{tx(960, 680, "bir gecede", 60, "#AAA", 600, "middle")}</g>) },
  { c: "Telefonu yastığa", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[900, 600]}><rect width={1920} height={1080} fill="#3B5B8C" /><rect x={300} y={500} width={1400} height={600} rx={40} fill="#EDE6DA" /><Person x={900} y={1080} s={1.1} t={t} o={S20} arms="down" mouth="grin" eyes="open" lookY={-1} /><Phone x={1300} y={720} s={0.35} rot={70} light><rect width={360} height={740} fill="#0F0F0F" /></Phone></HCam>, html: (t, a) => <Big t={t} at={a + 1.4} text="Oldu. Bu iş oldu." y={70} size={66} c={H.green} />, tone: "gold" },
  { c: "Öğlene doğru", r: (t, a, b) => ph(t, a, b, <LockScreen time="12:04" date="Pazar"><Notif x={0} y={0} app="YouTube" title="Telif hakkı talebi" body="Videonuzda hak sahibine ait içerik var" icon={YT} k={rp(t, a + 0.4, a + 0.8)} /></LockScreen>, { z: [1.1, 1.25] }), sfx: "buzz", tone: "cool" },
  { c: "O sahneleri sen", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 30 }, (_, i) => <g key={i} transform={`translate(${200 + (i % 10) * 170},${300 + Math.floor(i / 10) * 200})`} opacity={rp(t, a + 0.6 + i * 0.03, a + 0.9 + i * 0.03)}><circle cx={0} cy={-40} r={26} fill="#C98E6A" /><rect x={-34} y={-14} width={68} height={70} rx={14} fill={["#2E3A55", "#5A1E1E", "#3B6E3A"][i % 3]} /></g>)}</g>), html: (t, a) => <Big t={t} at={a + 1.6} text="Yüzlerce kişi · aylarca emek" y={80} size={58} /> },
  { c: "O görüntülerin bir sahibi", r: (t, a, b) => board(t, a, b, claimFlow(t, a - 2)) },
  { c: "YouTube'un bir sistemi", r: (t, a, b) => board(t, a, b, <g><g transform="translate(560,240)"><Cover x={0} y={0} w={800} kind="dizi" /></g><rect x={560} y={lp(240, 690, (Math.sin((t - a) * 2) + 1) / 2)} width={800} height={8} fill={H.green} opacity={0.9} />{t > a + 1.6 && <g>{tx(960, 860, "EŞLEŞME BULUNDU", 54, "#FF6B6B", 700, "middle")}</g>}</g>) },
  { c: "videonun reklam parası", r: (t, a, b) => board(t, a, b, claimFlow(t, a)) },
  { c: "Üç yüz bin izlenme", r: (t, a, b) => board(t, a, b, <g>{tx(960, 420, "300.000 izlenme", 110, "#FFF", 700, "middle")}{t > a + 1.2 && tx(960, 640, "Senin payın: $0", 120, "#FF6B6B", 700, "middle")}</g>) },
  { c: "Bir hafta sonra", r: (t, a, b) => scr(t, a, b, strikeD(1, rp(t, a + 0.2, a + 0.7)), { z: [1.4, 1.55] }), sfx: "buzz", tone: "cool" },
  { c: "Yani video tamamen", r: (t, a, b) => scr(t, a, b, yt("Kanal içeriği", <g>{vlist("dizi", ["Final bölümü özeti", "Kimse beklemiyordu", "Sezonun en çarpıcı sahnesi"], [300000, 84000, 41000])}<rect x={0} y={-10} width={760} height={96} fill="#000" opacity={0.7 * rp(t, a + 0.6, a + 1)} />{t > a + 1 && tx(380, 46, "Video kaldırıldı", 26, "#FF6B6B", 700, "middle")}</g>, "#5A1E1E"), { z: [1.35, 1.5] }) },
  { c: "Dört gün sonra ikincisi", r: (t, a, b) => scr(t, a, b, strikeD(2, 1), { z: [1.5, 1.7] }), sfx: "buzz" },
  { c: "YouTube'un kuralı net", r: (t, a, b) => scr(t, a, b, strikeD(2, 1), { z: [2, 2.2], c0: [960, 720] }), html: (t, a) => <Big t={t} at={a + 0.4} text="90 gün · 3 ihtar = kanal silinir" y={70} size={58} c="#FF6B6B" /> },
  { c: "Ve sen o kuralın devamını", r: (t, a, b) => board(t, a, b, <g><rect x={460} y={300} width={1000} height={420} rx={20} fill="#FFF" />{tx(500, 400, "3 ihtar alan kanal silinir.", 44, "#111", 700)}<g style={{ filter: "blur(9px)" }}>{tx(500, 500, "Bağlantılı diğer kanallar da…", 44, "#111", 600)}</g><rect x={500} y={560} width={700} height={18} rx={9} fill="#DDD" /></g>), html: (t, a) => <Big t={t} at={a + 1.2} text="…devamını okumuyorsun" y={830} size={56} /> },
  { c: "Kanalı bırakıyorsun", r: (t, a, b) => desk(t, a, b, S20, { arms: "cross", mouth: "tight", z: [1.3, 1.4] }) },
  { c: "Sadece şifresini", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#FFF" />{tx(500, 200, "Şifre", 36, "#202124", 700, "middle")}<rect x={300} y={240} width={400} height={64} rx={8} fill="#FFF" stroke="#D93025" strokeWidth={3} />{tx(320, 282, "••••••", 30, "#999", 500)}{tx(500, 360, "Şifremi unuttum", 22, "#1A73E8", 600, "middle")}</g>, { z: [1.4, 1.5] }) },
  { c: "Bu kanalı unutma", r: (t, a, b) => board(t, a, b, <ChannelCard x={960} y={500} kind="dizi" name="Dizi Özetleri" state="warn" note="2 ihtar" />, { z: [1.4, 1.8], bg: "#120808" }), html: (t, a) => <Big t={t} at={a + 1} text="Sen unutacaksın…" y={860} size={60} />, tone: "cool" },
  { c: "Ama o seni unutmayacak", r: (t, a, b) => board(t, a, b, <ChannelCard x={960} y={500} kind="dizi" name="Dizi Özetleri" state="warn" note="2 ihtar" />, { z: [2, 2.3], bg: "#120808" }), html: (t, a) => <Big t={t} at={a + 0.2} text="…o seni unutmayacak." y={860} size={60} c="#FF6B6B" />, sfx: "drone" },
  // ── 3. KANAL: ÇOCUK
  { c: "Üçüncü kanal", r: (t, a, b) => board(t, a, b, <ChannelCard x={960} y={500} kind="cocuk" name="Çocuk Şarkıları" />, { z: [1.1, 1.3], bg: "#0E2A3A" }), html: (t, a) => <Big t={t} at={a + 0.3} text="3. kanal: çocuk şarkıları" y={60} size={60} c="#7FD3F5" /> },
  { c: "Yapay zekâyla renkli", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.1]}>{bigSix(t, a + 99)}</HCam> },
  { c: "Burada seni çok", r: (t, a, b) => sofa(t, a, b, { sen: false, z: [1.5, 1.6], c0: [760, 640] }) },
  { c: "çocuklar aynı videoyu", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 20 }, (_, i) => <g key={i} opacity={rp(t, a + i * 0.08, a + 0.2 + i * 0.08)}><path d={`M${380 + (i % 10) * 120},${380 + Math.floor(i / 10) * 200} a40,40 0 1,1 0,1`} fill="none" stroke="#7FD3F5" strokeWidth={10} /><path d={`M${420 + (i % 10) * 120},${370 + Math.floor(i / 10) * 200} l10,14 l-18,4Z`} fill="#7FD3F5" /></g>)}</g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Aynı video · 20 kere" y={820} size={64} /> },
  { c: "İzlenme uçuyor", r: (t, a, b) => scr(t, a, b, yt("Kanal analizi", <g>{kv(0, 0, "Görüntüleme", short(lp(10000, 2000000, rp(t, a, b))), H.green, 300)}<LineChart x={0} y={170} w={760} h={250} pts={[0.01, 0.04, 0.1, 0.18, 0.3, 0.46, 0.7, 1]} k={rp(t, a, b)} /></g>, "#7FD3F5"), { z: [1.35, 1.5] }) },
  { c: "Altı ayda iki milyon", r: (t, a, b) => board(t, a, b, <g>{tx(960, 560, "2.000.000", 220, H.green, 700, "middle")}{tx(960, 680, "izlenme · 6 ay", 60, "#AAA", 600, "middle")}</g>) },
  { c: "Bu kanal para kazanma", r: (t, a, b) => scr(t, a, b, <Mail from="YouTube" subject="Tebrikler! Kanalın kabul edildi" lines={["Para kazanma programına hoş geldin."]} k={rp(t, a, a + 0.6)} badge="KABUL" />, { z: [1.4, 1.55] }), sfx: "ding", tone: "gold" },
  { c: "İlk ayın kazancını", r: (t, a, b) => over(t, a, b, S20, yt("Gelir", <g>{kv(0, 0, "Bu ay", "$" + fmt(lp(0, 87, rp(t, a + 0.5, a + 2))), "#FFF", 320)}{kv(340, 0, "İzlenme", "2 Mn", H.green, 300)}</g>, "#7FD3F5"), { slump: 0.5 }) },
  { c: "İki milyon izlenme", r: (t, a, b) => board(t, a, b, <g>{tx(960, 420, "2.000.000 izlenme", 100, "#FFF", 700, "middle")}{t > a + 1.2 && tx(960, 640, "< $100", 170, "#FF6B6B", 700, "middle")}</g>), sfx: "boing" },
  { c: "Bunun iki sebebi", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Çocuklara\nözel", "İzleyici\nTürkiye'de"], H.red, 520, 640, 560)) },
  { c: "Bir: çocuklara özel", r: (t, a, b) => scr(t, a, b, yt("Video ayrıntıları", <g>{tx(0, 30, "Kitle", 26, "#FFF", 700)}<rect x={0} y={50} width={740} height={70} rx={10} fill="#2A2A2A" stroke="#3EA6FF" strokeWidth={2} />{tx(20, 95, "● Evet, çocuklar için yapıldı", 24, "#FFF", 500)}{["✕ Yorumlar kapalı", "✕ Kişiye özel reklam yok"].map((s, i) => <g key={i} opacity={rp(t, a + 0.8 + i * 0.6, a + 1.2 + i * 0.6)}>{tx(20, 180 + i * 60, s, 28, "#FF6B6B", 700)}</g>)}</g>, "#7FD3F5"), { z: [1.35, 1.5] }) },
  { c: "Reklam az", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Reklam\naz", "Reklam\nucuz"], H.red, 520, 640, 560)) },
  { c: "İki: izleyicilerin", r: (t, a, b) => board(t, a, b, <g><path d="M560,420 Q700,300 960,330 Q1240,300 1380,420 Q1300,560 960,540 Q640,560 560,420Z" fill="#E5322D" opacity={0.85} />{tx(960, 450, "Türkiye", 70, "#FFF", 700, "middle")}</g>) },
  { c: "Ve Türkiye'de aynı reklam", r: (t, a, b) => board(t, a, b, <AdBars x={300} y={330} k={rp(t, a + 0.3, a + 2.2)} />) },
  { c: "Aynı izlenme", r: (t, a, b) => board(t, a, b, <AdBars x={300} y={330} k={1} />, { z: [1.25, 1.35], c0: [960, 680] }), html: (t, a) => <Big t={t} at={a + 0.3} text="Aynı izlenme, kat kat az para" y={80} size={58} /> },
  { c: "Ama bu kanalı bırakmanın", r: (t, a, b) => board(t, a, b, <g opacity={0.4}><AdBars x={300} y={330} k={1} /></g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Ama sebep para değil…" y={460} size={76} c="#FFC531" /> },
  { c: "Bir akşam halanın", r: (t, a, b) => sofa(t, a, b, { sen: false, z: [1.1, 1.2] }), html: (t, a) => <Big t={t} at={a + 1.2} text="Ela · 4 yaş" y={70} size={56} /> },
  { c: "Ağzı açık", r: (t, a, b) => sofa(t, a, b, { sen: false, z: [2.1, 2.3], c0: [760, 600] }) },
  { c: "Yanına oturuyorsun", r: (t, a, b) => sofa(t, a, b, { z: [1.2, 1.3], mouthSen: "smile" }) },
  { c: "Ekranda senin yaptığın", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.05, 1.15]}>{bigSix(t, a + 99)}</HCam> },
  { c: "Ve ördeğin altı parmağı", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.9]} c0={[960, 540]} c1={[640, 580]}>{bigSix(t, a)}</HCam>, html: (t, a) => <Big t={t} at={a + 1.3} text="6 parmak" y={860} size={80} c="#FF6B6B" />, sfx: "drone", tone: "cool" },
  { c: "Daha önce hiç fark", r: (t, a, b) => sofa(t, a, b, { z: [1.8, 2], c0: [1180, 450], mouthSen: "o" }) },
  { c: "Ela ördeğin şarkısını", r: (t, a, b) => sofa(t, a, b, { z: [1.5, 1.6], c0: [800, 560] }), html: (t, a) => <Big t={t} at={a + 0.6} text="♪ la-ba-dum, pıtı-pıtı ♪" y={70} size={52} c="#7FD3F5" /> },
  { c: "Çünkü onları da sen", r: (t, a, b) => sofa(t, a, b, { z: [1.9, 2.1], c0: [1180, 430], mouthSen: "sad" }) },
  { c: "O gece o kanala", r: (t, a, b) => scr(t, a, b, yt("Kanal içeriği", <g><rect x={170} y={120} width={400} height={80} rx={40} fill="#3A3A3A" />{tx(370, 172, "Yükleme yok", 30, "#AAA", 700, "middle")}</g>, "#7FD3F5"), { z: [1.4, 1.5] }), tone: "night" },
  // ── 4. KANAL: KURS
  { c: "Dördüncü kanal", r: (t, a, b) => board(t, a, b, <g>{(["ruya", "dizi", "cocuk"] as CoverKind[]).map((kd, i) => <ChannelCard key={i} x={480 + i * 480} y={500} kind={kd} name={["Rüya", "Dizi", "Çocuk"][i]} state="dead" />)}</g>), html: (t, a) => <Big t={t} at={a + 0.3} text="3 kanal düştü" y={60} size={60} c="#FF6B6B" /> },
  { c: "Ve o reklamı tekrar", r: (t, a, b) => ph(t, a, b, igAd(t, a), { z: [1.05, 1.2] }) },
  { c: "Bu sefer bin beş yüz", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#FFF" />{tx(180, 120, "Ödeme", 30, "#111", 700, "middle")}<rect x={30} y={170} width={300} height={120} rx={16} fill="#F4F4F4" />{tx(180, 240, "1.500 TL", 44, "#111", 700, "middle")}<rect x={30} y={600} width={300} height={60} rx={30} fill={t > a + 1.2 ? H.green : "#111"} />{tx(180, 638, t > a + 1.2 ? "Ödendi ✓" : "Öde", 22, "#FFF", 700, "middle")}</g>, { light: true }), sfx: "pop" },
  { c: "Biriktirdiğin bütün", r: (t, a, b) => board(t, a, b, <g><g transform="translate(960,520)"><rect x={-180} y={-140} width={360} height={280} rx={30} fill="#E6B87A" /><rect x={-60} y={-160} width={120} height={20} fill="#333" />{tx(0, 30, "0 TL", 70, "#7A4E2E", 700, "middle")}</g></g>), html: (t, a) => <Big t={t} at={a + 0.4} text="Bütün harçlık" y={80} size={64} /> },
  { c: "Kurs sana hazır", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#111827" />{tx(40, 70, "MODÜL 1 · Hazır Sistem", 34, "#FFC531", 700)}{["İngilizce kanal", "Konu: zenginlerin lüks hayatı", "Hazır şablon + hazır ses", "Hazır anlatım kalıbı"].map((s, i) => <g key={i} opacity={rp(t, a + 0.4 + i * 0.6, a + 0.8 + i * 0.6)}><rect x={40} y={110 + i * 110} width={920} height={88} rx={12} fill="#1F2937" />{tx(70, 166 + i * 110, "▶ " + s, 30, "#FFF", 600)}</g>)}</g>, { z: [1.35, 1.5] }) },
  { c: "hazır şablon", r: (t, a, b) => board(t, a, b, factory(t, a, "luks", 30), { bg: "#0B1A2A" }), html: (t, a) => <Big t={t} at={a + 0.3} text="Hazır şablon · hazır ses" y={880} size={56} /> },
  { c: "Yabancı izleyici", r: (t, a, b) => board(t, a, b, <g transform="translate(360,180) scale(3.7)"><Cover x={0} y={0} w={320} kind="luks" /></g>, { bg: "#0E2A44" }), html: (t, a) => <Big t={t} at={a + 0.2} text="“Yabancı izleyici, dolarla reklam”" y={870} size={52} c="#FFC531" /> },
  { c: "Kulağa mantıklı", r: (t, a, b) => desk(t, a, b, S20, { mouth: "smile", arms: "type", z: [1.35, 1.5] }) },
  { c: "Otuz video yüklüyorsun", r: (t, a, b) => scr(t, a, b, yt("Kanal içeriği", <g>{Array.from({ length: 30 }, (_, i) => <g key={i} opacity={cl(rp(t, a, b - 0.4) * 30 - i)} transform={`translate(${(i % 6) * 128},${Math.floor(i / 6) * 84})`}><Cover x={0} y={0} w={120} kind="luks" /></g>)}</g>, "#0E2A44"), { z: [1.3, 1.45] }) },
  { c: "Bir ay sonra toplam", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Counter t={t} a={a} from={0} to={211} dur={1.4} label="toplam izlenme · 1 ay" y={340} />, sfx: "boing" },
  { c: "Bir gece YouTube'da", r: (t, a, b) => over(t, a, b, S20, <g><rect width={1000} height={625} fill="#0F0F0F" /><rect x={200} y={20} width={600} height={44} rx={22} fill="#121212" stroke="#333" />{tx(220, 50, "billionaire life secrets", 20, "#DDD", 500)}</g>) },
  { c: "Ve donup kalıyorsun", r: (t, a, b) => desk(t, a, b, S20, { mouth: "o", eyes: "wide", arms: "type", z: [1.6, 1.75], c0: [960, 420] }), sfx: "drone" },
  { c: "Aynı başlık", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 40 }, (_, i) => { const k = rp(t, a + i * 0.05, a + 0.3 + i * 0.05); return <g key={i} opacity={k} transform={`translate(${110 + (i % 8) * 215},${120 + Math.floor(i / 8) * 175})`}><Cover x={0} y={0} w={200} kind="luks" /></g>; })}</g>, { bg: "#0B1A2A" }) },
  { c: "Kırk ayrı kanalda", r: (t, a, b) => board(t, a, b, <g opacity={0.35}>{Array.from({ length: 40 }, (_, i) => <g key={i} transform={`translate(${110 + (i % 8) * 215},${120 + Math.floor(i / 8) * 175})`}><Cover x={0} y={0} w={200} kind="luks" /></g>)}</g>, { bg: "#0B1A2A" }), html: (t, a) => <Big t={t} at={a + 0.2} text="40 kanal · aynı video" y={440} size={100} c="#FFC531" /> },
  { c: "Kursun Telegram grubuna", r: (t, a, b) => ph(t, a, b, <ChatGroup t={t} members={Math.round(lp(400, 3200, rp(t, a + 0.3, a + 1.8)))} msgs={["Kanalım 3 aydır 0 izlenme 😢", "Bende de aynısı", "Para kazanma reddedildi…", "Hocam cevap verir misiniz?", "Ben de lüks hayat açtım", "Biri işe yaradı mı?"]} k={rp(t, a + 0.6, b)} />, { z: [1.05, 1.15] }) },
  { c: "Hepsi aynı sistemi", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 120 }, (_, i) => <g key={i} transform={`translate(${160 + (i % 20) * 82},${200 + Math.floor(i / 20) * 110})`} opacity={rp(t, a + i * 0.01, a + 0.2 + i * 0.01)}><circle cx={0} cy={0} r={14} fill="#AAA" /><path d="M-20,46 Q-20,20 0,20 Q20,20 20,46Z" fill="#AAA" /><rect x={-12} y={-42} width={24} height={14} rx={3} fill="#0E2A44" /></g>)}</g>), html: (t, a) => <Big t={t} at={a + 0.8} text="3.200 kişi · aynı izleyiciyi bekliyor" y={60} size={52} /> },
  // ── DERS + BIRAKIŞ
  { c: "O gece bir şeyi", r: (t, a, b) => desk(t, a, b, S20, { arms: "chin", mouth: "flat", brow: "worry", z: [1.4, 1.55], c0: [960, 430], night: true }) },
  { c: "herkesin bir tıkla", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.4} text="Herkesin bir tıkla yaptığını kimse izlemez" y={420} size={68} c="#FFC531" /> },
  { c: "Aradan bir yıl", r: (t, a, b) => board(t, a, b, <g>{cal(t, a, "1 YIL", "365", "gün sonra")}</g>), html: (t, a) => <AgeTag t={t} at={a + 1} age="21 yaş" place="Sivas" /> },
  { c: "Dört kanalın var", r: (t, a, b) => board(t, a, b, <g>{(["ruya", "dizi", "cocuk", "luks"] as CoverKind[]).map((kd, i) => <ChannelCard key={i} x={360 + i * 400} y={500} kind={kd} name={["Rüya", "Dizi", "Çocuk", "Lüks"][i]} state="dead" note="$0" />)}</g>) },
  { c: "Laptop masanın köşesinde", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[1200, 640]}><TeenRoom t={t} night={false} poster="X" lamp={0} /><g transform="translate(1200,700)"><rect x={-260} y={-20} width={520} height={30} rx={8} fill="#55585F" /><path d="M-240,-20 L-220,-60 L220,-60 L240,-20Z" fill="#4A4D54" />{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={-220 + (i * 37) % 440} cy={-54 + (i % 4) * 9} r={2} fill="#DDD" opacity={0.6} />)}</g></HCam>, tone: "cool" },
  { c: "Bırakıyorsun", r: (t, a, b) => board(t, a, b, <g />, { bg: "#0B0D12" }), html: (t, a) => <Big t={t} at={a + 0.2} text="Bırakıyorsun." y={460} size={90} /> },
  // ── KURAKLIK / DEDE
  { c: "Temmuz", r: (t, a, b) => board(t, a, b, <g><circle cx={960} cy={460} r={lp(140, 220, rp(t, a, b))} fill="#FFB547" />{Array.from({ length: 12 }, (_, i) => { const an = (i / 12) * Math.PI * 2 + t * 0.3; return <line key={i} x1={960 + Math.cos(an) * 260} y1={460 + Math.sin(an) * 260} x2={960 + Math.cos(an) * 340} y2={460 + Math.sin(an) * 340} stroke="#FFB547" strokeWidth={16} strokeLinecap="round" />; })}</g>, { bg: "#3A2414" }), html: (t, a) => <Big t={t} at={a + 0.3} text="Temmuz · kuraklık" y={860} size={64} />, tone: "gold" },
  { c: "Bir akşam dedenlerdesin", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.1]}><DedeSalon t={t} tv={<Baraj t={t} level={0.3} />} /><Person x={520} y={1060} s={0.85} t={t} o={DEDE} arms="down" mouth="flat" look={1} /><Person x={880} y={1080} s={0.82} t={t} o={S21} arms="phone" mouth="flat" lookY={0.7} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.5} text="Dedenin evi" y={60} size={56} /> },
  { c: "Deden televizyonun", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[560, 520]}><DedeSalon t={t} tv={<Baraj t={t} level={0.3} />} /><Person x={520} y={lp(1060, 1010, rp(t, a + 0.6, a + 1.1))} s={0.85} t={t} o={DEDE} arms="down" mouth="o" eyes="wide" look={1} /></HCam> },
  { c: "Ekranda bir baraj", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.15]}><Baraj t={t} level={lp(0.3, 0.8, rp(t, a, b))} /><rect x={0} y={960} width={1920} height={120} fill="#C8102E" />{tx(40, 1035, "SON DAKİKA · Baraj suları çekildi, eski köy ortaya çıktı", 42, "#FFF", 700)}</HCam> },
  { c: "Ve çamurun ortasında", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 2.1]} c0={[1200, 420]}><Baraj t={t} level={0.85} /></HCam>, sfx: "drone" },
  { c: "Bizim köy", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.9, 2]} c0={[520, 600]}><DedeSalon t={t} tv={<Baraj t={t} level={0.85} />} /><Person x={520} y={1010} s={0.85} t={t} o={DEDE} arms="down" mouth="open" talk brow="up" look={1} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.2} text="“Bizim köy…”" y={830} size={66} /> },
  { c: "Bizim caminin minaresi", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.2, 2.6]} c0={[1200, 360]}><Baraj t={t} level={0.85} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.2} text="“Bizim caminin minaresi.”" y={860} size={60} /> },
  { c: "Bunu ilk kez duyuyorsun", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.7, 1.8]} c0={[880, 520]}><DedeSalon t={t} tv={<Baraj t={t} level={0.85} />} /><Person x={880} y={1080} s={0.82} t={t} o={S21} arms="down" mouth="o" eyes="wide" look={-0.8} /></HCam> },
  { c: "Dedenin doğduğu köy", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.1]}><Baraj t={t} level={lp(0.85, 0.05, rp(t, a + 0.4, b))} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.8} text="Barajın suları altında" y={70} size={60} /> },
  { c: "Köy boşaltılmış", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 14 }, (_, i) => { const k = rp(t, a + 0.3, a + 2); const an = (i / 14) * Math.PI * 2; return <g key={i} transform={`translate(${960 + Math.cos(an) * 380 * k},${520 + Math.sin(an) * 260 * k})`}><circle r={18} fill="#E9C46A" /><path d="M-24,56 Q-24,24 0,24 Q24,24 24,56Z" fill="#E9C46A" /></g>; })}<g transform="translate(960,520)"><rect x={-60} y={-40} width={120} height={80} fill="#8E9AA2" /><path d="M-70,-40 L0,-90 L70,-40Z" fill="#6A7680" /></g></g>), html: (t, a) => <Big t={t} at={a + 1.2} text="Herkes şehirlere dağılmış" y={860} size={56} /> },
  { c: "Su dolu olduğu yıllarda", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.4]} c0={[1200, 380]}><Baraj t={t} level={0.05} /></HCam>, html: (t, a) => <Big t={t} at={a + 1} text="Sadece minarenin tepesi" y={860} size={56} /> },
  { c: "Şimdi kuraklıkla", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.08]}><Baraj t={t} level={lp(0.05, 0.9, rp(t, a + 0.2, b))} /></HCam> },
  { c: "Ertesi sabah dedeni", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.1]}><Baraj t={t} level={0.9} px={-(t - a) * 20} /><g transform={`translate(${lp(-300, 700, rp(t, a, b))},880)`}><rect x={-150} y={-70} width={300} height={70} rx={20} fill="#C8C2B4" /><path d="M-100,-70 L-60,-120 L80,-120 L120,-70Z" fill="#B3AC9C" /><circle cx={-90} cy={0} r={28} fill="#222" /><circle cx={90} cy={0} r={28} fill="#222" /></g></HCam> },
  { c: "Deden çamurun içinde", r: (t, a, b) => lake(t, a, b, { level: 0.9, dede: { x: lp(500, 700, rp(t, a, b)) }, z: [1.15, 1.25], c0: [700, 640] }) },
  { c: "Bir duvarın önünde", r: (t, a, b) => lake(t, a, b, { level: 0.9, dede: { x: 760, arms: "wave", talk: true, mouth: "smile" }, z: [1.5, 1.6], c0: [760, 560] }), html: (t, a) => <Big t={t} at={a + 1} text="“Burası okulumdu.”" y={80} size={64} /> },
  { c: "Biraz ileride bir taş", r: (t, a, b) => lake(t, a, b, { level: 0.9, dede: { x: 660, arms: "down", talk: true }, z: [1.9, 2], c0: [580, 680] }), html: (t, a) => <Big t={t} at={a + 1} text="“Annem burada çamaşır yıkardı.”" y={80} size={56} /> },
  { c: "Telefonla çekiyorsun", r: (t, a, b) => lake(t, a, b, { level: 0.9, dede: { x: 640, talk: true }, sen: { x: 1100 }, z: [1.2, 1.3], c0: [860, 640] }) },
  { c: "Ellerin titriyor", r: (t, a, b) => { const sh = Math.sin(t * 40) * 4; return ph(t, a, b, <g transform={`translate(${sh},0)`}><rect width={360} height={740} fill="#000" /><svg width={360} height={740} viewBox="420 100 1000 1000" preserveAspectRatio="xMidYMid slice"><Baraj t={t} level={0.9} /></svg><circle cx={180} cy={680} r={30} fill="#E5322D" /><rect x={20} y={20} width={90} height={30} rx={6} fill="#E5322D" />{tx(65, 42, "● KAYIT", 14, "#FFF", 700, "middle")}</g>, { z: [1.05, 1.15] }); } },
  // ── KENDİ KANALI
  { c: "O akşam ilk kez", r: (t, a, b) => desk(t, a, b, S21, { night: true, arms: "type", mouth: "smile", z: [1.25, 1.35] }), tone: "warm" },
  { c: "Metni sen yazıyorsun", r: (t, a, b) => over(t, a, b, S21, <g><rect width={1000} height={625} fill="#FFF" />{tx(40, 60, "Sular Altındaki Köy · metin", 28, "#111", 700)}{["Dedem bu köyde doğdu.", "Okulu şu duvarın arkasındaydı.", "Annesi çeşmede çamaşır yıkardı…"].map((s, i) => <g key={i}>{tx(40, 140 + i * 60, s.slice(0, Math.floor(cl(rp(t, a + i * 0.8, a + 0.8 + i * 0.8)) * s.length)), 28, "#333", 500)}</g>)}</g>) },
  { c: "Sesi sen veriyorsun", r: (t, a, b) => desk(t, a, b, S21, { night: true, arms: "desk", mouth: "open", talk: true, z: [1.5, 1.65], c0: [960, 420], extra: <g transform="translate(1180,760) scale(1.4)"><rect x={-14} y={-60} width={28} height={70} rx={14} fill="#333" /><rect x={-3} y={10} width={6} height={40} fill="#333" /></g> }), html: (t, a) => <Big t={t} at={a + 1.2} text="Kendi sesin · Sivas şivesi" y={830} size={56} c="#FFC531" /> },
  { c: "Yapay zekâ sadece", r: (t, a, b) => board(t, a, b, <g><g transform="translate(300,240)"><rect width={560} height={420} fill="#EFE7DA" /><svg x={20} y={20} width={520} height={380} viewBox="300 300 1300 950" preserveAspectRatio="xMidYMid slice"><g style={{ filter: "grayscale(1)" }}><Baraj t={0} level={1} /></g></svg></g><AiLabel x={340} y={720} ai={false} />{tx(960, 470, "→", 120, "#FFF", 700, "middle")}<g transform="translate(1060,240)" opacity={rp(t, a + 0.8, a + 1.6)}><rect width={560} height={420} fill="#7E5BD6" /><svg x={10} y={10} width={540} height={400} viewBox="300 300 1300 950" preserveAspectRatio="xMidYMid slice"><Baraj t={t} level={1} /></svg></g><AiLabel x={1080} y={720} ai k={rp(t, a + 1.2, a + 1.6)} /></g>) },
  { c: "köyün su basmadan", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.05, 1.15]}><Baraj t={t} level={1} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.3} text="Su basmadan önce · AI çizimi" y={70} size={56} /> },
  { c: "Videoyu yüklerken", r: (t, a, b) => scr(t, a, b, yt("Video ayrıntıları", <g>{tx(0, 30, "Değiştirilmiş veya yapay içerik", 26, "#FFF", 700)}{tx(0, 70, "Gerçekçi görünen yapay zekâ görüntüleri içeriyor mu?", 20, "#AAA", 500)}<rect x={0} y={100} width={360} height={64} rx={10} fill="#2A2A2A" stroke={t > a + 1.6 ? "#3EA6FF" : "#444"} strokeWidth={3} />{tx(30, 142, (t > a + 1.6 ? "◉" : "○") + "  Evet", 26, "#FFF", 600)}<rect x={380} y={100} width={360} height={64} rx={10} fill="#2A2A2A" stroke="#444" strokeWidth={2} />{tx(410, 142, "○  Hayır", 26, "#AAA", 600)}</g>, "#9C8664"), { z: [1.4, 1.55] }), sfx: "pop" },
  { c: "Evet kutusunu", r: (t, a, b) => SHOTS.find((x) => x.c === "Videoyu yüklerken")!.r(t, a - 10, b), sfx: "pop" },
  { c: "Videonun içinde de", r: (t, a, b) => board(t, a, b, <g><g transform="translate(360,180) scale(3.7)"><Cover x={0} y={0} w={320} kind="koy" /></g><AiLabel x={420} y={860} ai /></g>) },
  { c: "Üç gün", r: (t, a, b) => scr(t, a, b, yt("Kanal analizi", <g>{kv(0, 0, "Görüntüleme", "38", "#FFF")}{kv(260, 0, "3 gün", "≈ 0", "#FF6B6B")}</g>, "#9C8664"), { z: [1.35, 1.5] }) },
  { c: "Deden videoyu köylülerin", r: (t, a, b) => ph(t, a, b, <GroupPost t={t} k={rp(t, a + 0.4, a + 1)} shares={0} />, { light: true, bg: "salon" }) },
  { c: "Gruptaki herkes", r: (t, a, b) => ph(t, a, b, <GroupPost t={t} shares={rp(t, a, b)} />, { light: true, z: [1.4, 1.6], c0: [960, 900] }) },
  { c: "Almanya'daki köylüler", r: (t, a, b) => board(t, a, b, <g>{[["Almanya", 400, 330], ["İstanbul", 1100, 470], ["Sivas", 1350, 520], ["Hollanda", 330, 260]].map(([n, x, y], i) => <g key={i} opacity={rp(t, a + i * 0.3, a + 0.4 + i * 0.3)}><circle cx={Number(x)} cy={Number(y)} r={20} fill={H.red} /><line x1={Number(x)} y1={Number(y)} x2={1350} y2={520} stroke={H.red} strokeWidth={3} strokeDasharray="8 8" />{tx(Number(x), Number(y) - 36, String(n), 36, "#FFF", 700, "middle")}</g>)}</g>) },
  { c: "Bir haftada kırk bin", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Counter t={t} a={a} from={38} to={40000} dur={1.4} label="izlenme · 1 hafta" y={330} c={H.green} />, sfx: "ding" },
  { c: "Sonra YouTube videoyu", r: (t, a, b) => scr(t, a, b, yt("Kanal analizi", <g><LineChart x={0} y={40} w={760} h={340} pts={[0.0, 0.01, 0.02, 0.04, 0.1, 0.25, 0.5, 0.75, 1]} k={rp(t, a, b)} c={H.green} /></g>, "#9C8664"), { z: [1.3, 1.45] }) },
  { c: "Bir ayda bir milyon", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Counter t={t} a={a} from={40000} to={1200000} dur={1.6} label="izlenme · 1 ay" y={330} c={H.green} />, tone: "gold" },
  { c: "Ve yorumlar", r: (t, a, b) => over(t, a, b, S21, <g><rect width={1000} height={625} fill="#0F0F0F" />{tx(30, 50, "Yorumlar · 3.418", 26, "#FFF", 700)}</g>) },
  { c: "Daha önce hiçbir", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#0F0F0F" />{tx(30, 50, `Yorumlar · ${fmt(lp(0, 3418, rp(t, a, b)))}`, 26, "#FFF", 700)}</g>, { z: [1.35, 1.5] }) },
  { c: "Benim köyüm de", r: (t, a, b) => board(t, a, b, <g transform="translate(260,180)">{[["@ayse_tokat", "Benim köyüm de baraj altında kaldı."], ["@mehmet58", "Babam bu okulda okudu."], ["@zeynep.k", "Bizim köyü de anlatır mısın?"], ["@huseyin_de", "Annem izlerken ağladı. Sağ ol."]].map(([n, s], i) => <Comment key={i} x={0} y={i * 170} name={n} text={s} w={1400} k={rp(t, a + i * 0.9, a + 0.4 + i * 0.9)} likes={[812, 540, 1200, 97][i]} c={["#7E5BD6", "#2E86C1", "#C2410C", "#1B8A4B"][i]} />)}</g>) },
  { c: "İnsanlar sana eski", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]}><TeenRoom t={t} night={false} poster="X" lamp={0} />{Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${500 + i * 230},${lp(-200, 760 - (i % 2) * 120, rp(t, a + i * 0.3, a + 0.6 + i * 0.3))})`}><Box x={0} y={0} s={0.5} /></g>)}</HCam>, html: (t, a) => <Big t={t} at={a + 1.4} text="Kutu kutu fotoğraf" y={70} size={60} /> },
  { c: "Türkiye'de sular altında", r: (t, a, b) => board(t, a, b, <g>{["Sular altında", "Boşaltılmış", "Unutulmuş"].map((s, i) => <g key={i} opacity={rp(t, a + i * 0.5, a + 0.4 + i * 0.5)} transform={`translate(${200 + i * 540},300)`}><Cover x={0} y={0} w={480} kind="koy" />{tx(240, 330, s, 40, "#FFF", 700, "middle")}</g>)}</g>) },
  { c: "Her video için bir köye", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]}><KoyEvi t={t} night={false} /><Person x={640} y={1060} s={0.85} t={t} o={DEDE} arms="hold" mouth="smile" talk look={0.6} /><Person x={1200} y={1060} s={0.85} t={t} o={S21} dir={-1} arms="phone" mouth="smile" look={-0.5} /><TeaGlass x={920} y={860} s={1.2} t={t} /></HCam> },
  { c: "Bir videoyu bir haftada", r: (t, a, b) => board(t, a, b, <g>{cal(t, a, "1 VİDEO", "7", "gün", 640, 520, 0.9)}<g opacity={0.5}>{cal(t, a + 0.6, "ESKİDEN", "3", "günde", 1280, 520, 0.9)}</g><line x1={1080} y1={300} x2={1480} y2={740} stroke="#E5322D" strokeWidth={14} opacity={rp(t, a + 1.2, a + 1.5)} /></g>) },
  { c: "Para kazanma başvurusu", r: (t, a, b) => scr(t, a, b, <Mail from="YouTube" subject="Tebrikler! Kanalın kabul edildi" lines={["Para kazanma programına hoş geldin.", "", "İnceleme süresi: 14 gün"]} k={rp(t, a, a + 0.6)} badge="KABUL" />, { z: [1.4, 1.55] }), sfx: "ding", tone: "gold" },
  { c: "Yirmi iki yaşındasın", r: (t, a, b) => desk(t, a, b, S22, { night: false, arms: "type", mouth: "smile", z: [1.1, 1.2] }), html: (t, a) => <AgeTag t={t} at={a + 0.2} age="22 yaş" place="180.000 abone" /> },
  { c: "Bir de yeni bir şey", r: (t, a, b) => scr(t, a, b, yt("Diller", <g>{[["Türkçe", "Orijinal"], ["English", "Sesli dublaj eklendi"]].map(([l, s], i) => <g key={i} opacity={i === 0 ? 1 : rp(t, a + 1.2, a + 1.6)}><rect x={0} y={i * 100} width={740} height={84} rx={10} fill="#222" />{tx(30, 52 + i * 100, l, 30, "#FFF", 700)}{tx(710, 52 + i * 100, s, 22, i ? H.green : "#AAA", 600, "end")}</g>)}</g>, "#9C8664"), { z: [1.35, 1.5] }) },
  { c: "Videolarına İngilizce", r: (t, a, b) => board(t, a, b, <g><g transform="translate(560,240)"><Cover x={0} y={0} w={800} kind="koy" /></g><g transform="translate(1220,700)"><rect x={-130} y={-40} width={260} height={80} rx={40} fill="#3EA6FF" />{tx(0, 14, "🔊 EN", 36, "#FFF", 700, "middle")}</g></g>) },
  { c: "Yurt dışındaki Türkler", r: (t, a, b) => board(t, a, b, <People100Grid t={t} a={a} />) },
  { c: "Ve yabancı izleyiciden", r: (t, a, b) => board(t, a, b, <AdBars x={300} y={330} k={rp(t, a + 0.3, a + 2.2)} />) },
  { c: "Gelir ilk kez", r: (t, a, b) => scr(t, a, b, yt("Gelir", <g>{kv(0, 0, "Bu ay", "$" + fmt(lp(90, 1200, rp(t, a + 0.4, a + 2))), H.green, 320)}<LineChart x={0} y={170} w={760} h={250} pts={[0.05, 0.08, 0.12, 0.2, 0.35, 0.6, 1]} k={rp(t, a, b)} c={H.green} /></g>, "#9C8664"), { z: [1.35, 1.5] }), html: (t, a) => <Big t={t} at={a + 1.8} text="$1.200 / ay" y={830} size={80} c={H.green} />, tone: "gold" },
  // ── ZİRVE: UNUTULAN KANAL
  { c: "Ve tam her şey", r: (t, a, b) => desk(t, a, b, S22, { night: true, arms: "type", mouth: "smile", z: [1.25, 1.35] }), tone: "night" },
  { c: "yıllardır açmadığın", r: (t, a, b) => over(t, a, b, S22, <g><rect width={1000} height={625} fill="#FFF" />{tx(500, 220, "dizi.ozet.tr@gmail.com", 34, "#202124", 700, "middle")}<rect x={350} y={280} width={300} height={60} rx={30} fill="#1A73E8" />{tx(500, 318, "Giriş yap", 22, "#FFF", 700, "middle")}</g>) },
  { c: "Dizi kanalının hesabına", r: (t, a, b) => board(t, a, b, <ChannelCard x={960} y={500} kind="dizi" name="Dizi Özetleri" state="warn" note="unutulmuş" />, { z: [1.2, 1.4], bg: "#120808" }), sfx: "drone", tone: "cool" },
  { c: "Gelen kutusunda okunmamış", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#F6F8FC" /><rect width={1000} height={60} fill="#FFF" />{tx(30, 40, "Posta", 24, "#C5221F", 700)}{[["YouTube", "Telif ihtarı · 2. ihtar", "11 gün önce"], ["YouTube", "Telif ihtarı · 1. ihtar", "52 gün önce"], ["Google", "Güvenlik uyarısı", "3 ay önce"]].map(([f, s, d], i) => <g key={i} opacity={rp(t, a + i * 0.4, a + 0.4 + i * 0.4)}><rect x={30} y={90 + i * 100} width={940} height={86} rx={8} fill={i < 2 ? "#FCE8E6" : "#FFF"} />{tx(60, 142 + i * 100, f, 24, "#111", 700)}{tx(260, 142 + i * 100, s, 24, i < 2 ? "#C5221F" : "#333", 700)}{tx(940, 142 + i * 100, d, 18, "#777", 500, "end")}</g>)}</g>, { z: [1.35, 1.5] }), sfx: "buzz" },
  { c: "İkisi de son üç ay", r: (t, a, b) => board(t, a, b, <g><rect x={360} y={480} width={1200} height={40} rx={20} fill="#333" /><rect x={360} y={480} width={1200 * 0.62} height={40} rx={20} fill="#E5322D" />{[0.05, 0.5].map((p, i) => <g key={i}><circle cx={360 + 1200 * p} cy={500} r={34} fill="#E5322D" />{tx(360 + 1200 * p, 512, String(i + 1), 34, "#FFF", 700, "middle")}</g>)}{tx(360, 440, "90 gün", 40, "#FFF", 700)}{tx(1560, 440, "bugün", 40, "#AAA", 600, "end")}</g>), html: (t, a) => <Big t={t} at={a + 0.6} text="2 ihtar · hâlâ aktif" y={720} size={70} c="#FF6B6B" /> },
  { c: "Senin unuttuğun o kanalda", r: (t, a, b) => scr(t, a, b, yt("Kanal içeriği", vlist("dizi", ["Final bölümü özeti (kaldırıldı)", "Sezonun en çarpıcı sahnesi", "Kimse beklemiyordu 2", "Yeni bölüm özeti"], [0, 41000, 18200, 9400]), "#5A1E1E"), { z: [1.3, 1.45] }), html: (t, a) => <Big t={t} at={a + 1} text="40 video hâlâ yayında" y={830} size={60} c="#FF6B6B" /> },
  { c: "Hak sahipleri eski", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 24 }, (_, i) => <g key={i} transform={`translate(${200 + (i % 8) * 200},${220 + Math.floor(i / 8) * 200})`}><Cover x={0} y={0} w={180} kind="dizi" /></g>)}<rect x={180} y={lp(200, 820, ((t - a) * 0.5) % 1)} width={1600} height={8} fill={H.green} opacity={0.8} /></g>, { bg: "#120808" }) },
  { c: "Kalbin hızlanıyor", r: (t, a, b) => desk(t, a, b, S22, { night: true, arms: "type", mouth: "tight", eyes: "wide", brow: "worry", z: [1.7, 1.85], c0: [960, 420], shake: 0.4 }), sfx: "tick" },
  { c: "üç ihtar alan kanal silinir", r: (t, a, b) => board(t, a, b, <g><rect x={460} y={300} width={1000} height={420} rx={20} fill="#FFF" />{tx(500, 400, "3 ihtar alan kanal silinir.", 44, "#111", 700)}<g style={{ filter: `blur(${lp(9, 0, rp(t, a + 1, a + 1.8))}px)` }}>{tx(500, 500, "Bağlantılı diğer kanallar da", 44, "#C5221F", 700)}{tx(500, 560, "silinebilir.", 44, "#C5221F", 700)}</g></g>) },
  { c: "Beş kanalı da aynı", r: (t, a, b) => board(t, a, b, <LinkMap t={t} a={a} kinds={["ruya", "dizi", "cocuk", "luks", "koy"]} names={["Rüya", "Dizi", "Çocuk", "Lüks", "Köy"]} />) },
  { c: "Yani o kırk videodan", r: (t, a, b) => board(t, a, b, <LinkMap t={t} a={a - 3} danger={rp(t, a + 0.5, a + 2.5)} kinds={["ruya", "dizi", "cocuk", "luks", "koy"]} names={["Rüya", "Dizi", "Çocuk", "Lüks", "Köy"]} />, { bg: "#140808" }), sfx: "drone", tone: "cool" },
  { c: "dedenin köyünü anlatan", r: (t, a, b) => board(t, a, b, <ChannelCard x={960} y={500} kind="koy" name="Sular Altındaki Köy" state="warn" note="tehlikede" />, { z: [1.3, 1.6], bg: "#140808" }) },
  { c: "Hemen hepsini silmek", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#FFF" />{tx(500, 160, "2 adımlı doğrulama", 36, "#202124", 700, "middle")}{tx(500, 230, "Kodu şu numaraya gönderdik:", 24, "#5F6368", 500, "middle")}{tx(500, 290, "+90 5•• ••• •• 17", 34, "#202124", 700, "middle")}{tx(500, 360, "(eski telefon)", 24, "#C5221F", 700, "middle")}</g>, { z: [1.4, 1.55] }), sfx: "buzz" },
  { c: "Eski telefon ise", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[1600, 600]}><KoyEvi t={t} night drawer={0} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.8} text="Dedenin köydeki evinde · çekmecede" y={70} size={54} /> },
  { c: "Köy şehirden iki saat", r: (t, a, b) => board(t, a, b, <g><circle cx={460} cy={520} r={26} fill={H.blue} />{tx(460, 470, "Şehir", 40, "#FFF", 700, "middle")}<circle cx={1460} cy={520} r={26} fill={H.red} />{tx(1460, 470, "Köy", 40, "#FFF", 700, "middle")}<path d="M460,520 Q760,700 960,520 T1460,520" stroke="#FFF" strokeWidth={6} strokeDasharray="16 14" fill="none" />{tx(960, 760, "2 saat", 60, "#FFC531", 700, "middle")}</g>) },
  { c: "Saat gece biri", r: (t, a, b) => board(t, a, b, <Clock x={960} y={500} s={1.5} h={1} m={0} />, { bg: "#0A0C14" }), sfx: "tick", tone: "night" },
  { c: "Babanın arabasının", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 520]}><rect width={1920} height={1080} fill="#2A2420" /><g transform={`translate(960,${lp(300, 520, rp(t, a + 0.2, a + 1))})`}><rect x={-30} y={-90} width={60} height={60} rx={14} fill="#333" /><rect x={-14} y={-30} width={28} height={140} rx={6} fill="#C9C9C9" /><circle cy={-60} r={14} fill="#2A2420" /></g><path d="M600,1080 Q760,700 960,620" stroke={H.skin} strokeWidth={110} strokeLinecap="round" fill="none" /></HCam>, sfx: "knock" },
  { c: "Karanlık bir yol", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><NightRoad t={t} time="01:47" /></HCam>, tone: "night" },
  { c: "Köye vardığında saat üç", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[1440, 900]}><NightRoad t={t * 0.2} time="03:02" /></HCam> },
  { c: "Çekmeceyi açıyorsun", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.8, 2]} c0={[1600, 640]}><KoyEvi t={t} night drawer={rp(t, a + 0.2, a + 0.9)} />{t > a + 0.9 && <g transform="translate(1640,640) rotate(-8)"><rect x={-40} y={-20} width={80} height={140} rx={12} fill="#1A1C20" transform="rotate(90)" /></g>}</HCam>, sfx: "pop" },
  { c: "Şarjı bitmiş", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#000" /><g transform="translate(180,370)"><rect x={-60} y={-30} width={110} height={60} rx={8} fill="none" stroke="#E5322D" strokeWidth={6} /><rect x={50} y={-12} width={10} height={24} fill="#E5322D" /><rect x={-50} y={-20} width={10} height={40} fill="#E5322D" opacity={Math.sin(t * 6) > 0 ? 1 : 0.2} /></g></g>) },
  { c: "Şarja takıp bekliyorsun", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[1300, 600]}><KoyEvi t={t} night drawer={1} /><Person x={1250} y={1080} s={0.9} t={t} o={S22} arms="phone" mouth="tight" brow="worry" lookY={0.8} /></HCam> },
  { c: "Telefon açılıyor", r: (t, a, b) => ph(t, a, b, <LockScreen time="03:09" date="Perşembe"><g transform="translate(130,-170)"><Signal x={0} y={0} n={0} s={0.8} /></g></LockScreen>, { z: [1.1, 1.25] }) },
  { c: "Tek çizgi bile yok", r: (t, a, b) => board(t, a, b, <Signal x={860} y={600} n={0} s={2.4} />, { bg: "#0A0C14" }), html: (t, a) => <Big t={t} at={a + 0.2} text="Şebeke yok" y={820} size={70} c="#FF6B6B" /> },
  { c: "Köyde tek bir yerde", r: (t, a, b) => lake(t, a, b, { level: 0.85, night: true, z: [1, 1.1] }), html: (t, a) => <Big t={t} at={a + 0.8} text="Göle bakan tepe" y={70} size={60} />, tone: "night" },
  { c: "Karanlıkta tepeye", r: (t, a, b) => lake(t, a, b, { level: 0.85, night: true, sen: { x: lp(300, 820, rp(t, a, b)), arms: "phone" }, z: [1.3, 1.4], c0: [700, 700] }) },
  { c: "Bir çizgi", r: (t, a, b) => board(t, a, b, <Signal x={860} y={600} n={t > a + 0.3 ? 1 : 0} s={2.4} />, { bg: "#0A0C14" }), sfx: "ding" },
  { c: "Kod geliyor", r: (t, a, b) => ph(t, a, b, <LockScreen time="03:21" date="Perşembe" bg="#0A0F1E"><Notif x={0} y={0} app="Google" title="Doğrulama kodu" body="Kodun: 482 913" icon="#4285F4" k={rp(t, a + 0.2, a + 0.6)} /></LockScreen>, { z: [1.1, 1.3] }) },
  { c: "Elin titrediği için", r: (t, a, b) => { const sh = Math.sin(t * 50) * 5; return ph(t, a, b, <g transform={`translate(${sh},0)`}><CodeScreen typed={Math.min(6, Math.floor((t - a) * 4))} wrong={t > a + 1.6} /></g>, { z: [1.15, 1.3] }); }, sfx: "buzz" },
  { c: "İkinci seferde", r: (t, a, b) => ph(t, a, b, <CodeScreen typed={6} ok={t > a + 0.6} />, { z: [1.15, 1.3] }), sfx: "ding" },
  { c: "Kırk video", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#0F0F0F" />{tx(20, 60, "Dizi Özetleri TR · 40 video", 18, "#FFF", 700)}{Array.from({ length: 8 }, (_, i) => <g key={i} transform={`translate(16,${90 + i * 80})`}><Cover x={0} y={0} w={110} kind="dizi" />{tx(124, 30, "Özet " + (i + 1), 16, "#DDD", 600)}</g>)}</g>, { z: [1.05, 1.15] }) },
  { c: "Kanalı komple siliyorsun", r: (t, a, b) => scr(t, a, b, <DeleteDialog k={rp(t, a, a + 0.5)} />, { z: [1.3, 1.4] }) },
  { c: "Üç yüz bin izlenen", r: (t, a, b) => board(t, a, b, <g opacity={lp(1, 0.3, rp(t, a + 1, b))}><g transform="translate(560,240)"><Cover x={0} y={0} w={800} kind="dizi" /></g>{tx(960, 800, "300.000 izlenme", 60, "#FFF", 700, "middle")}</g>), html: (t, a) => <Big t={t} at={a + 1.4} text="“Oldu” dediğin video" y={60} size={58} /> },
  { c: "Ekranda son bir uyarı", r: (t, a, b) => scr(t, a, b, <DeleteDialog />, { z: [1.8, 2.1], c0: [760, 520] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Bu işlem geri alınamaz." y={830} size={64} c="#FF6B6B" /> },
  { c: "Basıyorsun", r: (t, a, b) => scr(t, a, b, <DeleteDialog press={rp(t, a + 0.1, a + 0.3)} />, { z: [2.2, 2.4], c0: [1080, 650] }), sfx: "boom" },
  { c: "Telefonu kapatıp", r: (t, a, b) => lake(t, a, b, { level: 0.85, night: true, sen: { x: 860, arms: "down" }, z: [1.05, 1.1], c0: [960, 560] }), tone: "night" },
  { c: "Ay ışığında", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.9]} c0={[1200, 420]}><Baraj t={t} level={0.06} night /></HCam>, tone: "night" },
  { c: "Ertesi gün kalan", r: (t, a, b) => board(t, a, b, <g>{(["ruya", "cocuk", "luks"] as CoverKind[]).map((kd, i) => <ChannelCard key={i} x={480 + i * 480} y={500} kind={kd} name={["Rüya", "Çocuk", "Lüks"][i]} state={t > a + 1.6 + i * 0.6 ? "dead" : "on"} note={t > a + 1.6 + i * 0.6 ? "kapatıldı" : ""} />)}</g>) },
  { c: "Artık tek bir kanalın", r: (t, a, b) => board(t, a, b, <ChannelCard x={960} y={500} kind="koy" name="Sular Altındaki Köy" note="tek kanal" />, { z: [1.2, 1.45] }), tone: "gold" },
  // ── SONUÇ
  { c: "Yirmi üç yaşındasın", r: (t, a, b) => desk(t, a, b, S23, { bg: "studio", night: false, arms: "desk", mouth: "smile", old: false, z: [1.1, 1.2] }), html: (t, a) => <AgeTag t={t} at={a + 0.2} age="23 yaş" place="260.000 abone" /> },
  { c: "Reklamlar, İngilizce", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Reklam", "İngilizce ses\n= yabancı izleyici", "Sponsor"], H.green)) },
  { c: "Ay sonunda ekranda", r: (t, a, b) => scr(t, a, b, yt("Gelir", <g>{kv(0, 0, "Bu ay", "$" + fmt(lp(1200, 3200, rp(t, a + 0.3, a + 2))), H.green, 360)}</g>, "#9C8664"), { z: [1.5, 1.7], c0: [760, 420] }), html: (t, a) => <Big t={t} at={a + 1.6} text="$3.200 / ay" y={830} size={90} c="#FFC531" />, sfx: "ding", tone: "gold" },
  { c: "Para, bankada", r: (t, a, b) => ph(t, a, b, <BankCard k={rp(t, a + 0.3, a + 1.8)} gross="$3.200" cut="−$480" net="$2.720" />, { light: true }) },
  { c: "O akşam babanın", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]}><DedeSalon t={t} tv={<rect width={1920} height={1080} fill="#111" />} /><Person x={760} y={1060} s={0.85} t={t} o={DEDE} arms="down" mouth="flat" look={0.6} lookY={0.6} /><Person x={1140} y={1080} s={0.82} t={t} o={S23} dir={-1} arms="desk" mouth="smile" look={-0.6} lookY={0.6} /><g transform="translate(960,880)"><LidBack x={0} y={0} s={0.5} old /></g></HCam>, tone: "warm" },
  { c: "Fanı hâlâ uçak", r: (t, a, b) => board(t, a, b, <g><Laptop x={960} y={520} s={0.9} old t={t}><rect width={1000} height={625} fill="#0F0F0F" /></Laptop>{Array.from({ length: 3 }, (_, i) => <path key={i} d={`M${1400 + i * 30},${700 - i * 30} q30,-30 0,-60`} stroke="#FFF" strokeWidth={6} fill="none" opacity={0.3 + 0.5 * Math.abs(Math.sin(t * 8 + i))} />)}</g>), html: (t, a) => <Big t={t} at={a + 0.6} text="vıııınnnn" y={860} size={56} c="#AAA" /> },
  { c: "Deden ekrana eğiliyor", r: (t, a, b) => scr(t, a, b, <g><svg width={1000} height={625} viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice"><Baraj t={t} level={0.9} /><path d="M0,1080 L0,900 Q600,860 1920,890 L1920,1080Z" fill="#7A6248" /><Person x={760} y={1080} s={0.72} t={t} o={DEDE} arms="wave" talk mouth="smile" /></svg></g>, { old: true, z: [1.35, 1.5] }), html: (t, a) => <Big t={t} at={a + 1.2} text="“Burası okulumdu.”" y={70} size={60} /> },
  { c: "Sonra sana dönüp", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.7, 1.85]} c0={[780, 480]}><DedeSalon t={t} /><Person x={760} y={1060} s={0.85} t={t} o={DEDE} arms="down" mouth="flat" talk look={0.8} brow="up" /></HCam>, html: (t, a) => <Big t={t} at={a + 1} text="“Bunu o yapay zekâ mı yaptı?”" y={830} size={58} /> },
  { c: "Hayır dede", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.7, 1.85]} c0={[1140, 480]}><DedeSalon t={t} /><Person x={1140} y={1080} s={0.82} t={t} o={S23} dir={-1} arms="down" mouth="smile" talk look={-0.8} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.2} text="“Hayır dede.”" y={830} size={64} /> },
  { c: "Bunu sen yaptın", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 520]}><DedeSalon t={t} /><Person x={760} y={1060} s={0.85} t={t} o={DEDE} arms="down" mouth="smile" eyes="half" look={0.8} /><Person x={1140} y={1080} s={0.82} t={t} o={S23} dir={-1} arms="down" mouth="smile" look={-0.8} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.3} text="“Bunu sen yaptın.”" y={830} size={72} c="#FFC531" />, tone: "gold" },
  // ── HÜKÜM
  { c: "Peki, Türkiye'de", r: (t, a, b) => board(t, a, b, <g style={{ filter: "blur(8px)" }} opacity={0.5}>{[0, 1, 2].map((i) => <rect key={i} x={460} y={330 + i * 140} width={1000} height={70} rx={14} fill={["#E5322D", "#2BB673", "#FFB547"][i]} />)}</g>), html: (t, a) => <Big t={t} at={a + 0.4} text="Gerçekten değer mi?" y={440} size={100} c="#FFC531" /> },
  { c: "Yapay zekâ bir araç", r: (t, a, b) => board(t, a, b, cards(t, a + 0.6, ["Fotoğraf\nhareketlendirir", "Çeviri\nyapar", "Ses\nekler"], H.blue)), html: (t, a) => <Big t={t} at={a + 0.1} text="Yapay zekâ = araç" y={80} size={70} /> },
  { c: "Ama bütün işi ona", r: (t, a, b) => board(t, a, b, factory(t, a, "luks", 60), { bg: "#0B1A2A" }) },
  { c: "YouTube bunu görüyor", r: (t, a, b) => board(t, a, b, <g>{tx(960, 560, "$0", 300, "#FF6B6B", 700, "middle")}</g>) },
  { c: "Seri üretim", r: (t, a, b) => board(t, a, b, <g>{(["ruya", "dizi", "luks"] as CoverKind[]).map((kd, i) => <ChannelCard key={i} x={480 + i * 480} y={500} kind={kd} name={["Seri üretim", "Başkasının görüntüsü", "Kurs şablonu"][i]} state="dead" k={rp(t, a + i * 0.5, a + 0.4 + i * 0.5)} />)}</g>) },
  { c: "Başlamak için neredeyse", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Para:\n≈ 0", "Zaman:\nçok"], H.green, 520, 640, 560)) },
  { c: "Ve asıl tehlike", r: (t, a, b) => board(t, a, b, <g />, { bg: "#140808" }), html: (t, a) => <Big t={t} at={a + 0.2} text="Asıl tehlike: küçük kurallar" y={440} size={84} c="#FF6B6B" />, tone: "cool" },
  { c: "başkasının görüntüsünü", r: (t, a, b) => board(t, a, b, cards(t, a, ["Başkasının\ngörüntüsü", "Hepsi aynı\nhesapta", "AI'ı\ngizlemek"], H.red)) },
  { c: "Kimler için", r: (t, a, b) => desk(t, a, b, S23, { bg: "studio", arms: "desk", mouth: "smile", z: [1.3, 1.4], old: false, lookY: 0 }), html: (t, a) => <Big t={t} at={a + 0.6} text="Kimler için?" y={60} size={84} c="#FFC531" /> },
  { c: "Anlatacak gerçek", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Anlatacak\ngerçek bir şey", "AI = süs,\nhikâye = sen"], H.green, 520, 640, 560)) },
  { c: "Bir tuşla zengin", r: (t, a, b) => ph(t, a, b, igAd(t, a, "Bir tuşla zengin ol $$$", false), { z: [1.05, 1.15] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Bunlar için değil" y={830} size={64} c="#FF6B6B" /> },
  { c: "Zorluk: ondan altı", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.05]}><rect width={1920} height={1080} fill="#0E1016" /></HCam>, html: (t, a) => <Verdict t={t} a={a} rows={[["Zorluk", 6], ["Sermaye", 2], ["Sabır", 9]]} title="Yapay zekâyla YouTube kanalı" /> },
  { c: "Şimdi sıra sende", r: (t, a, b) => { const msg = "Ben ... işine başlamak istiyorum"; const n = Math.floor(rp(t, a + 2.5, a + 5) * msg.length); return board(t, a, b, <g transform="translate(960,460)"><rect x={-680} y={-170} width={1360} height={340} rx={30} fill="#1A1E27" /><circle cx={-560} cy={-60} r={56} fill={H.red} />{tx(-470, -60, "Yorum ekle…", 40, "#AAA", 600)}{tx(-470, 20, msg.slice(0, n) + (Math.floor(t * 3) % 2 ? "|" : ""), 44, "#FFF", 600)}<rect x={380} y={80} width={240} height={66} rx={33} fill={H.blue} />{tx(500, 124, "YORUM", 30, "#000", 700, "middle")}</g>); }, html: (t, a) => <Big t={t} at={a + 0.8} text="İnternette hangi işi yaptın?" y={70} size={64} c="#FFC531" /> },
  { c: "Sıradaki işleri", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["Senin\nyorumun", "Sıradaki\niş", "Bütün\nyolu"], H.blue)), html: (t, a) => <SubBtn t={t} at={a + 2} /> },
];

function People100Grid({ t, a }: { t: number; a: number }) {
  return <g>{Array.from({ length: 60 }, (_, i) => { const tr = i % 3 === 0; const k = rp(t, a + i * 0.02, a + 0.3 + i * 0.02); return <g key={i} opacity={k} transform={`translate(${260 + (i % 15) * 100},${300 + Math.floor(i / 15) * 130})`}><circle r={18} fill={tr ? H.red : H.blue} /><path d="M-26,60 Q-26,26 0,26 Q26,26 26,60Z" fill={tr ? H.red : H.blue} /></g>; })}<text x={560} y={900} fontFamily="Poppins" fontWeight={700} fontSize={44} fill={H.red}>● yurt dışındaki Türkler</text><text x={1100} y={900} fontFamily="Poppins" fontWeight={700} fontSize={44} fill={H.blue}>● yabancılar</text></g>;
}

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K6_03_SECONDS));
  return raw;
})();

export const K6Video03: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const fadeIn = rp(t, 0, 0.4);
  const cutFlash = 1 - rp(t, s.from, s.from + 0.12);
  const fadeOut = 1 - rp(t, K6_03_SECONDS - 1.5, K6_03_SECONDS);
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
      <Audio src={staticFile("audio/k6-03.wav")} />
      {TIMED.map((x, i) => i > 0 && x.to < K6_03_SECONDS - 15 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.sfx === "knock" ? 0.08 : x.sfx === "boom" || x.sfx === "drone" ? 0.12 : x.sfx ? 0.15 : 0.07} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
