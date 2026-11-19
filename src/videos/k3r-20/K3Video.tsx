import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k3r-20-words.json";
import { makeCue, ramp } from "../../lib/cues";
import { H, lerp } from "../../components/Harem";
import { Abone, Belge, Disc, NameCard, Paper, Tag, Txt } from "../../components/K3Text";
import { Atmos, Fore, LiveCam, Sweep, Tone } from "../../components/Live";
import { Birds, GalleryWall, HasBahce, Laleler, Motes, NightVeil, PCam, PFig, PFrame, proWalk, Samdan, ValideOda, Bebek } from "../../components/HaremPro";
import { KafesIc } from "../../components/HaremPrenses";
import { Tugra } from "../../components/HaremMahkeme";
import { ArsivDefter, AvrupaKitap, HaremKapi } from "../../components/HaremMendil";
import { TopkapiSalon } from "../../components/HaremSurgun";
import { AkdenizHarita, Atli, Bogaz, Bozkir, Deniz, IzliBebek, Kadirga, Kalyon, MaltaLiman, MermerHavuz, Samur, SamurOda, TopAtes, YeniCami } from "../../components/HaremTurhan";

// Kanal 1 · k3r-20 · "Deli İbrahim'in Hareminde Anne Olmak Neden Zordu?" — HaremPro + Turhan kiti (1640–1683).
// Sen: Turhan (gerçek kişi). Sultan İbrahim (samur kürk). Kösem (valide). Saliha Dilaşub. Zafire (süt anne) + Osman. Sünbül Ağa. Telli Haseki. Köprülü.
// BELGE 1: Peirce (1.300 / 1.000 akçe). BELGE 2: 28 Eylül 1644, Rodos açıkları (~380 esir). Kaleler 1658 (Thys-Şenocak). Yeni Cami 1665.

const ALT: Record<string, string[]> = {
  "Ağabeyi Sultan Murad": ["Abi Sultan Murat"], "Ağabeyinin cesedini görmeden": ["Abinin cesedini görmeden"],
  "Ve böylece, daha yirmili yaşlarında": ["Ve böylece daha 20'li yaşlarında"], "Ve İslam Ansiklopedisi'ne göre": ["ve İslam asiklopedisine göre"],
  "Bin altı yüz kırk iki yılının ikinci günü": ["1642 yılının ikinci günü"], "Saliha Dilaşub adında": ["Salihava Dilaşup adında"],
  "Senin oğlun Mehmed için de": ["Senin oğlun Mehmet için de"], "Mehmed'i sudan çıkardılar": ["Mehmet'i sudan çıkardılar"],
  "Kızlar Ağası Sünbül Ağa, padişahtan": ["Kızlar ağası Sümbülaha padişahtan"], "Ama Sünbül Ağa, bu yolculuğa": ["Ama Sümbüla bu yolculuğa"],
  "Ve bu savaş, tam yirmi dört yıl": ["Ve bu savaş tam 24 yıl"], "Ama Sultan İbrahim, Hümaşah adında": ["ama Sultan İbrahim Hümaşa adında"],
  "Hümaşah'ın saçları": ["Hümaşa'nın saçları"], "Önce sadrazamı öldürdüler": ["Önce Saldrazam'ı öldürdüler"],
  "Oğlun Mehmed'i almaya gelmişlerdi": ["Oğlun Mehmet'i almaya gelmişlerdi"], "Leslie Peirce'e göre, sonraki beş yıl": ["Leslie Peirce'e göre sonraki 5 yıl"],
  "Bir zamanlar on iki yaşında": ["Bir zamanlar 12 yaşında"], "Tarihçi Lucienne Thys-Şenocak": ["Tarihçi Lucian Tis Şenocak"],
  "Halk ona Avcı Mehmed dedi": ["Halk ona avcı Mehmet dedi"],
  "Peki sen Turhan'ın yerinde olsaydın": ["Peki, sen Turan'ın yerinde olsaydın"],
  "Bin altı yüz kırk üç civarı": ["1643 civarı"], "On iki yaşındaydın": ["12 yaşındaydın"], "Yirmi dört yıl sürecek": ["24 yıl sürecek"],
  "Önce ikisini": ["Önce ikisini, 1635'te"], "Sonra bir tanesini daha": ["Sonra bir tanesini daha, 1638'de"],
  "Sonra, bin altı yüz kırk yılının": ["Sonra 1640 yılının", "Sonra, 1640 yılının"], "Bin altı yüz kırk iki yılının": ["1642 yılının"],
  "Çünkü yüz beş gün sonra": ["Çünkü 105 gün sonra"], "Sultan İbrahim'in hasekileri, günde": ["Sultan İbrahim'in hasekileri günde"],
  "Ama bir tanesi, günde": ["Ama bir tanesi günde"], "Bin akçe ile bin üç yüz": ["1000 akçe ile 1300", "Bin akçe ile 1300", "Bin akçeyle bin üç yüz"],
  "Bin altı yüz kırk dört yılının yazı": ["1644 yılının yazı"], "Kafile, on gemiyle": ["Kafile 10 gemiyle", "Kafile, 10 gemiyle"],
  "Yirmi sekiz Eylül": ["28 Eylül"], "Ufukta altı kadırga": ["Ufukta 6 kadırga"], "Malta kayıtlarına göre": ["Malta kayıtlarına göre, o gün yaklaşık 380"],
  "Şövalyelerin ele geçirdiği": ["Şövalyelerin ele geçirdiği hazinenin"], "Bin altı yüz kırk beş baharında": ["1645 baharında"],
  "Peki ya Zafire": ["Peki ya Zafire?"], "Sonra, bin altı yüz kırk yedi": ["Sonra 1647", "Sonra, 1647"],
  "Haremdeki iki yüz seksen": ["Haremdeki 280"], "Bin altı yüz kırk sekiz yılının yazı": ["1648 yılının yazı"],
  "Sekiz Ağustos günü": ["8 Ağustos günü"], "Mehmed, altı yaşındaydı": ["Mehmed 6 yaşındaydı", "Mehmed, 6 yaşındaydı", "Mehmet 6 yaşındaydı"],
  "On gün sonra": ["10 gün sonra"], "Bin altı yüz elli bir": ["1651"], "Ve bin altı yüz elli altıda": ["Ve 1656'da"],
  "bin altı yüz elli sekizde": ["1658'de"], "Ve o havuzun kenarında başlayan savaş": ["Ve o havuzun kenarında başlayan savaş, 1669"],
  "Bin altı yüz altmış beşte": ["1665'te"], "Sen, bin altı yüz seksen üç": ["Sen 1683", "Sen, 1683"], "Oğlun Mehmed, tam otuz dokuz": ["Oğlun Mehmed tam 39", "Oğlun Mehmet tam 39"],
  "Ve o otuz dokuz yıl boyunca": ["Ve o 39 yıl boyunca"], "Zafire": ["Zafer", "Zafira"], "Sünbül Ağa": ["Sümbül Ağa"],
  "Kızlar Ağası Sünbül Ağa": ["Kızlar Ağası Sümbül Ağa"], "Zafire'yi saraya getiren": ["Zafer'i saraya getiren", "Zafire'i saraya getiren"],
};
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const VAR: [RegExp, string][] = [[/â/g, "a"], [/î/g, "i"], [/û/g, "u"]];
const variants = (p: string) => { const out = [p]; for (const [re, to] of VAR) for (const v of [...out]) { const n = v.replace(re, to); if (n !== v) out.push(n); } return out; };
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K3R_20_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone; fore?: "column" | "curtain" | "lamp" };
type PO = Partial<React.ComponentProps<typeof PFig>>;

// ── karakterler ──
const Y = 1005;
const tur = (t: number, x: number, o: PO = {}, s = 1.1, y = Y) => <PFig x={x} y={y} s={s} kind="girl" robe="#2E6A5A" robe2="#EFE6D4" scarf="#F2E6D0" t={t} seed={3} {...o} />;
const turK = (t: number, x: number, o: PO = {}, s = 0.74) => <PFig x={x} y={Y} s={s} kind="girl" plain robe="#7A5A3A" robe2="#E9DCC2" scarf="#D8C8A8" t={t} seed={3} {...o} />; // köylü çocuk
const turV = (t: number, x: number, o: PO = {}, s = 1.14) => <PFig x={x} y={Y} s={s} kind="valide" robe="#1F4A40" robe2="#F1E3C6" t={t} seed={3} {...o} />; // naibe Turhan
const ibr = (t: number, x: number, o: PO = {}, s = 1.16, y = Y) => <PFig x={x} y={y} s={s} kind="sultan" robe="#5A3A26" robe2="#E9DCC2" t={t} seed={11} {...o} />;
const kos = (t: number, x: number, o: PO = {}, s = 1.14) => <PFig x={x} y={Y} s={s} kind="valide" robe="#4A2A5A" robe2="#EFE2C8" t={t} seed={14} {...o} />;
const sal = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="girl" robe="#6E1F3A" robe2="#F1E3C6" scarf="#F7F2E6" t={t} seed={9} {...o} />;
const zaf = (t: number, x: number, o: PO = {}, s = 1.1, y = Y) => <PFig x={x} y={y} s={s} kind="girl" plain robe="#8A6A3A" robe2="#EFE6D4" scarf="#E9DCC2" t={t} seed={7} {...o} />;
const sun = (t: number, x: number, o: PO = {}, s = 1.16) => <PFig x={x} y={Y} s={s} kind="prince" plain robe="#1E2A3A" robe2="#C9A35A" t={t} seed={21} {...o} />;
const tel = (t: number, x: number, o: PO = {}, s = 1.08) => <PFig x={x} y={Y} s={s} kind="girl" robe="#B8323A" robe2="#F7E2B0" scarf="#F7F2E6" t={t} seed={20} {...o} />;
const kop = (t: number, x: number, o: PO = {}, s = 1.12) => <PFig x={x} y={Y} s={s} kind="prince" plain robe="#3A4A3A" robe2="#E2D9C6" t={t} seed={33} {...o} />;
const meh = (t: number, x: number, o: PO = {}, s = 0.56) => <PFig x={x} y={Y} s={s} kind="prince" robe="#C9A35A" robe2="#F2E6D0" t={t} seed={25} {...o} />;
const kalfa = (t: number, x: number, o: PO = {}, s = 1.08) => <PFig x={x} y={Y} s={s} kind="kalfa" robe="#4A5A4A" robe2="#E2D9C6" t={t} seed={5} {...o} />;
const kadin = (t: number, x: number, i: number, o: PO = {}, s = 1.0) => <PFig key={`k${i}`} x={x} y={Y} s={s} kind="girl" robe={["#7A5A6A", "#5A6A7A", "#8A6A4A", "#6A7A5A", "#9A6A6A"][i % 5]} robe2="#EFE6D4" scarf={["#F2E6D0", "#E9DCC2", "#D8C8A8"][i % 3]} t={t} seed={30 + i} {...o} />;
const erkek = (t: number, x: number, i: number, o: PO = {}, s = 1.05) => <PFig key={`e${i}`} x={x} y={Y} s={s} kind="prince" plain fes robe={["#4A3A2A", "#3A4A5A", "#5A4A3A", "#8A2A22"][i % 4]} robe2="#E2D9C6" t={t} seed={50 + i} {...o} />;
const bb = (t: number, o: { cry?: number; wet?: number; mark?: number } = {}) => <IzliBebek t={t} cry={o.cry ?? 0} wet={o.wet ?? 0} mark={o.mark ?? 0} />;

