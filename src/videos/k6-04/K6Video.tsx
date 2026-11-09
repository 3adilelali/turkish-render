import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k6-04-words.json";
import { makeCue } from "../../lib/cues";
import { Atmos, Sweep, Tone } from "../../components/Live";
import {
  ANNE, AgeTag, BackView, Big, Comment, Counter, H, HCam, HFrame, Laptop, LineChart, LockScreen, Look, Mail, Notif,
  Person, Phone, Progress, Salon, Stat, Studio, StudioShell, SubBtn, TeaGlass, TeenRoom, Verdict, fmt, rp, short,
} from "../../components/Hayat";
import { AdPool, Defter, KUNEFECI, Knife, Pins, Sac, ShopFront, ShortItem, ShortsFeed, Tantunici, TwoBars, UstaAtSac } from "../../components/HayatCarsi";

// Kanal 4 · k6-04 · "0'dan 1 Milyar İzlenmeye: Türkiye'de Shorts Üreticisi Olarak Hayatın"
// Ses: ElevenLabs Hasan Yasin (eleven_v4), 4 parça; kelime zamanları ElevenLabs hizalaması. Seviye kartı YOK; geçiş yaş etiketiyle.

const W = words as { text: string; start: number; end: number }[];
const cue = makeCue(W);
const VOICE_END = W[W.length - 1].end;
export const K6_04_SECONDS = Math.ceil(VOICE_END + 4);
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


const Clock: React.FC<{ x: number; y: number; s?: number; h: number; m: number; spin?: number }> = ({ x, y, s = 1, h, m, spin = 0 }) => (
  <g transform={`translate(${x},${y}) scale(${s})`}>
    <circle r={150} fill="#F4F1EA" stroke="#222" strokeWidth={12} />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={-4} y={-140} width={8} height={22} fill="#333" transform={`rotate(${i * 30})`} />)}
    <rect x={-6} y={-80} width={12} height={84} rx={6} fill="#222" transform={`rotate(${(h % 12) * 30 + m * 0.5 + spin * 30})`} />
    <rect x={-4} y={-120} width={8} height={124} rx={4} fill="#C0392B" transform={`rotate(${m * 6 + spin * 360})`} />
    <circle r={12} fill="#222" />
  </g>
);

// ───────── k6-04 karakterleri
const S17: Look = { hairStyle: "short", top: "#C0582E", top2: "#9E4522", kind: "hoodie" };
const S19: Look = { hairStyle: "fade", top: "#2F5D8A", top2: "#244A6E", kind: "hoodie", beard: 0.3 };
const S20: Look = { hairStyle: "fade", top: "#1F2633", top2: "#161B25", kind: "jacket", beard: 0.6 };
const BABA4: Look = { hairStyle: "short", hair: "#5A5048", top: "#5E6E7E", top2: "#4A5866", kind: "sweater", mustache: true, glasses: true };
const YT = "#FF0033";

// ───────── k6-04 sahne yardımcıları
// dükkân içi: usta sacta, istersen yanında sen (telefonla çekiyor)
const shop = (t: number, a: number, b: number, p: { z?: [number, number]; c0?: [number, number]; c1?: [number, number]; talk?: boolean; mouth?: any; chop?: boolean; queue?: number; sen?: Look; senArms?: any; senMouth?: any; night?: boolean; look?: number; brow?: any } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1.1, 1.22]} c0={p.c0 ?? [960, 540]} c1={p.c1}>
    <Tantunici t={t} queue={p.queue ?? 0} night={p.night} />
    {p.sen && <Person x={1520} y={900} s={0.92} t={t} o={p.sen} arms={p.senArms ?? "phone"} mouth={p.senMouth ?? "smile"} dir={-1} look={-0.6} lit={1} seed={3} />}
    <UstaAtSac t={t} a={a} talk={p.talk} mouth={p.mouth} chop={p.chop} look={p.look} brow={p.brow} x={p.sen ? 820 : 960} />
  </HCam>
);
// sac + bıçak yakın çekim
const sacClose = (t: number, a: number, b: number, p: { speed?: number; c1?: [number, number] } = {}) => (
  <HCam t={t} a={a} b={b} z={[1.6, 1.85]} c0={[960, 600]} c1={p.c1}>
    <rect width={1920} height={1080} fill="#2A2420" /><ellipse cx={960} cy={560} rx={900} ry={500} fill="url(#hLamp)" />
    <Sac x={960} y={700} s={2.2} t={t} /><Knife x={820} y={560} t={t} s={2.2} speed={p.speed ?? 1} />
  </HCam>
);
// dükkân önü
const front = (t: number, a: number, b: number, queue: number, p: { night?: boolean; z?: [number, number]; c0?: [number, number]; name?: string; awning?: string } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.1]} c0={p.c0}><ShopFront t={t} queue={queue} night={p.night} px={(t - a) * -30} name={p.name} awning={p.awning} /></HCam>
);
// telefon ekranları (360x740)
const pApp = (title: string, big: string, sub = "", c = "#FFF", bg = "#0F0F0F") => (
  <g><rect width={360} height={740} fill={bg} /><rect width={360} height={90} fill="#1A1A1A" /><circle cx={40} cy={55} r={16} fill={YT} /><path d="M35,47 L49,55 L35,63Z" fill="#FFF" />
    {tx(70, 64, title, 22, "#FFF", 600)}{tx(180, 380, big, big.length > 7 ? 48 : 70, c, 700, "middle")}{sub && tx(180, 440, sub, 22, "#AAA", 600, "middle")}</g>
);
const items0: ShortItem[] = [{ bg: "#1C2A3A", label: "Hasan Usta tantuni", kind: "sign", views: "212" }, { bg: "#2A2420", label: "Bu adam bıçağı kaç saniyede bırakıyor?", kind: "knife", views: "40 B" }, { bg: "#2A2420", label: "Ustaya bir soru #1", kind: "sac", views: "3 Mn" }];
const feed = (t: number, a: number, b: number, items: ShortItem[], scroll: number, p: { z?: [number, number]; bg?: Bg; finger?: boolean } = {}) =>
  ph(t, a, b, <ShortsFeed t={t} items={items} scroll={scroll} />, { z: p.z, bg: p.bg });
const swipe = (t: number, a: number, n: number, every = 0.9) => { const i = Math.floor((t - a) / every); const f = rp(t, a + i * every + every * 0.6, a + (i + 1) * every); return Math.min(n - 1, i + f); };
// gelir ekranı (laptop/telefon değil: YouTube Studio benzeri)
const earn = (t: number, a: number, views: string, money: string, mc = H.green) => yt("Gelir", <g>{kv(60, 140, "İzlenme", views, "#FFF", 400)}{kv(520, 140, "Tahmini gelir", money, mc, 400)}<LineChart x={60} y={330} w={880} h={240} pts={[2, 3, 3, 6, 9, 14, 30, 34, 38, 40]} k={rp(t, a, a + 1.4)} c={H.blue} /></g>);
const yt = (title: string, body: React.ReactNode, av = "#C0582E") => <StudioShell title={title} avatar={av}>{body}</StudioShell>;
const kv = (x: number, y: number, label: string, value: string, c = "#FFF", w = 240) => <Stat x={x} y={y} label={label} value={value} c={c} w={w} />;
// yorgan altı gece montajı
const blanket = (t: number, a: number, b: number) => (
  <HCam t={t} a={a} b={b} z={[1.2, 1.32]} c0={[960, 560]}>
    <TeenRoom t={t} night poster="MSK" lamp={0.2} />
    <rect width={1920} height={1080} fill="#050814" opacity={0.6} />
    <path d="M300,1080 Q420,560 960,520 Q1500,560 1620,1080Z" fill="#3E4A6E" /><path d="M360,1080 Q500,640 960,610 Q1420,640 1560,1080Z" fill="#2F3A58" />
    <ellipse cx={960} cy={760} rx={420} ry={260} fill="#9FD4FF" opacity={0.18} />
    <g transform="translate(960,760)"><Person x={0} y={220} s={0.7} t={t} o={S17} arms="phone" mouth="tight" eyes="half" lit={1} /></g>
  </HCam>
);
// aile salonu
const family = (t: number, a: number, b: number, people: React.ReactNode, p: { z?: [number, number]; c0?: [number, number]; c1?: [number, number] } = {}) => room(t, a, b, people, p);

