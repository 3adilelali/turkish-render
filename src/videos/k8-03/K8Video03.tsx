import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k8-03-words.json";
import { makeCue, ramp as rampRaw } from "../../lib/cues";
import { P, TCam, TFrame, TPose, lerp, toonWalk, runPose } from "../../components/Toon";
import { Txt, Tag, Abone } from "../../components/K2Kit";
import { Atmos, LiveCam, Tone } from "../../components/Live";
import { Telefon } from "../../components/SonIki";
import { DFig, DEyes, DBrow, DMouth, Konak, HastaneOda, Tabanca, SirenIsik } from "../../components/Dizi";
import {
  CE, COCUK, FlasBellek, Kelepce, Fincan, Bebek, Besik, Saat, Laptop, Fistik, FistikIc, SahilYolu, KoskDis, Koridor,
  HastaneKoridor, AmbulansIc, Ambulans, Merkez, Yetimhane, BahceKapi,
} from "../../components/Esref";

// Kanal 6 · k8-03 · "Ya Eşref Tek Ölmeseydi? | Eşref Rüya Alternatif Final". TAMAMEN MOTOR (Dizi.tsx + Esref.tsx).
// Hayran yapımı: dizi görüntüsü/sesi/logosu yok, karakterler genel benzerlik (ten, saç, kıyafet). Beyaz kesme flaşı yok.

const ALT: Record<string, string[]> = {
  "Birinci bölüm. Son kurşun": ["1. bölüm. Son kurşun", "1. bölüm Son kurşun", "Birinci bölüm Son kurşun"],
  "İkinci bölüm. Bir saat": ["2. bölüm. Bir saat", "2. bölüm Bir saat", "2. bölüm. 1 saat", "İkinci bölüm. 1 saat", "İkinci bölüm Bir saat"],
  "Üçüncü bölüm. Kardeş": ["3. bölüm. Kardeş", "3. bölüm Kardeş", "Üçüncü bölüm Kardeş"],
  "Dördüncü bölüm. İki cephe": ["4. bölüm. İki cephe", "4. bölüm İki cephe", "Dördüncü bölüm İki cephe", "4. bölüm. 2 cephe"],
  "Beşinci bölüm. Rüya": ["5. bölüm. Rüya", "5. bölüm Rüya", "Beşinci bölüm Rüya"],
  "On yıl sonra": ["10 yıl sonra"],
  "Bir saat dedim": ["1 saat dedim"],
  "Bir saat önce": ["1 saat önce"],
  "Bir saat doluyor": ["1 saat doluyor"],
  "Bir saat demiştin": ["1 saat demiştin"],
  "Bir saat demiştim": ["1 saat demiştim"],
  "Bir saat dedin": ["1 saat dedin"],
  "Bir dakika sonra": ["1 dakika sonra"],
  "Kapıda dört adam": ["Kapıda 4 adam"],
  "Sadece üç kelime": ["Sadece 3 kelime"],
  "İçinde iki dosya": ["İçinde 2 dosya"],
  "Kalbi iki kez durdu": ["Kalbi 2 kez durdu"],
  "Yanına bir kişi girebilir": ["Yanına 1 kişi girebilir"],
  "Yedi saat oldu": ["7 saat oldu"],
  "Saat on bire çeyrek": ["Saat 11'e çeyrek", "Saat 11 e çeyrek", "Saat onbire çeyrek"],
  "Müslüm çay dolduruyor": ["Müslüm çay dolduruyor"],
};
const variants = (p: string) => [p, p.replace(/[.,:!?]/g, "")];
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const ramp = (t: number, a: number, b: number) => (b - a > 0.01 ? rampRaw(t, a, b) : t >= b ? 1 : 0);
const W_ = words as { end: number }[];
const VOICE_END = W_[W_.length - 1].end;
export const K8_03_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone; siren?: boolean };

// ── yardımcılar ──
type Face = { s?: number; dir?: 1 | -1; pose?: TPose; eyes?: DEyes; brow?: DBrow; mouth?: DMouth; talk?: boolean; look?: number; lookY?: number; tear?: number; holdR?: React.ReactNode; holdL?: React.ReactNode; y?: number; wet?: number; op?: number; blush?: number };
const G = 1010;
const F = (name: string, x: number, f: Face = {}) => (t: number) => <DFig key={name + x} x={x} y={f.y ?? G} s={f.s ?? 1.1} o={CE[name]} t={t} seed={name.length * 3 + x / 100} {...f} />;
const Wk = (name: string, x0: number, x1: number, f: Face = {}, d0 = 0.1, d1 = 2.6) => (t: number, a: number) => {
  const s = f.s ?? 1.1;
  const w = toonWalk(t, a + d0, a + d1, x0, x1, s);
  return <DFig key={name + "w"} x={w.x} y={f.y ?? G} s={s} o={CE[name]} t={t} dir={w.dir} walk={w.walk} seed={name.length} {...f} />;
};
const Run = (name: string, x0: number, x1: number, f: Face = {}, d0 = 0.1, d1 = 1.6) => (t: number, a: number) => {
  const x = lerp(x0, x1, ramp(t, a + d0, a + d1));
  const moving = t > a + d0 && t < a + d1;
  return <DFig key={name + "r"} x={x} y={f.y ?? G} s={f.s ?? 1.1} o={CE[name]} t={t} dir={x1 > x0 ? 1 : -1} pose={moving ? runPose((t - a) * 9) : f.pose ?? P.stand} seed={name.length} {...f} />;
};
type Node = (t: number, a: number, b: number) => React.ReactNode;
const sc = (bg: Node, ...figs: Node[]): Node => (t, a, b) => <>{bg(t, a, b)}{figs.map((f, i) => <React.Fragment key={i}>{f(t, a, b)}</React.Fragment>)}</>;
const cam = (z: [number, number], c0: [number, number], c1: [number, number] | undefined, node: Node, shake = 0): R => (t, a, b) => <TCam t={t} a={a} b={b} z={z} c0={c0} c1={c1} shake={shake}>{node(t, a, b)}</TCam>;
const face = (x: number, s = 1.1, dx = 0): [number, number] => [x + dx, G - 400 * s];
const q = (text: string, size = 66, k = 0.25, y = 880): R => (t, a, b) => <Txt t={t} at={a + Math.min(0.6, (b - a) * k)} text={text} y={y} size={size} />;
const tg = (text: string, c = "#E63946", at = 0.4, y?: number): R => (t, a) => <Tag t={t} at={a + at} text={text} c={c} y={y} />;
const big = (text: string, color = "#FFC800", size = 100, y = 90): R => (t, a) => <Txt t={t} at={a + 0.25} text={text} y={y} size={size} color={color} />;
const kart = (bg: string): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill={bg} /></TCam>;
const bolum = (n: string, name: string): Pick<Sh, "r" | "html" | "sfx" | "tone"> => ({
  sfx: "boom", tone: "none",
  r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}><rect width={1920} height={1080} fill="#0B0F1A" /><rect x={0} y={480} width={1920 * ramp(t, a + 0.1, a + 0.9)} height={5} fill="#8FBF6A" /><g transform={`translate(1560,${300 + Math.sin(t) * 8}) rotate(-6) scale(0.42)`}><Fistik x={0} y={0} t={t} lights={1} /></g></TCam>,
  html: (t, a) => <><Txt t={t} at={a + 0.15} text={n} y={330} size={70} color="#FFFFFF" /><Txt t={t} at={a + 0.7} text={name} y={540} size={150} color="#FFC800" /></>,
});
// eşyalar / pozlar
const tab = <Tabanca s={0.55} rot={0} />;
const bebek = (t: number, cry = 0) => <Bebek x={-10} y={-20} s={0.5} t={t} cry={cry} rot={-30} />;
const AIM: TPose = { l: [8, 6], r: [84, 92] };
const KNEEL: TPose = { l: [20, 40], r: [30, 60], ll: [90, 0], rl: [-10, 80], lean: 6 };
const HUG: TPose = { l: [70, 110], r: [70, 110], lean: 6 };
const SLUMP: TPose = { l: [40, 70], r: [50, 80], lean: 24 };
const PRESS: TPose = { l: [70, 120], r: [75, 125], ll: [90, 0], rl: [-10, 80], lean: 22 };
const CARRY: TPose = { l: [40, 95], r: [40, 95] };
const SING: TPose = { l: [30, 120], r: [8, 6] };
const muzzle = (x: number, y: number, at: number): Node => (t, a) => { const d = t - (a + at); return d > 0 && d < 0.14 ? <g transform={`translate(${x},${y})`}><path d="M0,-40 L14,-12 L46,-10 L20,8 L28,40 L0,20 L-28,40 L-20,8 L-46,-10 L-14,-12Z" fill="#FFE29A" /><circle r={60} fill="#FFE29A" opacity={0.35} /></g> : null; };

// ── sahneler ──
const yol = (o: { day?: number; px?: number; car?: boolean; carX?: number; lights?: number } = {}): Node => (t, a) => <><SahilYolu t={t} day={o.day ?? 0} px={o.px ? (t - a) * o.px : 0} />{o.car !== false && <Fistik x={o.carX ?? 1260} y={1000} s={0.9} t={t} lights={o.lights ?? 1} tail={1} />}</>;
const ic = (f: Face & { lean?: number; glove?: number; phone?: number; speed?: number; o?: string } = {}): Node => (t, a) => {
  const pose: TPose = { ...SLUMP, lean: f.lean ?? 24 };
  return <FistikIc t={t} speed={f.speed ?? 0} glove={f.glove ? ramp(t, a + 0.3, a + 1.3) * f.glove : 0} phone={f.phone ?? 0} who={<DFig x={1040} y={1560} s={2.2} o={CE[f.o ?? "esrefKan"]} t={t} dir={-1} pose={pose} seed={5} eyes={f.eyes ?? "closed"} brow={f.brow ?? "sad"} mouth={f.mouth ?? "flat"} talk={f.talk} tear={f.tear} />} />;
};
const salonEv = (t: number) => <><Konak t={t} room="salon" /><g transform="translate(1640,300) scale(0.5)"><Saat x={0} y={0} h={10} m={45} /></g></>;
const salonGeç = (t: number) => <><Konak t={t} room="salon" /><g transform="translate(1640,300) scale(0.5)"><Saat x={0} y={0} h={11} m={50} /></g></>;
const kapiEv = (d = 0): Node => (t, a) => <Konak t={t} room="kapi" door={d < 0 ? ramp(t, a + 0.3, a + 1.4) : d} />;
const cocukOda = (t: number) => <><Konak t={t} room="oda" lamp={0.8} /><Besik x={1360} y={900} s={1} t={t} rock={1} /></>;
const cocukOdaBos = (t: number) => <><Konak t={t} room="oda" lamp={0.8} /><Besik x={1360} y={900} s={1} t={t} baby={false} /></>;
const kosk = (gate = 0): Node => (t) => <KoskDis t={t} gate={gate} />;
const koridor = (blood = 0, door = 0): Node => (t) => <Koridor t={t} blood={blood} door={door} />;
const ihtSalon = (t: number) => <><Konak t={t} room="salon" lamp={0.5} /><rect width={1920} height={1080} fill="#1A0A06" opacity={0.3} /></>;
const hKor = (o: { red?: number; dawn?: number; door?: number } = {}): Node => (t) => <HastaneKoridor t={t} {...o} />;
const hOda = (beat = 1, night = 1): Node => (t) => <HastaneOda t={t} beat={beat} night={night} />;
const yatak = (f: Face = {}, o = "esrefHasta"): Node => (t) => <g><g transform="translate(720,700) rotate(-90)"><DFig x={0} y={0} s={0.9} o={CE[o]} t={t} seed={4} {...f} /></g><path d={`M440,${700 + Math.sin(t * 2.1) * 3} Q800,${640 + Math.sin(t * 2.1) * 4} 1130,700 L1130,760 L440,760Z`} fill="#A9C7D6" stroke="#1B1210" strokeWidth={5} /></g>;
const amb = (t: number) => <AmbulansIc t={t} />;
const laptop = (mode: "video" | "liste", o: { hl?: boolean; talk?: boolean; scroll?: number } = {}): Node => (t, a) => <><rect width={1920} height={1080} fill="#0E1626" /><Laptop x={960} y={500} s={1.05} t={t} mode={mode} talk={o.talk} hl={o.hl ? ramp(t, a + 0.8, a + 1.4) : 0} scroll={o.scroll ? ramp(t, a, a + 2) * o.scroll : 0} /></>;
const bKapi = (siren = 0): Node => (t) => <BahceKapi t={t} siren={siren} />;
const merkez = (t: number) => <Merkez t={t} />;
const merkezIc = (t: number) => <Merkez t={t} ic />;
const yetim = (t: number) => <Yetimhane t={t} />;
const telKart = (msgs: { who: string; text: string; me?: boolean }[], time = "23:52"): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><rect width={1920} height={1080} fill="#121520" /><g transform="translate(960,560) scale(1.15)"><foreignObject x={-260} y={-480} width={520} height={960}><div style={{ width: 520, height: 960 }}><Telefon msgs={msgs} time={time} /></div></foreignObject></g></TCam>;
const fistikYuru = (px = 700, who?: (t: number) => React.ReactNode, who2?: (t: number) => React.ReactNode): Node => (t, a) => <><SahilYolu t={t} day={1} px={(t - a) * px} /><Fistik x={900} y={1000} s={0.9} t={t} roll={(t - a) * 1.2} who={who?.(t)} who2={who2?.(t)} /></>;
const nisanSofor = (t: number) => <DFig x={150} y={-60} s={0.42} o={CE.nisan} t={t} mouth="smile" seed={2} />;
const ruyaArka = (t: number) => <DFig x={-60} y={-70} s={0.34} o={CE.ruya} t={t} mouth="smile" seed={8} />;

