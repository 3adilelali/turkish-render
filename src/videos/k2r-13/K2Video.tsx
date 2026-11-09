import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k2r-13-words.json";
import { makeCue, ramp as rampRaw } from "../../lib/cues";
import { Brow, Eyes, Kitchen, Living, MOM, Mouth, Outfit, P, Pitch, T, TCam, TFig, TFrame, TPose, HERO, lerp, runPose, toonWalk } from "../../components/Toon";
import { Hastane } from "../../components/Toon2";
import { Abone, Chat, Kural, Landing, Tag, Txt, VideoCall, Yatak } from "../k2r-04/K2Video";
import { Motor, Yagmur } from "../../components/Para";
import { Ambulans } from "../../components/Dongu";
import { Apartman } from "../../components/Dusunce";
import { AcikDolap, Iskele, Isil, Rontgen, Tarti, Yakit } from "../../components/Iyi";
import { Atmos, Fore, LiveCam, Sweep, Tone } from "../../components/Live";

// Kanal 2 · k2r-13 · "Hiçbir Yaran Kalmıyor: Ama Her Gün 9 Bin Kalori Yemek Zorundasın" — TAMAMEN MOTOR, canlı katman.
// Sen: Yusuf (22, motokurye, Bayrampaşa). Annen. Elif (küçük kardeş). Hamdi abi (20 yıllık kurye). Doktor. Baban (Ankara, bekçi).
// Kan ve yara detaysız: iyileşme turuncu ışıltı, kırık röntgende.

const ALT: Record<string, string[]> = {
  "Annen ve küçük kardeşin Elif ile": ["Annen ve küçük kardeşin Elif'le"], "Mahallede çocuklar maç yaparken": ["kale direğine kafa attın"], "Ve telefonu kapatmadan önce baban": ["Ve telefonu kapatmadın önce babam"],
  "Gece saat on bir": ["Gece saat 11", "Gece saat 11."], "Yirmi iki yaşındasın": ["22 yaşındasın"], "Günde on iki saat": ["Günde 12 saat"],
  "Baban yedi yıl önce evden gitti": ["Baban 7 yıl önce evden gitti"], "Ve sen, on beş yaşından beri": ["Ve sen 15 yaşından beri", "Ve sen, 15 yaşından beri"],
  "Bir gecede kırk paket": ["Bir gecede 40 paket"], "Bir akşam, yirmi yıllık kurye": ["Bir akşam 20 yıllık kurye", "Bir akşam, 20 yıllık kurye"],
  "Sabah dört dilim ekmek": ["Sabah 4 dilim ekmek"], "Altı kilo vermiştin": ["6 kilo vermiştin"], "Günde sekiz, dokuz bin kalori": ["Günde 8-9 bin kalori", "Günde 8, 9 bin kalori", "Günde sekiz dokuz bin kalori"],
  "Normal bir insanın üç, dört katı": ["Normal bir insanın 3-4 katı", "Normal bir insanın 3, 4 katı"], "Ve şimdi, her gün üç kişilik": ["Ve şimdi her gün 3 kişilik"],
  "Yedi yıl önce baban gittiğinde": ["7 yıl önce baban gittiğinde"], "Yedi yıldır silmediğin bir numara": ["7 yıldır silmediğin bir numara"],
  "O iki gün hayatının en uzun": ["O 2 gün hayatının en uzun"], "E-5'in kenarında": ["E5'in kenarında", "E-5 'in kenarında"],
  "Dün akşamdan kalan pilavı": ["Dün akşamdan kalan pilav"], "Altı yumurtayı": ["6 yumurtayı"],
};
const ramp = (t: number, a: number, b: number) => (b - a > 0.01 ? rampRaw(t, a, b) : t >= b ? 1 : 0);
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const VAR: [RegExp, string][] = [[/â/g, "a"], [/î/g, "i"], [/û/g, "u"]];
const variants = (p: string) => { const out = [p]; for (const [re, to] of VAR) for (const v of [...out]) { const n = v.replace(re, to); if (n !== v) out.push(n); } return out; };
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K2R_13_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone; fore?: "column" | "curtain" | "lamp" | "rail" };

const G = 1040;
const SEN: Outfit = { ...HERO, top: "#1FC8B4", top2: "#159A8B", kind: "coat", inner: "#2A3346" };
const ANNE: Outfit = { ...MOM, top: "#7A5A8A", top2: "#5E4470", hair: "scarf", hairColor: "#D9C9E4" };
const ELIF: Outfit = { top: T.yellow, top2: T.yellow2, kind: "sweater", hair: "ponytail", hairColor: "#3A2A20" };
const HAMDI: Outfit = { top: "#3A3E48", top2: "#2A2E36", kind: "coat", inner: "#E05A2A", mustache: true, hair: "white" };
const DOKTOR: Outfit = { top: "#F7F7F5", top2: "#D9DCDF", kind: "coat", inner: "#3A6EA5", glasses: true };
const BABA: Outfit = { top: "#6A5A4A", top2: "#4E4236", kind: "coat", inner: "#C9B08A", mustache: true, hair: "white", glasses: true };
const SAGLIK: Outfit = { top: "#E05A2A", top2: "#B8461E", kind: "vest", inner: "#F4F4F2" };
const PATRON: Outfit = { top: "#3A6EA5", top2: "#2A5280", kind: "sweater", mustache: true };

