import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k3r-17-words.json";
import { makeCue, ramp } from "../../lib/cues";
import { H, lerp } from "../../components/Harem";
import { Abone, Belge, Disc, NameCard, Paper, Tag, Txt } from "../../components/K3Text";
import { Atmos, Fore, LiveCam, Sweep, Tone } from "../../components/Live";
import { Birds, GalleryWall, HasBahce, Laleler, Motes, NightVeil, PCam, PFig, PFrame, proWalk, Samdan, ValideOda, Bebek } from "../../components/HaremPro";
import { CibaliSokak, Gazete } from "../../components/HaremKuma";
import {
  AbazaKoy, AlatiniKosk, ArabaIc, Bayrak, Beylerbeyi, BosSalon, CerkezBaba, Dondurma, Fener, IkiTren, Kepenk, KirGece, Kompartiman,
  KusRafi, Loreley, MarangozKose, SirkeciGar, SurgunMektup, TahtaKus, Talas, TopkapiSalon, TrenGece, Tufek,
} from "../../components/HaremSurgun";

// Kanal 1 · k3r-17 · "Sürgüne Giden Padişahın Cariyesi Olmak Neden Zordu?" — HaremPro + Sürgün kiti (1909–1918).
// Sen: Dilnişin / Gunda (18, Abaza). Saliha Naciye Hanım + Şehzade Abid. II. Abdülhamid. Lalegül (arkadaş). Fethi Bey. Mösyö Moris. Baba (oymacı).
// BELGE 1: Ayşe Osmanoğlu (Alatini, kepenkler). BELGE 2: SMS Loreley raporu (12 kadın + Abid). Rakamlar: McCullagh 1910.

const ALT: Record<string, string[]> = {
  "Yirmi sekiz Nisan": ["28 Nisan"], "Gece saat üçe çeyrek var": ["Gece saat 3'e çeyrek var", "Gece saat üçe çeyrek"], "On sekiz yaşındasın": ["18 yaşındasın"],
  "On yaşındayken": ["10 yaşındayken"], "O kuş, sekiz yıldır": ["O kuş 8 yıldır"], "Padişah Abdülhamid, otuz yılı aşkın": ["Padişah Abdülhamid 30 yılı aşkın"],
  "Sekiz yılda bir köylü kızı": ["8 yılda bir köylü kızı"], "Abid dört yaşına girmek üzere": ["Abid 4 yaşına girmek üzere"],
  "Yirmi dört Ocak": ["24 Ocak"], "Altmış altı yaşında": ["66 yaşında"], "Bin dokuz yüz sekiz yazında": ["1908 yazında"],
  "Padişah, otuz yıl önce": ["Padişah 30 yıl önce"], "Sonra on üç Nisan": ["Sonra 13 Nisan"], "Ve on bir gün sonra": ["Ve 11 gün sonra"],
  "Saray hanımları ve cariyeler": ["Saray hanımları ve cariyeler:"], "Yirmi yedi Nisan. Salı": ["27 Nisan. Salı", "27 Nisan Salı"],
  "Otuz iki yıl, yedi ay": ["32 yıl, 7 ay", "32 yıl 7 ay"], "Kendi arzularıyla gelen dört kız": ["Kendi arzularıyla gelen 4 kız"],
  "Yolculuk yaklaşık yirmi saat": ["Yolculuk yaklaşık 20 saat"], "Ertesi gece, saat ona doğru": ["Ertesi gece saat 10'a doğru", "Ertesi gece saat ona doğru"],
  "Ayşe Sultan, o geceyi": ["Ayşe Sultan o geceyi"], "Padişah günde en fazla beş saat": ["Padişah günde en fazla 5 saat"],
  "O gün iki yüz on üç kadın": ["O gün 213 kadın"], "Ayşe Sultan dokuz ay sonra": ["Ayşe Sultan 9 ay sonra"],
  "Bin dokuz yüz on iki sonbaharı": ["1912 sonbaharı"], "Sekiz Ekim'de Balkan": ["8 Ekim'de Balkan"], "Abdülhamid, on iki kadın": ["Abdülhamid 12 kadın"],
  "On iki kadın": ["12 kadın"], "İki Kasım, gece saat üç buçuk": ["2 Kasım gece saat 3 buçuk", "2 Kasım, gece saat 3.30", "İki Kasım gece saat üç buçuk"],
  "Ve sen, üç buçuk yıl sonra": ["Ve sen 3,5 yıl sonra", "Ve sen üç buçuk yıl sonra"], "Dünya bir savaştan çıkıp": ["Dünya bir savaştan çıkıp daha"],
  "Ve on Şubat": ["Ve 10 Şubat"], "Sen yirmi yedi yaşındasın": ["Sen 27 yaşındasın"], "On yedi yıl önce": ["17 yıl önce"],
  "Bin dokuz yüz on sekiz baharında": ["1918 baharında"], "Sayıyorsun. On beş kuş": ["Sayıyorsun. 15 kuş", "Sayıyorsun 15 kuş"],
  "On altıncısının sadece": ["16'ncısının sadece", "16.'sının sadece"], "Yirmi yedi Nisan bin dokuz yüz dokuzda": ["27 Nisan 1909'da"],
  "Bin dokuz yüz on ikide Alman gemisi": ["1912'de Alman gemisi"], "Bin dokuz yüz altmış bire": ["1961'e"],
  "Dilnişin'in, yani Gunda'nın": ["Dilnişin'in yani Gunda'nın"], "Gunda": ["Gunda?"], "Francis McCullagh": ["Francis McCullough", "Francis Makkalah"],
};
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const VAR: [RegExp, string][] = [[/â/g, "a"], [/î/g, "i"], [/û/g, "u"]];
const variants = (p: string) => { const out = [p]; for (const [re, to] of VAR) for (const v of [...out]) { const n = v.replace(re, to); if (n !== v) out.push(n); } return out; };
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K3R_17_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone; fore?: "column" | "curtain" | "lamp" };
type PO = Partial<React.ComponentProps<typeof PFig>>;

// ── karakterler ──
const Y = 1005;
const dil = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="girl" robe="#3E5E86" robe2="#EFE6D4" scarf="#F2E6D0" t={t} seed={3} {...o} />;
const dilDis = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="girl" robe="#2A2E3A" robe2="#3A3E4A" scarf="#FFFFFF" t={t} seed={3} {...o} />; // ferace + bembeyaz peçe
const dilKoy = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="girl" plain robe="#6A4A3A" robe2="#E9DCC2" scarf="#D8C8A8" t={t} seed={3} {...o} />;
const sal = (t: number, x: number, o: PO = {}, s = 1.12) => <PFig x={x} y={Y} s={s} kind="girl" robe="#6E1F3A" robe2="#F1E3C6" scarf="#F7F2E6" t={t} seed={9} {...o} />;
const salDis = (t: number, x: number, o: PO = {}, s = 1.12) => <PFig x={x} y={Y} s={s} kind="girl" robe="#1E2230" robe2="#2E3240" scarf="#FFFFFF" t={t} seed={9} {...o} />;
const abid = (t: number, x: number, o: PO = {}, s = 0.56) => <PFig x={x} y={Y} s={s} kind="prince" plain robe="#C9A35A" robe2="#F2E6D0" t={t} seed={25} {...o} />;
const ah = (t: number, x: number, o: PO = {}, s = 1.16) => <PFig x={x} y={Y} s={s} kind="sultan" plain fes robe="#24242E" robe2="#D9D2C4" t={t} seed={11} {...o} />;
const lale = (t: number, x: number, o: PO = {}, s = 1.08) => <PFig x={x} y={Y} s={s} kind="girl" robe="#8A4A3A" robe2="#EFE6D4" scarf="#E9DCC2" t={t} seed={7} {...o} />;
const kalfa = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="kalfa" robe="#4A5A4A" robe2="#E2D9C6" t={t} seed={5} {...o} />;
const fethi = (t: number, x: number, o: PO = {}, s = 1.14) => <PFig x={x} y={Y} s={s} kind="prince" plain fes robe="#4E5236" robe2="#8A8A6A" t={t} seed={8} {...o} />;
const moris = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="prince" plain robe="#22304E" robe2="#C9C2B4" t={t} seed={21} {...o} />;
const asker = (t: number, x: number, i = 0, o: PO = {}, s = 1.02) => <g key={`as${i}`}>{<PFig x={x} y={Y} s={s} kind="prince" plain fes robe={["#4E5236", "#5A5A3A", "#46482E"][i % 3]} robe2="#7A7A5A" t={t} seed={60 + i} {...o} />}<Tufek x={x + 70 * s} y={Y - 10} s={s * 0.9} /></g>;
const ayse = (t: number, x: number, o: PO = {}, s = 1.05) => <PFig x={x} y={Y} s={s} kind="girl" robe="#5A4A7A" robe2="#F1E3C6" scarf="#F7F2E6" t={t} seed={20} {...o} />;
const musf = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="kalfa" robe="#2E2A3A" robe2="#E2D9C6" t={t} seed={22} {...o} />;
const kardes = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="prince" plain fes robe="#6A5A3A" robe2="#E2D9C6" t={t} seed={33} {...o} />;
const kadin = (t: number, x: number, i: number, o: PO = {}, s = 1.0) => <PFig key={`k${i}`} x={x} y={Y} s={s} kind="girl" robe={["#7A5A6A", "#5A6A7A", "#8A6A4A", "#6A7A5A", "#9A6A6A"][i % 5]} robe2="#EFE6D4" scarf={["#F2E6D0", "#E9DCC2", "#D8C8A8"][i % 3]} t={t} seed={30 + i} {...o} />;
const erkek = (t: number, x: number, i: number, o: PO = {}, s = 1.05) => <PFig key={`e${i}`} x={x} y={Y} s={s} kind="prince" plain fes robe={["#4A3A2A", "#3A4A5A", "#5A4A3A", "#4A5A3A"][i % 4]} robe2="#E2D9C6" t={t} seed={50 + i} {...o} />;
const baba = (t: number, x: number, o: Partial<React.ComponentProps<typeof CerkezBaba>> = {}, s = 1.08) => <CerkezBaba x={x} y={Y} s={s} t={t} seed={2} {...o} />;
const babalar = (t: number, a: number, b: number) => <>{[0, 1, 2, 3].map((i) => <CerkezBaba key={i} x={lerp(-200 + i * 260, 300 + i * 360, ramp(t, a, b))} y={Y} s={0.98} t={t} seed={70 + i} coat={["#4A3A2E", "#3A3A2A", "#5A4434", "#2E3A3A"][i]} beard={i % 2 ? "#3A2A1E" : "#D8D0C0"} walk={ramp(t, a, b) * 6 + i * 0.3} look={0.4} />)}</>;