const SHOTS: Sh[] = [
  // ── HOOK (0:00–1:30) ──
  { c: "Gece yarısı. Sarıyer'de", sfx: "drone", tone: "night", r: cam([1, 1.1], [960, 560], [1100, 600], yol({ carX: 1260 })), html: (t, a) => <><div style={{ position: "absolute", left: 40, bottom: 34, opacity: 1 - ramp(t, 3.4, 3.9), fontFamily: "Poppins", fontWeight: 700, fontSize: 30, color: "#fff", background: "rgba(0,0,0,.55)", padding: "6px 18px", borderRadius: 10 }}>Hayran yapımı alternatif senaryo</div>{tg("SARIYER · GECE YARISI", "#1B4F9C", 0.6)(t, a, a)}</> },
  { c: "Yolun kenarında eski bir araba", tone: "night", r: cam([1.6, 1.8], [1250, 820], [1180, 820], yol({ carX: 1260 })) },
  { c: "Motoru hâlâ çalışıyor", sfx: "engine", tone: "night", r: cam([3, 3.3], [1560, 900], [1520, 880], yol({ carX: 1260 }), 1.2) },
  { c: "Farları denize bakıyor", tone: "night", r: cam([1.3, 1.4], [1500, 700], undefined, yol({ carX: 1260 })) },
  { c: "Bu araba Fıstık", sfx: "ding", tone: "night", r: cam([2, 2.2], [1250, 820], undefined, yol({ carX: 1260 })), html: big("FISTIK", "#8FBF6A", 120, 110) },
  { c: "Ve direksiyonun başındaki adamın", tone: "night", r: cam([1, 1.06], [960, 560], undefined, ic({ lean: 10, eyes: "squint", brow: "sad", mouth: "tight" })) },
  { c: "Gömleği kan içinde", sfx: "heart", tone: "night", r: cam([2.4, 2.6], [1000, 760], [1000, 700], ic({ lean: 10, eyes: "squint", brow: "sad", mouth: "tight" })) },
  { c: "Eşref Tek.", sfx: "boom", tone: "night", r: cam([2.4, 2.6], [1000, 430], undefined, ic({ lean: 6, eyes: "open", brow: "angry", mouth: "tight" })), html: big("EŞREF TEK", "#FFFFFF", 130, 120) },
  { c: "Telefonu çalıyor", sfx: "buzz", tone: "night", r: cam([1.2, 1.3], [960, 700], undefined, ic({ lean: 10, eyes: "squint", phone: 1 })) },
  { c: "Ekranda tek bir isim var", tone: "night", r: cam([3, 3.2], [980, 980], undefined, ic({ lean: 10, phone: 1 })), html: big("NİSAN", "#FF3E7F", 110, 110) },
  { c: "Eşref telefona uzanıyor", tone: "night", r: cam([1.3, 1.4], [960, 700], undefined, ic({ lean: 16, eyes: "squint", phone: 1 })) },
  { c: "Ama eli titriyor", tone: "night", r: cam([2.2, 2.4], [900, 820], undefined, ic({ lean: 16, eyes: "squint", phone: 1 }), 3) },
  { c: "Telefon koltuğun altına düşüyor", sfx: "tick", tone: "night", r: cam([1.8, 1.6], [980, 960], [980, 1000], ic({ lean: 20, eyes: "closed", phone: 0 })) },
  { c: "Eşref gözlerini kapatıyor", tone: "night", r: cam([2.4, 2.6], [1000, 430], undefined, ic({ lean: 22, eyes: "closed", brow: "sad" })) },
  { c: "Bir saat dedim", sfx: "drone", tone: "night", r: cam([2.6, 2.8], [1000, 430], undefined, ic({ lean: 22, eyes: "closed", talk: true, tear: 0.6 })), html: q("“BİR SAAT DEDİM, RÜYAM. BİRAZ GECİKTİM.”", 64) },
  { c: "Gerçek finalde, Eşref'in kalbi", sfx: "heart", tone: "night", r: cam([1, 1.12], [960, 560], undefined, ic({ lean: 26, eyes: "closed" })), html: tg("GERÇEK FİNAL", "#E63946") },
  { c: "Nisan onu bu arabanın içinde buldu", tone: "night", r: cam([1, 1.05], [960, 600], undefined, sc(yol({ carX: 1260, lights: 0 }), F("nisanPalto", 600, { eyes: "sad", brow: "sad", tear: 1, mouth: "frown" }))) },
  { c: "Ve ekran başındaki milyonlarca", tone: "cool", r: kart("#0E1222"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="“BU SON OLMADI.”" y={360} size={120} color="#FFFFFF" /><Txt t={t} at={a + 1.2} text="— milyonlarca izleyici" y={560} size={50} color="#9AA4B0" /></> },
  { c: "Bu gece, o son değişiyor", sfx: "boom", tone: "gold", r: cam([1.1, 1], [960, 540], undefined, yol({ day: 0, carX: 1260 })), html: big("BU GECE O SON DEĞİŞİYOR", "#FFC800", 86, 110) },
  { c: "Bu gece Eşref Tek'in kalbi durmayacak", sfx: "heart", tone: "night", r: cam([2.4, 2.6], [1000, 430], undefined, ic({ lean: 20, eyes: "closed" })) },
  { c: "Ama ona ulaşmak için", sfx: "tick", tone: "night", r: cam([1, 1.06], [960, 540], undefined, (t, a) => <><rect width={1920} height={1080} fill="#0B0F1A" /><Saat x={960} y={520} s={2.4} h={11} m={Math.min(59, 30 + (t - a) * 8)} /></>), html: big("1 SAATTEN AZ", "#E63946", 100, 110) },
  { c: "Kim önce ulaşacak", sfx: "tick", tone: "night", r: cam([1, 1.08], [960, 560], undefined, sc(yol({ carX: 1500 }), Run("gurdal", -100, 500, { brow: "angry" }), Run("nisanPalto", -300, 300, { brow: "worried" }, 0.3, 1.8))), html: big("1. KİM ÖNCE ULAŞACAK?", "#FFFFFF", 78, 80) },
  { c: "İhtiyar'ın ölmeden önce", sfx: "tick", tone: "night", r: cam([2.4, 2.6], face(1000), undefined, sc(ihtSalon, F("ihtiyar", 1000, { mouth: "smirk", eyes: "squint" }))), html: big("2. İHTİYAR'IN SON CÜMLESİ", "#FFC800", 72, 80) },
  { c: "Ve torpidodaki flaş bellekte", sfx: "tick", tone: "night", r: cam([1, 1.1], [960, 540], undefined, (t) => <><rect width={1920} height={1080} fill="#14100C" /><FlasBellek x={960} y={540} s={2.4} glow={1} /></>), html: big("3. FLAŞ BELLEKTE NE VAR?", "#FF3E7F", 76, 80) },
  { c: "Bu gece bir kardeş geri dönecek", sfx: "whoosh", tone: "night", r: cam([1.2, 1.3], [700, 560], undefined, sc(yol({ carX: 1500 }), F("kadir", 700, { brow: "angry", mouth: "tight" }))), html: tg("BİR KARDEŞ", "#1B4F9C") },
  { c: "Bir hain, maskesini düşürecek", sfx: "whoosh", tone: "night", r: cam([2.4, 2.6], face(960), undefined, sc(salonGeç, F("balikci", 960, { mouth: "smirk", eyes: "squint" }))), html: tg("BİR HAİN", "#E63946") },
  { c: "Ve Nisan, bir hastane koridorunda", sfx: "whoosh", tone: "cool", r: cam([1.4, 1.5], [800, 560], undefined, sc(hOda(1), yatak({ eyes: "closed" }), F("nisan", 1250, { dir: -1, pose: SING, eyes: "closed", talk: true, tear: 1 }))), html: tg("BİR ŞARKI", "#FF3E7F") },
  { c: "Eşref Rüya bitti", tone: "gold", r: cam([1.1, 1], [960, 540], undefined, fistikYuru(500)), html: (t, a) => <><Txt t={t} at={a + 0.2} text="EŞREF RÜYA" y={300} size={150} color="#FFFFFF" /><Txt t={t} at={a + 1.0} text="ALTERNATİF FİNAL" y={500} size={90} color="#8FBF6A" /></> },
  { c: "Ama bu gece, finali biz yazıyoruz", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><rect width={1920} height={1080} fill="#1B4F9C" /><g transform={`translate(960,560) rotate(${-10 + ramp(t, a, b) * 8})`}><rect x={-500} y={-26} width={900} height={52} rx={10} fill="#FFC800" stroke="#1B1210" strokeWidth={8} /><path d="M400,-26 L520,0 L400,26Z" fill="#F3CDAA" stroke="#1B1210" strokeWidth={8} /><path d={`M520,0 q60,${-40 + Math.sin(t * 8) * 20} 140,0 t140,0`} stroke="#1B1210" strokeWidth={8} fill="none" strokeDasharray={`${ramp(t, a, b) * 400} 400`} /></g></TCam>, html: big("FİNALİ BİZ YAZIYORUZ", "#FFFFFF", 90, 120) },

  // ── 1. BÖLÜM: SON KURŞUN ──
  { c: "Birinci bölüm. Son kurşun", ...bolum("BİRİNCİ BÖLÜM", "SON KURŞUN") },
  { c: "Bir saat önce", tone: "warm", r: cam([1, 1.06], [960, 560], undefined, sc(salonEv)), html: tg("1 SAAT ÖNCE", "#1B4F9C") },
  { c: "Nisan, kızları Rüya'yı", tone: "warm", r: cam([1.2, 1.3], [800, 600], undefined, sc(salonEv, F("nisan", 760, { pose: CARRY, holdR: bebek(0), mouth: "smile", eyes: "happy" }))) },
  { c: "Günlerdir ilk kez gülüyor", tone: "warm", r: cam([2.6, 2.8], face(760), undefined, sc(salonEv, (t) => <DFig x={760} y={G} s={1.1} o={CE.nisan} t={t} pose={CARRY} holdR={bebek(t)} mouth="grin" eyes="happy" />)) },
  { c: "İhtiyar'ın elinden kurtulmuştu", tone: "warm", r: cam([1.4, 1.5], [760, 640], undefined, sc(salonEv, (t) => <DFig x={760} y={G} s={1.1} o={CE.nisan} t={t} pose={CARRY} holdR={bebek(t)} mouth="smile" eyes="down" />)), html: tg("NİSAN KURTARILDI", "#3FAE6A") },
  { c: "Kızına kavuşmuştu", tone: "gold", r: cam([3, 3.2], [770, 650], undefined, sc(salonEv, (t) => <DFig x={760} y={G} s={1.1} o={CE.nisan} t={t} pose={CARRY} holdR={bebek(t)} mouth="smile" eyes="happy" tear={0.5} />)) },
  { c: "Herkes, savaşın bittiğini sanıyordu", tone: "warm", r: cam([1, 1.06], [960, 600], undefined, sc(salonEv, F("gurdal", 380, { mouth: "grin" }), F("faruk", 620), F("muslum", 1200, { dir: -1, mouth: "smile" }), F("irmak", 1460, { dir: -1, mouth: "smile" }))) },
  { c: "Eşref kapının önünde ceketini", tone: "night", r: cam([1, 1.08], [960, 600], undefined, sc(kapiEv(0), F("esref", 960, { pose: P.hold, eyes: "down" }))) },
  { c: "Faruk yanına geliyor", tone: "night", r: cam([1, 1.06], [960, 600], undefined, sc(kapiEv(0), F("esref", 1100, { dir: -1 }), Wk("faruk", 300, 760, {}))) },
  { c: "Nereye böyle, Eşref", tone: "night", r: cam([2.6, 2.8], face(760), undefined, sc(kapiEv(0), F("faruk", 760, { talk: true, brow: "worried" }))), html: q("“NEREYE BÖYLE, EŞREF?”") },
  { c: "Eşref, Faruk'un omzuna elini", tone: "night", r: cam([1.6, 1.7], [930, 620], undefined, sc(kapiEv(0), F("faruk", 760, { eyes: "wide" }), F("esref", 1040, { dir: -1, pose: { l: [8, 6], r: [80, 70] }, mouth: "smile" }))) },
  { c: "Savcı Selma'yla bir işim var", tone: "night", r: cam([2.6, 2.8], face(1040), undefined, sc(kapiEv(0), F("esref", 1040, { dir: -1, talk: true, mouth: "smile" }))), html: q("“EN FAZLA BİR SAAT GECİKİRİM, PROFESÖR.”", 64) },
  { c: "Sonra Gürdal'a dönüyor", tone: "night", r: cam([1.2, 1.3], [960, 600], undefined, sc(kapiEv(0), F("gurdal", 600, { brow: "worried" }), F("esref", 1040, { dir: -1, brow: "angry" }))) },
  { c: "Kimse peşimden gelmeyecek", tone: "night", r: cam([2.6, 2.8], face(1040), undefined, sc(kapiEv(0), F("esref", 1040, { dir: -1, talk: true, brow: "angry", pose: P.point }))), html: q("“KİMSE PEŞİMDEN GELMEYECEK.”", 76) },
  { c: "Gürdal kaşlarını çatıyor", tone: "night", r: cam([2.4, 2.6], face(600, 1.1), undefined, sc(kapiEv(0), F("gurdal", 600, { brow: "angry", mouth: "frown" }))) },
  { c: "Ula Eşref, sen bize bir şey", tone: "night", r: cam([2.4, 2.6], face(600, 1.1), undefined, sc(kapiEv(0), F("gurdal", 600, { brow: "worried", talk: true }))), html: q("“ULA EŞREF, BİZE BİR ŞEY Mİ SAKLIYORSUN?”", 62) },
  { c: "Eşref gülümsüyor", tone: "night", r: cam([2.6, 2.8], face(1040), undefined, sc(kapiEv(0), F("esref", 1040, { dir: -1, mouth: "smile", eyes: "sad" }))) },
  { c: "Kızının alnını öpüyor", tone: "warm", r: cam([1.8, 2], [960, 560], undefined, sc(cocukOda, F("esref", 1180, { pose: KNEEL, y: G + 40, eyes: "closed", mouth: "smile" }))) },
  { c: "Nisan'ın gözlerine uzun uzun", tone: "warm", r: cam([1.7, 1.8], [960, 600], undefined, sc(salonEv, F("esref", 840, { eyes: "sad", mouth: "smile", look: 1 }), (t) => <DFig x={1100} y={G} s={1.1} o={CE.nisan} t={t} dir={-1} pose={CARRY} holdR={bebek(t)} eyes="open" mouth="smile" />)) },
  { c: "Sanki onu ezberliyor", tone: "warm", r: cam([2.8, 3], face(840), undefined, sc(salonEv, F("esref", 840, { eyes: "sad", mouth: "smile", look: 1, tear: 0.4 }))) },
  { c: "Ama Eşref savcıya gitmiyor", sfx: "engine", tone: "night", r: cam([1, 1.06], [960, 560], undefined, (t, a) => <><SahilYolu t={t} px={(t - a) * 900} /><Fistik x={900} y={1000} s={0.9} t={t} lights={1} roll={(t - a) * 2} /></>) },
  { c: "Fıstık'ın motorunu çalıştırıyor", sfx: "engine", tone: "night", r: cam([1, 1.05], [960, 560], undefined, ic({ o: "esref", lean: 0, eyes: "open", brow: "angry", mouth: "tight", speed: 1 })) },
  { c: "Tek başına", tone: "night", r: cam([2.6, 2.8], [1000, 430], undefined, ic({ o: "esref", lean: 0, eyes: "squint", brow: "angry", mouth: "tight", speed: 1 })), html: big("TEK BAŞINA.", "#FFFFFF", 110, 110) },
  { c: "Çünkü bu hesap, sadece onun", tone: "night", r: cam([1.2, 1.1], [960, 540], undefined, (t, a) => <><SahilYolu t={t} px={(t - a) * 1100} /><Fistik x={1000} y={1000} s={0.9} t={t} lights={1} roll={(t - a) * 2.4} /></>) },
  { c: "Yol boyunca radyo kapalı", tone: "night", r: cam([2.4, 2.6], [1440, 880], undefined, ic({ o: "esref", lean: 0, eyes: "open", speed: 1 })) },
  { c: "Eşref sadece motorun sesini", sfx: "engine", tone: "night", r: cam([1.5, 1.6], [960, 600], undefined, ic({ o: "esref", lean: 0, eyes: "down", speed: 1 })) },
  { c: "Ve aklına yıllar öncesi geliyor", sfx: "static", tone: "gold", r: cam([1, 1.08], [960, 560], undefined, yetim), html: tg("YILLAR ÖNCE", "#C89A5A") },
  { c: "Yetimhanenin bahçesi", tone: "gold", r: cam([1.2, 1.3], [760, 520], undefined, yetim) },
  { c: "Küçük bir oğlan ve elinde", tone: "gold", r: cam([1.3, 1.4], [960, 700], undefined, sc(yetim, F("esrefCocuk", 760, { s: 0.7, look: 1 }), F("nisanCocuk", 1100, { s: 0.66, dir: -1, pose: P.hold, holdR: <rect x={-30} y={-20} width={60} height={44} fill="#C0392B" stroke="#1B1210" strokeWidth={3} />, eyes: "down" }))) },
  { c: "Oğlan, kızın adını bilmiyordu", tone: "gold", r: cam([2.4, 2.6], [760, 760], undefined, sc(yetim, F("esrefCocuk", 760, { s: 0.7, look: 1, mouth: "o" }))) },
  { c: "O yüzden ona bir isim koydu", tone: "gold", r: cam([1.8, 2], [940, 760], undefined, sc(yetim, F("esrefCocuk", 760, { s: 0.7, talk: true, mouth: "smile" }), F("nisanCocuk", 1100, { s: 0.66, dir: -1, mouth: "smile", eyes: "happy" }))), html: big("“RÜYA.”", "#FFFFFF", 140, 140) },
  { c: "Yıllarca o rüyayı aradı", tone: "gold", r: cam([1, 1.08], [960, 560], undefined, yetim) },
  { c: "Ve sonunda buldu", tone: "warm", r: cam([2.6, 2.8], face(1100), undefined, sc(salonEv, (t) => <DFig x={1100} y={G} s={1.1} o={CE.nisan} t={t} dir={-1} mouth="smile" eyes="happy" />)), html: big("NİSAN.", "#FF3E7F", 120, 120) },
  { c: "Eşref direksiyonu sıkıyor", tone: "night", r: cam([2, 2.2], [700, 800], undefined, ic({ o: "esref", lean: 0, eyes: "squint", brow: "angry", speed: 1 })) },
  { c: "Bu gece, o rüyayı korumak için", tone: "night", r: cam([2.6, 2.8], [1000, 430], undefined, ic({ o: "esref", lean: 0, eyes: "sad", speed: 1 })) },
  { c: "Torpidoya bir şey bırakmıştı", sfx: "tick", tone: "night", r: cam([2.4, 2.6], [1180, 940], undefined, ic({ o: "esref", lean: 0, eyes: "down", speed: 0.5, glove: 1 })), html: tg("TORPİDO", "#8FBF6A") },
  { c: "Bu sabah, kimse görmeden", tone: "night", r: cam([3, 3.2], [1160, 960], undefined, ic({ o: "esref", lean: 0, speed: 0.5, glove: 1 })) },
  { c: "Sadece Nisan anlasın diye", tone: "night", r: cam([2.6, 2.8], [1000, 430], undefined, ic({ o: "esref", lean: 0, eyes: "sad", mouth: "smile", speed: 0.5 })) },
  { c: "Köşkün bahçesi karanlık", sfx: "drone", tone: "night", r: cam([1, 1.08], [960, 560], undefined, kosk(0)), html: tg("İHTİYAR'IN KÖŞKÜ", "#E63946") },
  { c: "Kapıda dört adam", tone: "night", r: cam([1.3, 1.4], [960, 640], undefined, sc(kosk(0), F("adam", 560, { s: 0.9, y: 980 }), F("adam", 760, { s: 0.9, y: 980 }), F("adam", 1160, { s: 0.9, y: 980, dir: -1 }), F("adam", 1360, { s: 0.9, y: 980, dir: -1 }))) },
  { c: "Eşref arabadan iniyor", tone: "night", r: cam([1, 1.06], [960, 600], undefined, sc(kosk(0), (t) => <Fistik x={300} y={1000} s={0.8} t={t} lights={1} door={0.6} />, Wk("esref", 600, 860, { brow: "angry" }))) },
  { c: "Ellerini cebine sokuyor", tone: "night", r: cam([2.2, 2.4], [880, 760], undefined, sc(kosk(0), F("esref", 880, { pose: P.hips, brow: "angry", mouth: "tight" }))) },
  { c: "Yavaş yavaş yürüyor", tone: "night", r: cam([1.2, 1.3], [960, 620], undefined, sc(kosk(0), Wk("esref", 400, 900, { pose: P.hips, brow: "angry" }, 0.1, 3.2), F("adam", 1160, { s: 0.95, dir: -1, eyes: "wide" }), F("adam", 1380, { s: 0.95, dir: -1 }))) },
  { c: "Adamlardan biri bağırıyor", tone: "night", r: cam([2.6, 2.8], face(1160, 0.95), undefined, sc(kosk(0), F("adam", 1160, { s: 0.95, dir: -1, mouth: "shout", brow: "angry", pose: AIM, holdR: tab }))), html: q("“DUR! KİMSİN SEN?”", 90) },
  { c: "Eşref durmuyor", tone: "night", r: cam([1.6, 1.8], [800, 600], undefined, sc(kosk(0), Wk("esref", 500, 800, { brow: "angry" }, 0, 2))) },
  { c: "İhtiyar'a söyleyin", tone: "night", r: cam([2.6, 2.8], face(800), undefined, sc(kosk(0), F("esref", 800, { talk: true, brow: "angry", mouth: "tight" }))), html: q("“İHTİYAR'A SÖYLEYİN. YETİM GELDİ.”", 70) },
  { c: "Bir dakika sonra", sfx: "boom", tone: "night", r: cam([1, 1.06], [960, 600], undefined, sc(kosk(1), (t) => <g>{[560, 1180, 1400].map((x, i) => <g key={i} transform={`translate(${x},${G - 30}) rotate(-90)`}><DFig x={0} y={0} s={0.9} o={CE.adam} t={t} eyes="closed" seed={i} /></g>)}</g>, Wk("esref", 760, 980, { brow: "angry" }, 0.4, 2.4))), html: big("KAPIDA KİMSE AYAKTA KALMIYOR", "#FFFFFF", 70, 100) },
  { c: "İçeride uzun bir koridor", sfx: "drone", tone: "night", r: cam([1, 1.12], [960, 560], undefined, sc(koridor(0, 0), Wk("esref", 700, 960, { s: 0.75, y: 900 }, 0.2, 3))) },
  { c: "Duvarlarda eski tablolar", tone: "night", r: cam([2.2, 2.4], [300, 400], [420, 420], koridor(0, 0)) },
  { c: "En sonda bir kapı", tone: "night", r: cam([2.4, 2.6], [960, 570], undefined, koridor(0, 0)) },
  { c: "Eşref kapıyı itiyor", sfx: "knock", tone: "night", r: cam([2, 2.3], [960, 570], undefined, (t, a) => <Koridor t={t} door={ramp(t, a + 0.3, a + 1.4)} />) },
  { c: "İhtiyar, şöminenin önünde", tone: "night", r: cam([1.3, 1.4], [500, 640], undefined, sc(ihtSalon, F("ihtiyar", 560, { pose: P.sit, y: 900, dir: -1, eyes: "down" }))) },
  { c: "Elinde bir fincan kahve", sfx: "ding", tone: "night", r: cam([3, 3.2], [600, 640], undefined, sc(ihtSalon, F("ihtiyar", 560, { pose: P.sit, y: 900, dir: -1, eyes: "down", holdR: <Fincan x={0} y={0} s={0.8} /> }))) },
  { c: "Geleceğini biliyordum", tone: "night", r: cam([2.6, 2.8], face(560, 1.1, 0), undefined, sc(ihtSalon, F("ihtiyar", 560, { pose: P.sit, y: 900, dir: -1, talk: true, mouth: "smirk", eyes: "squint", holdR: <Fincan x={0} y={0} s={0.8} /> }))), html: q("“GELECEĞİNİ BİLİYORDUM, YETİM.”", 70) },
  { c: "Sen hep gelirsin", tone: "night", r: cam([1.4, 1.5], [960, 600], undefined, sc(ihtSalon, F("ihtiyar", 560, { pose: P.sit, y: 900, dir: -1, talk: true, holdR: <Fincan x={0} y={0} s={0.8} /> }), F("esref", 1300, { dir: -1, brow: "angry" }))), html: q("“AMA HİÇ ZAMANINDA GELMEZSİN.”", 70, 0.5) },
  { c: "Eşref silahını kaldırıyor", tone: "night", r: cam([2.2, 2.4], [1200, 600], undefined, sc(ihtSalon, F("esref", 1300, { dir: -1, pose: AIM, holdR: tab, brow: "angry", mouth: "tight" }))) },
  { c: "Tam o anda arkadan bir silah", sfx: "shot", tone: "night", r: cam([1.4, 1.5], [1300, 600], undefined, sc(ihtSalon, F("esref", 1300, { dir: -1, pose: AIM, holdR: tab, eyes: "wide", mouth: "o" }), muzzle(1840, 560, 0.15)), 6) },
  { c: "Eşref'in sırtına sıcak bir şey", tone: "night", r: cam([2.6, 2.8], face(1300), undefined, sc(ihtSalon, F("esref", 1300, { dir: -1, eyes: "wide", brow: "sad", mouth: "o" }))) },
  { c: "Dizlerinin üstüne düşüyor", sfx: "boom", tone: "night", r: cam([1.3, 1.4], [1200, 700], undefined, sc(ihtSalon, F("esrefKan", 1300, { dir: -1, pose: KNEEL, y: G + 50, eyes: "squint", brow: "sad", mouth: "tight" }))) },
  { c: "İhtiyar'ın adamı, gölgeden çıkıyor", tone: "night", r: cam([1.2, 1.3], [1500, 600], undefined, sc(ihtSalon, F("esrefKan", 1300, { dir: -1, pose: KNEEL, y: G + 50, eyes: "squint" }), Wk("adam", 1960, 1640, { dir: -1, pose: AIM, holdR: tab }))) },
  { c: "İhtiyar ayağa kalkıyor", tone: "night", r: cam([1.2, 1.3], [900, 600], undefined, sc(ihtSalon, F("ihtiyar", 560, { dir: 1, mouth: "smirk" }), F("esrefKan", 1300, { dir: -1, pose: KNEEL, y: G + 50, eyes: "squint" }))) },
  { c: "Eşref'in etrafında yavaşça", tone: "night", r: cam([1.2, 1.3], [1000, 600], undefined, sc(ihtSalon, Wk("ihtiyar", 600, 1080, { mouth: "smirk" }, 0.1, 3), F("esrefKan", 1300, { dir: -1, pose: KNEEL, y: G + 50, eyes: "squint" }))) },
  { c: "Kızımı benden aldın", tone: "night", r: cam([2.6, 2.8], face(1080), undefined, sc(ihtSalon, F("ihtiyar", 1080, { talk: true, brow: "angry" }))), html: q("“KIZIMI BENDEN ALDIN. TORUNUMU BENDEN ALDIN.”", 60) },
  { c: "Ama asıl aldığın şey", tone: "night", r: cam([2.8, 3], face(1080), undefined, sc(ihtSalon, F("ihtiyar", 1080, { talk: true, eyes: "squint", brow: "angry" }))), html: q("“ASIL ALDIĞIN ŞEY, BENİM YILLARIMDI.”", 66) },
  { c: "Eğiliyor", tone: "night", r: cam([1.8, 2], [1200, 560], undefined, sc(ihtSalon, F("ihtiyar", 1120, { pose: { l: [8, 6], r: [-8, -6], lean: 18 }, mouth: "smirk" }), F("esrefKan", 1300, { dir: -1, pose: KNEEL, y: G + 50, eyes: "squint" }))) },
  { c: "Şimdi sen burada öleceksin", tone: "night", r: cam([2.4, 2.6], [1200, 520], undefined, sc(ihtSalon, F("ihtiyar", 1120, { pose: { l: [8, 6], r: [-8, -6], lean: 18 }, talk: true, eyes: "squint" }), F("esrefKan", 1300, { dir: -1, pose: KNEEL, y: G + 50, eyes: "closed" }))), html: q("“ŞİMDİ SEN BURADA ÖLECEKSİN.”", 72) },
  { c: "Ve Nisan, babasız büyüyen", tone: "night", r: cam([2.6, 2.8], face(1120, 1.1, 20), undefined, sc(ihtSalon, F("ihtiyar", 1120, { pose: { l: [8, 6], r: [-8, -6], lean: 18 }, talk: true, mouth: "smirk" }))) },
  { c: "Eşref'in eli yerde, silahına", tone: "night", r: cam([2.8, 3], [1420, 980], undefined, sc(ihtSalon, F("esrefKan", 1300, { dir: -1, pose: { ...KNEEL, r: [30, 30] }, y: G + 50 }), (t, a) => <g transform={`translate(${1520 - ramp(t, a, a + 2) * 60},${G + 10})`}>{tab}</g>)) },
  { c: "Şarjörde tek bir kurşun var", sfx: "tick", tone: "night", r: cam([1, 1.06], [960, 540], undefined, (t) => <><rect width={1920} height={1080} fill="#14100C" /><g transform="translate(960,560) scale(3)"><rect x={-24} y={-80} width={48} height={160} rx={6} fill="#3A3D44" stroke="#1B1210" strokeWidth={4} /><path d="M-12,-74 h24 v30 q-12,-18 -24,0Z" fill="#C8A040" stroke="#1B1210" strokeWidth={3} /></g></>), html: big("SON KURŞUN.", "#FFC800", 110, 120) },
  { c: "Eşref son gücüyle dönüyor", sfx: "whoosh", tone: "night", r: cam([1.4, 1.5], [1100, 600], undefined, sc(ihtSalon, F("ihtiyar", 900, { eyes: "wide" }), F("esrefKan", 1300, { dir: -1, pose: { ...KNEEL, r: [84, 92] }, holdR: tab, y: G + 50, brow: "angry", mouth: "shout" }))) },
  { c: "Silah patlıyor", sfx: "shot", tone: "night", r: cam([1.6, 1.7], [1100, 600], undefined, sc(ihtSalon, F("ihtiyar", 900, { eyes: "wide", mouth: "o" }), F("esrefKan", 1300, { dir: -1, pose: { ...KNEEL, r: [84, 92] }, holdR: tab, y: G + 50, brow: "angry" }), muzzle(1170, 590, 0.1)), 6) },
  { c: "Önce adam düşüyor", tone: "night", r: cam([1.3, 1.4], [1600, 700], undefined, sc(ihtSalon, (t, a) => <g transform={`translate(1640,${G - 30}) rotate(${-90 * ramp(t, a, a + 0.5)},0,-20)`}><DFig x={0} y={0} s={1.1} o={CE.adam} t={t} eyes="closed" /></g>)) },
  { c: "Sonra İhtiyar'ın fincanı", sfx: "ding", tone: "night", r: cam([2.6, 2.8], [900, 960], undefined, sc(ihtSalon, (t, a) => <Fincan x={900} y={990} s={1.3} broken={ramp(t, a + 0.2, a + 0.6)} />)) },
  { c: "İhtiyar duvara yaslanıyor", tone: "night", r: cam([1.4, 1.5], [800, 600], undefined, sc(ihtSalon, F("ihtiyar", 800, { pose: { l: [60, 110], r: [-8, -6], lean: -10 }, eyes: "squint", brow: "sad", mouth: "open" }))) },
  { c: "Ve ölmeden önce gülüyor", sfx: "drone", tone: "night", r: cam([2.6, 2.8], face(800), undefined, sc(ihtSalon, F("ihtiyar", 800, { pose: { l: [60, 110], r: [-8, -6], lean: -10 }, eyes: "squint", mouth: "grin" }))) },
  { c: "Bitti mi sandın", tone: "night", r: cam([2.8, 3], face(800), undefined, sc(ihtSalon, F("ihtiyar", 800, { pose: { l: [60, 110], r: [-8, -6], lean: -10 }, eyes: "squint", talk: true }))), html: q("“BİTTİ Mİ SANDIN?”", 90) },
  { c: "Benim devletin içinde bir oğlum var", sfx: "boom", tone: "night", r: cam([3, 3.3], face(800), undefined, sc(ihtSalon, F("ihtiyar", 800, { eyes: "squint", talk: true, mouth: "smirk" }))), html: q("“DEVLETİN İÇİNDE BİR OĞLUM VAR.”", 72) },
  { c: "Bu gece senin kapını o çalacak", tone: "night", r: cam([1, 1.06], [960, 560], undefined, sc(kapiEv(0))), html: q("“BU GECE SENİN KAPINI O ÇALACAK.”", 70) },
  { c: "Sen evine yetişemezsin", tone: "night", r: cam([2.6, 2.8], face(800), undefined, sc(ihtSalon, F("ihtiyar", 800, { eyes: "squint", talk: true }))), html: q("“AMA O YETİŞECEK.”", 90, 0.5) },
  { c: "İhtiyar'ın gözleri kapanıyor", sfx: "drone", tone: "night", r: cam([2.6, 2.8], face(800), undefined, sc(ihtSalon, F("ihtiyar", 800, { eyes: "closed", mouth: "flat" }))) },
  { c: "Eşref, duvara tutunarak", tone: "night", r: cam([1.3, 1.4], [1300, 600], undefined, sc(ihtSalon, F("esrefKan", 1300, { dir: -1, pose: { l: [120, 150], r: [8, 6], lean: -8 }, eyes: "squint", brow: "sad", mouth: "tight" }))) },
  { c: "Kan kaybediyor", sfx: "heart", tone: "night", r: cam([2.6, 2.8], face(1300), undefined, sc(ihtSalon, F("esrefKan", 1300, { dir: -1, eyes: "squint", brow: "sad", mouth: "tight" }))) },
  { c: "Ama aklında tek bir şey var", tone: "warm", r: cam([1, 1.06], [960, 560], undefined, sc(cocukOda)), html: (t, a) => <><Txt t={t} at={a + 0.6} text="EV." y={200} size={110} /><Txt t={t} at={a + 1.3} text="NİSAN." y={360} size={110} color="#FF3E7F" /><Txt t={t} at={a + 2} text="RÜYA." y={520} size={110} color="#FFC800" /></> },
  { c: "Koridoru geri yürüyor", tone: "night", r: cam([1, 1.1], [960, 560], undefined, sc(koridor(1, 1), Wk("esrefKan", 960, 1300, { s: 0.85, y: 960, brow: "sad" }, 0.1, 3.4))) },
  { c: "Her adımda duvarda kanlı", tone: "night", r: cam([2.4, 2.6], [1450, 450], undefined, koridor(1, 1)) },
  { c: "Bahçeye çıkıyor", tone: "night", r: cam([1, 1.06], [960, 600], undefined, sc(kosk(1), (t) => <Fistik x={300} y={1000} s={0.8} t={t} lights={1} />, Wk("esrefKan", 1100, 560, { brow: "sad", eyes: "squint" }, 0.1, 3.4))) },
  { c: "Fıstık'ın kapısını zor açıyor", tone: "night", r: cam([1.8, 2], [400, 760], undefined, sc(kosk(1), (t, a) => <Fistik x={300} y={1000} s={0.8} t={t} lights={1} door={ramp(t, a + 0.4, a + 1.6)} />)) },
  { c: "Kontağı çeviriyor", sfx: "engine", tone: "night", r: cam([2.6, 2.8], [1000, 700], undefined, ic({ lean: 6, eyes: "squint", brow: "sad", mouth: "tight" }), 2) },
  { c: "Hadi, Fıstık", tone: "night", r: cam([2.6, 2.8], [1000, 430], undefined, ic({ lean: 8, eyes: "squint", talk: true, mouth: "smile" })), html: q("“HADİ FISTIK. BU GECE BENİ YARI YOLDA BIRAKMA.”", 60) },
  { c: "Fıstık karanlık yola çıkıyor", sfx: "engine", tone: "night", r: cam([1, 1.05], [960, 560], undefined, (t, a) => <><SahilYolu t={t} px={(t - a) * 800} /><Fistik x={900} y={1000} s={0.9} t={t} lights={1} roll={(t - a) * 1.8} /></>) },
  { c: "Eşref'in gözleri kararıyor", tone: "night", r: cam([2.4, 2.6], [1000, 560], undefined, (t, a) => <><g filter="url(#blurK)">{ic({ lean: 14, eyes: "squint", speed: 1 })(t, a, a)}</g><defs><filter id="blurK"><feGaussianBlur stdDeviation={2 + 6 * ramp(t, a, a + 3)} /></filter></defs><rect width={1920} height={1080} fill="#000" opacity={0.4 * ramp(t, a, a + 3)} /></>) },
  { c: "Yol çiziliyor, ikiye bölünüyor", tone: "night", r: cam([1, 1.05], [960, 560], undefined, (t, a) => <><g opacity={0.6}><SahilYolu t={t} px={(t - a) * 700} /></g><g opacity={0.4} transform={`translate(${30 + Math.sin(t * 3) * 20},0)`}><SahilYolu t={t} px={(t - a) * 700} /></g></>) },
  { c: "Ve sahil yoluna geldiğinde", tone: "night", r: cam([2, 2.2], [700, 800], undefined, ic({ lean: 20, eyes: "closed", speed: 0.4 })) },
  { c: "Fıstık yavaşlıyor", tone: "night", r: cam([1, 1.05], [960, 560], undefined, (t, a) => <><SahilYolu t={t} px={(1 - Math.pow(1 - ramp(t, a, a + 3), 2)) * 600} /><Fistik x={1000} y={1000} s={0.9} t={t} lights={1} tail={1} roll={ramp(t, a, a + 3)} /></>) },
  { c: "Ve yolun kenarında duruyor", sfx: "heart", tone: "night", r: cam([1, 1.1], [960, 560], undefined, yol({ carX: 1260 })) },
  { c: "Gerçek finalin bittiği yer burası", tone: "night", r: cam([1.2, 1.3], [1250, 820], undefined, yol({ carX: 1260 })), html: tg("GERÇEK FİNAL: BURADA BİTTİ", "#E63946") },
  { c: "Bizim finalimizin başladığı", sfx: "boom", tone: "gold", r: cam([1.3, 1.2], [1250, 820], undefined, yol({ carX: 1260 })), html: big("BİZİM FİNALİMİZ BURADA BAŞLIYOR", "#FFC800", 70, 110) },

  // ── 2. BÖLÜM: BİR SAAT ──
  { c: "İkinci bölüm. Bir saat", ...bolum("İKİNCİ BÖLÜM", "BİR SAAT") },
  { c: "Ev. Saat on bire çeyrek", tone: "warm", r: cam([1.6, 1.8], [1640, 320], undefined, salonEv), html: tg("22:45", "#1B4F9C") },
  { c: "Nisan, Rüya'yı beşiğine", tone: "warm", r: cam([1.1, 1.2], [1200, 600], undefined, sc(cocukOda, F("nisan", 1000, { mouth: "smile", eyes: "down" }))) },
  { c: "alçak sesle bir ninni", tone: "warm", r: cam([2.6, 2.8], face(1000), undefined, sc(cocukOda, F("nisan", 1000, { talk: true, eyes: "closed", mouth: "smile" }))) },
  { c: "Ama gözleri sürekli duvardaki", sfx: "tick", tone: "warm", r: cam([1.6, 1.8], [1640, 320], undefined, salonEv) },
  { c: "Salonda kimse konuşmuyor", tone: "night", r: cam([1, 1.06], [960, 600], undefined, sc(salonEv, F("gurdal", 380, { brow: "worried" }), F("faruk", 640, { pose: P.phone, holdR: <rect x={-14} y={-34} width={28} height={52} rx={6} fill="#1A1C22" /> }), F("muslum", 1180, { dir: -1 }), F("irmak", 1460, { dir: -1, brow: "worried" }))) },
  { c: "Müslüm çay dolduruyor", sfx: "ding", tone: "warm", r: cam([2, 2.2], [1180, 640], undefined, sc(salonEv, F("muslum", 1180, { dir: -1, pose: P.hold, holdR: <path d="M-12,0 L-9,-34 L9,-34 L12,0Z" fill="#C0392B" opacity={0.85} stroke="#1B1210" strokeWidth={3} />, eyes: "down" }))) },
  { c: "Irmak, pencereden bahçeye", tone: "night", r: cam([2, 2.2], [1460, 520], undefined, sc(salonEv, F("irmak", 1460, { dir: -1, look: -1, brow: "worried" }))) },
  { c: "Gürdal bir oturuyor, bir kalkıyor", tone: "night", r: cam([1.4, 1.5], [400, 620], undefined, sc(salonEv, Wk("gurdal", 200, 600, { brow: "angry" }, 0, 2.4))) },
  { c: "Faruk ise telefonu elinden", tone: "night", r: cam([2.4, 2.6], face(640), undefined, sc(salonEv, F("faruk", 640, { pose: P.phone, eyes: "down", brow: "worried", holdR: <rect x={-14} y={-34} width={28} height={52} rx={6} fill="#1A1C22" /> }))) },
  { c: "Bir saat doluyor", sfx: "tick", tone: "night", r: cam([1.6, 2], [1640, 320], undefined, salonGeç), html: big("23:50", "#E63946", 110, 110) },
  { c: "Eşref yok", sfx: "drone", tone: "night", r: cam([1, 1.06], [960, 560], undefined, kapiEv(0)), html: big("EŞREF YOK.", "#FFFFFF", 110, 110) },
  { c: "Nisan salona iniyor", tone: "night", r: cam([1, 1.06], [960, 600], undefined, sc(salonGeç, Wk("nisan", 1700, 1200, { brow: "worried" }), F("faruk", 640))) },
  { c: "Savcıyla bir saat konuşulmaz", tone: "night", r: cam([2.6, 2.8], face(1200), undefined, sc(salonGeç, F("nisan", 1200, { dir: -1, talk: true, brow: "angry" }))), html: q("“SAVCIYLA BİR SAAT KONUŞULMAZ. ARA ONU.”", 62) },
  { c: "Faruk Savcı Selma'yı arıyor", sfx: "buzz", tone: "night", r: cam([2.4, 2.6], face(640), undefined, sc(salonGeç, F("faruk", 640, { pose: P.phone, holdR: <rect x={-14} y={-34} width={28} height={52} rx={6} fill="#1A1C22" />, brow: "worried" }))) },
  { c: "Selma'nın sesi şaşkın", tone: "cool", r: cam([1.2, 1.3], [960, 600], undefined, sc((t) => <Konak t={t} room="salon" night={1} lamp={0.4} />, F("selma", 960, { pose: P.phone, holdR: <rect x={-14} y={-34} width={28} height={52} rx={6} fill="#1A1C22" />, eyes: "wide", talk: true }))), html: q("“BU GECE ONUNLA HİÇBİR GÖRÜŞMEMİZ YOKTU.”", 60) },
  { c: "Salonda buz gibi bir sessizlik", sfx: "drone", tone: "night", r: cam([1, 1.05], [960, 600], undefined, sc(salonGeç, F("gurdal", 380, { eyes: "wide" }), F("faruk", 640, { eyes: "down" }), F("nisan", 1200, { dir: -1, eyes: "wide" }), F("irmak", 1460, { dir: -1, eyes: "wide" }))) },
  { c: "Nisan, Faruk'a dönüyor", tone: "night", r: cam([2.6, 2.8], face(1200), undefined, sc(salonGeç, F("nisan", 1200, { dir: -1, talk: true, brow: "angry", tear: 0.4 }))), html: q("“NEREYE GİTTİ?”", 90) },
  { c: "Faruk başını öne eğiyor", tone: "night", r: cam([2.6, 2.8], face(640), undefined, sc(salonGeç, F("faruk", 640, { eyes: "down", brow: "sad", talk: true }))), html: q("“BİLMİYORUM. AMA BİR TAHMİNİM VAR.”", 62, 0.5) },
  { c: "Nisan'ın yüzü bembeyaz", sfx: "boom", tone: "night", r: cam([2.8, 3], face(1200), undefined, sc(salonGeç, F("nisan", 1200, { dir: -1, eyes: "wide", mouth: "o", brow: "worried" }))), html: big("“İHTİYAR.”", "#E63946", 130, 120) },
  { c: "Gürdal masaya yumruğunu", sfx: "boom", tone: "night", r: cam([2, 2.2], [400, 620], undefined, sc(salonGeç, F("gurdal", 400, { pose: P.kick, brow: "angry", mouth: "shout" })), 5) },
  { c: "Ben demedum mu", tone: "night", r: cam([2.6, 2.8], face(400, 1.1), undefined, sc(salonGeç, F("gurdal", 400, { brow: "angry", mouth: "shout" }))), html: q("“BEN DEMEDUM MU?”", 90) },
  { c: "Silahını belinden alıyor", tone: "night", r: cam([2, 2.2], [420, 700], undefined, sc(salonGeç, F("gurdal", 400, { pose: AIM, holdR: tab, brow: "angry" }))) },
  { c: "Ula hadi", tone: "night", r: cam([2.4, 2.6], face(400, 1.1), undefined, sc(salonGeç, F("gurdal", 400, { brow: "angry", mouth: "shout", pose: P.point }))), html: q("“ULA HADİ! NE DURUYORUZ?”", 80) },
  { c: "Tam kapıya yöneliyorlar", tone: "night", r: cam([1, 1.06], [960, 600], undefined, sc(salonGeç, Wk("gurdal", 400, 900), Wk("nisan", 1200, 1000, {}, 0.3, 2.2), Wk("faruk", 640, 760, {}, 0.5, 2))) },
  { c: "Kapı çalıyor", sfx: "doorbell", tone: "night", r: cam([2, 2.4], [960, 560], undefined, kapiEv(0), 2), html: big("KAPI ÇALIYOR", "#FFFFFF", 100, 110) },
  { c: "Kapıda takım elbiseli", tone: "night", r: cam([1, 1.08], [960, 600], undefined, sc(kapiEv(-1), (t, a) => <DFig x={960} y={900} s={1.1} o={CE.balikci} t={t} op={ramp(t, a + 0.8, a + 1.4)} mouth="smile" />)) },
  { c: "Balıkçı.", sfx: "ding", tone: "night", r: cam([2.6, 2.8], [960, 470], undefined, sc(kapiEv(1), (t) => <DFig x={960} y={900} s={1.1} o={CE.balikci} t={t} mouth="smile" />)), html: big("BALIKÇI", "#FFFFFF", 110, 110) },
  { c: "Eşref'le birlikte İhtiyar'ın peşine", tone: "night", r: cam([1.5, 1.6], [960, 560], undefined, sc(kapiEv(1), (t) => <DFig x={960} y={900} s={1.1} o={CE.balikci} t={t} mouth="flat" />)), html: tg("DEVLET ADAMI", "#1B4F9C") },
  { c: "Kötü haberlerim var", tone: "night", r: cam([2.6, 2.8], face(960, 1.1), undefined, sc(salonGeç, F("balikci", 960, { talk: true, brow: "worried" }))), html: q("“KÖTÜ HABERLERİM VAR.”", 80) },
  { c: "İhtiyar'ın köşkünde silah sesleri", tone: "night", r: cam([1, 1.06], [960, 560], undefined, kosk(1)), html: tg("SİLAH SESLERİ", "#E63946") },
  { c: "Ekiplerimi gönderdim", tone: "night", r: cam([1.3, 1.4], [960, 600], undefined, sc(salonGeç, F("nisan", 640, { eyes: "wide" }), F("balikci", 960, { talk: true, pose: P.hand }), F("gurdal", 1300, { dir: -1, brow: "worried" }))) },
  { c: "Ben de buradayım", tone: "night", r: cam([2.6, 2.8], face(960, 1.1), undefined, sc(salonGeç, F("balikci", 960, { talk: true, mouth: "smile" }))), html: q("“ÇOCUK GÜVENDE OLSUN.”", 80, 0.5) },
  { c: "Herkes rahat bir nefes alıyor", tone: "warm", r: cam([1, 1.06], [960, 600], undefined, sc(salonGeç, F("gurdal", 380, { mouth: "smile" }), F("faruk", 640, { mouth: "smile" }), F("balikci", 960), F("irmak", 1460, { dir: -1, mouth: "smile" }))) },
  { c: "Balıkçı salona geçiyor", tone: "warm", r: cam([1.2, 1.3], [960, 600], undefined, sc(salonGeç, Wk("balikci", 700, 1000), F("gurdal", 1300, { dir: -1, pose: P.reach, holdR: <path d="M-12,0 L-9,-34 L9,-34 L12,0Z" fill="#C0392B" opacity={0.85} stroke="#1B1210" strokeWidth={3} /> }))) },
  { c: "Sonra Nisan'a dönüyor", tone: "night", r: cam([2.6, 2.8], face(1000, 1.1), undefined, sc(salonGeç, F("balikci", 1000, { talk: true, mouth: "smile", eyes: "squint" }))), html: q("“BİR BELGE, BİR ZARF, BİR FLAŞ BELLEK?”", 62) },
  { c: "Eşref gitmeden önce size", tone: "night", r: cam([1.3, 1.4], [1300, 700], undefined, (t) => <><Konak t={t} room="oda" lamp={0.6} /><Besik x={1360} y={900} s={1} t={t} rock={1} /><rect width={1920} height={1080} fill="#0A1020" opacity={0.35} /></>), html: q("“EŞREF GİTMEDEN ÖNCE SİZE BİR ŞEY BIRAKTI MI?”", 58) },
  { c: "Nisan başını sallıyor", tone: "night", r: cam([2.6, 2.8], face(640), undefined, sc(salonGeç, F("nisan", 640, { talk: true, brow: "worried" }))), html: q("“HAYIR. NEDEN SORDUNUZ?”", 76) },
  { c: "Balıkçı gülümsüyor", tone: "night", r: cam([2.8, 3], face(1000, 1.1), undefined, sc(salonGeç, F("balikci", 1000, { mouth: "smirk", eyes: "squint" }))), html: q("“HİÇ. İŞİMİZİ KOLAYLAŞTIRIRDI.”", 72) },
  { c: "Ama Nisan, Balıkçı'nın gözlerinin", tone: "night", r: cam([3, 3.2], face(1000, 1.1, 0), undefined, sc(salonGeç, F("balikci", 1000, { look: -1, lookY: -1, eyes: "squint" }))) },
  { c: "Rüya'nın odasına kaydığını", sfx: "tick", tone: "night", r: cam([1.1, 1.2], [1300, 560], undefined, cocukOda) },
  { c: "Sadece bir an", tone: "night", r: cam([2.8, 3], face(640), undefined, sc(salonGeç, F("nisan", 640, { eyes: "wide", brow: "worried" }))) },
  { c: "Nisan, babasını hatırlıyor", sfx: "static", tone: "cool", r: cam([2.4, 2.6], face(800), undefined, sc(ihtSalon, F("ihtiyar", 800, { mouth: "smile", eyes: "squint" }))) },
  { c: "Onun da gülümsemesi böyleydi", tone: "cool", r: cam([2.6, 2.8], face(800), undefined, sc(ihtSalon, F("ihtiyar", 800, { mouth: "smirk", eyes: "squint" }))), html: (t, a) => <><Txt t={t} at={a + 1} text="SAKİN." y={200} size={100} /><Txt t={t} at={a + 1.8} text="KİBAR." y={340} size={100} /><Txt t={t} at={a + 2.6} text="VE ÇOK SOĞUK." y={480} size={100} color="#9FD0EC" /></> },
  { c: "Nisan ceketini alıyor", tone: "night", r: cam([1.2, 1.3], [700, 600], undefined, sc(salonGeç, F("nisanPalto", 640, { brow: "angry", mouth: "tight" }))) },
  { c: "Ben gidiyorum", tone: "night", r: cam([2.6, 2.8], face(640), undefined, sc(salonGeç, F("nisanPalto", 640, { talk: true, brow: "angry" }))), html: q("“BEN GİDİYORUM. GÜRDAL, BENİMLE GEL.”", 64) },
  { c: "Sonra Irmak'a sarılıyor", tone: "night", r: cam([1.8, 2], [1300, 560], undefined, sc(salonGeç, F("nisanPalto", 1220, { pose: HUG, eyes: "closed" }), F("irmak", 1400, { dir: -1, pose: HUG, eyes: "wide" }))) },
  { c: "Rüya'yı kimseye bırakma", sfx: "drone", tone: "night", r: cam([2.6, 2.8], [1300, 520], undefined, sc(salonGeç, F("nisanPalto", 1220, { pose: HUG, eyes: "squint", talk: true }), F("irmak", 1400, { dir: -1, pose: HUG, eyes: "wide" }))), html: q("“RÜYA'YI KİMSEYE BIRAKMA. KİMSEYE.”", 66) },

  // ── 3. BÖLÜM: KARDEŞ ──
  { c: "Üçüncü bölüm. Kardeş", ...bolum("ÜÇÜNCÜ BÖLÜM", "KARDEŞ") },
  { c: "Sahil yolu. Fıstık", tone: "night", r: cam([1, 1.08], [960, 560], undefined, yol({ carX: 1260 })) },
  { c: "Eşref'in başı direksiyonun", tone: "night", r: cam([1.2, 1.3], [900, 600], undefined, ic({ lean: 28, eyes: "closed" })) },
  { c: "Nefesi gittikçe yavaşlıyor", sfx: "heart", tone: "night", r: cam([2.6, 2.8], [1000, 460], undefined, ic({ lean: 28, eyes: "closed" })) },
  { c: "Uzaktan farlar yaklaşıyor", tone: "night", r: cam([1, 1.06], [960, 560], undefined, (t, a) => <><SahilYolu t={t} /><Fistik x={1260} y={1000} s={0.9} t={t} lights={1} tail={1} /><g opacity={ramp(t, a, a + 2)}><circle cx={80} cy={860} r={30 + ramp(t, a, a + 3) * 40} fill="#FFF3C0" /><circle cx={80} cy={860} r={160} fill="#FFF3C0" opacity={0.2} /></g></>) },
  { c: "Siyah bir araba, Fıstık'ın arkasında", sfx: "engine", tone: "night", r: cam([1, 1.05], [960, 560], undefined, (t, a) => <><SahilYolu t={t} /><Fistik x={1260} y={1000} s={0.9} t={t} lights={1} tail={1} /><g transform={`translate(${lerp(-400, 300, ramp(t, a, a + 2.4))},1000) scale(0.9)`}><Fistik x={0} y={0} t={t} lights={1} roll={ramp(t, a, a + 2.4)} /><rect x={-440} y={-300} width={900} height={270} fill="#141518" opacity={0.85} /></g></>) },
  { c: "Kapı açılıyor", tone: "night", r: cam([1.2, 1.3], [500, 640], undefined, sc(yol({ carX: 1400 }), Wk("kadir", 200, 560, { brow: "angry" }))) },
  { c: "Arabadan inen adam Kadir", sfx: "boom", tone: "night", r: cam([2.6, 2.8], face(560), undefined, sc(yol({ carX: 1400 }), F("kadir", 560, { brow: "angry", mouth: "tight" }))), html: big("KADİR YANIK", "#FFFFFF", 110, 110) },
  { c: "Bir zamanlar Eşref'in kardeşi", tone: "gold", r: cam([1.3, 1.4], [960, 700], undefined, sc(yetim, F("esrefCocuk", 820, { s: 0.7, mouth: "grin" }), F("esrefCocuk", 1080, { s: 0.7, dir: -1, mouth: "grin" }))), html: tg("KARDEŞİ", "#3FAE6A") },
  { c: "Şimdi en büyük düşmanı", tone: "night", r: cam([2.6, 2.8], face(560), undefined, sc(yol({ carX: 1400 }), F("kadir", 560, { brow: "angry", eyes: "squint" }))), html: tg("EN BÜYÜK DÜŞMANI", "#E63946") },
  { c: "Kadir, Fıstık'ın camından", tone: "night", r: cam([1.6, 1.8], [1100, 640], undefined, sc(yol({ carX: 1400 }), F("kadir", 1000, { pose: { l: [8, 6], r: [-8, -6], lean: 12 }, eyes: "wide" }))) },
  { c: "Kanı görüyor", tone: "night", r: cam([2.4, 2.6], [1000, 760], undefined, ic({ lean: 28, eyes: "closed" })) },
  { c: "Kenan arkadan sesleniyor", tone: "night", r: cam([1.3, 1.4], [700, 600], undefined, sc(yol({ carX: 1400 }), F("kenan", 420, { talk: true, brow: "angry" }), F("kadir", 900, { dir: -1 }))) },
  { c: "Abi, bırak", tone: "night", r: cam([2.6, 2.8], face(420, 1.1), undefined, sc(yol({ carX: 1400 }), F("kenan", 420, { talk: true, brow: "angry" }))), html: q("“ABİ, BIRAK. YILLARDIR BEKLEDİĞİN AN BU.”", 62) },
  { c: "Kadir bir an duruyor", tone: "night", r: cam([2.8, 3], face(900), undefined, sc(yol({ carX: 1400 }), F("kadir", 900, { eyes: "down", brow: "sad" }))) },
  { c: "Aklına çocukluk geliyor", sfx: "static", tone: "gold", r: cam([1, 1.08], [960, 560], undefined, yetim), html: tg("YETİMLER", "#C89A5A") },
  { c: "Yetimler'in soğuk koğuşu", tone: "cool", r: cam([1.2, 1.3], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#4A4E52" /><rect width={1920} height={1080} fill="url(#tBrick)" />{[300, 900, 1500].map((x) => <g key={x}><rect x={x - 220} y={700} width={440} height={60} fill="#6A6A5A" stroke="#1B1210" strokeWidth={5} /><path d={`M${x - 210},760 V900 M${x + 210},760 V900`} stroke="#3A3E44" strokeWidth={12} /></g>)}<rect width={1920} height={1080} fill="#C89A5A" opacity={0.18} /></>) },
  { c: "Tek bir battaniyenin altında", tone: "gold", r: cam([1.8, 2], [900, 640], undefined, (t) => <><rect width={1920} height={1080} fill="#4A4E52" /><rect x={680} y={700} width={440} height={60} fill="#6A6A5A" stroke="#1B1210" strokeWidth={5} /><DFig x={820} y={760} s={0.55} o={CE.esrefCocuk} t={t} eyes="closed" seed={1} /><DFig x={980} y={760} s={0.55} o={CE.esrefCocuk} t={t} eyes="closed" dir={-1} seed={2} /><path d="M700,620 Q900,540 1100,620 L1110,720 L690,720Z" fill="#7A6A4A" stroke="#1B1210" strokeWidth={5} /><rect width={1920} height={1080} fill="#C89A5A" opacity={0.2} /></>) },
  { c: "Yakup Karaşan'ın sesi", tone: "gold", r: cam([2.4, 2.6], face(960), undefined, sc(yetim, F("yakup", 960, { talk: true, mouth: "smile" }))), html: q("“SİZ KARDEŞSİNİZ. KAN DEĞİL, YEMİN KARDEŞİ.”", 60) },
  { c: "Kadir kapıyı açıyor", tone: "night", r: cam([1.4, 1.5], [1100, 640], undefined, sc(yol({ carX: 1400 }), F("kadir", 1000, { pose: P.reach, brow: "worried" }))) },
  { c: "Ama Kenan bir adım öne", tone: "night", r: cam([1.2, 1.3], [800, 600], undefined, sc(yol({ carX: 1400 }), Wk("kenan", 300, 620, { pose: AIM, holdR: tab, brow: "angry" }, 0.1, 1.8), F("kadir", 1000, { dir: -1, eyes: "wide" }))) },
  { c: "Sen yapamıyorsan, ben yaparım", tone: "night", r: cam([2.6, 2.8], face(620, 1.1), undefined, sc(yol({ carX: 1400 }), F("kenan", 620, { pose: AIM, holdR: tab, talk: true, brow: "angry" }))), html: q("“SEN YAPAMIYORSAN, BEN YAPARIM ABİ.”", 64) },
  { c: "Silahı Eşref'in başına", sfx: "tick", tone: "night", r: cam([1.6, 1.8], [900, 600], undefined, sc(yol({ carX: 1400 }), F("kenan", 760, { pose: AIM, holdR: tab, brow: "angry" }))) },
  { c: "Kadir'in eli, Kenan'ın bileğini", sfx: "whoosh", tone: "night", r: cam([2, 2.2], [880, 560], undefined, sc(yol({ carX: 1400 }), F("kenan", 760, { pose: { l: [8, 6], r: [150, 160] }, holdR: tab, eyes: "wide" }), F("kadir", 960, { dir: -1, pose: { l: [8, 6], r: [140, 150] }, brow: "angry" })), 3) },
  { c: "Silah yere düşüyor", sfx: "ding", tone: "night", r: cam([2.4, 2.6], [860, 980], undefined, sc(yol({ carX: 1400 }), (t, a) => <g transform={`translate(860,${lerp(700, 1000, ramp(t, a, a + 0.4))}) rotate(${ramp(t, a, a + 0.4) * 140})`}>{tab}</g>)) },
  { c: "Kadir, Kenan'ı arabanın kaputuna", sfx: "boom", tone: "night", r: cam([1.4, 1.5], [1100, 640], undefined, sc(yol({ carX: 1400 }), F("kenan", 1180, { pose: { l: [60, 90], r: [60, 90], lean: -24 }, eyes: "wide", mouth: "o" }), F("kadir", 980, { pose: P.reach, brow: "angry", mouth: "shout" })), 4) },
  { c: "Bu adamı öldürecek biri varsa", tone: "night", r: cam([2.6, 2.8], face(980), undefined, sc(yol({ carX: 1400 }), F("kadir", 980, { talk: true, brow: "angry" }))), html: q("“BU ADAMI ÖLDÜRECEK BİRİ VARSA, O BENİM.”", 62) },
  { c: "Başkası değil. Ölüm bile değil", sfx: "drone", tone: "night", r: cam([3, 3.2], face(980), undefined, sc(yol({ carX: 1400 }), F("kadir", 980, { talk: true, eyes: "squint", brow: "angry" }))), html: q("“ÖLÜM BİLE DEĞİL.”", 96) },
  { c: "Kenan geri çekiliyor", tone: "night", r: cam([1.2, 1.3], [800, 600], undefined, sc(yol({ carX: 1400 }), Wk("kenan", 1100, 400, { eyes: "down" }, 0.1, 2.4))) },
  { c: "Kadir ceketini çıkarıyor", tone: "night", r: cam([2, 2.2], face(980, 1.1, 0), undefined, sc(yol({ carX: 1400 }), F("kadir", 980, { pose: P.hold, holdR: <rect x={-60} y={-40} width={120} height={90} rx={10} fill="#262A34" stroke="#1B1210" strokeWidth={4} />, brow: "worried" }))) },
  { c: "Eşref'in yarasına bastırıyor", sfx: "heart", tone: "night", r: cam([1.4, 1.5], [960, 640], undefined, (t) => <FistikIc t={t} who={<><DFig x={1040} y={1560} s={2.2} o={CE.esrefKan} t={t} dir={-1} pose={SLUMP} eyes="closed" brow="sad" seed={5} /><DFig x={1700} y={1700} s={2.4} o={CE.kadir} t={t} dir={-1} pose={PRESS} brow="worried" mouth="tight" seed={6} /></>} />) },
  { c: "Ambulans çağır", tone: "night", r: cam([2.6, 2.8], face(980), undefined, sc(yol({ carX: 1400 }), F("kadir", 980, { mouth: "shout", brow: "angry", dir: -1 }))), html: q("“AMBULANS ÇAĞIR! HEMEN!”", 84) },
  { c: "Eşref gözlerini aralıyor", tone: "night", r: cam([2.6, 2.8], [1000, 430], undefined, ic({ lean: 22, eyes: "squint" })) },
  { c: "Karşısında Kadir'i görüyor", tone: "night", r: cam([2.4, 2.6], [1000, 430], undefined, ic({ lean: 20, eyes: "open", brow: "sad" })) },
  { c: "Ve gülümsüyor", tone: "warm", r: cam([2.8, 3], [1000, 430], undefined, ic({ lean: 20, eyes: "squint", mouth: "smile" })) },
  { c: "Geç kaldın, kardeşim", tone: "warm", r: cam([2.8, 3], [1000, 430], undefined, ic({ lean: 20, eyes: "squint", mouth: "smile", talk: true })), html: q("“GEÇ KALDIN, KARDEŞİM.”", 86) },
  { c: "Kadir'in sesi titriyor", tone: "warm", r: cam([2.8, 3], face(980), undefined, sc(yol({ carX: 1400 }), F("kadir", 980, { talk: true, eyes: "sad", tear: 0.6 }))), html: q("“SEN HEP ERKEN GİDERSİN ZATEN.”", 72) },
  { c: "Tam o anda bir araba fren", sfx: "whoosh", tone: "night", r: cam([1, 1.06], [960, 560], undefined, (t, a) => <><SahilYolu t={t} /><Fistik x={1400} y={1000} s={0.9} t={t} lights={1} tail={1} /><g transform={`translate(${lerp(-500, 260, Math.min(1, ramp(t, a, a + 1) * 1.1))},1000) scale(0.85)`}><Fistik x={0} y={0} t={t} lights={1} roll={ramp(t, a, a + 1)} /><rect x={-440} y={-300} width={900} height={270} fill="#E8E4DC" opacity={0.85} /></g></>) },
  { c: "Nisan, Gürdal ve Faruk", tone: "night", r: cam([1, 1.06], [960, 600], undefined, sc(yol({ carX: 1500 }), Run("nisanPalto", 100, 700, { brow: "worried" }), Run("gurdal", -100, 420, { brow: "angry" }, 0.3, 1.8), Run("faruk", -300, 200, {}, 0.5, 2))) },
  { c: "Nisan koşuyor", tone: "night", r: cam([1.3, 1.4], [700, 600], undefined, sc(yol({ carX: 1500 }), Run("nisanPalto", 300, 900, { brow: "worried", mouth: "open" }))) },
  { c: "Ama Kadir'i, elleri kan içinde", tone: "night", r: cam([1.3, 1.4], [1100, 600], undefined, sc(yol({ carX: 1500 }), F("nisanPalto", 820, { eyes: "wide", mouth: "o" }), F("kadir", 1240, { dir: -1, pose: P.hold, eyes: "wide" }))) },
  { c: "Gürdal silahını Kadir'e", tone: "night", r: cam([1.3, 1.4], [900, 600], undefined, sc(yol({ carX: 1500 }), F("gurdal", 600, { pose: AIM, holdR: tab, brow: "angry", mouth: "shout" }), F("kadir", 1240, { dir: -1, pose: P.hold }))) },
  { c: "Çekil ondan", tone: "night", r: cam([2.6, 2.8], face(600, 1.1), undefined, sc(yol({ carX: 1500 }), F("gurdal", 600, { pose: AIM, holdR: tab, brow: "angry", mouth: "shout" }))), html: q("“ÇEKİL ONDAN! ÇEKİL YOKSA VURURUM!”", 66) },
  { c: "Kadir ellerini kaldırmıyor bile", tone: "night", r: cam([2.6, 2.8], face(1240), undefined, sc(yol({ carX: 1500 }), F("kadir", 1240, { dir: -1, eyes: "squint", talk: true }))), html: q("“VUR O ZAMAN. AMA ÖNCE ŞU YARAYA BASTIR.”", 60) },
  { c: "Eşref zor bir sesle konuşuyor", tone: "night", r: cam([2.6, 2.8], [1000, 430], undefined, ic({ lean: 20, eyes: "squint", talk: true })), html: q("“GÜRDAL. İNDİR ONU. KARDEŞİME SİLAH ÇEKİLMEZ.”", 58) },
  { c: "Gürdal'ın elindeki silah yavaşça", tone: "night", r: cam([2, 2.2], [640, 640], undefined, sc(yol({ carX: 1500 }), (t, a) => <DFig x={600} y={G} s={1.1} o={CE.gurdal} t={t} pose={{ l: [8, 6], r: [lerp(84, 20, ramp(t, a, a + 2)), lerp(92, 20, ramp(t, a, a + 2))] }} holdR={tab} eyes="sad" />)) },
  { c: "Nisan, Eşref'in yanına diz", tone: "night", r: cam([1.4, 1.5], [1100, 700], undefined, sc(yol({ carX: 1500 }), F("nisanPalto", 1060, { pose: KNEEL, y: G + 40, tear: 1, eyes: "sad" }))) },
  { c: "Yüzünü ellerinin arasına", tone: "night", r: cam([1.3, 1.4], [960, 600], undefined, (t) => <FistikIc t={t} who={<><DFig x={1040} y={1560} s={2.2} o={CE.esrefKan} t={t} dir={-1} pose={SLUMP} eyes="squint" brow="sad" seed={5} /><DFig x={1640} y={1640} s={2.3} o={CE.nisanPalto} t={t} dir={-1} pose={HUG} tear={1} eyes="sad" brow="sad" seed={6} /></>} />) },
  { c: "Bir saat demiştin. Bir saat", tone: "night", r: cam([2.2, 2.4], [1600, 760], undefined, (t) => <FistikIc t={t} who={<DFig x={1640} y={1640} s={2.3} o={CE.nisanPalto} t={t} dir={-1} pose={HUG} tear={1} eyes="sad" brow="sad" talk seed={6} />} />), html: q("“BİR SAAT DEMİŞTİN. BİR SAAT.”", 76) },
  { c: "Eşref fısıldıyor", tone: "night", r: cam([2.6, 2.8], [1000, 430], undefined, ic({ lean: 22, eyes: "squint", talk: true })), html: q("“TORPİDO. RÜYA İÇİN.”", 90) },
  { c: "Nisan torpidoyu açıyor", sfx: "tick", tone: "night", r: cam([2.4, 2.6], [1180, 930], undefined, ic({ lean: 22, glove: 1 })) },
  { c: "İçinde küçük bir flaş bellek", sfx: "ding", tone: "gold", r: cam([1, 1.1], [960, 540], undefined, (t) => <><rect width={1920} height={1080} fill="#14100C" /><FlasBellek x={960} y={540} s={2.6} glow={1} /></>) },
  { c: "Üstünde Eşref'in el yazısıyla", tone: "gold", r: cam([1.5, 1.7], [860, 540], undefined, (t) => <><rect width={1920} height={1080} fill="#14100C" /><FlasBellek x={960} y={540} s={2.6} glow={1} /></>), html: big("“RÜYA'YA”", "#FFC800", 110, 120) },
  { c: "Ambulans geliyor", sfx: "siren", tone: "night", siren: true, r: cam([1, 1.05], [960, 560], undefined, (t, a) => <><SahilYolu t={t} /><Fistik x={1500} y={1000} s={0.8} t={t} lights={1} tail={1} /><Ambulans x={lerp(-500, 520, ramp(t, a, a + 2.2))} y={1000} s={0.85} t={t} roll={ramp(t, a, a + 2.2)} /></>) },
  { c: "Eşref'i sedyeye koyuyorlar", tone: "night", siren: true, r: cam([1.1, 1.2], [960, 600], undefined, sc(yol({ carX: 1500 }), (t) => <g transform="translate(960,860)"><rect x={-300} y={-20} width={600} height={40} rx={10} fill="#F4F6F6" stroke="#1B1210" strokeWidth={5} /><g transform="translate(-60,-10) rotate(-90)"><DFig x={0} y={0} s={0.8} o={CE.esrefKan} t={t} eyes="closed" /></g></g>, F("doktor", 500), F("doktor", 1420, { dir: -1 }), F("nisanPalto", 1700, { dir: -1, tear: 1, eyes: "sad" }))) },
  { c: "Nisan ambulansa biniyor", tone: "cool", r: cam([1, 1.06], [960, 560], undefined, sc(amb, F("nisanPalto", 1500, { dir: -1, pose: P.sit, y: 960, eyes: "sad", tear: 0.8 }))) },
  { c: "Faruk'un bilgisayarı yanında", tone: "cool", r: cam([1.2, 1.3], [1200, 600], undefined, sc(amb, F("nisanPalto", 1500, { dir: -1, pose: P.sit, y: 960 }), F("faruk", 1100, { pose: P.hold, holdR: <rect x={-80} y={-50} width={160} height={100} rx={8} fill="#2A2E36" stroke="#1B1210" strokeWidth={4} /> }))) },
  { c: "Flaş belleği takıyor", sfx: "tick", tone: "cool", r: cam([1, 1.1], [960, 540], undefined, (t, a) => <><rect width={1920} height={1080} fill="#0E1626" /><path d="M300,700 L1620,700 L1720,800 L200,800Z" fill="#9AA0A8" stroke="#1B1210" strokeWidth={6} /><rect x={1400} y={710} width={60} height={30} fill="#1B1210" /><FlasBellek x={lerp(1800, 1530, ramp(t, a + 0.2, a + 1))} y={725} s={0.8} rot={180} label={false} /></>) },
  { c: "İçinde iki dosya var", tone: "cool", r: cam([1, 1.06], [960, 540], undefined, (t, a) => <><rect width={1920} height={1080} fill="#1E2A3A" />{[0, 1].map((i) => <g key={i} transform={`translate(${700 + i * 520},540)`} opacity={ramp(t, a + 0.3 + i * 0.5, a + 0.8 + i * 0.5)}><path d="M-110,-130 h140 l80,70 v190 h-220Z" fill={i ? "#F4F6F8" : "#E0393E"} stroke="#1B1210" strokeWidth={6} /><text x={0} y={190} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={40} fill="#FFFFFF">{i ? "liste.pdf" : "Rüya.mp4"}</text>{!i && <path d="M-30,-40 L40,0 L-30,40Z" fill="#FFF" />}</g>)}</>) },
  { c: "Birincisi bir video", tone: "cool", r: cam([1, 1.08], [960, 520], undefined, laptop("video")) },
  { c: "Bu sabah çekilmiş", tone: "cool", r: cam([1.3, 1.4], [960, 460], undefined, laptop("video")), html: tg("BU SABAH · 07:42", "#E63946") },
  { c: "Bunu izliyorsan, ben gelmemişim", tone: "warm", r: cam([1.8, 2], [960, 420], undefined, laptop("video", { talk: true })), html: q("“BUNU İZLİYORSAN, BEN GELMEMİŞİM DEMEKTİR.”", 58) },
  { c: "Rüyam, sana bir saat dedim", tone: "warm", r: cam([2, 2.2], [960, 400], undefined, laptop("video", { talk: true })), html: q("“SANA BİR SAAT DEDİM. YALAN SÖYLEDİM.”", 64) },
  { c: "Çünkü doğruyu söyleseydim", tone: "warm", r: cam([2.6, 2.8], face(1500), undefined, sc(amb, F("nisanPalto", 1500, { dir: -1, eyes: "sad", tear: 1, brow: "sad" }))), html: q("“DOĞRUYU SÖYLESEYDİM, BENİ BIRAKMAZDIN.”", 60) },
  { c: "Kızımıza beni anlat", tone: "warm", r: cam([2, 2.2], [960, 400], undefined, laptop("video", { talk: true })), html: q("“KIZIMIZA BENİ ANLAT.”", 80) },
  { c: "Ama kötü yanımı değil", tone: "gold", r: cam([2.2, 2.4], [960, 400], undefined, laptop("video", { talk: true })), html: q("“SENİ BULDUĞUM GÜNÜ ANLAT.”", 80, 0.5) },
  { c: "Nisan ağlıyor", tone: "warm", r: cam([2.8, 3], face(1500), undefined, sc(amb, F("nisanPalto", 1500, { dir: -1, eyes: "closed", tear: 1, brow: "sad", mouth: "frown" }))) },
  { c: "Ama Faruk ikinci dosyayı açınca", sfx: "drone", tone: "night", r: cam([1, 1.06], [960, 540], undefined, laptop("liste")) },
  { c: "İkinci dosya bir liste", tone: "night", r: cam([1.2, 1.3], [960, 500], undefined, laptop("liste", { scroll: 0 })), html: tg("İHTİYAR'IN DEVLETTEKİ ADAMLARI", "#E63946") },
  { c: "İsimler, fotoğraflar, hesaplar", sfx: "tick", tone: "night", r: cam([1.5, 1.6], [1200, 500], undefined, laptop("liste")) },
  { c: "Ve listenin en üstünde", sfx: "boom", tone: "night", r: cam([2, 2.4], [760, 330], undefined, laptop("liste", { hl: true })) },
  { c: "Balıkçı.", sfx: "boom", tone: "night", r: cam([2.6, 2.8], [600, 330], undefined, laptop("liste", { hl: true })), html: big("BALIKÇI.", "#E63946", 130, 110) },
  { c: "İhtiyar'ın \"devletteki oğlu\"", tone: "night", r: cam([2.6, 2.8], face(1000, 1.1), undefined, sc(salonGeç, F("balikci", 1000, { mouth: "smirk", eyes: "squint" }))), html: tg("DEVLETTEKİ OĞUL", "#E63946") },
  { c: "Rüya'nın odasının bir kat altında", sfx: "drone", tone: "night", r: cam([1.1, 1.2], [1300, 600], undefined, cocukOda), html: big("BİR KAT ALTINDA.", "#FFFFFF", 90, 110) },

  // ── 4. BÖLÜM: İKİ CEPHE ──
  { c: "Dördüncü bölüm. İki cephe", ...bolum("DÖRDÜNCÜ BÖLÜM", "İKİ CEPHE") },
  { c: "Ev. Balıkçı, salonda telefonla", tone: "night", r: cam([1.2, 1.3], [1000, 600], undefined, sc(salonGeç, F("balikci", 1000, { pose: P.phone, holdR: <rect x={-14} y={-34} width={28} height={52} rx={6} fill="#1A1C22" />, eyes: "squint" }))) },
  { c: "Kısa, sakin cümleler", tone: "night", r: cam([2.6, 2.8], face(1000, 1.1), undefined, sc(salonGeç, F("balikci", 1000, { pose: P.phone, holdR: <rect x={-14} y={-34} width={28} height={52} rx={6} fill="#1A1C22" />, talk: true, eyes: "squint" }))), html: q("“EVET. ÇOCUK BURADA. YARIM SAAT İÇİNDE.”", 60) },
  { c: "Telefonu kapatıyor ve merdivene", sfx: "drone", tone: "night", r: cam([1, 1.06], [960, 600], undefined, sc(salonGeç, Wk("balikci", 1000, 1700, {}, 0.3, 3.2))) },
  { c: "Irmak, Rüya'nın odasının kapısında", tone: "night", r: cam([1.2, 1.3], [900, 600], undefined, sc(kapiEv(0), F("irmak", 960, { brow: "worried" }))) },
  { c: "Bir şey mi lazım", tone: "night", r: cam([2.6, 2.8], face(960), undefined, sc(kapiEv(0), F("irmak", 960, { talk: true, brow: "worried" }))), html: q("“BİR ŞEY Mİ LAZIM?”", 84) },
  { c: "Balıkçı gülümsüyor. \"Çocuğu", tone: "night", r: cam([2.6, 2.8], face(1300, 1.1), undefined, sc(kapiEv(0), F("balikci", 1300, { dir: -1, talk: true, mouth: "smile", eyes: "squint" }))), html: q("“ÇOCUĞU BİR KONTROL EDEYİM DEDİM.”", 66) },
  { c: "Irmak kapıdan çekilmiyor", tone: "night", r: cam([1.3, 1.4], [1120, 600], undefined, sc(kapiEv(0), F("irmak", 960, { pose: P.hips, brow: "angry" }), F("balikci", 1300, { dir: -1, mouth: "flat" }))), html: q("“UYUYOR. UYANDIRMAYALIM.”", 76, 0.5) },
  { c: "Irmak'ın cebinde telefon titriyor", sfx: "buzz", tone: "night", r: cam([2.6, 2.8], [960, 860], undefined, sc(kapiEv(0), F("irmak", 960, { eyes: "down" }))) },
  { c: "Gürdal'dan mesaj", tone: "night", r: telKart([{ who: "Gürdal", text: "Balıkçı hain. Kaç!" }], "00:21") },
  { c: "Irmak bir an Balıkçı'ya bakıyor", tone: "night", r: cam([1.4, 1.5], [1120, 560], undefined, sc(kapiEv(0), F("irmak", 960, { eyes: "wide", look: 1 }), F("balikci", 1300, { dir: -1, eyes: "squint", mouth: "tight" }))) },
  { c: "İkisi de anlıyor", sfx: "drone", tone: "night", r: cam([2.8, 3], face(1300, 1.1), undefined, sc(kapiEv(0), F("balikci", 1300, { dir: -1, eyes: "squint", brow: "angry", mouth: "tight" }))) },
  { c: "Balıkçı silahına uzanıyor", tone: "night", r: cam([1.6, 1.7], [1250, 620], undefined, sc(kapiEv(0), F("balikci", 1300, { dir: -1, pose: AIM, holdR: tab, brow: "angry" }))) },
  { c: "Ama arkadan bir sandalye", sfx: "boom", tone: "night", r: cam([1.3, 1.4], [1300, 600], undefined, sc(kapiEv(0), F("balikci", 1300, { dir: -1, pose: { l: [60, 90], r: [60, 90], lean: 20 }, eyes: "closed", mouth: "o" }), F("muslum", 1620, { dir: -1, pose: { l: [160, 170], r: [160, 170] }, brow: "angry", mouth: "shout", holdR: <g><rect x={-60} y={-90} width={120} height={14} fill="#7A5A3A" stroke="#1B1210" strokeWidth={3} /><path d="M-50,-76 V20 M50,-76 V20" stroke="#7A5A3A" strokeWidth={10} /></g> })), 5) },
  { c: "Bu evde çocuğa el uzatılmaz", tone: "night", r: cam([2.6, 2.8], face(1620), undefined, sc(kapiEv(0), F("muslum", 1620, { dir: -1, mouth: "shout", brow: "angry" }))), html: q("“BU EVDE ÇOCUĞA EL UZATILMAZ!”", 72) },
  { c: "Irmak odaya dalıyor", tone: "night", r: cam([1, 1.06], [1100, 600], undefined, sc(cocukOdaBos, Run("irmak", 700, 1200, { brow: "worried" }))) },
  { c: "Rüya'yı battaniyesiyle kucaklıyor", tone: "night", r: cam([2, 2.2], [1250, 600], undefined, sc(cocukOdaBos, (t) => <DFig x={1200} y={G} s={1.1} o={CE.irmak} t={t} pose={CARRY} holdR={bebek(t)} brow="worried" />)) },
  { c: "arka merdivenden bahçeye", tone: "night", r: cam([1, 1.05], [960, 600], undefined, sc(bKapi(0), (t, a) => { const x = lerp(200, 1100, ramp(t, a, a + 2.4)); return <DFig x={x} y={G} s={1.1} o={CE.irmak} t={t} pose={{ ...runPose((t - a) * 9), r: [40, 95] }} holdR={bebek(t, 1)} brow="worried" />; })) },
  { c: "Arkasında silah sesleri", sfx: "shot", tone: "night", r: cam([1.1, 1.15], [960, 560], undefined, (t, a) => <><Konak t={t} room="salon" />{muzzle(900, 560, 0.1)(t, a, a)}{muzzle(1200, 600, 0.5)(t, a, a)}</>, 5) },
  { c: "Müslüm ile Balıkçı yerde", tone: "night", r: cam([1.3, 1.4], [960, 700], undefined, sc(salonGeç, (t) => <g transform={`translate(900,${G - 40}) rotate(${-80 + Math.sin(t * 9) * 6})`}><DFig x={0} y={0} s={1} o={CE.muslum} t={t} brow="angry" mouth="shout" /></g>, (t) => <g transform={`translate(1100,${G - 50}) rotate(${80 + Math.sin(t * 8) * 6})`}><DFig x={0} y={0} s={1} o={CE.balikci} t={t} brow="angry" mouth="tight" /></g>), 3) },
  { c: "Balıkçı, Müslüm'ü duvara", sfx: "boom", tone: "night", r: cam([1.3, 1.4], [1100, 600], undefined, sc(salonGeç, F("muslum", 1400, { pose: { l: [-40, 20], r: [-40, 20], lean: -16 }, eyes: "closed", mouth: "o" }), F("balikci", 1180, { pose: P.reach, brow: "angry" })), 4) },
  { c: "Yere yığılıyor", tone: "night", r: cam([1.5, 1.6], [1300, 800], undefined, sc(salonGeç, (t) => <g transform={`translate(1350,${G - 30}) rotate(-88)`}><DFig x={0} y={0} s={1} o={CE.muslum} t={t} eyes="closed" /></g>)) },
  { c: "Ama düşerken bile", tone: "night", r: cam([2.4, 2.6], [1200, 760], undefined, sc(salonGeç, F("balikci", 1100, { pose: { l: [8, 6], r: [-40, 20], lean: -10 }, brow: "angry" }), (t) => <g transform={`translate(1350,${G - 30}) rotate(-70)`}><DFig x={0} y={0} s={1} o={CE.muslum} t={t} eyes="squint" pose={P.reach} /></g>)) },
  { c: "Kaç Irmak", tone: "night", r: cam([2.6, 2.8], [1300, 860], undefined, sc(salonGeç, (t) => <g transform={`translate(1350,${G - 30}) rotate(-70)`}><DFig x={0} y={0} s={1} o={CE.muslum} t={t} eyes="squint" mouth="shout" /></g>)), html: q("“KAÇ IRMAK! ARKANA BAKMA!”", 78) },
  { c: "Balıkçı ceketi sıyırıp", tone: "night", r: cam([1, 1.06], [960, 600], undefined, sc(salonGeç, Run("balikci", 900, 1900, { brow: "angry", o: undefined } as Face, 0.2, 1.8))) },
  { c: "Bahçe karanlık", sfx: "drone", tone: "night", r: cam([1, 1.08], [960, 560], undefined, bKapi(0)) },
  { c: "Rüya uyanıyor ve ağlamaya", tone: "night", r: cam([2.6, 2.8], [1120, 560], undefined, sc(bKapi(0), (t) => <DFig x={1100} y={G} s={1.1} o={CE.irmak} t={t} pose={CARRY} holdR={bebek(t, 1)} brow="worried" eyes="wide" />)) },
  { c: "Irmak, bebeğin ağzını kapatamıyor", tone: "night", r: cam([2.4, 2.6], face(1100, 1.1, 0), undefined, sc(bKapi(0), (t) => <DFig x={1100} y={G} s={1.1} o={CE.irmak} t={t} pose={CARRY} holdR={bebek(t, 1)} brow="worried" eyes="sad" />)) },
  { c: "Sus güzelim", tone: "warm", r: cam([2.8, 3], face(1100, 1.1, 0), undefined, sc(bKapi(0), (t) => <DFig x={1100} y={G} s={1.1} o={CE.irmak} t={t} pose={CARRY} holdR={bebek(t, 0)} eyes="closed" talk tear={0.8} />)), html: q("“SUS GÜZELİM. BABAN GELİYOR. SÖZ VERİYORUM.”", 58) },
  { c: "Irmak bahçe kapısına ulaşıyor", tone: "night", r: cam([1, 1.06], [1300, 600], undefined, sc(bKapi(0), (t, a) => <DFig x={lerp(1000, 1320, ramp(t, a, a + 1.6))} y={G} s={1.1} o={CE.irmak} t={t} pose={CARRY} holdR={bebek(t)} brow="worried" />)) },
  { c: "Kapı kilitli", sfx: "knock", tone: "night", r: cam([2.6, 2.8], [1480, 520], undefined, bKapi(0), 3), html: big("KİLİTLİ.", "#E63946", 120, 110) },
  { c: "Arkasından ayak sesleri", sfx: "tick", tone: "night", r: cam([1.1, 1.2], [900, 600], undefined, sc(bKapi(0), Wk("balikci", 0, 700, { pose: AIM, holdR: tab, brow: "angry" }, 0.1, 2.6), (t) => <DFig x={1360} y={G} s={1.1} o={CE.irmak} t={t} dir={-1} pose={CARRY} holdR={bebek(t)} eyes="wide" />)) },
  { c: "Balıkçı, dudağı kanamış", tone: "night", r: cam([2.6, 2.8], face(700, 1.1), undefined, sc(bKapi(0), F("balikci", 700, { pose: AIM, holdR: tab, brow: "angry", mouth: "tight" }))) },
  { c: "Ver o çocuğu bana", tone: "night", r: cam([2.6, 2.8], face(700, 1.1), undefined, sc(bKapi(0), F("balikci", 700, { pose: AIM, holdR: tab, talk: true, eyes: "squint" }))), html: q("“VER O ÇOCUĞU BANA.”", 84) },
  { c: "Ve tam o anda bahçe mavi", sfx: "siren", tone: "night", siren: true, r: cam([1, 1.06], [960, 600], undefined, sc(bKapi(1), F("balikci", 700, { pose: AIM, holdR: tab, eyes: "wide" }), (t) => <DFig x={1360} y={G} s={1.1} o={CE.irmak} t={t} dir={-1} pose={CARRY} holdR={bebek(t)} eyes="wide" />)) },
  { c: "Polis arabaları", sfx: "siren", tone: "night", siren: true, r: cam([1, 1.05], [960, 600], undefined, sc(bKapi(1), F("polis", 300), F("polis", 520), F("polis", 1700, { dir: -1 }))) },
  { c: "En önde Savcı Selma", tone: "night", siren: true, r: cam([1.2, 1.3], [500, 600], undefined, sc(bKapi(1), Wk("selma", 100, 420, { brow: "angry" }), Wk("cigdem", -100, 240, { pose: AIM, holdR: tab }, 0.3, 2.4))) },
  { c: "Nisan ambulanstan Selma'yı aramış", tone: "cool", r: cam([1, 1.06], [960, 560], undefined, sc(amb, F("nisanPalto", 1500, { dir: -1, pose: P.phone, holdR: <rect x={-14} y={-34} width={28} height={52} rx={6} fill="#1A1C22" />, talk: true, tear: 0.6 }))), html: tg("LİSTE GÖNDERİLDİ", "#3FAE6A") },
  { c: "Selma, Balıkçı'nın karşısına", tone: "night", siren: true, r: cam([1.2, 1.3], [700, 600], undefined, sc(bKapi(1), F("selma", 520, { brow: "angry" }), F("balikci", 860, { dir: -1, eyes: "wide", pose: { l: [150, 170], r: [150, 170] } }))) },
  { c: "Devlet adına konuşmayı bırak", tone: "night", siren: true, r: cam([2.6, 2.8], face(520), undefined, sc(bKapi(1), F("selma", 520, { talk: true, brow: "angry" }))), html: q("“DEVLET BURADA. VE SENİ TUTUKLUYOR.”", 66, 0.5) },
  { c: "Çiğdem kelepçeyi takıyor", sfx: "ding", tone: "night", siren: true, r: cam([2.2, 2.4], [860, 760], undefined, sc(bKapi(1), F("balikci", 860, { dir: -1, eyes: "down", pose: { l: [40, 100], r: [40, 100] }, holdR: <Kelepce x={0} y={0} s={0.6} /> }), F("cigdem", 1060, { dir: -1, pose: P.reach }))) },
  { c: "Rüya, Irmak'ın kucağında", tone: "warm", r: cam([2.6, 2.8], [1380, 640], undefined, sc(bKapi(0.4), (t) => <DFig x={1360} y={G} s={1.1} o={CE.irmak} t={t} dir={-1} pose={CARRY} holdR={bebek(t, 0)} mouth="smile" tear={0.6} />)) },
  { c: "Hastane. Ameliyathane kapısının", sfx: "drone", tone: "cool", r: cam([1, 1.08], [1260, 360], [1260, 420], hKor({ red: 1 })) },
  { c: "Koridorda Nisan, Gürdal, Faruk", tone: "cool", r: cam([1, 1.05], [960, 600], undefined, sc(hKor({ red: 1 }), F("nisanPalto", 300, { pose: P.sit, y: 900, s: 1, eyes: "sad" }), F("gurdal", 600, { s: 1 }), F("faruk", 800, { s: 1, eyes: "down" }))) },
  { c: "Ve biraz uzakta, duvara yaslanmış", tone: "cool", r: cam([2, 2.2], [1720, 560], undefined, sc(hKor({ red: 1 }), F("kadir", 1720, { s: 1, dir: -1, eyes: "down", pose: P.hips }))) },
  { c: "Saatler geçmiyor", sfx: "tick", tone: "cool", r: cam([2.6, 3], [860, 180], undefined, hKor({ red: 1 })) },
  { c: "Gürdal, koridorun bir ucundan", tone: "cool", r: cam([1, 1.05], [960, 600], undefined, sc(hKor({ red: 1 }), Wk("gurdal", 300, 1100, { s: 1, eyes: "down" }, 0.1, 3.6))) },
  { c: "Bu adam beni dağdan indirdi", tone: "warm", r: cam([2.6, 2.8], face(900, 1), undefined, sc(hKor({ red: 1 }), F("gurdal", 900, { s: 1, talk: true, eyes: "sad", tear: 0.5 }))), html: q("“HERKES BANA DELİ DEDİ. O BANA KARDEŞ DEDİ.”", 58, 0.4) },
  { c: "Faruk sessizce ekliyor", tone: "warm", r: cam([2.6, 2.8], face(700, 1), undefined, sc(hKor({ red: 1 }), F("faruk", 700, { s: 1, talk: true, eyes: "sad", pose: P.sit, y: 900 }))), html: q("“BANA DA PROFESÖR DEDİ.”", 80) },
  { c: "Hiç okul bitirmemiş birine", tone: "warm", r: cam([2.4, 2.6], face(700, 1), undefined, sc(hKor({ red: 1 }), F("faruk", 700, { s: 1, talk: true, eyes: "down", mouth: "smile", pose: P.sit, y: 900 }))) },
  { c: "Kadir, uzaktan Nisan'a yaklaşıyor", tone: "cool", r: cam([1, 1.05], [960, 600], undefined, sc(hKor({ red: 1 }), F("nisanPalto", 300, { pose: P.sit, y: 900, s: 1 }), Wk("kadir", 1700, 620, { s: 1, eyes: "down" }, 0.1, 3.2))) },
  { c: "Beni affetmeni beklemiyorum", tone: "cool", r: cam([2.6, 2.8], face(620, 1), undefined, sc(hKor({ red: 1 }), F("kadir", 620, { s: 1, dir: -1, talk: true, eyes: "sad" }))), html: q("“BENİ AFFETMENİ BEKLEMİYORUM.”", 72) },
  { c: "Ben onu öldürmek için yıllarca", tone: "cool", r: cam([2.6, 2.8], face(620, 1), undefined, sc(hKor({ red: 1 }), F("kadir", 620, { s: 1, dir: -1, talk: true, eyes: "down", brow: "sad" }))), html: q("“AMA ASLINDA ONU KAYBETMEKTEN KORKUYORMUŞUM.”", 56, 0.5) },
  { c: "Nisan ona bakıyor", tone: "cool", r: cam([2.6, 2.8], face(300, 1, 0), undefined, sc(hKor({ red: 1 }), F("nisanPalto", 300, { pose: P.sit, y: 900, s: 1, eyes: "sad", look: 1 }))) },
  { c: "Sadece yanındaki boş sandalyeyi", tone: "warm", r: cam([1.4, 1.5], [440, 700], undefined, sc(hKor({ red: 1 }), F("nisanPalto", 300, { pose: { ...P.sit, r: [60, 80] }, y: 900, s: 1 }), F("kadir", 620, { s: 1, dir: -1 }))) },
  { c: "Kadir oturuyor", tone: "warm", r: cam([1.4, 1.5], [440, 700], undefined, sc(hKor({ red: 1 }), F("nisanPalto", 300, { pose: P.sit, y: 900, s: 1 }), F("kadir", 450, { pose: P.sit, y: 900, s: 1, dir: -1, eyes: "down" }))) },
  { c: "Kapı açılıyor. Doktor çıkıyor", sfx: "knock", tone: "cool", r: cam([1, 1.06], [1260, 560], undefined, sc((t, a) => <HastaneKoridor t={t} red={0} door={ramp(t, a + 0.2, a + 1)} />, (t, a) => <DFig x={1260} y={900} s={1} o={CE.doktor} t={t} op={ramp(t, a + 0.6, a + 1.2)} mouth="tight" />)) },
  { c: "Yüzü ciddi", tone: "cool", r: cam([2.6, 2.8], face(1260, 1, 0), undefined, sc(hKor({ red: 0, door: 1 }), F("doktor", 1260, { s: 1, mouth: "tight", y: 900 }))) },
  { c: "Çok kan kaybetti", tone: "cool", r: cam([2.6, 2.8], [1260, 520], undefined, sc(hKor({ red: 0, door: 1 }), F("doktor", 1260, { s: 1, talk: true, y: 900, brow: "worried" }))), html: q("“KALBİ İKİ KEZ DURDU. GERİ GETİRDİK.”", 64) },
  { c: "Ama gerisi ona kalmış", tone: "cool", r: cam([2.6, 2.8], [1260, 520], undefined, sc(hKor({ red: 0, door: 1 }), F("doktor", 1260, { s: 1, talk: true, y: 900, eyes: "down" }))), html: q("“YANINA BİR KİŞİ GİREBİLİR. BİR KİŞİ.”", 64) },
  { c: "Nisan içeri giriyor", tone: "cool", r: cam([1, 1.05], [960, 600], undefined, sc(hOda(1), yatak({ eyes: "closed" }), Wk("nisanPalto", 1900, 1250, { dir: -1, eyes: "sad" }, 0.1, 2.6))) },
  { c: "Eşref'in elini tutuyor", tone: "warm", r: cam([1.6, 1.7], [1100, 700], undefined, sc(hOda(1), yatak({ eyes: "closed" }), F("nisanPalto", 1200, { dir: -1, pose: { l: [60, 80], r: [8, 6], lean: 12 }, eyes: "sad", tear: 0.8 }))) },
  { c: "Monitördeki çizgi zayıf", sfx: "beep", tone: "cool", r: cam([2.4, 2.6], [380, 320], undefined, hOda(0.4)) },
  { c: "Nisan ne yapacağını bilmiyor", tone: "cool", r: cam([2.6, 2.8], face(1200, 1.1, 0), undefined, sc(hOda(0.4), F("nisanPalto", 1200, { dir: -1, eyes: "sad", tear: 1, brow: "sad" }))) },
  { c: "Ve sonra, yapabildiği tek şeyi", tone: "warm", r: cam([1.3, 1.4], [1000, 600], undefined, sc(hOda(0.4), yatak({ eyes: "closed" }), F("nisanPalto", 1200, { dir: -1, eyes: "closed", tear: 1 }))) },
  { c: "Şarkı söylüyor", tone: "gold", r: cam([2.6, 2.8], face(1200, 1.1, 0), undefined, sc(hOda(0.4), F("nisanPalto", 1200, { dir: -1, pose: SING, eyes: "closed", talk: true, tear: 1 }))), html: big("♪", "#FFC800", 130, 120) },
  { c: "Bir saat dedin, bekledim", tone: "gold", r: cam([1.4, 1.5], [1000, 600], undefined, sc(hOda(0.4), yatak({ eyes: "closed" }), F("nisanPalto", 1200, { dir: -1, pose: SING, eyes: "closed", talk: true, tear: 1 }))), html: q("♪ Bir saat dedin, bekledim ♪", 70, 0.1) },
  { c: "Gece bitmedi, sen gelmedin", tone: "gold", r: cam([2.4, 2.6], face(1200, 1.1, 0), undefined, sc(hOda(0.4), F("nisanPalto", 1200, { dir: -1, pose: SING, eyes: "closed", talk: true, tear: 1 }))), html: q("♪ Gece bitmedi, sen gelmedin ♪", 70, 0.1) },
  { c: "Dön bana, Rüya'n burada", tone: "gold", r: cam([1.8, 2], [800, 620], undefined, sc(hOda(0.4), yatak({ eyes: "closed" }), F("nisanPalto", 1200, { dir: -1, pose: SING, eyes: "closed", talk: true, tear: 1 }))), html: q("♪ Dön bana, Rüya'n burada ♪", 70, 0.1) },
  { c: "Sensiz sabah olmuyor bana", tone: "gold", r: cam([2.6, 2.8], face(1200, 1.1, 0), undefined, sc(hOda(0.4), F("nisanPalto", 1200, { dir: -1, pose: SING, eyes: "closed", talk: true, tear: 1 }))), html: q("♪ Sensiz sabah olmuyor bana ♪", 70, 0.1) },
  { c: "Koridorda Gürdal başını duvara", tone: "cool", r: cam([2, 2.2], face(600, 1, 0), undefined, sc(hKor({ red: 0 }), F("gurdal", 600, { s: 1, eyes: "closed", tear: 1, pose: { l: [120, 160], r: [8, 6], lean: -6 } }))) },
  { c: "Faruk gözlüklerini çıkarıyor", tone: "cool", r: cam([2.6, 2.8], face(800, 1, 0), undefined, sc(hKor({ red: 0 }), F("faruk", 800, { s: 1, eyes: "closed", tear: 0.8, pose: { l: [8, 6], r: [40, 150] } }))) },
  { c: "Kadir, bir köşede", tone: "cool", r: cam([2, 2.2], [1720, 560], undefined, sc(hKor({ red: 0 }), F("kadir", 1720, { s: 1, dir: 1, eyes: "closed", tear: 1 }))) },
  { c: "Monitördeki çizgi bir an düzleşiyor", sfx: "beep", tone: "cool", r: cam([2.6, 2.8], [380, 320], undefined, hOda(0)), html: big("—", "#E63946", 140, 110) },
  { c: "Uzun, keskin bir ses", sfx: "drone", tone: "cool", r: cam([2.6, 2.8], face(1200, 1.1, 0), undefined, sc(hOda(0), F("nisanPalto", 1200, { dir: -1, eyes: "wide", mouth: "o", tear: 1 }))) },
  { c: "Nisan'ın sesi kesiliyor", tone: "cool", r: cam([1.4, 1.5], [1000, 620], undefined, sc(hOda(0), yatak({ eyes: "closed" }), F("nisanPalto", 1200, { dir: -1, eyes: "closed", tear: 1, mouth: "frown" }))) },
  { c: "Ve sonra. Bip", sfx: "beep", tone: "gold", r: cam([2.6, 2.8], [380, 320], undefined, hOda(1)), html: big("BİP. BİP. BİP.", "#3FE07A", 110, 110) },
  { c: "Çizgi geri geliyor", sfx: "heart", tone: "gold", r: cam([2, 2.2], [380, 320], undefined, hOda(1.2)) },
  { c: "Eşref'in parmakları, Nisan'ın elini", tone: "gold", r: cam([2.4, 2.6], [1000, 640], undefined, sc(hOda(1), (t) => <g><rect width={1920} height={1080} fill="#A9C7D6" opacity={0.6} /><g transform="translate(960,620) scale(4)"><circle cx={-20} cy={0} r={18} fill="#D9B89A" stroke="#1B1210" strokeWidth={2} /><circle cx={14} cy={4} r={16} fill="#F3CDAA" stroke="#1B1210" strokeWidth={2} /><path d={`M-36,0 q${18 + Math.sin(t * 2) * 2},-14 ${40},0`} stroke="#D9B89A" strokeWidth={8} fill="none" strokeLinecap="round" /></g></g>)), html: big("PARMAKLARI KIPIRDADI.", "#FFC800", 86, 110) },

  // ── 5. BÖLÜM: RÜYA ──
  { c: "Beşinci bölüm. Rüya", ...bolum("BEŞİNCİ BÖLÜM", "RÜYA") },
  { c: "Sabah. İstanbul'un üstünde", sfx: "whoosh", tone: "gold", r: cam([1, 1.08], [960, 540], undefined, (t) => <SahilYolu t={t} day={1} />) },
  { c: "Eşref gözlerini açıyor", tone: "warm", r: cam([2.4, 2.6], [420, 650], undefined, sc(hOda(1, 0), yatak({ eyes: "squint", mouth: "flat" }))) },
  { c: "İlk gördüğü şey", tone: "gold", r: cam([1.6, 1.8], [1200, 600], undefined, sc(hOda(1, 0), (t) => <DFig x={1200} y={G} s={1.1} o={CE.nisan} t={t} dir={-1} pose={CARRY} holdR={bebek(t)} mouth="smile" eyes="happy" tear={0.5} />)) },
  { c: "Geciktim", tone: "warm", r: cam([2.4, 2.6], [420, 650], undefined, sc(hOda(1, 0), yatak({ eyes: "squint", mouth: "smile", talk: true }))), html: q("“GECİKTİM.”", 110) },
  { c: "Nisan gülüyor, ağlıyor", tone: "gold", r: cam([2.6, 2.8], face(1200, 1.1, 0), undefined, sc(hOda(1, 0), (t) => <DFig x={1200} y={G} s={1.1} o={CE.nisan} t={t} dir={-1} pose={CARRY} holdR={bebek(t)} mouth="grin" eyes="happy" tear={1} />)) },
  { c: "Bir saat demiştin. Yedi saat oldu", tone: "gold", r: cam([2.6, 2.8], face(1200, 1.1, 0), undefined, sc(hOda(1, 0), (t) => <DFig x={1200} y={G} s={1.1} o={CE.nisan} t={t} dir={-1} pose={CARRY} holdR={bebek(t)} talk mouth="smile" tear={0.8} />)), html: q("“BİR SAAT DEMİŞTİN. YEDİ SAAT OLDU, EŞREF TEK.”", 58) },
  { c: "Bunun hesabını bir ömür boyu", tone: "gold", r: cam([1.4, 1.5], [960, 600], undefined, sc(hOda(1, 0), yatak({ eyes: "happy", mouth: "smile" }), (t) => <DFig x={1200} y={G} s={1.1} o={CE.nisan} t={t} dir={-1} pose={CARRY} holdR={bebek(t)} mouth="grin" eyes="happy" />)), html: q("“BUNUN HESABINI BİR ÖMÜR BOYU VERECEKSİN.”", 60) },
  { c: "Ama Nisan'ın içinde bir soru var", tone: "cool", r: cam([2.6, 2.8], face(1200, 1.1, 0), undefined, sc(hOda(1, 0), F("nisan", 1200, { dir: -1, eyes: "down", brow: "sad" }))) },
  { c: "Babamı sen mi öldürdün", sfx: "drone", tone: "cool", r: cam([2.8, 3], face(1200, 1.1, 0), undefined, sc(hOda(1, 0), F("nisan", 1200, { dir: -1, talk: true, eyes: "sad", brow: "sad" }))), html: q("“BABAMI SEN Mİ ÖLDÜRDÜN?”", 86) },
  { c: "Eşref bir süre susuyor", tone: "cool", r: cam([2.4, 2.6], [420, 650], undefined, sc(hOda(1, 0), yatak({ eyes: "down", mouth: "tight" }))) },
  { c: "Sonra başını sallıyor", tone: "cool", r: cam([2.4, 2.6], [420, 650], undefined, sc(hOda(1, 0), yatak({ eyes: "sad", talk: true }))), html: q("“EVET. SON KURŞUNLA.”", 90) },
  { c: "Nisan'ın gözleri doluyor", tone: "cool", r: cam([2.8, 3], face(1200, 1.1, 0), undefined, sc(hOda(1, 0), F("nisan", 1200, { dir: -1, eyes: "sad", tear: 1 }))) },
  { c: "Ondan nefret etmeni istemiyorum", tone: "warm", r: cam([2.4, 2.6], [420, 650], undefined, sc(hOda(1, 0), yatak({ eyes: "sad", talk: true }))), html: q("“O SENİN BABANDI. AMA KIZIMIZI SENDEN ALMAK İSTEDİ.”", 54) },
  { c: "Ve ben, o kapıdan girerken", tone: "warm", r: cam([1, 1.08], [960, 560], undefined, (t) => <Koridor t={t} door={1} />) },
  { c: "Rüya, babasız büyümeyecek", sfx: "drone", tone: "gold", r: cam([2.4, 2.6], [420, 650], undefined, sc(hOda(1, 0), yatak({ eyes: "sad", talk: true, tear: 0.6 }))), html: q("“RÜYA, BABASIZ BÜYÜMEYECEK.”", 80) },
  { c: "Nisan, kızının başını okşuyor", tone: "gold", r: cam([2, 2.2], [1220, 640], undefined, sc(hOda(1, 0), (t) => <DFig x={1200} y={G} s={1.1} o={CE.nisan} t={t} dir={-1} pose={CARRY} holdR={bebek(t)} eyes="down" mouth="smile" />)) },
  { c: "O bana hiç baba olmadı", tone: "gold", r: cam([2.6, 2.8], face(1200, 1.1, 0), undefined, sc(hOda(1, 0), F("nisan", 1200, { dir: -1, talk: true, eyes: "sad" }))), html: q("“BABALIK BİR İSİM DEĞİL.”", 84) },
  { c: "Babalık, bir saat deyip", tone: "gold", r: cam([1.4, 1.5], [960, 600], undefined, sc(hOda(1, 0), yatak({ eyes: "happy", tear: 0.8, mouth: "smile" }), F("nisan", 1200, { dir: -1, talk: true, mouth: "smile", tear: 0.8 }))), html: q("“KAN İÇİNDE DE OLSA EVE DÖNMEYE ÇALIŞAN ADAMIN YAPTIĞI ŞEY.”", 50, 0.4) },
  { c: "Kapı aralanıyor", sfx: "knock", tone: "warm", r: cam([1, 1.05], [960, 600], undefined, sc(hOda(1, 0), Wk("gurdal", 1950, 1500, { dir: -1 }), Wk("faruk", 2150, 1680, { dir: -1 }, 0.3, 2.8), Wk("muslum", 2350, 1820, { dir: -1 }, 0.5, 3))) },
  { c: "Gürdal'ın gözleri kıpkırmızı", tone: "warm", r: cam([2.6, 2.8], face(1500), undefined, sc(hOda(1, 0), F("gurdal", 1500, { dir: -1, eyes: "sad", tear: 1, talk: true }))), html: q("“ULA BİR DAHA BÖYLE BİR ŞEY YAPARSAN SENİ BEN VURURUM!”", 52) },
  { c: "Herkes gülüyor", sfx: "pop", tone: "gold", r: cam([1, 1.05], [1100, 600], undefined, sc(hOda(1, 0), yatak({ eyes: "happy", mouth: "grin" }), F("gurdal", 1300, { dir: -1, mouth: "grin", eyes: "happy" }), F("faruk", 1500, { dir: -1, mouth: "grin" }), F("muslum", 1680, { dir: -1, mouth: "grin", eyes: "happy" }), F("irmak", 1840, { dir: -1, mouth: "smile" }))) },
  { c: "Eşref kapının arkasında birini", tone: "cool", r: cam([1.6, 1.8], [1700, 560], undefined, sc(hOda(1, 0), Wk("kadir", 1700, 2100, { s: 1, eyes: "down" }, 0.3, 3))) },
  { c: "Kadir.", tone: "cool", r: cam([2.4, 2.6], [420, 650], undefined, sc(hOda(1, 0), yatak({ eyes: "open", talk: true }))), html: q("“KADİR.”", 110) },
  { c: "Kadir duruyor", tone: "cool", r: cam([2.4, 2.6], face(1760, 1), undefined, sc(hOda(1, 0), F("kadir", 1760, { s: 1, eyes: "closed" }))) },
  { c: "Yetimler'den geriye ikimiz kaldık", tone: "warm", r: cam([2.4, 2.6], [420, 650], undefined, sc(hOda(1, 0), yatak({ eyes: "sad", talk: true }))), html: q("“YETİMLER'DEN GERİYE İKİMİZ KALDIK.”", 70) },
  { c: "Bir battaniyenin altında büyüdük", tone: "gold", r: cam([1.8, 2], [900, 640], undefined, (t) => <><rect width={1920} height={1080} fill="#4A4E52" /><rect x={680} y={700} width={440} height={60} fill="#6A6A5A" stroke="#1B1210" strokeWidth={5} /><DFig x={820} y={760} s={0.55} o={CE.esrefCocuk} t={t} eyes="closed" seed={1} /><DFig x={980} y={760} s={0.55} o={CE.esrefCocuk} t={t} eyes="closed" dir={-1} seed={2} /><path d="M700,620 Q900,540 1100,620 L1110,720 L690,720Z" fill="#7A6A4A" stroke="#1B1210" strokeWidth={5} /><rect width={1920} height={1080} fill="#C89A5A" opacity={0.2} /></>) },
  { c: "Kadir dönüyor", tone: "warm", r: cam([2.6, 2.8], face(1760, 1), undefined, sc(hOda(1, 0), F("kadir", 1760, { s: 1, dir: -1, talk: true, eyes: "sad" }))), html: q("“BIRAKAMAZDIM. SENİ ÖLDÜRMEK BENİM HAKKIMDI.”", 58) },
  { c: "Bir sessizlik. Sonra Kadir gülümsüyor", tone: "gold", r: cam([2.6, 2.8], face(1760, 1), undefined, sc(hOda(1, 0), F("kadir", 1760, { s: 1, dir: -1, mouth: "smile", eyes: "happy", talk: true }))), html: q("“AMA ARTIK O HAKKI SANA BAĞIŞLIYORUM, KARDEŞİM.”", 56) },
  { c: "İki kardeş, yıllar sonra ilk kez", sfx: "drone", tone: "gold", r: cam([1.4, 1.5], [1000, 560], undefined, sc(hOda(1, 0), F("esrefHasta", 900, { pose: HUG, eyes: "closed", mouth: "smile" }), F("kadir", 1080, { dir: -1, pose: HUG, eyes: "closed", tear: 0.8 }))), html: big("KARDEŞLER.", "#FFC800", 110, 110) },
  { c: "Birkaç gün sonra, Savcı Selma", tone: "warm", r: cam([1, 1.06], [960, 600], undefined, sc(hOda(1, 0), yatak({ eyes: "open" }), Wk("selma", 1900, 1300, { dir: -1 }))) },
  { c: "Liste sayesinde İhtiyar'ın bütün ağı", sfx: "boom", tone: "cool", r: cam([1, 1.06], [960, 540], undefined, (t, a) => <><rect width={1920} height={1080} fill="#1E2A3A" />{Array.from({ length: 12 }, (_, i) => <g key={i} transform={`translate(${260 + (i % 6) * 280},${360 + Math.floor(i / 6) * 320})`}><rect x={-100} y={-130} width={200} height={240} fill="#F4F0E6" stroke="#1B1210" strokeWidth={4} /><circle cx={0} cy={-40} r={50} fill="#8A929C" /><path d="M-110,-140 L110,120 M110,-140 L-110,120" stroke="#E0393E" strokeWidth={14} opacity={ramp(t, a + 0.2 + i * 0.12, a + 0.4 + i * 0.12)} /></g>)}</>), html: big("İHTİYAR'IN AĞI ÇÖKTÜ", "#FFFFFF", 80, 80) },
  { c: "Balıkçı her şeyi anlatıyor", tone: "cool", r: cam([1.3, 1.4], [960, 560], undefined, sc(ofisSorgu(), F("balikci", 960, { pose: P.sit, y: 900, eyes: "down", talk: true }))) },
  { c: "Ama sana bir sorum var, Eşref", tone: "warm", r: cam([2.6, 2.8], face(1300), undefined, sc(hOda(1, 0), F("selma", 1300, { dir: -1, talk: true }))), html: q("“ŞİMDİ NE OLACAK? YETİMLER NE OLACAK?”", 62, 0.5) },
  { c: "Eşref pencereden şehre bakıyor", tone: "gold", r: cam([1.6, 1.7], [1500, 340], undefined, hOda(1, 0)) },
  { c: "Yetimler bitti, Savcım", sfx: "drone", tone: "gold", r: cam([2.4, 2.6], [420, 650], undefined, sc(hOda(1, 0), yatak({ eyes: "open", talk: true }))), html: q("“YETİMLER BİTTİ, SAVCIM.”", 86) },
  { c: "Bundan sonra bu şehirde", tone: "gold", r: cam([1, 1.08], [960, 600], undefined, sc(yetim, F("esrefCocuk", 960, { s: 0.7, eyes: "sad" }))), html: q("“KİMSESİZ BİR ÇOCUK, BENİM GİBİ SOKAĞA KALMAYACAK.”", 54, 0.4) },
  { c: "Nisan'ın elini tutuyor", tone: "gold", r: cam([1.6, 1.7], [1000, 680], undefined, sc(hOda(1, 0), yatak({ eyes: "happy", mouth: "smile" }), F("nisan", 1160, { dir: -1, pose: { l: [60, 80], r: [8, 6], lean: 10 }, mouth: "smile" }))), html: q("“BİR MERKEZ AÇACAĞIZ. ADINI O KOYSUN.”", 62) },
  { c: "Nisan gülümsüyor", tone: "gold", r: cam([2.6, 2.8], face(1160, 1.1, 0), undefined, sc(hOda(1, 0), F("nisan", 1160, { dir: -1, mouth: "smile", eyes: "happy", talk: true }))), html: big("EŞREF TEK GENÇLİK MERKEZİ", "#FFC800", 72, 110) },
  { c: "Ama içinde sen olacaksın", tone: "gold", r: cam([2.6, 2.8], face(1160, 1.1, 0), undefined, sc(hOda(1, 0), F("nisan", 1160, { dir: -1, mouth: "smile", talk: true, tear: 0.5 }))), html: q("“BİR RESİMDE DEĞİL. KAPIDA.”", 80, 0.5) },

  // ── FİNAL: ON YIL SONRA ──
  { c: "On yıl sonra", ...bolum("FİNAL", "ON YIL SONRA") },
  { c: "Eşref Tek Gençlik Merkezi", sfx: "whoosh", tone: "gold", r: cam([1.1, 1], [960, 420], [960, 540], merkez) },
  { c: "Bahçede çocuklar top oynuyor", sfx: "pop", tone: "gold", r: cam([1, 1.06], [960, 700], undefined, sc(merkez, ...[0, 1, 2, 3, 4].map((i) => (t: number, a: number) => { const x = 300 + i * 300 + Math.sin(t * 2 + i) * 80; return <DFig key={i} x={x} y={980 + (i % 2) * 40} s={0.5} o={COCUK(i)} t={t} pose={runPose(t * 8 + i)} mouth="grin" eyes="happy" seed={i} />; }), (t) => <circle cx={960 + Math.sin(t * 2.4) * 400} cy={900 - Math.abs(Math.sin(t * 4)) * 160} r={26} fill="#E0763A" stroke="#1B1210" strokeWidth={4} />)) },
  { c: "Kapıda Gürdal, saçına ak düşmüş", tone: "gold", r: cam([2.4, 2.6], face(960, 1.1), undefined, sc(merkez, F("gurdal", 960, { mouth: "shout", pose: P.point, brow: "angry" }))), html: q("“ULA TOPU CAMA ATMAYUN!”", 84) },
  { c: "Faruk, kütüphanede bir kitap", tone: "gold", r: cam([1.1, 1.2], [960, 640], undefined, sc(merkezIc, F("faruk", 960, { pose: P.hold, holdR: <rect x={-50} y={-36} width={100} height={70} fill="#C0392B" stroke="#1B1210" strokeWidth={3} />, mouth: "smile" }), ...[0, 1, 2, 3].map((i) => (t: number) => <DFig key={i} x={[560, 700, 1220, 1360][i]} y={1000} s={0.5} o={COCUK(i)} t={t} pose={P.sit} mouth="smile" seed={i} />))) },
  { c: "Kadir ise spor salonunda", tone: "gold", r: cam([1.2, 1.3], [960, 600], undefined, sc(merkezIc, F("kadir", 800, { pose: { l: [40, 120], r: [80, 90] }, mouth: "smile" }), F("ruya", 1100, { dir: -1, s: 0.8, pose: { l: [40, 120], r: [80, 90] }, mouth: "grin" }))), html: q("“YUMRUK ATMAYI DEĞİL, NE ZAMAN ATMAYACAĞINI ÖĞRENECEKSİNİZ.”", 50, 0.4) },
  { c: "Duvarda büyük bir yazı var", sfx: "ding", tone: "gold", r: cam([1, 1.1], [960, 260], undefined, merkezIc) },
  { c: "İstanbul'da güneşli bir öğleden sonra", sfx: "whoosh", tone: "gold", r: cam([1, 1.05], [960, 540], undefined, fistikYuru(700)) },
  { c: "Eski ama pırıl pırıl bir araba", tone: "gold", r: cam([1.4, 1.5], [900, 820], undefined, fistikYuru(700, nisanSofor, ruyaArka)) },
  { c: "Fıstık. Direksiyonda Nisan", tone: "gold", r: cam([1, 1.05], [960, 560], undefined, (t) => <FistikIc t={t} day={1} night={0} speed={0.8} who={<DFig x={1040} y={1560} s={2.2} o={CE.nisan} t={t} dir={-1} pose={{ l: [60, 80], r: [70, 95] }} mouth="smile" seed={5} />} />) },
  { c: "Arka koltukta on yaşında bir kız", tone: "gold", r: cam([1.2, 1.3], [1100, 600], undefined, (t) => <FistikIc t={t} day={1} night={0} speed={0.8} who={<DFig x={1300} y={1400} s={1.6} o={CE.ruya} t={t} dir={-1} mouth="smile" eyes="happy" seed={8} pose={P.hold} holdR={<FlasBellek x={0} y={0} s={0.3} />} />} />), html: big("RÜYA", "#FFC800", 110, 110) },
  { c: "Elinde, babasının el yazısıyla", tone: "gold", r: cam([1, 1.1], [960, 540], undefined, (t) => <><rect width={1920} height={1080} fill="#F2E6CC" /><FlasBellek x={960} y={540} s={2.4} glow={0.6} /></>) },
  { c: "Anne, babam yine geç kalacak mı", tone: "gold", r: cam([1.6, 1.7], [1300, 560], undefined, (t) => <FistikIc t={t} day={1} night={0} speed={0.8} who={<DFig x={1300} y={1400} s={1.6} o={CE.ruya} t={t} dir={-1} talk mouth="smile" seed={8} />} />), html: q("“ANNE, BABAM YİNE GEÇ KALACAK MI?”", 66) },
  { c: "Nisan aynaya bakıyor", tone: "gold", r: cam([2.2, 2.4], [1000, 560], undefined, (t) => <FistikIc t={t} day={1} night={0} speed={0.6} who={<DFig x={1040} y={1560} s={2.2} o={CE.nisan} t={t} dir={-1} pose={{ l: [60, 80], r: [70, 95] }} mouth="smile" talk lookY={-1} seed={5} />} />), html: q("“BABAN HEP GEÇ KALIR, KIZIM. AMA HER ZAMAN GELİR.”", 56) },
  { c: "Gerçek finalde, tam bu sahnede", sfx: "drone", tone: "cool", r: cam([1, 1.06], [960, 560], undefined, (t, a) => <><SahilYolu t={t} day={1} /><Fistik x={1100} y={1000} s={0.9} t={t} who={nisanSofor(t)} who2={ruyaArka(t)} /><g opacity={0.35}><DFig x={260} y={G} s={1.1} o={CE.esrefYasli} t={t} sil="#2A3A4A" /></g></>), html: tg("GERÇEK FİNAL", "#E63946") },
  { c: "Ve herkes sordu", tone: "cool", r: kart("#0E1222"), html: (t, a) => <><Txt t={t} at={a + 0.3} text="“EŞREF YAŞIYOR MU,”" y={320} size={90} /><Txt t={t} at={a + 1.3} text="“YOKSA SADECE BİR HAYAL Mİ?”" y={480} size={90} color="#9FD0EC" /></> },
  { c: "Bizim finalimizde de arabanın", sfx: "whoosh", tone: "gold", r: cam([1, 1.06], [960, 560], undefined, (t, a) => <><SahilYolu t={t} day={1} /><Fistik x={1100} y={1000} s={0.9} t={t} who={nisanSofor(t)} who2={ruyaArka(t)} /><g opacity={ramp(t, a + 0.4, a + 1.6)}><DFig x={260} y={G} s={1.1} o={CE.esrefYasli} t={t} sil="#2A3A4A" /></g></>) },
  { c: "Nisan frene basıyor", sfx: "tick", tone: "gold", r: cam([1, 1.05], [960, 560], undefined, (t, a) => <><SahilYolu t={t} day={1} px={(1 - Math.pow(1 - ramp(t, a, a + 1.2), 2)) * 200} /><Fistik x={1100} y={1000} s={0.9} t={t} tail={1} who={nisanSofor(t)} who2={ruyaArka(t)} /></>) },
  { c: "Gölge yaklaşıyor", tone: "gold", r: cam([1.1, 1.2], [700, 600], undefined, sc((t) => <><SahilYolu t={t} day={1} /><Fistik x={1250} y={1000} s={0.9} t={t} who={nisanSofor(t)} who2={ruyaArka(t)} /></>, Wk("esrefYasli", 100, 700, { mouth: "smile" }, 0.1, 2.8))) },
  { c: "Şakakları ağarmış bir adam", tone: "gold", r: cam([2.6, 2.8], face(700), undefined, sc((t) => <><SahilYolu t={t} day={1} /><Fistik x={1250} y={1000} s={0.9} t={t} /></>, F("esrefYasli", 700, { mouth: "smile", eyes: "happy" }))) },
  { c: "Camı tıklatıyor", sfx: "knock", tone: "gold", r: cam([1.8, 2], [960, 640], undefined, sc((t) => <><SahilYolu t={t} day={1} /><Fistik x={1250} y={1000} s={0.9} t={t} who={nisanSofor(t)} who2={ruyaArka(t)} /></>, F("esrefYasli", 860, { pose: { l: [8, 6], r: [80, 60] }, mouth: "smile" }))) },
  { c: "Bir saat demiştim", sfx: "drone", tone: "gold", r: cam([2.6, 2.8], face(860), undefined, sc((t) => <><SahilYolu t={t} day={1} /><Fistik x={1250} y={1000} s={0.9} t={t} /></>, F("esrefYasli", 860, { talk: true, mouth: "smile", eyes: "happy" }))), html: q("“BİR SAAT DEMİŞTİM.”", 96) },
  { c: "Biraz geciktim", tone: "gold", r: cam([2.8, 3], face(860), undefined, sc((t) => <><SahilYolu t={t} day={1} /><Fistik x={1250} y={1000} s={0.9} t={t} /></>, F("esrefYasli", 860, { talk: true, mouth: "grin", eyes: "happy", tear: 0.5 }))), html: q("“BİRAZ GECİKTİM.”", 110) },
  { c: "Rüya kapıyı açıyor ve babasının", sfx: "pop", tone: "gold", r: cam([1.3, 1.4], [900, 620], undefined, sc((t) => <><SahilYolu t={t} day={1} /><Fistik x={1250} y={1000} s={0.9} t={t} door={1} /></>, F("esrefYasli", 860, { pose: HUG, eyes: "closed", mouth: "smile" }), F("ruya", 1000, { s: 0.75, dir: -1, pose: HUG, eyes: "happy", mouth: "grin" }))), html: q("“BABA!”", 120) },
  { c: "Eşref arka koltuğa", tone: "gold", r: cam([1.4, 1.5], [1250, 760], undefined, (t) => <><SahilYolu t={t} day={1} /><Fistik x={1250} y={1000} s={0.9} t={t} who={nisanSofor(t)} who2={<><DFig x={-80} y={-70} s={0.34} o={CE.ruya} t={t} mouth="grin" eyes="happy" /><DFig x={10} y={-60} s={0.42} o={CE.esrefYasli} t={t} mouth="smile" /></>} /></>) },
  { c: "Nisan gülümsüyor ve gaza basıyor", tone: "gold", r: cam([1.6, 1.7], [1000, 560], undefined, (t) => <FistikIc t={t} day={1} night={0} speed={0.8} who={<DFig x={1040} y={1560} s={2.2} o={CE.nisan} t={t} dir={-1} pose={{ l: [60, 80], r: [70, 95] }} mouth="grin" eyes="happy" tear={0.5} seed={5} />} />) },
  { c: "Fıstık, Boğaz'ın kıyısından", sfx: "engine", tone: "gold", r: cam([1, 1.12], [960, 560], [760, 540], (t, a) => <><SahilYolu t={t} day={1} px={(t - a) * 700} /><Fistik x={900} y={1000} s={0.9} t={t} roll={(t - a) * 1.2} who={nisanSofor(t)} who2={<><DFig x={-80} y={-70} s={0.34} o={CE.ruya} t={t} mouth="grin" /><DFig x={10} y={-60} s={0.42} o={CE.esrefYasli} t={t} mouth="smile" /></>} /></>) },
  { c: "Ve bu sefer, bu bir hayal değil", sfx: "boom", tone: "gold", r: cam([1, 1.1], [960, 540], undefined, (t, a) => <><SahilYolu t={t} day={1} px={(t - a) * 500} /><Fistik x={lerp(900, 1500, ramp(t, a, a + 4))} y={1000} s={0.9} t={t} roll={(t - a) * 1.2} /></>), html: big("BU SEFER, BU BİR HAYAL DEĞİL.", "#FFC800", 80, 110) },

  // ── KAPANIŞ ──
  { c: "İşte bizim finalimiz", tone: "gold", r: kart("#1B4F9C"), html: (t, a) => <><Txt t={t} at={a + 0.4} text="EŞREF YAŞADI." y={200} size={80} /><Txt t={t} at={a + 1.2} text="KADİR KARDEŞİNE DÖNDÜ." y={320} size={70} color="#9FD0EC" /><Txt t={t} at={a + 2.0} text="HAİN YAKALANDI." y={440} size={70} color="#FF3E7F" /><Txt t={t} at={a + 2.8} text="RÜYA BABASIYLA BÜYÜDÜ." y={560} size={70} color="#FFC800" /></> },
  { c: "Peki sen ne dersin", tone: "gold", r: kart("#0E1222"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="GERÇEK FİNAL Mİ, BİZİM FİNAL Mİ?" y={300} size={76} color="#FFFFFF" /><Txt t={t} at={a + 1.4} text="YORUMLARA YAZ 👇" y={480} size={100} color="#FFC800" /></> },
  { c: "Ve bir sonraki alternatif finali", tone: "gold", r: kart("#0E1222"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="SIRADAKİ FİNAL:" y={300} size={80} color="#FFFFFF" /><Txt t={t} at={a + 1} text="HANGİ DİZİ?" y={460} size={140} color="#FF3E7F" /></> },
  { c: "En çok yazılan diziyi", tone: "gold", r: cam([1, 1.1], [960, 540], undefined, (t, a) => <><SahilYolu t={t} day={1} px={(t - a) * 400} /><Fistik x={960} y={1000} s={0.9} t={t} roll={(t - a)} /></>), html: (t, a) => <><Txt t={t} at={a + 0.2} text="FİNALİ BİZ YAZDIK" y={200} size={110} color="#FFC800" /><Abone t={t} at={a + 0.8} /></> },
];

// sorgu odası (Balıkçı itiraf ediyor)
function ofisSorgu(): Node {
  return (t) => <><rect width={1920} height={1080} fill="#2A3038" /><rect x={600} y={700} width={720} height={40} fill="#5A5E66" stroke="#1B1210" strokeWidth={5} /><path d="M640,740 V960 M1280,740 V960" stroke="#3A3E44" strokeWidth={14} /><path d="M960,0 V160" stroke="#333" strokeWidth={5} /><path d="M880,160 L1040,160 L1000,200 L920,200Z" fill="#2A2A2A" /><path d="M960,200 L560,1080 L1360,1080Z" fill="#FFE8B0" opacity={0.08 + 0.02 * Math.sin(t * 13)} /><rect x={1500} y={300} width={300} height={200} fill="#0E1A2E" stroke="#141820" strokeWidth={12} /><rect y={960} width={1920} height={120} fill="#1E2228" /></>;
}

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K8_03_SECONDS));
  return raw;
})();

const VOL: Record<string, number> = { whoosh: 0.06, drone: 0.11, boom: 0.12, ding: 0.1, knock: 0.1, buzz: 0.08, pop: 0.08, tick: 0.08, static: 0.06, doorbell: 0.09, shot: 0.16, beep: 0.1, heart: 0.16, engine: 0.12, siren: 0.07 };
export const K8Video03: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K8_03_SECONDS;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: ramp(t, 0, 0.5) * (1 - ramp(t, END - 1.2, END)) }}>
        <TFrame bg="#0E1222">
          <LiveCam t={t} a={s.from} punch={0.03}>{s.r(t, s.from, s.to)}</LiveCam>
          {s.siren && <SirenIsik t={t} k={0.8} />}
          <Atmos t={t} tone={s.tone ?? "warm"} rays={s.tone === "night" ? 0.3 : 0.7} seed={n} />
        </TFrame>
        {s.html?.(t, s.from, s.to)}
      </AbsoluteFill>
      <Audio src={staticFile("audio/k8-03.wav")} />
      {TIMED.map((x, i) => i > 0 && x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.08) * fps))} durationInFrames={Math.round(2.2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={x.from > END - 20 ? 0.04 : VOL[x.sfx] ?? 0.07} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
