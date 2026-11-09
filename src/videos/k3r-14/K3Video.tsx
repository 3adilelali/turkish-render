import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k3r-14-words.json";
import { makeCue, ramp } from "../../lib/cues";
import { H, Sky, lerp } from "../../components/Harem";
import { Akce, Cesme } from "../../components/HaremPlus";
import { Cadir as Otag, Cami } from "../../components/HaremPlus2";
import { Abone, Belge, Disc, NameCard, Paper, Tag, Txt } from "../../components/K3Text";
import { Sipahiler } from "../../components/Kira";
import { Yayla, Horse, Camel, OldLetter, Steppe } from "../../components/Eras";
import { Cadir, CadirIc2, CeyizDuvar, KinaEller } from "../../components/Gelin";
import { DugunAlay, Mezarlik } from "../../components/Dadi";
import { Senlik, Sandik } from "../../components/Cengi";
import { EskiSaray, Yelkenli } from "../../components/Hazine";
import { Atmos, Fore, LiveCam, Sweep, Tone } from "../../components/Live";
import { act } from "../../components/Motion";
import { ForeColumns, GalleryWall, HasBahce, Fiskiye, Laleler, Motes, NightVeil, P, PCam, PFig, PFrame, Petals, proWalk, Samdan, Sedir2, ValideOda, Birds } from "../../components/HaremPro";
import { Ates, Gul, GulKutu, KafesIc, Muhurlu } from "../../components/HaremPrenses";
import { SerbetTepsi } from "../../components/HaremHamile";

// Kanal 1 · k3r-14 · "Osmanlı Sarayına Gelin Giden Düşman Prensesi Olmak Neden Zordu?" — HaremPro kiti.
// Sen: Selvinaz (16, Dulkadir bey kızı, Elbistan). Şehzade (adsız; tebdil-i kıyafetle "Yusuf"). BELGE: Sitti Şah Hatun (gerçek).

const ALT: Record<string, string[]> = {
  "Senin adın Selvinaz": ["Senin adın Selvinas"], "On yaşında ilk okunu attın": ["On yaşında ilk okuna attın"], "Ve o konuşmalarda iki ad": ["Ve o konuşmalarda iki at"], "Senin önüne geldiğinde": ["Senin önüne geldiğimde"], "Ata biner misin kızım": ["Ata diner misin kızım"], "Kendine yeni bir ad buldu": ["Kendine yeni bir at buldu"], "Türkmenler, Hıdırellez'i baharın": ["Türkmenler Hıdürellez'i"], "O da şaşkın şaşkın, elindeki güle bakıyordu": ["da şaşkır şaşkın elindeki güle"], "Bu senin, dedi": ["Bu Selin, dedi"], "Aylar geçti": ["Aylar deçti"], "Babanın beyliği ile Osmanlı arasında": ["Babanın beyliğiyle Osmanlı arasında"], "Onun adı, Sitti Şah Hatun'du": ["Onun adı Siddişah Hatun'du"], "Bin dört yüz kırk dokuz ya da elli": ["1449 ya da 50"], "Damat ise on yedi yaşındaydı": ["Damat ise 17 yaşındaydı"], "O, Fatih Sultan Mehmed'di": ["O Fatih Sultan Mehmet'ti"], "Ve bin dört yüz altmış yedi yılında": ["Ve 1467 yılında"], "Ve ancak iki bin altı yılında": ["Ve ancak 2006 yılında"], "Ama bin beş yüz on beş yılında": ["Ama 1515 yılında"],
  "On altı yaşındasın": ["16 yaşındasın"], "Yedi yaşında ata bindin": ["7 yaşında ata bindin"], "Beş kız": ["5 kız"],
  "Hıdırellez": ["Hıdrellez", "Hıdırellez'i"], "Yusuf, dedi": ["Yusuf dedi"],
};
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const VAR: [RegExp, string][] = [[/â/g, "a"], [/î/g, "i"], [/û/g, "u"]];
const variants = (p: string) => { const out = [p]; for (const [re, to] of VAR) for (const v of [...out]) { const n = v.replace(re, to); if (n !== v) out.push(n); } return out; };
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K3R_14_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone; fore?: "column" | "curtain" | "lamp" };
type PO = Partial<React.ComponentProps<typeof PFig>>;

// ── karakterler ──
const Y = 1005;
const SV = { robe: "#2F6B4A", robe2: "#F2DDB0", scarf: "#B8242C" };
const sv = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="girl" {...SV} t={t} seed={3} {...o} />;
const gelin = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="girl" robe="#C8243A" robe2="#F7E6C4" scarf="#D8404A" t={t} seed={3} {...o} />;
const yu = (t: number, x: number, o: PO = {}, s = 1.12) => <PFig x={x} y={Y} s={s} kind="prince" plain robe="#7A5A3A" robe2="#E9DCC2" t={t} seed={8} {...o} />;
const sz = (t: number, x: number, o: PO = {}, s = 1.14) => <PFig x={x} y={Y} s={s} kind="prince" t={t} seed={8} {...o} />;
const bey = (t: number, x: number, o: PO = {}, s = 1.16) => <PFig x={x} y={Y} s={s} kind="sultan" robe="#3A5A3A" robe2="#E9DCC2" t={t} seed={11} {...o} />;
const abi = (t: number, x: number, o: PO = {}, s = 1.14) => <PFig x={x} y={Y} s={s} kind="prince" plain robe="#5A3A26" robe2="#D9C9A8" t={t} seed={12} {...o} />;
const dadi = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="kalfa" robe="#7A4A3A" t={t} seed={13} {...o} />;
const pasaE = (t: number, x: number, o: PO = {}, s = 1.14) => <PFig x={x} y={Y} s={s} kind="valide" robe="#5A4A3A" robe2="#E9DCC2" t={t} seed={14} {...o} />;
const kv = (t: number, x: number, o: PO = {}, s = 1.16) => <PFig x={x} y={Y} s={s} kind="valide" t={t} seed={5} {...o} />;
const kard = (t: number, x: number, i: number, o: PO = {}, s = 1.0) => <PFig x={x} y={Y} s={s} kind="girl" robe={["#3A6A8A", "#8A3A5A", "#6A7A3A", "#8A5A2A"][i % 4]} robe2="#F2DDB0" scarf={["#D9AE4E", "#2B5DA8", "#C8243A", "#F2E6C4"][i % 4]} t={t} seed={20 + i} {...o} />;
const cariye = (t: number, x: number, i: number, o: PO = {}, s = 1.0) => <PFig x={x} y={Y} s={s} kind="girl" robe={["#A9C6DA", "#D98E8E", "#9FC3B0", "#E9B58F", "#B8A8D0"][i % 5]} robe2="#F5E8CC" t={t} seed={30 + i} {...o} />;
const kalfa = (t: number, x: number, i: number, o: PO = {}, s = 1.06) => <PFig x={x} y={Y} s={s} kind="kalfa" robe={["#5E6E5A", "#6A5A4A", "#4E5D6C"][i % 3]} t={t} seed={40 + i} {...o} />;
const genc = (t: number, x: number, i: number, o: PO = {}, s = 0.95) => <PFig x={x} y={Y} s={s} kind="prince" plain robe={["#6A4A2E", "#3A4A5A", "#5A5A3A"][i % 3]} robe2="#E9DCC2" t={t} seed={50 + i} {...o} />;

// ── mekânlar ──
const nv = (id: string, k: number, lights: { x: number; y: number; r: number; f?: number }[], t: number) => <NightVeil id={id} k={k} lights={lights} t={t} />;
const yayla = (t: number, night = 0.4, figs: React.ReactNode = null) => <><Yayla t={t} night={night} />{figs}</>;
// Hıdırellez gecesi: yayla (gece) + büyük ateş + figürler + gece örtüsü (ateş ışığı)
const hidir = (t: number, figs: React.ReactNode, fx = 960) => (
  <>
    <Yayla t={t} night={0.9} />
    <Ates x={fx} y={960} s={1.1} t={t} />
    {figs}
    {nv("nvAt", 0.62, [{ x: fx, y: 760, r: 620 }, { x: fx, y: 400, r: 300, f: 0.6 }], t)}
    <Motes t={t} n={30} c="#FFD27A" op={0.6} y0={300} y1={1000} />
  </>
);
const konak = (t: number, figs: React.ReactNode = null, night = 0) => <><CadirIc2 t={t} night={night} />{figs}</>;
const oda = (t: number, night: number, figs: React.ReactNode, extra: React.ReactNode = null) => (
  <>
    <ValideOda t={t} win={night ? 0.95 : 0.15} />
    <Samdan x={1720} y={1010} t={t} s={1.0} />
    {extra}
    {figs}
    {night > 0 && nv("nvOda", 0.62 * night, [{ x: 560, y: 700, r: 420 }, { x: 1600, y: 640, r: 260 }, { x: 1010, y: 660, r: 360, f: 0.85 }], t)}
  </>
);
const sedir = <Sedir2 x={1000} y={900} w={760} />;
const koridor = (t: number, a: number, b: number, fig: (x: number, w: ReturnType<typeof proWalk>) => React.ReactNode, night = 0.3, x0 = 300, x1 = 1900) => {
  const g = proWalk(t, a + 0.1, b + 0.6, x0, x1, 1.1);
  const camX = g.x - 900;
  const M = 560, n0 = Math.floor((camX - 200) / M) - 1;
  const lights = Array.from({ length: 6 }, (_, i) => n0 + i).flatMap((m) => { const lx = m * M + M / 2 - camX; return [{ x: lx, y: 380, r: 250 }, { x: lx, y: 980, r: 210, f: 0.75 }]; });
  return (<><GalleryWall t={t} camX={camX} night={night} />{fig(g.x - camX, g)}{night > 0.5 && nv("nvKor", 0.7 * night, lights, t)}<Motes t={t} n={34} op={0.45} /><ForeColumns camX={camX} /></>);
};
const bahce = (t: number, figs: React.ReactNode, pan = 0) => (<><HasBahce t={t} pan={pan} /><Birds t={t} /><Fiskiye x={560} y={905} t={t} s={0.95} /><Laleler x={1380} y={890} n={10} t={t} s={0.8} />{figs}<Laleler x={-60} y={1130} n={7} t={t} s={1.7} blur={8} /></>);
const C = (t: number, a: number, b: number, z: [number, number], c0: [number, number], kids: React.ReactNode, c1?: [number, number]) => <PCam t={t} a={a} b={b} z={z} c0={c0} c1={c1}>{kids}</PCam>;
const atli = (t: number, x: number, rider: React.ReactNode, c = "#F2EDE4", dir: 1 | -1 = 1, s = 1.25) => <><Horse x={x} y={1010} s={s} c={c} t={t} dir={dir} /><g transform={`translate(0,-250)`}>{rider}</g></>;
// gül atışı: ateşin yanındaki taştan kalabalığın arkasına yay çizer
const gulUcus = (t: number, a: number, x0: number, y0: number, x1: number, y1: number, dur = 1.4) => {
  const k = Math.max(0, Math.min(1, (t - a) / dur));
  if (t < a || k >= 1) return null;
  const x = lerp(x0, x1, k), y = lerp(y0, y1, k) - Math.sin(k * Math.PI) * 320;
  return <g transform={`translate(${x},${y})`}><Gul s={1.3} rot={k * 720} /></g>;
};

