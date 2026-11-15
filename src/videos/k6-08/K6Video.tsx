import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k6-08-words.json";
import { makeCue } from "../../lib/cues";
import { Atmos, Sweep, Tone } from "../../components/Live";
import { AgeTag, Big, Counter, H, HArms, HBrow, HCam, HFrame, HMouth, Look, News, Person, Phone, SubBtn, TeaGlass, Verdict, lp, rp } from "../../components/Hayat";
import { Defter } from "../../components/HayatCarsi";
import { Snow } from "../../components/HayatYayin";
import {
  BABA_K, Bordro, ELIF, ELIF_EV, EksikParmak, EvGebze, FabrikaDis, HAKAN, Hangar, ISCI, IkiEl, IsAyakkabi, KabloMasa, KapiSac, Kart, KoySoba, Komur,
  NURIYE, Pano, Pres, SENK, SENK_EV, SERKAN, Servis, ServisIc, Tepsi, TestMasa, Turnike, Yemekhane,
} from "../../components/HayatFabrika";

// Kanal 4 · k6-08 · "Asgari Ücretle Fabrikada Çalışsan, Ay Sonunda Cebinde Ne Kalır?"
// Ses: Gemini TTS (Achird, gemini-3.8-flash-tts), 4 parça; kelime zamanları faster-whisper (4 dk parçalar). Sıkıştırıldı (tighten).

const W = words as { text: string; start: number; end: number }[];
const cue = makeCue(W);
const VOICE_END = W[W.length - 1].end;
export const K6_08_SECONDS = Math.ceil(VOICE_END + 4);
type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string | string[]; r: R; html?: R; sfx?: string; tone?: Tone };

const UI = "Poppins";
const YEL = "#FFE27A", RED = "#FF6B6B", GRN = "#5CF08E";
const tx = (x: number, y: number, s: string, size = 24, c = "#FFF", w = 600, anchor: "start" | "middle" | "end" = "start") => <text x={x} y={y} fontFamily={UI} fontWeight={w} fontSize={size} fill={c} textAnchor={anchor}>{s}</text>;
type Z = { z?: [number, number]; c0?: [number, number]; c1?: [number, number] };

// ───────── yardımcılar
type PP = { o: Look; x: number; y?: number; s?: number; arms?: HArms; mouth?: HMouth; brow?: HBrow; eyes?: "open" | "wide" | "closed" | "half"; look?: number; lookY?: number; talk?: boolean; hold?: React.ReactNode; slump?: number; tilt?: number; seed?: number; dir?: 1 | -1 };
const P = (t: number, p: PP) => <Person key={p.x} x={p.x} y={p.y ?? 1090} s={p.s ?? 0.9} t={t} o={p.o} arms={p.arms ?? "down"} mouth={p.mouth ?? "flat"} brow={p.brow} eyes={p.eyes} look={p.look ?? 0} lookY={p.lookY ?? 0} talk={p.talk} hold={p.hold} slump={p.slump} tilt={p.tilt} seed={p.seed ?? p.x} dir={p.dir} />;
const ppl = (t: number, l: PP[]) => <>{l.map((x) => P(t, x))}</>;
const cam = (t: number, a: number, b: number, node: React.ReactNode, p: Z & { k?: number } = {}, dz: [number, number] = [1, 1.08]) => <HCam t={t} a={a} b={b} z={p.z ?? dz} c0={p.c0} c1={p.c1} k={p.k}>{node}</HCam>;

const fd = (t: number, a: number, b: number, p: Z & { mode?: "dawn" | "night" | "day"; people?: PP[]; extra?: React.ReactNode; walkers?: number } = {}) =>
  cam(t, a, b, <FabrikaDis t={t} mode={p.mode ?? "dawn"} walkers={p.walkers} people={<>{p.extra}{ppl(t, p.people ?? [])}</>} />, p, [1, 1.08]);
const tur = (t: number, a: number, b: number, p: Z & { at?: number; state?: "green" | "red"; shake?: number; off?: number } = {}) =>
  cam(t, a, b, <Turnike t={t} a={a - (p.off ?? 0)} at={p.at ?? 1.2} state={p.state} shake={p.shake} />, p, [1.02, 1.1]);
const han = (t: number, a: number, b: number, people: PP[], p: Z & { night?: boolean; empty?: boolean; fork?: boolean; sign?: string; extra?: React.ReactNode } = {}) =>
  cam(t, a, b, <Hangar t={t} night={p.night} empty={p.empty} fork={p.fork} sign={p.sign} people={<>{ppl(t, people)}{p.extra}</>} />, { ...p, c0: p.c0 ?? [960, 560] }, [1.1, 1.18]);
const kab = (t: number, a: number, b: number, p: Z & { k?: number; wrong?: number; speed?: number } = {}) =>
  cam(t, a, b, <KabloMasa t={t} k={p.k ?? 1} wrong={p.wrong} speed={p.speed} />, { z: p.z, c0: p.c0, c1: p.c1 }, [1.02, 1.12]);
const yem = (t: number, a: number, b: number, people: PP[], p: Z & { crowd?: number; extra?: React.ReactNode } = {}) =>
  cam(t, a, b, <Yemekhane t={t} crowd={p.crowd} people={<>{ppl(t, people)}{p.extra}</>} />, { ...p, c0: p.c0 ?? [960, 560] }, [1.1, 1.18]);
const ev = (t: number, a: number, b: number, people: PP[], p: Z & { morning?: boolean; heater?: boolean; extra?: React.ReactNode } = {}) =>
  cam(t, a, b, <EvGebze t={t} morning={p.morning} heater={p.heater ?? true} people={<>{p.extra}{ppl(t, people)}</>} />, { ...p, c0: p.c0 ?? [960, 560] }, [1.1, 1.18]);
const koy = (t: number, a: number, b: number, people: PP[], p: Z & { fire?: number; empty?: boolean; snow?: boolean } = {}) =>
  cam(t, a, b, <KoySoba t={t} fire={p.fire} empty={p.empty} snow={p.snow} people={ppl(t, people)} />, { ...p, c0: p.c0 ?? [960, 560] }, [1.06, 1.14]);
