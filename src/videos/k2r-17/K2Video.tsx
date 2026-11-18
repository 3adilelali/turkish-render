import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k2r-17-words.json";
import { makeCue, ramp as rampRaw } from "../../lib/cues";
import { Eyes, Brow, Mouth, HERO, Outfit, P, T, TCam, TFig, TFrame, TPose, lerp, runPose, toonWalk, mixPose } from "../../components/Toon";
import { Txt, Tag, Abone } from "../../components/K2Kit";
import { Atmos, Fore, LiveCam, Sweep, Tone } from "../../components/Live";
import { InceBardak } from "../../components/K2Dikey3";
import { Gok, Kagit, Kahvalti, Kopek, Kopru, Radyo, Sehir, morsOn } from "../../components/SonIki";
import {
  Araba, ArabaIci, Benzinlik, Bileklik, Cesme, Defter, GeceModu, HUD2, Harita, Istasyon, Kizilay, Kulube, Kurt, KurtIzi, Lokanta, MorsDuvar,
  RadyoOdasi, Saat, TenekeKutu, VanGece, VanKedisi, YolSahne,
} from "../../components/YolVan";

// Kanal 2 · k2r-17 · "Dünyada Son İki Kişi Kaldık… Ve Van'a 14 Günümüz Var" — 2. BÖLÜM. TAMAMEN MOTOR.
// Görsel imzalar (yeni, YolVan.tsx): HUD2 (GÜN n/14 + VAN'A KM), GeceModu (güneş batınca dahi modu), Harita ara kartları,
// MorsDuvar (kazınmış Mors + harf harf çözüm), Araba (yolcular, Karabaş camda, CO, akü), yol sahneleri.

const ALT: Record<string, string[]> = {
  "On üçüncü gün. Güneş": ["13. gün. Güneş", "On üçüncü gün güneş"],
  "On üç gündür bu duvarlar size": ["13 gündür bu duvarlar size"],
  "Yüzüncü gün. Galata": ["100. gün Galata", "Yüzüncü gün Galata"],
  "Jeneratörün mazotu": ["Jenaratörün mazotu"],
  "İstanbul'dan Van'a bin altı yüz": ["İstanbul'dan Van'a 1600"],
  "Kural dört: Gece": ["Kural 4. Gece", "Kural dört. Gece"],
  "On dört gün, diyor": ["14 gün, diyor", "14 gün diyor"],
  "Birinci gün. Sabah": ["1. gün. Sabah", "Birinci gün sabah"],
  "Dört bin iki yüz on yedi": ["4217", "4.217"],
  "Üçüncü gün, Bolu": ["3. gün Bolu", "Üçüncü gün Bolu"],
  "On beş... dakika": ["On beş dakika", "15 dakika"],
  "On beşinci dakikada": ["15. dakikada"],
  "Kural beş: Duvarlar": ["Kural 5. Duvarlar", "Kural beş. Duvarlar"],
  "Dördüncü gün, Ankara": ["4. gün Ankara", "Dördüncü gün Ankara"],
  "Altıncı gün, Orta": ["6. gün Orta", "Altıncı gün Orta"],
  "Sağa... üç... metre": ["Sağa üç metre", "Sağa 3 metre"],
  "Sekiz soru soruyor": ["8 soru soruyor"],
  "Yedinci gece Defne": ["7. gece Defne"],
  "Yüz kırk dört'ün": ["144'ün", "Yüz kırk dördün"],
  "Sekizinci gün, Kayseri": ["8. gün Kayseri", "Sekizinci gün Kayseri"],
  "Onuncu gün, Malatya": ["10. gün Malatya", "Onuncu gün Malatya"],
  "Yüz on gündür ilk kez": ["110 gündür ilk kez"],
  "Yirmi yaşlarında bir genç": ["20 yaşlarında bir genç"],
  "Kural iki. Aptalca": ["Kural 2. Aptalca"],
  "On ikinci gün, Muş": ["12. gün Muş", "On ikinci gün Muş"],
  "On üçüncü gün. Bitlis": ["13. gün. Bitlis", "On üçüncü gün Bitlis"],
  "Bir gece, diyorsun": ["Bir gece diyorsun"],
  "Elli metre ötede": ["50 metre ötede"],
  "Karbonmonoksit": ["Karbon monoksit"],
  "On dördüncü gün": ["14. gün"],
  "Ve elektrik, doksan sekiz": ["Ve elektrik 98"],
  "Karabaş kıpırdamıyor bile": ["Karabaş kıpırlamıyor bile"],
  "Akşamüstü Sakarya'yı": ["Akşamüstü Sakarya'ya"],
  "İki yüz metre sonra": ["200 metre sonra"],
  "Ve sol arka lastik patlıyor": ["Ve sol arka lastik baklıyor"],
  "Gece olan senin söylediği": ["Geçe olan senin söylediği"],
  "Gündüz olan sen, krikoyla": ["Gündüz olan sen Krico'yla"],
  "Bozkır. Kilometrelerce": ["Poskır. Kilometrelerce"],
  "Saat üçü on üç geçe": ["Saat 3'ü 13 gece"],
  "On iki": ["kare kökü 12"],
  "Beş ne? diyorsun": ["Beş dakika mı"],
  "Ve her gece üçü on dörtte": ["Ve her gece 3'ü 14'te"],
  "Her akşam saat dokuzda": ["Her akşam saat 9'da"],
  "O akşam saat dokuzda": ["O akşam saat 9'da"],
  "Defne kapıyı açıyor": ["Defne kabıyı açıyor"],
  "Bolu ormanlarında kurt": ["Bola Ormanlarında Kurt"],
  "Defne defterine yazıyor. Kural beş": ["Defne Defterine Yazıyor Kural 5"],
  "Defne sana bakıyor. Sen. Dün": ["Defne sana bakıyor. Dün gece"],
  "Gece olan ben uyumaz": ["Gece olan ben uyuvaz"],
  "Ve abone olup zili": ["Ve abone olup sili"],
  "Bu kanal, bu hikâyenin": ["Bu kanal bu hikayenin"],
  "Ön camdaki çatlak": ["Ön camdaki çatlak"],
  "03.14": ["03:14", "Sıfır üç on dört"],
};
const ramp = (t: number, a: number, b: number) => (b - a > 0.01 ? rampRaw(t, a, b) : t >= b ? 1 : 0);
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const VAR: [RegExp, string][] = [[/â/g, "a"], [/î/g, "i"], [/û/g, "u"]];
const variants = (p: string) => { const out = [p]; for (const [re, to] of VAR) for (const v of [...out]) { const n = v.replace(re, to); if (n !== v) out.push(n); } return out; };
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K2R_17_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone; fore?: "column" | "curtain" | "lamp" | "rail"; g?: number; hud?: boolean; n?: boolean };

// ── kadro ──
const G = 1040;
const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#1FC8B4", top2: "#159A8B" };
const DEFNE_K: Outfit = { top: "#C9473E", top2: "#9E342D", kind: "coat", hair: "ponytail", hairColor: "#3A2418", shoes: "#F4F4F4" };
const YABANCI: Outfit = { top: "#6E7B3A", top2: "#56612C", kind: "coat", inner: "#F28C28", hair: "cap", hairColor: "#2A2A2A", shoes: "#3A2A20" };

// gün → Van'a kalan km (HUD2)
const KM: Record<number, number> = { 0: 1600, 1: 1450, 3: 1330, 4: 1200, 6: 1010, 7: 940, 8: 860, 10: 560, 11: 560, 12: 230, 13: 150, 14: 0 };
const kmOf = (g: number) => { let v = 1600; for (const k of Object.keys(KM).map(Number).sort((x, y) => x - y)) if (k <= g) v = KM[k]; return v; };
// haritada durak → rota oranı
const RK: Record<string, number> = { İSTANBUL: 0, SAKARYA: 0.08, BOLU: 0.15, ANKARA: 0.27, KAYSERİ: 0.46, MALATYA: 0.66, MUŞ: 0.87, BİTLİS: 0.93, VAN: 1 };

type Face = { pose?: TPose; eyes?: Eyes; brow?: Brow; mouth?: Mouth; look?: number; lookY?: number; talk?: boolean; sweat?: boolean; dir?: 1 | -1; holdR?: React.ReactNode; holdL?: React.ReactNode; op?: number };
const fig = (o: Outfit) => (t: number, x: number, s = 1, f: Face = {}, y = G) => <TFig x={x} y={y} s={s} o={o} t={t} rim={0.3} {...f} />;
const sen = fig(SEN), defk = fig(DEFNE_K), yab = fig(YABANCI);
const walk = (t: number, a: number, b: number, o: Outfit, x0: number, x1: number, s = 1, f: Face = {}, y = G) => {
  const w = toonWalk(t, a, b, x0, x1, s);
  return <TFig x={w.x} y={y} s={s} o={o} t={t} dir={w.dir} walk={w.walk} rim={0.3} {...f} />;
};
const run = (t: number, a: number, b: number, o: Outfit, x0: number, x1: number, s = 1, f: Face = {}, y = G) => {
  const x = lerp(x0, x1, ramp(t, a, b)); const d: 1 | -1 = x1 > x0 ? 1 : -1;
  return <TFig x={x} y={y} s={s} o={o} t={t} pose={runPose((t - a) * 9)} dir={d} rim={0.3} {...f} />;
};
const yat = (t: number, x: number, y: number, s: number, f: Face = {}) => <g transform={`rotate(-82 ${x} ${y})`}>{sen(t, x, s, { eyes: "closed", mouth: "flat", ...f }, y)}</g>;
const cay = (s = 0.5, tea = 1) => <InceBardak x={0} y={0} s={s} tea={tea} saucer={false} />;
const q = (text: string, size = 80, k = 0.3, y = 820): R => (t, a, b) => <Txt t={t} at={a + (b - a) * k} text={text} y={y} size={size} />;
const tg = (text: string, c: string = T.hero, at = 0.5, y?: number): R => (t, a) => <Tag t={t} at={a + at} text={text} c={c} y={y} />;
const big = (text: string, color = "#F6D08A", size = 90, y = 80): R => (t, a) => <Txt t={t} at={a + 0.3} text={text} y={y} size={size} color={color} />;
const kart = (bg: string): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill={bg} /></TCam>;
const kartTxt = (l1: string, l2?: string, c1 = "#2EE6D0", c2 = "#F6C445", bg = "#0E1A2E"): Pick<Sh, "r" | "html" | "hud"> => ({ hud: false, r: kart(bg), html: (t, a) => <><Txt t={t} at={a + 0.2} text={l1} y={l2 ? 330 : 440} size={92} color={c1} />{l2 && <Txt t={t} at={a + 1.2} text={l2} y={520} size={74} color={c2} />}</> });
const cam = (z: [number, number], c0: [number, number], c1: [number, number] | undefined, node: (t: number, a: number, b: number) => React.ReactNode, shake = 0): R => (t, a, b) => <TCam t={t} a={a} b={b} z={z} c0={c0} c1={c1} shake={shake}>{node(t, a, b)}</TCam>;
const kagitBg = "#E9DCC6";

// ── araba + yol ──
type Yol = Parameters<typeof YolSahne>[0]["kind"];
type Mode = Parameters<typeof YolSahne>[0]["mode"];
type AO = { x?: number; y?: number; s?: number; id?: string; move?: boolean; lights?: number; snow?: number; buried?: number; co?: number; flat?: number; hood?: number; battery?: boolean; smoke?: number; sen?: Face | false; def?: Face | false; dog?: false | "bark" | "sit"; yabFront?: Face };
const araba = (t: number, o: AO = {}) => (
  <Araba x={o.x ?? 900} y={o.y ?? 960} s={o.s ?? 0.9} t={t} id={o.id ?? "a"} speed={o.move ? 1 : 0} smoke={o.smoke ?? (o.move ? 0.6 : 0)} lights={o.lights} snow={o.snow} buried={o.buried} co={o.co} flat={o.flat} hood={o.hood} battery={o.battery}
    front={o.yabFront ? <TFig x={95} y={-20} s={0.42} o={YABANCI} t={t} pose={P.sit} rim={0.3} {...o.yabFront} /> : o.def === false ? undefined : <TFig x={95} y={-20} s={0.42} o={DEFNE_K} t={t} pose={P.sit} rim={0.3} {...(o.def ?? {})} />}
    back={o.sen === false ? undefined : <TFig x={-110} y={-20} s={0.42} o={SEN} t={t} pose={P.sit} rim={0.3} {...(o.sen ?? {})} />}
    dog={o.dog === false ? undefined : <Kopek x={-178} y={-178} s={0.3} t={t} kind="kara" sit={1} dir={-1} bark={o.dog === "bark" ? 1 : 0} />} />
);
const yol = (t: number, kind: Yol, mode: Mode = "day", o: { move?: boolean; snow?: number; fall?: number; stars?: number; sun?: number; cars?: number; road?: boolean } = {}) =>
  <YolSahne t={t} kind={kind} mode={mode} px={o.move ? t * 420 : 0} snow={o.snow} fall={o.fall} stars={o.stars} sun={o.sun} cars={o.cars} road={o.road} />;
const surus = (kind: Yol, mode: Mode = "day", ao: AO = {}, yo: { snow?: number; fall?: number; stars?: number; sun?: number; cars?: number } = {}) => (t: number) => <>{yol(t, kind, mode, { move: true, ...yo })}{araba(t, { move: true, ...ao })}</>;
// ARABA İÇİ: büyük karakterler (ep1 boyutu). Sen = yolcu (sol), Defne = şoför (sağ), Karabaş arkada ortada.
type IO = { snow?: number; dog?: false | "bark" | "sleep"; move?: boolean; dash?: React.ReactNode; glow?: number; wheel?: boolean };
const iciNode = (t: number, mode: Mode, kind: Yol, s: Face | false = {}, d: Face | false = {}, o: IO = {}) => (
  <ArabaIci t={t} mode={mode} kind={kind} move={o.move ?? true} snow={o.snow} glow={o.glow} wheel={o.wheel} dash={o.dash}
    left={s === false ? undefined : <TFig x={700} y={1060} s={1.15} o={SEN} t={t} pose={P.sit} rim={0.3} {...s} />}
    right={d === false ? undefined : <TFig x={1220} y={1060} s={1.15} o={DEFNE_K} t={t} pose={P.hold} rim={0.3} dir={-1} {...d} />}
    dog={o.dog === false ? undefined : <Kopek x={960} y={760} s={0.85} t={t} kind="kara" sit={1} bark={o.dog === "bark" ? 1 : 0} sleep={o.dog === "sleep" ? 1 : 0} />} />
);
const ici = (mode: Mode, kind: Yol, s: Face | false = {}, d: Face | false = {}, o: IO = {}, z: [number, number] = [1, 1.06], c: [number, number] = [960, 560]): R =>
  (t, a, b) => <TCam t={t} a={a} b={b} z={z} c0={c}>{iciNode(t, mode, kind, s, d, o)}</TCam>;
const SENC: [number, number] = [700, 520], DEFC: [number, number] = [1220, 520];
// araba dışı yakın plan merkezleri (x=900,y=960,s=.9)
const harita = (from: string, to: string, night = 0): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><Harita t={t} k={lerp(RK[from], RK[to], ramp(t, a + 0.3, b - 0.4))} night={night} /></TCam>;
const mors = (text: string, surf: "kaya" | "ahir" | "agil" | "istasyon", o: { snow?: number; dust?: number; night?: number } = {}): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><MorsDuvar t={t} text={text} surf={surf} k={ramp(t, a + 0.3, b - 0.3)} snow={o.snow} dust={o.dust} night={o.night} /></TCam>;