const SHOTS: Sh[] = [
  // ── AN ──
  { c: "Davullar çalıyor", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.3], [960, 560], <DugunAlay t={t} k={ramp(t, a, b + 20)} crowd={1} />),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="DAVUL · ZURNA" c={H.red} /> },
  { c: "Bütün şehir sokaklara dökülmüş", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], <Senlik t={t} k={1} fw={0} tents />) },
  { c: "Sen, süslü bir atın üstündesin", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 560], <><Senlik t={t} k={1} fw={0} tents />{atli(t, 960, gelin(t, 960, { sit: true, y: 1005, face: "worried", look: 0.2 }, 0.9))}</>) },
  { c: "Yüzünde ince bir duvak", tone: "gold", r: (t, a, b) => C(t, a, b, [2.8, 3.1], [960, 430], <><Senlik t={t} k={1} fw={0} tents />{atli(t, 960, gelin(t, 960, { sit: true, y: 1005, face: "closed" }, 0.9))}<rect x={880} y={260} width={160} height={190} rx={70} fill="#F2B8C0" opacity={0.35} /></>) },
  { c: "Önünde ağabeyin", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], <><Senlik t={t} k={1} fw={0} tents />{atli(t, 520, abi(t, 520, { sit: true, y: 1005 }, 0.9), "#7A4E2E")}{atli(t, 1200, gelin(t, 1200, { sit: true, y: 1005, face: "worried" }, 0.9))}</>) },
  { c: "Ve tam karşında", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.6], [960, 620], <><Otag t={t} night={0} />{sz(t, 960, { face: "normal", hands: "down" }, 1.0)}</>) },
  { c: "Bir Osmanlı şehzadesi", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.8, 2.0], [960, 560], <><Otag t={t} night={0} />{sz(t, 960, { face: "normal", hands: "down" }, 1.0)}</>),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="BİR OSMANLI ŞEHZADESİ" y={70} size={90} /> },
  { c: "Onu hayatında hiç görmedin", tone: "gold", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [960, 430], <><Senlik t={t} k={1} fw={0} tents />{atli(t, 960, gelin(t, 960, { sit: true, y: 1005, face: "worried", look: -0.2 }, 0.9))}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="“SADECE BİR ŞEHZADE.”" y={820} size={80} /> },
  { c: "Sadece bir şehzade", r: (t, a, b) => again("Onu hayatında hiç görmedin", t, a, b, 0), html: (t, a, b) => htmlOf("Onu hayatında hiç görmedin", t, b) },
  { c: "Padişahın oğlu. Gelecekte", r: (t, a, b) => again("Onu hayatında hiç görmedin", t, a, b, 1), html: (t, a, b) => htmlOf("Onu hayatında hiç görmedin", t, b) },
  { c: "At durdu", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], <><Otag t={t} night={0} />{gelin(t, 760, { face: "worried", bow: 0.6 - 0.6 * ramp(t, a + 1.5, a + 3), look: 0.5 })}{sz(t, 1180, { look: -0.5 })}</>) },
  { c: "Ve donup kaldın", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [3.0, 3.4], [760, 430], <><Otag t={t} night={0} />{gelin(t, 760, { face: "shock", look: 0.6 })}</>) },
  { c: "Çünkü o yüzü tanıyordun", tone: "gold", r: (t, a, b) => C(t, a, b, [3.0, 3.3], [1180, 430], <><Otag t={t} night={0} />{sz(t, 1180, { look: -0.6, face: "smile" })}</>) },
  { c: "Bu adamı daha önce görmüştün", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 620], hidir(t, <>{yu(t, 1400, { look: -0.4 })}</>)) },
  { c: "Ve elinde, senin saçından düşen bir gül", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 2.6], [960, 560], <><rect width={1920} height={1080} fill="#2A1A10" /><g transform="translate(960,520) scale(5)"><Gul /></g>{nv("nvG", 0.4, [{ x: 960, y: 520, r: 620 }], t)}</>) },

  // ── KİMSİN ──
  { c: "Senin adın Selvinaz", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 620], yayla(t, 0.2, <>{sv(t, 960, { face: "smile" }, 1.3)}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.3} name="SELVİNAZ" sub="16 yaşında · Dulkadir bey kızı · Elbistan" c={SV.robe} /> },
  { c: "Osmanlı topraklarında doğmadın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.3], [960, 540], <Yayla t={t} night={0.2} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="ELBİSTAN YAYLASI" y={70} size={90} /> },
  { c: "Senin memleketin Toros", r: (t, a, b) => again("Osmanlı topraklarında doğmadın", t, a, b, 0), html: (t, a, b) => htmlOf("Osmanlı topraklarında doğmadın", t, b) },
  { c: "Orası Dulkadir Beyliği'nin toprağıdır", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={960} y={440} r={250} k={ramp(t, a + 0.3, a + 0.7)} c={SV.robe} label="DULKADİR BEYLİĞİ" /></>),
    html: (t, a) => <Tag t={t} at={a + 1.4} text="ELBİSTAN · MARAŞ" c={SV.robe} /> },
  { c: "Ve senin baban, o beyliğin beyidir", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], konak(t, <>{bey(t, 960, { face: "normal" }, 1.3)}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.6} name="DULKADİR BEYİ" sub="Selvinaz'ın babası" c="#3A5A3A" /> },
  { c: "Dulkadirliler Türkmendir", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], yayla(t, 0.3, <><Horse x={500} y={900} s={0.9} t={t} graze={1} /><Camel x={1400} y={920} s={0.8} t={t} /></>)) },
  { c: "yayla da yaşar", r: (t, a, b) => again("Dulkadirliler Türkmendir", t, a, b, 0) },
  { c: "Senin halkının kadınları", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 640], yayla(t, 0.3, <>{kard(t, 560, 0, { talk: 1, look: 0.5 })}{kard(t, 960, 1, { face: "smile" })}{kard(t, 1360, 2, { look: -0.5, talk: 1 })}</>)),
    html: (t, a, b) => <>{["ATA BİNER", "OK ATAR", "ÇADIR KURAR", "PAZARLIK EDER"].map((l, i) => <Tag key={i} t={t} at={a + 1.2 + i * (b - a) * 0.15} text={l} c={[H.red, SV.robe, H.gold, H.cobalt][i]} x={120 + i * 440} y={140} />)}</> },
  { c: "Ata biner, ok", r: (t, a, b) => again("Senin halkının kadınları", t, a, b, 0), html: (t, a, b) => htmlOf("Senin halkının kadınları", t, b) },
  { c: "Yüzlerini sakınırlar", tone: "warm", r: (t, a, b) => again("Senin halkının kadınları", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="SESLERİNİ SAKLAMAZLAR" y={820} size={80} accent={H.red} /> },
  { c: "Sen de onlardan birisin", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 560], yayla(t, 0.3, <>{atli(t, lerp(300, 1600, ramp(t, a, b)), sv(t, 0, { sit: true, y: 1005, face: "smile" }, 0.9), "#7A4E2E")}</>)) },
  { c: "On yaşında ilk okunu attın", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 600], yayla(t, 0.3, <>{sv(t, 860, { look: 0.8, reach: 0.9, reachDir: 1 }, 1.2)}<path d={`M${960 + ramp(t, a + 0.8, a + 1.6) * 900},560 l80,-6`} stroke="#5A3A1E" strokeWidth={6} opacity={ramp(t, a + 0.8, a + 0.9)} /></>)) },
  { c: "Babanın divanında, duvarın arkasından", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 640], konak(t, <>{bey(t, 700, { sit: true, y: 900, talk: 1, look: 0.5 })}{genc(t, 1100, 0, { sit: true, y: 900, look: -0.5 }, 1.05)}{genc(t, 1400, 1, { sit: true, y: 900, look: -0.6 }, 1.05)}{sv(t, 1760, { look: -0.8, op: 0.9 }, 0.95)}</>)) },
  { c: "Ve o konuşmalarda iki ad", tone: "warm", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [1760, 520], konak(t, <>{sv(t, 1760, { look: -0.8, face: "worried" }, 0.95)}</>)) },
  { c: "Osmanlı. Ve Memlük", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={560} y={440} r={220} k={ramp(t, a + 0.2, a + 0.5)} c={H.red} label="OSMANLI" /><Disc x={1360} y={440} r={220} k={ramp(t, a + 1.2, a + 1.5)} c="#C99A3E" label="MEMLÜK" /></>) },

  // ── İKİ DEV ──
  { c: "Senin beyliğin, iki devin arasında", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={360} y={440} r={240} k={1} c={H.red} label="OSMANLI" /><Disc x={960} y={480} r={110} k={ramp(t, a + 0.3, a + 0.7)} c={SV.robe} label="DULKADİR" /><Disc x={1560} y={440} r={240} k={1} c="#C99A3E" label="MEMLÜK" /></>) },
  { c: "Kuzeyde ve batıda", tone: "cool", r: (t, a, b) => keep("Senin beyliğin, iki devin arasında", t, b), html: (t, a, b) => <><Tag t={t} at={a + 0.4} text="KUZEY · BATI: OSMANLI" c={H.red} x={120} /><Tag t={t} at={a + (b - a) * 0.5} text="GÜNEY: MISIR · SURİYE" c="#C99A3E" x={1100} /></> },
  { c: "Güneyde Mısır'dan Suriye'ye", r: (t, a, b) => again("Kuzeyde ve batıda", t, a, b, 0), html: (t, a, b) => htmlOf("Kuzeyde ve batıda", t, b) },
  { c: "İki dev, birbirine hiç güvenmiyordu", tone: "cool", r: (t, a, b) => keep("Senin beyliğin, iki devin arasında", t, b) },
  { c: "Bir yıl Memlüklerle anlaşır", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 640], konak(t, <>{bey(t, 760, { sit: true, y: 900, look: 0.5, reach: act(t, a + 0.5, 9, 0.6, 0.5), reachDir: 1, item: <OldLetter x={0} y={0} s={0.3} /> })}{genc(t, 1200, 2, { bow: 0.5, look: -0.6 })}</>)) },
  { c: "Çünkü küçük bir beyliğin hayatta kalmasının", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={620} y={440} r={190} k={ramp(t, a + 0.6, a + 0.9)} c={H.night} label="TAMAMEN AİT OLMA" /><Disc x={1300} y={440} r={190} k={ramp(t, a + 2.5, a + 2.8)} c={H.night} label="KİMSEYİ KIZDIRMA" /></>) },
  { c: "Hiçbir deve tamamen", r: (t, a, b) => again("Çünkü küçük bir beyliğin hayatta kalmasının", t, a, b, 0) },
  { c: "Babanın sarayında Osmanlı adı geçtiğinde", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 600], konak(t, <>{genc(t, 760, 0, { face: "worried", look: 0.4 }, 1.1)}{genc(t, 1160, 1, { face: "worried", look: -0.4 }, 1.1)}</>)),
    html: (t, a) => <Tag t={t} at={a + 1.4} text="BİR DÜŞMAN" c={H.red} /> },
  { c: "Osmanlı onlar için", r: (t, a, b) => again("Babanın sarayında Osmanlı adı geçtiğinde", t, a, b, 0), html: (t, a, b) => htmlOf("Babanın sarayında Osmanlı adı geçtiğinde", t, b) },
  { c: "Bugün dost görünse", r: (t, a, b) => again("Babanın sarayında Osmanlı adı geçtiğinde", t, a, b, 1), html: (t, a, b) => htmlOf("Babanın sarayında Osmanlı adı geçtiğinde", t, b) },
  { c: "Ve bu yüzden, bir gün kapınıza", sfx: "drone", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 560], yayla(t, 0.2, <>{[0, 1, 2, 3].map((i) => <Horse key={i} x={lerp(2100, 1300, ramp(t, a, b)) + i * 220} y={940 + (i % 2) * 30} s={0.7} t={t * 3} dir={-1} c={["#7A4E2E", "#F2EDE4", "#3A2A1E", "#9A6A40"][i]} />)}</>)) },

  // ── KIZLAR ──
  { c: "Kafile, bir bahar sabahı geldi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], yayla(t, 0.2, <><Camel x={lerp(1900, 1100, ramp(t, a, b))} y={940} s={0.9} t={t * 2} dir={-1} /><Sandik x={600} y={980} s={1.0} open={0} t={t} /></>)),
    html: (t, a, b) => <>{["ATLAR", "SANDIKLAR", "HEDİYELER"].map((l, i) => <Tag key={i} t={t} at={a + 0.6 + i * (b - a) * 0.2} text={l} c={H.gold} x={200 + i * 560} y={140} />)}</> },
  { c: "Ve kafilenin başında, bir erkek değil", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], yayla(t, 0.2, <>{pasaE(t, 960, { look: -0.2 }, 1.25)}</>)) },
  { c: "Bir Osmanlı paşasının eşiydi", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [960, 500], yayla(t, 0.2, <>{pasaE(t, 960, { look: 0.3 }, 1.25)}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="PAŞANIN EŞİ" sub="padişahın emriyle · gelin seçmeye" c="#5A4A3A" /> },
  { c: "yaşlıca, keskin bakışlı", r: (t, a, b) => again("Bir Osmanlı paşasının eşiydi", t, a, b, 0), html: (t, a, b) => htmlOf("Bir Osmanlı paşasının eşiydi", t, b) },
  { c: "Görevi çok basitti", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={960} y={440} r={240} k={ramp(t, a + 0.3, a + 0.7)} c={H.red} label="BİR GELİN SEÇ" /></>) },
  { c: "O gün sen ve kız kardeşlerin", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 640], konak(t, <>{[0, 1, 2].map((i) => kard(t, 360 + i * 300, i, { face: "worried" }))}{sv(t, 1260, { face: "normal" }, 1.0)}{kard(t, 1560, 3, { face: "worried" })}</>)),
    html: (t, a) => <Txt t={t} at={a + 1.6} text="BEŞ KIZ" y={70} size={96} /> },
  { c: "En güzel elbiseleriniz giydirilmiş", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], <KinaEller t={t} k={1} />) },
  { c: "Paşanın eşi, önünüzden tek tek geçti", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 640], konak(t, <>{[0, 1, 2].map((i) => kard(t, 360 + i * 300, i, { face: "worried", look: 0.3 }))}{sv(t, 1260, { look: -0.3 }, 1.0)}{kard(t, 1560, 3, { face: "worried" })}{pasaE(t, lerp(200, 900, ramp(t, a, b)), { walk: proWalk(t, a, b, 200, 900, 1.0).walk, look: 0.6 }, 1.0)}</>)) },
  { c: "Birinin saçına dokundu", tone: "warm", r: (t, a, b) => C(t, a, b, [1.7, 1.9], [520, 600], konak(t, <>{kard(t, 360, 0, { face: "worried", look: 0.5 })}{pasaE(t, 640, { look: -0.6, reach: act(t, a + 0.3, 9, 0.5, 0.5), reachDir: -1 }, 1.06)}</>)),
    html: (t, a, b) => <>{["SAÇ", "ELLER", "YÜRÜYÜŞ", "SES"].map((l, i) => <Tag key={i} t={t} at={a + 0.4 + i * (b - a) * 0.2} text={l} c={H.cobalt} x={120 + i * 440} y={140} />)}</> },
  { c: "Birinden yürümesini istedi", r: (t, a, b) => again("Birinin saçına dokundu", t, a, b, 0), html: (t, a, b) => htmlOf("Birinin saçına dokundu", t, b) },
  { c: "Sanki pazarda kumaş seçen biri gibiydi", tone: "cool", r: (t, a, b) => again("Paşanın eşi, önünüzden tek tek geçti", t, a, b, 2),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="KUMAŞ DEĞİL, KIZ SEÇİYORDU" y={70} size={76} accent={H.red} /> },
  { c: "Senin önüne geldiğinde", tone: "warm", r: (t, a, b) => C(t, a, b, [1.7, 1.9], [1110, 600], konak(t, <>{pasaE(t, 960, { look: 0.6 }, 1.06)}{sv(t, 1260, { look: -0.5 }, 1.0)}</>)) },
  { c: "Ata biner misin kızım", tone: "warm", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [960, 520], konak(t, <>{pasaE(t, 960, { look: 0.7, talk: 1 }, 1.06)}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="“ATA BİNER MİSİN KIZIM?”" y={820} size={84} /> },
  { c: "Binerim, dedin", tone: "gold", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [1260, 560], konak(t, <>{sv(t, 1260, { look: -0.6, talk: 1 }, 1.0)}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="“BİNERİM.”" y={820} size={100} accent={SV.robe} /> },
  { c: "Ok atar mısın", tone: "warm", r: (t, a, b) => again("Ata biner misin kızım", t, a, b, 0),
    html: (t, a) => <Txt t={t} at={a + 0.1} text="“OK ATAR MISIN?”" y={820} size={84} /> },
  { c: "Atarım", tone: "gold", r: (t, a, b) => again("Binerim, dedin", t, a, b, 0),
    html: (t, a) => <Txt t={t} at={a + 0.1} text="“ATARIM.”" y={820} size={100} accent={SV.robe} /> },
  { c: "Kadın hafifçe gülümsedi", tone: "warm", r: (t, a, b) => C(t, a, b, [2.8, 3.1], [960, 500], konak(t, <>{pasaE(t, 960, { look: 0.7, face: "smile" }, 1.06)}</>)),
    html: (t, a, b) => <>{["BEĞENİ Mİ?", "ACIMA MI?"].map((l, i) => <Tag key={i} t={t} at={a + (b - a) * (0.4 + i * 0.25)} text={l} c={[H.gold, H.night][i]} x={300 + i * 900} y={140} />)}</> },
  { c: "Bir beğeni miydi", r: (t, a, b) => again("Kadın hafifçe gülümsedi", t, a, b, 0), html: (t, a, b) => htmlOf("Kadın hafifçe gülümsedi", t, b) },
  { c: "Kafile birkaç gün kaldı", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 560], yayla(t, 0.5, <><Camel x={lerp(1100, 2100, ramp(t, a, b))} y={940} s={0.9} t={t * 2} dir={1} /></>)),
    html: (t, a) => <Tag t={t} at={a + 1.6} text="KARARI PADİŞAH VERECEK" c={H.night} /> },

  // ── ŞEHZADE ──
  { c: "Kararı uzaklardaki padişah", r: (t, a, b) => again("Kafile birkaç gün kaldı", t, a, b, 0), html: (t, a, b) => htmlOf("Kafile birkaç gün kaldı", t, b) },
  { c: "Peki o sırada, uzaklarda", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.1], [960, 560], <Sky w={1920} h={1080} k={0.7} city />) },
  { c: "İşte bu, hikâyenin kimsenin bilmediği", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], <><ValideOda t={t} win={0.6} />{sz(t, 960, { face: "normal", look: 0.2 }, 1.25)}</>),
    html: (t, a) => <Tag t={t} at={a + 1} text="KİMSENİN BİLMEDİĞİ KISIM" c={H.purple} /> },
  { c: "Şehzade, gençti", tone: "gold", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [960, 520], <><ValideOda t={t} win={0.6} />{sz(t, 960, { face: "sad", look: -0.3 }, 1.25)}</>) },
  { c: "Son iki yılda ona üç ayrı gelin adayı", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["ÇOK GÜZEL", "ÇOK SOYLU", "ÇOK ZENGİN"].map((l, i) => <Disc key={i} x={420 + i * 540} y={440} r={170} k={ramp(t, a + 0.5 + i * 0.9, a + 0.8 + i * 0.9)} c={[H.pink, H.purple, H.gold][i]} label={l}><text y={40} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={140} fill="#FFF">?</text></Disc>)}</>) },
  { c: "Hepsini sadece anlatılanlardan", r: (t, a, b) => again("Son iki yılda ona üç ayrı gelin adayı", t, a, b, 0) },
  { c: "Biri çok soylu", r: (t, a, b) => again("Son iki yılda ona üç ayrı gelin adayı", t, a, b, 1) },
  { c: "Ama hiçbiri hakkında", r: (t, a, b) => again("Son iki yılda ona üç ayrı gelin adayı", t, a, b, 2) },
  { c: "Bu kız nasıl gülüyor", tone: "gold", r: (t, a, b) => C(t, a, b, [2.0, 2.3], [960, 520], <><ValideOda t={t} win={0.6} />{sz(t, 960, { face: "normal", look: 0.6, talk: 1 }, 1.25)}</>),
    html: (t, a, b) => <>{["NASIL GÜLÜYOR?", "NEYE KIZIYOR?", "NE ANLATIYOR?"].map((l, i) => <Txt key={i} t={t} at={a + 0.2 + i * (b - a) * 0.28} text={l} y={180 + i * 150} size={64} x={1500} w={700} />)}</> },
  { c: "Bir gece, şehzade en güvendiği adamını", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], <><ValideOda t={t} win={0.95} />{sz(t, 760, { look: 0.5, talk: 1 })}{genc(t, 1180, 1, { look: -0.5, face: "shock" }, 1.1)}{nv("nvPl", 0.7, [{ x: 960, y: 640, r: 460 }], t)}</>) },
  { c: "Adam önce şaşırdı", r: (t, a, b) => again("Bir gece, şehzade en güvendiği adamını", t, a, b, 0) },
  { c: "sonra korktu. Ama", r: (t, a, b) => again("Bir gece, şehzade en güvendiği adamını", t, a, b, 1) },
  { c: "Bu Türkmen kızını, bir şehzade olarak değil", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [760, 520], <><ValideOda t={t} win={0.95} />{sz(t, 760, { look: 0.5, talk: 1 })}{nv("nvPl2", 0.68, [{ x: 760, y: 560, r: 400 }], t)}</>),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="“…BİR YABANCI OLARAK GÖRECEĞİM.”" y={820} size={76} /> },
  { c: "O zamanlar padişahların ve şehzadelerin", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={620} y={440} r={190} k={ramp(t, a + 0.3, a + 0.6)} c={H.gold} label="ŞEHZADE" /><Disc x={1300} y={440} r={190} k={ramp(t, a + 1.6, a + 1.9)} c="#7A5A3A" label="YABANCI" /></>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="TEBDİL-İ KIYAFET" y={860} size={90} accent={H.gold} /> },
  { c: "arasına kılık değiştirerek", r: (t, a, b) => again("O zamanlar padişahların ve şehzadelerin", t, a, b, 0), html: (t, a, b) => htmlOf("O zamanlar padişahların ve şehzadelerin", t, b) },
  { c: "Buna teptili kıyafet", r: (t, a, b) => again("O zamanlar padişahların ve şehzadelerin", t, a, b, 1), html: (t, a, b) => htmlOf("O zamanlar padişahların ve şehzadelerin", t, b) },
  { c: "Ama bir şehzadenin, başka bir beyliğin", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["ESİR", "REHİNE", "SAVAŞ SEBEBİ"].map((l, i) => <Disc key={i} x={420 + i * 540} y={440} r={170} k={ramp(t, a + 0.3 + i * 0.6, a + 0.6 + i * 0.6)} c={[H.night, H.purple, H.red][i]} label={l} />)}</>) },
  { c: "Tanınırsa bir esir", r: (t, a, b) => again("Ama bir şehzadenin, başka bir beyliğin", t, a, b, 0) },
  { c: "Bir rehine, bir", r: (t, a, b) => again("Ama bir şehzadenin, başka bir beyliğin", t, a, b, 1) },
  { c: "Şehzade, sırtına sade bir kaftan geçirdi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], <><ValideOda t={t} win={0.3} />{t < a + (b - a) * 0.5 ? sz(t, 960, { look: 0.2 }, 1.25) : yu(t, 960, { look: 0.2, face: "smile" }, 1.25)}</>) },
  { c: "Kendine yeni bir ad buldu", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [960, 520], <><ValideOda t={t} win={0.3} />{yu(t, 960, { look: 0.2, face: "smile" }, 1.25)}</>),
    html: (t, a) => <NameCard t={t} at={a + 0.6} name="YUSUF" sub="tüccar kervanında bir yolcu" c="#7A5A3A" /> },
  { c: "Ve bir tüccar kervanının arasına karışıp", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], <><Steppe t={t} wind={0.5} />{[0, 1, 2].map((i) => <Camel key={i} x={lerp(-300, 900, ramp(t, a, b)) + i * 300} y={940} s={0.8} t={t * 2} dir={1} />)}{yu(t, lerp(-500, 700, ramp(t, a, b)), { walk: proWalk(t, a, b, -500, 700, 1.0).walk }, 0.9)}</>),
    html: (t, a) => <Tag t={t} at={a + 1.2} text="TOROS DAĞLARI" c={H.cobalt} /> },

  // ── HIDIRELLEZ ──
  { c: "Mayıs ayının başıydı", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.15, 1.3], [960, 520], <Yayla t={t} night={0.9} />),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="HIDIRELLEZ GECESİ" y={70} size={96} dark /> },
  { c: "Türkmenler, Hıdırellez'i baharın", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], hidir(t, null)) },
  { c: "Halk inanışına göre o gece Hızır ile İlyas", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={620} y={440} r={190} k={ramp(t, a + 0.6, a + 0.9)} c={SV.robe} label="HIZIR" /><Disc x={1300} y={440} r={190} k={ramp(t, a + 1.1, a + 1.4)} c={H.cobalt} label="İLYAS" /></>),
    html: (t, a) => <Txt t={t} at={a + 2.4} text="BEREKET" y={860} size={90} accent={H.gold} /> },
  { c: "İnsanlar ateşler yakar", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 620], hidir(t, <><g transform={`translate(0,${-Math.max(0, Math.sin(((t - a) % 1.4) / 1.4 * Math.PI)) * 220})`}>{genc(t, lerp(600, 1320, ((t - a) % 1.4) / 1.4), 0, { face: "smile" })}</g></>)) },
  { c: "O gece, obanın ortasında büyük bir ateş", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.3], [960, 700], hidir(t, null)) },
  { c: "Kızlar el ele tutuşmuş", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 640], hidir(t, <>{[0, 1, 2, 3, 4].map((i) => { const ang = (t - a) * 0.5 + (i / 5) * Math.PI * 2; return <g key={i}>{kard(t, 960 + Math.cos(ang) * 620, i, { face: "smile", talk: 1, walk: { ph: (t + i) * 6, amp: 0.6, dir: (Math.sin(ang) > 0 ? 1 : -1) as 1 | -1 } }, 0.8 + 0.12 * Math.sin(ang))}</g>; })}</>)) },
  { c: "Delikanlılar ateşin üstünden atlıyordu", tone: "night", r: (t, a, b) => again("İnsanlar ateşler yakar", t, a, b, 1) },
  { c: "Yaşlılar, kenarda, kımız içip", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [1500, 680], hidir(t, <>{dadi(t, 1360, { sit: true, y: 960, talk: 1, look: -0.4 })}{bey(t, 1660, { sit: true, y: 960, look: -0.5, face: "smile" }, 1.0)}</>, 700)) },
  { c: "Ve o yıl obada oynanan bir oyun vardı", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={960} y={440} r={240} k={ramp(t, a + 0.3, a + 0.7)} c={H.red} label="GÜL OYUNU"><g transform="scale(3)"><Gul /></g></Disc></>) },
  { c: "Gecenin sonunda, beyin kızı saçındaki gülü", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [960, 480], hidir(t, <>{sv(t, 960, { face: "smile" }, 1.2)}<g transform="translate(1010,450)"><Gul s={0.7} /></g></>, 400)) },
  { c: "Gülü kim yakalarsa", tone: "gold", r: (t, a, b) => keep("Ve o yıl obada oynanan bir oyun vardı", t, b), html: (t, a) => <Txt t={t} at={a + 0.6} text="BAHTI AÇIK OLUR" y={860} size={90} accent={H.gold} /> },
  { c: "Bir oyun. Bir şaka", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], hidir(t, <>{[0, 1, 2, 3].map((i) => kard(t, 300 + i * 450, i, { face: "smile", talk: i % 2 }))}</>, 1700)) },
  { c: "Gece yarısı oldu", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 600], hidir(t, <><ellipse cx={960} cy={1010} rx={180} ry={40} fill="#6A6A6A" />{sv(t, 960, { y: 960, face: "shy" }, 1.1)}{kard(t, 640, 0, { look: 0.5, talk: 1 })}{kard(t, 1280, 1, { look: -0.5, talk: 1 })}</>, 300)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="“AT, SELVİNAZ, AT!”" y={820} size={100} accent={H.red} /> },
  { c: "Herkes bağırıyordu. At", r: (t, a, b) => again("Gece yarısı oldu", t, a, b, 0), html: (t, a, b) => htmlOf("Gece yarısı oldu", t, b) },
  { c: "Saçından gülü çıkardın", tone: "night", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [960, 480], hidir(t, <>{sv(t, 960, { face: "closed", reach: act(t, a + 0.3, 9, 0.6, 0.4), reachDir: 1, item: <Gul s={0.7} /> }, 1.2)}</>, 300)) },
  { c: "Ve gülü, rastgele, kalabalığın üstüne", sfx: "whoosh", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], hidir(t, <>{sv(t, 600, { face: "closed", reach: 1 - ramp(t, a + 0.3, a + 0.6), reachDir: 1 }, 0.9)}{[0, 1, 2, 3].map((i) => genc(t, 900 + i * 200, i, { look: -0.4, face: "smile" }, 0.8))}{yu(t, 1760, { look: -0.6 }, 0.85)}{gulUcus(t, a + 0.3, 700, 500, 1760, 560, 2.2)}</>, 300)) },
  { c: "Gözlerini açtığında", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.6], [1760, 520], hidir(t, <>{yu(t, 1760, { look: -0.3, face: "shock", reach: 0.6, reachDir: -1, item: <Gul s={0.7} /> }, 1.1)}</>, 300)) },
  { c: "Sade kaftanlı, tozlu çizmeli", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [1760, 600], hidir(t, <>{yu(t, 1760, { look: -0.5, reach: 0.6, reachDir: -1, item: <Gul s={0.7} /> }, 1.1)}</>, 300), [1760, 760]) },
  { c: "O da şaşkın şaşkın, elindeki güle bakıyordu", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.1], [960, 540], <><rect width={1920} height={1080} fill="#2A1A10" /><g transform="translate(960,540) scale(5)"><Gul /></g>{nv("nvG2", 0.4, [{ x: 960, y: 540, r: 620 }], t)}</>) },

  // ── GÜLÜŞLER ──
  { c: "Bir an sessizlik oldu", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], hidir(t, <>{[0, 1, 2, 3].map((i) => kard(t, 300 + i * 450, i, { face: t > a + (b - a) * 0.5 ? "smile" : "shock", talk: t > a + (b - a) * 0.5 ? 1 : 0, look: 0.3 }))}</>, 1700)) },
  { c: "Bir yolcu", sfx: "pop", tone: "night", r: (t, a, b) => again("Bir an sessizlik oldu", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="“BİR KERVAN ÇOCUĞU YAKALADI!”" y={820} size={80} /> },
  { c: "Kız kardeşlerinden biri, kulağına eğilip", tone: "night", r: (t, a, b) => C(t, a, b, [2.0, 2.3], [1060, 520], hidir(t, <>{sv(t, 960, { face: "sad", look: 0.3 })}{kard(t, 1180, 1, { face: "smile", talk: 1, look: -0.7, bow: 0.2 })}</>, 300)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“GELECEK YIL BİR TÜCCARIN KARISI OLURSUN!”" y={820} size={64} /> },
  { c: "Yüzün kıpkırmızı oldu", tone: "night", r: (t, a, b) => C(t, a, b, [3.0, 3.3], [960, 460], hidir(t, <>{sv(t, 960, { face: "shy", look: -0.4 })}</>, 300)) },
  { c: "Ama yabancı, kalabalığın arasından yürüdü", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [1100, 620], hidir(t, <>{sv(t, 860, { face: "shy", look: 0.5 })}{yu(t, lerp(1800, 1180, ramp(t, a, a + 2.6)), { walk: proWalk(t, a, a + 2.6, 1800, 1180, 1.12).walk, look: -0.6, reach: act(t, a + 2.7, 9, 0.5, 0.4), reachDir: -1, item: <Gul s={0.7} /> })}</>, 300)) },
  { c: "Bu senin, dedi", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [1180, 520], hidir(t, <>{yu(t, 1180, { look: -0.6, talk: 1, face: "smile", reach: 0.7, reachDir: -1, item: <Gul s={0.7} /> })}</>, 300)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.2} text="“BAHTI AÇIK OLAN, GÜLÜ ATANDIR.”" y={820} size={76} accent={H.gold} /> },
  { c: "Sesi sakin ve yumuşaktı", tone: "night", r: (t, a, b) => C(t, a, b, [3.0, 3.3], [1180, 440], hidir(t, <>{yu(t, 1180, { look: -0.6 })}</>, 300)),
    html: (t, a) => <Tag t={t} at={a + 2} text="HER ŞEYİ TARTAN BİR BAKIŞ" c={H.purple} /> },
  { c: "Ama gözlerinde bir", r: (t, a, b) => again("Sesi sakin ve yumuşaktı", t, a, b, 0), html: (t, a, b) => htmlOf("Sesi sakin ve yumuşaktı", t, b) },
  { c: "Sanki her şeyi", r: (t, a, b) => again("Sesi sakin ve yumuşaktı", t, a, b, 1), html: (t, a, b) => htmlOf("Sesi sakin ve yumuşaktı", t, b) },
  { c: "Adın ne, diye sordun", tone: "night", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [860, 480], hidir(t, <>{sv(t, 860, { look: 0.6, talk: 1, face: "shy" })}</>, 300)),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="“ADIN NE?”" y={820} size={100} /> },
  { c: "Yusuf, dedi", sfx: "ding", tone: "night", r: (t, a, b) => again("Bu senin, dedi", t, a, b, 2),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="“YUSUF.”" y={820} size={130} accent={H.gold} /> },

  // ── GECE ──
  { c: "O gece, ateş sönene kadar konuştunuz", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 640], hidir(t, <>{sv(t, 760, { sit: true, y: 960, look: 0.6, talk: 1 })}{yu(t, 1160, { sit: true, y: 960, look: -0.6, face: "smile" })}</>, 960)) },
  { c: "Ama yalnız değil", tone: "night", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 640], hidir(t, <>{sv(t, 760, { sit: true, y: 960, look: 0.6 })}{yu(t, 1160, { sit: true, y: 960, look: -0.6 })}{dadi(t, 360, { sit: true, y: 960, look: 0.5 })}{kard(t, 1560, 0, { sit: true, y: 960, look: -0.5 })}{abi(t, 1800, { look: -0.7, face: "worried" })}</>, 960)) },
  { c: "Yanınızda dadın vardı", r: (t, a, b) => again("Ama yalnız değil", t, a, b, 0) },
  { c: "Arada bir ağabeyin", r: (t, a, b) => again("Ama yalnız değil", t, a, b, 1) },
  { c: "Yusuf sana uzak şehirleri anlattı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 560], <Sky w={1920} h={1080} k={0.8} city />),
    html: (t, a, b) => <>{["BURSA'NIN İPEKLERİ", "EDİRNE'NİN CAMİLERİ", "DENİZ"].map((l, i) => <Tag key={i} t={t} at={a + 0.6 + i * (b - a) * 0.22} text={l} c={[H.purple, H.cobalt, H.teal][i]} x={120 + i * 600} y={140} />)}</> },
  { c: "Sen ona yaylayı anlattın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 540], <Yayla t={t} night={0.2} />),
    html: (t, a, b) => <>{["KARTAL YUVALARI", "KAR SULARI"].map((l, i) => <Tag key={i} t={t} at={a + 0.6 + i * (b - a) * 0.3} text={l} c={SV.robe} x={200 + i * 800} y={140} />)}</> },
  { c: "Ve bir gün, ok atarken kendi atını", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], yayla(t, 0.2, <>{sv(t, 700, { face: "shock", look: 0.8, reach: 0.9, reachDir: 1 }, 1.0)}<Horse x={1300} y={1000} s={1.1} t={t * 4} dir={1} /></>)) },
  { c: "Yusuf o kadar güldü ki", sfx: "pop", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 600], hidir(t, <>{sv(t, 760, { sit: true, y: 960, look: 0.6, face: "shy" })}{yu(t, 1160, { sit: true, y: 960, look: -0.6, face: "smile", bow: Math.abs(Math.sin((t - a) * 5)) * 0.25 })}{dadi(t, 360, { sit: true, y: 960, look: 0.5, face: "smile" })}</>, 960)) },
  { c: "Sonra sordu", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [1160, 520], hidir(t, <>{yu(t, 1160, { sit: true, y: 960, look: -0.6, talk: 1 })}</>, 960)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“BİR OSMANLI ŞEHZADESİYLE EVLENMEK İSTER MİSİN?”" y={820} size={62} /> },
  { c: "Cevabın hızlı ve sertti", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [760, 520], hidir(t, <>{sv(t, 760, { sit: true, y: 960, look: 0.6, talk: 1, face: "worried" })}</>, 960)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.15} text="“İSTEMEM. BEN KAFESE GİRECEK BİR KUŞ DEĞİLİM.”" y={820} size={64} accent={H.red} /> },
  { c: "Yusuf bir şey söylemedi", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [1160, 520], hidir(t, <>{yu(t, 1160, { sit: true, y: 960, look: -0.4, bow: 0.5, face: "sad" })}</>, 960)) },
  { c: "Yarın kervan yola çıkıyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 560], hidir(t, <>{sv(t, 760, { look: 0.6, face: "sad" })}{yu(t, 1160, { look: -0.6, talk: 1 })}</>, 960)) },
  { c: "Gülü sana geri vermek istedi", tone: "night", r: (t, a, b) => C(t, a, b, [2.0, 2.2], [960, 600], hidir(t, <>{sv(t, 760, { look: 0.6, face: "smile" })}{yu(t, 1160, { look: -0.6, reach: 0.6, reachDir: -1, item: <Gul s={0.7} /> })}</>, 960)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="“SENDE KALSIN. BAHTI AÇIK OLSUN.”" y={820} size={76} accent={H.gold} /> },
  { c: "Ertesi sabah, kervan gitmişti", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 560], yayla(t, 0.3, <>{[0, 1, 2].map((i) => <Camel key={i} x={1500 + i * 160 + ramp(t, a, b) * 300} y={760} s={0.35} t={t * 2} dir={1} />)}{sv(t, 600, { look: 0.8, face: "sad" }, 1.0)}</>)) },

  // ── KARAR ──
  { c: "Haftalar geçti", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], yayla(t, 0.3, <><Horse x={lerp(-300, 900, ramp(t, a, b))} y={960} s={0.9} t={t * 4} dir={1} /></>)),
    html: (t, a) => <Tag t={t} at={a + 1.2} text="OSMANLI'DAN BİR MEKTUP" c={H.red} /> },
  { c: "Baban seni yanına çağırdı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 620], konak(t, <>{bey(t, 760, { look: 0.5, face: "sad", reach: 0.4, reachDir: 1, item: <OldLetter x={0} y={0} s={0.3} /> })}{sv(t, 1180, { look: -0.5, face: "worried" })}</>)) },
  { c: "Padişah seni seçti", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [760, 520], konak(t, <>{bey(t, 760, { look: 0.5, face: "sad", talk: 1 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="“PADİŞAH SENİ SEÇTİ.”" y={820} size={96} /> },
  { c: "Dünyanın döndüğünü hissettin", tone: "night", r: (t, a, b) => C(t, a, b, [2.0, 2.4], [960, 560], <g transform={`rotate(${Math.sin((t - a) * 1.2) * 3},960,540)`}>{hidir(t, <>{yu(t, 960, { look: 0, face: "smile" }, 1.2)}</>, 1500)}</g>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="YUSUF." y={820} size={110} accent={H.gold} /> },
  { c: "Ateşin başındaki o", r: (t, a, b) => again("Dünyanın döndüğünü hissettin", t, a, b, 0), html: (t, a, b) => htmlOf("Dünyanın döndüğünü hissettin", t, b) },
  { c: "Baba, dedin", tone: "warm", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [1180, 520], konak(t, <>{sv(t, 1180, { look: -0.6, talk: 1, face: "sad" })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="“BABA, BEN İSTEMİYORUM.”" y={820} size={90} /> },
  { c: "Baban mektubu masaya bıraktı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 640], konak(t, <>{bey(t, 760, { look: 0.5, face: "sad" })}{sv(t, 1180, { look: -0.5, face: "sad" })}<g transform="translate(960,900)"><OldLetter x={0} y={0} s={0.6} /></g></>)) },
  { c: "Kızım, bu bir evlilik değil", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [760, 520], konak(t, <>{bey(t, 760, { look: 0.6, talk: 1 })}</>)),
    html: (t, a, b) => <><Txt t={t} at={a + 0.2} text="“BU BİR EVLİLİK DEĞİL.”" y={760} size={80} /><Txt t={t} at={a + (b - a) * 0.4} text="“BU BİR ANTLAŞMA.”" y={890} size={80} accent={H.red} /></> },
  { c: "Senin bu evliliğin, belki bir savaşı önleyecek", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 560], yayla(t, 0.4, <>{[0, 1, 2, 3, 4, 5].map((i) => kard(t, 160 + i * 320, i, { face: "normal", look: Math.sin(i) * 0.4 }, 0.75))}</>)),
    html: (t, a) => <Tag t={t} at={a + 1.5} text="BİNLERCE TÜRKMEN" c={SV.robe} /> },
  { c: "Sen bir bey kızısın", tone: "gold", r: (t, a, b) => again("Kızım, bu bir evlilik değil", t, a, b, 1),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“BEY KIZLARI HALKLARI İÇİN EVLENİR.”" y={820} size={72} /> },
  { c: "O gece, gizlice yaylanın en yüksek tepesine", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 560], <><Yayla t={t} night={1} />{sv(t, 960, { face: "sad", bow: 0.4, sit: true, y: 900 }, 0.7)}{nv("nvTepe", 0.5, [{ x: 960, y: 700, r: 400 }], t)}</>) },

  // ── ÇEYİZ ──
  { c: "Hazırlıklar aylarca sürdü", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 560], <CeyizDuvar t={t} k={ramp(t, a, b)} crowd={1} />) },
  { c: "Sana bir çeyiz hazırlandı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 640], <><CeyizDuvar t={t} k={1} />{[0, 1, 2].map((i) => <Sandik key={i} x={460 + i * 500} y={1000} s={1.1} open={ramp(t, a + 0.5 + i * 0.6, a + 1.2 + i * 0.6)} t={t} />)}</>),
    html: (t, a, b) => <>{["İPEK · KADİFE · HALI", "GÜMÜŞ TEPSİLER", "ATLAR · DEVELER"].map((l, i) => <Tag key={i} t={t} at={a + 0.6 + i * (b - a) * 0.2} text={l} c={[H.purple, H.cobalt, H.gold][i]} x={120 + i * 600} y={140} />)}</> },
  { c: "gümüş tepsiler, bakır", r: (t, a, b) => again("Sana bir çeyiz hazırlandı", t, a, b, 0), html: (t, a, b) => htmlOf("Sana bir çeyiz hazırlandı", t, b) },
  { c: "Ve sandıkların en dibinde", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.6], [960, 700], <><rect width={1920} height={1080} fill="#3A2A1E" /><GulKutu x={960} y={900} s={2.2} open={ramp(t, a + 1, a + 2.5)} />{nv("nvK", 0.4, [{ x: 960, y: 700, r: 640 }], t)}</>),
    html: (t, a, b) => <Tag t={t} at={a + (b - a) * 0.6} text="KURUMUŞ BİR GÜL" c={H.red} /> },
  { c: "Ağabeyin seni yolculuk boyunca koruyacaktı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], yayla(t, 0.3, <>{abi(t, 960, { look: 0.2, face: "normal" }, 1.25)}</>)) },
  { c: "iki kız kardeşinin", r: (t, a, b) => again("Ağabeyin seni yolculuk boyunca koruyacaktı", t, a, b, 0) },
  { c: "Yol uzundu", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], <><Steppe t={t} wind={0.6} />{atli(t, lerp(-200, 2100, ramp(t, a, b)), gelin(t, 0, { sit: true, y: 1005 }, 0.9))}</>),
    html: (t, a, b) => <>{["DAĞLAR", "OVALAR", "NEHİRLER"].map((l, i) => <Tag key={i} t={t} at={a + 0.4 + i * (b - a) * 0.25} text={l} c={H.cobalt} x={200 + i * 560} y={140} />)}</> },
  { c: "Çadırlarda geçen geceler", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], <><Yayla t={t} night={1} /><Cadir x={700} y={950} s={1.2} t={t} lit={1} /><Cadir x={1300} y={970} s={0.9} t={t} lit={0.6} />{nv("nvC", 0.55, [{ x: 700, y: 800, r: 360 }, { x: 1300, y: 850, r: 260 }], t)}</>) },
  { c: "Her şehirde, sana meraklı gözlerle", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], <><DugunAlay t={t} k={ramp(t, a, b)} crowd={1} /></>) },
  { c: "Bazı kaynaklar, böyle bir prensesin bir fil", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={960} y={440} r={240} k={ramp(t, a + 0.4, a + 0.8)} c="#8A8A9A" label="FİL ÜSTÜNDE?" /></>),
    html: (t, a) => <Tag t={t} at={a + 1.6} text="MEMLÜK · OSMANLI HEDİYESİ" c={H.gold} /> },
  { c: "Çünkü filler, Memlükler", r: (t, a, b) => again("Bazı kaynaklar, böyle bir prensesin bir fil", t, a, b, 0), html: (t, a, b) => htmlOf("Bazı kaynaklar, böyle bir prensesin bir fil", t, b) },
  { c: "değerli hediyeler olarak", r: (t, a, b) => again("Bazı kaynaklar, böyle bir prensesin bir fil", t, a, b, 1), html: (t, a, b) => htmlOf("Bazı kaynaklar, böyle bir prensesin bir fil", t, b) },
  { c: "Ama atının dizginlerini tutarken", tone: "cool", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [960, 440], <><Steppe t={t} wind={0.5} />{atli(t, 960, gelin(t, 960, { sit: true, y: 1005, face: "sad", look: 0.3 }, 0.9))}</>) },

  // ── DÜĞÜN ──
  { c: "Ve sonunda düğün başladı", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.05], [960, 540], <Senlik t={t} k={1} fw={1} tents />),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="DÜĞÜN" sub="haftalarca" y={70} size={110} /> },
  { c: "Meydanlarda çadırlar kuruldu", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], <><Senlik t={t} k={1} fw={0} tents /><Cadir x={500} y={980} s={1.1} t={t} /><Cadir x={1450} y={990} s={1.0} t={t} /></>),
    html: (t, a, b) => <>{["ŞAİRLER", "CAMBAZLAR", "PEHLİVANLAR", "SOFRALAR"].map((l, i) => <Tag key={i} t={t} at={a + 0.6 + i * (b - a) * 0.18} text={l} c={[H.purple, H.red, H.cobalt, H.gold][i]} x={120 + i * 440} y={140} />)}</> },
  { c: "Cambazlar, ipte yürüdü", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 500], <><Senlik t={t} k={1} fw={0} tents /><path d="M200,420 L1720,420" stroke="#4A3524" strokeWidth={5} />{genc(t, lerp(400, 1500, ramp(t, a, b)), 0, { walk: proWalk(t, a, b, 400, 1500, 0.7).walk, y: 420 }, 0.7)}</>) },
  { c: "Şehrin fakirlerine yemek dağıtıldı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], <><Senlik t={t} k={1} fw={0} tents />{kalfa(t, 760, 0, { hands: "tray", trayItem: <SerbetTepsi t={t} /> })}{kard(t, 1180, 2, { look: -0.5, face: "smile" })}</>) },
  { c: "Ve sonra, o an geldi", tone: "gold", r: (t, a, b) => keep("At durdu", t, b) },
  { c: "Atından indirildin, duvanın", r: (t, a, b) => again("Ve sonra, o an geldi", t, a, b, 0) },
  { c: "Ve karşında, ateşin başındaki o adam", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [1180, 460], <><Otag t={t} night={0} />{sz(t, 1180, { look: -0.6, face: "smile" })}</>) },
  { c: "Ama artık sade", r: (t, a, b) => again("Ve karşında, ateşin başındaki o adam", t, a, b, 0) },
  { c: "Ve sarığında, mücevherli bir sorguç", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [3.6, 4.0], [1160, 330], <><Otag t={t} night={0} />{sz(t, 1180, { look: -0.6, face: "smile" })}</>) },
  { c: "Yusuf", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.8, 2.0], [960, 560], <><Otag t={t} night={0} />{gelin(t, 760, { face: "shock", look: 0.6 })}{sz(t, 1180, { look: -0.6, face: "smile" })}</>),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="YUSUF?" y={70} size={120} accent={H.gold} /> },
  { c: "Hayır. Yusuf değil", tone: "gold", r: (t, a, b) => again("Yusuf", t, a, b, 1),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="BİR OSMANLI ŞEHZADESİ" y={820} size={90} accent={H.red} /> },
  { c: "Gözleriniz buluştu", tone: "gold", r: (t, a, b) => C(t, a, b, [1.9, 2.1], [1080, 520], <><Otag t={t} night={0} />{gelin(t, 860, { face: "shy", look: 0.6 })}{sz(t, 1180, { look: -0.6, face: "smile", reach: act(t, a + 2, 9, 0.6, 0.4), reachDir: -1, item: t > a + 2.4 ? <Gul s={0.7} dry={1} /> : undefined })}</>) },
  { c: "Şehzade hafifçe gülümsedi", r: (t, a, b) => again("Gözleriniz buluştu", t, a, b, 0) },
  { c: "Kurumuş, kahverengileşmiş", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.1], [960, 540], <><rect width={1920} height={1080} fill="#F3E6C4" /><g transform="translate(960,560) scale(5) rotate(20)"><Gul dry={1} /></g></>) },
  { c: "O an, bütün kalabalığın ortasında", tone: "gold", r: (t, a, b) => C(t, a, b, [3.0, 3.3], [860, 430], <><Otag t={t} night={0} />{gelin(t, 860, { face: "sad", look: 0.6 })}</>) },

  // ── GERDEK ──
  { c: "O gece, şehzadeyle ilk kez yalnız kaldınız", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 640], oda(t, 1, <>{gelin(t, 760, { look: 0.6, face: "worried" })}{sz(t, 1180, { look: -0.6 })}</>)) },
  { c: "Neden yalan söyledin", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [760, 520], oda(t, 1, <>{gelin(t, 760, { look: 0.6, talk: 1, face: "sad" })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="“NEDEN YALAN SÖYLEDİN?”" y={820} size={90} /> },
  { c: "Şehzade bir süre sustu", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [1180, 520], oda(t, 1, <>{sz(t, 1180, { look: -0.6, bow: 0.3 })}</>)) },
  { c: "Eğer şehzade olarak gelseydim", tone: "night", r: (t, a, b) => C(t, a, b, [2.0, 2.2], [1180, 540], oda(t, 1, <>{sz(t, 1180, { look: -0.6, talk: 1, face: "smile" })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“BANA YUSUF'A GÖSTERDİĞİN YÜZÜ GÖSTERİR MİYDİN?”" y={820} size={62} /> },
  { c: "Bana kendi atını", r: (t, a, b) => again("Eğer şehzade olarak gelseydim", t, a, b, 0), html: (t, a, b) => htmlOf("Eğer şehzade olarak gelseydim", t, b) },
  { c: "Haklıydı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], oda(t, 0.8, <>{gelin(t, 860, { look: 0.6, face: "shy" })}{sz(t, 1100, { look: -0.6, face: "smile" })}</>, <Petals t={t} n={12} c="#F2B8C0" />)) },
  { c: "Ama yanılıyordun", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={620} y={440} r={190} k={ramp(t, a + 1.6, a + 1.9)} c={H.pink} label="MASAL: DÜĞÜNLE BİTER" /><Disc x={1300} y={440} r={190} k={ramp(t, a + 3, a + 3.3)} c={H.night} label="HAYAT: DÜĞÜNDEN SONRA BAŞLAR" /></>) },

  // ── SARAY ──
  { c: "Düğünden sonra, şehzadenin sarayına", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 540], <EskiSaray t={t} rain={0} />),
    html: (t, a) => <Tag t={t} at={a + 0.8} text="ŞEHZADE SARAYI" c={H.cobalt} /> },
  { c: "Ve ilk gün, burasının yayla olmadığını", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 560], <KafesIc t={t} />) },
  { c: "Sarayın haremi, yüksek duvarlarla", tone: "cool", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], <><KafesIc t={t} />{gelin(t, 960, { robe: SV.robe, scarf: SV.scarf, face: "sad", look: 0.1 }, 1.0)}</>) },
  { c: "Dışarıyı görebiliyordun ama", r: (t, a, b) => again("Sarayın haremi, yüksek duvarlarla", t, a, b, 0) },
  { c: "Bahçeye çıkmak için izin gerekiyordu", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={620} y={440} r={190} k={ramp(t, a + 0.3, a + 0.6)} c={H.night} label="BAHÇE: İZİNLE" /><Disc x={1300} y={440} r={190} k={ramp(t, a + 1.8, a + 2.1)} c={H.red} label="AT: BİR HAYAL" /></>) },
  { c: "Ve haremde, sen yalnız değildin", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 640], koridor(t, a, b, (x, g) => <>{[0, 1, 2, 3].map((i) => cariye(t, x - 700 + i * 320, i, { walk: g.walk, look: g.look }))}</>, 0.3)) },
  { c: "Çoğu uzak ülkelerden", r: (t, a, b) => again("Ve haremde, sen yalnız değildin", t, a, b, 0) },
  { c: "sarayın kurallarını, sarayın", r: (t, a, b) => again("Ve haremde, sen yalnız değildin", t, a, b, 1) },
  { c: "Sen ise, onların gözünde bir yabancıydın", tone: "cool", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], <><ValideOda t={t} win={0.2} />{cariye(t, 560, 1, { look: 0.6, face: "normal" })}{sv(t, 960, { look: 0.1, face: "worried" })}{cariye(t, 1360, 3, { look: -0.6 })}</>),
    html: (t, a, b) => <>{["SESİ YÜKSEK", "ÇOK HIZLI YÜRÜR", "AĞZINI KAPATMADAN GÜLER"].map((l, i) => <Tag key={i} t={t} at={a + 1 + i * (b - a) * 0.22} text={l} c={H.night} x={120 + i * 600} y={140} />)}</> },
  { c: "Konuşurken sesini fazla", r: (t, a, b) => again("Sen ise, onların gözünde bir yabancıydın", t, a, b, 0), html: (t, a, b) => htmlOf("Sen ise, onların gözünde bir yabancıydın", t, b) },
  { c: "gülerken eliyle ağzını", r: (t, a, b) => again("Sen ise, onların gözünde bir yabancıydın", t, a, b, 1), html: (t, a, b) => htmlOf("Sen ise, onların gözünde bir yabancıydın", t, b) },
  { c: "Bir gün koridorda, iki cariyenin", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [1100, 600], koridor(t, a, b, (x) => <>{cariye(t, x + 120, 1, { talk: 1, look: 0.5, face: "smile" })}{cariye(t, x + 400, 4, { look: -0.5, face: "smile" })}</>, 0.3, 900, 950)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="“YAYLANIN KIZI… SARAYA KEÇİ GİBİ GİRDİ.”" y={820} size={68} /> },
  { c: "Yaylanın kızı dedi", r: (t, a, b) => again("Bir gün koridorda, iki cariyenin", t, a, b, 0), html: (t, a, b) => htmlOf("Bir gün koridorda, iki cariyenin", t, b) },
  { c: "Sen duymamış gibi yaptın", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.8], [960, 760], oda(t, 1, <>{sv(t, 960, { sit: true, y: 900, face: "sad", bow: 0.4 })}<GulKutu x={1260} y={960} s={0.8} open={1} /></>)) },

  // ── HÜR KADIN ──
  { c: "Ama bir şey vardı ki", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], <><ValideOda t={t} win={0.2} />{sv(t, 960, { face: "normal" }, 1.3)}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="SEN BİR KÖLE DEĞİLDİN" y={70} size={90} accent={H.gold} /> },
  { c: "Saraydaki cariyelerin çoğu", tone: "cool", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 640], <><ValideOda t={t} win={0.2} />{[0, 1, 2, 3, 4].map((i) => cariye(t, 300 + i * 330, i, { look: (2 - i) * 0.2, bow: 0.2 }))}</>),
    html: (t, a) => <Tag t={t} at={a + 1} text="SATIN ALINMIŞ · HEDİYE EDİLMİŞ" c={H.night} /> },
  { c: "Bir gün azat", r: (t, a, b) => again("Saraydaki cariyelerin çoğu", t, a, b, 0), html: (t, a, b) => htmlOf("Saraydaki cariyelerin çoğu", t, b) },
  { c: "Ama o güne", r: (t, a, b) => again("Saraydaki cariyelerin çoğu", t, a, b, 1), html: (t, a, b) => htmlOf("Saraydaki cariyelerin çoğu", t, b) },
  { c: "Sen ise hür doğmuştun", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={620} y={440} r={190} k={ramp(t, a + 0.3, a + 0.6)} c={SV.robe} label="HÜR" /><Disc x={1300} y={440} r={190} k={ramp(t, a + 1.6, a + 1.9)} c={H.gold} label="NİKÂHLI" /></>) },
  { c: "Nikâhında sana bir mehir yazılmıştı", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{Array.from({ length: 12 }, (_, i) => <Akce key={i} x={460 + (i % 6) * 200} y={380 + Math.floor(i / 6) * 200} r={60} spin={t + i} />)}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="MEHİR" sub="sadece sana ait bir servet" y={820} size={100} /> },
  { c: "Yani kocanın sana", r: (t, a, b) => again("Nikâhında sana bir mehir yazılmıştı", t, a, b, 0), html: (t, a, b) => htmlOf("Nikâhında sana bir mehir yazılmıştı", t, b) },
  { c: "İslam hukukuna göre", r: (t, a, b) => again("Nikâhında sana bir mehir yazılmıştı", t, a, b, 1), html: (t, a, b) => htmlOf("Nikâhında sana bir mehir yazılmıştı", t, b) },
  { c: "İstersen bir cami yaptırabilir", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], <><Cami t={t} k={1} /></>),
    html: (t, a, b) => <>{["CAMİ", "ÇEŞME", "VAKIF"].map((l, i) => <Tag key={i} t={t} at={a + 0.4 + i * (b - a) * 0.22} text={l} c={[H.teal, H.cobalt, H.gold][i]} x={200 + i * 560} y={140} />)}</> },
  { c: "Bu, sarayda büyük bir güçtü", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 600], koridor(t, a, b, (x, g) => <>{[0, 1].map((i) => cariye(t, x - 800 + i * 300, i, { walk: g.walk, look: g.look }))}{[0, 1].map((i) => kalfa(t, x - 1300 + i * 260, i, { walk: g.walk, look: g.look }))}</>, 0.3)) },
  { c: "Çünkü harem kendi", r: (t, a, b) => again("Bu, sarayda büyük bir güçtü", t, a, b, 0) },
  { c: "Onların birbirine bağlılıkları", r: (t, a, b) => again("Bu, sarayda büyük bir güçtü", t, a, b, 1) },
  { c: "Sen ise dışarıdan gelmiştin", tone: "cool", r: (t, a, b) => C(t, a, b, [1.4, 1.7], [960, 600], koridor(t, a, b, (x, g) => <>{sv(t, x, { walk: g.walk, look: g.look, face: "sad" })}</>, 0.3)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="KİMSE YANINDA YÜRÜMÜYORDU" y={70} size={80} accent={H.night} /> },

  // ── KAYINVALİDE ──
  { c: "Kimsenin öğrencisi değildin", r: (t, a, b) => again("Sen ise dışarıdan gelmiştin", t, a, b, 0), html: (t, a, b) => htmlOf("Sen ise dışarıdan gelmiştin", t, b) },
  { c: "Senin gücün kağıt", r: (t, a, b) => again("Sen ise dışarıdan gelmiştin", t, a, b, 1), html: (t, a, b) => htmlOf("Sen ise dışarıdan gelmiştin", t, b) },
  { c: "Ve sarayda, sana en soğuk bakan kişi", tone: "cool", r: (t, a, b) => C(t, a, b, [1.5, 1.8], [960, 560], <><ValideOda t={t} win={0.2} />{kv(t, 960, { look: 0.3, face: "normal" }, 1.3)}</>),
    html: (t, a) => <NameCard t={t} at={a + 1} name="KAYINVALİDE" sub="şehzadenin annesi" c={P.crimson} /> },
  { c: "O da bir zamanlar bir cariyeydi", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={420} y={440} r={150} k={ramp(t, a + 0.3, a + 0.6)} c={H.night} label="CARİYE" /><Disc x={960} y={440} r={150} k={ramp(t, a + 2, a + 2.3)} c={H.pink} label="GÖZDE" /><Disc x={1500} y={440} r={150} k={ramp(t, a + 3.5, a + 3.8)} c={P.crimson} label="ŞEHZADE ANNESİ" /></>) },
  { c: "yıllarca kalfaların elinde", r: (t, a, b) => again("O da bir zamanlar bir cariyeydi", t, a, b, 0) },
  { c: "sonra padişahın gözüne", r: (t, a, b) => again("O da bir zamanlar bir cariyeydi", t, a, b, 1) },
  { c: "Bütün hayatını o", r: (t, a, b) => again("O da bir zamanlar bir cariyeydi", t, a, b, 2) },
  { c: "Ve şimdi, o oğlun yanına, bir bey kızı", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 640], <><ValideOda t={t} win={0.2} />{kv(t, 700, { look: 0.6 })}{sv(t, 1220, { look: -0.5, face: "worried" })}</>) },
  { c: "Hür doğmuş, nikahla", r: (t, a, b) => again("Ve şimdi, o oğlun yanına, bir bey kızı", t, a, b, 0) },
  { c: "İlk hafta, onun dairesine selama gittin", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 640], <><ValideOda t={t} win={0.2} /><Sedir2 x={760} y={900} w={600} />{kv(t, 760, { sit: true, y: 880, look: 0.6 })}{sv(t, 1150, { look: -0.6, bow: 0.6 * ramp(t, a + 1, a + 2), reach: act(t, a + 2, 9, 0.5, 0.4), reachDir: -1 })}</>) },
  { c: "O elini çekmedi ama sana bakmadı da", tone: "cool", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [760, 560], <><ValideOda t={t} win={0.2} /><Sedir2 x={760} y={900} w={600} />{kv(t, 760, { sit: true, y: 880, look: -0.8 })}{kalfa(t, 380, 1, { look: 0.6 })}</>) },
  { c: "Yanındaki kalfaya döndü", r: (t, a, b) => again("O elini çekmedi ama sana bakmadı da", t, a, b, 0) },
  { c: "Bu kız ata biniyormuş", tone: "cool", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [760, 520], <><ValideOda t={t} win={0.2} /><Sedir2 x={760} y={900} w={600} />{kv(t, 760, { sit: true, y: 880, look: -0.8, talk: 1 })}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.2} text="“ATA BİNİYORMUŞ. OK ATIYORMUŞ. BURADA NE İŞİNE YARAYACAK?”" y={820} size={58} /> },
  { c: "Kalfa hafifçe gülümsedi", tone: "cool", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [960, 640], <><ValideOda t={t} win={0.2} />{kalfa(t, 380, 1, { look: 0.6, face: "smile" })}{sv(t, lerp(1150, 1900, ramp(t, a + 1, b)), { walk: proWalk(t, a + 1, b, 1150, 1900, 1.1).walk, look: 0.6, bow: t < a + 1 ? 0.5 : 0, face: "sad" })}</>) },
  { c: "Sonra anladın", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={620} y={440} r={190} k={ramp(t, a + 0.8, a + 1.1)} c={H.pink} label="KISKANÇLIK DEĞİL" /><Disc x={1300} y={440} r={190} k={ramp(t, a + 2, a + 2.3)} c={H.red} label="KORKU" /></>) },
  { c: "Çünkü bir hür prensesin bir oğlu olursa", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], <Sipahiler t={t} n={18} k={1} />),
    html: (t, a, b) => <>{["BİR BEYLİK", "BİR ORDU", "BİR DEDENİN KILICI"].map((l, i) => <Tag key={i} t={t} at={a + 1 + i * (b - a) * 0.18} text={l} c={H.red} x={120 + i * 600} y={140} />)}</> },

  // ── CASUS ──
  { c: "o oğlun arkasında", r: (t, a, b) => again("Çünkü bir hür prensesin bir oğlu olursa", t, a, b, 0), html: (t, a, b) => htmlOf("Çünkü bir hür prensesin bir oğlu olursa", t, b) },
  { c: "Ve bu, haremdeki", r: (t, a, b) => again("Çünkü bir hür prensesin bir oğlu olursa", t, a, b, 1), html: (t, a, b) => htmlOf("Çünkü bir hür prensesin bir oğlu olursa", t, b) },
  { c: "Sonra, daha ağır bir şey başladı", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 560], koridor(t, a, b, () => null, 1, 600, 1100)) },
  { c: "Babana yazdığın mektuplar", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.1], [960, 540], <><rect width={1920} height={1080} fill="#3A2A1E" /><Muhurlu x={960} y={540} s={2.6} rot={-4} broken={ramp(t, a + 2, a + 2.6)} />{nv("nvM", 0.45, [{ x: 960, y: 540, r: 640 }], t)}</>),
    html: (t, a) => <Tag t={t} at={a + 2.8} text="MÜHÜR YERİNDEN OYNAMIŞ" c={H.red} /> },
  { c: "Bunu bir gün", r: (t, a, b) => again("Babana yazdığın mektuplar", t, a, b, 0), html: (t, a, b) => htmlOf("Babana yazdığın mektuplar", t, b) },
  { c: "Babandan gelen mektuplar ise", tone: "night", r: (t, a, b) => keep("Babana yazdığın mektuplar", t, b), html: (t, a, b) => htmlOf("Babana yazdığın mektuplar", t, b) },
  { c: "Yanında getirdiğin dadın, bir sabah", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], <><EskiSaray t={t} rain={0.3} />{dadi(t, lerp(960, -200, ramp(t, a + 0.5, b)), { walk: proWalk(t, a + 0.5, b, 960, -200, 1.1).walk, look: -0.6, face: "sad" })}{sv(t, 1400, { look: -0.6, face: "shock" })}</>) },
  { c: "Sonra Elbistan'dan gelen hizmetçin", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], <><EskiSaray t={t} rain={0.4} />{kard(t, lerp(960, -200, ramp(t, a, b)), 3, { walk: proWalk(t, a, b, 960, -200, 1.0).walk, look: -0.6, face: "sad" })}{sv(t, 1400, { look: -0.6, face: "sad" })}</>) },
  { c: "Şehzadeye sordun", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], oda(t, 0, <>{sv(t, 760, { look: 0.6, talk: 1, face: "worried" })}{sz(t, 1180, { look: -0.4 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="“NEDEN?”" y={820} size={110} /> },
  { c: "Şehzade gözlerini kaçırdı", tone: "cool", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [1180, 520], oda(t, 0, <>{sz(t, 1180, { look: 0.6, talk: 1, face: "sad" })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.15} text="“BU BENİM KARARIM DEĞİL. SARAYIN KURALI BU.”" y={820} size={64} /> },
  { c: "Senin baban bugün", r: (t, a, b) => again("Şehzade gözlerini kaçırdı", t, a, b, 0), html: (t, a, b) => htmlOf("Şehzade gözlerini kaçırdı", t, b) },
  { c: "Senin yanındaki her Türkmen", tone: "cool", r: (t, a, b) => again("Şehzade gözlerini kaçırdı", t, a, b, 1),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="HER SÖZ ELBİSTAN'A" c={H.red} /> },
  { c: "İşte o gün anladın", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [960, 600], <><KafesIc t={t} dusk={1} />{sv(t, 960, { face: "sad", look: 0.1 }, 1.0)}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="SEN BİR REHİNEYDİN" y={70} size={100} accent={H.red} dark /> },

  // ── UZAKLAŞMA ──
  { c: "Sen bir rehineydin", r: (t, a, b) => again("İşte o gün anladın", t, a, b, 0), html: (t, a, b) => htmlOf("İşte o gün anladın", t, b) },
  { c: "Ve eğer bir", r: (t, a, b) => again("İşte o gün anladın", t, a, b, 1), html: (t, a, b) => htmlOf("İşte o gün anladın", t, b) },
  { c: "Aylar geçti", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 560], bahce(t, null, t * 20)),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="BİR YIL" c={H.cobalt} /> },
  { c: "Şehzade, ilk aylarda her gece yanına geliyordu", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], oda(t, 1, <>{sedir}{sv(t, 860, { sit: true, y: 880, look: 0.6, face: "smile" })}{sz(t, 1160, { sit: true, y: 880, look: -0.6, talk: 1 })}</>)) },
  { c: "Sana şiirler okuyordu", r: (t, a, b) => again("Şehzade, ilk aylarda her gece yanına geliyordu", t, a, b, 0) },
  { c: "Sonra seferler başladı", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], <Sipahiler t={t} n={22} k={1} />) },
  { c: "Döndüğünde ise, yorgundu", tone: "cool", r: (t, a, b) => C(t, a, b, [1.8, 2.0], [960, 560], oda(t, 0.6, <>{sz(t, 960, { face: "sad", look: -0.2 }, 1.2)}</>)) },
  { c: "Çünkü Osmanlı sarayında, bir şehzadenin asıl ailesi", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={620} y={440} r={190} k={ramp(t, a + 2.2, a + 2.5)} c={SV.robe} label="NİKÂHLI EŞ" /><Disc x={1300} y={440} r={190} k={ramp(t, a + 3.3, a + 3.6)} c={H.gold} label="OĞUL DOĞURAN" /></>) },
  { c: "Ve sen, bir yıl, iki yıl geçmesine rağmen", tone: "cool", r: (t, a, b) => C(t, a, b, [1.8, 2.1], [960, 700], oda(t, 0, <>{sv(t, 960, { face: "sad", hands: "belly", look: 0 }, 1.2)}</>)) },
  { c: "Bir sabah, toplar atıldı", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.1], [960, 560], <Sky w={1920} h={1080} k={0.6} city />),
    html: (t, a) => <Tag t={t} at={a + 0.8} text="BİR CARİYE, BİR OĞUL" c={H.gold} /> },
  { c: "O gün sarayda şerbetler dağıtıldı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], koridor(t, a, b, (x) => <>{[0, 1, 2].map((i) => cariye(t, x - 500 + i * 420, i, { face: "smile", hands: i === 1 ? "tray" : "fold", trayItem: <SerbetTepsi t={t} />, talk: i % 2 }))}</>, 0.2, 900, 1000)) },
  { c: "Sen de odadan çıktın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], <><ValideOda t={t} win={0.2} />{cariye(t, 760, 2, { hands: "baby", face: "smile", look: 0.5 })}{sv(t, 1160, { look: -0.6, bow: 0.5 * ramp(t, a + 1.5, a + 2.5), face: "smile" })}</>) },
  { c: "Sonra odana döndün", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 640], oda(t, 1, <>{sv(t, 960, { face: "sad", sit: true, y: 900 })}</>)) },
  { c: "Ve o gün, ilk kez, sandığın dibindeki kutuyu", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 700], <><rect width={1920} height={1080} fill="#3A2A1E" /><GulKutu x={960} y={900} s={2.2} open={0} />{nv("nvK2", 0.5, [{ x: 960, y: 700, r: 600 }], t)}</>) },

  // ── SAVAŞ ──
  { c: "Sonra, en çok korktuğun haber geldi", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], <><Steppe t={t} wind={1} /><Horse x={lerp(2100, 700, ramp(t, a, b))} y={980} s={1.0} t={t * 5} dir={-1} c="#3A2A1E" /></>) },
  { c: "Babanın beyliği ile Osmanlı arasında", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={420} y={440} r={200} k={1} c={H.red} label="OSMANLI" /><Disc x={1060} y={440} r={140} k={1} c={SV.robe} label="DULKADİR" /><Disc x={1560} y={440} r={200} k={ramp(t, a + 2.5, a + 2.9)} c="#C99A3E" label="MEMLÜK" /><path d="M640,440 L900,440" stroke={H.red} strokeWidth={14} strokeDasharray="20 14" opacity={ramp(t, a + 0.5, a + 1)} /></>),
    html: (t, a) => <Tag t={t} at={a + 1} text="SINIRDA ÇATIŞMA" c={H.red} /> },
  { c: "Memlükler babanın arkasındaydı", r: (t, a, b) => again("Babanın beyliği ile Osmanlı arasında", t, a, b, 0), html: (t, a, b) => htmlOf("Babanın beyliği ile Osmanlı arasında", t, b) },
  { c: "O ordunun öncülerinden biri, kocandı", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], <><Sipahiler t={t} n={14} k={1} />{sz(t, 960, { face: "normal", look: 0.2, robe: "#5A5A6A" }, 1.15)}</>) },
  { c: "Bir gece, senin adına gizlice getirilmiş", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2.1], [1000, 800], oda(t, 1, <>{sedir}{sv(t, 1000, { sit: true, y: 880, look: 0.5, reach: act(t, a + 1, 9, 0.6, 0.5), reachDir: 1, item: t > a + 1.6 ? <Muhurlu x={0} y={0} s={0.3} /> : undefined, face: "shock" })}</>)) },
  { c: "Kızım. Kocana söyle", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Belge t={t} at={a + 0.2} date="BABANDAN" src="gizli bir mektup · hayali">“Kızım. Kocana söyle. Biz savaş istemiyoruz. Ama halkımı korumak zorundayım.”</Belge> },
  { c: "Mektubu ateşe atman gerekiyordu", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [600, 700], <><ValideOda t={t} win={0.95} />{sv(t, 800, { look: -0.7, reach: 0.6, reachDir: -1, item: <Muhurlu x={0} y={0} s={0.3} />, face: "worried" })}{nv("nvAt2", 0.62, [{ x: 560, y: 700, r: 460 }], t)}</>),
    html: (t, a) => <Tag t={t} at={a + 1.6} text="CASUSLUK SUÇU" c={H.red} /> },
  { c: "Ama atamadın", tone: "night", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [800, 520], <><ValideOda t={t} win={0.95} />{sv(t, 800, { look: 0.2, hands: "fold", face: "sad" })}{nv("nvAt3", 0.62, [{ x: 600, y: 600, r: 460 }], t)}</>) },

  // ── SEÇİM ──
  { c: "Ertesi sabah, şehzadenin odasının kapısını", sfx: "knock", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], koridor(t, a, b, (x, g) => <>{sv(t, x, { walk: g.walk, look: g.look, face: "worried" })}</>, 0.3)) },
  { c: "Bir gelinin kocasının", r: (t, a, b) => again("Ertesi sabah, şehzadenin odasının kapısını", t, a, b, 0) },
  { c: "Ama sen bir Türkmen kızıydın", tone: "gold", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [960, 520], <><ValideOda t={t} win={0.3} />{sv(t, 960, { face: "normal", look: 0.2 }, 1.25)}</>),
    html: (t, a) => <Tag t={t} at={a + 1} text="BÜTÜN KURALLARI UNUTTUN" c={SV.robe} /> },
  { c: "Şehzade, zırhını kuşanıyordu", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [1180, 600], oda(t, 0, <>{sz(t, 1180, { robe: "#5A5A6A", look: -0.5, face: "shock" })}</>)) },
  { c: "Önüne diz çöktün", tone: "cool", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 660], oda(t, 0, <>{sv(t, 820, { sit: true, y: 960, bow: 0.5, look: 0.6, reach: act(t, a + 1, 9, 0.6, 0.4), reachDir: 1, item: <Muhurlu x={0} y={0} s={0.3} /> })}{sz(t, 1180, { robe: "#5A5A6A", look: -0.6 })}</>)) },
  { c: "Babam savaş istemiyor, dedin", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [820, 640], oda(t, 0, <>{sv(t, 820, { sit: true, y: 960, look: 0.7, talk: 1, face: "sad" })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.2} text="“…VE SEN DE İSTEMİYORSUN.”" y={820} size={84} /> },
  { c: "Çünkü sen bir gece, ateşin başında", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], hidir(t, <>{sv(t, 760, { sit: true, y: 960, look: 0.6 })}{yu(t, 1160, { sit: true, y: 960, look: -0.6, talk: 1 })}</>, 960)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="“BARIŞ İÇİNDE UYUYAN BİR ŞEHİR.”" y={820} size={80} accent={H.gold} /> },
  { c: "dünyanın en güzel", r: (t, a, b) => again("Çünkü sen bir gece, ateşin başında", t, a, b, 0), html: (t, a, b) => htmlOf("Çünkü sen bir gece, ateşin başında", t, b) },
  { c: "Şehzade mektubu okudu", tone: "cool", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [1180, 520], oda(t, 0, <>{sz(t, 1180, { robe: "#5A5A6A", look: 0, bow: 0.4, reach: 0.5, reachDir: -1, item: <Muhurlu x={0} y={0} s={0.3} /> })}</>)) },
  { c: "Bu mektubu ben görmedim", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [1180, 520], oda(t, 0, <>{sz(t, 1180, { robe: "#5A5A6A", look: -0.6, talk: 1 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="“BU MEKTUBU BEN GÖRMEDİM. SEN DE BANA GETİRMEDİN.”" y={820} size={62} /> },
  { c: "Ve gitti", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 640], oda(t, 0, <>{sv(t, 820, { sit: true, y: 960, look: 0.6, face: "worried" })}{sz(t, lerp(1180, 2100, ramp(t, a, b)), { robe: "#5A5A6A", walk: proWalk(t, a, b, 1180, 2100, 1.14).walk, look: 0.6 })}</>)) },

  // ── BARIŞ ──
  { c: "O sefer, büyük bir savaş olmadan bitti", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 540], <Yayla t={t} night={0.2} />),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="SAVAŞ OLMADAN" y={70} size={96} accent={H.gold} /> },
  { c: "Elçiler gidip geldi", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], <><Steppe t={t} wind={0.3} />{[0, 1].map((i) => <Horse key={i} x={lerp(i ? 2000 : -100, i ? 1100 : 800, ramp(t, a, b))} y={980} s={0.9} t={t * 4} dir={i ? -1 : 1} c={i ? "#3A2A1E" : "#F2EDE4"} />)}</>),
    html: (t, a, b) => <>{["ELÇİLER", "HEDİYELER", "BİRKAÇ KALE", "BAĞLILIK"].map((l, i) => <Tag key={i} t={t} at={a + 0.4 + i * (b - a) * 0.18} text={l} c={H.gold} x={120 + i * 440} y={140} />)}</> },
  { c: "Sınırda birkaç kale", r: (t, a, b) => again("Elçiler gidip geldi", t, a, b, 0), html: (t, a, b) => htmlOf("Elçiler gidip geldi", t, b) },
  { c: "Bu barışta senin mektubunun bir payı var mıydı", tone: "cool", r: (t, a, b) => C(t, a, b, [1.8, 2.0], [960, 600], <><KafesIc t={t} />{sv(t, 960, { face: "normal", look: 0.2 }, 1.0)}</>),
    html: (t, a) => <Tag t={t} at={a + 1} text="HİÇ ÖĞRENEMEDİN" c={H.night} /> },
  { c: "bunu hiçbir zaman", r: (t, a, b) => again("Bu barışta senin mektubunun bir payı var mıydı", t, a, b, 0), html: (t, a, b) => htmlOf("Bu barışta senin mektubunun bir payı var mıydı", t, b) },
  { c: "Ama döndüğü gece, kapını çaldı", sfx: "knock", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], oda(t, 1, <>{sv(t, 760, { look: 0.6, face: "worried" })}{sz(t, lerp(1900, 1250, ramp(t, a, a + 2.4)), { walk: proWalk(t, a, a + 2.4, 1900, 1250, 1.14).walk, look: -0.6 })}</>)) },
  { c: "pencerenin önüne oturdu", r: (t, a, b) => again("Ama döndüğü gece, kapını çaldı", t, a, b, 0) },
  { c: "Sandıktaki gül hâlâ duruyor mu", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [1250, 560], oda(t, 1, <>{sz(t, 1250, { sit: true, y: 900, look: -0.6, talk: 1, face: "smile" })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="“SANDIKTAKİ GÜL HÂLÂ DURUYOR MU?”" y={820} size={76} accent={H.gold} /> },
  { c: "Duruyor, dedin", sfx: "ding", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 720], <><rect width={1920} height={1080} fill="#3A2A1E" /><GulKutu x={960} y={900} s={2.2} open={ramp(t, a, a + 1.2)} />{nv("nvK3", 0.4, [{ x: 960, y: 700, r: 640 }], t)}</>),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="“DURUYOR.”" y={120} size={110} accent={H.gold} /> },

  // ── İKİ ARADA ──
  { c: "Ama hiçbir şey eskisi gibi olmadı", tone: "cool", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], <><KafesIc t={t} dusk={1} />{sv(t, 960, { face: "sad" }, 1.0)}</>) },
  { c: "Elbistan'dan gelen haberlerde", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], konak(t, <>{genc(t, 760, 0, { talk: 1, look: 0.4 }, 1.05)}{genc(t, 1160, 1, { look: -0.4, face: "worried" }, 1.05)}</>)),
    html: (t, a) => <Txt t={t} at={a + 1.4} text="“BEY KIZI OSMANLI OLDU.”" y={820} size={80} /> },
  { c: "Bey kızı Osmanlı", r: (t, a, b) => again("Elbistan'dan gelen haberlerde", t, a, b, 0), html: (t, a, b) => htmlOf("Elbistan'dan gelen haberlerde", t, b) },
  { c: "Ve Osmanlı sarayında ise", tone: "cool", r: (t, a, b) => again("Bir gün koridorda, iki cariyenin", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="“YAYLANIN KIZI.”" y={820} size={90} /> },
  { c: "Sen, iki dünyanın tam ortasında kalmıştın", tone: "cool", r: (t, a, b) => keep("Senin beyliğin, iki devin arasında", t, b), html: (t, a) => <Txt t={t} at={a + 0.6} text="İKİ DÜNYANIN ORTASINDA" y={880} size={84} accent={SV.robe} /> },
  { c: "İki devin arasında", r: (t, a, b) => again("Sen, iki dünyanın tam ortasında kalmıştın", t, a, b, 0), html: (t, a, b) => htmlOf("Sen, iki dünyanın tam ortasında kalmıştın", t, b) },
  { c: "Yıllar sonra şehzade", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], <><EskiSaray t={t} rain={0} /><DugunAlay t={t} k={ramp(t, a, b)} crowd={0.5} /></>) },
  { c: "Orada, kendi parana, küçük bir cami", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.1], [960, 560], <><Cami t={t} k={1} /></>) },
  { c: "Çeşmenin taşına bir dua yazdırdın", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], <><ValideOda t={t} win={0.2} /><Cesme t={t} x={960} y={860} flow={1} />{kard(t, 1340, 2, { look: -0.6, bow: 0.4 })}</>) },
  { c: "Kurumuş gül ise", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.15], [960, 560], <><rect width={1920} height={1080} fill="#F3E6C4" /><g transform="translate(960,560) scale(5) rotate(20)"><Gul dry={1} /></g></>) },

  // ── BELGE ──
  { c: "Selvinaz'ın hikâyesi hayali", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a, b) => <>{["TEBDİL-İ KIYAFET", "HIDIRELLEZ", "GÜL", "YUSUF"].map((l, i) => <Tag key={i} t={t} at={a + 0.6 + i * (b - a) * 0.15} text={l} c={H.night} x={120 + i * 440} y={140} />)}<Txt t={t} at={a + (b - a) * 0.7} text="HEPSİ BİR MASAL" y={460} size={100} /></> },
  { c: "Ama bu masalın altında, gerçek bir hikâye", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="GERÇEK BİR HİKÂYE" y={420} size={110} accent={H.red} /> },
  { c: "Osmanlı tarihçisi Aşıkpaşazade anlatır", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Belge t={t} at={a + 0.3} date="AŞIKPAŞAZADE" src="Tevârîh-i Âl-i Osman">II. Murad, oğlu Mehmed'e Dulkadir'den gelin istedi. Hızır Paşa'nın eşi Elbistan'a gitti, Süleyman Bey'in beş kızını gördü, birini seçti.</Belge> },
  { c: "Murat, oğlu Şehzade", r: (t, a, b) => again("Osmanlı tarihçisi Aşıkpaşazade anlatır", t, a, b, 0), html: (t, a, b) => htmlOf("Osmanlı tarihçisi Aşıkpaşazade anlatır", t, b) },
  { c: "Amasya valisi Hızır", r: (t, a, b) => again("Osmanlı tarihçisi Aşıkpaşazade anlatır", t, a, b, 1), html: (t, a, b) => htmlOf("Osmanlı tarihçisi Aşıkpaşazade anlatır", t, b) },
  { c: "Dulkadir beyi Süleyman Bey'in beş kızı", tone: "gold", r: (t, a, b) => keep("Osmanlı tarihçisi Aşıkpaşazade anlatır", t, b), html: (t) => <Belge t={t} at={-9} date="AŞIKPAŞAZADE" src="Tevârîh-i Âl-i Osman">II. Murad, oğlu Mehmed'e Dulkadir'den gelin istedi. Hızır Paşa'nın eşi Elbistan'a gitti, Süleyman Bey'in beş kızını gördü, birini seçti.</Belge> },
  { c: "Hızır Paşa'nın eşi", r: (t, a, b) => again("Dulkadir beyi Süleyman Bey'in beş kızı", t, a, b, 0), html: (t, a, b) => htmlOf("Dulkadir beyi Süleyman Bey'in beş kızı", t, b) },
  { c: "Onun adı, Sitti Şah Hatun'du", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], <><ValideOda t={t} win={0.2} />{gelin(t, 960, { face: "normal", robe: SV.robe, scarf: SV.scarf }, 1.3)}</>),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="SİTTİ ŞAH HATUN" sub="Dulkadir prensesi · gerçek kişi" c={SV.robe} /> },
  { c: "Sitti Şah, ağabeyi Malik Arslan'ın eşliğinde", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], <><Steppe t={t} wind={0.4} />{atli(t, lerp(-200, 1400, ramp(t, a, b)), abi(t, 0, { sit: true, y: 1005 }, 0.8), "#7A4E2E", 1, 1.0)}{atli(t, lerp(-600, 1000, ramp(t, a, b)), gelin(t, 0, { sit: true, y: 1005 }, 0.8), "#F2EDE4", 1, 1.0)}</>),
    html: (t, a) => <Tag t={t} at={a + 1} text="1200+ KM · EDİRNE" c={H.cobalt} /> },
  { c: "Bin dört yüz kırk dokuz ya da elli", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.0], [960, 540], <Senlik t={t} k={1} fw={1} tents />),
    html: (t, a, b) => <><Txt t={t} at={a + 0.3} text="EDİRNE · 1449/1450" sub="yaklaşık üç ay süren düğün" y={70} size={84} /><Tag t={t} at={a + (b - a) * 0.6} text="SARAYİÇİ · DERİ ÇADIRLAR" c={H.gold} y={900} /></> },
  { c: "Şiir yarışmaları, ziyafetler", r: (t, a, b) => again("Bin dört yüz kırk dokuz ya da elli", t, a, b, 0), html: (t, a, b) => htmlOf("Bin dört yüz kırk dokuz ya da elli", t, b) },
  { c: "Misafirler Tunca Nehri'nin", r: (t, a, b) => again("Bin dört yüz kırk dokuz ya da elli", t, a, b, 1), html: (t, a, b) => htmlOf("Bin dört yüz kırk dokuz ya da elli", t, b) },
  { c: "Damat ise on yedi yaşındaydı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], <><Otag t={t} night={0} />{sz(t, 960, { face: "normal" }, 1.1)}</>),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="17 YAŞINDA" c={H.red} /> },
  { c: "O, Fatih Sultan Mehmed'di", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.05], [960, 560], <Sky w={1920} h={1080} k={0.85} city />),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="FATİH SULTAN MEHMED" sub="dört yıl sonra İstanbul'u fethetti" c={H.red} /> },

  // ── GERÇEK SON ──
  { c: "Peki gerçek prensesin hayatı nasıl geçti", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], <><KafesIc t={t} />{gelin(t, 960, { robe: SV.robe, scarf: SV.scarf, face: "normal" }, 1.0)}</>) },
  { c: "Kaynaklar, Sitti Şah'ın Fatih'in en sevdiği", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["EN SEVDİĞİ EŞ DEĞİL", "ÇOCUK YOK", "EDİRNE'DE KALDI"].map((l, i) => <Disc key={i} x={420 + i * 540} y={440} r={170} k={ramp(t, a + 0.4 + i * 1.4, a + 0.7 + i * 1.4)} c={[H.night, H.purple, SV.robe][i]} label={l} />)}</>) },
  { c: "Bu evlilikten çocuk", r: (t, a, b) => again("Kaynaklar, Sitti Şah'ın Fatih'in en sevdiği", t, a, b, 0) },
  { c: "İstanbul fethedilince Saray", r: (t, a, b) => again("Kaynaklar, Sitti Şah'ın Fatih'in en sevdiği", t, a, b, 1) },
  { c: "Hayatının geri kalanını", r: (t, a, b) => again("Kaynaklar, Sitti Şah'ın Fatih'in en sevdiği", t, a, b, 2) },
  { c: "Ve bin dört yüz altmış yedi yılında", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], <Mezarlik t={t} n={7} fog={0.8} />),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="1467 · EDİRNE" c={H.night} /> },
  { c: "Edirne'de bugün hâlâ onun adını taşıyan", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.1], [960, 560], <Cami t={t} k={1} />),
    html: (t, a) => <NameCard t={t} at={a + 1} name="SİTTİ ŞAH SULTAN CAMİİ" sub="Edirne" c={SV.robe} /> },
  { c: "Ama kitabesindeki tarih", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={620} y={440} r={190} k={ramp(t, a + 0.3, a + 0.6)} c={H.night} label="ÖLÜM · 1467" /><Disc x={1300} y={440} r={190} k={ramp(t, a + 1.4, a + 1.7)} c={H.gold} label="KİTABE · 1484" /></>) },
  { c: "Tarihçiler camiyi onun", r: (t, a, b) => again("Ama kitabesindeki tarih", t, a, b, 0) },
  { c: "bir başka Dulkadir", r: (t, a, b) => again("Ama kitabesindeki tarih", t, a, b, 1) },
  { c: "Ünlü tarihçi Franz Babinger", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], <><Cami t={t} k={0.5} /><rect width={1920} height={1080} fill="#6A5A3A" opacity={0.25} /></>),
    html: (t, a, b) => <><NameCard t={t} at={a + 0.4} name="FRANZ BABINGER" sub="tarihçi" c={H.night} /><Tag t={t} at={a + (b - a) * 0.5} text="SAMANLIK" c="#8A6A3A" /></> },
  { c: "Bir prensesin adını", r: (t, a, b) => again("Ünlü tarihçi Franz Babinger", t, a, b, 0), html: (t, a, b) => htmlOf("Ünlü tarihçi Franz Babinger", t, b) },
  { c: "yıllarca saman deposu", r: (t, a, b) => again("Ünlü tarihçi Franz Babinger", t, a, b, 1), html: (t, a, b) => htmlOf("Ünlü tarihçi Franz Babinger", t, b) },
  { c: "Ve ancak iki bin altı yılında", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.05], [960, 560], <Cami t={t} k={1} />),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="2006 · YENİDEN İBADETE AÇILDI" y={70} size={80} /> },
  { c: "Bugün Edirne'de, caminin arkasında", tone: "cool", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 640], <Mezarlik t={t} n={5} fog={0.6} />) },

  // ── BEYLİK ──
  { c: "Peki o küçük beyliğin", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.3], [960, 540], <Yayla t={t} night={0.5} />) },
  { c: "Dulkadir beyleri, kızlarını Osmanlı'ya", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 640], <><Senlik t={t} k={1} fw={0} tents />{[0, 1, 2].map((i) => gelin(t, 560 + i * 400, { face: "normal", op: 1 - i * 0.2 }, 0.95 - i * 0.08))}</>),
    html: (t, a) => <Tag t={t} at={a + 1.4} text="YARIM ASIRDAN FAZLA" c={H.gold} /> },
  { c: "Bu evlilikler onlara", r: (t, a, b) => again("Dulkadir beyleri, kızlarını Osmanlı'ya", t, a, b, 0), html: (t, a, b) => htmlOf("Dulkadir beyleri, kızlarını Osmanlı'ya", t, b) },
  { c: "Ama bin beş yüz on beş yılında", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.2], [960, 560], <Sipahiler t={t} n={24} k={1} fire={0.6} />),
    html: (t, a) => <><Txt t={t} at={a + 0.4} text="1515 · TURNADAĞ" y={70} size={90} accent={H.red} /><NameCard t={t} at={a + 2} name="YAVUZ SULTAN SELİM" sub="Dulkadir'i Osmanlı'ya kattı" c={H.red} /></> },
  { c: "Turnadağ'da yapılan savaşta", r: (t, a, b) => again("Ama bin beş yüz on beş yılında", t, a, b, 0), html: (t, a, b) => htmlOf("Ama bin beş yüz on beş yılında", t, b) },
  { c: "Ve o eski Türkmen beyliği", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={960} y={440} r={260} k={1} c={H.red} label="OSMANLI" /><Disc x={960} y={440} r={110} k={1 - ramp(t, a + 0.5, a + 2)} c={SV.robe} label="" /></>) },
  { c: "Kızlarını barış için gelin veren beylik", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 560], <Yayla t={t} night={1} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="SONUNDA YİNE DE SAVAŞLA BİTTİ" y={820} size={80} accent={H.red} /> },

  // ── SONUÇ ──
  { c: "Osmanlı sarayına gelin giden bir prenses olmak", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 540], <Senlik t={t} k={1} fw={1} tents />),
    html: (t, a) => <Tag t={t} at={a + 1} text="DIŞARIDAN: BİR MASAL" c={H.gold} /> },
  { c: "Bir bey kızı", r: (t, a, b) => again("Osmanlı sarayına gelin giden bir prenses olmak", t, a, b, 0), html: (t, a, b) => htmlOf("Osmanlı sarayına gelin giden bir prenses olmak", t, b) },
  { c: "Aylarca süren bir", r: (t, a, b) => again("Osmanlı sarayına gelin giden bir prenses olmak", t, a, b, 1), html: (t, a, b) => htmlOf("Osmanlı sarayına gelin giden bir prenses olmak", t, b) },
  { c: "Ama içeriden bakınca, o prenses bir köprüydü", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={360} y={440} r={200} k={1} c={SV.robe} label="ELBİSTAN" /><Disc x={1560} y={440} r={200} k={1} c={H.red} label="OSMANLI" /><path d="M560,440 Q960,300 1360,440" stroke={H.gold} strokeWidth={18} fill="none" strokeDasharray="1400" strokeDashoffset={1400 * (1 - ramp(t, a + 1, a + 3))} /></>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="İNCE BİR KÖPRÜ" y={860} size={90} /> },
  { c: "iki halkın arasında", r: (t, a, b) => again("Ama içeriden bakınca, o prenses bir köprüydü", t, a, b, 0), html: (t, a, b) => htmlOf("Ama içeriden bakınca, o prenses bir köprüydü", t, b) },
  { c: "Ve bir köprünün", r: (t, a, b) => again("Ama içeriden bakınca, o prenses bir köprüydü", t, a, b, 1), html: (t, a, b) => htmlOf("Ama içeriden bakınca, o prenses bir köprüydü", t, b) },
  { c: "Memleketinde artık Osmanlı'ydı", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["OKUNAN MEKTUPLAR", "GÖNDERİLEN HİZMETÇİLER", "KAPIDAKİ SAVAŞ", "UNUTULMAK"].map((l, i) => <Disc key={i} x={300 + i * 440} y={440} r={150} k={ramp(t, a + 2 + i * 1.3, a + 2.3 + i * 1.3)} c={[H.red, H.purple, H.night, "#6A747A"][i]} label={l} />)}</>) },
  { c: "hizmetçileri geri gönderiliyordu", r: (t, a, b) => again("Memleketinde artık Osmanlı'ydı", t, a, b, 0) },
  { c: "Ve eğer bir", r: (t, a, b) => again("Memleketinde artık Osmanlı'ydı", t, a, b, 1) },
  { c: "Peki sen Selvinaz'ın yerinde olsaydın", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 600], hidir(t, <>{sv(t, 760, { sit: true, y: 960, look: 0.6 })}{yu(t, 1160, { sit: true, y: 960, look: -0.6 })}</>, 960)),
    html: (t, a, b) => <><Txt t={t} at={a + 0.6} text="GERÇEĞİ SÖYLEMESİNİ İSTER MİYDİN?" y={70} size={70} dark /><Txt t={t} at={a + (b - a) * 0.6} text="MEKTUBU ATEŞE Mİ, KOCANA MI?" y={860} size={76} /></> },
  { c: "o gece ateşin", r: (t, a, b) => again("Peki sen Selvinaz'ın yerinde olsaydın", t, a, b, 0), html: (t, a, b) => htmlOf("Peki sen Selvinaz'ın yerinde olsaydın", t, b) },
  { c: "Ve babanın mektubunu", r: (t, a, b) => again("Peki sen Selvinaz'ın yerinde olsaydın", t, a, b, 1), html: (t, a, b) => htmlOf("Peki sen Selvinaz'ın yerinde olsaydın", t, b) },
  { c: "Cevabını yorumlarda bekliyorum", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="CEVABIN YORUMLARDA 👇" y={420} size={100} /> },
  { c: "Eğer bu hikâyeyi sevdiysen", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [960, 540], <><rect width={1920} height={1080} fill="#F3E6C4" /><g transform="translate(960,560) scale(5) rotate(20)"><Gul dry={1} /></g></>),
    html: (t, a) => <Abone t={t} at={a + 0.5} /> },
  { c: "Osmanlı Sarayı'nın duvarları", r: (t, a, b) => again("Eğer bu hikâyeyi sevdiysen", t, a, b, 0), html: (t, a, b) => htmlOf("Eğer bu hikâyeyi sevdiysen", t, b) },
  { c: "Bir sonraki hikâyede görüşmek üzere", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.0], [960, 540], <Yayla t={t} night={0.3} />) },
];

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : s.c.startsWith("+") ? after - 0.2 + parseFloat(s.c) : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K3R_14_SECONDS));
  return raw;
})();

