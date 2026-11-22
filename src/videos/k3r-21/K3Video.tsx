import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k3r-21-words.json";
import { makeCue, ramp } from "../../lib/cues";
import { H, lerp } from "../../components/Harem";
import { Abone, Belge, Disc, NameCard, Paper, Tag, Txt } from "../../components/K3Text";
import { Atmos, Fore, LiveCam, Sweep, Tone } from "../../components/Live";
import { Birds, GalleryWall, HasBahce, Laleler, Motes, NightVeil, PCam, PFig, PFrame, proWalk, ValideOda, Fincan } from "../../components/HaremPro";
import { HamamPro } from "../../components/HaremKuma";
import { SurgunMektup, TopkapiSalon } from "../../components/HaremSurgun";
import { ArsivDefter } from "../../components/HaremMendil";
import { Gul } from "../../components/HaremPrenses";
import { AyHalka, AyriOda, BeyazBohca, BugunEv, DosekYakin, DugumIp, Fisilti, KahveSerbet, Korse, Rahle, RutbeMerdiven, Sandik, Seki, SuBardak, Yatakhane, Yazma } from "../../components/HaremRegl";

// Kanal 1 · k3r-21 · "Osmanlı Hareminde Kadınlar Regl Olunca Ne Yapardı?" — HaremPro + Regl kiti (~1720, Lale Devri).
// Sen: Nevres (KURGU, adı videoda açıkça söyleniyor), 13 yaş. Şevkidil (kurgu arkadaş). Kalfa. Sonda: yeni kız.
// BELGE: TDV Hayız / İstihâze / Harem; Montagu Mektup 26 (1717); TDV Sabuncuoğlu. Kan/çıplaklık YOK.

const ALT: Record<string, string[]> = {
  "Bin yedi yüz yirmi civarı": ["1720 civarı"], "Bin yedi yüz on yedi yılı": ["1717 yılı"], "Bin dört yüz altmış beş yılı": ["1465 yılı"],
  "Montagu içeride yaklaşık iki yüz": ["Montagu içeride yaklaşık 200"], "Düğümler yirmi sekize": ["Düğümler 28'e"],
  "On üç yaşındasın": ["13 yaşındasın"], "On iki yaşında": ["12 yaşında"],
  "Tahtta Üçüncü Ahmed var": ["Tahta 3. Ahmet var", "Tahtta 3. Ahmet var"], "Ve en üstte": ["Ve en üste"],
  "Ustaların içinde bir de hazinedar usta": ["Ustaların içinde bir de"], "O bohçanın içinde ne vardı": ["O boğçanın içinde ne vardı"],
  "Kalfa ise Nevres'i oturtuyor": ["Kalfaysa nevresi oturtuyor"], "Nevres ise sarayda": ["Nevresse sarayda"],
  "Hz. Peygamber'e gelip": ["Hazreti Peygamber'e gelip"], "Ve kalfa Nevres'e": ["Ve Kalfa Nevris'e"],
  "On yedi, on sekiz yaşlarında genç kızlar": ["17 -18 yaşlarında genç kızlar", "yaşlarında genç kızlar"],
  "Çünkü bu kadar kadının arasında": ["Çünkü bu kadar kadından arasında"], "Peki Montagu'ya ne oldu": ["Peki Montague'ya ne oldu"],
  "Montagu reddedemiyor": ["Montague'ı reddedemiyor"],
};
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const VAR: [RegExp, string][] = [[/â/g, "a"], [/î/g, "i"], [/û/g, "u"]];
const variants = (p: string) => { const out = [p]; for (const [re, to] of VAR) for (const v of [...out]) { const n = v.replace(re, to); if (n !== v) out.push(n); } return out; };
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K3R_21_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone; fore?: "column" | "curtain" | "lamp" };
type PO = Partial<React.ComponentProps<typeof PFig>>;

// ── karakterler ──
const Y = 1005;
const nev = (t: number, x: number, o: PO = {}, s = 0.92, y = Y) => <PFig x={x} y={y} s={s} kind="girl" robe="#3A6E8A" robe2="#EFE6D4" scarf="#F2E6D0" t={t} seed={3} {...o} />;
const nevK = (t: number, x: number, o: PO = {}, s = 1.08, y = Y) => <PFig x={x} y={y} s={s} kind="kalfa" robe="#2E4A6A" robe2="#EFE6D4" scarf="#E9DCC2" t={t} seed={3} {...o} />; // yıllar sonra
const sev = (t: number, x: number, o: PO = {}, s = 0.98, y = Y) => <PFig x={x} y={y} s={s} kind="girl" robe="#C9873B" robe2="#F2E6D0" scarf="#F7EFE0" t={t} seed={9} {...o} />;
const kal = (t: number, x: number, o: PO = {}, s = 1.08, y = Y) => <PFig x={x} y={y} s={s} kind="kalfa" robe="#4A5A4A" robe2="#E2D9C6" t={t} seed={5} {...o} />;
const yeni = (t: number, x: number, o: PO = {}, s = 0.86, y = Y) => <PFig x={x} y={y} s={s} kind="girl" robe="#8A6A4A" robe2="#EFE6D4" scarf="#E9DCC2" t={t} seed={12} {...o} />;
const ahm = (t: number, x: number, o: PO = {}, s = 1.16) => <PFig x={x} y={Y} s={s} kind="sultan" robe="#2E4A7A" robe2="#F3E6C4" t={t} seed={11} {...o} />;
const mon = (t: number, x: number, o: PO = {}, s = 1.1, y = Y) => <PFig x={x} y={y} s={s} kind="valide" robe="#6A8AB8" robe2="#F4EEE0" t={t} seed={40} {...o} />;
const hek = (t: number, x: number, o: PO = {}, s = 1.12) => <PFig x={x} y={Y} s={s} kind="prince" plain robe="#3A4A3A" robe2="#E2D9C6" t={t} seed={33} {...o} />;
const kadin = (t: number, x: number, i: number, o: PO = {}, s = 1.0, y = Y) => <PFig key={`k${i}`} x={x} y={y} s={s} kind="girl" robe={["#7A5A6A", "#5A6A7A", "#8A6A4A", "#6A7A5A", "#9A6A6A", "#6E1F3A"][i % 6]} robe2="#EFE6D4" scarf={["#F2E6D0", "#E9DCC2", "#D8C8A8"][i % 3]} t={t} seed={30 + i} {...o} />;
const anne = (t: number, x: number, o: PO = {}, s = 1.05) => <PFig x={x} y={Y} s={s} kind="girl" plain robe="#7A4A5A" robe2="#EFE6D4" scarf="#D8C8A8" t={t} seed={60} {...o} />;
const kiz = (t: number, x: number, o: PO = {}, s = 0.82) => <PFig x={x} y={Y} s={s} kind="girl" plain robe="#5A8AA8" robe2="#F4EEE0" scarf="#F2E6D0" t={t} seed={61} {...o} />;