type Face = { pose?: TPose; eyes?: Eyes; brow?: Brow; mouth?: Mouth; look?: number; lookY?: number; talk?: boolean; sweat?: boolean; dir?: 1 | -1 };
const fig = (o: Outfit) => (t: number, x: number, s = 1, f: Face = {}, y = G) => <TFig x={x} y={y} s={s} o={o} t={t} rim={0.4} {...f} />;
const sen = fig(SEN), anne = fig(ANNE), elif = fig(ELIF), hamdi = fig(HAMDI), doktor = fig(DOKTOR), baba = fig(BABA), saglik = fig(SAGLIK), patron = fig(PATRON);
const HY = (s: number, y = G) => y - 470 * s;
const walk = (t: number, a: number, b: number, o: Outfit, x0: number, x1: number, s = 1, f: Face = {}, run = false) => {
  if (run) return <TFig x={lerp(x0, x1, ramp(t, a, b))} y={G} s={s} o={o} t={t} pose={runPose((t - a) * 9)} dir={x1 > x0 ? 1 : -1} rim={0.4} {...f} />;
  const w = toonWalk(t, a, b, x0, x1, s); // ayak yerde kilitli yürüme (hareket kiti)
  return <TFig x={w.x} y={G} s={s} o={o} t={t} dir={w.dir} walk={w.walk} rim={0.4} {...f} />;
};
const yol = (t: number, heavy = 1) => <Yagmur t={t} heavy={heavy} shop={false} />;
const ev = (t: number, night = false) => <Living t={t} night={night} />;
const yatan = (t: number, x: number, y: number, f: Face = {}) => <g transform={`rotate(-80 ${x} ${y})`}>{sen(t, x, 0.95, { eyes: "closed", mouth: "frown", ...f }, y)}</g>;
const motor = (t: number, x: number, s = 1, ride = 0) => <g transform={`translate(${ride ? Math.sin(t * 20) * 2 : 0},0)`}><Motor x={x} y={G} s={s} t={t} c={T.red} /></g>;

