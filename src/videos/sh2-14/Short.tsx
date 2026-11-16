import words from "../../../public/data/sh2-14-words.json";
import { CarP, NightRoad, TCam, lerp } from "../../components/Toon";
import { Dalga, Sis, TrafikIsik } from "../../components/K2Dikey3";
import { ramp } from "../../lib/cues";
import { Damga, makeShort2, Sh, VT, W } from "../k2s-common/Vert";

// القناة 2 · شورت #14 · «Dur Işığı Neden Kırmızı? Mavi Olsa Ne Olurdu?» (النوع د)
// السكربت والمصادر: السكربتات/sh2-14-kirmizi.txt (Rayleigh: الأزرق بيتشتّت أكتر، الأحمر أطول موجة مرئية)

const RED = "#FF3B30", BLUE = "#2F7FFF", GRN = "#34C759", TQ = "#2EE6D0";
const sokak = (t: number, on: "r" | "y" | "g" | "b" = "r", fog = 0, glow = 1) => <g><NightRoad t={t} /><TrafikIsik x={960} y={330} s={0.75} on={on} glow={glow} /><CarP x={960} y={900} s={1.3} t={0} lights={1} />{fog > 0 && <Sis t={t} k={fog} />}</g>;
// parçacıklar arasından geçen dalga: scatter → mavi saçılır
const Sacilma = ({ t, c, sc }: { t: number; c: string; sc: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#0E1A2E" />
    {Array.from({ length: 40 }, (_, i) => <circle key={i} cx={680 + (i * 131) % 560} cy={300 + (i * 97) % 500} r={10} fill="#C9D6DE" opacity={0.5} />)}
    <Dalga t={t} y={540} lam={c === RED ? 200 : 90} c={c} amp={30} />
    {sc > 0 && Array.from({ length: 12 }, (_, i) => { const ang = (i / 12) * Math.PI * 2, o = (t * 0.9 + i / 12) % 1; const x = 700 + (i * 53) % 500, y = 540; return <path key={i} d={`M${x + Math.cos(ang) * o * 40},${y + Math.sin(ang) * o * 40} l${Math.cos(ang) * 120},${Math.sin(ang) * 120}`} stroke={c} strokeWidth={8} strokeLinecap="round" opacity={sc * (1 - o)} />; })}
  </g>
);
const Beyin = ({ t, k = 1 }: { t: number; k?: number }) => (
  <g transform={`translate(960,560) scale(${1 + 0.03 * Math.sin(t * 4)})`} opacity={k}>
    <ellipse rx={320} ry={280} fill={RED} opacity={0.15 + 0.1 * Math.sin(t * 4)} />
    <path d="M-200,40 C-230,-80 -120,-190 0,-180 C120,-200 230,-100 210,20 C230,110 140,170 40,160 C-40,190 -180,150 -200,40Z" fill="#F29BB4" />
    <path d="M-150,-40 q40,-40 80,0 q40,40 80,0 q40,-40 80,0 M-150,40 q40,-40 80,0 q40,40 80,0 q40,-40 80,0 M0,-180 V150" stroke="#D5728F" strokeWidth={10} fill="none" />
  </g>
);
const Gok = ({ t }: { t: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#4FA3FF" />
    <circle cx={1150} cy={240} r={90} fill="#FFE27A" /><circle cx={1150} cy={240} r={150} fill="#FFE27A" opacity={0.25} />
    {Array.from({ length: 24 }, (_, i) => { const o = (t * 0.6 + i / 24) % 1; const ang = (i / 24) * Math.PI * 2; return <circle key={i} cx={960 + Math.cos(ang) * o * 400} cy={600 + Math.sin(ang) * o * 400} r={10} fill="#BFE3FF" opacity={1 - o} />; })}
    <path d="M0,900 Q480,820 960,880 T1920,860 V1080 H0Z" fill="#3FAE6A" />
  </g>
);
const Ikon = ({ t, a }: { t: number; a: number }) => (
  <g>
    <rect width={1920} height={1080} fill="#2A0E0E" />
    <g transform={`translate(960,250) scale(${ramp(t, a, a + 0.25)})`}><path d="M0,-110 C60,-20 90,30 90,70 A90,90 0 0 1 -90,70 C-90,30 -60,-20 0,-110Z" fill={RED} /></g>
    <g transform={`translate(960,540) scale(${ramp(t, a + 0.4, a + 0.65)})`}><path d={`M0,-120 C${60 + Math.sin(t * 9) * 10},-40 100,0 90,60 A90,90 0 0 1 -90,60 C-100,0 -40,-40 0,-120Z`} fill="#F28C28" /><path d="M0,-40 C30,0 50,30 40,70 A40,40 0 0 1 -40,70 C-50,30 -20,0 0,-40Z" fill="#FFE27A" /></g>
    <g transform={`translate(960,830) scale(${ramp(t, a + 0.8, a + 1.05)})`}><path d="M0,-110 L120,100 H-120Z" fill="#F6C445" stroke={RED} strokeWidth={14} strokeLinejoin="round" /><text y={80} textAnchor="middle" fontFamily="Poppins" fontWeight={900} fontSize={140} fill="#2A0E0E">!</text></g>
  </g>
);

export const { SECONDS: SH2_14_SECONDS, Comp: Sh2Short14 } = makeShort2({
  words: words as W[],
  audio: "sh2-14",
  hook: "DUR IŞIĞI NEDEN KIRMIZI?",
  hookUntil: 2.4,
  build: (cue) => {
    const tYor = cue("Yorumlara");
    const S: Sh[] = [
      { c: "Trafik", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.3, 1.1]} c0={[960, 400]} c1={[960, 560]}>{sokak(t)}</TCam> },
      { c: "Neden mavi", sfx: "pop", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.6, 1.7]} c0={[960, 330]}>{sokak(t, "b")}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.2} text="NEDEN MAVİ DEĞİL?" y={1040} size={84} /> },
      { c: "Çünkü ışık", sfx: "whoosh", tone: "cool", bg: "#0E1A2E", r: (t) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Dalga t={t} y={560} lam={150} c="#FFFFFF" amp={60} /></g>,
        html: (t, a) => <VT t={t} at={a + 0.4} text="IŞIK = DALGA" y={330} c={TQ} size={110} /> },
      { c: "Ve her", sfx: "pop", tone: "cool", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><g opacity={ramp(t, a, a + 0.3)}><Dalga t={t} y={380} lam={220} c={RED} label="KIRMIZI" /></g><g opacity={ramp(t, a + 0.4, a + 0.7)}><Dalga t={t} y={620} lam={150} c={GRN} label="YEŞİL" /></g><g opacity={ramp(t, a + 0.8, a + 1.1)}><Dalga t={t} y={860} lam={90} c={BLUE} label="MAVİ" /></g></g> },
      { c: "Kırmızı, gözümüzün", sfx: "ding", tone: "warm", bg: "#0E1A2E", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 560]}><rect width={1920} height={1080} fill="#0E1A2E" /><Dalga t={t} y={560} lam={240} c={RED} amp={80} /><path d="M700,700 H940 M940,680 V720 M700,680 V720" stroke="#FFFFFF" strokeWidth={6} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.2} text="EN UZUN DALGA" y={330} c={RED} /> },
      { c: "Uzun dalga", sfx: "whoosh", tone: "warm", r: (t) => <Sacilma t={t} c={RED} sc={0} />,
        html: (t, a) => <VT t={t} at={a + 1} text="AZ SAÇILIR →" y={330} c="#F6C445" /> },
      { c: "Sis", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.35]} c0={[960, 400]}>{sokak(t, "r", ramp(t, a, a + 1))}<circle cx={960} cy={180} r={200} fill={RED} opacity={0.25} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 1.8} text="KIRMIZI GEÇER ✓" y={1040} c={RED} size={84} /> },
      { c: "Yani kırmızı", sfx: "pop", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[0.95, 0.8]} c0={[960, 420]}>{sokak(t, "r", 0.6)}<circle cx={960} cy={180} r={260} fill={RED} opacity={0.2} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.8} text="EN UZAKTAN GÖRÜLEN" y={330} size={84} /> },
      { c: "Mavi ise", sfx: "whoosh", tone: "cool", r: (t, a) => <Sacilma t={t} c={BLUE} sc={ramp(t, a + 0.5, a + 1)} />,
        html: (t, a) => <VT t={t} at={a + 0.3} text="MAVİ: TAM TERSİ" y={330} c={BLUE} /> },
      { c: "Havada en", sfx: "pop", tone: "cool", r: (t) => <Sacilma t={t} c={BLUE} sc={1} />,
        html: (t, a) => <Damga t={t} at={a + 0.5} text="EN ÇOK SAÇILAN" y={1040} c={BLUE} rot={-4} /> },
      { c: "Gökyüzünün", sfx: "ding", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.05, 1.15]} c0={[960, 520]}><Gok t={t} /></TCam>,
        html: (t, a) => <VT t={t} at={a + 0.9} text="GÖK MAVİ, ÇÜNKÜ..." y={330} c="#FFFFFF" /> },
      { c: "Mavi bir", sfx: "drone", tone: "cool", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.4, 1.5]} c0={[960, 360]}>{sokak(t, "b", lerp(0.3, 1.2, ramp(t, a + 0.5, b)), 0.2)}</TCam>,
        html: (t, a) => <Damga t={t} at={a + 2} text="KAYBOLURDU" y={1040} c={BLUE} rot={-5} /> },
      { c: "Bir de", sfx: "whoosh", tone: "warm", bg: "#1A0E1E", r: (t) => <g><rect width={1920} height={1080} fill="#1A0E1E" /><Beyin t={t} /></g>,
        html: (t, a) => <VT t={t} at={a + 0.3} text="BİR DE BEYİN 🧠" y={330} /> },
      { c: "Kan", sfx: "boom", tone: "warm", r: (t, a) => <Ikon t={t} a={a} /> },
      { c: "Kırmızı bize", sfx: "boom", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.8, 2.2]} c0={[960, 180]}>{sokak(t)}</TCam>,
        html: (t, a) => <Damga t={t} at={a + 1.6} text="DUR!" y={1040} c={RED} rot={-6} size={180} /> },
      { c: "Yani dur", sfx: "ding", tone: "gold", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.2, 1.3]} c0={[960, 440]}>{sokak(t)}</TCam>,
        html: (t, a) => <VT t={t} at={a + 0.6} text="TESADÜF DEĞİL" y={1040} c="#F6C445" /> },
      { c: "Fizik", sfx: "boom", tone: "gold", bg: "#0E1A2E", r: (t, a) => <g><rect width={1920} height={1080} fill="#0E1A2E" /><Dalga t={t} y={300} lam={200} c={RED} amp={40} /><g transform="translate(0,260) scale(1)"><g transform="translate(960,380) scale(0.7) translate(-960,-560)"><Beyin t={t} k={ramp(t, a + 0.4, a + 0.8)} /></g></g></g>,
        html: (t, a) => <Damga t={t} at={a + 1.3} text="AYNI RENK ✓" y={1060} c={RED} rot={-4} /> },
      { c: "Sence", sfx: "whoosh", tone: "warm", r: (t, a, b) => <TCam t={t} a={a} b={b} z={[1.1, 1.2]} c0={[960, 520]}>{sokak(t)}</TCam>,
        html: (t, a) => <><VT t={t} at={a + 0.2} text="EN GEREKSİZ IŞIK NEREDE?" y={1040} size={70} /><VT t={t} at={tYor} text="YORUMLARA YAZ ↓" y={330} size={80} /></> },
    ];
    return S;
  },
});
