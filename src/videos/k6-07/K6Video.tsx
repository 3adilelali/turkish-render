import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k6-07-words.json";
import { makeCue } from "../../lib/cues";
import { Atmos, Sweep, Tone } from "../../components/Live";
import { ANNE, AgeTag, Big, Counter, Door, H, HArms, HBrow, HCam, HFrame, HMouth, Look, News, Paper, Person, Phone, Progress, SubBtn, TeaGlass, Verdict, cl, lp, rp } from "../../components/Hayat";
import { Defter } from "../../components/HayatCarsi";
import { KoyEvi } from "../../components/HayatKoy";
import { act } from "../../components/Motion";
import {
  Banknot, Bozuk, CabPOV, Dolmus, Durak, EMRE, GENC, GoldWatch, Hand, KAPORTACI, KEMAL, Kulube, LpgPompa, Metrobus, Nazar, Oda, Plaka, RIZA,
  RoadKind, SEN27, Skyline, Sokak, TAKIM, Taksi, Taksimetre, Tokmak, Tomar, ViralScreen, Windshield, YEL, Zarf,
} from "../../components/HayatTaksi";

// Kanal 4 · k6-07 · "Başkasının Taksisini Sürsen, Ay Sonunda Cebinde Ne Kalır?"
// Ses: Gemini TTS (Achird, gemini-3.8-flash-tts), 4 parça; kelime zamanları faster-whisper. Sıkıştırıldı (tighten).

const W = words as { text: string; start: number; end: number }[];
const cue = makeCue(W);
const VOICE_END = W[W.length - 1].end;
export const K6_07_SECONDS = Math.ceil(VOICE_END + 4);
type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string | string[]; r: R; html?: R; sfx?: string; tone?: Tone };

const UI = "Poppins";
const tx = (x: number, y: number, s: string, size = 24, c = "#FFF", w = 600, anchor: "start" | "middle" | "end" = "start") => <text x={x} y={y} fontFamily={UI} fontWeight={w} fontSize={size} fill={c} textAnchor={anchor}>{s}</text>;
type Z = { z?: [number, number]; c0?: [number, number]; c1?: [number, number] };

// genç hâlleri (geri dönüş)
const RIZA_G: Look = { ...RIZA, hair: "#2A1C15", top: "#6B5B4A", top2: "#56483A" };
const KEMAL_G: Look = { ...KEMAL, hairStyle: "short", hair: "#2A1C15", glasses: false, beard: 0.2 };
const DRIVER: Look = { hairStyle: "short", hair: "#555", top: "#3E4B3A", top2: "#2F3A2C", kind: "jacket", mustache: true, beard: 0.6 };

// ───────── sahne yardımcıları
type PP = { o: Look; x: number; y?: number; s?: number; arms?: HArms; mouth?: HMouth; brow?: HBrow; eyes?: "open" | "wide" | "closed" | "half"; look?: number; lookY?: number; talk?: boolean; hold?: React.ReactNode; slump?: number; tilt?: number; seed?: number; dir?: 1 | -1 };
const P = (t: number, p: PP) => <Person key={p.x} x={p.x} y={p.y ?? 1090} s={p.s ?? 0.9} t={t} o={p.o} arms={p.arms ?? "down"} mouth={p.mouth ?? "flat"} brow={p.brow} eyes={p.eyes} look={p.look ?? 0} lookY={p.lookY ?? 0} talk={p.talk} hold={p.hold} slump={p.slump} tilt={p.tilt} seed={p.seed ?? p.x} dir={p.dir} />;

const ws = (t: number, a: number, b: number, p: Partial<React.ComponentProps<typeof Windshield>> & Z = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1.05, 1.15]} c0={p.c0 ?? [960, 560]} c1={p.c1}><Windshield t={t} o={p.o ?? SEN27} {...p} /></HCam>
);
const pov = (t: number, a: number, b: number, p: { road?: RoadKind; meter?: number; meterOn?: boolean; crack?: number; drift?: number; truck?: number; speed?: number; radio?: string; lids?: number; head?: boolean } & Z = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.07]} c0={p.c0} c1={p.c1} k={0.7}><CabPOV t={t} {...p} /></HCam>
);
const kul = (t: number, a: number, b: number, people: PP[], p: { night?: boolean; extra?: React.ReactNode } & Z = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1.08, 1.18]} c0={p.c0 ?? [960, 560]} c1={p.c1}><Kulube t={t} night={p.night} people={<>{people.map((x) => P(t, x))}{p.extra}</>} /></HCam>
);
const dur = (t: number, a: number, b: number, people: PP[], p: { night?: boolean; dawn?: boolean; cars?: number; extra?: React.ReactNode } & Z = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.08]} c0={p.c0} c1={p.c1}><Durak t={t} night={p.night} dawn={p.dawn} cars={p.cars} />{people.map((x) => P(t, x))}{p.extra}</HCam>
);
const sok = (t: number, a: number, b: number, people: React.ReactNode, p: { rain?: boolean; night?: boolean; signs?: string[] } & Z = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.08]} c0={p.c0} c1={p.c1}><Sokak t={t} rain={p.rain} night={p.night} signs={p.signs} people={people} /></HCam>
);
const oda = (t: number, a: number, b: number, people: PP[], p: { extra?: React.ReactNode } & Z = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1.1, 1.2]} c0={p.c0 ?? [960, 560]} c1={p.c1}><Oda t={t} people={<>{p.extra}{people.map((x) => P(t, x))}</>} /></HCam>
);
const board = (t: number, a: number, b: number, children: React.ReactNode, p: { bg?: string } & Z = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.06]} k={0.5} c0={p.c0} c1={p.c1}>
    <rect width={1920} height={1080} fill={p.bg ?? "#10131A"} />
    {Array.from({ length: 20 }, (_, i) => <line key={i} x1={i * 100} x2={i * 100} y1={0} y2={1080} stroke="#FFF" opacity={0.025} />)}
    {children}
  </HCam>
);
const ph = (t: number, a: number, b: number, screen: React.ReactNode, bg: React.ReactNode, p: { light?: boolean; rot?: number } & Z = {}) => {
  const by = Math.sin(t * 1.4) * 6;
  return (
    <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.08]} c0={p.c0} c1={p.c1}>
      <g style={{ filter: "blur(9px)" }}>{bg}</g>
      <rect width={1920} height={1080} fill="#000" opacity={0.35} />
      <g transform={`translate(0,${by})`}>
        <Phone x={960} y={560} s={1.18} rot={p.rot ?? -3} light={p.light}>{screen}</Phone>
        {[-1, 1].map((d) => <g key={d}><path d={`M${960 + d * 250},${1180} Q${960 + d * 260},${900} ${960 + d * 215},${760}`} stroke={H.skin} strokeWidth={90} strokeLinecap="round" fill="none" /><ellipse cx={960 + d * 222} cy={720} rx={34} ry={60} fill={H.skin2} /></g>)}
      </g>
    </HCam>
  );
};
const cards = (t: number, a: number, items: string[], c = H.red, y = 520, gap = 560, w = 500) => (
  <g>{items.map((s, i) => { const k = rp(t, a + i * 0.6, a + i * 0.6 + 0.4); const x = 960 + (i - (items.length - 1) / 2) * gap; return <g key={i} transform={`translate(${x},${y + (1 - k) * 60})`} opacity={k}><rect x={-w / 2} y={-150} width={w} height={300} rx={26} fill="#1A1E27" stroke={c} strokeWidth={4} /><circle cx={0} cy={-80} r={40} fill={c} />{tx(0, -66, String(i + 1), 44, "#FFF", 700, "middle")}{s.split("\n").map((l, j) => <g key={j}>{tx(0, 30 + j * 52, l, 40, "#FFF", 700, "middle")}</g>)}</g>; })}</g>
);
const cal = (t: number, a: number, top: string, big: string, sub?: string, x = 960, y = 520, s = 1) => {
  const k = rp(t, a, a + 0.5);
  return (
    <g transform={`translate(${x},${y + (1 - k) * 40}) scale(${s})`} opacity={k}>
      <rect x={-230} y={-250} width={460} height={500} rx={24} fill="#FFF" />
      <rect x={-230} y={-250} width={460} height={120} rx={24} fill={H.red} /><rect x={-230} y={-160} width={460} height={30} fill={H.red} />
      {tx(0, -170, top, 50, "#FFF", 700, "middle")}
      {tx(0, 80, big, big.length > 4 ? 110 : 170, "#1C1C1C", 700, "middle")}
      {sub && tx(0, 190, sub, 36, "#777", 600, "middle")}
      {[-130, 130].map((xx) => <rect key={xx} x={xx - 10} y={-280} width={20} height={60} rx={10} fill="#555" />)}
    </g>
  );
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
// kurye motoru (yandan)
const Moto: React.FC<{ x: number; y: number; s?: number; t: number; rot?: number; rider?: boolean }> = ({ x, y, s = 1, t, rot = 0, rider = true }) => (
  <g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`}>
    {[-170, 170].map((cx) => <g key={cx} transform={`translate(${cx},-60)`}><circle r={60} fill="#151515" /><circle r={30} fill="#888" /><rect x={-3} y={-28} width={6} height={56} fill="#555" transform={`rotate(${t * 500})`} /></g>)}
    <path d="M-200,-90 L-60,-110 L40,-180 L150,-180 L210,-90 L120,-80 L-120,-70Z" fill="#C0392B" />
    <rect x={-250} y={-300} width={170} height={150} rx={10} fill="#E74C3C" /><rect x={-240} y={-250} width={150} height={30} fill="#FFF" opacity={0.7} />
    <path d="M150,-180 L200,-260 L240,-260" stroke="#333" strokeWidth={10} fill="none" />
    {rider && <g transform="translate(20,-150) scale(0.45)"><Person x={0} y={0} t={t} o={{ ...SEN27, kind: "jacket", top: "#C0392B", top2: "#9E2E22" }} arms="desk" /></g>}
    {rider && <circle cx={20} cy={-420} r={70} fill="#222" opacity={0.85} />}
  </g>
);
const Ehliyet: React.FC<{ k: number }> = ({ k }) => (
  <g transform={`translate(960,540) scale(${0.8 + 0.2 * k}) rotate(${-4 * k})`} opacity={k}>
    <rect x={-420} y={-260} width={840} height={520} rx={30} fill="#F2E6F0" stroke="#B48CB0" strokeWidth={6} />
    <rect x={-420} y={-260} width={840} height={90} rx={30} fill="#C46BA0" />{tx(0, -200, "SÜRÜCÜ BELGESİ", 46, "#FFF", 700, "middle")}
    <rect x={-370} y={-130} width={240} height={300} rx={14} fill="#CBB" /><circle cx={-250} cy={-40} r={60} fill={H.skin} /><path d="M-340,170 Q-250,40 -160,170Z" fill="#2E3B4E" />
    {[["Ad", "SEN"], ["Doğum yeri", "TOKAT"], ["Sınıf", "B"]].map(([a, b], i) => <g key={i}>{tx(-80, -80 + i * 100, a, 30, "#776", 600)}{tx(-80, -36 + i * 100, b, 46, "#222", 700)}</g>)}
  </g>
);
const CallScreen: React.FC<{ t: number; name: string; c?: string }> = ({ t, name, c = "#2BB673" }) => (
  <g>
    <rect width={360} height={740} fill="#14202E" />
    {tx(180, 200, name, 40, "#FFF", 700, "middle")}{tx(180, 245, "arıyor…", 22, "#AAA", 500, "middle")}
    <circle cx={180} cy={380} r={70 + Math.sin(t * 6) * 6} fill="#FFF" opacity={0.1} /><circle cx={180} cy={380} r={60} fill="#3A4A5E" />{tx(180, 400, name[0], 56, "#FFF", 700, "middle")}
    <circle cx={90} cy={620} r={44} fill="#E5322D" /><circle cx={270} cy={620} r={44} fill={c} />
  </g>
);
const TagApp: React.FC<{ t: number }> = ({ t }) => (
  <g>
    <rect width={360} height={740} fill="#EEF2F5" />
    <rect width={360} height={420} fill="#CFE0D6" />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M0,${60 + i * 70} L360,${30 + i * 75}`} stroke="#FFF" strokeWidth={10} />)}
    {[[90, 140], [240, 220], [150, 320]].map(([x, y], i) => <g key={i} transform={`translate(${x + Math.sin(t + i) * 10},${y})`}><rect x={-18} y={-10} width={36} height={20} rx={6} fill="#1E9E6A" /></g>)}
    <circle cx={180} cy={260} r={14} fill="#3EA6FF" stroke="#FFF" strokeWidth={4} />
    <rect x={16} y={450} width={328} height={260} rx={20} fill="#FFF" />
    {tx(36, 500, "Sürücünü bul", 26, "#111", 700)}{tx(36, 540, "Kendi aracıyla gelen sürücü", 18, "#666", 500)}
    <rect x={36} y={600} width={288} height={70} rx={35} fill="#1E9E6A" />{tx(180, 645, "Yolculuk iste", 24, "#FFF", 700, "middle")}
  </g>
);
const Bars: React.FC<{ t: number; a: number; rows: [string, number, string, string][]; max: number }> = ({ t, a, rows, max }) => (
  <g>{rows.map(([l, v, s, c], i) => { const k = rp(t, a + 0.3 + i * 0.7, a + 1.2 + i * 0.7); const y = 380 + i * 230; return <g key={i}>{tx(240, y - 30, l, 44, "#DDD", 700)}<rect x={240} y={y} width={1440} height={90} rx={16} fill="#1F2430" /><rect x={240} y={y} width={Math.max(30, 1440 * (v / max) * k)} height={90} rx={16} fill={c} />{tx(260 + Math.max(30, 1440 * (v / max) * k), y + 64, s, 50, "#FFF", 700)}</g>; })}</g>
);
const Simit: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><circle r={150} fill="none" stroke="#B5651D" strokeWidth={90} /><circle r={150} fill="none" stroke="#D9893A" strokeWidth={60} />{Array.from({ length: 40 }, (_, i) => { const an = (i / 40) * Math.PI * 2; const r = 130 + (i % 3) * 18; return <ellipse key={i} cx={Math.cos(an) * r} cy={Math.sin(an) * r} rx={5} ry={3} fill="#F5E6C8" transform={`rotate(${i * 30} ${Math.cos(an) * r} ${Math.sin(an) * r})`} />; })}</g>
);
const Sepia: React.FC = () => <rect width={1920} height={1080} fill="#8A6A3A" opacity={0.32} style={{ mixBlendMode: "multiply" }} />;
const Black: React.FC = () => <rect width={1920} height={1080} fill="#05060A" />;

