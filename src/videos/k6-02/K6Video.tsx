import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k6-02-words.json";
import { makeCue } from "../../lib/cues";
import { Atmos, Sweep, Tone } from "../../components/Live";
import {
  ANNE, AgeTag, BABA, BackView, Big, Box, Bulb, Comment, Counter, DM, H, HCam, HFrame, KUZEN, Laptop, LineChart, LockScreen, Look, Mail, News, Notif,
  Paper, Person, Phone, SEN16, SEN20, SEN26, Salon, Studio, SubBtn, TeaGlass, TeenRoom, Verdict, cl, fmt, lp, rp,
} from "../../components/Hayat";

// Kanal 4 · k6-02 · "3 Dolardan 10.000 Dolara: Türkiye'de Etsy Satıcısı Olarak Hayatın"
// Ses: ElevenLabs Hasan Yasin (eleven_v4), kelime zamanları Scribe. Seviye kartı YOK; geçiş yaş etiketiyle.

const W = words as { text: string; start: number; end: number }[];
const cue = makeCue(W);
const VOICE_END = W[W.length - 1].end;
export const K6_02_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone };

// ───────── karakterler ─────────
const SEN19: Look = { ...SEN16, top: "#7A3E3E", top2: "#5E2F2F" };
const SEN21: Look = { ...SEN20, top: "#3E5A7A", top2: "#2F4660" };
const SEN22: Look = { ...SEN20, top: "#2D3440", top2: "#222831", kind: "shirt" };
const SEN25: Look = SEN26;
const ABLA: Look = { hairStyle: "bun", hair: "#3A2418", top: "#E86A92", top2: "#C24F75", kind: "sweater" };
const ANNE_G: Look = { ...ANNE, glasses: true };
const NINE: Look = { ...ANNE, scarf: "#E8E4DA", top: "#6E5A7E", top2: "#58486A", glasses: true, hair: "#BBB" };
const MUH: Look = { hairStyle: "short", hair: "#555", top: "#2E3A55", top2: "#222B40", kind: "shirt", glasses: true, mustache: true };
const USTA: Look = { hairStyle: "bald", top: "#8A6A4A", top2: "#6E523A", kind: "sweater", mustache: true };

const UI = "Poppins";
const OR = "#F1641E";
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

// ───────── Etsy'ye özel çizimler ─────────
// İznik çini deseni (merkez 0,0, kenar 200)
const Iznik: React.FC<{ x: number; y: number; s?: number; v?: number; bad?: boolean }> = ({ x, y, s = 1, v = 0, bad }) => {
  const red = bad ? "#E07A9A" : "#C8302C", blue = bad ? "#6A8FE0" : "#1F5FA8", tq = bad ? "#9AD0C8" : "#2FA5A0";
  return (
    <g transform={`translate(${x},${y}) scale(${s})`}>
      <rect x={-100} y={-100} width={200} height={200} fill="#F7F3EA" />
      <rect x={-100} y={-100} width={200} height={200} fill="none" stroke={blue} strokeWidth={10} />
      <rect x={-86} y={-86} width={172} height={172} fill="none" stroke={tq} strokeWidth={3} />
      <path d={`M0,80 C${-6 + v * 4},30 6,-10 0,-30`} stroke="#2E7D4F" strokeWidth={5} fill="none" />
      <path d="M0,40 C-40,30 -60,0 -70,-20 C-40,-10 -20,10 0,30Z" fill={blue} />
      <path d="M0,50 C40,40 60,10 70,-10 C40,0 20,20 0,40Z" fill={tq} />
      <path d="M0,-30 C-30,-40 -30,-80 -14,-84 C-8,-62 -4,-60 0,-70 C4,-60 8,-62 14,-84 C30,-80 30,-40 0,-30Z" fill={red} />
      {[[-56, -60], [56, -60], [-56, 64], [56, 64]].map(([cx, cy], i) => <g key={i}><circle cx={cx} cy={cy} r={12} fill={i % 2 ? red : blue} /><circle cx={cx} cy={cy} r={5} fill="#F7F3EA" /></g>)}
    </g>
  );
};

// genel planlayıcı posteri
const Planner: React.FC<{ x: number; y: number; s?: number; c?: string; dark?: boolean }> = ({ x, y, s = 1, c = "#F3D9C9", dark }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-80} y={-100} width={160} height={200} fill={dark ? "#3A3530" : c} />
    <rect x={-60} y={-80} width={120} height={18} fill={dark ? "#555" : "#FFF"} opacity={0.9} />
    {Array.from({ length: 6 }, (_, i) => <rect key={i} x={-60} y={-50 + i * 22} width={120} height={3} fill={dark ? "#666" : "#B89A88"} />)}
  </g>
);

// peştamal (çizgili Türk havlusu)
const Pestemal: React.FC<{ x: number; y: number; s?: number; c?: string; rot?: number }> = ({ x, y, s = 1, c = "#2F6FA8", rot = 0 }) => (
  <g transform={`translate(${x},${y}) rotate(${rot}) scale(${s})`}>
    <rect x={-120} y={-160} width={240} height={320} fill="#F2EDE2" />
    {Array.from({ length: 7 }, (_, i) => <rect key={i} x={-120} y={-150 + i * 46} width={240} height={i % 2 ? 8 : 22} fill={c} opacity={i % 2 ? 0.55 : 1} />)}
    {Array.from({ length: 16 }, (_, i) => <line key={i} x1={-112 + i * 15} x2={-112 + i * 15} y1={160} y2={186} stroke="#E6DFCF" strokeWidth={4} />)}
  </g>
);

// ürün kartı
const Card: React.FC<{ x: number; y: number; w?: number; art: React.ReactNode; title: string; price: string; hi?: boolean; badge?: string; gone?: number }> = ({ x, y, w = 220, art, title, price, hi, badge, gone = 0 }) => (
  <g transform={`translate(${x},${y})`} opacity={1 - gone * 0.85}>
    <rect width={w} height={w * 1.32} rx={10} fill="#FFF" stroke={hi ? OR : "#E3E3E3"} strokeWidth={hi ? 5 : 2} />
    <rect x={8} y={8} width={w - 16} height={w - 16} rx={6} fill="#EFEDE8" />
    <svg x={8} y={8} width={w - 16} height={w - 16} viewBox="-110 -110 220 220">{art}</svg>
    {tx(12, w + 22, title.length > 24 ? title.slice(0, 23) + "…" : title, 14, "#222", 500)}
    {tx(12, w + 50, price, 20, "#111", 700)}
    {badge && <g><rect x={w - 104} y={14} width={92} height={28} rx={14} fill={badge === "KOPYA" ? "#E5322D" : OR} />{tx(w - 58, 34, badge, 14, "#FFF", 700, "middle")}</g>}
    {gone > 0 && <g opacity={gone}><line x1={10} y1={10} x2={w - 10} y2={w * 1.32 - 10} stroke="#E5322D" strokeWidth={8} /><line x1={w - 10} y1={10} x2={10} y2={w * 1.32 - 10} stroke="#E5322D" strokeWidth={8} /></g>}
  </g>
);

// Etsy benzeri mağaza ekranı (1000x625)
const shop = (q: string, children: React.ReactNode) => (
  <g>
    <rect width={1000} height={625} fill="#FFF" />
    <rect width={1000} height={58} fill="#FFF" /><line x1={0} x2={1000} y1={58} y2={58} stroke="#E1E3DF" strokeWidth={2} />
    {tx(24, 40, "Etsy", 30, OR, 700)}
    <rect x={130} y={13} width={560} height={32} rx={16} fill="#F2F2F2" stroke="#222" strokeWidth={1.5} />{tx(150, 35, q, 15, "#444", 500)}
    <circle cx={950} cy={29} r={16} fill="#D9D9D9" />
    <g transform="translate(0,58)">{children}</g>
  </g>
);

// satıcı paneli
const panel = (title: string, children: React.ReactNode, banner?: { c: string; text: string; k: number }) => (
  <g>
    <rect width={1000} height={625} fill="#F7F7F5" />
    <rect width={180} height={625} fill="#222" />{tx(22, 42, "Etsy", 26, OR, 700)}{tx(22, 70, "Mağaza Yöneticisi", 13, "#BBB", 500)}
    {["Panel", "Ürünler", "Siparişler", "Finans", "Pazarlama"].map((m, i) => <g key={m}>{tx(22, 120 + i * 40, m, 16, i ? "#DDD" : "#FFF", i ? 500 : 700)}</g>)}
    {tx(210, 50, title, 26, "#222", 700)}
    <g transform="translate(210,80)">{children}</g>
    {banner && <g opacity={banner.k} transform={`translate(180,${-70 + banner.k * 70})`}><rect width={820} height={64} fill={banner.c} />{tx(30, 42, banner.text, 24, "#FFF", 700)}</g>}
  </g>
);

const stat = (x: number, y: number, label: string, value: string, c = "#222", w = 240) => (
  <g transform={`translate(${x},${y})`}><rect width={w} height={110} rx={12} fill="#FFF" stroke="#E3E3E3" strokeWidth={2} />{tx(18, 36, label, 15, "#777", 500)}{tx(18, 86, value, 38, c, 700)}</g>
);

// kesinti tablosu (ekran içi)
const FEES: [string, number][] = [["İşlem ücreti %6,5", 0.2], ["Ödeme işlemi %6,5 + sabit", 0.53], ["İşletim ücreti", 0.07], ["Listeleme yenileme", 0.2], ["Kur çevirme", 0.08]];
const feeBoard = (t: number, a: number, hi = -1) => {
  const n = FEES.length;
  let left = 3;
  return (
    <g transform="translate(460,160)">
      <rect width={1000} height={760} rx={30} fill="#FFF" />
      {tx(50, 80, "Satış", 40, "#222", 700)}{tx(950, 80, "$3,00", 40, "#222", 700, "end")}
      {FEES.map(([l, v], i) => {
        const k = rp(t, a + 0.4 + i * 0.5, a + 0.8 + i * 0.5);
        left -= v * k;
        return <g key={l} opacity={cl(k * 2)} transform={`translate(0,${140 + i * 92})`}><rect x={30} y={-50} width={940} height={74} rx={12} fill={i === hi ? "#FFE9E0" : "#F6F6F6"} />{tx(50, 0, l, 32, "#444", 600)}{tx(950, 0, "−$" + v.toFixed(2).replace(".", ","), 34, "#C62828", 700, "end")}</g>;
      })}
      <line x1={40} x2={960} y1={140 + n * 92 - 20} y2={140 + n * 92 - 20} stroke="#222" strokeWidth={3} />
      {tx(50, 140 + n * 92 + 50, "Eline kalan", 40, "#222", 700)}{tx(950, 140 + n * 92 + 50, "$" + Math.max(left, 1.92).toFixed(2).replace(".", ","), 48, H.green, 700, "end")}
    </g>
  );
};

// harita: Türkiye → ABD
const route = (t: number, a: number, back = false, label = "") => {
  const k = rp(t, a + 0.3, a + 2.6);
  const kk = back ? 1 - k : k;
  const p = (u: number) => ({ x: lp(1460, 420, u), y: 520 - Math.sin(u * Math.PI) * 260 });
  const pt = p(kk);
  return (
    <g>
      <path d="M260,330 Q330,260 520,300 Q640,340 600,460 Q520,560 420,540 Q300,520 260,430Z" fill="#2A3346" />
      <path d="M1340,470 Q1420,440 1560,460 Q1600,490 1520,520 Q1400,530 1340,500Z" fill="#2A3346" />
      {tx(420, 630, "ABD", 44, "#DDD", 700, "middle")}{tx(1460, 600, "Türkiye", 44, "#DDD", 700, "middle")}
      <path d={`M1460,520 Q940,-10 420,520`} stroke="#FFF" strokeWidth={4} strokeDasharray="14 14" fill="none" opacity={0.5} />
      <circle cx={1460} cy={520} r={14} fill={H.red} /><circle cx={420} cy={520} r={14} fill={H.blue} />
      <g transform={`translate(${pt.x},${pt.y})`}><Box x={0} y={0} s={0.18} /></g>
      {label && tx(940, 900, label, 48, "#FFF", 700, "middle")}
    </g>
  );
};

// kargo takip
const track = (rows: [string, boolean, boolean?][], k = 1) => (
  <g>
    <rect width={360} height={740} fill="#FFF" />
    <rect width={360} height={110} fill="#4D2E8C" />{tx(20, 70, "Kargo Takip", 26, "#FFF", 700)}
    {rows.map(([s, done, warn], i) => <g key={i} opacity={cl(k * rows.length - i)}><circle cx={40} cy={170 + i * 110} r={16} fill={warn ? "#E5322D" : done ? H.green : "#CCC"} />{i < rows.length - 1 && <rect x={37} y={186 + i * 110} width={6} height={94} fill="#DDD" />}{tx(72, 178 + i * 110, s, 20, warn ? "#C62828" : "#222", warn ? 700 : 500)}</g>)}
  </g>
);

// askıya alma ekranı
const suspended = (k = 1) => (
  <g>
    <rect width={1000} height={625} fill="#FFF" />
    {tx(24, 40, "Etsy", 30, OR, 700)}
    <rect x={0} y={70} width={1000} height={8} fill="#E5322D" opacity={k} />
    <g transform={`translate(500,${300 - (1 - k) * 30})`} opacity={k}>
      <circle cx={0} cy={-90} r={60} fill="#E5322D" />{tx(0, -66, "!", 80, "#FFF", 700, "middle")}
      {tx(0, 40, "Mağazan askıya alındı", 52, "#C62828", 700, "middle")}
      {tx(0, 100, "Hesabın inceleme altında. Ödemeler durduruldu.", 22, "#555", 500, "middle")}
    </g>
  </g>
);

// geri sayım
const countdown = (t: number, a: number, from: number, to: number, label: string) => {
  const k = rp(t, a, a + 2.5);
  const s = Math.round(lp(from, to, k) * 3600);
  const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), ss = s % 60;
  const p = (n: number) => String(n).padStart(2, "0");
  return (
    <g>
      {tx(960, 560, `${p(h)}:${p(m)}:${p(ss)}`, 240, h < 30 ? "#FF6B6B" : "#FFF", 700, "middle")}
      {tx(960, 680, label, 46, "#AAA", 600, "middle")}
      <rect x={460} y={760} width={1000} height={16} rx={8} fill="#2A2E38" /><rect x={460} y={760} width={1000 * (s / (72 * 3600))} height={16} rx={8} fill={H.red} />
    </g>
  );
};


