import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k2r-19-words.json";
import { makeCue, ramp as rampRaw } from "../../lib/cues";
import { Eyes, Brow, Mouth, HERO, Outfit, P, T, TCam, TFig, TFrame, TPose, lerp, toonWalk } from "../../components/Toon";
import { Txt, Tag, Abone } from "../../components/K2Kit";
import { Atmos, LiveCam, Sweep, Tone } from "../../components/Live";
import { InceBardak } from "../../components/K2Dikey3";
import { Kagit, Kopek, Otel, Radyo } from "../../components/SonIki";
import { ArabaIci, Defter, GeceModu, Harita, RadyoOdasi, Saat, VanGece, YolSahne } from "../../components/YolVan";
import { Avuc, Bodrum, BuzluCam, Kamyonet, Kar, Mutfak, Plan, VanGolu, VanSokak } from "../../components/VanUc";
import { Ampul, BalikDepo, Battaniye, Buhar, DepoIci, DevrikDirek, DikizAyna, Hangar, Jenerator, KutupYildizi, MamaCuval, MenzilHarita, PlastikGul, RadyoMors, SesDalga, Telsiz, TokaAvuc, VlogTel } from "../../components/Kefal";

// Kanal 2 · k2r-19 · "Dünyada Son İki Kişi Kaldık… Ve Bana Başka Bir Kız Aşık Oldu" — 4. BÖLÜM "Kefal". TAMAMEN MOTOR.
// Kurallar: her kesmede whoosh YOK, beyaz flaş YOK. SFX sadece anlamlı vuruşlarda, kısık.
// Kadro kıyafetleri: Defne mercan kazak + at kuyruğu + sarı toka; Bora zeytin yeşili mont (içi turuncu); Asya krem kaban + bal rengi topuz + bordo eşarp.

const ALT: Record<string, string[]> = {
  "Nefes, buhar olup": ["Nefes puhar olup"],
  "Ve hoparlörden önce": ["Ve hoparlordan önce"],
  "İyiyim. Arama. Sadece": ["İyim, arama. Sadece"],
  "Tık. Tık. Tık": ["Tık, tık, topuklu", "Tık, tık"],
  "Ayağa kalkıyorsun. Ve bu sefer": ["Ayağa kalkıyorsun. Ve du sefer"],
  "Kar yatay yağıyor": ["Kar yatağı yağıyor"],
  "Bora yan odadaydı": ["Bora yan odada aydın"],
  "Çünkü gece, Bora sıradan": ["Çünkü Dece, Bora sıradan"],
  "Bu gece, saat üçü": ["Bu gece saat 3", "Bu gece, saat 3"],
  "Kırk yıl yağlı": ["40 yıl yağlı"],
  "Kırk bidon mazot": ["40 bidon mazot"],
  "Üç sıfır": ["3 sıfır", "3-0", "Üç-sıfır"],
  "Dört sıfır": ["4 sıfır", "4-0", "Dört-sıfır"],
  "Saat dört buçuk": ["Saat 4 buçuk", "Saat 4.30", "Saat dört buçuk"],
  "Saat dört otuz": ["Saat 4.34", "Saat 4:34", "Saat 4 34", "Saat dört otuz dört"],
  "Saat on bir": ["Saat 11", "Saat 11."],
  "Saat ikiyi kırk": ["Saat 2'yi 40", "Saat ikiyi 40", "Saat 2.40"],
  "İkiyi elli bir": ["2'yi 51", "İkiyi 51", "2.51"],
  "Saat üçü on üç": ["Saat 3'ü 13", "Saat 3.13", "Saat üçü 13"],
  "Saat üçü on dört": ["Saat 3'ü 14", "Saat 3.14", "Saat üçü 14"],
  "Yüz on yedi gündür": ["117 gündür"],
  "Dört saat on iki": ["4 saat 12"],
  "Yetmiş iki yaşında": ["72 yaşında"],
  "Uyurgezer çocuklar": ["Uyur gezer çocuklar"],
  "Bir. İki. Üç adım": ["1. 2. 3 adım", "Bir, iki, üç adım", "1, 2, 3 adım"],
  "Hepiniz üçü": ["Hepiniz 3", "Hepiniz üç"],
  "Ev. Saat": ["Ev. Saat 3", "Ev Saat"],
  "Bir köpeğin burnu": ["Bir köpeğin burnu"],
  "Su yanına oturuyor": ["Su yanına oturuyor", "Suyu yanına oturuyor"],
  "Su pencereye gidiyor": ["Su pencereye gidiyor"],
};
const ramp = (t: number, a: number, b: number) => (b - a > 0.01 ? rampRaw(t, a, b) : t >= b ? 1 : 0);
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const VAR: [RegExp, string][] = [[/â/g, "a"], [/î/g, "i"], [/û/g, "u"]];
const variants = (p: string) => { const out = [p]; for (const [re, to] of VAR) for (const v of [...out]) { const n = v.replace(re, to); if (n !== v) out.push(n); } return out; };
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K2R_19_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone; g?: string; hud?: boolean };

// ── kadro ──
const G = 1040;
const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#1FC8B4", top2: "#159A8B" };
const DEFNE: Outfit = { top: "#E0566A", top2: "#B8404F", kind: "sweater", hair: "ponytail2", hairColor: "#3A2418", tie: "#F6C445", neck: "#C9302C", shoes: "#F4F4F4" };
const DEFNE_M: Outfit = { ...DEFNE, kind: "coat", top: "#C9473E", top2: "#9E342D" };
const BORA: Outfit = { top: "#6E7B3A", top2: "#56612C", kind: "coat", inner: "#F28C28", hair: "none", shoes: "#3A2A20" };
const BAYRAM: Outfit = { top: "#5A4636", top2: "#463628", kind: "vest", inner: "#D9CDB5", hair: "cap", hairColor: "#3A3A3A", mustache: true, mustacheColor: "#FFFFFF", bulk: 1.35, shoes: "#3A2A20" };
const SU: Outfit = { top: "#F6C445", top2: "#D9A21E", kind: "coat", hair: "braids", hairColor: "#3A2418", tie: "#E0393E", shoes: "#E0393E" };
const ASYA: Outfit = { top: "#F1E4CC", top2: "#D9C6A4", kind: "coat", inner: "#FBF3E4", hair: "long", hairColor: "#F2CB62", skin: "#F6D2BA", neck: "#8E2F55", shoes: "#7A2E4A", glam: true, lips: "#E0466A", earrings: "#FBF6EC", belt: "#B48A5A" };
const BS = 1.2, SS = 0.62;

type Face = { pose?: TPose; eyes?: Eyes; brow?: Brow; mouth?: Mouth; look?: number; lookY?: number; talk?: boolean; sweat?: boolean; dir?: 1 | -1; holdR?: React.ReactNode; holdL?: React.ReactNode; op?: number; bob?: number };
const fig = (o: Outfit, s0 = 1) => (t: number, x: number, s = s0, f: Face = {}, y = G) => <TFig x={x} y={y} s={s} o={o} t={t} rim={0.3} seed={x} {...f} />;
const sen = fig(SEN), def = fig(DEFNE), defm = fig(DEFNE_M), bor = fig(BORA), bay = fig(BAYRAM, BS), su = fig(SU, SS), asy = fig(ASYA);
const walk = (t: number, a: number, b: number, o: Outfit, x0: number, x1: number, s = 1, f: Face = {}, y = G) => {
  const w = toonWalk(t, a, b, x0, x1, s);
  return <TFig x={w.x} y={y} s={s} o={o} t={t} dir={w.dir} walk={w.walk} rim={0.3} {...f} />;
};
const wx = (t: number, a: number, b: number, x0: number, x1: number, s = 1) => toonWalk(t, a, b, x0, x1, s).x;
const otur = (f: (t: number, x: number, s?: number, fc?: Face, y?: number) => React.ReactNode, t: number, x: number, seatY: number, s: number, fc: Face = {}) => f(t, x, s, { pose: P.sit, ...fc }, seatY + 178 * s);
// diz çökme: arka diz yerde → kalça yerden ~86·s
const KNEEL: TPose = { l: [55, 100], r: [70, 95], ll: [88, 0], rl: [-12, -95], lean: 4 };
const diz = (f: (t: number, x: number, s?: number, fc?: Face, y?: number) => React.ReactNode, t: number, x: number, s: number, fc: Face = {}, y = G) => f(t, x, s, { pose: KNEEL, ...fc }, y + 92 * s);
const yat = (t: number, x: number, y: number, s: number, f: Face = {}) => <g transform={`rotate(-82 ${x} ${y})`}>{sen(t, x, s, { eyes: "closed", mouth: "flat", ...f }, y)}</g>;
const cay = (s = 0.5, tea = 1) => <InceBardak x={0} y={0} s={s} tea={tea} saucer={false} />;
const gul = (s = 0.7, dust = 1) => <PlastikGul s={s} dust={dust} />;
const q = (text: string, size = 80, k = 0.3, y = 820): R => (t, a, b) => <Txt t={t} at={a + (b - a) * k} text={text} y={y} size={size} />;
const tg = (text: string, c: string = T.hero, at = 0.5, y?: number): R => (t, a) => <Tag t={t} at={a + at} text={text} c={c} y={y} />;
const big = (text: string, color = "#F6D08A", size = 90, y = 80): R => (t, a) => <Txt t={t} at={a + 0.3} text={text} y={y} size={size} color={color} />;
const kart = (bg: string): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill={bg} /><Kar t={t} k={0.25} n={60} /></TCam>;
const kartTxt = (l1: string, l2?: string, c1 = "#2EE6D0", c2 = "#F6C445", bg = "#0E1A2E"): Pick<Sh, "r" | "html" | "hud"> => ({ hud: false, r: kart(bg), html: (t, a) => <><Txt t={t} at={a + 0.2} text={l1} y={l2 ? 330 : 440} size={92} color={c1} />{l2 && <Txt t={t} at={a + 1.0} text={l2} y={520} size={74} color={c2} />}</> });
const cam = (z: [number, number], c0: [number, number], c1: [number, number] | undefined, node: (t: number, a: number, b: number) => React.ReactNode, shake = 0): R => (t, a, b) => <TCam t={t} a={a} b={b} z={z} c0={c0} c1={c1} shake={shake}>{node(t, a, b)}</TCam>;
const kagitBg = "#E9DCC6";
const svg = (n: React.ReactNode) => <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>{n}</svg>;

// el ele (hayal): Defne + Bora uzakta
const EL_D: TPose = { l: [8, 6], r: [50, 25] };
const EL_B: TPose = { l: [-50, -25], r: [-8, -6] };
const KALDIR: TPose = { l: [-35, 70], r: [130, 140] };
const IKI_KOL: TPose = { l: [110, 130], r: [110, 130] };
const SARIL: TPose = { l: [70, 120], r: [70, 120] };
const elEle = (t: number, a: number, b: number, x0: number, x1: number, s: number, y: number, op = 0.75, turn = -1) => {
  const x = wx(t, a, b, x0, x1, s);
  const dx = 310 * s;
  const tr = turn >= 0 && t > a + turn && t < a + turn + 1.8;
  return <g opacity={op}>
    {walk(t, a, b, BORA, x0 + dx, x1 + dx, s, { pose: EL_B, mouth: "smile" }, y)}
    {tr ? def(t, x, s, { pose: EL_D, mouth: "flat", dir: -1, brow: "worried" }, y) : walk(t, a, b, DEFNE, x0, x1, s, { pose: EL_D, mouth: "smile" }, y)}
    <circle cx={x + 155 * s} cy={y - 214 * s} r={16 * s} fill="#141414" />
  </g>;
};
const Hayal: React.FC<{ k?: number }> = ({ k = 1 }) => <g opacity={k}><rect width={1920} height={1080} fill="#B9C9F0" opacity={0.12} /><circle cx={1300} cy={760} r={420} fill="#FFFFFF" opacity={0.08} /></g>;

// ── sahneler ──
const sokak = (mode: "day" | "dusk" | "night" = "day", o: { lamp?: number; windows?: number; fall?: number } = {}) => (t: number) => <><VanSokak t={t} mode={mode} lamp={o.lamp ?? (mode === "night" ? 1 : 0)} windows={o.windows ?? (mode === "night" ? 0.35 : 0)} snow={1} /><Kar t={t} k={o.fall ?? (mode === "night" ? 0.9 : 0.5)} /></>;
// KÜÇÜK RESİM SAHNESİ: Asya diz çökmüş, gül uzatıyor; sen ayakta, gözün sokağın sonunda; uzakta (hayal) Defne + Bora el ele
const kapak = (t: number, a: number, b: number, o: { dream?: number; turn?: number; mode?: "day" | "dusk"; senF?: Face; asyF?: Face } = {}) => <>
  {sokak(o.mode ?? "day", { fall: 0.6 })(t)}
  {(o.dream ?? 1) > 0 && <><Hayal k={o.dream ?? 1} />{elEle(t, a, b + 3, 1250, 1450, 0.42, 900, 0.7 * (o.dream ?? 1), o.turn ?? -1)}</>}
  {diz(asy, t, 640, 1.05, { holdR: gul(0.8), mouth: "smile", look: 1, lookY: -0.5, ...(o.asyF ?? {}) })}
  {sen(t, 1000, 1.05, { mouth: "flat", brow: "worried", look: 1, dir: 1, ...(o.senF ?? {}) })}
</>;
const evGun = (t: number) => <Mutfak t={t} night={0} candle={0} />;
const evAk = (t: number) => <Mutfak t={t} night={1} candle={0} />;
const radyo = (o: { beam?: number; names?: number; bulb?: number } = {}) => (t: number) => <RadyoOdasi t={t} beam={o.beam ?? 0.3} bulb={o.bulb ?? 0} names={o.names ?? 1} jacket={0} steam={0} />;
const radyoOn = (o: { bulb?: number } = {}) => (t: number) => <RadyoOdasi t={t} beam={0.2} bulb={o.bulb ?? 1} names={1} jacket={0} steam={1} bardak={cay(0.5)} />;
// sabah odası: iki yatak, pencere
const Oda: React.FC<{ t: number; folded?: boolean }> = ({ t, folded = true }) => <g>
  <rect width={1920} height={1080} fill="#5E6E86" />
  <rect x={760} y={140} width={400} height={340} fill="#CFE0EE" /><path d="M760,310 H1160 M960,140 V480" stroke="#4A5A70" strokeWidth={14} /><rect x={760} y={140} width={400} height={340} fill="none" stroke="#4A5A70" strokeWidth={18} />
  <path d="M760,480 L560,1080 L1360,1080 L1160,480Z" fill="#FFFFFF" opacity={0.08} />
  <Kar t={t} k={0.15} n={20} />
  <rect y={900} width={1920} height={180} fill="#4A3C34" />
  {/* sol yatak (senin) */}
  <rect x={80} y={820} width={700} height={120} rx={20} fill="#8A6A52" /><rect x={100} y={770} width={660} height={80} rx={30} fill="#E9E2D2" /><rect x={80} y={700} width={40} height={240} fill="#6A5040" />
  {/* sağ yatak (Defne'nin) — boş, battaniye katlı */}
  <rect x={1140} y={820} width={700} height={120} rx={20} fill="#8A6A52" /><rect x={1160} y={770} width={660} height={80} rx={30} fill="#E9E2D2" /><rect x={1800} y={700} width={40} height={240} fill="#6A5040" />
  {folded ? <g><rect x={1520} y={730} width={240} height={46} rx={6} fill="#7A6A9A" /><rect x={1520} y={694} width={240} height={40} rx={6} fill="#6A5A8A" /><path d="M1520,694 H1760" stroke="#5E5080" strokeWidth={4} /></g> : <path d="M1160,770 Q1500,720 1820,770 L1820,830 L1160,830Z" fill="#7A6A9A" />}
</g>;
const sabah = (o: { dog?: boolean; eyes?: Eyes } = {}) => (t: number) => <>
  <Oda t={t} />
  {yat(t, 260, 790, 0.9, { eyes: o.eyes ?? "open", mouth: "flat", brow: "worried" })}
  {o.dog !== false && <g transform="translate(470,740) rotate(-6)"><Kopek x={0} y={0} s={0.55} t={t} kind="kara" sleep={0} sit={1} dir={-1} /></g>}
</>;
// kapı önü: içeriden kapı, dışarısı karlı
const KapiOnu: React.FC<{ t: number; mode?: "day" | "dusk" }> = ({ t, mode = "day" }) => <g>
  <rect width={1920} height={1080} fill={mode === "day" ? "#6A5444" : "#3A2E3E"} />
  <rect x={660} y={200} width={600} height={840} fill={mode === "day" ? "#DDE8F2" : "#E8906A"} />
  <g clipPath="url(#kpC)"><defs><clipPath id="kpC"><rect x={660} y={200} width={600} height={840} /></clipPath></defs><g transform="translate(660,200) scale(0.3125,0.78)"><VanSokak t={t} mode={mode} lamp={0} windows={0} snow={1} /></g></g>
  <rect x={640} y={180} width={640} height={30} fill="#3A2A1E" /><rect x={630} y={180} width={34} height={860} fill="#3A2A1E" /><rect x={1256} y={180} width={34} height={860} fill="#3A2A1E" />
  <rect y={1020} width={1920} height={60} fill="#3A2A1E" />
  <Kar t={t} k={0.3} n={40} />