// ── mekânlar ──
const C = (t: number, a: number, b: number, z: [number, number], c0: [number, number], kids: React.ReactNode, c1?: [number, number]) => <PCam t={t} a={a} b={b} z={z} c0={c0} c1={c1}>{kids}</PCam>;
const gar = (t: number, figs: React.ReactNode = null, o: { pan?: number; train?: number; soldiers?: number } = {}) => (
  <><SirkeciGar t={t} pan={o.pan ?? 0} train={o.train ?? 1} soldiers={o.soldiers ?? 1} />{figs}<NightVeil id="nvGar" k={0.4} lights={[{ x: 960 - (o.pan ?? 0) * 0.9, y: 300, r: 560 }, { x: 960, y: 900, r: 520, f: 0.8 }]} t={t} /></>
);
const daire = (t: number, figs: React.ReactNode = null, night = 0) => (
  <><ValideOda t={t} win={night ? 0.95 : 0.2} />{figs}{night > 0 && <NightVeil id="nvDa" k={0.55 * night} lights={[{ x: 960, y: 420, r: 560 }, { x: 960, y: 820, r: 420, f: 0.8 }]} t={t} />}<Motes t={t} n={24} op={0.4} /></>
);
const koridor = (t: number, figs: React.ReactNode = null, night = 0, camX = 0) => <><GalleryWall t={t} camX={camX} night={night} />{figs}<Motes t={t} n={28} op={0.4} /></>;
const bahce = (t: number, figs: React.ReactNode = null, pan = 0, night = 0) => (
  <><HasBahce t={t} pan={pan} /><Birds t={t} /><Laleler x={1380} y={890} n={10} t={t} s={0.8} />{figs}<Laleler x={-60} y={1130} n={7} t={t} s={1.7} blur={8} />{night > 0 && <NightVeil id="nvBa" k={0.75 * night} lights={[{ x: 960, y: 500, r: 420 }]} t={t} />}</>
);
const koy = (t: number, figs: React.ReactNode = null, pan = 0, spring = 1) => <><AbazaKoy t={t} pan={pan} spring={spring} />{figs}</>;
const atolye = (t: number, figs: React.ReactNode = null, night = 0) => <><MarangozKose t={t} night={night} />{figs}{night > 0 && <NightVeil id="nvAt" k={0.6 * night} lights={[{ x: 760, y: 640, r: 460 }]} t={t} />}</>;
const komp = (t: number, figs: React.ReactNode = null, o: { lamp?: number; day?: number } = {}) => <><Kompartiman t={t} lamp={o.lamp ?? 1} day={o.day ?? 0} />{figs}</>;
const kir = (t: number, figs: React.ReactNode = null, o: { pan?: number; train?: boolean; lanterns?: number } = {}) => <><KirGece t={t} pan={o.pan ?? 0} train={o.train ?? true} lanterns={o.lanterns ?? 1} grassFg={false} />{figs}<KirGece t={t} pan={o.pan ?? 0} onlyFg /></>;
const kosk = (t: number, figs: React.ReactNode = null, o: { night?: number; shut?: number; gate?: number; pan?: number } = {}) => <><AlatiniKosk t={t} night={o.night ?? 1} shut={o.shut ?? 0} gate={o.gate ?? 0} pan={o.pan ?? 0} />{figs}</>;
const salon = (t: number, figs: React.ReactNode = null, o: { night?: number; candle?: number; beds?: number; slits?: number; together?: number; gas?: number } = {}) => (
  <><BosSalon t={t} night={o.night ?? 1} candle={o.candle ?? 0} beds={o.beds ?? 0} slits={o.slits ?? 0} chairsTogether={o.together ?? 0} gas={o.gas ?? 1} />{figs}</>
);
const topk = (t: number, figs: React.ReactNode = null, pan = 0) => <><TopkapiSalon t={t} pan={pan} />{figs}<Motes t={t} n={30} op={0.4} /></>;
const sokak = (t: number, figs: React.ReactNode = null, o: { pan?: number; dusk?: number } = {}) => <><CibaliSokak t={t} pan={o.pan ?? 0} dusk={o.dusk ?? 0} fire={0} />{figs}</>;
const kapali = (t: number, kids: React.ReactNode, bg = "#2A1E16") => <><rect width={1920} height={1080} fill={bg} />{kids}<Motes t={t} n={24} op={0.4} /></>;
const kus = (t: number, a: number, glow = 0.8, bg = "#1E140E") => kapali(t, <TahtaKus x={960} y={560} s={2.6} t={t} glow={glow} rot={Math.sin(t * 0.6) * 3} />, bg);
const yur = (t: number, a: number, b: number, x0: number, x1: number, s = 1.0) => ({ x: lerp(x0, x1, ramp(t, a, b)), walk: proWalk(t, a, b, x0, x1, s).walk });

