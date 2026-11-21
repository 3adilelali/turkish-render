import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k2r-18-words.json";
import { makeCue, ramp as rampRaw } from "../../lib/cues";
import { Eyes, Brow, Mouth, HERO, Outfit, P, T, TCam, TFig, TFrame, TPose, lerp, toonWalk } from "../../components/Toon";
import { Txt, Tag, Abone } from "../../components/K2Kit";
import { Atmos, LiveCam, Sweep, Tone } from "../../components/Live";
import { InceBardak } from "../../components/K2Dikey3";
import { Gok, Kagit, Kopek, OdunYigin, Radyo } from "../../components/SonIki";
import { Araba, ArabaIci, Defter, GeceModu, Harita, RadyoOdasi, Saat, VanGece, VanKedisi, YolSahne } from "../../components/YolVan";
import { Avuc, Bodrum, BuzluCam, Deneme, HosGeldin, Kamyonet, Kar, KarMelegi, Kilit, KirikKapi, Mutfak, Plan, Satranc, UcGeceHUD, VanGolu, VanKahvalti, VanSokak, YonLevha } from "../../components/VanUc";

// Kanal 2 · k2r-18 · "Dünyada Son İki Kişi Kaldık… Ve Van'dan Çıkamıyoruz" — 3. BÖLÜM "Üç Gece". TAMAMEN MOTOR.
// Kurallar (bölüm 2'nin sesli şikâyetinden sonra): her kesmede whoosh YOK, beyaz flaş YOK. SFX sadece açıkça yazılan anlamlı vuruşlarda, kısık.
// Kadro kıyafetleri küçük resimle birebir: Defne mercan kazak + at kuyruğu + sarı toka + kırmızı atkı; Bora zeytin yeşili mont (içi turuncu).

const ALT: Record<string, string[]> = {
  "gece Van. Radyo": ["14. gece Van. Radyo", "On dördüncü gece. Van. Radyo"],
  "kilometre gitti. Van'dan": ["212 kilometre gitti"],
  "Van'dan Erciş'e": ["Van'dan Erciş'e 100"],
  "gündür bir kez bile": ["114 gündür bir kez"],
  "gündür herkesi taşıyorsun": ["114 gündür herkesi"],
  "Kural 4. Gece": ["Kural dört. Gece", "Kural dört, gece"],
  "Kural 8": ["Kural sekiz"],
  "kas katı": ["kaskatı"],
  "Uyur gezerlik": ["Uyurgezerlik"],
  "Bayram dayıyı alıp": ["Bayram Dayı'yı alıp"],
  "Mazot. Ama mazot": ["Mazot. Ama mazot"],
  "Su'ya soru": ["Suya soru", "su'ya soru"],
};
const ramp = (t: number, a: number, b: number) => (b - a > 0.01 ? rampRaw(t, a, b) : t >= b ? 1 : 0);
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const VAR: [RegExp, string][] = [[/â/g, "a"], [/î/g, "i"], [/û/g, "u"]];
const variants = (p: string) => { const out = [p]; for (const [re, to] of VAR) for (const v of [...out]) { const n = v.replace(re, to); if (n !== v) out.push(n); } return out; };
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K2R_18_SECONDS = Math.ceil(VOICE_END + 4);

type R = (t: number, a: number, b: number) => React.ReactNode;
type Sh = { c: string; r: R; html?: R; sfx?: string; tone?: Tone; g?: number; hud?: boolean; n?: boolean };

// ── kadro ──
const G = 1040;
const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#1FC8B4", top2: "#159A8B" };
const DEFNE: Outfit = { top: "#E0566A", top2: "#B8404F", kind: "sweater", hair: "ponytail2", hairColor: "#3A2418", tie: "#F6C445", neck: "#C9302C", shoes: "#F4F4F4" };
const DEFNE_M: Outfit = { ...DEFNE, kind: "coat", top: "#C9473E", top2: "#9E342D" }; // gece dışarı: mont
const BORA: Outfit = { top: "#6E7B3A", top2: "#56612C", kind: "coat", inner: "#F28C28", hair: "none", shoes: "#3A2A20" };
const BAYRAM: Outfit = { top: "#5A4636", top2: "#463628", kind: "vest", inner: "#D9CDB5", hair: "cap", hairColor: "#3A3A3A", mustache: true, mustacheColor: "#FFFFFF", bulk: 1.35, shoes: "#3A2A20" };
const GOLGE: Outfit = { ...BAYRAM, top: "#06080E", top2: "#06080E", inner: "#06080E", hairColor: "#06080E", mustacheColor: "#06080E", shoes: "#06080E" };
const SU: Outfit = { top: "#F6C445", top2: "#D9A21E", kind: "coat", hair: "braids", hairColor: "#3A2418", tie: "#E0393E", shoes: "#E0393E" };
const BS = 1.2, SS = 0.62;

type Face = { pose?: TPose; eyes?: Eyes; brow?: Brow; mouth?: Mouth; look?: number; lookY?: number; talk?: boolean; sweat?: boolean; dir?: 1 | -1; holdR?: React.ReactNode; holdL?: React.ReactNode; op?: number };
const fig = (o: Outfit, s0 = 1) => (t: number, x: number, s = s0, f: Face = {}, y = G) => <TFig x={x} y={y} s={s} o={o} t={t} rim={0.3} seed={x} {...f} />;
const sen = fig(SEN), def = fig(DEFNE), defm = fig(DEFNE_M), bor = fig(BORA), bay = fig(BAYRAM, BS), su = fig(SU, SS);
const walk = (t: number, a: number, b: number, o: Outfit, x0: number, x1: number, s = 1, f: Face = {}, y = G) => {
  const w = toonWalk(t, a, b, x0, x1, s);
  return <TFig x={w.x} y={y} s={s} o={o} t={t} dir={w.dir} walk={w.walk} rim={0.3} {...f} />;
};
const wx = (t: number, a: number, b: number, x0: number, x1: number, s = 1) => toonWalk(t, a, b, x0, x1, s).x;
// oturma: kalça = basamak üstü (y_kalça + 178·s)
const otur = (f: (t: number, x: number, s?: number, fc?: Face, y?: number) => React.ReactNode, t: number, x: number, seatY: number, s: number, fc: Face = {}) => f(t, x, s, { pose: P.sit, ...fc }, seatY + 178 * s);
const yat = (t: number, x: number, y: number, s: number, f: Face = {}) => <g transform={`rotate(-82 ${x} ${y})`}>{sen(t, x, s, { eyes: "closed", mouth: "flat", ...f }, y)}</g>;
const cay = (s = 0.5, tea = 1) => <InceBardak x={0} y={0} s={s} tea={tea} saucer={false} />;
const q = (text: string, size = 80, k = 0.3, y = 820): R => (t, a, b) => <Txt t={t} at={a + (b - a) * k} text={text} y={y} size={size} />;
const tg = (text: string, c: string = T.hero, at = 0.5, y?: number): R => (t, a) => <Tag t={t} at={a + at} text={text} c={c} y={y} />;
const big = (text: string, color = "#F6D08A", size = 90, y = 80): R => (t, a) => <Txt t={t} at={a + 0.3} text={text} y={y} size={size} color={color} />;
const kart = (bg: string): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill={bg} /><Kar t={t} k={0.25} n={60} /></TCam>;
const kartTxt = (l1: string, l2?: string, c1 = "#2EE6D0", c2 = "#F6C445", bg = "#0E1A2E"): Pick<Sh, "r" | "html" | "hud"> => ({ hud: false, r: kart(bg), html: (t, a) => <><Txt t={t} at={a + 0.2} text={l1} y={l2 ? 330 : 440} size={92} color={c1} />{l2 && <Txt t={t} at={a + 1.0} text={l2} y={520} size={74} color={c2} />}</> });
const cam = (z: [number, number], c0: [number, number], c1: [number, number] | undefined, node: (t: number, a: number, b: number) => React.ReactNode, shake = 0): R => (t, a, b) => <TCam t={t} a={a} b={b} z={z} c0={c0} c1={c1} shake={shake}>{node(t, a, b)}</TCam>;
const kagitBg = "#E9DCC6";

// el ele tutuşma pozları: Defne'nin ön eli öne, Bora'nın arka eli geriye → 310·s arayla eller buluşur
const EL_D: TPose = { l: [8, 6], r: [50, 25] };
const EL_B: TPose = { l: [-50, -25], r: [-8, -6] };
const OMUZ_B: TPose = { l: [-8, -6], r: [-120, -150] };
const KALDIR: TPose = { l: [-35, 70], r: [130, 140] };
const TASI: TPose = { l: [150, 175], r: [-8, -6] };
const elEle = (t: number, a: number, b: number, x0: number, x1: number, s: number, y: number, dog = true, look = -1, coat = false) => {
  const x = wx(t, a, b, x0, x1, s);
  const dx = 310 * s;
  const dTurn = look >= 0 && t > a + look && t < a + look + 1.6;
  return <>
    {walk(t, a, b, BORA, x0 + dx, x1 + dx, s, { pose: EL_B, mouth: "smile" }, y)}
    {walk(t, a, b, coat ? DEFNE_M : DEFNE, x0, x1, s, { pose: EL_D, mouth: "smile" }, y)}
    <circle cx={x + 155 * s} cy={y - 214 * s} r={16 * s} fill="#141414" />
    {dog && <Kopek x={x + dx + 150 * s} y={y} s={0.62 * s} t={t} kind="kara" run={dTurn ? 0 : 1} dir={dTurn ? -1 : 1} sit={dTurn ? 1 : 0} />}
  </>;
};

// ── sahneler ──
const sokak = (mode: "day" | "dusk" | "night" = "day", o: { lamp?: number; windows?: number; snow?: number; fall?: number } = {}) => (t: number) => <><VanSokak t={t} mode={mode} lamp={o.lamp ?? (mode === "night" ? 1 : 0)} windows={o.windows ?? (mode === "night" ? 0.35 : 0)} snow={o.snow ?? 1} /><Kar t={t} k={o.fall ?? (mode === "night" ? 0.9 : 0.5)} /></>;
// KÜÇÜK RESİM SAHNESİ: lambanın altında taş basamak, çay; 50 m ileride Defne + Bora el ele, Karabaş
const kapak = (t: number, a: number, b: number, o: { look?: number; walkers?: boolean } = {}) => <>
  {sokak("night")(t)}
  {otur(sen, t, 430, 958, 0.95, { mouth: "flat", brow: "worried", eyes: "open", look: 1, holdR: cay(0.42, 1) })}
  {o.walkers !== false && elEle(t, a, b + 2, 880, 1180, 0.5, 905, true, o.look ?? -1)}
</>;
const radyo = (o: { beam?: number; names?: number; bulb?: number } = {}) => (t: number) => <RadyoOdasi t={t} beam={o.beam ?? 1} bulb={o.bulb ?? 0.8} names={o.names ?? 1} jacket={0} steam={1} bardak={cay(0.5)} />;
// kahvaltı: figürler masanın arkasında (masa ön yüzü kliple tekrar çizilir)
const KX = { su: 380, sen: 660, def: 940, bor: 1220, bay: 1520 };
const kahv = (fc: { sen?: Face; def?: Face; bor?: Face; bay?: Face; su?: Face | false } = {}, o: { steam?: number; sucuk?: number; dog?: "sit" | "bark" | false } = {}) => (t: number) => <>
  <defs><clipPath id="kTab"><rect x={0} y={640} width={1920} height={440} /></clipPath></defs>
  <VanKahvalti t={t} steam={o.steam ?? 1} sucuk={o.sucuk ?? 1} />
  {fc.su !== false && otur(su, t, KX.su, 700, SS, { mouth: "flat", ...(fc.su ?? {}) })}
  {otur(sen, t, KX.sen, 700, 1, { mouth: "smile", ...(fc.sen ?? {}) })}
  {otur(def, t, KX.def, 700, 1, { mouth: "smile", ...(fc.def ?? {}) })}
  {otur(bor, t, KX.bor, 700, 1, { mouth: "smile", dir: -1, ...(fc.bor ?? {}) })}
  {otur(bay, t, KX.bay, 700, BS, { mouth: "smile", dir: -1, ...(fc.bay ?? {}) })}
  <g clipPath="url(#kTab)"><VanKahvalti t={t} steam={0} sucuk={o.sucuk ?? 1} /></g>
  {o.dog !== false && <Kopek x={1760} y={1060} s={0.6} t={t} kind="kara" sit={1} dir={-1} bark={o.dog === "bark" ? 1 : 0} />}
</>;
const mutfak = (fc: { def?: Face | false; bor?: Face | false } = {}, candle = 1) => (t: number) => <>
  <defs><clipPath id="mTab"><rect x={680} y={760} width={640} height={320} /></clipPath></defs>
  <Mutfak t={t} night={1} candle={candle} />
  {fc.def !== false && otur(defm, t, 820, 800, 1, { mouth: "flat", ...(fc.def ?? {}) })}
  {fc.bor !== false && otur(bor, t, 1180, 800, 1, { mouth: "smile", dir: -1, ...(fc.bor ?? {}) })}
  <g clipPath="url(#mTab)"><Mutfak t={t} night={1} candle={0} /></g>
</>;
const evGun = (t: number) => <Mutfak t={t} night={0} candle={0} />;
type Yol = Parameters<typeof YolSahne>[0]["kind"];
type YMode = Parameters<typeof YolSahne>[0]["mode"];
const yol = (t: number, kind: Yol, mode: YMode = "day", move = false) => <YolSahne t={t} kind={kind} mode={mode} px={move ? t * 420 : 0} snow={1} fall={mode === "night" ? 0.6 : 0.2} sun={mode === "day" ? 1 : 0} road />;
type AO = { x?: number; s?: number; move?: boolean; lights?: number; buried?: number; front?: React.ReactNode; back?: React.ReactNode; dog?: boolean };
const araba = (t: number, o: AO = {}) => <Araba x={o.x ?? 900} y={960} s={o.s ?? 0.9} t={t} id="a3" c="#E8E4D8" speed={o.move ? 1 : 0} smoke={o.move ? 0.5 : 0} lights={o.lights} snow={1} buried={o.buried}
  front={o.front ?? <TFig x={95} y={-20} s={0.42} o={DEFNE} t={t} pose={P.sit} rim={0.3} />} back={o.back}
  dog={o.dog === false ? undefined : <Kopek x={-178} y={-178} s={0.3} t={t} kind="kara" sit={1} dir={-1} />} />;
const surus = (kind: Yol, mode: YMode = "day") => (t: number) => <>{yol(t, kind, mode, true)}{araba(t, { move: true, back: <TFig x={-110} y={-20} s={0.42} o={SEN} t={t} pose={P.sit} rim={0.3} /> })}</>;
// araba içi: sol yolcu = Bora, sağ şoför = Defne
const ici = (s: Face = {}, d: Face = {}, o: { kind?: Yol; z?: [number, number]; c?: [number, number] } = {}): R => (t, a, b) => <TCam t={t} a={a} b={b} z={o.z ?? [1, 1.06]} c0={o.c ?? [960, 560]}>
  <ArabaIci t={t} mode="day" kind={o.kind ?? "bozkir"} move snow={1}
    left={<TFig x={700} y={1060} s={1.15} o={BORA} t={t} pose={P.sit} rim={0.3} {...s} />}
    right={<TFig x={1220} y={1060} s={1.15} o={DEFNE} t={t} pose={P.hold} rim={0.3} dir={-1} {...d} />}
    dog={<Kopek x={960} y={760} s={0.85} t={t} kind="kara" sit={1} />} /></TCam>;
const tabela = (mode: "day" | "dusk" = "day", cat = false, mirror = false) => (t: number) => <>
  {yol(t, "bozkir", mode)}
  <g transform={mirror ? "translate(1920,0) scale(-1,1)" : undefined}><HosGeldin x={1240} y={1040} /></g>
  {cat && <VanKedisi x={mirror ? 760 : 1180} y={1040} s={0.9} t={t} look={-1} />}
</>;
const levha = (o: { scratch?: number; fresh?: number; up?: number; lines?: [string, string][]; night?: boolean; beam?: number } = {}) => (t: number) => <>
  {o.night !== false ? <><VanSokak t={t} mode="night" lamp={0} windows={0} steps={false} /><Kar t={t} k={0.7} /></> : yol(t, "bozkir", "day")}
  <YonLevha x={1100} y={1040} t={t} scratch={o.scratch} fresh={o.fresh} up={o.up} lines={o.lines ?? [["ERCİŞ", "←"], ["GEVAŞ", "↑"]]} />
  {(o.beam ?? 0) > 0 && <path d="M300,1080 L840,380 L1380,470 Z" fill="#FFF3C0" opacity={0.18 * (o.beam ?? 0)} />}
