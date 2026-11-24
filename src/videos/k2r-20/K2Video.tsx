import React from "react";
import { AbsoluteFill, Sequence, staticFile, useCurrentFrame, useVideoConfig } from "remotion";
import { Audio } from "@remotion/media";
import words from "../../../public/data/k2r-20-words.json";
import { makeCue, ramp as rampRaw } from "../../lib/cues";
import { Eyes, Brow, Mouth, HERO, Outfit, P, T, TCam, TFig, TFrame, TPose, lerp, toonWalk } from "../../components/Toon";
import { Txt, Tag, Abone, Kural } from "../../components/K2Kit";
import { Atmos, LiveCam, Sweep, Tone } from "../../components/Live";
import { InceBardak } from "../../components/K2Dikey3";
import { Kagit, Kopek, Radyo, Soba, morsOn } from "../../components/SonIki";
import { ArabaIci, Bileklik, Defter, GeceModu, RadyoOdasi, Saat, YolSahne } from "../../components/YolVan";
import { BuzluCam, Kamyonet, Kar, Mutfak, VanGolu, VanSokak } from "../../components/VanUc";
import { Buhar, DikizAyna, RadyoMors } from "../../components/Kefal";
import { AyakIzi, CamYazi, Demlik, FarGece, Foto, GarajDis, GarajIc, Gozyasi, KapiKasa, KapiSedye, KarYuk, KirisYakin, Kispet, Minder, Ortu, Sandik, SuYatar, TasMezar, TasYakin, Tel112 } from "../../components/Final";

// Kanal 2 · k2r-20 · "Dünyada Son İki Kişi Kaldık… Ve Bayram Dayı Kapıyı Tuttu" — 5. BÖLÜM · FİNAL. TAMAMEN MOTOR.
// Kurallar: her kesmede whoosh YOK, beyaz flaş YOK, kan YOK. SFX sadece anlamlı vuruşlarda, kısık.
// Süreklilik: sucuk avuçtan ağza (önce avuçta, sonra ağızda, avuç boş); kispet: sandık → sandalye → bel → sedye;
// Su: sarı mont, garajda battaniyede, Defne'nin kucağında, evde Bayram'ın yanında; yatan figürler zemine/minderin üstüne oturur.

const ALT: Record<string, string[]> = {
  "Bir, bir, iki": ["1, 1, 2", "1 1 2", "Bir bir iki", "112"],
  "Telefonu alıyorsun": ["Telefonu alıyorsun"],
  "Dünyada sekiz milyar": ["Dünyada 8 milyar"],
  "Kırk yıl güreştim": ["40 yıl güreştim"],
  "Kırk yıl. Sırtı": ["40 yıl. Sırtı", "40 yıl sırtı"],
  "Saat üçü on dört": ["Saat 3'ü 14", "Saat 3.14", "Saat üçü 14", "Saat 3:14"],
  "Saat üçü on iki": ["Saat 3'ü 12", "Saat 3.12", "Saat üçü 12", "Saat 3:12"],
  "Saat üçü on üç": ["Saat 3'ü 13", "Saat 3.13", "Saat üçü 13", "Saat 3:13"],
  "Saat üçü on.": ["Saat 3'ü 10", "Saat 3.10", "Saat üçü 10", "Saat 3:10", "Saat üçü on"],
  "Eksi yirmi derece": ["-20 derece", "Eksi 20 derece", "eksi 20 derece"],
  "Yetmiş iki yaşında": ["72 yaşında"],
  "On yaşında bir kız": ["10 yaşında bir kız"],
  "Kural altı": ["Kural 6"],
  "Kural iki": ["Kural 2"],
  "Kural dokuz": ["Kural 9"],
  "Yüz on yedi gün": ["117 gün"],
  "Yüz on yedi gündür tek": ["117 gündür tek"],
  "Saat dört buçuk": ["Saat 4 buçuk", "Saat 4.30", "Saat 4:30"],
  "Saat on bire doğru": ["Saat 11'e doğru", "Saat 11 e doğru", "Saat 11"],
  "Bir metre sıkışmış": ["1 metre sıkışmış"],
  "Duvar boyunca": ["Duvar boyunca"],
  "Eve vardığınızda saat bir": ["Eve vardığınızda saat 1"],
  "Bir. İki. Üç.": ["1. 2. 3.", "Bir, iki, üç", "1, 2, 3", "Bir iki üç"],
  "Bir sıfır, dayı": ["1-0, dayı", "1 sıfır dayı", "Bir sıfır dayı", "1-0 dayı"],
  "Bir. Su": ["1. Su", "Bir. Su", "Bir, Su"],
  "İki. Defne": ["2. Defne", "İki. Defne", "İki, Defne"],
  "Üç. Asya": ["3. Asya", "Üç. Asya", "Üç, Asya"],
  "Dört. Karabaş": ["4. Karabaş", "Dört. Karabaş", "Dört, Karabaş"],
  "Beş.": ["5.", "Beş"],
  "Gel, oğlum. Altı": ["Gel oğlum. 6", "Gel oğlum altı", "Gel, oğlum. 6"],
  "Uzun, kısa, uzun": ["Uzun kısa uzun"],
  "Kısa, kısa, kısa. Kısa, kısa, uzun": ["Kısa kısa kısa. Kısa kısa uzun", "Kısa, kısa, kısa, kısa, kısa, uzun"],
  "Kısa, kısa, kısa. Uzun": ["Kısa kısa kısa. Uzun", "Kısa, kısa, kısa, uzun"],
  "Defne'ninki de": ["Defne'nin de", "Defneninki de"],
  "Peşrev. Yağlı güreşte": ["Peşref. Yağlı güreşte"],
  "Karabaş sucuğa bakıyor": ["Karabaş sucağa bakıyor"],
  "Kispet. Yağlı güreşte": ["Kispet, yağlı yüreşte", "Kispet yağlı"],
  "Gündüz olan sen, parmaklarınla": ["Gündüz olan sen parmaklarını"],
  "Hepiniz bir şeyi fark": ["Hepiniz bir şey fark"],
  "Gece olan sen çatıya": ["Gece olan san çatıya"],
  "Defne Su'ya koşuyor": ["Tefne suya koşuyor"],
  "Kırk bidon mazot": ["Kırk bidon vazot", "40 bidon mazot"],
  "Kural iki. Aptalca": ["Kural 2. Aptalca"],
  "Su hâlâ uyuyor": ["Su hâlâ okuyor"],
  "Bayram Dayı elini tutuyor": ["Bayram dayı eline tutuyor"],
  "Abone ol. Bir sonraki": ["Abone ol. Biz sonraki"],
};

const ramp = (t: number, a: number, b: number) => (b - a > 0.01 ? rampRaw(t, a, b) : t >= b ? 1 : 0);
const cueRaw = makeCue(words as { text: string; start: number; end: number }[]);
const VAR: [RegExp, string][] = [[/â/g, "a"], [/î/g, "i"], [/û/g, "u"]];
const variants = (p: string) => { const out = [p]; for (const [re, to] of VAR) for (const v of [...out]) { const n = v.replace(re, to); if (n !== v) out.push(n); } return out; };
const cue = (p: string, after = 0) => cueRaw([...variants(p), ...(ALT[p] ?? [])], after);
const VOICE_END = (words as { end: number }[])[words.length - 1].end;
export const K2R_20_SECONDS = Math.ceil(VOICE_END + 4);

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
const cay = (s = 0.5, tea = 1) => <InceBardak x={0} y={0} s={s} tea={tea} saucer={false} />;
const q = (text: string, size = 80, k = 0.3, y = 820): R => (t, a, b) => <Txt t={t} at={a + (b - a) * k} text={text} y={y} size={size} />;
const tg = (text: string, c: string = T.hero, at = 0.5, y?: number): R => (t, a) => <Tag t={t} at={a + at} text={text} c={c} y={y} />;
const big = (text: string, color = "#F6D08A", size = 90, y = 80): R => (t, a) => <Txt t={t} at={a + 0.3} text={text} y={y} size={size} color={color} />;
const kart = (bg: string): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill={bg} /><Kar t={t} k={0.25} n={60} /></TCam>;
const kartTxt = (l1: string, l2?: string, c1 = "#2EE6D0", c2 = "#F6C445", bg = "#0E1A2E"): Pick<Sh, "r" | "html" | "hud"> => ({ hud: false, r: kart(bg), html: (t, a) => <><Txt t={t} at={a + 0.2} text={l1} y={l2 ? 330 : 440} size={92} color={c1} />{l2 && <Txt t={t} at={a + 1.0} text={l2} y={520} size={74} color={c2} />}</> });
const cam = (z: [number, number], c0: [number, number], c1: [number, number] | undefined, node: (t: number, a: number, b: number) => React.ReactNode, shake = 0): R => (t, a, b) => <TCam t={t} a={a} b={b} z={z} c0={c0} c1={c1} shake={shake}>{node(t, a, b)}</TCam>;
const svg = (n: React.ReactNode) => <svg viewBox="0 0 1920 1080" style={{ position: "absolute", inset: 0 }}>{n}</svg>;

const SARIL: TPose = { l: [70, 120], r: [70, 120] };

// ── sahneler ──
const sokak = (mode: "day" | "dusk" | "night" = "day", o: { lamp?: number; windows?: number; fall?: number } = {}) => (t: number) => <><VanSokak t={t} mode={mode} lamp={o.lamp ?? (mode === "night" ? 1 : 0)} windows={o.windows ?? (mode === "night" ? 0.35 : 0)} snow={1} /><Kar t={t} k={o.fall ?? (mode === "night" ? 0.9 : 0.5)} /></>;
const radyoOn = (o: { bulb?: number } = {}) => (t: number) => <RadyoOdasi t={t} beam={0.2} bulb={o.bulb ?? 1} names={1} jacket={0} steam={1} bardak={cay(0.5)} />;
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
const mors = (text: string, hand: "defne" | "bora", mode: "in" | "read" | "full" = "in", bg: (t: number) => React.ReactNode = radyoOn()): R => (t, a, b) => <><TCam t={t} a={a} b={b} z={[1, 1.06]}>{bg(t)}</TCam>{svg(<RadyoMors t={t} text={text} hand={hand} k={mode === "in" ? ramp(t, a + 0.2, b - 0.2) : 1} read={mode === "read" ? ramp(t, a + 0.3, b - 0.3) : mode === "full" ? 1 : 0} />)}</>;
const KagitYaz: React.FC<{ lines: string[] }> = ({ lines }) => <><rect width={1920} height={1080} fill="#4A3A2E" /><g transform="translate(960,560) scale(2.4)"><Kagit x={0} y={0} lines={lines} /></g></>;
const Seri: React.FC<{ t: number; a: number; on: number }> = ({ t, a, on }) => <g>{[0, 1, 2, 3, 4].map((i) => <g key={i} transform={`translate(${560 + i * 200},640)`} opacity={ramp(t, a + 0.2 + i * 0.12, a + 0.5 + i * 0.12)}><rect x={-80} y={-80} width={160} height={160} rx={24} fill={i < on ? "#1FC8B4" : i === on ? "#F6C445" : "#2A3650"} /><text y={26} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={80} fill="#0E1A2E">{i === 4 ? "F" : i + 1}</text></g>)}</g>;
const Sayac: React.FC<{ t: number; a: number; marks: string[]; times?: number[] }> = ({ t, a, marks, times }) => { const sp = Math.max(260, Math.max(...marks.map((m) => m.length)) * 120 + 80); return <g>{marks.map((m, i) => <text key={i} x={960 + (i - (marks.length - 1) / 2) * sp} y={600} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={180} fill="#F6C445" stroke="#0E1A2E" strokeWidth={10} paintOrder="stroke" opacity={ramp(t, (times?.[i] ?? a + 0.4 + i * 0.6), (times?.[i] ?? a + 0.4 + i * 0.6) + 0.2)}>{m}</text>)}</g>; };
const sayac3 = (): R => (t, a, b) => svg(<Sayac t={t} a={a} marks={["1", "2", "3"]} times={[a + (b - a) * 0.25, a + (b - a) * 0.45, a + (b - a) * 0.65]} />);
// şehir penceresi: yüz binlerce ev, baca tütmüyor
const sehir = (mode: "day" | "dusk" = "day") => (t: number) => <><VanGolu t={t} mode={mode} /><g transform="translate(0,280) scale(1,0.6)"><VanSokak t={t} mode={mode} lamp={0} windows={0} steps={false} snow={1} /></g></>;
// Şahin dışarıdan
const SahinDis: React.FC<{ t: number; x?: number; move?: boolean; lights?: number; mode?: "night" | "day" }> = ({ t, x = 960, move = true, lights = 1 }) => <Kamyonet x={x} y={1000} s={0.75} t={t} c="#B8BFC6" lights={lights} speed={move ? 1 : 0} snow={1}
  front={<TFig x={0} y={50} s={0.28} o={SEN} t={t} pose={P.sit} rim={0.3} />} back={<TFig x={0} y={50} s={0.28} o={BAYRAM} t={t} pose={P.sit} rim={0.3} />} />;
const gece = (kind: "gol" | "tipi" | "bozkir" = "gol", storm = false) => (t: number) => <><YolSahne t={t} kind={kind} mode="night" px={t * 420} snow={1} fall={storm ? 1 : 0.5} stars={storm ? 0 : 1} road /><SahinDis t={t} x={900} />{storm && <Kar t={t} k={1} wind={2.5} n={220} />}</>;

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


// ════════════ k2r-20 · FİNAL sahneleri ════════════
const BAYK: Outfit = { ...BAYRAM, belt: "#1E1A18" };
const BeltFig: React.FC<React.ComponentProps<typeof TFig>> = (pr) => { const s = pr.s ?? 1; const sit = pr.pose === P.sit; return <g><TFig {...pr} />{!sit && <g opacity={pr.op ?? 1}><rect x={pr.x - 92 * s} y={pr.y - 206 * s} width={184 * s} height={34 * s} rx={8 * s} fill="#1E1A18" /><rect x={pr.x - 14 * s} y={pr.y - 204 * s} width={28 * s} height={30 * s} rx={4 * s} fill="#8A6A4A" /></g>}</g>; };
const bayk = (t: number, x: number, s = BS, f: Face = {}, y = G) => <BeltFig x={x} y={y} s={s} o={BAYK} t={t} rim={0.3} seed={x} {...f} />;
const KR: TPose = { ...KNEEL, l: [60, 75], r: [80, 90], lean: 8 };
const KH: TPose = { ...KNEEL, l: [40, 95], r: [40, 95] };
const BeltOr: React.FC<React.ComponentProps<typeof TFig>> = (pr) => pr.o === BAYK ? <BeltFig {...pr} /> : <TFig {...pr} />;
// peşrev elleri (diz çökmüş): yer → diz → dudak → alın
const PS: Record<string, TPose> = {
  yer: { ...KNEEL, r: [20, 10], lean: 18 },
  diz: { ...KNEEL, r: [45, 60], lean: 10 },
  dudak: { ...KNEEL, r: [30, 150], lean: 2 },
  alin: { ...KNEEL, r: [40, 168], lean: 0 },
};
const SAC: TPose = { l: [60, 140], r: [55, 150] };
const TUT: TPose = { l: [-150, -172], r: [150, 172] }; // iki el yukarıda: kasa/kiriş
const UZAT: TPose = { l: [8, 6], r: [80, 70] };
const sucuk = (s = 1) => <g transform={`scale(${s})`}><ellipse rx={20} ry={14} fill="#8E2F2A" /><ellipse rx={13} ry={8} fill="#B8473E" />{[-6, 4, 8].map((x, i) => <circle key={i} cx={x} cy={(i - 1) * 3} r={2.5} fill="#F2E3C6" />)}</g>;
const kispetEl = (s = 0.35) => <g transform={`scale(${s})`}><Kispet x={0} y={0} /></g>;
// yatan figür: ayaklar (fx,fy) → baş sola. Gövde çizgisi fy; zemin/minder üstü = fy + 55·s
const yatF = (o: Outfit, t: number, fx: number, fy: number, s: number, f: Face = {}) => <g transform={`rotate(-90 ${fx} ${fy})`}><BeltOr x={fx} y={fy} s={s} o={o} t={t} rim={0.3} eyes="closed" mouth="flat" {...f} /></g>;
// eğik oturan (minderde yaslanmış)
const yasli = (o: Outfit, t: number, x: number, seatY: number, s: number, f: Face = {}, tilt = 0) => <g transform={`rotate(${tilt} ${x} ${seatY})`}><BeltOr x={x} y={seatY + 178 * s} s={s} o={o} t={t} rim={0.3} pose={P.sit} {...f} /></g>;
const suKucak = (t: number, x: number, y: number, s = 1) => <g transform={`translate(${x},${y}) scale(${s})`}><SuYatar x={0} y={0} s={0.5} t={t} /></g>;
const defSu = (t: number, x: number, f: Face = {}, o: Outfit = DEFNE_M) => <>{fig(o)(t, x, 1, { pose: SARIL, mouth: "flat", brow: "worried", ...f })}{suKucak(t, x + 6, G - 228)}</>;
const gece_ = (t: number) => <><rect width={1920} height={1080} fill="#070C18" />{Array.from({ length: 60 }, (_, i) => <circle key={i} cx={(i * 337) % 1920} cy={(i * 191) % 520} r={1 + (i % 3)} fill="#FFFFFF" opacity={0.4 + 0.4 * Math.sin(t * 2 + i)} />)}</>;
const kar_ = (t: number, y = 860) => <><path d={`M0,${y} Q960,${y - 40} 1920,${y} L1920,1080 L0,1080Z`} fill="#C9D4E2" /><Kar t={t} k={0.4} n={60} /></>;

// ── 3:14 araba (arka koltuk): sen uyuyorsun (başın camda), Defne uyanık (göz aynada), Su Karabaş'ın sırtında uyuyor ──
const Arka: React.FC<{ t: number; dEyes?: Eyes; dTalk?: boolean; far?: number; dLook?: number }> = ({ t, dEyes = "open", dTalk = false, far = 0, dLook = 0 }) => <g>
  <rect width={1920} height={1080} fill="#151C2C" />
  <rect x={260} y={140} width={1400} height={400} rx={60} fill="#070C18" /><Kar t={t} k={0.4} n={40} />
  <rect x={260} y={140} width={1400} height={400} rx={60} fill="#FFF3C0" opacity={far * 0.25} />
  <rect x={160} y={580} width={1600} height={500} rx={70} fill="#2E3A52" /><rect x={160} y={580} width={1600} height={40} rx={20} fill="#3A4864" />
  <g transform="rotate(10 560 720)">{otur(sen, t, 560, 720, 1.1, { eyes: "closed", mouth: "flat", bob: 0 })}</g>
  {otur(defm, t, 960, 720, 1.1, { eyes: dEyes, mouth: "flat", brow: "worried", lookY: -0.7, look: dLook, talk: dTalk, dir: -1 })}
  <Kopek x={1400} y={960} s={0.8} t={t} kind="kara" sleep={1} dir={-1} />
  <g transform="translate(1290,870) rotate(-8)"><SuYatar x={0} y={0} s={0.7} t={t} flip /></g>