</g>;
// iki çay bardağı: biri soğuyor
const ikiCay = (cool = 0): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 640]}>
  <rect width={1920} height={1080} fill="#7A5A44" /><rect y={760} width={1920} height={320} fill="#9A7458" />
  <InceBardak x={720} y={860} s={2.2} tea={1} saucer={false} /><Buhar x={720} y={560} s={1.4} t={t} k={1} />
  <InceBardak x={1200} y={860} s={2.2} tea={1} saucer={false} /><Buhar x={1200} y={560} s={1.4} t={t} k={1 - (cool > 0 ? ramp(t, a + 0.3, b - 0.3) * cool : 0)} />
</TCam>;
const saat = (h: number, m: number, bg = "#0E1424", m2?: number): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.12]}><rect width={1920} height={1080} fill={bg} /><Saat x={960} y={540} s={2.2} h={h} m={m2 !== undefined ? Math.round(lerp(m, m2, ramp(t, a + 0.3, b - 0.3))) : m} c="#F4EAD6" /></TCam>;
const buz = (text: string, mode: "write" | "read" | "full", night = 0, suK: "none" | "awake" | "asleep" = "none"): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}>
  <BuzluCam t={t} text={text} night={night} k={mode === "write" ? ramp(t, a + 0.2, b - 0.2) : 1} read={mode === "read" ? ramp(t, a + 0.3, b - 0.3) : 0} finger={mode === "write"} />
  {suK !== "none" && <TFig x={520} y={1180} s={1.4} o={SU} t={t} pose={P.hand} eyes={suK === "asleep" ? "closed" : "open"} mouth="flat" rim={0.3} />}