</>;
const haritaT = (flip = 0): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]}><rect width={1920} height={1080} fill={kagitBg} /><g transform={`rotate(${180 * (1 - ramp(t, a + flip, a + flip + 0.8) * (flip > 0 ? 1 : 0))} 960 540)`}><Harita t={t} k={1} /></g></TCam>;
const saat = (h: number, m: number, bg = "#0E1424"): R => cam([1, 1.12], [960, 540], undefined, () => <><rect width={1920} height={1080} fill={bg} /><Saat x={960} y={540} s={2.2} h={h} m={m} c="#F4EAD6" /></>);
const buz = (text: string, mode: "write" | "read" | "full", night = 0, su0 = false): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}>
  <BuzluCam t={t} text={text} night={night} k={mode === "write" ? ramp(t, a + 0.2, b - 0.2) : 1} read={mode === "read" ? ramp(t, a + 0.3, b - 0.3) : 0} finger={mode === "write"} />
  {su0 && <TFig x={520} y={1180} s={1.4} o={SU} t={t} pose={P.hand} eyes={night ? "squint" : "open"} mouth="flat" rim={0.3} />}
</TCam>;
const Cuval: React.FC = () => <g><path d="M-60,-40 Q-70,-120 0,-130 Q70,-120 60,-40 Q60,20 0,24 Q-60,20 -60,-40Z" fill="#7A6A52" /><path d="M-40,-110 L40,-110" stroke="#5A4A36" strokeWidth={8} /></g>;
const Poset: React.FC = () => <g><path d="M-34,0 L-40,70 L40,70 L34,0Z" fill="#F4F1EA" opacity={0.85} />{[[-14, 40], [10, 50], [-4, 26]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={14} ry={10} fill="#E08A2E" />)}</g>;
const Aku: React.FC = () => <g><rect x={-46} y={-10} width={92} height={70} rx={6} fill="#2A2E34" /><rect x={-34} y={-20} width={16} height={12} fill="#E0393E" /><rect x={18} y={-20} width={16} height={12} fill="#3A7BD5" /></g>;
const Not: React.FC<{ s?: number }> = ({ s = 1 }) => <g transform={`scale(${s})`}><rect x={-40} y={-30} width={80} height={56} fill="#FFFBEA" transform="rotate(-8)" /></g>;
const Kurek: React.FC = () => <g><rect x={-6} y={-220} width={12} height={240} fill="#7A5A3A" /><path d="M-40,20 L40,20 L30,90 L-30,90Z" fill="#9AA0A8" /></g>;
const KarTopu: React.FC<{ r?: number }> = ({ r = 26 }) => <circle r={r} fill="#FFFFFF" stroke="#C9D6E2" strokeWidth={4} />;
const ElKart: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => <><VanSokak t={t} mode="night" lamp={1} windows={0.3} steps={false} /><Kar t={t} k={0.9} />{elEle(t, a, b + 2, 560, 700, 1.15, 1180, false, -1)}</>;
const Seri: React.FC<{ t: number; a: number; on: number }> = ({ t, a, on }) => <g>{[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${560 + i * 200},640)`} opacity={ramp(t, a + 0.2 + i * 0.12, a + 0.5 + i * 0.12)}><rect x={-80} y={-80} width={160} height={160} rx={24} fill={i < on ? "#1FC8B4" : i === on ? "#F6C445" : "#2A3650"} /><text y={26} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={80} fill="#0E1A2E">{i + 1}</text></g>)}</g>;
const Baloncuk: React.FC<{ t: number; a: number; n?: number }> = ({ t, a, n = 26 }) => <g>{Array.from({ length: n }, (_, i) => { const k = ramp(t, a + i * 0.08, a + i * 0.08 + 0.3); const x = 160 + ((i * 337) % 1600), y = 160 + ((i * 211) % 760); return <g key={i} transform={`translate(${x},${y}) scale(${k})`}><rect x={-110} y={-40} width={220} height={80} rx={40} fill="#FFFFFF" /><path d="M-60,36 L-80,70 L-30,38Z" fill="#FFFFFF" /><text y={16} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={42} fill="#E0393E">DEVAM</text></g>; })}</g>;
const Daire: React.FC<{ t: number; a: number; b: number }> = ({ t, a, b }) => { const k = ramp(t, a + 0.3, b - 0.3); return <g><circle cx={960} cy={560} r={300} fill="none" stroke="#2EE6D0" strokeWidth={10} strokeDasharray={`${k * 1885} 2000`} /><circle cx={960 + Math.sin(k * 6.283) * 300} cy={560 - Math.cos(k * 6.283) * 300} r={22} fill="#F6C445" /></g>; };
const Sayac: React.FC<{ t: number; a: number; marks: string[]; times?: number[] }> = ({ t, a, marks, times }) => <g>{marks.map((m, i) => <text key={i} x={960 + (i - (marks.length - 1) / 2) * 260} y={600} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={180} fill="#F6C445" stroke="#0E1A2E" strokeWidth={10} paintOrder="stroke" opacity={ramp(t, (times?.[i] ?? a + 0.4 + i * 0.6), (times?.[i] ?? a + 0.4 + i * 0.6) + 0.2)}>{m}</text>)}</g>;
// kaldırılan kahraman: Bayram'ın (KALDIR) eli yakaya → sen x = bx+206·(BS/1.2), ayaklar yerden 206 px
const kaldir = (t: number, bx: number, o: { f?: Face; sf?: Face; walkTo?: [number, number, number]; } = {}) => {
  const x = o.walkTo ? wx(t, o.walkTo[0], o.walkTo[1], bx, o.walkTo[2], BS) : bx;
  const bf = o.walkTo ? toonWalk(t, o.walkTo[0], o.walkTo[1], bx, o.walkTo[2], BS) : null;
  return <>
    {bf ? <TFig x={x} y={G} s={BS} o={BAYRAM} t={t} dir={bf.dir} walk={bf.walk} pose={KALDIR} rim={0.3} mouth="grin" {...(o.f ?? {})} /> : bay(t, x, BS, { pose: KALDIR, mouth: "grin", ...(o.f ?? {}) })}
    {sen(t, x + 206, 1, { pose: P.shock, mouth: "o", eyes: "wide", brow: "worried", bob: 0, ...(o.sf ?? {}) } as Face, G - 206 + Math.sin(t * 5) * 4)}
  </>;
};
const tasi = (t: number, a: number, b: number, x0: number, x1: number, night = true) => {
  const w = toonWalk(t, a, b, x0, x1, BS);
  return <>
    <TFig x={w.x} y={G} s={BS} o={BAYRAM} t={t} dir={w.dir} walk={w.walk} pose={TASI} rim={0.3} mouth="smile" />
    <g transform={`rotate(-90 ${w.x + 60} ${G - 380})`}>{sen(t, w.x + 60, 0.9, { eyes: "closed", mouth: night ? "flat" : "o", pose: P.stand }, G - 380)}</g>
  </>;
};

const SHOTS: Sh[] = [
  // ── KANCA · KÜÇÜK RESİM ──
  { c: "Üçüncü gece. Van", sfx: "drone", tone: "night", hud: false, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[900, 620]}>{kapak(t, a, b + 30)}</TCam>, html: big("3. GECE · VAN", "#FFFFFF", 92) },
  { c: "Bir sokak lambasının", tone: "night", hud: false, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.25]} c0={[470, 760]}>{kapak(t, a - 3, b + 27)}</TCam> },
  { c: "Elinde ince belli", tone: "night", hud: false, r: cam([1.2, 1.35], [960, 600], undefined, (t) => <><rect width={1920} height={1080} fill="#0E1424" /><Kar t={t} k={0.6} /><InceBardak x={960} y={820} s={2.4} tea={1} saucer={false} /></>), html: tg("ÇOKTAN SOĞUMUŞ", T.blue) },
  { c: "Ve elli metre ileride", tone: "night", hud: false, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[1080, 760]} c1={[1220, 760]}>{kapak(t, a - 8, b + 22)}</TCam> },
  { c: "Başka birinin elini", sfx: "drone", tone: "night", hud: false, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.65]} c0={[790, 860]} c1={[880, 860]}><ElKart t={t} a={a} b={b} /></TCam>, html: tg("BAŞKA BİRİNİN ELİ", T.red) },
  { c: "Karabaş da onlarla", tone: "night", hud: false, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[1300, 840]} c1={[1360, 840]}>{kapak(t, a - 14, b + 16, { look: (b - a) * 0.45 + 14 })}</TCam> },
  { c: "Üç gün önce bu şehre", tone: "cool", hud: false, r: cam([1, 1.12], [1100, 600], undefined, tabela("day")), html: big("3 GÜN ÖNCE", "#FFFFFF", 92) },
  { c: "Saatlerce dümdüz yol", tone: "cool", hud: false, r: cam([1, 1.08], [960, 600], undefined, surus("bozkir")) },
  { c: "Van'a hoş geldiniz", tone: "cool", hud: false, r: cam([1.6, 1.9], [1240, 580], undefined, tabela("day")), html: q("“VAN'A HOŞ GELDİNİZ.” · YİNE.", 84, 0.2, 960) },
  { c: "yaşında bir adam", tone: "warm", hud: false, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[900, 700]}>{sokak("day")(t)}<g transform={`rotate(${-7 * ramp(t, a + 0.3, a + 1.2)} 560 960)`}>{araba(t, { x: 900, buried: 0.4, dog: false, front: <></> })}</g>{bay(t, 1330, BS, { pose: P.reach, dir: -1, mouth: "grin", brow: "angry", sweat: true })}</TCam>, html: tg("72 YAŞINDA · TEK ELLE", T.orange) },
  { c: "yaşında bir kız buğulu", tone: "warm", hud: false, r: buz("ÜÇ GECE", "write", 0, true) },
  { c: "Ne yazdığını kendisi", tone: "warm", hud: false, r: cam([1.5, 1.6], [960, 520], undefined, (t) => <>{evGun(t)}{su(t, 960, 1.5, { eyes: "open", mouth: "none", look: 0.6 })}</>), html: q("NE YAZDIĞINI KENDİSİ BİLE BİLMİYOR.", 76, 0.3) },
  { c: "Ve camda iki kelime", sfx: "tick", tone: "night", hud: false, r: buz("ÜÇ GECE", "read") },
  { c: "Bu gece, üçüncü", sfx: "boom", tone: "night", hud: false, r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.1} text="ÜÇ GECE" y={300} size={170} color="#F6C445" /><svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><g transform="translate(-1760,416) scale(1.6)"><UcGeceHUD t={t} gece={3} k={ramp(t, a + 0.6, a + 1)} /></g></svg></> },
  { c: "Ve sen hala bilmiyorsun", tone: "night", hud: false, r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[900, 700]}>{kapak(t, a - 40, b - 10)}</TCam>, html: q("DEFNE NEDEN ONUN ELİNİ TUTUYOR?", 86, 0.35, 180) },

  // ── SERİ · ÖZÜR · MEYDAN OKUMA ──
  { c: "Ama önce kısa bir şey", hud: false, tone: "cool", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="DÜNYADA SON İKİ KİŞİ" y={240} size={86} color="#FFFFFF" /><svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><Seri t={t} a={a + 0.4} on={2} /></svg><Txt t={t} at={a + 1.6} text="3. BÖLÜM · 5 BÖLÜMLÜK SERİ" y={820} size={64} color="#F6C445" /></> },
  { c: "İlk iki bölümü izlemediysen", hud: false, tone: "cool", ...kartTxt("1. VE 2. BÖLÜM →", "ÖNCE ONLARI İZLE.", "#FFFFFF", "#2EE6D0") },
  { c: "bölümün sonunda size sordum", hud: false, tone: "warm", r: kart("#1A2440"), html: q("“DEVAM EDELİM Mİ?”", 120, 0.1, 460) },
  { c: "Ve siz binlerce kez", hud: false, sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}><rect width={1920} height={1080} fill="#1A2440" /><Baloncuk t={t} a={a + 0.2} /></TCam>, html: q("BU BÖLÜM, SİZİN SAYENİZDE VAR.", 76, 0.55, 980) },
  { c: "Bir de sesle ilgili", hud: false, tone: "cool", ...kartTxt("SES: HAKLIYDINIZ.", "ÖZÜR DİLERİZ. DÜZELTTİK ✓", "#FFFFFF", "#2EE6D0") },
  { c: "Ve sana bir meydan", hud: false, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[1100, 760]}>{kapak(t, a - 60, b - 30)}</TCam>, html: (t, a, b) => <><Txt t={t} at={a + 0.6} text="SENCE DEFNE NEDEN ONUN ELİNİ TUTUYOR?" y={150} size={70} /><Txt t={t} at={a + (b - a) * 0.45} text="👇 CEVABINI ŞİMDİ YORUMLARA YAZ" y={900} size={66} color="#F6C445" /></> },
  { c: "Cevabını şimdi", hud: false, tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#1A2440" /><Baloncuk t={t} a={a + 0.2} n={10} /></TCam>, html: q("👇 İZLEMEYE DEVAM ETMEDEN YAZ. BAKALIM KİM HAKLI ÇIKACAK.", 62, 0.1, 980) },
  { c: "Sadece iki bölüm kaldı", hud: false, tone: "cool", r: kart("#0E1A2E"), html: (t, a) => <><svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><Seri t={t} a={a} on={2} /></svg><Txt t={t} at={a + 0.8} text="SON BÖLÜMÜ KİMSE TAHMİN EDEMEYECEK." y={260} size={70} color="#FFFFFF" /></> },
  { c: "Hazırsan başlıyoruz", hud: false, tone: "night", r: cam([1, 1.15], [960, 540], undefined, (t) => <VanGece t={t} bulb={1} gen={0} />), html: big("BAŞLIYORUZ.", "#F6C445", 110, 460) },

  // ── 14. GECE · RADYO ODASI ──
  { c: "gece Van. Radyo", hud: false, tone: "night", r: cam([1, 1.08], [960, 600], undefined, (t) => <>{radyo({ names: 1 })(t)}{sen(t, 560, 1, { mouth: "o", look: 1 })}{def(t, 820, 1, { mouth: "flat", brow: "worried", dir: -1 })}<Kopek x={1040} y={G} s={0.55} t={t} kind="kara" sit={1} /></>), html: big("14. GECE · VAN · RADYO ODASI", "#FFFFFF", 76) },
  { c: "Bilmeyenler için", hud: false, tone: "cool", r: cam([1, 1.1], [960, 520], undefined, (t) => <VanGece t={t} bulb={0} gen={0} />), html: tg("BİR GECEDE: HERKES KAYBOLDU", T.red) },
  { c: "Geriye sen", hud: false, tone: "warm", r: cam([1.2, 1.3], [900, 700], undefined, (t) => <>{sokak("day")(t)}{sen(t, 700, 1, { mouth: "grin", eyes: "happy" })}{def(t, 1000, 1, { mouth: "smile", dir: -1 })}<Kopek x={1260} y={G} s={0.6} t={t} kind="kara" sit={1} dir={-1} wag={1} /></>), html: tg("SEN · DEFNE · KARABAŞ", T.hero) },
  { c: "sende tuhaf bir şey var", hud: false, tone: "warm", r: cam([2.2, 2.4], [700, 640], undefined, (t) => <>{sokak("dusk")(t)}{sen(t, 700, 1, { mouth: "flat", eyes: "squint", look: 1 })}</>) },
  { c: "Güneş batınca", hud: false, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[700, 640]}>{sokak("night")(t)}{sen(t, 700, 1, { mouth: "flat", eyes: "squint", brow: "angry" })}</TCam><GeceModu t={t} a={a} k={ramp(t, a + 0.3, a + 1)} /></>, html: q("GÜNEŞ BATINCA: DÜNYANIN EN ZEKİ İNSANI", 70, 0.15) },
  { c: "Sonra ölü gibi", hud: false, tone: "night", ...{ r: saat(3, 14) }, html: q("03:14 → ÖLÜ GİBİ UYKU", 84, 0.1, 960) },
  { c: "Ve sabah yine eski", hud: false, tone: "warm", r: cam([1.6, 1.8], [800, 640], undefined, (t) => <>{sokak("day")(t)}{sen(t, 800, 1, { pose: P.shrug, mouth: "grin", eyes: "happy", talk: true })}</>), html: tg("GÜNDÜZ: BOL ŞAKALI · BİRAZ SAKAR", T.yellow) },
  { c: "Şimdi o radyo odasındasın", hud: false, tone: "night", r: cam([1, 1.06], [960, 560], undefined, radyo()), html: tg("MİKROFON: HÂLÂ SICAK", T.red) },
  { c: "Beş sandalye, iki isim", hud: false, tone: "night", r: cam([1.3, 1.45], [960, 640], undefined, radyo()), html: big("5 SANDALYE · 2 İSİM", "#FFFFFF", 90) },
  { c: "Merdivenlerde kocaman", hud: false, sfx: "knock", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 500]} shake={3}>{radyo({ beam: 0.6, bulb: 0.5 })(t)}{walk(t, a, b, GOLGE, 1700, 1380, BS, { mouth: "none", eyes: "closed" })}</TCam> },
  { c: "Bir kapı kadar geniş", hud: false, tone: "night", r: cam([1.5, 1.6], [1380, 560], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bay(t, 1380, BS, { mouth: "frown", brow: "angry", dir: -1 })}</>), html: tg("KAPI KADAR GENİŞ OMUZLAR", T.orange) },
  { c: "Kar gibi beyaz bir", hud: false, tone: "night", r: cam([3.2, 3.5], [1380, 470], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bay(t, 1380, BS, { mouth: "frown", brow: "angry", dir: -1 })}</>), html: tg("KAR BEYAZI BIYIK · KASKET", T.blue) },
  { c: "bir çuval kömür", hud: false, tone: "night", r: cam([1.6, 1.8], [1380, 560], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bay(t, 1380, BS, { pose: OMUZ_B, holdR: <Cuval />, mouth: "frown", brow: "angry", dir: -1 })}</>), html: q("TEK OMZUNDA.", 90, 0.5) },
  { c: "Kim lan bunlar", hud: false, tone: "night", r: cam([2.2, 2.4], [1380, 520], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bay(t, 1380, BS, { pose: OMUZ_B, holdR: <Cuval />, mouth: "open", brow: "angry", talk: true, dir: -1 })}</>), html: q("“KİM LAN BUNLAR?”", 110, 0.05) },
  { c: "Cevap vermeye fırsatın", hud: false, sfx: "boing", tone: "night", r: cam([1, 1.08], [1000, 560], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{kaldir(t, 760)}</>) },
  { c: "Ayakların yerden kesiliyor", hud: false, tone: "night", r: cam([2.4, 2.6], [966, 900], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{kaldir(t, 760)}</>), html: tg("AYAKLAR: HAVADA", T.red) },
  { c: "Karabaş havlıyor", hud: false, tone: "night", r: cam([1, 1.06], [960, 600], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{def(t, 340, 1, { pose: P.point, mouth: "open", brow: "angry", talk: true })}{kaldir(t, 760)}<Kopek x={1340} y={G} s={0.6} t={t} kind="kara" bark={1} dir={-1} /></>), html: q("“KURAL İKİ! APTALCA RİSK YOK!”", 84, 0.3) },
  { c: "Bunu bana mı", hud: false, tone: "night", r: cam([2, 2.2], [966, 560], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{kaldir(t, 760, { sf: { mouth: "open", talk: true, pose: P.shrug } })}</>), html: q("“BEN HAVADAYIM!”", 110, 0.45) },
  { c: "Adam seni havada tutarak", hud: false, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{radyo({ beam: 0.8 })(t)}{kaldir(t, 500, { walkTo: [a + 1.2, b - 0.6, 900] })}</TCam>, html: (t, a, b) => <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><Sayac t={t} a={a} marks={["1", "2", "3"]} times={[a + (b - a) * 0.45, a + (b - a) * 0.6, a + (b - a) * 0.75]} /></svg> },
  { c: "adım diyor. Yağlı", hud: false, tone: "warm", r: cam([2.2, 2.4], [900, 520], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{kaldir(t, 900, { f: { talk: true } })}</>), html: q("“YAĞLI GÜREŞTE BU, YENDİM DEMEK.”", 76, 0.1) },
  { c: "gerçekten de öyle", hud: false, tone: "gold", ...kartTxt("YAĞLI GÜREŞ:", "RAKİBİ KALDIR + 3 ADIM = GALİBİYET", "#F6C445", "#FFFFFF", "#3A2414") },
  { c: "Sonra, adamın bacağının", hud: false, tone: "night", r: cam([2.2, 2.4], [1120, 860], undefined, (t, a) => <>{radyo({ beam: 0.8 })(t)}{su(t, lerp(1080, 1210, ramp(t, a + 0.3, a + 1.4)), SS, { mouth: "none", look: 1 })}{bay(t, 1100, BS, { pose: P.hips, mouth: "smile" })}</>) },
  { c: "kendisine üç beden büyük", hud: false, tone: "night", r: cam([2, 2.2], [1340, 820], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bay(t, 1000, BS, { pose: P.hips, mouth: "smile" })}{su(t, 1340, SS, { mouth: "none", look: -1 })}</>), html: tg("3 BEDEN BÜYÜK SARI MONT · 2 ÖRGÜ", T.yellow) },
  { c: "Ve Karabaş havlamayı", hud: false, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[1200, 800]}>{radyo({ beam: 0.8 })(t)}{su(t, 1400, SS, { mouth: "none", look: -1 })}<Kopek x={lerp(700, 1230, ramp(t, a + 0.6, b - 0.8))} y={G} s={0.55} t={t} kind="kara" run={t < b - 0.8 && t > a + 0.6 ? 1 : 0} sit={t >= b - 0.8 ? 1 : 0} /></TCam> },
  { c: "Daha ilk saniyede", hud: false, sfx: "ding", tone: "gold", r: cam([2.4, 2.6], [1320, 860], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{su(t, 1400, SS, { mouth: "smile", look: -1 })}<Kopek x={1230} y={G} s={0.55} t={t} kind="kara" sit={1} wag={1} /></>), html: tg("KARABAŞ ONU SEÇTİ ❤", T.pink) },
  { c: "Kapıdan bir ses", hud: false, tone: "night", r: cam([1, 1.06], [960, 560], undefined, (t) => <>{radyo({ beam: 0.6 })(t)}<rect x={120} y={300} width={300} height={740} fill="#F6C445" opacity={0.35} />{bor(t, 270, 1, { mouth: "smile", op: 0.35 })}</>), html: q("“BIRAK ONU, BAYRAM DAYI. MİSAFİRLERİMİZ GELDİ.”", 66, 0.1) },
  { c: "Dönüp bakıyorsun", hud: false, tone: "night", r: cam([1.6, 1.8], [400, 600], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bor(t, 400, 1, { mouth: "smile", holdR: <Poset /> })}</>), html: tg("ZEYTİN YEŞİLİ MONT · İÇİ TURUNCU", T.green) },
  { c: "Elinde bir poşet kuru", hud: false, tone: "night", r: cam([3, 3.2], [560, 860], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bor(t, 400, 1, { mouth: "smile", holdR: <Poset /> })}</>), html: tg("KURU KAYISI = MALATYA", T.orange) },
  { c: "Malatya'daki genç", hud: false, sfx: "drone", tone: "cool", r: cam([1.2, 1.3], [900, 700], undefined, (t) => <>{yol(t, "bozkir", "dusk")}{araba(t, { x: 820, dog: false })}{bor(t, 1320, 1, { pose: P.reach, dir: -1, mouth: "smile", eyes: "squint" })}</>), html: tg("2. BÖLÜM · MALATYA", T.red) },
  { c: "Senin aküyü", hud: false, tone: "night", r: cam([2, 2.2], [400, 540], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bor(t, 400, 1, { pose: P.hand, mouth: "grin", eyes: "squint", talk: true, holdR: <Aku /> })}</>), html: q("“MALATYA'DA BAŞKA AKÜ VARDI.”", 84, 0.4) },
  { c: "Bayram Dayı seni yere", hud: false, tone: "warm", r: cam([1.2, 1.3], [1000, 600], undefined, (t, a) => <>{radyo({ beam: 0.8 })(t)}{bay(t, 760, BS, { pose: P.hips, mouth: "grin" })}{sen(t, 1000, 1, { mouth: "flat", brow: "worried", eyes: "squint" }, lerp(G - 206, G, ramp(t, a + 0.2, a + 0.7)))}</>) },
  { c: "Hoş geldin evlat", hud: false, tone: "warm", r: cam([2, 2.2], [760, 480], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bay(t, 760, BS, { pose: P.hips, mouth: "grin", talk: true })}</>), html: q("“KIRK YIL YAĞLI GÜREŞ TUTTUM. HİÇ YENİLMEDİM.”", 68, 0.3) },
  { c: "Bir kere yenildim", hud: false, tone: "warm", r: cam([2.2, 2.4], [760, 480], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bay(t, 760, BS, { pose: P.shrug, mouth: "flat", talk: true })}</>), html: q("“BİR KERE YENİLDİM. O DA SAYILMAZ.”", 80, 0.1) },
  { c: "Neden sayılmaz", hud: false, tone: "warm", r: cam([2.2, 2.4], [1000, 520], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{sen(t, 1000, 1, { pose: P.shrug, mouth: "o", talk: true })}</>) },
  { c: "Çünkü ben öyle diyorum", hud: false, sfx: "ding", tone: "gold", r: cam([2.6, 2.8], [760, 470], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bay(t, 760, BS, { pose: P.point, mouth: "grin", eyes: "squint", talk: true })}</>), html: big("“ÇÜNKÜ BEN ÖYLE DİYORUM.”", "#F6C445", 86, 860) },
  { c: "Kızın adı Su", hud: false, tone: "warm", r: cam([2.4, 2.6], [1400, 860], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{su(t, 1400, SS, { mouth: "none", look: -1 })}<Kopek x={1230} y={G} s={0.55} t={t} kind="kara" sit={1} /></>), html: tg("SU · BAYRAM DAYI'NIN TORUNU", T.yellow) },
  { c: "Su mu? Diyorsun", hud: false, tone: "warm", r: cam([1.5, 1.6], [880, 560], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{sen(t, 720, 1, { pose: P.point, mouth: "grin", talk: true })}{def(t, 1040, 1, { dir: -1, mouth: "flat" })}</>), html: q("“KURAL BİR: SU. HANGİSİ?”", 96, 0.3) },
  { c: "Defne sana bakmıyor", hud: false, tone: "warm", r: cam([2.4, 2.6], [1040, 500], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{def(t, 1040, 1, { mouth: "flat", eyes: "squint", look: 1 })}</>), html: q("“BAŞKAN'IN KURALLARI ŞAKA DEĞİL.”", 84, 0.3) },
  { c: "Konuşmaz diyor", hud: false, tone: "warm", r: cam([1.4, 1.5], [1000, 640], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bay(t, 760, BS, { mouth: "smile", talk: true })}{su(t, 1140, SS, { mouth: "none" })}</>), html: q("“AMA BAZEN YAZAR. BEN ANLARIM.”", 84, 0.5) },
  { c: "Anlamıyor", hud: false, sfx: "pop", tone: "warm", r: cam([2.4, 2.5], [760, 480], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bay(t, 760, BS, { mouth: "grin", eyes: "happy" })}</>), html: big("(ANLAMIYOR.)", "#FFFFFF", 110, 820) },
  { c: "Defne gence dönüyor", hud: false, tone: "night", r: cam([1.3, 1.4], [700, 600], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bor(t, 400, 1, { mouth: "smile" })}{def(t, 1000, 1, { dir: -1, mouth: "flat", brow: "angry", talk: true })}</>), html: q("“ADIN NE?” · “BORA.”", 96, 0.2) },
  { c: "Seni affettiğimi", hud: false, tone: "night", r: cam([2.4, 2.6], [1000, 500], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{def(t, 1000, 1, { dir: -1, mouth: "frown", brow: "angry", talk: true })}</>), html: q("“SENİ AFFETTİĞİMİ SANMA, BORA.”", 84, 0.1) },
  { c: "Affetme diyor Bora", hud: false, tone: "warm", r: cam([2.2, 2.4], [400, 520], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bor(t, 400, 1, { pose: P.hand, mouth: "smile", eyes: "happy", talk: true, holdR: cay(0.5) })}</>), html: q("“AFFETME. SADECE ÇAY İÇ.”", 96, 0.2) },
  { c: "Bora fırtına demek", hud: false, tone: "cool", r: cam([2, 2.2], [760, 470], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bay(t, 760, BS, { mouth: "frown", eyes: "squint", brow: "angry" })}</>), html: (t, a) => <><Txt t={t} at={a + 0.2} text="BORA = FIRTINA 🌪" y={120} size={92} color="#2EE6D0" /><Txt t={t} at={a + 1.6} text="“BEN FIRTINAYI SEVMEM.”" y={860} size={84} /></> },
  { c: "Peki ya jeneratör", hud: false, tone: "night", r: cam([1, 1.1], [960, 520], undefined, (t) => <VanGece t={t} bulb={0} gen={0} />), html: tg("JENERATÖR: KAPIDAN GİRDİĞİNİZ AN SUSTU", T.red) },
  { c: "Mazot bitti diyor", hud: false, tone: "night", r: cam([1.2, 1.3], [700, 560], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bay(t, 560, BS, { pose: P.shrug, mouth: "flat", talk: true })}{bor(t, 980, 1, { mouth: "flat", eyes: "squint", look: 1, dir: -1 })}</>), html: q("“KIRK BİDON VARDI. NASIL BİTTİ, BİLMEM.”", 76, 0.2) },
  { c: "Şimdi radyo Bora'nın", hud: false, sfx: "static", tone: "night", r: cam([1.4, 1.6], [900, 700], undefined, (t) => <><rect width={1920} height={1080} fill="#1E2A3A" /><Radyo x={900} y={800} s={1.5} t={t} on={1} voice={0.4} /><g transform="translate(1340,860) scale(2)"><Aku /></g></>), html: tg("RADYO = BORA'NIN AKÜSÜ", T.green) },
  { c: "Ve o gece bir şey daha", hud: false, tone: "night", r: cam([1.2, 1.35], [960, 640], undefined, radyo({ names: 1 })), html: tg("SANDALYELERDEKİ KÂĞITLAR", T.yellow) },
  { c: "Kimin yazdığını kimse", hud: false, tone: "night", r: cam([1.4, 1.5], [760, 480], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bay(t, 760, BS, { mouth: "flat", talk: true, pose: P.shrug })}</>), html: q("“BİR SABAH KALKTIK, BURADAYDILAR.”", 84, 0.4) },
  { c: "Sizin de mi doğum", hud: false, tone: "night", r: cam([2.2, 2.4], [1000, 520], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{sen(t, 1000, 1, { mouth: "o", eyes: "wide", talk: true })}</>) },
  { c: "Üçü on dört, diyor", hud: false, sfx: "boom", tone: "night", r: saat(3, 14), html: q("“YETMİŞ İKİ YIL ÖNCE.”", 86, 0.45, 960) },
  { c: "Bora gülümsüyor", hud: false, tone: "night", r: cam([2.4, 2.6], [400, 500], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{bor(t, 400, 1, { mouth: "smile", eyes: "squint" })}</>), html: q("“BEN DE.”", 120, 0.3) },
  { c: "Su başını sallıyor", hud: false, tone: "night", r: cam([2.6, 2.8], [1400, 860], undefined, (t) => <>{radyo({ beam: 0.8 })(t)}{su(t, 1400, SS, { mouth: "none", lookY: Math.sin(t * 6) * 0.6 })}</>) },
  { c: "Beş sandalye, beş insan", hud: false, sfx: "boom", tone: "night", r: cam([1, 1.06], [960, 600], undefined, (t) => <>{radyo({ beam: 1 })(t)}{su(t, 300, SS, { mouth: "none" })}{sen(t, 560, 1, { mouth: "o" })}{def(t, 840, 1, { mouth: "flat" })}{bor(t, 1140, 1, { mouth: "smile", dir: -1 })}{bay(t, 1500, BS, { mouth: "flat", dir: -1 })}</>), html: big("5 SANDALYE · 5 İNSAN · 03:14", "#F6C445", 86) },

  // ── 1. GÜN ──
  { c: "Birinci gün, sabah", g: 1, tone: "warm", r: cam([1, 1.1], [960, 560], undefined, sokak("day")), html: big("1. GÜN · SABAH", "#FFFFFF", 96) },
  { c: "Bayram Dayı sizi kahvaltıya", g: 1, tone: "warm", r: cam([1, 1.06], [960, 600], undefined, kahv({ bay: { talk: true, mouth: "grin" } })) },
  { c: "Otlu peynir", g: 1, tone: "warm", r: cam([2.2, 2.4], [700, 760], [1340, 760], kahv()), html: tg("OTLU PEYNİR · BAL · KAYMAK", T.yellow) },
  { c: "tavada tereyağında", g: 1, tone: "warm", r: cam([2.6, 2.9], [960, 720], undefined, kahv()), html: tg("MURTUĞA", T.orange) },
  { c: "kahvaltı bir öğün değil", g: 1, tone: "gold", ...kartTxt("VAN'DA KAHVALTI = TÖREN", "BİR SOKAK DOLUSU KAHVALTICI", "#F6C445", "#FFFFFF", "#3A2414") },
  { c: "Karabaş sucuğa bakıyor", g: 1, tone: "warm", r: cam([2.4, 2.6], [1640, 900], undefined, kahv({}, { dog: "sit" })), html: tg("👀 SUCUK", T.red) },
  { c: "Bayram dayı Karabaş'a", g: 1, tone: "warm", r: cam([2.4, 2.6], [1520, 620], undefined, kahv({ bay: { mouth: "frown", eyes: "squint", brow: "angry", look: 1 } })), html: big("HRRR… HRRR…", "#FFFFFF", 90, 860) },
  { c: "Bayram dayı sucuğu tabağına", g: 1, tone: "warm", r: cam([1.8, 2], [1460, 620], undefined, kahv({ bay: { mouth: "grin", talk: true } }, { sucuk: 0.3 })), html: q("“BENİM EVİMDE KÖPEK SUCUK YEMEZ.”", 80, 0.2) },
  { c: "Ve masanın altında", g: 1, tone: "warm", r: cam([1.2, 1.3], [600, 800], undefined, (t, a) => <><rect width={1920} height={1080} fill="#7A3A1E" /><rect y={0} width={1920} height={120} fill="#B5532E" />{[200, 1700].map((x) => <rect key={x} x={x} y={100} width={40} height={980} fill="#5A2A16" />)}<g transform={`translate(${lerp(260, 640, ramp(t, a + 0.4, a + 1.6))},560)`}><rect x={-120} y={-30} width={160} height={60} rx={30} fill="#F6C445" /><circle cx={50} cy={0} r={28} fill="#141414" /><ellipse cx={90} cy={0} rx={30} ry={18} fill="#A8322A" /></g><Kopek x={980} y={1000} s={1.2} t={t} kind="kara" sit={1} dir={-1} wag={1} /></>) },
  { c: "birinci raunt", g: 1, sfx: "ding", tone: "gold", ...kartTxt("1. RAUNT:", "KARABAŞ 🐶", "#FFFFFF", "#F6C445") },
  { c: "Kahvaltıdan sonra Bayram", g: 1, tone: "warm", r: cam([1.3, 1.4], [960, 600], undefined, (t) => <><KirikKapi t={t} k={0} />{bay(t, 1300, BS, { pose: P.reach, dir: -1, mouth: "frown", brow: "angry", sweat: true })}</>) },
  { c: "Kapıyı söküyor", g: 1, sfx: "knock", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} shake={6 * (1 - ramp(t, a + 0.6, a + 1.4))}><KirikKapi t={t} k={ramp(t, a + 0.3, a + 0.7)} />{bay(t, 1300, BS, { pose: P.cheer, dir: -1, mouth: "grin" })}</TCam>, html: big("SÖKÜYOR.", "#FFFFFF", 110, 860) },
  { c: "Defne defterini", g: 1, tone: "warm", r: cam([1, 1.05], [960, 540], undefined, (t, a, b) => <><rect width={1920} height={1080} fill={kagitBg} /><Defter lines={["Kural 6:", "Bayram Dayı, kapıyı kırmadan", "önce kolu dener."]} k={ramp(t, a + 0.3, b - 0.3)} /></>), html: tg("KURAL 6", T.red) },
  { c: "Bayram Dayı kuralı okuyor", g: 1, tone: "warm", r: cam([2.2, 2.4], [960, 480], undefined, (t) => <>{evGun(t)}{bay(t, 960, BS, { mouth: "grin", talk: true, pose: P.point })}</>), html: q("“KIRMIZI KALEMLE YAZ. BEN KIRMIZIYI GÖRÜRÜM.”", 70, 0.3) },
  { c: "Defne masaya bir harita", g: 1, tone: "warm", r: cam([1.1, 1.2], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill={kagitBg} /><Harita t={t} k={1} /></>), html: tg("1.600 M · KIŞIN −20°", T.blue) },
  { c: "Mazot yok", g: 1, tone: "cool", ...kartTxt("MAZOT YOK · YİYECEK AZALIYOR", "→ GÜNEYE. AKDENİZ'E.", "#FFFFFF", "#2EE6D0") },
  { c: "kahkaha atıyor", g: 1, tone: "warm", r: cam([2.2, 2.4], [960, 480], undefined, (t) => <>{evGun(t)}{bay(t, 960, BS, { mouth: "grin", eyes: "happy", talk: true, pose: P.hips })}</>), html: q("“BU ŞEHİRDEN ÇIKILMAZ KIZIM.”", 86, 0.3) },
  { c: "Çünkü dünden beri", g: 1, tone: "warm", r: cam([2.4, 2.6], [960, 480], undefined, (t) => <>{evGun(t)}{bay(t, 960, BS, { mouth: "flat", talk: true, pose: P.shrug })}</>), html: big("7 KERE DENEDİM.", "#F6C445", 100, 860) },
  { c: "deneme traktörle", g: 1, tone: "warm", hud: false, r: (t, a) => <Deneme t={t} a={a} n={1} icon="🚜" label="TRAKTÖR" /> },
  { c: "İkinci deneme kamyonla", g: 1, tone: "warm", hud: false, r: (t, a) => <Deneme t={t} a={a} n={2} icon="🚚" label="KAMYON" /> },
  { c: "Üçüncüsü bisikletle", g: 1, tone: "warm", hud: false, r: (t, a) => <Deneme t={t} a={a} n={3} icon="🚲" label="BİSİKLET" /> },
  { c: "Dördüncüsü atla", g: 1, tone: "warm", hud: false, r: (t, a) => <Deneme t={t} a={a} n={4} icon="🐎" label="AT" fail={false} /> },
  { c: "At onu eve", g: 1, sfx: "pop", tone: "warm", hud: false, r: (t, a) => <Deneme t={t} a={a - 0.9} n={4} icon="🐎" label="AT, ONU EVE GETİRMİŞ" /> },
  { c: "Beşincisi", g: 1, tone: "warm", hud: false, r: (t, a) => <Deneme t={t} a={a} n={5} icon="🚶" label="YÜRÜYEREK" /> },
  { c: "Altıncısı kepçeyle", g: 1, tone: "warm", hud: false, r: (t, a) => <Deneme t={t} a={a} n={6} icon="🏗️" label="KEPÇE" /> },
  { c: "Yedinci de", g: 1, tone: "warm", hud: false, r: (t, a) => <Deneme t={t} a={a} n={7} icon="🚗💪" label="ARABAYI TEK ELLE ÇIKARDI" /> },
  { c: "Tek elle mi", g: 1, tone: "warm", r: cam([2.2, 2.4], [960, 520], undefined, (t) => <>{evGun(t)}{sen(t, 960, 1, { mouth: "o", eyes: "squint", brow: "up", talk: true })}</>), html: q("“TEK ELLE Mİ?”", 110, 0.1) },
  { c: "Bayram dayı dışarı çıkıyor", g: 1, tone: "cool", r: cam([1, 1.08], [960, 620], undefined, (t, a, b) => <>{sokak("day")(t)}{araba(t, { x: 820, buried: 0.6, dog: false, front: <></> })}{walk(t, a, b, BAYRAM, 1800, 1380, BS, { mouth: "smile" })}</>), html: tg("KARA SAPLANMIŞ ŞAHİN", T.blue) },
  { c: "önünü bir karış", g: 1, sfx: "boing", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[1000, 760]}>{sokak("day")(t)}<g transform={`rotate(${-6 * ramp(t, a + 0.2, a + 1)} 470 960)`}>{araba(t, { x: 820, buried: 0.6, dog: false, front: <></> })}</g>{bay(t, 1300, BS, { pose: P.reach, dir: -1, mouth: "grin", brow: "angry" })}</TCam>, html: tg("BİR KARIŞ ↑", T.orange) },
  { c: "Bir saniye, iki saniye", g: 1, tone: "warm", r: cam([3, 3.2], [1300, 560], undefined, (t) => <>{sokak("day")(t)}{bay(t, 1300, BS, { pose: P.reach, dir: -1, mouth: "frown", eyes: "squint", brow: "worried", sweat: true })}</>), html: (t, a, b) => <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><Sayac t={t} a={a} marks={["1", "2"]} times={[a + 0.3, a + (b - a) * 0.45]} /></svg> },
  { c: "belim, diyor", g: 1, sfx: "knock", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.25]} c0={[1000, 760]} shake={5 * (1 - ramp(t, a + 0.3, a + 0.9))}>{sokak("day")(t)}{araba(t, { x: 820, buried: 0.6, dog: false, front: <></> })}{bay(t, 1300, BS, { pose: P.back, dir: -1, mouth: "o", eyes: "closed", brow: "worried" })}</TCam>, html: q("“BELİM.”", 120, 0.05) },
  { c: "Her seferinde saatlerce", g: 1, tone: "cool", r: cam([1, 1.08], [960, 600], undefined, surus("bozkir")) },
  { c: "çıkmış. Van'a hoş", g: 1, tone: "cool", r: cam([1.5, 1.7], [1240, 600], undefined, tabela("day")), html: tg("HER SEFERİNDE · AYNI TABELA", T.red) },
  { c: "o sırada su kahvaltıyı", g: 1, tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[1300, 600]}>{evGun(t)}{walk(t, a, b, SU, 800, 1400, SS, { mouth: "none" })}</TCam> },
  { c: "Buğulu camın üstüne", g: 1, sfx: "tick", tone: "warm", r: buz("ÜÇ GECE", "write") , html: tg("NOKTALAR · ÇİZGİLER", T.blue) },
  { c: "Sonra dönüp hiçbir", g: 1, tone: "warm", r: cam([2.4, 2.6], [380, 620], undefined, kahv({ su: { mouth: "smile", eyes: "happy" } })) },
  { c: "Pide diyor", g: 1, tone: "gold", r: cam([2, 2.2], [1520, 560], undefined, kahv({ bay: { mouth: "grin", talk: true, eyes: "squint" } })), html: q("“PİDE DİYOR. KIZ PİDE İSTİYOR.”", 84, 0.1) },
  { c: "Ama sen ve Defne", g: 1, sfx: "drone", tone: "cool", r: cam([1.8, 2], [800, 560], undefined, kahv({ sen: { mouth: "o", eyes: "wide", look: 1 }, def: { mouth: "o", eyes: "wide", look: -1 } })), html: tg("MORS · SİZİN DİLİNİZ", T.hero) },
  { c: "Defne cama yaklaşıyor", g: 1, tone: "cool", r: cam([1.4, 1.5], [1000, 560], undefined, (t, a, b) => <>{evGun(t)}{walk(t, a, b, DEFNE, 600, 1100, 1, { mouth: "o", eyes: "squint" })}</>) },
  { c: "Harf harf okuyor", g: 1, tone: "cool", r: buz("ÜÇ GECE", "read") },
  { c: "Üç gece ne", g: 1, tone: "cool", r: cam([2.2, 2.4], [960, 520], undefined, (t) => <>{evGun(t)}{sen(t, 960, 1, { pose: P.shrug, mouth: "open", brow: "worried", talk: true })}</>), html: q("“ÜÇ GECE SONRA NE OLACAK?”", 90, 0.4) },
  { c: "Su'ya soru", g: 1, tone: "warm", r: cam([1, 1.05], [960, 540], undefined, () => <><rect width={1920} height={1080} fill="#E9E2CF" /><Kagit x={960} y={520} s={1.5} lines={["Bunu nereden", "öğrendin?"]} c="#2A5DA8" /></>) },
  { c: "Su kağıda bakıyor", g: 1, tone: "warm", r: cam([2.2, 2.4], [960, 760], undefined, (t) => <>{evGun(t)}{su(t, 960, 1, { pose: P.shrug, mouth: "flat" })}</>), html: tg("HATIRLAMIYOR", T.purple) },
  { c: "Kimse bilmiyor", g: 1, sfx: "boom", tone: "night", ...kartTxt("3 GECE İÇİNDE", "BU ŞEHİRDEN ÇIKMALIYIZ.", "#FFFFFF", "#E0393E") },
  { c: "Bora pencereye bakıyor", g: 1, tone: "cool", r: cam([2, 2.2], [1460, 520], undefined, (t) => <>{evGun(t)}{bor(t, 1460, 1, { mouth: "flat", eyes: "squint", look: 1 })}</>), html: q("“O ZAMAN ACELE EDELİM.”", 90, 0.4) },
  { c: "deneme, kuzey", g: 1, tone: "warm", r: ici({ mouth: "smile", talk: true, pose: P.point }, { mouth: "flat" }), html: big("1. DENEME · KUZEY · ERCİŞ YOLU", "#FFFFFF", 80) },
  { c: "Sen arkadasın", g: 1, tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#2A2E36" /><g transform="translate(960,560) rotate(180) translate(-960,-560) scale(1)"><g transform="translate(480,270) scale(0.5)"><Harita t={t} k={1} /></g></g>{sen(t, 960, 1.5, { mouth: "o", eyes: "squint", brow: "worried", pose: P.hold }, 1560)}</TCam>, html: tg("HARİTA: TERS", T.red) },
  { c: "Bora haritayı senden", g: 1, sfx: "pop", tone: "warm", r: haritaT(0.6) },
  { c: "göz göze geliyorlar", g: 1, tone: "warm", r: ici({ mouth: "grin", eyes: "happy", look: 1 }, { mouth: "grin", eyes: "happy", look: -1 }) },
  { c: "Sana değil", g: 1, tone: "warm", r: cam([1.8, 2], [960, 600], undefined, (t) => <><rect width={1920} height={1080} fill="#2A2E36" />{sen(t, 960, 1.5, { mouth: "frown", eyes: "squint", pose: P.hold }, 1560)}</>), html: q("SANA DEĞİL. SENİN HÂLİNE.", 86, 0.3) },
  { c: "Saatlerce kuzeye", g: 1, tone: "warm", r: cam([1, 1.08], [960, 600], undefined, surus("bozkir")), html: tg("GÜNEŞ: TAM TEPEDE ☀", T.yellow) },
  { c: "Ve öğleden sonra", g: 1, sfx: "boom", tone: "cool", r: cam([1, 1.25], [1240, 640], undefined, tabela("day")), html: q("“VAN'A HOŞ GELDİNİZ.”", 96, 0.4, 960) },
  { c: "Tabelanın altında bir kedi", g: 1, tone: "cool", r: cam([1.8, 2], [1180, 900], undefined, tabela("day", true)) },
  { c: "Radyo odasının kapısındaki", g: 1, tone: "cool", r: cam([3.4, 3.6], [1180, 900], undefined, tabela("day", true)), html: tg("BİR GÖZÜ MAVİ · BİR GÖZÜ SARI", T.yellow) },
  { c: "Pisi pisi", g: 1, sfx: "pop", tone: "warm", r: cam([1.3, 1.4], [1000, 760], undefined, (t) => <>{tabela("day", true)(t)}{sen(t, 760, 1, { pose: P.wave, mouth: "open", talk: true })}</>), html: q("“PİSİ PİSİ!”", 110, 0.1) },
  { c: "Beyaz ve mavi gözlü", g: 1, tone: "cool", ...kartTxt("BEYAZ + MAVİ GÖZ", "ÇOĞU DOĞUŞTAN SAĞIR.", "#FFFFFF", "#2EE6D0") },
  { c: "senin şakalarını hiç", g: 1, sfx: "ding", tone: "gold", r: cam([3, 3.2], [1180, 900], undefined, tabela("day", true)), html: q("ŞANSLI KEDİ.", 110, 0.5) },
  { c: "Defne direksiyona alnını", g: 1, tone: "cool", r: ici({ mouth: "flat", look: 1 }, { mouth: "frown", eyes: "closed", brow: "worried", pose: P.reach }, { z: [1.6, 1.7], c: [1220, 560] }) },
  { c: "Bilimsel bir açıklaması", g: 1, tone: "cool", r: ici({ mouth: "smile", talk: true, pose: P.point }, { mouth: "flat" }, { z: [1.6, 1.7], c: [700, 560] }), html: q("“İNSAN DÜZ GİTTİĞİNİ SANIR. AMA DAİRE ÇİZER.”", 70, 0.2) },
  { c: "Bu doğru. Almanya'da", g: 1, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]}><rect width={1920} height={1080} fill="#0E1A2E" /><Daire t={t} a={a} b={b} /></TCam>, html: (t, a) => <><Txt t={t} at={a + 0.2} text="DENEY: ALMANYA + SAHRA" y={90} size={70} color="#2EE6D0" /><Txt t={t} at={a + 1.4} text="GÜNEŞİ GÖREMEYEN → DAİRE ÇİZDİ" y={960} size={66} color="#F6C445" /></> },
  { c: "Güneşi göremeyen insanlar", g: 1, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]}><rect width={1920} height={1080} fill="#0E1A2E" /><Daire t={t} a={a - 3} b={b} /></TCam>, html: q("DÜZ YÜRÜDÜĞÜNÜ SANIRKEN: KOCAMAN DAİRELER", 70, 0.2, 960) },
  { c: "İşte diyorsun", g: 1, sfx: "ding", tone: "gold", r: ici({ mouth: "smile" }, { mouth: "flat", look: -1 }, { z: [1, 1.06] }), html: q("“DAİRE ÇİZDİK! ÇÖZDÜK!”", 100, 0.1) },
  { c: "Aynen öyle, diyor Bora", g: 1, sfx: "drone", tone: "cool", r: ici({ mouth: "smile", eyes: "squint", talk: true }, { mouth: "flat" }, { z: [2.2, 2.4], c: [700, 480] }), html: tg("ÇOK HIZLI. FAZLA HIZLI.", T.red) },

  // ── 1. GECE ──
  { c: "Ve o akşam güneş", g: 1, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1, 1.1]}>{sokak("dusk")(t)}{sen(t, 960, 1, { mouth: "flat", eyes: "squint" })}</TCam><GeceModu t={t} a={a + 1} k={ramp(t, a + 1, a + 2)} /></> },
  { c: "Gece olan sen günü", g: 1, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1, 1.1]}>{yol(t, "bozkir", "night", true)}</TCam><GeceModu t={t} a={a} notes={[{ text: "KAVŞAK 1", x: 360, y: 300 }, { text: "KAVŞAK 2", x: 960, y: 260 }, { text: "KAVŞAK 3", x: 1560, y: 300 }]} /></> },
  { c: "O deneyde güneşi görebilen", g: 1, n: true, tone: "night", ...kartTxt("GÜNEŞİ GÖREN:", "DAİRE ÇİZMEDİ. ☀", "#8E7BFF", "#F6C445") },
  { c: "Üstelik siz yürümüyordunuz", g: 1, n: true, tone: "night", ...kartTxt("YÜRÜMÜYORDUNUZ. YOLDAYDINIZ.", "YOL KENDİ KENDİNE DÖNMEZ.", "#8E7BFF", "#FFFFFF") },
  { c: "kilometre gitti. Van'dan", g: 1, n: true, tone: "night", r: kart("#0E1A2E"), html: big("BUGÜN: 212 KM", "#F6C445", 130, 420) },
  { c: "Van'dan Erciş'e", g: 1, n: true, tone: "night", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a} text="BUGÜN: 212 KM" y={300} size={90} color="#F6C445" /><Txt t={t} at={a + 0.6} text="VAN → ERCİŞ: 100 KM" y={480} size={90} color="#FFFFFF" /></> },
  { c: "Ama bütün gün tek bir", g: 1, n: true, sfx: "boom", tone: "night", ...kartTxt("ERCİŞ TABELASI:", "0", "#FFFFFF", "#E0393E") },
  { c: "Ve üç kavşaktaki mavi", g: 1, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1, 1.12]} c0={[1100, 560]}>{levha({ scratch: 1 })(t)}</TCam><GeceModu t={t} a={a} k={0.6} scan={false} /></> },
  { c: "Pası kazınmış", g: 1, n: true, tone: "night", r: cam([3.6, 3.9], [870, 428], undefined, levha({ scratch: 1 })), html: tg("YENİ ÇİZİKLER · PIRIL PIRIL", T.purple) },
  { c: "Daire çizmediniz", g: 1, n: true, tone: "night", r: cam([1, 1.1], [1100, 560], undefined, levha({ scratch: 1 })), html: q("DAİRE ÇİZMEDİNİZ.", 100, 0.1) },
  { c: "Biri tabelaları çevirdi", g: 1, n: true, sfx: "boom", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[1100, 520]}><g>{levha({ scratch: 1, lines: t < a + 0.8 ? [["ERCİŞ", "←"], ["GEVAŞ", "↑"]] : [["ERCİŞ", "↑"], ["GEVAŞ", "→"]] })(t)}</g></TCam>, html: big("BİRİ TABELALARI ÇEVİRDİ.", "#E0393E", 96, 860) },
  { c: "Bir kağıda yazmaya", g: 1, n: true, tone: "night", r: cam([1, 1.05], [960, 540], undefined, (t, a, b) => <><rect width={1920} height={1080} fill="#2A1E16" /><Defter lines={["Tabelaları biri çeviriyor.", "Bence…"]} k={ramp(t, a + 0.3, b - 0.3)} /></>) },
  { c: "saat üçü on dört. Ve", g: 1, n: true, sfx: "boom", tone: "night", r: saat(3, 14, "#2A1E16") },
  { c: "Ve kalem cümlenin", g: 1, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 640]}><rect width={1920} height={1080} fill="#1A140E" />{otur(sen, t, 960, 700, 1, { eyes: "closed", mouth: "flat", lookY: 1 })}<rect x={500} y={820} width={920} height={30} fill="#5A3A26" /><g transform={`translate(${1100 + ramp(t, a + 0.3, a + 0.9) * 120},${780 + ramp(t, a + 0.3, a + 0.9) * 260}) rotate(${ramp(t, a + 0.3, a + 0.9) * 120})`}><rect x={-4} y={-60} width={8} height={120} fill="#F6C445" /></g></TCam><GeceModu t={t} a={a} crash={1} /></> },
  { c: "Defne her gece olduğu", g: 1, n: true, tone: "night", r: cam([1.8, 2], [960, 560], undefined, (t, a) => <><rect width={1920} height={1080} fill="#101626" />{def(t, 960, 1.1, { eyes: ramp(t, a + 0.4, a + 0.6) > 0.5 ? "open" : "closed", mouth: "flat", brow: "worried" })}<Saat x={1500} y={380} s={0.9} h={3} m={14} c="#F4EAD6" /></>) },
  { c: "Mutfağa iniyor", g: 1, n: true, tone: "night", r: cam([1, 1.08], [960, 560], undefined, mutfak({ def: false, bor: { mouth: "flat", eyes: "squint" } }, 0)), html: tg("KARANLIKTA BİRİ", T.purple) },
  { c: "sen de mi uyumuyorsun", g: 1, n: true, tone: "night", r: cam([2, 2.2], [1180, 560], undefined, mutfak({ def: false, bor: { mouth: "smile", eyes: "squint" } }, 0)), html: q("“SEN DE Mİ UYUMUYORSUN?”", 90, 0.1) },
  { c: "düşünmem diyor Bora", g: 1, n: true, tone: "night", r: cam([2.4, 2.6], [1180, 540], undefined, mutfak({ def: false, bor: { mouth: "smile", talk: true } }, 0.5)), html: q("“GÜNDÜZ DÜŞÜNÜRÜM. GECE SADECE BEKLERİM.”", 72, 0.2) },
  { c: "Defne yanına oturuyor", g: 1, n: true, tone: "warm", r: cam([1.2, 1.3], [1000, 600], undefined, mutfak()), html: tg("İLK KEZ KONUŞUYORLAR", T.orange) },
  { c: "Defne annesini anlatıyor", g: 1, n: true, tone: "warm", r: cam([2, 2.2], [820, 560], undefined, mutfak({ def: { talk: true, mouth: "smile" } })), html: q("ANNESİNİN ÇAYI · BABASININ KÖTÜ FIKRALARI", 66, 0.3) },
  { c: "gündür bir kez bile", g: 1, n: true, tone: "warm", r: cam([2.6, 2.8], [820, 520], undefined, mutfak({ def: { mouth: "flat", eyes: "squint" } })), html: tg("114 GÜN · 0 GÖZYAŞI", T.blue) },
  { c: "Bora dinliyor", g: 1, n: true, tone: "warm", r: cam([2.4, 2.6], [1180, 540], undefined, mutfak({ bor: { mouth: "smile", eyes: "squint", look: -1 } })) },
  { c: "Malatya'dan gelirken", g: 1, n: true, tone: "warm", r: cam([2.2, 2.4], [1180, 540], undefined, mutfak({ bor: { mouth: "smile", talk: true } })), html: q("“BATIDA BİR IŞIK GÖRDÜM. BELKİ BAŞKALARI DA VARDIR.”", 64, 0.1) },
  { c: "Defne'nin gözleri doluyor", g: 1, n: true, sfx: "drone", tone: "warm", r: cam([3, 3.2], [820, 500], undefined, mutfak({ def: { mouth: "frown", eyes: "squint", brow: "worried", sweat: true } })) },
  { c: "Ve umut bazen", g: 1, n: true, tone: "night", ...kartTxt("UMUT, BAZEN", "ACIDAN DAHA AĞIRDIR.", "#FFFFFF", "#F6C445") },
  { c: "gündür herkesi taşıyorsun", g: 1, n: true, tone: "warm", r: cam([2.4, 2.6], [1180, 540], undefined, mutfak({ bor: { mouth: "flat", talk: true, look: -1 } })), html: q("“SENİ KİM TAŞIYOR?”", 110, 0.55) },
  { c: "Defne cevap veremiyor", g: 1, n: true, tone: "warm", r: cam([3, 3.2], [820, 500], undefined, mutfak({ def: { mouth: "flat", eyes: "open", brow: "worried" } })) },
  { c: "Gündüz olan sen, Defne'nin", g: 1, n: true, tone: "night", r: cam([1.4, 1.5], [960, 700], undefined, (t) => <><rect width={1920} height={1080} fill="#0C1220" />{yat(t, 760, 900, 1)}</>), html: tg("SEN: UYUYORDUN", T.purple) },
  { c: "Ama Bora gördü", g: 1, n: true, sfx: "drone", tone: "night", r: cam([3.2, 3.4], [1180, 500], undefined, mutfak({ bor: { mouth: "smile", eyes: "squint", look: -1 } }, 0.6)), html: q("AMA BORA GÖRDÜ.", 100, 0.2) },

  // ── 2. GÜN ──
  { c: "Sabah uyanıyorsun", g: 2, tone: "warm", r: cam([1, 1.06], [960, 540], undefined, () => <><rect width={1920} height={1080} fill="#E9E2CF" /><Kagit x={960} y={520} s={1.5} lines={["Tabelaları biri", "çeviriyor. Bence…"]} c="#2A2A2A" /></>), html: big("2. GÜN · SABAH", "#0E1A2E", 80) },
  { c: "Çeviriyor mu? diyorsun", g: 2, tone: "gold", r: cam([2.2, 2.4], [960, 520], undefined, (t) => <>{evGun(t)}{sen(t, 960, 1, { pose: P.shrug, mouth: "grin", eyes: "happy", talk: true, holdR: <Not /> })}</>), html: q("“BU TABELA BENİ BENDEN ÇOK SEVİYOR ZATEN.”", 70, 0.45) },
  { c: "Bora notu nazikçe", g: 2, tone: "warm", r: cam([1.3, 1.4], [1100, 560], undefined, (t) => <>{evGun(t)}{sen(t, 860, 1, { mouth: "smile" })}{bor(t, 1260, 1, { pose: P.hand, dir: -1, mouth: "smile", holdR: <Not /> })}</>) },
  { c: "Cebine koyuyor", g: 2, sfx: "drone", tone: "cool", r: cam([3.4, 3.6], [1240, 820], undefined, (t) => <>{evGun(t)}{bor(t, 1260, 1, { pose: { l: [-8, -6], r: [20, -10] }, dir: -1, mouth: "smile" })}</>), html: tg("NOT → CEBE", T.red) },
  { c: "çok yoruluyorsun", g: 2, tone: "warm", r: cam([2.2, 2.4], [1260, 500], undefined, (t) => <>{evGun(t)}{bor(t, 1260, 1, { mouth: "smile", eyes: "happy", dir: -1, talk: true })}</>), html: q("“GECE OLAN SEN ÇOK YORULUYOR. BİRAZ DİNLEN.”", 68, 0.1) },
  { c: "Ve sen ona teşekkür", g: 2, tone: "warm", r: cam([2.2, 2.4], [860, 520], undefined, (t) => <>{evGun(t)}{sen(t, 860, 1, { mouth: "grin", eyes: "happy", talk: true })}</>) },
  { c: "Ama Defne, kapının yanında", g: 2, sfx: "drone", tone: "cool", r: cam([1.6, 1.8], [400, 560], undefined, (t) => <>{evGun(t)}<rect x={220} y={280} width={330} height={760} fill="#8A6A4A" />{def(t, 400, 1, { mouth: "flat", eyes: "squint", look: 1 })}</>) },
  { c: "Bora'nın elini, cebine", g: 2, tone: "cool", r: cam([2.8, 3], [460, 470], undefined, (t) => <>{evGun(t)}<rect x={220} y={280} width={330} height={760} fill="#8A6A4A" />{def(t, 400, 1, { mouth: "flat", eyes: "squint", brow: "worried", look: 1 })}</>), html: q("VE HİÇBİR ŞEY SÖYLEMİYOR.", 86, 0.5) },
  { c: "Bu arada sana bir şey", g: 2, hud: false, tone: "gold", r: cam([1, 1.06], [960, 560], undefined, (t) => <>{sokak("day")(t)}{sen(t, 760, 1, { mouth: "smile", pose: P.wave })}{def(t, 1060, 1, { mouth: "smile", dir: -1 })}<Kopek x={1280} y={G} s={0.6} t={t} kind="kara" sit={1} dir={-1} wag={1} /></>), html: q("HER BÖLÜM: GÜNLERCE SÜREN BİR EMEK", 70, 0.3, 180) },
  { c: "Eğer bu emeği", g: 2, hud: false, sfx: "ding", tone: "gold", r: cam([1, 1.06], [960, 560], undefined, (t) => <>{sokak("day")(t)}{su(t, 640, SS, { mouth: "smile", pose: P.wave })}{bay(t, 1000, BS, { mouth: "grin", pose: P.cheer })}</>), html: (t, a) => <><Txt t={t} at={a + 0.2} text="ABONE OL + BEĞEN 👍" y={170} size={84} color="#FFFFFF" /><Abone t={t} at={a + 0.8} /></> },
  { c: "İkinci gün, ikinci deneme", g: 2, tone: "cool", r: cam([1, 1.08], [960, 600], undefined, surus("gol")), html: big("2. DENEME · GÜNEY · GEVAŞ", "#FFFFFF", 84) },
  { c: "Gevaş Van'a sadece", g: 2, tone: "cool", ...kartTxt("VAN → GEVAŞ: 40 KM", "BİR SAAT BİLE SÜRMEZ.", "#FFFFFF", "#2EE6D0") },
  { c: "Ama öğlen yine aynı", g: 2, sfx: "boom", tone: "cool", r: cam([1.1, 1.3], [680, 640], undefined, tabela("day", false, true)), html: q("YİNE. BU SEFER ÖBÜR TARAFTAN.", 80, 0.3, 960) },
  { c: "Gölün kıyısında o kedi", g: 2, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[1300, 700]}><VanGolu t={t} cat={ramp(t, a, b)} /></TCam>, html: tg("YÜZÜYOR 🐱🌊", T.blue) },
  { c: "Van kedisi Van Gölü'nde", g: 2, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[1200, 720]}><VanGolu t={t} cat={0.4 + ramp(t, a, b) * 0.4} /></TCam>, html: tg("VAN KEDİSİ: YÜZMESİYLE MEŞHUR", T.blue) },
  { c: "Ve Van Gölü'nün suyu", g: 2, tone: "cool", r: cam([1, 1.08], [960, 600], undefined, (t) => <VanGolu t={t} cat={0} />), html: tg("SODALI SU · ZOR DONAR", T.hero) },
  { c: "Kedi kıyıya", g: 2, tone: "warm", r: cam([2.4, 2.6], [1000, 860], undefined, (t) => <><VanGolu t={t} cat={0} /><VanKedisi x={1000} y={930} s={1} t={t} look={-1} /></>), html: q("“YİNE Mİ SİZ?”", 110, 0.5) },
  { c: "Defne arabadan iniyor", g: 2, tone: "cool", r: cam([1.1, 1.2], [960, 640], undefined, (t) => <><VanGolu t={t} cat={0} />{def(t, 960, 1, { mouth: "flat", look: 1 }, 950)}</>) },
  { c: "Yanına gidiyorsun", g: 2, tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[900, 640]}><VanGolu t={t} cat={0} />{walk(t, a, b, SEN, 300, 680, 1, { mouth: "smile" }, 950)}{def(t, 960, 1, { mouth: "flat", look: 1 }, 950)}</TCam> },
  { c: "Bak başkan", g: 2, tone: "gold", r: cam([1.6, 1.8], [820, 560], undefined, (t) => <><VanGolu t={t} cat={0} />{sen(t, 680, 1, { pose: P.point, mouth: "grin", talk: true }, 950)}{def(t, 960, 1, { mouth: "flat", look: 1 }, 950)}</>), html: q("“SU BOL. BİR DE ARABADA AYRICA BİR SU VAR.”", 70, 0.4) },
  { c: "Su bol, bütün göl", g: 2, tone: "gold", r: cam([1, 1.08], [960, 640], undefined, (t) => <><VanGolu t={t} cat={0} />{sen(t, 680, 1, { pose: P.cheer, mouth: "grin", eyes: "happy", talk: true }, 950)}{def(t, 960, 1, { mouth: "flat", look: -1 }, 950)}</>) },
  { c: "Arkanızda biri sessizce", g: 2, sfx: "ding", tone: "gold", r: cam([1, 1.06], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#BFE0F0" /><rect y={640} width={1920} height={440} fill="#E8EEF3" />{su(t, 960, 1.9, { pose: { l: [160, 100], r: [160, -100] }, eyes: "happy", mouth: "grin", bob: Math.sin(t * 22) * 4 } as Face, 1280)}<path fillRule="evenodd" d="M0,0 H1920 V1080 H0Z M420,140 H1500 Q1560,140 1560,200 V760 H360 V200 Q360,140 420,140Z" fill="#E8E4D8" /><rect x={360} y={760} width={1200} height={24} fill="#C9C4B6" /></>), html: tg("SU GÜLÜYOR 🤭", T.yellow) },
  { c: "Bu evde senin şakalarına", g: 2, tone: "gold", r: cam([2.2, 2.4], [680, 520], undefined, (t) => <><VanGolu t={t} cat={0} />{sen(t, 680, 1, { mouth: "grin", eyes: "happy", pose: P.hips }, 950)}</>), html: tg("GÜLEN TEK İNSAN: 10 YAŞINDA", T.yellow) },
  { c: "bundan garip bir şekilde", g: 2, tone: "gold", r: cam([1.6, 1.7], [900, 640], undefined, (t) => <>{yol(t, "gol", "day")}{araba(t, { x: 900, dog: false, front: <></>, back: <TFig x={-110} y={-20} s={0.36} o={SU} t={t} pose={{ l: [140, 170], r: [140, 170] }} eyes="happy" mouth="grin" rim={0.3} /> })}{sen(t, 1500, 1, { mouth: "grin", eyes: "happy", pose: P.hips, dir: -1 })}</>), html: tg("GARİP BİR GURUR 😌", T.orange) },
  { c: "Ama Defne gülmüyor", g: 2, tone: "cool", r: cam([2.6, 2.8], [960, 520], undefined, (t) => <><VanGolu t={t} cat={0} />{def(t, 960, 1, { mouth: "flat", eyes: "squint", brow: "worried" }, 950)}</>) },
  { c: "Annemi görmek istiyorum", g: 2, sfx: "drone", tone: "cool", r: cam([3, 3.2], [960, 500], undefined, (t) => <><VanGolu t={t} cat={0} />{def(t, 960, 1, { mouth: "frown", eyes: "squint", brow: "worried", sweat: true, talk: true }, 950)}</>), html: q("“ANNEMİ GÖRMEK İSTİYORUM.”", 96, 0.1) },
  { c: "Ve sen ne diyeceğini", g: 2, tone: "cool", r: cam([2.4, 2.6], [680, 520], undefined, (t) => <><VanGolu t={t} cat={0} />{sen(t, 680, 1, { mouth: "flat", brow: "worried" }, 950)}</>) },
  { c: "Defne arkasını dönüp", g: 2, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><VanGolu t={t} cat={0} />{sen(t, 500, 1, { mouth: "flat", brow: "worried" }, 950)}{walk(t, a, b - 1, DEFNE, 900, 1500, 1, { mouth: "flat" }, 950)}{walk(t, a + (b - a) * 0.45, b, BORA, 300, 1100, 1, { mouth: "smile" }, 950)}</TCam>, html: q("“BİRAZ YÜRÜYELİM Mİ?”", 86, 0.7) },
  { c: "Basamağa oturuyorsun", g: 2, tone: "warm", r: cam([1, 1.08], [700, 640], undefined, (t) => <>{sokak("day")(t)}{otur(sen, t, 430, 958, 0.95, { mouth: "flat", look: 1 })}</>) },
  { c: "Karlı sokakta yan yana", g: 2, tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}>{sokak("day")(t)}{otur(sen, t, 430, 958, 0.95, { mouth: "flat", look: 1 })}{walk(t, a, b + 4, DEFNE_M, 900, 1200, 0.6, { mouth: "smile", talk: true }, 920)}{walk(t, a, b + 4, BORA, 1080, 1380, 0.6, { mouth: "grin" }, 920)}<Kopek x={wx(t, a, b + 4, 1250, 1550, 0.6)} y={920} s={0.38} t={t} kind="kara" run={1} /></TCam> },
  { c: "Ama Bora, Defne'nin omzuna", g: 2, tone: "cool", r: cam([1.8, 2], [1150, 760], undefined, (t) => <>{sokak("day")(t)}{def(t, 1060, 0.7, { mouth: "smile" }, 960)}{bor(t, 1240, 0.7, { pose: { l: [-8, -6], r: [-110, -160] }, mouth: "smile", dir: -1 }, 960)}<Kopek x={1440} y={960} s={0.45} t={t} kind="kara" dir={-1} wag={0} /></>) },
  { c: "kas katı", g: 2, sfx: "drone", tone: "cool", r: cam([1.6, 1.7], [960, 700], undefined, (t) => <>{sokak("day")(t)}<g transform={`translate(0,${Math.sin(t * 40) * 1.5})`}><Kopek x={960} y={1040} s={1.3} t={t} kind="kara" dir={-1} wag={0} /></g></>), html: big("HRRRRR…", "#FFFFFF", 96, 860) },
  { c: "Bir köpek hırladığında", g: 2, tone: "cool", ...kartTxt("HIRLAMAK = SALDIRI DEĞİL.", "UYARI: “BİR ADIM DAHA ATMA.”", "#FFFFFF", "#F6C445") },
  { c: "Defne duymuyor", g: 2, tone: "cool", r: cam([3, 3.2], [1240, 700], undefined, (t, a, b) => <>{sokak("day")(t)}{bor(t, 1240, 0.7, { mouth: t > a + (b - a) * 0.4 ? "flat" : "smile", eyes: "squint", dir: -1, look: 1 }, 960)}</>) },
  { c: "Karabaş'a elini uzatıyor", g: 2, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[1100, 720]}>{sokak("day")(t)}{bor(t, 1000, 0.8, { pose: P.reach, mouth: "smile" }, 1000)}<Kopek x={lerp(1300, 1900, ramp(t, a + (b - a) * 0.4, b))} y={1000} s={0.5} t={t} kind="kara" run={t > a + (b - a) * 0.4 ? 1 : 0} /></TCam> },
  { c: "Bayram dayı yanına oturuyor", g: 2, tone: "warm", r: cam([1.3, 1.4], [520, 760], undefined, (t) => <>{sokak("day")(t)}{otur(sen, t, 380, 958, 0.95, { mouth: "flat", look: 1 })}{otur(bay, t, 640, 958, 1.1, { mouth: "flat", dir: -1 })}</>) },
  { c: "o çocuğu sevmedim", g: 2, sfx: "drone", tone: "warm", r: cam([2.2, 2.4], [640, 560], undefined, (t) => <>{sokak("day")(t)}{otur(bay, t, 640, 958, 1.1, { mouth: "flat", talk: true, dir: -1, brow: "worried" })}</>), html: q("“BEN… O ÇOCUĞU SEVMEDİM, EVLAT.”", 86, 0.1) },
  { c: "önce rakibin gözüne", g: 2, tone: "warm", r: cam([3.4, 3.6], [640, 500], undefined, (t) => <>{sokak("day")(t)}{otur(bay, t, 640, 958, 1.1, { mouth: "flat", eyes: "squint", talk: true, dir: -1 })}</>), html: q("“GÖZÜ GÜLEN AMA YÜZÜ GÜLMEYEN ADAM, OYUNUNU ÇOKTAN KURMUŞTUR.”", 60, 0.2) },
  { c: "Sonra sana dönüyor", g: 2, tone: "warm", r: cam([1.8, 2], [520, 600], undefined, (t) => <>{sokak("day")(t)}{otur(sen, t, 380, 958, 0.95, { mouth: "o", look: 1 })}{otur(bay, t, 640, 958, 1.1, { mouth: "grin", talk: true, dir: -1 })}</>) },
  { c: "Bir de satranç", g: 2, tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><Satranc t={t} k={ramp(t, a + (b - a) * 0.4, a + (b - a) * 0.55)} /></TCam>, html: tg("SABAH: 10 SANİYEDE YENDİ", T.red) },
  { c: "Akşam ben yendim", g: 2, sfx: "ding", tone: "gold", r: cam([1.3, 1.4], [960, 540], undefined, (t) => <Satranc t={t} k={1} />), html: big("AKŞAM: BAYRAM 3 – 0", "#F6C445", 90, 860) },
  { c: "Durup düşünüyorsun", g: 2, tone: "cool", r: cam([2.4, 2.6], [380, 600], undefined, (t) => <>{sokak("day")(t)}{otur(sen, t, 380, 958, 0.95, { mouth: "flat", eyes: "squint", pose: { ...P.sit, r: [20, 150] } })}</>), html: q("GÜNDÜZ DÂHİ. GECE SIRADAN.", 90, 0.3) },
  { c: "Senin tam tersin", g: 2, sfx: "boom", tone: "night", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a} text="SEN: GECE DÂHİ 🌙" y={300} size={84} color="#8E7BFF" /><Txt t={t} at={a + 0.6} text="BORA: GÜNDÜZ DÂHİ ☀" y={480} size={84} color="#F6C445" /></> },

  // ── 2. GECE ──
  { c: "O akşam güneş batıyor", g: 2, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1, 1.1]}>{sokak("dusk")(t)}</TCam><GeceModu t={t} a={a + 0.8} k={ramp(t, a + 0.8, a + 1.6)} /></> },
  { c: "notu arıyorsun", g: 2, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.2, 1.3]}><rect width={1920} height={1080} fill="#1A140E" /><rect x={300} y={820} width={1320} height={30} fill="#5A3A26" />{sen(t, 960, 1, { pose: P.reach, mouth: "o", eyes: "wide" })}</TCam></>, html: big("YOK.", "#E0393E", 140, 420) },
  { c: "bir şeyi daha hesaplıyor", g: 2, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1, 1.05]}><rect width={1920} height={1080} fill="#0C1220" /></TCam><GeceModu t={t} a={a} /></> },
  { c: "Bugün Defne, Bora'yla", g: 2, n: true, tone: "night", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="BORA İLE: 4 SA 12 DK" y={300} size={100} color="#F6C445" /><Txt t={t} at={a + 1.6} text="SENİNLE: 9 DK" y={500} size={100} color="#E0393E" /></> },
  { c: "Bu bir rakam", g: 2, n: true, tone: "night", r: cam([2.4, 2.6], [960, 520], undefined, (t) => <><rect width={1920} height={1080} fill="#0C1220" />{sen(t, 960, 1, { mouth: "frown", eyes: "squint", brow: "worried" })}</>), html: q("AMA NEDENSE CANINI YAKIYOR.", 86, 0.45) },
  { c: "Defne'nin yanına gidiyorsun", g: 2, n: true, tone: "night", r: cam([1.2, 1.3], [960, 600], undefined, (t) => <><rect width={1920} height={1080} fill="#141A2A" /><rect x={1200} y={280} width={330} height={760} fill="#3A2A20" />{sen(t, 820, 1, { mouth: "open", talk: true, brow: "angry" })}{def(t, 1360, 1, { dir: -1, mouth: "flat", eyes: "squint" })}</>), html: q("“TABELALARA BAKMAM LAZIM. BU GECE.”", 80, 0.1) },
  { c: "Kural 4. Gece", g: 2, n: true, tone: "night", r: cam([2.4, 2.6], [1360, 520], undefined, (t) => <><rect width={1920} height={1080} fill="#141A2A" /><rect x={1200} y={280} width={330} height={760} fill="#3A2A20" />{def(t, 1360, 1, { dir: -1, mouth: "flat", talk: true })}</>), html: q("“KURAL DÖRT. GECE YOLCULUK YOK.”", 86, 0.05) },
  { c: "Bora tabelaları çeviriyor", g: 2, n: true, tone: "night", r: cam([2.4, 2.6], [820, 520], undefined, (t) => <><rect width={1920} height={1080} fill="#141A2A" />{sen(t, 820, 1, { pose: P.point, mouth: "open", talk: true, brow: "angry" })}</>), html: q("“BORA TABELALARI ÇEVİRİYOR.”", 90, 0.05) },
  { c: "Kanıtın var mı", g: 2, n: true, tone: "night", r: cam([1.4, 1.5], [1080, 600], undefined, (t) => <><rect width={1920} height={1080} fill="#141A2A" /><rect x={1200} y={280} width={330} height={760} fill="#3A2A20" />{sen(t, 820, 1, { mouth: "frown", brow: "worried", talk: true })}{def(t, 1360, 1, { dir: -1, mouth: "flat", brow: "up", talk: true })}</>), html: q("“KANITIN VAR MI?” · “NOTUM VARDI. KAYBOLDU.”", 70, 0.1) },
  { c: "Defne yorgun bir sesle", g: 2, n: true, tone: "night", r: cam([2.6, 2.8], [1360, 520], undefined, (t) => <><rect width={1920} height={1080} fill="#141A2A" /><rect x={1200} y={280} width={330} height={760} fill="#3A2A20" />{def(t, 1360, 1, { dir: -1, mouth: "flat", eyes: "squint", brow: "worried", talk: true })}</>), html: q("“GECE OLAN SEN HERKESTEN ŞÜPHELENİYOR…”", 76, 0.3) },
  { c: "Ben ikinizden de", g: 2, n: true, tone: "night", r: cam([3, 3.2], [1360, 470], undefined, (t) => <><rect width={1920} height={1080} fill="#141A2A" />{def(t, 1360, 1, { dir: -1, mouth: "frown", eyes: "closed", brow: "worried", talk: true })}</>), html: q("“BEN İKİNİZDEN DE YORULDUM.”", 90, 0.1) },
  { c: "Defterini açıyor", g: 2, n: true, tone: "night", r: cam([1, 1.05], [960, 540], undefined, (t, a, b) => <><rect width={1920} height={1080} fill="#2A1E16" /><Defter lines={["Kural 8:", "Gece verilen kararlar,", "sabah konuşulur."]} k={ramp(t, a + 0.3, b - 0.4)} /></>), html: tg("KURAL 8", T.red) },
  { c: "Ve kapıyı kapatıyor", g: 2, n: true, sfx: "knock", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[1365, 600]}><rect width={1920} height={1080} fill="#141A2A" /><rect x={1200} y={280} width={330} height={760} fill="#F6C445" opacity={0.4} /><rect x={1200} y={280} width={330 * ramp(t, a + 0.1, a + 0.5)} height={760} fill="#3A2A20" /></TCam> },
  { c: "Bayram dayıyı alıp", g: 2, n: true, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{sokak("night", { lamp: 1 })(t)}{walk(t, a, b + 3, SEN, 200, 700, 0.9, { mouth: "flat" })}{walk(t, a, b + 3, BAYRAM, 520, 1020, BS * 0.9, { mouth: "smile", pose: OMUZ_B, holdR: <Kurek /> })}</TCam> },
  { c: "Çünkü bayram dayı hiçbir", g: 2, n: true, tone: "gold", r: cam([2, 2.2], [900, 520], undefined, (t) => <>{sokak("night", { lamp: 1 })(t)}{bay(t, 900, BS, { mouth: "grin", eyes: "happy", pose: OMUZ_B, holdR: <Kurek />, talk: true })}</>), html: q("“HADİ GİDELİM!”", 110, 0.5) },
  { c: "Kavşağa varıyorsunuz", g: 2, n: true, tone: "night", r: cam([1, 1.1], [1100, 560], undefined, levha({ fresh: 1, lines: [["ERCİŞ", "↑"], ["GEVAŞ", "→"]], beam: 1 })) },
  { c: "Tabela doğru yönü", g: 2, n: true, tone: "night", r: cam([1.5, 1.6], [1100, 520], undefined, levha({ fresh: 1, lines: [["ERCİŞ", "↑"], ["GEVAŞ", "→"]], beam: 1 })), html: tg("DOĞRU YÖN ✓", T.green) },
  { c: "Biri senden önce", g: 2, n: true, sfx: "drone", tone: "night", r: cam([3.6, 3.9], [870, 428], undefined, levha({ fresh: 1, lines: [["ERCİŞ", "↑"], ["GEVAŞ", "→"]], beam: 1 })), html: tg("VİDALAR: YENİDEN SIKILMIŞ", T.purple) },
  { c: "Çevirmişler mi", g: 2, n: true, tone: "night", r: cam([1.4, 1.5], [1000, 600], undefined, (t) => <>{levha({ fresh: 1, lines: [["ERCİŞ", "↑"], ["GEVAŞ", "→"]], beam: 1 })(t)}{sen(t, 420, 0.9, { mouth: "flat", brow: "angry" })}{bay(t, 680, BS * 0.9, { mouth: "o", talk: true })}</>), html: q("“ÇEVİRMİŞLER Mİ?” · “GERİ ÇEVİRMİŞLER.”", 76, 0.1) },
  { c: "Bayram dayı tabelanın direğini", g: 2, n: true, sfx: "knock", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]} shake={5 * ramp(t, a + 0.5, b - 0.3)}><VanSokak t={t} mode="night" lamp={0} windows={0} steps={false} /><Kar t={t} k={0.7} /><YonLevha x={1100} y={1040} t={t} fresh={1} up={ramp(t, a + (b - a) * 0.4, b - 0.2)} />{bay(t, 980, BS, { pose: P.cheer, mouth: "grin", brow: "angry", sweat: true })}</TCam> },
  { c: "Artık çeviremezler", g: 2, n: true, sfx: "ding", tone: "gold", r: cam([1.4, 1.5], [1000, 480], undefined, (t) => <><VanSokak t={t} mode="night" lamp={0} windows={0} steps={false} /><Kar t={t} k={0.7} /><YonLevha x={1100} y={1040} t={t} fresh={1} up={1} />{bay(t, 980, BS, { pose: P.cheer, mouth: "grin", eyes: "happy", talk: true })}</>), html: big("“ÇÜNKÜ BEN ÖYLE DİYORUM.”", "#F6C445", 84, 860) },
  { c: "Bu bir çözüm değil", g: 2, n: true, tone: "gold", ...kartTxt("BU BİR ÇÖZÜM DEĞİL.", "AMA ÇOK TATMİN EDİCİ.", "#FFFFFF", "#F6C445") },
  { c: "Kardaki ayak izlerini", g: 2, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[900, 760]}><VanSokak t={t} mode="night" lamp={0} windows={0} steps={false} /><Kar t={t} k={0.7} />{[0, 1, 2, 3, 4, 5].map((i) => <ellipse key={i} cx={600 + i * 120} cy={1000 + (i % 2) * 24} rx={26} ry={12} fill="#6E7A92" />)}{t < a + (b - a) * 0.5 ? sen(t, 900, 1, { pose: P.reach, mouth: "flat", eyes: "squint" }) : yat(t, 760, 1030, 0.9)}</TCam>{t > a + (b - a) * 0.5 && <GeceModu t={t} a={a + (b - a) * 0.5} crash={1} />}</>, html: tg("03:14", T.red) },
  { c: "Bayram dayı seni bir çuval", g: 2, n: true, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><VanSokak t={t} mode="night" lamp={1} windows={0.2} steps={false} /><Kar t={t} k={0.8} />{tasi(t, a + 0.6, b + 2, 600, 1300)}</TCam>, html: (t, a, b) => <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><Sayac t={t} a={a} marks={["1", "2", "3"]} times={[a + (b - a) * 0.5, a + (b - a) * 0.65, a + (b - a) * 0.8]} /></svg> },
  { c: "İki sıfır", g: 2, n: true, sfx: "ding", tone: "gold", r: cam([2, 2.2], [1100, 560], undefined, (t, a, b) => <><VanSokak t={t} mode="night" lamp={1} windows={0.2} steps={false} /><Kar t={t} k={0.8} />{tasi(t, a - 2, b + 2, 900, 1400)}</>), html: big("“İKİ – SIFIR.”", "#F6C445", 110, 860) },
  { c: "bu yolculukta taşınışının", g: 2, n: true, tone: "gold", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.1} text="TAŞINMA: 4" y={240} size={120} color="#F6C445" /><Txt t={t} at={a + 1.4} text="DEFNE: 2 · BIYIKLI: 2" y={460} size={90} color="#FFFFFF" /></> },
  { c: "O gece Defne yine", g: 2, n: true, tone: "night", r: cam([1.6, 1.8], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#101626" />{def(t, 960, 1.1, { eyes: "open", mouth: "o", brow: "worried", look: 1 })}<Saat x={1500} y={380} s={0.9} h={3} m={14} c="#F4EAD6" /></>) },
  { c: "Uyurken yürüyor", g: 2, n: true, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 760]}><Mutfak t={t} night={1} candle={0} />{walk(t, a, b + 2, SU, 500, 1300, SS * 1.4, { eyes: "squint", mouth: "none", pose: { l: [60, 75], r: [60, 75] } })}</TCam>, html: tg("GÖZLERİ YARI AÇIK", T.purple) },
  { c: "Pencereye gidiyor ve buğulu", g: 2, n: true, sfx: "tick", tone: "night", r: buz("MAZOT", "write", 1, true) },
  { c: "Uyur gezerlik", g: 2, n: true, tone: "night", ...kartTxt("UYURGEZERLİK: EN ÇOK 10–13 YAŞ", "SABAH HİÇBİRİNİ HATIRLAMAZLAR.", "#8E7BFF", "#FFFFFF") },
  { c: "Defne okuyor", g: 2, n: true, tone: "night", r: buz("MAZOT", "read", 1) },
  { c: "Ama mazot bitmişti", g: 2, n: true, sfx: "boom", tone: "night", ...kartTxt("MAZOT BİTMİŞTİ…", "KIRK BİDON. DEĞİL Mİ?", "#FFFFFF", "#E0393E") },
  { c: "Defne cama uzun", g: 2, n: true, tone: "night", r: cam([2.4, 2.6], [960, 520], undefined, (t) => <><BuzluCam t={t} text="MAZOT" k={1} night={1} finger={false} />{def(t, 760, 1.4, { mouth: "flat", eyes: "squint", brow: "worried", look: 1 }, 1300)}</>) },

  // ── 3. GÜN ──
  { c: "Üçüncü gün. Sabah", g: 3, tone: "warm", r: cam([1, 1.1], [960, 560], undefined, sokak("day")), html: big("3. GÜN", "#FFFFFF", 110) },
  { c: "Bora gülümseyerek masaya", g: 3, tone: "warm", r: cam([2, 2.2], [1220, 560], undefined, kahv({ bor: { talk: true, mouth: "smile", eyes: "squint" } })), html: q("“KAR FIRTINASI GELİYOR. BUGÜN ÇIKAMAYIZ.”", 72, 0.1) },
  { c: "Bayram Dayı pencereden", g: 3, tone: "cool", r: cam([1, 1.1], [960, 540], undefined, (t) => <Gok t={t} mode="day" sun={1} />), html: tg("GÖKYÜZÜ: MASMAVİ ☀", T.blue) },
  { c: "Fırtına mı", g: 3, sfx: "ding", tone: "gold", r: cam([2.2, 2.4], [1520, 560], undefined, kahv({ bay: { mouth: "grin", eyes: "squint", talk: true } })), html: big("“FIRTINA BİR TEK SENSİN OĞLUM.”", "#F6C445", 80, 860) },
  { c: "Bora gülüyor. Herkes", g: 3, tone: "gold", r: cam([1, 1.06], [960, 600], undefined, kahv({ sen: { mouth: "grin", eyes: "happy" }, def: { mouth: "grin", eyes: "happy" }, bor: { mouth: "grin", eyes: "happy" }, bay: { mouth: "grin", eyes: "happy" }, su: { mouth: "smile" } })) },
  { c: "Yarın sabah, yani", g: 3, sfx: "drone", tone: "night", ...kartTxt("YARIN SABAH =", "3. GECEDEN SONRA.", "#FFFFFF", "#E0393E") },
  { c: "Gündüz olan sen, mantıklı", g: 3, tone: "warm", r: cam([2.4, 2.6], [660, 560], undefined, kahv({ sen: { mouth: "smile", talk: true, eyes: "happy" } })), html: q("“MANTIKLI.”", 110, 0.4) },
  { c: "Ve bütün gün, Defne'yi", g: 3, tone: "warm", r: cam([1.2, 1.3], [1000, 700], undefined, (t) => <>{sokak("day")(t)}<OdunYigin x={1300} y={1040} s={1} />{def(t, 820, 1, { pose: P.hold, mouth: "smile" })}{bor(t, 1120, 1, { pose: P.cheer, mouth: "grin", dir: -1 })}</>), html: tg("ODUN KIRARKEN", T.orange) },
  { c: "Çay demlerken", g: 3, tone: "warm", r: cam([1.6, 1.7], [960, 560], undefined, (t) => <>{evGun(t)}{def(t, 820, 1, { mouth: "smile", holdR: cay(0.5) })}{bor(t, 1100, 1, { mouth: "smile", dir: -1, holdR: cay(0.5) })}</>), html: tg("ÇAY DEMLERKEN", T.orange) },
  { c: "Kar topu oynarken", g: 3, tone: "warm", r: cam([1.2, 1.3], [960, 640], undefined, (t, a) => <>{sokak("day")(t)}{def(t, 700, 1, { pose: P.cheer, mouth: "grin", eyes: "happy" })}{bor(t, 1240, 1, { pose: P.point, mouth: "grin", dir: -1 })}<g transform={`translate(${lerp(1200, 760, ramp(t, a + 0.3, a + 1.2))},${700 - Math.sin(ramp(t, a + 0.3, a + 1.2) * Math.PI) * 160})`}><KarTopu /></g></>), html: tg("KAR TOPU OYNARKEN", T.orange) },
  { c: "Sen de oyuna katılmak", g: 3, sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[600, 600]}>{sokak("day")(t)}{sen(t, 600, 1, { mouth: t > b - 0.6 ? "o" : "grin", eyes: t > b - 0.6 ? "closed" : "happy" })}<g transform={`translate(${lerp(1400, 610, ramp(t, b - 1.2, b - 0.55))},${lerp(400, 640, ramp(t, b - 1.2, b - 0.55))})`}><KarTopu r={34} /></g></TCam> },
  { c: "Bayram Dayı'nın kar topu", g: 3, sfx: "boing", tone: "gold", r: cam([1.6, 1.7], [1200, 560], undefined, (t) => <>{sokak("day")(t)}{bay(t, 1200, BS, { pose: P.cheer, mouth: "grin", eyes: "happy", holdR: <KarTopu r={70} /> })}</>), html: q("KAR TOPU DEĞİL. KAR KAYASI.", 86, 0.4) },
  { c: "Yerde yatarken", g: 3, tone: "cool", r: cam([1, 1.08], [960, 540], undefined, (t) => <><Gok t={t} mode="day" sun={0.6} /><Kar t={t} k={0.6} /></>) },
  { c: "Su başına geliyor", g: 3, tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 640]}><rect width={1920} height={1080} fill="#E8EEF3" /><KarMelegi x={760} y={620} s={1.3} /><KarMelegi x={1200} y={680} s={0.75} k={ramp(t, a + (b - a) * 0.5, b - 0.3)} /><g transform="rotate(-90 760 760)">{sen(t, 760, 1, { mouth: "smile", eyes: "happy", pose: { l: [120 + Math.sin(t * 5) * 20, 150], r: [120 + Math.sin(t * 5) * 20, 150] } }, 760)}</g><g transform="rotate(-90 1200 790)">{su(t, 1200, SS, { mouth: "grin", eyes: "happy", pose: { l: [120 + Math.sin(t * 5 + 1) * 25, 150], r: [120 + Math.sin(t * 5 + 1) * 25, 150] } }, 790)}</g></TCam>, html: tg("İKİ KAR MELEĞİ", T.blue) },
  { c: "Ama Defne gülmeye", g: 3, tone: "cool", r: cam([2, 2.2], [1500, 760], undefined, (t) => <>{sokak("day")(t)}{def(t, 1450, 0.7, { mouth: "flat", look: -1 }, 960)}{bor(t, 1680, 0.7, { mouth: "smile", dir: -1 }, 960)}</>) },
  { c: "Akşam Defne kapıda", g: 3, tone: "warm", r: cam([1.4, 1.5], [960, 600], undefined, (t) => <>{sokak("dusk")(t)}<rect x={760} y={360} width={330} height={500} fill="#F6C445" opacity={0.4} />{defm(t, 925, 1, { mouth: "flat", eyes: "squint" }, 900)}</>), html: tg("BORA'YLA YÜRÜYÜŞE", T.red) },
  { c: "Ve kapıda Bora'nın elini", g: 3, sfx: "drone", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.65]} c0={[790, 860]} c1={[860, 860]}><ElKart t={t} a={a} b={b} /></TCam>, html: tg("ELİNİ TUTUYOR", T.red) },
  { c: "oturuyorsun. Elinde ince", g: 3, n: true, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.25]} c0={[470, 760]}>{kapak(t, a - 3, b + 27)}</TCam> },
  { c: "Ve izliyorsun", g: 3, n: true, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[900, 620]}>{kapak(t, a, b + 20)}</TCam>, html: q("BU BÖLÜMÜN EN BAŞINDAKİ O AN. ŞİMDİ.", 76, 0.4) },
  { c: "Karabaş onlarla gidiyor. Ve", g: 3, n: true, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[1300, 840]} c1={[1360, 840]}>{kapak(t, a - 14, b + 16, { look: (b - a) * 0.45 + 14 })}</TCam> },
  { c: "göremediğin bir şey var", g: 3, n: true, sfx: "boom", tone: "night", ...kartTxt("AMA SENİN GÖREMEDİĞİN", "BİR ŞEY VAR…", "#FFFFFF", "#E0393E") },

  // ── BODRUM (geri dönüş) ──
  { c: "O gün öğlen", g: 3, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}><rect width={1920} height={1080} fill="#2A2420" />{Array.from({ length: 8 }).map((_, i) => <rect key={i} x={1500 - i * 180} y={420 + i * 82} width={420} height={1080} fill="#3A322C" />)}{walk(t, a, b + 1, DEFNE, 1500, 500, 1)}</TCam>, html: big("O GÜN ÖĞLEN · HERKES YEMEKTEYKEN", "#FFFFFF", 70) },
  { c: "kapısı kilitliydi", g: 3, tone: "cool", r: cam([1, 1.06], [960, 520], undefined, (t) => <Kilit t={t} k={0} />), html: tg("KİLİTLİ", T.red) },
  { c: "Defne saçından bir toka", g: 3, tone: "cool", r: cam([2.8, 3], [960, 420], undefined, (t) => <><rect width={1920} height={1080} fill="#4A3426" />{def(t, 960, 1, { pose: P.wave, mouth: "flat", eyes: "squint", brow: "angry" })}</>), html: tg("SARI TOKA", T.yellow) },
  { c: "Kilidin içinde iki kere", g: 3, sfx: "tick", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[1100, 500]}><Kilit t={t} k={ramp(t, a + 0.3, b - 0.3)} /></TCam> },
  { c: "Kapı açıldı", g: 3, sfx: "knock", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]}><Bodrum t={t} beam={ramp(t, a + 0.3, b)} open={ramp(t, a, a + 0.9)} /></TCam> },
  { c: "İçeride kırk bidon", g: 3, sfx: "boom", tone: "night", r: cam([1.2, 1.4], [700, 760], undefined, (t) => <Bodrum t={t} />), html: big("40 BİDON MAZOT", "#E0393E", 110) },
  { c: "Jeneratörün mazotu bitmemişti", g: 3, tone: "night", ...kartTxt("MAZOT BİTMEMİŞTİ.", "BİRİ SAKLAMIŞTI.", "#FFFFFF", "#E0393E", "#0A0D14") },
  { c: "Ve bidonların yanında", g: 3, tone: "night", r: cam([1.6, 1.8], [1500, 780], undefined, (t) => <Bodrum t={t} />), html: tg("KAMYONET · DEPOSU DOLU", T.orange) },
  { c: "Kasasında on iki", g: 3, tone: "night", r: cam([2.8, 3], [1350, 700], undefined, (t) => <Bodrum t={t} />), html: tg("12 BİDON + YİYECEK", T.red) },
  { c: "Ön koltukta bir harita", g: 3, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]}><Plan t={t} k={0} names={0} /></TCam>, html: tg("BATIYA · KIRMIZI · TABELASIZ", T.red) },
  { c: "kenarında Bora'nın el yazısı", g: 3, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[700, 420]}><Plan t={t} k={ramp(t, a + 1.4, b - 0.2) * 0.25} names={0} /></TCam> },
  { c: "İkinci gece not", g: 3, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[700, 470]}><Plan t={t} k={0.25 + ramp(t, a, b - 0.3) * 0.5} names={0} /></TCam> },
  { c: "Üçüncü gece saat", g: 3, sfx: "boom", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.9, 2.1]} c0={[680, 560]}><Plan t={t} k={0.5 + ramp(t, a, b - 0.3) * 0.5} names={0} /></TCam>, html: q("“O UYUR. BİZ GİDERİZ.”", 100, 0.5, 960) },
  { c: "Ve altında dört isim", g: 3, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[700, 600]}><Plan t={t} k={1} names={ramp(t, a + 0.3, a + 1)} /></TCam>, html: tg("DEFNE · BAYRAM · SU · BORA", T.blue) },
  { c: "Senin adın", g: 3, sfx: "boom", tone: "night", ...kartTxt("SENİN ADIN", "YOKTU.", "#FFFFFF", "#E0393E", "#0A0D14") },
  { c: "Defne o an anladı", g: 3, tone: "night", r: cam([2.6, 2.8], [960, 500], undefined, (t) => <><Bodrum t={t} beam={0.7} />{def(t, 960, 1, { mouth: "o", eyes: "wide", brow: "worried" })}</>) },
  { c: "planının süresiydi", g: 3, tone: "night", ...kartTxt("ÜÇ GECE =", "BORA'NIN PLANININ SÜRESİ.", "#FFFFFF", "#F6C445", "#0A0D14") },
  { c: "Üçüncü gecenin sonunda", g: 3, tone: "night", r: cam([1, 1.08], [960, 600], undefined, (t) => <>{radyo({ beam: 0.4, bulb: 0.2 })(t)}{yat(t, 760, 1030, 0.9)}</>), html: tg("03:14 · SEN: ÖLÜ GİBİ UYKU", T.purple) },
  { c: "Mazot gidecekti", g: 3, tone: "night", r: cam([1.4, 1.5], [900, 700], undefined, (t) => <><rect width={1920} height={1080} fill="#1E2A3A" /><Radyo x={900} y={800} s={1.5} t={t} on={0} voice={0} /></>), html: q("MAZOT GİDECEKTİ. RADYO SUSACAKTI.", 80, 0.2) },
  { c: "Dünyada kalan son insan", g: 3, sfx: "drone", tone: "night", r: cam([1, 1.15], [960, 700], undefined, (t) => <>{sokak("night", { lamp: 1, windows: 0 })(t)}{sen(t, 960, 0.6, { mouth: "flat", brow: "worried" }, 920)}</>), html: big("TEK BAŞINA.", "#FFFFFF", 110, 860) },
  { c: "Ve bunu planlayan adam", g: 3, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.65]} c0={[790, 860]} c1={[860, 860]}><ElKart t={t} a={a} b={b} /></TCam> },
  { c: "Ama Defne bunları", g: 3, tone: "night", r: cam([2.6, 2.8], [960, 500], undefined, (t) => <><rect width={1920} height={1080} fill="#101626" />{defm(t, 960, 1, { mouth: "flat", eyes: "squint", brow: "worried" })}</>), html: q("AMA DEFNE BUNLARI SANA ANLATMADI.", 80, 0.3) },

  // ── 3. GECE ──
  { c: "Gece. Saat", g: 3, n: true, tone: "night", r: saat(3, 13), html: big("03:13", "#E0393E", 120, 900) },
  { c: "Radyo odasındasın", g: 3, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[900, 600]}>{radyo({ beam: 0.6, bulb: 0.4 })(t)}{sen(t, 900, 1, { mouth: "flat", eyes: "squint", brow: "worried", pose: P.think })}</TCam><GeceModu t={t} a={a} k={0.35} scan={false} /></>, html: tg("GECE OLAN SEN · KAFAN BULANIK", T.purple) },
  { c: "Çünkü cevap bu odada", g: 3, n: true, tone: "night", r: cam([2.4, 2.6], [900, 500], undefined, (t) => <>{radyo({ beam: 0.6, bulb: 0.4 })(t)}{sen(t, 900, 1, { mouth: "flat", eyes: "squint", brow: "worried", pose: P.think })}</>), html: q("CEVAP BU ODADA DEĞİL.", 90, 0.2) },
  { c: "Kapı açılıyor", g: 3, n: true, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{radyo({ beam: 0.6, bulb: 0.4 })(t)}{sen(t, 1100, 1, { mouth: "o", look: -1 })}{walk(t, a, b, DEFNE_M, 200, 820, 1, { mouth: "flat" })}</TCam> },
  { c: "Hiçbir şey söylemiyor", g: 3, n: true, tone: "night", r: cam([1.6, 1.7], [960, 600], undefined, (t) => <>{radyo({ beam: 0.6, bulb: 0.4 })(t)}{otur(defm, t, 820, 860, 1, { mouth: "flat", eyes: "squint" })}{otur(sen, t, 1100, 860, 1, { mouth: "o", dir: -1 })}</>) },
  { c: "Elini tutuyor. Avucunu", g: 3, n: true, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><Avuc t={t} k={0} /></TCam> },
  { c: "Ve parmağıyla avucunun", g: 3, n: true, sfx: "tick", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 620]}><Avuc t={t} k={ramp(t, a + 0.4, b - 0.2)} /></TCam>, html: tg("KISA · UZUN · KISA", T.hero) },
  { c: "Sizin diliniz", g: 3, n: true, tone: "night", r: cam([1.5, 1.6], [960, 620], undefined, (t) => <Avuc t={t} k={1} />), html: q("SİZİN DİLİNİZ.", 100, 0.2) },
  { c: "Okumaya çalışıyorsun", g: 3, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.4, 2.7]} c0={[1100, 560]}>{radyo({ beam: 0.6, bulb: 0.4 })(t)}{otur(sen, t, 1100, 860, 1, { mouth: "flat", eyes: "squint", brow: "worried", dir: -1, sweat: true })}</TCam><GeceModu t={t} a={a} k={0.4} scan={false} /></>, html: q("İLK HARF…", 100, 0.5) },
  { c: "saat 3'ü 14. Ve gözlerin", g: 3, n: true, sfx: "boom", tone: "night", r: saat(3, 14) },
  { c: "Ve gözlerin kapanıyor", g: 3, n: true, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.4, 2.5]} c0={[1100, 560]}>{radyo({ beam: 0.3, bulb: 0.2 })(t)}{otur(sen, t, 1100, 860, 1, { mouth: "flat", eyes: "closed", dir: -1 })}</TCam><rect width={1920} height={1080} fill="#000" opacity={ramp(t, a + 0.5, b)} /></> },
  { c: "Avucuna yazdığı şeyi", g: 3, n: true, tone: "night", r: cam([1.2, 1.3], [960, 620], undefined, (t) => <g opacity={0.6}><Avuc t={t} k={0.34} /></g>), html: q("HENÜZ.", 120, 0.55) },
  { c: "bir motor sesi", g: 3, n: true, tone: "night", r: cam([1, 1.08], [960, 700], undefined, (t) => <>{sokak("night", { lamp: 1 })(t)}<Kamyonet x={1100} y={1000} s={0.8} t={t} lights={1} snow={1} /></>) },
  { c: "Bayram Dayı merdivenlerden", g: 3, n: true, tone: "night", r: cam([2, 2.2], [960, 480], undefined, (t) => <><rect width={1920} height={1080} fill="#141C28" />{Array.from({ length: 8 }).map((_, i) => <rect key={i} x={200 + i * 180} y={1000 - i * 90} width={200} height={1080} fill="#2A3444" />)}{bay(t, 960, BS, { mouth: "o", eyes: "squint", talk: true })}</>), html: q("“KIZIM? NEREYE?”", 110, 0.5) },
  { c: "Defne cevap vermiyor", g: 3, n: true, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{sokak("night", { lamp: 1 })(t)}<Kamyonet x={1300} y={1000} s={0.8} t={t} lights={1} snow={1} />{walk(t, a, b, DEFNE_M, 300, 860, 1, { mouth: "flat" })}</TCam> },
  { c: "Kural dört. Gece", g: 3, n: true, sfx: "boom", tone: "night", r: cam([1, 1.05], [960, 540], undefined, (t, a) => <><rect width={1920} height={1080} fill="#2A1E16" /><Defter lines={["Kural 4:", "Gece yolculuk yok."]} k={1} /><path d="M520,330 L1400,620" stroke="#E0393E" strokeWidth={18} strokeLinecap="round" strokeDasharray={`${ramp(t, a + 0.8, a + 1.4) * 940} 1000`} /></>), html: q("O KURALI KOYAN, DEFNE'NİN KENDİSİYDİ.", 76, 0.45, 960) },
  { c: "Bora gaza basıyor", g: 3, n: true, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{sokak("night", { lamp: 1 })(t)}<Kamyonet x={lerp(1100, 1500, ramp(t, a + 0.3, b))} y={1000} s={0.8} t={t} lights={1} snow={1} speed={1} front={<TFig x={0} y={50} s={0.28} o={BORA} t={t} pose={P.sit} rim={0.3} />} back={<TFig x={0} y={50} s={0.28} o={DEFNE_M} t={t} pose={P.sit} rim={0.3} />} /></TCam> },
  { c: "Karabaş kapıda havlıyor", g: 3, n: true, tone: "night", r: cam([1.8, 2], [500, 860], undefined, (t) => <>{sokak("night", { lamp: 1 })(t)}<rect x={300} y={560} width={300} height={480} fill="#F6C445" opacity={0.3} /><Kopek x={460} y={G} s={0.7} t={t} kind="kara" bark={1} /></>), html: tg("DEFNE ONU YANINA ALMADI", T.red) },
  { c: "Ve Defne, Karabaş'ı", g: 3, n: true, tone: "night", ...kartTxt("VE DEFNE,", "KARABAŞ'I ASLA BIRAKMAZ.", "#FFFFFF", "#F6C445") },
  { c: "Kamyonet köşeyi dönmeden", g: 3, n: true, tone: "night", r: cam([2.4, 2.6], [1500, 780], undefined, (t) => <>{sokak("night", { lamp: 1 })(t)}<Kamyonet x={1500} y={1000} s={0.8} t={t} lights={1} snow={1} front={<TFig x={0} y={50} s={0.28} o={BORA} t={t} pose={P.sit} rim={0.3} />} back={<TFig x={0} y={50} s={0.28} o={DEFNE_M} t={t} pose={P.sit} rim={0.3} dir={-1} look={-1} />} /></>), html: q("BİR KERE. SADECE BİR KERE.", 80, 0.5) },
  { c: "Pencerede su duruyor", g: 3, n: true, sfx: "tick", tone: "night", r: buz("BORA", "write", 1, true) },
  { c: "Kamyonetin farları karın", g: 3, n: true, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}>{sokak("night", { lamp: 1 })(t)}<Kamyonet x={lerp(1500, 2400, ramp(t, a, b))} y={1000} s={0.8} t={t} lights={1 - ramp(t, a + 1, b)} snow={1} speed={1} /></TCam> },
  { c: "Ve sen sabah uyandığında", g: 3, n: true, tone: "night", r: kart("#000000"), html: q("VE SEN, SABAH UYANDIĞINDA…", 86, 0.1, 480) },
  { c: "Ama o dördüncü bölüm", hud: false, sfx: "boom", tone: "night", ...kartTxt("DEVAMI: 4. BÖLÜM", undefined, "#F6C445") },

  // ── KAPANIŞ ──
  { c: "Şimdi sana soruyorum", hud: false, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{kapak(t, a - 90, b - 60)}</TCam>, html: (t, a) => <><Txt t={t} at={a + 0.6} text="CEVABIN TUTTU MU?" y={130} size={70} /><Txt t={t} at={a + 2.2} text="DEFNE GERÇEKTEN GİTTİ Mİ?" y={260} size={64} color="#F6C445" /></> },
  { c: "Avucuna ne yazdı", hud: false, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]}><BuzluCam t={t} text="BORA" k={0.5} night={1} finger={false} /></TCam>, html: (t, a) => <><Txt t={t} at={a + 0.1} text="AVUCUNA NE YAZDI?" y={160} size={80} color="#2EE6D0" /><Txt t={t} at={a + 1.2} text="SU CAMA NE YAZIYORDU?" y={900} size={80} color="#F6C445" /></> },
  { c: "Tahminini yorumlara", hud: false, sfx: "ding", tone: "gold", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="TAHMİNİNİ YORUMLARA YAZ 👇" y={330} size={80} color="#FFFFFF" /><Txt t={t} at={a + 1.4} text="DOĞRU BİLENLERİ SONRAKİ BÖLÜMDE OKUYACAĞIM." y={500} size={60} color="#F6C445" /></> },
  { c: "Dördüncü bölüm yarın", hud: false, tone: "cool", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="4. BÖLÜM: ÖBÜR GÜN" y={300} size={110} color="#F6C445" /><svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}><g transform="translate(0,60)"><Seri t={t} a={a + 0.8} on={3} /></g></svg></> },
  { c: "Abone olup zili", hud: false, tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><Avuc t={t} k={0.34} /></TCam>, html: (t, a) => <><Txt t={t} at={a + 0.2} text="DEFNE AVUCUNA NE YAZDI?" y={160} size={80} color="#FFFFFF" /><Abone t={t} at={a + 1} /></> },
];

type Timed = Sh & { from: number; to: number; day: number };
export const TIMED: Timed[] = (() => {
  let after = 0, day = 0;
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    if (s.g !== undefined) day = s.g;
    return { ...s, from, to: 0, day };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K2R_18_SECONDS));
  return raw;
})();

// SFX: sadece yazılanlar, kısık. Her kesmede ses YOK.
const VOL: Record<string, number> = { drone: 0.07, boom: 0.08, ding: 0.07, knock: 0.07, pop: 0.06, boing: 0.06, tick: 0.05, static: 0.05 };
export const K2RVideo18: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K2R_18_SECONDS;
  const showHud = s.hud !== false && s.day > 0;
  const gece = s.n ? s.day : s.day - 1;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: ramp(t, 0, 0.5) * (1 - ramp(t, END - 1.2, END)) }}>
        <TFrame>
          <LiveCam t={t} a={s.from} punch={0.04}>{s.r(t, s.from, s.to)}</LiveCam>
          <Atmos t={t} tone={s.tone ?? "warm"} rays={s.tone === "night" ? 0.3 : 0.6} seed={n} />
          {s.tone === "gold" && <Sweep t={t} a={s.from} />}
          {showHud && <UcGeceHUD t={t} gece={gece} gun={s.day} />}
        </TFrame>
        {s.html?.(t, s.from, s.to)}
      </AbsoluteFill>
      <Audio src={staticFile("audio/k2r-18.wav")} />
      {TIMED.map((x, i) => x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from + 0.05) * fps))} durationInFrames={Math.round(2.2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.05} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};