const VOL: Record<string, number> = { whoosh: 0.07, drone: 0.14, boom: 0.15, ding: 0.14, knock: 0.1, pop: 0.12, splash: 0.08 };
export const K3RVideo14: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K3R_14_SECONDS;
  const cut = 1 - ramp(t, s.from, s.from + 0.16);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: ramp(t, 0, 0.5) * (1 - ramp(t, END - 1.2, END)) }}>
        <PFrame>
          <LiveCam t={t} a={s.from}>{s.r(t, s.from, s.to)}</LiveCam>
          {s.fore && <Fore t={t} a={s.from} kind={s.fore} />}
          <Atmos t={t} tone={s.tone ?? "warm"} rays={s.tone === "night" ? 0.4 : 1} seed={n} />
          <Sweep t={t} a={s.from} />
          {cut > 0 && <rect width={1920} height={1080} fill="#FFF8E6" opacity={cut * 0.3} />}
        </PFrame>
        {s.html?.(t, s.from, s.to)}
      </AbsoluteFill>
      <Audio src={staticFile("audio/k3r-14.wav")} />
      {TIMED.map((x, i) => i > 0 && !(x.from > END - 19 && x.sfx && x.sfx !== "whoosh") && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.08) * fps))} durationInFrames={Math.round(2.2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.from > END - 19 ? 0.05 : VOL[x.sfx ?? "whoosh"] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const _unused = { Yelkenli, Petals, Laleler };

const AG = [[1.1, -50, -20], [1.12, 50, 15], [1.08, 0, 30]];
function again(c: string, t: number, a: number, b: number, q: number) {
  const s0 = TIMED.find((x) => x.c === c);
  if (!s0) return null;
  const [z, dx, dy] = AG[q % AG.length];
  // aynı sahne, farklı açı: animasyonlar baştan başlamasın (asıl başlangıç)
  return <g transform={`translate(${960 + dx} ${540 + dy}) scale(${z}) translate(-960 -540)`}>{s0.r(t, Math.min(s0.from, a), b)}</g>;
}
function htmlOf(c: string, t: number, b: number) {
  const s0 = TIMED.find((x) => x.c === c);
  return s0?.html ? s0.html(t, s0.from, b) : null;
}
function keep(c: string, t: number, b: number) {
  const s0 = TIMED.find((x) => x.c === c);
  return s0 ? s0.r(t, s0.from, b) : null;
}