const SHOTS: Sh[] = [
  // ── AN: Sirkeci, 28 Nisan 1909, 02:45 ──
  { c: "Yirmi sekiz Nisan", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 520], gar(t)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="28 NİSAN 1909 · SİRKECİ" y={70} size={90} accent={H.red} /> },
  { c: "Gece saat üçe çeyrek var", sfx: "ding", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2.2], [1520, 240], gar(t)),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="02:45" y={820} size={140} /> },
  { c: "İstanbul, Sirkeci Garı", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], gar(t, null, { pan: ramp(t, a, b) * 120 })),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="SİRKECİ GARI · İSTANBUL" c={H.red} /> },
  { c: "Peronda tek bir lamba yanıyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [960, 380], gar(t)) },
  { c: "Rayların iki yanında süngülü askerler", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 700], gar(t, null, { pan: ramp(t, a, b) * 200 })) },
  { c: "Kimse konuşmuyor", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.6], [700, 620], gar(t, <>{asker(t, 700, 0, { face: "normal", look: 0.3 })}{asker(t, 1150, 1, { face: "normal", look: -0.3 })}</>)) },
  { c: "Sen bembeyaz bir peçenin altındasın", tone: "night", r: (t, a, b) => C(t, a, b, [1.7, 2], [820, 560], gar(t, <>{dilDis(t, 820, { face: "worried", look: 0.4 })}</>)) },
  { c: "Kollarında bir bohça var", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [820, 640], gar(t, <>{dilDis(t, 820, { face: "worried", hands: "tray", bow: 0.3 })}</>)) },
  { c: "Yanında, annesinin kucağında", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [900, 600], gar(t, <>{dilDis(t, 680, { face: "worried", look: 0.5 })}{salDis(t, 1100, { hands: "baby", face: "closed", look: -0.3 })}</>)) },
  { c: "Ve önünde, vagonun basamağına", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [1150, 600], gar(t, <>{ah(t, lerp(1050, 1250, ramp(t, a, b)), { walk: proWalk(t, a, b, 1050, 1250, 1).walk, bow: 0.3, face: "sad", look: 0.5 })}{dilDis(t, 650, { face: "worried", look: 0.6 }, 1.0)}</>)) },
  { c: "Dün sabah, bu adam", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 580], koridor(t, <>{ah(t, 960, { face: "normal", look: 0.1 }, 1.25)}</>, 0, 400)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="DÜN SABAH: PADİŞAH" y={70} size={86} accent={H.gold} /> },
  { c: "Bu gece, sürgüne gidiyor", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [1150, 560], gar(t, <>{ah(t, 1150, { face: "sad", bow: 0.2, look: 0.4 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="BU GECE: SÜRGÜN" y={820} size={110} accent={H.red} /> },
  { c: "Ve sen, onunla gidiyorsun", tone: "night", r: (t, a, b) => C(t, a, b, [2.3, 2.5], [820, 560], gar(t, <>{dilDis(t, 820, { face: "closed" })}</>)) },
  { c: "Bir saat önce bir seçim yaptın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], daire(t, <>{dil(t, 820, { face: "worried", reach: ramp(t, a + 1, a + 2) })}{lale(t, 1200, { face: "sad", look: -0.6 })}</>, 1)) },
  { c: "Kimse seni zorlamadı", r: (t, a, b) => again("Bir saat önce bir seçim yaptın", t, a, b, 0) },
  { c: "Ama o seçim", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [820, 560], daire(t, <>{dil(t, 820, { face: "closed" })}</>, 1)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="EN UZUN DOKUZ YIL" y={820} size={100} /> },
  { c: "Bir kapı arkanda kilitlenecek", sfx: "knock", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], kosk(t, null, { gate: 1 - ramp(t, a + 0.3, a + 1.6) })) },
  { c: "Pencereler tahtayla kapanacak", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Kepenk t={t} k={ramp(t, a + 0.2, a + 1.8)} />) },
  { c: "Ve İstanbul'da biri, yüzünü arayacak", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], topk(t, <>{baba(t, lerp(300, 900, ramp(t, a, b)), { walk: ramp(t, a, b) * 5, look: 0.5 })}{[0, 1, 2].map((i) => kadin(t, 1200 + i * 220, i, { face: "normal", look: -0.5 }))}</>, ramp(t, a, b) * 200)) },
  { c: "Bulamayacak", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 560], topk(t, <>{baba(t, 960, { sad: 1, look: -0.3 })}</>, 300)) },
  { c: "Bugün, Osmanlı'da sürgüne giden", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={600} y={440} r={220} k={ramp(t, a + 2.5, a + 3)} c={H.red} label="EFSANE" /><Disc x={1320} y={440} r={220} k={ramp(t, a + 4, a + 4.5)} c={H.cobalt} label="HATIRA" /></>) },
  { c: "Bu tür hikâyeleri seviyorsan", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.1], [960, 560], gar(t, <>{dilDis(t, 960, { face: "normal" }, 1.2)}</>)),
    html: (t, a) => <Abone t={t} at={a + 0.4} /> },
  { c: "Bu kanal, Osmanlı kadınlarının", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 540], bahce(t, <>{[0, 1, 2].map((i) => kadin(t, 600 + i * 360, i, { face: "smile", look: 0.2 }))}</>, ramp(t, a, b) * 200)), html: (t, a, b) => htmlOf("Bu tür hikâyeleri seviyorsan", t, b) },

  // ── SEN KİMSİN ──
  { c: "Adın Dilnişin", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], daire(t, <>{dil(t, 960, { face: "normal" }, 1.3)}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.3} name="DİLNİŞİN" sub="Saraydaki adın · “Gönül evinde oturan”" c="#3E5E86" /> },
  { c: "Gönül evinde oturan", r: (t, a, b) => again("Adın Dilnişin", t, a, b, 1), html: (t, a, b) => htmlOf("Adın Dilnişin", t, b) },
  { c: "Ama annen sana başka bir isimle", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], koy(t, <>{kadin(t, 800, 2, { face: "smile", look: 0.5 })}{dilKoy(t, 1060, { face: "smile", look: -0.4 }, 0.72)}</>, 200)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="GUNDA" y={70} size={140} accent={H.gold} /> },
  { c: "On sekiz yaşındasın", tone: "warm", r: (t, a, b) => C(t, a, b, [2, 2.2], [960, 560], daire(t, <>{dil(t, 960, { face: "smile", look: 0.2 })}</>)),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="18 YAŞINDA" c="#3E5E86" /> },
  { c: "Adapazarı'nın yakınında", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 520], koy(t, null, ramp(t, a, b) * 400)),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="ADAPAZARI · ABAZA MUHACİR KÖYÜ" c={H.green} /> },
  { c: "Deden, Kafkasya'dan gemilerle", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={420} y={460} r={170} k={ramp(t, a + 0.3, a + 0.7)} c={H.green} label="KAFKASYA" /><Disc x={960} y={460} r={170} k={ramp(t, a + 1.2, a + 1.6)} c={H.cobalt} label="KARADENİZ" /><Disc x={1500} y={460} r={170} k={ramp(t, a + 2.1, a + 2.5)} c={H.red} label="ADAPAZARI" /></>) },
  { c: "Ne varsa geride bırakmışlardı", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 520], <><Loreley t={t} night={1} pan={ramp(t, a, b) * 200} /><NightVeil id="nvDed" k={0.5} lights={[{ x: 960, y: 600, r: 600 }]} t={t} /></>) },
  { c: "Sadece dillerini ve türkülerini", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], koy(t, <>{[0, 1, 2, 3].map((i) => kadin(t, 420 + i * 360, i, { face: i % 2 ? "smile" : "closed", talk: i === 1 ? 1 : 0 }))}</>, 500)) },
  { c: "Baban bir oymacıydı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [900, 600], atolye(t, <>{baba(t, 900, { look: 0.3 })}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="BABAN" sub="Oymacı · Abaza köyü" c="#5E3B20" /> },
  { c: "Elinde küçük bir bıçak", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 540], <Talas t={t} hand={ramp(t, a + 0.2, a + 1.4)} />) },
  { c: "Akşamları ocağın başında", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [760, 620], atolye(t, <>{baba(t, 760, { look: 0.4, reach: 0.5 })}<TahtaKus x={1000} y={680} s={0.6} t={t} glow={0.6} /></>, 0.8)) },
  { c: "On yaşındayken", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], koy(t, <>{baba(t, 1100, { look: -0.4 })}{dilKoy(t, 820, { face: "worried", look: 0.5 }, 0.7)}</>, 800)),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="10 YAŞINDA" c={H.green} /> },
  { c: "O sabahı hâlâ hatırlıyorsun", r: (t, a, b) => again("On yaşındayken", t, a, b, 1) },
  { c: "Baban arabaya binmeden önce", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 600], koy(t, <>{baba(t, 1100, { look: -0.6, reach: ramp(t, a + 0.5, a + 1.5), sad: 0.5 })}{dilKoy(t, 820, { face: "sad", look: 0.6 }, 0.7)}</>, 800)) },
  { c: "Ceviz ağacından oyulmuş", sfx: "ding", tone: "gold", r: (t, a) => kus(t, a, 0.9) },
  { c: "Kızım, dedi", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [1100, 560], koy(t, <>{baba(t, 1100, { look: -0.5, sad: 0.6 })}</>, 800)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="“BU KUŞ SENİ BANA GERİ GETİRECEK.”" y={820} size={70} /> },
  { c: "O kuş, sekiz yıldır", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 560], kapali(t, <><TahtaKus x={960} y={620} s={1.4} t={t} glow={0.4} /><Samdan x={1500} y={900} t={t} /></>, "#1A1424")),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="8 YILDIR YASTIĞININ ALTINDA" c={H.purple} /> },
  { c: "Bu kuşu unutma", sfx: "drone", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.6], [960, 560], kus(t, a, 1)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="BU KUŞU UNUTMA" y={820} size={100} accent={H.gold} /> },

  // ── YILDIZ ──
  { c: "Seni Yıldız Sarayı'na getirdiler", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 520], bahce(t, null, ramp(t, a, b) * 300)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="YILDIZ SARAYI" y={70} size={100} /> },
  { c: "Topkapı değil", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 520], topk(t, <>{kalfa(t, 960, { face: "normal", bow: 0.2 }, 1.0)}</>, 600)),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="TOPKAPI = ESKİ SARAY" c={H.cobalt} /> },
  { c: "Padişah Abdülhamid, otuz yılı aşkın", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 600], bahce(t, <>{ah(t, lerp(1300, 900, ramp(t, a, b)), { walk: proWalk(t, a, b, 1300, 900, 1).walk, look: -0.3 })}</>, 200)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="II. ABDÜLHAMİD" sub="Padişah · 1876–1909" c="#24242E" /> },
  { c: "Beşiktaş'ın üstündeki tepede", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 500], bahce(t, null, 500 + ramp(t, a, b) * 300)) },
  { c: "Burada her şey bir kural", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], koridor(t, <>{[0, 1, 2, 3].map((i) => { const w = yur(t, a, b, 1700 + i * 240, 300 + i * 240, 1); return kadin(t, w.x, i, { walk: w.walk, bow: 0.2 }, 0.95); })}</>, 0, ramp(t, a, b) * 200)) },
  { c: "İlk yıl acemisin", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [960, 600], koridor(t, <>{kalfa(t, 1150, { talk: 1, look: -0.5 })}{dil(t, 780, { face: "shy", look: 0.5 }, 0.95)}</>, 0, 300)),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="ACEMİ = YENİ GELEN KIZ" c={H.cobalt} /> },
  { c: "Kalfalar sana yürümeyi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], koridor(t, <>{kalfa(t, 1250, { talk: 1, look: -0.5 })}{dil(t, lerp(500, 900, ramp(t, a, b)), { walk: proWalk(t, a, b, 500, 900, 0.95).walk, bow: 0.4 }, 0.95)}</>, 0, 500)) },
  { c: "Kimseye sırtını dönmemeyi", r: (t, a, b) => C(t, a, b, [1.8, 2], [900, 580], koridor(t, <>{dil(t, 900, { face: "shy", bow: 0.6 }, 0.95)}</>, 0, 500)) },
  { c: "Sonra okuma yazma", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["OKUMA", "KURAN", "NAKIŞ", "MUSİKİ"].map((l, i) => <Disc key={i} x={330 + i * 420} y={460} r={160} k={ramp(t, a + 0.3 + i * 0.5, a + 0.6 + i * 0.5)} c={[H.cobalt, H.green, H.red, H.purple][i]} label={l} />)}</>) },
  { c: "Sekiz yılda bir köylü kızı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 600], daire(t, <>{dilKoy(t, lerp(700, 400, ramp(t, a, b)), { face: "shy", op: 1 - ramp(t, a + 0.5, a + 2) }, 0.75)}{dil(t, 1060, { face: "normal", op: ramp(t, a + 0.8, a + 2), look: -0.2 })}</>)) },
  { c: "Ve bir gün seni bir daireye", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], koridor(t, <>{(() => { const w = yur(t, a, b, 300, 1300, 1.05); return dil(t, w.x, { walk: w.walk, look: 0.3 }); })()}</>, 0, 800)) },
  { c: "Saliha Naciye, padişahın en genç eşi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], daire(t, <>{sal(t, 960, { face: "normal", look: 0.2 }, 1.25)}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="SALİHA NACİYE HANIM" sub="Padişahın en genç eşi · 1904" c="#6E1F3A" /> },
  { c: "Ertesi yıl bir oğlu oldu", tone: "warm", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 600], daire(t, <>{sal(t, 960, { hands: "baby", face: "smile", bow: 0.3 })}</>)),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="ŞEHZADE ABİD · 1905" c={H.gold} /> },
  { c: "Senin görevin", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 640], daire(t, <>{dil(t, 820, { look: 0.5, face: "smile", bow: 0.2 })}{abid(t, 1100, { look: -0.5, face: "smile" })}</>)) },
  { c: "Abid dört yaşına girmek üzere", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [1000, 700], daire(t, <>{dil(t, 760, { look: 0.6, face: "smile" })}{(() => { const w = yur(t, a, b, 1500, 950, 0.56); return abid(t, w.x, { walk: w.walk, face: "smile" }); })()}</>)) },
  { c: "Seni kalfası değil, ablası sanıyor", r: (t, a, b) => again("Abid dört yaşına girmek üzere", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="“ABLA”" y={820} size={120} accent={H.gold} /> },
  { c: "Gece korkunca", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [920, 640], daire(t, <>{dil(t, 860, { look: 0.4, face: "worried" })}{abid(t, 1000, { look: -0.6, face: "worried" })}</>, 1)) },
  { c: "Sen ona köyünün ninnisini", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [880, 560], daire(t, <>{dil(t, 880, { face: "closed", talk: 0.5, bow: 0.3 })}</>, 1)) },
  { c: "Sarayda kimse o dili bilmiyor", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [960, 680], daire(t, <>{dil(t, 820, { sit: true, face: "closed", talk: 0.4 })}{abid(t, 1080, { sit: true, face: "closed" })}</>, 1)) },
  { c: "Saliha Naciye Hanım bir de kız", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 600], daire(t, <>{sal(t, 960, { hands: "baby", face: "smile" })}</>)),
    html: (t, a) => <Tag t={t} at={a + 1} text="SAMİYE SULTAN" c={H.purple} /> },
  { c: "Yirmi dört Ocak", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], kapali(t, <><Samdan x={760} y={940} t={t} s={1.4} /><Samdan x={1160} y={940} t={t} s={1.4} /></>, "#14121C")),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="24 OCAK 1909" y={70} size={90} /> },
  { c: "O kış, dairenin içinde", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], daire(t, <>{sal(t, 860, { face: "sad", bow: 0.4 })}{dil(t, 1200, { face: "sad", look: -0.5 })}</>, 0.6)) },
  { c: "Ve kimse bilmiyordu ki", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 500], bahce(t, null, 300, 1)) },

  // ── PADİŞAH ──
  { c: "Padişahı uzaktan görüyorsun", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], koridor(t, <>{ah(t, lerp(1600, 1250, ramp(t, a, b)), { walk: proWalk(t, a, b, 1600, 1250, 0.7).walk, look: -0.3 }, 0.7)}{dil(t, 500, { look: 0.8, face: "shy" })}</>, 0, 600)) },
  { c: "Altmış altı yaşında", tone: "warm", r: (t, a, b) => C(t, a, b, [2.1, 2.3], [960, 560], koridor(t, <>{ah(t, 960, { look: 0.2 })}</>, 0, 700)),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="66 YAŞINDA" c="#24242E" /> },
  { c: "Yıldız'ın içinde kendi marangozhanesi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [900, 600], atolye(t, <>{ah(t, 760, { look: 0.4, reach: 0.6, bow: 0.3 })}</>)),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="PADİŞAHIN MARANGOZHANESİ" c="#5E3B20" /> },
  { c: "Sarayın tiyatrosunda operalar", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], koridor(t, <><Samdan x={400} y={940} t={t} /><Samdan x={1500} y={940} t={t} />{ah(t, 960, { sit: true, y: 900, look: 0, face: "smile" })}</>, 1, 300)),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="YILDIZ SARAY TİYATROSU" c={H.purple} /> },
  { c: "Ama en çok korkuyor", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [2.3, 2.5], [960, 560], koridor(t, <>{ah(t, 960, { face: "worried", look: 0.6 })}</>, 1, 700)) },
  { c: "Yıldız'ın her kapısında askerler", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], bahce(t, <>{[0, 1, 2, 3].map((i) => asker(t, 300 + i * 440, i, { look: 0 }))}</>, 600)) },
  { c: "Dışarıdan gelen her haber", r: (t, a, b) => again("Yıldız'ın her kapısında askerler", t, a, b, 1) },
  { c: "Saray, dünyaya karşı bir kale gibi", tone: "cool", r: (t, a, b) => C(t, a, b, [1.25, 1.05], [960, 520], bahce(t, null, 700, 0.5)) },

  // ── DÜŞÜŞE GİDEN YOL ──
  { c: "Bin dokuz yüz sekiz yazında", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 540], kapali(t, <Gazete t={t} k={ramp(t, a + 0.1, a + 0.8)} head="KANUN-I ESASÎ YENİDEN" />, "#3A2A20")),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="1908" y={70} size={110} /> },
  { c: "Selanik'teki askerler ayaklanıyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], sokak(t, <>{[0, 1, 2, 3].map((i) => { const w = yur(t, a, b, -200 + i * 220, 1300 + i * 220, 1); return asker(t, w.x, i, { walk: w.walk }); })}</>, { pan: 300 })),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="SELANİK · 1908" c={H.red} /> },
  { c: "Padişah, otuz yıl önce", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 580], koridor(t, <>{ah(t, 960, { face: "sad", bow: 0.3 })}</>, 0, 900)) },
  { c: "İstanbul sokaklarında insanlar bayram", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], sokak(t, <><Bayrak x={300} y={760} t={t} s={1.2} pole={300} /><Bayrak x={1650} y={760} t={t + 1} s={1.2} pole={300} />{[0, 1, 2, 3, 4].map((i) => erkek(t, 400 + i * 280, i, { face: "smile", talk: i % 2 }))}</>, { pan: 600 })),
    html: (t, a) => <Txt t={t} at={a + 1.2} text="“HÜRRİYET!”" y={820} size={120} accent={H.red} /> },
  { c: "Harem bu sesleri", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [960, 600], daire(t, <>{dil(t, 820, { look: 0.9, face: "worried" })}{lale(t, 1100, { look: 0.9, face: "worried" })}</>)) },
  { c: "Sonra on üç Nisan", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 540], sokak(t, null, { pan: 1000, dusk: 0.4 })),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="13 NİSAN 1909" y={70} size={100} accent={H.red} /> },
  { c: "Tarih kitaplarında bunun adı", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], kapali(t, <Gazete t={t} k={1} head="OTUZ BİR MART VAKASI" />, "#3A2A20")),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="ESKİ TAKVİMLE: 31 MART" c={H.cobalt} /> },
  { c: "İstanbul'daki bazı askerler", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], sokak(t, <>{[0, 1, 2].map((i) => { const w = yur(t, a, b, 1900 + i * 200, 200 + i * 200, 1.2); return asker(t, w.x, i, { walk: w.walk, face: "shock" }); })}</>, { pan: 1100, dusk: 0.5 })) },
  { c: "Ve on bir gün sonra", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], sokak(t, <>{[0, 1, 2, 3, 4].map((i) => { const w = yur(t, a, b, -400 + i * 240, 1100 + i * 240, 1); return asker(t, w.x, i, { walk: w.walk }); })}</>, { pan: 400, dusk: 0.2 })),
    html: (t, a) => <Tag t={t} at={a + 1} text="HAREKET ORDUSU · 24 NİSAN" c={H.red} /> },
  { c: "O gece, Yıldız'da her şey çözülüyor", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.2], [960, 520], bahce(t, null, 400, 1)) },
  { c: "İrlandalı gazeteci Francis McCullagh", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="FRANCIS McCULLAGH" sub="İrlandalı gazeteci · The Fall of Abd-ul-Hamid (1910)" c={H.green} /> },
  { c: "Saray hanımları ve cariyeler", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={420} y={460} r={200} k={ramp(t, a + 0.2, a + 0.6)} c={H.red} label="370 KADIN" /></>) },
  { c: "Harem ağaları", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={420} y={460} r={200} k={1} c={H.red} label="370 KADIN" /><Disc x={960} y={460} r={200} k={ramp(t, a + 0.1, a + 0.5)} c={H.purple} label="127 AĞA" /></>) },
  { c: "Sarayı koruyan askerler", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={420} y={460} r={200} k={1} c={H.red} label="370 KADIN" /><Disc x={960} y={460} r={200} k={1} c={H.purple} label="127 AĞA" /><Disc x={1500} y={460} r={200} k={ramp(t, a + 0.1, a + 0.5)} c={H.green} label="1450 ASKER" /></>) },
  { c: "Ve o cumartesi gecesi", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 620], bahce(t, <>{[0, 1, 2, 3].map((i) => { const w = yur(t, a + i * 0.3, b, 900 + i * 120, -300 + i * 100, 1.1); return asker(t, w.x, i, { walk: w.walk, face: "worried" }); })}</>, 500, 0.9)) },
  { c: "Sarayın kapıları, bir yaradan", r: (t, a, b) => again("Ve o cumartesi gecesi", t, a, b, 2) },
  { c: "Haremin içine ağalar", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], koridor(t, <>{(() => { const w = yur(t, a, b, 1700, 900, 1.1); return erkek(t, w.x, 1, { walk: w.walk, face: "shock", talk: 1 }); })()}{kadin(t, 500, 0, { face: "worried", look: 0.6 })}</>, 1, 300)) },
  { c: "Kadınlar bayılıyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 640], koridor(t, <>{[0, 1, 2, 3].map((i) => kadin(t, 420 + i * 360, i, { face: i % 2 ? "shock" : "sad", talk: i === 2 ? 1 : 0, bow: i === 0 ? 0.6 : 0 }))}</>, 1, 500)) },
  { c: "Ve bir ara, McCullagh'ın yazdığına göre", sfx: "whoosh", r: (t, a, b) => C(t, a, b, [1.8, 2.1], [960, 580], koridor(t, <>{[0, 1, 2].map((i) => kadin(t, 640 + i * 320, i + 1, { face: "shock", talk: 1 }))}</>, 1, 500)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="ÇIĞLIK" y={820} size={130} accent={H.red} /> },
  { c: "Sen o gecenin içindesin", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 620], daire(t, <>{dil(t, 960, { hands: "baby", face: "worried", look: 0.4 })}</>, 1)) },
  { c: "Abid'i kucağına almışsın", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 600], daire(t, <>{dil(t, 960, { hands: "baby", face: "worried", bow: 0.4, talk: 0.4 })}</>, 1)),
    html: (t, a) => <Txt t={t} at={a + 2} text="“KORKMA.”" y={820} size={110} /> },
  { c: "Ama asıl korkan sensin", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [960, 540], daire(t, <>{dil(t, 960, { face: "shock", look: 0.2 })}</>, 1)) },
  { c: "Yanında arkadaşın Lalegül", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [1100, 600], daire(t, <>{dil(t, 780, { face: "worried", look: 0.6 })}{lale(t, 1150, { face: "worried", look: -0.5 })}</>, 1)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="LALEGÜL" sub="Arkadaşın · Çerkez · 19" c="#8A4A3A" /> },
  { c: "Lalegül senin elini sıkıyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 620], daire(t, <>{dil(t, 820, { face: "worried", look: 0.6 })}{lale(t, 1080, { face: "worried", look: -0.6, reach: 0.8, reachDir: -1 })}</>, 1)) },
  { c: "Ne olursa olsun", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [1080, 560], daire(t, <>{lale(t, 1080, { face: "worried", talk: 1, look: -0.4 })}</>, 1)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“KÖYÜME DÖNECEĞİM. BABAM BENİ BEKLİYOR.”" y={820} size={64} /> },
  { c: "Sen bir şey demiyorsun", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 560], kapali(t, <TahtaKus x={960} y={600} s={1.8} t={t} glow={0.5} />, "#1A1424")) },

  // ── 27 NİSAN: TAHTTAN İNİŞ ──
  { c: "Yirmi yedi Nisan. Salı", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.12], [960, 520], bahce(t, null, 800)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="27 NİSAN 1909 · SALI" y={70} size={96} accent={H.red} /> },
  { c: "Öğleden sonra haber geliyor", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 540], kapali(t, <Gazete t={t} k={ramp(t, a + 0.1, a + 0.8)} head="PADİŞAH TAHTTAN İNDİRİLDİ" />, "#3A2A20")) },
  { c: "Yerine kardeşi Reşad geçti", r: (t, a, b) => again("Öğleden sonra haber geliyor", t, a, b, 1),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="V. MEHMED REŞAD" c={H.cobalt} /> },
  { c: "Otuz iki yıl, yedi ay", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="32 YIL · 7 AY · 13 GÜN" y={430} size={120} accent={H.red} /> },
  { c: "Bir saltanat, bir öğleden sonra bitti", tone: "cool", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 560], koridor(t, <>{ah(t, 960, { face: "closed", bow: 0.4 })}</>, 0.5, 700)) },
  { c: "Akşam karanlığında harem", tone: "night", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], koridor(t, <>{[0, 1].map((i) => kadin(t, 700 + i * 420, i, { face: "worried", talk: i, look: i ? -0.5 : 0.5 }))}</>, 1, ramp(t, a, b) * 300)) },
  { c: "Padişah bu gece gidecek", r: (t, a, b) => again("Akşam karanlığında harem", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 1.4} text="NEREYE?" y={820} size={120} /> },
  { c: "Ve sonra o soru geliyor", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], daire(t, <>{dil(t, 960, { face: "worried" })}</>, 1)) },
  { c: "Onunla kim gidecek", tone: "night", r: (t, a, b) => again("Ve sonra o soru geliyor", t, a, b, 0),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="ONUNLA KİM GİDECEK?" y={820} size={100} accent={H.red} /> },
  { c: "Eşleri gidecek", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], daire(t, <>{sal(t, 700, { face: "worried" })}{ayse(t, 1050, { face: "worried", look: -0.3 }, 0.95)}{musf(t, 1350, { face: "sad" })}</>, 1)) },
  { c: "Padişahın kızı Şadiye Sultan", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="ŞADİYE SULTAN" sub="Padişahın kızı · Hatıratı" c={H.purple} /> },
  { c: "Kendi arzularıyla gelen dört kız", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 620], daire(t, <>{[0, 1, 2, 3].map((i) => kadin(t, 420 + i * 360, i + 1, { face: "normal", bow: 0.2 }, 0.95))}</>, 1)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="“KENDİ ARZULARIYLA”" y={70} size={96} accent={H.gold} /> },
  { c: "Yani kimse onları zorlamadı", r: (t, a, b) => again("Kendi arzularıyla gelen dört kız", t, a, b, 1), html: (t, a, b) => htmlOf("Kendi arzularıyla gelen dört kız", t, b) },
  { c: "Şimdi sen o odadasın", tone: "night", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 620], daire(t, <>{sal(t, 560, { face: "worried", bow: 0.5, hands: "tray" })}{abid(t, 960, { sit: true, face: "closed" })}{dil(t, 1180, { face: "worried", look: -0.4 })}{kalfa(t, 1560, { look: -0.6 })}</>, 1)) },
  { c: "Kim geliyor", sfx: "ding", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [1560, 560], daire(t, <>{kalfa(t, 1560, { talk: 1, look: -0.6 })}</>, 1)),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="“KİM GELİYOR?”" y={820} size={110} /> },
  { c: "Kalırsan, belki birkaç hafta", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={600} y={440} r={230} k={ramp(t, a + 0.3, a + 0.8)} c={H.green} label="KALIRSAN: BABAN" /><Disc x={1320} y={440} r={230} k={ramp(t, b - 0.6, b)} c={H.red} label="GİDERSEN: ?" /></>) },
  { c: "Gidersen, nereye gittiğini", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={600} y={440} r={230} k={1} c={H.green} label="KALIRSAN: BABAN" /><Disc x={1320} y={440} r={230} k={ramp(t, a, a + 0.4)} c={H.red} label="GİDERSEN: ?" /></>) },
  { c: "Lalegül sana bakıyor", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [1100, 560], daire(t, <>{lale(t, 1100, { face: "sad", look: -0.6 })}</>, 1)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="GİTME" y={820} size={110} /> },
  { c: "Sen uyuyan çocuğa bakıyorsun", tone: "night", r: (t, a, b) => C(t, a, b, [1.9, 2.1], [960, 760], daire(t, <>{abid(t, 960, { sit: true, face: "closed" })}</>, 1)) },
  { c: "Ve elini kaldırıyorsun", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [960, 560], daire(t, <>{dil(t, 960, { face: "closed", reach: ramp(t, a + 0.3, a + 1.2), reachDir: 1 })}</>, 1)) },
  { c: "Ben geliyorum", tone: "gold", r: (t, a, b) => C(t, a, b, [2.3, 2.5], [960, 560], daire(t, <>{dil(t, 960, { face: "normal", reach: 1, talk: 1 })}</>, 1)),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="“BEN GELİYORUM.”" y={820} size={120} accent={H.gold} /> },
  { c: "Lalegül ağlıyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 600], daire(t, <>{dil(t, 880, { face: "closed", look: 0.6, reach: 0.6 })}{lale(t, 1060, { face: "sad", look: -0.6, bow: 0.4 })}</>, 1)) },
  { c: "Yastığının altından tahta kuşu", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 560], kapali(t, <TahtaKus x={960} y={lerp(560, 760, ramp(t, a + 1, b))} s={1.8} t={t} glow={0.5} />, "#1A1424")) },
  { c: "Ve o an bilmiyorsun ki", sfx: "drone", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.3], [960, 600], koy(t, <>{baba(t, 1000, { look: -0.3, sad: 0.3 })}</>, 900)) },

  // ── ARABA ──
  { c: "Gece yarısına doğru arabalar", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], bahce(t, <>{[0, 1, 2].map((i) => <Fener key={i} x={400 + i * 560} y={480} t={t} seed={i} />)}</>, 800, 1)) },
  { c: "Saliha Naciye Hanım'ın arabasının kapısı", sfx: "knock", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 540], <ArabaIc t={t} rattle={1} />) },
  { c: "Araba hızla Yıldız'ın yokuşundan", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 540], <ArabaIc t={t} rattle={1.4} />) },
  { c: "Padişahın kızı Ayşe Sultan", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="AYŞE SULTAN" sub="Padişahın kızı · “Babam Sultan Abdülhamid”" c="#5A4A7A" /> },
  { c: "Saliha Naciye Hanım bütün yol boyunca", tone: "night", r: (t, a, b) => C(t, a, b, [1.7, 2], [1200, 620], <ArabaIc t={t} rattle={1} close={ramp(t, a, b) * 0.5} />) },
  { c: "Sen karşısında oturuyorsun", tone: "night", r: (t, a, b) => C(t, a, b, [2.1, 2.3], [960, 560], kapali(t, <>{dilDis(t, 960, { sit: true, y: 1100, face: "worried", look: 0.5 })}</>, "#1E1418")) },
  { c: "Onun parmaklarının morardığını", tone: "night", r: (t, a, b) => C(t, a, b, [2, 2.3], [1200, 620], <ArabaIc t={t} rattle={1} close={1} />) },
  { c: "Sirkeci'de özel bir vagon", tone: "night", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 620], gar(t, null, { pan: 200 + ramp(t, a, b) * 100 })) },
  { c: "McCullagh'ın kaydına göre, tren", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2.1], [1520, 240], gar(t)),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="McCULLAGH · HAREKET 02:45" c={H.green} /> },
  { c: "Hiçbir veda yok", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 640], gar(t, null, { pan: 300 })) },
  { c: "Peronda sadece iki subay", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 620], gar(t, <>{fethi(t, 760, { look: 0.3 })}{fethi(t, 1160, { look: -0.3, seed: 9 } as PO)}</>, { pan: 300 })) },
  { c: "Tren karanlığa doğru kayıp", sfx: "whoosh", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 600], <TrenGece t={t} speed={0.6 + ramp(t, a, b)} />) },
  { c: "Ve sen pencereden İstanbul'un", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 560], komp(t, <>{dilDis(t, 600, { sit: true, y: 920, look: 0.8, face: "sad" })}</>, { lamp: 0.6 })) },
  { c: "Yolculuk yaklaşık yirmi saat", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 560], <TrenGece t={t} speed={1.2} dawn={ramp(t, a, b) * 0.7} />),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="~20 SAAT" y={70} size={110} /> },
  { c: "Kompartıman karanlık ve soğuk", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 620], komp(t, <>{salDis(t, 460, { sit: true, y: 920, face: "closed", hands: "baby" })}{dilDis(t, 760, { sit: true, y: 920, face: "worried", look: 0.4 })}{ah(t, 1460, { sit: true, y: 920, face: "sad", look: -0.2 })}</>, { lamp: 0.5 })) },
  { c: "Padişah sadece bir bardak su", tone: "night", r: (t, a, b) => C(t, a, b, [2.1, 2.3], [1460, 600], komp(t, <>{ah(t, 1460, { sit: true, y: 920, face: "sad", talk: 0.6, look: -0.3 })}</>, { lamp: 0.5 })),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="“SADE SU.”" y={820} size={100} /> },
  { c: "Abid uyanıyor", tone: "night", r: (t, a, b) => C(t, a, b, [2.1, 2.3], [460, 640], komp(t, <>{salDis(t, 460, { sit: true, y: 920, face: "worried", hands: "baby", bow: 0.3 })}</>, { lamp: 0.5 })) },
  { c: "Şadiye Sultan'ın yazdığına göre, annesi", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [560, 640], komp(t, <>{salDis(t, 460, { sit: true, y: 920, face: "sad", hands: "baby", bow: 0.5 })}{dilDis(t, 760, { sit: true, y: 920, look: -0.6, face: "worried" })}</>, { lamp: 0.5 })),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="ŞADİYE SULTAN'IN HATIRATI" c={H.purple} /> },
  { c: "Ağladıkça, birkaç damla daha", r: (t, a, b) => again("Abid uyanıyor", t, a, b, 1) },
  { c: "Dedeağaç'ta tren duruyor", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], <IkiTren t={t} part={0} />),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="DEDEAĞAÇ · ŞAFAK" c={H.cobalt} /> },
  { c: "Ve burada, tarihin en garip", sfx: "drone", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 640], <IkiTren t={t} part={0} />) },
  { c: "McCullagh'ın yazdığına göre, hemen yandaki", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [800, 620], <IkiTren t={t} part={0} />) },
  { c: "İki tren, sadece birkaç adım", tone: "cool", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 600], <IkiTren t={t} part={0} />),
    html: (t, a) => <Txt t={t} at={a + 0.8} text="BİRKAÇ ADIM" y={70} size={100} /> },
  { c: "Ama ne padişah onların", tone: "night", r: (t, a, b) => C(t, a, b, [2.1, 2.3], [1460, 600], komp(t, <>{ah(t, 1460, { sit: true, y: 920, face: "closed" })}</>, { lamp: 0.4, day: 0.4 })) },
  { c: "Sonra iki tren ayrı yönlere", sfx: "whoosh", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 600], <IkiTren t={t} part={ramp(t, a + 0.3, b)} />) },
  { c: "Bu tür, belgelere dayanan", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 560], <TrenGece t={t} speed={1} dawn={0.4} />), html: (t, a) => <Abone t={t} at={a + 0.4} /> },
  { c: "Çünkü asıl hikâye, trenden", r: (t, a, b) => again("Bu tür, belgelere dayanan", t, a, b, 0), html: (t, a, b) => htmlOf("Bu tür, belgelere dayanan", t, b) },

  // ── VARIŞ ──
  { c: "Ertesi gece, saat ona doğru", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.12], [960, 560], kir(t, null, { pan: ramp(t, a, b) * 100 })),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="SELANİK · GECE ~22:00" y={70} size={90} /> },
  { c: "Ama bir istasyonda değil", tone: "night", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 560], kir(t, null, { pan: 100 })) },
  { c: "Dışarısı zifiri karanlık", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [900, 560], kir(t, null, { pan: 200 })) },
  { c: "Basamak yere çok yüksek", tone: "night", r: (t, a, b) => C(t, a, b, [2, 2.2], [640, 620], kir(t, null, { pan: 200, lanterns: 0.6 })) },
  { c: "Ve sen, yeryüzünün en güçlü", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [700, 560], kir(t, <>{ah(t, 700, { face: "sad", look: 0.2 }, 1.05)}</>, { pan: 200 })) },
  { c: "Trende genç bir Fransız kondüktör", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [1000, 580], kir(t, <>{moris(t, 1000, { look: -0.3, face: "normal" })}</>, { pan: 200 })),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="MÖSYÖ MORİS" sub="Fransız kondüktör" c="#22304E" /> },
  { c: "Ayşe Sultan'ın hatıratına göre, babası", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [860, 600], kir(t, <>{ah(t, 700, { face: "worried", look: 0.5 }, 1.05)}{moris(t, 1020, { look: -0.6 })}</>, { pan: 200 })) },
  { c: "Oğlum gel, beni tut", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 560], kir(t, null, { pan: 200, lanterns: 0.5 })),
    html: (t, a) => <Belge t={t} at={a + 0.1} date="Selanik, 28 Nisan 1909" src="Ayşe Osmanoğlu, Babam Sultan Abdülhamid">“Oğlum gel, beni tut, <b>rica ederim.</b>”</Belge> },
  { c: "Ve Moris iki elinden", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.6], [860, 620], kir(t, <>{ah(t, lerp(700, 780, ramp(t, a, b)), { face: "closed", bow: 0.3 }, 1.05)}{moris(t, 1000, { reach: 1, reachDir: -1, look: -0.6 })}</>, { pan: 200 })) },
  { c: "Sonra sırayla hepinizi", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.6], [860, 620], kir(t, <>{dilDis(t, lerp(700, 800, ramp(t, a, b)), { face: "worried", look: 0.5 })}{moris(t, 1040, { reach: 1, reachDir: -1, look: -0.6 })}</>, { pan: 200 })) },
  { c: "Dizlerinize kadar çıkan otların", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 640], kir(t, <>{[0, 1, 2].map((i) => { const w = yur(t, a, b, 300 + i * 260, 1100 + i * 260, 1); return i === 1 ? <g key={i}>{dilDis(t, w.x, { walk: w.walk, face: "worried", hands: "tray" })}</g> : <g key={i}>{salDis(t, w.x, { walk: w.walk, face: "closed", hands: i === 0 ? "baby" : "fold" })}</g>; })}</>, { pan: 300 + ramp(t, a, b) * 200, train: false })) },
  { c: "Bir yerde ayağın kayıyor", sfx: "whoosh", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 600], kir(t, <>{dilDis(t, 880, { face: "shock", bow: 0.4 })}{asker(t, 1120, 0, { reach: 0.9, reachDir: -1, look: 0.4 })}</>, { pan: 500, train: false })) },
  { c: "Arabalara biniyorsunuz", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], kir(t, null, { pan: 600 + ramp(t, a, b) * 200, train: false })) },
  { c: "Yarım saat sonra", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.1], [960, 540], kosk(t, null, { pan: 0 })) },
  { c: "Bahçesindeki bütün havagazı", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [760, 640], kosk(t)) },
  { c: "Alatini Köşkü", sfx: "ding", tone: "night", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 520], kosk(t)),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="ALATİNİ KÖŞKÜ · SELANİK" y={70} size={90} accent={H.gold} /> },
  { c: "Selanik'te un fabrikaları", r: (t, a, b) => again("Alatini Köşkü", t, a, b, 1),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="ALATİNİ AİLESİ · UN FABRİKALARI" c={H.green} /> },
  { c: "Kapının önündeki taş merdivende", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], kosk(t, <>{fethi(t, 960, { look: 0.1 })}</>, { gate: 1 })),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="FETHİ BEY" sub="Muhafız subay · Kibar, sessiz" c="#4E5236" /> },
  { c: "Padişah önde, siz arkada", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], kosk(t, <>{(() => { const w = yur(t, a, b, 300, 900, 1.05); return ah(t, w.x + 300, { walk: w.walk, bow: 0.2 }, 1.05); })()}{(() => { const w = yur(t, a, b, 0, 640, 1); return dilDis(t, w.x, { walk: w.walk, face: "worried" }); })()}</>, { gate: 1 })) },
  { c: "Ve arkanızdan kapılar kapanıyor", sfx: "knock", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [960, 620], kosk(t, null, { gate: 1 - ramp(t, a + 0.4, a + 1.4) })) },
  { c: "O sesi hiç unutmayacaksın", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 540], <Kepenk t={t} k={1} />) },

  // ── BELGE 1 ──
  { c: "Şimdi, bu belgeyi dinle", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="BELGE" y={430} size={140} accent={H.red} /> },
  { c: "Ayşe Sultan, o geceyi", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="AYŞE SULTAN · ~45 YIL SONRA" c="#5A4A7A" /> },
  { c: "Pencereler koca tahta kepenklerle", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 540], <Kepenk t={t} k={1} />),
    html: (t, a) => <Belge t={t} at={a + 0.1} date="Selanik, Alatini Köşkü · 1909" src="Ayşe Osmanoğlu, Babam Sultan Abdülhamid">Pencereler koca tahta kepenklerle kapanmıştı. Hariçle alâkamız nihayet bulmuştu. <b>Biz burada yaşayacak, belki de ölecektik.</b></Belge> },
  { c: "Yani: dış dünyayla", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 540], <Kepenk t={t} k={1} />),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="DIŞ DÜNYA = YOK" y={820} size={100} /> },

  // ── İLK GECE ──
  { c: "Koca salonun ortasındasınız", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], salon(t, <>{[0, 1, 2].map((i) => kadin(t, 640 + i * 320, i, { face: "worried", look: 0.2 }, 0.95))}</>)) },
  { c: "Bir yemek masası", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [960, 760], salon(t)) },
  { c: "Padişah koltuklardan birine oturuyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [420, 640], salon(t, <>{ah(t, 400, { sit: true, y: 960, face: "sad", look: 0.3 })}</>)) },
  { c: "Kızları ve eşleri iki koltuğu", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 700], salon(t, <>{ayse(t, lerp(500, 800, ramp(t, a, b)), { walk: proWalk(t, a, b, 500, 800, 1).walk, reach: 0.7 })}{sal(t, lerp(1420, 1120, ramp(t, a, b)), { walk: proWalk(t, a, b, 1420, 1120, 1).walk, reach: 0.7, reachDir: -1 })}</>, { together: ramp(t, a + 0.3, b - 0.3) })) },
  { c: "Sen su arıyorsun", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 620], salon(t, <>{(() => { const w = yur(t, a, b, 300, 1300, 1.05); return dilDis(t, w.x, { walk: w.walk, face: "worried", look: 0.5 }); })()}</>, { together: 1 })) },
  { c: "Su yok", sfx: "ding", tone: "night", r: (t, a, b) => C(t, a, b, [2.1, 2.3], [960, 560], salon(t, <>{dilDis(t, 960, { face: "worried", look: 0.2 })}</>, { together: 1, gas: 0.4 })),
    html: (t, a) => <Txt t={t} at={a + 0.1} text="SU YOK · SABUN YOK · MUM YOK" y={820} size={80} accent={H.red} /> },
  { c: "Kapıya vuruyorsunuz", sfx: "knock", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], kosk(t, <>{fethi(t, 1300, { look: -0.6, face: "worried" })}</>, { gate: 0.3 })) },
  { c: "Biraz sonra kovalarla su", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [960, 700], salon(t, null, { together: 1, candle: ramp(t, a + 0.5, a + 1.5) })) },
  { c: "Sonra yemek geliyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 560], <Dondurma t={t} finger={0} />) },
  { c: "Ama kaşık yok", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 680], <Dondurma t={t} finger={0} />),
    html: (t, a) => <Txt t={t} at={a + 0.1} text="KAŞIK YOK · ÇATAL YOK · BARDAK YOK" y={70} size={74} /> },
  { c: "Ve İstanbul'dan beri ağzına", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.6], [980, 640], <Dondurma t={t} finger={ramp(t, a + 1, b)} />) },
  { c: "Ayşe Sultan bu anı da yazmış", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 640], salon(t, <>{[0, 1, 2].map((i) => kadin(t, 640 + i * 320, i, { face: "smile", sit: true, y: 960 }, 0.95))}</>, { together: 1, candle: 1 })),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“GENÇLİK BU… BU HÂLİMİZE GÜLÜYORDUK.”" y={70} size={66} /> },
  { c: "Sen de gülüyorsun", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 560], salon(t, <>{dilDis(t, 960, { face: "smile" })}</>, { together: 1, candle: 1 })) },
  { c: "Kızlardan biri gömleğini", tone: "warm", r: (t, a, b) => C(t, a, b, [1.7, 1.9], [1000, 620], salon(t, <>{lale(t, 1000, { face: "smile", reach: 0.6 }, 1.0)}</>, { together: 1, candle: 1 })),
    html: (t, a) => <Tag t={t} at={a + 1.4} text="GÖMLEK = HAVLU" c={H.cobalt} /> },
  { c: "Sonra elinize birer mum alıp", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], salon(t, <>{[0, 1, 2].map((i) => { const w = yur(t, a, b, 1500 - i * 160, 300 - i * 160, 1); return <g key={i}>{kadin(t, w.x, i, { walk: w.walk, hands: "tray" }, 0.95)}<circle cx={w.x} cy={Y - 330} r={120} fill="url(#pPool)" opacity={0.6} /></g>; })}</>, { together: 1, gas: 0 })) },
  { c: "Bir odada demir bir karyola", tone: "night", r: (t, a, b) => again("Sonra elinize birer mum alıp", t, a, b, 1),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="DEMİR KARYOLA → PADİŞAHIN ODASI" c={H.purple} /> },
  { c: "Fethi Bey bir otelden yorganlar", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 700], salon(t, <>{fethi(t, 1500, { look: -0.4, face: "sad" })}</>, { together: 1, beds: ramp(t, a + 0.5, a + 1.5), candle: 0.6 })) },
  { c: "En temizi padişaha", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [1320, 900], salon(t, null, { together: 1, beds: 1, candle: 0.6 })) },
  { c: "Evin içinde tek bir halı", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [960, 880], salon(t, null, { together: 1, beds: 0, gas: 0.2 })),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="HALI YOK · KİLİM YOK" y={70} size={90} /> },
  { c: "Ve o gece, hepiniz yorganlara", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 700], salon(t, null, { together: 1, beds: 1, gas: 0, candle: 0.3 })) },
  { c: "Her pencerenin önünde biri", r: (t, a, b) => again("Ve o gece, hepiniz yorganlara", t, a, b, 1) },
  { c: "Sen Abid'in yattığı sandalyenin", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 640], salon(t, <>{abid(t, 1060, { sit: true, y: 900, face: "closed" })}{dilDis(t, 820, { sit: true, y: 1060, face: "closed", look: 0.5 })}</>, { together: 1, beds: 1, gas: 0, candle: 0.3 })) },
  { c: "Şadiye Sultan bir şey daha yazmış", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [1000, 640], salon(t, <>{abid(t, 1060, { sit: true, y: 900, face: "closed" })}{fethi(t, 1300, { bow: ramp(t, a + 1, b) * 0.8, look: -0.6, face: "sad" })}</>, { together: 1, beds: 1, gas: 0, candle: 0.4 })) },
  { c: "Zavallı yavrucak", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [1300, 560], salon(t, <>{fethi(t, 1300, { bow: 0.8, face: "sad", talk: 0.6, look: -0.6 })}</>, { together: 1, beds: 1, gas: 0, candle: 0.4 })),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="“ZAVALLI YAVRUCAK.”" y={820} size={110} /> },
  { c: "Ve gözünden bir damla yaş", sfx: "ding", r: (t, a, b) => again("Zavallı yavrucak", t, a, b, 1) },
  { c: "Sen karanlıkta bohçanı açıyorsun", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.5], [960, 560], kus(t, a, ramp(t, a + 1, b) * 0.9, "#12101A")) },
  { c: "Baba, diyorsun içinden", tone: "night", r: (t, a, b) => C(t, a, b, [2.3, 2.5], [960, 560], salon(t, <>{dilDis(t, 960, { face: "closed", bow: 0.3 })}</>, { together: 1, gas: 0, candle: 0.3 })),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“BABA, BEN BURADAYIM.”" y={820} size={100} /> },
  { c: "Ama baban nerede olduğunu", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [760, 600], atolye(t, <>{baba(t, 760, { look: 0.4, sad: 0.6 })}</>, 0.8)) },

  // ── KÖŞKTE GÜNLER ──
  { c: "Köşkte günler birbirine", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.12], [960, 540], kosk(t, null, { night: 0, shut: 1, pan: ramp(t, a, b) * 120 })) },
  { c: "Sabah ezanı denizden", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 560], salon(t, null, { night: 0, slits: 1, gas: 0, together: 1 })) },
  { c: "Gazete yok", sfx: "ding", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 540], kapali(t, <Gazete t={t} k={1 - ramp(t, a + 0.8, a + 1.6)} head="TANİN · SELANİK" />, "#3A2A20")),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="GAZETE YOK" y={820} size={110} /> },
  { c: "Abdülhamid sonradan hatıralarında", tone: "cool", r: (t, a, b) => C(t, a, b, [1.8, 2], [420, 600], salon(t, <>{ah(t, 400, { sit: true, y: 960, face: "sad" })}</>, { night: 0, slits: 1, gas: 0, together: 0 })) },
  { c: "Ziyaretçi yok", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [700, 640], kosk(t, <>{asker(t, 340, 0)}{asker(t, 1600, 1)}</>, { night: 0, shut: 1 })),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="ZİYARETÇİ YOK" y={70} size={100} /> },
  { c: "Padişah günde en fazla beş saat", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [700, 640], salon(t, <>{ah(t, 700, { sit: true, y: 960, face: "closed" })}</>, { night: 0.4, slits: 0.6, together: 0 })),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="GÜNDE EN FAZLA 5 SAAT UYKU" c="#24242E" /> },
  { c: "Gündüzleri birine roman okutuyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [800, 640], salon(t, <>{ah(t, 600, { sit: true, y: 960, face: "normal", look: 0.5 })}{ayse(t, 1000, { talk: 1, look: -0.4, hands: "tray" })}</>, { night: 0, slits: 1, together: 0 })) },
  { c: "Ve elinde yine o tahta", tone: "warm", r: (t, a, b) => C(t, a, b, [1.25, 1.4], [800, 600], atolye(t, <>{ah(t, 760, { look: 0.4, reach: 0.7, bow: 0.4 })}</>)),
    html: (t, a) => <Tag t={t} at={a + 1.2} text="KÖŞKÜN MARANGOZHANESİ" c="#5E3B20" /> },
  { c: "Sen her sabah o odanın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], <Talas t={t} hand={0} />) },
  { c: "Bir sabah, bir talaşı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [1100, 560], <Talas t={t} hand={ramp(t, a + 0.3, a + 1.6)} />) },
  { c: "Baban kokuyor", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [760, 560], atolye(t, <>{baba(t, 760, { look: 0.3 })}<TahtaKus x={1000} y={680} s={0.6} t={t} glow={0.6} /></>, 0.5)) },

  // ── MEKTUP ──
  { c: "Ve sonra, yaz sonunda", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 540], <SurgunMektup t={t} k={ramp(t, a + 0.2, b)} />) },
  { c: "Lalegül'den", tone: "warm", r: (t, a, b) => again("Ve sonra, yaz sonunda", t, a, b, 1),
    html: (t, a) => <Tag t={t} at={a + 0.2} text="LALEGÜL'DEN · İSTANBUL" c="#8A4A3A" /> },
  { c: "Titreyen ellerle okuyorsun", tone: "warm", r: (t, a, b) => C(t, a, b, [2.1, 2.3], [960, 560], salon(t, <>{dil(t, 960, { face: "worried", hands: "tray", bow: 0.4 })}</>, { night: 0, slits: 1, together: 1 })) },
  { c: "Bu mektuptaki olay gerçek", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="GERÇEK · McCULLAGH, s. 276–278" c={H.green} /> },
  { c: "Siz trene bindikten sonra", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], koridor(t, <>{[0, 1, 2, 3, 4].map((i) => { const w = yur(t, a, b, 1800 + i * 200, 200 + i * 200, 0.95); return kadin(t, w.x, i, { walk: w.walk, face: "worried" }, 0.92); })}</>, 0, ramp(t, a, b) * 300)),
    html: (t, a) => <Tag t={t} at={a + 1.2} text="31 ARABA · YILDIZ → TOPKAPI" c={H.cobalt} /> },
  { c: "Sonra hükümet, Anadolu'daki", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 540], kapali(t, <Gazete t={t} k={ramp(t, a + 0.1, a + 0.8)} head="ÇERKEZ KÖYLERİNE TELGRAF" />, "#3A2A20")) },
  { c: "Belirli bir günde", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], topk(t, babalar(t, a, b), ramp(t, a, b) * 200)) },
  { c: "Uzun bir salona alındılar", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], topk(t, <>{[0, 1, 2, 3, 4, 5].map((i) => kadin(t, 200 + i * 300, i, { face: "normal", look: -0.3 }, 0.9))}</>, 600 + ramp(t, a, b) * 300)) },
  { c: "Ve o gün kadınlara", tone: "gold", r: (t, a, b) => C(t, a, b, [1.7, 1.9], [960, 580], topk(t, <>{kadin(t, 960, 2, { face: "smile", look: -0.4 })}</>, 800)),
    html: (t, a) => <Tag t={t} at={a + 1} text="YÜZLERİNİ AÇMA İZNİ" c={H.gold} /> },
  { c: "McCullagh'ın yazdığına göre, kızlar", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], topk(t, <>{baba(t, 1100, { reach: ramp(t, a + 0.3, a + 1.2), look: -0.5 }, 1.0)}{(() => { const w = yur(t, a, b, 600, 860, 1); return kadin(t, w.x, 1, { walk: w.walk, face: "smile", reach: ramp(t, a + 0.8, a + 1.6) }); })()}</>, 900)) },
  { c: "Bazı akrabalar birbirini", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], topk(t, <>{baba(t, 700, { look: 0.5 }, 0.95)}{kadin(t, 920, 3, { face: "worried", look: -0.5, talk: 1 })}<CerkezBaba x={1350} y={Y} s={0.95} t={t} seed={81} coat="#3A3A2A" beard="#3A2A1E" look={0.4} />{kadin(t, 1560, 4, { face: "smile", look: -0.5 })}</>, 1000)) },
  { c: "O gün iki yüz on üç kadın", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="213 KADIN EVİNE DÖNDÜ" y={430} size={110} accent={H.green} /> },
  { c: "Lalegül de onlardan biri", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], topk(t, <>{baba(t, 1120, { look: -0.5, reach: 0.8 }, 1.0)}{lale(t, 880, { face: "smile", look: 0.6, reach: 0.8 })}</>, 1100)) },
  { c: "Ve mektubun son satırında", sfx: "drone", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.5], [960, 640], <SurgunMektup t={t} k={1} />) },
  { c: "Gunda, senin baban da geldi", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.6], [960, 760], <SurgunMektup t={t} k={1} line="Gunda, senin baban da geldi." hl={ramp(t, a, a + 0.8)} />) },
  { c: "Durup okuyorsun", tone: "warm", r: (t, a, b) => C(t, a, b, [2.3, 2.5], [960, 560], salon(t, <>{dil(t, 960, { face: "shock", hands: "tray", bow: 0.3 })}</>, { night: 0, slits: 1, together: 1 })) },
  { c: "Senin baban da geldi. Salonda", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 600], topk(t, <>{baba(t, lerp(200, 1400, ramp(t, a, b)), { walk: ramp(t, a, b) * 7, look: -0.6 })}{[0, 1, 2, 3].map((i) => kadin(t, 400 + i * 380, i, { face: "normal", look: 0.4 }, 0.92))}</>, ramp(t, a, b) * 400)) },
  { c: "Seni sordu", tone: "gold", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 560], topk(t, <>{baba(t, 960, { look: -0.4, sad: 0.4 })}</>, 700)),
    html: (t, a) => <Txt t={t} at={a + 0.8} text="“GUNDA?”" y={820} size={120} /> },
  { c: "Ama orada kimse bu ismi", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={600} y={440} r={220} k={ramp(t, a + 0.3, a + 0.7)} c={H.green} label="GUNDA" /><Disc x={1320} y={440} r={220} k={ramp(t, a + 1.6, a + 2)} c="#3E5E86" label="DİLNİŞİN" /></>) },
  { c: "Ve baban, akşam olunca", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], kir(t, <>{baba(t, lerp(1300, 600, ramp(t, a, b)), { walk: ramp(t, a, b) * 5, sad: 1, look: -0.4 })}</>, { pan: 800, train: false, lanterns: 0 })) },
  { c: "McCullagh bunu da yazmış", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="BAZI ADAMLAR ARADIKLARI YÜZÜ BULAMADI" y={430} size={76} /> },
  { c: "Sen o gece köşkün penceresinin", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [400, 620], salon(t, <>{dil(t, 420, { sit: true, y: 1000, face: "sad", look: -0.6 })}</>, { night: 1, slits: 0.5, gas: 0, together: 1 })) },
  { c: "Bir seçim yaptın", tone: "night", r: (t, a, b) => C(t, a, b, [2.3, 2.5], [420, 580], salon(t, <>{dil(t, 420, { sit: true, y: 1000, face: "closed" })}</>, { night: 1, slits: 0.5, gas: 0, together: 1 })) },
  { c: "Peki şimdi ne olacak", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.2], [960, 520], kosk(t, null, { shut: 1 })),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="BU KAPI AÇILACAK MI?" y={820} size={96} /> },

  // ── YILLAR ──
  { c: "Mevsimler geçiyor", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.12], [960, 540], kosk(t, null, { night: ramp(t, a, b) > 0.5 ? 1 : 0, shut: 1, pan: ramp(t, a, b) * 200 })) },
  { c: "Ayşe Sultan dokuz ay sonra", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], kosk(t, <>{(() => { const w = yur(t, a, b, 960, 1700, 1); return ayse(t, w.x, { walk: w.walk, look: -0.4 }); })()}</>, { night: 0, shut: 1, gate: 1 })),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="9 AY SONRA · İSTANBUL'A DÖNÜŞ" c="#5A4A7A" /> },
  { c: "Abid büyüyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [960, 680], salon(t, <>{dil(t, 760, { look: 0.5, face: "smile" })}{(() => { const w = yur(t, a, b, 1500, 1060, 0.68); return abid(t, w.x, { walk: w.walk, face: "smile" }, 0.68); })()}</>, { night: 0, slits: 1, together: 1 })) },
  { c: "Ama hâlâ, bazı geceler", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2], [900, 640], salon(t, <>{dil(t, 820, { sit: true, y: 1000, face: "closed", talk: 0.5 })}{abid(t, 1040, { sit: true, y: 1000, face: "closed" }, 0.68)}</>, { night: 1, gas: 0, candle: 0.5, together: 1 })),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="“UYU.”" y={820} size={120} /> },
  { c: "Bir yıl. İki yıl", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a, b) => <Txt t={t} at={a + 0.1} text={["1 YIL", "2 YIL", "3 YIL"][Math.min(2, Math.floor(ramp(t, a, b) * 3))]} y={430} size={160} /> },
  { c: "Bin dokuz yüz on iki sonbaharı", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.12], [960, 540], kosk(t, null, { night: 0, shut: 1 })),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="1912 SONBAHARI" y={70} size={100} /> },
  { c: "Sekiz Ekim'de Balkan", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 540], kapali(t, <Gazete t={t} k={ramp(t, a + 0.1, a + 0.8)} head="BALKAN HARBİ BAŞLADI" />, "#3A2A20")),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="8 EKİM 1912 · BALKAN SAVAŞI" c={H.red} /> },
  { c: "Selanik'in sokaklarında askerler", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 620], sokak(t, <>{[0, 1, 2, 3].map((i) => { const w = yur(t, a, b, 1900 + i * 220, 100 + i * 220, 1.3); return asker(t, w.x, i, { walk: w.walk, face: "worried" }); })}</>, { pan: 200, dusk: 0.3 })) },
  { c: "Ve herkes aynı şeyi düşünüyor", tone: "cool", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [700, 560], salon(t, <>{ah(t, 700, { face: "worried", look: 0.4 })}</>, { night: 0.3, slits: 0.8, together: 0 })) },
  { c: "İstanbul'dan bir karar geliyor", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 540], kapali(t, <Gazete t={t} k={1} head="ABDÜLHAMİD İSTANBUL'A" />, "#3A2A20")) },
  { c: "Ama nasıl", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 640], <Loreley t={t} night={0} mines={1} pan={-1200} />),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="YOLLAR KESİK · DENİZDE YUNAN GEMİLERİ" y={70} size={70} /> },
  { c: "Cevap, bir Alman savaş gemisi", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], <Loreley t={t} night={0} pan={lerp(-300, 200, ramp(t, a, b))} />),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="SMS LORELEY" y={820} size={120} accent={H.cobalt} /> },
  { c: "Bu gemi komutanlığının raporu", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="LORELEY KOMUTANLIK RAPORU · ARŞİV" c={H.cobalt} /> },
  { c: "Yol boyunca askerler kordon", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], sokak(t, <>{[0, 1, 2, 3].map((i) => asker(t, 300 + i * 440, i, { look: 0 }))}{(() => { const w = yur(t, a, b, -200, 1300, 0.9); return ah(t, w.x, { walk: w.walk, bow: 0.2 }, 0.95); })()}</>, { pan: 500 + ramp(t, a, b) * 200 })) },
  { c: "Herkes, üç yıldır görmediği", r: (t, a, b) => again("Yol boyunca askerler kordon", t, a, b, 1) },
  { c: "Ve rapordaki o satır", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />) },
  { c: "Abdülhamid, on iki kadın", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Loreley t={t} night={0} pan={0} close={0.3} />),
    html: (t, a) => <Belge t={t} at={a + 0.1} date="Selanik, Kasım 1912" src="SMS Loreley komutanlık raporu">Abdülhamid, <b>on iki kadın</b> ve yedi yaşındaki oğlu Abid Efendi ile gemiye yerleşti.</Belge> },
  { c: "On iki kadın", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.1} text="12 KADIN" y={430} size={170} accent={H.red} /> },
  { c: "Sen onlardan birisin", tone: "cool", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 560], kapali(t, <>{dilDis(t, 960, { face: "normal", look: 0.2 })}</>, "#2A3048")) },
  { c: "Aynı rapor bir şey daha", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], sokak(t, <>{[0, 1, 2].map((i) => { const w = yur(t, a, b, 2000 + i * 200, 900 + i * 200, 1); return asker(t, w.x, i, { walk: w.walk }); })}</>, { pan: 900, dusk: 0.5 })),
    html: (t, a, b) => <Tag t={t} at={a + (b - a) * 0.4} text="2 GÜN GECİKSE: ESİR" c={H.red} /> },
  { c: "Gemi Ege'de, mayınların", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 640], <Loreley t={t} night={1} mines={1} pan={ramp(t, a, b) * 300} />) },
  { c: "Sen güvertenin altındaki", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 640], kapali(t, <>{dilDis(t, 860, { sit: true, y: 1040, face: "worried", look: 0.5, reach: 0.4 })}{abid(t, 1080, { sit: true, y: 1040, face: "closed" }, 0.68)}</>, "#1A2034")) },
  { c: "İki Kasım, gece saat üç buçuk", sfx: "ding", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.12], [960, 540], <Beylerbeyi t={t} dawn={0} ship={ramp(t, a, b) * 0.6} />),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="2 KASIM 1912 · 03:30 · BOĞAZ" y={70} size={86} /> },
  { c: "Gemi İstanbul Boğazı'na giriyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [700, 620], <Beylerbeyi t={t} dawn={0} ship={0.6 + ramp(t, a, b) * 0.4} />) },
  { c: "Ve sen, üç buçuk yıl sonra", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 520], <Beylerbeyi t={t} dawn={0.1} pan={200} />) },
  { c: "Ama özgür değilsin", tone: "cool", r: (t, a, b) => C(t, a, b, [2.3, 2.5], [960, 560], kapali(t, <>{dilDis(t, 960, { face: "sad" })}</>, "#1A2034")) },
  { c: "Bir sandal sizi karşı kıyıya", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], <Beylerbeyi t={t} dawn={0.4} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="BEYLERBEYİ SARAYI" y={70} size={96} /> },
  { c: "Yeni bir saray", sfx: "knock", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 540], <Kepenk t={t} k={ramp(t, a + 0.3, a + 1.6)} />),
    html: (t, a) => <Txt t={t} at={a + 1.2} text="YENİ BİR KİLİT" y={820} size={100} /> },

  // ── BEYLERBEYİ ──
  { c: "Beylerbeyi'nde yıllar daha yavaş", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], <Beylerbeyi t={t} dawn={0.8} pan={ramp(t, a, b) * 200} />) },
  { c: "Dünya bir savaştan çıkıp", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], <Beylerbeyi t={t} dawn={0.6} ship={ramp(t, a, b)} />),
    html: (t, a) => <Tag t={t} at={a + 1} text="1914 · BİRİNCİ DÜNYA SAVAŞI" c={H.red} /> },
  { c: "Padişah yaşlanıyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.8, 2], [760, 580], atolye(t, <>{ah(t, 760, { face: "sad", bow: 0.4, reach: 0.4 })}</>)) },
  { c: "Ve on Şubat", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], <Beylerbeyi t={t} dawn={0} />),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="10 ŞUBAT 1918" y={70} size={100} accent={H.red} /> },
  { c: "Kaynaklara göre, son nefesini", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], daire(t, <>{musf(t, 960, { face: "sad", bow: 0.5 })}<Samdan x={1400} y={940} t={t} /></>, 1)),
    html: (t, a) => <NameCard t={t} at={a + 0.6} name="MÜŞFİKA KADIN" sub="Son eşi · Onu hiç bırakmadı" c="#2E2A3A" /> },
  { c: "Saray yasla doluyor", tone: "cool", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 620], koridor(t, <>{[0, 1, 2, 3].map((i) => kadin(t, 420 + i * 360, i, { face: "sad", bow: 0.4 }, 0.95))}</>, 0.7, 400)) },
  { c: "Peki bu kadınlar şimdi ne olacak", r: (t, a, b) => again("Saray yasla doluyor", t, a, b, 1),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="BU KADINLAR NE OLACAK?" y={70} size={90} /> },

  // ── DÖNÜŞ ──
  { c: "Sen yirmi yedi yaşındasın", tone: "warm", r: (t, a, b) => C(t, a, b, [2.1, 2.3], [960, 560], daire(t, <>{dil(t, 960, { face: "normal", look: 0.2 })}</>)),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="27 YAŞINDA" c="#3E5E86" /> },
  { c: "On yedi yıl önce", r: (t, a, b) => again("On yaşındayken", t, a, b, 2) },
  { c: "Ve şimdi, kapı açılıyor", sfx: "knock", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 540], <Kepenk t={t} k={1 - ramp(t, a + 0.3, a + 1.8)} />) },
  { c: "Bin dokuz yüz on sekiz baharında", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], koy(t, null, ramp(t, a, b) * 400)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="1918 BAHARI · ADAPAZARI" y={70} size={90} /> },
  { c: "Bohçan yine kucağında", tone: "gold", r: (t, a) => kus(t, a, 0.5, "#3A2A1E") },
  { c: "Köy küçülmüş gibi geliyor", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], koy(t, <>{dilDis(t, 860, { face: "normal", look: 0.5 })}{[0, 1].map((i) => { const w = yur(t, a, b, 1400 + i * 160, 1100 + i * 160, 0.6); return <g key={i}>{dilKoy(t, w.x, { walk: w.walk, face: "smile", look: -0.6, seed: 40 + i } as PO, 0.6)}</g>; })}</>, 600)) },
  { c: "Evinizin kapısını genç bir adam", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [960, 620], koy(t, <>{dilDis(t, 760, { face: "worried", look: 0.6 })}{kardes(t, 1080, { look: -0.6, face: "normal" })}</>, 0)) },
  { c: "Gunda", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [1080, 560], koy(t, <>{kardes(t, 1080, { look: -0.5, face: "shock", talk: 1 })}</>, 0)),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="“GUNDA?”" y={820} size={120} /> },
  { c: "Kardeşin. Sen gittiğinde", tone: "warm", r: (t, a, b) => again("Evinizin kapısını genç bir adam", t, a, b, 1),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="KARDEŞİN · GİTTİĞİNDE 4 YAŞINDAYDI" c={H.green} /> },
  { c: "Ve sana söylemesi gereken", tone: "cool", r: (t, a, b) => C(t, a, b, [2, 2.2], [1080, 560], koy(t, <>{kardes(t, 1080, { look: -0.5, face: "sad", bow: 0.3 })}</>, 0)) },
  { c: "Baban iki kış önce öldü", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [2.3, 2.5], [760, 560], koy(t, <>{dilDis(t, 760, { face: "shock" })}</>, 0)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="İKİ KIŞ ÖNCE" y={820} size={100} /> },
  { c: "Senin bacakların tutmuyor", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [800, 680], koy(t, <>{dilDis(t, 800, { sit: true, y: 1010, face: "sad", bow: 0.6 })}{kardes(t, 1120, { look: -0.6, face: "sad", bow: 0.3 })}</>, 0)) },
  { c: "Kardeşin seni içeri alıyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], atolye(t, <>{(() => { const w = yur(t, a, b, 1800, 1200, 1); return dilDis(t, w.x, { walk: w.walk, look: -0.4, face: "sad" }); })()}</>)) },
  { c: "Ve duvardaki rafı görüyorsun", sfx: "drone", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [880, 520], <KusRafi t={t} n={0} />) },
  { c: "Rafın üstünde, yan yana", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [400 + ramp(t, a, b) * 900, 480], <KusRafi t={t} n={15} />) },
  { c: "Bir. İki. Beş. On", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [800, 480], <KusRafi t={t} n={15} />),
    html: (t, a, b) => <Txt t={t} at={a} text={["BİR", "İKİ", "BEŞ", "ON"][Math.min(3, Math.floor(ramp(t, a, b) * 4))]} y={820} size={130} /> },
  { c: "Kanatları açık", tone: "gold", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [700, 480], <KusRafi t={t} n={15} />) },
  { c: "Kardeşin diyor ki", tone: "warm", r: (t, a, b) => C(t, a, b, [2, 2.2], [960, 560], atolye(t, <>{kardes(t, 960, { talk: 1, look: -0.3, face: "sad" })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="“HER YIL BİR TANE OYDU.”" y={820} size={90} /> },
  { c: "Sayıyorsun. On beş kuş", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [820, 500], <KusRafi t={t} n={15} />),
    html: (t, a) => <Txt t={t} at={a + 0.8} text="15" y={820} size={170} accent={H.gold} /> },
  { c: "On altıncısının sadece", tone: "gold", r: (t, a, b) => C(t, a, b, [2.3, 2.6], [1370, 520], <KusRafi t={t} n={16} />),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="16. KUŞ · YARIM" c="#5E3B20" /> },
  { c: "Sen bohçanı açıyorsun", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.4], [960, 560], kus(t, a, ramp(t, a, b), "#3A2A1E")) },
  { c: "Ve onu, o yarım kuşun yanına", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [1420, 500], <KusRafi t={t} n={16} extra />) },
  { c: "Tahta kuş seni geri getirdi baba", tone: "gold", r: (t, a, b) => C(t, a, b, [2.3, 2.5], [960, 560], atolye(t, <>{dilDis(t, 960, { face: "closed", bow: 0.3 })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.2} text="“TAHTA KUŞ SENİ GERİ GETİRDİ BABA.”" y={820} size={74} /> },
  { c: "Sadece biraz geç kaldı", sfx: "drone", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.1], [960, 520], <KusRafi t={t} n={16} extra light={1 - ramp(t, a, b) * 0.4} />) },

  // ── KAPANIŞ ──
  { c: "Dilnişin'in, yani Gunda'nın", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1], [960, 540], koy(t, null, 900)),
    html: (t, a, b) => <><Txt t={t} at={a + 0.3} text="HİKÂYE HAYALİ" y={70} size={80} /><Txt t={t} at={a + (b - a) * 0.5} text="ETRAFINDAKİ HER ŞEY GERÇEK" y={820} size={80} /></> },
  { c: "Yirmi yedi Nisan bin dokuz yüz dokuzda", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1], [960, 540], gar(t, null, { pan: 100 })),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="27 NİSAN 1909 · SİRKECİ → SELANİK" c={H.red} /> },
  { c: "Ayşe Sultan'ın listesine göre", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={600} y={440} r={220} k={ramp(t, a + 0.3, a + 0.7)} c={H.cobalt} label="24 KİŞİ" /><Disc x={1320} y={440} r={220} k={ramp(t, a + 2.4, a + 2.8)} c={H.gold} label="4 GÖNÜLLÜ KIZ" /></>) },
  { c: "Alatini Köşkü'nde ilk gece", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.05], [960, 600], salon(t, null, { together: 1, gas: 0.3 })) },
  { c: "Aynı günlerde İstanbul'da", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], topk(t, babalar(t, a, b), 400)) },
  { c: "Bin dokuz yüz on ikide Alman gemisi", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.05], [960, 560], <Loreley t={t} night={0} pan={ramp(t, a, b) * 200} />) },
  { c: "Peki sona kadar onunla kalan", tone: "night", r: (t, a, b) => C(t, a, b, [2, 2.2], [960, 560], daire(t, <>{musf(t, 960, { face: "sad" })}</>, 1)) },
  { c: "Bin dokuz yüz altmış bire", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Tag t={t} at={a + 0.3} text="MÜŞFİKA KADIN · 1961'E KADAR" c="#2E2A3A" /> },
  { c: "Ve tarihçi Murat Bardakçı'nın", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <SurgunMektup t={t} k={ramp(t, a, a + 2)} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="“GEÇİNEMİYORUM.”" y={70} size={110} accent={H.red} /> },
  { c: "Bir zamanlar dünyanın en büyük", tone: "cool", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 560], kapali(t, <>{musf(t, 960, { face: "sad", bow: 0.4 })}</>, "#2A2430")) },
  { c: "Şimdi sana soruyorum", sfx: "drone", r: (t, a, b) => again("Şimdi sen o odadasın", t, a, b, 0) },
  { c: "O gece, o odada", r: (t, a, b) => again("Ve elini kaldırıyorsun", t, a, b, 1),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="ELİNİ KALDIRIR MIYDIN, BABANI MI BEKLERDİN?" y={70} size={64} /> },
  { c: "Ve söyle bakalım", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={600} y={440} r={230} k={ramp(t, a + 0.6, a + 1)} c={H.gold} label="SADAKAT" /><Disc x={1320} y={440} r={230} k={ramp(t, a + 1.6, a + 2)} c={H.red} label="KAN BAĞI" /></>),
    html: (t, a) => <Txt t={t} at={a + 2.4} text="HANGİSİ DAHA AĞIR?" y={820} size={96} /> },
  { c: "Cevabını yorumlara yaz", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="CEVABIN YORUMLARDA 👇" y={420} size={100} /> },
  { c: "Eğer bu hikâye sana dokunduysa", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [1000, 520], <KusRafi t={t} n={16} extra />), html: (t, a) => <Abone t={t} at={a + 0.5} /> },
  { c: "Çünkü bir sonraki videoda", tone: "gold", r: (t, a, b) => again("Eğer bu hikâye sana dokunduysa", t, a, b, 0), html: (t, a, b) => htmlOf("Eğer bu hikâye sana dokunduysa", t, b) },
  { c: "Hoşça kal", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1], [960, 540], <Beylerbeyi t={t} dawn={0.9} />) },
];

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : s.c.startsWith("+") ? after - 0.2 + parseFloat(s.c) : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K3R_17_SECONDS));
  return raw;
})();