// küçük yerel nesneler
const Hortum: React.FC<{ k: number }> = ({ k }) => <path d={`M1140,900 Q1240,${980 - k * 40} 1340,960 T1480,940`} stroke="#3A7A3A" strokeWidth={14} fill="none" strokeLinecap="round" />;
const Kurdeleler: React.FC<{ t: number; x: number; y: number }> = ({ t, x, y }) => <g transform={`translate(${x},${y})`}>{[0, 1, 2, 3].map((i) => <path key={i} d={`M0,0 Q${-60 - i * 20},${-20 + Math.sin(t * 6 + i) * 30} ${-140 - i * 30},${10 + Math.sin(t * 5 + i * 2) * 40}`} stroke={["#FFFFFF", "#F7A6C4", "#FFFFFF", "#E86A92"][i]} strokeWidth={10} fill="none" strokeLinecap="round" />)}<circle r={26} fill="#F7A6C4" /></g>;
const Lastik: React.FC<{ x: number; y: number; s?: number; rot?: number }> = ({ x, y, s = 1, rot = 0 }) => <g transform={`translate(${x},${y}) scale(${s}) rotate(${rot})`}><circle r={150} fill="#222" /><circle r={90} fill="#8A8F98" /><circle r={30} fill="#5A5F68" />{[0, 72, 144, 216, 288].map((d) => <circle key={d} cx={Math.cos((d * Math.PI) / 180) * 58} cy={Math.sin((d * Math.PI) / 180) * 58} r={11} fill="#3A3F48" />)}{Array.from({ length: 18 }).map((_, i) => <rect key={i} x={-8} y={-152} width={16} height={22} fill="#333" transform={`rotate(${i * 20})`} />)}</g>;
const Sise: React.FC<{ x: number; y: number; s?: number; burst?: number }> = ({ x, y, s = 1, burst = 1 }) => <g transform={`translate(${x},${y}) scale(${s})`}><path d="M-60,-200 L-60,-260 L-30,-300 L-30,-340 L30,-340 L30,-300 L60,-260 L60,200 Q60,230 30,230 L-30,230 Q-60,230 -60,200Z" fill="#CFE9F7" stroke="#8CC2E0" strokeWidth={6} /><rect x={-55} y={-180} width={110} height={400} fill="#EAF7FF" opacity={0.9} />{burst > 0 && <path d="M60,-40 L90,-20 L62,0 L96,30 L60,50" stroke="#8CC2E0" strokeWidth={8} fill="none" />}<rect x={-34} y={-372} width={68} height={36} rx={6} fill="#3A7BD5" /></g>;
const Kayisi: React.FC<{ x: number; y: number; s?: number }> = ({ x, y, s = 1 }) => <g transform={`translate(${x},${y}) scale(${s})`}>{[[-60, 0], [-20, -14], [20, 2], [60, -10], [0, 18], [-40, 22], [40, 24]].map(([dx, dy], i) => <g key={i}><ellipse cx={dx} cy={dy} rx={26} ry={20} fill="#E08A2E" /><ellipse cx={dx - 6} cy={dy - 6} rx={8} ry={5} fill="#F6C27A" /></g>)}</g>;
const Kriko: React.FC<{ x: number; y: number; k: number }> = ({ x, y, k }) => <g transform={`translate(${x},${y})`}><path d={`M-50,0 L0,${-40 - k * 30} L50,0 M-50,0 L0,${40 - k * 10} L50,0`} stroke="#C9C9C9" strokeWidth={10} fill="none" /><rect x={-70} y={-6} width={140} height={12} fill="#9A9A9A" /></g>;
const Rogar: React.FC<{ k: number }> = ({ k }) => <g><rect width={1920} height={1080} fill="#6E6A66" /><circle cx={960} cy={560} r={300} fill="#3A3836" />{Array.from({ length: 7 }).map((_, i) => <rect key={i} x={700 + i * 76} y={300} width={30} height={520} rx={8} fill="#141414" />)}<circle cx={960 + k * 40} cy={200 + k * 380} r={30 * (1 - k * 0.6)} fill="#C9C9C9" stroke="#8A8A8A" strokeWidth={6} /></g>;
const IsikMors: React.FC<{ t: number; a: number; code: string; x: number; y: number; stop?: number }> = ({ t, a, code, x, y, stop }) => { const on = stop !== undefined && t > stop ? 0 : morsOn(t, a, code); return <g><circle cx={x} cy={y} r={30} fill="#FFF6C8" opacity={0.25 + on * 0.75} /><circle cx={x} cy={y} r={140} fill="#FFF6C8" opacity={on * 0.25} /></g>; };