// alıntı kartı (konuşma)
const Q = (t: number, at: number, text: string, y = 820, c = "#FFE27A", size = 60) => <Big t={t} at={at} text={`“${text}”`} y={y} size={size} c={c} />;

// Rıza'nın kuralları (sağda liste)
const Rules: React.FC<{ t: number; items: [string, number, string?][] }> = ({ t, items }) => (
  <div style={{ position: "absolute", right: 90, top: 150, width: 640, fontFamily: UI, background: "rgba(14,16,22,.88)", borderRadius: 26, padding: "34px 40px", border: `3px solid ${YEL}` }}>
    <div style={{ fontSize: 40, fontWeight: 700, color: YEL, marginBottom: 18 }}>Rıza Abi'nin kuralları</div>
    {items.map(([s, at, c], i) => { const k = rp(t, at, at + 0.4); return <div key={i} style={{ fontSize: 40, fontWeight: 700, color: c ?? "#FFF", margin: "16px 0", opacity: k, transform: `translateX(${(1 - k) * 30}px)` }}>• {s}</div>; })}
  </div>
);
const ruleAt: Record<string, number> = {};

// el ele para: sen uzatırsın, o alır
const handoff = (t: number, a: number, b: number, p: { at?: number; coins?: boolean } & Z = {}) => {
  const at = a + (p.at ?? 0.6);
  const k = act(t, at, 1.4, 0.5, 0.6);
  const given = t > at + 0.8;
  return (
    <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.08]} c0={p.c0} c1={p.c1}>
      <Durak t={t} dawn cars={2} />
      <rect width={1920} height={1080} fill="#000" opacity={0.25} />
      {/* taksi kapısı + pencere çerçevesi */}
      <rect x={-50} y={330} width={760} height={800} rx={40} fill={YEL} /><rect x={20} y={380} width={620} height={300} rx={20} fill="#1E2A38" />
      <Hand x={lp(380, 760, k)} y={560} s={1.2} sleeve="#2E3B4E" />
      {!given && <Tomar x={lp(560, 940, k)} y={555} s={0.9} rot={-6} />}
      <Hand x={lp(1700, 1280, cl(k * 1.3))} y={540} s={1.15} rot={180} sleeve={RIZA.top} skin={RIZA.skin} open={!given} />
      {given && <Tomar x={lp(1120, 1500, rp(t, at + 0.8, at + 1.6))} y={520} s={0.9} rot={8} />}
      {p.coins && <Bozuk x={420} y={760} s={1.2} />}
    </HCam>
  );
};

const LED = (rows: [string, string][], n: number, hi: number, title: string) => <Defter x={960} y={560} s={1.25} rows={[["", ""], ...rows]} k={(n + 1) / (rows.length + 1)} hi={hi < 0 ? -1 : hi + 1} title={title} />;
const D1: [string, string][] = [["Kazanç · 26 gün", "166.920"], ["Rıza Abi · yevmiye", "−94.000"], ["Otogaz", "−28.990"], ["Yemek · çay · yıkama", "−11.700"], ["Dolmuş çiziği", "−6.000"]];
const D2: [string, string][] = [["Kalan", "26.230"], ["Kira", "−21.000"], ["Anne", "−5.000"], ["CEBİNDE", "230 ₺"]];

