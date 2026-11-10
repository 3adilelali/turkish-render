import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k6-05-words.json";
import { makeCue } from "../../lib/cues";
import { Atmos, Sweep, Tone } from "../../components/Live";
import {
  AgeTag, BackView, Big, Door, News, Comment, Counter, H, HCam, HFrame, Laptop, Look, Mail,
  Person, Phone, Salon, Studio, SubBtn, TeaGlass, TeenRoom, Verdict, fmt, rp,
} from "../../components/Hayat";
import { TwoBars } from "../../components/HayatCarsi";
import { CEMAL, BlockPage, InternetKafe, KARDES, PcCase, Snow, SnowStreet, StreamUI, TikLive } from "../../components/HayatYayin";

// Kanal 4 · k6-05 · "3 İzleyiciden 50.000'e: Türkiye'de Yayıncı Olarak Hayatın"
// Ses: ElevenLabs Hasan Yasin (eleven_v4), 4 parça; kelime zamanları ElevenLabs hizalaması. Seviye kartı YOK; geçiş yaş etiketiyle.

const W = words as { text: string; start: number; end: number }[];
const cue = makeCue(W);
const VOICE_END = W[W.length - 1].end;
export const K6_05_SECONDS = Math.ceil(VOICE_END + 4);
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


const Clock: React.FC<{ x: number; y: number; s?: number; h: number; m: number; spin?: number }> = ({ x, y, s = 1, h, m, spin = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={150} fill="#F4F1EA" stroke="#222" strokeWidth={12} />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-4} y={-140} width={8} height={22} fill="#333" transform={`rotate(${i * 30})`} />)}
    <rect x={-6} y={-80} width={12} height={84} rx={6} fill="#222" transform={`rotate(${(h % 12) * 30 + m * 0.5 + spin * 30})`} />
    <rect x={-4} y={-120} width={8} height={124} rx={4} fill="#C0392B" transform={`rotate(${m * 6 + spin * 360})`} />
    <circle r={12} fill="#222" />
  </g>
);


// ───────── k6-05 karakterleri
const S16: Look = { hairStyle: "short", top: "#2E6B4A", top2: "#22513A", kind: "hoodie" };
const S18: Look = { hairStyle: "fade", top: "#3B3F8F", top2: "#2D3070", kind: "hoodie", beard: 0.2 };
const S20: Look = { hairStyle: "fade", top: "#1F2633", top2: "#161B25", kind: "jacket", beard: 0.55 };
const BABA5: Look = { hairStyle: "short", hair: "#4A4038", top: "#6E5A4A", top2: "#57463A", kind: "sweater", mustache: true };
const ANNE5: Look = { hairStyle: "scarf", scarf: "#4B6B8E", top: "#9E7A5A", top2: "#836247", kind: "cardigan", skin: "#E4B48E" };
const TW = "#9146FF";

// ───────── k6-05 sahne yardımcıları
// monitör (ekran 1000x625)
const Monitor: React.FC<{ x: number; y: number; s?: number; n?: number; children: React.ReactNode }> = ({ x, y, s = 1, n, children }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <rect x={-530} y={-345} width={1060} height={690} rx={18} fill="#111" />
    <svg x={-500} y={-312} width={1000} height={625} viewBox="0 0 1000 625">{children}</svg>
    <rect x={-40} y={345} width={80} height={70} fill="#1A1A1A" /><rect x={-170} y={410} width={340} height={22} rx={10} fill="#222" />
    {n !== undefined && <g><circle cx={470} cy={-300} r={30} fill={H.red} />{tx(470, -290, String(n), 30, "#FFF", 800, "middle")}</g>}
  </g>
);
// kafede, karşıdan: sen + monitör arkası
const kafe = (t: number, a: number, b: number, o: Look, p: { z?: [number, number]; c0?: [number, number]; c1?: [number, number]; mouth?: any; brow?: any; eyes?: any; arms?: any; talk?: boolean; last?: boolean; empty?: boolean; glow?: string; shake?: number } = {}) => {
  const sh = p.shake ? Math.sin(t * 50) * 4 * p.shake : 0;
  return (
    <HCam t={t} a={a} b={b} z={p.z ?? [1.2, 1.32]} c0={p.c0 ?? [960, 520]} c1={p.c1}>
      <g style={{ filter: "blur(4px)" }}><InternetKafe t={t} last={p.last} empty={p.empty} /></g>
      <g transform={`translate(${sh},0)`}><Person x={960} y={890} s={0.95} t={t} o={o} arms={p.arms ?? "type"} mouth={p.mouth ?? "flat"} brow={p.brow} eyes={p.eyes} talk={p.talk} lit={1} /></g>
      <ellipse cx={960} cy={560} rx={360} ry={260} fill={p.glow ?? "#9FD4FF"} opacity={0.14} />
      <rect x={260} y={860} width={1400} height={30} fill="#3A3F4A" /><rect x={260} y={890} width={1400} height={200} fill="#2A2E36" />
      <g transform="translate(960,870)"><path d="M-330,0 L-300,-300 L300,-300 L330,0Z" fill="#1A1C22" /><rect x={-20} y={-240} width={70} height={46} rx={8} fill={H.red} />{tx(15, -206, "7", 34, "#FFF", 800, "middle")}</g>
      <TeaGlass x={1450} y={860} s={0.85} t={t} />
    </HCam>
  );
};
// omuz üstünden monitör
const kover = (t: number, a: number, b: number, o: Look, screen: React.ReactNode, p: { z?: [number, number]; c0?: [number, number]; c1?: [number, number]; home?: boolean } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.1]} c0={p.c0 ?? [1000, 470]} c1={p.c1}>
    <g style={{ filter: "blur(5px)" }}>{p.home ? <TeenRoom t={t} night poster="GG" /> : <InternetKafe t={t} />}</g>
    <rect y={800} width={1920} height={280} fill="#2A2E36" />
    <Monitor x={1080} y={430} s={0.72} n={p.home ? undefined : 7}>{screen}</Monitor>
    <BackView x={430} y={1260} s={1.05} t={t} o={o} type />
  </HCam>
);
// ekran yakın
const mon = (t: number, a: number, b: number, screen: React.ReactNode, p: { z?: [number, number]; c0?: [number, number]; c1?: [number, number] } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1.3, 1.42]} c0={p.c0 ?? [960, 520]} c1={p.c1} k={0.6}>
    <rect width={1920} height={1080} fill="#0B0D12" /><Monitor x={960} y={500} s={1.1}>{screen}</Monitor>
  </HCam>
);
// Cemal Abi tezgâhta
const cemal = (t: number, a: number, b: number, p: { z?: [number, number]; c0?: [number, number]; mouth?: any; talk?: boolean; last?: boolean; sen?: Look; senArms?: any; hold?: React.ReactNode; empty?: boolean } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1.15, 1.25]} c0={p.c0 ?? [960, 520]}>
    <InternetKafe t={t} last={p.last} empty={p.empty} />
    <Person x={p.sen ? 760 : 960} y={920} s={1} t={t} o={CEMAL} arms={p.hold ? "hold" : "cross"} mouth={p.mouth ?? "smile"} talk={p.talk} hold={p.hold} lit={1} />
    {p.sen && <Person x={1260} y={930} s={0.95} t={t} o={p.sen} arms={p.senArms ?? "down"} mouth="smile" dir={-1} lit={1} seed={4} />}
    <rect y={880} width={1920} height={200} fill="#4E321E" /><rect y={870} width={1920} height={18} fill="#6E4528" />
    <TeaGlass x={p.sen ? 560 : 1180} y={870} s={0.9} t={t} />
  </HCam>
);
// evde kendi bilgisayarı
const home = (t: number, a: number, b: number, o: Look, p: { z?: [number, number]; c0?: [number, number]; mouth?: any; arms?: any; brow?: any; talk?: boolean; extra?: React.ReactNode } = {}) =>
  desk(t, a, b, o, { z: p.z ?? [1.2, 1.3], c0: p.c0, mouth: p.mouth ?? "smile", arms: p.arms ?? "type", brow: p.brow, talk: p.talk, old: false, night: true, extra: <g><PcCase x={1640} y={860} s={1.1} t={t} />{p.extra}</g> });