// atölye
const atelier = (t: number, a: number, b: number, p: { z?: [number, number]; c0?: [number, number]; c1?: [number, number]; n?: number; people?: React.ReactNode } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1.05, 1.15]} c0={p.c0 ?? [960, 540]} c1={p.c1}>
    <rect width={1920} height={1080} fill="#4A3B2E" />
    <rect y={0} width={1920} height={120} fill="#3A2E24" />
    {Array.from({ length: 5 }, (_, i) => <g key={i}><rect x={120 + i * 360} y={200} width={10} height={520} fill="#2A2018" /><rect x={120 + i * 360} y={240} width={300} height={10} fill="#2A2018" />{Array.from({ length: 14 }, (_, j) => <line key={j} x1={140 + i * 360 + j * 20} x2={140 + i * 360 + j * 20} y1={250} y2={600 + Math.sin(t * 3 + j + i) * 4} stroke={["#2F6FA8", "#C8302C", "#2FA5A0", "#E8E1D0"][(i + j) % 4]} strokeWidth={5} />)}</g>)}
    <rect y={760} width={1920} height={320} fill="#5E4A38" />
    {Array.from({ length: p.n ?? 8 }, (_, i) => <g key={i} transform={`translate(${300 + (i % 8) * 180},${820 - Math.floor(i / 8) * 26})`}><rect x={-70} y={0} width={140} height={26} fill="#F2EDE2" /><rect x={-70} y={4} width={140} height={6} fill={["#2F6FA8", "#C8302C", "#2FA5A0"][i % 3]} /></g>)}
    {p.people}
  </HCam>
);

const notifStack = (t: number, a: number, n: number, title = "Yeni sipariş", body = "İznik Lale Duvar Posteri · $14") => (
  <LockScreen time="09:12" date="Salı">
    {Array.from({ length: n }, (_, i) => <g key={i} transform={`translate(0,${i * 76})`}><Notif x={0} y={0} app="Etsy" title={title} body={body} icon={OR} k={rp(t, a + 0.2 + i * 0.35, a + 0.5 + i * 0.35)} /></g>)}
  </LockScreen>
);

