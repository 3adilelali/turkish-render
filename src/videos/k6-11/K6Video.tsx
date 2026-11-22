import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k6-11-words.json";
import { makeCue } from "../../lib/cues";
import { Atmos, Sweep, Tone } from "../../components/Live";
import { ANNE, AgeTag, BABA, BackView, Big, Counter, H, HArms, HBrow, HCam, HFrame, HMouth, Laptop, LineChart, Look, Mail, Mic, Notif, LockScreen, Person, Phone, Studio, SubBtn, Verdict, cl, lp, rp } from "../../components/Hayat";
import { Defter } from "../../components/HayatCarsi";
import { EvGebze, Hangar } from "../../components/HayatFabrika";
import {
  Abonelik, Arama, ClaudeEkran, ClaudeMark, CL_BG, CL_OR, DerinkuyuKesit, Fatura, HaritaVideo, KAAN, KanalIzgara, KanalPanel, KapiAralik, KurguOda, KurguProg,
  OtobusYol, SEN26K, SEN26K_EV, ShortDerin, Stopaj, TaktikTahta, WaSohbet, YORUMCU, YorumEkran, Yeralti,
} from "../../components/HayatClaude";

// Kanal 4 · k6-11 · "Claude'la YouTube Otomasyonu Kursan, Ay Sonunda Cebinde Ne Kalır?"
// Ses: Gemini TTS (Achird, gemini-3.8-flash-tts, stil yok), 7 parça, K4 anahtarı; kelime zamanları align_parts.

const W = words as { text: string; start: number; end: number }[];
const cue = makeCue(W);
const VOICE_END = W[W.length - 1].end;
export const K6_11_SECONDS = Math.ceil(VOICE_END + 4);
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
const C2: [number, number] = [960, 560];

const PROG = (t: number) => <KurguProg t={t} />;
const ME = (p: Partial<PP> = {}): PP => ({ o: SEN26K_EV, x: 960, y: 1180, s: 1.0, arms: "type", look: 0, lookY: 0.2, ...p });
// oda: kurgucu odası. back = arkadan çalışan sen
const oda = (t: number, a: number, b: number, p: Z & { L?: React.ReactNode; Rs?: React.ReactNode; who?: PP[]; back?: boolean; fans?: number; lamp?: number; off?: boolean; night?: boolean; extra?: React.ReactNode } = {}) =>
  cam(t, a, b, <KurguOda t={t} night={p.night ?? true} screenL={p.L ?? PROG(t)} screenR={p.Rs} fans={p.fans} lamp={p.lamp} off={p.off}
    people={<>{p.back && <BackView x={1060} y={1110} s={1.05} t={t} o={SEN26K_EV} type />}{!p.back && ppl(t, p.who ?? [ME()])}{p.extra}</>} />, { ...p, c0: p.c0 ?? [1000, 560] }, [1.04, 1.12]);
const ODABG = (t: number, off = false) => <KurguOda t={t} off={off} screenL={PROG(t)} />;
const ev = (t: number, a: number, b: number, people: PP[], p: Z & { morning?: boolean } = {}) =>
  cam(t, a, b, <EvGebze t={t} heater={false} morning={p.morning} people={ppl(t, people)} />, { ...p, c0: p.c0 ?? C2 }, [1.06, 1.14]);
