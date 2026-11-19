import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k6-10-words.json";
import { makeCue } from "../../lib/cues";
import { Atmos, Sweep, Tone } from "../../components/Live";
import { ANNE, AgeTag, Big, Counter, DM, H, HArms, HBrow, HCam, HFrame, HMouth, Laptop, Look, Notif, Person, Phone, SubBtn, TeaGlass, TeenRoom, Verdict, cl, lp, rp } from "../../components/Hayat";
import { Defter } from "../../components/HayatCarsi";
import { Sokak, Tomar, Zarf } from "../../components/HayatTaksi";
import { EvGebze } from "../../components/HayatFabrika";
import {
  AiEtiket, AiSohbet, Adimsayar, Berber, Butik, DAYI, DukkanHarita, Firin, FirinAgzi, GELIN, Gevrek, HUSEYIN, Hamur, HaritaYorum, InstaProfil, IsletmeKart,
  KARDES2, KASAP, Kuafor, LahmacunSalon, Lahmacun, MURAT, MUSAVIR, MUSTERI_K, Musavir, NUR, OdemeHata, RandevuEkran, ResimUret, SELIN, SEN24, SEN24_EV,
  UrunListe, VergiLevhasi, WaListe, YolGrafik,
} from "../../components/HayatEsnaf";

// Kanal 4 · k6-10 · "Yapay Zekayla Esnafa Hizmet Satsan, Ay Sonunda Cebinde Ne Kalır?"
// Ses: Gemini TTS (Achird, gemini-2.5-flash-preview-tts), 5 parça; kelime zamanları faster-whisper (align_parts). tighten + acompressor/loudnorm.

const W = words as { text: string; start: number; end: number }[];
const cue = makeCue(W);
const VOICE_END = W[W.length - 1].end;
export const K6_10_SECONDS = Math.ceil(VOICE_END + 4);
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

type SP = Z & { extra?: React.ReactNode };
const lah = (t: number, a: number, b: number, people: PP[], p: SP & { night?: boolean; dawn?: boolean; queue?: number; fire?: number } = {}) =>
  cam(t, a, b, <LahmacunSalon t={t} night={p.night} dawn={p.dawn} queue={p.queue} fire={p.fire} people={<>{ppl(t, people)}{p.extra}</>} />, { ...p, c0: p.c0 ?? C2 }, [1.06, 1.14]);
const fa = (t: number, a: number, b: number, p: Z & { slide?: number; lah?: boolean; dawn?: boolean } = {}) =>
  cam(t, a, b, <FirinAgzi t={t} slide={p.slide ?? rp(t, a + 0.3, b)} lah={p.lah ?? true} dawn={p.dawn} />, p, [1.0, 1.1]);
const kua = (t: number, a: number, b: number, people: PP[], p: SP & { chaos?: boolean } = {}) =>
  cam(t, a, b, <Kuafor t={t} chaos={p.chaos} people={<>{ppl(t, people)}{p.extra}</>} />, { ...p, c0: p.c0 ?? C2 }, [1.06, 1.14]);
const but = (t: number, a: number, b: number, people: PP[], p: SP & { kara?: boolean; night?: boolean; ring?: boolean } = {}) =>
  cam(t, a, b, <Butik t={t} kara={p.kara} night={p.night} ring={p.ring} people={<>{ppl(t, people)}{p.extra}</>} />, { ...p, c0: p.c0 ?? C2 }, [1.06, 1.14]);
const fir = (t: number, a: number, b: number, people: PP[], p: SP & { dawn?: boolean } = {}) =>
  cam(t, a, b, <Firin t={t} dawn={p.dawn} people={<>{ppl(t, people)}{p.extra}</>} />, { ...p, c0: p.c0 ?? C2 }, [1.06, 1.14]);
const ber = (t: number, a: number, b: number, people: PP[], p: SP = {}) =>
  cam(t, a, b, <Berber t={t} people={<>{ppl(t, people)}{p.extra}</>} />, { ...p, c0: p.c0 ?? C2 }, [1.06, 1.14]);
const mus = (t: number, a: number, b: number, people: PP[], p: SP = {}) =>
  cam(t, a, b, <Musavir t={t} people={<>{ppl(t, people)}{p.extra}</>} />, { ...p, c0: p.c0 ?? C2 }, [1.06, 1.14]);
const sok = (t: number, a: number, b: number, people: PP[], p: SP & { night?: boolean } = {}) =>
  cam(t, a, b, <Sokak t={t} px={-rp(t, a, b) * 120} night={p.night} signs={["KASAP", "KUAFÖR", "BUTİK", "EMLAK", "ECZANE"]} people={ppl(t, people)} />, p, [1.0, 1.06]);
const ev = (t: number, a: number, b: number, people: PP[], p: SP = {}) =>
  cam(t, a, b, <EvGebze t={t} heater={false} people={<>{p.extra}{ppl(t, people)}</>} />, { ...p, c0: p.c0 ?? C2 }, [1.08, 1.16]);