const cyc = (t: number, per = 2.4, off = 0) => { const k = (((t + off) % per) + per) % per / per; return k < 0.18 ? (k / 0.18) ** 2 : k < 0.4 ? 1 - (k - 0.18) / 0.22 : 0; };
const pres = (t: number, a: number, b: number, p: Z & { ram?: number; cut?: boolean; alarm?: boolean; hand?: number; part?: "sac" | "kapi" | "yamuk"; day?: boolean } = {}) =>
  cam(t, a, b, <Pres t={t} ram={p.ram ?? cyc(t)} cut={p.cut} alarm={p.alarm} hand={p.hand} part={p.part} night={!p.day} />, p, [1.02, 1.1]);
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
const call = (name: string, sub = "arıyor…") => (
  <g><rect width={360} height={740} fill="#1B2440" /><circle cx={180} cy={250} r={70} fill="#4A5A7A" />{tx(180, 272, name[0], 64, "#FFF", 700, "middle")}{tx(180, 380, name, 34, "#FFF", 700, "middle")}{tx(180, 420, sub, 22, "#AAB4C8", 600, "middle")}<circle cx={90} cy={620} r={40} fill="#E5322D" /><circle cx={270} cy={620} r={40} fill="#2BB673" /></g>
);
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
const Q = (t: number, at: number, text: string, y = 820, c = YEL, size = 60) => <Big t={t} at={at} text={`“${text}”`} y={y} size={size} c={c} />;
const LED = (rows: [string, string][], n: number, hi: number, title: string) => <Defter x={960} y={560} s={1.25} rows={[["", ""], ...rows]} k={(n + 1) / (rows.length + 1)} hi={hi < 0 ? -1 : hi + 1} title={title} />;
const Simit: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><circle r={130} fill="none" stroke="#B9772F" strokeWidth={76} /><circle r={130} fill="none" stroke="#D69A4E" strokeWidth={50} />{Array.from({ length: 40 }, (_, i) => <ellipse key={i} cx={Math.cos(i * 0.9) * (110 + (i % 3) * 18)} cy={Math.sin(i * 0.9) * (110 + (i % 3) * 18)} rx={6} ry={3} fill="#F6E7C8" transform={`rotate(${i * 30} ${Math.cos(i * 0.9) * 120} ${Math.sin(i * 0.9) * 120})`} />)}</g>
);
const Valiz: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}><rect x={-200} y={-260} width={400} height={480} rx={30} fill="#7A3B2E" /><rect x={-60} y={-320} width={120} height={70} rx={20} fill="none" stroke="#333" strokeWidth={18} />{[-120, 120].map((xx) => <rect key={xx} x={xx - 10} y={-260} width={20} height={480} fill="#5E2C22" />)}<g transform="translate(300,140)"><path d="M-40,-160 L40,-160 L40,20 Q40,60 0,60 L-90,60 Q-120,60 -120,30 Q-120,0 -90,0 L-40,0Z" fill="#C94C4C" />{[0, 1, 2].map((i) => <rect key={i} x={-40} y={-140 + i * 50} width={80} height={14} fill="#F2D06B" />)}</g></g>
);
const comment = (t: number, a: number) => { const msg = "Bence sıradaki: ..."; const n = Math.floor(rp(t, a + 0.8, a + 3) * msg.length); return <g transform="translate(960,460)"><rect x={-680} y={-170} width={1360} height={340} rx={30} fill="#1A1E27" /><circle cx={-560} cy={-60} r={50} fill={YEL} />{tx(-480, -50, "Yorum ekle…", 44, "#AAA", 600)}{tx(-480, 60, msg.slice(0, n), 48, "#FFF", 600)}</g>; };
const sum = (t: number, a: number, lines: [string, string][]) => (
  <g>{lines.map(([l, r], i) => { const k = rp(t, a + i * 1.2, a + i * 1.2 + 0.4); return <g key={i} opacity={k} transform={`translate(0,${(1 - k) * 30})`}>{tx(380, 380 + i * 170, l, 70, "#E8E8E8", 600)}{tx(1540, 380 + i * 170, r, 84, i === lines.length - 1 ? YEL : "#FFF", 700, "end")}</g>; })}</g>
);

const D1: [string, string][] = [["Maaş (net)", "28.075,50"], ["Kira payı", "−9.500"], ["Faturalar", "−2.400"], ["Mutfak", "−6.800"], ["Telefon", "−650"], ["Kalan", "8.725,50"]];
const D2: [string, string][] = [["Net asgari ücret", "28.075,50"], ["Mesai · 32 saat", "+4.800"], ["Kira payı", "−9.500"], ["Faturalar", "−2.400"], ["Mutfak", "−6.800"], ["Telefon", "−650"], ["Kömür", "−14.000"]];
const BOR1: [string, string][] = [["Brüt ücret", "33.030,00"], ["SGK + işsizlik (%15)", "−4.954,50"], ["Gelir vergisi", "0,00 · muaf"], ["Damga vergisi", "0,00 · muaf"]];
const BOR2: [string, string][] = [["1 saat fazla mesai (brüt)", "220,20"], ["SGK + işsizlik (%15)", "−33,03"], ["Gelir vergisi", "−37,43"], ["Damga vergisi", "−1,67"]];
const FNAME = "SEN · Sicil 4718";