const SHOTS: Sh[] = [
  // ── KANCA: 13. GÜN, BİTLİS ──
  { c: "On üçüncü gün. Güneş", g: 13, sfx: "drone", tone: "cool", r: cam([1, 1.12], [960, 540], undefined, surus("tipi", "storm", { lights: 1, snow: 0.6 }, { snow: 1, fall: 1 })), html: big("13. GÜN · BİTLİS", "#FFFFFF", 92) },
  { c: "Önünüzde taş bir duvar var", g: 13, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.15]}><MorsDuvar t={t} text="DEFNE'Yİ BIRAK" surf="agil" k={0} snow={0.8} night={0.4} /></TCam> },
  { c: "Ve duvara biri", g: 13, sfx: "tick", tone: "cool", r: cam([2, 2.3], [960, 470], undefined, (t) => <MorsDuvar t={t} text="DEFNE'Yİ BIRAK" surf="agil" k={0} snow={0.8} night={0.4} />), html: tg("· — · · — —", T.yellow) },
  { c: "Defne harf harf okuyor", g: 13, tone: "cool", r: cam([2.4, 2.6], [960, 560], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 1, road: false })}{defk(t, 960, 1, { pose: P.point, mouth: "o", brow: "worried", talk: true })}</>) },
  { c: "Sesi titriyor", g: 13, sfx: "boom", tone: "cool", r: mors("DEFNE'Yİ BIRAK", "agil", { snow: 0.8, night: 0.4 }), html: q("“DEFNE'Yİ… BIRAK.”", 110, 0.5) },
  { c: "On üç gündür bu duvarlar size", g: 13, tone: "cool", r: cam([1.6, 1.8], [960, 600], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 1, road: false })}{sen(t, 820, 1, { mouth: "o", eyes: "wide", brow: "worried" })}{defk(t, 1100, 1, { dir: -1, mouth: "flat", brow: "worried", eyes: "squint" })}</>), html: tg("4 DUVAR · 0 HATA", T.red) },
  { c: "Van'a bir gün kaldı", g: 13, sfx: "drone", tone: "night", r: cam([2.6, 3], [1100, 560], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 1, road: false })}{defk(t, 1100, 1, { dir: -1, mouth: "frown", eyes: "wide", brow: "worried", sweat: true })}</>), html: q("…TEK İNSANI BIRAKMANI İSTİYOR.", 80, 0.5) },

  // ── YORUM + BAŞA DÖN ──
  { c: "Geçen filmin sonunda", hud: false, sfx: "whoosh", tone: "warm", r: cam([1, 1.1], [960, 560], undefined, (t) => <>{<Kopru t={t} dusk={1} rods={0} />}{sen(t, 860, 1, { pose: P.sit, mouth: "smile" }, 1000)}{defk(t, 1080, 1, { pose: P.sit, dir: -1, mouth: "smile" }, 1000)}</>), html: tg("GEÇEN FİLM", T.orange) },
  { c: "Bir yorum şöyle diyordu", hud: false, sfx: "pop", tone: "warm", r: cam([1, 1.05], [960, 540], undefined, () => <><rect width={1920} height={1080} fill="#E9E2CF" /><Kagit x={960} y={540} s={1.45} lines={["💬 “Ben balık tutacak yer ararım,", "o da malzemelerle", "bir şey yapmayı dener.”"]} c="#2A5DA8" /></>) },
  { c: "Tebrikler. Tam bir takım", hud: false, sfx: "ding", tone: "gold", r: cam([1.4, 1.5], [960, 620], undefined, (t) => <><Kopru t={t} dusk={1} rods={1} />{sen(t, 860, 1, { pose: P.cheer, mouth: "grin", eyes: "happy" }, 1000)}{defk(t, 1080, 1, { pose: P.cheer, dir: -1, mouth: "grin", eyes: "happy" }, 1000)}</>), html: q("TAM BİR TAKIM. 🎣🔧", 90, 0.2) },
  { c: "Ama dur. Baştan anlatayım", hud: false, sfx: "whoosh", tone: "warm", r: cam([1.3, 1.05], [960, 540], undefined, (t) => <Sehir t={t} mode="dusk" sun={1} />), html: big("14 GÜN ÖNCE", "#FFFFFF", 110) },

  // ── 100. GÜN · RADYO ──
  { c: "Yüzüncü gün. Galata", g: 0, hud: false, tone: "night", r: cam([1.1, 1.2], [960, 600], undefined, (t) => <><Kopru t={t} dusk={0} night={1} rods={0} />{sen(t, 860, 1, { pose: P.sit, mouth: "smile", holdR: cay(0.5) }, 1000)}{defk(t, 1080, 1, { pose: P.sit, dir: -1, mouth: "smile", holdR: cay(0.5) }, 1000)}<Radyo x={760} y={1000} s={0.5} t={t} on={1} /></>), html: tg("100. GÜN · GALATA", T.yellow) },
  { c: "Burası Van. Beni duyan", g: 0, hud: false, sfx: "static", tone: "night", r: cam([1.2, 1.3], [800, 500], undefined, (t) => <><rect width={1920} height={1080} fill="#1E2A3A" /><Radyo x={900} y={800} s={1.5} t={t} on={1} voice={1} /></>), html: q("“BURASI VAN. BENİ DUYAN VAR MI? BİZ 3 KİŞİYİZ.”", 66, 0.05) },
  { c: "Sonra ses bir cümle daha", g: 0, hud: false, tone: "night", r: cam([1.6, 1.8], [900, 640], undefined, (t) => <><rect width={1920} height={1080} fill="#1E2A3A" /><Radyo x={900} y={800} s={1.5} t={t} on={1} voice={1} /></>), html: tg("DUYMADIĞINIZ CÜMLE…", T.red) },
  { c: "Jeneratörün mazotu", g: 0, hud: false, sfx: "static", tone: "night", r: cam([2, 2.3], [900, 700], undefined, (t) => <><rect width={1920} height={1080} fill="#1E2A3A" /><Radyo x={900} y={800} s={1.5} t={t} on={1} voice={1} /></>), html: q("“MAZOT 14 GÜN YETER. SONRA BİZİ DUYAMAZSINIZ.”", 70, 0.05) },
  { c: "Van'da bir milyondan fazla", g: 0, hud: false, sfx: "drone", tone: "night", r: cam([1, 1.12], [960, 560], undefined, (t) => <VanGece t={t} bulb={0} gen={0} />), html: big("1.000.000 EV", "#FFFFFF", 110) },
  { c: "Ses susarsa", g: 0, hud: false, tone: "night", r: cam([1.2, 1.4], [960, 500], undefined, (t) => <VanGece t={t} bulb={0} gen={0} />), html: q("SES SUSARSA: İMKÂNSIZ.", 90, 0.3) },
  { c: "İstanbul'dan Van'a bin altı yüz", g: 0, sfx: "whoosh", tone: "warm", hud: false, r: harita("İSTANBUL", "VAN"), html: big("1.600 KM", "#FFFFFF", 110) },
  { c: "Normal bir dünyada", g: 0, hud: false, tone: "warm", r: harita("VAN", "VAN"), html: tg("NORMALDE: 2 GÜN", T.green) },
  { c: "Ama bu dünyada benzinlikler", g: 0, hud: false, tone: "cool", r: cam([1, 1.1], [960, 560], undefined, (t) => <Benzinlik t={t} mode="day" smoke={0} />), html: tg("POMPA = ELEKTRİK ⚡✖", T.red) },
  { c: "Ve elektrik, doksan sekiz", g: 0, hud: false, tone: "cool", ...kartTxt("ELEKTRİK YOK.", "98 GÜNDÜR.") },
  { c: "Defne defterine yazıyor", g: 0, hud: false, sfx: "tick", tone: "warm", r: cam([1, 1.06], [960, 540], undefined, (t) => <><rect width={1920} height={1080} fill={kagitBg} /><Defter lines={["Kural 1: Su", "Kural 2: Aptalca risk yok", "Kural 3: Bana Defne deme", "Kural 4: Gece yolculuk yok."]} k={ramp(t, 0, 99)} /></>), html: tg("KURAL 4", T.red) },
  { c: "On dört gün, diyor", g: 0, hud: false, tone: "warm", r: cam([2.4, 2.6], [1000, 560], undefined, (t) => <><Kopru t={t} dusk={1} rods={0} />{defk(t, 1000, 1, { pose: P.hips, mouth: "smile", brow: "up", talk: true }, 1000)}</>), html: q("“14 GÜN. YETİŞİRİZ.”", 96, 0.2) },
  { c: "Emin misin, Başkan", g: 0, hud: false, tone: "warm", r: cam([2.4, 2.6], [860, 560], undefined, (t) => <><Kopru t={t} dusk={1} rods={0} />{sen(t, 860, 1, { pose: P.shrug, mouth: "grin", talk: true }, 1000)}</>), html: q("“EMİN MİSİN, BAŞKAN?”", 96, 0.1) },
  { c: "Hayır. Sınavlarda da", g: 0, hud: false, sfx: "ding", tone: "gold", r: cam([2.4, 2.6], [1000, 560], undefined, (t) => <><Kopru t={t} dusk={1} rods={0} />{defk(t, 1000, 1, { pose: P.point, mouth: "grin", eyes: "squint", talk: true }, 1000)}</>), html: q("“HİÇ EMİN DEĞİLDİM. HEPSİNDE BİRİNCİ OLDUM.”", 70, 0.15) },

  // ── EV ──
  { c: "Yola çıkmadan önce", g: 0, hud: false, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}><Kahvalti t={t} steam={0} cold={1} note />{walk(t, a, a + 2, SEN, 1880, 1450, 1, { mouth: "flat" })}</TCam> },
  { c: "Buzdolabındaki not", g: 0, hud: false, tone: "cool", r: cam([1, 1.05], [960, 540], undefined, () => <><rect width={1920} height={1080} fill="#DDE6EE" /><Kagit x={960} y={520} s={1.5} lines={["Anne,", "geri gelirsen,", "ben iyiyim."]} c="#2A5DA8" /></>) },
  { c: "Altına bir satır ekliyorsun", g: 0, hud: false, sfx: "tick", tone: "cool", r: cam([1, 1.05], [960, 540], undefined, () => <><rect width={1920} height={1080} fill="#DDE6EE" /><Kagit x={960} y={520} s={1.5} lines={["Anne, geri gelirsen, ben iyiyim.", "Van'a gittim.", "Kahvaltıyı topladım.", "Merak etme. ❤"]} c="#2A5DA8" /></>) },
  { c: "Annenin dolabından", g: 0, hud: false, tone: "warm", r: cam([1, 1.08], [960, 600], undefined, () => <><rect width={1920} height={1080} fill={kagitBg} /><TenekeKutu y={700} s={1.1} open={0} /></>) },
  { c: "İçinde bebeklik fotoğrafların", g: 0, hud: false, tone: "warm", r: cam([1.2, 1.35], [960, 640], undefined, () => <><rect width={1920} height={1080} fill={kagitBg} /><TenekeKutu y={700} s={1.1} open={1} /></>), html: tg("FOTOĞRAF · SAÇ · BİLEKLİK", T.pink) },
  { c: "hastanede bileğine takılan", g: 0, hud: false, tone: "warm", r: cam([1.6, 1.8], [960, 380], undefined, () => <><rect width={1920} height={1080} fill={kagitBg} /><TenekeKutu y={760} s={0.9} /><Bileklik y={330} s={0.95} saat="??.??" /></>) },
  { c: "Kutuyu çantana atıyorsun", g: 0, hud: false, tone: "cool", r: cam([1.8, 2], [900, 600], undefined, (t) => <><Kahvalti t={t} steam={0} cold={1} />{sen(t, 900, 1, { pose: P.hold, mouth: "flat", look: -0.6 })}</>) },
  { c: "Bakmalıydın", g: 0, hud: false, sfx: "boom", tone: "night", ...kartTxt("BAKMALIYDIN.", undefined, "#E0393E") },

  // ── 1. GÜN ──
  { c: "Birinci gün. Sabah", g: 1, sfx: "whoosh", tone: "warm", r: harita("İSTANBUL", "İSTANBUL"), html: big("1. GÜN · 07:00", "#FFFFFF", 100) },
  { c: "Defne direksiyonda", g: 1, tone: "warm", r: cam([1, 1.1], [960, 600], undefined, surus("otoyol", "day", {}, { cars: 1 })) },
  { c: "Karabaş arka koltukta", g: 1, sfx: "boing", tone: "warm", r: ici("day","otoyol",{ mouth: "grin", holdR: <rect x={-60} y={-40} width={120} height={80} fill="#F4EAD6" /> },{ mouth: "smile" },{ dog: "bark" },[1.6,1.7],[960,620]), html: tg("KARABAŞ 🐾 · CAMDAN DIŞARI", T.orange) },
  { c: "Haritayı ters tutuyorsun", g: 1, sfx: "boing", tone: "warm", r: (t, a, b) => { const k = ramp(t, a + 1.5, a + 2.3); return <TCam t={t} a={a} b={b} z={[1, 1.04]}><g transform={`rotate(${180 - k * 180} 960 540)`}><Harita t={t} k={0} /></g></TCam>; }, html: tg("TERS 🙃", T.red, 0.3) },
  { c: "İlk sorun benzin", g: 1, tone: "warm", r: cam([1, 1.1], [960, 620], undefined, (t) => <>{yol(t, "otoyol", "day", { cars: 1 })}{araba(t, { x: 600, id: "b", sen: false, def: false, dog: false })}<Araba x={1500} y={960} s={0.9} t={t} id="dur" c="#3A7BD5" /><Hortum k={0} /></>), html: tg("BENZİN: 0", T.red) },
  { c: "Defne bir hortum buluyor", g: 1, tone: "warm", r: cam([1.8, 2], [1300, 760], undefined, (t) => <>{yol(t, "otoyol", "day", { cars: 1 })}<Araba x={1500} y={960} s={0.9} t={t} id="dur" c="#3A7BD5" /><Hortum k={1} />{defk(t, 1180, 1, { pose: P.point, mouth: "smile", talk: true })}</>), html: q("“ÇEK.”", 120, 0.6) },
  { c: "Çekiyorsun. Ve ağzına", g: 1, sfx: "splash", tone: "warm", r: cam([2.6, 2.9], [1260, 640], undefined, (t) => <>{yol(t, "otoyol", "day", { cars: 1 })}<Araba x={1500} y={960} s={0.9} t={t} id="dur" c="#3A7BD5" /><Hortum k={1} />{sen(t, 1240, 1, { pose: P.shock, mouth: "o", eyes: "wide", sweat: true })}</>), html: tg("+2 YUDUM BENZİN 🤢", T.green) },
  { c: "Yarım saat boyunca", g: 1, tone: "warm", r: ici("day","otoyol",{ mouth: "flat", brow: "worried" },{ mouth: "smile", eyes: "squint", talk: true, look: -0.8 },{},[1.5,1.6],[1060,560]), html: q("“YAKLAŞMA, ATEŞ ALIRIZ.”", 90, 0.2) },
  { c: "Galiba şaka yapıyor", g: 1, sfx: "boing", tone: "warm", r: ici("day","otoyol",{ mouth: "o", eyes: "wide", sweat: true },{ mouth: "smile" },{},[2.2,2.4],SENC), html: tg("GALİBA. 😐", T.orange) },
  { c: "Köprüye geliyorsunuz", g: 1, sfx: "whoosh", tone: "cool", r: cam([1, 1.12], [960, 560], undefined, (t) => <>{yol(t, "kopru", "day", { cars: 1 })}</>), html: tg("BOĞAZ KÖPRÜSÜ", T.blue) },
  { c: "Boğaz'ın üstünde yüzlerce", g: 1, tone: "cool", r: cam([1.4, 1.6], [960, 760], [1300, 760], (t) => <>{yol(t, "kopru", "day", { cars: 1 })}<Araba x={500} y={980} s={0.7} t={t} id="o1" c="#F6C445" /><Araba x={1400} y={980} s={0.7} t={t} id="o2" c="#7A8A9A" /></>), html: tg("HEPSİ 03:14'TE DURMUŞ", T.red) },
  { c: "Bir otobüs. Bir kamyon", g: 1, tone: "cool", r: cam([2, 2.2], [1100, 820], undefined, (t) => <>{yol(t, "kopru", "day", { cars: 1 })}<Araba x={1100} y={980} s={0.9} t={t} id="gelin" c="#FFFFFF" /><Kurdeleler t={t} x={1280} y={860} /></>), html: tg("GELİN ARABASI 💐", T.pink, 1.2) },
  { c: "Defne aralarından slalom", g: 1, sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} shake={4}>{yol(t, "kopru", "day", { move: true, cars: 1 })}<g transform={`rotate(${Math.sin(t * 6) * 4} 900 960)`}>{araba(t, { move: true, sen: { mouth: "o", eyes: "wide", sweat: true }, def: { mouth: "smile", brow: "angry" } })}</g></TCam> },
  { c: "Karabaş kıpırdamıyor bile", g: 1, tone: "warm", r: ici("day","kopru",{ mouth: "o", eyes: "wide", sweat: true, pose: P.shock },{ mouth: "smile", brow: "angry" },{ dog: "sleep" },[1.8,2],[960,600]), html: q("KARABAŞ, DEFNE'YE SENDEN ÇOK GÜVENİYOR.", 70, 0.3) },
  { c: "Ve Asya yakasına", g: 1, tone: "gold", r: cam([1, 1.1], [960, 560], undefined, (t) => <Sehir t={t} mode="day" sun={0.5} />), html: tg("İLK KEZ İSTANBUL DIŞINA", T.hero) },
  { c: "Akşamüstü Sakarya'yı", g: 1, sfx: "whoosh", tone: "gold", r: harita("İSTANBUL", "SAKARYA"), html: tg("SAKARYA", T.orange) },
  { c: "Güneş batıyor", g: 1, tone: "gold", r: cam([1, 1.1], [960, 560], undefined, surus("bozkir", "dusk", { lights: 0.3 }, { sun: 1 })) },
  { c: "Ve bir şey oluyor", g: 1, sfx: "drone", tone: "night", n: true, r: ici("dusk","bozkir",{ mouth: "flat", eyes: "squint" },{ mouth: "smile" },{},[2.2,2.5],SENC)},
  { c: "Önce susuyorsun", g: 1, tone: "night", n: true, r: ici("dusk","bozkir",{ mouth: "none", eyes: "open" },{ mouth: "o", look: -1 },{},[1.3,1.4],[960,560]), html: q("100 GÜNDÜR SUSMAYAN SEN… SUSUYORSUN.", 72, 0.5) },
  { c: "Sonra haritaya bakıyorsun", g: 1, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1, 1.04]}><Harita t={t} k={ramp(t, a + 0.6, b)} night={0.6} /></TCam><GeceModu t={t} a={a} saat="18:12" /></> },
  { c: "Van'a kadar bütün yolu", g: 1, n: true, sfx: "tick", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.05, 1.15]}><Harita t={t} k={ramp(t, a, b - 0.3)} night={0.6} /></TCam><GeceModu t={t} a={a} notes={[{ x: 520, y: 400, text: "BOLU · 270 KM" }, { x: 860, y: 560, text: "ANKARA · 450 KM", dx: 0, dy: -200 }, { x: 1500, y: 600, text: "VAN · 1.600 KM", dx: -100, dy: -260 }]} /></>, html: tg("KASABA KASABA. KM KM.", T.hero) },
  { c: "Defne arabayı kenara", g: 1, n: true, sfx: "buzz", tone: "night", r: cam([1, 1.1], [900, 700], undefined, (t) => <>{yol(t, "bozkir", "dusk", { sun: 0.6 })}{araba(t, { lights: 0.6, sen: { mouth: "flat" }, def: { mouth: "o", eyes: "wide" } })}</>) },
  { c: "Sen konuşmaya devam", g: 1, n: true, tone: "night", r: (t, a) => <><TCam t={t} a={a} b={a + 9} z={[1, 1.05]}>{yol(t, "bozkir", "dusk", { sun: 0.6 })}{araba(t, { lights: 0.6, sen: { mouth: "flat", talk: true }, def: { mouth: "o", eyes: "wide" } })}</TCam><GeceModu t={t} a={a} notes={[{ x: 700, y: 990, text: "SOL ARKA: HAVA −%10" }, { x: 1080, y: 760, text: "ÇATLAK +2 CM", dx: 160, dy: -220 }, { x: 990, y: 800, text: "NAKARAT YANLIŞ ♪", dx: -260, dy: -300 }]} /></> },
  { c: "Ön camdaki çatlak", g: 1, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[1080, 780]}>{yol(t, "bozkir", "dusk", { sun: 0.6 })}{araba(t, { lights: 0.6, sen: { mouth: "flat", talk: true }, def: { mouth: "o", eyes: "wide" } })}</TCam><GeceModu t={t} a={a} notes={[{ x: 1000, y: 560, text: "ÇATLAK: +2 CM", dx: 200, dy: -200 }]} /></> },
  { c: "Ve sen kırk dakikadır", g: 1, n: true, sfx: "ding", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={DEFC}>{iciNode(t, "dusk", "bozkir", { mouth: "flat", talk: true }, { mouth: "o", eyes: "wide", look: -1 }, { move: false, glow: 1 })}</TCam><GeceModu t={t} a={a} notes={[{ x: 1220, y: 560, text: "♪ NAKARAT YANLIŞ", dx: -300, dy: -200 }]} /></>, html: q("“NAKARATI YANLIŞ SÖYLÜYORSUN.”", 84, 0.5) },
  { c: "Defne sana bakıyor. Sen kimsin", g: 1, n: true, sfx: "boom", tone: "night", r: ici("dusk","bozkir",{ mouth: "flat", eyes: "squint" },{ mouth: "o", eyes: "wide", brow: "worried", look: -1, talk: true },{ move: false, glow: 1 },[2.2,2.4],DEFC), html: q("“SEN KİMSİN?”", 120, 0.2) },
  { c: "Bilmiyorsun. Ama kafanın", g: 1, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={SENC}>{iciNode(t, "night", "bozkir", { mouth: "flat", eyes: "open" }, { mouth: "flat" }, { move: false, glow: 1 })}</TCam><GeceModu t={t} a={a} k={0.7} /></>, html: tg("SESSİZ. NET.", T.hero) },
  { c: "Bütün gece uyumuyorsun", g: 1, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 400]}><Gok t={t} mode="night" stars={1} milky={1} />{araba(t, { y: 1000, lights: 0, sen: { mouth: "flat", look: 0.6, lookY: -1 }, def: { eyes: "closed" } })}</TCam><GeceModu t={t} a={a} k={0.6} /></> },
  { c: "Dört bin iki yüz on yedi", g: 1, n: true, sfx: "ding", tone: "night", r: cam([1, 1.08], [960, 400], undefined, (t) => <Gok t={t} mode="night" stars={1} milky={1} />), html: (t, a, b) => <Txt t={t} at={a + 0.1} text={Math.round(lerp(3900, 4217, ramp(t, a, a + 1.6))).toLocaleString("tr-TR") + " ★"} y={420} size={160} color="#F6D08A" /> },
  { c: "Sonra saat üçü on dört", g: 1, n: true, sfx: "tick", tone: "night", r: cam([1, 1.1], [960, 540], undefined, () => <><rect width={1920} height={1080} fill="#0E1A2E" /><Saat x={960} y={540} s={2.2} h={3} m={14} /></>) },
  { c: "Kafanın içinde bir şey kopuyor", g: 1, n: true, sfx: "boom", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.4, 2.2]} c0={SENC} shake={10}>{iciNode(t, "night", "bozkir", { mouth: "frown", eyes: "closed", brow: "worried" }, { eyes: "closed" }, { move: false, glow: 1 })}</TCam><GeceModu t={t} a={a} crash={1} /></>},
  { c: "Ve olduğun yere düşüp", g: 1, tone: "night", r: ici("night","bozkir",{ eyes: "closed", mouth: "o", pose: P.back },{ mouth: "o", eyes: "wide" },{ move: false },[1.4,1.5],[960,560]), html: tg("ÖLÜ GİBİ 💤", T.purple) },
  { c: "Sabah gözünü açıyorsun", g: 2, sfx: "tick", tone: "warm", r: cam([1.8, 2], [960, 640], undefined, (t) => <>{yol(t, "bozkir", "day", { road: false })}{yat(t, 760, 1000, 0.9, { eyes: "open", mouth: "o" })}{defk(t, 1180, 1, { pose: P.sit, dir: -1, mouth: "flat", look: -0.6, holdR: <rect x={-30} y={-40} width={60} height={80} fill="#F4EAD6" /> })}</>) },
  { c: "Ne oldu? diyorsun", g: 2, tone: "warm", r: cam([2.6, 2.8], [860, 600], undefined, (t) => <>{yol(t, "bozkir", "day", { road: false })}{sen(t, 860, 1, { pose: P.shrug, mouth: "grin", talk: true })}</>), html: q("“NE OLDU? NEDEN BÖYLE BAKIYORSUN?”", 80, 0.1) },
  { c: "Her şeyi hatırlıyorsun", g: 2, tone: "cool", r: cam([2.8, 3], [860, 560], undefined, (t) => <>{yol(t, "bozkir", "day", { road: false })}{sen(t, 860, 1, { mouth: "flat", eyes: "wide", brow: "worried" })}</>), html: q("AMA O ÇOCUK… SEN DEĞİL GİBİ.", 80, 0.4) },
  { c: "Defne yazıyor: Birinci gece", g: 2, sfx: "tick", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill={kagitBg} /><Defter lines={["1. gece:", "Güneş batınca başladı.", "03:14'te bitti."]} k={ramp(t, a + 0.2, b - 0.4)} /></TCam> },
  { c: "Beyin tehlikedeyken", g: 2, tone: "warm", r: cam([2.4, 2.6], [1000, 560], undefined, (t) => <>{yol(t, "bozkir", "day", { road: false })}{defk(t, 1000, 1, { pose: P.point, mouth: "flat", talk: true, brow: "up" })}</>), html: tg("BİLİM: STRES → KESKİN BEYİN", T.blue) },
  { c: "Ama bu kadar değil", g: 2, tone: "cool", r: cam([2.8, 3], [1000, 520], undefined, (t) => <>{yol(t, "bozkir", "day", { road: false })}{defk(t, 1000, 1, { mouth: "frown", eyes: "squint", brow: "worried", talk: true })}</>), html: q("“AMA BU KADAR DEĞİL.”", 96, 0.1) },
  { c: "Sonra sayfanın köşesine", g: 2, tone: "cool", r: cam([2.2, 2.5], [1380, 260], undefined, () => <><rect width={1920} height={1080} fill={kagitBg} /><Defter lines={["1. gece:", "Güneş batınca başladı.", "03:14'te bitti."]} corner="?" /></>), html: tg("GÖRMENİ İSTEMEDİĞİ BİR ŞEY", T.red) },

  // ── 3. GÜN · BOLU ──
  { c: "Üçüncü gün, Bolu", g: 3, sfx: "whoosh", tone: "cool", r: harita("SAKARYA", "BOLU"), html: big("3. GÜN · BOLU DAĞI", "#FFFFFF", 92) },
  { c: "Tünelin ağzı tırlarla", g: 3, tone: "cool", r: cam([1, 1.15], [960, 560], undefined, (t) => <>{yol(t, "tunel", "day", { snow: 0.6 })}{araba(t, { x: 400, id: "t" })}</>), html: tg("TIR · TIR · TIR · KAPALI", T.red) },
  { c: "Eski dağ yoluna", g: 3, tone: "cool", r: cam([1, 1.1], [960, 560], undefined, surus("dag", "day", { snow: 0.3 }, { snow: 1, fall: 0.6 })) },
  { c: "Ve virajlardan birinde", g: 3, sfx: "buzz", tone: "cool", r: cam([1.15, 1.25], [1050, 640], undefined, (t) => <>{yol(t, "dag", "day", { snow: 1, fall: 0.5 })}{araba(t, { x: 820, id: "v" })}</>) },
  { c: "Noktalar. Ve çizgiler", g: 3, sfx: "tick", tone: "cool", r: cam([1.6, 1.8], [960, 470], undefined, (t) => <MorsDuvar t={t} text="15 DK BEKLE" surf="kaya" k={0} dust={1} snow={1} />), html: tg("· — —  — · · ·", T.yellow) },
  { c: "Birbirinize bakıyorsunuz", g: 3, tone: "cool", r: cam([1.6, 1.8], [960, 600], undefined, (t) => <>{yol(t, "dag", "day", { snow: 1, road: false })}{sen(t, 840, 1, { mouth: "o", eyes: "wide", look: 0.6 })}{defk(t, 1080, 1, { dir: -1, mouth: "o", eyes: "wide", look: 0.6 })}</>), html: q("MORS. SİZİN DİLİNİZ.", 90, 0.4) },
  { c: "Defne harf harf okuyor. On beş", g: 3, sfx: "ding", tone: "cool", r: mors("15 DK BEKLE", "kaya", { snow: 1, dust: 1 }), html: q("“ON BEŞ… DAKİKA… BEKLE.”", 90, 0.6) },
  { c: "Kim yazmış bunu", g: 3, tone: "cool", r: cam([2.4, 2.6], [840, 560], undefined, (t) => <>{yol(t, "dag", "day", { snow: 1, road: false })}{sen(t, 840, 1, { pose: P.point, mouth: "open", talk: true })}</>), html: q("“KİM YAZMIŞ BUNU?”", 90, 0.1) },
  { c: "Bilmiyorum. Ama taşın tozu", g: 3, tone: "cool", r: cam([2.4, 2.8], [960, 560], undefined, (t) => <MorsDuvar t={t} text="15 DK BEKLE" surf="kaya" k={1} dust={1} snow={1} />), html: q("“TAŞIN TOZU HÂLÂ YENİ.”", 90, 0.2) },
  { c: "Bekliyorsunuz. Sen sıkılıyorsun", g: 3, sfx: "boing", tone: "warm", r: cam([1.6, 1.8], [960, 700], undefined, (t) => <>{yol(t, "dag", "day", { snow: 1, road: false })}{sen(t, 860, 1, { pose: P.wave, mouth: "grin", talk: true })}<Kopek x={1100} y={1040} s={0.6} t={t} kind="kara" sit={1} dir={-1} /></>), html: tg("FIKRA #1 · #2 · #3…", T.orange) },
  { c: "Karabaş da sıkılıyor", g: 3, sfx: "boing", tone: "warm", r: cam([3, 3.2], [1100, 960], undefined, (t) => <>{yol(t, "dag", "day", { snow: 1, road: false })}<Kopek x={1100} y={1040} s={0.6} t={t} kind="kara" sleep={1} dir={-1} /></>), html: tg("💤", T.purple) },
  { c: "On beşinci dakikada", g: 3, tone: "cool", r: cam([1, 1.1], [960, 560], undefined, surus("dag", "day", {}, { snow: 1 })), html: tg("15:00 ✓", T.green) },
  { c: "İki yüz metre sonra", g: 3, sfx: "buzz", tone: "cool", r: cam([1.2, 1.3], [800, 760], undefined, (t) => <>{yol(t, "dag", "day", { snow: 1 })}{araba(t, { x: 500, def: { mouth: "o", eyes: "wide" } })}<KurtIzi k={1} /></>) },
  { c: "Yolun ortasında, karın", g: 3, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.9]} c0={[1100, 940]}>{yol(t, "dag", "day", { snow: 1 })}<KurtIzi k={ramp(t, a, b)} big fresh={1} /></TCam>, html: tg("KÖPEK İZİ DEĞİL", T.red) },
  { c: "Kurt", g: 3, sfx: "boom", tone: "night", r: cam([1, 1.12], [1500, 700], undefined, (t) => <>{yol(t, "dag", "day", { snow: 1, fall: 0.6 })}<KurtIzi /><Kurt x={1450} y={760} s={0.6} t={t} /><Kurt x={1620} y={770} s={0.55} t={t + 0.3} /><Kurt x={1780} y={780} s={0.5} t={t + 0.6} /></>), html: big("KURT.", "#E0393E", 130, 420) },
  { c: "İzler yeni", g: 3, tone: "cool", r: cam([1.4, 1.6], [960, 900], undefined, (t) => <>{yol(t, "dag", "day", { snow: 1 })}<KurtIzi fresh={1} /></>), html: q("TAM 15 DAKİKA ÖNCE.", 90, 0.4) },
  { c: "Bolu ormanlarında kurt", g: 3, tone: "cool", r: cam([1.3, 1.5], [1500, 640], undefined, (t) => <>{yol(t, "dag", "storm", { snow: 1, fall: 1 })}<Kurt x={1500} y={740} s={0.9} t={t} howl={1} /></>), html: tg("GERÇEK: BOLU'DA KURT VAR", T.blue) },
  { c: "Karabaş hayatında ilk kez", g: 3, sfx: "boing", tone: "warm", r: cam([2.4, 2.6], [900, 860], undefined, (t) => <>{yol(t, "dag", "day", { snow: 1, road: false })}{sen(t, 900, 1, { mouth: "o", eyes: "wide", sweat: true })}<Kopek x={900} y={1040} s={0.5} t={t} kind="kara" sit={1} /></>) },
  { c: "Defne defterine yazıyor. Kural beş", g: 3, sfx: "tick", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill={kagitBg} /><Defter lines={["Kural 1: Su", "Kural 2: Aptalca risk yok", "Kural 3: Bana Defne deme", "Kural 4: Gece yolculuk yok", "Kural 5: Duvarlar ne derse,", "onu yapacağız."]} k={ramp(t, a + 0.2, b - 0.3)} /></TCam> },
  { c: "Ya duvar Başkanını bırak", g: 3, sfx: "boing", tone: "warm", r: cam([2.4, 2.6], [860, 560], undefined, (t) => <>{yol(t, "dag", "day", { snow: 1, road: false })}{sen(t, 860, 1, { pose: P.shrug, mouth: "grin", talk: true })}</>), html: q("“YA DUVAR ‘BAŞKANINI BIRAK’ DERSE?”", 76, 0.1) },
  { c: "Defne gülüyor. Ve bu", g: 3, tone: "gold", r: cam([2.4, 2.6], [1080, 560], undefined, (t) => <>{yol(t, "dag", "day", { snow: 1, road: false })}{defk(t, 1080, 1, { dir: -1, mouth: "grin", eyes: "happy" })}</>), html: q("…SON KOLAY GÜLÜŞÜ.", 90, 0.5) },
  { c: "Bu arada, eğer sen de", g: 3, hud: false, tone: "warm", r: cam([1, 1.08], [960, 540], undefined, (t) => <MorsDuvar t={t} text="15 DK BEKLE" surf="kaya" k={1} dust={0.5} snow={1} />), html: (t, a) => <><Txt t={t} at={a + 0.3} text="KİM KAZIDI? CEVAP VAN'DA." y={200} size={80} color="#FFFFFF" /><Abone t={t} at={a + 1.4} /></> },

  // ── 4. GÜN · ANKARA ──
  { c: "Dördüncü gün, Ankara", g: 4, sfx: "whoosh", tone: "cool", r: harita("BOLU", "ANKARA"), html: big("4. GÜN · ANKARA", "#FFFFFF", 92) },
  { c: "Bomboş bulvarlar", g: 4, tone: "cool", r: cam([1, 1.12], [960, 540], [1100, 540], (t) => <Kizilay t={t} px={t * 30} pigeons={0} />), html: tg("SÖNÜK IŞIKLAR", T.red) },
  { c: "Ve Kızılay'ın ortasında", g: 4, sfx: "pop", tone: "warm", r: cam([1.8, 2], [1200, 860], undefined, (t) => <Kizilay t={t} pigeons={1} />), html: tg("SİMİT TEZGÂHI YAĞMASI 🕊️", T.orange) },
  { c: "Ve sol arka lastik patlıyor", g: 4, sfx: "boom", tone: "warm", r: cam([1.4, 1.6], [1100, 900], undefined, (t) => <><Kizilay t={t} pigeons={0.4} />{araba(t, { x: 1300, y: 1000, s: 0.8, id: "k", flat: 1, def: { mouth: "o", eyes: "wide" }, sen: { mouth: "o", eyes: "wide" } })}</>), html: big("PAT!", "#E0393E", 140, 380) },
  { c: "Gece olan senin söylediği", g: 4, tone: "night", r: (t, a) => <><rect width={1920} height={1080} fill="#0E1A2E" /><GeceModu t={t} a={a} notes={[{ x: 960, y: 540, text: "SOL ARKA: HAVA −%10" }]} /></>, html: tg("GECE OLAN SEN BİLİYORDU", T.hero, 0.3) },
  { c: "Gündüz olan sen, krikoyla", g: 4, sfx: "boing", tone: "warm", r: cam([2, 2.2], [1100, 880], undefined, (t) => <><Kizilay t={t} pigeons={0.3} />{araba(t, { x: 1300, y: 1000, s: 0.8, id: "k", flat: 1, sen: false, def: false })}<Kriko x={1100} y={1020} k={(Math.sin(t * 4) + 1) / 2} />{sen(t, 980, 1, { pose: mixPose(P.reach, P.shock, (Math.sin(t * 4) + 1) / 2), mouth: "frown", sweat: true, brow: "angry" })}</>), html: tg("KRİKO 1 – SEN 0", T.red) },
  { c: "Defne bagajı açıyor", g: 4, tone: "warm", r: cam([1, 1.06], [960, 540], undefined, () => <><rect width={1920} height={1080} fill="#2A2F38" /><rect x={260} y={300} width={1400} height={600} rx={30} fill="#1A1D22" /><Lastik x={900} y={600} s={1.4} /><rect x={1250} y={560} width={300} height={34} rx={14} fill="#B9BEC6" transform="rotate(-20 1400 577)" /></>), html: tg("TERTEMİZ LASTİK + BİJON ANAHTARI", T.green) },
  { c: "Bunu kim koydu", g: 4, tone: "warm", r: cam([2.4, 2.6], [860, 560], undefined, (t) => <><Kizilay t={t} pigeons={0} />{sen(t, 860, 1, { pose: P.shrug, mouth: "o", eyes: "wide", talk: true })}</>), html: q("“BUNU KİM KOYDU?”", 96, 0.1) },
  { c: "Defne sana bakıyor. Sen. Dün", g: 4, sfx: "ding", tone: "warm", r: cam([2.4, 2.6], [1080, 560], undefined, (t) => <><Kizilay t={t} pigeons={0} />{defk(t, 1080, 1, { pose: P.point, dir: -1, mouth: "smile", eyes: "squint", talk: true })}</>), html: q("“DÜN GECE. SEN.”", 88, 0.1) },
  { c: "Hatırlıyorsun. Gece olan sen", g: 4, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[900, 760]}>{yol(t, "bozkir", "night", { stars: 1, road: false })}<Araba x={900} y={960} s={0.9} t={t} id="g" lights={0} />{sen(t, 1200, 1, { pose: P.hold, mouth: "flat", holdR: <g transform="scale(0.25)"><Lastik x={0} y={0} /></g> })}</TCam><GeceModu t={t} a={a} saat="02:00" k={0.8} /></>, html: tg("GÜNDÜZ OLAN SANA 🎁", T.hero) },
  { c: "Kendinden gelen bir hediye", g: 4, tone: "warm", r: cam([2.6, 2.8], [860, 560], undefined, (t) => <><Kizilay t={t} pigeons={0} />{sen(t, 860, 1, { pose: P.think, mouth: "smile", eyes: "squint" })}</>), html: q("GARİP. AMA İŞE YARIYOR.", 84, 0.3) },
  { c: "Lastiği Defne takıyor", g: 4, tone: "warm", r: cam([2.2, 2.4], [1100, 880], undefined, (t) => <><Kizilay t={t} pigeons={0} />{araba(t, { x: 1300, y: 1000, s: 0.8, id: "k", sen: false, def: false })}{defk(t, 1080, 1, { pose: P.reach, mouth: "flat", brow: "angry" })}{sen(t, 880, 1, { pose: P.hold, mouth: "smile" })}</>) },
  { c: "Ve bir tanesini rögar", g: 4, sfx: "splash", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><Rogar k={ramp(t, a + 0.4, a + 1.4)} /></TCam>, html: tg("BİJON: GİTTİ 🕳️", T.red) },
  { c: "Gece olan sen, bunu hesaplamamıştı", g: 4, sfx: "boing", tone: "warm", r: cam([2.8, 3], [860, 540], undefined, (t) => <><Kizilay t={t} pigeons={0} />{sen(t, 860, 1, { pose: P.shrug, mouth: "grin", sweat: true })}</>), html: q("GECE OLAN SEN BUNU HESAPLAMAMIŞTI.", 74, 0.2) },

  // ── 6. GÜN · BOZKIR · ÇEŞME ──
  { c: "Altıncı gün, Orta", g: 6, sfx: "whoosh", tone: "cool", r: harita("ANKARA", "KAYSERİ"), html: big("6. GÜN · BOZKIR", "#FFFFFF", 92) },
  { c: "Bozkır. Kilometrelerce", g: 6, tone: "cool", r: cam([1, 1.15], [960, 540], undefined, surus("bozkir", "day", { s: 0.5, y: 1000, x: 960 }, { snow: 1 })), html: tg("BEMBEYAZ BİR HİÇLİK", T.blue) },
  { c: "Su bitiyor", g: 6, tone: "cool", r: cam([1, 1.08], [960, 600], undefined, () => <><rect width={1920} height={1080} fill="#BFD8E8" /><Sise x={760} y={600} s={1.2} burst={1} /><Sise x={1160} y={620} s={1.1} burst={1} /></>), html: tg("DONMUŞ · PATLAMIŞ", T.red) },
  { c: "Köylerdeki musluklar kuru", g: 6, tone: "cool", ...kartTxt("MUSLUK: KURU.", "POMPA MOTORLARI 3 AYDIR DURUK.") },
  { c: "Sen kar yemeyi öneriyorsun", g: 6, tone: "warm", r: cam([2.2, 2.4], [960, 560], undefined, (t) => <>{yol(t, "bozkir", "day", { snow: 1, road: false })}{sen(t, 860, 1, { pose: P.hold, mouth: "grin" })}{defk(t, 1080, 1, { dir: -1, pose: P.point, mouth: "flat", brow: "angry", talk: true })}</>), html: q("“KAR YERSEN VÜCUT ISIN DÜŞER.”", 80, 0.4) },
  { c: "Sen yine de yiyorsun", g: 6, sfx: "boing", tone: "cool", r: cam([2.8, 3], [860, 540], undefined, (t) => <>{yol(t, "bozkir", "day", { snow: 1, road: false })}<g transform={`translate(${Math.sin(t * 60) * 4},0)`}>{sen(t, 860, 1, { mouth: "frown", eyes: "squint", sweat: true })}</g></>, 3), html: tg("TAK TAK TAK TAK 🥶", T.blue) },
  { c: "Öğlene doğru, terk edilmiş", g: 6, tone: "cool", r: cam([1, 1.1], [960, 560], undefined, (t) => <MorsDuvar t={t} text="SAĞA 3 METRE" surf="ahir" k={0} snow={0.6} />) },
  { c: "Sağa... üç... metre", g: 6, sfx: "ding", tone: "cool", r: mors("SAĞA 3 METRE", "ahir", { snow: 0.6 }), html: q("“SAĞA… ÜÇ… METRE.”", 96, 0.6) },
  { c: "Sağa üç metre yürüyorsun", g: 6, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 700]}>{yol(t, "bozkir", "day", { snow: 1, road: false })}{walk(t, a, a + 1.8, SEN, 700, 1100, 1, { mouth: "flat" })}</TCam>, html: tg("SADECE KAR.", T.blue, 1.6) },
  { c: "Karabaş havlıyor", g: 6, sfx: "pop", tone: "warm", r: cam([2, 2.2], [1200, 900], undefined, (t) => <>{yol(t, "bozkir", "day", { snow: 1, road: false })}<Kopek x={1200} y={1040} s={0.7} t={t} kind="kara" bark={1} wag={1} /></>) },
  { c: "Karın altından taş çıkıyor", g: 6, tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.4]} c0={[960, 560]}><Cesme t={t} dug={ramp(t, a, b - 0.5)} flow={0} /></TCam>, html: tg("OYMA TAŞ · ESKİ YAZI", T.orange) },
  { c: "Ve lüleden, ince ince", g: 6, sfx: "splash", tone: "gold", r: cam([2.4, 2.6], [960, 600], undefined, (t) => <Cesme t={t} dug={1} flow={1} />), html: q("SU AKIYOR. 💧", 100, 0.3) },
  { c: "Bir Osmanlı çeşmesi", g: 6, tone: "gold", r: cam([1, 1.1], [960, 540], undefined, (t) => <Cesme t={t} dug={1} flow={1} />), html: tg("≈150 YAŞINDA", T.orange) },
  { c: "Bu çeşmelerin çoğunda motor", g: 6, tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]}><rect width={1920} height={1080} fill="#E9E2CF" /><path d="M200,200 Q600,240 900,500 T1500,700" stroke="#3A7BD5" strokeWidth={22} fill="none" strokeDasharray="40 20" strokeDashoffset={-t * 80} /><path d="M80,260 L300,120 L520,260Z" fill="#8A7A6A" /><text x={300} y={320} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={44} fill="#2A5DA8">KAYNAK</text><rect x={1460} y={620} width={200} height={200} rx={10} fill="#C9B9A0" /><text x={1560} y={880} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={44} fill="#2A5DA8">ÇEŞME</text></TCam>, html: tg("SADECE YER ÇEKİMİ · 0 ELEKTRİK", T.blue) },
  { c: "Elektrik gitti", g: 6, tone: "gold", r: cam([1.6, 1.8], [960, 560], undefined, (t) => <Cesme t={t} dug={1} flow={1} />), html: q("150 YILLIK ÇEŞME, HÂLÂ ÇALIŞIYOR.", 80, 0.3) },
  { c: "Karabaş ilk içiyor", g: 6, tone: "gold", r: cam([1.4, 1.5], [960, 700], undefined, (t) => <Cesme t={t} dug={1} flow={1} dog={<Kopek x={1100} y={1000} s={0.6} t={t} kind="kara" wag={1} />} />), html: tg("SIRAYLA. DEFNE KURALI.", T.pink) },

  // ── LOKANTA · KISKANÇLIK ──
  { c: "O akşam, yol kenarında", g: 6, tone: "gold", r: cam([1, 1.1], [960, 560], undefined, (t) => <Lokanta t={t} people={<>{sen(t, 700, 0.95, { pose: P.sit, mouth: "flat" }, 1000)}{defk(t, 1220, 0.95, { pose: P.sit, dir: -1, mouth: "smile" }, 1000)}</>} />), html: tg("MUM IŞIĞINDA 🕯️", T.yellow) },
  { c: "Zekâ soruları", g: 6, n: true, tone: "gold", r: cam([2.2, 2.4], [1220, 600], undefined, (t) => <Lokanta t={t} people={<>{defk(t, 1220, 0.95, { pose: P.sit, dir: -1, mouth: "grin", talk: true }, 1000)}</>} />), html: tg("DEFNE'NİN EN SEVDİĞİ ŞEY", T.pink) },
  { c: "Sekiz soru soruyor", g: 6, n: true, sfx: "ding", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[700, 600]}><Lokanta t={t} people={sen(t, 700, 0.95, { pose: P.sit, mouth: "flat", talk: true }, 1000)} /></TCam><GeceModu t={t} a={a} k={0.6} /></>, html: (t, a, b) => <Txt t={t} at={a + 0.2} text={`${Math.min(8, 1 + Math.floor(((t - a) / Math.max(0.5, b - a - 0.4)) * 8))} / 8 ✓`} y={200} size={120} color="#2EE6D0" /> },
  { c: "Defne kalemi masaya bırakıyor", g: 6, n: true, sfx: "pop", tone: "night", r: cam([2.4, 2.6], [1220, 620], undefined, (t) => <Lokanta t={t} people={defk(t, 1220, 0.95, { pose: P.sit, dir: -1, mouth: "flat", eyes: "squint", brow: "angry" }, 1000)} />), html: q("SINIF BİRİNCİSİ, İLK KEZ İKİNCİ.", 80, 0.4) },
  { c: "Kopya mı çekiyorsun", g: 6, n: true, tone: "night", r: cam([2.6, 2.8], [1220, 580], undefined, (t) => <Lokanta t={t} people={defk(t, 1220, 0.95, { pose: P.sit, dir: -1, mouth: "frown", brow: "angry", talk: true }, 1000)} />), html: q("“KOPYA MI ÇEKİYORSUN?”", 96, 0.1) },
  { c: "Kimden çekeyim", g: 6, n: true, sfx: "ding", tone: "night", r: cam([2.6, 2.8], [700, 580], undefined, (t) => <Lokanta t={t} people={sen(t, 700, 0.95, { pose: P.sit, mouth: "flat", talk: true }, 1000)} />), html: q("“KİMDEN? DÜNYADA İKİ KİŞİYİZ.”", 86, 0.1) },
  { c: "Kıskanıyor", g: 6, tone: "night", r: cam([3, 3.3], [1220, 560], undefined, (t) => <Lokanta t={t} people={defk(t, 1220, 0.95, { pose: P.sit, dir: -1, mouth: "flat", eyes: "squint", brow: "angry", look: 0.4 }, 1000)} />), html: tg("KISKANIYOR 😤", T.red) },
  { c: "Ama asıl tuhaf olan şu", g: 6, sfx: "whoosh", hud: false, tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><rect width={960} height={1080} fill="#F6D08A" /><rect x={960} width={960} height={1080} fill="#0E1A2E" /><text x={480} y={200} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={70} fill="#B23A3F">GÜNDÜZ ☀️</text><text x={1440} y={200} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={70} fill="#2EE6D0">GECE 🌙</text>{sen(t, 480, 1, { pose: P.cheer, mouth: "grin", eyes: "happy" }, 1000)}{sen(t, 1440, 1, { mouth: "flat", eyes: "squint" }, 1000)}</TCam> },
  { c: "Gündüz olan sen her şeyi", g: 6, hud: false, tone: "warm", r: cam([1.8, 2], [480, 600], undefined, (t) => <><rect width={960} height={1080} fill="#F6D08A" /><rect x={960} width={960} height={1080} fill="#0E1A2E" />{sen(t, 480, 1, { pose: P.shrug, mouth: "grin", eyes: "happy" }, 1000)}</>), html: tg("TERS HARİTA · BENZİN · KAR", T.orange) },
  { c: "Gece olan sen ise", g: 6, hud: false, tone: "night", r: cam([1.8, 2], [1440, 600], undefined, (t) => <><rect width={960} height={1080} fill="#F6D08A" /><rect x={960} width={960} height={1080} fill="#0E1A2E" />{sen(t, 1440, 1, { mouth: "flat", eyes: "squint" }, 1000)}</>), html: q("…VE DEFNE GÜNDÜZ OLANI BEKLİYOR.", 76, 0.5) },
  { c: "Bir gece arabada", g: 7, n: true, tone: "night", r: ici("night","bozkir",{ mouth: "flat", look: 0.6, lookY: -1 },{ mouth: "flat", eyes: "squint", look: -0.6, talk: true },{ move: false, glow: 0.5 },[2,2.2],DEFC), html: q("“O SALAK HALİNİ ÖZLEDİM.”", 92, 0.4) },
  { c: "Duyuyorsun. Ama gece olan", g: 7, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={SENC}>{iciNode(t, "night", "bozkir", { mouth: "flat", eyes: "open", look: 1 }, { eyes: "closed" }, { move: false, glow: 1 })}</TCam><GeceModu t={t} a={a} k={0.5} notes={[{ x: 960, y: 600, text: "CEVAP: ???" }]} /></>},

  // ── 7. GECE · DENEY ──
  { c: "Yedinci gece Defne", g: 7, n: true, sfx: "tick", tone: "night", r: ici("night","bozkir",{ mouth: "flat", eyes: "squint" },{ mouth: "smile", eyes: "squint", pose: P.point },{ move: false, glow: 1 },[1.1,1.2],[960,560]), html: tg("DENEY 🧪", T.purple) },
  { c: "Saat üçü on üç geçe", g: 7, n: true, tone: "night", r: cam([1, 1.06], [960, 540], undefined, () => <><rect width={1920} height={1080} fill="#0E1A2E" /><Saat x={960} y={540} s={2.2} h={3} m={13} /></>), html: q("“√144 ?”", 120, 0.4) },
  { c: "On iki", g: 7, n: true, sfx: "ding", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={SENC}>{iciNode(t, "night", "bozkir", { mouth: "flat", talk: true }, { mouth: "o" }, { move: false, glow: 1 })}</TCam><GeceModu t={t} a={a} saat="03:13" /></>, html: q("“12.”", 140, 0.05) },
  { c: "Üçü on dörtte uyuyakalıyorsun", g: 7, sfx: "boom", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.4, 2.2]} c0={SENC} shake={8}>{iciNode(t, "night", "bozkir", { eyes: "closed", mouth: "o", pose: P.back }, { mouth: "o", eyes: "wide" }, { move: false })}</TCam><GeceModu t={t} a={a} crash={1} /></>},
  { c: "Defne seni üçü yirmide", g: 7, tone: "night", r: ici("night","bozkir",{ eyes: "squint", mouth: "o" },{ pose: P.reach, mouth: "grin", talk: true },{ move: false },[1.4,1.5],[960,560]), html: q("03:20 · “1 + 1 KAÇ?”", 96, 0.4) },
  { c: "Bir artı bir... Dur", g: 7, sfx: "boing", tone: "warm", r: ici("night","bozkir",{ eyes: "squint", mouth: "open", brow: "worried", talk: true, pose: P.shrug },{ mouth: "grin", eyes: "happy" },{ move: false },[2.2,2.4],SENC), html: q("“DUR. HANGİ BİR?”", 110, 0.4) },
  { c: "Defne gülmekten yere yatıyor", g: 7, sfx: "ding", tone: "gold", r: cam([1.8, 2], [960, 840], undefined, (t) => <>{yol(t, "bozkir", "night", { stars: 1, road: false })}<g transform="rotate(-70 1060 1000)">{defk(t, 1060, 0.9, { mouth: "grin", eyes: "happy" }, 1000)}</g>{sen(t, 760, 0.9, { mouth: "o", eyes: "squint" }, 1000)}</>), html: tg("😂😂😂", T.yellow) },
  { c: "Ve sana sarılıyor", g: 7, tone: "gold", r: cam([2.4, 2.6], [930, 660], undefined, (t) => <>{yol(t, "bozkir", "night", { stars: 1, road: false })}{sen(t, 880, 0.95, { pose: P.hold, mouth: "o", eyes: "squint" }, 1000)}{defk(t, 990, 0.95, { pose: P.reach, dir: -1, mouth: "smile", eyes: "closed" }, 1000)}</>), html: tg("NEDEN? BİLMİYORSUN.", T.pink) },
  { c: "Defterine yazıyor: Güneş", g: 7, sfx: "tick", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill={kagitBg} /><Defter lines={["Güneş batınca dahi.", "03:14'ten sonra salak.", "İkisi de benim."]} k={ramp(t, a + 0.2, b - 0.3)} corner="03.14" /></TCam> },
  { c: "Sonra son cümleyi siliyor", g: 7, sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 640]}><rect width={1920} height={1080} fill={kagitBg} /><Defter lines={["Güneş batınca dahi.", "03:14'ten sonra salak."]} corner="03.14" erased="İkisi de benim." erase={ramp(t, a + 0.3, b - 0.3)} /></TCam> },
  { c: "Ama ertesi gece", g: 8, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 640]}><rect width={1920} height={1080} fill={kagitBg} /><Defter lines={["Güneş batınca dahi.", "03:14'ten sonra salak."]} corner="03.14" erased="İkisi de benim." erase={1} /></TCam><GeceModu t={t} a={a} notes={[{ x: 960, y: 700, text: "İZ: “İKİSİ DE BENİM.”" }]} /></> },
  { c: "Ve gece olan sen, hayatında", g: 8, n: true, sfx: "ding", tone: "gold", r: ici("night","bozkir",{ mouth: "smile", eyes: "squint" },{ eyes: "closed" },{ move: false, glow: 1, dog: "sleep" },[2.4,2.6],SENC), html: tg("İLK GÜLÜMSEME 🙂", T.hero) },

  // ── 8. GÜN · İSTASYON ──
  { c: "Sekizinci gün, Kayseri", g: 8, sfx: "whoosh", tone: "cool", r: harita("KAYSERİ", "KAYSERİ"), html: big("8. GÜN · KAYSERİ", "#FFFFFF", 92) },
  { c: "Bozkırın ortasında küçük", g: 8, tone: "cool", r: cam([1, 1.12], [960, 560], undefined, (t) => <Istasyon t={t} snow={1} />), html: tg("KARDAN BATTANİYE", T.blue) },
  { c: "Duvarda kocaman", g: 8, sfx: "tick", tone: "cool", r: cam([2.4, 2.8], [960, 300], undefined, (t) => <Istasyon t={t} snow={1} />), html: big("03:14", "#E0393E", 140, 760) },
  { c: "Pili biten bir saat", g: 8, tone: "cool", r: cam([1, 1.06], [960, 540], undefined, () => <><rect width={1920} height={1080} fill="#0E1A2E" /><Saat x={960} y={540} s={2.4} /></>), html: q("AMA TAM O DAKİKADA DURMUŞ.", 84, 0.5) },
  { c: "Ve saatin altında", g: 8, sfx: "ding", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 460]}><Istasyon t={t} mors={<MorsDuvar t={t} text="BEŞ" surf="istasyon" bg={false} y={430} k={ramp(t, a + 0.5, b - 0.3)} />} /></TCam> },
  { c: "Beş", g: 8, sfx: "boom", tone: "night", ...kartTxt("“BEŞ.”", undefined, "#F6C445") },
  { c: "Beş ne? diyorsun", g: 8, sfx: "boing", tone: "warm", r: cam([2.4, 2.6], [860, 560], undefined, (t) => <><Istasyon t={t} snow={1} />{sen(t, 860, 1, { pose: P.shrug, mouth: "grin", talk: true })}</>), html: q("5 DAKİKA? 5 METRE? 5 KURT?", 84, 0.2) },
  { c: "Defne cevap vermiyor", g: 8, sfx: "drone", tone: "night", r: cam([3, 3.3], [1100, 540], undefined, (t) => <><Istasyon t={t} snow={1} />{defk(t, 1100, 1, { mouth: "o", eyes: "wide", brow: "worried", lookY: -1 })}</>), html: tg("YÜZÜ BEMBEYAZ", T.red) },

  // ── 10. GÜN · MALATYA · GENÇ ──
  { c: "Onuncu gün, Malatya", g: 10, sfx: "whoosh", tone: "cool", r: harita("KAYSERİ", "MALATYA"), html: big("10. GÜN · MALATYA YOLU", "#FFFFFF", 88) },
  { c: "bir benzinlikten duman", g: 10, tone: "cool", r: cam([1, 1.12], [1200, 500], undefined, (t) => <Benzinlik t={t} smoke={1} />), html: tg("DUMAN = SOBA = İNSAN?", T.orange) },
  { c: "Ve sobanın başında", g: 10, sfx: "drone", tone: "cool", r: cam([1.4, 1.6], [1780, 760], undefined, (t) => <Benzinlik t={t} smoke={1} people={yab(t, 1780, 0.95, { dir: -1, pose: P.sit, mouth: "smile" })} />), html: big("BİR İNSAN.", "#FFFFFF", 110, 120) },
  { c: "Yüz on gündür ilk kez", g: 10, tone: "cool", r: cam([2.6, 2.8], [860, 560], undefined, (t) => <><Benzinlik t={t} smoke={1} />{sen(t, 860, 1, { mouth: "o", eyes: "wide" })}</>), html: q("110 GÜNDÜR İLK YABANCI YÜZ", 80, 0.4) },
  { c: "Yirmi yaşlarında bir genç", g: 10, tone: "cool", r: cam([2.6, 2.8], [1780, 600], undefined, (t) => <Benzinlik t={t} smoke={1} people={yab(t, 1780, 0.95, { dir: -1, pose: P.sit, mouth: "smile", eyes: "squint" })} />), html: tg("SAKİN. ÇOK SAKİN.", T.green) },
  { c: "Hoş geldiniz", g: 10, tone: "warm", r: cam([2.6, 2.8], [1780, 600], undefined, (t) => <Benzinlik t={t} smoke={1} people={yab(t, 1780, 0.95, { dir: -1, pose: P.reach, mouth: "smile", talk: true, holdR: cay(0.5) })} />), html: q("“HOŞ GELDİNİZ. ÇAY?”", 96, 0.1) },
  { c: "Defne kulağına fısıldıyor", g: 10, tone: "cool", r: cam([2.4, 2.6], [960, 560], undefined, (t) => <><Benzinlik t={t} smoke={1} />{sen(t, 900, 1, { mouth: "smile" })}{defk(t, 1010, 1, { dir: -1, mouth: "flat", brow: "angry", talk: true })}</>), html: q("“KURAL İKİ. APTALCA RİSK YOK.”", 84, 0.1) },
  { c: "Ama sen oturuyorsun", g: 10, sfx: "ding", tone: "warm", r: cam([1.4, 1.5], [1580, 760], undefined, (t) => <Benzinlik t={t} smoke={1} people={<>{yab(t, 1780, 0.95, { dir: -1, pose: P.sit, mouth: "smile" })}{sen(t, 1380, 0.95, { pose: P.sit, dir: 1, mouth: "grin", holdR: cay(0.45) })}</>} />) },
  { c: "Genç sucuk kızartıyor", g: 10, tone: "warm", r: cam([2, 2.2], [1580, 720], undefined, (t) => <Benzinlik t={t} smoke={1} people={<>{yab(t, 1780, 0.95, { dir: -1, pose: P.sit, mouth: "smile", talk: true })}{sen(t, 1380, 0.95, { pose: P.sit, dir: 1, mouth: "grin", talk: true })}</>} />), html: tg("KENDİNDEN: 0 KELİME", T.red) },
  { c: "Siz anlatıyorsunuz", g: 10, tone: "warm", r: cam([1.2, 1.3], [1580, 760], undefined, (t) => <Benzinlik t={t} smoke={1} people={<>{yab(t, 1780, 0.95, { dir: -1, pose: P.sit, mouth: "smile", eyes: "squint" })}{sen(t, 1380, 0.95, { pose: P.sit, dir: 1, mouth: "grin", talk: true })}</>} />), html: tg("RADYO. VAN. 14 GÜN.", T.orange) },
  { c: "Daha doğrusu, sen anlatıyorsun", g: 10, sfx: "boing", tone: "warm", r: cam([2.6, 2.8], [1380, 620], undefined, (t) => <Benzinlik t={t} smoke={1} people={sen(t, 1380, 0.95, { pose: P.sit, dir: 1, mouth: "grin", talk: true })} />), html: tg("RADYO · VAN · 14 GÜN · HER ŞEY", T.orange) },
  { c: "Akşama doğru genç", g: 10, tone: "cool", r: cam([2.8, 3], [1780, 580], undefined, (t) => <Benzinlik t={t} mode="dusk" smoke={1} people={yab(t, 1780, 0.95, { dir: -1, pose: P.sit, mouth: "smile", eyes: "squint", talk: true })} />), html: q("“SEN GÜNEŞ BATINCA DEĞİŞİYORSUN.”", 80, 0.3) },
  { c: "Ve her gece üçü on dörtte", g: 10, sfx: "boom", tone: "night", r: cam([3.2, 3.4], [1780, 560], undefined, (t) => <Benzinlik t={t} mode="dusk" smoke={1} people={yab(t, 1780, 0.95, { dir: -1, pose: P.sit, mouth: "smile", eyes: "squint", talk: true })} />), html: q("“…03:14'TE ÖLÜ GİBİ UYUYORSUN.”", 80, 0.1) },
  { c: "Donup kalıyorsun", g: 10, tone: "night", r: cam([3, 3.2], [1380, 600], undefined, (t) => <Benzinlik t={t} mode="dusk" smoke={1} people={sen(t, 1380, 0.95, { pose: P.sit, dir: 1, mouth: "o", eyes: "wide", sweat: true })} />), html: tg("KİMSE SÖYLEMEDİ", T.red) },
  { c: "Güneş batıyor. Kafanın içi", g: 10, n: true, sfx: "drone", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[1580, 700]}><Benzinlik t={t} mode="dusk" smoke={1} people={<>{yab(t, 1780, 0.95, { dir: -1, pose: P.sit, mouth: "smile" })}{sen(t, 1380, 0.95, { pose: P.sit, dir: 1, mouth: "flat", eyes: "squint" })}</>} /></TCam><GeceModu t={t} a={a} saat="17:02" /></> },
  { c: "Botları kuru", g: 10, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.6, 1.7]} c0={[1780, 760]}><Benzinlik t={t} mode="night" smoke={1} people={yab(t, 1780, 0.95, { dir: -1, pose: P.sit, mouth: "smile" })} /></TCam><GeceModu t={t} a={a} notes={[{ x: 1760, y: 1000, text: "BOT: KURU ✖ 3 GÜN KAR?", dx: -320, dy: -120 }]} /></> },
  { c: "Elleri tertemiz", g: 10, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.6, 1.7]} c0={[1780, 700]}><Benzinlik t={t} mode="night" smoke={1} people={yab(t, 1780, 0.95, { dir: -1, pose: P.sit, mouth: "smile" })} /></TCam><GeceModu t={t} a={a} notes={[{ x: 1760, y: 1000, text: "BOT: KURU", dx: -320, dy: -120 }, { x: 1720, y: 820, text: "ELLER: TEMİZ ✖ ODUN?", dx: -360, dy: -200 }]} /></> },
  { c: "Ve en önemlisi", g: 10, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[1780, 560]}><Benzinlik t={t} mode="night" smoke={1} people={yab(t, 1780, 0.95, { dir: -1, pose: P.sit, mouth: "smile", eyes: "squint" })} /></TCam><GeceModu t={t} a={a} notes={[{ x: 1780, y: 560, text: "ADINIZI: HİÇ SORMADI", dx: -360, dy: -120 }]} /></> },
  { c: "İnsan, zaten bildiği", g: 10, n: true, sfx: "boom", tone: "night", ...kartTxt("İNSAN, ZATEN BİLDİĞİ", "BİR ŞEYİ SORMAZ.") },
  { c: "Gece yarısı, herkes uyurken", g: 10, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[900, 760]}><Benzinlik t={t} mode="night" smoke={0.3} /><Araba x={760} y={980} s={0.85} t={t} id="m" hood={ramp(t, a + 1, a + 2)} />{sen(t, 1080, 0.95, { pose: P.reach, mouth: "flat", eyes: "squint" })}</TCam><GeceModu t={t} a={a} k={0.7} saat="00:40" /></> },
  { c: "Ne yaptığını, sabah", g: 10, n: true, tone: "night", ...kartTxt("NE YAPTIĞINI…", "SABAH ANLAYACAKSIN.") },

  // ── 11. GÜN · HIRSIZLIK ──
  { c: "Sabah bir sesle uyanıyorsun", g: 11, sfx: "knock", tone: "cool", r: cam([1, 1.06], [960, 540], undefined, () => <rect width={1920} height={1080} fill="#0E1A2E" />), html: big("TIK. TIK. TIK.", "#FFFFFF", 120, 420) },
  { c: "Genç sizin arabanızda", g: 11, tone: "cool", r: cam([1.4, 1.6], [960, 760], undefined, (t) => <><Benzinlik t={t} mode="day" smoke={0} />{araba(t, { x: 960, y: 980, id: "h", sen: false, def: false, dog: false, yabFront: { mouth: "flat", brow: "angry" } })}</>), html: tg("BİDONLAR · İLAÇLAR · ANAHTAR", T.red) },
  { c: "Tık", g: 11, sfx: "knock", tone: "cool", r: cam([3, 3.2], [1045, 800], undefined, (t) => <><Benzinlik t={t} mode="day" smoke={0} />{araba(t, { x: 960, y: 980, id: "h", sen: false, def: false, dog: false, yabFront: { mouth: "o", eyes: "wide" } })}</>) },
  { c: "Araba çalışmıyor", g: 11, sfx: "boing", tone: "warm", ...kartTxt("ARABA ÇALIŞMIYOR.", undefined, "#F6C445") },
  { c: "Camı açıyor", g: 11, tone: "cool", r: cam([2.8, 3], [1045, 780], undefined, (t) => <><Benzinlik t={t} mode="day" smoke={0} />{araba(t, { x: 960, y: 980, id: "h", sen: false, def: false, dog: false, yabFront: { mouth: "open", brow: "angry", talk: true } })}</>), html: q("“NE YAPTIN?”", 110, 0.3) },
  { c: "Defne'nin radyosunu gösteriyorsun", g: 11, sfx: "ding", tone: "warm", r: cam([1.6, 1.8], [1300, 860], undefined, (t) => <><Benzinlik t={t} mode="day" smoke={0} /><Radyo x={1400} y={1000} s={0.7} t={t} on={1} />{sen(t, 1150, 1, { pose: P.point, mouth: "grin", eyes: "squint" })}</>), html: tg("RADYO + ARABANIN AKÜSÜ 🔋", T.green) },
  { c: "Her akşam saat dokuzda", g: 11, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[1000, 800]}><Benzinlik t={t} mode="night" smoke={0.3} /><Araba x={760} y={980} s={0.85} t={t} id="h2" hood={1} battery={false} /><Radyo x={1300} y={1000} s={0.6} t={t} on={1} />{sen(t, 1080, 0.95, { pose: P.hold, mouth: "flat", eyes: "squint" })}</TCam><GeceModu t={t} a={a} saat="00:40" notes={[{ x: 760, y: 860, text: "AKÜ → RADYO" }]} /></> },
  { c: "Dün gece, gece olan sen", g: 11, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[760, 860]}><Benzinlik t={t} mode="night" smoke={0.3} /><Araba x={760} y={980} s={0.85} t={t} id="h3" hood={1} battery={false} /></TCam><GeceModu t={t} a={a} notes={[{ x: 700, y: 860, text: "AKÜ: SÖKÜLDÜ ✓" }]} /></>, html: tg("AKÜ İÇERİDE 🔋", T.green) },
  { c: "Genç, senin ne zaman uyuduğunu", g: 11, tone: "cool", ...kartTxt("NE ZAMAN UYUDUĞUNU BİLİYORDU.", "UYUMADAN ÖNCE NE YAPTIĞINI BİLMİYORDU.", "#FFFFFF", "#2EE6D0") },
  { c: "Bir süre sana bakıyor", g: 11, sfx: "ding", tone: "warm", r: cam([2.6, 2.8], [1300, 560], undefined, (t) => <><Benzinlik t={t} mode="day" smoke={0} />{yab(t, 1300, 1, { mouth: "grin", eyes: "happy" })}</>), html: tg("GERÇEKTEN GÜLÜYOR", T.green) },
  { c: "Arabadan iniyor", g: 11, tone: "warm", r: cam([1.8, 2], [960, 820], undefined, (t) => <><Benzinlik t={t} mode="day" smoke={0} />{araba(t, { x: 960, y: 980, id: "h", sen: false, def: false, dog: false })}<Kayisi x={1140} y={850} s={0.9} /></>), html: tg("MALATYA KAYISISI 🍑", T.orange) },
  { c: "Özür gibi. Ya da tebrik", g: 11, tone: "warm", r: cam([3, 3.2], [1140, 850], undefined, (t) => <><Benzinlik t={t} mode="day" smoke={0} />{araba(t, { x: 960, y: 980, id: "h", sen: false, def: false, dog: false })}<Kayisi x={1140} y={850} s={0.9} /></>), html: q("ÖZÜR GİBİ. YA DA TEBRİK GİBİ.", 80, 0.2) },
  { c: "Arkasından bağırıyorsun", g: 11, tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}>{yol(t, "bozkir", "day", { snow: 1, road: true })}{walk(t, a, b + 2, YABANCI, 1200, 1800, 0.8)}{sen(t, 500, 1, { pose: P.wave, mouth: "open", talk: true })}</TCam>, html: q("“ADIN NE SENİN?”", 96, 0.2) },
  { c: "Dönmüyor. Sadece elini", g: 11, sfx: "drone", tone: "cool", r: cam([2.2, 2.4], [1500, 600], undefined, (t) => <>{yol(t, "bozkir", "day", { snow: 1 })}{yab(t, 1500, 0.8, { pose: P.wave, dir: 1, mouth: "smile" })}</>), html: q("“VAN'DA GÖRÜŞÜRÜZ.”", 100, 0.3) },
  { c: "Defne sana bakıyor. Ve ilk kez", g: 11, sfx: "ding", tone: "gold", r: cam([2.4, 2.6], [1060, 560], undefined, (t) => <>{yol(t, "bozkir", "day", { snow: 1, road: false })}{defk(t, 1060, 1, { dir: -1, mouth: "smile", eyes: "squint", talk: true })}</>), html: q("“AFERİN.”", 130, 0.5) },
  { c: "Ne yaptım ki", g: 11, sfx: "boing", tone: "warm", r: cam([2.6, 2.8], [860, 560], undefined, (t) => <>{yol(t, "bozkir", "day", { snow: 1, road: false })}{sen(t, 860, 1, { pose: P.shrug, mouth: "grin", eyes: "happy", talk: true })}</>), html: q("“NE YAPTIM Kİ?”", 110, 0.1) },
  { c: "Eğer o gencin kim olduğunu", g: 11, hud: false, tone: "warm", r: cam([1, 1.1], [1500, 600], undefined, (t) => <>{yol(t, "bozkir", "dusk", { snow: 1, sun: 1 })}{yab(t, 1500, 0.6, { dir: 1, mouth: "smile" })}</>), html: (t, a) => <><Txt t={t} at={a + 0.3} text="O GENÇ KİM? YORUMLARA YAZ ↓" y={200} size={80} color="#FFFFFF" /><Abone t={t} at={a + 2} /></> },

  // ── 12. GÜN · MUŞ ──
  { c: "On ikinci gün, Muş", g: 12, sfx: "whoosh", tone: "cool", r: harita("MALATYA", "MUŞ"), html: big("12. GÜN · MUŞ OVASI", "#FFFFFF", 92) },
  { c: "Bembeyaz ve dümdüz", g: 12, tone: "cool", r: cam([1, 1.15], [960, 540], undefined, surus("ova", "day", { s: 0.5, x: 960, y: 1000 }, { snow: 1 })), html: tg("TEK BİR AĞAÇ BİLE YOK", T.blue) },
  { c: "O akşam saat dokuzda", g: 12, sfx: "static", tone: "night", r: cam([1.2, 1.3], [960, 760], undefined, (t) => <>{yol(t, "ova", "night", { snow: 1, stars: 1, road: false })}{araba(t, { x: 700, lights: 0.3 })}<Radyo x={1300} y={1000} s={0.6} t={t} on={1} voice={1} /></>), html: tg("21:00", T.yellow) },
  { c: "Uzaktan. Mikrofona değil", g: 12, sfx: "static", tone: "night", r: cam([1.6, 1.8], [900, 700], undefined, (t) => <><rect width={1920} height={1080} fill="#141C28" /><Radyo x={900} y={800} s={1.5} t={t} on={1} voice={0.5} /></>), html: tg("ODADAKİ BİRİNE KONUŞUYOR", T.yellow) },
  { c: "Geliyorlar mı", g: 12, sfx: "static", tone: "night", r: cam([1.4, 1.6], [900, 700], undefined, (t) => <><rect width={1920} height={1080} fill="#141C28" /><Radyo x={900} y={800} s={1.5} t={t} on={1} voice={1} /></>), html: q("(UZAKTAN) “GELİYORLAR MI?”", 86, 0.05) },
  { c: "Ve ilk ses cevap veriyor", g: 12, sfx: "static", tone: "night", r: cam([2, 2.3], [900, 700], undefined, (t) => <><rect width={1920} height={1080} fill="#141C28" /><Radyo x={900} y={800} s={1.5} t={t} on={1} voice={1} /></>), html: q("“GELİYORLAR. İKİSİ DE.”", 100, 0.2) },
  { c: "Sonra cızırtı", g: 12, sfx: "static", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.3, 2.4]} c0={[900, 700]} shake={3}><rect width={1920} height={1080} fill="#141C28" /><Radyo x={900} y={800} s={1.5} t={t} on={1} />{Array.from({ length: 40 }).map((_, i) => <rect key={i} x={0} y={(i * 97 + Math.floor(t * 30) * 53) % 1080} width={1920} height={3} fill="#FFFFFF" opacity={0.08} />)}</TCam> },
  { c: "Defne radyoyu kapatıyor", g: 12, tone: "night", r: cam([2.4, 2.6], [960, 640], undefined, (t) => <>{yol(t, "ova", "night", { snow: 1, stars: 1, road: false })}{sen(t, 860, 1, { pose: P.sit, mouth: "flat", brow: "worried" }, 1000)}{defk(t, 1080, 1, { pose: P.sit, dir: -1, mouth: "flat", brow: "worried" }, 1000)}</>) },
  { c: "Van'daki insanlar sadece", g: 12, sfx: "boom", tone: "night", ...kartTxt("SİZİ BEKLİYORLAR.", "VE KAÇ KİŞİ OLDUĞUNUZU BİLİYORLAR.", "#FFFFFF", "#E0393E") },

  // ── 13. GÜN · BİTLİS ──
  { c: "On üçüncü gün. Bitlis", g: 13, sfx: "whoosh", tone: "cool", r: harita("MUŞ", "BİTLİS"), html: big("13. GÜN · BİTLİS", "#FFFFFF", 92) },
  { c: "Türkiye'nin en çok kar", g: 13, tone: "cool", r: cam([1, 1.12], [960, 540], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 1, move: true })}{araba(t, { move: true, snow: 0.6, lights: 1 })}</>, 4), html: q("KAR YAĞMIYOR. KAR SALDIRIYOR.", 84, 0.4) },
  { c: "Silecekler donuyor", g: 13, sfx: "buzz", tone: "cool", r: ici("storm","tipi",{ mouth: "frown", brow: "worried", sweat: true },{ mouth: "frown", brow: "worried", sweat: true },{ snow: 1 },[1.3,1.4],[960,560]), html: tg("SİLECEK ❄ · YOL ✖", T.blue) },
  { c: "Ve güneş batarken, farların", g: 13, tone: "night", r: cam([1, 1.12], [960, 540], undefined, (t) => <MorsDuvar t={t} text="DEFNE'Yİ BIRAK" surf="agil" k={0} snow={0.8} night={0.4} />) },
  { c: "Noktalar. Ve çizgiler", g: 13, sfx: "tick", tone: "night", r: cam([1.8, 2], [960, 470], undefined, (t) => <MorsDuvar t={t} text="DEFNE'Yİ BIRAK" surf="agil" k={0} snow={0.8} night={0.4} />) },
  { c: "Defne'yi... bırak", g: 13, sfx: "boom", tone: "night", r: mors("DEFNE'Yİ BIRAK", "agil", { snow: 0.8, night: 0.4 }), html: q("“DEFNE'Yİ… BIRAK.”", 110, 0.6) },
  { c: "Rüzgârdan başka ses yok", g: 13, sfx: "drone", tone: "night", r: cam([1, 1.08], [960, 560], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 1, road: false })}{sen(t, 820, 0.9, { mouth: "flat", eyes: "wide" })}{defk(t, 1100, 0.9, { dir: -1, mouth: "flat", eyes: "wide" })}</>) },
  { c: "Ve bir şey daha var", g: 13, tone: "night", r: cam([2.6, 3], [960, 470], undefined, (t) => <MorsDuvar t={t} text="DEFNE'Yİ BIRAK" surf="agil" k={1} snow={0.8} night={0.4} />), html: q("DUVAR, ONUN ADINI BİLİYOR.", 90, 0.4) },
  { c: "On üç gündür bu duvarlar ne", g: 13, tone: "night", r: (t, a, b) => { const i = Math.min(2, Math.floor(((t - a) / Math.max(0.5, b - a)) * 3)); return <TCam t={t} a={a} b={b} z={[1, 1.06]}><MorsDuvar t={t} text={["15 DK BEKLE", "SAĞA 3 METRE", "BEŞ"][i]} surf={(["kaya", "ahir", "istasyon"] as const)[i]} k={1} snow={0.6} /></TCam>; }, html: tg("✓ ✓ ✓ HER SEFERİNDE HAKLI", T.green) },
  { c: "Defne arabanın kapısına", g: 13, tone: "night", r: cam([2.4, 2.6], [1100, 600], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 0.7, road: false })}{araba(t, { x: 1500, sen: false, def: false, snow: 0.6 })}{defk(t, 1120, 1, { dir: -1, mouth: "flat", brow: "worried", talk: true })}</>), html: q("“BIRAKACAK MISIN?”", 100, 0.3) },
  { c: "Ne? Hayır. Saçmalama", g: 13, tone: "night", r: cam([2.4, 2.6], [820, 600], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 0.7, road: false })}{sen(t, 820, 1, { pose: P.shrug, mouth: "open", brow: "angry", talk: true })}</>), html: q("“NE? HAYIR. SAÇMALAMA.”", 96, 0.1) },
  { c: "Ama duvarlar hiç yanılmadı", g: 13, tone: "night", r: cam([2.6, 2.8], [1120, 560], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 0.7, road: false })}{defk(t, 1120, 1, { dir: -1, mouth: "frown", brow: "worried", talk: true })}</>), html: q("“AMA DUVARLAR HİÇ YANILMADI.”", 90, 0.1) },
  { c: "O zaman bu sefer yanılsınlar", g: 13, sfx: "ding", tone: "night", r: cam([2.6, 2.8], [820, 560], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 0.7, road: false })}{sen(t, 820, 1, { pose: P.point, mouth: "flat", brow: "angry", talk: true })}</>), html: q("“O ZAMAN BU SEFER YANILSINLAR.”", 88, 0.1) },
  { c: "Defne sana bakıyor. Gözleri", g: 13, sfx: "drone", tone: "night", r: cam([3.2, 3.5], [1120, 540], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 0.7, road: false })}{defk(t, 1120, 1, { dir: -1, mouth: "frown", eyes: "wide", brow: "worried", sweat: true })}</>), html: q("BAŞKAN DEĞİL. SADECE KORKMUŞ BİR KIZ.", 72, 0.5) },
  { c: "Beni bırakma, diyor", g: 13, tone: "night", r: cam([3, 3.2], [1120, 540], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 0.7, road: false })}{defk(t, 1120, 1, { dir: -1, mouth: "frown", eyes: "closed", brow: "worried", talk: true })}</>), html: q("“BENİ BIRAKMA. NE GECE OLAN, NE GÜNDÜZ OLAN.”", 70, 0.1) },
  { c: "Tam o an güneş batıyor", g: 13, n: true, sfx: "drone", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.8, 3]} c0={[820, 560]}>{yol(t, "tipi", "storm", { snow: 1, fall: 0.7, road: false })}{sen(t, 820, 1, { mouth: "flat", eyes: "squint" })}</TCam><GeceModu t={t} a={a} saat="16:41" /></> },
  { c: "Ve gece olan sen, duvara", g: 13, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 470]}><MorsDuvar t={t} text="DEFNE'Yİ BIRAK" surf="agil" k={1} snow={0.8} night={0.5} /></TCam><GeceModu t={t} a={a} notes={[{ x: 960, y: 560, text: "NE KADAR SÜRE? ?" }, { x: 1200, y: 420, text: "NE KADAR UZAĞA? ?", dx: 120, dy: -200 }]} /></> },
  { c: "Bir gece, diyorsun", g: 13, n: true, sfx: "ding", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[820, 560]}>{yol(t, "tipi", "storm", { snow: 1, fall: 0.7, road: false })}{sen(t, 820, 1, { pose: P.point, mouth: "flat", talk: true })}</TCam><GeceModu t={t} a={a} k={0.5} /></>, html: q("“BİR GECE. SADECE 50 METRE.”", 92, 0.1) },
  { c: "Elli metre ötede", g: 13, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1, 1.06]}>{yol(t, "tipi", "night", { snow: 1, fall: 0.6, road: false })}<Kulube x={1500} y={900} s={0.8} t={t} lit={1} light={0} />{araba(t, { x: 500, sen: false, def: false, snow: 0.6, lights: 0.5 })}<path d="M700,1000 L1380,1000" stroke="#2EE6D0" strokeWidth={4} strokeDasharray="16 12" /><text x={1040} y={980} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={48} fill="#2EE6D0">50 M</text></TCam><GeceModu t={t} a={a} k={0.5} /></>, html: tg("KULÜBE: DEFNE + KARABAŞ · ARABA: SEN", T.hero) },
  { c: "Sen arabada kalacaksın", g: 13, n: true, tone: "night", r: cam([2, 2.2], [600, 800], undefined, (t) => <>{yol(t, "tipi", "night", { snow: 1, fall: 0.6, road: false })}{araba(t, { x: 600, def: false, dog: false, snow: 0.6, lights: 0.5, smoke: 0.4, sen: { mouth: "flat" } })}</>), html: tg("MOTOR ✓ · ISITICI ✓ · BİDON + AKÜ NÖBETİ", T.orange) },
  { c: "Çünkü bu yolda bir genç var", g: 13, n: true, tone: "night", r: cam([1, 1.1], [1500, 600], undefined, (t) => <>{yol(t, "bozkir", "dusk", { snow: 1, sun: 0.6 })}{yab(t, 1500, 0.6, { dir: 1, mouth: "smile" })}</>), html: q("VE O GENÇ BİR KERE DENEDİ.", 80, 0.4) },
  { c: "Ve aranızda, Kız Kulesi'ndeki", g: 13, n: true, sfx: "tick", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{yol(t, "tipi", "night", { snow: 1, fall: 0.5, road: false })}<Kulube x={1500} y={900} s={0.8} t={t} lit={1} light={morsOn(t, a + 0.4, "·-· ·-· ·-·".replace(/·/g, "."))} />{araba(t, { x: 500, sen: false, def: false, snow: 0.6 })}<IsikMors t={t} a={a + 0.4} code=".-. .-." x={560} y={800} /></TCam>, html: tg("KISA · UZUN · KISA", T.yellow) },
  { c: "Defne kabul ediyor", g: 13, n: true, tone: "night", r: cam([2.6, 2.8], [1100, 560], undefined, (t) => <>{yol(t, "tipi", "night", { snow: 1, fall: 0.6, road: false })}{defk(t, 1100, 1, { dir: -1, mouth: "flat", eyes: "squint", brow: "worried" })}</>), html: tg("İSTEMEYEREK.", T.pink) },
  { c: "Gece boyunca konuşuyorsunuz", g: 13, n: true, sfx: "tick", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]}>{yol(t, "tipi", "night", { snow: 1, fall: 0.8, road: false })}<Kulube x={1500} y={900} s={0.8} t={t} lit={1} light={morsOn(t, a, "..- -.-- ..- -.. ..- -- ..-")} />{araba(t, { x: 500, sen: false, def: false, snow: 0.6 })}<IsikMors t={t} a={a + 2.5} code="..... -- -.--" x={560} y={800} /></TCam> },
  { c: "Uyudun mu", g: 13, n: true, tone: "night", r: cam([2.4, 2.6], [1500, 800], undefined, (t) => <>{yol(t, "tipi", "night", { snow: 1, fall: 0.8, road: false })}<Kulube x={1500} y={900} s={0.8} t={t} lit={1} light={(Math.sin(t * 12) + 1) / 2} /></>), html: q("“UYUDUN MU?”", 96, 0.05) },
  { c: "Hayır. Sen", g: 13, n: true, tone: "night", r: cam([2.6, 2.8], [560, 800], undefined, (t) => <>{yol(t, "tipi", "night", { snow: 1, fall: 0.8, road: false })}{araba(t, { x: 500, def: false, dog: false, snow: 0.6, sen: { mouth: "smile" } })}</>), html: q("“HAYIR. SEN?”", 96, 0.05) },
  { c: "Gece olan ben uyumaz", g: 13, n: true, tone: "night", r: cam([3, 3.2], [400, 800], undefined, (t) => <>{yol(t, "tipi", "night", { snow: 1, fall: 0.8, road: false })}{araba(t, { x: 500, def: false, dog: false, snow: 0.6, sen: { mouth: "smile", eyes: "squint" } })}</>), html: q("“GECE OLAN BEN UYUMAZ.”", 92, 0.05) },
  { c: "Gece olan sen çok sıkıcısın", g: 13, n: true, sfx: "boing", tone: "night", r: cam([2.4, 2.6], [1500, 800], undefined, (t) => <>{yol(t, "tipi", "night", { snow: 1, fall: 0.8, road: false })}<Kulube x={1500} y={900} s={0.8} t={t} lit={1} light={(Math.sin(t * 14) + 1) / 2} /></>), html: q("“GECE OLAN SEN ÇOK SIKICISIN.”", 88, 0.05) },
  { c: "Biliyorum", g: 13, n: true, tone: "night", r: cam([3, 3.2], [400, 800], undefined, (t) => <>{yol(t, "tipi", "night", { snow: 1, fall: 0.8, road: false })}{araba(t, { x: 500, def: false, dog: false, snow: 0.6, sen: { mouth: "smile", eyes: "squint" } })}</>), html: q("“BİLİYORUM.” 🙂", 100, 0.05) },
  { c: "Saat üçe doğru", g: 13, n: true, sfx: "drone", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[3, 3.4]} c0={[400, 800]} shake={3}>{yol(t, "tipi", "night", { snow: 1, fall: 0.8, road: false })}{araba(t, { x: 500, def: false, dog: false, snow: 0.9, buried: 0.4, sen: { mouth: "frown", eyes: "squint", brow: "worried" } })}</TCam><GeceModu t={t} a={a} k={0.6} saat="02:58" /></>, html: tg("DAHA ERKEN · DAHA AĞIR", T.red) },
  { c: "Yazmaya başlıyorsun", g: 13, n: true, sfx: "tick", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><rect width={1920} height={1080} fill="#0A0F18" /><IsikMors t={t} a={a + 0.2} code="..- -.-- ..- -.- ..- -- --. . .-.. -.. .." x={960} y={500} stop={b - 0.6} /></TCam>, html: q("“UYKUM GELDİ. YARIN…”", 92, 0.15) },
  { c: "Ve ışık, kelimenin ortasında", g: 13, n: true, sfx: "boom", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1, 1.02]}><rect width={1920} height={1080} fill="#05080E" /></TCam><GeceModu t={t} a={a} crash={1} /></> },
  { c: "Kulübede Defne saatine", g: 13, tone: "night", r: cam([1, 1.06], [960, 540], undefined, () => <><rect width={1920} height={1080} fill="#2A1E16" /><Saat x={960} y={540} s={2.2} h={3} m={14} c="#F4EAD6" /></>), html: q("03:14", 120, 0.3, 900) },
  { c: "Her gece bu dakikada uyanıyor", g: 13, tone: "night", r: cam([1.6, 1.8], [1380, 260], undefined, () => <><rect width={1920} height={1080} fill={kagitBg} /><Defter lines={["1. gece:", "Güneş batınca başladı.", "03:14'te bitti."]} corner="BEN DE 03:14'TE UYANIYORUM." /></>), html: tg("KÖŞEDEKİ SIR", T.red) },
  { c: "Sana hiç söylemedi", g: 13, tone: "night", r: cam([2.4, 2.6], [1500, 600], undefined, (t) => <><rect width={1920} height={1080} fill="#2A1E16" />{defk(t, 1000, 1.1, { pose: P.sit, mouth: "flat", eyes: "open", brow: "worried" }, 1060)}<Saat x={1500} y={400} s={1} h={3} m={14} c="#F4EAD6" /></>), html: q("ZATEN YETERİNCE TUHAFTIN.", 80, 0.4) },
  { c: "Işığın yarım kalan kelimeyi", g: 13, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[600, 800]}>{yol(t, "tipi", "night", { snow: 1, fall: 0.8, road: false })}{araba(t, { x: 500, def: false, dog: false, snow: 1, buried: 0.7 })}</TCam>, html: (t, a) => <Txt t={t} at={a + 0.2} text={`BİR DAKİKA… ${t > a + 2 ? "İKİ DAKİKA…" : ""}`} y={200} size={84} color="#FFFFFF" /> },
  { c: "Karabaş kapıyı tırmalıyor", g: 13, sfx: "pop", tone: "night", r: cam([2.4, 2.6], [1500, 860], undefined, (t) => <>{yol(t, "tipi", "night", { snow: 1, fall: 0.8, road: false })}<Kulube x={1500} y={900} s={0.8} t={t} lit={1} /><Kopek x={1480} y={1000} s={0.5} t={t} kind="kara" bark={1} /></>), html: tg("AUUUUU 🐺", T.purple) },
  { c: "Ve Defne, fırtınanın içine", g: 13, sfx: "whoosh", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} shake={5}>{yol(t, "tipi", "storm", { snow: 1, fall: 1, road: false })}<Kulube x={1600} y={900} s={0.8} t={t} lit={1} />{run(t, a, b, DEFNE_K, 1400, 700, 1, { mouth: "open", brow: "worried", sweat: true })}<Kopek x={lerp(1500, 820, ramp(t, a, b))} y={1040} s={0.55} t={t} kind="kara" run={1} dir={-1} /></TCam> },
  { c: "Arabaya vardığında ilk", g: 13, sfx: "buzz", tone: "night", r: cam([2.4, 2.8], [600, 980], undefined, (t) => <>{yol(t, "tipi", "night", { snow: 1, fall: 0.8, road: false })}{araba(t, { x: 900, def: false, dog: false, snow: 1, buried: 1 })}</>), html: tg("EGZOZ: KARIN ALTINDA", T.red) },
  { c: "Motor çalışıyor", g: 13, sfx: "drone", tone: "night", r: cam([1.6, 1.8], [900, 800], undefined, (t) => <>{yol(t, "tipi", "night", { snow: 1, fall: 0.8, road: false })}{araba(t, { x: 900, def: false, dog: false, snow: 1, buried: 1, co: 1, sen: { eyes: "closed", mouth: "o" } })}</>), html: q("DUMANIN GİDECEK YERİ YOK.", 84, 0.4) },
  { c: "Karbonmonoksit", g: 13, sfx: "boom", tone: "night", ...kartTxt("KARBONMONOKSİT", "RENK: YOK · KOKU: YOK", "#E0393E", "#FFFFFF") },
  { c: "Önce baş ağrısı yapar", g: 13, tone: "night", ...kartTxt("BAŞ AĞRISI → UYKU →", "UYANMAMAK.", "#FFFFFF", "#E0393E") },
  { c: "Türkiye'de her kış", g: 13, tone: "night", r: cam([1, 1.1], [900, 800], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 1, road: false })}{araba(t, { x: 900, sen: false, def: false, dog: false, snow: 1, buried: 1, co: 0.6 })}</>), html: tg("GERÇEK: HER KIŞ OLUYOR", T.blue) },
  { c: "Defne kapıyı açıyor", g: 13, sfx: "whoosh", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.7]} c0={[960, 900]} shake={4}>{yol(t, "tipi", "storm", { snow: 1, fall: 1, road: false })}{araba(t, { x: 700, sen: false, def: false, dog: false, snow: 1, buried: 1, co: 0.4 })}{yat(t, lerp(900, 1150, ramp(t, a, a + 1.2)), 1010, 0.85)}{defk(t, lerp(1050, 1300, ramp(t, a, a + 1.2)), 0.95, { pose: P.reach, dir: -1, mouth: "open", brow: "worried", sweat: true })}<Kopek x={1250} y={1040} s={0.5} t={t} kind="kara" wag={1} /></TCam>, html: q("ADINI BAĞIRIYOR.", 84, 0.5) },
  { c: "Gözünü açıyorsun. Gökyüzü", g: 13, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 540]}><g transform={`rotate(${Math.sin(t * 1.4) * 8} 960 540)`}><Gok t={t} mode="night" stars={0.3} /><circle cx={960} cy={540} r={260} fill="#141C28" opacity={0.3} />{defk(t, 960, 1.6, { mouth: "frown", eyes: "closed", brow: "worried", sweat: true }, 1300)}</g></TCam>, html: tg("AĞLIYOR", T.pink) },
  { c: "Bu ikinci, diyorsun", g: 13, tone: "night", r: cam([1.6, 1.7], [1000, 800], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 0.8, road: false })}<ellipse cx={1180} cy={1010} rx={190} ry={60} fill="#F4F8FF" />{yat(t, 900, 1010, 0.9, { eyes: "squint", mouth: "smile", talk: true })}{defk(t, 1180, 0.95, { pose: P.sit, dir: -1, mouth: "frown", eyes: "closed", brow: "worried" })}</>), html: q("“BU İKİNCİ. BENİ İKİNCİ TAŞIYIŞIN.”", 80, 0.1) },
  { c: "Ve sonra ikiniz de aynı anda", g: 13, sfx: "drone", tone: "night", r: cam([1, 1.08], [700, 800], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 0.8, road: false })}{araba(t, { x: 700, snow: 1, buried: 1, co: 1, sen: { eyes: "closed" }, def: { eyes: "closed" }, dog: false })}</>), html: tg("İKİNİZ DE ARABADA OLSAYDINIZ…", T.red) },
  { c: "Duvar Defne'yi bırak dememişti", g: 13, sfx: "whoosh", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]}><MorsDuvar t={t} text="DEFNE'Yİ BIRAK" surf="agil" k={1} snow={0.8} night={0.5} /></TCam> },
  { c: "Onu yanından ayır ki", g: 13, sfx: "boom", tone: "gold", ...kartTxt("“ONU YANINDAN AYIR Kİ,", "SENİ KURTARABİLSİN.”", "#FFFFFF", "#F6C445") },
  { c: "Defne başını göğsüne", g: 13, sfx: "ding", tone: "gold", r: cam([1.3, 1.4], [940, 760], undefined, (t) => <>{yol(t, "tipi", "storm", { snow: 1, fall: 0.6, road: false })}<ellipse cx={1060} cy={1010} rx={190} ry={60} fill="#F4F8FF" />{yat(t, 900, 1010, 0.9, { eyes: "closed", mouth: "smile" })}{defk(t, 1060, 0.95, { pose: P.sit, dir: -1, mouth: "smile", eyes: "closed" })}<Kopek x={1260} y={1040} s={0.5} t={t} kind="kara" sleep={1} /></>), html: q("“GECE OLAN SEN… O KADAR DA SIKICI DEĞİLMİŞSİN.”", 66, 0.4) },

  // ── 14. GÜN · VAN ──
  { c: "On dördüncü gün", g: 14, sfx: "whoosh", tone: "cool", r: harita("BİTLİS", "VAN"), html: big("14. GÜN · SON GÜN", "#FFFFFF", 96) },
  { c: "Radyodaki ses artık", g: 14, sfx: "static", tone: "cool", r: cam([1.4, 1.6], [900, 700], undefined, (t) => <><rect width={1920} height={1080} fill="#1E2A3A" /><Radyo x={900} y={800} s={1.5} t={t} on={0.4} voice={0.3} /></>), html: q("“BURASI VAN… DUYAN… VAR…”", 84, 0.2) },
  { c: "Van Gölü'nün kıyısından", g: 14, tone: "cool", r: cam([1, 1.12], [960, 560], undefined, surus("gol", "day", {}, { snow: 1 })), html: tg("GÖL DONMAMIŞ", T.blue) },
  { c: "Van Gölü'nün suyu sodalı", g: 14, tone: "cool", r: cam([1.2, 1.3], [960, 600], undefined, (t) => <>{yol(t, "gol", "day", { snow: 1, road: false })}</>), html: tg("BİLİM: SODALI SU ZOR DONAR", T.blue) },
  { c: "Karabaş suyu tadıyor", g: 14, sfx: "boing", tone: "warm", r: cam([2.4, 2.6], [700, 900], undefined, (t) => <>{yol(t, "gol", "day", { snow: 1, road: false })}<Kopek x={700} y={1000} s={0.7} t={t} kind="kara" /></>), html: tg("🐶😖 BLEH", T.orange) },
  { c: "Gece Van'a giriyorsunuz", g: 14, sfx: "drone", tone: "night", r: cam([1, 1.1], [960, 560], undefined, (t) => <VanGece t={t} bulb={0} gen={0} />), html: big("1.000.000 EV · HEPSİ KARANLIK", "#FFFFFF", 76) },
  { c: "Biri hariç", g: 14, sfx: "ding", tone: "night", r: cam([1, 1.4], [960, 540], [960, 380], (t) => <VanGece t={t} bulb={1} gen={1} />), html: q("BİRİ HARİÇ.", 110, 0.3) },
  { c: "Şehrin ortasında", g: 14, sfx: "buzz", tone: "night", r: cam([1.8, 2.2], [960, 400], undefined, (t) => <VanGece t={t} bulb={0.6 + Math.sin(t * 9) * 0.3} gen={1} />), html: tg("JENERATÖR: SON NEFES", T.red) },
  { c: "Ve bir jeneratör sesi", g: 14, sfx: "buzz", tone: "night", r: cam([2.6, 3], [960, 380], undefined, (t) => <VanGece t={t} bulb={0.5 + Math.sin(t * 13) * 0.4} gen={1} />), html: q("ÖKSÜRÜR GİBİ. SON NEFESİNİ VERİR GİBİ.", 76, 0.3) },
  { c: "Merdivenleri koşarak", g: 14, sfx: "whoosh", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]} shake={4}><rect width={1920} height={1080} fill="#141C28" />{Array.from({ length: 8 }).map((_, i) => <rect key={i} x={200 + i * 180} y={1000 - i * 90} width={200} height={1080} fill="#2A3444" />)}{run(t, a, b, SEN, 300, 1400, 0.8, { mouth: "open" }, 980)}{run(t, a + 0.3, b, DEFNE_K, 200, 1250, 0.8, { mouth: "open" }, 980)}</TCam> },
  { c: "Kapının önünde bir kedi", g: 14, tone: "night", r: cam([2.4, 2.6], [500, 860], undefined, (t) => <><rect width={1920} height={1080} fill="#1A2230" /><rect x={760} y={260} width={420} height={780} fill="#3A2A20" /><VanKedisi x={500} y={1000} s={1} t={t} look={1} /></>), html: tg("BİR GÖZÜ MAVİ · BİR GÖZÜ SARI", T.yellow) },
  { c: "Size bakıyor. Ve kenara", g: 14, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[800, 700]}><rect width={1920} height={1080} fill="#1A2230" /><rect x={760} y={260} width={420} height={780} fill="#3A2A20" /><VanKedisi x={lerp(900, 420, ramp(t, a + 0.8, a + 1.8))} y={1000} s={1} t={t} look={-1} /></TCam> },
  { c: "Kapıyı itiyorsunuz", g: 14, sfx: "knock", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.5]} c0={[960, 600]}><rect width={1920} height={1080} fill="#1A2230" /><rect x={760} y={260} width={420} height={780} fill="#F6C445" opacity={0.6} /><rect x={760} y={260} width={420 * (1 - ramp(t, a, b))} height={780} fill="#3A2A20" /></TCam> },
  { c: "Tam o an jeneratör susuyor", g: 14, sfx: "boom", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.02]}><RadyoOdasi t={t} beam={0} bulb={1 - ramp(t, a + 0.4, a + 0.6)} names={0} jacket={0} steam={0} /></TCam>, html: big("14 GÜN BİTTİ.", "#E0393E", 110, 860) },
  { c: "Defne el fenerini yakıyor", g: 14, sfx: "tick", tone: "night", r: cam([1, 1.08], [960, 540], undefined, (t) => <RadyoOdasi t={t} beam={1} bardak={cay(0.5)} />) },
  { c: "Bir masa. Üstünde bir mikrofon", g: 14, tone: "night", r: cam([2.4, 2.6], [900, 560], undefined, (t) => <RadyoOdasi t={t} beam={1} bardak={cay(0.5)} names={0} />), html: tg("MİKROFON: HÂLÂ SICAK 🔥", T.red) },
  { c: "Yanında ince belli", g: 14, sfx: "ding", tone: "gold", r: cam([2.8, 3], [1040, 560], undefined, (t) => <RadyoOdasi t={t} beam={1} bardak={cay(0.5)} names={0} steam={1} />), html: tg("ÇAY: DUMANI TÜTÜYOR ☕", T.orange) },
  { c: "Ve masanın etrafında", g: 14, sfx: "drone", tone: "night", r: cam([1, 1.06], [960, 600], undefined, (t) => <RadyoOdasi t={t} beam={1} bardak={cay(0.5)} names={0} />), html: big("5 SANDALYE", "#FFFFFF", 110) },
  { c: "Beş. İstasyondaki saatin", g: 14, sfx: "boom", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 460]}><Istasyon t={t} mors={<MorsDuvar t={t} text="BEŞ" surf="istasyon" bg={false} y={430} k={1} />} /></TCam>, html: q("“BEŞ.”", 120, 0.3) },
  { c: "Sandalyelerden ikisinin", g: 14, tone: "night", r: cam([1.05, 1.12], [960, 620], undefined, (t) => <RadyoOdasi t={t} beam={1} bardak={cay(0.5)} names={1} />), html: tg("SENİN ADIN · DEFNE'NİN ADI", T.pink) },
  { c: "Ve iki ismin altında", g: 14, sfx: "boom", tone: "night", r: cam([2.6, 2.8], [1620, 660], undefined, (t) => <RadyoOdasi t={t} beam={1} bardak={cay(0.5)} names={1} />), html: big("03.14", "#E0393E", 140, 120) },
  { c: "Çantanı açıyorsun", g: 14, tone: "night", r: cam([1.2, 1.3], [960, 640], undefined, () => <><rect width={1920} height={1080} fill="#1A1D22" /><TenekeKutu y={700} s={1.1} open={1} /></>) },
  { c: "Üstünde adın", g: 14, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.5]} c0={[960, 520]}><rect width={1920} height={1080} fill="#1A1D22" /><Bileklik y={540} s={1.2} saat="03.14" /></TCam> },
  { c: "03.14", g: 14, sfx: "boom", tone: "night", ...kartTxt("03.14", undefined, "#E0393E") },
  { c: "Defne'ye bakıyorsun", g: 14, tone: "night", r: cam([2.8, 3], [1100, 560], undefined, (t) => <><RadyoOdasi t={t} beam={0.6} names={1} />{defk(t, 1100, 1, { dir: -1, mouth: "o", eyes: "wide", brow: "worried" })}</>), html: q("“BENİMKİ DE.”", 120, 0.5) },
  { c: "Üçüncü sandalyenin arkasında", g: 14, sfx: "drone", tone: "night", r: cam([2.4, 2.8], [1320, 660], undefined, (t) => <RadyoOdasi t={t} beam={1} names={1} jacket={1} />), html: tg("MALATYA'DAKİ GENCİN MONTU", T.green) },
  { c: "Ve üst kattan, ayak sesleri", g: 14, sfx: "knock", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.12]} c0={[960, 300]} shake={6}><RadyoOdasi t={t} beam={0.5} names={1} jacket={1} /></TCam>, html: big("TAK. TAK. TAK.", "#FFFFFF", 100, 140) },
  { c: "Ama o, bir sonraki bölüm", g: 14, sfx: "boom", hud: false, tone: "night", ...kartTxt("DEVAMI: 3. BÖLÜM", undefined, "#F6C445") },

  // ── KAPANIŞ ──
  { c: "Şimdi sana bir şey sormam", hud: false, tone: "warm", r: cam([1, 1.08], [960, 560], undefined, (t) => <>{yol(t, "gol", "dusk", { snow: 1, sun: 1, road: false })}{sen(t, 820, 1, { mouth: "smile" })}{defk(t, 1060, 1, { mouth: "smile" })}<Kopek x={1260} y={1040} s={0.6} t={t} kind="kara" wag={1} /></>), html: q("BU HİKÂYEYE DEVAM EDELİM Mİ?", 86, 0.3, 200) },
  { c: "Bu kanal, bu hikâyenin", hud: false, tone: "gold", r: cam([1.4, 1.5], [960, 700], undefined, (t) => <>{yol(t, "gol", "dusk", { snow: 1, sun: 1, road: false })}{sen(t, 820, 1, { mouth: "grin", eyes: "happy" })}{defk(t, 1060, 1, { mouth: "grin", eyes: "happy" })}<Kopek x={1260} y={1040} s={0.6} t={t} kind="kara" wag={1} /></>), html: q("BU KANAL, BU HİKÂYENİN ETRAFINDA DÖNSÜN MÜ?", 70, 0.2, 200) },
  { c: "Eğer devam etmesini istiyorsan", hud: false, sfx: "ding", tone: "gold", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="YORUMLARA TEK KELİME:" y={300} size={70} color="#FFFFFF" /><Txt t={t} at={a + 1} text="DEVAM" y={460} size={200} color="#F6C445" /></> },
  { c: "Ve abone olup zili", hud: false, tone: "gold", r: cam([1, 1.08], [960, 600], undefined, (t) => <RadyoOdasi t={t} beam={0.8} names={1} jacket={1} />), html: (t, a) => <><Txt t={t} at={a + 0.2} text="5 SANDALYE NEDEN ORADA?" y={180} size={80} color="#FFFFFF" /><Abone t={t} at={a + 1} /></> },
];