const tik = (t: number, a: number, b: number, screen: React.ReactNode, p: { z?: [number, number] } = {}) => ph(t, a, b, screen, { z: p.z ?? [1.05, 1.18] });
const walk = (t: number, a: number, b: number) => (
  <HCam t={t} a={a} b={b} z={[1.05, 1.12]}><SnowStreet t={t} px={(t - a) * -60} /><g transform={`translate(0,${Math.abs(Math.sin(t * 4)) * -10})`}><BackView x={960} y={1300} s={1.1} t={t} o={S18} /></g></HCam>
);
const fam = (t: number, a: number, b: number, people: React.ReactNode, p: { z?: [number, number]; c0?: [number, number] } = {}) => room(t, a, b, people, p);
const tipi = (t: number, a: number, b: number) => (
  <HCam t={t} a={a} b={b} z={[1.05, 1.15]}><rect width={1920} height={1080} fill="#2A3346" /><g transform="translate(0,0)"><InternetKafe t={t} /></g><rect width={1920} height={1080} fill="#DDE6F0" opacity={0.35} /><Snow t={t} n={260} wind={2.2} o={1} /></HCam>
);
const CH0 = ["annen: aferin oğlum ❤", "kardeşin: abiii", "bot_2931: follow me"];
const CH1 = ["Ahmet: selam abi", "karslı_36: Kars'tan selam", "Zeynep: hahaha", "Emre: bu oyun ne", "Mert: 21:00 burdayız"];
const CH2 = ["RAID: 2.000 kişi geldi!", "ozan_1: selamm", "kerem: kimsin abi", "berk: ooo", "aslı: hoş geldiniz"];
const CH3 = ["Ahmet: abi efsane", "karslı_36: buradayız", "Emre: helal", "bilal_15: abi ilk yayınından beri buradayım", "Mert: 50 BİN!!"];