// ── mekânlar ──
const C = (t: number, a: number, b: number, z: [number, number], c0: [number, number], kids: React.ReactNode, c1?: [number, number]) => <PCam t={t} a={a} b={b} z={z} c0={c0} c1={c1}>{kids}</PCam>;
type YO = { hero?: number; eyes?: "closed" | "open" | "shock" | "worried"; lift?: number; dark?: number; empty?: number[] };
const yat = (t: number, figs: React.ReactNode = null, o: YO = {}) => (
  <><Yatakhane t={t} hero={o.hero ?? 0} heroEyes={o.eyes ?? "closed"} lift={o.lift ?? 0} empty={o.empty} />{figs}
    <NightVeil id="nvYat" k={o.dark ?? 0.62} lights={[{ x: 660, y: 300, r: 380 }, { x: 1280, y: 300, r: 380 }, { x: 1540, y: 200, r: 200, f: 0.6 }]} t={t} /><Motes t={t} n={22} op={0.35} /></>
);
const yakin = (t: number, o: { lift?: number; eyes?: "closed" | "open" | "shock" | "worried"; stain?: number; hand?: number; night?: number } = {}) => <DosekYakin t={t} lift={o.lift ?? 0} eyes={o.eyes ?? "closed"} stain={o.stain ?? 0} hand={o.hand ?? 0} night={o.night ?? 1} />;
const kose = (t: number, figs: React.ReactNode = null, night = 1, sandik: { open?: number; bohca?: number } | null = null) => (
  <><ValideOda t={t} win={0.95} />{sandik && <Sandik t={t} x={1450} y={900} s={0.55} open={sandik.open ?? 0} bohca={sandik.bohca ?? 0} />}{figs}
    {night > 0 && <NightVeil id="nvKo" k={0.6 * night} lights={[{ x: 960, y: 560, r: 520 }, { x: 1500, y: 340, r: 240, f: 0.7 }]} t={t} />}<Motes t={t} n={20} op={0.35} /></>
);
const gun = (t: number, figs: React.ReactNode = null) => <><ValideOda t={t} win={0.2} />{figs}<Motes t={t} n={26} op={0.4} /></>;
const koridor = (t: number, figs: React.ReactNode = null, night = 0, camX = 0) => <><GalleryWall t={t} camX={camX} night={night} />{figs}<Motes t={t} n={28} op={0.4} /></>;
const bahce = (t: number, figs: React.ReactNode = null, pan = 0) => (
  <><HasBahce t={t} pan={pan} /><Birds t={t} /><Laleler x={1380} y={890} n={10} t={t} s={0.8} />{figs}<Laleler x={-60} y={1130} n={7} t={t} s={1.7} blur={8} /></>
);
const hamam = (t: number, figs: React.ReactNode = null, o: { seki?: boolean; steam?: number } = {}) => (
  <><HamamPro t={t} steam={o.steam ?? 1} />{o.seki !== false && <Seki x={960} y={900} w={1800} t={t} />}{figs}<Motes t={t} n={18} op={0.3} c="#FFFFFF" /></>
);
const topk = (t: number, figs: React.ReactNode = null, pan = 0) => <><TopkapiSalon t={t} pan={pan} />{figs}<Motes t={t} n={30} op={0.4} /></>;
const kapali = (t: number, kids: React.ReactNode, bg = "#2A1E16") => <><rect width={1920} height={1080} fill={bg} />{kids}<Motes t={t} n={24} op={0.4} /></>;
const ev = (t: number, figs: React.ReactNode = null, night = 0) => <><BugunEv t={t} night={night} />{figs}</>;
const yurur = (t: number, a: number, b: number, x0: number, x1: number, s = 1.0) => ({ x: lerp(x0, x1, ramp(t, a, b)), walk: proWalk(t, a, b, x0, x1, s).walk });
const bohcaEl = (t: number, k = 1) => <g transform="scale(0.55)"><BeyazBohca s={1} glow={0.3 * k} t={t} /></g>;
const kartlar = (t: number, a: number, labels: string[], cols: string[], step = 1.4, r = 130) => (
  <><Paper />{labels.map((l, i) => { const gap = Math.max(r * 2 + 60, 31 * Math.max(...labels.map((x) => x.length)) + 50); return <Disc key={l} x={960 + (i - (labels.length - 1) / 2) * gap} y={460} r={r} k={ramp(t, a + 0.4 + i * step, a + 0.8 + i * step)} c={cols[i % cols.length]} label={l} />; })}</>
);
const sor = (t: number, a: number, l: string, r: string) => (
  <><Paper /><Disc x={600} y={440} r={220} k={ramp(t, a + 0.4, a + 0.8)} c={H.cobalt} label={l} /><Disc x={1320} y={440} r={220} k={ramp(t, a + 1.6, a + 2)} c={H.red} label={r} /></>
);
const ip = (t: number, k: number, hl = -1, bg = "#2A1E16") => kapali(t, <DugumIp t={t} k={k} hl={hl} />, bg);
const mer = (t: number, k: number, hi = -1, marker: React.ReactNode = null, key2 = 0) => <><Paper /><RutbeMerdiven t={t} k={k} hi={hi} marker={marker} key2={key2} /></>;

