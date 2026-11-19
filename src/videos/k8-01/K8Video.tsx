import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k8-01-words.json";
import { makeCue, ramp as rampRaw } from "../../lib/cues";
import { P, TCam, TFrame, TPose, lerp, toonWalk, runPose, mixPose } from "../../components/Toon";
import { Txt, Tag, Abone } from "../../components/K2Kit";
import { Atmos, LiveCam, Sweep, Tone } from "../../components/Live";
import { Motor, Telefon } from "../../components/SonIki";
import {
  CAST, DFig, DEyes, DBrow, DMouth, Konak, KonakBahce, HastaneOda, Hapis, OkulKapisi, Tersane, Konsey, Sahil, Ofis,
  Foto4, Ekmek, Tabanca, Yuzuk, CocukResmi, Kayit, Zincir, TekerlekliSandalye, SiyahMinibus, SirenIsik, Simsek,
} from "../../components/Dizi";

// Kanal 6 · k8-01 · "Ya Bozo Her Şeyi En Başından Biliyorsa? | Yeraltı Alternatif Final". TAMAMEN MOTOR (Dizi.tsx).
// Hayran yapımı: dizi görüntüsü/sesi/logosu yok, karakterler genel benzerlik (ten, saç, kıyafet).

const ALT: Record<string, string[]> = {
  "Birinci bölüm. Kapı": ["Birinci bölüm Kapı", "1. bölüm. Kapı", "1. bölüm Kapı"],
  "İkinci bölüm. İki ajan": ["İkinci bölüm İki ajan", "2. bölüm. İki ajan", "2. bölüm İki ajan"],
  "Üçüncü bölüm. Hastane": ["Üçüncü bölüm Hastane", "3. bölüm. Hastane", "3. bölüm Hastane"],
  "Dördüncü bölüm. Okul": ["Dördüncü bölüm Okul", "4. bölüm. Okul", "4. bölüm Okul"],
  "Beşinci bölüm. Plan": ["Beşinci bölüm Plan", "5. bölüm. Plan", "5. bölüm Plan"],
  "Altıncı bölüm. Eski": ["Altıncı bölüm Eski", "6. bölüm. Eski", "6. bölüm Eski"],
  "Final. Altı ay sonra": ["Final Altı ay sonra", "Final. 6 ay sonra", "Final 6 ay sonra"],
  "Üç yıldır biliyordun": ["3 yıldır biliyordun"],
  "Bir metre. İki metre": ["Bir metre iki metre", "1 metre. 2 metre", "1 metre 2 metre"],
};
const variants = (p: string) => [p, p.replace(/[.,:!?]/g, "")];
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const ramp = (t: number, a: number, b: number) => (b - a > 0.01 ? rampRaw(t, a, b) : t >= b ? 1 : 0);
const W_ = words as { end: number }[];
const VOICE_END = W_[W_.length - 1].end;
export const K8_01_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone; siren?: boolean; flash?: boolean };

// ── yardımcılar ──
type Face = { s?: number; dir?: 1 | -1; pose?: TPose; eyes?: DEyes; brow?: DBrow; mouth?: DMouth; talk?: boolean; look?: number; lookY?: number; tear?: number; holdR?: React.ReactNode; holdL?: React.ReactNode; y?: number; wet?: number; op?: number };
const G = 1010;
const F = (name: string, x: number, f: Face = {}) => (t: number) => <DFig key={name + x} x={x} y={f.y ?? G} s={f.s ?? 1.1} o={CAST[name]} t={t} seed={name.length * 3 + x / 100} {...f} />;
const Wk = (name: string, x0: number, x1: number, f: Face = {}, d0 = 0.1, d1 = 2.6) => (t: number, a: number) => {
  const s = f.s ?? 1.1;
  const w = toonWalk(t, a + d0, a + d1, x0, x1, s);
  return <DFig key={name + "w"} x={w.x} y={f.y ?? G} s={s} o={CAST[name]} t={t} dir={w.dir} walk={w.walk} seed={name.length} {...f} />;
};
const Run = (name: string, x0: number, x1: number, f: Face = {}, d0 = 0.1, d1 = 1.6) => (t: number, a: number) => {
  const x = lerp(x0, x1, ramp(t, a + d0, a + d1));
  const moving = t > a + d0 && t < a + d1;
  return <DFig key={name + "r"} x={x} y={f.y ?? G} s={f.s ?? 1.1} o={CAST[name]} t={t} dir={x1 > x0 ? 1 : -1} pose={moving ? runPose((t - a) * 9) : f.pose ?? P.stand} seed={name.length} {...f} />;
};
type Node = (t: number, a: number, b: number) => React.ReactNode;
const sc = (bg: Node, ...figs: Node[]): Node => (t, a, b) => <>{bg(t, a, b)}{figs.map((f, i) => <React.Fragment key={i}>{f(t, a, b)}</React.Fragment>)}</>;
const cam = (z: [number, number], c0: [number, number], c1: [number, number] | undefined, node: Node, shake = 0): R => (t, a, b) => <TCam t={t} a={a} b={b} z={z} c0={c0} c1={c1} shake={shake}>{node(t, a, b)}</TCam>;
// yüz yakın planı: x = figür x'i, s = ölçek
const face = (x: number, s = 1.1, z = 2.6, dx = 0): [number, number] => [x + dx, G - 400 * s];
const q = (text: string, size = 66, k = 0.25, y = 880): R => (t, a, b) => <Txt t={t} at={a + Math.min(0.6, (b - a) * k)} text={text} y={y} size={size} />;
const tg = (text: string, c = "#E63946", at = 0.4, y?: number): R => (t, a) => <Tag t={t} at={a + at} text={text} c={c} y={y} />;
const big = (text: string, color = "#FFC800", size = 100, y = 90): R => (t, a) => <Txt t={t} at={a + 0.25} text={text} y={y} size={size} color={color} />;
const kart = (bg: string): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill={bg} /></TCam>;
const bolum = (n: string, name: string): Pick<Sh, "r" | "html" | "sfx" | "tone"> => ({
  sfx: "boom", tone: "none",
  r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}><rect width={1920} height={1080} fill="#0E1222" /><rect x={0} y={480} width={1920} height={6} fill="#E63946" opacity={ramp(t, a + 0.2, a + 0.8)} /><g transform={`translate(${1520 + Math.sin(t) * 10},300) rotate(-8)`}><rect x={-150} y={-60} width={300} height={120} rx={10} fill="#FFC800" /><rect x={-150} y={-100} width={300} height={40} fill="#1B1210" transform={`rotate(${-12 * (1 - ramp(t, a, a + 0.5))},-150,-60)`} /></g></TCam>,
  html: (t, a) => <><Txt t={t} at={a + 0.15} text={n} y={330} size={70} color="#FFFFFF" /><Txt t={t} at={a + 0.7} text={name} y={540} size={150} color="#FFC800" /></>,
});
// eşyalar
const tel = (w = 1) => <rect x={-14 * w} y={-34 * w} width={28 * w} height={52 * w} rx={6} fill="#1A1C22" stroke="#000" strokeWidth={3} />;
const tepsi = <g><rect x={-60} y={-8} width={120} height={12} rx={4} fill="#C8A060" stroke="#1B1210" strokeWidth={3} /><path d="M-20,-8 L-16,-30 L8,-30 L12,-8Z" fill="#FFFFFF" stroke="#1B1210" strokeWidth={3} /></g>;
const cay = <g><path d="M-12,0 L-9,-34 L9,-34 L12,0Z" fill="#C0392B" opacity={0.85} stroke="#1B1210" strokeWidth={3} /></g>;
const tab = <Tabanca s={0.55} rot={0} />;
const AIM: TPose = { l: [8, 6], r: [84, 92] };
const HANDS_UP: TPose = { l: [150, 170], r: [150, 170] };
const KNEEL: TPose = { l: [20, 40], r: [30, 60], ll: [90, 0], rl: [-10, 80], lean: 6 };
const HUG: TPose = { l: [70, 110], r: [70, 110], lean: 6 };

// ── sahne kısayolları ──
const oda = (t: number) => <Konak t={t} room="oda" />;
const salon = (t: number) => <Konak t={t} room="salon" />;
const mutfak = (t: number) => <Konak t={t} room="mutfak" night={1} />;
const bahce = (t: number) => <KonakBahce t={t} />;
const bahceGece = (t: number) => <><KonakBahce t={t} swing={0} dusk={1} /><rect width={1920} height={1080} fill="#0A1430" opacity={0.55} /></>;
const hastane = (t: number) => <HastaneOda t={t} night={1} />;
const hastaneSabah = (t: number) => <HastaneOda t={t} night={0} />;
const okul = (t: number) => <OkulKapisi t={t} />;
const ters = (o: { lights?: number; flood?: number; crane?: number } = {}) => (t: number) => <Tersane t={t} {...o} />;
const avlu = (t: number) => <Hapis t={t} mode="avlu" />;
const hucre = (t: number) => <Hapis t={t} mode="hucre" />;
const ofis = (t: number) => <Ofis t={t} />;
const merdanYatak = (f: Face = {}) => (t: number) => <g><DFig x={520} y={735} s={0.9} o={CAST.merdan} t={t} pose={{ l: [20, 60], r: [20, 60], ll: [90, 0], rl: [90, 0], lean: -70 }} seed={4} {...f} /><path d={`M440,${700 + Math.sin(t * 2.1) * 3} Q800,${640 + Math.sin(t * 2.1) * 4} 1130,700 L1130,760 L440,760Z`} fill="#A9C7D6" stroke="#1B1210" strokeWidth={5} /><path d="M520,705 Q800,660 1100,712" stroke="#86A9BA" strokeWidth={5} fill="none" /></g>;
const sultanAim = (x = 1180, f: Face = {}) => F("sultan", x, { dir: -1, pose: AIM, holdR: tab, brow: "worried", eyes: "wide", ...f });
const telKart = (msgs: { who: string; text: string; me?: boolean }[], time = "00:14"): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><rect width={1920} height={1080} fill="#121520" /><g transform="translate(960,560) scale(1.15)"><foreignObject x={-260} y={-480} width={520} height={960}><div style={{ width: 520, height: 960 }}><Telefon msgs={msgs} time={time} /></div></foreignObject></g></TCam>;