</TCam>;
const avuc = (code: string, write = false, night = 1): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 620]}><Avuc t={t} code={code} night={night} k={write ? ramp(t, a + 0.3, b - 0.3) : 1} /></TCam>;
const mors = (text: string, hand: "defne" | "bora", mode: "in" | "read" | "full" = "in", bg: (t: number) => React.ReactNode = radyoOn()): R => (t, a, b) => <><TCam t={t} a={a} b={b} z={[1, 1.06]}>{bg(t)}</TCam>{svg(<RadyoMors t={t} text={text} hand={hand} k={mode === "in" ? ramp(t, a + 0.2, b - 0.2) : 1} read={mode === "read" ? ramp(t, a + 0.3, b - 0.3) : mode === "full" ? 1 : 0} />)}</>;
const KagitYaz: React.FC<{ lines: string[] }> = ({ lines }) => <><rect width={1920} height={1080} fill="#4A3A2E" /><g transform="translate(960,560) scale(2.4)"><Kagit x={0} y={0} lines={lines} /></g></>;
const isim = (n: string) => <g><rect x={-190} y={-60} width={380} height={120} rx={60} fill="#FFFFFF" /><text y={22} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={60} fill="#E0393E">{n}</text></g>;
const Seri: React.FC<{ t: number; a: number; on: number }> = ({ t, a, on }) => <g>{[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${560 + i * 200},640)`} opacity={ramp(t, a + 0.2 + i * 0.12, a + 0.5 + i * 0.12)}><rect x={-80} y={-80} width={160} height={160} rx={24} fill={i < on ? "#1FC8B4" : i === on ? "#F6C445" : "#2A3650"} /><text y={26} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={80} fill="#0E1A2E">{i === 4 ? "F" : i + 1}</text></g>)}</g>;
const Sayac: React.FC<{ t: number; a: number; marks: string[]; times?: number[] }> = ({ t, a, marks, times }) => { const sp = Math.max(260, Math.max(...marks.map((m) => m.length)) * 120 + 80); return <g>{marks.map((m, i) => <text key={i} x={960 + (i - (marks.length - 1) / 2) * sp} y={600} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={180} fill="#F6C445" stroke="#0E1A2E" strokeWidth={10} paintOrder="stroke" opacity={ramp(t, (times?.[i] ?? a + 0.4 + i * 0.6), (times?.[i] ?? a + 0.4 + i * 0.6) + 0.2)}>{m}</text>)}</g>; };
const sayac3 = (): R => (t, a, b) => svg(<Sayac t={t} a={a} marks={["1", "2", "3"]} times={[a + (b - a) * 0.25, a + (b - a) * 0.45, a + (b - a) * 0.65]} />);
// Bayram seni yakandan kaldırır
const kaldir = (t: number, bx: number, o: { f?: Face; sf?: Face; walkTo?: [number, number, number]; bg?: boolean } = {}) => {
  const x = o.walkTo ? wx(t, o.walkTo[0], o.walkTo[1], bx, o.walkTo[2], BS) : bx;
  const bf = o.walkTo ? toonWalk(t, o.walkTo[0], o.walkTo[1], bx, o.walkTo[2], BS) : null;
  return <>
    {bf ? <TFig x={x} y={G} s={BS} o={BAYRAM} t={t} dir={bf.dir} walk={bf.walk} pose={KALDIR} rim={0.3} mouth="grin" {...(o.f ?? {})} /> : bay(t, x, BS, { pose: KALDIR, mouth: "grin", ...(o.f ?? {}) })}
    {sen(t, x + 206, 1, { pose: P.shock, mouth: "o", eyes: "wide", brow: "worried", bob: 0, ...(o.sf ?? {}) }, G - 206 + Math.sin(t * 5) * 4)}
  </>;
};
// mama kavgası
const kavga = (k: number, o: { bay?: Face; dogBite?: boolean } = {}) => (t: number) => <>
  {evGun(t)}
  <MamaCuval x={960} y={1010} s={1} t={t} k={k} pullL={Math.sin(t * 9) * (k < 0.05 ? 1 : 0)} pullR={-Math.sin(t * 9) * (k < 0.05 ? 1 : 0)} />
  <Kopek x={600 - k * 60} y={1040} s={0.75} t={t} kind="kara" dir={1} bark={k > 0.5 ? 1 : 0} />
  {bay(t, 1360 + k * 60, BS, { pose: P.reach, dir: -1, mouth: "open", brow: "angry", talk: k < 0.1, sweat: true, ...(o.bay ?? {}) })}
</>;
// şehir penceresi: yüz binlerce ev, baca tütmüyor
const sehir = (mode: "day" | "dusk" = "day") => (t: number) => <><VanGolu t={t} mode={mode} /><g transform="translate(0,280) scale(1,0.6)"><VanSokak t={t} mode={mode} lamp={0} windows={0} steps={false} snow={1} /></g></>;
// Asya karda yürür
const asyaGel = (t: number, a: number, b: number, o: { x0?: number; x1?: number; phone?: boolean } = {}) => <>
  {sokak("day", { fall: 0.4 })(t)}
  {walk(t, a, b, ASYA, o.x0 ?? 1900, o.x1 ?? 1250, 1, { pose: o.phone === false ? P.stand : P.phone, mouth: "smile", talk: true })}
</>;
const vlogYuz = (t: number, mouth: Mouth = "smile", talk = true) => <g transform="translate(0,300)"><rect x={-134} y={-580} width={268} height={560} fill="#DCE6F0" /><TFig x={0} y={300} s={1.25} o={ASYA} t={t} mouth={mouth} talk={talk} rim={0.2} /></g>;
// Şahin içi (gece): sağ şoför = sen, sol = Bayram; köpek arkada
const sahinIci = (sF: Face = {}, bF: Face = {}, o: { kind?: "tipi" | "gol" | "bozkir"; mode?: "night" | "storm"; z?: [number, number]; c?: [number, number] } = {}): R => (t, a, b) => <TCam t={t} a={a} b={b} z={o.z ?? [1, 1.06]} c0={o.c ?? [960, 560]}>
  <ArabaIci t={t} mode={o.mode ?? "night"} kind={o.kind ?? "gol"} move snow={1}
    left={<TFig x={700} y={1060} s={1.15} o={BAYRAM} t={t} pose={P.sit} rim={0.3} {...bF} />}
    right={<TFig x={1220} y={1060} s={1.15} o={SEN} t={t} pose={P.hold} rim={0.3} dir={-1} {...sF} />}
    dog={<Kopek x={960} y={760} s={0.85} t={t} kind="kara" sit={1} />} /></TCam>;
// Şahin dışarıdan
const SahinDis: React.FC<{ t: number; x?: number; move?: boolean; lights?: number; mode?: "night" | "day" }> = ({ t, x = 960, move = true, lights = 1 }) => <Kamyonet x={x} y={1000} s={0.75} t={t} c="#B8BFC6" lights={lights} speed={move ? 1 : 0} snow={1}
  front={<TFig x={0} y={50} s={0.28} o={SEN} t={t} pose={P.sit} rim={0.3} />} back={<TFig x={0} y={50} s={0.28} o={BAYRAM} t={t} pose={P.sit} rim={0.3} />} />;
const gece = (kind: "gol" | "tipi" | "bozkir" = "gol", storm = false) => (t: number) => <><YolSahne t={t} kind={kind} mode="night" px={t * 420} snow={1} fall={storm ? 1 : 0.5} stars={storm ? 0 : 1} road /><SahinDis t={t} x={900} />{storm && <Kar t={t} k={1} wind={2.5} n={220} />}</>;
// depo içi + Defne
const depo = (o: { shiver?: number; blue?: number; eyes?: number; sen?: boolean; beam?: number } = {}) => (t: number) => <DepoIci t={t} beam={o.beam ?? 1} frost={1} breath={o.sen ? 1 : 0}
  girl={<>{<Battaniye x={1180} y={860} s={1} t={t} shiver={o.shiver ?? 0} blue={o.blue ?? 1} eyes={o.eyes ?? 0} />}{o.sen && diz(sen, t, 760, 1, { pose: P.reach, mouth: "o", brow: "worried", eyes: "wide" }, 880)}</>} />;
// araba içinde sarılma (yan görünüş): sen + Defne arka koltukta
const Sarilma: React.FC<{ t: number; shiver?: number; dEyes?: Eyes; dog?: number; dMouth?: Mouth; sMouth?: Mouth; close?: number }> = ({ t, shiver = 0, dEyes = "closed", dog = 0, dMouth = "flat", sMouth = "flat", close = 0 }) => {
  const sh = shiver > 0 ? Math.sin(t * 50) * 3 * shiver : 0;
  return <g>
    <rect width={1920} height={1080} fill="#1E2638" />
    <rect x={300} y={160} width={1320} height={360} rx={60} fill="#0E1626" /><Kar t={t} k={0.4} n={50} />
    <rect x={200} y={600} width={1520} height={480} rx={70} fill="#34405A" />
    <circle cx={960} cy={540} r={500} fill="#E0566A" opacity={0.06} />
    <g transform={`translate(${sh},0)`}>{otur(defm, t, 1060 - close * 60, 720, 1.2, { eyes: dEyes, mouth: dMouth, dir: -1, pose: SARIL })}</g>
    {otur(sen, t, 760 + close * 60, 720, 1.2, { mouth: sMouth, eyes: "open", brow: "worried", pose: SARIL })}
    {dog > 0 && <g opacity={dog}><Kopek x={910} y={lerp(1200, 900, dog)} s={0.9} t={t} kind="kara" sit={1} wag={1} /></g>}
  </g>;
};
const Hipotermi: React.FC<{ t: number; a: number; good?: boolean }> = ({ t, a, good = false }) => <g>
  <rect width={1920} height={1080} fill="#0E1A2E" />
  {["1. ÜŞÜME → TİTREME", "2. DAHA ÇOK SOĞUMA →", "TİTREME DURUR ⚠"].map((l, i) => <text key={i} x={960} y={360 + i * 150} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={78} fill={i === 2 ? "#E0393E" : "#FFFFFF"} opacity={ramp(t, a + 0.3 + i * 0.8, a + 0.6 + i * 0.8)}>{l}</text>)}
  {good && <text x={960} y={880} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={80} fill="#3BE07A">TİTREME GERİ GELDİ = İYİ ✓</text>}
</g>;
const Kefal1: React.FC<{ t: number }> = ({ t }) => <g>
  <rect width={1920} height={1080} fill="#1E4A6E" />
  {Array.from({ length: 30 }, (_, i) => <circle key={i} cx={(i * 263) % 1920} cy={1080 - ((t * 60 + i * 97) % 1080)} r={6 + (i % 4) * 3} fill="#FFFFFF" opacity={0.25} />)}
  <g transform={`translate(${960 + Math.sin(t) * 40},560) scale(2.2)`}>
    <path d="M-200,0 Q-80,-80 120,0 Q-80,80 -200,0Z" fill="#C9D6E2" /><path d="M120,0 L200,-60 L200,60Z" fill="#A9B8C6" />
    <circle cx={-140} cy={-10} r={12} fill="#0E1A2E" /><path d="M-60,-30 Q0,-10 60,-20" stroke="#8A9AAA" strokeWidth={4} fill="none" />
  </g>
</g>;
// kapı önündeki sandalye + Bayram (oturur, saate bakar)
const kapiBay = (fc: Face = {}) => (t: number) => <>
  <KapiOnu t={t} />
  <rect x={850} y={880} width={220} height={20} fill="#6A4A30" /><rect x={860} y={900} width={16} height={130} fill="#6A4A30" /><rect x={1044} y={900} width={16} height={130} fill="#6A4A30" /><rect x={1040} y={700} width={20} height={200} fill="#6A4A30" />
  {otur(bay, t, 960, 880, BS, { mouth: "flat", eyes: "squint", look: -1, lookY: -0.6, ...fc })}
  <Saat x={300} y={300} s={0.9} h={15} m={40} c="#F4EAD6" />
</>;

// ── SAAT HUD ──
const toMin = (c: string) => { const [h, m] = c.split(":").map(Number); return h * 60 + m; };
const SaatHUD: React.FC<{ t: number; clk: string }> = ({ t, clk }) => {
  const m = toMin(clk);
  const night = m >= 16 * 60 + 30 || m < 3 * 60 + 14;
  const left = (3 * 60 + 14 - m + 1440) % 1440;
  return <g transform="translate(1500,44)">
    <rect x={0} y={0} width={380} height={night ? 116 : 80} rx={18} fill="#0E1A2E" opacity={0.82} stroke={night ? "#E0393E" : "#2EE6D0"} strokeWidth={3} />
    <text x={22} y={52} fontFamily="Poppins" fontWeight={800} fontSize={36} fill={night ? "#F6C445" : "#2EE6D0"}>{clk}</text>
    <text x={150} y={50} fontFamily="Poppins" fontWeight={700} fontSize={22} fill="#FFFFFF" opacity={0.8}>{night ? "GECE OLAN SEN" : "GÜNDÜZ"}</text>
    {night && <text x={22} y={96} fontFamily="Poppins" fontWeight={800} fontSize={24} fill="#E0393E" opacity={0.75 + 0.25 * Math.sin(t * 4)}>03:14'E {Math.floor(left / 60)} SA {left % 60} DK</text>}
  </g>;
};

const SHOTS: Sh[] = [
  // ── KANCA · KÜÇÜK RESİM ──
  { c: "Van. Karla", hud: false, sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 640]}>{kapak(t, a, b + 40, { dream: 0 })}</TCam> },
  { c: "Bir kız, karın", hud: false, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.7]} c0={[640, 760]}>{kapak(t, a, b + 36, { dream: 0 })}</TCam> },
  { c: "Elinde bir gül", hud: false, tone: "warm", r: cam([1.2, 1.35], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#DCE6F0" /><Kar t={t} k={0.4} /><g transform="translate(960,820)">{gul(2.6)}</g></>), html: tg("PLASTİK BİR GÜL", T.pink) },
  { c: "Ve sana uzatıyor", hud: false, tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[800, 700]}>{kapak(t, a, b + 30, { dream: 0 })}</TCam> },
  { c: "Madem dünyada", hud: false, tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[640, 640]}>{kapak(t, a, b + 28, { dream: 0, asyF: { talk: true } })}</TCam>, html: q("“MADEM DÜNYADA SON KALANLAR BİZİZ… BAŞTAN BAŞLAYALIM. SENİNLE.”", 60, 0.1, 920) },
  { c: "Ama sen ona bakmıyorsun", hud: false, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[1000, 560]} c1={[1100, 560]}>{kapak(t, a, b + 24, { dream: 0 })}</TCam>, html: q("GÖZÜN, SOKAĞIN EN SONUNDA.", 84, 0.5) },
  { c: "Orada, hayalinde", hud: false, sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[1100, 700]}>{kapak(t, a - 2, b + 20)}</TCam>, html: tg("HAYAL: DEFNE + BORA", T.red) },
  { c: "Ve sen, hâlâ cevap", hud: false, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 620]}>{kapak(t, a - 6, b + 16)}</TCam>, html: q("VE SEN, HÂLÂ CEVAP VERMEDİN.", 84, 0.3, 140) },
  { c: "Aynı gün, şehrin", hud: false, tone: "night", r: cam([1, 1.08], [960, 600], undefined, depo({ beam: 0.2, eyes: 1, blue: 0.5 })), html: big("AYNI GÜN · ŞEHRİN BAŞKA BİR YERİ", "#FFFFFF", 70) },
  { c: "Nefes, buhar olup", hud: false, tone: "night", r: cam([2.4, 2.6], [880, 760], undefined, depo({ beam: 0.2, eyes: 1, blue: 0.5 })), html: tg("NEFES = BUHAR · İÇERİSİ DONDURUCU", T.blue) },
  { c: "Titreyen iki parmak", hud: false, sfx: "tick", tone: "night", r: cam([1.2, 1.3], [960, 600], undefined, (t) => <><rect width={1920} height={1080} fill="#101826" /><Telsiz x={960} y={640} s={2} t={t} led={1} hand="#E8B892" /></>), html: q("KISA. UZUN.", 100, 0.5) },
  { c: "Kapının arkasından", hud: false, tone: "night", r: cam([1, 1.08], [960, 600], undefined, depo({ beam: 0, eyes: 1, blue: 0.5 })), html: q("“KİME YAZIYORSUN, DEFNE?”", 100, 0.35) },
  { c: "Ve bir fener ışığı", hud: false, sfx: "boom", tone: "night", r: cam([1.3, 1.4], [800, 800], undefined, (t, a) => <>{depo({ beam: ramp(t, a + 0.3, a + 1.2), eyes: 1, blue: 0.5 })(t)}<rect x={0} y={1000} width={1920} height={10} fill="#FFF3C0" opacity={0.6} /></>) },
  { c: "Bu gece, saat üçü", hud: false, tone: "night", r: saat(3, 14), html: q("03:14 → UYKU", 100, 0.2, 900) },
  { c: "Ve uyursan", hud: false, sfx: "boom", tone: "night", ...kartTxt("VE UYURSAN…", "ONU BİR DAHA BULAMAYABİLİRSİN.", "#FFFFFF", "#E0393E", "#0A0D14") },
  { c: "Bu, Dünyada Son İki", hud: false, tone: "cool", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="DÜNYADA SON İKİ KİŞİ" y={240} size={86} color="#FFFFFF" />{svg(<Seri t={t} a={a + 0.4} on={3} />)}<Txt t={t} at={a + 2} text="4. BÖLÜM · SONRAKİ: FİNAL" y={820} size={64} color="#F6C445" /></> },
  { c: "Siz Devam yazdınız", hud: false, sfx: "ding", tone: "gold", r: kart("#1A2440"), html: (t, a) => <><Txt t={t} at={a + 0.1} text="SİZ “DEVAM” YAZDINIZ." y={380} size={96} /><Txt t={t} at={a + 1.3} text="BİZ DEVAM ETTİK. BAŞLIYORUZ." y={540} size={76} color="#F6C445" /></> },

  // ── SABAH ──
  { c: "Sabah. Gözlerini", g: "08:20", tone: "cool", r: cam([1, 1.08], [700, 700], undefined, sabah()), html: big("SABAH", "#FFFFFF", 100) },
  { c: "Göğsünde ağır bir şey", g: "08:20", tone: "warm", r: cam([2.2, 2.4], [420, 720], undefined, sabah()), html: tg("KARABAŞ", T.yellow) },
  { c: "Defne'nin yatağı boş", g: "08:21", tone: "cool", r: cam([1.2, 1.3], [1480, 720], [1600, 720], (t) => <Oda t={t} />), html: tg("YATAK BOŞ", T.red) },
  { c: "Köşeleri tam", g: "08:21", tone: "cool", r: cam([3, 3.3], [1640, 730], undefined, (t) => <Oda t={t} />), html: q("KÖŞELERİ TAM ÜST ÜSTE. HEP YAPTIĞI GİBİ.", 72, 0.2) },
  { c: "Avucunda tuhaf", g: "08:21", tone: "night", r: avuc(".-.", false, 0), html: q("KISA. UZUN. KISA.", 96, 0.4) },
  { c: "Aşağıdan hiç ses", g: "08:22", tone: "cool", r: cam([1, 1.06], [960, 560], undefined, (t) => <>{evGun(t)}</>), html: q("NE KAHKAHA. NE ŞINGIRTI.", 84, 0.4) },
  { c: "Merdivenlerden iniyorsun", g: "08:23", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{evGun(t)}{bay(t, 1300, BS, { dir: 1, mouth: "flat", look: 1 })}{walk(t, a, b, SEN, 120, 600, 1, { mouth: "flat", brow: "worried" })}</TCam> },
  { c: "Kamyonet yok", g: "08:23", tone: "cool", r: kart("#0E1A2E"), html: (t, a) => <>{["KAMYONET ✗", "BORA ✗", "DEFNE ✗"].map((l, i) => <Txt key={l} t={t} at={a + 0.2 + i * 0.6} text={l} y={300 + i * 150} size={96} color={i === 2 ? "#E0393E" : "#FFFFFF"} />)}</> },
  { c: "Gitti, evlat", g: "08:23", tone: "cool", r: cam([2.2, 2.4], [1300, 520], undefined, (t) => <>{evGun(t)}{bay(t, 1300, BS, { dir: 1, mouth: "flat", talk: true, look: 1 })}</>), html: q("“GİTTİ, EVLAT. GECE. BORA'YLA.”", 90, 0.2) },
  { c: "Kapıya koşuyorsun", g: "08:24", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><KapiOnu t={t} />{walk(t, a, b, SEN, 200, 820, 1, { pose: P.run, mouth: "open" })}</TCam>, html: tg("MONTSUZ", T.blue) },
  { c: "Ama kapının önünde", g: "08:24", sfx: "knock", tone: "cool", r: cam([1.1, 1.2], [960, 600], undefined, (t) => <><KapiOnu t={t} />{bay(t, 960, BS, { pose: P.hips, mouth: "flat", brow: "angry" })}{sen(t, 560, 1, { pose: P.shock, mouth: "o" })}</>), html: tg("BİR KAPI KADAR GENİŞ OMUZLAR", T.orange) },
  { c: "Akşamdan önce olmaz", g: "08:24", tone: "warm", r: cam([2.2, 2.4], [960, 480], undefined, (t) => <><KapiOnu t={t} />{bay(t, 960, BS, { pose: P.hips, mouth: "flat", brow: "angry", talk: true })}</>), html: q("“AKŞAMDAN ÖNCE OLMAZ.”", 100, 0.1) },
  { c: "Neden", g: "08:24", tone: "warm", r: cam([2.2, 2.4], [560, 560], undefined, (t) => <><KapiOnu t={t} />{sen(t, 560, 1, { pose: P.shrug, mouth: "open", talk: true, brow: "angry" })}</>), html: q("“NEDEN?”", 110, 0.05) },
  { c: "Çünkü ben öyle", g: "08:24", sfx: "ding", tone: "gold", r: cam([2.6, 2.8], [960, 470], undefined, (t) => <><KapiOnu t={t} />{bay(t, 960, BS, { pose: P.point, mouth: "grin", eyes: "squint", talk: true })}</>), html: big("“ÇÜNKÜ BEN ÖYLE DİYORUM.”", "#F6C445", 86, 860) },
  { c: "Yanından geçmeye", g: "08:25", sfx: "boing", tone: "warm", r: cam([1, 1.08], [1000, 600], undefined, (t) => <><KapiOnu t={t} />{kaldir(t, 760)}</>), html: tg("TEK ELLE", T.orange) },
  { c: "Bir. İki. Üç adım", g: "08:25", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{evGun(t)}{kaldir(t, 500, { walkTo: [a + 0.3, b - 0.3, 900] })}</TCam>, html: sayac3() },
  { c: "yıl yağlı güreş", g: "08:25", tone: "gold", ...kartTxt("40 YIL YAĞLI GÜREŞ:", "SABAH SPORU.", "#F6C445", "#FFFFFF", "#3A2414") },
  { c: "Seni sandalyeye", g: "08:26", tone: "warm", r: cam([1.3, 1.4], [960, 620], undefined, (t) => <>{evGun(t)}{otur(sen, t, 760, 800, 1, { mouth: "frown", brow: "angry" })}{bay(t, 1180, BS, { pose: P.point, mouth: "grin", dir: -1, talk: true })}</>), html: q("“ÜÇ SIFIR.”", 110, 0.3) },
  { c: "Önce iç", g: "08:26", tone: "warm", r: cam([2, 2.2], [1180, 480], undefined, (t) => <>{evGun(t)}{bay(t, 1180, BS, { pose: P.hand, mouth: "smile", dir: -1, talk: true, holdR: cay(0.5) })}</>), html: q("“ÖNCE İÇ. SONRA KIZARSIN.”", 96, 0.15) },
  { c: "Çayı içmiyorsun", g: "08:27", tone: "cool", r: ikiCay(0), html: tg("İKİ BARDAK", T.yellow) },
  { c: "Birini Bayram Dayı", g: "08:27", tone: "cool", r: cam([2, 2.2], [1200, 700], undefined, (t) => <><rect width={1920} height={1080} fill="#7A5A44" /><rect y={760} width={1920} height={320} fill="#9A7458" /><InceBardak x={1200} y={860} s={2.2} tea={1} saucer={false} /><Buhar x={1200} y={560} s={1.4} t={t} /></>), html: tg("DEFNE İÇİN", T.pink) },
  { c: "O bardak, gözünün", g: "08:28", tone: "cool", r: ikiCay(1), html: q("BUHAR ÖNCE İNCELİYOR. SONRA BİTİYOR.", 74, 0.5) },
  { c: "Üstündeki buhar önce", r: (t, a, b) => again("O bardak, gözünün", t, a, b, 0) },
  { c: "Gündüz olan sen, normalde", g: "08:30", tone: "cool", r: cam([2.2, 2.4], [760, 560], undefined, (t) => <>{evGun(t)}{otur(sen, t, 760, 800, 1, { mouth: "flat", brow: "worried", eyes: "squint" })}</>), html: q("İLK KEZ, GÜNDÜZ DE SUSUYORSUN.", 80, 0.55) },
  { c: "Bugün hiçbir şey", r: (t, a, b) => again("Gündüz olan sen, normalde", t, a, b, 0) },
  { c: "Bilmeyenler için", g: "08:30", tone: "cool", r: cam([1, 1.1], [960, 520], undefined, (t) => <VanGece t={t} bulb={0} gen={0} />), html: tg("BİR GECEDE: HERKES KAYBOLDU", T.red) },
  { c: "Sen, güneş batınca", g: "08:30", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[700, 640]}>{sokak("night")(t)}{sen(t, 700, 1, { mouth: "flat", eyes: "squint", brow: "angry" })}</TCam><GeceModu t={t} a={a} k={ramp(t, a + 0.3, a + 1)} /></>, html: q("GÜNEŞ BATINCA: DÜNYANIN EN ZEKİ İNSANI", 70, 0.15) },
  { c: "Sonra ölü gibi", g: "08:30", tone: "night", r: saat(3, 14), html: q("03:14 → ÖLÜ GİBİ UYKU", 84, 0.1, 960) },
  { c: "Ve Defne, her gece", g: "08:31", tone: "night", r: cam([1.4, 1.5], [960, 620], undefined, (t) => <>{radyo({ beam: 0.3 })(t)}<g transform="rotate(-82 760 1030)">{sen(t, 760, 0.9, { eyes: "closed", mouth: "flat" }, 1030)}</g>{otur(defm, t, 1200, 860, 1, { mouth: "flat", eyes: "open", dir: -1, look: -1 })}</>), html: q("SEN UYURKEN, O UYANIK.", 84, 0.4) },
  { c: "Belki de bu yüzden", g: "08:31", tone: "night", r: cam([2.4, 2.6], [1200, 520], undefined, (t) => <>{radyo({ beam: 0.3 })(t)}{otur(defm, t, 1200, 860, 1, { mouth: "flat", eyes: "squint", dir: -1, look: -1 })}</>), html: q("GİDİŞİNİ GÖREMEDİN.", 90, 0.4) },
  { c: "Su yanına oturuyor", g: "08:33", tone: "warm", r: cam([1.4, 1.5], [860, 640], undefined, (t) => <>{evGun(t)}{otur(sen, t, 760, 800, 1, { mouth: "flat", brow: "worried" })}{otur(su, t, 960, 840, SS, { mouth: "none", look: -1, pose: P.hand })}</>), html: tg("SAPSARI MONT · CEP", T.yellow) },
  { c: "Bir saç tokası", g: "08:33", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><TokaAvuc t={t} k={ramp(t, a + 0.2, a + 1)} /></TCam>, html: q("DEFNE'NİN TOKASI.", 96, 0.45) },
  { c: "Bayram Dayı bodruma", g: "08:35", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><Bodrum t={t} beam={0.8} cans={0} truck={false} />{bay(t, 960, BS, { mouth: "o", eyes: "wide", brow: "worried" })}</TCam>, html: tg("BIYIĞI TİTRİYOR", T.blue) },
  { c: "Benim bodrumumda", g: "08:35", tone: "warm", r: cam([2.2, 2.4], [960, 480], undefined, (t) => <><Bodrum t={t} beam={0.8} cans={0} truck={false} />{bay(t, 960, BS, { mouth: "open", brow: "angry", talk: true, pose: P.shrug })}</>), html: q("“BEN DE O KAPIDAN KAMYONET GİRMEZ SANIYORDUM.”", 66, 0.4) },
  { c: "bidon mazot da gitmiş", g: "08:36", tone: "cool", r: cam([1, 1.1], [960, 700], undefined, (t) => <Bodrum t={t} beam={0.9} cans={0} truck={false} />), html: (t, a) => <><Txt t={t} at={a + 0.2} text="40 BİDON MAZOT ✗" y={120} size={80} color="#E0393E" /><Txt t={t} at={a + 1.4} text="AKÜ ✗" y={240} size={80} color="#E0393E" /></> },
  { c: "Radyo, o aküyle", g: "08:36", tone: "night", r: cam([1.4, 1.6], [900, 700], undefined, (t) => <><rect width={1920} height={1080} fill="#1E2A3A" /><Radyo x={900} y={800} s={1.5} t={t} on={0} voice={0} /></>), html: tg("RADYO: SUSTU", T.red) },
  { c: "Yani dünyaya sesini", g: "08:36", tone: "night", r: cam([1, 1.1], [960, 640], undefined, (t) => <Plan t={t} k={1} names={1} />), html: q("BORA'NIN PLANI DA TAM OLARAK BUYDU.", 76, 0.5) },

  // ── ÖĞLE · MAMA ÇUVALI ──
  { c: "Öğlene doğru", g: "12:05", tone: "warm", r: cam([1, 1.06], [960, 600], undefined, kavga(0)), html: big("ÖĞLE · YİNE KAVGA", "#FFFFFF", 86) },
  { c: "Bu sefer kavga", g: "12:05", tone: "warm", r: cam([1.8, 2], [960, 800], undefined, kavga(0)), html: tg("SUCUK DEĞİL · MAMA ÇUVALI", T.orange) },
  { c: "Karabaş çuvalı dişleriyle", g: "12:06", tone: "warm", r: cam([1.3, 1.4], [960, 700], undefined, kavga(0, { bay: { talk: true } }), 3), html: q("“BIRAK ONU! DAHA ÖĞLEN OLMADI!”", 84, 0.4) },
  { c: "Çuval ortadan yırtılıyor", g: "12:06", sfx: "boom", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 820]}>{kavga(ramp(t, a + 0.2, b - 0.2), { bay: { mouth: "o", eyes: "wide" } })(t)}</TCam>, html: tg("İÇİNDEN: İKİ BİDON", T.red) },
  { c: "Mazot. İki bidon", g: "12:06", sfx: "ding", tone: "gold", r: cam([1.8, 2], [960, 900], undefined, kavga(1, { bay: { mouth: "o", eyes: "wide" } })), html: big("MAZOT · AĞZINA KADAR DOLU", "#F6C445", 84) },
  { c: "Bayram Dayı bidonlara", g: "12:07", tone: "warm", r: cam([2, 2.2], [1360, 520], undefined, kavga(1, { bay: { mouth: "smile", eyes: "squint", talk: true } })), html: q("“DEMEK SEN SAKLADIN. AFERİN. AMA SUCUK YİNE YOK.”", 62, 0.25) },
  { c: "diyor. Aferin. Ama", r: (t, a, b) => again("Bayram Dayı bidonlara", t, a, b, 0) },
  { c: "Su pencereye gidiyor", g: "12:08", tone: "warm", r: buz("RADYO", "write", 0, "awake"), html: tg("KISA-UZUN-KISA…", T.hero) },
  { c: "uzun, kısa. Kısa", r: (t, a, b) => again("Su pencereye gidiyor", t, a, b, 0) },
  { c: "Uzun, kısa, uzun", r: (t, a, b) => again("Su pencereye gidiyor", t, a, b, 1) },
  { c: "Geçen bölümlerde camı", g: "12:08", tone: "warm", r: buz("RADYO", "read"), html: q("ŞİMDİ SEN OKUYORSUN.", 80, 0.2, 140) },
  { c: "R, A, D", r: (t, a, b) => again("Geçen bölümlerde camı", t, a, b, 0) },
  { c: "Radyo. Ve avucundaki", g: "12:09", sfx: "ding", tone: "gold", r: avuc(".-.", false, 0), html: q("R = RADYO. DEFNE'NİN BİTİREMEDİĞİ KELİME.", 70, 0.3) },
  { c: "Kısa, uzun, kısa", r: (t, a, b) => again("Radyo. Ve avucundaki", t, a, b, 0) },
  { c: "Geçen bölümde size", g: "12:09", hud: false, tone: "cool", r: kart("#1A2440"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="“DEFNE AVUCUNA NE YAZDI?”" y={260} size={86} /><Txt t={t} at={a + 2.2} text="EN ÇOK BEĞENİLEN: RİZE 😅" y={470} size={70} color="#F6C445" /></> },
  { c: "Ama doğru bilenler", g: "12:09", hud: false, sfx: "ding", tone: "gold", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="DOĞRU BİLENLER:" y={220} size={80} color="#2EE6D0" />{svg(<g><g transform={`translate(700,520) scale(${ramp(t, a + 1, a + 1.4)})`}>{isim("HÜSEYİN")}</g><g transform={`translate(1220,520) scale(${ramp(t, a + 1.4, a + 1.8)})`}>{isim("LALİSA")}</g></g>)}<Txt t={t} at={a + 2.4} text="“RADYO” ✓ · TEBRİKLER! İLK ZAFER SİZİN." y={780} size={66} color="#F6C445" /></> },
  { c: "Bayram Dayı bidonları jeneratöre", g: "12:20", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}><rect width={1920} height={1080} fill="#3A3E46" /><rect y={940} width={1920} height={140} fill="#2A2E34" /><Jenerator x={760} y={960} t={t} pull={Math.max(0, Math.sin((t - a) * 3)) * ramp(t, a + 1, a + 1.3)} />{bay(t, 1220, BS, { pose: P.reach, dir: -1, mouth: "open", brow: "angry", sweat: true })}</TCam>, html: (t, a, b) => svg(<Sayac t={t} a={a} marks={["1", "2", "3"]} times={[a + (b - a) * 0.35, a + (b - a) * 0.55, a + (b - a) * 0.75]} />) },
  { c: "Üçüncüde, jeneratör", g: "12:21", sfx: "boom", tone: "gold", r: cam([1.2, 1.3], [760, 760], undefined, (t, a) => <><rect width={1920} height={1080} fill="#3A3E46" /><rect y={940} width={1920} height={140} fill="#2A2E34" /><Jenerator x={760} y={960} t={t} on={ramp(t, a + 0.4, a + 0.8)} />{bay(t, 1220, BS, { pose: P.cheer, dir: -1, mouth: "grin", eyes: "happy" })}</>), html: tg("ÇALIŞIYOR ✓", T.green) },
  { c: "Ampuller titreyerek", g: "12:21", tone: "gold", r: cam([1, 1.08], [960, 540], undefined, (t, a) => <>{radyoOn({ bulb: ramp(t, a + 0.2, a + 1.4) })(t)}<Ampul x={960} y={420} t={t} on={1} flick={1 - ramp(t, a + 0.4, a + 1.6)} /></>), html: tg("RADYO: KIRMIZI IŞIK ●", T.red) },
  { c: "Ve hoparlörden önce", g: "12:22", sfx: "static", tone: "night", r: cam([1.4, 1.6], [900, 700], undefined, (t) => <><rect width={1920} height={1080} fill="#1E2A3A" /><Radyo x={900} y={800} s={1.5} t={t} on={1} voice={0.5} /></>), html: q("HIŞIRTI… TIKIRTI. KISA. KISA. UZUN.", 76, 0.3) },
  { c: "Biri, bir yerden", g: "12:22", sfx: "drone", tone: "night", ...kartTxt("BİRİ, BİR YERDEN,", "BU RADYOYA YAZIYOR.", "#FFFFFF", "#2EE6D0") },
  { c: "Kâğıt kalem buluyorsun", g: "12:23", tone: "warm", r: cam([1.3, 1.4], [800, 600], undefined, (t) => <>{radyoOn()(t)}{otur(sen, t, 760, 860, 1, { mouth: "flat", eyes: "squint", brow: "worried", pose: P.hold, sweat: true })}</>), html: tg("GÜNDÜZ: MORS = YAVAŞ BİR DİL", T.yellow) },
  { c: "Bayram Dayı omzunun", g: "12:23", tone: "warm", r: cam([1.6, 1.8], [940, 520], undefined, (t) => <>{radyoOn()(t)}{otur(sen, t, 760, 860, 1, { mouth: "flat", eyes: "squint", pose: P.hold })}{bay(t, 1060, BS, { mouth: "smile", talk: true, dir: -1, eyes: "squint" })}</>), html: q("“BU EL, DEFNE'NİN ELİ. UZUNLARI HEP UZUN TUTAR.”", 64, 0.2) },
  { c: "Ve kâğıtta harfler", g: "12:24", tone: "night", r: mors("İYİYİM ARAMA", "defne", "read"), html: tg("DEFNE'NİN ELİ: UZUNLAR UZUN", T.hero) },
  { c: "ye, i, ye", r: (t, a, b) => again("Ve kâğıtta harfler", t, a, b, 0) },
  { c: "A, re, a", r: (t, a, b) => again("Ve kâğıtta harfler", t, a, b, 1) },
  { c: "İyiyim. Arama. Sadece", g: "12:24", sfx: "boom", tone: "cool", r: kart("#0E1A2E"), html: big("“İYİYİM. ARAMA.”", "#FFFFFF", 130, 440) },
  { c: "Sadece iki kelime", g: "12:25", tone: "cool", r: cam([2.4, 2.6], [760, 560], undefined, (t) => <>{radyoOn()(t)}{otur(sen, t, 760, 860, 1, { mouth: "frown", eyes: "squint", brow: "worried", pose: P.hold })}</>), html: q("BELKİ YANLIŞ SAYDIN. AMA HAYIR.", 80, 0.5) },
  { c: "Karabaş başını dizine", g: "12:25", tone: "cool", r: cam([1.4, 1.5], [960, 680], undefined, (t) => <>{radyoOn()(t)}{otur(sen, t, 760, 860, 1, { mouth: "frown", brow: "worried" })}<Kopek x={960} y={G} s={0.6} t={t} kind="kara" sit={1} dir={-1} />{bay(t, 1500, BS, { dir: 1, mouth: "flat", talk: true, look: 1 })}</>), html: tg("BAYRAM BİR ŞEY MIRILDANIYOR…", T.purple) },
  { c: "Ve sen, o kâğıdı", g: "12:26", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}><KagitYaz lines={["İYİYİM.", "ARAMA."]} /></TCam>, html: q("TIPKI BORA'NIN SENİN NOTUNU CEBİNE KOYDUĞU GİBİ.", 64, 0.4) },

  // ── ÖĞLEDEN SONRA · BAYRAM ŞOV ──
  { c: "Öğleden sonra", g: "14:30", tone: "warm", r: cam([1.2, 1.3], [960, 600], undefined, (t) => <>{evGun(t)}{otur(sen, t, 760, 800, 1, { mouth: "flat" })}{bay(t, 1200, BS, { pose: P.shrug, mouth: "grin", dir: -1, talk: true })}</>), html: tg("PLAN: SENİ GÜLDÜRMEK · KÖTÜ BİR PLAN", T.orange) },
  { c: "Önce sana bir Temel", g: "14:31", tone: "warm", r: cam([2, 2.2], [1200, 480], undefined, (t) => <>{evGun(t)}{bay(t, 1200, BS, { pose: P.think, mouth: "o", dir: -1, eyes: "squint" })}</>), html: (t, a) => <><Txt t={t} at={a + 0.3} text="TEMEL FIKRASI #1… SONU?" y={120} size={74} /><Txt t={t} at={a + 2.2} text="BAŞTAN… SONU? 🤔" y={860} size={74} color="#F6C445" /></> },
  { c: "Sonra barış için", g: "14:32", tone: "warm", r: cam([1.6, 1.8], [1040, 820], undefined, (t) => <>{evGun(t)}{bay(t, 1200, BS, { pose: P.reach, mouth: "smile", dir: -1 })}<Kopek x={880} y={G} s={0.7} t={t} kind="kara" dir={1} bite={<rect x={-40} y={-8} width={80} height={16} rx={8} fill="#B5532E" />} /></>), html: q("KARABAŞ SUCUĞU ALIYOR. PARMAĞI DA BİRAZ.", 70, 0.45) },
  { c: "Belim, diyor", g: "14:32", sfx: "pop", tone: "gold", r: cam([2.4, 2.6], [1200, 480], undefined, (t) => <>{evGun(t)}{bay(t, 1200, BS, { pose: P.think, mouth: "o", dir: -1, brow: "worried", eyes: "wide" })}</>), html: big("“BELİM.” (PARMAĞINI TUTARAK)", "#F6C445", 80, 860) },
  { c: "Ve Su, elleriyle", g: "14:33", sfx: "ding", tone: "gold", r: cam([2.4, 2.6], [960, 860], undefined, (t) => <>{evGun(t)}{su(t, 960, SS, { pose: P.think, eyes: "happy", mouth: "none", bob: Math.sin(t * 20) * 3 })}</>), html: q("BU EVDE GÜLEN TEK KİŞİ, YİNE O.", 80, 0.4) },
  { c: "Bayram Dayı pencereden", g: "14:40", tone: "cool", r: cam([1, 1.08], [960, 560], undefined, sehir("day")), html: tg("YÜZ BİNLERCE EV · HİÇBİR BACA TÜTMÜYOR", T.blue) },
  { c: "Bu şehirde yüz binlerce", g: "14:40", tone: "cool", r: cam([2, 2.2], [960, 480], undefined, (t) => <>{evGun(t)}{bay(t, 960, BS, { mouth: "flat", talk: true, brow: "worried", look: 1 })}</>), html: q("“BİR TEK BİZ Mİ KALDIK? OLMAZ. BEN BUNA İNANMAM. ÇÜNKÜ BEN…”", 58, 0.2) },
  { c: "Bir tek biz", r: (t, a, b) => again("Bu şehirde yüz binlerce", t, a, b, 0) },
  { c: "Tam o sırada dışarıdan", g: "14:41", tone: "cool", r: cam([1, 1.12], [960, 600], undefined, sokak("day", { fall: 0.3 })), html: q("BÜTÜN ŞEHRİN SESSİZLİĞİNDE, TEK BİR SES.", 74, 0.3) },
  { c: "Tık. Tık. Tık", g: "14:41", sfx: "knock", tone: "cool", r: kart("#0E1A2E"), html: (t, a, b) => svg(<Sayac t={t} a={a} marks={["TIK.", "TIK.", "TIK."]} times={[a + 0.1, a + (b - a) * 0.35, a + (b - a) * 0.65]} />) },
  { c: "Topuklu ayakkabı sesi", g: "14:41", tone: "warm", r: cam([2.6, 2.8], [1500, 1000], undefined, (t, a, b) => asyaGel(t, a, b + 6, { phone: false })), html: tg("TOPUKLU 👠", T.pink) },

  // ── ASYA ──
  { c: "Kapıyı açıyorsunuz", g: "14:42", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{asyaGel(t, a, b + 4)}</TCam>, html: tg("KREM KABAN · İPEK EŞARP · İNCİ KÜPE", T.yellow) },
  { c: "Krem rengi uzun", r: (t, a, b) => again("Kapıyı açıyorsunuz", t, a, b, 0) },
  { c: "Ve ayaklarında", g: "14:42", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[1400, 980]} c1={[1300, 980]}>{asyaGel(t, a - 3, b + 1)}</TCam>, html: q("KAR YARIM METRE. TOPUKLU ÇİZME.", 74, 0.3) },
  { c: "Her adımda biraz", r: (t, a, b) => again("Ve ayaklarında", t, a, b, 0) },
  { c: "Bir elinde telefonu", g: "14:43", tone: "warm", r: cam([1.1, 1.2], [960, 540], undefined, (t) => <><rect width={1920} height={1080} fill="#DCE6F0" /><Kar t={t} k={0.4} /><VlogTel x={960} y={540} s={1.5} t={t} face={vlogYuz(t)} viewers={0} /></>), html: q("“GÜNAYDIN TAKİPÇİLERİM. KIYAMETİN… KAÇINCI GÜNÜYDÜ? NEYSE.”", 56, 0.15, 960) },
  { c: "Bugün kıyametin kaçıncı", r: (t, a, b) => again("Bir elinde telefonu", t, a, b, 0) },
  { c: "Sonra sizi görüyor", g: "14:43", tone: "warm", r: cam([2.2, 2.4], [1250, 540], undefined, (t) => <>{sokak("day", { fall: 0.4 })(t)}{asy(t, 1250, 1, { pose: P.shock, mouth: "o", eyes: "wide", dir: -1 })}</>), html: q("“İNSAN MI? GERÇEK İNSAN MI?”", 90, 0.4) },
  { c: "Bayram Dayı bıyığını", g: "14:43", tone: "gold", r: cam([2.2, 2.4], [700, 480], undefined, (t) => <>{sokak("day", { fall: 0.4 })(t)}{bay(t, 700, BS, { pose: P.think, mouth: "grin", eyes: "squint", talk: true })}</>), html: q("“HEM DE EN İYİSİNDEN.”", 96, 0.3) },
  { c: "Kız koşmaya çalışıyor", g: "14:44", sfx: "boing", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{sokak("day", { fall: 0.4 })(t)}<path d={`M1400,1040 l0,-80 l30,0 l0,60 l40,0 l0,20Z`} fill="#7A2E4A" />{asy(t, lerp(1300, 860, ramp(t, a + 0.6, b - 0.4)), 1, { pose: P.cheer, mouth: "grin", eyes: "happy", dir: -1 }, G - Math.abs(Math.sin((t - a) * 9)) * 50)}{sen(t, 640, 1, { mouth: "o", eyes: "wide" })}</TCam>, html: tg("BİR ÇİZME KARDA KALDI", T.pink) },
  { c: "Ve sana sarılıyor", g: "14:44", tone: "warm", r: cam([1.8, 2], [720, 620], undefined, (t) => <>{sokak("day", { fall: 0.4 })(t)}{sen(t, 640, 1, { mouth: "o", eyes: "wide", pose: P.shock })}{asy(t, 800, 1, { pose: SARIL, mouth: "grin", eyes: "closed", dir: -1 })}</>), html: q("HİÇ TANIMADIĞIN BİRİNE. SIKI SIKI.", 80, 0.4) },
  { c: "Adı Asya", g: "14:50", tone: "warm", r: cam([1.8, 2], [960, 500], undefined, (t) => <>{evGun(t)}{asy(t, 960, 1, { mouth: "smile", talk: true })}</>), html: tg("ASYA · İSTANBUL · DÜĞÜN ÇEKİMİ", T.pink) },
  { c: "Düğün sabahı herkes", g: "14:50", tone: "cool", ...kartTxt("DÜĞÜN SABAHI:", "HERKES KAYBOLDU. GELİN DAHİL.", "#FFFFFF", "#F6C445") },
  { c: "O günden beri", g: "14:51", tone: "warm", r: cam([1, 1.1], [960, 600], undefined, (t) => <Otel t={t} />), html: tg("KAHVALTI SOKAĞI · BİR OTEL · TEK BAŞINA", T.yellow) },
  { c: "Her sabah makyajını", g: "14:51", tone: "warm", r: cam([1.2, 1.3], [960, 540], undefined, (t) => <><rect width={1920} height={1080} fill="#E9DCC6" /><VlogTel x={960} y={540} s={1.5} t={t} face={vlogYuz(t, "smile", false)} viewers={0} /></>), html: q("KİMSENİN İZLEMEDİĞİ VİDEOLAR. 👁 0", 74, 0.4) },
  { c: "Neden? diyorsun", g: "14:52", tone: "warm", r: cam([1.4, 1.5], [860, 560], undefined, (t) => <>{evGun(t)}{sen(t, 700, 1, { mouth: "open", talk: true, pose: P.shrug })}{asy(t, 1020, 1, { mouth: "smile", dir: -1 })}</>), html: q("“NEDEN?”", 100, 0.1) },
  { c: "Biri izler diye", g: "14:52", tone: "warm", r: cam([2.4, 2.6], [1020, 500], undefined, (t) => <>{evGun(t)}{asy(t, 1020, 1, { mouth: "smile", eyes: "squint", talk: true, dir: -1 })}</>), html: q("“BİRİ İZLER DİYE. BİR GÜN.”", 96, 0.15) },
  { c: "Sonra soru yağmuru", g: "14:53", sfx: "pop", tone: "gold", r: cam([1.6, 1.8], [1020, 500], undefined, (t) => <>{evGun(t)}{asy(t, 1020, 1, { mouth: "open", talk: true, dir: -1, pose: P.shrug })}</>), html: (t, a, b) => <>{["SİZ KİMSİNİZ?", "NEREDEN GELDİNİZ?", "O KÖPEK KİMİN?", "BU AMCA NEDEN CEVAP VERMİYOR?"].map((l, i) => <Txt key={l} t={t} at={a + 0.3 + i * (b - a - 0.6) / 4} text={l} y={120 + i * 110} size={62} color={i === 3 ? "#F6C445" : "#FFFFFF"} />)}</> },
  { c: "Bayram Dayı hiçbir soruya", g: "14:53", tone: "warm", r: cam([2.2, 2.4], [960, 480], undefined, (t) => <>{evGun(t)}{bay(t, 960, BS, { mouth: "flat", eyes: "closed", pose: P.hips })}</>), html: q("SORU SORMAZ. CEVAP DA VERMEZ.", 84, 0.4) },
  { c: "Sen anlatıyorsun", g: "14:55", tone: "cool", r: cam([1, 1.05], [960, 540], undefined, (t) => <><rect width={1920} height={1080} fill={kagitBg} /><Harita t={t} k={1} /></>), html: tg("KIZ KULESİ · 14 GÜN YOL · RADYO · 5 SANDALYE · 03:14", T.hero) },
  { c: "14 günlük yol", r: (t, a, b) => again("Sen anlatıyorsun", t, a, b, 0) },
  { c: "Hepiniz üçü", g: "14:56", tone: "cool", r: cam([2.4, 2.6], [1020, 500], undefined, (t) => <>{evGun(t)}{asy(t, 1020, 1, { mouth: "o", eyes: "wide", talk: true, dir: -1 })}</>), html: q("“HEPİNİZ 03:14'TE Mİ DOĞDUNUZ?”", 86, 0.2) },
  { c: "Hepimiz, diyorsun", g: "14:56", tone: "cool", r: cam([2.2, 2.4], [700, 540], undefined, (t) => <>{evGun(t)}{sen(t, 700, 1, { mouth: "flat", talk: true, eyes: "squint" })}</>), html: q("“HEPİMİZ. SEN?”", 100, 0.3) },
  { c: "Asya gülümsüyor", g: "14:56", tone: "warm", r: cam([2.6, 2.8], [1020, 470], undefined, (t) => <>{evGun(t)}{asy(t, 1020, 1, { mouth: "smile", eyes: "happy", talk: true, dir: -1, pose: P.think })}</>), html: q("“BİR KADINA YAŞI SORULMAZ. DOĞDUĞU SAAT, HİÇ SORULMAZ.”", 60, 0.3) },
  { c: "Ve konuyu değiştiriyor", g: "14:57", tone: "cool", r: cam([3, 3.2], [1020, 470], undefined, (t) => <>{evGun(t)}{asy(t, 1020, 1, { mouth: "smile", eyes: "squint", dir: -1, look: 1 })}</>), html: tg("?", T.purple) },
  { c: "Sonra ona Defne'yi", g: "14:58", tone: "cool", r: cam([1.4, 1.5], [860, 560], undefined, (t) => <>{evGun(t)}{sen(t, 700, 1, { mouth: "flat", talk: true })}{asy(t, 1020, 1, { mouth: "smile", dir: -1 })}</>) },
  { c: "İsmi duyunca", g: "14:58", sfx: "drone", tone: "night", r: cam([2.6, 2.8], [1020, 470], undefined, (t) => <>{evAk(t)}{asy(t, 1020, 1, { mouth: "flat", eyes: "squint", brow: "worried", dir: -1, talk: true })}</>), html: q("“UZUN BOYLU. ZEYTİN YEŞİLİ MONT. GÜLERKEN GÖZÜ GÜLMEYEN?”", 60, 0.25) },
  { c: "Uzun boylu, zeytin", r: (t, a, b) => again("İsmi duyunca", t, a, b, 0) },
  { c: "Bayram Dayı ilk kez öne", g: "14:59", tone: "night", r: cam([2.2, 2.4], [960, 480], undefined, (t) => <>{evAk(t)}{bay(t, 960, BS, { mouth: "flat", eyes: "squint", brow: "angry", talk: true, pose: P.reach })}</>), html: q("“TA KENDİSİ.”", 110, 0.2) },
  { c: "Asya telefonunu indiriyor", g: "15:00", tone: "night", r: cam([2, 2.2], [1020, 500], undefined, (t) => <>{evAk(t)}{asy(t, 1020, 1, { mouth: "flat", eyes: "open", dir: -1 })}</>), html: tg("İLK KEZ KAMERAYA DEĞİL", T.purple) },
  { c: "Beş gün önce otele", g: "15:00", tone: "warm", r: cam([1, 1.08], [960, 600], undefined, (t) => <><Otel t={t} />{bor(t, 1100, 1, { mouth: "smile", pose: P.hand, holdR: cay(0.5) })}{asy(t, 800, 1, { mouth: "smile" })}</>), html: q("“ÇOK KİBARDI. BANA ÇAY DEMLEDİ.”", 80, 0.3) },
  { c: "Batıda bir ışık gördüğünü", g: "15:01", tone: "cool", r: cam([1.2, 1.3], [1300, 400], undefined, (t) => <Plan t={t} k={1} names={0} />), html: q("“BATIDA BİR IŞIK GÖRDÜM. SENİ ORAYA GÖTÜRÜRÜM.”", 66, 0.2) },
  { c: "Batıda bir ışık. Aynı", g: "15:01", sfx: "boom", tone: "night", ...kartTxt("AYNI CÜMLE.", "DEFNE'YE DE AYNISINI SÖYLEMİŞTİ.", "#FFFFFF", "#E0393E") },
  { c: "Sabah uyandım", g: "15:02", tone: "cool", r: kart("#0E1A2E"), html: (t, a) => <>{["ARABA ✗", "BENZİN ✗", "YİYECEK ✗"].map((l, i) => <Txt key={l} t={t} at={a + 0.4 + i * 0.6} text={l} y={260 + i * 140} size={92} color="#E0393E" />)}</> },
  { c: "Kapıma bir not", g: "15:02", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><KagitYaz lines={["Bekle.", "Dönerim."]} /></TCam>, html: tg("BORA'NIN NOTU", T.green) },
  { c: "Asya acı acı gülüyor", g: "15:03", tone: "cool", r: cam([2.6, 2.8], [1020, 470], undefined, (t) => <>{evAk(t)}{asy(t, 1020, 1, { mouth: "smile", eyes: "squint", brow: "worried", dir: -1, talk: true })}</>), html: q("“BEŞ GÜNDÜR BEKLİYORUM.”", 96, 0.4) },
  { c: "O insanları yanına", g: "15:03", sfx: "drone", tone: "night", r: cam([3, 3.3], [1020, 470], undefined, (t) => <>{evAk(t)}{asy(t, 1020, 1, { mouth: "flat", eyes: "squint", brow: "worried", dir: -1, talk: true })}</>), html: q("“KULLANIR. SONRA BIRAKIR.”", 100, 0.45) },
  { c: "Cebindeki kâğıda", g: "15:04", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><KagitYaz lines={["İYİYİM.", "ARAMA."]} /></TCam> },
  { c: "Ve ilk kez, içinde öfkeden", g: "15:04", tone: "night", r: cam([2.6, 2.9], [700, 500], undefined, (t) => <>{evAk(t)}{sen(t, 700, 1, { mouth: "o", eyes: "wide", brow: "worried", sweat: true })}</>) },
  { c: "Korku", g: "15:04", sfx: "boom", tone: "night", ...kartTxt("KORKU.", undefined, "#E0393E", undefined, "#0A0D14") },
  { c: "Bu arada, sana bir şey", hud: false, tone: "gold", r: cam([1.6, 1.8], [960, 480], undefined, (t) => <>{evGun(t)}{bay(t, 960, BS, { mouth: "grin", eyes: "happy", pose: P.wave })}</>), html: (t, a, b) => <><Txt t={t} at={a + 0.4} text="FİNALİ ŞİMDİDEN YAZIYORUZ" y={110} size={70} /><Txt t={t} at={a + (b - a) * 0.5} text="BAYRAM DAYI'YI SEVİYORSAN 👇" y={230} size={66} color="#F6C445" /><Abone t={t} at={a + (b - a) * 0.6} /></> },

  // ── BEKLEYİŞ · GÜL ──
  { c: "Final bölümünü de", r: (t, a, b) => again("Bu arada, sana bir şey", t, a, b, 0) },
  { c: "Bizim için gerçekten", r: (t, a, b) => again("Bu arada, sana bir şey", t, a, b, 1) },
  { c: "Ayağa kalkıyorsun", g: "15:10", tone: "cool", r: cam([1.8, 2], [700, 540], undefined, (t) => <><KapiOnu t={t} />{sen(t, 560, 1, { mouth: "open", brow: "angry", talk: true, pose: P.point })}</>), html: q("“ŞİMDİ GİDİYORUZ.”", 100, 0.3) },
  { c: "Bayram Dayı kapının önüne", g: "15:10", sfx: "knock", tone: "warm", r: cam([1.2, 1.3], [960, 640], undefined, kapiBay()), html: tg("SANDALYE GICIRDIYOR", T.orange) },
  { c: "Akşamdan önce olmaz", g: "15:11", tone: "warm", r: cam([2.2, 2.4], [960, 560], undefined, kapiBay({ talk: true, look: 0, lookY: 0 })), html: q("“AKŞAMDAN ÖNCE OLMAZ.”", 100, 0.1) },
  { c: "Dayı, duymadın mı", g: "15:11", tone: "cool", r: cam([2, 2.2], [560, 540], undefined, (t) => <><KapiOnu t={t} />{sen(t, 560, 1, { mouth: "open", brow: "angry", talk: true, pose: P.shrug })}</>), html: q("“O, İNSANLARI BIRAKIYOR!”", 96, 0.3) },
  { c: "Duydum", g: "15:11", tone: "warm", r: cam([2.4, 2.6], [960, 560], undefined, kapiBay({ talk: true, look: 0, lookY: 0, eyes: "closed" })), html: q("“DUYDUM.”", 110, 0.1) },
  { c: "O zaman neden", g: "15:12", tone: "cool", r: cam([2.4, 2.6], [560, 540], undefined, (t) => <><KapiOnu t={t} />{sen(t, 560, 1, { mouth: "o", brow: "worried", talk: true })}</>), html: q("“O ZAMAN NEDEN?”", 100, 0.2) },
  { c: "Bayram Dayı cevap vermiyor. Sadece", g: "15:12", tone: "night", r: cam([1.4, 1.6], [500, 400], [700, 500], kapiBay()), html: q("SANKİ BİR ŞEY BEKLİYOR.", 84, 0.5) },
  { c: "Basamağa oturuyorsun", g: "15:20", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{sokak("day", { fall: 0.4 })(t)}{otur(sen, t, 1000, 958, 1.05, { mouth: "flat", brow: "worried" })}{walk(t, a, b, ASYA, 760, -200, 1, { mouth: "flat" })}</TCam>, html: tg("ASYA OTELE GİDİYOR", T.pink) },
  { c: "On dakika sonra", g: "15:30", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{sokak("day", { fall: 0.4 })(t)}{otur(sen, t, 1000, 958, 1.05, { mouth: "flat", look: -1 })}{walk(t, a, b, ASYA, -200, 640, 1, { mouth: "smile", holdR: gul(0.6) })}</TCam>, html: q("PLASTİK. LOBİDEKİ VAZODAN. ÜSTÜNDE BİRAZ TOZ.", 70, 0.4) },
  { c: "Otelin lobisindeki vazodan", r: (t, a, b) => again("On dakika sonra", t, a, b, 0) },
  { c: "Ve önünde, karın", g: "15:31", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[820, 760]}>{kapak(t, a - 30, b, { dream: 0 })}</TCam>, html: tg("DİZ ÇÖKTÜ", T.pink) },
  { c: "Bak, diyor", g: "15:31", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[640, 640]}>{kapak(t, a - 32, b, { dream: 0, asyF: { talk: true } })}</TCam>, html: q("“BEN DE BIRAKILDIM. SEN DE BIRAKILDIN.”", 80, 0.15) },
  { c: "Madem dünyada son", g: "15:32", sfx: "drone", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[800, 680]}>{kapak(t, a - 34, b, { dream: 0, asyF: { talk: true } })}</TCam>, html: q("“BAŞTAN BAŞLAYALIM. SENİNLE.”", 96, 0.4) },
  { c: "Su kapının arkasından", g: "15:32", tone: "warm", r: cam([1.2, 1.3], [960, 700], undefined, (t) => <>{sokak("day", { fall: 0.4 })(t)}{su(t, 380, SS, { pose: P.think, mouth: "none", eyes: "wide" })}{otur(bay, t, 1500, 958, BS, { mouth: "o", eyes: "wide", holdR: cay(0.5) })}<Kopek x={1180} y={G} s={0.6} t={t} kind="kara" sit={1} dir={-1} /></>), html: tg("KARABAŞ BİLE KULAK DİKTİ", T.yellow) },
  { c: "Bayram dayı çayını", r: (t, a, b) => again("Su kapının arkasından", t, a, b, 0) },
  { c: "Herkes senin cevabını", g: "15:33", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{kapak(t, a - 38, b, { dream: 0 })}</TCam>, html: q("HERKES SENİN CEVABINI BEKLİYOR.", 84, 0.2, 140) },
  { c: "Ama sen gülü görmüyorsun", g: "15:33", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[1000, 560]} c1={[1120, 600]}>{kapak(t, a - 40, b)}</TCam> },
  { c: "Orada, hayalinde, Defne", g: "15:33", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[1420, 820]}>{kapak(t, a - 2, b + 2, { turn: (b - a) * 0.55 + 2 })}</TCam>, html: q("BİR KERE, SADECE BİR KERE, DÖNÜP SANA BAKIYOR.", 68, 0.55) },
  { c: "üç gece önceki", r: (t, a, b) => again("Orada, hayalinde, Defne", t, a, b, 0) },
  { c: "Özür dilerim", g: "15:34", tone: "cool", r: cam([2, 2.2], [1000, 520], undefined, (t, a, b) => kapak(t, a - 44, b, { senF: { talk: true, look: -1, lookY: 0.5, mouth: "frown" } })), html: q("“ÖZÜR DİLERİM. BEN HÂLÂ ONU BEKLİYORUM.”", 80, 0.25) },
  { c: "Asya bir süre öyle", g: "15:34", tone: "cool", r: cam([2.6, 2.8], [640, 680], undefined, (t, a, b) => kapak(t, a - 46, b, { dream: 0, asyF: { mouth: "smile", eyes: "squint", brow: "worried" } })), html: q("GÜLÜMSEMESİ YERİNDE. AMA GÖZLERİ DEĞİL.", 76, 0.4) },
  { c: "Bayram Dayı boğazını", g: "15:35", sfx: "ding", tone: "gold", r: cam([2.2, 2.4], [1500, 560], undefined, (t) => <>{sokak("day", { fall: 0.4 })(t)}{otur(bay, t, 1500, 958, BS, { mouth: "grin", eyes: "squint", talk: true })}</>), html: q("“KALK KIZIM. DİZİN DONACAK. VAN SOĞUĞU, AŞKI DA DONDURUR.”", 58, 0.2) },
  { c: "Asya kalkıyor", g: "15:35", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[900, 760]}>{sokak("day", { fall: 0.4 })(t)}<g transform="translate(800,1030)">{gul(0.6)}</g><Kopek x={lerp(1200, 380, ramp(t, a + 1, b - 0.3))} y={G} s={0.6} t={t} kind="kara" run={t > a + 1 && t < b - 0.3 ? 1 : 0} dir={-1} bite={t > a + 0.9 ? gul(0.4) : undefined} />{su(t, 300, SS, { mouth: "none", eyes: "wide" })}{walk(t, a, b, ASYA, 640, 1500, 1, { mouth: "flat" })}</TCam> },
  { c: "Plastik bir gül. Ama Su", g: "15:36", sfx: "ding", tone: "gold", r: cam([2.4, 2.6], [340, 860], undefined, (t) => <>{sokak("day", { fall: 0.4 })(t)}{su(t, 340, SS, { mouth: "smile", eyes: "happy", pose: P.hold, holdR: gul(0.6, 0) })}</>), html: q("DÜNYANIN EN GÜZEL ÇİÇEĞİ GİBİ.", 80, 0.4) },

  // ── GÜN BATIMI · GECE OLAN SEN ──
  { c: "Saat dört buçuk", g: "16:30", tone: "warm", r: cam([1, 1.1], [960, 600], undefined, sokak("dusk", { fall: 0.3 })), html: tg("VAN · KIŞ: GÜNEŞ ERKEN BATAR", T.orange) },
  { c: "Gökyüzü önce turuncu", g: "16:32", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]}>{sokak("dusk")(t)}<rect width={1920} height={1080} fill="#2A1E4A" opacity={ramp(t, a + 0.5, b) * 0.6} /></TCam> },
  { c: "Her ses ayrı ayrı", g: "16:33", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[700, 600]}>{sokak("night")(t)}{sen(t, 700, 1, { mouth: "flat", eyes: "squint" })}</TCam><GeceModu t={t} a={a} k={ramp(t, a + 0.2, a + 0.8)} notes={[{ x: 1300, y: 300, text: "JENERATÖR: 82/dk" }, { x: 1300, y: 420, text: "KARABAŞ: 24 nefes" }, { x: 1300, y: 540, text: "TOPUK RİTMİ: ?" }] as never} /></> },
  { c: "Karabaş'ın nefesi. Asya'nın", r: (t, a, b) => again("Her ses ayrı ayrı", t, a, b, 0) },
  { c: "Gece olan sen, uyanıyor", g: "16:34", sfx: "boom", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.8, 3.1]} c0={[700, 470]}>{sokak("night")(t)}{sen(t, 700, 1, { mouth: "flat", eyes: "squint", brow: "angry" })}</TCam><GeceModu t={t} a={a} k={1} /></>, html: big("GECE OLAN SEN · UYANDI", "#F6C445", 86, 860) },
  { c: "Ve tam o anda, radyo", g: "16:34", sfx: "static", tone: "night", r: cam([1.4, 1.6], [900, 700], undefined, (t) => <><rect width={1920} height={1080} fill="#1E2A3A" /><Radyo x={900} y={800} s={1.5} t={t} on={1} voice={1} /></>), html: tg("TIKIRTI · HIZLI", T.red) },
  { c: "Bu sefer hızlı", g: "16:34", tone: "night", r: mors("O ARTIK BENIM ARAMA", "bora", "in"), html: q("KÂĞIDA GEREK YOK.", 72, 0.6, 180) },
  { c: "Kağıda gerek yok", r: (t, a, b) => again("Bu sefer hızlı", t, a, b, 0) },
  { c: "O… A… R… T", g: "16:35", tone: "night", r: mors("O ARTIK BENIM ARAMA", "bora", "read"), html: tg("HARFLERİ HAVADA OKUYORSUN", T.purple) },
  { c: "I, M. Bir", r: (t, a, b) => again("O… A… R… T", t, a, b, 0) },
  { c: "O artık benim. Arama. Asya", g: "16:35", sfx: "boom", tone: "night", ...kartTxt("“O ARTIK BENİM.", "ARAMA.”", "#E0393E", "#FFFFFF", "#0A0D14") },
  { c: "Asya ağzını kapatıyor", g: "16:35", tone: "night", r: cam([1.3, 1.4], [960, 620], undefined, (t) => <>{radyoOn({ bulb: 0.6 })(t)}{asy(t, 760, 1, { pose: P.think, mouth: "none", eyes: "wide" })}{bay(t, 1160, BS, { mouth: "frown", brow: "angry", dir: -1 })}</>) },
  { c: "Ama gece olan sen, kelimelere", g: "16:36", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1, 1.04]}><rect width={1920} height={1080} fill="#0A0D14" /></TCam>{svg(<><g transform="translate(0,-170)"><RadyoMors t={t} text="IYIYIM ARAMA" hand="defne" k={1} /></g><g transform="translate(0,170)"><RadyoMors t={t} text="O ARTIK BENIM ARAMA" hand="bora" k={ramp(t, a + 0.6, a + 1.4)} /></g></>)}</>, html: (t, a) => <><Txt t={t} at={a + 0.2} text="ÖĞLE: DEFNE'NİN ELİ" y={150} size={54} color="#2EE6D0" /><Txt t={t} at={a + 1} text="AKŞAM: KİMİN ELİ?" y={980} size={54} color="#E0393E" /></> },
  { c: "Bu mesajda uzunlar kısa", g: "16:36", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1, 1.04]}><rect width={1920} height={1080} fill="#0A0D14" /></TCam>{svg(<><g transform="translate(0,-170)"><RadyoMors t={t} text="IYIYIM ARAMA" hand="defne" k={1} /></g><g transform="translate(0,170)"><RadyoMors t={t} text="O ARTIK BENIM ARAMA" hand="bora" k={1} /></g></>)}</>, html: q("UZUNLAR KISA. ARALAR EŞİT. BİR MAKİNE GİBİ.", 66, 0.2, 980) },
  { c: "Bu defnenin eli", r: (t, a, b) => again("Bu mesajda uzunlar kısa", t, a, b, 0) },
  { c: "Bu mesajı Bora yazdı", g: "16:37", sfx: "boom", tone: "night", r: cam([2, 2.2], [960, 500], undefined, (t) => <><rect width={1920} height={1080} fill="#101626" />{bor(t, 960, 1, { mouth: "smile", eyes: "squint", holdR: <Telsiz x={0} y={0} s={0.35} t={t} led={1} /> })}</>), html: q("BU MESAJI BORA YAZDI.", 96, 0.1) },
  { c: "Defne şu an, telsizini", g: "16:37", tone: "night", r: cam([1.6, 1.8], [1180, 780], undefined, depo({ beam: 0, blue: 0.8 })), html: q("DEFNE ŞU AN, TELSİZİNİ BİLE TUTAMIYOR.", 74, 0.2) },
  { c: "Gece olan sen bir hesap", g: "16:38", tone: "night", r: saat(4, 34, "#0E1424"), html: (t, a) => <><Txt t={t} at={a + 0.3} text="16:34 → 03:14" y={120} size={86} color="#FFFFFF" /><Txt t={t} at={a + 1.6} text="= 10 SAAT 40 DAKİKA" y={880} size={86} color="#E0393E" /></> },
  { c: "Hayatında ilk kez", g: "16:38", tone: "gold", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.4, 1.5]}>{sokak("dusk")(t)}{sen(t, 760, 1, { mouth: "smile", eyes: "happy", op: 0.9 })}{sen(t, 1160, 1, { mouth: "flat", eyes: "squint", brow: "angry", dir: -1 })}</TCam></>, html: q("GECE OLAN SEN + GÜNDÜZ OLAN SEN: AYNI ŞEY.", 66, 0.3) },
  { c: "Ayağa kalkıyorsun. Ve bu sefer", g: "16:39", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]}><KapiOnu t={t} mode="dusk" />{walk(t, a, b, BAYRAM, 960, 1500, BS, { mouth: "flat" })}{sen(t, 560, 1, { mouth: "flat", brow: "angry" })}</TCam>, html: tg("BAYRAM KENDİSİ ÇEKİLİYOR", T.orange) },
  { c: "Şimdi oldu", g: "16:39", sfx: "ding", tone: "gold", r: cam([2.2, 2.4], [1400, 500], undefined, (t) => <><KapiOnu t={t} mode="dusk" />{bay(t, 1400, BS, { pose: P.wave, mouth: "grin", eyes: "squint", talk: true, dir: -1 })}</>), html: q("“ŞİMDİ OLDU.” 🔑", 100, 0.2) },

  // ── İPUÇLARI ──
  { c: "Gece olan sen, gün boyu", g: "16:45", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 520]}>{radyoOn({ bulb: 0.5 })(t)}{sen(t, 960, 1, { mouth: "flat", eyes: "squint", pose: P.think })}</TCam><GeceModu t={t} a={a} k={0.6} scan={false} /></>, html: tg("YENİDEN OYNAT ⏪", T.purple) },
  { c: "Öğlenki mesajın arkasında", g: "16:46", tone: "night", r: (t, a, b) => <SvgFull><SesDalga t={t} gull={ramp(t, a + (b - a) * 0.5, b - 0.2)} /></SvgFull>, html: q("HIŞIRTININ İÇİNDE… BİR MARTI.", 84, 0.55) },
  { c: "Van Gölü'nün kıyısında", g: "16:46", tone: "cool", r: cam([1, 1.1], [960, 560], undefined, (t) => <><VanGolu t={t} mode="dusk" /><g transform="translate(1200,300)"><path d={`M-60,${Math.sin(t * 6) * 10} Q-30,-30 0,0 Q30,-30 60,${Math.sin(t * 6) * 10}`} stroke="#FFFFFF" strokeWidth={10} fill="none" strokeLinecap="round" /></g></>), html: tg("MARTI = GÖL KIYISI", T.hero) },
  { c: "Ve sinyal güçlüydü", g: "16:47", tone: "cool", r: (t, a, b) => <SvgFull><MenzilHarita t={t} k={ramp(t, a + 0.2, a + 1.2)} /></SvgFull>, html: tg("EL TELSİZİ: BİRKAÇ KM", T.green) },
  { c: "Yani Defne, bu şehirden", g: "16:47", sfx: "ding", tone: "gold", r: (t, a, b) => <SvgFull><MenzilHarita t={t} k={1} shore={ramp(t, a + 0.3, a + 1)} /></SvgFull>, html: q("DEFNE, BU ŞEHİRDEN HİÇ ÇIKMADI.", 84, 0.3) },
  { c: "Gölün kıyısında mı", g: "16:48", tone: "night", r: cam([2.4, 2.6], [1020, 500], undefined, (t) => <>{evAk(t)}{asy(t, 1020, 1, { mouth: "open", talk: true, dir: -1, pose: P.point })}</>), html: q("“BORA'NIN ORADA BİR DEPOSU VAR. YOLU BİLİYORUM.”", 68, 0.3) },
  { c: "Gece olan sen ona bakıyor", g: "16:48", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[1020, 470]}>{evAk(t)}{asy(t, 1020, 1, { mouth: "smile", dir: -1 })}</TCam><GeceModu t={t} a={a} k={0.5} scan /></>, html: tg("BİR ŞEY YERİNE OTURMUYOR…", T.red) },
  { c: "Ama zaman yok", g: "16:48", tone: "night", ...kartTxt("AMA ZAMAN YOK.", undefined, "#E0393E", undefined, "#0A0D14") },
  { c: "Hepiniz Bayram Dayı'nın", g: "17:00", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{sokak("night")(t)}<SahinDis t={t} x={lerp(700, 1100, ramp(t, a + 1, b))} move={t > a + 1} /></TCam>, html: tg("ESKİ ŞAHİN · ARKADA KARABAŞ", T.yellow) },
  { c: "bayram dayı yanında", r: (t, a, b) => again("Hepiniz Bayram Dayı'nın", t, a, b, 0) },
  { c: "Yol bembeyaz", g: "17:20", tone: "night", r: cam([1, 1.06], [960, 600], undefined, gece("bozkir")), html: q("TABELALAR YİNE YALAN SÖYLÜYOR.", 80, 0.4) },
  { c: "Ama bu gece, gece olan sen direksiyonda", g: "17:25", tone: "night", r: sahinIci({ mouth: "flat", eyes: "squint", lookY: -0.6 }, { mouth: "flat" }), html: tg("TABELAYA DEĞİL · GÖKYÜZÜNE", T.purple) },
  { c: "Kutup Yıldızı", g: "17:30", sfx: "ding", tone: "night", r: (t, a, b) => <SvgFull><KutupYildizi t={t} k={ramp(t, a + 0.4, b - 0.6)} /></SvgFull>, html: q("HER ZAMAN KUZEYİ GÖSTERİR. ONU KİMSE ÇEVİREMEZ.", 66, 0.45, 980) },
  { c: "Bayram Dayı yıldıza", g: "17:30", tone: "gold", r: sahinIci({ mouth: "smile" }, { mouth: "grin", eyes: "squint", talk: true, lookY: -0.6 }, { z: [1.8, 2], c: [700, 640] }), html: q("“ONU DA SÖKEBİLSEYDİM, SÖKERDİM.”", 84, 0.2) },
  { c: "Asya'nın gösterdiği yere", g: "22:55", tone: "night", r: cam([1, 1.08], [960, 600], undefined, (t) => <Hangar t={t} open={1} />), html: tg("PASLI HANGAR · KAPISI AÇIK", T.orange) },
  { c: "Önden koşuyorsun", g: "22:56", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><Hangar t={t} open={1} beam={1} />{walk(t, a, b, SEN, 300, 900, 0.8, { pose: P.run, mouth: "open", talk: true }, 1000)}</TCam>, html: q("“DEFNE!”", 120, 0.4) },
  { c: "Sesin hangarın içinde", g: "22:57", sfx: "drone", tone: "night", r: cam([1, 1.1], [960, 800], undefined, (t) => <Hangar t={t} inside tracks={1} cans={3} />), html: tg("KİMSE YOK · ESKİ LASTİK İZLERİ", T.red) },
  { c: "Birkaç boş bidon", r: (t, a, b) => again("Sesin hangarın içinde", t, a, b, 0) },
  { c: "Asya şaşkın", g: "22:58", tone: "night", r: cam([2.4, 2.6], [960, 500], undefined, (t) => <><Hangar t={t} inside tracks={1} cans={3} />{asy(t, 960, 1, { mouth: "open", eyes: "wide", brow: "worried", talk: true, pose: P.shrug })}</>), html: q("“BURASIYDI. YEMİN EDERİM BURASIYDI.”", 80, 0.2) },
  { c: "Saat on bir", g: "23:00", tone: "night", r: saat(11, 0), html: q("03:14'E: 4 SAATTEN BİRAZ FAZLA", 74, 0.2, 960) },
  { c: "Bayram Dayı boş bidonlardan", g: "23:01", sfx: "boom", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><Hangar t={t} inside tracks={1} cans={2} />{bay(t, 760, BS, { pose: P.kick, mouth: "open", brow: "angry" })}<g transform={`translate(${lerp(900, 2100, ramp(t, a + 0.4, a + 1.6))},${960 - Math.sin(ramp(t, a + 0.4, a + 1.6) * 3.14) * 400}) rotate(${(t - a) * 400})`}><rect x={-30} y={-45} width={60} height={90} rx={8} fill="#D93A2E" /></g></TCam> },
  { c: "Gece olan sen, ilk kez çaresiz", g: "23:02", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[960, 520]}><Hangar t={t} inside tracks={1} cans={2} />{sen(t, 960, 1, { mouth: "frown", eyes: "squint", brow: "worried", pose: P.think, sweat: true })}</TCam><GeceModu t={t} a={a} k={0.4} crash={0.4} scan={false} /></>, html: q("EKSİK BİLGİYLE DOĞRU CEVAP BULUNMAZ.", 76, 0.4) },
  { c: "Ve tam o anda, arabanın", g: "23:40", sfx: "tick", tone: "night", r: buz("KEFAL", "write", 1, "asleep"), html: tg("SU UYUYOR · PARMAĞI CAMDA", T.yellow) },
  { c: "Su uyuyor. Başı", r: (t, a, b) => again("Ve tam o anda, arabanın", t, a, b, 0) },
  { c: "Ama parmağı buğulu", r: (t, a, b) => again("Ve tam o anda, arabanın", t, a, b, 1) },
  { c: "Uyurgezer çocuklar", g: "23:41", tone: "night", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="SU'NUN YAZDIKLARI HEP DOĞRU ÇIKTI:" y={240} size={66} />{["ÜÇ GECE ✓", "MAZOT ✓", "RADYO ✓"].map((l, i) => <Txt key={l} t={t} at={a + 1.2 + i * 0.6} text={l} y={400 + i * 130} size={84} color="#2EE6D0" />)}</> },
  { c: "Üç gece. Mazot", r: (t, a, b) => again("Uyurgezer çocuklar", t, a, b, 0) },
  { c: "Ve şimdi", g: "23:42", tone: "night", r: buz("KEFAL", "read", 1), html: q("K… E… F… A… L.", 96, 0.2, 140) },
  { c: "Kefal. Bayram Dayı birden", g: "23:42", sfx: "boom", tone: "night", ...kartTxt("KEFAL.", undefined, "#F6C445", undefined, "#0A0D14") },
  { c: "Bayram Dayı birden", g: "23:43", tone: "gold", r: sahinIci({ mouth: "o", eyes: "wide" }, { mouth: "open", eyes: "wide", talk: true }, { z: [1.8, 2], c: [700, 640] }), html: q("“İNCİ KEFALİ. BU GÖLDE YAŞAYAN TEK BALIK.”", 76, 0.2) },
  { c: "Bu doğru", g: "23:43", tone: "cool", r: (t) => <SvgFull><Kefal1 t={t} /></SvgFull>, html: (t, a) => <><Txt t={t} at={a + 0.3} text="VAN GÖLÜ = SODALI SU" y={120} size={80} color="#FFFFFF" /><Txt t={t} at={a + 1.8} text="İNCİ KEFALİ: ORADA YAŞAYAN TEK TÜR" y={900} size={70} color="#F6C445" /></> },
  { c: "Kuzey kıyısında eski", g: "23:44", tone: "night", r: sahinIci({ mouth: "flat", eyes: "squint" }, { mouth: "flat", talk: true, brow: "worried" }, { z: [1.8, 2], c: [700, 640] }), html: q("“SOĞUK HAVA DEPOSU. ELEKTRİK YOKSA, İÇİ BUZDOLABINDAN BETER.”", 58, 0.25) },

  // ── FIRTINA · DİREK ──
  { c: "Yola çıkıyorsunuz", g: "00:10", tone: "night", r: cam([1, 1.06], [960, 600], undefined, gece("tipi", true)), html: tg("GÖKYÜZÜ DE SİZİNLE DEĞİL", T.blue) },
  { c: "Bora üç gün önce", g: "00:30", tone: "night", r: cam([1, 1.05], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#101626" />{bor(t, 960, 1, { mouth: "grin", eyes: "squint", talk: true, op: 0.7 })}</>), html: q("“KAR FIRTINASI GELİYOR.” · BU GECE: DOĞRU.", 70, 0.3) },
  { c: "Kar yatay yağıyor", g: "01:20", sfx: "drone", tone: "night", r: sahinIci({ mouth: "flat", brow: "angry", sweat: true }, { mouth: "o", eyes: "wide" }, { kind: "tipi", mode: "storm" }), html: tg("SİLECEKLER YETİŞEMİYOR", T.blue) },
  { c: "Ve yolun ortasında", g: "01:21", sfx: "boom", tone: "night", r: cam([1, 1.08], [960, 800], undefined, (t) => <><YolSahne t={t} kind="tipi" mode="night" snow={1} fall={1} road /><DevrikDirek /><Kar t={t} k={1} wind={2.5} n={220} /></>), html: tg("DEVRİLMİŞ ELEKTRİK DİREĞİ", T.red) },
  { c: "Bayram Dayı arabadan", g: "01:22", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 700]}><YolSahne t={t} kind="tipi" mode="night" snow={1} fall={1} road /><DevrikDirek />{walk(t, a, b, { ...BAYRAM, kind: "sweater", top: "#D9CDB5", top2: "#B9AD95" }, 200, 760, BS, { mouth: "flat", brow: "angry" })}<Kar t={t} k={1} wind={2.5} n={220} /></TCam>, html: tg("72 YAŞINDA · MONTSUZ", T.orange) },
  { c: "Direği iki eliyle", g: "01:23", sfx: "knock", tone: "night", r: (t, a, b) => { const k = ramp(t, a + (b - a) * 0.45, a + (b - a) * 0.7); const r = ramp(t, a + (b - a) * 0.75, b); return <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 760]} shake={k > 0 && r < 1 ? 3 : 0}><YolSahne t={t} kind="tipi" mode="night" snow={1} fall={1} road /><DevrikDirek lift={k} roll={r} />{bay(t, 760, BS, { pose: IKI_KOL, mouth: "open", brow: "angry", sweat: true, bob: 0 })}<Kar t={t} k={1} wind={2.5} n={220} /></TCam>; }, html: (t, a, b) => svg(<Sayac t={t} a={a} marks={["BİR", "İKİ", "ÜÇ"]} times={[a + (b - a) * 0.15, a + (b - a) * 0.45, a + (b - a) * 0.72]} />) },
  { c: "Bir karış kalkıyor", r: (t, a, b) => again("Direği iki eliyle", t, a, b, 0) },
  { c: "Arabaya geri biniyor", g: "01:24", sfx: "pop", tone: "gold", r: sahinIci({ mouth: "o", eyes: "wide" }, { mouth: "open", eyes: "closed", sweat: true, talk: true }, { kind: "tipi", mode: "storm", z: [1.8, 2], c: [700, 640] }), html: big("“BELİM.”", "#F6C445", 110, 860) },
  { c: "Asya ona hayranlıkla", g: "01:24", tone: "gold", r: cam([2.4, 2.6], [960, 500], undefined, (t) => <><rect width={1920} height={1080} fill="#232C3E" /><rect x={380} y={520} width={1160} height={560} rx={60} fill="#34405A" />{otur(asy, t, 960, 760, 1.2, { mouth: "o", eyes: "happy", talk: true })}</>), html: q("“SİZ… NORMAL BİR İNSAN MISINIZ?”", 84, 0.2) },
  { c: "Bayram Dayı cevap vermiyor. Çünkü", g: "01:25", tone: "warm", r: cam([2.2, 2.4], [700, 600], undefined, sahinIci({ mouth: "smile" }, { mouth: "flat", eyes: "closed" })), html: q("ÇÜNKÜ VERMEZ.", 100, 0.3) },

  // ── BALIK DEPOSU ──
  { c: "Saat ikiyi kırk", g: "02:40", tone: "night", r: cam([1, 1.08], [960, 560], undefined, (t) => <BalikDepo t={t} storm={0.6} beam={1} />), html: tg("SOLMUŞ BALIK RESMİ · ÖN KAPI ZİNCİRLİ", T.blue) },
  { c: "beyaz bir bina", r: (t, a, b) => again("Saat ikiyi kırk", t, a, b, 0) },
  { c: "Karabaş arabadan fırlıyor", g: "02:41", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[900, 800]}><BalikDepo t={t} storm={0.6} beam={1} dog={<Kopek x={lerp(300, 1200, ramp(t, a + 0.2, b))} y={1000} s={0.7} t={t} kind="kara" run={1} />} /></TCam>, html: tg("BURNU YERDE", T.yellow) },
  { c: "Bir köpeğin burnu", g: "02:41", tone: "cool", ...kartTxt("KÖPEK BURNU:", "İNSANINKİNDEN ON BİNLERCE KAT GÜÇLÜ.", "#FFFFFF", "#F6C445") },
  { c: "Karabaş binanın etrafında", g: "02:42", sfx: "knock", tone: "night", r: cam([1.4, 1.5], [1300, 760], undefined, (t) => <BalikDepo t={t} storm={0.6} back={1} door={0} dog={<Kopek x={1180} y={1000} s={0.7} t={t} kind="kara" bark={1} />} />), html: tg("ARKADA: KÜÇÜK ÇELİK KAPI", T.red) },
  { c: "Kapıya vuruyorsun", g: "02:43", sfx: "knock", tone: "night", r: cam([1.6, 1.8], [1300, 700], undefined, (t) => <><BalikDepo t={t} storm={0.6} back={1} door={0} />{sen(t, 1180, 1, { pose: P.reach, mouth: "open", talk: true, brow: "worried" }, 1000)}</>), html: q("“DEFNE!” · CEVAP YOK.", 90, 0.3) },
  { c: "Bayram Dayı seni kenara", g: "02:44", sfx: "knock", tone: "night", r: (t, a, b) => { const hit = Math.max(0, Math.sin((t - a) * 4)); return <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[1300, 700]} shake={hit > 0.9 ? 4 : 0}><BalikDepo t={t} storm={0.6} back={1} door={0} />{bay(t, 1130 + hit * 40, BS, { pose: P.back, mouth: "open", brow: "angry", sweat: true }, 1000)}</TCam>; }, html: (t, a, b) => svg(<Sayac t={t} a={a} marks={["1", "2"]} times={[a + (b - a) * 0.3, a + (b - a) * 0.6]} />) },
  { c: "Üçüncüde, çelik kapı", g: "02:45", sfx: "boom", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[1300, 700]} shake={t < a + 0.6 ? 6 : 0}><BalikDepo t={t} storm={0.6} back={1} door={ramp(t, a + 0.1, a + 0.6)} />{bay(t, 1170, BS, { pose: P.back, mouth: "grin", brow: "angry" }, 1000)}</TCam>, html: big("3!", "#F6C445", 160, 420) },
  { c: "İçeriden buz gibi", g: "02:46", sfx: "drone", tone: "night", r: cam([1, 1.08], [960, 540], undefined, (t) => <DepoIci t={t} beam={1} frost={1} />), html: q("DIŞARISI EKSİ YİRMİ. İÇERİSİ DAHA DA SOĞUK.", 72, 0.3) },
  { c: "Ve köşede, bir battaniyenin", g: "02:47", tone: "night", r: cam([1.6, 1.8], [1100, 800], undefined, depo()), html: tg("KIPIRDAMAYAN BİRİ", T.red) },
  { c: "Defne. Dudakları mor", g: "02:48", tone: "night", r: cam([3, 3.3], [880, 790], undefined, depo()), html: q("DUDAKLARI MOR. KİRPİKLERİNDE BUZ.", 80, 0.3) },
  { c: "Ellerini tutuyorsun", g: "02:49", tone: "night", r: cam([1.6, 1.8], [960, 800], undefined, depo({ sen: true })), html: q("BUZ GİBİ.", 100, 0.3) },
  { c: "Titremiyor", g: "02:50", sfx: "boom", tone: "night", ...kartTxt("TİTREMİYOR.", undefined, "#E0393E", undefined, "#0A0D14") },
  { c: "Bu kötü bir işaret", g: "02:50", tone: "night", r: (t, a) => <SvgFull><Hipotermi t={t} a={a} /></SvgFull> },
  { c: "Ama çok daha", r: (t, a, b) => again("Bu kötü bir işaret", t, a, b, 0) },
  { c: "Gece olan sen saate", g: "02:51", sfx: "tick", tone: "night", r: saat(2, 51), html: (t, a) => <><Txt t={t} at={a + 0.4} text="02:51" y={120} size={100} color="#FFFFFF" /><Txt t={t} at={a + 1.6} text="23 DAKİKAN VAR." y={880} size={100} color="#E0393E" /></> },
  { c: "Onu kucaklayıp", g: "02:52", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><BalikDepo t={t} storm={0.4} back={1} door={1} />{walk(t, a, b, SEN, 1300, 500, 1, { pose: SARIL, mouth: "flat", brow: "worried", sweat: true }, 1000)}</TCam>, html: tg("KALORİFER: SONUNA KADAR · MONT ÜSTÜNE", T.orange) },
  { c: "Gece olan sen biliyor. Önce", g: "02:53", tone: "night", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="ÖNCE KOLLAR DEĞİL ✗" y={300} size={84} color="#E0393E" /><Txt t={t} at={a + 1.4} text="ÖNCE GÖĞÜS: VÜCUDUN MERKEZİ ✓" y={460} size={76} color="#3BE07A" /></> },
  { c: "Ona sarılıyorsun", g: "02:54", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]}><Sarilma t={t} /></TCam>, html: (t, a, b) => svg(<Sayac t={t} a={a} marks={["1 DK", "2 DK"]} times={[a + (b - a) * 0.35, a + (b - a) * 0.7]} />) },
  { c: "Ve sonra, ilk titreme", g: "02:56", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[1060, 600]}><Sarilma t={t} shiver={ramp(t, a + 0.3, a + 0.8)} /></TCam>, html: q("İLK TİTREME.", 100, 0.3) },
  { c: "Bu sefer iyi bir işaret", g: "02:56", tone: "gold", r: (t, a) => <SvgFull><Hipotermi t={t} a={a - 3} good /></SvgFull> },

  // ── KAVUŞMA ──
  { c: "Defne gözlerini açıyor", g: "02:57", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[1060, 520]}><Sarilma t={t} dEyes="open" shiver={0.3} /></TCam> },
  { c: "Sonra sesi fısıltıdan", r: (t, a, b) => again("Defne gözlerini açıyor", t, a, b, 0) },
  { c: "Geldin", g: "02:57", tone: "warm", r: cam([3, 3.2], [1060, 500], undefined, (t) => <Sarilma t={t} dEyes="squint" dMouth="smile" shiver={0.2} />), html: big("“GELDİN.”", "#FFFFFF", 130, 860) },
  { c: "Bana aramamamı yazdın", g: "02:58", tone: "warm", r: cam([2.6, 2.8], [760, 500], undefined, (t) => <Sarilma t={t} dEyes="open" sMouth="frown" />), html: q("“BANA ARAMAMAMI YAZDIN.”", 90, 0.2) },
  { c: "Bora yan odadaydı", g: "02:58", tone: "warm", r: cam([2.6, 2.8], [1060, 500], undefined, (t) => <Sarilma t={t} dEyes="squint" dMouth="flat" />), html: q("“‘GEL’ YAZSAM, GÜNDÜZ GELİRDİN. GÜNDÜZ GELİRSEN, BORA SENİ YENERDİ.”", 56, 0.2) },
  { c: "Elini yanağına koyuyor", g: "02:59", tone: "warm", r: cam([2.2, 2.4], [920, 520], undefined, (t) => <Sarilma t={t} dEyes="open" dMouth="smile" close={0.5} />), html: q("“SENİ HİÇ BIRAKMADIM. BİR SANİYE BİLE.”", 80, 0.35) },
  { c: "Ve birbirinize yaklaşıyorsunuz", g: "03:00", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.4]} c0={[910, 520]}><Sarilma t={t} dEyes="closed" dMouth="smile" sMouth="smile" close={0.6 + ramp(t, a, b) * 0.4} /></TCam>, html: tg("117 GÜN", T.pink) },
  { c: "Tam o anda, ikinizin", g: "03:00", sfx: "pop", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.7]} c0={[910, 600]}><Sarilma t={t} dEyes="wide" dMouth="o" sMouth="o" close={1} dog={ramp(t, a + 0.4, a + 1)} /></TCam>, html: big("KARABAŞ.", "#F6C445", 110, 860) },
  { c: "İkinizi birden yalıyor", g: "03:01", sfx: "ding", tone: "gold", r: cam([1.6, 1.7], [910, 600], undefined, (t) => <Sarilma t={t} dEyes="happy" dMouth="grin" sMouth="grin" close={1} dog={1} />), html: q("117 GÜNDÜR İLK KEZ AĞLIYOR. GÜLEREK.", 76, 0.4) },

  // ── GERÇEK (FLASHBACK) ──
  { c: "Sonra sana her şeyi", g: "03:02", tone: "cool", r: cam([1, 1.1], [960, 600], undefined, (t) => <Bodrum t={t} beam={0.7} plan={1} />), html: big("ÜÇ GÜN ÖNCE · BODRUM", "#FFFFFF", 80) },
  { c: "Üç gün önce, bodrumda", g: "03:02", tone: "cool", r: cam([1.1, 1.2], [700, 600], undefined, (t) => <Plan t={t} k={1} names={1} />), html: q("DÖRT İSİM. SENİN ADIN YOKTU.", 84, 0.4) },
  { c: "Senin adın yoktu", r: (t, a, b) => again("Üç gün önce, bodrumda", t, a, b, 0) },
  { c: "Ve Defne biliyordu", g: "03:03", tone: "cool", r: cam([1.8, 2], [960, 540], undefined, (t) => <><Bodrum t={t} beam={0.4} />{bor(t, 960, 1, { mouth: "smile", eyes: "squint", pose: P.think })}</>), html: q("GÜNDÜZ, BORA'YI KİMSE DURDURAMAZ. GÜNDÜZ, O BİR DÂHİ.", 62, 0.3) },
  { c: "Bu yüzden Bora'ya gitti", g: "03:03", tone: "cool", r: cam([1.3, 1.4], [960, 560], undefined, (t) => <><Bodrum t={t} beam={0.5} />{def(t, 760, 1, { mouth: "flat", brow: "angry", talk: true, pose: P.point })}{bor(t, 1160, 1, { mouth: "smile", dir: -1 })}</>), html: q("“BENİ AL. SADECE BENİ. BAYRAM'I VE SU'YU BIRAK.”", 70, 0.2) },
  { c: "Bayram gelirse", g: "03:04", tone: "warm", r: cam([2.2, 2.4], [760, 480], undefined, (t) => <><Bodrum t={t} beam={0.5} />{def(t, 760, 1, { mouth: "flat", eyes: "squint", talk: true })}</>), html: q("“BAYRAM GELİRSE, SENİ YARI YOLDA BOĞAR.”", 78, 0.1) },
  { c: "Bora kabul etti", g: "03:04", tone: "night", r: cam([2.2, 2.4], [1160, 480], undefined, (t) => <><Bodrum t={t} beam={0.5} />{bor(t, 1160, 1, { mouth: "grin", eyes: "squint", dir: -1 })}</>), html: q("ÇÜNKÜ BORA, DEFNE'Yİ İSTİYORDU.", 80, 0.4) },
  { c: "Bunu sen de biliyordun", g: "03:05", tone: "cool", ...kartTxt("“DÖRT SAAT ON İKİ DAKİKA.”", "“DOKUZ DAKİKA.”", "#2EE6D0", "#F6C445") },
  { c: "Gitmeden önce", g: "03:05", tone: "warm", r: cam([1.4, 1.5], [960, 800], undefined, (t) => <>{evAk(t)}<MamaCuval x={960} y={1010} t={t} k={0} />{def(t, 640, 1, { pose: P.hand, mouth: "flat", eyes: "squint", holdR: <g transform="scale(0.6)"><rect x={-40} y={-120} width={80} height={120} rx={10} fill="#D93A2E" /></g> })}</>), html: q("ÇÜNKÜ KİMSE, BİR KÖPEK MAMASININ İÇİNE BAKMAZ.", 66, 0.4) },
  { c: "Senin avucuna", g: "03:06", tone: "night", r: avuc(".-.", true), html: q("RADYO SUSARSA, DÜNYADA TEK BAŞINA KALIRDIN.", 66, 0.3) },
  { c: "Çünkü radyo susarsa", r: (t, a, b) => again("Senin avucuna", t, a, b, 0) },
  { c: "Ve Karabaş'ı bıraktı", g: "03:06", tone: "warm", r: cam([1.6, 1.8], [460, 860], undefined, (t) => <>{sokak("night", { lamp: 1 })(t)}<rect x={300} y={560} width={300} height={480} fill="#F6C445" opacity={0.3} /><Kopek x={460} y={G} s={0.7} t={t} kind="kara" bark={1} /></>), html: q("KARABAŞ ONU BULURDU. VE SEN, KARABAŞ'IN PEŞİNDEN GELİRDİN.", 60, 0.3) },
  { c: "Ve sen Karabaş'ın", r: (t, a, b) => again("Ve Karabaş'ı bıraktı", t, a, b, 0) },
  { c: "Akşamüstü, Bora telsizi", g: "03:07", tone: "night", r: cam([1.6, 1.8], [960, 520], undefined, (t) => <><DepoIci t={t} beam={0.8} frost={0.6} />{bor(t, 760, 1, { mouth: "grin", eyes: "squint", talk: true, holdR: <Telsiz x={0} y={0} s={0.35} t={t} led={0} /> })}{def(t, 1200, 1, { mouth: "frown", brow: "angry", dir: -1 })}</>), html: q("“GECE OLAN SEVGİLİN SENİ BULSUN BAKALIM.”", 76, 0.35) },
  { c: "Bir şey daha var", g: "03:08", tone: "night", ...kartTxt("BİR ŞEY DAHA VAR.", undefined, "#F6C445") },
  { c: "Kamyonete binmeden önce", g: "03:08", tone: "night", r: cam([2, 2.2], [960, 480], undefined, (t) => <><rect width={1920} height={1080} fill="#141C28" />{Array.from({ length: 8 }).map((_, i) => <rect key={i} x={200 + i * 180} y={1000 - i * 90} width={200} height={1080} fill="#2A3444" />)}{bay(t, 960, BS, { mouth: "o", eyes: "squint", talk: true })}</>), html: q("HAYATINDA İLK KEZ BİR SORU: “KIZIM? NEREYE?”", 70, 0.4) },
  { c: "hayatında ilk kez", r: (t, a, b) => again("Kamyonete binmeden önce", t, a, b, 0) },
  { c: "Defne ona bir cümle", g: "03:09", sfx: "drone", tone: "night", r: cam([2.4, 2.6], [960, 480], undefined, (t) => <><rect width={1920} height={1080} fill="#141C28" />{defm(t, 960, 1, { mouth: "flat", eyes: "squint", talk: true, brow: "worried" })}</>), html: q("“ONU UYANDIRMA, DAYI. GÜNEŞ BATMADAN PEŞİME DÜŞMESİN.”", 60, 0.2) },
  { c: "Çünkü gece, Bora sıradan", g: "03:09", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[700, 600]}>{sokak("night")(t)}{sen(t, 700, 1, { mouth: "flat", eyes: "squint", brow: "angry" })}</TCam><GeceModu t={t} a={a} k={1} /></>, html: q("GECE: BORA SIRADAN. SEN: DÜNYANIN EN ZEKİSİ.", 66, 0.3) },
  { c: "Bayram Dayı o cümleyi", g: "03:10", tone: "warm", r: cam([1.4, 1.6], [500, 400], [700, 500], kapiBay()), html: q("BÜTÜN GÜN. KİMSEYE SÖYLEMEDEN.", 80, 0.4) },
  { c: "Bütün ipuçları", g: "03:10", tone: "cool", ...kartTxt("BÜTÜN İPUÇLARI", "GÖZÜNÜN ÖNÜNDEYDİ.", "#FFFFFF", "#F6C445") },
  { c: "Defne kendi koyduğu", g: "03:11", sfx: "boom", tone: "night", r: cam([1, 1.05], [960, 540], undefined, (t, a) => <><rect width={1920} height={1080} fill="#2A1E16" /><Defter lines={["Kural 4:", "Gece yolculuk yok."]} k={1} /><path d="M520,330 L1400,620" stroke="#E0393E" strokeWidth={18} strokeLinecap="round" strokeDasharray={`${ramp(t, a + 0.8, a + 1.4) * 940} 1000`} /></>), html: q("KARABAŞ'I BIRAKTI. VE DEFNE, KARABAŞ'I ASLA BIRAKMAZ.", 62, 0.5, 960) },
  { c: "Karabaşı bıraktı. Ve", r: (t, a, b) => again("Defne kendi koyduğu", t, a, b, 0) },
  { c: "Ve bu sabah, Bayram Dayı masaya", g: "03:11", tone: "warm", r: ikiCay(0), html: q("ALIŞKANLIKTAN DEĞİL…", 84, 0.5) },
  { c: "Döneceğini bildiği için", g: "03:12", sfx: "ding", tone: "gold", ...kartTxt("DÖNECEĞİNİ", "BİLDİĞİ İÇİN.", "#F6C445", "#FFFFFF", "#3A2414") },

  // ── SEVİNÇ ──
  { c: "Bayram Dayı arabanın kapısını", g: "03:12", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><BalikDepo t={t} storm={0} back={1} door={1} />{bay(t, 760, BS, { pose: IKI_KOL, mouth: "grin", eyes: "happy" }, 1000)}{sen(t, 960, 1, { mouth: "o", eyes: "wide", bob: 0 }, 1000 - 206 + Math.sin(t * 5) * 4)}{defm(t, 1080, 1, { mouth: "grin", eyes: "happy", bob: 0, dir: -1 }, 1000 - 206 + Math.sin(t * 5 + 1) * 4)}</TCam>, html: tg("İKİNİZİ BİRDEN", T.orange) },
  { c: "İkinizi birden kucaklıyor", r: (t, a, b) => again("Bayram Dayı arabanın kapısını", t, a, b, 0) },
  { c: "Bir. İki. Üç adım", g: "03:12", tone: "gold", r: (t, a, b) => { const x = wx(t, a + 0.2, b - 0.2, 560, 960, BS); return <TCam t={t} a={a} b={b} z={[1, 1.06]}><BalikDepo t={t} storm={0} back={1} door={1} />{bay(t, x, BS, { pose: IKI_KOL, mouth: "grin", eyes: "happy" }, 1000)}{sen(t, x + 200, 1, { mouth: "grin", eyes: "happy", bob: 0 }, 1000 - 206)}{defm(t, x + 320, 1, { mouth: "grin", eyes: "happy", bob: 0, dir: -1 }, 1000 - 206)}</TCam>; }, html: sayac3() },
  { c: "Dört sıfır", g: "03:13", tone: "gold", r: cam([2.4, 2.6], [760, 500], undefined, (t) => <><BalikDepo t={t} storm={0} back={1} door={1} />{bay(t, 760, BS, { pose: IKI_KOL, mouth: "grin", eyes: "closed", talk: true }, 1000)}</>), html: (t, a) => <><Txt t={t} at={a + 0.1} text="“DÖRT SIFIR.”" y={120} size={110} color="#F6C445" /><Txt t={t} at={a + 1.4} text="BIYIĞININ ALTINDA, İLK KEZ: GÖZYAŞI" y={880} size={66} /></> },
  { c: "Arka koltukta Asya", g: "03:13", tone: "warm", r: cam([2.2, 2.4], [960, 520], undefined, (t) => <><rect width={1920} height={1080} fill="#232C3E" /><rect x={380} y={520} width={1160} height={560} rx={60} fill="#34405A" />{otur(asy, t, 960, 760, 1.2, { mouth: "flat", eyes: "squint", talk: true, pose: P.hips })}</>), html: q("“ÇOK GÜZEL. GERÇEKTEN. BEN DE BURADAYIM BU ARADA.”", 62, 0.3) },
  { c: "diyor. Çok güzel", r: (t, a, b) => again("Arka koltukta Asya", t, a, b, 0) },
  { c: "Defne ona bakıyor", g: "03:13", tone: "warm", r: cam([2.4, 2.6], [1060, 500], undefined, (t) => <Sarilma t={t} dEyes="squint" dMouth="flat" close={1} />), html: q("“BU KİM?”", 110, 0.2) },
  { c: "Asya, diyorsun", g: "03:13", tone: "warm", r: cam([2.4, 2.6], [760, 500], undefined, (t) => <Sarilma t={t} dEyes="open" sMouth="grin" close={1} />), html: q("“ASYA. UZUN HİKÂYE.”", 96, 0.15) },
  { c: "Kısa aslında", g: "03:13", sfx: "pop", tone: "gold", r: cam([2.4, 2.6], [960, 500], undefined, (t) => <><rect width={1920} height={1080} fill="#232C3E" /><rect x={380} y={520} width={1160} height={560} rx={60} fill="#34405A" />{otur(asy, t, 960, 760, 1.2, { mouth: "smile", eyes: "squint", talk: true, pose: P.hips })}</>), html: q("“BANA EVLENME TEKLİF ETTİ. BEN REDDETTİM.”", 76, 0.3) },
  { c: "Bayram Dayı kahkahayı", g: "03:13", sfx: "ding", tone: "gold", r: cam([1.2, 1.3], [910, 600], undefined, (t) => <Sarilma t={t} dEyes="happy" dMouth="grin" sMouth="grin" close={1} />), html: tg("ELİ, SENİN ELİNİN ÜSTÜNDE", T.pink) },
  { c: "Herkes gülüyor", g: "03:13", tone: "warm", r: cam([1.2, 1.3], [910, 600], undefined, (t) => <Sarilma t={t} dEyes="happy" dMouth="grin" sMouth="grin" close={1} dog={1} />), html: q("BİR KİŞİ HARİÇ.", 96, 0.55) },
  { c: "Asya, arka camdan", g: "03:13", sfx: "drone", tone: "night", r: cam([2.4, 2.6], [960, 480], undefined, (t) => <><rect width={1920} height={1080} fill="#0E1626" /><rect x={300} y={160} width={1320} height={440} rx={60} fill="#060A14" /><Kar t={t} k={0.3} n={40} />{asy(t, 960, 1.2, { mouth: "flat", eyes: "squint", dir: -1, look: 1 }, 1180)}</>), html: q("SANKİ BİRİ GELECEKMİŞ GİBİ.", 80, 0.4) },
  { c: "Sonra birinin ona", g: "03:13", tone: "night", r: cam([2.6, 2.8], [960, 720], undefined, (t) => <><rect width={1920} height={1080} fill="#232C3E" /><rect x={380} y={520} width={1160} height={560} rx={60} fill="#34405A" />{otur(su, t, 960, 820, 0.9, { mouth: "none", eyes: "wide" })}</>), html: tg("SU · UYANMIŞ", T.yellow) },
  { c: "Asya gülümsüyor. Su gülümsemiyor", g: "03:13", sfx: "boom", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.7]}><rect width={1920} height={1080} fill="#232C3E" /><rect x={300} y={520} width={1320} height={560} rx={60} fill="#34405A" />{otur(asy, t, 1240, 760, 1.1, { mouth: "smile", eyes: "squint", dir: -1 })}{otur(su, t, 680, 820, 0.9, { mouth: "none", eyes: "wide" })}</TCam>, html: q("ASYA GÜLÜMSÜYOR. SU GÜLÜMSEMİYOR.", 80, 0.3) },

  // ── EV YOLU · 03:14 · AYNA ──
  { c: "Eve dönüyorsunuz", g: "03:13", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]} c0={[960, 560]}><ArabaIci t={t} mode="night" kind="gol" move snow={1} left={<TFig x={700} y={1060} s={1.15} o={DEFNE_M} t={t} pose={P.sit} rim={0.3} mouth="smile" />} right={<TFig x={1220} y={1060} s={1.15} o={BAYRAM} t={t} pose={P.hold} rim={0.3} dir={-1} mouth="grin" talk />} dog={<Kopek x={960} y={760} s={0.85} t={t} kind="kara" sit={1} />} /></TCam>, html: q("“EVE VARINCA HERKESE SUCUK.” · HAV! · “SANA DEĞİL.”", 62, 0.3) },
  { c: "Eve varınca herkese", r: (t, a, b) => again("Eve dönüyorsunuz", t, a, b, 0) },
  { c: "Saat üçü on üç", g: "03:13", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.7]} c0={[910, 600]}><Sarilma t={t} dEyes="open" dMouth="smile" sMouth="smile" close={1} /></TCam>, html: tg("03:13 · AVUCUNA YAZIYOR", T.hero) },
  { c: "Bu sefer okuyabiliyorsun", g: "03:13", sfx: "tick", tone: "night", r: avuc(". ...-", true), html: q("KISA. · KISA, KISA, KISA, UZUN.", 76, 0.2) },
  { c: "E… V", g: "03:13", sfx: "ding", tone: "gold", r: avuc(". ...-", false), html: (t, a) => <><Txt t={t} at={a + 0.2} text="E… V." y={160} size={110} color="#2EE6D0" /><Txt t={t} at={a + 1.2} text="EV." y={880} size={150} color="#F6C445" /></> },
  { c: "Saat üçü on dört", g: "03:14", sfx: "boom", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[760, 520]}><Sarilma t={t} dEyes="open" dMouth="smile" sMouth="smile" close={1} /></TCam><rect width={1920} height={1080} fill="#000" opacity={ramp(t, b - 1.2, b) * 0.6} /></>, html: q("BU SEFER, KORKMADAN.", 90, 0.4) },
  { c: "Çünkü bu sefer", r: (t, a, b) => again("Saat üçü on dört", t, a, b, 0) },
  { c: "Defne, her gece olduğu", g: "03:14", tone: "night", r: cam([2.6, 2.8], [1060, 520], undefined, (t) => <Sarilma t={t} dEyes="open" dMouth="flat" sMouth="flat" close={1} />), html: tg("DEFNE: UYANIK · DİKİZ AYNASI", T.purple) },
  { c: "Aynada, karın içinde", g: "03:14", sfx: "drone", tone: "night", r: (t, a, b) => <SvgFull><DikizAyna t={t} k={ramp(t, a, b) * 0.4} /></SvgFull>, html: q("İKİ FAR.", 100, 0.4) },
  { c: "Arkanızdan geliyorlar", g: "03:14", tone: "night", r: (t, a, b) => <SvgFull><DikizAyna t={t} k={0.4 + ramp(t, a, b) * 0.3} /></SvgFull>, html: q("YAVAŞ. ACELE ETMEDEN.", 84, 0.3) },
  { c: "Bir kamyonet", g: "03:14", tone: "night", r: (t, a, b) => <SvgFull><DikizAyna t={t} k={0.7 + ramp(t, a, b) * 0.3} bora={ramp(t, a + 0.6, b)} /></SvgFull>, html: tg("ZEYTİN YEŞİLİ MONT · İÇİ TURUNCU", T.green) },
  { c: "Bora.", g: "03:14", sfx: "boom", tone: "night", ...kartTxt("BORA.", undefined, "#E0393E", undefined, "#0A0D14") },
  { c: "Ve gülümsüyor", g: "03:14", tone: "night", r: cam([2.6, 2.9], [960, 500], undefined, (t) => <><rect width={1920} height={1080} fill="#0A0E16" /><circle cx={960} cy={560} r={420} fill="#FFF3C0" opacity={0.06} />{bor(t, 960, 1, { mouth: "grin", eyes: "squint", brow: "angry" })}</>), html: q("YÜZÜ GÜLÜYOR. GÖZÜ GÜLMÜYOR.", 84, 0.4) },

  // ── KAPANIŞ ──
  { c: "Bora neden geri döndü", hud: false, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{kapak(t, a - 200, b - 180)}</TCam>, html: (t, a, b) => <><Txt t={t} at={a + 0.3} text="BORA NEDEN GERİ DÖNDÜ?" y={120} size={70} /><Txt t={t} at={a + (b - a) * 0.3} text="NE İSTİYOR?" y={230} size={66} color="#F6C445" /><Txt t={t} at={a + (b - a) * 0.6} text="VE ASYA… GERÇEKTEN BİZDEN Mİ?" y={900} size={70} color="#E0393E" /></> },
  { c: "Bir sonraki bölüm", hud: false, tone: "cool", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="SONRAKİ BÖLÜM: FİNAL" y={300} size={110} color="#F6C445" />{svg(<g transform="translate(0,60)"><Seri t={t} a={a + 0.8} on={4} /></g>)}</> },
  { c: "Tahminini yorumlara", hud: false, sfx: "ding", tone: "gold", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="TAHMİNİNİ YORUMLARA YAZ 👇" y={330} size={80} color="#FFFFFF" /><Txt t={t} at={a + 1.4} text="EN İYİ TAHMİNLERİ FİNALDE OKUYACAĞIM." y={500} size={62} color="#F6C445" /></> },
  { c: "Ve abone olup zili", hud: false, tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><SvgFull><DikizAyna t={t} k={1} bora={1} /></SvgFull></TCam>, html: (t, a, b) => <><Txt t={t} at={a + 0.2} text="FİNALDE: HER SORUNUN BİR CEVABI VAR." y={130} size={66} color="#FFFFFF" /><Txt t={t} at={a + (b - a) * 0.55} text="VE BİR DE VEDA." y={250} size={80} color="#E0393E" /><Abone t={t} at={a + 1} /></> },
];

// tam ekran svg sahneleri için sarmalayıcı (TFrame zaten svg içinde: düz grup)
function SvgFull({ children }: { children: React.ReactNode }) { return <g>{children}</g>; }

type Timed = Sh & { from: number; to: number; clk: string };
export const TIMED: Timed[] = (() => {
  let after = 0, clk = "";
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    if (s.g !== undefined) clk = s.g;
    return { ...s, from, to: 0, clk };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K2R_19_SECONDS));
  return raw;
})();

const VOL: Record<string, number> = { drone: 0.07, boom: 0.08, ding: 0.07, knock: 0.07, pop: 0.06, boing: 0.06, tick: 0.05, static: 0.05 };
export const K2RVideo19: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K2R_19_SECONDS;
  const showHud = s.hud !== false && s.g !== undefined;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: ramp(t, 0, 0.5) * (1 - ramp(t, END - 1.2, END)) }}>
        <TFrame>
          <LiveCam t={t} a={s.from} punch={0.04}>{s.r(t, s.from, s.to)}</LiveCam>
          <Atmos t={t} tone={s.tone ?? "warm"} rays={s.tone === "night" ? 0.3 : 0.6} seed={n} />
          {s.tone === "gold" && <Sweep t={t} a={s.from} />}
          {showHud && <SaatHUD t={t} clk={s.clk} />}
        </TFrame>
        {s.html?.(t, s.from, s.to)}
      </AbsoluteFill>
      <Audio src={staticFile("audio/k2r-19.wav")} />
      {TIMED.map((x, i) => x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from + 0.05) * fps))} durationInFrames={Math.round(2.2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.05} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

const AG = [[1.22, -90, -40], [1.3, 110, 30], [1.18, 0, 60]];
function again(c: string, t: number, a: number, b: number, q: number) {
  const s0 = SHOTS.find((x) => x.c === c);
  if (!s0) return null;
  const [z, dx, dy] = AG[q % AG.length];
  return <g transform={`translate(${960 + dx} ${540 + dy}) scale(${z}) translate(-960 -540)`}>{s0.r(t, a, b)}</g>;
}