</g>;
// ön koltuk: Bayram şoför (sağ), Asya uyuyor (sol)
const onKoltuk = (bF: Face = {}, o: { move?: boolean; z?: [number, number]; c?: [number, number]; far?: number } = {}): R => (t, a, b) => <TCam t={t} a={a} b={b} z={o.z ?? [1, 1.06]} c0={o.c ?? [960, 560]}>
  <ArabaIci t={t} mode="night" kind="gol" move={o.move ?? true} snow={1} glow={o.far ?? 0}
    left={<TFig x={700} y={1060} s={1.15} o={ASYA} t={t} pose={P.sit} rim={0.3} eyes="closed" mouth="flat" />}
    right={<TFig x={1220} y={1060} s={1.15} o={BAYRAM} t={t} pose={P.hold} rim={0.3} dir={-1} {...bF} />} /></TCam>;
const ayna = (pat: string, unit = 0.3, bora = 0): R => (t, a) => <g><DikizAyna t={t} k={0.35 + 0.65 * morsOn(t, a + 0.4, pat, unit)} bora={bora} /></g>;
// far sahnesi + Bayram
const far = (node: (t: number, a: number, b: number) => React.ReactNode, o: { dist?: (t: number, a: number, b: number) => number; blink?: (t: number, a: number) => number; shadow?: number; sx?: number } = {}): R => (t, a, b) =>
  <FarGece t={t} dist={o.dist?.(t, a, b) ?? 0} blink={o.blink?.(t, a) ?? 1} shadow={o.shadow ?? 1} shadowX={o.sx ?? 1080}>{node(t, a, b)}</FarGece>;
const pes = (pose: TPose, f: Face = {}) => (t: number) => bay(t, 1080, BS, { pose, mouth: "flat", eyes: "squint", bob: 0, ...f }, G + 92 * BS);

// ── Bayram'ın evi: sobalı oda ──
const SobaOda: React.FC<{ t: number; night?: number; fire?: number; children?: React.ReactNode; steam?: number }> = ({ t, night = 1, fire = 1, children, steam = 1 }) => <g>
  <rect width={1920} height={1080} fill={night ? "#3A2A20" : "#8A6648"} />
  {Array.from({ length: 24 }, (_, i) => <rect key={i} x={i * 80} y={0} width={78} height={860} fill={night ? (i % 2 ? "#40301F" : "#3A2A1C") : (i % 2 ? "#96704E" : "#8C6646")} />)}
  <g transform="translate(1000,150)"><rect width={380} height={330} fill={night ? "#0E1A34" : "#CFE3EE"} stroke="#5A3A22" strokeWidth={20} /><path d="M190,0 V330 M0,165 H380" stroke="#5A3A22" strokeWidth={10} />{Array.from({ length: 20 }, (_, i) => <circle key={i} cx={10 + ((i * 97 + t * 20) % 360)} cy={10 + ((i * 53 + t * 50) % 310)} r={3} fill="#FFFFFF" opacity={0.7} />)}</g>
  <rect y={860} width={1920} height={220} fill={night ? "#2A1E16" : "#6A4A30"} /><rect x={100} y={900} width={1100} height={170} rx={20} fill="url(#tCarpet)" opacity={0.8} />
  <Soba x={1560} y={900} t={t} fire={fire} />
  <Demlik x={1600} y={648} s={0.55} t={t} boil={steam} />
  <Minder x={620} y={1000} />
  {night > 0 && <ellipse cx={1500} cy={800} rx={900} ry={500} fill="#FF9A4A" opacity={0.08 * fire + 0.02 * Math.sin(t * 7)} />}
  {children}
</g>;
// Bayram minderde yaslanmış (battaniye bacakta), sen yanında, Karabaş dizinde, Su uyuyor
type OdaO = { bF?: Face; sF?: Face; sen?: "sit" | "lean" | "none" | "stand"; dog?: "knee" | "sucuk" | "none" | "watch"; suO?: "sleep" | "none" | "awake"; def?: "kneel" | "stand" | "none" | "write"; defF?: Face; asya?: "kneel" | "stand" | "none"; asyF?: Face; night?: number; breath?: boolean; hand?: boolean };
const oda = (o: OdaO = {}) => (t: number) => {
  const br = o.breath === false ? 0 : undefined;
  return <SobaOda t={t} night={o.night ?? 1}>
    {(o.suO ?? "sleep") !== "none" && <SuYatar x={280} y={950} s={0.8} t={t} flip eyes={o.suO === "awake" ? 1 : 0} />}
    {yasli(BAYK, t, 500, 905, BS, { eyes: "open", mouth: "smile", bob: br, ...(o.bF ?? {}) })}
    <Ortu x={560} y={1000} s={1} w={300} />
    {o.hand && <ellipse cx={380} cy={890} rx={26} ry={16} fill="#E8B892" />}
    {(o.dog ?? "knee") === "knee" && <Kopek x={760} y={1050} s={0.6} t={t} kind="kara" sleep={0.6} dir={-1} />}
    {o.dog === "watch" && <Kopek x={780} y={1050} s={0.6} t={t} kind="kara" sit={1} dir={-1} />}
    {o.dog === "sucuk" && <Kopek x={780} y={1050} s={0.6} t={t} kind="kara" sit={1} dir={-1} bite={sucuk(1.2)} />}
    {(o.sen ?? "sit") === "sit" && otur(sen, t, 880, 960, 1, { dir: -1, mouth: "flat", brow: "worried", ...(o.sF ?? {}) })}
    {o.sen === "lean" && <g transform="rotate(-24 880 960)">{otur(sen, t, 880, 960, 1, { dir: -1, eyes: "closed", mouth: "flat", bob: 0, ...(o.sF ?? {}) })}</g>}
    {o.sen === "stand" && sen(t, 900, 1, { dir: -1, mouth: "flat", brow: "worried", ...(o.sF ?? {}) })}
    {o.def === "kneel" && diz(def, t, 1180, 1, { dir: -1, mouth: "flat", brow: "worried", ...(o.defF ?? {}) })}
    {o.def === "stand" && def(t, 1200, 1, { dir: -1, mouth: "flat", brow: "worried", ...(o.defF ?? {}) })}
    {o.def === "write" && otur(def, t, 1240, 960, 1, { dir: -1, pose: P.hold, mouth: "flat", brow: "worried", holdR: <rect x={-50} y={-30} width={100} height={70} fill="#F4EDE2" />, ...(o.defF ?? {}) })}
    {o.asya === "kneel" && diz(asy, t, 1020, 1, { dir: -1, mouth: "flat", brow: "worried", eyes: "closed", ...(o.asyF ?? {}) })}
    {o.asya === "stand" && asy(t, 1380, 1, { dir: -1, mouth: "flat", brow: "worried", ...(o.asyF ?? {}) })}
  </SobaOda>;
};
// sabah: sen minderde uyanıyorsun (Bayram yok), Defne yanında diz çökmüş
const uyanis = (eyes: Eyes = "open", def0 = true) => (t: number) => <SobaOda t={t} night={0}>
  {yatF(SEN, t, 920, 880, 1, { eyes, mouth: "flat", brow: "worried" })}
  <Ortu x={640} y={940} s={1} w={300} />
  {def0 && diz(def, t, 1120, 1, { dir: -1, mouth: "flat", talk: true, brow: "worried" })}
  <Kopek x={300} y={1050} s={0.6} t={t} kind="kara" sleep={1} />
</SobaOda>;

// ── mutfak (gündüz) sahneleri ──
const mut = (n: (t: number) => React.ReactNode, night = 0) => (t: number) => <><Mutfak t={t} night={night} candle={0} />{n(t)}</>;
const sandalye = (x: number, y = G, k = false) => <g><rect x={x - 90} y={y - 160} width={180} height={18} fill="#6A4A30" /><rect x={x - 80} y={y - 142} width={14} height={142} fill="#6A4A30" /><rect x={x + 66} y={y - 142} width={14} height={142} fill="#6A4A30" /><rect x={x + 70} y={y - 330} width={16} height={190} fill="#6A4A30" />{k && <g transform={`translate(${x},${y - 182}) scale(0.32,0.12)`}><Kispet x={0} y={0} /></g>}</g>;
const sacOr = (t: number, o: { bF?: Face; suF?: Face } = {}) => <>{sandalye(1460)}{otur(su, t, 1460, G - 160, SS, { mouth: "none", eyes: "open", ...(o.suF ?? {}) })}{bay(t, 1600, BS, { pose: SAC, dir: -1, mouth: "smile", eyes: "squint", lookY: 0.6, ...(o.bF ?? {}) })}</>;
const tezgah = (t: number, o: { bF?: Face; sF?: Face; dem?: number } = {}) => <>{bay(t, 520, BS, { dir: 1, mouth: "smile", talk: true, ...(o.bF ?? {}) })}<Demlik x={330} y={622} s={0.6} t={t} boil={o.dem ?? 1} />{sen(t, 860, 1, { dir: -1, mouth: "flat", ...(o.sF ?? {}) })}</>;
const masa = (t: number, o: { bF?: Face; dog?: "look" | "no" | "none"; su?: Face | false; sen?: Face | false } = {}) => <>
  {o.sen !== false && otur(sen, t, 760, 760, 1, { mouth: "smile", ...(o.sen ?? {}) })}
  {o.su !== false && otur(su, t, 1000, 790, SS, { mouth: "none", ...(o.su ?? {}) })}
  {otur(bay, t, 1240, 760, BS, { dir: -1, mouth: "smile", ...(o.bF ?? {}) })}
  {(o.dog ?? "look") !== "none" && <Kopek x={1500} y={1040} s={0.7} t={t} kind="kara" sit={1} dir={-1} wag={o.dog === "no" ? 0 : 1} />}
</>;
const koridor = (t: number, fig0?: React.ReactNode) => <g>
  <rect width={1920} height={1080} fill="#B89A72" /><rect y={900} width={1920} height={180} fill="#8A6A4A" />
  {[0, 1, 2].map((i) => <rect key={i} x={200 + i * 600} y={150} width={4} height={750} fill="#9A7C58" />)}
  <g transform="translate(860,900) rotate(-6)"><rect x={0} y={-680} width={400} height={680} rx={6} fill="#8A5A36" /><rect x={30} y={-640} width={340} height={260} fill="#9A6A42" /><rect x={30} y={-340} width={340} height={280} fill="#9A6A42" /><circle cx={360} cy={-340} r={14} fill="#D9B44A" /><rect x={-4} y={-600} width={20} height={40} fill="#5A5A5A" /><rect x={-4} y={-140} width={20} height={40} fill="#5A5A5A" /></g>
  <g transform="translate(1340,320) rotate(3)"><rect x={-110} y={-70} width={220} height={140} fill="#FFFBEA" /><text y={-12} textAnchor="middle" fontFamily="Patrick Hand" fontSize={38} fill="#E0393E">KURAL 6:</text><text y={34} textAnchor="middle" fontFamily="Patrick Hand" fontSize={30} fill="#E0393E">ÖNCE KOLU DENE</text></g>
  {fig0}
</g>;

// ── bahçe (gündüz) ──
const bahce = (n: (t: number, a: number, b: number) => React.ReactNode, mode: "day" | "dusk" = "day"): R => (t, a, b) => <>{sokak(mode, { fall: 0.3 })(t)}{n(t, a, b)}</>;
const sahin = (t: number, x: number, lights = 0, inside?: React.ReactNode) => <Kamyonet x={x} y={1000} s={0.8} t={t} c="#B8BFC6" lights={lights} snow={1} front={inside} />;
const ArabaKapi: React.FC<{ t: number; asyF?: Face; sen?: boolean; senF?: Face; far?: number }> = ({ t, asyF = {}, sen: s0 = true, senF = {}, far: f = 0 }) => <g>
  <rect width={1920} height={1080} fill="#DCE6F0" /><Kar t={t} k={0.3} n={40} />
  <rect x={200} y={160} width={1100} height={920} rx={60} fill="#2A3448" />
  <rect x={260} y={220} width={980} height={360} rx={40} fill="#C9DCE8" opacity={0.8} />
  <rect x={300} y={640} width={900} height={440} rx={40} fill="#3A4864" />
  <g transform="translate(440,760)"><rect x={-80} y={-30} width={160} height={60} rx={12} fill="#1A2030" /><circle cx={-40} cy={0} r={14} fill={f > 0 ? "#FFF3C0" : "#5A6A7A"} /><circle cx={30} cy={0} r={14} fill="#5A6A7A" /></g>
  {otur(asy, t, 760, 700, 1.15, { mouth: "flat", eyes: "wide", brow: "worried", pose: UZAT, dir: -1, ...asyF })}
  {s0 && sen(t, 1520, 1.15, { dir: -1, mouth: "open", brow: "angry", pose: P.reach, ...senF })}
</g>;

// ── garaj içi kadro ──
type GO = { bend?: number; dust?: number; fall?: number; lamp?: number; sway?: number; su?: boolean; bora?: Face | false; bay?: Face | false; sen?: Face | false; def?: Face | false; defSu?: boolean; asya?: Face | false; dog?: boolean; defX?: number; stove?: number };
const garaj = (o: GO = {}) => (t: number) => <GarajIc t={t} bend={o.bend ?? 0} dust={o.dust ?? 0} fall={o.fall ?? 0} lamp={o.lamp ?? 1} sway={o.sway ?? 0} su={o.su ?? !o.defSu} stove={o.stove ?? 1}>
  {o.bora !== false && <><rect x={800} y={G - 120} width={110} height={16} fill="#5A3A22" /><rect x={810} y={G - 104} width={12} height={104} fill="#5A3A22" /><rect x={888} y={G - 104} width={12} height={104} fill="#5A3A22" />{otur(bor, t, 855, G - 120, 1, { dir: -1, mouth: "smile", eyes: "squint", pose: P.hand, holdR: cay(0.35), ...(o.bora ?? {}) })}</>}
  {o.bay !== false && bayk(t, 1580, BS, { dir: -1, mouth: "flat", brow: "angry", ...(o.bay ?? {}) })}
  {o.sen !== false && sen(t, 1320, 1, { dir: -1, mouth: "flat", brow: "worried", ...(o.sen ?? {}) })}
  {o.def !== false && (o.defSu ? defSu(t, o.defX ?? 1180, o.def ?? {}) : defm(t, o.defX ?? 1180, 1, { dir: -1, mouth: "flat", brow: "worried", ...(o.def ?? {}) }))}
  {o.asya !== false && asy(t, 1760, 1, { dir: -1, mouth: "flat", brow: "worried", ...(o.asya ?? {}) })}
  {o.dog !== false && <Kopek x={1460} y={G} s={0.6} t={t} kind="kara" sit={1} dir={-1} />}
</GarajIc>;
// kapı kasasında Bayram
const kasa = (gap: (t: number, a: number, b: number) => number, n: (t: number, a: number, b: number) => React.ReactNode, f: Face = {}): R => (t, a, b) => {
  const g = gap(t, a, b);
  const ks = (1000 - (lerp(300, 180, g) - 30)) / 548;
  return <KapiKasa t={t} gap={g} dust={0.6}>{bayk(t, 960, ks, { pose: TUT, mouth: "grin", brow: "angry", eyes: "squint", sweat: true, bob: 0, ...f }, 1000)}{n(t, a, b)}</KapiKasa>;
};
// Bayram karda sırtüstü (gece)
const bayKar = (f: Face = {}, o: { sen?: boolean; def?: boolean; dust?: number } = {}) => (t: number) => <>
  {gece_(t)}
  <path d="M0,600 Q600,560 1100,600 Q1500,630 1920,590 L1920,1080 L0,1080Z" fill="#C9D4E2" />
  {o.dust && <g opacity={o.dust}>{Array.from({ length: 14 }, (_, i) => <circle key={i} cx={1300 + (i * 61) % 600} cy={560 - (i * 37) % 200} r={60 + (i % 4) * 30} fill="#DCE4EC" opacity={0.4} />)}</g>}
  {yatF(BAYK, t, 1240, 830, BS, { eyes: "open", mouth: "smile", lookY: -1, look: -0.4, ...f })}
  <Buhar x={760} y={760} s={0.8} t={t} k={0.8} />
  {o.sen && diz(sen, t, 560, 1, { mouth: "open", brow: "worried", eyes: "wide", dir: 1 }, 900)}
  {o.def && defm(t, 1520, 1, { dir: -1, mouth: "smile", eyes: "closed", brow: "worried" }, 900)}
  <Kar t={t} k={0.3} n={40} />
</>;

// ── cenaze: kapı sedye taşıma (sola, göle) ──
const sedye = (t: number, a: number, b: number, o: { x0?: number; x1?: number; count?: boolean } = {}) => {
  const x0 = o.x0 ?? 1500, x1 = o.x1 ?? 1100;
  const w = toonWalk(t, a + 0.2, b - 0.2, x0, x1, 1);
  const x = w.x;
  return <>
    <VanGolu t={t} mode="day" />
    <TFig x={x - 390} y={G} s={1} o={SEN} t={t} dir={-1} walk={w.walk} pose={P.hold} rim={0.3} mouth="flat" brow="worried" eyes="squint" />
    <KapiSedye x={x} y={G - 160} s={1.1} body={yatF(BAYK, t, 300, -50, 0.85, { bob: 0 })} />
    <TFig x={x + 300} y={G} s={1} o={DEFNE_M} t={t} dir={-1} walk={w.walk} pose={P.hold} rim={0.3} mouth="flat" brow="worried" />
    <TFig x={x + 430} y={G} s={1} o={ASYA} t={t} dir={-1} walk={w.walk} pose={P.hold} rim={0.3} mouth="flat" brow="worried" />
    <Kopek x={x - 600} y={G} s={0.6} t={t} kind="kara" dir={-1} />
    <Kar t={t} k={0.3} n={40} />
  </>;
};
const mezar = (k: number, carve: number, n: (t: number) => React.ReactNode = () => null, mode: "day" | "dusk" = "day") => (t: number) => <><VanGolu t={t} mode={mode} /><TasMezar t={t} k={k} carve={carve} lines={["BAYRAM DAYI", "03.14"]} mode={mode} />{n(t)}<Kar t={t} k={0.25} n={30} /></>;
const ucCay = (n3: number, cool3 = 0): R => (t, a, b) => <TCam t={t} a={a} b={b} z={[1.15, 1.25]} c0={[960, 640]}>
  <rect width={1920} height={1080} fill="#7A5A44" /><rect y={760} width={1920} height={320} fill="#9A7458" />
  <InceBardak x={600} y={860} s={2} tea={1} saucer={false} /><Buhar x={600} y={580} s={1.2} t={t} />
  <InceBardak x={960} y={860} s={2} tea={1} saucer={false} /><Buhar x={960} y={580} s={1.2} t={t} />
  {n3 > 0 && <g opacity={n3 >= 1 ? 1 : ramp(t, a + 0.4, a + 1.2)}><InceBardak x={1320} y={860} s={2} tea={1} saucer={false} /><Buhar x={1320} y={580} s={1.2} t={t} k={1 - cool3 * ramp(t, a + 0.3, b - 0.3)} /></g>}