const SHOTS: Sh[] = [
  // 0:00 · kanca: turnike
  { c: ["Sabah altıya", "Sabah altıyı"], r: (t, a, b) => fd(t, a, b, { z: [1.12, 1.0], walkers: 7 }), html: (t, a) => <Big t={t} at={a + 0.4} text="06:44" sub="Gebze Organize Sanayi" y={80} size={90} /> },
  { c: "Hava daha", r: (t, a, b) => fd(t, a, b, { z: [1.25, 1.4], c0: [1000, 760], walkers: 9 }) },
  { c: "Önünde demir", r: (t, a, b) => tur(t, a, b, { at: 9 }) },
  { c: "Kartı okutuyorsun", r: (t, a, b) => tur(t, a, b, { at: 1.0, z: [1.05, 1.15], c0: [900, 420] }), sfx: "ding" },
  { c: "Yeşil ışık", r: (t, a, b) => fd(t, a, b, { z: [1.4, 1.5], c0: [1000, 780], walkers: 10 }) },
  { c: "Bu bip sesini", r: (t, a, b) => tur(t, a, b, { at: 0.4, z: [1.3, 1.45], c0: [860, 300] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Bu sesi aklında tut" y={820} size={66} c={YEL} /> },
  { c: "o ses çalmadan", r: (t, a, b) => tur(t, a, b, { at: 20, shake: 1, z: [1.1, 1.2], c0: [1200, 500] }), tone: "cool" },
  { c: "Ve bu ayın bir gecesinde", tone: "night", r: (t, a, b) => pres(t, a, b, { z: [1.0, 1.08] }), html: (t, a) => <Big t={t} at={a + 1.2} text="04:00" y={80} size={90} />, sfx: "boom" },
  { c: "olmaması gereken", tone: "night", r: (t, a, b) => pres(t, a, b, { ram: 0, hand: rp(t, a, b) * 0.55, z: [1.15, 1.3], c0: [960, 600] }), sfx: "drone" },
  { c: "Oraya da geleceğiz", tone: "night", r: (t, a, b) => pres(t, a, b, { z: [1.3, 1.0], c0: [960, 500] }) },
  // söz: defter
  { c: "Ama önce sana", r: (t, a, b) => board(t, a, b, LED([["Gelen", "?"], ["Giden", "?"]], 0, -1, "Ay sonu defteri"), { bg: "#2A241D" }) },
  { c: "Eline geçen her", r: (t, a, b) => board(t, a, b, LED([["Gelen", "?"], ["Giden", "?"]], rp(t, a, a + 2) * 2, -1, "Ay sonu defteri"), { bg: "#2A241D", z: [1.05, 1.15] }) },
  { c: "Ve birlikte göreceğiz", r: (t, a, b) => fd(t, a, b, { mode: "day", z: [1.0, 1.1] }), html: (t, a) => <Big t={t} at={a + 0.5} text="Asgari ücretle fabrikada…" sub="ay sonunda cebinde ne kalır?" y={90} size={70} c={YEL} /> },
  // 0:35 · sen
  { c: ["Yirmi üç yaşında", "23 yaşında"], r: (t, a, b) => koy(t, a, b, [{ o: SENK_EV, x: 560, s: 1.05, look: 0.3 }], { fire: 1, snow: false }), html: (t, a) => <AgeTag t={t} at={a + 0.4} age="23 yaşında" place="Yozgat, bir köy" /> },
  { c: "Liseyi bitirdin", r: (t, a, b) => koy(t, a, b, [{ o: SENK_EV, x: 560, s: 1.15, look: 0.5, mouth: "smile" }], { fire: 1, snow: false, z: [1.25, 1.35], c0: [700, 520] }) },
  { c: "bir de ilçede", r: (t, a, b) => board(t, a, b, cards(t, a, ["İlçede\nkasiyer", "Sigorta:\nyok"], H.red)) },
  { c: "Bir akşam halanın", r: (t, a, b) => ph(t, a, b, call("Elif", "halamın kızı · arıyor…"), <KoySoba t={t} snow={false} />), sfx: "ding" },
  { c: ["3 yıldır Gebze", "Üç yıldır Gebze"], r: (t, a, b) => han(t, a, b, [{ o: ELIF, x: 900, s: 1.1, arms: "phone", talk: true, mouth: "smile", look: 0.2 }]), html: (t, a) => <AgeTag t={t} at={a + 0.4} age="Elif" place="3 yıldır Gebze'de, otomotiv yan sanayi" /> },
  { c: "Kız, bizim fabrika", r: (t, a, b) => board(t, a, b, cards(t, a + 0.4, ["Sigorta", "Servis", "Yemek"], H.green)), html: (t, a) => Q(t, a + 0.2, "Gel, evimde bir oda boş.", 860, YEL, 56) },
  { c: "Ama sen başka", tone: "cool", r: (t, a, b) => koy(t, a, b, [{ o: SENK_EV, x: 1300, s: 1.05, look: -0.6, mouth: "tight" }], { empty: true, snow: false, z: [1.1, 1.2], c0: [900, 560] }) },
  { c: "Kış geliyor", tone: "cool", r: (t, a, b) => board(t, a, b, <Komur x={960} y={780} s={1.4} empty />, { bg: "#1A1712" }), html: (t, a) => <Big t={t} at={a + 0.5} text="Kömürlük boş" y={90} size={76} c={RED} /> },
  { c: "Babanın belinden", tone: "cool", r: (t, a, b) => koy(t, a, b, [{ o: BABA_K, x: 1250, s: 1.05, slump: 0.6, eyes: "half", mouth: "sad" }], { empty: true, snow: false, z: [1.25, 1.35], c0: [1200, 520] }) },
  { c: "İki ton kömür", r: (t, a, b) => board(t, a, b, <Komur x={600} y={820} s={1.1} n={4} />, { bg: "#1A1712" }), html: (t, a) => <div style={{ position: "absolute", left: 760, right: 0, top: 0 }}><Counter t={t} a={a + 0.3} from={0} to={14000} label="₺ · 2 ton, nakliye dahil" y={360} c={YEL} /></div> },
  { c: "Ve kar yağmadan", tone: "cool", r: (t, a, b) => board(t, a, b, <>{cal(t, a, "ARALIK", "1. hafta")}<Snow t={t} n={60} /></>, { bg: "#1B2438" }) },
  { c: "Yani bu ayın sonunda", r: (t, a, b) => board(t, a, b, <g />, { bg: "#140E06" }), html: (t, a) => <Big t={t} at={a + 0.3} text="Hedef: 14.000 ₺" sub="ay sonunda cebinde" y={380} size={140} c={YEL} />, sfx: "boom" },
  { c: "Bir valiz", r: (t, a, b) => board(t, a, b, <Valiz x={860} y={580} s={1.1} />, { bg: "#2A241D", z: [1.05, 1.15] }) },
  // 1:30 · Gebze
  { c: "Elif'in evi", r: (t, a, b) => ev(t, a, b, [{ o: ELIF_EV, x: 560, s: 1.0, talk: true, mouth: "smile", look: 0.4 }, { o: SENK_EV, x: 1360, s: 1.0, look: -0.4, arms: "hold", hold: <Valiz x={0} y={0} s={0.25} /> }]) },
  { c: ["Kira 19", "Kira on dokuz"], r: (t, a, b) => ev(t, a, b, [{ o: ELIF_EV, x: 560, s: 1.0, look: 0.4 }, { o: SENK_EV, x: 1360, s: 1.0, look: -0.4 }], { z: [1.2, 1.3], c0: [1100, 500] }), html: (t, a) => <Big t={t} at={a + 0.3} text="Kira 19.000 ₺" sub="senin payın: 9.500 ₺" y={80} size={76} c={YEL} /> },
  { c: "Pazartesi sabahı", r: (t, a, b) => fd(t, a, b, { walkers: 0, extra: <Servis x={lp(-500, 1100, rp(t, a, a + 4))} y={1040} s={0.75} t={t} speed={1} />, z: [1.0, 1.06] }), html: (t, a) => <Big t={t} at={a + 0.4} text="06:00" y={80} size={80} /> },
  { c: "Beyaz bir minibüs", tone: "cool", r: (t, a, b) => cam(t, a, b, <ServisIc t={t} people={ppl(t, [{ o: ISCI, x: 360, s: 0.95, eyes: "closed", tilt: 10 }, { o: SENK, x: 860, s: 0.95, eyes: "half", look: -0.5 }, { o: NURIYE, x: 1360, s: 0.95, eyes: "closed", tilt: -8 }])} />, {}, [1.05, 1.12]) },
  { c: "Sadece radyoda", tone: "cool", r: (t, a, b) => cam(t, a, b, <ServisIc t={t} people={ppl(t, [{ o: SENK, x: 860, s: 0.95, eyes: "closed", tilt: 8 }])} />, { z: [1.4, 1.6], c0: [1500, 260] }) },
  // 2:00 · fabrika
  { c: "Fabrikada seni", r: (t, a, b) => han(t, a, b, [{ o: HAKAN, x: 760, s: 1.05, arms: "hold", hold: <rect x={-60} y={-80} width={120} height={160} rx={10} fill="#222" />, look: 0.3 }, { o: SENK, x: 1300, s: 1.0, look: -0.4 }]), html: (t, a) => <AgeTag t={t} at={a + 0.5} age="Hakan Bey" place="ustabaşı" /> },
  { c: "Hoş geldin", r: (t, a, b) => han(t, a, b, [{ o: HAKAN, x: 900, s: 1.2, talk: true, mouth: "smile", look: 0.2 }], { z: [1.35, 1.45], c0: [900, 460] }), html: (t, a) => Q(t, a + 0.3, "Hoş geldin. Önce ayakkabı.") },
  { c: "Sana burnu çelik", r: (t, a, b) => board(t, a, b, <IsAyakkabi x={960} y={600} s={1.6} />, { bg: "#1E232D", z: [1.05, 1.2] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Burnu çelik iş ayakkabısı" y={90} size={60} /> },
  { c: "Ve o plastik kartı", r: (t, a, b) => board(t, a, b, <Kart x={960} y={540} s={2.6} rot={-4} name={FNAME} />, { bg: "#1E232D", z: [1.0, 1.12] }) },
  { c: "Bu kart senin", r: (t, a, b) => han(t, a, b, [{ o: HAKAN, x: 900, s: 1.2, talk: true, arms: "cross", look: 0.2 }], { z: [1.35, 1.42], c0: [900, 460] }), html: (t, a) => Q(t, a + 1.5, "Unutursan, o gün yokmuşsun.") },
  { c: "İlk görevin", r: (t, a, b) => kab(t, a, b, { k: rp(t, a, a + 4), z: [1.0, 1.08] }) },
  { c: "Renkli kablolar", r: (t, a, b) => kab(t, a, b, { z: [1.3, 1.45], c0: [900, 520] }), html: (t, a) => <Big t={t} at={a + 1.4} text="Saatte 70 parça" y={80} size={76} c={YEL} /> },
  { c: "İlk saatin sonunda", r: (t, a, b) => kab(t, a, b, { speed: 1.5, z: [1.5, 1.6], c0: [960, 700] }) },
  { c: "burada kimse sana", r: (t, a, b) => han(t, a, b, [{ o: HAKAN, x: 560, s: 1.0, arms: "cross", look: 0.4 }, { o: SENK, x: 1300, s: 1.0, arms: "type", look: -0.3, brow: "worry" }]), html: (t, a) => Q(t, a + 1.8, "Hızlı ol.", 820, RED, 80) },
  { c: "Üçüncü gün", r: (t, a, b) => kab(t, a, b, { wrong: rp(t, a + 1.5, a + 2.2), z: [1.1, 1.35], c0: [1250, 380] }) },
  { c: "Ama bandın sonunda", r: (t, a, b) => cam(t, a, b, <TestMasa t={t} a={a} at={1.6} />, {}, [1.02, 1.1]), sfx: "buzz" },
  { c: "Üstüne kırmızı", r: (t, a, b) => cam(t, a, b, <TestMasa t={t} a={a - 3} />, { z: [1.4, 1.55], c0: [1080, 840] }) },
  { c: "Hakan Bey yanına", r: (t, a, b) => han(t, a, b, [{ o: HAKAN, x: 700, s: 1.05, look: 0.4 }, { o: SENK, x: 1250, s: 1.0, look: -0.4, eyes: "half", mouth: "tight" }], { z: [1.15, 1.22] }) },
  { c: "Bu kablo bir arabanın", r: (t, a, b) => han(t, a, b, [{ o: HAKAN, x: 900, s: 1.2, talk: true, look: 0.2 }], { z: [1.35, 1.45], c0: [900, 460] }), html: (t, a) => Q(t, a + 1.6, "Biz hata yaparsak, birileri yolda hata yapamaz.", 820, YEL, 50) },
  { c: "O günden sonra", r: (t, a, b) => kab(t, a, b, { speed: 0.6, z: [1.2, 1.3], c0: [960, 560] }), html: (t, a) => <Big t={t} at={a + 0.5} text="Her kablo: 2 kontrol" y={80} size={64} /> },
  // 3:20 · yemekhane
  { c: "Öğlen yemekhaneye", r: (t, a, b) => yem(t, a, b, [], { crowd: 9, z: [1.0, 1.08] }) },
  { c: "Metal bir tepsi", r: (t, a, b) => board(t, a, b, <Tepsi x={960} y={560} s={1.4} t={t} />, { bg: "#B9AE98", z: [1.0, 1.1] }) },
  { c: "Kasada çalışırken", r: (t, a, b) => board(t, a, b, <Tepsi x={960} y={560} s={1.4} t={t} />, { bg: "#B9AE98", z: [1.15, 1.25] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Öğle yemeği: 150 ₺ → 0 ₺" y={80} size={66} c={GRN} /> },
  { c: ["Masanda 50", "Masanda elli"], r: (t, a, b) => yem(t, a, b, [{ o: NURIYE, x: 640, s: 1.05, look: 0.3, arms: "desk" }, { o: SENK, x: 1300, s: 1.0, look: -0.4, arms: "desk" }]), html: (t, a) => <AgeTag t={t} at={a + 0.8} age="Nuriye Abla" place="20 yıldır bu fabrikada" /> },
  { c: "Çayını karıştırırken", r: (t, a, b) => board(t, a, b, <EksikParmak x={1100} y={600} s={1.6} t={t} />, { bg: "#E8E2D2", z: [1.05, 1.2], c0: [1200, 560] }) },
  { c: "Bakışını yakalıyor", r: (t, a, b) => yem(t, a, b, [{ o: NURIYE, x: 900, s: 1.2, talk: true, mouth: "smile", look: 0.2 }], { z: [1.35, 1.45], c0: [900, 470] }), html: (t, a) => Q(t, a + 1.0, "Pres hattı, kızım. Doksanlarda.") },
  { c: "Sonra ciddileşiyor", r: (t, a, b) => pres(t, a, b, { day: true, ram: 0, z: [1.0, 1.06] }), html: (t, a) => <Big t={t} at={a + 1.4} text="Işık perdesi" y={80} size={76} c={YEL} /> },
  { c: ["Elini makine", "Elini makinenin"], r: (t, a, b) => pres(t, a, b, { day: true, ram: 0.2, hand: rp(t, a, a + 1.2) * 0.8, cut: t > a + 1.2, alarm: t > a + 1.3, z: [1.1, 1.2] }), sfx: "buzz" },
  { c: "Ama bir gün biri", r: (t, a, b) => yem(t, a, b, [{ o: NURIYE, x: 900, s: 1.25, talk: true, brow: "worry", look: 0.1 }], { z: [1.45, 1.55], c0: [900, 450] }), html: (t, a) => Q(t, a + 2.6, "Sakın bantlama.", 820, RED, 84), sfx: "drone" },
  // 4:30 · bordro
  { c: "Ay başı geliyor", r: (t, a, b) => board(t, a, b, <Bordro k={rp(t, a, a + 0.6)} rows={BOR1} net="28.075,50 ₺" />, { bg: "#2A241D" }) },
  { c: "Bu, Türkiye", r: (t, a, b) => board(t, a, b, <Bordro rows={BOR1} net="28.075,50 ₺" hi={0} />, { bg: "#2A241D", z: [1.15, 1.3], c0: [960, 800] }), html: (t, a) => <Big t={t} at={a + 0.4} text="2026 net asgari ücret" y={60} size={56} c={YEL} /> },
  { c: "Hesabı yapıyorsun", r: (t, a, b) => board(t, a, b, LED(D1, 1 + rp(t, a + 1, a + 5) * 2, -1, "Ay sonu defteri"), { bg: "#2A241D" }) },
  { c: "Mutfak ve market", r: (t, a, b) => board(t, a, b, LED(D1, 3 + rp(t, a + 0.5, a + 3) * 2, -1, "Ay sonu defteri"), { bg: "#2A241D", z: [1.05, 1.12] }) },
  { c: "Geriye", r: (t, a, b) => board(t, a, b, LED(D1, 6, 5, "Ay sonu defteri"), { bg: "#2A241D", z: [1.1, 1.25], c0: [960, 760] }), html: (t, a) => <Big t={t} at={a + 0.5} text="8.725,50 ₺" y={60} size={110} c={YEL} /> },
  { c: "Kömüre ise", r: (t, a, b) => board(t, a, b, <Komur x={960} y={820} s={1.2} n={4} />, { bg: "#1A1712" }), html: (t, a) => <><Big t={t} at={a + 0.3} text="Kömür: 14.000 ₺" y={60} size={70} /><Big t={t} at={a + 1.8} text="Eksik: 5.274,50 ₺" y={200} size={90} c={RED} /></>, sfx: "boom" },
  { c: "Evet, yanlış", tone: "cool", r: (t, a, b) => ev(t, a, b, [{ o: SENK_EV, x: 760, s: 1.1, slump: 0.6, eyes: "half", mouth: "sad", lookY: 0.3 }], { z: [1.2, 1.3], c0: [860, 520] }) },
  { c: "Ve fabrikada bunun", r: (t, a, b) => han(t, a, b, [], { z: [1.0, 1.08] }), html: (t, a) => <Big t={t} at={a + 1.4} text="Tek çözüm: fazla mesai" y={80} size={76} c={YEL} /> },
  { c: "Hakan Bey anlatıyor", r: (t, a, b) => han(t, a, b, [{ o: HAKAN, x: 900, s: 1.2, talk: true, look: 0.2 }], { z: [1.35, 1.42], c0: [900, 460] }), html: (t, a) => Q(t, a + 1.0, "Cumartesi mesaisi var. Bir buçuk kat.") },
  { c: "Bunun da hesabı", r: (t, a, b) => board(t, a, b, sum(t, a + 0.5, [["33.030 ÷ 225", "146,80 ₺"], ["× 1,5", "220,20 ₺"]]), { bg: "#141A24" }), sfx: "tick" },
  { c: "İçinden bir sevinç", r: (t, a, b) => han(t, a, b, [{ o: SENK, x: 960, s: 1.2, mouth: "smile", eyes: "wide", look: 0.1 }], { z: [1.35, 1.45], c0: [960, 460] }), html: (t, a) => <Big t={t} at={a + 0.8} text="60 saat = 13.000 ₺!" y={80} size={84} c={GRN} /> },
  { c: ["Ama bordrada", "Ama bordroda"], r: (t, a, b) => board(t, a, b, <Bordro k={rp(t, a, a + 0.6)} rows={BOR2} net="≈ 148 ₺" hi={t > a + 3 ? 2 : -1} />, { bg: "#2A241D" }) },
  { c: "Sigorta kesiliyor", r: (t, a, b) => board(t, a, b, <Bordro rows={BOR2} net="≈ 148 ₺" hi={2} />, { bg: "#2A241D", z: [1.15, 1.3], c0: [960, 460] }), html: (t, a) => <Big t={t} at={a + 0.5} text="Asgari ücret: vergisiz · Mesai: vergili" y={60} size={52} c={YEL} /> },
  { c: "Kâğıtta", r: (t, a, b) => board(t, a, b, sum(t, a + 0.3, [["Kâğıtta", "220 ₺"], ["Eline geçen", "≈ 150 ₺"]]), { bg: "#141A24" }) },
  { c: "Bir de sınır", r: (t, a, b) => board(t, a, b, <g />, { bg: "#141A24" }), html: (t, a) => <Counter t={t} a={a + 0.4} from={0} to={270} label="saat · yılda en fazla fazla mesai" y={330} c={YEL} /> },
  { c: "Yine de yazıyorsun", r: (t, a, b) => board(t, a, b, LED([["Cumartesiler", "48 saat"], ["Akşam +2 saat", "12 saat"], ["Toplam", "60 saat"]], rp(t, a, a + 3) * 3, 2, "Mesai planı"), { bg: "#2A241D" }) },
  { c: "Nuriye Abla başını", r: (t, a, b) => yem(t, a, b, [{ o: NURIYE, x: 900, s: 1.2, talk: true, look: 0.2 }], { z: [1.35, 1.42], c0: [900, 470] }), html: (t, a) => Q(t, a + 1.4, "Vücudun bir gün faturayı keser.") },
  // 6:00 · ilk iki hafta
  { c: "İlk iki hafta", r: (t, a, b) => kab(t, a, b, { speed: 1.7, z: [1.05, 1.12] }), html: (t, a) => <Counter t={t} a={a + 1.5} from={70} to={80} label="parça / saat" y={300} c={GRN} /> },
  { c: "Hakan Bey bir gün", r: (t, a, b) => han(t, a, b, [{ o: HAKAN, x: 900, s: 1.2, look: 0.2, lookY: 0.3, arms: "hold", hold: <rect x={-60} y={-80} width={120} height={160} rx={10} fill="#222" /> }], { z: [1.3, 1.4], c0: [900, 470] }), html: (t, a) => Q(t, a + 1.6, "Aferin.", 820, GRN, 90), sfx: "ding" },
  { c: "Akşam eve dönünce", r: (t, a, b) => ev(t, a, b, [{ o: ELIF_EV, x: 640, s: 1.0, arms: "hold", hold: <TeaGlass x={0} y={0} s={1.2} t={t} />, look: 0.3 }, { o: SENK_EV, x: 1280, s: 1.0, arms: "hold", hold: <TeaGlass x={0} y={0} s={1.2} t={t} />, look: -0.3, mouth: "smile" }]) },
  { c: "Annen arıyor", r: (t, a, b) => ph(t, a, b, call("Annem"), <EvGebze t={t} />), html: (t, a) => Q(t, a + 0.8, "Kızım, yemek yiyor musun?", 880, YEL, 54), sfx: "ding" },
  { c: "Bir gece Elif", r: (t, a, b) => board(t, a, b, LED([["Hedef: ehliyet", ""], ["1. yıl", "diş"], ["2. yıl", "düğün"], ["3. yıl", "kira zammı"]], 1 + rp(t, a + 2, a + 6) * 3, -1, "Elif'in defteri"), { bg: "#2A241D" }) },
  { c: "Defterde", r: (t, a, b) => ev(t, a, b, [{ o: ELIF_EV, x: 960, s: 1.2, lookY: 0.4, mouth: "sad", eyes: "half" }], { z: [1.35, 1.45], c0: [960, 470] }), html: (t, a) => <Big t={t} at={a + 0.6} text="3 yıl sonra: hedef hâlâ aynı" y={80} size={60} c={YEL} /> },
  { c: "Mesaiye alışma", r: (t, a, b) => ev(t, a, b, [{ o: ELIF_EV, x: 900, s: 1.2, talk: true, look: 0.2, brow: "worry" }], { z: [1.35, 1.45], c0: [900, 470] }), html: (t, a) => Q(t, a + 2.0, "Mesai kesilir, hayatın kesilir.") },
  { c: "Gülüyorsun", r: (t, a, b) => ev(t, a, b, [{ o: SENK_EV, x: 1000, s: 1.15, mouth: "smile", look: -0.3 }], { z: [1.3, 1.25], c0: [1000, 500] }) },
  // 7:00 · 14. gün
  { c: ["Sonra on dördüncü", "Sonra 14"], tone: "cool", r: (t, a, b) => board(t, a, b, cal(t, a, "KASIM", "14"), { bg: "#1B2438" }), sfx: "tick" },
  { c: "Yemekhanede herkes", tone: "cool", r: (t, a, b) => ph(t, a, b, <News k={rp(t, a + 0.3, a + 0.9)} head="Bursa'da 300 işçi turnikede işten çıkarıldı" sub="Sabah 06:45'te vardiyaya gelirken öğrendiler" />, <Yemekhane t={t} />, { light: true }) },
  { c: ["Turnike'da", "Turnikede", "Turnike'de"], tone: "cool", r: (t, a, b) => tur(t, a, b, { at: 0.3, state: "red", z: [1.2, 1.3], c0: [860, 320] }), sfx: "buzz" },
  { c: "Masada kimse", tone: "cool", r: (t, a, b) => yem(t, a, b, [{ o: ISCI, x: 400, s: 1.0, lookY: 0.4, mouth: "tight" }, { o: NURIYE, x: 960, s: 1.0, lookY: 0.4, eyes: "half" }, { o: SENK, x: 1500, s: 1.0, lookY: 0.4, mouth: "tight" }], { z: [1.1, 1.16] }) },
  { c: "Sonra herkes", tone: "cool", r: (t, a, b) => board(t, a, b, <Kart x={960} y={560} s={2.4} rot={lp(-4, 4, rp(t, a, b))} name={FNAME} />, { bg: "#1E232D", z: [1.1, 1.25] }) },
  { c: "Ertesi sabah turnikenin", tone: "cool", r: (t, a, b) => fd(t, a, b, { z: [1.2, 1.35], c0: [1000, 760], walkers: 6 }), html: (t, a) => <Big t={t} at={a + 0.6} text="06:44" y={80} size={80} /> },
  { c: "Kartını uzatıyorsun ve", tone: "cool", r: (t, a, b) => tur(t, a, b, { at: 20, shake: 1.4, z: [1.15, 1.3], c0: [1100, 420] }), sfx: "drone" },
  { c: ["Bip", "Bib"], r: (t, a, b) => tur(t, a, b, { at: 0.15, z: [1.3, 1.4], c0: [860, 300] }), sfx: "ding" },
  { c: "Kapı dönüyor", r: (t, a, b) => fd(t, a, b, { z: [1.3, 1.4], c0: [1000, 760], walkers: 8 }) },
  { c: "Ama öğlen panoda", tone: "cool", r: (t, a, b) => cam(t, a, b, <Pano t={t} k={rp(t, a + 0.3, a + 1)} head="DUYURU" lines={["Sipariş düşüşü nedeniyle", "cumartesi mesaileri", "durdurulmuştur."]} hi />, {}, [1.0, 1.12]), sfx: "knock" },
  { c: ["Altmış saatlik", "60 saatlik"], tone: "cool", r: (t, a, b) => board(t, a, b, <g />, { bg: "#1A0E0E" }), html: (t, a) => <Counter t={t} a={a + 0.3} from={60} to={20} label="saat mesai" y={330} c={RED} />, sfx: "boom" },
  { c: "Elif'in cümlesi", tone: "cool", r: (t, a, b) => han(t, a, b, [{ o: SENK, x: 960, s: 1.2, slump: 0.5, eyes: "half", mouth: "sad", lookY: 0.3 }], { z: [1.35, 1.42], c0: [960, 470] }), html: (t, a) => Q(t, a + 0.8, "Mesai kesilir, hayatın kesilir.") },
  { c: "Yan masada", r: (t, a, b) => han(t, a, b, [{ o: SERKAN, x: 800, s: 1.1, arms: "hold", look: 0.3, talk: true }, { o: SENK, x: 1400, s: 1.0, look: -0.4 }]), html: (t, a) => <AgeTag t={t} at={a + 0.5} age="Serkan" place="yan masa" /> },
  { c: "Ben pazartesi", r: (t, a, b) => han(t, a, b, [{ o: SERKAN, x: 900, s: 1.2, talk: true, mouth: "smile", look: 0.2 }], { z: [1.35, 1.42], c0: [900, 470] }), html: (t, a) => Q(t, a + 1.0, "Orada sigorta yok ama haftalık nakit.") },
  { c: "Sigortasız nakit", r: (t, a, b) => board(t, a, b, cards(t, a, ["Sigorta:\nyok", "Nakit:\nher hafta"], H.red)), html: (t, a) => <Big t={t} at={a + 1.6} text="Sen o yoldan yeni geldin" y={860} size={56} c={YEL} /> },
  { c: "Mola odasında herkes", r: (t, a, b) => board(t, a, b, cards(t, a + 0.8, ["%20?", "%40?"], YEL, 560)), html: (t, a) => <Big t={t} at={a + 0.4} text="Aralık: asgari ücrete zam" y={80} size={64} /> },
  { c: "Nuriye Abla çayını", r: (t, a, b) => yem(t, a, b, [{ o: NURIYE, x: 900, s: 1.2, talk: true, arms: "hold", hold: <TeaGlass x={0} y={0} s={1.2} t={t} />, look: 0.2 }], { z: [1.35, 1.42], c0: [900, 470] }), html: (t, a) => Q(t, a + 1.4, "Zam gelir, kira da gelir. Sen kömürüne bak.", 820, YEL, 52) },
  // 8:20 · baba
  { c: "Bir gece telefonun", tone: "night", r: (t, a, b) => ph(t, a, b, call("Babam"), <EvGebze t={t} />), sfx: "ding" },
  { c: "Kızım, kömürcü", tone: "cool", r: (t, a, b) => koy(t, a, b, [{ o: BABA_K, x: 1150, s: 1.05, arms: "phone", talk: true, look: -0.3 }], { empty: true, z: [1.15, 1.25], c0: [1100, 500] }), html: (t, a) => Q(t, a + 1.6, "Önümüzdeki hafta kar bekleniyor.") },
  { c: "Hesabın yine", tone: "cool", r: (t, a, b) => board(t, a, b, LED(D1, 6, 5, "Ay sonu defteri"), { bg: "#2A241D", z: [1.1, 1.2], c0: [960, 760] }), html: (t, a) => <Big t={t} at={a + 0.5} text="Hâlâ eksik" y={60} size={90} c={RED} /> },
  { c: "Ertesi gün Hakan", r: (t, a, b) => han(t, a, b, [{ o: HAKAN, x: 700, s: 1.05, talk: true, look: 0.4 }, { o: SENK, x: 1300, s: 1.0, look: -0.4 }], { z: [1.12, 1.2] }) },
  { c: "Pres hattında", tone: "night", r: (t, a, b) => pres(t, a, b, { z: [1.0, 1.08] }), html: (t, a) => Q(t, a + 1.0, "Gece vardiyasına geçer misin?"), sfx: "boom" },
  { c: ["Pazar gününde", "Pazar günü de"], r: (t, a, b) => board(t, a, b, cal(t, a, "PAZAR", "12 saat")) },
  { c: "Gece vardiyası. Gecenin", tone: "night", r: (t, a, b) => board(t, a, b, sum(t, a + 0.4, [["Vardiya", "00:00 → 08:00"]]), { bg: "#0A0E1A" }) },
  { c: "Ama bir şey daha", tone: "night", r: (t, a, b) => board(t, a, b, cards(t, a + 1.2, ["Gece: en fazla\n7,5 saat", "Gece\nmesai yok", "Tek şans:\npazar"], YEL), { bg: "#0A0E1A" }) },
  { c: "Kabul ediyorsun", tone: "night", r: (t, a, b) => han(t, a, b, [{ o: SENK, x: 960, s: 1.2, mouth: "tight", look: 0.1, brow: "worry" }], { night: true, z: [1.35, 1.42], c0: [960, 470] }) },
  // 9:10 · gece
  { c: "Gece vardiyası, insanın", r: (t, a, b) => ev(t, a, b, [{ o: SENK, x: 760, s: 1.05, eyes: "half", slump: 0.4, look: 0.5 }], { morning: true, heater: false }) },
  { c: "Perdeyi çekiyorsun", r: (t, a, b) => ev(t, a, b, [{ o: SENK_EV, x: 960, s: 1.1, eyes: "closed", tilt: 10, slump: 0.5 }], { morning: true, heater: false, z: [1.25, 1.35], c0: [960, 500] }) },
  { c: "Akşam yemeğin", r: (t, a, b) => board(t, a, b, <><Simit x={780} y={560} s={1.4} /><TeaGlass x={1280} y={700} s={2.4} t={t} /></>, { bg: "#2A241D" }), html: (t, a) => <Big t={t} at={a + 0.8} text="09:00 · akşam yemeği" y={80} size={64} /> },
  { c: "Elif işe giderken", r: (t, a, b) => ev(t, a, b, [{ o: ELIF, x: 500, s: 1.0, look: 0.6, dir: -1 }, { o: SENK_EV, x: 1350, s: 1.0, eyes: "closed", tilt: 8 }], { morning: true, heater: false }), html: (t, a) => <Big t={t} at={a + 2.0} text="Aynı evde, iki yabancı" y={80} size={66} c={YEL} /> },
  { c: "Pres hattı bambaşka", tone: "night", r: (t, a, b) => han(t, a, b, [], { night: true, fork: false, z: [1.0, 1.1], sign: "PRES HATTI · ELLER DIŞARIDA" }) },
  { c: "Her on saniyede", tone: "night", r: (t, a, b) => pres(t, a, b, { ram: cyc(t, 2.2, -a), z: [1.05, 1.15] }), html: (t, a) => <Big t={t} at={a + 1.2} text="GÜMM" y={80} size={110} c={RED} />, sfx: "boom" },
  { c: "Önüne bir", tone: "night", r: (t, a, b) => cam(t, a, b, <IkiEl t={t} press={cyc(t, 2.2, -a - 0.2)} />, {}, [1.05, 1.15]) },
  { c: "Bir kapı parçası", tone: "night", r: (t, a, b) => pres(t, a, b, { ram: 0, part: "kapi", z: [1.3, 1.45], c0: [960, 620] }) },
  { c: "Ve makinenin iki", tone: "night", r: (t, a, b) => pres(t, a, b, { ram: 0, z: [1.4, 1.55], c0: [580, 540] }), html: (t, a) => <Big t={t} at={a + 2.0} text="Işık perdesi" y={80} size={76} c={YEL} /> },
  // 10:00 · doruk
  { c: "Dördüncü gece", tone: "night", r: (t, a, b) => pres(t, a, b, { ram: cyc(t, 2.2, -a), z: [1.2, 1.1], c0: [960, 500] }), html: (t, a) => <Big t={t} at={a + 0.8} text="4. gece · 04:00" y={80} size={80} /> },
  { c: "Gözlerin yanıyor", tone: "night", r: (t, a, b) => han(t, a, b, [{ o: SENK, x: 960, s: 1.25, eyes: "half", slump: 0.4, mouth: "flat" }], { night: true, fork: false, z: [1.4, 1.5], c0: [960, 450] }), sfx: "boom" },
  { c: "Bir parça kalıbın", tone: "night", r: (t, a, b) => pres(t, a, b, { ram: 0, part: "yamuk", z: [1.3, 1.5], c0: [960, 620] }) },
  { c: "Düzeltmek için", tone: "night", r: (t, a, b) => pres(t, a, b, { ram: rp(t, a + 1.6, a + 2.4) * 0.5, part: "yamuk", hand: rp(t, a + 0.3, a + 2.2), z: [1.15, 1.3], c0: [960, 600] }) },
  { c: "Işık kesiliyor", tone: "night", r: (t, a, b) => pres(t, a, b, { ram: 0.5, part: "yamuk", hand: 1, cut: true, alarm: true, z: [1.05, 1.15] }), sfx: "buzz" },
  { c: "Elin, kalıbın", tone: "night", r: (t, a, b) => pres(t, a, b, { ram: 0.5, part: "yamuk", hand: 1, cut: true, alarm: true, z: [1.6, 1.8], c0: [960, 560] }), html: (t, a) => <Big t={t} at={a + 1.4} text="Bir karış yukarıda: tonlarca demir" y={860} size={56} c={RED} />, sfx: "drone" },
  { c: "Elini yavaşça", tone: "night", r: (t, a, b) => pres(t, a, b, { ram: 0.5, part: "yamuk", hand: 1 - rp(t, a, a + 2.5), cut: t < a + 2.5, alarm: true, z: [1.3, 1.2], c0: [960, 600] }) },
  { c: "Hakan Bey koşarak", tone: "night", r: (t, a, b) => han(t, a, b, [{ o: HAKAN, x: lp(300, 760, rp(t, a, a + 1.2)), s: 1.05, eyes: "wide", look: 0.5 }, { o: SENK, x: 1300, s: 1.0, eyes: "wide", mouth: "tight", look: -0.3 }], { night: true, fork: false }) },
  { c: "Sonra sensöre", tone: "night", r: (t, a, b) => pres(t, a, b, { ram: 0.5, z: [1.6, 1.7], c0: [1350, 540] }), html: (t, a) => <Big t={t} at={a + 1.2} text="Bantlanmamış." y={80} size={90} c={GRN} /> },
  { c: ["Molo odasında", "Mola odasında Nuriye"], r: (t, a, b) => board(t, a, b, <EksikParmak x={1100} y={600} s={1.6} t={t} />, { bg: "#E8E2D2", z: [1.2, 1.35], c0: [1250, 560] }), html: (t, a) => Q(t, a + 1.0, "Sakın bantlama.", 820, RED, 80) },
  { c: "Ve ilk defa", r: (t, a, b) => board(t, a, b, <EksikParmak x={1100} y={600} s={1.6} t={t} />, { bg: "#E8E2D2", z: [1.5, 1.7], c0: [1300, 520] }) },
  { c: "O sabah Hakan", r: (t, a, b) => han(t, a, b, [{ o: HAKAN, x: 760, s: 1.05, arms: "hold", hold: <TeaGlass x={0} y={0} s={1.3} t={t} />, look: 0.4, mouth: "smile" }, { o: SENK, x: 1280, s: 1.0, look: -0.4, eyes: "half" }], { z: [1.12, 1.2] }) },
  { c: "Bu hatta", r: (t, a, b) => han(t, a, b, [{ o: HAKAN, x: 900, s: 1.2, talk: true, look: 0.2 }], { z: [1.35, 1.42], c0: [900, 470] }), html: (t, a) => Q(t, a + 1.6, "Kimse o sensörü bantlamadı. Sen de bantlama.", 820, YEL, 52) },
  { c: ["Pazar günü on iki", "Pazar günü 12"], r: (t, a, b) => han(t, a, b, [], { empty: true, fork: false, z: [1.0, 1.1] }), html: (t, a) => <Big t={t} at={a + 0.5} text="Pazar · 12 saat" y={80} size={70} /> },
  { c: "Akşam servise", tone: "night", r: (t, a, b) => fd(t, a, b, { mode: "night", walkers: 0, extra: <Servis x={lp(1200, 700, rp(t, a, b))} y={1040} s={0.75} t={t} night speed={0.3} /> }), html: (t, a) => <Big t={t} at={a + 2.2} text="14.000" y={80} size={90} c={YEL} /> },
  // 11:00 · son gün
  { c: "Ayın son günü", r: (t, a, b) => board(t, a, b, cal(t, a, "KASIM", "30")), sfx: "tick" },
  { c: ["Sabah 6'yı 44", "Sabah altıyı kırk"], r: (t, a, b) => fd(t, a, b, { z: [1.15, 1.3], c0: [1000, 760], walkers: 8 }) },
  { c: "Bu sefer elin", r: (t, a, b) => tur(t, a, b, { at: 1.6, z: [1.05, 1.15], c0: [900, 420] }) },
  { c: ["Bip", "Bib"], r: (t, a, b) => tur(t, a, b, { at: 0.1, off: 0, z: [1.3, 1.4], c0: [860, 300] }), sfx: "ding" },
  // defter
  { c: "Ve şimdi, sana", r: (t, a, b) => board(t, a, b, LED(D2, 0, -1, "Ay sonu defteri"), { bg: "#2A241D" }) },
  { c: "Net asgari ücret", r: (t, a, b) => board(t, a, b, LED(D2, 1, 0, "Ay sonu defteri"), { bg: "#2A241D" }) },
  { c: "Fazla mesai: cumartesi", r: (t, a, b) => board(t, a, b, LED(D2, 2, 1, "Ay sonu defteri"), { bg: "#2A241D" }), html: (t, a) => <Big t={t} at={a + 2.5} text="Mesai: 20 + 12 saat" y={60} size={60} c={YEL} /> },
  { c: "toplam", r: (t, a, b) => board(t, a, b, LED(D2, 2, 1, "Ay sonu defteri"), { bg: "#2A241D", z: [1.15, 1.3], c0: [960, 500] }), html: (t, a) => <Big t={t} at={a + 0.3} text="32 saat × ~150 ₺ = 4.800 ₺" y={60} size={60} c={YEL} /> },
  { c: "Eline geçen toplam", r: (t, a, b) => board(t, a, b, LED(D2, 2, -1, "Ay sonu defteri"), { bg: "#2A241D", z: [1.05, 1.12] }), html: (t, a) => <Big t={t} at={a + 0.5} text="32.875,50 ₺" y={60} size={100} c={GRN} /> },
  { c: "Kira payı", r: (t, a, b) => board(t, a, b, LED(D2, 2 + rp(t, a, a + 4) * 4, -1, "Ay sonu defteri"), { bg: "#2A241D" }) },
  { c: "Kalan", r: (t, a, b) => board(t, a, b, LED(D2, 6, -1, "Ay sonu defteri"), { bg: "#2A241D", z: [1.05, 1.12] }), html: (t, a) => <Big t={t} at={a + 0.4} text="13.525,50 ₺" y={60} size={100} /> },
  { c: "Kömür", r: (t, a, b) => board(t, a, b, LED(D2, 7, 6, "Ay sonu defteri"), { bg: "#2A241D", z: [1.1, 1.2], c0: [960, 800] }), sfx: "knock" },
  { c: "Ay sonunda cebinde kalan", r: (t, a, b) => board(t, a, b, LED(D2, 7, 6, "Ay sonu defteri"), { bg: "#2A241D", z: [1.04, 1.12], c0: [960, 680] }), html: (t, a) => <Big t={t} at={a + 1.4} text="−474,50 ₺" y={60} size={150} c={RED} />, sfx: "boom" },
  { c: ["O akşam Elif", "Bu akşam"], r: (t, a, b) => ev(t, a, b, [{ o: ELIF_EV, x: 640, s: 1.0, arms: "phone", look: 0.3 }, { o: SENK_EV, x: 1280, s: 1.0, look: -0.3, eyes: "half" }]) },
  { c: "Sen de babana", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#0E3B2A" /><circle cx={180} cy={260} r={70} fill="#2BB673" /><path d="M150,262 L172,284 L214,238" stroke="#FFF" strokeWidth={14} fill="none" />{tx(180, 390, "Gönderildi", 34, "#FFF", 700, "middle")}{tx(180, 430, "Babam · kömür", 24, "#BFE6D2", 600, "middle")}</g>, <EvGebze t={t} />) },
  { c: "Üç gün sonra", r: (t, a, b) => koy(t, a, b, [], { fire: 1, snow: true, z: [1.0, 1.12] }), html: (t, a) => <Big t={t} at={a + 0.5} text="Yozgat · 3 gün sonra" y={80} size={60} /> },
  { c: "bir fotoğraf atıyor", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#111" /><g transform="translate(-120,150) scale(0.33)"><KoySoba t={t} fire={1} snow /></g>{tx(20, 640, "Annem: Allah razı olsun kızım ❤", 18, "#FFF", 600)}</g>, <EvGebze t={t} />) },
  // 12:00 · hüküm
  { c: "Peki gerçekten", r: (t, a, b) => ev(t, a, b, [{ o: SENK_EV, x: 960, s: 1.2, look: 0, mouth: "flat" }], { z: [1.4, 1.5], c0: [960, 450] }), html: (t, a) => <Big t={t} at={a + 0.3} text="Peki… gerçekten değer mi?" y={80} size={70} c={YEL} /> },
  { c: ["Bu ay iki yüz", "Bu ay 200"], r: (t, a, b) => board(t, a, b, <g />, { bg: "#141A24" }), html: (t, a) => <Counter t={t} a={a + 0.3} from={0} to={200} prefix="+" label="saat · bu ay" y={330} c={YEL} /> },
  { c: "Bir gecesinde neredeyse", tone: "night", r: (t, a, b) => pres(t, a, b, { ram: 0.5, alarm: true, cut: true, z: [1.1, 1.2] }) },
  { c: "Ve ay sonunda cebinde para", r: (t, a, b) => board(t, a, b, LED(D2, 7, 6, "Ay sonu defteri"), { bg: "#2A241D", z: [1.04, 1.1], c0: [960, 680] }), html: (t, a) => <Big t={t} at={a + 0.6} text="−474,50 ₺" y={60} size={120} c={RED} /> },
  { c: "Ama haksızlık", r: (t, a, b) => board(t, a, b, cards(t, a + 0.8, ["Sigorta\nyattı", "Yemek +\nservis", "Maaş\ngününde"], H.green)) },
  { c: "Ve bu işe girmek", r: (t, a, b) => board(t, a, b, cards(t, a + 0.3, ["Sermaye:\n0 ₺"], H.green)) },
  { c: "Kime göre bu iş", r: (t, a, b) => board(t, a, b, cards(t, a + 1.0, ["Düzenli\nmaaş", "Sigorta", "Bir hedef\niçin birikim"], YEL)) },
  { c: "Ama tek başına", tone: "cool", r: (t, a, b) => ev(t, a, b, [{ o: SENK_EV, x: 760, s: 1.05, slump: 0.4, eyes: "half", lookY: 0.2 }], { z: [1.1, 1.2] }), html: (t, a) => <Big t={t} at={a + 2.2} text="Asgari ücret bugün yetmiyor" y={80} size={66} c={RED} /> },
  { c: "Bunu biz değil", r: (t, a, b) => board(t, a, b, LED(D2, 7, -1, "Ay sonu defteri"), { bg: "#2A241D", z: [1.0, 1.1] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Bunu defter söylüyor" y={60} size={70} c={YEL} /> },
  { c: "Yani fabrika seni", r: (t, a, b) => fd(t, a, b, { mode: "day", z: [1.0, 1.1], walkers: 6 }), html: (t, a) => <Big t={t} at={a + 1.6} text="Zengin etmez. Ayağını yere bastırır." y={80} size={60} c={YEL} /> },
  { c: "Asıl mesele", r: (t, a, b) => yem(t, a, b, [{ o: NURIYE, x: 900, s: 1.2, look: 0.2, mouth: "smile" }], { z: [1.35, 1.42], c0: [900, 470] }), html: (t, a) => <><AgeTag t={t} at={a + 1.4} age="Nuriye Abla" place="20 yıl kaldı" /><Big t={t} at={a + 3.2} text="Sen kaç yıl kalırsın?" y={80} size={70} c={YEL} /></> },
  { c: "Zorluk", r: (t, a, b) => cam(t, a, b, <rect width={1920} height={1080} fill="#0E1016" />, {}, [1, 1.05]), html: (t, a) => <Verdict t={t} a={a} rows={[["Zorluk", 7], ["Sermaye", 1], ["Sabır", 9]]} title="Asgari ücretle fabrikada çalışmak" /> },
  { c: "Ve son olarak", r: (t, a, b) => fd(t, a, b, { z: [1.0, 1.1], walkers: 12 }) },
  { c: "Bir dahaki sefere", r: (t, a, b) => board(t, a, b, <KapiSac x={960} y={560} s={1.4} k={rp(t, a, a + 0.6)} />, { bg: "#1E232D", z: [1.0, 1.15] }) },
  { c: "Belki biri", tone: "night", r: (t, a, b) => pres(t, a, b, { ram: cyc(t, 2.4, -a), part: "kapi", z: [1.05, 1.12] }), html: (t, a) => <Big t={t} at={a + 1.0} text="Gece saat 4'te, senin için" y={860} size={56} c={YEL} /> },
  // çağrı
  { c: "Sıradaki meslek", r: (t, a, b) => board(t, a, b, cards(t, a + 0.3, ["Fırıncı?", "Berber?", "Garson?"], YEL)) },
  { c: "Hangi mesleği", r: (t, a, b) => board(t, a, b, comment(t, a)) },
  { c: "Sıradaki videoyu", r: (t, a, b) => fd(t, a, b, { z: [1.05, 1.12], walkers: 8 }), html: (t, a) => <SubBtn t={t} at={a + 1.2} /> },
];

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K6_08_SECONDS));
  return raw;
})();

export const K6Video08: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const fadeIn = rp(t, 0, 0.4);
  const cutFlash = 1 - rp(t, s.from, s.from + 0.12);
  const fadeOut = 1 - rp(t, K6_08_SECONDS - 1.5, K6_08_SECONDS);
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
      <Audio src={staticFile("audio/k6-08.wav")} />
      {TIMED.map((x, i) => i > 0 && x.to < K6_08_SECONDS - 15 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.sfx === "knock" ? 0.08 : x.sfx === "boom" || x.sfx === "drone" ? 0.12 : x.sfx ? 0.15 : 0.07} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
