import words from "../../../public/data/sh2-08-words.json";
import { DAD, HERO, Living, MOM, Outfit, P, PhoneP, TCam, TFig, lerp } from "../../components/Toon";
import { Buzdolabi } from "../../components/Yuk";
import { GeceSehir, Kabin, Saat } from "../../components/K2Dikey2";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sayi, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #8 · «İstanbul'da 24 Saat Elektrik Kesilse?» (النوع ج، 84/100)
// السكربت والمصادر: السكربتات/sh2-08-elektrik.txt (USDA: البرّاد المسكّر ~4 ساعات)

const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#1FC8B4", top2: "#159A8B" };
const TEYZE: Outfit = { ...MOM, top: "#7E5BD6", top2: "#5E3FB0", hairColor: "#C9B8E8" };
const G = 1000;
const karanlik = (o: number) => <rect width={1920} height={1080} fill="#060A12" opacity={o} />;
// telefon ışığı
const fener = (x: number, y: number) => <path d={`M${x},${y} L${x - 160},${y - 420} L${x + 160},${y - 420}Z`} fill="#FFF7D0" opacity={0.25} />;
// merdiven
const merdiven = (t: number) => (
  <g>
    <rect width={1920} height={1080} fill="#3A4048" />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={560 + i * 70} y={1000 - i * 60} width={800} height={60} fill={i % 2 ? "#5E666C" : "#6E777D"} />)}
    <path d="M560,880 L1400,160" stroke="#9AA3A8" strokeWidth={12} />
    <rect x={1120} y={120} width={130} height={60} rx={8} fill="#141414" /><text x={1185} y={164} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={36} fill="#F6C445">KAT 3</text>
    {karanlik(0.35 + 0.05 * Math.sin(t * 3))}
  </g>
);
// musluk
const Musluk = ({ t, flow }: { t: number; flow: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#DDE6EA" />
    <rect x={600} y={760} width={720} height={320} fill="#C9D2D8" /><ellipse cx={960} cy={780} rx={300} ry={50} fill="#9AA3A8" />
    <path d="M780,300 H1040 Q1100,300 1100,360 V440" stroke="#B9C2C9" strokeWidth={60} fill="none" strokeLinecap="round" />
    <rect x={820} y={230} width={60} height={90} rx={10} fill="#E0393E" />
    {flow > 0.02 && <rect x={1085} y={470} width={30} height={300 * flow} rx={14} fill="#5FB6E8" opacity={0.85} />}
    {flow <= 0.02 && <circle cx={1100} cy={480 + ((t * 300) % 280)} r={10} fill="#5FB6E8" opacity={((t * 300) % 280) < 200 ? 1 : 0} />}
  </g>
);
// bina + hidrofor
const Pompa = ({ t, k }: { t: number; k: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#BFE3F2" />
    <rect x={780} y={120} width={360} height={900} fill="#E8D8BE" stroke="#8E7A5A" strokeWidth={6} />
    {Array.from({ length: 12 }, (_, i) => <rect key={i} x={820 + (i % 3) * 100} y={160 + Math.floor(i / 3) * 200} width={70} height={90} fill="#8FB4C8" />)}
    <rect x={1150} y={940} width={110} height={80} rx={10} fill="#3A7BD5" /><circle cx={1205} cy={980} r={22} fill="#2A5CA0" transform={`rotate(${t * 400 * k},1205,980)`} />
    <rect x={1160} y={150} width={24} height={790} fill="#9AA3A8" />
    <rect x={1164} y={lerp(940, 150, k)} width={16} height={lerp(0, 790, k)} fill="#5FB6E8" />
    <text x={1205} y={1060} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={28} fill="#2A5CA0">POMPA</text>
  </g>
);
// baz istasyonu + akü
const Baz = ({ t, bat }: { t: number; bat: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#14294A" />
    <path d="M960,160 L860,1000 M960,160 L1060,1000 M900,560 H1020 M880,760 H1040" stroke="#9AA3A8" strokeWidth={12} />
    <rect x={930} y={140} width={60} height={110} fill="#C9CDD0" />
    {bat > 0.05 && [1, 2, 3].map((i) => <path key={i} d={`M${960 - i * 50},${190 - i * 30} q${i * 50},${-i * 40} ${i * 100},0`} stroke="#2EE6D0" strokeWidth={8} fill="none" opacity={bat * (0.5 + 0.5 * Math.sin(t * 6 - i))} />)}
    <g transform="translate(960,880)"><rect x={-130} y={-60} width={240} height={120} rx={14} fill="none" stroke="#FFFFFF" strokeWidth={10} /><rect x={110} y={-22} width={24} height={44} fill="#FFFFFF" />
      <rect x={-118} y={-48} width={216 * bat} height={96} rx={6} fill={bat > 0.3 ? "#3FAE6A" : "#E0393E"} /></g>
  </g>
);
const bars = (n: number) => <g transform="translate(960,720)">{[0, 1, 2, 3].map((i) => <rect key={i} x={-90 + i * 50} y={-40 - i * 40} width={34} height={40 + i * 40} rx={6} fill={i < n ? "#2EE6D0" : "#3A4048"} />)}</g>;

export const { SECONDS: SH2_08_SECONDS, Comp: Sh2Short08 } = makeShort2({
  words: words as W[],
  audio: "sh2-08",
  hook: "24 SAAT ELEKTRİK KESİLSE?",
  hookUntil: 4.3,
  build: (cue) => {
    const tCek = cue("Sonra çekmez");
    const tYil = cue("Ve gökyüzünde");
    const tYor = cue("Yorumlara");
    const S: Sh[] = [
      // 0 · soru
      { c: "İstanbul'da", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.15]} c0={[960, 600]}><GeceSehir t={t} off={Math.sin(t * 9) > 0.6 ? 0.6 : 0} /></TCam> },
      { c: "Akşam sekiz", sfx: "tick", tone: "night", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Saat y={500} s={1.05} h={8 - (1 - ramp(t, a, a + 0.8)) * 0.3} label="20:00" /></g> },
      { c: "Işıklar", sfx: "static", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 600]}><GeceSehir t={t} off={ramp(t, a + 0.3, a + 1.1)} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.9} text="KARANLIK" y={1040} c="#FFFFFF" rot={-4} /> },
      { c: "Herkes", sfx: "whoosh", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[960, 660]}><Living t={t} />{karanlik(0.6)}{fener(1040, 640)}<TFig x={960} y={G} s={0.9} o={SEN} t={t} pose={P.phone} holdR={<PhoneP s={1.2} screen="#FFF7D0" />} mouth="smile" rim={0.5} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.6} text="«BİRAZDAN GELİR»" y={330} /> },
      // saat saat
      { c: "Birinci saat", sfx: "buzz", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[960, 640]}><Kabin t={t} floor="--" dark={0.7} /><TFig x={960} y={990} s={0.9} o={{ ...DAD }} t={t} pose={P.shrug} mouth="frown" brow="worried" /></TCam>,
        html: (t, a) => <><Damga t={t} at={a + 0.1} text="1. SAAT" y={330} c="#F6C445" rot={-4} /><VT t={t} at={a + 1} text="ASANSÖR DURDU" y={1040} size={76} /></> },
      { c: "On beşinci", sfx: "pop", tone: "night", r: (t, a, b) => { const k = ramp(t, a, b); const x = lerp(760, 1000, k); return <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 620]}>{merdiven(t)}<TFig x={x} y={lerp(880, 700, k)} s={0.75} o={TEYZE} t={t} pose={P.hold} mouth="o" brow="worried" sweat /></TCam>; },
        html: (t, a) => <Sayi t={t} at={a + 0.1} to={15} dur={0.8} unit="KATTAKİ TEYZE" y={880} c="#F6C445" /> },
      { c: "İkinci saat", sfx: "splash", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 520]}><Musluk t={t} flow={1 - ramp(t, a + 0.7, a + 1.5)} /></TCam>,
        html: (t, a) => <><Damga t={t} at={a + 0.1} text="2. SAAT" y={330} c="#F6C445" rot={4} /><VT t={t} at={a + 1.2} text="MUSLUK KURUDU" y={1040} size={76} /></> },
      { c: "Çünkü yüksek", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.1]} c0={[1000, 560]}><Pompa t={t} k={1 - ramp(t, a + 1.8, a + 2.6)} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.2} text="ELEKTRİKLİ POMPA" y={330} c="#2EE6D0" /> },
      { c: "Dördüncü saat", sfx: "drone", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[960, 640]}><rect width={1920} height={1080} fill="#2A2F36" /><rect y={940} width={1920} height={140} fill="#3A3F46" /><Buzdolabi x={960} y={940} s={1.8} />{[0, 1, 2].map((i) => <circle key={i} cx={900 + i * 60} cy={950 + ((t * 120 + i * 40) % 100)} r={8} fill="#5FB6E8" />)}</TCam>,
        html: (t, a) => <><Damga t={t} at={a + 0.1} text="4. SAAT" y={330} c="#F6C445" rot={-4} /><VT t={t} at={a + 1.1} text="BUZDOLABI PES ETTİ" y={1040} size={76} /></> },
      { c: "Kapısı kapalı", sfx: "ding", tone: "cool", bg: "#0E1A2E", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]} c0={[960, 540]}><rect width={1920} height={1080} fill="#0E1A2E" /><Buzdolabi x={960} y={1000} s={1.2} /><Saat y={300} s={0.6} h={4 * ramp(t, a + 0.5, a + 2.6)} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 2.2} text="KAPALI KAPI ≈ 4 SAAT" y={1040} size={76} c="#2EE6D0" /> },
      // telefonlar
      { c: "Sonra telefonlar", sfx: "static", tone: "cool", bg: "#14294A", r: (t, a) => <g><rect width={1920} height={1080} fill="#14294A" /><g transform="translate(960,560)"><PhoneP s={6} screen="#1E3350" /></g>{bars(4 - Math.floor(ramp(t, a + 0.4, a + 1.2) * 2))}</g> },
      { c: "Baz", sfx: "drone", tone: "cool", bg: "#14294A", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.06]} c0={[960, 540]}><Baz t={t} bat={1 - ramp(t, a + 0.4, tCek)} /></TCam>,
        html: (t) => <Damga t={t} at={tCek} text="ÇEKMİYOR ✗" y={330} c="#E0393E" rot={-5} /> },
      // gece ve yıldızlar
      { c: "Gece", sfx: "whoosh", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.1]} c0={[960, 700]} c1={[960, 540]}><GeceSehir t={t} off={1} stars={ramp(t, tYil - 0.3, tYil + 1)} /></TCam>,
        html: (t) => <VT t={t} at={tYil + 0.4} text="YILDIZLAR ✨" y={1040} c="#F6C445" /> },
      { c: "Balkonlar", sfx: "pop", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.6]} c0={[960, 640]}><GeceSehir t={t} off={1} stars={1} balk={ramp(t, a, a + 1.2)} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.3} text="KOMŞULAR KONUŞUYOR" y={330} size={80} /> },
      // sabah
      { c: "Sabah", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 600]}><GeceSehir t={t} off={1 - ramp(t, a + 0.8, a + 1.6)} /><rect width={1920} height={1080} fill="#FFD27A" opacity={0.25 * ramp(t, a, b)} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 1} text="ELEKTRİK GELDİ" y={330} c="#F6C445" rot={-4} /> },
      { c: "Herkes telefonuna", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.5, 1.6]} c0={[960, 660]}><Living t={t} night={false} /><TFig x={960} y={G} s={0.9} o={SEN} t={t} pose={P.phone} holdR={<PhoneP s={1.2} />} mouth="flat" lookY={0.6} /></TCam> },
      { c: "Ama o geceyi", sfx: "whoosh", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.45]} c0={[960, 500]}><GeceSehir t={t} off={1} stars={1} balk={1} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.9} text="KİMSE UNUTMUYOR" y={1040} c="#F6C445" /> },
      // döngü
      { c: "Sen o gece", sfx: "whoosh", tone: "night", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 560]}><GeceSehir t={t} off={0.7} stars={0.8} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="SEN NE YAPARDIN?" y={330} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={520} size={80} /></> },
    ];
    return S;
  },
});