// ── mekânlar ──
const C = (t: number, a: number, b: number, z: [number, number], c0: [number, number], kids: React.ReactNode, c1?: [number, number]) => <PCam t={t} a={a} b={b} z={z} c0={c0} c1={c1}>{kids}</PCam>;
const PY = 838; // havuzun arkasında duranların ayak hizası
const havuz = (t: number, figs: React.ReactNode = null, o: { splash?: number; ripple?: number; pan?: number; sx?: number; dusk?: number; front?: React.ReactNode } = {}) => (
  <><HasBahce t={t} pan={o.pan ?? 0} /><Birds t={t} />{figs}<MermerHavuz x={960} y={1010} s={0.82} t={t} splash={o.splash ?? 0} ripple={o.ripple ?? 0.3} sx={o.sx ?? 0} />{o.front}
    {(o.dusk ?? 0) > 0 && <NightVeil id="nvHv" k={0.5 * (o.dusk ?? 0)} lights={[{ x: 960, y: 600, r: 600 }]} t={t} />}<Motes t={t} n={20} op={0.35} /></>
);
const daire = (t: number, figs: React.ReactNode = null, night = 0) => (
  <><ValideOda t={t} win={night ? 0.95 : 0.2} />{figs}{night > 0 && <NightVeil id="nvDa" k={0.55 * night} lights={[{ x: 960, y: 420, r: 560 }, { x: 960, y: 820, r: 420, f: 0.8 }]} t={t} />}<Motes t={t} n={24} op={0.4} /></>
);
const koridor = (t: number, figs: React.ReactNode = null, night = 0, camX = 0) => <><GalleryWall t={t} camX={camX} night={night} />{figs}<Motes t={t} n={28} op={0.4} /></>;
const bahce = (t: number, figs: React.ReactNode = null, pan = 0, night = 0) => (
  <><HasBahce t={t} pan={pan} /><Birds t={t} /><Laleler x={1380} y={890} n={10} t={t} s={0.8} />{figs}<Laleler x={-60} y={1130} n={7} t={t} s={1.7} blur={8} />{night > 0 && <NightVeil id="nvBa" k={0.75 * night} lights={[{ x: 960, y: 500, r: 420 }]} t={t} />}</>
);
const kafes = (t: number, figs: React.ReactNode = null, dusk = 0.6) => <><KafesIc t={t} dusk={dusk} />{figs}<Motes t={t} n={18} op={0.3} /></>;
const topk = (t: number, figs: React.ReactNode = null, pan = 0) => <><TopkapiSalon t={t} pan={pan} />{figs}<Motes t={t} n={30} op={0.4} /></>;
const samur = (t: number, figs: React.ReactNode = null, k = 1, night = 0) => <><SamurOda t={t} k={k} night={night} />{figs}</>;
const kapali = (t: number, kids: React.ReactNode, bg = "#2A1E16") => <><rect width={1920} height={1080} fill={bg} />{kids}<Motes t={t} n={24} op={0.4} /></>;
const deniz = (t: number, kids: React.ReactNode = null, o: { night?: number; storm?: number; pan?: number; island?: "none" | "rodos" | "girit" | "malta" } = {}) => <><Deniz t={t} night={o.night ?? 0} storm={o.storm ?? 0} pan={o.pan ?? 0} island={o.island ?? "none"} />{kids}</>;
const kafile = (t: number, a: number, b: number, dark = 0) => <>{[0, 1, 2].map((i) => <Kalyon key={i} x={lerp(300 + i * 520, 420 + i * 520, ramp(t, a, b))} y={620 + (i % 2) * 40} s={0.3 + (i === 1 ? 0.12 : 0)} t={t + i} dark={dark} />)}</>;
const kadirgalar = (t: number, a: number, b: number, k = 1) => <>{[0, 1, 2, 3, 4, 5].map((i) => <Kadirga key={i} x={lerp(2100 + i * 160, 1500 + i * 110, ramp(t, a, b) * k)} y={590 + (i % 3) * 22} s={0.18 + (i % 2) * 0.04} t={t + i} dir={-1} />)}</>;
const harita = (t: number, a: number, b: number, o: { route?: [number, number]; hl?: string; girit?: number; show?: string[] } = {}) => (
  <AkdenizHarita t={t} route={o.route ? lerp(o.route[0], o.route[1], ramp(t, a, b)) : 0} hl={o.hl} girit={o.girit ?? 0} show={o.show} />
);
const yurur = (t: number, a: number, b: number, x0: number, x1: number, s = 1.0) => ({ x: lerp(x0, x1, ramp(t, a, b)), walk: proWalk(t, a, b, x0, x1, s).walk });

