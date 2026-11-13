import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k3r-16-words.json";
import { makeCue, ramp } from "../../lib/cues";
import { H, lerp } from "../../components/Harem";
import { Abone, Belge, Disc, NameCard, Paper, Tag, Txt } from "../../components/K3Text";
import { Atmos, Fore, LiveCam, Sweep, Tone } from "../../components/Live";
import { Bebek, Motes, NightVeil, PCam, PFig, PFrame, proWalk, Samdan } from "../../components/HaremPro";
import { KadiMahkeme, NikahSenet, SicilKalem, Kese } from "../../components/HaremMahkeme";
import { Besik, Cami } from "../../components/HaremPlus2";
import { Snow } from "../../components/HayatYayin";
import { Alev, Bilezik, CelpKagit, CibaliSokak, Duman, EkmekVesika, EvOda, GazLamba, Gazete, HamamPro, Kavanoz, Kivilcim, Mangal, RecelTabak, TutunFabrika } from "../../components/HaremKuma";

// Kanal 1 · k3r-16 · "Osmanlı'da Kocası Kuma Getiren Kadın Olmak Neden Zordu?" — HaremPro + Kuma kiti (geç Osmanlı İstanbul'u).
// Sen: Feride (27, Cibali, 1916-1919). Leman (kuma, 18). Mürüvvet (kayınvalide). Rıza Efendi (fesli). Nazife (komşu).
// BELGE 1: 1885 sayımı ~%2 (Duben & Behar). BELGE 2: Hukuk-ı Aile Kararnamesi 25.10.1917. OLAY: 31.05.1918 Fatih-Cibali yangını.

const ALT: Record<string, string[]> = {
  "Otuz bir Mayıs": ["31 Mayıs"], "On sekiz yaşında bir kız": ["18 yaşında bir kız"], "Yirmi yedi yaşındasın": ["27 yaşındasın"],
  "Bin dokuz yüz on altı": ["1916"], "Dokuz yıldır evlisiniz": ["9 yıldır evlisiniz"], "Altmış yaşında": ["60 yaşında"],
  "Ve dokuz yıldır, evde": ["Ve 9 yıldır evde"], "Bin sekiz yüz seksen beş": ["1885"], "Yüzde iki": ["Yüzde 2", "%2"],
  "Bin dokuz yüz on yedi sonbaharı": ["1917 sonbaharı"], "Bin dokuz yüz on yedi yazı": ["1917 yazı"], "Bin dokuz yüz on yedinin son günleri": ["1917'nin son günleri"],
  "Bin dokuz yüz on sekiz başı": ["1918 başı"], "Bin dokuz yüz on dokuz baharı": ["1919 baharı"], "yaklaşık yedi bin beş yüz ev": ["yaklaşık 7.500 ev", "yaklaşık 7500 ev"],
  "Seksen yaşında": ["80 yaşında"], "Otuz beş sene önce": ["35 sene önce"], "yüz elli yedi maddelik": ["157 maddelik"],
  "Bin dokuz yüz on altı yılındayız": ["1916 yılındayız"], "Kızım, nikâhta bir şart koydur": ["Kızım, nikahda bir şart koydur"],
  "Sen bu evin büyük hanımı olarak kalacaksın": ["Sen bu evin büyük hanım olarak"], "Leman eşikte durdu": ["Leman ışıkta durdu"],
  "Altıncı sabah, ferace giydin": ["Altıncı sabah feraceyi giydin"], "Fatih'teki şer'iye mahkemesine": ["Fatih'teki şeria mahkemesine"],
  "Kadı efendi, kâtibe bir şeyler yazdırıyor": ["Kadı Efendi, kâtibi bir şeyler"], "Ve Leman'ın kapısının önünden geçerken": ["Ve lamanın kapısının önünden"],
  "Ve sessizce, Leman'ın kapısının önüne bıraktın": ["ve sessizce lamanın kapısının önüne"], "Gerçekten de, yirmi beş Ekim": ["Gerçekten de 25 Ekim"],
  "Celp kâğıdı": ["Celb kağıdı"], "İçeri giriyor": ["İçeri gidiyor"],
  "Mürüvvet Hanım kapıda duruyordu": ["Mürüvvet anıp kapıda"], "Bin sekiz yüz seksen beşte": ["1885'te"],
  "Bin dokuz yüz on yedide": ["1917'de"], "Ve otuz bir Mayıs bin dokuz yüz on sekizde": ["Ve 31 Mayıs 1918'de"],
};
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const VAR: [RegExp, string][] = [[/â/g, "a"], [/î/g, "i"], [/û/g, "u"]];
const variants = (p: string) => { const out = [p]; for (const [re, to] of VAR) for (const v of [...out]) { const n = v.replace(re, to); if (n !== v) out.push(n); } return out; };
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K3R_16_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone; fore?: "column" | "curtain" | "lamp" };
type PO = Partial<React.ComponentProps<typeof PFig>>;

// ── karakterler ──
const Y = 1005;
const fer = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="girl" robe="#5A2A4A" robe2="#E9D8C0" scarf="#F2E6D0" t={t} seed={3} {...o} />;
const ferDis = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="girl" robe="#2A2430" robe2="#3A3440" scarf="#F4F0E6" t={t} seed={3} {...o} />; // ferace + yaşmak (dışarıda)
const lem = (t: number, x: number, o: PO = {}, s = 1.0) => <PFig x={x} y={Y} s={s} kind="girl" robe="#8AAAC0" robe2="#EFE6D4" scarf="#D8C8A8" t={t} seed={7} {...o} />;
const mur = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="kalfa" robe="#3A3A4A" robe2="#D9CFC0" scarf="#E9E2D4" t={t} seed={5} {...o} />;
const naz = (t: number, x: number, o: PO = {}, s = 1.02) => <PFig x={x} y={Y} s={s} kind="kalfa" robe="#6A6A5A" robe2="#E2D9C6" scarf="#F2EEE4" t={t} seed={15} {...o} />;
const anne = (t: number, x: number, o: PO = {}, s = 1.08) => <PFig x={x} y={Y} s={s} kind="kalfa" robe="#4A5A4A" robe2="#E9DCC2" t={t} seed={16} {...o} />;
const riza = (t: number, x: number, o: PO = {}, s = 1.14) => <PFig x={x} y={Y} s={s} kind="prince" plain fes robe="#2A2E3A" robe2="#D9D2C4" t={t} seed={8} {...o} />;
const rizaAsker = (t: number, x: number, o: PO = {}, s = 1.14) => <PFig x={x} y={Y} s={s} kind="prince" plain fes robe="#5A5A3A" robe2="#8A8A6A" t={t} seed={8} {...o} />;
const kadi = (t: number, o: PO = {}) => <PFig x={960} y={758} s={1.0} kind="sultan" plain sit robe="#3A5A3A" robe2="#E9DCC2" t={t} seed={11} {...o} />;
const imam = (t: number, x: number, o: PO = {}, s = 1.1) => <PFig x={x} y={Y} s={s} kind="sultan" plain robe="#E9E2D0" robe2="#F7F2E6" t={t} seed={12} {...o} />;
const erkek = (t: number, x: number, i: number, o: PO = {}, s = 1.05) => <PFig x={x} y={Y} s={s} kind="prince" plain fes robe={["#4A3A2A", "#3A4A5A", "#5A4A3A", "#4A5A3A"][i % 4]} robe2="#E2D9C6" t={t} seed={50 + i} {...o} />;
const kadin = (t: number, x: number, i: number, o: PO = {}, s = 1.0) => <PFig x={x} y={Y} s={s} kind="girl" robe={["#7A5A6A", "#5A6A7A", "#8A6A4A", "#6A7A5A", "#9A6A6A"][i % 5]} robe2="#EFE6D4" scarf={["#F2E6D0", "#E9DCC2", "#D8C8A8"][i % 3]} t={t} seed={30 + i} {...o} />;
const ebe = (t: number, x: number, o: PO = {}, s = 1.06) => <PFig x={x} y={Y} s={s} kind="kalfa" robe="#7A4A3A" robe2="#F1E3C6" t={t} seed={13} {...o} />;

// ── mekânlar ──
const C = (t: number, a: number, b: number, z: [number, number], c0: [number, number], kids: React.ReactNode, c1?: [number, number]) => <PCam t={t} a={a} b={b} z={z} c0={c0} c1={c1}>{kids}</PCam>;
const sokak = (t: number, figs: React.ReactNode = null, o: { pan?: number; dusk?: number; fire?: number } = {}) => <><CibaliSokak t={t} pan={o.pan ?? 0} dusk={o.dusk ?? 0} fire={o.fire ?? 0} />{figs}</>;
const yangin = (t: number, figs: React.ReactNode = null, pan = 400) => <><CibaliSokak t={t} pan={pan} dusk={0.6} fire={1} />{figs}<Kivilcim t={t} n={30} /></>;
const oda = (t: number, figs: React.ReactNode = null, o: { night?: number; cold?: number } = {}) => (
  <>
    <EvOda t={t} night={o.night ?? 0} cold={o.cold ?? 0} />
    {figs}
    {(o.night ?? 0) > 0.5 && <NightVeil id="nvKO" k={0.6} lights={[{ x: 960, y: 360, r: 520 }, { x: 960, y: 800, r: 420, f: 0.8 }]} t={t} />}
  </>
);
const fab = (t: number, figs: React.ReactNode = null) => <><TutunFabrika t={t} />{figs}</>;
const hamam = (t: number, figs: React.ReactNode = null) => <><HamamPro t={t} />{figs}</>;
const mahkeme = (t: number, figs: React.ReactNode = null, light = 1) => <><KadiMahkeme t={t} light={light} />{kadi(t, { look: 0.2 })}{figs}</>;
const gece = (t: number, figs: React.ReactNode, lx = 960) => <>{oda(t, figs, { night: 1 })}<NightVeil id="nvG2" k={0.35} lights={[{ x: lx, y: 600, r: 380 }]} t={t} /></>;
const kar = (t: number) => <Snow t={t} n={90} wind={0.3} />;
const kapali = (t: number, kids: React.ReactNode, bg = "#2A1E16") => <><rect width={1920} height={1080} fill={bg} />{kids}<Motes t={t} n={24} op={0.4} /></>;
const yur = (t: number, a: number, b: number, x0: number, x1: number, s = 1.0) => ({ x: lerp(x0, x1, ramp(t, a, b)), walk: proWalk(t, a, b, x0, x1, s).walk });

