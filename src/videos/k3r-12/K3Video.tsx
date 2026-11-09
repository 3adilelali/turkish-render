import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k3r-12-words.json";
import { makeCue, ramp } from "../../lib/cues";
import { H, HCam, HFig, HFrame, HTiny, ROBES, Room, lerp } from "../../components/Harem";
import { Akce, Kandil, Sofra } from "../../components/HaremPlus";
import { Abone, Belge, Disc, NameCard, Paper, Tag, Txt, Walker } from "../../components/K3Text";
import { Bohca } from "../../components/Kira";
import { Yelkenli } from "../../components/Hazine";
import { MehirKese, Sicil } from "../../components/Gelin";
import { CesmeGece, KapiOnu, Mahkeme, Mendil, OFirin, Tereke, Tersane, YunEgir } from "../../components/Dul";
import { Atmos, Fore, LiveCam, Sweep, Tone } from "../../components/Live";

// Kanal 3 · yeniden 12 · "Osmanlı'da Dul Kadın Olmak Neden Bu Kadar Zordu?" — TAMAMEN MOTOR, canlı katman.
// Sen: Ayşe (26, Kasımpaşa, kalyoncu Mustafa'nın dulu). Ali (7), Emine (4). Kayınbirader Hüseyin. Kadı efendi. 1770 Çeşme.
// Ölüm/savaş detaysız: yangın ufukta, haber bir adamın eğik başıyla.

const ALT: Record<string, string[]> = {
  "Ve sen, kapıdan dışarı çıkmadan": ["E sen kapıdan dışarı çıkmadan", "Ve sen kapıdan dışarı çıkmadan"], "Kocanın ağabeyi Hüseyin": ["Kocanın ağabey Hüseyin", "kocanın ağabey Hüseyin"],
  "Yirmi altı yaşındasın": ["26 yaşındasın"], "Yedi yaşında Ali": ["7 yaşında Ali"], "Dört ay on gün": ["4 ay 10 gün", "Dört ay, on gün"],
  "Yedi yaşındaydı": ["7 yaşındaydı"], "Bir okka yün": ["1 okka yün"], "senin payın sekizde bir": ["senin payın 8'de bir", "senin payın 1/8"],
  "Kocası öleli altı ay": ["Kocası öleli 6 ay"], "Ve bir yıl önce": ["Ve 1 yıl önce"],
};
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const VAR: [RegExp, string][] = [[/â/g, "a"], [/î/g, "i"], [/û/g, "u"]];
const variants = (p: string) => { const out = [p]; for (const [re, to] of VAR) for (const v of [...out]) { const n = v.replace(re, to); if (n !== v) out.push(n); } return out; };
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K3R_12_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone; fore?: "column" | "curtain" | "lamp" };
type F = "normal" | "worried" | "shock" | "sad" | "smile" | "closed";
type O = Partial<React.ComponentProps<typeof HFig>>;

const AY = { kind: "girl" as const, robe: "#4E5D6C", robe2: "#EDE6D6" };
const HU = { kind: "efendi" as const, robe: "#5A3A26", robe2: "#C9B08A" };
const KA = { kind: "efendi" as const, robe: "#2A3A2E", robe2: "#F4F0E6" };
const MU = { kind: "efendi" as const, robe: H.cobalt, robe2: "#F5E8CC" };
const AL = { kind: "efendi" as const, robe: H.ochre, robe2: "#F5E8CC" };
const EM = { kind: "girl" as const, robe: H.pink, robe2: "#F5E8CC" };
const ZE = { kind: "kalfa" as const, robe: H.teal, robe2: "#E9DCC2", cap: "#1E4A4A" };
const FA = { kind: "kalfa" as const, robe: "#6A5A4A", robe2: "#E9DCC2", cap: "#3A2E24" };
const Y = 960;

const mah = (t: number, cold = 1, crowd = 0) => <Mahkeme t={t} cold={cold} crowd={crowd} />;
const ays = (t: number, x: number, s = 1.15, face: F = "worried", o: O = {}) => <HFig x={x} y={Y} s={s} {...AY} t={t} face={face} seed={3} {...o} />;
const hus = (t: number, x: number, s = 1.2, talk = 0, face: F = "normal", look = 0) => <HFig x={x} y={Y} s={s} {...HU} t={t} talk={talk} face={face} look={look} seed={6} />;
const kadi = (t: number, talk = 0, look = -0.6, face: F = "normal") => <HFig x={1580} y={660} s={1.05} {...KA} old sit t={t} talk={talk} look={look} face={face} seed={9} />;
const katip = (t: number) => <HFig x={1080} y={800} s={0.85} kind="efendi" robe="#6A5A4A" robe2="#E9DCC2" sit t={t} look={-0.3} seed={11} bow={0.3} />;
const ali = (t: number, x: number, face: F = "normal", o: O = {}) => <HFig x={x} y={Y} s={0.78} {...AL} child t={t} face={face} seed={14} {...o} />;
const emi = (t: number, x: number, face: F = "normal", o: O = {}) => <HFig x={x} y={Y} s={0.66} {...EM} child t={t} face={face} seed={15} {...o} />;
const court = (t: number, a: number, b: number, z: [number, number], c0: [number, number], aFace: F = "worried", hTalk = 0, kTalk = 0) => (
  <HCam t={t} a={a} b={b} z={z} c0={c0}>{mah(t)}{kadi(t, kTalk)}{katip(t)}{ays(t, 520, 1.15, aFace, { look: 0.5 })}{hus(t, 820, 1.2, hTalk, hTalk ? "normal" : "normal", -0.4)}</HCam>
);
const house = (t: number, night = 0) => <Room t={t} win={night ? 0.9 : null} lamp={night ? 1 : 0} />;