</TCam>;
const yorum = (name: string, text: string): Pick<Sh, "r" | "html" | "hud"> => ({ hud: false, r: kart("#101828"), html: (t, a) => <><Txt t={t} at={a + 0.1} text={`@${name}`} y={300} size={70} color="#2EE6D0" /><Txt t={t} at={a + 0.6} text={`“${text}”`} y={470} size={62} color="#FFFFFF" /></> });
const notlar = (bg: (t: number) => React.ReactNode, notes: { x: number; y: number; text: string }[], saat0 = "16:40"): R => (t, a, b) => <><TCam t={t} a={a} b={b} z={[1, 1.06]}>{bg(t)}</TCam>{svg(<GeceModu t={t} a={a} k={ramp(t, a, a + 0.6)} notes={notes} saat={saat0} />)}</>;
const tearOn = (x: number, y: number, s = 1) => (t: number) => <Gozyasi x={x} y={y} s={s} t={t} />;

const Kural_: React.FC<{ t: number; a: number }> = ({ t, a }) => <Kural t={t} a={a} n="KURAL 2" line="Aptalca risk yok. Burada hastane yok. Doktor yok." />;

const SHOTS: Sh[] = [
  // ── SOĞUK AÇILIŞ ──
  { c: "Bir telefon ekranı", hud: false, sfx: "drone", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><Tel112 t={t} k={ramp(t, a + 1, b - 0.3)} /></TCam> },
  { c: "Ekranda iki kelime", hud: false, sfx: "boom", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 480]}><Tel112 t={t} k={1} fail={ramp(t, a + 0.6, a + 1)} /></TCam>, html: q("“ŞEBEKE YOK.”", 110, 0.4, 900) },
  { c: "Yine arıyorsun", hud: false, tone: "night", r: (t, a, b) => { const n = (b - a) / 3; const ph = Math.floor((t - a) / n); const lt = (t - a) - ph * n; return <TCam t={t} a={a} b={b} z={[1.1, 1.2]}><Tel112 t={t} k={1} fail={lt > n * 0.6 ? 1 : 0} /></TCam>; }, html: q("YİNE. YİNE. YİNE.", 96, 0.2, 140) },
  { c: "Dünyada sekiz milyar", hud: false, tone: "night", ...kartTxt("8.000.000.000 TELEFON.", "BU GECE HİÇBİRİ AÇMIYOR.", "#FFFFFF", "#E0393E", "#070A12") },
  { c: "Karın üstünde, sırt", hud: false, sfx: "drone", tone: "night", r: cam([1, 1.08], [960, 700], undefined, bayKar({ mouth: "grin" })) },
  { c: "Kırk yıl güreştim, evlat", hud: false, tone: "night", r: cam([2.2, 2.4], [820, 800], undefined, bayKar({ mouth: "smile", talk: true })), html: q("“KIRK YIL GÜREŞTİM, EVLAT. SIRTIM BİR KERE BİLE YERE GELMEDİ.”", 60, 0.1, 160) },
  { c: "Ve gökyüzüne bakıyor", hud: false, tone: "night", r: cam([2.6, 2.9], [800, 790], undefined, bayKar({ mouth: "smile", talk: true, eyes: "squint" })), html: q("“BU GECE GELDİ.”", 110, 0.4, 160) },
  { c: "Bu, Dünyada Son İki", hud: false, sfx: "boom", tone: "cool", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="DÜNYADA SON İKİ KİŞİ" y={240} size={86} color="#FFFFFF" />{svg(<Seri t={t} a={a + 0.4} on={4} />)}<Txt t={t} at={a + 2.2} text="FİNAL. BAŞLIYORUZ." y={820} size={72} color="#F6C445" /></> },

  // ── 03:14 · ARABADA ──
  { c: "Saat üçü on dört. Uyuyorsun", g: "03:14", tone: "night", r: cam([1, 1.06], [960, 600], undefined, (t) => <Arka t={t} />), html: q("UYUYORSUN. ÖLÜ GİBİ.", 84, 0.4) },
  { c: "Yani bundan sonraki", g: "03:14", tone: "night", r: cam([2.2, 2.4], [560, 520], undefined, (t) => <Arka t={t} />), html: q("BUNDAN SONRAKİ 10 DAKİKAYI SEN GÖRMEYECEKSİN.", 66, 0.1, 900) },
  { c: "Sana sabah Defne", g: "03:14", tone: "night", r: cam([2.2, 2.4], [960, 500], undefined, (t) => <Arka t={t} dLook={0.4} />), html: tg("DEFNE: UYANIK", T.purple) },
  { c: "Direksiyonda Bayram Dayı", g: "03:14", tone: "night", r: onKoltuk({ mouth: "flat", eyes: "squint" }) },
  { c: "Defne'nin başı camda", g: "03:14", tone: "night", r: cam([2.6, 2.8], [960, 480], undefined, (t) => <Arka t={t} dLook={0} />), html: tg("GÖZÜ DİKİZ AYNASINDA", T.purple) },
  { c: "Aynada iki far", g: "03:14", sfx: "drone", tone: "night", r: (t) => <DikizAyna t={t} k={0.45} />, html: q("İKİ FAR.", 100, 0.3) },
  { c: "Kamyonet arkanızdan", g: "03:15", tone: "night", r: (t, a, b) => <DikizAyna t={t} k={0.45 + ramp(t, a, b) * 0.3} />, html: q("YAVAŞ. ACELE ETMEDEN. SANKİ YOL ONUN.", 72, 0.3) },
  { c: "Sonra farlar yanıp", g: "03:15", sfx: "tick", tone: "night", r: ayna("... ..-", 0.32), html: q("KISA, KISA, KISA. · KISA, KISA, UZUN.", 72, 0.2, 900) },
  { c: "Defne fısıldıyor", g: "03:15", tone: "night", r: cam([2.8, 3], [960, 470], undefined, (t) => <Arka t={t} dTalk far={0.4 + 0.6 * morsOn(t, 0, "... ..- ", 0.32)} />), html: (t, a) => <Txt t={t} at={a + 0.6} text="“S… U.”" y={150} size={130} color="#2EE6D0" /> },
  { c: "Su. Arka koltukta", g: "03:15", tone: "warm", r: cam([2.4, 2.6], [1340, 860], undefined, (t) => <Arka t={t} />), html: tg("SU · 10 YAŞINDA · 3 BEDEN BÜYÜK SARI MONT", T.yellow) },
  { c: "Bayram Dayı aynaya bakıyor", g: "03:15", tone: "night", r: onKoltuk({ mouth: "flat", eyes: "squint", look: 1, lookY: -0.6, brow: "angry" }, { z: [2.2, 2.4], c: [1220, 620] }), html: q("BIYIĞI BİR KERE SEĞİRİYOR.", 80, 0.4) },
  { c: "Yolun tam ortasında", g: "03:15", sfx: "knock", tone: "night", r: cam([1, 1.06], [700, 700], undefined, far(() => null, { shadow: 0 })), html: q("YOLUN TAM ORTASINDA. MOTORU BİLE KAPATMADAN.", 66, 0.2) },
  { c: "Dayı, ne yapıyorsun", g: "03:15", tone: "night", r: onKoltuk({ mouth: "flat", eyes: "squint" }, { move: false }), html: q("“DAYI, NE YAPIYORSUN?”", 96, 0.1) },
  { c: "Cevap yok. Bayram Dayı cevap", g: "03:16", tone: "night", r: far((t, a, b) => walk(t, a + 0.4, b, BAYRAM, 560, 1080, BS, { mouth: "flat", brow: "angry" }), { sx: 900 }), html: tg("BAYRAM DAYI CEVAP VERMEZ", T.orange) },
  { c: "Eksi yirmi derece", g: "03:16", tone: "night", r: cam([1.2, 1.3], [900, 760], undefined, far(() => bay(0, 1080, BS, { mouth: "flat", brow: "angry", eyes: "squint" }))), html: (t, a) => <><Txt t={t} at={a + 0.1} text="−20 °C" y={120} size={110} color="#9FD3EC" /><Txt t={t} at={a + 1.6} text="GÖLGESİ KARDA 10 METRE UZUYOR" y={900} size={62} /></> },
  { c: "Ve Bayram Dayı, farların", g: "03:16", tone: "night", r: cam([1.6, 1.7], [1080, 700], undefined, far((t) => bay(t, 1080, BS, { mouth: "flat", eyes: "squint" }))), html: tg("DEFNE BUNU İLK KEZ GÖRÜYOR", T.purple) },
  { c: "İleri üç adım", g: "03:16", tone: "gold", r: far((t, a, b) => { const m = (a + b) / 2; return t < m ? walk(t, a + 0.2, m, BAYRAM, 1080, 1260, BS, { mouth: "flat", eyes: "squint" }) : <TFig x={wx(t, m, b - 0.8, 1260, 1080, BS)} y={G} s={BS} o={BAYRAM} t={t} dir={1} walk={toonWalk(t, m, b - 0.8, 1260, 1080, BS).walk} rim={0.3} mouth="flat" eyes="squint" />; }), html: (t, a, b) => <><Txt t={t} at={a + 0.2} text="İLERİ ÜÇ ADIM." y={120} size={84} color="#F6C445" /><Txt t={t} at={a + (b - a) * 0.4} text="GERİ ÜÇ ADIM." y={240} size={84} color="#F6C445" /></> },
  { c: "Sonra sol dizinin", g: "03:16", tone: "gold", r: (t, a, b) => { const k = (t - a) / Math.max(1, b - a); const p = k < 0.3 ? PS.yer : k < 0.5 ? PS.diz : k < 0.7 ? PS.dudak : PS.alin; return <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[1080, 760]}>{far(pes(p))(t, a, b)}</TCam>; }, html: (t, a, b) => <Txt t={t} at={a + (b - a) * 0.3} text="YERE. DİZİNE. DUDAĞINA. ALNINA." y={140} size={72} color="#FFFFFF" /> },
  { c: "Peşrev. Yağlı güreşte", g: "03:17", tone: "gold", ...kartTxt("PEŞREV:", "GÜREŞTEN ÖNCEKİ SELAM. “HAZIRIM.”", "#F6C445", "#FFFFFF", "#3A2414") },
  { c: "Yetmiş iki yaşında", g: "03:17", tone: "night", r: cam([1, 1.05], [960, 640], undefined, far(pes(PS.alin))), html: q("72 YAŞINDA. GECE ÜÇTE. KARIN İÇİNDE.", 72, 0.3) },
  { c: "Kamyonet bir süre", g: "03:17", sfx: "drone", tone: "night", r: cam([1.8, 2], [1640, 800], undefined, far(pes(PS.alin), { blink: (t) => 0.75 + 0.25 * Math.sin(t * 13) })), html: q("MOTOR HOMURDANIYOR. FARLAR TİTRİYOR.", 72, 0.3) },
  { c: "Gece, Bora sıradan biri", g: "03:17", tone: "night", ...kartTxt("GECE, BORA SIRADAN BİRİ.", "BUNU SEN BİLİYORSUN. BORA DA.", "#E0393E", "#FFFFFF", "#0A0D14") },
  { c: "Ve kamyonet geri geri", g: "03:17", tone: "night", r: far(pes(PS.alin), { dist: (t, a, b) => ramp(t, a + 0.3, b) }), html: q("FARLAR KÜÇÜLÜYOR. KAYBOLUYOR.", 80, 0.4) },
  { c: "Bayram Dayı arabaya dönüyor", g: "03:18", tone: "night", r: far((t, a, b) => walk(t, a + 0.2, b, BAYRAM, 1080, 560, BS, { mouth: "flat" }), { dist: () => 1, shadow: 0 }) },
  { c: "Ona ne dedin", g: "03:18", tone: "night", r: cam([2.6, 2.8], [960, 470], undefined, (t) => <Arka t={t} dTalk />), html: q("“ONA NE DEDİN?”", 100, 0.1) },
  { c: "Hiçbir şey. Güreşte", g: "03:18", sfx: "ding", tone: "gold", r: onKoltuk({ mouth: "smile", talk: true, eyes: "squint" }, { z: [2, 2.2], c: [1220, 620] }), html: q("“GÜREŞTE ÖNCE SELAM VERİLİR, KIZIM.”", 84, 0.1) },
  { c: "Bora fırtına demek", g: "03:18", tone: "warm", r: onKoltuk({ mouth: "flat", talk: true, eyes: "squint" }, { z: [2.2, 2.4], c: [1220, 600] }), html: q("“BORA FIRTINA DEMEK. BEN FIRTINAYI SEVMEM.”", 76, 0.1) },
  { c: "Sonra bir şey daha diyor", g: "03:18", tone: "night", r: onKoltuk({ mouth: "flat", talk: true, eyes: "closed" }, { z: [2.6, 2.8], c: [1220, 600] }), html: q("“SABAH BUNU OĞLANA ANLATMA.”", 92, 0.4) },
  { c: "Defne söz veriyor", g: "03:18", tone: "night", r: cam([2.4, 2.6], [760, 540], undefined, (t) => <Arka t={t} dLook={-0.6} />), html: q("DEFNE SÖZ VERİYOR. VE SÖZÜNÜ TUTMUYOR.", 74, 0.3) },

  // ── SABAH ──
  { c: "Sabah. Gözlerini açıyorsun. Bayram", g: "08:10", tone: "cool", r: cam([1, 1.06], [800, 700], undefined, uyanis("open", false)), html: big("SABAH", "#FFFFFF", 100) },
  { c: "Defne yanında oturuyor", g: "08:10", tone: "warm", r: cam([1.4, 1.5], [900, 760], undefined, uyanis("open")), html: q("FARLARI. MORS'U. PEŞREVİ.", 84, 0.4) },
  { c: "Sen dinlerken", g: "08:11", tone: "warm", r: cam([2.6, 2.8], [1000, 860], undefined, uyanis("open")), html: tg("ELİ HÂLÂ ELİNİN İÇİNDE", T.pink) },
  { c: "Mutfağa iniyorsun", g: "08:14", tone: "warm", r: cam([1, 1.06], [1300, 620], undefined, mut((t) => sacOr(t))) },
  { c: "Kalın parmaklarıyla", g: "08:14", tone: "warm", r: cam([2.4, 2.6], [1500, 620], undefined, mut((t) => sacOr(t))), html: q("YAVAŞ YAVAŞ. İKİ ÖRGÜ. HER SABAH YAPTIĞI GİBİ.", 66, 0.2) },
  { c: "Dayı, gece", g: "08:15", tone: "warm", r: cam([1.2, 1.3], [1100, 620], undefined, mut((t) => <>{sacOr(t)}{sen(t, 800, 1, { mouth: "open", talk: true, brow: "worried" })}</>)), html: q("“DAYI, GECE…”", 96, 0.1) },
  { c: "Gece mece yok", g: "08:15", sfx: "ding", tone: "gold", r: cam([2.4, 2.6], [1600, 520], undefined, mut((t) => sacOr(t, { bF: { talk: true, mouth: "grin", eyes: "squint", lookY: 0 } }))), html: q("“GECE MECE YOK. BUGÜN SANA ÇAY DEMLEMEYİ ÖĞRETECEĞİM.”", 62, 0.1) },
  { c: "Gündüz olan sen buna", g: "08:15", tone: "cool", r: cam([2.4, 2.6], [800, 500], undefined, mut((t) => sen(t, 800, 1, { mouth: "flat", brow: "worried", look: 1 }))), html: q("ŞAKA YAPMAK İSTİYORSUN. VAZGEÇİYORSUN.", 72, 0.4) },
  { c: "Su kaynayınca bekletmeyeceksin", g: "08:16", tone: "warm", r: cam([1.2, 1.3], [620, 640], undefined, mut((t) => tezgah(t))), html: q("“SU KAYNAYINCA BEKLETMEYECEKSİN. DEMLİĞE.”", 72, 0.1) },
  { c: "On beş dakika", g: "08:16", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 560]}><rect width={1920} height={1080} fill="#6A4A34" /><Demlik x={960} y={820} s={1.6} t={t} /><circle cx={1500} cy={400} r={130} fill="#9A2A1E" stroke="#F4EAD6" strokeWidth={8} /></TCam>, html: (t, a) => <><Txt t={t} at={a + 0.1} text="15 DAKİKA" y={120} size={100} color="#F6C445" /><Txt t={t} at={a + 1.2} text="RENGİ: TAVŞAN KANI" y={900} size={80} color="#F28C6A" /></> },
  { c: "İnce belli iki bardak", g: "08:17", tone: "warm", r: ikiCay(0), html: q("“ÇAY İKİ KİŞİLİK İÇİLİR.”", 96, 0.3) },
  { c: "Tek başına içilen", g: "08:17", sfx: "ding", tone: "gold", r: cam([2.4, 2.6], [520, 480], undefined, mut((t) => tezgah(t, { bF: { mouth: "flat", talk: true, eyes: "squint" } }))), html: q("“TEK BAŞINA İÇİLEN ÇAY, ÇAY DEĞİLDİR. İLAÇTIR.”", 70, 0.1) },
  { c: "Bu sabah, Bayram Dayı'nın", g: "08:20", tone: "gold", r: cam([1, 1.08], [1000, 640], undefined, mut((t) => masa(t, { bF: { mouth: "grin", eyes: "happy" } }))), ...{ html: q("HAYATININ EN GÜZEL SABAHI. KİMSE BİLMİYOR.", 70, 0.3) } },
  { c: "Kahvaltıda Karabaş yine", g: "08:22", tone: "warm", r: cam([1.8, 2], [1400, 760], undefined, mut((t) => masa(t, { bF: { mouth: "flat", brow: "angry", look: 1 } }))), html: tg("4 GÜNLÜK SUCUK SAVAŞI", T.red) },
  { c: "Ve sonra, dört gündür", g: "08:22", tone: "warm", r: cam([2, 2.2], [1320, 640], undefined, mut((t) => masa(t, { bF: { mouth: "smile", pose: UZAT, holdR: sucuk(1.4) } }))), html: q("KENDİ TABAĞINDAN. BİR DİLİM SUCUK. KARABAŞ'A.", 66, 0.4) },
  { c: "Karabaş sucuğa bakıyor", g: "08:23", tone: "cool", r: cam([2.6, 2.8], [1440, 880], undefined, mut((t) => masa(t, { dog: "no", bF: { mouth: "smile", pose: UZAT, holdR: sucuk(1.4) } }))), html: q("ALMIYOR. TUZAK SANIYOR.", 90, 0.5) },
  { c: "Su, ağzını elleriyle", g: "08:23", tone: "gold", r: cam([2.6, 2.8], [1000, 640], undefined, mut((t) => masa(t, { su: { pose: P.think, eyes: "happy", mouth: "none", bob: Math.sin(t * 18) * 3 }, bF: { pose: UZAT, holdR: sucuk(1.4) } }))), html: tg("BU EVDE GÜLEN TEK KİŞİ", T.yellow) },
  { c: "Bu köpek bana güvenmiyor", g: "08:23", sfx: "pop", tone: "gold", r: cam([2.2, 2.4], [1240, 560], undefined, mut((t) => masa(t, { dog: "no", bF: { mouth: "grin", talk: true, eyes: "squint" } }))), html: q("“AKILLI KÖPEK.”", 100, 0.5) },
  { c: "Sonra sana bir Temel", g: "08:24", tone: "warm", r: cam([1.4, 1.5], [1000, 600], undefined, mut((t) => masa(t, { bF: { mouth: "grin", talk: true } }))), html: tg("TEMEL FIKRASI · 10. DENEME", T.orange) },
  { c: "Temel bir gün Dursun'a", g: "08:24", tone: "warm", r: cam([2.2, 2.4], [1240, 540], undefined, mut((t) => masa(t, { bF: { mouth: "grin", talk: true, eyes: "squint" } }))), html: q("“DURSUN, DÜNYADA SON İKİ KİŞİ BİZ KALSAK NE YAPARSIN?”", 62, 0.1) },
  { c: "Duruyor. Bıyığını", g: "08:25", sfx: "pop", tone: "warm", r: cam([2.6, 2.8], [1240, 520], undefined, mut((t) => masa(t, { bF: { mouth: "o", pose: P.think, brow: "up" } }))), html: q("“NE DEMİŞTİ YA?”", 110, 0.4) },
  { c: "Kimse bilmiyor", g: "08:25", tone: "warm", r: cam([1.2, 1.3], [1000, 620], undefined, mut((t) => masa(t, { bF: { mouth: "flat", pose: P.think }, sen: { mouth: "grin", eyes: "happy" } }))), html: q("SONUNU BİLEN TEK KİŞİ O. VE O DA UNUTUYOR.", 66, 0.3) },
  { c: "Kahvaltıdan sonra Bayram", g: "08:40", tone: "warm", r: cam([1.2, 1.3], [960, 760], undefined, (t, a, b) => <><SobaOda t={t} night={0} />{diz(bay, t, 760, BS, { pose: KR, mouth: "flat" })}<Sandik x={1060} y={1040} open={ramp(t, a + (b - a) * 0.5, b - 0.2)} /></>) },
  { c: "Kispet. Yağlı güreşte", g: "08:41", tone: "gold", r: cam([1.2, 1.3], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#3A2414" /><Kispet x={960} y={560} s={1.8} /></>), html: (t, a) => <><Txt t={t} at={a + 0.1} text="KİSPET" y={110} size={110} color="#F6C445" /><Txt t={t} at={a + 1.4} text="40 YILLIK · DİZLERİ PARLAMIŞ · ZEYTİNYAĞI KOKUYOR" y={960} size={52} /></> },
  { c: "Bayram Dayı onu uzun uzun", g: "08:42", tone: "warm", r: cam([2, 2.2], [880, 600], undefined, (t) => <><SobaOda t={t} night={0} />{diz(bay, t, 760, BS, { pose: KH, mouth: "smile", eyes: "squint", lookY: 0.6, holdR: kispetEl(0.4) })}{sen(t, 1200, 1, { dir: -1, mouth: "flat" })}</>), html: tg("O ÜÇ ADIM", T.orange) },
  { c: "Yağlı güreşte, rakibini", g: "08:42", tone: "gold", r: kart("#3A2414"), html: (t, a, b) => <><Txt t={t} at={a + 0.2} text="RAKİBİ YERDEN KES + 3 ADIM TAŞI" y={300} size={70} color="#FFFFFF" /><Txt t={t} at={a + 1.6} text="= GÜREŞİ KAZANDIN" y={420} size={86} color="#3BE07A" />{svg(<Sayac t={t} a={a} marks={["1-0", "2-0", "3-0", "4-0"]} times={[a + (b - a) * 0.45, a + (b - a) * 0.55, a + (b - a) * 0.65, a + (b - a) * 0.75]} />)}</> },
  { c: "Ve bir pehlivan için", g: "08:43", sfx: "boom", tone: "night", ...kartTxt("EN BÜYÜK YENİLGİ:", "SIRTININ YERE GELMESİ.", "#FFFFFF", "#E0393E", "#140A0A") },
  { c: "Kırk yıl güreştim, diyor", g: "08:43", tone: "warm", r: cam([2.6, 2.8], [760, 560], undefined, (t) => <><SobaOda t={t} night={0} />{diz(bay, t, 760, BS, { pose: KH, mouth: "flat", talk: true, eyes: "squint", holdR: kispetEl(0.4) })}</>), html: q("“SIRTIM BİR KERE BİLE YERE GELMEDİ. BİR KERE BİLE.”", 66, 0.2) },
  { c: "Sonra kispeti katlıyor", g: "08:44", tone: "cool", r: cam([1.6, 1.8], [1100, 800], undefined, (t) => <><SobaOda t={t} night={0} />{sandalye(1100, G, true)}<Sandik x={700} y={1040} open={0} /></>), html: q("SANDIĞA KOYMUYOR. SANDALYEYE BIRAKIYOR.", 70, 0.3) },
  { c: "Tam o sırada Su kahvaltı", g: "08:46", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><Mutfak t={t} night={0} candle={0} />{walk(t, a + 0.3, b, SU, 1000, 1400, SS, { eyes: "closed", mouth: "none", pose: P.hand })}</TCam>, html: tg("UYURGEZER", T.purple) },
  { c: "Uzun, kısa, uzun", g: "08:46", sfx: "tick", tone: "cool", r: buz("KAPI", "write", 0, "asleep"), html: q("UZUN, KISA, UZUN. · KISA, UZUN. · …", 70, 0.1, 960) },
  { c: "Gündüz olan sen, parmaklarınla", g: "08:47", tone: "cool", r: buz("KAPI", "read"), html: q("“K… A… P… I.”", 100, 0.3, 140) },
  { c: "Kapı.", g: "08:47", sfx: "boom", tone: "night", ...kartTxt("KAPI.", undefined, "#F6C445", undefined, "#0A0D14") },
  { c: "Bayram Dayı kahkaha atıyor", g: "08:47", sfx: "ding", tone: "gold", r: cam([1, 1.06], [960, 600], undefined, (t) => koridor(t, <>{bay(t, 560, BS, { mouth: "grin", eyes: "happy", pose: P.point })}{sen(t, 1600, 1, { dir: -1, mouth: "grin" })}</>)), html: tg("İLK GÜN SÖKTÜĞÜ MUTFAK KAPISI", T.orange) },
  { c: "Kural altı, diyor Bayram", g: "08:47", tone: "gold", r: cam([2.4, 2.6], [560, 520], undefined, (t) => koridor(t, bay(t, 560, BS, { mouth: "grin", talk: true, eyes: "squint", pose: P.point }))), html: q("“KURAL ALTI. ÖNCE KOLU DENERİM.”", 86, 0.1) },
  { c: "Herkes gülüyor. Su da", g: "08:48", tone: "gold", r: cam([1, 1.06], [960, 620], undefined, mut((t) => masa(t, { bF: { mouth: "grin", eyes: "happy" }, sen: { mouth: "grin", eyes: "happy" }, su: { eyes: "happy", mouth: "smile" } }))) },
  { c: "Ama Su'nun camlara yazdığı", g: "08:48", tone: "night", r: kart("#0E1A2E"), html: (t, a) => <>{["ÜÇ GECE ✓", "MAZOT ✓", "RADYO ✓", "KEFAL ✓"].map((l, i) => <Txt key={l} t={t} at={a + 0.4 + i * 0.5} text={l} y={260 + i * 130} size={84} color="#3BE07A" />)}</> },
  { c: "Ve kimse, bu kapının", g: "08:49", sfx: "drone", tone: "night", ...kartTxt("KAPI = ?", "HENÜZ.", "#F6C445", "#E0393E", "#0A0D14") },

  // ── TAHMİNLER ──
  { c: "Bir şey söylemem lazım", hud: false, tone: "cool", r: kart("#101828"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="GEÇEN BÖLÜM SORDUM:" y={320} size={74} /><Txt t={t} at={a + 1.4} text="BORA NEDEN DÖNDÜ? · ASYA BİZDEN Mİ?" y={460} size={66} color="#F6C445" /></> },
  { c: "Yüzlerce tahmin yazdınız", hud: false, tone: "gold", ...kartTxt("YÜZLERCE TAHMİN.", "BAZILARI ÜRKÜTÜCÜ DERECEDE DOĞRU.", "#FFFFFF", "#F6C445", "#101828") },
  { c: "Mathema yazmış", ...yorum("Mathema", "Herkes gülerken Asya arka camdan yola bakıyordu.") },
  { c: "Mehmet Paşa yazmış", ...yorum("Mehmet Paşa", "Asya İstanbul'dan Van'a birkaç saatte gelmiş.") },
  { c: "Merr yazmış", ...yorum("Merr", "O plastik gülü on dakikada nereden buldu?") },
  { c: "Ve Teymullah, uzun", ...yorum("Teymullah", "Su bugüne kadar hiçbir şeyde yanılmadı.") },
  { c: "Hepiniz bir şeyi fark", hud: false, sfx: "boom", tone: "night", ...kartTxt("ŞİMDİ, NE KADAR HAKLI", "OLDUĞUNUZU GÖRECEKSİNİZ.", "#FFFFFF", "#E0393E", "#0A0D14") },

  // ── ÖĞLEDEN SONRA · ASYA ──
  { c: "Öğleden sonra. Gündüz", g: "14:10", tone: "warm", r: bahce((t) => <>{sen(t, 760, 1, { pose: P.wave, mouth: "grin", eyes: "happy" })}{su(t, 1180, SS, { pose: P.cheer, mouth: "smile", dir: -1 })}<Kopek x={980} y={G} s={0.6} t={t} kind="kara" sit={1} wag={1} /></>), html: tg("HAKEM: KARABAŞ · HEP SU KAZANIYOR", T.yellow) },
  { c: "Asya içeride. Arabanın", g: "14:12", tone: "cool", r: cam([1.6, 1.8], [960, 560], undefined, mut((t) => asy(t, 960, 1, { mouth: "smile", talk: true, pose: P.phone }))), html: q("“TELEFONUMU ŞARJ EDECEĞİM.”", 86, 0.3) },
  { c: "Arabaya biniyor. Motoru", g: "14:13", tone: "cool", r: bahce((t) => <>{sahin(t, 1500, 0)}{su(t, 900, SS, { mouth: "none", look: 1 })}</>), html: q("GÜNDÜZ VAKTİ. FARLAR.", 84, 0.5) },
  { c: "Kısa, kısa, kısa. Kısa, kısa, uzun", g: "14:13", sfx: "tick", tone: "cool", r: bahce((t, a) => <>{sahin(t, 1500, morsOn(t, a + 0.3, "... ..- ", 0.3))}</>), html: q("FARLAR, TEPELERE DOĞRU.", 80, 0.5) },
  { c: "Su durmuş. Elindeki", g: "14:13", tone: "cool", r: cam([2.6, 2.8], [960, 860], undefined, bahce((t) => <>{su(t, 960, SS, { mouth: "none", eyes: "wide", pose: P.hand, holdR: <circle r={20} fill="#FFFFFF" /> })}</>)), html: q("ARABAYA BAKIYOR. SONRA SANA. KOLUNDAN ÇEKİYOR.", 64, 0.3) },
  { c: "Gündüz olan sen, Mors'u", g: "14:14", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}><rect width={1920} height={1080} fill="#0E1A2E" /></TCam>, html: (t, a, b) => <><Txt t={t} at={a + 0.2} text="“S… U.”" y={300} size={110} color="#2EE6D0" /><Txt t={t} at={a + (b - a) * 0.45} text="“B… A… H… Ç… E.”" y={480} size={110} color="#F6C445" /></> },
  { c: "Su bahçede.", g: "14:14", sfx: "boom", tone: "night", ...kartTxt("“SU BAHÇEDE.”", undefined, "#E0393E", undefined, "#0A0D14") },
  { c: "Kartopu elinden düşüyor", g: "14:14", tone: "cool", r: cam([2.4, 2.6], [760, 760], undefined, bahce((t, a) => <>{sen(t, 760, 1, { mouth: "o", eyes: "wide", brow: "worried", pose: P.shock })}<circle cx={820} cy={lerp(820, 1020, ramp(t, a + 0.2, a + 0.8))} r={22} fill="#FFFFFF" /></>)) },
  { c: "Arabanın kapısını açıyorsun", g: "14:15", tone: "cool", r: cam([1, 1.06], [960, 620], undefined, (t) => <ArabaKapi t={t} far={1} />), html: q("YÜZÜ BEMBEYAZ.", 90, 0.5) },
  { c: "Ne yapıyorsun?", g: "14:15", tone: "cool", r: cam([2, 2.2], [1520, 520], undefined, (t) => <ArabaKapi t={t} senF={{ talk: true }} />), html: q("“NE YAPIYORSUN?”", 100, 0.1) },
  { c: "Önce gülümsemeye", g: "14:15", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[760, 520]}><ArabaKapi t={t} sen={false} asyF={{ mouth: t < (a + b) / 2 ? "smile" : "frown", eyes: "squint" }} /></TCam> },
  { c: "Ve sonra, ilk kez kameraya", g: "14:15", tone: "night", r: cam([2.6, 2.8], [760, 500], undefined, (t) => <ArabaKapi t={t} sen={false} asyF={{ mouth: "flat", eyes: "open", talk: true, dir: 1 }} />), html: tg("İLK KEZ KAMERAYA DEĞİL, SİZE", T.pink) },
  { c: "Kız kardeşim. Elif", g: "14:16", tone: "night", r: cam([2.8, 3], [760, 480], undefined, (t) => <ArabaKapi t={t} sen={false} asyF={{ mouth: "flat", eyes: "squint", talk: true, brow: "worried", dir: 1 }} />), html: q("“KIZ KARDEŞİM. ELİF. GELİN OLACAKTI.”", 84, 0.2) },
  { c: "Bora otele geldiğinde", g: "14:16", tone: "night", r: cam([1.2, 1.3], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#2A2232" /><Foto x={960} y={540} s={1.6} tir={0.25} /></>), html: q("BATIDA BİR IŞIK. VE BEYAZ BİR GELİNLİK.", 72, 0.4, 960) },
  { c: "Dedi ki, Su'yu getir", g: "14:16", tone: "night", r: cam([2.8, 3], [760, 480], undefined, (t) => <ArabaKapi t={t} sen={false} asyF={{ mouth: "frown", eyes: "closed", talk: true, brow: "worried", dir: 1 }} />), html: q("“SU'YU GETİR. SENİ KARDEŞİNE GÖTÜREYİM.”", 76, 0.1) },
  { c: "Gündüz olan sen, hayatında", g: "14:17", tone: "night", r: cam([2.2, 2.4], [1520, 500], undefined, (t) => <ArabaKapi t={t} senF={{ mouth: "frown", brow: "angry", talk: true, pose: P.point }} />), html: q("“BİR ÇOCUĞU… BİR FOTOĞRAF İÇİN Mİ SATTIN?”", 74, 0.3) },
  { c: "Asya ağlıyor. Ve tam", g: "14:17", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[760, 480]}><ArabaKapi t={t} sen={false} asyF={{ mouth: "frown", eyes: "closed", brow: "worried" }} />{tearOn(760, 430, 1.4)(t)}</TCam> },
  { c: "Bayram Dayı.", g: "14:17", sfx: "knock", tone: "warm", r: bahce((t) => <>{sahin(t, 1550, 0)}{bay(t, 760, BS, { mouth: "flat", brow: "worried" })}{sen(t, 1160, 1, { dir: -1, mouth: "open", brow: "angry" })}</>) },
  { c: "Bırak kızı, evlat", g: "14:17", tone: "warm", r: cam([2.4, 2.6], [760, 480], undefined, bahce((t) => bay(t, 760, BS, { mouth: "flat", talk: true, brow: "worried" }))), html: q("“BIRAK KIZI, EVLAT.”", 100, 0.1) },
  { c: "Dayı, bu kız senin", g: "14:18", tone: "cool", r: cam([2.4, 2.6], [1160, 480], undefined, bahce((t) => sen(t, 1160, 1, { dir: -1, mouth: "open", talk: true, brow: "angry", pose: P.point }))), html: q("“BU KIZ SENİN TORUNUNU SATIYORDU!”", 86, 0.1) },
  { c: "Bayram Dayı Asya'ya bakıyor", g: "14:18", tone: "warm", r: cam([2.4, 2.6], [760, 480], undefined, bahce((t) => bay(t, 760, BS, { mouth: "flat", talk: true, eyes: "squint", look: 1 }))), html: q("“KAYBEDEN, HERKESE İNANIR. BEN DE İNANDIM.”", 76, 0.2) },
  { c: "Yüz on yedi gün, her sabah", g: "14:18", tone: "gold", r: ikiCay(1), html: q("“117 GÜN, HER SABAH İKİ BARDAK ÇAY. BİRİ GELİR DİYE.”", 62, 0.1) },
  { c: "Sonra bahçeye dönüyor", g: "14:19", tone: "cool", r: cam([1, 1.06], [960, 620], undefined, bahce((t) => bay(t, 760, BS, { mouth: "open", talk: true, dir: -1 }))), html: q("“SU, İÇERİ GEL.”", 100, 0.3) },
  { c: "Cevap yok.", g: "14:19", sfx: "drone", tone: "night", r: cam([1, 1.04], [960, 600], undefined, bahce(() => null)) },
  { c: "Bahçe boş. Karın", g: "14:19", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}><AyakIzi t={t} k={ramp(t, a + 0.3, b - 0.3)} ball={0.6} /></TCam>, html: q("KÜÇÜK İZLER. BÜYÜK İZLER. ÇOK BÜYÜK.", 74, 0.5) },
  { c: "Ve karın üstüne bırakılmış", g: "14:19", tone: "cool", r: cam([1.3, 1.4], [960, 640], undefined, (t) => <><AyakIzi t={t} k={1} ball={0.6} /><InceBardak x={960} y={760} s={1.8} tea={1} saucer={false} /><Buhar x={960} y={500} s={1.2} t={t} /></>), html: tg("HÂLÂ BUHAR ÇIKIYOR", T.orange) },
  { c: "Altında bir not", g: "14:20", sfx: "boom", tone: "night", r: cam([1.2, 1.3], [960, 600], undefined, (t) => <><AyakIzi t={t} k={1} ball={0} /><g transform="translate(960,620) scale(2.2)"><Kagit x={0} y={0} lines={["Affetme.", "Sadece çay iç."]} /></g></>), html: tg("BORA'NIN CÜMLESİ", T.red) },
  { c: "Siz arabanın yanında", g: "14:20", tone: "night", ...kartTxt("SİZ KAVGA EDERKEN…", "BİRİ SESSİZCE GELİP GİTMİŞ.", "#FFFFFF", "#E0393E", "#0A0D14") },
  { c: "Bayram Dayı karın içine", g: "14:21", tone: "cool", r: cam([1.4, 1.6], [960, 700], undefined, bahce((t) => diz(bay, t, 960, BS, { mouth: "frown", eyes: "closed", brow: "worried" }))), html: q("BU SEFER, BİR DAHA KALKAMAYACAKMIŞ GİBİ.", 70, 0.4) },
  { c: "Ve sen ilk kez", g: "14:21", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 560]}><rect width={1920} height={1080} fill="#DCE6F0" /><g transform={`translate(${960 + Math.sin(t * 40) * 5},560)`}><ellipse rx={170} ry={130} fill="#E8B892" />{[-120, -60, 0, 60].map((x) => <rect key={x} x={x - 22} y={-260} width={44} height={160} rx={22} fill="#E8B892" />)}</g></TCam>, html: q("BAYRAM DAYI'NIN ELİ TİTRİYOR.", 84, 0.3) },

  // ── GÜN BATIMI · GECE OLAN SEN ──
  { c: "Saat dört buçuk", g: "16:30", tone: "warm", r: cam([1, 1.08], [960, 600], undefined, sehir("dusk")), html: q("VAN'DA KIŞIN GÜNEŞ ERKEN BATAR.", 80, 0.4) },
  { c: "Gökyüzü turuncuya", g: "16:31", sfx: "drone", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]}>{sehir("dusk")(t)}<rect width={1920} height={1080} fill="#2A1A4A" opacity={ramp(t, a, b) * 0.6} /></TCam> },
  { c: "Gece olan sen uyanıyor. Ve ilk", g: "16:31", sfx: "boom", tone: "night", ...kartTxt("GECE OLAN SEN", "UYANIYOR.", "#2EE6D0", "#F6C445", "#070A12") },
  { c: "Asya'nın farları tepelere", g: "16:32", tone: "night", r: notlar(sokak("dusk"), [{ x: 400, y: 300, text: "FARLAR → TEPELER" }, { x: 1000, y: 520, text: "BORA TEPEDEN BAKIYORDU" }, { x: 700, y: 760, text: "TEPEDEN OVAYA BAKAN BİR YER" }], "16:32") },
  { c: "Karın üstündeki büyük ayak", g: "16:32", tone: "night", r: notlar((t) => <AyakIzi t={t} k={1} ball={0} />, [{ x: 500, y: 300, text: "İZLER DERİN → TAŞIYOR" }, { x: 1100, y: 500, text: "SU'YU KUCAKLAMIŞ" }, { x: 700, y: 760, text: "BAĞIRMAMIŞ → UYUYORDU" }], "16:33") },
  { c: "Ve çay bardağı. Hâlâ", g: "16:33", tone: "night", r: notlar((t) => <><rect width={1920} height={1080} fill="#1A2030" /><InceBardak x={960} y={820} s={2} tea={1} saucer={false} /></>, [{ x: 420, y: 300, text: "ÇAY SICAK" }, { x: 1180, y: 380, text: "ARABADA OCAK VAR" }, { x: 760, y: 900, text: "UZUN YOLA HAZIRLANIYOR" }], "16:33") },
  { c: "Asya, diyorsun. Sesin", g: "16:34", tone: "night", r: cam([1.2, 1.3], [960, 620], undefined, mut((t) => <>{sen(t, 760, 1, { mouth: "flat", eyes: "squint", talk: true })}{asy(t, 1240, 1, { dir: -1, mouth: "flat", brow: "worried", eyes: "wide" })}</>, 1)), html: q("“O FOTOĞRAF. NEREDE ÇEKİLMİŞTİ?”", 84, 0.4) },
  { c: "Bilmiyorum. Bir binanın", g: "16:34", tone: "night", r: cam([1.2, 1.3], [960, 560], undefined, (t) => <><rect width={1920} height={1080} fill="#1A2030" /><Foto x={960} y={540} s={1.6} tir={1} /></>), html: tg("ARKADA: MAVİ BİR TIR", T.blue) },
  { c: "Gece olan sen, Van'ın", g: "16:35", tone: "night", r: notlar((t) => <><rect width={1920} height={1080} fill="#0A1222" />{sehir("dusk")(t)}<rect width={1920} height={1080} fill="#0A1222" opacity={0.6} /></>, [{ x: 360, y: 260, text: "TEPEDEN OVAYA BAKAN" }, { x: 1200, y: 300, text: "İÇİNE TIR SIĞAN" }, { x: 420, y: 760, text: "ISITMASIZ" }, { x: 1240, y: 780, text: "YALNIZ" }], "16:35") },
  { c: "Şehrin kuzeyinde", g: "16:36", sfx: "ding", tone: "night", r: cam([1, 1.08], [960, 560], undefined, (t) => <GarajDis t={t} sag={0.25} mode="dusk" />), html: q("ESKİ BİR TIR GARAJI. ÇATISI DÜZ.", 80, 0.3) },
  { c: "Karabaş, Su'nun sapsarı", g: "16:37", tone: "night", r: cam([1.4, 1.5], [960, 800], undefined, mut((t) => <><g transform="translate(1100,860) rotate(8)"><path d="M-120,0 L-90,-160 L90,-160 L120,0Z" fill="#F6C445" /><path d="M-90,-160 L-170,-60 M90,-160 L170,-60" stroke="#F6C445" strokeWidth={40} /></g><Kopek x={900} y={1040} s={0.8} t={t} kind="kara" dir={1} /></>, 1)), html: q("KOKLUYOR. KAPIYA KOŞUYOR. HAV! HAV!", 76, 0.4) },
  { c: "Defne defterini açıyor", g: "16:38", tone: "night", r: cam([1.2, 1.3], [960, 540], undefined, (t, a, b) => <><rect width={1920} height={1080} fill="#3A2E26" /><Defter x={960} y={540} s={1.2} lines={["1. Gece dışarı yok", "2. Aptalca risk yok", "4. Gece yolculuk yok", "6. Önce kolu dene", "8. Gece kararı sabah konuşulur"]} k={1 - ramp(t, a + (b - a) * 0.6, b)} /></>) },
  { c: "Bu gece kural yok", g: "16:38", sfx: "boom", tone: "night", r: cam([2.4, 2.6], [960, 500], undefined, mut((t) => defm(t, 960, 1, { mouth: "flat", brow: "angry", talk: true }), 1)), html: q("“BU GECE KURAL YOK.”", 110, 0.1) },
  { c: "Bayram Dayı sandalyenin", g: "16:39", tone: "gold", r: cam([1.4, 1.5], [1000, 700], undefined, (t, a, b) => { const k = t > a + (b - a) * 0.5; return <><SobaOda t={t} night={1} />{sandalye(1250, G, !k)}{(k ? bayk : bay)(t, 900, BS, { mouth: "flat", brow: "angry", eyes: "squint", pose: k ? P.hips : P.reach })}</>; }), html: q("BELİNE SARIYOR. BİR PEHLİVANIN KEMERİ GİBİ.", 70, 0.5) },
  { c: "Hep beraber eski Şahin'e", g: "17:30", tone: "night", r: gece("bozkir"), html: tg("ASYA ARKADA · YALNIZ", T.pink) },
  { c: "Yolda Bayram Dayı hiç", g: "17:40", tone: "night", r: onKoltuk({ mouth: "flat", eyes: "squint", look: 1, lookY: -0.6 }, { c: [1220, 620], z: [1.8, 2] }) },
  { c: "Kardeşinin adı Elif", g: "17:40", tone: "night", r: onKoltuk({ mouth: "flat", talk: true, eyes: "squint", look: 1, lookY: -0.6 }, { c: [1220, 600], z: [2.4, 2.6] }), html: q("“KARDEŞİNİN ADI ELİF MİYDİ?”", 92, 0.1) },
  { c: "Evet.", g: "17:40", tone: "night", r: cam([2.4, 2.6], [960, 520], undefined, (t) => <><rect width={1920} height={1080} fill="#0E1626" /><rect x={380} y={520} width={1160} height={560} rx={60} fill="#34405A" />{otur(asy, t, 960, 760, 1.2, { mouth: "flat", eyes: "squint", brow: "worried", talk: true })}</>), html: q("“EVET.”", 110, 0.05) },
  { c: "Güzel isim.", g: "17:41", sfx: "ding", tone: "gold", r: onKoltuk({ mouth: "smile", talk: true, eyes: "closed" }, { c: [1220, 600], z: [2.6, 2.8] }), html: q("“GÜZEL İSİM.”", 110, 0.05) },
  { c: "Bu kadar. Bayram Dayı, hayatında", g: "17:41", tone: "gold", ...kartTxt("HAYATINDA", "İKİNCİ SORU.", "#F6C445", "#FFFFFF", "#3A2414") },

  // ── GARAJ ──
  { c: "Saat on bire doğru", g: "22:50", sfx: "drone", tone: "night", r: cam([1, 1.08], [960, 560], undefined, (t) => <GarajDis t={t} sag={0.45} car />), html: tg("ÇATI ORTADAN ÇÖKMÜŞ", T.red) },
  { c: "Gece olan sen çatıya", g: "22:51", tone: "night", r: (t, a) => <KarYuk t={t} a={a} /> },
  { c: "Ve garajın içinden", g: "22:52", tone: "night", r: cam([1.6, 1.8], [960, 660], undefined, (t) => <GarajDis t={t} sag={0.45} car />), html: q("BİR ÇAYDANLIĞIN ISLIĞI.", 90, 0.3) },
  { c: "Demir kapıyı itiyorsunuz", g: "22:52", sfx: "knock", tone: "night", r: cam([1, 1.06], [960, 560], undefined, garaj({ bora: false, bay: false, sen: false, def: false, asya: false, dog: false })), html: q("TEK LAMBA. JENERATÖR.", 90, 0.4) },
  { c: "Duvar boyunca", g: "22:52", tone: "night", r: cam([1.6, 1.8], [1450, 760], [1300, 760], garaj({ bora: false, bay: false, sen: false, def: false, asya: false, dog: false })), html: (t, a) => <><Txt t={t} at={a + 0.3} text="40 BİDON" y={120} size={110} color="#9FD3EC" /><Txt t={t} at={a + 1.4} text="BAYRAM DAYI'NIN KAYIP MAZOTU" y={900} size={64} /></> },
  { c: "Ortada bir ocak", g: "22:53", tone: "warm", r: cam([2, 2.2], [560, 860], undefined, garaj({ bora: false, bay: false, sen: false, def: false, asya: false, dog: false })) },
  { c: "Su.", g: "22:53", sfx: "boom", tone: "warm", r: cam([3, 3.2], [400, 860], undefined, garaj({ bora: false, bay: false, sen: false, def: false, asya: false, dog: false })), html: q("SU.", 120, 0.2) },
  { c: "Ve ocağın öbür tarafında", g: "22:53", tone: "night", r: cam([1.4, 1.5], [860, 760], undefined, garaj({ bay: false, sen: false, def: false, asya: false, dog: false })) },
  { c: "Hoş geldiniz", g: "22:53", tone: "night", r: cam([2.6, 2.8], [855, 760], undefined, garaj({ bora: { talk: true, mouth: "smile", eyes: "squint" }, bay: false, sen: false, def: false, asya: false, dog: false })), html: q("“HOŞ GELDİNİZ. ÇAY?”", 100, 0.1) },
  { c: "Bayram Dayı bir adım", g: "22:54", tone: "night", r: cam([1, 1.05], [1100, 600], undefined, garaj({ bora: { talk: true, pose: P.hand, holdR: undefined, brow: "angry" }, bay: { pose: P.reach } })), html: q("“DUR, DAYI. KIZI UYANDIRMA.”", 86, 0.1) },
  { c: "Ona biraz uyku şurubu", g: "22:54", tone: "night", r: cam([2.6, 2.8], [855, 760], undefined, garaj({ bora: { talk: true, mouth: "smile" }, bay: false, sen: false, def: false, asya: false, dog: false })), html: q("“UYURKEN YAZIYOR, BİLİYORSUN.”", 86, 0.3) },
  { c: "Defne Su'ya koşuyor", g: "22:55", tone: "warm", r: cam([1.3, 1.4], [600, 800], undefined, (t) => <>{garaj({ bora: false, bay: false, sen: false, def: false, asya: false, dog: false })(t)}{diz(defm, t, 660, 0.85, { pose: KR, mouth: "o", brow: "worried", dir: -1 }, 940)}</>), html: q("YAŞIYOR. SADECE UYUYOR.", 90, 0.5) },
  { c: "Neden? diyorsun", g: "22:55", tone: "night", r: cam([2.6, 2.8], [1320, 760], undefined, garaj({ sen: { talk: true, mouth: "open", brow: "angry" } })), html: q("“NEDEN?”", 110, 0.05) },
  { c: "Bora gülümsüyor", g: "22:55", tone: "night", r: cam([3, 3.2], [855, 720], undefined, garaj({ bora: { mouth: "grin", eyes: "squint", brow: "angry" } })), html: q("YÜZÜ GÜLÜYOR. GÖZÜ GÜLMÜYOR.", 84, 0.3) },
  { c: "Çünkü bu kız geleceği", g: "22:56", tone: "night", r: cam([2.2, 2.4], [855, 740], undefined, garaj({ bora: { talk: true, mouth: "smile", pose: P.point } })), html: q("“ÜÇ GECE DEDİ, OLDU. MAZOT DEDİ, OLDU. KEFAL DEDİ, OLDU.”", 60, 0.2) },
  { c: "Bu dünyada, geleceği bilenle", g: "22:56", sfx: "boom", tone: "night", ...kartTxt("“GELECEĞİ BİLENLE SAVAŞILMAZ.", "ONU YANINA ALIRSIN.”", "#FFFFFF", "#E0393E", "#0A0D14") },
  { c: "Gece olan sen Bora'ya", g: "22:57", tone: "night", r: cam([2.4, 2.6], [1320, 740], undefined, garaj({ sen: { mouth: "flat", eyes: "squint", brow: "angry" } })), html: q("GÜNDÜZÜN DAHİSİ, GECE SADECE YALAN SÖYLEYEN BİR ADAM.", 58, 0.3) },
  { c: "Asya'nın kardeşi, diyorsun", g: "22:57", tone: "night", r: cam([2.4, 2.6], [1320, 740], undefined, garaj({ sen: { mouth: "flat", talk: true, eyes: "squint" } })), html: q("“FOTOĞRAFTAKİ GELİNLİK.”", 92, 0.3) },
  { c: "Bora omuz silkiyor", g: "22:57", sfx: "pop", tone: "night", r: cam([2.6, 2.8], [855, 740], undefined, garaj({ bora: { pose: P.shrug, mouth: "smile", talk: true } })), html: q("“BİR MAĞAZANIN VİTRİNİNDEN.”", 92, 0.3) },
  { c: "Ve listen. Bodrumdaki", g: "22:58", tone: "night", r: cam([1.2, 1.3], [960, 560], undefined, (t) => <KagitYaz lines={["DEFNE", "BAYRAM", "SU", "BORA"]} />), html: tg("BODRUMDAKİ PLAN · 4 İSİM", T.red) },
  { c: "Arkanda, Asya'nın nefesi", g: "22:58", tone: "night", r: cam([2.6, 2.8], [1760, 720], undefined, garaj({ asya: { mouth: "o", eyes: "wide", brow: "worried" } })) },
  { c: "Asya'nın adı hiç yoktu", g: "22:58", sfx: "boom", tone: "night", ...kartTxt("ASYA'NIN ADI", "HİÇ YOKTU.", "#FFFFFF", "#E0393E", "#0A0D14") },
  { c: "Bora, Asya'ya bakmıyor", g: "22:58", tone: "night", r: cam([2.6, 2.8], [855, 740], undefined, garaj({ bora: { mouth: "smile", eyes: "closed", pose: P.hand } })), html: q("“İNSANLAR İSTEDİKLERİNE İNANIR.”", 86, 0.4) },
  { c: "Tam o an, tavandan", g: "22:59", sfx: "knock", tone: "night", r: cam([1, 1.05], [960, 400], undefined, garaj({ bend: 0.15, sway: 0.5 })) },
  { c: "Çıt.", g: "22:59", sfx: "knock", tone: "night", r: (t) => <KirisYakin t={t} bend={0.3} />, html: q("ÇIT.", 130, 0.1) },
  { c: "Herkes yukarı bakıyor", g: "22:59", tone: "night", r: cam([1, 1.05], [1100, 600], undefined, garaj({ bend: 0.35, sway: 1, bay: { lookY: -1, mouth: "o" }, sen: { lookY: -1, mouth: "o", eyes: "wide" }, def: { lookY: -1 }, asya: { lookY: -1 }, bora: { lookY: -1, mouth: "flat" } })) },
  { c: "Çıt. Çıt.", g: "22:59", sfx: "knock", tone: "night", r: (t, a, b) => <KirisYakin t={t} bend={0.4 + ramp(t, a, b) * 0.3} dust={0.4} />, html: q("ÇIT. ÇIT.", 130, 0.1) },
  { c: "Çatının ortasında", g: "22:59", sfx: "drone", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{garaj({ bend: 0.6, dust: 0.8, sway: 1, bay: { lookY: -1, mouth: "o" }, sen: { lookY: -1, mouth: "o", eyes: "wide" } })(t)}</TCam>, html: q("BİR BİNANIN İÇİNDE KAR YAĞIYOR.", 80, 0.5) },
  { c: "Böyle geniş, düz", g: "23:00", tone: "night", ...kartTxt("ÖNCE ÇATIRDAR. SONRA EĞİLİR.", "SONRA, BİRKAÇ SANİYEDE ÇÖKER.", "#FFFFFF", "#E0393E", "#0A0D14") },
  { c: "Çıkın! diyorsun", g: "23:00", sfx: "boom", tone: "night", r: cam([1, 1.05], [1100, 600], undefined, garaj({ bend: 0.7, dust: 1, sway: 1, sen: { pose: P.point, mouth: "open", talk: true, brow: "angry" }, bora: { mouth: "flat" } })), html: q("“ÇIKIN! HEMEN!”", 110, 0.05) },
  { c: "Defne Su'yu kucaklıyor", g: "23:00", tone: "night", r: cam([1.2, 1.3], [1300, 640], undefined, garaj({ bend: 0.72, dust: 1, sway: 1, defSu: true, defX: 1400, sen: { pose: P.run, mouth: "open" } })), html: q("AMA DEMİR KAPI SIKIŞMIŞ.", 86, 0.5) },
  { c: "Kapıyı itiyorsun", g: "23:00", sfx: "knock", tone: "night", r: kasa(() => 0, (t) => sen(t, 1200, 1, { pose: P.reach, mouth: "open", brow: "angry", dir: 1, sweat: true }, 1000), { op: 0 }), html: q("KIPIRDAMIYOR. KIPIRDAMIYOR.", 90, 0.4) },
  { c: "Ve Bayram Dayı kapıya", g: "23:01", tone: "warm", r: kasa(() => 0, () => null, { pose: P.stand, mouth: "flat", brow: "angry", sweat: false }) },
  { c: "Bu yolculukta kaç kapı", g: "23:01", tone: "gold", r: kart("#3A2414"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="KAÇ KAPI SÖKTÜ, KAÇ KAPI KIRDI…" y={360} size={76} color="#F6C445" /><Txt t={t} at={a + 1.6} text="KİMSE SAYMADI." y={500} size={86} color="#FFFFFF" /></> },
  { c: "Ama bu sefer bir an duruyor", g: "23:01", tone: "warm", r: cam([2.4, 2.6], [1060, 700], undefined, (t, a, b) => <KapiKasa t={t} gap={0} dust={0.5}>{bayk(t, 960, BS, { pose: UZAT, mouth: "flat", eyes: "squint" }, 1000)}<rect x={1300} y={600} width={60} height={20} rx={8} fill="#B8BFC6" transform={`rotate(${ramp(t, a + (b - a) * 0.6, b) * -30} 1300 610)`} /></KapiKasa>), html: tg("KOLU ÇEVİRİYOR", T.orange) },
  { c: "Kural altı. Önce kolu dener", g: "23:01", tone: "gold", ...kartTxt("KURAL 6:", "ÖNCE KOLU DENE.", "#F6C445", "#FFFFFF", "#3A2414") },
  { c: "Defne ağlarken gülüyor", g: "23:01", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[960, 560]}>{garaj({ bend: 0.75, dust: 1, defSu: true, defX: 960, bay: false, sen: false, asya: false, dog: false, bora: false, def: { mouth: "grin", eyes: "closed", brow: "worried" } })(t)}{tearOn(970, 760, 1)(t)}</TCam> },
  { c: "Kol dönmüyor", g: "23:02", tone: "night", r: cam([2.6, 2.8], [1300, 600], undefined, (t) => <KapiKasa t={t} gap={0}><rect x={1300} y={600} width={60} height={20} rx={8} fill="#B8BFC6" /></KapiKasa>), html: q("KOL DÖNMÜYOR.", 100, 0.3) },
  { c: "Denedim, Başkan", g: "23:02", sfx: "ding", tone: "gold", r: cam([2.6, 2.8], [960, 560], undefined, (t) => <KapiKasa t={t} gap={0}>{bayk(t, 960, BS, { pose: P.stand, mouth: "grin", talk: true, eyes: "squint" }, 1000)}</KapiKasa>), html: q("“DENEDİM, BAŞKAN.”", 110, 0.1) },
  { c: "Ve iki elini kapının", g: "23:02", tone: "warm", r: kasa(() => 0, () => null), html: q("TIPKI BİR GÜREŞTE, KALDIRMADAN ÖNCEKİ GİBİ.", 66, 0.4) },
  { c: "Ve kaldırıyor.", g: "23:02", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} shake={2}>{kasa((t2, a2, b2) => ramp(t2, a2, b2) * 0.5, () => null)(t, a, b)}</TCam>, html: q("VE KALDIRIYOR.", 110, 0.2) },
  { c: "Kapının kasası bir karış", g: "23:02", tone: "warm", r: kasa((t, a, b) => 0.5 + ramp(t, a, b) * 0.5, () => null), html: q("SIRTINDA, ÇATININ BİR KISMI.", 84, 0.5) },
  { c: "Geçin, diyor", g: "23:03", tone: "warm", r: cam([2.4, 2.6], [960, 460], undefined, kasa(() => 1, () => null, { mouth: "smile", talk: true })), html: q("“GEÇİN.” · SESİ SAKİN. ÇOK SAKİN.", 80, 0.1) },
  { c: "Ve saymaya başlıyor", g: "23:03", tone: "gold", r: kasa(() => 1, () => null, { mouth: "smile" }), html: q("BU SEFER KENDİ ADIMLARINI DEĞİL. SİZİ.", 72, 0.3) },
  { c: "Bir. Su", g: "23:03", sfx: "tick", tone: "gold", r: kasa(() => 1, (t, a, b) => <>{walk(t, a, b, DEFNE_M, 1300, 620, 1, { pose: SARIL, mouth: "flat", brow: "worried" }, 1000)}{suKucak(t, wx(t, a, b, 1300, 620, 1) + 6, 1000 - 228)}</>), html: (t, a) => <Txt t={t} at={a + 0.1} text="“BİR.” · SU" y={120} size={110} color="#F6C445" /> },
  { c: "İki. Defne", g: "23:03", sfx: "tick", tone: "gold", r: kasa(() => 1, (t, a, b) => <>{walk(t, a - 1, b - 1.5, DEFNE_M, 900, 520, 1, { pose: SARIL, mouth: "flat" }, 1000)}{suKucak(t, wx(t, a - 1, b - 1.5, 900, 520, 1) + 6, 1000 - 228)}</>), html: (t, a) => <Txt t={t} at={a + 0.1} text="“İKİ.” · DEFNE" y={120} size={110} color="#F6C445" /> },
  { c: "Üç. Asya", g: "23:03", sfx: "tick", tone: "gold", r: kasa(() => 1, (t, a, b) => { const m = a + (b - a) * 0.4; return t < m ? walk(t, a, m, ASYA, 1300, 1060, 1, { mouth: "flat", brow: "worried" }, 1000) : t < m + 1.2 ? asy(t, 1060, 1, { mouth: "frown", brow: "worried", dir: -1, look: -1, lookY: -0.6 }, 1000) : walk(t, m + 1.2, b, ASYA, 1060, 500, 1, { mouth: "flat", eyes: "closed" }, 1000); }), html: (t, a, b) => <><Txt t={t} at={a + 0.1} text="“ÜÇ.” · ASYA" y={120} size={110} color="#F6C445" /><Txt t={t} at={a + (b - a) * 0.6} text="BAŞIYLA İŞARET EDİYOR: GİT." y={920} size={62} /></> },
  { c: "Dört. Karabaş", g: "23:04", sfx: "tick", tone: "gold", r: kasa(() => 1, (t, a, b) => <Kopek x={wx(t, a, b, 1300, 500, 0.7)} y={1000} s={0.7} t={t} kind="kara" dir={-1} run={1} />), html: (t, a) => <Txt t={t} at={a + 0.1} text="“DÖRT.” · KARABAŞ" y={120} size={110} color="#F6C445" /> },
  { c: "Sen geçmiyorsun", g: "23:04", tone: "warm", r: kasa(() => 1, (t) => sen(t, 1140, 1, { pose: TUT, mouth: "open", brow: "angry", sweat: true, dir: -1 }, 1000)), html: q("OMZUNU KİRİŞE VERİYORSUN.", 80, 0.5) },
  { c: "Dayı, beraber çıkarız", g: "23:04", tone: "warm", r: cam([2.2, 2.4], [1140, 520], undefined, kasa(() => 1, (t) => sen(t, 1140, 1, { pose: TUT, mouth: "open", talk: true, brow: "angry", sweat: true, dir: -1 }, 1000))), html: q("“DAYI, BERABER ÇIKARIZ!”", 96, 0.1) },
  { c: "Bayram Dayı sana bakıyor. Yüzündeki", g: "23:04", tone: "gold", r: cam([2.6, 2.8], [960, 440], undefined, kasa(() => 1, () => null, { mouth: "smile", eyes: "open", look: 1 })), html: q("HER DAMARI ŞİŞMİŞ. AMA GÜLÜMSÜYOR.", 76, 0.4) },
  { c: "Evlat. Bu senin güreşin", g: "23:05", sfx: "ding", tone: "gold", r: cam([2.8, 3], [960, 440], undefined, kasa(() => 1, () => null, { mouth: "smile", talk: true, eyes: "squint", look: 1 })), html: q("“EVLAT. BU SENİN GÜREŞİN DEĞİL.”", 92, 0.1) },
  { c: "Ve tek eliyle seni yakandan", g: "23:05", tone: "warm", r: kasa(() => 1, (t, a, b) => sen(t, lerp(1140, 420, ramp(t, a + (b - a) * 0.5, b)), 1, { pose: P.shock, mouth: "o", eyes: "wide", dir: -1 }, 1000), { pose: { l: [150, 100], r: [80, 80] } }) },
  { c: "Beş.", g: "23:05", sfx: "boom", tone: "gold", ...kartTxt("“BEŞ.”", undefined, "#F6C445", undefined, "#0A0D14") },
  { c: "Karın içine düşüyorsun", g: "23:05", tone: "night", r: cam([1, 1.06], [960, 600], undefined, (t) => <><GarajDis t={t} sag={0.85} />{yatF(SEN, t, 700, 990, 1, { eyes: "wide", mouth: "o" })}</>) },
  { c: "Bayram Dayı kapının altında", g: "23:06", tone: "warm", r: kasa(() => 1, () => null, { pose: { l: [150, 100], r: [80, 70] }, mouth: "smile", look: -1 }), html: q("İÇERİDEKİ SON KİŞİYE, BOŞ ELİNİ UZATIYOR.", 70, 0.4) },
  { c: "Gel, oğlum. Altı", g: "23:06", tone: "gold", r: cam([2.4, 2.6], [960, 460], undefined, kasa(() => 1, () => null, { pose: { l: [150, 100], r: [80, 70] }, mouth: "smile", talk: true, look: -1 })), html: q("“GEL, OĞLUM. ALTI. BIRAK O BİDONLARI. GEL.”", 72, 0.1) },
  { c: "Bora, ocağın yanında", g: "23:06", tone: "night", r: cam([1.4, 1.5], [1000, 700], undefined, garaj({ bend: 0.9, dust: 1, sway: 1, su: false, bay: false, sen: false, def: false, asya: false, dog: false, bora: { mouth: "flat", eyes: "squint", look: 1 } })), html: q("ELİNE BAKIYOR. SONRA BİDONLARINA.", 80, 0.4) },
  { c: "Kırk bidon mazot", g: "23:06", tone: "night", ...kartTxt("40 BİDON MAZOT.", "BİR KIŞ. BİR HAYAT.", "#9FD3EC", "#FFFFFF", "#0A0D14") },
  { c: "Bu dünyada herkes yalnız", g: "23:07", tone: "night", r: cam([2.6, 2.8], [855, 740], undefined, garaj({ bend: 0.9, dust: 1, su: false, bay: false, sen: false, def: false, asya: false, dog: false, bora: { mouth: "grin", eyes: "squint", talk: true } })), html: q("“BU DÜNYADA HERKES YALNIZ ÖLÜR, DAYI.”", 84, 0.1) },
  { c: "Ve gülümsüyor. Yüzü", g: "23:07", tone: "night", r: cam([3, 3.2], [855, 720], undefined, garaj({ bend: 0.9, dust: 1, su: false, bay: false, sen: false, def: false, asya: false, dog: false, bora: { mouth: "grin", eyes: "squint", brow: "angry" } })) },
  { c: "Bir adım geri atıyor", g: "23:07", tone: "night", r: cam([1.4, 1.5], [1100, 700], undefined, (t, a, b) => <GarajIc t={t} bend={0.92} dust={1} su={false} sway={1}>{walk(t, a + 0.2, b, BORA, 900, 1080, 1, { mouth: "flat", eyes: "squint" })}</GarajIc>), html: tg("BİDONLARINA DOĞRU", T.green) },
  { c: "Yazık, diyor Bayram", g: "23:07", tone: "gold", r: cam([2.6, 2.8], [960, 440], undefined, kasa(() => 1, () => null, { mouth: "flat", talk: true, eyes: "closed" })), html: q("“YAZIK. BEN KİMSEYİ YALNIZ BIRAKMAM.”", 86, 0.1) },
  { c: "Sonra kirişi bırakıyor", g: "23:07", sfx: "boom", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} shake={6}><GarajDis t={t} sag={1} fall={ramp(t, a + (b - a) * 0.4, b)} />{walk(t, a, a + (b - a) * 0.5, BAYK, 960, 600, BS, { pose: P.run, mouth: "open" })}</TCam> },
  { c: "Arkasında, bir gök gürültüsü", g: "23:07", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1]} shake={4}><GarajDis t={t} sag={1} fall={1} lamp={1 - ramp(t, a, a + 2)} /></TCam>, html: q("KAR. DEMİR. TOZ. LAMBA SÖNÜYOR.", 80, 0.3) },
  { c: "Ve sessizlik.", g: "23:08", tone: "night", r: cam([1, 1.04], [960, 560], undefined, (t) => <GarajDis t={t} sag={1} fall={1} lamp={0} />) },
  { c: "Bayram Dayı karın üstünde yatıyor", g: "23:08", tone: "night", r: cam([1, 1.06], [960, 700], undefined, bayKar({ eyes: "open", mouth: "flat" }, { dust: 0.6 })), html: q("SIRT ÜSTÜ.", 100, 0.4) },
  { c: "Kırk yıl. Sırtı", g: "23:08", tone: "night", ...kartTxt("40 YIL.", "SIRTI BİR KERE BİLE YERE GELMEMİŞTİ.", "#F6C445", "#FFFFFF", "#0A0D14") },
  { c: "Ona koşuyorsun. Gözleri", g: "23:08", tone: "night", r: cam([1.2, 1.3], [900, 760], undefined, bayKar({ eyes: "open", mouth: "smile" }, { sen: true })), html: q("YILDIZLARA BAKIYOR. VE GÜLÜYOR.", 80, 0.4) },
  { c: "Sırtım yere geldi, evlat", g: "23:09", tone: "gold", r: cam([2.4, 2.6], [820, 800], undefined, bayKar({ eyes: "squint", mouth: "smile", talk: true }, { sen: true })), html: q("“SIRTIM YERE GELDİ, EVLAT. KIM YENDİ BENİ?”", 74, 0.2) },
  { c: "Sesin zor çıkıyor", g: "23:09", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[560, 640]}>{bayKar({}, { sen: true })(t)}{tearOn(600, 600, 1)(t)}</TCam>, html: q("“TAVAN, DAYI.”", 110, 0.4) },
  { c: "Bayram Dayı biraz düşünüyor", g: "23:09", sfx: "ding", tone: "gold", r: cam([2.6, 2.8], [820, 800], undefined, bayKar({ eyes: "squint", mouth: "grin", talk: true }, { sen: true })), html: q("“HAKKINI YEMEYELİM. İYİ TAVANMIŞ.”", 86, 0.4) },
  { c: "Ve bu sefer, Defne bile", g: "23:10", tone: "warm", r: cam([1.2, 1.3], [1000, 760], undefined, bayKar({ eyes: "squint", mouth: "smile" }, { sen: true, def: true })), html: q("GÜLERKEN AĞLIYOR.", 90, 0.4) },
  { c: "Onu arabaya taşıyorsunuz", g: "23:15", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}>{gece_(t)}{kar_(t, 820)}<GarajDis t={t} sag={1} fall={1} lamp={0} car /><rect width={1920} height={1080} fill="#070C18" opacity={0.5} />{(() => { const w = toonWalk(t, a + 0.3, b - 0.3, 1500, 900, 1); return <><TFig x={w.x - 330} y={G} s={1} o={SEN} t={t} dir={-1} walk={w.walk} pose={P.hold} rim={0.3} mouth="flat" sweat /><g transform={`translate(${w.x},${G - 225})`}>{yatF(BAYK, t, 250, 0, 1.0, { eyes: "closed", mouth: "flat" })}</g><TFig x={w.x + 250} y={G} s={1} o={DEFNE_M} t={t} dir={-1} walk={w.walk} pose={P.hold} rim={0.3} mouth="flat" sweat /><TFig x={w.x + 380} y={G} s={1} o={ASYA} t={t} dir={-1} walk={w.walk} pose={P.hold} rim={0.3} mouth="flat" /></>; })()}</TCam>, html: q("ÜÇ KİŞİ. BUGÜNE KADAR HEP O KALDIRDI.", 74, 0.4) },

  // ── EV · SOBANIN ÖNÜ ──
  { c: "Eve vardığınızda saat bir", g: "01:00", tone: "warm", r: cam([1, 1.06], [900, 760], undefined, oda({ bF: { eyes: "closed", mouth: "flat" }, def: "kneel", asya: "stand", sen: "stand", dog: "watch" })), html: q("BATTANİYELER. SICAK SU. VE DÜNYANIN EN ZEKİ İNSANI.", 62, 0.3) },
  { c: "Gece olan sen her şeyi", g: "01:01", tone: "night", r: notlar(oda({ bF: { eyes: "closed", mouth: "flat" }, sen: "sit", dog: "watch" }), [{ x: 420, y: 260, text: "NABIZ: HIZLI + ZAYIF" }, { x: 1200, y: 300, text: "KARIN SERT" }, { x: 460, y: 560, text: "DUDAKLAR SOLGUN" }, { x: 1180, y: 600, text: "İÇERİDE KANAMA" }], "01:02") },
  { c: "Bunu durduracak tek şey", g: "01:03", tone: "night", r: cam([1, 1.06], [960, 600], undefined, (t) => <><VanSokak t={t} mode="night" lamp={0} windows={0} snow={1} /><rect x={700} y={300} width={520} height={420} fill="#C9CED4" /><rect x={700} y={300} width={520} height={60} fill="#E0393E" /><text x={960} y={345} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={44} fill="#FFFFFF">HASTANE</text>{Array.from({ length: 12 }, (_, i) => <rect key={i} x={730 + (i % 4) * 120} y={390 + Math.floor(i / 4) * 100} width={90} height={60} fill="#1A2030" />)}<rect x={900} y={600} width={120} height={120} fill="#0A0E16" /><Kar t={t} k={0.6} /></>), html: q("KAPISI AÇIK. İÇİNDE TEK BİR DOKTOR YOK.", 72, 0.5) },
  { c: "Telefonu alıyorsun", g: "01:05", sfx: "drone", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 480]}><Tel112 t={t} k={ramp(t, a + 0.2, a + 1.4)} fail={ramp(t, a + 2, a + 2.4)} /></TCam>, html: q("“ŞEBEKE YOK.”", 100, 0.6, 940) },
  { c: "Radyoya koşuyorsun", g: "01:06", sfx: "tick", tone: "night", r: mors("SOS", "defne", "in", (t) => <RadyoOdasi t={t} beam={0.1} bulb={0.6} names={1} jacket={0} steam={0} />), html: q("KISA ×3 · UZUN ×3 · KISA ×3", 72, 0.2) },
  { c: "SOS.", g: "01:06", sfx: "boom", tone: "night", ...kartTxt("SOS.", undefined, "#E0393E", undefined, "#0A0D14") },
  { c: "Bir kere. On kere", g: "01:30", sfx: "static", tone: "night", r: cam([1.2, 1.3], [960, 600], undefined, (t) => <><rect width={1920} height={1080} fill="#101826" /><Radyo x={960} y={640} s={2.2} t={t} on={1} voice={0} /></>), html: q("BİR KERE. ON KERE. YÜZ KERE. SADECE CIZIRTI.", 66, 0.3) },
  { c: "Defne arkanda duruyor", g: "01:40", tone: "night", r: cam([2.2, 2.4], [1200, 520], undefined, oda({ bF: { eyes: "closed", mouth: "flat" }, sen: "stand", def: "stand", defF: { talk: true, mouth: "frown" }, dog: "watch" })), html: q("İLK GÜN KOYDUĞU KURAL.", 80, 0.4) },
  { c: "Kural iki. Aptalca", g: "01:40", tone: "night", r: (t, a) => <Kural_ t={t} a={a} />, html: q("“KOLUNU KIRARSAN… KIRIK KALIR.”", 80, 0.55, 900) },
  { c: "Dünyanın en zeki insanısın", g: "01:41", sfx: "boom", tone: "night", ...kartTxt("DÜNYANIN EN ZEKİ İNSANI.", "VE İLK KEZ, HİÇBİR ŞEY YAPAMIYOR.", "#2EE6D0", "#FFFFFF", "#070A12") },
  { c: "Evlat, diyor Bayram Dayı. Bırak", g: "01:45", tone: "warm", r: cam([2.2, 2.4], [520, 600], undefined, oda({ bF: { eyes: "squint", mouth: "smile", talk: true }, sen: "stand", dog: "watch" })), html: q("“BIRAK O RADYOYU. GEL OTUR. SANA BİR FIKRA ANLATACAĞIM.”", 62, 0.1) },
  { c: "Yanına oturuyorsun", g: "01:46", tone: "warm", r: cam([1.3, 1.4], [700, 760], undefined, oda({ bF: { eyes: "squint", mouth: "smile" }, sen: "sit", dog: "watch" })) },
  { c: "Temel bir gün Dursun'a", g: "01:46", tone: "warm", r: cam([2.2, 2.4], [520, 600], undefined, oda({ bF: { eyes: "squint", mouth: "smile", talk: true }, sen: "sit", dog: "watch" })), html: q("“DURSUN, DÜNYADA SON İKİ KİŞİ BİZ KALSAK NE YAPARSIN?”", 62, 0.1) },
  { c: "Duruyor. Nefesi kısa", g: "01:47", tone: "night", r: cam([2.6, 2.8], [520, 600], undefined, oda({ bF: { eyes: "closed", mouth: "flat" }, sen: "sit", dog: "watch" })), html: q("VE BU SEFER, UNUTMUYOR.", 86, 0.5) },
  { c: "Dursun da demiş ki: Seninle", g: "01:47", sfx: "ding", tone: "gold", r: cam([2.4, 2.6], [520, 600], undefined, oda({ bF: { eyes: "happy", mouth: "grin", talk: true }, sen: "sit", dog: "watch" })), html: q("“SENİNLE Mİ? ÜÇÜNCÜYÜ ARARIM.”", 96, 0.2) },
  { c: "Ve kendi fıkrasına", g: "01:48", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[700, 760]}>{oda({ bF: { eyes: "happy", mouth: "grin" }, sen: "sit", sF: { mouth: "grin", eyes: "happy", brow: "worried" }, dog: "watch" })(t)}{tearOn(882, 720, 0.9)(t)}</TCam>, html: q("İLK KEZ SONUNA KADAR.", 86, 0.3) },
  { c: "Gördün mü, diyor", g: "01:48", tone: "gold", r: cam([2.2, 2.4], [520, 600], undefined, oda({ bF: { eyes: "squint", mouth: "smile", talk: true }, sen: "sit", dog: "watch" })), html: q("“BİZ DE ARADIK. ÜÇÜNCÜYÜ BULDUK. DÖRDÜNCÜYÜ. BEŞİNCİYİ.”", 60, 0.1) },
  { c: "Sonra Karabaş'a bakıyor", g: "01:49", tone: "warm", r: cam([1.8, 2], [640, 800], undefined, oda({ bF: { eyes: "squint", mouth: "smile", talk: true, look: 1, lookY: 0.5 }, sen: "sit", dog: "watch" })), html: q("“VERİN ŞUNA BİR SUCUK. BUGÜN O DA GÜREŞTİ.”", 70, 0.2) },
  { c: "Defne bir dilim sucuk", g: "01:49", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[560, 860]}><rect width={1920} height={1080} fill="#3A2A20" /><rect y={860} width={1920} height={220} fill="#2A1E16" /><g transform="translate(700,820)"><ellipse rx={160} ry={90} fill="#E8B892" /><g transform="translate(10,-20)">{sucuk(3)}</g></g><Kopek x={1240} y={1000} s={1.1} t={t} kind="kara" sit={1} dir={-1} /></TCam>, html: tg("O KOCAMAN AVUÇ", T.orange) },
  { c: "Karabaş bu sefer bakmıyor", g: "01:50", tone: "gold", r: (t, a, b) => { const k = ramp(t, a + (b - a) * 0.3, a + (b - a) * 0.7); const took = k > 0.6; return <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[760, 860]}><rect width={1920} height={1080} fill="#3A2A20" /><rect y={860} width={1920} height={220} fill="#2A1E16" /><g transform="translate(700,820)"><ellipse rx={160} ry={90} fill="#E8B892" />{!took && <g transform="translate(10,-20)">{sucuk(3)}</g>}</g><Kopek x={lerp(1240, 900, k)} y={1000} s={1.1} t={t} kind="kara" sit={1} dir={-1} bite={took ? sucuk(2.2) : undefined} /></TCam>; }, html: q("YAVAŞÇA. ÇOK YAVAŞÇA.", 86, 0.5) },
  { c: "Barıştık, diyor", g: "01:50", sfx: "ding", tone: "gold", r: cam([1.8, 2], [640, 800], undefined, oda({ bF: { eyes: "happy", mouth: "grin", talk: true }, sen: "sit", dog: "knee" })), html: q("“BARIŞTIK.”", 120, 0.3) },
  { c: "Sonra bir şey istiyor", g: "01:52", tone: "night", r: cam([2.2, 2.4], [520, 600], undefined, oda({ bF: { eyes: "open", mouth: "flat", talk: true }, sen: "sit" })), html: tg("GİDEN BİRİNİN SON İSTEĞİ", T.purple) },
  { c: "Hakkınızı helal edin", g: "01:52", tone: "night", ...kartTxt("“HAKKINIZI", "HELAL EDİN.”", "#FFFFFF", "#F6C445", "#0A0D14") },
  { c: "Asya'ya bakıyor. Asya", g: "01:53", tone: "night", r: cam([1.6, 1.8], [1100, 700], undefined, oda({ bF: { eyes: "open", mouth: "flat", look: 1 }, sen: "sit", asya: "stand", asyF: { eyes: "closed", lookY: 1 } })) },
  { c: "Kızım. Sabah olunca", g: "01:53", tone: "warm", r: cam([2.2, 2.4], [520, 600], undefined, oda({ bF: { eyes: "squint", mouth: "smile", talk: true, look: 1 }, sen: "sit", asya: "stand" })), html: q("“BATIYA GİT. KARDEŞİNİ ARA. ARAYAN KAYBETMEZ.”", 66, 0.2) },
  { c: "Önce çayını iç ama", g: "01:54", sfx: "ding", tone: "gold", r: cam([2.4, 2.6], [520, 600], undefined, oda({ bF: { eyes: "happy", mouth: "smile", talk: true, look: 1 }, sen: "sit", asya: "stand" })), html: q("“ÖNCE ÇAYINI İÇ AMA. SONRA GİT.”", 90, 0.1) },
  { c: "Asya dizlerinin üstüne", g: "01:54", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[800, 820]}>{oda({ bF: { eyes: "squint", mouth: "smile" }, sen: "none", asya: "kneel", hand: true, asyF: { pose: KR, eyes: "closed" } })(t)}{tearOn(1020, 790, 0.9)(t)}</TCam>, html: q("ELİNİ ÖPÜYOR. VE ALNINA KOYUYOR.", 80, 0.5) },
  { c: "Defne defterini açıyor. Kırmızı", g: "01:56", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]}><rect width={1920} height={1080} fill="#3A2E26" /><Defter x={960} y={500} s={1.1} lines={["1. Gece dışarı yok", "2. Aptalca risk yok", "6. Önce kolu dene", "8. Gece kararı sabah"]} /><text x={960} y={900} textAnchor="middle" fontFamily="Patrick Hand" fontSize={70} fill="#E0393E">{"9. Bayram Dayı'nın hakkı helaldir".slice(0, Math.ceil(33 * ramp(t, a + 0.5, b - 0.3)))}</text></TCam> },
  { c: "Bayram Dayı okuyor", g: "01:57", tone: "gold", r: cam([2.4, 2.6], [520, 600], undefined, oda({ bF: { eyes: "squint", mouth: "grin", talk: true }, sen: "sit", def: "write" })), html: q("“KIRMIZIYLA YAZMIŞSIN. BEN KIRMIZIYI GÖRÜRÜM.”", 70, 0.2) },
  { c: "Su hâlâ uyuyor", g: "02:10", tone: "warm", r: cam([2.2, 2.4], [360, 900], undefined, oda({ bF: { eyes: "squint", mouth: "smile" }, sen: "sit" })), html: tg("SAPSARI MONTUN İÇİNDE", T.yellow) },
  { c: "Bayram Dayı uzanıyor", g: "02:10", tone: "warm", r: cam([2.2, 2.4], [400, 860], undefined, oda({ bF: { eyes: "squint", mouth: "smile", look: -1, lookY: 0.6 }, sen: "sit", hand: true })), html: q("SABAH ÖRDÜĞÜ SAÇI. UZUN UZUN.", 80, 0.4) },
  { c: "Ve sen, onun yanında", g: "02:30", tone: "night", r: cam([1.8, 2], [880, 680], undefined, oda({ bF: { eyes: "open", mouth: "flat" }, sen: "sit", sF: { talk: true } })), html: q("“NEDEN, DAYI? NEDEN O KAPIYI TUTTUN?”", 80, 0.3) },
  { c: "Bayram Dayı soru sormaz", g: "02:30", tone: "night", ...kartTxt("BAYRAM DAYI SORU SORMAZ.", "CEVAP DA VERMEZ. 117 GÜNDÜR.", "#FFFFFF", "#F6C445", "#0A0D14") },
  { c: "Ama bu gece, ilk kez", g: "02:31", sfx: "drone", tone: "night", r: cam([2.4, 2.6], [520, 600], undefined, oda({ bF: { eyes: "open", mouth: "smile" }, sen: "sit" })), html: q("İLK KEZ CEVAP VERİYOR.", 90, 0.3) },
  { c: "Bu kızın, diyor", g: "02:31", tone: "warm", r: cam([2, 2.2], [420, 760], undefined, oda({ bF: { eyes: "squint", mouth: "smile", talk: true, look: -1, lookY: 0.5 }, sen: "sit" })), html: q("“BU KIZIN… BİR ABİSİ YOKTU.”", 92, 0.2) },
  { c: "Sonra sana bakıyor. Artık var", g: "02:32", sfx: "ding", tone: "gold", r: cam([2.6, 2.8], [520, 600], undefined, oda({ bF: { eyes: "open", mouth: "smile", talk: true, look: 1 }, sen: "sit" })), html: q("“ARTIK VAR.”", 130, 0.3) },

  // ── 03:10 → 03:14 ──
  { c: "Saat üçü on.", g: "03:10", tone: "night", r: saat(3, 10), html: q("O TANIDIK AĞRI.", 90, 0.4, 900) },
  { c: "Kafanın içinde o tanıdık", g: "03:10", tone: "night", r: cam([2.4, 2.6], [880, 640], undefined, oda({ bF: { eyes: "open", mouth: "flat" }, sen: "sit", sF: { eyes: "squint", brow: "worried" } })), html: q("GÖZ KAPAKLARIN KURŞUN GİBİ.", 84, 0.5) },
  { c: "Hayır. Bu gece olmaz", g: "03:11", sfx: "boom", tone: "night", ...kartTxt("HAYIR.", "BU GECE OLMAZ.", "#E0393E", "#FFFFFF", "#0A0D14") },
  { c: "Ayağa kalkıyorsun. Yüzüne", g: "03:11", tone: "cool", r: cam([1.4, 1.5], [1100, 600], undefined, (t) => <SobaOda t={t}><g transform="translate(1000,150)"><rect width={380} height={330} fill="#0E1A34" opacity={0.0} /></g>{sen(t, 1190, 1, { pose: P.reach, mouth: "o", eyes: "wide", brow: "worried", dir: 1 })}<Kar t={t} k={0.8} wind={-2} n={60} /></SobaOda>), html: q("YÜZÜNE KAR. ÇİMDİK. PENCERE. −20 °C.", 76, 0.3) },
  { c: "Saat üçü on iki", g: "03:12", tone: "night", r: saat(3, 12) },
  { c: "Bayram Dayı elini tutuyor", g: "03:12", tone: "warm", r: cam([2.2, 2.4], [700, 640], undefined, oda({ bF: { eyes: "squint", mouth: "smile", talk: true }, sen: "sit", sF: { eyes: "squint" } })), html: q("“OTUR, EVLAT. UYU.”", 100, 0.2) },
  { c: "Uyursam", g: "03:12", tone: "night", r: cam([2.6, 2.8], [880, 600], undefined, oda({ bF: { eyes: "squint", mouth: "smile" }, sen: "sit", sF: { eyes: "squint", talk: true, brow: "worried" } })), html: q("“UYURSAM…”", 100, 0.1) },
  { c: "Uyursan ne olur", g: "03:12", sfx: "ding", tone: "gold", r: cam([2.4, 2.6], [520, 600], undefined, oda({ bF: { eyes: "happy", mouth: "smile", talk: true }, sen: "sit", sF: { eyes: "squint" } })), html: q("“SABAH OLUR. SABAH ÇAYI SEN KOYACAKSIN. İKİ BARDAK.”", 64, 0.3) },
  { c: "Saat üçü on üç", g: "03:13", tone: "night", r: cam([1.6, 1.8], [700, 640], undefined, oda({ bF: { eyes: "squint", mouth: "smile" }, sen: "lean" })), html: q("BAŞIN ONUN OMZUNA DÜŞÜYOR.", 84, 0.4) },
  { c: "Saat üçü on dört.", g: "03:14", sfx: "boom", tone: "night", r: saat(3, 14, "#0A0D14") },
  { c: "Gözlerin kapanıyor", g: "03:14", tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[680, 620]}>{oda({ bF: { eyes: "open", mouth: "smile" }, sen: "lean" })(t)}</TCam><rect width={1920} height={1080} fill="#000" opacity={ramp(t, a + 0.3, b) * 0.85} /></> },
  { c: "Ve bundan sonrasını", hud: false, tone: "night", ...kartTxt("BUNDAN SONRASINI,", "YİNE SEN GÖRMEYECEKSİN.", "#FFFFFF", "#9FD3EC", "#000000") },
  { c: "Defne uyanık. Her gece", hud: false, tone: "night", r: cam([2.2, 2.4], [1240, 560], undefined, oda({ bF: { eyes: "open", mouth: "smile" }, sen: "lean", def: "write", defF: { holdR: undefined, pose: P.stand, eyes: "open" } })), html: tg("03:14 · DEFNE'NİN GÖZÜNDEN", T.purple) },
  { c: "Bayram Dayı, omzunda", hud: false, tone: "warm", r: cam([2, 2.2], [620, 640], undefined, oda({ bF: { eyes: "open", mouth: "smile", look: 1, lookY: 0.4 }, sen: "lean" })), html: q("SOBANIN IŞIĞI YÜZÜNDE.", 80, 0.5) },
  { c: "Bir eli Su'nun saçında", hud: false, tone: "warm", r: cam([1.4, 1.5], [580, 860], undefined, oda({ bF: { eyes: "open", mouth: "smile" }, sen: "lean", hand: true, dog: "knee" })), html: q("KARABAŞ GÖZLERİNİ ONDAN AYIRMIYOR.", 72, 0.5) },
  { c: "Bayram Dayı, Defne'ye bakıyor", hud: false, tone: "night", r: cam([2.6, 2.8], [520, 580], undefined, oda({ bF: { eyes: "squint", mouth: "smile", talk: true, look: 1 }, sen: "lean" })), html: q("“ONA SÖYLE. SKORU ARTIK O TUTSUN.”", 86, 0.3) },
  { c: "Sonra gözleri sobanın", hud: false, tone: "warm", r: cam([1.8, 2], [1580, 640], undefined, oda({ sen: "lean" })) },
  { c: "Çay… soğumasın", hud: false, tone: "night", r: cam([3, 3.2], [520, 580], undefined, oda({ bF: { eyes: "squint", mouth: "smile", talk: true }, sen: "lean" })), html: q("“ÇAY… SOĞUMASIN.”", 110, 0.3) },
  { c: "Sobanın ateşi çıtırdıyor", hud: false, tone: "warm", r: cam([2, 2.2], [1560, 700], undefined, oda({ bF: { eyes: "closed", mouth: "smile", bob: 0 }, sen: "lean" })) },
  { c: "Ve Bayram Dayı'nın göğsü", hud: false, tone: "night", r: (t, a, b) => <><TCam t={t} a={a} b={b} z={[1.4, 1.2]} c0={[640, 720]}>{oda({ bF: { eyes: "closed", mouth: "smile", bob: 0 }, sen: "lean", breath: false })(t)}</TCam><rect width={1920} height={1080} fill="#000" opacity={ramp(t, b - 2, b)} /></> },

  // ── SABAH SONRASI ──
  { c: "Sabah.", hud: false, tone: "cool", ...kartTxt("SABAH.", undefined, "#FFFFFF", undefined, "#1A2030") },
  { c: "Gözlerini açıyorsun. Başın", hud: false, tone: "cool", r: cam([2.2, 2.4], [700, 640], undefined, oda({ night: 0, bF: { eyes: "closed", mouth: "smile", bob: 0 }, sen: "lean", sF: { eyes: "open" } })) },
  { c: "Ama omuz soğuk", hud: false, sfx: "drone", tone: "cool", ...kartTxt("AMA OMUZ SOĞUK.", undefined, "#9FD3EC", undefined, "#0E1424") },
  { c: "Defne karşında oturuyor", hud: false, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[1240, 560]}>{oda({ night: 0, bF: { eyes: "closed", mouth: "smile", bob: 0 }, sen: "lean", def: "write", defF: { pose: P.stand, holdR: undefined, eyes: "open", mouth: "frown" } })(t)}{tearOn(1240, 540, 1)(t)}</TCam>, html: q("YÜZÜ HER ŞEYİ SÖYLÜYOR.", 84, 0.5) },
  { c: "Karabaş yerinden kıpırdamamış", hud: false, tone: "cool", r: cam([2.2, 2.4], [700, 960], undefined, oda({ night: 0, bF: { eyes: "closed", mouth: "smile", bob: 0 }, sen: "none", dog: "knee" })) },
  { c: "Kalkıyorsun. Mutfağa", hud: false, tone: "cool", r: cam([1.2, 1.3], [620, 640], undefined, mut((t) => <>{sen(t, 820, 1, { dir: -1, mouth: "flat", eyes: "squint", brow: "worried" })}<Demlik x={330} y={622} s={0.6} t={t} /></>)) },
  { c: "Öğrettiği gibi. Su kaynayınca", hud: false, tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 560]}><rect width={1920} height={1080} fill="#6A4A34" /><Demlik x={960} y={820} s={1.6} t={t} /></TCam>, html: q("15 DAKİKA. TAVŞAN KANI.", 90, 0.3) },
  { c: "İnce belli iki bardak çıkarıyorsun", hud: false, tone: "warm", r: ucCay(0) },
  { c: "Sonra duruyorsun. Ve bir bardak", hud: false, tone: "warm", r: ucCay(0.5) },
  { c: "O bardağı kimse içmiyor", hud: false, tone: "cool", r: ucCay(1, 1), html: q("O BARDAĞI KİMSE İÇMİYOR.", 90, 0.5) },
  { c: "Öğleye doğru, koridordaki", hud: false, tone: "cool", r: cam([1, 1.06], [960, 600], undefined, (t) => koridor(t, <>{sen(t, 700, 1, { pose: P.reach, mouth: "flat", brow: "worried" })}{defm(t, 1500, 1, { pose: P.reach, mouth: "flat", dir: -1 })}</>)), html: tg("İLK GÜN SÖKTÜĞÜ KAPI", T.orange) },
  { c: "Su'nun camdaki yazısı", hud: false, sfx: "drone", tone: "night", r: buz("KAPI", "full", 0), html: q("SU'NUN CAMDAKİ YAZISI BUYMUŞ. KAPI.", 76, 0.3, 900) },
  { c: "Onu bu kapının üstüne", hud: false, tone: "cool", r: cam([1.6, 1.8], [960, 700], undefined, (t) => <><rect width={1920} height={1080} fill="#B89A72" /><rect y={900} width={1920} height={180} fill="#8A6A4A" /><KapiSedye x={960} y={880} s={1.4} body={yatF(BAYK, t, 300, -50, 0.8, { bob: 0 })} /></>), html: tg("BELİNDE KIRK YILLIK KİSPETİ", T.orange) },
  { c: "Toprak donmuş", hud: false, tone: "cool", r: cam([1, 1.06], [960, 560], undefined, (t) => <VanGolu t={t} mode="day" />), html: q("TOPRAK DONMUŞ. GÖLÜN KIYISINDA, TAŞLARDAN BİR MEZAR.", 64, 0.3) },
  { c: "Kapının önünü sen tutuyorsun", hud: false, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}>{sedye(t, a, b, { x0: 1250, x1: 1050 })}</TCam>, html: q("ÜÇ KİŞİ BİLE ZOR TAŞIYOR.", 80, 0.5) },
  { c: "Ve ilk adımı atarken", hud: false, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.35]} c0={[700, 700]}>{sedye(t, a, b, { x0: 1050, x1: 950 })}</TCam> },
  { c: "Bir. İki. Üç.", hud: false, sfx: "tick", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.04]}>{sedye(t, a, b, { x0: 950, x1: 760 })}</TCam>, html: sayac3() },
  { c: "Bir sıfır, dayı", hud: false, sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[480, 520]}>{sedye(t, a - 4, b - 4, { x0: 950, x1: 760 })}{tearOn(480, 470, 1)(t)}</TCam>, html: q("“BİR SIFIR, DAYI. İLK KEZ BEN KAZANDIM.”", 80, 0.1) },
  { c: "Ama içinden biliyorsun", hud: false, tone: "gold", ...kartTxt("O GÜREŞİ SEN KAZANMADIN.", "O SANA BIRAKTI.", "#FFFFFF", "#F6C445", "#3A2414") },
  { c: "Gölün kıyısında taşları", hud: false, tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{mezar(0.3 + ramp(t, a, b) * 0.6, 0, (t2) => <>{su(t2, 600, SS, { pose: P.hold, mouth: "flat", holdR: <ellipse rx={40} ry={28} fill="#8E9AA6" stroke="#4A5460" strokeWidth={4} /> })}{sen(t2, 1400, 1, { pose: P.hold, mouth: "flat", dir: -1 })}</>)(t)}</TCam>, html: q("SU HİÇ AĞLAMADI. SADECE TAŞ TAŞIYOR.", 74, 0.4) },
  { c: "En üste düz bir taş", hud: false, tone: "cool", r: (t, a, b) => <TasYakin t={t} lines={["BAYRAM", "██.██.1953", "03.14"]} carve={ramp(t, a + 0.3, a + (b - a) * 0.7)} hl={2} /> },
  { c: "Kazırken bir şey fark", hud: false, tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><rect width={1920} height={1080} fill="#1A2030" /><Bileklik x={960} y={560} s={1.2} k={1} /></TCam>, html: q("TARİHİN GÜNÜ VE AYI: AYNI.", 84, 0.5, 900) },
  { c: "Defne'ninki de", hud: false, tone: "night", r: cam([1.4, 1.5], [960, 640], undefined, mezar(1, 1, (t) => <>{defm(t, 700, 1, { mouth: "o", eyes: "wide", brow: "worried" })}{su(t, 1250, SS, { mouth: "none", eyes: "wide", dir: -1 })}</>)), html: q("DEFNE'NİNKİ DE. SU'NUNKİ DE.", 84, 0.3) },
  { c: "Asya taşa uzun uzun", hud: false, tone: "night", r: cam([2.4, 2.6], [1500, 560], undefined, mezar(1, 1, (t) => asy(t, 1500, 1, { dir: -1, mouth: "flat", talk: true, brow: "worried" }))), html: q("“BENİMKİ DE.”", 110, 0.5) },
  { c: "Hepiniz aynı gün doğmuşsunuz", hud: false, sfx: "boom", tone: "night", r: kart("#070A12"), html: (t, a, b) => <><Txt t={t} at={a + 0.2} text="FARKLI YILLAR." y={240} size={76} color="#FFFFFF" />{["AYNI GÜN.", "AYNI SAAT.", "AYNI DAKİKA."].map((l, i) => <Txt key={l} t={t} at={a + (b - a) * (0.2 + i * 0.15)} text={l} y={380 + i * 120} size={92} color="#F6C445" />)}<Txt t={t} at={a + (b - a) * 0.75} text="DÜNYA SUSTUĞUNDA, SADECE SİZ KALDINIZ." y={900} size={62} color="#2EE6D0" /></> },
  { c: "Defne'ye bakıyorsun. Ve bir şey", hud: false, tone: "cool", r: cam([1.2, 1.3], [960, 640], undefined, mezar(1, 1, (t) => <>{sen(t, 560, 1, { mouth: "flat", talk: true, brow: "worried" })}{defm(t, 1380, 1, { dir: -1, mouth: "flat", brow: "worried" })}{asy(t, 1560, 1, { dir: -1, mouth: "flat", brow: "worried" })}{su(t, 1720, SS, { dir: -1, mouth: "none" })}</>)), html: q("“MERHUMU NASIL BİLİRDİNİZ?”", 96, 0.5) },
  { c: "Dünyada bu soruya", hud: false, tone: "cool", ...kartTxt("ÜÇ KİŞİ KALDI.", "VE BİR KÖPEK.", "#FFFFFF", "#F6C445", "#1A2030") },
  { c: "İyi biliriz, diyor Defne", hud: false, tone: "warm", r: cam([2.4, 2.6], [1380, 520], undefined, mezar(1, 1, (t) => defm(t, 1380, 1, { dir: -1, mouth: "flat", talk: true, eyes: "closed", brow: "worried" }))), html: q("“İYİ BİLİRİZ.”", 110, 0.1) },
  { c: "İyi biliriz, diyor Asya", hud: false, tone: "warm", r: cam([2.4, 2.6], [1560, 520], undefined, mezar(1, 1, (t) => asy(t, 1560, 1, { dir: -1, mouth: "flat", talk: true, eyes: "closed", brow: "worried" }))), html: q("“İYİ BİLİRİZ.”", 110, 0.1) },
  { c: "Karabaş havlıyor", hud: false, sfx: "pop", tone: "warm", r: cam([2.2, 2.4], [960, 900], undefined, mezar(1, 1, (t) => <Kopek x={960} y={1010} s={0.7} t={t} kind="kara" sit={1} bark={1} />)), html: q("HAV.", 120, 0.3) },
  { c: "Ve bir ses daha geliyor", hud: false, sfx: "drone", tone: "cool", r: cam([1.2, 1.3], [1300, 700], undefined, mezar(1, 1, (t) => <>{sen(t, 1450, 1, { dir: -1, mouth: "flat", brow: "worried", look: 1 })}{su(t, 1720, SS, { dir: -1, mouth: "none" })}</>)) },
  { c: "Yüz on yedi gündür tek", hud: false, tone: "gold", ...kartTxt("117 GÜNDÜR TEK KELİME ETMEYEN BİR KIZ…", "İLK KEZ KONUŞUYOR.", "#FFFFFF", "#F6C445", "#1A2030") },
  { c: "İyi biliriz… dede", hud: false, sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[3, 3.3]} c0={[1720, 780]}>{mezar(1, 1, (t2) => su(t2, 1720, SS, { dir: -1, mouth: "smile", talk: true, eyes: "squint" }))(t)}{tearOn(1720, 740, 0.7)(t)}</TCam>, html: q("“İYİ BİLİRİZ… DEDE.”", 110, 0.2) },
  { c: "Sonra elini uzatıyor", hud: false, tone: "gold", r: cam([1.8, 2], [1580, 760], undefined, mezar(1, 1, (t) => <>{sen(t, 1500, 1, { dir: -1, mouth: "smile", brow: "worried", pose: P.stand })}{su(t, 1640, SS, { dir: -1, mouth: "smile", pose: P.reach })}</>)), html: q("ABİSİNİN ELİNİ.", 96, 0.5) },
  { c: "Akşamüstü, Asya'yı", hud: false, tone: "warm", r: bahce((t) => <>{asy(t, 900, 1, { mouth: "smile", brow: "worried", holdR: <rect x={-14} y={-60} width={28} height={70} rx={8} fill="#8E2F55" /> })}{sen(t, 1300, 1, { dir: -1, mouth: "flat" })}{defm(t, 1460, 1, { dir: -1, mouth: "flat" })}{su(t, 1600, SS, { dir: -1, mouth: "none" })}</>, "dusk"), html: q("“ÖNCE ÇAYIMI İÇTİM.”", 96, 0.5) },
  { c: "Önce çayımı içtim", hud: false, tone: "warm", r: (t, a, b) => { const k = ramp(t, a, b); return <TCam t={t} a={a} b={b} z={[1, 1.04]}>{sokak("dusk", { fall: 0.4 })(t)}{walk(t, a + 0.3, b + 6, ASYA, 900, 200, lerp(1, 0.55, k), { mouth: "flat", dir: -1 }, lerp(G, 880, k))}{sen(t, 1300, 1, { dir: -1, mouth: "flat" })}{defm(t, 1460, 1, { dir: -1, mouth: "flat" })}{su(t, 1600, SS, { dir: -1, mouth: "none" })}</TCam>; }, html: q("BATIYA. BİR KERE BİLE ARKASINA BAKMIYOR.", 72, 0.4) },
  { c: "O akşam güneş batarken", hud: false, tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}><Mutfak t={t} night={0} candle={0} /><rect width={1920} height={1080} fill="#F28C28" opacity={0.12} />{walk(t, a + 0.3, b, SU, 1000, 1400, SS, { eyes: "open", mouth: "none", pose: P.hand })}</TCam>, html: tg("BU SEFER UYURGEZER DEĞİL · GÖZLERİ AÇIK", T.yellow) },
  { c: "Bu sefer nokta yok", hud: false, tone: "gold", r: (t, a, b) => <CamYazi t={t} text="DEDE" heart k={ramp(t, a + 0.3, b)} /> },
  { c: "DEDE.", hud: false, sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.08]}><CamYazi t={t} text="DEDE" heart k={1} /></TCam> },
  { c: "Kafanın içi sessizleşiyor. Gece", hud: false, tone: "night", ...kartTxt("GECE OLAN SEN UYANIYOR.", "VE HİÇBİR ŞEY DÜŞÜNMEK İSTEMİYOR.", "#2EE6D0", "#FFFFFF", "#070A12") },
  { c: "Sobanın önüne oturuyorsun", hud: false, tone: "warm", r: cam([1, 1.06], [900, 760], undefined, (t) => <SobaOda t={t}>{otur(sen, t, 760, 960, 1, { mouth: "flat", eyes: "squint" })}{otur(def, t, 540, 960, 1, { mouth: "flat", eyes: "squint" })}{otur(su, t, 980, 990, SS, { mouth: "none", dir: -1 })}<Kopek x={820} y={1060} s={0.6} t={t} kind="kara" sleep={1} dir={-1} /></SobaOda>) },
  { c: "Ve iki bardak çay koyuyorsun", hud: false, tone: "gold", r: ikiCay(0) },
  { c: "Çünkü çay, iki kişilik", hud: false, sfx: "ding", tone: "gold", r: cam([1.3, 1.2], [960, 640], undefined, (t) => <SobaOda t={t}>{otur(sen, t, 760, 960, 1, { mouth: "smile", eyes: "squint", holdR: cay(0.4) })}{otur(def, t, 540, 960, 1, { mouth: "smile", eyes: "squint", holdR: cay(0.4) })}{otur(su, t, 980, 990, SS, { mouth: "none", dir: -1 })}<Kopek x={820} y={1060} s={0.6} t={t} kind="kara" sleep={1} dir={-1} /></SobaOda>), html: q("ÇÜNKÜ ÇAY, İKİ KİŞİLİK İÇİLİR.", 92, 0.3) },

  // ── KAPANIŞ ──
  { c: "Dünyada Son İki Kişi burada", hud: false, tone: "cool", r: kart("#0E1A2E"), html: (t, a) => <><Txt t={t} at={a + 0.2} text="DÜNYADA SON İKİ KİŞİ" y={240} size={86} color="#FFFFFF" />{svg(<Seri t={t} a={a + 0.4} on={5} />)}<Txt t={t} at={a + 2} text="“DEVAM” YAZDIĞINIZ HER YORUM İÇİN: TEŞEKKÜRLER." y={840} size={56} color="#F6C445" /></> },
  { c: "Bu seriyi günlerce", hud: false, tone: "gold", ...kartTxt("HER İPUCU, HER KURAL, HER MORS HARFİ.", "VE YORUMLARINIZIN HEPSİ.", "#FFFFFF", "#F6C445", "#101828") },
  { c: "Bundan sonra bu kanalda", hud: false, tone: "cool", r: kart("#0E1A2E"), html: (t, a, b) => <><Txt t={t} at={a + 0.2} text="HER BÖLÜM: AYRI BİR HİKÂYE." y={300} size={84} color="#FFFFFF" /><Txt t={t} at={a + (b - a) * 0.35} text="YENİ KONULAR. YENİ KARAKTERLER." y={440} size={72} color="#2EE6D0" /><Txt t={t} at={a + (b - a) * 0.65} text="AMA SEN, YİNE ORADASIN." y={600} size={86} color="#F6C445" /></> },
  { c: "Abone ol. Bir sonraki", hud: false, tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]}>{mezar(1, 1, () => null, "dusk")(t)}</TCam>, html: (t, a) => <><Txt t={t} at={a + 0.2} text="BİR SONRAKİ HİKÂYEDE GÖRÜŞÜRÜZ." y={130} size={70} color="#FFFFFF" /><Abone t={t} at={a + 0.8} /></> },
  { c: "Ve Bayram Dayı'yı sevdiysen", hud: false, sfx: "ding", tone: "gold", r: cam([1.6, 1.8], [960, 600], undefined, mezar(1, 1, (t) => <Kopek x={1180} y={940} s={0.6} t={t} kind="kara" sleep={1} dir={-1} />, "dusk")), html: q("BİR BEĞENİ BIRAK. ONUN İÇİN. 🤍", 84, 0.2, 140) },
];