// oda: gece, masada kardeşin laptopu, sen yazıyorsun
const oda = (t: number, a: number, b: number, p: Z & { screen?: React.ReactNode; who?: PP[]; lamp?: number; kardes?: boolean } = {}) =>
  cam(t, a, b, <g><TeenRoom t={t} night poster="ESES" lamp={p.lamp ?? 0.6} />{p.kardes && P(t, { o: KARDES2, x: 220, y: 1010, s: 0.7, eyes: "closed", tilt: -14 })}<Laptop x={1220} y={640} s={0.42} t={t}>{p.screen ?? <rect width={1000} height={625} fill="#2B3A55" />}</Laptop><ellipse cx={1120} cy={560} rx={420} ry={300} fill="url(#hGlow)" opacity={0.6} />{ppl(t, p.who ?? [{ o: SEN24_EV, x: 760, y: 1080, s: 0.95, arms: "type", look: 0.7, lookY: 0.2 }])}</g>, { ...p, c0: p.c0 ?? [1000, 560] }, [1.05, 1.12]);
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
const lap = (t: number, a: number, b: number, screen: React.ReactNode, bg: React.ReactNode, p: Z = {}) => (
  <HCam t={t} a={a} b={b} z={p.z ?? [1, 1.07]} c0={p.c0} c1={p.c1}>
    <g style={{ filter: "blur(10px)" }}>{bg}</g>
    <rect width={1920} height={1080} fill="#000" opacity={0.4} />
    <Laptop x={960} y={520} s={1.3} t={t}>{screen}</Laptop>
  </HCam>
);
const call = (name: string, sub = "arıyor…") => (
  <g><rect width={360} height={740} fill="#1B2440" /><circle cx={180} cy={250} r={70} fill="#4A5A7A" />{tx(180, 272, name[0], 64, "#FFF", 700, "middle")}{tx(180, 380, name, 34, "#FFF", 700, "middle")}{tx(180, 420, sub, 22, "#AAB4C8", 600, "middle")}<circle cx={90} cy={620} r={40} fill="#E5322D" /><circle cx={270} cy={620} r={40} fill="#2BB673" /></g>
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
const comment = (t: number, a: number) => { const msg = "Bence sıradaki: ..."; const n = Math.floor(rp(t, a + 0.8, a + 3) * msg.length); return <g transform="translate(960,460)"><rect x={-680} y={-170} width={1360} height={340} rx={30} fill="#1A1E27" /><circle cx={-560} cy={-60} r={50} fill={YEL} />{tx(-480, -50, "Yorum ekle…", 44, "#AAA", 600)}{tx(-480, 60, msg.slice(0, n), 48, "#FFF", 600)}</g>; };
const sum = (t: number, a: number, lines: [string, string][]) => (
  <g>{lines.map(([l, r], i) => { const k = rp(t, a + i * 1.2, a + i * 1.2 + 0.4); return <g key={i} opacity={k} transform={`translate(0,${(1 - k) * 30})`}>{tx(380, 380 + i * 170, l, 70, "#E8E8E8", 600)}{tx(1540, 380 + i * 170, r, 84, i === lines.length - 1 ? YEL : "#FFF", 700, "end")}</g>; })}</g>
);
// guru videosu (telefon içi)
const guru = (t: number) => (
  <g><rect width={360} height={740} fill="#0B0B0B" /><rect x={0} y={170} width={360} height={260} fill="#1B1B22" /><circle cx={110} cy={300} r={60} fill="#C08560" /><rect x={70} y={350} width={80} height={80} fill="#222" />
    <rect x={180} y={240} width={160} height={110} rx={8} fill="#2B3A55" />{tx(260, 310, "AI", 40, "#5CF08E", 800, "middle")}
    {tx(180, 480, "Yapay zekayla", 28, "#FFF", 700, "middle")}{tx(180, 530, "AYDA 5.000 $", 42, "#FFE27A", 900, "middle")}
    <rect x={20} y={420} width={320} height={6} fill="#333" /><rect x={20} y={420} width={320 * ((t * 0.05) % 1)} height={6} fill="#E5322D" />{tx(180, 620, "1,2 Mn görüntüleme", 18, "#999", 600, "middle")}</g>
);
const viral = (t: number, a: number, to = 18000) => (
  <g><rect width={360} height={740} fill="#000" /><svg x={0} y={60} width={360} height={560} viewBox="0 0 360 560"><rect width={360} height={560} fill="#2A1408" /><g transform="translate(180,330) scale(0.5)"><Hamur x={0} y={0} t={t} /></g><g transform="translate(180,560) scale(0.18)"><FirinAgzi t={t} lah={false} /></g></svg>
    {tx(20, 660, "▶ " + Math.round(to * rp(t, a + 0.3, a + 2.8)).toLocaleString("tr-TR") + " görüntüleme", 22, "#FFF", 700)}{tx(20, 700, "Ramazan Usta · taş fırın", 16, "#BBB", 600)}</g>
);
const lahPlate = (t: number, a: number, b: number, ai: boolean, p: Z & { bg?: string } = {}) => board(t, a, b, <Lahmacun x={960} y={560} s={1.5} ai={ai} t={t} />, { bg: p.bg ?? (ai ? "#1A1220" : "#3A2416"), z: p.z ?? [1.0, 1.12], c0: p.c0, c1: p.c1 });

const GELIR: [string, string][] = [["Ramazan dayı", "3.000"], ["Nur abla", "6.000"], ["Selin hanım", "12.000"], ["Hüseyin amca", "8.000"], ["Murat", "0"], ["Toplam gelir", "29.000"]];
const GIDER: [string, string][] = [["Bağ-Kur", "−11.800"], ["Mali müşavir", "−3.600"], ["YZ + tasarım", "−2.000"], ["Yol", "−1.400"], ["Telefon + internet", "−800"], ["İkram lahmacun", "−1.200"], ["Toplam gider", "−20.800"]];
const ROOMBG = (t: number) => <TeenRoom t={t} night poster="ESES" />;
const LAHBG = (t: number) => <LahmacunSalon t={t} />;

const SHOTS: Sh[] = [
  // 0:00 · kanca
  { c: "Gece biri", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0, who: [{ o: SEN24_EV, x: 760, y: 1100, s: 0.95, arms: "phone", look: 0.2, lookY: -0.3, eyes: "half" }], kardes: true }), html: (t, a) => <Big t={t} at={a + 0.3} text="01:20" y={80} size={90} /> },
  { c: "İzmir, Bornova", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0, z: [1.15, 1.25], c0: [1500, 380], who: [], kardes: true }), html: (t, a) => <AgeTag t={t} at={a + 0.2} age="İzmir" place="Bornova" /> },
  { c: "Yatağında yatıyorsun", tone: "night", r: (t, a, b) => ph(t, a, b, guru(t), ROOMBG(t)) },
  { c: "Ekranda bir adam", tone: "night", r: (t, a, b) => ph(t, a, b, guru(t), ROOMBG(t), { z: [1.3, 1.45], c0: [960, 420] }) },
  { c: "Yapay zekayla ayda", tone: "night", r: (t, a, b) => ph(t, a, b, guru(t), ROOMBG(t), { z: [1.5, 1.65], c0: [960, 620] }), html: (t, a) => Q(t, a + 0.3, "Ayda 5.000 $. Sadece bir laptop.", 860, YEL, 56) },
  { c: "Sen bu videoyu", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0, who: [{ o: SEN24_EV, x: 760, y: 1100, s: 1.05, arms: "phone", lookY: -0.2, eyes: "half", mouth: "tight" }], z: [1.25, 1.35], c0: [760, 560] }), html: (t, a) => <Big t={t} at={a + 0.8} text="Bu hafta 3. kez" y={80} size={66} c={YEL} /> },
  { c: "Çünkü bugün", tone: "cool", r: (t, a, b) => board(t, a, b, <g />, { bg: "#141A24" }), html: (t, a) => <Counter t={t} a={a + 0.3} from={40} to={61} label="iş başvurusu · 0 cevap" y={330} c={RED} />, sfx: "tick" },
  { c: "Ve bu ayın", tone: "night", r: (t, a, b) => lap(t, a, b, <OdemeHata k={rp(t, a + 1.6, a + 2.2)} t={t} />, <Butik t={t} night kara />), html: (t, a) => <Big t={t} at={a + 1.0} text="23:12" y={70} size={90} c={RED} />, sfx: "buzz" },
  { c: "Dört yüz kişi", tone: "night", r: (t, a, b) => ph(t, a, b, <WaListe t={t} a={a} n={400} />, <Butik t={t} night kara />), html: (t, a) => <Big t={t} at={a + 0.2} text="400 kişi · 00:00" y={70} size={80} c={YEL} /> },
  { c: "Oraya da", tone: "night", r: (t, a, b) => but(t, a, b, [], { night: true, kara: true, z: [1.2, 1.0], c0: [300, 500] }) },
  // söz
  { c: "Ama önce sana", r: (t, a, b) => board(t, a, b, LED([["Gelen", "?"], ["Giden", "?"]], 0, -1, "Ay sonu defteri"), { bg: "#2A241D" }) },
  { c: "Kazandığın her", r: (t, a, b) => board(t, a, b, LED([["Gelen", "?"], ["Giden", "?"]], rp(t, a, a + 2) * 2, -1, "Ay sonu defteri"), { bg: "#2A241D", z: [1.05, 1.15] }) },
  { c: "Ve fabrikada", r: (t, a, b) => board(t, a, b, sum(t, a + 0.4, [["Fabrikada asgari ücret", "28.075 ₺"], ["Laptop + yapay zeka", "?"]]), { bg: "#141A24" }) },
  { c: "Bakalım laptopla", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 960, s: 0.9, arms: "type", look: 0.2 }], { queue: 2 }), html: (t, a) => <Big t={t} at={a + 0.5} text="Yapay zekayla esnafa iş…" sub="ay sonunda cebinde ne kalır?" y={80} size={68} c={YEL} /> },
  // 0:50 · sen
  { c: "24 yaşındasın", r: (t, a, b) => oda(t, a, b, { lamp: 1, who: [{ o: SEN24_EV, x: 760, y: 1080, s: 1.0, look: -0.2, mouth: "flat" }] }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="24 yaşında" place="İşletme mezunu · Bornova" /> },
  { c: "Diploman", r: (t, a, b) => board(t, a, b, <g transform="translate(960,560) rotate(-4)"><rect x={-420} y={-280} width={840} height={560} fill="#FBF6E6" stroke="#C9A227" strokeWidth={14} />{tx(0, -140, "DİPLOMA", 80, "#22324A", 800, "middle")}{tx(0, -40, "İşletme · Lisans", 44, "#555", 600, "middle")}<circle cx={260} cy={160} r={70} fill="#C0392B" opacity={0.8} /></g>, { bg: "#5A3A22", z: [1.0, 1.12] }), html: (t, a) => <Big t={t} at={a + 0.6} text="8 aydır çekmecede" y={80} size={66} c={YEL} /> },
  { c: "Annenle babanın", r: (t, a, b) => ev(t, a, b, [{ o: ANNE, x: 600, s: 0.95, look: 0.4, talk: true }, { o: SEN24_EV, x: 1320, s: 0.95, look: -0.3 }]) },
  { c: "Odanı lise", r: (t, a, b) => oda(t, a, b, { lamp: 1, who: [{ o: KARDES2, x: 760, y: 1080, s: 0.95, arms: "type", look: 0.6, brow: "worry" }], z: [1.1, 1.2] }), html: (t, a) => <AgeTag t={t} at={a + 0.6} age="Kardeşin" place="lise son · YKS yılı" /> },
  { c: ["Laptop'un bile", "Laptopun bile"], r: (t, a, b) => board(t, a, b, <Laptop x={960} y={520} s={1.1} old t={t}><rect width={1000} height={625} fill="#1E2A44" />{tx(500, 330, "Kardeşimin 🙂", 60, "#FFF", 700, "middle")}</Laptop>, { bg: "#2A241D", z: [1.0, 1.1] }) },
  { c: ["Akşam 9", "Akşam dokuz"], r: (t, a, b) => board(t, a, b, sum(t, a + 0.3, [["21:00 → 07:00", "SEN"], ["07:00 → 21:00", "KARDEŞİN"]]), { bg: "#141A24" }), html: (t, a) => <Big t={t} at={a + 3.0} text="Anlaşma bu." y={860} size={70} c={YEL} /> },
  { c: "O gece videoyu", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0.3, who: [{ o: SEN24_EV, x: 760, y: 1080, s: 1.05, look: -0.4, lookY: -0.2, mouth: "smile" }], z: [1.2, 1.3], c0: [760, 520] }) },
  { c: "Ramazan dayı", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 1000, s: 0.95, arms: "type", look: -0.2, mouth: "smile" }], { queue: 3 }), html: (t, a) => <AgeTag t={t} at={a + 0.3} age="Ramazan dayı" place="30 yıldır Bornova'da" /> },
  { c: "Taş fırın", r: (t, a, b) => fa(t, a, b, { lah: false, z: [1.0, 1.08] }), html: (t, a) => <Big t={t} at={a + 0.3} text="Taş fırın · odun ateşi" y={80} size={64} c={YEL} /> },
  { c: "Dayının Instagram", tone: "night", r: (t, a, b) => ph(t, a, b, <InstaProfil name="ramazanusta.lahmacun" followers={212} posts={9} />, ROOMBG(t), { light: true }) },
  { c: "212 takipçi", tone: "night", r: (t, a, b) => ph(t, a, b, <InstaProfil name="ramazanusta.lahmacun" followers={212} posts={9} last="Son paylaşım: 2019" />, ROOMBG(t), { light: true, z: [1.4, 1.55], c0: [1000, 330] }) },
  { c: "Bir bayram", tone: "night", r: (t, a, b) => ph(t, a, b, <InstaProfil name="ramazanusta.lahmacun" followers={212} posts={9} last="İyi bayramlar 🌙 · 2019" />, ROOMBG(t), { light: true, z: [1.3, 1.5], c0: [960, 860] }) },
  { c: "İşte ilk müşterin", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0.2, who: [{ o: SEN24_EV, x: 760, y: 1080, s: 1.1, look: 0.1, mouth: "smile", brow: "up" }], z: [1.3, 1.4], c0: [760, 500] }), html: (t, a) => <Big t={t} at={a + 0.3} text="İlk müşterin" y={80} size={76} c={GRN} /> },
  // 1:30 · dükkân
  { c: "Ertesi gün öğlen", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 700, s: 0.95, arms: "type", look: 0.4 }, { o: SEN24, x: 1250, s: 0.9, look: -0.4, talk: true }], { queue: 4, extra: <Hamur x={700} y={720} s={0.4} t={t} /> }) },
  { c: "Yapay zeka mı", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 900, s: 1.15, talk: true, brow: "angry", look: 0.2 }], { z: [1.35, 1.45], c0: [900, 470] }), html: (t, a) => Q(t, a + 0.4, "Lahmacunumu makine mi yapacak?") },
  { c: "Hayır dayı", r: (t, a, b) => lah(t, a, b, [{ o: SEN24, x: 1000, s: 1.15, talk: true, mouth: "smile", look: -0.2, arms: "hold", hold: <rect x={-50} y={-70} width={100} height={140} rx={6} fill="#FBF6E6" /> }], { z: [1.35, 1.45], c0: [1000, 470] }), html: (t, a) => Q(t, a + 1.0, "Lahmacunu sen yapacaksın. Ben göstereceğim.", 820, YEL, 52) },
  { c: "Bir hafta bedava", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["1 hafta\nbedava", "Beğenmezsen\n0 ₺"], H.green)) },
  { c: "Dayın omuz", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 900, s: 1.15, talk: true, arms: "cross", look: 0.2, mouth: "tight" }], { z: [1.35, 1.42], c0: [900, 470] }), html: (t, a) => Q(t, a + 1.4, "Ama müşterime dokunma.", 820, RED, 64) },
  { c: "O gece kardeşinin", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0.4, kardes: true, screen: <AiSohbet t={t} a={a} q="Lahmacun salonu için menü yaz" ans={["Ramazan Usta'nın taş fırınından", "çıtır lahmacun, kıymalı pide…"]} /> }) },
  { c: "Yapay zekaya menüyü", tone: "night", r: (t, a, b) => lap(t, a, b, <AiSohbet t={t} a={a - 0.8} q="Lahmacun salonu için menü yaz" ans={["Ramazan Usta'nın taş fırınından", "çıtır lahmacun, kıymalı pide,", "bol limonlu, bol maydanozlu.", "#bornova #lahmacun #taşfırın"]} />, ROOMBG(t)) },
  { c: "Bir de resim", tone: "night", r: (t, a, b) => lap(t, a, b, <ResimUret t={t} a={a} prompt="taş fırında çıtır lahmacun" reveal={9} />, ROOMBG(t), { z: [1.05, 1.15], c0: [960, 330] }) },
  { c: "Ekrana bir lahmacun", tone: "night", r: (t, a, b) => lap(t, a, b, <ResimUret t={t} a={a - 3} prompt="taş fırında çıtır lahmacun" reveal={2.6} />, ROOMBG(t), { z: [1.1, 1.3], c0: [960, 560] }), sfx: "ding" },
  { c: "Kenarları altın", r: (t, a, b) => lahPlate(t, a, b, true, { z: [1.1, 1.45], c0: [960, 560], c1: [1200, 620] }) },
  { c: "Gerçeğinden güzel", r: (t, a, b) => lahPlate(t, a, b, true, { z: [1.5, 1.6], c0: [900, 500] }), html: (t, a) => <Big t={t} at={a + 0.2} text="Gerçeğinden güzel." y={80} size={80} c={YEL} /> },
  { c: "Bu fotoğrafı aklında", tone: "cool", r: (t, a, b) => lahPlate(t, a, b, true, { z: [1.2, 1.0] }), html: (t, a) => <Big t={t} at={a + 0.3} text="Bu fotoğrafı aklında tut" y={860} size={66} c={YEL} /> },
  { c: "Bu ay bir sabah", tone: "cool", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 960, s: 1.2, look: 0, eyes: "half", mouth: "tight", brow: "worry" }], { z: [1.4, 1.5], c0: [960, 460], fire: 0.4 }), sfx: "drone" },
  { c: "İlk hafta paylaşımlar", r: (t, a, b) => ph(t, a, b, <InstaProfil name="ramazanusta.lahmacun" followers={Math.round(lp(212, 290, rp(t, a, b)))} posts={12} k={1} last="♥ 30–40 beğeni" />, LAHBG(t), { light: true }) },
  { c: "Fena değil", r: (t, a, b) => lah(t, a, b, [{ o: SEN24, x: 1100, s: 0.95, arms: "phone", lookY: 0.3, mouth: "flat" }], { queue: 1, z: [1.15, 1.2] }) },
  { c: "Sonra bir sabah", tone: "warm", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 760, s: 0.95, arms: "hold", look: 0.2, mouth: "smile" }, { o: SEN24, x: 1350, s: 0.9, arms: "phone", look: -0.5 }], { dawn: true, extra: <Hamur x={760} y={560} s={0.55} t={t} /> }) },
  { c: "15 saniye", r: (t, a, b) => board(t, a, b, <Hamur x={960} y={620} s={1.6} t={t} />, { bg: "#2A1408", z: [1.0, 1.1] }), html: (t, a) => <Big t={t} at={a + 0.2} text="15 saniye" y={80} size={80} /> },
  { c: "Hiçbir yapay zeka", r: (t, a, b) => fa(t, a, b, { z: [1.1, 1.25], c0: [960, 760] }) },
  { c: "Sadece ateş", r: (t, a, b) => fa(t, a, b, { lah: false, z: [1.3, 1.45], c0: [960, 900] }), html: (t, a) => <Big t={t} at={a + 0.3} text="Ateş · hamur · usta elleri" y={80} size={60} c={YEL} /> },
  { c: "Akşam o video", r: (t, a, b) => ph(t, a, b, viral(t, a), LAHBG(t)), sfx: "ding" },
  { c: "Dükkanın telefonu", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 900, s: 1.0, arms: "phone", talk: true, mouth: "smile", eyes: "wide" }], { queue: 7, z: [1.1, 1.18] }), html: (t, a) => <div style={{ position: "absolute", inset: 0 }}><svg width={1920} height={1080}><Notif x={1500} y={80} app="Telefon" title="Cevapsız arama (7)" body="Paket servis…" k={rp(t, a + 0.3, a + 0.8)} /></svg></div> },
  { c: "Dayın akşam kasayı", tone: "night", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 760, s: 1.0, look: 0.4, arms: "cross" }, { o: SEN24, x: 1300, s: 0.95, look: -0.4 }], { night: true, fire: 0.3 }) },
  { c: "Ne kadar istiyorsun", tone: "night", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 900, s: 1.2, talk: true, look: 0.2 }], { night: true, fire: 0.3, z: [1.35, 1.42], c0: [900, 470] }), html: (t, a) => Q(t, a + 0.2, "Ne kadar istiyorsun?") },
  { c: ["Sen 4000", "Sen dört bin"], tone: "night", r: (t, a, b) => lah(t, a, b, [{ o: SEN24, x: 1000, s: 1.2, talk: true, look: -0.2, brow: "up" }], { night: true, fire: 0.3, z: [1.35, 1.42], c0: [1000, 470] }), html: (t, a) => <Big t={t} at={a + 0.5} text="4.000 ₺?" y={80} size={90} /> },
  { c: ["3000 akraba", "Üç bin akraba"], tone: "night", r: (t, a, b) => board(t, a, b, <><Tomar x={760} y={600} s={1.6} rot={-8} n={6} /><g transform={`translate(${lp(1500, 1150, rp(t, a + 1, a + 2.4))},620)`}><Tomar x={0} y={0} s={1.2} rot={12} n={3} /></g></>, { bg: "#2A241D", z: [1.0, 1.1] }), html: (t, a) => <><Big t={t} at={a + 0.2} text="3.000 ₺" sub="akraba indirimi" y={80} size={100} c={GRN} /></>, sfx: "ding" },
  { c: "İlk paran", r: (t, a, b) => board(t, a, b, LED([["Ramazan dayı", "3.000"]], rp(t, a, a + 1), 0, "Ay sonu defteri"), { bg: "#2A241D" }) },
  // 2:57 · dükkân dükkân
  { c: "Ertesi hafta", r: (t, a, b) => oda(t, a, b, { lamp: 1, screen: <g><rect width={1000} height={625} fill="#FFF" />{tx(500, 120, "ESNAFA YAPAY ZEKA HİZMETİ", 44, "#22324A", 800, "middle")}{["Menü", "Paylaşım", "Randevu mesajları", "Ürün fotoğrafı"].map((s, i) => <g key={i}>{tx(160, 230 + i * 80, "✓ " + s, 40, "#333", 600)}</g>)}</g> }), html: (t, a) => <Big t={t} at={a + 1.0} text="Özgüven: tavan" y={80} size={66} c={GRN} /> },
  { c: "Esnafa yapay zeka hizmeti", r: (t, a, b) => sok(t, a, b, [{ o: SEN24, x: 900, y: 1100, s: 0.85, arms: "hold", hold: <rect x={-50} y={-70} width={100} height={140} rx={6} fill="#FBF6E6" />, look: 0.4 }]), html: (t, a) => <AgeTag t={t} at={a + 2.5} age="Alsancak" place="dükkân dükkân" /> },
  { c: ["dükkan dükkan geziyorsun", "dükkân dükkân geziyorsun"], r: (t, a, b) => sok(t, a, b, [{ o: SEN24, x: lp(300, 1500, rp(t, a, b)), y: 1100, s: 0.85, look: 0.6, arms: "hold", hold: <rect x={-50} y={-70} width={100} height={140} rx={6} fill="#FBF6E6" /> }], { z: [1.0, 1.05] }) },
  { c: "Birinci dükkân", r: (t, a, b) => sok(t, a, b, [{ o: KASAP, x: 600, y: 1100, s: 0.85, arms: "cross", look: 0.4, talk: true }, { o: SEN24, x: 1200, y: 1100, s: 0.85, look: -0.4 }], { z: [1.1, 1.15] }), html: (t, a) => Q(t, a + 0.3, "Yeğenim yapıyor.", 840, YEL, 60) },
  { c: "İkinci dükkân", r: (t, a, b) => sok(t, a, b, [{ o: MUSTERI_K, x: 600, y: 1100, s: 0.85, arms: "cross", look: 0.4, talk: true }, { o: SEN24, x: 1200, y: 1100, s: 0.85, look: -0.4 }], { z: [1.1, 1.15], c0: [700, 560] }), html: (t, a) => Q(t, a + 0.4, "Instagram'a ihtiyacım yok.", 840, YEL, 60) },
  { c: "Üçüncüsü", r: (t, a, b) => cam(t, a, b, <DukkanHarita t={t} a={a - 1} yes={99} />, {}, [1.0, 1.08]), sfx: "knock" },
  { c: "Bir kasap", r: (t, a, b) => sok(t, a, b, [{ o: KASAP, x: 800, y: 1100, s: 1.0, lookY: 0.3, arms: "hold", hold: <rect x={-50} y={-70} width={100} height={140} rx={6} fill="#FBF6E6" /> }, { o: SEN24, x: 1400, y: 1100, s: 0.9, look: -0.4, mouth: "smile" }], { z: [1.15, 1.2] }) },
  { c: "Bu yapay zeka benim", r: (t, a, b) => sok(t, a, b, [{ o: KASAP, x: 900, y: 1100, s: 1.25, talk: true, look: 0.2, brow: "angry" }], { z: [1.4, 1.5], c0: [900, 470] }), html: (t, a) => Q(t, a + 0.2, "Benim yerime et de keser mi?") },
  { c: "Gülüyorsun", r: (t, a, b) => sok(t, a, b, [{ o: SEN24, x: 700, y: 1100, s: 1.0, mouth: "grin", look: 0.4 }, { o: KASAP, x: 1300, y: 1100, s: 1.0, mouth: "flat", arms: "cross", look: -0.4 }], { z: [1.15, 1.22] }) },
  { c: "On dört dükkâna", r: (t, a, b) => cam(t, a, b, <DukkanHarita t={t} a={a} />, {}, [1.0, 1.08]), html: (t, a) => <Big t={t} at={a + 1.8} text="14 dükkân · 13 hayır" y={70} size={76} c={RED} />, sfx: "tick" },
  { c: "Akşam eve dönerken", tone: "night", r: (t, a, b) => ph(t, a, b, <Adimsayar t={t} a={a} />, <Sokak t={t} night signs={["KASAP", "KUAFÖR", "BUTİK"]} />) },
  // 3:34 · kuaför
  { c: "On dördüncü", r: (t, a, b) => kua(t, a, b, [{ o: GELIN, x: 960, s: 0.85, look: 0, eyes: "half" }, { o: NUR, x: 1300, s: 0.95, arms: "hold", look: -0.4, talk: true }]), sfx: "ding" },
  { c: "Nur abla", r: (t, a, b) => kua(t, a, b, [{ o: NUR, x: 960, s: 1.1, arms: "phone", talk: true, look: 0.2 }], { z: [1.25, 1.32], c0: [960, 520] }), html: (t, a) => <AgeTag t={t} at={a + 0.2} age="Nur abla" place="Kuaför · telefonu hiç susmuyor" /> },
  { c: "Telefonu hiç", r: (t, a, b) => kua(t, a, b, [{ o: GELIN, x: 760, s: 0.85, eyes: "closed" }, { o: NUR, x: 1100, s: 0.95, arms: "phone", look: -0.3, brow: "worry" }], { z: [1.1, 1.18] }) },
  { c: "Bana bir şey", r: (t, a, b) => kua(t, a, b, [{ o: NUR, x: 900, s: 1.2, talk: true, look: 0.2 }], { z: [1.35, 1.42], c0: [900, 470] }), html: (t, a) => Q(t, a + 1.6, "WhatsApp'a cevap yetiştiremiyorum.") },
  { c: "Kuruyorsun", r: (t, a, b) => ph(t, a, b, <DM name="Kuaför Nur" msgs={[{ text: "Cumartesi müsait misiniz?" }, { me: true, text: "Merhaba! Cumartesi 09:00, 11:30 ve 13:00 boş. Hangisi uygun? 😊" }, { text: "11:30 olsun" }, { me: true, text: "Randevunuz yazıldı ✓" }]} k={rp(t, a + 0.3, b - 0.3)} />, <Kuafor t={t} />) },
  { c: ["Nur abla ayda", "Nur Abla ayda"], r: (t, a, b) => board(t, a, b, LED([["Ramazan dayı", "3.000"], ["Nur abla", "6.000"]], 1 + rp(t, a, a + 1), 1, "Ay sonu defteri"), { bg: "#2A241D" }), sfx: "ding" },
  { c: "Üç gün sonra", tone: "cool", r: (t, a, b) => ph(t, a, b, call("Nur abla", "arıyor…"), ROOMBG(t)), html: (t, a) => <Big t={t} at={a + 0.4} text="Cumartesi · 09:40" y={80} size={66} />, sfx: "buzz" },
  { c: "Nur abla bağırıyor", tone: "cool", r: (t, a, b) => kua(t, a, b, [{ o: NUR, x: 960, s: 1.2, arms: "phone", talk: true, brow: "angry", mouth: "open" }], { chaos: true, z: [1.35, 1.45], c0: [960, 470] }) },
  { c: "Salonda iki gelin", tone: "cool", r: (t, a, b) => kua(t, a, b, [{ o: GELIN, x: 560, s: 0.9, look: 0.4, brow: "angry" }, { o: { ...GELIN, hair: "#7A4B2A" }, x: 1360, s: 0.9, look: -0.4, brow: "angry" }], { chaos: true }) },
  { c: ["İkisi de saat 10", "İkisi de saat on"], tone: "cool", r: (t, a, b) => ph(t, a, b, <RandevuEkran k={1} clash t={t} />, <Kuafor t={t} chaos />, { light: true, z: [1.2, 1.35], c0: [960, 440] }), sfx: "buzz" },
  { c: "Çünkü yapay zeka ikisine", tone: "cool", r: (t, a, b) => ph(t, a, b, <RandevuEkran k={1} clash t={t} />, <Kuafor t={t} chaos />, { light: true, z: [1.6, 1.7], c0: [960, 450] }), html: (t, a) => <Big t={t} at={a + 0.5} text="Aynı saat · iki gelin" y={80} size={70} c={RED} /> },
  { c: "Koşa koşa", tone: "cool", r: (t, a, b) => sok(t, a, b, [{ o: SEN24, x: lp(400, 1300, rp(t, a, b)), y: 1100, s: 0.85, look: 0.6, mouth: "open", brow: "worry" }], { z: [1.0, 1.05] }) },
  { c: "Gelinlerden birinin", tone: "cool", r: (t, a, b) => kua(t, a, b, [{ o: { ...MUSTERI_K, scarf: "#8E4B6B" }, x: 700, s: 1.0, look: 0.4, arms: "cross", mouth: "tight" }, { o: SEN24, x: 1300, s: 0.95, look: -0.4, eyes: "wide", brow: "worry" }], { z: [1.15, 1.2] }) },
  { c: "O gün Nur abla", r: (t, a, b) => kua(t, a, b, [{ o: NUR, x: 760, s: 0.95, arms: "hold", look: 0.3 }, { o: SEN24, x: 1350, s: 0.9, arms: "hold", hold: <TeaGlass x={0} y={0} s={1.2} t={t} />, look: -0.3 }]), html: (t, a) => <Big t={t} at={a + 2.5} text="Bütün gün: çay + elle randevu" y={80} size={58} c={YEL} /> },
  { c: "Akşam Nur abla", r: (t, a, b) => kua(t, a, b, [{ o: NUR, x: 900, s: 1.2, look: 0.2, arms: "cross" }], { z: [1.35, 1.42], c0: [900, 470] }) },
  { c: "Makine yanlış", r: (t, a, b) => kua(t, a, b, [{ o: NUR, x: 900, s: 1.25, talk: true, look: 0.2, brow: "flat" }], { z: [1.45, 1.55], c0: [900, 450] }), html: (t, a) => Q(t, a + 2.4, "Bir daha olursa, yanlışı sen yapmış olursun.", 820, RED, 52) },
  { c: "Ve o gün en önemli", r: (t, a, b) => board(t, a, b, cards(t, a + 2.6, ["YZ işi\nyapar", "Sorumluluk\nsende"], YEL)), html: (t, a) => <Big t={t} at={a + 0.4} text="1. ders" y={80} size={76} c={GRN} /> },
  // 4:36 · butik
  { c: "Sorumluluk hep sende", r: (t, a, b) => kua(t, a, b, [{ o: SEN24, x: 960, s: 1.2, look: 0, mouth: "tight", brow: "worry" }], { z: [1.35, 1.42], c0: [960, 470] }), html: (t, a) => <Big t={t} at={a + 0.2} text="Sorumluluk hep sende." y={80} size={70} c={YEL} /> },
  { c: "Ayın ikinci haftası", r: (t, a, b) => board(t, a, b, cal(t, a, "KASIM", "2. hafta")), sfx: "tick" },
  { c: ["Al sancakta", "Alsancak'ta"], r: (t, a, b) => but(t, a, b, [{ o: SELIN, x: 960, s: 0.95, look: 0.1, mouth: "smile", talk: true }], { kara: true }), html: (t, a) => <AgeTag t={t} at={a + 0.5} age="Selin hanım" place="Butik · Alsancak" /> },
  { c: ["Karacuma için", "Kara Cuma için"], r: (t, a, b) => but(t, a, b, [{ o: SELIN, x: 1100, s: 1.0, talk: true, look: -0.3 }], { kara: true, z: [1.1, 1.3], c0: [400, 420] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Kara Cuma · 27 Kasım" y={80} size={70} c={YEL} /> },
  { c: "400 kişilik", r: (t, a, b) => ph(t, a, b, <WaListe t={t} a={a} n={400} />, <Butik t={t} kara />) },
  { c: "Gece yarısı herkese", r: (t, a, b) => board(t, a, b, cards(t, a + 0.3, ["00:00\nlink", "40 ürün\nfoto + yazı"], YEL)) },
  { c: "12 bin lira", r: (t, a, b) => but(t, a, b, [{ o: SELIN, x: 760, s: 1.0, look: 0.4, talk: true }, { o: SEN24, x: 1350, s: 0.95, look: -0.4, mouth: "grin" }], { kara: true }), html: (t, a) => <Big t={t} at={a + 0.1} text="12.000 ₺" y={80} size={100} c={GRN} /> },
  { c: "Sen evet derken", r: (t, a, b) => but(t, a, b, [{ o: SELIN, x: 960, s: 1.2, look: 0, brow: "up" }], { kara: true, z: [1.35, 1.42], c0: [960, 470] }) },
  { c: "Fatura kesiyor", r: (t, a, b) => but(t, a, b, [{ o: SELIN, x: 960, s: 1.3, talk: true, look: 0.1 }], { kara: true, z: [1.5, 1.6], c0: [960, 450] }), html: (t, a) => Q(t, a + 0.1, "Fatura kesiyor musun?", 820, RED, 72), sfx: "boom" },
  { c: "Kesmiyorsun", r: (t, a, b) => but(t, a, b, [{ o: SEN24, x: 960, s: 1.2, eyes: "wide", mouth: "tight", brow: "worry" }], { kara: true, z: [1.35, 1.42], c0: [960, 470] }) },
  { c: "Ertesi gün bir mali", r: (t, a, b) => mus(t, a, b, [{ o: MUSAVIR, x: 760, s: 0.95, look: 0.4, talk: true }, { o: SEN24, x: 1250, s: 0.9, look: -0.4 }]), html: (t, a) => <AgeTag t={t} at={a + 0.5} age="Mali müşavir" place="Bornova" /> },
  { c: "Aylık muhasebe", r: (t, a, b) => mus(t, a, b, [{ o: MUSAVIR, x: 900, s: 1.2, talk: true, look: 0.2 }], { z: [1.35, 1.42], c0: [900, 470] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Muhasebe: 3.600 ₺ / ay" y={80} size={70} c={YEL} /> },
  { c: "Sonra mali müşavir", r: (t, a, b) => mus(t, a, b, [{ o: MUSAVIR, x: 900, s: 1.2, talk: true, mouth: "smile", look: 0.2 }], { z: [1.3, 1.38], c0: [900, 480] }) },
  { c: ["29 yaşından", "Yirmi dokuz yaşından"], r: (t, a, b) => board(t, a, b, <VergiLevhasi k={rp(t, a, a + 0.6)} />, { bg: "#2A241D", z: [1.0, 1.08] }) },
  { c: "Genç girişimci", r: (t, a, b) => board(t, a, b, <VergiLevhasi />, { bg: "#2A241D", z: [1.2, 1.35], c0: [960, 760] }), html: (t, a) => <Big t={t} at={a + 0.3} text="Genç girişimci istisnası" y={80} size={70} c={GRN} /> },
  { c: ["3 yıl boyunca", "Üç yıl boyunca"], r: (t, a, b) => board(t, a, b, sum(t, a + 0.3, [["3 yıl", "gelir vergisi yok"], ["Yılda", "400.000 ₺'ye kadar"]]), { bg: "#0E2418" }), sfx: "ding" },
  { c: "Sevinçten neredeyse", r: (t, a, b) => mus(t, a, b, [{ o: SEN24, x: 1250, s: 0.95, mouth: "grin", eyes: "wide", look: -0.4 }, { o: MUSAVIR, x: 700, s: 0.95, look: 0.4, mouth: "tight" }]) },
  { c: ["Ama Bağkur", "Ama Bağ-Kur"], r: (t, a, b) => mus(t, a, b, [{ o: MUSAVIR, x: 900, s: 1.25, talk: true, look: 0.2, brow: "worry" }], { z: [1.45, 1.55], c0: [900, 450] }), html: (t, a) => Q(t, a + 0.1, "Ama Bağ-Kur var.", 820, RED, 72), sfx: "boom" },
  { c: "Eskiden ilk yıl", tone: "cool", r: (t, a, b) => board(t, a, b, cards(t, a + 0.3, ["Eskiden:\n1 yıl devlet öder", "2026:\ndestek kalktı"], H.red)) },
  { c: "Kaç para", tone: "cool", r: (t, a, b) => board(t, a, b, <g />, { bg: "#1A0E0E" }), html: (t, a) => <Counter t={t} a={a + 1.2} from={0} to={11800} label="₺ · Bağ-Kur, her ay" y={330} c={RED} /> },
  { c: "Bu sayıyı aklında", tone: "cool", r: (t, a, b) => mus(t, a, b, [{ o: SEN24, x: 960, s: 1.2, slump: 0.4, eyes: "half", mouth: "sad" }], { z: [1.35, 1.42], c0: [960, 470] }), html: (t, a) => <Big t={t} at={a + 0.3} text="Bu sayıyı aklında tut" y={80} size={66} c={YEL} /> },
  { c: "Ama geri dönüş", r: (t, a, b) => board(t, a, b, <VergiLevhasi />, { bg: "#2A241D", z: [1.0, 1.06] }), sfx: "knock" },
  { c: "İşte yapay zekanın", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0.5, screen: <UrunListe t={t} a={a} /> }) },
  { c: "Kırk ürünün", tone: "night", r: (t, a, b) => lap(t, a, b, <UrunListe t={t} a={a - 3.5} />, ROOMBG(t)), html: (t, a) => <Big t={t} at={a + 1.5} text="Eskiden: 2 gün" y={80} size={66} /> },
  { c: "Kumaşı, bedeni", tone: "night", r: (t, a, b) => lap(t, a, b, <UrunListe t={t} a={a} />, ROOMBG(t), { z: [1.05, 1.15] }), html: (t, a) => <Big t={t} at={a + 2.5} text="Yapay zeka: 20 dakika" y={80} size={66} c={GRN} /> },
  { c: "Sen sadece okuyup", tone: "night", r: (t, a, b) => lap(t, a, b, <UrunListe t={t} a={a - 5} />, ROOMBG(t), { z: [1.15, 1.2], c0: [960, 500] }) },
  { c: ["Bir elbiseye", "Bir elbise"], tone: "night", r: (t, a, b) => lap(t, a, b, <UrunListe t={t} a={a - 5} fixes />, ROOMBG(t), { z: [1.4, 1.55], c0: [960, 560] }), html: (t, a) => <Big t={t} at={a + 1.4} text="Kasım'da yazlık? ✗" y={80} size={66} c={RED} /> },
  { c: "Bir pantolona", tone: "night", r: (t, a, b) => lap(t, a, b, <UrunListe t={t} a={a - 5} />, ROOMBG(t), { z: [1.3, 1.4], c0: [960, 420] }) },
  { c: "Ama o hafta evde", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0.4, kardes: true, screen: <UrunListe t={t} a={a - 5} /> }), html: (t, a) => <Big t={t} at={a + 0.4} text="Evde bir savaş" y={80} size={66} c={YEL} /> },
  { c: "Kardeşinin perşembe", tone: "night", r: (t, a, b) => board(t, a, b, cal(t, a, "PERŞEMBE", "YKS", "deneme sınavı")), html: (t, a) => <Big t={t} at={a + 2.6} text="Laptop: 02:00'ye kadar sende" y={860} size={56} c={YEL} /> },
  { c: "Bir gece annen", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0.3, kardes: true, who: [{ o: ANNE, x: 480, y: 1080, s: 0.95, look: 0.5, lookY: 0.1 }, { o: SEN24_EV, x: 960, y: 1080, s: 0.95, arms: "type", look: 0.6 }] }) },
  { c: "Kardeşin uyuyamamış", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0.3, kardes: true, who: [], z: [1.4, 1.55], c0: [260, 760] }) },
  { c: "Annen hiçbir şey", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0.3, who: [{ o: ANNE, x: 900, y: 1080, s: 1.15, look: 0.3, mouth: "flat", eyes: "half" }], z: [1.3, 1.4], c0: [900, 470] }) },
  { c: "Sadece laptopun", tone: "night", r: (t, a, b) => board(t, a, b, <><g transform={`translate(960,${lp(520, 700, rp(t, a + 0.5, a + 2.5))}) scale(1,${lp(1, 0.08, rp(t, a + 0.5, a + 2.5))})`}><Laptop x={0} y={0} s={1.0} t={t}><UrunListe t={t} a={a - 5} /></Laptop></g><TeaGlass x={1450} y={880} s={2.4} t={t} /></>, { bg: "#1A1712", z: [1.0, 1.1] }) },
  { c: "O gece işi mutfak", tone: "night", r: (t, a, b) => ev(t, a, b, [{ o: SEN24_EV, x: 960, s: 1.0, arms: "phone", lookY: 0.3, eyes: "half" }], { extra: <TeaGlass x={1250} y={900} s={1.4} t={t} /> }), html: (t, a) => <Big t={t} at={a + 1.0} text="Mutfak masası · telefon ekranı" y={80} size={58} /> },
  // 6:32 · fırın
  { c: "Aynı hafta iki iş", r: (t, a, b) => fir(t, a, b, [{ o: HUSEYIN, x: 960, s: 0.95, look: 0.1, arms: "cross" }], { dawn: true }) },
  { c: ["Karşıyaka'da", "Karşıyakada"], r: (t, a, b) => fir(t, a, b, [{ o: HUSEYIN, x: 960, s: 0.95, look: 0.2 }], { z: [1.1, 1.25], c0: [960, 300] }), html: (t, a) => <AgeTag t={t} at={a + 1.6} age="Hüseyin amca" place="70 yaşında · telefonu tuşlu" /> },
  { c: "Parayı zarfta", r: (t, a, b) => board(t, a, b, <Zarf x={960} y={580} s={1.6} rot={-4} label="Evlat" fill={0.6} />, { bg: "#5A3A22", z: [1.0, 1.1] }) },
  { c: "Benim Instagram'la", r: (t, a, b) => fir(t, a, b, [{ o: HUSEYIN, x: 900, s: 1.2, talk: true, look: 0.2, brow: "angry" }], { z: [1.35, 1.42], c0: [900, 470] }), html: (t, a) => Q(t, a + 2.0, "Yeni şubeme kimse gelmiyor. Onu çöz.", 820, YEL, 54) },
  { c: "Haritada bakıyorsun", r: (t, a, b) => ph(t, a, b, <IsletmeKart closed />, <Firin t={t} />, { light: true }) },
  { c: "Eski şube ise", r: (t, a, b) => ph(t, a, b, <IsletmeKart closed name="Hüseyin Fırını · Şube 1" />, <Firin t={t} />, { light: true, z: [1.5, 1.6], c0: [960, 620] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Kalıcı olarak kapandı?!" y={80} size={70} c={RED} />, sfx: "buzz" },
  { c: "Yani insanlar fırını", r: (t, a, b) => board(t, a, b, cards(t, a + 0.3, ["Müşteri\narıyor", "İnternet:\n«kapandı»"], H.red)) },
  { c: ["3 şubenin", "Üç şubenin"], r: (t, a, b) => ph(t, a, b, <IsletmeKart closed fixed={rp(t, a + 0.6, a + 1.4)} name="Hüseyin Fırını · Şube 1" />, <Firin t={t} />, { light: true, z: [1.3, 1.4], c0: [960, 620] }), sfx: "ding" },
  { c: ["Sabah 6'da", "Sabah altıda"], r: (t, a, b) => fir(t, a, b, [{ o: SEN24, x: 1300, s: 0.9, arms: "phone", look: -0.4 }, { o: HUSEYIN, x: 600, s: 0.95, look: 0.4 }], { dawn: true }), html: (t, a) => <Big t={t} at={a + 0.2} text="06:00" y={80} size={80} /> },
  { c: "İlk paylaşıma", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#FFF" /><svg x={0} y={80} width={360} height={360} viewBox="0 0 360 360"><rect width={360} height={360} fill="#E8D2AE" /><g transform="translate(180,180) scale(0.9)"><Gevrek x={0} y={0} /></g></svg>{tx(20, 490, "Taze simit, sıcak sıcak!", 22, "#111", 700)}{t > 0 && <line x1={20} x2={150} y1={484} y2={484} stroke="#C0392B" strokeWidth={4} opacity={rp(t, 0, 1)} />}</g>, <Firin t={t} />, { light: true }) },
  { c: "Hüseyin amca kaşlarını", r: (t, a, b) => fir(t, a, b, [{ o: HUSEYIN, x: 900, s: 1.25, talk: true, brow: "angry", look: 0.2 }], { z: [1.4, 1.5], c0: [900, 460] }), html: (t, a) => Q(t, a + 1.6, "Burası İzmir. Simit yok, gevrek var.", 820, YEL, 56) },
  { c: "Düzeltiyorsun", r: (t, a, b) => board(t, a, b, <Gevrek x={960} y={560} s={2.4} />, { bg: "#E8D2AE", z: [1.0, 1.15] }), html: (t, a) => <Big t={t} at={a + 0.2} text="GEVREK ✓" y={80} size={90} c="#5A3A22" /> },
  { c: "Sıcak gevreklerin", r: (t, a, b) => fir(t, a, b, [], { dawn: true, z: [1.3, 1.5], c0: [960, 760] }) },
  { c: "Gerçek fotoğraf", r: (t, a, b) => fir(t, a, b, [{ o: SEN24, x: 960, s: 1.05, arms: "phone", lookY: -0.1, mouth: "smile" }], { z: [1.2, 1.3] }), html: (t, a) => <Big t={t} at={a + 0.2} text="Gerçek fotoğraf." y={80} size={76} c={GRN} /> },
  { c: "Yapay zekaya sadece", r: (t, a, b) => lap(t, a, b, <AiSohbet t={t} a={a} q="Fırın için sabah menüsü ve saatler" ans={["06:00 · Sıcak gevrek, poğaça", "07:00 · Boyoz + çay", "3 şube · haritada yol tarifi"]} />, <Firin t={t} />) },
  { c: "İki hafta sonra", r: (t, a, b) => board(t, a, b, <YolGrafik t={t} a={a} />, { bg: "#E8EEF2", z: [1.0, 1.06] }), sfx: "tick" },
  { c: "Hüseyin amca sana", r: (t, a, b) => fir(t, a, b, [{ o: HUSEYIN, x: 700, s: 1.0, arms: "hold", hold: <Zarf x={0} y={0} s={0.35} label="" fill={0.6} />, look: 0.4, mouth: "smile" }, { o: SEN24, x: 1300, s: 0.95, look: -0.4 }]) },
  { c: "İçinde sekiz", r: (t, a, b) => board(t, a, b, <Zarf x={960} y={600} s={1.8} rot={-3} label="Evlat" amount="8.000 ₺" fill={1} />, { bg: "#5A3A22", z: [1.0, 1.12] }), sfx: "ding" },
  { c: "Sen yine de", r: (t, a, b) => board(t, a, b, <><Tomar x={760} y={620} s={1.6} rot={-6} n={8} /><Tomar x={1200} y={640} s={1.2} rot={10} n={Math.round(lp(1, 8, rp(t, a, b)))} /></>, { bg: "#2A241D", z: [1.05, 1.15] }), html: (t, a) => <Big t={t} at={a + 1.5} text="Doğru çıkıyor ✓" y={80} size={70} c={GRN} /> },
  { c: "Ve mahallenin berberi", r: (t, a, b) => ber(t, a, b, [{ o: MURAT, x: 900, s: 1.0, mouth: "grin", look: 0.3 }]), html: (t, a) => <AgeTag t={t} at={a + 0.4} age="Murat" place="mahallenin berberi" /> },
  { c: "Murat sırtına", r: (t, a, b) => ber(t, a, b, [{ o: MURAT, x: 900, s: 1.2, talk: true, mouth: "grin", arms: "wave", look: 0.2 }], { z: [1.35, 1.42], c0: [900, 470] }), html: (t, a) => Q(t, a + 1.4, "Dört bin. Ay sonu veririm kardeşim.") },
  { c: ["Kağıt yok", "Kâğıt yok"], r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["Kâğıt:\nyok", "İmza:\nyok"], H.red)) },
  { c: "Bu cümleyi de", tone: "cool", r: (t, a, b) => ber(t, a, b, [{ o: MURAT, x: 960, s: 1.2, mouth: "smile", look: 0 }], { z: [1.4, 1.5], c0: [960, 460] }), html: (t, a) => <Big t={t} at={a + 0.2} text="Bu cümleyi aklında tut" y={80} size={66} c={YEL} /> },
  // 7:48 · tek yıldız
  { c: "Sonra o sabah", tone: "cool", r: (t, a, b) => ph(t, a, b, call("Dayım"), ROOMBG(t)), sfx: "buzz" },
  { c: "Sesi hiç bu kadar", tone: "cool", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 960, s: 1.15, arms: "phone", eyes: "half", mouth: "tight" }], { fire: 0.3, z: [1.3, 1.4], c0: [960, 480] }), html: (t, a) => Q(t, a + 2.0, "Dükkâna gel.", 820, YEL, 70) },
  { c: "Dayının telefonunda", tone: "cool", r: (t, a, b) => ph(t, a, b, <HaritaYorum text={[]} k={0} />, LAHBG(t), { light: true }) },
  { c: "Tek yıldız", tone: "cool", r: (t, a, b) => ph(t, a, b, <HaritaYorum text={["Fotoğraftaki lahmacunla gelen", "arasında hiçbir alaka yok.", "Bu düpedüz kandırmaca."]} k={rp(t, a, a + 0.5)} />, LAHBG(t), { light: true, z: [1.3, 1.4], c0: [960, 360] }), sfx: "boom" },
  { c: "Altında başka", tone: "cool", r: (t, a, b) => ph(t, a, b, <HaritaYorum text={["Fotoğraftaki lahmacunla gelen", "arasında hiçbir alaka yok.", "Bu düpedüz kandırmaca."]} extra={Math.round(lp(0, 3, rp(t, a, a + 2)))} />, LAHBG(t), { light: true, z: [1.2, 1.3], c0: [960, 640] }) },
  { c: ["Instagram'da fotoğrafın", "Instagram da fotoğrafın"], tone: "cool", r: (t, a, b) => ph(t, a, b, <AiEtiket k={rp(t, a + 1.5, a + 2.2)} t={t} />, LAHBG(t), { z: [1.2, 1.5], c0: [960, 560], c1: [880, 760] }) },
  { c: ["Dayın 30", "Dayın otuz"], tone: "cool", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 960, s: 1.2, eyes: "half", mouth: "sad", lookY: 0.3 }], { fire: 0.3, z: [1.35, 1.45], c0: [960, 470] }), html: (t, a) => <Big t={t} at={a + 2.0} text="30 yılda bir kez bile «kandırmacı» denmedi" y={80} size={50} c={YEL} /> },
  { c: "Sana bakıyor", tone: "cool", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 960, s: 1.35, look: 0.3, mouth: "flat", brow: "worry" }], { fire: 0.3, z: [1.6, 1.75], c0: [960, 430] }), sfx: "drone" },
  { c: "O gece bütün", tone: "night", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#FFF" />{tx(180, 120, "Gönderi silinsin mi?", 22, "#111", 700, "middle")}<rect x={40} y={170} width={280} height={56} rx={12} fill="#ED4956" />{tx(180, 206, `Sil (${Math.round(lp(9, 0, rp(t, 0, 99999)))})`, 20, "#FFF", 700, "middle")}</g>, ROOMBG(t), { light: true }), sfx: "pop" },
  { c: ["Sabah 5'te", "Sabah beşte"], tone: "warm", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 700, s: 0.95, arms: "hold", look: 0.3 }, { o: SEN24, x: 1300, s: 0.9, arms: "phone", look: -0.4 }], { dawn: true, extra: <Hamur x={700} y={560} s={0.5} t={t} /> }), html: (t, a) => <Big t={t} at={a + 0.2} text="05:00" y={80} size={80} /> },
  { c: "Gerçek lahmacunları", r: (t, a, b) => fa(t, a, b, { dawn: true, z: [1.0, 1.15] }) },
  { c: ["Şikayet eden", "Şikâyet eden"], r: (t, a, b) => ph(t, a, b, <DM name="Kerem T." msgs={[{ me: true, text: "Haklısınız, o fotoğraf yapay zekaydı. Özür dileriz." }, { me: true, text: "Sizi dükkâna davet etmek isteriz, ikramımız olsun." }, { text: "Peki, geleceğim." }]} k={rp(t, a + 0.2, b - 0.2)} />, LAHBG(t)) },
  { c: "Onu ve on mahalle", r: (t, a, b) => lah(t, a, b, [{ o: MUSTERI_K, x: 420, s: 0.85, mouth: "smile", look: 0.4 }, { o: DAYI, x: 960, s: 0.95, arms: "hold", hold: <g transform="scale(0.25)"><Lahmacun x={0} y={0} /></g>, mouth: "smile" }, { o: SEN24, x: 1450, s: 0.88, mouth: "smile", look: -0.4 }], { queue: 5 }) },
  { c: "Lahmacunları kendi", r: (t, a, b) => lahPlate(t, a, b, false, { z: [1.0, 1.12] }), html: (t, a) => <Big t={t} at={a + 2.0} text="−1.200 ₺ · kendi cebinden" y={80} size={70} c={RED} /> },
  { c: "Müşteri yorumunu", r: (t, a, b) => ph(t, a, b, <HaritaYorum text={[]} k={0} after />, LAHBG(t), { light: true, z: [1.2, 1.35], c0: [960, 620] }), sfx: "ding" },
  { c: "Dayın bunu okuyunca", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 960, s: 1.25, mouth: "grin", arms: "phone", lookY: 0.2 }], { z: [1.35, 1.45], c0: [960, 470] }) },
  { c: "Ve sen ikinci", r: (t, a, b) => board(t, a, b, cards(t, a + 1.8, ["YZ satışı\nhızlandırır", "Esnaf\nGÜVEN satar"], YEL)), html: (t, a) => <Big t={t} at={a + 0.3} text="2. ders" y={80} size={76} c={GRN} /> },
  { c: "Güveni ise", tone: "cool", r: (t, a, b) => lahPlate(t, a, b, true, { z: [1.0, 1.2], bg: "#120A0A" }), html: (t, a) => <Big t={t} at={a + 0.6} text="Bir fotoğraf, bir gece" y={860} size={60} c={RED} /> },
  // 8:55 · Kara Cuma
  { c: ["Ve Karacuma", "Ve Kara Cuma"], tone: "night", r: (t, a, b) => but(t, a, b, [], { night: true, kara: true, z: [1.0, 1.1] }), html: (t, a) => <Big t={t} at={a + 0.3} text="KARA CUMA GECESİ" y={80} size={76} c={YEL} />, sfx: "boom" },
  { c: "Saat on bir", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0.5, kardes: true, screen: <UrunListe t={t} a={a - 3} to={34} /> }), html: (t, a) => <Big t={t} at={a + 0.2} text="23:00 · 34 / 40 hazır" y={80} size={70} /> },
  { c: "Yazılar yapay", tone: "night", r: (t, a, b) => lap(t, a, b, <UrunListe t={t} a={a - 3} to={34} />, ROOMBG(t), { z: [1.05, 1.12] }) },
  { c: "Kalan 6", tone: "night", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["Kalan:\n6 ürün"], YEL)) },
  { c: ["Saat on biri on iki", "Saat 11'i 12"], tone: "night", r: (t, a, b) => lap(t, a, b, <OdemeHata k={rp(t, a + 1.6, a + 2.0)} t={t} />, ROOMBG(t)), html: (t, a) => <Big t={t} at={a + 0.2} text="23:12" y={70} size={90} c={RED} />, sfx: "buzz" },
  { c: "Ödemeniz alınamadı", tone: "night", r: (t, a, b) => lap(t, a, b, <OdemeHata t={t} />, ROOMBG(t), { z: [1.3, 1.45], c0: [960, 470] }) },
  { c: "Aylık aboneliğin", tone: "night", r: (t, a, b) => board(t, a, b, cal(t, a, "BUGÜN", "27", "abonelik yenileme")) },
  { c: "Ve kartın", tone: "night", r: (t, a, b) => lap(t, a, b, <OdemeHata t={t} />, ROOMBG(t), { z: [1.5, 1.65], c0: [960, 580] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Kart: yurt dışı işlemlere kapalı" y={80} size={58} c={RED} /> },
  { c: "Hesabın ücretsiz", tone: "night", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["Ücretsiz\nsürüm", "Fotoğraf\nhakkı: 0"], H.red)) },
  { c: "Bankanın uygulaması", tone: "night", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#0E2A4A" />{tx(180, 140, "BANKA", 30, "#FFF", 800, "middle")}{tx(180, 260, "SMS şifresini girin", 20, "#CFE0F5", 600, "middle")}{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={40 + i * 48} y={300} width={40} height={56} rx={8} fill="#1C3E66" />)}{tx(180, 440, "Kalan süre: " + Math.max(0, 180 - Math.round((t % 60) * 3)) + " sn", 18, "#FFB3B3", 600, "middle")}</g>, ROOMBG(t)) },
  { c: "Mesaj gelmiyor", tone: "night", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#0E2A4A" />{tx(180, 140, "BANKA", 30, "#FFF", 800, "middle")}{tx(180, 260, "SMS şifresini girin", 20, "#CFE0F5", 600, "middle")}{[0, 1, 2, 3, 4, 5].map((i) => <rect key={i} x={40 + i * 48} y={300} width={40} height={56} rx={8} fill="#1C3E66" />)}{tx(180, 440, "SMS gönderilemedi", 20, "#FF6B6B", 700, "middle")}</g>, ROOMBG(t), { z: [1.3, 1.45], c0: [960, 560] }), sfx: "buzz" },
  { c: ["Kırk sekiz dakika", "48 dakika"], tone: "night", r: (t, a, b) => board(t, a, b, <g />, { bg: "#140A0A" }), html: (t, a) => <Big t={t} at={a + 0.1} text={`00:${String(Math.max(0, 48 - Math.floor((t - a) * 2))).padStart(2, "0")} kaldı`} sub="400 kişi bekliyor" y={330} size={140} c={RED} />, sfx: "tick" },
  { c: "Ve Selin hanım o gece", tone: "night", r: (t, a, b) => ph(t, a, b, <DM name="Selin Hanım" msgs={[{ text: "Her şey yolunda mı?" }]} k={1} typing t={t} />, ROOMBG(t)), sfx: "ding" },
  { c: "Yolunda diye", tone: "night", r: (t, a, b) => ph(t, a, b, <DM name="Selin Hanım" msgs={[{ text: "Her şey yolunda mı?" }, { me: true, text: "Yolunda 👍" }]} k={1} />, ROOMBG(t), { z: [1.2, 1.3] }), html: (t, a) => <Big t={t} at={a + 1.6} text="Yalan." y={80} size={90} c={RED} /> },
  { c: "Sonra hatırlıyorsun", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0.4, who: [{ o: SEN24_EV, x: 760, y: 1080, s: 1.1, look: 0.2, eyes: "wide", brow: "up" }], z: [1.3, 1.4], c0: [760, 480] }) },
  { c: "O gün öğleden", r: (t, a, b) => but(t, a, b, [{ o: SEN24, x: 1250, s: 0.95, arms: "phone", look: -0.4 }], { ring: false, z: [1.0, 1.1] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Öğleden sonra · aynı gün" y={80} size={60} /> },
  { c: "Yedek olsun", r: (t, a, b) => but(t, a, b, [], { z: [1.3, 1.45], c0: [900, 560] }) },
  { c: "Telefonu açıyorsun", tone: "night", r: (t, a, b) => ph(t, a, b, <g><rect width={360} height={740} fill="#000" />{Array.from({ length: 6 }, (_, i) => <rect key={i} x={4 + (i % 3) * 118} y={140 + Math.floor(i / 3) * 160} width={114} height={156} fill={["#B23A48", "#2F4A6B", "#E3B04B", "#4B6B3B", "#C9A27E", "#8E5B9A"][i]} />)}{tx(180, 100, "Fotoğraflar · Bugün", 20, "#FFF", 700, "middle")}</g>, ROOMBG(t)), html: (t, a) => <Big t={t} at={a + 1.4} text="6 / 6 ✓" y={80} size={90} c={GRN} /> },
  { c: "Ücretsiz tasarım", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0.5, kardes: true, screen: <g><rect width={1000} height={625} fill="#F4F0EA" />{Array.from({ length: 6 }, (_, i) => <rect key={i} x={60 + i * 150} y={180} width={130} height={200} fill={["#B23A48", "#2F4A6B", "#E3B04B", "#4B6B3B", "#C9A27E", "#8E5B9A"][i]} opacity={cl((t - 0) * 0.3 - i * 0.1)} />)}{tx(500, 100, "%50 · KARA CUMA", 48, "#111", 900, "middle")}</g> }) },
  { c: "Parmakların titriyor", tone: "night", r: (t, a, b) => oda(t, a, b, { lamp: 0.5, who: [{ o: SEN24_EV, x: 760, y: 1080, s: 1.15, arms: "type", look: 0.7, brow: "worry", mouth: "tight" }], z: [1.4, 1.5], c0: [900, 760] }) },
  { c: ["12.", "On iki."], tone: "night", r: (t, a, b) => board(t, a, b, <g />, { bg: "#0A0E1A" }), html: (t, a) => <Big t={t} at={a + 0.05} text={t < a + 0.7 ? "00:00" : t < a + 2.6 ? "00:02" : "00:03"} y={330} size={180} c={RED} />, sfx: "tick" },
  { c: ["12'yi 3", "On ikiyi üç"], tone: "night", r: (t, a, b) => ph(t, a, b, <WaListe t={t} a={a} n={400} sent={rp(t, a + 1.0, a + 3.5)} />, ROOMBG(t)), sfx: "ding" },
  { c: "Sabah Selin", r: (t, a, b) => but(t, a, b, [{ o: SELIN, x: 960, s: 1.1, arms: "phone", talk: true, mouth: "grin" }], { kara: true, z: [1.2, 1.3] }), html: (t, a) => <Counter t={t} a={a + 1.6} from={0} to={140} label="parça · tek gecede" y={300} c={GRN} /> },
  { c: "En çok satan", r: (t, a, b) => board(t, a, b, <g transform="translate(960,560) rotate(-3)"><rect x={-260} y={-360} width={520} height={720} fill="#FFF" /><rect x={-240} y={-340} width={480} height={560} fill="#2F4A6B" /><path d="M-120,-280 L120,-280 L160,180 L-160,180Z" fill="#1F2F4A" />{tx(0, 290, "Kaşe mont · lacivert", 34, "#111", 700, "middle")}</g>, { bg: "#E9E1D7", z: [1.0, 1.12] }) },
  { c: "Ne filtre", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["Filtre:\nyok", "YZ:\nyok", "Öğleden sonra\nışığı"], H.green)) },
  { c: ["Gelecek ayda", "Gelecek ay da"], r: (t, a, b) => but(t, a, b, [{ o: SELIN, x: 900, s: 1.2, talk: true, mouth: "smile", arms: "phone" }], { z: [1.35, 1.42], c0: [900, 470] }), html: (t, a) => Q(t, a + 1.8, "Ayda 7.000. Olur mu?", 820, GRN, 66) },
  // 10:28 · son gün
  { c: "Ve sonunda ayın", r: (t, a, b) => board(t, a, b, cal(t, a, "KASIM", "30")), sfx: "tick" },
  { c: ["Murat'ın dükkanına", "Muratın dükkanına"], r: (t, a, b) => ber(t, a, b, [{ o: MURAT, x: 700, s: 0.95, look: 0.4, mouth: "smile" }, { o: SEN24, x: 1300, s: 0.9, look: -0.4 }]) },
  { c: "Kardeşim bu ay", r: (t, a, b) => ber(t, a, b, [{ o: MURAT, x: 900, s: 1.2, talk: true, mouth: "grin", look: 0.2 }], { z: [1.35, 1.42], c0: [900, 470] }), html: (t, a) => Q(t, a + 0.3, "Gelecek ay toplu veririm.") },
  { c: "O para gelmeyecek", tone: "cool", r: (t, a, b) => ber(t, a, b, [{ o: SEN24, x: 960, s: 1.2, eyes: "half", mouth: "tight" }], { z: [1.35, 1.42], c0: [960, 470] }), html: (t, a) => <Big t={t} at={a + 0.3} text="−4.000 ₺" y={80} size={90} c={RED} /> },
  // defter
  { c: "Defteri açma", r: (t, a, b) => board(t, a, b, LED(GELIR, 0, -1, "Gelirler"), { bg: "#2A241D" }) },
  { c: ["Ramazan dayı üç", "Ramazan dayı 3"], r: (t, a, b) => board(t, a, b, LED(GELIR, 1 + rp(t, a, a + 2) * 1, -1, "Gelirler"), { bg: "#2A241D" }) },
  { c: ["Selin Hanım 12", "Selin hanım on iki"], r: (t, a, b) => board(t, a, b, LED(GELIR, 2 + rp(t, a, a + 4) * 3, -1, "Gelirler"), { bg: "#2A241D" }) },
  { c: ["Toplam 29", "Toplam yirmi dokuz"], r: (t, a, b) => board(t, a, b, LED(GELIR, 6, 5, "Gelirler"), { bg: "#2A241D", z: [1.05, 1.15], c0: [960, 780] }), html: (t, a) => <Big t={t} at={a + 0.2} text="29.000 ₺" y={60} size={110} c={GRN} /> },
  { c: "Fabrikada asgari ücretle çalışan birinin", r: (t, a, b) => board(t, a, b, sum(t, a + 0.3, [["Fabrika · asgari", "28.075 ₺"], ["Sen · gelir", "29.000 ₺"]]), { bg: "#141A24" }) },
  { c: ["Yani kağıt", "Yani kâğıt"], r: (t, a, b) => oda(t, a, b, { lamp: 1, who: [{ o: SEN24_EV, x: 760, y: 1080, s: 1.1, mouth: "grin", look: 0.1 }], z: [1.3, 1.4], c0: [760, 480] }), html: (t, a) => <Big t={t} at={a + 0.6} text="Kâğıt üstünde: geçtin!" y={80} size={70} c={GRN} /> },
  { c: "Şimdi giderler", r: (t, a, b) => board(t, a, b, LED(GIDER, 0, -1, "Giderler"), { bg: "#2A241D" }) },
  { c: ["Bağkur 11", "Bağ-Kur on bir"], r: (t, a, b) => board(t, a, b, LED(GIDER, 1, 0, "Giderler"), { bg: "#2A241D" }), html: (t, a) => <Big t={t} at={a + 0.2} text="Bağ-Kur" y={60} size={80} c={RED} />, sfx: "boom" },
  { c: ["Mali Müşavir 3", "Mali müşavir üç"], r: (t, a, b) => board(t, a, b, LED(GIDER, 2 + rp(t, a, a + 6) * 2, -1, "Giderler"), { bg: "#2A241D" }) },
  { c: ["Yol 1", "Yol bin"], r: (t, a, b) => board(t, a, b, LED(GIDER, 4 + rp(t, a, a + 3) * 2, -1, "Giderler"), { bg: "#2A241D" }) },
  { c: ["Ve dayının müşterilerine", "dayının müşterilerine"], r: (t, a, b) => board(t, a, b, LED(GIDER, 6, 5, "Giderler"), { bg: "#2A241D", z: [1.05, 1.12] }) },
  { c: ["Toplam gider", "toplam gider"], r: (t, a, b) => board(t, a, b, LED(GIDER, 7, 6, "Giderler"), { bg: "#2A241D", z: [1.05, 1.15], c0: [960, 820] }), html: (t, a) => <Big t={t} at={a + 0.2} text="−20.800 ₺" y={60} size={110} c={RED} /> },
  { c: ["Ay sonunda cebinde kalan", "ay sonunda cebinde kalan"], r: (t, a, b) => board(t, a, b, sum(t, a + 0.2, [["Gelir", "29.000"], ["Gider", "−20.800"], ["Cebinde", "8.200 ₺"]]), { bg: "#141A24" }), sfx: "boom" },
  { c: ["Evet yanlış", "yanlış duymadın"], tone: "cool", r: (t, a, b) => oda(t, a, b, { lamp: 0.6, who: [{ o: SEN24_EV, x: 760, y: 1080, s: 1.1, slump: 0.6, eyes: "half", mouth: "sad", lookY: 0.3 }], z: [1.25, 1.35], c0: [760, 520] }) },
  { c: ["Asgari ücretin 3", "Asgari ücretin üçte"], tone: "cool", r: (t, a, b) => board(t, a, b, sum(t, a + 0.2, [["Fabrika", "28.075 ₺"], ["Sen", "8.200 ₺"]]), { bg: "#1A0E0E" }) },
  { c: "Bir hesap daha", r: (t, a, b) => sok(t, a, b, [{ o: SEN24, x: lp(500, 1200, rp(t, a, b)), y: 1100, s: 0.85, look: 0.5, eyes: "half" }], { night: true }) },
  { c: ["sabah 5'te fırın", "sabah beşte fırın"], tone: "warm", r: (t, a, b) => lah(t, a, b, [{ o: SEN24, x: 1300, s: 0.9, arms: "phone", eyes: "half", look: -0.4 }], { dawn: true }), html: (t, a) => <Big t={t} at={a + 0.3} text="Saatleri topla" y={80} size={70} /> },
  { c: ["220 saat", "İki yüz yirmi saat"], r: (t, a, b) => board(t, a, b, sum(t, a + 0.2, [["Bu ay", "220 saat"], ["8.200 ÷ 220", "37 ₺ / saat"]]), { bg: "#141A24" }), sfx: "tick" },
  { c: "İki gevrek parasına", r: (t, a, b) => board(t, a, b, <><Gevrek x={760} y={560} s={1.4} /><Gevrek x={1160} y={580} s={1.4} /></>, { bg: "#2A241D", z: [1.0, 1.1] }), html: (t, a) => <Big t={t} at={a + 0.4} text="1 saat = 2 gevrek" y={80} size={76} c={YEL} /> },
  // 11:49 · hüküm
  { c: "Peki, gerçekten", r: (t, a, b) => lah(t, a, b, [{ o: SEN24, x: 960, s: 1.2, look: 0, mouth: "flat" }], { z: [1.35, 1.45], c0: [960, 460] }), html: (t, a) => <Big t={t} at={a + 0.2} text="Peki… gerçekten değer mi?" y={80} size={70} c={YEL} /> },
  { c: "İlk ay değmez", r: (t, a, b) => board(t, a, b, cards(t, a + 0.2, ["İlk ay:\ndeğmez", "Sen kendini\nsatıyorsun"], H.red)) },
  { c: "Ama bir şeye", r: (t, a, b) => board(t, a, b, cards(t, a + 1.2, ["Dayı", "Nur abla", "Hüseyin amca", "Selin hanım"], H.green, 520, 420, 380)) },
  { c: ["Bu sabit 24", "Bu sabit yirmi dört"], r: (t, a, b) => board(t, a, b, <g />, { bg: "#0E2418" }), html: (t, a) => <Counter t={t} a={a + 0.2} from={0} to={24000} label="₺ · gelecek ay sabit" y={330} c={GRN} /> },
  { c: "Fabrikada üçüncü", r: (t, a, b) => board(t, a, b, sum(t, a + 0.2, [["Fabrika · 3. ay", "aynı maaş"], ["Burada · her müşteri", "+ cebine"]]), { bg: "#141A24" }) },
  { c: ["10 müşteriye", "On müşteriye"], r: (t, a, b) => board(t, a, b, <g />, { bg: "#0E2418" }), html: (t, a) => <><Counter t={t} a={a + 0.2} from={4} to={10} label="müşteri" y={200} c={YEL} /><Big t={t} at={a + 2.4} text="40.000 ₺ +" sub="tek sebep: yapay zeka" y={560} size={100} c={GRN} /></> },
  { c: "tek sebebi yapay zeka", r: (t, a, b) => lap(t, a, b, <AiSohbet t={t} a={a} q="10 müşterinin bu haftaki paylaşımları" ans={["Ramazan Usta · 3 gönderi", "Nur abla · randevu botu", "Selin hanım · 12 ürün", "Hüseyin amca · 3 şube"]} />, ROOMBG(t)) },
  { c: "Ama yapay zeka sana", r: (t, a, b) => sok(t, a, b, [{ o: SEN24, x: 960, y: 1100, s: 1.1, look: 0, mouth: "flat", arms: "hold", hold: <rect x={-50} y={-70} width={100} height={140} rx={6} fill="#FBF6E6" /> }], { z: [1.25, 1.35], c0: [960, 520] }), html: (t, a) => <Big t={t} at={a + 0.4} text="Müşteri bulmaz." y={80} size={76} c={RED} /> },
  { c: ["On dört kapıya", "14 kapıya"], r: (t, a, b) => cam(t, a, b, <DukkanHarita t={t} a={a - 8} />, {}, [1.05, 1.12]) },
  { c: "Yanlış randevuyu", r: (t, a, b) => ph(t, a, b, <RandevuEkran k={1} clash t={t} />, <Kuafor t={t} />, { light: true, z: [1.1, 1.2] }) },
  { c: "Tek yıldızı", r: (t, a, b) => ph(t, a, b, <HaritaYorum text={["Bu düpedüz kandırmaca."]} />, LAHBG(t), { light: true, z: [1.2, 1.3], c0: [960, 360] }) },
  { c: "Ve Murat gibilerine", r: (t, a, b) => board(t, a, b, <g transform="translate(960,560) rotate(-2)"><rect x={-420} y={-300} width={840} height={600} fill="#FBF6E6" />{tx(0, -200, "HİZMET SÖZLEŞMESİ", 54, "#22324A", 800, "middle")}{["Aylık ücret: ______ ₺", "Ödeme günü: her ayın 1'i", "İmza: ________"].map((s, i) => <g key={i}>{tx(-340, -60 + i * 110, s, 40, "#333", 600)}</g>)}<path d={`M120,190 q40,-${40 * rp(t, a + 1, a + 2)} 80,0 t80,0`} stroke="#1A3A8A" strokeWidth={6} fill="none" /></g>, { bg: "#2A241D", z: [1.0, 1.1] }) },
  { c: "Bu iş kimin", r: (t, a, b) => board(t, a, b, cards(t, a + 1.6, ["Konuşmaktan\nkorkmayan", "Yanlışı önce\nkendi söyleyen", "6 ay\nsabreden"], YEL)) },
  { c: "en az altı ay", r: (t, a, b) => board(t, a, b, cal(t, a, "SABIR", "6 ay", "en az")) },
  { c: "Zorluk", r: (t, a, b) => cam(t, a, b, <rect width={1920} height={1080} fill="#0E1016" />, {}, [1, 1.05]), html: (t, a) => <Verdict t={t} a={a} rows={[["Zorluk", 6], ["Sermaye", 2], ["Sabır", 9]]} title="Yapay zekayla esnafa hizmet" /> },
  { c: "Ve o sabah dayının", tone: "warm", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 760, s: 0.95, arms: "hold", look: 0.3, mouth: "smile" }, { o: SEN24, x: 1350, s: 0.9, arms: "phone", look: -0.5, mouth: "smile" }], { dawn: true, extra: <Hamur x={760} y={560} s={0.55} t={t} /> }) },
  { c: "bu ayın en çok", r: (t, a, b) => ph(t, a, b, viral(t, a - 3), LAHBG(t), { z: [1.1, 1.2] }), html: (t, a) => <Big t={t} at={a + 0.4} text="En çok kazandıran: 15 saniye" y={80} size={60} c={YEL} /> },
  { c: "Hiçbir yapay zeka yoktu", r: (t, a, b) => fa(t, a, b, { lah: false, z: [1.0, 1.12] }) },
  // çağrı
  { c: "Sen olsan", r: (t, a, b) => board(t, a, b, cards(t, a + 0.3, ["Garson?", "Kurye?", "Kasap?"], YEL)) },
  { c: "Yorumlara yaz", r: (t, a, b) => board(t, a, b, comment(t, a)) },
  { c: "Bir sonraki ayı", r: (t, a, b) => lah(t, a, b, [{ o: DAYI, x: 960, s: 0.95, arms: "type", mouth: "smile" }], { queue: 6, z: [1.0, 1.08] }), html: (t, a) => <SubBtn t={t} at={a + 0.6} /> },
];

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K6_10_SECONDS));
  return raw;
})();

export const K6Video10: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const fadeIn = rp(t, 0, 0.4);
  const cutFlash = 1 - rp(t, s.from, s.from + 0.12);
  const fadeOut = 1 - rp(t, K6_10_SECONDS - 1.5, K6_10_SECONDS);
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
      <Audio src={staticFile("audio/k6-10.wav")} />
      {TIMED.map((x, i) => i > 0 && x.to < K6_10_SECONDS - 15 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.06) * fps))} durationInFrames={Math.round(2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.sfx === "knock" ? 0.08 : x.sfx === "boom" || x.sfx === "drone" ? 0.12 : x.sfx ? 0.15 : 0.07} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