const SHOTS: Sh[] = [
  // ── AN ──
  { c: "Mahkemenin içi soğuk", sfx: "drone", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.05]} c0={[960, 520]}>{mah(t)}</HCam>,
    html: (t, a) => <Txt t={t} at={a + 0.4} text="KADI MAHKEMESİ · İSTANBUL" y={70} size={64} /> },
  { c: "Önünde, yüksek bir sedirde", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2, 2.3]} c0={[1580, 560]}>{mah(t)}{kadi(t, 0, -0.4)}</HCam> },
  { c: "Yanında katip", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.6, 2.9]} c0={[1080, 700]}>{mah(t)}{katip(t)}</HCam>,
    html: (t, a) => <Tag t={t} at={a + 0.3} text="KÂTİP" c="#6A5A4A" /> },
  { c: "Ve senin karşında", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.7, 1.9]} c0={[820, 640]}>{mah(t)}{hus(t, 820, 1.2, 0, "normal", -0.5)}</HCam> },
  { c: "Sesi yüksek", sfx: "knock", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.6, 3]} c0={[820, 560]}>{mah(t)}{hus(t, 820, 1.2, 1, "normal", -0.6)}</HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“BU EV BİZİM BABAMIZIN EVİ.”" y={820} size={80} /> },
  { c: "Kardeşim öldü", tone: "cool", r: (t, a, b) => again("Sesi yüksek", t, a, b, 1),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.2} text="“BU KADIN ÇOCUKLARIYLA GİTSİN.”" y={820} size={80} accent={H.red} /> },
  { c: "Kadı efendi sana dönüyor", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[1580, 540]}>{mah(t)}{kadi(t, 1, -0.9)}</HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="“SEN NE DİYORSUN HATUN?”" y={820} size={90} /> },
  { c: "Bütün mahkeme susuyor", tone: "cool", r: (t, a, b) => court(t, a, b, [1.05, 1.15], [960, 600]) },
  { c: "Ve sen, hayatında ilk kez", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.8, 3.3]} c0={[520, 540]}>{mah(t)}{ays(t, 520, 1.15, "worried", { look: 0.6 })}</HCam> },

  // ── KİMSİN ──
  { c: "Adın Ayşe", sfx: "ding", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 640]}><KapiOnu t={t} />{ays(t, 960, 1.3, "normal")}</HCam>,
    html: (t, a) => <NameCard t={t} at={a + 0.3} name="AYŞE" sub="26 yaşında · Kasımpaşa · iki çocuk annesi" c={AY.robe} /> },
  { c: "Kasımpaşa'da yaşıyorsun", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.05]} c0={[960, 520]}><Tersane t={t} /></HCam>,
    html: (t, a) => <Tag t={t} at={a + 0.5} text="TERSANE-İ ÂMİRE" c={H.cobalt} /> },
  { c: "Kocan Mustafa, bir kalyoncuydu", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 640]}><Tersane t={t} />{<HFig x={960} y={1040} s={1.3} {...MU} t={t} face="smile" seed={21} />}</HCam>,
    html: (t, a) => <NameCard t={t} at={a + 0.4} name="MUSTAFA" sub="kalyoncu · donanmanın büyük gemilerinde denizci" c={MU.robe} /> },
  { c: "İki çocuğunuz var", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 640]}>{house(t)}{ali(t, 840, "smile", { look: 0.4 })}{emi(t, 1080, "smile", { look: -0.4 })}</HCam>,
    html: (t, a) => <>{["ALİ · 7", "EMİNE · 4"].map((l, i) => <Tag key={i} t={t} at={a + 0.8 + i * 0.6} text={l} c={[AL.robe, EM.robe][i]} x={500 + i * 600} y={140} />)}</> },
  { c: "Ve bir yıl önce", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 600]}><Tersane t={t} crowd={1} /></HCam>,
    html: (t, a) => <Txt t={t} at={a + 0.4} text="1770 · BAHAR" y={70} size={72} /> },
  { c: "Donanma Akdeniz'e açılıyordu", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 600]}><Yelkenli t={t} px={lerp(-200, 300, ramp(t, a, b))} /></HCam>,
    html: (t, a) => <Tag t={t} at={a + 0.4} text="AKDENİZ" c={H.cobalt} /> },
  { c: "Gitmeden önce Emine'yi havaya", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 600]}><KapiOnu t={t} /><HFig x={960} y={1040} s={1.3} {...MU} t={t} face="smile" look={0.3} seed={21} /><g transform={`translate(0,${-Math.abs(Math.sin(t * 3)) * 60})`}>{<HFig x={1000} y={760} s={0.6} {...EM} child t={t} face="smile" seed={15} />}</g></HCam> },
  { c: "Bayrama dönerim", tone: "gold", r: (t, a, b) => again("Gitmeden önce Emine'yi havaya", t, a, b, 1),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.1} text="“BAYRAMA DÖNERİM.”" y={820} size={110} accent={H.gold} /> },

  // ── HABER ──
  { c: "Ama yaz ortasında İstanbul'a bir haber", sfx: "drone", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 600]}><Tersane t={t} dusk={1} /></HCam> },
  { c: "Önce bir fısıltı olarak", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 640]}><KapiOnu t={t} dusk={1} />{Array.from({ length: 4 }, (_, i) => <HFig key={i} x={600 + i * 240} y={1040} s={1.0} kind="kalfa" robe={ROBES[(i + 2) % 8]} robe2="#E9DCC2" t={t} face="worried" talk={i % 2} look={(i % 2 ? -1 : 1) * 0.6} seed={i + 30} />)}</HCam> },
  { c: "Donanma, Çeşme limanında yakılmıştı", sfx: "boom", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 560]}><CesmeGece t={t} fire={ramp(t, a, a + 2)} /></HCam>,
    html: (t, a) => <Txt t={t} at={a + 0.6} text="ÇEŞME · TEMMUZ 1770" y={70} size={72} accent={H.red} /> },
  { c: "Rus gemileri gece", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[700, 600]}><CesmeGece t={t} fire={0.6} /></HCam>,
    html: (t, a) => <Tag t={t} at={a + 0.6} text="ATEŞ GEMİLERİ" c={H.red} /> },
  { c: "Gemiler birbirine sıkışmıştı", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[1100, 600]}><CesmeGece t={t} fire={0.9} /></HCam> },
  { c: "Ve bir gecede, Osmanlı donanmasının", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.05, 1.15]} c0={[960, 560]}><CesmeGece t={t} fire={1} /></HCam> },
  { c: "Kasımpaşa'nın sokaklarında kadınlar", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 640]}><KapiOnu t={t} />{Array.from({ length: 4 }, (_, i) => <HFig key={i} x={300 + i * 440} y={1040} s={1.0} kind="kalfa" robe={ROBES[(i + 4) % 8]} robe2="#E9DCC2" t={t} face="worried" look={0.3} seed={i + 34} />)}</HCam>,
    html: (t, a) => <Tag t={t} at={a + 0.8} text="HAFTALARCA" c={H.night} /> },
  { c: "Gelen her denizciye aynı soruyu", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 600]}><Tersane t={t} ships={0} />{ays(t, 800, 1.15, "worried", { talk: 1, look: 0.6 })}<HFig x={1100} y={Y} s={1.2} kind="efendi" robe="#3A4A5A" robe2="#C9B08A" t={t} bow={0.4} face="sad" look={-0.5} seed={40} /></HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="“BENİMKİNİ GÖRDÜN MÜ?”" y={820} size={100} /> },
  { c: "Ve bir sabah, kocanın gemisinden", sfx: "knock", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 600]}><KapiOnu t={t} /><HFig x={960} y={1040} s={1.3} kind="efendi" robe="#3A4A5A" robe2="#C9B08A" t={t} face="sad" bow={lerp(0, 0.7, ramp(t, a + 1, b))} seed={41} /></HCam> },
  { c: "Söylemesine gerek yoktu", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[3, 3.4]} c0={[700, 560]}><KapiOnu t={t} />{ays(t, 700, 1.2, "sad")}</HCam> },

  // ── İDDET ──
  { c: "O günden sonra hayatın bir kurala", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 600]}>{house(t, 1)}{ays(t, 960, 1.2, "closed", { sit: true, y: 1040 })}</HCam> },
  { c: "Dört ay on gün", sfx: "ding", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><Paper /><Disc x={960} y={470} r={260} k={ramp(t, a + 0.2, a + 0.6)} c={AY.robe} label="4 AY 10 GÜN" /></HCam>,
    html: (t, a) => <Txt t={t} at={a + 1} text="İDDET" y={820} size={130} accent={AY.robe} /> },
  { c: "Kocası ölen bir kadın", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><Paper />{["EVLENEMEZ", "SÜSLENMEZ", "DIŞARI ÇIKMAZ"].map((l, i) => <Disc key={i} x={340 + i * 620} y={480} r={200} k={ramp(t, a + 0.4 + i * 0.7, a + 0.7 + i * 0.7)} c={[H.red, H.purple, H.night][i]} label={l} />)}</HCam> },
  { c: "Komşular yemek getirdi", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[700, 760]}><KapiOnu t={t} pots={ramp(t, a, b)} /></HCam> },
  { c: "Ama dört ay on gün boyunca", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 760]}>{house(t)}<Sofra t={t} x={960} y={880} s={1.1} /></HCam>,
    html: (t, a) => <>{["UN BİTTİ", "ODUN BİTTİ"].map((l, i) => <Tag key={i} t={t} at={a + 1.2 + i * 0.8} text={l} c={H.red} x={300 + i * 700} y={140} />)}</> },
  { c: "Ve sen, kapıdan dışarı çıkmadan", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2, 2.3]} c0={[960, 640]}>{house(t, 1)}{ays(t, 960, 1.2, "worried", { sit: true, y: 1040 })}{ali(t, 760, "closed", { sit: true, y: 1040 })}{emi(t, 1160, "closed", { sit: true, y: 1040 })}</HCam> },

  // ── İŞ ──
  { c: "Önce yün eğirmeye başladın", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[1000, 540]}><YunEgir t={t} /></HCam>,
    html: (t, a) => <Tag t={t} at={a + 0.4} text="YÜN EĞİRMEK" c={H.ochre} /> },
  { c: "Bir okka yün", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[1200, 700]}><YunEgir t={t} /></HCam>,
    html: (t, a) => <Txt t={t} at={a + 0.3} text="1 OKKA YÜN = 1 HAFTA" y={820} size={90} /> },
  { c: "Sonra mendil işledin", sfx: "ding", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 560]}><Mendil t={t} k={ramp(t, a, b)} /></HCam> },
  { c: "Bir kadın onları çarşıdaki", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 640]}><KapiOnu t={t} />{ays(t, 820, 1.15, "normal", { look: 0.5 })}<HFig x={1080} y={1040} s={1.1} kind="kalfa" robe={H.purple} robe2="#E9DCC2" t={t} face="normal" look={-0.5} seed={44} /><Bohca x={1100} y={860} s={0.5} t={t} /></HCam> },
  { c: "Senin payın, birkaç akçe", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><Paper />{[0, 1, 2].map((i) => <Akce key={i} x={760 + i * 200} y={480 + (ramp(t, a + i * 0.3, a + 0.5 + i * 0.3) - 1) * 300} r={70} spin={t * 2 + i} />)}</HCam>,
    html: (t, a) => <Txt t={t} at={a + 0.8} text="BİRKAÇ AKÇE" y={820} size={100} accent={H.gold} /> },
  { c: "Gece mum yanarken çalıştın", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 560]}><Mendil t={t} k={0.6} night={1} /></HCam> },
  { c: "Ali uyurken yanında", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2, 2.3]} c0={[800, 700]}>{house(t, 1)}<Kandil x={1250} y={560} s={0.6} t={t} />{ays(t, 1000, 1.15, "normal", { sit: true, y: 1040, bow: 0.5 })}<g transform="rotate(-80 760 980)">{ali(t, 760, "closed", { y: 980 })}</g></HCam>,
    html: (t, a) => <Tag t={t} at={a + 1} text="BABASININ KUŞAĞI" c={MU.robe} /> },
  { c: "Emine her gece aynı şeyi", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.6, 3]} c0={[1160, 820]}>{house(t, 1)}{ays(t, 1000, 1.15, "normal", { sit: true, y: 1040 })}{emi(t, 1200, "worried", { sit: true, y: 1040, look: -0.6, talk: 1 })}</HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="“BABAM BAYRAMDA GELECEK Mİ?”" y={820} size={90} /> },
  { c: "Ve sen her gece aynı yalanı", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[3, 3.4]} c0={[1000, 760]}>{house(t, 1)}{ays(t, 1000, 1.15, "sad", { sit: true, y: 1040, talk: 1, look: 0.6 })}</HCam>,
    html: (t, a, b) => <Txt t={t} at={b - 1} text="“BİR GÜN.”" y={820} size={120} /> },

  // ── BAYRAM ──
  { c: "Ve bayram geldi", sfx: "ding", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.05]} c0={[960, 500]}><KapiOnu t={t} bayram={ramp(t, a, a + 1)} /></HCam>,
    html: (t, a) => <Txt t={t} at={a + 0.4} text="BAYRAM" y={70} size={90} accent={H.gold} /> },
  { c: "Bütün Kasımpaşa bayramlıklarını", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 700]}><KapiOnu t={t} bayram={1} />{Array.from({ length: 5 }, (_, i) => <Walker key={i} t={t} a={a + i * 0.2} b={b + 2} x0={-100 - i * 160} x1={500 + i * 240} y={1040} s={0.72} o={{ kind: i % 2 ? "girl" : "efendi", robe: ROBES[i % 8], robe2: "#F5E8CC", child: true, face: "smile" }} />)}</HCam> },
  { c: "Sen Emine'ye eski bir elbiseyi", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 560]}><Mendil t={t} k={ramp(t, a, b)} flower={H.pink} /></HCam>,
    html: (t, a) => <Tag t={t} at={a + 1.2} text="KÜÇÜK BİR ÇİÇEK" c={H.pink} /> },
  { c: "Bayram sabahı Emine kapının önüne", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 760]}><KapiOnu t={t} bayram={1} />{emi(t, 960, "normal", { sit: true, y: 900 })}</HCam> },
  { c: "Her gelen adamın yüzüne baktı", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 760]}><KapiOnu t={t} bayram={1} />{emi(t, 960, "normal", { sit: true, y: 900, look: Math.sin(t * 1.5) })}<Walker t={t} a={a} b={b} x0={1900} x1={1300} y={1040} s={1.1} o={{ kind: "efendi", robe: "#5A6A4A", robe2: "#C9B08A" }} /></HCam> },
  { c: "Ve akşam ezanı okunurken", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[960, 760]}><KapiOnu t={t} bayram={1} dusk={1} />{emi(t, 960, "sad", { sit: true, y: 900, bow: 0.4 })}</HCam> },
  { c: "Sadece senin kucağına yattı", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[960, 800]}>{house(t, 1)}{ays(t, 960, 1.2, "sad", { sit: true, y: 1040, bow: 0.4 })}<g transform="rotate(-70 1060 1000)">{emi(t, 1060, "closed", { y: 1000 })}</g></HCam> },
  { c: "O gece anladın", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[3, 3.3]} c0={[960, 760]}>{house(t, 1)}{ays(t, 960, 1.2, "closed", { sit: true, y: 1040 })}</HCam> },

  // ── MİRAS ──
  { c: "Sonra kassam geldi", sfx: "knock", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 600]}><KapiOnu t={t} /><HFig x={960} y={1040} s={1.3} kind="efendi" robe="#3A4A5A" robe2="#F4F0E6" t={t} face="normal" hands="tray" seed={50} /></HCam>,
    html: (t, a) => <Txt t={t} at={a + 0.4} text="KASSAM" sub="ölenin mirasını yazan ve bölen görevli" y={820} size={100} /> },
  { c: "Evinizin her şeyini tek tek yazdı", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.05, 1.12]}><Tereke t={t} k={ramp(t, a + 0.3, b + 3)} /></HCam> },
  { c: "Kocanın gümüş saati", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2, 2.3]} c0={[1560, 520]}><Tereke t={t} k={1} /></HCam>,
    html: (t, a) => <Tag t={t} at={a + 0.3} text="GÜMÜŞ SAAT" c={H.night} /> },
  { c: "Ve sana bir şey söyledi", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 640]}>{house(t)}{ays(t, 820, 1.15, "worried", { look: 0.5 })}<HFig x={1100} y={Y} s={1.2} kind="efendi" robe="#3A4A5A" robe2="#F4F0E6" t={t} talk={1} look={-0.5} seed={50} /></HCam> },
  { c: "Önce borçlar ödenir", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><Paper />{["1 · BORÇLAR", "2 · MEHİR", "3 · MİRAS"].map((l, i) => <Disc key={i} x={340 + i * 620} y={480} r={200} k={ramp(t, a + 0.2 + i * 1.6, a + 0.5 + i * 1.6)} c={[H.night, H.red, H.green][i]} label={l} />)}</HCam> },
  { c: "Buna mehr-i müeccel denir", sfx: "ding", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 560]}><MehirKese t={t} a={a} /></HCam>,
    html: (t, a) => <Txt t={t} at={a + 0.3} text="MEHR-İ MÜECCEL" sub="nikâhta söz verilen, ileriye bırakılan para" y={820} size={90} accent={H.red} /> },
  { c: "Ondan sonra miras bölünür", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><Paper /><g transform="translate(960,480)">{Array.from({ length: 8 }, (_, i) => { const a0 = (i / 8) * Math.PI * 2 - Math.PI / 2, a1 = ((i + 1) / 8) * Math.PI * 2 - Math.PI / 2, gap = i === 0 ? ramp(t, a + 1.5, a + 2.2) * 40 : 0, mx = Math.cos((a0 + a1) / 2) * gap, my = Math.sin((a0 + a1) / 2) * gap; return <path key={i} d={`M${mx},${my} L${mx + Math.cos(a0) * 300},${my + Math.sin(a0) * 300} A300,300 0 0 1 ${mx + Math.cos(a1) * 300},${my + Math.sin(a1) * 300}Z`} fill={i === 0 ? AY.robe : H.ochre} stroke={H.ln} strokeWidth={4} opacity={ramp(t, a + i * 0.12, a + 0.3 + i * 0.12)} />; })}</g></HCam>,
    html: (t, a) => <>{[["SEN · 1/8", AY.robe], ["ÇOCUKLAR · 7/8", H.ochre]].map(([l, c], i) => <Tag key={i} t={t} at={a + 2 + i * 0.6} text={l} c={c} x={160 + i * 1000} y={140} />)}</> },
  { c: "Ve kocanın ağabeyi de bu işin", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[960, 560]}>{house(t)}{hus(t, 960, 1.25, 0, "normal", 0.4)}</HCam>,
    html: (t, a) => <NameCard t={t} at={a + 0.6} name="HÜSEYİN" sub="kocanın ağabeyi" c={HU.robe} /> },

  // ── ALİ ──
  { c: "Bir sabah Ali ortadan kayboldu", sfx: "drone", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 600]}>{house(t)}<rect x={700} y={880} width={180} height={40} rx={12} fill={AL.robe} opacity={0.5} /></HCam>,
    html: (t, a) => <Tag t={t} at={a + 0.6} text="ALİ YOK" c={H.red} /> },
  { c: "Bütün mahalleyi aradın", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 640]}><KapiOnu t={t} /><Walker t={t} a={a} b={b} x0={1800} x1={300} y={1040} s={1.15} o={{ ...AY, face: "worried" }} /></HCam> },
  { c: "İskeleye koştun", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 760]}><Tersane t={t} ships={0} /><Walker t={t} a={a} b={b} x0={200} x1={1300} y={1040} s={1.15} o={{ ...AY, face: "worried" }} /></HCam> },
  { c: "Ve öğle vakti, fırının önünde", sfx: "ding", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 640]}><OFirin t={t} />{ali(t, 760, "worried", { hands: "tray", y: 1040 })}</HCam> },
  { c: "Fırıncıya yalvarmıştı", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[700, 720]}><OFirin t={t} />{ali(t, 600, "worried", { talk: 1, look: 0.6, y: 1040 })}<HFig x={880} y={1040} s={1.2} kind="efendi" robe="#E9DCC2" robe2="#C9B08A" t={t} look={-0.5} seed={55} /></HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“BENİ ÇIRAK AL. ANNEM BÜTÜN GECE ÇALIŞIYOR.”" y={820} size={62} /> },
  { c: "Yedi yaşındaydı", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[3, 3.4]} c0={[760, 760]}><OFirin t={t} />{ali(t, 760, "sad", { hands: "tray", y: 1040 })}</HCam>,
    html: (t, a) => <Tag t={t} at={a + 0.3} text="7 YAŞINDA" c={AL.robe} /> },
  { c: "Sen onu eve götürdün", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2, 2.3]} c0={[960, 680]}>{house(t, 1)}{ays(t, 880, 1.15, "normal", { talk: 1, look: 0.6, sit: true, y: 1040 })}{ali(t, 1080, "sad", { look: -0.5, sit: true, y: 1040 })}</HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="“SENİN İŞİN OKUMAK. EKMEĞİ BEN BULURUM.”" y={820} size={66} /> },
  { c: "Babanın istediği buydu", r: (t, a, b) => again("Sen onu eve götürdün", t, a, b, 0) },
  { c: "Ama Ali'nin yüzünde bir şey değişmişti", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[3, 3.4]} c0={[1080, 760]}>{house(t, 1)}{ali(t, 1080, "normal", { look: -0.3, sit: true, y: 1040 })}</HCam> },

  // ── TALİP ──
  { c: "Babasının yerine geçmeye", r: (t, a, b) => again("Ama Ali'nin yüzünde bir şey değişmişti", t, a, b, 0) },
  { c: "İddet bitince, kapına bir görücü", sfx: "knock", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 640]}><KapiOnu t={t} /><HFig x={960} y={1040} s={1.25} kind="kalfa" robe={H.purple} robe2="#E9DCC2" t={t} face="smile" seed={60} /></HCam>,
    html: (t, a) => <Tag t={t} at={a + 0.6} text="GÖRÜCÜ" c={H.purple} /> },
  { c: "Galata'da kumaş satan dul bir tüccar", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 600]}><Room t={t} /><HFig x={960} y={1040} s={1.35} kind="efendi" robe="#7A2A26" robe2="#E9C37A" t={t} face="smile" seed={61} /></HCam>,
    html: (t, a) => <Tag t={t} at={a + 0.4} text="GALATA · KUMAŞ TÜCCARI" c="#7A2A26" /> },
  { c: "Sana yeni elbiseler, sıcak bir ev", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><Paper />{["ELBİSE", "SICAK EV", "DOLU KİLER"].map((l, i) => <Disc key={i} x={340 + i * 620} y={480} r={200} k={ramp(t, a + 0.3 + i * 0.6, a + 0.6 + i * 0.6)} c={[H.rose, H.ochre, H.green][i]} label={l} />)}</HCam> },
  { c: "Annen sevindi", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2, 2.3]} c0={[960, 600]}>{house(t)}<HFig x={840} y={Y} s={1.2} {...FA} old t={t} face="smile" talk={1} look={0.5} seed={62} />{ays(t, 1080, 1.15, "normal", { look: -0.5 })}</HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="“KIZIM, BU SENİN KURTULUŞUN.”" y={820} size={80} /> },
  { c: "Ama görücü kadın bir şey daha söyledi", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.6, 3]} c0={[960, 560]}><KapiOnu t={t} /><HFig x={960} y={1040} s={1.25} kind="kalfa" robe={H.purple} robe2="#E9DCC2" t={t} face="worried" talk={1} seed={60} /></HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.6} text="“ÇOCUKLAR MESELESİ VAR TABİİ.”" y={820} size={80} /> },
  { c: "Çünkü kural açıktı", sfx: "ding", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><Paper />{["ÇOCUKLAR · ANNENİN", "YABANCIYLA EVLİLİK", "→ BABANIN AİLESİ"].map((l, i) => <Disc key={i} x={340 + i * 620} y={480} r={200} k={ramp(t, a + 0.3 + i * 1.8, a + 0.6 + i * 1.8)} c={[H.green, H.purple, HU.robe][i]} label={l} />)}</HCam> },
  { c: "Ama anne çocuklara", r: (t, a, b) => keep("Çünkü kural açıktı", t, b) },
  { c: "Çocuklar babanın ailesine", r: (t, a, b) => keep("Çünkü kural açıktı", t, b) },
  { c: "Sen o gece Emine'nin uykusunu", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[960, 800]}>{house(t, 1)}{ays(t, 880, 1.15, "sad", { sit: true, y: 1040, look: 0.6 })}<g transform="rotate(-80 1100 1000)">{emi(t, 1100, "closed", { y: 1000 })}</g></HCam> },
  { c: "Ve sabah görücüye cevabını verdin", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[880, 560]}><KapiOnu t={t} />{ays(t, 820, 1.2, "normal", { talk: 1, look: 0.5 })}<HFig x={1100} y={1040} s={1.2} kind="kalfa" robe={H.purple} robe2="#E9DCC2" t={t} face="worried" look={-0.5} seed={60} /></HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="“BENİM EVİM BURASI.”" y={820} size={100} accent={AY.robe} /> },

  // ── KAYINBİRADER ──
  { c: "Kocanın ağabeyi Hüseyin", sfx: "knock", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 600]}><KapiOnu t={t} />{hus(t, 960, 1.35, 0, "normal")}</HCam> },
  { c: "Bu ev senin değil, dedi", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.6, 3]} c0={[960, 520]}><KapiOnu t={t} />{hus(t, 960, 1.35, 1, "normal")}</HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.2} text="“ÇOCUKLARIN VASİSİ BEN OLURUM.”" y={820} size={80} accent={HU.robe} /> },
  { c: "Sen de baba evine dön", tone: "cool", r: (t, a, b) => again("Bu ev senin değil, dedi", t, a, b, 1) },
  { c: "Vasi, yetim çocukların malına", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><Paper /></HCam>,
    html: (t, a) => <Txt t={t} at={a + 0.3} text="VASİ" sub="yetim çocukların malına bakan kişi" y={420} size={170} accent={HU.robe} /> },
  { c: "Ve eğer o vasi olursa", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><Paper />{["EVİ SATAR", "PAYI HARCAR", "ÇOCUKLAR GİDER"].map((l, i) => <Disc key={i} x={340 + i * 620} y={480} r={200} k={ramp(t, a + 0.4 + i * 0.9, a + 0.7 + i * 0.9)} c={H.red} label={l} />)}</HCam> },
  { c: "O gece hiç uyumadın", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[960, 600]}>{house(t, 1)}<Kandil x={1250} y={560} s={0.6} t={t} />{ays(t, 960, 1.2, "worried", { sit: true, y: 1040 })}</HCam> },
  { c: "Sabah ezanı okunurken bir karar", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[3, 3.4]} c0={[960, 640]}>{house(t, 1)}{ays(t, 960, 1.2, "normal", { sit: true, y: 1040 })}</HCam>,
    html: (t, a, b) => <Txt t={t} at={b - 1.2} text="MAHKEMEYE GİDECEKTİN." y={820} size={100} accent={AY.robe} /> },

  // ── KOMŞULAR ──
  { c: "Ama bir kadının tek başına mahkemeye", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 600]}><KapiOnu t={t} />{Array.from({ length: 4 }, (_, i) => <HFig key={i} x={300 + i * 440} y={1040} s={1.0} kind="kalfa" robe={ROBES[(i + 1) % 8]} robe2="#E9DCC2" t={t} face="normal" talk={i % 2} look={(i % 2 ? -1 : 1) * 0.5} seed={i + 70} />)}</HCam> },
  { c: "Mahallede fısıltılar başladı", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2, 2.3]} c0={[700, 600]}><KapiOnu t={t} />{Array.from({ length: 2 }, (_, i) => <HFig key={i} x={560 + i * 260} y={1040} s={1.1} kind="kalfa" robe={ROBES[(i + 5) % 8]} robe2="#E9DCC2" t={t} face="worried" talk={1 - i} look={(i ? -1 : 1) * 0.7} seed={i + 74} />)}</HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.4} text="“KOCASI ÖLELİ ALTI AY OLMADI…”" y={820} size={76} /> },
  { c: "Kimisi seni ayıpladı", r: (t, a, b) => again("Mahallede fısıltılar başladı", t, a, b, 0) },
  { c: "Ama iki kadın senin yanında durdu", sfx: "ding", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 640]}><KapiOnu t={t} />{ays(t, 960, 1.15, "normal")}<HFig x={720} y={1040} s={1.15} {...ZE} t={t} face="smile" look={0.5} seed={80} /><HFig x={1200} y={1040} s={1.15} {...FA} old t={t} face="smile" look={-0.5} seed={81} /></HCam>,
    html: (t, a) => <>{["ZELİHA HANIM", "FIRINCININ ANNESİ"].map((l, i) => <Tag key={i} t={t} at={a + 1 + i * 0.6} text={l} c={[ZE.robe, FA.robe][i]} x={260 + i * 900} y={140} />)}</> },
  { c: "Biz şahit oluruz, dediler", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[840, 560]}><KapiOnu t={t} />{ays(t, 960, 1.15, "normal", { look: -0.5 })}<HFig x={720} y={1040} s={1.15} {...ZE} t={t} face="normal" talk={1} look={0.5} seed={80} /></HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.2} text="“BİZ ŞAHİT OLURUZ.”" y={820} size={100} accent={ZE.robe} /> },
  { c: "Ve imam efendi de bir kâğıt yazdı", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 560]}><Sicil t={t} k={ramp(t, a, b)} /></HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="“NAMUSLU VE ÇALIŞKANDIR.”" y={820} size={90} /> },

  // ── MAHKEME ──
  { c: "Ve şimdi buradasın", sfx: "drone", tone: "cool", r: (t, a, b) => court(t, a, b, [1.3, 1.1], [960, 560]) },
  { c: "Kadı efendi sana bakıyor", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.6, 2.9]} c0={[1580, 520]}>{mah(t)}{kadi(t, 0, -0.9)}</HCam> },
  { c: "Sesin titredi", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[3, 3.3]} c0={[520, 540]}>{mah(t)}{ays(t, 520, 1.15, "worried", { look: 0.7, talk: 1 })}</HCam> },
  { c: "Efendim, dedin", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[620, 560]}>{mah(t)}{ays(t, 520, 1.15, "normal", { look: 0.7, talk: 1 })}{hus(t, 820, 1.2, 0, "normal", -0.4)}</HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“MEHRİMİN GERİ KALANI ÖDENMEDİ.”" y={820} size={80} /> },
  { c: "Bu evde benim de payım var", tone: "gold", r: (t, a, b) => again("Sesin titredi", t, a, b, 1),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.1} text="“BU ÇOCUKLAR BENİM ÇOCUKLARIM.”" y={820} size={84} accent={AY.robe} /> },
  { c: "Şahitlerim burada", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[500, 620]}>{mah(t)}{ays(t, 560, 1.15, "normal", { look: -0.6 })}<HFig x={300} y={Y} s={1.1} {...ZE} t={t} seed={80} look={0.4} /><HFig x={150} y={Y} s={1.1} {...FA} old t={t} seed={81} look={0.4} /></HCam> },
  { c: "Zeliha Hanım ve fırıncının annesi öne", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[900, 620]}>{mah(t)}{kadi(t, 0, -0.7)}<HFig x={lerp(300, 760, ramp(t, a, b))} y={Y} s={1.1} {...ZE} t={t} seed={80} look={0.5} talk={1} /><HFig x={lerp(150, 600, ramp(t, a, b))} y={Y} s={1.1} {...FA} old t={t} seed={81} look={0.5} /></HCam> },
  { c: "Katip her kelimeyi yazdı", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 560]}><Sicil t={t} k={ramp(t, a, b)} /></HCam> },
  { c: "Kadı efendi uzun bir süre sustu", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.8, 3.2]} c0={[1580, 520]}>{mah(t)}{kadi(t, 0, -0.3, "closed")}</HCam> },
  { c: "Sonra kararını söyledi", sfx: "knock", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[1580, 540]}>{mah(t)}{kadi(t, 1, -0.8)}</HCam> },
  { c: "Mehrin terekeden ödenecekti", sfx: "ding", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><Paper />{["MEHİR ✓", "EVDEKİ PAY ✓", "VASİ: AYŞE ✓"].map((l, i) => <Disc key={i} x={340 + i * 620} y={480} r={200} k={ramp(t, a + 0.2 + i * 1.3, a + 0.5 + i * 1.3)} c={[H.red, H.ochre, AY.robe][i]} label={l} />)}</HCam> },
  { c: "Hüseyin kapıyı çarparak çıktı", sfx: "knock", tone: "cool", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[700, 600]}>{mah(t)}<g transform={`translate(${lerp(0, -700, ramp(t, a, a + 1.5))},0)`}>{hus(t, 820, 1.2, 0, "normal", -0.9)}</g>{ays(t, 520, 1.15, "worried")}</HCam> },
  { c: "Sen ise yere oturdun", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.6, 3]} c0={[520, 800]}>{mah(t)}{ays(t, 520, 1.15, "sad", { sit: true, y: 1060, bow: 0.4 })}</HCam>,
    html: (t, a, b) => <Txt t={t} at={b - 1.3} text="VE ANCAK O ZAMAN AĞLAYABİLDİN." y={820} size={76} /> },

  // ── BELGE ──
  { c: "Ayşe'nin hikâyesi hayal", sfx: "ding", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 560]}><Sicil t={t} k={1} /></HCam>,
    html: (t, a) => <Txt t={t} at={a + 0.3} text="HİKÂYE HAYAL · MAHKEME GERÇEK" y={70} size={64} /> },
  { c: "Osmanlı'nın kadı sicillerinde", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><Paper /></HCam>,
    html: (t, a) => <Belge t={t} at={a + 0.3} date="KADI SİCİLLERİ · 16.–19. YÜZYIL" src="İstanbul Kadı Sicilleri · dul kadınların mehir, miras ve vasilik davaları">Dul kadınlar mehirlerini, miraslarını ve çocuklarının vasiliğini istemek için kadının önüne çıktı.</Belge> },
  { c: "Ve bunların arasında", r: (t, a, b) => again("Katip her kelimeyi yazdı", t, a, b, 0) },
  { c: "kendi çocuklarının vasisi", r: (t, a, b) => again("Zeliha Hanım ve fırıncının annesi öne", t, a, b, 1) },
  { c: "Kimi kazandı, kimi kaybetti", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.9]} c0={[960, 560]}><Sicil t={t} k={1} /></HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.5} text="AMA GİTTİLER." y={820} size={120} accent={H.gold} /> },

  // ── DENİZ ──
  { c: "Çeşme'de yanan donanmadan sağ çıkanlar", tone: "night", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.1]} c0={[960, 560]}><CesmeGece t={t} fire={0.4} /></HCam> },
  { c: "Onlardan biri, Cezayirli Hasan", sfx: "ding", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><Paper /></HCam>,
    html: (t, a) => <NameCard t={t} at={a + 0.3} name="CEZAYİRLİ GAZİ HASAN PAŞA" sub="Çeşme'den sağ çıktı · sonra Kaptan-ı Derya" c={H.cobalt} /> },
  { c: "Ve tersane yeniden kuruldu", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.2, 1.05]} c0={[960, 600]}><Tersane t={t} crowd={1} /></HCam> },
  { c: "Kasımpaşa'da yeni gemiler yapıldı", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[980, 640]}><Tersane t={t} crowd={1} /></HCam> },
  { c: "Ve sen her sabah, o gemilerin direklerine", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 640]}><Tersane t={t} />{ays(t, 960, 1.2, "sad", { y: 1040, look: 0.3 })}</HCam> },
  { c: "Ama her birinde, bir kadının", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 560]}><Yelkenli t={t} px={lerp(200, -200, ramp(t, a, b))} /></HCam> },

  // ── KADER ──
  { c: "Yıllar geçti", sfx: "ding", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 560]}><Mendil t={t} k={1} /></HCam>,
    html: (t, a) => <Tag t={t} at={a + 0.3} text="YILLAR SONRA" c={H.cobalt} /> },
  { c: "Sonra başka kadınlara da öğrettin", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 680]}>{house(t)}{ays(t, 960, 1.15, "smile", { sit: true, y: 1040, talk: 1 })}{Array.from({ length: 4 }, (_, i) => <HFig key={i} x={[480, 700, 1220, 1440][i]} y={1040} s={1.0} kind="kalfa" robe={ROBES[(i + 2) % 8]} robe2="#E9DCC2" sit t={t} face="normal" look={i < 2 ? 0.5 : -0.5} seed={i + 90} />)}</HCam> },
  { c: "Kimse onlara bir şey vermedi", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 720]}>{house(t)}{ays(t, 960, 1.15, "smile", { sit: true, y: 1040 })}{Array.from({ length: 4 }, (_, i) => <HFig key={i} x={[480, 700, 1220, 1440][i]} y={1040} s={1.0} kind="kalfa" robe={ROBES[(i + 2) % 8]} robe2="#E9DCC2" sit t={t} face="smile" look={i < 2 ? 0.5 : -0.5} seed={i + 90} />)}</HCam>,
    html: (t, a, b) => <Txt t={t} at={b - 1.4} text="BİRBİRLERİNE VERDİLER." y={820} size={96} accent={H.gold} /> },
  { c: "Ali büyüdü", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 640]}><Tersane t={t} /><HFig x={960} y={1040} s={1.25} {...AL} t={t} face="smile" seed={14} /></HCam>,
    html: (t, a) => <Tag t={t} at={a + 0.6} text="TERSANEDE ÇIRAK" c={AL.robe} /> },
  { c: "Emine evlendi", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 640]}><Room t={t} /><HFig x={960} y={1040} s={1.3} kind="girl" robe={H.red} robe2="#F5E8CC" t={t} face="smile" seed={15} /></HCam> },
  { c: "Ve nikâh günü, mehrinin miktarı", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 560]}><MehirKese t={t} a={a} /></HCam> },
  { c: "Sen kızının kulağına eğildin", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[960, 560]}><Room t={t} />{ays(t, 860, 1.15, "smile", { old: true, talk: 1, look: 0.6, bow: 0.2 })}<HFig x={1060} y={Y} s={1.2} kind="girl" robe={H.red} robe2="#F5E8CC" t={t} face="smile" look={-0.4} seed={15} /></HCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“BU PARA SENİN KIZIM. UNUTMA.”" y={820} size={84} accent={H.gold} /> },
  { c: "Bir gün lazım olursa, kadının önüne", tone: "gold", r: (t, a, b) => again("Sen kızının kulağına eğildin", t, a, b, 1),
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="“KADININ ÖNÜNE ÇIK VE İSTE.”" y={820} size={88} accent={AY.robe} /> },

  // ── KAPANIŞ ──
  { c: "Peki sen olsaydın", tone: "warm", r: (t, a, b) => court(t, a, b, [1.2, 1.35], [960, 600], "normal") },
  { c: "Mahkemeye çıkıp hakkını ister miydin", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.06]}><Paper />{["MAHKEMEYE ÇIKARDIM ⚖", "BABA EVİNE DÖNERDİM 🏠"].map((l, i) => <Disc key={i} x={600 + i * 720} y={480} r={240} k={ramp(t, a + 0.3 + i * 1.6, a + 0.6 + i * 1.6)} c={[AY.robe, HU.robe][i]} label={l} />)}</HCam> },
  { c: "Yorumlara yaz", tone: "warm", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 600]}><KapiOnu t={t} bayram={1} />{ays(t, 960, 1.2, "smile")}</HCam> },
  { c: "Osmanlı'daki kadınların hikâyeleri", tone: "gold", r: (t, a, b) => <HCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 520]}><Tersane t={t} dusk={1} /></HCam>,
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
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K3R_12_SECONDS));
  return raw;
})();