const SHOTS: Sh[] = [
  // ── KANCA
  { c: "Bir sabah telefonun", r: (t, a, b) => ph(t, a, b, <LockScreen time="08:12" date="Pazar, 9 Kasım"><Notif x={0} y={20} app="YouTube" title="Tebrikler!" body="Kanalın 1 milyar izlenmeyi geçti." k={rp(t, a + 0.8, a + 1.3)} icon={YT} /></LockScreen>, { z: [1.05, 1.2] }), sfx: "pop" },
  { c: "Bir milyar.", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Counter t={t} a={a} from={0} to={1000000000} dur={1.2} label="izlenme" y={380} c="#FFC531" /> },
  { c: "Annen mutfaktan", r: (t, a, b) => family(t, a, b, <g><Person x={760} y={1000} s={1} t={t} o={ANNE} arms="hold" mouth="smile" talk hold={<TeaGlass x={0} y={0} s={1.2} t={t} />} /><Person x={1250} y={1000} s={1} t={t} o={S20} arms="phone" mouth="smile" dir={-1} /></g>), html: (t, a) => <Big t={t} at={a + 1.6} text={'"E oğlum, zengin olduk mu?"'} y={820} size={60} /> },
  { c: "Gülerek gelir", r: (t, a, b) => ph(t, a, b, pApp("Gelir", "$8.400", "toplam · 1 milyar izlenme", H.green), { z: [1.1, 1.35] }) },
  { c: "Ve gülmen yüzünde", r: (t, a, b) => desk(t, a, b, S20, { bg: "salon", arms: "phone", mouth: "o", eyes: "wide", brow: "worry", z: [1.6, 1.8], c0: [960, 420], old: false }), sfx: "boom", tone: "cool" },
  { c: "Toplam kazanç", r: (t, a, b) => board(t, a, b, <g>{tx(960, 420, "1.000.000.000 izlenme", 70, "#FFF", 700, "middle")}{tx(960, 620, "< $9.000", 200, "#FF6B6B", 800, "middle")}</g>) },
  { c: "Evet, yanlış duymadın", r: (t, a, b) => desk(t, a, b, S20, { bg: "salon", arms: "cross", mouth: "tight", z: [1.3, 1.4], old: false, lookY: 0 }) },
  { c: "Ama bu hikâye", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["Shorts reklamı", 0.15, "$300"]} right={["Birkaç ay sonra", 1, "$4.000+"]} />), html: (t, a) => <Big t={t} at={a + 2} text="ayda" y={70} size={60} c="#FFC531" /> },
  { c: "Ve bunu değiştiren", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["YouTube\ndeğil", "Algoritma\ndeğil"], H.red, 520, 640, 520)) },
  { c: "Bir tantuni ustasının", r: (t, a, b) => shop(t, a, b, { z: [1.5, 1.7], c0: [960, 470], chop: false, mouth: "flat", look: 0.3 }), html: (t, a) => <Big t={t} at={a + 1.2} text="Tek bir soru." y={820} size={70} c="#FFC531" />, tone: "warm" },
  { c: "Bu soruyu aklında", r: (t, a, b) => sacClose(t, a, b, { speed: 0.4 }), html: (t, a) => <Big t={t} at={a + 0.6} text="Geri gelecek." y={830} size={64} /> },

  { c: "On yedi yaşındasın", r: (t, a, b) => front(t, a, b, 0, { z: [1.15, 1.05] }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="17 yaş" place="Mersin" /> },
  { c: "Şimdi seninle bu yolun", r: (t, a, b) => board(t, a, b, <g>{["0", "1 Milyar", "Para"].map((s, i) => { const k = rp(t, a + i * 0.9, a + 0.4 + i * 0.9); return <g key={i} opacity={k}><circle cx={460 + i * 500} cy={520} r={110} fill={[H.blue, YT, H.green][i]} />{tx(460 + i * 500, 545, s, 54, "#FFF", 800, "middle")}{i < 2 && <path d={`M${590 + i * 500},520 L${830 + i * 500},520`} stroke="#FFF" strokeWidth={8} strokeDasharray="20 14" />}</g>; })}</g>) },
  { c: "sonra da o izlenmeleri", r: (t, a, b) => front(t, a, b, 8, { z: [1.15, 1.05] }), html: (t, a) => <Big t={t} at={a + 0.3} text="İzlenme → para" y={80} size={72} c="#FFC531" /> },
  { c: "Shorts parasının neden", r: (t, a, b) => board(t, a, b, cards(t, a, ["Shorts parası\nneden az?", "Gizli küçük\nkurallar", "Reddedilen\nteklif"], H.blue)) },
  { c: "bir gece, hayatının", r: (t, a, b) => ph(t, a, b, <LockScreen time="23:58" date="Cuma"><Notif x={0} y={20} app="Mesaj" title="Büyük teklif" body="Son cevap: gece yarısı." k={rp(t, a + 0.5, a + 1)} /></LockScreen>, { z: [1.1, 1.25] }), tone: "cool", sfx: "knock" },
  { c: "Ve en sonunda sana", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.6} text="Gerçekten değer mi?" y={440} size={100} c="#FFC531" /> },

  // ── YAZ: ÇIRAK
  { c: "Her şey bir yaz", r: (t, a, b) => front(t, a, b, 1, { z: [1, 1.12] }) },
  { c: "baban Boş durma", r: (t, a, b) => family(t, a, b, <g><Person x={800} y={1000} s={1} t={t} o={BABA4} arms="cross" mouth="flat" talk /><Person x={1250} y={1000} s={0.9} t={t} o={S17} arms="down" mouth="sad" dir={-1} /></g>), html: (t, a) => <Big t={t} at={a + 0.4} text={'"Boş durma."'} y={90} size={64} /> },
  { c: "küçük bir tantunicide", r: (t, a, b) => shop(t, a, b, { sen: S17, senArms: "down", senMouth: "smile", z: [1, 1.1] }) },
  { c: "Günlüğü üç yüz", r: (t, a, b) => shop(t, a, b, { sen: S17, senArms: "hold", z: [1.3, 1.4], c0: [1300, 560] }), html: (t, a) => <Big t={t} at={a + 0.3} text="Günlük 300 TL" y={90} size={70} c="#FFC531" /> },
  { c: "Ustanın adı Hasan", r: (t, a, b) => shop(t, a, b, { z: [1.5, 1.65], c0: [960, 450], talk: true, mouth: "smile" }), html: (t, a) => <Big t={t} at={a + 0.4} text="Hasan Usta · 60 yaş" y={830} size={56} /> },
  { c: "ve sacın üstünde", r: (t, a, b) => sacClose(t, a, b, { speed: 1.4 }), sfx: "whoosh" },

  { c: "Telefonun da kendi", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#1B2440" /><path d="M300,0 L250,120 L330,200 L280,320" stroke="#FFF" strokeWidth={3} fill="none" opacity={0.7} /><path d="M250,120 L180,150" stroke="#FFF" strokeWidth={2} opacity={0.6} />{tx(180, 380, "İkinci el", 40, "#FFF", 700, "middle")}</g>, { z: [1.1, 1.25] }) },
  { c: "Hafızası hep dolu", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#111" />{tx(180, 330, "Depolama", 30, "#FFF", 600, "middle")}<Progress x={40} y={380} w={280} v={0.97} c={H.red} />{tx(180, 470, "%97 dolu", 34, "#FF6B6B", 700, "middle")}</g>, { z: [1.15, 1.25] }) },

  { c: "Bir öğle arası", r: (t, a, b) => shop(t, a, b, { sen: S17, senArms: "phone", z: [1.05, 1.18], c0: [1100, 540] }) },
  { c: "Sac, et, limon", r: (t, a, b) => sacClose(t, a, b, { speed: 1, c1: [1100, 640] }), html: (t, a) => <Big t={t} at={a + 1.5} text="15 saniye" y={80} size={60} /> },
  { c: "Akşam yüklüyorsun", r: (t, a, b) => desk(t, a, b, S17, { arms: "phone", mouth: "smile", z: [1.25, 1.35] }) },
  { c: "Ertesi sabah", r: (t, a, b) => ph(t, a, b, pApp("Shorts", "212", "izlenme", "#FFF"), { z: [1.15, 1.3] }) },

  { c: "Bir hafta boyunca", r: (t, a, b) => board(t, a, b, <g>{[212, 305, 198, 276, 240, 310, 187].map((v, i) => { const k = rp(t, a + i * 0.3, a + 0.3 + i * 0.3); return <g key={i} opacity={k} transform={`translate(${300 + i * 220},520)`}><rect x={-90} y={-160} width={180} height={320} rx={18} fill="#1C2A3A" /><rect x={-70} y={-60} width={140} height={40} fill="#FFD27A" opacity={0.5} />{tx(0, 120, String(v), 40, "#FFF", 700, "middle")}</g>; })}</g>) },
  { c: "Sonra bir gece kendi", r: (t, a, b) => desk(t, a, b, S17, { arms: "phone", mouth: "flat", brow: "worry", z: [1.4, 1.55], c0: [960, 430] }) },
  { c: "hepsinin ilk iki saniyesi", r: (t, a, b) => board(t, a, b, <g>{[0, 1, 2, 3].map((i) => <g key={i} transform={`translate(${330 + i * 420},520)`} opacity={rp(t, a + i * 0.25, a + 0.4 + i * 0.25)}><rect x={-160} y={-260} width={320} height={520} rx={22} fill="#1C2A3A" /><rect x={-140} y={-60} width={280} height={80} fill="#1C2A3A" stroke="#FFD27A" strokeWidth={4} />{tx(0, -8, "TANTUNİ", 34, "#FFD27A", 800, "middle")}</g>)}</g>), html: (t, a) => <Big t={t} at={a + 1.2} text="Hepsi aynı tabela" y={880} size={56} /> },
  { c: "Kimse bir tabela", r: (t, a, b) => feed(t, a, b, [items0[0], items0[0], items0[0], items0[0]], swipe(t, a, 4, 0.6), { z: [1.1, 1.2] }), sfx: "whoosh" },

  { c: "İşte Shorts'un ilk", r: (t, a, b) => ph(t, a, b, <ShortsFeed t={t} items={items0} scroll={swipe(t, a, 2, 1.2)} />, { z: [1.05, 1.15] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Kural 1: izleyici kaydırıyor" y={80} size={60} c="#FFC531" /> },
  { c: "İlk iki saniyede", r: (t, a, b) => board(t, a, b, <g>{tx(960, 600, "2 sn", 340, "#FFC531", 800, "middle")}</g>) },

  { c: "Ertesi gün videoyu tersten", r: (t, a, b) => blanket(t, a, b) },
  { c: "İlk karede ustanın", r: (t, a, b) => sacClose(t, a, b, { speed: 1.6 }), sfx: "whoosh" },
  { c: "Altına tek bir yazı", r: (t, a, b) => ph(t, a, b, <ShortsFeed t={t} items={[items0[1]]} />, { z: [1.15, 1.3] }) },
  { c: "O video kırk bin", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Counter t={t} a={a} from={212} to={40000} dur={1} label="izlenme" y={380} c="#FFF" /> },
  { c: "Bir sonraki yüz bin", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Counter t={t} a={a} from={40000} to={100000} dur={0.8} label="izlenme" y={380} c="#FFC531" /> },
  { c: "Ve bir perşembe gecesi", r: (t, a, b) => desk(t, a, b, S17, { arms: "phone", mouth: "smile", eyes: "half", z: [1.3, 1.45], night: true }), tone: "cool" },
  { c: "sabaha üç milyon", r: (t, a, b) => ph(t, a, b, pApp("Shorts", "3.000.000", "izlenme · 1 gecede", H.green), { z: [1.1, 1.4] }), sfx: "boom" },

  { c: "Yorumlar Almanya'dan", r: (t, a, b) => board(t, a, b, <Pins t={t} a={a} pins={[[520, 420, "Almanya"], [1420, 460, "Azerbaycan"], [960, 720, "Mersin köyleri"]]} />, { bg: "#0D1A2A" }) },
  { c: "Bu dükkân nerede?", r: (t, a, b) => board(t, a, b, <g><Comment x={540} y={300} name="Mehmet_DE" text="Bu dükkân nerede? Yazın geleceğim!" k={rp(t, a, a + 0.4)} /><Comment x={540} y={470} name="aysel.baku" text="Bu bıçak nasıl bu kadar hızlı 😳" c="#2BB673" k={rp(t, a + 0.5, a + 0.9)} /><Comment x={540} y={640} name="tarsusluyum" text="Adres lütfen usta" c="#E5322D" k={rp(t, a + 1, a + 1.4)} /></g>) },
  { c: "Abone sayın bir gecede", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Counter t={t} a={a} from={300} to={12300} dur={1.2} label="abone" y={380} c="#FFF" /> },

  { c: "Ve tam o hafta", r: (t, a, b) => board(t, a, b, <g />, { bg: "#140808" }), html: (t, a) => <Big t={t} at={a + 0.2} text="Her şey tersine dönüyor." y={440} size={84} c="#FF6B6B" />, tone: "cool", sfx: "drone" },
  { c: "Sonraki on video", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 10 }, (_, i) => { const v = [8100, 6400, 4200, 3900, 5100, 2800, 7300, 1900, 3300, 2600][i]; const k = rp(t, a + i * 0.15, a + 0.3 + i * 0.15); return <g key={i} opacity={k}><rect x={220 + i * 150} y={880 - v / 20} width={110} height={v / 20} rx={10} fill={H.red} />{tx(275 + i * 150, 860 - v / 20, short(v), 26, "#FFF", 600, "middle")}</g>; })}<line x1={200} x2={1720} y1={380} y2={380} stroke="#FFC531" strokeWidth={4} strokeDasharray="20 12" />{tx(1720, 360, "10 B", 30, "#FFC531", 700, "end")}</g>) },
  { c: "Sen de panik", r: (t, a, b) => desk(t, a, b, S17, { arms: "head", mouth: "open", brow: "worry", eyes: "wide", z: [1.4, 1.5], c0: [960, 430], shake: 0.6 }) },
  { c: "trend müzikler", r: (t, a, b) => feed(t, a, b, [{ bg: "#4B2A6B", label: "♪ trend şarkı", kind: "plain" }, { bg: "#6B8E9B", label: "kedi 😹", kind: "cat" }, { bg: "#556", label: "Sokak röportajı", kind: "street" }], swipe(t, a, 3, 1)) },
  { c: "Kanalın neyle ilgili", r: (t, a, b) => board(t, a, b, <g>{["tantuni", "kedi", "şarkı", "röportaj", "?"].map((s, i) => <g key={i} transform={`translate(${960 + Math.cos(i * 1.26 + t) * 360},${520 + Math.sin(i * 1.26 + t) * 260})`}><circle r={90} fill="#1C2A3A" stroke="#FFF" strokeWidth={3} />{tx(0, 12, s, 34, "#FFF", 700, "middle")}</g>)}</g>) },

  { c: "İkinci kural burada", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.2} text="Kural 2: algoritma izleyiciyi tanıyor" y={420} size={68} c="#FFC531" /> },
  { c: "Seni tantuni için", r: (t, a, b) => ph(t, a, b, <ShortsFeed t={t} items={[{ bg: "#6B8E9B", label: "kedi 😹", kind: "cat" }, items0[1]]} scroll={rp(t, a + 1, a + 1.6)} />, { z: [1.1, 1.2] }), sfx: "whoosh" },
  { c: "Ve algoritma bunu", r: (t, a, b) => board(t, a, b, <g><rect x={560} y={300} width={800} height={460} rx={24} fill="#1A1E27" />{tx(960, 400, "İzleyici geçti", 48, "#FF6B6B", 700, "middle")}{tx(960, 500, "→ daha az gösterim", 44, "#FFF", 600, "middle")}<path d="M760,620 L900,700 L1160,560" stroke={H.red} strokeWidth={14} fill="none" /></g>) },

  { c: "Ustaya geri dönüyorsun", r: (t, a, b) => shop(t, a, b, { sen: S17, senArms: "phone", talk: true, z: [1.05, 1.15] }) },
  { c: "Ustaya bir soru.", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.2} text="Ustaya bir soru" sub="her gün tek soru" y={420} size={96} c="#FFC531" /> },
  { c: "Usta, et neden", r: (t, a, b) => shop(t, a, b, { z: [1.5, 1.7], c0: [960, 470], talk: true, mouth: "smile", chop: false }), html: (t, a) => <Big t={t} at={a + 0.2} text="Et neden sacın kenarında bekliyor?" y={820} size={48} /> },
  { c: "Usta, limonu", r: (t, a, b) => shop(t, a, b, { z: [1.4, 1.55], c0: [800, 520], talk: true, mouth: "grin" }), html: (t, a) => <Big t={t} at={a + 0.2} text="Limonu neden en son sıkıyorsun?" y={820} size={48} /> },
  { c: "Ve bu sefer büyüme", r: (t, a, b) => scr(t, a, b, yt("Abone", <LineChart x={60} y={120} w={880} h={420} pts={[3, 4, 6, 8, 10, 13, 16, 20, 25, 31]} k={rp(t, a, a + 2)} c={H.green} />), { z: [1.2, 1.3] }) },

  // ── YKS
  { c: "Eylül geliyor", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.08]}><rect width={1920} height={1080} fill="#10131A" />{cal(t, a, "EYLÜL", "15", "Okul açılıyor")}</HCam> },
  { c: "Ve evde yeni bir kelime", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 1} text="YKS" y={380} size={220} c="#FF6B6B" /> },
  { c: "Baban akşam yemeğinde", r: (t, a, b) => family(t, a, b, <g><Person x={760} y={1000} s={1} t={t} o={BABA4} arms="cross" mouth="flat" talk brow="angry" /><Person x={1250} y={1000} s={0.95} t={t} o={S17} arms="phone" mouth="tight" dir={-1} /></g>) },
  { c: "Önce sınav.", r: (t, a, b) => family(t, a, b, <Person x={960} y={1000} s={1.15} t={t} o={BABA4} arms="down" mouth="open" talk brow="angry" />, { z: [1.5, 1.6], c0: [960, 430] }), html: (t, a) => <Big t={t} at={a + 0.3} text={'"Bu videolar karın doyurmaz."'} y={830} size={56} /> },
  { c: "Sen de her gece", r: (t, a, b) => blanket(t, a, b), html: (t, a) => <Big t={t} at={a + 0.4} text="02:00" y={80} size={70} c="#9FD4FF" /> },
  { c: "CapCut, yorganın", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#111" /><rect x={20} y={90} width={320} height={400} rx={12} fill="#2A2420" /><g transform="translate(180,330) scale(0.5)"><Sac x={0} y={0} t={t} /></g>{Array.from({ length: 3 }, (_, i) => <rect key={i} x={20} y={530 + i * 50} width={320} height={36} rx={6} fill={["#3EA6FF", "#2BB673", "#C77DFF"][i]} opacity={0.6} />)}<rect x={60 + ((t - 0) * 40) % 260} y={520} width={4} height={170} fill="#FFF" /></g>, { bg: "room", z: [1.15, 1.25] }) },

  { c: "Bir gece telefonun yine", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#111" /><rect x={30} y={280} width={300} height={180} rx={20} fill="#2A2A2E" />{tx(180, 340, "Hafıza dolu", 32, "#FF6B6B", 700, "middle")}{tx(180, 390, "Yer açmak için", 22, "#CCC", 600, "middle")}{tx(180, 420, "dosya silin", 22, "#CCC", 600, "middle")}</g>, { z: [1.15, 1.3] }), sfx: "pop" },
  { c: "Videolara yer açmak", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#0F0F0F" />{Array.from({ length: 12 }, (_, i) => { const del = t > a + 0.6 + i * 0.15; return <g key={i} transform={`translate(${12 + (i % 3) * 116},${100 + Math.floor(i / 3) * 140})`} opacity={del ? 0.15 : 1}><rect width={108} height={130} rx={8} fill={["#B7895E", "#7FA8C0", "#C08560"][i % 3]} /><circle cx={54} cy={50} r={22} fill="#6B4B3A" />{del && <path d="M20,20 L88,110 M88,20 L20,110" stroke={H.red} strokeWidth={6} />}</g>; })}{tx(180, 70, "Galeri · Bayram 2019", 22, "#FFF", 600, "middle")}</g>, { z: [1.1, 1.2] }) },
  { c: "Ertesi gün annen", r: (t, a, b) => family(t, a, b, <g><Person x={760} y={1000} s={1} t={t} o={ANNE} arms="hold" mouth="o" talk brow="worry" /><Person x={1250} y={1000} s={0.95} t={t} o={S17} arms="down" mouth="sad" dir={-1} /></g>), html: (t, a) => <Big t={t} at={a + 0.3} text={'"Dedenin bayram fotoğrafları neredeydi?"'} y={820} size={50} /> },
  { c: "O fotoğraflar senin", r: (t, a, b) => desk(t, a, b, S17, { arms: "down", mouth: "sad", brow: "worry", z: [1.55, 1.7], c0: [960, 430], slump: 0.6 }), tone: "cool" },
  { c: "O gün ilk defa", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.3} text="Bu iş bana ne kazandırıyor?" y={440} size={80} c="#FFC531" /> },

  // ── PARA ŞOKU
  { c: "Cevap birkaç ay sonra", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.08]}><rect width={1920} height={1080} fill="#10131A" />{cal(t, a, "MART", "3 ay", "sonra")}</HCam> },
  { c: "Kanalın şartları dolduruyor", r: (t, a, b) => scr(t, a, b, yt("Kazanma", <g><Progress x={60} y={180} w={880} v={rp(t, a, a + 1.5)} label="Abone: 1.000" c={H.green} right="✓" /><Progress x={60} y={330} w={880} v={rp(t, a + 1, a + 3)} label="Shorts izlenmesi (90 gün): 10 Mn" c={H.green} right="✓" /></g>), { z: [1.2, 1.3] }), html: (t, a) => <Big t={t} at={a + 1.2} text="1.000 abone + 90 günde 10 Mn" y={70} size={52} c="#FFC531" /> },
  { c: "YouTube'un ortaklık", r: (t, a, b) => scr(t, a, b, yt("Kazanma", <g>{tx(500, 300, "Tebrikler!", 70, H.green, 700, "middle")}{tx(500, 380, "İş Ortağı Programı'na kabul edildin", 30, "#FFF", 600, "middle")}</g>), { z: [1.25, 1.35] }), sfx: "pop" },
  { c: "O gece Hasan Usta'ya", r: (t, a, b) => shop(t, a, b, { sen: S19, senArms: "wave", senMouth: "grin", chop: false, mouth: "smile", night: true, z: [1.05, 1.15] }), html: (t, a) => <Big t={t} at={a + 1.5} text={'"Usta, artık para kazanacağız."'} y={90} size={54} /> },
  { c: "Ay sonu geliyor", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.08]}><rect width={1920} height={1080} fill="#10131A" />{cal(t, a, "AY SONU", "30")}</HCam> },
  { c: "O ay videoların", r: (t, a, b) => scr(t, a, b, earn(t, a, "40.000.000", "…"), { z: [1.2, 1.3] }) },
  { c: "Gelir: otuz sekiz", r: (t, a, b) => scr(t, a, b, earn(t, a, "40.000.000", "$38", "#FF6B6B"), { z: [1.5, 1.9], c0: [1150, 420] }), sfx: "boom" },
  { c: "Tekrar bakıyorsun", r: (t, a, b) => desk(t, a, b, S19, { arms: "chin", mouth: "o", eyes: "wide", z: [1.5, 1.65], c0: [960, 430], old: false }) },
  { c: "Otuz sekiz dolar. Kırk", r: (t, a, b) => board(t, a, b, <g>{tx(960, 430, "40.000.000 izlenme", 80, "#FFF", 700, "middle")}{tx(960, 640, "= $38", 180, "#FF6B6B", 800, "middle")}</g>) },

  { c: "Çünkü Shorts parası", r: (t, a, b) => board(t, a, b, <AdPool t={t} a={a} creators={0} />, { bg: "#0D1A2A" }) },
  { c: "Reklamlar senin videonun", r: (t, a, b) => feed(t, a, b, [items0[1], { bg: "#F4F4F4", label: "Reklam", kind: "plain" }, items0[2]], swipe(t, a, 3, 1.2)), html: (t, a) => <Big t={t} at={a + 1.3} text="Reklam = videoların arasında" y={80} size={56} c="#FFC531" /> },
  { c: "O reklamların parası", r: (t, a, b) => board(t, a, b, <AdPool t={t} a={a - 1} creators={1} />, { bg: "#0D1A2A" }) },
  { c: "Bir de çoğu izleyicin", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["Türkiye", 0.12, "$"]} right={["Amerika", 1, "$$$$$$"]} />), html: (t, a) => <Big t={t} at={a + 0.4} text="Reklamverenin ödediği" y={70} size={56} /> },

  { c: "Ve bir de, kimsenin", r: (t, a, b) => desk(t, a, b, S19, { arms: "phone", mouth: "flat", z: [1.3, 1.4], old: false, night: true }), tone: "cool" },
  { c: "Her videona trend", r: (t, a, b) => ph(t, a, b, <ShortsFeed t={t} items={[{ bg: "#2A2420", label: "♪ Trend şarkı · Ustaya bir soru", kind: "sac", views: "3 Mn" }]} />, { z: [1.1, 1.25] }) },
  { c: "YouTube o şarkının", r: (t, a, b) => board(t, a, b, <AdPool t={t} a={a - 1.5} music={rp(t, a + 0.3, a + 1)} />, { bg: "#0D1A2A" }) },
  { c: "Tek bir şarkı kullandığın", r: (t, a, b) => board(t, a, b, <g>{[0, 1].map((i) => { const k = i ? rp(t, a + 0.8, a + 1.6) : 1; return <g key={i} transform={`translate(${660 + i * 600},540)`}><circle r={200} fill="#1A1E27" /><path d={`M0,0 L0,-200 A200,200 0 ${i ? 0 : 1} 1 ${i ? 0 : -1},${i ? 200 : -200}Z`} fill={H.green} opacity={0.9} />{i === 1 && <path d="M0,0 L0,200 A200,200 0 0 1 0,-200Z" fill="#7B2CBF" opacity={k} />}{tx(0, 280, i ? "şarkıyla" : "şarkısız", 44, "#FFF", 700, "middle")}</g>; })}</g>), html: (t, a) => <Big t={t} at={a + 1.6} text="Payın ≈ yarıya iniyor" y={70} size={60} c="#FF6B6B" /> },
  { c: "Yani en çok izlenen", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.3} text="En çok izlenen = en az kazandıran" y={440} size={72} c="#FFC531" /> },

  { c: "Sonra bir gün, istatistiklerinde", r: (t, a, b) => scr(t, a, b, yt("İzlenme", <LineChart x={60} y={120} w={880} h={420} pts={[10, 11, 10, 12, 11, 22, 23, 24, 22, 25]} k={rp(t, a, a + 1.8)} c={H.blue} mark={5} />), { z: [1.2, 1.3] }) },
  { c: "Bir saniye seviniyorsun", r: (t, a, b) => desk(t, a, b, S19, { arms: "wave", mouth: "grin", z: [1.4, 1.5], c0: [960, 430], old: false }) },
  { c: "Ama YouTube sadece saymayı", r: (t, a, b) => ph(t, a, b, <ShortsFeed t={t} items={[items0[2]]} />, { z: [1.1, 1.2] }), html: (t, a) => <Big t={t} at={a + 1} text="Her başlama = 1 izlenme" sub="tekrar oynasa bile" y={80} size={56} c="#FFC531" /> },
  { c: "artık bir Short her", r: (t, a, b) => board(t, a, b, <g>{[0, 1, 2].map((i) => { const k = rp(t, a + i * 0.7, a + 0.3 + i * 0.7); return <g key={i} opacity={k} transform={`translate(${560 + i * 400},520)`}><circle r={120} fill="#1C2A3A" stroke={H.blue} strokeWidth={6} /><path d="M-30,-50 L50,0 L-30,50Z" fill="#FFF" />{tx(0, 200, "+1", 60, "#FFC531", 800, "middle")}</g>; })}</g>) },
  { c: "Parayı belirleyen asıl", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["Ekrandaki izlenme", 1, "×2"]} right={["Parayı belirleyen", 0.45, "aynı"]} />) },
  { c: "Ekrandaki rakam büyüyor", r: (t, a, b) => desk(t, a, b, S19, { arms: "cross", mouth: "tight", z: [1.3, 1.4], old: false, lookY: 0 }), html: (t, a) => <Big t={t} at={a + 0.4} text="Cebindeki değil." y={830} size={64} /> },

  // ── 19: ÇALINAN VİDEO
  { c: "On dokuz yaşına", r: (t, a, b) => front(t, a, b, 4, { z: [1.05, 1.15] }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="19 yaş" place="Mersin · üniversite" /> },
  { c: "Ve bir gün bir arkadaşın", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#0F0F0F" />{tx(180, 70, "Burak", 24, "#FFF", 700, "middle")}<rect x={70} y={120} width={220} height={390} rx={14} fill="#2A2420" /><g transform="translate(180,330) scale(0.4)"><Sac x={0} y={0} t={t} /><Knife x={-40} y={-50} t={t} /></g><rect x={40} y={540} width={280} height={60} rx={30} fill="#2E2E2E" />{tx(180, 580, "Bu senin video değil mi?", 18, "#FFF", 600, "middle")}</g>, { z: [1.1, 1.25] }), sfx: "pop" },
  { c: "Biri senin ustanın", r: (t, a, b) => ph(t, a, b, <g><ShortsFeed t={t} items={[{ bg: "#2A2420", label: "EN HIZLI BIÇAK 🔥", kind: "knife", views: "6 Mn" }]} /><rect x={20} y={110} width={140} height={44} rx={8} fill="#FF2E63" />{tx(90, 140, "@viralTR", 20, "#FFF", 700, "middle")}</g>, { z: [1.1, 1.25] }) },
  { c: "Senin videon orada", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["Senin kanalın", 0.5, "3 Mn"]} right={["Çalan hesap", 1, "6 Mn"]} />) },
  { c: "Ve o hesabın sahibi", r: (t, a, b) => desk(t, a, b, S19, { arms: "head", mouth: "open", brow: "angry", z: [1.45, 1.6], c0: [960, 430], old: false, shake: 0.4 }), html: (t, a) => <Big t={t} at={a + 1.5} text="…sponsor almış." y={830} size={60} c="#FF6B6B" />, tone: "cool" },

  { c: "Sonra o tarihi sabah", r: (t, a, b) => ph(t, a, b, <LockScreen time="08:12" date="Pazar, 9 Kasım"><Notif x={0} y={20} app="YouTube" title="Tebrikler!" body="Kanalın 1 milyar izlenmeyi geçti." /></LockScreen>, { z: [1.2, 1.1] }) },
  { c: "Annen, çay, gelir", r: (t, a, b) => SHOTS[2].r(t, a - 1, b) },
  { c: "Bir buçuk yılın toplamı", r: (t, a, b) => scr(t, a, b, earn(t, a, "1.000.000.000", "$8.400", "#FF6B6B"), { z: [1.3, 1.6], c0: [1150, 420] }) },
  { c: "Aynı dönemde uzun", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["1 milyar Shorts", 0.95, "$8.400"]} right={["2 Mn uzun video", 0.9, "≈ $8.000"]} />) },

  // ── USTANIN SORUSU
  { c: "O akşam dükkânı kapatırken", r: (t, a, b) => shop(t, a, b, { sen: S19, senArms: "down", senMouth: "sad", chop: false, mouth: "flat", night: true, z: [1.05, 1.15] }), tone: "warm" },
  { c: "Bir milyar izlenme, sekiz", r: (t, a, b) => shop(t, a, b, { sen: S19, senArms: "phone", senMouth: "flat", chop: false, mouth: "flat", night: true, z: [1.35, 1.45], c0: [1250, 520] }) },
  { c: "Usta bir süre susuyor", r: (t, a, b) => shop(t, a, b, { chop: false, mouth: "flat", night: true, z: [1.6, 1.75], c0: [960, 450], look: 0.5 }) },
  { c: "Sacı siliyor", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.7, 1.8]} c0={[960, 640]}><rect width={1920} height={1080} fill="#2A2420" /><Sac x={960} y={700} s={2.2} t={t} heat={0.3} meat={0} /><g transform={`translate(${760 + Math.sin(t * 3) * 180},640)`}><ellipse rx={120} ry={40} fill="#E8E2D6" /></g></HCam> },
  { c: "Sonra sana bir soru", r: (t, a, b) => shop(t, a, b, { chop: false, mouth: "flat", night: true, z: [1.7, 1.85], c0: [960, 430], look: 0.6 }), sfx: "drone" },
  { c: "Oğlum, bu videolar", r: (t, a, b) => shop(t, a, b, { chop: false, mouth: "smile", talk: true, night: true, z: [1.8, 1.95], c0: [960, 420], look: 0.6 }), html: (t, a) => <Big t={t} at={a + 0.3} text={'"Bu videolar bana kaç müşteri getirdi?"'} y={830} size={54} c="#FFC531" /> },

  { c: "Sormamışsın", r: (t, a, b) => desk(t, a, b, S19, { bg: "salon", arms: "down", mouth: "o", z: [1.5, 1.6], c0: [960, 430], old: false }) },
  { c: "Usta defterini açıyor", r: (t, a, b) => board(t, a, b, <Defter rows={[["Önce", "150 dürüm"], ["Şimdi", "400 dürüm"]]} k={rp(t, a + 0.5, a + 3)} />, { bg: "#2A2420" }) },
  { c: "Şimdi günde dört yüz", r: (t, a, b) => board(t, a, b, <Defter rows={[["Önce", "150 dürüm"], ["Şimdi", "400 dürüm"]]} hi={1} />, { bg: "#2A2420", z: [1.25, 1.4] }) },
  { c: "Hafta sonu kuyruk", r: (t, a, b) => front(t, a, b, 14, { z: [1, 1.12] }) },
  { c: "Almanya'dan gelen bir aile", r: (t, a, b) => front(t, a, b, 10, { z: [1.3, 1.4], c0: [500, 700] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Almanya'dan sırf bu bıçak için" y={80} size={52} /> },

  { c: "O gece uyuyamıyorsun", r: (t, a, b) => desk(t, a, b, S19, { arms: "chin", mouth: "flat", eyes: "open", z: [1.35, 1.5], night: true, old: false }), tone: "cool" },
  { c: "bir milyar izlenme, YouTube", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["YouTube için", 0.12, "az para"]} right={["Bir esnaf için", 1, "kuyruk"]} />) },

  // ── DÖNÜŞÜM
  { c: "Ertesi hafta çarşıda", r: (t, a, b) => front(t, a, b, 1, { name: "ANTAKYA KÜNEFE", awning: "#2B7A4B", z: [1, 1.1] }) },
  { c: "Size de bunu yapabilirim.", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]}><Tantunici t={t} name="ANTAKYA KÜNEFE" tile="#F6EBDD" menu={["Künefe", "Katmer", "Çay"]} /><Person x={760} y={900} s={1} t={t} o={KUNEFECI} arms="cross" mouth="grin" talk /><Person x={1320} y={900} s={0.95} t={t} o={S19} arms="phone" mouth="smile" dir={-1} /><rect y={860} width={1920} height={220} fill="#8E949B" /></HCam> },
  { c: "Ayda dört video", r: (t, a, b) => board(t, a, b, <g />), html: (t, a) => <Big t={t} at={a + 0.4} text="Ayda 4 video = 1.500 TL" y={420} size={96} c="#FFC531" />, sfx: "pop" },
  { c: "Kabul ediyor", r: (t, a, b) => SHOTS.find((x) => x.c === "Size de bunu yapabilirim.")!.r(t, a - 3, b) },
  { c: "İlk ay künefecinin", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["Önceki cumartesi", 0.5, "×1"]} right={["Videodan sonra", 1, "×2"]} />) },
  { c: "Bir lahmacuncu", r: (t, a, b) => board(t, a, b, cards(t, a, ["Lahmacuncu", "Kahveci", "Kuyumcu"], H.amber)) },
  { c: "Üç ay sonra elinde", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 6 }, (_, i) => { const k = rp(t, a + i * 0.25, a + 0.5 + i * 0.25); return <g key={i} opacity={k} transform={`translate(${360 + (i % 3) * 600},${330 + Math.floor(i / 3) * 360})`}><rect x={-230} y={-130} width={460} height={260} rx={22} fill="#1A1E27" stroke={H.green} strokeWidth={4} />{tx(0, 12, ["Tantuni", "Künefe", "Lahmacun", "Kahve", "Kuyumcu", "Simit"][i], 46, "#FFF", 700, "middle")}</g>; })}</g>), html: (t, a) => <Big t={t} at={a + 1.8} text="6 esnaf" y={470} size={84} c="#FFC531" /> },
  { c: "Ve hiçbirine reklam", r: (t, a, b) => shop(t, a, b, { sen: S19, senArms: "phone", z: [1.1, 1.22], c0: [1100, 540] }) },

  { c: "Sonra markalar yazmaya", r: (t, a, b) => scr(t, a, b, <Mail from="Bıçak markası · iş birliği" subject="Shorts serisi için teklif" lines={["Merhaba, usta videolarınızı çok beğeniyoruz.", "Mutfak bıçaklarımız için 3 video düşünüyoruz.", "Ücretinizi paylaşır mısınız?"]} k={rp(t, a, a + 0.6)} badge="Teklif" />, { z: [1.2, 1.3], old: false }), sfx: "pop" },
  { c: "Artık soruyu sen soruyorsun", r: (t, a, b) => desk(t, a, b, S20, { bg: "studio", arms: "desk", mouth: "smile", z: [1.3, 1.4], old: false, lookY: 0 }), html: (t, a) => <Big t={t} at={a + 0.8} text={'"Benim izleyicim kim?"'} y={80} size={64} c="#FFC531" />, tone: "warm" },
  { c: "Yemeği seven", r: (t, a, b) => board(t, a, b, <Pins t={t} a={a} pins={[[420, 380, "İstanbul"], [820, 520, "Ankara"], [1180, 640, "Mersin"], [1520, 420, "Erzurum"], [620, 760, "İzmir"]]} />, { bg: "#0D1A2A" }) },
  { c: "Ve bu bilgi", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["YouTube'un ödediği", 0.2, "$"]} right={["İzleyicini bilmek", 1, "$$$$"]} />) },

  { c: "Bir de uzun videoya", r: (t, a, b) => over(t, a, b, S20, <g><rect width={1000} height={625} fill="#2A2420" /><g transform="translate(500,380) scale(0.9)"><Sac x={0} y={0} t={t} /></g>{tx(40, 70, "Hasan Usta'nın Bir Günü · 20:14", 34, "#FFF", 700)}</g>, { old: false, bg: "studio" }) },
  { c: "Shorts izleyicisinin çoğu", r: (t, a, b) => board(t, a, b, <g><People100Grid t={t} a={a} /></g>), html: (t, a) => <Big t={t} at={a + 0.6} text="Çoğu uzun videoya gelmiyor" y={80} size={56} /> },
  { c: "Ama gelen az sayıda", r: (t, a, b) => board(t, a, b, <g><People100Grid t={t} a={a - 5} />{tx(960, 980, "Gelenler kalıyor", 50, H.green, 700, "middle")}</g>) },
  { c: "Hasan Usta'nın bir günü", r: (t, a, b) => scr(t, a, b, <g><rect width={1000} height={625} fill="#2A2420" /><g transform="translate(500,360)"><Sac x={0} y={0} t={t} s={0.9} /><Knife x={-40} y={-60} t={t} /></g><rect y={560} width={1000} height={65} fill="#000" opacity={0.6} /><rect y={560} width={1000 * rp(t, a, a + 4)} height={8} fill={YT} />{tx(30, 610, "Hasan Usta'nın Bir Günü", 30, "#FFF", 700)}</g>, { z: [1.3, 1.4], old: false }) },
  { c: "Shorts'larda üç milyon", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["3 Mn Shorts", 0.25, "$"]} right={["100 B uzun video", 1, "$$$"]} />) },

  { c: "Yirmi yaşındasın", r: (t, a, b) => desk(t, a, b, S20, { bg: "studio", arms: "desk", mouth: "smile", z: [1.15, 1.25], old: false, lookY: 0.3 }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="20 yaş" place="Mersin" /> },
  { c: "Ama esnaf işleri", r: (t, a, b) => board(t, a, b, <g>{[["Shorts reklamı", 300, H.blue], ["Esnaf işleri", 1500, H.amber], ["Markalar", 1400, "#C77DFF"], ["Uzun videolar", 900, H.green]].map(([l, v, c], i) => { const k = rp(t, a + i * 0.4, a + 0.6 + i * 0.4); return <g key={i} opacity={k}><rect x={360} y={250 + i * 150} width={(v as number) * 0.7 * k} height={100} rx={14} fill={c as string} />{tx(340, 315 + i * 150, l as string, 40, "#FFF", 700, "end")}{tx(380 + (v as number) * 0.7 * k, 315 + i * 150, `$${fmt(v as number)}`, 40, "#FFF", 700)}</g>; })}</g>), html: (t, a) => <Big t={t} at={a + 2.2} text="Ayda $4.000+" y={900} size={72} c="#FFC531" /> },

  // ── ZİRVE: TEKLİF
  { c: "Ve sonra, o mesaj", r: (t, a, b) => desk(t, a, b, S20, { bg: "studio", arms: "phone", mouth: "flat", z: [1.4, 1.55], c0: [960, 430], old: false, night: true }), sfx: "knock", tone: "cool" },
  { c: "Türkiye'nin en büyük", r: (t, a, b) => scr(t, a, b, <Mail from="Ulusal dürüm zinciri · Pazarlama" subject="6 aylık Shorts serisi" lines={["Kanalınızla 6 aylık bir seri yapmak istiyoruz.", "Teklifimiz ekte.", "Cevabınızı bu gece yarısına kadar bekliyoruz."]} k={rp(t, a, a + 0.6)} badge="Büyük teklif" badgeC={H.amber} />, { z: [1.2, 1.3], old: false }) },
  { c: "Teklif: tek seferde", r: (t, a, b) => board(t, a, b, <TwoBars t={t} a={a} left={["Bir yılda kazandığın", 0.75, "1 yıl"]} right={["Teklif", 1, "tek seferde"]} />) },
  { c: "Ama bir şartları var", r: (t, a, b) => board(t, a, b, <g />, { bg: "#140808" }), html: (t, a) => <Big t={t} at={a + 0.3} text="Bir şart." y={440} size={110} c="#FF6B6B" />, sfx: "drone" },
  { c: "Kanaldaki eski dükkân", r: (t, a, b) => scr(t, a, b, <Mail from="Ulusal dürüm zinciri · Pazarlama" subject="Tek şartımız" lines={["Kanaldaki eski dükkân videolarını", "kaldırmanız gerekiyor.", "Marka imajımızla uyuşmuyor."]} k={1} badge="Şart" badgeC={H.red} />, { z: [1.4, 1.6], old: false, c0: [960, 470] }) },
  { c: "Yani Hasan Usta'nın", r: (t, a, b) => sacClose(t, a, b, { speed: 0.5 }), tone: "cool" },

  { c: "Cevap için gece yarısına", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]}><rect width={1920} height={1080} fill="#0B0F18" /><Clock x={960} y={520} s={2} h={23} m={30 + (t - a) * 2} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.6} text="23:30" y={70} size={70} c="#FF6B6B" /> },
  { c: "Masanda o eski telefon", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.55]} c0={[960, 600]}><rect width={1920} height={1080} fill="#1A1410" /><rect y={640} width={1920} height={440} fill={H.wood2} /><ellipse cx={960} cy={560} rx={700} ry={400} fill="url(#hLamp)" /><Phone x={960} y={640} s={0.9} rot={-78}><g><rect width={360} height={740} fill="#111" /><path d="M300,0 L250,120 L330,200 L280,320" stroke="#FFF" strokeWidth={3} fill="none" opacity={0.7} /></g></Phone></HCam> },
  { c: "İlk videoyu açıyorsun", r: (t, a, b) => ph(t, a, b, <ShortsFeed t={t} items={[items0[0]]} />, { z: [1.15, 1.35] }), html: (t, a) => <Big t={t} at={a + 0.6} text="212 izlenme" y={80} size={60} />, tone: "warm" },
  { c: "Ustanın bıçağı, sacın", r: (t, a, b) => sacClose(t, a, b, { speed: 1 }) },
  { c: "Saat on bir elli sekizde", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.3]}><rect width={1920} height={1080} fill="#0B0F18" /><Clock x={960} y={520} s={2} h={23} m={58} /></HCam>, html: (t, a) => <Big t={t} at={a + 0.3} text="23:58" y={70} size={70} c="#FF6B6B" />, sfx: "knock" },
  { c: "Teşekkür ederim.", r: (t, a, b) => scr(t, a, b, <Mail from="Sen → Dürüm zinciri" subject="Cevap" lines={["Teşekkür ederim.", "Ama kanal o dükkânla başladı.", "O videolar kalacak."]} k={rp(t, a, a + 2.5)} badge="Gönderildi" />, { z: [1.25, 1.4], old: false }) },

  { c: "Ertesi sabah dükkâna", r: (t, a, b) => front(t, a, b, 3, { z: [1, 1.1] }), tone: "warm" },
  { c: "Hasan Usta'nın hiçbir", r: (t, a, b) => shop(t, a, b, { sen: S20, senArms: "hold", senMouth: "smile", chop: false, mouth: "smile", talk: true, z: [1.1, 1.2] }) },
  { c: "Bugün kuyruk erken", r: (t, a, b) => shop(t, a, b, { queue: 9, z: [1.35, 1.5], c0: [1300, 420], talk: true }), html: (t, a) => <Big t={t} at={a + 0.3} text={'"Bugün kuyruk erken başladı."'} y={830} size={54} /> },
  { c: "Ve o hafta, o zincirin", r: (t, a, b) => scr(t, a, b, <Mail from="Rakip zincir · İş birliği" subject="Seri teklifi" lines={["Usta videolarınız harika.", "Hiçbir şart yok.", "Ne zaman konuşabiliriz?"]} k={rp(t, a, a + 0.6)} badge="Şartsız" />, { z: [1.2, 1.3], old: false }), html: (t, a) => <Big t={t} at={a + 2.2} text="Şartsız." y={830} size={70} c={H.green} />, sfx: "pop" },

  // ── HÜKÜM
  { c: "Peki... gerçekten değer mi", r: (t, a, b) => desk(t, a, b, S20, { bg: "studio", arms: "desk", mouth: "flat", z: [1.3, 1.4], old: false, lookY: 0 }), html: (t, a) => <Big t={t} at={a + 0.5} text="Gerçekten değer mi?" y={70} size={72} c="#FFC531" /> },
  { c: "Eğer sadece Shorts reklam", r: (t, a, b) => board(t, a, b, <g>{tx(960, 560, "Sadece reklam parası için: değmez", 66, "#FF6B6B", 700, "middle")}</g>) },
  { c: "Bir milyar izlenme, bir buçuk", r: (t, a, b) => board(t, a, b, cards(t, a, ["1 milyar\nizlenme", "1,5 yıl", "< 1 maaş"], H.red)) },
  { c: "Hele izleyicin Türkiye'deyse", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["İzleyici\nTürkiye'de", "Her videoda\npopüler şarkı"], H.red, 520, 640, 560)) },
  { c: "Ama Shorts'u bir maaş", r: (t, a, b) => front(t, a, b, 12, { z: [1.05, 1.15] }), html: (t, a) => <Big t={t} at={a + 1} text="Shorts = vitrin" y={80} size={84} c="#FFC531" /> },
  { c: "Asıl para videonun altında", r: (t, a, b) => board(t, a, b, cards(t, a + 0.6, ["Esnafın\nkuyruğu", "Markanın\nteklifi", "Uzun video\nizleyicisi"], H.green)) },
  { c: "Bir esnafın kuyruğunda", r: (t, a, b) => front(t, a, b, 12, { z: [1.2, 1.3], c0: [600, 640] }) },
  { c: "Başlamak için neredeyse", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Telefon", "CapCut", "Her gün\ntek fikir"], H.blue)) },
  { c: "Ama zamanın çoğunu", r: (t, a, b) => blanket(t, a, b) },
  { c: "Ve en zor kısmı", r: (t, a, b) => SHOTS.find((x) => x.c === "Sonraki on video")!.r(t, a - 3, b), html: (t, a) => <Big t={t} at={a + 0.6} text="Pes etmemek" y={80} size={70} c="#FFC531" /> },
  { c: "Kimler için? Etrafında", r: (t, a, b) => shop(t, a, b, { z: [1.2, 1.3], talk: true, mouth: "smile" }), html: (t, a) => <Big t={t} at={a + 0.4} text="Kimler için?" sub="bir usta, bir dükkân, bir zanaat" y={70} size={70} c="#FFC531" /> },
  { c: "Bir usta, bir dükkân", r: (t, a, b) => sacClose(t, a, b, { speed: 0.8 }) },
  { c: "Kimler için değil", r: (t, a, b) => ph(t, a, b, <ShortsFeed t={t} items={[{ bg: "#111", label: "1 gecede zengin ol $$$", kind: "plain", views: "?" }]} />, { z: [1.05, 1.15] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Kimler için değil?" y={80} size={64} c="#FF6B6B" /> },
  { c: "Zorluk: ondan yedi", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.05]}><rect width={1920} height={1080} fill="#0E1016" /></HCam>, html: (t, a) => <Verdict t={t} a={a} rows={[["Zorluk", 7], ["Sermaye", 1], ["Sabır", 8]]} title="Türkiye'de Shorts üreticisi olmak" /> },
  { c: "Şimdi sıra sende", r: (t, a, b) => { const msg = "Ben ... işine başlamak istiyorum"; const n = Math.floor(rp(t, a + 2.5, a + 5) * msg.length); return board(t, a, b, <g transform="translate(960,460)"><rect x={-680} y={-170} width={1360} height={340} rx={30} fill="#1A1E27" /><circle cx={-560} cy={-60} r={50} fill={H.blue} />{tx(-480, -50, "Yorum ekle…", 44, "#AAA", 600)}{tx(-480, 60, msg.slice(0, n), 48, "#FFF", 600)}</g>); } },
  { c: "Sıradaki işleri", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["Senin\nyorumun", "Sıradaki\niş", "Bütün\nyolu"], H.blue)), html: (t, a) => <SubBtn t={t} at={a + 2} /> },
];

