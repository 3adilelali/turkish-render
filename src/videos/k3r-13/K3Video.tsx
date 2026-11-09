import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k3r-13-words.json";
import { makeCue, ramp } from "../../lib/cues";
import { H, Sky, lerp } from "../../components/Harem";
import { Akce, Carsi, Kogus, Merdiven, SarayKapi } from "../../components/HaremPlus";
import { Avlu, Besik, Cami } from "../../components/HaremPlus2";
import { Abone, Belge, Disc, NameCard, Paper, Tag, Txt } from "../../components/K3Text";
import { Araba, Bohca, Kupe } from "../../components/Kira";
import { BigMangal, EskiSaray, Kafkas, Yelkenli } from "../../components/Hazine";
import { Hamam, KinaEller } from "../../components/Gelin";
import { Kese, TopGece } from "../../components/Dadi";
import { Sandik } from "../../components/Cengi";
import { Atmos, Fore, LiveCam, Sweep, Tone } from "../../components/Live";
import { act } from "../../components/Motion";
import { Bebek, Fincan, ForeColumns, GalleryWall, HasBahce, Fiskiye, Laleler, Motes, NightVeil, P, PCam, PFig, PFrame, Petals, proWalk, Samdan, Sedir2, ValideOda, Birds } from "../../components/HaremPro";
import { DogumSandalye, Kurdele, Muska, Nazarlik, Saksi, SarayPencere, Serbet, SerbetTepsi } from "../../components/HaremHamile";

// Kanal 1 · k3r-13 · "Osmanlı Sarayında Padişahtan Hamile Kalmak Neden Zordu?" — HaremPro kiti (yeni pahalı görünüm).
// Sen: Mihrinaz (asıl adı Setenay, Çerkes, 16). Şevkidil Kalfa. Gerçek kişiler (İbrahim, Kösem, Turhan, Saliha Dilaşub) uzaktan, söz yok.

const ALT: Record<string, string[]> = {
  "Senin adın Mihrinaz": ["Senin adın Mihrinas"], "Bunu bir Venedikli anlatıyor": ["Bunu bir Venedik'le anlatıyor"], "Bu kanun, yüz elli yıldan fazla": ["Bu kanun 150 yıldan fazla"], "Söylediğin bir söz": ["Söylediğim bir söz"], "Ebe bebeği kucağına aldı": ["Ebe ve bebeği kucağına aldı"], "Halk o saraya bir ad takmıştı": ["Halk o saraya bir at takmıştı"], "Ve bin altı yüz seksen yedide": ["Ve 1687'de"], "Annesi Saliha Dilaşub da": ["Annesi Saliha Dilaşuk da"],
  "Yedi aylık": ["7 aylık"], "On üç yaşındayken": ["13 yaşındayken"], "Haseki": ["Haseki."],
  "Dört akçe ile bin akçe": ["4 akçe ile 1000 akçe", "Dört akçe ile 1000 akçe"],
  "Dokuz Şubat": ["9 Şubat"], "İki Ocak": ["2 Ocak"], "Ağustos ayı": ["Ağustos ayı,"],
  "kırk tane altın sikke": ["40 tane altın sikke"], "Doğumdan sonra kırk gün": ["Doğumdan sonra 40 gün"],
};
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const VAR: [RegExp, string][] = [[/â/g, "a"], [/î/g, "i"], [/û/g, "u"]];
const variants = (p: string) => { const out = [p]; for (const [re, to] of VAR) for (const v of [...out]) { const n = v.replace(re, to); if (n !== v) out.push(n); } return out; };
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K3R_13_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone; fore?: "column" | "curtain" | "lamp" };
type PO = Partial<React.ComponentProps<typeof PFig>>;

// ── karakterler ──
const MI_ACEMI = { robe: "#9C8E76", robe2: "#E9DCC2", scarf: "#EFE6D2" };
const MI_GOZDE = { robe: P.sky, robe2: P.rose2 };
const Y = 1005;
const mi = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="girl" {...MI_GOZDE} t={t} seed={3} {...o} />;
const miA = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="girl" {...MI_ACEMI} t={t} seed={3} {...o} />;
const sev = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="kalfa" t={t} seed={7} {...o} />;
const ebe = (t: number, x: number, o: PO = {}, s = 1.16) => <PFig x={x} y={Y} s={s} kind="kalfa" robe="#7A4A3A" robe2="#F1E3C6" scarf="#F4EAD6" t={t} seed={12} {...o} />;
const cariye = (t: number, x: number, o: PO = {}, s = 1.06) => <PFig x={x} y={Y} s={s} kind="girl" robe={P.rose} robe2="#F5E8CC" t={t} seed={9} hands="tray" trayItem={<SerbetTepsi t={t} glow={0.6} />} {...o} />;
const kosem = (t: number, x: number, o: PO = {}, s = 1.14) => <PFig x={x} y={Y} s={s} kind="valide" t={t} seed={5} {...o} />;
const ibr = (t: number, x: number, o: PO = {}, s = 1.18) => <PFig x={x} y={Y} s={s} kind="sultan" t={t} seed={8} {...o} />;
const tur = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="girl" robe="#B8505A" robe2="#F5E0CC" t={t} seed={14} {...o} />;
const sal = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="girl" robe="#7A6AA8" robe2="#EDE2F2" t={t} seed={15} {...o} />;
const kiz = (t: number, x: number, i: number, o: PO = {}, s = 1.0) => <PFig x={x} y={Y} s={s} kind="girl" robe={["#A9C6DA", "#D98E8E", "#9FC3B0", "#E9B58F", "#B8A8D0", "#C9B08A"][i % 6]} robe2="#F5E8CC" t={t} seed={20 + i} {...o} />;
const kalfa = (t: number, x: number, i: number, o: PO = {}, s = 1.08) => <PFig x={x} y={Y} s={s} kind="kalfa" robe={["#5E6E5A", "#6A5A4A", "#4E5D6C"][i % 3]} t={t} seed={30 + i} {...o} />;

// ── mekânlar ──
const L_ODA = [{ x: 560, y: 700, r: 420 }, { x: 1600, y: 640, r: 260 }, { x: 330, y: 640, r: 240 }, { x: 1010, y: 660, r: 360, f: 0.85 }];
const nv = (id: string, k: number, lights: { x: number; y: number; r: number; f?: number }[], t: number) => <NightVeil id={id} k={k} lights={lights} t={t} />;
// Mihrinaz'ın odası (ocak solda, pencere sağda, saksı pencere önünde); figürler veil'in altında
const oda = (t: number, night: number, figs: React.ReactNode, extra: React.ReactNode = null) => (
  <>
    <ValideOda t={t} win={night ? 0.95 : 0.15} />
    <Saksi x={1300} y={830} s={0.62} t={t} />
    <Samdan x={1720} y={1010} t={t} s={1.0} />
    {extra}
    {figs}
    {night > 0 && nv("nvOda", 0.62 * night, L_ODA, t)}
    {night > 0 && <Motes t={t} n={24} x0={300} x1={1100} y0={300} y1={900} op={0.45} />}
  </>
);
const sedir = <Sedir2 x={1000} y={900} w={760} />;
// koridor: yürüyen biri (o.kind vs.), gece
const koridor = (t: number, a: number, b: number, fig: (x: number, w: ReturnType<typeof proWalk>) => React.ReactNode, night = 1, x0 = 300, x1 = 1900) => {
  const g = proWalk(t, a + 0.1, b + 0.6, x0, x1, 1.1);
  const camX = g.x - 900;
  const M = 560, n0 = Math.floor((camX - 200) / M) - 1;
  const lights = Array.from({ length: 6 }, (_, i) => n0 + i).flatMap((m) => { const lx = m * M + M / 2 - camX; return [{ x: lx, y: 380, r: 250 }, { x: lx, y: 980, r: 210, f: 0.75 }]; });
  return (
    <>
      <GalleryWall t={t} camX={camX} night={night} />
      {fig(g.x - camX, g)}
      {night > 0 && nv("nvKor", 0.72 * night, lights, t)}
      <Motes t={t} n={40} op={0.5} />
      <ForeColumns camX={camX} />
    </>
  );
};
const bahce = (t: number, figs: React.ReactNode, pan = 0) => (
  <>
    <HasBahce t={t} pan={pan} />
    <Birds t={t} />
    <Fiskiye x={560} y={905} t={t} s={0.95} />
    <Laleler x={1380} y={890} n={10} t={t} s={0.8} />
    {figs}
    <Laleler x={-60} y={1130} n={7} t={t} s={1.7} blur={8} />
  </>
);
const kogus = (t: number, night = 1, rolled = 0, girls = 6) => <Kogus t={t} night={night} rolled={rolled} girls={girls} />;
const hamam = (t: number, figs: React.ReactNode = null) => <><Hamam t={t} steam={1} rays={1} />{figs}<Motes t={t} n={30} c="#FFFFFF" op={0.35} /></>;
const C = (t: number, a: number, b: number, z: [number, number], c0: [number, number], kids: React.ReactNode, c1?: [number, number]) => <PCam t={t} a={a} b={b} z={z} c0={c0} c1={c1}>{kids}</PCam>;

// hamilelik evresi (karın büyüklüğü)
const B1 = 0.35, B2 = 0.62, B3 = 0.88;