const SHOTS: Sh[] = [
  // ── AN: gece, yatakhane ──
  { c: "Gecenin ortası", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 520], yat(t)),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="TOPKAPI SARAYI · HAREM" c={H.red} /> },
  { c: "Uzun bir oda", tone: "night", r: (t, a, b) => C(t, a, b, [1.25, 1.35], [700, 700], yat(t), [1200, 700]) },
  { c: "Onlarca kız uyuyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.7, 1.9], [1000, 820], yat(t)) },
  { c: "Kandilin biri hâlâ yanıyor", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [660, 300], yat(t)) },
  { c: "Ve sen uyanıyorsun", sfx: "whoosh", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 540], yakin(t, { eyes: t > a + 0.6 ? "open" : "closed" })) },
  { c: "Karnında bir ağrı var", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [540, 470], yakin(t, { eyes: "worried" })) },
  { c: "Daha önce hiç hissetmediğin", tone: "night", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [900, 600], yakin(t, { eyes: "worried", hand: 1 })) },
  { c: "Yorganı kaldırıyorsun", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.12], [960, 560], yakin(t, { eyes: "worried", lift: ramp(t, a + 0.3, a + 1.6), hand: 1 })) },
  { c: "Döşeğe bakıyorsun", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.8], [1000, 700], yakin(t, { eyes: "worried", lift: 1, stain: ramp(t, a + 0.5, a + 1.6) })) },
  { c: "Kan", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.7], [520, 460], yakin(t, { eyes: "shock", lift: 1, stain: 1 })) },
  { c: "On üç yaşındasın", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], yakin(t, { eyes: "shock", lift: 0.6, stain: 1 })),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="13 YAŞINDASIN" y={70} size={120} accent={H.red} /> },
  { c: "Ve bunun ne olduğunu", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [540, 470], yakin(t, { eyes: "worried", lift: 0.3 })),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="KİMSE SÖYLEMEDİ" y={820} size={100} /> },
  { c: "Hasta mısın", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.15], [960, 540], kartlar(t, a, ["HASTA MIYIM?", "ÖLECEK MİYİM?", "GÖRÜRLERSE?"], [H.cobalt, H.red, "#5A3A26"], 0.9)) },
  { c: "Bu gece sana ne olacağını", tone: "night", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 540], yat(t, null, { eyes: "worried", lift: 0.4 })) },
  { c: "Bu videoyu hazırlarken", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.12], [960, 560], <ArsivDefter t={t} scan={ramp(t, a, b)} />) },
  { c: "Osmanlı'da bir kadının regl olunca", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], <ArsivDefter t={t} scan={1} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.55} text="NEREDEYSE KİMSE YAZMAMIŞ" y={70} size={96} accent={H.red} /> },
  { c: "Ama izler var", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["DİN KİTABI", "HEKİM YAZMASI", "1717 MEKTUBU"], ["#1F5A3A", "#5A2A1A", H.cobalt], 1.1, 150)) },
  { c: "bir hekimin el", r: (t, a, b) => again("Ama izler var", t, a, b, 0), html: (t, a, b) => htmlOf("Ama izler var", t, b) },
  { c: "Bu gece o izlerin peşinden", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [1000, 800], yat(t)),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="SENİN GÖZÜNDEN" y={70} size={100} /> },

  // ── 1 · GELİŞ ──
  { c: "İstanbul", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 520], bahce(t, null, ramp(t, a, b) * 200)),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="İSTANBUL · TOPKAPI" c={H.red} /> },
  { c: "Bin yedi yüz yirmi civarı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], bahce(t)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="~1720" y={70} size={130} accent={H.gold} /> },
  { c: "Tahtta Üçüncü Ahmed var", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 560], topk(t, <>{ahm(t, 960, { face: "normal" })}</>, 150)),
    html: (t, a) => <NameCard t={t} at={a + 0.3} name="III. AHMED" sub="Osmanlı padişahı · 1703–1730" c="#2E4A7A" /> },
  { c: "Saray bahçelerinde laleler açıyor", tone: "gold", r: (t, a, b) => C(t, a, b, [2, 2.3], [1500, 850], bahce(t)) },
  { c: "Bu yıllara sonradan", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.1], [960, 600], bahce(t, null, 300)),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="LALE DEVRİ" sub="(adı sonradan verildi)" y={70} size={110} accent={H.red} /> },
  { c: "Sen buraya birkaç ay önce geldin", tone: "warm", r: (t, a, b) => { const w = yurur(t, a, b, 300, 900, 0.92); return C(t, a, b, [1.3, 1.4], [700, 640], koridor(t, <>{nev(t, w.x, { walk: w.walk, face: "worried", look: 0.4 })}</>, 0, ramp(t, a, b) * 300)); } },
  { c: "Çok uzaktan", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [900, 520], koridor(t, <>{nev(t, 900, { face: "sad", look: -0.5 })}</>, 0, 300)) },
  { c: "Senin gerçek adını tarih yazmadı", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 600], gun(t, <>{nev(t, 960, { face: "shy" }, 1.2)}</>)),
    html: (t, a, b) => <NameCard t={t} at={a + (b - a) * 0.5} name="NEVRES" sub="Kurgu bir ad · adını biz verdik" c="#3A6E8A" /> },
  { c: "Harem, ilk günden sana bir şey öğretti", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 560], gun(t, <>{kal(t, 700, { face: "normal", look: 0.5 })}{nev(t, 1200, { face: "worried", look: -0.5, bow: 0.3 })}</>)) },
  { c: "En altta acemiler", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.2], [600, 760], mer(t, ramp(t, a, a + 0.8) * 0.2 + 0.0001, 0, nev(t, 0, { face: "worried" }, 0.3, 0))) },
  { c: "Sana okuma yazma öğretiliyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 640], gun(t, <>{kal(t, 640, { face: "normal", talk: 1, look: 0.6 })}{nev(t, 1000, { sit: true, face: "normal", look: -0.4 })}{kadin(t, 1340, 1, { sit: true, look: -0.5 }, 0.9)}<g transform="translate(1000,930)"><Rahle s={0.5} /></g></>)) },
  { c: "Yeteneğine göre müzik", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["MÜZİK", "DİKİŞ", "NAKIŞ", "SOFRA"], [H.cobalt, "#8A6A3A", H.red, "#2E6A5A"], 0.7, 120)) },
  { c: "Acemilikten sonra kalfalık geliyor", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.03], [960, 560], mer(t, lerp(0.25, 0.85, ramp(t, a, b)))),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="TDV İSLAM ANSİKLOPEDİSİ · HAREM" c={H.cobalt} /> },
  { c: "Ve en üstte", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.5], [960, 540], mer(t, 1, 4), [1460, 400]) },
  { c: "Ustaların içinde bir de hazinedar usta", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [1300, 420], mer(t, 1, 4, null, ramp(t, a + 0.3, a + 1.2))) },
  { c: "Bunları Diyanet'in", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], mer(t, 1, 0, null, 1)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="BU MERDİVENİ AKLINDA TUT" y={70} size={90} accent={H.gold} /> },
  { c: "Ve bu merdiveni", r: (t, a, b) => again("Bunları Diyanet'in", t, a, b, 0), html: (t, a, b) => htmlOf("Bunları Diyanet'in", t, b) },
  { c: "Senin odanın başında da", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], yat(t, <>{kal(t, 1500, { face: "normal", look: -0.6 }, 0.8, 760)}</>, { dark: 0.5 })) },
  { c: "Senin kalfan yaşlı bir kadın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 520], kose(t, <>{kal(t, 960, { face: "normal" }, 1.25)}</>, 0.5)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="KALFA" sub="Odanın sorumlusu" c="#4A5A4A" /> },
  { c: "Güldüğünü hiç görmedin", tone: "warm", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [960, 470], kose(t, <>{kal(t, 960, { face: "normal" }, 1.25)}</>, 0.5)) },
  { c: "Gece herkes uyuduğunda", tone: "night", r: (t, a, b) => { const w = yurur(t, a, b, 1700, 300, 0.8); return C(t, a, b, [1.15, 1.2], [960, 600], yat(t, <>{kal(t, w.x, { walk: w.walk, face: "normal", look: -0.3 }, 0.8, 760)}</>)); } },
  { c: "Herkesin üstü örtülü mü diye", tone: "night", r: (t, a, b) => C(t, a, b, [1.9, 2.1], [800, 800], yat(t, <>{kal(t, 900, { face: "normal", bow: 0.6, reach: ramp(t, a, a + 0.8) }, 0.8, 760)}</>)) },
  { c: "Senin bir de arkadaşın var", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], gun(t, <>{sev(t, 760, { face: "smile", look: 0.5 })}{nev(t, 1160, { face: "smile", look: -0.5 })}</>)),
    html: (t, a, b) => <NameCard t={t} at={a + (b - a) * 0.4} name="ŞEVKİDİL" sub="Kurgu · birkaç yaş büyük arkadaş" c="#C9873B" /> },
  { c: "Sarayın bütün koridorlarını", tone: "warm", r: (t, a, b) => { const w1 = yurur(t, a, b, 200, 1100, 0.98), w2 = yurur(t, a, b, 30, 900, 0.92); return C(t, a, b, [1.2, 1.3], [800, 620], koridor(t, <>{nev(t, w2.x, { walk: w2.walk, face: "normal", look: 0.4 })}{sev(t, w1.x, { walk: w1.walk, face: "smile", look: -0.3, talk: 1 })}</>, 0, ramp(t, a, b) * 500)); } },
  { c: "Ama ikisi de sana bu geceden", tone: "night", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 560], yat(t, null, { eyes: "worried", lift: 0.3 })) },
  { c: "Ve bu hikâyenin sonunda", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.4], [960, 560], gun(t, <>{nev(t, 960, { face: "worried" }, 1.2)}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="YILLAR SONRA KİME DÖNÜŞECEK?" y={70} size={86} /> },
  { c: "Eğer bu hikâyeyi sonuna kadar", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], bahce(t, null, 200)), html: (t, a) => <Abone t={t} at={a + 0.5} /> },

  // ── 2 · GECE ──
  { c: "Burada her hafta", r: (t, a, b) => again("Eğer bu hikâyeyi sonuna kadar", t, a, b, 0), html: (t, a, b) => htmlOf("Eğer bu hikâyeyi sonuna kadar", t, b) },
  { c: "Şimdi o geceye dönelim", sfx: "whoosh", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.2], [960, 540], yat(t, null, { eyes: "shock", lift: 0.5 })) },
  { c: "Döşeğin ıslak", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [1000, 680], yakin(t, { eyes: "shock", lift: 1, stain: 1 })) },
  { c: "Kalbin göğsünden çıkacak gibi", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [480, 450], yakin(t, { eyes: "shock", lift: 0.8, stain: 1 })) },
  { c: "İlk aklına gelen şey şu", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [700, 500], yakin(t, { eyes: "worried", lift: 0.8, stain: 1 })),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="SAKLAMAK" y={70} size={130} accent={H.red} /> },
  { c: "Yorganı çekip lekenin üstüne", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.12], [960, 560], yakin(t, { eyes: "worried", lift: 1 - ramp(t, a + 0.3, a + 1.6), stain: 1, hand: 1 })) },
  { c: "Dizlerini karnına çekiyorsun", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [600, 520], yakin(t, { eyes: "closed", stain: 0 })) },
  { c: "Sesini çıkarmamak için", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [470, 460], yakin(t, { eyes: "worried" })) },
  { c: "Peki sen olsan ne yapardın", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], sor(t, a, "SAKLARDIM", "UYANDIRIRDIM")),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="SEN OLSAN?" y={820} size={110} /> },
  { c: "Nevres saklıyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], yat(t, null, { eyes: "worried" })) },
  { c: "Çünkü yan döşekte Şevkidil uyanık", tone: "night", r: (t, a, b) => C(t, a, b, [2, 2.2], [940, 900], yat(t, null, { hero: 2, eyes: "open" })) },
  { c: "Senin titrediğini görüyor", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [360, 900], yat(t, null, { eyes: "worried", lift: 0.2 })) },
  { c: "Ve hiçbir şey sormadan elini tutuyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 700], kose(t, <>{nev(t, 820, { face: "sad", look: 0.5 })}{sev(t, 1080, { face: "worried", look: -0.5, reach: ramp(t, a + 0.2, a + 1), reachDir: -1 })}</>)) },
  { c: "Fısıldıyor", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [960, 460], kose(t, <>{nev(t, 820, { face: "worried", look: 0.5 })}{sev(t, 1080, { face: "normal", look: -0.5, talk: 1, reach: 1, reachDir: -1 })}<Fisilti x={1010} y={430} t={t} dir={-1} /></>)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="«GEL.»" y={820} size={110} /> },
  { c: "Seni kalfanın köşesine götürüyor", tone: "night", r: (t, a, b) => { const w1 = yurur(t, a, b, 300, 1000, 0.98), w2 = yurur(t, a, b, 120, 800, 0.92); return C(t, a, b, [1.2, 1.25], [800, 620], koridor(t, <>{nev(t, w2.x, { walk: w2.walk, face: "worried" })}{sev(t, w1.x, { walk: w1.walk, face: "normal", look: -0.3 })}</>, 1, ramp(t, a, b) * 400)); } },
  { c: "Kalfa uyanıyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 520], kose(t, <>{kal(t, 960, { face: "closed", sit: true })}</>, 1, { open: 0 })) },
  { c: "Kandilin ışığında yüzüne bakıyor", tone: "night", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [960, 600], kose(t, <>{kal(t, 960, { face: "normal", sit: true, look: 0.3 })}</>, 1, { open: 0 })) },
  { c: "Bekliyorsun", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [960, 450], kose(t, <>{nev(t, 960, { face: "worried", bow: 0.4 }, 1.2)}</>)) },
  { c: "Bağırmıyor", sfx: "drone", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [960, 560], kose(t, <>{kal(t, 760, { face: "normal", look: 0.6 })}{nev(t, 1180, { face: "worried", look: -0.6 })}</>, 1, { open: 0 })) },
  { c: "Kalkıyor", tone: "warm", r: (t, a, b) => { const w = yurur(t, a, b, 760, 1300, 1.08); return C(t, a, b, [1.2, 1.25], [1100, 560], kose(t, <>{kal(t, w.x, { walk: w.walk, face: "normal", look: 0.5 })}{nev(t, 700, { face: "worried", look: 0.6 })}</>, 1, { open: ramp(t, b - 0.6, b) })); } },
  { c: "İçinden beyaz bir bohça çıkarıyor", sfx: "pop", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], kapali(t, <Sandik t={t} open={1} bohca={ramp(t, a + 0.3, a + 1.6)} />, "#2A1E16")),
    html: (t, a) => <Txt t={t} at={a + 0.8} text="BEYAZ BİR BOHÇA" y={70} size={100} accent={H.gold} /> },
  { c: "Eline tutuşturuyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 560], kose(t, <>{kal(t, 820, { face: "normal", reach: 1, item: bohcaEl(t) })}{nev(t, 1110, { face: "worried", reach: ramp(t, a + 0.3, a + 1), reachDir: -1 })}</>)) },
  { c: "Sonra elini omzuna koyuyor", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 480], kose(t, <>{kal(t, 860, { face: "smile", reach: ramp(t, a + 0.2, a + 1), look: 0.4 })}{nev(t, 1080, { face: "shy", look: -0.4, hands: "fold" })}</>)) },
  { c: "Korkma", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [880, 430], kose(t, <>{kal(t, 860, { face: "smile", reach: 1, talk: 1, look: 0.4 })}{nev(t, 1080, { face: "shy", look: -0.4 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="«KORKMA. KIZ OLDUN.»" y={820} size={110} accent={H.gold} /> },
  { c: "O bohçanın içinde ne vardı", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 520], kapali(t, <g transform="translate(960,560) scale(1.8)"><BeyazBohca t={t} glow={1} /></g>)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="İÇİNDE NE VARDI?" y={70} size={110} accent={H.red} /> },
  { c: "Ama önce bir şey soracağım", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], ev(t)) },
  { c: "Bugün Anadolu'da hâlâ anlatılan bir adet", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [800, 620], ev(t, <>{anne(t, 700, { face: "smile", look: 0.5 })}{kiz(t, 1000, { face: "shy", look: -0.5 })}</>)),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="HALK ADETİ · BUGÜN" c={H.red} /> },
  { c: "Bir kız ilk kez regl olduğunda", tone: "warm", r: (t, a, b) => C(t, a, b, [1.7, 1.9], [850, 520], ev(t, <>{anne(t, 720, { face: "smile", look: 0.5, reach: ramp(t, b - 1.2, b - 0.4) })}{kiz(t, 960, { face: t > b - 0.5 ? "shock" : "shy", look: -0.5 })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="HAFİF BİR TOKAT" y={70} size={100} /> },
  { c: "Neden", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["KORKUSU GEÇSİN", "PEMBE YANAKLAR"], [H.cobalt, "#D98E8E"], 1.6, 210)) },
  { c: "Bu adetin ne zaman başladığını", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 560], ev(t, <>{anne(t, 760, { face: "normal", look: 0.4 })}{kiz(t, 1000, { face: "normal", look: -0.4 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="NE ZAMAN BAŞLADI? BİLMİYORUZ" y={70} size={80} /> },
  { c: "Ama belki senin annen de yaptı", tone: "warm", r: (t, a, b) => C(t, a, b, [2.1, 2.3], [900, 480], ev(t, <>{anne(t, 760, { face: "smile", look: 0.4 })}{kiz(t, 1000, { face: "smile", look: -0.4 })}</>)) },
  { c: "Ve belki sen o tokadı", tone: "gold", r: (t, a, b) => C(t, a, b, [2.6, 2.4], [1000, 440], ev(t, <>{kiz(t, 1000, { face: "smile", look: -0.2 })}</>)) },

  // ── 3 · KURAL ──
  { c: "Ertesi sabah", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 520], <Yatakhane t={t} empty={[0, 1, 2, 3, 4, 5, 6]} moon={0} />),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="ERTESİ SABAH" c={H.gold} /> },
  { c: "Pis miyim", tone: "cool", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 460], gun(t, <>{nev(t, 960, { face: "sad", bow: 0.5 }, 1.2)}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="«PİS MİYİM?»" y={820} size={120} accent={H.red} /> },
  { c: "Çünkü dünyanın birçok yerinde", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.12], [760, 560], <AyriOda t={t} />) },
  { c: "Bazı toplumlarda", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [760, 520], <AyriOda t={t} />) },
  { c: "Dokunduğu her şey kirlenmiş sayılırdı", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [760, 560], <AyriOda t={t} />),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="«KİRLİ» SAYILIRDI" y={70} size={100} /> },
  { c: "Bir eski inançta", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [900, 700], <AyriOda t={t} bowl={ramp(t, a + 0.8, b - 0.3)} />) },
  { c: "Bir başka gelenekte", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.3], [1200, 760], <AyriOda t={t} bowl={1} water={ramp(t, a + 0.5, a + 1.5)} />),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="+7 GÜN · SONRA ÖZEL SU" y={70} size={90} /> },
  { c: "Kalfa ise Nevres'i oturtuyor", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 620], gun(t, <>{kal(t, 760, { face: "smile", sit: true, look: 0.5 })}{nev(t, 1160, { face: "worried", sit: true, look: -0.5 })}</>)) },
  { c: "İslam'da regl olan kadına", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [800, 520], gun(t, <>{kal(t, 760, { face: "normal", sit: true, look: 0.5, talk: 1 })}{nev(t, 1160, { face: "normal", sit: true, look: -0.5 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="HAYIZ" sub="regl dönemi" y={70} size={120} accent={H.gold} /> },
  { c: "Ve hayızlı kadın pis sayılmaz", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["PİS SAYILMAZ", "EVDEN ÇIKARILMAZ", "KİMSEDEN AYRILMAZ"], ["#2E6A5A", H.cobalt, "#8A6A3A"], 0.9)) },
  { c: "Aynı sofraya oturur", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 640], gun(t, <>{kadin(t, 560, 0, { sit: true, face: "smile", look: 0.4 }, 0.9)}{nev(t, 860, { sit: true, face: "smile", look: 0.3 })}{sev(t, 1120, { sit: true, face: "smile", look: -0.3 })}{kadin(t, 1400, 2, { sit: true, face: "smile", look: -0.4 }, 0.9)}<g transform="translate(980,960)"><Fincan t={t} s={1.6} /></g></>)) },
  { c: "Bunu biz söylemiyoruz", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Belge t={t} at={a + 0.3} date="c. 17 · 1998" src="TDV İslam Ansiklopedisi · «Hayız» (Y. V. Yavuz)">Hayızlı kadın, diğer bazı toplumlardaki gibi pis sayılıp toplumdan uzaklaştırılmaz.</Belge> },
  { c: "hayız maddesinde diğer", r: (t, a, b) => again("Bunu biz söylemiyoruz", t, a, b, 0), html: (t, a, b) => htmlOf("Bunu biz söylemiyoruz", t, b) },
  { c: "Peki ne değişir", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [800, 500], gun(t, <>{kal(t, 760, { face: "normal", sit: true, look: 0.5, talk: 1 })}{nev(t, 1160, { face: "normal", sit: true, look: -0.5 })}</>)) },
  { c: "Birkaç şey", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 620], gun(t, <>{kal(t, 760, { face: "smile", sit: true, look: 0.5, talk: 1 })}{nev(t, 1160, { face: "normal", sit: true, look: -0.5 })}</>)) },
  { c: "O günlerde namaz kılmazsın", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["NAMAZ: YOK", "SONRA KILINMAZ"], [H.cobalt, "#2E6A5A"], 1.6, 210)) },
  { c: "Ramazan'a denk gelirse", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["ORUÇ: YOK", "SONRA TUTULUR"], ["#8A6A3A", H.red], 1.6, 210)) },
  { c: "Camide oturmazsın", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 700], gun(t, <Rahle x={960} y={900} s={1.2} />)) },
  { c: "Ama dua edebilirsin", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 480], gun(t, <>{nev(t, 960, { face: "closed", sit: true }, 1.15)}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="DUA ✓  ZİKİR ✓" y={70} size={110} accent={H.gold} /> },
  { c: "Ve kan tamamen kesildiğinde", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], hamam(t, null, { seki: false })) },
  { c: "Gusül", sfx: "splash", tone: "cool", r: (t, a, b) => C(t, a, b, [1.7, 1.9], [960, 720], hamam(t, null, { seki: false })),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="GUSÜL" sub="baştan ayağa yıkanmak" y={70} size={120} /> },
  { c: "Nevres o sabah ilk kez", tone: "gold", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 480], gun(t, <>{nev(t, 960, { face: "smile" }, 1.2)}</>)) },
  { c: "Belki de şunu merak ediyorsun", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["EN ERKEN 9", "BUGÜN 11–13", "NEVRES 13"], ["#8A6A3A", H.cobalt, "#3A6E8A"], 1.8, 160))
    , html: (t, a) => <Tag t={t} at={a + 0.4} text="TDV · HAYIZ" c={H.cobalt} /> },
  { c: "âlimlerin çoğuna göre", r: (t, a, b) => again("Belki de şunu merak ediyorsun", t, a, b, 0), html: (t, a, b) => htmlOf("Belki de şunu merak ediyorsun", t, b) },
  { c: "on üç yaş", r: (t, a, b) => again("Belki de şunu merak ediyorsun", t, a, b, 1), html: (t, a, b) => htmlOf("Belki de şunu merak ediyorsun", t, b) },
  { c: "Ve oruç kuralına bir an geri dönelim", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], ev(t, null, 0.6)) },
  { c: "Bugün bile birçok kız", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [800, 620], ev(t, <>{kiz(t, 820, { face: "worried", look: 0.4 })}</>, 0.6)) },
  { c: "Ramazan'da sofraya oturup", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 700], ev(t, <><g transform="translate(960,900)"><SuBardak t={t} s={0.9} /></g>{kiz(t, 700, { face: "shy", look: 0.5 })}</>, 0.6)) },
  { c: "Belki sen de yaptın", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kapali(t, <g transform="translate(960,820)"><SuBardak t={t} level={1 - ramp(t, a + 0.5, a + 2)} wash={ramp(t, b - 1.4, b - 0.6)} s={1.6} /></g>, "#3A2C22")),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.55} text="SONRA HEMEN YIKADIN" y={70} size={96} /> },
  { c: "Nevres ise sarayda", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], gun(t, <>{kadin(t, 560, 3, { face: "smile", look: 0.4 }, 0.95)}{nev(t, 960, { face: "smile" })}{sev(t, 1340, { face: "smile", look: -0.4 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.8} text="SAKLAMAK ZORUNDA DEĞİL" y={70} size={90} /> },
  { c: "Ama kalfa bir şey daha söylüyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [800, 500], gun(t, <>{kal(t, 760, { face: "normal", look: 0.5, talk: 1 })}{nev(t, 1160, { face: "normal", look: -0.5 })}</>)) },
  { c: "Günlerini bileceksin", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [760, 460], gun(t, <>{kal(t, 760, { face: "normal", look: 0.5, talk: 1 })}{nev(t, 1160, { face: "normal", look: -0.5 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="«GÜNLERİNİ BİLECEKSİN.»" y={820} size={110} accent={H.gold} /> },
  { c: "Neden", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], kapali(t, <AyHalka t={t} k={ramp(t, a, b)} />, "#141B36")),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="ÂDET = ALIŞKANLIK" y={70} size={100} accent={H.gold} /> },
  { c: "Her ay, hemen hemen aynı günlerde", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 540], kapali(t, <AyHalka t={t} k={ramp(t, a, b)} />, "#141B36")) },
  { c: "Ve din, kadından kendi alışkanlığını", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], gun(t, <>{nev(t, 960, { face: "normal", look: 0.2 }, 1.15)}</>)) },
  { c: "Hz. Peygamber'e gelip", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Belge t={t} at={a + 0.3} date="Hadis · Buhârî, Müslim" src="TDV İslam Ansiklopedisi · «İstihâze»">Fâtıma bint Ebû Hubeyş: «Kanım durmuyor.» Cevap: «Bu damardan gelen bir kandır. Âdet günlerin bitince yıkan ve namazını kıl.»</Belge> },
  { c: "Ona verilen cevap", r: (t, a, b) => again("Hz. Peygamber'e gelip", t, a, b, 0), html: (t, a, b) => htmlOf("Hz. Peygamber'e gelip", t, b) },
  { c: "Sen adet günlerinin", r: (t, a, b) => again("Hz. Peygamber'e gelip", t, a, b, 1), html: (t, a, b) => htmlOf("Hz. Peygamber'e gelip", t, b) },
  { c: "Yani bir kadın, kendi günlerini saymazsa", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], kartlar(t, a, ["ÂDET", "İSTİHAZE"], [H.red, H.cobalt], 1.8, 210)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="GUSÜL  ·  HER VAKİT ABDEST" y={820} size={80} /> },
  { c: "Adet günlerinden sonra", r: (t, a, b) => again("Yani bir kadın, kendi günlerini saymazsa", t, a, b, 0), html: (t, a, b) => htmlOf("Yani bir kadın, kendi günlerini saymazsa", t, b) },
  { c: "Onda gusul gerekmez", r: (t, a, b) => again("Yani bir kadın, kendi günlerini saymazsa", t, a, b, 1), html: (t, a, b) => htmlOf("Yani bir kadın, kendi günlerini saymazsa", t, b) },
  { c: "Bunu da Diyanet'in ansiklopedisi", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["ÂDET", "İSTİHAZE"], [H.red, H.cobalt], 0, 210)),
    html: (t, a) => <Tag t={t} at={a + 0.3} text="TDV İA · «İSTİHÂZE» (c. 23, 2001)" c={H.cobalt} /> },
  { c: "Yani bir kadının kendi bedenini tanıması", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 480], gun(t, <>{nev(t, 960, { face: "normal" }, 1.2)}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="MERAK DEĞİL, ZORUNLULUK" y={70} size={90} accent={H.gold} /> },
  { c: "Ve Nevres buna bir çare bulacak", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], hamam(t)),
    html: (t, a) => <Txt t={t} at={a + 0.8} text="HAMAMDA" y={70} size={110} /> },
  { c: "Ama asıl soru hâlâ cevapsız", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [960, 540], kapali(t, <g transform="translate(960,560) scale(1.8)"><BeyazBohca t={t} glow={0.8} /></g>)) },

  // ── 4 · BOHÇA ──
  { c: "Şimdi sana söz verdiğim dürüstlük", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.12], [960, 560], <ArsivDefter t={t} scan={ramp(t, a, b)} />) },
  { c: "Bir Osmanlı kadını, regl olduğunda", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 560], kapali(t, <g transform="translate(960,560) scale(1.6)"><BeyazBohca t={t} glow={0.5} /></g>)) },
  { c: "Bunu araştırırken din kitaplarına baktık", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["DİN KİTAPLARI", "TIP YAZMALARI", "AKADEMİK"], ["#1F5A3A", "#5A2A1A", H.cobalt], 1.3, 150)) },
  { c: "Ve bu bohçanın içinde ne olduğunu", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], <ArsivDefter t={t} scan={1} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="TEK BİR KAYNAK YOK" y={70} size={110} accent={H.red} /> },
  { c: "Neden", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 480], kose(t, <>{kal(t, 860, { face: "normal", look: 0.5, talk: 1 })}{sev(t, 1080, { face: "normal", look: -0.5 })}<Fisilti x={920} y={420} t={t} /></>)) },
  { c: "Çünkü bu, kadınların kendi aralarında", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 440], kose(t, <>{kal(t, 860, { face: "normal", look: 0.5, talk: 1 })}{sev(t, 1080, { face: "smile", look: -0.5 })}<Fisilti x={920} y={420} t={t} /></>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="FISILTIYLA" y={820} size={110} /> },
  { c: "Kâğıda yazılmadı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], gun(t, <>{kadin(t, 400, 4, { face: "normal", look: 0.5, talk: 1 }, 1.05)}<Fisilti x={470} y={430} t={t} />{kal(t, 760, { face: "normal", look: 0.5, talk: 1 })}<Fisilti x={830} y={430} t={t + 0.4} />{nev(t, 1120, { face: "normal", look: -0.3 })}{yeni(t, 1450, { face: "normal", look: -0.5 })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="KULAKTAN KULAĞA" y={70} size={100} /> },
  { c: "Peki elimizde ne var", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], ev(t)) },
  { c: "Ninelerimizin anlattıkları var", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [800, 600], ev(t, <>{anne(t, 760, { face: "smile", sit: true, look: 0.4 })}{kiz(t, 1080, { face: "normal", sit: true, look: -0.4 })}</>)),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="NİNELERİN ANLATTIĞI (YAZILI KAYIT DEĞİL)" c="#8A6A3A" /> },
  { c: "Pamuklu bezler", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["KULLAN", "YIKA", "KURUT", "YENİDEN"], ["#8A6A3A", H.cobalt, "#2E6A5A", "#B8892E"], 0.6, 120)) },
  { c: "Sarayda da böyle miydi", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 540], kapali(t, <g transform="translate(960,560) scale(1.6)"><BeyazBohca t={t} glow={0.4} /></g>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="MUHTEMELEN · AMA KAYIT YOK" y={70} size={86} /> },
  { c: "Ve biz, kaydı olmayan bir şeyi", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [960, 540], kapali(t, <g transform="translate(960,560) scale(1.6)"><BeyazBohca t={t} glow={0.2} /></g>)) },
  { c: "Peki aynı yıllarda Avrupa'da", sfx: "whoosh", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 560], <SurgunMektup t={t} k={ramp(t, a, a + 2)} />) },
  { c: "Hayır", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 560], <SurgunMektup t={t} k={1} />) },
  { c: "İngiltere'de kadınlar bu günlere çiçekler", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], kapali(t, <>{[-1, 0, 1].map((i) => <g key={i} transform={`translate(${960 + i * 300},${540 + (i ? 40 : 0)}) scale(${i ? 2.4 : 3})`}><Gul s={1} rot={i * 20} /></g>)}</>, "#3A2C22")),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="«FLOWERS»  (çiçekler)" y={820} size={110} accent="#D98E8E" /> },
  { c: "Tarihçiler bugün bile", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["KETEN?", "YÜN?", "HİÇBİR ŞEY?"], ["#8A6A3A", "#5A6A7A", "#5A3A26"], 0.9)),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="SARA READ · 2013" c={H.cobalt} /> },
  { c: "yün müydü, hiçbir", r: (t, a, b) => again("Tarihçiler bugün bile", t, a, b, 0), html: (t, a, b) => htmlOf("Tarihçiler bugün bile", t, b) },
  { c: "Yani İstanbul'da da, Londra'da da", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], <ArsivDefter t={t} scan={0.5} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="EN SIK YAŞANAN · EN AZ YAZILAN" y={70} size={84} accent={H.gold} /> },
  { c: "Ama bir şey Osmanlı kadınını farklı kılıyordu", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 560], hamam(t)) },

  // ── 5 · HAMAM ──
  { c: "Kan kesildi", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [960, 560], gun(t, <>{nev(t, 960, { face: "smile" }, 1.15)}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="5–6 GÜN SONRA" y={70} size={100} /> },
  { c: "Ve kalfa Nevres'e", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [800, 500], gun(t, <>{kal(t, 760, { face: "smile", look: 0.5, talk: 1 })}{nev(t, 1160, { face: "smile", look: -0.5 })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="HAMAM" y={820} size={120} /> },
  { c: "Gusül için", tone: "cool", r: (t, a, b) => { const w = yurur(t, a, b, 200, 820, 0.92); return C(t, a, b, [1.2, 1.3], [700, 620], hamam(t, <>{nev(t, w.x, { walk: w.walk, face: "normal", look: 0.4 })}</>, { seki: false })); } },
  { c: "Bin yedi yüz on yedi yılı", sfx: "whoosh", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 560], topk(t, <>{mon(t, 960, { face: "normal" })}</>, 100)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="LADY MARY WORTLEY MONTAGU" sub="İngiliz büyükelçinin eşi · 1717" c="#6A8AB8" /> },
  { c: "Osmanlı topraklarında yolculuk", r: (t, a, b) => again("Bin yedi yüz on yedi yılı", t, a, b, 0), html: (t, a, b) => htmlOf("Bin yedi yüz on yedi yılı", t, b) },
  { c: "Sofya'da bir kadınlar hamamına giriyor", tone: "cool", r: (t, a, b) => { const w = yurur(t, a, b, 200, 760, 1.1); return C(t, a, b, [1.1, 1.2], [700, 600], hamam(t, <>{mon(t, w.x, { walk: w.walk, face: "shock", look: 0.5 })}</>)); },
    html: (t, a) => <Tag t={t} at={a + 0.4} text="SOFYA · 1717" c={H.red} /> },
  { c: "Ve gördüklerini bir mektupta", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 560], <SurgunMektup t={t} k={ramp(t, a, a + 2.5)} />),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="MONTAGU · MEKTUP 26 · EDİRNE, 1 NİSAN 1717" c={H.cobalt} /> },
  { c: "Bir şeyi baştan söyleyelim", tone: "cool", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 560], hamam(t)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="SARAY HAMAMI DEĞİL · ŞEHİR HAMAMI" y={70} size={80} /> },
  { c: "Ama Osmanlı kadınlarının hamamda", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 520], hamam(t)) },
  { c: "Montagu içeride yaklaşık iki yüz", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.15], [960, 600], hamam(t, <>{[0, 1, 2, 3, 4, 5].map((i) => kadin(t, 230 + i * 290, i, { sit: true, face: i % 2 ? "smile" : "normal", look: (i % 3) - 1, talk: i % 2 }, 0.78, 820))}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="~200 KADIN" y={70} size={120} accent={H.gold} /> },
  { c: "Minderlerle, halılarla döşenmiş", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [700, 760], hamam(t, <>{[0, 1, 2, 3, 4, 5].map((i) => kadin(t, 230 + i * 290, i, { sit: true, face: "normal", look: (i % 3) - 1 }, 0.78, 820))}</>)) },
  { c: "Bazıları kahve içiyor", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 560], kapali(t, <g transform="translate(960,640) scale(1.8)"><KahveSerbet t={t} /></g>, "#3A2C22")) },
  { c: "On yedi, on sekiz yaşlarında genç kızlar", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 560], hamam(t, <>{kadin(t, 860, 5, { sit: true, face: "smile", look: 0.3 }, 0.9, 860)}{kadin(t, 1080, 2, { face: "smile", look: -0.5, reach: 0.7 + 0.2 * Math.sin(t * 3), reachDir: -1 }, 0.85, 880)}</>)) },
  { c: "Ve Montagu şaşırıyor", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 440], hamam(t, <>{mon(t, 960, { face: "shock", look: 0.2 })}</>)) },
  { c: "Çünkü bu kadar kadının arasında", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], hamam(t, <>{[0, 1, 2, 3, 4, 5].map((i) => kadin(t, 230 + i * 290, i, { sit: true, face: "normal", look: (i % 3) - 1 }, 0.78, 820))}</>)) },
  { c: "Sonra bir cümle yazıyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 560], <SurgunMektup t={t} k={1} />) },
  { c: "Burası, diyor, kadınların kahvehanesi", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 560], <SurgunMektup t={t} k={1} line="«the women's coffee house»" hl={ramp(t, a + 0.3, a + 1)} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="«KADINLARIN KAHVEHANESİ»" y={70} size={100} accent={H.gold} /> },
  { c: "Ve bunu haftada bir yaptıklarını", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["HAFTADA 1", "4–5 SAAT"], [H.cobalt, H.gold], 1.6, 210)) },
  { c: "Şimdi Nevres'e dön", sfx: "whoosh", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], hamam(t, null, { seki: false, steam: 1.4 })) },
  { c: "Buhar", tone: "cool", r: (t, a, b) => C(t, a, b, [1.7, 1.9], [960, 900], hamam(t, null, { seki: false, steam: 1.6 })) },
  { c: "Sabun kokusu", tone: "cool", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [190, 700], hamam(t, null, { seki: false })) },
  { c: "Ve etrafında, ilk kez", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], hamam(t, <>{kadin(t, 400, 0, { sit: true, face: "smile", look: 0.4 }, 0.8, 820)}{kadin(t, 700, 3, { sit: true, face: "smile", look: 0.3 }, 0.8, 820)}{nev(t, 960, { sit: true, face: "normal", look: 0 }, 0.85, 860)}{sev(t, 1220, { sit: true, face: "smile", look: -0.4 }, 0.85, 860)}{kadin(t, 1520, 4, { sit: true, face: "normal", look: -0.4 }, 0.8, 820)}</>)) },
  { c: "Hepsi bir zamanlar o geceyi yaşamış", tone: "gold", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 520], hamam(t, <>{nev(t, 960, { sit: true, face: "normal", look: 0.2 }, 0.85, 860)}{sev(t, 1220, { sit: true, face: "smile", look: -0.4 }, 0.85, 860)}</>)) },
  { c: "Ve Nevres, o gece kimseye soramadığı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [1100, 520], hamam(t, <>{nev(t, 960, { sit: true, face: "normal", look: 0.4 }, 0.85, 860)}{kadin(t, 1240, 5, { sit: true, face: "smile", look: -0.4, talk: 1 }, 0.85, 860)}<Fisilti x={1190} y={420} t={t} dir={-1} /></>)) },
  { c: "Bunun her ay geleceğini", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["HER AY", "İLK GÜN DAHA ZOR", "KİM ANLAYIŞLI?"], [H.cobalt, H.red, "#2E6A5A"], 1.4)) },
  { c: "ağrının ilk gün", r: (t, a, b) => again("Bunun her ay geleceğini", t, a, b, 0), html: (t, a, b) => htmlOf("Bunun her ay geleceğini", t, b) },
  { c: "Bir kızın neden ağladığını", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 560], hamam(t, <>{kadin(t, 700, 1, { sit: true, face: "sad", bow: 0.4 }, 0.85, 860)}{kadin(t, 1240, 2, { face: "smile", look: -0.3 }, 0.9, 880)}</>)) },
  { c: "Kahvehanede herkes bir şey bilir", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], hamam(t, <>{[0, 1, 2, 3, 4, 5].map((i) => kadin(t, 230 + i * 290, i, { sit: true, face: "smile", look: (i % 3) - 1, talk: (i + 1) % 2 }, 0.78, 820))}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="BİLEN KADIN KAYBOLMAZ" y={70} size={100} accent={H.gold} /> },
  { c: "Ve kalfanın o cümlesi geliyor aklına", tone: "warm", r: (t, a, b) => C(t, a, b, [2, 2.2], [960, 480], hamam(t, <>{nev(t, 960, { sit: true, face: "normal", look: 0 }, 0.95, 880)}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="«GÜNLERİNİ BİLECEKSİN.»" y={820} size={100} accent={H.gold} /> },
  { c: "Ama nasıl", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["KÂĞIT YOK", "YAZI YENİ", "TAKVİM YOK"], ["#5A3A26", "#8A6A3A", "#5A6A7A"], 0.8)) },
  { c: "O gün Nevres kendine küçük bir yöntem", sfx: "pop", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 600], gun(t, <>{nev(t, 960, { face: "smile", reach: ramp(t, a + 0.4, a + 1.2) }, 1.15)}</>)) },
  { c: "Kemerinin içine ince bir ip bağlıyor", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 540], ip(t, ramp(t, a + 0.5, b) * 2)) },
  { c: "Ve her sabah, o ipe bir düğüm atıyor", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [700, 540], ip(t, lerp(2, 12, ramp(t, a, b))), [1100, 540]) },
  { c: "Düğümler yirmi sekize yaklaştığında", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], ip(t, lerp(12, 27.5, ramp(t, a, b)), 27)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="~28 GÜN" y={70} size={120} accent={H.gold} /> },
  { c: "Bir daha o gece gibi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 480], gun(t, <>{nev(t, 960, { face: "smile" }, 1.2)}</>)) },
  { c: "Ve kan âdet günlerinden fazla sürerse", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 540], ip(t, 28, 27)) },
  { c: "Bu ip tarihte yazmıyor", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [960, 540], ip(t, 28)),
    html: (t, a) => <Tag t={t} at={a + 0.3} text="BU İP BİZİM ANLATIMIMIZ (KURGU)" c={H.red} /> },
  { c: "Ama günleri saymak", r: (t, a, b) => again("Bu ip tarihte yazmıyor", t, a, b, 0), html: (t, a, b) => htmlOf("Bu ip tarihte yazmıyor", t, b) },
  { c: "Peki Montagu'ya ne oldu", sfx: "whoosh", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 560], hamam(t, <>{mon(t, 960, { face: "worried" })}</>)) },
  { c: "Kadınlar onu da soyunmaya davet ediyor", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], hamam(t, <>{kadin(t, 600, 5, { face: "smile", look: 0.5, reach: ramp(t, a, a + 1) }, 0.95)}{mon(t, 960, { face: "shy", look: -0.4 })}{kadin(t, 1320, 0, { face: "smile", look: -0.5 }, 0.95)}</>)) },
  { c: "En saygın görünen hanım", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [800, 520], hamam(t, <>{kadin(t, 700, 5, { face: "smile", look: 0.5, reach: 1, talk: 1 }, 1.0)}{mon(t, 980, { face: "shy", look: -0.4 })}</>)) },
  { c: "Montagu reddedemiyor", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 450], hamam(t, <>{mon(t, 960, { face: "shy", look: 0 })}</>)) },
  { c: "Ve altındaki korseyi gösteriyor", sfx: "pop", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], kapali(t, <Korse t={t} k={ramp(t, a + 0.2, a + 1.2)} />, "#3A2C22")),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="KORSE" y={70} size={120} /> },
  { c: "Kadınlar donup kalıyor", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 560], hamam(t, <>{[0, 1, 2, 3, 4].map((i) => kadin(t, 300 + i * 330, i, { face: "shock", look: i < 2 ? 0.5 : -0.5 }, 0.92))}</>)) },
  { c: "Montagu'nun yazdığına göre", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], kapali(t, <Korse t={t} k={1} />, "#3A2C22")),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="«O MAKİNEYE KİLİTLENMİŞ»" y={70} size={96} accent={H.red} /> },
  { c: "Ve bunu kocasının yaptığını", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 480], hamam(t, <>{kadin(t, 760, 5, { face: "sad", look: 0.4 }, 1.0)}{kadin(t, 1160, 2, { face: "worried", look: -0.4 }, 1.0)}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="«KOCASI YAPMIŞ!»" y={820} size={110} /> },
  { c: "Düşünsene", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 560], hamam(t, <>{kadin(t, 600, 5, { face: "sad", look: 0.5 }, 1.0)}{mon(t, 960, { face: "shy", look: 0 })}{kadin(t, 1320, 2, { face: "sad", look: -0.5 }, 1.0)}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="ACIYARAK BAKIYORLAR" y={70} size={100} /> },
  { c: "Montagu bununla da kalmıyor", sfx: "whoosh", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.12], [960, 560], <SurgunMektup t={t} k={ramp(t, a, a + 2)} />) },
  { c: "Ve bu örtü sayesinde", tone: "gold", r: (t, a, b) => { const w1 = yurur(t, a, b, 200, 1300, 1.0), w2 = yurur(t, a, b, 1700, 700, 0.95); return C(t, a, b, [1.1, 1.2], [960, 600], koridor(t, <>{kadin(t, w1.x, 0, { walk: w1.walk, face: "smile" }, 1.0)}{kadin(t, w2.x, 3, { walk: w2.walk, face: "normal", look: -0.4 }, 0.95)}</>, 0, ramp(t, a, b) * 400)); } },
  { c: "Ona göre bu", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 560], <SurgunMektup t={t} k={1} line="«a perpetual masquerade»" hl={ramp(t, a + 0.3, a + 1)} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="«BİZDEN DAHA FAZLA ÖZGÜRLÜK»" y={70} size={90} accent={H.gold} /> },
  { c: "Bu bir İngiliz kadının kendi gözü", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 560], topk(t, <>{mon(t, 960, { face: "normal" })}</>, 100)),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="BİR AVRUPALININ GÖZÜ · HERKES AYNI FİKİRDE DEĞİL" c="#6A8AB8" /> },
  { c: "Ama 300 yıl", r: (t, a, b) => again("Bu bir İngiliz kadının kendi gözü", t, a, b, 0), html: (t, a, b) => htmlOf("Bu bir İngiliz kadının kendi gözü", t, b) },
  { c: "Bu hikâye hoşuna gittiyse", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], hamam(t)), html: (t, a) => <Abone t={t} at={a + 0.5} /> },

  // ── 6 · AĞRI ──
  { c: "Çünkü bazı aylar ağrı çok kötü", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [540, 470], yakin(t, { eyes: "worried", hand: 1 })) },
  { c: "Ağrı kesici yok", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["AĞRI KESİCİ YOK", "SICAK SU YOK"], ["#5A3A26", "#5A6A7A"], 1.4, 210)) },
  { c: "Sadece karnına bastırdığı elleri var", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 520], kose(t, <>{nev(t, 960, { face: "sad", hands: "belly", bow: 0.4 }, 1.2)}</>, 0.7)) },
  { c: "Peki Osmanlı hekimleri", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], <Yazma t={t} k={ramp(t, a, a + 2)} />) },
  { c: "Bin dört yüz altmış beş yılı", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 560], gun(t, <>{hek(t, 960, { face: "normal", sit: true })}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="SABUNCUOĞLU ŞEREFEDDİN" sub="Hekim · Amasya · 1465" c="#3A4A3A" /> },
  { c: "Ve o yıllarda bilim dili Arapça", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 540], <Yazma t={t} k={1} title="CERRÂHİYYETÜ'L-HÂNİYYE" />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="TÜRKÇE YAZDI · HERKES ANLASIN DİYE" y={70} size={86} accent={H.gold} /> },
  { c: "Son kitabında, Mücerrebnâme'de", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [700, 540], <Yazma t={t} k={1} hl={ramp(t, a + 0.5, a + 1.5)} />),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="TDV İA · «SABUNCUOĞLU ŞEREFEDDİN» (c. 35, 2008)" c={H.cobalt} /> },
  { c: "Ama tarifin içinde tam olarak ne olduğunu", tone: "cool", r: (t, a, b) => C(t, a, b, [1.35, 1.2], [700, 540], <Yazma t={t} k={1} hl={1} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="İÇERİĞİ? KAYNAK SÖYLEMİYOR" y={820} size={86} /> },
  { c: "Peki sarayın içinde", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 560], gun(t, <>{kal(t, 760, { face: "normal", look: 0.5 }, 1.1)}{kadin(t, 1160, 4, { face: "normal", look: -0.5 }, 1.05)}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="HASTALAR USTASI · EBELER" y={70} size={90} /> },
  { c: "Adı da buydu", r: (t, a, b) => again("Peki sarayın içinde", t, a, b, 0), html: (t, a, b) => htmlOf("Peki sarayın içinde", t, b) },
  { c: "Ama bir kızın her ay çektiği bu ağrı", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 500], kose(t, <>{nev(t, 960, { face: "sad", hands: "belly", bow: 0.4 }, 1.2)}</>, 0.6)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="BİLMİYORUZ" y={70} size={110} /> },
  { c: "Asıl bilgi yine kadınlardaydı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], hamam(t, <>{kadin(t, 600, 1, { sit: true, face: "smile", look: 0.4, talk: 1 }, 0.85, 860)}{kadin(t, 1300, 4, { sit: true, face: "smile", look: -0.4 }, 0.85, 860)}</>)) },
  { c: "Nevres'in en kötü gününde", tone: "cool", r: (t, a, b) => { const w1 = yurur(t, a, b, 300, 900, 0.98), w2 = yurur(t, a, b, 120, 700, 0.92); return C(t, a, b, [1.2, 1.3], [700, 620], hamam(t, <>{nev(t, w2.x, { walk: w2.walk, face: "sad", hands: "belly" })}{sev(t, w1.x, { walk: w1.walk, face: "worried", look: -0.4 })}</>, { seki: false })); } },
  { c: "Hamamın ortasındaki sıcak göbek taşına", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 900], hamam(t, null, { seki: false })),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="GÖBEK TAŞI" c={H.cobalt} /> },
  { c: "Sıcaklık karnının altından", tone: "warm", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 920], hamam(t, <><rect x={700} y={900} width={520} height={180} fill="#FFB070" opacity={0.15 + 0.1 * Math.sin(t * 2)} filter="url(#pBlur16)" /></>, { seki: false })) },
  { c: "Ağrı geçmiyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.7], [960, 520], hamam(t, <>{nev(t, 880, { sit: true, face: "closed" }, 0.95, 960)}{sev(t, 1120, { sit: true, face: "smile", look: -0.5 }, 0.95, 960)}</>, { seki: false })) },
  { c: "Ve Şevkidil ona yıllar önce", tone: "gold", r: (t, a, b) => C(t, a, b, [2.1, 2.3], [1000, 520], hamam(t, <>{nev(t, 880, { sit: true, face: "normal", look: 0.4 }, 0.95, 960)}{sev(t, 1120, { sit: true, face: "smile", look: -0.5, talk: 1 }, 0.95, 960)}<Fisilti x={1060} y={430} t={t} dir={-1} /></>, { seki: false })) },
  { c: "Bu bilgi hiçbir kitapta yazmıyordu", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.1], [960, 560], <ArsivDefter t={t} scan={0.7} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="300 YIL KAYBOLMADI" y={70} size={100} accent={H.gold} /> },
  { c: "Bir saniye dur ve şunu düşün", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], sor(t, a, "SAKLARDIM", "ANLATIRDIM")),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="SEN OLSAN?" y={820} size={110} /> },

  // ── 7 · SON ──
  { c: "Yoksa yeni gelen", r: (t, a, b) => again("Bir saniye dur ve şunu düşün", t, a, b, 0), html: (t, a, b) => htmlOf("Bir saniye dur ve şunu düşün", t, b) },
  { c: "Yıllar geçiyor", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 520], bahce(t, null, ramp(t, a, b) * 300)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="YILLAR SONRA" y={70} size={110} /> },
  { c: "Nevres artık yeni gelen bir kız değil", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 520], gun(t, <>{nevK(t, 960, { face: "normal" }, 1.15)}</>)) },
  { c: "Önce küçük kalfa oldu", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [700, 700], mer(t, 1, t < (a + b) / 2 ? 1 : 3, nevK(t, 0, { face: "smile" }, 0.32, 0)), [1100, 560]) },
  { c: "Ve gece herkes uyuduğunda", tone: "night", r: (t, a, b) => { const w = yurur(t, a, b, 1700, 300, 0.8); return C(t, a, b, [1.15, 1.2], [960, 600], yat(t, <>{nevK(t, w.x, { walk: w.walk, face: "normal", look: -0.3 }, 0.8, 760)}</>)); } },
  { c: "Hamamda duyduğu her şeyi unutmadı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 520], gun(t, <>{nevK(t, 960, { face: "smile" }, 1.15)}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="BİLEN KADIN KAYBOLMADI" y={70} size={96} accent={H.gold} /> },
  { c: "Kime ne zaman", r: (t, a, b) => again("Hamamda duyduğu her şeyi unutmadı", t, a, b, 0), html: (t, a, b) => htmlOf("Hamamda duyduğu her şeyi unutmadı", t, b) },
  { c: "Bir gece, uzaktan getirilmiş küçük bir kız", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2], [940, 900], yat(t, null, { hero: 2, eyes: "shock", lift: 0.4 })) },
  { c: "Yorganı lekenin üstüne çekmiş", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.12], [960, 560], yakin(t, { eyes: "worried", hand: 1 })) },
  { c: "Nevres onu görüyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.9, 2.1], [800, 560], yat(t, <>{nevK(t, 700, { face: "normal", look: 0.5 }, 0.8, 760)}</>, { hero: 2, eyes: "worried" })) },
  { c: "Bu yüzü tanıyor", tone: "night", r: (t, a, b) => C(t, a, b, [2.8, 3], [700, 360], yat(t, <>{nevK(t, 700, { face: "sad", look: 0.5 }, 0.8, 760)}</>, { hero: 2, eyes: "worried" })),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="BİR ZAMANLAR ONUN YÜZÜYDÜ" y={820} size={90} /> },
  { c: "Bağırmıyor", sfx: "drone", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [960, 560], kose(t, <>{nevK(t, 760, { face: "normal", look: 0.6 })}{yeni(t, 1180, { face: "worried", look: -0.6 })}</>, 1, { open: 0 })) },
  { c: "Kalkıyor", tone: "warm", r: (t, a, b) => { const w = yurur(t, a, b, 760, 1300, 1.08); return C(t, a, b, [1.2, 1.25], [1100, 560], kose(t, <>{nevK(t, w.x, { walk: w.walk, face: "normal", look: 0.5 })}{yeni(t, 700, { face: "worried", look: 0.6 })}</>, 1, { open: ramp(t, b - 0.6, b) })); } },
  { c: "Beyaz bir bohça çıkarıyor", sfx: "pop", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], kapali(t, <Sandik t={t} open={1} bohca={ramp(t, a + 0.3, a + 1.6)} />, "#2A1E16")) },
  { c: "Kızın eline tutuşturuyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 560], kose(t, <>{nevK(t, 820, { face: "smile", reach: 1, item: bohcaEl(t) })}{yeni(t, 1110, { face: "worried", reach: ramp(t, a + 0.3, a + 1), reachDir: -1 })}</>)) },
  { c: "Sonra elini onun omzuna koyuyor", tone: "gold", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 480], kose(t, <>{nevK(t, 860, { face: "smile", reach: ramp(t, a + 0.2, a + 1), look: 0.4 })}{yeni(t, 1080, { face: "shy", look: -0.4 })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="AYNI EL · AYNI OMUZ" y={70} size={96} accent={H.gold} /> },
  { c: "Korkma, diyor", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [880, 430], kose(t, <>{nevK(t, 860, { face: "smile", reach: 1, talk: 1, look: 0.4 })}{yeni(t, 1080, { face: "shy", look: -0.4 })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + 0.2} text={t < a + (b - a) * 0.6 ? "«KORKMA. KIZ OLDUN.»" : "«VE PİS DEĞİLSİN.»"} y={820} size={110} accent={H.gold} /> },
  { c: "Ertesi sabah, ona ince bir ip veriyor", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 560], gun(t, <>{nevK(t, 820, { face: "smile", reach: 1, look: 0.4 })}{yeni(t, 1100, { face: "smile", reach: 0.8, reachDir: -1, look: -0.4 })}</>)) },
  { c: "Ve ilk düğümü birlikte atıyorlar", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [300, 540], ip(t, ramp(t, a + 0.4, a + 1.6))) },
  { c: "Yıllar sonra, Nevres'e yeni bir ad", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.3], [960, 540], mer(t, 1, 4, nevK(t, 0, { face: "smile" }, 0.32, 0)), [1460, 420]),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="USTA" y={70} size={140} accent={H.gold} /> },
  { c: "Bir cariyenin o", r: (t, a, b) => again("Yıllar sonra, Nevres'e yeni bir ad", t, a, b, 0), html: (t, a, b) => htmlOf("Yıllar sonra, Nevres'e yeni bir ad", t, b) },
  { c: "Ve o merdivenin her basamağında", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.05], [960, 540], ip(t, 28)) },
  { c: "Bu son da, ipin kendisi gibi", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], mer(t, 1, 4)),
    html: (t, a) => <Tag t={t} at={a + 0.3} text="SON SAHNE BİZİM ANLATIMIMIZ · MERDİVEN GERÇEK" c={H.red} /> },
  { c: "Ama o merdiven", r: (t, a, b) => again("Bu son da, ipin kendisi gibi", t, a, b, 0), html: (t, a, b) => htmlOf("Bu son da, ipin kendisi gibi", t, b) },
  { c: "Bu hikâyedeki kızın gerçek adını", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.05], [960, 560], yat(t)) },
  { c: "Ama o gece söylenen o birkaç cümle", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], gun(t, <>{kal(t, 420, { face: "smile", look: 0.5 }, 1.0)}{nevK(t, 820, { face: "smile", look: 0.4 }, 1.0)}{yeni(t, 1180, { face: "smile", look: 0.3 })}{kiz(t, 1500, { face: "smile", look: -0.3 })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="KADINDAN KADINA · 300 YIL" y={70} size={96} accent={H.gold} /> },
  { c: "kadından kadına, 300", r: (t, a, b) => again("Ama o gece söylenen o birkaç cümle", t, a, b, 0), html: (t, a, b) => htmlOf("Ama o gece söylenen o birkaç cümle", t, b) },
  { c: "Belki senin ninene kadar", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [800, 560], ev(t, <>{anne(t, 760, { face: "smile", look: 0.4 })}{kiz(t, 1020, { face: "smile", look: -0.4 })}</>)) },
  { c: "Şimdi sana son bir soru", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="İLK KİME SÖYLEDİN?" y={420} size={110} accent={H.red} /> },
  { c: "Sen ilk kez regl olduğunda", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kartlar(t, a, ["ANNEME", "ABLAMA", "ARKADAŞIMA"], [H.red, H.cobalt, "#2E6A5A"], 0.9)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="VE SANA NE DEDİ?" y={820} size={96} /> },
  { c: "Ablana mı? Bir", r: (t, a, b) => again("Sen ilk kez regl olduğunda", t, a, b, 0), html: (t, a, b) => htmlOf("Sen ilk kez regl olduğunda", t, b) },
  { c: "Yorumlara yaz", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="KAYNAKLAR İLK YORUMDA 👇" y={420} size={100} /> },
  { c: "Ve eğer tarihin kadınlara ait", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [960, 540], bahce(t, null, 200)), html: (t, a) => <Abone t={t} at={a + 0.5} /> },
  { c: "Bir sonraki hikâyede görüşmek üzere", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1], [960, 540], yat(t)) },
];

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : s.c.startsWith("+") ? after - 0.2 + parseFloat(s.c) : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K3R_21_SECONDS));
  return raw;
})();