function People100Grid({ t, a }: { t: number; a: number }) {
  return <g>{Array.from({ length: 60 }, (_, i) => { const stay = i % 10 === 0; const k = rp(t, a + i * 0.02, a + 0.3 + i * 0.02); const gone = !stay && t > a + 2.5 ? rp(t, a + 2.5, a + 3.2) : 0; return <g key={i} opacity={k * (1 - gone * 0.8)} transform={`translate(${260 + (i % 15) * 100},${300 + Math.floor(i / 15) * 130})`}><circle r={18} fill={stay ? H.green : H.blue} /><path d="M-26,60 Q-26,22 0,20 Q26,22 26,60Z" fill={stay ? H.green : H.blue} /></g>; })}</g>;
}

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K6_04_SECONDS));
  return raw;
})();

export const K6Video04: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const fadeIn = rp(t, 0, 0.4);
  const cutFlash = 1 - rp(t, s.from, s.from + 0.12);
  const fadeOut = 1 - rp(t, K6_04_SECONDS - 1.5, K6_04_SECONDS);
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
      <Audio src={staticFile("audio/k6-04.wav")} />
      {TIMED.map((x, i) => i > 0 && x.to < K6_04_SECONDS - 15 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.sfx === "knock" ? 0.08 : x.sfx === "boom" || x.sfx === "drone" ? 0.12 : x.sfx ? 0.15 : 0.07} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
