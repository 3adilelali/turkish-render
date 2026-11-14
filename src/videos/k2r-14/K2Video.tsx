import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k2r-14-words.json";
import { makeCue, ramp as rampRaw } from "../../lib/cues";
import { Bazaar, Brow, CarP, Eyes, Glass, HAMAL, HanDoor, HERO, Kitchen, Living, Minibus, MOM, Mouth, Outfit, P, PhoneP, T, TCam, TFig, TFrame, TMini, TPose, MINI_COLS, lerp, runPose, toonWalk } from "../../components/Toon";
import { ExamHall, Kahvehane, Kartvizit, Vapur } from "../../components/Toon2";
import { Buzdolabi, EskiAraba, Tuy } from "../../components/Yuk";
import { Abone, Kural, Landing, Simit, Tag, Txt } from "../../components/K2Kit";
import { Apartman } from "../../components/Dusunce";
import { Isil } from "../../components/Iyi";
import { Atmos, Fore, LiveCam, Sweep, Tone } from "../../components/Live";
import { Bordur, Carpan, GuresMasa, HalatEl, Hesap, Ilan, Kavanoz, Koli, Mahmutpasa, Nokia, Otobus, Rihtim, SirtYuk, Telefonlar, YokusCadde, YumurtaKoli } from "../../components/Guc";
import { BalikEkmek, Basamak, Camasir, CayMasa, Guvercin, HesapMak, Izlenme, KirikTel, KirikYatak, Lif, Masrapa, Nakit, Newton, Omurga, Optik, Secim, Silu, Terazi, stairY } from "../../components/GucEk";

// Kanal 2 · k2r-14 · "Ya Gücün Her Gün 2 Katına Çıksaydı? 30. Gün Vapuru Durdurdun" — TAMAMEN MOTOR (Algoritma v1, film 15–22 dk).
// Sen (isimsiz, 19, Fatih, hamal). Annen. Kemal Abi (50, hamal). Nermin Teyze. Kasap Sedat. Tekin Bey (müteahhit). Çaycı Rıza. Hakem.
// Görsel imza: elin üstünde turkuaz çarpan (Carpan). Yeni kit: components/Guc.tsx + GucEk.tsx.

const ALT: Record<string, string[]> = {};
const ramp = (t: number, a: number, b: number) => (b - a > 0.01 ? rampRaw(t, a, b) : t >= b ? 1 : 0);
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const VAR: [RegExp, string][] = [[/â/g, "a"], [/î/g, "i"], [/û/g, "u"]];
const variants = (p: string) => { const out = [p]; for (const [re, to] of VAR) for (const v of [...out]) { const n = v.replace(re, to); if (n !== v) out.push(n); } return out; };
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K2R_14_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone; fore?: "column" | "curtain" | "lamp" | "rail" };

const G = 1040;
const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#1FC8B4", top2: "#159A8B" };
const ANNE: Outfit = { ...MOM, top: "#7A5A8A", top2: "#5E4470", hairColor: "#D9C9E4" };
const KEMAL: Outfit = { ...HAMAL, hairColor: "#4A4A4A" };
const HAM2: Outfit = { ...HAMAL, top: "#5C6B7A", top2: "#46525E", mustache: false };
const HAM3: Outfit = { ...HAMAL, top: "#8A3A2A", top2: "#6A2A1E", hair: "none" };
const NERMIN: Outfit = { top: "#3FAE6A", top2: "#2E8A52", kind: "sweater", hair: "scarf", hairColor: "#F6C445", glasses: true };
const SEDAT: Outfit = { top: "#F4F4F2", top2: "#D9DCDF", kind: "vest", inner: "#B23A3F", mustache: true };
const TEKIN: Outfit = { top: "#2A2E36", top2: "#1C1F26", kind: "suit", inner: "#F4F4F2", glasses: true };
const RIZA: Outfit = { top: "#B23A3F", top2: "#8A2A2F", kind: "vest", inner: "#F4F4F2", mustache: true, hair: "white" };
const HAKEM: Outfit = { top: "#F6C445", top2: "#D9A52A", kind: "jersey", hair: "cap", hairColor: "#1C1C1C" };
const TEYZE: Outfit = { top: "#E86A92", top2: "#C24F75", kind: "coat", hair: "scarf", hairColor: "#7E5BD6", glasses: true };
const SAHIP: Outfit = { top: "#5C6B7A", top2: "#46525E", kind: "sweater", mustache: true };
const NAKLI: Outfit = { top: "#3A6EA5", top2: "#2A5280", kind: "vest", inner: "#F4F4F2", hair: "cap", hairColor: "#3A3A3A" };
const GOZET: Outfit = { top: "#6A5A4A", top2: "#4E4236", kind: "coat", glasses: true, hair: "white" };
const SOFOR: Outfit = { top: "#3A6EA5", top2: "#2A5280", kind: "sweater", mustache: true };

type Face = { pose?: TPose; eyes?: Eyes; brow?: Brow; mouth?: Mouth; look?: number; lookY?: number; talk?: boolean; sweat?: boolean; dir?: 1 | -1; holdR?: React.ReactNode; holdL?: React.ReactNode };
const fig = (o: Outfit) => (t: number, x: number, s = 1, f: Face = {}, y = G) => <TFig x={x} y={y} s={s} o={o} t={t} rim={0.4} {...f} />;
const sen = fig(SEN), anne = fig(ANNE), kemal = fig(KEMAL), nermin = fig(NERMIN), sedat = fig(SEDAT), tekin = fig(TEKIN), riza = fig(RIZA), hakem = fig(HAKEM), teyze = fig(TEYZE), sahip = fig(SAHIP), nakli = fig(NAKLI), gozet = fig(GOZET), sofor = fig(SOFOR);
const HY = (s: number, y = G) => y - 470 * s;
const flat = () => G;
const walk = (t: number, a: number, b: number, o: Outfit, x0: number, x1: number, s = 1, f: Face = {}, yf: (x: number) => number = flat, load = 0) => {
  const w = toonWalk(t, a, b, x0, x1, s);
  const y = yf(w.x);
  return <>{load > 0 && <SirtYuk x={w.x} y={y} s={s} n={load} dir={w.dir} t={t} wob={0.4} />}<TFig x={w.x} y={y} s={s} o={o} t={t} dir={w.dir} walk={w.walk} rim={0.4} pose={load > 0 ? P.hold : undefined} {...f} /></>;
};
const run = (t: number, a: number, b: number, o: Outfit, x0: number, x1: number, s = 1, f: Face = {}, yf: (x: number) => number = flat, load = 0) => {
  const x = lerp(x0, x1, ramp(t, a, b)); const y = yf(x); const d: 1 | -1 = x1 > x0 ? 1 : -1;
  return <>{load > 0 && <SirtYuk x={x} y={y} s={s} n={load} dir={d} t={t} wob={0.6} />}<TFig x={x} y={y} s={s} o={o} t={t} pose={runPose((t - a) * 9)} dir={d} rim={0.4} {...f} /></>;
};
// sırtında yük ile duran figür
const yuklu = (t: number, o: Outfit, x: number, s: number, n: number, f: Face = {}, y = G) => <><SirtYuk x={x} y={y} s={s} n={n} dir={f.dir ?? 1} t={t} />{fig(o)(t, x, s, { pose: P.hold, ...f }, y)}</>;
// başının üstünde bir şey kaldıran figür
const kaldir = (t: number, o: Outfit, x: number, s: number, node: React.ReactNode, up = 1, f: Face = {}, y = G) => <>{fig(o)(t, x, s, { pose: P.cheer, mouth: "grin", ...f }, y)}<g transform={`translate(${x},${HY(s, y) - 10 - (1 - up) * -200})`}>{node}</g></>;
const mah = (x: number) => 1000 - x * 0.16;
const pazar = (t: number, px = 0, crowd = 1) => <Bazaar t={t} px={px} crowd={crowd} />;
const ev = (t: number, night = false) => <Living t={t} night={night} />;
const mutfak = (t: number) => <Kitchen t={t} />;
const kahve = (t: number) => <Kahvehane t={t} />;
const rih = (t: number, o: { drift?: number; rope?: number; tense?: number; dusk?: number; crowd?: number; ropeTo?: [number, number]; panic?: number } = {}) => <Rihtim t={t} {...o} />;
const cp = (n: string, sub?: string, down?: boolean, bg?: string): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><Carpan t={t} n={n} k={ramp(t, a + 0.1, a + 0.5)} sub={sub} down={down} bg={bg} /></TCam>;
const q = (text: string, size = 80, k = 0.3, y = 820): R => (t, a, b) => <Txt t={t} at={a + (b - a) * k} text={text} y={y} size={size} />;
const tg = (text: string, c: string = T.hero, at = 0.5, y?: number): R => (t, a) => <Tag t={t} at={a + at} text={text} c={c} y={y} />;
const big = (text: string, color = "#F6D08A", size = 90, y = 80): R => (t, a) => <Txt t={t} at={a + 0.3} text={text} y={y} size={size} color={color} />;
const kart = (bg: string): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill={bg} /></TCam>;
const yatan = (t: number, x: number, y: number, f: Face = {}) => <g transform={`rotate(-80 ${x} ${y})`}>{sen(t, x, 0.95, { eyes: "open", mouth: "flat", ...f }, y)}</g>;
const kavMutfak = (t: number, k: { lid?: number; juice?: number; turn?: number } = {}) => <>{mutfak(t)}<Kavanoz x={960} y={760} s={1.6} t={t} {...k} /></>;
const yolcular = (t: number, x0: number, n: number, f: Face = {}) => <>{Array.from({ length: n }, (_, i) => fig([NAKLI, TEYZE, SAHIP, NERMIN][i % 4])(t, x0 + i * 120, 0.8, { pose: P.reach, sweat: true, ...f }))}</>;

