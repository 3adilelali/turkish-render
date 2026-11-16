import words from "../../../public/data/sh2-18-words.json";
import { HERO, Outfit, P, TCam, TFig, lerp } from "../../components/Toon";
import { Kefal, VanGolu } from "../../components/K2Dikey3";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #18 · «Van Gölü'ne Girsen Ne Hissederdin?» (النوع أ)
// السكربت والمصادر: السكربتات/sh2-18-van.txt (أكبر بحيرة صودا بالعالم، pH ≈ 9.8، ما بتجمد، inci kefali)

const SEN: Outfit = { ...HERO, kind: "hoodie", top: "#F28C28", top2: "#C76A12" };
const TQ = "#2EE6D0";
const golde = (t: number, f: Partial<React.ComponentProps<typeof TFig>> = {}, depth = 760) => <g><TFig x={960} y={depth + 200} s={0.7} o={SEN} t={t} seed={2} {...f} /><rect y={depth} width={1920} height={1080 - depth} fill="#1E7FB8" opacity={0.75} /><path d={`M640,${depth} q40,${Math.sin(t * 3) * 10} 80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0 t80,0`} stroke="#FFFFFF" strokeWidth={5} fill="none" opacity={0.6} /></g>;
const Olcek = ({ t, k }: { t: number; k: number }) => {
  const cols = ["#E0393E", "#F28C28", "#F6C445", "#B5D334", "#3FAE6A", "#2EC4D0", "#2F7FFF", "#5E42A8"];
  const x = lerp(700, 1220, k * 9.8 / 14);
  return <g>
    <rect width={1920} height={1080} fill="#0E1A2E" />
    {cols.map((c, i) => <rect key={i} x={700 + i * 65} y={500} width={65} height={90} fill={c} />)}
    {[0, 7, 14].map((v) => <text key={v} x={700 + v / 14 * 520} y={650} textAnchor="middle" fontFamily="Poppins" fontWeight={800} fontSize={36} fill="#FFFFFF">{v}</text>)}
    <text x={720} y={470} fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#E0393E">ASİT</text><text x={1200} y={470} textAnchor="end" fontFamily="Poppins" fontWeight={800} fontSize={30} fill="#9A8AF2">BAZ</text>
    <path d={`M${x},${700 + Math.sin(t * 6) * 4} l-30,50 h60Z`} fill="#FFFFFF" />
  </g>;
};
const Ip = ({ t }: { t: number }) => (
  <g>
    <VanGolu t={t} foam={0.6} />
    <path d="M660,300 Q960,360 1260,300" stroke="#5E4E40" strokeWidth={5} fill="none" />
    {["#E0393E", "#3A7BD5", "#F6C445", "#FFFFFF"].map((c, i) => <g key={i} transform={`translate(${740 + i * 140},${330 + Math.sin(i) * 6}) rotate(${Math.sin(t * 3 + i) * 5})`}><path d="M-50,0 L50,0 L60,30 L40,34 L40,120 L-40,120 L-40,34 L-60,30Z" fill={c} stroke="#2A2E36" strokeWidth={4} /></g>)}
    {Array.from({ length: 12 }, (_, i) => <circle key={i} cx={700 + (i * 53) % 520} cy={500 - ((t * 60 + i * 30) % 200)} r={8 + (i % 3) * 4} fill="#FFFFFF" opacity={0.7} />)}
  </g>
);
const Dip = ({ t, fish = 0, crowd = 0 }: { t: number; fish?: number; crowd?: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#0E3A5C" />
    {Array.from({ length: 8 }, (_, i) => <path key={i} d={`M${640 + i * 90},0 l${-40 + i * 6},1080`} stroke="#2EC4D0" strokeWidth={30} opacity={0.06} />)}
    {Array.from({ length: 16 }, (_, i) => <circle key={i} cx={680 + (i * 61) % 560} cy={1080 - ((t * 50 + i * 70) % 1080)} r={4 + (i % 3) * 2} fill="#FFFFFF" opacity={0.4} />)}
    <path d="M0,1000 Q480,960 960,990 T1920,980 V1080 H0Z" fill="#3A5A4A" />
    {fish > 0 && <g opacity={fish}><Kefal x={960 + Math.sin(t * 1.2) * 120} y={540 + Math.sin(t * 2) * 30} s={2.2} rot={0} t={t} /></g>}
    {crowd > 0 && Array.from({ length: 9 }, (_, i) => <g key={i} opacity={crowd}><Kefal x={((t * 90 + i * 140) % 760) + 600} y={300 + (i % 4) * 160} s={1} t={t + i} /></g>)}
  </g>
);
const Nehir = ({ t }: { t: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#BFE3B0" />
    <path d="M1300,0 L1100,0 Q900,500 700,1080 L1000,1080 Q1150,500 1300,0Z" fill="#4FA3FF" />
    {Array.from({ length: 6 }, (_, i) => <path key={i} d={`M${1000 - i * 30},${200 + i * 140} l-40,60`} stroke="#FFFFFF" strokeWidth={5} opacity={0.5} />)}
    {[0, 1, 2, 3].map((i) => { const o = (t * 0.6 + i / 4) % 1; const x = lerp(860, 1180, o), y = lerp(960, 120, o) - Math.sin((o * 6) % 1 * Math.PI) * 60; return <Kefal key={i} x={x} y={y} s={0.9} rot={-60} t={t} />; })}
  </g>
);

export const { SECONDS: SH2_18_SECONDS, Comp: Sh2Short18 } = makeShort2({
  words: words as W[],
  audio: "sh2-18",
  hook: "VAN GÖLÜ'NE GİRSEN?",
  hookUntil: 2.6,
  build: (cue) => {
    const tYor = cue("Yorumlara");
    const S: Sh[] = [
      { c: "Van", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.5]} c0={[960, 600]}><VanGolu t={t} />{golde(t, { pose: P.hips, mouth: "grin" })}</TCam> },
      { c: "Türkiye'nin", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[0.95, 0.9]} c0={[960, 540]}><VanGolu t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="TÜRKİYE'NİN EN BÜYÜK GÖLÜ" y={330} size={68} /> },
      { c: "Ama içine", sfx: "splash", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2]} c0={[960, 640]}><VanGolu t={t} />{golde(t, { eyes: "wide", brow: "up", mouth: "o" }, lerp(860, 720, ramp(t, a, a + 1)))}</TCam> },
      { c: "Su kaygan", sfx: "pop", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[2, 2.2]} c0={[960, 640]}><VanGolu t={t} foam={0.5} />{golde(t, { pose: P.hold, eyes: "squint", mouth: "flat" }, 720)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.2} text="KAYGAN 🫧" y={330} /> },
      { c: "Sanki", sfx: "pop", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 620]}><VanGolu t={t} foam={1} />{golde(t, { pose: P.shrug, eyes: "wide", mouth: "o" }, 720)}</TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.3} text="SABUNLU?!" y={1040} c="#F6C445" rot={-5} /> },
      { c: "Çünkü Van", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 560]}><VanGolu t={t} foam={0.6} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.8} text="DÜNYANIN EN BÜYÜK" y={330} size={80} /><Damga t={t} at={a + 1.8} text="SODALI GÖLÜ" y={1040} c={TQ} rot={-4} /></> },
      { c: "Suyu bazik", sfx: "whoosh", tone: "cool", bg: "#0E1A2E", r: (t, a) => <Olcek t={t} k={ramp(t, a + 0.4, a + 1.6)} />,
        html: (t, a) => <VT t={t} at={a + 0.2} text="BAZİK SU" y={330} c="#9A8AF2" /> },
      { c: "pH", sfx: "ding", tone: "cool", bg: "#0E1A2E", r: (t) => <Olcek t={t} k={1} />,
        html: (t, a) => <VT t={t} at={a + 0.3} text="pH 9,8" y={1040} c="#F6C445" size={140} /> },
      { c: "Eskiden", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 440]}><Ip t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.2} text="SABUNSUZ ÇAMAŞIR 👕" y={1040} size={76} /> },
      { c: "Ve bir", sfx: "whoosh", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[960, 540]}><VanGolu t={t} snow={ramp(t, a, a + 1)} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.2} text="VE BİR ŞEY DAHA..." y={330} size={84} /> },
      { c: "Bu göl", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.4]} c0={[960, 620]}><VanGolu t={t} snow={1} /></TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.6} text="SERT KIŞ ❄️" y={330} /><Damga t={t} at={a + 1.8} text="AMA DONMAZ" y={1040} c={TQ} rot={-5} /></> },
      { c: "Tuz ve", sfx: "pop", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 640]}><VanGolu t={t} snow={1} foam={0.6} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.2} text="TUZ + SODA" y={330} c="#F6C445" size={120} /> },
      { c: "Peki bu", sfx: "whoosh", tone: "cool", bg: "#0E3A5C", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.15]} c0={[960, 540]}><Dip t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="BU SUDA KİM YAŞAR?" y={330} size={84} /> },
      { c: "Neredeyse", sfx: "drone", tone: "cool", bg: "#0E3A5C", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.15, 1.25]} c0={[960, 540]}><Dip t={t} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.2} text="NEREDEYSE KİMSE" y={1040} c="#F6C445" rot={-4} size={86} /> },
      { c: "Sadece bir", sfx: "pop", tone: "cool", bg: "#0E3A5C", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 540]}><Dip t={t} fish={ramp(t, a + 0.4, a + 1)} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.6} text="SADECE 1 BALIK 🐟" y={330} /> },
      { c: "İnci", sfx: "ding", tone: "gold", bg: "#0E3A5C", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.8]} c0={[960, 540]}><Dip t={t} fish={1} /></TCam>,
        html: (t, a) => <VT t={t} at={a} text="İNCİ KEFALİ" y={330} c={TQ} size={120} /> },
      { c: "Her bahar", sfx: "splash", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1, 1.1]} c0={[1000, 540]}><Nehir t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.4} text="AKINTIYA KARŞI ⬆" y={330} size={84} /> },
      { c: "Yumurtlamak", sfx: "splash", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.4]} c0={[1000, 520]}><Nehir t={t * 1.3} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 0.6} text="TATLI SUYA GÖÇ" y={1040} c="#F6C445" rot={-4} /> },
      { c: "Yani Van", sfx: "boom", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 0.95]} c0={[960, 540]}><VanGolu t={t} /><Kefal x={lerp(700, 1220, ramp(t, a, b))} y={760 - Math.sin(ramp(t, a, b) * Math.PI) * 220} s={1.2} rot={-20} t={t} /></TCam>,
        html: (t, a) => <Damga t={t} at={a + 2} text="BENZERİ YOK 🌍" y={330} c={TQ} rot={-4} /> },
      { c: "Sen Van", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 620]}><VanGolu t={t} foam={0.4} />{golde(t, { pose: P.cheer, eyes: "happy", mouth: "grin" }, 760)}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="VAN GÖLÜ'NE GİRDİN Mİ?" y={330} size={76} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={1040} size={80} /></> },
    ];
    return S;
  },
});
