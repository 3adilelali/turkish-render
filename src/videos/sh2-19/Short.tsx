import words from "../../../public/data/sh2-19-words.json";
import { HERO, Outfit, P, TCam, TFig, TPose, lerp } from "../../components/Toon";
import { Saat } from "../../components/K2Dikey2";
import { Kar, KarYol } from "../../components/K2Dikey3";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #19 · «Kar Fırtınasında Arabada Mahsur Kalsan?» (النوع ج، توعية)
// السكربت والمصادر: السكربتات/sh2-19-kar.txt (ابقَ بالسيارة، المحرك ≈10 د بالساعة، نظّف العادم من التلج: CO)

const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#E0393E", top2: "#B3182B", hair: "cap", hairColor: "#3A7BD5" };
const TQ = "#2EE6D0";
const KOL: TPose = { l: [120, 160], r: [-40, 60] };
// yandan araba: snow kar yığını (0..1), cloth anten bezi, window cam aralığı, smoke egzoz dumanı
const Araba = ({ t, snow = 0.5, cloth = 0, window = 0, smoke = 0, block = 0, inside, spin = 0 }: { t: number; snow?: number; cloth?: number; window?: number; smoke?: number; block?: number; inside?: React.ReactNode; spin?: number }) => (
  <g transform={`translate(${Math.sin(t * 50) * spin * 4},0)`}>
    <path d="M660,880 V780 Q660,740 700,730 L790,720 L860,630 Q880,610 920,610 H1080 Q1110,610 1130,630 L1200,720 L1250,730 Q1270,740 1270,780 V880Z" fill="#3A7BD5" stroke="#1E4A8A" strokeWidth={8} />
    <path d="M880,640 H1000 V720 H820Z" fill="#14203A" /><path d="M1020,640 H1110 L1170,720 H1020Z" fill="#14203A" />
    {inside}
    <rect x={1020} y={640} width={150 * window} height={14} fill="#9FD3F0" opacity={0.6} />
    <rect x={1000} y={630} width={20} height={250} fill="#1E4A8A" />
    <circle cx={780} cy={890} r={64} fill="#2A2E36" /><circle cx={780} cy={890} r={28} fill="#9AA3A8" /><circle cx={1150} cy={890} r={64} fill="#2A2E36" /><circle cx={1150} cy={890} r={28} fill="#9AA3A8" />
    <rect x={1240} y={760} width={30} height={20} fill="#FFE27A" /><rect x={660} y={760} width={22} height={24} fill="#E0393E" />
    {/* egzoz */}
    <rect x={640} y={856} width={40} height={18} rx={6} fill="#5E666C" />
    {smoke > 0 && [0, 1, 2, 3].map((i) => { const o = (t * 0.7 + i / 4) % 1; return <circle key={i} cx={630 - o * 40} cy={860 - o * 30 * (1 - block) + o * block * 0} r={20 + o * 50} fill="#8A8F96" opacity={smoke * (1 - o) * 0.7} transform={block ? `translate(${o * 160},${-o * 120})` : undefined} />; })}
    {/* anten */}
    <path d="M1090,612 L1110,430" stroke="#2A2E36" strokeWidth={6} />
    {cloth > 0 && <path d={`M1110,440 Q${1170 + Math.sin(t * 9) * 16},${430 + Math.cos(t * 7) * 10} ${1220 + Math.sin(t * 8) * 20},${450 + Math.sin(t * 11) * 14} L1108,490Z`} fill="#E0393E" opacity={cloth} />}
    {/* kar */}
    <path d={`M600,900 Q700,${880 - snow * 120} 800,${900 - snow * 60} T1000,${900 - snow * 50} T1300,${900 - snow * 110} V1080 H600Z`} fill="#F4F8FB" />
    <path d={`M800,${616 - snow * 4} Q960,${600 - snow * 30} 1110,${616 - snow * 4}`} stroke="#FFFFFF" strokeWidth={14 + snow * 20} fill="none" strokeLinecap="round" />
  </g>
);
const sahne = (t: number, o: Partial<Parameters<typeof Araba>[0]> = {}, night = 1, snow = 1) => <g><KarYol t={t} snow={snow} depth={0.6} night={night} /><Araba t={t} {...o} />{snow > 0 && <Kar t={t} k={snow * 0.8} />}</g>;
const icerde = (t: number, f: Partial<React.ComponentProps<typeof TFig>> = {}) => <g><clipPath id="arabaIc"><path d="M880,640 H1000 V720 H820Z" /></clipPath><g clipPath="url(#arabaIc)"><TFig x={930} y={900} s={0.34} o={SEN} t={t} seed={4} {...f} /></g></g>;
const kural = (t: number, at: number, n: string) => <g opacity={ramp(t, at, at + 0.25)}><circle cx={960} cy={400} r={150} fill="#F6C445" /><text x={960} y={460} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={180} fill="#0B1426">{n}</text></g>;
const Kurtarici = ({ t, k }: { t: number; k: number }) => (
  <g transform={`translate(${lerp(-200, 380, k)},0)`} opacity={k}>
    <rect x={260} y={760} width={300} height={130} rx={14} fill="#F28C28" /><rect x={480} y={700} width={80} height={70} fill="#F28C28" />
    <rect x={500} y={680} width={40} height={20} fill={Math.sin(t * 14) > 0 ? "#FFB84A" : "#E0393E"} />
    <circle cx={500} cy={690} r={110} fill="#FFB84A" opacity={0.25 + 0.2 * Math.sin(t * 14)} />
    <circle cx={320} cy={900} r={40} fill="#2A2E36" /><circle cx={500} cy={900} r={40} fill="#2A2E36" />
  </g>
);
const KURALLAR = ["1 · ARABADA KAL", "2 · 10 DK / SAAT", "3 · GÖRÜNÜR OL", "4 · HAREKET ET"];