const SHOTS: Sh[] = [
  // ── KANCA
  { c: "Canlı yayındasın", r: (t, a, b) => kafe(t, a, b, S20, { talk: true, mouth: "smile", z: [1.15, 1.3], last: true }), tone: "warm" },
  { c: "Ekranın köşesinde bir sayı", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={Math.round(30000 + rp(t, a, a + 3) * 20412)} chat={CH3} face={S20} />, { z: [1.3, 1.6], c0: [760, 330] }) },
  { c: "Ve tam o anda, yayının", r: (t, a, b) => kover(t, a, b, S20, <StreamUI t={t} viewers={50412} chat={CH3} face={S20} />), sfx: "knock" },
  { c: "özel mesaj kutuna", r: (t, a, b) => mon(t, a, b, <Mail from="Sponsorluk · gizli" subject="Tek yayın için teklif" lines={["Ekranın köşesine küçük bir logo.", "Tek yayın.", "20.000 $"]} k={rp(t, a, a + 0.6)} badge="Teklif" badgeC={H.amber} />, { z: [1.25, 1.4] }) },
  { c: "Ekranın köşesine küçük", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Counter t={t} a={a} from={0} to={20000} dur={1.4} label="tek yayın" prefix="$" y={380} c="#FFC531" /> },
  { c: "Logo, bir bahis", r: (t, a, b) => board(t, a, b, <g />, { bg: "#140808" }), html: (t, a) => <Big t={t} at={a + 0.2} text="Bir bahis sitesi." y={440} size={100} c="#FF6B6B" />, sfx: "drone", tone: "cool" },
  { c: "Bu teklifi unutma", r: (t, a, b) => kafe(t, a, b, S20, { arms: "chin", mouth: "flat", z: [1.5, 1.65], c0: [960, 430], last: true }), html: (t, a) => <Big t={t} at={a + 1.2} text="Sonunda ne cevap verdiğini göreceksin" y={830} size={50} /> },

  { c: "Çünkü dört yıl önce", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={3} chat={[]} face={S16} />, { z: [1.25, 1.35] }), html: (t, a) => <Big t={t} at={a + 1} text="3 izleyici" y={80} size={70} /> },
  { c: "Biri annen", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={3} chat={CH0} chatK={rp(t, a, a + 3.5)} face={S16} />, { z: [1.5, 1.7], c0: [1250, 330] }), sfx: "pop" },

  { c: "On altı yaşındasın", r: (t, a, b) => walk(t, a, b), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="16 yaş" place="Erzurum" /> },
  { c: "Şimdi seninle bu yolun", r: (t, a, b) => board(t, a, b, <g>{["3", "50.000"].map((s, i) => { const k = rp(t, a + i * 1.2, a + 0.4 + i * 1.2); return <g key={i} opacity={k}><circle cx={640 + i * 640} cy={500} r={150} fill={i ? TW : "#3A4050"} />{tx(640 + i * 640, 530, s, 80, "#FFF", 800, "middle")}{tx(640 + i * 640, 720, "izleyici", 40, "#CCC", 600, "middle")}</g>; })}<path d="M820,500 L1100,500" stroke="#FFF" strokeWidth={10} strokeDasharray="24 16" /></g>) },
  { c: "Bir abonenin sana", r: (t, a, b) => board(t, a, b, cards(t, a, ["Bir abone =\nbir simit?", "Hediyeden\nkim kazanıyor?", "Bir sabah\nkapanan site"], TW)) },
  { c: "bir gecede yüz binlerce", r: (t, a, b) => tik(t, a, b, <TikLive t={t} face={S18} viewers={3100} gifts={1.4} />, { z: [1.1, 1.25] }) },
  { c: "ve bir platformun bir sabah", r: (t, a, b) => mon(t, a, b, <BlockPage />, { z: [1.25, 1.4] }) },
  { c: "Ve en sonunda sana", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.6} text="Gerçekten değer mi?" y={440} size={100} c="#FFC531" /> },

  // ── İNTERNET KAFE
  { c: "Her şey mahallendeki", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.1]}><InternetKafe t={t} px={(t - a) * -30} /></HCam> },
  { c: "Evdeki internet film", r: (t, a, b) => home(t, a, b, S16, { arms: "chin", mouth: "tight", brow: "worry", z: [1.3, 1.4] }) },
  { c: "Çünkü yayında önemli", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["İndirme", 1, "↓ hızlı"]} right={["Yükleme", 0.08, "↑ çok yavaş"]} />), html: (t, a) => <Big t={t} at={a + 0.4} text="Yayında önemli olan: yükleme" y={70} size={56} c="#FFC531" /> },
  { c: "Ve sizin evin yükleme", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#111" />{tx(180, 200, "Hız testi", 30, "#FFF", 700, "middle")}{tx(180, 330, "↓ 24", 60, H.green, 800, "middle")}{tx(180, 450, "↑ 1", 90, "#FF6B6B", 800, "middle")}{tx(180, 500, "Mbps", 26, "#AAA", 600, "middle")}</g>, { z: [1.1, 1.25] }) },

  { c: "İnternet kafenin sahibi", r: (t, a, b) => cemal(t, a, b, { z: [1.2, 1.35], mouth: "smile" }) },
  { c: "Elli yaşlarında", r: (t, a, b) => cemal(t, a, b, { z: [1.5, 1.65], c0: [960, 440], talk: true, hold: <TeaGlass x={0} y={0} s={1.2} t={t} /> }) },
  { c: "Yedi numaralı bilgisayarı", r: (t, a, b) => cemal(t, a, b, { sen: S16, senArms: "down", talk: true, z: [1.1, 1.2] }), html: (t, a) => <Big t={t} at={a + 1.4} text={'"Saati 30 lira. Gece 11\'den sonra yarı fiyat."'} y={820} size={46} /> },

  { c: "İlk yayınını bir kasım", r: (t, a, b) => kafe(t, a, b, S16, { arms: "type", mouth: "tight", z: [1.15, 1.25] }) },
  { c: "Dışarıda kar yağıyor", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[1590, 270]}><InternetKafe t={t} /></HCam> },
  { c: "Herkesin oynadığı o savaş", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={3} chat={[]} face={S16} />, { z: [1.2, 1.5], c0: [700, 450] }) },
  { c: "İki saat boyunca", r: (t, a, b) => kafe(t, a, b, S16, { arms: "type", mouth: "flat", eyes: "half", z: [1.45, 1.55], c0: [960, 430] }), html: (t, a) => <Big t={t} at={a + 0.4} text="2 saat · tek kelime yok" y={80} size={56} /> },
  { c: "İzleyici sayısı: üç", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={3} chat={[]} face={S16} />, { z: [1.8, 2.1], c0: [1100, 230] }) },
  { c: "Ertesi gece de üç", r: (t, a, b) => board(t, a, b, <g>{[3, 3, 2].map((v, i) => <g key={i} opacity={rp(t, a + i * 0.6, a + 0.3 + i * 0.6)}>{cal(t, a + i * 0.6, ["PZT", "SAL", "ÇAR"][i], String(v), "izleyici", 460 + i * 500, 520, 0.8)}</g>)}</g>) },
  { c: "Bot bile gitmiş", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={2} chat={["annen: aferin oğlum ❤", "kardeşin: abiii", "bot_2931 sohbetten ayrıldı"]} face={S16} />, { z: [1.6, 1.8], c0: [1250, 330] }), sfx: "pop" },

  { c: "Bir gece kardeşin", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.15, 1.25]}><TeenRoom t={t} night poster="GG" /><Person x={720} y={980} s={0.8} t={t} o={KARDES} arms="phone" mouth="grin" lit={1} /><Person x={1250} y={960} s={0.95} t={t} o={S16} arms="down" mouth="flat" dir={-1} /></HCam>, html: (t, a) => <AgeTag t={t} at={a + 0.6} age="Kardeşin · 9 yaş" /> },
  { c: "Senin yayınını değil", r: (t, a, b) => ph(t, a, b, <StreamUIPhone t={t} />, { z: [1.1, 1.25] }) },
  { c: "Ama durmadan konuşuyor", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={10000} chat={CH1} face={{ hairStyle: "curly", top: "#222", top2: "#111", kind: "jacket", beard: 0.6 }} />, { z: [1.25, 1.4] }) },
  { c: "Ve onu on bin", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Counter t={t} a={a} from={3} to={10000} dur={1} label="izleyici" y={380} /> },

  { c: "İşte ilk ders", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.3} text="Ders 1: oyunu değil, seni izlerler" y={420} size={68} c="#FFC531" /> },
  { c: "Sessiz bir yayıncı", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]}><InternetKafe t={t} empty /></HCam>, html: (t, a) => <Big t={t} at={a + 0.5} text="= boş bir oda" y={830} size={64} />, tone: "cool" },

  { c: "Ertesi gece mikrofonu", r: (t, a, b) => kafe(t, a, b, S16, { arms: "type", mouth: "open", talk: true, z: [1.3, 1.45], c0: [960, 440], glow: "#FFD27A" }), tone: "warm" },
  { c: "Her gelenin adını", r: (t, a, b) => kover(t, a, b, S16, <StreamUI t={t} viewers={6} chat={CH1.slice(0, 2)} chatK={rp(t, a, a + 2)} face={S16} />) },
  { c: "Hoş geldin Ahmet", r: (t, a, b) => kafe(t, a, b, S16, { arms: "wave", mouth: "grin", talk: true, z: [1.5, 1.6], c0: [960, 430] }), html: (t, a) => <Big t={t} at={a + 0.3} text={'"Hoş geldin Ahmet!"'} y={830} size={56} /> },
  { c: "Bir ay sonra her gece", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.08]}><rect width={1920} height={1080} fill="#10131A" /><Clock x={620} y={520} s={1.4} h={21} m={0} />{tx(1260, 500, "21:00", 120, "#FFF", 800, "middle")}</HCam>, html: (t, a) => <Counter t={t} a={a + 1.5} from={3} to={40} dur={1} label="izleyici bekliyor" y={700} c={H.green} /> },

  { c: "İkinci ders burada", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.3} text="Ders 2: yayın saati = dizi saati" y={420} size={72} c="#FFC531" /> },
  { c: "İnsanlar seni nerede", r: (t, a, b) => board(t, a, b, <g>{["PZT", "SAL", "ÇAR", "PER", "CUM", "CMT", "PAZ"].map((d, i) => <g key={i} opacity={rp(t, a + i * 0.15, a + 0.3 + i * 0.15)} transform={`translate(${300 + i * 220},520)`}><rect x={-90} y={-120} width={180} height={240} rx={18} fill="#1A1E27" stroke={TW} strokeWidth={4} />{tx(0, -50, d, 38, "#CCC", 700, "middle")}{tx(0, 50, "21:00", 40, "#FFF", 800, "middle")}</g>)}</g>) },

  // ── ORTAKLIK
  { c: "Sonra bir gün bir e-posta", r: (t, a, b) => mon(t, a, b, <Mail from="Yayın platformu" subject="Ortaklık programına davetlisin!" lines={["Tebrikler, şartları doldurdun.", "Artık izleyicilerin sana abone olabilir."]} k={rp(t, a, a + 0.6)} badge="Davet" badgeC={TW} />, { z: [1.25, 1.35] }), sfx: "pop" },
  { c: "Şartları doldurmuşsun", r: (t, a, b) => board(t, a, b, cards(t, a + 0.3, ["50\ntakipçi", "30 günde\n7 farklı gün", "Ortalama\n3 izleyici"], TW)) },
  { c: "Artık izleyicilerin", r: (t, a, b) => kafe(t, a, b, S16, { arms: "wave", mouth: "grin", z: [1.3, 1.4] }) },
  { c: "O gece ilk abonen", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={44} chat={CH1} face={S16} banner="İLK ABONE! 🎉" sub={rp(t, a + 0.3, a + 2.5)} />, { z: [1.25, 1.35] }), sfx: "pop" },
  { c: "Sen de bağırıyorsun", r: (t, a, b) => kafe(t, a, b, S16, { arms: "head", mouth: "open", eyes: "wide", z: [1.5, 1.6], c0: [960, 430], shake: 0.3 }) },
  { c: "Ama ay sonunda kazancına", r: (t, a, b) => kafe(t, a, b, S16, { arms: "chin", mouth: "flat", brow: "worry", z: [1.4, 1.5], c0: [960, 430] }), tone: "cool" },

  { c: "Türkiye'de abonelik fiyatı", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["Türkiye", 0.22, "9,90 TL"]} right={["Amerika", 1, "4,99 $"]} />), html: (t, a) => <Big t={t} at={a + 0.4} text="Bir abonelik" y={70} size={56} /> },
  { c: "Platform bunu Türkiye", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.3} text="Yerel fiyat ilk olarak Türkiye'de" sub="2021" y={420} size={68} c="#FFC531" /> },
  { c: "Ve o paranın yarısını", r: (t, a, b) => board(t, a, b, <g><circle cx={960} cy={520} r={240} fill={TW} /><path d="M960,520 L960,280 A240,240 0 0 1 960,760Z" fill={H.green} />{tx(820, 540, "platform", 40, "#FFF", 700, "middle")}{tx(1100, 540, "sen", 44, "#FFF", 800, "middle")}</g>) },
  { c: "Yani her abone sana", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.55]} c0={[960, 560]}><rect width={1920} height={1080} fill="#2A2420" /><rect y={620} width={1920} height={460} fill={H.wood2} /><g transform="translate(820,600)"><ellipse rx={170} ry={150} fill="none" stroke="#C88A3E" strokeWidth={46} /><ellipse rx={170} ry={150} fill="none" stroke="#E0B060" strokeWidth={10} strokeDasharray="6 14" /></g><TeaGlass x={1200} y={640} s={2} t={t} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="1 abone ≈ 1 simit + 1 çay" y={80} size={64} c="#FFC531" /> },
  { c: "Yine de vazgeçmiyorsun", r: (t, a, b) => kafe(t, a, b, S16, { arms: "type", mouth: "smile", talk: true, z: [1.2, 1.3] }) },

  // ── 18: TİPİ
  { c: "On sekiz yaşına", r: (t, a, b) => fam(t, a, b, <g><Person x={620} y={1000} s={1} t={t} o={BABA5} arms="cross" mouth="flat" /><Person x={980} y={1000} s={0.95} t={t} o={ANNE5} arms="down" mouth="flat" brow="worry" /><Person x={1340} y={1000} s={0.95} t={t} o={S18} arms="down" mouth="tight" dir={-1} /></g>), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="18 yaş" place="Erzurum" /> },
  { c: "Baban akşam yemeğinde", r: (t, a, b) => fam(t, a, b, <Person x={960} y={1000} s={1.15} t={t} o={BABA5} arms="down" mouth="open" talk brow="angry" />, { z: [1.5, 1.6], c0: [960, 430] }), html: (t, a) => <Big t={t} at={a + 1.2} text={'"Buna iş mi diyorsun?"'} y={830} size={60} /> },
  { c: "Sen bir şey diyemiyorsun", r: (t, a, b) => fam(t, a, b, <Person x={960} y={1000} s={1.1} t={t} o={S18} arms="down" mouth="sad" brow="worry" />, { z: [1.5, 1.6], c0: [960, 430] }), tone: "cool" },
  { c: "Ve o kış, hayatının", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.12]}><InternetKafe t={t} /><rect width={1920} height={1080} fill="#000" opacity={0.25} /></HCam>, sfx: "drone" },

  { c: "Türkiye'nin en büyük yayıncılarından", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={80000} chat={["herkes: RAID!!", "ozan: gidiyoruz", "kerem: kim bu"]} face={{ hairStyle: "curly", top: "#222", top2: "#111", kind: "jacket", beard: 0.6 }} banner="RAID → seni" />, { z: [1.25, 1.35] }) },
  { c: "Bir anda kanalına iki bin", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={Math.round(40 + rp(t, a, a + 1.2) * 1960)} chat={CH2} face={S18} />, { z: [1.3, 1.5], c0: [1100, 300] }), html: (t, a) => <Counter t={t} a={a} from={40} to={2000} dur={1} label="izleyici" y={700} c="#FFC531" />, sfx: "boom" },
  { c: "Ellerin titriyor", r: (t, a, b) => kafe(t, a, b, S18, { arms: "type", mouth: "open", eyes: "wide", z: [1.5, 1.6], c0: [960, 430], shake: 0.5 }) },
  { c: "Ve tam o anda, dışarıdaki tipi", r: (t, a, b) => tipi(t, a, b), sfx: "whoosh", tone: "cool" },
  { c: "Ekran donuyor", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={2000} chat={CH2} face={S18} frozen />, { z: [1.3, 1.45] }) },
  { c: "İki bin kişi, donmuş", r: (t, a, b) => kafe(t, a, b, S18, { arms: "head", mouth: "open", brow: "worry", z: [1.4, 1.5], c0: [960, 430] }) },
  { c: "Hat geri geldiğinde", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={17} chat={["Ahmet: abi geldin mi", "karslı_36: buradayız"]} face={S18} />, { z: [1.5, 1.8], c0: [1100, 260] }), html: (t, a) => <Big t={t} at={a + 1.2} text="17" y={380} size={220} c="#FF6B6B" /> },

  { c: "O gece yürüyerek", r: (t, a, b) => walk(t, a, b), tone: "cool" },
  { c: "Ve kendine bir söz", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.55]} c0={[960, 500]}><SnowStreet t={t} /><Person x={960} y={1060} s={1.1} t={t} o={S18} arms="down" mouth="tight" brow="angry" lit={1} /></HCam>, html: (t, a) => <Big t={t} at={a + 1} text="Bir daha tek bir hatta değil." y={80} size={60} c="#FFC531" /> },

  { c: "O yaz, kafede bulaşık", r: (t, a, b) => cemal(t, a, b, { sen: S18, senArms: "hold", talk: true, z: [1.1, 1.2] }) },
  { c: "kendi bilgisayarını", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 560]}><rect width={1920} height={1080} fill="#1A1C22" /><rect y={640} width={1920} height={440} fill={H.wood2} />{["#2BB673", "#3EA6FF", "#C77DFF", "#FFC531"].map((c, i) => <g key={i} transform={`translate(${560 + i * 260},${600 - rp(t, a + i * 0.4, a + 0.6 + i * 0.4) * 30})`}><rect x={-90} y={-50} width={180} height={100} rx={8} fill="#2A2E36" stroke={c} strokeWidth={4} />{tx(0, 10, ["RAM", "Ekran k.", "Anakart", "Güç"][i], 28, "#FFF", 700, "middle")}</g>)}<PcCase x={1600} y={760} s={1.3} t={t} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="İkinci el parçalar" y={80} size={60} /> },
  { c: "Eve ayrı bir fiber", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.15, 1.25]}><TeenRoom t={t} night poster="GG" /><Person x={760} y={980} s={0.8} t={t} o={KARDES} arms="hold" mouth="grin" lit={1} /><Person x={1200} y={960} s={0.95} t={t} o={S18} arms="type" mouth="smile" dir={-1} /><PcCase x={1560} y={900} s={1} t={t} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.4} text="Fiber · ↑ 50 Mbps" y={80} size={56} c={H.green} /> },

  // ── KICK
  { c: "Ve tam o sıralarda", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.3} text="Yayıncılık dünyası kaynıyor" y={440} size={72} /> },
  { c: "Adı Kick", r: (t, a, b) => board(t, a, b, <g><rect x={660} y={360} width={600} height={300} rx={30} fill="#111" stroke="#53FC18" strokeWidth={8} />{tx(960, 560, "KICK", 160, "#53FC18", 800, "middle")}</g>) },
  { c: "Teklifi çok cazip", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["Eski platform", 0.5, "%50"]} right={["Kick", 0.95, "%95"]} />), html: (t, a) => <Big t={t} at={a + 0.3} text="Abonelikten yayıncıya kalan" y={70} size={56} c="#FFC531" /> },
  { c: "Büyük yayıncılara", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.3} text="Milyon dolarlık anlaşmalar" y={420} size={84} c="#53FC18" /> },
  { c: "Arkadaşlarının yarısı", r: (t, a, b) => board(t, a, b, <g><People100Grid2 t={t} a={a} /></g>) },
  { c: "Ama bir şey dikkatini", r: (t, a, b) => home(t, a, b, S18, { arms: "chin", mouth: "flat", brow: "worry", z: [1.35, 1.45], c0: [960, 430] }), tone: "cool" },
  { c: "Kick'in en çok izlenen", r: (t, a, b) => mon(t, a, b, <g><rect width={1000} height={625} fill="#0B0E0B" /><rect width={1000} height={40} fill="#111" />{tx(20, 28, "KICK · popüler", 18, "#53FC18", 800)}{[0, 1, 2].map((i) => <g key={i} transform={`translate(${30 + i * 320},80)`}><rect width={300} height={180} rx={10} fill="#3A1A3A" /><circle cx={150} cy={90} r={50} fill="#FFC531" />{tx(150, 104, ["🎰", "🎲", "🃏"][i], 50, "#222", 800, "middle")}{tx(0, 220, ["SLOT 💰", "ZAR 🔥", "RULET"][i], 22, "#FFF", 700)}</g>)}</g>, { z: [1.25, 1.35] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Kumar yayınları" y={830} size={64} c="#FF6B6B" /> },
  { c: "Eski platform bu tür", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.3} text="Eski platform: kumar yayını yasak" sub="2022" y={420} size={64} /> },
  { c: "Ve Kick'in arkasında", r: (t, a, b) => board(t, a, b, <g><rect x={560} y={300} width={800} height={460} rx={24} fill="#1A1E27" />{tx(960, 440, "KICK", 80, "#53FC18", 800, "middle")}<path d="M960,480 L960,560" stroke="#FFF" strokeWidth={6} />{tx(960, 640, "kumar sitesi kurucuları", 46, "#FF6B6B", 700, "middle")}</g>) },
  { c: "Sen de bölünüyorsun", r: (t, a, b) => home(t, a, b, S18, { arms: "type", mouth: "tight", z: [1.25, 1.35], extra: <g><rect x={300} y={420} width={140} height={60} rx={10} fill={TW} />{tx(370, 460, "1", 34, "#FFF", 800, "middle")}<rect x={1480} y={420} width={140} height={60} rx={10} fill="#53FC18" />{tx(1550, 460, "2", 34, "#111", 800, "middle")}</g> }) },
  { c: "Ta ki o sabaha", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.08]}><rect width={1920} height={1080} fill="#10131A" />{cal(t, a, "ŞUBAT", "20", "2024")}</HCam>, sfx: "knock" },

  { c: "Yirmi Şubat", r: (t, a, b) => home(t, a, b, S18, { arms: "type", mouth: "flat", z: [1.3, 1.4] }) },
  { c: "Ekranda tek bir cümle", r: (t, a, b) => mon(t, a, b, <BlockPage k={rp(t, a, a + 0.4)} />, { z: [1.25, 1.4] }), sfx: "boom" },
  { c: "Gerekçe: yasa dışı", r: (t, a, b) => mon(t, a, b, <BlockPage />, { z: [1.6, 1.8], c0: [960, 560] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Gerekçe: yasa dışı bahis" y={80} size={60} c="#FF6B6B" /> },
  { c: "Oraya tamamen taşınan", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["Önce", 1, "100%"]} right={["O hafta", 0.42, "< %50"]} />), html: (t, a) => <Big t={t} at={a + 0.3} text="Taşınan arkadaşının izleyicisi" y={70} size={54} /> },

  { c: "Üçüncü ders", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.3} text="Ders 3: platform = kiralık oda" y={420} size={72} c="#FFC531" /> },
  { c: "Ve ev sahibi bir sabah", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]}><Door t={t} open={1 - rp(t, a + 0.6, a + 1.2)} /></HCam>, sfx: "knock" },

  // ── TIKTOK
  { c: "On dokuz yaşındasın", r: (t, a, b) => home(t, a, b, S18, { arms: "phone", mouth: "smile", z: [1.25, 1.35] }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="19 yaş" place="Erzurum" /> },
  { c: "telefonunda, dikey", r: (t, a, b) => tik(t, a, b, <TikLive t={t} face={S18} viewers={120} />), html: (t, a) => <Big t={t} at={a + 1.5} text="TikTok canlı" y={80} size={60} c="#FE2C55" /> },
  { c: "Burada her şey başka", r: (t, a, b) => tik(t, a, b, <TikLive t={t} face={S18} viewers={340} gifts={0.4} />, { z: [1.15, 1.3] }) },
  { c: "Ve sana hediye", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]}><rect width={1920} height={1080} fill="#1A1030" />{["🌹", "🦁", "🪐"].map((g, i) => { const k = rp(t, a + 0.8 + i * 0.7, a + 1.2 + i * 0.7); return <g key={i} opacity={k} transform={`translate(${520 + i * 440},${560 - k * 40})`}><circle r={150} fill="#FFF" opacity={0.08} /><text y={70} fontSize={200} textAnchor="middle">{g}</text></g>; })}</HCam> },
  { c: "Başka yayıncılarla", r: (t, a, b) => tik(t, a, b, <TikLive t={t} face={S18} viewers={2100} gifts={1} pk={0.5 + Math.sin((t - a) * 1.5) * 0.15} />, { z: [1.1, 1.25] }) },
  { c: "İzleyiciler, sen kazan", r: (t, a, b) => tik(t, a, b, <TikLive t={t} face={S18} viewers={2400} gifts={1.4} pk={0.5 + rp(t, a, a + 2) * 0.25} />, { z: [1.25, 1.4] }), sfx: "pop" },

  { c: "İlk büyük gecende", r: (t, a, b) => tik(t, a, b, <TikLive t={t} face={S18} viewers={3100} gifts={1.4} total={`${fmt(Math.round(rp(t, a, a + 2) * 4000))} TL`} />, { z: [1.15, 1.35] }) },
  { c: "Kardeşin odaya koşup", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 480]}><TeenRoom t={t} night poster="GG" /><Person x={860} y={980} s={0.8} t={t} o={KARDES} arms="wave" mouth="grin" lit={1} /><Person x={1100} y={960} s={0.95} t={t} o={S18} arms="wave" mouth="grin" dir={-1} /></HCam>, tone: "warm" },
  { c: "Ama hesabına geçen", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["Ekrandaki hediye", 1, "4.000 TL"]} right={["Hesabına geçen", 0.35, "çok daha az"]} />) },
  { c: "Çünkü hediyelerin büyük", r: (t, a, b) => board(t, a, b, <g><circle cx={960} cy={520} r={240} fill="#FE2C55" /><path d="M960,520 L960,280 A240,240 0 0 1 1188,446Z" fill={H.green} />{tx(860, 600, "platform", 44, "#FFF", 700, "middle")}{tx(1080, 400, "sen", 36, "#FFF", 800, "middle")}</g>) },
  { c: "Bir araştırmada", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.4} text="%70'e kadar" sub="BBC araştırması · bazı yayınlarda" y={400} size={140} c="#FF6B6B" /> },

  { c: "Ve bir gece, hiç beklemediğin", r: (t, a, b) => home(t, a, b, S18, { arms: "phone", mouth: "flat", z: [1.35, 1.45], c0: [960, 430] }), tone: "cool" },
  { c: "Bir kadın yazıyor", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#0F0F0F" />{tx(180, 70, "Mesaj isteği", 22, "#AAA", 600, "middle")}<rect x={20} y={120} width={300} height={190} rx={22} fill="#2E2E2E" />{["On dört yaşındaki oğlum,", "kartımla sizin yayınınızda", "3.000 lira harcamış."].map((l, i) => <g key={i}>{tx(40, 170 + i * 40, l, 19, "#FFF", 500)}</g>)}</g>, { z: [1.15, 1.3] }) },
  { c: "O çocuğun adını", r: (t, a, b) => tik(t, a, b, <TikLive t={t} face={S18} viewers={900} gifts={0.3} />, { z: [1.5, 1.7] }), html: (t, a) => <Big t={t} at={a + 1.2} text={'"abi kazan 🔥"'} y={830} size={60} /> },

  { c: "O gece yayını erken", r: (t, a, b) => home(t, a, b, S18, { arms: "down", mouth: "sad", brow: "worry", z: [1.45, 1.6], c0: [960, 430] }) },
  { c: "Artık hiçbir yayında", r: (t, a, b) => tik(t, a, b, <TikLive t={t} face={S18} viewers={700} noGifts />, { z: [1.15, 1.3] }) },
  { c: "Gelirin hemen yarıya", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["Önce", 1, "×1"]} right={["Hediyesiz", 0.5, "½"]} />) },
  { c: "Ama bir şey oluyor", r: (t, a, b) => board(t, a, b, <g><Comment x={540} y={300} name="Ahmet" text="Bunu yaptığın için teşekkürler abi." k={rp(t, a, a + 0.4)} /><Comment x={540} y={470} name="ayse_25" text="Ben sadece seni izlemeye geliyorum zaten." c="#2BB673" k={rp(t, a + 0.6, a + 1)} /><Comment x={540} y={640} name="karslı_36" text="Helal olsun." c="#E5322D" k={rp(t, a + 1.2, a + 1.6)} /></g>), tone: "warm" },
  { c: "Ve seni izleyenler", r: (t, a, b) => tik(t, a, b, <TikLive t={t} face={S18} viewers={1500} noGifts />, { z: [1.2, 1.35] }), tone: "warm" },

  // ── 20
  { c: "Yirmi yaşına geliyorsun", r: (t, a, b) => home(t, a, b, S20, { arms: "type", mouth: "smile", talk: true, z: [1.15, 1.25] }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="20 yaş" place="Erzurum" /> },
  { c: "Yayını bir platformda", r: (t, a, b) => board(t, a, b, cards(t, a, ["Canlı yayın", "YouTube'a\nen iyi anlar", "Kendi\nsohbet grubu"], TW)) },
  { c: "En iyi anlarını kesip", r: (t, a, b) => home(t, a, b, S20, { arms: "type", mouth: "smile", z: [1.3, 1.4], c0: [960, 440] }), html: (t, a) => <Big t={t} at={a + 0.4} text="YouTube · Sohbet grubu" y={80} size={56} /> },
  { c: "Ve ilk gerçek sponsorun", r: (t, a, b) => mon(t, a, b, <Mail from="Kulaklık markası" subject="Sponsorluk teklifi" lines={["Oyuncu kulaklıklarımız için", "aylık iş birliği öneriyoruz."]} k={rp(t, a, a + 0.6)} badge="Yasal" />, { z: [1.25, 1.35] }), sfx: "pop" },
  { c: "Yasal, kimseyi", r: (t, a, b) => home(t, a, b, S20, { arms: "desk", mouth: "smile", z: [1.4, 1.5], c0: [960, 430] }), html: (t, a) => <Big t={t} at={a + 0.3} text="Yasal. Kimseye zarar yok." y={830} size={58} c={H.green} /> },
  { c: "Abonelikler, YouTube, sponsor", r: (t, a, b) => board(t, a, b, <g>{[["Abonelikler", 1100, TW], ["YouTube", 900, YTc], ["Sponsor", 1000, H.amber]].map(([l, v, c], i) => { const k = rp(t, a + i * 0.4, a + 0.6 + i * 0.4); return <g key={i} opacity={k}><rect x={420} y={300 + i * 170} width={(v as number) * 0.8 * k} height={110} rx={14} fill={c as string} />{tx(400, 370 + i * 170, l as string, 42, "#FFF", 700, "end")}{tx(440 + (v as number) * 0.8 * k, 370 + i * 170, `$${fmt(v as number)}`, 42, "#FFF", 700)}</g>; })}</g>), html: (t, a) => <Big t={t} at={a + 2} text="Ayda ≈ $3.000" y={900} size={72} c="#FFC531" /> },
  { c: "Babanın bir yılda", r: (t, a, b) => fam(t, a, b, <g><Person x={760} y={1000} s={1} t={t} o={BABA5} arms="down" mouth="smile" talk /><Person x={1250} y={1000} s={1} t={t} o={S20} arms="down" mouth="grin" dir={-1} /></g>), html: (t, a) => <Big t={t} at={a + 1.8} text={'"Bu ay kaç kişi geldi?"'} y={820} size={58} /> },

  // ── VEDA YAYINI
  { c: "Ve sonra, bir telefon", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#1B2440" />{tx(180, 260, "Cemal Abi", 40, "#FFF", 700, "middle")}{tx(180, 310, "arıyor…", 24, "#AAA", 600, "middle")}<circle cx={90} cy={600} r={40} fill={H.red} /><circle cx={270} cy={600} r={40} fill={H.green} /></g>, { z: [1.1, 1.25] }), sfx: "knock" },
  { c: "İnternet kafe kapanıyor", r: (t, a, b) => cemal(t, a, b, { last: true, empty: true, mouth: "sad", z: [1.2, 1.3] }), tone: "cool" },
  { c: "Son gün cumartesi", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.55]} c0={[300, 500]}><InternetKafe t={t} last empty /></HCam> },
  { c: "Sen de bir şey yapmaya", r: (t, a, b) => cemal(t, a, b, { sen: S20, senArms: "wave", last: true, talk: true, z: [1.1, 1.2] }) },
  { c: "O kafeden, yedi numaralı", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.3} text="24 saatlik veda yayını" sub="7 numaralı bilgisayardan" y={420} size={84} c="#FFC531" /> },

  { c: "Cumartesi sabahı başlıyorsun", r: (t, a, b) => kafe(t, a, b, S20, { talk: true, mouth: "smile", z: [1.15, 1.25], last: true }) },
  { c: "Sonra büyük yayıncılar", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={Math.round(800 + rp(t, a, a + 3) * 8000)} chat={CH1} face={S20} />, { z: [1.25, 1.35] }) },
  { c: "Gece yarısı, kanalında", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Counter t={t} a={a} from={8000} to={20000} dur={1} label="izleyici · 00:00" y={380} /> },
  { c: "Sabaha karşı otuz bin", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Counter t={t} a={a} from={20000} to={30000} dur={0.8} label="izleyici · 05:00" y={380} c="#FFC531" /> },
  { c: "Ve son saatte", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={Math.round(30000 + rp(t, a, a + 2.5) * 20412)} chat={CH3.slice(0, 3)} face={S20} />, { z: [1.3, 1.6], c0: [760, 330] }), sfx: "boom" },

  { c: "İşte o anda, o mesaj", r: (t, a, b) => SHOTS[3].r(t, a, b), sfx: "knock", tone: "cool" },
  { c: "Hesap yapıyorsun", r: (t, a, b) => kafe(t, a, b, S20, { arms: "chin", mouth: "flat", z: [1.5, 1.65], c0: [960, 430], last: true }) },
  { c: "Bu para Cemal Abi'nin", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["Kafenin 1 yıllık kirası", 0.9, "≈"]} right={["Teklif", 0.95, "$20.000"]} />) },
  { c: "Kimse fark etmez", r: (t, a, b) => mon(t, a, b, <g><StreamUI t={t} viewers={50412} chat={CH3.slice(0, 3)} face={S20} /><rect x={560} y={60} width={140} height={60} rx={8} fill="#FFC531" opacity={rp(t, a + 0.5, a + 1)} />{tx(630, 100, "LOGO", 26, "#222", 800, "middle")}</g>, { z: [1.4, 1.6], c0: [1100, 300] }) },

  { c: "Sonra sohbete bakıyorsun", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={50412} chat={CH3} chatK={rp(t, a, a + 2.5)} face={S20} />, { z: [1.6, 2], c0: [1300, 400] }) },
  { c: "O çocuk. Artık on beş", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={50412} chat={CH3} face={S20} />, { z: [2.2, 2.5], c0: [1320, 470] }), html: (t, a) => <Big t={t} at={a + 0.8} text={'"Abi, ilk yayınından beri buradayım"'} y={830} size={52} />, tone: "warm" },
  { c: "O logoyu görüp", r: (t, a, b) => kafe(t, a, b, S20, { arms: "down", mouth: "tight", brow: "worry", z: [1.6, 1.75], c0: [960, 420], last: true }) },
  { c: "Bir de, o hafta haberlerde", r: (t, a, b) => scr(t, a, b, <News head="Yasa dışı bahis reklamına gözaltı" sub="Çok sayıda sosyal medya fenomeni gözaltına alındı" k={rp(t, a, a + 0.5)} />, { z: [1.2, 1.3], old: false }) },
  { c: "Yasa dışı bahis reklamı yapan", r: (t, a, b) => scr(t, a, b, <News head="Yasa dışı bahis reklamına gözaltı" sub="Çok sayıda sosyal medya fenomeni gözaltına alındı" k={1} />, { z: [1.45, 1.6], old: false }) },

  { c: "Mesajı açıp tek bir", r: (t, a, b) => mon(t, a, b, <Mail from="Sen → Sponsorluk" subject="Cevap" lines={["Benim yayınımda olmaz."]} k={rp(t, a + 0.6, a + 1.8)} badge="Gönderildi" />, { z: [1.25, 1.4] }), html: (t, a) => <Big t={t} at={a + 1.8} text={'"Benim yayınımda olmaz."'} y={80} size={64} c="#FFC531" /> },
  { c: "Ve kameraya dönüp", r: (t, a, b) => kafe(t, a, b, S20, { arms: "wave", mouth: "open", talk: true, z: [1.4, 1.5], c0: [960, 430], last: true }) },
  { c: "Sohbet bir saniye duruyor", r: (t, a, b) => mon(t, a, b, <StreamUI t={t} viewers={50412} chat={t > a + 1.8 ? ["Ahmet: HELAL OLSUN ABİ", "karslı_36: helal olsun", "bilal_15: helal olsun abi", "Emre: 👏👏👏", "Mert: efsane"] : []} chatK={rp(t, a + 1.8, a + 3.5)} face={S20} />, { z: [1.4, 1.6], c0: [1250, 330] }), html: (t, a) => <Big t={t} at={a + 2.6} text={'"Helal olsun abi."'} y={830} size={64} c={H.green} /> },

  { c: "Yayın bitiyor", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.1]}><InternetKafe t={t} last empty /><rect width={1920} height={1080 * rp(t, a + 0.8, a + 2.5)} fill="#5A6170" />{Array.from({ length: 30 }, (_, i) => <rect key={i} y={i * 36} width={1920} height={4} fill="#3A4050" opacity={rp(t, a + 0.8, a + 2.5)} />)}</HCam> },
  { c: "Ve Cemal Abi, yedi", r: (t, a, b) => cemal(t, a, b, { sen: S20, senArms: "hold", last: true, empty: true, mouth: "smile", talk: true, z: [1.2, 1.3], hold: <PcCase x={0} y={120} s={1.05} t={t} n={7} /> }), html: (t, a) => <Big t={t} at={a + 2} text={'"Bu artık senin."'} y={820} size={64} c="#FFC531" />, tone: "warm" },

  // ── HÜKÜM
  { c: "Peki... gerçekten değer mi", r: (t, a, b) => home(t, a, b, S20, { arms: "desk", mouth: "flat", z: [1.3, 1.4] }), html: (t, a) => <Big t={t} at={a + 0.5} text="Gerçekten değer mi?" y={70} size={72} c="#FFC531" /> },
  { c: "Eğer oyunda iyi", r: (t, a, b) => board(t, a, b, <g>{tx(960, 560, "Oyunda iyi olmak yetmez", 76, "#FF6B6B", 700, "middle")}</g>) },
  { c: "İnsanlar senin oyununu değil", r: (t, a, b) => kafe(t, a, b, S16, { arms: "wave", mouth: "grin", talk: true, z: [1.3, 1.4] }) },
  { c: "Bu işte para", r: (t, a, b) => board(t, a, b, cards(t, a, ["Abone:\nçok az", "Hediye:\nplatformda kalır", "Büyük teklif:\nkirli yer"], H.red)) },
  { c: "Türkiye'de bir abone sana çok", r: (t, a, b) => SHOTS.find((x) => x.c === "Bu işte para")!.r(t, a - 1.5, b) },
  { c: "Ve en büyük teklifler", r: (t, a, b) => board(t, a, b, <g />, { bg: "#140808" }), html: (t, a) => <Big t={t} at={a + 0.3} text="En büyük teklif = en kirli yer" y={420} size={72} c="#FF6B6B" /> },
  { c: "Ama her gece aynı saatte", r: (t, a, b) => SHOTS.find((x) => x.c === "İnsanlar seni nerede")!.r(t, a, b) },
  { c: "Gerçek kazanç tek bir", r: (t, a, b) => board(t, a, b, <People100Grid2 t={t} a={a - 4} />), html: (t, a) => <Big t={t} at={a + 0.6} text="Topluluk > platform" y={80} size={72} c="#FFC531" /> },
  { c: "Seni bir platform kapansa", r: (t, a, b) => mon(t, a, b, <BlockPage />, { z: [1.2, 1.3] }), html: (t, a) => <Big t={t} at={a + 0.6} text="…ama topluluğun seni bulur" y={830} size={56} c={H.green} /> },
  { c: "Başlamak için iyi bir", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["İyi yükleme\nhızı", "İdare eden\nbilgisayar", "Mikrofon"], H.blue)) },
  { c: "Ama asıl sermaye", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.08]}><rect width={1920} height={1080} fill="#10131A" /><Clock x={960} y={520} s={2} h={21} m={0} spin={(t - a) * 2} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="Yıllarca, her gece" y={70} size={64} /> },
  { c: "Kimler için? İnsanlarla", r: (t, a, b) => kafe(t, a, b, S20, { arms: "type", mouth: "smile", talk: true, z: [1.2, 1.3] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Kimler için?" sub="3 kişiye de 100 kişiye de aynı enerji" y={70} size={70} c="#FFC531" /> },
  { c: "ve yüz kişiye de üç", r: (t, a, b) => SHOTS.find((x) => x.c === "Biri annen")!.r(t, a, b) },
  { c: "Kimler için değil", r: (t, a, b) => board(t, a, b, <g />, { bg: "#140808" }), html: (t, a) => <Big t={t} at={a + 0.3} text="Kimler için değil?" sub="parayı nereden geldiğine bakmadan alanlar" y={420} size={76} c="#FF6B6B" /> },
  { c: "Zorluk: ondan sekiz", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.05]}><rect width={1920} height={1080} fill="#0E1016" /></HCam>, html: (t, a) => <Verdict t={t} a={a} rows={[["Zorluk", 8], ["Sermaye", 4], ["Sabır", 9]]} title="Türkiye'de yayıncı olmak" /> },
  { c: "Şimdi sıra sende", r: (t, a, b) => { const msg = "Ben ... işine başlamak istiyorum"; const n = Math.floor(rp(t, a + 2.5, a + 5) * msg.length); return board(t, a, b, <g transform="translate(960,460)"><rect x={-680} y={-170} width={1360} height={340} rx={30} fill="#1A1E27" /><circle cx={-560} cy={-60} r={50} fill={H.blue} />{tx(-480, -50, "Yorum ekle…", 44, "#AAA", 600)}{tx(-480, 60, msg.slice(0, n), 48, "#FFF", 600)}</g>); } },
  { c: "Sıradaki işleri", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["Senin\nyorumun", "Sıradaki\niş", "Bütün\nyolu"], H.blue)), html: (t, a) => <SubBtn t={t} at={a + 2} /> },
];
const YTc = "#FF0033";