const SHOTS: Sh[] = [
  // ── AN ──
  { c: "Gece yarısı", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.25, 1.05], [960, 520], <><Sky w={1920} h={1080} k={0.1} city /></>),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="TOPKAPI SARAYI · ARALIK 1641" y={70} size={64} dark /> },
  { c: "haremi uyuyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], koridor(t, a, b, () => null, 1, 300, 600)) },
  { c: "Sen uyumuyorsun", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.6], [1000, 640], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B3, hands: "belly", face: "worried", look: 0.3 })}</>)) },
  { c: "Çünkü karnında bir bebek var", tone: "night", r: (t, a, b) => C(t, a, b, [2.0, 2.4], [1000, 800], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B3, hands: "belly", face: "closed" })}</>)),
    html: (t, a) => <Tag t={t} at={a + 1.4} text="YEDİ AYLIK" c={H.cobalt} /> },
  { c: "Ve o bebeğin babası", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 600], <><ValideOda t={t} win={0.2} />{ibr(t, 960, { face: "normal", hands: "down" }, 1.3)}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="OSMANLI PADİŞAHI" y={820} size={96} /> },
  { c: "Odanın kapısı yavaşça açılıyor", sfx: "knock", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [700, 640], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B3, hands: "belly", look: -0.7, face: "worried" })}{cariye(t, lerp(-100, 380, ramp(t, a, a + 2.4)), { walk: proWalk(t, a, a + 2.4, -100, 380, 1.06).walk })}</>)) },
  { c: "Elinde gümüş bir tepsi", tone: "night", r: (t, a, b) => C(t, a, b, [2.6, 3.0], [380, 700], oda(t, 1, <>{cariye(t, 380, { face: "normal", look: 0.5 })}</>)) },
  { c: "Tepside, kırmızı bir şerbet", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.12], [960, 540], <><rect width={1920} height={1080} fill="#2A1A10" /><g transform="translate(960,700) scale(5)"><SerbetTepsi t={t} glow={1} /></g>{nv("nvS", 0.5, [{ x: 960, y: 560, r: 600 }], t)}</>) },
  { c: "Bardağın kenarında karanfil kokusu", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 520], <><rect width={1920} height={1080} fill="#2A1A10" /><g transform="translate(960,820) scale(7)"><Serbet t={t} glow={1} /></g>{nv("nvS2", 0.45, [{ x: 960, y: 520, r: 620 }], t)}</>) },
  { c: "Valide Sultan'dan", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [520, 620], oda(t, 1, <>{cariye(t, 520, { bow: 0.35, talk: 1, look: 0.6 })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.15} text="“VALİDE SULTAN'DAN. KUVVET OLSUN DİYE.”" y={820} size={72} /> },
  { c: "Bardağı alıyorsun", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2.0], [800, 640], oda(t, 1, <>{sedir}{cariye(t, 560, { bow: 0.3, look: 0.6, hands: "fold", reach: act(t, a + 0.2, 9, 0.4, 0.4), reachDir: 1, item: t < a + 0.9 ? <Serbet t={t} s={0.9} /> : undefined })}{mi(t, 1000, { sit: true, y: 880, belly: B3, look: -0.6, reach: act(t, a + 0.6, 9, 0.5, 0.4), reachDir: -1, item: t >= a + 0.9 ? <Serbet t={t} s={0.9} glow={0.6} /> : undefined })}</>)) },
  { c: "Tam dudağına götürecekken", tone: "night", r: (t, a, b) => C(t, a, b, [3.0, 3.4], [1000, 560], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B3, look: -0.2, reach: 0.75, reachDir: -1, item: <Serbet t={t} s={0.9} glow={0.8} /> })}</>)) },
  { c: "Hizmetindeki yaşlı kalfa", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [1700, 640], oda(t, 1, <>{sev(t, 1700, { look: -0.8, face: "worried" })}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="ŞEVKİDİL KALFA" sub="Mihrinaz'ın yaşlı kalfası" c="#5E6E5A" /> },
  { c: "İçme", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [3.2, 3.6], [1700, 520], oda(t, 1, <>{sev(t, 1700, { look: -0.9, face: "shock", talk: 1 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.1} text="“İÇME.”" y={800} size={140} accent={H.red} /> },
  { c: "Kız tepsiyle birlikte kapıda donup", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [520, 620], oda(t, 1, <>{cariye(t, 520, { face: "shock", look: 0.8, hands: "fold" })}</>)) },
  { c: "Sen bardağı havada tutuyorsun", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [1000, 640], oda(t, 1, <>{sedir}{cariye(t, 480, { face: "shock", look: 0.8, hands: "fold" })}{mi(t, 1000, { sit: true, y: 880, belly: B3, look: 0.6, face: "shock", reach: 0.6, reachDir: -1, item: <Serbet t={t} s={0.9} glow={0.8} /> })}{sev(t, 1700, { look: -0.8, face: "worried" })}</>)) },
  { c: "Bu şerbeti gerçekten kim gönderdi", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 520], <><rect width={1920} height={1080} fill="#1A0E08" /><g transform="translate(960,860) scale(8)"><Serbet t={t} glow={1} /></g>{nv("nvS3", 0.5, [{ x: 960, y: 520, r: 560 }], t)}</>),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="KİM GÖNDERDİ?" y={80} size={110} accent={H.red} /> },
  { c: "Bu sorunun cevabını bulmak için", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.2], [960, 540], <SarayKapi t={t} open={ramp(t, a, b)} />) },
  { c: "bir cariyenin padişahtan hamile kalması", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], bahce(t, <>{mi(t, 960, { belly: B2, hands: "belly", face: "smile", look: 0.2 }, 1.2)}</>, t * 20)),
    html: (t, a) => <Tag t={t} at={a + 0.8} text="BİR MUCİZE Mİ?" c={H.gold} /> },
  { c: "Ama aslında", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [960, 600], koridor(t, a, b, (x, g) => mi(t, x, { belly: B2, hands: "belly", walk: g.walk, look: g.look, face: "worried" }))),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="EN TEHLİKELİ GÜNLERİN BAŞLANGICI" y={70} size={68} accent={H.red} dark /> },
  { c: "Bugün, Osmanlı Sarayında", tone: "gold", r: (t, a, b) => C(t, a, b, [1.0, 1.08], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="PADİŞAHTAN HAMİLE KALMAK" sub="neden bu kadar zordu?" y={380} size={100} /> },

  // ── KİMSİN ──
  { c: "zor olduğunu onu", r: (t, a, b) => again("Bugün, Osmanlı Sarayında", t, a, b, 0), html: (t, a, b) => htmlOf("Bugün, Osmanlı Sarayında", t, b) },
  { c: "Senin adın Mihrinaz", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 620], <><ValideOda t={t} win={0.2} />{mi(t, 960, { face: "normal" }, 1.3)}</>),
    html: (t, a) => <NameCard t={t} at={a + 0.3} name="MİHRİNAZ" sub="16 yaşında · Çerkes · haremde bir cariye" c={P.sky} /> },
  { c: "Annenin sana verdiği ad Setenay", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 560], <Kafkas t={t} mist={0.4} />),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="SETENAY" sub="annesinin verdiği ad" y={70} size={96} /> },
  { c: "Kafkas dağlarında", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [700, 520], <Kafkas t={t} mist={0.5} />),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="KAFKASYA" c={H.cobalt} /> },
  { c: "Evinizin önünden soğuk bir dere", tone: "cool", r: (t, a, b) => C(t, a, b, [1.8, 2.0], [960, 800], <Kafkas t={t} mist={0.3} />) },
  { c: "Kışları kar", tone: "cool", r: (t, a, b) => C(t, a, b, [1.5, 1.6], [1200, 700], <><Kafkas t={t} mist={0.7} /><Petals t={t} n={40} c="#FFFFFF" /></>) },
  { c: "On üç yaşındayken", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 600], <><Kafkas t={t} mist={0.3} /><g transform={`translate(${lerp(1900, 1100, ramp(t, a, b))},0)`}>{[0, 1, 2].map((i) => <g key={i} transform={`translate(${i * 130},${860 + (i % 2) * 20})`}><ellipse cx={0} cy={-60} rx={70} ry={34} fill="#2A1E16" /><circle cx={-60} cy={-90} r={18} fill="#2A1E16" /><rect x={-14} y={-150} width={28} height={70} fill="#2A1E16" /><circle cx={0} cy={-164} r={16} fill="#2A1E16" />{[-40, 40].map((lx) => <path key={lx} d={`M${lx},-36 L${lx + Math.sin(t * 12 + i + lx) * 14},20`} stroke="#2A1E16" strokeWidth={10} />)}</g>)}</g></>),
    html: (t, a) => <Tag t={t} at={a + 0.8} text="ATLILAR" c={H.red} /> },
  { c: "Seni ve iki kız arkadaşını aldılar", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 640], <><Kafkas t={t} mist={0.5} />{miA(t, 760, { face: "shock", look: 0.4 }, 0.95)}{kiz(t, 960, 1, { face: "worried", look: -0.3 }, 0.95)}{kiz(t, 1160, 2, { face: "sad", look: -0.5 }, 0.95)}</>) },
  { c: "Annenin son sözünü", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.8], [960, 520], <><Kafkas t={t} mist={0.6} />{kalfa(t, 960, 2, { face: "sad", look: 0.2, talk: 1 }, 1.2)}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.35} text="“NEREYE GİDERSEN GİT, BAŞINI DİK TUT.”" y={820} size={72} accent={H.gold} /> },
  { c: "Haftalarca yol gittiniz", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], <Yelkenli t={t} px={lerp(-200, 300, ramp(t, a, b))} />),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="KARADENİZ" c={H.cobalt} /> },
  { c: "Sonra büyük bir şehir", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [960, 560], <Sky w={1920} h={1080} k={0.85} city />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="İSTANBUL" y={70} size={110} /> },
  { c: "Esir pazarında seni bir tüccar", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], <><Carsi t={t} crowd={1} />{miA(t, 960, { face: "sad", bow: 0.4 }, 1.0)}</>) },
  { c: "O tüccar da seni, saraya hediye etti", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], <SarayKapi t={t} open={ramp(t, a + 0.5, b)} />),
    html: (t, a) => <Tag t={t} at={a + 0.8} text="BİR HEDİYE" c={H.gold} /> },
  { c: "Çünkü güzeldin", tone: "warm", r: (t, a, b) => C(t, a, b, [2.6, 3.0], [960, 520], <><ValideOda t={t} win={0.2} />{miA(t, 960, { face: "shy" }, 1.3)}</>) },
  { c: "saraya kız hediye etmek", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 620], <><ValideOda t={t} win={0.2} /><PFig x={700} y={Y} s={1.15} kind="prince" robe="#2A3A5A" t={t} seed={40} look={0.5} hands="down" face="smile" />{miA(t, 1180, { face: "sad", bow: 0.4, look: -0.4 })}</>) },
  { c: "Saraya girdiğin gün", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], <><ValideOda t={t} win={0.2} />{kalfa(t, 700, 1, { talk: 1, look: 0.5 })}{miA(t, 1150, { look: -0.5, face: "worried" })}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.55} text="MİHRİNAZ" sub="güneş gibi nazlı" y={70} size={110} /> },
  { c: "Ve kayıt defterine", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 540], <Paper />),
    html: (t, a) => <Belge t={t} at={a + 0.3} date="SARAY DEFTERİ" src="Haremde cariyelerin kaydı">MİHRİNAZ<br />bint Abdullah</Belge> },
  { c: "Sarayın kayıtlarında neredeyse bütün", tone: "gold", r: (t, a, b) => keep("Ve kayıt defterine", t, b), html: (t, a) => <><Belge t={t} at={-9} date="SARAY DEFTERİ" src="Haremde cariyelerin kaydı">MİHRİNAZ<br />bint Abdullah</Belge><Txt t={t} at={a + 0.8} text="“ALLAH'IN KULUNUN KIZI”" y={860} size={70} /></> },
  { c: "Yani Allah'ın kulunun", r: (t, a, b) => again("Sarayın kayıtlarında neredeyse bütün", t, a, b, 0), html: (t, a, b) => htmlOf("Sarayın kayıtlarında neredeyse bütün", t, b) },
  { c: "Bu geçmişinin artık", r: (t, a, b) => again("Sarayın kayıtlarında neredeyse bütün", t, a, b, 1), html: (t, a, b) => htmlOf("Sarayın kayıtlarında neredeyse bütün", t, b) },
  { c: "Köyün yok", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.6], [960, 560], <Kafkas t={t} mist={1} />),
    html: (t, a, b) => <>{["KÖYÜN YOK", "AİLEN YOK", "SADECE SARAY"].map((l, i) => <Tag key={i} t={t} at={a + 0.3 + i * (b - a) * 0.25} text={l} c={i === 2 ? H.red : H.night} x={240 + i * 520} y={140} />)}</> },

  // ── ACEMİ ──
  { c: "İlk yıl, sen bir acemiydin", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], kogus(t, 0, 0, 6)),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="ACEMİ" sub="en alttaki cariye" y={70} size={100} /> },
  { c: "Seni büyük bir koğuşa", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.2], [960, 560], kogus(t, 0, 0, 8)) },
  { c: "Her gece yataklar yere seriliyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 620], kogus(t, 1, ramp(t, a, b), 8)) },
  { c: "Ve koğuşun ortasında", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [960, 420], kogus(t, 1, 0, 8)),
    html: (t, a) => <Tag t={t} at={a + 1} text="GECE BOYU YANAN KANDİL" c={H.gold} /> },
  { c: "Çünkü kalfalar", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [1300, 640], <>{kogus(t, 1, 0, 6)}{kalfa(t, 1400, 0, { look: -0.8 }, 0.9)}</>) },
  { c: "Sabahları, şafak sökmeden kalkıyordun", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 600], <>{kogus(t, 0.4, 1 - ramp(t, a, b), 8)}</>) },
  { c: "Türkçe öğrendin", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 640], <><ValideOda t={t} win={0.2} />{kalfa(t, 600, 0, { talk: 1, look: 0.6 })}{miA(t, 1000, { look: -0.5, sit: true, y: 900 })}{kiz(t, 1350, 3, { look: -0.6, sit: true, y: 900 })}</>),
    html: (t, a, b) => <>{["TÜRKÇE", "KUR'AN", "DİKİŞ · NAKIŞ", "KAHVE · ŞERBET"].map((l, i) => <Tag key={i} t={t} at={a + 0.5 + i * (b - a) * 0.2} text={l} c={[H.cobalt, H.teal, H.purple, H.gold][i]} x={120 + i * 440} y={140} />)}</> },
  { c: "Dikiş, nakış, kahve pişirmek", tone: "warm", r: (t, a, b) => C(t, a, b, [2.0, 2.3], [960, 760], <><ValideOda t={t} win={0.2} />{miA(t, 960, { hands: "tray", trayItem: <g><Fincan t={t} s={1} /></g>, face: "normal" }, 1.3)}</>) },
  { c: "Bir odaya nasıl girilir", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 640], <><ValideOda t={t} win={0.2} />{miA(t, 960, { bow: Math.max(0, Math.sin((t - a) * 1.6)) * 0.6 }, 1.2)}</>) },
  { c: "En önemli kural da şuydu", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [700, 520], <><ValideOda t={t} win={0.2} />{kalfa(t, 700, 1, { talk: 1, look: 0.4, face: "normal" }, 1.2)}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="“KONUŞMADAN ÖNCE DÜŞÜN.”" y={820} size={84} /> },
  { c: "Ve çoğu zaman, hiç konuşmayacaksın", tone: "gold", r: (t, a, b) => again("En önemli kural da şuydu", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="“…VE ÇOĞU ZAMAN, HİÇ KONUŞMA.”" y={820} size={80} accent={H.red} /> },
  { c: "Haremin bir merdiveni vardı", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Merdiven t={t} k={ramp(t, a, b)} /></>) },
  { c: "En altta acemiler", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.6], [500, 820], <><Paper /><Merdiven t={t} k={1} hi={0} /></>) },
  { c: "Sonra gedikliler", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [800, 720], <><Paper /><Merdiven t={t} k={1} hi={1} /></>),
    html: (t, a, b) => <>{["SOFRA", "ÇAMAŞIR", "KAHVE"].map((l, i) => <Tag key={i} t={t} at={a + 1 + i * (b - a) * 0.15} text={l} c={H.teal} x={1200} y={140 + i * 100} />)}</> },
  { c: "her birinin kendi", r: (t, a, b) => again("Sonra gedikliler", t, a, b, 0), html: (t, a, b) => htmlOf("Sonra gedikliler", t, b) },
  { c: "Onların başında ustalar ve kalfalar", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [1200, 600], <><Paper /><Merdiven t={t} k={1} hi={3} /></>) },
  { c: "Ve bu merdivenin en tepesine yakın", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.6], [960, 540], <><Paper /><Merdiven t={t} k={1} hi={3} /></>, [1660, 300]) },
  { c: "çok az kızın", r: (t, a, b) => again("Ve bu merdivenin en tepesine yakın", t, a, b, 0) },
  { c: "Onlara gözde ya da ikbal", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["GÖZDE", "İKBAL"].map((l, i) => <Disc key={i} x={640 + i * 640} y={460} r={220} k={ramp(t, a + 0.3 + i * 0.8, a + 0.7 + i * 0.8)} c={[H.pink, H.purple][i]} label={l} />)}</>) },
  { c: "Ve onların da üstünde", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={960} y={460} r={260} k={ramp(t, a + 0.4, a + 0.8)} c={H.gold} label="HASEKİ" /></>),
    html: (t, a) => <Txt t={t} at={a + 1.6} text="PADİŞAHA ÇOCUK DOĞURAN" y={860} size={70} /> },
  { c: "Koğuşta geceleri", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 680], <>{kogus(t, 1, 1, 8)}</>) },
  { c: "Kim kimin hizmetine verildi", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 700], <><ValideOda t={t} win={0.95} />{kiz(t, 640, 1, { sit: true, y: 900, talk: 1, look: 0.6 })}{kiz(t, 960, 2, { sit: true, y: 900, look: -0.5, face: "shock" })}{kiz(t, 1280, 4, { sit: true, y: 900, talk: 1, look: -0.6 })}{nv("nvF", 0.7, [{ x: 960, y: 700, r: 520 }], t)}</>) },
  { c: "Sen bu konuşmaları dinlerdin", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [1500, 640], <><ValideOda t={t} win={0.95} />{miA(t, 1500, { sit: true, y: 900, look: -0.6, face: "normal" })}{nv("nvF2", 0.7, [{ x: 1400, y: 640, r: 420 }], t)}</>) },
  { c: "Bu merdivende hızlı çıkanlar", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Merdiven t={t} k={1} hi={3} /></>),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="HIZLI ÇIKAN, HIZLI DÜŞER." y={860} size={80} accent={H.red} /> },
  { c: "Peki bütün bu emeğin karşılığında", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [960, 600], <><Paper /><Akce x={960} y={540} r={200} spin={t * 2} /></>) },

  // ── BELGE 1 ──
  { c: "Bunu bir Venedikli anlatıyor", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], <Yelkenli t={t} px={lerp(0, 200, ramp(t, a, b))} />),
    html: (t, a) => <NameCard t={t} at={a + 0.6} name="OTTAVIANO BON" sub="Venedik balyosu · İstanbul 1604–1607" c={H.cobalt} /> },
  { c: "1604 ile 1607", r: (t, a, b) => again("Bunu bir Venedikli anlatıyor", t, a, b, 0), html: (t, a, b) => htmlOf("Bunu bir Venedikli anlatıyor", t, b) },
  { c: "Sarayı yakından gözledi", r: (t, a, b) => again("Bunu bir Venedikli anlatıyor", t, a, b, 1), html: (t, a, b) => htmlOf("Bunu bir Venedikli anlatıyor", t, b) },
  { c: "Bon'a göre saraydaki kızlara", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Belge t={t} at={a + 0.3} date="1604–1607" src="Ottaviano Bon · Sarayın tasviri">Kızlara padişahın hazinesinden maaş verilir. Kimi günde 15–20 akçe, kimi 4–5 akçe. Üç ayda bir ödenir.</Belge> },
  { c: "Rütbesine göre bazıları", r: (t, a, b) => again("Bon'a göre saraydaki kızlara", t, a, b, 0), html: (t, a, b) => htmlOf("Bon'a göre saraydaki kızlara", t, b) },
  { c: "Bazıları ise sadece dört", tone: "gold", r: (t, a, b) => keep("Bon'a göre saraydaki kızlara", t, b), html: (t) => <Belge t={t} at={-9} date="1604–1607" src="Ottaviano Bon · Sarayın tasviri">Kızlara padişahın hazinesinden maaş verilir. Kimi günde 15–20 akçe, kimi 4–5 akçe. Üç ayda bir ödenir.</Belge> },
  { c: "Senin payın, en alttakilerden biriydi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.8, 2.1], [960, 780], <>{kogus(t, 0, 0, 4)}{miA(t, 960, { look: 0, face: "normal", reach: 0.4, reachDir: 1, item: <Akce x={0} y={0} r={26} spin={t} /> }, 1.15)}</>) },
  { c: "Ama aynı belgede bir rakam daha var", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Belge t={t} at={a + 0.3} date="1604–1607" src="Ottaviano Bon">Padişahın gözdesi, ona çocuk doğuran kadın, yani haseki: günde 500, hatta 1000 akçe.</Belge> },
  { c: "ona çocuk doğuran", r: (t, a, b) => again("Ama aynı belgede bir rakam daha var", t, a, b, 0), html: (t, a, b) => htmlOf("Ama aynı belgede bir rakam daha var", t, b) },
  { c: "Düşün", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={560} y={460} r={130} k={ramp(t, a + 0.3, a + 0.6)} c={H.night} label="4 AKÇE"><Akce x={0} y={0} r={50} /></Disc><Disc x={1360} y={460} r={260} k={ramp(t, a + 1.2, a + 1.6)} c={H.gold} label="1000 AKÇE">{Array.from({ length: 7 }, (_, i) => <Akce key={i} x={Math.cos(i) * 110} y={Math.sin(i) * 110} r={46} spin={t + i} />)}</Disc></>) },
  { c: "İkisinin arasındaki fark", tone: "gold", r: (t, a, b) => keep("Düşün", t, b) },
  { c: "Padişahın çocuğu", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [2.2, 2.6], [960, 760], <><ValideOda t={t} win={0.2} />{mi(t, 960, { belly: B2, hands: "belly", face: "closed" }, 1.3)}</>),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="PADİŞAHIN ÇOCUĞU" y={80} size={110} accent={H.gold} /> },

  // ── 1640 ──
  { c: "Ve sen saraya girdiğinde", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 680], <><ValideOda t={t} win={0.2} />{kiz(t, 600, 1, { talk: 1, look: 0.6 })}{kiz(t, 900, 3, { look: -0.4, face: "worried" })}{kalfa(t, 1250, 2, { talk: 1, look: -0.6 })}{miA(t, 1580, { look: -0.6 })}</>) },
  { c: "Çünkü Osmanlı hanedanı", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.3], [960, 560], <Sky w={1920} h={1080} k={0.4} city />),
    html: (t, a) => <Tag t={t} at={a + 0.8} text="EN TEHLİKELİ GÜNLER" c={H.red} /> },
  { c: "Şubat ayı", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 560], <><rect width={1920} height={1080} fill="#2A2A3A" />{ibr(t, 960, { robe: "#3A2A2A", face: "closed", hands: "down", bow: 0.2, op: 0.0 })}<Cami t={t} k={0.4} /></>),
    html: (t, a) => <><Txt t={t} at={a + 0.4} text="ŞUBAT 1640" y={70} size={80} dark /><NameCard t={t} at={a + 1.4} name="IV. MURAD" sub="27 yaşında öldü · yaşayan oğlu yoktu" c="#3A2A2A" /></> },
  { c: "Arkasında yaşayan tek", r: (t, a, b) => again("Şubat ayı", t, a, b, 0), html: (t, a, b) => htmlOf("Şubat ayı", t, b) },
  { c: "Peki şimdi tahta kim çıkacaktı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.2], [960, 640], <><ValideOda t={t} win={0.2} /><g transform="translate(960,1000) scale(1.1)"><path d="M-200,0 L-200,-300 Q0,-420 200,-300 L200,0Z" fill={P.crimson} stroke="#4A3524" strokeWidth={5} /><path d="M-200,0 L-200,-300 Q0,-420 200,-300 L200,0Z" fill="url(#pBrocade)" opacity={0.6} /><rect x={-240} y={-140} width={480} height={140} fill={P.gold} stroke="#4A3524" strokeWidth={5} /></g></>),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="TAHTA KİM ÇIKACAK?" y={70} size={96} /> },
  { c: "Murad'ın kardeşleri vardı", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper />{["BAYEZİD · 1635", "SÜLEYMAN · 1635", "KASIM · 1638"].map((l, i) => <Disc key={i} x={420 + i * 540} y={460} r={180} k={ramp(t, a + 0.4 + i * 0.9, a + 0.8 + i * 0.9)} c={H.night} label={l}><path d="M-80,-80 L80,80 M80,-80 L-80,80" stroke={H.red} strokeWidth={16} opacity={ramp(t, a + 2.8 + i * 0.3, a + 3.1 + i * 0.3)} /></Disc>)}</>) },
  { c: "Bayezid ve Süleyman", r: (t, a, b) => again("Murad'ın kardeşleri vardı", t, a, b, 0) },
  { c: "Kardeş katli denen o eski kanun", tone: "cool", r: (t, a, b) => keep("Murad'ın kardeşleri vardı", t, b), html: (t, a) => <Txt t={t} at={a + 0.4} text="KARDEŞ KATLİ" y={880} size={90} accent={H.red} /> },
  { c: "Geriye tek bir kişi kalmıştı", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 560], koridor(t, a, b, () => null, 1, 400, 900)) },
  { c: "Yıllardır sarayın en iç odalarından", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.7], [960, 640], <><ValideOda t={t} win={0.95} />{ibr(t, 960, { face: "worried", sit: true, y: 900, look: -0.3 })}{nv("nvI", 0.72, [{ x: 960, y: 640, r: 400 }], t)}</>),
    html: (t, a, b) => <NameCard t={t} at={a + (b - a) * 0.55} name="ŞEHZADE İBRAHİM" sub="hanedanın yaşayan tek erkeği" c="#2E4A7A" /> },
  { c: "Osmanlı tarihçileri", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [960, 560], <><ValideOda t={t} win={0.95} />{ibr(t, 960, { face: "shock", sit: true, y: 900, look: -0.6 })}{nv("nvI2", 0.7, [{ x: 960, y: 560, r: 380 }], t)}</>) },
  { c: "İbrahim kapısına gelenlerin", r: (t, a, b) => again("Osmanlı tarihçileri", t, a, b, 0) },
  { c: "Ancak annesi Kösem Sultan", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 640], <><ValideOda t={t} win={0.6} />{kosem(t, 700, { look: 0.6, talk: 1 })}{ibr(t, 1200, { look: -0.5, face: "worried" })}</>) },
  { c: "Dokuz Şubat", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.3], [960, 600], <><ValideOda t={t} win={0.2} /><g transform="translate(960,1000)"><path d="M-200,0 L-200,-300 Q0,-420 200,-300 L200,0Z" fill={P.crimson} stroke="#4A3524" strokeWidth={5} /><rect x={-240} y={-140} width={480} height={140} fill={P.gold} stroke="#4A3524" strokeWidth={5} /></g>{ibr(t, 960, { sit: true, y: 900, face: "normal" }, 1.2)}</>),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="9 ŞUBAT 1640 · SULTAN İBRAHİM" y={70} size={72} /> },
  { c: "Ve bütün imparatorluk", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.3], [960, 560], <Sky w={1920} h={1080} k={0.5} city />) },
  { c: "Osman Gazi'den beri", r: (t, a, b) => again("Ve bütün imparatorluk", t, a, b, 0) },
  { c: "Eğer ona bir şey olursa", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={960} y={460} r={240} k={ramp(t, a + 0.3, a + 0.7)} c="#2E4A7A" label="TEK ERKEK" /></>),
    html: (t, a) => <Txt t={t} at={a + 1.2} text="ARKASINDA KİMSE YOK" y={860} size={80} accent={H.red} /> },

  // ── KÖSEM ──
  { c: "Bu korkuyu en derinden yaşayan", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], <><ValideOda t={t} win={0.4} />{kosem(t, 960, { face: "worried" }, 1.3)}</>),
    html: (t, a, b) => <NameCard t={t} at={a + (b - a) * 0.5} name="KÖSEM SULTAN" sub="Valide · iki padişahın annesi" c={P.crimson} /> },
  { c: "Kösem, otuz yıldır", tone: "gold", r: (t, a, b) => again("Bu korkuyu en derinden yaşayan", t, a, b, 2), html: (t, a, b) => htmlOf("Bu korkuyu en derinden yaşayan", t, b) },
  { c: "Ve şimdi hanedanın", r: (t, a, b) => again("Kösem, otuz yıldır", t, a, b, 0), html: (t, a, b) => htmlOf("Kösem, otuz yıldır", t, b) },
  { c: "Oğlunun bir oğlu olmasına", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={960} y={460} r={230} k={ramp(t, a + 0.3, a + 0.7)} c={H.gold} label="BİR VARİS"><g transform="translate(0,30) scale(1.4)"><Bebek t={t} /></g></Disc></>) },
  { c: "Kaynaklar, Kösem Sultan'ın bu dönemde", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [960, 760], <><ValideOda t={t} win={0.6} />{kosem(t, 760, { look: 0.6, reach: act(t, a + 0.6, 9, 0.6, 0.5), reachDir: 1, item: <Muska x={0} y={-40} s={0.5} /> })}{kalfa(t, 1180, 0, { bow: 0.4, look: -0.5 })}</>),
    html: (t, a, b) => <>{["MUSKALAR", "İLAÇLAR", "ŞURUPLAR"].map((l, i) => <Tag key={i} t={t} at={a + 0.8 + i * (b - a) * 0.2} text={l} c={[H.purple, H.teal, H.red][i]} x={200 + i * 560} y={140} />)}</> },
  { c: "ilaçlar ve şuruplar", r: (t, a, b) => again("Kaynaklar, Kösem Sultan'ın bu dönemde", t, a, b, 0), html: (t, a, b) => htmlOf("Kaynaklar, Kösem Sultan'ın bu dönemde", t, b) },
  { c: "Haremde dualar okunuyordu", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 640], <><ValideOda t={t} win={0.95} />{[0, 1, 2, 3].map((i) => kalfa(t, 480 + i * 320, i, { sit: true, y: 900, bow: 0.5, face: "closed" }))}{nv("nvD", 0.66, [{ x: 960, y: 680, r: 560 }], t)}</>) },
  { c: "padişahın huzuruna çıkacak", r: (t, a, b) => again("Haremde dualar okunuyordu", t, a, b, 0) },
  { c: "Kim seçilecekti", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 640], <><ValideOda t={t} win={0.2} />{[0, 1, 2, 3, 4].map((i) => kiz(t, 360 + i * 300, i, { look: (i - 2) * -0.2, face: i === 2 ? "worried" : "normal" }))}</>) },
  { c: "Ya ben", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [2.6, 3.0], [960, 540], <><ValideOda t={t} win={0.2} />{miA(t, 960, { face: "shy" }, 1.3)}</>),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="“YA BEN?”" y={820} size={130} accent={H.gold} /> },

  // ── SEÇİLMEK ──
  { c: "Bir sabah, koğuşun kapısında", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 640], <>{kogus(t, 0, 0, 8)}{sev(t, lerp(1800, 1300, ramp(t, a, a + 2.5)), { walk: proWalk(t, a, a + 2.5, 1800, 1300, 1.0).walk, look: -0.6 }, 1.0)}</>) },
  { c: "Kızların yüzüne tek tek baktı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 640], <><ValideOda t={t} win={0.2} />{[0, 1, 2, 3].map((i) => kiz(t, 300 + i * 300, i, { face: "worried", look: 0.4 }))}{miA(t, 1500, { face: "worried", look: -0.3 })}{sev(t, lerp(500, 1250, ramp(t, a, b)), { walk: proWalk(t, a, b, 500, 1250, 1.1).walk, look: -0.6 })}</>) },
  { c: "Ve senin önünde durdu", tone: "gold", r: (t, a, b) => C(t, a, b, [1.9, 2.1], [1380, 600], <><ValideOda t={t} win={0.2} />{sev(t, 1240, { look: 0.6 })}{miA(t, 1500, { face: "shock", look: -0.5 })}</>) },
  { c: "Mihrinaz. Kalk", tone: "gold", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [1240, 520], <><ValideOda t={t} win={0.2} />{sev(t, 1240, { look: 0.6, talk: 1 })}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.1} text="“MİHRİNAZ. KALK. BENİMLE GEL.”" y={820} size={80} /> },
  { c: "Kalbin göğsünden çıkacak gibi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], koridor(t, a, b, (x, g) => <>{sev(t, x + 260, { walk: g.walk, look: g.look })}{miA(t, x - 60, { walk: g.walk, look: g.look, face: "worried" })}</>, 0.4)) },
  { c: "Seni hamama götürdüler", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 540], hamam(t)),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="HAREM HAMAMI" c={H.teal} /> },
  { c: "Saçların gül suyuyla tarandı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 640], hamam(t, <>{miA(t, 960, { sit: true, y: 920, face: "closed" })}{kalfa(t, 1240, 1, { look: -0.6, reach: 0.5, reachDir: -1 })}</>)) },
  { c: "Ellerine kına yakıldı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], <KinaEller t={t} k={ramp(t, a, b)} />) },
  { c: "Sana ipek bir entari giydirdiler", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.3], [960, 620], <><ValideOda t={t} win={0.2} />{mi(t, 960, { face: "shy" }, 1.3)}<Petals t={t} n={14} c="#F7E6A8" /></>),
    html: (t, a, b) => <Tag t={t} at={a + (b - a) * 0.5} text="AÇIK MAVİ · ALTIN ÇİÇEKLİ" c={P.sky} /> },
  { c: "Sonra seni bir odaya oturttular", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [1000, 640], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, face: "worried", look: -0.5 })}</>)) },
  { c: "O gece neler olduğunu kimse anlatmaz", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 560], koridor(t, a, b, () => null, 1, 700, 1300)),
    html: (t, a) => <Tag t={t} at={a + 1} text="SARAYIN SIRRI" c={H.night} /> },
  { c: "Sarayın en büyük", r: (t, a, b) => again("O gece neler olduğunu kimse anlatmaz", t, a, b, 0), html: (t, a, b) => htmlOf("O gece neler olduğunu kimse anlatmaz", t, b) },
  { c: "Ama ertesi sabah", r: (t, a, b) => again("O gece neler olduğunu kimse anlatmaz", t, a, b, 1), html: (t, a, b) => htmlOf("O gece neler olduğunu kimse anlatmaz", t, b) },
  { c: "Sabah, kapına bir bohça geldi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [960, 760], <><ValideOda t={t} win={0.2} /><Bohca x={960} y={900} s={1.4} t={t} open={ramp(t, a + 0.6, a + 2)} letter={false} /></>) },
  { c: "İçinde yeni kumaşlar", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["KUMAŞLAR", "ALTIN KÜPE", "BİR KESE AKÇE"].map((l, i) => <Disc key={i} x={420 + i * 540} y={460} r={170} k={ramp(t, a + 0.3 + i * 0.6, a + 0.6 + i * 0.6)} c={[H.purple, H.gold, H.teal][i]} label={l}>{i === 1 && <Kupe x={0} y={0} s={1.6} t={t} />}{i === 2 && <Kese x={0} y={40} s={1.3} t={t} />}</Disc>)}</>) },
  { c: "Koğuştaki kızlar, sen geçerken", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], koridor(t, a, b, (x, g) => <>{kiz(t, x - 520, 1, { look: 0.5, face: "smile" })}{kiz(t, x + 480, 4, { look: -0.5, face: "worried" })}{mi(t, x, { walk: g.walk, look: g.look, face: "shy" })}</>, 0.3)) },
  { c: "Bazıları ise sana, ilk kez, korkuyla", tone: "warm", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [960, 520], <><ValideOda t={t} win={0.2} />{kiz(t, 960, 5, { face: "worried", look: 0.6 }, 1.2)}</>) },
  { c: "Çünkü artık sıradan bir cariye değildin", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.8], [960, 600], <><ValideOda t={t} win={0.2} />{mi(t, 960, { face: "normal" }, 1.3)}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="ARTIK BİR GÖZDE" y={70} size={96} accent={H.pink} /> },
  { c: "Ve sarayda, her gözdenin arkasında", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 640], <><ValideOda t={t} win={0.2} />{[0, 1, 2, 3, 4, 5].map((i) => kiz(t, 200 + i * 300, i, { look: i < 3 ? 0.7 : -0.7, face: "worried", op: 0.9 }, 0.9))}{mi(t, 960, { face: "worried" }, 1.15)}</>) },

  // ── BEKLEYİŞ ──
  { c: "Haftalar geçti", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [1500, 560], oda(t, 0, <>{mi(t, 1400, { look: 0.7, face: "sad" })}</>)),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="PADİŞAH BİR DAHA ÇAĞIRMADI" c={H.night} /> },
  { c: "Bu sarayda en zor şey, beklemekti", tone: "cool", r: (t, a, b) => C(t, a, b, [2.0, 2.3], [1400, 560], oda(t, 0, <>{mi(t, 1400, { look: 0.8, face: "closed" })}</>)) },
  { c: "Bir gece seçilirdin", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={620} y={460} r={190} k={ramp(t, a + 0.3, a + 0.6)} c={H.pink} label="BİR GECE SEÇİLİRDİN" /><Disc x={1300} y={460} r={190} k={ramp(t, a + 1.4, a + 1.8)} c={H.night} label="ERTESİ AY UNUTULURDUN" /></>) },
  { c: "Haremde yüzlerce kız vardı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 600], bahce(t, <>{Array.from({ length: 7 }, (_, i) => kiz(t, 120 + i * 280, i, { look: Math.sin(i) * 0.5, face: i % 3 ? "normal" : "smile" }, 0.85 + (i % 2) * 0.1))}</>, t * 10)) },
  { c: "Sonra bir sabah, kalktığında başın döndü", tone: "cool", r: (t, a, b) => C(t, a, b, [1.5, 1.8], [1000, 640], oda(t, 0.3, <>{sedir}{mi(t, 1000, { sit: true, y: 880, face: "worried", look: Math.sin((t - a) * 3) * 0.4 })}</>)),
    html: (t, a, b) => <div style={{ position: "absolute", inset: 0, backdropFilter: `blur(${4 * Math.max(0, Math.sin((t - a) * 2))}px)` }} /> },
  { c: "Kahvaltı tepsisindeki zeytinin kokusu", tone: "cool", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [1000, 560], oda(t, 0.3, <>{sedir}{mi(t, 1000, { sit: true, y: 880, face: "sad", look: 0.5 })}</>)) },
  { c: "Bir hafta sonra yine", tone: "cool", r: (t, a, b) => again("Kahvaltı tepsisindeki zeytinin kokusu", t, a, b, 1),
    html: (t, a, b) => <>{["1. HAFTA", "2. HAFTA", "3. HAFTA"].map((l, i) => <Tag key={i} t={t} at={a + i * (b - a) * 0.3} text={l} c={H.night} x={200 + i * 560} y={140} />)}</> },
  { c: "Şevkidil Kalfa, seni bir köşeye çekti", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 620], oda(t, 0, <>{sev(t, 820, { look: 0.6 })}{mi(t, 1120, { look: -0.6, face: "worried" })}</>)) },
  { c: "Sonra elini karnına koydu", tone: "warm", r: (t, a, b) => C(t, a, b, [2.0, 2.4], [970, 720], oda(t, 0, <>{sev(t, 820, { look: 0.6, reach: act(t, a + 0.3, 9, 0.7, 0.5), reachDir: 1 })}{mi(t, 1120, { look: -0.6, face: "shock", belly: B1 * 0.6 })}</>)) },
  { c: "Kimseye söyleme", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [2.8, 3.1], [820, 520], oda(t, 0, <>{sev(t, 820, { look: 0.6, talk: 1, face: "worried" })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="“KİMSEYE SÖYLEME.”" y={820} size={110} accent={H.red} /> },
  { c: "O an anladın", tone: "gold", r: (t, a, b) => C(t, a, b, [2.0, 2.5], [960, 720], <><ValideOda t={t} win={0.2} />{mi(t, 960, { belly: B1 * 0.6, hands: "belly", face: "shock" }, 1.3)}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="PADİŞAHIN ÇOCUĞU" y={70} size={96} accent={H.gold} /> },

  // ── EBE ──
  { c: "Ama sarayda hiçbir sır uzun süre", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 640], koridor(t, a, b, (x) => <>{kiz(t, x - 120, 1, { talk: 1, look: 0.6 })}{kiz(t, x + 180, 2, { look: -0.6, face: "shock" })}</>, 0.3, 900, 1000)) },
  { c: "Birkaç gün sonra, saray ebesi geldi", sfx: "knock", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 620], oda(t, 0, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B1, look: -0.6 })}{ebe(t, lerp(-100, 520, ramp(t, a, a + 2.4)), { walk: proWalk(t, a, a + 2.4, -100, 520, 1.16).walk, look: 0.6 })}</>)),
    html: (t, a) => <Tag t={t} at={a + 1.2} text="SARAY EBESİ" c="#7A4A3A" /> },
  { c: "Yaşlı, tombul bir kadındı", tone: "warm", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [520, 560], oda(t, 0, <>{ebe(t, 520, { look: 0.6, face: "normal" })}</>)) },
  { c: "Seni muayene etti", tone: "warm", r: (t, a, b) => C(t, a, b, [1.8, 2.0], [860, 680], oda(t, 0, <>{sedir}{ebe(t, 720, { look: 0.7, reach: act(t, a + 0.4, 9, 0.6, 0.5), reachDir: 1, bow: 0.3 })}{mi(t, 1000, { sit: true, y: 880, belly: B1, look: -0.6, face: "worried" })}</>)) },
  { c: "Sonra başını salladı", tone: "gold", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [720, 520], oda(t, 0, <>{ebe(t, 720, { look: 0.5, bow: Math.abs(Math.sin((t - a) * 4)) * 0.35 })}</>)) },
  { c: "Haber, haremin koridorlarında", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 600], koridor(t, a, b, (x, g) => <>{kiz(t, x, 3, { walk: g.walk, look: g.look, talk: 1 })}</>, 0.25)) },
  { c: "Koğuştan çıkarıldın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 620], <>{kogus(t, 0, 1, 6)}{mi(t, lerp(900, 1700, ramp(t, a, b)), { walk: proWalk(t, a, b, 900, 1700, 1.0).walk, look: 0.4, belly: B1 }, 1.0)}</>) },
  { c: "Sana küçük ama kendine ait bir oda", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.25, 1.05], [960, 560], oda(t, 0, <>{sedir}<BigMangal x={420} y={960} s={0.8} t={t} />{mi(t, 1000, { belly: B1, face: "smile", look: 0.3 })}</>)),
    html: (t, a, b) => <>{["SEDİR", "MANGAL", "AYNA"].map((l, i) => <Tag key={i} t={t} at={a + 1 + i * (b - a) * 0.2} text={l} c={H.teal} x={200 + i * 560} y={140} />)}</> },
  { c: "Odanda bir sedir", r: (t, a, b) => again("Sana küçük ama kendine ait bir oda", t, a, b, 0), html: (t, a, b) => htmlOf("Sana küçük ama kendine ait bir oda", t, b) },
  { c: "Sana iki genç cariye verildi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 640], oda(t, 0, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B1 })}{kiz(t, 560, 1, { bow: 0.4, look: 0.6 })}{kiz(t, 1440, 4, { bow: 0.4, look: -0.6 })}</>)) },
  { c: "Ve yemeklerin değişti", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [700, 700], oda(t, 0, <>{kiz(t, 700, 2, { hands: "tray", trayItem: <Fincan t={t} s={1.1} />, look: 0.4 })}</>)) },
  { c: "Ve onu sana getirmeden önce", tone: "cool", r: (t, a, b) => C(t, a, b, [2.4, 2.8], [820, 560], oda(t, 0, <>{sev(t, 820, { look: 0.3, reach: 0.7, reachDir: 1, item: <Fincan t={t} s={0.9} />, face: "closed" })}</>)),
    html: (t, a) => <Tag t={t} at={a + 1} text="ÖNCE BİRİ TADAR" c={H.red} /> },
  { c: "İşte o an, ilk kez anladın", tone: "gold", r: (t, a, b) => C(t, a, b, [2.0, 2.3], [1000, 600], oda(t, 0, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B1, hands: "belly", face: "worried", look: -0.4 })}</>)) },
  { c: "Bu ayrıcalıklar, bir korumaydı", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={960} y={460} r={250} k={ramp(t, a + 0.2, a + 0.6)} c={H.cobalt} label="AYRICALIK = KORUMA" /></>) },

  // ── VALİDE ──
  { c: "Bir öğleden sonra", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], koridor(t, a, b, (x, g) => <>{kalfa(t, x + 320, 0, { walk: g.walk, look: g.look })}{kosem(t, x - 80, { walk: g.walk, look: g.look })}{kalfa(t, x - 460, 1, { walk: g.walk, look: g.look })}</>, 0.2)) },
  { c: "İki ağa önden", r: (t, a, b) => again("Bir öğleden sonra", t, a, b, 0) },
  { c: "Ve en arkada", r: (t, a, b) => again("Bir öğleden sonra", t, a, b, 1) },
  { c: "Valide Kösem Sultan", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [960, 520], <><ValideOda t={t} win={0.2} />{kosem(t, 960, { face: "normal", look: 0.2 }, 1.3)}</>),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="KÖSEM SULTAN" sub="Valide · uzaktan" c={P.crimson} /> },
  { c: "Hemen ayağa kalktın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [1000, 640], oda(t, 0, <>{sedir}{mi(t, 1000, { sit: ramp(t, a, a + 0.6) < 0.5, y: t < a + 0.6 ? 880 : Y, belly: B2, look: -0.7, face: "shock" })}{sev(t, 1500, { look: -0.6 })}</>)) },
  { c: "Ama kalfa, gözleriyle", tone: "warm", r: (t, a, b) => C(t, a, b, [2.6, 3.0], [1500, 520], oda(t, 0, <>{sev(t, 1500, { look: -0.8, bow: 0.3 })}</>)) },
  { c: "Hamile bir kadının, valideye bile", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [1000, 640], oda(t, 0, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B2, hands: "belly", look: -0.7, face: "shy" })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="İLK GERÇEK SAYGI" y={70} size={84} accent={H.gold} /> },
  { c: "Kösem Sultan içeri girmedi", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [400, 600], oda(t, 0, <>{kosem(t, 300, { look: 0.7 })}{kalfa(t, 80, 0, { look: 0.5 })}</>)) },
  { c: "Seni baştan aşağı süzdü", tone: "gold", r: (t, a, b) => C(t, a, b, [2.8, 3.1], [300, 500], oda(t, 0, <>{kosem(t, 300, { look: 0.8 })}</>), [300, 640]) },
  { c: "Odanın penceresine, mangalına", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.6], [1500, 560], oda(t, 0, <><BigMangal x={420} y={960} s={0.8} t={t} /></>), [500, 700]) },
  { c: "Sonra yanındaki kalfaya bir şey söyledi", tone: "gold", r: (t, a, b) => C(t, a, b, [2.0, 2.2], [200, 560], oda(t, 0, <>{kosem(t, 300, { look: -0.6, talk: 1 })}{kalfa(t, 80, 0, { look: 0.6, bow: 0.3 })}</>)) },
  { c: "Ve geldiği gibi, sessizce gitti", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [700, 600], oda(t, 0, <>{kosem(t, lerp(300, -300, ramp(t, a, b)), { walk: proWalk(t, a, b, 300, -300, 1.14).walk, look: -0.6 })}</>)) },
  { c: "O akşam, odana bir sandık geldi", sfx: "knock", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.8], [960, 800], oda(t, 1, <><Sandik x={960} y={980} s={1.6} open={ramp(t, a + 0.8, a + 2.2)} t={t} /></>)) },
  { c: "Kesede, kırk tane altın sikke", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{Array.from({ length: 40 }, (_, i) => { const k = ramp(t, a + 0.3 + i * 0.05, a + 0.5 + i * 0.05); return <g key={i} opacity={k}><Akce x={460 + (i % 10) * 110} y={300 + Math.floor(i / 10) * 140 - (1 - k) * 60} r={44} spin={t + i} /></g>; })}</>),
    html: (t, a) => <Txt t={t} at={a + 2.5} text="40 ALTIN" y={880} size={90} accent={H.gold} /> },
  { c: "Şevkidil Kalfa sikkeleri tek tek saydı", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2.0], [960, 700], oda(t, 1, <><Sandik x={1200} y={980} s={1.2} open={1} t={t} />{sev(t, 900, { sit: true, y: 920, look: 0.5, bow: 0.4, reach: 0.4 + 0.1 * Math.sin((t - a) * 6), reachDir: 1, item: <Akce x={0} y={0} r={20} /> })}</>)) },
  { c: "Bu altınlar bir hediye", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [900, 600], oda(t, 1, <>{sev(t, 900, { sit: true, y: 920, look: 0.6, talk: 1 })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“BİR HEDİYE… AMA AYNI ZAMANDA BİR MESAJ.”" y={820} size={68} /> },
  { c: "Valide, seni gördüğünü söylüyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [1000, 640], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B2, hands: "belly", look: -0.4, face: "worried" })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="ARTIK BÜTÜN HAREM SENİ GÖRÜYOR" y={70} size={72} accent={H.red} dark /> },

  // ── YARIŞ ──
  { c: "Peki seni kimden koruyorlardı", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.5], [960, 560], koridor(t, a, b, () => null, 1, 1200, 1700)) },
  { c: "Cevap, koridorun öbür ucundaydı", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.9], [960, 600], koridor(t, a, b, (x) => <>{tur(t, x + 500, { belly: B2, hands: "belly", look: -0.6, op: 0.9 }, 0.8)}</>, 1, 1000, 1100)) },
  { c: "Haremde bir kız daha vardı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 620], <><ValideOda t={t} win={0.2} />{tur(t, 960, { belly: B2 + 0.1, hands: "belly", look: 0.3, face: "smile" }, 1.25)}</>),
    html: (t, a, b) => <NameCard t={t} at={a + (b - a) * 0.5} name="TURHAN" sub="o da hamile · gerçek kişi" c="#B8505A" /> },
  { c: "Ve onun karnı, seninkinden daha büyüktü", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 680], <><ValideOda t={t} win={0.2} />{mi(t, 700, { belly: B2, hands: "belly", look: 0.5, face: "worried" })}{tur(t, 1220, { belly: B3, hands: "belly", look: -0.5 })}</>) },
  { c: "Bir başka koridorda, bir kız daha", tone: "cool", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 620], <><ValideOda t={t} win={0.4} />{sal(t, 960, { belly: B2, hands: "belly", look: -0.2 }, 1.25)}</>),
    html: (t, a) => <NameCard t={t} at={a + 1.2} name="SALİHA DİLAŞUB" sub="o da hamile · gerçek kişi" c="#7A6AA8" /> },
  { c: "Hanedanın tek erkeği tahtta", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 640], <><ValideOda t={t} win={0.2} />{tur(t, 480, { belly: B3, hands: "belly", look: 0.3 })}{mi(t, 960, { belly: B2, hands: "belly", face: "worried" })}{sal(t, 1440, { belly: B2, hands: "belly", look: -0.3 })}</>) },
  { c: "Kimin çocuğu erkek olacak", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["TURHAN", "MİHRİNAZ", "SALİHA"].map((l, i) => <Disc key={i} x={420 + i * 540} y={440} r={170} k={ramp(t, a + 0.3 + i * 0.4, a + 0.6 + i * 0.4)} c={["#B8505A", P.sky, "#7A6AA8"][i]} label={l}><text y={40} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={150} fill="#FFF">?</text></Disc>)}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="KİMİN OĞLU ÖNCE DOĞACAK?" y={880} size={76} /> },
  { c: "Çünkü bu soru, sadece bir sıra sorusu", sfx: "boom", tone: "night", r: (t, a, b) => keep("Kimin çocuğu erkek olacak", t, b), html: (t, a) => <Txt t={t} at={a + 1.2} text="ÖLÜM KALIM SORUSU" y={880} size={90} accent={H.red} /> },

  // ── KURAL ──
  { c: "Bunu anlamak için, Osmanlı sarayının", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={620} y={460} r={190} k={ramp(t, a + 0.3, a + 0.6)} c={H.cobalt} label="1. KURAL" /><Disc x={1300} y={460} r={190} k={ramp(t, a + 1, a + 1.3)} c={H.red} label="2. KURAL" /></>) },
  { c: "Birinci kural", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 640], <><ValideOda t={t} win={0.2} /><PFig x={820} y={Y} s={1.2} kind="valide" robe="#4E5D6C" t={t} seed={44} look={0.5} />{<PFig x={1100} y={Y} s={0.62} kind="prince" t={t} seed={45} look={-0.5} face="smile" />}</>),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="BİR ANNE, BİR ŞEHZADE" y={70} size={96} /> },
  { c: "Padişaha bir oğul doğuran kadın", tone: "gold", r: (t, a, b) => again("Birinci kural", t, a, b, 0), html: (t, a, b) => htmlOf("Birinci kural", t, b) },
  { c: "Bütün sevgisini ve", r: (t, a, b) => again("Padişaha bir oğul doğuran kadın", t, a, b, 0), html: (t, a, b) => htmlOf("Padişaha bir oğul doğuran kadın", t, b) },
  { c: "Oğlu büyüyünce onunla birlikte", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], <Yelkenli t={t} px={lerp(-100, 300, ramp(t, a, b))} />),
    html: (t, a) => <Tag t={t} at={a + 0.8} text="SANCAĞA" c={H.cobalt} /> },
  { c: "Bu kuralı bir tek kadın yıkmıştı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], <><ValideOda t={t} win={0.2} /><PFig x={960} y={Y} s={1.3} kind="valide" robe="#7A2A5A" t={t} seed={46} face="smile" /></>),
    html: (t, a, b) => <NameCard t={t} at={a + (b - a) * 0.5} name="HÜRREM SULTAN" sub="Kanuni'nin eşi · birden fazla oğul" c="#7A2A5A" /> },
  { c: "Padişaha birden fazla", r: (t, a, b) => again("Bu kuralı bir tek kadın yıkmıştı", t, a, b, 0), html: (t, a, b) => htmlOf("Bu kuralı bir tek kadın yıkmıştı", t, b) },
  { c: "Ama Hürrem bir", r: (t, a, b) => again("Bu kuralı bir tek kadın yıkmıştı", t, a, b, 1), html: (t, a, b) => htmlOf("Bu kuralı bir tek kadın yıkmıştı", t, b) },
  { c: "İkinci kural ise çok daha karanlıktı", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.5], [960, 560], koridor(t, a, b, () => null, 1, 1500, 1800)) },

  // ── BELGE 2 ──
  { c: "Bu kuralı, İstanbul'u fetheden", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.1], [960, 560], <Sky w={1920} h={1080} k={0.7} city />),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="FATİH SULTAN MEHMED" c={H.red} /> },
  { c: "kanunnamesine yazdırmıştı. Kanunamede", r: (t, a, b) => again("Bu kuralı, İstanbul'u fetheden", t, a, b, 0), html: (t, a, b) => htmlOf("Bu kuralı, İstanbul'u fetheden", t, b) },
  { c: "Her kime ki evladımdan", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Belge t={t} at={a + 0.2} date="FATİH KANUNNAMESİ" src="Kanunname-i Âl-i Osman">“Her kime ki evladımdan saltanat müyesser ola, karındaşlarını nizam-ı âlem için katletmek münasiptir.”</Belge> },
  { c: "karındaşlarını nizamı alem", r: (t, a, b) => again("Her kime ki evladımdan", t, a, b, 0), html: (t, a, b) => htmlOf("Her kime ki evladımdan", t, b) },
  { c: "Yani evlatlarımdan kim padişah olursa", tone: "gold", r: (t, a, b) => keep("Her kime ki evladımdan", t, b), html: (t, a) => <><Belge t={t} at={-9} date="FATİH KANUNNAMESİ" src="Kanunname-i Âl-i Osman">“Her kime ki evladımdan saltanat müyesser ola, karındaşlarını nizam-ı âlem için katletmek münasiptir.”</Belge><Txt t={t} at={a + 0.6} text="DÜNYANIN DÜZENİ İÇİN" y={900} size={64} accent={H.red} /></> },
  { c: "Bu kanun, yüz elli yıldan fazla", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 560], <Sky w={1920} h={1080} k={0.15} city />),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="150+ YIL" c={H.red} /> },
  { c: "Hatta bazı kaynaklar", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 640], <><ValideOda t={t} win={0.95} />{kiz(t, 760, 1, { belly: B2, hands: "belly", face: "shock", look: 0.3 })}{kiz(t, 1160, 4, { belly: B1, hands: "belly", face: "worried", look: -0.3 })}{nv("nvH", 0.75, [{ x: 960, y: 640, r: 420 }], t)}</>),
    html: (t, a) => <Tag t={t} at={a + 1} text="1595 · KESİN DEĞİL" c={H.night} /> },
  { c: "Mehmed'in kardeşlerinin yanı", r: (t, a, b) => again("Hatta bazı kaynaklar", t, a, b, 0), html: (t, a, b) => htmlOf("Hatta bazı kaynaklar", t, b) },
  { c: "Bu bilgi kesin değildir", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={960} y={460} r={240} k={ramp(t, a + 0.2, a + 0.6)} c={H.night} label="KESİN DEĞİL · AMA FISILDANIRDI" /></>) },
  { c: "Ve bu kanun, senin zamanında", tone: "night", r: (t, a, b) => keep("Murad'ın kardeşleri vardı", t, b), html: (t, a) => <Txt t={t} at={a + 0.6} text="BİRKAÇ YIL ÖNCE" y={880} size={80} accent={H.red} /> },
  { c: "Daha birkaç yıl", r: (t, a, b) => again("Ve bu kanun, senin zamanında", t, a, b, 0), html: (t, a, b) => htmlOf("Ve bu kanun, senin zamanında", t, b) },
  { c: "Şimdi düşün", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.7], [960, 640], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B2, hands: "belly", face: "worried", look: 0.4 })}</>)) },
  { c: "Senin oğlun, bir kardeş olacaktı", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [2.6, 3.0], [1000, 700], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B2, hands: "belly", face: "shock" })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="BİR KARDEŞ" y={70} size={120} accent={H.red} dark /> },

  // ── KORKU ──
  { c: "O geceden sonra, uykuların değişti", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [1000, 640], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B2, face: "worried", look: Math.sin((t - a) * 0.8) * 0.6 })}</>)) },
  { c: "Bir sabah, Şevkidil Kalfa seni bahçede", tone: "warm", r: (t, a, b) => { const g = proWalk(t, a, b, 1700, 900, 1.1); return C(t, a, b, [1.05, 1.15], [960, 560], bahce(t, <>{mi(t, g.x, { walk: g.walk, look: g.look, belly: B2, hands: "belly" })}{sev(t, g.x + 260, { walk: g.walk, look: g.look })}</>, t * 15)); } },
  { c: "Bahçenin ortasında bir mermer havuz", tone: "warm", r: (t, a, b) => C(t, a, b, [2.0, 2.2], [560, 760], bahce(t, null, 0)) },
  { c: "Laleler daha açmamıştı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.4], [1400, 600], bahce(t, null, t * 20)) },
  { c: "Kalfa, yürürken sana çok kısa", tone: "warm", r: (t, a, b) => { const g = proWalk(t, a, b, 1500, 900, 1.1); return C(t, a, b, [1.6, 1.8], [g.x + 130, 600], bahce(t, <>{mi(t, g.x, { walk: g.walk, look: 0.6, belly: B2, hands: "belly" })}{sev(t, g.x + 260, { walk: g.walk, look: -0.6, talk: 1 })}</>, 0)); } },
  { c: "Sana verilen hiçbir şeyi", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.03], [960, 540], <Paper />),
    html: (t, a, b) => <>{["BAŞKASI TATMADAN YEME", "MERDİVENİ TEK BAŞINA İNME", "HER HEDİYEYİ ÖNCE BANA GÖSTER", "KİMSEYE NE HİSSETTİĞİNİ ANLATMA"].map((l, i) => <Txt key={i} t={t} at={a + 0.2 + i * (b - a) * 0.22} text={l} y={170 + i * 200} size={64} accent={[H.red, H.cobalt, H.gold, H.purple][i]} />)}</> },
  { c: "Sana getirilen her", r: (t, a, b) => again("Sana verilen hiçbir şeyi", t, a, b, 0), html: (t, a, b) => htmlOf("Sana verilen hiçbir şeyi", t, b) },
  { c: "Ve kimseye ama", r: (t, a, b) => again("Sana verilen hiçbir şeyi", t, a, b, 1), html: (t, a, b) => htmlOf("Sana verilen hiçbir şeyi", t, b) },
  { c: "Sonra durdu ve sana döndü", tone: "warm", r: (t, a, b) => C(t, a, b, [1.9, 2.1], [1080, 560], bahce(t, <>{mi(t, 940, { look: 0.6, belly: B2, hands: "belly", face: "worried" })}{sev(t, 1220, { look: -0.7 })}</>, 0)) },
  { c: "Sarayda en tehlikeli şey, kılıç değil", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [2.8, 3.1], [1220, 520], bahce(t, <>{sev(t, 1220, { look: -0.7, talk: 1, face: "worried" })}</>, 0)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.15} text="“KILIÇ DEĞİL KIZIM. SÖZ.”" y={820} size={96} accent={H.red} /> },
  { c: "Söylediğin bir söz", tone: "gold", r: (t, a, b) => again("Sarayda en tehlikeli şey, kılıç değil", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="“ERTESİ GÜN BAŞKASININ ELİNDE SİLAHA DÖNÜŞÜR.”" y={820} size={64} /> },

  // ── NAZAR ──
  { c: "Hamileliğin ilerledikçe", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 680], <><ValideOda t={t} win={0.2} />{mi(t, 960, { belly: B2 + 0.1, hands: "belly", face: "normal" }, 1.25)}</>) },
  { c: "Yastığının altına küçük bir Kur'an", tone: "warm", r: (t, a, b) => C(t, a, b, [1.8, 2.0], [1000, 860], oda(t, 0, <>{sedir}<g transform="translate(1100,870)"><rect x={-60} y={-40} width={120} height={70} rx={6} fill="#2B6A4A" stroke="#4A3524" strokeWidth={3} /><path d="M-40,-10 L40,-10 M-40,8 L40,8" stroke={P.gold} strokeWidth={4} /></g></>)) },
  { c: "Kapının üstüne mavi bir nazarlık", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><rect width={1920} height={1080} fill="#E9DCC2" /><rect x={560} y={260} width={800} height={900} fill="#6A4A2E" stroke="#4A3524" strokeWidth={6} /><Nazarlik x={960} y={120} s={1.6} t={t} /></>) },
  { c: "Boynuna, içinde dua yazılı bir muska", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Muska x={960} y={400} s={3} /></>) },
  { c: "Hacılar, Kâbe'den getirdikleri suyu", tone: "warm", r: (t, a, b) => C(t, a, b, [2.0, 2.2], [960, 720], <><ValideOda t={t} win={0.2} />{kiz(t, 960, 3, { hands: "tray", trayItem: <g><path d="M-14,0 C-26,-10 -26,-40 -10,-52 L-8,-70 L8,-70 L10,-52 C26,-40 26,-10 14,0Z" fill="#9CC3D6" stroke="#4A3524" strokeWidth={2} /></g> }, 1.2)}</>),
    html: (t, a) => <Tag t={t} at={a + 0.8} text="ZEMZEM" c={H.teal} /> },
  { c: "Ve her akşam, yatsı namazından sonra", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 640], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B2, face: "closed" })}{sev(t, lerp(400, 1600, ramp(t, a, b)), { walk: proWalk(t, a, b, 400, 1600, 1.1).walk, talk: 1, look: 0.4 })}</>)) },
  { c: "Çünkü o zamanın", r: (t, a, b) => again("Ve her akşam, yatsı namazından sonra", t, a, b, 0) },
  { c: "bir kadın için", r: (t, a, b) => again("Ve her akşam, yatsı namazından sonra", t, a, b, 1) },
  { c: "Kıskanç bir bakış", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["KISKANÇ BİR BAKIŞ", "KÖTÜ BİR DİLEK", "BİR LANET"].map((l, i) => <Disc key={i} x={420 + i * 540} y={460} r={170} k={ramp(t, a + 0.2 + i * 0.7, a + 0.5 + i * 0.7)} c={[H.purple, H.night, H.red][i]} label={l} />)}</>) },
  { c: "Sen bu inançlara gülemezdin", tone: "night", r: (t, a, b) => C(t, a, b, [2.0, 2.4], [1000, 600], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B2, hands: "belly", face: "worried", look: -0.5 })}</>)) },

  // ── HAMAM ──
  { c: "görünmeyen düşmanlar gözle", r: (t, a, b) => again("Sen bu inançlara gülemezdin", t, a, b, 0) },
  { c: "Bir sabah, haremin hamamına götürüldün", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 520], hamam(t)) },
  { c: "Sıcak mermer, ılık", r: (t, a, b) => again("Bir sabah, haremin hamamına götürüldün", t, a, b, 0) },
  { c: "Göbek taşına uzandın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 700], hamam(t, <>{mi(t, 960, { sit: true, y: 920, belly: B2, face: "closed", robe: "#F4F7FA", robe2: "#E9F0F4" })}</>)) },
  { c: "Kubbenin küçük yuvarlak pencerelerinden", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.3], [960, 300], hamam(t)) },
  { c: "Tam kalkarken, ayağın kaydı", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [2.0, 2.4], [960, 700], hamam(t, <g transform={`rotate(${Math.sin(Math.min(1, (t - a) * 2) * Math.PI) * -12},960,1000)`}>{mi(t, 960, { belly: B2, hands: "belly", face: "shock", robe: "#F4F7FA", robe2: "#E9F0F4" })}</g>)) },
  { c: "Mermer, her zamankinden kaygandı", tone: "cool", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [960, 980], hamam(t, <><ellipse cx={960} cy={1010} rx={260} ry={30} fill="#FFF6C8" opacity={0.6 + 0.2 * Math.sin(t * 4)} /><ellipse cx={1060} cy={1004} rx={90} ry={10} fill="#FFFFFF" opacity={0.8} /></>)) },
  { c: "Şevkidil Kalfa kolundan yakaladı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.7, 1.9], [1060, 640], hamam(t, <>{mi(t, 960, { belly: B2, hands: "belly", face: "shock", robe: "#F4F7FA", robe2: "#E9F0F4", look: 0.5 })}{sev(t, 1220, { reach: act(t, a, 9, 0.3, 0.5), reachDir: -1, look: -0.7, face: "shock" })}</>)) },
  { c: "Kalfa yere eğildi", tone: "cool", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [1220, 760], hamam(t, <>{sev(t, 1220, { bow: 0.8, sit: true, y: 1000, look: -0.4 })}</>)) },
  { c: "Zeytinyağı", sfx: "boom", tone: "cool", r: (t, a, b) => keep("Kalfa yere eğildi", t, b), html: (t, a) => <Txt t={t} at={a + 0.1} text="ZEYTİNYAĞI." y={820} size={130} accent={H.red} /> },
  { c: "Kimse bir şey söylemedi", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 640], hamam(t, <>{kiz(t, 500, 1, { look: 0.3, robe: "#F4F7FA" })}{kiz(t, 1420, 2, { look: -0.4, robe: "#F4F7FA" })}{mi(t, 960, { belly: B2, hands: "belly", face: "worried", robe: "#F4F7FA", robe2: "#E9F0F4" })}</>)) },
  { c: "Ama sen o", r: (t, a, b) => again("Kimse bir şey söylemedi", t, a, b, 0) },
  { c: "Sarayda tehlike, her zaman bir hançer", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["BİRAZ YAĞ", "BİR MERDİVEN", "YANLIŞ ZAMANDA KAPANAN BİR KAPI"].map((l, i) => <Disc key={i} x={420 + i * 540} y={440} r={170} k={ramp(t, a + 1.6 + i * 1.2, a + 1.9 + i * 1.2)} c={[H.gold, H.cobalt, H.red][i]} label={l} />)}</>) },
  { c: "Bazen sadece biraz", r: (t, a, b) => again("Sarayda tehlike, her zaman bir hançer", t, a, b, 0) },
  { c: "bazen de sadece", r: (t, a, b) => again("Sarayda tehlike, her zaman bir hançer", t, a, b, 1) },
  { c: "O günden sonra, hamama hiç yalnız gitmedin", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], koridor(t, a, b, (x, g) => <>{mi(t, x, { walk: g.walk, look: g.look, belly: B2 + 0.1, hands: "belly" })}{sev(t, x + 260, { walk: g.walk, look: g.look })}{kiz(t, x - 300, 2, { walk: g.walk, look: g.look })}</>, 0.2)) },

  // ── ŞERBET ──
  { c: "Ve sonra, o gece geldi", sfx: "drone", tone: "night", r: (t, a, b) => again("Sen uyumuyorsun", t, a, b, 2) },
  { c: "Aralık ayı", tone: "night", r: (t, a, b) => C(t, a, b, [2.0, 2.3], [1000, 760], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B3, hands: "belly", face: "closed" })}</>)),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="ARALIK 1641 · YEDİ AYLIK" c={H.night} /> },
  { c: "Kapı açıldı ve genç bir cariye", tone: "night", r: (t, a, b) => keep("Odanın kapısı yavaşça açılıyor", t, b) },
  { c: "Kırmızı bir şerbet", r: (t, a, b) => again("Kapı açıldı ve genç bir cariye", t, a, b, 0) },
  { c: "Ve Şevkidil Kalfa, köşeden fısıldadı", tone: "night", r: (t, a, b) => C(t, a, b, [3.0, 3.3], [1700, 520], oda(t, 1, <>{sev(t, 1700, { look: -0.9, face: "worried", talk: 1 })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="“İÇME.”" y={800} size={130} accent={H.red} /> },
  { c: "Kalfa ayağa kalktı", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [1200, 640], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B3, look: 0.5, reach: 0.5 * (1 - act(t, a + 0.8, 0.1, 0.3, 9)), reachDir: 1, item: t < a + 1.2 ? <Serbet t={t} s={0.9} glow={0.6} /> : undefined, face: "worried" })}{sev(t, lerp(1700, 1300, ramp(t, a, a + 1)), { walk: proWalk(t, a, a + 1, 1700, 1300, 1.1).walk, look: -0.6, reach: act(t, a + 1, 9, 0.4, 0.3), reachDir: -1, item: t >= a + 1.2 ? <Serbet t={t} s={0.9} /> : undefined })}</>)) },
  { c: "Kızım, valide hazretlerine teşekkürlerimizi", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [900, 600], oda(t, 1, <>{cariye(t, 560, { look: 0.6, bow: 0.2, hands: "fold" })}{sev(t, 1100, { look: -0.6, talk: 1, reach: 0.3, reachDir: 1, item: <Serbet t={t} s={0.9} /> })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.25} text="“ŞERBETİ SABAHA SAKLARIZ.”" y={820} size={84} /> },
  { c: "Kız eğildi ve çıktı", sfx: "knock", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [500, 600], oda(t, 1, <>{cariye(t, lerp(560, -200, ramp(t, a + 0.6, b)), { walk: proWalk(t, a + 0.6, b, 560, -200, 1.06).walk, look: -0.6, bow: t < a + 0.6 ? 0.4 : 0, hands: "fold" })}</>)) },
  { c: "Kalfa, bardağı pencerenin önündeki saksıya", tone: "night", r: (t, a, b) => C(t, a, b, [2.0, 2.3], [1300, 640], <><ValideOda t={t} win={0.95} /><Saksi x={1300} y={830} s={0.9} t={t} pour={win2(t, a + 0.6, b - 0.3)} /><Samdan x={1720} y={1010} t={t} s={1.0} />{sev(t, 1520, { look: -0.7, reach: 0.85, reachDir: -1, item: <g transform="rotate(-70)"><Serbet t={t} s={0.9} level={1 - ramp(t, a + 0.6, b)} /></g> })}{nv("nvP", 0.6, [{ x: 1300, y: 640, r: 420 }], t)}</>) },
  { c: "Bu şerbet gerçekten zehirli miydi", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2.1], [1000, 600], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B3, hands: "belly", face: "worried", look: 0.5 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="ZEHİRLİ MİYDİ?" y={70} size={100} accent={H.red} dark /> },
  { c: "Belki de Valide Sultan gerçekten", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 600], <><ValideOda t={t} win={0.6} />{kosem(t, 960, { face: "smile" }, 1.25)}</>),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="BİR İYİLİK Mİ?" c={H.gold} /> },
  { c: "Belki de o kız, başka birinin gönderdiği", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.7], [960, 600], koridor(t, a, b, (x, g) => <>{cariye(t, x, { walk: g.walk, look: g.look, face: "worried" })}<g opacity={0.8}>{kalfa(t, x + 700, 2, { look: -0.6, face: "normal", op: 0.85 })}</g></>, 1)),
    html: (t, a) => <Tag t={t} at={a + 1.2} text="BAŞKA BİRİ Mİ?" c={H.red} /> },
  { c: "Bunu hiçbir zaman öğrenemedin", tone: "night", r: (t, a, b) => C(t, a, b, [2.0, 2.3], [1000, 600], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B3, hands: "belly", face: "sad" })}</>)) },
  { c: "Kimin dost, kimin", r: (t, a, b) => again("Bunu hiçbir zaman öğrenemedin", t, a, b, 0) },
  { c: "Sana gülümseyen her yüzün arkasında", tone: "cool", r: (t, a, b) => C(t, a, b, [1.15, 1.3], [960, 600], <><ValideOda t={t} win={0.4} />{[0, 1, 2, 3, 4].map((i) => kiz(t, 300 + i * 330, i, { face: "smile", look: (2 - i) * 0.3 }))}{nv("nvG", 0.5 + 0.2 * ramp(t, a, b), [{ x: 960, y: 560, r: 600 }], t)}</>) },
  { c: "Ertesi sabah, saksıdaki sardunya", tone: "warm", r: (t, a, b) => C(t, a, b, [2.0, 2.4], [1300, 680], oda(t, 0, null)),
    html: (t, a) => <Tag t={t} at={a + 1.2} text="HÂLÂ YEŞİL" c="#4E7A3E" /> },
  { c: "Sen buna sevinmeliydin", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [1100, 600], oda(t, 0, <>{mi(t, 1100, { belly: B3, hands: "belly", look: 0.6, face: "sad" })}</>)) },

  // ── TOPLAR ──
  { c: "bir sonraki tepsinin", r: (t, a, b) => again("Sen buna sevinmeliydin", t, a, b, 0) },
  { c: "İki Ocak", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 560], <Sky w={1920} h={1080} k={0.3} city />),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="2 OCAK 1642" y={70} size={96} dark /> },
  { c: "Odanda uyurken", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.6], [1000, 640], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B3, face: t < a + 1 ? "closed" : "shock", look: 0.6 })}</>)) },
  { c: "Toplar atılıyordu", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 540], <TopGece t={t} a={a} />),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="TOPLAR!" y={70} size={120} accent={H.red} dark /> },
  { c: "Osmanlı'da bir şehzade doğduğunda", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a, b) => <>{["DOĞUM", "FERMAN · SADRAZAM", "TOP ATIŞLARI · ŞEHİR"].map((l, i) => <Txt key={i} t={t} at={a + 0.3 + i * (b - a) * 0.25} text={l} y={200 + i * 230} size={72} accent={[H.gold, H.cobalt, H.red][i]} />)}</> },
  { c: "sonra top atışlarıyla", r: (t, a, b) => again("Osmanlı'da bir şehzade doğduğunda", t, a, b, 0), html: (t, a, b) => htmlOf("Osmanlı'da bir şehzade doğduğunda", t, b) },
  { c: "Ve o sabah, İstanbul'un bütün camilerinden", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [960, 560], <TopGece t={t} a={a} />) },
  { c: "Turhan, bir oğul doğurmuştu", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 640], <><ValideOda t={t} win={0.2} />{tur(t, 960, { hands: "baby", face: "smile" }, 1.3)}</>),
    html: (t, a, b) => <NameCard t={t} at={a + (b - a) * 0.45} name="ŞEHZADE MEHMED" sub="Turhan'ın oğlu · 2 Ocak 1642" c="#B8505A" /> },
  { c: "Harem, bayram yerine döndü", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], koridor(t, a, b, (x) => <>{[0, 1, 2, 3].map((i) => kiz(t, x - 600 + i * 400, i, { face: "smile", talk: i % 2, look: (i % 2 ? -1 : 1) * 0.5, hands: i === 1 ? "tray" : "fold", trayItem: <SerbetTepsi t={t} /> }))}</>, 0, 900, 1100)) },
  { c: "Valide Kösem Sultan'ın yüzündeki rahatlık", tone: "gold", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [960, 520], <><ValideOda t={t} win={0.2} />{kosem(t, 960, { face: "smile" }, 1.3)}</>) },
  { c: "Sen ise penceresinin önünde oturuyordun", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [1300, 640], <><ValideOda t={t} win={0.3} />{mi(t, 1300, { sit: true, y: 900, belly: B3, hands: "belly", look: 0.7, face: "sad" })}</>) },
  { c: "Yarış bitti", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [2.6, 3.0], [1300, 640], <><ValideOda t={t} win={0.3} />{mi(t, 1300, { sit: true, y: 900, belly: B3, hands: "belly", look: 0.4, face: "closed" })}</>),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="YARIŞ BİTTİ. SEN İKİNCİ OLDUN." y={70} size={84} accent={H.red} /> },

  // ── NİSAN ──
  { c: "Birkaç ay sonra, Nisan ayında", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 560], <Sky w={1920} h={1080} k={0.8} city />),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="NİSAN 1642" c={H.cobalt} /> },
  { c: "Bu sefer, Saliha Dilaşub", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 640], <><ValideOda t={t} win={0.2} />{sal(t, 960, { hands: "baby", face: "smile" }, 1.3)}</>),
    html: (t, a, b) => <NameCard t={t} at={a + (b - a) * 0.45} name="ŞEHZADE SÜLEYMAN" sub="Saliha Dilaşub'un oğlu · Nisan 1642" c="#7A6AA8" /> },
  { c: "Artık haremde iki şehzade vardı", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["MEHMED", "SÜLEYMAN", "?"].map((l, i) => <Disc key={i} x={420 + i * 540} y={440} r={i === 2 ? 150 : 180} k={ramp(t, a + 0.3 + i * 0.8, a + 0.6 + i * 0.8)} c={["#B8505A", "#7A6AA8", P.sky][i]} label={i === 2 ? "ÜÇÜNCÜ?" : l}><g transform="scale(1.3)"><Bebek t={t} bead={false} /></g></Disc>)}</>) },
  { c: "O gece, hayatında ilk kez", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 680], oda(t, 1, <>{mi(t, 960, { sit: true, y: 940, belly: B3, bow: 0.85, face: "closed" })}</>)) },
  { c: "Ama sabaha kadar", r: (t, a, b) => again("O gece, hayatında ilk kez", t, a, b, 0) },
  { c: "Allah'ım, bana bir kız ver", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.8], [960, 600], oda(t, 1, <>{mi(t, 960, { sit: true, y: 940, belly: B3, bow: 0.6, face: "closed", talk: 1 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="“ALLAH'IM, BANA BİR KIZ VER.”" y={820} size={90} accent={H.gold} /> },
  { c: "Çünkü bu sarayda bir kız, yaşamak", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={620} y={440} r={200} k={ramp(t, a + 0.3, a + 0.6)} c={H.pink} label="BİR KIZ = YAŞAMAK" /><Disc x={1300} y={440} r={200} k={ramp(t, a + 2, a + 2.4)} c={H.night} label="BİR OĞUL = HEDEF" /></>) },

  // ── DOĞUM ──
  { c: "Bir o olsa", r: (t, a, b) => again("Çünkü bu sarayda bir kız, yaşamak", t, a, b, 0) },
  { c: "Sancıların bir bahar gecesi başladı", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [1000, 640], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, belly: B3 + 0.08, hands: "belly", face: "worried", look: Math.sin((t - a) * 2) * 0.3 })}</>)) },
  { c: "Saray ebesi geldi", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [700, 640], oda(t, 1, <>{ebe(t, lerp(-100, 700, ramp(t, a, a + 2.4)), { walk: proWalk(t, a, a + 2.4, -100, 700, 1.16).walk, look: 0.6 })}{kiz(t, lerp(-400, 400, ramp(t, a + 0.3, a + 2.6)), 1, { walk: proWalk(t, a + 0.3, a + 2.6, -400, 400, 1.0).walk })}</>)) },
  { c: "Odaya bir doğum sandalyesi getirildi", sfx: "knock", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 760], oda(t, 1, <><DogumSandalye x={960} y={1010} s={1.4} /></>)),
    html: (t, a) => <Tag t={t} at={a + 1} text="DOĞUM SANDALYESİ" c="#8A5A34" /> },
  { c: "Ahşap, kolçaklı", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [960, 720], oda(t, 1, <><DogumSandalye x={960} y={1010} s={1.4} /></>)) },
  { c: "Osmanlı ebeleri doğumu", r: (t, a, b) => again("Ahşap, kolçaklı", t, a, b, 0) },
  { c: "Odanın her köşesinde mumlar yanıyordu", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], <><ValideOda t={t} win={0.95} />{[300, 700, 1220, 1620].map((x, i) => <Samdan key={i} x={x} y={1010} t={t + i} s={1.0} />)}<BigMangal x={960} y={980} s={0.9} t={t} />{nv("nvM", 0.68, [300, 700, 1220, 1620].map((x) => ({ x, y: 640, r: 230 })).concat([{ x: 960, y: 860, r: 300 }]), t)}</>) },
  { c: "Kapının dışında, kalfalar dua okuyordu", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], koridor(t, a, b, (x) => <>{[0, 1, 2].map((i) => kalfa(t, x - 400 + i * 400, i, { sit: true, y: 1000, bow: 0.5, face: "closed", talk: i !== 1 ? 1 : 0 }))}</>, 1, 900, 960)),
    html: (t, a, b) => <>{["YASİN", "İHLAS"].map((l, i) => <Tag key={i} t={t} at={a + 1 + i * (b - a) * 0.3} text={l} c={H.teal} x={300 + i * 900} y={140} />)}</> },
  { c: "Saatler geçti", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2.1], [960, 560], oda(t, 1, <>{ebe(t, 700, { look: 0.6, face: "worried" })}{sev(t, 1260, { look: -0.5, face: "worried", reach: 0.4, reachDir: -1 })}</>)) },
  { c: "Bir an annenin yüzünü gördün", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 560], <><Kafkas t={t} mist={0.8} /><rect width={1920} height={1080} fill="#FFE6B0" opacity={0.25} /></>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="“BAŞINI DİK TUT KIZIM.”" y={820} size={90} accent={H.gold} /> },
  { c: "Ve şafak sökerken", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [1500, 500], <><ValideOda t={t} win={0.3} /><rect x={1300} y={240} width={400} height={460} fill="#FFD9A0" opacity={0.6 * ramp(t, a, b)} /></>) },
  { c: "Ebe bebeği kucağına aldı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [960, 640], oda(t, 0.5, <>{ebe(t, 960, { hands: "baby", face: "normal", baby: <Bebek t={t} cry={1 - ramp(t, a + 2, a + 3)} /> }, 1.25)}</>)) },
  { c: "Yüzünde ilk kez", r: (t, a, b) => again("Ebe bebeği kucağına aldı", t, a, b, 0) },
  { c: "Bir kız, dedi", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [960, 500], oda(t, 0.4, <>{ebe(t, 960, { hands: "baby", face: "smile", talk: 1 }, 1.25)}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.1} text="“BİR KIZ. MAŞALLAH. BİR SULTAN KIZI.”" y={820} size={80} accent={H.pink} /> },
  { c: "O gün, saraydan hiç top atılmadı", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.1], [960, 560], <Sky w={1920} h={1080} k={0.9} city />),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="TOP YOK" c={H.night} /> },
  { c: "Ve sen, hayatında ilk kez, sevinçten", tone: "gold", r: (t, a, b) => C(t, a, b, [1.9, 2.2], [1000, 620], oda(t, 0.3, <>{sedir}{mi(t, 1000, { sit: true, y: 880, hands: "baby", face: "smile", look: 0.1 })}</>, <Petals t={t} n={10} c="#FFE6B0" />)) },

  // ── LOHUSA ──
  { c: "Doğumdan sonra kırk gün", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={960} y={460} r={250} k={ramp(t, a + 0.2, a + 0.6)} c={H.pink} label="40 GÜN · LOHUSA" /></>) },
  { c: "O zamanların inancına", r: (t, a, b) => again("Doğumdan sonra kırk gün", t, a, b, 0) },
  { c: "Yatağının başına kırmızı bir kurdele", tone: "warm", r: (t, a, b) => C(t, a, b, [1.8, 2.0], [1000, 640], oda(t, 0, <>{sedir}<Kurdele x={1360} y={640} s={1.4} t={t} />{mi(t, 1000, { sit: true, y: 880, hands: "baby", face: "smile" })}</>)) },
  { c: "Bebeğin kundağına mavi bir boncuk", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><rect width={1920} height={1080} fill="#F3E6C4" /><g transform="translate(1000,560) scale(6)"><Bebek t={t} /></g></>) },
  { c: "Lohusa yalnız bırakılmazdı", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 640], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, hands: "baby", face: "closed" })}{sev(t, 1560, { sit: true, y: 960, look: -0.6 })}</>)) },
  { c: "Ve sana, lohusa şerbeti getirildi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [700, 660], oda(t, 0, <>{cariye(t, 700, { look: 0.5 })}</>)) },
  { c: "Kırmızı, karanfilli, tarçınlı", r: (t, a, b) => again("Ve sana, lohusa şerbeti getirildi", t, a, b, 0) },
  { c: "Aynı renk. Aynı koku", sfx: "drone", tone: "night", r: (t, a, b) => again("Bardağın kenarında karanfil kokusu", t, a, b, 0),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="TIPKI O GECEKİ GİBİ" c={H.red} /> },
  { c: "Bardağı aldın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.8, 2.0], [1200, 600], oda(t, 0, <>{sedir}{mi(t, 1000, { sit: true, y: 880, look: 0.6, reach: 0.6, reachDir: 1, item: <Serbet t={t} s={0.9} />, face: "worried" })}{sev(t, 1400, { look: -0.6 })}</>)) },
  { c: "Kalfa, önce kendisi bir yudum içti", tone: "warm", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [1400, 520], oda(t, 0, <>{sev(t, 1400, { look: -0.4, reach: 0.9, reachDir: -1, item: <Serbet t={t} s={0.9} level={0.8} />, face: "closed" })}</>)) },
  { c: "İç kızım", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [1400, 520], oda(t, 0, <>{sev(t, 1400, { look: -0.6, talk: 1, face: "smile" })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="“İÇ KIZIM. BU SEFER KORKMA.”" y={820} size={90} accent={H.gold} /> },

  // ── SÜT ANNE ──
  { c: "Sultan kızlarını genellikle anneleri", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], <><ValideOda t={t} win={0.2} />{kiz(t, 960, 5, { hands: "baby", face: "smile" }, 1.25)}</>),
    html: (t, a) => <Tag t={t} at={a + 1} text="SÜT ANNE" c={H.teal} /> },
  { c: "Bunu da bir belge anlatıyor", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Belge t={t} at={a + 0.3} date="ŞEM'DÂNÎ-ZÂDE" src="Saray tarihçisi · daha sonraki bir dönem">Mahalle imamlarına haber verildi, hanlar tek tek arandı: üç aylık hamile, Çerkes ya da Gürcü, güler yüzlü, uzun saçlı bir süt anne.</Belge> },
  { c: "Padişahın bir eşi", r: (t, a, b) => again("Bunu da bir belge anlatıyor", t, a, b, 0), html: (t, a, b) => htmlOf("Bunu da bir belge anlatıyor", t, b) },
  { c: "Mahallelerin imamlarına haber verildi", tone: "gold", r: (t, a, b) => keep("Bunu da bir belge anlatıyor", t, b), html: (t) => <Belge t={t} at={-9} date="ŞEM'DÂNÎ-ZÂDE" src="Saray tarihçisi · daha sonraki bir dönem">Mahalle imamlarına haber verildi, hanlar tek tek arandı: üç aylık hamile, Çerkes ya da Gürcü, güler yüzlü, uzun saçlı bir süt anne.</Belge> },
  { c: "aranan kadınlar üç", r: (t, a, b) => again("Mahallelerin imamlarına haber verildi", t, a, b, 0), html: (t, a, b) => htmlOf("Mahallelerin imamlarına haber verildi", t, b) },
  { c: "Ve kaynağa göre", r: (t, a, b) => again("Mahallelerin imamlarına haber verildi", t, a, b, 1), html: (t, a, b) => htmlOf("Mahallelerin imamlarına haber verildi", t, b) },
  { c: "Senin kızına da bir süt anne bulundu", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], oda(t, 0, <>{kiz(t, 700, 5, { hands: "baby", look: 0.5 })}{mi(t, 1200, { look: -0.6, face: "sad" })}</>)) },
  { c: "Ama sen, geceleri, herkes uyuyunca", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2.1], [1000, 680], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, hands: "baby", face: "smile", bow: 0.3 })}</>)) },
  { c: "Kimse görmeden. Çünkü", r: (t, a, b) => again("Ama sen, geceleri, herkes uyuyunca", t, a, b, 0) },
  { c: "sadece o anlar", r: (t, a, b) => again("Ama sen, geceleri, herkes uyuyunca", t, a, b, 1) },
  { c: "Ona annenin verdiği adı fısıldadın", tone: "night", r: (t, a, b) => C(t, a, b, [2.6, 3.0], [1000, 640], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, hands: "baby", face: "smile", bow: 0.4, talk: 1 })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="“SETENAY.”" y={820} size={110} accent={H.pink} /> },
  { c: "Senin kızın artık bir sultandı", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={960} y={460} r={240} k={ramp(t, a + 0.2, a + 0.6)} c={H.pink} label="SULTAN KIZI"><g transform="scale(1.8)"><Bebek t={t} /></g></Disc></>) },

  // ── HASEKİ ──
  { c: "Peki bir sultan kızının annesi olunca", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], <><ValideOda t={t} win={0.2} />{mi(t, 960, { hands: "baby", face: "normal" }, 1.25)}</>) },
  { c: "Artık sıradan bir cariye değildin. Ama", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Merdiven t={t} k={1} hi={2} /></>),
    html: (t, a) => <Txt t={t} at={a + 1} text="ARADA BİR YERDE" y={70} size={90} /> },
  { c: "Maaşın arttı", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["MAAŞ ↑", "BİR ODA DAHA", "İPEK · KÜRK"].map((l, i) => <Disc key={i} x={420 + i * 540} y={440} r={170} k={ramp(t, a + 0.2 + i * 0.7, a + 0.5 + i * 0.7)} c={[H.gold, H.teal, H.purple][i]} label={l} />)}</>) },
  { c: "Ama koridorda Turhan'ın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 620], koridor(t, a, b, (x, g) => <>{tur(t, x + 520, { look: -0.4, face: "normal" })}{mi(t, x, { walk: g.walk, look: g.look, bow: 0.5 })}</>, 0.3, 300, 900)) },
  { c: "Çünkü onlar, şehzade anneleriydi", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 640], <><ValideOda t={t} win={0.2} />{tur(t, 700, { hands: "baby" })}{sal(t, 1220, { hands: "baby" })}</>) },
  { c: "Kaynaklar, Sultan İbrahim'in hasekilerine", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 640], <><ValideOda t={t} win={0.2} />{ibr(t, 760, { look: 0.5, reach: act(t, a + 0.5, 9, 0.6, 0.4), reachDir: 1, item: <Kese x={0} y={20} s={0.7} t={t} /> })}{kiz(t, 1180, 4, { look: -0.5, face: "smile" })}</>),
    html: (t, a) => <Tag t={t} at={a + 1.4} text="SANCAK GELİRLERİ" c={H.gold} /> },
  { c: "hatta bazı sancakların", r: (t, a, b) => again("Kaynaklar, Sultan İbrahim'in hasekilerine", t, a, b, 0), html: (t, a, b) => htmlOf("Kaynaklar, Sultan İbrahim'in hasekilerine", t, b) },
  { c: "Haremde servetler el değiştiriyordu", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{Array.from({ length: 16 }, (_, i) => <Akce key={i} x={300 + (i % 8) * 190} y={360 + Math.floor(i / 8) * 220 + Math.sin(t * 2 + i) * 10} r={56} spin={t + i} />)}</>) },
  { c: "Sen bu yarışa girmedin", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.8], [1000, 640], oda(t, 0, <>{sedir}{mi(t, 1000, { sit: true, y: 880, hands: "baby", face: "smile" })}</>)) },

  // ── KIZIN ──
  { c: "yaşadın ve belki", r: (t, a, b) => again("Sen bu yarışa girmedin", t, a, b, 0) },
  { c: "Ama bir sultan kızının annesi olmanın", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], oda(t, 0, <><Besik x={1100} y={980} s={1.3} t={t} />{mi(t, 800, { look: 0.6, face: "worried" })}</>)) },
  { c: "O yıllarda Sultan İbrahim", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 640], <><ValideOda t={t} win={0.2} />{ibr(t, 700, { look: 0.5, talk: 1 })}<PFig x={1200} y={Y} s={1.15} kind="prince" robe="#3A4A3A" t={t} seed={50} look={-0.5} bow={0.4} /></>),
    html: (t, a) => <Tag t={t} at={a + 1} text="SİYASİ NİKÂH" c={H.cobalt} /> },
  { c: "Bu nikahlar birer", r: (t, a, b) => again("O yıllarda Sultan İbrahim", t, a, b, 0), html: (t, a, b) => htmlOf("O yıllarda Sultan İbrahim", t, b) },
  { c: "Bir vezire sultan", r: (t, a, b) => again("O yıllarda Sultan İbrahim", t, a, b, 1), html: (t, a, b) => htmlOf("O yıllarda Sultan İbrahim", t, b) },
  { c: "Bir gün, kızın daha üç yaşındayken", sfx: "knock", tone: "cool", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], oda(t, 0, <>{kalfa(t, 600, 1, { talk: 1, look: 0.6 })}{mi(t, 1100, { look: -0.6, face: "shock" })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="3 YAŞINDA · 50+ YAŞINDA BİR PAŞA" y={70} size={72} accent={H.red} /> },
  { c: "Kızın bu nikâhın ne demek olduğunu", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 700], <><ValideOda t={t} win={0.2} /><PFig x={960} y={Y} s={0.6} kind="girl" robe={P.gold} robe2="#FFF1D0" t={t} seed={60} face="smile" look={Math.sin((t - a) * 2) * 0.5} /></>),
    html: (t, a) => <Tag t={t} at={a + 1} text="BUNU BİR OYUN SANDI" c={H.pink} /> },
  { c: "Tören günü sırmalı", r: (t, a, b) => again("Kızın bu nikâhın ne demek olduğunu", t, a, b, 0), html: (t, a, b) => htmlOf("Kızın bu nikâhın ne demek olduğunu", t, b) },
  { c: "Saçlarına incili bir", r: (t, a, b) => again("Kızın bu nikâhın ne demek olduğunu", t, a, b, 1), html: (t, a, b) => htmlOf("Kızın bu nikâhın ne demek olduğunu", t, b) },
  { c: "Gerçi bu tür nikâhlarda çocuk", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 640], oda(t, 0, <>{mi(t, 1000, { look: 0.3, face: "sad" })}<PFig x={1240} y={Y} s={0.6} kind="girl" robe={P.gold} robe2="#FFF1D0" t={t} seed={60} look={-0.5} face="smile" /></>)) },
  { c: "Ama sen biliyordun", r: (t, a, b) => again("Gerçi bu tür nikâhlarda çocuk", t, a, b, 0) },
  { c: "açılacak ve kızın", r: (t, a, b) => again("Gerçi bu tür nikâhlarda çocuk", t, a, b, 1) },
  { c: "O gece kızını uyuturken", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [1000, 660], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, face: "smile", talk: 1, look: 0.4 })}<PFig x={1280} y={900} s={0.55} kind="girl" robe={P.gold} robe2="#FFF1D0" t={t} seed={60} sit face="closed" /></>)) },
  { c: "Dağları. Dereyi", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 600], <Kafkas t={t} mist={0.5} />) },
  { c: "Ve ona annenin", r: (t, a, b) => again("Dağları. Dereyi", t, a, b, 0) },
  { c: "Nereye gidersen git, başını dik tut", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.8], [1000, 600], oda(t, 1, <>{sedir}{mi(t, 1000, { sit: true, y: 880, face: "smile", talk: 1, look: 0.4 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="“NEREYE GİDERSEN GİT, BAŞINI DİK TUT.”" y={820} size={76} accent={H.gold} /> },

  // ── 1648 ──
  { c: "Ağustos ayı", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 560], <Sky w={1920} h={1080} k={0.5} city />),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="AĞUSTOS 1648" y={70} size={96} dark /> },
  { c: "Bir sabah, haremin kapıları", sfx: "knock", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 540], <SarayKapi t={t} open={1 - ramp(t, a, a + 1.5)} />) },
  { c: "Koridorlarda ağalar koşuşturuyordu", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 600], koridor(t, a, b, (x, g) => <>{kalfa(t, x, 0, { walk: g.walk, look: g.look, face: "shock" })}{kalfa(t, x - 380, 1, { walk: g.walk, look: g.look, face: "worried" })}</>, 0.3)) },
  { c: "Uzaktan, Ayasofya'nın oradan bağırışlar", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], <><Cami t={t} k={1} /></>),
    html: (t, a) => <Tag t={t} at={a + 1} text="YENİÇERİLER · ULEMA" c={H.red} /> },
  { c: "Yeniçeriler, ulema ve", r: (t, a, b) => again("Uzaktan, Ayasofya'nın oradan bağırışlar", t, a, b, 0), html: (t, a, b) => htmlOf("Uzaktan, Ayasofya'nın oradan bağırışlar", t, b) },
  { c: "O gün Sultan İbrahim, tahttan indirildi", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.8], [960, 600], <><ValideOda t={t} win={0.95} />{ibr(t, 960, { face: "shock", look: 0 }, 1.25)}{nv("nvT", 0.75, [{ x: 960, y: 560, r: 400 }], t)}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="TAHTTAN İNDİRİLDİ" y={70} size={96} accent={H.red} dark /> },
  { c: "Yerine tahta oturtulan çocuk", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 700], <><ValideOda t={t} win={0.2} /><g transform="translate(960,1000)"><path d="M-200,0 L-200,-300 Q0,-420 200,-300 L200,0Z" fill={P.crimson} stroke="#4A3524" strokeWidth={5} /><rect x={-240} y={-140} width={480} height={140} fill={P.gold} stroke="#4A3524" strokeWidth={5} /></g><PFig x={960} y={880} s={0.62} kind="prince" t={t} seed={61} sit /></>),
    html: (t, a, b) => <NameCard t={t} at={a + (b - a) * 0.4} name="IV. MEHMED" sub="6 yaşında · Turhan'ın oğlu" c="#B8505A" /> },
  { c: "O toplar, o sabah, senin için değil", tone: "night", r: (t, a, b) => again("Toplar atılıyordu", t, a, b, 1), html: (t, a, b) => htmlOf("Toplar atılıyordu", t, b) },
  { c: "Bir hafta sonra, bir kalfa elinde", tone: "cool", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 640], oda(t, 0, <>{kalfa(t, 620, 2, { look: 0.6, reach: 0.6, reachDir: 1, item: <rect x={-30} y={-50} width={60} height={80} fill="#F3E6C4" stroke="#4A3524" strokeWidth={2} /> })}{mi(t, 1120, { look: -0.6, face: "worried" })}</>)) },
  { c: "Ve senin adın, o listedeydi", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Belge t={t} at={a + 0.2} date="AĞUSTOS 1648" src="Eski Saray'a gidecekler">Saliha Dilaşub…<br />…<br /><span style={{ color: "#A01C2E" }}>Mihrinaz</span></Belge> },

  // ── ESKİ SARAY ──
  { c: "Osmanlı sarayında bir kural vardı", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={620} y={440} r={190} k={ramp(t, a + 0.3, a + 0.6)} c={P.crimson} label="YENİ VALİDE KALIR" /><Disc x={1300} y={440} r={190} k={ramp(t, a + 1.6, a + 2)} c={H.night} label="ÖTEKİLER GİDER" /></>) },
  { c: "Bir padişah öldüğünde", r: (t, a, b) => again("Osmanlı sarayında bir kural vardı", t, a, b, 0) },
  { c: "Sadece yeni padişahın", r: (t, a, b) => again("Osmanlı sarayında bir kural vardı", t, a, b, 1) },
  { c: "Ötekiler, Beyazıt'taki Eski Saray'a", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 540], <EskiSaray t={t} rain={0.5} />),
    html: (t, a) => <Tag t={t} at={a + 0.8} text="ESKİ SARAY · BEYAZIT" c={H.night} /> },
  { c: "Venedikli Ottaviano Bon da bunu yazar", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Belge t={t} at={a + 0.3} date="1604–1607" src="Ottaviano Bon">Padişah ölünce sarayda kalan sultan, yeni padişahın annesidir. Diğerleri unvanlarını kaybeder ve Eski Saray'a gönderilir.</Belge> },
  { c: "Padişah'ın ölümünden sonra", r: (t, a, b) => again("Venedikli Ottaviano Bon da bunu yazar", t, a, b, 0), html: (t, a, b) => htmlOf("Venedikli Ottaviano Bon da bunu yazar", t, b) },
  { c: "Diğerleri ünvanlarını kaybeder", r: (t, a, b) => again("Venedikli Ottaviano Bon da bunu yazar", t, a, b, 1), html: (t, a, b) => htmlOf("Venedikli Ottaviano Bon da bunu yazar", t, b) },
  { c: "Turhan, artık Valide Sultan'dı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], <><ValideOda t={t} win={0.2} />{tur(t, 960, { robe: P.crimson, face: "normal" }, 1.3)}</>),
    html: (t, a) => <NameCard t={t} at={a + 0.5} name="TURHAN SULTAN" sub="artık Valide Sultan" c={P.crimson} /> },
  { c: "araba araba Eski Saray'a taşındınız", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], <><EskiSaray t={t} rain={0.6} /><Araba x={lerp(-400, 900, ramp(t, a, b))} y={1000} s={0.9} t={t} /></>) },
  { c: "Halk o saraya bir ad takmıştı", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 500], <EskiSaray t={t} rain={1} />),
    html: (t, a) => <Txt t={t} at={a + 1} text="GÖZYAŞI SARAYI" y={70} size={110} accent={H.night} dark /> },
  { c: "Kızını sarayda bırakmak zorunda kaldın", tone: "cool", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], <><ValideOda t={t} win={0.2} />{mi(t, 800, { look: 0.5, face: "sad", reach: 0.5, reachDir: 1 })}<PFig x={1150} y={Y} s={0.66} kind="girl" robe={P.gold} robe2="#FFF1D0" t={t} seed={60} look={-0.5} face="sad" /></>) },
  { c: "Arabaya binerken son kez arkana baktın", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [800, 640], <><SarayKapi t={t} open={1} /><Araba x={600} y={1010} s={0.9} t={0} />{mi(t, 1020, { look: 0.8, face: "sad" })}</>) },
  { c: "Bir pencerede, küçük bir yüz vardı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.6], [960, 640], <SarayPencere t={t}><PFig x={960} y={1060} s={0.62} kind="girl" robe={P.gold} robe2="#FFF1D0" t={t} seed={60} face="sad" reach={0.5 + 0.35 * Math.sin((t - a) * 6)} reachDir={1} /></SarayPencere>) },
  { c: "Sen de salladın", tone: "gold", r: (t, a, b) => C(t, a, b, [2.0, 2.3], [960, 560], <><EskiSaray t={t} rain={0.3} />{mi(t, 960, { face: "sad", reach: 0.6 + 0.3 * Math.sin((t - a) * 6), reachDir: 1, look: 0.3 }, 1.25)}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="VE BAŞINI DİK TUTTUN." y={820} size={90} accent={H.gold} /> },

  // ── KADERLER ──
  { c: "Peki o yıl hamile kalan diğer kızların", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["TURHAN", "SALİHA DİLAŞUB", "MİHRİNAZ"].map((l, i) => <Disc key={i} x={420 + i * 540} y={440} r={170} k={ramp(t, a + 0.2 + i * 0.5, a + 0.5 + i * 0.5)} c={["#B8505A", "#7A6AA8", P.sky][i]} label={l} />)}</>) },
  { c: "Turhan, Osmanlı tarihinin en güçlü", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], <><ValideOda t={t} win={0.2} /><PFig x={960} y={Y} s={1.3} kind="valide" robe="#8E2F4A" t={t} seed={14} face="normal" /></>),
    html: (t, a) => <Tag t={t} at={a + 1} text="IV. MEHMED · 39 YIL TAHTTA" c={P.crimson} /> },
  { c: "Oğlu 4. Mehmet", r: (t, a, b) => again("Turhan, Osmanlı tarihinin en güçlü", t, a, b, 0), html: (t, a, b) => htmlOf("Turhan, Osmanlı tarihinin en güçlü", t, b) },
  { c: "Turhan Sultan, yarım kalmış Yeni Cami'yi", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.25, 1.1], [960, 560], <Cami t={t} k={1} />),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="YENİ CAMİ · EMİNÖNÜ" y={70} size={90} /> },
  { c: "Bugün Eminönü'nde, o", r: (t, a, b) => again("Turhan Sultan, yarım kalmış Yeni Cami'yi", t, a, b, 0), html: (t, a, b) => htmlOf("Turhan Sultan, yarım kalmış Yeni Cami'yi", t, b) },
  { c: "Saliha Dilaşub ise Eski Saray'da", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], <><EskiSaray t={t} rain={0.8} />{sal(t, 960, { face: "sad", look: 0.3 }, 1.1)}</>) },
  { c: "Oğlu Süleyman, kardeşi tahtta olduğu için", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 640], <><ValideOda t={t} win={0.95} /><PFig x={960} y={900} s={1.1} kind="prince" robe="#3A3A5A" t={t} seed={62} sit face="worried" look={-0.5} />{nv("nvK", 0.75, [{ x: 960, y: 620, r: 380 }], t)}</>),
    html: (t, a) => <Tag t={t} at={a + 1} text="KAFES · 40+ YIL" c={H.night} /> },
  { c: "Her gün kapısının", r: (t, a, b) => again("Oğlu Süleyman, kardeşi tahtta olduğu için", t, a, b, 0), html: (t, a, b) => htmlOf("Oğlu Süleyman, kardeşi tahtta olduğu için", t, b) },
  { c: "Ama Süleyman öldürülmedi", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={620} y={440} r={190} k={ramp(t, a + 0.8, a + 1.1)} c={H.red} label="KARDEŞ KATLİ" /><Disc x={1300} y={440} r={190} k={ramp(t, a + 2.2, a + 2.6)} c={H.teal} label="KAFES" /></>) },
  { c: "Kardeş katli yerini", r: (t, a, b) => again("Ama Süleyman öldürülmedi", t, a, b, 0) },
  { c: "Ve bin altı yüz seksen yedide", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 700], <><ValideOda t={t} win={0.2} /><g transform="translate(960,1000)"><path d="M-200,0 L-200,-300 Q0,-420 200,-300 L200,0Z" fill={P.crimson} stroke="#4A3524" strokeWidth={5} /><rect x={-240} y={-140} width={480} height={140} fill={P.gold} stroke="#4A3524" strokeWidth={5} /></g><PFig x={960} y={900} s={1.1} kind="sultan" robe="#3A3A5A" t={t} seed={62} sit /></>),
    html: (t, a) => <NameCard t={t} at={a + 0.8} name="II. SÜLEYMAN" sub="1687 · 45 yaşında padişah" c="#3A3A5A" /> },
  { c: "Annesi Saliha Dilaşub da", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], <><ValideOda t={t} win={0.2} /><PFig x={960} y={Y} s={1.3} kind="valide" robe="#5A4A8A" t={t} seed={15} face="smile" /></>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="KIRK YIL BEKLEMİŞTİ" y={70} size={90} accent={H.gold} /> },
  { c: "Ve sen? Senin adın hiçbir tarih kitabında", tone: "cool", r: (t, a, b) => C(t, a, b, [1.4, 1.7], [960, 600], <><EskiSaray t={t} rain={0.6} />{mi(t, 960, { face: "normal", look: 0.2 }, 1.15)}</>) },
  { c: "Çünkü sen bir kız doğurdun", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a, b) => <>{["TOP ATILMADI", "KRONİKLERE GİRMEDİ"].map((l, i) => <Txt key={i} t={t} at={a + 0.4 + i * (b - a) * 0.35} text={l} y={300 + i * 260} size={84} accent={H.night} />)}</> },
  { c: "Ama belki de, bu yüzden yaşadın", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [2.2, 2.6], [960, 520], <><EskiSaray t={t} rain={0} />{mi(t, 960, { face: "smile", look: 0.1 }, 1.25)}<Petals t={t} n={10} c="#FFE6B0" /></>),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="BELKİ DE BU YÜZDEN YAŞADIN." y={820} size={84} accent={H.gold} /> },

  // ── SONUÇ ──
  { c: "Osmanlı sarayında padişahtan hamile kalmak", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 560], bahce(t, <>{mi(t, 960, { belly: B2, hands: "belly", face: "smile" }, 1.2)}</>, t * 15)),
    html: (t, a) => <Tag t={t} at={a + 1} text="DIŞARIDAN: BİR MASAL" c={H.gold} /> },
  { c: "Bir köle kız", r: (t, a, b) => again("Osmanlı sarayında padişahtan hamile kalmak", t, a, b, 0), html: (t, a, b) => htmlOf("Osmanlı sarayında padişahtan hamile kalmak", t, b) },
  { c: "İpekler, altınlar, hizmetçiler", r: (t, a, b) => again("Osmanlı sarayında padişahtan hamile kalmak", t, a, b, 1), html: (t, a, b) => htmlOf("Osmanlı sarayında padişahtan hamile kalmak", t, b) },
  { c: "Ama içeriden bakınca", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["HER LOKMA", "HER BARDAK", "HER ADIM"].map((l, i) => <Disc key={i} x={420 + i * 540} y={440} r={170} k={ramp(t, a + 1 + i * 0.6, a + 1.3 + i * 0.6)} c={[H.red, H.purple, H.night][i]} label={l}>{i === 1 && <g transform="translate(0,70) scale(1.6)"><Serbet t={t} /></g>}</Disc>)}</>) },
  { c: "Yediğin her lokmada", r: (t, a, b) => again("Ama içeriden bakınca", t, a, b, 0) },
  { c: "Oğlun olursa", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={420} y={440} r={160} k={ramp(t, a + 0.2, a + 0.5)} c={H.night} label="OĞUL: HEDEF" /><Disc x={960} y={440} r={160} k={ramp(t, a + 2.5, a + 2.8)} c={H.pink} label="KIZ: 3 YAŞINDA NİKÂH" /><Disc x={1500} y={440} r={160} k={ramp(t, a + 5, a + 5.3)} c="#6A747A" label="GÖZYAŞI SARAYI" /></>) },
  { c: "Kızın olursa üç", r: (t, a, b) => again("Oğlun olursa", t, a, b, 0) },
  { c: "Ve padişah öldüğünde", r: (t, a, b) => again("Oğlun olursa", t, a, b, 1) },
  { c: "Bütün bunlar, senin hiçbir zaman seçmediğin", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 560], <Kafkas t={t} mist={0.5} />) },
  { c: "Kafkas dağlarında bir", r: (t, a, b) => again("Bütün bunlar, senin hiçbir zaman seçmediğin", t, a, b, 0) },
  { c: "kendini bir imparatorluğun", r: (t, a, b) => again("Bütün bunlar, senin hiçbir zaman seçmediğin", t, a, b, 1) },
  { c: "Ve onun tek suçu, güzel olmaktı", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.8], [960, 520], <><ValideOda t={t} win={0.2} />{miA(t, 960, { face: "sad" }, 1.3)}</>),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="TEK SUÇU: GÜZEL OLMAK" y={820} size={90} accent={H.red} /> },
  { c: "Peki sen Mihrinaz'ın yerinde olsaydın", tone: "night", r: (t, a, b) => keep("Bu şerbeti gerçekten kim gönderdi", t, b),
    html: (t, a, b) => <><Txt t={t} at={a + 0.6} text="ŞERBETİ İÇER MİYDİN?" y={80} size={90} accent={H.red} /><Txt t={t} at={a + (b - a) * 0.6} text="BİR OĞUL MU, BİR KIZ MI?" y={860} size={80} /></> },
  { c: "Ve o gece", r: (t, a, b) => again("Peki sen Mihrinaz'ın yerinde olsaydın", t, a, b, 0), html: (t, a, b) => htmlOf("Peki sen Mihrinaz'ın yerinde olsaydın", t, b) },
  { c: "Cevabını yorumlarda bekliyorum", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="CEVABIN YORUMLARDA 👇" y={420} size={100} /> },
  { c: "Eğer bu hikâye sana dokunduysa", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [960, 560], bahce(t, <>{mi(t, 960, { hands: "baby", face: "smile" }, 1.2)}</>, t * 15), [960, 560]),
    html: (t, a) => <Abone t={t} at={a + 0.5} /> },
  { c: "Çünkü Osmanlı Sarayı'nın", r: (t, a, b) => again("Eğer bu hikâye sana dokunduysa", t, a, b, 0), html: (t, a, b) => htmlOf("Eğer bu hikâye sana dokunduysa", t, b) },
  { c: "Bir sonraki hikâyede görüşmek üzere", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.0], [960, 540], <Sky w={1920} h={1080} k={0.9} city />) },
];

const win2 = (t: number, a: number, b: number) => ramp(t, a, a + 0.3) * (1 - ramp(t, b, b + 0.3));

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : s.c.startsWith("+") ? after - 0.2 + parseFloat(s.c) : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K3R_13_SECONDS));
  return raw;
})();

const VOL: Record<string, number> = { whoosh: 0.07, drone: 0.14, boom: 0.15, ding: 0.14, knock: 0.1, pop: 0.12, splash: 0.08 };
export const K3RVideo13: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K3R_13_SECONDS;
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
      <Audio src={staticFile("audio/k3r-13.wav")} />
      {TIMED.map((x, i) => i > 0 && !(x.from > END - 19 && x.sfx && x.sfx !== "whoosh") && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.08) * fps))} durationInFrames={Math.round(2.2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.from > END - 19 ? 0.05 : VOL[x.sfx ?? "whoosh"] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const _unused = { Avlu, Fincan, Laleler, Bebek };

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