const SHOTS: Sh[] = [
  // ── KANCA ──
  { c: "Eminönü. Akşam altı", sfx: "drone", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.0, 1.12]} c0={[960, 540]}>{rih(t, { drift: 0.2, panic: 0.6 })}</TCam>,
    html: big("EMİNÖNÜ · 18:00 · 30. GÜN") },
  { c: "Bir vapurun halatı kopmuş", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[1300, 600]}>{rih(t, { drift: 0.2, panic: 1 })}</TCam>,
    html: tg("HALAT KOPTU · MOTOR SUSTU", T.red) },
  { c: "Ve içinde üç yüz yolcuyla", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[1300, 560]} c1={[1450, 520]}>{rih(t, { drift: 0.3 - ramp(t, a, b) * 0.3, panic: 1 })}</TCam>,
    html: tg("300 YOLCU", T.red, 0.5) },
  { c: "Sen halatın ucunu yakalıyorsun", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}><HalatEl t={t} grip={0.4} /></TCam> },
  { c: "Elinin üstünde turkuaz bir sayı", sfx: "ding", r: cp("×1.073.741.824", "BİR MİLYAR KAT") },
  { c: "Bugün, sıradan bir insandan", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[700, 700]}>{rih(t, { drift: 0.15, rope: 1, ropeTo: [640, 740], panic: 0.6 })}{sen(t, 580, 0.8, { pose: P.reach, mouth: "flat", brow: "worried" }, 900)}</TCam>,
    html: q("TEK ELİNLE KALDIRABİLİRSİN", 80, 0.5) },
  { c: "Ve kayıyorsun", sfx: "whoosh", tone: "gold", r: (t, a, b) => { const x = lerp(520, 680, ramp(t, a, b)); return <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[700, 700]} shake={0.4}>{rih(t, { drift: 0.15, rope: 1, tense: 1, ropeTo: [x + 60, 740], panic: 1 })}{sen(t, x, 0.8, { pose: P.reach, mouth: "open", eyes: "wide", brow: "worried", sweat: true }, 900)}</TCam>; } },
  { c: "Ayakkabıların ıslak taşların", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]}><Bordur t={t} push={-ramp(t, a, b) * 18} /></TCam>,
    html: tg("ISLAK TAŞ = SABUN", T.blue) },
  { c: "Vapur seni de peşinden", tone: "gold", r: (t, a, b) => { const x = lerp(600, 760, ramp(t, a, b)); return <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 600]}>{rih(t, { drift: 0.1 - ramp(t, a, b) * 0.1, rope: 1, tense: 1, ropeTo: [x + 60, 740], panic: 1 })}{sen(t, x, 0.8, { pose: P.reach, mouth: "open", sweat: true }, 900)}</TCam>; } },
  { c: "Kalabalık bağırıyor", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[1300, 940]}>{rih(t, { drift: 0.05, panic: 1 })}</TCam>,
    html: q("“TUT ŞUNU!”", 96, 0.2) },
  { c: "Çünkü sorun, hiçbir zaman", sfx: "drone", tone: "night", r: kart("#0E1A2E"), html: (t, a) => <Txt t={t} at={a + 0.3} text="SORUN HİÇBİR ZAMAN GÜÇ DEĞİLDİ." y={440} size={90} color="#2EE6D0" /> },
  { c: "Ama dur. Baştan anlatayım", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.1]}>{kavMutfak(t)}</TCam>,
    html: big("30 GÜN ÖNCE", "#FFFFFF", 110) },

  // ── GÜN SIFIR ──
  { c: "On dokuz yaşındasın", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[900, 600]}><Apartman t={t} k={0} />{sen(t, 900, 1.05, { pose: P.wave, mouth: "smile" })}</TCam>,
    html: tg("SEN · 19", SEN.top) },
  { c: "Fatih'te, asansörsüz", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 600]}>{ev(t)}{anne(t, 820, 1, { mouth: "smile", look: 0.5 })}{sen(t, 1120, 1, { mouth: "smile", look: -0.5 })}</TCam>,
    html: tg("FATİH · 4. KAT · ASANSÖR YOK", T.blue) },
  { c: "Bu sene üniversite sınavına", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.25]} c0={[960, 560]}><ExamHall t={t} crowd={1} /></TCam>,
    html: big("SINAV · 2. KEZ") },
  { c: "Dershane parası yetmiyor", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]}><Hesap t={t} a={a} rows={[["DERSHANE · 1 SENE", "100.000 ₺"], ["CEPTE", "4.200 ₺"]]} red={1} /></TCam> },
  { c: "Annen, düğününden kalan", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.5]} c0={[960, HY(1) + 200]}>{mutfak(t)}{anne(t, 960, 1, { pose: P.hold, mouth: "flat", brow: "worried", lookY: 0.4, holdR: <g><circle r={22} fill="none" stroke="#F6C445" strokeWidth={8} /><circle cx={30} r={22} fill="none" stroke="#F6C445" strokeWidth={8} /></g> })}</TCam>,
    html: tg("2 BİLEZİK", T.yellow) },
  { c: "Sen buna izin vermemek için", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 600]}>{pazar(t, (t - a) * 30)}{walk(t, a, b, SEN, 500, 1300, 1, { mouth: "flat", sweat: true }, flat, 1)}</TCam>,
    html: tg("MAHMUTPAŞA · HAMAL", T.orange) },
  { c: "Ve bir sorun var", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.15, 1.25]} c0={[960, 620]}>{pazar(t, 40)}{walk(t, a, b, HAM2, 1700, 1100, 0.95, { mouth: "smile" }, flat, 3)}{walk(t, a, b, HAM3, 300, 900, 0.95, { mouth: "flat" }, flat, 4)}{sen(t, 1450, 1, { pose: P.hold, mouth: "open", sweat: true, brow: "worried", holdR: <Koli x={0} y={-30} s={0.5} /> })}</TCam>,
    html: q("EN ZAYIF HAMAL: SEN", 80, 0.4) },
  { c: "Kemal Abi her sabah", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[960, HY(1) + 160]}>{pazar(t, 60)}{kemal(t, 960, 1, { mouth: "grin", eyes: "happy", talk: true })}</TCam>,
    html: tg("KEMAL ABİ · 50", KEMAL.top) },
  { c: "Elli yaşında. Kolları", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 560]}>{pazar(t, 60)}{yuklu(t, KEMAL, 960, 1.05, 4, { mouth: "smile", holdR: <Glass s={1.4} /> })}</TCam>,
    html: tg("SIRTINDA 100 KİLO + ÇAY", T.yellow, 1.2) },
  { c: "Oğlum, diyor", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[960, HY(1) + 150]}>{pazar(t, 60)}{kemal(t, 960, 1, { pose: P.point, mouth: "open", talk: true, look: -0.4 })}</TCam>,
    html: q("“BU İŞ GÜÇ İŞİ DEĞİL. DENGE İŞİ.”", 84) },
  { c: "Bir koli yumurtayı kırmadan", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]}><rect width={1920} height={1080} fill="#8A6A4A" /><YumurtaKoli x={960} y={560} s={1.3} t={t} /></TCam>,
    html: q("“YUMURTAYI KIRAN HAMAL DEĞİLDİR.”", 80, 0.2, 960) },
  { c: "Sen o sabah iki yumurta kırdın", sfx: "knock", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[700, 450]}><rect width={1920} height={1080} fill="#8A6A4A" /><YumurtaKoli x={960} y={560} s={1.3} t={t} broken={t > a + 0.6 ? 2 : 0} /></TCam> },
  { c: "Kemal Abi yumurtaların parasını", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]}><Hesap t={t} a={a} rows={[["YEVMİYE", "600 ₺"], ["2 YUMURTA", "-12 ₺"], ["ELE GEÇEN", "588 ₺"]]} red={1} /></TCam> },
  { c: "Akşam eve geldin", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 600]}>{mutfak(t)}{anne(t, 820, 1, { pose: P.hand, mouth: "smile", talk: true, look: 0.5 })}{walk(t, a, b, SEN, 1500, 1150, 1, { mouth: "flat" })}</TCam>,
    html: q("“ŞUNU BİR AÇIVER OĞLUM.”", 88, 0.5) },
  { c: "Çevirdin. Çevirdin", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 560]} shake={0.3}>{kavMutfak(t, { turn: Math.sin(t * 14) * 0.15 })}</TCam> },
  { c: "Yüzün kıpkırmızı oldu", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.8, 3.0]} c0={[960, HY(1) + 130]}>{mutfak(t)}{sen(t, 960, 1, { pose: P.hold, eyes: "squint", mouth: "open", sweat: true, brow: "angry" })}<rect x={900} y={HY(1) + 60} width={120} height={100} rx={50} fill={T.red} opacity={0.25} /></TCam>,
    html: tg("KAPAK: KIPIRDAMADI", T.red) },
  { c: "Annen kavanozu elinden aldı", sfx: "knock", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 600]}>{mutfak(t)}{anne(t, 860, 1, { pose: P.hold, mouth: "smile", lookY: 0.4 })}<Kavanoz x={1020} y={800} s={0.7} t={t} lid={t > a + 1.4 ? 0.03 : 0} />{sen(t, 1300, 1, { mouth: "o", eyes: "wide", look: -0.6 })}</TCam> },
  { c: "Açtı. Aferin bana", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[860, HY(1) + 150]}>{mutfak(t)}{anne(t, 860, 1, { pose: P.hips, mouth: "grin", eyes: "happy", talk: true })}</TCam>,
    html: q("“AFERİN BANA.”", 100) },
  { c: "O gece yatağına uzandın", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 900]}>{ev(t, true)}{yatan(t, 960, 1000, { lookY: -0.6 })}</TCam>,
    html: q("“KEŞKE BİRAZ DAHA GÜÇLÜ OLSAYDIM.”", 80, 0.4) },
  { c: "Meğer evrenin kulakları", sfx: "ding", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.15]}><rect width={1920} height={1080} fill="#0B1220" />{Array.from({ length: 60 }, (_, i) => <circle key={i} cx={(i * 211) % 1920} cy={(i * 137) % 1080} r={2 + (i % 3)} fill="#FFFFFF" opacity={0.4 + 0.4 * Math.sin(t * 3 + i)} />)}<Isil x={960} y={540} t={t} r={160} k={ramp(t, a + 0.5, b)} /></TCam> },

  // ── GÜN BİR ──
  { c: "Sabah alarm çaldı", sfx: "buzz", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 860]}>{ev(t)}{yatan(t, 960, 1000, { eyes: t < a + 0.8 ? "closed" : "open" })}<g transform="translate(1260,960)"><PhoneP s={2} ring={1} /></g></TCam> },
  { c: "Telefona uzandın", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><Carpan t={t} n="×2" k={ramp(t, a + 0.6, a + 1.6)} bg="#E9D9C0" /></TCam> },
  { c: "İnce, turkuaz, ışıklı", sfx: "ding", r: cp("×2", "ÇARPI İKİ") },
  { c: "Elini yıkadın. Gitmedi", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.15]}><Carpan t={t} n="×2" bg="#9FC4D0" shake={0.3} /></TCam>,
    html: (t, a, b) => <><Tag t={t} at={a + 0.4} text="SU · GİTMEDİ" c={T.blue} /><Tag t={t} at={a + (b - a) * 0.5} text="SABUN · GİTMEDİ" c={T.pink} y={140} /></> },
  { c: "Annene gösterdin", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.9, 2.1]} c0={[960, HY(1) + 220]}>{mutfak(t)}{sen(t, 1080, 1, { pose: P.hand, mouth: "open", look: -0.5 })}{anne(t, 840, 1, { mouth: "flat", lookY: 0.3, look: 0.5, eyes: "squint" })}</TCam> },
  { c: "Bir şey yok oğlum", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[840, HY(1) + 150]}>{mutfak(t)}{anne(t, 840, 1, { pose: P.shrug, mouth: "smile", talk: true, look: 0.5 })}</TCam>,
    html: q("“SEN YİNE GECE YARISINA KADAR TELEFONA BAKTIN.”", 64, 0.35) },
  { c: "Demek ki bu sayıyı", r: cp("×2", "SADECE SEN GÖRÜYORSUN") },
  { c: "Mutfakta dünkü turşu", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.5]} c0={[960, 700]}>{kavMutfak(t)}</TCam> },
  { c: "Aldın. Hafifçe çevirdin", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.9]} c0={[960, 640]}>{kavMutfak(t, { turn: ramp(t, a + 0.6, b) * 0.2 })}</TCam> },
  { c: "Kapak mutfağın öbür ucuna", sfx: "splash", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.15, 1.05]} c0={[960, 560]} shake={0.6}>{kavMutfak(t, { lid: ramp(t, a, a + 0.9), juice: ramp(t, a + 0.1, a + 1.2) })}</TCam>,
    html: tg("TAVANA KADAR", T.green, 0.9) },
  { c: "Annen elinde kaşıkla", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[960, HY(1) + 160]}>{mutfak(t)}{anne(t, 960, 1, { pose: P.shock, mouth: "o", eyes: "wide", holdR: <rect x={-4} y={-50} width={8} height={60} fill="#B9C2CA" /> })}{Array.from({ length: 8 }, (_, i) => <circle key={i} cx={760 + i * 60} cy={lerp(200, 900, ramp(t, a + i * 0.15, a + 1 + i * 0.15))} r={8} fill="#C9D86A" />)}</TCam> },
  { c: "Maşallah, dedi", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.3, 2.5]} c0={[960, HY(1) + 160]}>{mutfak(t)}{anne(t, 960, 1, { pose: P.hips, mouth: "smile", brow: "angry", talk: true })}</TCam>,
    html: q("“AKŞAMA TAVANI DA SEN SİLECEKSİN.”", 80, 0.3) },

  // ── KURAL ──
  { c: "O gün anladın", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><Kural t={t} a={a + 0.2} n="1" line="Gücün her sabah ikiye katlanır." /></TCam> },
  { c: "Sıradan bir insan rahatça", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]}><Hesap t={t} a={a} rows={[["SIRADAN İNSAN", "50 KG"], ["SEN · 1. GÜN", "100 KG"]]} red={1} step={1.4} /></TCam> },
  { c: "Mahmutpaşa'ya gittin", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 600]}>{pazar(t, (t - a) * 30)}{walk(t, a, b, SEN, 600, 1200, 1, { mouth: "grin" }, flat, 2)}</TCam> },
  { c: "Sonra üç. Sonra Kemal", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 520]}>{pazar(t, 80)}{yuklu(t, SEN, 960, 1, Math.min(5, 3 + Math.floor((t - a) / 1.2)), { mouth: "grin" })}</TCam>,
    html: tg("2 → 3 → 5 KOLİ", T.orange) },
  { c: "Hamallar bir sana baktı", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 600]}>{pazar(t, 80)}{fig(HAM2)(t, 600, 0.95, { mouth: "o", eyes: "wide", look: 0.6 })}{fig(HAM3)(t, 1350, 0.95, { mouth: "o", eyes: "wide", look: -0.6 })}{kemal(t, 1600, 1, { pose: P.hold, mouth: "flat", lookY: 0.4, holdR: <Glass s={1.4} /> })}{yuklu(t, SEN, 960, 1, 5, { mouth: "smile" })}</TCam> },
  { c: "Ne yedin sen bu sabah", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[960, HY(1) + 150]}>{pazar(t, 80)}{kemal(t, 960, 1, { mouth: "open", eyes: "squint", talk: true, look: -0.5 })}</TCam>,
    html: q("“NE YEDİN SEN BU SABAH?”", 90) },
  { c: "Turşu, dedin", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[960, HY(1) + 150]}>{pazar(t, 80)}{sen(t, 960, 1, { mouth: "grin", eyes: "happy", talk: true })}</TCam>,
    html: q("“TURŞU.”", 120, 0.2) },

  // ── GÜN İKİ, ÜÇ ──
  { c: "Ertesi sabah elinde yeni", sfx: "ding", r: cp("×4", "200 KG") },
  { c: "Bu sefer dikkatliydin", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 620]}><Landing t={t} open={ramp(t, a + 0.5, b) * 0.3} plate="4" />{sen(t, 800, 1, { pose: P.reach, mouth: "flat", eyes: "squint", brow: "worried" })}</TCam> },
  { c: "Kapının kolu elinde kaldı", sfx: "knock", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[900, HY(1) + 200]}><Landing t={t} open={0.05} plate="4" />{sen(t, 800, 1, { pose: P.hand, mouth: "o", eyes: "wide", lookY: 0.2, holdR: <g><rect x={-30} y={-10} width={60} height={18} rx={8} fill="#C9A66B" stroke="#1A1A22" strokeWidth={3} /><circle cx={-30} r={14} fill="#B8955A" /></g> })}</TCam>,
    html: q("ÇOK, ÇOK YAVAŞ.", 90, 0.5) },
  { c: "Üçüncü gün, çarpı sekiz", sfx: "ding", r: cp("×8", "400 KG") },
  { c: "Alt kattaki Nermin Teyze", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 600]}><Basamak t={t} /><g transform="translate(460,880)"><Buzdolabi x={0} y={0} s={0.9} /></g>{nakli(t, 330, 0.85, { pose: P.reach, sweat: true, mouth: "open" }, stairY(330))}{nakli(t, 640, 0.85, { pose: P.reach, sweat: true, mouth: "frown" }, stairY(640))}{nermin(t, 1300, 0.85, { pose: P.hips, mouth: "open", talk: true, look: -0.5 }, stairY(1300))}</TCam>,
    html: tg("NERMİN TEYZE · YENİ BUZDOLABI", NERMIN.top) },
  { c: "Biri merdivende oturmuş", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[900, 760]}><Basamak t={t} />{nakli(t, 900, 0.85, { pose: P.sit, mouth: "flat", eyes: "squint", holdR: <g><rect x={-2} y={-4} width={30} height={6} fill="#F4F4F2" /><circle cx={28} cy={-1} r={4} fill={T.orange} /></g> }, stairY(900) + 40)}{Array.from({ length: 3 }, (_, i) => <circle key={i} cx={960 + i * 14} cy={HY(0.85, stairY(900)) + 120 - ((t * 40 + i * 30) % 120)} r={10 + i * 4} fill="#D9DCDF" opacity={0.4} />)}</TCam> },
  { c: "Sen buzdolabını tek elinle", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[600, 600]}><Basamak t={t} />{kaldir(t, SEN, 520, 0.9, <Buzdolabi x={0} y={0} s={0.7} />, 1, { pose: P.wave }, stairY(520))}{nakli(t, 820, 0.85, { pose: P.shock, mouth: "o", eyes: "wide", look: -0.6 }, stairY(820))}</TCam> },
  { c: "Merdivenleri çıktın", tone: "gold", r: (t, a, b) => { const w = toonWalk(t, a, b, 400, 1400, 0.85); return <TCam t={t} a={a} b={b} z={[1.1, 1.15]} c0={[960, 560]}><Basamak t={t} /><g transform={`translate(${w.x},${HY(0.85, stairY(w.x)) - 10})`}><Buzdolabi x={0} y={0} s={0.6} /></g><TFig x={w.x} y={stairY(w.x)} s={0.85} o={SEN} t={t} dir={w.dir} walk={w.walk} pose={P.wave} rim={0.4} mouth="grin" /></TCam>; },
    html: tg("4. KAT · TEK EL", T.hero) },
  { c: "Fişini bile taktın", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 640]}>{mutfak(t)}<Buzdolabi x={1200} y={G} s={1.1} />{sen(t, 900, 1, { pose: P.point, mouth: "grin", look: 0.5 })}</TCam> },
  { c: "Nermin Teyze bir buzdolabına", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[960, HY(1) + 160]}>{mutfak(t)}{nermin(t, 960, 1, { mouth: "o", eyes: "wide", look: t < a + 1 ? 0.8 : -0.8 })}</TCam> },
  { c: "Sonra telefonunu çıkardı", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]}><Izlenme t={t} a={a} to={48300} title="AİLE GRUBU · BUZDOLABI" /></TCam>,
    html: q("AKŞAMA BÜTÜN FATİH İZLEDİ", 70, 0.6, 980) },
  { c: "Ve sen bir şeyi fark ettin", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[960, HY(1) + 150]}>{ev(t, true)}{sen(t, 960, 1, { pose: P.hand, mouth: "flat", lookY: 0.4, brow: "worried" })}</TCam> },
  { c: "Her sabah, ikiye katlanıyordu", r: (t, a, b) => { const k = Math.min(3, Math.floor((t - a) / Math.max(0.5, (b - a) / 4))); return <TCam t={t} a={a} b={b} z={[1, 1.1]}><Carpan t={t} n={["×2", "×4", "×8", "×16"][k]} /></TCam>; } },

  // ── HESAP ──
  { c: "O gece masaya oturdun", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[960, HY(1) + 200]}>{ev(t, true)}{sen(t, 960, 1, { pose: P.sit, mouth: "flat", lookY: 0.5, holdR: <rect x={-4} y={-40} width={8} height={50} fill={T.yellow} /> }, G - 20)}</TCam> },
  { c: "Dördüncü gün, sekiz yüz", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><Hesap t={t} a={a} rows={[["4. GÜN", "800 KG"], ["5. GÜN", "1,6 TON"]]} step={1.6} /></TCam> },
  { c: "Bir araba", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 500]}><YokusCadde t={t} />{kaldir(t, SEN, 960, 1, <EskiAraba x={0} y={0} s={0.5} />, 1)}</TCam>,
    html: tg("5. GÜN · ARABA", T.blue) },
  { c: "Yedinci gün, altı ton", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 480]}><YokusCadde t={t} />{kaldir(t, SEN, 960, 1, <Silu kind="fil" x={0} y={0} s={0.6} />, 1)}</TCam>,
    html: tg("7. GÜN · FİL · 6 TON", T.purple) },
  { c: "Onuncu gün, elli ton", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 480]}><YokusCadde t={t} />{kaldir(t, SEN, 960, 1, <Silu kind="tank" x={0} y={0} s={0.7} c="#5E6B4A" />, 1)}</TCam>,
    html: tg("10. GÜN · TANK · 50 TON", T.green) },
  { c: "Kalemi bıraktın", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><HesapMak t={t} a={a} /></TCam>,
    html: q("30. GÜN: EKRANA SIĞMADI", 70, 0.6, 1000) },
  { c: "Bir milyar kat", sfx: "boom", r: cp("×1.073.741.824", "30. GÜN") },
  { c: "Ve aklında tek bir soru", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.9]} c0={[960, HY(1) + 140]}>{ev(t, true)}{sen(t, 960, 1, { mouth: "flat", brow: "worried", lookY: -0.2 })}</TCam>,
    html: q("KİMSEYE ZARAR VERMEDEN TAŞIYABİLECEK MİSİN?", 66, 0.4) },
  { c: "Bu sayının nereye kadar", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 520]}><Apartman t={t} k={1} /></TCam>,
    html: (t, a) => <Abone t={t} at={a + 0.3} /> },

  // ── YARIŞ ──
  { c: "Dördüncü gün, Mahmutpaşa'daki çay", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.1]}><Ilan t={t} k={ramp(t, a + 0.3, a + 1)} /></TCam> },
  { c: "Esnaf derneğinin geleneksel", r: (t, a, b) => keep("Dördüncü gün, Mahmutpaşa'daki çay", t, b) },
  { c: "Ödül, yüz bin lira", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.9, 2.1]} c0={[960, 720]}><Ilan t={t} /></TCam> },
  { c: "Yüz bin lira. Dershanenin", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><Hesap t={t} a={a} rows={[["ÖDÜL", "100.000 ₺"], ["DERSHANE · 1 SENE", "✓"], ["ANNENİN BİLEZİKLERİ", "✓"]]} step={1.3} /></TCam> },
  { c: "Kemal Abi kâğıdın önünde", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 600]}><g transform="translate(960,420) scale(0.45) translate(-960,-560)"><Ilan t={t} /></g><rect y={900} width={1920} height={180} fill="#8A7458" />{kemal(t, 960, 1.1, { dir: -1, mouth: "flat", lookY: -0.3 })}</TCam> },
  { c: "Sen de mi gireceksin", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[960, HY(1) + 150]}>{kahve(t)}{kemal(t, 960, 1, { mouth: "flat", talk: true, look: 0.5, eyes: "squint" })}</TCam>,
    html: q("“SEN DE Mİ GİRECEKSİN?”", 90) },
  { c: "Gireceğim abi", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[960, HY(1) + 150]}>{kahve(t)}{sen(t, 960, 1, { mouth: "smile", talk: true, look: -0.5, pose: P.hips })}</TCam>,
    html: q("“GİRECEĞİM ABİ.”", 100) },
  { c: "Kemal Abi güldü", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.8, 3.0]} c0={[960, HY(1) + 140]}>{kahve(t)}{kemal(t, 960, 1, { mouth: "smile", brow: "worried", eyes: "squint", look: 0.5 })}</TCam>,
    html: tg("BİRAZ YORGUN", T.blue, 1.2) },

  // ── GÜN DÖRT, BEŞ ──
  { c: "Dördüncü günün akşamı", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 600]}>{kahve(t)}{sedat(t, 1250, 1.15, { pose: P.hips, mouth: "grin", talk: true, look: -0.5 })}{sen(t, 750, 1, { mouth: "flat", look: 0.5 })}</TCam>,
    html: tg("KASAP SEDAT", T.red) },
  { c: "Masaya dirseğini koydun", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.9]} c0={[960, 700]} shake={0.15}>{kahve(t)}{sen(t, 700, 1, { pose: P.reach, mouth: "flat", look: 0.5 }, G)}{sedat(t, 1220, 1.1, { pose: P.reach, mouth: "frown", brow: "angry", sweat: true, dir: -1 }, G)}<GuresMasa x={960} y={800} s={1.1} /></TCam>,
    html: q("“BAŞLA!”", 90, 0.6) },
  { c: "Ve masa ikiye ayrıldı", sfx: "boom", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.4]} c0={[960, 720]} shake={1 - ramp(t, a, a + 0.6)}>{kahve(t)}{sen(t, 700, 1, { pose: P.shock, mouth: "o", eyes: "wide" })}{sedat(t, 1220, 1.1, { pose: P.shock, mouth: "o", eyes: "wide", dir: -1 })}<GuresMasa x={960} y={800} s={1.1} split={ramp(t, a, a + 0.4)} /></TCam> },
  { c: "Kimse kazanmadı", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[960, HY(1) + 170]}>{kahve(t)}{riza(t, 960, 1, { pose: P.hand, mouth: "flat", talk: true, brow: "angry" })}</TCam>,
    html: q("MASA PARASI: İKİNİZDEN", 80, 0.5) },
  { c: "Beşinci gün, çarpı otuz iki", sfx: "ding", r: cp("×32", "1,6 TON") },
  { c: "Sokağın ağzına biri arabasını", sfx: "buzz", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 640]}><YokusCadde t={t} /><CarP x={900} y={880} s={0.9} t={t} c={T.red} /><CarP x={1000} y={960} s={0.95} t={t} c={T.blue} /><Minibus x={1600} y={1000} s={0.8} t={t} /></TCam>,
    html: tg("ÇİFT SIRA PARK", T.red) },
  { c: "Bir dolmuş şoförü", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[1450, 700]}><YokusCadde t={t} /><Minibus x={1600} y={1000} s={0.8} t={t} />{sofor(t, 1420, 0.7, { pose: P.wave, mouth: "open", brow: "angry", talk: true }, 880)}</TCam>,
    html: q("“KİMİN BU ARABA?!”", 90) },
  { c: "Sen arabanın altından tuttun", sfx: "whoosh", tone: "gold", r: (t, a, b) => { const up = ramp(t, a + 0.3, a + 1.4); return <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[1000, 640]}><YokusCadde t={t} />{sen(t, 1000, 1, { pose: up > 0.5 ? P.cheer : P.reach, mouth: "flat", brow: "worried" })}<EskiAraba x={1000} y={lerp(980, HY(1) - 20, up)} s={0.75} t={t} c={T.blue} /></TCam>; } },
  { c: "Ve iki adım ötedeki", tone: "gold", r: (t, a, b) => { const k = ramp(t, a + 0.2, b - 0.4); return <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[1100, 660]}><YokusCadde t={t} />{walk(t, a, b - 0.4, SEN, 1000, 1300, 1, { pose: P.cheer, mouth: "smile" })}<EskiAraba x={lerp(1000, 1300, k)} y={lerp(HY(1) - 20, 980, ramp(t, b - 0.9, b - 0.2))} s={0.75} t={t} c={T.blue} /></TCam>; },
    html: tg("NAZİKÇE", T.hero, 1) },
  { c: "Arabanın sahibi elinde çay", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[960, HY(1) + 170]}><YokusCadde t={t} />{sahip(t, 960, 1, { pose: P.hold, mouth: "o", eyes: "wide", holdR: <Glass s={1.3} /> })}</TCam>,
    html: tg("PARK ETMİŞ… KENDİ KENDİNE", T.yellow, 1) },
  { c: "Adam çayını bıraktı", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[1100, 660]}><YokusCadde t={t} /><EskiAraba x={lerp(1300, 2400, ramp(t, a + 1.2, b))} y={980} s={0.75} t={t} c={T.blue} />{walk(t, a, a + 1.2, SAHIP, 900, 1250, 1, { mouth: "flat" })}</TCam>,
    html: q("O SOKAĞA BİR DAHA HİÇ PARK ETMEDİ.", 70, 0.5) },

  // ── BEDEL ──
  { c: "Ama işler uzun süre", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[960, HY(1) + 140]}>{ev(t)}{sen(t, 960, 1, { mouth: "flat", brow: "worried", lookY: 0.3 })}</TCam> },
  { c: "Altıncı gün, üç telefon", sfx: "knock", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><KirikTel t={t} n={Math.min(3, Math.floor((t - a) / 0.7) + 1)} /></TCam>,
    html: tg("SADECE MESAJ YAZARKEN", T.red, 1.4) },
  { c: "Annen çekmeceden eski", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]}><rect width={1920} height={1080} fill="#E9D9C0" /><Nokia x={960} y={540} s={1.6} /></TCam>,
    html: q("“BU KIRILMAZ.”", 100, 0.5) },
  { c: "Kırıldı", sfx: "boom", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.2]} shake={1 - ramp(t, a, a + 0.5)}><rect width={1920} height={1080} fill="#E9D9C0" /><Nokia x={960} y={540} s={1.6} crack={1} /></TCam> },
  { c: "Dershanede deneme sınavına", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 620]}><ExamHall t={t} crowd={1} />{sen(t, 960, 0.9, { pose: P.sit, mouth: "flat", lookY: 0.5, holdR: <g><rect x={-3} y={-30} width={6} height={30} fill={T.yellow} />{t > a + 1.2 && Array.from({ length: 6 }, (_, i) => <circle key={i} cx={(i - 3) * 8} cy={-10 + (i % 2) * 8} r={3} fill="#3A3A3A" />)}</g> }, G - 30)}</TCam>,
    html: tg("KALEM: TOZ", T.yellow, 1.2) },
  { c: "İkinci kalem, optik formu", sfx: "pop", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[700, 360]}><Optik t={t} hole={ramp(t, a + 0.5, a + 0.8)} /></TCam> },
  { c: "Gözetmen formuna baktı", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.3, 2.5]} c0={[960, HY(1) + 160]}><ExamHall t={t} crowd={0} />{gozet(t, 960, 1, { mouth: "flat", eyes: "squint", look: t < a + 1.5 ? 0 : 0.6, lookY: t < a + 1.5 ? 0.6 : 0 })}</TCam>,
    html: tg("HİÇBİR ŞEY SORMADI", T.blue, 1.6) },
  { c: "İnce belli çay bardakları", sfx: "pop", tone: "warm", r: (t, a, b) => { const k = ramp(t, a + 0.8, a + 1.1); return <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#E9D9C0" /><g transform="translate(960,640) scale(5)" opacity={1 - k}><Glass /></g>{Array.from({ length: 30 }, (_, i) => <rect key={i} x={960 + Math.cos(i) * k * (100 + (i * 37) % 300)} y={500 + Math.sin(i * 1.7) * k * 260} width={14} height={10} fill="#DDF1F7" stroke="#9CC9D6" opacity={k} />)}</TCam>; },
    html: tg("CAM TOZU", T.blue, 1.2) },
  { c: "Annen sana çayı artık", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[960, HY(1) + 200]}>{mutfak(t)}{anne(t, 780, 1, { pose: P.hand, mouth: "flat", look: 0.5 })}{sen(t, 1120, 1, { pose: P.hold, mouth: "flat", look: -0.5, holdR: <Masrapa s={0.8} /> })}</TCam>,
    html: tg("ÇELİK MAŞRAPA", "#9AA4AE") },
  { c: "Ve yedinci gün, çarpı yüz", sfx: "ding", r: cp("×128", "6,4 TON") },
  { c: "Annen sabah kapıda", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[960, 600]}><Landing t={t} open={1} plate="4" />{anne(t, 1080, 1, { pose: P.hold, mouth: "smile", look: -0.5 })}{sen(t, 820, 1, { mouth: "flat", look: 0.5 })}</TCam> },
  { c: "Sen geri çekildin", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[900, 600]}><Landing t={t} open={1} plate="4" />{anne(t, 1080, 1, { pose: P.hold, mouth: "flat", look: -0.5 })}{sen(t, lerp(820, 560, ramp(t, a, a + 0.6)), 1, { mouth: "flat", brow: "worried", look: 0.5, pose: P.back })}</TCam> },
  { c: "Annen durdu", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[1080, HY(1) + 150]}><Landing t={t} open={1} plate="4" />{anne(t, 1080, 1, { mouth: "flat", brow: "worried", talk: true, look: -0.5 })}</TCam>,
    html: q("“NE OLDU OĞLUM?”", 96) },
  { c: "Hiç anne. Ama biliyordun", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[560, HY(1) + 150]}><Landing t={t} open={1} plate="4" />{sen(t, 560, 1, { mouth: "flat", brow: "worried", lookY: 0.3 })}</TCam>,
    html: q("6 TONLA BİRİNE SARILIRSAN…", 76, 0.5) },
  { c: "O sabah annenin yüzünde", sfx: "drone", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.9, 3.2]} c0={[1080, HY(1) + 140]}><Landing t={t} open={1} plate="4" />{anne(t, 1080, 1, { mouth: "frown", brow: "worried", eyes: "squint", lookY: 0.3 })}</TCam>,
    html: q("BU SEFER, SENİN ELİNLE DEĞİL.", 76, 0.5) },

  // ── NEDEN ──
  { c: "Neden böyle oluyordu", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><Lif t={t} active={0} /></TCam>, html: big("NEDEN?", "#2EE6D0", 110) },
  { c: "Beynin hafif bir şey istediğinde", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><Lif t={t} active={3} label="HAFİF = BİRKAÇ LİF" /></TCam> },
  { c: "Ağır bir şey istediğinde", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><Lif t={t} active={Math.round(lerp(3, 18, ramp(t, a, a + 1)))} label="AĞIR = DAHA FAZLA LİF" /></TCam> },
  { c: "Beynin, kaslarına biraz", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}><Lif t={t} active={3} boost={ramp(t, a + 2, a + 3)} label={t > a + 2 ? "HER LİF ×128" : "19 YILDA ÖĞRENDİ: “BİRAZ”"} /></TCam>,
    html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.7} text="“BİRAZ” = BALYOZ" y={80} size={90} color="#F6C445" /> },
  { c: "Gücün her sabah ikiye", tone: "gold", r: kart("#14203A"),
    html: (t, a) => <><Txt t={t} at={a + 0.3} text="GÜÇ: ×128" y={340} size={110} color="#2EE6D0" /><Txt t={t} at={a + 1.6} text="KONTROL: 1. GÜN" y={560} size={110} color="#F05A4A" /></> },

  // ── OTOBÜS ──
  { c: "Sekizinci gün, Vatan Caddesi'nde", sfx: "drone", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.15]} c0={[960, 600]}><YokusCadde t={t} /><Otobus x={1000} y={880} s={0.85} t={0} smoke={1} tilt={-5.4} /></TCam>,
    html: tg("VATAN CADDESİ · ARIZA", T.red) },
  { c: "Şoför el frenini çekmiş", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[700, 700]}><YokusCadde t={t} /><Otobus x={1000} y={880} s={0.85} t={0} tilt={-5.4} />{yolcular(t, 200, 3)}</TCam> },
  { c: "Sen geldin. Çarpı iki yüz", sfx: "ding", r: cp("×256", "12,8 TON · BİR OTOBÜS") },
  { c: "Ellerini otobüsün arkasına", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[620, 700]}><YokusCadde t={t} /><Otobus x={1000} y={880} s={0.85} t={0} tilt={-5.4} />{sen(t, 470, 1, { pose: P.reach, mouth: "flat", brow: "angry" }, 1000)}</TCam> },
  { c: "Ve otobüs kıpırdamadı", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[600, 700]}><YokusCadde t={t} /><Otobus x={1000} y={880} s={0.85} t={0} tilt={-5.4} />{sen(t, lerp(470, 300, ramp(t, a + 0.4, a + 1.2)), 1, { pose: P.reach, mouth: "o", eyes: "wide", sweat: true }, 1010)}</TCam>,
    html: tg("GERİYE KAYDIN", T.red, 1) },
  { c: "Ayakkabıların asfaltın üstünde", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><Bordur t={t} push={ramp(t, a, b) * 25} /></TCam> },
  { c: "Bir teyze sana acıyarak", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.3, 2.5]} c0={[960, HY(1) + 160]}><YokusCadde t={t} />{teyze(t, 960, 1, { mouth: "flat", brow: "worried", talk: true, look: -0.5, holdR: <rect x={-30} y={0} width={60} height={70} rx={8} fill="#F4F4F2" stroke="#1A1A22" strokeWidth={3} /> })}</TCam>,
    html: q("“YAVAŞ EVLADIM, KENDİNİ SAKATLAYACAKSIN.”", 68) },
  { c: "İşte o an öğrendin", sfx: "ding", tone: "none", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><Newton t={t} a={a} /></TCam> },
  { c: "Sen otobüsü ittiğinde", r: (t, a, b) => keep("İşte o an öğrendin", t, b), html: q("AYNI GÜÇLE SENİ İTER", 70, 0.4, 960) },
  { c: "Ve sen hâlâ yetmiş kiloydun", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 640]}><YokusCadde t={t} />{sen(t, 960, 1, { pose: P.shrug, mouth: "flat" })}</TCam>,
    html: big("HÂLÂ 70 KİLO") },
  { c: "Bir milyar kat güçlü de olsan", r: cp("×1.073.741.824", "YİNE KAYARDIN", true) },
  { c: "Sonra gözün kaldırımın", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.1]} c0={[960, 700]}><Bordur t={t} push={0} /></TCam>, html: tg("TAŞ BORDÜR", T.yellow) },
  { c: "Ayağını bordüre dayadın", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[620, 760]}><YokusCadde t={t} /><Otobus x={1000} y={880} s={0.85} t={0} tilt={-5.4} /><rect x={260} y={1000} width={260} height={50} fill="#C9C2B4" stroke="#1A1A22" strokeWidth={4} />{sen(t, 470, 1, { pose: P.reach, mouth: "flat", brow: "angry" }, 1000)}</TCam> },
  { c: "Otobüs yokuşu çıktı", sfx: "whoosh", tone: "gold", r: (t, a, b) => { const k = ramp(t, a + 0.2, b); return <TCam t={t} a={a} b={b} z={[1.05, 1.1]} c0={[960, 600]}><YokusCadde t={t} /><Otobus x={lerp(1000, 1500, k)} y={lerp(880, 833, k)} s={0.85} t={t} tilt={-5.4} />{sen(t, lerp(470, 600, Math.min(1, k * 3)), 1, { pose: P.reach, mouth: "grin" }, 1000)}</TCam>; } },
  { c: "Bordür ikiye ayrıldı", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1]} shake={1 - ramp(t, a, a + 0.6)}><Bordur t={t} crack={ramp(t, a, a + 0.5)} /></TCam> },
  { c: "Yolcular alkışladı", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 640]}><YokusCadde t={t} />{yolcular(t, 700, 4, { pose: t % 0.6 < 0.3 ? P.cheer : P.hand, mouth: "grin", sweat: false, eyes: "happy" })}{sen(t, 500, 1, { mouth: "smile" })}</TCam> },
  { c: "Teyze sana poşetinden", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#E9D9C0" /><g transform="translate(960,540) scale(3)"><Simit x={0} y={0} /></g><Isil x={960} y={540} t={t} r={260} k={ramp(t, a + 1.5, a + 2.5) * 0.6} /></TCam>,
    html: q("BİR HAFTADIR İLK KEZ: EZMEDEN", 72, 0.5, 980) },

  // ── TEKİN BEY ──
  { c: "Dokuzuncu gün, buzdolabı", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]}><Izlenme t={t} a={a} to={1000000} title="BUZDOLABI ÇOCUK" /></TCam> },
  { c: "Onuncu gün, otobüs videosu", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]}><Izlenme t={t} a={a} to={3000000} from={200000} title="OTOBÜS ÇOCUĞU" /></TCam> },
  { c: "Ve onuncu gün, çarpı bin", sfx: "ding", r: cp("×1.024", "51 TON") },
  { c: "kapıyı takım elbiseli", sfx: "doorbell", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 600]}><Landing t={t} open={ramp(t, a + 0.4, a + 1.2)} plate="4" />{tekin(t, 960, 1.05, { mouth: "grin", eyes: "happy" })}</TCam>,
    html: tg("TEKİN BEY · MÜTEAHHİT", "#5E6670", 1.2) },
  { c: "Kardeşim, dedi. Bu gece", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[960, HY(1.05) + 160]}><Landing t={t} open={1} plate="4" />{tekin(t, 960, 1.05, { pose: P.point, mouth: "grin", talk: true })}</TCam>,
    html: q("“BU GECE SAAT BİRDE ESKİ BİR BİNAYI YIKACAĞIZ.”", 66) },
  { c: "Ruhsatı biraz eksik", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.8, 3]} c0={[960, HY(1.05) + 140]}><Landing t={t} open={1} plate="4" />{tekin(t, 960, 1.05, { mouth: "smile", eyes: "squint", talk: true, brow: "angry" })}</TCam>,
    html: q("“RUHSATI BİRAZ EKSİK.”", 90) },
  { c: "Sen iki saatte bitirirsin", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#14203A" /><Nakit x={960} y={600} s={2.6} /></TCam>,
    html: tg("10.000 ₺ · NAKİT", T.green) },
  { c: "On bin lira. Bir gecede", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><Hesap t={t} a={a} rows={[["TEKİN BEY · 1 GECE", "10.000 ₺"], ["KEMAL ABİ · 1 AY", "10.000 ₺"]]} step={1.4} /></TCam> },
  { c: "Kapıyı yavaşça kapattın", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[960, 600]}><Landing t={t} open={1 - ramp(t, a + 0.3, b - 0.3)} plate="4" />{sen(t, 760, 1, { pose: P.reach, mouth: "flat" })}</TCam>,
    html: tg("KOL YERİNDE KALDI", T.hero, 1.5) },
  { c: "Tekin Bey kapının arkasından", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 600]}><Landing t={t} open={0} plate="4" /></TCam>,
    html: q("“BU GÜÇ SENDE SONSUZA KADAR KALMAZ.”", 76, 0.4) },
  { c: "Ve bu cümle, o gece", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 880]}>{ev(t, true)}{yatan(t, 960, 1000, { eyes: "open", brow: "worried" })}</TCam> },

  // ── KEMAL ABİ'NİN SIRRI ──
  { c: "On ikinci gün, yarışa", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 560]}>{pazar(t, 0, 0)}{walk(t, a, b, SEN, 300, 800, 1, { mouth: "flat" })}</TCam>,
    html: tg("12. GÜN · YARIŞA 3 GÜN", T.blue) },
  { c: "Ve Kemal Abi'yi gördün", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 640]}><HanDoor t={t} close={1} />{kemal(t, 960, 1, { pose: P.sit, mouth: "frown", eyes: "squint", sweat: true, brow: "worried", holdL: <circle r={1} fill="none" /> }, G - 40)}</TCam>,
    html: tg("BELİNİ TUTUYOR", T.red, 1) },
  { c: "Cebinden bir ilaç kutusu", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[960, HY(1, G - 40) + 180]}><HanDoor t={t} close={1} />{kemal(t, 960, 1, { pose: P.phone, mouth: "flat", eyes: "squint", sweat: true, holdR: <rect x={-20} y={-14} width={40} height={28} rx={4} fill="#F4F4F2" stroke={T.red} strokeWidth={4} /> }, G - 40)}</TCam> },
  { c: "Seni görünce hemen doğruldu", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.3, 2.5]} c0={[960, HY(1) + 160]}><HanDoor t={t} close={1} />{kemal(t, 960, 1, { pose: P.point, mouth: "open", brow: "angry", talk: true, look: -0.5 })}</TCam>,
    html: q("“NE BAKIYORSUN? YÜK BEKLİYOR.”", 84) },
  { c: "Ama akşam, çaycı Rıza", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 600]}>{kahve(t)}{riza(t, 1100, 1, { mouth: "flat", talk: true, brow: "worried", look: -0.5, holdR: <Glass s={1.3} /> })}{sen(t, 800, 1, { mouth: "flat", look: 0.5 })}</TCam>,
    html: tg("ÇAYCI RIZA", RIZA.top) },
  { c: "Kemal Abi'nin belinde iki fıtık", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]} c0={[960, 600]}><Omurga t={t} k={ramp(t, a + 0.6, a + 1.2)} /></TCam>,
    html: tg("DOKTOR: AMELİYAT", T.red, 1.6) },
  { c: "Ameliyat parası yoktu", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><Hesap t={t} a={a} rows={[["AMELİYAT PARASI", "YOK"], ["EVDE", "3 ÇOCUK"], ["20 YILDA YARIŞ", "0 ZAFER"]]} red={0} step={1.5} /></TCam> },
  { c: "Bu sene, onun son şansıydı", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 560]}>{pazar(t, 0, 0)}{yuklu(t, KEMAL, 960, 1, 3, { dir: -1, mouth: "frown", sweat: true, brow: "worried" })}</TCam>,
    html: q("BELİNİN SON ŞANSI", 84, 0.5) },
  { c: "Ve bu sene, karşısında", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 520]}>{pazar(t, 0, 0)}{kaldir(t, SEN, 960, 1, <Otobus x={0} y={0} s={0.35} t={0} />, 1, { mouth: "flat" })}</TCam> },
  { c: "O gece masaya oturdun", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><Terazi t={t} tilt={Math.sin((t - a) * 1.4) * 0.8} l="DERSHANE · BİLEZİKLER" r="KEMAL ABİ'NİN BELİ" /></TCam> },
  { c: "Ve bir kâğıda tek bir kelime", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 540]}><rect width={1920} height={1080} fill="#2A2420" /><rect x={560} y={240} width={800} height={600} fill="#FBF6EA" stroke="#1A1A22" strokeWidth={5} />{Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${640 + (i % 2) * 40},${340 + i * 80} q100,-30 200,0 t200,0`} stroke="#2A3346" strokeWidth={8} fill="none" opacity={0.15 + 0.12 * i} />)}<path d="M760,560 q100,-40 200,0 t200,0" stroke="#2A3346" strokeWidth={10} fill="none" strokeDasharray="600" strokeDashoffset={600 - 600 * ((t - a) % 1.6) / 1.6} /></TCam>,
    html: tg("DEFALARCA", T.blue, 1.4) },

  // ── YARIŞ GÜNÜ ──
  { c: "On beşinci gün. Çarpı otuz iki bin", sfx: "ding", r: cp("×32.768", "1.638 TON") },
  { c: "Eminönü meydanı tıklım", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.15]} c0={[960, 560]}>{rih(t, { drift: 1, dusk: 0, crowd: 1 })}<Telefonlar t={t} n={9} /></TCam>,
    html: tg("YARIŞ GÜNÜ", T.red) },
  { c: "Yirmi hamal", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 620]}>{pazar(t, 0, 1)}{[KEMAL, HAM2, HAM3, SEN, HAM2, HAM3].map((o, i) => <g key={i}>{yuklu(t, o, 260 + i * 280, 0.85, 2, { mouth: o === SEN ? "flat" : "smile" })}</g>)}</TCam>,
    html: tg("20 HAMAL · 150 KİLO", T.orange) },
  { c: "Telefonlar havadaydı", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{pazar(t, 0, 1)}<Telefonlar t={t} n={9} /></TCam>,
    html: q("HERKES “OTOBÜS ÇOCUĞU”NU İZLİYOR", 66, 0.4, 120) },
  { c: "Düdük çaldı", sfx: "whistle", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[960, HY(1) + 160]}>{pazar(t, 0, 1)}{hakem(t, 960, 1, { pose: P.cheer, mouth: "o", eyes: "squint" })}</TCam> },
  { c: "Sen öne fırladın", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 620]}>{pazar(t, (t - a) * 220, 1)}{run(t, a, b, SEN, 600, 1100, 1, { mouth: "grin" }, flat, 2)}</TCam> },
  { c: "Yüz elli kilo, sırtında bir tüy", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[960, HY(1) + 200]}>{pazar(t, (t - a) * 220, 1)}{yuklu(t, SEN, 960, 1, 2, { mouth: "grin", eyes: "happy" })}<Tuy x={900} y={HY(1) - 40} t={t} k={1} n={6} /></TCam> },
  { c: "Mahmutpaşa yokuşuna saptın", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.1]} c0={[960, 560]}><Mahmutpasa t={t} finish={1} />{walk(t, a, b, SEN, 300, 1100, 0.8, { mouth: "grin" }, mah, 2)}</TCam> },
  { c: "Bitiş çizgisi tepede", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[1650, 620]}><Mahmutpasa t={t} finish={1} />{yuklu(t, SEN, 1400, 0.8, 2, { mouth: "grin" }, mah(1400))}</TCam>,
    html: tg("10 METRE", T.red, 1.2) },
  { c: "Ve arkana baktın", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[1400, HY(0.8, mah(1400)) + 120]}><Mahmutpasa t={t} finish={1} />{yuklu(t, SEN, 1400, 0.8, 2, { dir: t > a + 0.6 ? -1 : 1, mouth: "flat", eyes: "wide" }, mah(1400))}</TCam> },
  { c: "Kemal Abi, yokuşun ortasında", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[700, 760]}><Mahmutpasa t={t} finish={1} /><g transform={`translate(0,40)`}>{yuklu(t, KEMAL, 700, 0.8, 2, { pose: P.sit, mouth: "frown", eyes: "closed", sweat: true, brow: "worried" }, mah(700) - 30)}</g></TCam>,
    html: tg("DİZLERİNİN ÜSTÜNDE", T.red, 1) },
  { c: "Yüz bin lira, on metre", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[1700, 600]}><Mahmutpasa t={t} finish={1} /></TCam>,
    html: big("100.000 ₺ · 10 METRE ÖNÜNDE") },
  { c: "Döndün", sfx: "whoosh", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.2]} c0={[1400, HY(0.8, mah(1400)) + 140]}><Mahmutpasa t={t} finish={1} />{yuklu(t, SEN, 1400, 0.8, 2, { dir: -1, mouth: "flat", brow: "angry" }, mah(1400))}</TCam> },
  { c: "Yokuştan aşağı indin", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[1000, 640]}><Mahmutpasa t={t} finish={1} />{walk(t, a, b, SEN, 1400, 800, 0.8, { mouth: "flat" }, mah, 2)}{yuklu(t, KEMAL, 700, 0.8, 2, { pose: P.sit, mouth: "frown", sweat: true }, mah(700) + 10)}</TCam>,
    html: q("KALABALIK SUSTU", 70, 0.6, 120) },
  { c: "Kemal Abi'nin yükünü aldın", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.9]} c0={[760, 680]}><Mahmutpasa t={t} finish={1} />{yuklu(t, SEN, 820, 0.8, t > a + 1 ? 4 : 2, { mouth: "flat", dir: -1 }, mah(820))}{kemal(t, 690, 0.8, { pose: P.sit, mouth: "o", eyes: "wide", look: 0.6 }, mah(690) + 10)}</TCam>,
    html: tg("2 YÜK · 300 KİLO", T.orange, 1) },
  { c: "Ne yapıyorsun lan", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.8, 3]} c0={[700, HY(0.8, mah(700)) + 120]}><Mahmutpasa t={t} finish={1} />{kemal(t, 700, 0.8, { mouth: "open", brow: "angry", talk: true, sweat: true, look: 0.6 }, mah(700))}</TCam>,
    html: q("“NE YAPIYORSUN LAN?”", 90) },
  { c: "Denge abi, dedin", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.8, 3]} c0={[820, HY(0.8, mah(820)) + 120]}><Mahmutpasa t={t} finish={1} />{sen(t, 820, 0.8, { mouth: "smile", talk: true, look: -0.6, dir: -1 }, mah(820))}</TCam>,
    html: q("“DENGE ABİ. SEN SÖYLEMİŞTİN.”", 86) },
  { c: "Ve yokuşu beraber çıktınız", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[1100, 620]}><Mahmutpasa t={t} finish={1} />{walk(t, a, b, KEMAL, 700, 1250, 0.8, { mouth: "flat", sweat: true }, mah)}{walk(t, a, b, SEN, 780, 1330, 0.8, { mouth: "smile" }, mah, 4)}</TCam>,
    html: tg("YAVAŞ YAVAŞ", T.yellow, 1) },
  { c: "Bitiş çizgisinin bir adım", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.9]} c0={[1500, 600]}><Mahmutpasa t={t} finish={1} />{walk(t, a, b, KEMAL, 1300, 1620, 0.8, { mouth: "o", eyes: "wide" }, mah)}{yuklu(t, SEN, 1460, 0.8, 4, { mouth: "smile", pose: P.hand }, mah(1460))}</TCam> },
  { c: "Kemal Abi birinci oldu", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[1650, 600]}><Mahmutpasa t={t} finish={1} broke={ramp(t, a, a + 0.6)} />{kemal(t, 1720, 0.8, { pose: P.cheer, mouth: "grin", eyes: "happy" }, mah(1720))}{yuklu(t, SEN, 1560, 0.8, 4, { mouth: "grin" }, mah(1560))}</TCam>,
    html: (t, a) => <><Tag t={t} at={a + 0.4} text="1. KEMAL ABİ" c={KEMAL.top} /><Tag t={t} at={a + 1.4} text="2. SEN" c={SEN.top} y={140} /></> },
  { c: "Hakem kural kitabına baktı", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.3, 2.5]} c0={[960, HY(1) + 160]}><Mahmutpasa t={t} finish={1} crowd={0} />{hakem(t, 960, 1, { pose: t < a + 1.4 ? P.hold : P.shrug, mouth: "flat", lookY: t < a + 1.4 ? 0.5 : 0, holdR: t < a + 1.4 ? <rect x={-30} y={-40} width={60} height={70} rx={4} fill={T.red} stroke="#1A1A22" strokeWidth={3} /> : undefined })}</TCam>,
    html: tg("KİTAPTA BÖYLE BİR DURUM YOK", T.blue, 1) },
  { c: "Meydan bir an sustu", sfx: "drone", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.0]} c0={[700, 540]}>{rih(t, { drift: 1, dusk: 0.6 })}<Guvercin t={t} a={a + 1.6} /></TCam>,
    html: tg("YENİ CAMİ", T.blue, 2) },
  { c: "Bu sahne sana da bir şey", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[1720, HY(0.8, mah(1720)) + 140]}><Mahmutpasa t={t} finish={1} broke={1} />{kemal(t, 1720, 0.8, { pose: P.cheer, mouth: "grin", eyes: "happy" }, mah(1720))}</TCam>,
    html: big("👍 KEMAL ABİ'NİN HAKKI", "#FFFFFF", 80) },

  // ── YUMURTA DERSİ ──
  { c: "O akşam Kemal Abi seni", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[960, 640]}>{kahve(t)}{kemal(t, 1200, 1, { pose: P.hand, mouth: "smile", look: -0.5 })}{sen(t, 720, 1, { mouth: "flat", look: 0.5 })}<YumurtaKoli x={960} y={900} s={0.5} t={t} /></TCam>,
    html: tg("30 YUMURTA", T.yellow) },
  { c: "Sen benim ameliyatımı verdin", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[1200, HY(1) + 150]}>{kahve(t)}{kemal(t, 1200, 1, { mouth: "smile", talk: true, brow: "worried", look: -0.5 })}</TCam>,
    html: q("“SEN BENİM AMELİYATIMI VERDİN.”", 84) },
  { c: "Güçlü adam çoktur, oğlum", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[1200, HY(1) + 150]}>{kahve(t)}{kemal(t, 1200, 1, { pose: P.point, mouth: "open", talk: true, look: -0.5 })}</TCam>,
    html: q("“GÜÇLÜ ADAM YÜKÜ SIKAR. SIKINCA KIRAR.”", 74) },
  { c: "Usta yükü sıkmaz", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#2A2420" /><YumurtaKoli x={960} y={700} s={0.8} t={t} glow={1} /></TCam>,
    html: (t, a) => <Txt t={t} at={a + 0.3} text="USTA YÜKÜ SIKMAZ. YÜKE YASLANIR." y={140} size={84} color="#F6C445" /> },
  { c: "Ve on beş gün boyunca", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 600]}>{pazar(t, (t - a) * 30, 0.5)}{walk(t, a, b, SEN, 500, 1300, 1, { pose: P.hold, mouth: "flat", eyes: "squint", holdR: <g transform="translate(-40,-10)"><YumurtaKoli x={0} y={0} s={0.18} t={t} /></g> })}</TCam>,
    html: tg("HER AKŞAM", T.yellow) },
  { c: "Gücün her sabah ikiye", tone: "gold", r: kart("#14203A"),
    html: (t, a) => <><Txt t={t} at={a + 0.3} text="SABAH: GÜÇ ×2" y={340} size={110} color="#2EE6D0" /><Txt t={t} at={a + 1.8} text="AKŞAM: SEN ÷2" y={560} size={110} color="#F6C445" /></> },
  { c: "İlk akşam yirmi dokuz", sfx: "knock", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#8A6A4A" /><YumurtaKoli x={960} y={540} s={1.3} t={t} broken={29} /></TCam>, html: tg("1. AKŞAM · 29 KIRIK", T.red) },
  { c: "Beşinci akşam on bir", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#8A6A4A" /><YumurtaKoli x={960} y={540} s={1.3} t={t} broken={11} /></TCam>, html: tg("5. AKŞAM · 11 KIRIK", T.orange) },
  { c: "Onuncu akşam üç", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#8A6A4A" /><YumurtaKoli x={960} y={540} s={1.3} t={t} broken={3} /></TCam>, html: tg("10. AKŞAM · 3 KIRIK", T.yellow) },
  { c: "Bu arada sayı büyümeye", r: cp("×131.072", "17. GÜN") },
  { c: "On sekizinci gün, Eyfel", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[0.9, 1]} c0={[960, 400]}><rect width={1920} height={1080} fill="url(#tSkyDay)" /><rect y={1000} width={1920} height={80} fill="#A08A6A" />{kaldir(t, SEN, 960, 0.6, <Silu kind="eyfel" x={0} y={0} s={0.9} />, 1, {}, 1000)}</TCam>,
    html: tg("18. GÜN · EYFEL'DEN AĞIR", T.orange) },
  { c: "Yirminci gün, bir milyon", r: cp("×1.048.576", "20. GÜN") },
  { c: "Yirmi ikinci gün hapşırdın", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]} shake={ramp(t, a + 0.6, a + 0.8) * (1 - ramp(t, a + 0.8, a + 1.6))}><Camasir t={t} wind={ramp(t, a + 0.6, a + 0.9) * (1 - ramp(t, b - 0.6, b))} /></TCam>,
    html: tg("ÇAMAŞIRLAR KURUDU", T.blue, 1.4) },
  { c: "Yirmi beşinci gün, uykunda", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 880]}>{ev(t, true)}<KirikYatak x={960} y={1040} s={1.4} />{yatan(t, 960, 960, { eyes: "closed", mouth: "smile" })}</TCam>,
    html: tg("YATAK = YER MİNDERİ", T.purple) },
  { c: "Yirmi yedinci gün", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[0.95, 1.05]} c0={[960, 420]}><rect width={1920} height={1080} fill="url(#tSkyDusk)" /><rect y={1000} width={1920} height={80} fill="#D9B97A" />{kaldir(t, SEN, 960, 0.6, <Silu kind="piramit" x={0} y={0} s={0.9} />, 1, {}, 1000)}</TCam>,
    html: tg("27. GÜN · KEOPS'TAN AĞIR", T.yellow) },
  { c: "Ve yirmi dokuzuncu akşam", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 600]}><Mahmutpasa t={t} dusk={1} crowd={0.5} />{walk(t, a, b, SEN, 300, 1200, 0.8, { pose: P.hold, mouth: "flat", eyes: "squint", holdR: <g transform="translate(-40,-10)"><YumurtaKoli x={0} y={0} s={0.16} t={t} /></g> }, mah)}</TCam>,
    html: tg("EMİNÖNÜ → MAHMUTPAŞA", T.orange) },
  { c: "Hiçbiri kırılmadı", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}><rect width={1920} height={1080} fill="#2A2420" /><YumurtaKoli x={960} y={540} s={1.3} t={t} glow={1} /></TCam>, html: tg("0 KIRIK", T.green) },
  { c: "Kemal Abi koliyi açtı", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[960, HY(1) + 170]}>{kahve(t)}{kemal(t, 960, 1, { pose: P.hold, mouth: "flat", lookY: 0.5, eyes: "squint" })}</TCam>,
    html: tg("AÇTI · SAYDI · KAPATTI", T.yellow, 0.6) },
  { c: "Sadece kendi çayını", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.9]} c0={[960, 600]}>{kahve(t)}{kemal(t, 1150, 1, { pose: P.reach, mouth: "smile", eyes: "happy", look: -0.5, holdR: <Glass s={1.4} />, dir: -1 })}{sen(t, 760, 1, { mouth: "o", look: 0.5 })}</TCam> },
  { c: "Ve sen o bardağı tuttun", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}><rect width={1920} height={1080} fill="#2A2420" /><g transform="translate(960,700) scale(6)"><Glass /></g><Isil x={960} y={560} t={t} r={240} k={ramp(t, a + 0.6, b) * 0.7} /></TCam> },

  // ── OTUZUNCU GÜN ──
  { c: "Otuzuncu gün geldi", sfx: "ding", r: cp("×1.073.741.824", "30. GÜN") },
  { c: "Kemal Abi'nin ameliyatı", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[760, 700]}>{rih(t, { drift: 0.9 })}{sen(t, 640, 0.8, { pose: P.hand, mouth: "smile", look: 0.5, holdR: <BalikEkmek s={0.8} /> }, 920)}{kemal(t, 860, 0.8, { pose: P.hold, mouth: "grin", eyes: "happy", look: -0.5, holdR: <BalikEkmek s={0.8} /> }, 920)}</TCam>,
    html: tg("SON BALIK EKMEK · YARIN AMELİYAT", T.orange) },
  { c: "Sonra bir ses duydun", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[1000, 640]} shake={ramp(t, a + 0.5, a + 0.7) * (1 - ramp(t, a + 0.7, a + 1.5))}>{rih(t, { drift: 0.9, rope: 1 - ramp(t, a + 0.6, a + 0.8), tense: 1 })}</TCam>,
    html: tg("ÇATIRTI", T.red, 0.6) },
  { c: "Karaköy'den gelen akşam", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]} c0={[960, 540]}>{rih(t, { drift: lerp(0.8, 0.2, ramp(t, a, b)), panic: 1 })}</TCam>,
    html: tg("AKINTI → GALATA KÖPRÜSÜ", T.red) },
  { c: "İçinde üç yüz kişi", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[1450, 560]}>{rih(t, { drift: 0.2, panic: 1 })}</TCam>, html: big("300 KİŞİ", "#F05A4A", 110) },
  { c: "Kopan halatın ucu", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[800, 700]}>{rih(t, { drift: 0.2, rope: 1, ropeTo: [lerp(1000, 760, ramp(t, a, b)), lerp(860, 830, ramp(t, a, b))], panic: 1 })}{run(t, a, b, SEN, 300, 700, 0.8, { mouth: "open", brow: "angry" }, () => 900)}</TCam> },
  { c: "Ve işte oradaydın", sfx: "whoosh", r: (t, a, b) => again("Ve kayıyorsun", t, a, b, 0) },
  { c: "Bir milyar kat güç", tone: "night", r: kart("#0E1A2E"),
    html: (t, a) => <><Txt t={t} at={a + 0.2} text="1 MİLYAR KAT GÜÇ" y={240} size={90} color="#2EE6D0" /><Txt t={t} at={a + 1.4} text="70 KİLO BEDEN" y={440} size={90} color="#FFFFFF" /><Txt t={t} at={a + 2.6} text="ISLAK TAŞ" y={640} size={90} color="#F05A4A" /></> },
  { c: "Otobüs, dedin içinden", sfx: "ding", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]}><Bordur t={t} crack={1} /></TCam>, html: big("OTOBÜS. BORDÜR.", "#FFFFFF", 100) },
  { c: "İskelenin kenarında", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.9]} c0={[700, 760]}>{rih(t, { drift: 0.25, panic: 0.5 })}</TCam>, html: tg("DEMİR BABA", "#5E6670", 0.8) },
  { c: "Ayağını babaya dayadın", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.8]} c0={[700, 720]}>{rih(t, { drift: 0.25, rope: 1, tense: 1, ropeTo: [700, 690], panic: 0.6 })}{sen(t, 620, 0.8, { pose: P.reach, mouth: "flat", brow: "angry" }, 860)}</TCam> },
  { c: "Ama bu sefer sorun başkaydı", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><HalatEl t={t} grip={0.6} /></TCam> },
  { c: "Halatı biraz fazla sıkarsan", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} shake={0.3}><HalatEl t={t} grip={1} fray={ramp(t, a + 0.5, b)} /></TCam>, html: tg("HALAT KOPAR", T.red, 0.8) },
  { c: "Biraz fazla çekersen", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[1200, 620]} shake={ramp(t, a + 0.8, a + 1)}>{rih(t, { drift: ramp(t, a, a + 0.8), panic: 1 })}<rect width={1920} height={1080} fill="#0E1A2E" opacity={0.35} /></TCam>,
    html: q("İSKELEYE ÇARPAR · 300 KİŞİ SAVRULUR", 66, 0.4) },
  { c: "Bir milyar kat güçle bir vapuru", tone: "night", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.3} text="DURDURMAK: KOLAY" y={330} size={100} color="#2EE6D0" /><Txt t={t} at={a + 2} text="YAVAŞÇA DURDURMAK…" y={540} size={100} color="#F6C445" /></> },
  { c: "Arkandan Kemal Abi'nin sesi", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[960, HY(1) + 170]}>{rih(t, { drift: 0.3, crowd: 1 })}{kemal(t, 960, 1, { pose: P.wave, mouth: "open", talk: true, brow: "angry" })}</TCam> },
  { c: "Sıkma! Yaslan", sfx: "pop", tone: "gold", r: kart("#2A2420"), html: (t, a) => <Txt t={t} at={a + 0.1} text="“SIKMA! YASLAN!”" y={420} size={150} color="#F6C445" /> },
  { c: "Gözlerini kapattın", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.8, 3]} c0={[960, HY(1) + 140]}><rect width={1920} height={1080} fill="#2A2420" />{sen(t, 960, 1, { eyes: "closed", mouth: "flat" })}<g opacity={0.35}><YumurtaKoli x={960} y={300} s={0.6} t={t} glow={1} /></g></TCam>,
    html: q("SIKMA. YASLAN.", 90, 0.5) },
  { c: "Halatı, bir koli yumurta", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1]}><HalatEl t={t} grip={0.15} soft={ramp(t, a + 0.4, a + 1.4)} /></TCam> },
  { c: "Vapur yavaşladı", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]} c0={[960, 560]}>{rih(t, { drift: lerp(0.3, 0.9, ramp(t, a, b)), rope: 1, tense: 0.8, ropeTo: [700, 690] })}{sen(t, 620, 0.8, { pose: P.reach, mouth: "flat", eyes: "closed" }, 860)}</TCam> },
  { c: "Ve iskeleye, bir kedinin", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[900, 700]}>{rih(t, { drift: lerp(0.9, 1, ramp(t, a, b)), rope: 1, tense: 0.5, ropeTo: [700, 690] })}</TCam>,
    html: tg("YUMUŞACIK", T.hero, 1) },
  { c: "İçeride, masaların üstündeki", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 600]}><CayMasa t={t} wob={1 - ramp(t, a, a + 1.5)} /></TCam>,
    html: q("BİR TANESİ BİLE DEVRİLMEDİ", 80, 0.4, 980) },
  { c: "Halatı babaya bağladın", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[3, 3.2]} c0={[700, 760]}>{rih(t, { drift: 1, rope: 1, tense: 0.4 })}<g transform="translate(700,724)"><ellipse rx={56} ry={22} fill="none" stroke="#C9A66B" strokeWidth={12} /><ellipse cy={10} rx={50} ry={18} fill="none" stroke="#B8955A" strokeWidth={12} /></g></TCam>,
    html: tg("ÇİFT DÜĞÜM · KEMAL ABİ'NİN DÜĞÜMÜ", KEMAL.top, 0.8) },
  { c: "Kalabalık telefonlarını kaldırmıştı", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}>{rih(t, { drift: 1, crowd: 1 })}<Telefonlar t={t} k={1 - ramp(t, a + 1.5, b)} /></TCam>,
    html: q("HERKES SADECE BAKIYORDU", 72, 0.6, 120) },
  { c: "Kalabalığın arasında takım elbiseli", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[960, HY(1) + 200]}>{rih(t, { drift: 1, crowd: 0 })}{tekin(t, 1100, 1, { pose: P.reach, mouth: "grin", look: -0.5, dir: -1 })}<Kartvizit x={900} y={HY(1) + 240} s={0.8} k={ramp(t, a + 0.6, a + 1.2)} /></TCam> },
  { c: "Yük taşırım abi", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[960, HY(1) + 150]}>{rih(t, { drift: 1, crowd: 0 })}{sen(t, 960, 1, { mouth: "smile", talk: true, look: 0.5 })}</TCam>,
    html: q("“YÜK TAŞIRIM ABİ. YIKMAM.”", 92) },

  // ── EVE DÖNÜŞ ──
  { c: "O gece eve döndün", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 600]}><Landing t={t} open={ramp(t, a + 0.8, a + 1.8)} plate="4" />{walk(t, a, a + 1.4, SEN, 300, 760, 1, { mouth: "flat" })}</TCam>,
    html: tg("KOL YERİNDE", T.hero, 1.8) },
  { c: "Annen mutfaktaydı", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 620]}>{mutfak(t)}{anne(t, 960, 1, { pose: P.hold, mouth: "smile", holdR: <Kavanoz x={0} y={0} s={0.3} /> })}</TCam> },
  { c: "Şunu bir açıver oğlum", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[960, HY(1) + 160]}>{mutfak(t)}{anne(t, 960, 1, { pose: P.hand, mouth: "smile", eyes: "happy", talk: true })}</TCam>,
    html: q("“ŞUNU BİR AÇIVER OĞLUM.”", 92) },
  { c: "Kavanozu açtın", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 640]}>{kavMutfak(t, { lid: ramp(t, a + 0.6, a + 1.4) * 0.04 })}</TCam>,
    html: q("BİR DAMLA BİLE DÖKÜLMEDİ", 80, 0.5, 120) },
  { c: "Sonra kavanozu tezgâha", tone: "gold", r: (t, a, b) => { const k = ramp(t, a + 0.4, a + 1.6); return <TCam t={t} a={a} b={b} z={[1.8, 2.1]} c0={[960, HY(1) + 220]}>{mutfak(t)}{anne(t, lerp(820, 910, k), 1, { pose: P.hold, mouth: "o", eyes: "wide" })}{sen(t, lerp(1100, 1010, k), 1, { pose: P.hold, mouth: "smile", eyes: "closed", dir: -1 })}</TCam>; } },
  { c: "Yirmi üç gün sonra ilk kez", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[960, HY(1) + 180]}>{mutfak(t)}{anne(t, 910, 1, { pose: P.hold, mouth: "smile", eyes: "closed" })}{sen(t, 1010, 1, { pose: P.hold, mouth: "smile", eyes: "closed", dir: -1 })}<Isil x={960} y={HY(1) + 200} t={t} r={200} k={0.5} /></TCam>,
    html: tg("23 GÜN SONRA İLK KEZ", T.hero, 0.4) },
  { c: "Annen hiçbir şey demedi", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.8, 3]} c0={[960, HY(1) + 200]}>{mutfak(t)}{anne(t, 910, 1, { pose: P.hold, mouth: "smile", eyes: "closed" })}{sen(t, 1010, 1, { pose: P.hold, mouth: "smile", eyes: "closed", dir: -1 })}</TCam>,
    html: tg("TIP · TIP", T.pink, 1.4) },
  { c: "Dünyanın en güçlü insanıydın", tone: "gold", r: kart("#14203A"),
    html: (t, a) => <><Txt t={t} at={a + 0.3} text="DÜNYANIN EN GÜÇLÜ İNSANI" y={300} size={90} color="#2EE6D0" /><Txt t={t} at={a + 2.2} text="EN ZOR İŞİ: ANNESİNE YAVAŞÇA SARILMAK" y={500} size={74} color="#F6C445" /></> },
  { c: "Ertesi sabah dershaneden", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#E9D9C0" /><g transform="translate(960,560)"><PhoneP s={7} ring={1} /></g></TCam>,
    html: q("“BU SENENİN PARASI BİZDEN.”", 90, 0.5) },
  { c: "Tek bir şartı vardı", tone: "warm", r: (t, a, b) => { const w = toonWalk(t, a, b, 400, 1300, 0.85); return <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 560]}><Basamak t={t} /><SirtYuk x={w.x} y={stairY(w.x)} s={0.85} n={4} dir={w.dir} t={t} labels={["SIRA", "SIRA", "SIRA", "SIRA"]} /><TFig x={w.x} y={stairY(w.x)} s={0.85} o={SEN} t={t} dir={w.dir} walk={w.walk} pose={P.hold} rim={0.4} mouth="grin" /></TCam>; },
    html: tg("YENİ SIRALAR · 4. KAT", T.yellow, 0.8) },

  // ── OTUZ BİRİNCİ GÜN ──
  { c: "Otuz birinci günün sabahı", sfx: "buzz", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 860]}>{ev(t)}<KirikYatak x={960} y={1040} s={1.4} />{yatan(t, 960, 960, { eyes: t < a + 0.8 ? "closed" : "open" })}</TCam>,
    html: tg("31. GÜN", T.blue) },
  { c: "Sayı değişmişti", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><Carpan t={t} n="×1.073.741.824" k={Math.sin(t * 25) > 0 ? 1 : 0.4} /></TCam> },
  { c: "Yarıya inmişti", sfx: "buzz", r: cp("×536.870.912", "YARIYA İNDİ", true) },
  { c: "Gücün geri gidiyordu", sfx: "drone", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.3]}><Carpan t={t} n="×536.870.912" down bg="#0B1220" sub="SIFIRA VARINCA?" /></TCam> },

  // ── KAPANIŞ ──
  { c: "Peki sen olsan", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><Secim t={t} a={a} l={["DÖNERDİM ↩", "BİTİRİRDİM 🏁"]} /></TCam> },
  { c: "Yorumlara yaz", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[1650, 600]}><Mahmutpasa t={t} finish={1} broke={1} /></TCam>, html: big("YORUMLARA YAZ ↓", "#FFFFFF", 90) },
  { c: "Ve sayının sıfıra vardığında", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><Carpan t={t} n="×268.435.456" down bg="#0B1220" /></TCam>,
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
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K2R_14_SECONDS));
  return raw;
})();

const VOL: Record<string, number> = { whoosh: 0.07, drone: 0.14, boom: 0.15, ding: 0.14, knock: 0.1, splash: 0.12, buzz: 0.08, pop: 0.1, whistle: 0.1, doorbell: 0.1 };
export const K2RVideo14: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K2R_14_SECONDS;
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
      <Audio src={staticFile("audio/k2r-14.wav")} />
      {TIMED.map((x, i) => i > 0 && !(x.from > END - 19 && x.sfx && x.sfx !== "whoosh") && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from - 0.08) * fps))} durationInFrames={Math.round(2.2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx ?? "whoosh"}.wav`)} volume={x.from > END - 19 ? 0.05 : VOL[x.sfx ?? "whoosh"] ?? 0.08} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

export const _unused = { Vapur, TMini, MINI_COLS };

const AG = [[1.22, -90, -40], [1.3, 110, 30], [1.18, 0, 60]];
function again(c: string, t: number, a: number, b: number, q0: number) {
  const s0 = SHOTS.find((x) => x.c === c);
  if (!s0) return null;
  const [z, dx, dy] = AG[q0 % AG.length];
  return <g transform={`translate(${960 + dx} ${540 + dy}) scale(${z}) translate(-960 -540)`}>{s0.r(t, a, b)}</g>;
}
function keep(c: string, t: number, b: number) { const s0 = TIMED.find((x) => x.c === c); return s0 ? s0.r(t, s0.from, b) : null; }