// başka bir yayıncının yayını (telefon içi)
function StreamUIPhone({ t }: { t: number }) {
  return <g><rect width={360} height={740} fill="#0E0E10" /><svg x={0} y={200} width={360} height={225} viewBox="0 0 1000 625"><StreamUI t={t} viewers={10000} chat={[]} face={{ hairStyle: "curly", top: "#222", top2: "#111", kind: "jacket", beard: 0.6 }} /></svg>{CH1.map((m, i) => <g key={i}>{tx(16, 470 + i * 40, m, 16, "#EEE", 500)}</g>)}</g>;
}
// iki platform arasında bölünen insanlar
function People100Grid2({ t, a }: { t: number; a: number }) {
  return <g>{Array.from({ length: 60 }, (_, i) => { const mv = i % 2 === 0; const k = rp(t, a + i * 0.02, a + 0.3 + i * 0.02); const m = mv ? rp(t, a + 1.5, a + 2.5) : 0; const x = 260 + (i % 15) * 50 + (mv ? m * 700 : 0); return <g key={i} opacity={k} transform={`translate(${x},${300 + Math.floor(i / 15) * 130})`}><circle r={18} fill={mv && m > 0.5 ? "#53FC18" : TW} /><path d="M-26,60 Q-26,22 0,20 Q26,22 26,60Z" fill={mv && m > 0.5 ? "#53FC18" : TW} /></g>; })}</g>;
}

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K6_05_SECONDS));
  return raw;
})();

export const K6Video05: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const fadeIn = rp(t, 0, 0.4);
  const cutFlash = 1 - rp(t, s.from, s.from + 0.12);
  const fadeOut = 1 - rp(t, K6_05_SECONDS - 1.5, K6_05_SECONDS);
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
      <Audio src={staticFile("audio/k6-05.wav")} />
      {TIMED.map((x, i) => i > 0 && x.to < K6_05_SECONDS - 15 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.sfx === "knock" ? 0.08 : x.sfx === "boom" || x.sfx === "drone" ? 0.12 : x.sfx ? 0.15 : 0.07} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