const SHOTS: Sh[] = [
  // ── AN ──
  { c: "Otuz bir Mayıs", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 520], yangin(t, null, 300)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="31 MAYIS 1918 · CİBALİ" y={70} size={90} accent={H.red} /> },
  { c: "Gökyüzü kararmış", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.2], [960, 300], yangin(t, null, 500)) },
  { c: "Ama gece değil", tone: "warm", r: (t, a, b) => C(t, a, b, [1.8, 2], [960, 260], <><CibaliSokak t={t} pan={700} dusk={0.6} fire={1} /><Duman x={960} y={600} t={t} s={2} dark={0.9} /></>),
    html: (t, a) => <Txt t={t} at={a + 0.8} text="DUMAN" y={820} size={110} accent={H.red} /> },
  { c: "Cibali'nin dar sokaklarında herkes koşuyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], yangin(t, <>{[0, 1, 2].map((i) => { const w = yur(t, a, b, 1900 + i * 200, -200 + i * 250, 1.2); return kadin(t, w.x, i, { walk: w.walk, face: "worried" }); })}{erkek(t, lerp(-200, 1400, ramp(t, a, b)), 0, { walk: proWalk(t, a, b, -200, 1400, 1.3).walk })}</>, 600)) },
  { c: "Biri bağırıyor", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 540], yangin(t, <>{erkek(t, 960, 1, { talk: 1, face: "shock" })}</>, 640)),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="“YANGIN VAR!”" y={820} size={110} accent={H.red} /> },
  { c: "Sen evin önünde duruyorsun", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 620], yangin(t, <>{ferDis(t, 820, { face: "shock", look: 0.5 })}</>, 368)) },
  { c: "Kapı açık", tone: "warm", r: (t, a, b) => C(t, a, b, [2.6, 2.9], [1180, 660], yangin(t, <><Duman x={1180} y={700} t={t} s={0.6} /></>, 368)) },
  { c: "Ve yukarıdan", sfx: "drone", tone: "warm", r: (t, a, b) => C(t, a, b, [2.4, 2.8], [1100, 330], yangin(t, null, 368)) },
  { c: "Bir bebek ağlıyor", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 540], kapali(t, <><Besik x={960} y={760} s={2.2} t={t} cry={1} /><Duman x={600} y={900} t={t} s={1.2} /><Duman x={1400} y={900} t={t} s={1.2} seed={3} /></>, "#1A1210")) },
  { c: "Ama bu senin bebeğin değil", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [820, 540], yangin(t, <>{ferDis(t, 820, { face: "shock" })}</>, 368)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="SENİN BEBEĞİN DEĞİL" y={820} size={96} accent={H.red} /> },
  { c: "Bu, kocanın öteki karısının bebeği", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], kapali(t, <>{lem(t, 960, { hands: "baby", face: "worried" }, 1.2)}</>, "#2A1A14")) },
  { c: "Senin kumanın bebeği", r: (t, a, b) => again("Bu, kocanın öteki karısının bebeği", t, a, b, 0),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="KUMA" y={80} size={140} accent={H.red} /> },
  { c: "Bir adım atarsan", tone: "warm", r: (t, a, b) => C(t, a, b, [1.8, 2.1], [1000, 760], yangin(t, <>{ferDis(t, 820, { face: "worried", look: 0.7 })}<Alev x={1200} y={820} s={0.8} t={t} /></>, 368)) },
  { c: "Geri dönersen", r: (t, a, b) => again("Bir adım atarsan", t, a, b, 1) },
  { c: "Bir saniyen var", sfx: "ding", tone: "night", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [820, 520], yangin(t, <>{ferDis(t, 820, { face: "closed" })}</>, 368)),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="BİR SANİYE" y={820} size={110} /> },
  { c: "Ne yapacaksın", r: (t, a, b) => again("Bir saniyen var", t, a, b, 2) },
  { c: "Bu soruya geri döneceğiz", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1], [960, 540], sokak(t, null, { pan: ramp(t, a, b) * 300 })),
    html: (t, a) => <Tag t={t} at={a + 1} text="1916 · BİR BUÇUK YIL ÖNCE" c={H.cobalt} /> },
  { c: "Çünkü bugün", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={600} y={440} r={220} k={ramp(t, a + 0.5, a + 1)} c={H.red} label="EFSANE" /><Disc x={1320} y={440} r={220} k={ramp(t, a + 2.5, a + 3)} c={H.cobalt} label="BELGE" /></>) },
  { c: "Bu tür hikâyeleri seviyorsan", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.1], [960, 540], sokak(t, <>{ferDis(t, 960, { face: "normal" }, 1.2)}</>, { pan: 300 })),
    html: (t, a) => <Abone t={t} at={a + 0.4} /> },

  // ── SEN KİMSİN ──
  { c: "Adın Feride", sfx: "ding", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], oda(t, <>{fer(t, 960, { face: "normal" }, 1.3)}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.3} name="FERİDE" sub="27 yaşında · Cibali, İstanbul" c="#5A2A4A" /> },
  { c: "Bin dokuz yüz on altı yılındayız", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.1], [960, 520], sokak(t, null, { pan: ramp(t, a, b) * 500 })),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="1916 · CİBALİ" y={70} size={90} /> },
  { c: "Haliç'in kıyısında", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 560], sokak(t, null, { pan: 2 * 368 - 600 + ramp(t, a, b) * 80 })) },
  { c: "Kocan Rıza Efendi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], sokak(t, <>{riza(t, 960, { face: "normal" }, 1.3)}</>, { pan: 120 })),
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="RIZA EFENDİ" sub="Kocan · Tütün fabrikasında ambar başı" c="#2A2E3A" /> },
  { c: "Cibali Tütün Fabrikası'nda ambar başı", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 520], fab(t, <>{riza(t, lerp(300, 1500, ramp(t, a, b)), { walk: proWalk(t, a, b, 300, 1500, 1.0).walk, look: 0.4 }, 0.95)}</>)),
    html: (t, a) => <Tag t={t} at={a + 1} text="CİBALİ TÜTÜN FABRİKASI" c={H.red} /> },
  { c: "Saygın bir iş", r: (t, a, b) => again("Cibali Tütün Fabrikası'nda ambar başı", t, a, b, 0) },
  { c: "Dokuz yıldır evlisiniz", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], oda(t, <>{fer(t, 760, { sit: true, y: 880, look: 0.5 })}{riza(t, 1200, { sit: true, y: 880, look: -0.5 })}</>)) },
  { c: "Ve dokuz yıldır, evde", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [960, 620], oda(t, <><Besik x={960} y={900} s={1.4} t={t} rock={0} baby={false} /></>, { cold: 0.6 })),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="BİR ÇOCUK SESİ YOK" y={820} size={90} /> },
  { c: "Bir de savaş var", sfx: "boom", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 560], sokak(t, <>{[0, 1, 2].map((i) => kadin(t, 500 + i * 450, i, { face: "sad" }))}</>, { pan: 800, dusk: 0.3 })),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="BİRİNCİ DÜNYA SAVAŞI · 3. YIL" c={H.red} /> },
  { c: "Mahallenin gençleri cepheye gitti", r: (t, a, b) => again("Bir de savaş var", t, a, b, 0) },
  { c: "Ekmek artık vesikayla", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.06], [960, 540], kapali(t, <EkmekVesika x={960} y={520} s={1.6} k={ramp(t, a + 0.2, a + 0.8)} />)),
    html: (t, a) => <Tag t={t} at={a + 1.2} text="EKMEK VESİKASI = KARNE" c={H.cobalt} /> },
  { c: "Fırının önünde", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], sokak(t, <>{Array.from({ length: 7 }, (_, i) => kadin(t, 200 + i * 230, i, { face: i % 2 ? "sad" : "worried", look: 0.6 }, 0.95))}</>, { pan: 1100, dusk: 0.15 })) },
  { c: "Ama senin derdin ekmek değil", tone: "warm", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [960, 540], oda(t, <>{fer(t, 960, { face: "sad" })}</>)) },
  { c: "Senin derdin, kayınvalidenin bakışları", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], oda(t, <>{mur(t, 640, { look: 0.6 })}{fer(t, 1240, { face: "worried", look: -0.4 })}</>)) },
  { c: "Mürüvvet Hanım", tone: "warm", r: (t, a, b) => C(t, a, b, [1.7, 1.9], [700, 560], oda(t, <>{mur(t, 700, { look: 0.3 }, 1.2)}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.3} name="MÜRÜVVET HANIM" sub="Kayınvaliden · 60 yaşında" c="#3A3A4A" x={1100} /> },
  { c: "Seninle aynı evde yaşıyor", r: (t, a, b) => again("Mürüvvet Hanım", t, a, b, 0), html: (t, a, b) => htmlOf("Mürüvvet Hanım", t, b) },
  { c: "Ama sesi yükselmeden de", r: (t, a, b) => again("Mürüvvet Hanım", t, a, b, 1) },
  { c: "Her sabah aynı cümle", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 640], oda(t, <>{mur(t, 760, { sit: true, y: 880, talk: 1, look: -0.2 })}{fer(t, 1240, { sit: true, y: 880, look: -0.6, face: "sad" })}<g transform="translate(960,960)"><path d="M-80,0 L80,0 L60,-20 L-60,-20Z" fill="#C9873B" /></g></>)) },
  { c: "Allah bize de bir torun nasip etse", r: (t, a, b) => again("Her sabah aynı cümle", t, a, b, 0),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="“ALLAH BİZE DE BİR TORUN NASİP ETSE.”" y={820} size={70} /> },
  { c: "Sana bakmıyor bunu söylerken", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [1240, 590], oda(t, <>{fer(t, 1240, { sit: true, y: 880, face: "sad", bow: 0.4 })}</>)) },
  { c: "Şimdi aklına bir gece geliyor", sfx: "whoosh", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], gece(t, <>{anne(t, 760, { look: 0.6 })}{fer(t, 1160, { look: -0.6, face: "shy" }, 1.05)}<Samdan x={1600} y={1010} t={t} /></>)),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="DOKUZ YIL ÖNCE · NİKÂH GECESİ" c={H.purple} /> },
  { c: "Annen seni bir köşeye çekmişti", r: (t, a, b) => again("Şimdi aklına bir gece geliyor", t, a, b, 0) },
  { c: "Kızım, nikâhta bir şart koydur", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [760, 560], gece(t, <>{anne(t, 760, { look: 0.6, talk: 1 })}</>, 760)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="“NİKÂHTA BİR ŞART KOYDUR.”" y={820} size={80} /> },
  { c: "Sen gülmüştün", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [1160, 560], gece(t, <>{fer(t, 1160, { face: "smile", look: -0.6 }, 1.05)}</>, 1160)) },
  { c: "Anne, Rıza öyle bir adam değil", r: (t, a, b) => again("Sen gülmüştün", t, a, b, 1) },
  { c: "Ve o şart, hiçbir zaman yazılmadı", sfx: "ding", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 540], kapali(t, <NikahSenet t={t} k={1} hi={0} s={1.3} />)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="ŞART YOK" y={860} size={100} accent={H.red} /> },
  { c: "Bu cümleyi unutma", r: (t, a, b) => again("Ve o şart, hiçbir zaman yazılmadı", t, a, b, 0), html: (t, a, b) => htmlOf("Ve o şart, hiçbir zaman yazılmadı", t, b) },

  // ── ÇARE ARAYIŞI ──
  { c: "İlk yıllar, kimse bir şey demedi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.3], [960, 620], sokak(t, <>{[0, 1].map((i) => kadin(t, 600 + i * 260, i, { talk: 1, look: 0.4 }))}{ferDis(t, 1400, { look: -0.5, face: "worried" })}</>, { pan: 200 })) },
  { c: "Mahallenin ebesi geldi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 620], oda(t, <>{ebe(t, 760, { look: 0.5, talk: 1 })}{fer(t, 1180, { sit: true, y: 880, look: -0.5 })}<Mangal x={1500} y={1040} t={t} /></>)),
    html: (t, a) => <Tag t={t} at={a + 1} text="ISIRGAN OTU · 40 GÜN" c={H.green} /> },
  { c: "Eyüp Sultan'a gittin", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 520], <><Cami t={t} />{ferDis(t, lerp(400, 900, ramp(t, a, b)), { walk: proWalk(t, a, b, 400, 900, 1.0).walk, look: 0.4 }, 0.95)}</>),
    html: (t, a) => <Tag t={t} at={a + 0.8} text="EYÜP SULTAN" c={H.gold} /> },
  { c: "Bir hoca muska yazdı", tone: "night", r: (t, a, b) => C(t, a, b, [2, 2.3], [960, 560], gece(t, <>{fer(t, 960, { sit: true, y: 880, face: "closed" })}<path d="M940,640 l20,0 l0,24 l-10,8 l-10,-8Z" fill="#E9DCC2" stroke={H.ln} strokeWidth={2} /></>)) },
  { c: "Mürüvvet Hanım her seferinde", tone: "warm", r: (t, a, b) => C(t, a, b, [1.8, 2], [700, 570], oda(t, <>{mur(t, 700, { talk: 1 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 1} text="“SABIR.”" y={820} size={110} /> },
  { c: "Ama gözleri başka bir şey diyordu", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [700, 540], oda(t, <>{mur(t, 700, { look: 0.5, face: "normal" })}</>)) },
  { c: "Ve bir akşam", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 540], sokak(t, <>{riza(t, lerp(1900, 1100, ramp(t, a, b)), { walk: proWalk(t, a, b, 1900, 1100, 1.1).walk })}</>, { dusk: 0.8, pan: 368 })),
    html: (t, a) => <Tag t={t} at={a + 0.8} text="1916 SONBAHARI" c={H.cobalt} /> },
  { c: "Sofraya oturmadı", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [1300, 600], oda(t, <>{riza(t, 1440, { look: 0.8 })}{fer(t, 700, { sit: true, y: 880, look: 0.6, face: "worried" })}</>, { night: 0.7 })) },
  { c: "Sonra, sana bakmadan konuştu", r: (t, a, b) => again("Sofraya oturmadı", t, a, b, 0) },
  { c: "Feride. Bir kadın daha alacağım", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [1440, 560], oda(t, <>{riza(t, 1440, { look: 0.8, talk: 1 })}</>, { night: 0.7 })),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="“BİR KADIN DAHA ALACAĞIM.”" y={820} size={90} accent={H.red} /> },
  { c: "Bir saniye, sözlerin anlamını anlamadın", tone: "night", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [700, 550], oda(t, <>{fer(t, 700, { sit: true, y: 880, face: "shock" })}</>, { night: 0.7 })) },
  { c: "Kuma", sfx: "ding", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper c="#2A1E16" /></>),
    html: (t, a) => <Txt t={t} at={a + 0.1} text="KUMA" y={380} size={220} accent={H.red} sub="kocanın öteki karısı" /> },
  { c: "Ve bu kelimeyi duyan her kadın", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.5], [700, 560], oda(t, <>{fer(t, 700, { sit: true, y: 880, face: "sad", bow: 0.3 })}</>, { night: 0.7 })) },
  { c: "Rıza devam etti", r: (t, a, b) => again("Sofraya oturmadı", t, a, b, 1) },
  { c: "Sen bu evin büyük hanımı olarak kalacaksın", r: (t, a, b) => again("Feride. Bir kadın daha alacağım", t, a, b, 0),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="“HİÇBİR ŞEY DEĞİŞMEYECEK.”" y={820} size={80} /> },
  { c: "Ama sen biliyordun", r: (t, a, b) => again("Bir saniye, sözlerin anlamını anlamadın", t, a, b, 1),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="HER ŞEY DEĞİŞECEKTİ" y={820} size={90} accent={H.red} /> },

  // ── BELGE 1 ──
  { c: "Şimdi bir dakika duralım", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />), html: (t, a) => <Txt t={t} at={a + 0.2} text="BİR DAKİKA DURALIM" y={430} size={100} /> },
  { c: "Çünkü belki sen de bunu duymuşsundur", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{[0, 1, 2, 3].map((i) => <Disc key={i} x={420 + i * 360} y={460} r={140} k={ramp(t, a + 1.5 + i * 0.3, a + 1.8 + i * 0.3)} c={[H.rose, H.lilac, H.teal, H.ochre][i]} label={`${i + 1}. EŞ`} />)}</>),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="“HER ERKEĞİN DÖRT KARISI VARDI”" y={80} size={76} /> },
  { c: "Gerçek bambaşka", sfx: "boom", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{[0, 1, 2, 3].map((i) => <Disc key={i} x={420 + i * 360} y={460} r={140} k={1 - ramp(t, a + 0.3 + i * 0.15, a + 0.6 + i * 0.15)} c={[H.rose, H.lilac, H.teal, H.ochre][i]} label={`${i + 1}. EŞ`} />)}</>),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="EFSANE" y={80} size={120} accent={H.red} /> },
  { c: "Tarihçiler Alan Duben ve Cem Behar", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], <><Paper /><g transform="translate(960,540)">{Array.from({ length: 8 }, (_, r) => <rect key={r} x={-600} y={-300 + r * 80} width={1200} height={60} fill={r % 2 ? "#E9DCC0" : "#F3E9D2"} stroke={H.ln} strokeWidth={2} />)}{Array.from({ length: 8 }, (_, r) => <path key={`l${r}`} d={`M-560,${-270 + r * 80} h${300 + (r % 3) * 120}`} stroke="#5A4A3A" strokeWidth={4} opacity={0.6} />)}</g></>),
    html: (t, a) => <Tag t={t} at={a + 1} text="1885 İSTANBUL NÜFUS SAYIMI" c={H.cobalt} /> },
  { c: "Ve şunu buldular", sfx: "drone", r: (t, a, b) => again("Tarihçiler Alan Duben ve Cem Behar", t, a, b, 0) },
  { c: "İstanbul'da evli erkeklerin sadece yüzde iki kadarı", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{Array.from({ length: 100 }, (_, i) => { const x = 380 + (i % 20) * 58, y = 260 + Math.floor(i / 20) * 110; const on = i >= 98 && t > a + 2.5; return <g key={i} transform={`translate(${x},${y})`} opacity={ramp(t, a + i * 0.012, a + i * 0.012 + 0.2)}><circle cx={0} cy={-26} r={14} fill={on ? H.red : "#8A7A6A"} /><path d="M-18,20 Q0,-14 18,20Z" fill={on ? H.red : "#8A7A6A"} /></g>; })}</>),
    html: (t, a) => <Belge t={t} at={a + 4.5} date="İstanbul, 1885" src="Duben & Behar, Istanbul Households (1991)">Evli erkeklerin yalnızca yaklaşık <b>yüzde ikisi</b> birden fazla eşliydi.</Belge> },
  { c: "Yüzde iki", r: (t, a, b) => again("İstanbul'da evli erkeklerin sadece yüzde iki kadarı", t, a, b, 0), html: (t, a, b) => htmlOf("İstanbul'da evli erkeklerin sadece yüzde iki kadarı", t, b) },
  { c: "Peki bu ne demek", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], sokak(t, <>{ferDis(t, 960, { face: "sad" })}{[0, 1, 2, 3].map((i) => kadin(t, 300 + i * 440 + (i > 1 ? 300 : 0), i, { look: i < 2 ? 0.5 : -0.5, op: 0.9 }, 0.9))}</>, { pan: 900 })) },
  { c: "Bu demek ki, Feride, sen nadir bir durumdasın", r: (t, a, b) => again("Peki bu ne demek", t, a, b, 0) },
  { c: "Annen yaşamadı", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 600], sokak(t, <>{anne(t, 700, { look: 0.4 })}{[0, 1].map((i) => kadin(t, 1100 + i * 300, i + 2, { look: -0.3, talk: 1 }, 0.95))}</>, { pan: 600 })) },
  { c: "Dertleşecek kimsen yok", tone: "cool", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [960, 550], sokak(t, <>{ferDis(t, 960, { face: "sad", bow: 0.4 })}</>, { pan: 900, dusk: 0.4 })) },
  { c: "Ve araştırmalar bir şey daha gösteriyor", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={960} y={460} r={240} k={ramp(t, a + 2.5, a + 3)} c={H.purple} label="ÇOCUKSUZLUK" /></>) },
  { c: "Yani senin hikâyen", r: (t, a, b) => again("Ve araştırmalar bir şey daha gösteriyor", t, a, b, 0) },

  // ── LEMAN GELİYOR ──
  { c: "Kış geldi", sfx: "whoosh", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], <>{sokak(t, null, { pan: 368, dusk: 0.2 })}{kar(t)}</>) },
  { c: "Kapıda on sekiz yaşında bir kız duruyordu", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 620], <>{sokak(t, <>{lem(t, 960, { face: "worried", look: 0.2 }, 1.15)}</>, { pan: 368, dusk: 0.2 })}{kar(t)}</>),
    html: (t, a) => <NameCard t={t} at={a + 0.5} name="LEMAN" sub="18 yaşında · Çanakkale şehidinin kızı" c="#5A7A9A" /> },
  { c: "Elinde küçük bir bohça", tone: "cool", r: (t, a, b) => C(t, a, b, [2.6, 2.8], [960, 800], <>{sokak(t, <>{lem(t, 960, { hands: "tray", trayItem: <path d="M-50,-10 C-60,-60 60,-60 50,-10Z" fill="#B8742E" stroke={H.ln} strokeWidth={3} /> }, 1.15)}</>, { pan: 368, dusk: 0.2 })}{kar(t)}</>) },
  { c: "Babası Çanakkale'de şehit düşmüş", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper c="#E9E0CC" /><Disc x={600} y={460} r={180} k={ramp(t, a + 0.3, a + 0.6)} c={H.red} label="BABA · ÇANAKKALE" /><Disc x={1320} y={460} r={180} k={ramp(t, a + 2.2, a + 2.5)} c="#6A747A" label="ANNE · VEREM" /></>) },
  { c: "Dayısının yanında kalıyormuş", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], oda(t, <>{erkek(t, 500, 0, { look: 0.4 })}{[0, 1, 2, 3, 4, 5, 6].map((i) => kadin(t, 800 + i * 140, i, {}, 0.55))}{lem(t, 1700, { face: "sad" }, 0.95)}</>, { cold: 0.5 })),
    html: (t, a) => <Tag t={t} at={a + 1.5} text="YEDİ ÇOCUK" c="#6A747A" /> },
  { c: "Ve Rıza Efendi'nin teklifi", r: (t, a, b) => again("Dayısının yanında kalıyormuş", t, a, b, 0) },
  { c: "Leman eşikte durdu", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 620], oda(t, <>{lem(t, 600, { face: "worried", look: 0.5, bow: 0.3 })}{fer(t, 1300, { look: -0.5 })}</>, { cold: 0.3 })) },
  { c: "Sana baktı. Sonra gözlerini yere indirdi", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [600, 550], oda(t, <>{lem(t, 600, { face: "shy", look: 0.5, bow: 0.5 })}</>, { cold: 0.3 })) },
  { c: "Ve sen, o an, kendini gördün", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [1300, 550], oda(t, <>{fer(t, 1300, { look: -0.5, face: "worried" })}</>, { cold: 0.3 })) },
  { c: "Dokuz yıl önceki kendini", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], <>{oda(t, <>{fer(t, 960, { face: "shy", bow: 0.4 }, 1.05)}</>)}<rect width={1920} height={1080} fill="#F2D8A8" opacity={0.22} /></>),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="DOKUZ YIL ÖNCE · SEN" c={H.gold} /> },
  { c: "Aynı korku", r: (t, a, b) => again("Dokuz yıl önceki kendini", t, a, b, 0), html: (t, a, b) => htmlOf("Dokuz yıl önceki kendini", t, b) },
  { c: "Ama bu his bir saniye sürdü", tone: "warm", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [1300, 550], oda(t, <>{fer(t, 1300, { look: -0.5, face: "normal" })}</>, { cold: 0.3 })) },
  { c: "Bu kız senin evine giriyordu", r: (t, a, b) => again("Leman eşikte durdu", t, a, b, 1) },
  { c: "Şimdi bilmen gereken bir şey var", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="KUMALI EVİN KURALLARI" y={430} size={96} /> },
  { c: "Her kadının ayrı bir odası olmalıydı", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={600} y={460} r={200} k={ramp(t, a + 0.2, a + 0.6)} c="#5A2A4A" label="FERİDE'NİN ODASI" /><Disc x={1320} y={460} r={200} k={ramp(t, a + 0.8, a + 1.2)} c="#5A7A9A" label="LEMAN'IN ODASI" /></>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="MESKEN-İ ŞER'Î" sub="şeriatın kadına tanıdığı ev hakkı" y={820} size={80} /> },
  { c: "Kendi kapısı, kendi kilidi", r: (t, a, b) => again("Her kadının ayrı bir odası olmalıydı", t, a, b, 0), html: (t, a, b) => htmlOf("Her kadının ayrı bir odası olmalıydı", t, b) },
  { c: "Koca, iki kadına eşit davranmak zorundaydı", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{Array.from({ length: 6 }, (_, i) => <g key={i} transform={`translate(${460 + i * 200},460)`} opacity={ramp(t, a + 1 + i * 0.3, a + 1.3 + i * 0.3)}><circle r={70} fill={i % 2 ? "#5A7A9A" : "#5A2A4A"} /><path d="M-18,-30 a30,30 0 1 0 30,40 a24,24 0 1 1 -30,-40Z" fill="#F3E6C4" /></g>)}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="KASM" sub="geceleri eşit bölmek" y={760} size={110} /> },
  { c: "Bir gece birinde", r: (t, a, b) => again("Koca, iki kadına eşit davranmak zorundaydı", t, a, b, 0), html: (t, a, b) => htmlOf("Koca, iki kadına eşit davranmak zorundaydı", t, b) },
  { c: "Ve kadın, bu haklar çiğnenirse", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], mahkeme(t)),
    html: (t, a) => <Tag t={t} at={a + 1} text="KADI = MAHKEME" c={H.green} /> },
  { c: "Kâğıt üstünde, her şey düzgündü", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 540], kapali(t, <NikahSenet t={t} k={1} s={1.3} />, "#3A2A20")) },
  { c: "Ama kâğıt, bir kadının kalbini korumaz", sfx: "ding", tone: "night", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [960, 550], gece(t, <>{fer(t, 960, { face: "sad", sit: true, y: 880 })}</>)) },

  // ── NİKÂH ──
  { c: "Nikâh, bir hafta sonra, evde kıyıldı", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], oda(t, <>{imam(t, 560, { sit: true, y: 880, look: 0.5, talk: 1 })}{riza(t, 900, { sit: true, y: 880, look: -0.4 })}{erkek(t, 1220, 2, { sit: true, y: 880 })}{erkek(t, 1500, 3, { sit: true, y: 880 })}</>)) },
  { c: "O zamanlar nikâh için", r: (t, a, b) => again("Nikâh, bir hafta sonra, evde kıyıldı", t, a, b, 0),
    html: (t, a) => <Tag t={t} at={a + 1} text="İMAM + İKİ ŞAHİT" c={H.green} /> },
  { c: "Ve o gün, misafirlere şerbet taşıyan kim oldu", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.9], [960, 560], oda(t, <>{fer(t, 960, { hands: "tray", face: "normal" })}</>)) },
  { c: "Sen", sfx: "ding", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [960, 550], oda(t, <>{fer(t, 960, { hands: "tray", face: "closed" })}</>)) },
  { c: "Mürüvvet Hanım öyle istedi", r: (t, a, b) => C(t, a, b, [1.8, 2], [700, 570], oda(t, <>{mur(t, 700, { talk: 1, look: 0.4 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 1.4} text="“EVİN BÜYÜK HANIMI MİSAFİRİ AĞIRLAR.”" y={820} size={66} /> },
  { c: "Elinde gümüş tepsi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], oda(t, <>{fer(t, 260, { hands: "tray" })}{imam(t, 700, { sit: true, y: 880, look: 0.3 })}{riza(t, 1000, { sit: true, y: 880 })}{erkek(t, 1300, 1, { sit: true, y: 880 })}{erkek(t, 1560, 2, { sit: true, y: 880 })}</>)) },
  { c: "İmam soruyor", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [700, 560], oda(t, <>{imam(t, 700, { sit: true, y: 880, talk: 1, look: 0.4 })}</>)) },
  { c: "Rıza cevap veriyor", tone: "warm", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [1000, 560], oda(t, <>{riza(t, 1000, { sit: true, y: 880, talk: 1, look: -0.3 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="“KABUL ETTİM.”" y={820} size={110} /> },
  { c: "Tepsideki bardaklar hafifçe titriyor", sfx: "drone", tone: "warm", r: (t, a, b) => C(t, a, b, [3.4, 3.6], [260 + Math.sin(t * 30) * 0.6, 640], oda(t, <>{fer(t, 260, { hands: "tray" })}</>)) },
  { c: "Şerbeti dağıtıyorsun", r: (t, a, b) => again("Elinde gümüş tepsi", t, a, b, 0) },
  { c: "Çünkü mahallenin gözleri senin üstünde", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], oda(t, <>{[0, 1, 2, 3, 4].map((i) => kadin(t, 300 + i * 330, i, { sit: true, y: 880, look: i < 2 ? 0.5 : -0.5, talk: i % 2 }, 0.92))}</>)) },
  { c: "Ve o gece, kocanın düğün gecesinde", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 640], gece(t, <>{fer(t, 960, { face: "sad", hands: "down", bow: 0.4 })}<GazLamba x={1300} y={500} t={t} s={0.8} /></>)) },
  { c: "Sabaha kadar", r: (t, a, b) => again("Ve o gece, kocanın düğün gecesinde", t, a, b, 2) },

  // ── SAVAŞ EVİN İÇİNDE ──
  { c: "Rıza, evin arka tarafındaki odayı Leman'a verdi", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], <>{oda(t, <>{lem(t, 960, { face: "shy" })}</>)}<rect width={1920} height={1080} fill="#FFE7A0" opacity={0.12} /></>),
    html: (t, a) => <Tag t={t} at={a + 1} text="GÜNEŞ ALAN ODA" c={H.gold} /> },
  { c: "Senin odan kuzeye bakıyor", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], oda(t, <>{fer(t, 960, { face: "sad" })}</>, { cold: 1 })),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="KUZEY ODASI" c="#6A747A" /> },
  { c: "Mürüvvet Hanım, Leman'a yeni bir entari", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 620], oda(t, <>{mur(t, 760, { reach: 0.8, reachDir: 1, look: 0.4, face: "smile" })}{lem(t, 1160, { face: "shy", look: -0.4 })}{fer(t, 1700, { look: -0.6, face: "sad", op: 0.85 }, 0.95)}</>)) },
  { c: "Sana bir şey söylemedi", r: (t, a, b) => again("Mürüvvet Hanım, Leman'a yeni bir entari", t, a, b, 0) },
  { c: "İlk hafta, Rıza üç gece üst üste", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 540], sokak(t, <>{[0, 1, 2].map((i) => <g key={i} opacity={ramp(t, a + 1 + i * 0.6, a + 1.3 + i * 0.6)}><circle cx={700 + i * 260} cy={300} r={60} fill="#F4F1E4" /><circle cx={722 + i * 260} cy={290} r={52} fill="#2A2E4A" /></g>)}</>, { dusk: 1, pan: 368 })),
    html: (t, a) => <Txt t={t} at={a + 1} text="ÜÇ GECE" y={820} size={110} accent={H.red} /> },
  { c: "Sen o üç gece uyumadın", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 560], gece(t, <>{fer(t, 960, { sit: true, y: 880, face: "sad", look: 0.5 })}</>)) },
  { c: "Dördüncü gece", r: (t, a, b) => again("Sen o üç gece uyumadın", t, a, b, 1) },
  { c: "Altıncı sabah, ferace giydin", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], oda(t, <>{ferDis(t, 960, { face: "normal" }, 1.15)}</>)),
    html: (t, a) => <Tag t={t} at={a + 1} text="FERACE · YAŞMAK" c="#2A2430" /> },
  { c: "Nereye mi", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], sokak(t, <>{ferDis(t, lerp(200, 1300, ramp(t, a, b)), { walk: proWalk(t, a, b, 200, 1300, 1.1).walk })}</>, { pan: 600 })) },
  { c: "Fatih'teki şer'iye mahkemesine", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], mahkeme(t)),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="FATİH ŞER'İYE MAHKEMESİ" y={70} size={80} /> },
  { c: "Mahkemenin kapısında kadınlar sıra bekliyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 620], sokak(t, <>{Array.from({ length: 6 }, (_, i) => kadin(t, 260 + i * 260, i, { face: i % 2 ? "sad" : "worried", look: 0.6 }, 0.95))}{ferDis(t, 1820, { look: -0.4 }, 0.95)}</>, { pan: 1400 })) },
  { c: "Nafaka isteyenler", r: (t, a, b) => again("Mahkemenin kapısında kadınlar sıra bekliyor", t, a, b, 0),
    html: (t, a, b) => <>{["NAFAKA", "MİRAS", "CEPHEDEN HABER"].map((l, i) => <Tag key={i} t={t} at={a + i * (b - a) * 0.25} text={l} c={[H.cobalt, H.gold, H.red][i]} x={120 + i * 560} y={140} />)}</> },
  { c: "Sıran gelince", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], mahkeme(t, <>{ferDis(t, 1400, { look: -0.6, face: "worried" })}</>)) },
  { c: "Efendim, kocam iki eşli", tone: "warm", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [1400, 560], mahkeme(t, <>{ferDis(t, 1400, { look: -0.6, talk: 1 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="“GECELERİ ADİL BÖLMÜYOR.”" y={820} size={80} /> },
  { c: "Kadı efendi, kâtibe bir şeyler yazdırıyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 540], kapali(t, <SicilKalem t={t} k={ramp(t, a, b)} />, "#E9DCC0")) },
  { c: "İki gün sonra, Rıza mahkemede", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], mahkeme(t, <>{riza(t, 1400, { look: -0.6, face: "worried" })}</>)) },
  { c: "Kadı ona açıkça söylüyor", tone: "warm", r: (t, a, b) => C(t, a, b, [2, 2.2], [960, 570], mahkeme(t, null)),
    html: (t, a) => <Txt t={t} at={a + 1} text="“ŞERİAT EŞİT DAVRANMAYI EMREDER.”" y={820} size={70} /> },
  { c: "Kazandın", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [1400, 560], mahkeme(t, <>{ferDis(t, 1400, { look: -0.6, face: "normal" })}</>)) },
  { c: "O akşam Rıza senin odana geldi", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], gece(t, <>{riza(t, 1200, { look: 0.6, face: "normal" })}{fer(t, 700, { sit: true, y: 880, look: 0.5 })}</>)) },
  { c: "Sırtını döndü ve uyudu", r: (t, a, b) => again("O akşam Rıza senin odana geldi", t, a, b, 0) },
  { c: "Hakkını kazandın", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [700, 550], gece(t, <>{fer(t, 700, { sit: true, y: 880, face: "sad" })}</>, 700)),
    html: (t, a, b) => <><Txt t={t} at={a + 0.3} text="HAKKINI KAZANDIN" y={70} size={80} /><Txt t={t} at={a + (b - a) * 0.35 + 0.8} text="KALBİNİ KAYBETTİN" y={820} size={90} accent={H.red} /></> },
  { c: "Ama kalbini kaybettin", r: (t, a, b) => again("Hakkını kazandın", t, a, b, 1), html: (t, a, b) => htmlOf("Hakkını kazandın", t, b) },

  // ── SIR ──
  { c: "Bir gece, uyuyamıyorsun", sfx: "whoosh", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], gece(t, <>{fer(t, lerp(300, 1100, ramp(t, a, b)), { walk: proWalk(t, a, b, 300, 1100, 1.0).walk, look: 0.4 })}</>, 900)) },
  { c: "Ve Leman'ın kapısının önünden geçerken", tone: "night", r: (t, a, b) => again("Bir gece, uyuyamıyorsun", t, a, b, 0) },
  { c: "Ağlama sesi", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], gece(t, <>{lem(t, 960, { sit: true, y: 880, face: "sad", bow: 0.6 })}</>)) },
  { c: "Duruyorsun", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [1100, 550], gece(t, <>{fer(t, 1100, { look: -0.8, face: "worried" })}</>, 1100)) },
  { c: "Leman kendi kendine konuşuyor", r: (t, a, b) => again("Ağlama sesi", t, a, b, 0) },
  { c: "Büyük hanım benden nefret ediyor", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [960, 550], gece(t, <>{lem(t, 960, { sit: true, y: 880, face: "sad", talk: 1 })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.45} text="“YA BENİM DE ÇOCUĞUM OLMAZSA?”" y={820} size={74} /> },
  { c: "Kalbin sıkışıyor", r: (t, a, b) => again("Duruyorsun", t, a, b, 1) },
  { c: "Çünkü bu cümleleri", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <>{gece(t, <>{lem(t, 600, { sit: true, y: 880, face: "sad" }, 0.95)}{fer(t, 1320, { sit: true, y: 880, face: "sad" }, 0.95)}</>)}<path d="M960,0 V1080" stroke={H.gold} strokeWidth={10} /></>) },
  { c: "O gece hiçbir şey yapmadın", r: (t, a, b) => again("Duruyorsun", t, a, b, 2) },
  { c: "Ama ertesi sabah, mutfakta", sfx: "pop", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 560], kapali(t, <><Kavanoz x={760} y={760} s={2.2} /><RecelTabak x={1240} y={760} s={2.2} t={t} /></>, "#E9DCC0")),
    html: (t, a) => <Tag t={t} at={a + 1.2} text="GÜL REÇELİ" c={H.red} /> },
  { c: "Ve sessizce, Leman'ın kapısının önüne bıraktın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 760], oda(t, <>{fer(t, lerp(1300, 900, ramp(t, a, a + 2)), { bow: 0.5 * ramp(t, a + 1, a + 2), look: -0.3 })}<RecelTabak x={980} y={990} s={0.9} /></>)) },
  { c: "Kimse görmedi", r: (t, a, b) => C(t, a, b, [2.6, 2.8], [960, 960], oda(t, <><RecelTabak x={960} y={990} s={0.9} /></>)) },
  { c: "Öğlen tabak boş", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [2.6, 2.8], [960, 960], oda(t, <><RecelTabak x={960} y={990} s={0.9} empty={1} /></>)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="BOŞ. YIKANMIŞ." y={70} size={90} /> },
  { c: "Kimse bir şey söylemedi", r: (t, a, b) => again("Öğlen tabak boş", t, a, b, 0) },
  { c: "Eğer hikâye seni buraya kadar getirdiyse", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [960, 540], kapali(t, <RecelTabak x={960} y={620} s={2.6} empty={1} />, "#E9DCC0")),
    html: (t, a) => <Abone t={t} at={a + 0.6} /> },

  // ── HAMAM ──
  { c: "Çünkü bundan sonra olacaklar", r: (t, a, b) => again("Çünkü bu cümleleri", t, a, b, 1) },
  { c: "Cuma günü, mahalle hamamı", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 520], hamam(t)),
    html: (t, a) => <Tag t={t} at={a + 0.8} text="MAHALLE HAMAMI" c={H.cobalt} /> },
  { c: "Hamam, Osmanlı kadınının en özgür olduğu yerdi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 620], hamam(t, <>{[0, 1, 2, 3, 4].map((i) => kadin(t, 300 + i * 330, i, { sit: true, y: 900, talk: i % 2, look: i < 2 ? 0.4 : -0.4 }, 0.9))}</>)) },
  { c: "Yemekler getirilir", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 620], hamam(t, <>{kadin(t, 760, 2, { hands: "tray", look: 0.4 })}{kadin(t, 1160, 3, { sit: true, y: 900, talk: 1, look: -0.4 })}</>)) },
  { c: "Ama kumalar için hamam", r: (t, a, b) => again("Hamam, Osmanlı kadınının en özgür olduğu yerdi", t, a, b, 0) },
  { c: "Sen ve Leman, aynı gün", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 620], hamam(t, <>{fer(t, 360, { sit: true, y: 900, look: 0.5 })}{lem(t, 1560, { sit: true, y: 900, look: -0.5 })}{[0, 1, 2].map((i) => kadin(t, 760 + i * 220, i + 1, { sit: true, y: 900, talk: 1 }, 0.85))}</>)) },
  { c: "Ve mahallenin dili en uzun kadını", tone: "warm", r: (t, a, b) => C(t, a, b, [2, 2.2], [980, 570], hamam(t, <>{kadin(t, 980, 4, { talk: 1, face: "smile", look: 0.6 })}</>)) },
  { c: "Bakın bakın, Rıza Efendi'nin yenisi", r: (t, a, b) => again("Ve mahallenin dili en uzun kadını", t, a, b, 0),
    html: (t, a) => <Txt t={t} at={a + 1} text="“DAYISI SATMIŞ, BİR TORBA UNA.”" y={820} size={74} /> },
  { c: "Kadınlar gülüşüyor", r: (t, a, b) => again("Sen ve Leman, aynı gün", t, a, b, 1) },
  { c: "Leman'ın yüzü kıpkırmızı", tone: "warm", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [1560, 550], hamam(t, <>{lem(t, 1560, { sit: true, y: 900, face: "sad", bow: 0.6 })}<ellipse cx={1660} cy={1010} rx={40} ry={12} fill="#C9873B" /></>)) },
  { c: "Ve sen, ayağa kalkıyorsun", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [400, 560], hamam(t, <>{fer(t, 400, { look: 0.6, face: "normal" }, 1.15)}</>)) },
  { c: "Hamam bir anda susuyor", r: (t, a, b) => again("Sen ve Leman, aynı gün", t, a, b, 2) },
  { c: "Ama sen, sakin bir sesle konuşuyorsun", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [400, 550], hamam(t, <>{fer(t, 400, { look: 0.6, talk: 1 }, 1.15)}</>)),
    html: (t, a) => <Txt t={t} at={a + 1.4} text="“BU KIZ BENİM EVİMİN KIZIDIR.”" y={820} size={80} /> },
  { c: "Sessizlik", r: (t, a, b) => again("Ve mahallenin dili en uzun kadını", t, a, b, 2) },
  { c: "Leman sana bakıyor", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [1560, 550], hamam(t, <>{lem(t, 1560, { sit: true, y: 900, face: "worried", look: -0.7 })}</>)) },
  { c: "Ve o gün, hamamdan eve", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], sokak(t, <>{ferDis(t, lerp(200, 1100, ramp(t, a, b)), { walk: proWalk(t, a, b, 200, 1100, 1.0).walk, look: 0.3 })}{lem(t, lerp(380, 1280, ramp(t, a, b)), { walk: proWalk(t, a, b, 380, 1280, 1.0).walk, look: -0.3 })}</>, { pan: 400 + ramp(t, a, b) * 200, dusk: 0.4 })) },

  // ── FABRİKA ──
  { c: "Bin dokuz yüz on yedi yazı", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 540], sokak(t, null, { pan: 100 })),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="1917 YAZI" y={70} size={90} /> },
  { c: "Rıza'nın maaşı aynı", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["EKMEK", "YAĞ", "GAZ", "ŞEKER"].map((l, i) => <g key={i} transform={`translate(${420 + i * 360},${560 - ramp(t, a + 0.5 + i * 0.4, a + 2 + i * 0.4) * (120 + i * 40)})`}><Disc x={0} y={0} r={130} k={1} c={[H.ochre, H.gold, H.cobalt, H.rose][i]} label={l} /><path d="M0,-210 L-34,-160 L34,-160Z" fill={H.red} /></g>)}</>) },
  { c: "Mürüvvet Hanım sandıktan bir şey daha satıyor", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [700, 560], oda(t, <>{mur(t, 700, { hands: "tray", face: "sad" })}</>)) },
  { c: "Ve bir sabah, sen bir karar veriyorsun", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [960, 550], oda(t, <>{fer(t, 960, { face: "normal" })}</>)) },
  { c: "Cibali Tütün Fabrikası", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.0], [960, 540], fab(t)),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="CİBALİ TÜTÜN FABRİKASI" c={H.red} /> },
  { c: "O yıllarda bu fabrikada yüzlerce kadın çalışıyordu", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 560], fab(t, <>{[0, 1, 2, 3, 4, 5].map((i) => kadin(t, 200 + i * 300, i, { sit: true, y: 860, look: (i % 2 ? 0.3 : -0.3) }, 0.75))}</>)) },
  { c: "Erkekler cephedeyken", r: (t, a, b) => again("O yıllarda bu fabrikada yüzlerce kadın çalışıyordu", t, a, b, 0),
    html: (t, a) => <Txt t={t} at={a + 1} text="FABRİKALARI KADINLAR AYAKTA TUTUYORDU" y={820} size={66} /> },
  { c: "Rıza önce karşı çıkıyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 620], oda(t, <>{riza(t, 1300, { talk: 1, look: -0.6 })}{fer(t, 700, { look: 0.5 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 1} text="“BENİM KARIM FABRİKADA MI?”" y={820} size={80} /> },
  { c: "Ama sen sakin cevap veriyorsun", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [700, 550], oda(t, <>{fer(t, 700, { look: 0.5, talk: 1 })}</>)) },
  { c: "Ve ertesi sabah, kapıdan iki kadın çıkıyor", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 620], sokak(t, <>{ferDis(t, lerp(900, 1500, ramp(t, a, b)), { walk: proWalk(t, a, b, 900, 1500, 1.0).walk })}{lem(t, lerp(1050, 1650, ramp(t, a, b)), { walk: proWalk(t, a, b, 1050, 1650, 1.0).walk })}</>, { pan: 368 })) },
  { c: "Uzun masaların başında, yan yana oturuyorsunuz", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 640], fab(t, <>{fer(t, 820, { sit: true, y: 860, look: 0.3 }, 0.9)}{lem(t, 1100, { sit: true, y: 860, look: -0.3 }, 0.85)}</>)) },
  { c: "Parmaklarınız sararıyor", tone: "warm", r: (t, a, b) => C(t, a, b, [2.8, 3], [960, 880], fab(t, null)) },
  { c: "Ama ay sonunda", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 560], kapali(t, <Kese x={960} y={640} s={2} t={t} spill={0.5} />, "#E9DCC0")) },
  { c: "Leman o parayı uzun uzun seyrediyor", tone: "gold", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 550], <>{oda(t, <>{lem(t, 960, { face: "smile", hands: "tray", trayItem: <Kese x={0} y={0} s={0.5} /> })}</>)}</>) },
  { c: "Abla, ben hayatımda ilk defa", r: (t, a, b) => again("Leman o parayı uzun uzun seyrediyor", t, a, b, 0),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“KİMSENİN BANA VERMEDİĞİ BİR ŞEY.”" y={820} size={70} /> },
  { c: "Sen bir şey söylemiyorsun", r: (t, a, b) => again("Uzun masaların başında, yan yana oturuyorsunuz", t, a, b, 1) },

  // ── BELGE 2 ──
  { c: "Bin dokuz yüz on yedi sonbaharı", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 540], sokak(t, null, { pan: 700, dusk: 0.5 })),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="EKİM 1917" y={70} size={90} /> },
  { c: "Bir akşam komşu Nazife Kadın", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 620], gece(t, <>{naz(t, 700, { look: 0.5, hands: "tray", trayItem: <rect x={-60} y={-80} width={120} height={150} fill="#EDE3C6" stroke={H.ln} strokeWidth={3} /> })}{fer(t, 1200, { look: -0.5 })}</>)),
    html: (t, a) => <NameCard t={t} at={a + 0.6} name="NAZİFE KADIN" sub="Komşu · mahallede okuma bilen tek kadın" c="#6A6A5A" /> },
  { c: "Feride, duydun mu", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [700, 560], gece(t, <>{naz(t, 700, { look: 0.5, talk: 1 })}</>, 700)) },
  { c: "Gerçekten de, yirmi beş Ekim", sfx: "boom", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.1], [960, 540], kapali(t, <Gazete t={t} k={ramp(t, a, a + 0.8)} s={1.05} />, "#3A2A20")),
    html: (t, a) => <Tag t={t} at={a + 1} text="25 EKİM 1917 · 157 MADDE" c={H.red} /> },
  { c: "yüz elli yedi maddelik", r: (t, a, b) => again("Gerçekten de, yirmi beş Ekim", t, a, b, 1), html: (t, a) => <Txt t={t} at={a + 0.3} text="157 MADDE" y={820} size={110} /> },
  { c: "Ve içinde, senin gibi kadınları", r: (t, a, b) => again("Gerçekten de, yirmi beş Ekim", t, a, b, 0) },
  { c: "Artık bir kadın, nikâh sırasında şart koyabiliyordu", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <><Paper /></>),
    html: (t, a) => <Belge t={t} at={a + 0.3} date="25 Ekim 1917" src="Hukuk-ı Aile Kararnamesi">Kadın nikâhta şart koyabilir: koca üstüne evlenirse <b>nikâh düşer.</b></Belge> },
  { c: "Kocası üstüne başka bir kadınla evlenirse", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />), html: (t, a, b) => htmlOf("Artık bir kadın, nikâh sırasında şart koyabiliyordu", t, b) },
  { c: "Nazife Kadın okumayı bitiriyor", r: (t, a, b) => again("Bir akşam komşu Nazife Kadın", t, a, b, 0) },
  { c: "Sen bir şey demiyorsun", tone: "night", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [1200, 550], gece(t, <>{fer(t, 1200, { face: "sad", look: -0.5 })}</>, 1200)) },
  { c: "Çünkü bu kanun, senin için on yıl geç kaldı", sfx: "ding", r: (t, a, b) => again("Sen bir şey demiyorsun", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.8} text="ON YIL GEÇ" y={820} size={110} accent={H.red} /> },
  { c: "Annenin o gece fısıldadığı cümle", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], <>{gece(t, <>{anne(t, 760, { look: 0.6, talk: 1 })}{fer(t, 1160, { look: -0.6, face: "smile" }, 1.05)}</>)}<rect width={1920} height={1080} fill="#F2D8A8" opacity={0.2} /></>) },
  { c: "Ama o gece, odana döndüğünde", r: (t, a, b) => again("Sen bir şey demiyorsun", t, a, b, 2) },
  { c: "Bir gün, mahallede nikâhı kıyılacak", tone: "gold", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 600], gece(t, <>{fer(t, 960, { face: "normal", look: 0.3 })}</>)) },
  { c: "Ve o kış, bir haber daha geldi", sfx: "whoosh", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], <>{sokak(t, null, { pan: 368, dusk: 0.3 })}{kar(t)}</>) },
  { c: "Leman hamileydi", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 600], oda(t, <>{lem(t, 960, { belly: 0.45, hands: "belly", face: "smile" }, 1.15)}</>)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="LEMAN HAMİLE" y={70} size={100} /> },

  // ── İHANET ──
  { c: "Mürüvvet Hanım'ın yüzü", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 620], oda(t, <>{mur(t, 700, { face: "smile", hands: "tray", look: 0.4 })}{lem(t, 1200, { sit: true, y: 880, belly: 0.5, hands: "belly", look: -0.4 })}<Mangal x={1600} y={1040} t={t} /></>)) },
  { c: "Ayva kompostosu", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [960, 560], oda(t, <>{mur(t, 760, { hands: "tray", face: "smile", look: 0.5 })}{lem(t, 1160, { sit: true, y: 880, belly: 0.5, hands: "belly", face: "shy", look: -0.5 })}</>)) },
  { c: "Sen kenarda kaldın", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [1720, 600], <>{oda(t, <>{mur(t, 700, { face: "smile", look: 0.4 })}{lem(t, 1200, { sit: true, y: 880, belly: 0.5, hands: "belly" })}{fer(t, 1760, { face: "sad", look: -0.6 }, 0.95)}</>)}</>) },
  { c: "Bir gece, Leman senin odanın kapısını çaldı", sfx: "knock", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 620], gece(t, <>{lem(t, 1300, { belly: 0.55, hands: "tray", trayItem: <Samdan x={0} y={60} t={t} s={0.35} />, face: "worried" })}{fer(t, 640, { sit: true, y: 880, look: 0.6 })}</>, 1300)) },
  { c: "İçeri girdi, kapıyı kapattı", r: (t, a, b) => again("Bir gece, Leman senin odanın kapısını çaldı", t, a, b, 0) },
  { c: "Abla. Sana bir şey söylemem lazım", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [1300, 560], gece(t, <>{lem(t, 1300, { belly: 0.55, face: "worried", talk: 1 })}</>, 1300)) },
  { c: "Bebek doğduktan sonra seni boşamasını istiyor", sfx: "boom", r: (t, a, b) => again("Abla. Sana bir şey söylemem lazım", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.5} text="“SENİ BOŞAMASINI İSTİYOR.”" y={820} size={84} accent={H.red} /> },
  { c: "Odada sessizlik", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [640, 590], gece(t, <>{fer(t, 640, { sit: true, y: 880, face: "shock" })}</>, 640)) },
  { c: "Leman ağlıyordu", r: (t, a, b) => again("Abla. Sana bir şey söylemem lazım", t, a, b, 2) },
  { c: "Bu, o evde sana yapılan ilk iyilikti", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.4], [960, 620], gece(t, <>{fer(t, 760, { look: 0.6, face: "sad" })}{lem(t, 1160, { belly: 0.55, look: -0.6, face: "sad" })}</>)) },
  { c: "O gece hiç uyumadın. Düşündün", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 560], gece(t, <>{fer(t, 960, { sit: true, y: 880, face: "worried", look: 0.4 })}</>)) },
  { c: "Boşanırsan nereye gidecektin", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["ANNE YOK", "BABA YOK", "SAVAŞ", "VESİKA"].map((l, i) => <Disc key={i} x={300 + i * 440} y={460} r={150} k={ramp(t, a + 0.6 + i * 0.6, a + 0.9 + i * 0.6)} c={["#6A747A", "#6A747A", H.red, H.cobalt][i]} label={l} />)}</>) },
  { c: "Bir kadın tek başına", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], <>{sokak(t, <>{ferDis(t, 960, { face: "sad", look: 0.2 })}</>, { pan: 1400, dusk: 0.7 })}{kar(t)}</>) },
  { c: "Ama bir şey hatırladın. Nikâh senedini", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 540], kapali(t, <NikahSenet t={t} k={1} hi={ramp(t, a + 1, a + 2)} s={1.3} />, "#3A2A20")) },
  { c: "Senin nikâhında bir mehr-i müeccel yazılıydı", r: (t, a, b) => again("Ama bir şey hatırladın. Nikâh senedini", t, a, b, 0),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="MEHR-İ MÜECCEL" sub="boşanınca ödenecek mehir" y={820} size={84} /> },
  { c: "Koca karısını boşarsa", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 560], kapali(t, <Kese x={960} y={620} s={2.2} t={t} spill={0.4} />, "#3A2A20")) },
  { c: "Ve senin babanın pazarlığıyla yazılan miktar", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], sokak(t, <><Kese x={1480} y={900} s={0.9} t={t} /></>, { pan: 2 * 368 - 600 })),
    html: (t, a) => <Tag t={t} at={a + 1.5} text="HALİÇ KIYISINDA BİR DÜKKÂN" c={H.gold} /> },
  { c: "Ertesi sabah, yine mahkemeye gittin", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], mahkeme(t, <>{ferDis(t, 1400, { look: -0.6 })}</>)) },
  { c: "Kâtip mührü bastı", sfx: "knock", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.08], [960, 540], kapali(t, <SicilKalem t={t} k={1} seal={ramp(t, a + 0.3, a + 0.8)} />, "#E9DCC0")) },
  { c: "Akşam Rıza'ya bir şey söylemedin", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 640], gece(t, <>{riza(t, 1200, { sit: true, y: 880, look: -0.3 })}{fer(t, 700, { look: 0.5 })}<g transform="translate(960,960)"><rect x={-90} y={-30} width={180} height={50} fill="#EDE3C6" stroke={H.ln} strokeWidth={3} /></g></>)) },
  { c: "Rıza okudu. Uzun süre sessiz kaldı", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [1200, 570], gece(t, <>{riza(t, 1200, { sit: true, y: 880, face: "worried", bow: 0.3 })}</>, 1200)) },
  { c: "Sonra annesine baktı", r: (t, a, b) => again("Akşam Rıza'ya bir şey söylemedin", t, a, b, 1),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="BOŞANMA LAFI BİTTİ" y={820} size={84} /> },

  // ── ESKİ SIR ──
  { c: "Ama Mürüvvet Hanım'ın sana olan soğukluğu", tone: "cool", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [700, 570], oda(t, <>{mur(t, 700, { look: 0.6 })}</>, { cold: 0.6 })) },
  { c: "Ve bir gün, komşu Nazife Kadın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 640], oda(t, <>{naz(t, 760, { sit: true, y: 880, talk: 1, look: 0.4 })}{fer(t, 1180, { sit: true, y: 880, look: -0.4 })}<g transform="translate(960,960)"><ellipse rx={30} ry={10} fill="#F7F2E6" stroke={H.ln} strokeWidth={2} /></g></>)),
    html: (t, a) => <Tag t={t} at={a + 1.2} text="80 YAŞINDA · HER ŞEYİ HATIRLIYOR" c="#6A6A5A" /> },
  { c: "Seksen yaşında", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [760, 560], oda(t, <>{naz(t, 760, { sit: true, y: 880, look: 0.4, face: "smile" })}</>)) },
  { c: "Kızım, sen Mürüvvet'i ne sanıyorsun", tone: "warm", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [760, 560], oda(t, <>{naz(t, 760, { sit: true, y: 880, talk: 1, look: 0.4 })}</>)),
    html: (t, a) => <Txt t={t} at={a + 1.2} text="“O DA BU EVİN KUMASIYDI.”" y={820} size={84} accent={H.red} /> },
  { c: "Fincan elinde donup kaldın", sfx: "boom", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [1180, 570], oda(t, <>{fer(t, 1180, { sit: true, y: 880, face: "shock" })}</>)) },
  { c: "Otuz beş sene önce", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], <>{oda(t, <>{PFig({ x: 960, y: Y, s: 1.0, kind: "girl", robe: "#7A6A8A", robe2: "#EFE6D4", t, seed: 5, face: "sad" })}</>, { cold: 0.4 })}<rect width={1920} height={1080} fill="#C8A878" opacity={0.3} /></>),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="1883 · GENÇ MÜRÜVVET, 17 YAŞINDA" c={H.purple} /> },
  { c: "Evin büyük hanımı ona hayatı zindan etmiş", r: (t, a, b) => again("Otuz beş sene önce", t, a, b, 0), html: (t, a, b) => htmlOf("Otuz beş sene önce", t, b),
  },
  { c: "Mürüvvet yıllarca kimseye", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 700], <>{gece(t, <>{PFig({ x: 960, y: Y, s: 1.0, kind: "girl", robe: "#7A6A8A", robe2: "#EFE6D4", t, seed: 5, face: "sad", sit: true, bow: 0.4 })}</>)}<rect width={1920} height={1080} fill="#C8A878" opacity={0.3} /></>) },
  { c: "Ve şimdi, aynı evde", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <>{oda(t, <>{PFig({ x: 600, y: Y, s: 1.0, kind: "girl", robe: "#7A6A8A", robe2: "#EFE6D4", t, seed: 5, face: "sad" })}{fer(t, 1320, { face: "sad" })}</>, { cold: 0.5 })}<path d="M960,0 V1080" stroke={H.gold} strokeWidth={10} /></>) },
  { c: "Bu acı, bir kadından ötekine", sfx: "drone", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{[0, 1, 2].map((i) => <Disc key={i} x={420 + i * 540} y={440} r={170} k={ramp(t, a + 0.4 + i * 0.7, a + 0.7 + i * 0.7)} c={["#6A5A7A", "#3A3A4A", "#5A2A4A"][i]} label={["ESKİ HANIM", "MÜRÜVVET", "FERİDE"][i]} />)}{[0, 1].map((i) => <path key={i} d={`M${600 + i * 540},440 h180`} stroke={H.red} strokeWidth={10} opacity={ramp(t, a + 1 + i * 0.7, a + 1.3 + i * 0.7)} />)}</>),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="MİRAS GİBİ" y={820} size={100} accent={H.red} /> },
  { c: "O gece, Mürüvvet Hanım'ı sofrada gördüğünde", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 640], gece(t, <>{mur(t, 760, { sit: true, y: 880, look: 0.3 })}{fer(t, 1180, { sit: true, y: 880, look: -0.5, face: "sad" })}</>)) },
  { c: "Ve kendi kendine bir karar verdin", tone: "gold", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [1180, 560], gece(t, <>{fer(t, 1180, { sit: true, y: 880, face: "normal" })}</>, 1180)) },
  { c: "Bu zincir, seninle bitecek", sfx: "ding", r: (t, a, b) => again("Ve kendi kendine bir karar verdin", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="BU ZİNCİR SENİNLE BİTECEK" y={820} size={84} /> },

  // ── VEDA ──
  { c: "Bin dokuz yüz on yedinin son günleri", sfx: "knock", tone: "cool", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 620], <>{sokak(t, <>{erkek(t, 1180, 3, { look: -0.4, hands: "tray", trayItem: <rect x={-40} y={-60} width={80} height={100} fill="#EFE6CC" stroke={H.ln} strokeWidth={2} /> })}{riza(t, 760, { look: 0.5, face: "worried" })}</>, { pan: 368, dusk: 0.2 })}{kar(t)}</>) },
  { c: "Celp kâğıdı", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], kapali(t, <CelpKagit x={960} y={540} s={1.5} k={ramp(t, a, a + 0.6)} />, "#2A2A30")),
    html: (t, a) => <Tag t={t} at={a + 1} text="CELP = ASKERE ÇAĞRI" c={H.red} /> },
  { c: "Savaşın son yıllarında, artık orta yaşlı erkekler de", r: (t, a, b) => again("Bin dokuz yüz on yedinin son günleri", t, a, b, 0) },
  { c: "Gitmeden önceki gece", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 620], gece(t, <>{mur(t, 520, { sit: true, y: 880, face: "sad", bow: 0.4 })}{lem(t, 1380, { sit: true, y: 880, belly: 0.4, face: "closed" })}</>)) },
  { c: "Mürüvvet Hanım oğlunun çamaşırlarını", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [520, 580], gece(t, <>{mur(t, 520, { sit: true, y: 880, face: "sad", bow: 0.4, hands: "tray", trayItem: <rect x={-60} y={-24} width={120} height={36} fill="#5A5A3A" stroke={H.ln} strokeWidth={2} /> })}</>, 520)) },
  { c: "Leman, karnı belirmeye", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [1380, 580], gece(t, <>{lem(t, 1380, { sit: true, y: 880, belly: 0.4, hands: "belly", face: "closed" })}</>, 1380)) },
  { c: "Ve gece yarısı, Rıza senin kapını çalıyor", sfx: "knock", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 620], gece(t, <>{riza(t, 1240, { look: -0.5, face: "worried" })}{fer(t, 700, { sit: true, y: 880, look: 0.6 })}</>)) },
  { c: "İçeri giriyor", r: (t, a, b) => again("Ve gece yarısı, Rıza senin kapını çalıyor", t, a, b, 0) },
  { c: "Feride. Ben gidiyorum", tone: "night", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [1240, 560], gece(t, <>{riza(t, 1240, { look: -0.5, talk: 1, face: "sad" })}</>, 1240)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="“BU EVİ SANA BIRAKIYORUM.”" y={820} size={84} /> },
  { c: "Neden bana, diye soruyorsun", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [700, 590], gece(t, <>{fer(t, 700, { sit: true, y: 880, look: 0.6, talk: 1 })}</>, 700)) },
  { c: "Çünkü bu evde ayakta duran tek kişi sensin", sfx: "ding", r: (t, a, b) => again("Feride. Ben gidiyorum", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="“AYAKTA DURAN TEK KİŞİ SENSİN.”" y={820} size={80} /> },
  { c: "Sabah, Rıza kapıdan çıkıyor", sfx: "whoosh", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], <>{sokak(t, <>{rizaAsker(t, lerp(1000, 1900, ramp(t, a, b)), { walk: proWalk(t, a, b, 1000, 1900, 1.0).walk })}{ferDis(t, 700, { look: 0.6, face: "sad" })}</>, { pan: 368, dusk: 0.1 })}{kar(t)}</>) },
  { c: "Ve sen, kapının önünde", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [700, 560], <>{sokak(t, <>{ferDis(t, 700, { look: 0.6, face: "sad" })}</>, { pan: 368, dusk: 0.1 })}{kar(t)}</>) },
  { c: "Bu adam sana kuma getirdi", r: (t, a, b) => again("Feride. Bir kadın daha alacağım", t, a, b, 1) },
  { c: "Çünkü bir evin acısı ne kadar büyük olursa olsun", r: (t, a, b) => again("Sabah, Rıza kapıdan çıkıyor", t, a, b, 2),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="SAVAŞ HEPSİNDEN BÜYÜKTÜ" y={820} size={84} /> },

  // ── DOĞUM ──
  { c: "Bin dokuz yüz on sekiz başı", sfx: "whoosh", tone: "cool", r: (t, a, b) => C(t, a, b, [1, 1.1], [960, 540], <>{sokak(t, null, { pan: 368, dusk: 0.6 })}{kar(t)}</>),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="OCAK 1918 · KAR" y={70} size={90} /> },
  { c: "Rıza Efendi'den bir mektup geldi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], gece(t, <>{naz(t, 760, { hands: "tray", trayItem: <rect x={-50} y={-70} width={100} height={120} fill="#EDE3C6" stroke={H.ln} strokeWidth={3} />, talk: 1 })}{fer(t, 1160, { look: -0.5, face: "normal" })}</>)),
    html: (t, a) => <Tag t={t} at={a + 1.4} text="ÇANAKKALE · SAHİL BATARYALARI" c={H.cobalt} /> },
  { c: "Evde üç kadın kaldınız", tone: "warm", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 620], gece(t, <>{mur(t, 500, { sit: true, y: 880 })}{lem(t, 960, { sit: true, y: 880, belly: 0.9, hands: "belly" })}{fer(t, 1420, { sit: true, y: 880 })}<Mangal x={960} y={1060} t={t} s={0.8} /></>)) },
  { c: "Ve bir gece, Leman'ın sancısı başladı", sfx: "boom", tone: "night", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [960, 560], gece(t, <>{lem(t, 960, { sit: true, y: 880, belly: 0.95, hands: "belly", face: "shock" })}</>)) },
  { c: "Ebe Hanım'ı çağırmaya Mürüvvet gitti", tone: "cool", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], <>{sokak(t, <>{mur(t, lerp(900, 1900, ramp(t, a, b)), { walk: proWalk(t, a, b, 900, 1900, 0.8).walk })}</>, { pan: 368, dusk: 1 })}<Snow t={t} n={160} wind={0.7} /></>) },
  { c: "Saatler geçiyor. Ebe gelmiyor", tone: "night", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <>{sokak(t, null, { pan: 1100, dusk: 1 })}<Snow t={t} n={180} wind={0.8} /></>) },
  { c: "Leman çığlık atıyor", tone: "night", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], gece(t, <>{lem(t, 1100, { sit: true, y: 880, belly: 0.95, face: "shock", talk: 1 })}{fer(t, 760, { look: 0.6, face: "worried", reach: 0.7, reachDir: 1 })}</>)) },
  { c: "Abla, gitme. Ne olur gitme", r: (t, a, b) => again("Leman çığlık atıyor", t, a, b, 0),
    html: (t, a) => <Txt t={t} at={a + 0.3} text="“ABLA, GİTME.”" y={820} size={100} /> },
  { c: "Sen hiç doğum yapmadın", tone: "night", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [760, 560], gece(t, <>{fer(t, 760, { look: 0.6, face: "worried" })}</>, 760)) },
  { c: "Ne yapılacağını seyrettin", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["SICAK SU", "TEMİZ BEZ", "NEFES", "BEKLE", "İT"].map((l, i) => <Disc key={i} x={260 + i * 350} y={460} r={130} k={ramp(t, a + 0.6 + i * 0.5, a + 0.9 + i * 0.5)} c={[H.cobalt, H.teal, H.gold, H.purple, H.red][i]} label={l} />)}</>) },
  { c: "Gece boyunca, onun başında kaldın", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], gece(t, <>{lem(t, 1100, { sit: true, y: 880, belly: 0.95, face: "closed" })}{fer(t, 760, { sit: true, y: 880, look: 0.6, face: "worried" })}<GazLamba x={960} y={440} t={t} s={0.8} /></>)) },
  { c: "Ve sabah ezanıyla birlikte", sfx: "drone", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.1], [960, 540], <>{sokak(t, null, { pan: 1100, dusk: 0.3 })}<Snow t={t} n={40} wind={0.1} /></>) },
  { c: "Bir bebek ağlıyor", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], kapali(t, <g transform="translate(960,560) scale(4)"><Bebek t={t} cry={1} /></g>, "#F2E6CC")) },
  { c: "Bir oğlan", sfx: "ding", r: (t, a, b) => again("Bir bebek ağlıyor", t, a, b, 0) },
  { c: "Ve onu ilk kucağına alan sen oldun", tone: "gold", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [960, 560], gece(t, <>{fer(t, 960, { hands: "baby", face: "smile" }, 1.2)}</>)) },
  { c: "Dokuz yıldır beklediğin bir an", r: (t, a, b) => again("Ve onu ilk kucağına alan sen oldun", t, a, b, 1),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="AMA SENİN ÇOCUĞUN DEĞİL" y={820} size={84} /> },
  { c: "Bebeği Leman'a uzattın", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 620], gece(t, <>{fer(t, 760, { reach: 0.8, reachDir: 1, look: 0.6 })}{lem(t, 1160, { sit: true, y: 880, hands: "baby", face: "smile", look: -0.5 })}</>)) },
  { c: "Adını sen koy abla", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [1160, 590], gece(t, <>{lem(t, 1160, { sit: true, y: 880, hands: "baby", face: "smile", talk: 1, look: -0.5 })}</>, 1160)) },
  { c: "Bir an düşündün", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [760, 560], gece(t, <>{fer(t, 760, { look: 0.6, face: "closed" })}</>, 760)) },
  { c: "Umut", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper c="#F2E6CC" />),
    html: (t, a) => <Txt t={t} at={a + 0.1} text="UMUT" y={360} size={220} /> },
  { c: "Mürüvvet Hanım kapıda duruyordu", tone: "cool", r: (t, a, b) => C(t, a, b, [1.5, 1.7], [700, 560], gece(t, <>{mur(t, 700, { face: "shock", look: 0.5 })}<Snow t={t} n={20} wind={0.1} o={0.5} /></>, 700)) },
  { c: "Sana baktı. Uzun süre", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [700, 540], gece(t, <>{mur(t, 700, { face: "sad", look: 0.5 })}</>, 700)) },
  { c: "Ve ilk defa, dokuz yılda ilk defa", r: (t, a, b) => again("Sana baktı. Uzun süre", t, a, b, 1) },

  // ── YANGIN ──
  { c: "Ve şimdi, hikâyenin başına dönüyoruz", sfx: "whoosh", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1], [960, 540], yangin(t, null, 200)) },
  { c: "Yangın Fatih'te başlıyor", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 520], yangin(t, null, ramp(t, a, b) * 800)),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="31 MAYIS 1918" y={70} size={90} accent={H.red} /> },
  { c: "Tulumbacılar koşuyor", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], yangin(t, <>{[0, 1, 2].map((i) => erkek(t, lerp(-200 + i * 160, 1500 + i * 160, ramp(t, a, b)), i, { walk: proWalk(t, a, b, -200, 1500, 1.4).walk, face: "worried" }))}</>, 900)) },
  { c: "Sen pazardan dönüyordun", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 600], yangin(t, <>{ferDis(t, lerp(200, 700, ramp(t, a, b)), { walk: proWalk(t, a, b, 200, 700, 1.1).walk, face: "shock" })}</>, 368)) },
  { c: "Mürüvvet Hanım sokakta", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.6], [960, 600], yangin(t, <>{mur(t, 1100, { face: "shock", talk: 1, hands: "tray", trayItem: <rect x={-70} y={-40} width={140} height={60} rx={20} fill="#B8742E" /> })}{ferDis(t, 700, { look: 0.6, face: "shock" })}</>, 368)) },
  { c: "Leman nerede", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [700, 560], yangin(t, <>{ferDis(t, 700, { look: 0.6, talk: 1, face: "shock" })}</>, 368)) },
  { c: "Mürüvvet ağlıyor", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [1100, 560], yangin(t, <>{mur(t, 1100, { face: "sad", talk: 1 })}</>, 368)),
    html: (t, a) => <Txt t={t} at={a + 0.6} text="“YUKARIDA. KAPIYI AÇAMADIM.”" y={820} size={80} /> },
  { c: "Ve işte o an", sfx: "drone", r: (t, a, b) => again("Kapı açık", t, a, b, 0) },
  { c: "Bu senin kumanın bebeği", r: (t, a, b) => again("Bu, kocanın öteki karısının bebeği", t, a, b, 1) },
  { c: "Kimse seni suçlamaz", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], yangin(t, <>{[0, 1, 2, 3].map((i) => kadin(t, 300 + i * 420, i, { face: "worried", look: 0.2 }, 0.95))}</>, 700)) },
  { c: "Ama sen, yaşmağını ıslatıyorsun", tone: "warm", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [820, 550], yangin(t, <>{ferDis(t, 820, { face: "closed", reach: 0.9, reachDir: 1 })}</>, 368)) },
  { c: "Ve içeri giriyorsun", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1.6, 2.4], [1180, 660], yangin(t, <>{ferDis(t, lerp(820, 1180, ramp(t, a, b)), { walk: proWalk(t, a, b, 820, 1180, 1.0).walk, op: 1 - ramp(t, b - 0.6, b) })}</>, 368)) },
  { c: "Merdivenler sıcak", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], kapali(t, <><Duman x={600} y={1080} t={t} s={2} dark={0.9} /><Duman x={1300} y={1080} t={t} s={2} dark={0.9} seed={4} />{ferDis(t, 960, { face: "closed", bow: 0.4 })}<Alev x={1600} y={1060} s={1.4} t={t} /><Alev x={300} y={1060} s={1.1} t={t} seed={5} /></>, "#2A1410")) },
  { c: "Sadece sesi takip ediyorsun", r: (t, a, b) => again("Merdivenler sıcak", t, a, b, 0) },
  { c: "Leman'ın odasının kapısı", sfx: "knock", tone: "warm", r: (t, a, b) => C(t, a, b, [1.4, 1.5], [960 + Math.sin(t * 20) * (t - a < 2 ? 4 : 0), 600], kapali(t, <><rect x={700} y={200} width={520} height={880} fill={H.wood} stroke={H.ln} strokeWidth={6} /><Duman x={960} y={1080} t={t} s={1.6} dark={0.9} />{ferDis(t, 600, { look: 0.8, face: "worried" })}</>, "#2A1410")) },
  { c: "Leman yerde, beşiğin yanında", tone: "night", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 640], kapali(t, <><Besik x={1300} y={980} s={1.3} t={t} baby={false} />{lem(t, 960, { sit: true, y: 930, hands: "baby", face: "closed", bow: 0.5 })}<Duman x={960} y={1080} t={t} s={1.6} dark={0.8} /></>, "#2A1410")) },
  { c: "Sen bebeği alıyorsun", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.45], [960, 620], kapali(t, <>{ferDis(t, 760, { hands: "baby", face: "worried", look: 0.5 })}{lem(t, 1160, { sit: true, y: 930, face: "worried", look: -0.5 })}<Duman x={960} y={1080} t={t} s={1.6} dark={0.8} /></>, "#2A1410")) },
  { c: "Kalk. Kalk Leman", r: (t, a, b) => again("Sen bebeği alıyorsun", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="“KALK, LEMAN!”" y={820} size={100} /> },
  { c: "Merdivenlerden aşağı", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], kapali(t, <><Alev x={1500} y={600} s={1.6} t={t} /><Alev x={400} y={500} s={1.2} t={t} seed={4} />{ferDis(t, lerp(1300, 600, ramp(t, a, b)), { hands: "baby", walk: proWalk(t, a, b, 1300, 600, 1.2).walk })}{lem(t, lerp(1500, 800, ramp(t, a, b)), { walk: proWalk(t, a, b, 1500, 800, 1.2).walk, face: "shock" })}<Duman x={960} y={1080} t={t} s={2} dark={0.9} /><Kivilcim t={t} n={30} /></>, "#2A1410")) },
  { c: "Ve sokağa çıktığınızda", sfx: "boom", tone: "warm", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [960, 560], yangin(t, <>{ferDis(t, 640, { hands: "baby", face: "shock" })}{lem(t, 900, { face: "shock" })}<rect x={1050} y={0} width={500} height={820} fill="#FF6A1A" opacity={0.3 * ramp(t, a + 0.5, a + 1.5)} /></>, 368)) },
  { c: "O gün, yirmi yedi saatten uzun süren yangında", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper c="#2A1E16" />{Array.from({ length: 75 }, (_, i) => { const x = 280 + (i % 15) * 98, y = 260 + Math.floor(i / 15) * 120; return <g key={i} transform={`translate(${x},${y})`} opacity={ramp(t, a + i * 0.03, a + i * 0.03 + 0.2)}><path d="M-30,30 V-6 L0,-34 L30,-6 V30Z" fill="#E8642A" /><path d={`M-10,0 C-14,-18 0,-26 ${Math.sin(t * 8 + i) * 4},-40 C10,-26 14,-18 10,0Z`} fill="#FFD27A" /></g>; })}</>),
    html: (t, a) => <Belge t={t} at={a + 3} date="31 Mayıs 1918" src="Fatih-Cibali-Altımermer yangını · İstanbul yangın kayıtları">27 saatten uzun sürdü. Yaklaşık <b>7.500 ev</b> yandı.</Belge> },
  { c: "Fatih, Cibali, Altımermer", r: (t, a, b) => again("O gün, yirmi yedi saatten uzun süren yangında", t, a, b, 0), html: (t, a, b) => htmlOf("O gün, yirmi yedi saatten uzun süren yangında", t, b) },
  { c: "Ve sizin ev de onlardan biriydi", tone: "night", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 540], <><CibaliSokak t={t} pan={368} dusk={1} fire={0.3} /><Duman x={1200} y={700} t={t} s={1.6} dark={1} /></>) },
  { c: "Ama üç kadın, ve bir bebek, sağdı", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], <><CibaliSokak t={t} pan={368} dusk={1} fire={0.2} />{mur(t, 560, { face: "sad" })}{ferDis(t, 900, { hands: "baby", face: "normal" })}{lem(t, 1220, { face: "sad", look: -0.5 })}</>) },
  { c: "Sokakta, dumanların içinde, Leman sana sarıldı", r: (t, a, b) => C(t, a, b, [1.8, 2], [1060, 580], <><CibaliSokak t={t} pan={368} dusk={1} fire={0.2} />{ferDis(t, 960, { hands: "baby", face: "closed" })}{lem(t, 1120, { face: "sad", look: -0.8, reach: 0.6, reachDir: -1 })}</>) },
  { c: "Neden döndün abla", r: (t, a, b) => again("Sokakta, dumanların içinde, Leman sana sarıldı", t, a, b, 0),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="“NEDEN DÖNDÜN ABLA?”" y={820} size={96} /> },
  { c: "Sen cevap vermedin", r: (t, a, b) => C(t, a, b, [2.6, 2.6], [960, 560], <><CibaliSokak t={t} pan={368} dusk={1} fire={0.2} />{ferDis(t, 960, { hands: "baby", face: "closed" })}</>) },
  { c: "Çünkü cevap, o gül reçeli tabağıyla başlamıştı", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 620], kapali(t, <RecelTabak x={960} y={640} s={2.6} empty={0} t={t} />, "#E9DCC0")) },

  // ── SONRASI ──
  { c: "Yangından sonra", sfx: "whoosh", tone: "cool", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], <><CibaliSokak t={t} pan={600} dusk={0.2} fire={0} /><rect width={1920} height={820} fill="#2A2420" opacity={0.55} /><Duman x={800} y={820} t={t} s={1.2} dark={0.6} /></>) },
  { c: "Sen, annenden kalan altın bileziklerini sattın", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.35], [960, 560], kapali(t, <Bilezik x={960} y={560} s={2.4} t={t} />, "#3A2A20")) },
  { c: "Ve Balat'ta küçük bir ev kiraladın", tone: "warm", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], sokak(t, null, { pan: 1600 + ramp(t, a, b) * 200 })),
    html: (t, a) => <Tag t={t} at={a + 1} text="BALAT" c={H.cobalt} /> },
  { c: "İki odalı bir ev", tone: "warm", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper /><Disc x={600} y={460} r={200} k={1} c="#5A2A4A" label="FERİDE" /><Disc x={1320} y={460} r={200} k={1} c="#5A7A9A" label="LEMAN" /></>) },
  { c: "Ama o kapılar, hiçbir zaman kilitlenmedi", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], oda(t, <>{fer(t, 760, { sit: true, y: 880, face: "smile", look: 0.5 })}{lem(t, 1160, { sit: true, y: 880, hands: "baby", face: "smile", look: -0.5 })}</>)) },
  { c: "Ekim'in sonunda savaş bitti", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], sokak(t, <>{rizaAsker(t, lerp(1900, 1100, ramp(t, a, b)), { walk: proWalk(t, a, b, 1900, 1100, 0.9).walk, face: "sad" })}</>, { pan: 1700, dusk: 0.5 })),
    html: (t, a) => <Tag t={t} at={a + 0.6} text="EKİM 1918 · MONDROS" c={H.cobalt} /> },
  { c: "Yeni evin kapısını çaldığında", sfx: "knock", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 620], sokak(t, <>{rizaAsker(t, 1500, { look: -0.6, face: "worried" })}{ferDis(t, 760, { look: 0.5 })}{lem(t, 1000, { look: 0.5 })}{erkek(t, 880, 0, { walk: proWalk(t, a, b, 0, 1, 0.4).walk, face: "smile" }, 0.45)}</>, { pan: 1700, dusk: 0.5 })) },
  { c: "Ve aralarında yürümeye çalışan", tone: "gold", r: (t, a, b) => C(t, a, b, [2.4, 2.7], [880, 800], sokak(t, <>{ferDis(t, 760, { look: 0.5, face: "smile" })}{lem(t, 1000, { look: -0.5, face: "smile" })}{erkek(t, 880, 0, { walk: proWalk(t, a, b, 0, 1, 0.4).walk, face: "smile" }, 0.45)}</>, { pan: 1700, dusk: 0.5 })) },
  { c: "Rıza bir süre öylece kaldı", r: (t, a, b) => C(t, a, b, [2.4, 2.6], [1500, 560], sokak(t, <>{rizaAsker(t, 1500, { look: -0.6, face: "shock" })}</>, { pan: 1700, dusk: 0.5 })) },
  { c: "Ve Mürüvvet Hanım", tone: "cool", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 600], sokak(t, <>{mur(t, lerp(400, 800, ramp(t, a, b)), { walk: proWalk(t, a, b, 400, 800, 0.9).walk })}{ferDis(t, 1200, { look: -0.5 })}</>, { pan: 1800, dusk: 0.2 })) },
  { c: "Bir sabah, Cuma namazından dönerken", r: (t, a, b) => again("Ve Mürüvvet Hanım", t, a, b, 0) },
  { c: "Tek kelime söylemedi", tone: "gold", r: (t, a, b) => C(t, a, b, [1.8, 2], [1060, 580], sokak(t, <>{mur(t, 900, { reach: 0.9, reachDir: 1, face: "sad", look: 0.6 })}{ferDis(t, 1200, { look: -0.6, face: "shock" })}<path d="M1110,640 Q1200,600 1290,640 L1300,760 Q1200,730 1100,760Z" fill="#8E2A2A" opacity={ramp(t, a, a + 1)} /></>, { pan: 1800, dusk: 0.2 })) },
  { c: "Ama otuz beş yıllık bir zincir", sfx: "ding", r: (t, a, b) => again("Tek kelime söylemedi", t, a, b, 1),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="ZİNCİR KIRILDI" y={820} size={100} /> },

  // ── ŞART ──
  { c: "Bin dokuz yüz on dokuz baharı", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.05, 1.15], [960, 540], sokak(t, null, { pan: 1600 })),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="1919 BAHARI" y={70} size={90} /> },
  { c: "Mahallede bir düğün var", tone: "gold", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 620], oda(t, <>{naz(t, 640, { face: "smile" })}{PFig({ x: 1040, y: Y, s: 1.0, kind: "girl", robe: "#C8243A", robe2: "#F7E6C4", scarf: "#D8404A", t, seed: 21, face: "shy" })}</>)),
    html: (t, a) => <NameCard t={t} at={a + 1.2} name="SALİHA" sub="17 yaşında · Nazife Kadın'ın torunu" c="#C8243A" /> },
  { c: "Nikâh odasında imam efendi", tone: "warm", r: (t, a, b) => C(t, a, b, [1.15, 1.25], [960, 620], oda(t, <>{imam(t, 520, { sit: true, y: 880, talk: 1, look: 0.5 })}{erkek(t, 860, 0, { sit: true, y: 880 })}{erkek(t, 1160, 1, { sit: true, y: 880 })}<rect x={1340} y={160} width={560} height={720} fill="#8E2A2A" opacity={0.85} />{[0, 1, 2].map((i) => <path key={i} d={`M${1360 + i * 180},160 V880`} stroke="#6A1A1A" strokeWidth={8} />)}</>)) },
  { c: "İmam tam nikâhı kıyacakken", r: (t, a, b) => again("Nikâh odasında imam efendi", t, a, b, 0) },
  { c: "Senin sesin", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.8, 2], [1600, 570], oda(t, <><rect x={1340} y={160} width={560} height={720} fill="#8E2A2A" opacity={0.5} />{fer(t, 1600, { talk: 1, look: -0.6 })}</>)) },
  { c: "İmam efendi. Bir şart yazılsın", r: (t, a, b) => again("Senin sesin", t, a, b, 1),
    html: (t, a) => <Txt t={t} at={a + 0.4} text="“BİR ŞART YAZILSIN.”" y={820} size={100} /> },
  { c: "Herkes susuyor", r: (t, a, b) => again("Nikâh odasında imam efendi", t, a, b, 1) },
  { c: "Kızın kocası üstüne başka bir kadınla evlenirse", r: (t, a, b) => again("Senin sesin", t, a, b, 2),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="“NİKÂH DÜŞSÜN. KANUN İZİN VERİYOR.”" y={820} size={70} /> },
  { c: "İmam efendi damadın babasına bakıyor", r: (t, a, b) => C(t, a, b, [1.8, 2], [700, 570], oda(t, <>{imam(t, 520, { sit: true, y: 880, look: 0.6 })}{erkek(t, 860, 0, { sit: true, y: 880, look: -0.5, face: "normal" })}</>)) },
  { c: "Ve kalem, kâğıdın üstünde, o şartı yazıyor", sfx: "ding", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.25], [960, 540], kapali(t, <NikahSenet t={t} k={1} hi={ramp(t, a + 0.5, a + 2.5)} s={1.4} />, "#3A2A20")),
    html: (t, a) => <Tag t={t} at={a + 1.5} text="ŞART YAZILDI" c={H.green} /> },
  { c: "On yıl önce, annenin sana fısıldadığı cümle", tone: "night", r: (t, a, b) => C(t, a, b, [1.2, 1.3], [960, 600], <>{gece(t, <>{anne(t, 760, { look: 0.6, talk: 1 })}{fer(t, 1160, { look: -0.6, face: "smile" }, 1.05)}</>)}<rect width={1920} height={1080} fill="#F2D8A8" opacity={0.2} /></>) },
  { c: "Şimdi bir başka kızın nikâh senedinde", r: (t, a, b) => again("Ve kalem, kâğıdın üstünde, o şartı yazıyor", t, a, b, 0) },
  { c: "Saliha perdenin arkasından sana bakıyor", tone: "gold", r: (t, a, b) => C(t, a, b, [2.2, 2.4], [1040, 560], oda(t, <>{PFig({ x: 1040, y: Y, s: 1.0, kind: "girl", robe: "#C8243A", robe2: "#F7E6C4", scarf: "#D8404A", t, seed: 21, face: "worried", look: 0.4 })}</>)) },
  { c: "Ama bir gün anlayacak", sfx: "ding", r: (t, a, b) => C(t, a, b, [1.6, 1.8], [1600, 540], oda(t, <>{fer(t, 1600, { face: "smile", look: -0.5 })}</>)) },

  // ── KAPANIŞ ──
  { c: "Feride'nin hikâyesi hayali", sfx: "whoosh", tone: "gold", r: (t, a, b) => C(t, a, b, [1.15, 1], [960, 540], sokak(t, null, { pan: 1000 + ramp(t, a, b) * 300, dusk: 0.6 })),
    html: (t, a, b) => <><Txt t={t} at={a + 0.3} text="HİKÂYE HAYALİ" y={70} size={80} /><Txt t={t} at={a + (b - a) * 0.5} text="İÇİNDEKİ HER ŞEY GERÇEK" y={820} size={84} /></> },
  { c: "Bin sekiz yüz seksen beşte", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.04], [960, 540], <Paper />),
    html: (t, a) => <Belge t={t} at={a + 0.2} date="İstanbul, 1885" src="Duben & Behar, Istanbul Households (1991)">Evli erkeklerin yalnızca yaklaşık <b>yüzde ikisi</b> birden fazla eşliydi.</Belge> },
  { c: "Kumalık nadirdi", tone: "cool", r: (t, a, b) => C(t, a, b, [1.3, 1.5], [960, 600], sokak(t, <>{ferDis(t, 960, { face: "sad" })}</>, { pan: 900, dusk: 0.5 })) },
  { c: "Kumalı bir evde her kadının", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <><Paper />{["AYRI ODA", "EŞİT GECE", "MAHKEME HAKKI"].map((l, i) => <Disc key={i} x={420 + i * 540} y={460} r={180} k={ramp(t, a + 0.4 + i * 0.6, a + 0.7 + i * 0.6)} c={[H.cobalt, H.purple, H.green][i]} label={l} />)}</>) },
  { c: "Bin dokuz yüz on yedide", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], kapali(t, <Gazete t={t} k={1} s={1.0} />, "#3A2A20")) },
  { c: "Ve otuz bir Mayıs bin dokuz yüz on sekizde", r: (t, a, b) => C(t, a, b, [1.1, 1], [960, 540], yangin(t, null, 500)) },
  { c: "Şimdi sana soruyorum", sfx: "drone", tone: "warm", r: (t, a, b) => again("Sen evin önünde duruyorsun", t, a, b, 0) },
  { c: "Eğer Feride'nin yerinde olsaydın", r: (t, a, b) => again("Bir adım atarsan", t, a, b, 2),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.35} text="İÇERİ GİRER MİYDİN, GERİ Mİ DÖNERDİN?" y={70} size={66} /> },
  { c: "Ve söyle bakalım", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1.2], [960, 600], oda(t, <>{fer(t, 760, { look: 0.5 })}{lem(t, 1160, { look: -0.5, hands: "baby" })}</>)),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="FERİDE, LEMAN'I AFFETMELİ MİYDİ?" y={820} size={70} /> },
  { c: "Cevabını yorumlara yaz", tone: "gold", r: (t, a, b) => C(t, a, b, [1, 1.05], [960, 540], <Paper />),
    html: (t, a) => <Txt t={t} at={a + 0.2} text="CEVABIN YORUMLARDA 👇" y={420} size={100} /> },
  { c: "Ve eğer bu hikâye sana dokunduysa", tone: "gold", r: (t, a, b) => C(t, a, b, [1.3, 1.1], [960, 560], kapali(t, <RecelTabak x={960} y={620} s={2.6} t={t} />, "#E9DCC0")),
    html: (t, a) => <Abone t={t} at={a + 0.5} /> },
  { c: "Çünkü bir sonraki videoda", tone: "gold", r: (t, a, b) => again("Ve eğer bu hikâye sana dokunduysa", t, a, b, 0), html: (t, a, b) => htmlOf("Ve eğer bu hikâye sana dokunduysa", t, b) },
  { c: "Hoşça kal", tone: "gold", r: (t, a, b) => C(t, a, b, [1.1, 1], [960, 540], sokak(t, null, { pan: 2 * 368 - 600, dusk: 0.7 })) },
];

type Timed = Sh & { from: number; to: number };
export const TIMED: Timed[] = (() => {
  let after = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : s.c.startsWith("+") ? after - 0.2 + parseFloat(s.c) : cue(s.c, after) - 0.12;
    after = from + 0.2;
    return { ...s, from, to: 0 };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K3R_16_SECONDS));
  return raw;
})();

const VOL: Record<string, number> = { whoosh: 0.07, drone: 0.14, boom: 0.15, ding: 0.14, knock: 0.1, pop: 0.12, splash: 0.08 };
export const K3RVideo16: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K3R_16_SECONDS;
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
      <Audio src={staticFile("audio/k3r-16.wav")} />
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