const SHOTS: Sh[] = [
  // ── AN ──
  { c: "Bir motosiklet", sfx: "drone", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.05]} c0={[960, 600]}>{yol(t)}<g transform="rotate(-70 1200 1000)">{motor(t, 1200, 0.9)}</g></TCam>,
    html: (t, a) => <Txt t={t} at={a + 0.3} text="23:00 · E-5" y={70} size={70} /> },
  { c: "Yağmur yağıyor", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[860, 900]}>{yol(t, 1.4)}{yatan(t, 860, 1000)}</TCam> },
  { c: "Kask hâlâ kafanda", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[700, 960]}>{yol(t)}{yatan(t, 860, 1000)}<g transform="translate(1300,1010)"><rect x={-70} y={-60} width={140} height={100} rx={10} fill="#E0393E" stroke="#1A1A22" strokeWidth={5} /></g></TCam>,
    html: (t, a) => <Tag t={t} at={a + 0.6} text="PAKET YOLUN ORTASINDA" c={T.red} /> },
  { c: "Ve sol kolun, olmaması gereken", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.1]}><Rontgen t={t} bent={1} label="KIRIK" /></TCam> },
  { c: "Acıyı hissediyorsun", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.8, 3.1]} c0={[860, 960]}>{yol(t)}{yatan(t, 860, 1000, { eyes: "squint", brow: "worried", mouth: "open", sweat: true })}</TCam> },
  { c: "Acı azalıyor", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[860, 960]}>{yol(t)}{yatan(t, 860, 1000, { eyes: "wide", mouth: "o" })}<Isil x={760} y={960} t={t} r={120} k={ramp(t, a + 0.5, a + 1.5)} /></TCam> },
  { c: "Ve sen, kırık kolunun kendi kendine", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.1]}><Rontgen t={t} bent={1 - ramp(t, a + 0.5, b)} glow={1} /></TCam>,
    html: (t, a) => <Txt t={t} at={a + 1} text="SANİYELER İÇİNDE" y={70} size={80} color="#FFB040" /> },
  { c: "Ve aynı anda, hayatında hiç hissetmediğin", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#0B1220" /><Yakit t={t} v={lerp(0.6, 0.06, ramp(t, a, b))} kcal="AÇLIK" /></TCam> },

  // ── SEN ──
  { c: "Adın Yusuf", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.8]} c0={[860, 600]}><Apartman t={t} k={0} />{motor(t, 1200, 0.9)}{sen(t, 820, 1.1, { pose: P.wave, mouth: "grin" })}</TCam>,
    html: (t, a) => <><Tag t={t} at={a + 0.3} text="YUSUF · 22" c={SEN.top} /><Tag t={t} at={a + 1.2} text="MOTOKURYE" c={T.red} y={140} /></> },
  { c: "Günde on iki saat", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 760]}>{yol(t)}<g transform={`translate(${lerp(-400, 400, ramp(t, a, b))},0)`}>{motor(t, 960, 1, 1)}{sen(t, 940, 0.9, { pose: P.sit, mouth: "flat" }, 900)}</g></TCam>,
    html: (t, a) => <Txt t={t} at={a + 0.3} text="GÜNDE 12 SAAT" y={70} size={90} color="#F6D08A" /> },
  { c: "Annen ve küçük kardeşin Elif ile", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 600]}>{ev(t)}{anne(t, 760, 1, { mouth: "smile" })}{elif(t, 1000, 0.75, { mouth: "grin" })}{sen(t, 1240, 1, { mouth: "smile", look: -0.5 })}</TCam>,
    html: (t, a) => <Tag t={t} at={a + 0.6} text="BAYRAMPAŞA" c={T.blue} /> },
  { c: "Baban yedi yıl önce evden gitti", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 560]}><Landing t={t} open={1 - ramp(t, a + 1.5, a + 2.5)} /><g opacity={0.6}>{walk(t, a, a + 2, BABA, 960, 1500, 1, { mouth: "flat" })}</g></TCam>,
    html: (t, a) => <Tag t={t} at={a + 0.4} text="7 YIL ÖNCE" c={T.blue} /> },
  { c: "Ve sen, on beş yaşından beri", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[960, HY(1) + 150]}>{ev(t)}{sen(t, 960, 1, { mouth: "flat", brow: "worried" })}</TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="EVİN ERKEĞİ" y={820} size={110} /> },

  // ── İLK GECE ──
  { c: "O gece seni çarpan araba durmadı", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 700]}>{yol(t)}{Array.from({ length: 2 }, (_, i) => <circle key={i} cx={lerp(800, 1900, ramp(t, a, a + 1.5)) + i * 60} cy={900} r={18} fill="#F05A4A" opacity={1 - ramp(t, a + 1, a + 1.6)} />)}</TCam> },
  { c: "Sen kalktın. Kolunu oynattın", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.3]} c0={[960, HY(1) + 150]}>{yol(t)}{sen(t, 960, 1, { pose: P.wave, eyes: "wide", mouth: "o" })}</TCam>,
    html: (t, a) => <Txt t={t} at={a + 1.2} text="NE SIYRIK, NE MORLUK" y={820} size={90} /> },
  { c: "Ne bir sıyrık", r: (t, a, b) => again("Sen kalktın. Kolunu oynattın", t, a, b, 0) },
  { c: "Ambulans geldiğinde", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 640]}>{yol(t, 0.6)}<Ambulans x={1300} y={G} s={0.9} t={t} />{saglik(t, 760, 1, { pose: P.shrug, mouth: "open", talk: true, look: 0.4 })}</TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="“KAZA KİMİN BAŞINA GELDİ?”" y={820} size={84} /> },
  { c: "Adam güldü", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[760, HY(1) + 150]}>{yol(t, 0.6)}{saglik(t, 760, 1, { mouth: "grin", eyes: "happy", talk: true, look: 0.4 })}</TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“SENİN HİÇBİR ŞEYİN YOK Kİ.”" y={820} size={84} /> },
  { c: "Ve eve gittin. Buzdolabını açtın", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 560]}><AcikDolap t={t} empty={0} /></TCam> },
  { c: "Ve içindeki her şeyi yedin", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.15]} c0={[960, 560]}><AcikDolap t={t} empty={ramp(t, a + 0.3, b + 3)} /></TCam>,
    html: (t, a) => <>{["PİLAV", "YARIM TAVUK", "6 YUMURTA", "REÇEL"].map((l, i) => <Tag key={i} t={t} at={a + 1 + i * 0.6} text={l} c={[T.yellow, T.orange, T.blue, T.pink][i]} x={140} y={160 + i * 110} />)}</> },
  { c: "yarım tavuğu, altı", r: (t, a, b) => again("Ve içindeki her şeyi yedin", t, a, b, 0) },
  { c: "Ve hâlâ açtın", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[960, HY(1) + 150]}><Kitchen t={t} /><rect width={1920} height={1080} fill="#0E1626" opacity={0.4} />{sen(t, 960, 1, { mouth: "open", brow: "worried", eyes: "wide", sweat: true })}</TCam> },

  // ── KURAL 1 ──
  { c: "Ertesi gün bir şey denedin", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 560]}><Kitchen t={t} />{sen(t, 960, 1, { pose: P.hold, mouth: "flat", lookY: 0.5 })}</TCam> },
  { c: "Çizik birkaç saniye kızardı", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]}><rect width={1920} height={1080} fill="#E9E2D2" /><g transform="translate(960,560) scale(2.4)"><path d="M-160,120 Q-180,0 -120,-60 L-100,-200 Q-80,-220 -60,-200 L-50,-60 L-30,-220 Q-10,-240 10,-220 L10,-60 L40,-200 Q60,-220 80,-200 L60,-40 L110,-100 Q140,-110 140,-80 L90,60 Q60,160 20,180Z" fill="#FBE7D2" stroke="#1A1A22" strokeWidth={4} /><path d="M-6,-150 l20,40" stroke="#E86A6A" strokeWidth={5} strokeLinecap="round" opacity={1 - ramp(t, a + 1, a + 2.2)} /></g><Isil x={960} y={260} t={t} r={80} k={ramp(t, a + 0.8, a + 1.4) * (1 - ramp(t, a + 2.2, a + 2.8))} /></TCam>,
    html: (t, a) => <Tag t={t} at={a + 2.2} text="İZ YOK" c="#2EE6D0" /> },
  { c: "Annen arkandan gördü", sfx: "boom", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[1100, 600]}><Kitchen t={t} />{anne(t, 1150, 1, { pose: P.shock, mouth: "open", eyes: "wide" })}<g transform={`translate(1220,${lerp(HY(1) + 220, 1010, ramp(t, a + 0.2, a + 0.8))})`}><ellipse rx={60} ry={14} fill="#F4F4F2" stroke="#1A1A22" strokeWidth={4} /></g></TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="“YUSUF… SEN NE YAPTIN?”" y={820} size={90} /> },
  { c: "İlk kural", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><Kural t={t} a={a + 0.2} n="1" line="Her yara saniyeler içinde kapanır. Ne iz kalır, ne acı." /></TCam> },

  // ── OYUN ──
  { c: "Ve bu güç kuryeliği değiştirdi", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 760]}>{yol(t, 0.8)}<g transform={`translate(${lerp(-500, 500, ramp(t, a, b))},0)`}>{motor(t, 960, 1, 1)}{sen(t, 940, 0.9, { pose: P.sit, mouth: "grin" }, 900)}</g></TCam> },
  { c: "Trafikten korkmuyordun. Herkesten", r: (t, a, b) => again("Ve bu güç kuryeliği değiştirdi", t, a, b, 0) },
  { c: "Bir gecede kırk paket", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#2A3346" />{Array.from({ length: 40 }, (_, i) => <rect key={i} x={260 + (i % 10) * 140} y={260 + Math.floor(i / 10) * 140} width={100} height={90} rx={10} fill={T.red} stroke="#1A1A22" strokeWidth={4} opacity={ramp(t, a + i * 0.04, a + 0.2 + i * 0.04)} />)}</TCam>,
    html: (t, a) => <Txt t={t} at={a + 1.8} text="40 PAKET · AYIN KURYESİ" y={880} size={80} color="#F6D08A" /> },
  { c: "Patron seni ayın kuryesi seçti", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 560]}><Apartman t={t} k={0} />{patron(t, 1150, 1, { pose: P.point, mouth: "grin", talk: true, look: -0.5 })}{sen(t, 800, 1, { pose: P.cheer, mouth: "grin" })}</TCam> },
  { c: "Mahallede çocuklar maç yaparken", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 600]}><Pitch t={t} />{sen(t, 960, 1, { pose: P.run, mouth: "grin" })}</TCam> },
  { c: "Hiçbir şey olmadı. Herkes güldü", sfx: "knock", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.3]} c0={[960, HY(1) + 150]}><Pitch t={t} />{sen(t, 960, 1, { mouth: "grin", eyes: "happy" })}<Isil x={960} y={HY(1) + 60} t={t} r={70} k={1 - ramp(t, a + 0.8, a + 1.6)} /></TCam> },
  { c: "Elif sana bakıp gülümsedi", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[960, HY(0.75) + 100]}><Pitch t={t} />{elif(t, 960, 0.75, { mouth: "grin", eyes: "happy", talk: true })}</TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="“ABİM SÜPER KAHRAMAN.”" y={820} size={96} /> },
  { c: "Ve sen de öyle hissettin", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[960, HY(1) + 150]}><Pitch t={t} />{sen(t, 960, 1, { pose: P.hips, mouth: "grin" })}</TCam> },

  // ── HAMDİ ABİ ──
  { c: "Ama korkusuzluk başka bir şeye", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 700]}>{yol(t, 0.5)}<g transform={`translate(${lerp(-600, 600, ramp(t, a, b))},0)`}>{motor(t, 960, 1, 1)}{sen(t, 940, 0.9, { pose: P.sit, mouth: "grin" }, 900)}</g><circle cx={1700} cy={300} r={40} fill="#E0393E" /></TCam> },
  { c: "Kırmızı ışıklarda durmamaya başladın", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[1500, 400]}>{yol(t, 0.5)}<g transform="translate(1500,600)"><rect x={-10} y={-300} width={20} height={300} fill="#3A3E48" /><rect x={-50} y={-460} width={100} height={200} rx={16} fill="#1A1A22" /><circle cy={-420} r={30} fill="#E0393E" /><circle cy={-360} r={30} fill="#3A2A20" /><circle cy={-300} r={30} fill="#1E3A2A" /></g></TCam>,
    html: (t, a) => <Tag t={t} at={a + 0.6} text="TERS YÖN · KALDIRIM" c={T.red} /> },
  { c: "kaldırımdan, ters yönden", r: (t, a, b) => again("Kırmızı ışıklarda durmamaya başladın", t, a, b, 0) },
  { c: "Bir akşam, yirmi yıllık kurye", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 600]}>{yol(t, 0.3)}{motor(t, 700, 0.9)}{hamdi(t, 1150, 1, { pose: P.hand, mouth: "flat", look: -0.6 })}{sen(t, 820, 1, { mouth: "grin", look: 0.6 })}</TCam>,
    html: (t, a) => <Tag t={t} at={a + 0.6} text="HAMDİ ABİ · 20 YILLIK KURYE" c={HAMDI.inner} /> },
  { c: "Kaskını çıkardı", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[1150, HY(1) + 150]}>{yol(t, 0.3)}{hamdi(t, 1150, 1, { mouth: "flat", brow: "worried", talk: true, look: -0.6 })}</TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“BEN BU YOLLARDA ÇOK ÇOCUK GÖMDÜM.”" y={820} size={74} /> },
  { c: "Sen güldün", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[820, HY(1) + 150]}>{yol(t, 0.3)}{sen(t, 820, 1, { mouth: "grin", eyes: "happy", talk: true, look: 0.6 })}</TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="“ABİ BANA BİR ŞEY OLMAZ.”" y={820} size={88} /> },
  { c: "Hamdi abi gülmedi", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.8, 3.1]} c0={[1150, HY(1) + 140]}>{yol(t, 0.3)}{hamdi(t, 1150, 1, { mouth: "flat", brow: "angry", talk: true, look: -0.6 })}</TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.35} text="“SANA OLMAZ BELKİ. AMA SENİN ÇARPTIĞIN TEYZEYE OLUR.”" y={820} size={58} /> },
  { c: "O gece eve dönerken, ilk kez", sfx: "ding", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[1200, 600]}>{yol(t, 0.5)}{motor(t, 1000, 1)}{sen(t, 980, 0.9, { pose: P.sit, mouth: "flat", lookY: -0.3, look: 0.6 }, 900)}<g transform="translate(1500,600)"><rect x={-10} y={-300} width={20} height={300} fill="#3A3E48" /><rect x={-50} y={-460} width={100} height={200} rx={16} fill="#1A1A22" /><circle cy={-420} r={30} fill="#E0393E" /></g></TCam>,
    html: (t, a) => <Tag t={t} at={a + 1.2} text="KIRMIZIDA DURDUN" c={T.red} /> },

  // ── KURAL 2 ──
  { c: "Ama açlık hiç geçmiyordu", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#0B1220" /><Yakit t={t} v={0.2} kcal="AÇ" /></TCam> },
  { c: "Sabah dört dilim ekmek", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#F2E6D0" />{[["SABAH", "4 DİLİM EKMEK · 6 YUMURTA"], ["ÖĞLEN", "2 PORSİYON PİLAV"], ["AKŞAM", "NE VARSA"], ["GECE", "+1 DÖNER"]].map(([h, l], i) => <g key={i} opacity={ramp(t, a + 0.3 + i * 0.9, a + 0.6 + i * 0.9)}><rect x={300} y={200 + i * 170} width={1320} height={130} rx={24} fill="#FFFFFF" stroke="#1A1A22" strokeWidth={4} /><text x={350} y={285 + i * 170} fontFamily="Poppins" fontWeight={800} fontSize={48} fill={T.red}>{h}</text><text x={680} y={285 + i * 170} fontFamily="Poppins" fontWeight={700} fontSize={44} fill="#1C1C1C">{l}</text></g>)}</TCam> },
  { c: "akşam ne varsa", r: (t, a, b) => keep("Sabah dört dilim ekmek", t, b) },
  { c: "Bir hafta sonra tartıya çıktın", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 700]}><rect width={1920} height={1080} fill="#DCEBF0" /><Tarti t={t} kg={66} from={72} at={a + 0.8} s={1.4} /></TCam>,
    html: (t, a) => <Txt t={t} at={a + 2.2} text="−6 KG" y={160} size={150} color="#F05A4A" /> },
  { c: "Yüzün çökmüştü", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[3, 3.3]} c0={[960, HY(0.9) + 110]}><rect width={1920} height={1080} fill="#DCEBF0" />{sen(t, 960, 0.9, { eyes: "squint", mouth: "frown", brow: "worried" })}</TCam> },
  { c: "Ve bir gün işte, yemek yiyemediğin", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 860]}>{yol(t, 0.3)}{motor(t, 960, 1.2)}{sen(t, 760, 1, { pose: P.reach, mouth: "open", brow: "worried", sweat: true })}</TCam> },
  { c: "Yara kapanmadı", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.9]} c0={[860, HY(1) + 220]}>{yol(t, 0.3)}{sen(t, 760, 1, { pose: P.hold, mouth: "o", eyes: "wide", brow: "worried" })}<Isil x={860} y={HY(1) + 220} t={t} r={50} k={0.3 + Math.sin(t * 2) * 0.15} /></TCam>,
    html: (t, a) => <Tag t={t} at={a + 0.8} text="SADECE YAVAŞLADI" c={T.red} /> },
  { c: "İkinci kural", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><Kural t={t} a={a + 0.2} n="2" line="İyileşmek için beden yakıt ister. Yemezsen iyileşme durur ve beden seni yer." /></TCam> },

  // ── HESAP ──
  { c: "Yemezsen iyileşme duruyor", r: (t, a, b) => keep("İkinci kural", t, b), html: (t, a, b) => keepH("İkinci kural", t, b) },
  { c: "O akşam bir hesap yaptın", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#0B1220" /><Yakit t={t} v={ramp(t, a, b) * 0.3} kcal="9.000 KCAL / GÜN" /></TCam>,
    html: (t, a) => <Txt t={t} at={a + 1.6} text="NORMAL BİR İNSANIN 3–4 KATI" y={900} size={70} /> },
  { c: "Peki bunun parası", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#F2E6D0" />{[["KURYE MAAŞI", T.green, 0.9], ["KİRA", T.red, 0.45], ["FATURALAR", T.orange, 0.2], ["ELİF'İN OKULU", T.purple, 0.15], ["3 KİŞİLİK YEMEK", T.red, 0.5]].map(([l, c, v], i) => <g key={i} opacity={ramp(t, a + 0.3 + i * 0.6, a + 0.6 + i * 0.6)}><text x={240} y={240 + i * 150} fontFamily="Poppins" fontWeight={800} fontSize={44} fill="#1C1C1C">{l}</text><rect x={760} y={196 + i * 150} width={1000 * (v as number)} height={60} rx={20} fill={c as string} stroke="#1A1A22" strokeWidth={4} /></g>)}</TCam> },
  { c: "faturalar, Elif'in okul", r: (t, a, b) => keep("Peki bunun parası", t, b) },
  { c: "Annen sessizce kendi tabağını", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 640]}><Kitchen t={t} />{anne(t, 1100, 1, { pose: P.hand, mouth: "smile", eyes: "squint", look: -0.5, talk: true })}{sen(t, 820, 0.95, { pose: P.sit, mouth: "flat", look: 0.5 })}</TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="“BEN TOKUM OĞLUM.”" y={820} size={100} /> },
  { c: "Ben tokum oğlum", r: (t, a, b) => again("Annen sessizce kendi tabağını", t, a, b, 0) },
  { c: "Bir gece mutfakta onu ağlarken gördün", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[1000, HY(1) + 180]}><Kitchen t={t} /><rect width={1920} height={1080} fill="#0E1626" opacity={0.45} />{anne(t, 1000, 1, { pose: P.sit, eyes: "closed", mouth: "frown", brow: "worried" })}</TCam>,
    html: (t, a) => <Tag t={t} at={a + 1} text="BOŞ PAZAR CÜZDANI" c={T.purple} /> },
  { c: "O gece buzdolabına hiç dokunmadın", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 560]}><AcikDolap t={t} empty={0.7} /></TCam> },
  { c: "Ve sabah işe gittiğinde", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]}><rect width={1920} height={1080} fill="#E9E2D2" /><g transform="translate(960,560) scale(2.4)"><path d="M-160,120 Q-180,0 -120,-60 L-100,-200 Q-80,-220 -60,-200 L-50,-60 L-30,-220 Q-10,-240 10,-220 L10,-60 L40,-200 Q60,-220 80,-200 L60,-40 L110,-100 Q140,-110 140,-80 L90,60 Q60,160 20,180Z" fill="#F0DCC8" stroke="#1A1A22" strokeWidth={4} /><path d="M-60,40 l50,-10" stroke="#D88A7A" strokeWidth={5} strokeLinecap="round" /></g></TCam>,
    html: (t, a) => <Tag t={t} at={a + 1} text="AKŞAMA KADAR KAPANMADI" c={T.red} /> },

  // ── KAZA ──
  { c: "Ve sonra o gün geldi", sfx: "drone", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.1]} c0={[960, 600]}>{yol(t, 1.2)}</TCam> },
  { c: "Bir yokuşta, ıslak asfaltta motor kaydı", sfx: "boom", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 760]} shake={ramp(t, a + 0.8, a + 1) * (1 - ramp(t, a + 1.3, a + 1.8))}>{yol(t, 1.2)}<g transform={`translate(${lerp(-300, 200, ramp(t, a, a + 1))},0) rotate(${ramp(t, a + 0.6, a + 1.2) * -70} 960 ${G})`}>{motor(t, 960, 1, 1)}</g></TCam> },
  { c: "Ve elin bükülmüş", r: (t, a, b) => again("Bir yokuşta, ıslak asfaltta motor kaydı", t, a, b, 0) },
  { c: "Elini çektin. Ve iyileşme başladı", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[860, 960]}>{yol(t, 1)}{yatan(t, 860, 1000, { eyes: "squint", brow: "worried", mouth: "open" })}<Isil x={700} y={960} t={t} r={90} /></TCam> },
  { c: "Ama bir şey yanlıştı", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.1]}><Rontgen t={t} bent={ramp(t, a + 0.3, b)} glow={1} /></TCam>,
    html: (t, a) => <Tag t={t} at={a + 1.5} text="EĞRİ · YAMUK" c={T.red} /> },
  { c: "yamuk. Kemikler yerine", r: (t, a, b) => again("Ama bir şey yanlıştı", t, a, b, 0) },
  { c: "Hastanede doktor röntgene baktı", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[1100, 560]}><Hastane t={t} />{doktor(t, 1100, 1, { mouth: "o", eyes: "wide", brow: "worried", look: 0.5 })}</TCam> },
  { c: "Bu nasıl oldu böyle", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]}><Rontgen t={t} bent={1} label="YANLIŞ KAYNAMIŞ" /></TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“YILLAR ÖNCE KIRILIP YANLIŞ KAYNAMIŞ GİBİ.”" y={70} size={60} /> },

  // ── KURAL 3 ──
  { c: "Doktor bir şey söyledi", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[1100, HY(1) + 150]}><Hastane t={t} />{doktor(t, 1100, 1, { mouth: "flat", talk: true, look: -0.5 })}</TCam> },
  { c: "Beden aceleci, dedi", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 560]}><Hastane t={t} />{doktor(t, 1150, 1, { pose: P.point, mouth: "flat", talk: true, look: -0.5 })}{sen(t, 780, 0.95, { pose: P.sit, mouth: "flat", look: 0.5 }, 900)}</TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“KEMİK NASIL DURUYORSA, ÖYLE KAYNAR.”" y={820} size={74} /> },
  { c: "Düzeltmenin tek yolu var", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#14203A" /></TCam>,
    html: (t, a, b) => <Txt t={t} at={a + 0.4} text="YENİDEN AÇMAK. VE DOĞRU YERDE TUTMAK." y={420} size={86} color="#2EE6D0" /> },
  { c: "Ertesi gün ameliyata girdin", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.1]}><Rontgen t={t} bent={1 - ramp(t, a + 1, b)} label="SABIRLA · TEK TEK" /></TCam> },
  { c: "Ve sen, iyileşmeyi durdurmak için", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#0B1220" /><Yakit t={t} v={lerp(0.3, 0.02, ramp(t, a, b))} kcal="0 KCAL · 2 GÜN" /></TCam> },
  { c: "Çünkü kemiğin doğru", r: (t, a, b) => again("Ve sen, iyileşmeyi durdurmak için", t, a, b, 0) },
  { c: "O iki gün hayatının en uzun", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[900, HY(0.95, 900) + 160]}><Hastane t={t} night />{sen(t, 900, 0.95, { pose: P.sit, eyes: "squint", mouth: "frown", brow: "worried", sweat: true }, 900)}</TCam> },
  { c: "Ama sonunda eline baktığında", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.1]}><Rontgen t={t} bent={0} label="DÜMDÜZ" /></TCam> },
  { c: "Üçüncü kural", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><Kural t={t} a={a + 0.2} n="3" line="Beden nasıl duruyorsa öyle iyileşir. Hızlı iyileşmek, doğru iyileşmek değil." /></TCam> },

  // ── BABA ──
  { c: "O gece hastane yatağında düşündün", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[900, 640]}><Hastane t={t} night />{sen(t, 900, 0.95, { pose: P.sit, eyes: "open", lookY: -0.6, mouth: "flat" }, 900)}</TCam> },
  { c: "Yedi yıl önce baban gittiğinde", tone: "cool", r: (t, a, b) => again("Baban yedi yıl önce evden gitti", t, a, b, 1),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="HİÇ AĞLAMADIN" c={T.blue} /> },
  { c: "Ertesi gün işe başladın", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#F2E6D0" />{["İŞE BAŞLADIN", "OKULU BIRAKTIN", "EVİN ERKEĞİ OLDUN"].map((l, i) => <g key={i} opacity={ramp(t, a + 0.3 + i * 0.8, a + 0.6 + i * 0.8)}><rect x={460} y={260 + i * 190} width={1000} height={140} rx={30} fill="#FFFFFF" stroke="#1A1A22" strokeWidth={5} /><text x={960} y={352 + i * 190} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={56} fill="#1C1C1C">{l}</text></g>)}</TCam> },
  { c: "Herkes seni güçlü", r: (t, a, b) => again("Ertesi gün işe başladın", t, a, b, 0) },
  { c: "Ama o yara da çok hızlı kapanmıştı", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]}><Rontgen t={t} bent={0.8} label="EĞRİ KAYNAMIŞ BİR YARA" /></TCam> },
  { c: "Her öfkende, her", r: (t, a, b) => again("Ama o yara da çok hızlı kapanmıştı", t, a, b, 0) },
  { c: "Telefonunu açtın", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[900, HY(0.95, 900) + 160]}><Hastane t={t} night />{sen(t, 900, 0.95, { pose: P.phone, mouth: "flat", brow: "worried" }, 900)}</TCam>,
    html: (t, a) => <Tag t={t} at={a + 0.8} text="BABAM · 7 YIL" c={T.blue} /> },
  { c: "Ve ilk kez, aradın", sfx: "ding", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.15]} c0={[960, 560]}><VideoCall t={t}>{baba(t, 960, 1.4, { mouth: "flat", eyes: "squint" }, 1240)}</VideoCall></TCam> },

  // ── KONUŞMA ──
  { c: "Baban Ankara'daydı", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 600]}><rect width={1920} height={1080} fill="#1A1E2C" /><Iskele t={t} dusk={0} /><rect width={1920} height={1080} fill="#0E1626" opacity={0.5} />{baba(t, 600, 1, { pose: P.phone, mouth: "flat", brow: "worried" })}</TCam>,
    html: (t, a) => <Tag t={t} at={a + 0.4} text="ANKARA · ŞANTİYE BEKÇİSİ" c={T.blue} /> },
  { c: "Sesini duyunca sustu", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.9]} c0={[600, HY(1) + 150]}><Iskele t={t} /><rect width={1920} height={1080} fill="#0E1626" opacity={0.5} />{baba(t, 600, 1, { pose: P.phone, mouth: "flat", eyes: "closed" })}</TCam> },
  { c: "Sonra konuştunuz", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.1]} c0={[960, 560]}><Chat t={t} name="Babam" msgs={[["(arama · 1 saat)", false, a + 0.3], ["(arama · 2 saat)", true, a + 1]]} c="#5A4A3A" /></TCam>,
    html: (t, a) => <>{["BORÇLAR", "UTANÇ", "YÜZÜNÜ GÖSTEREMEDİ"].map((l, i) => <Tag key={i} t={t} at={a + 1.6 + i * 0.6} text={l} c={T.blue} x={120} y={200 + i * 120} />)}</> },
  { c: "Borçlarını, utancını, sana", r: (t, a, b) => again("Sonra konuştunuz", t, a, b, 0) },
  { c: "Sen bağırdın. O ağladı", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 600]}><rect width={1920} height={1080} fill="#14203A" /><line x1={960} y1={0} x2={960} y2={1080} stroke="#5FF2E2" strokeWidth={4} />{sen(t, 560, 1, { pose: P.phone, mouth: "open", brow: "angry", talk: true })}{baba(t, 1360, 1, { pose: P.phone, eyes: "closed", mouth: "frown", brow: "worried", dir: -1 })}</TCam> },
  { c: "Ve telefonu kapatmadan önce baban", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.9]} c0={[1360, HY(1) + 150]}><rect width={1920} height={1080} fill="#14203A" />{baba(t, 1360, 1, { pose: P.phone, eyes: "squint", mouth: "flat", talk: true, dir: -1 })}</TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“BİR GÜN SENİ GÖRMEYE GELEBİLİR MİYİM?”" y={820} size={70} /> },
  { c: "Sen hemen cevap vermedin", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.9]} c0={[560, HY(1) + 150]}><rect width={1920} height={1080} fill="#14203A" />{sen(t, 560, 1, { pose: P.phone, eyes: "closed", mouth: "flat" })}</TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="BU YARA DA ZAMAN İSTİYORDU" y={820} size={80} /> },

  // ── ELİF ──
  { c: "Bir ay sonra, mahallede bir inşaat", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[1100, 540]}><Iskele t={t} dusk={1} /></TCam>,
    html: (t, a) => <Tag t={t} at={a + 0.4} text="BİR AY SONRA" c={T.blue} /> },
  { c: "Elif o sırada altından geçiyordu", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[1100, 700]}><Iskele t={t} dusk={1} fall={ramp(t, b - 0.8, b + 1) * 0.3} />{walk(t, a, b + 2, ELIF, 600, 1200, 0.75, { mouth: "smile" })}</TCam> },
  { c: "Sen motordan atladın. Koştun", sfx: "boom", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 700]}><Iskele t={t} dusk={1} fall={0.3 + ramp(t, a, b) * 0.3} />{walk(t, a, b, SEN, 200, 1050, 1, { brow: "worried", mouth: "open" }, true)}{elif(t, 1150, 0.75, { pose: P.shock, mouth: "o", eyes: "wide", lookY: -0.6 })}</TCam> },
  { c: "Demir borular sırtına çarptı", sfx: "knock", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[1100, 800]} shake={Math.max(0, Math.sin((t - a) * 6)) * 0.6}><Iskele t={t} dusk={1} fall={1} />{sen(t, 1100, 1, { pose: P.hold, eyes: "closed", brow: "worried", mouth: "frown" }, 1060)}</TCam>,
    html: (t, a, b) => <Txt t={t} at={a + 0.4} text={t < a + (b - a) * 0.33 ? "BİR." : t < a + (b - a) * 0.66 ? "İKİ." : "ÜÇ."} y={70} size={110} color="#F05A4A" /> },
  { c: "Elif hiç yara almadı", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[1200, HY(0.75) + 120]}><Iskele t={t} dusk={1} fall={1} />{elif(t, 1240, 0.75, { mouth: "o", eyes: "wide", brow: "worried" })}</TCam> },
  { c: "Ama bu sefer, iyileşmeye başlamadan önce", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[960, 980]}><Iskele t={t} dusk={1} fall={1} />{yatan(t, 960, 1060, { eyes: "closed", mouth: "flat" })}</TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="KIPIRDAMADIN. BEKLEDİN." y={70} size={90} /> },
  { c: "Kıpırdamadın. Kemiklerin yerine", r: (t, a, b) => again("Ama bu sefer, iyileşmeye başlamadan önce", t, a, b, 0) },
  { c: "Ve ancak o zaman, bedeninin", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.1]}><Rontgen t={t} bent={0} glow={1} label="ÖNCE YERİNE OTURDU" /></TCam> },
  { c: "Kalktığında Elif ağlıyordu", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 640]}><Iskele t={t} dusk={1} fall={1} />{sen(t, 860, 1, { mouth: "smile", eyes: "squint" })}{elif(t, 1060, 0.75, { mouth: "frown", eyes: "closed", brow: "worried" })}{walk(t, a, b, ANNE, 1800, 1300, 1, { mouth: "open", brow: "worried" }, true)}</TCam>,
    html: (t, a) => <Tag t={t} at={a + 1.5} text="SICAK BİR TORBA EKMEK" c={T.orange} /> },

  // ── KAPANIŞ ──
  { c: "Ve elinde mahallenin", r: (t, a, b) => again("Kalktığında Elif ağlıyordu", t, a, b, 0) },
  { c: "O bayram, kapı çalındı", sfx: "knock", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 560]}><Landing t={t} open={0} /></TCam>,
    html: (t, a) => <Tag t={t} at={a + 0.4} text="BAYRAM" c={T.green} /> },
  { c: "Kapıda elinde bir kutu baklavayla", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 560]}><Landing t={t} open={1} />{baba(t, 960, 1, { pose: P.hold, mouth: "flat", eyes: "squint", brow: "worried" })}<g transform={`translate(960,${HY(1) + 230})`}><rect x={-90} y={-40} width={180} height={70} rx={8} fill="#F6C445" stroke="#1A1A22" strokeWidth={4} /></g></TCam> },
  { c: "Sen kapıyı açtın", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[860, HY(1) + 150]}><Landing t={t} open={1} />{sen(t, 820, 1, { mouth: "flat", look: 0.5 })}</TCam> },
  { c: "Sadece içeri buyur ettin", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 600]}>{ev(t)}{sen(t, 760, 1, { pose: P.hand, mouth: "smile", look: 0.5 })}{walk(t, a, b, BABA, 1400, 1150, 1, { mouth: "smile", eyes: "squint" })}{anne(t, 1600, 1, { mouth: "flat", look: -0.5 })}</TCam> },
  { c: "Çünkü öğrendin", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#14203A" /></TCam>,
    html: (t, a) => <Txt t={t} at={a + 0.5} text="BAZI YARALAR HIZLI KAPANIR. AMA ÖNCE YERİNE OTURMASI GEREKİR." y={400} size={64} color="#FFB040" /> },
  { c: "doğru kapanması için", r: (t, a, b) => keep("Çünkü öğrendin", t, b), html: (t, a, b) => keepH("Çünkü öğrendin", t, b) },
  { c: "Peki sen olsan", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#F2E6D0" />{["9.000 KCAL'A RAZIYIM 🍗", "YARA ALIRIM, YİNE DE 🩹"].map((l, i) => <g key={i} opacity={ramp(t, a + 0.4 + i * 1.6, a + 0.7 + i * 1.6)}><rect x={160 + i * 840} y={360} width={760} height={240} rx={40} fill={[T.red, "#1FC8B4"][i]} stroke="#1A1A22" strokeWidth={6} /><text x={540 + i * 840} y={500} textAnchor="middle" fontFamily="Patrick Hand, sans-serif" fontSize={58} fill="#FFFFFF">{l}</text></g>)}</TCam> },
  { c: "Ve hayatında, eğri kaynamış hangi yarayı", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]}><Rontgen t={t} bent={0.6} label="SENİNKİ HANGİSİ?" /></TCam> },
  { c: "Yorumlara yaz", tone: "warm", r: (t, a, b) => again("Sadece içeri buyur ettin", t, a, b, 2) },
  { c: "Ve böyle hikâyeler için abone", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 520]}><Apartman t={t} k={1} /></TCam>,
    html: (t, a) => <Abone t={t} at={a + 0.3} /> },
];

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : s.c.startsWith("+") ? after - 0.2 + parseFloat(s.c) : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K2R_13_SECONDS));
  return raw;
})();