const VOL: Record<string, number> = { whoosh: 0.07, drone: 0.14, boom: 0.15, ding: 0.14, knock: 0.1, pop: 0.12, splash: 0.08 };
export const K3RVideo12: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K3R_12_SECONDS;
  const cut = 1 - ramp(t, s.from, s.from + 0.16);
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: ramp(t, 0, 0.5) * (1 - ramp(t, END - 1.2, END)) }}>
        <HFrame>
          <LiveCam t={t} a={s.from}>{s.r(t, s.from, s.to)}</LiveCam>
          {s.fore && <Fore t={t} a={s.from} kind={s.fore} />}
          <Atmos t={t} tone={s.tone ?? "warm"} rays={s.tone === "night" ? 0.5 : 1} seed={n} />
          <Sweep t={t} a={s.from} />
          {cut > 0 && <rect width={1920} height={1080} fill="#FFF8E6" opacity={cut * 0.3} />}
        </HFrame>
        {s.html?.(t, s.from, s.to)}
      </AbsoluteFill>
      <Audio src={staticFile("audio/k3r-12.wav")} />
      {TIMED.map((x, i) => i > 0 && !(x.from > END - 19 && x.sfx && x.sfx !== "whoosh") && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.08) * fps))} durationInFrames={Math.round(2.2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.from > END - 19 ? 0.05 : VOL[x.sfx ?? "whoosh"] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const _unused = { HTiny, Akce, Sofra, Fore, Bohca };

const AG = [[1.22, -90, -40], [1.3, 110, 30], [1.18, 0, 60]];
function again(c: string, t: number, a: number, b: number, q: number) {
  const s0 = SHOTS.find((x) => x.c === c);
  if (!s0) return null;
  const [z, dx, dy] = AG[q % AG.length];
  return <g transform={`translate(${960 + dx} ${540 + dy}) scale(${z}) translate(-960 -540)`}>{s0.r(t, a, b)}</g>;
}

// Disk/kart sahnesini kırpmadan, ilk başladığı andan devam ettirir (again() zoom'u kenar diskleri kesiyordu).
function keep(c: string, t: number, b: number) {
  const s0 = TIMED.find((x) => x.c === c);
  return s0 ? s0.r(t, s0.from, b) : null;
}