// ───────── ÇEKİM LİSTESİ (her çekim bir cümleye bağlı)
const SHOTS: Sh[] = [
  // 0:00 · kanca
  { c: "Sabahın altısı", tone: "warm", r: (t, a, b) => dur(t, a, b, [], { dawn: true, cars: 3, z: [1.15, 1.02] }), html: (t, a) => <Big t={t} at={a + 0.4} text="06:00" sub="Mecidiyeköy, İstanbul" y={80} size={90} /> },
  { c: "Sarı bir taksinin", r: (t, a, b) => handoff(t, a, b, { at: 1.2 }), sfx: "whoosh" },
  { c: "Üç bin beş yüz lira", r: (t, a, b) => handoff(t, a - 3, b, { at: 1.2, z: [1.15, 1.22], c0: [1100, 560] }), html: (t, a) => <Big t={t} at={a} text="3.500 ₺" y={90} size={120} c={YEL} /> },
  { c: "Adam parayı saymadan", r: (t, a, b) => dur(t, a, b, [{ o: RIZA, x: 1100, s: 1.05, arms: "hold", hold: <Tomar x={0} y={0} s={0.5} />, look: 0.3, eyes: "half" }], { dawn: true, cars: 1, z: [1.35, 1.45], c0: [1100, 520] }) },
  { c: "Senin öbür elinde", r: (t, a, b) => board(t, a, b, <><Hand x={700} y={600} s={1.6} rot={-8} /><Bozuk x={1040} y={560} s={1.5} /></>, { bg: "#1A1610", z: [1.1, 1.25], c0: [960, 560] }), sfx: "ding" },
  { c: "Bu adamın adı", r: (t, a, b) => dur(t, a, b, [{ o: RIZA, x: 960, s: 1.15, arms: "cross", look: -0.2, mouth: "tight" }], { dawn: true, cars: 2, z: [1.4, 1.5], c0: [960, 470] }), html: (t, a) => <AgeTag t={t} at={a + 0.4} age="Rıza Abi" place="taksi plakası sahibi" /> },
  { c: "Ve bu ay, her sabah", r: (t, a, b) => board(t, a, b, <><Taksimetre x={560} y={540} s={1.4} v={lp(0, 5100, rp(t, a, a + 2.5))} t={t} /><path d={`M860,540 L${lp(860, 1300, rp(t, a + 1.5, a + 2.3))},540`} stroke={YEL} strokeWidth={16} markerEnd="" /><Tomar x={1450} y={560} s={1.1} /></>), html: (t, a) => <Big t={t} at={a + 1.8} text="İlk lokma onun" y={820} size={64} c={YEL} /> },
  { c: "Sen ne kazanırsan", r: (t, a, b) => board(t, a, b, <g />, { bg: "#140E06" }), html: (t, a) => <Big t={t} at={a + 0.3} text="Önce o." y={420} size={150} c={YEL} />, sfx: "boom" },
  { c: "Bir de şunu unutma", tone: "night", r: (t, a, b) => pov(t, a, b, { road: "e5", meter: 1840, speed: 1.4, lids: 0.15 }), html: (t, a) => <Big t={t} at={a + 1.5} text="04:00 · E-5" y={80} size={80} /> },
  { c: "Oraya da geleceğiz", tone: "night", r: (t, a, b) => pov(t, a, b, { road: "e5", speed: 1.4, lids: lp(0.15, 0.9, rp(t, a, b)) }), sfx: "drone" },
  // 0:30 · söz: defter
  { c: "Ama önce sana", r: (t, a, b) => board(t, a, b, LED([], 0, -1, "Bu ayın defteri"), { bg: "#2A241D", z: [1, 1.1] }) },
  { c: "Kazandığın her lirayı", r: (t, a, b) => board(t, a, b, LED([["Kazanç", "?"], ["Gider", "?"], ["Kalan", "?"]], 3 * rp(t, a, a + 2.5), -1, "Bu ayın defteri"), { bg: "#2A241D", z: [1.1, 1.2] }) },
  { c: "Ve birlikte göreceğiz", r: (t, a, b) => ws(t, a, b, { look: 0, mouth: "smile", z: [1.15, 1.3], c0: [880, 500] }), html: (t, a) => <Big t={t} at={a + 1} text="Ay sonunda cebinde ne kalır?" y={80} size={72} c={YEL} /> },
  // 0:45 · kim bu "sen"
  { c: "27 yaşındasın", r: (t, a, b) => sok(t, a, b, <>{P(t, { o: SEN27, x: 960, s: 1.05, mouth: "flat", look: 0.1 })}</>, { z: [1.25, 1.35], c0: [960, 520] }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="27 yaş" place="Tokat → İstanbul" /> },
  { c: "3 yıldır", r: (t, a, b) => sok(t, a, b, <Moto x={lp(-300, 2200, rp(t, a, b))} y={1000} s={0.9} t={t} />, { z: [1, 1.05] }), html: (t, a) => <Big t={t} at={a + 0.5} text="3 yıl motorlu kurye" y={80} size={68} /> },
  { c: "Yağmurlu bir akşam", tone: "cool", r: (t, a, b) => sok(t, a, b, <Moto x={lp(400, 900, rp(t, a, a + 1.6))} y={1000} s={1} t={t} rot={-38 * rp(t, a + 1.6, a + 2)} />, { rain: true, night: true, z: [1.1, 1.25], c0: [800, 700] }), sfx: "boom" },
  { c: "Kolun alçıda", r: (t, a, b) => oda(t, a, b, [{ o: SEN27, x: 960, arms: "down", mouth: "sad", brow: "worry", look: -0.2 }], { extra: <rect x={1050} y={760} width={90} height={230} rx={40} fill="#F4F4F0" transform="rotate(-10 1100 860)" />, z: [1.3, 1.4], c0: [960, 560] }) },
  { c: "Annen telefon", r: (t, a, b) => ph(t, a, b, <CallScreen t={t} name="Annem" />, <Oda t={t} />), html: (t, a) => Q(t, a + 1.2, "Oğlum, bırak artık şu motoru.") },
  { c: "Bırakıyorsun", r: (t, a, b) => oda(t, a, b, [{ o: SEN27, x: 960, arms: "chin", eyes: "half", look: -0.4, lookY: 0.4 }], { z: [1.2, 1.3] }) },
  { c: "Bağcılardaki evin", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.1]}><Door t={t} knock={0} /><Paper x={960} y={420} s={1.1} rot={-3} title="KİRA" lines={["Bağcılar", "Aylık: 21.000 ₺"]} /></HCam> },
  { c: "Ve ev sahibi", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><Door t={t} knock={t > a + 1.2 ? 1 : 0} />{cal(t, a + 0.2, "HER AY", "15", "sabah 09:00", 1480, 520, 0.7)}</HCam>, sfx: "knock" },
  { c: "Bir de her ay köye", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.05, 1.15]}><KoyEvi t={t} night={false} />{P(t, { o: ANNE, x: 1300, s: 0.95, mouth: "smile", arms: "hold", hold: <Zarf x={0} y={0} s={0.5} label="Oğlumdan" fill={0} /> })}</HCam>, html: (t, a) => <Big t={t} at={a + 0.8} text="Anneye: 5.000 ₺" y={80} size={70} /> },
  { c: "Yani her ayın", r: (t, a, b) => board(t, a, b, <>{cal(t, a, "HER AY", "15", undefined, 420, 540, 0.8)}</>), html: (t, a) => <Counter t={t} a={a + 0.4} from={0} to={26000} label="21.000 kira + 5.000 anne" y={330} c={YEL} prefix="₺" /> },
  { c: "Bu sayıyı aklında", r: (t, a, b) => board(t, a, b, <g />, { bg: "#140E06", z: [1.1, 1.0] }), html: (t, a) => <Big t={t} at={a} text="₺26.000" sub="her ayın 15'inde" y={380} size={150} c={YEL} /> },
  // 1:20 · plaka
  { c: "Ehliyetin var", r: (t, a, b) => board(t, a, b, <Ehliyet k={rp(t, a, a + 0.6)} />, { bg: "#1A1E27" }) },
  { c: "Aklına ilk", r: (t, a, b) => sok(t, a, b, <Taksi x={lp(-500, 2400, rp(t, a, b))} y={1010} s={0.9} t={t} speed={1} />, { z: [1, 1.04] }), html: (t, a) => <Big t={t} at={a + 1.2} text="Taksicilik" y={80} size={90} c={YEL} /> },
  { c: "Ama sarı bir taksi", r: (t, a, b) => board(t, a, b, <Plaka x={960} y={540} s={1.5} k={rp(t, a, a + 0.6)} />, { bg: "#141821", z: [1, 1.15] }) },
  { c: "Ve İstanbul'da eski", r: (t, a, b) => board(t, a, b, <Plaka x={960} y={360} s={1} />, { bg: "#141821" }), html: (t, a) => <Counter t={t} a={a + 2} from={0} to={12000000} dur={2} label="eski, süresiz plaka (yaklaşık)" y={560} c={YEL} prefix="₺" />, sfx: "tick" },
  { c: "Kadıköy, Beşiktaş", r: (t, a, b) => board(t, a, b, <Plaka x={960} y={520} s={1.4} price="16 Milyon ₺" />, { bg: "#1A0E0E", z: [1.05, 1.2] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Kadıköy · Beşiktaş" y={80} size={64} />, sfx: "boom" },
  { c: "Evet, yanlış duymadın", r: (t, a, b) => board(t, a, b, <><Plaka x={1180} y={540} s={1.3 * (0.6 + 0.4 * rp(t, a + 1, a + 2))} /><g transform="translate(420,560) scale(0.8)"><rect x={-140} y={-60} width={280} height={220} fill="#C9B79C" /><path d="M-180,-60 L0,-200 L180,-60Z" fill="#8E4B3A" /><rect x={-40} y={60} width={80} height={100} fill="#6E4528" /></g></>), html: (t, a) => <Big t={t} at={a + 1.5} text="Plaka > ev" y={830} size={80} c={YEL} /> },
  { c: "Belediye son bir", r: (t, a, b) => ph(t, a, b, <News head="İBB'den yeni taksi plakası" sub="29 yıllığına · 6 milyon ₺ + KDV'den başlıyor" k={rp(t, a, a + 0.6)} />, <Durak t={t} />, { light: true }) },
  { c: "Ama onlar sonsuza", r: (t, a, b) => board(t, a, b, <><Plaka x={960} y={460} s={1.3} price="29 YIL" c="#2E7DD8" /></>, { bg: "#141821", z: [1.05, 1.15] }), html: (t, a) => <Big t={t} at={a + 1.2} text="6 milyon ₺ + KDV'den başlıyor" y={820} size={60} c={YEL} /> },
  { c: "Temmuz'daki ihalede", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 250 }, (_, i) => { const sold = i % 11 === 3 && i < 253; const k = rp(t, a + i * 0.004, a + 0.3 + i * 0.004); const on = sold && t > a + 2.2; return <rect key={i} x={260 + (i % 25) * 56} y={200 + Math.floor(i / 25) * 66} width={44} height={26} rx={4} fill={on ? YEL : "#2A303C"} opacity={k} />; })}</g>), html: (t, a) => <Big t={t} at={a + 2.2} text="250 plaka → sadece 23'ü satıldı" y={900} size={58} c={YEL} /> },
  { c: "Senin cebindeyse", r: (t, a, b) => board(t, a, b, <><Hand x={760} y={600} s={1.5} /><Bozuk x={1080} y={570} s={1.4} /></>, { bg: "#1A1610", z: [1.1, 1.2] }), html: (t, a) => <Big t={t} at={a + 1.3} text="6 bin bile yok" y={90} size={80} c="#FF6B6B" /> },
  // 2:00 · yevmiye
  { c: "İşte bu yüzden", r: (t, a, b) => dur(t, a, b, [], { cars: 3, z: [1, 1.1], c0: [1300, 600] }) },
  { c: "Yevmiye. Yani", r: (t, a, b) => board(t, a, b, <><Taksi x={560} y={720} s={0.7} t={t} /><path d={`M920,560 L${lp(920, 1250, rp(t, a + 1, a + 1.8))},560`} stroke={YEL} strokeWidth={14} /><g transform="translate(1440,620) scale(0.7)">{P(t, { o: RIZA, x: 0, y: 300, s: 1, arms: "cross" })}</g></>), html: (t, a) => <Big t={t} at={a + 0.2} text="YEVMİYE" sub="başkasının taksisi · her gün sabit kira" y={80} size={90} c={YEL} /> },
  { c: "Kazancın ne olursa", r: (t, a, b) => dur(t, a, b, [{ o: DRIVER, x: 700, s: 1, arms: "hold", hold: <Tomar x={0} y={0} s={0.5} />, look: 0.4, mouth: "tight" }, { o: RIZA, x: 1250, s: 1, arms: "cross", look: -0.4 }], { dawn: true, cars: 1, z: [1.15, 1.25], c0: [960, 560] }), html: (t, a) => <Big t={t} at={a + 1.5} text="Kazanç ne olursa olsun: sabit" y={80} size={60} /> },
  { c: "Seni Mecidiyeköy'deki", r: (t, a, b) => dur(t, a, b, [{ o: SEN27, x: lp(300, 520, rp(t, a, b)), s: 0.85, look: 0.4 }, { o: EMRE, x: lp(120, 340, rp(t, a, b)), s: 0.85, talk: true, mouth: "smile", look: 0.5 }], { cars: 3, z: [1.05, 1.12], c0: [700, 560] }) },
  { c: "Durağın önünde", r: (t, a, b) => kul(t, a, b, [], { z: [1, 1.12], c0: [900, 520] }) },
  { c: "ve kulübenin en rahat", r: (t, a, b) => kul(t, a, b, [{ o: RIZA, x: 1250, s: 0.95, arms: "cross", look: -0.3, eyes: "half" }], { z: [1.15, 1.3], c0: [1150, 560] }), html: (t, a) => <AgeTag t={t} at={a + 0.6} age="Rıza Abi · 60" place="gri bıyık, altın saat" /> },
  { c: "bileğinde altın", r: (t, a, b) => board(t, a, b, <><rect width={1920} height={1080} fill="#2A241D" /><rect x={-100} y={420} width={2200} height={240} rx={100} fill={RIZA.top} transform="rotate(-8 960 540)" /><GoldWatch x={960} y={540} s={2.6} t={t} /></>, { z: [1.1, 1.25] }), sfx: "ding" },
  { c: "3 plakası var", r: (t, a, b) => board(t, a, b, <>{[0, 1, 2].map((i) => <Plaka key={i} x={960} y={300 + i * 230} s={0.8} txt={`34 T ${["4721", "1908", "6630"][i]}`} k={rp(t, a + i * 0.5, a + i * 0.5 + 0.4)} />)}</>), html: (t, a) => <Big t={t} at={a + 1.8} text="Üçü de kirada" y={960} size={56} c={YEL} /> },
  { c: "Seni baştan aşağı", r: (t, a, b) => kul(t, a, b, [{ o: RIZA, x: 1250, s: 1, arms: "cross", look: -0.5, lookY: 0.3, eyes: "half", brow: "flat" }, { o: SEN27, x: 420, s: 1, look: 0.5 }], { z: [1.1, 1.2] }) },
  { c: "Yevmiye 3500", r: (t, a, b) => kul(t, a, b, [{ o: RIZA, x: 700, s: 1.1, arms: "cross", talk: true, look: 0.2 }], { z: [1.3, 1.36], c0: [740, 480] }), html: (t) => <Rules t={t} items={[["Yevmiye: 3.500 ₺", ruleAt.y], ["07:00 – 19:00", ruleAt.s], ["Benzin, yıkama: senden", ruleAt.b], ["Hasar: senden", ruleAt.h, "#FF6B6B"]]} /> },
  { c: "akşam 7'den sonra", r: (t, a, b) => kul(t, a, b, [{ o: RIZA, x: 700, s: 1.1, arms: "cross", talk: true, look: 0.2, eyes: "half" }], { z: [1.2, 1.26], c0: [760, 520] }), html: (t) => <Rules t={t} items={[["Yevmiye: 3.500 ₺", 0], ["07:00 – 19:00", 0], ["Benzin, yıkama: senden", ruleAt.b], ["Hasar: senden", ruleAt.h, "#FF6B6B"]]} /> },
  { c: "Arabaya bir şey olursa", r: (t, a, b) => kul(t, a, b, [{ o: RIZA, x: 700, s: 1.15, arms: "cross", talk: true, brow: "angry", look: 0.2 }], { z: [1.4, 1.5], c0: [740, 460] }), html: (t) => <Rules t={t} items={[["Yevmiye: 3.500 ₺", 0], ["07:00 – 19:00", 0], ["Benzin, yıkama: senden", 0], ["Hasar: senden", 0, "#FF6B6B"]]} /> },
  { c: "Sigortayı soruyorsun", r: (t, a, b) => kul(t, a, b, [{ o: SEN27, x: 900, s: 1.15, talk: true, look: 0.4, brow: "up" }], { z: [1.35, 1.4], c0: [900, 460] }) },
  { c: "sonra bakarız", r: (t, a, b) => kul(t, a, b, [{ o: RIZA, x: 1000, s: 1.15, arms: "wave", talk: true, eyes: "half" }], { z: [1.3, 1.36], c0: [1000, 440] }), html: (t, a) => Q(t, a + 0.1, "Sonra bakarız.") },
  { c: "Sonra anahtarı uzatıyor", r: (t, a, b) => board(t, a, b, <Nazar x={960} y={180} s={2.6} t={t} />, { bg: "#2A241D", z: [1.05, 1.2], c0: [960, 500] }), sfx: "ding" },
  { c: "Bu boncuk bu arabayı", r: (t, a, b) => kul(t, a, b, [{ o: RIZA, x: 960, s: 1.15, arms: "hold", hold: <Nazar x={0} y={-60} s={0.6} t={t} />, talk: true, mouth: "smile" }], { z: [1.25, 1.3], c0: [960, 470] }) },
  { c: "Bak evlat", r: (t, a, b) => kul(t, a, b, [{ o: RIZA, x: 960, s: 1.2, arms: "cross", talk: true, eyes: "half", brow: "angry" }], { z: [1.5, 1.62], c0: [960, 400] }), html: (t, a) => Q(t, a + 0.6, "Ne kazanırsan kazan, önce ben alırım.", 830, YEL, 56), sfx: "drone" },
  // 3:20 · ilk gün
  { c: "İlk sabah direksiyona", r: (t, a, b) => ws(t, a, b, { mouth: "smile", look: 0, z: [1, 1.1] }) },
  { c: "Taksimetrenin düğmesine", r: (t, a, b) => board(t, a, b, <Taksimetre x={960} y={540} s={2.4} v={71.94} on={t > a + 1} t={t} />, { bg: "#0E0F12", z: [1.05, 1.15] }), html: (t, a) => <Big t={t} at={a + 1.6} text="Açılış ≈ 72 ₺" y={80} size={72} c={YEL} />, sfx: "tick" },
  { c: "Yolcu daha bir metre", r: (t, a, b) => pov(t, a, b, { road: "city", meter: 71.94, speed: 0.05, z: [1.25, 1.3], c0: [1400, 760] }) },
  { c: "Sonra her kilometre", r: (t, a, b) => pov(t, a, b, { road: "city", meter: 71.94 + Math.floor(rp(t, a, b) * 5) * 47.92, speed: 1 }), html: (t, a) => <Big t={t} at={a + 1} text="+ ≈ 48 ₺ / km" y={80} size={72} c={YEL} /> },
  { c: "Bu fiyatlar Temmuz'daki", r: (t, a, b) => ph(t, a, b, <News head="İstanbul'da taksi ücretlerine zam" sub="Açılış 71,94 ₺ · km 47,92 ₺ · kısa mesafe 230 ₺ (Temmuz 2026)" k={rp(t, a, a + 0.5)} />, <Skyline t={t} />, { light: true }) },
  { c: "İlk yolcuğun", r: (t, a, b) => ws(t, a, b, { back: TAKIM, backArms: "phone", backTalk: true, look: 0.2, z: [1, 1.05] }) },
  { c: "Sana tek kelime", r: (t, a, b) => ws(t, a, b, { back: TAKIM, backArms: "phone", backTalk: true, eyes: "half", z: [1.3, 1.4], c0: [880, 480] }) },
  { c: "İnerken 280", r: (t, a, b) => board(t, a, b, <><Banknot x={820} y={540} s={1.8} rot={-6} /><Banknot x={1120} y={560} s={1.5} rot={8} c="#3E8E5E" v="50" /><Bozuk x={960} y={760} s={1.2} n={2} /></>, { bg: "#1A1610" }), html: (t, a) => <Big t={t} at={a + 0.6} text="280 ₺" y={90} size={100} c={YEL} /> },
  { c: "Akşam yedide araba", r: (t, a, b) => dur(t, a, b, [], { dawn: true, cars: 2, z: [1, 1.06] }), html: (t, a) => <Big t={t} at={a + 0.4} text="19:00" y={80} size={80} /> },
  { c: "Taksimetrede günün", r: (t, a, b) => board(t, a, b, LED([["Taksimetre", "5.100"], ["Rıza Abi", "−3.500"], ["Benzin", "−1.000"], ["Elinde", "600"]], 4 * rp(t, a, a + 6), Math.floor(4 * rp(t, a, a + 6)) >= 4 ? 3 : -1, "1. gün"), { bg: "#2A241D", z: [1, 1.1] }) },
  { c: "12 saat çalıştın", r: (t, a, b) => board(t, a, b, <Clock x={960} y={500} s={1.6} h={7} m={0} spin={rp(t, a, a + 2) * 12} />), html: (t, a) => <Big t={t} at={a + 1.2} text="12 saat → saatine 50 ₺ bile değil" y={860} size={60} c="#FF6B6B" /> },
  { c: "Eve dönerken", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.05, 1.12]}><Metrobus t={t} people={P(t, { o: SEN27, x: 900, s: 1, arms: "down", eyes: "half", tilt: 5, slump: 0.4 })} /></HCam> },
  { c: "Ve kendine soruyorsun", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[900, 460]}><Metrobus t={t} people={P(t, { o: SEN27, x: 900, s: 1, brow: "worry", look: -0.3, lookY: -0.2 })} /></HCam>, html: (t, a) => <Big t={t} at={a + 1} text="Diğerleri bu hesabı nasıl çeviriyor?" y={850} size={56} /> },
  { c: "Cevabı ertesi gün", r: (t, a, b) => board(t, a, b, <g />, { bg: "#0B0B0F" }), html: (t, a) => <Big t={t} at={a + 0.6} text="…en kötü şekilde" y={440} size={90} c="#FF6B6B" />, sfx: "drone" },
  // 4:00 · kısa mesafe
  { c: "Öğlen Şişli'de", r: (t, a, b) => sok(t, a, b, <>{P(t, { o: GENC, x: 1200, s: 0.95, arms: "wave", look: -0.5 })}<Taksi x={lp(-400, 560, rp(t, a, a + 1.8))} y={1020} s={0.85} t={t} speed={1 - rp(t, a + 1.2, a + 1.8)} /></>, { signs: ["ŞİŞLİ ECZANE", "BÜFE", "HASTANE →"] }) },
  { c: "Bir kilometre ötedeki", r: (t, a, b) => board(t, a, b, <g><path d={`M420,700 Q960,${520} 1500,640`} stroke="#3A4150" strokeWidth={40} fill="none" strokeLinecap="round" /><path d={`M420,700 Q960,${520} 1500,640`} stroke={YEL} strokeWidth={12} fill="none" strokeDasharray={1300} strokeDashoffset={1300 * (1 - rp(t, a + 0.4, a + 2))} /><circle cx={420} cy={700} r={30} fill={YEL} /><g transform="translate(1500,560)"><rect x={-70} y={-70} width={140} height={140} rx={16} fill="#FFF" /><rect x={-14} y={-46} width={28} height={92} fill="#E5322D" /><rect x={-46} y={-14} width={92} height={28} fill="#E5322D" /></g>{tx(960, 480, "1 km", 64, "#FFF", 700, "middle")}</g>) },
  { c: "Sen hesabı yapıyorsun", r: (t, a, b) => ws(t, a, b, { look: -0.2, lookY: -0.4, brow: "worry", arms: "chin", z: [1.3, 1.4], c0: [880, 480] }) },
  { c: "İstanbul'da kısa mesafenin", r: (t, a, b) => board(t, a, b, <Taksimetre x={960} y={540} s={2.2} v={230} t={t} />, { bg: "#0E0F12" }), html: (t, a) => <Big t={t} at={a + 0.6} text="Kısa mesafe: 230 ₺" y={80} size={72} c={YEL} /> },
  { c: "Ama o bir kilometre", r: (t, a, b) => pov(t, a, b, { road: "traffic", meter: 230, speed: 0.04 }), html: (t, a) => <Big t={t} at={a + 1} text="1 km = 20 dakika" y={80} size={72} c="#FF6B6B" /> },
  { c: "Aynı 20 dakikada", r: (t, a, b) => board(t, a, b, <Bars t={t} a={a} max={2400} rows={[["Kısa mesafe · 20 dk", 230, "230 ₺", "#5A6170"], ["Havalimanı · 20 dk", 2300, "≈ 10 katı", YEL]]} />) },
  { c: "Ve o cümle ağzından", r: (t, a, b) => ws(t, a, b, { talk: true, look: -0.5, mouth: "tight", brow: "flat", z: [1.3, 1.42], c0: [880, 470] }), html: (t, a) => Q(t, a + 1.2, "Kardeşim, o tarafa gitmiyorum.") },
  { c: "Gencin elinde telefon", r: (t, a, b) => sok(t, a, b, <>{P(t, { o: GENC, x: 960, s: 1.1, arms: "phone", brow: "angry", look: 0.3 })}</>, { z: [1.3, 1.4], c0: [960, 520], signs: ["ŞİŞLİ ECZANE", "BÜFE", "HASTANE →"] }), html: (t) => <div style={{ position: "absolute", top: 60, right: 80, display: "flex", alignItems: "center", gap: 14, fontFamily: UI, fontWeight: 700, fontSize: 48, color: "#FFF" }}><div style={{ width: 34, height: 34, borderRadius: 17, background: Math.sin(t * 6) > 0 ? "#E5322D" : "#6B1512" }} />REC</div> },
  { c: "Akşama video yayılmış", r: (t, a, b) => ph(t, a, b, <ViralScreen t={t} views={lp(1200, 412000, rp(t, a, a + 3))} k={0} />, <Oda t={t} />), sfx: "pop" },
  { c: "Altında binlerce yorum", r: (t, a, b) => ph(t, a, b, <ViralScreen t={t} views={412000} k={rp(t, a, a + 3)} />, <Oda t={t} />, { z: [1.25, 1.35], c0: [960, 640] }) },
  { c: "abi seni durağa", tone: "night", r: (t, a, b) => kul(t, a, b, [{ o: RIZA, x: 1250, s: 1, arms: "cross", look: -0.4, brow: "angry" }, { o: SEN27, x: 450, s: 1, look: 0.4, brow: "worry", slump: 0.3 }], { night: true }) },
  { c: "Bir şikayet daha", tone: "night", r: (t, a, b) => kul(t, a, b, [{ o: RIZA, x: 1250, s: 1.15, arms: "cross", talk: true, eyes: "half", brow: "angry", look: -0.3 }], { night: true, z: [1.45, 1.55], c0: [1250, 450] }), html: (t, a) => Q(t, a + 0.2, "Bir şikâyet daha gelirse, anahtarı bırakırsın."), sfx: "drone" },
  { c: "O gece uyuyamıyorsun", tone: "night", r: (t, a, b) => oda(t, a, b, [{ o: SEN27, x: 650, s: 0.95, arms: "head", eyes: "open", look: 0, lookY: -0.5 }]) },
  { c: "Ama senin hesabının", r: (t, a, b) => board(t, a, b, LED([["Taksimetre", "5.100"], ["Rıza Abi", "−3.500"], ["Benzin", "−1.000"], ["Elinde", "600"]], 4, 1, "1. gün"), { bg: "#2A241D", z: [1.2, 1.3] }) },
  { c: "Taksiye binen insan", r: (t, a, b) => board(t, a, b, <><Taksimetre x={560} y={540} s={1.4} v={230} t={t} />{tx(560, 760, "Yolcunun gördüğü", 40, "#AAA", 700, "middle")}<g opacity={rp(t, a + 1.5, a + 2.2)}><Tomar x={1380} y={560} s={1.2} />{tx(1380, 760, "Görmediği: günde 3.500 ₺", 40, YEL, 700, "middle")}</g></>) },
  { c: "Bir karar veriyorsun", r: (t, a, b) => ws(t, a, b, { mouth: "tight", brow: "flat", look: 0, z: [1.25, 1.35], c0: [880, 480] }) },
  // 5:00 · şehri okumak
  { c: "Ve öğreniyorsun", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["08:00\nplazaya yetişenler", "Öğlen\notellerin önü", "Yağmur\n= herkes taksi arar"], YEL)) },
  { c: "Sabah 8'de", r: (t, a, b) => pov(t, a, b, { road: "dawn", meter: 412.6, speed: 1.1 }), html: (t, a) => <Big t={t} at={a + 0.6} text="08:00" sub="çıkan değil, yetişmeye çalışan" y={80} size={72} /> },
  { c: "hastanelerin önünde değil", r: (t, a, b) => sok(t, a, b, <>{P(t, { o: TAKIM, x: 1250, s: 0.9, arms: "wave" })}<Taksi x={700} y={1020} s={0.85} t={t} /></>, { signs: ["OTEL", "LOBİ", "RESEPSİYON"] }) },
  { c: "İstanbul'da yağmur", tone: "cool", r: (t, a, b) => sok(t, a, b, <>{[300, 800, 1300, 1700].map((x, i) => P(t, { o: [GENC, TAKIM, ANNE, EMRE][i], x, s: 0.8, arms: "wave", seed: i }))}</>, { rain: true }) },
  { c: "Yağmur, taksicinin", tone: "cool", r: (t, a, b) => pov(t, a, b, { road: "rain", meter: 1260, speed: 0.9 }), html: (t, a) => <Big t={t} at={a + 0.8} text="Yağmur = altın gün" y={80} size={78} c={YEL} />, sfx: "splash" },
  { c: "Bir yağmurlu perşembe", tone: "cool", r: (t, a, b) => board(t, a, b, <Taksimetre x={960} y={540} s={2.2} v={lp(3000, 7800, rp(t, a, a + 2.5))} t={t} />, { bg: "#0E1218" }), html: (t, a) => <Big t={t} at={a + 2.6} text="7.800 ₺" sub="yağmurlu bir perşembe" y={80} size={90} c={YEL} />, sfx: "ding" },
  { c: "parayı verirken ilk", r: (t, a, b) => kul(t, a, b, [{ o: SEN27, x: 500, s: 1, mouth: "smile", arms: "hold", hold: <Tomar x={0} y={0} s={0.5} />, look: 0.4 }, { o: RIZA, x: 1250, s: 1, look: -0.4, mouth: "smile" }]) },
  // 5:50 · Kemal Abi
  { c: "Akşamları arabayı", r: (t, a, b) => dur(t, a, b, [{ o: KEMAL, x: 640, s: 0.9, look: 0.3 }], { dawn: true, cars: 2 }) },
  { c: "Gece şoförü Kemal", r: (t, a, b) => dur(t, a, b, [{ o: KEMAL, x: 960, s: 1.1, mouth: "smile", look: 0 }], { night: true, cars: 1, z: [1.4, 1.5], c0: [960, 470] }), html: (t, a) => <AgeTag t={t} at={a + 0.4} age="Kemal Abi · 58" place="30 yıldır taksici · gece şoförü" /> },
  { c: "Her akşam 7'de", tone: "night", r: (t, a, b) => kul(t, a, b, [{ o: KEMAL, x: 1200, s: 1, arms: "hold", hold: <TeaGlass x={0} y={0} s={1.2} t={t} />, mouth: "smile", look: -0.4 }, { o: SEN27, x: 500, s: 1, look: 0.4 }], { night: true }) },
  { c: "Bugün kaç yaptın", tone: "night", r: (t, a, b) => kul(t, a, b, [{ o: KEMAL, x: 1100, s: 1.15, talk: true, mouth: "smile", look: -0.4 }], { night: true, z: [1.4, 1.5], c0: [1100, 450] }), html: (t, a) => Q(t, a + 0.1, "Bugün kaç yaptın?") },
  { c: "Bir akşam sen ona", tone: "night", r: (t, a, b) => kul(t, a, b, [{ o: SEN27, x: 800, s: 1.15, talk: true, look: 0.4, brow: "up" }], { night: true, z: [1.4, 1.5], c0: [800, 450] }), html: (t, a) => Q(t, a + 1, "Otuz yılda hiç kendi plakanı almadın mı abi?", 830, "#FFF", 54) },
  { c: "Kemal abi çayını", tone: "night", r: (t, a, b) => board(t, a, b, <><rect width={1920} height={1080} fill="#2A241D" /><TeaGlass x={960} y={640} s={4} t={t} /><rect x={960 + Math.sin(t * 5) * 50} y={250} width={12} height={360} rx={6} fill="#C9C9C9" transform={`rotate(${Math.sin(t * 5) * 8} 960 600)`} /></>, { z: [1.1, 1.2] }), sfx: "ding" },
  { c: "Bir zamanlar alabilirdim", tone: "night", r: (t, a, b) => kul(t, a, b, [{ o: KEMAL, x: 1100, s: 1.2, eyes: "half", mouth: "sad", talk: true, look: -0.2, lookY: 0.4 }], { night: true, z: [1.55, 1.65], c0: [1100, 420] }), html: (t, a) => Q(t, a + 0.2, "Bir zamanlar alabilirdim, evlat.") },
  { c: "konuyu kapatıyor", tone: "night", r: (t, a, b) => kul(t, a, b, [{ o: KEMAL, x: 1250, s: 0.9, look: 0.5, eyes: "half" }, { o: SEN27, x: 450, s: 0.9, look: 0.5, brow: "worry" }], { night: true, z: [1.05, 1] }), html: (t, a) => <Big t={t} at={a + 2} text="Neden? Ay sonunda söyleyecek." y={80} size={56} /> },
  // 6:40 · Martı TAG kararı
  { c: "23 Ekim", r: (t, a, b) => board(t, a, b, cal(t, a, "EKİM", "23", "2026")) },
  { c: "arabanın radyosunda", r: (t, a, b) => pov(t, a, b, { road: "city", meter: 320.5, radio: "HABER · İstinaf mahkemesi taksicilerin davasında kararını verdi…", z: [1.3, 1.4], c0: [960, 780] }), sfx: "static" },
  { c: ["İstanbul'da bir istinah", "istinaf mahkemesi"], r: (t, a, b) => board(t, a, b, <><Tokmak x={560} y={560} s={1.6} t={t} a={a + 0.6} /><g transform="translate(1250,560) scale(0.95)"><Phone x={0} y={0} s={1}><News head="İstinaf: Martı TAG yasaklanamaz" sub="14. Bölge Adliye Mahkemesi · 23 Ekim 2026 · taksicilerin 4 yıllık davası" k={rp(t, a + 0.8, a + 1.4)} /></Phone></g></>), sfx: "knock" },
  { c: "Karar şu", r: (t, a, b) => ph(t, a, b, <TagApp t={t} />, <Skyline t={t} />, { light: true }), html: (t, a) => <Big t={t} at={a + 0.8} text="“Mahkeme kararıyla yasaklanamaz”" y={80} size={58} c={YEL} /> },
  { c: "kararıyla yasaklanamaz", r: (t, a, b) => board(t, a, b, <Tokmak x={960} y={560} s={2} t={t} a={a + 0.2} />, { bg: "#1A1610" }), html: (t, a) => <Big t={t} at={a + 0.4} text="“Yasaklanamaz”" y={80} size={80} c={YEL} />, sfx: "knock" },
  { c: "Durakta o gün", r: (t, a, b) => kul(t, a, b, [{ o: SEN27, x: 360, s: 0.85, arms: "phone", lookY: 0.5 }, { o: DRIVER, x: 760, s: 0.85, arms: "phone", lookY: 0.5, brow: "worry" }, { o: KEMAL, x: 1500, s: 0.85, arms: "phone", lookY: 0.5 }], { fire: 0 } as any) },
  { c: "Birisi bağırıyor", r: (t, a, b) => kul(t, a, b, [{ o: DRIVER, x: 900, s: 1.2, talk: true, mouth: "open", brow: "angry", arms: "wave" }], { z: [1.35, 1.45], c0: [900, 450] }), html: (t, a) => Q(t, a + 0.6, "Biz 12 milyona plaka alalım, onlar kendi arabasıyla gelsin, öyle mi?", 820, "#FFF", 50), sfx: "boom" },
  { c: "Ama hikayenin bir de", r: (t, a, b) => board(t, a, b, <><rect x={0} y={0} width={960} height={1080} fill="#2A1E08" opacity={rp(t, a, a + 0.5)} /><rect x={960} y={0} width={960} height={1080} fill="#08202A" opacity={rp(t, a + 0.8, a + 1.3)} />{tx(480, 540, "Taksiciler", 80, YEL, 700, "middle")}<g opacity={rp(t, a + 0.8, a + 1.3)}>{tx(1440, 540, "Yolcular", 80, "#7FD4FF", 700, "middle")}</g></>) },
  { c: "Taksi odaları", r: (t, a, b) => ph(t, a, b, <News head="Taksi odaları: Karar Yargıtay'a taşınacak" sub="Dava henüz bitmedi" k={rp(t, a, a + 0.5)} />, <Durak t={t} />, { light: true }) },
  { c: "binen yolcuların da", r: (t, a, b) => board(t, a, b, cards(t, a + 0.3, ["Kısa mesafeye\ngitmeyen taksiler", "Pazarlık edilen\nfiyatlar"], "#7FD4FF", 520, 700, 620)) },
  { c: "tıpkı senin o gün", r: (t, a, b) => <><HCam t={t} a={a} b={b} z={[1.1, 1.2]}><Sokak t={t} people={P(t, { o: GENC, x: 960, s: 1.05, arms: "phone", brow: "angry" })} /></HCam><Sepia /></>, tone: "gold" },
  { c: "O akşam eski kurye", tone: "night", r: (t, a, b) => ph(t, a, b, <CallScreen t={t} name="Emre" />, <Oda t={t} />) },
  { c: "Kendi arabasıyla bu", tone: "night", r: (t, a, b) => sok(t, a, b, <>{P(t, { o: EMRE, x: 960, s: 1.1, arms: "phone", talk: true, mouth: "smile" })}</>, { night: true, z: [1.3, 1.4], c0: [960, 500] }) },
  { c: "Gel sen de", tone: "night", r: (t, a, b) => sok(t, a, b, <>{P(t, { o: EMRE, x: 960, s: 1.2, arms: "phone", talk: true, mouth: "grin", look: 0.2 })}</>, { night: true, z: [1.5, 1.6], c0: [960, 440] }), html: (t, a) => Q(t, a + 0.3, "Gel sen de. Yevmiye yok.") },
  { c: "Ama Emre'nin söylemediği", r: (t, a, b) => board(t, a, b, cards(t, a + 0.4, ["Araba\nonun", "Lastik, motor,\nkaza riski", "Denetimde\nceza riski"], H.red)) },
  { c: "denetime denk", r: (t, a, b) => board(t, a, b, cards(t, a - 3, ["Araba\nonun", "Lastik, motor,\nkaza riski", "Denetimde\nceza riski"], H.red), { z: [1.3, 1.45], c0: [1520, 540] }) },
  { c: "Çünkü o karar", r: (t, a, b) => board(t, a, b, <><g opacity={rp(t, a + 0.3, a + 0.8)} transform="translate(560,540) rotate(-6)"><rect x={-330} y={-110} width={660} height={220} rx={20} fill="none" stroke="#2BB673" strokeWidth={12} />{tx(0, 26, "YASAK DEĞİL", 76, "#2BB673", 700, "middle")}</g><g opacity={rp(t, a + 2, a + 2.5)} transform="translate(1360,540) rotate(5)"><rect x={-360} y={-110} width={720} height={220} rx={20} fill="none" stroke="#E5322D" strokeWidth={12} />{tx(0, 26, "RESMİ İZİN YOK", 72, "#E5322D", 700, "middle")}</g></>) },
  { c: "Senin ise bir araban", tone: "night", r: (t, a, b) => oda(t, a, b, [{ o: SEN27, x: 960, s: 1, arms: "phone", eyes: "half", lookY: 0.5 }], { z: [1.2, 1.3] }) },
  // 7:50 · dönüm noktası: otogaz
  { c: "sonra 3 Kasım", tone: "night", r: (t, a, b) => board(t, a, b, cal(t, a, "KASIM", "3", "gece yarısı"), { bg: "#0B0B0F" }), sfx: "drone" },
  { c: "Gece yarısı otogazın", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.1]}><LpgPompa t={t} a={a} at={2.2} /></HCam>, sfx: "buzz" },
  { c: "Avrupa yakasında", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 520]}><LpgPompa t={t} a={a} at={2.8} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.3} text="41,20 → 50,70 ₺" sub="Avrupa Yakası · litre" y={900} size={60} c={YEL} /> },
  { c: "Bir gecede", r: (t, a, b) => board(t, a, b, <g />, { bg: "#1A0808" }), html: (t, a) => <Big t={t} at={a + 0.2} text="+%23" sub="bir gecede" y={360} size={200} c="#FF4A3D" />, sfx: "boom" },
  { c: "Sabah benzinliğin", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.05, 1.12]}><LpgPompa t={t} a={a} at={1.8} from="50,70" to="50,70" total={1000} totalTo={1230} /></HCam>, html: (t, a) => <Big t={t} at={a + 3} text="Depo: 1.000 → 1.230 ₺" y={930} size={60} c={YEL} /> },
  { c: "Taksimetre aynı", r: (t, a, b) => pov(t, a, b, { road: "city", meter: 230, speed: 0.9 }), html: (t, a) => <Big t={t} at={a + 0.2} text="Taksimetre aynı. Yolcu aynı." y={80} size={64} /> },
  { c: "ama sen her gün", r: (t, a, b) => board(t, a, b, <Hand x={960} y={600} s={1.6} />, { bg: "#1A0E0E" }), html: (t, a) => <Big t={t} at={a + 0.5} text="Her gün −230 ₺" y={160} size={110} c="#FF6B6B" /> },
  { c: "Rıza abiye soruyorsun", r: (t, a, b) => kul(t, a, b, [{ o: SEN27, x: 500, s: 1.05, talk: true, look: 0.4, brow: "worry" }, { o: RIZA, x: 1300, s: 1.05, arms: "cross", look: -0.4, eyes: "half" }]), html: (t, a) => Q(t, a + 1.2, "Abi, yevmiyeden biraz insen?", 840, "#FFF", 54) },
  { c: "Cevap tek kelime", r: (t, a, b) => kul(t, a, b, [{ o: RIZA, x: 1100, s: 1.2, arms: "cross", talk: true, eyes: "half", mouth: "tight" }], { z: [1.6, 1.66], c0: [1100, 420] }), html: (t, a) => Q(t, a + 0.8, "Plaka da arttı.", 820, YEL, 80), sfx: "drone" },
  { c: "Aynı hafta", r: (t, a, b) => sok(t, a, b, <><Taksi x={960} y={1030} s={0.9} t={t} scratch={rp(t, a + 2, a + 2.6)} /><Dolmus x={lp(-700, 2600, rp(t, a + 0.6, a + 4))} y={1060} s={0.85} t={t} speed={1} /></>, { signs: ["OKMEYDANI", "BÜFE", "KUAFÖR"] }), sfx: "boom" },
  { c: "Dolmuşçu el sallayıp", r: (t, a, b) => sok(t, a, b, <><Taksi x={960} y={1030} s={0.9} t={t} scratch={1} /><Dolmus x={lp(1900, 2900, rp(t, a, b))} y={1060} s={0.85} t={t} speed={1} /></>, { z: [1.4, 1.5], c0: [740, 880], signs: ["OKMEYDANI", "BÜFE", "KUAFÖR"] }) },
  { c: "Kaportacı 6000", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]}><Sokak t={t} signs={["KAPORTA", "BOYA", "OTO"]} people={<>{P(t, { o: KAPORTACI, x: 700, s: 1, talk: true, arms: "hold", hold: <g /> })}</>} /><Paper x={1350} y={540} s={1.1} rot={4} title="KAPORTA" lines={["Arka kapı çizik", "Boya + düzeltme"]} stamp="6.000 ₺" /></HCam> },
  { c: "Rıza abinin ilk günkü", r: (t, a, b) => <><HCam t={t} a={a} b={b} z={[1.3, 1.36]} c0={[740, 480]}><Kulube t={t} people={P(t, { o: RIZA, x: 700, s: 1.1, arms: "cross", talk: true })} /></HCam><Sepia /></>, html: (t) => <Rules t={t} items={[["Hasar: senden", 0, "#FF6B6B"]]} />, tone: "gold" },
  // 8:50 · dip
  { c: "Ayın yarısı geçiyor", r: (t, a, b) => board(t, a, b, <Progress x={360} y={540} w={1200} v={0.5 * rp(t, a, a + 1.5)} label="Ay" c={YEL} right="yarısı" size={50} />) },
  { c: "Bir gece kiralık", tone: "night", r: (t, a, b) => oda(t, a, b, [{ o: SEN27, x: 1300, s: 0.95, look: -0.5, lookY: 0.6, brow: "worry" }], { extra: <><Zarf x={560} y={900} s={0.8} rot={-6} label="KİRA" fill={0.4} /><Zarf x={940} y={930} s={0.7} rot={5} label="ANNE" fill={0.3} /></> }) },
  { c: "Hesap tutmuyor", r: (t, a, b) => board(t, a, b, <><Progress x={360} y={420} w={1200} v={0.62 * rp(t, a, a + 1)} label="Kira · 21.000" c={YEL} size={46} /><Progress x={360} y={640} w={1200} v={0.4 * rp(t, a + 0.3, a + 1.3)} label="Anne · 5.000" c="#7FD4FF" size={46} /></>), html: (t, a) => <Big t={t} at={a + 1.5} text="Geridesin." y={860} size={80} c="#FF6B6B" /> },
  { c: "Tam o sırada annen", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[1300, 500]}><KoyEvi t={t} night />{P(t, { o: ANNE, x: 1300, s: 1, arms: "phone", talk: true, brow: "worry" })}</HCam>, html: (t, a) => Q(t, a + 1, "Oğlum, sesin yorgun geliyor.") },
  { c: "Daha iyi anne", tone: "night", r: (t, a, b) => oda(t, a, b, [{ o: SEN27, x: 960, s: 1.1, arms: "phone", talk: true, mouth: "smile", brow: "worry" }], { z: [1.4, 1.5], c0: [960, 450] }), html: (t, a) => Q(t, a + 0.1, "Daha iyi anne.") },
  { c: "telefonu kapatıp duvara", tone: "night", r: (t, a, b) => oda(t, a, b, [{ o: SEN27, x: 960, s: 1.1, eyes: "half", mouth: "sad", look: 0.6 }], { z: [1.5, 1.6], c0: [960, 440] }) },
  { c: "Ayın 14'ünde", r: (t, a, b) => board(t, a, b, cal(t, a, "KASIM", "14", "kiradan bir gün önce")) },
  { c: "Kirayla annenin", r: (t, a, b) => board(t, a, b, LED([["Gerekli", "26.000"], ["Elinde", "22.000"], ["EKSİK", "4.000"]], 3 * rp(t, a, a + 3), t > a + 3 ? 2 : -1, "14 Kasım"), { bg: "#2A241D" }), sfx: "drone" },
  { c: "Kemal abi grip", tone: "night", r: (t, a, b) => oda(t, a, b, [{ o: KEMAL, x: 960, s: 0.95, eyes: "half", mouth: "sad", tilt: -8, slump: 0.5 }], { z: [1.2, 1.3] }), html: (t, a) => <Big t={t} at={a + 0.3} text="Kemal Abi grip" y={80} size={64} /> },
  { c: "Rıza abi telefonda", tone: "night", r: (t, a, b) => ph(t, a, b, <CallScreen t={t} name="Rıza Abi" c="#E5322D" />, <Oda t={t} />), html: (t, a) => Q(t, a + 0.7, "Geceyi de sen sür. Gece yevmiyesi 3 bin.") },
  { c: "Kabul ediyorsun", r: (t, a, b) => ws(t, a, b, { eyes: "half", slump: 0.3, z: [1.2, 1.3], c0: [880, 480] }), html: (t, a) => <Big t={t} at={a + 0.8} text="07:00'den beri direksiyonda" y={80} size={58} /> },
  // 9:50 · doruk: E-5
  { c: "Gece yarısı Taksim'den", tone: "night", r: (t, a, b) => sok(t, a, b, <>{[600, 1000, 1400].map((x, i) => P(t, { o: [GENC, EMRE, TAKIM][i], x, s: 0.8, mouth: "grin", talk: true, seed: i }))}<Taksi x={lp(-500, 500, rp(t, a, a + 2))} y={1030} s={0.85} t={t} night /></>, { night: true, signs: ["TAKSİM", "BAR", "CAFE"] }), html: (t, a) => <Big t={t} at={a + 0.3} text="00:00" y={80} size={72} /> },
  { c: "Saat 2'de", tone: "night", r: (t, a, b) => ws(t, a, b, { night: true, lamps: true, eyes: "half", back: ANNE, z: [1.05, 1.1] }), html: (t, a) => <Big t={t} at={a + 0.1} text="02:00" y={80} size={72} /> },
  { c: "Saat 3'de", tone: "night", r: (t, a, b) => sok(t, a, b, <>{P(t, { o: TAKIM, x: 1200, s: 0.95, arms: "wave" })}<Taksi x={600} y={1030} s={0.85} t={t} night /></>, { night: true, signs: ["BEŞİKTAŞ", "BÜFE", "ECZANE"] }), html: (t, a) => <Big t={t} at={a + 0.1} text="03:00 · Havalimanı" y={80} size={68} c={YEL} /> },
  { c: "Yolcu arka koltukta", tone: "night", r: (t, a, b) => ws(t, a, b, { night: true, lamps: true, back: TAKIM, backEyes: "closed", eyes: "half", z: [1.05, 1.12] }) },
  { c: "Yol boş", tone: "night", r: (t, a, b) => pov(t, a, b, { road: "e5", meter: 1420, speed: 1.6 }) },
  { c: "Turuncu sokak", tone: "night", r: (t, a, b) => pov(t, a, b, { road: "e5", meter: 1460, speed: 2, z: [1.2, 1.3], c0: [1300, 400] }) },
  { c: "Radyo kısık", tone: "night", r: (t, a, b) => pov(t, a, b, { road: "e5", meter: 1490, speed: 1.6, radio: "♪  ·  ·  ·", z: [1.35, 1.4], c0: [960, 820] }) },
  { c: "Ve gözlerin", tone: "night", r: (t, a, b) => ws(t, a, b, { night: true, lamps: true, eyes: t > a + 2 ? "closed" : "half", slump: lp(0.3, 0.8, rp(t, a, b)), tilt: lp(0, 7, rp(t, a, b)), z: [1.4, 1.55], c0: [880, 460] }) },
  { c: "Saat 4", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1]}><Black /></HCam>, html: (t, a) => <Big t={t} at={a + 0.1} text="04:00" y={420} size={160} c="#FF9A3C" />, sfx: "tick" },
  { c: "Bir kamyonun kornası", tone: "night", r: (t, a, b) => pov(t, a, b, { road: "e5", meter: 1520, speed: 1.6, drift: 0.45, truck: rp(t, a, a + 0.8), lids: lp(0.8, 0, rp(t, a + 0.2, a + 0.8)) }), sfx: "boom" },
  { c: "Gözlerini açtığında", tone: "night", r: (t, a, b) => ws(t, a, b, { night: true, lamps: true, eyes: "wide", brow: "up", mouth: "o", z: [1.45, 1.5], c0: [880, 450] }) },
  { c: "Direksiyonu kırıyorsun", tone: "night", r: (t, a, b) => pov(t, a, b, { road: "e5", meter: 1520, speed: lp(1.6, 0.2, rp(t, a, b)), drift: lp(0.45, -0.1, rp(t, a, a + 1.5)) + Math.sin(t * 40) * 0.01 }), sfx: "whistle" },
  { c: "Araba emniyet şeridinde", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#05070D" /><rect y={760} width={1920} height={320} fill="#15181F" />{Array.from({ length: 6 }, (_, i) => <g key={i}><rect x={i * 360 + 80} y={300} width={10} height={460} fill="#2A2A33" /><circle cx={i * 360 + 85} cy={300} r={18} fill="#FF9A3C" /><circle cx={i * 360 + 85} cy={300} r={120} fill="#FF9A3C" opacity={0.12} /></g>)}<Taksi x={960} y={960} s={0.95} t={t} night /><g opacity={Math.sin(t * 8) > 0 ? 1 : 0.2}><circle cx={560} cy={800} r={20} fill="#FFB547" /><circle cx={1360} cy={800} r={20} fill="#FFB547" /></g></HCam> },
  { c: "Arka koltukta yolcu uyanıyor", tone: "night", r: (t, a, b) => ws(t, a, b, { night: true, back: TAKIM, backTalk: true, eyes: "wide", brow: "worry", z: [1.1, 1.15] }), html: (t, a) => Q(t, a + 1.2, "Bir şey mi oldu?") },
  { c: "Yok abi", tone: "night", r: (t, a, b) => ws(t, a, b, { night: true, talk: true, mouth: "tight", brow: "worry", z: [1.45, 1.5], c0: [880, 450] }), html: (t, a) => Q(t, a + 0.1, "Yok abi. Bir köpek çıktı.") },
  { c: "Ellerin titriyor", tone: "night", r: (t, a, b) => board(t, a, b, <><ellipse cx={960} cy={760} rx={640} ry={230} fill="none" stroke="#151515" strokeWidth={70} /><g transform={`translate(${Math.sin(t * 45) * 6},${Math.cos(t * 38) * 4})`}><Hand x={620} y={700} s={1.3} rot={-30} /><Hand x={1300} y={700} s={1.3} rot={210} /></g></>, { bg: "#080A10" }) },
  { c: "Aynaya bakıyorsun", tone: "night", r: (t, a, b) => board(t, a, b, <Nazar x={960} y={120} s={2.8} t={t} swing={0.4} crack={rp(t, a + 1.4, a + 2.4)} />, { bg: "#0B0E16", z: [1.1, 1.3], c0: [960, 560] }), sfx: "pop" },
  { c: "Annen hep söylerdi", tone: "night", r: (t, a, b) => board(t, a, b, <Nazar x={960} y={80} s={3.2} t={t} swing={0.2} crack={1} ring={false} />, { bg: "#0B0E16", z: [1.3, 1.45], c0: [960, 560] }), html: (t, a) => Q(t, a + 1.2, "Nazar boncuğu çatlarsa, bir kötülüğü üstüne almıştır.", 860, "#FFF", 48) },
  { c: "Yolcuyu havalimanına", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.08]}><Skyline t={t} mode="night" /><g transform={`translate(${lp(300, 1700, rp(t, a, b))},${lp(500, 180, rp(t, a, b))}) rotate(-12)`}><path d="M-120,0 L120,0 L150,-14 L120,-24 L-90,-24Z" fill="#DDE" /><path d="M-20,-14 L-80,-80 L-40,-80 L40,-14Z M-20,-8 L-60,40 L-30,40 L30,-8Z" fill="#BBC" /><circle cx={130} cy={-10} r={6} fill="#FF3B2F" /></g></HCam>, html: (t, a) => <Big t={t} at={a + 0.4} text="Havalimanı" y={80} size={64} /> },
  { c: "Sonra arabayı bir benzinliğe", tone: "night", r: (t, a, b) => ws(t, a, b, { night: true, eyes: "closed", arms: "desk", slump: 0.9, tilt: 10, z: [1.2, 1.3], c0: [880, 500] }) },
  { c: "O gece bir şeyi anlıyorsun", r: (t, a, b) => board(t, a, b, <g />, { bg: "#0B0B0F" }), html: (t, a) => <Big t={t} at={a + 1.2} text="4.000 ₺ için hayatını ortaya koydun." y={420} size={70} c="#FF6B6B" />, sfx: "drone" },
  // 11:20 · açılış: Kemal'in hikâyesi
  { c: "Sabah 7'de durağa", r: (t, a, b) => dur(t, a, b, [], { dawn: true, cars: 3, z: [1.1, 1.02] }) },
  { c: "Parayı sayıyor", r: (t, a, b) => kul(t, a, b, [{ o: RIZA, x: 960, s: 1.1, arms: "hold", hold: <Tomar x={0} y={0} s={0.6} n={12} />, lookY: 0.6, eyes: "half" }], { z: [1.25, 1.35], c0: [960, 520] }), html: (t, a) => <Big t={t} at={a + 1.5} text="3.500 + 3.000 = 6.500 ₺" sub="önce o" y={80} size={60} c={YEL} /> },
  { c: "Kulübenin köşesinde", r: (t, a, b) => kul(t, a, b, [{ o: KEMAL, x: 1500, s: 0.9, eyes: "half", slump: 0.3, look: -0.4 }, { o: SEN27, x: 450, s: 0.9, eyes: "half", slump: 0.5 }], { z: [1.05, 1.12], c0: [1100, 560] }) },
  { c: "Seni görünce", r: (t, a, b) => kul(t, a, b, [{ o: KEMAL, x: 1100, s: 1.15, brow: "worry", look: -0.5, mouth: "sad" }], { z: [1.45, 1.55], c0: [1100, 440] }) },
  { c: "o akşam söylemediği", r: (t, a, b) => kul(t, a, b, [{ o: KEMAL, x: 1250, s: 1, talk: true, eyes: "half", look: -0.5 }, { o: SEN27, x: 500, s: 1, look: 0.5, brow: "worry" }], { z: [1.1, 1.18] }) },
  { c: ["Otuz yıl önce", "30 yıl önce"], tone: "gold", r: (t, a, b) => <><HCam t={t} a={a} b={b} z={[1.05, 1.12]}><Durak t={t} cars={2} />{P(t, { o: RIZA_G, x: 500, s: 0.95, talk: true, look: 0.3 })}{P(t, { o: KEMAL_G, x: 820, s: 0.95, mouth: "smile", look: -0.3 })}</HCam><Sepia /></>, html: (t, a) => <AgeTag t={t} at={a + 0.4} age="30 yıl önce" place="aynı durak, iki yevmiyeci" /> },
  { c: "Bir gün bir plaka", tone: "gold", r: (t, a, b) => <><HCam t={t} a={a} b={b} z={[1, 1.1]}><rect width={1920} height={1080} fill="#2A241D" /><Plaka x={960} y={540} s={1.4} txt="34 T ····" price="SATILIK" c="#2BB673" k={rp(t, a, a + 0.6)} /></HCam><Sepia /></> },
  { c: "Rıza bütün akrabasından", tone: "gold", r: (t, a, b) => <><HCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[700, 500]}><Durak t={t} cars={1} />{P(t, { o: RIZA_G, x: 700, s: 1.05, arms: "hold", hold: <Tomar x={0} y={0} s={0.6} n={14} />, mouth: "tight", brow: "flat" })}</HCam><Sepia /></> },
  { c: "Ben korktum", tone: "gold", r: (t, a, b) => <><HCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 460]}><Durak t={t} cars={1} />{P(t, { o: KEMAL_G, x: 960, s: 1.1, eyes: "half", lookY: 0.6, mouth: "sad" })}</HCam><Sepia /></> },
  { c: "Rıza abi duymamış", r: (t, a, b) => board(t, a, b, <><rect width={1920} height={1080} fill="#2A241D" /><rect x={-100} y={420} width={2200} height={240} rx={100} fill={RIZA.top} transform="rotate(-8 960 540)" /><GoldWatch x={960} y={540} s={2.6} t={t} /></>, { z: [1.2, 1.35] }), sfx: "tick" },
  { c: "Aramızdaki fark", r: (t, a, b) => kul(t, a, b, [{ o: KEMAL, x: 1100, s: 1.15, talk: true, eyes: "half", look: -0.4 }], { z: [1.45, 1.55], c0: [1100, 440] }), html: (t, a) => Q(t, a + 0.3, "Fark akıl değildi. Cesaret de değildi.") },
  { c: "Sadece zamandı", r: (t, a, b) => board(t, a, b, <><line x1={260} y1={560} x2={1660} y2={560} stroke="#3A4150" strokeWidth={10} /><circle cx={360} cy={560} r={30} fill="#2BB673" />{tx(360, 480, "30 yıl önce", 44, "#DDD", 700, "middle")}{tx(360, 660, "ulaşılabilir", 40, "#2BB673", 700, "middle")}<g opacity={rp(t, a + 1.2, a + 1.8)}><circle cx={1560} cy={560} r={30} fill="#E5322D" />{tx(1560, 480, "Bugün", 44, "#DDD", 700, "middle")}{tx(1560, 660, "≈ 12 milyon ₺", 40, "#E5322D", 700, "middle")}</g></>), html: (t, a) => <Big t={t} at={a + 0.2} text="Sadece zamandı." y={80} size={72} c={YEL} /> },
  // 12:00 · defter
  { c: "Ve şimdi, söz verdiğimiz", r: (t, a, b) => board(t, a, b, LED(D1, 0, -1, "Ay sonu defteri"), { bg: "#2A241D", z: [1.2, 1.05] }), sfx: "pop" },
  { c: "Bu ay 26 gün", r: (t, a, b) => board(t, a, b, LED(D1, rp(t, a, a + 1), 0, "Ay sonu defteri"), { bg: "#2A241D" }), html: (t, a) => <Big t={t} at={a + 2} text="26 gün × ≈ 6.420 ₺" y={60} size={52} /> },
  { c: "abinin yevmiyeleri", r: (t, a, b) => board(t, a, b, LED(D1, 1 + rp(t, a, a + 1), 1, "Ay sonu defteri"), { bg: "#2A241D" }) },
  { c: "Otogaz, zamdan", r: (t, a, b) => board(t, a, b, LED(D1, 2 + rp(t, a, a + 1), 2, "Ay sonu defteri"), { bg: "#2A241D" }) },
  { c: "Yemek, çay, yıkama", r: (t, a, b) => board(t, a, b, LED(D1, 3 + rp(t, a, a + 1), 3, "Ay sonu defteri"), { bg: "#2A241D" }) },
  { c: "çizdiği kapı", r: (t, a, b) => board(t, a, b, LED(D1, 4 + rp(t, a, a + 1), 4, "Ay sonu defteri"), { bg: "#2A241D", z: [1.06, 1.1] }) },
  { c: "Geriye kalan", r: (t, a, b) => board(t, a, b, LED(D2, rp(t, a, a + 1), 0, "Ay sonu defteri"), { bg: "#2A241D" }), html: (t, a) => <Big t={t} at={a + 2} text="asgari ücretten (28.075,50) az" y={60} size={46} c="#FF6B6B" /> },
  { c: "Kira 21", r: (t, a, b) => board(t, a, b, LED(D2, 1 + 2 * rp(t, a, a + 2.5), t > a + 1.5 ? 2 : 1, "Ay sonu defteri"), { bg: "#2A241D" }) },
  { c: "Ay sonunda cebinde kalan", r: (t, a, b) => board(t, a, b, LED(D2, 4, 3, "Ay sonu defteri"), { bg: "#2A241D", z: [1.1, 1.3], c0: [960, 760] }), html: (t, a) => <Big t={t} at={a + 1.4} text="230 ₺" y={60} size={150} c={YEL} />, sfx: "boom" },
  { c: "Bir simit", r: (t, a, b) => board(t, a, b, <><Simit x={760} y={560} s={1.4} /><TeaGlass x={1280} y={700} s={2.4} t={t} /></>, { bg: "#2A241D" }) },
  // 12:40 · hüküm
  { c: "Peki gerçekten", r: (t, a, b) => ws(t, a, b, { look: 0, mouth: "flat", z: [1.4, 1.5], c0: [880, 450] }), html: (t, a) => <Big t={t} at={a + 0.3} text="Peki… gerçekten değer mi?" y={80} size={70} c={YEL} /> },
  { c: "Bu ay günde 12", r: (t, a, b) => board(t, a, b, <Clock x={960} y={420} s={1.2} h={7} m={0} spin={rp(t, a, b) * 40} />), html: (t, a) => <Counter t={t} a={a + 0.5} from={0} to={312} label="saat · bu ay" y={640} c={YEL} /> },
  { c: "Ve eline geçen", r: (t, a, b) => board(t, a, b, <Bars t={t} a={a} max={30000} rows={[["Net asgari ücret 2026", 28075.5, "28.075,50 ₺", "#5A6170"], ["Sen · bu ay", 26230, "26.230 ₺", "#E5322D"]]} />) },
  { c: "Üstelik sigortan yok", r: (t, a, b) => board(t, a, b, cards(t, a, ["Sigorta\nyok", "Her çizik\nsenin", "Bir gece\nE-5"], H.red)) },
  { c: "Ama haksızlık da", r: (t, a, b) => board(t, a, b, cards(t, a + 0.8, ["Sermaye:\n0 ₺", "Para her\nakşam elinde", "Yağmurlu gün =\nkuryenin haftası"], H.green)) },
  { c: "Ehliyetin ve şehri", r: (t, a, b) => board(t, a, b, <Ehliyet k={rp(t, a, a + 0.5)} />, { bg: "#0E1A12" }) },
  { c: "Paran her akşam", r: (t, a, b) => board(t, a, b, <><Hand x={760} y={600} s={1.5} /><Tomar x={1080} y={580} s={1.3} /></>, { bg: "#0E1A12", z: [1.05, 1.15] }), html: (t, a) => <Big t={t} at={a + 0.5} text="Para her akşam elinde" y={90} size={70} c="#5CF08E" /> },
  { c: "yağmurlu bir perşembede", tone: "cool", r: (t, a, b) => pov(t, a, b, { road: "rain", meter: 7800, speed: 0.9 }), html: (t, a) => <Big t={t} at={a + 0.8} text="1 iyi gün = kuryenin 1 haftası" y={80} size={60} c={YEL} /> },
  { c: "bir meslek değil", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.1]}><Door t={t} open={rp(t, a + 0.5, a + 2)} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="Bir meslek değil, bir kapı" y={80} size={68} c={YEL} /> },
  { c: "Ama o kapıdan", r: (t, a, b) => kul(t, a, b, [{ o: KEMAL, x: 960, s: 1.15, eyes: "half", mouth: "sad", lookY: 0.3 }], { night: true, z: [1.35, 1.45], c0: [960, 450] }), html: (t, a) => <Big t={t} at={a + 1.5} text="30 yıl kalırsan… Kemal Abi olursun" y={840} size={56} /> },
  { c: "Zorluk", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.05]}><rect width={1920} height={1080} fill="#0E1016" /></HCam>, html: (t, a) => <Verdict t={t} a={a} rows={[["Zorluk", 9], ["Sermaye", 1], ["Sabır", 8]]} title="İstanbul'da yevmiyeli taksici olmak" /> },
  { c: "Ve son olarak", r: (t, a, b) => dur(t, a, b, [], { dawn: true, cars: 3, z: [1, 1.1], c0: [1200, 600] }) },
  { c: "Bir dahaki sefere", r: (t, a, b) => ws(t, a, b, { back: GENC, backTalk: true, mouth: "smile", look: 0.2, z: [1.1, 1.2] }), html: (t, a) => Q(t, a + 2.5, "Bugün kaç yaptın abi?", 820, YEL, 70) },
  // 13:10 · çağrı
  { c: "Sırada hangi meslek", r: (t, a, b) => board(t, a, b, cards(t, a + 0.3, ["Kurye?", "Fırıncı?", "Berber?"], YEL)) },
  { c: "Hangi mesleği yaşamak", r: (t, a, b) => { const msg = "Bence sıradaki: ..."; const n = Math.floor(rp(t, a + 0.8, a + 3) * msg.length); return board(t, a, b, <g transform="translate(960,460)"><rect x={-680} y={-170} width={1360} height={340} rx={30} fill="#1A1E27" /><circle cx={-560} cy={-60} r={50} fill={YEL} />{tx(-480, -50, "Yorum ekle…", 44, "#AAA", 600)}{tx(-480, 60, msg.slice(0, n), 48, "#FFF", 600)}</g>); } },
  { c: "Sıradaki videoyu", r: (t, a, b) => dur(t, a, b, [], { dawn: true, cars: 3, z: [1.05, 1.12] }), html: (t, a) => <SubBtn t={t} at={a + 1.2} /> },
];

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K6_07_SECONDS));
  return raw;
})();
// kuralların çıkış anları (Rıza konuşurken)
(() => {
  const a = TIMED.find((x) => x.c === "Yevmiye 3500")!.from;
  ruleAt.y = a + 0.3; ruleAt.s = cue("sabah 7'den", a); ruleAt.b = cue("Benzin, yıkama", a); ruleAt.h = cue("Arabaya bir şey", a);
})();

export const K6Video07: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const fadeIn = rp(t, 0, 0.4);
  const cutFlash = 1 - rp(t, s.from, s.from + 0.12);
  const fadeOut = 1 - rp(t, K6_07_SECONDS - 1.5, K6_07_SECONDS);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
        <HFrame>
          {s.r(t, s.from, s.to)}
          <Atmos t={t} tone={s.tone ?? "warm"} dust={0.4} rays={0.3} seed={n} />
          <Sweep t={t} a={s.from} />
        </HFrame>
        {s.html?.(t, s.from, s.to)}
        <AbsoluteFill style={{ background: "#FFFFFF", opacity: cutFlash * 0.16, pointerEvents: "none" }} />
      </AbsoluteFill>
      <Audio src={staticFile("audio/k6-07.wav")} />
      {TIMED.map((x, i) => i > 0 && x.to < K6_07_SECONDS - 15 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.sfx === "knock" ? 0.08 : x.sfx === "boom" || x.sfx === "drone" ? 0.12 : x.sfx ? 0.15 : 0.07} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