const VOL: Record<string, number> = { whoosh: 0.07, drone: 0.14, boom: 0.15, ding: 0.14, knock: 0.1, pop: 0.12, splash: 0.08 };
export const K3RVideo17: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K3R_17_SECONDS;
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
      <Audio src={staticFile("audio/k3r-17.wav")} />
      {TIMED.map((x, i) => i > 0 && !(x.from > END - 19 && x.sfx && x.sfx !== "whoosh") && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.08) * fps))} durationInFrames={Math.round(2.2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.from > END - 19 ? 0.05 : VOL[x.sfx ?? "whoosh"] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const AG = [[1.1, -50, -20], [1.12, 50, 15], [1.08, 0, 30]];
function again(c: string, t: number, a: number, b: number, q: number) {
  const s0 = TIMED.find((x) => x.c === c);
  if (!s0) return null;
  const [z, dx, dy] = AG[q % AG.length];
  return <g transform={`translate(${960 + dx} ${540 + dy}) scale(${z}) translate(-960 -540)`}>{s0.r(t, Math.min(s0.from, a), b)}</g>;
}
function htmlOf(c: string, t: number, b: number) {
  const s0 = TIMED.find((x) => x.c === c);
  return s0?.html ? s0.html(t, s0.from, b) : null;
}

export const _k3r17Unused = { Bebek, Fener, Bayrak };