const VOL: Record<string, number> = { whoosh: 0.07, drone: 0.14, boom: 0.15, ding: 0.14, knock: 0.1, pop: 0.12, splash: 0.08 };
export const K3RVideo21: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K3R_21_SECONDS;
  const cut = 1 - ramp(t, s.from, s.from + 0.16);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: ramp(t, 0, 0.5) * (1 - ramp(t, END - 1.2, END)) }}>
        <PFrame>
          <LiveCam t={t} a={s.from}>{s.r(t, s.from, s.to)}</LiveCam>
          {s.fore && <Fore t={t} a={s.from} kind={s.fore} />}
          <Atmos t={t} tone={s.tone ?? "warm"} rays={s.tone === "night" ? 0.4 : 1} seed={n} />
          <Sweep t={t} a={s.from} />
          {cut > 0 && <rect width={1920} height={1080} fill="#FFF8E6" opacity={cut * 0.18} />}
        </PFrame>
        {s.html?.(t, s.from, s.to)}
      </AbsoluteFill>
      <Audio src={staticFile("audio/k3r-21.wav")} />
      {TIMED.map((x, i) => i > 0 && !(x.from > END - 19 && x.sfx && x.sfx !== "whoosh") && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.08) * fps))} durationInFrames={Math.round(2.2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.from > END - 19 ? 0.05 : VOL[x.sfx ?? "whoosh"] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const _k3r21Unused = { Belge, Disc, NameCard, Tag, Txt, H, Fore };

const AG = [[1.22, -90, -40], [1.3, 110, 30], [1.18, 0, 60]];
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