const SHOTS: Sh[] = [
  // ── AN: havuz, ~1643 ──
  { c: "Topkapı Sarayı", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 520], bahce(t, null, ramp(t, a, b) * 200)),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="TOPKAPI SARAYI · HAREM BAHÇESİ" c={H.red} /> },
  { c: "Bin altı yüz kırk üç civarı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 560], havuz(t, null, { ripple: 0.1 })),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="~1643" y={70} size={130} accent={H.gold} /> },
  { c: "Bahçenin ortasında, mermerden", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 900], havuz(t, null, { ripple: 0.05 })) },
  { c: "Üstünde, sonbahar yaprakları", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [760, 960], havuz(t, null, { ripple: 0.05 })) },
  { c: "Ve sen, o havuzun kenarına koşuyorsun", sfx: "whoosh", tone: "warm", r: (t, a, b) => { const w = yurur(t, a, b, 200, 820, 1.3); return C(t, a, b, [1.3, 1.45], [700, 700], havuz(t, <>{tur(t, w.x, { walk: w.walk, face: "shock", look: 0.6 }, 0.95, PY)}</>, { ripple: 0.9 })); } },
  { c: "Ayakkabıların ayağından fırlamış", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [820, 780], havuz(t, <>{tur(t, 820, { face: "shock", reach: 0.8, look: 0.5 }, 0.95, PY)}</>, { ripple: 0.9 })) },
  { c: "Çünkü az önce, suya bir şey düştü", sfx: "splash", tone: "cool", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 960], havuz(t, null, { ripple: 1, splash: ramp(t, a + 0.2, a + 1.6) })) },
  { c: "O şey, senin oğlun", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], kapali(t, <g transform="translate(960,560) scale(3)">{bb(t, { cry: 0.6 })}</g>, "#1A2430")),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="SENİN OĞLUN" y={820} size={120} accent={H.red} /> },
  { c: "Henüz bir bebek", tone: "warm", r: (t, a, b) => again("O şey, senin oğlun", t, a, b, 1) },
  { c: "Osmanlı tahtının ilk varisi", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], kapali(t, <><Tugra x={960} y={460} s={2.2} k={ramp(t, a, a + 1.4)} /></>, "#2A1E16")),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="TAHTIN İLK VARİSİ" y={820} size={100} accent={H.gold} /> },
  { c: "Ve bunu yapan kişi", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [1150, 600], havuz(t, <>{ibr(t, 1150, { face: "worried", look: -0.4 }, 1.0, PY)}</>, { ripple: 1, dusk: 0.7 })),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="BABASI" y={70} size={130} accent={H.red} /> },
  { c: "Osmanlı padişahı, Sultan İbrahim", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [1150, 520], havuz(t, <>{ibr(t, 1150, { face: "worried", look: -0.4 }, 1.0, PY)}</>, { ripple: 1, dusk: 0.7 })),
    html: (t, a) => <NameCard t={t} at={a + 0.3} name="SULTAN İBRAHİM" sub="Osmanlı padişahı · 1640–1648" c="#5A3A26" /> },
  { c: "Su çalkalanıyor", sfx: "splash", tone: "cool", r: (t, a, b) => C(t, a, b, [1.8, 2.1], [960, 980], havuz(t, null, { ripple: 1.2, splash: ramp(t, a, a + 1.2) * 0.8 })) },
  { c: "Birileri havuza atlıyor", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 760], havuz(t, <>{kalfa(t, lerp(1300, 1060, ramp(t, a, a + 0.8)), { face: "shock", reach: 1, reachDir: -1 }, 0.95)}{kadin(t, lerp(600, 860, ramp(t, a, a + 0.8)), 1, { face: "shock", reach: 1 }, 0.92)}</>, { ripple: 1.2, splash: ramp(t, a + 0.5, a + 1.7) })) },
  { c: "Sen bağırıyor musun", tone: "warm", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [820, 560], havuz(t, <>{tur(t, 820, { face: "shock", reach: 1, look: 0.6 }, 0.95, PY)}</>, { ripple: 1 })) },
  { c: "Sadece suyun", tone: "cool", r: (t, a, b) => C(t, a, b, [2.6, 3], [960, 1000], havuz(t, null, { ripple: 1.3 })) },
  { c: "Senin adın Turhan", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 600], daire(t, <>{tur(t, 960, { face: "worried" }, 1.3)}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.3} name="TURHAN" sub="Şehzade Mehmed'in annesi · gerçek bir kadın" c="#2E6A5A" /> },
  { c: "Ve bu, uydurma bir hikâye değil", r: (t, a, b) => again("Senin adın Turhan", t, a, b, 1), html: (t, a, b) => htmlOf("Senin adın Turhan", t, b) },
  { c: "O gün o havuzdan çıkarılan bebek", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 560], havuz(t, <>{tur(t, 960, { face: "sad", hands: "baby", baby: bb(t, { cry: 0.8, wet: 1, mark: 0 }) }, 1.0, PY)}</>, { ripple: 0.5 })) },
  { c: "Ama alnında bir iz kaldı", sfx: "drone", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 540], kapali(t, <g transform="translate(960,560) scale(3.4)">{bb(t, { mark: ramp(t, a + 0.3, a + 1.2) })}</g>, "#2A1E16")),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="ALNINDA BİR İZ" y={820} size={110} accent={H.red} /> },
  { c: "Ömrünün sonuna kadar silinmeyen", r: (t, a, b) => again("Ama alnında bir iz kaldı", t, a, b, 0) },
  { c: "Ve şimdi sana inanması zor", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], havuz(t, null, { ripple: 0.3, pan: 100 })) },
  { c: "Bu havuzun kenarında başlayan kıskançlık", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], deniz(t, <>{kafile(t, a, b)}{kadirgalar(t, a, b)}</>, { pan: ramp(t, a, b) * 200 })),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="KISKANÇLIK → GEMİ BASKINI" y={70} size={80} /> },
  { c: "ve oradan da", r: (t, a, b) => again("Bu havuzun kenarında başlayan kıskançlık", t, a, b, 0) },
  { c: "Yirmi dört yıl sürecek", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], harita(t, a, b, { girit: ramp(t, a, a + 1.4), hl: "girit" })),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="24 YIL SÜRECEK BİR SAVAŞ" y={70} size={96} accent={H.red} /> },
  { c: "Bugün, Deli İbrahim diye bilinen", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={600} y={440} r={220} k={ramp(t, a + 0.2, a + 0.7)} c="#5A3A26" label="DELİ İBRAHİM" /><Disc x={1320} y={440} r={220} k={ramp(t, a + 1.6, a + 2.1)} c="#2E6A5A" label="ANNENİN GÖZÜ" /></>) },
  { c: "neden bu kadar", r: (t, a, b) => again("Bugün, Deli İbrahim diye bilinen", t, a, b, 0) },
  { c: "Ve en sonda, bu sudan oğlunu", tone: "cool", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 560], <Bogaz t={t} build={ramp(t, a, b)} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="KOCA BİR DENİZİ KAPATAN ANNE" y={70} size={80} accent={H.gold} /> },
  { c: "Eğer bu hikâyenin sonunu merak", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.1], [960, 560], daire(t, <>{tur(t, 960, { face: "normal", hands: "baby", baby: bb(t, { mark: 1 }) }, 1.2)}</>)),
    html: (t, a) => <Abone t={t} at={a + 0.4} /> },
  { c: "Çünkü bu kanalda Osmanlı sarayını", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 540], bahce(t, <>{[0, 1, 2].map((i) => kadin(t, 600 + i * 360, i, { face: "smile", look: 0.2 }))}</>, ramp(t, a, b) * 200)), html: (t, a, b) => htmlOf("Eğer bu hikâyenin sonunu merak", t, b) },

  // ── KİMSİN ──
  { c: "Ama önce, en başa dönelim", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.05], [960, 540], <Bozkir t={t} pan={ramp(t, a, b) * 300} />) },
  { c: "Kaynaklara göre, sen kuzeyde doğdun", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], <Bozkir t={t} pan={200 + ramp(t, a, b) * 400} />),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="KUZEY · RUS / UKRAYNA BOZKIRLARI" c={H.green} /> },
  { c: "Rus ya da Ukrayna topraklarında", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [700, 700], <><Bozkir t={t} pan={600} />{turK(t, 900, { face: "smile", look: 0.3 })}{kadin(t, 1120, 2, { face: "smile", look: -0.4 })}</>) },
  { c: "Gerçek adını bugün kimse bilmiyor", tone: "cool", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [900, 600], <><Bozkir t={t} pan={600} />{turK(t, 900, { face: "normal", look: 0.1 })}</>),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="GERÇEK ADI: ?" y={70} size={100} /> },
  { c: "Çocukken, köyünüze Kırım atlıları geldi", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 600], <Bozkir t={t} raid={ramp(t, a, a + 1)} pan={ramp(t, a, b) * 200} />),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="KIRIM ATLILARI" c={H.red} /> },
  { c: "O yıllarda bu baskınlar sık olurdu", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 760], <Bozkir t={t} raid={1} pan={300} />) },
  { c: "Atlılar köyleri basar", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], <Bozkir t={t} raid={1} dusk={0.6} pan={500 + ramp(t, a, b) * 200} />) },
  { c: "Seni de aldılar", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [2, 2.3], [900, 600], <><Bozkir t={t} raid={0.6} dusk={1} pan={600} />{turK(t, 900, { face: "shock", look: 0.5 })}</>) },
  { c: "On iki yaşındaydın", tone: "night", r: (t, a, b) => again("Seni de aldılar", t, a, b, 1),
    html: (t, a) => <Tag t={t} at={a + 0.3} text="12 YAŞINDA" c={H.green} /> },
  { c: "Önce at sırtında", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 700], <><Bozkir t={t} dusk={0.8} pan={ramp(t, a, b) * 600} /><Atli x={lerp(300, 1500, ramp(t, a, b))} y={1010} s={1.2} t={t} /></>) },
  { c: "sonra bir geminin ambarında", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 560], deniz(t, <Kalyon x={960} y={640} s={0.6} t={t} dark={0.7} lamp={1} />, { night: 1, pan: ramp(t, a, b) * 200 })) },
  { c: "Karadeniz'i geçtiniz", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], deniz(t, <Kalyon x={lerp(500, 1300, ramp(t, a, b))} y={620} s={0.4} t={t} dark={0.7} lamp={1} />, { night: 1 })),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="KARADENİZ" c={H.cobalt} /> },
  { c: "Ve bir sabah, karşında kubbeler", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 540], <YeniCami t={t} k={0} pan={ramp(t, a, b) * 200} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="İSTANBUL" y={70} size={140} accent={H.gold} /> },
  { c: "Ama sen bir pazarda satılmadın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 600], topk(t, <>{turK(t, 960, { face: "worried", look: 0.2 }, 0.8)}</>, 200)) },
  { c: "Kör Süleyman Paşa adında", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], topk(t, <>{erkek(t, 760, 0, { face: "normal", look: 0.4 }, 1.12)}{turK(t, 1080, { face: "worried", look: -0.3 }, 0.8)}</>, 260)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="KÖR SÜLEYMAN PAŞA" sub="Seni hediye olarak saraya gönderdi" c="#4A3A2A" /> },
  { c: "Ve bu hediyeyi alan kişi", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [1150, 560], daire(t, <>{kos(t, 1150, { face: "normal", look: -0.3 })}{turK(t, 760, { face: "shy", bow: 0.4 }, 0.8)}</>)) },
  { c: "Kösem Sultan", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [2, 2.2], [1150, 520], daire(t, <>{kos(t, 1150, { face: "normal", look: -0.2 })}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.3} name="KÖSEM SULTAN" sub="Valide sultan · padişahın annesi" c="#4A2A5A" /> },
  { c: "O yıllarda Kösem, valide sultandı", r: (t, a, b) => again("Kösem Sultan", t, a, b, 1) },
  { c: "Ve haremde, onun bilmediği", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], <HaremKapi t={t} open={0} lock />) },
  { c: "Sana yeni bir ad verdiler", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], daire(t, <>{kos(t, 1160, { face: "normal", look: -0.5, talk: 1 })}{turK(t, 780, { face: "normal", look: 0.5 }, 0.82)}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="TURHAN" y={70} size={150} accent={H.gold} /> },
  { c: "Bazıları bu adın asil", r: (t, a, b) => again("Sana yeni bir ad verdiler", t, a, b, 1), html: (t, a, b) => htmlOf("Sana yeni bir ad verdiler", t, b) },
  { c: "Geçmişin, köyün, annenin", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.05], [960, 540], <HaremKapi t={t} open={1 - ramp(t, a + 0.3, a + 2.4)} lock={false} />) },
  { c: "Sonra eğitim başladı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], daire(t, <>{kalfa(t, 1200, { face: "normal", look: -0.5, talk: 1 })}{[0, 1, 2].map((i) => kadin(t, 560 + i * 200, i, { face: "normal", sit: true, look: 0.4 }, 0.85))}</>)) },
  { c: "Eğilmek, susmak, beklemek", tone: "warm", r: (t, a, b) => C(t, a, b, [2, 2.2], [900, 600], daire(t, <>{turK(t, 900, { face: "closed", bow: ramp(t, a, a + 1) * 0.6 }, 0.86)}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="EĞİL · SUS · BEKLE" y={820} size={100} /> },
  { c: "Ama sen, sıradan bir kız", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 560], daire(t, <>{tur(t, 960, { face: "normal", look: 0.2 }, 1.1)}</>)) },
  { c: "Çünkü Kösem Sultan'ın, seni seçmek", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2], [1150, 520], daire(t, <>{kos(t, 1150, { face: "normal", look: -0.3 })}</>, 1)) },

  // ── KAFES ──
  { c: "Bu sebebi anlamak için", sfx: "whoosh", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 540], koridor(t, null, 1, ramp(t, a, b) * 500)) },
  { c: "Kafes", sfx: "knock", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.1], [960, 540], kafes(t, null, 0.8)),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="KAFES" y={70} size={150} accent={H.red} /> },
  { c: "Kafes, aslında bir kafes değildi", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], kafes(t, null, 0.8)) },
  { c: "Pencereleri yüksek, kapısı hep kilitli", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 380], kafes(t, null, 0.8)) },
  { c: "Padişahın kardeşleri, yıllarca", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], kafes(t, <>{erkek(t, 700, 1, { face: "sad", sit: true }, 1)}{erkek(t, 1220, 2, { face: "worried", look: -0.3 }, 1)}</>, 0.8)) },
  { c: "Her gün kapının açılmasını", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], <HaremKapi t={t} open={0} turn={Math.sin(t * 3) * 0.1} lock />) },
  { c: "Kösem Sultan'ın oğullarından biri", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], kafes(t, <>{ibr(t, 960, { face: "worried", plain: true, look: 0.2 }, 1.1)}</>, 0.8)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="ŞEHZADE İBRAHİM" sub="Kafeste büyüdü" c="#5A3A26" /> },
  { c: "Ağabeyi Sultan Murad", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 560], topk(t, <>{erkek(t, 960, 3, { face: "normal", look: 0 }, 1.25)}</>, 100)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="IV. MURAD" sub="Ağabeyi · padişah" c="#8A2A22" /> },
  { c: "Önce ikisini", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper c="#2A1E16" /><Disc x={600} y={440} r={200} k={ramp(t, a + 0.2, a + 0.6)} c={H.red} label="1635 · 2" /><Disc x={1320} y={440} r={200} k={ramp(t, a + 1.6, a + 2)} c={H.red} label="1638 · 1" /></>) },
  { c: "Kafeste geriye sadece İbrahim kaldı", tone: "night", r: (t, a, b) => C(t, a, b, [2, 2.2], [960, 560], kafes(t, <>{ibr(t, 960, { face: "worried", plain: true, look: 0.4 }, 1.1)}</>, 0.9)) },
  { c: "Ve her ayak sesinde", sfx: "knock", tone: "night", r: (t, a, b) => again("Kafeste geriye sadece İbrahim kaldı", t, a, b, 1) },
  { c: "Sonra, bin altı yüz kırk yılının", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], topk(t, null, 300)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="ŞUBAT 1640 · IV. MURAD ÖLDÜ" y={70} size={86} /> },
  { c: "Murad öldü ve", r: (t, a, b) => again("Sonra, bin altı yüz kırk yılının", t, a, b, 0) },
  { c: "Kapıyı açtılar", sfx: "knock", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], <HaremKapi t={t} open={ramp(t, a + 0.2, a + 1.6)} lock={false} />) },
  { c: "Ama İbrahim inanmadı", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 560], kafes(t, <>{ibr(t, 960, { face: "shock", plain: true, look: 0.3, bow: 0.3 }, 1.1)}</>, 0.9)) },
  { c: "Ağabeyinin cesedini görmeden", r: (t, a, b) => again("Ama İbrahim inanmadı", t, a, b, 0) },
  { c: "Ve böylece, daha yirmili yaşlarında", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], topk(t, <>{ibr(t, 960, { face: "worried", look: 0.1 }, 1.2)}{erkek(t, 600, 0, { bow: 0.6, face: "closed" })}{erkek(t, 1320, 1, { bow: 0.6, face: "closed" })}</>, 200)),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="9 ŞUBAT 1640 · SULTAN İBRAHİM" c="#5A3A26" /> },
  { c: "geçirmiş bir adam", r: (t, a, b) => again("Ve böylece, daha yirmili yaşlarında", t, a, b, 0) },
  { c: "Ama asıl tehlike şuydu", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], kapali(t, <><Tugra x={960} y={420} s={1.8} k={1} c="#6A5A3A" /></>, "#1A1418")),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="HANEDANIN SON ERKEĞİ" y={820} size={100} accent={H.red} /> },
  { c: "Eğer ona bir şey olursa", r: (t, a, b) => again("Ama asıl tehlike şuydu", t, a, b, 0),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="300+ YILLIK HANEDAN BİTERDİ" y={70} size={80} /> },
  { c: "Kösem Sultan'ın tek bir hedefi vardı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [1100, 540], daire(t, <>{kos(t, 1100, { face: "normal", look: -0.2 })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="BİR VARİS" y={820} size={120} accent={H.gold} /> },
  { c: "Ve bu yüzden, oğluna kızlar", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], koridor(t, <>{kos(t, 1400, { face: "normal", look: -0.6 })}{[0, 1, 2, 3].map((i) => kadin(t, 400 + i * 230, i, { face: "shy", bow: 0.3, look: 0.5 }))}</>, 0, ramp(t, a, b) * 300)) },
  { c: "Ve İslam Ansiklopedisi'ne göre", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <AvrupaKitap t={t} k={ramp(t, a, a + 1)} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="İLK SUNULAN: TURHAN" y={70} size={96} accent={H.gold} /> },

  // ── OĞUL ──
  { c: "O günden sonra, hayatın bir yarışa", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], koridor(t, <>{tur(t, 960, { face: "worried", look: 0.2 })}</>, 0, 200 + ramp(t, a, b) * 300)) },
  { c: "Çünkü sen tek değildin", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], koridor(t, <>{[0, 1, 2].map((i) => kadin(t, 420 + i * 260, i + 1, { face: "normal", look: 0.3 }))}{tur(t, 1350, { face: "worried", look: -0.5 })}</>, 0, 500)) },
  { c: "Kim ilk oğlu doğuracak", tone: "gold", r: (t, a, b) => again("Çünkü sen tek değildin", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="KİM İLK OĞLU DOĞURACAK?" y={70} size={90} /> },
  { c: "Sen kazandın", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 560], daire(t, <>{tur(t, 960, { face: "smile", hands: "baby", baby: bb(t) })}</>)) },
  { c: "Bin altı yüz kırk iki yılının ikinci günü", tone: "gold", r: (t, a, b) => again("Sen kazandın", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="2 OCAK 1642 · ŞEHZADE MEHMED" y={70} size={86} accent={H.gold} /> },
  { c: "Ve sarayın toplarının", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], <><YeniCami t={t} k={0} night={0} pan={100} /><TopAtes x={360} y={760} t={t} at={a + 0.3} s={1.2} /><TopAtes x={1500} y={760} t={t} at={a + 1.1} s={1.2} /></>) },
  { c: "O toplar, senin için atılıyordu", r: (t, a, b) => again("Sen kazandın", t, a, b, 0) },
  { c: "Bir anda, her şey değişti", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], daire(t, <>{tur(t, 960, { face: "smile", look: 0.1 }, 1.2)}{kalfa(t, 600, { bow: 0.5, face: "closed" })}{kalfa(t, 1320, { bow: 0.5, face: "closed" })}</>)) },
  { c: "Haseki'ydin", tone: "gold", r: (t, a, b) => again("Bir anda, her şey değişti", t, a, b, 1),
    html: (t, a) => <NameCard t={t} at={a + 0.2} name="HASEKİ" sub="Padişaha şehzade doğurmuş kadın" c="#2E6A5A" /> },
  { c: "Kendi dairen, kendi", r: (t, a, b) => again("Haseki'ydin", t, a, b, 0) },
  { c: "Ama sevincin uzun sürmedi", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [2, 2.2], [960, 560], daire(t, <>{tur(t, 960, { face: "worried", look: 0.4 })}</>)) },
  { c: "Çünkü yüz beş gün sonra", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], <><YeniCami t={t} k={0} pan={150} /><TopAtes x={900} y={760} t={t} at={a + 0.6} s={1.2} /></>),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="105 GÜN SONRA" y={70} size={120} /> },
  { c: "Saliha Dilaşub adında", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 560], daire(t, <>{sal(t, 960, { face: "smile", hands: "baby", baby: <Bebek t={t} /> })}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="SALİHA DİLAŞUB" sub="Şehzade Süleyman'ın annesi" c="#6E1F3A" /> },
  { c: "Şimdi haremde iki bebek vardı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], daire(t, <>{tur(t, 640, { face: "worried", hands: "baby", baby: bb(t), look: 0.5 })}{sal(t, 1280, { face: "normal", hands: "baby", baby: <Bebek t={t} />, look: -0.5 })}</>)) },
  { c: "Ve aralarında sadece üç buçuk ay", r: (t, a, b) => again("Şimdi haremde iki bebek vardı", t, a, b, 0),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="ARALARINDA 3,5 AY" y={70} size={110} /> },
  { c: "Bu sarayda bunun ne anlama", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={600} y={440} r={220} k={ramp(t, a + 0.5, a + 1)} c={H.red} label="BÜYÜK OĞUL?" /><Disc x={1320} y={440} r={220} k={ramp(t, a + 2, a + 2.5)} c={H.gold} label="GÜÇLÜ ANNE!" /></>) },
  { c: "En büyük oğul olmak", r: (t, a, b) => again("Bu sarayda bunun ne anlama", t, a, b, 0) },
  { c: "Kimin annesinin daha akıllı", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 560], daire(t, <>{tur(t, 640, { face: "normal", look: 0.5 })}{sal(t, 1280, { face: "normal", look: -0.5 })}</>, 1)) },
  { c: "Yani o gün, iki bebek beşikte uyurken", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 600], kapali(t, <><g transform="translate(700,620) scale(1.6)"><Bebek t={t} /></g><g transform="translate(1220,620) scale(1.6)"><Bebek t={t} /></g><Samdan x={960} y={880} t={t} /></>, "#1A1424")) },
  { c: "Ve bu savaşın silahı kılıç değildi", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], koridor(t, <>{[0, 1, 2].map((i) => kalfa(t, 600 + i * 340, { face: "normal", talk: i % 2, look: i === 1 ? -0.5 : 0.5 }))}</>, 1, 300)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="SİLAH: FISILTI" y={70} size={110} /> },
  { c: "Peki padişah hangisini daha çok", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], <ArsivDefter t={t} scan={0} />) },

  // ── BELGE 1 ──
  { c: "Tarihçi Leslie Peirce", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <AvrupaKitap t={t} k={ramp(t, a, a + 1)} />),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="LESLIE PEIRCE" sub="The Imperial Harem · 1993" c="#3A4A5A" /> },
  { c: "Sultan İbrahim'in hasekileri, günde", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <ArsivDefter t={t} scan={ramp(t, a, b)} />),
    html: (t, a) => <Belge t={t} at={a + 0.3} date="Sultan İbrahim · haseki maaşları" src="Kaynak: Leslie Peirce, The Imperial Harem (1993)">Hasekiler: günde <b>1.000 akçe</b></Belge> },
  { c: "Ama bir tanesi, günde", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <ArsivDefter t={t} scan={1} />),
    html: (t, a) => <Belge t={t} at={a + 0.1} date="Sultan İbrahim · haseki maaşları" src="Kaynak: Leslie Peirce, The Imperial Harem (1993)">Hasekiler: günde 1.000 akçe<br /><span style={{ color: "#B8322E" }}>Saliha Dilaşub: günde 1.300 akçe</span></Belge> },
  { c: "Sen değil", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [960, 560], daire(t, <>{tur(t, 960, { face: "sad", hands: "baby", baby: bb(t) })}</>, 0.6)),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="SEN DEĞİL." y={820} size={130} accent={H.red} /> },
  { c: "Bunu bir düşün", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 560], daire(t, <>{tur(t, 960, { face: "sad", look: 0.3 })}</>, 0.6)) },
  { c: "Ama maaş defterinde", r: (t, a, b) => again("Ama bir tanesi, günde", t, a, b, 0), html: (t, a, b) => htmlOf("Ama bir tanesi, günde", t, b) },
  { c: "Bin akçe ile bin üç yüz", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={600} y={440} r={220} k={ramp(t, a + 0.3, a + 0.8)} c="#2E6A5A" label="1.000" /><Disc x={1320} y={440} r={260} k={ramp(t, a + 1, a + 1.5)} c="#6E1F3A" label="1.300" /></>) },
  { c: "Haremde herkes o farkı biliyordu", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], koridor(t, <>{[0, 1].map((i) => kalfa(t, 760 + i * 320, { face: "normal", talk: 1, look: i ? -0.6 : 0.6 }))}{tur(t, 1500, { face: "sad", look: -0.6 }, 1.0)}</>, 1, 200)) },
  { c: "Ve senin oğlunun büyüyeceği koridorlarda", r: (t, a, b) => again("Haremde herkes o farkı biliyordu", t, a, b, 1) },
  { c: "Ama asıl darbe, Saliha'dan", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 560], daire(t, <>{zaf(t, 960, { face: "normal", hands: "baby", baby: bb(t), op: 0.9 })}</>, 1)) },

  // ── SÜT ANNE ──
  { c: "senin oğlunu kucağında", r: (t, a, b) => again("Ama asıl darbe, Saliha'dan", t, a, b, 0) },
  { c: "Saraylarda, şehzadeyi annesi emzirmezdi", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], daire(t, <>{zaf(t, 820, { face: "smile", hands: "baby", baby: bb(t), look: 0.3 })}{tur(t, 1250, { face: "normal", look: -0.5 })}</>)) },
  { c: "Sağlıklı, genç, yeni", r: (t, a, b) => again("Saraylarda, şehzadeyi annesi emzirmezdi", t, a, b, 0) },
  { c: "Senin oğlun Mehmed için de", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [820, 560], daire(t, <>{zaf(t, 820, { face: "smile", hands: "baby", baby: bb(t), look: 0.3 })}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.5} name="ZAFİRE" sub="Mehmed'in süt annesi · Avrupa kaynakları" c="#8A6A3A" /> },
  { c: "Zafire'yi saraya getiren", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [1000, 560], koridor(t, <>{sun(t, 1000, { face: "normal", look: -0.2 })}</>, 0, 400)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="SÜNBÜL AĞA" sub="Kızlar ağası · haremin en güçlü adamı" c="#1E2A3A" /> },
  { c: "Haremin bütün kapıları", tone: "gold", r: (t, a, b) => again("Zafire'yi saraya getiren", t, a, b, 1) },
  { c: "Ve Zafire'nin de bir oğlu vardı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 560], daire(t, <>{zaf(t, 960, { face: "smile", hands: "baby", baby: <Bebek t={t} bead={false} /> })}</>)),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="OSMAN · SÜT ANNENİN OĞLU" c="#8A6A3A" /> },
  { c: "Şimdi bu sahneyi gözünün önüne getir", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], daire(t, <>{zaf(t, 960, { face: "smile", sit: true })}<g transform="translate(860,900) scale(0.9)"><Bebek t={t} /></g><g transform="translate(1080,900) scale(0.9)"><Bebek t={t} bead={false} /></g>{tur(t, 1450, { face: "worried", look: -0.6 })}</>)) },
  { c: "Biri senin oğlun", r: (t, a, b) => again("Şimdi bu sahneyi gözünün önüne getir", t, a, b, 0) },
  { c: "Ve ikisi de aynı kadının kucağında", r: (t, a, b) => again("Şimdi bu sahneyi gözünün önüne getir", t, a, b, 1) },
  { c: "Sonra bir gün, padişah dairene", tone: "gold", r: (t, a, b) => { const w = yurur(t, a, b, 1800, 1300, 1); return C(t, a, b, [1.15, 1.2], [960, 600], daire(t, <>{ibr(t, w.x, { walk: w.walk, face: "normal", look: -0.5 })}{zaf(t, 820, { face: "shy", sit: true })}{tur(t, 500, { face: "normal", look: 0.5 })}</>)); } },
  { c: "Ve sen bir şey fark ediyorsun", tone: "cool", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [500, 560], daire(t, <>{tur(t, 500, { face: "worried", look: 0.6 })}</>)) },
  { c: "Padişah, senin oğluna değil", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [1200, 560], daire(t, <>{ibr(t, 1250, { face: "smile", hands: "baby", baby: <Bebek t={t} bead={false} />, look: -0.2 })}{zaf(t, 900, { face: "smile", look: 0.5 })}</>)) },
  { c: "Onu kucağına alıyor", r: (t, a, b) => again("Padişah, senin oğluna değil", t, a, b, 1) },
  { c: "Kaynaklar, Sultan İbrahim'in Osman'ı", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={600} y={440} r={200} k={ramp(t, a + 0.3, a + 0.8)} c="#8A6A3A" label="OSMAN" /><Disc x={1320} y={440} r={160} k={ramp(t, a + 1.4, a + 1.9)} c="#2E6A5A" label="MEHMED" /></>),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="PADİŞAHIN GÖZDESİ: OSMAN" y={820} size={86} /> },
  { c: "Hatta bazı Avrupalı yazarlar", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <AvrupaKitap t={t} k={1} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="KANITLANMADI" y={820} size={110} accent={H.red} /> },
  { c: "Ama sen, belki her gece", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.55], [960, 780], daire(t, <>{tur(t, 960, { face: "sad", sit: true, hands: "baby", baby: bb(t) })}<Samdan x={1400} y={900} t={t} /></>, 1)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="NEDEN BENİM OĞLUM DEĞİL?" y={70} size={86} /> },

  // ── HAVUZ ──
  { c: "Ve sonunda, o gün geldi", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 600], havuz(t, null, { ripple: 0.05 })) },
  { c: "Tarihçi Necdet Sakaoğlu", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <AvrupaKitap t={t} k={ramp(t, a, a + 1)} />),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="NECDET SAKAOĞLU" sub="Bu Mülkün Kadın Sultanları · s.338" c="#3A4A5A" /> },
  { c: "Padişah, haremin mermer avlusunda", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [1100, 640], havuz(t, <>{ibr(t, 1180, { face: "smile", look: -0.4 }, 1.0, PY)}{zaf(t, 940, { face: "smile", hands: "baby", baby: bb(t), look: 0.4 }, 0.95, PY)}</>, { ripple: 0.1 })) },
  { c: "Turhan, yani sen", tone: "warm", r: (t, a, b) => { const w = yurur(t, a, b, 200, 560, 1); return C(t, a, b, [1.15, 1.2], [960, 640], havuz(t, <>{tur(t, w.x, { walk: w.walk, face: "worried", look: 0.6 }, 0.95, PY)}{ibr(t, 1180, { face: "normal", look: -0.6 }, 1.0, PY)}{zaf(t, 940, { face: "shy", hands: "baby", baby: bb(t), look: -0.5 }, 0.95, PY)}</>, { ripple: 0.1 })); } },
  { c: "Ve aranızda bir tartışma çıktı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [800, 620], havuz(t, <>{tur(t, 560, { face: "worried", talk: 1, look: 0.6, reach: 0.6 }, 0.95, PY)}{zaf(t, 940, { face: "worried", hands: "baby", baby: bb(t, { cry: 0.6 }), look: -0.5 }, 0.95, PY)}</>, { ripple: 0.1 })) },
  { c: "O an, padişahın öfkesi patladı", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [2, 2.3], [1180, 520], havuz(t, <>{ibr(t, 1180, { face: "shock", look: -0.5, talk: 1 }, 1.0, PY)}</>, { ripple: 0.4, dusk: 0.8 })) },
  { c: "Küçük Mehmed'i aldı", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [1080, 600], havuz(t, <>{ibr(t, 1120, { face: "shock", hands: "baby", baby: bb(t, { cry: 1 }), look: -0.5 }, 1.0, PY)}{zaf(t, 880, { face: "shock", reach: 1, look: 0.6 }, 0.95, PY)}</>, { ripple: 0.4, dusk: 0.8 })) },
  { c: "Ve bir an sonra, Mehmed", sfx: "splash", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 960], havuz(t, null, { ripple: 1.3, splash: ramp(t, a + 0.1, a + 1.5), dusk: 0.8 })) },
  { c: "Tarihçi Çağatay Uluçay", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <AvrupaKitap t={t} k={1} />),
    html: (t, a, b) => <><NameCard t={t} at={a + 0.4} name="ÇAĞATAY ULUÇAY" sub="Padişahların Kadınları ve Kızları · s.93" c="#3A4A5A" /><Txt t={t} at={a + (b - a) * 0.55} text="“BİR KAZA DEĞİLDİ”" y={70} size={90} accent={H.red} /></> },
  { c: "Hikâyenin başındaki o sahneye", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 900], havuz(t, null, { ripple: 1.2 })) },
  { c: "Suya atlayanlar", tone: "cool", r: (t, a, b) => again("Birileri havuza atlıyor", t, a, b, 1) },
  { c: "Ve senin çığlığın", sfx: "drone", tone: "warm", r: (t, a, b) => again("Sen bağırıyor musun", t, a, b, 0) },
  { c: "Mehmed'i sudan çıkardılar", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 560], havuz(t, <>{kalfa(t, 1180, { face: "worried", look: -0.5 }, 0.95)}{tur(t, 880, { face: "sad", hands: "baby", baby: bb(t, { cry: 1, wet: 1 }) }, 0.98, PY)}</>, { ripple: 0.7 })) },
  { c: "Ama alnında derin bir yara vardı", sfx: "drone", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.1], [960, 540], kapali(t, <g transform="translate(960,560) scale(3.4)">{bb(t, { cry: 0.8, wet: 1, mark: 1 })}</g>, "#2A1E16")) },
  { c: "O gece haremde kimse uyuyamadı", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 700], daire(t, <>{tur(t, 960, { face: "sad", sit: true, hands: "baby", baby: bb(t, { mark: 1 }) })}<Samdan x={1400} y={900} t={t} /></>, 1)) },
  { c: "Ve kısa süre sonra, Kösem Sultan", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2], [1100, 520], daire(t, <>{kos(t, 1100, { face: "normal", look: -0.3, talk: 1 })}</>, 1)) },
  { c: "Süt anne Zafire, saraydan çıkarılacaktı", sfx: "knock", tone: "night", r: (t, a, b) => { const w = yurur(t, a, b, 900, 200, 1); return C(t, a, b, [1.1, 1.2], [700, 600], koridor(t, <>{zaf(t, w.x, { walk: w.walk, face: "sad", look: -0.6, hands: "baby", baby: <Bebek t={t} bead={false} /> })}</>, 1, ramp(t, a, b) * -200)); },
    html: (t, a) => <Txt t={t} at={a + 0.6} text="ZAFİRE SARAYDAN ÇIKARILIYOR" y={70} size={86} /> },
  { c: "Burada bir an duralım", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 560], deniz(t, null, { pan: ramp(t, a, b) * 200 })) },
  { c: "Bu süt annenin saraydan çıktıktan sonra", r: (t, a, b) => again("Burada bir an duralım", t, a, b, 0),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="OSMANLI TARİHİNİ DEĞİŞTİRDİ" y={70} size={86} accent={H.gold} /> },
  { c: "Eğer buraya kadar izlediysen", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.1], [960, 560], havuz(t, <>{tur(t, 960, { face: "normal", hands: "baby", baby: bb(t, { mark: 1 }) }, 1.0, PY)}</>, { ripple: 0.1 })),
    html: (t, a) => <Abone t={t} at={a + 0.4} /> },
  { c: "Çünkü şimdi, hikâye haremin duvarlarından", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.05], [960, 540], deniz(t, <Kalyon x={960} y={640} s={0.5} t={t} />, { pan: ramp(t, a, b) * 300 })), html: (t, a, b) => htmlOf("Eğer buraya kadar izlediysen", t, b) },

  // ── GEMİ ──
  { c: "Bin altı yüz kırk dört yılının yazı", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], topk(t, null, ramp(t, a, b) * 300)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="YAZ 1644" y={70} size={130} accent={H.gold} /> },
  { c: "Kızlar Ağası Sünbül Ağa, padişahtan", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 600], topk(t, <>{ibr(t, 1250, { face: "normal", look: -0.5 })}{sun(t, 780, { face: "normal", bow: 0.5, look: 0.5 })}</>, 200)) },
  { c: "Hayatını sarayda geçirmiş", tone: "gold", r: (t, a, b) => C(t, a, b, [2, 2.2], [780, 540], topk(t, <>{sun(t, 780, { face: "closed", look: 0.3 })}</>, 200)),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="HAC → MISIR'DA EMEKLİLİK" c="#1E2A3A" /> },
  { c: "sonra Mısır'a yerleşip", r: (t, a, b) => again("Hayatını sarayda geçirmiş", t, a, b, 0) },
  { c: "İzin çıkıyor", tone: "gold", r: (t, a, b) => again("Kızlar Ağası Sünbül Ağa, padişahtan", t, a, b, 1) },
  { c: "Ama Sünbül Ağa, bu yolculuğa", tone: "warm", r: (t, a, b) => { const w = yurur(t, a, b, 200, 900, 1); return C(t, a, b, [1.1, 1.2], [960, 600], koridor(t, <>{sun(t, w.x + 260, { walk: w.walk, face: "normal", look: 0.4 })}{zaf(t, w.x, { walk: w.walk, face: "normal", look: 0.4, hands: "baby", baby: <Bebek t={t} bead={false} /> })}</>, 0, ramp(t, a, b) * 400)); } },
  { c: "Ve yanında bir şey daha var", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 540], kapali(t, <>{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={760 + (i % 7) * 66} cy={600 + Math.floor(i / 7) * 60} r={26} fill={H.gold} stroke="#4A3524" strokeWidth={3} />)}<path d="M640,700 L1280,700 L1240,880 L680,880Z" fill="#6A4428" stroke="#4A3524" strokeWidth={5} /></>, "#1E140E")),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="BÜTÜN HAZİNESİ" y={70} size={110} accent={H.gold} /> },
  { c: "altın ve gümüş", r: (t, a, b) => again("Ve yanında bir şey daha var", t, a, b, 0) },
  { c: "Kafile, on gemiyle", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], deniz(t, kafile(t, a, b), { pan: ramp(t, a, b) * 200 })),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="10 GEMİ · İSTANBUL'DAN" c={H.cobalt} /> },
  { c: "En büyüğü, top yüklü dev bir kalyon", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 520], deniz(t, <Kalyon x={960} y={680} s={0.85} t={t} />, { pan: 100 })),
    html: (t, a) => <NameCard t={t} at={a + 0.5} name="KALYON" sub="Yelkenli savaş gemisi" c="#6A4428" /> },
  { c: "Gemide hacılar var", r: (t, a, b) => again("En büyüğü, top yüklü dev bir kalyon", t, a, b, 1) },
  { c: "Sen o sırada sarayda", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.55], [960, 780], daire(t, <>{tur(t, 960, { face: "sad", sit: true, hands: "baby", baby: bb(t, { mark: 1 }) })}</>, 0.4)) },
  { c: "Ve o kadının artık gittiğini", r: (t, a, b) => again("Sen o sırada sarayda", t, a, b, 1) },
  { c: "Haklıydın", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], deniz(t, kafile(t, a, b, 0.6), { night: 1 })),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="AMA DÜŞÜNDÜĞÜN SEBEPTEN DEĞİL" y={70} size={80} /> },

  // ── BELGE 2: Rodos açıkları ──
  { c: "Yirmi sekiz Eylül", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], deniz(t, kafile(t, a, b), { island: "rodos" })),
    html: (t, a) => <Belge t={t} at={a + 0.3} date="28 Eylül 1644" src="Kaynak: Anderson 1952 · Setton 1991 · Ganado 2019">Rodos açıkları · Malta şövalyeleri<br />Sünbül Ağa'nın kafilesine saldırı</Belge> },
  { c: "Ufukta altı kadırga beliriyor", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [1500, 560], deniz(t, <>{kafile(t, a, b)}{kadirgalar(t, a, b)}</>, { island: "rodos" })) },
  { c: "Bayrakları kırmızı, ortasında beyaz", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], deniz(t, <Kadirga x={960} y={700} s={1.1} t={t} />, { pan: ramp(t, a, b) * 200 })),
    html: (t, a) => <NameCard t={t} at={a + 0.6} name="MALTA ŞÖVALYELERİ" sub="Kadırga · kürekli savaş gemisi" c="#C0262A" /> },
  { c: "Malta şövalyeleri, Akdeniz'de", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <MaltaLiman t={t} />) },
  { c: "Ve o sabah, hedefleri", r: (t, a, b) => again("Ufukta altı kadırga beliriyor", t, a, b, 1) },
  { c: "Savaş saatlerce sürüyor", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], deniz(t, <><Kalyon x={760} y={660} s={0.55} t={t} tilt={-2} /><Kadirga x={1400} y={720} s={0.6} t={t} dir={-1} /><TopAtes x={1000} y={560} t={t} at={a + 0.3} /><TopAtes x={1250} y={640} t={t} at={a + 1.2} /><TopAtes x={700} y={600} t={t} at={a + 2.1} /></>, { storm: 0.2 })) },
  { c: "Dev kalyonun güvertesinde", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], deniz(t, <>{sun(t, 960, { face: "worried", reach: 0.8, look: 0.4 })}<TopAtes x={1500} y={500} t={t} at={a + 0.6} /></>, { storm: 0.3 })) },
  { c: "Ve o güvertede, hayatını kaybediyor", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], deniz(t, <Kalyon x={960} y={660} s={0.6} t={t} sails={0.4} dark={0.6} />, { storm: 0.6 })),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="SÜNBÜL AĞA · 1644" c="#1E2A3A" /> },
  { c: "Malta kayıtlarına göre", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <ArsivDefter t={t} scan={ramp(t, a, b)} />),
    html: (t, a) => <Belge t={t} at={a + 0.3} date="Malta kayıtları · 1644" src="Kaynak: Ganado 2019 · Setton 1991">~<b>380 esir</b><br />Kahire kadısı · Zafire · küçük Osman</Belge> },
  { c: "Aralarında Kahire'nin kadısı", r: (t, a, b) => again("Malta kayıtlarına göre", t, a, b, 0) },
  { c: "Ama Malta'da beklenmedik bir şey", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], <MaltaLiman t={t} galleys={1} />) },
  { c: "Şövalyelerin başı, Büyük Üstat Lascaris", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 600], <><MaltaLiman t={t} galleys={0} />{erkek(t, 1150, 3, { face: "normal", look: -0.4 }, 1.15)}{zaf(t, 760, { face: "worried", look: 0.5, hands: "baby", baby: <Bebek t={t} bead={false} /> })}</>),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="LASCARIS" sub="Malta şövalyelerinin büyük üstadı" c="#C0262A" /> },
  { c: "Bu kadın, padişahın gözdesiydi", r: (t, a, b) => again("Şövalyelerin başı, Büyük Üstat Lascaris", t, a, b, 1) },
  { c: "Lascaris, ikisinin zincire", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [760, 560], <><MaltaLiman t={t} galleys={0} dusk={0.4} />{zaf(t, 760, { face: "sad", look: 0.2, hands: "baby", baby: <Bebek t={t} bead={false} /> })}</>) },
  { c: "Ve Avrupa'nın dört bir yanına", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <AvrupaKitap t={t} k={ramp(t, a, a + 1)} />),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="“PADİŞAHIN OĞLU ESİR!”" y={70} size={96} accent={H.red} /> },
  { c: "Malta şövalyeleri Osmanlı", r: (t, a, b) => again("Ve Avrupa'nın dört bir yanına", t, a, b, 0) },
  { c: "Bu haber yanlıştı", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 560], daire(t, <>{tur(t, 960, { face: "normal", hands: "baby", baby: bb(t, { mark: 1 }) })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="YANLIŞ" y={70} size={140} accent={H.red} /> },
  { c: "Padişahın gerçek ilk oğlu", r: (t, a, b) => C(t, a, b, [1, 1.1], [960, 540], kapali(t, <g transform="translate(960,560) scale(3.2)">{bb(t, { mark: 1 })}</g>, "#2A1E16")) },
  { c: "Şövalyelerin ele geçirdiği", tone: "gold", r: (t, a, b) => again("Ve yanında bir şey daha var", t, a, b, 0),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="200.000 SKUDO" y={70} size={120} accent={H.gold} /> },
  { c: "Bir Maltalı tarihçi", r: (t, a, b) => again("Ama Malta'da beklenmedik bir şey", t, a, b, 1) },
  { c: "Ama asıl önemli olan, hazine değildi", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], harita(t, a, b, { show: ["istanbul", "rodos", "girit", "malta"] })) },
  { c: "Şövalyeler esirleri Malta'ya götürürken", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], deniz(t, <>{[0, 1, 2].map((i) => <Kadirga key={i} x={500 + i * 420} y={680 + (i % 2) * 40} s={0.4} t={t + i} />)}</>, { storm: 1, night: 0.4 })) },
  { c: "Ve gemilerini onarmak için", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], harita(t, a, b, { route: [0.4, 0.62], hl: "girit" })) },
  { c: "O ada, Venedik'in elindeki Girit'ti", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], deniz(t, <Kadirga x={960} y={720} s={0.5} t={t} />, { island: "girit" })),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="GİRİT · VENEDİK'İN ADASI" c={H.red} /> },
  { c: "İstanbul'a haber ulaştığında", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], topk(t, <>{ibr(t, 960, { face: "shock", look: 0, talk: 1 }, 1.2)}{erkek(t, 600, 0, { bow: 0.5, face: "worried" })}{erkek(t, 1320, 1, { bow: 0.5, face: "worried" })}</>, 200)) },
  { c: "padişahın sevdiği çocuk", r: (t, a, b) => again("İstanbul'a haber ulaştığında", t, a, b, 0) },
  { c: "Osmanlı'ya göre bu", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={960} y={460} r={260} k={ramp(t, a + 0.3, a + 0.8)} c={H.red} label="İHANET" /></>) },
  { c: "Kaynaklar, Sultan İbrahim'in bu habere", tone: "warm", r: (t, a, b) => C(t, a, b, [2, 2.2], [960, 520], topk(t, <>{ibr(t, 960, { face: "shock", look: 0.1, talk: 1 }, 1.2)}</>, 200)) },
  { c: "Tersanelerde aylarca gemi yapıldı", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], <><YeniCami t={t} k={0} pan={300} /><Kalyon x={lerp(600, 1300, ramp(t, a, b))} y={860} s={0.3} t={t} /></>) },
  { c: "Bin altı yüz kırk beş baharında", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], deniz(t, <>{[0, 1, 2, 3, 4].map((i) => <Kalyon key={i} x={lerp(200 + i * 360, 400 + i * 360, ramp(t, a, b))} y={600 + (i % 2) * 50} s={0.22 + (i % 2) * 0.05} t={t + i} />)}</>, { pan: ramp(t, a, b) * 300 })),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="1645 · OSMANLI DONANMASI" y={70} size={96} /> },
  { c: "Herkes Malta'ya gideceğini sanıyordu", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], harita(t, a, b, { hl: "malta" })) },
  { c: "Ama donanma, Girit'e yöneldi", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [1180, 700], harita(t, a, b, { hl: "girit", girit: ramp(t, a + 0.4, a + 1.6) })) },
  { c: "Ve böylece, Girit Savaşı başladı", tone: "night", r: (t, a, b) => again("Savaş saatlerce sürüyor", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="GİRİT SAVAŞI 1645–1669" y={70} size={96} accent={H.red} /> },
  { c: "Ama kıvılcımı, o gemiydi", tone: "night", r: (t, a, b) => again("Ve o güvertede, hayatını kaybediyor", t, a, b, 0) },
  { c: "Ve bu savaş, tam yirmi dört yıl", r: (t, a, b) => again("Yirmi dört yıl sürecek", t, a, b, 1), html: (t, a, b) => htmlOf("Yirmi dört yıl sürecek", t, b) },
  { c: "Peki ya Zafire", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 560], <><MaltaLiman t={t} galleys={0} dusk={0.8} />{zaf(t, 960, { face: "sad", look: 0.1 })}</>),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="ZAFİRE · OCAK 1645 · MALTA" c="#8A6A3A" /> },
  { c: "Oğlu Osman'ı ise Malta'daki rahipler", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], <><MaltaLiman t={t} galleys={0} dusk={0.3} />{meh(t, 960, { plain: true, face: "sad", robe: "#2A2A2E" }, 0.7)}</>) },
  { c: "Avrupa'da ona Padre Ottomano", tone: "gold", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 560], <><MaltaLiman t={t} galleys={0} dusk={0.6} />{erkek(t, 960, 1, { plain: true, fes: false, robe: "#F2EEE6", robe2: "#2A2A2E", face: "normal" }, 1.12)}</>),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="PADRE OTTOMANO" sub="“Osmanlı Peder” · Zafire'nin oğlu Osman" c="#2A2A2E" /> },
  { c: "Ve ömrü sarayından", r: (t, a, b) => again("Avrupa'da ona Padre Ottomano", t, a, b, 0) },
  { c: "Bir düşün. Senin dairende", tone: "warm", r: (t, a, b) => again("Şimdi bu sahneyi gözünün önüne getir", t, a, b, 2) },

  // ── SAMUR ──
  { c: "Kaderi bir tek", r: (t, a, b) => again("Bir düşün. Senin dairende", t, a, b, 0) },
  { c: "Ama senin hikâyen, burada bitmiyor", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], daire(t, <>{tur(t, 960, { face: "normal" })}{meh(t, 1150, { face: "normal", look: -0.4 })}</>)) },
  { c: "Girit'te savaş sürerken", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], topk(t, <>{ibr(t, 960, { face: "worried", look: 0.2 })}</>, 200)) },
  { c: "Kaynaklar, Sultan İbrahim'in sık sık", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 760], daire(t, <>{ibr(t, 960, { face: "worried", sit: true, bow: 0.3 })}</>, 1)) },
  { c: "baş ağrılarından ve", r: (t, a, b) => again("Kaynaklar, Sultan İbrahim'in sık sık", t, a, b, 0) },
  { c: "Kafeste geçen yılların izleri", r: (t, a, b) => again("Kafeste geriye sadece İbrahim kaldı", t, a, b, 2) },
  { c: "Saraya Cinci Hoca adında", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 700], daire(t, <>{ibr(t, 1250, { face: "worried", sit: true })}{erkek(t, 760, 2, { face: "normal", talk: 1, look: 0.5, reach: 0.6 })}</>, 1)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="CİNCİ HOCA" sub="Muska ve duayla tedavi vaat etti" c="#5A4A3A" /> },
  { c: "Padişahı muskalarla, dualarla", r: (t, a, b) => again("Saraya Cinci Hoca adında", t, a, b, 0) },
  { c: "Ve kısa sürede", r: (t, a, b) => again("Saraya Cinci Hoca adında", t, a, b, 1) },
  { c: "Bugün bazı tarihçiler", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={600} y={440} r={220} k={ramp(t, a + 0.3, a + 0.8)} c={H.red} label="DELİ?" /><Disc x={1320} y={440} r={220} k={ramp(t, a + 2.4, a + 2.9)} c={H.cobalt} label="KORKMUŞ, KIRILGAN" /></>) },
  { c: "Ona göre o", r: (t, a, b) => again("Bugün bazı tarihçiler", t, a, b, 0) },
  { c: "Ama sonuç değişmiyordu", r: (t, a, b) => again("Kaynaklar, Sultan İbrahim'in sık sık", t, a, b, 1) },
  { c: "Bugün elimizde, İbrahim'in kendi eliyle", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <ArsivDefter t={t} scan={ramp(t, a, b)} />),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="İBRAHİM'İN KENDİ MEKTUPLARI" c="#5A3A26" /> },
  { c: "Bu mektuplarda sınırları", r: (t, a, b) => again("Bugün elimizde, İbrahim'in kendi eliyle", t, a, b, 0) },
  { c: "Yani o, her gün aynı adam değildi", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 540], topk(t, <>{ibr(t, 960, { face: Math.sin(t * 1.4) > 0 ? "normal" : "worried", look: 0.1 })}</>, 300)) },
  { c: "Ve sen, onun hangi gün", tone: "cool", r: (t, a, b) => C(t, a, b, [2, 2.2], [960, 560], daire(t, <>{tur(t, 960, { face: "worried", look: 0.4 })}</>)) },
  { c: "Ve padişahın bir tutkusu vardı", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 540], kapali(t, <g transform="translate(960,560) scale(2.8)"><Samur /></g>, "#2A1A12")),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="SAMUR" y={70} size={150} accent={H.gold} /> },
  { c: "Samur, kuzeyin soğuk ormanlarında", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], <Bozkir t={t} dusk={0.3} pan={ramp(t, a, b) * 400} />) },
  { c: "Kürkü dünyanın en", r: (t, a, b) => again("Samur, kuzeyin soğuk ormanlarında", t, a, b, 0) },
  { c: "Ve bu kürkler, kuzeyden geliyordu", tone: "cool", r: (t, a, b) => again("Kaynaklara göre, sen kuzeyde doğdun", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="SENİN DOĞDUĞUN TOPRAKLAR" y={70} size={86} /> },
  { c: "Belki de senin", r: (t, a, b) => again("Ve bu kürkler, kuzeyden geliyordu", t, a, b, 0) },
  { c: "Bir zamanlar o ormanların kenarında", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], samur(t, <>{tur(t, 1500, { face: "sad", look: -0.6 })}</>, ramp(t, a, b))) },
  { c: "şimdi o ormanlardan", r: (t, a, b) => again("Bir zamanlar o ormanların kenarında", t, a, b, 0) },
  { c: "Sultan İbrahim, bir odasının duvarlarını", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], samur(t, null, ramp(t, a, a + 2))) },
  { c: "Yastıklarını kürkle doldurttu", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 760], samur(t, null)) },
  { c: "Fransızlar ona bu yüzden", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], samur(t, <>{ibr(t, 960, { face: "smile", sit: true })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="“KÜRK DELİSİ”" y={70} size={120} accent={H.red} /> },
  { c: "Bu tutkunun bedelini, halk ödedi", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], koridor(t, <>{[0, 1, 2, 3].map((i) => erkek(t, 420 + i * 340, i, { face: "sad", look: 0.2 }))}</>, 0, 300)),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="YENİ VERGİLER" c={H.red} /> },
  { c: "Ve harem büyüdü", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], koridor(t, <>{[0, 1, 2, 3, 4].map((i) => kadin(t, 300 + i * 320, i, { face: "smile", look: 0.2 }))}</>, 0, 600 + ramp(t, a, b) * 300)) },
  { c: "Kaynaklar, onun sekiz kadını", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper />{Array.from({ length: 8 }, (_, i) => <Disc key={i} x={300 + (i % 4) * 440} y={300 + Math.floor(i / 4) * 420} r={150} k={ramp(t, a + 0.2 + i * 0.18, a + 0.5 + i * 0.18)} c={i === 0 ? "#2E6A5A" : i === 1 ? "#6E1F3A" : "#8A6A4A"} label={["TURHAN", "SALİHA", "ŞİVEKAR", "ŞEKERPARE", "?", "?", "?", "?"][i]} />)}</>),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="8 HASEKİ" y={70} size={120} /> },
  { c: "Aralarında Ermeni asıllı", r: (t, a, b) => again("Kaynaklar, onun sekiz kadını", t, a, b, 0) },
  { c: "Peki sen? Sen artık", tone: "cool", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 560], daire(t, <>{tur(t, 960, { face: "sad", hands: "baby", baby: bb(t, { mark: 1 }) })}</>, 0.5)) },
  { c: "Oğlunun alnında hala", r: (t, a, b) => again("Peki sen? Sen artık", t, a, b, 0) },
  { c: "Ve oğlun her ağladığında", tone: "cool", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 560], havuz(t, null, { ripple: 0.4, dusk: 0.6 })) },

  // ── TELLİ ──
  { c: "Sonra, bin altı yüz kırk yedi", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], topk(t, null, ramp(t, a, b) * 400)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="1647" y={70} size={150} accent={H.gold} /> },
  { c: "Padişah, evlendi", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 600], topk(t, <>{ibr(t, 1150, { face: "smile", look: -0.5 })}{tel(t, 780, { face: "shy", look: 0.5 })}</>, 300)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="PADİŞAH EVLENDİ" y={820} size={110} accent={H.red} /> },
  { c: "Osmanlı padişahları, cariyeleriyle", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={960} y={460} r={240} k={ramp(t, a + 0.4, a + 0.9)} c={H.gold} label="NİKÂH" /></>) },
  { c: "Ama Sultan İbrahim, Hümaşah adında", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [780, 540], topk(t, <>{tel(t, 780, { face: "smile", look: 0.3 })}</>, 300)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="HÜMAŞAH · TELLİ HASEKİ" sub="Sultan İbrahim'in tek resmi eşi" c="#B8323A" /> },
  { c: "Hümaşah'ın saçları", r: (t, a, b) => again("Ama Sultan İbrahim, Hümaşah adında", t, a, b, 1), html: (t, a, b) => htmlOf("Ama Sultan İbrahim, Hümaşah adında", t, b) },
  { c: "Ve padişah, ona hiç kimseye", tone: "gold", r: (t, a, b) => again("Padişah, evlendi", t, a, b, 1) },
  { c: "Mehir olarak", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], harita(t, a, b, { hl: "misir", show: ["istanbul", "misir"] })),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="MEHİR: MISIR'IN HAZİNESİ" y={70} size={96} accent={H.gold} /> },
  { c: "Koca bir eyaletin hazinesini", r: (t, a, b) => again("Ve yanında bir şey daha var", t, a, b, 1), html: (t, a, b) => htmlOf("Mehir olarak", t, b) },
  { c: "Ona İbrahim Paşa Sarayı'nı verdi", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 560], topk(t, null, 500 + ramp(t, a, b) * 200)),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="İBRAHİM PAŞA SARAYI" c="#B8323A" /> },
  { c: "Ve bu sarayın zeminini", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 700], samur(t, <>{tel(t, 960, { face: "smile" })}</>)) },
  { c: "Ve dahası", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], daire(t, <>{[0, 1, 2].map((i) => <PFig key={i} x={600 + i * 360} y={Y} s={1.08} kind="girl" robe={["#3A5A8A", "#7A3A6A", "#4A6A3A"][i]} robe2="#F7EBD0" scarf="#F7F2E6" t={t} seed={40 + i} face="normal" />)}</>)),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="AYŞE · FATMA · HANZADE SULTANLAR" c="#4A2A5A" /> },
  { c: "Onların toprakları ve mücevherleri", tone: "cool", r: (t, a, b) => again("Ve dahası", t, a, b, 1) },
  { c: "Padişah kızları, bir cariyenin", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], samur(t, <>{tel(t, 1300, { face: "smile", sit: true })}{[0, 1].map((i) => <PFig key={i} x={600 + i * 300} y={Y} s={1.05} kind="girl" robe={["#3A5A8A", "#7A3A6A"][i]} robe2="#F7EBD0" scarf="#F7F2E6" t={t} seed={40 + i} face="sad" hands="tray" bow={0.4} />)}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="PADİŞAH KIZLARI · HİZMETÇİ" y={70} size={86} /> },
  { c: "Bunu duyduğunda", tone: "cool", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 560], daire(t, <>{tur(t, 960, { face: "sad", look: 0.3 })}</>, 0.5)) },
  { c: "Ama şunu biliyoruz", r: (t, a, b) => again("Bunu duyduğunda", t, a, b, 0) },
  { c: "Ve şimdi, sarayın zeminine serilen", r: (t, a, b) => again("Yastıklarını kürkle doldurttu", t, a, b, 1) },

  // ── SÖYLENTİ ──
  { c: "İşte tam bu yıllarda", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <AvrupaKitap t={t} k={ramp(t, a, a + 1)} />),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="AVRUPA'DA BİR HİKÂYE" c={H.purple} /> },
  { c: "Bu hikâyeye göre", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], koridor(t, <>{[0, 1].map((i) => kalfa(t, 760 + i * 380, { face: "worried", talk: 1, look: i ? -0.6 : 0.6 }))}</>, 1, 500)) },
  { c: "Cariyelerinden birinin saray", r: (t, a, b) => again("Bu hikâyeye göre", t, a, b, 0) },
  { c: "Ve padişah öfkeyle bir emir verdi", tone: "night", r: (t, a, b) => C(t, a, b, [2, 2.3], [960, 520], topk(t, <>{ibr(t, 960, { face: "shock", talk: 1 })}</>, 300)),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="SÖYLENTİ" y={70} size={110} accent={H.purple} /> },
  { c: "Haremdeki iki yüz seksen", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 560], deniz(t, null, { night: 1, pan: ramp(t, a, b) * 100 })),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="280 CARİYE?" y={70} size={120} accent={H.purple} /> },
  { c: "Bu hikâye bugün hâlâ anlatılıyor", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <AvrupaKitap t={t} k={1} />) },
  { c: "Peki doğru mu", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="DOĞRU MU?" y={420} size={150} /> },
  { c: "Bu söylenti, Avrupa kaynaklarında geçer", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <ArsivDefter t={t} scan={ramp(t, a, b)} />),
    html: (t, a, b) => <><Txt t={t} at={a + 0.4} text="OSMANLI BELGESİ: YOK" y={70} size={96} accent={H.red} /><Txt t={t} at={a + (b - a) * 0.6} text="UYDURMA YA DA BÜYÜK ABARTI" y={820} size={80} /></> },
  { c: "Ama bu olayı", r: (t, a, b) => again("Bu söylenti, Avrupa kaynaklarında geçer", t, a, b, 0) },
  { c: "Ve bugün birçok", r: (t, a, b) => again("Bu söylenti, Avrupa kaynaklarında geçer", t, a, b, 1) },
  { c: "Ama bu söylentinin neden doğduğunu", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], koridor(t, <>{[0, 1, 2, 3].map((i) => kadin(t, 420 + i * 340, i, { face: "worried", look: 0.2 }))}</>, 1, 700)) },
  { c: "Çünkü o yıllarda", r: (t, a, b) => again("Ama bu söylentinin neden doğduğunu", t, a, b, 0) },
  { c: "Korku", sfx: "drone", tone: "night", r: (t, a, b) => again("Ama bu söylentinin neden doğduğunu", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="KORKU" y={820} size={150} accent={H.red} /> },
  { c: "Ve sen, bu korkuyu herkesten iyi", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 560], havuz(t, <>{tur(t, 960, { face: "sad", look: 0.1 }, 1.0, PY)}</>, { ripple: 0.3, dusk: 1 })) },

  // ── AĞUSTOS 1648 ──
  { c: "Çünkü sen o", r: (t, a, b) => again("Ve sen, bu korkuyu herkesten iyi", t, a, b, 0) },
  { c: "Bin altı yüz kırk sekiz yılının yazı", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], <YeniCami t={t} k={0.1} pan={ramp(t, a, b) * 200} />),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="YAZ 1648 · İSTANBUL KAYNIYOR" y={70} size={90} accent={H.red} /> },
  { c: "Girit'te savaş bitmiyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], koridor(t, <>{[0, 1, 2, 3].map((i) => erkek(t, 420 + i * 340, i, { face: "worried", talk: i % 2 }))}</>, 0, 900)) },
  { c: "Ve yeniçeriler, artık sabredemiyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], topk(t, <>{[0, 1, 2, 3, 4].map((i) => erkek(t, 300 + i * 330, i, { face: "shock", talk: 1, look: 0.1 }))}</>, 500)) },
  { c: "Sekiz Ağustos günü", sfx: "boom", tone: "warm", r: (t, a, b) => { const k = ramp(t, a, b); return C(t, a, b, [1.05, 1.15], [960, 600], topk(t, <>{[0, 1, 2, 3, 4, 5].map((i) => erkek(t, lerp(-200 + i * 300, 200 + i * 300, k), i, { face: "shock", walk: proWalk(t + i * 0.13, a, b, -200, 200, 1).walk }))}</>, 600)); },
    html: (t, a) => <Txt t={t} at={a + 0.3} text="8 AĞUSTOS 1648" y={70} size={120} accent={H.red} /> },
  { c: "Önce sadrazamı öldürdüler", r: (t, a, b) => again("Ve yeniçeriler, artık sabredemiyor", t, a, b, 1) },
  { c: "Ve padişahın tahttan indirilmesini", r: (t, a, b) => again("Sekiz Ağustos günü", t, a, b, 0) },
  { c: "Kösem Sultan, oğlu İbrahim'in", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2], [1100, 520], daire(t, <>{kos(t, 1100, { face: "closed", look: -0.2 })}</>, 1)) },
  { c: "Ve aynı gün, birileri senin dairenin", sfx: "knock", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], <HaremKapi t={t} open={ramp(t, a + 0.8, a + 2)} turn={ramp(t, a, a + 0.8)} lock={false} />) },
  { c: "Oğlun Mehmed'i almaya gelmişlerdi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 600], daire(t, <>{tur(t, 760, { face: "worried", look: 0.5, reach: 0.4 })}{meh(t, 960, { face: "worried", look: 0.4 })}{kalfa(t, 1300, { bow: 0.5, face: "normal", look: -0.5 })}</>)) },
  { c: "Mehmed, altı yaşındaydı", tone: "gold", r: (t, a, b) => C(t, a, b, [2.2, 2.6], [960, 760], daire(t, <>{meh(t, 960, { face: "normal", look: 0.1 })}</>)),
    html: (t, a) => <Tag t={t} at={a + 0.3} text="6 YAŞINDA · ALNINDA O İZ" c="#C9A35A" /> },
  { c: "Ve şimdi, Osmanlı padişahıydı", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 680], topk(t, <>{meh(t, 960, { face: "normal", look: 0 }, 0.62)}{erkek(t, 560, 0, { bow: 0.6, face: "closed" })}{erkek(t, 1360, 1, { bow: 0.6, face: "closed" })}</>, 0)),
    html: (t, a) => <NameCard t={t} at={a + 0.3} name="SULTAN IV. MEHMED" sub="8 Ağustos 1648 · 6 yaşında padişah" c="#C9A35A" /> },
  { c: "On gün sonra", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], kafes(t, null, 1)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="18 AĞUSTOS 1648" y={70} size={110} /> },
  { c: "Kafeste korkuyla büyüyen adamın", r: (t, a, b) => again("On gün sonra", t, a, b, 1) },
  { c: "Ve sen, bir padişahın annesi oldun", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 560], daire(t, <>{tur(t, 960, { face: "smile", look: 0.1 }, 1.2)}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="VALİDE SULTAN?" y={70} size={110} accent={H.gold} /> },
  { c: "Ama hayır", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 540], daire(t, <>{tur(t, 960, { face: "shock", look: 0.4 }, 1.2)}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.1} text="OLAMADIN." y={820} size={130} accent={H.red} /> },
  { c: "Çünkü saray, sana çok genç", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], daire(t, <>{kos(t, 1200, { face: "normal", look: -0.5, talk: 1 })}{tur(t, 720, { face: "sad", look: 0.5 })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="VALİDE SULTAN: YİNE KÖSEM" y={70} size={90} /> },
  { c: "Ve Valide Sultanlık", r: (t, a, b) => again("Çünkü saray, sana çok genç", t, a, b, 0) },
  { c: "Sen, kendi oğlunun sarayında", tone: "cool", r: (t, a, b) => C(t, a, b, [2, 2.2], [720, 560], daire(t, <>{tur(t, 720, { face: "sad", look: 0.4 })}</>)) },
  { c: "Ve daha kötüsü vardı", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], koridor(t, <>{kalfa(t, 760, { face: "worried", talk: 1, look: 0.6 })}{kalfa(t, 1140, { face: "normal", look: -0.6 })}</>, 1, 900)) },
  { c: "Kösem Sultan, küçük Mehmed'i", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper c="#2A1E16" /><Disc x={600} y={440} r={220} k={1} c="#2E6A5A" label="MEHMED" /><Disc x={1320} y={440} r={220} k={ramp(t, a + 1.4, a + 1.9)} c="#6E1F3A" label="SÜLEYMAN?" /></>) },
  { c: "yerine diğer torunu", r: (t, a, b) => again("Kösem Sultan, küçük Mehmed'i", t, a, b, 0) },
  { c: "Leslie Peirce, bu planın", tone: "night", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 560], daire(t, <>{kalfa(t, 1150, { face: "worried", talk: 1, look: -0.5 })}{tur(t, 780, { face: "shock", look: 0.5 })}</>, 1)) },
  { c: "Eğer bu olsaydı", tone: "night", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 700], daire(t, <>{tur(t, 780, { face: "worried", look: 0.5, reach: 0.5 })}{meh(t, 1000, { face: "normal", look: -0.4 })}</>, 1)) },
  { c: "Osmanlı'da tahttan indirilen", r: (t, a, b) => again("Eğer bu olsaydı", t, a, b, 0) },
  { c: "Bir kez daha, oğlunun hayatı", sfx: "drone", tone: "night", r: (t, a, b) => again("Ve sen, bu korkuyu herkesten iyi", t, a, b, 1) },

  // ── DENİZ ──
  { c: "Bundan sonrasını, bu kanalda", sfx: "whoosh", tone: "night", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], koridor(t, null, 1, ramp(t, a, b) * 400)),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="EYLÜL 1651 · KÖSEM'İN SON GECESİ" c={H.purple} /> },
  { c: "1651 yılının Eylül", r: (t, a, b) => again("Bundan sonrasını, bu kanalda", t, a, b, 0) },
  { c: "Ve sabah olduğunda", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.05], [960, 540], <HaremKapi t={t} open={1} lock={false} />) },
  { c: "O sabahtan sonra, haremin anahtarları", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 560], daire(t, <>{turV(t, 960, { face: "normal", look: 0.1 })}</>)) },
  { c: "Leslie Peirce'e göre, sonraki beş yıl", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], topk(t, <>{turV(t, 1100, { face: "normal", look: -0.3, talk: 1 })}{meh(t, 820, { face: "normal", look: 0.3 }, 0.66)}{erkek(t, 480, 0, { bow: 0.5, face: "closed" })}</>, 300)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="NAİBE TURHAN" sub="1651–1656 · oğlu adına devleti yönetti" c="#1F4A40" /> },
  { c: "Bir zamanlar on iki yaşında", r: (t, a, b) => again("Seni de aldılar", t, a, b, 2) },
  { c: "Yani küçük padişah", r: (t, a, b) => again("Bir zamanlar on iki yaşında", t, a, b, 0) },
  { c: "Ama o eski savaş, hâlâ bitmemişti", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], harita(t, a, b, { girit: 1, hl: "girit" })) },
  { c: "Hatırlıyor musun", r: (t, a, b) => again("Ve o güvertede, hayatını kaybediyor", t, a, b, 1) },
  { c: "Ve bin altı yüz elli altıda", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 520], <Bogaz t={t} build={0} fleet={ramp(t, a, a + 1.5)} />),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="1656 · BOĞAZ KAPANDI" y={70} size={100} accent={H.red} /> },
  { c: "Boğaz'ı kapattılar", r: (t, a, b) => again("Ve bin altı yüz elli altıda", t, a, b, 1) },
  { c: "Halk korkuyla denize bakıyordu", tone: "cool", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], <><YeniCami t={t} k={0.3} pan={200} />{[0, 1, 2].map((i) => kadin(t, 600 + i * 340, i, { face: "worried", look: 0.1 }, 0.9))}</>) },
  { c: "İslam Ansiklopedisi'ne göre, Köprülü", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 600], topk(t, <>{kop(t, 1150, { face: "normal", bow: 0.3, look: -0.4 })}{turV(t, 760, { face: "normal", look: 0.4 })}</>, 300)),
    html: (t, a) => <NameCard t={t} at={a + 0.5} name="KÖPRÜLÜ MEHMED PAŞA" sub="1656 · sadrazam" c="#3A4A3A" /> },
  { c: "Ve bu karar, imparatorluğun", r: (t, a, b) => again("İslam Ansiklopedisi'ne göre, Köprülü", t, a, b, 1) },
  { c: "Ama bir şey daha yaptın", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 540], daire(t, <>{turV(t, 960, { face: "normal", look: 0.2 })}</>)) },
  { c: "Tarihçi Lucienne Thys-Şenocak", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <AvrupaKitap t={t} k={ramp(t, a, a + 1)} />),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="LUCIENNE THYS-ŞENOCAK" sub="Ottoman Women Builders · 2006" c="#3A4A5A" /> },
  { c: "1658'de Çanakkale Boğazı'nın", r: (t, a, b) => again("Tarihçi Lucienne Thys-Şenocak", t, a, b, 0) },
  { c: "Avrupa yakasında Seddülbahir", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [400, 640], <Bogaz t={t} build={ramp(t, a - 2, b)} />) },
  { c: "Asya yakasında Kumkale", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [1520, 640], <Bogaz t={t} build={ramp(t, a - 3, b)} />) },
  { c: "Bir daha hiçbir düşman donanması", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.05], [960, 540], <Bogaz t={t} build={1} />),
    html: (t, a) => <Belge t={t} at={a + 0.4} date="1658 · Çanakkale Boğazı" src="Kaynak: L. Thys-Şenocak, Ottoman Women Builders (2006)">Seddülbahir + Kumkale<br />Banisi: <b>Turhan Sultan</b></Belge> },
  { c: "O kaleler, bir valide sultanın", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 600], <><Bogaz t={t} build={1} />{turV(t, 960, { face: "normal", look: 0.1 }, 1.0)}</>) },
  { c: "Haremde büyümüş bir kadın", r: (t, a, b) => again("O kaleler, bir valide sultanın", t, a, b, 1) },
  { c: "Bir düşün", sfx: "drone", tone: "cool", r: (t, a, b) => again("Sen bağırıyor musun", t, a, b, 1) },
  { c: "Bir zamanlar bir havuzun kenarında", tone: "cool", r: (t, a, b) => again("Ve sen, o havuzun kenarına koşuyorsun", t, a, b, 1) },
  { c: "Şimdi koca bir denizin kapısına", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.05], [960, 540], <Bogaz t={t} build={1} />),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="HAVUZDAN DENİZE" y={70} size={120} accent={H.gold} /> },
  { c: "Ve o havuzun kenarında başlayan savaş", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], harita(t, a, b, { girit: 1 - ramp(t, a + 1, a + 3) * 0.5, hl: "girit" })),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="1669 · GİRİT ALINDI" y={70} size={110} /> },

  // ── MİRAS ──
  { c: "Girit'in alınmasıyla sona", r: (t, a, b) => again("Ve o havuzun kenarında başlayan savaş", t, a, b, 0) },
  { c: "Senin yaptıkların, bugün hâlâ ayakta", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.05], [960, 540], <YeniCami t={t} k={1} pan={ramp(t, a, b) * 200} />) },
  { c: "İstanbul'da, Eminönü'nde", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [1000, 520], <YeniCami t={t} k={1} />),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="YENİ CAMİ · EMİNÖNÜ" c={H.cobalt} /> },
  { c: "Yapımına yarım asır önce", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [1000, 560], <YeniCami t={t} k={0.25} />) },
  { c: "Sonra şehri saran büyük bir yangında", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [1000, 560], <><YeniCami t={t} k={0.25} night={1} /><rect width={1920} height={1080} fill="#E06A2A" opacity={0.25 + 0.08 * Math.sin(t * 9)} /><TopAtes x={1000} y={560} t={t} at={a + 0.2} s={2} /></>) },
  { c: "Sen onu tamamlattın", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [1000, 520], <YeniCami t={t} k={lerp(0.25, 1, ramp(t, a, b))} />) },
  { c: "Bin altı yüz altmış beşte", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.1], [1000, 540], <YeniCami t={t} k={1} />),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="1665 · YENİ CAMİ AÇILDI" y={70} size={100} accent={H.gold} /> },
  { c: "Ve hemen yanına", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [300, 700], <YeniCami t={t} k={1} />),
    html: (t, a) => <Tag t={t} at={a + 0.5} text="MISIR ÇARŞISI" c={H.red} /> },
  { c: "Bugün o çarşıdan baharat alan", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [500, 680], <><YeniCami t={t} k={1} />{[0, 1, 2].map((i) => kadin(t, 300 + i * 220, i, { face: "smile", look: 0.3 }, 0.6))}</>) },
  { c: "Sen, bin altı yüz seksen üç", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [1000, 560], <YeniCami t={t} k={1} night={1} />),
    html: (t, a) => <Tag t={t} at={a + 0.4} text="TURHAN SULTAN · 1683 · EDİRNE" c="#1F4A40" /> },
  { c: "Ve kendi yaptırdığın caminin", r: (t, a, b) => again("Sen, bin altı yüz seksen üç", t, a, b, 1) },
  { c: "Oğlun Mehmed, tam otuz dokuz", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 560], topk(t, <>{ibr(t, 960, { face: "normal", plain: false, robe: "#C9A35A", robe2: "#F2E6D0", seed: 25 }, 1.18)}</>, 200)),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="AVCI MEHMED" sub="39 yıl padişah · 1648–1687" c="#C9A35A" /> },
  { c: "Halk ona Avcı Mehmed dedi", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 700], <><Bozkir t={t} pan={ramp(t, a, b) * 800} /><Atli x={lerp(300, 1500, ramp(t, a, b))} y={1010} s={1.2} t={t} c="#5A3A26" /></>) },
  { c: "Belki de, çocukken kapalı kaldığı", r: (t, a, b) => again("Halk ona Avcı Mehmed dedi", t, a, b, 1) },
  { c: "Ve o otuz dokuz yıl boyunca", tone: "gold", r: (t, a, b) => C(t, a, b, [2.2, 2.6], [960, 420], topk(t, <>{ibr(t, 960, { face: "normal", robe: "#C9A35A", robe2: "#F2E6D0", seed: 25 }, 1.18)}</>, 200)) },
  { c: "Bir mermer havuzun izi", sfx: "drone", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [960, 900], havuz(t, null, { ripple: 0.2 })),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="BİR MERMER HAVUZUN İZİ" y={70} size={100} /> },

  // ── SONUÇ ──
  { c: "Sultan İbrahim'in hareminde anne olmak", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], daire(t, <>{tur(t, 960, { face: "normal", hands: "baby", baby: bb(t) }, 1.2)}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="DIŞARIDAN: ZAFER" y={70} size={100} accent={H.gold} /> },
  { c: "İlk oğlu doğuran", r: (t, a, b) => again("Sultan İbrahim'in hareminde anne olmak", t, a, b, 0) },
  { c: "Ama içeriden bakınca", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper />{["1.300 / 1.000", "SÜT ANNE", "HAVUZ", "SAMUR", "VALİDELİK"].map((l, i) => <Disc key={l} x={400 + i * 280} y={460} r={115} k={ramp(t, a + 0.6 + i * 1.6, a + 1 + i * 1.6)} c={[H.gold, "#8A6A3A", H.cobalt, "#5A3A26", "#4A2A5A"][i]} label={l} />)}</>),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="İÇERİDEN: HER GÜN BİR SINAV" y={70} size={90} /> },
  { c: "Oğlunun süt annesi", r: (t, a, b) => again("Ama içeriden bakınca", t, a, b, 0) },
  { c: "Oğlun babasının öfkesiyle", r: (t, a, b) => again("Ama içeriden bakınca", t, a, b, 1) },
  { c: "Ve oğlun padişah", r: (t, a, b) => again("Ama içeriden bakınca", t, a, b, 2) },
  { c: "Ama sen bekledin", tone: "gold", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 560], daire(t, <>{tur(t, 960, { face: "closed" })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="BEKLEDİN · SUSTUN · ÖĞRENDİN" y={820} size={86} /> },
  { c: "Ve sonunda, bu sarayın en güçlü", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 560], topk(t, <>{turV(t, 960, { face: "normal", look: 0 }, 1.25)}</>, 200)) },
  { c: "Peki sen Turhan'ın yerinde olsaydın", tone: "warm", r: (t, a, b) => again("Ve aranızda bir tartışma çıktı", t, a, b, 0) },
  { c: "O havuzun kenarında, süt anne Zafire'yi", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /><Disc x={600} y={440} r={230} k={ramp(t, a + 0.6, a + 1)} c={H.gold} label="AFFEDERDİM" /><Disc x={1320} y={440} r={230} k={ramp(t, a + 2.4, a + 2.8)} c={H.red} label="GİTSİN" /></>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="SEN OLSAN?" y={820} size={110} /> },
  { c: "Cevabını yorumlarda bekliyorum", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="CEVABIN YORUMLARDA 👇" y={420} size={100} /> },
  { c: "Ve eğer bu hikâye sana dokunduysa", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [960, 540], <YeniCami t={t} k={1} night={0} />), html: (t, a) => <Abone t={t} at={a + 0.5} /> },
  { c: "Çünkü bir sonraki hikâyede", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], daire(t, <><g transform="translate(960,860) scale(1.4)"><Bebek t={t} /></g>{kadin(t, 1300, 4, { face: "worried", look: -0.5 })}</>, 0.4)), html: (t, a, b) => htmlOf("Ve eğer bu hikâye sana dokunduysa", t, b) },
  { c: "Ve o küçük", r: (t, a, b) => again("Çünkü bir sonraki hikâyede", t, a, b, 0) },
  { c: "Görüşmek üzere", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1], [960, 540], <YeniCami t={t} k={1} night={1} />) },
];

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : s.c.startsWith("+") ? after - 0.2 + parseFloat(s.c) : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K3R_20_SECONDS));
  return raw;
})();

const VOL: Record<string, number> = { whoosh: 0.07, drone: 0.14, boom: 0.15, ding: 0.14, knock: 0.1, pop: 0.12, splash: 0.08 };
export const K3RVideo20: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K3R_20_SECONDS;
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
      <Audio src={staticFile("audio/k3r-20.wav")} />
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

export const _k3r20Unused = { Fiskiye: null, Laleler, Samdan, Bebek, Tugra, lerp };