export const { SECONDS: SH2_19_SECONDS, Comp: Sh2Short19 } = makeShort2({
  words: words as W[],
  audio: "sh2-19",
  hook: "KARDA MAHSUR KALSAN?",
  hookUntil: 3,
  build: (cue) => {
    const tGon = cue("sevdiklerine");
    const tUyu = cue("Uyutur");
    const S: Sh[] = [
      { c: "Kar", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.2]} c0={[960, 720]}>{sahne(t, { snow: 0.5 })}</TCam> },
      { c: "Gece", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 560]}>{sahne(t, { snow: 0.5 })}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.1} text="GECE 🌙" y={330} /> },
      { c: "Yol kapandı", sfx: "boom", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 620]}>{sahne(t, { snow: 0.8 })}</TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.2} text="YOL KAPANDI" y={330} c="#E0393E" rot={-5} /> },
      { c: "Araba ilerlemiyor", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 1.9]} c0={[960, 820]} shake={3}>{sahne(t, { snow: 0.8, spin: 1 })}</TCam> },
      { c: "Dışarısı", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 640]}>{sahne(t, { snow: 1 })}<rect width={1920} height={1080} fill="#FFFFFF" opacity={0.5 * ramp(t, a, b)} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.5} text="BEMBEYAZ" y={330} /> },
      { c: "İlk kural", sfx: "ding", tone: "gold", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" />{kural(t, a, "1")}</g>,
        html: (t, a) => <VT t={t} at={a + 0.8} text="ARABADAN UZAKLAŞMA" y={1040} c={TQ} size={76} /> },
      { c: "Araba, fırtınada", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.4, 2.6]} c0={[930, 680]}>{sahne(t, { snow: 1, inside: icerde(t, { pose: P.hold, mouth: "flat", brow: "worried" }) })}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.6} text="EN İYİ SIĞINAK 🛡" y={330} size={84} /> },
      { c: "Ve kurtarıcılar", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.05]} c0={[960, 640]}>{sahne(t, { snow: 1 })}<Kurtarici t={t} k={ramp(t, a + 0.3, b)} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1} text="ARABA KOLAY BULUNUR" y={330} size={80} /> },
      { c: "İkinci kural", sfx: "ding", tone: "gold", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" />{kural(t, a, "2")}</g>,
        html: (t, a) => <VT t={t} at={a + 0.8} text="MOTOR SÜREKLİ ÇALIŞMASIN" y={1040} c={TQ} size={68} /> },
      { c: "Saatte", sfx: "tick", tone: "cool", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Saat y={500} s={1.05} h={(10 / 60) * ramp(t, a + 0.3, a + 2)} label="10 DK / SAAT" /></g> },
      { c: "Ama önce", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[700, 840]}>{sahne(t, { snow: lerp(1, 0.3, ramp(t, a + 0.8, b)) })}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="ÖNCE EGZOZ! 🔍" y={330} c="#F6C445" /> },
      { c: "Kar egzozu", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.7, 1.9]} c0={[860, 760]}>{sahne(t, { snow: 1, smoke: 1, block: 1 })}</TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.6} text="KARBONMONOKSİT" y={330} c="#E0393E" rot={-4} size={80} /> },
      { c: "Kokusu", sfx: "boom", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.6, 2.8]} c0={[930, 680]}>{sahne(t, { snow: 1, smoke: 1, block: 1, inside: icerde(t, { eyes: t > tUyu ? "closed" : "squint", mouth: "flat" }) })}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.1} text="KOKUSUZ" y={330} /><Damga t={t} at={tUyu} text="UYUTUR ⚠️" y={1040} c="#E0393E" rot={-5} /></> },
      { c: "Çalıştırırken", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.2, 2.4]} c0={[1080, 680]}>{sahne(t, { snow: 0.6, window: ramp(t, a + 0.5, a + 1.3) * 0.3 })}</TCam>,
        html: (t, a) => <VT t={t} at={a + 1} text="CAMI BİRAZ ARALA" y={330} c={TQ} size={84} /> },
      { c: "Üçüncü kural", sfx: "ding", tone: "gold", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" />{kural(t, a, "3")}</g>,
        html: (t, a) => <VT t={t} at={a + 0.8} text="GÖRÜNÜR OL" y={1040} c={TQ} size={96} /> },
      { c: "Antene", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 1.6]} c0={[1110, 500]} c1={[1040, 640]}>{sahne(t, { snow: 1, cloth: ramp(t, a + 0.3, a + 0.8) })}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.8} text="RENKLİ BEZ BAĞLA 🚩" y={1040} size={80} /> },
      { c: "Dördüncü", sfx: "ding", tone: "gold", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" />{kural(t, a, "4")}</g>,
        html: (t, a) => <VT t={t} at={a + 0.8} text="HAREKET ET" y={1040} c={TQ} size={96} /> },
      { c: "Kollarını", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2.8, 3]} c0={[920, 680]}>{sahne(t, { snow: 1, cloth: 1, inside: icerde(t, { pose: Math.sin(t * 6) > 0 ? KOL : P.cheer, mouth: "grin" }) })}</TCam>,
        html: (t, a) => <VT t={t} at={a + 1.2} text="KAN DOLAŞSIN ❤️" y={330} /> },
      { c: "Ve sabah", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1]} c0={[960, 600]}><KarYol t={t} snow={0} depth={0.6} night={0} /><circle cx={1150} cy={200} r={80} fill="#FFE27A" /><Araba t={t} snow={1} cloth={1} /><Kurtarici t={t} k={ramp(t, a + 0.5, b)} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="SABAH ☀️ BULUNDUN" y={330} size={84} /> },
      { c: "Bunu kış", sfx: "ding", tone: "gold", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" />{KURALLAR.map((s, i) => <g key={s} opacity={ramp(t, a + i * 0.25, a + i * 0.25 + 0.2)}><rect x={680} y={170 + i * 170} width={560} height={130} rx={24} fill={["#E0393E", "#F6C445", TQ, "#7E5BD6"][i]} /><text x={960} y={255 + i * 170} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={52} fill="#0B1426">{s}</text></g>)}</g>,
        html: (t, a) => <>{t > tGon && <VT t={t} at={tGon} text="SEVDİKLERİNE GÖNDER ↗" y={1060} size={70} c="#F6C445" />}</> },
    ];
    return S;
  },
});