const SHOTS: Sh[] = [
  // ── HOOK ──
  { c: "Gece yarısı. Haydar", sfx: "drone", tone: "night", r: cam([1, 1.12], [960, 600], undefined, sc(oda, F("haydar", 760, { brow: "angry", mouth: "tight", look: 1 }), sultanAim(1160))), html: (t, a) => <div style={{ position: "absolute", left: 40, bottom: 34, opacity: 1 - ramp(t, 3.4, 3.9), fontFamily: "Poppins", fontWeight: 700, fontSize: 30, color: "#fff", background: "rgba(0,0,0,.55)", padding: "6px 18px", borderRadius: 10 }}>Hayran yapımı alternatif senaryo</div> },
  { c: "Namluyu tutan el", sfx: "tick", tone: "night", r: cam([3, 3.3], [1000, 500], [1060, 500], sc(oda, F("haydar", 760, { brow: "angry", mouth: "tight", look: 1 }), sultanAim(1160))) },
  { c: "Sultan'ın gözleri dolu", tone: "night", r: cam([2.8, 3], face(1160), undefined, sc(oda, sultanAim(1160, { tear: 1, eyes: "sad", brow: "sad", mouth: "frown" }))) },
  { c: "Kimsin sen", sfx: "boom", tone: "night", r: cam([3, 3.2], face(1160), undefined, sc(oda, sultanAim(1160, { tear: 1, mouth: "shout", brow: "angry" })), 3), html: q("“KİMSİN SEN?”", 96, 0.1, 820) },
  { c: "Haydar Ali inkâr etmiyor", tone: "night", r: cam([2.6, 2.8], face(760), undefined, sc(oda, F("haydar", 760, { eyes: "down", mouth: "tight" }))) },
  { c: "Git, abine anlat", sfx: "drone", tone: "night", r: cam([2.8, 3.1], face(760), undefined, sc(oda, F("haydar", 760, { eyes: "squint", brow: "angry", talk: true }))), html: q("“GİT, ABİNE ANLAT.”", 80) },
  { c: "Ama bu gece Sultan abisine", tone: "night", r: cam([1, 1.06], [960, 560], undefined, sc((t) => <Konak t={t} room="kapi" door={0} />)) },
  { c: "Çünkü bu gece, kapıyı Bozo", sfx: "knock", tone: "night", r: cam([1, 1.1], [960, 560], undefined, sc((t, a) => <Konak t={t} room="kapi" door={ramp(t, a + 0.3, a + 1.5)} />, (t, a) => <DFig x={960} y={900} s={1.1} o={CAST.bozo} t={t} op={ramp(t, a + 0.8, a + 1.5)} brow="none" mouth="flat" />)) },
  { c: "Ve Bozo, her şeyi", sfx: "boom", tone: "night", r: cam([2.6, 2.9], [960, 900 - 440], undefined, sc((t) => <Konak t={t} room="kapi" door={1} />, (t) => <DFig x={960} y={900} s={1.1} o={CAST.bozo} t={t} mouth="smirk" />)), html: big("HER ŞEYİ BİLİYOR.", "#FFC800", 96, 80) },
  { c: "Bu gece Yeraltı bitiyor", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1]}><Sahil t={t} /></TCam>, html: (t, a) => <><Txt t={t} at={a + 0.2} text="YERALTI" y={300} size={150} color="#FFFFFF" /><Txt t={t} at={a + 0.9} text="ALTERNATİF FİNAL" y={500} size={90} color="#E63946" /></> },
  { c: "Ama bizim kalemimizden", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><rect width={1920} height={1080} fill="#1B4F9C" /><g transform={`translate(960,560) rotate(${-10 + ramp(t, a, b) * 8})`}><rect x={-500} y={-26} width={900} height={52} rx={10} fill="#FFC800" stroke="#1B1210" strokeWidth={8} /><path d="M400,-26 L520,0 L400,26Z" fill="#F3CDAA" stroke="#1B1210" strokeWidth={8} /><path d="M490,-6 L520,0 L490,6Z" fill="#1B1210" /><path d={`M520,0 q60,${-40 + Math.sin(t * 8) * 20} 140,0 t140,0`} stroke="#1B1210" strokeWidth={8} fill="none" strokeDasharray={`${ramp(t, a, b) * 400} 400`} /></g></TCam>, html: big("FİNALİ BİZ YAZDIK", "#FFFFFF", 90, 120) },
  { c: "Kim kimi satacak", sfx: "tick", tone: "night", r: cam([1, 1.08], [960, 560], undefined, sc(salon, F("bozo", 560, { brow: "angry", mouth: "tight" }), F("yilmaz", 960, { dir: -1, mouth: "smirk" }), F("haydar", 1360, { dir: -1, brow: "angry" }))), html: big("1. KİM KİMİ SATACAK?", "#FFFFFF", 80, 80) },
  { c: "Haydar Ali ile Ceylan sonunda", sfx: "tick", tone: "warm", r: cam([1.4, 1.5], [960, 620], undefined, sc(bahceGece, F("haydar", 820, { eyes: "sad", mouth: "flat" }), F("ceylan", 1100, { dir: -1, eyes: "sad", brow: "sad" }))), html: big("2. KAVUŞACAKLAR MI?", "#FF3E7F", 80, 80) },
  { c: "Ve bu savaşın gerçek sahibi", sfx: "tick", tone: "night", r: cam([1, 1.12], [960, 560], undefined, (t) => <Konsey t={t} />), html: big("3. SAVAŞIN GERÇEK SAHİBİ KİM?", "#FFC800", 72, 80) },
  { c: "Hepsinin cevabı bu filmde", sfx: "boom", tone: "night", r: cam([1, 1.05], [960, 540], undefined, (t) => <Tersane t={t} lights={0.6} />) },

  // ── HATIRLATMA ──
  { c: "Önce kısaca hatırlayalım", sfx: "static", tone: "cool", r: cam([1, 1.06], [960, 560], undefined, sc(hastane, merdanYatak({ eyes: "closed" }))), html: tg("ÖNCEKİ BÖLÜMDE", "#1B4F9C") },
  { c: "Rüzgar'ın kurşunları", tone: "cool", r: cam([2, 2.3], [600, 520], undefined, sc(hastane, merdanYatak({ eyes: "closed" }))), html: tg("MERDAN: HASTANELİK", "#E63946") },
  { c: "Bozo, Rüzgar'ın karşısına geçti", tone: "night", r: cam([1, 1.1], [960, 600], undefined, sc(ters({ lights: 0 }), F("bozo", 700, { brow: "angry", talk: true }), F("ruzgar", 1220, { dir: -1, brow: "angry", eyes: "wide" }))) },
  { c: "Ada, onun kızı", sfx: "boom", tone: "warm", r: cam([1.5, 1.7], [700, 640], undefined, sc(bahce, (t) => <DFig x={700} y={900} s={0.66} o={CAST.ada} t={t} mouth="smile" eyes="happy" />)), html: big("ADA = BOZO'NUN KIZI", "#FFC800", 80) },
  { c: "Ve Sultan, tek bir telefonla", tone: "night", r: cam([2.6, 2.8], face(1160), undefined, sc(oda, F("sultan", 1160, { dir: -1, pose: P.phone, holdR: tel(), eyes: "wide", brow: "worried" }))), html: tg("HAYDAR ALİ = AJAN", "#E63946") },

  // ── SATIR ──
  { c: "Bu video bir hayran yapımı", tone: "gold", r: kart("#1B4F9C"), html: (t, a) => <><Txt t={t} at={a + 0.1} text="HAYRAN YAPIMI" y={330} size={110} color="#FFC800" /><Txt t={t} at={a + 0.8} text="Resmi değil · Tamamen kurgusal alternatif senaryo" y={520} size={50} color="#FFFFFF" /></> },
  { c: "Sadece diziyi seven biri", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><Sahil t={t} /></TCam>, html: q("“KEŞKE BÖYLE BİTSEYDİ.”", 80, 0.4) },

  // ── 1. BÖLÜM: KAPI ──
  { c: "Birinci bölüm. Kapı", ...bolum("BİRİNCİ BÖLÜM", "KAPI") },
  { c: "Sultan'ın parmağı tetiğin", sfx: "tick", tone: "night", r: cam([3.2, 3.5], [1260, 560], undefined, sc(oda, sultanAim(1180))) },
  { c: "Haydar Ali gözlerini kapatıyor", tone: "night", r: cam([2.8, 3], face(760), undefined, sc(oda, F("haydar", 760, { eyes: "closed", mouth: "tight" }))) },
  { c: "Tam o anda kapının kolu", sfx: "knock", tone: "night", r: cam([2.4, 2.8], [1100, 580], undefined, sc((t, a) => <Konak t={t} room="kapi" door={ramp(t, a + 0.6, a + 1.4) * 0.25} />), 2) },
  { c: "İçeri Bozo giriyor", tone: "night", r: cam([1, 1.08], [960, 600], undefined, sc(oda, F("haydar", 600, { eyes: "wide", look: 1 }), sultanAim(900, { dir: 1, eyes: "wide" }), Wk("bozo", 1800, 1350, { dir: -1, pose: P.hold, holdR: cay, holdL: cay }))) },
  { c: "Elinde iki bardak çay", sfx: "ding", tone: "warm", r: cam([3.2, 3.4], [1350, 640], undefined, sc(oda, F("bozo", 1350, { dir: -1, pose: P.hold, holdR: cay, holdL: cay, mouth: "flat" }))), html: tg("İKİ BARDAK ÇAY ☕", "#E63946") },
  { c: "Yüzünde ne öfke var", tone: "night", r: cam([2.8, 3], face(1350), undefined, sc(oda, F("bozo", 1350, { dir: -1, pose: P.hold, holdR: cay, holdL: cay, mouth: "flat" }))) },
  { c: "Sanki bu sahneyi yıllardır", tone: "night", r: cam([1.2, 1.3], [1000, 620], undefined, sc(oda, F("haydar", 600, { eyes: "wide" }), sultanAim(900, { dir: 1, eyes: "wide" }), F("bozo", 1350, { dir: -1, pose: P.hold, holdR: cay, holdL: cay, mouth: "smirk" }))) },
  { c: "İndir onu, Sultan", sfx: "drone", tone: "night", r: cam([2.6, 2.8], face(1350), undefined, sc(oda, F("bozo", 1350, { dir: -1, talk: true }))), html: q("“İNDİR ONU, SULTAN.”") },
  { c: "O silahı bana doğrultman", tone: "night", r: cam([1.6, 1.7], [1120, 600], undefined, sc(oda, sultanAim(900, { dir: 1, eyes: "wide" }), F("bozo", 1350, { dir: -1, talk: true, pose: P.point }))) },
  { c: "Çünkü bu adamı bu eve ben soktum", sfx: "boom", tone: "night", r: cam([2.8, 3], face(1350), undefined, sc(oda, F("bozo", 1350, { dir: -1, talk: true, brow: "angry" }))), html: q("“BU ADAMI BU EVE BEN SOKTUM.”", 70) },
  { c: "Sultan'ın eli titriyor", tone: "night", r: cam([2.2, 2.4], [1000, 520], undefined, sc(oda, sultanAim(900, { dir: 1, eyes: "wide", brow: "worried", tear: 0.6 })), 2.5) },
  { c: "Abi, sen ne diyorsun", tone: "night", r: cam([2.6, 2.8], face(900), undefined, sc(oda, sultanAim(900, { dir: 1, mouth: "shout", tear: 1 }))), html: q("“BU ADAM AJAN!”", 90) },
  { c: "Bozo çayları masaya bırakıyor", sfx: "ding", tone: "warm", r: cam([1.2, 1.3], [1100, 640], undefined, sc(oda, F("haydar", 600, { eyes: "wide" }), Wk("bozo", 1350, 1050, { dir: -1 }))) },
  { c: "Cezaevindeki ilk gece", sfx: "static", tone: "cool", r: cam([1, 1.1], [960, 600], undefined, sc(hucre, F("bozo", 640, { pose: P.sit, y: 810, s: 1, mouth: "flat" }), F("haydar", 1150, { dir: -1, pose: P.reach, holdR: <Ekmek x={0} y={0} s={0.35} />, mouth: "flat" }))), html: tg("3 YIL ÖNCE · CEZAEVİ", "#1B4F9C") },
  { c: "Koğuşta bana ekmeğini", tone: "cool", r: cam([2.6, 2.8], [900, 520], undefined, sc(hucre, F("bozo", 640, { pose: P.reach, mouth: "smile" }), F("haydar", 1150, { dir: -1, pose: P.reach, holdR: <Ekmek x={0} y={0} s={0.35} /> }))) },
  { c: "O gece adını da öğrendim", sfx: "boom", tone: "night", r: cam([2.8, 3], face(1350), undefined, sc(oda, F("bozo", 1350, { dir: -1, talk: true, mouth: "smirk" }))), html: q("“KİMİN ADAMI OLDUĞUNU DA.”", 70) },
  { c: "Haydar Ali'nin yüzü bembeyaz", tone: "night", r: cam([2.8, 3], face(600), undefined, sc(oda, F("haydar", 600, { eyes: "wide", mouth: "o" }))) },
  { c: "Biliyordun. Üç yıldır", tone: "night", r: cam([2.6, 2.8], face(600), undefined, sc(oda, F("haydar", 600, { brow: "worried", talk: true }))), html: q("“NEDEN BENİ ÖLDÜRMEDİN?”", 74) },
  { c: "Bozo hafifçe gülümsüyor", tone: "night", r: cam([2.8, 3], face(1050), undefined, sc(oda, F("bozo", 1050, { dir: -1, mouth: "smirk" }))) },
  { c: "Çünkü ikimizin de katili", sfx: "drone", tone: "night", r: cam([1.3, 1.4], [830, 600], undefined, sc(oda, F("haydar", 600, { brow: "worried" }), F("bozo", 1050, { dir: -1, talk: true }))), html: q("“İKİMİZİN DE KATİLİ AYNI ADAMDI.”", 66) },
  { c: "Bedrettin sadece bir maşaydı", tone: "night", r: cam([1, 1.1], [960, 560], undefined, (t) => <Konsey t={t} n={1} />), html: q("“MAŞAYI TUTAN EL HÂLÂ DIŞARIDA.”", 66, 0.5) },
  { c: "Odada bir sessizlik", sfx: "drone", tone: "night", r: cam([1.05, 1.15], [960, 620], undefined, sc(oda, F("haydar", 600), F("sultan", 880, { pose: P.stand, eyes: "down" }), F("bozo", 1150, { dir: -1 }))) },
  { c: "Sultan silahı yavaşça indiriyor", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={face(900)}>{oda(t)}<DFig x={900} y={G} s={1.1} o={CAST.sultan} t={t} pose={mixPose(AIM, P.stand, ramp(t, a + 0.3, a + 1.6))} holdR={tab} eyes="down" brow="sad" /></TCam> },
  { c: "Bozo masaya eski, sararmış", sfx: "whoosh", tone: "warm", r: cam([1, 1.12], [960, 540], undefined, (t, a) => <><rect width={1920} height={1080} fill="#3A2418" /><Foto4 x={960} y={540 + (1 - ramp(t, a, a + 0.6)) * 400} s={1.3} rot={-4 + ramp(t, a, a + 0.6) * 2} /></>) },
  { c: "Fotoğrafta dört adam var", tone: "warm", r: cam([1.2, 1.3], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#3A2418" /><Foto4 x={960} y={540} s={1.3} rot={-2} /></>), html: tg("1998", "#8A5A32") },
  { c: "Biri Bedrettin", sfx: "tick", tone: "warm", r: cam([2.2, 2.4], [960 - 210 * 1.3, 500], undefined, (t) => <><rect width={1920} height={1080} fill="#3A2418" /><Foto4 x={960} y={540} s={1.3} rot={0} hl={1} /></>), html: tg("BEDRETTİN", "#E63946") },
  { c: "Biri Bozo'nun babası", sfx: "tick", tone: "warm", r: cam([2.2, 2.4], [960 - 70 * 1.3, 500], undefined, (t) => <><rect width={1920} height={1080} fill="#3A2418" /><Foto4 x={960} y={540} s={1.3} rot={0} hl={0} /></>), html: tg("BOZO'NUN BABASI", "#E63946") },
  { c: "Biri Haydar Ali'nin babası", sfx: "tick", tone: "warm", r: cam([2.2, 2.4], [960 + 70 * 1.3, 500], undefined, (t) => <><rect width={1920} height={1080} fill="#3A2418" /><Foto4 x={960} y={540} s={1.3} rot={0} hl={2} /></>), html: tg("HAYDAR'IN BABASI", "#E63946") },
  { c: "Ve dördüncüsünün yüzü", sfx: "boom", tone: "warm", r: cam([3, 3.4], [960 + 230 * 1.3, 420], undefined, (t) => <><rect width={1920} height={1080} fill="#3A2418" /><Foto4 x={960} y={540} s={1.3} rot={0} hl={3} /></>), html: big("4. ADAM: ???", "#FFC800", 96) },
  { c: "Konsey, diyor Bozo", sfx: "drone", tone: "night", r: cam([1, 1.12], [960, 560], undefined, (t) => <Konsey t={t} />), html: big("KONSEY", "#E63946", 120) },
  { c: "Yeraltının üstündeki yeraltı", tone: "night", r: cam([1.6, 1.8], [960, 600], undefined, (t) => <Konsey t={t} />), html: q("“YERALTININ ÜSTÜNDEKİ YERALTI.”", 70) },
  { c: "Babalarımızı onlar öldürttü", tone: "night", r: cam([2.6, 2.8], face(1150), undefined, sc(oda, F("bozo", 1150, { dir: -1, talk: true, brow: "angry" }))) },
  { c: "Ben bu kartelin başına", tone: "night", r: cam([1.3, 1.4], [880, 600], undefined, sc(oda, F("haydar", 600, { look: 1 }), F("bozo", 1150, { dir: -1, talk: true, pose: P.point }))) },
  { c: "Ama ikimiz aynı kapıyı arıyoruz", sfx: "boom", tone: "night", r: cam([2.4, 2.6], [880, 560], undefined, sc(oda, F("haydar", 600, { look: 1, brow: "worried" }), F("bozo", 1150, { dir: -1, talk: true }))), html: q("“AYNI KAPIYI ARIYORUZ.”", 76) },
  { c: "Haydar Ali fotoğrafa bakıyor", tone: "warm", r: cam([1.8, 2], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#3A2418" /><Foto4 x={960} y={560} s={1.4} rot={-3} /></>) },
  { c: "Ve bunu neden şimdi", tone: "night", r: cam([2.6, 2.8], face(600), undefined, sc(oda, F("haydar", 600, { brow: "angry", talk: true }))), html: q("“NEDEN ŞİMDİ?”", 90) },
  { c: "Bozo'nun telefonu titriyor", sfx: "buzz", tone: "night", r: cam([3, 3.2], [1150 - 60, 700], undefined, sc(oda, F("bozo", 1150, { dir: -1, pose: P.phone, holdR: tel() })), 3) },
  { c: "Ekranda tek bir mesaj", sfx: "buzz", tone: "night", r: telKart([{ who: "BİLİNMEYEN", text: "Ajanını teslim et. Yoksa kızını alırız." }], "00:47") },
  { c: "Gönderen numara yok", tone: "night", r: telKart([{ who: "BİLİNMEYEN", text: "Ajanını teslim et. Yoksa kızını alırız." }], "00:47"), html: tg("NUMARA: GİZLİ", "#E63946") },
  { c: "Bozo telefonu çeviriyor", tone: "night", r: cam([2.6, 2.8], face(1150), undefined, sc(oda, F("bozo", 1150, { dir: -1, talk: true, pose: P.point, holdR: tel() }))), html: q("“ARTIK ONLAR DA BİLİYOR.”", 76) },
  { c: "Sultan'ın yüzü bembeyaz", sfx: "boom", tone: "night", r: cam([2.8, 3], face(880), undefined, sc(oda, F("sultan", 880, { eyes: "wide", mouth: "open", brow: "worried" }))), html: q("“ADA'YI MI?”", 96) },
  { c: "Bozo cevap vermiyor", tone: "night", r: cam([1, 1.1], [1100, 600], undefined, sc(salon, Wk("bozo", 700, 1150, {}, 0.1, 3))) },
  { c: "Bahçede, salıncağın yanında", sfx: "whoosh", tone: "warm", r: cam([1.3, 1.5], [400, 620], [300, 620], sc(bahce, (t) => <DFig x={220} y={720} s={0.62} o={CAST.ada} t={t} mouth="smile" eyes="happy" pose={P.hold} />)) },
  { c: "Biraz ötede Derya", tone: "warm", r: cam([1.1, 1.2], [700, 620], undefined, sc(bahce, (t) => <DFig x={220} y={720} s={0.62} o={CAST.ada} t={t} mouth="smile" pose={P.hold} />, (t) => <DFig x={800} y={900} s={0.95} o={CAST.derya} t={t} dir={-1} mouth="smile" eyes="sad" />)) },
  { c: "Bozo'nun sesi ilk kez", tone: "night", r: cam([2.8, 3], face(1150), undefined, sc(salon, F("bozo", 1150, { eyes: "sad", brow: "sad", mouth: "frown" }))) },
  { c: "Yıllarca bu kızın varlığını", tone: "night", r: cam([2.4, 2.6], face(1150), undefined, sc(salon, F("bozo", 1150, { eyes: "sad", brow: "sad", talk: true }))), html: q("“TEK SEBEBİ BUYDU.”", 76) },
  { c: "Benim kızım olduğu öğrenildiği", tone: "night", r: cam([1, 1.08], [960, 560], undefined, sc(bahceGece, (t) => <DFig x={220} y={720} s={0.62} o={CAST.ada} t={t} pose={P.hold} mouth="flat" />)), html: big("HEDEF: ADA", "#E63946", 96) },
  { c: "Dün gece Rüzgar'a söyledim", tone: "night", r: cam([1.2, 1.3], [960, 600], undefined, sc(salon, F("haydar", 700, { brow: "worried" }), F("bozo", 1150, { dir: -1, talk: true }))) },
  { c: "Aradaki farkı sen hesapla", sfx: "boom", tone: "night", r: cam([2.6, 2.8], face(1150), undefined, sc(salon, F("bozo", 1150, { dir: -1, talk: true, brow: "angry" }))), html: q("“FARKI SEN HESAPLA.”", 80) },
  { c: "Haydar Ali yerinden kalkıyor", tone: "night", r: cam([1, 1.1], [900, 600], undefined, sc(oda, Wk("haydar", 500, 820, { brow: "angry" }), F("sultan", 1100, { dir: -1, pose: P.hold, holdR: tab, eyes: "down" }))) },
  { c: "Sultan'ın indirdiği silahı alıyor", sfx: "tick", tone: "night", r: cam([3, 3.2], [960, 640], undefined, sc(oda, F("haydar", 860, { pose: P.reach, brow: "angry" }), F("sultan", 1080, { dir: -1, pose: P.reach, holdR: tab, eyes: "down" }))), html: tg("ŞARJÖR: ÇIKTI", "#1B4F9C") },
  { c: "Bu gece kimse kimseyi", tone: "night", r: cam([2.6, 2.8], face(860), undefined, sc(oda, F("haydar", 860, { talk: true, brow: "angry" }))), html: q("“ÖNCE KIZI KORUYACAĞIZ.”", 76) },
  { c: "Sultan ikisine bakıyor", tone: "night", r: cam([2.8, 3], face(1080), undefined, sc(oda, F("sultan", 1080, { dir: -1, look: -1, eyes: "sad" }))) },
  { c: "Üç yıl boyunca aynı sofrada", tone: "night", r: cam([1, 1.08], [960, 600], undefined, sc(hucre, F("bozo", 700, { pose: P.sit, y: 810, s: 1, mouth: "smile" }), F("haydar", 1150, { dir: -1, pose: P.sit, y: 810, s: 1, mouth: "smile" }))) },
  { c: "Biri ajan, biri kartel", tone: "night", r: cam([1.2, 1.3], [960, 600], undefined, sc(oda, F("haydar", 700), F("bozo", 1150, { dir: -1 }))), html: (t, a) => <><Tag t={t} at={a + 0.3} text="AJAN" c="#1B4F9C" x={420} y={180} /><Tag t={t} at={a + 0.9} text="KARTEL BABASI" c="#E63946" x={1180} y={180} /></> },
  { c: "Ve ikisi de aynı kızı", sfx: "boom", tone: "night", r: cam([1, 1.1], [960, 560], undefined, sc((t, a) => <Konak t={t} room="kapi" door={ramp(t, a + 1, a + 2)} />, Wk("haydar", 300, 820, { s: 1, y: 900 }), Wk("bozo", 1700, 1100, { s: 1, y: 900 }))) },

  // ── 2. BÖLÜM: İKİ AJAN ──
  { c: "İkinci bölüm. İki ajan", ...bolum("İKİNCİ BÖLÜM", "İKİ AJAN") },
  { c: "Aynı saatlerde, Hanoğlu", tone: "night", r: cam([1, 1.1], [960, 560], [1060, 560], sc(bahceGece, F("ceylan", 1100, { dir: -1, eyes: "down", brow: "sad" }))) },
  { c: "Sultan'dan duyduğu cümle", tone: "night", r: cam([2.8, 3], face(1100), undefined, sc(bahceGece, F("ceylan", 1100, { dir: -1, eyes: "sad", brow: "worried" }))), html: q("“HAYDAR ALİ BİR AJAN.”", 76, 0.3) },
  { c: "Ceylan'ın elinde küçük", sfx: "tick", tone: "night", r: cam([3.2, 3.4], [1150, 680], undefined, sc(bahceGece, F("ceylan", 1100, { dir: -1, pose: P.phone, holdR: tel(0.8), eyes: "down" }))) },
  { c: "Tek bir numara kayıtlı", sfx: "buzz", tone: "night", r: telKart([{ who: "REHBER", text: "1 kişi: YILMAZ" }], "01:12"), html: tg("TEK NUMARA: YILMAZ", "#1B4F9C") },
  { c: "Arkasında bir dal kırılıyor", sfx: "knock", tone: "night", r: cam([1, 1.06], [960, 600], undefined, sc(bahceGece, F("ceylan", 1100, { dir: -1, pose: P.phone, holdR: tel(0.8), eyes: "wide" })), 4) },
  { c: "Ceylan dönüyor. Haydar", tone: "night", r: cam([1.3, 1.4], [960, 620], undefined, sc(bahceGece, F("ceylan", 1100, { dir: -1, eyes: "wide", mouth: "o" }), Wk("haydar", 300, 720))) },
  { c: "Bir süre ikisi de konuşmuyor", sfx: "drone", tone: "night", r: cam([1.5, 1.6], [910, 620], undefined, sc(bahceGece, F("haydar", 720, { eyes: "sad" }), F("ceylan", 1100, { dir: -1, eyes: "sad" }))) },
  { c: "Sonra Haydar Ali, Ceylan'ın elindeki", tone: "night", r: cam([3, 3.2], [1000, 660], undefined, sc(bahceGece, F("haydar", 720, { eyes: "down" }), F("ceylan", 1100, { dir: -1, pose: P.hold, holdR: tel(0.8) }))) },
  { c: "Ve gülüyor. Acı bir gülüş", tone: "night", r: cam([2.8, 3], face(720), undefined, sc(bahceGece, F("haydar", 720, { mouth: "smirk", eyes: "sad" }))) },
  { c: "O telefondan bende de var", sfx: "boom", tone: "night", r: cam([2.4, 2.6], [800, 660], undefined, sc(bahceGece, F("haydar", 720, { pose: P.hold, holdR: tel(0.8), talk: true }))), html: q("“O TELEFONDAN BENDE DE VAR.”", 72) },
  { c: "Ceylan'ın gözleri doluyor", tone: "night", r: cam([2.8, 3], face(1100), undefined, sc(bahceGece, F("ceylan", 1100, { dir: -1, tear: 1, eyes: "sad", brow: "sad" }))) },
  { c: "Yılmaz bana, seni korumanın", tone: "night", r: cam([1, 1.1], [960, 560], undefined, sc(ofis, F("yilmaz", 700, { talk: true, mouth: "smirk" }), F("ceylan", 1180, { dir: -1, eyes: "sad" }))), html: tg("BİR YIL ÖNCE · YILMAZ'IN OFİSİ", "#1B4F9C") },
  { c: "Sen hapisteyken", tone: "cool", r: cam([1.2, 1.3], [960, 600], undefined, sc(hucre, F("haydar", 960, { pose: P.sit, y: 810, s: 1, eyes: "down" }))) },
  { c: "Haydar Ali bir adım yaklaşıyor", tone: "night", r: cam([1.4, 1.5], [940, 620], undefined, sc(bahceGece, Wk("haydar", 720, 860, {}, 0.1, 1.2), F("ceylan", 1100, { dir: -1, tear: 0.6, eyes: "sad" }))) },
  { c: "Bana da, seni korumanın", tone: "night", r: cam([2.6, 2.8], face(860), undefined, sc(bahceGece, F("haydar", 860, { talk: true, brow: "sad" }))), html: q("“SENDEN UZAK DURMAK.”", 80) },
  { c: "İkisi aynı anda anlıyor", sfx: "boom", tone: "night", r: cam([1.6, 1.7], [980, 600], undefined, sc(bahceGece, F("haydar", 860, { eyes: "wide" }), F("ceylan", 1100, { dir: -1, eyes: "wide" }))) },
  { c: "Aynı adam, aynı yalanı", tone: "night", r: cam([1.2, 1.3], [960, 600], undefined, sc(ofis, F("yilmaz", 960, { mouth: "smirk", pose: P.phone, holdR: tel() }))), html: big("AYNI YALAN · İKİ KULAK", "#FFC800", 84) },
  { c: "Bizi ayıran Bozo değildi", tone: "night", r: cam([2.6, 2.8], face(1100), undefined, sc(bahceGece, F("ceylan", 1100, { dir: -1, talk: true, brow: "angry" }))), html: q("“YILMAZ'DI.”", 110, 0.5) },
  { c: "Haydar Ali'nin çenesi kasılıyor", tone: "night", r: cam([2.8, 3], face(860), undefined, sc(bahceGece, F("haydar", 860, { brow: "angry", mouth: "tight" }))), html: q("“PEKİ NEDEN?”", 90, 0.5) },
  { c: "Cevap, bahçe kapısından geliyor", sfx: "whoosh", tone: "night", r: cam([1, 1.1], [960, 600], undefined, sc(bahceGece, F("haydar", 860), F("ceylan", 1100, { dir: -1 }), Wk("melek", 200, 560, { pose: P.hold, holdR: tepsi, s: 1 }))) },
  { c: "Tepside bir kahve fincanı", sfx: "ding", tone: "warm", r: cam([3.4, 3.6], [610, 760], undefined, sc(bahceGece, F("melek", 560, { s: 1, pose: P.hold, holdR: <>{tepsi}<g transform="translate(30,4)">{tel(0.6)}</g></> }))), html: tg("FİNCANIN ALTINDA: TELEFON", "#E63946") },
  { c: "Abi, diyor Melek", tone: "night", r: cam([2.8, 3], face(560, 1), undefined, sc(bahceGece, F("melek", 560, { s: 1, talk: true, brow: "up" }))) },
  { c: "Herkes beni sadece kahve", tone: "night", r: cam([1.1, 1.2], [960, 560], undefined, sc(salon, F("bozo", 1300, { dir: -1 }), F("efraim", 1550, { dir: -1 }), Wk("melek", 300, 700, { pose: P.hold, holdR: tepsi, s: 1 }))), html: q("“KAHVE GETİREN KIZ.”", 76) },
  { c: "O yüzden her şeyi duyuyorum", sfx: "boom", tone: "night", r: cam([2.6, 2.8], face(560, 1), undefined, sc(bahceGece, F("melek", 560, { s: 1, talk: true, mouth: "smirk" }))), html: q("“HER ŞEYİ DUYUYORUM.”", 80) },
  { c: "Telefonu uzatıyor", tone: "night", r: cam([2.6, 2.8], [720, 640], undefined, sc(bahceGece, F("melek", 600, { s: 1, pose: P.reach, holdR: tel(0.8) }), F("haydar", 860, { dir: -1, pose: P.reach }))) },
  { c: "Ekranda bir ses kaydı", sfx: "static", tone: "night", r: cam([1, 1.1], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#121520" /><Kayit x={960} y={560} s={2.4} t={t} /></>) },
  { c: "Yılmaz'ın sesi", tone: "night", r: cam([1.1, 1.2], [960, 560], undefined, sc(ofis, F("yilmaz", 960, { pose: P.phone, holdR: tel(), talk: true, mouth: "smirk" }))), html: q("“KARTEL ÇÖKÜNCE KONSEY'İN YOLU AÇILACAK.”", 58, 0.3) },
  { c: "Benim payım da hazır olsun", sfx: "boom", tone: "night", r: cam([2.8, 3], face(960), undefined, sc(ofis, F("yilmaz", 960, { talk: true, mouth: "smirk" }))), html: q("“BENİM PAYIM DA HAZIR OLSUN.”", 72) },
  { c: "Haydar Ali kaydı iki kez", tone: "night", r: cam([2.6, 2.8], face(860), undefined, sc(bahceGece, F("haydar", 860, { pose: P.phone, holdR: tel(0.8), eyes: "down", brow: "angry" }))) },
  { c: "Sonra kardeşine bakıyor", tone: "night", r: cam([1.6, 1.7], [730, 620], undefined, sc(bahceGece, F("melek", 600, { s: 1, mouth: "smile" }), F("haydar", 860, { dir: -1, eyes: "sad" }))) },
  { c: "Yıllardır koruduğunu sandığı", tone: "warm", r: cam([2.6, 2.8], face(600, 1), undefined, sc(bahceGece, F("melek", 600, { s: 1, mouth: "smile", eyes: "happy" }))) },
  { c: "Ne zamandan beri", tone: "night", r: cam([2.6, 2.8], face(860), undefined, sc(bahceGece, F("haydar", 860, { dir: -1, talk: true, brow: "up" }))), html: q("“NE ZAMANDAN BERİ?”", 80) },
  { c: "Melek omuz silkiyor", tone: "warm", r: cam([2.2, 2.4], face(600, 1), undefined, sc(bahceGece, F("melek", 600, { s: 1, pose: P.shrug, mouth: "smile" }))) },
  { c: "Sen beni korudun abi", sfx: "ding", tone: "warm", r: cam([1.4, 1.6], [740, 620], undefined, sc(bahceGece, F("melek", 640, { s: 1, pose: HUG, mouth: "smile", eyes: "closed" }), F("haydar", 840, { dir: -1, pose: HUG, eyes: "closed", mouth: "smile" }))), html: q("“BEN DE SENİ.”", 90, 0.5) },

  // ── 3. BÖLÜM: HASTANE ──
  { c: "Üçüncü bölüm. Hastane", ...bolum("ÜÇÜNCÜ BÖLÜM", "HASTANE") },
  { c: "Şafak sökerken Merdan", sfx: "tick", tone: "cool", r: cam([2.2, 2.4], [560, 500], undefined, sc(hastaneSabah, merdanYatak({ eyes: "squint" }))) },
  { c: "Odada tek kişi var", tone: "cool", r: cam([1, 1.08], [960, 600], undefined, sc(hastaneSabah, merdanYatak({ eyes: "open" }), F("haydar", 1400, { dir: -1, eyes: "down" }))) },
  { c: "Merdan'ın sesi kısık", tone: "cool", r: cam([2.4, 2.6], [520, 440], undefined, sc(hastaneSabah, merdanYatak({ talk: true, mouth: "smirk" }))), html: q("“SEN DAHA YORGUN GÖRÜNÜYORSUN.”", 66) },
  { c: "Haydar Ali bir sandalye çekiyor", sfx: "knock", tone: "cool", r: cam([1.2, 1.3], [1000, 640], undefined, sc(hastaneSabah, merdanYatak(), Wk("haydar", 1400, 1180, { dir: -1 }, 0.1, 1.6))) },
  { c: "Uzun bir nefes alıyor", tone: "cool", r: cam([2.8, 3], face(1180), undefined, sc(hastaneSabah, F("haydar", 1180, { dir: -1, eyes: "closed", mouth: "flat" }))) },
  { c: "Merdan. Babanı ben öldürdüm", sfx: "boom", tone: "cool", r: cam([2.6, 2.8], face(1180), undefined, sc(hastaneSabah, F("haydar", 1180, { dir: -1, eyes: "sad", talk: true }))), html: q("“BABANI BEN ÖLDÜRDÜM.”", 80) },
  { c: "Ceylan'a evlenme teklif", tone: "cool", r: cam([1.6, 1.7], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#2A1A20" /><Yuzuk x={960} y={600} s={2.2} t={t} open={1} /></>), html: tg("O GECE · HİÇ VERİLMEYEN YÜZÜK", "#E63946") },
  { c: "Merdan uzun süre konuşmuyor", sfx: "tick", tone: "cool", r: cam([2.2, 2.4], [380, 320], undefined, sc(hastaneSabah, merdanYatak({ eyes: "closed" }))) },
  { c: "Monitörün sesi odayı", tone: "cool", r: cam([3, 3.2], [380, 320], undefined, sc(hastaneSabah)) },
  { c: "Biliyordum, diyor", sfx: "boom", tone: "cool", r: cam([2.4, 2.6], [520, 440], undefined, sc(hastaneSabah, merdanYatak({ talk: true, eyes: "sad" }))), html: q("“BİLİYORDUM.”", 100) },
  { c: "Babam ölmeden önce bir isim", tone: "cool", r: cam([1.4, 1.5], [800, 560], undefined, sc(hastaneSabah, merdanYatak({ talk: true, eyes: "sad" }), F("haydar", 1180, { dir: -1, eyes: "wide" }))) },
  { c: "Konsey'in toplandığı yeri", sfx: "drone", tone: "night", r: cam([1, 1.12], [960, 560], undefined, (t) => <Konsey t={t} lamp={0.6} />), html: big("KONSEY'İN BULUŞMA YERİ", "#FFC800", 80) },
  { c: "Yıllardır kimseye söylemedim", tone: "cool", r: cam([2.4, 2.6], [520, 440], undefined, sc(hastaneSabah, merdanYatak({ talk: true, eyes: "down" }))) },
  { c: "Haydar Ali şaşkın", tone: "cool", r: cam([2.6, 2.8], face(1180), undefined, sc(hastaneSabah, F("haydar", 1180, { dir: -1, eyes: "wide", talk: true }))), html: q("“NEDEN BANA SÖYLÜYORSUN?”", 70) },
  { c: "Merdan acıyla gülümsüyor", tone: "warm", r: cam([2.4, 2.6], [520, 440], undefined, sc(hastaneSabah, merdanYatak({ mouth: "smile", eyes: "sad" }))) },
  { c: "Bu ailede bunu yapan", sfx: "ding", tone: "warm", r: cam([1.3, 1.4], [820, 560], undefined, sc(hastaneSabah, merdanYatak({ talk: true, mouth: "smile" }), F("haydar", 1180, { dir: -1, eyes: "sad" }))), html: q("“BU AİLEDE İLK ADAMSIN.”", 74) },
  { c: "Ve o ismi fısıldıyor", sfx: "drone", tone: "night", r: cam([2.6, 2.8], [520, 440], undefined, sc(hastaneSabah, merdanYatak({ talk: true, eyes: "squint" }))) },
  { c: "Eski Tersane. Haliç'teki", sfx: "boom", tone: "night", r: cam([1.15, 1], [960, 540], undefined, ters({ lights: 0 })), html: (t, a) => <><Txt t={t} at={a + 0.2} text="ESKİ TERSANE" y={300} size={130} color="#FFC800" /><Txt t={t} at={a + 1} text="Haliç · Terk edilmiş havuz" y={480} size={60} color="#FFFFFF" /></> },
  { c: "Kapı açılıyor. İçeri Rüzgar", sfx: "knock", tone: "cool", r: cam([1, 1.1], [1100, 600], undefined, sc(hastaneSabah, merdanYatak({ eyes: "wide" }), F("haydar", 1180, { dir: -1 }), Wk("ruzgar", 1950, 1600, { dir: -1 }, 0.1, 1.8))) },
  { c: "Merdan'ı vuran adam", tone: "cool", r: cam([2.6, 2.8], face(1600), undefined, sc(hastaneSabah, F("ruzgar", 1600, { dir: -1, brow: "angry", mouth: "tight" }))), html: tg("MERDAN'I VURAN ADAM", "#E63946") },
  { c: "Haydar Ali ayağa fırlıyor", sfx: "boom", tone: "cool", r: cam([1.3, 1.4], [1380, 600], undefined, sc(hastaneSabah, F("haydar", 1180, { pose: P.shock, brow: "angry" }), F("ruzgar", 1600, { dir: -1 })), 4) },
  { c: "Ama Rüzgar ellerini havaya", tone: "cool", r: cam([1.4, 1.5], [1400, 600], undefined, sc(hastaneSabah, F("haydar", 1180, { brow: "angry" }), F("ruzgar", 1600, { dir: -1, pose: HANDS_UP, eyes: "sad" }))) },
  { c: "Kavga etmeye gelmedim", tone: "cool", r: cam([2.6, 2.8], face(1600), undefined, sc(hastaneSabah, F("ruzgar", 1600, { dir: -1, pose: HANDS_UP, talk: true }))), html: q("“KAVGA ETMEYE GELMEDİM.”", 76) },
  { c: "Ve bu sabah Ada'nın okulunun", sfx: "drone", tone: "cool", r: cam([1, 1.1], [960, 600], undefined, sc(okul, (t) => <SiyahMinibus x={1500} y={900} s={0.7} />, (t) => <SiyahMinibus x={400} y={940} s={0.7} dir={-1} />)), html: tg("OKULUN ÖNÜNDE 2 YABANCI ARABA", "#E63946") },
  { c: "Ben Bozo'dan nefret ediyorum", tone: "cool", r: cam([2.6, 2.8], face(1600), undefined, sc(hastaneSabah, F("ruzgar", 1600, { dir: -1, talk: true, brow: "angry" }))) },
  { c: "Ama o kız benim kardeşimin", sfx: "ding", tone: "warm", r: cam([2.6, 2.8], face(1600), undefined, sc(hastaneSabah, F("ruzgar", 1600, { dir: -1, talk: true, eyes: "sad", brow: "sad" }))), html: q("“KARDEŞİMİN BÜYÜTTÜĞÜ KIZ.”", 70) },
  { c: "Haydar Ali, Rüzgar'a bakıyor", tone: "cool", r: cam([1.5, 1.6], [1390, 600], undefined, sc(hastaneSabah, F("haydar", 1180), F("ruzgar", 1600, { dir: -1 }))) },
  { c: "Yıllardır birbirini vuran üç aile", sfx: "boom", tone: "cool", r: cam([1, 1.08], [1000, 600], undefined, sc(hastaneSabah, merdanYatak(), F("haydar", 1180), F("ruzgar", 1600, { dir: -1 }))), html: big("3 AİLE · TEK ODA", "#FFC800", 90) },
  { c: "O zaman, diyor Haydar", sfx: "ding", tone: "warm", r: cam([1.6, 1.7], [1390, 640], undefined, sc(hastaneSabah, F("haydar", 1240, { pose: P.reach, talk: true }), F("ruzgar", 1540, { dir: -1, pose: P.reach }))), html: q("“BU SEFER AYNI TARAFTAYIZ.”", 74) },

  // ── 4. BÖLÜM: OKUL KAPISI ──
  { c: "Dördüncü bölüm. Okul", ...bolum("DÖRDÜNCÜ BÖLÜM", "OKUL KAPISI") },
  { c: "Öğle vakti. Ada'nın okulunun", sfx: "whoosh", tone: "warm", r: cam([1, 1.1], [960, 540], [1060, 540], okul) },
  { c: "Zil çalıyor, çocuklar koşarak", sfx: "ding", tone: "warm", r: cam([1.2, 1.3], [1100, 640], undefined, sc(okul)) },
  { c: "Derya, kapının önünde", tone: "warm", r: cam([1.4, 1.5], [800, 640], undefined, sc(okul, F("derya", 700, { s: 0.85, y: 760, mouth: "smile" }))) },
  { c: "Karşı kaldırımda siyah", sfx: "drone", tone: "cool", r: cam([1.2, 1.3], [1400, 760], undefined, sc(okul, (t) => <SiyahMinibus x={1500} y={1010} s={0.85} t={0} />)) },
  { c: "Camları filmli. Motoru", tone: "cool", r: cam([2.4, 2.6], [1500, 800], undefined, sc(okul, (t) => <SiyahMinibus x={1500} y={1010 + Math.sin(t * 40) * 1.5} s={0.85} />)), html: tg("MOTOR: ÇALIŞIYOR", "#E63946") },
  { c: "Ada annesini görüyor", tone: "warm", r: cam([1.1, 1.2], [800, 640], undefined, sc(okul, F("derya", 640, { s: 0.85, y: 760, pose: P.wave, mouth: "smile" }), Run("ada", 1000, 760, { s: 0.55, y: 770, mouth: "grin" }, 0.3, 2.5))) },
  { c: "Minibüsün kapısı kayarak", sfx: "whoosh", tone: "cool", r: cam([1.2, 1.3], [1300, 760], undefined, sc(okul, (t, a) => <SiyahMinibus x={1500} y={1010} s={0.85} door={ramp(t, a + 0.2, a + 0.9)} />, (t, a) => <DFig x={1360} y={1010} s={0.95} o={CAST.konsey} sil="#121216" t={t} op={ramp(t, a + 0.9, a + 1.2)} />, (t, a) => <DFig x={1230} y={1010} s={0.95} o={CAST.konsey} sil="#121216" t={t} op={ramp(t, a + 1.2, a + 1.5)} />)) },
  { c: "Ama Ada'ya ulaşamıyorlar", sfx: "boom", tone: "cool", r: cam([1, 1.06], [960, 640], undefined, sc(okul, (t, a) => <Motor x={lerp(-300, 1000, ramp(t, a, a + 1.1))} y={1010} s={0.8} t={t} tilt={-6 * (1 - ramp(t, a + 0.9, a + 1.3))} rider={<g transform="translate(0,20) scale(0.62)"><DFig x={0} y={0} o={CAST.ruzgar} t={t} pose={{ l: [70, 90], r: [70, 90], ll: [70, 20], rl: [70, 20], lean: 10 }} /></g>} />, (t) => <DFig x={1300} y={1010} s={0.95} o={CAST.konsey} sil="#121216" t={t} />), 3) },
  { c: "Rüzgar. Kaskını çıkarıyor", tone: "cool", r: cam([2.4, 2.6], [1000, 640], undefined, sc(okul, F("ruzgar", 1000, { y: 1010, brow: "angry", mouth: "tight" }))) },
  { c: "Bu kıza dokunan", sfx: "boom", tone: "cool", r: cam([2.6, 2.8], face(1000), undefined, sc(okul, F("ruzgar", 1000, { y: 1010, brow: "angry", talk: true }))), html: q("“ÖNCE BENİMLE KONUŞUR.”", 80) },
  { c: "Adamlar bir an duraksıyor", tone: "cool", r: cam([1.5, 1.6], [1300, 620], undefined, sc(okul, (t) => <DFig x={1230} y={1010} s={0.95} o={CAST.konsey} sil="#121216" t={t} />, (t) => <DFig x={1380} y={1010} s={0.95} o={CAST.konsey} sil="#121216" t={t} dir={-1} />)) },
  { c: "Arkadan Yavuz ve Efraim", sfx: "whistle", tone: "cool", r: cam([1, 1.06], [960, 640], undefined, sc(okul, (t, a) => <g transform={`translate(${lerp(-500, 300, ramp(t, a, a + 1.2))},0)`}><SiyahMinibus x={0} y={1010} s={0.8} t={t} /></g>, F("ruzgar", 1000, { y: 1010 }))), html: tg("YAVUZ + EFRAİM", "#1B4F9C") },
  { c: "Minibüs, kapısı açık", sfx: "whoosh", tone: "cool", r: cam([1, 1.08], [960, 640], undefined, sc(okul, (t, a) => <SiyahMinibus x={lerp(1500, 2600, ramp(t, a + 0.2, a + 1.4))} y={1010} s={0.85} t={t} door={1} />)) },
  { c: "Derya, Ada'yı kucağına", tone: "warm", r: cam([1.6, 1.7], [760, 560], undefined, sc(okul, F("derya", 760, { s: 0.95, y: 900, pose: HUG, eyes: "closed", brow: "sad" }), (t) => <DFig x={800} y={760} s={0.55} o={CAST.ada} t={t} pose={HUG} eyes="closed" />)) },
  { c: "Titriyor. Rüzgar'a bakıyor", tone: "warm", r: cam([2.6, 2.8], face(760, 0.95), undefined, sc(okul, F("derya", 760, { s: 0.95, y: 900, tear: 1, eyes: "sad", brow: "worried", dir: 1 }))) },
  { c: "Yıllardır kocasının katilinin", tone: "warm", r: cam([1.4, 1.5], [900, 560], undefined, sc(okul, F("derya", 760, { s: 0.95, y: 900, eyes: "sad" }), F("ruzgar", 1080, { s: 0.95, y: 900, dir: -1, eyes: "sad" }))) },
  { c: "Neden? diye soruyor Derya", tone: "warm", r: cam([2.6, 2.8], face(760, 0.95), undefined, sc(okul, F("derya", 760, { s: 0.95, y: 900, talk: true, tear: 0.6 }))), html: q("“NEDEN?”", 100) },
  { c: "Rüzgar, Ada'nın saçını okşuyor", sfx: "ding", tone: "gold", r: cam([1.8, 1.9], [960, 600], undefined, sc(okul, F("ruzgar", 1040, { s: 0.95, y: 900, dir: -1, pose: P.reach, mouth: "smile", eyes: "sad" }), (t) => <DFig x={880} y={900} s={0.55} o={CAST.ada} t={t} mouth="smile" lookY={-1} />)), html: q("“ONUN HATIRINA.”", 90, 0.5) },
  { c: "O akşam konakta, Ceylan ile Derya", sfx: "whoosh", tone: "warm", r: cam([1, 1.08], [960, 600], undefined, sc(mutfak, F("ceylan", 700, { brow: "angry" }), F("derya", 1300, { dir: -1, brow: "angry" }))) },
  { c: "Aylardır birbirine tek kelime", tone: "warm", r: cam([1.2, 1.3], [1000, 600], undefined, sc(mutfak, F("ceylan", 700, { mouth: "tight" }), F("derya", 1300, { dir: -1, mouth: "tight" }))), html: (t, a) => <><Tag t={t} at={a + 0.4} text="BOZO'NUN KARISI" c="#7A1F2E" x={360} y={180} /><Tag t={t} at={a + 1.2} text="KIZININ ANNESİ" c="#466350" x={1180} y={180} /></> },
  { c: "Derya önce konuşuyor", tone: "warm", r: cam([2.6, 2.8], face(1300), undefined, sc(mutfak, F("derya", 1300, { dir: -1, talk: true, eyes: "sad" }))), html: q("“SENDEN NEFRET ETMEM GEREKİYORDU.”", 64) },
  { c: "Ve fark ettim ki asıl düşman", tone: "warm", r: cam([2.6, 2.8], face(1300), undefined, sc(mutfak, F("derya", 1300, { dir: -1, talk: true, brow: "worried" }))), html: q("“ASIL DÜŞMAN İÇERİDE DEĞİL.”", 70) },
  { c: "Ceylan bir fincan çay uzatıyor", sfx: "ding", tone: "warm", r: cam([2, 2.2], [1000, 680], undefined, sc(mutfak, F("ceylan", 860, { pose: P.reach, holdR: cay }), F("derya", 1150, { dir: -1, pose: P.reach }))) },
  { c: "Bu evde herkes birbirine", tone: "warm", r: cam([2.6, 2.8], face(860), undefined, sc(mutfak, F("ceylan", 860, { talk: true, brow: "angry" }))), html: q("“YAKINDA YÜZÜNÜ GÖRECEĞİZ.”", 70) },
  { c: "İki kadın aynı masada", sfx: "drone", tone: "warm", r: cam([1.1, 1.2], [560, 640], undefined, sc(mutfak, F("ceylan", 420, { pose: P.sit, y: 900, s: 1 }), F("derya", 700, { pose: P.sit, y: 900, s: 1, dir: -1 }))) },
  { c: "Sadece aynı korku", tone: "warm", r: cam([1.8, 1.9], [560, 600], undefined, sc(mutfak, F("ceylan", 420, { pose: P.sit, y: 900, s: 1, mouth: "tight" }), F("derya", 700, { pose: P.sit, y: 900, s: 1, dir: -1, mouth: "tight" }))) },

  // ── 5. BÖLÜM: PLAN ──
  { c: "Beşinci bölüm. Plan", ...bolum("BEŞİNCİ BÖLÜM", "PLAN") },
  { c: "Akşam, konağın büyük salonu", tone: "warm", r: cam([1, 1.06], [960, 560], undefined, sc(salon, F("bozo", 960, { s: 0.85, y: 900 }), F("haydar", 700, { s: 0.85, y: 920 }), F("ceylan", 520, { s: 0.85, y: 940 }), F("sultan", 1220, { s: 0.85, y: 920, dir: -1 }), F("ruzgar", 1400, { s: 0.85, y: 940, dir: -1 }), F("melek", 340, { s: 0.8, y: 960 }), F("efraim", 1580, { s: 0.85, y: 960, dir: -1 }))) },
  { c: "Gülsüm Ana herkese çay", sfx: "ding", tone: "warm", r: cam([1.6, 1.7], [700, 640], undefined, sc(salon, Wk("gulsum", 400, 860, { pose: P.hold, holdR: tepsi, mouth: "frown", brow: "worried" }, 0.1, 3))) },
  { c: "Bozo konuşuyor", tone: "warm", r: cam([2.6, 2.8], face(960), undefined, sc(salon, F("bozo", 960, { talk: true }))), html: q("“ONLARA BİR AJAN VERECEĞİZ.”", 72) },
  { c: "Herkes Haydar Ali'ye bakıyor", sfx: "drone", tone: "warm", r: cam([1.2, 1.3], [800, 600], undefined, sc(salon, F("haydar", 800, { eyes: "wide" }), F("ceylan", 560, { look: 1, eyes: "wide" }), F("sultan", 1060, { dir: -1, eyes: "wide" }))) },
  { c: "Ama Bozo başını sallıyor", sfx: "boom", tone: "warm", r: cam([2.6, 2.8], face(960), undefined, sc(salon, F("bozo", 960, { talk: true, mouth: "smirk" }))), html: q("“HAYDAR'I DEĞİL. YILMAZ'I.”", 80) },
  { c: "Plan basit ama tehlikeli", tone: "cool", r: kart("#0E1222"), html: big("PLAN", "#FFC800", 130, 360) },
  { c: "Ceylan, Yılmaz'ı arayacak", sfx: "tick", tone: "cool", r: cam([1.1, 1.2], [960, 600], undefined, sc(oda, F("ceylan", 960, { pose: P.phone, holdR: tel() }))), html: tg("ADIM 1: CEYLAN ARAR", "#1B4F9C") },
  { c: "Yılmaz, payını kurtarmak", sfx: "tick", tone: "cool", r: cam([1, 1.1], [960, 560], undefined, ters({})), html: tg("ADIM 2: YILMAZ HAYDAR'I TERSANE'YE GETİRİR", "#1B4F9C") },
  { c: "Ve Konsey'in bütün üyeleri", sfx: "tick", tone: "night", r: cam([1, 1.1], [960, 560], undefined, (t) => <Konsey t={t} />), html: tg("ADIM 3: KONSEY ORADA OLUR", "#E63946") },
  { c: "Sultan sessizce dinliyor", tone: "warm", r: cam([2.6, 2.8], face(1060), undefined, sc(salon, F("sultan", 1060, { dir: -1, eyes: "down" }))) },
  { c: "Sonra ayağa kalkıyor", sfx: "boom", tone: "warm", r: cam([1.6, 1.7], face(1060, 1.1, 1.6), undefined, sc(salon, F("sultan", 1060, { dir: -1, brow: "angry", talk: true }))), html: q("“BEN DE GELİYORUM.”", 84) },
  { c: "Bozo itiraz ediyor", tone: "warm", r: cam([2.6, 2.8], face(760), undefined, sc(salon, F("bozo", 760, { brow: "angry", talk: true, pose: P.point }))), html: q("“OLMAZ.”", 100) },
  { c: "Sultan'ın sesi ilk kez", tone: "warm", r: cam([2.6, 2.8], face(1060), undefined, sc(salon, F("sultan", 1060, { dir: -1, brow: "angry", talk: true }))) },
  { c: "Kiminle nişanlanacağıma", tone: "warm", r: cam([1.2, 1.3], [910, 600], undefined, sc(salon, F("bozo", 760, { eyes: "down" }), F("sultan", 1060, { dir: -1, brow: "angry", talk: true, pose: P.point }))), html: q("“KİMİNLE EVLENECEĞİME.”", 76) },
  { c: "Bu sefer kendi kararımı", sfx: "boom", tone: "gold", r: cam([2.8, 3], face(1060), undefined, sc(salon, F("sultan", 1060, { dir: -1, brow: "angry", talk: true }))), html: q("“KENDİ KARARIMI BEN VERİYORUM.”", 70) },
  { c: "Masada bir sessizlik", sfx: "drone", tone: "warm", r: cam([1, 1.06], [960, 560], undefined, sc(salon, F("bozo", 760, { eyes: "down" }), F("sultan", 1060, { dir: -1 }), F("ruzgar", 1400, { dir: -1 }))) },
  { c: "Sonra Rüzgar konuşuyor", tone: "warm", r: cam([2.6, 2.8], face(1400), undefined, sc(salon, F("ruzgar", 1400, { dir: -1, talk: true }))), html: q("“ADA'YI BEN KORUYACAĞIM. SÖZ.”", 72) },
  { c: "Bozo, yıllardır düşmanı olan", tone: "warm", r: cam([1.3, 1.4], [1080, 600], undefined, sc(salon, F("bozo", 760, { look: 1 }), F("ruzgar", 1400, { dir: -1 }))) },
  { c: "Ve ilk kez başını sallıyor", sfx: "ding", tone: "gold", r: cam([2.8, 3], face(760), undefined, sc(salon, F("bozo", 760, { look: 1, eyes: "squint", mouth: "smile" }))) },
  { c: "Gece yarısı. Ceylan telefonu", sfx: "buzz", tone: "night", r: cam([1, 1.08], [800, 600], undefined, sc(oda, F("ceylan", 700, { pose: P.phone, holdR: tel() }), F("haydar", 1100, { dir: -1, pose: P.sit, y: 900, s: 1 }))) },
  { c: "Yılmaz'ın sesi her zamanki", tone: "night", r: cam([1.1, 1.2], [960, 560], undefined, sc(ofis, F("yilmaz", 960, { pose: P.phone, holdR: tel(), talk: true }))) },
  { c: "Ceylan rolünü kusursuz", tone: "night", r: cam([2.6, 2.8], face(700), undefined, sc(oda, F("ceylan", 700, { pose: P.phone, holdR: tel(), talk: true }))) },
  { c: "Ama Yılmaz tilki gibi", sfx: "drone", tone: "night", r: cam([2.6, 2.8], face(960), undefined, sc(ofis, F("yilmaz", 960, { pose: P.phone, holdR: tel(), eyes: "squint", mouth: "smirk" }))) },
  { c: "Sana Halide adını", sfx: "boom", tone: "night", r: cam([2.8, 3], face(960), undefined, sc(ofis, F("yilmaz", 960, { pose: P.phone, holdR: tel(), talk: true, eyes: "squint" }))), html: q("“HALİDE ADINI KİM VERMİŞTİ?”", 72) },
  { c: "Bu bir test", sfx: "tick", tone: "night", r: kart("#0E1222"), html: (t, a) => <><Txt t={t} at={a + 0.1} text="TEST" y={300} size={150} color="#E63946" /><Txt t={t} at={a + 1.2} text="Bir yanlış kelime = plan çöker" y={520} size={60} color="#FFFFFF" /></> },
  { c: "Ceylan bir saniye duraksıyor", tone: "night", r: cam([2.8, 3], face(700), undefined, sc(oda, F("ceylan", 700, { pose: P.phone, holdR: tel(), eyes: "wide", brow: "worried" }))) },
  { c: "Haydar Ali, masanın karşısından", sfx: "tick", tone: "night", r: cam([2.4, 2.6], [1060, 700], undefined, sc(oda, F("haydar", 1100, { dir: -1, pose: P.reach, holdR: <g><rect x={-60} y={-40} width={120} height={80} fill="#FFFDF4" stroke="#1B1210" strokeWidth={3} /><text x={0} y={10} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={22} fill="#1B1210">YILMAZ</text></g> }))) },
  { c: "Ceylan gözlerini kapatıyor", tone: "night", r: cam([2.8, 3], face(700), undefined, sc(oda, F("ceylan", 700, { pose: P.phone, holdR: tel(), eyes: "closed", talk: true }))) },
  { c: "Yılmaz'ın tarafında uzun", sfx: "drone", tone: "night", r: cam([2.6, 2.8], face(960), undefined, sc(ofis, F("yilmaz", 960, { pose: P.phone, holdR: tel(), mouth: "tight", eyes: "squint" }))) },
  { c: "Sonra Yılmaz gülüyor", sfx: "boom", tone: "night", r: cam([2.6, 2.8], face(960), undefined, sc(ofis, F("yilmaz", 960, { pose: P.phone, holdR: tel(), mouth: "grin" }))), html: q("“HÂLÂ BENİMSİN.”", 90) },
  { c: "Yarın gece, diyor Yılmaz", tone: "night", r: cam([1.2, 1.3], [960, 560], undefined, sc(ofis, F("yilmaz", 960, { pose: P.phone, holdR: tel(), talk: true }))), html: q("“HAYDAR ALİ'Yİ TERSANE'YE BEN GETİRECEĞİM.”", 58) },
  { c: "Ceylan telefonu kapatıyor", tone: "night", r: cam([3, 3.2], [720, 700], undefined, sc(oda, F("ceylan", 700, { pose: P.hold, eyes: "down" })), 2.5) },
  { c: "Elini tutuyor. Yıllar sonra", sfx: "ding", tone: "gold", r: cam([2.2, 2.4], [860, 700], undefined, sc(oda, F("ceylan", 760, { pose: P.reach, eyes: "sad" }), F("haydar", 980, { dir: -1, pose: P.reach, eyes: "sad" }))) },
  { c: "Bu iş bitince", tone: "gold", r: cam([2.6, 2.8], face(980), undefined, sc(oda, F("haydar", 980, { dir: -1, talk: true, eyes: "sad", mouth: "smile" }))), html: q("“SADECE SEN VE BEN.”", 84) },
  { c: "Ceylan cevap vermiyor", tone: "gold", r: cam([1.8, 2], [870, 640], undefined, sc(oda, F("ceylan", 760, { pose: P.reach, eyes: "closed", mouth: "smile" }), F("haydar", 980, { dir: -1, pose: P.reach, eyes: "closed" }))) },

  // ── 6. BÖLÜM: ESKİ TERSANE ──
  { c: "Altıncı bölüm. Eski", ...bolum("ALTINCI BÖLÜM", "ESKİ TERSANE") },
  { c: "Haliç'te yağmur", sfx: "drone", tone: "night", flash: true, r: cam([1, 1.1], [960, 520], undefined, ters({})) },
  { c: "Terk edilmiş havuzun dev vinçleri", tone: "night", r: cam([1.6, 1.4], [300, 300], [1540, 300], ters({ crane: 0.5 })) },
  { c: "Yılmaz'ın arabası paslı", sfx: "whoosh", tone: "night", r: cam([1, 1.06], [960, 560], undefined, sc(ters({}), (t, a) => <g transform={`translate(${lerp(2200, 1100, ramp(t, a, a + 2))},0)`}><SiyahMinibus x={0} y={600} s={0.6} t={t} dir={-1} /></g>)) },
  { c: "Arka koltukta, elleri bağlı", tone: "night", r: cam([2.4, 2.6], face(960), undefined, sc(ters({}), F("haydar", 960, { pose: { l: [30, -40], r: [30, -40] }, brow: "angry", wet: 1 }))), html: tg("ELLERİ BAĞLI", "#E63946") },
  { c: "Havuzun dibinde uzun bir masa", tone: "night", r: cam([1, 1.1], [960, 700], undefined, sc(ters({}), (t) => <>{Array.from({ length: 7 }, (_, i) => <DFig key={i} x={600 + i * 120} y={940} s={0.7} o={CAST.konsey} sil="#050507" t={t} seed={i} op={0.85} />)}<path d="M560,930 L1360,930 L1420,1000 L500,1000Z" fill="#2A1C14" stroke="#000" strokeWidth={5} /><rect x={900} y={880} width={120} height={50} fill="#FFE8B0" opacity={0.5} /></>)) },
  { c: "Masanın etrafında yedi gölge", sfx: "boom", tone: "night", r: cam([1.1, 1.2], [960, 640], undefined, sc(ters({}), (t) => <>{Array.from({ length: 7 }, (_, i) => <DFig key={i} x={600 + i * 120} y={940} s={0.7} o={CAST.konsey} sil="#050507" t={t} seed={i} />)}<path d="M560,930 L1360,930 L1420,1000 L500,1000Z" fill="#2A1C14" stroke="#000" strokeWidth={5} /></>)), html: big("KONSEY", "#E63946", 120) },
  { c: "Hiçbirinin yüzü ışığa", tone: "night", r: cam([2, 2.2], [960, 640], undefined, sc(ters({}), (t) => <>{Array.from({ length: 7 }, (_, i) => <DFig key={i} x={600 + i * 120} y={940} s={0.7} o={CAST.konsey} sil="#050507" t={t} seed={i} />)}</>)) },
  { c: "Yılmaz, Haydar Ali'yi masanın", sfx: "knock", tone: "night", r: cam([1.2, 1.3], [960, 620], undefined, sc(ters({}), F("yilmaz", 700, { pose: P.reach, mouth: "smirk", wet: 0.6 }), Wk("haydar", 860, 1080, { pose: { l: [30, -40], r: [30, -40] }, brow: "angry", wet: 1 }, 0.1, 1))) },
  { c: "Söz verdiğim gibi", tone: "night", r: cam([2.6, 2.8], face(700), undefined, sc(ters({}), F("yilmaz", 700, { talk: true, mouth: "smirk", wet: 0.6 }))), html: q("“AJAN BURADA. KARTEL ARTIK SİZİN.”", 66) },
  { c: "Gölgelerden biri konuşuyor", sfx: "drone", tone: "night", r: cam([2.4, 2.6], [960, 600], undefined, sc(ters({}), (t) => <DFig x={960} y={940} s={0.9} o={CAST.yasli} sil="#08080A" t={t} talk />)) },
  { c: "Aferin, Yılmaz", tone: "night", r: cam([2.6, 2.8], [960, 600], undefined, sc(ters({}), (t) => <DFig x={960} y={940} s={0.9} o={CAST.yasli} sil="#08080A" t={t} talk />)), html: q("“BABASINI SATTIĞIN GİBİ OĞLUNU DA SATTIN.”", 60) },
  { c: "Haydar Ali başını kaldırıyor", sfx: "boom", tone: "night", r: cam([2.8, 3], face(1080), undefined, sc(ters({}), F("haydar", 1080, { eyes: "wide", brow: "worried", talk: true, wet: 1 }))), html: q("“BABAMI MI?”", 100) },
  { c: "Yaşlı ses gülüyor", tone: "night", r: cam([2.4, 2.6], [960, 600], undefined, sc(ters({}), (t) => <DFig x={960} y={940} s={0.9} o={CAST.yasli} sil="#08080A" t={t} talk />)) },
  { c: "O fotoğraftaki dördüncü adam", sfx: "boom", tone: "warm", r: cam([3, 3.4], [960 + 230 * 1.3, 420], undefined, (t, a) => <><rect width={1920} height={1080} fill="#2A1A12" /><Foto4 x={960} y={540} s={1.3} rot={0} hl={3} reveal={ramp(t, a + 0.6, a + 2)} /></>), html: big("4. ADAM = YILMAZ", "#E63946", 100) },
  { c: "Babanı biz öldürdük", tone: "night", r: cam([2.6, 2.8], face(700), undefined, sc(ters({}), F("yilmaz", 700, { eyes: "down", mouth: "tight", wet: 0.6 }))), html: q("“KAPIYI YILMAZ AÇTI.”", 80) },
  { c: "Haydar Ali'nin dünyası", sfx: "drone", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 3.4]} c0={face(1080)}>{ters({})(t)}<DFig x={1080} y={G} s={1.1} o={CAST.haydar} t={t} eyes="wide" mouth="o" tear={0.6} wet={1} /></TCam> },
  { c: "Yıllarca ona baba gibi", tone: "cool", r: cam([1.1, 1.2], [960, 560], undefined, sc(ofis, F("yilmaz", 760, { pose: P.reach, mouth: "smile" }), F("haydar", 1150, { dir: -1, s: 1, mouth: "smile" }))), html: tg("“BABA GİBİ”", "#1B4F9C") },
  { c: "Ve tam o anda, havuzun", sfx: "boom", flash: true, tone: "gold", r: cam([1, 1.12], [960, 520], undefined, (t, a) => <Tersane t={t} lights={ramp(t, a + 0.2, a + 0.5)} />) },
  { c: "Vinçlerin üstünde Efraim", tone: "gold", r: cam([2, 2.2], [300, 220], undefined, sc(ters({ lights: 1 }), (t) => <DFig x={240} y={120} s={0.35} o={CAST.efraim} t={t} />, (t) => <DFig x={420} y={120} s={0.33} o={CAST.yavuz} t={t} />)), html: tg("EFRAİM + ADAMLARI", "#1B4F9C") },
  { c: "Kapıda Bozo", sfx: "boom", tone: "gold", r: cam([1.4, 1.5], [400, 620], undefined, sc(ters({ lights: 1 }), F("bozo", 400, { brow: "angry", wet: 0.8 }))) },
  { c: "Yanında Merdan, tekerlekli", tone: "gold", r: cam([1.3, 1.4], [560, 640], undefined, sc(ters({ lights: 1 }), F("bozo", 380, { wet: 0.8 }), (t) => <TekerlekliSandalye x={680} y={G} s={1} who={<DFig x={0} y={-30} s={1} o={CAST.merdanS} t={t} pose={P.sit} brow="angry" mouth="tight" />} />)) },
  { c: "Ve masanın tam karşısında", tone: "gold", r: cam([1.6, 1.7], [1500, 600], undefined, sc(ters({ lights: 1 }), F("melek", 1500, { s: 1, dir: -1, pose: P.phone, holdR: tel(), mouth: "smirk" }))) },
  { c: "Gülümseyin, diyor Melek", sfx: "ding", tone: "gold", r: cam([2.6, 2.8], face(1500, 1), undefined, sc(ters({ lights: 1 }), F("melek", 1500, { s: 1, dir: -1, pose: P.phone, holdR: tel(), talk: true, mouth: "smirk" }))), html: (t, a) => <><Txt t={t} at={a + 0.3} text="“CANLI YAYINDASINIZ.”" y={860} size={80} /><div style={{ position: "absolute", left: 60, top: 60, background: "#E63946", color: "#fff", fontFamily: "Poppins", fontWeight: 800, fontSize: 40, padding: "6px 22px", borderRadius: 8, opacity: Math.sin(t * 6) > 0 ? 1 : 0.6 }}>● CANLI</div></> },
  { c: "Telefonun ekranında, Aslı", tone: "cool", r: cam([1.2, 1.3], [960, 560], undefined, sc(ofis, F("asli", 960, { pose: P.phone, holdR: tel(), brow: "angry", mouth: "tight" }))), html: tg("ANKARA · SAVCILIK", "#1B4F9C") },
  { c: "Aslı yıllardır Yılmaz'ın", tone: "cool", r: cam([2.6, 2.8], face(960), undefined, sc(ofis, F("asli", 960, { eyes: "squint", mouth: "tight" }))) },
  { c: "Ankara'daki bir odada", sfx: "static", tone: "cool", r: cam([1, 1.08], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#1E2430" />{[0, 1, 2, 3, 4, 5].map((i) => <g key={i} transform={`translate(${380 + (i % 3) * 580},${300 + Math.floor(i / 3) * 420})`}><rect x={-250} y={-170} width={500} height={320} rx={10} fill="#0E1222" stroke="#5A6470" strokeWidth={6} /><g transform="scale(0.26) translate(-960,-560)"><Tersane t={t} lights={1} rain={0} /></g><circle cx={210} cy={-130} r={10} fill="#E63946" opacity={Math.sin(t * 6 + i) > 0 ? 1 : 0.3} /></g>)}</>), html: tg("GÖRÜNTÜLER SAVCILARDA", "#E63946") },
  { c: "Konsey'in yedi gölgesi", sfx: "boom", tone: "gold", r: cam([1.1, 1.2], [960, 640], undefined, sc(ters({ lights: 1 }), (t, a) => <>{Array.from({ length: 7 }, (_, i) => { const k = ramp(t, a + 0.3 + i * 0.15, a + 0.8 + i * 0.15); return <g key={i}><DFig x={600 + i * 120} y={940} s={0.7} o={{ ...CAST.yasli, hair: i % 2 ? "grey" : "bald", beard: i % 3 ? undefined : "full", top: "suit", c: "#1C1D22", tie: "#5A1E28", glasses: i % 2 === 0 }} t={t} seed={i} eyes="wide" /><g opacity={1 - k}><DFig x={600 + i * 120} y={940} s={0.7} o={CAST.konsey} sil="#050507" t={t} seed={i} /></g></g>; })}</>)), html: big("İŞADAMLARI · BÜROKRATLAR", "#FFC800", 72) },
  { c: "Yılmaz kaçmaya çalışıyor", sfx: "whoosh", tone: "gold", r: cam([1, 1.06], [960, 600], undefined, sc(ters({ lights: 1 }), Run("yilmaz", 900, 1500, { wet: 0.6, eyes: "wide" }, 0.1, 1.4))) },
  { c: "Ama kapının önünde biri", sfx: "boom", tone: "gold", r: cam([1.3, 1.4], [1500, 600], undefined, sc(ters({ lights: 1 }), F("yilmaz", 1350, { eyes: "wide", pose: P.shock }), F("sultan", 1640, { dir: -1, pose: AIM, holdR: tab, brow: "angry", mouth: "tight", wet: 0.8 }))) },
  { c: "Elinde yine bir silah", tone: "gold", r: cam([3, 3.2], [1700, 560], undefined, sc(ters({ lights: 1 }), F("sultan", 1640, { dir: -1, pose: AIM, holdR: tab, brow: "angry", wet: 0.8 }))), html: tg("BU SEFER TİTREMİYOR", "#E63946") },
  { c: "Hayatım boyunca beni hep", sfx: "drone", tone: "gold", r: cam([2.6, 2.8], face(1640), undefined, sc(ters({ lights: 1 }), F("sultan", 1640, { dir: -1, pose: AIM, holdR: tab, brow: "angry", talk: true, wet: 0.8 }))), html: q("“BU GECE DEĞİL.”", 96, 0.5) },
  { c: "Yılmaz dizlerinin üstüne", sfx: "knock", tone: "gold", r: cam([1.4, 1.5], [1420, 620], undefined, sc(ters({ lights: 1 }), F("yilmaz", 1350, { pose: KNEEL, y: G + 60, eyes: "down", brow: "sad", wet: 0.8 }), F("sultan", 1640, { dir: -1, pose: AIM, holdR: tab, wet: 0.8 }))) },
  { c: "Ama Konsey'in yaşlı adamı", sfx: "drone", tone: "night", r: cam([2.6, 2.8], face(960, 0.9), undefined, sc(ters({ lights: 1 }), (t) => <DFig x={960} y={G} s={0.9} o={{ ...CAST.yasli, top: "suit", c: "#1C1D22", tie: "#5A1E28" }} t={t} mouth="grin" eyes="squint" />)) },
  { c: "Masanın altındaki bir kolu", sfx: "knock", tone: "night", r: cam([2.6, 2.8], [1000, 760], undefined, sc(ters({ lights: 1 }), (t, a) => <g><rect x={900} y={700} width={240} height={200} fill="#3A3E44" stroke="#000" strokeWidth={5} /><g transform={`translate(1020,820) rotate(${-50 + ramp(t, a + 0.4, a + 1) * 100})`}><rect x={-10} y={-150} width={20} height={150} fill="#9AA0A8" stroke="#000" strokeWidth={4} /><circle cy={-150} r={24} fill="#E63946" stroke="#000" strokeWidth={4} /></g></g>), 2) },
  { c: "Havuzun dev kapakları", sfx: "boom", tone: "night", r: cam([1, 1.08], [960, 600], undefined, (t, a) => <Tersane t={t} lights={1} flood={ramp(t, a + 0.5, a + 6) * 0.25} />, 6) },
  { c: "Haliç'in suyu, kükreyerek", sfx: "splash", tone: "night", r: cam([1.3, 1.4], [960, 700], undefined, (t, a) => <Tersane t={t} lights={1} flood={0.25 + ramp(t, a, a + 5) * 0.2} />, 5), html: big("SU DOLUYOR", "#9BD8FF", 96) },
  { c: "Hepimiz batıyorsak", tone: "night", r: cam([2.6, 2.8], face(960, 0.9), undefined, sc(ters({ lights: 1, flood: 0.45 }), (t) => <DFig x={960} y={G} s={0.9} o={{ ...CAST.yasli, top: "suit", c: "#1C1D22", tie: "#5A1E28" }} t={t} talk mouth="grin" wet={1} />)), html: q("“BERABER BATARIZ.”", 90) },
  { c: "Su hızla yükseliyor", sfx: "splash", tone: "night", r: cam([1.2, 1.3], [960, 640], undefined, (t, a) => <><Tersane t={t} lights={1} flood={0.45 + ramp(t, a, a + 3) * 0.2} /><DFig x={960} y={1080 - (0.45 + ramp(t, a, a + 3) * 0.2) * 420 + 260} s={1} o={CAST.haydar} t={t} eyes="wide" brow="worried" wet={1} pose={{ l: [30, -40], r: [30, -40] }} /><rect y={1080 - (0.45 + ramp(t, a, a + 3) * 0.2) * 420 + 10} width={1920} height={600} fill="#1E4A6A" opacity={0.85} /></>, 4), html: tg("ELLERİ HÂLÂ BAĞLI", "#E63946") },
  { c: "Bozo suya atlıyor", sfx: "splash", tone: "night", r: cam([1.1, 1.2], [800, 640], undefined, (t, a) => <><Tersane t={t} lights={1} flood={0.65} /><DFig x={lerp(300, 900, ramp(t, a, a + 2))} y={lerp(700, 860, ramp(t, a, a + 0.6))} s={1} o={CAST.bozo} t={t} pose={runPose(t * 6)} brow="angry" wet={1} /><rect y={1080 - 0.65 * 420 + 10} width={1920} height={600} fill="#1E4A6A" opacity={0.85} /></>, 3) },
  { c: "Haydar Ali'ye ulaşıyor", tone: "night", r: cam([1.8, 2], [960, 560], undefined, (t) => <><Tersane t={t} lights={1} flood={0.7} /><DFig x={880} y={820} s={1} o={CAST.bozo} t={t} pose={HUG} brow="angry" mouth="shout" wet={1} /><DFig x={1040} y={830} s={1} o={CAST.haydar} t={t} dir={-1} eyes="closed" wet={1} /><rect y={1080 - 0.7 * 420 + 10} width={1920} height={600} fill="#1E4A6A" opacity={0.85} /></>, 3) },
  { c: "Vincin üstünden Efraim", sfx: "knock", tone: "night", r: cam([1.2, 1.3], [700, 400], undefined, (t, a) => <><Tersane t={t} lights={1} flood={0.72} /><Zincir x0={720} y0={120} x1={720} y1={lerp(140, 700, ramp(t, a, a + 1.6))} sag={10} /></>) },
  { c: "Bozo zinciri yakalıyor", sfx: "boom", tone: "night", r: cam([1.6, 1.8], [800, 600], undefined, (t) => <><Tersane t={t} lights={1} flood={0.74} /><Zincir x0={760} y0={0} x1={780} y1={560} sag={10} /><DFig x={800} y={830} s={1} o={CAST.bozo} t={t} pose={{ l: [160, 175], r: [70, 110] }} brow="angry" mouth="shout" wet={1} /><DFig x={960} y={850} s={1} o={CAST.haydar} t={t} dir={-1} eyes="squint" wet={1} /><rect y={1080 - 0.74 * 420 + 10} width={1920} height={600} fill="#1E4A6A" opacity={0.85} /></>, 4) },
  { c: "Yukarıdan Rüzgar ve Yavuz", tone: "night", r: cam([1.2, 1.3], [960, 400], undefined, sc(ters({ lights: 1, flood: 0.75 }), F("ruzgar", 820, { y: 560, s: 0.8, pose: { l: [110, 160], r: [110, 160], lean: -14 }, brow: "angry", mouth: "shout", wet: 1 }), F("yavuz", 1080, { y: 560, s: 0.8, pose: { l: [110, 160], r: [110, 160], lean: -14 }, brow: "angry", wet: 1 }))) },
  { c: "Bir metre. İki metre", sfx: "tick", tone: "night", r: cam([1.4, 1.6], [880, 600], undefined, (t, a) => { const up = ramp(t, a, a + 2.5) * 200; return <><Tersane t={t} lights={1} flood={0.76} /><Zincir x0={800} y0={0} x1={810} y1={560 - up} sag={6} /><DFig x={820} y={830 - up} s={1} o={CAST.bozo} t={t} pose={{ l: [170, 178], r: [60, 100] }} brow="angry" wet={1} /><DFig x={960} y={860 - up} s={1} o={CAST.haydar} t={t} dir={-1} eyes="squint" wet={1} /><rect y={1080 - 0.76 * 420 + 10} width={1920} height={600} fill="#1E4A6A" opacity={0.85} /></>; }, 3), html: big("1 METRE… 2 METRE…", "#FFFFFF", 90) },
  { c: "Ve ikisi de son anda", sfx: "splash", tone: "night", r: cam([1, 1.1], [960, 600], undefined, sc(ters({ lights: 1, flood: 0.8 }), (t, a) => <DFig x={lerp(700, 860, ramp(t, a, a + 0.6))} y={620} s={0.9} o={CAST.bozo} t={t} pose={P.dive} wet={1} />, (t, a) => <DFig x={lerp(1240, 1060, ramp(t, a, a + 0.6))} y={620} s={0.9} o={CAST.haydar} t={t} pose={P.dive} dir={-1} wet={1} />), 5) },
  { c: "Nefes nefese, ıslak", tone: "cool", r: cam([1.4, 1.5], [1000, 560], undefined, sc(ters({ lights: 1, flood: 0.8 }), (t) => <g transform="translate(900,560) rotate(-90)"><DFig x={0} y={0} s={0.9} o={CAST.bozo} t={t} eyes="closed" mouth="open" wet={1} /></g>, (t) => <g transform="translate(1460,560) rotate(-90)"><DFig x={0} y={0} s={0.9} o={CAST.haydar} t={t} eyes="closed" mouth="open" wet={1} /></g>)) },
  { c: "Bozo gülüyor", sfx: "ding", tone: "gold", r: cam([2.2, 2.4], [560, 540], undefined, sc(ters({ lights: 1, flood: 0.8 }), (t) => <g transform="translate(900,560) rotate(-90)"><DFig x={0} y={0} s={0.9} o={CAST.bozo} t={t} mouth="grin" eyes="happy" talk wet={1} /></g>)), html: q("“ŞİMDİ ÖDEŞTİK.”", 96) },
  { c: "Konsey'in yaşlı adamı da kaçamıyor", tone: "night", r: cam([1.1, 1.2], [960, 640], undefined, (t) => <><Tersane t={t} lights={1} flood={0.85} /><DFig x={1200} y={760} s={0.8} o={{ ...CAST.yasli, top: "suit", c: "#1C1D22" }} t={t} eyes="wide" pose={HANDS_UP} wet={1} /><rect y={1080 - 0.85 * 420 + 10} width={1920} height={600} fill="#1E4A6A" opacity={0.85} /></>) },
  { c: "Sirenlerin sesi Haliç'in", sfx: "whistle", tone: "night", siren: true, r: cam([1, 1.1], [960, 520], undefined, ters({ lights: 1, flood: 0.85 })) },
  { c: "Kırmızı mavi ışıklar suya", tone: "night", siren: true, r: cam([1.6, 1.8], [960, 760], undefined, ters({ lights: 1, flood: 0.85 })) },
  { c: "Ama hikâye burada bitmiyor", sfx: "drone", tone: "night", siren: true, r: cam([1, 1.06], [960, 560], undefined, sc(ters({ lights: 1, flood: 0.85 }), F("bozo", 760, { wet: 1, eyes: "down" }), F("haydar", 1100, { dir: -1, wet: 1, pose: { l: [30, -40], r: [30, -40] } }))) },
  { c: "Mahkemede birinin her şeyi", tone: "cool", r: cam([1, 1.1], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#2A2E36" /><rect x={560} y={260} width={800} height={500} fill="#5A3A26" stroke="#000" strokeWidth={6} /><circle cx={960} cy={380} r={60} fill="#C8A060" /><path d="M900,380 h120 M960,330 v100" stroke="#5A3A26" strokeWidth={8} /><rect x={760} y={560} width={400} height={30} fill="#3A2418" /></>), html: big("MAHKEME", "#FFFFFF", 110) },
  { c: "Kartelin bütün defterlerini", sfx: "tick", tone: "cool", r: cam([1.2, 1.3], [960, 600], undefined, (t) => <><rect width={1920} height={1080} fill="#2A2E36" />{[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${560 + i * 200},${620 - i * 20}) rotate(${-8 + i * 4})`}><rect x={-80} y={-110} width={160} height={220} fill={["#7A1F2E", "#1B4F9C", "#3A3E44", "#5A3A26", "#7A1F2E"][i]} stroke="#000" strokeWidth={5} /><rect x={-50} y={-80} width={100} height={30} fill="#F2E8D2" /></g>)}</>) },
  { c: "Bozo, Haydar Ali'nin bileklerindeki", sfx: "tick", tone: "cool", siren: true, r: cam([2.4, 2.6], [930, 680], undefined, sc(ters({ lights: 1, flood: 0.85 }), F("bozo", 820, { pose: P.reach, wet: 1, eyes: "down" }), F("haydar", 1040, { dir: -1, pose: { l: [40, 60], r: [40, 60] }, wet: 1 }))) },
  { c: "Ben anlatacağım", sfx: "boom", tone: "cool", siren: true, r: cam([2.6, 2.8], face(820), undefined, sc(ters({ lights: 1, flood: 0.85 }), F("bozo", 820, { talk: true, wet: 1 }))), html: q("“BEN ANLATACAĞIM.”", 96) },
  { c: "Haydar Ali şaşkın. Bozo", tone: "cool", siren: true, r: cam([2.6, 2.8], face(1040), undefined, sc(ters({ lights: 1, flood: 0.85 }), F("haydar", 1040, { dir: -1, talk: true, brow: "worried", wet: 1 }))), html: q("“BU YILLAR DEMEK. BELKİ ÖMRÜN.”", 70) },
  { c: "Bozo omuz silkiyor", tone: "cool", siren: true, r: cam([2.4, 2.6], face(820), undefined, sc(ters({ lights: 1, flood: 0.85 }), F("bozo", 820, { pose: P.shrug, mouth: "smile", eyes: "sad", wet: 1 }))) },
  { c: "Ada, babasını bir kahraman", sfx: "ding", tone: "gold", r: cam([1.1, 1.2], [700, 640], undefined, sc(bahce, (t) => <DFig x={220} y={720} s={0.62} o={CAST.ada} t={t} mouth="smile" eyes="happy" pose={P.hold} />)), html: q("“KAHRAMAN OLARAK HATIRLASIN.”", 70) },
  { c: "Ertesi sabah, konağın bahçesinde", sfx: "whoosh", tone: "warm", r: cam([1, 1.06], [960, 600], undefined, sc(bahce, F("gulsum", 520, { s: 1, eyes: "sad" }), F("pasa", 700, { s: 1, eyes: "sad", mouth: "frown" }), F("bozo", 960, { s: 1 }), F("efraim", 1200, { s: 1, dir: -1 }), F("haydar", 1380, { s: 1, dir: -1 }))) },
  { c: "Gülsüm Ana, Bozo'nun yakasını", tone: "warm", r: cam([2.2, 2.4], [820, 560], undefined, sc(bahce, F("gulsum", 700, { s: 1, pose: P.reach, tear: 1, eyes: "sad", brow: "sad" }), F("bozo", 920, { s: 1, dir: -1, eyes: "sad", mouth: "smile" }))) },
  { c: "Paşa, hayatında ilk kez sessiz", tone: "warm", r: cam([2.6, 2.8], face(700, 1), undefined, sc(bahce, F("pasa", 700, { s: 1, eyes: "down", mouth: "frown" }))) },
  { c: "Efraim, gölgesi olduğu adamın", tone: "warm", r: cam([1.8, 2], [1100, 600], undefined, sc(bahce, F("bozo", 960, { s: 1 }), F("efraim", 1200, { s: 1, dir: -1, eyes: "down" }))) },
  { c: "Bozo, Ada'nın önüne diz çöküyor", tone: "gold", r: cam([1.6, 1.8], [820, 700], undefined, sc(bahce, F("bozo", 900, { s: 1, pose: KNEEL, y: G + 50, dir: -1, eyes: "sad", mouth: "smile" }), (t) => <DFig x={700} y={G} s={0.62} o={CAST.ada} t={t} eyes="sad" />)) },
  { c: "Baban biraz uzağa gidiyor", tone: "gold", r: cam([2.6, 2.8], [900, 620], undefined, sc(bahce, F("bozo", 900, { s: 1, pose: KNEEL, y: G + 50, dir: -1, eyes: "sad", talk: true }))), html: q("“HER HAFTA RESİMLERİNİ BEKLEYECEĞİM.”", 64) },
  { c: "Ada, küçük ellerini", tone: "gold", r: cam([1.8, 2], [800, 700], undefined, sc(bahce, F("bozo", 900, { s: 1, pose: KNEEL, y: G + 50, dir: -1, eyes: "closed", tear: 0.8 }), (t) => <DFig x={760} y={G} s={0.62} o={CAST.ada} t={t} pose={P.reach} eyes="sad" talk />)), html: q("“SÖZ MÜ?”", 110, 0.5) },
  { c: "Söz.", sfx: "ding", tone: "gold", r: cam([2.6, 2.8], [900, 620], undefined, sc(bahce, F("bozo", 900, { s: 1, pose: KNEEL, y: G + 50, dir: -1, mouth: "smile", tear: 1, eyes: "happy" }))), html: q("“SÖZ.”", 120, 0.2) },
  { c: "Sonra Bozo, Haydar Ali'ye sarılıyor", tone: "gold", r: cam([1.6, 1.8], [960, 600], undefined, sc(bahce, F("bozo", 880, { s: 1, pose: HUG, eyes: "closed" }), F("haydar", 1050, { s: 1, dir: -1, pose: HUG, eyes: "closed" }))) },
  { c: "Ekmeğin için teşekkürler", sfx: "drone", tone: "gold", r: cam([2.6, 2.8], [900, 560], undefined, sc(bahce, F("bozo", 880, { s: 1, pose: HUG, eyes: "closed", talk: true }), F("haydar", 1050, { s: 1, dir: -1, pose: HUG, eyes: "closed" }))), html: q("“CEYLAN'I BU SEFER BIRAKMA.”", 76) },

  // ── FİNAL ──
  { c: "Final. Altı ay sonra", ...bolum("FİNAL", "ALTI AY SONRA") },
  { c: "İstanbul'da bahar", sfx: "whoosh", tone: "warm", r: cam([1, 1.1], [960, 540], undefined, avlu) },
  { c: "Aynı avlu. Haydar Ali ile Bozo'nun", tone: "warm", r: cam([1.2, 1.3], [960, 600], undefined, sc(avlu)), html: tg("İLK TANIŞTIKLARI YER", "#1B4F9C") },
  { c: "Bozo bir bankta oturuyor", tone: "warm", r: cam([1.4, 1.5], [400, 560], undefined, sc(avlu, F("bozo", 330, { s: 1, pose: P.sit, y: 640, eyes: "down" }))) },
  { c: "Karşısına küçük bir kız koşuyor", sfx: "pop", tone: "warm", r: cam([1, 1.06], [800, 600], undefined, sc(avlu, F("bozo", 330, { s: 1, pose: P.sit, y: 640, eyes: "wide", mouth: "grin" }), Run("ada", 1400, 560, { s: 0.6, y: 900, mouth: "grin", eyes: "happy" }, 0.2, 2.6))) },
  { c: "Elinde bir resim var", sfx: "ding", tone: "gold", r: cam([1.1, 1.2], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#A9A49A" /><CocukResmi x={960} y={540} s={1.8} /></>), html: tg("BİR ADAM · BİR KIZ · BİR DENİZ", "#1B4F9C") },
  { c: "Ada'nın arkasında Rüzgar", tone: "warm", r: cam([1.2, 1.3], [1000, 600], undefined, sc(avlu, F("bozo", 330, { s: 1, pose: HUG, y: 640, mouth: "smile", eyes: "happy" }), F("ruzgar", 1000, { s: 1, dir: -1, mouth: "smile" }), F("sultan", 1300, { s: 1, dir: -1 }))) },
  { c: "Artık kimsenin kız kardeşi", tone: "gold", r: cam([2.6, 2.8], face(1300, 1), undefined, sc(avlu, F("sultan", 1300, { s: 1, dir: -1, mouth: "smile" }))), html: tg("KENDİ HAYATINI SEÇMİŞ BİR KADIN", "#E63946") },
  { c: "Rüzgar ona bakıyor", tone: "gold", r: cam([1.8, 2], [1150, 560], undefined, sc(avlu, F("ruzgar", 1000, { s: 1, look: 1, mouth: "smile" }), F("sultan", 1300, { s: 1, dir: -1, mouth: "smile", eyes: "happy" }))) },
  { c: "Merdan, ailenin işlerini", tone: "warm", r: cam([1, 1.08], [960, 600], undefined, sc(bahce, (t) => <g><rect x={700} y={420} width={520} height={110} rx={10} fill="#1B4F9C" stroke="#1B1210" strokeWidth={6} /><text x={960} y={492} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={46} fill="#FFFFFF">HANOĞLU VAKFI</text></g>, (t) => <TekerlekliSandalye x={960} y={G} s={1} who={<DFig x={0} y={-30} s={1} o={CAST.merdanS} t={t} pose={P.sit} mouth="smile" />} />)) },
  { c: "Melek, Aslı'nın yanında", sfx: "ding", tone: "cool", r: cam([1.2, 1.3], [960, 600], undefined, sc(ofis, F("asli", 800, { mouth: "smile" }), F("melek", 1120, { s: 1, dir: -1, mouth: "smile", eyes: "happy" }))), html: q("“BU SEFER KİMSE ONA KAHVE GETİRTMİYOR.”", 60) },
  { c: "Ve Boğaz'ın kıyısında", sfx: "whoosh", tone: "gold", r: cam([1.1, 1], [700, 540], [960, 540], (t) => <Sahil t={t} />) },
  { c: "Haydar Ali içeri giriyor", tone: "gold", r: cam([1, 1.08], [960, 600], undefined, sc((t) => <Konak t={t} room="mutfak" night={0} />, Wk("haydar", 200, 700, {}, 0.1, 2.6), F("ceylan", 1300, { dir: -1, mouth: "smile" }))) },
  { c: "Masada iki fincan çay", sfx: "ding", tone: "gold", r: cam([2.6, 2.8], [520, 700], undefined, sc((t) => <Konak t={t} room="mutfak" night={0} />, (t) => <g transform="translate(470,720)">{cay}<g transform="translate(80,0)">{cay}</g></g>)) },
  { c: "Ne Halide, ne Bozo'nun karısı", tone: "gold", r: cam([2.6, 2.8], face(1300), undefined, sc((t) => <Konak t={t} room="mutfak" night={0} />, F("ceylan", 1300, { dir: -1, mouth: "smile", eyes: "happy" }))), html: big("SADECE CEYLAN.", "#FFC800", 90) },
  { c: "Haydar Ali cebinden küçük", sfx: "tick", tone: "gold", r: cam([1.6, 1.7], [1100, 640], undefined, sc((t) => <Konak t={t} room="mutfak" night={0} />, F("haydar", 960, { pose: P.reach, holdR: <g transform="scale(0.3)"><Yuzuk x={0} y={0} open={0} /></g> }), F("ceylan", 1300, { dir: -1, eyes: "wide", mouth: "o" }))) },
  { c: "Yıllar önce, o lanetli gece", sfx: "ding", tone: "gold", r: cam([1.2, 1.3], [960, 560], undefined, (t, a) => <><rect width={1920} height={1080} fill="#2A1A20" /><Yuzuk x={960} y={620} s={2.6} t={t} open={ramp(t, a + 0.4, a + 1.4)} /></>) },
  { c: "Bu sefer, diyor", tone: "gold", r: cam([2.6, 2.8], face(960), undefined, sc((t) => <Konak t={t} room="mutfak" night={0} />, F("haydar", 960, { talk: true, mouth: "smile", eyes: "sad" }))), html: q("“KİMSE ARAYA GİRMEYECEK.”", 80) },
  { c: "Ceylan yüzüğe bakıyor", tone: "gold", r: cam([2.6, 2.8], face(1300), undefined, sc((t) => <Konak t={t} room="mutfak" night={0} />, F("ceylan", 1300, { dir: -1, eyes: "down", tear: 0.8, blush: 1 } as Face))) },
  { c: "Ve yıllardır ilk kez", sfx: "ding", tone: "gold", r: cam([1.8, 2], [1130, 600], undefined, sc((t) => <Konak t={t} room="mutfak" night={0} />, F("haydar", 1000, { pose: HUG, eyes: "closed", mouth: "smile" }), F("ceylan", 1220, { dir: -1, pose: HUG, eyes: "happy", mouth: "grin", tear: 0.8 }))), html: q("“EVET.”", 130, 0.6) },
  { c: "Dışarıda martılar uçuşuyor", tone: "gold", r: cam([1, 1.12], [960, 540], undefined, (t) => <Sahil t={t} />) },
  { c: "Yeraltı, sonunda gün ışığına", sfx: "boom", tone: "gold", r: cam([1.2, 1], [1300, 540], [960, 540], (t) => <Sahil t={t} />), html: (t, a) => <><Txt t={t} at={a + 0.3} text="YERALTI" y={300} size={150} color="#FFFFFF" /><Txt t={t} at={a + 1.2} text="SONUNDA GÜN IŞIĞINDA" y={500} size={84} color="#FFC800" /></> },

  // ── KAPANIŞ ──
  { c: "İşte bizim Yeraltı finalimiz", tone: "gold", r: kart("#1B4F9C"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="SEN OLSAN NASIL BİTİRİRDİN?" y={300} size={80} color="#FFFFFF" /><Txt t={t} at={a + 1.2} text="YORUMLARA YAZ 👇" y={480} size={100} color="#FFC800" /></> },
  { c: "Bozo'nun kararına katılıyor", tone: "gold", r: cam([1, 1.08], [960, 600], undefined, sc(avlu, F("bozo", 330, { s: 1, pose: P.sit, y: 640, mouth: "smile" }))), html: q("BOZO'NUN KARARI DOĞRU MUYDU?", 76, 0.2) },
  { c: "Bir sonraki finali hangi diziye", tone: "gold", r: kart("#0E1222"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="SIRADAKİ FİNAL:" y={300} size={80} color="#FFFFFF" /><Txt t={t} at={a + 1} text="HANGİ DİZİ?" y={460} size={140} color="#FF3E7F" /></> },
  { c: "Abone olmayı unutma", tone: "gold", r: cam([1, 1.1], [960, 540], undefined, (t) => <Sahil t={t} />), html: (t, a) => <><Txt t={t} at={a + 0.2} text="FİNALİ BİZ YAZDIK" y={200} size={110} color="#FFC800" /><Abone t={t} at={a + 0.8} /></> },
];

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K8_01_SECONDS));
  return raw;
})();

const VOL: Record<string, number> = { whoosh: 0.07, drone: 0.12, boom: 0.13, ding: 0.11, knock: 0.1, splash: 0.12, buzz: 0.08, pop: 0.09, whistle: 0.08, tick: 0.08, static: 0.07 };
export const K8Video01: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K8_01_SECONDS;
  const cut = 1 - ramp(t, s.from, s.from + 0.14);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: ramp(t, 0, 0.5) * (1 - ramp(t, END - 1.2, END)) }}>
        <TFrame bg="#0E1222">
          <LiveCam t={t} a={s.from}>{s.r(t, s.from, s.to)}</LiveCam>
          {s.siren && <SirenIsik t={t} />}
          {s.flash && <Simsek t={t} at={s.from + 0.6} />}
          <Atmos t={t} tone={s.tone ?? "warm"} rays={s.tone === "night" ? 0.4 : 0.8} seed={n} />
          <Sweep t={t} a={s.from} />
        </TFrame>
        {s.html?.(t, s.from, s.to)}
        <AbsoluteFill style={{ background: "#FFFFFF", opacity: cut * 0.18, pointerEvents: "none" }} />
      </AbsoluteFill>
      <Audio src={staticFile("audio/k8-01.wav")} />
      {TIMED.map((x, i) => i > 0 && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.08) * fps))} durationInFrames={Math.round(2.2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.from > END - 30 ? 0.04 : VOL[x.sfx ?? "whoosh"] ?? 0.07} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