const stu = (t: number, a: number, b: number, people: PP[], p: Z = {}) =>
  cam(t, a, b, <g><Studio t={t} />{ppl(t, people)}</g>, { ...p, c0: p.c0 ?? C2 }, [1.06, 1.14]);
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
// monitör yakın plan: oda bulanık arkada, ekran önde
const mon = (t: number, a: number, b: number, screen: React.ReactNode, p: Z & { off?: boolean } = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.07]} c0={p.c0} c1={p.c1}>
    <g style={{ filter: "blur(10px)" }}>{ODABG(t, p.off)}</g>
    <rect width={1920} height={1080} fill="#000" opacity={0.4} />
    <Laptop x={960} y={520} s={1.3} t={t}>{screen}</Laptop>
  </HCam>
);
const cards = (t: number, a: number, items: string[], c = H.red, y = 520, gap = 560, w = 500) => (
  <g>{items.map((s, i) => { const k = rp(t, a + i * 0.6, a + i * 0.6 + 0.4); const x = 960 + (i - (items.length - 1) / 2) * gap; return <g key={i} transform={`translate(${x},${y + (1 - k) * 60})`} opacity={k}><rect x={-w / 2} y={-150} width={w} height={300} rx={26} fill="#1A1E27" stroke={c} strokeWidth={4} /><circle cx={0} cy={-80} r={40} fill={c} />{tx(0, -66, String(i + 1), 44, "#FFF", 700, "middle")}{s.split("\n").map((l, j) => <g key={j}>{tx(0, 30 + j * 52, l, 40, "#FFF", 700, "middle")}</g>)}</g>; })}</g>
);
const cal = (t: number, a: number, top: string, big: string, sub?: string) => {
  const k = rp(t, a, a + 0.5);
  return (
    <g transform={`translate(960,${520 + (1 - k) * 40})`} opacity={k}>
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
const sum = (t: number, a: number, lines: [string, string][], last = YEL) => (
  <g>{lines.map(([l, r], i) => { const k = rp(t, a + i * 1.0, a + i * 1.0 + 0.4); return <g key={i} opacity={k} transform={`translate(0,${(1 - k) * 30})`}>{tx(380, 380 + i * 170, l, 70, "#E8E8E8", 600)}{tx(1540, 380 + i * 170, r, 84, i === lines.length - 1 ? last : "#FFF", 700, "end")}</g>; })}</g>
);
const comment = (t: number, a: number) => { const msg = "Ben yapay zekayla … denerdim"; const n = Math.floor(rp(t, a + 0.8, a + 3) * msg.length); return <g transform="translate(960,460)"><rect x={-680} y={-170} width={1360} height={340} rx={30} fill="#1A1E27" /><circle cx={-560} cy={-60} r={50} fill={YEL} />{tx(-480, -50, "Yorum ekle…", 44, "#AAA", 600)}{tx(-480, 60, msg.slice(0, n), 48, "#FFF", 600)}</g>; };
const KAAN_MSG = (n: number, t: number) => <WaSohbet name="Kaan" t={t} k={n} msgs={[{ text: "Kardeşim, bundan sonra kurguyu Claude'a yaptırıyorum. Kusura bakma." }, { text: "Kırk dakikada yaptı.", video: true }]} />;
const lock = (t: number, k: number) => <LockScreen time="02:47" date="Salı, 18 Ağustos"><Notif x={0} y={0} app="WhatsApp" title="Kaan" body="Kardeşim, bundan sonra kurguyu…" k={k} icon="#25D366" /></LockScreen>;
const grid30 = (t: number, k = 1) => (
  <g>{Array.from({ length: 30 }, (_, i) => { const kk = cl(k * 30 - i); return <g key={i} opacity={kk} transform={`translate(${190 + (i % 6) * 260},${130 + Math.floor(i / 6) * 170})`}><svg x={0} y={0} width={240} height={150} viewBox="0 0 1000 625"><HaritaVideo t={t + i} title={["DERİNKUYU", "GÖBEKLİTEPE", "SÜMELA", "ANİ", "EFES"][i % 5]} same /></svg></g>; })}</g>
);
const brush = (t: number, a: number) => { const k = rp(t, a + 0.3, a + 2.2); return <g><rect x={460} y={260} width={1000} height={560} fill="#FBF6E6" stroke="#6E4528" strokeWidth={16} /><path d={`M560,700 Q760,${700 - 300 * k} 960,640 T1360,${520 - 100 * k}`} stroke="#2E86C1" strokeWidth={34} strokeLinecap="round" fill="none" opacity={k} /><g transform={`translate(${lp(560, 1360, k)},${lp(700, 470, k)}) rotate(-30)`}><rect x={-12} y={-200} width={24} height={170} rx={8} fill="#8A5A36" /><rect x={-16} y={-40} width={32} height={30} fill="#BBB" /><path d="M-16,-10 Q0,40 16,-10Z" fill="#2E86C1" /></g></g>; };
const post = (t: number) => (
  <g><rect width={360} height={740} fill="#F4F2EE" /><rect width={360} height={70} fill="#FFF" /><circle cx={40} cy={36} r={20} fill="#2F4F46" />{tx(70, 42, "Keçiören kurgu", 17, "#111", 700)}
    <rect x={14} y={90} width={332} height={250} rx={10} fill="#C9A47A" /><svg x={14} y={90} width={332} height={250} viewBox="0 0 1920 1080"><DerinkuyuKesit t={t} label20={1} label8={1} /></svg>
    {["Makine 20 kat yazdı. Bir yorum", "8 kat dedi. Ve bir e-posta geldi.", "", "Claude'la hızlı, insan gözüyle", "doğru kurgu. Video başı 1.800 ₺."].map((l, i) => <g key={i}>{tx(18, 380 + i * 30, l, 16, i > 2 ? "#0A66C2" : "#222", i > 2 ? 700 : 500)}</g>)}
    {tx(18, 560, "♥ 1.240   💬 186   ↗ 92", 16, "#666", 600)}</g>
);

const GELIR: [string, string][] = [["Kaan · 8 video × 3.000", "24.000"], ["3 kanal · 14 × 1.800", "25.200"], ["Kayıp Harita (YouTube)", "0"], ["Toplam gelir", "49.200"]];
const GIDER: [string, string][] = [["Claude", "−7.000"], ["Bağ-Kur", "−11.800"], ["Muhasebeci", "−3.600"], ["Elektrik farkı", "−900"], ["Toplam gider", "−23.300"]];

export const SHOTS: Sh[] = [
  // 0:00 · kanca
  { c: "Gece ikiyi", tone: "night", r: (t, a, b) => oda(t, a, b, { back: true, lamp: 0.2 }), html: (t, a) => <Big t={t} at={a + 0.3} text="02:47" y={80} size={96} /> },
  { c: "Ankara", tone: "night", r: (t, a, b) => oda(t, a, b, { back: true, lamp: 0.2, z: [1.5, 1.6], c0: [1620, 280] }), html: (t, a) => <AgeTag t={t} at={a + 0.2} age="Ankara" place="Keçiören" /> },
  { c: "Ekranında bir kurgu", tone: "night", r: (t, a, b) => mon(t, a, b, <KurguProg t={t} />) },
  { c: ["On dört saattir", "14 saattir"], tone: "night", r: (t, a, b) => mon(t, a, b, <KurguProg t={t} hours={`${String(13 + Math.floor(rp(t, a, b) * 1.2)).padStart(2, "0")}:${String(Math.floor((t * 7) % 60)).padStart(2, "0")}`} />, { z: [1.1, 1.25], c0: [1240, 280] }), html: (t, a) => <Big t={t} at={a + 0.3} text="14 saat" y={860} size={90} c={YEL} /> },
  { c: "Dosyanın adı", tone: "night", r: (t, a, b) => mon(t, a, b, <KurguProg t={t} />, { z: [1.7, 1.85], c0: [960, 150] }), html: (t, a) => <Big t={t} at={a + 0.8} text="final · son · v3" y={860} size={70} c={YEL} /> },
  { c: "Telefon titriyor", tone: "night", r: (t, a, b) => ph(t, a, b, lock(t, rp(t, a + 0.3, a + 0.8)), ODABG(t), { rot: Math.sin(t * 40) * 1.5 }), sfx: "buzz" },
  { c: "Üç yıldır videolarını", r: (t, a, b) => stu(t, a, b, [{ o: KAAN, x: 960, s: 1.0, talk: true, mouth: "smile", arms: "wave", look: 0 }]), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="Kaan" place="YouTuber · 3 yıldır senin müşterin" /> },
  { c: "Mesaj tek satır", tone: "night", r: (t, a, b) => ph(t, a, b, KAAN_MSG(0.5, t), ODABG(t)) },
  { c: "Kardeşim, bundan sonra", tone: "night", r: (t, a, b) => ph(t, a, b, KAAN_MSG(0.5, t), ODABG(t), { z: [1.45, 1.6], c0: [960, 380] }), html: (t, a) => Q(t, a + 0.3, "Bundan sonra kurguyu Claude'a yaptırıyorum.", 860, YEL, 52) },
  { c: "Altında bir video", tone: "night", r: (t, a, b) => ph(t, a, b, KAAN_MSG(1, t), ODABG(t), { z: [1.2, 1.35], c0: [960, 560] }) },
  { c: "Senin on dört saatte", tone: "night", r: (t, a, b) => mon(t, a, b, <ClaudeEkran t={t} a={a - 9} q="Kaan bölüm 212'yi kurgula" lines={["✓ altyazılar", "✓ geçişler", "✓ haritalar", "✓ ekrana uçan sayılar"]} prog={rp(t, a, b)} label="Kurgu" />) },
  { c: "Altyazılar, geçişler", tone: "night", r: (t, a, b) => board(t, a, b, <svg x={260} y={150} width={1400} height={780} viewBox="0 0 1000 557"><HaritaVideo t={t} title="KAAN · 212" sub={`${Math.round(lp(0, 214, rp(t, a, b)))}.000 izlenme`} /></svg>, { bg: "#0E1016", z: [1.0, 1.1] }), sfx: "whoosh" },
  { c: "Ve Kaan'ın notu", tone: "night", r: (t, a, b) => ph(t, a, b, KAAN_MSG(1, t), ODABG(t), { z: [1.5, 1.65], c0: [960, 690] }), html: (t, a) => Q(t, a + 0.4, "Kırk dakikada yaptı.", 860, RED, 66) },
  { c: ["On dört saat. Kırk", "14 saat. 40"], tone: "night", r: (t, a, b) => board(t, a, b, sum(t, a + 0.1, [["Sen", "14 saat"], ["Claude", "40 dakika"]], RED), { bg: "#141A24" }), sfx: "boom" },
  { c: "Evet, yanlış duymadın", tone: "night", r: (t, a, b) => oda(t, a, b, { who: [ME({ arms: "down", eyes: "wide", mouth: "o", brow: "up", lookY: -0.1 })], z: [1.4, 1.5], c0: [960, 560], lamp: 0.2 }) },
  { c: "Seni bir yapay zeka", tone: "night", r: (t, a, b) => board(t, a, b, <ClaudeMark x={960} y={500} s={6} spin={t * 8} />, { bg: CL_BG, z: [1.0, 1.15] }), html: (t, a) => <Big t={t} at={a + 0.6} text="İşten çıkarıldın." y={860} size={84} c={RED} /> },
  { c: "Hem de gece", tone: "night", r: (t, a, b) => oda(t, a, b, { back: true, lamp: 0, z: [1.1, 1.0] }), html: (t, a) => <Big t={t} at={a + 0.4} text="02:47" y={80} size={110} c={RED} /> },
  { c: "Ama bu bir yas", tone: "night", r: (t, a, b) => oda(t, a, b, { who: [ME({ arms: "down", mouth: "tight", brow: "flat", look: 0.1 })], z: [1.3, 1.4], c0: [960, 560], lamp: 0.3 }) },
  { c: "Çünkü bu gece", tone: "night", r: (t, a, b) => mon(t, a, b, <ClaudeEkran t={t} a={a + 0.4} q="Bana kendi kendine video üreten bir kanal kur" />) },
  { c: ["Claude'la, yüzünü", "Claude'la yüzünü"], tone: "night", r: (t, a, b) => oda(t, a, b, { back: true, L: <ClaudeEkran t={t} a={a - 4} q="Bana kendi kendine video üreten bir kanal kur" lines={["✓ metin", "✓ ses", "✓ harita", "✓ kurgu"]} />, Rs: <HaritaVideo t={t} />, lamp: 0.3 }) },
  { c: "Bir ay içinde", r: (t, a, b) => board(t, a, b, <g />, { bg: "#0E1A12" }), html: (t, a) => <Counter t={t} a={a + 0.2} from={0} to={1200000} label="izlenme" y={330} c={GRN} />, sfx: "tick" },
  { c: ["Ve kırk birinci", "Ve 41."], tone: "cool", r: (t, a, b) => board(t, a, b, cal(t, a, "GÜN", "41")), sfx: "tick" },
  { c: "O e-postayı alanların", tone: "cool", r: (t, a, b) => mon(t, a, b, <g><Mail from="YouTube" subject="Kanalınız hakkında" lines={["████████ ███ ██████", "████ █████████ ███"]} k={1} /><rect width={1000} height={625} fill="#000" opacity={0.35} /></g>, { z: [1.1, 1.2] }), sfx: "drone" },
  { c: "Sen bırakacak mısın", tone: "cool", r: (t, a, b) => oda(t, a, b, { who: [ME({ arms: "chin", mouth: "flat", eyes: "half", lookY: 0.2 })], z: [1.35, 1.45], c0: [960, 540], lamp: 0.2 }), html: (t, a) => <Big t={t} at={a + 0.4} text="Bırakacak mısın?" y={80} size={72} c={YEL} /> },
  // söz
  { c: "Ama önce sana", r: (t, a, b) => board(t, a, b, LED([["Claude", "?"], ["YouTube", "?"]], 0, -1, "3. ayın defteri"), { bg: "#2A241D" }) },
  { c: ["Claude'a ödediğin", "Claudea ödediğin"], r: (t, a, b) => board(t, a, b, LED([["Claude", "?"], ["YouTube", "?"]], rp(t, a, a + 2.5) * 2, -1, "3. ayın defteri"), { bg: "#2A241D", z: [1.05, 1.15] }) },
  { c: "Ve asgari ücretle", r: (t, a, b) => board(t, a, b, sum(t, a + 0.3, [["Asgari ücret", "28.075 ₺"], ["Claude + YouTube", "?"]]), { bg: "#141A24" }) },
  { c: "Bakalım Claude'la", r: (t, a, b) => oda(t, a, b, { back: true, L: <ClaudeEkran t={t} a={a - 10} q="YouTube otomasyonu" lines={["✓ hazır"]} />, Rs: <KanalPanel t={t} views={[7, 31, 12]} subs={0} />, z: [1.0, 1.08] }), html: (t, a) => <Big t={t} at={a + 0.5} text="Claude'la YouTube otomasyonu…" sub="ay sonunda cebinde ne kalır?" y={80} size={64} c={YEL} /> },
  // 1:20 · sen
  { c: ["Yirmi altı yaşındasın", "26 yaşındasın"], r: (t, a, b) => oda(t, a, b, { night: false, who: [ME({ arms: "down", mouth: "smile", look: -0.2, lookY: 0 })], lamp: 0 }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="26 yaşında" place="Serbest kurgucu · 3 yıl" /> },
  { c: "Annenle babanın", r: (t, a, b) => ev(t, a, b, [{ o: ANNE, x: 520, s: 0.95, look: 0.4, talk: true }, { o: BABA, x: 980, s: 0.95, look: 0.3, arms: "cross" }, { o: SEN26K_EV, x: 1420, s: 0.95, look: -0.4 }], { morning: true }) },
  { c: "Parça parça", r: (t, a, b) => cam(t, a, b, <KurguOda t={t} night={false} screenL={PROG(t)} fans={0.3} />, { z: [2.0, 2.2], c0: [1730, 560] }), html: (t, a) => <Big t={t} at={a + 0.6} text="2 yıldır taksit" y={80} size={70} c={YEL} /> },
  { c: "Kaan sana video", r: (t, a, b) => stu(t, a, b, [{ o: KAAN, x: 960, s: 1.0, talk: true, mouth: "smile" }], { z: [1.1, 1.18] }), html: (t, a) => <Big t={t} at={a + 0.5} text="2.500 ₺ / video" y={80} size={86} c={GRN} /> },
  { c: "Haftada iki video", r: (t, a, b) => board(t, a, b, sum(t, a + 0.2, [["Haftada", "2 video"], ["Ayda", "20.000 ₺"]], GRN), { bg: "#0E1A12" }) },
  { c: "Zengin değildin", r: (t, a, b) => oda(t, a, b, { night: false, who: [ME({ arms: "type", mouth: "smile", lookY: 0.3 })], lamp: 0, z: [1.1, 1.2] }) },
  { c: "O gece uyumuyorsun", tone: "night", r: (t, a, b) => oda(t, a, b, { back: true, lamp: 0.2 }) },
  { c: "Kaan'ın gönderdiği", tone: "night", r: (t, a, b) => mon(t, a, b, <KurguProg t={t} file="kaan_claude_40dk.mp4" preview={<HaritaVideo t={t} title="KAAN · 212" />} />) },
  { c: "Bu sefer kurgucu", tone: "night", r: (t, a, b) => mon(t, a, b, <KurguProg t={t} file="kaan_claude_40dk.mp4" preview={<HaritaVideo t={t} title="KAAN · 212" />} />, { z: [1.4, 1.6], c0: [960, 760] }) },
  { c: "Geçişler temiz", tone: "night", r: (t, a, b) => board(t, a, b, cards(t, a + 0.3, ["Geçişler:\nhep aynı", "Sayılar:\nhep aynı yerden"], H.amber)) },
  { c: "Video güzel", tone: "night", r: (t, a, b) => board(t, a, b, <svg x={460} y={220} width={1000} height={640} viewBox="0 0 1000 625"><HaritaVideo t={t} title="KAAN · 212" /></svg>, { bg: "#0E1016", z: [1.0, 1.12] }), html: (t, a) => <Big t={t} at={a + 0.8} text="Ama ruhu yok." y={900} size={80} c={RED} /> },
  { c: "Ve kendine soruyorsun", tone: "night", r: (t, a, b) => oda(t, a, b, { who: [ME({ arms: "chin", look: 0.3, lookY: -0.2, brow: "up" })], z: [1.35, 1.45], c0: [960, 520], lamp: 0.3 }) },
  { c: "Bunu kırk dakikada", tone: "night", r: (t, a, b) => board(t, a, b, <g><ClaudeMark x={700} y={520} s={3} spin={t * 10} />{tx(960, 560, "+", 140, "#FFF", 800, "middle")}{tx(1260, 570, "kurgucu", 90, YEL, 800, "middle")}</g>, { bg: "#141A24" }), html: (t, a) => <Big t={t} at={a + 1.5} text="= ?" y={860} size={100} c={YEL} /> },
  // 2:30 · abone oluyorsun
  { c: ["Sabah yedide", "Sabah 7'de"], tone: "warm", r: (t, a, b) => ph(t, a, b, <Abonelik plan="Pro" price="999,99 ₺" k={rp(t, a, a + 0.8)} />, <EvGebze t={t} morning heater={false} />, { light: true }), sfx: "ding" },
  { c: "Annen kahvaltıda", tone: "warm", r: (t, a, b) => ev(t, a, b, [{ o: ANNE, x: 760, s: 1.0, talk: true, brow: "worry", look: 0.4 }, { o: SEN26K_EV, x: 1300, s: 0.95, look: -0.4, eyes: "half" }], { morning: true }), html: (t, a) => Q(t, a + 0.5, "Gece yine uyumadın mı?") },
  { c: "Uyumadın", tone: "warm", r: (t, a, b) => ev(t, a, b, [{ o: SEN26K_EV, x: 960, s: 1.15, mouth: "smile", look: 0, brow: "up" }], { morning: true, z: [1.3, 1.4], c0: [960, 480] }) },
  { c: "Claude'un kod yazan", r: (t, a, b) => mon(t, a, b, <ClaudeEkran t={t} a={a + 0.2} q="Türkçe yaz, ben videoyu kodla çizeyim" lines={["const sahne = harita('Türkiye')", "sahne.yazı('KAYIP HARİTA')", "sayaç(0, 1963)", "kamera.yaklaş(1.2)", "✓ 60 sn video çizildi"]} speed={40} />) },
  { c: "Senin aylarca", r: (t, a, b) => board(t, a, b, sum(t, a + 0.3, [["Fareyle tek tek", "aylar"], ["Kodla", "1 saniye"]]), { bg: "#141A24" }) },
  { c: "İlk denemen", r: (t, a, b) => mon(t, a, b, <ClaudeEkran t={t} a={a + 0.3} q="Türkiye'nin gizemli yerleri hakkında 60 saniyelik video yap" speed={34} />) },
  { c: "Claude yazıyor", r: (t, a, b) => mon(t, a, b, <ClaudeEkran t={t} a={a - 3} q="Türkiye'nin gizemli yerleri hakkında 60 saniyelik video yap" lines={["metin yazılıyor…", "ses okunuyor…", "harita çiziliyor…"]} prog={rp(t, a, b)} speed={60} />, { z: [1.05, 1.15] }) },
  { c: "Başlıkta kanalın", r: (t, a, b) => mon(t, a, b, <HaritaVideo t={t} broken />), sfx: "ding" },
  { c: ["Ama ekranda", "Ama ekranda Kay"], r: (t, a, b) => mon(t, a, b, <HaritaVideo t={t} broken />, { z: [1.9, 2.1], c0: [960, 190] }), sfx: "buzz" },
  { c: "Noktasız ı yok", r: (t, a, b) => board(t, a, b, <g>{["ı", "ş", "ğ", "İ"].map((c, i) => <g key={i} transform={`translate(${480 + i * 320},540)`}><rect x={-120} y={-150} width={240} height={300} rx={20} fill="#1A1E27" stroke="#444" strokeWidth={3} />{rp(t, a + 0.4 + i * 0.4, a + 0.6 + i * 0.4) > 0.5 ? <rect x={-50} y={-90} width={100} height={150} fill="none" stroke={RED} strokeWidth={10} /> : tx(0, 50, c, 160, "#FFF", 800, "middle")}</g>)}</g>) },
  { c: "Türkiye'de yapay zekayla video", r: (t, a, b) => board(t, a, b, cards(t, a + 0.3, ["İlk ders:\nı ş ğ dene", "Yoksa adın\nbile kutu olur"], YEL)) },
  { c: "Yazı tipini", r: (t, a, b) => mon(t, a, b, <HaritaVideo t={t} />), sfx: "pop" },
  { c: "Sonra seslendirmeyi", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["Ses", "Metin", "Harita", "Kurgu"], CL_OR, 520, 420, 360)) },
  { c: "Ve bir hafta içinde", tone: "night", r: (t, a, b) => oda(t, a, b, { back: true, L: <ClaudeEkran t={t} a={a - 6} q="Konu: Sümela Manastırı" lines={["✓ metin", "✓ ses", "✓ harita", "✓ kurgu"]} prog={rp(t, a, b)} />, Rs: <HaritaVideo t={t} title="SÜMELA" />, fans: 0.5 }) },
  { c: "Sabah bir konu", r: (t, a, b) => board(t, a, b, sum(t, a + 0.2, [["Sabah", "bir konu"], ["Öğlen", "video hazır"]], GRN), { bg: "#0E1A12" }) },
  { c: ["İlk hafta yedi", "İlk hafta 7"], r: (t, a, b) => mon(t, a, b, <KanalPanel t={t} views={[7, 31, 12, 9, 15]} subs={3} k={rp(t, a, b)} />) },
  { c: ["Yedi izlenmenin", "7 izlenmenin"], r: (t, a, b) => oda(t, a, b, { night: false, who: [ME({ arms: "head", mouth: "grin", eyes: "closed" })], z: [1.3, 1.4], c0: [960, 520], lamp: 0 }), html: (t, a) => <Big t={t} at={a + 0.6} text="4'ü sen." y={80} size={90} c={YEL} /> },
  { c: "Bu sayıyı aklında", tone: "cool", r: (t, a, b) => mon(t, a, b, <KanalPanel t={t} views={[7, 31, 12]} subs={3} hi={0} />, { z: [1.4, 1.5], c0: [1240, 330] }), html: (t, a) => <Big t={t} at={a + 0.3} text="Bu sayıyı aklında tut" y={860} size={66} c={YEL} /> },
  { c: "Çünkü bir hafta sonra", tone: "cool", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 120 }, (_, i) => <circle key={i} cx={200 + (i % 20) * 80} cy={300 + Math.floor(i / 20) * 90} r={22} fill={GRN} opacity={cl(rp(t, a + 0.5, b) * 120 - i)} />)}</g>, { bg: "#0E1A12" }), html: (t, a) => <Big t={t} at={a + 0.8} text="Bir ilçe kadar insan" y={80} size={70} c={GRN} /> },
  // 4:00 · Derinkuyu
  { c: ["On ikinci gün", "12. gün"], r: (t, a, b) => board(t, a, b, cal(t, a, "GÜN", "12")), sfx: "tick" },
  { c: "Konu Derinkuyu", r: (t, a, b) => cam(t, a, b, <DerinkuyuKesit t={t} reveal={0} />, { z: [1.0, 1.06] }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="Derinkuyu" place="Kapadokya · Nevşehir" /> },
  { c: ["Bin dokuz yüz altmış", "1963"], r: (t, a, b) => cam(t, a, b, <DerinkuyuKesit t={t} reveal={0} wall={1 - rp(t, a + 2, b)} people={ppl(t, [{ o: { hairStyle: "short", hair: "#3A3A3A", top: "#6B5B4A", top2: "#56483A", kind: "shirt", mustache: true }, x: 700, y: 250, s: 0.32, arms: "hold", look: 0.6, mouth: "tight" }])} />, { z: [1.8, 1.9], c0: [900, 200] }), html: (t, a) => <Big t={t} at={a + 0.2} text="1963" y={80} size={110} c={YEL} />, sfx: "knock" },
  { c: "Duvarın arkasında", r: (t, a, b) => cam(t, a, b, <DerinkuyuKesit t={t} reveal={rp(t, a, b) * 0.15} wall={0} />, { z: [1.6, 1.3], c0: [960, 330] }) },
  { c: "Tünelin sonunda", r: (t, a, b) => cam(t, a, b, <DerinkuyuKesit t={t} reveal={rp(t, a, b - 0.3)} wall={0} />, { z: [1.25, 1.0], c0: [960, 500] }), sfx: "drone" },
  { c: "Sabah uyandığında", tone: "warm", r: (t, a, b) => oda(t, a, b, { night: false, lamp: 0, who: [ME({ arms: "phone", eyes: "wide", mouth: "o", lookY: 0.3 })], z: [1.25, 1.35], c0: [960, 520] }), html: (t, a) => <div style={{ position: "absolute", inset: 0 }}><svg width={1920} height={1080}>{[0, 1, 2, 3].map((i) => <Notif key={i} x={1500} y={60 + i * 130} app="YouTube" title={`+${(i + 1) * 312} yeni abone`} body="Derinkuyu videon patlıyor" k={rp(t, a + 0.3 + i * 0.4, a + 0.7 + i * 0.4)} />)}</svg></div>, sfx: "ding" },
  { c: ["Video bir gecede", "Video bir gecede 100"], r: (t, a, b) => ph(t, a, b, <ShortDerin t={t} views={Math.round(lp(12000, 100000, rp(t, a, b)))} />, ODABG(t)) },
  { c: ["Akşam beş yüz", "Akşam 500"], r: (t, a, b) => ph(t, a, b, <ShortDerin t={t} views={Math.round(lp(100000, 500000, rp(t, a, b)))} />, ODABG(t), { z: [1.3, 1.45], c0: [960, 820] }), sfx: "tick" },
  { c: ["Üç gün sonra", "3 gün sonra"], r: (t, a, b) => board(t, a, b, <g />, { bg: "#0E1A12" }), html: (t, a) => <Counter t={t} a={a + 0.2} from={500000} to={1200000} label="izlenme · 3 günde" y={330} c={GRN} />, sfx: "boom" },
  { c: "Abone sayın", r: (t, a, b) => mon(t, a, b, <KanalPanel t={t} views={[1200000, 7, 31, 12]} subs={Math.round(lp(0, 8400, rp(t, a, b)))} hi={0} />) },
  { c: "Ve sen ilk kez hesap", r: (t, a, b) => board(t, a, b, sum(t, a + 0.6, [["1 video", "1 milyon"], ["Günde 5 video", "?"]]), { bg: "#141A24" }) },
  { c: "İşte hata tam burada", tone: "cool", r: (t, a, b) => oda(t, a, b, { who: [ME({ arms: "type", mouth: "grin", eyes: "wide", lookY: 0.3 })], z: [1.2, 1.4], c0: [960, 540], fans: 0.6 }), sfx: "drone" },
  // 5:00 · 5 kanal
  { c: "Ertesi hafta dört", r: (t, a, b) => board(t, a, b, <KanalIzgara t={t} k={rp(t, a, a + 2.5)} />, { bg: "#10131A" }), sfx: "pop" },
  { c: "Hepsi aynı makine", r: (t, a, b) => board(t, a, b, <KanalIzgara t={t} />, { bg: "#10131A", z: [1.4, 1.5], c0: [960, 640] }) },
  { c: ["Günde on beş", "Günde 15"], r: (t, a, b) => board(t, a, b, <KanalIzgara t={t} />, { bg: "#10131A", z: [1.0, 1.08] }) },
  { c: ["Gece üçte", "Gece 3'te"], tone: "night", r: (t, a, b) => mon(t, a, b, <ClaudeEkran t={t} a={a - 6} q="Kanal 4 için 3 video daha" err={t > a + 0.8 ? "Kullanım limitine ulaştınız" : undefined} />), sfx: "buzz" },
  { c: ["Beş saat mi", "5 saat mi"], tone: "night", r: (t, a, b) => oda(t, a, b, { who: [ME({ arms: "head", mouth: "open", brow: "worry", eyes: "wide" })], z: [1.35, 1.45], c0: [960, 520], lamp: 0.2 }) },
  { c: "O gece paketi", tone: "night", r: (t, a, b) => ph(t, a, b, <Abonelik plan="Max" price="6.999,99 ₺" k={rp(t, a, a + 0.8)} />, ODABG(t), { light: true }), sfx: "ding" },
  { c: "Kaan'ın neredeyse", r: (t, a, b) => board(t, a, b, sum(t, a + 0.2, [["Claude Max", "6.999 ₺"], ["Kaan'ın", "~3 videosu"]], RED), { bg: "#1A0E0E" }) },
  { c: "Sadece makine dursun", tone: "night", r: (t, a, b) => oda(t, a, b, { back: true, fans: 0.9, L: <ClaudeEkran t={t} a={a - 6} q="Kanal 4 için 3 video daha" lines={["✓", "✓", "✓"]} prog={rp(t, a, b)} />, Rs: <HaritaVideo t={t} title="UZAY" /> }) },
  { c: "Bilgisayarın artık", tone: "night", r: (t, a, b) => cam(t, a, b, <KurguOda t={t} screenL={PROG(t)} fans={1} />, { z: [2.1, 2.3], c0: [1730, 560] }), sfx: "drone" },
  { c: "Annen kapıyı açıyor", tone: "warm", r: (t, a, b) => cam(t, a, b, <KapiAralik t={t} open={rp(t, a, a + 0.8)} people={ppl(t, [{ o: ANNE, x: 960, y: 1120, s: 1.05, talk: true, brow: "worry", look: 0.2 }])} />, { z: [1.0, 1.1] }), html: (t, a) => Q(t, a + 1.0, "Oğlum bu ses ne, uçak mı kaldırıyorsun?", 860, YEL, 50), sfx: "knock" },
  { c: "Ay sonunda elektrik", r: (t, a, b) => board(t, a, b, <Fatura x={960} y={560} s={1.0} k={rp(t, a, a + 0.6)} />, { bg: "#2A241D", z: [1.0, 1.12] }) },
  { c: "Babanın yüzüne", r: (t, a, b) => ev(t, a, b, [{ o: BABA, x: 760, s: 1.0, arms: "hold", hold: <rect x={-60} y={-80} width={120} height={160} fill="#FBF9F2" />, brow: "angry", lookY: 0.3 }, { o: SEN26K_EV, x: 1350, s: 0.95, look: -0.6, eyes: "half", lookY: 0.4 }]) },
  // 6:10 · yanlış sayı
  { c: "Ve bir sabah, Derinkuyu", r: (t, a, b) => mon(t, a, b, <YorumEkran k={rp(t, a, a + 1.2)} title="Derinkuyu · yorumlar" top={[{ name: "kapadokyalı_hasan", text: "Yirmi kat değil kardeşim, sekiz kat.", likes: "4,2 B" }, { name: "meraklı_ayşe", text: "Bari bir kontrol etseydin 😅", likes: "1,1 B" }]} />) },
  { c: "Yirmi kat değil", r: (t, a, b) => mon(t, a, b, <YorumEkran title="Derinkuyu · yorumlar" top={[{ name: "kapadokyalı_hasan", text: "Yirmi kat değil kardeşim, sekiz kat.", likes: "4,2 B" }]} />, { z: [1.6, 1.75], c0: [700, 210] }), html: (t, a) => Q(t, a + 0.3, "Yirmi kat değil kardeşim, sekiz kat.", 880, YEL, 54) },
  { c: "Videoya dönüyorsun", r: (t, a, b) => cam(t, a, b, <DerinkuyuKesit t={t} label20={rp(t, a + 0.6, a + 1)} />, { z: [1.0, 1.1], c0: [1300, 500] }), sfx: "buzz" },
  { c: "Sen de hiç okumamışsın", r: (t, a, b) => oda(t, a, b, { night: false, lamp: 0, who: [ME({ arms: "head", mouth: "sad", brow: "worry", eyes: "half" })], z: [1.3, 1.4], c0: [960, 520] }) },
  { c: "Bir milyon kişi", tone: "cool", r: (t, a, b) => board(t, a, b, <g>{Array.from({ length: 200 }, (_, i) => <g key={i} transform={`translate(${130 + (i % 25) * 66},${230 + Math.floor(i / 25) * 80})`} opacity={cl(rp(t, a, b) * 200 - i)}><circle r={12} fill="#BBB" /><path d="M-16,36 Q-16,14 0,14 Q16,14 16,36Z" fill="#BBB" /></g>)}</g>, { bg: "#1A0E0E" }), html: (t, a) => <Big t={t} at={a + 0.6} text="1.200.000 kişi · yanlış sayı" y={80} size={64} c={RED} /> },
  { c: "O gece ilk kez", tone: "night", r: (t, a, b) => oda(t, a, b, { who: [ME({ arms: "down", mouth: "flat", eyes: "half", lookY: 0.2 })], lamp: 0, z: [1.2, 1.35], c0: [960, 520] }) },
  { c: "Bu makineyi ben mi", tone: "night", r: (t, a, b) => board(t, a, b, <g><ClaudeMark x={960} y={460} s={4} spin={-t * 12} /></g>, { bg: CL_BG }), html: (t, a) => <Big t={t} at={a + 0.3} text="Ben mi onu kullanıyorum… o mu beni?" y={860} size={58} c={YEL} /> },
  { c: "Ama soruyu fazla", r: (t, a, b) => mon(t, a, b, <KanalPanel t={t} views={[1200000, 1100000, 1400000, 1050000]} subs={21300} k={rp(t, a, b)} />) },
  { c: ["Ve Kayıp Harita, otuz", "Ve Kayıp Harita otuz", "otuz dördüncü"], r: (t, a, b) => board(t, a, b, cal(t, a, "GÜN", "34")), sfx: "tick" },
  { c: "Bin abone", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["1.000\nabone", "90 günde\n10 milyon kısa"], GRN)) },
  { c: ["Bu, YouTube'un para", "Bu YouTube'un para"], r: (t, a, b) => board(t, a, b, <g><path d="M760,420 h400 a40,40 0 0 1 40,40 v160 a40,40 0 0 1 -40,40 h-400 a40,40 0 0 1 -40,-40 v-160 a40,40 0 0 1 40,-40z" fill="#E5322D" /><path d="M920,460 l120,80 l-120,80z" fill="#FFF" /></g>, { bg: "#141A24" }), html: (t, a) => <Big t={t} at={a + 0.6} text="Para kazanma programı" y={860} size={70} c={YEL} /> },
  { c: "Başvuru butonuna", r: (t, a, b) => board(t, a, b, <g transform={`translate(960,540) scale(${1 - 0.08 * (rp(t, a + 0.8, a + 1) - rp(t, a + 1, a + 1.3))})`}><rect x={-300} y={-90} width={600} height={180} rx={90} fill="#3EA6FF" />{tx(0, 22, "BAŞVUR", 72, "#FFF", 800, "middle")}</g>, { bg: "#10131A" }), sfx: "pop" },
  { c: "Ve beklemeye", r: (t, a, b) => oda(t, a, b, { night: false, lamp: 0, who: [ME({ arms: "chin", look: 0.2, lookY: -0.1, eyes: "half" })], z: [1.15, 1.25] }) },
  // 7:30 · e-posta
  { c: ["Kırk birinci gün", "41. gün"], tone: "cool", r: (t, a, b) => board(t, a, b, cal(t, a, "GÜN", "41", "09:00")), sfx: "tick" },
  { c: "E-posta geliyor", tone: "cool", r: (t, a, b) => ph(t, a, b, <LockScreen time="09:00" date="Pazartesi"><Notif x={0} y={0} app="Gmail" title="YouTube" body="Kanalınız hakkında güncelleme" k={rp(t, a + 0.2, a + 0.7)} /></LockScreen>, ODABG(t)), sfx: "ding" },
  { c: "Kanalınız şu anda", tone: "cool", r: (t, a, b) => mon(t, a, b, <Mail from="YouTube İş Ortağı Programı" subject="Başvurunuzla ilgili" badge="UYGUN DEĞİL" badgeC="#E5322D" lines={["Kanalınız şu anda programa", "uygun değil.", "", "Sebep: Özgün olmayan içerik"]} k={rp(t, a, a + 0.8)} />), sfx: "boom" },
  { c: "İşte o e-posta", tone: "cool", r: (t, a, b) => oda(t, a, b, { night: false, lamp: 0, who: [ME({ arms: "down", eyes: "wide", mouth: "o", brow: "worry" })], z: [1.4, 1.5], c0: [960, 500] }) },
  { c: "Çoğu kişi bunu bilmiyor", r: (t, a, b) => mon(t, a, b, <Mail from="YouTube İş Ortağı Programı" subject="Başvurunuzla ilgili" badge="UYGUN DEĞİL" badgeC="#E5322D" lines={["Kanalınız şu anda programa", "uygun değil.", "", "Sebep: Özgün olmayan içerik"]} />, { z: [1.5, 1.6], c0: [700, 470] }) },
  { c: "YouTube yapay zekayı", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["Yapay zeka\nkullanmak: ✓"], H.green, 520, 560, 640)) },
  { c: "Yapay zekayla video yapabilirsin", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Video\nyapmak: ✓", "Para\nkazanmak: ✓"], H.green)) },
  { c: ["YouTube'un para vermediği", "para vermediği"], r: (t, a, b) => board(t, a, b, grid30(t, rp(t, a, b)), { bg: "#10131A" }) },
  { c: "Kendi kurallarında", r: (t, a, b) => board(t, a, b, grid30(t), { bg: "#10131A", z: [1.0, 1.1] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Özgün olmayan içerik" sub="aynı kalıp · seri üretim" y={420} size={86} c={RED} /> },
  { c: "Ve senin kanalını bir insan", r: (t, a, b) => board(t, a, b, grid30(t), { bg: "#10131A", z: [1.2, 1.35], c0: [700, 400], c1: [1200, 650] }) },
  { c: "Aynı ses, aynı geçiş", r: (t, a, b) => board(t, a, b, cards(t, a + 0.1, ["Aynı\nses", "Aynı\ngeçiş", "Aynı\nharita", "Aynı\ncümle"], H.amber, 520, 420, 360)) },
  { c: "Ona göre bu bir kanal", r: (t, a, b) => cam(t, a, b, <Hangar t={t} sign="KAYIP HARİTA" />, { z: [1.0, 1.1] }), html: (t, a) => <Big t={t} at={a + 1.2} text="Bir fabrikaydı." y={80} size={86} c={RED} /> },
  { c: "Diğer dört kanala", r: (t, a, b) => board(t, a, b, <KanalIzgara t={t} />, { bg: "#10131A" }) },
  { c: "Bir ay boyunca beş", r: (t, a, b) => board(t, a, b, sum(t, a + 0.2, [["Bir ayda", "5 kanal"], ["YouTube'dan", "0 ₺"]], RED), { bg: "#1A0E0E" }), sfx: "boom" },
  { c: "O gün bilgisayarı", tone: "cool", r: (t, a, b) => oda(t, a, b, { off: true, lamp: 0, fans: 0, who: [ME({ arms: "down", eyes: "half", slump: 0.6, mouth: "sad" })], z: [1.1, 1.2] }) },
  { c: "Ev sessiz", tone: "cool", r: (t, a, b) => cam(t, a, b, <KurguOda t={t} off fans={0} lamp={0} screenL={null} />, { z: [1.0, 1.15], c0: [1000, 500] }) },
  { c: "annen gelip soruyor", tone: "warm", r: (t, a, b) => cam(t, a, b, <KapiAralik t={t} open={1} people={ppl(t, [{ o: ANNE, x: 960, y: 1120, s: 1.05, talk: true, brow: "worry", look: 0.2, mouth: "o" }])} />, { z: [1.1, 1.2] }), html: (t, a) => Q(t, a + 0.6, "Bozuldu mu?", 860, YEL, 70) },
  { c: "Bozulan bilgisayar", tone: "cool", r: (t, a, b) => oda(t, a, b, { off: true, lamp: 0, who: [ME({ arms: "down", eyes: "closed", slump: 0.8, mouth: "sad" })], z: [1.4, 1.5], c0: [960, 520] }), sfx: "drone" },
  // 9:00 · dönüş
  { c: ["Üç gün hiçbir", "3 gün hiçbir"], tone: "cool", r: (t, a, b) => board(t, a, b, cal(t, a, "GÜN", String(42 + Math.min(2, Math.floor(rp(t, a, b) * 3)))), { bg: "#141A24" }) },
  { c: ["Dördüncü gün", "4. gün"], r: (t, a, b) => mon(t, a, b, <KanalPanel t={t} name="KAAN" views={[214000, 160000, 120000, 98000, 81000]} subs={412000} hi={4} />) },
  { c: "İzlenmeleri düşmüş", r: (t, a, b) => board(t, a, b, <LineChart x={260} y={260} w={1400} h={560} pts={[0.9, 0.92, 0.88, 0.95, 0.9, 0.7, 0.58, 0.5, 0.46, 0.44]} k={rp(t, a, b)} c={RED} mark={0.5} />, { bg: "#0F0F0F" }), html: (t, a) => <Big t={t} at={a + 1.0} text="Yarıya inmiş" y={80} size={76} c={RED} /> },
  { c: "Altında yorumlar", r: (t, a, b) => mon(t, a, b, <YorumEkran k={rp(t, a, a + 1.5)} title="KAAN · yorumlar" top={[{ name: "eski_izleyici", text: "Abi videolar yapay zeka kokuyor.", likes: "3,8 B" }, { name: "kaanfan_06", text: "Eski kurgucunu geri getir.", likes: "2,9 B" }]} />) },
  { c: "Ve o anda bir şey", r: (t, a, b) => oda(t, a, b, { night: false, lamp: 0, who: [ME({ arms: "chin", brow: "up", look: 0.2, mouth: "o" })], z: [1.35, 1.45], c0: [960, 500] }) },
  { c: "Kaan da senin", r: (t, a, b) => stu(t, a, b, [{ o: KAAN, x: 960, s: 1.0, arms: "chin", brow: "worry", lookY: 0.3 }]) },
  { c: "Sen de makineyi", r: (t, a, b) => board(t, a, b, sum(t, a + 0.2, [["Kaan", "kurgucuyu çıkardı"], ["Sen", "kendini çıkardın"]], RED), { bg: "#141A24" }) },
  { c: "Ama makine bir araçtı", r: (t, a, b) => board(t, a, b, brush(t, a), { bg: "#2A241D" }) },
  { c: "O gün dört kanalı", r: (t, a, b) => board(t, a, b, <KanalIzgara t={t} dead={rp(t, a + 0.4, a + 1.6)} />, { bg: "#10131A" }), sfx: "boom" },
  { c: "Sadece Kayıp Harita", r: (t, a, b) => board(t, a, b, <KanalIzgara t={t} dead={1} keep={1} />, { bg: "#10131A", z: [1.3, 1.6], c0: [260, 540] }) },
  { c: "Bir: Metni Claude", r: (t, a, b) => cam(t, a, b, <DerinkuyuKesit t={t} label20={1} label8={rp(t, a + 1.5, a + 2.2)} />, { z: [1.05, 1.15], c0: [1300, 500] }), html: (t, a) => <Big t={t} at={a + 0.2} text="1 · Her sayıyı sen kontrol et" y={80} size={60} c={YEL} /> },
  { c: "İki: Ses senin", r: (t, a, b) => oda(t, a, b, { night: false, lamp: 0, who: [ME({ arms: "hold", hold: <Mic x={0} y={0} s={1.2} />, mouth: "smile", talk: true })], z: [1.25, 1.35], c0: [960, 520] }), html: (t, a) => <Big t={t} at={a + 0.2} text="2 · Ses senin" y={80} size={70} c={YEL} /> },
  { c: "Mikrofonu dolaptan", r: (t, a, b) => board(t, a, b, <Mic x={960} y={600} s={4} />, { bg: "#2A241D", z: [1.0, 1.12] }) },
  { c: ["Üç: Her videoda", "Üç her videoda"], r: (t, a, b) => board(t, a, b, cards(t, a + 0.6, ["Kendi\nfotoğrafın", "Gittiğin\nyer", "Eski\ngazete"], YEL)), html: (t, a) => <Big t={t} at={a + 0.1} text="3 · Sadece sende olan" y={80} size={60} c={YEL} /> },
  { c: ["Ve dört: Yapay", "Ve dört yapay"], r: (t, a, b) => board(t, a, b, <g transform="translate(960,540)"><rect x={-560} y={-120} width={1120} height={240} rx={24} fill="#1A1E27" stroke="#3EA6FF" strokeWidth={4} /><rect x={-500} y={-40} width={80} height={80} rx={12} fill="#FFF" />{rp(t, a + 1.6, a + 2) > 0.5 && <path d="M-488,0 l24,26 l44,-56" stroke="#2BB673" strokeWidth={14} fill="none" />}{tx(-380, 18, "Değiştirilmiş veya yapay içerik", 50, "#FFF", 700)}</g>, { bg: "#10131A" }), html: (t, a) => <Big t={t} at={a + 0.1} text="4 · Saklamayacaksın" y={80} size={60} c={YEL} /> },
  // Kapadokya
  { c: ["İlk iş, Derinkuyu'yu", "İlk iş Derinkuyu'yu"], r: (t, a, b) => cam(t, a, b, <DerinkuyuKesit t={t} label20={1} label8={1} />, { z: [1.0, 1.08] }) },
  { c: ["Cumartesi sabahı", "AŞTİ"], tone: "warm", r: (t, a, b) => cam(t, a, b, <OtobusYol t={t} people={ppl(t, [{ o: SEN26K, x: 300, y: 260, s: 0.3, look: 0.6 }])} />, { z: [1.0, 1.06] }), html: (t, a) => <AgeTag t={t} at={a + 0.4} age="AŞTİ → Nevşehir" place="Cumartesi sabahı" /> },
  { c: ["Üç buçuk saat", "3,5 saat"], tone: "warm", r: (t, a, b) => cam(t, a, b, <OtobusYol t={t} kap={rp(t, a, b)} />, { z: [1.0, 1.06] }), html: (t, a) => <Big t={t} at={a + 0.2} text="3,5 saat" y={80} size={86} /> },
  { c: "Cebinde telefon", tone: "warm", r: (t, a, b) => board(t, a, b, <g transform="translate(960,560) rotate(-3)"><rect x={-420} y={-300} width={840} height={600} fill="#FBF6E6" />{["Kaç kat?", "Kaç kişi yaşamış?", "Kapılar nasıl kapanıyor?", "Kim buldu, ne zaman?"].map((s, i) => <g key={i} opacity={rp(t, a + i * 0.5, a + 0.3 + i * 0.5)}>{tx(-360, -170 + i * 110, "□ " + s, 46, "#22324A", 600)}</g>)}</g>, { bg: "#5A3A22" }) },
  { c: "Yerin altına iniyorsun", tone: "warm", r: (t, a, b) => cam(t, a, b, <Yeralti t={t} people={ppl(t, [{ o: SEN26K, x: lp(600, 900, rp(t, a, b)), y: 1100, s: 0.85, tilt: 12, look: 0.4, arms: "phone" }])} />, { z: [1.0, 1.1] }) },
  { c: "Basamaklar daralıyor", tone: "warm", r: (t, a, b) => cam(t, a, b, <Yeralti t={t} people={ppl(t, [{ o: SEN26K, x: 960, y: 1180, s: 1.0, tilt: 22, eyes: "wide", look: 0.2 }])} />, { z: [1.25, 1.4], c0: [960, 560] }) },
  { c: "Kapıları kapatan", tone: "warm", r: (t, a, b) => cam(t, a, b, <Yeralti t={t} stone={0.4 * rp(t, a, b)} people={ppl(t, [{ o: SEN26K, x: 1150, y: 1100, s: 0.85, arms: "hold", look: 0.6 }])} />, { z: [1.35, 1.5], c0: [1400, 640] }), sfx: "drone" },
  { c: "Ve katları tek tek", tone: "warm", r: (t, a, b) => cam(t, a, b, <Yeralti t={t} count={1 + Math.min(7, Math.floor(rp(t, a, b - 0.4) * 8))} people={ppl(t, [{ o: SEN26K, x: 760, y: 1100, s: 0.85, tilt: 10, look: 0.3, arms: "phone" }])} />, { z: [1.05, 1.15] }), sfx: "tick" },
  { c: "Sekiz", tone: "warm", r: (t, a, b) => cam(t, a, b, <Yeralti t={t} count={8} />, { z: [1.3, 1.4], c0: [1680, 160] }), html: (t, a) => <Big t={t} at={a + 0.1} text="8 kat." y={860} size={110} c={GRN} /> },
  { c: "O akşam yeni videoyu", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0.6, who: [ME({ arms: "hold", hold: <Mic x={0} y={0} s={1.2} />, mouth: "o", talk: true, eyes: "half" })], Rs: <HaritaVideo t={t} title="YİRMİ KAT DEDİM" sub="Yanılmışım." /> }) },
  { c: "İzlenme Derinkuyu'nun", r: (t, a, b) => mon(t, a, b, <KanalPanel t={t} views={[1200000, 410000]} subs={24100} hi={1} />) },
  { c: "Ve yorumlar değişiyor", r: (t, a, b) => mon(t, a, b, <YorumEkran k={rp(t, a, a + 1.2)} title="Yirmi Kat Dedim · yorumlar" top={[{ name: "nevşehirli_ali", text: "İlk kez bir kanal hatasını kabul etti.", likes: "6,7 B" }, { name: "tarih_kurdu", text: "Sesin de güzelmiş, devam.", likes: "2,2 B" }]} />), sfx: "ding" },
  // 10:00 · yeni düzen
  { c: "Artık günde beş", r: (t, a, b) => board(t, a, b, sum(t, a + 0.2, [["Günde 5 video", "✗"], ["Haftada 2 video", "✓"]], GRN), { bg: "#141A24" }) },
  { c: "Ama bir videonun yapımı", r: (t, a, b) => board(t, a, b, sum(t, a + 0.3, [["Eskiden", "14 saat"], ["Şimdi", "4 saat"]], GRN), { bg: "#0E1A12" }) },
  { c: "Çünkü sıkıcı işleri", r: (t, a, b) => mon(t, a, b, <ClaudeEkran t={t} a={a - 3} q="Bu videonun angarya işlerini yap" lines={["✓ altyazı", "✓ kesmeler", "✓ harita çizimi", "✓ ekrana uçan sayılar", "! karar: sende"]} />) },
  { c: "Senin işin", r: (t, a, b) => oda(t, a, b, { night: false, lamp: 0, who: [ME({ arms: "chin", mouth: "smile", look: 0.1 })], L: <KurguProg t={t} preview={<HaritaVideo t={t} title="ANİ" />} />, z: [1.2, 1.3], c0: [960, 520] }) },
  { c: "Ve bir fark ediyorsun", r: (t, a, b) => board(t, a, b, cards(t, a + 0.6, ["Kurgudan\nanlıyorsun", "Claude'u\nkurgucu gibi\nkullanıyorsun"], GRN)) },
  { c: "Bir hesap yapıyorsun", r: (t, a, b) => board(t, a, b, sum(t, a + 0.3, [["14 saat → 4 saat", ""], ["Aynı hafta", "3 kat iş"]], GRN), { bg: "#0E1A12" }) },
  { c: "Ama bunun için müşteri", r: (t, a, b) => oda(t, a, b, { night: false, lamp: 0, who: [ME({ arms: "cross", mouth: "tight", look: 0.2 })], z: [1.25, 1.35], c0: [960, 520] }), html: (t, a) => <Big t={t} at={a + 0.3} text="Müşteri lazım." y={80} size={76} c={YEL} /> },
  { c: "Bir sabah bir paylaşım", r: (t, a, b) => ph(t, a, b, post(t), ODABG(t), { light: true }) },
  { c: "Kendi Derinkuyu hatanı", r: (t, a, b) => ph(t, a, b, post(t), ODABG(t), { light: true, z: [1.5, 1.6], c0: [960, 560] }) },
  { c: "Altına bir cümle", r: (t, a, b) => ph(t, a, b, post(t), ODABG(t), { light: true, z: [1.7, 1.8], c0: [960, 720] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Video başı 1.800 ₺" y={80} size={76} c={GRN} /> },
  { c: ["Akşama kadar on bir", "Akşama kadar 11"], r: (t, a, b) => ph(t, a, b, <LockScreen time="19:40" date="Salı">{Array.from({ length: 4 }, (_, i) => <Notif key={i} x={0} y={i * 128} app="Mesajlar" title={["Tarih kanalı", "Yemek kanalı", "Futbol yorumcusu", "+8 mesaj"][i]} body="Kurgu için fiyat?" k={rp(t, a + i * 0.5, a + 0.4 + i * 0.5)} />)}</LockScreen>, ODABG(t)), sfx: "ding" },
  { c: ["Üçü gerçek", "3'ü gerçek"], r: (t, a, b) => board(t, a, b, cards(t, a + 0.6, ["Tarih\nkanalı", "Yemek\nkanalı", "Futbol\nyorumcusu"], GRN)) },
  { c: "Futbol yorumcusu ilk", tone: "night", r: (t, a, b) => stu(t, a, b, [{ o: YORUMCU, x: 960, s: 1.0, talk: true, arms: "wave", brow: "up" }]), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="Futbol yorumcusu" place="ilk müşteri gecesi" /> },
  { c: "Derbi bitiyor", tone: "night", r: (t, a, b) => board(t, a, b, <g><rect x={460} y={300} width={1000} height={420} rx={30} fill="#111" />{tx(960, 470, "DERBİ · MAÇ SONU", 50, "#AAA", 700, "middle")}{tx(960, 620, "2 - 1", 150, "#FFF", 800, "middle")}</g>, { bg: "#0B2A16" }), html: (t, a) => <Big t={t} at={a + 0.5} text="23:00 → yayın 07:00" y={860} size={66} c={YEL} /> },
  { c: ["Eskiden imkânsızdı", "Eskiden imkansızdı"], tone: "night", r: (t, a, b) => oda(t, a, b, { back: true, L: <ClaudeEkran t={t} a={a - 2} q="Maç yorumu: altyazı + kesme önerisi" lines={["✓ altyazı çıktı", "✓ 41 kesme önerisi"]} prog={rp(t, a, b)} />, Rs: <KurguProg t={t} file="derbi_yorum.prproj" /> }) },
  { c: ["Saat üçte video", "Saat 3'te video"], tone: "night", r: (t, a, b) => board(t, a, b, <g />, { bg: "#0E1A12" }), html: (t, a) => <Big t={t} at={a + 0.2} text="03:00 · hazır ✓" y={420} size={110} c={GRN} /> },
  { c: "Gol anlarını da", tone: "night", r: (t, a, b) => mon(t, a, b, <KurguProg t={t} file="derbi_yorum.prproj" preview={<g><rect width={1000} height={444} fill="#1E6B3A" />{tx(500, 250, "MAÇ YAYINI · GOL", 50, "#FFF", 800, "middle")}</g>} />, { z: [1.2, 1.35], c0: [1200, 300] }) },
  { c: ["Sabah yedi beşte", "Sabah 7.05", "Sabah 7:05"], tone: "cool", r: (t, a, b) => mon(t, a, b, <Mail from="YouTube" subject="Telif hakkı iddiası" badge="İDDİA" badgeC="#E5322D" lines={["Videonuzdaki maç görüntüleri", "yayıncı kuruluşa aittir.", "", "Engellendi ya da gelir hak sahibine."]} k={rp(t, a, a + 0.8)} />), sfx: "buzz" },
  { c: "Maç görüntüleri", tone: "cool", r: (t, a, b) => board(t, a, b, cards(t, a + 0.6, ["Video\nkapanır", "ya da parası\nbaşkasına"], H.red)) },
  { c: ["Saat yedi buçukta", "Saat 7.30"], r: (t, a, b) => mon(t, a, b, <ClaudeEkran t={t} a={a + 0.3} q="Bu golleri taktik tahtasında çiz. Oyuncular nokta, top sarı." speed={42} />) },
  { c: ["On dakika sonra", "10 dakika sonra"], r: (t, a, b) => cam(t, a, b, <TaktikTahta t={t} a={a + 0.3} />, { z: [1.0, 1.06] }), sfx: "whoosh" },
  { c: "Kimsenin görüntüsü", r: (t, a, b) => cam(t, a, b, <TaktikTahta t={t} a={a - 2.6} />, { z: [1.1, 1.2], c0: [1180, 540] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Görüntü yok · telif yok" y={940} size={60} c={YEL} /> },
  { c: "Yorumcu videoyu", r: (t, a, b) => stu(t, a, b, [{ o: YORUMCU, x: 960, s: 1.0, mouth: "grin", arms: "wave", brow: "up" }]), html: (t, a) => <Big t={t} at={a + 1.4} text="Haftanın 1 numarası" y={80} size={70} c={GRN} /> },
  { c: "Ve sana bir cümle", r: (t, a, b) => ph(t, a, b, <WaSohbet name="Yorumcu Emre" time="11:12" msgs={[{ text: "Bundan sonra hep böyle." }]} />, ODABG(t)) },
  { c: "Makine senin elindeyken", r: (t, a, b) => board(t, a, b, sum(t, a + 0.3, [["Makine senin elinde", "10 dakika"], ["Sen makinenin elinde", "fark etmezdin"]]), { bg: "#141A24" }) },
  // 11:20 · Kaan
  { c: ["Ve elli ikinci gün", "Ve 52. gün"], r: (t, a, b) => ph(t, a, b, <Arama name="Kaan" />, ODABG(t), { rot: Math.sin(t * 40) * 1.2 }), html: (t, a) => <Big t={t} at={a + 0.3} text="52. gün" y={80} size={76} />, sfx: "buzz" },
  { c: ["Gece ikiyi kırk yedide gelen", "kırk yedide gelen"], tone: "night", r: (t, a, b) => ph(t, a, b, KAAN_MSG(1, t), ODABG(t), { z: [1.3, 1.4], c0: [960, 400] }), html: (t, a) => <Big t={t} at={a + 0.2} text="02:47" y={80} size={90} c={RED} /> },
  { c: "Şimdi Kaan arıyor", r: (t, a, b) => stu(t, a, b, [{ o: KAAN, x: 960, s: 1.05, arms: "phone", talk: true, brow: "worry", lookY: 0.2 }], { z: [1.2, 1.3], c0: [960, 520] }) },
  { c: "Kardeşim, izleyiciler", r: (t, a, b) => stu(t, a, b, [{ o: KAAN, x: 960, s: 1.2, arms: "phone", talk: true, brow: "worry", eyes: "half" }], { z: [1.4, 1.5], c0: [960, 470] }), html: (t, a) => Q(t, a + 0.3, "İzleyiciler makineyi fark etti. Geri dönsen?", 860, YEL, 52) },
  { c: "Eskiden olsa", r: (t, a, b) => oda(t, a, b, { night: false, lamp: 0, who: [ME({ arms: "phone", look: 0.2, mouth: "flat", lookY: -0.1 })], z: [1.25, 1.35], c0: [960, 520] }) },
  { c: ["Claude'la ben yapacağım", "Claudela ben yapacağım"], r: (t, a, b) => oda(t, a, b, { night: false, lamp: 0, who: [ME({ arms: "phone", talk: true, mouth: "smile", brow: "flat" })], z: [1.4, 1.5], c0: [960, 500] }), html: (t, a) => Q(t, a + 0.3, "Claude'la ben yapacağım. Karar benim. Video başı 3.000.", 860, GRN, 48) },
  { c: "Kaan bir saniye", r: (t, a, b) => stu(t, a, b, [{ o: KAAN, x: 960, s: 1.2, arms: "phone", eyes: "half", mouth: "tight" }], { z: [1.45, 1.5], c0: [960, 470] }) },
  { c: "Sonra: Tamam", r: (t, a, b) => stu(t, a, b, [{ o: KAAN, x: 960, s: 1.15, arms: "phone", mouth: "smile", talk: true }], { z: [1.35, 1.42], c0: [960, 480] }), html: (t, a) => <Big t={t} at={a + 0.3} text="“Tamam.”" sub="2.500 → 3.000 ₺" y={80} size={90} c={GRN} />, sfx: "ding" },
  { c: ["Ve kırk birinci günden", "41. günden"], r: (t, a, b) => board(t, a, b, cal(t, a, "GÜN", "71", "tekrar başvuru")), sfx: "tick" },
  { c: "YouTube reddettiği", r: (t, a, b) => board(t, a, b, cards(t, a + 0.3, ["Ret", "30 gün", "Tekrar\nbaşvuru"], H.blue, 520, 520, 440)) },
  { c: "Bu sefer ekranda", r: (t, a, b) => mon(t, a, b, <HaritaVideo t={t} title="EFES" sub="ses: kendi sesim · foto: kendim" />) },
  { c: ["Yetmiş sekizinci gün", "78. gün"], tone: "warm", r: (t, a, b) => mon(t, a, b, <Mail from="YouTube İş Ortağı Programı" subject="Tebrikler!" badge="KABUL" lines={["Kanalınız programa kabul edildi.", "", "Kayıp Harita artık para kazanabilir."]} k={rp(t, a, a + 0.8)} />), html: (t, a) => <Big t={t} at={a + 0.2} text="78. gün" y={80} size={70} />, sfx: "ding" },
  { c: "Bir şey daha öğreniyorsun", r: (t, a, b) => board(t, a, b, <Stopaj t={t} a={a + 0.3} />, { bg: "#10131A" }) },
  { c: ["YouTube'dan gelen her", "gelen her dolardan"], r: (t, a, b) => board(t, a, b, <Stopaj t={t} a={a - 3} />, { bg: "#10131A", z: [1.3, 1.4], c0: [960, 470] }) },
  { c: "Çoğu kişi bunu ilk", r: (t, a, b) => board(t, a, b, <Stopaj t={t} a={a - 6} />, { bg: "#10131A", z: [1.0, 1.06] }), html: (t, a) => <Big t={t} at={a + 0.5} text="Sen şimdi öğrendin." y={80} size={70} c={YEL} /> },
  // 12:30 · defter
  { c: "Şimdi o defteri", r: (t, a, b) => board(t, a, b, LED(GELIR, 0, -1, "3. ay · gelirler"), { bg: "#2A241D" }) },
  { c: ["Kaan, sekiz video", "Kaan sekiz video", "Kaan, 8 video"], r: (t, a, b) => board(t, a, b, LED(GELIR, rp(t, a, a + 2), 0, "3. ay · gelirler"), { bg: "#2A241D" }) },
  { c: ["Diğer üç kanal", "Diğer 3 kanal"], r: (t, a, b) => board(t, a, b, LED(GELIR, 1 + rp(t, a, a + 2), 1, "3. ay · gelirler"), { bg: "#2A241D" }) },
  { c: ["Kayıp Harita. YouTube'dan", "Kayıp Harita YouTube'dan"], r: (t, a, b) => board(t, a, b, LED(GELIR, 2 + rp(t, a, a + 2), 2, "3. ay · gelirler"), { bg: "#2A241D" }), html: (t, a) => <Big t={t} at={a + 1.6} text="0 ₺" y={60} size={110} c={RED} /> },
  { c: ["Hesabında yüz on iki", "Hesabında 112"], r: (t, a, b) => board(t, a, b, <g><rect x={560} y={320} width={800} height={400} rx={30} fill="#1A1E27" stroke="#555" strokeWidth={4} strokeDasharray="20 14" />{tx(960, 500, "112 $", 140, "#888", 800, "middle")}{tx(960, 620, "gelecek ay", 44, "#888", 600, "middle")}</g>, { bg: "#10131A" }) },
  { c: "Toplam gelir", r: (t, a, b) => board(t, a, b, LED(GELIR, 4, 3, "3. ay · gelirler"), { bg: "#2A241D", z: [1.05, 1.15], c0: [960, 760] }), html: (t, a) => <Big t={t} at={a + 0.2} text="49.200 ₺" y={60} size={110} c={GRN} /> },
  { c: ["Giderler. Claude", "Giderler Claude"], r: (t, a, b) => board(t, a, b, LED(GIDER, 1, 0, "3. ay · giderler"), { bg: "#2A241D" }) },
  { c: "Faturayı kesebilmek", r: (t, a, b) => board(t, a, b, LED(GIDER, 2, 1, "3. ay · giderler"), { bg: "#2A241D" }), html: (t, a) => <Big t={t} at={a + 2.4} text="Bağ-Kur" y={60} size={80} c={RED} /> },
  { c: "Muhasebeci", r: (t, a, b) => board(t, a, b, LED(GIDER, 3, 2, "3. ay · giderler"), { bg: "#2A241D" }) },
  { c: "Bilgisayarın gece gündüz", r: (t, a, b) => board(t, a, b, LED(GIDER, 4, 3, "3. ay · giderler"), { bg: "#2A241D" }) },
  { c: "Toplam gider", r: (t, a, b) => board(t, a, b, LED(GIDER, 5, 4, "3. ay · giderler"), { bg: "#2A241D", z: [1.05, 1.15], c0: [960, 800] }), html: (t, a) => <Big t={t} at={a + 0.2} text="−23.300 ₺" y={60} size={110} c={RED} /> },
  { c: "Kalan", r: (t, a, b) => board(t, a, b, sum(t, a + 0.2, [["Gelir", "49.200"], ["Gider", "−23.300"], ["Cebinde", "25.900 ₺"]]), { bg: "#141A24" }), sfx: "boom" },
  { c: ["Asgari ücret: yirmi", "Asgari ücret yirmi"], r: (t, a, b) => board(t, a, b, sum(t, a + 0.2, [["Asgari ücret", "28.075 ₺"], ["Sen", "25.900 ₺"]], RED), { bg: "#1A0E0E" }) },
  { c: ["Evet. Üç ay sonra", "Evet üç ay sonra"], tone: "cool", r: (t, a, b) => oda(t, a, b, { night: true, lamp: 0.4, who: [ME({ arms: "down", slump: 0.5, eyes: "half", mouth: "sad", lookY: 0.3 })], z: [1.25, 1.35], c0: [960, 520] }) },
  { c: "Ama defterin bir satırı", r: (t, a, b) => board(t, a, b, <g><rect x={560} y={320} width={800} height={400} rx={30} fill="#0E2418" stroke="#2BB673" strokeWidth={4} />{tx(960, 500, "112 $", 140, GRN, 800, "middle")}{tx(960, 620, "geliyor", 44, "#CFE", 600, "middle")}</g>, { bg: "#10131A" }), sfx: "ding" },
  { c: "Bugünkü kurla", r: (t, a, b) => board(t, a, b, <Stopaj t={t} a={a} />, { bg: "#10131A" }) },
  { c: "Ve o ay, ilk kez", r: (t, a, b) => board(t, a, b, sum(t, a + 0.2, [["Asgari ücret", "28.075 ₺"], ["Sen · gelecek ay", "30.700 ₺"]], GRN), { bg: "#0E2418" }), sfx: "ding" },
  // 13:30 · hüküm
  { c: "Peki", r: (t, a, b) => oda(t, a, b, { night: false, lamp: 0, who: [ME({ arms: "down", look: 0, mouth: "flat" })], z: [1.35, 1.45], c0: [960, 480] }), html: (t, a) => <Big t={t} at={a + 0.2} text="Peki… gerçekten değer mi?" y={80} size={70} c={YEL} /> },
  { c: "YouTube otomasyonu dedikleri", r: (t, a, b) => board(t, a, b, cards(t, a + 0.4, ["Tek tuşla\npara basan\nmakine ✗"], H.red, 520, 560, 640)) },
  { c: "O makineyi sen de", r: (t, a, b) => board(t, a, b, <KanalIzgara t={t} />, { bg: "#10131A" }), html: (t, a) => <Big t={t} at={a + 1.6} text="5 kanal · 1 milyon · 0 ₺" y={80} size={66} c={RED} /> },
  { c: "Çünkü herkesin kurabildiği", r: (t, a, b) => board(t, a, b, grid30(t), { bg: "#10131A", z: [1.0, 1.15] }) },
  { c: "Ama Claude seni işsiz", r: (t, a, b) => oda(t, a, b, { night: false, lamp: 0, who: [ME({ arms: "type", mouth: "smile", lookY: 0.2 })], L: <ClaudeEkran t={t} a={a - 5} q="Kaan 214: angarya işler" lines={["✓ altyazı", "✓ kesme", "! karar: sende"]} />, Rs: <KurguProg t={t} file="Kaan_bolum214.prproj" /> }) },
  { c: "Seni işinden eden", r: (t, a, b) => stu(t, a, b, [{ o: KAAN, x: 960, s: 1.0, arms: "cross", mouth: "tight", look: 0.2 }]) },
  { c: "Sen doğru kullanınca", r: (t, a, b) => board(t, a, b, sum(t, a + 0.3, [["Eskiden", "1 müşteri"], ["Şimdi", "4 müşteri"]], GRN), { bg: "#0E1A12" }) },
  { c: "Bu iş kimin için", r: (t, a, b) => board(t, a, b, cards(t, a + 1.2, ["Kurgu", "Anlatım", "Araştırma", "Ses"], GRN, 520, 420, 360)) },
  { c: "Yeteneği olmayan", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["Yetenek varsa:\n× 3", "Yoksa:\ndaha hızlı hata"], YEL)) },
  { c: "Zorluk", r: (t, a, b) => cam(t, a, b, <rect width={1920} height={1080} fill="#0E1016" />, {}, [1, 1.05]), html: (t, a) => <Verdict t={t} a={a} rows={[["Zorluk", 6], ["Sermaye", 4], ["Sabır", 8]]} title="Claude ile YouTube otomasyonu" /> },
  { c: "Ve o dosyayı", tone: "night", r: (t, a, b) => mon(t, a, b, <KurguProg t={t} />, { z: [1.6, 1.75], c0: [960, 150] }) },
  { c: ["Hâlâ masaüstünde", "Hala masaüstünde"], tone: "night", r: (t, a, b) => board(t, a, b, <g><rect width={1920} height={1080} fill="#1E3A5A" />{[["Kaan_bolum212_FINAL_son_v3", 760, 460]].map(([n, x, y]) => <g key={String(n)} transform={`translate(${x},${y})`}><rect x={-80} y={-100} width={160} height={180} rx={10} fill="#9A6BE0" />{tx(0, 10, "PR", 60, "#FFF", 800, "middle")}{tx(0, 140, String(n), 30, "#FFF", 600, "middle")}</g>)}</g>, { z: [1.0, 1.15], c0: [760, 500] }) },
  { c: ["On dört saat. Kırk dakika. Ve", "Kırk dakika. Ve arada"], tone: "night", r: (t, a, b) => board(t, a, b, sum(t, a + 0.2, [["14 saat", ""], ["40 dakika", ""], ["Arada", "senin kararın"]], GRN), { bg: "#141A24" }) },
  { c: "Sen olsan yapay zekayla", r: (t, a, b) => board(t, a, b, cards(t, a + 0.4, ["Müzik?", "Çeviri?", "Tasarım?"], YEL)) },
  { c: "Yorumlara yaz", r: (t, a, b) => board(t, a, b, comment(t, a)) },
  { c: "Bir sonrakini", r: (t, a, b) => oda(t, a, b, { night: false, lamp: 0, who: [ME({ arms: "wave", mouth: "smile", look: 0 })], z: [1.0, 1.08] }), html: (t, a) => <SubBtn t={t} at={a + 0.6} /> },
];

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K6_11_SECONDS));
  return raw;
})();

export const K6Video11: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const fadeIn = rp(t, 0, 0.4);
  const cutFlash = 1 - rp(t, s.from, s.from + 0.12);
  const fadeOut = 1 - rp(t, K6_11_SECONDS - 1.5, K6_11_SECONDS);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: fadeIn * fadeOut }}>
        <HFrame>
          {s.r(t, s.from, s.to)}
          <Atmos t={t} tone={s.tone ?? "warm"} dust={0.4} rays={0.3} seed={n} />
          <Sweep t={t} a={s.from} />
        </HFrame>
        {s.html?.(t, s.from, s.to)}
        <AbsoluteFill style={{ background: "#FFFFFF", opacity: cutFlash * 0.12, pointerEvents: "none" }} />
      </AbsoluteFill>
      <Audio src={staticFile("audio/k6-11.wav")} />
      {TIMED.map((x, i) => i > 0 && x.to < K6_11_SECONDS - 15 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.sfx === "knock" ? 0.08 : x.sfx === "boom" || x.sfx === "drone" ? 0.12 : x.sfx ? 0.15 : 0.07} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