// uzun çekim (>8 sn): ~4-5 sn'de bir hafif açı değişimi (kesme hissi, yeni cue gerekmez)
const SUB: [number, number, number][] = [[1, 0, 0], [1.14, -70, -24], [1.2, 80, 20], [1.1, 0, 36]];
const subCut = (t: number, a: number, b: number) => { const L = b - a; if (L <= 8) return undefined; const n = Math.ceil(L / 4.6); const k = Math.min(n - 1, Math.floor(((t - a) / L) * n)); if (k === 0) return undefined; const [z, dx, dy] = SUB[1 + ((k - 1) % 3)]; return `translate(${960 + dx} ${540 + dy}) scale(${z}) translate(-960 -540)`; };
type Timed = Sh & { from: number; to: number; clk: string };
export const TIMED: Timed[] = (() => {
  let after = 0, clk = "";
  const raw = SHOTS.map((s, i) => {
    const from = i === 0 ? 0 : cue(s.c, after) - 0.12;
    after = from + 0.2;
    if (s.g !== undefined) clk = s.g;
    return { ...s, from, to: 0, clk };
  });
  raw.forEach((s, i) => (s.to = i + 1 < raw.length ? raw[i + 1].from : K2R_20_SECONDS));
  return raw;
})();

const VOL: Record<string, number> = { drone: 0.07, boom: 0.08, ding: 0.07, knock: 0.07, pop: 0.06, boing: 0.06, tick: 0.05, static: 0.05 };
export const K2RVideo20: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const t = frame / fps;
  let n = 0;
  for (let i = 0; i < TIMED.length; i++) if (t >= TIMED[i].from) n = i;
  const s = TIMED[n];
  const END = K2R_20_SECONDS;
  const showHud = s.hud !== false && s.g !== undefined;
  return (
    <AbsoluteFill style={{ background: "#000" }}>
      <AbsoluteFill style={{ opacity: ramp(t, 0, 0.5) * (1 - ramp(t, END - 1.2, END)) }}>
        <TFrame>
          <LiveCam t={t} a={s.from} punch={0.04}><g transform={subCut(t, s.from, s.to)}>{s.r(t, s.from, s.to)}</g></LiveCam>
          <Atmos t={t} tone={s.tone ?? "warm"} rays={s.tone === "night" ? 0.3 : 0.6} seed={n} />
          {s.tone === "gold" && <Sweep t={t} a={s.from} />}
          {showHud && <SaatHUD t={t} clk={s.clk} />}
        </TFrame>
        {s.html?.(t, s.from, s.to)}
      </AbsoluteFill>
      <Audio src={staticFile("audio/k2r-20.wav")} />
      {TIMED.map((x, i) => x.sfx && (
        <Sequence key={i} from={Math.max(0, Math.round((x.from + 0.05) * fps))} durationInFrames={Math.round(2.2 * fps)} layout="none">
          <Audio src={staticFile(`sfx/${x.sfx}.wav`)} volume={VOL[x.sfx] ?? 0.05} />
        </Sequence>
      ))}
    </AbsoluteFill>
  );
};