type Timed = Sh & { from: number; to: number; day: number };
export const TIMED: Timed[] = (() => {
  let after = 0, day = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    if (s.g !== undefined) day = s.g;
    return { ...s, from, to: 0, day };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K2R_17_SECONDS));
  return raw;
})();

const VOL: Record<string, number> = { whoosh: 0.07, drone: 0.12, boom: 0.13, ding: 0.12, knock: 0.1, splash: 0.1, buzz: 0.07, pop: 0.09, whistle: 0.08, boing: 0.08, tick: 0.08, static: 0.07 };
export const K2RVideo17: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K2R_17_SECONDS;
  const cut = 1 - ramp(t, s.from, s.from + 0.14);
  const showHud = s.hud !== false && s.day > 0;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: ramp(t, 0, 0.5) * (1 - ramp(t, END - 1.2, END)) }}>
        <TFrame>
          <LiveCam t={t} a={s.from}>{s.r(t, s.from, s.to)}</LiveCam>
          {s.fore && <Fore t={t} a={s.from} kind={s.fore} c="#2A2F38" />}
          <Atmos t={t} tone={s.tone ?? "warm"} rays={s.tone === "night" ? 0.4 : 0.8} seed={n} />
          <Sweep t={t} a={s.from} />
          {showHud && <HUD2 t={t} gun={s.day} km={kmOf(s.day)} gece={!!s.n} />}
        </TFrame>
        {s.html?.(t, s.from, s.to)}
        <AbsoluteFill style={{ background: "#FFFFFF", opacity: cut * 0.2, pointerEvents: "none" }} />
      </AbsoluteFill>
      <Audio src={staticFile("audio/k2r-17.wav")} />
      {TIMED.map((x, i) => i > 0 && !(x.from > END - 19 && x.sfx && x.sfx !== "whoosh") && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.08) * fps))} durationInFrames={Math.round(2.2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.from > END - 19 ? 0.04 : VOL[x.sfx ?? "whoosh"] ?? 0.07} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