const VOL: Record<string, number> = { whoosh: 0.07, drone: 0.14, boom: 0.15, ding: 0.14, knock: 0.1 };
export const K2RVideo13: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K2R_13_SECONDS;
  const cut = 1 - ramp(t, s.from, s.from + 0.14);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: ramp(t, 0, 0.5) * (1 - ramp(t, END - 1.2, END)) }}>
        <TFrame>
          <LiveCam t={t} a={s.from}>{s.r(t, s.from, s.to)}</LiveCam>
          {s.fore && <Fore t={t} a={s.from} kind={s.fore} c="#2A2F38" />}
          <Atmos t={t} tone={s.tone ?? "warm"} rays={s.tone === "night" ? 0.4 : 0.8} seed={n} />
          <Sweep t={t} a={s.from} />
        </TFrame>
        {s.html?.(t, s.from, s.to)}
        <AbsoluteFill style={{ background: "#FFFFFF", opacity: cut * 0.22, pointerEvents: "none" }} />
      </AbsoluteFill>
      <Audio src={staticFile("audio/k2r-13.wav")} />
      {TIMED.map((x, i) => i > 0 && !(x.from > END - 19 && x.sfx && x.sfx !== "whoosh") && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.08) * fps))} durationInFrames={Math.round(2.2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.from > END - 19 ? 0.05 : VOL[x.sfx ?? "whoosh"] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const _unused = { MOM, Yatak };

const AG = [[1.22, -90, -40], [1.3, 110, 30], [1.18, 0, 60]];
function again(c: string, t: number, a: number, b: number, q: number) {
  const s0 = SHOTS.find((x) => x.c === c);
  if (!s0) return null;
  const [z, dx, dy] = AG[q % AG.length];
  return <g transform={`translate(${960 + dx} ${540 + dy}) scale(${z}) translate(-960 -540)`}>{s0.r(t, a, b)}</g>;
}

// Kart/liste sahnesini kırpmadan, ilk başladığı andan devam ettirir.
function keep(c: string, t: number, b: number) { const s0 = TIMED.find((x) => x.c === c); return s0 ? s0.r(t, s0.from, b) : null; }
function keepH(c: string, t: number, b: number) { const s0 = TIMED.find((x) => x.c === c); return s0?.html ? s0.html(t, s0.from, b) : null; }