// ───────── ÇEKİMLER ─────────
const SHOTS: Sh[] = [
  // ── KANCA
  { c: "İlk satışın tam", r: (t, a, b) => ph(t, a, b, <LockScreen time="02:07" date="Pazartesi"><Notif x={0} y={0} app="Etsy" title="Yeni sipariş!" body="Günlük Planlayıcı · $3,00" icon={OR} k={rp(t, a + 0.3, a + 0.8)} /></LockScreen>, { z: [1.1, 1.3] }), html: (t, a) => <Big t={t} at={a + 1.2} text="$3" y={760} size={140} c="#FFC531" />, sfx: "ding" },
  { c: "Kesintilerden sonra", r: (t, a, b) => board(t, a, b, feeBoard(t, a - 1.5)), html: (t, a) => <Big t={t} at={a + 1.6} text="Eline 2 dolar bile kalmıyor" y={40} size={60} c="#FF6B6B" /> },
  { c: "Ve sen o gece", r: (t, a, b) => desk(t, a, b, SEN19, { mouth: "grin", eyes: "wide", arms: "phone", z: [1.5, 1.7], c0: [960, 420] }), tone: "warm" },
  { c: "On dokuz yaşındasın", r: (t, a, b) => desk(t, a, b, SEN19, { z: [1, 1.12], c0: [960, 540], mouth: "flat", night: false }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="19 yaş" place="Denizli" /> },
  { c: "YKS'de istediğin", r: (t, a, b) => { const k = rp(t, a + 0.2, a + 1); return board(t, a, b, <Paper x={960} y={lp(1400, 540, k)} s={0.9} rot={lp(-14, -3, k)} title="YKS SONUÇ BELGESİ" lines={["Tercih sonucu:", "Yerleşemedi"]} stamp="TEKRAR" />, { bg: "#1A1D24" }); }, html: (t, a) => <Big t={t} at={a + 1.6} text="Bu yıl tekrar hazırlanıyorsun" y={60} size={56} /> },
  { c: "Ama kafanda tek", r: (t, a, b) => board(t, a, b, <g><LineChart x={260} y={240} w={1400} h={520} pts={[0.2, 0.24, 0.3, 0.33, 0.4, 0.46, 0.5, 0.58, 0.66, 0.74, 0.86, 1]} k={rp(t, a + 0.2, b - 0.2)} c={H.red} />{tx(260, 820, "Dolar / TL", 40, "#FFF", 700)}</g>), html: (t, a) => <Big t={t} at={a + 1.4} text="Dolar her ay yükseliyor" y={60} size={60} c="#FF6B6B" /> },
  { c: "neden ben de dolar", r: (t, a, b) => desk(t, a, b, SEN19, { arms: "chin", mouth: "tight", brow: "up", look: 0.5, lookY: -0.4, z: [1.45, 1.6], c0: [960, 420], extra: <Bulb x={1300} y={240} s={0.7} on={rp(t, a + 1, a + 1.4)} t={t} /> }), html: (t, a) => <Big t={t} at={a + 0.8} text="Neden ben de dolar kazanmıyorum?" y={830} size={56} /> },
  { c: "Şimdi seninle birlikte", r: (t, a, b) => board(t, a, b, <g><LineChart x={260} y={260} w={1400} h={520} pts={[0.01, 0.01, 0.02, 0.04, 0.03, 0.1, 0.06, 0.18, 0.3, 0.26, 0.44, 0.38, 0.62, 0.8, 1]} k={rp(t, a + 0.3, b - 0.2)} c={OR} />{tx(260, 830, "$3", 54, "#FFF", 700)}{tx(1660, 230, "$10.000 / ay", 54, "#FFF", 700, "end")}</g>) },
  { c: "Neyi yanlış yapacağını", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Hatalar", "Para nereye\ngidiyor?", "Kimsenin\nanlatmadıkları"])) },
  { c: "Bir gün, yılbaşından", r: (t, a, b) => board(t, a, b, <g>{cal(t, a + 0.2, "ARALIK", "28", "Yılbaşına 4 gün")}</g>, { bg: "#1A0E10" }), html: (t, a) => <Big t={t} at={a + 2} text="Tek bir e-posta…" y={880} size={60} c="#FF6B6B" />, tone: "cool" },
  { c: "Ve en sonunda", r: (t, a, b) => board(t, a, b, <g style={{ filter: "blur(8px)" }} opacity={0.5}>{[0, 1, 2].map((i) => <rect key={i} x={460} y={330 + i * 140} width={1000} height={70} rx={14} fill={["#E5322D", "#2BB673", "#FFB547"][i]} />)}</g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Bu iş gerçekten değer mi?" y={440} size={100} c="#FFC531" /> },
  // ── KUZEN
  { c: "Her şey İstanbul'daki", r: (t, a, b) => room(t, a, b, <><Person x={640} y={1060} s={0.92} t={t} o={KUZEN} arms="phone" mouth="smile" look={0.5} /><Person x={1280} y={1060} s={0.9} t={t} o={SEN19} dir={-1} arms="down" mouth="flat" look={-0.5} /></>), html: (t, a) => <Big t={t} at={a + 0.5} text="Bayram · İstanbul'dan kuzen" y={60} size={54} /> },
  { c: "Bayramda sofrada", r: (t, a, b) => room(t, a, b, <><Person x={760} y={1060} s={1} t={t} o={KUZEN} arms="phone" mouth="grin" talk look={0.6} /><Person x={1300} y={1060} s={0.95} t={t} o={SEN19} dir={-1} arms="down" mouth="o" eyes="wide" look={-0.5} /></>, { z: [1.3, 1.4], c0: [1000, 460], extra: bub(t, a + 1, 760, 300, "Amerikalı biri 5 dolar verdi!", 36, 1) }) },
  { c: "Hem de ben uyurken", r: (t, a, b) => board(t, a, b, <g><circle cx={760} cy={420} r={150} fill="#F4E9C8" /><circle cx={820} cy={380} r={140} fill="#10131A" />{Array.from({ length: 20 }, (_, i) => <circle key={i} cx={(i * 197) % 1900} cy={(i * 131) % 700} r={3} fill="#FFF" opacity={0.5 + 0.5 * Math.sin(t * 3 + i)} />)}{tx(1220, 470, "+$5", 160, H.green, 700, "middle")}{tx(1220, 560, "uyurken", 48, "#AAA", 600, "middle")}</g>, { bg: "#0B0E18" }) },
  { c: "Ekranda turuncu bir", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#FFF" />{tx(20, 70, "Etsy", 36, OR, 700)}<rect x={20} y={95} width={320} height={40} rx={20} fill="#F2F2F2" />{Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${20 + (i % 2) * 165},${160 + Math.floor(i / 2) * 190})`}><rect width={155} height={180} rx={8} fill="#EFEDE8" /><svg width={155} height={140} viewBox="-110 -110 220 220">{i % 3 === 0 ? <Planner x={0} y={0} /> : i % 3 === 1 ? <Pestemal x={0} y={0} s={0.55} /> : <circle r={70} fill={["#E8B4A0", "#9FC5A8"][i % 2]} />}</svg></g>)}</g>, { light: true, bg: "salon" }), html: (t, a) => <Big t={t} at={a + 0.8} text="Etsy" y={60} size={90} c={OR} /> },
  { c: "El yapımı ürünlerin", r: (t, a, b) => scr(t, a, b, shop("el yapımı · tasarım · dijital", <g>{Array.from({ length: 8 }, (_, i) => <Card key={i} x={30 + (i % 4) * 240} y={14 + Math.floor(i / 4) * 280} w={210} art={i % 4 === 0 ? <Planner x={0} y={0} /> : i % 4 === 1 ? <Pestemal x={0} y={0} s={0.55} c={["#C8302C", "#2FA5A0"][i % 2]} /> : i % 4 === 2 ? <circle r={70} fill="#9FC5A8" /> : <rect x={-60} y={-80} width={120} height={160} fill="#E8B4A0" />} title={["Dijital planlayıcı", "Pamuk havlu", "El yapımı kupa", "Duvar posteri"][i % 4]} price={["$4", "$32", "$18", "$7"][i % 4]} />)}</g>), { z: [1.3, 1.45] }) },
  { c: "Alıcıların çoğu", r: (t, a, b) => board(t, a, b, route(t, a, true, "Alıcılar: Amerika ve Avrupa")) },
  // ── ABLANIN LAPTOPU
  { c: "Elinde ablandan kalan", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.15]} c0={[960, 600]}><TeenRoom t={t} poster="X" /><rect y={760} width={1920} height={320} fill={H.wood} /><Laptop x={960} y={520} s={0.75} old t={t}><rect width={1000} height={625} fill="#0A2A5A" />{tx(500, 330, "Hoş geldiniz", 40, "#FFF", 600, "middle")}</Laptop><g transform="translate(1420,620) rotate(10)"><rect x={-90} y={-40} width={180} height={80} rx={10} fill="#F6C445" />{tx(0, 10, "ABLA", 30, "#333", 700, "middle")}</g></HCam>, html: (t, a) => <Big t={t} at={a + 0.8} text="Abladan kalan eski laptop" y={70} size={60} /> },
  { c: "Açılması üç dakika", r: (t, a, b) => board(t, a, b, <g><Clock x={960} y={480} s={1.5} h={9} m={0} spin={rp(t, a, b) * 0.15} /></g>), html: (t, a) => <Big t={t} at={a + 0.5} text="Açılması: 3 dakika" y={830} size={60} /> },
  { c: "Ama Canva açılıyor", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#EDEFF3" /><rect width={1000} height={50} fill="#7D2AE8" />{tx(20, 34, "Tasarım", 20, "#FFF", 700)}<rect x={0} y={50} width={150} height={575} fill="#FFF" />{Array.from({ length: 6 }, (_, i) => <rect key={i} x={20} y={80 + i * 80} width={110} height={60} rx={8} fill="#E3E6EC" />)}<Planner x={560} y={340} s={2.3} /></g>, { old: true, z: [1.45, 1.6] }), html: (t, a) => <Big t={t} at={a + 0.8} text="…o yeter." y={70} size={60} /> },
  // ── MAĞAZA AÇMA
  { c: "Mağaza açmak ücretsiz", r: (t, a, b) => over(t, a, b, SEN19, shop("mağaza aç", <g>{tx(500, 150, "Mağazanı aç", 44, "#222", 700, "middle")}<rect x={300} y={200} width={400} height={60} rx={30} fill="#222" />{tx(500, 240, "Başla", 26, "#FFF", 700, "middle")}</g>)), html: (t, a) => <Big t={t} at={a + 0.6} text="Mağaza açmak: ücretsiz" y={70} size={60} c={H.green} /> },
  { c: "Ama koyduğun her", r: (t, a, b) => board(t, a, b, <g>{tx(960, 520, "$0,20", 260, "#FFF", 700, "middle")}{tx(960, 640, "her ürün için", 54, "#AAA", 600, "middle")}</g>) },
  { c: "Bunun için bir kart", r: (t, a, b) => scr(t, a, b, shop("ödeme bilgileri", <g>{tx(260, 120, "Kart bilgisi gerekli", 32, "#222", 700)}<rect x={260} y={150} width={480} height={56} rx={8} fill="#FFF" stroke="#E5322D" strokeWidth={3} />{tx(280, 186, "•••• •••• •••• ••••", 22, "#999", 500)}{tx(260, 240, "Bu alan zorunlu", 18, "#E5322D", 600)}</g>), { old: true }), html: (t, a) => <Big t={t} at={a + 1.4} text="Senin kartın yok" y={830} size={60} /> },
  { c: "Annenin kartını istiyorsun", r: (t, a, b) => room(t, a, b, <><Person x={640} y={1060} s={0.95} t={t} o={ANNE} arms="cross" mouth="flat" brow="up" look={0.6} /><Person x={1300} y={1060} s={0.92} t={t} o={SEN19} dir={-1} arms="wave" mouth="smile" talk look={-0.5} /></>, { extra: bub(t, a + 0.4, 1320, 300, "Anne, kartın lazım…", 38) }) },
  { c: "Annen gözlüğünü takıp", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[900, 420]}><Salon t={t} /><Person x={900} y={1000} s={0.95} t={t} o={ANNE_G} arms="phone" eyes="half" brow="worry" mouth="tight" lookY={0.8} talk={t > a + 1.4} />{bub(t, a + 1.4, 900, 200, "Dolarla mı? Dolandırıcı olmasın?", 36)}</HCam> },
  // ── İLK ASKIYA ALINMA
  { c: "Daha ilk haftada", r: (t, a, b) => scr(t, a, b, suspended(rp(t, a + 0.6, a + 1.1)), { old: true, z: [1.45, 1.7] }), sfx: "buzz", tone: "cool" },
  { c: "Mağaza senin adına", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Mağaza:\nSEN", "Kart:\nANNEN", "Banka:\n???"], H.red)) },
  { c: "Etsy bilgilerin birbirini", r: (t, a, b) => board(t, a, b, <g>{["SEN", "ANNEN", "???"].map((s, i) => <g key={s}><rect x={360 + i * 440} y={420} width={320} height={140} rx={20} fill="#1A1E27" stroke="#E5322D" strokeWidth={4} />{tx(520 + i * 440, 510, s, 48, "#FFF", 700, "middle")}{i < 2 && tx(740 + i * 440, 510, "≠", 70, "#E5322D", 700, "middle")}</g>)}</g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Bilgiler birbirini tutmuyor" y={760} size={60} c="#FF6B6B" /> },
  { c: "On iki gün boyunca", r: (t, a, b) => over(t, a, b, SEN19, <Mail from="Ben" subject="My shop is suspended, please help" lines={["Hello, I am from Turkey.", "My shop is closed. Please open.", "Thank you very much."]} k={rp(t, a + 0.2, a + 1.4)} />, { slump: 0.5 }), html: (t, a) => <Big t={t} at={a + 0.6} text="12 gün · İngilizce e-posta" y={60} size={56} /> },
  { c: "Çeviri uygulamasıyla", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#FFF" /><rect width={360} height={90} fill="#1A73E8" />{tx(20, 60, "Çeviri", 26, "#FFF", 700)}{tx(20, 150, "Türkçe", 18, "#1A73E8", 700)}{tx(20, 190, "Mağazam kapandı, lütfen açın.", 18, "#222", 500)}<rect x={0} y={230} width={360} height={2} fill="#EEE" />{tx(20, 280, "İngilizce", 18, "#1A73E8", 700)}{tx(20, 320, "My shop closed, please open.", 18, "#222", 500)}</g>, { light: true }) },
  { c: "Sonunda kendi adına", r: (t, a, b) => { const k = rp(t, a + 0.2, a + 1); return board(t, a, b, <Paper x={960} y={lp(1400, 540, k)} s={0.9} rot={lp(-12, -2, k)} title="BANKA HESABI" lines={["Hesap sahibi: SEN", "Durum: Açıldı"]} stamp="ONAY" />, { bg: "#14201A" }); } },
  { c: "her şeyi aynı isimle", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Mağaza:\nSEN", "Kart:\nSEN", "Banka:\nSEN"], H.green)), html: (t, a) => <Big t={t} at={a + 2.2} text="Mağaza geri açıldı" y={830} size={60} c={H.green} />, tone: "warm" },
  { c: "Bu kırmızı yazıyı unutma", r: (t, a, b) => scr(t, a, b, suspended(1), { z: [1.9, 2.3], c0: [960, 520] }), html: (t, a) => <Big t={t} at={a + 1.6} text="Bir gün geri gelecek…" y={850} size={60} c="#FF6B6B" />, tone: "cool" },
  // ── DİJİTAL ÜRÜN
  { c: "Ne satacağın belli", r: (t, a, b) => board(t, a, b, <g><rect x={810} y={300} width={300} height={380} rx={20} fill="#FFF" /><path d="M1050,300 L1110,360 L1050,360Z" fill="#DDD" />{tx(960, 560, "PDF", 80, OR, 700, "middle")}</g>), html: (t, a) => <Big t={t} at={a + 0.5} text="Dijital ürün" y={80} size={90} c="#FFC531" /> },
  { c: "Çünkü kargo yok", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Kargo yok", "Stok yok", "Sermaye yok"], H.green)) },
  { c: "Bir kere tasarlıyorsun", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 40 }, (_, i) => { const k = rp(t, a + 1 + i * 0.04, a + 1.3 + i * 0.04); return <g key={i} opacity={i === 0 ? 1 : k} transform={`translate(${i === 0 ? 960 : 160 + (i % 10) * 175},${i === 0 ? 540 : 170 + Math.floor(i / 10) * 230})`}><Planner x={0} y={0} s={i === 0 ? lp(1.6, 0.6, rp(t, a + 0.6, a + 1.2)) : 0.6} /></g>; })}</g>), html: (t, a) => <Big t={t} at={a + 1.6} text="1 kere tasarla, 1000 kere sat" y={890} size={56} /> },
  { c: "Canva'da günlük planlayıcılar", r: (t, a, b) => over(t, a, b, SEN19, <g><rect width={1000} height={625} fill="#EDEFF3" /><rect width={1000} height={50} fill="#7D2AE8" />{tx(20, 34, "Tasarım", 20, "#FFF", 700)}{[0, 1, 2].map((i) => <Planner key={i} x={250 + i * 250} y={330} s={1.2} c={["#F3D9C9", "#D9E7F3", "#E3F0D9"][i]} />)}</g>) },
  { c: "duvar posterleri", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#EDEFF3" />{[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${130 + i * 250},300)`}><rect x={-90} y={-130} width={180} height={260} fill="#FFF" stroke="#333" strokeWidth={6} />{i % 2 ? <circle r={60} fill={["#E8B4A0", "#9FC5A8"][i % 2]} /> : <rect x={-50} y={-80} width={100} height={160} fill="#D9C9F3" />}</g>)}{tx(500, 560, "Düğün davetiyesi şablonu · Poster · Planlayıcı", 22, "#555", 600, "middle")}</g>, { old: true, z: [1.4, 1.55] }) },
  { c: "Kırk ürün yüklüyorsun", r: (t, a, b) => scr(t, a, b, panel("Ürünler", <g>{Array.from({ length: 40 }, (_, i) => <rect key={i} x={(i % 10) * 76} y={Math.floor(i / 10) * 100} width={66} height={88} rx={6} fill={["#F3D9C9", "#D9E7F3", "#E3F0D9", "#D9C9F3"][i % 4]} opacity={cl(rp(t, a, b - 0.5) * 40 - i)} />)}{tx(0, 440, `${Math.round(rp(t, a, b - 0.5) * 40)} ürün`, 34, "#222", 700)}</g>), { z: [1.35, 1.5] }) },
  { c: "Sekiz dolar gidiyor", r: (t, a, b) => board(t, a, b, <g>{tx(960, 500, "40 × $0,20", 120, "#FFF", 700, "middle")}{tx(960, 660, "= −$8", 140, "#FF6B6B", 700, "middle")}</g>) },
  { c: "Bir hafta", r: (t, a, b) => scr(t, a, b, panel("Panel", <g>{stat(0, 0, "Satış (7 gün)", "0", "#C62828")}{stat(260, 0, "Görüntülenme", "12")}{stat(520, 0, "Sipariş", "0", "#C62828")}</g>), { z: [1.4, 1.5] }) },
  { c: "İki hafta", r: (t, a, b) => board(t, a, b, <g>{cal(t, a, "SATIŞ", "0", "2 hafta")}</g>) },
  { c: "Bir ay", r: (t, a, b) => desk(t, a, b, SEN19, { arms: "chin", mouth: "sad", brow: "worry", slump: 1, z: [1.5, 1.7], c0: [960, 420] }), html: (t, a) => <Big t={t} at={a + 0.2} text="1 ay: 0 satış" y={830} size={70} c="#FF6B6B" /> },
  // ── HATALAR
  { c: "Hatalar aslında çok", r: (t, a, b) => over(t, a, b, SEN19, panel("Ürünler", <g>{Array.from({ length: 12 }, (_, i) => <rect key={i} x={(i % 6) * 126} y={Math.floor(i / 6) * 150} width={110} height={130} rx={6} fill="#DDD" />)}</g>), { slump: 1 }), html: (t, a) => <Big t={t} at={a + 0.3} text="3 klasik hata" y={80} size={90} c="#FFC531" /> },
  { c: "Ürün adlarını Türkçe", r: (t, a, b) => scr(t, a, b, panel("Ürün düzenle", <g>{tx(0, 30, "Başlık", 18, "#777", 600)}<rect x={0} y={45} width={740} height={60} rx={8} fill="#FFF" stroke="#E5322D" strokeWidth={3} />{tx(16, 85, "Daily Plan Paper Very Nice Beautiful", 24, "#222", 500)}{tx(0, 160, "Amerikalılar ne arıyor?", 18, "#777", 600)}<rect x={0} y={175} width={740} height={60} rx={8} fill="#FFF" stroke={H.green} strokeWidth={3} />{tx(16, 215, "printable daily planner", 24, "#222", 500)}</g>), { z: [1.4, 1.55] }) },
  { c: "Amerikalı kimse o", r: (t, a, b) => board(t, a, b, <g>{tx(960, 420, "\"Daily Plan Paper Very Nice\"", 70, "#FFF", 700, "middle")}{tx(960, 560, "aranma: 0", 90, "#FF6B6B", 700, "middle")}</g>) },
  { c: "Görsellerin karanlık", r: (t, a, b) => board(t, a, b, <g><g transform="translate(440,200) scale(2)"><Card x={0} y={0} w={200} art={<Planner x={0} y={0} dark />} title="Daily Plan Paper" price="$3" /></g><g transform="translate(1060,200) scale(2)" opacity={rp(t, a + 1.2, a + 1.6)}><Card x={0} y={0} w={200} art={<Planner x={0} y={0} c="#F7E3D6" />} title="Printable Planner" price="$3" hi /></g></g>) },
  { c: "Bir de satmaya çalıştığın", r: (t, a, b) => scr(t, a, b, shop("printable daily planner", <g>{tx(30, 30, "on binlerce sonuç", 18, "#777", 600)}{Array.from({ length: 12 }, (_, i) => <Card key={i} x={30 + (i % 6) * 160} y={50 + Math.floor(i / 6) * 230} w={150} art={<Planner x={0} y={0} c={["#F3D9C9", "#D9E7F3", "#E3F0D9", "#F3E9C9"][i % 4]} />} title="Daily Planner" price={`$${[2, 3, 1, 4][i % 4]}`} />)}</g>), { z: [1.3, 1.5], c0: [960, 420], c1: [960, 640] }) },
  { c: "Yani senden almak", r: (t, a, b) => desk(t, a, b, SEN19, { mouth: "sad", brow: "worry", arms: "chin", z: [1.7, 1.9], c0: [960, 400], lookY: 0.9 }), html: (t, a) => <Big t={t} at={a + 0.5} text="Senden almak için sebep yok" y={790} size={60} /> },
  // ── İLK SATIŞ
  { c: "Kırk yedinci gün", r: (t, a, b) => board(t, a, b, <g>{cal(t, a, "GÜN", "47")}</g>, { bg: "#0B0E18" }) },
  { c: "gece ikide telefonun", r: (t, a, b) => { const v = t > a + 0.6 && t < a + 1.6 ? Math.sin(t * 70) * 6 : 0; return <HCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 600]}><TeenRoom t={t} night poster="X" lamp={0.2} /><rect width={1920} height={1080} fill="#000" opacity={0.45} /><g transform={`translate(${v},0)`}><Phone x={960} y={760} s={0.5} rot={-80}><LockScreen time="02:00" date="Pazartesi"><Notif x={0} y={0} app="Etsy" title="Yeni sipariş!" body="Günlük Planlayıcı" icon={OR} k={rp(t, a + 0.6, a + 1)} /></LockScreen></Phone></g></HCam>; }, sfx: "ding" },
  { c: "Üç dolarlık bir planlayıcı", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#FFF" /><rect width={360} height={90} fill={OR} />{tx(20, 60, "Sipariş #1", 26, "#FFF", 700)}<g transform="translate(180,240) scale(1.1)"><Planner x={0} y={0} /></g>{tx(20, 410, "Günlük Planlayıcı", 22, "#222", 700)}{tx(20, 450, "$3,00", 34, "#222", 700)}{tx(20, 510, "Alıcı: Ohio, ABD", 20, "#555", 600)}</g>, { light: true, z: [1.15, 1.3] }), html: (t, a) => <Big t={t} at={a + 1.6} text="Ohio, ABD" y={60} size={64} /> },
  { c: "Ekran görüntüsü alıyorsun", r: (t, a, b) => { const f = 1 - rp(t, a + 0.5, a + 0.8); return <g>{desk(t, a, b, SEN19, { arms: "phone", mouth: "grin", eyes: "wide", z: [1.5, 1.65], c0: [960, 420] })}<rect width={1920} height={1080} fill="#FFF" opacity={t > a + 0.5 ? f : 0} /></g>; }, sfx: "pop" },
  { c: "O görüntü hâlâ", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#111" />{tx(20, 60, "Fotoğraflar", 24, "#FFF", 700)}{Array.from({ length: 9 }, (_, i) => <rect key={i} x={10 + (i % 3) * 116} y={90 + Math.floor(i / 3) * 150} width={108} height={140} fill={i === 0 ? "#FFF" : "#333"} />)}<g transform="translate(64,160) scale(0.4)"><Planner x={0} y={0} /></g>{tx(64, 220, "$3", 22, OR, 700, "middle")}</g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Hâlâ telefonunda" y={60} size={56} /> },
  // ── KESİNTİLER
  { c: "Ama sonra kesintileri", r: (t, a, b) => board(t, a, b, feeBoard(t, a, 0)) },
  { c: "Ödeme işlemi için", r: (t, a, b) => board(t, a, b, feeBoard(t, a - 5, 1), { z: [1.15, 1.25], c0: [960, 480] }) },
  { c: "Üç dolarlık satıştan", r: (t, a, b) => board(t, a, b, <g>{tx(760, 560, "$3,00", 150, "#888", 700, "middle")}{tx(1000, 560, "→", 120, "#FFF", 700, "middle")}{tx(1260, 560, "$1,92", 170, H.green, 700, "middle")}</g>) },
  { c: "Annen hesap makinesini", r: (t, a, b) => room(t, a, b, <><Person x={760} y={1060} s={1} t={t} o={ANNE_G} arms="hold" brow="up" mouth="o" talk={t > a + 1.2} look={0.5} /><Person x={1320} y={1060} s={0.92} t={t} o={SEN19} dir={-1} arms="down" mouth="tight" eyes="half" look={-0.5} /></>, { z: [1.3, 1.4], c0: [1000, 460], extra: bub(t, a + 1.3, 780, 280, "Bütün gece 2 dolar için mi?", 36, 1) }) },
  // ── 6 AY
  { c: "Aradan altı ay", r: (t, a, b) => desk(t, a, b, SEN19, { z: [1, 1.1], c0: [960, 540], night: false }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="6 ay sonra" place="Denizli" /> },
  { c: "Mağazada yüz yirmi", r: (t, a, b) => scr(t, a, b, panel("Panel", <g>{stat(0, 0, "Ürün", "120")}{stat(260, 0, "Satış (ay)", "18")}{stat(520, 0, "Gelir (ay)", "$50", "#C62828")}<LineChart x={0} y={150} w={760} h={300} pts={[0.2, 0.25, 0.18, 0.3, 0.22, 0.28, 0.24, 0.3]} k={rp(t, a, b)} c={OR} /></g>), { z: [1.35, 1.5] }) },
  { c: "Ayda elli dolar", r: (t, a, b) => desk(t, a, b, SEN19, { arms: "chin", mouth: "flat", z: [1.5, 1.6], c0: [960, 420], night: false }), html: (t, a) => <Big t={t} at={a + 0.3} text="≈ $50 / ay" sub="Harçlık bile değil" y={760} size={80} /> },
  // ── YAPAY ZEKA
  { c: "Bu arada herkes", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#1E1F22" /><rect x={0} y={0} width={200} height={625} fill="#16171A" />{tx(24, 50, "Yapay zekâ", 22, "#FFF", 700)}<rect x={500} y={50} width={460} height={60} rx={20} fill="#2E3036" />{tx(520, 88, "minimalist boho poster, 4 tane", 17, "#EEE", 500)}{[0, 1, 2, 3].map((i) => <rect key={i} x={240 + i * 185} y={170} width={170} height={230} rx={8} fill={["#E8C4A8", "#C8D8C0", "#D8C0C8", "#C0C8D8"][i]} opacity={rp(t, a + 0.6 + i * 0.3, a + 1 + i * 0.3)} />)}</g>, { z: [1.4, 1.5] }) },
  { c: "Bir dakikada poster", r: (t, a, b) => board(t, a, b, <g><Clock x={520} y={520} s={1} h={10} m={0} spin={rp(t, a, b) * 0.2} />{Array.from({ length: 12 }, (_, i) => <rect key={i} x={860 + (i % 4) * 230} y={240 + Math.floor(i / 4) * 210} width={200} height={190} rx={10} fill={["#E8C4A8", "#C8D8C0", "#D8C0C8", "#C0C8D8"][i % 4]} opacity={cl(rp(t, a, b - 0.3) * 12 - i)} />)}</g>) },
  { c: "Sitede aynı tarzda", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 220 }, (_, i) => <rect key={i} x={20 + (i % 22) * 86} y={20 + Math.floor(i / 22) * 104} width={78} height={96} rx={4} fill={["#E8C4A8", "#C8D8C0", "#D8C0C8", "#C0C8D8"][i % 4]} opacity={cl(rp(t, a, a + 2) * 220 / 8 - i / 8)} />)}</g>, { z: [1, 1.2] }), html: (t, a) => <Big t={t} at={a + 1.4} text="Yüz binlerce aynı poster" y={460} size={70} /> },
  { c: "Fiyatlar bir dolara", r: (t, a, b) => board(t, a, b, <g>{tx(960, 560, "$" + lp(12, 1, rp(t, a + 0.2, a + 1.8)).toFixed(0), 300, "#FF6B6B", 700, "middle")}</g>), html: (t, a) => <Big t={t} at={a + 1.8} text="Fiyatlar 1 dolara düşüyor" y={830} size={56} /> },
  { c: "Sen de deniyorsun", r: (t, a, b) => over(t, a, b, SEN19, <g><rect width={1000} height={625} fill="#1E1F22" />{[0, 1, 2].map((i) => <rect key={i} x={120 + i * 270} y={160} width={230} height={300} rx={8} fill={["#E8C4A8", "#C8D8C0", "#D8C0C8"][i]} opacity={rp(t, a + 0.4 + i * 0.3, a + 0.8 + i * 0.3)} />)}</g>) },
  { c: "Ama Etsy'nin kuralı", r: (t, a, b) => scr(t, a, b, panel("Ürün düzenle", <g>{tx(0, 30, "Bu ürünü kim yaptı?", 22, "#222", 700)}<rect x={0} y={60} width={34} height={34} rx={6} fill={t > a + 1.6 ? "#222" : "#FFF"} stroke="#222" strokeWidth={3} />{t > a + 1.6 && tx(17, 88, "✓", 28, "#FFF", 700, "middle")}{tx(50, 88, "Yapay zekâ yardımıyla tasarlandı", 24, "#222", 600)}{tx(0, 160, "Bunu açıkça belirtmek zorunlu.", 20, "#C62828", 600)}</g>), { z: [1.45, 1.6] }) },
  { c: "Ve yapay zekâyla yaptığın", r: (t, a, b) => board(t, a, b, <g><rect x={480} y={260} width={360} height={480} rx={10} fill="#E8C4A8" /><rect x={1080} y={260} width={360} height={480} rx={10} fill="#E8C4A8" opacity={rp(t, a + 0.8, a + 1.2)} />{tx(660, 820, "SEN", 50, "#FFF", 700, "middle")}{tx(1260, 820, "BAŞKASI · aynı dakika", 40, "#FF6B6B", 700, "middle")}</g>) },
  { c: "Bırakmayı ciddi ciddi", r: (t, a, b) => desk(t, a, b, SEN19, { arms: "head", mouth: "sad", brow: "worry", slump: 1, z: [1.3, 1.5], c0: [960, 460] }), tone: "cool" },
  { c: "Mağazayı kapatma düğmesine", r: (t, a, b) => { const mx = lp(300, 610, rp(t, a + 0.3, a + 2)); return scr(t, a, b, <g>{panel("Ayarlar", <g><rect x={0} y={0} width={760} height={420} fill="#FFF" /></g>)}<rect width={1000} height={625} fill="#000" opacity={0.4} /><rect x={250} y={180} width={500} height={260} rx={16} fill="#FFF" />{tx(500, 250, "Mağazayı kapat?", 32, "#222", 700, "middle")}{tx(500, 295, "Bu işlem geri alınamaz.", 18, "#777", 500, "middle")}<rect x={540} y={350} width={170} height={56} rx={28} fill="#E5322D" />{tx(625, 386, "Kapat", 22, "#FFF", 700, "middle")}<rect x={300} y={350} width={170} height={56} rx={28} fill="#EEE" />{tx(385, 386, "Vazgeç", 22, "#333", 700, "middle")}<path d={`M${mx},${lp(500, 378, rp(t, a + 0.3, a + 2))} l0,30 l9,-8 l8,16 l6,-3 l-8,-15 l12,-2Z`} fill="#000" stroke="#FFF" strokeWidth={2} /></g>, { z: [1.5, 1.8], c0: [960, 560] }); }, tone: "cool" },
  // ── İZNİK
  { c: "Tam o hafta", r: (t, a, b) => room(t, a, b, <><Person x={700} y={1060} s={0.92} t={t} o={NINE} arms="down" mouth="smile" look={0.6} /><Person x={1300} y={1060} s={0.92} t={t} o={SEN19} dir={-1} arms="down" mouth="flat" look={-0.3} lookY={-0.6} /></>, { extra: <g><circle cx={1000} cy={300} r={90} fill="#F7F3EA" stroke="#1F5FA8" strokeWidth={8} /><Iznik x={1000} y={300} s={0.6} /></g> }), html: (t, a) => <Big t={t} at={a + 0.5} text="Anneannenin evi" y={60} size={56} /> },
  { c: "duvardaki eski bir çini", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.2]} c0={[960, 540]}><rect width={1920} height={1080} fill="#D8CBB4" /><circle cx={960} cy={540} r={380} fill="#F7F3EA" stroke="#1F5FA8" strokeWidth={22} /><circle cx={960} cy={540} r={340} fill="none" stroke="#2FA5A0" strokeWidth={6} /><Iznik x={960} y={540} s={2.6} /></HCam>, tone: "warm" },
  { c: "Mavi, turkuaz", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.8, 2.3]} c0={[960, 480]} c1={[940, 560]}><rect width={1920} height={1080} fill="#D8CBB4" /><circle cx={960} cy={540} r={380} fill="#F7F3EA" /><Iznik x={960} y={540} s={2.6} /></HCam>, html: (t, a) => <>{["Mavi", "Turkuaz", "Kırmızı lale"].map((s, i) => <Big key={s} t={t} at={a + 0.2 + i * 0.6} text={s} y={860} x={480 + i * 480} size={54} c={["#6FA8FF", "#5ED6CF", "#FF7A70"][i]} />)}</> },
  { c: "İznik çinisi", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#14171F" />{Array.from({ length: 18 }, (_, i) => <Iznik key={i} x={160 + (i % 6) * 320} y={200 + Math.floor(i / 6) * 340} s={1.5} />)}<rect width={1920} height={1080} fill="#000" opacity={0.3} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.2} text="İznik çinisi" y={440} size={110} c="#FFF" />, tone: "gold" },
  { c: "Telefonu açıp Etsy'de", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#FFF" />{tx(20, 60, "Etsy", 32, OR, 700)}<rect x={20} y={80} width={320} height={40} rx={20} fill="#F2F2F2" />{tx(40, 107, "iznik tile wall art", 18, "#333", 500)}{tx(20, 160, "Az sonuç", 18, "#777", 600)}<g transform="translate(90,280)"><Iznik x={0} y={0} s={0.6} bad /></g><g transform="translate(270,280)" opacity={0.3}><rect x={-60} y={-60} width={120} height={120} fill="#EEE" /></g></g>, { light: true, bg: "salon" }) },
  { c: "Bu desenlerle yapılmış", r: (t, a, b) => board(t, a, b, <g>{tx(960, 560, "≈ 0", 300, "#FFC531", 700, "middle")}</g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Düzgün dijital poster neredeyse yok" y={830} size={56} /> },
  { c: "Olanlar da Türkiye'yi", r: (t, a, b) => board(t, a, b, <g><Iznik x={700} y={520} s={1.6} bad /><Iznik x={1220} y={520} s={1.6} bad /><g transform="translate(1220,520) rotate(12)"><rect x={-180} y={-180} width={360} height={360} fill="none" stroke="#E5322D" strokeWidth={6} opacity={0.5} /></g></g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Türkiye'yi hiç görmemiş çizimler" y={830} size={56} c="#FF6B6B" /> },
  { c: "Ertesi gün işi", r: (t, a, b) => desk(t, a, b, SEN19, { mouth: "grin", brow: "up", eyes: "wide", z: [1.1, 1.25], night: false }), tone: "warm" },
  { c: "Tek bir şey satıyorsun", r: (t, a, b) => board(t, a, b, <g>{[0, 1, 2].map((i) => <Iznik key={i} x={560 + i * 400} y={480} s={1.6} />)}</g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Tek bir şey: Türk desenleri" y={820} size={64} c="#FFC531" /> },
  { c: "Eski camilerdeki", r: (t, a, b) => board(t, a, b, <g><path d="M560,820 L560,520 Q760,300 960,520 L960,820Z" fill="#2A3346" /><rect x={500} y={300} width={22} height={520} fill="#2A3346" /><rect x={998} y={300} width={22} height={520} fill="#2A3346" /><circle cx={760} cy={400} r={110} fill="#2A3346" />{Array.from({ length: 6 }, (_, i) => <Iznik key={i} x={1180 + (i % 3) * 180} y={380 + Math.floor(i / 3) * 200} s={0.85} />)}</g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Eski camiler · müzeler" y={70} size={60} /> },
  { c: "her deseni kendi", r: (t, a, b) => over(t, a, b, SEN19, <g><rect width={1000} height={625} fill="#F4F2EE" />{tx(20, 36, "Çizim", 22, "#333", 700)}<g opacity={0.25}><Iznik x={500} y={330} s={2.4} /></g><g style={{ clipPath: `inset(0 ${100 - rp(t, a + 0.3, b - 0.4) * 100}% 0 0)` }}><Iznik x={500} y={330} s={2.4} /></g></g>, { z: [1.1, 1.25], c0: [1060, 470] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Her deseni elle, baştan" y={60} size={56} /> },
  { c: "Ürün adlarını Amerikalıların", r: (t, a, b) => scr(t, a, b, panel("Ürün düzenle", <g>{tx(0, 30, "Başlık", 18, "#777", 600)}<rect x={0} y={45} width={760} height={60} rx={8} fill="#FFF" stroke={H.green} strokeWidth={3} />{tx(16, 85, "Iznik Tulip Wall Art · Turkish Tile Print", 22, "#222", 500)}<Iznik x={110} y={290} s={1.1} /></g>), { z: [1.4, 1.55] }) },
  { c: "Görselleri de sanki", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.12]} c0={[960, 480]}><rect width={1920} height={1080} fill="#E9E4DC" /><rect y={820} width={1920} height={260} fill="#B89A78" /><rect x={300} y={640} width={700} height={200} rx={40} fill="#7E8C80" /><rect x={360} y={600} width={160} height={120} rx={30} fill="#C8B49A" /><rect x={760} y={180} width={400} height={400} fill="#3A2E24" /><rect x={780} y={200} width={360} height={360} fill="#F7F3EA" /><Iznik x={960} y={380} s={1.7} /><rect x={1420} y={500} width={18} height={330} fill="#3A2E24" /><circle cx={1429} cy={470} r={80} fill="#5E8A5E" /></HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="Sanki New York'ta bir duvarda" y={60} size={56} /> },
  // ── PATLAMA + SEZON
  { c: "Üç hafta hiçbir", r: (t, a, b) => board(t, a, b, <g>{cal(t, a, "SATIŞ", "0", "3 hafta")}</g>) },
  { c: "Sonra bir sabah", r: (t, a, b) => ph(t, a, b, notifStack(t, a, 6), { z: [1.05, 1.2] }), sfx: "ding" },
  { c: "Bir günde on bir", r: (t, a, b) => board(t, a, b, null), html: (t, a) => <Counter t={t} a={a} from={0} to={11} dur={1.4} label="sipariş · 1 günde" y={320} c="#FFC531" /> },
  { c: "Ablan arıyor", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 420]}><Salon t={t} /><Person x={960} y={1060} s={1} t={t} o={ABLA} arms="phone" mouth="open" brow="up" eyes="wide" talk />{bub(t, a + 0.6, 960, 220, "Sen ne yaptın?!", 44)}</HCam> },
  { c: "Kasım geliyor", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 40 }, (_, i) => <circle key={i} cx={(i * 197) % 1920} cy={((i * 97 + t * 80) % 1080)} r={6} fill="#FFF" opacity={0.6} />)}{cal(t, a, "KASIM", "ABD", "Yılbaşı alışverişi")}</g>, { bg: "#14202E" }), tone: "cool" },
  { c: "Aralıkta ilk kez", r: (t, a, b) => board(t, a, b, null, { bg: "#0F1A14" }), html: (t, a) => <Counter t={t} a={a} from={0} to={1000} dur={1.6} prefix="$" label="Aralık satışı" y={320} c={H.green} />, sfx: "ding", tone: "gold" },
  { c: "Liraya çevirince", r: (t, a, b) => board(t, a, b, <g>{tx(700, 560, "$1.000", 140, H.green, 700, "middle")}{tx(960, 560, "≈", 120, "#FFF", 700, "middle")}<Paper x={1300} y={520} s={0.7} rot={4} title="MAAŞ BORDROSU" lines={["Baban", "Net ödenen"]} /></g>) },
  { c: "Baban ilk kez", r: (t, a, b) => room(t, a, b, <><Person x={900} y={1060} s={1} t={t} o={BABA} arms="cross" mouth="flat" eyes="wide" look={0.5} lookY={0.5} /></>, { z: [1.5, 1.7], c0: [900, 420] }) },
  { c: "Ocak ayı", r: (t, a, b) => board(t, a, b, null, { bg: "#1A0E10" }), html: (t, a) => <Counter t={t} a={a} from={1000} to={140} dur={1.2} prefix="$" label="Ocak" y={320} c="#FF6B6B" />, tone: "cool" },
  { c: "Evet, yanlış duymadın", r: (t, a, b) => desk(t, a, b, SEN19, { mouth: "o", eyes: "wide", brow: "up", z: [1.6, 1.8], c0: [960, 400], night: false }) },
  { c: "Yılbaşı sezonu bitince", r: (t, a, b) => board(t, a, b, <g><LineChart x={260} y={220} w={1400} h={560} pts={[0.12, 0.14, 0.2, 0.45, 1, 0.14, 0.12, 0.13]} k={rp(t, a + 0.2, b - 0.2)} c={OR} />{["Eyl", "Eki", "Kas", "Ara", "Oca"].map((m, i) => <g key={m}>{tx(260 + (i + 1) * 200, 840, m, 30, "#AAA", 600, "middle")}</g>)}</g>) },
  { c: "O ay bir şeyi", r: (t, a, b) => board(t, a, b, <g>{[0, 1, 2, 3].map((i) => <g key={i}>{cal(t, a + i * 0.2, ["KIŞ", "BAHAR", "YAZ", "SEZON"][i], ["☃", "✿", "☀", "★"][i], undefined, 420 + i * 360, 500, 0.6)}</g>)}</g>), html: (t, a) => <Big t={t} at={a + 1} text="Maaş değil · mevsimi olan bir ticaret" y={850} size={54} c="#FFC531" /> },
  // ── 21: PEŞTAMAL
  { c: "Yirmi bir yaşındasın", r: (t, a, b) => desk(t, a, b, SEN21, { z: [1, 1.12], night: false, old: true, mouth: "smile" }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="21 yaş" place="Denizli · üniversite" /> },
  { c: "Ve aklına bir şey", r: (t, a, b) => desk(t, a, b, SEN21, { arms: "chin", look: 0.4, lookY: -0.4, brow: "up", z: [1.5, 1.6], c0: [960, 420], night: false, extra: <Bulb x={1300} y={240} s={0.7} t={t} on={rp(t, a + 0.6, a + 1)} /> }) },
  { c: "Denizli'de her köşede", r: (t, a, b) => atelier(t, a, b, { n: 16 }), html: (t, a) => <Big t={t} at={a + 0.5} text="Denizli: her köşede tekstil atölyesi" y={60} size={54} /> },
  { c: "Amerikalılar da pamuklu", r: (t, a, b) => board(t, a, b, <g>{[0, 1, 2].map((i) => <Pestemal key={i} x={600 + i * 360} y={500} s={1.4} rot={(i - 1) * 6} c={["#2F6FA8", "#C8302C", "#2FA5A0"][i]} />)}</g>, { bg: "#1E1A16" }), html: (t, a) => <Big t={t} at={a + 0.6} text="Peştamal" y={860} size={80} c="#FFC531" /> },
  { c: "Neden sadece dosya", r: (t, a, b) => board(t, a, b, <g><rect x={560} y={360} width={240} height={300} rx={14} fill="#FFF" />{tx(680, 540, "PDF", 60, OR, 700, "middle")}{tx(960, 540, "+", 120, "#FFF", 700, "middle")}<Pestemal x={1260} y={510} s={1.1} /></g>) },
  { c: "Mahalledeki bir atölyeden", r: (t, a, b) => atelier(t, a, b, { n: 50, z: [1.2, 1.3], c0: [960, 600], people: <><Person x={500} y={1080} s={0.8} t={t} o={USTA} arms="cross" mouth="smile" look={0.5} /><Person x={1400} y={1080} s={0.8} t={t} o={SEN21} dir={-1} arms="hold" mouth="smile" look={-0.5} /></> }), html: (t, a) => <Big t={t} at={a + 0.6} text="İlk 50 peştamal" y={60} size={60} /> },
  { c: "Biriktirdiğin bütün", r: (t, a, b) => board(t, a, b, null), html: (t, a) => <Counter t={t} a={a} from={1180} to={0} dur={1.4} prefix="$" label="birikim" y={320} c="#FF6B6B" /> },
  { c: "Annenle salonda", r: (t, a, b) => room(t, a, b, <><Person x={760} y={1060} s={0.95} t={t} o={ANNE} arms="hold" mouth="smile" look={0.5} /><Pestemal x={760} y={640} s={1} /><Person x={1320} y={1060} s={0.92} t={t} o={SEN21} dir={-1} arms="phone" mouth="tight" look={-0.5} /></>) },
  { c: "Işık için perdeleri", r: (t, a, b) => { const k = rp(t, a + 0.2, a + 1.4); return <HCam t={t} a={a} b={b} z={[1.2, 1.3]}><Salon t={t} /><rect width={1920} height={1080} fill="#FFF3D6" opacity={0.35 * k} /><rect x={0} y={0} width={lp(960, 200, k)} height={1080} fill="#7A3E3E" /><rect x={lp(960, 1720, k)} y={0} width={1920} height={1080} fill="#7A3E3E" /></HCam>; }, tone: "gold" },
  { c: "İlk ay yirmi iki", r: (t, a, b) => board(t, a, b, null), html: (t, a) => <Counter t={t} a={a} from={0} to={22} dur={1.2} label="peştamal · ilk ay" y={320} c={H.green} /> },
  { c: "Sonra bir sipariş", r: (t, a, b) => ph(t, a, b, <LockScreen time="16:40" date="Perşembe"><Notif x={0} y={0} app="Etsy" title="Büyük sipariş!" body="30 × Peştamal · Teksas, ABD" icon={OR} k={rp(t, a + 0.3, a + 0.7)} /></LockScreen>), sfx: "ding" },
  { c: "Teksas'tan bir butik", r: (t, a, b) => board(t, a, b, <g><rect x={460} y={260} width={1000} height={560} rx={30} fill="#FFF" />{tx(520, 340, "Sipariş · Butik Otel", 40, "#222", 700)}{tx(520, 400, "Teksas, ABD", 30, "#777", 600)}{Array.from({ length: 30 }, (_, i) => <g key={i} transform={`translate(${560 + (i % 10) * 88},${500 + Math.floor(i / 10) * 90})`}><rect x={-30} y={-30} width={60} height={70} fill="#F2EDE2" /><rect x={-30} y={-20} width={60} height={10} fill="#2F6FA8" opacity={cl(rp(t, a + 0.4, a + 2) * 30 - i)} /></g>)}</g>) },
  { c: "Atölyeye koşuyorsun", r: (t, a, b) => atelier(t, a, b, { n: 30, z: [1.4, 1.1], c0: [400, 600], c1: [1500, 560] }) },
  // ── GÜMRÜK
  { c: "Paket yola çıkıyor", r: (t, a, b) => board(t, a, b, route(t, a, false, "Denizli → Teksas")) },
  { c: "Ve tam o hafta", r: (t, a, b) => scr(t, a, b, <News k={rp(t, a + 0.3, a + 1)} head="ABD: küçük paketlerde gümrük muafiyeti kaldırıldı" sub="800 doların altındaki gönderiler artık vergiye tabi." />, { z: [1.4, 1.55] }), sfx: "buzz", tone: "cool" },
  { c: "Eskiden sekiz yüz", r: (t, a, b) => board(t, a, b, <g>{tx(960, 480, "$800 altı paket", 90, "#FFF", 700, "middle")}{tx(960, 620, "VERGİSİZ", 120, H.green, 700, "middle")}<line x1={620} y1={640} x2={1300} y2={560} stroke="#E5322D" strokeWidth={16} opacity={rp(t, a + 1.6, a + 2)} /></g>) },
  { c: "Artık her pakete", r: (t, a, b) => board(t, a, b, <g><Box x={960} y={480} s={1.1} /><g transform={`translate(1180,360) rotate(-12) scale(${lp(2, 1, rp(t, a + 0.3, a + 0.6))})`} opacity={rp(t, a + 0.3, a + 0.6)}><rect x={-170} y={-60} width={340} height={120} rx={14} fill="none" stroke="#E5322D" strokeWidth={10} />{tx(0, 22, "VERGİ", 64, "#E5322D", 700, "middle")}</g></g>), sfx: "pop" },
  { c: "Ard arda mesajlar", r: (t, a, b) => ph(t, a, b, <DM name="Mesajlar · Etsy" msgs={[{ text: "Where is my order?" }, { text: "Customs is asking me to pay?" }, { text: "Package returned!" }]} k={rp(t, a, b - 0.3)} t={t} />) },
  { c: "Otelin paketi gümrükte", r: (t, a, b) => ph(t, a, b, track([["Denizli · gönderildi", true], ["İstanbul · uçağa yüklendi", true], ["ABD · gümrükte bekliyor", false, true], ["Teslim", false]], rp(t, a, a + 1.2)), { light: true }) },
  { c: "Bir başka müşteri", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 520]}><rect width={1920} height={1080} fill="#C9B79C" /><rect x={760} y={160} width={400} height={720} fill="#6E4528" /><circle cx={1110} cy={540} r={14} fill="#D4AF37" /><Box x={700} y={760} s={0.6} /><g transform="translate(1400,400) rotate(4)"><rect x={-180} y={-110} width={360} height={220} rx={10} fill="#FFF" />{tx(0, -50, "TESLİMAT", 30, "#222", 700, "middle")}{tx(0, 0, "Vergi ödemesi gerekli", 24, "#C62828", 700, "middle")}{tx(0, 60, "Alıcı: REDDETTİ", 26, "#C62828", 700, "middle")}</g></HCam> },
  { c: "Paket geri dönüyor", r: (t, a, b) => board(t, a, b, route(t, a, true, "Geri dönüş")) },
  { c: "kargo ücreti peştamalın", r: (t, a, b) => board(t, a, b, <g><Pestemal x={640} y={480} s={1.1} />{tx(640, 760, "$32", 80, "#FFF", 700, "middle")}{tx(960, 520, "<", 140, "#FF6B6B", 700, "middle")}<Box x={1280} y={460} s={0.6} />{tx(1280, 760, "Kargo: $41", 70, "#FF6B6B", 700, "middle")}</g>) },
  { c: "Mağazana ilk tek", r: (t, a, b) => scr(t, a, b, shop("yorumlar", <g>{tx(40, 50, "★☆☆☆☆", 44, "#E5322D", 700)}<Comment x={40} y={80} name="Linda, Ohio" text={"Bir daha asla."} k={rp(t, a + 0.3, a + 0.8)} ago="şimdi" c="#E86A92" w={900} /></g>), { z: [1.45, 1.6] }), sfx: "buzz", tone: "cool" },
  // ── 11 GÜN BEKLEYİŞ
  { c: "On bir gün boyunca", r: (t, a, b) => <g>{desk(t, a, b, SEN21, { arms: "phone", mouth: "tight", brow: "worry", z: [1.4, 1.55], c0: [960, 420], night: false })}</g>, html: (t, a) => <Big t={t} at={a + 0.6} text={`Gün ${Math.min(11, 1 + Math.floor(rp(t, a + 0.6, a + 3) * 10))}`} y={60} size={70} /> },
  { c: "Aynı yazı", r: (t, a, b) => ph(t, a, b, track([["Denizli · gönderildi", true], ["İstanbul · uçağa yüklendi", true], ["ABD · gümrükte bekliyor", false, true], ["Teslim", false]], 1), { light: true, z: [1.3, 1.5], c0: [960, 600] }) },
  { c: "On ikinci gün", r: (t, a, b) => ph(t, a, b, <DM name="Butik Otel · Teksas" msgs={[{ text: "📷 Fotoğraf" }]} k={1} t={t} />), sfx: "ding" },
  { c: "Peştamallar havuz başında", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.12]} c0={[960, 560]}><rect width={1920} height={1080} fill="#BFE3F2" /><rect y={560} width={1920} height={520} fill="#E8DCC4" /><rect x={200} y={640} width={1520} height={220} rx={30} fill="#3FB7D9" />{Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${240 + i * 190},${720 + Math.sin(t * 2 + i) * 6} q40,-10 80,0`} stroke="#FFF" strokeWidth={4} fill="none" opacity={0.6} />)}{[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${320 + i * 430},940)`}><rect x={-150} y={-30} width={300} height={40} rx={10} fill="#FFF" /><g transform="rotate(90) scale(0.5)"><Pestemal x={-20} y={0} c={["#2F6FA8", "#C8302C", "#2FA5A0", "#2F6FA8"][i]} /></g></g>)}</HCam>, tone: "gold" },
  { c: "Altında tek bir", r: (t, a, b) => board(t, a, b, null, { bg: "#0F1A14" }), html: (t, a) => <Big t={t} at={a + 0.4} text={"\"Worth the wait.\""} sub="Beklemeye değdi." y={400} size={110} c={H.green} /> },
  { c: "Ama sen o on", r: (t, a, b) => desk(t, a, b, SEN21, { arms: "chin", mouth: "flat", z: [1.5, 1.6], c0: [960, 420] }), html: (t, a) => <Big t={t} at={a + 1.2} text="Elinde olmayan bir karar her şeyi durdurabilir" y={790} size={48} c="#FFC531" /> },
  { c: "Üstüne Etsy'den bir", r: (t, a, b) => scr(t, a, b, <Mail from="Etsy" subject="Ödemelerin hakkında" lines={["Satışların birden arttığı için,", "paranın bir kısmını birkaç hafta bekletiyoruz."]} k={rp(t, a + 0.2, a + 1)} badge="BEKLETİLİYOR" badgeC="#E5322D" />, { z: [1.4, 1.55] }), tone: "cool" },
  { c: "Elinde ne para", r: (t, a, b) => desk(t, a, b, SEN21, { arms: "head", mouth: "sad", brow: "worry", slump: 1, z: [1.4, 1.6], c0: [960, 440] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Ne para var, ne mal" y={800} size={64} c="#FF6B6B" /> },
  // ── İKİ KARAR
  { c: "O ay iki karar", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["Fiyata\ngümrük + kargo", "ABD'de\nbaskı"], H.blue, 520, 640, 560)) },
  { c: "Birincisi: peştamalların", r: (t, a, b) => board(t, a, b, <g><Pestemal x={700} y={500} s={1.3} /><g transform="translate(1240,440)"><rect x={-200} y={-90} width={400} height={180} rx={20} fill="#FFF" />{tx(0, -10, rp(t, a + 1.2, a + 1.6) > 0.5 ? "$44" : "$32", 90, "#222", 700, "middle")}{tx(0, 60, "gümrük + kargo dahil", 24, "#777", 600, "middle")}</g></g>) },
  { c: "Satışlar yarıya düşüyor", r: (t, a, b) => board(t, a, b, <g><LineChart x={260} y={240} w={1400} h={460} pts={[1, 0.95, 0.8, 0.55, 0.5, 0.5, 0.52]} k={rp(t, a + 0.2, b - 0.2)} c="#FF6B6B" />{tx(960, 850, "★★★★★", 90, "#FFC531", 700, "middle")}</g>), html: (t, a) => <Big t={t} at={a + 1.6} text="Tek yıldızlar bitiyor" y={60} size={56} c={H.green} /> },
  { c: "İkincisi: çini desenlerin", r: (t, a, b) => board(t, a, b, <g><rect x={700} y={340} width={520} height={300} rx={20} fill="#3A3F4A" /><rect x={760} y={300} width={400} height={60} fill="#2A2E36" /><rect x={760} y={560} width={400} height={30} fill="#FFF" /><g transform={`translate(${lp(960, 1500, rp(t, a + 0.8, a + 2))},520)`}><rect x={-80} y={-100} width={160} height={200} fill="#F7F3EA" /><Iznik x={0} y={0} s={0.7} /></g>{tx(960, 760, "ABD'de baskı", 50, "#FFF", 700, "middle")}</g>) },
  { c: "Müşteri sipariş veriyor", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Müşteri\nsipariş verir", "ABD'de\nbasılır", "ABD içinde\nkargo"], H.green)) },
  { c: "Sen sadece tasarımı", r: (t, a, b) => over(t, a, b, SEN21, <g><rect width={1000} height={625} fill="#F4F2EE" /><Iznik x={500} y={320} s={2.3} /></g>, { old: false }) },
  { c: "Ne gümrük var", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Gümrük yok", "Kargo derdi yok"], H.green, 520, 640, 560)) },
  { c: "Kâr payın küçülüyor", r: (t, a, b) => board(t, a, b, <g><circle cx={960} cy={420} r={150} fill="#F4E9C8" /><circle cx={1020} cy={380} r={140} fill="#0B0E18" />{tx(960, 720, "Zzz", 120, "#9FD4FF", 700, "middle")}</g>, { bg: "#0B0E18" }), html: (t, a) => <Big t={t} at={a + 1.4} text="Uykun geri geliyor" y={850} size={60} /> },
  // ── 22: KOPYACILAR
  { c: "Yirmi iki yaşındasın", r: (t, a, b) => desk(t, a, b, SEN22, { z: [1, 1.12], night: false, old: false, mouth: "smile" }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="22 yaş" place="Denizli" /> },
  { c: "Mağaza ayda üç bin", r: (t, a, b) => board(t, a, b, null), html: (t, a) => <Counter t={t} a={a} from={140} to={3000} dur={1.4} prefix="$" label="aylık satış" y={320} c={H.green} /> },
  { c: "Ve bir gün en çok", r: (t, a, b) => scr(t, a, b, shop("iznik tulip wall art", <g><Card x={200} y={40} w={260} art={<Iznik x={0} y={0} />} title="Iznik Tulip Wall Art" price="$14" hi /><Card x={540} y={40} w={260} art={<Iznik x={0} y={0} />} title="Iznik Tulip Wall Art" price="$14" badge="KOPYA" /></g>), { z: [1.4, 1.55] }), tone: "cool" },
  { c: "Başka bir mağazada", r: (t, a, b) => board(t, a, b, <g><g transform="translate(460,200) scale(2)"><Card x={0} y={0} w={200} art={<Iznik x={0} y={0} />} title="SEN" price="$14" hi /></g><g transform="translate(1060,200) scale(2)"><Card x={0} y={0} w={200} art={<Iznik x={0} y={0} />} title="Kopyacı" price={rp(t, a + 1, a + 1.4) > 0.5 ? "$7" : "$14"} badge="KOPYA" /></g></g>), html: (t, a) => <Big t={t} at={a + 1.4} text="Yarı fiyatına" y={60} size={64} c="#FF6B6B" /> },
  { c: "Üstelik aramalarda", r: (t, a, b) => scr(t, a, b, shop("iznik tile print", <g>{tx(30, 30, "Sonuçlar", 18, "#777", 600)}<Card x={30} y={50} w={220} art={<Iznik x={0} y={0} />} title="#1 Kopyacı" price="$7" badge="KOPYA" /><Card x={290} y={50} w={220} art={<Iznik x={0} y={0} />} title="#2 Sen" price="$14" hi /></g>), { z: [1.45, 1.6], c0: [860, 460] }) },
  { c: "Sonra bir tane daha", r: (t, a, b) => scr(t, a, b, shop("iznik tile print", <g>{Array.from({ length: 10 }, (_, i) => <g key={i} opacity={cl(rp(t, a, b - 0.5) * 10 - i)}><Card x={30 + (i % 5) * 190} y={20 + Math.floor(i / 5) * 270} w={170} art={<Iznik x={0} y={0} />} title="Iznik Print" price="$7" badge="KOPYA" /></g>)}</g>), { z: [1.3, 1.45] }) },
  { c: "Tek tek şikâyet", r: (t, a, b) => over(t, a, b, SEN22, panel("Fikri mülkiyet bildirimi", <g>{tx(0, 30, "Kopyalanan ürün bağlantısı", 18, "#777", 600)}<rect x={0} y={45} width={740} height={50} rx={8} fill="#FFF" stroke="#CCC" strokeWidth={2} />{tx(0, 140, "Orijinal tasarımın", 18, "#777", 600)}<Iznik x={80} y={230} s={0.7} /><rect x={540} y={330} width={200} height={56} rx={28} fill="#222" />{tx(640, 366, "Gönder", 22, "#FFF", 700, "middle")}</g>), { old: false }) },
  { c: "Bir kısmı kaldırılıyor", r: (t, a, b) => scr(t, a, b, shop("iznik tile print", <g>{Array.from({ length: 10 }, (_, i) => <Card key={i} x={30 + (i % 5) * 190} y={20 + Math.floor(i / 5) * 270} w={170} art={<Iznik x={0} y={0} />} title="Iznik Print" price="$7" badge="KOPYA" gone={i % 3 === 1 ? 0 : rp(t, a + 0.3 + i * 0.12, a + 0.6 + i * 0.12)} />)}</g>), { z: [1.3, 1.4] }) },
  { c: "O gün anlıyorsun", r: (t, a, b) => desk(t, a, b, SEN22, { arms: "chin", look: 0.3, mouth: "tight", z: [1.5, 1.6], c0: [960, 420], old: false, night: false }), html: (t, a) => <Big t={t} at={a + 1} text="Desen kopyalanır, sen kopyalanamazsın" y={790} size={52} c="#FFC531" /> },
  { c: "Her ürünün yanına", r: (t, a, b) => board(t, a, b, <g><Iznik x={720} y={520} s={1.8} /><g transform="translate(1240,520) rotate(3)"><rect x={-260} y={-160} width={520} height={320} rx={14} fill="#F7F3EA" />{tx(0, -90, "Bu desenin hikâyesi", 30, "#1F5FA8", 700, "middle")}{tx(0, -30, "Rüstem Paşa Camii", 28, "#333", 600, "middle")}{tx(0, 20, "İstanbul · 16. yüzyıl", 26, "#555", 500, "middle")}{tx(0, 100, "Denizli'den sevgiyle", 24, "#C8302C", 600, "middle")}</g></g>, { bg: "#1E1A16" }) },
  { c: "Peştamal paketlerine", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 520]}><rect width={1920} height={1080} fill="#B89A78" /><Pestemal x={760} y={520} s={1.4} rot={-8} /><g transform="translate(1200,560) rotate(5)"><rect x={-200} y={-140} width={400} height={280} fill="#FFF8E8" />{tx(0, -40, "Thank you!", 50, "#2E3A55", 600, "middle")}{tx(0, 30, "Teşekkürler", 34, "#2E3A55", 500, "middle")}{tx(0, 100, "— Denizli", 28, "#C8302C", 500, "middle")}</g></HCam>, tone: "warm" },
  { c: "Müşteriler bunu yorumlara", r: (t, a, b) => scr(t, a, b, shop("yorumlar", <g>{tx(40, 50, "★★★★★", 40, "#FFB547", 700)}{[["Emily, Oregon", "Hikâye kartına bayıldım!"], ["Sam, Texas", "El yazısı not çok tatlı."], ["Grace, Ohio", "Desenin geçmişini öğrenmek harikaydı."]].map(([n, s], i) => <Comment key={i} x={40} y={70 + i * 130} name={n} text={s} c={["#7E5BD6", "#2E7FD8", "#3FAE6A"][i]} w={900} k={rp(t, a + 0.3 + i * 0.6, a + 0.7 + i * 0.6)} />)}</g>), { z: [1.4, 1.5] }), tone: "warm" },
  { c: "Kopyacılar deseni", r: (t, a, b) => board(t, a, b, null), html: (t, a) => <Big t={t} at={a + 0.3} text="Deseni çalabilirler, hikâyeyi değil" y={440} size={72} c="#FFC531" /> },
  // ── REKLAM KESİNTİSİ
  { c: "Bir de sürpriz bir", r: (t, a, b) => board(t, a, b, <g>{[0, 1, 2].map((i) => <g key={i} transform={`translate(${560 + i * 400},480)`}><rect x={-150} y={-150} width={300} height={300} rx={40} fill={["#4285F4", "#E1306C", "#1877F2"][i]} opacity={rp(t, a + i * 0.3, a + 0.4 + i * 0.3)} />{tx(0, 30, ["Arama", "Sosyal", "Reklam"][i], 46, "#FFF", 700, "middle")}</g>)}</g>), html: (t, a) => <Big t={t} at={a + 0.4} text="Etsy senin yerine reklam yapıyor" y={60} size={56} /> },
  { c: "O reklamdan bir satış", r: (t, a, b) => board(t, a, b, <g>{tx(960, 560, "−%15", 280, "#FF6B6B", 700, "middle")}{tx(960, 680, "site dışı reklam ücreti", 48, "#AAA", 600, "middle")}</g>) },
  { c: "Sen fark etmeden", r: (t, a, b) => desk(t, a, b, SEN22, { mouth: "o", eyes: "wide", brow: "up", z: [1.6, 1.75], c0: [960, 400], old: false, night: false }) },
  // ── MUHASEBECİ
  { c: "Para büyüdükçe", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 500]}><Studio t={t} /><Person x={640} y={1060} s={0.95} t={t} o={MUH} arms="desk" mouth="smile" talk look={0.6} /><Person x={1300} y={1060} s={0.92} t={t} o={SEN22} dir={-1} arms="down" mouth="flat" look={-0.5} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.5} text="Muhasebeci" y={60} size={70} /> },
  { c: "Şahıs şirketi açıyorsun", r: (t, a, b) => { const k = rp(t, a + 0.2, a + 1); return board(t, a, b, <Paper x={960} y={lp(1400, 540, k)} s={0.9} rot={lp(-12, -2, k)} title="ŞAHIS ŞİRKETİ" lines={["Vergi kaydı: tamam", "Her satışa fatura"]} stamp="KAYIT" />, { bg: "#1A1D24" }); } },
  { c: "atölyeden aldığın her", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${560 + i * 160},${520 + (1 - rp(t, a + i * 0.2, a + 0.4 + i * 0.2)) * 300})`}><rect x={-60} y={-200} width={120} height={400} rx={8} fill={["#2E5A8A", "#8A2E2E", "#2E8A5A"][i % 3]} /><rect x={-40} y={-140} width={80} height={60} fill="#FFF" />{tx(0, -100, "FATURA", 16, "#222", 700, "middle")}</g>)}</g>), html: (t, a) => <Big t={t} at={a + 1.2} text="Her faturayı dosyalıyorsun" y={60} size={56} /> },
  { c: "O an bu dosyalar", r: (t, a, b) => desk(t, a, b, SEN22, { eyes: "half", mouth: "flat", arms: "chin", z: [1.4, 1.5], c0: [960, 440], old: false, night: false }), html: (t, a) => <Big t={t} at={a + 0.6} text="Şimdilik sadece bir yük…" y={800} size={56} /> },
  { c: "Ama bir iyi haber", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[640, 420]}><Studio t={t} /><Person x={640} y={1060} s={0.95} t={t} o={MUH} arms="wave" mouth="grin" talk look={0.6} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.8} text="İyi bir haber" y={760} size={64} c={H.green} /> },
  { c: "Yirmi dokuz yaşından", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["29 yaş\naltı", "İlk kez\niş kuran"], H.green, 480, 640, 560), { bg: "#0F1A14" }), html: (t, a) => <Big t={t} at={a + 1.6} text="Genç girişimci istisnası" y={830} size={64} c={H.green} /> },
  { c: "İlk üç yıl", r: (t, a, b) => board(t, a, b, <g>{[0, 1, 2].map((i) => <g key={i}>{cal(t, a + i * 0.3, "YIL", String(i + 1), "vergi avantajı", 560 + i * 400, 500, 0.7)}</g>)}</g>), html: (t, a) => <Big t={t} at={a + 1.4} text="Kazancın belli bir kısmı gelir vergisinden muaf" y={860} size={46} /> },
  { c: "Muhasebeci bunu söyleyince", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.75]} c0={[1300, 420]}><Studio t={t} /><Person x={1300} y={1060} s={0.95} t={t} o={SEN22} dir={-1} arms="down" mouth="grin" look={-0.4} /></HCam>, tone: "warm" },
  // ── 24
  { c: "Yirmi dört yaşındasın", r: (t, a, b) => room(t, a, b, <><Person x={960} y={1060} s={0.95} t={t} o={SEN22} arms="down" mouth="smile" /></>), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="24 yaş" place="Mezun" /> },
  { c: "Annen artık dolandırıcılıktan", r: (t, a, b) => room(t, a, b, <><Person x={960} y={1060} s={1} t={t} o={ANNE} arms="hold" mouth="smile" eyes="half" /><Pestemal x={960} y={700} s={0.8} rot={90} /><g transform="translate(1400,860)">{[0, 1, 2, 3, 4].map((i) => <rect key={i} x={-120} y={-i * 34} width={240} height={30} fill="#F2EDE2" stroke="#2F6FA8" strokeWidth={4} />)}</g></>, { z: [1.3, 1.4], c0: [1050, 520] }) },
  { c: "Ablan Instagram'ı", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 420]}><Salon t={t} /><Person x={960} y={1060} s={1} t={t} o={ABLA} arms="phone" mouth="smile" lookY={0.8} /></HCam> },
  { c: "Kuzeninin o cümlesi", r: (t, a, b) => board(t, a, b, null, { bg: "#0B0E18" }), html: (t, a) => <Big t={t} at={a + 0.4} text={"\"Hem de ben uyurken.\""} y={440} size={90} c="#9FD4FF" /> },
  { c: "Ama gerçek şu", r: (t, a, b) => desk(t, a, b, SEN22, { eyes: "half", mouth: "flat", slump: 0.6, z: [1.4, 1.55], c0: [960, 420], old: false }), tone: "cool" },
  { c: "Amerika uyanınca", r: (t, a, b) => board(t, a, b, <g><Clock x={640} y={480} s={1.1} h={1} m={0} /><Clock x={1280} y={480} s={1.1} h={18} m={0} />{tx(640, 720, "Denizli 01:00", 46, "#FFF", 700, "middle")}{tx(1280, 720, "New York 17:00", 46, "#FFF", 700, "middle")}</g>) },
  { c: "Gece birde bir", r: (t, a, b) => ph(t, a, b, <DM name="Müşteri · Florida" msgs={[{ text: "Hi! Can I change my address?" }, { me: true, text: "Sure, send me the new one." }]} k={rp(t, a, b - 0.4)} t={t} />, { c0: [960, 560] }) },
  { c: "Sabah sekizde bir", r: (t, a, b) => ph(t, a, b, <DM name="Müşteri · Oregon" msgs={[{ text: "Is the blue darker in real life?" }]} k={rp(t, a, b - 0.4)} typing t={t} />, { rot: 3 }) },
  // ── 25: FIRTINA
  { c: "Yirmi beş yaşındasın", r: (t, a, b) => room(t, a, b, <><Person x={960} y={1060} s={0.95} t={t} o={SEN25} arms="down" mouth="smile" /></>, { extra: <g>{Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 197) % 1920} cy={(i * 77 + t * 60) % 600} r={4} fill="#FFF" opacity={0.4} />)}</g> }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="25 yaş" place="Aralık" /> },
  { c: "Bu senin en büyük", r: (t, a, b) => scr(t, a, b, panel("Panel", <g>{stat(0, 0, "Sipariş (Aralık)", fmt(lp(80, 340, rp(t, a, b))), H.green)}{stat(260, 0, "Ürün", "460")}{stat(520, 0, "Yorum", "★ 4,9")}<LineChart x={0} y={150} w={760} h={300} pts={[0.1, 0.12, 0.15, 0.2, 0.3, 0.5, 0.75, 1]} k={rp(t, a, b)} c={OR} /></g>), { z: [1.35, 1.5] }) },
  { c: "Salonda üç yüz kırk", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.05, 1.15]} c0={[960, 560]}><Salon t={t} />{Array.from({ length: 24 }, (_, i) => <g key={i} transform={`translate(${300 + (i % 8) * 180},${980 - Math.floor(i / 8) * 130})`}><Box x={0} y={0} s={0.3} /></g>)}</HCam>, html: (t, a) => <Counter t={t} a={a} from={0} to={340} dur={1.4} label="sipariş bekliyor" y={120} c="#FFF" /> },
  { c: "Atölyeye bütün birikimini", r: (t, a, b) => atelier(t, a, b, { n: 40, z: [1.1, 1.2] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Bütün birikim: atölyeye" y={60} size={60} c="#FFB547" /> },
  { c: "Ve yılbaşından tam", r: (t, a, b) => board(t, a, b, <g>{cal(t, a, "ARALIK", "28", "Yılbaşına 4 gün")}</g>, { bg: "#1A0E10" }), tone: "cool" },
  { c: "sabah altıda telefonuna", r: (t, a, b) => ph(t, a, b, <LockScreen time="06:00" date="Pazartesi" bg="#2A1418"><Notif x={0} y={0} app="Etsy" title="Mağazan hakkında önemli" body="Hesabınla ilgili bir işlem yapıldı." icon="#E5322D" k={rp(t, a + 0.4, a + 0.9)} /></LockScreen>, { z: [1.1, 1.35] }), sfx: "buzz", tone: "cool" },
  { c: "O kırmızı yazı", r: (t, a, b) => scr(t, a, b, suspended(rp(t, a + 0.4, a + 0.9)), { z: [1.5, 2.1], c0: [960, 520] }), sfx: "buzz", tone: "cool" },
  { c: "Bütün ürünlerin bir anda", r: (t, a, b) => scr(t, a, b, shop("Mağaza", <g>{Array.from({ length: 10 }, (_, i) => <g key={i} opacity={1 - rp(t, a + 0.2 + i * 0.12, a + 0.5 + i * 0.12)}><Card x={30 + (i % 5) * 190} y={20 + Math.floor(i / 5) * 270} w={170} art={i % 2 ? <Iznik x={0} y={0} /> : <Pestemal x={0} y={0} s={0.55} />} title="İznik / Peştamal" price="$14" /></g>)}{tx(500, 280, "Bu mağaza şu anda kullanılamıyor.", 26, "#777", 600, "middle")}</g>), { z: [1.35, 1.5] }), tone: "cool" },
  { c: "Hesabındaki paraya", r: (t, a, b) => scr(t, a, b, panel("Finans", <g>{stat(0, 0, "Bakiye", "$8.420", "#999")}<g transform="translate(400,180)"><rect x={-60} y={-10} width={120} height={100} rx={14} fill="#E5322D" /><path d="M-36,-10 L-36,-50 A36,36 0 0,1 36,-50 L36,-10" stroke="#E5322D" strokeWidth={16} fill="none" /></g>{tx(400, 340, "Ödemeler durduruldu", 30, "#C62828", 700, "middle")}</g>), { z: [1.4, 1.55] }), tone: "cool" },
  { c: "Etsy senden belgeler", r: (t, a, b) => board(t, a, b, <g>{["Kimlik", "Adres belgesi", "Ürünlerin faturaları"].map((s, i) => <g key={s} opacity={rp(t, a + 0.4 + i * 0.6, a + 0.8 + i * 0.6)}><rect x={560} y={300 + i * 150} width={800} height={120} rx={20} fill="#1A1E27" /><rect x={600} y={330 + i * 150} width={60} height={60} rx={10} fill="none" stroke="#FFF" strokeWidth={5} />{tx(700, 380 + i * 150, s, 46, "#FFF", 700)}</g>)}</g>) },
  { c: "Süre: yetmiş iki", r: (t, a, b) => board(t, a, b, countdown(t, a, 72, 71.99, "kalan süre"), { bg: "#140B0D" }), tone: "cool" },
  { c: "Ellerin titriyor", r: (t, a, b) => desk(t, a, b, SEN25, { arms: "type", mouth: "tight", brow: "worry", eyes: "wide", z: [1.5, 1.6], c0: [960, 440], old: false, shake: 1 }), tone: "cool" },
  { c: "Sonra dolabı açıyorsun", r: (t, a, b) => { const k = rp(t, a + 0.2, a + 1.2); return <HCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 520]}><rect width={1920} height={1080} fill="#2A2420" /><rect x={560} y={140} width={800} height={800} fill="#4A3B2E" />{Array.from({ length: 12 }, (_, i) => <g key={i} transform={`translate(${620 + (i % 6) * 120},${200 + Math.floor(i / 6) * 360})`}><rect width={100} height={320} rx={6} fill={["#2E5A8A", "#8A2E2E", "#2E8A5A"][i % 3]} /><rect x={20} y={40} width={60} height={50} fill="#FFF" /></g>)}<rect x={560} y={140} width={400 * (1 - k)} height={800} fill="#6E4528" /><rect x={960 + 400 * k} y={140} width={400 * (1 - k)} height={800} fill="#6E4528" /></HCam>; }, html: (t, a) => <Big t={t} at={a + 1.4} text="O sıkıcı klasörler" y={60} size={64} c="#FFC531" />, tone: "gold" },
  { c: "Atölyeden aldığın her", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 5 }, (_, i) => <g key={i} transform={`translate(${960 + (i - 2) * 40},${520 + (i - 2) * 30}) rotate(${(i - 2) * 4})`}><Paper x={0} y={0} s={0.6} title="FATURA" lines={[`Atölye · ${i + 1}. sipariş`, "Peştamal × 50"]} /></g>)}</g>), html: (t, a) => <Big t={t} at={a + 1} text="Tek tek, tarih sırasıyla" y={870} size={56} /> },
  { c: "Gece üçe kadar", r: (t, a, b) => over(t, a, b, SEN25, <g><rect width={1000} height={625} fill="#F7F7F5" />{tx(40, 60, "Belgeleri yükle", 30, "#222", 700)}{Array.from({ length: 8 }, (_, i) => <g key={i} opacity={cl(rp(t, a, b - 0.4) * 8 - i)}><rect x={40} y={90 + i * 60} width={920} height={48} rx={8} fill="#FFF" stroke="#DDD" />{tx(60, 122 + i * 60, `fatura_${i + 1}.pdf`, 20, "#333", 500)}{tx(940, 122 + i * 60, "✓", 24, H.green, 700, "end")}</g>)}</g>, { old: false }), html: (t, a) => <Big t={t} at={a + 0.4} text="Gece 03:00" y={60} size={60} /> },
  { c: "Bir gün geçiyor", r: (t, a, b) => board(t, a, b, countdown(t, a, 48, 47.99, "kalan süre · cevap yok"), { bg: "#140B0D" }), tone: "cool" },
  { c: "Annen salonda koliler", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 500]}><Salon t={t} />{Array.from({ length: 16 }, (_, i) => <g key={i} transform={`translate(${300 + (i % 8) * 180},${1000 - Math.floor(i / 8) * 130})`}><Box x={0} y={0} s={0.3} /></g>)}<Person x={960} y={1000} s={0.85} t={t} o={ANNE} arms="cross" brow="worry" mouth="tight" talk={t > a + 1.2} look={0.4} />{bub(t, a + 1.4, 960, 260, "Gönderelim mi, beklesek mi?", 38)}</HCam> },
  { c: "Siparişlerin parası", r: (t, a, b) => board(t, a, b, <g>{tx(960, 500, "$8.420", 200, "#888", 700, "middle")}<g transform="translate(960,700)"><rect x={-60} y={-10} width={120} height={100} rx={14} fill="#E5322D" /><path d="M-36,-10 L-36,-50 A36,36 0 0,1 36,-50 L36,-10" stroke="#E5322D" strokeWidth={16} fill="none" /></g></g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Para Etsy'de · mağaza kapalı" y={60} size={56} c="#FF6B6B" /> },
  { c: "Ama bu müşteriler", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 560]}><rect width={1920} height={1080} fill="#1E2A22" /><path d="M960,160 L1200,760 L720,760Z" fill="#2E6B45" /><rect x={930} y={760} width={60} height={100} fill="#5E4030" />{[0, 1, 2].map((i) => <g key={i} transform={`translate(${760 + i * 200},900)`}><rect x={-70} y={-60} width={140} height={120} fill={["#C8302C", "#2F6FA8", "#E8B400"][i]} /><rect x={-10} y={-60} width={20} height={120} fill="#FFF" /></g>)}{Array.from({ length: 10 }, (_, i) => <circle key={i} cx={800 + (i * 37) % 320} cy={300 + i * 45} r={10} fill={["#FFD36A", "#FF6B6B", "#9FD4FF"][i % 3]} opacity={0.6 + 0.4 * Math.sin(t * 4 + i)} />)}</HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="Yılbaşı hediyesi olarak bekliyorlar" y={60} size={56} />, tone: "warm" },
  { c: "Kararı veriyorsun", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 400]}><Salon t={t} /><Person x={960} y={1060} s={1} t={t} o={SEN25} arms="cross" mouth="tight" brow="angry" talk={t > a + 0.8} /></HCam>, html: (t, a) => <Big t={t} at={a + 1} text={"\"Gönderiyoruz.\""} y={800} size={90} c="#FFC531" /> },
  { c: "Bütün gece paket", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 520]}><Salon t={t} /><rect width={1920} height={1080} fill="#0B0E18" opacity={0.4} /><Person x={700} y={1060} s={0.9} t={t} o={ANNE} arms="hold" mouth="tight" eyes="half" look={0.3} /><Person x={1250} y={1060} s={0.9} t={t} o={SEN25} dir={-1} arms="hold" mouth="tight" look={-0.3} />{Array.from({ length: 10 }, (_, i) => <g key={i} transform={`translate(${200 + i * 170},960)`}><Box x={0} y={0} s={0.25} /></g>)}<Clock x={1700} y={200} s={0.5} h={2} m={0} spin={rp(t, a, b) * 2} /></HCam> },
  { c: "İkinci gün", r: (t, a, b) => board(t, a, b, countdown(t, a, 24, 23.99, "kalan süre · hâlâ cevap yok"), { bg: "#140B0D" }), html: (t, a) => <Big t={t} at={a + 0.4} text="Cevap yok" y={60} size={64} c="#FF6B6B" />, tone: "cool" },
  { c: "Üçüncü günün sabahı", r: (t, a, b) => ph(t, a, b, <LockScreen time="07:00" date="Çarşamba"><Notif x={0} y={0} app="Etsy" title="Mağazan yeniden aktif" body="Belgelerin onaylandı." icon={H.green} k={rp(t, a + 1, a + 1.5)} /></LockScreen>, { z: [1.1, 1.35] }), sfx: "ding" },
  { c: "Mağazan yeniden aktif", r: (t, a, b) => scr(t, a, b, panel("Panel", <g>{stat(0, 0, "Mağaza", "AKTİF", H.green)}{stat(260, 0, "Ödemeler", "Açık", H.green)}</g>, { c: H.green, text: "✓ Mağazan yeniden aktif · belgelerin onaylandı", k: rp(t, a + 0.2, a + 0.7) }), { z: [1.4, 1.55] }), tone: "gold" },
  { c: "O sabah, hayatında", r: (t, a, b) => room(t, a, b, <><Person x={760} y={1060} s={0.95} t={t} o={ANNE} arms="wave" mouth="grin" eyes="closed" look={0.4} /><Person x={1200} y={1060} s={0.95} t={t} o={SEN25} dir={-1} arms="wave" mouth="grin" eyes="closed" look={-0.4} /></>, { z: [1.25, 1.35] }), tone: "gold" },
  { c: "Ay sonunda satış", r: (t, a, b) => board(t, a, b, null, { bg: "#0F1A14" }), html: (t, a) => <Counter t={t} a={a} from={0} to={10000} dur={2.2} prefix="$" label="Aralık cirosu" y={320} c={H.green} />, sfx: "ding", tone: "gold" },
  { c: "Ama dikkat", r: (t, a, b) => board(t, a, b, <g>{tx(960, 520, "Ciro ≠ cebine kalan", 110, "#FFC531", 700, "middle")}</g>) },
  { c: "Etsy'nin kesintileri", r: (t, a, b) => { const items = ["Etsy", "Reklam", "Baskı", "Atölye", "Kargo", "Muhasebe", "Vergi"]; let v = 1; return board(t, a, b, <g>{tx(260, 220, "$10.000", 50, "#FFF", 700)}{items.map((s, i) => { const k = rp(t, a + 0.3 + i * 0.5, a + 0.6 + i * 0.5); const d = [0.16, 0.08, 0.14, 0.18, 0.1, 0.03, 0.06][i] * k; v -= d; return <g key={s}><rect x={260} y={260 + i * 80} width={1400 * v} height={56} rx={10} fill={i === items.length - 1 ? H.green : "#3A4458"} />{tx(280 + 1400 * v, 300 + i * 80, `− ${s}`, 30, "#FF6B6B", 700)}</g>; })}</g>); } },
  { c: "Hepsi düşünce", r: (t, a, b) => board(t, a, b, <g><rect x={460} y={420} width={1000} height={120} rx={20} fill="#2A2E38" /><rect x={460} y={420} width={1000 * lp(1, 0.25, rp(t, a + 0.2, a + 1.4))} height={120} rx={20} fill={H.green} />{tx(960, 680, "Elinde kalan: bir kısmı", 60, "#FFF", 700, "middle")}</g>) },
  { c: "Yine de hayatında", r: (t, a, b) => desk(t, a, b, SEN25, { mouth: "smile", eyes: "half", z: [1.4, 1.55], c0: [960, 420], old: false, night: false }), tone: "warm" },
  { c: "O akşam dolaptan", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.4]} c0={[960, 560]}><Salon t={t} /><rect y={760} width={1920} height={320} fill="#6E4528" /><Laptop x={960} y={540} s={0.7} old t={t} on={rp(t, a + 1.4, b)}><rect width={1000} height={625} fill="#0A2A5A" />{tx(500, 300, "Başlatılıyor…", 40, "#FFF", 600, "middle")}<circle cx={500} cy={380} r={30} fill="none" stroke="#FFF" strokeWidth={6} strokeDasharray="40 150" transform={`rotate(${t * 300} 500 380)`} /></Laptop></HCam>, tone: "warm" },
  { c: "Açılması hâlâ", r: (t, a, b) => board(t, a, b, <Clock x={960} y={480} s={1.5} h={8} m={0} spin={rp(t, a, b) * 0.15} />), html: (t, a) => <Big t={t} at={a + 0.4} text="Hâlâ 3 dakika" y={830} size={60} /> },
  { c: "Etsy'deki ilk siparişini", r: (t, a, b) => scr(t, a, b, panel("Siparişler · en eski", <g><rect width={760} height={160} rx={12} fill="#FFF" stroke={OR} strokeWidth={3} /><Planner x={80} y={80} s={0.6} />{tx(170, 60, "Sipariş #1 · Günlük Planlayıcı", 26, "#222", 700)}{tx(170, 110, "Ohio, ABD · 6 yıl önce", 22, "#777", 500)}{tx(740, 110, "$3,00", 34, "#222", 700, "end")}</g>), { old: true, z: [1.5, 1.9], c0: [960, 420] }), tone: "warm" },
  { c: "Üç dolar", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2, 2.2]} c0={[960, 380]}><Salon t={t} /><Person x={960} y={1060} s={1} t={t} o={SEN25} arms="desk" mouth="smile" eyes="half" lookY={0.8} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.2} text="$3" y={780} size={130} c="#FFC531" />, tone: "warm" },
  // ── KARAR
  { c: "Peki, Türkiye'den Etsy'de", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.15]}><Studio t={t} night /><Person x={960} y={1060} s={0.95} t={t} o={SEN25} arms="cross" mouth="flat" talk={t > a + 2} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="Gerçekten değer mi?" y={70} size={84} c="#FFC531" /> },
  { c: "Başlamak için neredeyse", r: (t, a, b) => board(t, a, b, <g>{tx(960, 520, "$0,20", 240, H.green, 700, "middle")}{tx(960, 640, "ürün başı listeleme · dijital ürünle başla", 42, "#AAA", 600, "middle")}</g>) },
  { c: "Ama ilk satış", r: (t, a, b) => board(t, a, b, <g>{[0, 1, 2].map((i) => <g key={i}>{cal(t, a + i * 0.3, "AY", String(i + 1), "0 satış?", 560 + i * 400, 500, 0.7)}</g>)}</g>) },
  { c: "Ve küçük satışlarda", r: (t, a, b) => board(t, a, b, feeBoard(t, a - 3)) },
  { c: "En büyük avantajın", r: (t, a, b) => board(t, a, b, <g>{tx(700, 560, "$ ↑", 220, H.green, 700, "middle")}{tx(1260, 560, "₺", 220, "#FFF", 700, "middle")}{tx(700, 700, "kazan", 50, "#AAA", 600, "middle")}{tx(1260, 700, "harca", 50, "#AAA", 600, "middle")}</g>) },
  { c: "En büyük düşmanların", r: (t, a, b) => scr(t, a, b, suspended(rp(t, a + 0.8, a + 1.3)), { z: [1.3, 1.5] }), html: (t, a) => <Big t={t} at={a + 0.2} text="Düşman 1: kapanan mağaza" y={60} size={60} c="#FF6B6B" />, tone: "cool" },
  { c: "değişen gümrük", r: (t, a, b) => board(t, a, b, <g><Box x={960} y={480} s={1.1} /><g transform="translate(1180,360) rotate(-12)"><rect x={-170} y={-60} width={340} height={120} rx={14} fill="none" stroke="#E5322D" strokeWidth={10} />{tx(0, 22, "VERGİ", 64, "#E5322D", 700, "middle")}</g></g>), html: (t, a) => <Big t={t} at={a + 0.2} text="Düşman 2: gümrük kuralları" y={60} size={60} c="#FF6B6B" /> },
  { c: "yapay zekâyla aynı", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 66 }, (_, i) => <rect key={i} x={60 + (i % 11) * 165} y={200 + Math.floor(i / 11) * 135} width={150} height={120} rx={6} fill={["#E8C4A8", "#C8D8C0", "#D8C0C8"][i % 3]} opacity={cl(rp(t, a, a + 1.5) * 11 - i / 6)} />)}</g>), html: (t, a) => <Big t={t} at={a + 0.2} text="Düşman 3: yapay zekâ" y={60} size={60} c="#FF6B6B" /> },
  { c: "sezon bitince çöken", r: (t, a, b) => board(t, a, b, <LineChart x={260} y={240} w={1400} h={560} pts={[0.12, 0.2, 0.45, 1, 0.14, 0.12]} k={rp(t, a + 0.2, b - 0.2)} c={OR} />), html: (t, a) => <Big t={t} at={a + 0.2} text="Düşman 4: sezon sonu" y={60} size={60} c="#FF6B6B" /> },
  { c: "Ve bu hikâyenin", r: (t, a, b) => board(t, a, b, <g>{[0, 1, 2].map((i) => <g key={i} transform={`translate(${800 + i * 160},520)`}><rect x={-60} y={-200} width={120} height={400} rx={8} fill={["#2E5A8A", "#8A2E2E", "#2E8A5A"][i]} /><rect x={-40} y={-140} width={80} height={60} fill="#FFF" /></g>)}</g>), html: (t, a) => <Big t={t} at={a + 0.8} text="Bütün belgelerin her zaman hazır olsun" y={850} size={56} c="#FFC531" /> },
  { c: "Kimler için", r: (t, a, b) => desk(t, a, b, SEN25, { bg: "studio", arms: "desk", mouth: "smile", z: [1.3, 1.4], old: false, lookY: 0 }), html: (t, a) => <Big t={t} at={a + 0.6} text="Kimler için?" y={60} size={84} c="#FFC531" /> },
  { c: "biraz İngilizce bilen", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Tasarla /\nüret", "Biraz\nİngilizce", "Kendi\nköşen"], H.green)) },
  { c: "Herkesin sattığını", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 24 }, (_, i) => <g key={i} transform={`translate(${260 + (i % 8) * 200},${300 + Math.floor(i / 8) * 220})`}><Planner x={0} y={0} s={0.7} /></g>)}<line x1={200} y1={200} x2={1720} y2={880} stroke="#E5322D" strokeWidth={18} opacity={rp(t, a + 0.6, a + 1)} /></g>) },
  { c: "Zorluk: ondan yedi", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.05]}><rect width={1920} height={1080} fill="#0E1016" /></HCam>, html: (t, a) => <Verdict t={t} a={a} rows={[["Zorluk", 7], ["Sermaye", 3], ["Sabır", 8]]} title="Türkiye'den Etsy'de satış" /> },
  { c: "Şimdi sıra sende", r: (t, a, b) => { const msg = "Ben ... işine başlamak istiyorum"; const n = Math.floor(rp(t, a + 2.5, a + 5) * msg.length); return board(t, a, b, <g transform="translate(960,460)"><rect x={-680} y={-170} width={1360} height={340} rx={30} fill="#1A1E27" /><circle cx={-560} cy={-60} r={56} fill={H.red} />{tx(-470, -60, "Yorum ekle…", 40, "#AAA", 600)}{tx(-470, 20, msg.slice(0, n) + (Math.floor(t * 3) % 2 ? "|" : ""), 44, "#FFF", 600)}<rect x={380} y={80} width={240} height={66} rx={33} fill={H.blue} />{tx(500, 124, "YORUM", 30, "#000", 700, "middle")}</g>); }, html: (t, a) => <Big t={t} at={a + 0.8} text="İnternette hangi işi yaptın?" y={70} size={64} c="#FFC531" /> },
  { c: "Sıradaki işleri", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["Senin\nyorumun", "Sıradaki\niş", "Bütün\nyolu"], H.blue)), html: (t, a) => <SubBtn t={t} at={a + 2} /> },
];

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K6_02_SECONDS));
  return raw;
})();

export const K6Video02: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const fadeIn = rp(t, 0, 0.4);
  const cutFlash = 1 - rp(t, s.from, s.from + 0.12);
  const fadeOut = 1 - rp(t, K6_02_SECONDS - 1.5, K6_02_SECONDS);
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
      <Audio src={staticFile("audio/k6-02.wav")} />
      {TIMED.map((x, i) => i > 0 && x.to < K6_02_SECONDS - 15 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.sfx === "knock" ? 0.08 : x.sfx ? 0.15 : 0.07} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
